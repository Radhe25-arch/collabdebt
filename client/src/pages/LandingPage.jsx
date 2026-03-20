import { useNavigate, Link } from 'react-router-dom';
import Icons from '@/assets/icons';

const FEATURES = [
  { icon: Icons.Book, title: 'Premium Curriculum', desc: 'World-class interactive tracks created by senior engineers.' },
  { icon: Icons.Target, title: 'Real-time Evaluation', desc: 'Code runs in secure sandboxes. Instant feedback on memory and speed.' },
  { icon: Icons.Award, title: 'Global Leaderboards', desc: 'Compete in weekly tournaments to validate your true skill level.' },
];

export default function LandingPage() {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-white text-slate-900 font-sans selection:bg-blue-100">
      {/* ─── NAVBAR ─── */}
      <nav className="fixed top-0 left-0 right-0 z-50 h-20 flex items-center justify-between px-8 bg-white/80 backdrop-blur-lg border-b border-slate-100">
        <div className="flex items-center gap-3 cursor-pointer" onClick={() => navigate('/')}>
          <div className="w-8 h-8 rounded-lg bg-blue-600 flex items-center justify-center shadow-sm -rotate-3">
            <Icons.Code size={16} className="text-white" />
          </div>
          <span className="font-display font-bold text-xl tracking-tight text-slate-900">CodeArena</span>
        </div>
        <div className="hidden md:flex items-center gap-8">
          <Link to="/courses" className="text-sm font-medium text-slate-500 hover:text-slate-900 transition-colors">Catalog</Link>
          <Link to="/community" className="text-sm font-medium text-slate-500 hover:text-slate-900 transition-colors">Community</Link>
          <Link to="/battles" className="text-sm font-medium text-slate-500 hover:text-slate-900 transition-colors">1v1 Arena</Link>
          <Link to="/mentor" className="text-sm font-medium text-slate-500 hover:text-slate-900 transition-colors group flex items-center gap-1">
            AI Mentor <span className="text-[10px] bg-blue-100 text-blue-600 px-1.5 py-0.5 rounded font-black">NEW</span>
          </Link>
          <Link to="/rooms" className="text-sm font-medium text-slate-500 hover:text-slate-900 transition-colors">Multiplayer</Link>
        </div>
        <div className="flex items-center gap-4">
          <button onClick={() => navigate('/login')} className="text-sm font-medium text-slate-600 hover:text-slate-900">Log In</button>
          <button onClick={() => navigate('/register')} className="bg-blue-600 text-white px-5 py-2.5 rounded-full text-sm font-medium hover:bg-blue-700 transition-colors shadow-sm hover:shadow">Get Started Free</button>
        </div>
      </nav>

      {/* ─── HERO ─── */}
      <section className="relative pt-40 pb-20 px-6 overflow-hidden flex flex-col items-center text-center">
        {/* Subtle background glow */}
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[800px] h-[500px] bg-blue-50/50 rounded-full blur-3xl -z-10" />
        
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-50 border border-blue-100 text-blue-700 text-sm font-medium mb-8">
          <Icons.Zap size={14} className="text-blue-600" />
          <span>The #1 platform to learn and compete</span>
        </div>

        <h1 className="font-display font-black text-slate-900 leading-[1.1] tracking-tight max-w-4xl mx-auto mb-6"
            style={{ fontSize: 'clamp(48px, 6vw, 72px)' }}>
          Master the Future of <span className="text-blue-600">Technology</span>
        </h1>
        
        <p className="text-lg text-slate-600 max-w-2xl mx-auto leading-relaxed mb-10">
          Curated industry-leading courses, taught by experts. Join 48,000+ developers practicing in real-time battles. Completely free, forever. No credit card required.
        </p>

        <div className="flex items-center gap-4">
          <button onClick={() => navigate('/register')} className="bg-blue-600 text-white px-8 py-4 rounded-full text-base font-semibold hover:bg-blue-700 transition-all shadow-[0_4px_14px_0_rgba(37,99,235,0.39)] hover:shadow-[0_6px_20px_rgba(37,99,235,0.23)] hover:-translate-y-0.5">
            Start Learning Now
          </button>
          <button onClick={() => navigate('/courses')} className="bg-white text-slate-700 border border-slate-200 px-8 py-4 rounded-full text-base font-medium hover:bg-slate-50 transition-all shadow-sm">
            Explore Curriculum
          </button>
        </div>

        {/* Hero Mockup Preview */}
        <div className="mt-20 w-full max-w-5xl relative">
          <div className="absolute inset-0 bg-gradient-to-t from-white via-transparent to-transparent z-10" />
          <div className="bg-white rounded-2xl border border-slate-200 shadow-[0_20px_40px_-15px_rgba(0,0,0,0.05)] overflow-hidden flex flex-col">
            <div className="h-10 border-b border-slate-100 bg-slate-50/50 flex items-center px-4 gap-2">
              <div className="w-3 h-3 rounded-full bg-red-400" />
              <div className="w-3 h-3 rounded-full bg-amber-400" />
              <div className="w-3 h-3 rounded-full bg-green-400" />
            </div>
            <div className="p-8 grid grid-cols-3 gap-6 opacity-60">
              {[1,2,3].map(i => (
                <div key={i} className="h-64 rounded-xl bg-slate-100 border border-slate-200 animate-pulse" />
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ─── FEATURES ─── */}
      <section className="py-24 bg-slate-50 px-6 border-y border-slate-100">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="font-display font-bold text-3xl text-slate-900 mb-4 tracking-tight">Everything you need to succeed</h2>
            <p className="text-slate-500 max-w-xl mx-auto text-lg">We provide an end-to-end learning environment. Read, watch, type, compile, and compete—all in your browser.</p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {FEATURES.map((f, i) => (
              <div key={i} className="bg-white p-8 rounded-2xl border border-slate-200 shadow-sm hover:shadow-md transition-shadow">
                <div className="w-12 h-12 rounded-xl bg-blue-50 flex items-center justify-center mb-6">
                  <f.icon size={24} className="text-blue-600" />
                </div>
                <h3 className="font-bold text-lg text-slate-900 mb-3">{f.title}</h3>
                <p className="text-slate-600 leading-relaxed">{f.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ─── FOOTER ─── */}
      <footer className="bg-white border-t border-slate-200 py-12 px-6">
        <div className="max-w-6xl mx-auto flex flex-col md:flex-row justify-between items-center gap-6">
          <div className="flex items-center gap-3">
            <div className="w-6 h-6 rounded bg-blue-600 flex items-center justify-center">
              <Icons.Code size={12} className="text-white" />
            </div>
            <span className="font-display font-bold text-lg text-slate-900 tracking-tight">CodeArena</span>
          </div>
          <div className="flex gap-8 text-sm font-medium text-slate-500">
            <a href="#" className="hover:text-slate-900">Privacy</a>
            <a href="#" className="hover:text-slate-900">Terms</a>
            <a href="#" className="hover:text-slate-900">Twitter</a>
            <a href="#" className="hover:text-slate-900">GitHub</a>
          </div>
        </div>
      </footer>
    </div>
  );
}
