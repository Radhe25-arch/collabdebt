import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import type { User, Repo, DebtItem, Sprint, TeamMember } from '@/types'

interface AppState {
  currentUser: User | null
  setCurrentUser: (user: User | null) => void
  
  repos: Repo[]
  setRepos: (repos: Repo[]) => void
  
  debtItems: DebtItem[]
  setDebtItems: (items: DebtItem[]) => void
  addDebtItem: (item: DebtItem) => void
  updateDebtItem: (id: string, updates: Partial<DebtItem>) => void
  deleteDebtItem: (id: string) => void
  
  sprints: Sprint[]
  setSprints: (sprints: Sprint[]) => void
  
  team: TeamMember[]
  setTeam: (team: TeamMember[]) => void
  
  isLoading: boolean
  setIsLoading: (isLoading: boolean) => void
  
  isAdmin: () => boolean
}

export const useStore = create<AppState>()(
  persist(
    (set, get) => ({
      currentUser: null,
      setCurrentUser: (currentUser) => set({ currentUser }),
      
      repos: [],
      setRepos: (repos) => set({ repos }),
      
      debtItems: [],
      setDebtItems: (debtItems) => set({ debtItems }),
      addDebtItem: (item) => set((state) => ({ 
        debtItems: [item, ...state.debtItems.filter(d => d.id !== item.id)] 
      })),
      updateDebtItem: (id, updates) => set((state) => ({
        debtItems: state.debtItems.map(d => d.id === id ? { ...d, ...updates } : d)
      })),
      deleteDebtItem: (id) => set((state) => ({
        debtItems: state.debtItems.filter(d => d.id !== id)
      })),
      
      sprints: [],
      setSprints: (sprints) => set({ sprints }),
      
      team: [],
      setTeam: (team) => set({ team }),
      
      isLoading: false,
      setIsLoading: (isLoading) => set({ isLoading }),
      
      isAdmin: () => get().currentUser?.role === 'manager'
    }),
    {
      name: 'collabdebt-storage',
      partialize: (state) => ({ currentUser: state.currentUser }), // Only persist user session
    }
  )
)
