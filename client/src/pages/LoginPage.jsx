import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuthStore } from '@/store';
import { Button, Input } from '@/components/ui';
import { GlassPanel } from '@/components/landing/Primitives';
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
    <div className="min-h-screen bg-[#08080C] flex overflow-hidden relative selection:bg-neon-teal/30 selection:text-neon-teal">
      
      {/* Background Ambience */}
      <div className="absolute inset-0 bg-[#08080C] -z-20" />
      <div className="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.03)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.03)_1px,transparent_1px)] bg-[size:64px_64px] [mask-image:radial-gradient(ellipse_at_center,black_40%,transparent_80%)] -z-10 pointer-events-none" opacity="0.4" />
      <div className="absolute top-[-20%] left-[-10%] w-[50%] h-[50%] rounded-full bg-neon-purple/10 blur-[120px] pointer-events-none -z-10" />
      <div className="absolute bottom-[-20%] right-[-10%] w-[40%] h-[40%] rounded-full bg-neon-teal/10 blur-[100px] pointer-events-none -z-10" />

      {/* ─── LEFT PANEL — Branding ─── */}
      <div className="hidden lg:flex flex-col justify-between w-[46%] p-12 relative overflow-hidden border-r border-white/5 bg-black/20 backdrop-blur-xl">
        {/* Logo */}
        <div className="relative z-10 flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-neon-teal/10 border border-neon-teal/30 flex items-center justify-center glow-purple">
            <Icons.Code size={20} className="text-neon-teal" />
          </div>
          <span className="font-display font-black text-2xl text-white tracking-tight uppercase italic">CodeArena</span>
        </div>

        {/* Center quote */}
        <div className="relative z-10">
          <p className="font-display font-black text-5xl leading-[1.1] text-white mb-6 uppercase tracking-tighter" style={{ letterSpacing: '-1.5px' }}>
            Initialize<br />
            <span className="text-neon-teal drop-shadow-[0_0_15px_rgba(0,245,212,0.4)]">Session Sequence</span>
          </p>
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-neon-purple/20 border border-neon-purple/50 flex items-center justify-center">
              <span className="font-mono text-xs text-neon-purple font-bold tracking-widest">RANK</span>
            </div>
            <div>
              <p className="font-semibold text-sm text-white uppercase tracking-widest">Active Node</p>
              <p className="font-mono text-[10px] text-slate-400 uppercase tracking-widest">Global Ranking · Level 42 · Master</p>
            </div>
          </div>
        </div>

        {/* Bottom stats */}
        <div className="relative z-10 grid grid-cols-3 gap-4">
          {[
            { v: '48k+', l: 'Developers' },
            { v: '127',  l: 'Free Courses' },
            { v: '100%', l: 'Always Free' },
          ].map(({ v, l }) => (
            <div key={l}>
              <p className="font-display font-black text-2xl text-white drop-shadow-[0_0_10px_rgba(255,255,255,0.2)]">{v}</p>
              <p className="font-mono text-[10px] text-slate-500 tracking-widest uppercase">{l}</p>
            </div>
          ))}
        </div>
      </div>

      {/* ─── RIGHT PANEL — Form ─── */}
      <div className={`flex-1 flex items-center justify-center px-6 py-12 transition-all duration-700 ${mounted ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'}`}>
        <div className="w-full max-w-md">

          {/* Mobile logo only */}
          <div className="flex items-center gap-3 justify-center mb-10 lg:hidden">
            <div className="w-10 h-10 rounded-xl bg-neon-teal/10 border border-neon-teal/30 flex items-center justify-center">
              <Icons.Code size={20} className="text-neon-teal" />
            </div>
            <span className="font-display font-black text-2xl text-white tracking-tight uppercase italic">CodeArena</span>
          </div>

          <div className="mb-10 text-center lg:text-left">
            <h1 className="font-display font-black text-4xl text-white mb-2 uppercase tracking-tight">
              Access Terminal
            </h1>
            <p className="text-slate-400 font-mono text-xs uppercase tracking-widest">Authenticate to access the arena.</p>
          </div>

          {/* Google OAuth */}
          <a href="/api/auth/google"
            className="w-full flex items-center justify-center gap-3 bg-white/5 hover:bg-white/10 border border-white/10 hover:border-neon-teal/50 rounded-xl py-4 transition-all duration-300 mb-8 group relative overflow-hidden">
            <div className="absolute inset-0 bg-neon-teal/5 opacity-0 group-hover:opacity-100 transition-opacity" />
            <svg width="18" height="18" viewBox="0 0 24 24">
              <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4"/>
              <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/>
              <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05"/>
              <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/>
            </svg>
            <span className="font-mono text-xs font-bold text-slate-300 group-hover:text-white transition-colors uppercase tracking-widest relative z-10">Continue with Google</span>
          </a>

          {/* Divider */}
          <div className="relative flex items-center gap-4 mb-8">
            <div className="flex-1 h-px bg-white/10" />
            <span className="font-mono text-[10px] text-slate-500 uppercase tracking-widest">Or Manual Auth</span>
            <div className="flex-1 h-px bg-white/10" />
          </div>

          {/* Email/password form */}
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block font-mono text-[10px] text-slate-400 uppercase tracking-widest mb-2">Email Address</label>
              <div className="relative">
                <input
                  type="email"
                  placeholder="admin@codearena.com"
                  value={form.email}
                  onChange={e => setForm({ ...form, email: e.target.value })}
                  className={`w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3.5 text-white placeholder-slate-600 focus:outline-none focus:border-neon-teal focus:ring-1 focus:ring-neon-teal transition-all font-mono text-sm ${errors.email ? 'border-red-500/50' : ''}`}
                />
                {errors.email && <p className="text-red-400 text-[10px] font-mono mt-2 uppercase tracking-widest">{errors.email}</p>}
              </div>
            </div>

            <div>
              <div className="flex items-center justify-between mb-2">
                <label className="block font-mono text-[10px] text-slate-400 uppercase tracking-widest" style={{ margin: 0 }}>Access Key</label>
                <Link to="/forgot-password" className="font-mono text-[10px] text-slate-500 hover:text-neon-teal transition-colors tracking-widest uppercase">
                  Reset Key?
                </Link>
              </div>
              <div className="relative">
                <input
                  type={showPw ? 'text' : 'password'}
                  placeholder="••••••••••••"
                  value={form.password}
                  onChange={e => setForm({ ...form, password: e.target.value })}
                  className={`w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3.5 text-white placeholder-slate-600 focus:outline-none focus:border-neon-teal focus:ring-1 focus:ring-neon-teal transition-all font-mono text-sm pr-10 ${errors.password ? 'border-red-500/50' : ''}`}
                />
                <button
                  type="button"
                  onClick={() => setShowPw(v => !v)}
                  className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-500 hover:text-white transition-colors"
                >
                  {showPw
                    ? <Icons.Check size={14} />
                    : <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/><circle cx="12" cy="12" r="3"/></svg>
                  }
                </button>
                {errors.password && <p className="text-red-400 text-[10px] font-mono mt-2 uppercase tracking-widest">{errors.password}</p>}
              </div>
            </div>

            <label className="flex items-center gap-3 cursor-pointer select-none pt-2">
              <div
                onClick={() => setForm({ ...form, remember: !form.remember })}
                className={`w-5 h-5 rounded border flex items-center justify-center transition-all ${form.remember ? 'bg-neon-teal border-neon-teal' : 'border-white/20 hover:border-neon-teal/60 bg-white/5'}`}
              >
                {form.remember && <Icons.Check size={12} className="text-black font-bold" />}
              </div>
              <span className="font-mono text-[10px] uppercase tracking-widest text-slate-400">Maintain Session</span>
            </label>

            <button type="submit" disabled={isLoading} className="w-full py-4 mt-6 bg-neon-purple text-white font-black text-xs uppercase tracking-widest flex items-center justify-center gap-2 rounded-xl shadow-[0_0_20px_rgba(155,93,229,0.3)] hover:scale-[1.02] hover:bg-neon-purple/90 transition-all disabled:opacity-50 disabled:cursor-not-allowed">
              {isLoading ? <span className="animate-spin w-4 h-4 border-2 border-white/20 border-t-white rounded-full"></span> : <><Icons.Terminal size={16} /> Execute Login</>}
            </button>
          </form>

          <p className="text-center mt-10 font-mono text-[10px] text-slate-500 uppercase tracking-widest">
            Don't have an access key?{' '}
            <Link to="/register" className="text-neon-teal hover:text-white transition-colors font-bold ml-1">
              Initialize Node
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}
