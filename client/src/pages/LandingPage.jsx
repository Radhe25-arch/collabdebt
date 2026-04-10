import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, useScroll, useMotionValueEvent } from 'framer-motion';
import { 
  Zap, 
  ArrowRight, 
  Layout, 
  Shield, 
  Cpu, 
  Code, 
  Star,
  Users,
  CheckCircle2,
  Lock,
  Globe,
  Database,
  Terminal as TerminalIcon,
  Layers,
  Sparkles
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
      className={`fixed top-0 inset-x-0 z-50 transition-all duration-300 ${isScrolled ? 'bg-[#0f172a]/80 backdrop-blur-xl border-b border-white/5 py-3' : 'bg-transparent py-6'}`}
    >
      <div className="max-w-7xl mx-auto px-6 flex items-center justify-between">
        <div className="flex items-center gap-10">
          <div className="flex items-center gap-2.5 cursor-pointer" onClick={() => navigate('/')}>
             <div className="w-9 h-9 bg-blue-600 rounded-xl flex items-center justify-center shadow-lg shadow-blue-600/20">
                <Code size={18} className="text-white" />
             </div>
             <span className="font-bold text-xl tracking-tight text-white uppercase italic">SkillForge</span>
          </div>
          
          <div className="hidden md:flex items-center gap-8">
            {['Courses', 'Curriculum', 'About'].map(item => (
              <a key={item} href="#" className="text-sm font-medium text-slate-400 hover:text-white transition-colors">{item}</a>
            ))}
          </div>
        </div>

        <div className="flex items-center gap-4">
          <button onClick={() => navigate('/login')} className="text-sm font-semibold text-slate-400 hover:text-white transition-colors">Log in</button>
          <Button 
            className="rounded-full bg-blue-600 hover:bg-blue-500 border-none px-6 h-10 glow-blue transition-all"
            onClick={() => navigate('/register')}
          >
            Get Started Free
          </Button>
        </div>
      </div>
    </motion.nav>
  );
};

// ─── VS CODE GLASS CARD ──────────────────────────────────
const CodePreview = () => (
  <motion.div 
    initial={{ x: 100, opacity: 0 }}
    animate={{ x: 0, opacity: 1 }}
    transition={{ duration: 1, ease: "easeOut" }}
    className="relative"
  >
    <div className="absolute -inset-4 bg-blue-500/10 blur-[100px] rounded-full" />
    <div className="relative w-full max-w-xl bg-slate-900/40 backdrop-blur-3xl border border-white/10 rounded-3xl overflow-hidden shadow-2xl">
      <div className="h-10 bg-white/5 border-b border-white/5 flex items-center px-4 gap-2">
        <div className="flex gap-1.5">
          <div className="w-2.5 h-2.5 rounded-full bg-red-500/50" />
          <div className="w-2.5 h-2.5 rounded-full bg-yellow-500/50" />
          <div className="w-2.5 h-2.5 rounded-full bg-green-500/50" />
        </div>
        <div className="mx-auto text-[10px] font-mono text-slate-500 uppercase tracking-widest bg-white/5 px-3 py-1 rounded-full">
          skillforge.component.jsx
        </div>
      </div>
      <div className="p-8 font-mono text-sm leading-relaxed overflow-hidden">
        <div className="flex gap-4">
          <span className="text-slate-700">1</span>
          <span className="text-blue-400">export default function</span>
          <span className="text-white"> SaaSBuilding() {'{'}</span>
        </div>
        <div className="flex gap-4">
          <span className="text-slate-700">2</span>
          <span className="text-slate-400 ml-4">const [build, setBuild] = useState(true);</span>
        </div>
        <div className="flex gap-4">
          <span className="text-slate-700">3</span>
        </div>
        <div className="flex gap-4">
          <span className="text-slate-700">4</span>
          <span className="text-slate-400 ml-4">useEffect(() =&gt; {'{'}</span>
        </div>
        <div className="flex gap-4">
          <span className="text-slate-700">5</span>
          <span className="text-emerald-400 ml-8">System.launch('SkillForge');</span>
        </div>
        <div className="flex gap-4">
          <span className="text-slate-700">6</span>
          <span className="text-slate-400 ml-4">{'}'}, []);</span>
        </div>
        <div className="flex gap-4">
          <span className="text-slate-700">7</span>
          <span className="text-white">{'}'}</span>
        </div>
        <motion.div 
           animate={{ opacity: [1, 0, 1] }}
           transition={{ repeat: Infinity, duration: 1 }}
           className="w-1.5 h-5 bg-blue-500 inline-block align-middle ml-1"
        />
      </div>
    </div>
  </motion.div>
);

// ─── BENTO CARD ──────────────────────────────────────────
const BentoCard = ({ title, desc, difficulty, skills, rating, icon: Icon, color = 'blue' }) => (
  <div className="group sf-card p-1 rounded-[26px] bg-gradient-to-b from-white/10 to-transparent">
     <div className="bg-slate-900 rounded-[25px] p-8 h-full flex flex-col items-start hover:bg-slate-800/80 transition-all duration-300">
        <div className={`w-12 h-12 rounded-2xl bg-${color}-500/10 flex items-center justify-center mb-6 group-hover:scale-110 transition-transform`}>
          <Icon className={`text-${color}-500`} size={24} />
        </div>
        
        <div className="flex items-center gap-1 mb-3">
           {[...Array(5)].map((_, i) => (
             <Star key={i} size={12} className={i < 4 ? 'fill-yellow-500 text-yellow-500' : 'text-slate-600'} />
           ))}
           <span className="text-[11px] font-bold text-slate-400 ml-1">{rating}</span>
        </div>

        <h3 className="text-xl font-bold text-white mb-2 leading-tight">{title}</h3>
        <p className="text-slate-500 text-sm mb-8 leading-relaxed line-clamp-2">{desc}</p>
        
        <div className="mt-auto w-full space-y-4 pt-6 border-t border-white/5">
           <div className="flex justify-between items-center text-xs">
              <span className="text-slate-500 font-medium font-mono uppercase tracking-widest">Difficulty</span>
              <span className="text-blue-400 font-bold px-3 py-1 bg-blue-400/10 rounded-full">{difficulty}</span>
           </div>
           <div className="flex justify-between items-center text-xs">
              <span className="text-slate-500 font-medium font-mono uppercase tracking-widest">Skills Gained</span>
              <span className="text-slate-300 font-medium">{skills}</span>
           </div>
        </div>
     </div>
  </div>
);

// ─── MAIN LANDING PAGE ───────────────────────────────────
export default function LandingPage() {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-[#0f172a] text-white selection:bg-blue-600/30 overflow-hidden font-sans">
      <Navbar />

      {/* Hero Section */}
      <section className="relative pt-48 pb-32 px-6">
        <div className="max-w-7xl mx-auto flex flex-col lg:flex-row items-center gap-20">
          <div className="lg:w-1/2 text-left relative z-10">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="inline-flex items-center gap-2 px-4 py-2 bg-blue-600/10 border border-blue-600/20 rounded-full mb-8"
            >
              <Sparkles size={14} className="text-blue-500" />
              <span className="text-xs font-bold text-blue-500 tracking-wider uppercase">V4.0 LIVE NOW</span>
            </motion.div>

            <motion.h1 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
              className="text-6xl md:text-8xl font-black tracking-tight leading-[0.9] mb-8"
            >
              Build <span className="text-blue-500 bg-clip-text">SaaS</span>,<br />
              <span className="text-white">Not Just Code.</span>
            </motion.h1>

            <motion.p 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="text-xl text-slate-400 mb-12 max-w-xl leading-relaxed font-medium"
            >
              The most sophisticated engineering curriculum designed for the transition from developer to tech founder. 100% Free. Elite Grade.
            </motion.p>

            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
              className="flex flex-wrap gap-5"
            >
              <Button 
                className="h-16 px-10 rounded-2xl bg-blue-600 hover:bg-blue-500 text-base font-bold transition-all glow-blue border-none"
                onClick={() => navigate('/register')}
              >
                Access Courses Free
              </Button>
              <button 
                onClick={() => navigate('/courses')}
                className="h-16 px-10 rounded-2xl border border-white/10 hover:border-white/20 hover:bg-white/5 text-base font-bold transition-all flex items-center gap-3 active:scale-95"
              >
                View Curriculum <ArrowRight size={18} />
              </button>
            </motion.div>
          </div>

          <div className="lg:w-1/2 relative lg:block hidden">
            <CodePreview />
          </div>
        </div>
        
        {/* Abstract Background Blur */}
        <div className="absolute top-0 right-0 w-[800px] h-[800px] bg-blue-600/5 blur-[120px] rounded-full -translate-y-1/2 translate-x-1/2" />
      </section>

      {/* Social Proof Stats Bar */}
      <section className="py-20 bg-slate-900 border-y border-white/5">
        <div className="max-w-7xl mx-auto px-6">
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-12 text-center items-center">
            {[
              { val: "500k+", label: "Elite Students" },
              { val: "$0", label: "Tuition Cost" },
              { val: "12k+", label: "Community SaaS" },
              { val: "$10k", label: "Value / Course" }
            ].map((stat, i) => (
              <React.Fragment key={i}>
                <div className="space-y-2">
                  <div className="text-4xl font-black text-white tracking-tighter">{stat.val}</div>
                  <div className="text-xs font-bold text-slate-500 uppercase tracking-[0.2em]">{stat.label}</div>
                </div>
                {i < 3 && <div className="hidden lg:block w-px h-12 bg-white/5 mx-auto" />}
              </React.Fragment>
            ))}
          </div>
        </div>
      </section>

      {/* Bento Grid Course Recommendations */}
      <section className="py-40 px-6">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-24">
            <h2 className="text-blue-500 font-bold tracking-[0.3em] uppercase mb-4">Elite Listings</h2>
            <h3 className="text-4xl md:text-5xl font-black tracking-tight">Master Industrial Scaling.</h3>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            <BentoCard 
              title="Global K8s Infrastructure"
              desc="Deploy and scale microservices across multiple clouds with extreme reliability."
              difficulty="Advanced"
              skills="K8s, Terraform, AWS"
              rating={4.9}
              icon={Layout}
              color="blue"
            />
            <BentoCard 
              title="Full-Stack SaaS Architecture"
              desc="The definitive guide to building a modern, performant, and secure SaaS from scratch."
              difficulty="Intermediate"
              skills="Next.js, Prisma, Stripe"
              rating={4.8}
              icon={Layers}
              color="emerald"
            />
            <BentoCard 
              title="High-Frequency Systems"
              desc="Build low-latency messaging systems and distributed data pipelines with Rust."
              difficulty="Expert"
              skills="Rust, gRPC, Redis"
              rating={4.9}
              icon={Cpu}
              color="violet"
            />
          </div>
          
          <div className="mt-20 text-center">
             <button 
               onClick={() => navigate('/courses')}
               className="text-slate-400 hover:text-white font-bold text-sm tracking-widest uppercase underline underline-offset-8 transition-colors"
             >
                Explore all 265+ Technical Modules
             </button>
          </div>
        </div>
      </section>

      {/* Value Proposition Grid */}
      <section className="py-40 px-6 bg-slate-900 border-t border-white/5 relative overflow-hidden">
        <div className="max-w-7xl mx-auto">
           <div className="grid grid-cols-1 lg:grid-cols-2 gap-24 items-center">
              <div>
                 <h2 className="text-5xl font-black tracking-tight mb-8 leading-tight">Elite Infrastructure for<br />Technical Mastery.</h2>
                 <div className="space-y-6">
                    {[
                      { t: 'Industrial Sandbox', d: 'Execute production-grade code in safe, isolated virtual environments.' },
                      { t: 'Multiplayer Rooms', d: 'Collaborate live with peer engineers on complex architecture.' },
                      { t: 'Neural AI Mentor', d: 'Deep code analysis and feedback from our custom-trained 4.0 LLM.' }
                    ].map(feat => (
                      <div key={feat.t} className="flex gap-5">
                         <div className="mt-1 w-5 h-5 rounded-full bg-blue-500 flex items-center justify-center flex-shrink-0">
                            <CheckCircle2 size={14} className="text-white" />
                         </div>
                         <div>
                            <h4 className="font-bold text-white mb-2">{feat.t}</h4>
                            <p className="text-slate-500 text-sm leading-relaxed">{feat.d}</p>
                         </div>
                      </div>
                    ))}
                 </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                 <div className="space-y-4">
                    <div className="h-64 bg-[#1e293b] rounded-[40px] border border-white/10 p-10 flex flex-col justify-end">
                       <Zap className="text-blue-500 mb-4" />
                       <p className="text-white font-bold">Lightning Fast</p>
                    </div>
                    <div className="h-48 bg-[#1e293b] rounded-[40px] border border-white/10 p-10 flex flex-col justify-end">
                       <Lock className="text-emerald-500 mb-4" />
                       <p className="text-white font-bold">Secure</p>
                    </div>
                 </div>
                 <div className="space-y-4 pt-12">
                     <div className="h-48 bg-[#1e293b] rounded-[32px] border border-white/10 p-10 flex flex-col justify-end">
                       <Users className="text-violet-500 mb-4" />
                       <p className="text-white font-bold">Social</p>
                    </div>
                    <div className="h-64 bg-[#1e293b] rounded-[32px] border border-white/10 p-10 flex flex-col justify-end">
                       <Sparkles className="text-amber-500 mb-4" />
                       <p className="text-white font-bold">AI Driven</p>
                    </div>
                 </div>
              </div>
           </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-24 px-6 border-t border-white/5">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row justify-between items-center gap-10">
          <div className="flex items-center gap-2.5">
             <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center">
                <Code size={16} className="text-white" />
             </div>
             <span className="font-bold text-lg tracking-tight text-white uppercase italic">SkillForge</span>
          </div>
          
          <p className="text-slate-500 text-xs tracking-widest uppercase">© 2026 SkillForge Operations. Built for the elite.</p>
          
          <div className="flex gap-8">
            <Globe size={18} className="text-slate-500 hover:text-white cursor-pointer transition-colors" />
            <Github size={18} className="text-slate-500 hover:text-white cursor-pointer transition-colors" />
          </div>
        </div>
      </footer>
    </div>
  );
}
