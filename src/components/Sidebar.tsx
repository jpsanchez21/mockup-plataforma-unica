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
      
      {/* Box 1 */}
      <div className="glass-panel flex flex-col shrink-0 bg-[#1D1D20] p-1.5 shadow-lg">
        <table className="w-full text-center border-collapse">
          <thead>
            <tr className="border-b border-white/10 bg-gradient-to-b from-white/10 to-transparent">
              <th className="py-1.5 text-[10px] text-white font-bold tracking-wide drop-shadow-sm">Torre</th>
              <th className="py-1.5 text-[10px] text-white font-bold tracking-wide drop-shadow-sm">Intervención</th>
              <th className="py-1.5 text-[10px] text-white font-bold tracking-wide drop-shadow-sm">Duración</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td className="py-3 text-[10px] text-white">INDEP-219</td>
              <td className="py-3 text-[10px] text-white">WORKOVER</td>
              <td className="py-3 text-[10px] text-white">2 día/s 7 hora/s</td>
            </tr>
          </tbody>
        </table>
        
        <table className="w-full text-center border-collapse mt-1 border-t border-white/10">
          <thead>
            <tr className="border-b border-white/10 bg-gradient-to-b from-white/10 to-transparent">
              <th className="py-1.5 text-[10px] text-white font-bold tracking-wide drop-shadow-sm">Actividad</th>
              <th className="py-1.5 text-[10px] text-white font-bold tracking-wide drop-shadow-sm leading-tight">Estado<br/>Operacional</th>
              <th className="py-1.5 text-[10px] text-white font-bold tracking-wide drop-shadow-sm">Duración</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td className="py-3 text-[10px] text-white">No Actividad</td>
              <td className="py-3 flex justify-center items-center">
                 <div className="w-3 h-3 bg-[#8BC34A] shadow-[0_0_5px_rgba(139,195,74,0.3)] mt-0.5"></div>
              </td>
              <td className="py-3 text-[10px] text-white leading-tight">12 hora/s 13<br/>minuto/s</td>
            </tr>
          </tbody>
        </table>
      </div>

      {/* Box 2 */}
      <div className="glass-panel flex flex-col shrink-0 h-[170px] relative overflow-hidden bg-[#1D1D20]">
        <div className="pt-3 pb-2 flex justify-center w-full z-10 relative">
           <span className="text-[11px] font-black uppercase text-white tracking-widest drop-shadow-md">ACTIVIDADES REPORTADAS</span>
        </div>
        
        <div className="flex-1 flex items-center justify-between px-6 pb-2 w-full z-0">
           {/* Chart Box */}
           <div className="w-[100px] h-[100px] relative flex justify-center items-center">
              <svg viewBox="0 0 100 100" className="w-[110px] h-[110px] absolute drop-shadow-lg">
                 <defs>
                    <radialGradient id="cyanGradient" cx="50%" cy="50%" r="50%" fx="30%" fy="30%">
                       <stop offset="0%" stopColor="#0DE5B2" />
                       <stop offset="100%" stopColor="#0B8B6E" />
                    </radialGradient>
                 </defs>
                 {/* Outer thick donut */}
                 <circle cx="50" cy="50" r="40" fill="url(#cyanGradient)" />
                 {/* Inner hole */}
                 <circle cx="50" cy="50" r="10" fill="#1D1D20" />
              </svg>

              {/* Text overlay exactly at the bottom of the circle */}
              <div className="absolute bottom-[-5px] flex flex-col items-center pointer-events-none">
                 <span className="text-[13px] font-black text-white leading-none tracking-tight" style={{ WebkitTextStroke: '0.8px #333' }}>12.2hr</span>
                 <span className="text-[13px] font-black text-white leading-none tracking-tight" style={{ WebkitTextStroke: '0.8px #333' }}>100%</span>
              </div>
           </div>
           
           {/* Legend Box */}
           <div className="flex-1 flex justify-end pl-2 pr-1">
               <div className="flex items-center gap-2">
                  <div className="w-3.5 h-3.5 shrink-0 bg-[#00FFC8] shadow-sm"></div>
                  <span className="text-[11px] text-white font-bold leading-none tracking-wide">No Actividad</span>
               </div>
           </div>
        </div>
      </div>

      {/* Box 3 */}
      <div className="glass-panel flex-1 min-h-0 flex flex-col p-4">
        <p className="text-[10px] font-bold uppercase text-white/50 tracking-widest text-center mb-4">Estado Operacional</p>
        <div className="grid grid-cols-2 gap-x-2 gap-y-3 mb-4">
           {statuses.map((s, i) => (
             <div key={i} className="flex items-center gap-2">
                <div className="w-2.5 h-2.5 shrink-0 shadow-sm" style={{ backgroundColor: s.c }}></div>
                <span className="text-[9px] text-white/80 font-bold uppercase truncate">{s.l}</span>
             </div>
           ))}
        </div>
        
        <div className="mt-auto">
           <div className="h-4 w-full bg-black/40 border border-white/5 flex relative p-[1px] rounded-sm">
              <div className="h-full bg-[#facc15]" style={{ width: '8%' }}></div>
              <div className="h-full bg-[#a3e635]" style={{ width: '85%' }}></div>
              <div className="h-full bg-[#ef4444]" style={{ width: '7%' }}></div>
           </div>
           <div className="flex justify-between mt-2 text-[8px] font-bold text-white/40 px-1 tracking-widest">
              <span>0</span><span>20</span><span>40</span><span>60</span><span>80</span><span>100</span>
           </div>
        </div>
      </div>

      {/* Box 4 */}
      <div className="glass-panel h-[80px] shrink-0 flex flex-col items-center justify-center relative bg-black/20">
         <Lock size={20} className="text-white/20 mb-1" />
         <span className="text-[10px] font-bold text-white/40 uppercase tracking-widest">No disponible</span>
      </div>

      {/* Box 5 & 6 */}
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
