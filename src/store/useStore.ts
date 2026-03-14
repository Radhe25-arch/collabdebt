import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import type { User, Repo, DebtItem, Sprint, TeamMember } from '@/types'
import { createClient } from '@/lib/supabase/client'

interface AppState {
  currentUser: User | null
  setCurrentUser: (user: User | null) => void
  
  repos: Repo[]
  setRepos: (repos: Repo[]) => void
  addRepo: (repo: Repo) => Promise<void>
  
  debtItems: DebtItem[]
  setDebtItems: (items: DebtItem[]) => void
  addDebtItem: (item: DebtItem) => Promise<void>
  updateDebtItem: (id: string, updates: Partial<DebtItem>) => Promise<void>
  deleteDebtItem: (id: string) => Promise<void>
  
  sprints: Sprint[]
  setSprints: (sprints: Sprint[]) => void
  addSprint: (sprint: Sprint) => Promise<void>
  
  team: TeamMember[]
  setTeam: (team: TeamMember[]) => void
  
  isLoading: boolean
  setIsLoading: (isLoading: boolean) => void
  
  isAdmin: () => boolean
}

const supabase = createClient()

export const useStore = create<AppState>()(
  persist(
    (set, get) => ({
      currentUser: null,
      setCurrentUser: (currentUser) => set({ currentUser }),
      
      repos: [],
      setRepos: (repos) => set({ repos }),
      addRepo: async (repo) => {
        const { error } = await supabase.from('repos').insert(repo)
        if (error) throw error
        // Real-time listener in DataProvider will update the state
      },
      
      debtItems: [],
      setDebtItems: (debtItems) => set({ debtItems }),
      addDebtItem: async (item) => {
        const { error } = await supabase.from('debt_items').insert(item)
        if (error) throw error
      },
      updateDebtItem: async (id, updates) => {
        const { error } = await supabase.from('debt_items').update(updates).eq('id', id)
        if (error) throw error
        // Pre-emptive update for snappy UI
        set((state) => ({
          debtItems: state.debtItems.map(d => d.id === id ? { ...d, ...updates } : d)
        }))
      },
      deleteDebtItem: async (id) => {
        const { error } = await supabase.from('debt_items').delete().eq('id', id)
        if (error) throw error
        set((state) => ({
          debtItems: state.debtItems.filter(d => d.id !== id)
        }))
      },
      
      sprints: [],
      setSprints: (sprints) => set({ sprints }),
      addSprint: async (sprint) => {
        const { error } = await supabase.from('sprints').insert(sprint)
        if (error) throw error
      },
      
      team: [],
      setTeam: (team) => set({ team }),
      
      isLoading: false,
      setIsLoading: (isLoading) => set({ isLoading }),
      
      isAdmin: () => get().currentUser?.role === 'manager'
    }),
    {
      name: 'collabdebt-storage',
      partialize: (state) => ({ currentUser: state.currentUser }),
    }
  )
)
