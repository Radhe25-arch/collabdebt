'use client'

import { useState, useCallback, Suspense } from 'react'
import dynamic from 'next/dynamic'
import { useSearchParams } from 'next/navigation'
import {
  FileText, ChevronRight, ChevronDown, Upload, Zap,
  AlertTriangle, X, Sparkles, Bug, Clock, Loader2
} from 'lucide-react'
import { MOCK_DEBT_ITEMS } from '@/lib/mock-data'

const MonacoEditor = dynamic(() => import('@monaco-editor/react'), { ssr: false, loading: () => (
  <div className="flex-1 flex items-center justify-center" style={{ background: '#020c12' }}>
    <Loader2 size={24} className="animate-spin" style={{ color: 'var(--text-dim)' }} />
  </div>
) })

const SAMPLE_CODE = `// src/auth/token.service.ts
import { db } from '../db'
import { generateNewToken } from './generate'

/**
 * Refreshes the auth token for a given user.
 * Called when the current token is about to expire.
 */
async function refreshToken(userId: string) {
  // TODO: handle race condition when multiple tabs
  // refresh simultaneously — this causes logout
  const token = await db.tokens.findOne({ userId })

  // FIXME: this doesn't handle expired refresh tokens
  // properly, users get logged out randomly
  if (!token) return null

  // HACK: sleep 100ms to avoid duplicate refresh calls
  // This is terrible, but it works... sometimes
  await sleep(100)

  const newToken = await generateNewToken(token)

  // TODO: invalidate old token after generating new one
  return newToken
}

// Dead code — this was replaced 6 months ago
// @deprecated use refreshToken instead
async function legacyRefresh(userId: string) {
  const token = await db.legacy_tokens.findOne({ userId })
  return token?.value ?? null
}

export { refreshToken }
`

const FILE_TREE = [
  { name: 'src', type: 'folder', children: [
    { name: 'auth', type: 'folder', children: [
      { name: 'token.service.ts', type: 'file', debt: 'critical' },
      { name: 'auth.service.ts', type: 'file', debt: 'high' },
      { name: 'guards.ts', type: 'file', debt: null },
    ]},
    { name: 'api', type: 'folder', children: [
      { name: 'users', type: 'folder', children: [
        { name: 'dashboard.ts', type: 'file', debt: 'high' },
      ]},
    ]},
    { name: 'payments', type: 'folder', children: [
      { name: 'checkout.ts', type: 'file', debt: 'high' },
      { name: 'cart.ts', type: 'file', debt: 'medium' },
    ]},
    { name: 'hooks', type: 'folder', children: [
      { name: 'useUserData.ts', type: 'file', debt: 'medium' },
    ]},
    { name: 'index.ts', type: 'file', debt: null },
  ]},
]

const DEBT_COLOR: Record<string, string> = {
  critical: '#ff3b5c', high: '#ff9600', medium: '#ffd600', low: '#00ff88',
}

function FileNode({ node, depth = 0 }: { node: typeof FILE_TREE[0], depth?: number }) {
  const [open, setOpen] = useState(depth === 0)
  if (node.type === 'folder') {
    return (
      <div>
        <button onClick={() => setOpen(!open)}
          className="flex items-center gap-1.5 w-full px-2 py-1 text-xs rounded hover:bg-white/5 transition-colors text-left"
          style={{ paddingLeft: `${8 + depth * 12}px`, color: 'var(--text-muted)' }}>
          {open ? <ChevronDown size={12} /> : <ChevronRight size={12} />}
          <span>{node.name}</span>
        </button>
        {open && node.children?.map(child => (
          <FileNode key={child.name} node={child as typeof FILE_TREE[0]} depth={depth + 1} />
        ))}
      </div>
    )
  }
  return (
    <button className="flex items-center gap-1.5 w-full px-2 py-1 text-xs rounded hover:bg-white/5 transition-colors text-left"
      style={{ paddingLeft: `${8 + depth * 12}px`, color: 'var(--text)' }}>
      <FileText size={11} style={{ color: 'var(--text-dim)', flexShrink: 0 }} />
      <span className="flex-1 truncate">{node.name}</span>
      {(node as typeof FILE_TREE[0] & { debt?: string | null }).debt && (
        <div className="w-1.5 h-1.5 rounded-full shrink-0"
          style={{ background: DEBT_COLOR[(node as typeof FILE_TREE[0] & { debt?: string | null }).debt!] }} />
      )}
    </button>
  )
}

function EditorContent() {
  const params = useSearchParams()
  const [aiOpen, setAiOpen] = useState(false)
  const [aiLoading, setAiLoading] = useState(false)
  const [aiSuggestion, setAiSuggestion] = useState<string | null>(null)
  const [bugPanelOpen, setBugPanelOpen] = useState(false)
  const [rightPanel, setRightPanel] = useState(true)
  const [aiMinutes] = useState(47)
  const fileDebtItems = MOCK_DEBT_ITEMS.filter(d => d.file_path.includes('token'))

  const handleAIFix = useCallback(() => {
    setAiLoading(true)
    setTimeout(() => {
      setAiSuggestion(
`async function refreshToken(userId: string) {
  // Use a distributed lock to prevent race conditions
  const lockKey = \`token:refresh:\${userId}\`
  const lock = await redisClient.set(lockKey, '1', 'EX', 5, 'NX')
  
  if (!lock) {
    // Another tab is already refreshing — wait and retry
    await sleep(200)
    return db.tokens.findOne({ userId })
  }

  try {
    const token = await db.tokens.findOne({ userId })
    if (!token || isExpired(token)) return null
    
    const newToken = await generateNewToken(token)
    await db.tokens.invalidate(token.id) // Invalidate old token
    return newToken
  } finally {
    await redisClient.del(lockKey) // Always release lock
  }
}`
      )
      setAiLoading(false)
    }, 1800)
  }, [])

  return (
    <div className="flex h-[calc(100vh-56px)] -m-6 overflow-hidden">
      {/* File tree */}
      <div className="w-52 shrink-0 border-r flex flex-col" style={{ background: 'var(--surface)', borderColor: 'var(--border)' }}>
        <div className="flex items-center justify-between px-3 py-2.5 border-b" style={{ borderColor: 'var(--border)' }}>
          <span className="text-xs font-semibold" style={{ color: 'var(--text-muted)' }}>FILES</span>
          <button className="p-1 rounded hover:bg-white/10 transition-colors" style={{ color: 'var(--text-muted)' }} title="Upload ZIP">
            <Upload size={12} />
          </button>
        </div>
        <div className="flex-1 overflow-y-auto py-2">
          {FILE_TREE.map(node => <FileNode key={node.name} node={node} />)}
        </div>
      </div>

      {/* Editor area */}
      <div className="flex-1 flex flex-col min-w-0">
        {/* Editor topbar */}
        <div className="h-10 border-b flex items-center px-4 gap-3 shrink-0"
          style={{ background: 'var(--surface)', borderColor: 'var(--border)' }}>
          <span className="font-mono text-xs" style={{ color: 'var(--text-muted)' }}>
            src/auth/<span style={{ color: 'var(--text)' }}>token.service.ts</span>
          </span>
          <span className="badge-cyan text-[10px] px-1.5">TypeScript</span>
          <span className="badge-critical text-[10px] px-1.5">Score: 28/100</span>
          <div className="ml-auto flex items-center gap-2">
            <button onClick={() => setAiOpen(true)}
              className="flex items-center gap-1.5 text-xs px-3 py-1 rounded-lg transition-all"
              style={{ background: 'rgba(0,229,255,0.1)', color: 'var(--cyan)', border: '1px solid rgba(0,229,255,0.2)' }}>
              <Sparkles size={12} /> Ctrl+K — AI Fix
            </button>
            <button onClick={() => setBugPanelOpen(!bugPanelOpen)}
              className="flex items-center gap-1.5 text-xs px-3 py-1 rounded-lg transition-all"
              style={{ background: 'rgba(255,59,92,0.08)', color: 'var(--red)', border: '1px solid rgba(255,59,92,0.2)' }}>
              <Bug size={12} /> Bug Finder
            </button>
          </div>
        </div>

        {/* Monaco */}
        <div className="flex-1 flex flex-col overflow-hidden">
          <MonacoEditor
            height="100%"
            defaultLanguage="typescript"
            defaultValue={SAMPLE_CODE}
            theme="vs-dark"
            options={{
              fontSize: 13,
              fontFamily: "'JetBrains Mono', 'Fira Code', monospace",
              fontLigatures: true,
              lineHeight: 22,
              minimap: { enabled: false },
              scrollBeyondLastLine: false,
              wordWrap: 'on',
              padding: { top: 16 },
              renderLineHighlight: 'gutter',
              cursorBlinking: 'smooth',
              smoothScrolling: true,
            }}
          />

          {/* AI usage bar */}
          <div className="h-8 border-t flex items-center px-4 gap-3 shrink-0"
            style={{ background: 'var(--surface)', borderColor: 'var(--border)' }}>
            <Zap size={12} style={{ color: 'var(--cyan)' }} />
            <span className="text-xs" style={{ color: 'var(--text-muted)' }}>
              AI: <span style={{ color: 'var(--cyan)' }}>{aiMinutes} min</span> used today (2hr limit)
            </span>
            <div className="w-32 progress-bar h-1">
              <div className="h-full rounded-full" style={{ width: `${(aiMinutes / 120) * 100}%`, background: 'linear-gradient(90deg, var(--cyan), #7c3aed)' }} />
            </div>
            <span className="text-xs ml-auto" style={{ color: 'var(--text-dim)' }}>Resets midnight IST</span>
          </div>

          {/* Bug finder panel */}
          {bugPanelOpen && (
            <div className="border-t shrink-0" style={{ background: 'var(--surface)', borderColor: 'var(--border)', maxHeight: '180px', overflowY: 'auto' }}>
              <div className="flex items-center justify-between px-4 py-2 border-b" style={{ borderColor: 'var(--border)' }}>
                <span className="text-xs font-semibold flex items-center gap-2">
                  <Bug size={12} style={{ color: 'var(--red)' }} /> Bug Finder — 3 issues
                </span>
                <button onClick={() => setBugPanelOpen(false)}><X size={12} style={{ color: 'var(--text-muted)' }} /></button>
              </div>
              {[
                { file: 'token.service.ts:11', type: 'Race Condition', impact: '$4,200/mo if in production', sev: 'critical' },
                { file: 'token.service.ts:16', type: 'Missing null check', impact: 'Potential crash on edge case', sev: 'high' },
                { file: 'token.service.ts:30', type: 'Dead code block', impact: 'No runtime impact, adds confusion', sev: 'low' },
              ].map((bug, i) => (
                <div key={i} className="flex items-center gap-4 px-4 py-2 border-b text-xs cursor-pointer hover:bg-white/5"
                  style={{ borderColor: 'var(--border)' }}>
                  <span className="font-mono" style={{ color: 'var(--text-muted)' }}>{bug.file}</span>
                  <span className="flex-1 font-medium">{bug.type}</span>
                  <span style={{ color: 'var(--yellow)' }}>{bug.impact}</span>
                  <span className={bug.sev === 'critical' ? 'badge-critical' : bug.sev === 'high' ? 'badge-high' : 'badge-low'}>
                    {bug.sev}
                  </span>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Right panel — debt info */}
      {rightPanel && (
        <div className="w-64 shrink-0 border-l flex flex-col overflow-y-auto"
          style={{ background: 'var(--surface)', borderColor: 'var(--border)' }}>
          <div className="flex items-center justify-between px-3 py-2.5 border-b" style={{ borderColor: 'var(--border)' }}>
            <span className="text-xs font-semibold" style={{ color: 'var(--text-muted)' }}>DEBT INFO</span>
            <button onClick={() => setRightPanel(false)} style={{ color: 'var(--text-dim)' }}><X size={12} /></button>
          </div>

          {/* File score */}
          <div className="p-4 border-b" style={{ borderColor: 'var(--border)' }}>
            <p className="text-xs mb-2" style={{ color: 'var(--text-muted)' }}>File Debt Score</p>
            <div className="flex items-center gap-3">
              <div className="relative w-14 h-14">
                <svg viewBox="0 0 48 48" className="w-full h-full -rotate-90">
                  <circle cx="24" cy="24" r="20" fill="none" stroke="var(--border)" strokeWidth="4" />
                  <circle cx="24" cy="24" r="20" fill="none" stroke="#ff3b5c" strokeWidth="4"
                    strokeDasharray={`${(28 / 100) * 125.6} 125.6`} strokeLinecap="round" />
                </svg>
                <div className="absolute inset-0 flex items-center justify-center">
                  <span className="text-xs font-bold font-display" style={{ color: '#ff3b5c' }}>28</span>
                </div>
              </div>
              <div>
                <p className="text-sm font-bold" style={{ color: '#ff3b5c' }}>Critical</p>
                <p className="text-xs" style={{ color: 'var(--text-muted)' }}>3 items in file</p>
              </div>
            </div>
          </div>

          {/* Debt items */}
          <div className="flex-1 p-3 space-y-2">
            {fileDebtItems.map(item => (
              <div key={item.id} className="p-3 rounded-xl cursor-pointer hover:bg-white/5 transition-colors border"
                style={{ background: 'var(--card)', borderColor: 'var(--border)' }}>
                <div className="flex items-center justify-between gap-2 mb-1.5">
                  <span className={item.severity === 'critical' ? 'badge-critical' : item.severity === 'high' ? 'badge-high' : 'badge-medium'}>
                    {item.severity.toUpperCase()}
                  </span>
                  <span className="font-mono text-[10px]" style={{ color: 'var(--text-dim)' }}>:{item.line_start}</span>
                </div>
                <p className="text-xs leading-relaxed" style={{ color: 'var(--text-muted)' }}>{item.title}</p>
                <p className="text-[10px] mt-1.5 font-mono" style={{ color: 'var(--yellow)' }}>${item.cost_usd.toLocaleString()}/mo</p>
              </div>
            ))}
            {fileDebtItems.length === 0 && (
              <p className="text-xs text-center py-4" style={{ color: 'var(--text-dim)' }}>No debt items in this file</p>
            )}
          </div>
        </div>
      )}

      {/* AI Fix Modal */}
      {aiOpen && (
        <div className="modal-overlay" onClick={e => { if (e.target === e.currentTarget) { setAiOpen(false); setAiSuggestion(null) } }}>
          <div className="modal-box max-w-2xl animate-fadeInUp">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-2">
                <Sparkles size={18} style={{ color: 'var(--cyan)' }} />
                <h2 className="font-display text-lg font-bold">AI Fix Suggestion</h2>
              </div>
              <button onClick={() => { setAiOpen(false); setAiSuggestion(null) }}>
                <X size={18} style={{ color: 'var(--text-muted)' }} />
              </button>
            </div>

            <div className="p-3 rounded-lg mb-4 text-xs font-mono" style={{ background: 'var(--surface)', color: 'var(--text-muted)' }}>
              Selected: <span style={{ color: 'var(--cyan)' }}>token.service.ts:11–30</span>
            </div>

            {!aiSuggestion ? (
              <div className="text-center py-8">
                <p className="text-sm mb-4" style={{ color: 'var(--text-muted)' }}>
                  Claude will analyze the selected code and suggest a fix for the race condition and missing error handling.
                </p>
                <button onClick={handleAIFix} disabled={aiLoading} className="btn-primary">
                  {aiLoading ? (
                    <><Loader2 size={14} className="animate-spin" /> Generating fix...</>
                  ) : (
                    <><Sparkles size={14} /> Generate Fix</>
                  )}
                </button>
              </div>
            ) : (
              <>
                <p className="text-xs mb-2 font-semibold" style={{ color: 'var(--text-muted)' }}>Suggested fix:</p>
                <div className="terminal text-xs overflow-x-auto mb-4">
                  <pre style={{ color: '#4ade80' }}>{aiSuggestion}</pre>
                </div>
                <div className="flex gap-3">
                  <button className="btn-primary flex-1 justify-center text-sm">Apply fix</button>
                  <button className="btn-ghost px-4 text-sm" onClick={() => setAiSuggestion(null)}>Try again</button>
                  <button className="btn-ghost px-4 text-sm" onClick={() => { setAiOpen(false); setAiSuggestion(null) }}>Cancel</button>
                </div>
              </>
            )}

            <div className="mt-4 flex items-center gap-2 text-xs" style={{ color: 'var(--text-dim)' }}>
              <Clock size={11} />
              <span>{aiMinutes} of 120 AI minutes used today</span>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

export default function EditorPage() {
  return (
    <Suspense fallback={<div className="flex-1 flex items-center justify-center" style={{ background: '#020c12' }}>
      <Loader2 size={24} className="animate-spin" style={{ color: 'var(--text-dim)' }} />
    </div>}>
      <EditorContent />
    </Suspense>
  )
}
