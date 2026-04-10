import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, useScroll, useTransform } from 'framer-motion';
import {
  Code, ChevronRight, Globe, Layers,
  Cpu, Workflow, Sparkles, MoveRight
} from 'lucide-react';

// ─── UTILITY FOR ELEGANT BUTTONS ───────────────────────
const EtherealButton = ({ children, onClick, primary }) => (
  <button
    onClick={onClick}
    className={`relative group overflow-hidden rounded-full font-medium text-sm md:text-base px-8 py-3 md:py-4 transition-all duration-500 ease-out ${
      primary
        ? 'bg-white text-black hover:scale-[1.02]'
        : 'bg-transparent text-white border border-white/20 hover:border-white/50 hover:bg-white/5'
    }`}
  >
    <span className="relative z-10 flex items-center gap-2">{children}</span>
    {primary && (
      <div className="absolute inset-0 bg-gradient-to-r from-white via-blue-100 to-white opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
    )}
  </button>
);

// ─── NAV ────────────────────────────────────────────────
const Navbar = () => {
  const navigate = useNavigate();
  const { scrollY } = useScroll();
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    return scrollY.onChange(v => setScrolled(v > 50));
  }, [scrollY]);

  return (
    <nav className={`fixed top-0 w-full z-50 transition-all duration-700 ${scrolled ? 'py-4 bg-black/40 backdrop-blur-2xl border-b border-white/5' : 'py-8 bg-transparent'}`}>
      <div className="max-w-7xl mx-auto px-6 md:px-12 flex items-center justify-between">
        <div className="flex items-center gap-3 cursor-pointer group" onClick={() => navigate('/')}>
          <div className="w-8 h-8 rounded-full bg-gradient-to-br from-white to-slate-400 flex items-center justify-center shadow-[0_0_20px_rgba(255,255,255,0.3)] group-hover:shadow-[0_0_30px_rgba(255,255,255,0.5)] transition-all duration-500">
             <Code size={16} className="text-black" />
          </div>
          <span className="font-semibold text-lg tracking-tight text-white/90">SkillForge</span>
        </div>

        <div className="hidden md:flex items-center gap-10">
          {['Technologies', 'Curriculum', 'Ecosystem', 'Enterprise'].map(link => (
            <a key={link} href={`#${link.toLowerCase()}`} className="text-sm font-medium text-white/60 hover:text-white transition-colors duration-300">
              {link}
            </a>
          ))}
        </div>

        <div className="flex items-center gap-6">
           <button onClick={() => navigate('/login')} className="hidden sm:block text-sm font-medium text-white/60 hover:text-white transition-colors duration-300">
             Sign in
           </button>
           <button onClick={() => navigate('/signup')} className="text-sm font-medium text-white bg-white/10 hover:bg-white/20 backdrop-blur-md px-5 py-2.5 rounded-full transition-all duration-300 border border-white/10 hover:border-white/30">
             Get started
           </button>
        </div>
      </div>
    </nav>
  );
};

// ─── HERO (ELEGANT & OBJECT-DRIVEN) ────────────────────
const Hero = () => {
  const navigate = useNavigate();
  const { scrollY } = useScroll();
  const y1 = useTransform(scrollY, [0, 1000], [0, 200]);
  const y2 = useTransform(scrollY, [0, 1000], [0, -100]);
  const opacity = useTransform(scrollY, [0, 400], [1, 0]);

  return (
    <section className="relative min-h-screen flex items-center justify-center pt-20 px-6 overflow-hidden">
      {/* Deep Ethereal Backgrounds */}
      <div className="absolute inset-0 bg-[#020202]">
         <motion.div style={{ y: y1 }} className="absolute top-[-10%] left-[-10%] w-[50%] h-[50%] rounded-full bg-blue-600/20 blur-[150px] mix-blend-screen" />
         <motion.div style={{ y: y2 }} className="absolute bottom-[-10%] right-[-10%] w-[60%] h-[60%] rounded-full bg-purple-600/10 blur-[150px] mix-blend-screen" />
      </div>

      <motion.div style={{ opacity }} className="relative z-10 max-w-5xl mx-auto text-center flex flex-col items-center">
        <motion.div 
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1.2, ease: [0.16, 1, 0.3, 1] }}
          className="flex flex-col items-center"
        >
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full border border-white/10 bg-white/5 backdrop-blur-xl mb-12 shadow-[0_0_30px_rgba(255,255,255,0.03)]">
             <Sparkles size={14} className="text-blue-400" />
             <span className="text-xs font-medium text-white/80 tracking-wide">Introducing the next generation of learning</span>
          </div>
          
          <h1 className="text-6xl md:text-8xl lg:text-[7.5rem] font-medium text-white tracking-[-0.04em] leading-[1.05] mb-8">
            Engineering, <br className="hidden md:block" />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-white/40 to-white/80">elevated.</span>
          </h1>
          
          <p className="text-lg md:text-2xl text-white/50 font-normal max-w-3xl mb-14 leading-relaxed tracking-tight">
            Immerse yourself in a fluid ecosystem of intelligent curricula, instant cloud architectures, and seamless code execution. The pursuit of mastery, redefined.
          </p>
          
          <div className="flex flex-col sm:flex-row items-center gap-6">
             <EtherealButton primary onClick={() => navigate('/signup')}>
               Start your journey
             </EtherealButton>
             <EtherealButton onClick={() => navigate('/courses')}>
               Explore the curriculum <ChevronRight size={16} />
             </EtherealButton>
          </div>
        </motion.div>
      </motion.div>

      {/* Floating 3D-like glass orb (HTML/CSS approximation) */}
      <motion.div 
        animate={{ y: [0, -20, 0], rotate: [0, 5, 0] }}
        transition={{ duration: 8, repeat: Infinity, ease: "easeInOut" }}
        className="absolute bottom-10 md:bottom-20 right-[10%] md:right-[20%] w-32 h-32 md:w-64 md:h-64 rounded-full border border-white/20 bg-gradient-to-br from-white/10 to-transparent backdrop-blur-3xl shadow-[0_0_80px_rgba(255,255,255,0.05)] flex items-center justify-center"
      >
         <div className="w-1/2 h-1/2 rounded-full bg-blue-400/20 blur-xl" />
      </motion.div>
    </section>
  );
};

// ─── FLUID FEATURES (NO BLOCKS) ─────────────────────────
const FeatureSection = ({ reverse, title, description, icon: Icon, inView }) => {
  return (
    <div className={`py-24 md:py-40 px-6 md:px-12 max-w-7xl mx-auto flex flex-col ${reverse ? 'md:flex-row-reverse' : 'md:flex-row'} items-center gap-16 md:gap-32`}>
      <motion.div 
        initial={{ opacity: 0, x: reverse ? 50 : -50 }}
        whileInView={{ opacity: 1, x: 0 }}
        viewport={{ once: true, margin: "-100px" }}
        transition={{ duration: 1.2, ease: [0.16, 1, 0.3, 1] }}
        className="flex-1 space-y-8"
      >
        <div className="w-14 h-14 rounded-2xl bg-white/5 border border-white/10 flex items-center justify-center backdrop-blur-xl shadow-[0_4px_30px_rgba(0,0,0,0.1)]">
           <Icon size={24} className="text-white/80" />
        </div>
        <h2 className="text-4xl md:text-6xl font-medium text-white tracking-tight leading-[1.1]">{title}</h2>
        <p className="text-xl text-white/50 leading-relaxed font-normal">{description}</p>
        
        <div className="pt-4 flex items-center gap-3 text-white/70 hover:text-white transition-colors cursor-pointer group w-max">
           <span className="text-sm font-medium">Discover more</span>
           <MoveRight size={16} className="group-hover:translate-x-1 transition-transform" />
        </div>
      </motion.div>

      <motion.div 
        initial={{ opacity: 0, scale: 0.9 }}
        whileInView={{ opacity: 1, scale: 1 }}
        viewport={{ once: true, margin: "-100px" }}
        transition={{ duration: 1.5, ease: [0.16, 1, 0.3, 1] }}
        className="flex-1 relative w-full aspect-square md:aspect-video rounded-[40px] overflow-hidden"
      >
        {/* Soft Glass Canvas instead of hard borders */}
        <div className="absolute inset-0 bg-gradient-to-br from-white/5 to-transparent backdrop-blur-3xl border border-white/10 rounded-[40px] shadow-[0_20px_60px_rgba(0,0,0,0.5)] flex items-center justify-center overflow-hidden">
           {/* Abstract visual representations */}
           {reverse ? (
              <div className="w-full h-full relative flex items-center justify-center">
                 <div className="absolute w-64 h-64 border-[0.5px] border-white/20 rounded-full animate-[spin_20s_linear_infinite]" />
                 <div className="absolute w-48 h-48 border-[0.5px] border-white/30 rounded-full animate-[spin_15s_linear_infinite_reverse]" />
                 <div className="w-20 h-20 bg-white/10 rounded-full backdrop-blur-md border border-white/20 flex items-center justify-center z-10 shadow-[0_0_40px_rgba(255,255,255,0.1)]">
                    <Globe size={32} className="text-white/80" />
                 </div>
              </div>
           ) : (
              <div className="w-full h-full relative p-10 flex flex-col justify-center gap-6">
                 {[1, 2, 3].map((i) => (
                   <motion.div 
                     key={i}
                     initial={{ opacity: 0, x: 20 }}
                     whileInView={{ opacity: 1, x: 0 }}
                     transition={{ delay: i * 0.2, duration: 1 }}
                     className="h-16 w-full rounded-2xl bg-white/5 border border-white/10 flex items-center px-6 gap-4"
                   >
                      <div className="w-3 h-3 rounded-full bg-blue-400/50" />
                      <div className="h-2 w-1/3 bg-white/10 rounded-full" />
                   </motion.div>
                 ))}
                 <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[150%] h-40 bg-blue-500/10 blur-[100px] -z-10 rotate-45" />
              </div>
           )}
        </div>
      </motion.div>
    </div>
  );
};

// ─── CTA (MINIMALIST SPLIT) ─────────────────────────────
const FinalCTA = () => {
  const navigate = useNavigate();
  return (
    <section className="relative py-40 overflow-hidden bg-[#020202]">
       <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full max-w-4xl h-[1px] bg-gradient-to-r from-transparent via-white/20 to-transparent" />
       
       <div className="max-w-5xl mx-auto px-6 text-center z-10 relative">
          <motion.div
             initial={{ opacity: 0, y: 40 }}
             whileInView={{ opacity: 1, y: 0 }}
             viewport={{ once: true }}
             transition={{ duration: 1.2, ease: [0.16, 1, 0.3, 1] }}
          >
             <h2 className="text-5xl md:text-7xl font-medium text-white tracking-tight mb-8 leading-tight">
               Build something <br />
               <span className="text-white/40">extraordinary.</span>
             </h2>
             <p className="text-xl text-white/50 mb-14 max-w-2xl mx-auto font-normal">
               Join a global network of engineers pushing the boundaries of what is possible.
             </p>
             <EtherealButton primary onClick={() => navigate('/signup')}>
               Create your account
             </EtherealButton>
          </motion.div>
       </div>
       
       {/* Deep luminous glow at bottom */}
       <div className="absolute bottom-[-50%] left-1/2 -translate-x-1/2 w-full max-w-screen-xl aspect-square bg-white/5 blur-[200px] rounded-full pointer-events-none" />
    </section>
  );
};

// ─── MAIN LANDING PAGE ──────────────────────────────────
export default function LandingPage() {
  return (
    <div className="bg-[#020202] min-h-screen font-sans selection:bg-white/20 selection:text-white">
      <Navbar />
      
      <main>
        <Hero />
        
        <div className="relative z-10 bg-[#020202]">
          <FeatureSection 
            title="Intelligent architecture."
            description="Experience a curriculum that adapts to your cognitive velocity. Deep, conceptual knowledge paired with immediate, tactile execution."
            icon={Workflow}
            reverse={false}
          />
          <FeatureSection 
            title="Borderless environments."
            description="Provision full-stack cloud environments instantly. No local configuration required. Your entire workspace rests securely in the cloud."
            icon={Layers}
            reverse={true}
          />
          <FeatureSection 
            title="Accelerated cognition."
            description="Our integrated AI mentorship analyzes your semantic intent, providing immediate structural feedback without disrupting your deep work state."
            icon={Cpu}
            reverse={false}
          />
        </div>

        <FinalCTA />
      </main>

      <footer className="py-24 px-6 md:px-12 border-t border-white/5 bg-[#020202] relative z-20">
         <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-4 gap-16 md:gap-8">
            <div className="col-span-1 md:col-span-2 flex flex-col gap-8 pr-12">
               <div className="flex items-center gap-3">
                  <div className="w-6 h-6 rounded-full bg-white flex items-center justify-center">
                     <Code size={12} className="text-black" />
                  </div>
                  <span className="font-medium text-base text-white tracking-tight">SkillForge</span>
               </div>
               <p className="text-white/40 text-sm leading-relaxed max-w-sm font-normal">
                  Designing the optimal environment for the next generation of software engineers. Elevate your craft.
               </p>
            </div>
            
            <div>
               <h4 className="text-sm font-medium text-white mb-6">Platform</h4>
               <ul className="space-y-4">
                  {['Features', 'Curriculum', 'Challenges', 'Enterprise'].map(link => (
                    <li key={link}><a href="#" className="text-sm font-normal text-white/50 hover:text-white transition-colors">{link}</a></li>
                  ))}
               </ul>
            </div>
            
            <div>
               <h4 className="text-sm font-medium text-white mb-6">Company</h4>
               <ul className="space-y-4">
                  {['About', 'Careers', 'Contact', 'Legal'].map(link => (
                    <li key={link}><a href="#" className="text-sm font-normal text-white/50 hover:text-white transition-colors">{link}</a></li>
                  ))}
               </ul>
            </div>
         </div>
         <div className="max-w-7xl mx-auto pt-16 mt-16 border-t border-white/5 flex flex-col md:flex-row justify-between items-center gap-6">
            <span className="text-sm font-normal text-white/40">© 2026 SkillForge. All rights reserved.</span>
            <div className="flex items-center gap-3 text-sm font-normal text-white/50">
               <span className="relative flex h-2 w-2">
                 <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75"></span>
                 <span className="relative inline-flex rounded-full h-2 w-2 bg-green-500"></span>
               </span>
               All systems operational
            </div>
         </div>
      </footer>
    </div>
  );
}
