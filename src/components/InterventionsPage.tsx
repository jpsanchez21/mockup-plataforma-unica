import React, { useState } from 'react';

export interface Intervention {
  id: string;
  torre: string;
  municipio: string;
  pozo: string;
  inicio: string;
  online: boolean;
}

const mockInterventions: Intervention[] = [
  { id: '1',  torre: 'PETROT-2',     municipio: 'CANTAGALLO',    pozo: 'YARIGUI-193',      inicio: '17/03/2026', online: false },
  { id: '2',  torre: 'BRASERV-3',    municipio: 'VILLAVICENCIO', pozo: 'SURIA-32',         inicio: '03/04/2026', online: true },
  { id: '3',  torre: 'PETROT-3',     municipio: 'ARAUCA',        pozo: 'LA YUCA-238',      inicio: '07/04/2026', online: true },
  { id: '4',  torre: 'BRASERV-5',    municipio: 'ACACIAS',       pozo: 'AKACIAS-541',      inicio: '19/03/2026', online: true },
  { id: '5',  torre: 'PETROT-6',     municipio: 'ARAUCA',        pozo: 'LA YUCA-98',       inicio: '06/04/2026', online: true },
  { id: '6',  torre: 'COLPET-8',     municipio: 'ARAUCA',        pozo: 'CANO LIMON-51',    inicio: '29/03/2026', online: false },
  { id: '7',  torre: 'COLPET-9',     municipio: 'ARAUCA',        pozo: 'LA YUCA-220',      inicio: '01/04/2026', online: true },
  { id: '8',  torre: 'INDEP-15',     municipio: 'VILLAVICENCIO', pozo: 'SURIA-19',         inicio: '28/03/2026', online: false },
  { id: '9',  torre: 'INDEP-23',     municipio: 'ARAUQUITA',     pozo: 'REX NE-14',        inicio: '30/03/2026', online: false },
  { id: '10', torre: 'INDEP-27',     municipio: 'ACACIAS',       pozo: 'CASTILLA NORTE-48',inicio: '30/03/2026', online: true },
  { id: '11', torre: 'INDEP-30',     municipio: 'ARAUCA',        pozo: 'LA YUCA-116',      inicio: '06/04/2026', online: true },
  { id: '12', torre: 'INDEP-34',     municipio: 'CABUYARO',      pozo: 'YATAY-2',          inicio: '17/03/2026', online: true },
  { id: '13', torre: 'INDEP-36',     municipio: 'ARAUQUITA',     pozo: 'COSECHA-C-01',     inicio: '18/03/2026', online: false },
  { id: '14', torre: 'BRASERV-40',   municipio: 'ACACIAS',       pozo: 'AKACIAS-22',       inicio: '09/04/2026', online: true },
];

interface Props {
  onOpenDashboard: () => void;
}

const InterventionsPage: React.FC<Props> = ({ onOpenDashboard }) => {
  const [selectedId, setSelectedId] = useState<string | null>(null);

  return (
    <div className="w-full h-[calc(100vh-50px)] mt-[50px] bg-[#1A1A1E] flex flex-col relative overflow-hidden select-none">
      
      {/* Huge Watermark Logo */}
      <img 
          src="https://dlsinfoappsprod.blob.core.windows.net/clients-logo/SkanHawk logo.png" 
          alt="Watermark" 
          className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 h-[75vh] object-contain opacity-[0.03] pointer-events-none"
      />

      <div className="flex-1 w-full max-w-7xl mx-auto px-8 pt-10 flex flex-col z-10 relative">
         
         {/* Top Header Row */}
         <div className="flex justify-between items-center mb-8">
            <h1 className="text-xl font-bold tracking-widest text-white uppercase drop-shadow">INTERVENCIONES</h1>
            
            <button 
              onClick={() => {
                if(selectedId) onOpenDashboard();
              }}
              className={`px-8 py-2.5 font-bold text-[11px] tracking-[.2em] transition-all flex flex-col items-center bg-[#111] border-t border-l border-r border-[#333] shadow-lg
                ${selectedId ? 'text-white cursor-pointer hover:bg-[#1A1A1A]' : 'text-white/30 cursor-not-allowed'}
              `}
              style={{ borderBottom: selectedId ? '2px solid #2dd4bf' : '2px solid transparent' }}
            >
              <span className="leading-tight">ABRIR</span>
              <span className="leading-tight">INTERVENCIONES</span>
            </button>
         </div>

         {/* Helper Text */}
         <div className="w-full text-center mb-6">
            <span className="text-[12px] font-semibold text-white/50">Selecciona una intervención y pulsa el botón 'Abrir Intervención'</span>
         </div>

         {/* Table List */}
         <div className="w-full flex-1 overflow-auto rounded-t border-t border-l border-r border-white/10 bg-black/20 pb-10">
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
                 {mockInterventions.map((inv) => {
                    const isSelected = selectedId === inv.id;
                    return (
                      <tr 
                         key={inv.id} 
                         onClick={() => setSelectedId(inv.id)}
                         className={`cursor-pointer transition-colors border-b border-white/5
                            ${isSelected ? 'bg-[#0F4A56] hover:bg-[#0F4A56]' : 'hover:bg-white/5'}
                         `}
                      >
                         <td className="py-3 px-6 flex items-center gap-3">
                            <div className={`w-3.5 h-3.5 rounded-full border-2 flex items-center justify-center
                               ${isSelected ? 'border-[#2dd4bf]' : 'border-white/20 bg-white/80'}
                            `}>
                               {isSelected && <div className="w-1.5 h-1.5 rounded-full bg-[#2dd4bf]"></div>}
                            </div>
                            <span className={`font-bold uppercase tracking-wider ${isSelected ? 'text-white' : 'text-white/80'}`}>
                               {inv.torre}
                            </span>
                         </td>
                         <td className={`py-3 px-6 text-center font-bold tracking-wider uppercase ${isSelected ? 'text-white' : 'text-white/80'}`}>{inv.municipio}</td>
                         <td className={`py-3 px-6 text-center font-bold tracking-wider uppercase ${isSelected ? 'text-white' : 'text-white/80'}`}>{inv.pozo}</td>
                         <td className={`py-3 px-6 text-center font-bold tracking-wider uppercase ${isSelected ? 'text-white' : 'text-white/80'}`}>{inv.inicio}</td>
                         
                         <td className="py-3 px-6">
                            <div className="flex items-center justify-center gap-2">
                               <div className={`w-2.5 h-2.5 rounded-full ${inv.online ? 'bg-[#2dd4bf] shadow-[0_0_8px_rgba(45,212,191,0.6)]' : 'bg-red-500 shadow-[0_0_8px_rgba(239,68,68,0.6)]'}`}></div>
                               <span className={`font-bold tracking-widest uppercase ${isSelected ? 'text-white' : 'text-white/80'}`}>
                                  {inv.online ? 'ONLINE' : 'OFFLINE'}
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
};

export default InterventionsPage;
