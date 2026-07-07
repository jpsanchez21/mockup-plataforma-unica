import React, { useState } from 'react';
import { ChevronDown } from 'lucide-react';
import { useInterventions, InterventionRow } from '../hooks/useSkanviewData';

interface Props {
  onOpenIntervention: (mode: 'activas' | 'historicas', isOffline?: boolean, item?: InterventionRow) => void;
  onBack: () => void;
  initialTab?: 'activas' | 'historicas';
}

const VisualizacionPremiumInterventionsPage: React.FC<Props> = ({ onOpenIntervention, onBack, initialTab = 'activas' }) => {
  const { interventions } = useInterventions();
  const mockActivas = interventions.filter(i => i.status === 'ACTIVA');
  const mockHistoricas = interventions.filter(i => i.status === 'TERMINADA');

  const [tab, setTab] = useState<'activas' | 'historicas'>(initialTab);
  const [selectedId, setSelectedId] = useState<number | null>(null);
  const [filterTorre, setFilterTorre] = useState('Todos');
  const [filterPozo, setFilterPozo] = useState('Todos');

  const selectedItem = tab === 'activas'
    ? mockActivas.find(x => x.id === selectedId)
    : mockHistoricas.find(x => x.id === selectedId);

  const uniqueTorres = ['Todos', ...Array.from(new Set(mockHistoricas.map(m => m.torre)))].sort();
  const availablePozos = ['Todos', ...Array.from(new Set(
    mockHistoricas.filter(m => filterTorre === 'Todos' || m.torre === filterTorre).map(m => m.pozo)
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
        <img src="https://dlsinfoappsprod.blob.core.windows.net/clients-logo/SkanHawk logo.png" alt="Watermark"
          className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 h-[75vh] object-contain opacity-[0.03] pointer-events-none" />
        <div className="flex-1 w-full max-w-7xl mx-auto px-8 pt-6 flex flex-col z-10 relative overflow-hidden">
          <div className="flex justify-between items-start mb-6 relative w-full h-[70px]">
            <div className="flex flex-col gap-3 relative z-20">
              <button onClick={() => { setTab('historicas'); setSelectedId(null); }}
                className="px-8 py-2.5 font-bold text-[11px] tracking-[.2em] transition-all flex flex-col items-center bg-[#111] border-t border-l border-r border-[#333] shadow-lg text-white hover:bg-[#1A1A1A] cursor-pointer"
                style={{ borderBottom: '2px solid #00809D' }}>
                <span className="leading-tight">INTERVENCIONES</span>
                <span className="leading-tight">HISTÓRICAS</span>
              </button>
            </div>
            <div className="absolute left-1/2 -translate-x-1/2 flex flex-col items-center top-0 w-full z-10 pointer-events-none">
              <h1 className="text-2xl font-bold tracking-[0.25em] text-white uppercase drop-shadow mb-2">INTERVENCIONES</h1>
              <span className="text-[12px] font-semibold text-white/50">Selecciona una intervención y pulsa el botón 'Abrir Intervenciones'</span>
            </div>
            <button
              onClick={() => { if (selectedId) onOpenIntervention(tab, selectedItem ? !selectedItem.online : false, selectedItem); }}
              className={`px-8 py-2.5 font-bold text-[11px] tracking-[.2em] transition-all flex flex-col items-center bg-[#111] border-t border-l border-r border-[#333] shadow-lg relative z-20 ${selectedId ? 'text-white cursor-pointer hover:bg-[#1A1A1A]' : 'text-white/30 cursor-not-allowed'}`}
              style={{ borderBottom: selectedId ? '2px solid #2dd4bf' : '2px solid transparent' }}>
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
                    <tr key={row.id} onClick={() => setSelectedId(row.id)}
                      className={`cursor-pointer transition-colors border-b border-white/5 ${isSelected ? 'bg-[#0F4A56] hover:bg-[#0F4A56]' : 'hover:bg-white/5'}`}>
                      <td className="py-3 px-6 flex items-center gap-3">
                        <div className={`w-3.5 h-3.5 rounded-full border-2 flex items-center justify-center shrink-0 ${isSelected ? 'border-[#2dd4bf] bg-transparent' : 'border-white/20 bg-white/80'}`}>
                          {isSelected && <div className="w-1.5 h-1.5 rounded-full bg-[#2dd4bf]"></div>}
                        </div>
                        <span className={`font-bold uppercase tracking-wider ${isSelected ? 'text-white' : 'text-white/80'}`}>{row.torre}</span>
                      </td>
                      <td className={`py-3 px-6 text-center font-bold tracking-wider uppercase ${isSelected ? 'text-white' : 'text-white/80'}`}>{row.municipio}</td>
                      <td className={`py-3 px-6 text-center font-bold tracking-wider uppercase ${isSelected ? 'text-white' : 'text-white/80'}`}>{row.pozo}</td>
                      <td className={`py-3 px-6 text-center font-bold tracking-wider uppercase ${isSelected ? 'text-white' : 'text-white/80'}`}>{row.inicio}</td>
                      <td className="py-3 px-6">
                        <div className="flex items-center justify-center gap-2">
                          <div className={`w-3.5 h-3.5 rounded-full border-[1.5px] border-white shrink-0 ${row.online ? 'bg-[#008000]' : 'bg-[#FF0000]'}`}></div>
                          <span className={`font-bold tracking-widest uppercase ${isSelected ? 'text-white' : 'text-white/80'}`}>{row.online ? 'ONLINE' : 'OFFLINE'}</span>
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
    <div className="w-full h-[calc(100vh-50px)] mt-[50px] bg-[#1F1F1F] text-white flex flex-col relative overflow-hidden font-sans">
      <div className="absolute inset-0 pointer-events-none opacity-[0.05] flex items-center justify-center">
        <img src="https://dlsinfoappsprod.blob.core.windows.net/clients-logo/SkanHawk logo.png" alt="" className="w-[800px] object-contain brightness-0 invert scale-125 translate-y-20" />
      </div>
      <div className="flex-1 w-full max-w-[1300px] mx-auto px-8 lg:px-16 pt-8 flex flex-col relative z-10 pb-10 overflow-hidden">
        <div className="relative mb-6">
          <div className="flex justify-between items-start w-full relative z-10">
            <div className="flex flex-col gap-4">
              <button onClick={() => { setTab('activas'); setSelectedId(null); }}
                className="px-6 py-2.5 text-[11px] font-bold uppercase text-white bg-[rgba(26,26,26,0.95)] border border-white/5 border-b-[3px] border-b-[#00809D] transition-all hover:bg-[#222] min-w-[220px]">
                INTERVENCIONES ACTIVAS
              </button>
              <div className="flex flex-col gap-1 mt-2">
                <div className="flex gap-4">
                  <div className="flex flex-col gap-1 w-[160px]">
                    <label className="text-[10px] font-bold uppercase text-white/80 tracking-widest pl-1">Torre</label>
                    <div className="relative">
                      <select className="w-full bg-[#111] border border-white/20 text-white rounded px-3 py-1.5 text-[11px] font-bold appearance-none outline-none"
                        value={filterTorre} onChange={(e) => { setFilterTorre(e.target.value); setFilterPozo('Todos'); }}>
                        {uniqueTorres.map(t => <option key={t} value={t}>{t}</option>)}
                      </select>
                      <ChevronDown size={14} className="absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none text-white/50" />
                    </div>
                  </div>
                  <div className="flex flex-col gap-1 w-[160px]">
                    <label className="text-[10px] font-bold uppercase text-white/80 tracking-widest pl-1">Pozo</label>
                    <div className="relative">
                      <select className="w-full bg-[#111] border border-white/20 text-white rounded px-3 py-1.5 text-[11px] font-bold appearance-none outline-none"
                        value={filterPozo} onChange={(e) => setFilterPozo(e.target.value)}>
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
              <h1 className="text-[20px] font-normal tracking-widest mb-3 text-white uppercase drop-shadow-md">INTERVENCIONES HISTÓRICAS</h1>
              <span className="text-[10.5px] text-white/70 font-medium tracking-wide">Selecciona una intervención y pulsa el botón 'Abrir Intervención'</span>
            </div>
            <button disabled={!selectedId} onClick={() => onOpenIntervention(tab, false, selectedItem)}
              className={`px-6 py-2.5 min-w-[220px] border border-white/5 bg-[rgba(26,26,26,0.95)] text-[11px] font-bold uppercase border-b-[3px] transition-all ${selectedId ? 'border-b-[#47CEAC] text-white hover:bg-[#222] cursor-pointer' : 'border-b-[#47CEAC]/20 text-white/30 cursor-not-allowed'}`}>
              ABRIR INTERVENCIÓN
            </button>
          </div>
        </div>
        <div className="flex-1 overflow-y-auto w-full custom-scrollbar">
          <table className="w-full border-collapse text-left">
            <thead className="bg-[#525252] sticky top-0 z-10 shadow-lg">
              <tr>
                <th className="px-5 py-3 text-[10.5px] font-bold uppercase tracking-widest text-white">Torre</th>
                <th className="px-5 py-3 text-[10.5px] font-bold uppercase tracking-widest text-white">Municipio</th>
                <th className="px-5 py-3 text-[10.5px] font-bold uppercase tracking-widest text-white">Pozo</th>
                <th className="px-5 py-3 text-[10.5px] font-bold uppercase tracking-widest text-white">Intervención</th>
                <th className="px-5 py-3 text-[10.5px] font-bold uppercase tracking-widest text-white">Inicio</th>
                <th className="px-5 py-3 text-[10.5px] font-bold uppercase tracking-widest text-white">Fin</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#ffffff10]">
              {filteredData.map((row: any) => (
                <tr key={row.id} onClick={() => setSelectedId(row.id)}
                  className={`cursor-pointer transition-colors ${selectedId === row.id ? 'bg-[#00809D]' : 'bg-transparent hover:bg-white/5'}`}>
                  <td className="px-5 py-3 text-[12px] font-bold flex items-center gap-3">
                    {selectedId === row.id
                      ? <div className="w-2.5 h-2.5 rounded-full border-[1.5px] border-white shrink-0 bg-transparent"></div>
                      : <div className="w-2.5 h-2.5 rounded-full bg-white shrink-0 shadow-[0_0_8px_rgba(255,255,255,0.4)]"></div>}
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

export default VisualizacionPremiumInterventionsPage;
