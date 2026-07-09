import React, { useState, useMemo } from 'react';
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  ResponsiveContainer,
} from 'recharts';
import { Settings, Plus, Minus, History, Download, Lock } from 'lucide-react';
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

const TRACE_UNITS: Record<string, string[]> = {
  wob:      ['Klb', 'lb', 'kg', 'kN'],
  tubes:    ['tubos'],
  depth:    ['ft', 'm'],
  hookload: ['Klb', 'lb', 'kg', 'kN'],
  blockVel: ['ft/min', 'm/min'],
  blockPos: ['ft', 'm'],
  flow:     ['Bbls/min', 'gpm', 'lpm', 'm³/min'],
  spm:      ['SPM'],
  pump:     ['psi', 'kPa', 'bar'],
  rpm:      ['rpm'],
  torque:   ['lb-ft', 'kN·m', 'N·m'],
  torqHid:  ['lb-ft', 'kN·m', 'N·m'],
};

// Rangos por defecto confirmados (2026-07-09), reemplazan las suposiciones
// anteriores que no calzaban con la escala real del Data Lake.
const INITIAL_TRACES: TraceConfig[] = [
  // Track 0
  { id: 'wob', label: 'Peso Sobre Broca', unit: 'Klb', color: '#2D9113', min: -30, max: 30, trackIndex: 0 },
  { id: 'tubes', label: 'Contador Tuberia', unit: 'tubos', color: '#06BFC2', min: 0, max: 500, trackIndex: 0 },
  { id: 'depth', label: 'Profundidad', unit: 'ft', color: '#1477D2', min: 0, max: 10000, trackIndex: 0 },
  // Track 1
  { id: 'hookload', label: 'Carga Gancho', unit: 'Klb', color: '#D2D206', min: 0, max: 250, trackIndex: 1 },
  { id: 'blockVel', label: 'Velocidad Bloque', unit: 'ft/min', color: '#38808C', min: 0, max: 350, trackIndex: 1 },
  { id: 'blockPos', label: 'Posición Bloque', unit: 'ft', color: '#AC0653', min: -10, max: 80, trackIndex: 1 },
  // Track 2
  { id: 'flow', label: 'Caudal', unit: 'Bbls/min', color: '#AC0653', min: 0, max: 15, trackIndex: 2 },
  { id: 'spm', label: 'Strokes por Minuto', unit: 'SPM', color: '#BE5C32', min: 0, max: 200, trackIndex: 2 },
  { id: 'pump', label: 'Presión Bomba', unit: 'psi', color: '#13D23C', min: 0, max: 3000, trackIndex: 2 },
  // Track 3
  { id: 'rpm', label: 'RPM', unit: 'rpm', color: '#13D23C', min: 0, max: 200, trackIndex: 3 },
  { id: 'torque', label: 'Torque', unit: 'lb-ft', color: '#C80606', min: 0, max: 15000, trackIndex: 3 },
  { id: 'torqHid', label: 'Torque Hidraulica', unit: 'lb-ft', color: '#06D2D2', min: 0, max: 15000, trackIndex: 3 },
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

const fmtRange = (v: number): string => {
  if (!Number.isFinite(v)) return '0';
  return Math.abs(v) >= 10 ? String(Math.round(v)) : String(Math.round(v * 10) / 10);
};

const TraceHeader = ({ trace, range }: { trace: TraceConfig; range: { min: number; max: number } }) => {
  const mid = (range.min + range.max) / 2;
  return (
    <div className="flex flex-col items-center mb-1.5 w-full px-2">
      <span className="text-[11px] font-black truncate w-full text-center mb-0.5" style={{ color: trace.color }}>
        {trace.label}
      </span>
      <div className="w-full flex justify-between text-[9px] font-bold mb-0.5" style={{ color: trace.color }}>
          <span>{fmtRange(range.min)}</span>
          <span>{fmtRange(mid)}</span>
          <span>{fmtRange(range.max)}</span>
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
  onUpdate,
  showUnitSelector,
}: {
  trace: TraceConfig;
  val: string;
  isEditing: boolean;
  onEdit: () => void;
  onUpdate: (t: TraceConfig) => void;
  showUnitSelector?: boolean;
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

          {/* Unit selector — only for platforms that enable it */}
          {showUnitSelector && (() => {
            const available = TRACE_UNITS[local.id] ?? [local.unit];
            if (available.length <= 1) return null;
            return (
              <div className="flex items-center justify-between p-2 border-b border-white/10">
                <span className="text-[10px] font-black text-white/70 uppercase">Unidad:</span>
                <select
                  value={local.unit}
                  onChange={e => handleChange('unit', e.target.value)}
                  className="bg-[#252526] text-white text-[11px] font-bold outline-none cursor-pointer rounded px-2 py-1 border border-white/20 hover:border-white/40 transition-colors appearance-none"
                  style={{ backgroundImage: 'url("data:image/svg+xml;charset=UTF-8,%3Csvg%20xmlns%3D%22http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg%22%20width%3D%2210%22%20height%3D%2210%22%20viewBox%3D%220%200%2024%2024%22%20fill%3D%22none%22%20stroke%3D%22white%22%20stroke-width%3D%223%22%20stroke-linecap%3D%22round%22%20stroke-linejoin%3D%22round%22%3E%3Cpolyline%20points%3D%226%209%2012%2015%2018%209%22%3E%3C%2Fpolyline%3E%3C%2Fsvg%3E")', backgroundRepeat: 'no-repeat', backgroundPosition: 'right 6px center', paddingRight: '22px' }}
                >
                  {available.map(u => <option key={u} value={u} className="bg-[#1a1a1b]">{u}</option>)}
                </select>
              </div>
            );
          })()}

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

const ViewportBrush = ({ 
  onChange,
  domain
}: { 
  onChange: (r: [number, number]) => void;
  domain?: [number, number];
}) => {
  const [range, setRange] = useState<[number, number]>([0, 1]);
  const trackRef = React.useRef<HTMLDivElement>(null);
  const [dragging, setDragging] = useState<'top'|'bottom'|'center'|null>(null);
  const [startFrac, setStartFrac] = useState(0);
  const [startRange, setStartRange] = useState<[number, number]>([0, 1]);

  React.useEffect(() => {
    const onMouseMove = (e: MouseEvent) => {
       if (!dragging || !trackRef.current) return;
       const rect = trackRef.current.getBoundingClientRect();
       let frac = (e.clientY - rect.top) / rect.height;
       frac = Math.max(0, Math.min(1, frac));
       
       setRange(prev => {
           let next = [...prev] as [number, number];
           if (dragging === 'top') {
              next[0] = Math.min(frac, next[1] - 0.02);
           } else if (dragging === 'bottom') {
              next[1] = Math.max(frac, next[0] + 0.02);
           } else if (dragging === 'center') {
              const delta = frac - startFrac;
              const len = startRange[1] - startRange[0];
              let n0 = startRange[0] + delta;
              let n1 = startRange[1] + delta;
              if (n0 < 0) { n0 = 0; n1 = len; }
              if (n1 > 1) { n1 = 1; n0 = 1 - len; }
              next = [n0, n1];
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
  }, [dragging, startFrac, startRange]);

  React.useEffect(() => {
     onChange(range);
  }, [range, onChange]);

  const handleDragCenterStart = (e: React.MouseEvent) => {
      e.stopPropagation();
      if (!trackRef.current) return;
      const rect = trackRef.current.getBoundingClientRect();
      setStartFrac((e.clientY - rect.top) / rect.height);
      setStartRange([...range]);
      setDragging('center');
  };

  return (
     <div ref={trackRef} className="w-full h-full relative group">
         {/* The active viewport box overlay */}
         <div 
             className="absolute inset-x-0 border-y-[1.5px] border-[#47CEAC] bg-[#47CEAC]/15 cursor-move shadow-[0_0_15px_rgba(71,206,172,0.15)] flex justify-center"
             style={{ top: `${range[0] * 100}%`, height: `${(range[1] - range[0]) * 100}%` }}
             onMouseDown={handleDragCenterStart}
         >
             {/* Left side Orange Double-Arrow Line */}
             <div className="absolute left-[4px] top-1 bottom-1 w-px bg-[#FFB74D] z-10 pointer-events-none">
                <div className="absolute left-[0.5px] top-0 w-0 h-0 -translate-x-[2px] border-x-[3px] border-b-[4px] border-x-transparent border-b-[#FFB74D]"></div>
                <div className="absolute left-[0.5px] bottom-0 w-0 h-0 -translate-x-[2px] border-x-[3px] border-t-[4px] border-x-transparent border-t-[#FFB74D]"></div>
             </div>

             <div className="absolute inset-y-0 left-0 w-[1.5px] bg-[#47CEAC]"></div>
             <div className="absolute inset-y-0 right-0 w-[1.5px] bg-[#47CEAC]"></div>

             {/* Top Yellow Label tracked dynamically */}
             <div 
                className="absolute top-[-21px] left-[-1px] right-[-1px] h-[22px] bg-[#FFC107] flex items-center justify-center pointer-events-auto cursor-move z-30 shadow-md hover:bg-[#ffc824]"
                onMouseDown={handleDragCenterStart}
             >
                <span className="text-[10px] font-black text-black leading-none pt-0.5 select-none pointer-events-none">
                   {domain ? new Date(domain[0] + (domain[1]-domain[0])*range[0]).toLocaleString('en-US', {month:'short', day:'numeric', hour:'2-digit', minute:'2-digit', hour12:false}) : ''}
                </span>
             </div>

             {/* Bottom Yellow Label tracked dynamically */}
             <div 
                className="absolute bottom-[-21px] left-[-1px] right-[-1px] h-[22px] bg-[#FFC107] flex items-center justify-center pointer-events-auto cursor-move z-30 shadow-md hover:bg-[#ffc824]"
                onMouseDown={handleDragCenterStart}
             >
                <span className="text-[10px] font-black text-black leading-none pt-0.5 select-none pointer-events-none">
                   {domain ? new Date(domain[0] + (domain[1]-domain[0])*range[1]).toLocaleString('en-US', {month:'short', day:'numeric', hour:'2-digit', minute:'2-digit', hour12:false}) : ''}
                </span>
             </div>
         </div>
         {/* Top Thumb */}
         <div 
            onMouseDown={(e) => { e.stopPropagation(); setDragging('top'); }}
            className="w-3.5 h-3.5 rounded-full bg-white z-40 border-[2px] border-[#47CEAC] absolute left-1/2 -translate-x-1/2 cursor-ns-resize hover:scale-125 transition-transform shadow"
            style={{ top: `calc(${range[0] * 100}% - 7px)` }}
         ></div>

         {/* Bottom Thumb */}
         <div 
            onMouseDown={(e) => { e.stopPropagation(); setDragging('bottom'); }}
            className="w-3.5 h-3.5 rounded-full bg-white z-40 border-[2px] border-[#47CEAC] absolute left-1/2 -translate-x-1/2 cursor-ns-resize hover:scale-125 transition-transform shadow"
            style={{ top: `calc(${range[1] * 100}% - 7px)` }}
         ></div>
     </div>
  );
};

interface WellChartProps {
  data: DataPoint[];
  latestPoint: DataPoint | null;
  loading: boolean;
  timeWindow: TimeWindow;
  onTimeWindowChange: (v: TimeWindow) => void;
  isHistorical?: boolean;
  onShowHistory?: () => void;
  showBrushPanel?: boolean;
  hideDepthFilter?: boolean;
  showUnitSelector?: boolean;
  historyVariant?: 'cta';
  lockedHistory?: boolean;
  historyPreviewContent?: React.ReactNode;
  onLockedHistoryHoverChange?: (hovering: boolean) => void;
}

const WellChart: React.FC<WellChartProps> = ({ data, latestPoint, loading: _loading, timeWindow, onTimeWindowChange, isHistorical, onShowHistory, showBrushPanel = false, hideDepthFilter = false, showUnitSelector = false, historyVariant, lockedHistory, historyPreviewContent, onLockedHistoryHoverChange }) => {
  const [traces, setTraces] = useState<TraceConfig[]>(INITIAL_TRACES);
  const [editingIndex, setEditingIndex] = useState<number | null>(null);
  const [showTimePicker, setShowTimePicker] = useState(false);
  const [showHistoryPreview, setShowHistoryPreview] = useState(false);
  const [macroRange, setMacroRange] = useState<[number, number]>([0, 1]);
  const [microRange, setMicroRange] = useState<[number, number]>([0, 1]);

  React.useEffect(() => {
     if (!isHistorical && historyVariant === 'cta' && historyPreviewContent) {
        setShowHistoryPreview(true);
        const timer = setTimeout(() => {
           setShowHistoryPreview(false);
        }, 8000);
        return () => clearTimeout(timer);
     }
  }, [isHistorical, historyVariant, historyPreviewContent]);

  const containerRef = React.useRef<HTMLDivElement>(null);
  const tracks = [0, 1, 2, 3];

  // Rangos por track: los valores fijos confirmados en INITIAL_TRACES (ver
  // arriba) son el default; el usuario puede ajustarlos a mano por track
  // desde el editor de leyenda (TraceLegendEditor), lo que actualiza
  // `traces` state -- effectiveRange siempre refleja ese valor actual.
  const effectiveRange = (t: TraceConfig): { min: number; max: number } => ({ min: t.min, max: t.max });

  const { normalizedData, domainY, fullDomainY, macroDomainY } = useMemo(() => {
    if (!data.length) return { normalizedData: [], domainY: [0, 1000], fullDomainY: [0, 1000], macroDomainY: [0, 1000] };
    
    const fullStart = data[0].ts;
    const fullEnd = data[data.length - 1].ts;

    // Apply macro slice
    const macroStartIndex = Math.floor(macroRange[0] * (data.length - 1));
    const macroEndIndex = Math.ceil(macroRange[1] * (data.length - 1));
    const macroData = data.slice(macroStartIndex, macroEndIndex + 1);

    // Apply micro slice (relative to macro slice)
    const microStartIndex = Math.floor(microRange[0] * (macroData.length > 0 ? macroData.length - 1 : 0));
    const microEndIndex = Math.ceil(microRange[1] * (macroData.length > 0 ? macroData.length - 1 : 0));
    const slicedData = macroData.slice(microStartIndex, microEndIndex + 1);

    const norm = slicedData.map(pt => {
      const entry: any = { relTs: pt.ts };
      traces.forEach(t => {
        const raw = (pt as any)[t.id] ?? 0;
        const { min, max } = effectiveRange(t);
        const range = max - min;
        entry[t.id] = range === 0 ? 0.5 : (raw - min) / range;
      });
      return entry;
    });

    const macroStart = macroData.length > 0 ? macroData[0].ts : fullStart;
    const macroEnd = macroData.length > 0 ? macroData[macroData.length - 1].ts : fullEnd;

    const plotStart = slicedData.length > 0 ? slicedData[0].ts : fullStart;
    const plotEnd = slicedData.length > 0 ? slicedData[slicedData.length - 1].ts : fullEnd;

    return { normalizedData: norm, domainY: [plotStart, plotEnd], fullDomainY: [fullStart, fullEnd], macroDomainY: [macroStart, macroEnd] };
  }, [data, traces, macroRange, microRange]);

  const handleUpdate = (updated: TraceConfig, index: number) => {
    const next = [...traces];
    next[index] = updated;
    setTraces(next);
  };

  return (
    <div ref={containerRef} className="w-full h-full flex bg-[#1c1c1e] text-white p-2 select-none gap-px overflow-hidden relative">
      
      {/* ═══ TIME SCALE OR WELL PROFILE (Fixed left) ═══ */}
      <div className={`${(isHistorical || (showBrushPanel && !hideDepthFilter)) ? 'w-[200px]' : 'w-[108px]'} border-r ${isHistorical ? 'border-[#515151]' : 'border-white/5'} flex flex-row relative z-10 shrink-0 bg-[#1c1c1e] transition-all`}>
         {isHistorical ? (
            <>
               {/* 1. MACRO FILTER COLUMN (Left, Tall) */}
               <div className="w-[125px] flex flex-col border-r border-white/5 shrink-0 bg-black/10">
                  {/* Well Profile Top Mini-Header */}
                  <div className="h-[40px] flex items-center justify-between px-2 pt-2 shrink-0">
                     <span className="text-[10px] font-bold text-white/80 truncate">Well Profile</span>
                     <div className="w-5 h-5 rounded flex items-center justify-center shrink-0">
                        <div className="w-2.5 h-2.5 border-[1.5px] border-dashed border-white/60"></div>
                     </div>
                  </div>

                  {/* Macro Profile Map (Sparkline + Viewport) */}
                  <div className="flex-1 relative z-10 w-full overflow-hidden px-1">
                     {data.length > 0 && (
                        <ResponsiveContainer width="100%" height="100%">
                            <LineChart layout="vertical" data={data.map(d => ({ ts: d.ts, depth: d.depth }))} margin={{top:20,bottom:20,left:0,right:0}}>
                               <YAxis dataKey="ts" type="number" domain={fullDomainY} hide reversed />
                               <XAxis type="number" hide domain={['dataMin', 'dataMax']} />
                               <Line type="step" dataKey="depth" stroke="#ffffff" strokeWidth={1.5} dot={false} isAnimationActive={false} className="opacity-80" />
                            </LineChart>
                        </ResponsiveContainer>
                     )}
                     <div className="absolute inset-y-[20px] left-[2px] right-[2px] z-20">
                        <ViewportBrush onChange={setMacroRange} domain={fullDomainY as [number, number]} />
                     </div>
                  </div>

                  {/* Depth Footer Mini */}
                  <div className="h-[40px] shrink-0 w-full p-1 flex flex-col items-center justify-center relative mb-1">
                     <span className="text-[8px] text-white/60 mb-0.5 pointer-events-none">Profundidad (ft)</span>
                     <div className="flex w-full justify-between text-[7px] font-black text-white/80 font-mono tracking-tighter">
                        <span className="text-[#1477D2]">0</span>
                        <span>5K</span>
                        <span>10K</span>
                        <span>15K</span>
                     </div>
                  </div>
               </div>

               {/* 2. MICRO BRUSH + LABELS COLUMN (Aligned with Data Tracks) */}
               <div className="flex-1 flex flex-col shrink-0 bg-[#1c1c1e]">
                  {/* Filler to align with 135px track headers */}
                  <div className="h-[135px] shrink-0 border-b border-white/10" />
                  
                  <div className="flex-1 flex flex-row py-0 relative min-h-0 bg-transparent overflow-hidden">
                     {/* Micro Brush Slider */}
                     <VerticalBrush onChange={setMicroRange} />

                     {/* Time Tick Labels anchored to macroDomainY */}
                     <div className="flex-1 flex flex-col justify-between items-end pr-1 py-4 text-[9px] text-white/60 font-bold font-mono">
                         {Array.from({ length: 9 }).map((_, i) => {
                            if (!data.length) return <span key={i}></span>;
                            const pointTs = macroDomainY[0] + (macroDomainY[1] - macroDomainY[0]) * (i / 8);
                            const d = new Date(pointTs);
                            const isMidnight = d.getHours() === 0 && d.getMinutes() === 0;
                            return (
                               <div key={i} className="flex items-center gap-1.5 w-full justify-end group cursor-pointer">
                                  <span className={`leading-none text-right ${isMidnight ? 'text-white/90' : 'group-hover:text-[#47CEAC] transition-colors'}`}>
                                     {d.toLocaleTimeString([], { hour12: false, hour: '2-digit', minute: '2-digit' })}
                                  </span>
                                  <div className="w-1.5 h-[1px] bg-white/20 group-hover:bg-[#47CEAC] align-middle"></div>
                               </div>
                            );
                         })}
                      </div>
                  </div>
                  
                  {/* Filler to align with 140px track footers */}
                  <div className="h-[140px] shrink-0 border-t border-white/10" />
               </div>
            </>
         ) : showBrushPanel ? (
            <>
               {/* ═══ hideDepthFilter: skip macro column, keep controls + micro brush ═══ */}
               {hideDepthFilter ? (
                  <div className="w-[108px] flex flex-col shrink-0 bg-[#1c1c1e] z-[100]">
                     <div className="h-[135px] shrink-0 border-b border-white/10 flex flex-col p-2 gap-2 relative">

                        {/* Row 1: gear + time window label */}
                        <div className="flex items-center gap-2">
                           <button
                             onClick={() => setShowTimePicker(!showTimePicker)}
                             className="w-7 h-7 rounded bg-white/[0.05] border border-white/20 flex items-center justify-center hover:bg-white/20 transition-colors shadow-sm shrink-0"
                           >
                             <Settings size={15} className="text-white/80" />
                           </button>
                           <span className="text-[15px] font-black text-white leading-none">
                             {TIME_WINDOWS.find(tw => tw.v === timeWindow)?.l.replace('min', ' min').replace('hr', ' hr').replace('d', ' d')}
                           </span>
                        </div>

                        {/* Row 2: RT indicator below the time label */}
                        <div className="flex items-center gap-1.5 pl-0.5">
                           <div className="w-[7px] h-[7px] rounded-full bg-[#96FFC2] shadow-[0_0_7px_rgba(150,255,194,0.8)]" />
                           <span className="text-[9px] font-black tracking-widest uppercase" style={{ color: '#96FFC2' }}>RT</span>
                           <span className="text-[7.5px] font-bold text-white/35 uppercase tracking-wider">En vivo</span>
                        </div>

                        {/* Row 3: History & Export buttons */}
                        {onShowHistory && (
                           historyVariant === 'cta' ? (
                             <div
                                className="relative group w-full"
                                onMouseEnter={() => { setShowHistoryPreview(true); onLockedHistoryHoverChange?.(true); }}
                                onMouseLeave={() => { setShowHistoryPreview(false); onLockedHistoryHoverChange?.(false); }}
                             >
                               {lockedHistory ? (
                                  <div className="relative w-full">
                                    <div className="w-full flex flex-col gap-[4px] py-[6px] px-2 rounded-[3px] border border-white/[0.07] bg-white/[0.03] cursor-not-allowed opacity-50">
                                      <div className="flex items-center gap-1.5">
                                        <History size={10} className="text-white/40 shrink-0" />
                                        <span className="text-[7.5px] font-bold text-white/40 uppercase tracking-wider leading-none">Histórico</span>
                                      </div>
                                      <div className="flex items-center gap-1.5">
                                        <Download size={10} className="text-white/40 shrink-0" />
                                        <span className="text-[7.5px] font-bold text-white/40 uppercase tracking-wider leading-none">Exportar</span>
                                      </div>
                                    </div>
                                    <div className="absolute -top-1.5 -right-1.5 w-[15px] h-[15px] rounded-full bg-[#1c1c1e] border border-white/20 flex items-center justify-center shadow-md">
                                      <Lock size={7} className="text-white/70" />
                                    </div>
                                  </div>
                               ) : (
                                  <button
                                    onClick={onShowHistory}
                                    className="w-full flex flex-col gap-[4px] py-[6px] px-2 rounded-[3px] border border-white/[0.08] bg-white/[0.04] hover:bg-white/[0.09] hover:border-white/[0.18] transition-all group/btn"
                                  >
                                    <div className="flex items-center gap-1.5">
                                      <History size={10} className="text-white/40 group-hover/btn:text-[#47CEAC] transition-colors shrink-0" />
                                      <span className="text-[7.5px] font-bold text-white/40 group-hover/btn:text-white/65 uppercase tracking-wider leading-none transition-colors">Histórico</span>
                                    </div>
                                    <div className="flex items-center gap-1.5">
                                      <Download size={10} className="text-white/40 group-hover/btn:text-[#47CEAC] transition-colors shrink-0" />
                                      <span className="text-[7.5px] font-bold text-white/40 group-hover/btn:text-white/65 uppercase tracking-wider leading-none transition-colors">Exportar</span>
                                    </div>
                                  </button>
                               )}
                               {showHistoryPreview && historyPreviewContent}
                             </div>
                           ) : (
                             <button
                               onClick={onShowHistory}
                               className="w-full flex flex-col items-center justify-center gap-[3px] py-[7px] rounded-[4px] border border-[#47CEAC]/35 bg-[#47CEAC]/10 hover:bg-[#47CEAC]/22 hover:border-[#47CEAC]/60 transition-all shadow-sm group"
                             >
                               <div className="flex items-center gap-1.5">
                                 <History size={11} className="text-[#47CEAC] group-hover:scale-110 transition-transform" />
                                 <span className="text-[9px] font-black text-[#47CEAC] uppercase tracking-wider leading-none">Histórico</span>
                               </div>
                               <span className="text-[7px] font-bold text-white/35 uppercase tracking-widest leading-none">Explorar & Exportar</span>
                             </button>
                           )
                        )}

                        {showTimePicker && (
                          <div className="absolute top-[44px] left-[10px] flex flex-col gap-1 p-1.5 bg-[#252526] border border-white/10 rounded shadow-2xl z-[200]">
                             {TIME_WINDOWS.map(tw => (
                               <button
                                 key={tw.v}
                                 onClick={() => { onTimeWindowChange(tw.v); setShowTimePicker(false); setMicroRange([0, 1]); }}
                                 className={`px-3 py-1.5 text-[11px] font-bold uppercase rounded text-left ${timeWindow === tw.v ? 'bg-cyan-500/20 text-cyan-400' : 'hover:bg-white/10 text-white/70'}`}
                               >
                                 {tw.l}
                               </button>
                             ))}
                          </div>
                        )}
                     </div>
                     <div className="flex-1 flex flex-row min-h-0 overflow-hidden">
                        <VerticalBrush onChange={setMicroRange} />
                        <div className="flex-1 flex flex-col justify-between py-4 text-[10px] text-white/80 font-bold font-mono">
                           {Array.from({ length: 9 }).map((_, i) => {
                              if (!data.length) return <span key={i} className="text-right block">--:--:--</span>;
                              const pointTs = fullDomainY[0] + (fullDomainY[1] - fullDomainY[0]) * (i / 8);
                              const d = new Date(pointTs);
                              return (
                                <div key={i} className="flex items-center justify-end gap-1 group cursor-pointer">
                                   <span className="leading-none select-none group-hover:text-cyan-400 transition-colors">
                                      {d.toLocaleTimeString([], { hour12: false, hour: '2-digit', minute: '2-digit', second: '2-digit' })}
                                   </span>
                                   <div className="w-2 h-[1px] bg-white/30 group-hover:bg-cyan-400 transition-colors shrink-0"></div>
                                </div>
                              );
                           })}
                        </div>
                     </div>
                     <div className="h-[140px] border-t border-white/10 shrink-0" />
                  </div>
               ) : (
               <>
               {/* ═══ OPERATIONAL VIEW WITH BRUSH PANEL (VisualizacionPro) ═══ */}
               {/* 1. MACRO FILTER COLUMN (Left, Tall) */}
               <div className="w-[125px] flex flex-col border-r border-white/5 shrink-0 bg-black/10">
                   <div className="border-b border-white/10 flex flex-col p-2 pt-3 shrink-0 relative bg-[#1c1c1e]">
                      <div className="flex items-start justify-between gap-1 w-full h-10 px-1">
                         <div className="flex items-center gap-1">
                           <button
                             onClick={() => setShowTimePicker(!showTimePicker)}
                             className="w-7 h-7 rounded bg-white/[0.05] border border-white/20 flex items-center justify-center hover:bg-white/20 transition-colors shadow-sm"
                           >
                             <Settings size={16} className="text-white/80" />
                           </button>
                           {onShowHistory && (
                             <button
                               onClick={onShowHistory}
                               className="w-7 h-7 rounded bg-[#47CEAC]/15 border border-[#47CEAC]/30 flex items-center justify-center hover:bg-[#47CEAC]/30 transition-colors shadow-sm group"
                               title="Históricos / Exportar Data"
                             >
                               <History size={14} className="text-[#47CEAC]/80 group-hover:text-[#47CEAC] transition-colors" />
                             </button>
                           )}
                         </div>
                         <div className="w-7 h-7 rounded-full border-[1.5px] flex items-center justify-center shadow-[0_0_12px_rgba(150,255,194,0.25)] bg-black/20" style={{ borderColor: '#96FFC2', color: '#96FFC2' }}>
                            <span className="text-[10px] font-black tracking-tighter">RT</span>
                         </div>
                      </div>
                      <div className="text-[12px] font-bold mt-2 pb-1 border-b border-white/10 w-full mb-1 text-white/90 px-1">
                         {TIME_WINDOWS.find(tw => tw.v === timeWindow)?.l.replace('min', ' min').replace('hr', ' hr').replace('d', ' d')}
                      </div>
                      {showTimePicker && (
                        <div className="absolute top-[48px] left-[10px] flex flex-col gap-1 p-1.5 bg-[#252526] border border-white/10 rounded shadow-2xl z-[200]">
                           {TIME_WINDOWS.map(tw => (
                             <button
                               key={tw.v}
                               onClick={() => { onTimeWindowChange(tw.v); setShowTimePicker(false); setMicroRange([0, 1]); }}
                               className={`px-3 py-1.5 text-[11px] font-bold uppercase rounded text-left ${timeWindow === tw.v ? 'bg-cyan-500/20 text-cyan-400' : 'hover:bg-white/10 text-white/70'}`}
                             >
                               {tw.l}
                             </button>
                           ))}
                        </div>
                      )}
                   </div>
                   <div className="flex-1 relative z-10 w-full overflow-hidden">
                      {data.length > 0 && (
                         <ResponsiveContainer width="100%" height="100%">
                             <LineChart layout="vertical" data={data.map(d => ({ ts: d.ts, depth: d.depth }))} margin={{top:22,bottom:22,left:0,right:0}}>
                                <YAxis dataKey="ts" type="number" domain={fullDomainY} hide reversed />
                                <XAxis type="number" hide domain={['dataMin', 'dataMax']} />
                                <Line type="step" dataKey="depth" stroke="#ffffff" strokeWidth={1.5} dot={false} isAnimationActive={false} className="opacity-80" />
                             </LineChart>
                         </ResponsiveContainer>
                      )}
                      <div className="absolute inset-y-[22px] left-0 right-0 z-20">
                         <ViewportBrush onChange={setMacroRange} domain={fullDomainY as [number, number]} />
                      </div>
                   </div>
                   <div className="h-[40px] shrink-0 w-full p-1 flex flex-col items-center justify-center relative mb-1">
                      <span className="text-[8px] text-white/60 mb-0.5 pointer-events-none">Profundidad (ft)</span>
                      <div className="flex w-full justify-between text-[7px] font-black text-white/80 font-mono tracking-tighter">
                         <span className="text-[#1477D2]">0</span><span>5K</span><span>10K</span><span>15K</span>
                      </div>
                   </div>
               </div>
               <div className="flex-1 flex flex-col shrink-0 bg-[#1c1c1e]">
                  <div className="h-[135px] shrink-0 border-b border-white/10" />
                  <div className="flex-1 flex flex-row py-0 relative min-h-0 bg-transparent overflow-hidden">
                      <VerticalBrush onChange={setMicroRange} />
                      <div className="flex-1 flex flex-col justify-between items-end pr-1 py-4 text-[10px] text-white/80 font-bold font-mono">
                         {Array.from({ length: 9 }).map((_, i) => {
                            if (!data.length) return <span key={i}>--:--:--</span>;
                            const pointTs = fullDomainY[0] + (fullDomainY[1] - fullDomainY[0]) * (i / 8);
                            const d = new Date(pointTs);
                            return (
                              <div key={i} className="flex items-center gap-1.5 group w-full justify-end cursor-pointer">
                                 <span className="leading-none select-none group-hover:text-cyan-400 transition-colors">
                                    {d.toLocaleTimeString([], { hour12: false, hour: '2-digit', minute: '2-digit', second: '2-digit' })}
                                 </span>
                                 <div className="w-1.5 h-[1px] bg-white/30 group-hover:bg-cyan-400 align-middle transition-colors"></div>
                              </div>
                            );
                         })}
                      </div>
                  </div>
                  <div className="h-[140px] border-t border-white/10 shrink-0 bg-[#1c1c1e] w-full z-10"></div>
               </div>
            </>
            )}
            </>
         ) : (
            <>
               {/* ═══ SIMPLIFIED LEFT PANEL (SkanView): gear/RT/time + brush + labels, no sparkline ═══ */}
               <div className="w-[108px] flex flex-col shrink-0 border-r border-white/5 bg-[#1c1c1e]">
                  {/* Header — 135px, matches track header height */}
                  <div className="h-[135px] shrink-0 border-b border-white/10 flex flex-col justify-between p-2 relative">
                     <div className="flex flex-col items-start gap-1.5">
                        {/* Gear + RT inline */}
                        <div className="flex items-center gap-1.5">
                           <button
                             onClick={() => setShowTimePicker(!showTimePicker)}
                             className="w-7 h-7 rounded bg-white/[0.05] border border-white/20 flex items-center justify-center hover:bg-white/20 transition-colors shadow-sm"
                           >
                             <Settings size={16} className="text-white/80" />
                           </button>
                           <div className="w-7 h-7 rounded-full border-[1.5px] flex items-center justify-center bg-black/20" style={{ borderColor: '#96FFC2', color: '#96FFC2' }}>
                              <span className="text-[10px] font-black tracking-tighter">RT</span>
                           </div>
                        </div>
                        {/* Time window label directly below gear */}
                        <span className="text-[12px] font-bold text-white/90 leading-none pl-0.5">
                          {TIME_WINDOWS.find(tw => tw.v === timeWindow)?.l.replace('min', ' min').replace('hr', ' hr').replace('d', ' d')}
                        </span>
                     </div>
                     {showTimePicker && (
                       <div className="absolute top-[44px] left-[2px] flex flex-col gap-1 p-1.5 bg-[#252526] border border-white/10 rounded shadow-2xl z-[200]">
                          {TIME_WINDOWS.map(tw => (
                            <button
                              key={tw.v}
                              onClick={() => { onTimeWindowChange(tw.v); setShowTimePicker(false); setMicroRange([0, 1]); }}
                              className={`px-3 py-1.5 text-[11px] font-bold uppercase rounded text-left ${timeWindow === tw.v ? 'bg-cyan-500/20 text-cyan-400' : 'hover:bg-white/10 text-white/70'}`}
                            >
                              {tw.l}
                            </button>
                          ))}
                       </div>
                     )}
                  </div>

                  {/* Plot area — brush left edge, labels right-aligned flush to track boundary */}
                  <div className="flex-1 flex flex-row min-h-0 overflow-hidden">
                     <VerticalBrush onChange={setMicroRange} />
                     <div className="flex-1 flex flex-col justify-between py-4 text-[10px] text-white/80 font-bold font-mono">
                        {Array.from({ length: 9 }).map((_, i) => {
                           if (!data.length) return <span key={i} className="text-right block">--:--:--</span>;
                           const pointTs = fullDomainY[0] + (fullDomainY[1] - fullDomainY[0]) * (i / 8);
                           const d = new Date(pointTs);
                           return (
                             <div key={i} className="flex items-center justify-end gap-1 group cursor-pointer">
                                <span className="leading-none select-none group-hover:text-cyan-400 transition-colors">
                                   {d.toLocaleTimeString([], { hour12: false, hour: '2-digit', minute: '2-digit', second: '2-digit' })}
                                </span>
                                <div className="w-2 h-[1px] bg-white/30 group-hover:bg-cyan-400 transition-colors shrink-0"></div>
                             </div>
                           );
                        })}
                     </div>
                  </div>

                  {/* Footer filler — 140px, matches track footer height */}
                  <div className="h-[140px] border-t border-white/10 shrink-0" />
               </div>
            </>
         )}
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
                 <TraceHeader key={t.id} trace={t} range={effectiveRange(t)} />
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
                        showUnitSelector={showUnitSelector}
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
