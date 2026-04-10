import React, { useState } from 'react';
import { ArrowRight, Search } from 'lucide-react';

const INTERVENTIONS = [
  { tower: 'SKAN-111', muni: 'GUADALUPE', well: 'HALCON-8', start: '01/03/2026', status: 'ONLINE' },
  { tower: 'SKAN-112', muni: 'TUNJA', well: 'SAITAMA 5', start: '01/03/2026', status: 'ONLINE' },
  { tower: 'INDEP-123', muni: 'TAURAMENA', well: 'AZOGUE-1', start: '16/02/2026', status: 'OFFLINE' },
  { tower: 'INDEP-124', muni: 'ORITO', well: 'CARIBE-10', start: '25/03/2026', status: 'ONLINE' },
  { tower: 'BRASERV-147', muni: 'VILLAVICENCIO', well: 'SURIA-58', start: '22/03/2026', status: 'ONLINE' },
  { tower: 'BRASERV-149', muni: 'CASTILLA LA NUEVA', well: 'CASTILLA-347', start: '26/03/2026', status: 'ONLINE' },
  { tower: 'MANSEL-203', muni: 'PUERTO BOYACA', well: 'ABARCO PH2 HZ3', start: '17/03/2026', status: 'OFFLINE' },
  { tower: 'MANSEL-205', muni: 'PALERMO', well: 'SAN FRANCISCO-82', start: '08/03/2026', status: 'OFFLINE' },
  { tower: 'MANSEL-206', muni: 'VILLAVICENCIO', well: 'LIBERTAD 4', start: '03/03/2026', status: 'OFFLINE' },
  { tower: 'INDEP-219', muni: 'ACACIAS', well: 'CASTILLA NORTE 407', start: '08/04/2026', status: 'ONLINE', active: true },
  { tower: 'INDEP-225', muni: 'SABANA DE TORRES', well: 'SUERTE-13', start: '03/04/2026', status: 'ONLINE' },
  { tower: 'BRASERV-882', muni: 'ACACIAS', well: 'CASTILLA NORTE-387', start: '31/03/2026', status: 'ONLINE' },
  { tower: 'BRASERV-883', muni: 'GUAMAL', well: 'ACACIAS 153', start: '10/03/2026', status: 'ONLINE' },
  { tower: 'BRASERV-884', muni: 'CASTILLA LA NUEVA', well: 'CASTILLA-247', start: '14/02/2026', status: 'OFFLINE' },
  { tower: 'BRASERV-885', muni: 'ACACIAS', well: 'CHICHIMENE 23', start: '27/03/2026', status: 'ONLINE' },
  { tower: 'BRASERV-886', muni: 'CASTILLA LA NUEVA', well: 'CHICHIMENE SW-14', start: '17/03/2026', status: 'OFFLINE' },
];

const InterventionsTable: React.FC = () => {
  const [selected, setSelected] = useState<number | null>(9);

  return (
    <div className="max-w-5xl mx-auto">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-xl font-bold tracking-widest uppercase text-white">Intervenciones</h1>
          <p className="text-[10px] text-slate-500 mt-1">Selecciona una intervención y pulsa "Abrir"</p>
        </div>
        <button className="flex items-center gap-2 bg-teal-500/10 hover:bg-teal-500/20 border border-teal-500/30 px-5 py-2.5 rounded-lg transition-all text-teal-300">
          <span className="text-[10px] font-bold uppercase tracking-wide">Abrir Intervención</span>
          <ArrowRight size={14} />
        </button>
      </div>

      <div className="glass-card rounded-xl overflow-hidden">
        <table className="w-full text-left text-[10px]">
          <thead>
            <tr className="border-b border-white/[0.06]">
              {['', 'Torre', 'Municipio', 'Pozo', 'Inicio', 'Estado Conexión'].map((h, i) => (
                <th key={i} className="px-4 py-3 text-[8px] text-slate-500 uppercase font-bold tracking-widest">{h}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {INTERVENTIONS.map((row, i) => (
              <tr 
                key={i} 
                onClick={() => setSelected(i)}
                className={`border-b border-white/[0.03] cursor-pointer transition-colors duration-150
                  ${selected === i ? 'bg-teal-500/10 border-teal-500/20' : 'hover:bg-white/[0.02]'}`}
              >
                <td className="px-4 py-3">
                  <div className={`w-3 h-3 rounded-full border-2 transition-colors ${selected === i ? 'border-teal-400 bg-teal-400' : 'border-slate-600'}`}></div>
                </td>
                <td className="px-4 py-3 font-bold text-white">{row.tower}</td>
                <td className="px-4 py-3 text-slate-400 uppercase">{row.muni}</td>
                <td className="px-4 py-3 text-slate-400 uppercase">{row.well}</td>
                <td className="px-4 py-3 text-slate-500 mono">{row.start}</td>
                <td className="px-4 py-3">
                  <div className="flex items-center gap-2">
                    <div className={`w-2 h-2 rounded-full ${row.status === 'ONLINE' ? 'bg-emerald-500 shadow-[0_0_6px_rgba(34,197,94,0.5)]' : 'bg-red-500 shadow-[0_0_6px_rgba(239,68,68,0.4)]'}`}></div>
                    <span className={`font-semibold ${row.status === 'ONLINE' ? 'text-emerald-400' : 'text-red-400'}`}>{row.status}</span>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default InterventionsTable;
