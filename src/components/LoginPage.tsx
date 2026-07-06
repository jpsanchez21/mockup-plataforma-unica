import React, { useState } from 'react';
import { User, EyeOff, Eye, ChevronRight, Info } from 'lucide-react';

interface Props {
  onLogin: (role: 'internal' | 'external') => void;
}

const LoginPage: React.FC<Props> = ({ onLogin }) => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [isHovered, setIsHovered] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const user = username.toLowerCase().trim();
    if (user === 'interno' || user === 'externo') {
       onLogin(user === 'interno' ? 'internal' : 'external');
    } else {
       setError('Para esta demo, ingresa "interno" o "externo" como usuario.');
    }
  };

  return (
    <div className="min-h-screen w-full flex items-center justify-center relative overflow-hidden bg-[#020204]">
      
      {/* Dynamic Animated Orbs / Background */}
      <div className="absolute top-[-20%] left-[-10%] w-[1000px] h-[1000px] bg-[#611039] rounded-full blur-[200px] opacity-30 animate-pulse pointer-events-none"></div>
      <div className="absolute bottom-[-20%] right-[-10%] w-[800px] h-[800px] bg-[#0A4A60] rounded-full blur-[150px] opacity-40 pointer-events-none"></div>
      <div className="absolute top-[20%] right-[20%] w-[400px] h-[400px] bg-[#00d0c3] rounded-full blur-[180px] opacity-10 pointer-events-none animate-bounce" style={{ animationDuration: '8s' }}></div>

      <div className="w-full max-w-[1200px] h-full flex items-center z-10 relative px-8 gap-0 lg:gap-16">
        
        {/* Left Side: Branding / Identity */}
        <div className="flex-1 flex flex-col justify-center px-4 lg:px-10">
          <div className="mb-10 relative">
             <div className="absolute -inset-4 bg-gradient-to-r from-white/10 to-transparent blur-xl opacity-50 rounded-full"></div>
             <img 
               src="https://dlsinfoappsprod.blob.core.windows.net/clients-logo/SkanHawk logo.png" 
               alt="SkanHawk" 
               className="w-[420px] object-contain brightness-0 invert opacity-95 relative z-10 filter drop-shadow-[0_0_20px_rgba(255,255,255,0.4)]"
             />
          </div>
          
          <div className="pl-4 border-l-4 border-[#00d0c3]/60 mb-10">
             <h2 className="text-[18px] lg:text-[22px] font-black text-white uppercase leading-tight opacity-90 drop-shadow-md">
               Tecnología, Eficiencia e Innovación
             </h2>
             <h3 className="text-[13px] font-bold text-[#00d0c3] tracking-[0.3em] uppercase mt-2">En una sola herramienta</h3>
          </div>

          <p className="text-[14px] text-white/50 tracking-wider leading-relaxed font-light max-w-lg mb-8">
            El ecosistema definitivo para el control operativo. Accede a tu entorno seguro y gestiona todas tus operaciones en tiempo real desde un único control de mando unificado.
          </p>
        </div>

        {/* Right Side: Ultra-Premium Clean White Card */}
        <div className="w-[440px] flex items-center justify-center relative shrink-0">
          
          <div className="absolute inset-0 bg-white/5 rounded-[32px] blur-[20px] scale-105 pointer-events-none"></div>
          
          <div className="w-full bg-white rounded-[32px] p-10 lg:p-12 flex flex-col relative shadow-[0_40px_100px_rgba(0,0,0,0.8)] border border-white/20">
            
            <div className="text-center mb-10">
               <h1 className="text-[22px] font-bold tracking-[0.1em] text-gray-900 leading-tight">
                 INICIAR SESIÓN
               </h1>
               <p className="text-[12px] text-gray-500 mt-2 font-medium">Ingresa tus credenciales para continuar</p>
            </div>

            <form onSubmit={handleSubmit} className="flex flex-col gap-5 w-full">
              
              {/* Usuario Field */}
              <div className="flex flex-col gap-2 group">
                <label className="text-[12px] font-bold text-gray-700 tracking-wide uppercase transition-colors">Usuario</label>
                <div className="relative w-full">
                  <input 
                    type="text" 
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                    required
                    className="w-full bg-gray-50 border border-gray-200 rounded-xl px-12 py-3.5 text-sm text-gray-900 placeholder-gray-400 focus:outline-none focus:border-[#00d0c3] focus:ring-4 focus:ring-[#00d0c3]/10 transition-all font-medium"
                    placeholder="interno / externo"
                  />
                  <div className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 group-focus-within:text-[#0a7490] transition-colors">
                    <User size={18} />
                  </div>
                </div>
              </div>

              {/* Contraseña Field */}
              <div className="flex flex-col gap-2 mb-2 group">
                <label className="text-[12px] font-bold text-gray-700 tracking-wide uppercase transition-colors">Contraseña</label>
                <div className="relative w-full">
                  <input 
                    type={showPassword ? 'text' : 'password'}
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                    className="w-full bg-gray-50 border border-gray-200 rounded-xl px-12 py-3.5 text-sm text-gray-900 placeholder-gray-400 focus:outline-none focus:border-[#00d0c3] focus:ring-4 focus:ring-[#00d0c3]/10 transition-all font-medium font-sans"
                    placeholder="cualquier clave"
                  />
                  <div className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 group-focus-within:text-[#0a7490] transition-colors pointer-events-none">
                     <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="3" y="11" width="18" height="11" rx="2" ry="2"></rect><path d="M7 11V7a5 5 0 0 1 10 0v4"></path></svg>
                  </div>
                  <button 
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-[#00d0c3] transition-colors focus:outline-none p-1"
                  >
                    {showPassword ? <Eye size={18} /> : <EyeOff size={18} />}
                  </button>
                </div>
              </div>

              {/* Informative Hint Box for Demo */}
              <div className="bg-blue-50 text-blue-800 p-3 rounded-lg text-[11px] font-medium flex items-start gap-2 mb-1">
                 <Info size={14} className="shrink-0 mt-0.5 text-blue-600" />
                 <p><strong>Demo:</strong> Usa como usuario <span className="font-mono bg-white px-1 py-0.5 rounded border border-blue-100">interno</span> para probar el perfil de Staff, o <span className="font-mono bg-white px-1 py-0.5 rounded border border-blue-100">externo</span> para perfil Cliente. La clave puede ser cualquiera.</p>
              </div>

              {error && <p className="text-red-500 text-[11px] font-bold text-center">{error}</p>}

              {/* Submit Button */}
              <button 
                type="submit" 
                onMouseEnter={() => setIsHovered(true)}
                onMouseLeave={() => setIsHovered(false)}
                className="group w-full relative bg-[#088395] hover:bg-[#066775] text-white py-4 mt-2 rounded-xl text-[13px] font-bold tracking-[0.15em] uppercase transition-all shadow-[0_8px_20px_rgba(8,131,149,0.3)] hover:shadow-[0_12px_25px_rgba(8,131,149,0.4)] hover:-translate-y-0.5 overflow-hidden"
              >
                <div className="relative z-10 flex items-center justify-center gap-2">
                   <span>INGRESAR</span>
                   <ChevronRight size={16} strokeWidth={3} className={`transition-transform duration-300 ${isHovered ? 'translate-x-1' : ''}`} />
                </div>
              </button>
            </form>

            <div className="mt-8 pt-8 border-t border-gray-100 flex flex-col items-center gap-4">
               <a href="#" className="text-[12px] font-bold text-gray-500 hover:text-[#088395] transition-colors">¿Olvidaste tu contraseña?</a>
               
               {/* Soporte Button */}
               <button className="bg-gray-50 text-gray-400 text-[10px] font-bold uppercase tracking-widest px-4 py-2 border border-gray-200 rounded-lg hover:bg-gray-100 hover:text-[#088395] transition-colors w-fit mt-1">
                  Soporte IT
               </button>
            </div>

          </div>
        </div>
      </div>

    </div>
  );
};

export default LoginPage;
