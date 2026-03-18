import { useState, useEffect, useRef, useCallback } from 'react';
import { useAuthStore } from '@/store';
import api, { setAccessToken } from '@/lib/api';

// ─── useAuth ──────────────────────────────────────────────
// Auto-init: tries silent token refresh on mount
export function useAuth() {
  const store = useAuthStore();

  const init = useCallback(async () => {
    try {
      const { data } = await api.post('/auth/refresh');
      setAccessToken(data.accessToken);
      await store.refreshUser();
    } catch (_) { /* not logged in */ }
  }, []);

  useEffect(() => { init(); }, []);
  return store;
}

// ─── useXPFloat ───────────────────────────────────────────
export function useXPFloat() {
  const [floats, setFloats] = useState([]);

  const show = useCallback((amount) => {
    const id = Date.now() + Math.random();
    setFloats((f) => [...f, { id, amount }]);
    setTimeout(() => setFloats((f) => f.filter((x) => x.id !== id)), 2200);
  }, []);

  return { floats, show };
}

// ─── useDebounce ──────────────────────────────────────────
export function useDebounce(value, delay = 300) {
  const [debounced, setDebounced] = useState(value);
  useEffect(() => {
    const t = setTimeout(() => setDebounced(value), delay);
    return () => clearTimeout(t);
  }, [value, delay]);
  return debounced;
}

// ─── useLocalStorage ──────────────────────────────────────
export function useLocalStorage(key, initial) {
  const [value, setValue] = useState(() => {
    try {
      const item = window.localStorage.getItem(key);
      return item ? JSON.parse(item) : initial;
    } catch { return initial; }
  });

  const set = useCallback((val) => {
    try {
      const toStore = typeof val === 'function' ? val(value) : val;
      setValue(toStore);
      window.localStorage.setItem(key, JSON.stringify(toStore));
    } catch { /* ignore */ }
  }, [key, value]);

  return [value, set];
}

// ─── useCountdown ─────────────────────────────────────────
export function useCountdown(targetDate) {
  const [remaining, setRemaining] = useState(0);

  useEffect(() => {
    if (!targetDate) return;
    const tick = () =>
      setRemaining(Math.max(0, Math.floor((new Date(targetDate) - Date.now()) / 1000)));
    tick();
    const id = setInterval(tick, 1000);
    return () => clearInterval(id);
  }, [targetDate]);

  const h = Math.floor(remaining / 3600);
  const m = Math.floor((remaining % 3600) / 60);
  const s = remaining % 60;

  return {
    remaining,
    hours:   String(h).padStart(2, '0'),
    minutes: String(m).padStart(2, '0'),
    seconds: String(s).padStart(2, '0'),
    expired: remaining === 0,
  };
}

// ─── usePolling ───────────────────────────────────────────
export function usePolling(fn, intervalMs = 10000, enabled = true) {
  const ref = useRef(null);
  useEffect(() => {
    if (!enabled) return;
    fn();
    ref.current = setInterval(fn, intervalMs);
    return () => clearInterval(ref.current);
  }, [enabled, intervalMs]);
}

// ─── useWindowSize ────────────────────────────────────────
export function useWindowSize() {
  const [size, setSize] = useState({
    width: window.innerWidth,
    height: window.innerHeight,
  });
  useEffect(() => {
    const h = () => setSize({ width: window.innerWidth, height: window.innerHeight });
    window.addEventListener('resize', h);
    return () => window.removeEventListener('resize', h);
  }, []);
  return size;
}

// ─── useOnClickOutside ────────────────────────────────────
export function useOnClickOutside(ref, handler) {
  useEffect(() => {
    const listener = (e) => {
      if (!ref.current || ref.current.contains(e.target)) return;
      handler(e);
    };
    document.addEventListener('mousedown', listener);
    document.addEventListener('touchstart', listener);
    return () => {
      document.removeEventListener('mousedown', listener);
      document.removeEventListener('touchstart', listener);
    };
  }, [ref, handler]);
}

// ─── usePrevious ──────────────────────────────────────────
export function usePrevious(value) {
  const ref = useRef();
  useEffect(() => { ref.current = value; }, [value]);
  return ref.current;
}
