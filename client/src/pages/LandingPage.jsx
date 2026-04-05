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
  Database
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
            <span className="font-bold text-lg tracking-tighter text-white">SKILLFORGE</span>
          </div>
          
          <div className="hidden md:flex items-center gap-6">
            {['CURRICULUM', 'BATTLES', 'MENTOR', 'FORUM'].map(item => (
              <a 
                key={item} 
                href={`/${item.toLowerCase()}`}
                className="text-[11px] font-bold text-[#666] hover:text-white transition-colors tracking-widest"
              >
                {item}
              </a>
            ))}
          </div>
        </div>

        <div className="flex items-center gap-4">
          <button 
            onClick={() => navigate('/login')}
            className="text-[11px] font-bold text-[#666] hover:text-white transition-colors tracking-widest"
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
    <div className="w-full max-w-2xl glass-overlay rounded-[4px] overflow-hidden shadow-2xl">
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
    </div>
  );
};

// ─── BENTO CARD ──────────────────────────────────────────
const BentoCard = ({ icon: Icon, title, desc, className = "", delay = 0 }) => {
  const cardRef = useRef(null);

  const handleMouseMove = (e) => {
    if (!cardRef.current) return;
    const { left, top } = cardRef.current.getBoundingClientRect();
    cardRef.current.style.setProperty('--mouse-x', `${e.clientX - left}px`);
    cardRef.current.style.setProperty('--mouse-y', `${e.clientY - top}px`);
  };

  return (
    <motion.div
      ref={cardRef}
      onMouseMove={handleMouseMove}
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ delay }}
      whileHover={{ y: -5 }}
      className={`bento-card p-6 flex flex-col gap-4 group ${className}`}
    >
      <div className="w-10 h-10 rounded-[4px] bg-white/5 border border-white/10 flex items-center justify-center transition-colors group-hover:border-cyber/30">
        <Icon size={18} className="text-[#666] group-hover:text-cyber transition-colors" />
      </div>
      <div>
        <h3 className="font-black text-sm text-white uppercase tracking-wider mb-2">{title}</h3>
        <p className="text-xs text-[#555] leading-relaxed group-hover:text-[#888] transition-colors">{desc}</p>
      </div>
    </motion.div>
  );
};

// ─── MAIN PAGE ───────────────────────────────────────────
export default function LandingPage() {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-black text-white selection:bg-cyber/30 selection:text-white aurora-bg">
      <Navbar />

      {/* Hero Section */}
      <section className="relative pt-40 pb-20 px-6 overflow-hidden">
        <div className="max-w-7xl mx-auto text-center relative z-10">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="inline-flex items-center gap-2 px-3 py-1 bg-white/5 border border-white/10 rounded-full mb-8"
          >
            <Sparkles size={12} className="text-cyber" />
            <span className="text-[10px] font-bold text-[#666] tracking-[0.2em] uppercase">V4.0 // PRODUCTION READY</span>
          </motion.div>

          <motion.h1 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="text-shimmer text-6xl md:text-8xl font-black tracking-tighter leading-[0.9] mb-8"
          >
            MASTER THE CRAFT<br />
            <span className="text-white">OF ENGINEERING.</span>
          </motion.h1>

          <motion.p 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="max-w-2xl mx-auto text-[#666] text-lg md:text-xl mb-12 font-medium"
          >
            High-precision gamified learning for the world's most demanding technical teams. No shortcuts. Just pure engineering mastery.
          </motion.p>

          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="flex flex-wrap justify-center gap-4"
          >
            <Button 
              size="xl" 
              variant="primary" 
              className="shimmer-btn font-black px-10 tracking-[0.1em]"
              onClick={() => navigate('/register')}
            >
              INITIALIZE PROTOCOL
            </Button>
            <Button 
              size="xl" 
              variant="secondary" 
              className="px-10 border-white/10 hover:border-white/30 tracking-[0.1em]"
              onClick={() => navigate('/courses')}
            >
              EXPLORE ARCHIVE
            </Button>
          </motion.div>

          <motion.div 
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.5, type: 'spring' }}
            className="mt-20 flex justify-center"
          >
            <CodeTerminal />
          </motion.div>
        </div>
        
        {/* Subtle decorative grid */}
        <div className="absolute inset-0 bg-grid opacity-20 pointer-events-none" />
      </section>

      {/* Bento Section */}
      <section className="py-32 px-6">
        <div className="max-w-7xl mx-auto">
          <div className="flex flex-col md:flex-row justify-between items-end gap-8 mb-16">
            <div className="max-w-lg">
              <h2 className="font-mono text-[10px] font-black text-cyber uppercase tracking-[0.3em] mb-4 underline decoration-cyber/30 underline-offset-8">THE ECOSYSTEM</h2>
              <h3 className="text-4xl md:text-5xl font-black tracking-tight uppercase leading-none">MACHINED FOR<br />PERFORMANCE</h3>
            </div>
            <div className="text-[#444] font-medium max-w-sm text-sm">
              We've deconstructed the learning process into its core components. Every byte of SkillForge is engineered for high-density knowledge transfer.
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-12 gap-4">
            <BentoCard 
              className="md:col-span-8 h-[300px]"
              icon={Cpu}
              title="AI MENTOR ENGINE"
              desc="Real-time static and dynamic code analysis that understands intent, not just syntax. Your personal engineering lead, available 24/7."
              delay={0.1}
            />
            <BentoCard 
              className="md:col-span-4 h-[300px]"
              icon={Zap}
              title="1V1 ARENA"
              desc="High-stakes competitive duels against the world's top talent. Low-latency, server-synced, absolute precision."
              delay={0.2}
            />
            <BentoCard 
              className="md:col-span-4 h-[300px]"
              icon={Layers}
              title="250+ ARCHIVES"
              desc="From Kernel development in Zig to High-frequency trading systems in Rust. The most comprehensive curriculum in existence."
              delay={0.3}
            />
            <BentoCard 
              className="md:col-span-4 h-[300px]"
              icon={Shield}
              title="VERIFIED PROOF"
              desc="Stop collecting certificates. Build a provable, on-chain portfolio of engineering achievements verified by AI."
              delay={0.4}
            />
            <BentoCard 
              className="md:col-span-4 h-[300px]"
              icon={Globe}
              title="ELITE NETWORK"
              desc="Access private study rooms, engineering guilds, and direct recruitment pipelines to the world's most innovative teams."
              delay={0.5}
            />
          </div>
        </div>
      </section>

      {/* Trust / Stats */}
      <section className="py-20 border-y border-white/5 bg-white/[0.01]">
        <div className="max-w-7xl mx-auto px-6 grid grid-cols-2 md:grid-cols-4 gap-12">
          {[
            { val: "24.7K", label: "ACTIVE ENGINEERS" },
            { val: "183K", label: "BATTLES FOUGHT" },
            { val: "250+", label: "ELITE COURSES" },
            { val: "99.9%", label: "JUDGE0 UPTIME" }
          ].map((stat, i) => (
            <div key={i} className="text-center">
              <div className="text-3xl font-black text-white mb-2">{stat.val}</div>
              <div className="font-mono text-[9px] font-black text-[#444] tracking-[0.2em]">{stat.label}</div>
            </div>
          ))}
        </div>
      </section>

      {/* Final CTA */}
      <section className="py-40 px-6 relative overflow-hidden text-center">
        <div className="max-w-3xl mx-auto relative z-10">
          <h2 className="text-5xl md:text-7xl font-black tracking-tighter mb-8 lowercase">
            Your journey starts<br />
            <span className="text-cyber">at the metal.</span>
          </h2>
          <Button 
            size="xl" 
            variant="primary" 
            className="shimmer-btn font-black px-12 tracking-[0.2em]"
            onClick={() => navigate('/register')}
          >
            START PROTOCOL
          </Button>
        </div>
        
        {/* Glow behind CTA */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] bg-cyber/10 blur-[120px] rounded-full" />
      </section>

      {/* Footer */}
      <footer className="py-20 px-6 border-t border-white/5">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row justify-between gap-12">
          <div>
            <div className="flex items-center gap-2 mb-6">
              <div className="w-6 h-6 bg-white flex items-center justify-center rounded-[2px]">
                <div className="w-3 h-3 bg-black rounded-[1px]" />
              </div>
              <span className="font-bold text-sm tracking-tighter text-white uppercase">SKILLFORGE</span>
            </div>
            <p className="text-xs text-[#444] max-w-[200px]">Modern engineering education for the elite 1%.</p>
          </div>
          
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-12">
            {[
              { title: 'SYSTEM', links: ['CORE', 'STATUS', 'API', 'AUTH'] },
              { title: 'LEARN', links: ['RUST', 'ZIG', 'CARBON', 'MOJO'] },
              { title: 'ELITE', links: ['ARENA', 'GUILDS', 'RECRUIT', 'PRIME'] }
            ].map(col => (
              <div key={col.title}>
                <h4 className="font-mono text-[10px] font-black text-[#666] tracking-[0.2em] mb-6 uppercase">{col.title}</h4>
                <ul className="space-y-3">
                  {col.links.map(link => (
                    <li key={link}>
                      <a href="#" className="text-[10px] font-bold text-[#444] hover:text-white transition-colors">{link}</a>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>
        <div className="max-w-7xl mx-auto mt-20 pt-8 border-t border-white/5 flex flex-col sm:flex-row justify-between items-center gap-4">
          <div className="text-[9px] font-mono text-[#333] tracking-[0.1em]">© 2026 SKILLFORGE // ALL RIGHTS RESERVED</div>
          <div className="flex gap-6">
            <Github size={14} className="text-[#333] hover:text-white cursor-pointer" />
            <Globe size={14} className="text-[#333] hover:text-white cursor-pointer" />
          </div>
        </div>
      </footer>
    </div>
  );
}
