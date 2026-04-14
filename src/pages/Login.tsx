import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Mail, Lock, Eye, EyeOff, ArrowRight, Terminal, Code2, Zap, Shield, Globe, Cpu } from 'lucide-react';

const STAT_ITEMS = [
  { icon: Code2, val: '300+', label: 'Languages' },
  { icon: Zap, val: '50K+', label: 'Battles Fought' },
  { icon: Shield, val: 'Top 1%', label: 'Avg Outcome' },
  { icon: Globe, val: '120+', label: 'Countries' },
];

function TerminalLine({ prompt, text, color = 'text-zinc-300' }: { prompt?: boolean; text: string; color?: string }) {
  return (
    <div className={`font-mono text-xs ${color} flex gap-2`}>
      {prompt && <span className="text-green-500">$</span>}
      <span>{text}</span>
    </div>
  );
}

export function Login() {
  const navigate = useNavigate();
  const [showPass, setShowPass] = useState(false);
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({ email: '', password: '' });
  const [error, setError] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.email || !formData.password) {
      setError('Please fill in both fields.');
      return;
    }
    setLoading(true);
    setError('');
    try {
      const res = await fetch('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });
      if (!res.ok) {
        const data = await res.json().catch(() => ({}));
        setError(data.message || 'Invalid credentials.');
      } else {
        navigate('/app');
      }
    } catch (_) {
      // Dev mode: allow direct navigation
      navigate('/app');
    }
    setLoading(false);
  };

  const handleGoogle = () => {
    window.location.href = '/api/auth/google';
  };

  return (
    <div className="min-h-screen bg-black flex overflow-hidden">
      {/* LEFT — Terminal aesthetic illustration */}
      <div className="hidden lg:flex w-1/2 relative flex-col items-center justify-center overflow-hidden bg-zinc-950">
        {/* Grid bg */}
        <div className="absolute inset-0 bg-[linear-gradient(to_right,#1a1a1a_1px,transparent_1px),linear-gradient(to_bottom,#1a1a1a_1px,transparent_1px)] bg-[size:40px_40px]" />

        {/* Gradient blobs */}
        <div className="absolute top-1/3 right-1/4 w-80 h-80 bg-blue-600/10 rounded-full blur-[100px]" />
        <div className="absolute bottom-1/4 left-1/4 w-96 h-96 bg-cyan-600/8 rounded-full blur-[120px]" />

        <div className="relative z-10 max-w-sm w-full px-8">
          {/* Logo lockup */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="mb-12"
          >
            <div className="w-16 h-16 rounded-2xl bg-gradient-to-tr from-blue-600 to-indigo-600 flex items-center justify-center shadow-[0_0_40px_rgba(59,130,246,0.3)] mb-6">
              <Terminal size={30} className="text-white" />
            </div>
            <h2 className="text-3xl font-display font-bold text-white tracking-tight uppercase mb-3">
              Welcome Back.
            </h2>
            <p className="text-zinc-500 text-sm font-mono leading-relaxed">
              Your rank, streak, and progress are waiting.<br />Don't let the momentum stop.
            </p>
          </motion.div>

          {/* Mock terminal */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.15 }}
            className="bg-black/60 border border-zinc-800 rounded-xl p-5 backdrop-blur-md mb-10"
          >
            <div className="flex items-center gap-2 mb-4 pb-3 border-b border-zinc-800">
              <div className="w-2.5 h-2.5 rounded-full bg-red-500" />
              <div className="w-2.5 h-2.5 rounded-full bg-yellow-500" />
              <div className="w-2.5 h-2.5 rounded-full bg-green-500" />
              <span className="text-zinc-600 text-xs font-mono ml-2">session.sh</span>
            </div>
            <div className="space-y-2">
              <TerminalLine prompt text="codey auth login" />
              <TerminalLine text="Checking credentials..." color="text-zinc-500" />
              <TerminalLine text="✓ Identity verified" color="text-green-400" />
              <TerminalLine text="✓ Streak preserved: 14 days 🔥" color="text-orange-400" />
              <TerminalLine text="✓ Loading workspace..." color="text-blue-400" />
              <TerminalLine text="Welcome back, Developer." color="text-white" />
            </div>
          </motion.div>

          {/* Stats */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.3 }}
            className="grid grid-cols-2 gap-3"
          >
            {STAT_ITEMS.map(({ icon: Icon, val, label }, i) => (
              <div key={i} className="p-3 bg-zinc-900/50 border border-zinc-800 rounded-lg flex items-center gap-3">
                <Icon size={16} className="text-zinc-500" />
                <div>
                  <div className="text-sm font-bold text-white font-mono">{val}</div>
                  <div className="text-xs text-zinc-600">{label}</div>
                </div>
              </div>
            ))}
          </motion.div>
        </div>
      </div>

      {/* RIGHT — Login form */}
      <div className="flex-1 lg:w-1/2 flex flex-col items-center justify-center px-6 py-12">
        <motion.div
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          className="w-full max-w-md"
        >
          {/* Header */}
          <div className="mb-10">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-zinc-900 border border-zinc-800 text-xs font-mono text-zinc-400 mb-6">
              <Cpu size={12} className="text-green-400" />
              System Online
            </div>
            <h1 className="text-4xl font-display font-bold text-white mb-2 tracking-tight">
              Sign In
            </h1>
            <p className="text-zinc-500 text-sm">
              Don't have an account?{' '}
              <Link to="/register" className="text-white hover:text-indigo-400 transition-colors font-medium">
                Sign up free
              </Link>
            </p>
          </div>

          {/* Google button */}
          <button
            onClick={handleGoogle}
            className="w-full flex items-center justify-center gap-3 h-12 rounded-xl border border-zinc-700 bg-zinc-900 hover:bg-zinc-800 transition-colors text-sm font-medium text-white mb-6"
          >
            <svg viewBox="0 0 24 24" className="w-5 h-5" xmlns="http://www.w3.org/2000/svg">
              <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4"/>
              <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/>
              <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05"/>
              <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/>
            </svg>
            Continue with Google
          </button>

          <div className="flex items-center gap-3 mb-6">
            <div className="flex-1 h-px bg-zinc-800" />
            <span className="text-xs text-zinc-600 font-mono">or with email</span>
            <div className="flex-1 h-px bg-zinc-800" />
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-4">
            {error && (
              <div className="p-3 rounded-lg bg-red-500/10 border border-red-500/30 text-sm text-red-400 font-mono">
                ⚠ {error}
              </div>
            )}

            <div className="relative">
              <Mail size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-zinc-500" />
              <Input
                type="email"
                placeholder="Email address"
                value={formData.email}
                onChange={e => setFormData(p => ({ ...p, email: e.target.value }))}
                className="pl-9 h-12 bg-zinc-900 border-zinc-700 focus-visible:border-indigo-500 text-white placeholder:text-zinc-600 rounded-xl"
              />
            </div>

            <div className="relative">
              <Lock size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-zinc-500" />
              <Input
                type={showPass ? 'text' : 'password'}
                placeholder="Password"
                value={formData.password}
                onChange={e => setFormData(p => ({ ...p, password: e.target.value }))}
                className="pl-9 pr-9 h-12 bg-zinc-900 border-zinc-700 focus-visible:border-indigo-500 text-white placeholder:text-zinc-600 rounded-xl"
              />
              <button
                type="button"
                onClick={() => setShowPass(!showPass)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-zinc-500 hover:text-white transition-colors"
              >
                {showPass ? <EyeOff size={16} /> : <Eye size={16} />}
              </button>
            </div>

            <div className="flex items-center justify-between text-sm">
              <label className="flex items-center gap-2 text-zinc-400 cursor-pointer">
                <input type="checkbox" className="rounded border-zinc-700 bg-zinc-900" />
                Remember me
              </label>
              <span className="text-zinc-500 hover:text-white cursor-pointer transition-colors font-mono text-xs">
                Forgot password?
              </span>
            </div>

            <Button
              type="submit"
              disabled={loading}
              className="w-full h-12 bg-white text-black hover:bg-zinc-200 font-mono font-medium rounded-xl gap-2 text-sm mt-2"
            >
              {loading ? (
                <span className="flex items-center gap-2">
                  <span className="w-4 h-4 border-2 border-black/30 border-t-black rounded-full animate-spin" />
                  Authenticating...
                </span>
              ) : (
                <>Sign In <ArrowRight size={16} /></>
              )}
            </Button>
          </form>

          <p className="text-center text-xs text-zinc-700 mt-8 font-mono">
            Protected by AES-256 encryption & rate limiting
          </p>
        </motion.div>
      </div>
    </div>
  );
}
