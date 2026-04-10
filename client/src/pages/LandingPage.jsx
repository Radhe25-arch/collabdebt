import React, { useState, useEffect, useRef } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { motion, useScroll, useTransform, useSpring, AnimatePresence } from 'framer-motion';
import { 
  Zap, ArrowRight, Layout, Shield, Cpu, Code, Star, Users,
  CheckCircle2, Lock, Globe, Database, Terminal as TerminalIcon,
  Layers, Sparkles, Trophy, Activity, MessageSquare, ChevronDown
} from 'lucide-react';
import { Button } from '@/components/ui';

// ─── NAV COMPONENT ───────────────────────────────────────
const Navbar = () => {
  const navigate = useNavigate();
  const { scrollY } = useScroll();
  const [isScrolled, setIsScrolled] = useState(false);

  useEffect(() => {
    return scrollY.onChange((latest) => setIsScrolled(latest > 50));
  }, [scrollY]);

  return (
    <nav className={`fixed top-0 left-0 w-full z-[100] transition-all duration-500 ${isScrolled ? 'py-4 bg-black/80 backdrop-blur-xl border-b border-white/5' : 'py-8 bg-transparent'}`}>
      <div className="max-w-7xl mx-auto px-6 flex items-center justify-between">
        <div className="flex items-center gap-3 group cursor-pointer" onClick={() => navigate('/')}>
          <div className="w-10 h-10 bg-blue-600 rounded-xl flex items-center justify-center group-hover:rotate-6 transition-transform">
             <Code size={20} className="text-white" />
          </div>
          <span className="font-black text-xl tracking-tighter text-white uppercase italic">SkillForge</span>
        </div>

        <div className="hidden md:flex items-center gap-10">
          {['Curriculum', 'Architecture', 'The Arena', 'Systems'].map(link => (
            <a key={link} href={`#${link.toLowerCase()}`} className="text-sm font-bold text-slate-500 hover:text-white transition-colors uppercase tracking-widest">{link}</a>
          ))}
        </div>

        <div className="flex items-center gap-4">
           <button onClick={() => navigate('/login')} className="text-sm font-bold text-white uppercase tracking-widest px-6 py-2 hover:bg-white/5 rounded-xl transition-all">Command Access</button>
           <Button className="rounded-xl h-11 px-8 bg-blue-600 hover:bg-blue-500 border-none glow-blue text-sm font-bold tracking-widest" onClick={() => navigate('/signup')}>Join Registry</Button>
        </div>
      </div>
    </nav>
  );
};

// ─── HERO 2.0 ──────────────────────────────────────────
const Hero = () => {
  const navigate = useNavigate();
  const codeLines = [
    "class Operative(User):",
    "    def __init__(self, name):",
    "        self.level = 1",
    "        self.status = 'ACTIVE'",
    "        self.xp = 0",
    "    ",
    "    def initiate_sequence(self):",
    "        print('Initializing SkillForge...')",
    "        return self.upgrade()"
  ];

  return (
    <section className="relative pt-40 pb-32 px-6 overflow-hidden min-h-screen flex flex-col justify-center">
      {/* Background Gradients */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-[800px] bg-[radial-gradient(circle_at_center,rgba(59,130,246,0.08)_0%,transparent_70%)] pointer-events-none" />
      
      <div className="max-w-7xl mx-auto w-full grid grid-cols-1 lg:grid-cols-2 gap-20 items-center relative z-10">
        <motion.div 
          initial={{ opacity: 0, x: -30 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.8 }}
        >
          <div className="inline-flex items-center gap-2 px-4 py-2 bg-blue-600/10 border border-blue-600/20 rounded-full mb-8">
             <Sparkles size={14} className="text-blue-500" />
             <span className="text-[10px] font-bold text-blue-500 uppercase tracking-[0.2em]">Platform Version 4.0 Stable</span>
          </div>
          <h1 className="text-6xl md:text-8xl font-black text-white tracking-tighter leading-[0.9] mb-8">
            Build Systems.<br />
            <span className="text-blue-600 drop-shadow-[0_0_20px_rgba(37,99,235,0.3)]">Not Just Code.</span>
          </h1>
          <p className="text-slate-400 text-xl font-medium max-w-lg mb-12 leading-relaxed">
            The industrial sandbox for elite engineers. Master architecture, conquer the arena, and scale your technical portfolio in a high-fidelity environment.
          </p>
          <div className="flex flex-col sm:flex-row items-center gap-6">
             <Button 
               size="lg" 
               className="h-16 px-12 rounded-2xl bg-white text-black hover:bg-slate-100 hover:scale-105 transition-all font-black text-lg border-none w-full sm:w-auto"
               onClick={() => navigate('/signup')}
             >
               Start Execution
             </Button>
             <div className="flex -space-x-3">
                {[1,2,3,4].map(i => (
                  <div key={i} className={`w-10 h-10 rounded-full border-2 border-black bg-slate-800 p-0.5`}>
                     <div className="w-full h-full rounded-full bg-slate-700" />
                  </div>
                ))}
                <div className="pl-6 text-sm font-bold text-slate-500 flex flex-col justify-center">
                   <span className="text-white leading-none">500k+ Engineers</span>
                   <span className="text-[10px] uppercase tracking-widest mt-1">Deploying Systems</span>
                </div>
             </div>
          </div>
        </motion.div>

        <motion.div 
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 1, delay: 0.2 }}
          className="relative"
        >
          <div className="absolute inset-0 bg-blue-600/20 blur-[120px] rounded-full animate-pulse" />
          <div className="relative bg-[#0a0a0a] rounded-[40px] border border-white/10 p-2 shadow-2xl overflow-hidden group">
             <div className="bg-[#111] rounded-[38px] p-8 border border-white/5">
                <div className="flex items-center gap-2 mb-6 border-b border-white/5 pb-4">
                   <div className="w-3 h-3 rounded-full bg-red-500/50" />
                   <div className="w-3 h-3 rounded-full bg-yellow-500/50" />
                   <div className="w-3 h-3 rounded-full bg-green-500/50" />
                   <span className="text-[10px] font-mono font-bold text-slate-600 ml-2">ARCH_INIT.PY</span>
                </div>
                <div className="font-mono text-sm space-y-2">
                   {codeLines.map((line, i) => (
                     <motion.div 
                       key={i}
                       initial={{ opacity: 0, x: -10 }}
                       animate={{ opacity: 1, x: 0 }}
                       transition={{ delay: 0.5 + (i * 0.1) }}
                       className="flex gap-4"
                     >
                        <span className="text-slate-800 w-4 text-right">{i+1}</span>
                        <span className="text-slate-300">{line}</span>
                     </motion.div>
                   ))}
                   <motion.div 
                     animate={{ opacity: [0, 1] }} 
                     transition={{ repeat: Infinity, duration: 0.8 }}
                     className="w-2 h-5 bg-blue-500 inline-block ml-8 mt-2" 
                   />
                </div>
             </div>
          </div>
        </motion.div>
      </div>

      <div className="absolute bottom-10 left-1/2 -translate-x-1/2 animate-bounce opacity-30">
         <ChevronDown size={32} className="text-white" />
      </div>
    </section>
  );
};

// ─── DASHBOARD GLIMPSE ──────────────────────────────────
const DashboardGlimpse = () => {
  return (
    <section className="py-40 px-6 relative overflow-hidden bg-black">
       <div className="absolute top-0 left-0 w-full h-[1px] bg-gradient-to-r from-transparent via-white/5 to-transparent" />
       <div className="max-w-7xl mx-auto">
          <div className="text-center mb-24">
             <span className="text-xs font-bold text-blue-500 uppercase tracking-[0.3em] mb-4 block">CENTRAL TELEMETRY</span>
             <h2 className="text-5xl md:text-7xl font-black text-white tracking-tighter">Your Command Console.</h2>
          </div>

          <motion.div 
            initial={{ y: 50, opacity: 0 }}
            whileInView={{ y: 0, opacity: 1 }}
            viewport={{ once: true }}
            className="bg-[#050505] rounded-[60px] border border-white/10 p-8 md:p-16 shadow-2xl relative group"
          >
             <div className="absolute inset-0 bg-blue-600/5 opacity-0 group-hover:opacity-100 transition-opacity rounded-[60px] pointer-events-none" />
             <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-16">
                {[
                  { l: 'System XP', v: '48.2k', i: Zap, c: 'text-blue-500' },
                  { l: 'Modules', v: '12/24', i: Layers, c: 'text-violet-500' },
                  { l: 'Global Rank', v: '#128', i: Trophy, c: 'text-amber-500' },
                  { l: 'Active Operations', v: '4', i: Activity, c: 'text-emerald-500' }
                ].map(s => (
                  <div key={s.l} className="bg-white/5 rounded-[32px] p-8 border border-white/5">
                     <s.i className={`${s.c} mb-6`} size={24} />
                     <p className="text-[10px] font-bold text-slate-500 uppercase tracking-widest mb-1">{s.l}</p>
                     <p className="text-3xl font-black text-white">{s.v}</p>
                  </div>
                ))}
             </div>
             <div className="h-64 md:h-[400px] bg-white/5 rounded-[40px] border border-white/5 flex items-center justify-center relative overflow-hidden">
                <div className="absolute inset-0 bg-grid opacity-20" />
                <div className="flex flex-col items-center relative z-10 text-center px-10">
                   <div className="w-20 h-20 rounded-full bg-blue-600/20 flex items-center justify-center mb-6">
                      <Layout size={32} className="text-blue-500" />
                   </div>
                   <h4 className="text-2xl font-black text-white mb-2">High-Fidelity Interaction</h4>
                   <p className="text-slate-500 max-w-sm">Access your curriculum with a millisecond-latency UI built for scale.</p>
                </div>
             </div>
          </motion.div>
       </div>
    </section>
  );
};

// ─── AI MENTOR GLIMPSE ──────────────────────────────────
const MentorGlimpse = () => {
  return (
    <section className="py-40 px-6 bg-[#050505] relative overflow-hidden">
       <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-blue-600/5 blur-[120px] rounded-full pointer-events-none" />
       <div className="max-w-7xl mx-auto flex flex-col lg:flex-row items-center gap-24">
          <div className="flex-1">
             <span className="text-xs font-bold text-blue-500 uppercase tracking-[0.3em] mb-4 block">NEURAL ASSISTANCE</span>
             <h2 className="text-6xl font-black text-white tracking-tighter mb-8 italic">LogicHub AI.</h2>
             <p className="text-slate-400 text-lg font-medium leading-relaxed mb-10 max-w-xl">
                Every line of code you write is analyzed by our custom 4.0 LLM. Identify architectural bottlenecks, security vulnerabilities, and logic flaws in milliseconds.
             </p>
             <div className="space-y-6">
                {[
                  { t: 'Live Code Review', d: 'Get instant feedback on your implementation logic.' },
                  { t: 'System Design Mockups', d: 'Brainstorm architectures with an AI that understands Scale.' }
                ].map(item => (
                  <div key={item.t} className="flex gap-4">
                     <div className="w-6 h-6 rounded-full bg-blue-600/20 flex items-center justify-center mt-1">
                        <CheckCircle2 size={12} className="text-blue-500" />
                     </div>
                     <div>
                        <h4 className="font-bold text-white text-base">{item.t}</h4>
                        <p className="text-slate-500 text-sm mt-1">{item.d}</p>
                     </div>
                  </div>
                ))}
             </div>
          </div>

          <div className="flex-1 w-full lg:max-w-xl">
             <div className="bg-black rounded-[40px] border border-white/10 p-6 shadow-2xl space-y-6">
                <div className="flex gap-4">
                   <div className="w-10 h-10 rounded-xl bg-slate-800 flex items-center justify-center text-[10px] font-bold text-slate-500">US</div>
                   <div className="bg-white/5 border border-white/5 p-4 rounded-2xl max-w-[80%]">
                      <p className="text-sm font-medium text-slate-300">How do I optimize this recursive call for big datasets?</p>
                   </div>
                </div>
                <div className="flex gap-4 flex-row-reverse">
                   <div className="w-10 h-10 rounded-xl bg-blue-600 flex items-center justify-center text-[10px] font-bold text-white">AI</div>
                   <div className="bg-blue-600/10 border border-blue-600/20 p-5 rounded-3xl max-w-[80%]">
                      <div className="flex gap-1.5 h-1 items-center mb-3">
                         <div className="w-1.5 h-1.5 rounded-full bg-blue-500 animate-bounce" />
                         <div className="w-1.5 h-1.5 rounded-full bg-blue-500 animate-bounce delay-100" />
                         <div className="w-1.5 h-1.5 rounded-full bg-blue-500 animate-bounce delay-200" />
                      </div>
                      <p className="text-sm font-bold text-blue-400 mb-2 uppercase tracking-widest">Thought: MEMOIZATION</p>
                      <p className="text-sm font-medium text-white leading-relaxed italic">"Implement a hash cache to store computed sub-tree values..."</p>
                   </div>
                </div>
             </div>
          </div>
       </div>
    </section>
  );
};

// ─── HALL OF FAME GLIMPSE ──────────────────────────────
const HallOfFame = () => {
  return (
    <section className="py-40 px-6 bg-black relative">
       <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-24 items-center">
          <div className="order-2 lg:order-1 flex flex-col gap-4">
             {[
               { n: 'V3NOM', r: '#1', l: '84', x: '124k' },
               { n: 'ZER0_DAY', r: '#2', l: '81', x: '118k' },
               { n: 'KERNEL_PA', r: '#3', l: '78', x: '112k' },
               { n: 'N_REDUX', r: '#4', l: '75', x: '102k' }
             ].map((u, i) => (
                <motion.div 
                  key={u.n}
                  initial={{ opacity: 0, x: -20 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  transition={{ delay: i * 0.1 }}
                  className="bg-white/5 border border-white/5 rounded-3xl p-6 flex items-center justify-between hover:bg-white/10 transition-all cursor-default"
                >
                   <div className="flex items-center gap-4">
                      <span className={`text-xl font-black ${i === 0 ? 'text-amber-500' : 'text-slate-600'}`}>{u.r}</span>
                      <div className="w-12 h-12 rounded-2xl bg-slate-800" />
                      <div>
                         <p className="font-bold text-white">{u.n}</p>
                         <p className="text-[10px] font-bold text-slate-500 uppercase tracking-widest">Level {u.l} • Operative</p>
                      </div>
                   </div>
                   <div className="text-right">
                      <p className="font-black text-white">{u.x}</p>
                      <p className="text-[9px] font-bold text-slate-500 uppercase tracking-widest">Lifetime XP</p>
                   </div>
                </motion.div>
             ))}
          </div>

          <div className="order-1 lg:order-2">
             <span className="text-xs font-bold text-blue-500 uppercase tracking-[0.3em] mb-4 block">GLOBAL HIERARCHY</span>
             <h2 className="text-6xl font-black text-white tracking-tighter mb-8 leading-none">The Hall of Fame.</h2>
             <p className="text-slate-400 text-lg font-medium leading-relaxed mb-10 max-w-xl">
                Compete on the global leaderboard. Earn your status through battlefield victories, system completion, and consistent contribution to the engineering ecosystem.
             </p>
             <Button className="h-14 px-10 rounded-2xl border-white/10 text-white font-bold text-sm tracking-widest uppercase" variant="secondary">View Leaderboard</Button>
          </div>
       </div>
    </section>
  );
};

// ─── SPECIFICATIONS BENTO ──────────────────────────────
const Specifications = () => {
  return (
    <section className="py-40 px-6 bg-[#050505]">
       <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
             <div className="md:col-span-2 h-[500px] bg-black rounded-[40px] border border-white/10 p-12 relative overflow-hidden group">
                <div className="absolute top-0 right-0 p-12 opacity-5 group-hover:scale-110 transition-transform">
                   <Cpu size={240} className="text-blue-500" />
                </div>
                <div className="relative z-10 w-full h-full flex flex-col justify-end">
                   <h3 className="text-4xl font-black text-white mb-4 tracking-tighter leading-none italic uppercase">Core Processing Power.</h3>
                   <p className="text-slate-500 max-w-sm mb-0 uppercase italic font-bold text-sm tracking-widest">Host kernels at the edge. Millisecond execution for every routine.</p>
                </div>
             </div>

             <div className="h-[500px] bg-blue-600 rounded-[40px] p-12 flex flex-col justify-between group overflow-hidden relative">
                <div className="absolute top-0 right-0 opacity-20 p-8 rotate-12 group-hover:rotate-0 transition-transform">
                   <Shield size={160} />
                </div>
                <h3 className="text-4xl font-black text-white tracking-tighter leading-none italic uppercase">Ironclad Sandbox.</h3>
                <div>
                   <p className="text-white/80 font-bold leading-relaxed mb-8 italic uppercase text-sm tracking-widest">Isolated architecture. No leaks. No compromise.</p>
                   <div className="w-12 h-12 rounded-2xl bg-white/20 flex items-center justify-center">
                      <Lock size={20} className="text-white" />
                   </div>
                </div>
             </div>

             <div className="h-[400px] bg-white/5 rounded-[40px] border border-white/10 p-10 flex flex-col items-center justify-center text-center">
                <Globe size={48} className="text-slate-500 mb-8" />
                <h4 className="text-xl font-black text-white mb-2 uppercase tracking-widest">Edge Synced</h4>
                <p className="text-slate-500 text-sm max-w-[200px] uppercase font-bold italic tracking-widest">Operate from any point on the global node network.</p>
             </div>

             <div className="md:col-span-2 h-[400px] bg-[#0a0a0a] rounded-[40px] border border-white/5 p-12 flex flex-col justify-center">
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-12">
                   {[
                     { l: 'UPTIME', v: '99.98%' },
                     { l: 'LATENCY', v: '<24MS' },
                     { l: 'NODES', v: '4,200+' }
                   ].map(s => (
                     <div key={s.l}>
                        <p className="text-[10px] font-bold text-slate-600 uppercase tracking-widest mb-1">{s.l}</p>
                        <p className="text-3xl font-black text-white tracking-tight italic uppercase">{s.v}</p>
                     </div>
                   ))}
                </div>
                <div className="h-[1px] bg-white/5 w-full my-10" />
                <p className="text-slate-600 font-mono text-xs uppercase tracking-[0.2em] font-bold italic underline">View Infrastructure Health Dashboard</p>
             </div>
          </div>
       </div>
    </section>
  );
};

// ─── MAIN LANDING PAGE ──────────────────────────────────
export default function LandingPage() {
  const navigate = useNavigate();

  return (
    <div className="bg-black min-h-screen font-sans selection:bg-blue-600/30 selection:text-white overflow-x-hidden">
      <Navbar />
      <Hero />
      
      <main className="space-y-0 relative z-10">
        <DashboardGlimpse />
        <MentorGlimpse />
        <HallOfFame />
        <Specifications />

        {/* Final CTA */}
        <section className="py-60 px-6 text-center relative overflow-hidden bg-black">
           <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-full bg-[radial-gradient(circle_at_center,rgba(59,130,246,0.1)_0%,transparent_70%)] pointer-events-none" />
           <motion.div 
             initial={{ opacity: 0, y: 30 }}
             whileInView={{ opacity: 1, y: 0 }}
             viewport={{ once: true }}
             className="max-w-3xl mx-auto relative z-10"
           >
              <h2 className="text-6xl md:text-8xl font-black text-white tracking-tighter leading-none mb-10 italic uppercase font-serif">
                Seize the<br />Standard.
              </h2>
              <p className="text-slate-500 text-xl font-medium mb-12 max-w-lg mx-auto italic uppercase font-bold tracking-widest underline">
                The registry is open for a limited cycle. Initialize your presence now.
              </p>
              <Button 
                size="lg" 
                className="h-20 px-16 rounded-[40px] bg-blue-600 hover:bg-blue-500 text-white font-black text-2xl border-none glow-blue hover:scale-105 transition-all shadow-2xl flex items-center justify-center mx-auto uppercase italic"
                onClick={() => navigate('/signup')}
              >
                Join Registry <ArrowRight size={28} className="ml-4" />
              </Button>
           </motion.div>
        </section>
      </main>

      <footer className="py-24 px-6 border-t border-white/5 bg-black">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row justify-between items-center gap-10">
          <div className="flex items-center gap-4">
             <div className="w-10 h-10 bg-slate-800 rounded-xl flex items-center justify-center">
                <Code size={20} className="text-white" />
             </div>
             <span className="font-black text-xl tracking-tighter text-white uppercase italic">SkillForge</span>
          </div>
          <p className="text-slate-600 text-[10px] tracking-[0.3em] font-bold uppercase italic">© 2026 SkillForge Operations. Built for the elite. 0.00ms runtime.</p>
          <div className="flex gap-10">
            <Globe size={18} className="text-slate-700 hover:text-white cursor-pointer transition-colors" />
            <Activity size={18} className="text-slate-700 hover:text-white cursor-pointer transition-colors" />
            <Shield size={18} className="text-slate-700 hover:text-white cursor-pointer transition-colors" />
          </div>
        </div>
      </footer>
    </div>
  );
}
