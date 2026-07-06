import React, { useState, useEffect } from 'react';
import { ChevronLeft, Layout, Printer, Play } from 'lucide-react';
import WellChart from './WellChart';
import ExportDrawer from './ExportDrawer';

interface Props {
  onBack: () => void;
  mockData: any[];
  isHistorical?: boolean;
  autoAnimate?: boolean;
}


const SkanMonitorDashboard: React.FC<Props> = ({ onBack, autoAnimate }) => {
  const [rawTelemetryData, setRawTelemetryData] = useState<any[]>([]);
  const [timeWindow, setTimeWindow] = useState<any>('2h');
  const [isExportOpen, setIsExportOpen] = useState(false);

  useEffect(() => {
    if (!autoAnimate) return;
    const CYCLE = 12000;
    let timers: ReturnType<typeof setTimeout>[] = [];
    const run = () => {
      timers = [
        setTimeout(() => setIsExportOpen(true), 2500),
        setTimeout(() => setIsExportOpen(false), 8500),
      ];
    };
    run();
    const interval = setInterval(run, CYCLE);
    return () => { timers.forEach(clearTimeout); clearInterval(interval); };
  }, [autoAnimate]);

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
         <div onClick={onBack} className="flex items-center gap-3 cursor-pointer bg-[#373944] px-5 py-2 shadow-[0_0_20px_rgba(0,0,0,0.8)] hover:brightness-110 transition-all group">
            <div className="w-7 h-7 bg-[#47CEAC] rounded-full flex items-center justify-center shadow-inner group-hover:scale-105 transition-transform">
               <Layout size={14} className="text-[#1A1A1A]" />
            </div>
            <span className="text-[11px] font-bold text-white uppercase tracking-wider font-sans">INTERVENCIONES HISTÓRICAS</span>
         </div>
         
         <div className="flex-1 flex items-center justify-around max-w-[1000px]">
             <div className="flex items-center gap-1.5">
                 <span className="text-[11px] font-bold text-white/80">Pozo:</span>
                 <span className="text-[11px] font-normal text-white">MATANEGRA-85</span>
             </div>
             
             <div className="flex items-center gap-1.5">
                 <span className="text-[11px] font-bold text-white/80">Intervención:</span>
                 <span className="text-[11px] font-normal text-white">WORKOVER</span>
             </div>
             
             <div className="flex items-center gap-1.5">
                 <span className="text-[11px] font-bold text-white/80">Torre:</span>
                 <span className="text-[11px] font-normal text-white">PETROT-3</span>
             </div>

             <div className="flex items-center gap-1.5">
                 <span className="text-[11px] font-bold text-white/80">Tiempo de Intervención:</span>
                 <span className="text-[11px] font-normal text-white">5 dia/s 0 hora/s</span>
             </div>
         </div>
      </div>

      {/* MAIN WORKSPACE */}
      <div className="flex-1 flex overflow-hidden px-1.5 pb-1.5 pt-0.5 bg-[#373944] relative">
         <div className="w-full h-full border border-[#515151] shadow-2xl bg-[#1c1c1e] overflow-hidden flex relative z-10">
            <WellChart 
               data={rawTelemetryData} 
               latestPoint={rawTelemetryData.length ? rawTelemetryData[rawTelemetryData.length - 1] : null} 
               loading={false} 
               timeWindow={timeWindow} 
               onTimeWindowChange={setTimeWindow}
               isHistorical={true}
            />
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

export default SkanMonitorDashboard;
