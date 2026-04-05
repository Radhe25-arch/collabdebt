import { useEffect, useRef } from 'react';

// ─── SPINNER ──────────────────────────────────────────────
export function Spinner({ size = 20, className = '' }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none"
      className={`animate-spin ${className}`}>
      <circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="1.5" opacity="0.15" />
      <path d="M12 2a10 10 0 0110 10" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
    </svg>
  );
}

// ─── BUTTON ───────────────────────────────────────────────
export function Button({
  children, variant = 'primary', size = 'md',
  className = '', disabled, loading, type = 'button', onClick, ...props
}) {
  const base = 'inline-flex items-center justify-center gap-2 font-mono font-bold rounded-[4px] cursor-pointer disabled:opacity-40 disabled:cursor-not-allowed transition-all duration-150 uppercase tracking-wider';
  const sizes = { sm: 'px-3 py-1.5 text-[10px]', md: 'px-5 py-2.5 text-[11px]', lg: 'px-7 py-3 text-xs' };
  const variants = {
    primary:   'bg-cyber text-white border border-cyber hover:bg-[#2563EB] hover:border-[#2563EB]',
    secondary: 'bg-transparent text-white border border-white/10 hover:border-white/25 hover:bg-white/[0.03]',
    ghost:     'bg-transparent text-[#666] border-none hover:text-white',
    teal:      'bg-emerald text-white border border-emerald hover:bg-[#059669]',
    danger:    'bg-crimson text-white border border-crimson hover:bg-[#B91C1C]',
  };
  return (
    <button
      type={type}
      className={`${base} ${sizes[size] || ''} ${variants[variant] || ''} ${className}`}
      disabled={disabled || loading}
      onClick={onClick}
      {...props}
    >
      {loading && <Spinner size={13} />}
      {children}
    </button>
  );
}

// ─── INPUT ────────────────────────────────────────────────
export function Input({ label, error, icon, className = '', ...props }) {
  return (
    <div className="flex flex-col gap-1 w-full">
      {label && <label className="font-mono text-[10px] font-bold text-[#666] uppercase tracking-[0.15em] mb-1">{label}</label>}
      <div className="relative">
        {icon && (
          <span className="absolute left-3 top-1/2 -translate-y-1/2 text-[#444] pointer-events-none">
            {icon}
          </span>
        )}
        <input
          className={`w-full bg-white/[0.03] border border-white/10 rounded-[4px] px-4 py-3 placeholder:text-[#444] text-white focus:outline-none focus:border-cyber focus:shadow-inner-cyber transition-all duration-150 text-sm font-sans ${icon ? 'pl-9' : ''} ${error ? 'border-crimson focus:border-crimson' : ''} ${className}`}
          {...props}
        />
      </div>
      {error && <span className="text-crimson text-[10px] font-mono uppercase tracking-wider">{error}</span>}
    </div>
  );
}

// ─── SELECT ───────────────────────────────────────────────
export function Select({ label, error, className = '', children, ...props }) {
  return (
    <div className="flex flex-col gap-1 w-full">
      {label && <label className="font-mono text-[10px] font-bold text-[#666] uppercase tracking-[0.15em] mb-1">{label}</label>}
      <select
        className={`w-full bg-white/[0.03] border border-white/10 rounded-[4px] px-4 py-3 text-white focus:outline-none focus:border-cyber transition-all duration-150 text-sm appearance-none cursor-pointer ${error ? 'border-crimson' : ''} ${className}`}
        {...props}
      >
        {children}
      </select>
      {error && <span className="text-crimson text-[10px] font-mono uppercase tracking-wider">{error}</span>}
    </div>
  );
}

// ─── CARD ─────────────────────────────────────────────────
export function Card({ children, className = '', hover = false, ...props }) {
  return (
    <div
      className={`sf-card p-6 ${hover ? 'cursor-pointer hover:border-white/20 transition-all duration-150' : ''} ${className}`}
      {...props}
    >
      {children}
    </div>
  );
}

// ─── MODAL (Glassmorphism) ────────────────────────────────
export function Modal({ open, onClose, title, children, width = 'max-w-lg' }) {
  const overlayRef = useRef(null);

  useEffect(() => {
    document.body.style.overflow = open ? 'hidden' : '';
    return () => { document.body.style.overflow = ''; };
  }, [open]);

  useEffect(() => {
    const h = (e) => { if (e.key === 'Escape') onClose?.(); };
    window.addEventListener('keydown', h);
    return () => window.removeEventListener('keydown', h);
  }, [onClose]);

  if (!open) return null;

  return (
    <div
      ref={overlayRef}
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-[40px] animate-fade-in"
      onClick={(e) => { if (e.target === overlayRef.current) onClose?.(); }}
    >
      <div className={`w-full ${width} glass-overlay flex flex-col max-h-[90vh] animate-fade-up`}>
        {(title || onClose) && (
          <div className="flex items-center justify-between px-6 py-4 border-b border-white/[0.06] flex-shrink-0">
            {title && <h3 className="font-bold text-base text-white tracking-tight">{title}</h3>}
            {onClose && (
              <button onClick={onClose} className="text-[#666] hover:text-white transition-colors duration-150 p-1">
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round">
                  <path d="M18 6L6 18M6 6l12 12" />
                </svg>
              </button>
            )}
          </div>
        )}
        <div className="p-6 overflow-y-auto flex-1 custom-scrollbar">{children}</div>
      </div>
    </div>
  );
}

// ─── AVATAR ───────────────────────────────────────────────
export function Avatar({ user, size = 36, className = '' }) {
  const initials = user?.fullName
    ? user.fullName.split(' ').map((w) => w[0]).join('').slice(0, 2).toUpperCase()
    : (user?.username?.[0] || 'U').toUpperCase();

  const hue = (user?.username?.charCodeAt(0) || 0) * 7 % 360;

  if (user?.avatarUrl) {
    return (
      <img
        src={user.avatarUrl}
        alt={user?.username || 'user'}
        className={`rounded-[4px] object-cover border border-white/10 flex-shrink-0 ${className}`}
        style={{ width: size, height: size }}
      />
    );
  }

  return (
    <div
      className={`rounded-[4px] flex items-center justify-center font-mono font-bold border border-white/10 flex-shrink-0 ${className}`}
      style={{
        width: size, height: size,
        fontSize: Math.max(size * 0.35, 10),
        background: `linear-gradient(135deg, hsl(${hue}, 50%, 25%), hsl(${(hue + 40) % 360}, 40%, 18%))`,
        color: `hsl(${hue}, 60%, 70%)`,
      }}
    >
      {initials}
    </div>
  );
}

// ─── XP BAR ───────────────────────────────────────────────
export function XPBar({ current, max, level, levelName, showLabel = true, className = '' }) {
  const pct = max > 0 ? Math.min(Math.round((current / max) * 100), 100) : 0;
  return (
    <div className={`flex flex-col gap-1.5 ${className}`}>
      {showLabel && (
        <div className="flex justify-between items-center">
          <span className="font-mono text-[10px] font-bold text-cyber uppercase tracking-wider">
            LV{level} · {levelName}
          </span>
          <span className="font-mono text-[10px] font-bold text-[#666] uppercase">
            {(current || 0).toLocaleString()} / {(max || 0).toLocaleString()} XP
          </span>
        </div>
      )}
      <div className="xp-bar-track">
        <div className="xp-bar-fill" style={{ width: `${pct}%` }} />
      </div>
    </div>
  );
}

// ─── PROGRESS BAR ─────────────────────────────────────────
export function ProgressBar({ value = 0, max = 100, color = 'cyber', height = 4, className = '' }) {
  const pct = max > 0 ? Math.min(Math.round((value / max) * 100), 100) : 0;
  const colors = {
    cyber:   'bg-cyber',
    emerald: 'bg-emerald',
    violet:  'bg-violet',
    crimson: 'bg-crimson',
  };
  return (
    <div className={`bg-white/[0.06] rounded-none overflow-hidden ${className}`} style={{ height }}>
      <div
        className={`h-full rounded-none transition-all duration-500 ${colors[color] || colors.cyber}`}
        style={{ width: `${pct}%`, transition: 'width 0.6s cubic-bezier(0.16, 1, 0.3, 1)' }}
      />
    </div>
  );
}

// ─── BADGE TAG ────────────────────────────────────────────
export function BadgeTag({ children, variant = 'blue', className = '' }) {
  return (
    <span className={`badge-tag badge-${variant} ${className}`}>{children}</span>
  );
}

// ─── DIFFICULTY BADGE ─────────────────────────────────────
export function DifficultyBadge({ level }) {
  const map = {
    BEGINNER:     { label: 'BEGINNER',     variant: 'teal' },
    INTERMEDIATE: { label: 'INTERMEDIATE', variant: 'blue' },
    ADVANCED:     { label: 'ADVANCED',     variant: 'red' },
  };
  const { label, variant } = map[level] || { label: level, variant: 'gray' };
  return <BadgeTag variant={variant}>{label}</BadgeTag>;
}

// ─── STAT CARD ────────────────────────────────────────────
export function StatCard({ label, value, icon, trend, className = '' }) {
  return (
    <div className={`blade p-5 ${className}`}>
      <div className="flex items-start justify-between mb-3">
        <span className="font-mono text-[10px] font-bold text-[#666] uppercase tracking-[0.15em]">{label}</span>
        {icon && <span className="text-[#444]">{icon}</span>}
      </div>
      <div className="font-mono font-black text-2xl text-white tracking-tight">{value}</div>
      {trend !== undefined && (
        <div className={`text-[10px] font-mono font-bold mt-1 uppercase ${trend >= 0 ? 'text-emerald' : 'text-crimson'}`}>
          {trend >= 0 ? '+' : ''}{trend} THIS WEEK
        </div>
      )}
    </div>
  );
}

// ─── SECTION HEADER ───────────────────────────────────────
export function SectionHeader({ tag, title, subtitle, action, center = false }) {
  return (
    <div className={`mb-8 ${center ? 'text-center' : ''}`}>
      {tag && (
        <span className="inline-block badge-tag badge-blue mb-3 font-mono text-[10px] tracking-[0.15em] uppercase">
          {tag}
        </span>
      )}
      <h2 className="font-bold text-2xl md:text-3xl text-white leading-tight tracking-tight mb-2">
        {title}
      </h2>
      {subtitle && (
        <p className="text-[#666] text-sm leading-relaxed max-w-xl">{subtitle}</p>
      )}
      {action && <div className="mt-4">{action}</div>}
    </div>
  );
}

// ─── EMPTY STATE ──────────────────────────────────────────
export function EmptyState({ icon, title, description, action }) {
  return (
    <div className="flex flex-col items-center justify-center py-16 text-center">
      {icon && <div className="text-[#333] mb-4">{icon}</div>}
      <h3 className="font-bold text-white mb-2">{title}</h3>
      {description && (
        <p className="text-[#666] text-sm mb-6 max-w-xs leading-relaxed">{description}</p>
      )}
      {action}
    </div>
  );
}

// ─── LOADING SCREEN ───────────────────────────────────────
export function LoadingScreen() {
  return (
    <div className="min-h-screen bg-black flex flex-col items-center justify-center gap-4">
      <div className="font-mono font-black text-sm text-white tracking-[0.3em] uppercase">
        SKILLFORGE
      </div>
      <Spinner size={20} className="text-cyber" />
    </div>
  );
}

// ─── CODE BLOCK ───────────────────────────────────────────
export function CodeBlock({ code, language = 'javascript' }) {
  const copy = () => {
    navigator.clipboard.writeText(code);
  };
  return (
    <div className="relative group">
      <div className="flex items-center justify-between px-4 py-2 bg-white/[0.02] border border-white/[0.06] border-b-0 rounded-t-[4px]">
        <span className="font-mono text-[10px] text-[#666] uppercase tracking-wider">{language}</span>
        <button
          onClick={copy}
          className="font-mono text-[10px] text-[#666] hover:text-cyber transition-colors duration-150 uppercase tracking-wider"
        >
          COPY
        </button>
      </div>
      <pre className="code-block rounded-t-none text-sm overflow-x-auto">
        <code>{code}</code>
      </pre>
    </div>
  );
}

// ─── DIVIDER ──────────────────────────────────────────────
export function Divider({ label, className = '' }) {
  return (
    <div className={`flex items-center gap-3 ${className}`}>
      <div className="flex-1 h-px bg-white/[0.06]" />
      {label && <span className="font-mono text-[10px] text-[#666] uppercase tracking-wider">{label}</span>}
      <div className="flex-1 h-px bg-white/[0.06]" />
    </div>
  );
}

// ─── TOOLTIP ──────────────────────────────────────────────
export function Tooltip({ text, children }) {
  return (
    <span className="relative group inline-flex">
      {children}
      <span className="absolute -top-8 left-1/2 -translate-x-1/2 z-50 px-2 py-1 bg-white/10 backdrop-blur-[20px] border border-white/10 rounded-[2px] font-mono text-[10px] text-white whitespace-nowrap opacity-0 group-hover:opacity-100 transition-opacity duration-150 pointer-events-none uppercase tracking-wider">
        {text}
      </span>
    </span>
  );
}
