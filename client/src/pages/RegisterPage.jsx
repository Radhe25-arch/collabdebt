import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuthStore } from '@/store';
import { Button, Input, Select } from '@/components/ui';
import { GlassPanel } from '@/components/landing/Primitives';
import Icons from '@/assets/icons';
import toast from 'react-hot-toast';

const LANGUAGES = [
  { id: 'javascript', label: 'JavaScript',  icon: Icons.Code     },
  { id: 'python',     label: 'Python',       icon: Icons.Terminal },
  { id: 'cpp',        label: 'C++',           icon: Icons.Code     },
  { id: 'java',       label: 'Java',          icon: Icons.Terminal },
  { id: 'typescript', label: 'TypeScript',    icon: Icons.Code     },
  { id: 'dsa',        label: 'DSA',           icon: Icons.Target   },
  { id: 'web_dev',    label: 'Web Dev',       icon: Icons.Globe    },
  { id: 'rust',       label: 'Rust',          icon: Icons.Shield   },
  { id: 'go',         label: 'Go',            icon: Icons.Terminal },
  { id: 'sql',        label: 'SQL',           icon: Icons.Book     },
];

function strengthInfo(pw) {
  if (!pw) return { score: 0, label: '', color: 'bg-arena-bg3' };
  if (pw.length < 6) return { score: 1, label: 'Too short', color: 'bg-red-500' };
  let s = 2;
  if (/[A-Z]/.test(pw)) s++;
  if (/[0-9]/.test(pw)) s++;
  if (/[^A-Za-z0-9]/.test(pw)) s++;
  if (s >= 5) return { score: 5, label: 'Strong',  color: 'bg-arena-teal'   };
  if (s >= 3) return { score: 3, label: 'Medium',  color: 'bg-yellow-500'   };
  return        { score: 2, label: 'Weak',    color: 'bg-orange-500'  };
}

const STEPS = [
  { label: 'Account',  desc: 'Email & password'   },
  { label: 'Profile',  desc: 'Your info'           },
  { label: 'Languages','desc': 'Pick your tracks'  },
];

export default function RegisterPage() {
  const { register, isLoading } = useAuthStore();
  const navigate = useNavigate();
  const [step, setStep]     = useState(0);
  const [errors, setErrors] = useState({});
  const [showPw, setShowPw] = useState(false);
  const [mounted, setMounted] = useState(false);
  const [form, setForm] = useState({
    email: '', password: '', confirmPassword: '',
    fullName: '', username: '', role: 'STUDENT', ageGroup: 'COLLEGE',
    interests: [],
  });

  useEffect(() => { setMounted(true); }, []);

  const pw = strengthInfo(form.password);

  const suggestUsername = (name) => {
    if (!form.username && name) {
      const s = name.toLowerCase().replace(/\s+/g,'_').replace(/[^a-z0-9_]/g,'') + Math.floor(Math.random()*99);
      setForm(f => ({ ...f, username: s }));
    }
  };

  const toggleLang = (id) =>
    setForm(f => ({
      ...f,
      interests: f.interests.includes(id) ? f.interests.filter(x => x !== id) : [...f.interests, id],
    }));

  const validate = () => {
    const e = {};
    if (step === 0) {
      if (!form.email)    e.email    = 'Email is required';
      if (!form.password) e.password = 'Password is required';
      if (pw.score < 2)   e.password = 'Password is too weak';
      if (form.password !== form.confirmPassword) e.confirmPassword = 'Passwords do not match';
    }
    if (step === 1) {
      if (!form.fullName)              e.fullName = 'Full name is required';
      if (!form.username)              e.username = 'Username is required';
      if (form.username.length < 3)   e.username = 'Minimum 3 characters';
    }
    setErrors(e);
    return !Object.keys(e).length;
  };

  const next = () => { if (validate()) setStep(s => s + 1); };
  const prev = () => setStep(s => s - 1);

  const handleSubmit = async () => {
    const res = await register({
      email: form.email, password: form.password,
      fullName: form.fullName, username: form.username,
      role: form.role, ageGroup: form.ageGroup, interests: form.interests,
    });
    if (res.ok) {
      toast.success('Welcome to SkillForge!');
      navigate('/dashboard');
    } else {
      toast.error(res.error || 'Registration failed');
    }
  };

  return (
    <div className="min-h-screen bg-[#08080C] flex overflow-hidden relative selection:bg-neon-teal/30 selection:text-neon-teal">
      
      {/* Background Ambience */}
      <div className="absolute inset-0 bg-[#08080C] -z-20" />
      <div className="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.03)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.03)_1px,transparent_1px)] bg-[size:64px_64px] [mask-image:radial-gradient(ellipse_at_center,black_40%,transparent_80%)] -z-10 pointer-events-none" opacity="0.4" />
      <div className="absolute top-[-20%] left-[-10%] w-[50%] h-[50%] rounded-full bg-neon-purple/10 blur-[120px] pointer-events-none -z-10" />
      <div className="absolute bottom-[-20%] right-[-10%] w-[40%] h-[40%] rounded-full bg-neon-teal/10 blur-[100px] pointer-events-none -z-10" />

      {/* ── LEFT PANEL ── */}
      <div className="hidden lg:flex flex-col justify-between w-[42%] p-12 relative overflow-hidden border-r border-white/5 bg-black/20 backdrop-blur-xl">
        <div className="relative z-10 flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-neon-teal/10 border border-neon-teal/30 flex items-center justify-center glow-purple">
            <Icons.Code size={20} className="text-neon-teal" />
          </div>
          <span className="font-display font-black text-2xl text-white tracking-tight uppercase italic">CodeArena</span>
        </div>

        <div className="relative z-10">
          <p className="font-display font-black text-5xl leading-[1.1] text-white mb-8 uppercase tracking-tighter" style={{ letterSpacing: '-1.5px' }}>
            Initialize<br />
            <span className="text-neon-teal drop-shadow-[0_0_15px_rgba(0,245,212,0.4)]">Creator Node</span>
          </p>
          <div className="space-y-4">
            {[
              { icon: Icons.Book,       text: '127 free courses across 16 languages'     },
              { icon: Icons.Trophy,     text: 'Weekly tournaments with winner badges'     },
              { icon: Icons.Zap,        text: 'XP system — Beginner to Legend'            },
              { icon: Icons.Target,     text: '1v1 battles with full report cards'        },
              { icon: Icons.TrendingUp, text: 'Accuracy & speed tracked on every lesson'  },
            ].map(({ icon: Ic, text }) => (
              <div key={text} className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-lg bg-neon-purple/20 border border-neon-purple/50 flex items-center justify-center flex-shrink-0">
                  <Ic size={13} className="text-neon-purple font-bold" />
                </div>
                <span className="font-mono text-[10px] text-slate-400 uppercase tracking-widest">{text}</span>
              </div>
            ))}
          </div>
        </div>

        <div className="relative z-10 grid grid-cols-3 gap-4">
          {[
            { v: '48k+', l: 'Developers' },
            { v: '127',  l: 'Courses'    },
            { v: '100%', l: 'Free'       },
          ].map(({ v, l }) => (
            <div key={l}>
              <p className="font-display font-black text-2xl text-white drop-shadow-[0_0_10px_rgba(255,255,255,0.2)]">{v}</p>
              <p className="font-mono text-[10px] text-slate-500 tracking-widest uppercase">{l}</p>
            </div>
          ))}
        </div>
      </div>

      {/* ── RIGHT PANEL ── */}
      <div className={`flex-1 flex items-center justify-center px-6 py-12 transition-all duration-700 ${mounted ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'}`}>
        <div className="w-full max-w-md">

          {/* Mobile logo */}
          <div className="flex items-center gap-3 justify-center mb-8 lg:hidden">
            <div className="w-10 h-10 rounded-xl bg-neon-teal/10 border border-neon-teal/30 flex items-center justify-center">
              <Icons.Code size={20} className="text-neon-teal" />
            </div>
            <span className="font-display font-black text-2xl text-white tracking-tight uppercase italic">CodeArena</span>
          </div>

          {/* Header */}
          <div className="mb-8 text-center lg:text-left">
            <h1 className="font-display font-black text-4xl text-white mb-2 uppercase tracking-tight">
              Register Node
            </h1>
            <p className="text-slate-400 font-mono text-xs uppercase tracking-widest">Free forever. No credit card required.</p>
          </div>

          {/* Step indicators */}
          <div className="flex items-center gap-2 mb-8">
            {STEPS.map((s, i) => (
              <div key={i} className="flex items-center gap-2 flex-1">
                <div className={`flex items-center gap-2 ${i < STEPS.length - 1 ? 'flex-1' : ''}`}>
                  <div className={`w-8 h-8 rounded-full flex items-center justify-center font-mono text-[10px] font-bold flex-shrink-0 transition-all ${
                    i < step  ? 'bg-neon-teal/20 text-neon-teal border border-neon-teal/40' :
                    i === step ? 'bg-neon-purple text-white shadow-[0_0_15px_rgba(155,93,229,0.3)]' :
                                 'bg-white/5 border border-white/10 text-slate-500'
                  }`}>
                    {i < step ? <Icons.Check size={12} className="text-neon-teal" /> : i + 1}
                  </div>
                  <span className={`font-mono text-[10px] tracking-widest uppercase hidden sm:block ${i === step ? 'text-white' : 'text-slate-500'}`}>
                    {s.label}
                  </span>
                </div>
                {i < STEPS.length - 1 && (
                  <div className={`flex-1 h-px mx-2 ${i < step ? 'bg-neon-teal/40' : 'bg-white/10'}`} />
                )}
              </div>
            ))}
          </div>

          {/* STEP 0 — Account */}
          {step === 0 && (
            <div className="space-y-4 animate-fade-in">
              {/* Google OAuth */}
              <a href="/api/auth/google"
                className="w-full flex items-center justify-center gap-3 bg-white/5 hover:bg-white/10 border border-white/10 hover:border-neon-teal/50 rounded-xl py-4 transition-all duration-300 group mb-2 relative overflow-hidden">
                <div className="absolute inset-0 bg-neon-teal/5 opacity-0 group-hover:opacity-100 transition-opacity" />
                <svg width="18" height="18" viewBox="0 0 24 24">
                  <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4"/>
                  <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/>
                  <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05"/>
                  <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/>
                </svg>
                <span className="relative z-10 font-mono text-[10px] font-bold text-slate-300 group-hover:text-white transition-colors uppercase tracking-widest">Sign up with Google</span>
              </a>

              <div className="relative flex items-center gap-4">
                <div className="flex-1 h-px bg-white/10" />
                <span className="font-mono text-[10px] text-slate-500 uppercase tracking-widest">Or Form Data</span>
                <div className="flex-1 h-px bg-white/10" />
              </div>

              <div>
                <label className="block font-mono text-[10px] text-slate-400 uppercase tracking-widest mb-2">Email address</label>
                <input type="email" placeholder="you@example.com"
                  value={form.email} onChange={e => setForm({ ...form, email: e.target.value })}
                  className={`bg-white/5 border border-white/10 rounded-xl px-4 py-3.5 text-white placeholder-slate-600 focus:outline-none focus:border-neon-teal focus:ring-1 focus:ring-neon-teal transition-all font-mono text-sm ${errors.email ? 'border-red-500/50' : ''}`} />
                {errors.email && <p className="text-red-400 text-xs font-mono mt-1">{errors.email}</p>}
              </div>

              <div>
                <label className="block font-mono text-[10px] text-slate-400 uppercase tracking-widest mb-2">Password</label>
                <div className="relative">
                  <input type={showPw ? 'text' : 'password'} placeholder="min 6 characters"
                    value={form.password} onChange={e => setForm({ ...form, password: e.target.value })}
                    className={`bg-white/5 border border-white/10 rounded-xl px-4 py-3.5 text-white placeholder-slate-600 focus:outline-none focus:border-neon-teal focus:ring-1 focus:ring-neon-teal transition-all font-mono text-sm pr-10 ${errors.password ? 'border-red-500/50' : ''}`} />
                  <button type="button" onClick={() => setShowPw(v => !v)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-arena-dim hover:text-arena-muted">
                    <Icons.Check size={14} />
                  </button>
                </div>
                {form.password && (
                  <div className="flex gap-1 mt-2">
                    {[1,2,3,4,5].map(n => (
                      <div key={n} className={`flex-1 h-1 rounded-full transition-all ${n <= pw.score ? pw.color : 'bg-arena-bg3'}`} />
                    ))}
                    <span className="font-mono text-xs text-arena-dim ml-2">{pw.label}</span>
                  </div>
                )}
                {errors.password && <p className="text-red-400 text-xs font-mono mt-1">{errors.password}</p>}
              </div>

              <div>
                <label className="block font-mono text-[10px] text-slate-400 uppercase tracking-widest mb-2">Confirm password</label>
                <input type="password" placeholder="repeat password"
                  value={form.confirmPassword} onChange={e => setForm({ ...form, confirmPassword: e.target.value })}
                  className={`bg-white/5 border border-white/10 rounded-xl px-4 py-3.5 text-white placeholder-slate-600 focus:outline-none focus:border-neon-teal focus:ring-1 focus:ring-neon-teal transition-all font-mono text-sm ${errors.confirmPassword ? 'border-red-500/50' : ''}`} />
                {errors.confirmPassword && <p className="text-red-400 text-xs font-mono mt-1">{errors.confirmPassword}</p>}
              </div>

              <button onClick={next} className="w-full py-4 mt-6 bg-neon-purple text-white font-black text-xs uppercase tracking-widest flex items-center justify-center gap-2 rounded-xl shadow-[0_0_20px_rgba(155,93,229,0.3)] hover:scale-[1.02] hover:bg-neon-purple/90 transition-all">
                Proceed <Icons.ArrowRight size={16} />
              </button>
            </div>
          )}

          {/* STEP 1 — Profile */}
          {step === 1 && (
            <div className="space-y-4 animate-fade-in">
              <div>
                <label className="block font-mono text-[10px] text-slate-400 uppercase tracking-widest mb-2">Full name</label>
                <input type="text" placeholder="John Doe"
                  value={form.fullName}
                  onChange={e => { setForm({ ...form, fullName: e.target.value }); suggestUsername(e.target.value); }}
                  className={`bg-white/5 border border-white/10 rounded-xl px-4 py-3.5 text-white placeholder-slate-600 focus:outline-none focus:border-neon-teal focus:ring-1 focus:ring-neon-teal transition-all font-mono text-sm ${errors.fullName ? 'border-red-500/50' : ''}`} />
                {errors.fullName && <p className="text-red-400 text-xs font-mono mt-1">{errors.fullName}</p>}
              </div>

              <div>
                <label className="block font-mono text-[10px] text-slate-400 uppercase tracking-widest mb-2">Username</label>
                <input type="text" placeholder="coder_zero"
                  value={form.username} onChange={e => setForm({ ...form, username: e.target.value })}
                  className={`bg-white/5 border border-white/10 rounded-xl px-4 py-3.5 text-white placeholder-slate-600 focus:outline-none focus:border-neon-teal focus:ring-1 focus:ring-neon-teal transition-all font-mono text-sm ${errors.username ? 'border-red-500/50' : ''}`} />
                {errors.username && <p className="text-red-400 text-xs font-mono mt-1">{errors.username}</p>}
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-mono text-[10px] text-slate-400 uppercase tracking-widest mb-2">I am a</label>
                  <select value={form.role} onChange={e => setForm({ ...form, role: e.target.value })} className="arena-input appearance-none">
                    <option value="BEGINNER">Beginner</option>
                    <option value="STUDENT">Student</option>
                    <option value="PROFESSIONAL">Professional</option>
                  </select>
                </div>
                <div>
                  <label className="block font-mono text-[10px] text-slate-400 uppercase tracking-widest mb-2">Age group</label>
                  <select value={form.ageGroup} onChange={e => setForm({ ...form, ageGroup: e.target.value })} className="arena-input appearance-none">
                    <option value="SCHOOL">School</option>
                    <option value="COLLEGE">College</option>
                    <option value="WORKING">Working</option>
                  </select>
                </div>
              </div>

              <div className="flex gap-3 pt-2">
                <button onClick={prev} className="flex-1 py-4 bg-white/5 border border-white/10 text-white font-black text-xs uppercase tracking-widest flex items-center justify-center gap-2 rounded-xl hover:bg-white/10 transition-all">
                  <Icons.ArrowLeft size={16} /> Retreat
                </button>
                <button onClick={next} className="flex-1 py-4 bg-neon-teal text-black font-black text-xs uppercase tracking-widest flex items-center justify-center gap-2 rounded-xl shadow-[0_0_20px_rgba(0,245,212,0.3)] hover:scale-[1.02] hover:bg-neon-teal/90 transition-all">
                  Proceed <Icons.ArrowRight size={16} />
                </button>
              </div>
            </div>
          )}

          {/* STEP 2 — Languages */}
          {step === 2 && (
            <div className="space-y-5 animate-fade-in">
              <div>
                <div className="flex items-center justify-between mb-3">
                  <label className="block font-mono text-[10px] text-slate-400 uppercase tracking-widest mb-2" style={{ margin: 0 }}>Select Tech Stack</label>
                  <span className="font-mono text-[10px] text-slate-500 uppercase tracking-widest">{form.interests.length} ACTIVE</span>
                </div>
                <div className="grid grid-cols-2 gap-2">
                  {LANGUAGES.map(({ id, label, icon: Ic }) => {
                    const active = form.interests.includes(id);
                    return (
                      <button key={id} type="button" onClick={() => toggleLang(id)}
                        className={`flex items-center gap-2.5 p-3 rounded-xl border transition-all text-left group ${
                          active
                            ? 'bg-neon-purple/15 border-neon-purple/50 text-white shadow-[0_0_10px_rgba(155,93,229,0.1)]'
                            : 'bg-white/5 border-white/10 text-slate-400 hover:border-neon-purple/30 hover:bg-white/10'
                        }`}>
                        <div className={`w-6 h-6 rounded-md flex items-center justify-center flex-shrink-0 transition-colors ${active ? 'bg-neon-purple/20' : 'bg-white/5 group-hover:bg-white/10'}`}>
                          <Ic size={12} className={active ? 'text-neon-purple' : 'text-slate-500'} />
                        </div>
                        <span className="font-mono text-[10px] uppercase tracking-widest font-bold truncate">{label}</span>
                        {active && <Icons.Check size={11} className="text-neon-teal ml-auto flex-shrink-0" />}
                      </button>
                    );
                  })}
                </div>
              </div>

              <div className="flex gap-3">
                <button onClick={prev} className="flex-1 py-4 bg-white/5 border border-white/10 text-white font-black text-xs uppercase tracking-widest flex items-center justify-center gap-2 rounded-xl hover:bg-white/10 transition-all">
                  <Icons.ArrowLeft size={16} /> Retreat
                </button>
                <button onClick={handleSubmit} disabled={isLoading} className="flex-1 py-4 bg-neon-teal text-black font-black text-xs uppercase tracking-widest flex items-center justify-center gap-2 rounded-xl shadow-[0_0_20px_rgba(0,245,212,0.3)] hover:scale-[1.02] hover:bg-neon-teal/90 transition-all disabled:opacity-50 disabled:cursor-not-allowed">
                  {isLoading ? <span className="animate-spin w-4 h-4 border-2 border-black/20 border-t-black rounded-full"></span> : <><Icons.Terminal size={16} /> Execute Build</>}
                </button>
              </div>
            </div>
          )}

          <p className="text-center mt-10 font-mono text-[10px] text-slate-500 uppercase tracking-widest">
            Already registered?{' '}
            <Link to="/login" className="text-neon-teal hover:text-white transition-colors font-bold ml-1">
              Sign in
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}
