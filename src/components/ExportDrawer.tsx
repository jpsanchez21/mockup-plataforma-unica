import React, { useState } from 'react';
import { X, FileText, Download, BarChart2 } from 'lucide-react';

interface ExportDrawerProps {
  onClose: () => void;
  isOpen: boolean;
}

const VARIABLE_UNITS: Record<string, string[]> = {
  'Profundidad':           ['ft', 'm'],
  'Posicion Bloque':       ['ft', 'm'],
  'Carga Gancho':          ['Klb', 'lb', 'kg', 'kN'],
  'Velocidad Bloque':      ['ft/min', 'm/min'],
  'Peso Sobre Broca':      ['Klb', 'lb', 'kg', 'kN'],
  'Caudal':                ['bpm', 'gpm', 'lpm', 'm³/min'],
  'Presion Bomba':         ['psi', 'kPa', 'bar'],
  'RPM':                   ['rpm'],
  'Torque':                ['lb·ft', 'kN·m', 'N·m'],
  'Torque Llave Hid. max': ['lb·ft', 'kN·m', 'N·m'],
  'Torque Llave Pot max':  ['lb·ft', 'kN·m', 'N·m'],
  'Strokes por minuto':    ['spm'],
  'Profundidad Pozo':      ['ft', 'm'],
  'Strokes Acumulados':    ['stk'],
  'Barriles Acumulados':   ['bbl', 'm³'],
};

const ALL_VARIABLES = Object.keys(VARIABLE_UNITS);

const IMPERIAL_DEFAULTS: Record<string, string> = {
  'Profundidad': 'ft', 'Posicion Bloque': 'ft', 'Carga Gancho': 'Klb',
  'Velocidad Bloque': 'ft/min', 'Peso Sobre Broca': 'Klb', 'Caudal': 'bpm',
  'Presion Bomba': 'psi', 'RPM': 'rpm', 'Torque': 'lb·ft',
  'Torque Llave Hid. max': 'lb·ft', 'Torque Llave Pot max': 'lb·ft',
  'Strokes por minuto': 'spm', 'Profundidad Pozo': 'ft',
  'Strokes Acumulados': 'stk', 'Barriles Acumulados': 'bbl',
};

const METRIC_DEFAULTS: Record<string, string> = {
  'Profundidad': 'm', 'Posicion Bloque': 'm', 'Carga Gancho': 'kN',
  'Velocidad Bloque': 'm/min', 'Peso Sobre Broca': 'kN', 'Caudal': 'lpm',
  'Presion Bomba': 'kPa', 'RPM': 'rpm', 'Torque': 'kN·m',
  'Torque Llave Hid. max': 'kN·m', 'Torque Llave Pot max': 'kN·m',
  'Strokes por minuto': 'spm', 'Profundidad Pozo': 'm',
  'Strokes Acumulados': 'stk', 'Barriles Acumulados': 'm³',
};

const ExportDrawer: React.FC<ExportDrawerProps> = ({ onClose, isOpen }) => {
  const [activeTab, setActiveTab]   = useState<'csv' | 'pdf'>('csv');
  const [dateOption, setDateOption] = useState<'predeterminadas' | 'personalizadas'>('predeterminadas');
  const [unitSystem, setUnitSystem] = useState<'imperial' | 'metrico' | 'custom'>('imperial');

  const [checked, setChecked]       = useState<Record<string, boolean>>({});
  const [units, setUnits]           = useState<Record<string, string>>(IMPERIAL_DEFAULTS);

  if (!isOpen) return null;

  const allChecked = ALL_VARIABLES.every(v => checked[v]);

  const toggleAll = () => {
    if (allChecked) {
      setChecked({});
    } else {
      const next: Record<string, boolean> = {};
      ALL_VARIABLES.forEach(v => { next[v] = true; });
      setChecked(next);
    }
  };

  const toggleVar = (v: string) => {
    setChecked(prev => ({ ...prev, [v]: !prev[v] }));
  };

  const setUnit = (v: string, u: string) => {
    setUnits(prev => ({ ...prev, [v]: u }));
    setUnitSystem('custom');
  };

  const applySystem = (sys: 'imperial' | 'metrico') => {
    setUnitSystem(sys);
    setUnits(sys === 'imperial' ? IMPERIAL_DEFAULTS : METRIC_DEFAULTS);
  };

  return (
    <div className="absolute top-0 right-0 bottom-0 w-[400px] bg-[#1c1c1e] border-l border-white/20 shadow-[-5px_0_20px_rgba(0,0,0,0.5)] z-[150] flex flex-col font-sans text-white">

      {/* Tab icons */}
      <div className="flex border-b border-[#515151]">
        <button
          className={`w-[60px] h-[50px] flex items-center justify-center border-r border-[#515151] hover:brightness-125 transition-all ${activeTab === 'csv' ? 'bg-[#2a2a2a]' : 'bg-[#1c1c1e]'}`}
          onClick={() => setActiveTab('csv')}
        >
          <BarChart2 size={24} className="opacity-80" />
        </button>
        <button
          className={`w-[60px] h-[50px] flex items-center justify-center border-r border-[#515151] hover:brightness-125 transition-all ${activeTab === 'pdf' ? 'bg-[#2a2a2a]' : 'bg-[#1c1c1e]'}`}
          onClick={() => setActiveTab('pdf')}
        >
          <FileText size={24} className="opacity-80" />
        </button>
      </div>

      <div className="flex-1 overflow-y-auto hidden-scrollbar p-5 flex flex-col gap-5">

        {/* Header */}
        <div className="flex items-center justify-between">
          <h2 className="text-[17px] font-bold">{activeTab === 'csv' ? 'Exportar datos' : 'Exportar PDF'}</h2>
          <button onClick={onClose} className="w-8 h-8 rounded-full bg-white/90 text-black flex items-center justify-center hover:scale-110 transition-transform">
            <X size={18} strokeWidth={3} />
          </button>
        </div>

        {/* Fechas */}
        <div className="flex flex-col gap-3">
          <span className="text-[11px] font-bold text-white/60 uppercase tracking-widest">Rango de fechas</span>
          <div className="flex items-center gap-5">
            <label className="flex items-center gap-2 text-[12px] cursor-pointer">
              <input type="radio" checked={dateOption === 'predeterminadas'} onChange={() => setDateOption('predeterminadas')} className="accent-[#1477D2] w-4 h-4 cursor-pointer" />
              Predeterminadas
            </label>
            <label className="flex items-center gap-2 text-[12px] cursor-pointer">
              <input type="radio" checked={dateOption === 'personalizadas'} onChange={() => setDateOption('personalizadas')} className="accent-white w-4 h-4 cursor-pointer" />
              Personalizadas
            </label>
          </div>
          <div className="grid grid-cols-[60px_1fr] gap-y-1.5 text-[12px] pl-1">
            <span className="font-bold text-white/70">Desde:</span><span>06/04/2026 04:56:52</span>
            <span className="font-bold text-white/70">Hasta:</span><span>06/04/2026 07:00:33</span>
          </div>
        </div>

        <div className="w-full h-px bg-white/10" />

        {activeTab === 'csv' ? (
          <>
            {/* Sistema de unidades */}
            <div className="flex flex-col gap-2">
              <span className="text-[11px] font-bold text-white/60 uppercase tracking-widest">Sistema de unidades</span>
              <div className="flex rounded overflow-hidden border border-[#515151]">
                {(['imperial', 'metrico'] as const).map((sys, i) => (
                  <button
                    key={sys}
                    onClick={() => applySystem(sys)}
                    className={`flex-1 py-2 text-[11px] font-bold uppercase tracking-wider transition-colors ${i === 0 ? 'border-r border-[#515151]' : ''}
                      ${unitSystem === sys ? 'bg-[#1477D2] text-white' : 'bg-[#2a2a2a] text-white/50 hover:text-white/80'}`}
                  >
                    {sys === 'imperial' ? 'Imperial' : 'Métrico'}
                  </button>
                ))}
                <div
                  className={`flex-1 py-2 text-[11px] font-bold uppercase tracking-wider text-center border-l border-[#515151] transition-colors
                    ${unitSystem === 'custom' ? 'bg-[#47CEAC]/20 text-[#47CEAC]' : 'bg-[#2a2a2a] text-white/30'}`}
                >
                  Personalizado
                </div>
              </div>
              <p className="text-[10px] text-white/35 pl-0.5">Aplica unidades a todas las variables. Puedes ajustar individualmente abajo.</p>
            </div>

            <div className="w-full h-px bg-white/10" />

            {/* Variables */}
            <div className="flex flex-col gap-2">
              <span className="text-[11px] font-bold text-white/60 uppercase tracking-widest">Variables a exportar</span>

              {/* Seleccionar todo */}
              <label className="flex items-center gap-2.5 py-1.5 px-2 rounded cursor-pointer hover:bg-white/5 transition-colors border-b border-white/8">
                <input
                  type="checkbox"
                  checked={allChecked}
                  onChange={toggleAll}
                  className="w-[14px] h-[14px] accent-[#1477D2] shrink-0 cursor-pointer"
                />
                <span className="text-[11px] font-bold text-white/80 uppercase tracking-wider">Seleccionar todo</span>
              </label>

              {/* Filas de variables */}
              <div className="flex flex-col">
                {ALL_VARIABLES.map(variable => {
                  const isChecked = !!checked[variable];
                  const availableUnits = VARIABLE_UNITS[variable];
                  const selectedUnit = units[variable] || availableUnits[0];
                  const hasMultipleUnits = availableUnits.length > 1;

                  return (
                    <div
                      key={variable}
                      className={`flex items-center gap-2.5 py-2 px-2 border-b border-white/5 transition-colors ${isChecked ? 'bg-white/[0.04]' : 'hover:bg-white/[0.02]'}`}
                    >
                      <input
                        type="checkbox"
                        checked={isChecked}
                        onChange={() => toggleVar(variable)}
                        className="w-[14px] h-[14px] accent-[#1477D2] shrink-0 cursor-pointer"
                      />
                      <span className={`text-[11px] flex-1 transition-colors ${isChecked ? 'text-white font-bold' : 'text-white/50'}`}>
                        {variable}
                      </span>

                      {/* Unit pills — solo si está marcada y tiene opciones */}
                      {isChecked && hasMultipleUnits && (
                        <div className="flex items-center gap-0.5 shrink-0">
                          {availableUnits.map(u => (
                            <button
                              key={u}
                              onClick={() => setUnit(variable, u)}
                              className={`px-2 py-0.5 text-[9px] font-bold uppercase rounded transition-colors ${
                                selectedUnit === u
                                  ? 'bg-[#1477D2] text-white'
                                  : 'bg-white/10 text-white/50 hover:bg-white/20 hover:text-white'
                              }`}
                            >
                              {u}
                            </button>
                          ))}
                        </div>
                      )}

                      {/* Si solo hay una unidad, la muestra como etiqueta fija */}
                      {isChecked && !hasMultipleUnits && (
                        <span className="text-[9px] font-bold text-white/30 uppercase shrink-0">{availableUnits[0]}</span>
                      )}
                    </div>
                  );
                })}
              </div>

              <p className="text-[#db4437] font-bold text-[11px] mt-1">* Seleccione las variables que desea exportar</p>
            </div>

            <div className="w-full h-px bg-white/10" />

            <div className="flex justify-end pb-4">
              <button className="flex items-center gap-3 bg-[#515151] hover:brightness-110 transition-all font-bold text-[13px] px-6 py-2 rounded-sm">
                Exportar
                <div className="w-5 h-6 border-2 border-white rounded-[2px] flex items-center justify-center bg-[#3e3e42]">
                  <Download size={12} className="text-white" />
                </div>
              </button>
            </div>

            <h2 className="text-[15px] font-bold">Archivos descargados</h2>
          </>
        ) : (
          // PDF tab
          <div className="flex flex-col gap-4">
            <div className="grid grid-cols-[130px_1fr] gap-4 items-center">
              <span className="font-bold text-[13px]">Incluir Notas:</span>
              <input type="checkbox" className="w-[16px] h-[16px] accent-white bg-white cursor-pointer rounded-none border border-gray-400" />

              <span className="font-bold text-[13px]">Escala:</span>
              <select className="bg-[#1c1c1e] border border-white/30 text-[13px] px-2 py-1.5 rounded-sm focus:outline-none cursor-pointer w-full">
                <option>1h</option><option>2h</option><option>4h</option>
              </select>

              <span className="font-bold text-[13px] leading-tight pr-4">Número de Tracks:</span>
              <select className="bg-[#1c1c1e] border border-white/30 text-[13px] px-2 py-1.5 rounded-sm focus:outline-none cursor-pointer w-full">
                <option>1</option><option>2</option><option>3</option><option>4</option>
              </select>

              <span className="font-bold text-[13px]">Track 1:</span>
              <select className="bg-[#1c1c1e] border border-white/30 text-[13px] px-2 py-1.5 rounded-sm focus:outline-none cursor-pointer w-full text-white/80">
                <option>Seleccionar variables</option>
              </select>
            </div>

            <div className="flex justify-center">
              <span className="text-[#db4437] font-bold text-[12px]">* Seleccione entre 1 y 3 variables por track</span>
            </div>

            <div className="w-full h-px bg-white/10" />

            <div className="flex justify-end">
              <button className="flex items-center gap-3 bg-[#515151] hover:brightness-110 transition-all font-bold text-[13px] px-6 py-2 rounded-sm">
                Generar
                <div className="w-5 h-6 border-2 border-white rounded-[2px] flex items-center justify-center bg-[#3e3e42]">
                  <FileText size={12} className="text-white" />
                </div>
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default ExportDrawer;
