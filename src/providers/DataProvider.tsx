'use client'

import { useEffect, useState } from 'react'
import { createClient } from '@/lib/supabase/client'
import { useStore } from '@/store/useStore'
import type { DebtItem, Repo, Sprint, TeamMember, User } from '@/types'
import { Loader2 } from 'lucide-react'

export function DataProvider({ children }: { children: React.ReactNode }) {
  const supabase = createClient()
  const { setCurrentUser, setDebtItems, setRepos, setSprints, setTeam, addDebtItem, updateDebtItem, deleteDebtItem } = useStore()
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    let mounted = true

    const loadData = async () => {
      const { data: { user } } = await supabase.auth.getUser()
      if (!user) {
        if (mounted) setLoading(false)
        return
      }

      const { data: userData } = await supabase
        .from('users')
        .select('*')
        .eq('id', user.id)
        .single()
      
      if (mounted) setCurrentUser(userData as User)
      
      const workspaceId = userData?.workspace_id
      if (!workspaceId) {
        if (mounted) setLoading(false)
        return
      }

      const { data: repos } = await supabase
        .from('repos')
        .select('*')
        .eq('workspace_id', workspaceId)

      const { data: sprints } = await supabase
        .from('sprints')
        .select('*')
        .eq('workspace_id', workspaceId)
        
      const repoIds = (repos || []).map(r => r.id)
      
      let debtItems: DebtItem[] = []
      if (repoIds.length > 0) {
        const { data: items } = await supabase
          .from('debt_items')
          .select('*, repo:repos(*)')
          .in('repo_id', repoIds)
        if (items) debtItems = items as DebtItem[]
      }

      const { data: team } = await supabase
        .from('users')
        .select('*')
        .eq('workspace_id', workspaceId)

      if (mounted) {
        setRepos((repos as Repo[]) || [])
        setSprints((sprints as Sprint[]) || [])
        setDebtItems(debtItems || [])
        setTeam((team as TeamMember[]) || [])
        setLoading(false)
      }
    }

    loadData()

    const channel = supabase.channel('schema-db-changes')
      .on('postgres_changes', { event: 'INSERT', schema: 'public', table: 'debt_items' }, (payload) => {
        addDebtItem(payload.new as DebtItem)
      })
      .on('postgres_changes', { event: 'UPDATE', schema: 'public', table: 'debt_items' }, (payload) => {
        updateDebtItem(payload.new.id, payload.new as Partial<DebtItem>)
      })
      .on('postgres_changes', { event: 'DELETE', schema: 'public', table: 'debt_items' }, (payload) => {
        deleteDebtItem(payload.old.id)
      })
      .subscribe()

    return () => {
      mounted = false
      supabase.removeChannel(channel)
    }
  }, [
    supabase, 
    setCurrentUser, 
    setDebtItems, 
    setRepos, 
    setSprints, 
    setTeam, 
    addDebtItem, 
    updateDebtItem, 
    deleteDebtItem
  ])

  if (loading) {
    return (
      <div className="flex h-screen items-center justify-center bg-[var(--bg)]">
        <Loader2 size={32} className="animate-spin" style={{ color: 'var(--cyan)' }} />
      </div>
    )
  }

  return <>{children}</>
}
