import { useState } from 'react';
import { useAuthStore } from '@/store';
import api, { setAccessToken } from '@/lib/api';
import { Check, ArrowRight, ArrowLeft, Zap, Code } from 'lucide-react';

const INTERESTS_BY_ROLE = {
  STUDENT:      ['JAVASCRIPT','PYTHON','JAVA','C++','C','DATA STRUCTURES','WEB DEV','SQL','MACHINE LEARNING','MOBILE DEV','TYPESCRIPT','KOTLIN','SWIFT','BASH','CYBERSECURITY'],
  BEGINNER:     ['PYTHON','JAVASCRIPT','WEB DEV','SQL','BASH','C','JAVA','DATA STRUCTURES','GAME DEV','MOBILE DEV','TYPESCRIPT','PHP','RUBY','CLOUD','DEVOPS'],
  PROFESSIONAL: ['TYPESCRIPT','RUST','GO','KOTLIN','SWIFT','DEVOPS','CLOUD','CYBERSECURITY','MACHINE LEARNING','DATA STRUCTURES','SQL','BASH','JAVA','PYTHON','C++'],
};

const ROLE_OPTIONS = [
  { value: 'STUDENT',      label: 'STUDENT',      desc: 'Currently studying in school or college' },
  { value: 'BEGINNER',     label: 'SELF-TAUGHT',  desc: 'Learning on my own, just getting started' },
  { value: 'PROFESSIONAL', label: 'PROFESSIONAL', desc: 'Already in the industry, leveling up' },
];

const AGE_BY_ROLE = {
  STUDENT:      [{ value: 'SCHOOL', label: 'SCHOOL (UP TO 12TH)' }, { value: 'COLLEGE', label: 'COLLEGE / UNIVERSITY' }],
  BEGINNER:     [{ value: 'SCHOOL', label: 'STILL IN SCHOOL' }, { value: 'COLLEGE', label: 'COLLEGE GOING' }, { value: 'WORKING', label: 'WORKING / GRADUATE' }],
  PROFESSIONAL: [{ value: 'COLLEGE', label: 'FRESH GRADUATE' }, { value: 'WORKING', label: 'EXPERIENCED DEV' }],
};

const GOAL_BY_ROLE = {
  STUDENT:      ['CRACK PLACEMENTS','LEARN FOR EXAMS','BUILD PROJECTS','COMPETITIVE CODING','JUST EXPLORING'],
  BEGINNER:     ['GET FIRST JOB','BUILD A WEBSITE','LEARN FOR FUN','SWITCH TO TECH','BUILD MOBILE APPS'],
  PROFESSIONAL: ['UPSKILL FOR PROMOTION','LEARN NEW LANGUAGE','SYSTEM DESIGN','SWITCH DOMAIN','STAY UPDATED'],
};

function OptionButton({ selected, onClick, label, desc }) {
  return (
    <button
      onClick={onClick}
      className="w-full p-4 rounded-[4px] text-left transition-all duration-150 flex items-center gap-4"
      style={{
        border: `1px solid ${selected ? 'rgba(59,130,246,0.35)' : 'rgba(255,255,255,0.06)'}`,
        background: selected ? 'rgba(59,130,246,0.08)' : 'rgba(255,255,255,0.02)',
      }}
    >
      <div className="flex-1">
        <p className={`font-mono text-[12px] font-black uppercase tracking-wider ${selected ? 'text-cyber' : 'text-white'}`}>{label}</p>
        {desc && <p className="font-mono text-[10px] text-[#555] mt-0.5">{desc}</p>}
      </div>
      {selected && <Check size={13} strokeWidth={2} className="text-cyber flex-shrink-0" />}
    </button>
  );
}

export default function OnboardingPage() {
  const { updateUser } = useAuthStore();
  const [step, setStep]     = useState(1);
  const [loading, setLoading] = useState(false);
  const [form, setForm]     = useState({ role: '', ageGroup: '', goal: '', interests: [] });

  const toggleInterest = i => setForm(f => ({
    ...f, interests: f.interests.includes(i) ? f.interests.filter(x => x !== i) : [...f.interests, i],
  }));

  const handleFinish = async () => {
    setLoading(true);
    try {
      try {
        const { data: r } = await api.post('/auth/refresh', {}, { withCredentials: true });
        setAccessToken(r.accessToken);
      } catch {}
      const { data } = await api.patch('/users/me', { role: form.role, ageGroup: form.ageGroup, interests: form.interests, onboarded: true });
      const stored = JSON.parse(localStorage.getItem('skillforge-auth') || '{}');
      if (stored.state) { stored.state.user = { ...stored.state.user, ...data.user }; stored.state.isAuthenticated = true; localStorage.setItem('skillforge-auth', JSON.stringify(stored)); }
      updateUser(data.user);
      window.location.href = '/dashboard';
    } catch (e) { console.error(e); setLoading(false); }
  };

  const TOTAL_STEPS = 4;

  return (
    <div className="min-h-screen bg-black bg-grid flex items-center justify-center px-4">
      <div className="w-full max-w-lg">

        {/* Logo */}
        <div className="flex items-center gap-3 justify-center mb-10">
          <div className="w-8 h-8 rounded-[4px] border border-cyber/30 flex items-center justify-center">
            <Code size={14} strokeWidth={1.5} className="text-cyber" />
          </div>
          <span className="font-mono font-black text-sm text-white tracking-[0.15em] uppercase">SkillForge</span>
        </div>

        {/* Progress bar — mechanical */}
        <div className="flex gap-1 mb-8">
          {Array.from({ length: TOTAL_STEPS }).map((_, i) => (
            <div
              key={i}
              className="flex-1 h-[2px] transition-all duration-300"
              style={{ background: step > i ? '#3B82F6' : 'rgba(255,255,255,0.06)' }}
            />
          ))}
        </div>
        <p className="font-mono text-[9px] font-black text-[#444] uppercase tracking-[0.25em] text-right mb-6">
          STEP {step} OF {TOTAL_STEPS}
        </p>

        {/* STEP 1 — Role */}
        {step === 1 && (
          <div className="animate-fade-in space-y-4">
            <div className="mb-6">
              <h1 className="font-black text-2xl text-white tracking-tight uppercase mb-1">IDENTIFY YOURSELF</h1>
              <p className="font-mono text-[11px] text-[#555]">// WE'LL PERSONALIZE YOUR LEARNING PATH</p>
            </div>
            {ROLE_OPTIONS.map(r => (
              <OptionButton key={r.value} selected={form.role === r.value} onClick={() => setForm(f => ({ ...f, role: r.value, ageGroup: '', goal: '', interests: [] }))} label={r.label} desc={r.desc} />
            ))}
            <button disabled={!form.role} onClick={() => setStep(2)} className="btn-primary w-full py-3.5 text-xs justify-center mt-4 disabled:opacity-40">
              CONTINUE <ArrowRight size={12} strokeWidth={1.5} />
            </button>
          </div>
        )}

        {/* STEP 2 — Age */}
        {step === 2 && form.role && (
          <div className="animate-fade-in space-y-4">
            <div className="mb-6">
              <h1 className="font-black text-2xl text-white tracking-tight uppercase mb-1">CURRENT STATUS</h1>
              <p className="font-mono text-[11px] text-[#555]">// MATCH CONTENT TO YOUR LEVEL</p>
            </div>
            {AGE_BY_ROLE[form.role].map(a => (
              <OptionButton key={a.value} selected={form.ageGroup === a.value} onClick={() => setForm(f => ({ ...f, ageGroup: a.value }))} label={a.label} />
            ))}
            <div className="flex gap-3 mt-4">
              <button onClick={() => setStep(1)} className="btn-secondary flex-1 text-[11px] py-3">
                <ArrowLeft size={12} strokeWidth={1.5} /> BACK
              </button>
              <button disabled={!form.ageGroup} onClick={() => setStep(3)} className="btn-primary flex-1 text-[11px] py-3 disabled:opacity-40">
                CONTINUE <ArrowRight size={12} strokeWidth={1.5} />
              </button>
            </div>
          </div>
        )}

        {/* STEP 3 — Goal */}
        {step === 3 && form.role && (
          <div className="animate-fade-in space-y-3">
            <div className="mb-6">
              <h1 className="font-black text-2xl text-white tracking-tight uppercase mb-1">PRIMARY OBJECTIVE</h1>
              <p className="font-mono text-[11px] text-[#555]">// FOCUS YOUR TRAINING PATH</p>
            </div>
            {GOAL_BY_ROLE[form.role].map(g => (
              <OptionButton key={g} selected={form.goal === g} onClick={() => setForm(f => ({ ...f, goal: g }))} label={g} />
            ))}
            <div className="flex gap-3 mt-4">
              <button onClick={() => setStep(2)} className="btn-secondary flex-1 text-[11px] py-3">
                <ArrowLeft size={12} strokeWidth={1.5} /> BACK
              </button>
              <button disabled={!form.goal} onClick={() => setStep(4)} className="btn-primary flex-1 text-[11px] py-3 disabled:opacity-40">
                CONTINUE <ArrowRight size={12} strokeWidth={1.5} />
              </button>
            </div>
          </div>
        )}

        {/* STEP 4 — Interests */}
        {step === 4 && form.role && (
          <div className="animate-fade-in">
            <div className="mb-6">
              <h1 className="font-black text-2xl text-white tracking-tight uppercase mb-1">SELECT TECH STACK</h1>
              <p className="font-mono text-[11px] text-[#555]">// PICK AT LEAST 3 DOMAINS TO MASTER</p>
            </div>
            <div className="flex flex-wrap gap-1.5 max-h-64 overflow-y-auto custom-scrollbar pb-2 mb-4">
              {INTERESTS_BY_ROLE[form.role].map(i => (
                <button
                  key={i}
                  onClick={() => toggleInterest(i)}
                  className="px-3 py-1.5 rounded-[4px] font-mono text-[10px] font-black uppercase tracking-wider transition-all duration-150"
                  style={{
                    border: `1px solid ${form.interests.includes(i) ? 'rgba(59,130,246,0.35)' : 'rgba(255,255,255,0.06)'}`,
                    background: form.interests.includes(i) ? 'rgba(59,130,246,0.1)' : 'rgba(255,255,255,0.02)',
                    color: form.interests.includes(i) ? '#3B82F6' : '#666',
                  }}
                >
                  {i}
                </button>
              ))}
            </div>
            <p className="font-mono text-[10px] font-bold text-[#444] uppercase tracking-wider mb-4">
              {form.interests.length} SELECTED
            </p>
            <div className="flex gap-3">
              <button onClick={() => setStep(3)} className="btn-secondary flex-1 text-[11px] py-3">
                <ArrowLeft size={12} strokeWidth={1.5} /> BACK
              </button>
              <button disabled={form.interests.length < 3 || loading} onClick={handleFinish} className="btn-primary flex-1 text-[11px] py-3 disabled:opacity-40">
                {loading ? 'INITIALIZING...' : <><Zap size={12} strokeWidth={1.5} /> LAUNCH FORGE</>}
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
