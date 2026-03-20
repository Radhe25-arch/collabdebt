import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuthStore } from '@/store';
import { Button, Input } from '@/components/ui';
import Icons from '@/assets/icons';
import toast from 'react-hot-toast';

export default function LoginPage() {
  const { login, isLoading } = useAuthStore();
  const navigate = useNavigate();
  const [form, setForm] = useState({ email: '', password: '', remember: false });
  const [errors, setErrors] = useState({});
  const [mounted, setMounted] = useState(false);
  const [showPw, setShowPw] = useState(false);

  useEffect(() => { setMounted(true); }, []);

  const validate = () => {
    const e = {};
    if (!form.email)    e.email    = 'Email is required';
    if (!form.password) e.password = 'Password is required';
    setErrors(e);
    return !Object.keys(e).length;
  };

  const handleSubmit = async (ev) => {
    ev.preventDefault();
    if (!validate()) return;
    const res = await login(form.email, form.password);
    if (res.ok) {
      toast.success('Welcome back.');
      navigate('/dashboard');
    } else {
      toast.error(res.error || 'Invalid credentials');
    }
  };

  return (
    <div className="min-h-screen bg-[#020205] flex items-center justify-center p-4 relative overflow-hidden font-sans">
      {/* ─── BACKGROUND ACCENTS ─── */}
      <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] rounded-full bg-blue-600/10 blur-[120px] pointer-events-none animate-pulse" />
      <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] rounded-full bg-arena-purple/10 blur-[120px] pointer-events-none animate-pulse" style={{ animationDelay: '1s' }} />
      <div className="absolute inset-0 bg-grid opacity-[0.03] pointer-events-none" />

      {/* ─── MAIN CARD ─── */}
      <div className={`w-full max-w-[1000px] h-[640px] bg-[#0A0A0F]/60 backdrop-blur-2xl border border-white/5 rounded-[32px] shadow-2xl flex overflow-hidden transition-all duration-1000 ${mounted ? 'opacity-100 scale-100' : 'opacity-0 scale-95'}`}>
        
        {/* LEFT: VISUAL PANEL */}
        <div className="hidden lg:flex flex-col justify-between w-[44%] p-12 bg-gradient-to-br from-blue-600/10 to-transparent border-r border-white/5 relative">
          <div className="relative z-10 flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-blue-600 to-indigo-600 flex items-center justify-center shadow-lg shadow-blue-600/20">
              <Icons.Code size={18} className="text-white" />
            </div>
            <span className="font-display font-black text-2xl tracking-tighter text-white">CodeArena</span>
          </div>

          <div className="relative z-10">
            <h2 className="font-display font-black text-4xl leading-[1.1] text-white tracking-tight mb-6">
              The Architecture <br/>
              of <span className="text-blue-500">Excellence.</span>
            </h2>
            <p className="text-slate-400 text-sm leading-relaxed max-w-[280px] mb-8">
              Join the elite league of architects mastering distributed systems and clean code.
            </p>
            
            <div className="flex items-center gap-4 p-4 rounded-2xl bg-white/5 border border-white/5 backdrop-blur-md">
              <div className="w-10 h-10 rounded-full bg-slate-800 border border-white/10 flex items-center justify-center">
                <span className="text-[10px] font-bold text-blue-400">RK</span>
              </div>
              <div>
                <p className="text-xs font-bold text-white">Rahul K.</p>
                <p className="font-mono text-[10px] text-slate-500 uppercase tracking-widest">Architect · Lvl 22</p>
              </div>
            </div>
          </div>

          <div className="relative z-10 grid grid-cols-2 gap-6 border-t border-white/5 pt-8">
            <div>
              <p className="font-display font-black text-xl text-white">48K+</p>
              <p className="font-mono text-[9px] text-slate-500 uppercase tracking-widest">Active Nodes</p>
            </div>
            <div>
              <p className="font-display font-black text-xl text-white">100%</p>
              <p className="font-mono text-[9px] text-slate-500 uppercase tracking-widest">Open Source</p>
            </div>
          </div>
        </div>

        {/* RIGHT: FORM PANEL */}
        <div className="flex-1 flex flex-col justify-center px-12 lg:px-16 py-12 relative">
          <div className="mb-10 text-center lg:text-left">
            <h1 className="font-display font-black text-4xl text-white mb-2 tracking-tight">Login.</h1>
            <p className="text-slate-500 text-sm font-medium">Continue your streak on the core network.</p>
          </div>

          {/* Social login option */}
          <div className="flex gap-3 mb-8">
            <a href="/api/auth/google" className="flex-1 flex items-center justify-center gap-3 py-3 rounded-xl bg-white/5 border border-white/5 hover:bg-white/10 hover:border-white/10 transition-all group">
              <svg width="18" height="18" viewBox="0 0 24 24">
                <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4"/>
                <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/>
                <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05"/>
                <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/>
              </svg>
              <span className="text-xs font-bold text-slate-300">Google Account</span>
            </a>
            <button className="w-12 h-12 flex items-center justify-center rounded-xl bg-white/5 border border-white/5 hover:bg-white/10 transition-all">
              <Icons.Github size={18} className="text-slate-400" />
            </button>
          </div>

          <div className="relative flex items-center gap-4 mb-8">
            <div className="flex-1 h-px bg-white/5" />
            <span className="font-mono text-[9px] text-slate-600 uppercase tracking-[0.2em]">OR LOGIN WITH</span>
            <div className="flex-1 h-px bg-white/5" />
          </div>

          <form onSubmit={handleSubmit} className="space-y-5">
            <div className="space-y-2">
              <label className="text-[10px] font-bold text-slate-500 uppercase tracking-widest pl-1">Identifier</label>
              <div className="relative group">
                <input
                  type="email"
                  placeholder="name@domain.com"
                  className={`w-full bg-white/3 border ${errors.email ? 'border-red-500/40' : 'border-white/5'} hover:border-white/10 focus:border-blue-500/50 rounded-xl py-3 px-4 font-mono text-xs text-white outline-none transition-all placeholder:text-slate-700`}
                  value={form.email}
                  onChange={e => setForm({ ...form, email: e.target.value })}
                />
                {errors.email && <Icons.AlertCircle size={14} className="absolute right-3 top-1/2 -translate-y-1/2 text-red-500" />}
              </div>
            </div>

            <div className="space-y-2">
              <div className="flex justify-between items-center pl-1">
                <label className="text-[10px] font-bold text-slate-500 uppercase tracking-widest">Secret Key</label>
                <Link to="/forgot-password" title="password reset" className="text-[10px] font-bold text-blue-500 hover:text-blue-400 transition-colors">FORGOT?</Link>
              </div>
              <div className="relative group">
                <input
                  type={showPw ? 'text' : 'password'}
                  placeholder="••••••••"
                  className={`w-full bg-white/3 border ${errors.password ? 'border-red-500/40' : 'border-white/5'} hover:border-white/10 focus:border-blue-500/50 rounded-xl py-3 px-4 font-mono text-xs text-white outline-none transition-all placeholder:text-slate-700`}
                  value={form.password}
                  onChange={e => setForm({ ...form, password: e.target.value })}
                />
                <button 
                  type="button" 
                  onClick={() => setShowPw(!showPw)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-600 hover:text-slate-300 transition-colors"
                >
                  {showPw ? <Icons.EyeOff size={14} /> : <Icons.Eye size={14} />}
                </button>
              </div>
            </div>

            <Button type="submit" variant="primary" className="w-full py-4 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-black uppercase tracking-widest text-[11px] shadow-lg shadow-blue-600/20" loading={isLoading}>
              Establish Connection
            </Button>
          </form>

          <p className="text-center mt-10 text-[11px] font-medium text-slate-500">
            Node unregistered? <Link to="/register" className="text-white font-black hover:text-blue-400 transition-colors">CREATE ACCOUNT →</Link>
          </p>
        </div>
      </div>
    </div>
  );
}
