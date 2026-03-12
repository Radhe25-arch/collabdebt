'use client'

import { useState } from 'react'
import { Settings, Bell, Puzzle, CreditCard, Shield, Key, ChevronRight, Eye, EyeOff, Copy, Check } from 'lucide-react'

const NAV = [
  { id: 'general', label: 'General', icon: Settings },
  { id: 'notifications', label: 'Notifications', icon: Bell },
  { id: 'integrations', label: 'Integrations', icon: Puzzle },
  { id: 'billing', label: 'Billing', icon: CreditCard },
  { id: 'security', label: 'Security', icon: Shield },
];

function Toggle({ checked, onChange }: { checked: boolean; onChange: (v: boolean) => void }) {
  return (
    <button onClick={() => onChange(!checked)}
      className="relative w-10 h-5 rounded-full transition-all"
      style={{ background: checked ? 'var(--cyan)' : 'var(--border)' }}>
      <div className="absolute top-0.5 w-4 h-4 rounded-full transition-all"
        style={{ background: checked ? '#050a0f' : '#6b8fa8', left: checked ? '24px' : '2px' }} />
    </button>
  )
}

export default function SettingsPage() {
  const [tab, setTab] = useState('general')
  const [settings, setSettings] = useState({
    workspaceName: 'Acme Corp',
    scanOnPush: true,
    slackWebhook: '',
    criticalEmail: true,
    weeklyDigest: true,
    prComments: true,
  })
  const [copied, setCopied] = useState(false)
  const apiKey = 'cd_sk_live_xxxxxxxxxxxxxxxxxxxxxxxxxxx'

  const copyKey = () => {
    navigator.clipboard.writeText(apiKey)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  const CONTENT: Record<string, React.ReactNode> = {
    general: (
      <div className="space-y-6">
        <h2 className="font-display text-lg font-bold">General Settings</h2>
        <div>
          <label className="block text-sm font-medium mb-2" style={{ color: 'var(--text-muted)' }}>Workspace Name</label>
          <input className="input max-w-sm" value={settings.workspaceName}
            onChange={e => setSettings(s => ({ ...s, workspaceName: e.target.value }))} />
        </div>
        <div className="flex items-center justify-between p-4 rounded-xl" style={{ background: 'var(--surface)', border: '1px solid var(--border)' }}>
          <div>
            <p className="font-medium text-sm">Scan on Push</p>
            <p className="text-xs mt-0.5" style={{ color: 'var(--text-muted)' }}>Automatically scan repos when code is pushed</p>
          </div>
          <Toggle checked={settings.scanOnPush} onChange={v => setSettings(s => ({ ...s, scanOnPush: v }))} />
        </div>
        <div>
          <label className="block text-sm font-medium mb-2" style={{ color: 'var(--text-muted)' }}>Slack Webhook URL</label>
          <input className="input max-w-sm" placeholder="https://hooks.slack.com/..."
            value={settings.slackWebhook} onChange={e => setSettings(s => ({ ...s, slackWebhook: e.target.value }))} />
          <p className="text-xs mt-1" style={{ color: 'var(--text-dim)' }}>Receive debt alerts in your Slack channel</p>
        </div>
        <button className="btn-primary text-sm">Save changes</button>
      </div>
    ),
    notifications: (
      <div className="space-y-4">
        <h2 className="font-display text-lg font-bold">Notifications</h2>
        {[
          { key: 'criticalEmail', label: 'Critical debt alerts', sub: 'Email when a critical severity item is found' },
          { key: 'weeklyDigest', label: 'Weekly digest', sub: 'Monday morning debt health summary email' },
          { key: 'prComments', label: 'PR comments', sub: 'Post debt impact comment on every pull request' },
        ].map(n => (
          <div key={n.key} className="flex items-center justify-between p-4 rounded-xl" style={{ background: 'var(--surface)', border: '1px solid var(--border)' }}>
            <div>
              <p className="font-medium text-sm">{n.label}</p>
              <p className="text-xs mt-0.5" style={{ color: 'var(--text-muted)' }}>{n.sub}</p>
            </div>
            <Toggle checked={settings[n.key as keyof typeof settings] as boolean}
              onChange={v => setSettings(s => ({ ...s, [n.key]: v }))} />
          </div>
        ))}
      </div>
    ),
    integrations: (
      <div className="space-y-4">
        <h2 className="font-display text-lg font-bold">Integrations</h2>
        {[
          { name: 'GitHub', desc: '3 repos connected', connected: true },
          { name: 'GitLab', desc: '1 repo connected', connected: true },
          { name: 'Jira', desc: 'Coming soon', connected: false, soon: true },
          { name: 'Linear', desc: 'Coming soon', connected: false, soon: true },
        ].map(intg => (
          <div key={intg.name} className="flex items-center justify-between p-4 rounded-xl" style={{ background: 'var(--surface)', border: '1px solid var(--border)' }}>
            <div>
              <p className="font-medium text-sm">{intg.name}</p>
              <p className="text-xs mt-0.5" style={{ color: 'var(--text-muted)' }}>{intg.desc}</p>
            </div>
            {intg.soon ? (
              <span className="badge-medium text-[10px]">Soon</span>
            ) : intg.connected ? (
              <span className="badge-low text-[10px]">Connected</span>
            ) : (
              <button className="btn-ghost text-xs py-1.5 px-3">Connect</button>
            )}
          </div>
        ))}
      </div>
    ),
    security: (
      <div className="space-y-6">
        <h2 className="font-display text-lg font-bold">Security</h2>
        <div>
          <h3 className="font-semibold text-sm mb-3">Change Password</h3>
          <div className="space-y-3 max-w-sm">
            <input className="input" type="password" placeholder="Current password" />
            <input className="input" type="password" placeholder="New password" />
            <input className="input" type="password" placeholder="Confirm new password" />
            <button className="btn-primary text-sm">Update password</button>
          </div>
        </div>
        <div>
          <h3 className="font-semibold text-sm mb-3">Active Sessions</h3>
          {[
            { device: 'MacBook Pro', location: 'Mumbai, IN', current: true, time: 'Active now' },
            { device: 'iPhone 15', location: 'Mumbai, IN', current: false, time: '2h ago' },
          ].map((s, i) => (
            <div key={i} className="flex items-center justify-between py-3 border-b" style={{ borderColor: 'var(--border)' }}>
              <div>
                <div className="text-sm font-medium flex items-center gap-2">
                  {s.device}
                  {s.current && <span className="badge-low text-[9px]">Current</span>}
                </div>
                <div className="text-xs" style={{ color: 'var(--text-muted)' }}>{s.location} · {s.time}</div>
              </div>
              {!s.current && <button className="text-xs" style={{ color: 'var(--red)' }}>Revoke</button>}
            </div>
          ))}
          <button className="text-sm mt-3" style={{ color: 'var(--red)' }}>Revoke all sessions</button>
        </div>
      </div>
    ),
  }

  return (
    <div className="max-w-4xl">
      <div className="mb-6">
        <h1 className="font-display text-2xl font-bold">Settings</h1>
      </div>
      <div className="flex gap-6">
        {/* Nav */}
        <div className="w-44 shrink-0 space-y-1">
          {NAV.map(n => (
            <button key={n.id} onClick={() => setTab(n.id)}
              className={`sidebar-link w-full text-left ${tab === n.id ? 'active' : ''}`}>
              <n.icon size={16} />
              <span>{n.label}</span>
            </button>
          ))}
        </div>
        {/* Content */}
        <div className="flex-1 card min-h-96">
          {CONTENT[tab] || <p style={{ color: 'var(--text-muted)' }}>Coming soon</p>}
        </div>
      </div>
    </div>
  )
}
