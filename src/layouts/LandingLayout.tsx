import React, { useState, useEffect } from 'react';
import { Outlet, Link } from 'react-router-dom';
import { Logo } from '@/components/Logo';
import { ArrowRight, Menu, X } from 'lucide-react';
import { motion, useScroll, useTransform, AnimatePresence } from 'framer-motion';

const NAV_LINKS = [
  { label: 'Features', href: '#features' },
  { label: 'How it works', href: '#how-it-works' },
  { label: 'Testimonials', href: '#testimonials' },
];

export function LandingLayout() {
  const { scrollY } = useScroll();
  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);

  useEffect(() => {
    return scrollY.on('change', y => setScrolled(y > 20));
  }, [scrollY]);

  return (
    <div className="min-h-screen flex flex-col" style={{ background: '#030303' }}>
      {/* ── NAVBAR ─────────────────────────────────────────────────── */}
      <motion.header
        animate={{
          background: scrolled
            ? 'rgba(3,3,3,0.9)'
            : 'rgba(3,3,3,0)',
          borderBottomColor: scrolled
            ? 'rgba(255,255,255,0.07)'
            : 'transparent',
        }}
        transition={{ duration: 0.3 }}
        className="sticky top-0 z-50 border-b"
        style={{ backdropFilter: 'blur(20px)', WebkitBackdropFilter: 'blur(20px)' }}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 h-16 flex items-center justify-between">
          {/* Logo */}
          <Link to="/" className="flex items-center gap-2">
            <Logo />
          </Link>

          {/* Desktop nav */}
          <nav className="hidden md:flex items-center gap-8">
            {NAV_LINKS.map(link => (
              <a
                key={link.label}
                href={link.href}
                className="text-sm transition-colors"
                style={{ color: '#737373' }}
                onMouseEnter={e => ((e.target as HTMLElement).style.color = '#f5f5f5')}
                onMouseLeave={e => ((e.target as HTMLElement).style.color = '#737373')}
              >
                {link.label}
              </a>
            ))}
          </nav>

          {/* Desktop CTAs */}
          <div className="hidden md:flex items-center gap-3">
            <Link to="/app">
              <button
                className="text-sm px-4 py-2 rounded-lg transition-colors"
                style={{ color: '#737373' }}
                onMouseEnter={e => ((e.target as HTMLElement).style.color = '#f5f5f5')}
                onMouseLeave={e => ((e.target as HTMLElement).style.color = '#737373')}
              >
                Sign In
              </button>
            </Link>
            <Link to="/app">
              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                className="flex items-center gap-1.5 text-sm px-4 py-2 rounded-lg font-medium"
                style={{
                  background: 'rgba(99,102,241,0.15)',
                  border: '1px solid rgba(99,102,241,0.3)',
                  color: '#818cf8',
                }}
                onMouseEnter={e => {
                  (e.currentTarget as HTMLElement).style.background = 'rgba(99,102,241,0.22)';
                  (e.currentTarget as HTMLElement).style.borderColor = 'rgba(99,102,241,0.5)';
                }}
                onMouseLeave={e => {
                  (e.currentTarget as HTMLElement).style.background = 'rgba(99,102,241,0.15)';
                  (e.currentTarget as HTMLElement).style.borderColor = 'rgba(99,102,241,0.3)';
                }}
              >
                Get Started <ArrowRight size={13} />
              </motion.button>
            </Link>
          </div>

          {/* Mobile hamburger */}
          <button
            className="md:hidden p-2 rounded-lg"
            style={{ color: '#737373' }}
            onClick={() => setMobileOpen(v => !v)}
          >
            {mobileOpen ? <X size={20} /> : <Menu size={20} />}
          </button>
        </div>

        {/* Mobile menu */}
        <AnimatePresence>
          {mobileOpen && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              className="md:hidden overflow-hidden"
              style={{ borderTop: '1px solid rgba(255,255,255,0.06)', background: 'rgba(6,6,6,0.98)' }}
            >
              <div className="px-4 py-4 space-y-1">
                {NAV_LINKS.map(link => (
                  <a
                    key={link.label}
                    href={link.href}
                    onClick={() => setMobileOpen(false)}
                    className="block py-2.5 px-3 rounded-lg text-sm transition-colors"
                    style={{ color: '#a3a3a3' }}
                  >
                    {link.label}
                  </a>
                ))}
                <div className="pt-3 flex flex-col gap-2">
                  <Link to="/app" onClick={() => setMobileOpen(false)}>
                    <button className="w-full py-2.5 rounded-lg text-sm text-center" style={{ color: '#737373' }}>
                      Sign In
                    </button>
                  </Link>
                  <Link to="/app" onClick={() => setMobileOpen(false)}>
                    <button
                      className="w-full py-2.5 rounded-lg text-sm font-medium"
                      style={{ background: 'rgba(99,102,241,0.15)', border: '1px solid rgba(99,102,241,0.3)', color: '#818cf8' }}
                    >
                      Get Started
                    </button>
                  </Link>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </motion.header>

      {/* ── PAGE CONTENT ────────────────────────────────────────────── */}
      <main className="flex-1">
        <Outlet />
      </main>

      {/* ── FOOTER ──────────────────────────────────────────────────── */}
      <footer style={{ borderTop: '1px solid rgba(255,255,255,0.05)', background: '#030303' }}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 py-16 grid grid-cols-2 md:grid-cols-4 gap-10">
          {/* Brand */}
          <div className="col-span-2 md:col-span-1 space-y-4">
            <Logo />
            <p style={{ color: '#525252', fontSize: '13px', lineHeight: 1.7 }}>
              The platform where elite engineers are forged.
            </p>
          </div>
          {/* Links */}
          {[
            {
              title: 'Product',
              links: ['Features', 'Courses', 'Battles', 'Leaderboard'],
            },
            {
              title: 'Company',
              links: ['About', 'Blog', 'Careers', 'Press'],
            },
            {
              title: 'Legal',
              links: ['Privacy', 'Terms', 'Security', 'Cookies'],
            },
          ].map(col => (
            <div key={col.title}>
              <h4 className="text-xs font-semibold uppercase tracking-widest mb-4"
                style={{ color: '#404040', fontFamily: 'Geist Mono, monospace' }}>
                {col.title}
              </h4>
              <ul className="space-y-2.5">
                {col.links.map(link => (
                  <li key={link}>
                    <a
                      href="#"
                      className="text-sm transition-colors"
                      style={{ color: '#525252' }}
                      onMouseEnter={e => ((e.target as HTMLElement).style.color = '#a3a3a3')}
                      onMouseLeave={e => ((e.target as HTMLElement).style.color = '#525252')}
                    >
                      {link}
                    </a>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
        <div
          className="max-w-7xl mx-auto px-4 sm:px-6 py-6 flex flex-col sm:flex-row items-center justify-between gap-4"
          style={{ borderTop: '1px solid rgba(255,255,255,0.04)' }}
        >
          <p style={{ color: '#2a2a2a', fontSize: '12px', fontFamily: 'Geist Mono, monospace' }}>
            © 2026 SkillForge. All rights reserved.
          </p>
          <div className="flex items-center gap-2">
            <span style={{ width: 6, height: 6, borderRadius: '50%', background: '#22c55e', display: 'inline-block', boxShadow: '0 0 6px rgba(34,197,94,0.6)' }} />
            <span style={{ color: '#2a2a2a', fontSize: '12px', fontFamily: 'Geist Mono, monospace' }}>All systems operational</span>
          </div>
        </div>
      </footer>
    </div>
  );
}
