"""Genera telemetria real para intervenciones ya TERMINADAS (rango de fechas fijo
y pasado), una sola vez por intervencion -- el archivo nunca cambia porque la
intervencion ya cerro. Pensado para correr por cron con cadencia lenta (ej. cada
10 min), separado de refresh_data.py (que corre cada 2 min para datos en vivo).

Solo procesa un puñado de intervenciones faltantes por corrida (RATE_LIMIT) para
no saturar el Data Lake ni bloquear el cron; el backlog se llena solo en corridas
sucesivas y luego queda en reposo.
"""
from __future__ import annotations

import json
from datetime import date, timedelta

import pandas as pd

from refresh_data import COLUMN_MAP, INTERVENTIONS_QUERY, OUTPUT_DIR, SkanDataConnections, _downsample, _load_day, to_utc

HISTORY_DIR = OUTPUT_DIR / "history"
MAX_POINTS = 5000
RATE_LIMIT = 5
DAY_MARGIN = 1  # dias extra a cada lado para cubrir el corrimiento de utc_offset


def _date_range(start: date, end: date) -> list[date]:
    days = []
    current = start - timedelta(days=DAY_MARGIN)
    last = end + timedelta(days=DAY_MARGIN)
    while current <= last:
        days.append(current)
        current += timedelta(days=1)
    return days


def build_history_payload(frame: pd.DataFrame, intervention_id: int, device_id: str,
                           date_start: pd.Timestamp, date_end: pd.Timestamp) -> dict:
    frame = frame.sort_values("tstm")
    frame["ts"] = (frame["tstm"] * 1000).astype("int64")

    start_ms = int(date_start.timestamp() * 1000)
    end_ms = int(date_end.timestamp() * 1000)
    sliced = frame[(frame["ts"] >= start_ms) & (frame["ts"] <= end_ms)]
    sliced = _downsample(sliced, MAX_POINTS)

    points = []
    for _, row in sliced.iterrows():
        point = {"ts": int(row["ts"])}
        for out_col, src_col in COLUMN_MAP.items():
            value = row.get(src_col)
            point[out_col] = None if pd.isna(value) else float(value)
        points.append(point)

    meta = {
        "intervention_id": intervention_id,
        "device_id": device_id,
        "date_start": date_start.isoformat(),
        "date_end": date_end.isoformat(),
        "columns": list(COLUMN_MAP.keys()),
        "generated_at": pd.Timestamp.now(tz="UTC").isoformat(),
    }
    return {"meta": meta, "points": points}


def load_range_frame(db: SkanDataConnections, device_id: str, date_start: pd.Timestamp, date_end: pd.Timestamp) -> pd.DataFrame:
    days = _date_range(date_start.date(), date_end.date())
    frames = [_load_day(db, device_id, day) for day in days]
    frames = [f for f in frames if not f.empty]
    if not frames:
        return pd.DataFrame()
    return pd.concat(frames, ignore_index=True)


def main() -> int:
    HISTORY_DIR.mkdir(parents=True, exist_ok=True)
    db = SkanDataConnections()

    rows = db.sql_query(INTERVENTIONS_QUERY, database="SKH_DB")
    terminadas = rows[rows["status"] == "TERMINADA"]

    processed = 0
    for _, row in terminadas.iterrows():
        if processed >= RATE_LIMIT:
            break

        intervention_id = int(row["id"])
        out_path = HISTORY_DIR / f"{intervention_id}.json"
        if out_path.exists():
            continue

        device_id = row["device_id"]
        date_start = to_utc(row["date_start"], row["utc_offset"])
        date_end = to_utc(row["date_end"], row["utc_offset"])
        if date_start is None or date_end is None:
            continue

        try:
            frame = load_range_frame(db, device_id, date_start, date_end)
            if frame.empty:
                print(f"skip intervention {intervention_id} ({device_id}): sin datos operacionales")
                processed += 1
                continue
            payload = build_history_payload(frame, intervention_id, device_id, date_start, date_end)
            out_path.write_text(json.dumps(payload))
            print(f"ok intervention {intervention_id} ({device_id}): {len(payload['points'])} puntos")
        except Exception as exc:  # noqa: BLE001
            print(f"error intervention {intervention_id} ({device_id}): {type(exc).__name__}: {exc}")

        processed += 1

    print(f"procesadas {processed} intervenciones en esta corrida")
    return 0


if __name__ == "__main__":
    raise SystemExit(main())
