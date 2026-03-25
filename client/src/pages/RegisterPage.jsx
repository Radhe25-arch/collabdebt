import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuthStore } from '@/store';
import Icons from '@/assets/icons';
import toast from 'react-hot-toast';

const STEPS = [
  { id: 'account', label: 'Account Details' },
  { id: 'profile', label: 'Personal Profile' },
  { id: 'interests', label: 'Tech Stack' }
];

const LANGUAGES = [
  { id: 'javascript', label: 'JavaScript', icon: Icons.Terminal },
  { id: 'python', label: 'Python', icon: Icons.Code },
  { id: 'java', label: 'Java', icon: Icons.Box },
  { id: 'cpp', label: 'C++', icon: Icons.Settings },
  { id: 'go', label: 'Go', icon: Icons.Zap },
  { id: 'rust', label: 'Rust', icon: Icons.Shield },
];

export default function RegisterPage() {
  const { register, isLoading } = useAuthStore();
  const navigate = useNavigate();
  const [mounted, setMounted] = useState(false);
  
  const [step, setStep] = useState(0);
  const [form, setForm] = useState({
    fullName: '', username: '', 
    email: '', password: '', confirmPassword: '',
    role: 'BEGINNER', ageGroup: 'WORKING', interests: []
  });
  const [errors, setErrors] = useState({});
  const [showPw, setShowPw] = useState(false);

  useEffect(() => { setMounted(true); }, []);

  const suggestUsername = (name) => {
    if (form.username || !name) return;
    const base = name.toLowerCase().replace(/[^a-z0-9]/g, '');
    const num = Math.floor(Math.random() * 900) + 100;
    setForm(prev => ({ ...prev, username: `${base}${num}` }));
  };

  const toggleLang = (id) => {
    setForm(prev => ({
      ...prev,
      interests: prev.interests.includes(id)
        ? prev.interests.filter(i => i !== id)
        : [...prev.interests, id]
    }));
  };

  const validate = () => {
    const e = {};
    if (step === 0) {
      if (!form.email) e.email = 'Required';
      else if (!/\S+@\S+\.\S+/.test(form.email)) e.email = 'Invalid format';
      if (!form.password) e.password = 'Required';
      else if (form.password.length < 6) e.password = 'Min 6 characters';
      if (form.password !== form.confirmPassword) e.confirmPassword = 'Passwords mismatch';
    } else if (step === 1) {
      if (!form.fullName) e.fullName = 'Required';
      if (!form.username) e.username = 'Required';
      else if (form.username.length < 3) e.username = 'Min 3 characters';
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
      toast.success('Account created successfully');
      navigate('/dashboard');
    } else {
      toast.error(res.error || 'Registration failed');
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
            Create an account to start tracking your progress, competing globally, and building an undeniable portfolio.
          </p>
          
          <div className="space-y-4 max-w-sm">
            {[
              { label: 'Latency', val: '12ms', color: 'text-green-600', bg: 'bg-green-50' },
              { label: 'Uptime',  val: '99.9%', color: 'text-blue-600', bg: 'bg-blue-50' },
            ].map((stat, i) => (
              <div key={i} className="flex items-center justify-between p-4 rounded-xl border border-slate-100 bg-white shadow-sm">
                <span className="text-xs font-semibold text-slate-500 uppercase tracking-widest">{stat.label}</span>
                <span className={`font-display font-bold text-lg ${stat.color}`}>{stat.val}</span>
              </div>
            ))}
          </div>
        </div>

        <div className="relative z-10 flex items-center gap-8 border-t border-slate-100 pt-8 mt-12">
          <div>
            <p className="font-display font-black text-2xl text-slate-900">100%</p>
            <p className="text-xs font-semibold text-slate-400">Free to Play</p>
          </div>
          <div className="w-px h-8 bg-slate-200" />
          <div>
            <p className="font-display font-black text-2xl text-slate-900">0 BS.</p>
            <p className="text-xs font-semibold text-slate-400">Just code</p>
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

          <div className="mb-6 text-center lg:text-left">
            <h1 className="font-display font-black text-3xl text-slate-900 mb-2">Create account</h1>
            <p className="text-slate-500 text-sm font-medium">Free forever. No credit card required.</p>
          </div>

          <div className="flex items-center gap-2 mb-8 select-none">
            {STEPS.map((s, i) => (
              <div key={i} className="flex items-center gap-2 flex-1 last:flex-none">
                <div className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold transition-all ${
                  i < step  ? 'bg-blue-100 text-blue-600' :
                  i === step ? 'bg-blue-600 text-white shadow-md shadow-blue-200' :
                               'bg-white border border-slate-200 text-slate-400'
                }`}>
                  {i < step ? <Icons.Check size={14} /> : i + 1}
                </div>
                <span className={`text-[10px] font-bold uppercase tracking-widest hidden sm:block ${i === step ? 'text-slate-900' : 'text-slate-400'}`}>
                  {s.label}
                </span>
                {i < STEPS.length - 1 && (
                  <div className={`flex-1 h-px mx-2 ${i < step ? 'bg-blue-200' : 'bg-slate-200'}`} />
                )}
              </div>
            ))}
          </div>

          {/* STEP 0 — Account */}
          {step === 0 && (
            <div className="space-y-4 animate-fade-in">
              <a href="/api/auth/google" className="flex items-center justify-center gap-3 w-full py-3.5 rounded-xl bg-white border border-slate-200 hover:border-blue-200 hover:bg-blue-50 transition-all font-semibold text-slate-700 text-sm shadow-sm group mb-6">
                <svg width="18" height="18" viewBox="0 0 24 24">
                  <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4"/>
                  <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/>
                  <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05"/>
                  <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/>
                </svg>
                Sign up with Google
              </a>

              <div className="flex items-center gap-4 mb-6">
                <div className="flex-1 h-px bg-slate-200" />
                <span className="text-xs font-semibold text-slate-400 uppercase tracking-widest">Or Form Data</span>
                <div className="flex-1 h-px bg-slate-200" />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1.5 uppercase tracking-wide">Email address</label>
                <input type="email" placeholder="you@example.com"
                  value={form.email} onChange={e => setForm({ ...form, email: e.target.value })}
                  className={`w-full bg-white border ${errors.email ? 'border-red-300 ring-4 ring-red-50' : 'border-slate-200'} rounded-xl px-4 py-3 placeholder-slate-400 text-slate-900 focus:outline-none focus:border-blue-500 focus:ring-4 focus:ring-blue-50 transition-all text-sm`} />
                {errors.email && <p className="text-xs font-semibold text-red-500 mt-1.5">{errors.email}</p>}
              </div>
              
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1.5 uppercase tracking-wide">Password</label>
                <div className="relative text-slate-400 focus-within:text-blue-500">
                  <input type={showPw ? 'text' : 'password'} placeholder="min 6 characters"
                    value={form.password} onChange={e => setForm({ ...form, password: e.target.value })}
                    className={`w-full bg-white border ${errors.password ? 'border-red-300 ring-4 ring-red-50' : 'border-slate-200'} rounded-xl px-4 py-3 pr-10 placeholder-slate-400 text-slate-900 focus:outline-none focus:border-blue-500 focus:ring-4 focus:ring-blue-50 transition-all text-sm`} />
                  <button type="button" onClick={() => setShowPw(v => !v)} className="absolute right-3 top-1/2 -translate-y-1/2 p-1 hover:bg-slate-100 rounded-md transition-colors">
                    <Icons.Check size={16} className={showPw ? 'text-blue-600' : 'text-slate-400'} />
                  </button>
                </div>
                {errors.password && <p className="text-xs font-semibold text-red-500 mt-1.5">{errors.password}</p>}
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1.5 uppercase tracking-wide">Confirm password</label>
                <input type="password" placeholder="repeat password"
                  value={form.confirmPassword} onChange={e => setForm({ ...form, confirmPassword: e.target.value })}
                  className={`w-full bg-white border ${errors.confirmPassword ? 'border-red-300 ring-4 ring-red-50' : 'border-slate-200'} rounded-xl px-4 py-3 placeholder-slate-400 text-slate-900 focus:outline-none focus:border-blue-500 focus:ring-4 focus:ring-blue-50 transition-all text-sm`} />
                {errors.confirmPassword && <p className="text-xs font-semibold text-red-500 mt-1.5">{errors.confirmPassword}</p>}
              </div>

              <button onClick={next} className="w-full flex items-center justify-center gap-2 bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-xl py-3.5 mt-2 transition-all shadow-sm hover:shadow-md hover:shadow-blue-200">
                Continue <Icons.ArrowRight size={16} />
              </button>
            </div>
          )}

          {/* STEP 1 — Profile */}
          {step === 1 && (
            <div className="space-y-4 animate-fade-in">
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1.5 uppercase tracking-wide">Full name</label>
                <input type="text" placeholder="John Doe"
                  value={form.fullName}
                  onChange={e => { setForm({ ...form, fullName: e.target.value }); suggestUsername(e.target.value); }}
                  className={`w-full bg-white border ${errors.fullName ? 'border-red-300 ring-4 ring-red-50' : 'border-slate-200'} rounded-xl px-4 py-3 placeholder-slate-400 text-slate-900 focus:outline-none focus:border-blue-500 focus:ring-4 focus:ring-blue-50 transition-all text-sm`} />
                {errors.fullName && <p className="text-xs font-semibold text-red-500 mt-1.5">{errors.fullName}</p>}
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1.5 uppercase tracking-wide">Username</label>
                <input type="text" placeholder="coder_zero"
                  value={form.username} onChange={e => setForm({ ...form, username: e.target.value })}
                  className={`w-full bg-white border ${errors.username ? 'border-red-300 ring-4 ring-red-50' : 'border-slate-200'} rounded-xl px-4 py-3 placeholder-slate-400 text-slate-900 focus:outline-none focus:border-blue-500 focus:ring-4 focus:ring-blue-50 transition-all text-sm`} />
                {errors.username && <p className="text-xs font-semibold text-red-500 mt-1.5">{errors.username}</p>}
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1.5 uppercase tracking-wide">I am a</label>
                  <select value={form.role} onChange={e => setForm({ ...form, role: e.target.value })} 
                    className="w-full bg-white border border-slate-200 rounded-xl px-4 py-3 text-slate-900 focus:outline-none focus:border-blue-500 focus:ring-4 focus:ring-blue-50 transition-all text-sm appearance-none">
                    <option value="BEGINNER">Beginner</option>
                    <option value="STUDENT">Student</option>
                    <option value="PROFESSIONAL">Professional</option>
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1.5 uppercase tracking-wide">Age group</label>
                  <select value={form.ageGroup} onChange={e => setForm({ ...form, ageGroup: e.target.value })} 
                    className="w-full bg-white border border-slate-200 rounded-xl px-4 py-3 text-slate-900 focus:outline-none focus:border-blue-500 focus:ring-4 focus:ring-blue-50 transition-all text-sm appearance-none">
                    <option value="SCHOOL">School</option>
                    <option value="COLLEGE">College</option>
                    <option value="WORKING">Working</option>
                  </select>
                </div>
              </div>

              <div className="flex gap-3 pt-2">
                <button onClick={prev} className="flex-1 flex items-center justify-center gap-2 bg-white hover:bg-slate-50 text-slate-700 font-semibold rounded-xl py-3.5 transition-all shadow-sm shadow-slate-200/50 border border-slate-200">
                  <Icons.ArrowLeft size={16} /> Back
                </button>
                <button onClick={next} className="flex-1 flex items-center justify-center gap-2 bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-xl py-3.5 transition-all shadow-sm hover:shadow-md hover:shadow-blue-200">
                  Continue <Icons.ArrowRight size={16} />
                </button>
              </div>
            </div>
          )}

          {/* STEP 2 — Languages */}
          {step === 2 && (
            <div className="space-y-4 animate-fade-in">
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-3 uppercase tracking-wide">Select Tech Stack</label>
                <div className="grid grid-cols-2 gap-2">
                  {LANGUAGES.map(({ id, label, icon: Ic }) => {
                    const active = form.interests.includes(id);
                    return (
                      <button key={id} type="button" onClick={() => toggleLang(id)}
                        className={`flex items-center gap-3 p-3.5 rounded-xl border transition-all text-left group ${
                          active
                            ? 'bg-blue-50 border-blue-500 text-blue-700 shadow-sm shadow-blue-100'
                            : 'bg-white border-slate-200 text-slate-600 hover:border-blue-300 hover:bg-blue-50'
                        }`}>
                        <div className={`w-7 h-7 rounded-md flex items-center justify-center flex-shrink-0 transition-colors ${active ? 'bg-blue-600 text-white shadow-sm' : 'bg-slate-100 text-slate-500 group-hover:bg-blue-100 group-hover:text-blue-600'}`}>
                          <Ic size={14} />
                        </div>
                        <span className="font-semibold text-sm truncate">{label}</span>
                        {active && <Icons.Check size={14} className="text-blue-600 ml-auto flex-shrink-0" />}
                      </button>
                    );
                  })}
                </div>
              </div>

              <div className="flex gap-3 pt-4">
                <button onClick={prev} className="flex-1 flex items-center justify-center gap-2 bg-white hover:bg-slate-50 text-slate-700 font-semibold rounded-xl py-3.5 transition-all shadow-sm shadow-slate-200/50 border border-slate-200">
                  <Icons.ArrowLeft size={16} /> Back
                </button>
                <button onClick={handleSubmit} disabled={isLoading} className="flex-1 flex items-center justify-center gap-2 bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-xl py-3.5 transition-all shadow-sm hover:shadow-md hover:shadow-blue-200 disabled:opacity-50 disabled:cursor-not-allowed">
                  {isLoading ? <span className="animate-spin w-4 h-4 border-2 border-white/20 border-t-white rounded-full"></span> : <><Icons.Zap size={16} /> Finish Setup</>}
                </button>
              </div>
            </div>
          )}

          <p className="text-center text-sm text-slate-500 font-medium mt-8">
            Already registered?{' '}
            <Link to="/login" className="text-blue-600 font-semibold hover:text-blue-700">Sign in here</Link>
          </p>

        </div>
      </div>
    </div>
  );
}
