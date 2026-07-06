// src/components/Sidebar.tsx
import React from 'react';
import { PieChart, Pie, Cell, ResponsiveContainer } from 'recharts';
import { Lock } from 'lucide-react';

const Sidebar: React.FC = () => {
   const activityData = [
      { name: 'No Actividad', value: 100, color: '#00FFC8' }
   ];

   const statuses = [
      { l: 'Operativo', c: '#a3e635' },
      { l: 'Downtime', c: '#facc15' },
      { l: 'Npt', c: '#ef4444' },
      { l: 'Variable No Ope', c: '#ec4899' },
      { l: 'Esperas', c: '#8b5cf6' },
      { l: 'Arranque', c: '#fb923c' },
      { l: 'Standby', c: '#94a3b8' },
      { l: 'Otros', c: '#ffffff' },
   ];

   return (
      <div className="w-[262px] min-w-[262px] flex flex-col gap-2 h-full select-none">

         {/* Widgets Restantes */}
         <div className="flex gap-2 h-[100px] shrink-0">

            {/* Box 5: Nivel de Gases */}
            <div className="glass-panel flex-[1.2] flex flex-col items-center pt-2 pb-1 bg-[#1D1D20] relative">
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
            <div className="glass-panel flex-1 flex flex-col bg-[#1D1D20] relative overflow-hidden pl-2 pr-2 pt-2 pb-1">
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
   );
};

export default Sidebar;
