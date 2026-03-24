import { motion } from 'framer-motion';
import clsx from 'clsx';
import { twMerge } from 'tailwind-merge';

function cn(...inputs) {
  return twMerge(clsx(inputs));
}

/**
 * Premium Glassmorphism Panel with layered borders and depth.
 */
export function GlassPanel({ 
  children, 
  className, 
  hover = false,
  intensity = 'medium',
  ...props 
}) {
  const intensities = {
    low: 'bg-white/5 backdrop-blur-sm border-white/5',
    medium: 'bg-white/[0.03] backdrop-blur-md border-white/10',
    high: 'bg-white/[0.08] backdrop-blur-xl border-white/20',
  };

  return (
    <motion.div
      className={cn(
        'relative rounded-2xl border transition-all duration-500 overflow-hidden',
        intensities[intensity],
        hover && 'hover:bg-white/[0.06] hover:border-white/20 hover:shadow-2xl hover:shadow-purple-500/10',
        className
      )}
      {...props}
    >
      {/* Subtle Inner Glow */}
      <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-white/20 to-transparent opacity-50" />
      <div className="relative z-10">{children}</div>
    </motion.div>
  );
}

/**
 * Physics-based Neon Button with glow effects.
 */
export function NeonButton({ 
  children, 
  variant = 'teal', 
  className, 
  onClick,
  ...props 
}) {
  const variants = {
    teal: 'border-teal-400/30 text-teal-400 hover:text-white bg-teal-400/5 hover:bg-teal-400 shadow-teal-500/0 hover:shadow-teal-500/40',
    purple: 'border-purple-400/30 text-purple-400 hover:text-white bg-purple-400/5 hover:bg-purple-400 shadow-purple-500/0 hover:shadow-purple-500/40',
  };

  return (
    <motion.button
      whileHover={{ scale: 1.02 }}
      whileTap={{ scale: 0.96 }}
      transition={{ type: 'spring', stiffness: 400, damping: 10 }}
      onClick={onClick}
      className={cn(
        'px-8 py-3 rounded-full border font-display font-bold text-sm tracking-wider uppercase transition-all duration-300 relative group overflow-hidden',
        variants[variant],
        className
      )}
      {...props}
    >
      <span className="relative z-10">{children}</span>
      {/* Background Glow Pulse */}
      <div className="absolute inset-0 bg-white/20 opacity-0 group-hover:opacity-20 transition-opacity" />
    </motion.button>
  );
}
