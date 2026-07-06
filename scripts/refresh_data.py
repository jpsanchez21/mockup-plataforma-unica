"""Regenera los JSON estaticos que sirve nginx (/var/www/sandbox/data) con datos
reales de SKH_DB y del Data Lake operacional, usando el conector ya autorizado en
/home/jpsanchez/00 conexiones. Pensado para correr por cron en el servidor (cada
2 min). Para telemetria de intervenciones ya cerradas ver refresh_history.py.

Mapeo de columnas parquet -> DataPoint del frontend (best-effort por nombre,
ajustar aqui si un experto de dominio confirma otra columna):
    depth     -> profundidad_sarta
    blockPos  -> bloque_pos
    blockVel  -> bloque_vel
    hookload  -> carga_gancho
    torqHid   -> llave_hid_torque
    torqPot   -> llave_pot_torque
    flow      -> bbl_por_min
    pump      -> presion
    torque    -> torque_escal
    wob       -> peso_sobre_broca
    spm       -> strokes_por_min
    tubes     -> contador_tubos
"""
from __future__ import annotations

import json
import sys
from datetime import datetime, timedelta, timezone
from pathlib import Path

import pandas as pd

sys.path.insert(0, "/home/jpsanchez/00 conexiones")
from skan_sql_connections import SkanDataConnections  # noqa: E402

OUTPUT_DIR = Path("/var/www/sandbox/data")

TIME_WINDOWS: dict[str, timedelta] = {
    "10m": timedelta(minutes=10),
    "30m": timedelta(minutes=30),
    "1h": timedelta(hours=1),
    "2h": timedelta(hours=2),
    "6h": timedelta(hours=6),
    "12h": timedelta(hours=12),
    "1d": timedelta(days=1),
}

MAX_POINTS_PER_WINDOW = 2000

COLUMN_MAP = {
    "depth": "profundidad_sarta",
    "blockPos": "bloque_pos",
    "blockVel": "bloque_vel",
    "hookload": "carga_gancho",
    "torqHid": "llave_hid_torque",
    "torqPot": "llave_pot_torque",
    "flow": "bbl_por_min",
    "pump": "presion",
    "torque": "torque_escal",
    "wob": "peso_sobre_broca",
    "spm": "strokes_por_min",
    "tubes": "contador_tubos",
}


def _downsample(frame: pd.DataFrame, max_points: int) -> pd.DataFrame:
    if len(frame) <= max_points:
        return frame
    step = len(frame) / max_points
    idx = [int(i * step) for i in range(max_points)]
    return frame.iloc[idx]


def build_windows(frame: pd.DataFrame) -> dict:
    frame = frame.sort_values("tstm")
    frame["ts"] = (frame["tstm"] * 1000).astype("int64")
    now = datetime.now(timezone.utc)

    windows: dict[str, list[dict]] = {}
    for name, delta in TIME_WINDOWS.items():
        cutoff_ms = int((now - delta).timestamp() * 1000)
        sliced = frame[frame["ts"] >= cutoff_ms]
        sliced = _downsample(sliced, MAX_POINTS_PER_WINDOW)

        points = []
        for _, row in sliced.iterrows():
            point = {"ts": int(row["ts"])}
            for out_col, src_col in COLUMN_MAP.items():
                value = row.get(src_col)
                point[out_col] = None if pd.isna(value) else float(value)
            points.append(point)
        windows[name] = points

    all_ts = frame["ts"].tolist()
    meta = {
        "first_ts": int(min(all_ts)) if all_ts else None,
        "last_ts": int(max(all_ts)) if all_ts else None,
        "columns": list(COLUMN_MAP.keys()),
        "generated_at": now.isoformat(),
    }
    return {"meta": meta, "windows": windows}


def _load_day(db: SkanDataConnections, device_id: str, day) -> pd.DataFrame:
    try:
        return db.operational_day_frame(device_id, str(day))
    except Exception:  # noqa: BLE001 - carpeta del dia puede no existir aun
        return pd.DataFrame()


def load_rig_frame(db: SkanDataConnections, device_id: str) -> pd.DataFrame:
    today = datetime.now(timezone.utc).date()
    yesterday = today - timedelta(days=1)
    frame = _load_day(db, device_id, yesterday)
    frame_today = _load_day(db, device_id, today)
    if not frame_today.empty:
        frame = pd.concat([frame, frame_today], ignore_index=True) if not frame.empty else frame_today
    return frame


INTERVENTIONS_QUERY = """
SELECT TOP 500 i.id, ro.rig_label, r.number, r.device_id, r.online, r.utc_offset,
       w.name AS pozo, COALESCE(w.locality,'') AS municipio, COALESCE(w.province,'') AS province,
       it.name AS tipo, i.status, i.date_start, i.date_end
FROM dbo.interventions i
JOIN dbo.rigs r ON r.id = i.id_rig
JOIN dbo.rig_owners ro ON ro.id = r.id_rig_owner
JOIN dbo.wells w ON w.id = i.id_well
LEFT JOIN dbo.intervention_objectives io ON io.id = i.id_intervention_objective
LEFT JOIN dbo.intervention_types it ON it.id = io.id_intervention_type
ORDER BY i.date_start DESC
"""


def to_utc(local_dt, utc_offset) -> datetime | None:
    """dbo.rigs.ping_time y las fechas de interventions vienen en hora local del
    rig (segun rigs.utc_offset), no UTC -- confirmado comparando ping_time real
    contra 'ahora' UTC. Sin esta conversion, anclar la telemetria (que si esta en
    UTC) a estas fechas queda desfasado por utc_offset horas."""
    if pd.isna(local_dt):
        return None
    offset = float(utc_offset) if pd.notna(utc_offset) else 0.0
    return (local_dt - timedelta(hours=offset)).replace(tzinfo=timezone.utc)


def refresh_interventions(db: SkanDataConnections, output_dir: Path) -> None:
    rows = db.sql_query(INTERVENTIONS_QUERY, database="SKH_DB")
    interventions = [
        {
            "id": int(row["id"]),
            "torre": f"{row['rig_label']}-{row['number']}",
            "device_id": row["device_id"],
            "municipio": row["municipio"],
            "province": row["province"],
            "pozo": row["pozo"],
            "intervencion": row["tipo"] if pd.notna(row["tipo"]) else None,
            "status": row["status"],
            "online": bool(row["online"]) if pd.notna(row["online"]) else False,
            "inicio": row["date_start"].strftime("%d/%m/%Y") if pd.notna(row["date_start"]) else None,
            "fin": row["date_end"].strftime("%d/%m/%Y") if pd.notna(row["date_end"]) else None,
            "date_start": (lambda d: d.isoformat() if d else None)(to_utc(row["date_start"], row["utc_offset"])),
            "date_end": (lambda d: d.isoformat() if d else None)(to_utc(row["date_end"], row["utc_offset"])),
        }
        for _, row in rows.iterrows()
    ]
    (output_dir / "interventions.json").write_text(json.dumps(interventions))
    print(f"interventions.json: {len(interventions)} filas")


def main() -> int:
    OUTPUT_DIR.mkdir(parents=True, exist_ok=True)
    db = SkanDataConnections()

    refresh_interventions(db, OUTPUT_DIR)

    rigs = db.sql_query(
        "SELECT device_id, number, online, ping_time FROM dbo.rigs ORDER BY online DESC, ping_time DESC",
        database="SKH_DB",
    )

    rigs_meta = [
        {
            "device_id": row["device_id"],
            "number": row["number"],
            "online": bool(row["online"]) if pd.notna(row["online"]) else False,
            "ping_time": row["ping_time"].isoformat() if pd.notna(row["ping_time"]) else None,
        }
        for _, row in rigs.iterrows()
    ]
    (OUTPUT_DIR / "rigs_meta.json").write_text(json.dumps(rigs_meta))

    online_rigs = [r["device_id"] for r in rigs_meta if r["online"]]
    for device_id in online_rigs:
        out_path = OUTPUT_DIR / f"{device_id}.json"
        try:
            frame = load_rig_frame(db, device_id)
            if frame.empty:
                print(f"skip {device_id}: sin datos operacionales recientes")
                continue
            payload = build_windows(frame)
            out_path.write_text(json.dumps(payload))
            print(f"ok {device_id}: {len(frame)} filas")
        except Exception as exc:  # noqa: BLE001
            print(f"error {device_id}: {type(exc).__name__}: {exc}")

    return 0


if __name__ == "__main__":
    raise SystemExit(main())
