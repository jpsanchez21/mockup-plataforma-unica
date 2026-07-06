import React, { useState } from 'react';
import { ChevronDown, Lock } from 'lucide-react';
import SkanMonitorDashboard from './SkanMonitorDashboard';

interface Props {
  onOpenIntervention: (mode: 'activas' | 'historicas', isOffline?: boolean) => void;
  onBack: () => void;
  initialTab?: 'activas' | 'historicas';
}

const mockActivas = [
  { id: 1, torre: 'PETROT-2', municipio: 'CANTAGALLO', pozo: 'YARIGUI-193', inicio: '17/03/2026', online: false },
  { id: 2, torre: 'BRASERV-3', municipio: 'VILLAVICENCIO', pozo: 'SURIA-32', inicio: '03/04/2026', online: true },
  { id: 3, torre: 'PETROT-3', municipio: 'ARAUCA', pozo: 'LA YUCA-238', inicio: '07/04/2026', online: true },
  { id: 4, torre: 'BRASERV-5', municipio: 'ACACIAS', pozo: 'AKACIAS-541', inicio: '19/03/2026', online: true },
  { id: 5, torre: 'PETROT-6', municipio: 'ARAUCA', pozo: 'LA YUCA-98', inicio: '06/04/2026', online: true },
  { id: 6, torre: 'COLPET-8', municipio: 'ARAUCA', pozo: 'CANO LIMON-51', inicio: '29/03/2026', online: false },
  { id: 7, torre: 'COLPET-9', municipio: 'ARAUCA', pozo: 'LA YUCA-220', inicio: '01/04/2026', online: true },
  { id: 8, torre: 'INDEP-15', municipio: 'VILLAVICENCIO', pozo: 'SURIA-19', inicio: '28/03/2026', online: false },
  { id: 9, torre: 'INDEP-23', municipio: 'ARAUQUITA', pozo: 'REX NE-14', inicio: '30/03/2026', online: false },
  { id: 10, torre: 'INDEP-27', municipio: 'ACACIAS', pozo: 'CASTILLA NORTE-48', inicio: '30/03/2026', online: true },
  { id: 11, torre: 'INDEP-30', municipio: 'ARAUCA', pozo: 'LA YUCA-116', inicio: '06/04/2026', online: true },
  { id: 12, torre: 'INDEP-34', municipio: 'CABUYARO', pozo: 'YATAY-2', inicio: '17/03/2026', online: true },
  { id: 13, torre: 'INDEP-36', municipio: 'ARAUQUITA', pozo: 'COSECHA-C-01', inicio: '18/03/2026', online: false },
  { id: 14, torre: 'BRASERV-40', municipio: 'ACACIAS', pozo: 'AKACIAS-22', inicio: '09/04/2026', online: true },
];

const mockHistoricas = [
  { id: 1, torre: 'CLEAR-105', municipio: 'ANELO', pozo: 'LCAV-883(H)', intervencion: 'CAMBIO DE BOMBA BM', inicio: '27/03/2026', fin: '30/03/2026' },
  { id: 2, torre: 'CLEAR-105', municipio: 'ANELO', pozo: 'LCAV-883(H)', intervencion: 'REPARACION', inicio: '15/02/2026', fin: '20/02/2026' },
  { id: 3, torre: 'CLEAR-105', municipio: 'ANELO', pozo: 'LCAV-12(H)', intervencion: 'CAMBIO DE BOMBA BM', inicio: '21/03/2026', fin: '27/03/2026' },
  { id: 4, torre: 'CLEAR-105', municipio: 'ANELO', pozo: 'LCAV-99(H)', intervencion: 'LIMPIEZA', inicio: '10/01/2026', fin: '15/01/2026' },
  { id: 5, torre: 'BRASERV-149', municipio: 'CASTILLA LA NUEVA', pozo: 'CASTILLA-347', intervencion: 'WORKOVER', inicio: '26/03/2026', fin: '05/04/2026' },
  { id: 6, torre: 'CLEAR-106', municipio: 'ANELO', pozo: 'LCAV-50(H)', intervencion: 'CAMBIO DE BOMBA BM', inicio: '26/03/2026', fin: '01/04/2026' },
  { id: 7, torre: 'COLPET-9', municipio: 'ARAUCA', pozo: 'LA YUCA-122', intervencion: 'WORKOVER', inicio: '26/03/2026', fin: '01/04/2026' },
  { id: 8, torre: 'INDEP-27', municipio: 'CASTILLA LA NUEVA', pozo: 'CASTILLA-130', intervencion: 'WORKOVER', inicio: '16/03/2026', fin: '29/03/2026' },
  { id: 9, torre: 'INDEP-27', municipio: 'CASTILLA LA NUEVA', pozo: 'CASTILLA-100', intervencion: 'WORKOVER', inicio: '07/03/2026', fin: '15/03/2026' },
  { id: 10, torre: 'INDEP-27', municipio: 'CASTILLA LA NUEVA', pozo: 'CASTILLA-130', intervencion: 'COMPLETAMIENTO', inicio: '01/02/2026', fin: '10/02/2026' },
  { id: 11, torre: 'INDEP-53', municipio: 'CASTILLA LA NUEVA', pozo: 'CLIA-6', intervencion: 'WORKOVER', inicio: '25/03/2026', fin: '29/03/2026' },
  { id: 12, torre: 'INDEP-45', municipio: 'ARAUCA', pozo: 'MATANEGRA-83', intervencion: 'WORKOVER', inicio: '25/03/2026', fin: '04/04/2026' },
  { id: 13, torre: 'PETROT-3', municipio: 'ARAUCA', pozo: 'LA YUCA-35', intervencion: 'WORKOVER', inicio: '24/03/2026', fin: '31/03/2026' },
  { id: 14, torre: 'PETROT-6', municipio: 'ARAUQUITA', pozo: 'BAYONERO-1 ST', intervencion: 'WORKOVER', inicio: '22/03/2026', fin: '31/03/2026' },
  { id: 15, torre: 'COLPET-8', municipio: 'ARAUCA', pozo: 'CANO YARUMAL-23', intervencion: 'WORKOVER', inicio: '22/03/2026', fin: '29/03/2026' },
  { id: 16, torre: 'BRASERV-882', municipio: 'CASTILLA LA NUEVA', pozo: 'CASTILLA-443', intervencion: 'WORKOVER', inicio: '21/03/2026', fin: '27/03/2026' }
];

const VisualizacionBasicInterventionsPage: React.FC<Props> = ({ onOpenIntervention, onBack, initialTab = 'activas' }) => {
  const [tab, setTab] = useState<'activas' | 'historicas'>(initialTab);
  const [selectedId, setSelectedId] = useState<number | null>(null);
  const [showPreview, setShowPreview] = useState(false);

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
     if (tab === 'activas') return true;
     if (filterTorre !== 'Todos' && row.torre !== filterTorre) return false;
     if (filterPozo !== 'Todos' && row.pozo !== filterPozo) return false;
     return true;
  });

  if (tab === 'activas') {
      return (
        <div className="w-full h-[calc(100vh-50px)] mt-[50px] bg-[#1F1F1F] text-white flex flex-col relative overflow-hidden select-none font-sans">
          <img
              src="https://dlsinfoappsprod.blob.core.windows.net/clients-logo/SkanHawk logo.png"
              alt="Watermark"
              className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 h-[75vh] object-contain opacity-[0.03] pointer-events-none"
          />

          <div className="flex-1 w-full max-w-7xl mx-auto px-8 pt-6 flex flex-col z-10 relative">
             <div className="flex justify-between items-start mb-6 relative w-full h-[70px]">
                <div className="flex flex-col gap-3 relative z-20">
                    <div 
                       className="relative"
                       onMouseEnter={() => setShowPreview(true)}
                       onMouseLeave={() => setShowPreview(false)}
                    >
                        <button
                          disabled
                          className="px-8 py-2.5 font-bold text-[11px] tracking-[.2em] transition-all flex flex-col items-center bg-[#111] border-t border-l border-r border-[#333] shadow-lg text-white/30 cursor-not-allowed"
                          style={{ borderBottom: '2px solid transparent' }}
                        >
                          <div className="flex items-center gap-2 mb-1">
                             <Lock size={12} className="text-white/30" />
                          </div>
                          <span className="leading-tight">INTERVENCIONES</span>
                          <span className="leading-tight">HISTÓRICAS</span>
                        </button>
                        
                        {showPreview && (
                            <div className="absolute top-full left-0 mt-2 w-[800px] h-[480px] bg-[#1F1F1F] border border-white/10 rounded-xl shadow-2xl p-4 z-[100] pointer-events-none flex flex-col origin-top-left animate-in fade-in zoom-in duration-200">
                               <style>{`
                                  @keyframes histCursor {
                                    0%, 5% { transform: translate(500px, 300px); opacity: 0; }
                                    8% { transform: translate(500px, 300px); opacity: 1; }
                                    15% { transform: translate(140px, 38px); opacity: 1; } /* hover search */
                                    25% { transform: translate(140px, 38px); opacity: 1; } /* type */
                                    30% { transform: translate(400px, 135px); opacity: 1; } /* hover row */
                                    32% { transform: translate(400px, 135px) scale(0.8); opacity: 1; } /* click down */
                                    34% { transform: translate(400px, 135px) scale(1); opacity: 1; } /* click up */
                                    38% { transform: translate(400px, 135px); opacity: 1; }
                                    
                                    /* Screen 2 */
                                    45% { transform: translate(840px, 130px); opacity: 1; } /* move to left filter top */
                                    48% { transform: translate(840px, 130px) scale(0.8); opacity: 1; } /* click filter */
                                    55% { transform: translate(840px, 200px) scale(0.8); opacity: 1; } /* drag down */
                                    57% { transform: translate(840px, 200px) scale(1); opacity: 1; } /* release */
                                    
                                    65% { transform: translate(950px, 250px); opacity: 1; } /* move away */
                                    
                                    80% { transform: translate(1000px, 450px); opacity: 0; } /* fade out */
                                    100% { opacity: 0; }
                                  }
                                  @keyframes histSearchType {
                                    0%, 15% { content: ""; }
                                    17% { content: "C"; }
                                    19% { content: "CA"; }
                                    21% { content: "CAS"; }
                                    23%, 100% { content: "CAST"; }
                                  }
                                  @keyframes histRowHover {
                                    0%, 28% { background: transparent; }
                                    29%, 35% { background: rgba(0, 128, 157, 0.4); } /* hover effect */
                                    36%, 100% { background: transparent; }
                                  }
                                  @keyframes histScreenSlide {
                                    0%, 35% { transform: translateX(0); }
                                    40%, 85% { transform: translateX(-50%); } /* Slide to dashboard */
                                    90%, 100% { transform: translateX(0); }
                                  }
                                  @keyframes histTableFilter {
                                     0%, 21% { opacity: 1; height: auto; }
                                     23%, 100% { opacity: 0; height: 0; visibility: hidden; }
                                  }
                                  @keyframes histLeftFilterDrag {
                                    0%, 48% { top: 0%; height: 100%; opacity: 0; }
                                    49% { top: 0%; height: 100%; opacity: 1; }
                                    55%, 85% { top: 25%; height: 75%; opacity: 1; }
                                    86%, 100% { top: 0%; height: 100%; opacity: 0; }
                                  }
                               `}</style>

                               <div className="flex items-center justify-between mb-3 shrink-0">
                                  <div className="flex flex-col">
                                     <span className="text-[14px] font-bold text-[#00809D] uppercase tracking-wider">Micro Demo: Datos Históricos</span>
                                     <span className="text-[11px] text-white/50 mt-1">Busca, selecciona y analiza la telemetría detallada de cualquier intervención pasada.</span>
                                  </div>
                                  <div className="flex items-center gap-2 bg-white/5 border border-white/10 px-3 py-1.5 rounded-full">
                                     <div className="w-2 h-2 rounded-full bg-[#00809D] animate-pulse"></div>
                                     <span className="text-[9px] font-bold text-white uppercase tracking-wider">Animación Activa</span>
                                  </div>
                               </div>

                               {/* Sliding Container */}
                               <div className="flex-1 w-full bg-[#111] rounded-lg border border-white/10 overflow-hidden relative shadow-inner">
                                  <div className="flex w-[200%] h-full" style={{ animation: 'histScreenSlide 10s cubic-bezier(0.8, 0, 0.2, 1) infinite' }}>
                                     
                                     {/* SCREEN 1: Table List */}
                                     <div className="w-1/2 h-full flex flex-col bg-[#1A1A1A] p-6 relative">
                                        {/* Fake Cursor */}
                                        <div className="absolute w-[14px] h-[14px] bg-white border border-black rounded-full z-[100] shadow-[0_4px_10px_rgba(0,0,0,0.5)]" 
                                             style={{ animation: 'histCursor 10s infinite', backgroundImage: 'radial-gradient(circle at 30% 30%, #fff, #bbb)' }}></div>

                                        <div className="flex justify-between items-center mb-6">
                                           <div className="flex flex-col gap-1 w-[200px]">
                                              <label className="text-[10px] font-bold uppercase text-white/50 tracking-widest pl-1">Buscar Pozo / Torre</label>
                                              <div className="w-full h-[32px] bg-[#111] border border-white/20 rounded px-3 flex items-center text-[11px] text-white font-bold relative">
                                                 <span className="after:content-[''] after:animate-[histSearchType_10s_infinite]"></span>
                                                 <div className="w-[1px] h-3 bg-white ml-[2px] animate-pulse"></div>
                                              </div>
                                           </div>
                                        </div>
                                        
                                        <div className="flex-1 border border-white/5 rounded-t-lg overflow-hidden bg-[#222]">
                                           <table className="w-full text-left text-[11px] text-white/80">
                                              <thead className="bg-[#333] text-white border-b border-[#00809D]/50">
                                                 <tr>
                                                    <th className="px-4 py-3 uppercase tracking-widest font-bold">Torre</th>
                                                    <th className="px-4 py-3 uppercase tracking-widest font-bold">Pozo</th>
                                                    <th className="px-4 py-3 uppercase tracking-widest font-bold">Intervención</th>
                                                    <th className="px-4 py-3 uppercase tracking-widest font-bold">Inicio</th>
                                                 </tr>
                                              </thead>
                                              <tbody className="divide-y divide-white/5 font-medium">
                                                 <tr style={{ animation: 'histRowHover 10s infinite' }} className="transition-colors border-b border-white/5">
                                                    <td className="px-4 py-3 flex items-center gap-2"><div className="w-2 h-2 rounded-full border border-[#00809D]"></div>INDEP-27</td>
                                                    <td className="px-4 py-3">CASTILLA-130</td>
                                                    <td className="px-4 py-3">WORKOVER</td>
                                                    <td className="px-4 py-3">16/03/2026</td>
                                                 </tr>
                                                 <tr style={{ animation: 'histTableFilter 10s infinite' }}>
                                                    <td className="px-4 py-3 flex items-center gap-2"><div className="w-2 h-2 rounded-full border border-white/20"></div>CLEAR-105</td>
                                                    <td className="px-4 py-3">LCAV-883</td>
                                                    <td className="px-4 py-3">REPARACION</td>
                                                    <td className="px-4 py-3">27/03/2026</td>
                                                 </tr>
                                                 <tr style={{ animation: 'histTableFilter 10s infinite' }}>
                                                    <td className="px-4 py-3 flex items-center gap-2"><div className="w-2 h-2 rounded-full border border-white/20"></div>PETROT-3</td>
                                                    <td className="px-4 py-3">LA YUCA-35</td>
                                                    <td className="px-4 py-3">WORKOVER</td>
                                                    <td className="px-4 py-3">24/03/2026</td>
                                                 </tr>
                                                 <tr style={{ animation: 'histTableFilter 10s infinite' }}>
                                                    <td className="px-4 py-3 flex items-center gap-2"><div className="w-2 h-2 rounded-full border border-white/20"></div>BRASERV-149</td>
                                                    <td className="px-4 py-3">CASTILLA-347</td>
                                                    <td className="px-4 py-3">WORKOVER</td>
                                                    <td className="px-4 py-3">26/03/2026</td>
                                                 </tr>
                                              </tbody>
                                           </table>
                                        </div>
                                     </div>

                                     {/* SCREEN 2: Telemetry Dashboard */}
                                     <div className="w-1/2 h-full bg-[#111] relative overflow-hidden flex flex-col">
                                        <div className="absolute inset-0 z-0" style={{ transform: 'scale(0.65)', transformOrigin: 'top left', width: '153.8%', height: '153.8%' }}>
                                           <SkanMonitorDashboard onBack={() => {}} mockData={[]} isHistorical={true} />
                                        </div>
                                        <div className="absolute inset-0 bg-gradient-to-t from-[#1F1F1F] via-[#1F1F1F]/10 to-transparent z-10 pointer-events-none"></div>
                                        
                                        {/* Mock Brush Overlay for left side drag effect */}
                                        <div className="absolute top-[96px] left-[0px] w-[81px] h-[310px] z-20 pointer-events-none overflow-hidden">
                                           <div className="absolute left-0 right-0 border-y-[1.5px] border-[#47CEAC] bg-[#47CEAC]/20 shadow-[0_0_15px_rgba(71,206,172,0.15)] z-[100]" style={{ animation: 'histLeftFilterDrag 10s infinite' }}>
                                              <div className="absolute top-[-18px] left-0 right-0 h-[18px] bg-[#FFC107] flex items-center justify-center shadow-lg">
                                                 <span className="text-[8px] font-black text-black">16 MAR</span>
                                              </div>
                                              <div className="absolute bottom-[-18px] left-0 right-0 h-[18px] bg-[#FFC107] flex items-center justify-center shadow-lg">
                                                 <span className="text-[8px] font-black text-black">17 MAR</span>
                                              </div>
                                           </div>
                                        </div>
                                     </div>
                                  </div>
                               </div>
                            </div>
                        )}
                    </div>
                </div>

                <div className="absolute left-1/2 -translate-x-1/2 flex flex-col items-center top-0 w-full z-10 pointer-events-none">
                   <h1 className="text-2xl font-bold tracking-[0.25em] text-white uppercase drop-shadow mb-2">
                      INTERVENCIONES
                   </h1>
                   <span className="text-[12px] font-semibold text-white/50">
                      Selecciona una intervención y pulsa el botón 'Abrir Intervenciones'
                   </span>
                </div>

                <button
                  onClick={() => {
                    if(selectedId) {
                       onOpenIntervention(tab, selectedItem ? !(selectedItem as any).online : false);
                    }
                  }}
                  className={`px-8 py-2.5 font-bold text-[11px] tracking-[.2em] transition-all flex flex-col items-center bg-[#111] border-t border-l border-r border-[#333] shadow-lg relative z-20
                    ${selectedId ? 'text-white cursor-pointer hover:bg-[#1A1A1A]' : 'text-white/30 cursor-not-allowed'}
                  `}
                  style={{ borderBottom: selectedId ? '2px solid #2dd4bf' : '2px solid transparent' }}
                >
                  <span className="leading-tight">ABRIR</span>
                  <span className="leading-tight">INTERVENCIONES</span>
                </button>
             </div>

             <div className="w-full flex-1 overflow-auto rounded-t border-t border-l border-r border-white/10 bg-black/20 pb-10 mt-6 custom-scrollbar">
                <table className="w-full text-left border-collapse text-[11px]">
                   <thead className="sticky top-0 bg-[#353538] border-b border-[#2dd4bf]/20 shadow-md">
                     <tr>
                       <th className="py-3 px-6 text-white font-bold tracking-wide w-[20%]">Torre</th>
                       <th className="py-3 px-6 text-white font-bold tracking-wide text-center">Municipio</th>
                       <th className="py-3 px-6 text-white font-bold tracking-wide text-center">Pozo</th>
                       <th className="py-3 px-6 text-white font-bold tracking-wide text-center">Inicio</th>
                       <th className="py-3 px-6 text-white font-bold tracking-wide text-center">SKH Estado Conexión</th>
                     </tr>
                   </thead>
                   <tbody className="divide-y divide-white/5">
                     {filteredData.map((row: any) => {
                        const isSelected = selectedId === row.id;
                        return (
                          <tr
                             key={row.id}
                             onClick={() => setSelectedId(row.id)}
                             className={`cursor-pointer transition-colors border-b border-white/5
                                ${isSelected ? 'bg-[#0F4A56] hover:bg-[#0F4A56]' : 'hover:bg-white/5'}
                             `}
                          >
                             <td className="py-3 px-6 flex items-center gap-3">
                                <div className={`w-3.5 h-3.5 rounded-full border-2 flex items-center justify-center shrink-0
                                   ${isSelected ? 'border-[#2dd4bf] bg-transparent' : 'border-white/20 bg-white/80'}
                                `}>
                                   {isSelected && <div className="w-1.5 h-1.5 rounded-full bg-[#2dd4bf]"></div>}
                                </div>
                                <span className={`font-bold uppercase tracking-wider ${isSelected ? 'text-white' : 'text-white/80'}`}>
                                   {row.torre}
                                </span>
                             </td>
                             <td className={`py-3 px-6 text-center font-bold tracking-wider uppercase ${isSelected ? 'text-white' : 'text-white/80'}`}>{row.municipio}</td>
                             <td className={`py-3 px-6 text-center font-bold tracking-wider uppercase ${isSelected ? 'text-white' : 'text-white/80'}`}>{row.pozo}</td>
                             <td className={`py-3 px-6 text-center font-bold tracking-wider uppercase ${isSelected ? 'text-white' : 'text-white/80'}`}>{row.inicio}</td>
                             <td className="py-3 px-6">
                                <div className="flex items-center justify-center gap-2">
                                   <div className={`w-3.5 h-3.5 rounded-full border-[1.5px] border-white shrink-0 ${row.online ? 'bg-[#008000]' : 'bg-[#FF0000]'}`}></div>
                                   <span className={`font-bold tracking-widest uppercase ${isSelected ? 'text-white' : 'text-white/80'}`}>
                                      {row.online ? 'ONLINE' : 'OFFLINE'}
                                   </span>
                                </div>
                             </td>
                          </tr>
                        );
                     })}
                   </tbody>
                </table>
             </div>
          </div>
        </div>
      );
  }

  return (
    <div className=" w-full h-[calc(100vh-50px)] mt-[50px] bg-[#1F1F1F] text-white flex flex-col relative overflow-hidden font-sans">

      <div className="absolute inset-0 pointer-events-none opacity-[0.05] flex items-center justify-center">
         <img src="https://dlsinfoappsprod.blob.core.windows.net/clients-logo/SkanHawk logo.png" alt="Skanhawk background" className="w-[800px] object-contain brightness-0 invert scale-125 translate-y-20" />
      </div>

      <div className="flex-1 w-full max-w-[1300px] mx-auto px-8 lg:px-16 pt-8 flex flex-col relative z-10 pb-10 overflow-hidden">

         <div className="relative mb-6">
            <div className="flex justify-between items-start w-full relative z-10">
               <div className="flex flex-col gap-4">
                  <button
                     onClick={() => { setTab('activas'); setSelectedId(null); }}
                     className="px-6 py-2.5 text-[11px] font-bold uppercase text-white bg-[rgba(26,26,26,0.95)] border border-white/5 border-b-[3px] border-b-[#00809D] transition-all hover:bg-[#222] min-w-[220px]"
                  >
                     INTERVENCIONES ACTIVAS
                  </button>

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
                                    setFilterPozo('Todos');
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
               </div>

               <div className="absolute left-1/2 -translate-x-1/2 flex flex-col items-center text-center mt-1 w-[400px]">
                  <h1 className="text-[20px] font-normal tracking-widest mb-3 text-white uppercase drop-shadow-md">
                     INTERVENCIONES HISTÓRICAS
                  </h1>
                  <span className="text-[10.5px] text-white/70 font-medium tracking-wide">
                     Selecciona una intervención y pulsa el botón 'Abrir Intervención'
                  </span>
               </div>

               <button
                  disabled={!selectedId}
                  onClick={() => onOpenIntervention(tab, false)}
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
                      <th className="px-5 py-3 text-[10.5px] font-bold uppercase tracking-widest text-[#FFF]">Intervención</th>
                      <th className="px-5 py-3 text-[10.5px] font-bold uppercase tracking-widest text-[#FFF]">Inicio</th>
                      <th className="px-5 py-3 text-[10.5px] font-bold uppercase tracking-widest text-[#FFF]">Fin</th>
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
                         <td className="px-5 py-3 text-[12px] font-bold text-white/90 uppercase">{row.intervencion}</td>
                         <td className="px-5 py-3 text-[12px] font-bold text-white/90">{row.inicio}</td>
                         <td className="px-5 py-3 text-[12px] font-bold text-white/90">{row.fin}</td>
                      </tr>
                   ))}
                </tbody>
             </table>
         </div>

      </div>
    </div>
  );
};

export default VisualizacionBasicInterventionsPage;
