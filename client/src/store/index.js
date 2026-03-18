import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import api, { setAccessToken, clearAccessToken } from '@/lib/api';

// ─── AUTH STORE ───────────────────────────────────────────

export const useAuthStore = create(
  persist(
    (set, get) => ({
      user: null,
      isAuthenticated: false,
      isLoading: false,

      setUser: (user) => set({ user, isAuthenticated: !!user }),

      login: async (email, password) => {
        set({ isLoading: true });
        try {
          const { data } = await api.post('/auth/login', { email, password });
          setAccessToken(data.accessToken);
          set({ user: data.user, isAuthenticated: true, isLoading: false });
          return { ok: true };
        } catch (err) {
          set({ isLoading: false });
          return { ok: false, error: err.message };
        }
      },

      register: async (payload) => {
        set({ isLoading: true });
        try {
          const { data } = await api.post('/auth/register', payload);
          setAccessToken(data.accessToken);
          set({ user: data.user, isAuthenticated: true, isLoading: false });
          return { ok: true };
        } catch (err) {
          set({ isLoading: false });
          return { ok: false, error: err.message };
        }
      },

      logout: async () => {
        await api.post('/auth/logout').catch(() => {});
        clearAccessToken();
        set({ user: null, isAuthenticated: false });
      },

      refreshUser: async () => {
        try {
          const { data } = await api.get('/auth/me');
          set({ user: data.user, isAuthenticated: true });
        } catch (_) {
          set({ user: null, isAuthenticated: false });
        }
      },

      updateUser: (patch) => set((s) => ({ user: { ...s.user, ...patch } })),
    }),
    {
      name: 'codearena-auth',
      partialize: (s) => ({ user: s.user, isAuthenticated: s.isAuthenticated }),
    }
  )
);

// ─── UI STORE ─────────────────────────────────────────────

export const useUIStore = create((set) => ({
  sidebarOpen: true,
  toggleSidebar: () => set((s) => ({ sidebarOpen: !s.sidebarOpen })),
  setSidebarOpen: (v) => set({ sidebarOpen: v }),

  // XP float animation
  xpFloats: [],
  showXPFloat: (amount, x, y) => {
    const id = Date.now();
    set((s) => ({ xpFloats: [...s.xpFloats, { id, amount, x, y }] }));
    setTimeout(() => set((s) => ({ xpFloats: s.xpFloats.filter((f) => f.id !== id) })), 2000);
  },
}));
