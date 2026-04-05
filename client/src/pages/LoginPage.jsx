import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuthStore } from '@/store';
import { Code, Eye, EyeOff } from 'lucide-react';
import { Spinner } from '@/components/ui';
import toast from 'react-hot-toast';

export default function LoginPage() {
  const { login, isLoading } = useAuthStore();
  const navigate = useNavigate();
  const [form, setForm]     = useState({ email: '', password: '' });
  const [errors, setErrors] = useState({});
  const [showPw, setShowPw] = useState(false);
  const [mounted, setMounted] = useState(false);

  useEffect(() => { setMounted(true); }, []);

  const validate = () => {
    const e = {};
    if (!form.email)    e.email    = 'EMAIL REQUIRED';
    if (!form.password) e.password = 'PASSWORD REQUIRED';
    setErrors(e);
    return !Object.keys(e).length;
  };

  const handleSubmit = async (ev) => {
    ev.preventDefault();
    if (!validate()) return;
    const res = await login(form.email, form.password);
    if (res.ok) { toast.success('ACCESS GRANTED'); navigate('/dashboard'); }
    else toast.error(res.error || 'INVALID CREDENTIALS');
  };

  return (
    <div className="min-h-screen bg-black flex font-sans text-white">

      {/* ─── LEFT PANEL ─── */}
      <div
        className="hidden lg:flex flex-col justify-between w-[44%] p-12 relative overflow-hidden bg-grid"
        style={{ borderRight: '1px solid rgba(255,255,255,0.06)' }}
      >
        {/* Accent line */}
        <div className="absolute top-0 left-0 right-0 h-px bg-cyber/30" />

        {/* Logo */}
        <Link to="/" className="flex items-center gap-3 group">
          <div className="w-8 h-8 rounded-[4px] border border-cyber/30 flex items-center justify-center">
            <Code size={14} strokeWidth={1.5} className="text-cyber" />
          </div>
          <span className="font-mono font-black text-sm text-white tracking-[0.15em] uppercase">SkillForge</span>
        </Link>

        {/* Hero */}
        <div>
          <p className="font-mono text-[10px] font-black text-[#333] uppercase tracking-[0.25em] mb-4">
            OPERATOR AUTHENTICATION
          </p>
          <h2 className="font-black text-4xl text-white leading-[1.05] tracking-tight mb-6">
            DESERVE<br />PROOF.
          </h2>
          <p className="text-[#555] text-sm leading-relaxed max-w-xs mb-10">
            Access your courses, battle arena, and AI mentor. Build a portfolio that speaks for itself.
          </p>

          {/* Testimonial blade */}
          <div
            className="p-4 rounded-[4px]"
            style={{ border: '1px solid rgba(255,255,255,0.06)', background: 'rgba(255,255,255,0.02)' }}
          >
            <div className="flex items-center gap-3 mb-3">
              <div
                className="w-9 h-9 rounded-[4px] border border-white/10 flex items-center justify-center font-mono font-black text-sm"
                style={{ background: 'linear-gradient(135deg, hsl(220,50%,20%), hsl(240,40%,15%))' }}
              >
                AS
              </div>
              <div>
                <p className="font-mono text-[11px] font-black text-white uppercase">ARJUN S.</p>
                <p className="font-mono text-[9px] font-bold text-[#555] uppercase tracking-wider">14-DAY STREAK · LEVEL 12</p>
              </div>
            </div>
            <p className="text-[#666] text-xs leading-relaxed italic">
              "SkillForge turned my job hunt around in 3 months. Nothing else comes close."
            </p>
          </div>
        </div>

        {/* Stats */}
        <div className="flex items-center gap-8 pt-8" style={{ borderTop: '1px solid rgba(255,255,255,0.06)' }}>
          {[['24.7K+', 'DEVELOPERS'], ['183K', 'BATTLES FOUGHT']].map(([val, lbl]) => (
            <div key={lbl}>
              <p className="font-mono font-black text-2xl text-white">{val}</p>
              <p className="font-mono text-[9px] font-bold text-[#444] uppercase tracking-[0.2em] mt-0.5">{lbl}</p>
            </div>
          ))}
        </div>
      </div>

      {/* ─── RIGHT PANEL — Form ─── */}
      <div
        className={`flex-1 flex flex-col justify-center px-8 lg:px-16 transition-all duration-500 ${mounted ? 'opacity-100' : 'opacity-0'}`}
        style={{ background: '#000' }}
      >
        <div className="w-full max-w-md mx-auto">

          {/* Mobile Logo */}
          <Link to="/" className="flex items-center gap-3 justify-center mb-12 lg:hidden">
            <div className="w-8 h-8 rounded-[4px] border border-cyber/30 flex items-center justify-center">
              <Code size={14} strokeWidth={1.5} className="text-cyber" />
            </div>
            <span className="font-mono font-black text-sm text-white tracking-[0.15em] uppercase">SkillForge</span>
          </Link>

          <div className="mb-8">
            <h1 className="font-black text-3xl text-white tracking-tight mb-2 uppercase">SIGN IN</h1>
            <p className="text-[#555] text-sm">Enter your credentials to access the platform.</p>
          </div>

          {/* Google */}
          <a
            href="/api/auth/google"
            className="flex items-center justify-center gap-3 w-full py-3 rounded-[4px] border border-white/[0.08] bg-white/[0.02] hover:border-white/20 hover:bg-white/[0.04] transition-all duration-150 font-mono text-[11px] font-bold text-white uppercase tracking-wider mb-6"
          >
            <svg width="16" height="16" viewBox="0 0 24 24">
              <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4"/>
              <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/>
              <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05"/>
              <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/>
            </svg>
            CONTINUE WITH GOOGLE
          </a>

          <div className="flex items-center gap-3 mb-6">
            <div className="flex-1 h-px bg-white/[0.06]" />
            <span className="font-mono text-[9px] font-bold text-[#333] uppercase tracking-[0.15em]">OR WITH EMAIL</span>
            <div className="flex-1 h-px bg-white/[0.06]" />
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="font-mono text-[10px] font-black text-[#666] uppercase tracking-[0.15em] block mb-1.5">
                EMAIL ADDRESS
              </label>
              <input
                type="email"
                placeholder="operator@example.com"
                value={form.email}
                onChange={e => setForm({ ...form, email: e.target.value })}
                className={`w-full bg-white/[0.03] border rounded-[4px] px-4 py-3 text-white placeholder:text-[#333] focus:outline-none focus:border-cyber transition-all duration-150 text-sm font-sans ${errors.email ? 'border-crimson' : 'border-white/[0.08]'}`}
              />
              {errors.email && <p className="font-mono text-[10px] text-crimson mt-1.5 uppercase tracking-wider">{errors.email}</p>}
            </div>

            <div>
              <div className="flex justify-between items-center mb-1.5">
                <label className="font-mono text-[10px] font-black text-[#666] uppercase tracking-[0.15em]">
                  PASSWORD
                </label>
                <Link to="/forgot-password" className="font-mono text-[10px] font-bold text-cyber hover:text-white transition-colors uppercase tracking-wider">
                  FORGOT?
                </Link>
              </div>
              <div className="relative">
                <input
                  type={showPw ? 'text' : 'password'}
                  placeholder="••••••••"
                  value={form.password}
                  onChange={e => setForm({ ...form, password: e.target.value })}
                  className={`w-full bg-white/[0.03] border rounded-[4px] px-4 py-3 pr-11 text-white placeholder:text-[#333] focus:outline-none focus:border-cyber transition-all duration-150 text-sm font-sans ${errors.password ? 'border-crimson' : 'border-white/[0.08]'}`}
                />
                <button
                  type="button"
                  onClick={() => setShowPw(v => !v)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-[#444] hover:text-white transition-colors p-1"
                >
                  {showPw ? <EyeOff size={15} strokeWidth={1.5} /> : <Eye size={15} strokeWidth={1.5} />}
                </button>
              </div>
              {errors.password && <p className="font-mono text-[10px] text-crimson mt-1.5 uppercase tracking-wider">{errors.password}</p>}
            </div>

            <button
              type="submit"
              disabled={isLoading}
              className="w-full btn-primary py-3.5 text-xs justify-center mt-2 disabled:opacity-50"
            >
              {isLoading ? <Spinner size={14} className="text-white" /> : 'AUTHENTICATE'}
            </button>
          </form>

          <p className="text-center text-sm text-[#444] mt-8">
            No account?{' '}
            <Link to="/register" className="font-mono text-xs font-bold text-cyber hover:text-white transition-colors uppercase tracking-wider">
              CREATE ONE FREE
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}
