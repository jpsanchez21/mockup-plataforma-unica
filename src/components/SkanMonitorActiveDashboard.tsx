import React, { useState, useEffect } from 'react';
import { ChevronLeft, Layout, Printer, Play, Settings, Trash2, Plus, X, ChevronDown, ArrowRightLeft } from 'lucide-react';
import ActiveWellChart from './ActiveWellChart';
import ExportDrawer from './ExportDrawer';

interface Props {
  onBack: () => void;
  mockData: any[];
  isHistorical?: boolean;
  isOffline?: boolean;
}


const SkanMonitorActiveDashboard: React.FC<Props> = ({ onBack, isOffline = false }) => {
  const [viewMode, setViewMode] = useState<'RT' | 'HISTORICAL'>(isOffline ? 'HISTORICAL' : 'RT');
  
  const [rawTelemetryData, setRawTelemetryData] = useState<any[]>([]);
  const [timeWindow, setTimeWindow] = useState<any>('2h');
  const [isExportOpen, setIsExportOpen] = useState(false);

  // Dynamic Right-Panel Variables
  const [secondaryVariables, setSecondaryVariables] = useState([
     { id: 'posicion', label: 'Posición Bloque', value: '0.5', unit: 'ft' },
     { id: 'velocidad', label: 'Velocidad Bloque', value: '0.0', unit: 'ft/min' },
     { id: 'carga', label: 'Carga Gancho', value: '6.8', unit: 'Klb' }
  ]);
  const [isAddingVariable, setIsAddingVariable] = useState(false);
  const [editingVariableIndex, setEditingVariableIndex] = useState<number | null>(null);

  const availableVariablesList = [
    'Profundidad', 'Contador Tuberia', 'Peso Sobre Broca', 'Carga Gancho', 
    'Presion Bomba', 'Strokes por minuto', 'Caudal', 'Torque Llave Hid. max', 
    'RPM', 'Torque', 'Torque Llave Pot max', 'Strokes Acumulados', 
    'Barriles Acumulados', 'H2S Boca Pozo', 'LEL Boca Pozo', 'H2S Tanques', 
    'LEL Tanques', 'Profundidad Pozo', 'Tiempo Cuna a Cuna', 'Tiempo en Cuna'
  ];

  useEffect(() => {
    fetch('/data.csv').then(r => r.text()).then(txt => {
       const rows = txt.split('\n').filter(r => r.trim());
       const parsed = rows.slice(1).map((r, ii) => {
          const vals = r.split(',');
          return {
             ts: ii, depth: parseFloat(vals[2]) || 0, wob: parseFloat(vals[11]) || 0, hookload: parseFloat(vals[5]) || 0,
             blockPos: parseFloat(vals[3]) || 0, blockVel: parseFloat(vals[4]) || 0, torqHid: parseFloat(vals[6]) || 0,
             caudal: parseFloat(vals[7]) || 0, pump: parseFloat(vals[8]) || 0, rpm: parseFloat(vals[9]) || 0,
             torque: parseFloat(vals[10]) || 0, spm: parseFloat(vals[12]) || 0, torqPot: parseFloat(vals[10]) || 0, tubes: parseFloat(vals[13]) || 0,
             flow: parseFloat(vals[7]) || 0 // Added flow mapping to map 'caudal' correctly for WellChart
          };
       });
       // Adding proper timestamps since WellChart uses Dates
       const now = Date.now();
       const parsedWithDates = parsed.map((p, i) => ({
           ...p,
           ts: now - (parsed.length - i) * 1000 // Fake 1 second intervals ending now
       }));
       setRawTelemetryData(parsedWithDates);
    });
  }, []);

  return (
    <div className="flex flex-col h-full w-full bg-[#373944] text-white font-sans overflow-hidden">
      
      {/* BRANDING HEADER */}
      <div className="w-full h-[60px] flex items-center px-4 shrink-0 bg-[#1F1F1F] z-[120] border-b border-white/5">
         <div className="flex items-center gap-4 pl-4 h-full py-3">
             <img src="https://dlsinfoappsprod.blob.core.windows.net/clients-logo/SkanHawk logo.png" alt="SkanHawk" className="h-[34px] object-contain" />
             <div className="h-6 w-[1px] bg-white/10 mx-2" />
             <div className="flex flex-col justify-center leading-tight">
                <span className="text-[9px] font-bold text-white uppercase tracking-widest opacity-80">TECNOLOGÍA, EFICIENCIA E INNOVACIÓN</span>
                <span className="text-[9px] font-bold text-white uppercase tracking-widest opacity-80">EN UNA SOLA HERRAMIENTA</span>
             </div>
         </div>
         <div className="ml-auto flex items-center gap-5 mr-4">
            <div className="flex items-center gap-4 text-[14px] font-bold text-white mr-2" style={{ textShadow: '0 0 5px rgba(255,255,255,0.3)' }}>
               <span>{new Date().toLocaleDateString('es-ES', { day: '2-digit', month: '2-digit', year: 'numeric' })}</span>
               <span>{new Date().toLocaleTimeString('es-ES', { hour: '2-digit', minute: '2-digit', second: '2-digit' })}</span>
            </div>
            <button className="flex items-center justify-center w-8 h-8 rounded-full bg-gradient-to-tr from-[#3b3e47] to-[#515461] border border-white/20 shadow-lg hover:brightness-110 transition-all">
               <span className="text-[11px] font-bold text-white">JP</span>
            </button>
         </div>
      </div>

      {/* PROJECT INFO BAR */}
      <div className="h-[50px] bg-[#373944] flex items-center px-6 gap-6 shrink-0 relative z-[100] w-full justify-between pr-10">
         <div className="flex items-center gap-8">
             <div onClick={onBack} className="flex items-center gap-3 cursor-pointer bg-[#373944] h-[44px] px-5 shadow-[0_0_20px_rgba(0,0,0,0.8)] hover:brightness-110 transition-all group border border-white/5">
                <div className="w-7 h-7 bg-[#47CEAC] rounded-full flex items-center justify-center shadow-inner group-hover:scale-105 transition-transform shrink-0">
                   <Layout size={14} className="text-[#1A1A1A]" />
                </div>
                <span className="text-[11px] font-bold text-white uppercase tracking-wider font-sans mt-0.5">SELECCIONAR INTERVENCION</span>
             </div>
             
             <button 
                 onClick={() => setViewMode(viewMode === 'RT' ? 'HISTORICAL' : 'RT')}
                 disabled={isOffline && viewMode === 'HISTORICAL'}
                 className="flex items-center gap-2 cursor-pointer bg-[#373944] h-[44px] px-5 shadow-[0_0_20px_rgba(0,0,0,0.8)] hover:brightness-110 transition-all group border border-white/5 disabled:opacity-50"
             >
                <ArrowRightLeft size={14} className="text-white opacity-80 group-hover:opacity-100 transition-opacity" />
                <span className="text-[11px] font-bold text-white uppercase tracking-wider font-sans mt-0.5">
                   {viewMode === 'RT' ? 'Histórico' : 'RT'}
                </span>
             </button>
         </div>
         
         <div className="flex-1 flex items-center justify-around max-w-[1000px]">
             <div className="flex items-center gap-2">
                 <div className={`w-3.5 h-3.5 rounded-full ${isOffline ? 'bg-red-600 shadow-[0_0_8px_#dc2626]' : 'bg-[#008000] shadow-[0_0_8px_#008000]'} border-[2px] border-white`}></div>
                 <span className="text-[11px] font-bold text-white uppercase tracking-widest mt-0.5">{isOffline ? 'OFFLINE' : 'ONLINE'}</span>
             </div>

             <div className="flex items-center gap-1.5">
                 <span className="text-[11px] font-bold text-white/80">Pozo:</span>
                 <span className="text-[11px] font-normal text-white">CASTILLA NORTE-48</span>
             </div>
             
             <div className="flex items-center gap-1.5">
                 <span className="text-[11px] font-bold text-white/80">Intervención:</span>
                 <span className="text-[11px] font-normal text-white">WORKOVER</span>
             </div>
             
             <div className="flex items-center gap-1.5">
                 <span className="text-[11px] font-bold text-white/80">Torre:</span>
                 <span className="text-[11px] font-normal text-white">INDEP-27</span>
             </div>

             <div className="flex items-center gap-1.5">
                 <span className="text-[11px] font-bold text-white/80">Tiempo de Intervención:</span>
                 <span className="text-[11px] font-normal text-white">17 dia/s 16 hora/s</span>
             </div>
         </div>
      </div>

      {/* MAIN WORKSPACE */}
      <div className="flex-1 flex overflow-hidden px-1.5 pb-1.5 pt-0.5 bg-[#373944] relative gap-1.5">
         
         {/* LEFT CHART */}
         <div className="flex-1 h-full border border-[#515151] shadow-2xl bg-[#1c1c1e] overflow-hidden flex relative z-10 min-w-0">
            <ActiveWellChart 
               data={rawTelemetryData} 
               latestPoint={rawTelemetryData.length ? rawTelemetryData[rawTelemetryData.length - 1] : null} 
               loading={false} 
               timeWindow={timeWindow} 
               onTimeWindowChange={setTimeWindow}
               isHistorical={viewMode === 'HISTORICAL'}
            />
         </div>

         {/* RIGHT DASHBOARD PANELS */}
         <div className="w-[480px] shrink-0 h-full flex gap-1.5 pr-2 relative z-[100]">
            
            {/* --- COLUMN 1: Main Stats & Notes --- */}
            <div className="flex-1 min-w-[250px] h-full flex flex-col gap-1.5">
               {/* Top Split (WOB & ROP) */}
               <div className="h-[90px] flex gap-1.5 shrink-0">
                  {/* WOB Box */}
                  <div className="flex-1 bg-[#1a1a1b] border border-[#515151] flex flex-col relative px-3 py-2 overflow-hidden">
                     <span className="text-[9px] font-bold text-white mb-2 leading-none text-center">Peso Sobre Broca</span>
                     <div className="flex items-end justify-center gap-1 my-auto">
                        <span className="text-[18px] font-bold leading-none">0</span>
                        <span className="text-[10px] pb-[2px]">Klb</span>
                     </div>
                     <div className="flex flex-col text-[8px] mt-auto">
                        <span>Min: -30 Klb</span>
                        <span>Max: 50 Klb</span>
                     </div>
                     {/* Bottom Blue Indicator */}
                     <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-[45%] h-[3px] bg-[#0074D9] rounded-t-md"></div>
                  </div>
                  {/* ROP Box */}
                  <div className="flex-1 bg-[#1a1a1b] border border-[#515151] flex flex-col relative px-3 py-2 overflow-hidden">
                     <span className="text-[9px] font-bold text-white mb-2 leading-none text-center">ROP</span>
                     <div className="flex items-end justify-center gap-1 my-auto">
                        <span className="text-[18px] font-bold leading-none">0</span>
                        <span className="text-[10px] pb-[2px]">ft/min</span>
                     </div>
                     <div className="flex flex-col text-[8px] mt-auto">
                        <span>Min: 0 ft/min</span>
                        <span>Max: 350 ft/min</span>
                     </div>
                     {/* Bottom Blue Indicator */}
                     <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-[45%] h-[3px] bg-[#0074D9] rounded-t-md"></div>
                  </div>
               </div>
               
               {/* Middle: Notes Panel */}
               <div className="flex-1 bg-[#1a1a1b] border border-[#515151] flex flex-col relative min-h-0">
                  <div className="flex border-b border-[#515151]">
                     <div className="w-1/2 p-2 border-r border-[#515151]">
                        <span className="text-[10px] font-bold text-white uppercase border-b border-[#fff] pb-0.5">Hora Fecha</span>
                     </div>
                     <div className="w-1/2 p-2 relative overflow-hidden">
                        <span className="text-[10px] font-bold text-white uppercase border-b border-[#fff] pb-0.5 relative z-10 w-fit inline-block">Nota</span>
                        <div className="absolute inset-x-0 bottom-0 top-1/2 bg-gradient-to-r from-transparent via-white/20 to-transparent"></div>
                     </div>
                  </div>
                  {/* Notes Content */}
                  <div className="flex-1 p-3 overflow-y-auto">
                     <div className="flex items-start gap-2 bg-[#1F1F1F] rounded p-2 border border-white/5 shadow-inner">
                        <div className="w-4 h-4 rounded-full border border-white/40 flex items-center justify-center shrink-0 mt-0.5 text-[10px] font-bold">!</div>
                        <div className="flex flex-col text-[10px] font-bold text-white">
                           <span>Notas no registradas entre:</span>
                           <span className="text-white/80 font-normal">14:00:03 17/04/2026</span>
                           <span className="text-white/80 font-normal">16:00:03 17/04/2026</span>
                        </div>
                     </div>
                  </div>
               </div>

               {/* Bottom Split (Gases & Ton Milla) */}
               <div className="h-[90px] flex gap-1.5 shrink-0">
                  {/* Box 5: Nivel de Gases */}
                  <div className="flex-[1.2] bg-[#1a1a1b] border border-[#515151] rounded-none flex flex-col items-center pt-2 pb-1 relative">
                     <span className="text-[11px] font-black text-white tracking-widest uppercase drop-shadow-sm leading-none">NIVEL DE GASES</span>
                     <span className="text-[9px] font-bold text-white/90 uppercase tracking-widest mt-1">BOCA TANQUE</span>
                     
                     <div className="flex-1 flex w-full relative items-center justify-center gap-3">
                        {/* Grid 2x2 with lines */}
                        <div className="relative w-[45px] h-[45px] flex items-center justify-center">
                           {/* Cross lines */}
                           <div className="absolute w-full h-[1.5px] bg-white top-1/2 -translate-y-1/2"></div>
                           <div className="absolute h-full w-[1.5px] bg-white left-1/2 -translate-x-1/2"></div>
                           {/* Numbers */}
                           <span className="absolute top-1 left-[6px] text-[10px] font-bold text-white">0</span>
                           <span className="absolute top-1 right-[6px] text-[10px] font-bold text-white">0</span>
                           <span className="absolute bottom-1 left-[6px] text-[10px] font-bold text-white">0</span>
                           <span className="absolute bottom-1 right-[6px] text-[10px] font-bold text-white">0</span>
                        </div>
                        
                        {/* Legends */}
                        <div className="flex flex-col gap-1 items-center pb-1">
                            <div className="flex flex-col items-center leading-[1.1] text-[#F59B22]">
                               <span className="text-[10px] font-black uppercase">LEL</span>
                               <span className="text-[9px] font-black">(%)</span>
                            </div>
                            <div className="flex flex-col items-center leading-[1.1] text-[#F59B22]">
                               <span className="text-[10px] font-black uppercase">H2S</span>
                               <span className="text-[9px] font-black">ppm</span>
                            </div>
                        </div>
                     </div>
                  </div>

                  {/* Box 6: Tonelada Milla */}
                  <div className="flex-1 bg-[#1a1a1b] border border-[#515151] rounded-none flex flex-col relative overflow-hidden pl-2 pr-2 pt-2 pb-1">
                     {/* Winch SVG Background */}
                     <div className="absolute top-[-10px] bottom-0 -right-4 w-[110px] flex items-center justify-center opacity-70 pointer-events-none">
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
                     <div className="relative z-10 w-full flex flex-col h-full">
                        <div className="w-full text-center">
                           <span className="text-[10px] font-black text-white tracking-wider uppercase drop-shadow-md whitespace-nowrap">TONELADA MILLA</span>
                        </div>
                        <div className="flex-1 flex flex-col justify-center items-start pl-2 text-left">
                           <span className="text-[26px] font-black text-white leading-none drop-shadow-[0_2px_4px_rgba(0,0,0,1)]">181.98</span>
                        </div>
                     </div>
                  </div>
               </div>
            </div>

            {/* --- COLUMN 2: Secondary Quick-Access Values --- */}
            <div className="w-[196px] shrink-0 flex flex-col gap-3 relative pb-20 overflow-y-auto hidden-scrollbar">
               
               {secondaryVariables.map((v, i) => (
                  <div key={i} className="flex-shrink-0 h-[58px] bg-[#C3C3C3] flex flex-col items-center justify-center leading-tight relative ml-2 mt-2">
                     {/* Overlapping Gear Icon */}
                     <div 
                        className="absolute left-[-11px] top-[-11px] w-[22px] h-[22px] bg-transparent rounded-full flex items-center justify-center cursor-pointer z-20 group"
                        onClick={() => setEditingVariableIndex(editingVariableIndex === i ? null : i)}
                     >
                        <Settings size={20} className="text-white drop-shadow-[0_0_2px_rgba(0,0,0,0.8)] group-hover:rotate-90 transition-transform" />
                     </div>

                     {/* Overlapping Trash Icon (Visible ONLY for dynamically added variables, i >= 3) */}
                     {i >= 3 && (
                        <div 
                           className="absolute right-[-11px] top-[-11px] w-[22px] h-[22px] rounded-full flex items-center justify-center cursor-pointer z-20 hover:scale-110 transition-transform"
                           onClick={() => setSecondaryVariables(sv => sv.filter((_, idx) => idx !== i))}
                        >
                           <Trash2 size={16} className="text-[#db4437] drop-shadow-[0_0_2px_rgba(255,255,255,0.8)]" />
                           <div className="absolute inset-0 border-[1.5px] border-white rounded-full opacity-60 pointer-events-none"></div>
                        </div>
                     )}

                     <div className="flex items-end gap-1">
                        <span className="text-[18px] font-black text-black">{v.value}</span>
                        <span className="text-[11px] font-bold text-black/60 pb-[3px]">{v.unit}</span>
                     </div>
                     <span className="text-[10px] font-bold text-black/60">{v.label}</span>

                     {/* Gear Open Dropdown Menu */}
                     {editingVariableIndex === i && (
                        <div className="absolute left-0 top-[28px] w-[180px] bg-[#1c1c1e] text-white border border-black shadow-2xl rounded-sm z-[200]">
                           <div className="flex items-center justify-between p-2 border-b border-white/10">
                              <span className="text-[10px] font-bold uppercase text-[#47CEAC]">SELECCIONAR VARIABLES</span>
                              <X size={12} className="cursor-pointer hover:text-[#db4437]" onClick={(e) => { e.stopPropagation(); setEditingVariableIndex(null); }} />
                           </div>
                           <div className="p-2">
                              <div className="relative">
                                 <select 
                                    className="w-full bg-white text-black text-[11px] p-1.5 font-bold appearance-none outline-none border border-black shadow-sm"
                                    value={v.label}
                                    onChange={(e) => {
                                       const newLabel = e.target.value;
                                       setSecondaryVariables(sv => sv.map((item, idx) => idx === i ? { ...item, label: newLabel, unit: '...', value: '0.0' } : item));
                                       setEditingVariableIndex(null);
                                    }}
                                 >
                                    {availableVariablesList.map(opt => (
                                       <option key={opt} value={opt}>{opt}</option>
                                    ))}
                                 </select>
                                 <ChevronDown size={14} className="absolute right-2 top-1/2 -translate-y-1/2 pointer-events-none text-black" />
                              </div>
                           </div>
                        </div>
                     )}
                  </div>
               ))}

               {/* Green Plus Button */}
               <div className="w-full flex justify-center mt-2 relative">
                  <div 
                     className="w-8 h-8 rounded-full bg-[#373944] border-2 border-[#47CEAC] flex items-center justify-center shadow-[0_0_8px_rgba(71,206,172,0.3)] hover:bg-[#47CEAC] hover:text-black cursor-pointer transition-colors text-[#47CEAC]"
                     onClick={() => setIsAddingVariable(true)}
                  >
                     <Plus size={16} className="pointer-events-none" />
                  </div>

                  {/* Add Variable Modal Popup */}
                  {isAddingVariable && (
                     <div className="absolute top-[40px] left-1/2 -translate-x-1/2 w-[220px] bg-[#1c1c1e] border border-black shadow-2xl rounded-sm z-[200]">
                        <div className="flex items-center justify-between p-2 pb-1">
                           <span className="text-[10px] font-bold uppercase text-[#47CEAC]">SELECCIONAR VARIABLES</span>
                           <X size={12} className="cursor-pointer hover:text-[#db4437] text-white" onClick={() => setIsAddingVariable(false)} />
                        </div>
                        <div className="p-3 pt-2">
                           <div className="relative mb-3">
                              <select 
                                 className="w-full bg-white text-black text-[12px] p-1.5 font-bold appearance-none outline-none border border-black shadow-sm"
                                 id="new-var-select"
                              >
                                 <option disabled>Seleccione la variable</option>
                                 {availableVariablesList.map(opt => <option key={opt} value={opt}>{opt}</option>)}
                              </select>
                              <ChevronDown size={14} className="absolute right-2 top-1/2 -translate-y-1/2 pointer-events-none text-black" />
                           </div>
                           <button 
                              className="w-full bg-[#47CEAC] text-black font-bold text-[12px] py-1.5 hover:brightness-110 transition-all border border-black shadow-sm"
                              onClick={() => {
                                 const sel = document.getElementById('new-var-select') as HTMLSelectElement;
                                 if (sel && sel.value !== 'Seleccione la variable') {
                                    setSecondaryVariables(sv => [...sv, { id: 'new', label: sel.value, value: '157.0', unit: 'Tubos' }]);
                                    setIsAddingVariable(false);
                                 }
                              }}
                           >
                              Agregar
                           </button>
                        </div>
                     </div>
                  )}
               </div>
            </div>
         </div>
         
         <button 
             onClick={() => setIsExportOpen(!isExportOpen)}
             className={`absolute top-1/2 -translate-y-1/2 z-[160] w-[36px] h-[44px] bg-[#F0F0F0] text-[#121214] rounded-l-full shadow-2xl flex items-center justify-center border border-white/10 hover:bg-white transition-all duration-300 ease-in-out`}
             style={{ right: isExportOpen ? '400px' : '0' }}
         >
            {isExportOpen ? (
               <Play size={14} className="fill-[#121214] ml-2 opacity-90" />
            ) : (
               <Printer size={20} strokeWidth={2.5} className="mr-0.5 opacity-90" />
            )}
         </button>
         
         <ExportDrawer isOpen={isExportOpen} onClose={() => setIsExportOpen(false)} />
      </div>
    </div>
  );
};

export default SkanMonitorActiveDashboard;
