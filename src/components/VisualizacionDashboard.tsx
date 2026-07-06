import React, { useState, useMemo } from 'react';
import { Settings, Info, AlertCircle } from 'lucide-react';
import WellChart from './WellChart';
import SurveyChart from './SurveyChart';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  ResponsiveContainer,
  Cell,
  ReferenceLine,
  CartesianGrid,
  LineChart,
  Line
} from 'recharts';

type TimeWindow = '10m' | '30m' | '1h' | '2h' | '6h' | '12h' | '1d';

interface DashboardProps {
  data: any[];
  data2h: any[];
  latestPoint: any | null;
  loading: boolean;
  meta: any | null;
  timeRange: TimeWindow;
  onTimeRangeChange: (val: TimeWindow) => void;
  isHistorical?: boolean;
}

const VisualizacionDashboard: React.FC<DashboardProps> = ({ data, data2h, latestPoint, loading, meta, timeRange, onTimeRangeChange, isHistorical }) => {
  const [showTorqueSettings, setShowTorqueSettings] = useState(false);
  const [pipeType, setPipeType] = useState('TUBING');
  const [minTorqueInput, setMinTorqueInput] = useState('1240');
  const [maxTorqueInput, setMaxTorqueInput] = useState('2060');
  const [minTorque, setMinTorque] = useState(1240);
  const [maxTorque, setMaxTorque] = useState(2060);

  // Box 8 State
  const [chartType8, setChartType8] = useState<'ciclo'|'juntas'>('ciclo');
  const [showKpiSettings8, setShowKpiSettings8] = useState(false);
  const [kpiValue8, setKpiValue8] = useState(3);
  const [kpiInput8, setKpiInput8] = useState('3');

  // Juntas / Ciclo Mock Data (keeping it visual as before)
  const barData8 = [
    { name: '13:20', val: 5.8 }, { name: '13:25', val: 6.1 }, { name: '13:31', val: 5.9 },
    { name: '13:33:09', val: 7.2 }, { name: '13:40', val: 6.0 }, { name: '13:48:03', val: 6.2 },
    { name: '13:55', val: 5.7 }, { name: '14:02', val: 5.8 }, { name: '14:05:34', val: 6.3 },
  ];

  const juntasData8 = [
    { name: '02:00:00', val: 11 }, { name: '03:30:00', val: 11 }, { name: '05:00:00', val: 3 },
    { name: '06:30:00', val: 9 }, { name: '08:00:00', val: 10 }, { name: '09:30:00', val: 12 },
    { name: '11:00:00', val: 2 }, { name: '12:30:00', val: 11 }, { name: '14:00:00', val: 9 },
  ];

  const getFilteredBarData8 = () => {
    switch(timeRange) {
      case '10m': return barData8.slice(-3);
      case '30m': return barData8.slice(-5);
      default: return barData8;
    }
  };

  const getFilteredJuntasData8 = () => {
    switch(timeRange) {
      case '10m': return juntasData8.slice(-3);
      case '1h': return juntasData8.slice(-6);
      default: return juntasData8;
    }
  };

  const currentBarData8 = chartType8 === 'ciclo' ? getFilteredBarData8() : getFilteredJuntasData8();
  const chartWidth8 = Math.max(260, getFilteredBarData8().length * 40);

  const torqueDataReal = useMemo(() => {
     return currentBarData8.map((d, i) => ({
        time: d.name,
        value: 11000 + (Math.sin(i * 45) * 500)
     }));
  }, [currentBarData8]);

  const barHeight = 45;
  const chartHeight14 = Math.max(160, torqueDataReal.length * barHeight);

  const getPeriodoText = (t: TimeWindow) => {
    switch(t) {
      case '10m': return '10 MINUTOS';
      case '30m': return '30 MINUTOS';
      case '1h': return '1 HORA';
      case '2h': return '2 HORAS';
      case '6h': return '6 HORAS';
      case '12h': return '12 HORAS';
      case '1d': return '1 D\u00cdA';
      default: return '';
    }
  };

  return (
    <div className="flex flex-col gap-2 h-full w-full overflow-hidden select-none">
      <svg width="0" height="0" className="absolute">
        <defs>
          <linearGradient id="torqueGradient" x1="0" y1="0" x2="1" y2="0">
            <stop offset="0%" stopColor="#FFD500" stopOpacity={1} />
            <stop offset="100%" stopColor="#B37700" stopOpacity={1} />
          </linearGradient>
          <linearGradient id="gradientSencillo" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#09BC96" stopOpacity={1} />
            <stop offset="100%" stopColor="#09BC96" stopOpacity={0.2} />
          </linearGradient>
          <linearGradient id="gradientDoble" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#0B5799" stopOpacity={1} />
            <stop offset="100%" stopColor="#0B5799" stopOpacity={0.2} />
          </linearGradient>
        </defs>
      </svg>

      {/* ═══ TOP ROW: Metrics Bar (Full Width) ═══ */}
         <div className="flex gap-2 shrink-0 h-[125px]">

               {/* Weather Widget */}
               <div className="w-[300px] shrink-0 glass-panel flex flex-col bg-[#1c1c1e] relative overflow-hidden border border-white/5 px-3 py-2">
                  {/* Top: Today's weather */}
                  <div className="flex items-start gap-3 flex-1">
                     <div className="flex flex-col items-start">
                        <span className="text-[11px] font-bold text-white/50 uppercase tracking-wider">Hoy</span>
                        <span className="text-[28px] font-black text-white leading-none mt-1">31°C</span>
                     </div>
                     <div className="flex items-center justify-center mt-1">
                        <svg width="38" height="38" viewBox="0 0 64 64" fill="none">
                           <circle cx="28" cy="26" r="10" fill="#ffffff"/>
                           <g stroke="#ffffff" strokeWidth="2.5" strokeLinecap="round">
                              <line x1="28" y1="10" x2="28" y2="14"/>
                              <line x1="28" y1="38" x2="28" y2="42"/>
                              <line x1="14" y1="26" x2="18" y2="26"/>
                              <line x1="38" y1="26" x2="42" y2="26"/>
                              <line x1="18" y1="16" x2="21" y2="19"/>
                              <line x1="35" y1="33" x2="38" y2="36"/>
                              <line x1="38" y1="16" x2="35" y2="19"/>
                              <line x1="21" y1="33" x2="18" y2="36"/>
                           </g>
                           <ellipse cx="42" cy="38" rx="12" ry="8" fill="#666666"/>
                           <ellipse cx="36" cy="36" rx="8" ry="7" fill="#888888"/>
                           <ellipse cx="46" cy="36" rx="7" ry="6" fill="#777777"/>
                        </svg>
                     </div>
                     <div className="flex flex-col items-start flex-1 mt-0.5">
                        <div className="flex items-center gap-1">
                           <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="#ffffff80" strokeWidth="2.5"><circle cx="12" cy="10" r="3"/><path d="M12 2C7.58 2 4 5.58 4 10c0 5.5 8 12 8 12s8-6.5 8-12c0-4.42-3.58-8-8-8z"/></svg>
                           <span className="text-[11px] font-black text-white/80 uppercase tracking-tight">CANTAGALLO</span>
                        </div>
                        <span className="text-[9px] text-white/50 font-bold mt-1">Parcialmente nublado</span>
                        <span className="text-[9px] text-white/50 font-bold">Viento: 5 km/h</span>
                     </div>
                  </div>
                  {/* Bottom: 3-day forecast */}
                  <div className="flex items-center justify-start gap-4 border-t border-white/10 pt-1.5 mt-1">
                     {[
                        { day: 'Sab', hi: '32°C', lo: '22°C', icon: '☀' },
                        { day: 'Dom', hi: '32°C', lo: '21°C', icon: '☁' },
                        { day: 'Lun', hi: '33°C', lo: '21°C', icon: '☁' },
                     ].map((d, i) => (
                        <div key={i} className="flex flex-col items-center gap-0.5">
                           <span className="text-[8px] font-bold text-white/40 uppercase">{d.day}</span>
                           <span className="text-[13px] leading-none text-white/50">{d.icon}</span>
                           <span className="text-[10px] font-black text-white/70 leading-none">{d.hi}</span>
                           <span className="text-[9px] font-bold text-white/30 leading-none">{d.lo}</span>
                        </div>
                     ))}
                  </div>
               </div>

              {/* Box 8: Cycle Chart */}
              <div className="glass-panel p-2 flex flex-col relative overflow-visible">
                 <button 
                    className="absolute left-1 top-1 w-6 h-6 rounded-full bg-[#353741] border border-white/20 flex items-center justify-center hover:bg-[#444654] z-20 transition-all shadow-lg"
                    onClick={() => setShowKpiSettings8(!showKpiSettings8)}
                 >
                    <Settings size={12} className="text-white" />
                 </button>

                 <div className="absolute top-1 left-0 right-0 pointer-events-none flex justify-center z-10">
                    <span className="text-[11px] font-bold text-white uppercase tracking-widest leading-none drop-shadow-md">
                       {chartType8 === 'ciclo' ? 'CICLO CUÑA A CUÑA' : 'JUNTAS POR HORA'}
                    </span>
                 </div>

                 <button 
                    className="absolute right-1 top-1 w-6 h-6 rounded-full bg-[#353741] border border-white/10 flex items-center justify-center hover:bg-[#444654] z-20 transition-all shadow-lg"
                    onClick={() => setChartType8(chartType8 === 'ciclo' ? 'juntas' : 'ciclo')}
                 >
                    <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" className="text-white">
                       <polyline points="17 1 21 5 17 9" />
                       <path d="M3 11V9a4 4 0 0 1 4-4h14" />
                       <polyline points="7 23 3 19 7 15" />
                       <path d="M21 13v2a4 4 0 0 1-4 4H3" />
                     </svg>
                 </button>

                 {showKpiSettings8 && (
                  <div className="absolute top-0 left-0 z-[100] bg-[#1F1F1F] rounded-lg p-3 w-[150px] shadow-2xl border border-white/10 flex flex-col">
                     <div className="flex items-center gap-2 mb-3">
                        <span className="text-[10px] font-bold text-white uppercase tracking-widest">KPI</span>
                        <input type="number" value={kpiInput8} onChange={(e) => setKpiInput8(e.target.value)} className="w-full ml-1 p-1 text-[13px] text-black h-7 bg-white font-bold" />
                     </div>
                     <button 
                        onClick={() => { setKpiValue8(Number(kpiInput8)); setShowKpiSettings8(false); }}
                        className="w-full bg-[#47CEAC] text-black font-extrabold text-[12px] py-1.5 hover:bg-[#34a889] transition-colors"
                     >
                        Actualizar
                     </button>
                  </div>
                 )}

                 <div className="flex-1 mt-7 relative overflow-hidden flex gap-1">
                    <span className="absolute left-1 -top-4 text-[7px] font-bold text-white uppercase italic">{chartType8 === 'ciclo' ? 'minutos' : 'juntas'}</span>
                    
                    <div className="flex-1 overflow-x-auto custom-scrollbar-x pb-1">
                       <div style={{ width: chartWidth8, height: '90%' }}>
                          <ResponsiveContainer width="100%" height="100%">
                             <BarChart data={currentBarData8} margin={{ top: 4, right: 4, left: 0, bottom: 16 }}>
                                <XAxis dataKey="name" fontSize={7} tick={{ fill: '#ffffff' }} tickLine={false} axisLine={{ stroke: '#ffffff40' }} height={16} />
                                <YAxis fontSize={7} tick={{ fill: '#ffffff' }} tickLine={false} axisLine={false} domain={[0, chartType8 === 'ciclo' ? 10 : 14]} width={22} />
                                <CartesianGrid vertical={false} stroke="#333" />
                                <Bar dataKey="val" radius={[1, 1, 0, 0]} barSize={chartType8 === 'ciclo' ? 10 : 12}>
                                   {currentBarData8.map((_, i) => (
                                      <Cell key={i} fill={chartType8 === 'juntas' ? '#8b5cf6' : (i % 2 === 0 ? 'url(#gradientSencillo)' : 'url(#gradientDoble)')} />
                                   ))}
                                </Bar>
                                {kpiValue8 > 0 && <ReferenceLine y={kpiValue8} stroke="#ef4444" strokeWidth={1.5} label={{ position: 'top', value: `KPI: ${kpiValue8}`, fill: '#fff', fontSize: 10, fontWeight: 'bold' }} />}
                             </BarChart>
                          </ResponsiveContainer>
                       </div>
                    </div>

                     <div className={`w-[60px] flex flex-col justify-center gap-2 border-l border-white/5 pl-2 shrink-0 ${chartType8 !== 'ciclo' ? 'invisible' : ''}`}>
                          <div className="flex flex-col items-center gap-1">
                              <div className="w-8 h-4 rounded bg-[#09BC96]" />
                              <span className="text-[7px] text-white font-bold uppercase truncate">Sencillo</span>
                          </div>
                          <div className="flex flex-col items-center gap-1">
                              <div className="w-8 h-4 rounded bg-[#0B5799]" />
                              <span className="text-[7px] text-white font-bold uppercase truncate">Doble</span>
                          </div>
                       </div>
                 </div>
              </div>
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
                        <div className="flex-1 flex flex-col">
                           <div className="flex-1 border-b border-[#525252] flex items-center justify-center">
                              <span className="text-[26px] font-extrabold text-white tracking-widest leading-none">RIH</span>
                           </div>
                           <div className="flex-1 flex">
                              <div className="flex-1 border-r border-[#525252]"><OpCell val="12.50" lbl="Juntas / Hora" sub="" /></div>
                              <div className="flex-1"><OpCell val="0.87" lbl="Conexión - Desconexión" sub="horas" /></div>
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

      {/* ═══ MAIN CONTENT: Center + Right Side by Side ═══ */}
      <div className="flex gap-2 flex-1 min-h-0 w-full">

       {/* ═══ CENTER COLUMN (WellChart) ═══ */}
       <div className="flex flex-[2.2] flex-col gap-2 min-w-0 h-full">
         <div className="flex-1 min-h-0 glass-panel overflow-hidden p-0 relative">
            <WellChart data={data} latestPoint={latestPoint} loading={loading} timeWindow={timeRange} onTimeWindowChange={onTimeRangeChange} isHistorical={isHistorical} />
         </div>
       </div>

       {/* ═══ RIGHT COLUMN ═══ */}
       <div className="flex flex-col flex-1 gap-2 h-full min-w-0">
         {/* Alarmas & Survey */}
         <div className="grid grid-cols-[1.4fr_1fr] gap-2 h-[220px] shrink-0">
            <div className="glass-panel p-3 flex flex-col">
               <span className="text-[12px] font-black text-white uppercase tracking-tight mb-0.5">INDEP-219 - CASTILLA NORTE-407</span>
               <span className="text-[11px] font-bold text-white mb-4">Alarmas - Alertas</span>
               
               <div className="flex-1 flex flex-col items-center justify-center">
                  <div className="w-full rounded-lg border border-white/10 bg-gradient-to-b from-[#3B3B3B] to-[#111111] p-4 flex items-center gap-4 shadow-xl">
                     <div className="w-10 h-10 rounded-lg bg-black/40 border border-white/5 flex items-center justify-center shrink-0 shadow-inner">
                        <AlertCircle size={22} className="text-white/90" />
                     </div>
                     <span className="text-[11px] font-bold text-white tracking-tight">No hay alarmas o alertas.</span>
                  </div>
               </div>
            </div>
            <div className="glass-panel overflow-hidden p-0">
               <SurveyChart />
            </div>
         </div>

         {/* Tile Grid & Torque Bars */}
         <div className="grid grid-cols-[1.4fr_1fr] gap-2 flex-1 min-h-0">
             <div className="glass-panel grid grid-cols-2 grid-rows-3 gap-2 overflow-hidden bg-[#1D1D20] p-3">
                <TileBox lbl="Barriles por Minuto" v={latestPoint?.flow?.toFixed(1) || "0.0"} u="Bbls/min" min="0" max="15" />
                <TileBox lbl="Presión Bomba" v={latestPoint?.pump?.toFixed(0) || "0"} u="psi" min="0" max="3000" />
                <TileBox lbl="RPM Mesa Rotaria" v={latestPoint?.spm?.toFixed(0) || "0"} u="rpm" min="0" max="200" />
                <TileBox lbl="Torque Mesa Rotaria" v={latestPoint?.torque?.toFixed(1) || "0.0"} u="lbs-ft" min="0" max="15000" />
                <TileBox lbl="Peso Sobre Broca" v={latestPoint?.wob?.toFixed(1) || "0.0"} u="Klb" min="-30" max="30" />
                <TileBox lbl="ROP" v={latestPoint?.blockVel?.toFixed(1) || "0.0"} u="ft/min" min="0" max="350" />
             </div>
            
            {/* Box 14: Torques Aplicados (Vertical Scroll) */}
            <div className="glass-panel px-4 py-3 flex flex-col relative overflow-visible z-10 w-full min-h-0">
                <button 
                  className="absolute left-1 top-1 w-7 h-7 rounded-full bg-[#353741] border border-white/20 flex items-center justify-center hover:bg-[#444654] z-20 transition-all shadow-lg"
                  onClick={() => setShowTorqueSettings(!showTorqueSettings)}
                >
                  <Settings size={14} className="text-white" />
                </button>
                <div className="absolute top-2 left-0 right-0 pointer-events-none flex justify-center z-10">
                    <span className="text-[11px] font-bold text-white uppercase tracking-widest leading-none drop-shadow-md">Torques Aplicados</span>
                </div>

                {showTorqueSettings && (
                  <div className="absolute top-0 left-0 z-[100] bg-[#525252] rounded-lg p-3 w-[160px] shadow-2xl border border-white/5 flex flex-col">
                     <span className="text-[10px] font-bold text-white uppercase tracking-widest mb-2">Configurar Límites</span>
                     <select 
                        value={pipeType}
                        onChange={(e) => setPipeType(e.target.value)}
                        className="w-full mb-3 bg-white text-black text-[11px] p-1 h-7 border-none font-bold"
                     >
                        <option>TUBING</option><option>DRILL PIPE</option><option>MANUAL</option>
                     </select>
                     <div className="flex items-center gap-2 mb-2">
                        <span className="text-[9px] text-white">MIN</span>
                        <input type="number" value={minTorqueInput} onChange={(e) => setMinTorqueInput(e.target.value)} className="w-full p-1 text-[11px] text-black h-6 bg-white font-bold" />
                     </div>
                     <div className="flex items-center gap-2 mb-4">
                        <span className="text-[9px] text-white">MAX</span>
                        <input type="number" value={maxTorqueInput} onChange={(e) => setMaxTorqueInput(e.target.value)} className="w-full p-1 text-[11px] text-black h-6 bg-white font-bold" />
                     </div>
                     <button 
                        onClick={() => { setMinTorque(Number(minTorqueInput)); setMaxTorque(Number(maxTorqueInput)); setShowTorqueSettings(false); }}
                        className="w-full bg-[#47CEAC] text-black font-extrabold text-[11px] py-1.5 hover:bg-[#34a889]"
                     >
                        Actualizar
                     </button>
                  </div>
                )}

                <div className="flex-1 w-full mt-7 relative z-0 overflow-y-auto pr-1 custom-scrollbar">
                    <div style={{ height: chartHeight14 }}>
                        <ResponsiveContainer width="100%" height="100%">
                           <BarChart data={torqueDataReal} layout="vertical" margin={{ top: 10, right: 10, left: -25, bottom: 0 }}>
                              <XAxis type="number" hide domain={[0, 15000]} />
                              <YAxis type="category" dataKey="time" fontSize={8} tick={{ fill: '#ffffff' }} tickLine={false} axisLine={false} width={60} />
                              <Bar dataKey="value" fill="url(#torqueGradient)" barSize={25} radius={[0, 2, 2, 0]} isAnimationActive={false} />
                              <ReferenceLine x={minTorque} stroke="#3b82f6" strokeWidth={2} />
                              <ReferenceLine x={maxTorque} stroke="#ef4444" strokeWidth={2} />
                           </BarChart>
                        </ResponsiveContainer>
                    </div>
                </div>

                <div className="h-[25px] w-full shrink-0 mt-1">
                    <ResponsiveContainer width="100%" height="100%">
                        <BarChart data={[]} layout="vertical" margin={{ top: 5, right: 10, left: 45, bottom: 0 }}>
                            <XAxis type="number" domain={[0, 15000]} orientation="top" fontSize={8} tick={{ fill: '#ffffff' }} axisLine={{stroke: '#ffffff40'}} tickLine={false} tickFormatter={(v) => v.toLocaleString()} />
                        </BarChart>
                    </ResponsiveContainer>
                </div>
            </div>
         </div>

         {/* Bottom Row Layout: Gases, Winch, and Box 15 */}
         <div className="flex gap-2 h-[130px] shrink-0 mb-0 w-full">
            {/* Box 5 & 6: Nivel de Gases & Tonelada Milla */}
            <div className="w-[250px] shrink-0 flex gap-2 h-full">
               {/* Box 5: Nivel de Gases */}
               <div className="glass-panel flex-1 flex flex-col items-center pt-2 pb-1 bg-[#1D1D20] relative">
                  <span className="text-[11px] font-black text-white tracking-widest uppercase drop-shadow-sm leading-none whitespace-nowrap">NIVEL DE GASES</span>
                  <span className="text-[9px] font-bold text-white/90 uppercase tracking-widest mt-2">BOCA TANQUE</span>

                  <div className="flex-1 flex w-full relative items-center justify-center gap-3 mt-1 mb-2">
                     {/* Grid 2x2 with lines */}
                     <div className="relative w-[50px] h-[50px] flex items-center justify-center">
                        {/* Cross lines */}
                        <div className="absolute w-full h-[1.5px] bg-white top-1/2 -translate-y-1/2"></div>
                        <div className="absolute h-full w-[1.5px] bg-white left-1/2 -translate-x-1/2"></div>
                        {/* Numbers */}
                        <span className="absolute top-1 left-[8px] text-[11px] font-bold text-white">0</span>
                        <span className="absolute top-1 right-[8px] text-[11px] font-bold text-white">0</span>
                        <span className="absolute bottom-1 left-[8px] text-[11px] font-bold text-white">0</span>
                        <span className="absolute bottom-1 right-[8px] text-[11px] font-bold text-white">0</span>
                     </div>

                     {/* Legends */}
                     <div className="flex flex-col gap-1 items-center pb-1">
                        <div className="flex flex-col items-center leading-[1.1] text-[#F59B22]">
                           <span className="text-[11px] font-black uppercase">LEL</span>
                           <span className="text-[10px] font-black">(%)</span>
                        </div>
                        <div className="flex flex-col items-center leading-[1.1] text-[#F59B22] mt-1">
                           <span className="text-[11px] font-black uppercase">H2S</span>
                           <span className="text-[10px] font-black">ppm</span>
                        </div>
                     </div>
                  </div>
               </div>

               {/* Box 6: Tonelada Milla */}
               <div className="glass-panel flex-1 flex flex-col bg-[#1D1D20] relative overflow-hidden pl-2 pr-2 pt-2 pb-1">
                  {/* Winch SVG Background */}
                  <div className="absolute top-[0px] bottom-0 -right-4 w-[110px] flex items-center justify-center opacity-70 pointer-events-none">
                     <svg viewBox="0 0 100 80" className="w-[100%] h-full" preserveAspectRatio="xMidYMid slice">
                        {/* Left Flange */}
                        <rect x="25" y="10" width="8" height="60" fill="#a1a1aa" />
                        <rect x="21" y="5" width="16" height="70" fill="#A88126" />

                        {/* Right Flange */}
                        <rect x="85" y="10" width="8" height="60" fill="#a1a1aa" />
                        <rect x="81" y="5" width="16" height="70" fill="#A88126" />

                        {/* Center Drum */}
                        <rect x="37" y="15" width="44" height="50" fill="#3f3f46" />

                        {/* Wire Rope Coils */}
                        {[...Array(9)].map((_, i) => (
                           <rect key={i} x={39 + (i * 4.8)} y="15" width="3.5" height="50" fill="#52525b" rx="1.5" />
                        ))}

                        {/* Cable going down */}
                        <rect x="49" y="65" width="3.5" height="20" fill="#a1a1aa" />
                     </svg>
                  </div>

                  {/* Contents */}
                  <div className="relative z-10 w-full flex flex-col h-full pt-1">
                     <div className="w-full text-center mb-1">
                        <span className="text-[11px] font-black text-white tracking-wider uppercase drop-shadow-md whitespace-nowrap">TONELADA MILLA</span>
                     </div>
                     <div className="flex-1 flex flex-col justify-center items-start pl-2 text-left">
                        <span className="text-[28px] font-black text-white leading-none drop-shadow-[0_2px_4px_rgba(0,0,0,1)]">181.98</span>
                     </div>
                  </div>
               </div>
            </div>

            {/* Box 15: Lower Trend Chart - Velocidad con Carga & Valor de Carga */}
            <div className="glass-panel flex-1 overflow-hidden flex flex-col mb-0 relative">
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
                      <XAxis 
                        dataKey="ts" 
                        fontSize={8} 
                        tick={{ fill: '#ffffff' }} 
                        axisLine={false} 
                        tickLine={false}
                        height={12}
                        tickFormatter={(t) => new Date(t).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit', hour12: false })}
                      />
                      
                      {/* Left Y-Axis: Velocity */}
                      <YAxis 
                        yAxisId="left"
                        fontSize={8} 
                        tick={{ fill: '#ffffff' }} 
                        axisLine={false} 
                        tickLine={false}
                        width={30}
                        domain={[0, 300]}
                        tickFormatter={(v) => `${v}`}
                      />
                      
                      {/* Right Y-Axis: Load */}
                      <YAxis 
                        yAxisId="right"
                        orientation="right"
                        fontSize={8} 
                        tick={{ fill: '#ffffff' }} 
                        axisLine={false} 
                        tickLine={false}
                        width={30}
                        domain={[0, 40]}
                        tickFormatter={(v) => `${v}`}
                      />
                      
                      <Line 
                        yAxisId="left"
                        type="monotone" 
                        dataKey="blockVel" 
                        stroke="#00FFD6" 
                        strokeWidth={1.2} 
                        dot={false} 
                        isAnimationActive={false} 
                      />
                      <Line 
                        yAxisId="right"
                        type="monotone" 
                        dataKey="hookload" 
                        stroke="#F10238" 
                        strokeWidth={1.2} 
                        dot={false} 
                        isAnimationActive={false} 
                      />
                   </LineChart>
                </ResponsiveContainer>
                
                {/* Manual labels to save Y-axis space if needed */}
                <div className="absolute left-1 top-2 text-[7px] text-white/30 rotate-[-90deg] origin-left">ft/min</div>
                <div className="absolute right-1 top-2 text-[7px] text-white/30 rotate-[90deg] origin-right">klbs</div>
            </div>
            </div>
         </div>
       </div>
      </div>
    </div>
  );
};

const OpCell = ({ val, lbl, sub }: any) => (
  <div className="flex items-center justify-center h-full w-full gap-3 px-1">
     <div className="flex flex-col items-center justify-center shrink-0 min-w-[45px]">
        <span className="text-[22px] font-black text-white leading-none tracking-tight">{val}</span>
        {sub && (
          <span className="text-[9px] text-white font-bold leading-none mt-0.5">{sub}</span>
        )}
     </div>
     <div className="text-[9px] text-[#47CEAC] font-black leading-[1.1] text-left tracking-tight max-w-[80px]">
        {lbl}
     </div>
  </div>
);

const TileBox = ({ lbl, v, u, min, max }: any) => (
  <div className="rounded-xl flex flex-col items-center relative overflow-hidden h-full shadow-lg border border-white/5"
       style={{ background: 'linear-gradient(180deg, rgba(52,52,52,0.9) 0%, rgba(26,26,26,0.8) 100%)' }}>
     {/* Title */}
     <div className="pt-3 pb-1 w-full flex justify-center">
        <span className="text-[10px] font-bold text-white text-center opacity-90">{lbl}</span>
     </div>
     
     {/* Main Value and Unit */}
     <div className="flex-1 flex items-center justify-center gap-1.5 w-full">
        <span className="text-[26px] font-black text-white leading-none tracking-tight">{v}</span>
        <span className="text-[9px] text-white font-bold uppercase mt-2 opacity-80">{u}</span>
     </div>
     
     {/* Limits */}
     <div className="w-full flex flex-col items-start px-4 pb-4">
        <span className="text-[8px] text-white/50 font-bold tracking-wider">Min: {min} {u}</span>
        <span className="text-[8px] text-white/50 font-bold tracking-wider">Max: {max} {u}</span>
     </div>

     {/* Blue bottom line indicator */}
     <div className="absolute bottom-1.5 left-1/2 -translate-x-1/2 w-16 h-[3px] bg-[#0072D6] rounded-full" />
  </div>
);

export default VisualizacionDashboard;
