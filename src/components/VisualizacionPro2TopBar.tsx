import React from 'react';
import { VolumeX, Layout, Home } from 'lucide-react';
import { PageView } from '../App';
import UserDropdown from './UserDropdown';

interface VisualizacionPro2TopBarProps {
  currentPage?: PageView;
  onGoToInterventions?: () => void;
  onGoHome?: () => void;
  onLogout?: () => void;
}

const VisualizacionPro2TopBar: React.FC<VisualizacionPro2TopBarProps> = ({ currentPage = 'dashboard', onGoToInterventions, onGoHome, onLogout }) => {
  return (
    <header className="h-[50px] flex items-center absolute top-0 left-0 right-0 z-50 select-none px-4 bg-[#1B1B1E] border-b border-[#2A2A2E] shadow-xl">

      {currentPage === 'interventions' && (
         <button onClick={onGoHome} className="flex items-center gap-2 pr-6 mr-6 border-r border-[#333] text-white opacity-70 hover:opacity-100 hover:text-[#00d0c3] transition-all group">
            <Home size={16} className="group-hover:text-[#00d0c3] transition-colors" />
            <span className="text-[10px] font-bold tracking-widest uppercase mt-[1px] hidden md:inline">PLATAFORMA</span>
         </button>
      )}

      <img
        src="https://dlsinfoappsprod.blob.core.windows.net/clients-logo/SkanHawk logo.png"
        alt="SkanHawk"
        className="h-[28px] object-contain opacity-90"
      />

      <div className="ml-5 hidden lg:flex flex-col justify-center items-start pl-5 border-l border-white/10">
        <span className="text-[9px] font-bold tracking-[0.15em] text-white/60 uppercase leading-tight">
          TECNOLOGÍA, EFICIENCIA E INNOVACIÓN
        </span>
        <span className="text-[9px] font-bold tracking-[0.15em] text-white/60 uppercase leading-tight">
          EN UNA SOLA HERRAMIENTA
        </span>
      </div>

      {currentPage === 'dashboard' && (
        <>
          <div className="ml-6 hidden md:flex items-center">
             <span className="text-[10px] font-black text-white uppercase tracking-widest drop-shadow-md">
                POZO: CASTILLA NORTE-407
             </span>
          </div>

          <div className="ml-4 hidden md:flex items-center gap-1.5">
             <div className="w-[10px] h-[10px] rounded-full bg-[#008000] shadow-[0_0_8px_rgba(0,128,0,0.8)]"></div>
             <span className="text-[10px] font-black text-white tracking-widest uppercase mt-[1px] drop-shadow-md">ONLINE</span>
          </div>
        </>
      )}

      <div className={`hidden md:flex items-center ${currentPage === 'dashboard' ? 'ml-6' : 'ml-auto mr-6'}`}>
         <span className="text-[10px] font-bold text-white tracking-widest drop-shadow-md">
            10/04/2026 11:05:28 (Hora Pozo)
         </span>
      </div>

      {currentPage === 'dashboard' && (
         <div className="shrink-0 ml-24">
            <button
              onClick={onGoToInterventions}
              className="flex items-center gap-3 pl-1.5 pr-4 py-1.5 rounded border border-white/10 bg-[#252528] hover:bg-[#323238] transition-all shadow-inner"
            >
               <div className="w-6 h-6 rounded-full bg-[#2dd4bf] flex items-center justify-center shrink-0 shadow-md">
                  <Layout size={12} className="text-black" />
               </div>
               <span className="hidden md:inline text-[9.5px] font-bold text-white tracking-widest uppercase drop-shadow-sm">
                  SELECCIONAR INTERVENCIÓN - POZO
               </span>
            </button>
         </div>
      )}

      <div className="ml-auto hidden md:flex items-center gap-2">
         <span className="text-[10px] font-bold text-white tracking-widest uppercase opacity-80">INFO.</span>
         <div className="w-[30px] h-[16px] bg-[#111111] border border-white/20 rounded-full relative flex items-center px-[2px] cursor-pointer shadow-inner">
            <div className="w-3 h-3 bg-white rounded-full"></div>
         </div>
      </div>

      <div className="ml-6 flex items-center gap-5 border-l border-white/10 pl-6 h-full">
         <VolumeX size={18} className="text-white cursor-pointer hover:text-[#2dd4bf] transition-colors" />
         <UserDropdown onLogout={onLogout || (() => {})} />
      </div>

    </header>
  );
};

export default VisualizacionPro2TopBar;
