import { useState } from 'react';
import { useAuthStore } from '@/store';
import api, { setAccessToken } from '@/lib/api';
import Icons from '@/assets/icons';

const INTERESTS_BY_ROLE = {
  STUDENT:      ['JavaScript','Python','Java','C++','C','Data Structures','Web Dev','SQL','Machine Learning','Mobile Dev','TypeScript','Kotlin','Swift','Bash','Cybersecurity'],
  BEGINNER:     ['Python','JavaScript','Web Dev','SQL','Bash','C','Java','Data Structures','Game Dev','Mobile Dev','TypeScript','PHP','Ruby','Cloud','DevOps'],
  PROFESSIONAL: ['TypeScript','Rust','Go','Kotlin','Swift','DevOps','Cloud','Cybersecurity','Machine Learning','Data Structures','SQL','Bash','Java','Python','C++'],
};

const ROLE_OPTIONS = [
  { value: 'STUDENT',      label: 'Student',               desc: 'Currently studying in school or college', icon: '🎓' },
  { value: 'BEGINNER',     label: 'Self-taught / Beginner', desc: 'Learning on my own, just getting started', icon: '🌱' },
  { value: 'PROFESSIONAL', label: 'Working Professional',   desc: 'Already in the industry, leveling up',     icon: '💼' },
];

const AGE_BY_ROLE = {
  STUDENT:      [{ value: 'SCHOOL', label: 'School (up to 12th)', icon: '📚' }, { value: 'COLLEGE', label: 'College / University', icon: '🏫' }],
  BEGINNER:     [{ value: 'SCHOOL', label: 'Still in school', icon: '📚' }, { value: 'COLLEGE', label: 'College going', icon: '🏫' }, { value: 'WORKING', label: 'Working / Graduate', icon: '💻' }],
  PROFESSIONAL: [{ value: 'COLLEGE', label: 'Fresh Graduate', icon: '🎓' }, { value: 'WORKING', label: 'Experienced Dev', icon: '🚀' }],
};

const GOAL_BY_ROLE = {
  STUDENT:      ['Crack placements', 'Learn for exams', 'Build projects', 'Competitive coding', 'Just exploring'],
  BEGINNER:     ['Get first job', 'Build a website', 'Learn for fun', 'Switch to tech', 'Build mobile apps'],
  PROFESSIONAL: ['Upskill for promotion', 'Learn new language', 'System design', 'Switch domain', 'Stay updated'],
};

export default function OnboardingPage() {
  const { updateUser } = useAuthStore();
  const [step, setStep] = useState(1);
  const [loading, setLoading] = useState(false);
  const [form, setForm] = useState({ role: '', ageGroup: '', goal: '', interests: [] });

  const toggleInterest = (i) => setForm((f) => ({
    ...f, interests: f.interests.includes(i) ? f.interests.filter((x) => x !== i) : [...f.interests, i],
  }));

  const handleFinish = async () => {
    setLoading(true);
    try {
      try {
        const { data: r } = await api.post('/auth/refresh', {}, { withCredentials: true });
        setAccessToken(r.accessToken);
      } catch (_) {}

      const { data } = await api.patch('/users/me', { role: form.role, ageGroup: form.ageGroup, interests: form.interests, onboarded: true });

      const newStored = JSON.parse(localStorage.getItem('codearena-auth') || '{}');
      if (newStored.state) {
        newStored.state.user = { ...(newStored.state.user || {}), ...data.user };
        newStored.state.isAuthenticated = true;
        localStorage.setItem('codearena-auth', JSON.stringify(newStored));
      }
      updateUser(data.user);
      window.location.href = '/dashboard';
    } catch (e) {
      console.error(e);
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-arena-bg flex items-center justify-center px-4">
      <div className="w-full max-w-lg">
        <div className="flex items-center gap-2.5 justify-center mb-8">
          <div className="w-9 h-9 rounded-xl bg-purple-teal flex items-center justify-center">
            <Icons.Code size={17} className="text-white" />
          </div>
          <span className="font-display font-black text-xl text-gradient">SkillForge</span>
        </div>
        <div className="flex gap-2 mb-8">
          {[1,2,3,4].map((s) => (
            <div key={s} className={`h-1 flex-1 rounded-full transition-all duration-300 ${step >= s ? 'bg-arena-purple' : 'bg-arena-bg3'}`} />
          ))}
        </div>

        {step === 1 && (
          <div>
            <h1 className="font-display font-black text-2xl text-arena-text mb-1">Who are you? 👋</h1>
            <p className="font-mono text-xs text-arena-dim mb-6">Help us personalize your journey.</p>
            <div className="space-y-3">
              {ROLE_OPTIONS.map((r) => (
                <button key={r.value} onClick={() => setForm((f) => ({ ...f, role: r.value, ageGroup: '', goal: '', interests: [] }))}
                  className={`w-full p-4 rounded-xl border text-left transition-all flex items-center gap-4 ${form.role === r.value ? 'border-arena-purple bg-arena-purple/10' : 'border-arena-border bg-arena-bg2 hover:border-arena-purple/40'}`}>
                  <span className="text-2xl">{r.icon}</span>
                  <div><p className="font-mono text-sm font-bold text-arena-text">{r.label}</p><p className="font-mono text-xs text-arena-dim">{r.desc}</p></div>
                  {form.role === r.value && <Icons.Check size={16} className="ml-auto text-arena-purple2 flex-shrink-0" />}
                </button>
              ))}
            </div>
            <button disabled={!form.role} onClick={() => setStep(2)} className="btn-primary w-full mt-6 py-3.5 disabled:opacity-40">Continue →</button>
          </div>
        )}

        {step === 2 && form.role && (
          <div>
            <h1 className="font-display font-black text-2xl text-arena-text mb-1">Where are you at? 📍</h1>
            <p className="font-mono text-xs text-arena-dim mb-6">We'll match content to your level.</p>
            <div className="space-y-3">
              {AGE_BY_ROLE[form.role].map((a) => (
                <button key={a.value} onClick={() => setForm((f) => ({ ...f, ageGroup: a.value }))}
                  className={`w-full p-4 rounded-xl border text-left transition-all flex items-center gap-4 ${form.ageGroup === a.value ? 'border-arena-purple bg-arena-purple/10' : 'border-arena-border bg-arena-bg2 hover:border-arena-purple/40'}`}>
                  <span className="text-2xl">{a.icon}</span>
                  <p className="font-mono text-sm font-bold text-arena-text">{a.label}</p>
                  {form.ageGroup === a.value && <Icons.Check size={16} className="ml-auto text-arena-purple2 flex-shrink-0" />}
                </button>
              ))}
            </div>
            <div className="flex gap-3 mt-6">
              <button onClick={() => setStep(1)} className="flex-1 py-3.5 rounded-xl border border-arena-border text-arena-muted font-mono text-sm hover:border-arena-purple/40 transition-all">← Back</button>
              <button disabled={!form.ageGroup} onClick={() => setStep(3)} className="btn-primary flex-1 py-3.5 disabled:opacity-40">Continue →</button>
            </div>
          </div>
        )}

        {step === 3 && form.role && (
          <div>
            <h1 className="font-display font-black text-2xl text-arena-text mb-1">What's your main goal? 🎯</h1>
            <p className="font-mono text-xs text-arena-dim mb-6">We'll focus your learning path.</p>
            <div className="space-y-3">
              {GOAL_BY_ROLE[form.role].map((g) => (
                <button key={g} onClick={() => setForm((f) => ({ ...f, goal: g }))}
                  className={`w-full p-3.5 rounded-xl border text-left transition-all flex items-center gap-3 ${form.goal === g ? 'border-arena-purple bg-arena-purple/10' : 'border-arena-border bg-arena-bg2 hover:border-arena-purple/40'}`}>
                  <span className="font-mono text-sm text-arena-text">{g}</span>
                  {form.goal === g && <Icons.Check size={16} className="ml-auto text-arena-purple2 flex-shrink-0" />}
                </button>
              ))}
            </div>
            <div className="flex gap-3 mt-6">
              <button onClick={() => setStep(2)} className="flex-1 py-3.5 rounded-xl border border-arena-border text-arena-muted font-mono text-sm hover:border-arena-purple/40 transition-all">← Back</button>
              <button disabled={!form.goal} onClick={() => setStep(4)} className="btn-primary flex-1 py-3.5 disabled:opacity-40">Continue →</button>
            </div>
          </div>
        )}

        {step === 4 && form.role && (
          <div>
            <h1 className="font-display font-black text-2xl text-arena-text mb-1">Pick your topics 🚀</h1>
            <p className="font-mono text-xs text-arena-dim mb-6">Select at least 3 you want to master.</p>
            <div className="flex flex-wrap gap-2 max-h-60 overflow-y-auto pb-1">
              {INTERESTS_BY_ROLE[form.role].map((i) => (
                <button key={i} onClick={() => toggleInterest(i)}
                  className={`px-3 py-1.5 rounded-lg border font-mono text-xs transition-all ${form.interests.includes(i) ? 'border-arena-purple bg-arena-purple/15 text-arena-purple2' : 'border-arena-border bg-arena-bg2 text-arena-muted hover:border-arena-purple/40'}`}>
                  {i}
                </button>
              ))}
            </div>
            <p className="font-mono text-xs text-arena-dim mt-2">{form.interests.length} selected</p>
            <div className="flex gap-3 mt-4">
              <button onClick={() => setStep(3)} className="flex-1 py-3.5 rounded-xl border border-arena-border text-arena-muted font-mono text-sm hover:border-arena-purple/40 transition-all">← Back</button>
              <button disabled={form.interests.length < 3 || loading} onClick={handleFinish} className="btn-primary flex-1 py-3.5 disabled:opacity-40">
                {loading ? 'Setting up...' : "Let's Go! 🎉"}
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
