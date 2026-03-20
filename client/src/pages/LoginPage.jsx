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
    <div className="min-h-screen bg-arena-bg flex overflow-hidden">

      {/* ─── LEFT PANEL — Branding ─── */}
      <div className="hidden lg:flex flex-col justify-between w-[46%] bg-arena-bg2 border-r border-arena-border p-12 relative overflow-hidden">
        {/* Subtle grid */}
        <div className="absolute inset-0 bg-grid opacity-40 pointer-events-none" />
        {/* Glow blob */}
        <div className="absolute top-[-20%] left-[-20%] w-[70%] h-[70%] rounded-full bg-arena-purple/10 blur-[100px] pointer-events-none" />
        <div className="absolute bottom-[-10%] right-[-10%] w-[50%] h-[50%] rounded-full bg-arena-teal/6 blur-[80px] pointer-events-none" />

        {/* Logo */}
        <div className="relative z-10 flex items-center gap-3">
          <div className="w-9 h-9 rounded-xl bg-purple-teal flex items-center justify-center glow-purple">
            <Icons.Code size={17} className="text-white" />
          </div>
          <span className="font-display font-black text-xl text-gradient tracking-tight">SkillForge</span>
        </div>

        {/* Center quote */}
        <div className="relative z-10">
          <p className="font-display font-black text-4xl leading-tight text-arena-text mb-6" style={{ letterSpacing: '-1.5px' }}>
            "The only dev platform where your rank is earned,<br />
            <span className="text-gradient">never purchased."</span>
          </p>
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-full bg-arena-purple/20 border border-arena-border flex items-center justify-center">
              <span className="font-mono text-xs text-arena-purple2">RK</span>
            </div>
            <div>
              <p className="font-semibold text-sm text-arena-text">Rahul K.</p>
              <p className="font-mono text-xs text-arena-dim">Frontend Dev · Level 22 · JavaScript</p>
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
              <p className="font-display font-black text-2xl text-gradient">{v}</p>
              <p className="font-mono text-xs text-arena-dim tracking-wide">{l}</p>
            </div>
          ))}
        </div>
      </div>

      {/* ─── RIGHT PANEL — Form ─── */}
      <div className={`flex-1 flex items-center justify-center px-6 py-12 transition-all duration-700 ${mounted ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'}`}>
        <div className="w-full max-w-md">

          {/* Mobile logo only */}
          <div className="flex items-center gap-2.5 justify-center mb-10 lg:hidden">
            <div className="w-8 h-8 rounded-xl bg-purple-teal flex items-center justify-center">
              <Icons.Code size={15} className="text-white" />
            </div>
            <span className="font-display font-black text-xl text-gradient tracking-tight">CodeArena</span>
          </div>

          <div className="mb-8">
            <h1 className="font-display font-black text-3xl text-arena-text mb-2" style={{ letterSpacing: '-1px' }}>
              Welcome back
            </h1>
            <p className="text-arena-muted text-sm">Sign in to continue your learning streak.</p>
          </div>

          {/* Google OAuth */}
          <a href="/api/auth/google"
            className="w-full flex items-center justify-center gap-3 bg-arena-bg2 hover:bg-arena-bg3 border border-arena-border hover:border-arena-purple/40 rounded-xl py-3.5 transition-all duration-200 mb-6 group">
            <svg width="18" height="18" viewBox="0 0 24 24">
              <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4"/>
              <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/>
              <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05"/>
              <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/>
            </svg>
            <span className="font-body text-sm font-medium text-arena-muted group-hover:text-arena-text transition-colors">Continue with Google</span>
          </a>

          {/* Divider */}
          <div className="relative flex items-center gap-4 mb-6">
            <div className="flex-1 h-px bg-arena-border/50" />
            <span className="font-mono text-xs text-arena-dim uppercase tracking-widest">or</span>
            <div className="flex-1 h-px bg-arena-border/50" />
          </div>

          {/* Email/password form */}
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="arena-label">Email address</label>
              <div className="relative">
                <input
                  type="email"
                  placeholder="you@example.com"
                  value={form.email}
                  onChange={e => setForm({ ...form, email: e.target.value })}
                  className={`arena-input ${errors.email ? 'border-red-500/50' : ''}`}
                />
                {errors.email && <p className="text-red-400 text-xs font-mono mt-1">{errors.email}</p>}
              </div>
            </div>

            <div>
              <div className="flex items-center justify-between mb-1">
                <label className="arena-label" style={{ margin: 0 }}>Password</label>
                <Link to="/forgot-password" className="font-mono text-xs text-arena-dim hover:text-arena-teal transition-colors">
                  Forgot password?
                </Link>
              </div>
              <div className="relative">
                <input
                  type={showPw ? 'text' : 'password'}
                  placeholder="••••••••"
                  value={form.password}
                  onChange={e => setForm({ ...form, password: e.target.value })}
                  className={`arena-input pr-10 ${errors.password ? 'border-red-500/50' : ''}`}
                />
                <button
                  type="button"
                  onClick={() => setShowPw(v => !v)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-arena-dim hover:text-arena-muted transition-colors"
                >
                  {showPw
                    ? <Icons.Check size={14} />
                    : <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/><circle cx="12" cy="12" r="3"/></svg>
                  }
                </button>
                {errors.password && <p className="text-red-400 text-xs font-mono mt-1">{errors.password}</p>}
              </div>
            </div>

            <label className="flex items-center gap-2.5 cursor-pointer select-none pt-1">
              <div
                onClick={() => setForm({ ...form, remember: !form.remember })}
                className={`w-4 h-4 rounded border flex items-center justify-center transition-all ${form.remember ? 'bg-arena-purple border-arena-purple' : 'border-arena-border/60 hover:border-arena-purple/60'}`}
              >
                {form.remember && <Icons.Check size={10} className="text-white" />}
              </div>
              <span className="font-mono text-xs text-arena-muted">Keep me signed in</span>
            </label>

            <Button type="submit" variant="primary" className="w-full py-3.5 text-sm mt-2" loading={isLoading}>
              <Icons.ArrowRight size={15} /> Sign In
            </Button>
          </form>

          <p className="text-center mt-8 font-mono text-xs text-arena-dim">
            Don't have an account?{' '}
            <Link to="/register" className="text-arena-purple2 hover:text-arena-teal transition-colors font-semibold">
              Create one free
            </Link>
          </p>

          <p className="text-center mt-6 font-mono text-xs text-arena-dim opacity-40">
            By signing in you agree to our Terms & Privacy Policy.
          </p>
        </div>
      </div>
    </div>
  );
}
