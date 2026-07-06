import React, { useState } from 'react';
import { ChevronDown, Home } from 'lucide-react';

interface Props {
  onOpenIntervention: (mode: 'activas' | 'historicas', isOffline?: boolean) => void;
  onBack: () => void;
  initialTab?: 'activas' | 'historicas';
}

const mockActivas = [
  { id: 1, torre: 'PETROT-2', municipio: 'BOLIVAR', pozo: 'YARIGUI-190', inicio: '17/03/2026', online: false },
  { id: 2, torre: 'PETROT-3', municipio: 'ARAUCA', pozo: 'LA YUCA-238', inicio: '07/04/2026', online: false },
  { id: 3, torre: 'BRASERV-3', municipio: 'VILLAVICENCIO', pozo: 'SURIA-52', inicio: '03/04/2026', online: true },
  { id: 4, torre: 'BRASERV-5', municipio: 'ACACIAS', pozo: 'AKACIAS-540', inicio: '19/03/2026', online: true },
  { id: 5, torre: 'PETROT-6', municipio: 'ARAUCA', pozo: 'LA YUCA-98', inicio: '06/04/2026', online: false },
  { id: 6, torre: 'COLPET-8', municipio: 'ARAUCA', pozo: 'CANO LIMON-51', inicio: '29/03/2026', online: false },
  { id: 7, torre: 'COLPET-9', municipio: 'ARAUCA', pozo: 'LA YUCA-220', inicio: '01/04/2026', online: false },
  { id: 8, torre: 'INDEP-15', municipio: 'VILLAVICENCIO', pozo: 'SURIA-19', inicio: '28/03/2026', online: true },
  { id: 9, torre: 'INDEP-23', municipio: 'ARAUQUITA', pozo: 'REX NE-14', inicio: '30/03/2026', online: false },
  { id: 10, torre: 'INDEP-27', municipio: 'ACACIAS', pozo: 'CASTILLA NORTE-48', inicio: '30/03/2026', online: true },
  { id: 11, torre: 'CLEAR-105', municipio: 'ANELO', pozo: 'LCAV-12(H)', inicio: '10/04/2026', online: true },
  { id: 12, torre: 'INDEP-53', municipio: 'CASTILLA LA NUEVA', pozo: 'CLIA-12', inicio: '12/04/2026', online: true }
];

const mockHistoricas = [
  { id: 1, torre: 'CLEAR-105', municipio: 'ANELO', pozo: 'LCAV-883(H)', intervencion: 'CAMBIO DE BOMBA BM', inicio: '27/03/2026', fin: '30/03/2026' },
  { id: 2, torre: 'CLEAR-105', municipio: 'ANELO', pozo: 'LCAV-883(H)', intervencion: 'REPARACION', inicio: '15/02/2026', fin: '20/02/2026' }, // Repetido Pozo en misma Torre
  { id: 3, torre: 'CLEAR-105', municipio: 'ANELO', pozo: 'LCAV-12(H)', intervencion: 'CAMBIO DE BOMBA BM', inicio: '21/03/2026', fin: '27/03/2026' },
  { id: 4, torre: 'CLEAR-105', municipio: 'ANELO', pozo: 'LCAV-99(H)', intervencion: 'LIMPIEZA', inicio: '10/01/2026', fin: '15/01/2026' },
  { id: 5, torre: 'BRASERV-149', municipio: 'CASTILLA LA NUEVA', pozo: 'CASTILLA-347', intervencion: 'WORKOVER', inicio: '26/03/2026', fin: '05/04/2026' },
  { id: 6, torre: 'CLEAR-106', municipio: 'ANELO', pozo: 'LCAV-50(H)', intervencion: 'CAMBIO DE BOMBA BM', inicio: '26/03/2026', fin: '01/04/2026' },
  { id: 7, torre: 'COLPET-9', municipio: 'ARAUCA', pozo: 'LA YUCA-122', intervencion: 'WORKOVER', inicio: '26/03/2026', fin: '01/04/2026' },
  { id: 8, torre: 'INDEP-27', municipio: 'CASTILLA LA NUEVA', pozo: 'CASTILLA-130', intervencion: 'WORKOVER', inicio: '16/03/2026', fin: '29/03/2026' },
  { id: 9, torre: 'INDEP-27', municipio: 'CASTILLA LA NUEVA', pozo: 'CASTILLA-100', intervencion: 'WORKOVER', inicio: '07/03/2026', fin: '15/03/2026' },
  { id: 10, torre: 'INDEP-27', municipio: 'CASTILLA LA NUEVA', pozo: 'CASTILLA-130', intervencion: 'COMPLETAMIENTO', inicio: '01/02/2026', fin: '10/02/2026' }, // Repetido Pozo
  { id: 11, torre: 'INDEP-53', municipio: 'CASTILLA LA NUEVA', pozo: 'CLIA-6', intervencion: 'WORKOVER', inicio: '25/03/2026', fin: '29/03/2026' },
  { id: 12, torre: 'INDEP-45', municipio: 'ARAUCA', pozo: 'MATANEGRA-83', intervencion: 'WORKOVER', inicio: '25/03/2026', fin: '04/04/2026' },
  { id: 13, torre: 'PETROT-3', municipio: 'ARAUCA', pozo: 'LA YUCA-35', intervencion: 'WORKOVER', inicio: '24/03/2026', fin: '31/03/2026' },
  { id: 14, torre: 'PETROT-6', municipio: 'ARAUQUITA', pozo: 'BAYONERO-1 ST', intervencion: 'WORKOVER', inicio: '22/03/2026', fin: '31/03/2026' },
  { id: 15, torre: 'COLPET-8', municipio: 'ARAUCA', pozo: 'CANO YARUMAL-23', intervencion: 'WORKOVER', inicio: '22/03/2026', fin: '29/03/2026' },
  { id: 16, torre: 'BRASERV-882', municipio: 'CASTILLA LA NUEVA', pozo: 'CASTILLA-443', intervencion: 'WORKOVER', inicio: '21/03/2026', fin: '27/03/2026' }
];

const SkanMonitorInterventionsPage: React.FC<Props> = ({ onOpenIntervention, onBack, initialTab = 'activas' }) => {
  const [tab, setTab] = useState<'activas' | 'historicas'>(initialTab);
  const [selectedId, setSelectedId] = useState<number | null>(null);
  
  const [filterTorre, setFilterTorre] = useState('Todos');
  const [filterPozo, setFilterPozo] = useState('Todos');

  const selectedItem = tab === 'activas' 
     ? mockActivas.find(x => x.id === selectedId) 
     : mockHistoricas.find(x => x.id === selectedId);

  const uniqueTorres = ['Todos', ...Array.from(new Set(mockHistoricas.map(m => m.torre)))].sort();
  const availablePozos = ['Todos', ...Array.from(new Set(
    mockHistoricas
      .filter(m => filterTorre === 'Todos' || m.torre === filterTorre)
      .map(m => m.pozo)
  ))].sort();

  const filteredData = (tab === 'activas' ? mockActivas : mockHistoricas).filter(row => {
     if (tab === 'activas') return true; // Optionally filter activas? User requested specifically for historicas
     if (filterTorre !== 'Todos' && row.torre !== filterTorre) return false;
     if (filterPozo !== 'Todos' && row.pozo !== filterPozo) return false;
     return true;
  });

  return (
    <div className="h-full w-full bg-[#1F1F1F] text-white flex flex-col relative overflow-hidden font-sans">
      
      {/* Background Hawk Logo Outline */}
      <div className="absolute inset-0 pointer-events-none opacity-[0.05] flex items-center justify-center">
         <img src="https://dlsinfoappsprod.blob.core.windows.net/clients-logo/SkanHawk logo.png" alt="Skanhawk background" className="w-[800px] object-contain brightness-0 invert scale-125 translate-y-20" />
      </div>

      {/* Top Header Placeholder */}
      <div className="w-full h-[50px] flex items-center px-4 relative z-10 border-b border-[#2A2A2E] bg-[#1B1B1E] shrink-0 shadow-xl">
         {/* 0. Botón de Plataforma */}
         <button onClick={onBack} className="flex items-center gap-2 pr-6 mr-6 border-r border-[#333] text-white opacity-70 hover:opacity-100 hover:text-[#00d0c3] transition-all group">
            <Home size={16} className="group-hover:text-[#00d0c3] transition-colors" />
            <span className="text-[10px] font-bold tracking-widest uppercase mt-[1px] hidden md:inline">PLATAFORMA</span>
         </button>
         
         <div className="flex items-center gap-4 h-full py-3">
             <div className="flex items-center h-full">
                {/* Reemplaza 'skanmonitor-logo.png' por la ruta real de tu logo */}
                <img src="/skanmonitor-logo.png" alt="SkanMonitor" className="h-[24px] object-contain" onError={(e) => {
                    e.currentTarget.style.display = 'none';
                    e.currentTarget.nextElementSibling?.classList.remove('hidden');
                }} />
                <div className="hidden flex items-center gap-1">
                   <span className="text-[14px] font-light tracking-wide">Skan</span>
                   <span className="text-[14px] font-black tracking-wide">Monitor</span>
                </div>
             </div>
             <div className="flex flex-col justify-center text-center leading-tight">
                <span className="text-[10px] font-normal text-white uppercase tracking-[0.15em]">
                   TECNOLOGÍA, EFICIENCIA E INNOVACIÓN
                </span>
                <span className="text-[10px] font-normal text-white uppercase tracking-[0.15em]">
                   EN UNA SOLA HERRAMIENTA
                </span>
             </div>
         </div>

         <div className="ml-auto text-[11px] font-bold flex items-center gap-3">
             13/04/2026 08:31:00
             <div className="w-6 h-6 rounded-full border border-white/50"></div>
         </div>
      </div>

      <div className="flex-1 w-full max-w-[1300px] mx-auto px-8 lg:px-16 pt-4 flex flex-col relative z-10 pb-10 overflow-hidden">
         
         <div className="relative mb-6">
            <div className="flex justify-between items-start w-full relative z-10">
               {/* Left Group */}
               <div className="flex flex-col gap-4">
                  <button 
                     onClick={() => { setTab(tab === 'activas' ? 'historicas' : 'activas'); setSelectedId(null); }}
                     className="px-6 py-2.5 text-[11px] font-bold uppercase text-white bg-[rgba(26,26,26,0.95)] border border-white/5 border-b-[3px] border-b-[#00809D] transition-all hover:bg-[#222] min-w-[220px]"
                  >
                     {tab === 'activas' ? 'INTERVENCIONES\nHISTÓRICAS' : 'INTERVENCIONES\nACTIVAS'}
                  </button>

                  {/* Filters for Historicas integrated here */}
                  {tab === 'historicas' && (
                     <div className="flex flex-col gap-1 mt-2">
                        <div className="flex gap-4">
                           <div className="flex flex-col gap-1 w-[160px]">
                              <label className="text-[10px] font-bold uppercase text-white/80 tracking-widest pl-1">Torre</label>
                              <div className="relative">
                                 <select 
                                    className="w-full bg-[#111] border border-white/20 text-white rounded px-3 py-1.5 text-[11px] font-bold appearance-none outline-none"
                                    value={filterTorre}
                                    onChange={(e) => {
                                       setFilterTorre(e.target.value);
                                       setFilterPozo('Todos'); // Reset pozo when torre changes
                                    }}
                                 >
                                    {uniqueTorres.map(t => <option key={t} value={t}>{t}</option>)}
                                 </select>
                                 <ChevronDown size={14} className="absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none text-white/50" />
                              </div>
                           </div>
                           <div className="flex flex-col gap-1 w-[160px]">
                              <label className="text-[10px] font-bold uppercase text-white/80 tracking-widest pl-1">Pozo</label>
                              <div className="relative">
                                 <select 
                                    className="w-full bg-[#111] border border-white/20 text-white rounded px-3 py-1.5 text-[11px] font-bold appearance-none outline-none"
                                    value={filterPozo}
                                    onChange={(e) => setFilterPozo(e.target.value)}
                                 >
                                    {availablePozos.map(p => <option key={p} value={p}>{p}</option>)}
                                 </select>
                                 <ChevronDown size={14} className="absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none text-white/50" />
                              </div>
                           </div>
                        </div>
                        <p className="text-[9px] italic text-white/40 mt-1 pl-1">Usa los filtros para encontrar una intervención especifica.</p>
                     </div>
                  )}
               </div>

               {/* Center Title - Absolute to remain perfectly centered regardless of side content */}
               <div className="absolute left-1/2 -translate-x-1/2 flex flex-col items-center text-center mt-1 w-[400px]">
                  <h1 className="text-[20px] font-normal tracking-widest mb-3 text-white uppercase drop-shadow-md">
                     {tab === 'activas' ? 'INTERVENCIONES ACTIVAS' : 'INTERVENCIONES HISTÓRICAS'}
                  </h1>
                  <span className="text-[10.5px] text-white/70 font-medium tracking-wide">
                     Selecciona una intervención y pulsa el botón 'Abrir Intervención'
                  </span>
               </div>

               {/* Right Button */}
               <button 
                  disabled={!selectedId}
                  onClick={() => onOpenIntervention(tab, tab === 'activas' && selectedItem && 'online' in selectedItem ? !selectedItem.online : false)}
                  className={`px-6 py-2.5 min-w-[220px] border border-white/5 bg-[rgba(26,26,26,0.95)] text-[11px] font-bold uppercase border-b-[3px] transition-all ${
                     selectedId ? 'border-b-[#47CEAC] text-white hover:bg-[#222] cursor-pointer' : 'border-b-[#47CEAC]/20 text-white/30 cursor-not-allowed'
                  }`}
               >
                  ABRIR INTERVENCIÓN
               </button>
            </div>
         </div>

         <div className="flex-1 overflow-y-auto w-full custom-scrollbar">
             <table className="w-full border-collapse text-left">
                <thead className="bg-[#525252] sticky top-0 z-10 shadow-lg">
                   <tr>
                      <th className="px-5 py-3 text-[10.5px] font-bold uppercase tracking-widest text-[#FFF]">Torre</th>
                      <th className="px-5 py-3 text-[10.5px] font-bold uppercase tracking-widest text-[#FFF]">Municipio</th>
                      <th className="px-5 py-3 text-[10.5px] font-bold uppercase tracking-widest text-[#FFF]">Pozo</th>
                      {tab === 'historicas' && <th className="px-5 py-3 text-[10.5px] font-bold uppercase tracking-widest text-[#FFF]">Intervención</th>}
                      <th className="px-5 py-3 text-[10.5px] font-bold uppercase tracking-widest text-[#FFF]">Inicio</th>
                      {tab === 'activas' ? (
                         <th className="px-5 py-3 text-[10.5px] font-bold uppercase tracking-widest text-[#FFF]">SKH Estado Conexión</th>
                      ) : (
                         <th className="px-5 py-3 text-[10.5px] font-bold uppercase tracking-widest text-[#FFF]">Fin</th>
                      )}
                   </tr>
                </thead>
                <tbody className="divide-y divide-[#ffffff10]">
                   {filteredData.map((row: any) => (
                      <tr 
                         key={row.id} 
                         onClick={() => setSelectedId(row.id)}
                         className={`cursor-pointer transition-colors ${selectedId === row.id ? 'bg-[#00809D]' : 'bg-transparent hover:bg-white/5'}`}
                      >
                         <td className="px-5 py-3 text-[12px] font-bold flex items-center gap-3">
                            {selectedId === row.id ? (
                               <div className="w-2.5 h-2.5 rounded-full border-[1.5px] border-white shrink-0 bg-transparent"></div>
                            ) : (
                               <div className="w-2.5 h-2.5 rounded-full bg-white shrink-0 shadow-[0_0_8px_rgba(255,255,255,0.4)]"></div>
                            )}
                            {row.torre}
                         </td>
                         <td className="px-5 py-3 text-[12px] font-bold text-white/90">{row.municipio}</td>
                         <td className="px-5 py-3 text-[12px] font-bold text-white/90">{row.pozo}</td>
                         {tab === 'historicas' && <td className="px-5 py-3 text-[12px] font-bold text-white/90 uppercase">{row.intervencion}</td>}
                         <td className="px-5 py-3 text-[12px] font-bold text-white/90">{row.inicio}</td>
                         
                         {tab === 'activas' ? (
                            <td className="px-5 py-3 text-[11px] font-bold uppercase tracking-widest">
                               <div className="flex items-center gap-2">
                                  <div className={`w-3.5 h-3.5 rounded-full border-[1.5px] border-white shrink-0 ${row.online ? 'bg-[#008000]' : 'bg-[#FF0000]'}`}></div>
                                  <span className="text-white">{row.online ? 'ONLINE' : 'OFFLINE'}</span>
                               </div>
                            </td>
                         ) : (
                            <td className="px-5 py-3 text-[12px] font-bold text-white/90">{row.fin}</td>
                         )}
                      </tr>
                   ))}
                </tbody>
             </table>
         </div>

      </div>
    </div>
  );
};

export default SkanMonitorInterventionsPage;
