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

export function useSkanviewData(activeWindow: TimeWindow, deviceId: string = 'mock-rig'): UseSkanviewDataResult {
  const [raw, setRaw] = useState<SkanviewData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!deviceId) return;
    setLoading(true);
    fetch(`/data/${deviceId}.json`)
      .then(res => {
        if (!res.ok) throw new Error(`HTTP ${res.status}`);
        return res.json() as Promise<SkanviewData>;
      })
      .then(d => {
        setRaw(d);
        setLoading(false);
      })
      .catch(e => {
        setError(e.message || 'Error cargando datos');
        setLoading(false);
      });
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
  }, []);

  return { rigs, loading };
}
