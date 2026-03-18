import { useEffect, useRef } from 'react';

// ─── SPINNER ──────────────────────────────────────────────
export function Spinner({ size = 20, className = '' }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none"
      className={`animate-spin text-current ${className}`}>
      <circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="2" opacity="0.2" />
      <path d="M12 2a10 10 0 0110 10" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
    </svg>
  );
}

// ─── BUTTON ───────────────────────────────────────────────
export function Button({
  children, variant = 'primary', size = 'md',
  className = '', disabled, loading, type = 'button', onClick, ...props
}) {
  const base = 'inline-flex items-center justify-center gap-2 font-body font-semibold rounded-lg cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed transition-all';
  const sizes = { sm: 'px-3 py-1.5 text-xs', md: 'px-5 py-2.5 text-sm', lg: 'px-7 py-3 text-base' };
  const variants = {
    primary:   'btn-primary',
    secondary: 'btn-secondary',
    ghost:     'btn-ghost',
    teal:      'btn-teal',
    danger:    'bg-red-900/20 border border-red-500/30 text-red-400 hover:bg-red-900/40 hover:border-red-500/50',
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
      {label && <label className="arena-label">{label}</label>}
      <div className="relative">
        {icon && (
          <span className="absolute left-3 top-1/2 -translate-y-1/2 text-arena-dim pointer-events-none">
            {icon}
          </span>
        )}
        <input
          className={`arena-input ${icon ? 'pl-9' : ''} ${error ? 'border-red-500/50 focus:border-red-500' : ''} ${className}`}
          {...props}
        />
      </div>
      {error && <span className="text-red-400 text-xs font-mono">{error}</span>}
    </div>
  );
}

// ─── SELECT ───────────────────────────────────────────────
export function Select({ label, error, className = '', children, ...props }) {
  return (
    <div className="flex flex-col gap-1 w-full">
      {label && <label className="arena-label">{label}</label>}
      <select
        className={`arena-input appearance-none cursor-pointer ${error ? 'border-red-500/50' : ''} ${className}`}
        {...props}
      >
        {children}
      </select>
      {error && <span className="text-red-400 text-xs font-mono">{error}</span>}
    </div>
  );
}

// ─── CARD ─────────────────────────────────────────────────
export function Card({ children, className = '', hover = false, ...props }) {
  return (
    <div
      className={`arena-card p-5 ${hover ? 'cursor-pointer hover:-translate-y-1' : ''} ${className}`}
      {...props}
    >
      {children}
    </div>
  );
}

// ─── MODAL ────────────────────────────────────────────────
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
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm animate-fade-in"
      onClick={(e) => { if (e.target === overlayRef.current) onClose?.(); }}
    >
      <div className={`w-full ${width} bg-arena-bg2 border border-arena-border rounded-xl shadow-2xl animate-fade-up max-h-[85vh] flex flex-col`}>
        {(title || onClose) && (
          <div className="flex items-center justify-between px-5 py-4 border-b border-arena-border flex-shrink-0">
            {title && <h3 className="font-display font-bold text-base text-arena-text">{title}</h3>}
            {onClose && (
              <button onClick={onClose} className="text-arena-dim hover:text-arena-text transition-colors p-1">
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
                  <path d="M18 6L6 18M6 6l12 12" />
                </svg>
              </button>
            )}
          </div>
        )}
        <div className="p-5 overflow-y-auto">{children}</div>
      </div>
    </div>
  );
}

// ─── AVATAR ───────────────────────────────────────────────
export function Avatar({ user, size = 36, className = '' }) {
  const initials = user?.fullName
    ? user.fullName.split(' ').map((w) => w[0]).join('').slice(0, 2).toUpperCase()
    : (user?.username?.[0] || 'U').toUpperCase();

  const palette = [
    'bg-purple-900/60 text-purple-300 border-purple-500/20',
    'bg-teal-900/60 text-teal-300 border-teal-500/20',
    'bg-blue-900/60 text-blue-300 border-blue-500/20',
    'bg-amber-900/60 text-amber-300 border-amber-500/20',
  ];
  const color = palette[(user?.username?.charCodeAt(0) || 0) % palette.length];

  if (user?.avatarUrl) {
    return (
      <img
        src={user.avatarUrl}
        alt={user?.username || 'user'}
        className={`rounded-full object-cover border border-arena-border flex-shrink-0 ${className}`}
        style={{ width: size, height: size }}
      />
    );
  }

  return (
    <div
      className={`rounded-full flex items-center justify-center font-display font-bold border flex-shrink-0 ${color} ${className}`}
      style={{ width: size, height: size, fontSize: Math.max(size * 0.35, 10) }}
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
          <span className="font-mono text-xs text-arena-purple2 font-medium">
            Lv{level} · {levelName}
          </span>
          <span className="font-mono text-xs text-arena-dim">
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
export function ProgressBar({ value = 0, max = 100, color = 'purple', height = 4, className = '' }) {
  const pct = max > 0 ? Math.min(Math.round((value / max) * 100), 100) : 0;
  const colors = {
    purple: 'bg-arena-purple',
    teal:   'bg-arena-teal',
    grad:   'bg-gradient-to-r from-arena-purple to-arena-teal',
  };
  return (
    <div className={`bg-white/5 rounded-full overflow-hidden ${className}`} style={{ height }}>
      <div
        className={`h-full rounded-full transition-all duration-700 ${colors[color] || colors.purple}`}
        style={{ width: `${pct}%` }}
      />
    </div>
  );
}

// ─── BADGE TAG ────────────────────────────────────────────
export function BadgeTag({ children, variant = 'purple', className = '' }) {
  return (
    <span className={`badge-tag badge-${variant} ${className}`}>{children}</span>
  );
}

// ─── DIFFICULTY BADGE ─────────────────────────────────────
export function DifficultyBadge({ level }) {
  const map = {
    BEGINNER:     { label: 'Beginner',     variant: 'teal' },
    INTERMEDIATE: { label: 'Intermediate', variant: 'purple' },
    ADVANCED:     { label: 'Advanced',     variant: 'red' },
  };
  const { label, variant } = map[level] || { label: level, variant: 'gray' };
  return <BadgeTag variant={variant}>{label}</BadgeTag>;
}

// ─── STAT CARD ────────────────────────────────────────────
export function StatCard({ label, value, icon, trend, className = '' }) {
  return (
    <div className={`arena-card p-4 ${className}`}>
      <div className="flex items-start justify-between mb-2">
        <span className="font-mono text-xs text-arena-dim uppercase tracking-widest">{label}</span>
        {icon && <span className="text-arena-dim">{icon}</span>}
      </div>
      <div className="font-display font-bold text-2xl text-arena-text">{value}</div>
      {trend !== undefined && (
        <div className={`text-xs font-mono mt-1 ${trend >= 0 ? 'text-arena-teal' : 'text-red-400'}`}>
          {trend >= 0 ? '+' : ''}{trend} this week
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
        <span className="inline-block badge-tag badge-teal mb-3 font-mono text-xs tracking-widest uppercase">
          {tag}
        </span>
      )}
      <h2 className="font-display font-bold text-2xl md:text-3xl text-arena-text leading-tight mb-2">
        {title}
      </h2>
      {subtitle && (
        <p className="text-arena-muted text-sm leading-relaxed max-w-xl">{subtitle}</p>
      )}
      {action && <div className="mt-4">{action}</div>}
    </div>
  );
}

// ─── EMPTY STATE ──────────────────────────────────────────
export function EmptyState({ icon, title, description, action }) {
  return (
    <div className="flex flex-col items-center justify-center py-16 text-center">
      {icon && <div className="text-arena-dim mb-4">{icon}</div>}
      <h3 className="font-display font-bold text-arena-text mb-2">{title}</h3>
      {description && (
        <p className="text-arena-muted text-sm mb-6 max-w-xs leading-relaxed">{description}</p>
      )}
      {action}
    </div>
  );
}

// ─── LOADING SCREEN ───────────────────────────────────────
export function LoadingScreen() {
  return (
    <div className="min-h-screen bg-arena-bg flex flex-col items-center justify-center gap-4">
      <div className="font-display font-black text-2xl text-gradient tracking-widest">
        CODEARENA
      </div>
      <Spinner size={24} className="text-arena-purple2" />
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
      <div className="flex items-center justify-between px-4 py-2 bg-arena-bg border border-arena-border/50 border-b-0 rounded-t-lg">
        <span className="font-mono text-xs text-arena-dim">{language}</span>
        <button
          onClick={copy}
          className="font-mono text-xs text-arena-dim hover:text-arena-teal transition-colors"
        >
          copy
        </button>
      </div>
      <pre className="code-block rounded-t-none rounded-b-lg text-sm overflow-x-auto">
        <code>{code}</code>
      </pre>
    </div>
  );
}

// ─── DIVIDER ──────────────────────────────────────────────
export function Divider({ label, className = '' }) {
  return (
    <div className={`flex items-center gap-3 ${className}`}>
      <div className="flex-1 h-px bg-arena-border" />
      {label && <span className="font-mono text-xs text-arena-dim">{label}</span>}
      <div className="flex-1 h-px bg-arena-border" />
    </div>
  );
}

// ─── TOOLTIP ──────────────────────────────────────────────
export function Tooltip({ text, children }) {
  return (
    <span className="relative group inline-flex">
      {children}
      <span className="absolute -top-8 left-1/2 -translate-x-1/2 z-50 px-2 py-1 bg-arena-bg3 border border-arena-border rounded-md font-mono text-xs text-arena-text whitespace-nowrap opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none">
        {text}
      </span>
    </span>
  );
}
