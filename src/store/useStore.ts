import { create } from 'zustand'
import { createClient } from '@/lib/supabase/client'
import type { DebtItem, Repo, Sprint, TeamMember, User } from '@/types'

interface AppState {
  currentUser: User | null
  debtItems: DebtItem[]
  repos: Repo[]
  sprints: Sprint[]
  team: TeamMember[]
  setCurrentUser: (user: User | null) => void
  setDebtItems: (items: DebtItem[]) => void
  setRepos: (repos: Repo[]) => void
  setSprints: (sprints: Sprint[]) => void
  setTeam: (team: TeamMember[]) => void
  addDebtItem: (item: DebtItem) => void
  updateDebtItem: (id: string, updates: Partial<DebtItem>) => void
  deleteDebtItem: (id: string) => void
  mutateDebtItemStatus: (id: string, status: string) => Promise<void>
  mutateAddDebtItem: (item: Partial<DebtItem>) => Promise<void>
  mutateAddSprint: (sprint: Partial<Sprint>) => Promise<void>
  isAdmin: () => boolean
}

export const useStore = create<AppState>((set, get) => ({
  currentUser: null,
  debtItems: [],
  repos: [],
  sprints: [],
  team: [],
  setCurrentUser: (user) => set({ currentUser: user }),
  setDebtItems: (items) => set({ debtItems: items }),
  setRepos: (repos) => set({ repos }),
  setSprints: (sprints) => set({ sprints }),
  setTeam: (team) => set({ team }),
  addDebtItem: (item) => set((state) => ({ debtItems: [...state.debtItems, item] })),
  updateDebtItem: (id, updates) =>
    set((state) => ({
      debtItems: state.debtItems.map((item) =>
        item.id === id ? { ...item, ...updates } : item
      ),
    })),
  deleteDebtItem: (id) =>
    set((state) => ({ debtItems: state.debtItems.filter((i) => i.id !== id) })),
  
  // Real Mutations (Supabase)
  mutateDebtItemStatus: async (id: string, status: string) => {
    const supabase = createClient()
    const { error } = await supabase
      .from('debt_items')
      .update({ status, fixed_at: status === 'fixed' ? new Date().toISOString() : null })
      .eq('id', id)
    if (error) throw error
  },

  mutateAddDebtItem: async (item: Partial<DebtItem>) => {
    const supabase = createClient()
    const { error } = await supabase
      .from('debt_items')
      .insert([item])
    if (error) throw error
  },

  mutateAddSprint: async (sprint: Partial<Sprint>) => {
    const supabase = createClient()
    const { error } = await supabase
      .from('sprints')
      .insert([sprint])
    if (error) throw error
  },

  isAdmin: () => get().currentUser?.email === 'admin@collabdebt.com'
}))
