import React, { useState, useRef, useEffect } from 'react';
import { User, LogOut, Globe, Moon, Sun, Bell, BellOff, Building2 } from 'lucide-react';

interface UserDropdownProps {
  userName?: string;
  company?: string;
  onLogout: () => void;
  showNameInline?: boolean;
}

const Segment = ({
  options,
  value,
  onChange,
}: {
  options: { value: string; label: string }[];
  value: string;
  onChange: (v: string) => void;
}) => (
  <div
    className="flex rounded-lg overflow-hidden shrink-0"
    style={{ background: 'rgba(0,0,0,0.35)', border: '1px solid rgba(255,255,255,0.1)' }}
  >
    {options.map((opt, i) => (
      <button
        key={opt.value}
        onClick={() => onChange(opt.value)}
        className={`px-2.5 py-[5px] text-[9.5px] font-black tracking-wide transition-all leading-none ${
          i < options.length - 1 ? 'border-r border-white/10' : ''
        } ${
          value === opt.value
            ? 'bg-white text-[#111] shadow-sm'
            : 'text-white/35 hover:text-white/70'
        }`}
      >
        {opt.label}
      </button>
    ))}
  </div>
);

const UserDropdown: React.FC<UserDropdownProps> = ({
  userName = 'Juan P. Sánchez',
  company = 'SKANHAWK',
  onLogout,
  showNameInline = false,
}) => {
  const [open, setOpen] = useState(false);
  const [lang, setLang] = useState<string>(
    localStorage.getItem('skh_lang') || 'es'
  );
  const [theme, setTheme] = useState<string>(
    localStorage.getItem('skh_theme') || 'dark'
  );
  const [alarmsOn, setAlarmsOn] = useState(
    localStorage.getItem('skh_alarms') !== 'off'
  );

  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClick = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false);
    };
    document.addEventListener('mousedown', handleClick);
    return () => document.removeEventListener('mousedown', handleClick);
  }, []);

  const setLangPersist = (v: string) => { setLang(v); localStorage.setItem('skh_lang', v); };
  const setThemePersist = (v: string) => { setTheme(v); localStorage.setItem('skh_theme', v); };
  const toggleAlarms = () => {
    const next = !alarmsOn;
    setAlarmsOn(next);
    localStorage.setItem('skh_alarms', next ? 'on' : 'off');
  };

  const initials = userName
    .split(' ')
    .filter(Boolean)
    .map(n => n[0])
    .join('')
    .slice(0, 2)
    .toUpperCase();

  return (
    <div ref={ref} className="relative flex items-center">
      {/* ── Trigger ── */}
      <button
        onClick={() => setOpen(o => !o)}
        title="Perfil de usuario"
        className={`flex items-center gap-2.5 transition-all duration-200 select-none rounded-xl ${
          showNameInline ? 'px-2 py-1 hover:bg-white/[0.06]' : ''
        } ${open && showNameInline ? 'bg-white/[0.08]' : ''}`}
      >
        {showNameInline && (
          <div className="flex flex-col items-end leading-none">
            <span className="text-[11px] font-bold text-white uppercase tracking-wide">{userName}</span>
            <span className="text-[9px] font-bold text-white/40 uppercase tracking-wider mt-[2px]">{company}</span>
          </div>
        )}
        <div
          className={`w-[30px] h-[30px] rounded-full flex items-center justify-center font-black text-[11px] text-white shrink-0 ${
            open
              ? 'ring-2 ring-[#2dd4bf]/80 ring-offset-[2px] ring-offset-[#1B1B1E]'
              : 'border border-white/50 hover:border-white/90'
          }`}
          style={{ background: 'linear-gradient(135deg, #1477D2 0%, #0e9b8a 100%)' }}
        >
          {initials || <User size={14} />}
        </div>
      </button>

      {/* ── Dropdown ── */}
      {open && (
        <div
          className="absolute top-[42px] right-0 w-[248px] z-[9999] rounded-2xl overflow-hidden select-none"
          style={{
            background: 'linear-gradient(180deg, #2e2e42 0%, #252538 100%)',
            border: '1px solid rgba(255,255,255,0.18)',
            boxShadow: '0 20px 60px rgba(0,0,0,0.85), 0 4px 16px rgba(0,0,0,0.6), inset 0 1px 0 rgba(255,255,255,0.08)',
          }}
        >
          {/* ── User header ── */}
          <div
            className="flex items-center gap-3 px-4 pt-4 pb-3.5"
            style={{ borderBottom: '1px solid rgba(255,255,255,0.15)' }}
          >
            <div
              className="w-11 h-11 rounded-full flex items-center justify-center shrink-0 font-black text-[15px] text-white shadow-xl"
              style={{
                background: 'linear-gradient(135deg, #1477D2 0%, #0e9b8a 100%)',
                boxShadow: '0 0 18px rgba(20,119,210,0.35)',
              }}
            >
              {initials || <User size={18} />}
            </div>
            <div className="flex flex-col min-w-0 flex-1">
              <span className="text-[13px] font-black text-white leading-tight truncate">
                {userName}
              </span>
              <div className="flex items-center gap-1.5 mt-[4px]">
                <Building2 size={9} className="text-white/35 shrink-0" />
                <span className="text-[9.5px] font-bold tracking-[0.15em] text-white/50 uppercase">
                  {company}
                </span>
              </div>
            </div>
          </div>

          {/* ── Preferences ── */}
          <div className="px-3 pt-3 pb-1">
            <span className="text-[8px] font-black text-white/20 uppercase tracking-[0.22em] px-1">
              Preferencias
            </span>

            <div className="flex flex-col gap-px mt-2">

              {/* Language */}
              <div className="flex items-center justify-between px-2 py-[7px] rounded-xl hover:bg-white/[0.08] transition-colors">
                <div className="flex items-center gap-2.5">
                  <Globe size={13} className="text-white/35 shrink-0" />
                  <span className="text-[11px] font-semibold text-white/60">Idioma</span>
                </div>
                <Segment
                  value={lang}
                  onChange={setLangPersist}
                  options={[
                    { value: 'es', label: 'Español' },
                    { value: 'en', label: 'English' },
                  ]}
                />
              </div>

              {/* Theme */}
              <div className="flex items-center justify-between px-2 py-[7px] rounded-xl hover:bg-white/[0.08] transition-colors">
                <div className="flex items-center gap-2.5">
                  {theme === 'dark'
                    ? <Moon size={13} className="text-white/35 shrink-0" />
                    : <Sun size={13} className="text-white/35 shrink-0" />}
                  <span className="text-[11px] font-semibold text-white/60">Tema</span>
                </div>
                <Segment
                  value={theme}
                  onChange={setThemePersist}
                  options={[
                    { value: 'dark', label: '🌑 Oscuro' },
                    { value: 'light', label: '☀️ Claro' },
                  ]}
                />
              </div>

              {/* Alarms */}
              <div className="flex items-center justify-between px-2 py-[7px] rounded-xl hover:bg-white/[0.08] transition-colors">
                <div className="flex items-center gap-2.5">
                  {alarmsOn
                    ? <Bell size={13} className="text-white/35 shrink-0" />
                    : <BellOff size={13} className="text-white/35 shrink-0" />}
                  <div className="flex flex-col">
                    <span className="text-[11px] font-semibold text-white/60 leading-tight">
                      Alarmas
                    </span>
                    <span className="text-[8.5px] text-white/22 leading-tight">
                      {alarmsOn ? 'Activadas' : 'Silenciadas'}
                    </span>
                  </div>
                </div>
                <button
                  onClick={toggleAlarms}
                  className="relative w-[40px] h-[22px] rounded-full transition-all duration-300 shrink-0"
                  style={{
                    background: alarmsOn
                      ? 'linear-gradient(90deg, #0e9b8a, #2dd4bf)'
                      : 'rgba(255,255,255,0.1)',
                    border: `1px solid ${alarmsOn ? '#2dd4bf' : 'rgba(255,255,255,0.15)'}`,
                    boxShadow: alarmsOn ? '0 0 12px rgba(45,212,191,0.4)' : 'none',
                  }}
                >
                  <div
                    className="absolute top-[2px] w-[16px] h-[16px] rounded-full bg-white shadow-md transition-all duration-300"
                    style={{ left: alarmsOn ? '21px' : '2px' }}
                  />
                </button>
              </div>

            </div>
          </div>

          {/* ── Divider ── */}
          <div className="mx-4 my-1" style={{ height: '1px', background: 'rgba(255,255,255,0.15)' }} />

          {/* ── Logout ── */}
          <div className="px-3 pb-3">
            <button
              onClick={() => { setOpen(false); onLogout(); }}
              className="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl transition-all duration-200 group"
              style={{
                border: '1px solid rgba(239,68,68,0)',
                background: 'transparent',
              }}
              onMouseEnter={e => {
                (e.currentTarget as HTMLElement).style.background = 'rgba(239,68,68,0.1)';
                (e.currentTarget as HTMLElement).style.borderColor = 'rgba(239,68,68,0.22)';
              }}
              onMouseLeave={e => {
                (e.currentTarget as HTMLElement).style.background = 'transparent';
                (e.currentTarget as HTMLElement).style.borderColor = 'rgba(239,68,68,0)';
              }}
            >
              <div
                className="w-7 h-7 rounded-lg flex items-center justify-center shrink-0"
                style={{
                  background: 'rgba(239,68,68,0.1)',
                  border: '1px solid rgba(239,68,68,0.18)',
                }}
              >
                <LogOut size={13} className="text-red-400" />
              </div>
              <div className="flex flex-col items-start">
                <span className="text-[11px] font-bold text-red-400/75 group-hover:text-red-400 transition-colors leading-tight">
                  Cerrar Sesión
                </span>
                <span className="text-[8.5px] text-white/20 leading-tight">
                  Volver al inicio de sesión
                </span>
              </div>
            </button>
          </div>

        </div>
      )}
    </div>
  );
};

export default UserDropdown;
