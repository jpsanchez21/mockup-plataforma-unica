import React, { useState, useRef, useEffect } from 'react';
import { X, Send, Minimize2, Zap, ChevronDown } from 'lucide-react';

/* ── Avatar ── */
const SkaiAvatar: React.FC<{ size?: number }> = ({ size = 40 }) => (
  <div style={{
    width: size, height: size, borderRadius: '50%', flexShrink: 0,
    background: 'linear-gradient(135deg, #38bdf8 0%, #1d4ed8 100%)',
    display: 'flex', alignItems: 'center', justifyContent: 'center',
    boxShadow: '0 2px 10px rgba(56,189,248,0.4)',
  }}>
    <Zap size={size * 0.45} color="white" fill="white" />
  </div>
);

/* ── Types ── */
interface Message {
  id: number;
  role: 'talon' | 'user';
  text: string;
  ts: string;
}

/* ── Data ── */
const INITIAL_MESSAGES: Message[] = [{
  id: 1, role: 'talon', ts: 'Ahora',
  text: 'Hola, soy **SKAI**, el asistente de inteligencia operacional de SkanHawk. Estoy conectado a los datos en tiempo real de esta intervención. ¿En qué puedo ayudarte?',
}];

const QUICK_ACTIONS = [
  { label: 'Estado del pozo',     icon: '🛢️' },
  { label: 'Anomalías detectadas',icon: '⚠️' },
  { label: 'Resumen operacional', icon: '📋' },
  { label: 'Exportar reporte',    icon: '📤' },
];

const CANNED_RESPONSES: Record<string, string> = {
  'Estado del pozo':
    'El pozo **CASTILLA NORTE-407** opera con normalidad. Profundidad actual: **1,842 ft**. Presión de bomba estable en **1,230 psi**. Sin alertas activas en este momento.',
  'Anomalías detectadas':
    'He analizado los últimos 30 minutos de datos. Se detectó una variación en la velocidad del bloque a las **13:42** fuera del rango esperado. Recomiendo revisar el gráfico de velocidad con carga.',
  'Resumen operacional':
    'Intervención **WORKOVER** en curso. Torre **INDEP-219**. Tiempo activo: 17 días 16 horas. Juntas completadas hoy: **12.5 j/h**. Torque promedio últimas 2h: **11,200 lb-ft**. Sin incidentes de seguridad.',
  'Exportar reporte':
    'Puedo generar un reporte en **CSV** o **PDF**. Para iniciar, usa el botón de impresora en la vista de Exploración Histórica, o dime qué rango de fechas necesitas.',
};

const DEFAULT_RESPONSE = 'Entendido. Estoy analizando los datos de la intervención activa. Dame un momento para procesar tu solicitud con los sensores en tiempo real.';

/* ── Helpers ── */
const formatText = (text: string) =>
  text.split(/\*\*(.*?)\*\*/g).map((part, i) =>
    i % 2 === 1
      ? <strong key={i} style={{ color: '#38bdf8', fontWeight: 700 }}>{part}</strong>
      : <span key={i}>{part}</span>
  );

const now = () => new Date().toLocaleTimeString('es-ES', { hour: '2-digit', minute: '2-digit' });

/* ══════════════════════════════════════════════════════════════════
   COMPONENT
══════════════════════════════════════════════════════════════════ */
const TalonChat: React.FC<{ bottomOffset?: number }> = ({ bottomOffset = 20 }) => {
  const [isOpen,      setIsOpen]      = useState(false);
  const [isMinimized, setIsMinimized] = useState(false);
  const [messages,    setMessages]    = useState<Message[]>(INITIAL_MESSAGES);
  const [input,       setInput]       = useState('');
  const [isTyping,    setIsTyping]    = useState(false);
  const [hasUnread,   setHasUnread]   = useState(false);
  const [showQuick,   setShowQuick]   = useState(true);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef       = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (isOpen && !isMinimized) {
      messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
      setTimeout(() => inputRef.current?.focus(), 100);
      setHasUnread(false);
    }
  }, [messages, isOpen, isMinimized]);

  const sendMessage = (text: string) => {
    if (!text.trim()) return;
    setShowQuick(false);
    const userMsg: Message = { id: Date.now(), role: 'user', text: text.trim(), ts: now() };
    setMessages(p => [...p, userMsg]);
    setInput('');
    setIsTyping(true);

    setTimeout(() => {
      const reply = CANNED_RESPONSES[text.trim()] ?? DEFAULT_RESPONSE;
      setMessages(p => [...p, { id: Date.now() + 1, role: 'talon', text: reply, ts: now() }]);
      setIsTyping(false);
      if (isMinimized) setHasUnread(true);
    }, 1400 + Math.random() * 600);
  };

  const handleOpen = () => { setIsOpen(true); setIsMinimized(false); setHasUnread(false); };

  /* ── Styles ── */
  const PANEL_BG   = '#0d1117';
  const HEADER_BG  = '#161b27';
  const INPUT_BG   = '#161b27';
  const BOT_MSG_BG = '#1c2333';
  const BORDER     = 'rgba(56,189,248,0.22)';
  const ACCENT     = '#38bdf8';

  return (
    <>
      <style>{`
        @keyframes skaiFloat {
          0%,100% { transform:translateY(0); box-shadow:0 8px 32px rgba(2,132,199,.5),0 4px 16px rgba(0,0,0,.4); }
          50%      { transform:translateY(-7px); box-shadow:0 16px 42px rgba(2,132,199,.6),0 6px 20px rgba(0,0,0,.45); }
        }
        @keyframes skaiSlide {
          from { opacity:0; transform:translateY(18px) scale(.97); }
          to   { opacity:1; transform:translateY(0) scale(1); }
        }
        @keyframes skaiDot {
          0%,80%,100% { transform:scale(.5); opacity:.35; }
          40%          { transform:scale(1);  opacity:1; }
        }
        @keyframes skaiBadge {
          0%,100% { transform:scale(1); }
          50%      { transform:scale(1.25); }
        }
        @keyframes skaiLabelIn {
          from { opacity:0; transform:translateX(8px); }
          to   { opacity:1; transform:translateX(0); }
        }
        @keyframes skaiMsgIn {
          from { opacity:0; transform:translateY(6px); }
          to   { opacity:1; transform:translateY(0); }
        }
        .skai-scrollbar::-webkit-scrollbar { width:4px; }
        .skai-scrollbar::-webkit-scrollbar-track { background:transparent; }
        .skai-scrollbar::-webkit-scrollbar-thumb { background:rgba(56,189,248,.2); border-radius:4px; }
        .skai-scrollbar::-webkit-scrollbar-thumb:hover { background:rgba(56,189,248,.4); }
        .skai-input::placeholder { color:rgba(255,255,255,.25); }
        .skai-input:focus { outline:none; }
        .skai-qa:hover { background:rgba(56,189,248,.14) !important; transform:translateY(-1px); }
      `}</style>

      {/* ══ CHAT PANEL ══ */}
      {isOpen && (
        <div
          className="fixed right-5 z-[99999] flex flex-col select-none"
          style={{
            bottom: `${bottomOffset + 78}px`,
            width: '390px',
            height: isMinimized ? '64px' : '560px',
            background: PANEL_BG,
            border: `1px solid ${BORDER}`,
            borderRadius: '20px',
            boxShadow: `0 28px 70px rgba(0,0,0,.85), 0 0 0 1px rgba(56,189,248,.06), 0 0 60px rgba(56,189,248,.04)`,
            overflow: 'hidden',
            transition: 'height .3s cubic-bezier(.4,0,.2,1)',
            animation: 'skaiSlide .28s cubic-bezier(.2,0,0,1)',
          }}
        >
          {/* ── Header ── */}
          <div
            className="shrink-0 flex items-center gap-3 px-4 cursor-pointer"
            style={{
              height: '64px',
              background: HEADER_BG,
              borderBottom: isMinimized ? 'none' : `1px solid rgba(56,189,248,.1)`,
            }}
            onClick={() => isMinimized && setIsMinimized(false)}
          >
            {/* Avatar + online dot */}
            <div className="relative shrink-0">
              <SkaiAvatar size={38} />
              <div style={{
                position: 'absolute', bottom: 0, right: 0,
                width: 11, height: 11, borderRadius: '50%',
                background: '#22c55e', border: `2px solid ${HEADER_BG}`,
              }} />
            </div>

            {/* Info */}
            <div className="flex flex-col flex-1 min-w-0">
              <div className="flex items-center gap-2">
                <span style={{ fontSize: 13, fontWeight: 800, color: 'white', letterSpacing: '.06em' }}>SKAI</span>
                <span style={{
                  fontSize: 8, fontWeight: 700, padding: '2px 6px', borderRadius: 20,
                  background: 'rgba(56,189,248,.12)', color: ACCENT,
                  border: `1px solid rgba(56,189,248,.25)`, letterSpacing: '.1em', textTransform: 'uppercase'
                }}>SKH · AI</span>
              </div>
              <span style={{ fontSize: 10, color: isTyping ? ACCENT : 'rgba(255,255,255,.4)', fontWeight: 600, letterSpacing: '.05em', transition: 'color .3s' }}>
                {isTyping ? '✦ Analizando datos...' : '● Asistente Operacional · En línea'}
              </span>
            </div>

            {/* Controls */}
            <div className="flex items-center gap-1">
              <button
                onClick={e => { e.stopPropagation(); setIsMinimized(v => !v); }}
                style={{ width: 30, height: 30, borderRadius: 8, display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'rgba(255,255,255,.35)', transition: 'all .15s' }}
                onMouseEnter={e => (e.currentTarget.style.color = 'white')}
                onMouseLeave={e => (e.currentTarget.style.color = 'rgba(255,255,255,.35)')}
              >
                {isMinimized ? <ChevronDown size={15} /> : <Minimize2 size={14} />}
              </button>
              <button
                onClick={e => { e.stopPropagation(); setIsOpen(false); }}
                style={{ width: 30, height: 30, borderRadius: 8, display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'rgba(255,255,255,.35)', transition: 'all .15s' }}
                onMouseEnter={e => (e.currentTarget.style.color = 'white')}
                onMouseLeave={e => (e.currentTarget.style.color = 'rgba(255,255,255,.35)')}
              >
                <X size={15} />
              </button>
            </div>
          </div>

          {!isMinimized && (
            <>
              {/* ── Messages ── */}
              <div className="flex-1 overflow-y-auto px-4 py-4 flex flex-col gap-3 skai-scrollbar" style={{ background: PANEL_BG }}>
                {messages.map((msg, idx) => (
                  <div
                    key={msg.id}
                    style={{ display: 'flex', gap: 8, flexDirection: msg.role === 'user' ? 'row-reverse' : 'row', animation: 'skaiMsgIn .22s ease-out' }}
                  >
                    {msg.role === 'talon' && <SkaiAvatar size={26} />}

                    <div style={{ display: 'flex', flexDirection: 'column', alignItems: msg.role === 'user' ? 'flex-end' : 'flex-start', maxWidth: '78%', gap: 4 }}>
                      <div style={{
                        padding: '10px 13px',
                        fontSize: 12.5,
                        lineHeight: 1.55,
                        borderRadius: msg.role === 'talon' ? '4px 16px 16px 16px' : '16px 4px 16px 16px',
                        background: msg.role === 'talon'
                          ? BOT_MSG_BG
                          : 'linear-gradient(135deg, #1477D2, #0d5aad)',
                        color: msg.role === 'talon' ? 'rgba(255,255,255,.85)' : 'white',
                        border: msg.role === 'talon' ? `1px solid rgba(56,189,248,.1)` : 'none',
                        boxShadow: msg.role === 'user' ? '0 2px 12px rgba(20,119,210,.35)' : 'none',
                      }}>
                        {formatText(msg.text)}
                      </div>
                      <span style={{ fontSize: 9, color: 'rgba(255,255,255,.2)', paddingInline: 3 }}>{msg.ts}</span>
                    </div>
                  </div>
                ))}

                {/* Typing indicator */}
                {isTyping && (
                  <div style={{ display: 'flex', gap: 8, animation: 'skaiMsgIn .2s ease-out' }}>
                    <SkaiAvatar size={26} />
                    <div style={{
                      display: 'flex', alignItems: 'center', gap: 5,
                      padding: '10px 14px', borderRadius: '4px 16px 16px 16px',
                      background: BOT_MSG_BG, border: `1px solid rgba(56,189,248,.1)`,
                    }}>
                      {[0, .18, .36].map((d, i) => (
                        <div key={i} style={{
                          width: 6, height: 6, borderRadius: '50%', background: ACCENT,
                          animation: `skaiDot 1.2s ${d}s infinite`,
                        }} />
                      ))}
                    </div>
                  </div>
                )}

                <div ref={messagesEndRef} />
              </div>

              {/* ── Quick Actions ── */}
              {showQuick && messages.length <= 2 && !isTyping && (
                <div style={{ padding: '0 14px 12px', display: 'flex', flexWrap: 'wrap', gap: 6, background: PANEL_BG }}>
                  <div style={{ width: '100%', fontSize: 9, color: 'rgba(255,255,255,.3)', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '.1em', marginBottom: 2 }}>
                    Acciones rápidas
                  </div>
                  {QUICK_ACTIONS.map(qa => (
                    <button
                      key={qa.label}
                      className="skai-qa"
                      onClick={() => sendMessage(qa.label)}
                      style={{
                        display: 'flex', alignItems: 'center', gap: 5,
                        padding: '6px 11px', borderRadius: 20, cursor: 'pointer',
                        background: 'rgba(56,189,248,.07)',
                        border: `1px solid rgba(56,189,248,.2)`,
                        color: ACCENT, fontSize: 10.5, fontWeight: 700,
                        transition: 'all .18s', outline: 'none',
                      }}
                    >
                      <span>{qa.icon}</span>
                      {qa.label}
                    </button>
                  ))}
                </div>
              )}

              {/* ── Divider ── */}
              <div style={{ height: 1, background: 'rgba(255,255,255,.05)', margin: '0 16px' }} />

              {/* ── Input ── */}
              <div style={{ padding: '12px 14px', background: INPUT_BG, display: 'flex', alignItems: 'center', gap: 8 }}>
                <input
                  ref={inputRef}
                  className="skai-input"
                  value={input}
                  onChange={e => setInput(e.target.value)}
                  onKeyDown={e => { if (e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); sendMessage(input); } }}
                  placeholder="Pregunta a SKAI..."
                  disabled={isTyping}
                  style={{
                    flex: 1, background: 'rgba(255,255,255,.05)', color: 'white',
                    fontSize: 12.5, padding: '9px 14px', borderRadius: 12,
                    border: `1px solid rgba(255,255,255,.08)`, transition: 'border .2s',
                  }}
                  onFocus={e => (e.target.style.border = `1px solid rgba(56,189,248,.35)`)}
                  onBlur={e => (e.target.style.border = `1px solid rgba(255,255,255,.08)`)}
                />
                <button
                  onClick={() => sendMessage(input)}
                  disabled={!input.trim() || isTyping}
                  style={{
                    width: 36, height: 36, borderRadius: 10, flexShrink: 0,
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                    background: input.trim() && !isTyping
                      ? 'linear-gradient(135deg, #38bdf8, #0284c7)'
                      : 'rgba(255,255,255,.07)',
                    opacity: input.trim() && !isTyping ? 1 : 0.45,
                    cursor: input.trim() && !isTyping ? 'pointer' : 'not-allowed',
                    transition: 'all .2s',
                    border: 'none',
                  }}
                >
                  <Send size={14} color="white" />
                </button>
              </div>

              {/* ── Footer ── */}
              <div style={{ textAlign: 'center', padding: '4px 0 10px', background: INPUT_BG }}>
                <span style={{ fontSize: 8.5, color: 'rgba(255,255,255,.15)', fontWeight: 700, letterSpacing: '.12em', textTransform: 'uppercase' }}>
                  SKAI by SkanHawk · Powered by SkanHawk AI
                </span>
              </div>
            </>
          )}
        </div>
      )}

      {/* ══ FLOATING LAUNCHER ══ */}
      <div
        className="fixed z-[99999] flex items-center gap-3"
        style={{ bottom: `${bottomOffset}px`, right: '20px' }}
      >
        {/* Label — only when closed */}
        {!isOpen && (
          <div
            style={{ animation: 'skaiLabelIn .3s ease-out', pointerEvents: 'none', textAlign: 'right', lineHeight: 1.2 }}
          >
            <div style={{ fontSize: 11, fontWeight: 900, color: 'white', letterSpacing: '.12em', textShadow: '0 1px 8px rgba(0,0,0,.8)' }}>SKAI</div>
            <div style={{ fontSize: 9, fontWeight: 600, color: `rgba(56,189,248,.85)`, letterSpacing: '.06em', textShadow: '0 1px 4px rgba(0,0,0,.7)' }}>Asistente IA</div>
          </div>
        )}

        {/* Button */}
        <button
          onClick={isOpen ? () => setIsOpen(false) : handleOpen}
          style={{
            width: 60, height: 60, borderRadius: '50%', flexShrink: 0,
            background: isOpen
              ? '#1a2035'
              : 'linear-gradient(145deg, #38bdf8 0%, #0ea5e9 45%, #0284c7 100%)',
            border: isOpen ? `1.5px solid rgba(56,189,248,.4)` : `2px solid rgba(255,255,255,.18)`,
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            cursor: 'pointer', position: 'relative',
            animation: !isOpen ? 'skaiFloat 3.5s ease-in-out infinite' : 'none',
            boxShadow: isOpen ? '0 4px 20px rgba(0,0,0,.5)' : undefined,
            transition: 'background .25s, border .25s',
          }}
          onMouseEnter={e => { (e.currentTarget as HTMLElement).style.transform = 'scale(1.1)'; }}
          onMouseLeave={e => { (e.currentTarget as HTMLElement).style.transform = 'scale(1)'; }}
        >
          {isOpen
            ? <X size={20} color={ACCENT} />
            : <SkaiAvatar size={54} />
          }

          {/* Unread badge */}
          {hasUnread && (
            <div style={{
              position: 'absolute', top: -3, right: -3,
              width: 18, height: 18, borderRadius: '50%',
              background: '#ef4444', color: 'white',
              fontSize: 9, fontWeight: 900,
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              animation: 'skaiBadge 1s ease-in-out infinite',
              boxShadow: '0 2px 8px rgba(239,68,68,.65)',
            }}>1</div>
          )}
        </button>
      </div>
    </>
  );
};

export default TalonChat;
