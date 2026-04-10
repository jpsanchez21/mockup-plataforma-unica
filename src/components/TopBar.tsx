// src/components/TopBar.tsx
import React from 'react';
import { User, LogOut, VolumeX, Layout } from 'lucide-react';
import { PageView } from '../App';

interface TopBarProps {
  currentPage?: PageView;
  onGoToInterventions?: () => void;
}

const TopBar: React.FC<TopBarProps> = ({ currentPage = 'dashboard', onGoToInterventions }) => {
  return (
    <header className="h-[50px] flex items-center absolute top-0 left-0 right-0 z-50 select-none px-4 bg-[#1B1B1E] border-b border-[#2A2A2E] shadow-xl">
      
      {/* 1. SkanHawk Logo */}
      <img 
        src="https://dlsinfoappsprod.blob.core.windows.net/clients-logo/SkanHawk logo.png" 
        alt="SkanHawk" 
        className="h-[22px] object-contain brightness-0 invert opacity-60"
      />

      {/* 2. Text */}
      <div className="ml-6 flex flex-col justify-center items-center text-center">
        <span className="text-[9px] font-bold tracking-[0.15em] text-white uppercase leading-tight drop-shadow-sm">
          TECNOLOGÍA, EFICIENCIA E INNOVACIÓN
        </span>
        <span className="text-[9px] font-bold tracking-[0.15em] text-white uppercase leading-tight drop-shadow-sm">
          EN UNA SOLA HERRAMIENTA
        </span>
      </div>

      {/* 3. Otro Logo */}
      <div className="ml-6 px-4 border-l border-white/10 h-3/5 flex items-center">
        <img 
          src="https://dlsinfoappsprod.blob.core.windows.net/clients-logo/SkanHawk logo.png" 
          alt="SkanHawk" 
          className="h-[28px] object-contain opacity-80"
        />
      </div>

      {currentPage === 'dashboard' && (
        <>
          {/* 4. El Pozo */}
          <div className="ml-6 flex items-center">
             <span className="text-[10px] font-black text-white uppercase tracking-widest drop-shadow-md">
                POZO: CASTILLA NORTE-407
             </span>
          </div>

          {/* 5. Online Circle */}
          <div className="ml-4 flex items-center gap-1.5">
             <div className="w-[10px] h-[10px] rounded-full bg-[#008000] shadow-[0_0_8px_rgba(0,128,0,0.8)]"></div>
             <span className="text-[10px] font-black text-white tracking-widest uppercase mt-[1px] drop-shadow-md">ONLINE</span>
          </div>
        </>
      )}

      {/* 6. Date & Time */}
      <div className={`flex items-center ${currentPage === 'dashboard' ? 'ml-6' : 'ml-auto mr-6'}`}>
         <span className="text-[10px] font-bold text-white tracking-widest drop-shadow-md">
            10/04/2026 11:05:28 (Hora Pozo)
         </span>
      </div>

      {/* 7. Selector de Pozo */}
      <div className="shrink-0">
         <button 
           onClick={onGoToInterventions}
           className="flex items-center gap-3 pl-1.5 pr-4 py-1.5 rounded border border-white/10 bg-[#252528] hover:bg-[#323238] transition-all shadow-inner"
         >
            <div className="w-6 h-6 rounded-full bg-[#2dd4bf] flex items-center justify-center shrink-0 shadow-md">
               <Layout size={12} className="text-black" />
            </div>
            <span className="text-[9.5px] font-bold text-white tracking-widest uppercase drop-shadow-sm">
               SELECCIONAR INTERVENCIÓN - POZO
            </span>
         </button>
      </div>

      {/* 8. Botón Info */}
      <div className="ml-auto flex items-center gap-2">
         <span className="text-[10px] font-bold text-white tracking-widest uppercase opacity-80">INFO.</span>
         <div className="w-[30px] h-[16px] bg-[#111111] border border-white/20 rounded-full relative flex items-center px-[2px] cursor-pointer shadow-inner">
            <div className="w-3 h-3 bg-white rounded-full"></div>
         </div>
      </div>

      {/* 9. Perfil, Sonido y Salir */}
      <div className="ml-6 flex items-center gap-5 border-l border-white/10 pl-6 h-full">
         <div className="w-[28px] h-[28px] rounded-full border border-white/80 flex items-center justify-center cursor-pointer hover:bg-white/10 transition-colors">
            <User size={16} className="text-white" />
         </div>
         
         <VolumeX size={18} className="text-white cursor-pointer hover:text-[#2dd4bf] transition-colors" />
         
         <div className="flex items-center gap-2 cursor-pointer group">
            <span className="text-[10px] font-black text-white tracking-widest uppercase group-hover:text-[#2dd4bf] transition-colors mt-0.5">SALIR</span>
            <LogOut size={16} className="text-white group-hover:text-[#2dd4bf] transition-colors" />
         </div>
      </div>

    </header>
  );
};

export default TopBar;
