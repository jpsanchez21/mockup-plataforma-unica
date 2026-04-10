import React, { useState, useMemo } from 'react';
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  ResponsiveContainer,
} from 'recharts';
import { Settings, X, Plus, Minus } from 'lucide-react';
import { TimeWindow, DataPoint } from '../hooks/useSkanviewData';

interface TraceConfig {
  id: string;
  label: string;
  unit: string;
  color: string;
  min: number;
  max: number;
  trackIndex: number;
}

const INITIAL_TRACES: TraceConfig[] = [
  // Track 0
  { id: 'wob', label: 'Peso Sobre Broca', unit: 'Klb', color: '#2D9113', min: -5, max: 15, trackIndex: 0 },
  { id: 'tubes', label: 'Contador Tuberia', unit: 'tubos', color: '#06BFC2', min: 0, max: 100, trackIndex: 0 },
  { id: 'depth', label: 'Profundidad', unit: 'ft', color: '#1477D2', min: 0, max: 2000, trackIndex: 0 },
  // Track 1
  { id: 'hookload', label: 'Carga Gancho', unit: 'Klb', color: '#D2D206', min: 0, max: 50, trackIndex: 1 },
  { id: 'blockVel', label: 'Velocidad Bloque', unit: 'ft/min', color: '#38808C', min: 0, max: 200, trackIndex: 1 },
  { id: 'blockPos', label: 'Posición Bloque', unit: 'ft', color: '#AC0653', min: 0, max: 100, trackIndex: 1 },
  // Track 2
  { id: 'flow', label: 'Caudal', unit: 'Bbls/min', color: '#AC0653', min: 0, max: 10, trackIndex: 2 },
  { id: 'spm', label: 'Strokes por Minuto', unit: 'SPM', color: '#BE5C32', min: 0, max: 100, trackIndex: 2 },
  { id: 'pump', label: 'Presión Bomba', unit: 'psi', color: '#13D23C', min: 0, max: 30, trackIndex: 2 },
  // Track 3
  { id: 'torqPot', label: 'Torque Llave Pot Max', unit: 'lb-ft', color: '#13D23C', min: 0, max: 5000, trackIndex: 3 },
  { id: 'torque', label: 'Torque', unit: 'lb-ft', color: '#C80606', min: -100, max: 100, trackIndex: 3 },
  { id: 'torqHid', label: 'Torque Hidraulica', unit: 'lb-ft', color: '#06D2D2', min: 0, max: 5000, trackIndex: 3 },
];

const TIME_WINDOWS: { v: TimeWindow; l: string }[] = [
  { v: '10m', l: '10min' },
  { v: '30m', l: '30min' },
  { v: '1h', l: '1hr' },
  { v: '2h', l: '2hr' },
  { v: '6h', l: '6hr' },
  { v: '12h', l: '12hr' },
  { v: '1d', l: '1d' },
];

const TraceHeader = ({ trace }: { trace: TraceConfig }) => {
  const mid = (trace.min + trace.max) / 2;
  return (
    <div className="flex flex-col items-center mb-1.5 w-full px-2">
      <span className="text-[11px] font-black truncate w-full text-center mb-0.5" style={{ color: trace.color }}>
        {trace.label}
      </span>
      <div className="w-full flex justify-between text-[9px] font-bold mb-0.5" style={{ color: trace.color }}>
          <span>{trace.min}</span>
          <span>{mid}</span>
          <span>{trace.max}</span>
      </div>
      <div className="w-full h-1 relative flex items-center">
         <div className="w-full h-[1px] bg-white/20"></div>
         <div className="absolute left-0 h-full w-[1.5px] bg-white/40"></div>
         <div className="absolute left-1/2 -translate-x-1/2 h-full w-[1.5px] bg-white/40"></div>
         <div className="absolute right-0 h-full w-[1.5px] bg-white/40"></div>
      </div>
    </div>
  );
};

const TraceLegendEditor = ({ 
  trace, 
  val, 
  isEditing, 
  onEdit, 
  onUpdate 
}: { 
  trace: TraceConfig; 
  val: string; 
  isEditing: boolean; 
  onEdit: () => void;
  onUpdate: (t: TraceConfig) => void;
}) => {
  const [local, setLocal] = useState(trace);
  
  React.useEffect(() => {
     setLocal(trace);
  }, [trace]);

  const handleChange = (key: keyof TraceConfig, value: any) => {
    const next = { ...local, [key]: value };
    setLocal(next);
    onUpdate(next);
  };

  return (
    <div className={`w-full flex flex-col mb-1 last:mb-0 transition-all duration-200 overflow-hidden pointer-events-auto ${isEditing ? 'bg-[#1a1a1b] border border-white/30 rounded shadow-2xl' : 'bg-white/[0.03] border border-white/5 rounded'}`}>
  
      <button 
        onClick={onEdit}
        className="w-full flex items-center gap-2 p-1.5 hover:bg-white/10 transition-colors h-[42px] shrink-0"
      >
         <div className="w-2 h-full min-h-[28px] rounded-sm shrink-0" style={{ backgroundColor: trace.color }}></div>
         <div className="flex flex-col items-start min-w-0 flex-1">
            <span className="text-[10px] text-white font-medium leading-tight text-left w-full break-words line-clamp-2">{trace.label}</span>
         </div>
         <div className="flex flex-col items-end shrink-0 pl-1">
            <span className="text-[14px] font-black leading-none text-white">{val}</span>
            <span className="text-[8px] text-white font-bold uppercase tracking-tighter mt-0.5">{trace.unit}</span>
         </div>
      </button>

      {isEditing && (
        <div className="flex flex-col border-t border-white/10">
          <div className="p-2 border-b border-white/10">
            <select 
              value={local.id} 
              onChange={(e) => {
                const selectedId = e.target.value;
                const selectedTrace = INITIAL_TRACES.find(t => t.id === selectedId);
                if (selectedTrace) {
                   handleChange('id', selectedId);
                }
              }}
              className="w-full bg-transparent text-[12px] font-bold outline-none cursor-pointer appearance-none"
              style={{ backgroundImage: 'url("data:image/svg+xml;charset=UTF-8,%3Csvg%20xmlns%3D%22http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg%22%20width%3D%2212%22%20height%3D%2212%22%20viewBox%3D%220%200%2024%2024%22%20fill%3D%22none%22%20stroke%3D%22white%22%20stroke-width%3D%223%22%20stroke-linecap%3D%22round%22%20stroke-linejoin%3D%22round%22%3E%3Cpolyline%20points%3D%226%209%2012%2015%2018%209%22%3E%3C%2Fpolyline%3E%3C%2Fsvg%3E")', backgroundRepeat: 'no-repeat', backgroundPosition: 'right 0 center' }}
            >
              {INITIAL_TRACES.map(t => <option key={t.id} value={t.id} className="bg-[#1a1a1b]">{t.label}</option>)}
            </select>
          </div>

          <div className="flex items-center justify-between p-2 border-b border-white/10">
            <span className="text-[10px] font-black text-white/70 uppercase">MIN:</span>
            <div className="flex items-center gap-3">
               <button onClick={() => handleChange('min', local.min - 1)} className="text-white/40 hover:text-white transition-colors">
                  <div className="w-5 h-5 rounded-full border border-current flex items-center justify-center"><Minus size={10} strokeWidth={4} /></div>
               </button>
               <span className="text-[14px] font-bold min-w-[30px] text-center">{local.min}</span>
               <button onClick={() => handleChange('min', local.min + 1)} className="text-white/40 hover:text-white transition-colors">
                  <div className="w-5 h-5 rounded-full border border-current flex items-center justify-center"><Plus size={10} strokeWidth={4} /></div>
               </button>
            </div>
          </div>

          <div className="flex items-center justify-between p-2 border-b border-white/10">
            <span className="text-[10px] font-black text-white/70 uppercase">MAX:</span>
            <div className="flex items-center gap-3">
               <button onClick={() => handleChange('max', local.max - 1)} className="text-white/40 hover:text-white transition-colors">
                  <div className="w-5 h-5 rounded-full border border-current flex items-center justify-center"><Minus size={10} strokeWidth={4} /></div>
               </button>
               <span className="text-[14px] font-bold min-w-[30px] text-center">{local.max}</span>
               <button onClick={() => handleChange('max', local.max + 1)} className="text-white/40 hover:text-white transition-colors">
                  <div className="w-5 h-5 rounded-full border border-current flex items-center justify-center"><Plus size={10} strokeWidth={4} /></div>
               </button>
            </div>
          </div>

          <div className="flex items-center justify-between p-2">
            <span className="text-[11px] font-black text-white/70">Color:</span>
            <div className="relative w-28 h-6 rounded border border-white/20" style={{ backgroundColor: local.color }}>
               <input 
                 type="color" 
                 value={local.color} 
                 onChange={e => handleChange('color', e.target.value)}
                 className="absolute inset-0 opacity-0 cursor-pointer w-full h-full" 
               />
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

const VerticalBrush = ({ 
  onChange 
}: { 
  onChange: (r: [number, number]) => void 
}) => {
  const [range, setRange] = useState<[number, number]>([0, 1]);
  const trackRef = React.useRef<HTMLDivElement>(null);
  const [dragging, setDragging] = useState<'top'|'bottom'|null>(null);

  React.useEffect(() => {
    const onMouseMove = (e: MouseEvent) => {
       if (!dragging || !trackRef.current) return;
       const rect = trackRef.current.getBoundingClientRect();
       let frac = (e.clientY - rect.top) / rect.height;
       frac = Math.max(0, Math.min(1, frac));
       
       setRange(prev => {
           const next = [...prev] as [number, number];
           if (dragging === 'top') {
              next[0] = Math.min(frac, next[1] - 0.02); // min 2% gap
           } else {
              next[1] = Math.max(frac, next[0] + 0.02);
           }
           return next;
       });
    };
    const onMouseUp = () => setDragging(null);

    if (dragging) {
       window.addEventListener('mousemove', onMouseMove);
       window.addEventListener('mouseup', onMouseUp);
    }
    return () => {
       window.removeEventListener('mousemove', onMouseMove);
       window.removeEventListener('mouseup', onMouseUp);
    };
  }, [dragging]);

  React.useEffect(() => {
     onChange(range);
  }, [range, onChange]);

  return (
     <div className="w-[18px] flex flex-col items-center justify-between py-4 pl-2 pr-1 relative h-full">
        <div ref={trackRef} className="w-[5px] bg-[#3e3e42] h-full rounded-full relative shadow-inner">
           {/* Active visual range */}
           <div 
              className="absolute w-full bg-cyan-600 rounded-full opacity-60 pointer-events-none"
              style={{ top: `${range[0] * 100}%`, height: `${(range[1] - range[0]) * 100}%` }}
           ></div>
           
           {/* Top Thumb */}
           <div 
              onMouseDown={() => setDragging('top')}
              className="w-3.5 h-3.5 rounded-full bg-white z-10 shadow border border-gray-300 absolute left-1/2 -translate-x-1/2 -translate-y-1/2 cursor-ns-resize hover:scale-125 transition-transform"
              style={{ top: `${range[0] * 100}%` }}
           ></div>

           {/* Bottom Thumb */}
           <div 
              onMouseDown={() => setDragging('bottom')}
              className="w-3.5 h-3.5 rounded-full bg-white z-10 shadow border border-gray-300 absolute left-1/2 -translate-x-1/2 -translate-y-1/2 cursor-ns-resize hover:scale-125 transition-transform"
              style={{ top: `${range[1] * 100}%` }}
           ></div>
        </div>
     </div>
  );
};

interface WellChartProps {
  data: DataPoint[];
  latestPoint: DataPoint | null;
  loading: boolean;
  timeWindow: TimeWindow;
  onTimeWindowChange: (v: TimeWindow) => void;
}

const WellChart: React.FC<WellChartProps> = ({ data, latestPoint, loading, timeWindow, onTimeWindowChange }) => {
  const [traces, setTraces] = useState<TraceConfig[]>(INITIAL_TRACES);
  const [editingIndex, setEditingIndex] = useState<number | null>(null);
  const [showTimePicker, setShowTimePicker] = useState(false);
  const [brushRange, setBrushRange] = useState<[number, number]>([0, 1]);

  const containerRef = React.useRef<HTMLDivElement>(null);
  const tracks = [0, 1, 2, 3];

  const { normalizedData, domainY, fullDomainY } = useMemo(() => {
    if (!data.length) return { normalizedData: [], domainY: [0, 1000], fullDomainY: [0, 1000] };
    
    const fullStart = data[0].ts;
    const fullEnd = data[data.length - 1].ts;

    // Apply the brush slice
    const startIndex = Math.floor(brushRange[0] * (data.length - 1));
    const endIndex = Math.ceil(brushRange[1] * (data.length - 1));
    const slicedData = data.slice(startIndex, endIndex + 1);

    const norm = slicedData.map(pt => {
      const entry: any = { relTs: pt.ts };
      traces.forEach(t => {
        const raw = (pt as any)[t.id] ?? 0;
        const range = t.max - t.min;
        entry[t.id] = range === 0 ? 0 : (raw - t.min) / range;
      });
      return entry;
    });

    const plotStart = slicedData.length > 0 ? slicedData[0].ts : fullStart;
    const plotEnd = slicedData.length > 0 ? slicedData[slicedData.length - 1].ts : fullEnd;

    return { normalizedData: norm, domainY: [plotStart, plotEnd], fullDomainY: [fullStart, fullEnd] };
  }, [data, traces, brushRange]);

  const handleUpdate = (updated: TraceConfig, index: number) => {
    const next = [...traces];
    next[index] = updated;
    setTraces(next);
  };

  return (
    <div ref={containerRef} className="h-full flex bg-[#1c1c1e] text-white p-2 select-none gap-px overflow-hidden relative">
      
      {/* ═══ TIME SCALE (Fixed left) ═══ */}
      <div className="w-[84px] flex flex-col border-r border-white/5 relative z-10 shrink-0 bg-[#1c1c1e]">
         
         {/* Top Headers Area (matching track headers height: 135px) */}
         <div className="h-[135px] border-b border-white/10 flex flex-col p-2 pt-3 shrink-0 relative">
            {/* Gear and RT Header */}
            <div className="flex items-start justify-between gap-1 w-full h-10 px-1">
               <button 
                 onClick={() => setShowTimePicker(!showTimePicker)}
                 className="w-7 h-7 rounded bg-white/[0.05] border border-white/20 flex items-center justify-center hover:bg-white/20 transition-colors shadow-sm"
               >
                 <Settings size={16} className="text-white/80" />
               </button>
               
               <div className="w-7 h-7 rounded-full border-[1.5px] flex items-center justify-center shadow-[0_0_12px_rgba(150,255,194,0.25)] bg-black/20" style={{ borderColor: '#96FFC2', color: '#96FFC2' }}>
                  <span className="text-[10px] font-black tracking-tighter">RT</span>
               </div>
            </div>

            <div className="text-[12px] font-bold mt-2 pb-1 border-b border-white/10 w-full mb-1 text-white/90">
               {TIME_WINDOWS.find(tw => tw.v === timeWindow)?.l.replace('min', ' min').replace('hr', ' hr').replace('d', ' d')}
            </div>

            {/* TimePicker Dropdown */}
            {showTimePicker && (
              <div className="absolute top-[48px] left-[10px] flex flex-col gap-1 p-1.5 bg-[#252526] border border-white/10 rounded shadow-2xl z-[200]">
                 {TIME_WINDOWS.map(tw => (
                   <button 
                     key={tw.v}
                     onClick={() => { onTimeWindowChange(tw.v); setShowTimePicker(false); setBrushRange([0, 1]); /* reset brush on window change */ }}
                     className={`px-3 py-1.5 text-[11px] font-bold uppercase rounded text-left ${timeWindow === tw.v ? 'bg-cyan-500/20 text-cyan-400' : 'hover:bg-white/10 text-white/70'}`}
                   >
                     {tw.l}
                   </button>
                 ))}
              </div>
            )}
         </div>

         {/* Plot Area Equivalent (Scale + Brush) */}
         <div className="flex-1 flex flex-row py-0 relative min-h-0 bg-transparent overflow-hidden">
             
             {/* Dynamic Functional Brush */}
             <VerticalBrush onChange={setBrushRange} />

             {/* Time tick labels anchored to fullDomainY */}
             <div className="flex-1 flex flex-col justify-between items-end pr-1 py-4 text-[10px] text-white/80 font-bold font-mono">
                {Array.from({ length: 9 }).map((_, i) => {
                   if (!data.length) return <span key={i}>--:--:--</span>;
                   // i=0 is earliest (top), i=8 is latest (bottom) using fullDomainY
                   const pointTs = fullDomainY[0] + (fullDomainY[1] - fullDomainY[0]) * (i / 8);
                   const d = new Date(pointTs);
                   return (
                     <div key={i} className="flex items-center gap-1.5 group w-full justify-end cursor-pointer">
                        <span className="leading-none select-none group-hover:text-cyan-400 transition-colors">
                           {d.toLocaleTimeString([], { hour12: false, hour: '2-digit', minute: '2-digit', second: '2-digit' })}
                        </span>
                        {/* Tick line connecting to the plot */}
                        <div className="w-1.5 h-[1px] bg-white/30 group-hover:bg-cyan-400 align-middle transition-colors"></div>
                     </div>
                   );
                })}
             </div>
         </div>

         {/* Footer Area filler (matching track columns' 140px footer) */}
         <div className="h-[140px] border-t border-white/10 shrink-0 bg-[#1c1c1e] w-full z-10"></div>
      </div>

      {/* ═══ TRACK COLUMNS (The core grid) ═══ */}
      <div className="flex-1 flex gap-1 relative overflow-visible">
        {/* Background Watermark Date */}
        <div className="absolute inset-0 flex items-center justify-center pointer-events-none opacity-[0.05] z-0">
           <span 
             className="text-[45px]"
             style={{ fontFamily: '"Comic Sans MS", "Comic Sans", cursive' }}
           >
              {data.length ? new Date(data[data.length-1].ts).toISOString().split('T')[0] : '2026-04-10'}
           </span>
        </div>

        {tracks.map(trackIdx => (
          <div key={trackIdx} className="flex-1 flex flex-col min-w-0 bg-white/[0.01] relative z-10 overflow-visible">
            
            {/* Header Area for this Track */}
            <div className="h-[135px] border-b border-white/10 py-1 flex flex-col justify-end bg-black/10">
               {traces.filter(t => t.trackIndex === trackIdx).map(t => (
                 <TraceHeader key={t.id} trace={t} />
               ))}
            </div>

            {/* Plot Area for this Track */}
            <div className="flex-1 bg-black/20 relative overflow-hidden">
              <ResponsiveContainer width="100%" height="100%">
                 <LineChart data={normalizedData} layout="vertical" margin={{ top: 0, right: 0, left: 0, bottom: 0 }}>
                    <XAxis type="number" domain={[0, 1]} hide />
                    <YAxis dataKey="relTs" type="number" domain={domainY} hide reversed />
                    {traces.filter(t => t.trackIndex === trackIdx).map(t => (
                      <Line 
                        key={t.id} 
                        type="monotone" 
                        dataKey={t.id} 
                        stroke={t.color} 
                        strokeWidth={1.5} 
                        dot={false}
                        isAnimationActive={false}
                        connectNulls
                      />
                    ))}
                 </LineChart>
              </ResponsiveContainer>
              <div className="absolute inset-0 flex pointer-events-none">
                 <div className="flex-1 border-r border-white/5"></div>
                 <div className="flex-1 border-r border-white/10"></div>
                 <div className="flex-1 border-r border-white/5"></div>
              </div>
            </div>

            {/* Footer Legend Area for this Track (with accordion popup push-up logic) */}
            <div className="relative h-[140px] flex-shrink-0 z-50">
               <div className="absolute bottom-0 left-0 w-full min-h-[140px] flex flex-col justify-end bg-[#1c1c1e] bg-opacity-95 border-t border-white/10 p-1">
                 {traces.map((t, idx) => {
                   if (t.trackIndex !== trackIdx) return null;
                   const rawVal = latestPoint ? (latestPoint as any)[t.id] : null;
                   const val = (rawVal !== null && rawVal !== undefined) ? Number(rawVal).toFixed(1) : '—';
                   return (
                      <TraceLegendEditor 
                        key={idx} 
                        trace={t} 
                        val={val} 
                        isEditing={editingIndex === idx}
                        onEdit={() => setEditingIndex(editingIndex === idx ? null : idx)}
                        onUpdate={(updated) => handleUpdate(updated, idx)}
                      />
                   );
                 })}
               </div>
            </div>
            
          </div>
        ))}
      </div>
    </div>
  );
};

export default WellChart;
