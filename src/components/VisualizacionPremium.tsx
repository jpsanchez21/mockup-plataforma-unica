import React, { useState, useMemo } from 'react';
import { useBreakpoint } from '../hooks/useBreakpoint';
import { Settings, AlertTriangle, Bell, Check, X, History, Printer, ChevronLeft, ChevronRight, ChevronDown, Lock, Download, FileText, BarChart2 } from 'lucide-react';
import WellChart from './WellChart';
import SurveyChart from './SurveyChart';
import ExportDrawer from './ExportDrawer';
import { InterventionRow } from '../hooks/useSkanviewData';
import {
  BarChart, Bar, XAxis, YAxis, ResponsiveContainer, Cell,
  ReferenceLine, CartesianGrid, LineChart, Line
} from 'recharts';

type TimeWindow = '10m' | '30m' | '1h' | '2h' | '6h' | '12h' | '1d';

interface TileVar {
  lbl: string; key: string; u: string; min: string; max: string;
  fmt: (v: any) => string;
}

const TILE_VARS: TileVar[] = [
  { lbl: 'Barriles por Minuto', key: 'flow',     u: 'Bbls/min', min: '0',   max: '15',    fmt: v => v?.toFixed(1) ?? '0.0' },
  { lbl: 'Presión Bomba',       key: 'pump',     u: 'psi',      min: '0',   max: '3000',  fmt: v => v?.toFixed(0) ?? '0' },
  { lbl: 'RPM Mesa Rotaria',    key: 'spm',      u: 'rpm',      min: '0',   max: '200',   fmt: v => v?.toFixed(0) ?? '0' },
  { lbl: 'Torque Mesa Rotaria', key: 'torque',   u: 'lbs-ft',   min: '0',   max: '15000', fmt: v => v?.toFixed(1) ?? '0.0' },
  { lbl: 'Peso Sobre Broca',    key: 'wob',      u: 'Klb',      min: '-30', max: '30',    fmt: v => v?.toFixed(1) ?? '0.0' },
  { lbl: 'ROP',                 key: 'blockVel', u: 'ft/min',   min: '0',   max: '350',   fmt: v => v?.toFixed(1) ?? '0.0' },
  { lbl: 'Hook Load',           key: 'hookload', u: 'klbs',     min: '0',   max: '300',   fmt: v => v?.toFixed(1) ?? '0.0' },
  { lbl: 'Posición Bloque',     key: 'blockPos', u: 'ft',       min: '0',   max: '100',   fmt: v => v?.toFixed(0) ?? '0' },
  { lbl: 'Profundidad',         key: 'depth',    u: 'ft',       min: '0',   max: '15000', fmt: v => v?.toFixed(0) ?? '0' },
  { lbl: 'Contador Tubería',    key: 'tubes',    u: 'tubos',    min: '0',   max: '100',   fmt: v => v?.toFixed(0) ?? '0' },
];

interface DashboardProps {
  data: any[];
  data2h: any[];
  allData: any[];
  latestPoint: any | null;
  loading: boolean;
  meta: any | null;
  timeRange: TimeWindow;
  onTimeRangeChange: (val: TimeWindow) => void;
  isHistorical?: boolean;
  intervention?: InterventionRow | null;
}

const VisualizacionPremium: React.FC<DashboardProps> = ({ data, data2h, allData, latestPoint, loading, timeRange, onTimeRangeChange, isHistorical, intervention }) => {
  const wellLabel = intervention ? `${intervention.torre} - ${intervention.pozo}` : 'INDEP-219 - CASTILLA NORTE-407';
  const [showTorqueSettings, setShowTorqueSettings] = useState(false);
  const [pipeType, setPipeType] = useState('TUBING');
  const [minTorqueInput, setMinTorqueInput] = useState('1240');
  const [maxTorqueInput, setMaxTorqueInput] = useState('2060');
  const [minTorque, setMinTorque] = useState(1240);
  const [maxTorque, setMaxTorque] = useState(2060);

  const [chartType8, setChartType8] = useState<'ciclo'|'juntas'>('ciclo');
  const [showKpiSettings8, setShowKpiSettings8] = useState(false);
  const [kpiValue8, setKpiValue8] = useState(3);
  const [kpiInput8, setKpiInput8] = useState('3');

  const [showHistoryModal, setShowHistoryModal] = useState(false);
  const [isExportOpen, setIsExportOpen] = useState(false);

  const [tank1Idx, setTank1Idx] = useState(0);
  const [tank2Idx, setTank2Idx] = useState(1);
  const [showTank1Picker, setShowTank1Picker] = useState(false);
  const [showTank2Picker, setShowTank2Picker] = useState(false);

  const { isSm, isLg, isXl } = useBreakpoint();
  const showLeftCol = isLg || isXl;
  const showWeather = isXl;
  const showCiclo = isLg || isXl;

  const [tileKeys, setTileKeys] = useState(['flow', 'pump', 'spm', 'torque', 'wob', 'blockVel']);
  const [openTileIdx, setOpenTileIdx] = useState<number | null>(null);

  const microDemoStyles = `
    @keyframes brushCursor {
      0%, 12% { transform: translate(42px, 110px); opacity: 0; }
      18% { transform: translate(42px, 110px); opacity: 1; }
      32% { transform: translate(42px, 74px); opacity: 1; }
      38% { transform: translate(42px, 74px) scale(0.8); opacity: 1; }
      42% { transform: translate(42px, 74px) scale(1); opacity: 1; }
      62% { transform: translate(42px, 44px); opacity: 1; }
      78% { transform: translate(42px, 44px); opacity: 1; }
      87% { opacity: 0; }
      100% { opacity: 0; }
    }
    @keyframes brushViewport {
      0%, 40% { top: 32%; }
      62% { top: 9%; }
      87%, 100% { top: 9%; }
    }
    @keyframes histExportSlide {
      0%, 18% { transform: translateX(100%); opacity: 0; }
      20% { transform: translateX(100%); opacity: 1; }
      25%, 55% { transform: translateX(0); opacity: 1; }
      60%, 100% { transform: translateX(100%); opacity: 0; }
    }
    @keyframes histExportBtnClick {
      0%, 36%, 40%, 100% { transform: scale(1); background: #515151; }
      37%, 39% { transform: scale(0.95); background: #1477D2; }
    }
    @keyframes exportCursor {
      0%, 25% { transform: translate(160px, 80px); opacity: 0; }
      28% { transform: translate(160px, 80px); opacity: 1; }
      35% { transform: translate(280px, 115px); opacity: 1; }
      37% { transform: translate(280px, 115px) scale(0.8); opacity: 1; }
      39% { transform: translate(280px, 115px) scale(1); opacity: 1; }
      45% { transform: translate(300px, 140px); opacity: 0; }
      100% { opacity: 0; }
    }
    .demo-cursor {
       width: 14px; height: 14px; background: white; border: 1px solid black; border-radius: 50%;
       box-shadow: 0 4px 10px rgba(0,0,0,0.5); position: absolute; z-index: 500; pointer-events: none;
       background-image: radial-gradient(circle at 30% 30%, #fff, #bbb);
    }
  `;

  const tankOptions = [
    { name: 'TK1 RETORNO C1', volume: 71.1, inflow: 52.3, pct: 0.71 },
    { name: 'TK2 SUCCION C1', volume: 78.4, inflow: 34.4, pct: 0.48 },
    { name: 'TK3 AGUA',       volume: 89.7, inflow: 67.2, pct: 0.90 },
    { name: 'TK4 MEZCLA',     volume: 23.5, inflow: 18.1, pct: 0.24 },
    { name: 'TK5 ACTIVO',     volume: 55.8, inflow: 42.5, pct: 0.56 },
    { name: 'TK6 RESERVA',    volume: 12.0, inflow:  8.3, pct: 0.12 },
  ];

  const hookLoadData = [
    { depth: 0,     trippingOut: 268, trippingIn: 268, dotOut: 265, dotIn: 271 },
    { depth: 500,   trippingOut: 261, trippingIn: 258, dotOut: 264, dotIn: 255 },
    { depth: 1000,  trippingOut: 254, trippingIn: 248, dotOut: 258, dotIn: 244 },
    { depth: 1500,  trippingOut: 246, trippingIn: 237, dotOut: 250, dotIn: 241 },
    { depth: 2000,  trippingOut: 238, trippingIn: 225, dotOut: 234, dotIn: 229 },
    { depth: 2500,  trippingOut: 228, trippingIn: 213, dotOut: 232, dotIn: 217 },
    { depth: 3000,  trippingOut: 218, trippingIn: 200, dotOut: 223, dotIn: 196 },
    { depth: 3500,  trippingOut: 208, trippingIn: 188, dotOut: 204, dotIn: 192 },
    { depth: 4000,  trippingOut: 198, trippingIn: 175, dotOut: 193, dotIn: 180 },
    { depth: 4500,  trippingOut: 187, trippingIn: 163, dotOut: 191, dotIn: 158 },
    { depth: 5000,  trippingOut: 176, trippingIn: 150, dotOut: 181, dotIn: 145 },
    { depth: 5500,  trippingOut: 166, trippingIn: 138, dotOut: 162, dotIn: 142 },
    { depth: 6000,  trippingOut: 156, trippingIn: 126, dotOut: 151, dotIn: 131 },
    { depth: 6500,  trippingOut: 147, trippingIn: 115, dotOut: 151, dotIn: 110 },
    { depth: 7000,  trippingOut: 138, trippingIn: 103, dotOut: 142, dotIn:  98 },
    { depth: 7500,  trippingOut: 129, trippingIn:  93, dotOut: 125, dotIn:  97 },
    { depth: 8000,  trippingOut: 120, trippingIn:  82, dotOut: 116, dotIn:  87 },
    { depth: 8500,  trippingOut: 112, trippingIn:  72, dotOut: 116, dotIn:  68 },
    { depth: 9000,  trippingOut: 104, trippingIn:  62, dotOut: 108, dotIn:  57 },
    { depth: 9500,  trippingOut:  97, trippingIn:  53, dotOut:  93, dotIn:  58 },
    { depth: 10000, trippingOut:  90, trippingIn:  44, dotOut:  86, dotIn:  49 },
    { depth: 10500, trippingOut:  84, trippingIn:  36, dotOut:  88, dotIn:  32 },
    { depth: 11000, trippingOut:  78, trippingIn:  28, dotOut:  82, dotIn:  24 },
    { depth: 11500, trippingOut:  73, trippingIn:  22, dotOut:  70, dotIn:  26 },
    { depth: 12000, trippingOut:  68, trippingIn:  16, dotOut:  64, dotIn:  20 },
    { depth: 12500, trippingOut:  64, trippingIn:  12, dotOut:  67, dotIn:   9 },
    { depth: 13000, trippingOut:  60, trippingIn:   8, dotOut:  63, dotIn:   5 },
  ];

  // Una "conexion" real = un incremento de Contador Tuberia (tubes) en la
  // serie de tiempo: +1 tubo = sencillo, +2 (o mas) = doble. Confirmado con
  // el usuario 2026-07-09 -- reemplaza los arreglos fijos/inventados que
  // habia antes en Ciclo Cuna a Cuna, Juntas por Hora y Torques Aplicados.
  const connections = useMemo(() => {
    const events: { ts: number; tuboDelta: number; torquePeak: number }[] = [];
    const PEAK_WINDOW_MS = 2 * 60 * 1000;
    for (let i = 1; i < data.length; i++) {
      const prevTubes = data[i - 1]?.tubes;
      const currTubes = data[i]?.tubes;
      if (prevTubes == null || currTubes == null) continue;
      const delta = currTubes - prevTubes;
      if (delta <= 0) continue;
      const ts = data[i].ts;
      let torquePeak = 0;
      for (const p of data) {
        if (Math.abs(p.ts - ts) <= PEAK_WINDOW_MS && p.torqHid != null) {
          torquePeak = Math.max(torquePeak, Math.abs(p.torqHid));
        }
      }
      events.push({ ts, tuboDelta: delta, torquePeak });
    }
    return events;
  }, [data]);

  const fmtHHMM = (ts: number) => new Date(ts).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit', hour12: false });

  const cicloCunaData = useMemo(() => connections.slice(1).map((e, i) => ({
    name: fmtHHMM(e.ts),
    val: Math.round(((e.ts - connections[i].ts) / 60000) * 10) / 10,
    isDouble: e.tuboDelta >= 2,
  })), [connections]);

  const juntasPorHoraData = useMemo(() => {
    const buckets = new Map<number, number>();
    connections.forEach(e => {
      const d = new Date(e.ts);
      d.setMinutes(0, 0, 0);
      const key = d.getTime();
      buckets.set(key, (buckets.get(key) ?? 0) + 1);
    });
    return Array.from(buckets.entries())
      .sort((a, b) => a[0] - b[0])
      .map(([key, count]) => ({ name: new Date(key).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', hour12: false }), val: count }));
  }, [connections]);

  const currentBarData8 = chartType8 === 'ciclo' ? cicloCunaData : juntasPorHoraData;

  const torqueDataReal = useMemo(() => connections.map(e => ({
    time: fmtHHMM(e.ts),
    value: e.torquePeak,
  })), [connections]);

  const barHeight = 45;
  const chartHeight14 = Math.max(160, torqueDataReal.length * barHeight);

  const juntasPorHora = useMemo(() => {
    if (data.length < 2) return 0;
    const hours = (data[data.length - 1].ts - data[0].ts) / 3_600_000;
    return hours > 0 ? connections.length / hours : 0;
  }, [connections, data]);

  const getPeriodoText = (t: TimeWindow) => {
    switch(t) {
      case '10m': return '10 MINUTOS'; case '30m': return '30 MINUTOS';
      case '1h':  return '1 HORA';     case '2h':  return '2 HORAS';
      case '6h':  return '6 HORAS';    case '12h': return '12 HORAS';
      case '1d':  return '1 DÍA';      default: return '';
    }
  };

  return (
    <div className="flex flex-col gap-2 h-full w-full overflow-hidden select-none">
      <style>{microDemoStyles}</style>
      <svg width="0" height="0" className="absolute">
        <defs>
          <linearGradient id="torqueGradientP" x1="0" y1="0" x2="1" y2="0">
            <stop offset="0%" stopColor="#FFD500" stopOpacity={1} />
            <stop offset="100%" stopColor="#B37700" stopOpacity={1} />
          </linearGradient>
          <linearGradient id="gradientSencilloP" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#09BC96" stopOpacity={1} />
            <stop offset="100%" stopColor="#09BC96" stopOpacity={0.2} />
          </linearGradient>
          <linearGradient id="gradientDobleP" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#0B5799" stopOpacity={1} />
            <stop offset="100%" stopColor="#0B5799" stopOpacity={0.2} />
          </linearGradient>
        </defs>
      </svg>

      {/* ═══ TOP ROW ═══ */}
      <div className={`flex gap-2 shrink-0 ${isSm ? 'hidden' : 'h-[125px]'}`}>

        {/* Weather */}
        {showWeather && <div className="w-[250px] shrink-0 glass-panel flex flex-col bg-[#1c1c1e] relative overflow-hidden border border-white/5 px-2 py-2">
          <div className="flex items-start gap-2 flex-1">
            <div className="flex flex-col items-start shrink-0">
              <span className="text-[9px] font-bold text-white/50 uppercase tracking-wider">Hoy</span>
              <span className="text-[24px] font-black text-white leading-none mt-0.5">31°C</span>
            </div>
            <div className="flex items-center justify-center mt-0.5 shrink-0">
              <svg width="28" height="28" viewBox="0 0 64 64" fill="none">
                <circle cx="28" cy="26" r="10" fill="#ffffff"/>
                <g stroke="#ffffff" strokeWidth="2.5" strokeLinecap="round">
                  <line x1="28" y1="10" x2="28" y2="14"/><line x1="28" y1="38" x2="28" y2="42"/>
                  <line x1="14" y1="26" x2="18" y2="26"/><line x1="38" y1="26" x2="42" y2="26"/>
                  <line x1="18" y1="16" x2="21" y2="19"/><line x1="35" y1="33" x2="38" y2="36"/>
                  <line x1="38" y1="16" x2="35" y2="19"/><line x1="21" y1="33" x2="18" y2="36"/>
                </g>
                <ellipse cx="42" cy="38" rx="12" ry="8" fill="#666666"/>
                <ellipse cx="36" cy="36" rx="8" ry="7" fill="#888888"/>
                <ellipse cx="46" cy="36" rx="7" ry="6" fill="#777777"/>
              </svg>
            </div>
            <div className="flex flex-col items-start flex-1 min-w-0 mt-0.5">
              <span className="text-[9px] font-black text-white/80 uppercase tracking-tight truncate w-full">CANTAGALLO</span>
              <span className="text-[8px] text-white/50 font-bold mt-0.5 truncate w-full">Parc. nublado</span>
              <span className="text-[8px] text-white/50 font-bold">Viento: 5 km/h</span>
            </div>
          </div>
          <div className="flex items-center justify-between border-t border-white/10 pt-1 mt-1">
            {[{ day:'Sab', hi:'32°C', lo:'22°C', icon:'☀' },{ day:'Dom', hi:'32°C', lo:'21°C', icon:'☁' },{ day:'Lun', hi:'33°C', lo:'21°C', icon:'☁' }].map((d,i) => (
              <div key={i} className="flex flex-col items-center gap-0.5">
                <span className="text-[8px] font-bold text-white/40 uppercase">{d.day}</span>
                <span className="text-[11px] leading-none text-white/50">{d.icon}</span>
                <span className="text-[9px] font-black text-white/70 leading-none">{d.hi}</span>
                <span className="text-[8px] font-bold text-white/30 leading-none">{d.lo}</span>
              </div>
            ))}
          </div>
        </div>}

        {/* Box 8: Ciclo Cuña a Cuña */}
        {showCiclo && <div className="glass-panel w-[23%] shrink-0 p-2 flex flex-col relative overflow-visible">
          <button className="absolute left-1 top-1 w-6 h-6 rounded-full bg-[#353741] border border-white/20 flex items-center justify-center hover:bg-[#444654] z-20 transition-all shadow-lg" onClick={() => setShowKpiSettings8(!showKpiSettings8)}>
            <Settings size={12} className="text-white" />
          </button>
          <div className="absolute top-1 left-0 right-0 pointer-events-none flex justify-center z-10">
            <span className="text-[11px] font-bold text-white uppercase tracking-widest leading-none drop-shadow-md">
              {chartType8 === 'ciclo' ? 'CICLO CUÑA A CUÑA' : 'JUNTAS POR HORA'}
            </span>
          </div>
          <button className="absolute right-1 top-1 w-6 h-6 rounded-full bg-[#353741] border border-white/10 flex items-center justify-center hover:bg-[#444654] z-20 transition-all shadow-lg" onClick={() => setChartType8(chartType8 === 'ciclo' ? 'juntas' : 'ciclo')}>
            <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" className="text-white">
              <polyline points="17 1 21 5 17 9"/><path d="M3 11V9a4 4 0 0 1 4-4h14"/>
              <polyline points="7 23 3 19 7 15"/><path d="M21 13v2a4 4 0 0 1-4 4H3"/>
            </svg>
          </button>
          {showKpiSettings8 && (
            <div className="absolute top-0 left-0 z-[100] bg-[#1F1F1F] rounded-lg p-3 w-[150px] shadow-2xl border border-white/10 flex flex-col">
              <div className="flex items-center gap-2 mb-3">
                <span className="text-[10px] font-bold text-white uppercase tracking-widest">KPI</span>
                <input type="number" value={kpiInput8} onChange={e => setKpiInput8(e.target.value)} className="w-full ml-1 p-1 text-[13px] text-black h-7 bg-white font-bold" />
              </div>
              <button onClick={() => { setKpiValue8(Number(kpiInput8)); setShowKpiSettings8(false); }} className="w-full bg-[#47CEAC] text-black font-extrabold text-[12px] py-1.5 hover:bg-[#34a889] transition-colors">Actualizar</button>
            </div>
          )}
          <div className="flex-1 mt-7 relative overflow-hidden flex gap-0">
            <span className="absolute left-1 -top-4 text-[7px] font-bold text-white uppercase italic">{chartType8 === 'ciclo' ? 'minutos' : 'juntas'}</span>
            <div className="flex-1 overflow-hidden pb-1">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={currentBarData8} margin={{ top: 4, right: 2, left: 0, bottom: 16 }}>
                  <XAxis dataKey="name" fontSize={7} tick={{ fill: '#ffffff' }} tickLine={false} axisLine={{ stroke: '#ffffff40' }} height={16} />
                  <YAxis fontSize={7} tick={{ fill: '#ffffff' }} tickLine={false} axisLine={false} domain={[0, (dataMax: number) => Math.max(dataMax * 1.15, 1)]} width={22} />
                  <CartesianGrid vertical={false} stroke="#333" />
                  <Bar dataKey="val" radius={[1,1,0,0]} maxBarSize={12}>
                    {currentBarData8.map((d: any, i) => <Cell key={i} fill={chartType8 === 'juntas' ? '#8b5cf6' : (d.isDouble ? 'url(#gradientDobleP)' : 'url(#gradientSencilloP)')} />)}
                  </Bar>
                  {kpiValue8 > 0 && <ReferenceLine y={kpiValue8} stroke="#ef4444" strokeWidth={1.5} label={{ position:'top', value:`KPI: ${kpiValue8}`, fill:'#fff', fontSize:10, fontWeight:'bold' }} />}
                </BarChart>
              </ResponsiveContainer>
            </div>
            {chartType8 === 'ciclo' && (
              <div className="w-[55px] flex flex-col justify-center gap-2 border-l border-white/5 pl-2 shrink-0">
                <div className="flex flex-col items-center gap-1"><div className="w-8 h-4 rounded bg-[#09BC96]" /><span className="text-[7px] text-white font-bold uppercase truncate">Sencillo</span></div>
                <div className="flex flex-col items-center gap-1"><div className="w-8 h-4 rounded bg-[#0B5799]" /><span className="text-[7px] text-white font-bold uppercase truncate">Doble</span></div>
              </div>
            )}
          </div>
        </div>}

        {/* BOX 7 UNIFIED: Métricas — Conexiones / Bloque / Circulación */}
        <div className="glass-panel flex flex-col flex-1 relative overflow-hidden">
          <div className="text-center pt-[2px] pb-[1px] shrink-0 border-b border-[#525252]">
            <span className="text-[10px] font-bold text-white tracking-widest uppercase">
              MÉTRICAS DE LAS ÚLTIMAS {getPeriodoText(timeRange)}
            </span>
          </div>
          <div className="flex-1 flex flex-row w-full overflow-hidden">
            {/* CONEXIONES */}
            <div className="flex flex-col border-r-2 border-[#525252] flex-1">
              <div className="bg-[#47CEAC]/10 border-b border-[#47CEAC]/40 px-2 py-[2px] flex items-center justify-center">
                <span className="text-[8px] font-black text-[#47CEAC] uppercase tracking-widest">Conexiones</span>
              </div>
              <div className="flex-1 flex flex-row">
                <div className="w-[48px] shrink-0 border-r border-[#525252] flex items-center justify-center">
                  <span className="text-[20px] font-extrabold text-white tracking-widest leading-none">RIH</span>
                </div>
                <div className="flex-1 flex flex-col">
                  <div className="flex-1 border-b border-[#525252]"><OpCell val={juntasPorHora.toFixed(2)} lbl="Juntas / Hora" sub="" /></div>
                  <div className="flex-1"><OpCell val="0.87" lbl="Conex. - Desconex." sub="horas" /></div>
                </div>
              </div>
            </div>
            {/* BLOQUE */}
            <div className="flex flex-col border-r-2 border-[#525252] flex-[2]">
              <div className="bg-[#1477D2]/10 border-b border-[#1477D2]/40 px-2 py-[2px] flex items-center justify-center">
                <span className="text-[8px] font-black text-[#1477D2] uppercase tracking-widest">Bloque</span>
              </div>
              <div className="flex-1 flex flex-col">
                <div className="flex-1 flex border-b border-[#525252]">
                  <div className="flex-1 border-r border-[#525252]"><OpCell val="0.27" lbl="Bloque Subiendo" sub="horas" /></div>
                  <div className="flex-1 border-r border-[#525252]"><OpCell val="1.42" lbl="Bloque Detenido" sub="horas" /></div>
                  <div className="flex-1"><OpCell val="0.30" lbl="Bloque Bajando" sub="horas" /></div>
                </div>
                <div className="flex-1 flex">
                  <div className="flex-1 border-r border-[#525252]"><OpCell val="0.41" lbl="Mov Bloque Fuera Cuñas" sub="horas" /></div>
                  <div className="flex-1 border-r border-[#525252]"><OpCell val="0.22" lbl="Mov Bloque en Cuñas" sub="horas" /></div>
                  <div className="flex-1"><OpCell val="0.51" lbl="En Cuñas" sub="horas" /></div>
                </div>
              </div>
            </div>
            {/* CIRCULACION */}
            <div className="flex flex-col flex-[1.5]">
              <div className="bg-[#AC0653]/10 border-b border-[#AC0653]/40 px-2 py-[2px] flex items-center justify-center">
                <span className="text-[8px] font-black text-[#AC0653] uppercase tracking-widest">Circulación</span>
              </div>
              <div className="flex-1 flex flex-col">
                <div className="flex-1 flex border-b border-[#525252]">
                  <div className="flex-1 border-r border-[#525252]"><OpCell val="0.00" lbl="Tiempo Circulación" sub="horas" /></div>
                  <div className="flex-1"><OpCell val="0.00" lbl="Tiempo Pruebas Presión" sub="horas" /></div>
                </div>
                <div className="flex-1 flex">
                  <div className="flex-1 border-r border-[#525252]"><OpCell val="0.00" lbl="Contador Pruebas Presión" sub="" /></div>
                  <div className="flex-1"><OpCell val="0.00" lbl="Molienda / Limpieza / Rectificaciones" sub="horas" /></div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* ═══ MAIN CONTENT ═══ */}
      <div className={`flex gap-2 flex-1 min-h-0 w-full ${isSm ? 'flex-col overflow-y-auto' : ''}`}>

        {/* ══ LEFT COLUMN ══ */}
        <div className={`flex flex-col gap-2 w-[250px] shrink-0 h-full ${!showLeftCol ? 'hidden' : ''}`}>

          {/* ── Hook Load (Torque & Drag) ── */}
          <div className="flex-1 glass-panel bg-[#1D1D20] flex flex-col overflow-hidden min-h-0 pt-1.5 pb-1 px-2">
            <div className="flex flex-col mb-1">
              <span className="text-[8px] font-black text-white uppercase tracking-widest leading-none">HOOK LOAD</span>
              <div className="flex items-center gap-3 mt-[3px]">
                <div className="flex items-center gap-1">
                  <div className="w-4 h-[1.5px] bg-[#4ade80]" />
                  <div className="w-[5px] h-[5px] rounded-full bg-[#86efac] border border-[#166534]" style={{ boxShadow: '0 0 4px #4ade8066' }} />
                  <span className="text-[7px] text-white/55 font-bold uppercase">Trip In</span>
                </div>
                <div className="flex items-center gap-1">
                  <div className="w-4 h-[1.5px] bg-[#60a5fa]" />
                  <div className="w-[5px] h-[5px] rounded-full bg-[#93c5fd] border border-[#1e40af]" style={{ boxShadow: '0 0 4px #60a5fa66' }} />
                  <span className="text-[7px] text-white/55 font-bold uppercase">Trip Out</span>
                </div>
              </div>
            </div>
            <div className="flex-1 min-h-0">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={hookLoadData} margin={{ top: 4, right: 8, left: -10, bottom: 2 }}>
                  <CartesianGrid vertical={false} stroke="#ffffff07" />
                  <XAxis
                    dataKey="depth"
                    type="number"
                    domain={[0, 13000]}
                    fontSize={7}
                    tick={{ fill: '#ffffffaa' }}
                    tickLine={{ stroke: '#ffffff30' }}
                    axisLine={{ stroke: '#ffffff40' }}
                    tickCount={7}
                    tickFormatter={v => v >= 1000 ? `${v / 1000}k` : `${v}`}
                  />
                  <YAxis
                    type="number"
                    domain={[0, 300]}
                    fontSize={7}
                    tick={{ fill: '#ffffffaa' }}
                    tickLine={{ stroke: '#ffffff30' }}
                    axisLine={{ stroke: '#ffffff40' }}
                    width={26}
                    tickCount={5}
                  />
                  <Line type="monotone" dataKey="trippingOut" stroke="#60a5fa" strokeWidth={1.5} dot={false} isAnimationActive={false} />
                  <Line type="monotone" dataKey="trippingIn"  stroke="#4ade80" strokeWidth={1.5} dot={false} isAnimationActive={false} />
                  <Line type="monotone" dataKey="dotOut" stroke="transparent" strokeWidth={0} isAnimationActive={false}
                    dot={{ r: 2.5, fill: '#93c5fd', stroke: '#1e3a8a', strokeWidth: 0.8 }}
                    activeDot={false}
                  />
                  <Line type="monotone" dataKey="dotIn" stroke="transparent" strokeWidth={0} isAnimationActive={false}
                    dot={{ r: 2.5, fill: '#86efac', stroke: '#14532d', strokeWidth: 0.8 }}
                    activeDot={false}
                  />
                </LineChart>
              </ResponsiveContainer>
            </div>
            <div className="flex justify-between px-5 mt-0.5">
              <span className="text-[6px] text-white/20 font-bold uppercase tracking-wider">0 ft</span>
              <span className="text-[6px] text-white/20 font-bold uppercase tracking-wider">Profundidad</span>
              <span className="text-[6px] text-white/20 font-bold uppercase tracking-wider">13k ft</span>
            </div>
          </div>

          {/* ── Nivel de Tanques ── */}
          <div className="shrink-0 h-[160px] glass-panel bg-[#1D1D20] flex flex-col px-3 pt-2 pb-1.5 relative z-20 overflow-visible">
            <span className="text-[8px] font-black text-white uppercase tracking-widest mb-1.5 shrink-0">NIVEL DE TANQUES</span>
            <div className="flex gap-3 flex-1 min-h-0">

              {([{ idx: tank1Idx, setIdx: setTank1Idx, show: showTank1Picker, setShow: setShowTank1Picker, closeOther: () => setShowTank2Picker(false) },
                 { idx: tank2Idx, setIdx: setTank2Idx, show: showTank2Picker, setShow: setShowTank2Picker, closeOther: () => setShowTank1Picker(false) }] as const).map((slot, s) => {
                const tk = tankOptions[slot.idx];
                const isLow = tk.pct < 0.25;
                const isMed = tk.pct < 0.55;
                const fillBase  = isLow ? '#dc2626' : isMed ? '#d97706' : '#1477D2';
                const fillLight = isLow ? '#f87171' : isMed ? '#fbbf24' : '#38bdf8';
                const borderCol = 'rgba(180,180,200,0.45)';
                return (
                  <div key={s} className="flex-1 flex flex-col gap-1 min-h-0 relative">

                    {/* Selector pill */}
                    <button
                      onClick={() => { slot.setShow(p => !p); slot.closeOther(); }}
                      className="w-full flex items-center justify-between gap-1 px-1.5 py-[3px] rounded-[3px] border border-white/10 bg-white/[0.04] hover:bg-white/[0.09] transition-colors group shrink-0"
                    >
                      <span className="text-[7px] font-black text-white uppercase tracking-wide truncate">{tk.name}</span>
                      <ChevronDown size={9} className={`text-white/40 group-hover:text-white/70 transition-all shrink-0 ${slot.show ? 'rotate-180' : ''}`} />
                    </button>

                    {/* Dropdown */}
                    {slot.show && (
                      <div className="absolute top-[20px] left-0 right-0 z-50 bg-[#16161a] border border-white/15 rounded-[4px] shadow-2xl overflow-hidden">
                        {tankOptions.map((t, i) => (
                          <button
                            key={i}
                            onClick={() => { slot.setIdx(i); slot.setShow(false); }}
                            className={`w-full flex items-center justify-between px-2 py-[5px] hover:bg-white/10 transition-colors ${slot.idx === i ? 'bg-[#1477D2]/25' : ''}`}
                          >
                            <span className="text-[7px] font-black text-white uppercase tracking-wide">{t.name}</span>
                            <div className="flex items-center gap-1.5">
                              <div className="w-10 h-[3px] bg-white/10 rounded-full overflow-hidden">
                                <div className="h-full rounded-full transition-all" style={{ width: `${t.pct * 100}%`, background: t.pct < 0.25 ? '#dc2626' : t.pct < 0.55 ? '#d97706' : '#1477D2' }} />
                              </div>
                              <span className="text-[6.5px] font-bold text-white/40 w-[28px] text-right">{t.volume}</span>
                            </div>
                          </button>
                        ))}
                      </div>
                    )}

                    {/* Tank vessel + metrics */}
                    <div className="flex-1 flex flex-col min-h-0">

                      {/* Physical vessel */}
                      <div
                        className="flex-1 relative min-h-0 rounded-[2px] overflow-hidden"
                        style={{
                          border: `2px solid ${borderCol}`,
                          background: '#040410',
                          boxShadow: `inset 0 0 16px rgba(0,0,0,0.95), inset 3px 0 6px rgba(255,255,255,0.025), 0 0 10px ${fillBase}18`
                        }}
                      >
                        {/* Fluid fill */}
                        <div
                          className="absolute bottom-0 left-0 right-0 transition-all duration-700 ease-out"
                          style={{
                            height: `${tk.pct * 100}%`,
                            background: `linear-gradient(180deg, ${fillLight}75 0%, ${fillBase}f0 28%, ${fillBase}c0 100%)`,
                          }}
                        />
                        {/* Waterline shimmer */}
                        <div
                          className="absolute left-0 right-0 transition-all duration-700 ease-out"
                          style={{
                            bottom: `calc(${tk.pct * 100}% - 1px)`,
                            height: '2px',
                            background: `linear-gradient(90deg, transparent, ${fillLight}cc 20%, ${fillLight} 50%, ${fillLight}cc 80%, transparent)`,
                          }}
                        />
                        {/* Level gauge marks */}
                        {[25, 50, 75].map(l => (
                          <div key={l} className="absolute left-0 right-0 h-px" style={{ bottom: `${l}%`, background: 'rgba(255,255,255,0.055)' }} />
                        ))}
                        {/* Inner wall sheen */}
                        <div className="absolute left-0 top-0 bottom-0 w-[5px]" style={{ background: 'linear-gradient(90deg, rgba(255,255,255,0.07), transparent)' }} />
                        <div className="absolute right-0 top-0 bottom-0 w-[3px]" style={{ background: 'linear-gradient(270deg, rgba(255,255,255,0.03), transparent)' }} />
                        {/* Empty headspace % */}
                        <div className="absolute left-0 right-0 flex items-center justify-center pointer-events-none" style={{ top: 0, bottom: `${tk.pct * 100}%` }}>
                          <span className="text-[8px] font-black" style={{ color: 'rgba(255,255,255,0.12)' }}>{Math.round((1 - tk.pct) * 100)}%</span>
                        </div>
                        {/* Fill % inside fluid */}
                        {tk.pct > 0.2 && (
                          <div className="absolute left-0 right-0 bottom-0 flex items-center justify-center pointer-events-none" style={{ height: `${tk.pct * 100}%` }}>
                            <span className="text-[9px] font-black drop-shadow-[0_1px_3px_rgba(0,0,0,0.9)]" style={{ color: fillLight }}>{Math.round(tk.pct * 100)}%</span>
                          </div>
                        )}
                      </div>

                      {/* Metrics row below vessel */}
                      <div className="flex items-center justify-between pt-[5px] shrink-0">
                        <div className="flex flex-col items-center flex-1">
                          <span className="text-[13px] font-black text-white leading-none">{tk.inflow}</span>
                          <span className="text-[7.5px] font-bold text-white uppercase tracking-wider leading-none mt-[3px]">in</span>
                        </div>
                        <div className="w-px h-6 bg-white/15" />
                        <div className="flex flex-col items-center flex-1">
                          <span className="text-[13px] font-black text-white leading-none">{tk.volume}</span>
                          <span className="text-[7.5px] font-bold text-white uppercase tracking-wider leading-none mt-[3px]">bbl</span>
                        </div>
                      </div>

                    </div>

                  </div>
                );
              })}

            </div>
          </div>

          {/* Tonelada Milla */}
          <div className="h-[88px] shrink-0 glass-panel flex flex-col bg-[#1D1D20] relative overflow-hidden">
            {/* Background machinery — full width, faded */}
            <div className="absolute inset-0 flex items-center justify-end pointer-events-none">
              <svg viewBox="0 0 100 80" className="h-full w-auto opacity-[0.12]" preserveAspectRatio="xMaxYMid meet">
                <rect x="25" y="10" width="8" height="60" fill="#a1a1aa"/><rect x="21" y="5" width="16" height="70" fill="#A88126"/>
                <rect x="85" y="10" width="8" height="60" fill="#a1a1aa"/><rect x="81" y="5" width="16" height="70" fill="#A88126"/>
                <rect x="37" y="15" width="44" height="50" fill="#3f3f46"/>
                {[...Array(9)].map((_,i) => <rect key={i} x={39+(i*4.8)} y="15" width="3.5" height="50" fill="#52525b" rx="1.5"/>)}
                <rect x="49" y="65" width="3.5" height="20" fill="#a1a1aa"/>
              </svg>
            </div>
            {/* Centered content */}
            <div className="relative z-10 flex flex-col items-center justify-center h-full gap-0">
              <span className="text-[10px] font-black text-white uppercase tracking-[0.18em] leading-none">TONELADA MILLA</span>
              <div className="flex items-baseline gap-1.5 mt-1">
                <span className="text-[32px] font-black text-white leading-none drop-shadow-[0_2px_8px_rgba(0,0,0,0.9)]">{(latestPoint?.toneladaMilla ?? 0).toFixed(2)}</span>
                <span className="text-[11px] font-bold text-white/35 uppercase tracking-wider leading-none mb-0.5">TM</span>
              </div>
            </div>
          </div>

          {/* Nivel de Gases */}
          <div className="shrink-0 h-[130px] glass-panel flex flex-col items-center pt-2 pb-1 bg-[#1D1D20] relative">
            <span className="text-[9px] font-black text-white tracking-wide uppercase drop-shadow-sm leading-none">NIVEL DE GASES</span>
            <span className="text-[8px] font-bold text-white/80 uppercase tracking-wide mt-1">BOCA TANQUE</span>
            <div className="flex-1 flex w-full relative items-center justify-center gap-2 mt-1 mb-1">
              <div className="relative w-[44px] h-[44px] flex items-center justify-center shrink-0">
                <div className="absolute w-full h-[1.5px] bg-white top-1/2 -translate-y-1/2"></div>
                <div className="absolute h-full w-[1.5px] bg-white left-1/2 -translate-x-1/2"></div>
                <span className="absolute top-0.5 left-[6px] text-[10px] font-bold text-white">0</span>
                <span className="absolute top-0.5 right-[6px] text-[10px] font-bold text-white">0</span>
                <span className="absolute bottom-0.5 left-[6px] text-[10px] font-bold text-white">0</span>
                <span className="absolute bottom-0.5 right-[6px] text-[10px] font-bold text-white">0</span>
              </div>
              <div className="flex flex-col gap-1 items-center">
                <div className="flex flex-col items-center leading-[1.1] text-[#F59B22]">
                  <span className="text-[13px] font-black">{(latestPoint?.lel ?? 0).toFixed(1)}</span>
                  <span className="text-[9px] font-black uppercase">LEL (%)</span>
                </div>
                <div className="flex flex-col items-center leading-[1.1] text-[#F59B22] mt-1">
                  <span className="text-[13px] font-black">{(latestPoint?.h2s ?? 0).toFixed(1)}</span>
                  <span className="text-[9px] font-black uppercase">H2S ppm</span>
                </div>
              </div>
            </div>
          </div>

        </div>

        {/* ══ CENTER COLUMN: WellChart ══ */}
        <div className={`flex flex-[2.2] flex-col gap-2 min-w-0 ${isSm ? 'h-[58vh] shrink-0' : 'h-full'}`}>
          <div className="flex-1 min-h-0 glass-panel overflow-hidden p-0 relative">
            <WellChart
              data={data}
              latestPoint={latestPoint}
              loading={loading}
              timeWindow={timeRange}
              onTimeWindowChange={onTimeRangeChange}
              isHistorical={isHistorical}
              onShowHistory={() => setShowHistoryModal(true)}
              showBrushPanel={true}
              hideDepthFilter={true}
              showUnitSelector={true}
            />
          </div>
        </div>

        {/* ══ RIGHT COLUMN ══ */}
        <div className={`flex flex-col flex-1 gap-2 min-w-0 ${isSm ? 'h-auto shrink-0' : 'h-full'}`}>

          {/* Alarmas & Survey */}
          <div className="grid grid-cols-[1.4fr_1fr] gap-2 h-[220px] shrink-0">
            <div className="glass-panel p-3 flex flex-col">
              <span className="text-[12px] font-black text-white uppercase tracking-tight mb-0.5">{wellLabel}</span>
              <span className="text-[11px] font-bold text-white/60 mb-3">Alarmas - Alertas</span>
              <div className="flex flex-col gap-2 flex-1 justify-center">
                <div className="flex items-center gap-2 rounded-md px-2 py-2" style={{ background: 'rgba(160,25,15,0.90)' }}>
                  <div className="w-8 h-8 rounded flex items-center justify-center shrink-0" style={{ background: '#C94010' }}>
                    <AlertTriangle size={15} className="text-white" />
                  </div>
                  <span className="flex-1 text-[10px] font-bold text-white leading-tight">Torque fuera de rango: último valor 11666 (KPI 4300 - 5100)</span>
                  <div className="w-6 h-6 rounded-full flex items-center justify-center shrink-0" style={{ background: '#8B1A0A' }}>
                    <Check size={12} className="text-white" strokeWidth={3} />
                  </div>
                </div>
                <div className="flex items-center gap-2 rounded-md px-2 py-2" style={{ background: 'rgba(140,105,0,0.90)' }}>
                  <div className="w-8 h-8 rounded flex items-center justify-center shrink-0" style={{ background: '#C49000' }}>
                    <Bell size={15} className="text-white" />
                  </div>
                  <span className="flex-1 text-[10px] font-bold text-white leading-tight">Juntas por hora: último registro 8.78 está por debajo del KPI (18)</span>
                  <div className="w-6 h-6 rounded-full flex items-center justify-center shrink-0" style={{ background: '#8B7000' }}>
                    <Check size={12} className="text-white" strokeWidth={3} />
                  </div>
                </div>
              </div>
            </div>
            <div className="glass-panel overflow-hidden p-0">
              <SurveyChart latestPoint={latestPoint} />
            </div>
          </div>

          {/* Tiles & Torque */}
          <div className={`grid grid-cols-[1.4fr_1fr] gap-2 ${isSm ? 'h-[300px] shrink-0' : 'flex-1 min-h-0'}`}>
            <div className="glass-panel grid grid-cols-2 grid-rows-3 gap-2 overflow-visible bg-[#1D1D20] p-3 relative z-[50]">
              {tileKeys.map((key, i) => {
                const vd = TILE_VARS.find(v => v.key === key) ?? TILE_VARS[i];
                const rawVal = (latestPoint as any)?.[key];
                return (
                  <TileBox
                    key={i}
                    lbl={vd.lbl}
                    v={vd.fmt(rawVal)}
                    u={vd.u}
                    min={vd.min}
                    max={vd.max}
                    isPickerOpen={openTileIdx === i}
                    onTogglePicker={() => setOpenTileIdx(openTileIdx === i ? null : i)}
                    vars={TILE_VARS}
                    currentKey={key}
                    onSelect={(newKey: string) => {
                      setTileKeys(prev => { const n = [...prev]; n[i] = newKey; return n; });
                      setOpenTileIdx(null);
                    }}
                  />
                );
              })}
            </div>

            {/* Torques Aplicados */}
            <div className="glass-panel px-4 py-3 flex flex-col relative overflow-visible z-10 w-full min-h-0">
              <button className="absolute left-1 top-1 w-7 h-7 rounded-full bg-[#353741] border border-white/20 flex items-center justify-center hover:bg-[#444654] z-20 transition-all shadow-lg" onClick={() => setShowTorqueSettings(!showTorqueSettings)}>
                <Settings size={14} className="text-white" />
              </button>
              <div className="absolute top-2 left-0 right-0 pointer-events-none flex justify-center z-10">
                <span className="text-[11px] font-bold text-white uppercase tracking-widest leading-none drop-shadow-md">Torques Aplicados</span>
              </div>
              {showTorqueSettings && (
                <div className="absolute top-0 left-0 z-[100] bg-[#525252] rounded-lg p-3 w-[160px] shadow-2xl border border-white/5 flex flex-col">
                  <span className="text-[10px] font-bold text-white uppercase tracking-widest mb-2">Configurar Límites</span>
                  <select value={pipeType} onChange={e => setPipeType(e.target.value)} className="w-full mb-3 bg-white text-black text-[11px] p-1 h-7 border-none font-bold">
                    <option>TUBING</option><option>DRILL PIPE</option><option>MANUAL</option>
                  </select>
                  <div className="flex items-center gap-2 mb-2">
                    <span className="text-[9px] text-white">MIN</span>
                    <input type="number" value={minTorqueInput} onChange={e => setMinTorqueInput(e.target.value)} className="w-full p-1 text-[11px] text-black h-6 bg-white font-bold" />
                  </div>
                  <div className="flex items-center gap-2 mb-4">
                    <span className="text-[9px] text-white">MAX</span>
                    <input type="number" value={maxTorqueInput} onChange={e => setMaxTorqueInput(e.target.value)} className="w-full p-1 text-[11px] text-black h-6 bg-white font-bold" />
                  </div>
                  <button onClick={() => { setMinTorque(Number(minTorqueInput)); setMaxTorque(Number(maxTorqueInput)); setShowTorqueSettings(false); }} className="w-full bg-[#47CEAC] text-black font-extrabold text-[11px] py-1.5 hover:bg-[#34a889]">Actualizar</button>
                </div>
              )}
              <div className="flex-1 w-full mt-7 relative z-0 overflow-y-auto pr-1 custom-scrollbar">
                <div style={{ height: chartHeight14 }}>
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={torqueDataReal} layout="vertical" margin={{ top: 10, right: 10, left: -25, bottom: 0 }}>
                      <XAxis type="number" hide domain={[0, 15000]} />
                      <YAxis type="category" dataKey="time" fontSize={8} tick={{ fill: '#ffffff' }} tickLine={false} axisLine={false} width={60} />
                      <Bar dataKey="value" fill="url(#torqueGradientP)" barSize={25} radius={[0,2,2,0]} isAnimationActive={false} />
                      <ReferenceLine x={minTorque} stroke="#3b82f6" strokeWidth={2} />
                      <ReferenceLine x={maxTorque} stroke="#ef4444" strokeWidth={2} />
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              </div>
              <div className="h-[25px] w-full shrink-0 mt-1">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={[]} layout="vertical" margin={{ top: 5, right: 10, left: 45, bottom: 0 }}>
                    <XAxis type="number" domain={[0, 15000]} orientation="top" fontSize={8} tick={{ fill: '#ffffff' }} axisLine={{ stroke: '#ffffff40' }} tickLine={false} tickFormatter={v => v.toLocaleString()} />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </div>
          </div>

          {/* Bottom: Velocidad con Carga — full width */}
          <div className="h-[130px] shrink-0 glass-panel flex flex-col overflow-hidden relative">
            <div className="flex justify-between items-center px-4 py-1 bg-transparent shrink-0">
              <div className="flex items-center gap-6">
                <div className="flex items-center gap-2">
                  <div className="w-2.5 h-2.5 rounded-full bg-[#00FFD6]" />
                  <span className="text-[10px] font-black text-white uppercase tracking-tight">Velocidad con carga</span>
                </div>
                <span className="text-[10px] font-bold text-white/40 uppercase tracking-widest mx-auto">Velocidad de viaje</span>
                <span className="text-[10px] font-bold text-white/40 uppercase tracking-widest">ROP</span>
              </div>
            </div>
            <div className="flex-1 relative overflow-hidden px-0 pb-1">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={data2h} margin={{ top: 5, right: 35, left: 35, bottom: 0 }}>
                  <CartesianGrid vertical={false} stroke="#ffffff10" strokeDasharray="3 3" />
                  <XAxis dataKey="ts" fontSize={8} tick={{ fill: '#ffffff' }} axisLine={false} tickLine={false} height={12}
                    tickFormatter={t => new Date(t).toLocaleTimeString([], { hour:'2-digit', minute:'2-digit', second:'2-digit', hour12:false })} />
                  <YAxis yAxisId="left" fontSize={8} tick={{ fill: '#ffffff' }} axisLine={false} tickLine={false} width={30} domain={[0,300]} />
                  <YAxis yAxisId="right" orientation="right" fontSize={8} tick={{ fill: '#ffffff' }} axisLine={false} tickLine={false} width={30} domain={[0,40]} />
                  <Line yAxisId="left" type="monotone" dataKey="blockVel" stroke="#00FFD6" strokeWidth={1.2} dot={false} isAnimationActive={false} />
                  <Line yAxisId="right" type="monotone" dataKey="hookload" stroke="#F10238" strokeWidth={1.2} dot={false} isAnimationActive={false} />
                </LineChart>
              </ResponsiveContainer>
              <div className="absolute left-1 top-2 text-[7px] text-white/30 rotate-[-90deg] origin-left">ft/min</div>
              <div className="absolute right-1 top-2 text-[7px] text-white/30 rotate-[90deg] origin-right">klbs</div>
            </div>
          </div>

        </div>
      </div>

      {/* ═══ HISTORICAL VIEW ═══ */}
      {showHistoryModal && (
        <div className="fixed left-0 right-0 bottom-0 z-[9999] flex p-3 select-none" style={{ top: '50px', background: '#32343E' }}>
          <style>{`@keyframes expandCardP{from{opacity:0;transform:scale(0.95)}to{opacity:1;transform:scale(1)}}`}</style>
          <div className="flex-1 flex flex-col overflow-hidden text-white" style={{ background:'#1F1F1F', border:'1px solid #525252', borderRadius:'6px', boxShadow:'0 4px 6px rgba(0,0,0,0.3)', animation:'expandCardP 0.22s cubic-bezier(0.2,0,0,1)', transformOrigin:'center center' }}>
            <div className="h-[40px] shrink-0 flex items-center justify-between px-4 border-b border-[#525252]" style={{ background:'#1F1F1F' }}>
              <button onClick={() => { setShowHistoryModal(false); setIsExportOpen(false); }} className="flex items-center gap-1.5 text-white/45 hover:text-white transition-colors group">
                <ChevronLeft size={14} className="group-hover:-translate-x-0.5 transition-transform" />
                <span className="text-[10px] font-bold uppercase tracking-widest">Dashboard</span>
              </button>
              <div className="flex items-center gap-2">
                <History size={13} className="text-[#47CEAC]/70" />
                <span className="text-[10px] font-black uppercase tracking-widest text-white/80">Exploración Histórica</span>
                <span className="text-white/15 text-[10px]">·</span>
                <span className="text-[10px] font-bold text-white/40 uppercase tracking-wider">{intervention ? intervention.pozo : 'CASTILLA NORTE-407'}</span>
                <span className="text-white/15 text-[10px]">·</span>
                <span className="text-[10px] font-bold text-white/40 uppercase tracking-wider">{intervention ? intervention.torre : 'INDEP-219'}</span>
                <span className="text-white/15 text-[10px]">·</span>
                <span className="text-[10px] font-bold text-white/25 uppercase tracking-wider">{allData.length} pts</span>
              </div>
              <button onClick={() => { setShowHistoryModal(false); setIsExportOpen(false); }} className="w-6 h-6 flex items-center justify-center text-white/30 hover:text-white/70 transition-colors">
                <X size={14} />
              </button>
            </div>
            <div className="flex-1 relative overflow-hidden">
              <div className="absolute inset-0 transition-all duration-300 ease-in-out" style={{ right: isExportOpen ? '400px' : '0' }}>
                <WellChart data={allData} latestPoint={latestPoint} loading={loading} timeWindow="1d" onTimeWindowChange={() => {}} isHistorical={true} showBrushPanel={true} showUnitSelector={true} />
              </div>
              <button onClick={() => setIsExportOpen(!isExportOpen)} className="absolute top-1/2 -translate-y-1/2 z-[160] w-[36px] h-[44px] bg-[#F0F0F0] text-[#121214] rounded-l-full shadow-2xl flex items-center justify-center hover:bg-white transition-all duration-300 ease-in-out" style={{ right: isExportOpen ? '400px' : '0' }}>
                {isExportOpen ? <ChevronRight size={16} className="opacity-80" /> : <Printer size={18} strokeWidth={2.5} className="mr-0.5 opacity-90" />}
              </button>
              <ExportDrawer isOpen={isExportOpen} onClose={() => setIsExportOpen(false)} />
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

const OpCell = ({ val, lbl, sub }: any) => (
  <div className="flex items-center justify-center h-full w-full gap-3 px-1">
    <div className="flex flex-col items-center justify-center shrink-0 min-w-[45px]">
      <span className="text-[22px] font-black text-white leading-none tracking-tight">{val}</span>
      {sub && <span className="text-[9px] text-white font-bold leading-none mt-0.5">{sub}</span>}
    </div>
    <div className="text-[9px] text-[#47CEAC] font-black leading-[1.1] text-left tracking-tight max-w-[80px]">{lbl}</div>
  </div>
);

const TileBox = ({ lbl, v, u, min, max, isPickerOpen, onTogglePicker, vars, currentKey, onSelect }: any) => (
  <div
    className={`rounded-xl flex flex-col items-center relative h-full shadow-lg border border-white/5 ${isPickerOpen ? 'overflow-visible z-[200]' : 'overflow-hidden'}`}
    style={{ background: 'linear-gradient(180deg, rgba(52,52,52,0.9) 0%, rgba(26,26,26,0.8) 100%)' }}
  >
    <div className="pt-2 pb-0 w-full flex justify-center px-2">
      <button
        onClick={onTogglePicker}
        className="flex items-center gap-[3px] group"
      >
        <span className={`text-[10px] font-bold text-center leading-tight transition-colors ${isPickerOpen ? 'text-[#47CEAC]' : 'text-white/80 group-hover:text-[#47CEAC]'}`}>{lbl}</span>
        <svg width="7" height="4" viewBox="0 0 7 4" fill="none" className={`shrink-0 transition-transform ${isPickerOpen ? 'rotate-180' : ''}`}>
          <path d="M0 0L3.5 4L7 0" fill={isPickerOpen ? '#47CEAC' : 'rgba(255,255,255,0.4)'} />
        </svg>
      </button>
    </div>
    <div className="flex-1 flex items-center justify-center gap-1.5 w-full">
      <span className="text-[26px] font-black text-white leading-none tracking-tight">{v}</span>
      <span className="text-[9px] text-white font-bold uppercase mt-2 opacity-80">{u}</span>
    </div>
    <div className="w-full flex flex-col items-start px-4 pb-3">
      <span className="text-[8px] text-white/50 font-bold tracking-wider">Min: {min} {u}</span>
      <span className="text-[8px] text-white/50 font-bold tracking-wider">Max: {max} {u}</span>
    </div>
    <div className="absolute bottom-1.5 left-1/2 -translate-x-1/2 w-16 h-[3px] bg-[#0072D6] rounded-full" />

    {isPickerOpen && vars && (
      <div className="absolute top-0 left-0 right-0 z-[300] rounded-xl overflow-hidden shadow-2xl"
        style={{ background: '#16161a', border: '1px solid rgba(71,206,172,0.3)' }}>
        <div className="px-3 py-1.5 border-b border-white/10 flex items-center gap-1.5">
          <span className="text-[8px] font-black text-[#47CEAC] uppercase tracking-widest">Variable</span>
        </div>
        <div className="max-h-[180px] overflow-y-auto">
          {vars.map((vr: TileVar) => (
            <button
              key={vr.key}
              onClick={() => onSelect(vr.key)}
              className={`w-full flex items-center justify-between px-3 py-[6px] transition-colors hover:bg-white/[0.07] ${vr.key === currentKey ? 'bg-[#47CEAC]/10' : ''}`}
            >
              <span className={`text-[10px] font-bold leading-tight text-left ${vr.key === currentKey ? 'text-[#47CEAC]' : 'text-white/65'}`}>{vr.lbl}</span>
              <span className="text-[8px] text-white/25 font-bold ml-2 shrink-0">{vr.u}</span>
            </button>
          ))}
        </div>
      </div>
    )}
  </div>
);

export default VisualizacionPremium;
