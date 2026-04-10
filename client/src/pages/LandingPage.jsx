import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, useScroll, useTransform, AnimatePresence } from 'framer-motion';
import { 
  ArrowRight, Code, Globe, Terminal, Cpu, Shield, 
  Zap, Layers, Activity, Command, ChevronRight
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
    <nav className={`fixed top-0 left-0 w-full z-[100] transition-all duration-300 ${isScrolled ? 'py-4 bg-black/80 backdrop-blur-xl border-b border-white/5' : 'py-8'}`}>
      <div className="max-w-7xl mx-auto px-10 flex items-center justify-between">
        <div className="flex items-center gap-2 group cursor-pointer" onClick={() => navigate('/')}>
          <div className="w-8 h-8 bg-white rounded-lg flex items-center justify-center">
             <Code size={16} className="text-black" />
          </div>
          <span className="font-bold text-lg tracking-tight text-white uppercase italic">SkillForge</span>
        </div>

        <div className="hidden md:flex items-center gap-12">
          {['Registry', 'Systems', 'Arena', 'Documentation'].map(link => (
            <a key={link} href={`#${link.toLowerCase()}`} className="text-[11px] font-bold text-slate-500 hover:text-white transition-colors uppercase tracking-[0.2em]">{link}</a>
          ))}
        </div>

        <div className="flex items-center gap-8">
           <button onClick={() => navigate('/login')} className="text-[11px] font-bold text-slate-400 uppercase tracking-widest hover:text-white transition-all">Sign In</button>
           <Button className="rounded-full h-10 px-8 bg-white text-black hover:bg-slate-200 border-none font-bold text-[11px] tracking-widest" onClick={() => navigate('/signup')}>Join Registry</Button>
        </div>
      </div>
    </nav>
  );
};

// ─── HERO ───────────────────────────────────────────────
const Hero = () => {
  const navigate = useNavigate();
  
  return (
    <section className="relative pt-60 pb-40 px-10 overflow-hidden min-h-screen flex flex-col justify-center">
      <div className="max-w-7xl mx-auto w-full relative z-10">
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1, ease: 'easeOut' }}
          className="max-w-5xl"
        >
          <div className="inline-flex items-center gap-2 px-3 py-1 bg-white/5 border border-white/10 rounded-full mb-10">
             <div className="w-1 h-1 rounded-full bg-blue-500 animate-pulse" />
             <span className="text-[9px] font-bold text-slate-400 uppercase tracking-[0.3em]">Stable Node Build 14.2</span>
          </div>
          
          <h1 className="text-7xl md:text-[9.5rem] font-black text-white tracking-[-0.07em] leading-[0.85] mb-12">
            Build the<br />
            <span className="text-muted text-slate-500">invisible.</span>
          </h1>
          
          <p className="text-slate-400 text-xl md:text-2xl font-medium max-w-2xl mb-16 leading-relaxed tracking-tight">
            The platform for elite engineering operations. Scale your architectural intuition in a high-fidelity sandbox built for the next generation of systems designers.
          </p>
          
          <div className="flex flex-col sm:flex-row items-center gap-8">
             <Button 
               size="lg" 
               className="h-20 px-16 rounded-full bg-white text-black hover:bg-slate-100 font-bold text-xl border-none w-full sm:w-auto transition-transform hover:scale-[1.02]"
               onClick={() => navigate('/signup')}
             >
               Start Execution
             </Button>
             <div className="flex items-center gap-4 text-slate-500 group cursor-pointer hover:text-white transition-colors">
                <span className="text-sm font-bold uppercase tracking-widest italic">Review Documentation</span>
                <ArrowRight size={20} className="group-hover:translate-x-1 transition-transform" />
             </div>
          </div>
        </motion.div>
      </div>

      {/* Extreme subtle background gradient */}
      <div className="absolute top-0 right-0 w-full h-[1000px] bg-[radial-gradient(ellipse_at_top_right,rgba(255,255,255,0.03)_0%,transparent_60%)] pointer-events-none" />
    </section>
  );
};

// ─── TRUST BAR ─────────────────────────────────────────
const TrustBar = () => {
  return (
    <div className="border-y border-white/5 py-12 px-10 bg-black">
       <div className="max-w-7xl mx-auto flex flex-wrap justify-center md:justify-between items-center gap-10 opacity-30">
          {['500K+ OPERATIVES', '$0 TUITION', '99.9% UPTIME', 'GLOBAL REGISTRY'].map(stat => (
            <span key={stat} className="text-[10px] font-bold text-white tracking-[0.4em] uppercase">{stat}</span>
          ))}
       </div>
    </div>
  );
};

// ─── THE ARCHITECTURE (FEATURES) ───────────────────────
const Features = () => {
  return (
    <section className="py-40 px-10 bg-black">
       <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
             {/* Large Feature Card */}
             <div className="md:col-span-2 h-[600px] bg-[#050505] rounded-[24px] border border-white/5 p-16 flex flex-col justify-end group overflow-hidden relative">
                <div className="absolute top-0 right-0 p-16 opacity-0 group-hover:opacity-5 transition-opacity">
                   <Command size={400} />
                </div>
                <div className="relative z-10 transition-transform group-hover:-translate-y-2 duration-500">
                   <h3 className="text-5xl font-black text-white mb-6 italic tracking-tighter uppercase leading-none">Command Systems.</h3>
                   <p className="text-slate-500 max-w-sm font-bold text-sm tracking-widest uppercase italic leading-relaxed">Operate at the edge of architectural logic. Build, deploy, and scale with millisecond precision.</p>
                </div>
             </div>

             {/* Small Feature Card */}
             <div className="h-[600px] bg-[#0a0a0c] rounded-[24px] border border-white/5 p-16 flex flex-col justify-between group">
                <div className="w-12 h-12 rounded-xl bg-white/5 flex items-center justify-center border border-white/5 group-hover:bg-white/10 transition-colors">
                   <Shield size={20} className="text-white" />
                </div>
                <div>
                   <h3 className="text-4xl font-black text-white mb-6 italic tracking-tighter uppercase leading-none">Ironclad Registry.</h3>
                   <p className="text-slate-600 font-bold text-xs tracking-[0.2em] uppercase italic leading-relaxed">Your data remains Yours. Industry-grade encryption at every endpoint.</p>
                </div>
             </div>
          </div>
       </div>
    </section>
  );
};

// ─── TECHNICAL PREVIEW ─────────────────────────────────
const TechnicalPreview = () => {
  return (
    <section className="py-40 px-10 bg-black relative">
       <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-32 items-center">
          <div>
             <span className="text-[10px] font-bold text-slate-500 uppercase tracking-[0.4em] mb-4 block italic underline">Operational Depth</span>
             <h2 className="text-6xl font-black text-white tracking-tighter mb-10 leading-none italic uppercase">Engineering<br />in the Dark.</h2>
             <p className="text-slate-400 text-xl font-medium leading-relaxed mb-12">
                Every line of code you commit is analyzed by a custom simulation kernel. Identify faults before they reach the registry.
             </p>
             <div className="flex items-center gap-10">
                <div className="flex flex-col">
                   <span className="text-[9px] font-bold text-slate-600 uppercase tracking-widest mb-1">Latency</span>
                   <span className="text-2xl font-black text-white italic tracking-widest">12ms</span>
                </div>
                <div className="flex flex-col">
                   <span className="text-[9px] font-bold text-slate-600 uppercase tracking-widest mb-1">Throughput</span>
                   <span className="text-2xl font-black text-white italic tracking-widest">1.4 GB/s</span>
                </div>
             </div>
          </div>

          <div className="relative">
             <div className="absolute inset-0 bg-white/5 blur-[120px] rounded-full pointer-events-none" />
             <div className="relative bg-[#050505] rounded-[32px] border border-white/10 p-8 shadow-2xl">
                <div className="flex items-center gap-2 mb-8 border-b border-white/5 pb-4">
                   <div className="w-2.5 h-2.5 rounded-full bg-white/10" />
                   <div className="w-2.5 h-2.5 rounded-full bg-white/10" />
                   <div className="w-2.5 h-2.5 rounded-full bg-white/10" />
                   <span className="text-[9px] font-mono text-slate-600 ml-4 font-bold tracking-widest">SF_TERMINAL_V1.0</span>
                </div>
                <div className="font-mono text-xs text-slate-400 space-y-3">
                   <p className="text-white">$ initiate_sequence_main()</p>
                   <p className="text-slate-600">{">"} Checking system nodes... OK</p>
                   <p className="text-slate-600">{">"} Allocating kernel space... OK</p>
                   <p className="text-blue-500 italic font-bold tracking-[0.2em]">{">"} SKILLFORGE READY FOR EXECUTION</p>
                   <div className="w-2 h-4 bg-white/20 animate-pulse mt-4 inline-block" />
                </div>
             </div>
          </div>
       </div>
    </section>
  );
};

// ─── CTA ───────────────────────────────────────────────
const FinalCTA = () => {
  const navigate = useNavigate();
  return (
    <section className="py-60 px-10 text-center bg-black">
       <motion.div 
         initial={{ opacity: 0, y: 30 }}
         whileInView={{ opacity: 1, y: 0 }}
         viewport={{ once: true }}
         className="max-w-4xl mx-auto"
       >
          <h2 className="text-7xl md:text-9xl font-black text-white tracking-[-0.06em] leading-[0.85] mb-12 italic uppercase">
            Initialize<br />the Future.
          </h2>
          <Button 
            className="h-20 px-20 rounded-full bg-white text-black hover:bg-slate-200 font-bold text-2xl border-none transition-transform hover:scale-[1.05]"
            onClick={() => navigate('/signup')}
          >
            Join Registry
          </Button>
       </motion.div>
    </section>
  );
};

// ─── MAIN LANDING PAGE ──────────────────────────────────
export default function LandingPage() {
  return (
    <div className="bg-black min-h-screen selection:bg-white selection:text-black overflow-x-hidden">
      <Navbar />
      <Hero />
      <TrustBar />
      <main>
         <Features />
         <TechnicalPreview />
         <FinalCTA />
      </main>

      <footer className="py-32 px-10 border-t border-white/5 bg-black">
         <div className="max-w-7xl mx-auto flex flex-col md:flex-row justify-between items-start gap-20">
            <div className="flex flex-col gap-6">
               <div className="flex items-center gap-2">
                  <div className="w-8 h-8 bg-slate-800 rounded-lg flex items-center justify-center">
                     <Code size={16} className="text-white" />
                  </div>
                  <span className="font-bold text-lg tracking-tight text-white uppercase italic">SkillForge</span>
               </div>
               <p className="text-slate-600 text-[10px] font-bold uppercase tracking-[0.4em] italic mb-6">Designed for elite operations in the dark.</p>
               <div className="flex gap-10">
                  {['Discord', 'Systems', 'GitHub'].map(link => (
                    <span key={link} className="text-[10px] font-bold text-slate-500 hover:text-white transition-colors uppercase tracking-[0.2em] cursor-pointer italic underline">{link}</span>
                  ))}
               </div>
            </div>
            
            <div className="grid grid-cols-2 md:grid-cols-3 gap-20">
               <div>
                  <h4 className="text-[10px] font-bold text-white uppercase tracking-[0.3em] mb-10 italic">Platform</h4>
                  <ul className="space-y-6">
                     {['Archive', 'The Arena', 'Systems health'].map(link => (
                       <li key={link} className="text-[11px] font-bold text-slate-500 hover:text-white transition-colors uppercase tracking-[0.2em] cursor-pointer">{link}</li>
                     ))}
                  </ul>
               </div>
               <div>
                  <h4 className="text-[10px] font-bold text-white uppercase tracking-[0.3em] mb-10 italic">Company</h4>
                  <ul className="space-y-6">
                     {['Mission', 'Security', 'Legal'].map(link => (
                       <li key={link} className="text-[11px] font-bold text-slate-500 hover:text-white transition-colors uppercase tracking-[0.2em] cursor-pointer">{link}</li>
                     ))}
                  </ul>
               </div>
            </div>
         </div>
         <div className="max-w-7xl mx-auto pt-20 mt-20 border-t border-white/5 flex justify-between items-center opacity-30">
            <span className="text-[10px] font-bold uppercase tracking-widest italic text-white">© 2026 SkillForge Operations</span>
            <Globe size={20} className="text-white" />
         </div>
      </footer>
    </div>
  );
}
