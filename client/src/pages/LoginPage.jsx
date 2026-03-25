import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuthStore } from '@/store';
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
    <div className="min-h-screen bg-slate-50 flex font-sans text-slate-900 selection:bg-blue-100 selection:text-blue-900">
      {/* ─── LEFT PANEL — Branding ─── */}
      <div className="hidden lg:flex flex-col justify-between w-[45%] p-12 relative overflow-hidden bg-white border-r border-slate-100">
        <div className="absolute inset-0 bg-[linear-gradient(rgba(59,130,246,0.03)_1px,transparent_1px),linear-gradient(90deg,rgba(59,130,246,0.03)_1px,transparent_1px)] bg-[size:48px_48px] pointer-events-none" />
        <div className="absolute top-[-10%] left-[-10%] w-[60%] h-[60%] rounded-full bg-blue-600/5 blur-[100px] pointer-events-none" />

        <Link to="/" className="relative z-10 flex items-center gap-2.5 group w-fit">
          <div className="w-9 h-9 rounded-xl bg-blue-600 flex items-center justify-center shadow-sm group-hover:shadow-md group-hover:shadow-blue-200 transition-shadow">
            <Icons.Code size={16} className="text-white" />
          </div>
          <span className="font-display font-bold text-xl text-slate-900 tracking-tight">CodeArena</span>
        </Link>

        <div className="relative z-10">
          <h2 className="font-display font-black text-[2.5rem] leading-[1.1] text-slate-900 tracking-tight mb-5">
            deserve proof.
          </h2>
          <p className="text-slate-500 font-medium leading-relaxed max-w-[320px] mb-8">
            Access your courses, battles, and AI mentor. Continue building a portfolio that speaks for itself.
          </p>
          
          <div className="flex items-center gap-4 p-5 rounded-2xl bg-white border border-slate-100 shadow-sm">
            <div className="w-12 h-12 rounded-full bg-slate-100 flex items-center justify-center font-bold text-slate-600 text-sm">
              AS
            </div>
            <div>
              <p className="font-bold text-slate-900 text-sm">Arjun S.</p>
              <p className="text-xs text-slate-500 font-medium">14-day streak · Level 12</p>
            </div>
          </div>
        </div>

        <div className="relative z-10 flex items-center gap-8 border-t border-slate-100 pt-8 mt-12">
          <div>
            <p className="font-display font-black text-2xl text-slate-900">24.7k+</p>
            <p className="text-xs font-semibold text-slate-400">Developers</p>
          </div>
          <div className="w-px h-8 bg-slate-200" />
          <div>
            <p className="font-display font-black text-2xl text-slate-900">183k</p>
            <p className="text-xs font-semibold text-slate-400">Battles Fought</p>
          </div>
        </div>
      </div>

      {/* ─── RIGHT PANEL — Form ─── */}
      <div className={`flex-1 flex flex-col justify-center px-8 lg:px-20 relative bg-slate-50 transition-all duration-700 ${mounted ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'}`}>
        <div className="w-full max-w-md mx-auto">
          
          {/* Mobile Logo */}
          <Link to="/" className="flex items-center gap-2.5 justify-center mb-10 lg:hidden group">
            <div className="w-9 h-9 rounded-xl bg-blue-600 flex items-center justify-center shadow-sm">
              <Icons.Code size={16} className="text-white" />
            </div>
            <span className="font-display font-bold text-xl text-slate-900 tracking-tight">CodeArena</span>
          </Link>

          <div className="mb-8 text-center lg:text-left">
            <h1 className="font-display font-black text-3xl text-slate-900 mb-2">Welcome back</h1>
            <p className="text-slate-500 text-sm font-medium">Please enter your details to sign in.</p>
          </div>

          <a href="/api/auth/google" className="flex items-center justify-center gap-3 w-full py-3.5 rounded-xl bg-white border border-slate-200 hover:border-blue-200 hover:bg-blue-50 transition-all font-semibold text-slate-700 text-sm shadow-sm group mb-6">
            <svg width="18" height="18" viewBox="0 0 24 24">
              <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4"/>
              <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/>
              <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05"/>
              <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/>
            </svg>
            Sign in with Google
          </a>

          <div className="flex items-center gap-4 mb-6">
            <div className="flex-1 h-px bg-slate-200" />
            <span className="text-xs font-semibold text-slate-400 uppercase tracking-widest">Or with email</span>
            <div className="flex-1 h-px bg-slate-200" />
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-sm font-semibold text-slate-700 mb-1.5">Email address</label>
              <input
                type="email"
                placeholder="you@example.com"
                value={form.email}
                onChange={e => setForm({ ...form, email: e.target.value })}
                className={`w-full bg-white border ${errors.email ? 'border-red-300 ring-4 ring-red-50' : 'border-slate-200'} rounded-xl px-4 py-3 placeholder-slate-400 text-slate-900 focus:outline-none focus:border-blue-500 focus:ring-4 focus:ring-blue-50 transition-all text-sm`}
              />
              {errors.email && <p className="text-xs font-semibold text-red-500 mt-1.5">{errors.email}</p>}
            </div>

            <div>
              <div className="flex justify-between items-center mb-1.5">
                <label className="block text-sm font-semibold text-slate-700">Password</label>
                <Link to="/forgot-password" className="text-xs font-semibold text-blue-600 hover:text-blue-700">Forgot password?</Link>
              </div>
              <div className="relative text-slate-400 focus-within:text-blue-500">
                <input
                  type={showPw ? 'text' : 'password'}
                  placeholder="••••••••"
                  value={form.password}
                  onChange={e => setForm({ ...form, password: e.target.value })}
                  className={`w-full bg-white border ${errors.password ? 'border-red-300 ring-4 ring-red-50' : 'border-slate-200'} rounded-xl px-4 py-3 pr-10 placeholder-slate-400 text-slate-900 focus:outline-none focus:border-blue-500 focus:ring-4 focus:ring-blue-50 transition-all text-sm`}
                />
                <button
                  type="button"
                  onClick={() => setShowPw(!showPw)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 p-1 hover:bg-slate-100 rounded-md transition-colors"
                >
                  <Icons.Check size={16} className={showPw ? 'text-blue-600' : 'text-slate-400'} />
                </button>
              </div>
              {errors.password && <p className="text-xs font-semibold text-red-500 mt-1.5">{errors.password}</p>}
            </div>

            <button
              type="submit"
              disabled={isLoading}
              className="w-full flex items-center justify-center gap-2 bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-xl py-3.5 mt-2 transition-all shadow-sm hover:shadow-md hover:shadow-blue-200 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isLoading ? (
                <span className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
              ) : (
                'Sign in'
              )}
            </button>
          </form>

          <p className="text-center text-sm text-slate-500 font-medium mt-8">
            Don't have an account?{' '}
            <Link to="/register" className="text-blue-600 font-semibold hover:text-blue-700">Get started free</Link>
          </p>
        </div>
      </div>
    </div>
  );
}
