'use client'

'use client'

import { useState, useEffect, useRef } from 'react'
import Link from 'next/link'
import { Github, Eye, EyeOff, ArrowRight, Loader2, Chrome, CheckCircle, XCircle, AtSign, ShieldAlert, Sparkles, Zap, ShieldCheck } from 'lucide-react'
import { createClient } from '@/lib/supabase/client'
import { useStore } from '@/store/useStore'
import toast from 'react-hot-toast'
import { motion, AnimatePresence } from 'framer-motion'

const OAUTH_PROVIDERS = [
  { id: 'github', label: 'GitHub Network', icon: Github },
  { id: 'google', label: 'Google Interface', icon: Chrome },
]

type UsernameStatus = 'idle' | 'checking' | 'available' | 'taken' | 'invalid'

export default function SignupPage() {
  const supabase = createClient()
  const { setCurrentUser } = useStore()
  const [tab, setTab] = useState<'signup' | 'login'>('signup')
  const [showPass, setShowPass] = useState(false)
  const [loading, setLoading] = useState<string | null>(null)

  const [form, setForm] = useState({
    name: '', username: '', email: '', password: '', bio: ''
  })

  const [usernameStatus, setUsernameStatus] = useState<UsernameStatus>('idle')
  const usernameTimer = useRef<ReturnType<typeof setTimeout> | null>(null)

  const set = (k: string) => (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) =>
    setForm(f => ({ ...f, [k]: e.target.value }))

  useEffect(() => {
    const raw = form.username.trim()
    if (!raw) { setUsernameStatus('idle'); return }
    if (raw.length < 3) { setUsernameStatus('invalid'); return }
    if (raw.length > 30) { setUsernameStatus('invalid'); return }
    const validPattern = /^[a-zA-Z0-9._\-@#$!~]+$/
    if (!validPattern.test(raw)) { setUsernameStatus('invalid'); return }

    setUsernameStatus('checking')
    if (usernameTimer.current) clearTimeout(usernameTimer.current)
    usernameTimer.current = setTimeout(async () => {
      const { data } = await supabase
        .from('users')
        .select('username')
        .eq('username', raw)
        .maybeSingle()
      setUsernameStatus(data ? 'taken' : 'available')
    }, 500)

    return () => { if (usernameTimer.current) clearTimeout(usernameTimer.current) }
  }, [form.username])

  const handleOAuth = async (provider: 'github' | 'google') => {
    setLoading(provider)
    const { error } = await supabase.auth.signInWithOAuth({
      provider,
      options: {
        redirectTo: `${window.location.origin}/api/auth/callback`,
      },
    })
    if (error) { toast.error(error.message); setLoading(null) }
  }

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!form.email || !form.password) { toast.error('Enter credentials'); return }
    setLoading('email')
    
    // Simulate/Perform Login
    const { error, data } = await supabase.auth.signInWithPassword({
      email: form.email, password: form.password,
    })
    
    if (error) { 
       toast.error('Authentication Failed'); 
       setLoading(null); 
       return 
    }
    
    if (data.user) {
       setCurrentUser({
          id: data.user.id,
          email: data.user.email || '',
          name: data.user.user_metadata?.name || 'Unknown',
          username: data.user.user_metadata?.username || 'unknown',
          user_code: 'CD#' + Math.floor(1000 + Math.random() * 9000),
          plan: 'free',
          role: 'developer',
          onboarding_done: true,
          avatar_url: data.user.user_metadata?.avatar_url || null,
          created_at: data.user.created_at,
          last_seen: new Date().toISOString()
       })
    }
    
    window.location.href = '/dashboard'
  }

  // ADMIN BYPASS
  const handleAdminBypass = () => {
     setLoading('admin')
     setTimeout(() => {
        setCurrentUser({
           id: 'admin-id',
           email: 'admin@collabdebt.com',
           name: 'Project Administrator',
           username: 'admin_core',
           user_code: 'CD#0000',
           plan: 'enterprise',
           role: 'manager',
           onboarding_done: true,
           avatar_url: null,
           created_at: new Date().toISOString(),
           last_seen: new Date().toISOString()
        })
        setLoading(null)
        toast.success('Neural Override Granted: Admin Access')
        window.location.href = '/dashboard'
     }, 1500)
  }

  return (
    <div className="min-h-screen flex items-center justify-center px-4 py-12 relative overflow-hidden bg-[#020609]">
      
      {/* Antigravity Background Elements */}
      <div className="absolute inset-0 pointer-events-none">
         <div className="absolute top-0 left-0 w-full h-full opacity-20 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] bg-repeat" />
         <motion.div 
           animate={{ scale: [1, 1.2, 1], opacity: [0.1, 0.2, 0.1] }}
           transition={{ duration: 10, repeat: Infinity }}
           className="absolute -top-[20%] -left-[10%] w-[60%] h-[60%] bg-cyan-500/20 blur-[150px] rounded-full" 
         />
         <motion.div 
           animate={{ scale: [1, 1.3, 1], opacity: [0.05, 0.15, 0.05] }}
           transition={{ duration: 12, repeat: Infinity, delay: 2 }}
           className="absolute -bottom-[20%] -right-[10%] w-[60%] h-[60%] bg-purple-500/10 blur-[150px] rounded-full" 
         />
      </div>

      <div className="relative w-full max-w-xl">
        {/* Branding */}
        <div className="text-center mb-10">
          <Link href="/" className="inline-flex flex-col items-center gap-4 group">
            <div className="w-16 h-16 rounded-[24px] glass border-cyan-500/30 flex items-center justify-center font-bold text-2xl text-cyan-400 group-hover:scale-110 transition-transform shadow-[0_0_40px_rgba(0,242,255,0.2)]">
              CD
            </div>
            <div>
               <span className="font-display font-black text-2xl text-white tracking-tighter uppercase">Collab<span className="text-cyan-400">Debt</span></span>
               <div className="text-[10px] font-black text-slate-600 uppercase tracking-[0.4em] mt-1">Neural Access Terminal</div>
            </div>
          </Link>
        </div>

        {/* Access Terminal Module */}
        <motion.div 
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          className="glass shadow-2xl rounded-[40px] p-10 border-white/5 relative overflow-hidden"
        >
          {/* Top Holographic Strip */}
          <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-transparent via-cyan-400 to-transparent opacity-50" />
          
          <div className="flex rounded-2xl p-1.5 mb-10 glass border-white/5">
            {(['signup', 'login'] as const).map(t => (
              <button key={t} onClick={() => setTab(t)}
                className="flex-1 py-3 rounded-xl text-xs font-black uppercase tracking-[0.1em] transition-all relative z-10"
                style={tab === t
                  ? { background: 'rgba(255,255,255,0.05)', color: '#00f2ff' }
                  : { color: '#475569' }}>
                {t === 'signup' ? 'Deploy New Core' : 'Identify Asset'}
              </button>
            ))}
          </div>

          <div className="space-y-8">
            <div className="text-center">
               <h2 className="text-xl font-display font-black text-white uppercase tracking-tight">
                 {tab === 'signup' ? 'Initialize Integration' : 'Asset Verification'}
               </h2>
               <p className="text-[10px] font-bold text-slate-500 uppercase tracking-widest mt-2">
                 Protocol v4.0 Secure Uplink Active
               </p>
            </div>

            {/* Neural Bypass Section (ADMIN) */}
            <div className="p-1 glass border-yellow-500/20 rounded-2xl relative group">
               <div className="absolute -top-3 left-6 px-2 bg-[#050b14] text-[8px] font-black text-yellow-500 uppercase tracking-widest border border-yellow-500/30 rounded-full">Neural Bypass</div>
               <button 
                 onClick={handleAdminBypass}
                 className="w-full flex items-center justify-between p-4 rounded-xl hover:bg-yellow-500/[0.03] transition-all"
               >
                  <div className="flex items-center gap-4 text-left">
                     <div className="w-10 h-10 rounded-xl glass border-yellow-500/30 flex items-center justify-center text-yellow-500">
                        <ShieldAlert size={20} />
                     </div>
                     <div>
                        <div className="text-[11px] font-black text-white uppercase tracking-wider">Administrator Access</div>
                        <div className="text-[9px] font-bold text-slate-500 uppercase mt-0.5 tracking-tight group-hover:text-yellow-400/80 transition-colors">Grant full system clearance & paid metrics</div>
                     </div>
                  </div>
                  {loading === 'admin' ? <Loader2 size={16} className="animate-spin text-yellow-500" /> : <Zap size={16} className="text-yellow-500" />}
               </button>
            </div>

            {/* OAuth Modules */}
            <div className="grid grid-cols-2 gap-4">
              {OAUTH_PROVIDERS.map(({ id, label, icon: Icon }) => (
                <button key={id}
                  onClick={() => handleOAuth(id as 'github' | 'google')}
                  disabled={loading !== null}
                  className="flex flex-col items-center gap-3 p-5 glass border-white/5 rounded-3xl hover:border-cyan-400/30 transition-all text-slate-500 hover:text-white"
                >
                  <Icon size={24} />
                  <span className="text-[9px] font-black uppercase tracking-widest">{label}</span>
                </button>
              ))}
            </div>

            <div className="relative py-4">
               <div className="absolute inset-0 flex items-center"><div className="w-full border-t border-white/5"></div></div>
               <div className="relative flex justify-center"><span className="px-4 bg-[#050b14] text-[9px] font-black text-slate-700 uppercase tracking-[0.2em]">Legacy Email Protocol</span></div>
            </div>

            {/* Form */}
            <form onSubmit={handleLogin} className="space-y-5">
              <div className="space-y-4">
                <div className="relative group">
                   <div className="absolute inset-y-0 left-4 flex items-center text-slate-600 group-focus-within:text-cyan-400 transition-colors">
                      <AtSign size={16} />
                   </div>
                   <input 
                     value={form.email}
                     onChange={set('email')}
                     className="w-full glass border-white/10 p-4 pl-12 rounded-2xl text-white font-bold text-sm outline-none focus:ring-1 focus:ring-cyan-400/30 placeholder:text-slate-700" 
                     placeholder="neural.link@provider.com" 
                   />
                </div>
                <div className="relative group">
                   <div className="absolute inset-y-0 left-4 flex items-center text-slate-600 group-focus-within:text-cyan-400 transition-colors">
                      <Zap size={16} />
                   </div>
                   <input 
                     type={showPass ? 'text' : 'password'}
                     value={form.password}
                     onChange={set('password')}
                     className="w-full glass border-white/10 p-4 pl-12 pr-12 rounded-2xl text-white font-bold text-sm outline-none focus:ring-1 focus:ring-cyan-400/30 placeholder:text-slate-700" 
                     placeholder="Cypher Key Required" 
                   />
                   <button type="button" onClick={() => setShowPass(!showPass)} className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-600 hover:text-white">
                      {showPass ? <EyeOff size={16} /> : <Eye size={16} />}
                   </button>
                </div>
              </div>

              <motion.button 
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                type="submit" 
                disabled={loading !== null}
                className="w-full btn-primary-cyan py-5 rounded-2xl font-black uppercase tracking-[0.3em] text-xs shadow-xl shadow-cyan-400/10 flex items-center justify-center gap-3"
              >
                {loading === 'email' ? <Loader2 size={18} className="animate-spin" /> : <><ShieldCheck size={18} /> Establish Uplink</>}
              </motion.button>
            </form>

            <p className="text-center text-[10px] font-bold text-slate-600 uppercase tracking-widest">
               By initiating uplink, you accept all <span className="text-white">Neural Protocols</span>
            </p>
          </div>
        </motion.div>
      </div>
    </div>
  )
}
