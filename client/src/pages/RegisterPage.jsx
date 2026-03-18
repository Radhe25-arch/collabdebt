import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuthStore } from '@/store';
import { Button, Input, Select } from '@/components/ui';
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
    <div className="min-h-screen bg-arena-bg flex overflow-hidden">

      {/* ── LEFT PANEL ── */}
      <div className="hidden lg:flex flex-col justify-between w-[42%] bg-arena-bg2 border-r border-arena-border p-12 relative overflow-hidden">
        <div className="absolute inset-0 bg-grid opacity-40 pointer-events-none" />
        <div className="absolute top-[-20%] left-[-20%] w-[70%] h-[70%] rounded-full bg-arena-purple/10 blur-[100px] pointer-events-none" />
        <div className="absolute bottom-[-10%] right-[-10%] w-[50%] h-[50%] rounded-full bg-arena-teal/6 blur-[80px] pointer-events-none" />

        <div className="relative z-10 flex items-center gap-3">
          <div className="w-9 h-9 rounded-xl bg-purple-teal flex items-center justify-center glow-purple">
            <Icons.Code size={17} className="text-white" />
          </div>
          <span className="font-display font-black text-xl text-gradient tracking-tight">SkillForge</span>
        </div>

        <div className="relative z-10">
          <p className="font-display font-black text-4xl leading-tight text-arena-text mb-8" style={{ letterSpacing: '-1.5px' }}>
            Learn every coding language.<br />
            <span className="text-gradient">Free. Forever.</span>
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
                <div className="w-7 h-7 rounded-lg bg-arena-purple/15 border border-arena-border flex items-center justify-center flex-shrink-0">
                  <Ic size={13} className="text-arena-purple2" />
                </div>
                <span className="font-body text-sm text-arena-muted">{text}</span>
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
              <p className="font-display font-black text-2xl text-gradient">{v}</p>
              <p className="font-mono text-xs text-arena-dim">{l}</p>
            </div>
          ))}
        </div>
      </div>

      {/* ── RIGHT PANEL ── */}
      <div className={`flex-1 flex items-center justify-center px-6 py-12 transition-all duration-700 ${mounted ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'}`}>
        <div className="w-full max-w-md">

          {/* Mobile logo */}
          <div className="flex items-center gap-2.5 justify-center mb-8 lg:hidden">
            <div className="w-8 h-8 rounded-xl bg-purple-teal flex items-center justify-center">
              <Icons.Code size={15} className="text-white" />
            </div>
            <span className="font-display font-black text-xl text-gradient tracking-tight">SkillForge</span>
          </div>

          {/* Header */}
          <div className="mb-8">
            <h1 className="font-display font-black text-3xl text-arena-text mb-1" style={{ letterSpacing: '-1px' }}>
              Create your account
            </h1>
            <p className="text-arena-muted text-sm">Free forever. No credit card needed.</p>
          </div>

          {/* Step indicators */}
          <div className="flex items-center gap-2 mb-8">
            {STEPS.map((s, i) => (
              <div key={i} className="flex items-center gap-2 flex-1">
                <div className={`flex items-center gap-2 ${i < STEPS.length - 1 ? 'flex-1' : ''}`}>
                  <div className={`w-7 h-7 rounded-full flex items-center justify-center font-mono text-xs font-bold flex-shrink-0 transition-all ${
                    i < step  ? 'bg-arena-teal/20 text-arena-teal border border-arena-teal/40' :
                    i === step ? 'bg-arena-purple text-white' :
                                 'bg-arena-bg3 border border-arena-border text-arena-dim'
                  }`}>
                    {i < step ? <Icons.Check size={12} /> : i + 1}
                  </div>
                  <span className={`font-mono text-xs hidden sm:block ${i === step ? 'text-arena-text' : 'text-arena-dim'}`}>
                    {s.label}
                  </span>
                </div>
                {i < STEPS.length - 1 && (
                  <div className={`flex-1 h-px mx-2 ${i < step ? 'bg-arena-teal/40' : 'bg-arena-border/40'}`} />
                )}
              </div>
            ))}
          </div>

          {/* STEP 0 — Account */}
          {step === 0 && (
            <div className="space-y-4 animate-fade-in">
              {/* Google OAuth */}
              <a href="/api/auth/google"
                className="w-full flex items-center justify-center gap-3 bg-arena-bg2 hover:bg-arena-bg3 border border-arena-border hover:border-arena-purple/40 rounded-xl py-3.5 transition-all duration-200 group mb-2">
                <svg width="18" height="18" viewBox="0 0 24 24">
                  <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4"/>
                  <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/>
                  <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05"/>
                  <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/>
                </svg>
                <span className="font-body text-sm font-medium text-arena-muted group-hover:text-arena-text transition-colors">Sign up with Google</span>
              </a>

              <div className="relative flex items-center gap-4">
                <div className="flex-1 h-px bg-arena-border/50" />
                <span className="font-mono text-xs text-arena-dim uppercase tracking-widest">or</span>
                <div className="flex-1 h-px bg-arena-border/50" />
              </div>

              <div>
                <label className="arena-label">Email address</label>
                <input type="email" placeholder="you@example.com"
                  value={form.email} onChange={e => setForm({ ...form, email: e.target.value })}
                  className={`arena-input ${errors.email ? 'border-red-500/50' : ''}`} />
                {errors.email && <p className="text-red-400 text-xs font-mono mt-1">{errors.email}</p>}
              </div>

              <div>
                <label className="arena-label">Password</label>
                <div className="relative">
                  <input type={showPw ? 'text' : 'password'} placeholder="min 6 characters"
                    value={form.password} onChange={e => setForm({ ...form, password: e.target.value })}
                    className={`arena-input pr-10 ${errors.password ? 'border-red-500/50' : ''}`} />
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
                <label className="arena-label">Confirm password</label>
                <input type="password" placeholder="repeat password"
                  value={form.confirmPassword} onChange={e => setForm({ ...form, confirmPassword: e.target.value })}
                  className={`arena-input ${errors.confirmPassword ? 'border-red-500/50' : ''}`} />
                {errors.confirmPassword && <p className="text-red-400 text-xs font-mono mt-1">{errors.confirmPassword}</p>}
              </div>

              <Button onClick={next} variant="primary" className="w-full py-3.5 mt-2">
                Continue <Icons.ArrowRight size={15} />
              </Button>
            </div>
          )}

          {/* STEP 1 — Profile */}
          {step === 1 && (
            <div className="space-y-4 animate-fade-in">
              <div>
                <label className="arena-label">Full name</label>
                <input type="text" placeholder="John Doe"
                  value={form.fullName}
                  onChange={e => { setForm({ ...form, fullName: e.target.value }); suggestUsername(e.target.value); }}
                  className={`arena-input ${errors.fullName ? 'border-red-500/50' : ''}`} />
                {errors.fullName && <p className="text-red-400 text-xs font-mono mt-1">{errors.fullName}</p>}
              </div>

              <div>
                <label className="arena-label">Username</label>
                <input type="text" placeholder="coder_zero"
                  value={form.username} onChange={e => setForm({ ...form, username: e.target.value })}
                  className={`arena-input ${errors.username ? 'border-red-500/50' : ''}`} />
                {errors.username && <p className="text-red-400 text-xs font-mono mt-1">{errors.username}</p>}
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="arena-label">I am a</label>
                  <select value={form.role} onChange={e => setForm({ ...form, role: e.target.value })} className="arena-input appearance-none">
                    <option value="BEGINNER">Beginner</option>
                    <option value="STUDENT">Student</option>
                    <option value="PROFESSIONAL">Professional</option>
                  </select>
                </div>
                <div>
                  <label className="arena-label">Age group</label>
                  <select value={form.ageGroup} onChange={e => setForm({ ...form, ageGroup: e.target.value })} className="arena-input appearance-none">
                    <option value="SCHOOL">School</option>
                    <option value="COLLEGE">College</option>
                    <option value="WORKING">Working</option>
                  </select>
                </div>
              </div>

              <div className="flex gap-3 pt-2">
                <Button onClick={prev} variant="secondary" className="flex-1 py-3.5">
                  <Icons.ArrowLeft size={15} /> Back
                </Button>
                <Button onClick={next} variant="primary" className="flex-1 py-3.5">
                  Continue <Icons.ArrowRight size={15} />
                </Button>
              </div>
            </div>
          )}

          {/* STEP 2 — Languages */}
          {step === 2 && (
            <div className="space-y-5 animate-fade-in">
              <div>
                <div className="flex items-center justify-between mb-3">
                  <label className="arena-label" style={{ margin: 0 }}>Pick your languages</label>
                  <span className="font-mono text-xs text-arena-dim">{form.interests.length} selected</span>
                </div>
                <div className="grid grid-cols-2 gap-2">
                  {LANGUAGES.map(({ id, label, icon: Ic }) => {
                    const active = form.interests.includes(id);
                    return (
                      <button key={id} type="button" onClick={() => toggleLang(id)}
                        className={`flex items-center gap-2.5 p-3 rounded-xl border transition-all text-left ${
                          active
                            ? 'bg-arena-purple/15 border-arena-purple/50 text-arena-text'
                            : 'bg-arena-bg3/50 border-arena-border/40 text-arena-muted hover:border-arena-purple/30'
                        }`}>
                        <div className={`w-6 h-6 rounded-md flex items-center justify-center flex-shrink-0 ${active ? 'bg-arena-purple/20' : 'bg-arena-bg3'}`}>
                          <Ic size={12} className={active ? 'text-arena-purple2' : 'text-arena-dim'} />
                        </div>
                        <span className="font-mono text-xs font-medium truncate">{label}</span>
                        {active && <Icons.Check size={11} className="text-arena-teal ml-auto flex-shrink-0" />}
                      </button>
                    );
                  })}
                </div>
              </div>

              <div className="flex gap-3">
                <Button onClick={prev} variant="secondary" className="flex-1 py-3.5">
                  <Icons.ArrowLeft size={15} /> Back
                </Button>
                <Button onClick={handleSubmit} variant="teal" className="flex-1 py-3.5" loading={isLoading}>
                  <Icons.Zap size={15} /> Create Account
                </Button>
              </div>
            </div>
          )}

          <p className="text-center mt-8 font-mono text-xs text-arena-dim">
            Already have an account?{' '}
            <Link to="/login" className="text-arena-purple2 hover:text-arena-teal transition-colors font-semibold">
              Sign in
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}
