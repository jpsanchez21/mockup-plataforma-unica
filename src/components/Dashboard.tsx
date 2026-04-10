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
}

const Dashboard: React.FC<DashboardProps> = ({ data, data2h, latestPoint, loading, meta, timeRange, onTimeRangeChange }) => {
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
  const chartWidth8 = Math.max(260, currentBarData8.length * 40);

  const torqueDataReal = useMemo(() => {
     // The horizontal bars match exactly the connections presented in Fig 10 (currentBarData8)
     return currentBarData8.map((d, i) => ({
        time: d.name,
        value: 11000 + (Math.sin(i * 45) * 500) // Mock torque value around 11000 klb-ft to match mockup visual size
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
      case '1d': return '1 DÍA';
      default: return '';
    }
  };

  return (
    <div className="flex gap-2 h-full w-full overflow-hidden select-none">
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

      {/* ═══ CENTER COLUMN ═══ */}
      <div className="flex flex-[1.6] flex-col gap-2 min-w-0 h-full">
         
         <div className="flex gap-2 shrink-0 h-[125px]">
              {/* Box 7: Metrics Grid */}
              <div className="glass-panel flex flex-col flex-1 relative overflow-hidden">
                 <div className="text-center pt-[2px] pb-[1px] shrink-0">
                    <span className="text-[10px] font-bold text-white tracking-widest uppercase">
                       MÉTRICAS DE LAS ÚLTIMAS {getPeriodoText(timeRange)}
                    </span>
                 </div>
                 
                 <div className="flex-1 flex flex-col items-center justify-center w-full px-5 py-2">
                    <div className="w-full h-full flex flex-col">
                        {/* Top Row */}
                        <div className="flex-1 flex border-b-2 border-[#525252]">
                           {/* RIH Cell */}
                           <div className="flex-[0.9] flex items-center justify-center border-r-2 border-[#525252] bg-gradient-to-r from-transparent via-white/5 to-white/10 shadow-inner">
                              <span className="text-[30px] font-extrabold text-white tracking-widest shadow-md drop-shadow">RIH</span>
                           </div>
                           
                           <div className="flex-1 border-r-2 border-[#525252]">
                              <OpCell val="0.27" lbl="Bloque Subiendo" sub="horas" />
                           </div>
                           
                           <div className="flex-1 border-r-2 border-[#525252]">
                              <OpCell val="0.30" lbl="Bloque Bajando" sub="horas" />
                           </div>
                           
                           <div className="flex-1">
                              <OpCell val="0.00" lbl="Tiempo Circulación" sub="horas" />
                           </div>
                        </div>

                        {/* Bottom Row */}
                        <div className="flex-1 flex">
                           <div className="flex-[0.9] border-r-2 border-[#525252]">
                              <OpCell val="12.50" lbl="Juntas / Hora" sub="" />
                           </div>

                           <div className="flex-1 border-r-2 border-[#525252]">
                              <OpCell val="1.42" lbl="Bloque Detenido" sub="horas" />
                           </div>
                           
                           <div className="flex-1 border-r-2 border-[#525252]">
                              <OpCell val="0.00" lbl="Molienda, Limpieza o Rectificaciones" sub="horas" />
                           </div>
                           
                           <div className="flex-1">
                              <OpCell val="0.00" lbl="Tiempo Pruebas Presión" sub="horas" />
                           </div>
                        </div>
                    </div>
                 </div>
              </div>

              {/* Box 8: Cycle Chart */}
              <div className="glass-panel w-[35%] shrink-0 p-2 flex flex-col relative overflow-visible">
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

                    {chartType8 === 'ciclo' && (
                       <div className="w-[60px] flex flex-col justify-center gap-2 border-l border-white/5 pl-2 shrink-0">
                          <div className="flex flex-col items-center gap-1">
                              <div className="w-8 h-4 rounded bg-[#09BC96]" />
                              <span className="text-[7px] text-white font-bold uppercase truncate">Sencillo</span>
                          </div>
                          <div className="flex flex-col items-center gap-1">
                              <div className="w-8 h-4 rounded bg-[#0B5799]" />
                              <span className="text-[7px] text-white font-bold uppercase truncate">Doble</span>
                          </div>
                       </div>
                    )}
                 </div>
              </div>
         </div>

         {/* Box 10: WellChart (Main Data Plot) */}
         <div className="flex-1 min-h-0 glass-panel overflow-hidden p-0 relative">
            <WellChart data={data} latestPoint={latestPoint} loading={loading} timeWindow={timeRange} onTimeWindowChange={onTimeRangeChange} />
         </div>
      </div>

      {/* ═══ RIGHT COLUMN ═══ */}
      <div className="flex flex-col flex-1 gap-2 h-full min-w-0">
         
         {/* Box 9: Connection Metrics */}
         <div className="glass-panel flex flex-col shrink-0 h-[125px] relative overflow-hidden">
            <div className="text-center pt-[2px] pb-[1px] shrink-0">
               <span className="text-[10px] font-bold text-white tracking-widest uppercase">
                  MÉTRICAS DE LAS ÚLTIMAS {getPeriodoText(timeRange)}
               </span>
            </div>
            
            <div className="flex-1 flex flex-col items-center justify-center w-full px-5 py-2">
               <div className="w-full h-full flex flex-col">
                  {/* Top Row */}
                  <div className="flex-1 flex border-b-2 border-[#525252]">
                     <div className="flex-1 border-r-2 border-[#525252]">
                        <OpCell val="0.41" lbl="Mov Bloque Fuera Cuñas" sub="horas" />
                     </div>
                     <div className="flex-1 border-r-2 border-[#525252]">
                        <OpCell val="0.87" lbl="Conexión - Desconexión" sub="horas" />
                     </div>
                     <div className="flex-1">
                        <OpCell val="0.00" lbl="Contador Pruebas Presión" sub="horas" />
                     </div>
                   </div>

                   {/* Bottom Row */}
                   <div className="flex-1 flex">
                      <div className="flex-1 border-r-2 border-[#525252]">
                         <OpCell val="0.22" lbl="Mov Bloque en Cuñas" sub="horas" />
                      </div>
                      <div className="flex-1 border-r-2 border-[#525252]">
                         <OpCell val="0.51" lbl="En Cuñas" sub="horas" />
                      </div>
                      <div className="flex-1">
                         <OpCell val="0.00" lbl="Tiempo Pruebas Presión" sub="horas" />
                      </div>
                   </div>
               </div>
            </div>
         </div>

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

         {/* Box 15: Lower Trend Chart - Velocidad con Carga & Valor de Carga */}
         <div className="glass-panel h-[130px] shrink-0 overflow-hidden flex flex-col mb-0">
            <div className="flex justify-between items-center px-4 py-1 bg-transparent">
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
  );
};

const OpCell = ({ val, lbl, sub }: any) => (
  <div className="flex items-center justify-center h-full w-full gap-3 px-1">
     <div className="flex flex-col items-center justify-center shrink-0 min-w-[45px]">
        <span className="text-[22px] font-black text-white leading-none tracking-tight">{val}</span>
        {sub && (
          <div className="flex flex-col items-center w-full mt-1">
             <div className="w-8 h-[1.5px] bg-white/20 mb-1" />
             <span className="text-[9px] text-white font-bold leading-none">{sub}</span>
          </div>
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

export default Dashboard;
