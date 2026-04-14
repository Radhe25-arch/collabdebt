import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import {
  ArrowRight, ArrowLeft, Check, Code2, Terminal, Zap, Trophy,
  User, Mail, Lock, Eye, EyeOff, Cpu, Globe, Shield, Target,
  BookOpen, Layers, Database, Smartphone
} from 'lucide-react';

const STEPS = [
  { id: 1, title: "Create Account", subtitle: "Start your journey" },
  { id: 2, title: "Your Role", subtitle: "How do you identify?" },
  { id: 3, title: "Experience Level", subtitle: "Where are you now?" },
  { id: 4, title: "Your Goals", subtitle: "What do you want to achieve?" },
  { id: 5, title: "Your Stack", subtitle: "What do you love to build with?" },
];

const ROLES = [
  { id: 'student', label: 'Student', icon: BookOpen, desc: 'Currently learning' },
  { id: 'professional', label: 'Professional', icon: Cpu, desc: 'Working developer' },
  { id: 'educator', label: 'Educator', icon: Layers, desc: 'Teach & mentor others' },
  { id: 'switcher', label: 'Career Switcher', icon: Target, desc: 'Transitioning into tech' },
];

const LEVELS = [
  { id: 'beginner', label: 'Beginner', desc: '< 1 year', color: 'from-green-500/20 to-emerald-500/5' },
  { id: 'intermediate', label: 'Intermediate', desc: '1–3 years', color: 'from-blue-500/20 to-cyan-500/5' },
  { id: 'advanced', label: 'Advanced', desc: '3–6 years', color: 'from-purple-500/20 to-violet-500/5' },
  { id: 'expert', label: 'Expert', desc: '6+ years', color: 'from-yellow-500/20 to-orange-500/5' },
];

const GOALS = [
  { id: 'hired', label: 'Get Hired', icon: Target },
  { id: 'level-up', label: 'Level Up', icon: Zap },
  { id: 'compete', label: 'Compete', icon: Trophy },
  { id: 'build', label: 'Build Projects', icon: Globe },
  { id: 'contrib', label: 'Open Source', icon: Code2 },
  { id: 'teach', label: 'Teach Others', icon: Layers },
];

const STACKS = [
  'Rust', 'Go', 'Python', 'TypeScript', 'C++', 'Java', 'Kotlin',
  'Swift', 'Zig', 'Haskell', 'Elixir', 'Ruby', 'Scala', 'C#',
  'React', 'Vue', 'Next.js', 'Node.js', 'PostgreSQL', 'MongoDB',
  'Docker', 'Kubernetes', 'AWS', 'Linux', 'WebAssembly',
];

// Floating code element for the left panel
function FloatingCode({ code, style, className = '' }: { code: string; style?: React.CSSProperties; className?: string }) {
  return (
    <div
      className={`absolute font-mono text-xs bg-black/60 backdrop-blur-md border border-white/10 rounded-lg p-3 shadow-2xl ${className}`}
      style={style}
    >
      <pre className="text-zinc-400 leading-relaxed">{code}</pre>
    </div>
  );
}

export function Register() {
  const navigate = useNavigate();
  const [step, setStep] = useState(1);
  const [showPass, setShowPass] = useState(false);
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    name: '', email: '', password: '',
    role: '', level: '', goals: [] as string[], stack: [] as string[],
  });

  const update = (key: string, val: any) => setFormData(prev => ({ ...prev, [key]: val }));
  const toggleGoal = (id: string) => {
    const goals = formData.goals.includes(id)
      ? formData.goals.filter(g => g !== id)
      : [...formData.goals, id];
    update('goals', goals);
  };
  const toggleStack = (s: string) => {
    const stack = formData.stack.includes(s)
      ? formData.stack.filter(x => x !== s)
      : [...formData.stack, s];
    update('stack', stack);
  };

  const canProceed = () => {
    if (step === 1) return formData.name && formData.email && formData.password.length >= 6;
    if (step === 2) return !!formData.role;
    if (step === 3) return !!formData.level;
    if (step === 4) return formData.goals.length > 0;
    return true;
  };

  const handleSubmit = async () => {
    setLoading(true);
    try {
      await fetch('/api/auth/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });
    } catch (_) {}
    setLoading(false);
    navigate('/app');
  };

  const handleGoogleSignIn = () => {
    window.location.href = '/api/auth/google';
  };

  const progressPct = ((step - 1) / (STEPS.length - 1)) * 100;

  return (
    <div className="min-h-screen bg-black flex overflow-hidden">
      {/* LEFT PANEL — Illustration */}
      <div className="hidden lg:flex w-1/2 relative flex-col items-center justify-center overflow-hidden bg-zinc-950">
        {/* Grid */}
        <div className="absolute inset-0 bg-[linear-gradient(to_right,#1a1a1a_1px,transparent_1px),linear-gradient(to_bottom,#1a1a1a_1px,transparent_1px)] bg-[size:40px_40px]" />
        {/* Glow blobs */}
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-indigo-600/10 rounded-full blur-[100px]" />
        <div className="absolute bottom-1/4 right-1/4 w-80 h-80 bg-purple-600/10 rounded-full blur-[100px]" />

        {/* Floating code snippets */}
        <FloatingCode
          code={`fn main() {\n  let x = 42;\n  println!("{x}");\n}`}
          className="top-[15%] left-[8%] animate-pulse"
          style={{ animationDuration: '4s' }}
        />
        <FloatingCode
          code={`SELECT *\nFROM users\nWHERE rank < 100;`}
          className="bottom-[20%] right-[5%]"
          style={{ animation: 'float 5s ease-in-out infinite' }}
        />
        <FloatingCode
          code={`const solve = async () => {\n  await compete();\n  climbRanks();\n};`}
          className="top-[55%] left-[5%]"
          style={{ animation: 'float 7s ease-in-out 1s infinite' }}
        />
        <FloatingCode
          code={`docker run -it \\\n  codeycoach/env \\\n  --lang rust`}
          className="top-[20%] right-[8%]"
          style={{ animation: 'float 6s ease-in-out 2s infinite' }}
        />

        {/* Central 3D-style badge cluster */}
        <div className="relative z-10 flex flex-col items-center text-center max-w-xs">
          <div className="relative mb-8">
            {/* Outer ring */}
            <div className="w-40 h-40 rounded-full border border-white/5 absolute inset-0 m-auto" />
            <div className="w-32 h-32 rounded-full border border-white/10 absolute inset-0 m-auto" />
            {/* Core orb */}
            <div className="w-24 h-24 rounded-full bg-gradient-to-tr from-indigo-600 via-purple-600 to-pink-500 shadow-[0_0_80px_rgba(99,102,241,0.4)] mx-auto flex items-center justify-center">
              <Code2 size={36} className="text-white" />
            </div>
            {/* Orbiting badges */}
            {[
              { icon: Trophy, color: 'bg-yellow-500', style: { top: '-10px', right: '-10px' } },
              { icon: Shield, color: 'bg-green-500', style: { bottom: '-10px', left: '-10px' } },
              { icon: Zap, color: 'bg-blue-500', style: { top: '-10px', left: '-10px' } },
              { icon: Target, color: 'bg-red-500', style: { bottom: '-10px', right: '-10px' } },
            ].map(({ icon: Icon, color, style }, i) => (
              <div key={i} className={`absolute ${color} w-8 h-8 rounded-full flex items-center justify-center shadow-lg`} style={style}>
                <Icon size={14} className="text-white" />
              </div>
            ))}
          </div>

          <h2 className="text-3xl font-display font-bold text-white mb-3 uppercase tracking-tight">
            CodeyCoach
          </h2>
          <p className="text-zinc-500 font-mono text-sm leading-relaxed">
            The IDE-native platform to master 300+ languages, compete globally, and get hired.
          </p>

          {/* Stats row */}
          <div className="flex gap-6 mt-8">
            {[
              { val: '10K+', label: 'Learners' },
              { val: '300+', label: 'Languages' },
              { val: '#1', label: 'Platform' },
            ].map((s, i) => (
              <div key={i} className="text-center">
                <div className="text-xl font-bold text-white font-display">{s.val}</div>
                <div className="text-xs text-zinc-500 font-mono">{s.label}</div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* RIGHT PANEL — Multi-step Form */}
      <div className="flex-1 lg:w-1/2 flex flex-col items-center justify-center px-6 py-12 relative">
        {/* Top progress */}
        <div className="w-full max-w-md mb-8">
          <div className="flex items-center justify-between mb-2 text-xs font-mono text-zinc-500">
            <span>Step {step} of {STEPS.length}</span>
            <span>{Math.round(progressPct)}% Complete</span>
          </div>
          <div className="h-1 bg-zinc-800 rounded-full overflow-hidden">
            <motion.div
              className="h-full bg-gradient-to-r from-indigo-500 to-purple-500 rounded-full"
              initial={{ width: '0%' }}
              animate={{ width: `${progressPct + 20}%` }}
              transition={{ duration: 0.4, ease: 'easeOut' }}
            />
          </div>

          {/* Step dots */}
          <div className="flex items-center justify-between mt-2">
            {STEPS.map((s) => (
              <div
                key={s.id}
                className={`w-2 h-2 rounded-full transition-all duration-300 ${
                  s.id < step ? 'bg-indigo-500' : s.id === step ? 'bg-white scale-125' : 'bg-zinc-700'
                }`}
              />
            ))}
          </div>
        </div>

        {/* Form card */}
        <div className="w-full max-w-md">
          <AnimatePresence mode="wait">
            <motion.div
              key={step}
              initial={{ opacity: 0, x: 30 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -30 }}
              transition={{ duration: 0.25 }}
            >
              {/* Step header */}
              <div className="mb-8">
                <h1 className="text-3xl font-display font-bold text-white mb-1">
                  {STEPS[step - 1].title}
                </h1>
                <p className="text-zinc-500 font-mono text-sm">{STEPS[step - 1].subtitle}</p>
              </div>

              {/* STEP 1: Credentials */}
              {step === 1 && (
                <div className="space-y-4">
                  {/* Google Sign In */}
                  <button
                    onClick={handleGoogleSignIn}
                    className="w-full flex items-center justify-center gap-3 h-12 rounded-lg border border-zinc-700 bg-zinc-900 hover:bg-zinc-800 transition-colors text-sm font-medium text-white group"
                  >
                    <svg viewBox="0 0 24 24" className="w-5 h-5" xmlns="http://www.w3.org/2000/svg">
                      <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4"/>
                      <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/>
                      <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05"/>
                      <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/>
                    </svg>
                    Continue with Google
                  </button>

                  <div className="flex items-center gap-3">
                    <div className="flex-1 h-px bg-zinc-800" />
                    <span className="text-xs text-zinc-600 font-mono">or with email</span>
                    <div className="flex-1 h-px bg-zinc-800" />
                  </div>

                  <div className="relative">
                    <User size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-zinc-500" />
                    <Input
                      placeholder="Full name"
                      value={formData.name}
                      onChange={e => update('name', e.target.value)}
                      className="pl-9 h-12 bg-zinc-900 border-zinc-700 focus-visible:border-indigo-500 text-white placeholder:text-zinc-600"
                    />
                  </div>
                  <div className="relative">
                    <Mail size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-zinc-500" />
                    <Input
                      type="email"
                      placeholder="Email address"
                      value={formData.email}
                      onChange={e => update('email', e.target.value)}
                      className="pl-9 h-12 bg-zinc-900 border-zinc-700 focus-visible:border-indigo-500 text-white placeholder:text-zinc-600"
                    />
                  </div>
                  <div className="relative">
                    <Lock size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-zinc-500" />
                    <Input
                      type={showPass ? 'text' : 'password'}
                      placeholder="Password (min. 6 chars)"
                      value={formData.password}
                      onChange={e => update('password', e.target.value)}
                      className="pl-9 pr-9 h-12 bg-zinc-900 border-zinc-700 focus-visible:border-indigo-500 text-white placeholder:text-zinc-600"
                    />
                    <button
                      type="button"
                      onClick={() => setShowPass(!showPass)}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-zinc-500 hover:text-white transition-colors"
                    >
                      {showPass ? <EyeOff size={16} /> : <Eye size={16} />}
                    </button>
                  </div>
                </div>
              )}

              {/* STEP 2: Role */}
              {step === 2 && (
                <div className="grid grid-cols-2 gap-3">
                  {ROLES.map(role => {
                    const Icon = role.icon;
                    const active = formData.role === role.id;
                    return (
                      <button
                        key={role.id}
                        onClick={() => update('role', role.id)}
                        className={`p-4 rounded-xl border text-left transition-all duration-200 ${
                          active
                            ? 'border-indigo-500 bg-indigo-500/10 shadow-[0_0_20px_rgba(99,102,241,0.15)]'
                            : 'border-zinc-800 bg-zinc-900 hover:border-zinc-600'
                        }`}
                      >
                        <Icon size={24} className={active ? 'text-indigo-400 mb-2' : 'text-zinc-500 mb-2'} />
                        <div className={`font-semibold text-sm ${active ? 'text-white' : 'text-zinc-300'}`}>{role.label}</div>
                        <div className="text-xs text-zinc-500 mt-0.5">{role.desc}</div>
                        {active && <Check size={14} className="text-indigo-400 mt-2" />}
                      </button>
                    );
                  })}
                </div>
              )}

              {/* STEP 3: Experience */}
              {step === 3 && (
                <div className="space-y-3">
                  {LEVELS.map(level => {
                    const active = formData.level === level.id;
                    return (
                      <button
                        key={level.id}
                        onClick={() => update('level', level.id)}
                        className={`w-full p-4 rounded-xl border text-left flex items-center justify-between transition-all duration-200 bg-gradient-to-r ${
                          active
                            ? `${level.color} border-white/20`
                            : 'from-zinc-900 to-zinc-900 border-zinc-800 hover:border-zinc-600'
                        }`}
                      >
                        <div>
                          <div className={`font-semibold ${active ? 'text-white' : 'text-zinc-300'}`}>{level.label}</div>
                          <div className="text-xs text-zinc-500 font-mono">{level.desc}</div>
                        </div>
                        {active && (
                          <div className="w-6 h-6 rounded-full bg-white flex items-center justify-center">
                            <Check size={12} className="text-black" />
                          </div>
                        )}
                      </button>
                    );
                  })}
                </div>
              )}

              {/* STEP 4: Goals */}
              {step === 4 && (
                <div className="grid grid-cols-2 gap-3">
                  {GOALS.map(goal => {
                    const Icon = goal.icon;
                    const active = formData.goals.includes(goal.id);
                    return (
                      <button
                        key={goal.id}
                        onClick={() => toggleGoal(goal.id)}
                        className={`p-4 rounded-xl border text-left flex items-center gap-3 transition-all duration-200 ${
                          active
                            ? 'border-purple-500 bg-purple-500/10'
                            : 'border-zinc-800 bg-zinc-900 hover:border-zinc-600'
                        }`}
                      >
                        <Icon size={18} className={active ? 'text-purple-400' : 'text-zinc-500'} />
                        <span className={`text-sm font-medium ${active ? 'text-white' : 'text-zinc-300'}`}>{goal.label}</span>
                        {active && <Check size={12} className="text-purple-400 ml-auto" />}
                      </button>
                    );
                  })}
                </div>
              )}

              {/* STEP 5: Stack */}
              {step === 5 && (
                <div>
                  <p className="text-xs text-zinc-500 font-mono mb-4">Select all that apply. This tailors your curriculum.</p>
                  <div className="flex flex-wrap gap-2 max-h-64 overflow-y-auto pr-1">
                    {STACKS.map(s => {
                      const active = formData.stack.includes(s);
                      return (
                        <button
                          key={s}
                          onClick={() => toggleStack(s)}
                          className={`px-3 py-1.5 rounded-md border text-xs font-mono transition-all duration-150 ${
                            active
                              ? 'border-green-500 bg-green-500/10 text-green-400'
                              : 'border-zinc-700 bg-zinc-900 text-zinc-400 hover:border-zinc-500'
                          }`}
                        >
                          {active && '✓ '}{s}
                        </button>
                      );
                    })}
                  </div>
                </div>
              )}
            </motion.div>
          </AnimatePresence>

          {/* Navigation */}
          <div className="flex items-center justify-between mt-8">
            {step > 1 ? (
              <Button
                variant="ghost"
                onClick={() => setStep(s => s - 1)}
                className="text-zinc-400 hover:text-white gap-2"
              >
                <ArrowLeft size={16} /> Back
              </Button>
            ) : (
              <Link to="/login" className="text-sm text-zinc-500 hover:text-white transition-colors font-mono">
                Already have an account?
              </Link>
            )}

            {step < STEPS.length ? (
              <Button
                onClick={() => setStep(s => s + 1)}
                disabled={!canProceed()}
                className="bg-white text-black hover:bg-zinc-200 font-mono gap-2 disabled:opacity-40"
              >
                Continue <ArrowRight size={16} />
              </Button>
            ) : (
              <Button
                onClick={handleSubmit}
                disabled={loading}
                className="bg-gradient-to-r from-indigo-600 to-purple-600 text-white hover:from-indigo-500 hover:to-purple-500 font-mono gap-2 px-6"
              >
                {loading ? (
                  <span className="flex items-center gap-2">
                    <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                    Launching...
                  </span>
                ) : (
                  <>Launch Workspace <Zap size={16} /></>
                )}
              </Button>
            )}
          </div>

          {step === 1 && (
            <p className="text-center text-xs text-zinc-600 mt-6 font-mono">
              By continuing, you agree to our{' '}
              <span className="text-zinc-400 cursor-pointer hover:text-white">Terms</span> and{' '}
              <span className="text-zinc-400 cursor-pointer hover:text-white">Privacy Policy</span>.
            </p>
          )}
        </div>
      </div>
    </div>
  );
}
