import { useNavigate, Link } from 'react-router-dom';
import { motion, useScroll, useTransform } from 'framer-motion';
import { useRef, useEffect, useState } from 'react';
import Icons from '@/assets/icons';
import useParallax from '@/hooks/useParallax';
import { GlassPanel, NeonButton } from '@/components/landing/Primitives';
import { XPExplosion, ActivityTicker } from '@/components/landing/Interactive';

export default function LandingPage() {
  const navigate = useNavigate();
  const containerRef = useRef(null);
  const { scrollYProgress } = useScroll({ target: containerRef });
  
  const [showXP, setShowXP] = useState(false);
  const parallax = useParallax(30);

  // Experience Flow Transforms
  const heroOpacity = useTransform(scrollYProgress, [0, 0.2], [1, 0]);
  const dashboardScale = useTransform(scrollYProgress, [0.1, 0.4], [0.8, 1]);
  const dashboardRotate = useTransform(scrollYProgress, [0.1, 0.4], [-2, 0]);
  
  const battleX = useTransform(scrollYProgress, [0.4, 0.6], [100, 0]);
  const battleOpacity = useTransform(scrollYProgress, [0.4, 0.55], [0, 1]);

  useEffect(() => {
    const timer = setTimeout(() => setShowXP(true), 1200);
    return () => clearTimeout(timer);
  }, []);

  return (
    <div ref={containerRef} className="min-h-[400vh] bg-[#0A0A0F] text-[#F0EEF8] font-sans selection:bg-purple-500/30 overflow-x-hidden">
      
      {/* ─── PREMIUM NAVBAR ─── */}
      <nav className="fixed top-0 left-0 right-0 z-50 h-24 flex items-center justify-between px-12 bg-black/20 backdrop-blur-xl border-b border-white/5">
        <motion.div 
          initial={{ x: -20, opacity: 0 }}
          animate={{ x: 0, opacity: 1 }}
          className="flex items-center gap-4 cursor-pointer group" 
          onClick={() => navigate('/')}
        >
          <div className="w-10 h-10 rounded-xl bg-neon-teal flex items-center justify-center shadow-[0_0_20px_rgba(0,245,212,0.3)] -rotate-6 group-hover:rotate-0 transition-transform duration-500">
            <Icons.Code size={20} className="text-black" />
          </div>
          <span className="font-display font-black text-2xl tracking-tighter uppercase italic group-hover:not-italic transition-all">CodeArena</span>
        </motion.div>

        <div className="hidden lg:flex items-center gap-10 font-mono text-[10px] tracking-[0.2em] uppercase text-white/40">
          <Link to="/courses" className="hover:text-neon-teal transition-colors">/Curriculum</Link>
          <Link to="/battles" className="hover:text-neon-purple transition-colors">/1v1_Arena</Link>
          <Link to="/mentor" className="relative group">
            /AI_Mentor
            <span className="absolute -top-3 -right-6 text-[8px] bg-purple-500 text-white px-1 rounded-sm animate-pulse">BETA</span>
          </Link>
          <Link to="/community" className="hover:text-white transition-colors">/Flow</Link>
        </div>

        <div className="flex items-center gap-6">
          <button onClick={() => navigate('/login')} className="font-mono text-[10px] uppercase tracking-widest text-white/60 hover:text-white transition-colors">Login_</button>
          <NeonButton variant="teal" onClick={() => navigate('/register')} className="scale-90">Init_Session</NeonButton>
        </div>
      </nav>

      {/* ─── HERO: CINEMATIC ENTRY ─── */}
      <section className="sticky top-0 h-screen flex flex-col items-center justify-center px-6 overflow-hidden">
        <motion.div style={{ opacity: heroOpacity }} className="relative z-10 w-full max-w-7xl">
          
          <div className="absolute -top-20 left-1/4 w-[500px] h-[500px] bg-purple-600/10 rounded-full blur-[120px] -z-10 animate-pulse" />
          <div className="absolute top-40 right-1/4 w-[400px] h-[400px] bg-teal-600/10 rounded-full blur-[100px] -z-10" />

          <div className="flex flex-col items-center text-center">
            <motion.div 
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.2 }}
              className="badge-tag badge-teal mb-8"
            >
              System.Status: Online
            </motion.div>

            <h1 className="font-display font-black leading-[0.9] tracking-tighter mb-8 pointer-events-none select-none"
                style={{ fontSize: 'clamp(64px, 12vw, 150px)' }}>
              STOP <span className="text-white/20">WATCHING.</span><br />
              START <span className="text-neon-teal">COMPETING.</span>
            </h1>

            <p className="max-w-xl text-lg text-white/50 font-medium leading-relaxed mb-12 humanized-spacing italic opacity-80">
              The high-density cockpit for developers. Master languages through immersion, real-time 1v1 battles, and AI-powered evolution.
            </p>

            <div className="flex flex-wrap justify-center gap-6">
              <NeonButton variant="purple" onClick={() => navigate('/register')}>Join_The_Arena</NeonButton>
              <button onClick={() => navigate('/courses')} className="px-8 py-3 rounded-full border border-white/10 hover:border-white/30 text-white/60 hover:text-white transition-all font-mono text-xs tracking-widest uppercase">
                Browse_Stack
              </button>
            </div>
          </div>
        </motion.div>

        {/* Floating UI Elements (Hero Parallax) */}
        <div className="absolute inset-0 pointer-events-none overflow-hidden">
          <motion.div 
            animate={{ x: parallax.x * 2, y: parallax.y * 2 }} 
            className="absolute top-[20%] left-[10%]"
          >
            <GlassPanel className="p-4 w-48 rotate-[-6deg] glass-depth-1">
              <div className="flex justify-between items-center mb-4">
                <Icons.Cpu size={16} className="text-neon-teal" />
                <span className="font-mono text-[8px] opacity-40">CPU_LOAD: 12%</span>
              </div>
              <div className="h-1 bg-white/5 rounded-full overflow-hidden">
                <motion.div 
                  initial={{ width: 0 }}
                  animate={{ width: showXP ? '78%' : 0 }}
                  className="h-full bg-neon-teal"
                />
              </div>
              <XPExplosion trigger={showXP} />
            </GlassPanel>
          </motion.div>

          <motion.div 
            animate={{ x: -parallax.x * 1.5, y: -parallax.y * 1.5 }} 
            className="absolute bottom-[20%] right-[10%]"
          >
            <GlassPanel className="p-4 w-60 rotate-[4deg] glass-depth-2">
              <div className="flex items-center gap-3 mb-3">
                <div className="w-8 h-8 rounded bg-purple-500/20 flex items-center justify-center border border-purple-500/30">
                  <Icons.Target size={14} className="text-purple-400" />
                </div>
                <div>
                  <div className="font-mono text-[10px] font-bold">MATCH_READY</div>
                  <div className="font-mono text-[8px] opacity-40">Rank: Architect</div>
                </div>
              </div>
              <div className="grid grid-cols-7 gap-1">
                {Array.from({ length: 28 }).map((_, i) => (
                  <div key={i} className={`h-2 rounded-[1px] ${i % 3 === 0 ? 'bg-purple-500/40' : 'bg-white/5'}`} />
                ))}
              </div>
            </GlassPanel>
          </motion.div>
        </div>
      </section>

      <ActivityTicker />

      {/* ─── THE MORPH: DASHBOARD → BATTLE ─── */}
      <section className="relative h-[200vh] px-6 lg:px-24">
        
        <div className="sticky top-1/4 w-full">
          <motion.div 
            style={{ scale: dashboardScale, rotate: dashboardRotate }}
            className="w-full max-w-6xl mx-auto"
          >
            <GlassPanel className="min-h-[600px] border-white/5 shadow-3xl bg-black/40 overflow-hidden">
              <div className="h-10 border-b border-white/5 flex items-center px-4 gap-2 bg-white/[0.02]">
                <div className="w-2 h-2 rounded-full bg-red-500/40" />
                <div className="w-2 h-2 rounded-full bg-amber-500/40" />
                <div className="w-2 h-2 rounded-full bg-green-500/40" />
                <div className="ml-4 font-mono text-[9px] text-white/20">terminal — codearena — session:024x</div>
              </div>

              <div className="flex flex-col lg:flex-row h-full">
                {/* Left: Stats & Radar */}
                <motion.div className="flex-1 p-8 border-r border-white/5 asymmetric-layout">
                  <div className="space-y-1">
                    <h3 className="font-display font-bold text-3xl uppercase tracking-tighter italic">Command_Center</h3>
                    <p className="font-mono text-[10px] text-white/30">Real-time skill DNA mapping...</p>
                  </div>

                  <div className="grid grid-cols-2 gap-4 mt-8">
                    {[
                      { label: 'Battles_Won', val: '142', accent: 'text-neon-teal' },
                      { label: 'Xp_Total', val: '42,900', accent: 'text-neon-purple' },
                      { label: 'Global_Rank', val: '#12', accent: '' },
                      { label: 'Streak', val: '12d', accent: '' },
                    ].map((s, i) => (
                      <div key={i} className="p-4 rounded-xl bg-white/[0.02] border border-white/5">
                        <div className="font-mono text-[8px] uppercase tracking-widest text-white/40 mb-1">{s.label}</div>
                        <div className={`font-display font-black text-xl ${s.accent}`}>{s.val}</div>
                      </div>
                    ))}
                  </div>

                  <div className="mt-8 opacity-40 scale-90 origin-left grayscale hover:grayscale-0 transition-all cursor-crosshair">
                    <div className="text-[8px] font-mono mb-2 uppercase tracking-widest">Skill Evolution Path</div>
                    <div className="aspect-square bg-white/5 rounded-full flex items-center justify-center border border-white/10 relative">
                       <Icons.Cpu size={40} className="text-neon-purple opacity-20" />
                       <div className="absolute inset-4 border border-teal-400/20 rounded-full animate-spin duration-[10s]" />
                    </div>
                  </div>
                </motion.div>

                {/* Right: The Battle Morph Target */}
                <motion.div 
                  className="flex-[1.5] bg-black p-8 relative overflow-hidden"
                >
                  <motion.div style={{ opacity: battleOpacity, x: battleX }} className="absolute inset-0 p-8 z-20 bg-[#0A0A0F]">
                    <div className="flex items-center justify-between mb-8">
                      <div className="flex items-center gap-4">
                        <div className="text-red-500 animate-pulse text-xs">•</div>
                        <div className="font-mono text-xs uppercase tracking-widest">Live_Match: vs_ShadowCoder</div>
                      </div>
                      <div className="font-mono text-xl text-neon-purple tracking-tighter">02:44:09</div>
                    </div>

                    <div className="space-y-4">
                      <div className="p-4 rounded border border-white/10 bg-white/[0.02] font-mono text-[11px] leading-relaxed cursor-blink">
                        <span className="text-purple-400">function</span> <span className="text-teal-400">optimizeSupplyChain</span>(nodes) {'{'} <br />
                        <span className="ml-4 text-white/40">// Auto-remediating paths...</span> <br />
                        <span className="ml-4">return nodes.reduce((acc, curr) =&gt; {'{'} ... {'}'})</span> <br />
                        {'}'}
                      </div>
                      
                      <div className="mt-12">
                        <div className="flex justify-between items-center mb-2 font-mono text-[9px] uppercase tracking-widest opacity-40">
                          <span>Progress_Tracking</span>
                          <span>92% Accurate</span>
                        </div>
                        <div className="h-1 w-full bg-white/5 rounded-full">
                           <motion.div animate={{ width: '92%' }} className="h-full bg-neon-purple shadow-[0_0_10px_#9b5de5]" />
                        </div>
                      </div>
                    </div>
                  </motion.div>

                  {/* Placeholder Content for Dashboard View */}
                  <div className="opacity-100 group">
                    <div className="flex items-center gap-4 mb-8">
                      <div className="w-12 h-12 rounded bg-white/5 border border-white/10 flex items-center justify-center">
                        <Icons.Zap size={24} className="text-neon-teal" />
                      </div>
                      <div>
                        <div className="font-display font-bold text-xl uppercase tracking-tighter">Active_Quest</div>
                        <div className="font-mono text-[10px] text-white/30">Solve 2 Array-based problems</div>
                      </div>
                    </div>
                    <div className="space-y-3">
                      {[1, 2, 3].map(i => (
                        <div key={i} className="h-20 rounded bg-white/[0.02] border border-white/5 border-dashed flex items-center px-4">
                          <div className="w-2 h-2 rounded-full bg-white/10 mr-4" />
                          <div className="flex-1 space-y-2">
                             <div className="h-2 w-1/3 bg-white/5" />
                             <div className="h-1 w-1/2 bg-white/[0.02]" />
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </motion.div>
              </div>
            </GlassPanel>
          </motion.div>
        </div>
      </section>

      {/* ─── AI MENTOR: THE PIVOT ─── */}
      <section className="py-40 px-6 lg:px-24">
        <div className="max-w-7xl mx-auto flex flex-col lg:flex-row items-center gap-20">
          <div className="flex-1 order-2 lg:order-1">
             <GlassPanel className="glass-depth-2 p-1 overflow-hidden">
                <div className="bg-[#050505] p-6 font-mono text-xs text-white/40 leading-loose">
                   <div className="text-neon-teal mb-4">// AI_SUGGESTION: Optimization detected</div>
                   <span className="text-purple-400">const</span> efficiency = (base, load) =&gt; {'{'}<br />
                   <span className="ml-4">return base * Math.pow(Math.E, -0.12 * load);</span><br />
                   {'}'};<br />
                   <br />
                   <div className="p-4 bg-teal-500/5 border-l-2 border-teal-500 text-teal-200/60 mt-6 italic text-justify-human">
                     "This implementation reduces memory overhead by <strong>22%</strong> compared to your previous attempt. Would you like to refactor?"
                   </div>
                </div>
             </GlassPanel>
          </div>

          <div className="flex-1 space-y-8 order-1 lg:order-2">
            <h2 className="font-display font-black text-6xl tracking-tighter uppercase leading-[0.9]">
              EVOLVE WITH<br />
              <span className="text-neon-purple">SILICON INTELLIGENCE.</span>
            </h2>
            <p className="text-white/40 text-lg humanized-spacing leading-relaxed mb-12">
              Your personal AI Mentor doesn't just grade code. It understands your Skill DNA, identifies bottlenecks in your logic, and pushes you toward Senior-level architecture.
            </p>
            <NeonButton variant="purple" onClick={() => navigate('/register')}>Initialize_Mentor</NeonButton>
          </div>
        </div>
      </section>

      {/* ─── FINAL CTA: EMOTIONAL ─── */}
      <section className="py-60 px-6 relative overflow-hidden flex flex-col items-center">
         <div className="absolute inset-0 bg-gradient-to-t from-purple-900/10 to-transparent pointer-events-none" />
         
         <motion.div 
           initial={{ opacity: 0, y: 20 }}
           whileInView={{ opacity: 1, y: 0 }}
           viewport={{ once: true }}
           className="text-center space-y-8 relative z-10"
         >
           <h2 className="font-display font-black text-8xl md:text-[10rem] tracking-tighter uppercase leading-none text-white/5 select-none absolute -top-20 left-1/2 -translate-x-1/2 whitespace-nowrap">
             LEGENDARY STATUS
           </h2>
           <h3 className="font-display font-black text-5xl md:text-7xl uppercase tracking-tighter">Your skills deserve <span className="text-neon-teal underline decoration-white/20 underline-offset-8">proof.</span></h3>
           <p className="font-mono text-[10px] tracking-[0.4em] uppercase text-white/30 mb-8 max-w-lg mx-auto">Stop collecting certificates. Start building an immutable portfolio that speaks for itself.</p>
           
           <NeonButton variant="teal" className="scale-125 hover:scale-150 transition-transform" onClick={() => navigate('/register')}>Claim_Your_Invite</NeonButton>
         </motion.div>

         <div className="mt-40 flex flex-wrap justify-center gap-12 opacity-20 filter grayscale pointer-events-none">
           {['REACT', 'PYTHON', 'DOCKER', 'GO', 'NODE', 'RUST'].map(tech => (
             <div key={tech} className="font-display font-black text-3xl tracking-widest">{tech}</div>
           ))}
         </div>
      </section>

      {/* ─── MINI FOOTER ─── */}
      <footer className="py-12 px-12 border-t border-white/5 flex flex-col md:flex-row justify-between items-center gap-8 bg-black/40 relative z-10">
        <div className="font-display font-black text-lg tracking-tighter italic">CODEARENA_SYSTEM v1.0.2</div>
        <div className="flex gap-12 font-mono text-[9px] uppercase tracking-widest text-white/30">
          <a href="#" className="hover:text-white transition-colors">Documentation</a>
          <a href="#" className="hover:text-white transition-colors">Privacy_Layer</a>
          <a href="#" className="hover:text-white transition-colors">Twitter.sys</a>
          <a href="#" className="hover:text-white transition-colors">Github.repo</a>
        </div>
      </footer>
    </div>
  );
}
