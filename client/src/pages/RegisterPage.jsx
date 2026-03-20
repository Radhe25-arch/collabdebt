import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuthStore } from '@/store';
import { Button, Input, Select } from '@/components/ui';
import Icons from '@/assets/icons';
import toast from 'react-hot-toast';

const LANGUAGES = [
  { id: 'javascript', label: 'JavaScript', icon: Icons.Code },
  { id: 'python', label: 'Python', icon: Icons.Terminal },
  { id: 'cpp', label: 'C++', icon: Icons.Code },
  { id: 'java', label: 'Java', icon: Icons.Terminal },
  { id: 'typescript', label: 'TypeScript', icon: Icons.Code },
  { id: 'dsa', label: 'DSA', icon: Icons.Target },
  { id: 'web_dev', label: 'Web Dev', icon: Icons.Globe },
  { id: 'rust', label: 'Rust', icon: Icons.Shield },
  { id: 'go', label: 'Go', icon: Icons.Terminal },
  { id: 'sql', label: 'SQL', icon: Icons.Book },
];

function strengthInfo(pw) {
  if (!pw) return { score: 0, label: '', color: 'bg-arena-bg3' };
  if (pw.length < 6) return { score: 1, label: 'Too short', color: 'bg-red-500' };
  let s = 2;
  if (/[A-Z]/.test(pw)) s++;
  if (/[0-9]/.test(pw)) s++;
  if (/[^A-Za-z0-9]/.test(pw)) s++;
  if (s >= 5) return { score: 5, label: 'Strong', color: 'bg-arena-teal' };
  if (s >= 3) return { score: 3, label: 'Medium', color: 'bg-yellow-500' };
  return { score: 2, label: 'Weak', color: 'bg-orange-500' };
}

const STEPS = [
  { label: 'Account', desc: 'Email & password' },
  { label: 'Profile', desc: 'Your info' },
  { label: 'Languages', 'desc': 'Pick your tracks' },
];

export default function RegisterPage() {
  const { register, isLoading } = useAuthStore();
  const navigate = useNavigate();
  const [step, setStep] = useState(0);
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
      const s = name.toLowerCase().replace(/\s+/g, '_').replace(/[^a-z0-9_]/g, '') + Math.floor(Math.random() * 99);
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
      if (!form.email) e.email = 'Email is required';
      if (!form.password) e.password = 'Password is required';
      if (pw.score < 2) e.password = 'Password is too weak';
      if (form.password !== form.confirmPassword) e.confirmPassword = 'Passwords do not match';
    }
    if (step === 1) {
      if (!form.fullName) e.fullName = 'Full name is required';
      if (!form.username) e.username = 'Username is required';
      if (form.username.length < 3) e.username = 'Minimum 3 characters';
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
      toast.success('Welcome to CodeArena!');
      navigate('/dashboard');
    } else {
      toast.error(res.error || 'Registration failed');
    }
  };

  return (
    <div className="min-h-screen bg-[#020205] flex items-center justify-center p-4 relative overflow-hidden font-sans">
      {/* ─── BACKGROUND ACCENTS ─── */}
      <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] rounded-full bg-blue-600/10 blur-[120px] pointer-events-none animate-pulse" />
      <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] rounded-full bg-arena-purple/10 blur-[120px] pointer-events-none animate-pulse" style={{ animationDelay: '1s' }} />
      <div className="absolute inset-0 bg-grid opacity-[0.03] pointer-events-none" />

      {/* ─── MAIN CARD ─── */}
      <div className={`w-full max-w-[1100px] min-h-[720px] bg-[#0A0A0F]/60 backdrop-blur-2xl border border-white/5 rounded-[40px] shadow-2xl flex flex-col lg:flex-row overflow-hidden transition-all duration-1000 ${mounted ? 'opacity-100 scale-100' : 'opacity-0 scale-95'}`}>
        
        {/* LEFT: VISUAL PANEL */}
        <div className="hidden lg:flex flex-col justify-between w-[40%] p-14 bg-gradient-to-br from-indigo-600/10 via-transparent to-blue-600/10 border-r border-white/5 relative">
          <div className="relative z-10 flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-blue-600 to-indigo-600 flex items-center justify-center shadow-lg shadow-blue-600/20">
              <Icons.Code size={18} className="text-white" />
            </div>
            <span className="font-display font-black text-2xl tracking-tighter text-white">CodeArena</span>
          </div>

          <div className="relative z-10">
            <h2 className="font-display font-black text-5xl leading-[1.05] text-white tracking-tight mb-8">
              Synchronize <br/>
              Your <span className="text-blue-500">Node.</span>
            </h2>
            <p className="text-slate-400 text-sm leading-relaxed max-w-[300px] mb-10">
              Initialize your credentials on the global development network and begin provisioning your rank.
            </p>
            
            <div className="space-y-4">
              {[
                { label: 'Network Latency', value: '4ms', color: 'emerald' },
                { label: 'Nodes Active', value: '1.2k', color: 'blue' },
                { label: 'Uptime Score', value: '99.9%', color: 'indigo' }
              ].map((stat, i) => (
                <div key={i} className="flex items-center justify-between p-4 rounded-2xl bg-white/3 border border-white/5 backdrop-blur-md">
                   <span className="font-mono text-[9px] text-slate-500 uppercase tracking-widest">{stat.label}</span>
                   <span className={`font-display font-black text-sm text-${stat.color}-500`}>{stat.value}</span>
                </div>
              ))}
            </div>
          </div>

          <div className="relative z-10 pt-10 border-t border-white/5">
            <p className="font-mono text-[9px] text-slate-500 uppercase tracking-widest mb-4">Core Protocol Version 2.0.4</p>
            <div className="flex -space-x-3">
              {[1,2,3,4].map(idx => (
                <div key={idx} className="w-8 h-8 rounded-full border-2 border-[#0A0A0F] bg-slate-800" />
              ))}
              <div className="w-8 h-8 rounded-full border-2 border-[#0A0A0F] bg-blue-600 flex items-center justify-center text-[10px] font-black text-white">
                +4k
              </div>
            </div>
          </div>
        </div>

        {/* RIGHT: FORM PANEL */}
        <div className="flex-1 flex flex-col px-8 lg:px-20 py-16 relative overflow-y-auto max-h-[90vh] custom-scrollbar">
          {/* Progress Indicator */}
          <div className="flex items-center gap-4 mb-12">
            {STEPS.map((s, i) => (
              <div key={i} className="flex-1 space-y-2">
                <div className={`h-[2px] rounded-full transition-all duration-700 ${i <= step ? 'bg-blue-600' : 'bg-white/5'}`} />
                <p className={`font-mono text-[9px] uppercase tracking-widest ${i === step ? 'text-white font-black' : 'text-slate-600'}`}>
                  {s.label}
                </p>
              </div>
            ))}
          </div>

          <div className="mb-10 animate-fade-in">
            <h1 className="font-display font-black text-4xl text-white mb-2 tracking-tight">
              {step === 0 ? 'Establish Credentials.' : step === 1 ? 'Configure Profile.' : 'Select Sectors.'}
            </h1>
            <p className="text-slate-500 text-sm font-medium">Step {step + 1} of 3: {STEPS[step].desc}</p>
          </div>

          <div className="flex-1">
            {/* STEP 0: Account */}
            {step === 0 && (
              <div className="space-y-6 animate-slide-up">
                <div className="space-y-4">
                  <a href="/api/auth/google" className="w-full flex items-center justify-center gap-3 py-4 rounded-2xl bg-white/5 border border-white/5 hover:bg-white/10 hover:border-white/10 transition-all group">
                    <svg width="18" height="18" viewBox="0 0 24 24">
                      <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4"/>
                      <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/>
                      <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05"/>
                      <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/>
                    </svg>
                    <span className="text-[11px] font-black text-slate-300 uppercase tracking-widest">Connect with Google</span>
                  </a>
                  <div className="relative flex items-center gap-4 py-2">
                    <div className="flex-1 h-px bg-white/5" />
                    <span className="font-mono text-[9px] text-slate-700 uppercase tracking-[0.3em]">OR MANUAL PROVISIONING</span>
                    <div className="flex-1 h-px bg-white/5" />
                  </div>
                </div>

                <div className="space-y-4">
                  <div className="space-y-2">
                    <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest pl-1">Operational Email</label>
                    <div className="relative group">
                      <input
                        type="email"
                        placeholder="name@domain.com"
                        className={`w-full bg-white/3 border ${errors.email ? 'border-red-500/40' : 'border-white/5'} hover:border-white/10 focus:border-blue-500/50 rounded-2xl py-4 px-5 font-mono text-xs text-white outline-none transition-all placeholder:text-slate-800`}
                        value={form.email}
                        onChange={e => setForm({ ...form, email: e.target.value })}
                      />
                      {errors.email && <Icons.AlertCircle size={14} className="absolute right-5 top-1/2 -translate-y-1/2 text-red-500" />}
                    </div>
                    {errors.email && <p className="text-red-400 text-xs font-mono mt-1 pl-1">{errors.email}</p>}
                  </div>
                  
                  <div className="space-y-2">
                    <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest pl-1">Security Cipher</label>
                    <div className="relative group">
                      <input
                        type={showPw ? 'text' : 'password'}
                        placeholder="Establish secure lock"
                        className={`w-full bg-white/3 border ${errors.password ? 'border-red-500/40' : 'border-white/5'} hover:border-white/10 focus:border-blue-500/50 rounded-2xl py-4 px-5 font-mono text-xs text-white outline-none transition-all placeholder:text-slate-800`}
                        value={form.password}
                        onChange={e => setForm({ ...form, password: e.target.value })}
                      />
                      <button type="button" onClick={() => setShowPw(!showPw)} className="absolute right-5 top-1/2 -translate-y-1/2 text-slate-600 hover:text-white transition-colors">
                        {showPw ? <Icons.EyeOff size={16} /> : <Icons.Eye size={16} />}
                      </button>
                    </div>
                    {form.password && (
                      <div className="flex gap-1.5 px-1 pt-1">
                        {[1,2,3,4,5].map(n => (
                          <div key={n} className={`flex-1 h-1 rounded-full transition-all duration-500 ${n <= pw.score ? pw.color.replace('bg-', 'bg-') : 'bg-white/5'}`} />
                        ))}
                      </div>
                    )}
                    {errors.password && <p className="text-red-400 text-xs font-mono mt-1 pl-1">{errors.password}</p>}
                  </div>

                  <div className="space-y-2">
                    <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest pl-1">Verify Cipher</label>
                    <input
                      type="password"
                      placeholder="Repeat lock sequence"
                      className={`w-full bg-white/3 border ${errors.confirmPassword ? 'border-red-500/40' : 'border-white/5'} hover:border-white/10 focus:border-blue-500/50 rounded-2xl py-4 px-5 font-mono text-xs text-white outline-none transition-all placeholder:text-slate-800`}
                      value={form.confirmPassword}
                      onChange={e => setForm({ ...form, confirmPassword: e.target.value })}
                    />
                    {errors.confirmPassword && <p className="text-red-400 text-xs font-mono mt-1 pl-1">{errors.confirmPassword}</p>}
                  </div>
                </div>

                <Button onClick={next} variant="primary" className="w-full py-4.5 rounded-2xl bg-blue-600 hover:bg-blue-500 text-white font-black uppercase tracking-[0.2em] text-[11px] shadow-xl shadow-blue-600/20 transform hover:-translate-y-0.5 active:translate-y-0 transition-all">
                  Next Protocol Phase <Icons.ArrowRight size={16} className="ml-2" />
                </Button>
              </div>
            )}

            {/* STEP 1: Profile */}
            {step === 1 && (
              <div className="space-y-6 animate-slide-up">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest pl-1">Entity Name</label>
                    <div className="relative group">
                      <input
                        type="text"
                        placeholder="Full biological name"
                        className={`w-full bg-white/3 border ${errors.fullName ? 'border-red-500/40' : 'border-white/5'} hover:border-white/10 focus:border-blue-500/50 rounded-2xl py-4 px-5 font-mono text-xs text-white outline-none transition-all placeholder:text-slate-800`}
                        value={form.fullName}
                        onChange={e => { setForm({ ...form, fullName: e.target.value }); suggestUsername(e.target.value); }}
                      />
                    </div>
                    {errors.fullName && <p className="text-red-400 text-xs font-mono mt-1 pl-1">{errors.fullName}</p>}
                  </div>
                  <div className="space-y-2">
                    <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest pl-1">Network Handle</label>
                    <div className="relative group">
                      <input
                        type="text"
                        placeholder="Unique identifier"
                        className={`w-full bg-white/3 border ${errors.username ? 'border-red-500/40' : 'border-white/5'} hover:border-white/10 focus:border-blue-500/50 rounded-2xl py-4 px-5 font-mono text-xs text-white outline-none transition-all placeholder:text-slate-800`}
                        value={form.username}
                        onChange={e => setForm({ ...form, username: e.target.value })}
                      />
                    </div>
                    {errors.username && <p className="text-red-400 text-xs font-mono mt-1 pl-1">{errors.username}</p>}
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest pl-1">Operating Role</label>
                    <select 
                      value={form.role} 
                      onChange={e => setForm({ ...form, role: e.target.value })} 
                      className="w-full bg-white/3 border border-white/5 rounded-2xl py-4 px-5 font-mono text-xs text-white outline-none focus:border-blue-500/50 appearance-none bg-chevron-down bg-no-repeat bg-[right_1.25rem_center] bg-[length:12px]"
                    >
                      <option value="BEGINNER" className="bg-[#0A0A0F]">Junior Dev</option>
                      <option value="STUDENT" className="bg-[#0A0A0F]">Academic Node</option>
                      <option value="PROFESSIONAL" className="bg-[#0A0A0F]">Senior Architect</option>
                    </select>
                  </div>
                  <div className="space-y-2">
                    <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest pl-1">Temporal Group</label>
                    <select 
                      value={form.ageGroup} 
                      onChange={e => setForm({ ...form, ageGroup: e.target.value })} 
                      className="w-full bg-white/3 border border-white/5 rounded-2xl py-4 px-5 font-mono text-xs text-white outline-none focus:border-blue-500/50 appearance-none bg-chevron-down bg-no-repeat bg-[right_1.25rem_center] bg-[length:12px]"
                    >
                      <option value="SCHOOL" className="bg-[#0A0A0F]">Internal (School)</option>
                      <option value="COLLEGE" className="bg-[#0A0A0F]">External (College)</option>
                      <option value="WORKING" className="bg-[#0A0A0F]">Active (Working)</option>
                    </select>
                  </div>
                </div>

                <div className="flex gap-4 pt-4">
                  <button onClick={prev} className="flex-1 py-4.5 rounded-2xl bg-white/5 border border-white/5 text-slate-300 font-black uppercase tracking-[0.2em] text-[10px] hover:bg-white/10 transition-all">
                    Previous
                  </button>
                  <Button onClick={next} variant="primary" className="flex-[2] py-4.5 rounded-2xl bg-blue-600 hover:bg-blue-500 text-white font-black uppercase tracking-[0.2em] text-[11px] shadow-xl shadow-blue-600/20 transform hover:-translate-y-0.5 transition-all">
                    Proceed to Sectors
                  </Button>
                </div>
              </div>
            )}

            {/* STEP 2: Sectors */}
            {step === 2 && (
              <div className="space-y-8 animate-slide-up">
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 max-h-[320px] overflow-y-auto px-1 custom-scrollbar">
                  {LANGUAGES.map(({ id, label, icon: Ic }) => {
                    const active = form.interests.includes(id);
                    return (
                      <button key={id} type="button" onClick={() => toggleLang(id)}
                        className={`group flex flex-col items-center justify-center gap-3 p-5 rounded-[24px] border transition-all duration-300 ${
                          active
                            ? 'bg-blue-600/20 border-blue-500/50 text-white shadow-lg shadow-blue-500/10'
                            : 'bg-white/3 border-white/5 text-slate-600 hover:border-white/10 hover:text-slate-400'
                        }`}>
                        <div className={`w-10 h-10 rounded-xl flex items-center justify-center transition-all ${active ? 'bg-blue-600 text-white rotate-6' : 'bg-white/5 group-hover:scale-110'}`}>
                          <Ic size={18} />
                        </div>
                        <span className="font-mono text-[10px] font-black uppercase tracking-widest text-center">{label}</span>
                      </button>
                    );
                  })}
                </div>

                <div className="flex gap-4 pt-4">
                  <button onClick={prev} className="flex-1 py-4.5 rounded-2xl bg-white/5 border border-white/5 text-slate-300 font-black uppercase tracking-[0.2em] text-[10px] hover:bg-white/10 transition-all">
                    Back
                  </button>
                  <Button onClick={handleSubmit} variant="primary" className="flex-[2] py-4.5 rounded-2xl bg-blue-600 hover:bg-blue-500 text-white font-black uppercase tracking-[0.2em] text-[11px] shadow-xl shadow-blue-600/20 transform hover:-translate-y-0.5 transition-all" loading={isLoading}>
                    Initialize Connection →
                  </Button>
                </div>
              </div>
            )}
          </div>

          <p className="text-center mt-12 text-[11px] font-medium text-slate-600">
            Node already registered? <Link to="/login" className="text-white font-black hover:text-blue-400 transition-colors tracking-widest uppercase">SIGN IN →</Link>
          </p>
        </div>
      </div>
    </div>
  );
}
