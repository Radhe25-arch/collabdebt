import { motion, AnimatePresence } from 'framer-motion';
import { useState, useEffect } from 'react';

/**
 * Signature visual hook: An "explosion" of XP particles.
 */
export function XPExplosion({ trigger }) {
  const [particles, setParticles] = useState([]);

  useEffect(() => {
    if (trigger) {
      const newParticles = Array.from({ length: 12 }).map((_, i) => ({
        id: Math.random(),
        angle: (i / 12) * 360,
        distance: Math.random() * 100 + 50,
      }));
      setParticles(newParticles);
      const timer = setTimeout(() => setParticles([]), 1000);
      return () => clearTimeout(timer);
    }
  }, [trigger]);

  return (
    <div className="absolute inset-0 pointer-events-none flex items-center justify-center">
      <AnimatePresence>
        {particles.map((p) => (
          <motion.div
            key={p.id}
            initial={{ scale: 0, opacity: 1, x: 0, y: 0 }}
            animate={{ 
              scale: [0, 1, 0.5], 
              opacity: [1, 1, 0],
              x: Math.cos(p.angle * (Math.PI / 180)) * p.distance,
              y: Math.sin(p.angle * (Math.PI / 180)) * p.distance,
            }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.8, ease: "easeOut" }}
            className="absolute w-2 h-2 rounded-full bg-teal-400 shadow-[0_0_10px_#00f5d4]"
          />
        ))}
      </AnimatePresence>
    </div>
  );
}

/**
 * Social proof: A "live" scroll of platform activity.
 */
export function ActivityTicker() {
  const activities = [
    { user: 'Arjun', action: 'won 1v1 Battle', reward: '+300 XP' },
    { user: 'Neha', action: 'reached Level 5', reward: 'BAKER BADGE' },
    { user: 'Marco', action: 'solved Linked List', reward: '+50 XP' },
    { user: 'Sofi', action: 'started Python Course', reward: 'ENROLLED' },
    { user: 'Alex', action: 'maintained 7-day streak', reward: '+200 XP' },
  ];

  return (
    <div className="w-full bg-white/[0.02] border-y border-white/5 py-3 overflow-hidden whitespace-nowrap">
      <motion.div 
        animate={{ x: [0, -1000] }}
        transition={{ repeat: Infinity, duration: 30, ease: "linear" }}
        className="flex gap-12 items-center"
      >
        {[...activities, ...activities].map((a, i) => (
          <div key={i} className="flex items-center gap-3 font-mono text-[10px] tracking-widest uppercase text-white/40">
            <span className="text-teal-400 font-bold">{a.user}</span>
            <span>{a.action}</span>
            <span className="text-purple-400">{a.reward}</span>
            <span className="w-1 h-1 rounded-full bg-white/20 mx-2" />
          </div>
        ))}
      </motion.div>
    </div>
  );
}
