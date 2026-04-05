import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuthStore } from '@/store';
import { Code, Check, ArrowRight, ArrowLeft, Zap, Terminal, Settings, Shield } from 'lucide-react';
import { Spinner } from '@/components/ui';
import toast from 'react-hot-toast';

const STEPS = [
  { id: 'account',   label: 'CREDENTIALS' },
  { id: 'profile',   label: 'IDENTITY' },
  { id: 'interests', label: 'TECH STACK' },
];

const LANGUAGES = [
  { id: 'javascript', label: 'JAVASCRIPT', Icon: Zap },
  { id: 'python',     label: 'PYTHON',     Icon: Terminal },
  { id: 'java',       label: 'JAVA',       Icon: Terminal },
  { id: 'cpp',        label: 'C++',        Icon: Settings },
  { id: 'go',         label: 'GO',         Icon: Zap },
  { id: 'rust',       label: 'RUST',       Icon: Shield },
];

function FieldInput({ label, error, ...props }) {
  return (
    <div>
      <label className="font-mono text-[10px] font-black text-[#666] uppercase tracking-[0.15em] block mb-1.5">{label}</label>
      <input
        className={`w-full bg-white/[0.03] border rounded-[4px] px-4 py-3 text-white placeholder:text-[#333] focus:outline-none focus:border-cyber transition-all duration-150 text-sm font-sans ${error ? 'border-crimson' : 'border-white/[0.08]'}`}
        {...props}
      />
      {error && <p className="font-mono text-[10px] text-crimson mt-1.5 uppercase tracking-wider">{error}</p>}
    </div>
  );
}

function FieldSelect({ label, error, children, ...props }) {
  return (
    <div>
      <label className="font-mono text-[10px] font-black text-[#666] uppercase tracking-[0.15em] block mb-1.5">{label}</label>
      <select
        className={`w-full bg-white/[0.03] border rounded-[4px] px-4 py-3 text-white focus:outline-none focus:border-cyber transition-all duration-150 text-sm appearance-none cursor-pointer ${error ? 'border-crimson' : 'border-white/[0.08]'}`}
        {...props}
      >
        {children}
      </select>
    </div>
  );
}

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

  useEffect(() => { setMounted(true); }, []);

  const suggestUsername = (name) => {
    if (form.username || !name) return;
    const base = name.toLowerCase().replace(/[^a-z0-9]/g, '');
    const num  = Math.floor(Math.random() * 900) + 100;
    setForm(prev => ({ ...prev, username: `${base}${num}` }));
  };

  const toggleLang = (id) =>
    setForm(prev => ({
      ...prev,
      interests: prev.interests.includes(id)
        ? prev.interests.filter(i => i !== id)
        : [...prev.interests, id]
    }));

  const validate = () => {
    const e = {};
    if (step === 0) {
      if (!form.email)    e.email = 'REQUIRED';
      else if (!/\S+@\S+\.\S+/.test(form.email)) e.email = 'INVALID FORMAT';
      if (!form.password) e.password = 'REQUIRED';
      else if (form.password.length < 6) e.password = 'MIN 6 CHARACTERS';
      if (form.password !== form.confirmPassword) e.confirmPassword = 'PASSWORDS MISMATCH';
    } else if (step === 1) {
      if (!form.fullName) e.fullName = 'REQUIRED';
      if (!form.username) e.username = 'REQUIRED';
      else if (form.username.length < 3) e.username = 'MIN 3 CHARACTERS';
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
    if (res.ok) { toast.success('OPERATIVE REGISTERED'); navigate('/dashboard'); }
    else toast.error(res.error || 'REGISTRATION FAILED');
  };

  return (
    <div className="min-h-screen bg-black flex font-sans text-white">

      {/* ─── LEFT PANEL ─── */}
      <div
        className="hidden lg:flex flex-col justify-between w-[44%] p-12 relative overflow-hidden bg-grid"
        style={{ borderRight: '1px solid rgba(255,255,255,0.06)' }}
      >
        <div className="absolute top-0 left-0 right-0 h-px bg-cyber/30" />

        <Link to="/" className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-[4px] border border-cyber/30 flex items-center justify-center">
            <Code size={14} strokeWidth={1.5} className="text-cyber" />
          </div>
          <span className="font-mono font-black text-sm text-white tracking-[0.15em] uppercase">SkillForge</span>
        </Link>

        <div>
          <p className="font-mono text-[10px] font-black text-[#333] uppercase tracking-[0.25em] mb-4">NEW OPERATIVE</p>
          <h2 className="font-black text-4xl text-white leading-[1.05] tracking-tight mb-6">
            BUILD YOUR<br />PROOF.
          </h2>
          <p className="text-[#555] text-sm leading-relaxed max-w-xs mb-10">
            Create an account to track progress, compete globally, and build an undeniable portfolio.
          </p>

          {/* Status blades */}
          <div className="space-y-2">
            {[
              { label: 'LATENCY', val: '12MS', color: '#10B981' },
              { label: 'UPTIME',  val: '99.9%', color: '#3B82F6' },
            ].map(({ label, val, color }) => (
              <div
                key={label}
                className="flex items-center justify-between px-4 py-3 rounded-[4px]"
                style={{ border: '1px solid rgba(255,255,255,0.06)', background: 'rgba(255,255,255,0.02)' }}
              >
                <span className="font-mono text-[9px] font-black text-[#555] uppercase tracking-[0.2em]">{label}</span>
                <span className="font-mono font-black text-base" style={{ color }}>{val}</span>
              </div>
            ))}
          </div>
        </div>

        <div className="flex items-center gap-8 pt-8" style={{ borderTop: '1px solid rgba(255,255,255,0.06)' }}>
          {[['100%', 'FREE TO PLAY'], ['0 BS.', 'JUST CODE']].map(([val, lbl]) => (
            <div key={lbl}>
              <p className="font-mono font-black text-2xl text-white">{val}</p>
              <p className="font-mono text-[9px] font-bold text-[#444] uppercase tracking-[0.2em] mt-0.5">{lbl}</p>
            </div>
          ))}
        </div>
      </div>

      {/* ─── RIGHT PANEL ─── */}
      <div
        className={`flex-1 flex flex-col justify-center px-8 lg:px-16 transition-all duration-500 ${mounted ? 'opacity-100' : 'opacity-0'}`}
      >
        <div className="w-full max-w-md mx-auto">

          {/* Mobile Logo */}
          <Link to="/" className="flex items-center gap-3 justify-center mb-10 lg:hidden">
            <div className="w-8 h-8 rounded-[4px] border border-cyber/30 flex items-center justify-center">
              <Code size={14} strokeWidth={1.5} className="text-cyber" />
            </div>
            <span className="font-mono font-black text-sm text-white tracking-[0.15em] uppercase">SkillForge</span>
          </Link>

          <div className="mb-8">
            <h1 className="font-black text-2xl text-white tracking-tight mb-1 uppercase">CREATE ACCOUNT</h1>
            <p className="text-[#555] text-sm">Free forever. No credit card required.</p>
          </div>

          {/* Step indicator */}
          <div className="flex items-center gap-0 mb-8 border border-white/[0.06] rounded-[4px] overflow-hidden">
            {STEPS.map((s, i) => (
              <div
                key={i}
                className="flex-1 flex items-center justify-center gap-2 py-2.5 border-r border-white/[0.06] last:border-r-0 relative"
                style={{
                  background: i < step ? 'rgba(16,185,129,0.06)' : i === step ? 'rgba(59,130,246,0.08)' : 'transparent',
                }}
              >
                <div
                  className="w-4 h-4 rounded-[2px] flex items-center justify-center font-mono text-[9px] font-black flex-shrink-0"
                  style={{
                    background: i < step ? 'rgba(16,185,129,0.2)' : i === step ? '#3B82F6' : 'rgba(255,255,255,0.06)',
                    color: i < step ? '#10B981' : i === step ? '#FFF' : '#444',
                  }}
                >
                  {i < step ? <Check size={9} strokeWidth={2.5} /> : i + 1}
                </div>
                <span
                  className="font-mono text-[9px] font-black uppercase tracking-[0.1em] hidden sm:block"
                  style={{ color: i === step ? '#FFF' : i < step ? '#10B981' : '#444' }}
                >
                  {s.label}
                </span>
              </div>
            ))}
          </div>

          {/* STEP 0 — Credentials */}
          {step === 0 && (
            <div className="space-y-4 animate-fade-in">
              <a
                href="/api/auth/google"
                className="flex items-center justify-center gap-3 w-full py-3 rounded-[4px] border border-white/[0.08] bg-white/[0.02] hover:border-white/20 transition-all duration-150 font-mono text-[11px] font-bold text-white uppercase tracking-wider mb-2"
              >
                <svg width="16" height="16" viewBox="0 0 24 24">
                  <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4"/>
                  <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/>
                  <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05"/>
                  <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/>
                </svg>
                REGISTER WITH GOOGLE
              </a>

              <div className="flex items-center gap-3">
                <div className="flex-1 h-px bg-white/[0.06]" />
                <span className="font-mono text-[9px] font-bold text-[#333] uppercase tracking-[0.15em]">OR FORM</span>
                <div className="flex-1 h-px bg-white/[0.06]" />
              </div>

              <FieldInput label="EMAIL ADDRESS" type="email" placeholder="you@example.com"
                value={form.email} error={errors.email}
                onChange={e => setForm({ ...form, email: e.target.value })} />
              <FieldInput label="PASSWORD" type="password" placeholder="min 6 characters"
                value={form.password} error={errors.password}
                onChange={e => setForm({ ...form, password: e.target.value })} />
              <FieldInput label="CONFIRM PASSWORD" type="password" placeholder="repeat password"
                value={form.confirmPassword} error={errors.confirmPassword}
                onChange={e => setForm({ ...form, confirmPassword: e.target.value })} />

              <button onClick={next} className="w-full btn-primary py-3.5 text-xs justify-center mt-2">
                CONTINUE <ArrowRight size={12} strokeWidth={1.5} />
              </button>
            </div>
          )}

          {/* STEP 1 — Identity */}
          {step === 1 && (
            <div className="space-y-4 animate-fade-in">
              <FieldInput label="FULL NAME" type="text" placeholder="John Doe"
                value={form.fullName} error={errors.fullName}
                onChange={e => { setForm({ ...form, fullName: e.target.value }); suggestUsername(e.target.value); }} />
              <FieldInput label="USERNAME" type="text" placeholder="coder_zero"
                value={form.username} error={errors.username}
                onChange={e => setForm({ ...form, username: e.target.value })} />
              <div className="grid grid-cols-2 gap-3">
                <FieldSelect label="I AM A" value={form.role} onChange={e => setForm({ ...form, role: e.target.value })}>
                  <option value="BEGINNER">BEGINNER</option>
                  <option value="STUDENT">STUDENT</option>
                  <option value="PROFESSIONAL">PROFESSIONAL</option>
                </FieldSelect>
                <FieldSelect label="AGE GROUP" value={form.ageGroup} onChange={e => setForm({ ...form, ageGroup: e.target.value })}>
                  <option value="SCHOOL">SCHOOL</option>
                  <option value="COLLEGE">COLLEGE</option>
                  <option value="WORKING">WORKING</option>
                </FieldSelect>
              </div>
              <div className="flex gap-3 pt-2">
                <button onClick={prev} className="btn-secondary flex-1 text-[11px] py-3">
                  <ArrowLeft size={12} strokeWidth={1.5} /> BACK
                </button>
                <button onClick={next} className="btn-primary flex-1 text-[11px] py-3">
                  CONTINUE <ArrowRight size={12} strokeWidth={1.5} />
                </button>
              </div>
            </div>
          )}

          {/* STEP 2 — Tech Stack */}
          {step === 2 && (
            <div className="space-y-4 animate-fade-in">
              <div>
                <label className="font-mono text-[10px] font-black text-[#666] uppercase tracking-[0.15em] block mb-3">
                  SELECT TECH STACK
                </label>
                <div className="grid grid-cols-2 gap-2">
                  {LANGUAGES.map(({ id, label, Icon }) => {
                    const active = form.interests.includes(id);
                    return (
                      <button
                        key={id}
                        type="button"
                        onClick={() => toggleLang(id)}
                        className="flex items-center gap-3 p-3.5 rounded-[4px] border text-left transition-all duration-150"
                        style={{
                          border: `1px solid ${active ? 'rgba(59,130,246,0.35)' : 'rgba(255,255,255,0.06)'}`,
                          background: active ? 'rgba(59,130,246,0.08)' : 'rgba(255,255,255,0.02)',
                        }}
                      >
                        <div
                          className="w-7 h-7 rounded-[4px] flex items-center justify-center flex-shrink-0 transition-all duration-150"
                          style={{
                            background: active ? 'rgba(59,130,246,0.15)' : 'rgba(255,255,255,0.04)',
                          }}
                        >
                          <Icon size={13} strokeWidth={1.5} className={active ? 'text-cyber' : 'text-[#444]'} />
                        </div>
                        <span className={`font-mono text-[11px] font-black uppercase tracking-wider truncate ${active ? 'text-cyber' : 'text-[#666]'}`}>{label}</span>
                        {active && <Check size={11} strokeWidth={2.5} className="text-cyber ml-auto flex-shrink-0" />}
                      </button>
                    );
                  })}
                </div>
              </div>
              <div className="flex gap-3 pt-2">
                <button onClick={prev} className="btn-secondary flex-1 text-[11px] py-3">
                  <ArrowLeft size={12} strokeWidth={1.5} /> BACK
                </button>
                <button onClick={handleSubmit} disabled={isLoading} className="btn-primary flex-1 text-[11px] py-3 disabled:opacity-50">
                  {isLoading ? <Spinner size={13} /> : <><Zap size={12} strokeWidth={1.5} /> LAUNCH</>}
                </button>
              </div>
            </div>
          )}

          <p className="text-center text-sm text-[#444] mt-8">
            Already registered?{' '}
            <Link to="/login" className="font-mono text-xs font-bold text-cyber hover:text-white transition-colors uppercase tracking-wider">
              SIGN IN
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}
