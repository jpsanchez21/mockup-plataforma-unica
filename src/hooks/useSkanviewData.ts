// src/hooks/useSkanviewData.ts
import { useState, useEffect, useMemo } from 'react';

export type TimeWindow = '10m' | '30m' | '1h' | '2h' | '6h' | '12h' | '1d';

export interface DataPoint {
  ts: number;   // ms epoch
  depth: number | null;
  blockPos: number | null;
  blockVel: number | null;
  hookload: number | null;
  torqHid: number | null;
  torqPot: number | null;
  flow: number | null;
  pump: number | null;
  torque: number | null;
  wob: number | null;
  spm: number | null;
  tubes: number | null;
  rpm: number | null;
  toneladaMilla: number | null;
  h2s: number | null;
  lel: number | null;
}

interface SkanviewMeta {
  first_ts: number;
  last_ts: number;
  columns: string[];
  generated_at: string;
}

interface SkanviewData {
  meta: SkanviewMeta;
  windows: Record<TimeWindow, DataPoint[]>;
}

interface UseSkanviewDataResult {
  data: DataPoint[];
  latestPoint: DataPoint | null;
  loading: boolean;
  error: string | null;
  meta: SkanviewMeta | null;
}

// El cron del servidor regenera los .json cada 1 min; sin este refresco
// periodico el navegador solo pide el dato una vez al abrir la pagina y se
// queda "congelado" ahi aunque haya datos mas nuevos disponibles. 15s es el
// maximo practico sin sobrecargar de consultas el Data Lake para ~30 rigs.
const AUTO_REFRESH_MS = 15_000;

export function useSkanviewData(activeWindow: TimeWindow, deviceId: string): UseSkanviewDataResult {
  const [raw, setRaw] = useState<SkanviewData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!deviceId) return;

    let cancelled = false;
    const load = (isFirstLoad: boolean) => {
      if (isFirstLoad) setLoading(true);
      fetch(`/data/${deviceId}.json`)
        .then(res => {
          if (!res.ok) throw new Error(`HTTP ${res.status}`);
          return res.json() as Promise<SkanviewData>;
        })
        .then(d => {
          if (cancelled) return;
          setRaw(d);
          setError(null);
          setLoading(false);
        })
        .catch(e => {
          if (cancelled) return;
          setError(e.message || 'Error cargando datos');
          setLoading(false);
        });
    };

    load(true);
    const interval = setInterval(() => load(false), AUTO_REFRESH_MS);
    return () => {
      cancelled = true;
      clearInterval(interval);
    };
  }, [deviceId]);

  const data = useMemo<DataPoint[]>(() => {
    if (!raw) return [];
    return raw.windows[activeWindow] ?? [];
  }, [raw, activeWindow]);

  const latestPoint = useMemo<DataPoint | null>(() => {
    if (!raw || !raw.windows['2h'] || raw.windows['2h'].length === 0) return null;
    const arr = raw.windows['2h'];
    return arr[arr.length - 1];
  }, [raw]);

  return {
    data,
    latestPoint,
    loading,
    error,
    meta: raw?.meta ?? null,
  };
}

export interface RigMeta {
  device_id: string;
  number: number | string;
  online: boolean;
  ping_time: string | null;
}

export function useRigsMeta(): { rigs: RigMeta[]; loading: boolean } {
  const [rigs, setRigs] = useState<RigMeta[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const load = () => {
      fetch('/data/rigs_meta.json')
        .then(res => {
          if (!res.ok) throw new Error(`HTTP ${res.status}`);
          return res.json() as Promise<RigMeta[]>;
        })
        .then(d => {
          setRigs(d);
          setLoading(false);
        })
        .catch(() => setLoading(false));
    };
    load();
    const interval = setInterval(load, AUTO_REFRESH_MS);
    return () => clearInterval(interval);
  }, []);

  return { rigs, loading };
}

export interface InterventionRow {
  id: number;
  torre: string;
  device_id: string;
  municipio: string;
  province: string;
  pozo: string;
  intervencion: string | null;
  status: 'ACTIVA' | 'TERMINADA';
  online: boolean;
  inicio: string | null;
  fin: string | null;
  date_start: string | null;
  date_end: string | null;
}

export function useInterventions(): { interventions: InterventionRow[]; loading: boolean } {
  const [interventions, setInterventions] = useState<InterventionRow[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const load = () => {
      fetch('/data/interventions.json')
        .then(res => {
          if (!res.ok) throw new Error(`HTTP ${res.status}`);
          return res.json() as Promise<InterventionRow[]>;
        })
        .then(d => {
          setInterventions(d);
          setLoading(false);
        })
        .catch(() => setLoading(false));
    };
    load();
    const interval = setInterval(load, AUTO_REFRESH_MS);
    return () => clearInterval(interval);
  }, []);

  return { interventions, loading };
}

export interface HistoryPoint {
  ts: number;
  [key: string]: number | null;
}

export interface HistoryMeta {
  intervention_id: number;
  device_id: string;
  date_start: string;
  date_end: string;
  columns: string[];
  generated_at: string;
}

export interface HistoryData {
  meta: HistoryMeta;
  points: HistoryPoint[];
}

const HISTORY_WINDOW_MS: Record<TimeWindow, number> = {
  '10m': 10 * 60 * 1000,
  '30m': 30 * 60 * 1000,
  '1h': 60 * 60 * 1000,
  '2h': 2 * 60 * 60 * 1000,
  '6h': 6 * 60 * 60 * 1000,
  '12h': 12 * 60 * 60 * 1000,
  '1d': 24 * 60 * 60 * 1000,
};

export function sliceHistoryWindow(points: HistoryPoint[], anchorMs: number, window: TimeWindow): HistoryPoint[] {
  const cutoff = anchorMs - HISTORY_WINDOW_MS[window];
  return points.filter(p => p.ts >= cutoff && p.ts <= anchorMs);
}
