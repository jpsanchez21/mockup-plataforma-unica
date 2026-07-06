import React, { useState } from 'react';
import ReactDOM from 'react-dom';
import { Bell, Settings, Activity, Monitor, Eye, Shield, Wrench, Lock, ArrowRight, Zap, PieChart, FileText, AlertTriangle, Grid, Menu, Sparkles, X, Users, Camera, Cpu, MapPin, BarChart2, Layers, CheckCircle, Truck, Radio } from 'lucide-react';
import TalonChat from './TalonChat';
import UserDropdown from './UserDropdown';
import SkanMonitorDashboard from './SkanMonitorDashboard';

interface AppModule {
  id: string;
  name: string;
  tagline: string;
  longDescription: string;
  icon: React.ElementType;
  isInternalOnly: boolean;
  enabledForExternal: boolean;
  color: string;
  isSessionActive?: boolean;
}

const modules: AppModule[] = [
  { id: 'vizpremium', name: 'Visualización Premium', tagline: 'Análisis Operacional Completo', longDescription: 'El módulo más completo de visualización. Layout centrado en el gráfico de profundidad con analíticas operacionales a ambos lados, tiles editables, clima, hook load, tanques y gases.', icon: Grid, isInternalOnly: false, enabledForExternal: true, color: 'from-[#06B6D4] to-[#7C3AED]', isSessionActive: false },
  { id: 'vizmedium', name: 'Visualización Medium', tagline: 'Visualización Intermedia', longDescription: 'Módulo de visualización con las métricas operativas más relevantes. Balance ideal entre profundidad de datos y simplicidad de uso.', icon: Activity, isInternalOnly: false, enabledForExternal: true, color: 'from-[#F59E0B] to-[#8B5CF6]', isSessionActive: false },
  { id: 'vizbasic', name: 'Visualización Basic', tagline: 'Visualización Esencial', longDescription: 'Módulo de visualización básico con las métricas operativas esenciales. Ideal para monitoreo estándar de intervenciones en pozo.', icon: Activity, isInternalOnly: false, enabledForExternal: true, color: 'from-[#10B981] to-[#0A4A60]', isSessionActive: false },
  { id: 'skanview', name: 'SkanView', tagline: 'Métricas e Intervenciones', longDescription: 'SkanView es tu ecosistema de monitoreo en tiempo real. Obtén acceso inmediato a las métricas operativas por pozo y registro de actividades.', icon: Activity, isInternalOnly: false, enabledForExternal: true, color: 'from-[#00d0c3] to-[#0A4A60]', isSessionActive: false },
  { id: 'pruebaA', name: 'Prueba A — Resize Libre', tagline: 'Dashboard Modular con Resize', longDescription: 'Prototipo experimental: paneles arrastrables. Jalá el borde entre paneles para hacer más grande o más pequeño cualquier visualización. Mínimo garantizado para que los datos siempre sean legibles.', icon: Grid, isInternalOnly: false, enabledForExternal: true, color: 'from-[#00d0c3] to-[#0891b2]', isSessionActive: false },
  { id: 'pruebaB', name: 'Prueba B — Slots Intercambiables', tagline: 'Dashboard con Catálogo de Paneles', longDescription: 'Prototipo experimental: slots fijos con contenido intercambiable. Haz clic en el ícono de cada panel para reemplazarlo con cualquier visualización del catálogo, u ocúltalo para reorganizar el layout.', icon: Layers, isInternalOnly: false, enabledForExternal: true, color: 'from-[#8b5cf6] to-[#6d28d9]', isSessionActive: false },
  { id: 'skanadmin', name: 'SkanAdmin', tagline: 'Panel de Control Maestro', longDescription: 'Control absoluto sobre accesos corporativos. Crea roles, delega permisos e interpola sub-contratistas.', icon: Shield, isInternalOnly: true, enabledForExternal: false, color: 'from-[#EF4444] to-[#B91C1C]' },
  { id: 'analitica', name: 'Analítica', tagline: 'Visualización de Datos Clave', longDescription: 'Centraliza todas las hojas de cálculo operativas en tableros dinámicos. Crea reportes instantáneos.', icon: PieChart, isInternalOnly: false, enabledForExternal: true, color: 'from-[#EC4899] to-[#BE185D]' },
  { id: 'skanmonitor', name: 'SkanMonitor', tagline: 'Trazabilidad de Equipos', longDescription: 'SkanMonitor utiliza sensores IoT en la locación para predecir fallas y emitir alarmas de seguridad.', icon: Monitor, isInternalOnly: false, enabledForExternal: true, color: 'from-[#3B82F6] to-[#1D4ED8]' },
  { id: 'skanrig', name: 'SkanRig', tagline: 'Gestión Logística Completa', longDescription: 'El poder absoluto sobre tu flota de taladros operativos. SkanRig centraliza tu planeación logística.', icon: Wrench, isInternalOnly: false, enabledForExternal: false, color: 'from-[#F59E0B] to-[#D97706]' },
  { id: 'skanvision', name: 'SkanVision', tagline: 'Visión Artificial', longDescription: 'Procesa en tiempo real videos para identificar zonas peligrosas cruzadas por el personal usando IA.', icon: Eye, isInternalOnly: false, enabledForExternal: false, color: 'from-[#8B5CF6] to-[#6D28D9]' },
  { id: 'skanreport', name: 'SkanReport', tagline: 'Generación IA', longDescription: 'Sistema capaz de redactar bitácoras de turno leyendo los datos crudos del taladro rápidamente.', icon: FileText, isInternalOnly: false, enabledForExternal: false, color: 'from-[#10B981] to-[#047857]' },
  { id: 'skanalter', name: 'SkanAlter', tagline: 'Alarma Crítica Multicanal', longDescription: 'Notificación prioritaria ante eventos rápidos. Evacúa e informa a entes reguladores.', icon: AlertTriangle, isInternalOnly: false, enabledForExternal: false, color: 'from-[#F97316] to-[#C2410C]' }
];

type LayoutMode = 'grid' | 'console' | 'split' | 'grid-neo' | 'grid-neo-ux';

interface SharedProps {
  myApps: AppModule[];
  otherApps: AppModule[];
  selectedAppId: string;
  setSelectedAppId: (id: string) => void;
  selectedApp: AppModule;
  isSelectedAppMine: boolean;
  onSelectApp: (id: string) => void;
  isInternalUser: boolean;
}

/* ─────────────────────────────────────────────────────────────────────────────
   Brochure Modal — one per locked platform
───────────────────────────────────────────────────────────────────────────── */
const brochureData: Record<string, {
  headline: string;
  description: string;
  features: { icon: React.ElementType; title: string; desc: string }[];
  steps: { num: string; title: string; desc: string }[];
  cases: { stat: string; label: string; context: string }[];
}> = {
  skanadmin: {
    headline: 'Control absoluto sobre tu organización',
    description: 'SkanAdmin es el núcleo de gestión de accesos del ecosistema SkanHawk. Define quién puede ver qué, cuándo y desde dónde, con total trazabilidad de cada acción.',
    features: [
      { icon: Users,       title: 'Gestión de Roles',        desc: 'Crea roles personalizados con permisos granulares por módulo y por pozo.' },
      { icon: Shield,      title: 'Accesos Corporativos',    desc: 'Controla accesos de contratistas, sub-contratistas y personal interno desde un solo panel.' },
      { icon: Settings,    title: 'Delegación de Permisos',  desc: 'Delega la administración de equipos sin perder visibilidad ni control central.' },
      { icon: CheckCircle, title: 'Auditoría Completa',      desc: 'Registro detallado e inmutable de quién accedió a qué información y cuándo.' },
    ],
    steps: [
      { num: '01', title: 'Define la estructura',   desc: 'Configura tu jerarquía organizacional: empresa, contratistas, torres y usuarios.' },
      { num: '02', title: 'Asigna permisos',         desc: 'Otorga o restringe acceso a módulos específicos por usuario, rol o grupo.' },
      { num: '03', title: 'Monitorea y audita',      desc: 'Revisa logs de actividad en tiempo real y ajusta permisos con un solo clic.' },
    ],
    cases: [
      { stat: '60%', label: 'Menos accesos no autorizados', context: 'Contratista con 8 torres activas' },
      { stat: '10 min', label: 'Para completar una auditoría', context: 'Antes tomaba más de 2 horas' },
      { stat: '350+', label: 'Usuarios gestionados', context: 'En una sola instalación multiempresa' },
    ],
  },
  skanrig: {
    headline: 'Tu flota de taladros, en una sola pantalla',
    description: 'SkanRig centraliza toda la planeación logística de tus equipos de perforación. Desde la asignación de torres hasta el seguimiento de movilizaciones, todo conectado.',
    features: [
      { icon: Truck,    title: 'Gestión de Flota',          desc: 'Inventario completo de taladros, equipos y herramientas con estado en tiempo real.' },
      { icon: MapPin,   title: 'Seguimiento de Ubicación',  desc: 'Monitorea la posición y estado operativo de cada torre en el mapa.' },
      { icon: Layers,   title: 'Planeación de Campañas',    desc: 'Programa intervenciones futuras y optimiza la asignación de recursos.' },
      { icon: BarChart2,title: 'Reportes Logísticos',       desc: 'KPIs de utilización, tiempo no productivo y eficiencia de movilización.' },
    ],
    steps: [
      { num: '01', title: 'Registra tus equipos',    desc: 'Carga el inventario de taladros con ficha técnica, capacidades y estado actual.' },
      { num: '02', title: 'Planea operaciones',       desc: 'Asigna equipos a pozos, define cronogramas y anticipa conflictos de recursos.' },
      { num: '03', title: 'Monitorea y optimiza',    desc: 'Sigue la ejecución en tiempo real y ajusta la planeación sobre la marcha.' },
    ],
    cases: [
      { stat: '25%', label: 'Reducción en tiempos de movilización', context: 'Campaña de 15 taladros en campo' },
      { stat: '90%', label: 'Precisión en planeación de campañas', context: 'Vs. métodos tradicionales en hoja de cálculo' },
      { stat: '3x', label: 'Más pozos planificados por semana', context: 'Con el mismo equipo de logística' },
    ],
  },
  skanvision: {
    headline: 'Inteligencia artificial que cuida a tu equipo',
    description: 'SkanVision procesa en tiempo real el video de cámaras en locación para detectar zonas peligrosas, EPP incorrecto y situaciones de riesgo antes de que ocurra un incidente.',
    features: [
      { icon: Camera,   title: 'Detección en Tiempo Real',  desc: 'Analiza múltiples feeds de cámara simultáneamente con latencia inferior a 500ms.' },
      { icon: Eye,      title: 'Zonas de Peligro',          desc: 'Define perímetros virtuales y recibe alerta inmediata cuando alguien los cruza.' },
      { icon: Cpu,      title: 'IA Integrada',              desc: 'Modelos entrenados específicamente para ambientes de perforación y workover.' },
      { icon: Bell,     title: 'Alertas Automáticas',       desc: 'Notificaciones instantáneas a supervisores vía app, email o señal sonora en locación.' },
    ],
    steps: [
      { num: '01', title: 'Instala las cámaras',     desc: 'Conecta las cámaras IP existentes o instala las cámaras SkanHawk en puntos críticos.' },
      { num: '02', title: 'Configura las zonas',     desc: 'Dibuja los perímetros de riesgo directamente sobre el feed de video en la plataforma.' },
      { num: '03', title: 'Recibe alertas',           desc: 'SkanVision monitorea 24/7 y notifica a los responsables de forma automática.' },
    ],
    cases: [
      { stat: '70%', label: 'Reducción de incidentes HSE', context: 'Primer año de implementación en locación' },
      { stat: '<500ms', label: 'Latencia de detección', context: 'Procesamiento en tiempo real sin lag visible' },
      { stat: '24/7', label: 'Monitoreo continuo', context: 'Sin fatiga ni costo incremental por turno' },
    ],
  },
  skanreport: {
    headline: 'Bitácoras de turno en segundos, no en horas',
    description: 'SkanReport lee los datos crudos del taladro y genera automáticamente reportes de turno, bitácoras operativas y resúmenes ejecutivos usando inteligencia artificial.',
    features: [
      { icon: Cpu,      title: 'Lectura de Datos Crudos',   desc: 'Conecta directamente con los sensores del taladro sin intervención manual.' },
      { icon: FileText, title: 'Generación Automática',     desc: 'Produce bitácoras de turno en el formato corporativo con un solo clic.' },
      { icon: Layers,   title: 'Plantillas Personalizadas', desc: 'Adapta el formato de cada reporte a los estándares de tu empresa u operadora.' },
      { icon: BarChart2,title: 'Exportación Multi-formato', desc: 'Descarga en PDF, Excel o Word. Envío automático por email al cerrar el turno.' },
    ],
    steps: [
      { num: '01', title: 'Conecta la fuente',        desc: 'SkanReport se integra con el stream de datos del sistema WITS o del taladro.' },
      { num: '02', title: 'Configura las plantillas', desc: 'Define los campos, métricas y formato del reporte una sola vez.' },
      { num: '03', title: 'Genera con un clic',       desc: 'Al cierre del turno, SkanReport redacta y distribuye el reporte automáticamente.' },
    ],
    cases: [
      { stat: '3 hrs', label: 'Ahorradas por turno en reportes', context: 'Operador con 4 pozos activos simultáneos' },
      { stat: '<2 min', label: 'Para generar una bitácora completa', context: 'Vs. promedio de 45 min manual' },
      { stat: '99%', label: 'Precisión vs. entrada manual', context: 'Validado contra registros de campo en campo' },
    ],
  },
  skanalter: {
    headline: 'Alertas críticas que llegan donde deben llegar',
    description: 'SkanAlter garantiza que ningún evento crítico pase desapercibido. Notificaciones multicanal, escalamiento automático e integración con entes reguladores en un solo sistema.',
    features: [
      { icon: Radio,        title: 'Notificación Multicanal', desc: 'SMS, email, llamada automática y push notification simultáneos ante un evento crítico.' },
      { icon: Layers,       title: 'Escalamiento Inteligente', desc: 'Si el primer contacto no responde, la alerta escala automáticamente al siguiente nivel.' },
      { icon: Shield,       title: 'Integración Regulatoria', desc: 'Notificación directa a entes reguladores según los protocolos de cada operadora.' },
      { icon: BarChart2,    title: 'Dashboard de Alertas',    desc: 'Historial completo de eventos, tiempos de respuesta y patrones de incidentes.' },
    ],
    steps: [
      { num: '01', title: 'Define los umbrales',      desc: 'Configura qué valores o eventos activan una alerta crítica por tipo de operación.' },
      { num: '02', title: 'Configura los canales',    desc: 'Asigna contactos, métodos de notificación y cadenas de escalamiento por turno.' },
      { num: '03', title: 'Activa el protocolo',      desc: 'SkanAlter monitorea 24/7 y ejecuta el protocolo de notificación de forma automática.' },
    ],
    cases: [
      { stat: '0', label: 'Alertas críticas sin respuesta', context: 'En 12 meses de operación continua' },
      { stat: '<30s', label: 'Tiempo de notificación', context: 'Desde el evento hasta el primer contacto' },
      { stat: '100%', label: 'Trazabilidad regulatoria', context: 'Cumplimiento total en auditorías de operadora' },
    ],
  },
};

const BrochureModal: React.FC<{ app: AppModule; onClose: () => void }> = ({ app, onClose }) => {
  const data = brochureData[app.id];
  if (!data) return null;

  return ReactDOM.createPortal(
    <div
      className="fixed inset-0 z-[99999] flex items-center justify-center"
      style={{ fontFamily: 'inherit' }}
      onClick={onClose}
    >
      {/* Backdrop */}
      <div className="absolute inset-0 bg-black/75 backdrop-blur-xl" />

      {/* Panel */}
      <div
        className="relative w-[92vw] max-w-[1100px] rounded-3xl border border-white/[0.08] overflow-hidden flex flex-col shadow-[0_60px_120px_rgba(0,0,0,1)]"
        style={{ background: '#080810', maxHeight: '88vh' }}
        onClick={e => e.stopPropagation()}
      >

        {/* ── HEADER ── */}
        <div className={`relative shrink-0 overflow-hidden bg-gradient-to-br ${app.color}`} style={{ minHeight: 120 }}>
          {/* Noise / depth overlay */}
          <div className="absolute inset-0 bg-black/30" />
          <div className="absolute inset-0 opacity-10" style={{ backgroundImage: 'radial-gradient(circle at 80% 50%, white 1px, transparent 1px)', backgroundSize: '18px 18px' }} />

          {/* Close */}
          <button
            onClick={onClose}
            className="absolute top-5 right-5 z-20 w-9 h-9 rounded-full bg-black/30 border border-white/20 flex items-center justify-center hover:bg-black/50 transition-all"
          >
            <X size={15} className="text-white" />
          </button>

          {/* Content */}
          <div className="relative z-10 flex items-center gap-5 px-10 py-7">
            <div className="w-16 h-16 rounded-2xl bg-white/15 border border-white/25 flex items-center justify-center backdrop-blur-sm shadow-inner shrink-0">
              <app.icon size={30} className="text-white" strokeWidth={1.4} />
            </div>
            <div>
              <p className="text-[10px] font-bold text-white/50 uppercase tracking-[0.4em] mb-1.5">SkanHawk Platform</p>
              <h2 className="text-[28px] font-black text-white leading-none tracking-tight">{app.name}</h2>
              <p className="text-[13px] text-white/70 mt-1.5 font-medium">{data.headline}</p>
            </div>
          </div>
        </div>

        {/* ── BODY ── */}
        <div className="flex-1 overflow-y-auto" style={{ scrollbarWidth: 'none' }}>
          <div className="px-10 py-8 flex gap-8">

            {/* ── LEFT COLUMN (60%) ── */}
            <div className="flex-1 flex flex-col gap-7">

              {/* Descripción */}
              <p className="text-[14px] text-white/60 leading-relaxed border-l-2 border-white/10 pl-4">
                {data.description}
              </p>

              {/* Características */}
              <div>
                <p className="text-[10px] font-black text-white/30 uppercase tracking-[0.35em] mb-4">Características</p>
                <div className="grid grid-cols-2 gap-3">
                  {data.features.map((f, i) => (
                    <div key={i} className="group flex gap-3.5 p-4 rounded-2xl border border-white/[0.06] hover:border-white/[0.12] bg-white/[0.02] hover:bg-white/[0.05] transition-all duration-200 cursor-default">
                      <div className={`w-10 h-10 shrink-0 rounded-xl bg-gradient-to-br ${app.color} flex items-center justify-center shadow-lg`}>
                        <f.icon size={17} className="text-white" strokeWidth={1.7} />
                      </div>
                      <div className="pt-0.5">
                        <p className="text-[12px] font-bold text-white mb-1">{f.title}</p>
                        <p className="text-[11px] text-white/45 leading-snug">{f.desc}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Casos de éxito */}
              <div>
                <p className="text-[10px] font-black text-white/30 uppercase tracking-[0.35em] mb-4">Casos de Éxito</p>
                <div className="grid grid-cols-3 gap-3">
                  {data.cases.map((c, i) => (
                    <div key={i} className="rounded-2xl p-5 border border-white/[0.06] bg-white/[0.02] flex flex-col gap-2">
                      <span
                        className="text-[28px] font-black leading-none"
                        style={{ background: 'linear-gradient(135deg, #fff 30%, rgba(255,255,255,0.45))', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}
                      >
                        {c.stat}
                      </span>
                      <p className="text-[12px] font-semibold text-white/80 leading-snug">{c.label}</p>
                      <p className="text-[10px] text-white/35 leading-snug">{c.context}</p>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Vertical divider */}
            <div className="w-px shrink-0 bg-white/[0.06] self-stretch" />

            {/* ── RIGHT COLUMN (34%) ── */}
            <div className="w-[32%] shrink-0 flex flex-col gap-7">

              {/* Cómo funciona */}
              <div>
                <p className="text-[10px] font-black text-white/30 uppercase tracking-[0.35em] mb-5">¿Cómo funciona?</p>
                <div className="relative flex flex-col gap-0">
                  {data.steps.map((s, i) => (
                    <div key={i} className="flex gap-4 relative">
                      {/* connector line */}
                      {i < data.steps.length - 1 && (
                        <div className="absolute left-[19px] top-[40px] w-[2px] h-[calc(100%-4px)] bg-white/[0.06]" />
                      )}
                      <div className={`w-10 h-10 shrink-0 rounded-xl bg-gradient-to-br ${app.color} flex items-center justify-center shadow-lg z-10 mb-5`}>
                        <span className="text-[10px] font-black text-white">{s.num}</span>
                      </div>
                      <div className="pt-1 pb-5">
                        <p className="text-[13px] font-bold text-white mb-1">{s.title}</p>
                        <p className="text-[12px] text-white/45 leading-snug">{s.desc}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* CTA block */}
              <div className={`rounded-2xl p-6 bg-gradient-to-br ${app.color} relative overflow-hidden`}>
                <div className="absolute inset-0 bg-black/30" />
                <div className="relative z-10 flex flex-col gap-4">
                  <div>
                    <p className="text-[15px] font-black text-white leading-tight">¿Listo para activar {app.name}?</p>
                    <p className="text-[12px] text-white/65 mt-1.5 leading-snug">Contacta con tu administrador para solicitar acceso.</p>
                  </div>
                  <button className="w-full flex items-center justify-center gap-2 px-5 py-3 rounded-xl bg-white text-[12px] font-black tracking-widest text-black hover:brightness-95 transition-all shadow-lg">
                    <Lock size={13} />
                    PEDIR ACCESO
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>,
    document.body
  );
};

const AppMetaInfo: React.FC<{ selectedApp: AppModule; isSelectedAppMine: boolean; onSelectApp: (id: string) => void; layout: LayoutMode }> = ({ selectedApp, isSelectedAppMine, onSelectApp, layout }) => {
  const [brochureOpen, setBrochureOpen] = React.useState(false);
  return (
  <>
   <div className={`flex-shrink-0 w-full ${layout.includes('grid') ? 'mb-4' : 'mb-8'}`}>
      <div className={`flex items-center gap-3 ${layout.includes('grid') ? 'mb-4' : 'mb-6'}`}>
         <div className={`p-2.5 rounded-xl bg-gradient-to-br ${selectedApp.color} shadow-lg`}>
            <selectedApp.icon size={20} className="text-white" strokeWidth={1.5} />
         </div>
         <span className="text-[10px] font-bold text-white/50 tracking-[0.3em] uppercase drop-shadow-sm">SkanHawk Platform</span>
      </div>
      
      <h1 className={`${layout.includes('grid') ? 'text-4xl lg:text-5xl' : 'text-5xl lg:text-6xl'} font-black tracking-tight text-white mb-3 drop-shadow-xl leading-none`}>
         {selectedApp.name}
      </h1>
      
      <h2 className={`${layout.includes('grid') ? 'text-lg lg:text-xl' : 'text-xl lg:text-2xl'} font-light text-white/70 mb-5 border-l-[3px] border-white/20 pl-4 py-0.5`}>
         {selectedApp.tagline}
      </h2>

      <p className={`text-[13px] text-white/60 leading-relaxed font-light ${layout.includes('grid') ? 'mb-6' : 'mb-10'} max-w-xl`}>
         {selectedApp.longDescription}
      </p>

      <div className="flex items-center gap-4">
         {isSelectedAppMine ? (
            <button
               onClick={() => onSelectApp(selectedApp.id)}
               className={`flex items-center justify-center gap-3 px-8 py-3 rounded-xl text-[12px] font-bold tracking-[0.2em] text-[#050505] transition-all bg-white hover:brightness-110 shadow-[0_0_20px_rgba(255,255,255,0.15)]`}
            >
               <Zap size={16} className="fill-current" />
               ABRIR MODULO
            </button>
         ) : (
            <>
               <button className="flex items-center gap-2 px-6 py-3 rounded-xl text-[11px] font-bold tracking-[0.2em] text-white transition-all bg-white/5 hover:bg-white/10 border border-white/10">
                  <Lock size={14} className="text-white/50" />
                  PEDIR ACCESO
               </button>
               {brochureData[selectedApp.id] && (
                  <button onClick={() => setBrochureOpen(true)} className="flex items-center gap-2 px-4 py-3 text-[11px] font-bold tracking-widest text-[#00d0c3] hover:text-white transition-colors">
                     Ver Brochure <ArrowRight size={14} />
                  </button>
               )}
            </>
         )}
      </div>
   </div>
   {brochureOpen && <BrochureModal app={selectedApp} onClose={() => setBrochureOpen(false)} />}
  </>
  );
};

/* ─────────────────────────────────────────────────────────────────────────────
   VizPro Interactive Demo — faithful mini-replica of the real dashboard
───────────────────────────────────────────────────────────────────────────── */
const VizProDemo: React.FC = () => (
  <div className="w-full perspective-1000 flex justify-start xl:justify-center">
    <style>{`
      @keyframes vpdCursor {
        0%,16.6%  { left:68%; top:6%;  }
        33.3%     { left:8%;  top:55%; }
        50%       { left:8%;  top:55%; }
        66.6%     { left:62%; top:72%; }
        83.3%     { left:62%; top:72%; }
        100%      { left:68%; top:6%;  }
      }
      @keyframes vpdR1 {
        0%,12%  { transform:translate(-50%,-50%) scale(0); opacity:0; }
        13%     { transform:translate(-50%,-50%) scale(0.3); opacity:1; }
        20%     { transform:translate(-50%,-50%) scale(3); opacity:0; }
        100%    { transform:translate(-50%,-50%) scale(0); opacity:0; }
      }
      @keyframes vpdR2 {
        0%,37%  { transform:translate(-50%,-50%) scale(0); opacity:0; }
        38%     { transform:translate(-50%,-50%) scale(0.3); opacity:1; }
        45%     { transform:translate(-50%,-50%) scale(3); opacity:0; }
        100%    { transform:translate(-50%,-50%) scale(0); opacity:0; }
      }
      @keyframes vpdR3 {
        0%,70%  { transform:translate(-50%,-50%) scale(0); opacity:0; }
        71%     { transform:translate(-50%,-50%) scale(0.3); opacity:1; }
        78%     { transform:translate(-50%,-50%) scale(3); opacity:0; }
        100%    { transform:translate(-50%,-50%) scale(0); opacity:0; }
      }
      @keyframes vpdSelHL {
        0%,11%,22%,100% { background:rgba(45,212,191,0.12); }
        12%,19%          { background:rgba(45,212,191,0.4); box-shadow:0 0 8px rgba(45,212,191,0.6); }
      }
      @keyframes vpdAlertHL {
        0%,69%,80%,100% { filter:brightness(0.8); }
        70%,77%          { filter:brightness(1.6); }
      }
      @keyframes vpdNumPulse {
        0%,100% { opacity:0.5; }
        50%     { opacity:1; }
      }
      @keyframes vpdBarPulse {
        0%,100% { opacity:0.5; }
        50%     { opacity:0.9; }
      }
    `}</style>

    <div
      className="w-full xl:w-[95%] aspect-[16/10] rounded-xl border border-white/10 shadow-[0_30px_70px_rgba(0,0,0,0.9)] overflow-hidden relative select-none flex flex-col"
      style={{ transform:'rotateY(-5deg) rotateX(8deg) translateZ(20px)', background:'#0F0F12' }}
    >
      {/* ══ TOPBAR ══ */}
      <div className="shrink-0 flex items-center px-2 gap-1.5 border-b border-white/[0.07]" style={{height:'8%', background:'#1B1B1E'}}>
        <div className="text-[4.5px] font-black text-white/40 tracking-widest uppercase shrink-0">SKANHAWK</div>
        <div className="w-px h-3 bg-white/10 mx-1 shrink-0" />
        <div className="text-[4.5px] font-black text-white/70 uppercase tracking-wider shrink-0">POZO: CASTILLA NORTE-407</div>
        <div className="flex items-center gap-0.5 ml-1 shrink-0">
          <div className="w-1.5 h-1.5 rounded-full bg-[#22c55e] animate-pulse" />
          <span className="text-[4px] text-[#22c55e] font-black">ONLINE</span>
        </div>
        <span className="text-[4px] text-white/40 font-mono ml-1 shrink-0">10/04/2026 11:05:28</span>
        <div className="ml-auto flex items-center gap-1.5 shrink-0">
          <div className="flex items-center gap-1 rounded px-1.5 py-0.5 border border-[#2dd4bf]/40 text-[4px] font-black text-[#2dd4bf]"
            style={{animation:'vpdSelHL 12s ease-in-out infinite'}}>
            SELECCIONAR INTERVENCIÓN
          </div>
          <div className="w-4 h-3 rounded bg-white/10" />
          <div className="w-3 h-3 rounded-full border border-white/30" />
        </div>
      </div>

      {/* ══ TOP ROW: Weather + Gases + Cycle + Métricas ══ */}
      <div className="shrink-0 flex gap-px border-b border-white/[0.06]" style={{height:'15%'}}>
        {/* Weather */}
        <div className="w-[10%] shrink-0 flex flex-col p-1 justify-between" style={{background:'#1C1C1E'}}>
          <span className="text-[3.5px] text-white/40 font-bold uppercase">Hoy</span>
          <span className="text-[10px] font-black text-white leading-none">31°C</span>
          <span className="text-[3px] text-white/40">Parc. nublado</span>
          <div className="flex justify-between mt-0.5">
            {['S','D','L'].map((d,i) => (
              <div key={i} className="flex flex-col items-center">
                <span className="text-[3px] text-white/30">{d}</span>
                <span className="text-[4px] text-white/60 font-black">32°</span>
              </div>
            ))}
          </div>
        </div>
        {/* Gases */}
        <div className="w-[7%] shrink-0 flex flex-col items-center justify-center p-1 gap-0.5" style={{background:'#1D1D20'}}>
          <span className="text-[3.5px] font-black text-white/70 uppercase">GASES</span>
          <div className="flex gap-2 mt-0.5">
            <div className="w-5 h-5 border border-white/20 flex items-center justify-center relative">
              <div className="absolute w-full h-px bg-white/20 top-1/2" />
              <div className="absolute h-full w-px bg-white/20 left-1/2" />
              {['0','0','0','0'].map((v,i) => (
                <span key={i} className="absolute text-[3.5px] text-white/60 font-bold"
                  style={{top:i<2?'1px':'auto',bottom:i>=2?'1px':'auto',left:i%2===0?'1px':'auto',right:i%2===1?'1px':'auto'}}>{v}</span>
              ))}
            </div>
            <div className="flex flex-col items-center gap-1">
              <span className="text-[3.5px] font-black text-[#F59B22]">LEL</span>
              <span className="text-[3.5px] font-black text-[#F59B22]">H2S</span>
            </div>
          </div>
        </div>
        {/* Cycle chart */}
        <div className="w-[18%] shrink-0 flex flex-col p-1" style={{background:'#1C1C1E'}}>
          <span className="text-[3.5px] font-black text-white/60 uppercase text-center mb-0.5">CICLO CUÑA A CUÑA</span>
          <div className="flex-1 flex items-end gap-px">
            {[5.8,6.1,5.9,7.2,6.0,6.2,5.7,5.8,6.3].map((v,i) => (
              <div key={i} className="flex-1 rounded-t-[1px]"
                style={{height:`${(v/8)*100}%`, background:i%2===0?'#09BC96':'#0B5799', opacity:0.85}} />
            ))}
          </div>
        </div>
        {/* Métricas */}
        <div className="flex-1 flex flex-col" style={{background:'#1C1C1E'}}>
          <div className="flex justify-center py-0.5 border-b border-[#525252]">
            <span className="text-[3.5px] font-black text-white/60 uppercase tracking-wider">MÉTRICAS DE LAS ÚLTIMAS 2 HORAS</span>
          </div>
          <div className="flex-1 flex">
            {[
              { lbl:'CONEXIONES', color:'#47CEAC', cells:[{v:'12.50',l:'Juntas/Hora'},{v:'0.87',l:'Conex-Desconex'}] },
              { lbl:'BLOQUE',     color:'#1477D2', cells:[{v:'0.27',l:'Subiendo'},{v:'1.42',l:'Detenido'},{v:'0.30',l:'Bajando'},{v:'0.41',l:'Fuera Cuñas'},{v:'0.22',l:'En Cuñas'},{v:'0.51',l:'En Cuñas'}] },
              { lbl:'CIRCULACIÓN',color:'#AC0653', cells:[{v:'0.00',l:'Circulación'},{v:'0.00',l:'Pruebas'},{v:'0.00',l:'Contador'},{v:'0.00',l:'Molienda'}] },
            ].map((sec, si) => (
              <div key={si} className={`flex flex-col border-r border-[#525252] ${si===1?'flex-[2]':'flex-1'}`}>
                <div className="text-center py-px border-b border-white/10">
                  <span className="text-[3px] font-black uppercase" style={{color:sec.color}}>{sec.lbl}</span>
                </div>
                <div className="flex-1 flex flex-wrap">
                  {sec.cells.map((c,ci) => (
                    <div key={ci} className="flex flex-col items-center justify-center p-px border-r border-b border-white/[0.06]" style={{flex:'1 0 33%'}}>
                      <span className="text-[5px] font-black text-white leading-none"
                        style={{animation:`vpdNumPulse ${2+ci*0.3}s ease-in-out infinite ${ci*0.2}s`}}>{c.v}</span>
                      <span className="text-[3px] text-white/30 text-center leading-none mt-px">{c.l}</span>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* ══ MAIN CONTENT ══ */}
      <div className="flex flex-1 min-h-0 overflow-hidden">

        {/* WellChart */}
        <div className="flex border-r border-white/[0.06]" style={{width:'74%'}}>
          {/* Left panel */}
          <div className="flex flex-col items-center py-1 gap-0.5 border-r border-white/[0.06] overflow-hidden shrink-0"
            style={{width:'7%', background:'#1c1c1e'}}>
            <div className="w-3 h-3 rounded bg-white/10 flex items-center justify-center shrink-0">
              <div className="w-1.5 h-1.5 rounded bg-white/20" />
            </div>
            <div className="flex items-center gap-0.5 shrink-0">
              <span className="text-[3px] text-[#22c55e] font-black border border-[#22c55e]/50 px-0.5 rounded leading-none py-px">RT</span>
            </div>
            <span className="text-[3px] text-white/30 font-mono shrink-0">2 hr</span>
            {/* Viewport selector */}
            <div className="w-[80%] shrink-0 border border-[#F59E0B]/60 rounded-sm" style={{height:'12%', background:'rgba(245,158,11,0.08)'}} />
            {/* Time labels */}
            <div className="flex-1 flex flex-col justify-between py-0.5 items-end w-full pr-0.5 overflow-hidden">
              {['13:25','13:40','13:55','14:10','14:25','14:40','14:55','15:10','15:25'].map((t,i) => (
                <div key={i} className="flex items-center justify-end gap-0.5 w-full">
                  <span className="text-[2.8px] text-white/30 font-mono leading-none">{t}</span>
                  <div className="w-1 h-px bg-white/20 shrink-0" />
                </div>
              ))}
            </div>
          </div>

          {/* 4 track groups × 3 tracks each */}
          <div className="flex-1 flex overflow-hidden">
            {[
              {
                hdrs:[{t:'Peso Sobre Broca',c:'#2dd4bf'},{t:'Carga Gancho',c:'#facc15'},{t:'Caudal',c:'#2dd4bf'}],
                lines:[
                  {c:'#2dd4bf', pts:'0,60 5,55 10,70 15,45 20,60 25,40 30,55 35,65 40,50 45,60 50,40 55,55 60,45 65,55 70,40 75,50 80,60 85,45 90,55 95,50 100,45'},
                  {c:'#facc15', pts:'0,40 5,35 10,45 15,30 20,40 25,50 30,35 35,45 40,55 45,40 50,50 55,35 60,50 65,40 70,55 75,45 80,40 85,50 90,45 95,55 100,50'},
                  {c:'#38bdf8', pts:'0,80 5,75 10,85 15,70 20,80 25,65 30,75 35,80 40,70 45,80 50,65 55,75 60,70 65,80 70,65 75,75 80,80 85,70 90,75 95,80 100,70'},
                ]
              },
              {
                hdrs:[{t:'Ctr Tubería',c:'#818cf8'},{t:'Vel Bloque',c:'#facc15'},{t:'SPM',c:'#f472b6'}],
                lines:[
                  {c:'#818cf8', pts:'0,50 5,45 10,55 15,60 20,50 25,45 30,55 35,50 40,60 45,50 50,55 55,45 60,55 65,50 70,60 75,50 80,55 85,45 90,55 95,50 100,55'},
                  {c:'#facc15', pts:'0,30 5,35 10,25 15,40 20,30 25,45 30,35 35,25 40,40 45,30 50,45 55,35 60,25 65,40 70,30 75,45 80,35 85,25 90,40 95,30 100,35'},
                  {c:'#f472b6', pts:'0,70 5,65 10,75 15,60 20,70 25,80 30,65 35,75 40,60 45,70 50,80 55,65 60,75 65,60 70,75 75,65 80,70 85,80 90,65 95,75 100,70'},
                ]
              },
              {
                hdrs:[{t:'Profundidad',c:'#60a5fa'},{t:'Pos Bloque',c:'#fb923c'},{t:'Pres Bomba',c:'#4ade80'}],
                lines:[
                  {c:'#60a5fa', pts:'0,20 5,22 10,18 15,24 20,20 25,16 30,22 35,20 40,24 45,20 50,18 55,22 60,18 65,20 70,24 75,20 80,18 85,22 90,20 95,18 100,20'},
                  {c:'#fb923c', pts:'0,55 5,50 10,60 15,50 20,60 25,55 30,65 35,55 40,60 45,50 50,60 55,55 60,65 65,55 70,60 75,50 80,60 85,55 90,65 95,55 100,60'},
                  {c:'#4ade80', pts:'0,75 5,70 10,80 15,65 20,75 25,85 30,70 35,80 40,70 45,75 50,85 55,70 60,80 65,70 70,80 75,75 80,70 85,80 90,70 95,80 100,75'},
                ]
              },
              {
                hdrs:[{t:'Torque LPM',c:'#e879f9'},{t:'Torque',c:'#f87171'},{t:'Torque Hid',c:'#f87171'}],
                lines:[
                  {c:'#e879f9', pts:'0,45 5,55 10,40 15,60 20,45 25,55 30,40 35,60 40,50 45,55 50,40 55,60 60,45 65,55 70,40 75,60 80,45 85,55 90,40 95,60 100,45'},
                  {c:'#f87171', pts:'0,35 5,30 10,40 15,25 20,35 25,45 30,30 35,40 40,30 45,35 50,45 55,30 60,40 65,30 70,45 75,35 80,30 85,40 90,30 95,40 100,35'},
                  {c:'#fca5a5', pts:'0,65 5,60 10,70 15,55 20,65 25,75 30,60 35,70 40,60 45,65 50,75 55,60 60,70 65,60 70,75 75,65 80,60 85,70 90,60 95,70 100,65'},
                ]
              },
            ].map((group, gi) => (
              <div key={gi} className="flex flex-col border-r border-white/[0.04]" style={{flex:'1'}}>
                {/* Track headers */}
                <div className="shrink-0 border-b border-white/[0.06] flex flex-col items-center px-px py-px gap-px" style={{height:'12%',background:'#181818'}}>
                  {group.hdrs.map((h,hi) => (
                    <span key={hi} className="text-[2.8px] font-black truncate w-full text-center leading-none" style={{color:h.c, opacity:0.85}}>{h.t}</span>
                  ))}
                </div>
                {/* Track lines */}
                <div className="flex-1 relative overflow-hidden">
                  <svg width="100%" height="100%" preserveAspectRatio="none" viewBox="0 0 100 100">
                    {/* Grid */}
                    <line x1="50" y1="0" x2="50" y2="100" stroke="rgba(255,255,255,0.04)" strokeWidth="0.5"/>
                    {group.lines.map((l, li) => (
                      <polyline key={li} points={l.pts} fill="none" stroke={l.c} strokeWidth="0.8" opacity="0.8"/>
                    ))}
                  </svg>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Right column */}
        <div className="flex flex-col overflow-hidden" style={{width:'26%'}}>
          {/* Alerts */}
          <div className="shrink-0 p-1 border-b border-white/[0.06]" style={{animation:'vpdAlertHL 12s ease-in-out infinite'}}>
            <span className="text-[4px] font-black text-white block leading-none mb-px">INDEP-219 - CASTILLA NORTE-407</span>
            <span className="text-[3.5px] text-white/50 block mb-1">Alarmas - Alertas</span>
            <div className="flex flex-col gap-0.5">
              <div className="flex items-center gap-1 rounded-sm px-1 py-0.5" style={{background:'rgba(160,25,15,0.9)'}}>
                <div className="w-3 h-3 rounded-sm shrink-0 flex items-center justify-center text-[6px] font-black text-white" style={{background:'#C94010'}}>!</div>
                <span className="text-[3.5px] text-white font-bold flex-1 leading-tight">Torque fuera de rango: último valor 11666 (KPI 4300-5100)</span>
              </div>
              <div className="flex items-center gap-1 rounded-sm px-1 py-0.5" style={{background:'rgba(140,105,0,0.9)'}}>
                <div className="w-3 h-3 rounded-sm shrink-0 flex items-center justify-center text-[5px] text-white" style={{background:'#C49000'}}>🔔</div>
                <span className="text-[3.5px] text-white font-bold flex-1 leading-tight">Juntas/h: último registro 8.78 debajo del KPI (18)</span>
              </div>
            </div>
          </div>
          {/* Survey placeholder */}
          <div className="shrink-0 border-b border-white/[0.06] flex items-center justify-center overflow-hidden" style={{height:'18%',background:'#141416'}}>
            <span className="text-[3.5px] text-white/30 font-bold uppercase">SURVEY</span>
            <svg width="40%" height="80%" viewBox="0 0 40 80" style={{opacity:0.5}}>
              <polyline points="20,5 18,15 22,25 16,40 20,55 17,70" fill="none" stroke="#4ade80" strokeWidth="1.5"/>
              <line x1="0" y1="5" x2="40" y2="5" stroke="rgba(255,255,255,0.1)" strokeWidth="0.5"/>
              <line x1="0" y1="78" x2="40" y2="78" stroke="rgba(255,255,255,0.1)" strokeWidth="0.5"/>
            </svg>
          </div>
          {/* Metric tiles 2×3 */}
          <div className="grid grid-cols-2 gap-px flex-[1.2] overflow-hidden" style={{background:'#111'}}>
            {[
              {lbl:'Barriles por Minuto',v:'0.0',u:'BBLS/MIN',c:'#2dd4bf'},
              {lbl:'Presión Bomba',      v:'12', u:'PSI',     c:'#2dd4bf'},
              {lbl:'RPM Mesa Rotaria',   v:'0',  u:'RPM',     c:'#2dd4bf'},
              {lbl:'Torque Mesa',        v:'-8.5',u:'LBS-FT', c:'#2dd4bf'},
              {lbl:'Peso Sobre Broca',   v:'0.0',u:'KLB',     c:'#2dd4bf'},
              {lbl:'ROP',                v:'0.0',u:'FT/MIN',  c:'#2dd4bf'},
            ].map((m,i) => (
              <div key={i} className="flex flex-col items-center justify-center p-1 border border-white/[0.05]" style={{background:'#1A1A1D'}}>
                <span className="text-[3px] text-white/50 text-center leading-tight mb-0.5">{m.lbl}</span>
                <span className="text-[9px] font-black text-white leading-none"
                  style={{animation:`vpdNumPulse ${2.2+i*0.25}s ease-in-out infinite ${i*0.2}s`}}>{m.v}</span>
                <span className="text-[3px] font-bold mt-0.5" style={{color:m.c}}>{m.u}</span>
              </div>
            ))}
          </div>
          {/* Torque bars horizontal */}
          <div className="flex-1 overflow-hidden p-1 border-t border-white/[0.06]" style={{background:'#1A1A1D', minHeight:0}}>
            <span className="text-[3.5px] font-black text-white/40 uppercase block mb-0.5">TORQUES APLICADOS</span>
            <div className="flex flex-col gap-px h-[calc(100%-10px)]">
              {[0.72,0.55,0.88,0.61,0.79,0.45,0.93,0.66].map((w,i) => (
                <div key={i} className="flex-1 flex items-center gap-0.5">
                  <span className="text-[2.8px] text-white/25 font-mono w-5 shrink-0 text-right">{['13:20','13:25','13:31','13:33','13:40','13:48','13:55','14:02'][i]}</span>
                  <div className="flex-1 h-full rounded-r-sm flex items-center"
                    style={{background:'linear-gradient(to right,#FFD500,#B37700)', width:`${w*100}%`, maxWidth:'100%',
                    animation:`vpdBarPulse ${2.3+i*0.12}s ease-in-out infinite ${i*0.15}s`}} />
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* ══ BOTTOM ROW ══ */}
      <div className="shrink-0 flex border-t border-white/[0.06]" style={{height:'12%'}}>
        {/* Tonelada Milla */}
        <div className="shrink-0 flex flex-col items-start justify-center px-2 border-r border-white/[0.06]" style={{width:'7%',background:'#1D1D20'}}>
          <span className="text-[3px] font-black text-white/60 uppercase leading-none">TON. MILLA</span>
          <span className="text-[10px] font-black text-white leading-none mt-0.5">181.98</span>
        </div>
        {/* Velocity chart */}
        <div className="flex-1 flex flex-col justify-center px-2 overflow-hidden" style={{background:'#1A1A1D'}}>
          <div className="flex items-center gap-2 mb-0.5">
            <div className="w-1.5 h-1.5 rounded-full bg-[#00FFD6]" />
            <span className="text-[3.5px] font-black text-white/70 uppercase">Velocidad con carga</span>
            <span className="text-[3.5px] text-white/30 uppercase ml-2">Velocidad de viaje</span>
            <span className="text-[3.5px] text-white/30 uppercase ml-1">ROP</span>
          </div>
          <div className="flex-1 relative overflow-hidden">
            <svg width="100%" height="100%" preserveAspectRatio="none" viewBox="0 0 200 30">
              <polyline points="0,25 10,20 20,22 30,15 40,18 50,10 60,14 70,8 80,12 90,6 100,10 110,5 120,8 130,4 140,8 150,5 160,9 170,4 180,8 190,5 200,7"
                fill="none" stroke="#00FFD6" strokeWidth="1" opacity="0.8"/>
              <polyline points="0,15 10,18 20,12 30,20 40,14 50,22 60,16 70,20 80,14 90,18 100,12 110,16 120,10 130,15 140,10 150,14 160,8 170,13 180,8 190,12 200,9"
                fill="none" stroke="#F10238" strokeWidth="0.8" opacity="0.7"/>
            </svg>
          </div>
        </div>
      </div>

      {/* ── CURSOR ── */}
      <div className="absolute pointer-events-none z-50" style={{animation:'vpdCursor 12s ease-in-out infinite'}}>
        <svg width="9" height="11" viewBox="0 0 10 12">
          <path d="M0.5 0.5 L0.5 9.5 L3 7 L5 11.5 L6.5 11 L4.5 6.5 L8 6.5 Z" fill="white" stroke="rgba(0,0,0,0.6)" strokeWidth="0.8"/>
        </svg>
      </div>
      {/* RIPPLES */}
      <div className="absolute pointer-events-none z-40 w-5 h-5 rounded-full border border-[#2dd4bf]"
        style={{left:'68%',top:'6%', animation:'vpdR1 12s ease-out infinite'}} />
      <div className="absolute pointer-events-none z-40 w-5 h-5 rounded-full border border-white/50"
        style={{left:'8%',top:'55%', animation:'vpdR2 12s ease-out infinite'}} />
      <div className="absolute pointer-events-none z-40 w-5 h-5 rounded-full border border-[#C94010]/80"
        style={{left:'62%',top:'72%', animation:'vpdR3 12s ease-out infinite'}} />

      {/* Bottom accent */}
      <div className="absolute bottom-0 left-0 right-0 h-[2px] bg-gradient-to-r from-[#F59E0B] via-[#8B5CF6] to-[#2dd4bf]" />
    </div>
  </div>
);

const VizDashboardPreview: React.FC = () => (
  <div className="w-full perspective-1000 flex justify-start xl:justify-center">
    <style>{`
      /* 12s cycle — synced with autoAnimate (drawer opens at 2.5s=20.8%, closes at 8.5s=70.8%) */
      @keyframes vpdCursorMove {
        0%     { left:50%; top:58%; opacity:0; transform:scale(1); }
        4%     { left:50%; top:58%; opacity:1; transform:scale(1); }
        14%    { left:97%; top:55%; opacity:1; transform:scale(1); }
        18%    { left:97%; top:55%; opacity:1; transform:scale(0.6); }
        20.8%  { left:97%; top:55%; opacity:1; transform:scale(1); }
        30%    { left:38%; top:45%; opacity:1; transform:scale(1); }
        40%    { left:56%; top:62%; opacity:1; transform:scale(1); }
        43%    { left:56%; top:62%; opacity:1; transform:scale(0.6); }
        46%    { left:56%; top:62%; opacity:1; transform:scale(1); }
        57%    { left:28%; top:54%; opacity:1; transform:scale(1); }
        60%    { left:28%; top:54%; opacity:1; transform:scale(0.6); }
        63%    { left:28%; top:54%; opacity:1; transform:scale(1); }
        68%    { left:72%; top:55%; opacity:1; transform:scale(1); }
        70.8%  { left:72%; top:55%; opacity:1; transform:scale(0.6); }
        73%    { left:72%; top:55%; opacity:1; transform:scale(1); }
        83%    { left:50%; top:58%; opacity:0; transform:scale(1); }
        100%   { left:50%; top:58%; opacity:0; transform:scale(1); }
      }
      /* Zoom ripple on chart click 1 (at 43%) */
      @keyframes vpdZoom1 {
        0%,42%  { left:56%; top:62%; transform:translate(-50%,-50%) scale(0); opacity:0; }
        43%     { left:56%; top:62%; transform:translate(-50%,-50%) scale(0.2); opacity:1; }
        50%     { left:56%; top:62%; transform:translate(-50%,-50%) scale(3.5); opacity:0; }
        100%    { left:56%; top:62%; transform:translate(-50%,-50%) scale(0); opacity:0; }
      }
      /* Zoom ripple on chart click 2 (at 60%) */
      @keyframes vpdZoom2 {
        0%,59%  { left:28%; top:54%; transform:translate(-50%,-50%) scale(0); opacity:0; }
        60%     { left:28%; top:54%; transform:translate(-50%,-50%) scale(0.2); opacity:1; }
        67%     { left:28%; top:54%; transform:translate(-50%,-50%) scale(3.5); opacity:0; }
        100%    { left:28%; top:54%; transform:translate(-50%,-50%) scale(0); opacity:0; }
      }
    `}</style>
    <div
      className="w-full xl:w-[95%] aspect-[16/10] rounded-xl border border-white/10 shadow-[0_30px_70px_rgba(0,0,0,0.9)] overflow-hidden relative select-none"
      style={{ transform: 'rotateY(-5deg) rotateX(8deg) translateZ(20px)' }}
    >
      {/* Dashboard at 2× size scaled to 0.5 — full UI visible */}
      <div style={{ position: 'absolute', top: 0, left: 0, width: '200%', height: '200%', transform: 'scale(0.5)', transformOrigin: 'top left' }}>
        <SkanMonitorDashboard onBack={() => {}} mockData={[]} autoAnimate={true} />
      </div>

      {/* Animated cursor — synced with 12s autoAnimate cycle */}
      <div style={{
        position: 'absolute', width: 13, height: 13, borderRadius: '50%', pointerEvents: 'none', zIndex: 20,
        background: 'radial-gradient(circle at 30% 30%, #fff, #ccc)',
        border: '1.5px solid rgba(0,0,0,0.6)',
        boxShadow: '0 2px 10px rgba(0,0,0,0.7)',
        animation: 'vpdCursorMove 12s ease-in-out infinite',
      }} />
      {/* Zoom ripple 1 — chart click at 43% */}
      <div style={{
        position: 'absolute', width: 36, height: 36, borderRadius: '50%', pointerEvents: 'none', zIndex: 19,
        border: '2px solid rgba(71,206,172,0.9)',
        boxShadow: '0 0 14px rgba(71,206,172,0.5)',
        animation: 'vpdZoom1 12s ease-out infinite',
      }} />
      {/* Zoom ripple 2 — chart click at 60% */}
      <div style={{
        position: 'absolute', width: 36, height: 36, borderRadius: '50%', pointerEvents: 'none', zIndex: 19,
        border: '2px solid rgba(71,206,172,0.9)',
        boxShadow: '0 0 14px rgba(71,206,172,0.5)',
        animation: 'vpdZoom2 12s ease-out infinite',
      }} />

      <div className="absolute top-2 right-2 px-2 py-0.5 rounded text-[7px] font-black uppercase tracking-widest text-white/60 border border-white/10 bg-black/40 backdrop-blur-sm pointer-events-none z-10">
        Preview
      </div>
    </div>
  </div>
);

const DashboardMockup: React.FC<{ selectedApp: AppModule }> = ({ selectedApp }) => {
  if (selectedApp.id === 'vizpro') return <VizProDemo />;
  if (['vizpremium', 'vizmedium', 'vizbasic'].includes(selectedApp.id)) return <VizDashboardPreview />;
  return (
   <div className="w-full perspective-1000 flex justify-start xl:justify-center">
      <div 
         className="w-full xl:w-[95%] aspect-[16/10] rounded-2xl bg-[#0F0F12]/90 backdrop-blur-xl border border-white/15 shadow-[0_40px_80px_rgba(0,0,0,0.8)] flex flex-col overflow-hidden transition-all duration-700 ease-out preserve-3d group hover:rotate-Y-0 hover:rotate-X-0 transform-gpu"
         style={{ transform: 'rotateY(-5deg) rotateX(10deg) translateZ(20px)' }}
      >
         <div className="h-7 border-b border-white/5 bg-white/5 flex items-center px-4 gap-2">
            <div className="w-2 h-2 rounded-full bg-white/30"></div>
            <div className="w-2 h-2 rounded-full bg-white/30"></div>
            <div className="w-2 h-2 rounded-full bg-white/30"></div>
            <div className="ml-auto text-[7px] tracking-widest uppercase font-bold text-white/40">Preview</div>
         </div>
         
         <div className="flex-1 flex p-4 gap-4 relative opacity-90 group-hover:opacity-100 transition-opacity">
            <div className="w-[20%] h-full flex flex-col gap-3 border-r border-white/10 pr-3">
               <div className="w-full h-6 rounded bg-white/10"></div>
               <div className="w-full h-3 rounded bg-white/5 mt-2"></div>
               <div className="w-3/4 h-3 rounded bg-white/5"></div>
               <div className={`mt-auto w-full h-8 rounded-lg bg-gradient-to-r ${selectedApp.color} opacity-30`}></div>
            </div>
            
            <div className="flex-1 h-full flex flex-col gap-4">
               <div className="flex gap-4 h-[40%]">
                  <div className="flex-1 rounded-xl border border-white/10 flex items-end p-3 gap-2 justify-between bg-white/5">
                     {[40, 80, 55, 30, 100].map((h, i) => (
                        <div key={i} className={`w-[15%] rounded-t-lg bg-gradient-to-t ${selectedApp.color}`} style={{ height: `${h}%` }}></div>
                     ))}
                  </div>
                  <div className="w-[30%] rounded-xl border border-white/10 flex items-center justify-center p-2 bg-white/5">
                      <div className={`w-[70%] aspect-square rounded-full border-[5px] border-b-transparent bg-transparent animate-[spin_6s_linear_infinite]`} style={{ borderColor: 'var(--tw-gradient-from, #555)', borderBottomColor: 'transparent' }}></div>
                  </div>
               </div>

               <div className="flex-1 rounded-xl bg-white/5 border border-white/10 p-4 flex flex-col gap-3 relative overflow-hidden">
                  <div className="w-1/3 h-3 bg-white/20 rounded"></div>
                  
                  <div className="mt-auto flex flex-col gap-2.5">
                     {[1,2,3].map(i => (
                        <div key={i} className="flex justify-between items-center border-b border-white/5 pb-1.5">
                           <div className="w-1/5 h-1.5 bg-white/30 rounded"></div>
                           <div className="w-1/2 h-1.5 bg-white/10 rounded"></div>
                           <div className={`w-1/6 h-1.5 rounded bg-gradient-to-r ${selectedApp.color}`}></div>
                        </div>
                     ))}
                  </div>
                  <div className="absolute inset-0 -translate-x-[150%] animate-[shimmer_2.5s_infinite] bg-gradient-to-r from-transparent via-white/[0.15] to-transparent transform -skew-x-12"></div>
               </div>
            </div>
         </div>
         <div className={`absolute bottom-0 w-full h-1 bg-gradient-to-r ${selectedApp.color}`}></div>
      </div>
   </div>
  );
};


/* -------------------------------------------------------------------------- */
/*                         OPTION 1: UNIFIED GRID 2.0                         */
/* -------------------------------------------------------------------------- */
const LayoutGrid: React.FC<SharedProps> = ({ myApps, otherApps, selectedAppId, setSelectedAppId, selectedApp, isSelectedAppMine, onSelectApp, isInternalUser }) => (
   <main className="flex-1 flex w-full relative z-20 overflow-hidden max-w-[1900px] mx-auto animate-[fadeIn_0.3s_ease-out]">
      
      {/* Left: Tighter Grid with Lighter Cards */}
      <div className="w-full lg:w-[60%] h-full flex flex-col relative z-30 overflow-y-auto hide-scrollbar pt-6 pb-20 px-8 xl:px-12">
         <div className="max-w-4xl w-full mx-auto">
            <div className="mb-10">
               <div className="flex items-center gap-3 mb-5">
                  <h3 className="text-sm font-black text-white tracking-[0.2em] uppercase">MIS APLICACIONES ACTIVAS</h3>
               </div>
               {/* 3 items per row guaranteed, same heights */}
               <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-3 md:gap-4">
                  {myApps.map((app) => {
                     const isSelected = selectedAppId === app.id;
                     return (
                        <div key={app.id} onClick={() => setSelectedAppId(app.id)}
                           className={`relative h-[120px] p-4 rounded-xl cursor-pointer transition-all duration-300 border flex flex-col justify-between group overflow-hidden
                              ${isSelected 
                                 ? 'bg-white/10 border-white/30 shadow-[0_0_20px_rgba(255,255,255,0.1)] ring-1 ring-white/10 scale-[1.03] z-10' 
                                 : 'bg-[#151515] hover:bg-[#1C1C1C] border-[#222] hover:border-[#333] text-white/70'}
                           `}
                        >
                           {/* Color subtle glow */}
                           {isSelected && <div className={`absolute top-0 right-0 w-20 h-20 bg-gradient-to-bl ${app.color} opacity-20 blur-[20px]`}></div>}
                           
                           <div className="flex items-center gap-3 relative z-10 w-full min-w-0">
                              <div className={`w-10 h-10 shrink-0 rounded-lg flex items-center justify-center transition-all ${isSelected ? `bg-gradient-to-br ${app.color} shadow-md` : 'bg-white/5'}`}>
                                 <app.icon size={20} strokeWidth={isSelected ? 1.5 : 1} className={isSelected ? 'text-white' : 'text-white/50'} />
                              </div>
                              <div className="flex-1 min-w-0">
                                 <h4 className={`text-[14px] font-bold truncate ${isSelected ? 'text-white' : 'text-white/80'}`}>{app.name}</h4>
                                 {app.isSessionActive && (
                                    <div className="flex items-center gap-1 mt-0.5">
                                       <span className="w-1.5 h-1.5 rounded-full bg-green-400 animate-pulse"></span>
                                       <span className="text-[9px] text-green-400 font-bold uppercase tracking-widest leading-none">Activa</span>
                                    </div>
                                 )}
                              </div>
                              {isSelected && <div className="shrink-0 w-1.5 h-1.5 rounded-full bg-white/30 ml-auto"></div>}
                           </div>
                           <p className={`text-[10.5px] leading-tight line-clamp-2 mt-2 font-medium ${isSelected ? 'text-white/70' : 'text-white/40'}`}>{app.tagline}</p>
                        </div>
                     );
                  })}
               </div>
            </div>

            {/* SEPARATOR REMOVED IN OPTION 1 TOO! */}

            {!isInternalUser && otherApps.length > 0 && (
               <div className="pb-10 pt-4">
                  <div className="flex items-center gap-3 mb-5 opacity-60">
                     <h3 className="text-sm font-bold text-white tracking-[0.2em] uppercase">Ecosistema Extendido</h3>
                  </div>
                  {/* Must be exactly identically sized to the top - 3 Columns, h-[120px] */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-3 md:gap-4">
                     {otherApps.map((app) => {
                        const isSelected = selectedAppId === app.id;
                        return (
                           <div key={app.id} onClick={() => setSelectedAppId(app.id)}
                              className={`relative h-[120px] p-4 rounded-xl cursor-pointer transition-all duration-300 border flex flex-col justify-between group overflow-hidden
                                 ${isSelected 
                                    ? 'bg-white/10 border-white/30 shadow-[0_0_20px_rgba(255,255,255,0.1)] ring-1 ring-white/10 scale-[1.03] z-10' 
                                    : 'bg-[#111] hover:bg-[#1A1A1A] border-[#1C1C1C]'}
                              `}
                           >
                              <div className="flex items-center gap-3 relative z-10">
                                 <div className="w-10 h-10 shrink-0 rounded-lg flex items-center justify-center bg-white/5">
                                    <app.icon size={20} strokeWidth={1} className={isSelected ? 'text-white' : 'text-white/30'} />
                                 </div>
                                 <h4 className={`text-[14px] font-bold truncate ${isSelected ? 'text-white' : 'text-white/40'}`}>{app.name}</h4>
                              </div>
                              <div className="flex justify-between items-end mt-2">
                                 <p className="text-[9px] uppercase tracking-widest text-white/30 font-bold">{isSelected ? 'Sugerido' : 'Bloqueado'}</p>
                                 <Lock size={12} className={isSelected ? 'text-white/50' : 'text-white/10'} />
                              </div>
                           </div>
                        );
                     })}
                  </div>
               </div>
            )}
         </div>
      </div>

      {/* Right: Info + 3D with more breathing room */}
      <section className="hidden lg:flex flex-1 h-full flex-col px-8 xl:px-14 py-8 relative justify-start overflow-y-auto hide-scrollbar">
         <AppMetaInfo selectedApp={selectedApp} isSelectedAppMine={isSelectedAppMine} onSelectApp={onSelectApp} layout="grid" />
         <div className="w-full max-h-[280px] mt-4 shrink-0">
             <DashboardMockup selectedApp={selectedApp} />
         </div>
      </section>
   </main>
);

/* -------------------------------------------------------------------------- */
/*                         OPTION 2: CONSOLE HIGHLIGHT                        */
/* -------------------------------------------------------------------------- */
const LayoutConsole: React.FC<SharedProps> = ({ myApps, otherApps, selectedAppId, setSelectedAppId, selectedApp, isSelectedAppMine, onSelectApp, isInternalUser }) => (
   <main className="flex-1 flex flex-col w-full relative z-20 overflow-hidden bg-transparent animate-[fadeIn_0.3s_ease-out]">
      
      {/* Top Half: Highlight */}
      <div className="flex-1 flex flex-col lg:flex-row items-center justify-between px-10 xl:px-20 py-12 gap-10">
         <div className="w-full lg:w-1/2">
            <AppMetaInfo selectedApp={selectedApp} isSelectedAppMine={isSelectedAppMine} onSelectApp={onSelectApp} layout="console" />
         </div>
         <div className="w-full lg:w-[45%]">
            <DashboardMockup selectedApp={selectedApp} />
         </div>
      </div>

      {/* Bottom Half: Horizontal Slider inside distinct dock */}
      <div className="h-[240px] bg-[#0A0A0C] border-t border-[#222] flex flex-col justify-center px-10 py-6 shrink-0 relative z-40">
         <h3 className="text-[11px] font-bold text-white/40 tracking-widest uppercase mb-4 shrink-0">Todas las Aplicaciones</h3>
         
         <div className="flex gap-4 overflow-x-auto hide-scrollbar pb-4 items-stretch h-full">
            {[...myApps, ...otherApps].map(app => {
               const isSelected = selectedAppId === app.id;
               const isMine = myApps.some(m => m.id === app.id);
               return (
                  <div key={app.id} onClick={() => setSelectedAppId(app.id)}
                     className={`w-[240px] shrink-0 rounded-2xl p-4 cursor-pointer transition-all border flex flex-col justify-between overflow-hidden relative
                        ${isSelected ? 'bg-white/10 border-white/20' : 'bg-[#15151A] border-transparent opacity-80 hover:bg-[#1C1C22]'}
                     `}
                  >
                     {isSelected && <div className={`absolute top-0 right-0 w-24 h-24 bg-gradient-to-bl ${app.color} opacity-20 blur-[20px]`}></div>}

                     <div className="flex justify-between items-start relative z-10">
                        <div className={`w-12 h-12 rounded-xl flex items-center justify-center transition-all ${isSelected ? `bg-gradient-to-br ${app.color}` : 'bg-white/5'}`}>
                           <app.icon size={22} className={isSelected ? 'text-white' : 'text-white/40'} />
                        </div>
                        {!isMine && <Lock size={14} className="text-white/20" />}
                     </div>
                     <div className="relative z-10">
                        <h4 className={`text-[15px] font-bold ${isSelected ? 'text-white' : 'text-white/60'}`}>{app.name}</h4>
                        <p className="text-[10px] text-white/40 mt-1 truncate">{app.tagline}</p>
                     </div>
                  </div>
               )
            })}
         </div>
      </div>
   </main>
);

/* -------------------------------------------------------------------------- */
/*                         OPTION 3: SPLIT SIDEBAR LIST                       */
/* -------------------------------------------------------------------------- */
const LayoutSplit: React.FC<SharedProps> = ({ myApps, otherApps, selectedAppId, setSelectedAppId, selectedApp, isSelectedAppMine, onSelectApp, isInternalUser }) => (
   <main className="flex-1 flex w-full relative z-20 overflow-hidden divide-x divide-[#222] bg-transparent animate-[fadeIn_0.3s_ease-out]">
      <aside className="w-[300px] xl:w-[350px] h-full flex flex-col bg-[#0A0A0C] py-6 px-4 overflow-y-auto">
         <div className="mb-8">
            <h3 className="text-[11px] font-bold text-white/40 tracking-widest uppercase mb-4 px-3">En Producción</h3>
            <div className="flex flex-col gap-1">
               {myApps.map(app => {
                  const isSelected = selectedAppId === app.id;
                  return (
                     <div key={app.id} onClick={() => setSelectedAppId(app.id)}
                        className={`flex items-center gap-3 p-3 rounded-lg cursor-pointer transition-colors border ${isSelected ? 'bg-white/10 border-white/10' : 'border-transparent hover:bg-white/5'}`}
                     >
                        <div className={`w-8 h-8 rounded shrink-0 flex items-center justify-center ${isSelected ? `bg-gradient-to-br ${app.color}` : 'bg-[#15151A]'}`}>
                           <app.icon size={16} className={isSelected ? 'text-white' : 'text-white/50'} />
                        </div>
                        <div className="flex-1 truncate">
                           <p className={`text-[14px] font-semibold ${isSelected ? 'text-white' : 'text-white/70'}`}>{app.name}</p>
                        </div>
                        {isSelected && <div className="w-1.5 h-1.5 rounded-full bg-green-400"></div>}
                     </div>
                  )
               })}
            </div>
         </div>

         {!isInternalUser && otherApps.length > 0 && (
            <div>
               <h3 className="text-[11px] font-bold text-white/40 tracking-widest uppercase mb-4 px-3 mt-4">Explorar</h3>
               <div className="flex flex-col gap-1">
                  {otherApps.map(app => {
                     const isSelected = selectedAppId === app.id;
                     return (
                        <div key={app.id} onClick={() => setSelectedAppId(app.id)}
                           className={`flex items-center gap-3 p-3 rounded-lg cursor-pointer transition-colors border ${isSelected ? 'bg-white/10 border-white/10' : 'border-transparent hover:bg-white/5'}`}
                        >
                           <div className="w-8 h-8 rounded shrink-0 flex items-center justify-center bg-[#111]">
                              <app.icon size={16} className={isSelected ? 'text-white/90' : 'text-white/30'} />
                           </div>
                           <div className="flex-1 truncate">
                              <p className={`text-[14px] font-medium ${isSelected ? 'text-white/90' : 'text-white/40'}`}>{app.name}</p>
                           </div>
                           <Lock size={12} className="text-white/20" />
                        </div>
                     )
                  })}
               </div>
            </div>
         )}
      </aside>

      <section className="flex-1 h-full flex flex-col px-12 xl:px-20 py-10 relative overflow-y-auto">
         <AppMetaInfo selectedApp={selectedApp} isSelectedAppMine={isSelectedAppMine} onSelectApp={onSelectApp} layout="split" />
      </section>
   </main>
);

/* -------------------------------------------------------------------------- */
/*                         OPTION 4: GRID NEO (HIGH CONTRAST)                 */
/* -------------------------------------------------------------------------- */
const LayoutGridNeo: React.FC<SharedProps> = ({ myApps, otherApps, selectedAppId, setSelectedAppId, selectedApp, isSelectedAppMine, onSelectApp, isInternalUser }) => (
   <main className="flex-1 flex w-full relative z-20 overflow-hidden mx-auto bg-transparent animate-[fadeIn_0.3s_ease-out]">
      
      {/* Neo Background Glow overrides the main gradient for maximum contrast */}
      <div className="absolute top-[-20%] right[-10%] w-[1200px] h-[1200px] pointer-events-none transition-all duration-[1500ms] opacity-[0.1] blur-[220px]">
         <div className={`w-full h-full bg-gradient-to-br ${selectedApp.color} rounded-full`}></div>
      </div>
      {/* Subtle digital noise backdrop for texture */}
      <div className="absolute inset-0 opacity-[0.03] pointer-events-none mix-blend-screen" style={{ backgroundImage: 'radial-gradient(circle at center, #ffffff 1px, transparent 1px)', backgroundSize: '12px 12px' }}></div>

      <div className="w-full lg:w-[60%] h-full flex flex-col relative z-30 overflow-y-auto hide-scrollbar pt-10 pb-20 px-8 xl:px-14">
         <div className="max-w-4xl w-full mx-auto">
            
            {/* MIS APLICACIONES ACTIVAS */}
            <div className="mb-12">
               <div className="flex items-center gap-3 mb-6">
                  <h3 className="text-[13px] font-black text-white/90 tracking-[0.25em] uppercase border-l-2 border-white/30 pl-3">PANEL PRINCIPAL</h3>
               </div>
               
               <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-5">
                  {myApps.map((app) => {
                     const isSelected = selectedAppId === app.id;
                     return (
                        <div key={app.id} onClick={() => setSelectedAppId(app.id)}
                           className={`relative h-[130px] p-5 rounded-[18px] cursor-pointer transition-all duration-300 border flex flex-col justify-between overflow-hidden group shadow-lg
                              ${isSelected 
                                 ? 'bg-[#2A2D3A] border-white/60 shadow-[0_15px_35px_rgba(0,0,0,0.9)] ring-1 ring-white/30 scale-[1.05] z-10' 
                                 : 'bg-[#1C1D24] hover:bg-[#252830] border-[#323644] hover:border-[#4A5060] text-white hover:-translate-y-1.5 hover:shadow-[0_20px_40px_rgba(0,0,0,0.8)]'}
                           `}
                        >
                           {/* Intense select glow inside the card */}
                           {isSelected && <div className={`absolute top-0 right-0 w-32 h-32 bg-gradient-to-bl ${app.color} opacity-40 blur-[25px]`}></div>}
                           {/* Hover ambient rim light */}
                           <div className={`absolute -inset-[1px] rounded-[18px] opacity-0 group-hover:opacity-10 transition-duration-300 bg-gradient-to-br ${app.color} blur-[2px] -z-10`}></div>
                           
                           <div className="flex items-center gap-3.5 relative z-10 w-full min-w-0">
                              <div className={`w-11 h-11 shrink-0 rounded-xl flex items-center justify-center transition-all ${isSelected ? `bg-white shadow-[0_0_15px_rgba(255,255,255,0.4)]` : 'bg-gradient-to-b from-[#2A2D38] to-[#1E2028] border border-[#3A3F50] group-hover:border-[#525970]'}`}>
                                 <app.icon size={22} strokeWidth={isSelected ? 2 : 1.5} className={isSelected ? 'text-[#0a0a0a]' : 'text-white/80 group-hover:text-white'} />
                              </div>
                              <div className="flex-1 min-w-0">
                                 <h4 className={`text-[15px] font-bold truncate transition-colors ${isSelected ? 'text-white' : 'text-white/90 group-hover:text-white'}`}>{app.name}</h4>
                                 {app.isSessionActive && (
                                    <div className="flex items-center gap-1.5 mt-0.5">
                                       <span className="w-1.5 h-1.5 rounded-full bg-green-400 animate-pulse"></span>
                                       <span className="text-[9px] text-green-400 font-bold uppercase tracking-widest leading-none">Activa</span>
                                    </div>
                                 )}
                              </div>
                           </div>
                           <p className={`relative z-10 text-[11.5px] leading-relaxed line-clamp-2 mt-3 transition-colors ${isSelected ? 'text-white/90 font-medium' : 'text-white/60 group-hover:text-white/80'}`}>{app.tagline}</p>
                        </div>
                     );
                  })}
               </div>
            </div>

            {/* ECOSISTEMA EXTENDIDO */}
            {!isInternalUser && otherApps.length > 0 && (
               <div className="pb-10 pt-4">
                  <div className="flex items-center gap-3 mb-6 opacity-80">
                     <h3 className="text-[13px] font-bold text-white/80 tracking-[0.25em] uppercase border-l-2 border-white/20 pl-3">MÓDULOS EXTRA</h3>
                  </div>
                  
                  <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-5">
                     {otherApps.map((app) => {
                        const isSelected = selectedAppId === app.id;
                        return (
                           <div key={app.id} onClick={() => setSelectedAppId(app.id)}
                              className={`relative h-[130px] p-5 rounded-[18px] cursor-pointer transition-all duration-300 border flex flex-col justify-between overflow-hidden group shadow-md
                                 ${isSelected 
                                    ? 'bg-[#2A2D3A] border-white/60 shadow-[0_15px_35px_rgba(0,0,0,0.9)] ring-1 ring-white/30 scale-[1.05] z-10' 
                                    : 'bg-[#15161C] hover:bg-[#1C1D24] border-[#22242E] hover:border-[#383B46] hover:-translate-y-1.5 hover:shadow-[0_20px_40px_rgba(0,0,0,0.8)]'}
                              `}
                           >
                              <div className="flex items-center gap-3.5 relative z-10">
                                 <div className={`w-11 h-11 shrink-0 rounded-xl flex items-center justify-center transition-all ${isSelected ? `bg-white shadow-[0_0_15px_rgba(255,255,255,0.4)]` : 'bg-gradient-to-b from-[#1C1D24] to-[#121318] border border-[#2A2D38] group-hover:border-[#404455]'}`}>
                                    <app.icon size={22} strokeWidth={isSelected ? 2 : 1.5} className={isSelected ? 'text-[#0a0a0a]' : 'text-white/50 group-hover:text-white/90'} />
                                 </div>
                                 <h4 className={`text-[15px] font-bold truncate transition-colors ${isSelected ? 'text-white' : 'text-white/60 group-hover:text-white'}`}>{app.name}</h4>
                              </div>
                              <div className="flex justify-between items-end mt-3">
                                 <p className="text-[10px] uppercase tracking-widest text-white/40 font-bold">{isSelected ? 'Sugerido' : 'Bloqueado'}</p>
                                 <Lock size={14} className={isSelected ? 'text-white' : 'text-white/30'} />
                              </div>
                           </div>
                        );
                     })}
                  </div>
               </div>
            )}
         </div>
      </div>

      <section className="hidden lg:flex flex-1 h-full flex-col px-8 xl:px-14 py-12 relative justify-start overflow-y-auto hide-scrollbar">
         {/* Re-use exact same dark AppMetaInfo */}
         <AppMetaInfo selectedApp={selectedApp} isSelectedAppMine={isSelectedAppMine} onSelectApp={onSelectApp} layout="grid" />
         <div className="w-full max-h-[280px] mt-4 shrink-0">
             {/* Re-use exact same dark DashboardMockup */}
             <DashboardMockup selectedApp={selectedApp} />
         </div>
      </section>
   </main>
);

/* -------------------------------------------------------------------------- */
/*                         OPTION 5: GRID NEO UX (PERFECTION)                 */
/* -------------------------------------------------------------------------- */

const AppMetaInfoUX: React.FC<{ selectedApp: AppModule; isSelectedAppMine: boolean; onSelectApp: (id: string) => void; }> = ({ selectedApp, isSelectedAppMine, onSelectApp }) => {
  const [brochureOpen, setBrochureOpen] = React.useState(false);
  return (
  <>
   <div className={`flex-shrink-0 w-full mb-6 border-l-4 border-cyan-400/80 pl-5 ml-1 py-1 relative`}>
      <h1 className={`text-4xl lg:text-5xl font-black tracking-tight text-white mb-2 drop-shadow-xl leading-none`}>
         {selectedApp.name}
      </h1>

      <h2 className={`text-lg lg:text-xl font-medium text-[#00d0c3] mb-5`}>
         {selectedApp.tagline}
      </h2>

      <p className={`text-[13px] text-white/50 leading-relaxed font-light mb-8 max-w-xl`}>
         {selectedApp.longDescription}
      </p>

      <div className="flex flex-col sm:flex-row items-center gap-4 w-full sm:w-auto">
         {isSelectedAppMine ? (
            <button
               onClick={() => onSelectApp(selectedApp.id)}
               className={`flex items-center justify-center gap-3 px-8 py-3.5 w-full sm:w-auto rounded-xl text-[13px] font-black tracking-[0.2em] text-[#050505] transition-all bg-gradient-to-r ${selectedApp.color} hover:brightness-125 shadow-[0_0_25px_rgba(0,180,180,0.4)] hover:shadow-[0_0_40px_rgba(0,180,180,0.6)] animate-[pulse_3s_ease-in-out_infinite] hover:animate-none hover:scale-105`}
            >
               <Zap size={18} fill="#050505" />
               ABRIR MÓDULO
            </button>
         ) : (
            <>
               <div className="w-full sm:w-auto p-[1px] rounded-xl bg-gradient-to-r from-red-500/20 to-orange-500/20">
                  <button className="w-full flex items-center justify-center gap-2 px-6 py-3 rounded-xl text-[11px] font-bold tracking-[0.2em] text-white/80 transition-all bg-[#0a0a0e] hover:bg-white/5">
                     <Lock size={14} className="text-red-400" />
                     SOLICITAR A ADMIN
                  </button>
               </div>
               {brochureData[selectedApp.id] && (
                  <button onClick={() => setBrochureOpen(true)} className="flex items-center gap-2 px-4 py-3 text-[11px] font-bold tracking-widest text-[#00d0c3] hover:text-white transition-colors">
                     Ver Brochure <ArrowRight size={14} />
                  </button>
               )}
            </>
         )}
      </div>
   </div>
   {brochureOpen && <BrochureModal app={selectedApp} onClose={() => setBrochureOpen(false)} />}
  </>
  );
};


const LayoutGridNeoUX: React.FC<SharedProps> = ({ myApps, otherApps, selectedAppId, setSelectedAppId, selectedApp, isSelectedAppMine, onSelectApp, isInternalUser }) => {
   const [mobileModalOpen, setMobileModalOpen] = useState(false);

   const openModuleDetail = (id: string) => {
      setSelectedAppId(id);
      setMobileModalOpen(true);
   };

   return (
      <main className="flex-1 flex w-full relative z-20 overflow-hidden mx-auto bg-transparent animate-[fadeIn_0.3s_ease-out]">
         
         <div className="absolute top-[-20%] right[-10%] w-[1200px] h-[1200px] pointer-events-none transition-all duration-[1500ms] opacity-[0.08] blur-[220px]">
            <div className={`w-full h-full bg-gradient-to-br ${selectedApp.color} rounded-full`}></div>
         </div>
         <div className="absolute inset-0 opacity-[0.03] pointer-events-none mix-blend-screen" style={{ backgroundImage: 'radial-gradient(circle at center, #ffffff 1px, transparent 1px)', backgroundSize: '12px 12px' }}></div>

         <div className="w-full lg:w-[60%] h-full flex flex-col relative z-30 overflow-y-auto hide-scrollbar pt-6 lg:pt-10 pb-[120px] px-6 lg:px-8 xl:px-14">
            <div className="max-w-4xl w-full mx-auto">
               
               {/* MIS APLICACIONES ACTIVAS */}
               <div className="mb-12">
                  <div className="flex items-center gap-3 mb-6">
                     <h3 className="text-[13px] font-black text-white/90 tracking-[0.25em] uppercase border-l-2 border-cyan-400 pl-3">PANEL PRINCIPAL</h3>
                  </div>
                  
                  <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-5">
                     {myApps.map((app) => {
                        const isSelected = selectedAppId === app.id;
                        return (
                           <div key={app.id} onClick={() => openModuleDetail(app.id)}
                              className={`relative h-[130px] p-5 rounded-[18px] cursor-pointer transition-all duration-300 border flex flex-col justify-between overflow-hidden group shadow-lg
                                 ${isSelected 
                                    ? 'bg-[#2A2D3A] border-[#00d0c3] shadow-[0_0_20px_rgba(0,208,195,0.2)] ring-1 ring-[#00d0c3]/50 scale-[1.03] z-10' 
                                    : 'bg-[#1C1D24] hover:bg-[#20232A] border-[#323644] hover:border-[#606A80] text-white hover:-translate-y-2 hover:shadow-[0_20px_40px_rgba(0,0,0,0.8)]'}
                              `}
                           >
                              {isSelected && <div className={`absolute top-0 right-0 w-32 h-32 bg-gradient-to-bl ${app.color} opacity-40 blur-[25px]`}></div>}
                              <div className={`absolute -inset-[1px] rounded-[18px] opacity-0 group-hover:opacity-[0.15] transition-duration-300 bg-white blur-[1px] -z-10`}></div>
                              
                              <div className="flex items-center gap-3.5 relative z-10">
                                 <div className={`w-11 h-11 shrink-0 rounded-xl flex items-center justify-center transition-all ${isSelected ? `bg-white shadow-[0_0_15px_rgba(255,255,255,0.4)]` : 'bg-gradient-to-b from-[#2A2D38] to-[#1E2028] border border-[#3A3F50] group-hover:border-[#525970] group-hover:shadow-[0_0_15px_rgba(255,255,255,0.1)]'}`}>
                                    <app.icon size={22} strokeWidth={isSelected ? 2 : 1.5} className={isSelected ? 'text-[#0a0a0a]' : 'text-white/80 group-hover:text-white group-hover:scale-110 transition-transform'} />
                                 </div>
                                 <div className="flex-1 truncate">
                                    <h4 className={`text-[15px] font-bold truncate transition-colors ${isSelected ? 'text-white' : 'text-white/90 group-hover:text-white'}`}>{app.name}</h4>
                                    {app.isSessionActive && (
                                       <div className="flex items-center gap-1.5 mt-0.5">
                                          <span className="w-1.5 h-1.5 rounded-full bg-green-400 animate-pulse"></span>
                                          <span className="text-[9px] text-green-400 font-bold uppercase tracking-widest leading-none">Activa</span>
                                       </div>
                                    )}
                                 </div>
                              </div>
                              <p className={`relative z-10 text-[11.5px] leading-relaxed line-clamp-2 mt-3 transition-colors ${isSelected ? 'text-white/90 font-medium' : 'text-white/60 group-hover:text-white/80'}`}>{app.tagline}</p>
                           </div>
                        );
                     })}
                  </div>
               </div>

               {/* ECOSISTEMA EXTENDIDO (Blocked showing low opacity) */}
               {!isInternalUser && otherApps.length > 0 && (
                  <div className="pb-10 pt-4">
                     <div className="flex items-center gap-3 mb-6 opacity-60">
                        <h3 className="text-[13px] font-bold text-white/80 tracking-[0.25em] uppercase border-l-2 border-white/20 pl-3">MÓDULOS EXTRA</h3>
                     </div>
                     
                     <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-5">
                        {otherApps.map((app) => (
                           <div key={app.id} onClick={() => openModuleDetail(app.id)}
                              className={`relative h-[130px] p-5 rounded-[18px] cursor-pointer transition-all duration-300 border flex flex-col justify-between overflow-hidden group shadow-md
                                 bg-black/30 backdrop-blur-sm border-[#1C1D24] opacity-50 hover:opacity-[0.85] grayscale hover:grayscale-0 hover:border-white/20 hover:-translate-y-1 hover:shadow-lg
                              `}
                              style={{ backgroundSize: '4px 4px', backgroundImage: 'repeating-linear-gradient(45deg, transparent, transparent 2px, rgba(255,255,255,0.015) 2px, rgba(255,255,255,0.015) 4px)' }}
                           >
                              <div className="absolute inset-0 bg-black/70 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity z-20 backdrop-blur-[2px] p-4 text-center">
                                 <p className="text-[11.5px] text-white/90 font-medium leading-relaxed">
                                    Requiere permiso.<br/>
                                    <span className="text-[#00d0c3] font-bold">Ver Detalles</span>
                                 </p>
                              </div>

                              <div className="flex items-center gap-3.5 relative z-10 opacity-70">
                                 <div className={`w-11 h-11 shrink-0 rounded-xl flex items-center justify-center bg-gradient-to-b from-[#1C1D24] to-[#121318] border border-[#2A2D38]`}>
                                    <app.icon size={22} strokeWidth={1.5} className={'text-white/50'} />
                                 </div>
                                 <h4 className={`text-[15px] font-bold truncate text-white/60`}>{app.name}</h4>
                              </div>
                              <div className="flex justify-between items-end mt-3 relative z-10 opacity-70">
                                 <p className="text-[10px] uppercase tracking-widest text-white/40 font-bold">Bloqueado</p>
                                 <Lock size={14} className={'text-white/30'} />
                              </div>
                           </div>
                        ))}
                     </div>
                  </div>
               )}
            </div>
         </div>

         {/* DESKTOP Right Panel: Information */}
         <section className="hidden lg:flex flex-1 h-full flex-col px-8 xl:px-14 py-12 relative justify-start overflow-y-auto hide-scrollbar">
            <AppMetaInfoUX selectedApp={selectedApp} isSelectedAppMine={isSelectedAppMine} onSelectApp={onSelectApp} />
            <div className="w-full max-h-[280px] mt-4 shrink-0">
                <DashboardMockup selectedApp={selectedApp} />
            </div>
         </section>

         {/* MOBILE Bottom Sheet Panel */}
         <div className={`fixed inset-0 z-50 flex items-end lg:hidden transition-all duration-300 pointer-events-none ${mobileModalOpen ? 'opacity-100' : 'opacity-0'}`}>
            <div className="absolute inset-0 bg-black/70 pointer-events-auto backdrop-blur-sm transition-opacity" onClick={() => setMobileModalOpen(false)}></div>
            <div className={`w-full bg-[#0A0B10] rounded-t-3xl border-t border-white/10 p-6 pb-8 flex flex-col gap-6 pointer-events-auto transition-transform duration-500 shadow-[0_-20px_50px_rgba(0,0,0,0.8)] ${mobileModalOpen ? 'translate-y-0' : 'translate-y-full'}`}>
               <div className="w-12 h-1.5 bg-white/20 rounded-full mx-auto mb-2 cursor-pointer" onClick={() => setMobileModalOpen(false)}></div>
               <AppMetaInfoUX selectedApp={selectedApp} isSelectedAppMine={isSelectedAppMine} onSelectApp={onSelectApp} />
               <div className="h-[200px] w-full rounded-2xl overflow-hidden pointer-events-none scale-90 origin-top opacity-50">
                   <DashboardMockup selectedApp={selectedApp} />
               </div>
            </div>
         </div>
      </main>
   );
};

/* -------------------------------------------------------------------------- */
/*                               MAIN COMPONENT                               */
/* -------------------------------------------------------------------------- */
const PlatformHome: React.FC<{ onSelectApp: (appId: string) => void; isInternalUser: boolean; onLogout?: () => void }> = ({ onSelectApp, isInternalUser, onLogout }) => {
  const [layoutMode, setLayoutMode] = useState<LayoutMode>('grid');
  const [selectedAppId, setSelectedAppId] = useState<string>('skanview');
  const [activeApps, setActiveApps] = useState<Set<string>>(new Set());

  React.useEffect(() => {
    const checkActiveApps = () => {
      const stored = JSON.parse(localStorage.getItem('skanhawk_active_apps_ping') || '{}');
      const now = Date.now();
      const activeIds = new Set<string>();
      let cleaned = false;

      Object.keys(stored).forEach(appId => {
         if (now - stored[appId] < 2500) {
            activeIds.add(appId);
         } else {
            delete stored[appId];
            cleaned = true;
         }
      });

      if (cleaned) localStorage.setItem('skanhawk_active_apps_ping', JSON.stringify(stored));
      setActiveApps(activeIds);
    };

    checkActiveApps();
    window.addEventListener('storage', checkActiveApps);
    
    // Fallback interval just in case storage events are missed.
    const interval = setInterval(checkActiveApps, 1500);
    
    return () => {
      window.removeEventListener('storage', checkActiveApps);
      clearInterval(interval);
    };
  }, []);

  const visibleModules = modules.map(m => ({ ...m, isSessionActive: m.isSessionActive || activeApps.has(m.id) })).filter(m => (isInternalUser ? true : !m.isInternalOnly));
  const myApps = visibleModules.filter(m => (isInternalUser ? true : m.enabledForExternal));
  const otherApps = visibleModules.filter(m => (isInternalUser ? false : !m.enabledForExternal));

  const selectedApp = visibleModules.find(m => m.id === selectedAppId) || visibleModules[0];
  const isSelectedAppMine = isInternalUser ? true : selectedApp.enabledForExternal;

  const sharedProps: SharedProps = { myApps, otherApps, selectedAppId, setSelectedAppId, selectedApp, isSelectedAppMine, onSelectApp, isInternalUser };

  return (
    <div className="h-screen w-full bg-[#0F0F12] text-white font-sans flex flex-col relative overflow-hidden">
      
      {/* Dynamic Animated Orbs / Background */}
      <div className="absolute top-[-20%] left-[-10%] w-[1000px] h-[1000px] bg-[#611039] rounded-full blur-[200px] opacity-20 animate-pulse pointer-events-none"></div>
      <div className="absolute bottom-[-20%] right-[-10%] w-[800px] h-[800px] bg-[#0A4A60] rounded-full blur-[150px] opacity-30 pointer-events-none"></div>
      <div className="absolute top-[20%] right-[20%] w-[400px] h-[400px] bg-[#00d0c3] rounded-full blur-[180px] opacity-10 pointer-events-none animate-bounce" style={{ animationDuration: '8s' }}></div>

      <div className="absolute inset-0 opacity-[0.02] pointer-events-none" style={{ backgroundImage: 'radial-gradient(circle at center, white 1px, transparent 1px)', backgroundSize: '32px 32px' }}></div>

      {/* Header with Switcher */}
      <header className="h-[75px] shrink-0 flex items-center justify-between px-10 relative z-50 border-b border-[#222] bg-[#050505]/60 backdrop-blur-xl">
         <div className="flex items-center gap-12">
            <img src="https://dlsinfoappsprod.blob.core.windows.net/clients-logo/SkanHawk logo.png" alt="SkanHawk" className="h-[20px] object-contain brightness-0 invert opacity-100" />
            
            {/* The Layout Options Switcher requested by the user */}
            <div className="hidden lg:flex items-center p-1 bg-[#111] border border-[#222] rounded-xl relative shadow-inner">
               <button onClick={() => setLayoutMode('grid')} className={`flex items-center gap-2 px-3 py-1.5 rounded-lg text-[10px] font-bold uppercase transition-all ${layoutMode === 'grid' ? 'bg-[#2a2a2a] text-white shadow-md border border-[#333]' : 'text-white/40 hover:text-white/80 border border-transparent'}`}>
                  <Grid size={13} /> Opc 1
               </button>
               <button onClick={() => setLayoutMode('console')} className={`flex items-center gap-2 px-3 py-1.5 rounded-lg text-[10px] font-bold uppercase transition-all ${layoutMode === 'console' ? 'bg-[#2a2a2a] text-white shadow-md border border-[#333]' : 'text-white/40 hover:text-white/80 border border-transparent'}`}>
                  <Monitor size={13} /> Opc 2
               </button>
               <button onClick={() => setLayoutMode('split')} className={`flex items-center gap-2 px-3 py-1.5 rounded-lg text-[10px] font-bold uppercase transition-all ${layoutMode === 'split' ? 'bg-[#2a2a2a] text-white shadow-md border border-[#333]' : 'text-white/40 hover:text-white/80 border border-transparent'}`}>
                  <Menu size={13} /> Opc 3
               </button>
               <button onClick={() => setLayoutMode('grid-neo')} className={`flex items-center gap-2 px-3 py-1.5 rounded-lg text-[10px] font-bold uppercase transition-all ${layoutMode === 'grid-neo' ? 'bg-white text-black shadow-md border border-white' : 'text-white/40 hover:text-white/80 border border-transparent'}`}>
                  <Sparkles size={13} /> Opc 4
               </button>
               <button onClick={() => setLayoutMode('grid-neo-ux')} className={`flex items-center gap-2 px-3 py-1.5 rounded-lg text-[10px] font-bold uppercase transition-all ${layoutMode === 'grid-neo-ux' ? 'bg-[#00d0c3] text-black shadow-[0_0_15px_rgba(0,208,195,0.4)] border border-transparent' : 'text-white/40 hover:text-white/80 border border-transparent'}`}>
                  <Sparkles size={13} /> Opc 5
               </button>
            </div>
         </div>

         <UserDropdown onLogout={onLogout || (() => {})} showNameInline />
      </header>

      {/* Render Dynamic Layout */}
      {layoutMode === 'grid' && <LayoutGrid {...sharedProps} />}
      {layoutMode === 'console' && <LayoutConsole {...sharedProps} />}
      {layoutMode === 'split' && <LayoutSplit {...sharedProps} />}
      {layoutMode === 'grid-neo' && <LayoutGridNeo {...sharedProps} />}
      {layoutMode === 'grid-neo-ux' && <LayoutGridNeoUX {...sharedProps} />}

      {/* SKAI — asistente IA, disponible en todas las vistas del shell */}
      <TalonChat />

      <style dangerouslySetInnerHTML={{__html: `
         .hide-scrollbar::-webkit-scrollbar { display: none; }
         .hide-scrollbar { -ms-overflow-style: none; scrollbar-width: none; }
         .preserve-3d { transform-style: preserve-3d; }
         .perspective-1000 { perspective: 1200px; }
         @keyframes shimmer { 100% { transform: translateX(150%) skewX(-12deg); } }
         @keyframes fadeIn {
            from { opacity: 0; transform: translateY(5px); }
            to { opacity: 1; transform: translateY(0); }
         }
      `}} />
    </div>
  );
};

export default PlatformHome;
