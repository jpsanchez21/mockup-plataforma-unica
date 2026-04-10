"""
process_csv.py
Converts the large data.csv into an optimized JSON file for the dashboard.
Strategy: downsample to max ~2000 points for any time window to keep the file reasonable.
Output: public/skanview_data.json (served statically by Vite)
"""
import csv
import json
import os
from datetime import datetime, timedelta

INPUT_CSV = os.path.join(os.path.dirname(__file__), '..', 'data.csv')
OUTPUT_JSON = os.path.join(os.path.dirname(__file__), '..', 'public', 'skanview_data.json')

# Map of JSON key -> CSV column name
COLUMN_MAP = {
    'depth':    'Profundidad [ft]',
    'blockPos': 'Posicion Bloque [ft]',
    'blockVel': 'Velocidad Bloque [ft/min]',
    'hookload': 'Carga Gancho [Klbs]',
    'torqHid':  'Torque Llave Hid. max [lb-ft]',
    'torqPot':  'Torque Llave Pot max [lb-ft]',
    'flow':     'Caudal [bbls/min]',
    'pump':     'Presion Bomba [psi]',
    'torque':   'Torque [lbs-ft]',
    'wob':      'Peso Sobre Broca [Klbs]',
    'spm':      'Strokes por minuto [spm]',
    'tubes':    'Contador Tuberia [Tubos]',
}

def safe_float(val):
    try:
        return round(float(val), 2)
    except (ValueError, TypeError):
        return None

def parse_dt(s):
    for fmt in ('%Y-%m-%d %H:%M:%S', '%Y-%m-%d %H:%M:%S.%f'):
        try:
            return datetime.strptime(s.strip(), fmt)
        except ValueError:
            continue
    return None

print(f"Reading {INPUT_CSV}...")
rows = []
with open(INPUT_CSV, 'r', encoding='utf-8', errors='replace') as f:
    reader = csv.DictReader(f)
    for row in reader:
        ts = parse_dt(row.get('Fecha Hora', ''))
        if ts is None:
            continue
        entry = {'ts': int(ts.timestamp() * 1000)}  # ms epoch
        for key, col in COLUMN_MAP.items():
            entry[key] = safe_float(row.get(col, ''))
        rows.append(entry)

print(f"Parsed {len(rows)} rows")
if not rows:
    print("ERROR: No rows parsed!")
    exit(1)

# Sort by original timestamp sequence
rows.sort(key=lambda r: r['ts'])

# RELATIVE TIME LOGIC:
# Last row = exact current time. 
# Subtract 4000ms for each row going backwards.
import time
now_ms = int(time.time() * 1000)
num_rows = len(rows)

for i in range(num_rows):
    # i goes from 0 to num_rows-1
    # row[num_rows - 1] -> now_ms
    # row[0] -> now_ms - (num_rows - 1) * 4000
    rows[num_rows - 1 - i]['ts'] = now_ms - (i * 4000)

last_ts = rows[-1]['ts']
first_ts = rows[0]['ts']

print(f"Data re-mapped to relative time (Interval: 4s)")
print(f"First: {datetime.fromtimestamp(first_ts/1000).isoformat()}")
print(f"Last:  {datetime.fromtimestamp(last_ts/1000).isoformat()} (NOW)")

# Define time windows (in hours) and max points per window
WINDOWS = {
    '10m':  {'hours': 1/6, 'max_points': 600},
    '30m':  {'hours': 0.5, 'max_points': 1200},
    '1h':   {'hours': 1,   'max_points': 1800},
    '2h':   {'hours': 2,   'max_points': 1800},
    '6h':   {'hours': 6,   'max_points': 1800},
    '12h':  {'hours': 12,  'max_points': 1800},
    '1d':   {'hours': 24,  'max_points': 1800},
}

def downsample(data, max_points):
    """Simple systematic downsampling: pick every N-th point."""
    if len(data) <= max_points:
        return data
    step = len(data) / max_points
    result = []
    i = 0.0
    while i < len(data):
        result.append(data[int(i)])
        i += step
    return result

output = {
    'meta': {
        'first_ts': first_ts,
        'last_ts': last_ts,
        'columns': list(COLUMN_MAP.keys()),
        'generated_at': datetime.now().isoformat(),
    },
    'windows': {}
}

for window_key, cfg in WINDOWS.items():
    cutoff_ts = last_ts - cfg['hours'] * 3600 * 1000
    window_rows = [r for r in rows if r['ts'] >= cutoff_ts]
    sampled = downsample(window_rows, cfg['max_points'])
    output['windows'][window_key] = sampled
    print(f"  {window_key}: {len(window_rows)} raw -> {len(sampled)} sampled")

# Ensure output directory exists
os.makedirs(os.path.dirname(OUTPUT_JSON), exist_ok=True)

print(f"\nWriting {OUTPUT_JSON}...")
with open(OUTPUT_JSON, 'w', encoding='utf-8') as f:
    json.dump(output, f, separators=(',', ':'))

size_mb = os.path.getsize(OUTPUT_JSON) / 1024 / 1024
print(f"Done! Output: {size_mb:.1f} MB")
