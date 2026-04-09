import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, useScroll, useTransform, AnimatePresence, useMotionValueEvent } from 'framer-motion';
import { 
  Terminal, 
  Zap, 
  Shield, 
  Cpu, 
  Layers, 
  ShieldAlert as Lock, 
  ArrowRight, 
  Globe as Github, 
  Layout, 
  Code, 
  Stars as Sparkles,
  ChevronRight,
  Globe,
  Database,
  Trophy,
  MessageSquare,
  Activity,
  Box
} from 'lucide-react';
import { Button } from '@/components/ui';

// ─── NAV COMPONENT ───────────────────────────────────────
const Navbar = () => {
  const navigate = useNavigate();
  const { scrollY } = useScroll();
  const [isScrolled, setIsScrolled] = useState(false);

  useMotionValueEvent(scrollY, "change", (latest) => {
    setIsScrolled(latest > 50);
  });

  return (
    <motion.nav 
      initial={{ y: -100 }}
      animate={{ y: 0 }}
      className={`fixed top-0 inset-x-0 z-50 transition-all duration-300 ${isScrolled ? 'nav-glass py-3' : 'bg-transparent py-5'}`}
    >
      <div className="max-w-7xl mx-auto px-6 flex items-center justify-between">
        <div className="flex items-center gap-8">
          <div className="flex items-center gap-2 cursor-pointer" onClick={() => navigate('/')}>
            <div className="w-8 h-8 bg-white flex items-center justify-center rounded-[4px]">
              <div className="w-4 h-4 bg-black rounded-[2px]" />
            </div>
            <span className="font-bold text-lg tracking-tighter text-white uppercase">SKILLFORGE</span>
          </div>
          
          <div className="hidden md:flex items-center gap-6">
            {[
              { label: 'ARCHIVE', to: '/courses' },
              { label: 'THE ARENA', to: '/battles' },
              { label: 'AI MENTOR', to: '/mentor' },
              { label: 'HALL OF FAME', to: '/leaderboard' },
              { label: 'THE LAB', to: '/lab' }
            ].map(item => (
              <a 
                key={item.label} 
                href={item.to}
                className="text-[11px] font-bold text-[#666] hover:text-white transition-colors tracking-widest uppercase"
              >
                {item.label}
              </a>
            ))}
          </div>
        </div>

        <div className="flex items-center gap-4">
          <button 
            onClick={() => navigate('/login')}
            className="text-[11px] font-bold text-[#666] hover:text-white transition-colors tracking-widest uppercase"
          >
            LOG IN
          </button>
          <Button 
            variant="primary" 
            size="sm" 
            className="shimmer-btn font-black h-9 px-5"
            onClick={() => navigate('/register')}
          >
            JOIN THE ELITE
          </Button>
        </div>
      </div>
    </motion.nav>
  );
};

// ─── TERMINAL COMPONENT ──────────────────────────────────
const CodeTerminal = () => {
  const [line, setLine] = useState(0);
  const code = [
    "const engineer = new SkillForge.User('Arjun');",
    "await engineer.solve('distributed_systems');",
    "// Optimizing kernel throughput...",
    "// Memory safety: VERIFIED",
    "// Result: ASCENDED",
  ];

  useEffect(() => {
    const timer = setInterval(() => {
      setLine(prev => (prev + 1) % (code.length + 1));
    }, 1500);
    return () => clearInterval(timer);
  }, []);

  return (
    <div className="w-full max-w-2xl glass-overlay rounded-[4px] overflow-hidden shadow-2xl relative">
      <div className="h-8 bg-white/5 border-b border-white/10 flex items-center px-4 gap-1.5">
        <div className="w-2.5 h-2.5 rounded-full bg-crimson/50" />
        <div className="w-2.5 h-2.5 rounded-full bg-amber/50" />
        <div className="w-2.5 h-2.5 rounded-full bg-emerald/50" />
        <span className="ml-2 font-mono text-[10px] text-[#444] uppercase tracking-widest">skillforge_terminal_v4.0.sh</span>
      </div>
      <div className="p-6 font-mono text-sm min-h-[160px]">
        {code.slice(0, line).map((c, i) => (
          <div key={i} className="mb-1 flex gap-3">
            <span className="text-[#333] select-none">{i + 1}</span>
            <span className={c.startsWith('//') ? 'text-[#444]' : 'text-cyber'}>{c}</span>
          </div>
        ))}
        <motion.span 
          animate={{ opacity: [1, 0] }}
          transition={{ repeat: Infinity, duration: 0.8 }}
          className="inline-block w-1.5 h-4 bg-cyber ml-1"
        />
      </div>
      <div className="absolute bottom-0 right-0 w-8 h-8 border-r border-b border-white/20 translate-x-2 translate-y-2 pointer-events-none" />
    </div>
  );
};

// ─── PRODUCT GLIMPSE ─────────────────────────────────────
const ProductGlimpse = ({ title, icon: Icon, children, delay = 0 }) => (
  <motion.div 
    initial={{ opacity: 0, y: 40 }}
    whileInView={{ opacity: 1, y: 0 }}
    viewport={{ once: true }}
    transition={{ duration: 0.8, delay }}
    className="group relative"
  >
    <div className="absolute -inset-2 bg-gradient-to-b from-cyber/20 to-transparent blur-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
    <div className="relative blade p-1 rounded-[4px] bg-white/[0.02] border border-white/[0.08] overflow-hidden">
      <div className="bg-[#050505] rounded-[2px] p-6 lg:p-8 min-h-[400px]">
        <div className="flex items-center justify-between mb-8">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-[4px] border border-white/10 bg-white/[0.02] flex items-center justify-center">
              <Icon size={18} className="text-cyber" />
            </div>
            <div>
              <h3 className="font-black text-sm text-white uppercase tracking-widest leading-none mb-1">{title}</h3>
              <p className="font-mono text-[9px] text-[#444] uppercase tracking-widest">MODULE_ID // ALPHA_STABLE</p>
            </div>
          </div>
          <div className="flex gap-1">
            {[1, 2, 3].map(i => <div key={i} className="w-0.5 h-3 bg-white/[0.05]" />)}
          </div>
        </div>
        {children}
      </div>
    </div>
  </motion.div>
);

// ─── MAIN PAGE ───────────────────────────────────────────
export default function LandingPage() {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-black text-white selection:bg-cyber/30 selection:text-white aurora-bg">
      <Navbar />

      {/* Hero Section */}
      <section className="relative pt-48 pb-24 px-6 overflow-hidden">
        <div className="max-w-7xl mx-auto text-center relative z-10">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="inline-flex items-center gap-2 px-4 py-1.5 bg-white/[0.03] border border-white/[0.08] rounded-full mb-10"
          >
            <Sparkles size={12} className="text-cyber" />
            <span className="font-mono text-[10px] font-black text-[#555] tracking-[0.25em] uppercase">SYSTEM_INITIALIZED // V4.0 ELITE</span>
          </motion.div>

          <motion.h1 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="text-shimmer text-6xl md:text-9xl font-black tracking-tighter leading-[0.85] mb-10"
          >
            ENGINEER YOUR<br />
            <span className="text-white">ASCENSION.</span>
          </motion.h1>

          <motion.p 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="max-w-2xl mx-auto text-[#666] text-lg md:text-xl mb-14 font-medium leading-relaxed"
          >
            The world's most sophisticated technical mastery ecosystem. Built for the elite, powered by AI, validated by the arena.
          </motion.p>

          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="flex flex-wrap justify-center gap-6"
          >
            <Button 
              size="xl" 
              variant="primary" 
              className="shimmer-btn font-black h-16 px-12 tracking-[0.2em] bg-cyber border-none text-sm"
              onClick={() => navigate('/register')}
            >
              INITIALIZE PROTOCOL
            </Button>
            <button 
              onClick={() => navigate('/courses')}
              className="group h-16 px-12 border border-white/10 hover:border-white/30 rounded-[4px] font-mono font-black text-[11px] uppercase tracking-[0.2em] transition-all flex items-center gap-3 bg-white/[0.01]"
            >
              EXPLORE ARCHIVE <ArrowRight size={14} className="group-hover:translate-x-1 transition-transform" />
            </button>
          </motion.div>

          <motion.div 
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.5, type: 'spring' }}
            className="mt-32 flex justify-center"
          >
            <CodeTerminal />
          </motion.div>
        </div>
        
        <div className="absolute inset-0 bg-grid opacity-20 pointer-events-none" />
      </section>

      {/* Product Glimpses Section */}
      <section className="py-20 px-6 relative overflow-hidden">
        <div className="max-w-7xl mx-auto">
          <div className="flex flex-col mb-24 max-w-3xl">
            <h2 className="font-mono text-[10px] font-black text-cyber uppercase tracking-[0.5em] mb-6 underline decoration-cyber/30 underline-offset-8">SUBSYSTEM_GLIMPSE</h2>
            <h3 className="text-5xl md:text-7xl font-black tracking-tighter uppercase leading-[0.9]">MACHINED FOR<br />THE ELITE.</h3>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-10">
            {/* Glimpse 1: Dashboard */}
            <ProductGlimpse title="COMMAND_CENTER" icon={Layout}>
              <div className="space-y-6">
                <div className="grid grid-cols-3 gap-3">
                  {[
                    { label: 'TELEMETRY', val: '24.1k', color: 'text-cyber' },
                    { label: 'STREAK', val: '42D', color: 'text-amber-500' },
                    { label: 'UPLINK', val: '99.9%', color: 'text-emerald-500' }
                  ].map(stat => (
                    <div key={stat.label} className="p-4 bg-white/[0.02] border border-white/[0.06] rounded-[2px]">
                      <p className="font-mono text-[8px] text-[#444] mb-1">{stat.label}</p>
                      <p className={`font-black text-lg ${stat.color}`}>{stat.val}</p>
                    </div>
                  ))}
                </div>
                <div className="blade p-5 bg-white/[0.01]">
                   <p className="font-mono text-[9px] text-[#444] mb-4">ACTIVE_ARCHIVES</p>
                   <div className="space-y-3">
                      {[
                        { name: 'K8S ORCHESTRATION', p: 85 },
                        { name: 'RUST KERNEL DEV', p: 40 },
                        { name: 'HFT ALGO DESIGN', p: 12 }
                      ].map(course => (
                        <div key={course.name} className="space-y-2">
                           <div className="flex justify-between font-mono text-[10px] font-black">
                             <span className="text-white">{course.name}</span>
                             <span className="text-cyber">{course.p}%</span>
                           </div>
                           <div className="h-1.5 w-full bg-white/[0.05]">
                             <motion.div 
                               initial={{ width: 0 }}
                               whileInView={{ width: `${course.p}%` }}
                               className="h-full bg-cyber" 
                             />
                           </div>
                        </div>
                      ))}
                   </div>
                </div>
              </div>
            </ProductGlimpse>

            {/* Glimpse 2: AI Mentor */}
            <ProductGlimpse title="NEURAL_MENTOR" icon={Cpu} delay={0.2}>
              <div className="flex flex-col h-full space-y-4">
                <div className="flex-1 space-y-4">
                  <div className="flex justify-start">
                    <div className="bg-white/[0.04] p-4 rounded-[4px] border border-white/[0.08] max-w-[80%]">
                      <p className="font-mono text-[11px] text-[#888]">Analyze my memory allocation in the Rust kernel module.</p>
                    </div>
                  </div>
                  <div className="flex justify-end">
                    <div className="bg-cyber/[0.08] p-4 rounded-[4px] border border-cyber/20 max-w-[80%]">
                      <p className="font-mono text-[11px] text-white">SYSTEM_ID: MENTOR_V4<br/><br/>I've detected a potential race condition in your `alloc_node` block. Recommend using an atomic reference count for safety.</p>
                    </div>
                  </div>
                </div>
                <div className="h-12 bg-white/[0.02] border border-white/[0.08] rounded-[2px] px-4 flex items-center justify-between">
                   <span className="font-mono text-[10px] text-[#333]">Awaiting query...</span>
                   <Terminal size={14} className="text-[#333]" />
                </div>
              </div>
            </ProductGlimpse>

            {/* Glimpse 3: Leaderboard */}
            <ProductGlimpse title="HALL_OF_FAME" icon={Trophy} delay={0.3}>
              <div className="space-y-3">
                {[
                  { r: 1, n: 'VALENTINA_K', xp: '128,401', meta: 'SYSTEM ARCHITECT' },
                  { r: 2, n: 'CHEN_WEI', xp: '124,110', meta: 'KERNEL EXPERT' },
                  { r: 3, n: 'SARAH_LANCE', xp: '119,902', meta: 'SECURITY LEAD' }
                ].map(entry => (
                  <div key={entry.r} className="flex items-center gap-4 p-4 bg-white/[0.02] border-l-2 border-white/[0.06] hover:border-cyber transition-all">
                    <span className="font-mono font-black text-lg text-[#333]">0{entry.r}</span>
                    <div className="flex-1">
                      <p className="font-black text-xs text-white uppercase tracking-wider">{entry.n}</p>
                      <p className="font-mono text-[8px] text-[#444] uppercase">{entry.meta}</p>
                    </div>
                    <div className="text-right">
                      <p className="font-black text-sm text-cyber">{entry.xp}</p>
                      <p className="font-mono text-[8px] text-[#444] uppercase">XP</p>
                    </div>
                  </div>
                ))}
                <div className="pt-4 flex justify-center">
                  <button className="font-mono text-[9px] font-black text-[#444] hover:text-white uppercase tracking-[0.3em]">VIEW_GLOBAL_STANDINGS</button>
                </div>
              </div>
            </ProductGlimpse>

            {/* Glimpse 4: The Lab */}
            <ProductGlimpse title="THE_LAB" icon={Box} delay={0.4}>
              <div className="flex flex-col h-full bg-black/40 border border-white/[0.04] p-4 rounded-[4px]">
                 <div className="flex justify-between items-center pb-4 border-b border-white/[0.08] mb-4">
                    <span className="font-mono text-[9px] text-[#444]">KERNEL_SPOOLER // READY</span>
                    <Activity size={12} className="text-emerald-500" />
                 </div>
                 <div className="flex-1 font-mono text-[11px] text-cyber/60 leading-relaxed overflow-hidden">
                    [0.001] SYTEM INITIALIZING...<br/>
                    [0.014] KERNEL VERSION 6.2.1-SF VERIFIED<br/>
                    [0.042] MEMORY SEGMENTS ALLOCATED [0x7FF01]<br/>
                    [0.105] LOADING NEURAL WEIGHTS...<br/>
                    [0.219] SUCCESS: SYSTEM OPTIMAL.<br/>
                    <br/>
                    <span className="text-white cursor-blink italic">Awaiting technical pulse</span>
                 </div>
              </div>
            </ProductGlimpse>
          </div>
        </div>
      </section>

      {/* Trust / Stats */}
      <section className="py-24 border-y border-white/[0.05] bg-white/[0.01] relative">
        <div className="max-w-7xl mx-auto px-6 grid grid-cols-2 md:grid-cols-4 gap-12 text-center">
          {[
            { val: "24.7K", label: "ACTIVE ENGINEERS" },
            { val: "183K", label: "BATTLES FOUGHT" },
            { val: "265+", label: "ELITE MODULES" },
            { val: "99.9%", label: "SYSTEM UPTIME" }
          ].map((stat, i) => (
            <div key={i}>
              <div className="text-4xl font-black text-white mb-2 tracking-tighter">{stat.val}</div>
              <div className="font-mono text-[9px] font-black text-[#333] tracking-[0.3em] uppercase">{stat.label}</div>
            </div>
          ))}
        </div>
      </section>

      {/* Final CTA */}
      <section className="py-56 px-6 relative overflow-hidden text-center">
        <div className="max-w-3xl mx-auto relative z-10">
          <h2 className="text-6xl md:text-8xl font-black tracking-tighter mb-12 uppercase leading-[0.85]">
            START YOUR<br />
            <span className="text-cyber">DEVOLUTION.</span>
          </h2>
          <Button 
            size="xl" 
            variant="primary" 
            className="shimmer-btn font-black h-20 px-16 tracking-[0.3em] text-sm"
            onClick={() => navigate('/register')}
          >
            INITIALIZE PROTOCOL
          </Button>
          <p className="mt-10 font-mono text-[10px] text-[#444] uppercase tracking-widest">NO_BLUF // PRODUCTION_READY</p>
        </div>
        
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-cyber/10 blur-[160px] rounded-full pointer-events-none" />
      </section>

      {/* Footer */}
      <footer className="py-24 px-6 border-t border-white/[0.05] bg-[#020202]">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row justify-between gap-16">
          <div className="max-w-xs">
            <div className="flex items-center gap-2 mb-8">
              <div className="w-8 h-8 bg-white flex items-center justify-center rounded-[4px]">
                <div className="w-4 h-4 bg-black rounded-[2px]" />
              </div>
              <span className="font-bold text-lg tracking-tighter text-white">SKILLFORGE</span>
            </div>
            <p className="text-xs text-[#555] leading-relaxed">Modern engineering education for the elite 1%. Machined with precision, validated by system telemetry.</p>
          </div>
          
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-16">
            {[
              { title: 'SYSTEM', links: ['TERMINAL', 'STATUS', 'API', 'AUTH'] },
              { title: 'ARCHIVE', links: ['RUST', 'ZIG', 'CARBON', 'JULIA'] },
              { title: 'ELITE', links: ['ARENA', 'GUILDS', 'HALL OF FAME', 'THE LAB'] }
            ].map(col => (
              <div key={col.title}>
                <h4 className="font-mono text-[10px] font-black text-[#555] tracking-[0.3em] mb-8 uppercase underline decoration-[#111] underline-offset-8">{col.title}</h4>
                <ul className="space-y-4">
                  {col.links.map(link => (
                    <li key={link}>
                      <a href="#" className="text-[10px] font-bold text-[#444] hover:text-white transition-colors tracking-widest uppercase">{link}</a>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>
        <div className="max-w-7xl mx-auto mt-24 pt-10 border-t border-white/[0.05] flex flex-col sm:flex-row justify-between items-center gap-6">
          <div className="font-mono text-[9px] text-[#333] tracking-[0.2em] uppercase">© 2026 SKILLFORGE OPERATIONS // ALL RIGHTS RESERVED</div>
          <div className="flex gap-8">
            <Github size={16} className="text-[#333] hover:text-white cursor-pointer transition-colors" />
            <Globe size={16} className="text-[#333] hover:text-white cursor-pointer transition-colors" />
          </div>
        </div>
      </footer>
    </div>
  );
}
