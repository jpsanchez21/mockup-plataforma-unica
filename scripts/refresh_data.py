"""Regenera los JSON estaticos que sirve nginx (/var/www/sandbox/data) con datos
reales de SKH_DB y del Data Lake operacional, usando el conector ya autorizado en
/home/jpsanchez/00 conexiones. Pensado para correr por cron en el servidor (cada
2 min). Para telemetria de intervenciones ya cerradas ver refresh_history.py.

Para un rig con intervencion ACTIVA, la telemetria se trae desde la fecha real de
inicio de esa intervencion hasta hoy (no una ventana fija) -- generico para
cualquier intervencion, presente o futura. Los dias ya cerrados se cachean en
parquet (ver CACHE_DIR) para no volver a golpear el Data Lake por ellos nunca
mas; "hoy" siempre se re-consulta porque sigue escribiendose.

Mapeo de columnas parquet -> DataPoint del frontend (best-effort por nombre,
ajustar aqui si un experto de dominio confirma otra columna):
    depth         -> profundidad_sarta
    blockPos      -> bloque_pos
    blockVel      -> bloque_vel
    hookload      -> carga_gancho
    torqHid       -> llave_hid_torque
    torqPot       -> llave_pot_torque
    flow          -> bbl_por_min
    pump          -> presion
    torque        -> torque_escal
    wob           -> peso_sobre_broca
    spm           -> strokes_por_min
    tubes         -> contador_tubos
    rpm           -> rpm
    toneladaMilla -> tonelada_milla_actual
    h2s           -> h2s_sensor_1
    lel           -> lel_sensor_1
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
CACHE_DIR = Path(__file__).resolve().parent.parent / ".cache" / "operational"
NEW_DAY_FETCH_BUDGET = 20  # tope de dias NUEVOS (sin cache, sin contar "hoy") por corrida de cron

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
    "rpm": "rpm",
    "toneladaMilla": "tonelada_milla_actual",
    "h2s": "h2s_sensor_1",
    "lel": "lel_sensor_1",
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
    generated_at = datetime.now(timezone.utc)

    all_ts = frame["ts"].tolist()
    last_ts = max(all_ts) if all_ts else None
    # Anclar las ventanas al ultimo dato REAL disponible, no al reloj actual: el
    # Data Lake puede tener rezago de varias horas, y si ancoramos en "ahora" las
    # ventanas cortas (10m/30m/1h/2h) quedan vacias aunque haya datos recientes.
    anchor_ms = last_ts if last_ts is not None else int(generated_at.timestamp() * 1000)

    windows: dict[str, list[dict]] = {}
    for name, delta in TIME_WINDOWS.items():
        cutoff_ms = anchor_ms - int(delta.total_seconds() * 1000)
        sliced = frame[(frame["ts"] >= cutoff_ms) & (frame["ts"] <= anchor_ms)]
        sliced = _downsample(sliced, MAX_POINTS_PER_WINDOW)

        points = []
        for _, row in sliced.iterrows():
            point = {"ts": int(row["ts"])}
            for out_col, src_col in COLUMN_MAP.items():
                value = row.get(src_col)
                point[out_col] = None if pd.isna(value) else float(value)
            points.append(point)
        windows[name] = points

    meta = {
        "first_ts": int(min(all_ts)) if all_ts else None,
        "last_ts": int(last_ts) if last_ts is not None else None,
        "columns": list(COLUMN_MAP.keys()),
        "generated_at": generated_at.isoformat(),
    }
    return {"meta": meta, "windows": windows}


def _load_day(db: SkanDataConnections, device_id: str, day) -> pd.DataFrame:
    try:
        return db.operational_day_frame(device_id, str(day))
    except Exception:  # noqa: BLE001 - carpeta del dia puede no existir aun
        return pd.DataFrame()


def load_day_cached(db: SkanDataConnections, device_id: str, day, today, budget: dict) -> pd.DataFrame:
    """Cachea en parquet los dias ya cerrados (day < today) -- un dia cerrado
    nunca cambia en el Data Lake, asi que se consulta una sola vez y se reusa
    para siempre (por cualquier intervencion, activa o historica, sobre ese
    mismo rig/fecha). 'hoy' siempre se re-consulta porque el dia sigue
    escribiendose. `budget['remaining']` limita cuantos dias NUEVOS (sin cache)
    se piden al Data Lake en esta corrida, para no saturarlo de golpe."""
    CACHE_DIR.mkdir(parents=True, exist_ok=True)
    path = CACHE_DIR / f"{device_id}__{day}.parquet"
    if day < today and path.exists():
        try:
            return pd.read_parquet(path)
        except Exception:  # noqa: BLE001 - cache corrupto, recargar de la fuente
            pass
    if day < today and budget["remaining"] <= 0:
        return pd.DataFrame()  # backlog: se completa en una corrida siguiente
    frame = _load_day(db, device_id, day)
    if day < today:
        budget["remaining"] -= 1
        if not frame.empty:
            frame.to_parquet(path)
    return frame


def load_rig_frame(db: SkanDataConnections, device_id: str, since_date, budget: dict) -> pd.DataFrame:
    today = datetime.now(timezone.utc).date()
    since_date = min(since_date, today)
    days = [since_date + timedelta(days=i) for i in range((today - since_date).days + 1)]
    frames = [load_day_cached(db, device_id, d, today, budget) for d in days]
    frames = [f for f in frames if not f.empty]
    if not frames:
        return pd.DataFrame()
    return pd.concat(frames, ignore_index=True)


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


def refresh_interventions(db: SkanDataConnections, output_dir: Path) -> list[dict]:
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
    return interventions


def main() -> int:
    OUTPUT_DIR.mkdir(parents=True, exist_ok=True)
    db = SkanDataConnections()

    interventions = refresh_interventions(db, OUTPUT_DIR)
    active_by_rig = {
        i["device_id"]: i for i in interventions if i["status"] == "ACTIVA" and i["date_start"]
    }

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

    online_rigs = {r["device_id"] for r in rigs_meta if r["online"]}
    target_rigs = online_rigs | set(active_by_rig.keys())

    today = datetime.now(timezone.utc).date()
    budget = {"remaining": NEW_DAY_FETCH_BUDGET}

    for device_id in target_rigs:
        out_path = OUTPUT_DIR / f"{device_id}.json"
        try:
            intervention = active_by_rig.get(device_id)
            # Rig con intervencion activa: traer desde su fecha de inicio real
            # hasta hoy (con cache por dia). Rig solo "online" sin intervencion
            # activa conocida (uso del selector generico de SkanView base): no
            # necesita historia profunda, con ayer+hoy alcanza.
            since_date = (
                datetime.fromisoformat(intervention["date_start"]).date()
                if intervention else today - timedelta(days=1)
            )
            frame = load_rig_frame(db, device_id, since_date, budget)
            if frame.empty:
                print(f"skip {device_id}: sin datos operacionales recientes")
                continue
            payload = build_windows(frame)
            out_path.write_text(json.dumps(payload))
            print(f"ok {device_id}: {len(frame)} filas (desde {since_date})")
        except Exception as exc:  # noqa: BLE001
            print(f"error {device_id}: {type(exc).__name__}: {exc}")

    return 0


if __name__ == "__main__":
    raise SystemExit(main())
