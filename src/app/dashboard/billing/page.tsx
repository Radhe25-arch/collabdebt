'use client'

import { Check, CreditCard, Zap, ArrowUpRight, Download } from 'lucide-react'

const PLANS = [
  { id: 'free', name: 'Free', price: 0, features: ['1 repo', '3 members', '50 items', 'Basic editor'] },
  { id: 'pro', name: 'Pro', price: 19, features: ['Unlimited repos', '10 members', 'AI (2hr/day)', 'Full editor', 'PR comments'] },
  { id: 'team', name: 'Team', price: 49, current: true, features: ['Everything in Pro', '25 members', 'Collab sessions', 'Manager dashboard', 'Employee tracking'] },
  { id: 'enterprise', name: 'Enterprise', price: 99, features: ['Everything in Team', 'Unlimited members', 'Silent inspect', 'SSO/SAML', 'Dedicated support'] },
]

const PAYMENT_HISTORY = [
  { plan: 'Team Plan', amount: 49, date: 'Jun 1, 2024', id: 'pay_J9x2k3', status: 'success' },
  { plan: 'Team Plan', amount: 49, date: 'May 1, 2024', id: 'pay_H8w1j2', status: 'success' },
  { plan: 'Team Plan', amount: 49, date: 'Apr 1, 2024', id: 'pay_G7v0i1', status: 'success' },
  { plan: 'Pro Plan', amount: 19, date: 'Mar 1, 2024', id: 'pay_F6u9h0', status: 'success' },
]

export default function BillingPage() {
  return (
    <div className="space-y-6 max-w-4xl">
      <div>
        <h1 className="font-display text-2xl font-bold">Billing</h1>
        <p className="text-sm mt-0.5" style={{ color: 'var(--text-muted)' }}>Manage your plan and payment history</p>
      </div>

      {/* Current plan */}
      <div className="card" style={{ border: '1px solid rgba(0,229,255,0.2)', background: 'rgba(0,229,255,0.02)' }}>
        <div className="flex items-start justify-between gap-4">
          <div className="flex items-center gap-4">
            <div className="p-3 rounded-xl" style={{ background: 'rgba(0,229,255,0.1)' }}>
              <Zap size={22} style={{ color: 'var(--cyan)' }} />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="font-display text-lg font-bold">Team Plan</h2>
                <span className="badge-cyan text-[10px]">CURRENT</span>
              </div>
              <p className="text-sm mt-0.5" style={{ color: 'var(--text-muted)' }}>
                $49/month · Renews Jul 1, 2024
              </p>
            </div>
          </div>
          <button className="btn-ghost text-sm">Manage</button>
        </div>

        {/* Usage */}
        <div className="grid grid-cols-3 gap-4 mt-5">
          {[
            { label: 'Team members', used: 20, total: 25 },
            { label: 'Repositories', used: 3, total: 'Unlimited' },
            { label: 'Debt items', used: 247, total: 'Unlimited' },
          ].map(u => (
            <div key={u.label} className="p-3 rounded-xl" style={{ background: 'var(--surface)' }}>
              <div className="flex items-center justify-between text-xs mb-2" style={{ color: 'var(--text-muted)' }}>
                <span>{u.label}</span>
                <span className="font-mono">{u.used}{typeof u.total === 'number' ? `/${u.total}` : ''}</span>
              </div>
              {typeof u.total === 'number' && (
                <div className="progress-bar h-1.5">
                  <div className="h-full rounded-full transition-all"
                    style={{ width: `${(u.used / u.total) * 100}%`, background: 'linear-gradient(90deg, var(--cyan), #7c3aed)' }} />
                </div>
              )}
              {typeof u.total === 'string' && (
                <div className="text-xs font-semibold" style={{ color: 'var(--green)' }}>Unlimited</div>
              )}
            </div>
          ))}
        </div>
      </div>

      {/* Plan cards */}
      <div>
        <h2 className="font-semibold mb-4">Available Plans</h2>
        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {PLANS.map(plan => (
            <div key={plan.id}
              className="card flex flex-col relative"
              style={plan.current ? { border: '1px solid rgba(0,229,255,0.3)', background: 'rgba(0,229,255,0.03)' } : {}}>
              {plan.current && (
                <div className="absolute -top-2.5 left-1/2 -translate-x-1/2 badge-cyan text-[9px] px-2 whitespace-nowrap">
                  CURRENT PLAN
                </div>
              )}
              <div className="mb-3">
                <h3 className="font-display font-bold">{plan.name}</h3>
                <div className="flex items-end gap-1 mt-1">
                  <span className="text-2xl font-bold font-display" style={{ color: 'var(--cyan)' }}>
                    ${plan.price}
                  </span>
                  <span className="text-xs pb-1" style={{ color: 'var(--text-muted)' }}>/mo</span>
                </div>
              </div>
              <ul className="space-y-2 flex-1 mb-4">
                {plan.features.map(f => (
                  <li key={f} className="flex items-start gap-2 text-xs">
                    <Check size={12} className="mt-0.5 shrink-0" style={{ color: 'var(--green)' }} />
                    <span style={{ color: 'var(--text-muted)' }}>{f}</span>
                  </li>
                ))}
              </ul>
              {plan.current ? (
                <button disabled className="btn-ghost text-xs py-1.5 opacity-50 justify-center cursor-not-allowed">
                  Current plan
                </button>
              ) : plan.id === 'enterprise' ? (
                <a href="mailto:support@collabdebt.com" className="btn-ghost text-xs py-1.5 justify-center text-center">
                  Contact Sales <ArrowUpRight size={12} />
                </a>
              ) : (
                <button className={`text-xs py-1.5 justify-center ${plan.price > 49 ? 'btn-primary' : 'btn-ghost'}`}>
                  {plan.price < 49 ? 'Downgrade' : 'Upgrade'} to {plan.name}
                </button>
              )}
            </div>
          ))}
        </div>
      </div>

      {/* Payment history */}
      <div className="card">
        <div className="flex items-center justify-between mb-4">
          <h2 className="font-semibold">Payment History</h2>
          <button className="btn-ghost text-xs py-1.5 px-3">
            <Download size={12} /> Export
          </button>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b" style={{ borderColor: 'var(--border)' }}>
                {['Plan', 'Amount', 'Date', 'Payment ID', 'Status', ''].map(h => (
                  <th key={h} className="text-left pb-3 pr-4 text-xs font-semibold" style={{ color: 'var(--text-muted)' }}>{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {PAYMENT_HISTORY.map((p, i) => (
                <tr key={i} className="border-b hover:bg-white/5 transition-colors" style={{ borderColor: 'var(--border)' }}>
                  <td className="py-3 pr-4 font-medium">{p.plan}</td>
                  <td className="py-3 pr-4 font-mono font-bold" style={{ color: 'var(--cyan)' }}>${p.amount}</td>
                  <td className="py-3 pr-4 text-xs" style={{ color: 'var(--text-muted)' }}>{p.date}</td>
                  <td className="py-3 pr-4 font-mono text-xs" style={{ color: 'var(--text-dim)' }}>{p.id}</td>
                  <td className="py-3 pr-4"><span className="badge-low">paid</span></td>
                  <td className="py-3">
                    <button className="p-1.5 rounded hover:bg-white/10 transition-colors" style={{ color: 'var(--text-muted)' }}>
                      <Download size={13} />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Payment method */}
      <div className="card">
        <h2 className="font-semibold mb-4">Payment Method</h2>
        <div className="flex items-center gap-4 p-4 rounded-xl" style={{ background: 'var(--surface)', border: '1px solid var(--border)' }}>
          <div className="p-2.5 rounded-lg" style={{ background: 'var(--border)' }}>
            <CreditCard size={20} style={{ color: 'var(--text-muted)' }} />
          </div>
          <div className="flex-1">
            <p className="text-sm font-medium">Visa ending in 4242</p>
            <p className="text-xs mt-0.5" style={{ color: 'var(--text-muted)' }}>Expires 12/2026</p>
          </div>
          <button className="btn-ghost text-xs py-1.5 px-3">Update</button>
        </div>
      </div>
    </div>
  )
}
