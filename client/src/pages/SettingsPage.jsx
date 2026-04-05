import { useState } from 'react';
import { useAuthStore } from '@/store';
import { Button, Input, Avatar, BadgeTag } from '@/components/ui';
import { Check, LogOut } from 'lucide-react';
import api from '@/lib/api';
import toast from 'react-hot-toast';

export default function SettingsPage() {
  const { user, updateUser, logout } = useAuthStore();
  const [form, setForm] = useState({
    fullName:  user?.fullName  || '',
    bio:       user?.bio       || '',
    avatarUrl: user?.avatarUrl || '',
  });
  const [saving, setSaving] = useState(false);

  const handleSave = async () => {
    setSaving(true);
    try {
      const r = await api.put('/users/me', form);
      updateUser(r.data.user);
      toast.success('PROFILE UPDATED');
    } catch { toast.error('UPDATE FAILED'); }
    setSaving(false);
  };

  return (
    <div className="max-w-2xl mx-auto space-y-5 animate-fade-in pb-16">
      <div style={{ borderBottom: '1px solid rgba(255,255,255,0.06)', paddingBottom: '1.5rem' }}>
        <h1 className="font-black text-2xl text-white tracking-tight uppercase mb-1">SETTINGS</h1>
        <p className="font-mono text-[11px] text-[#555]">// MANAGE YOUR OPERATOR ACCOUNT</p>
      </div>

      {/* Profile */}
      <div className="blade p-6 space-y-5">
        <h2 className="font-mono text-[10px] font-black text-[#555] uppercase tracking-[0.2em]">IDENTITY</h2>
        <div className="flex items-center gap-4">
          <Avatar user={user} size={52} />
          <div>
            <p className="font-mono text-sm font-black text-white uppercase">@{user?.username}</p>
            <BadgeTag variant="purple" className="mt-1">{user?.role}</BadgeTag>
          </div>
        </div>
        <Input label="FULL NAME" value={form.fullName} onChange={e => setForm({ ...form, fullName: e.target.value })} />
        <Input label="AVATAR URL" value={form.avatarUrl} onChange={e => setForm({ ...form, avatarUrl: e.target.value })} placeholder="https://..." />
        <div>
          <label className="font-mono text-[10px] font-black text-[#666] uppercase tracking-[0.15em] block mb-1.5">BIO</label>
          <textarea
            className="w-full bg-white/[0.03] border border-white/[0.08] rounded-[4px] px-4 py-3 text-white placeholder:text-[#333] focus:outline-none focus:border-cyber transition-all duration-150 text-sm resize-none font-sans"
            rows={3}
            value={form.bio}
            onChange={e => setForm({ ...form, bio: e.target.value })}
            placeholder="Tell the arena who you are..."
          />
        </div>
        <Button onClick={handleSave} variant="primary" loading={saving}>
          <Check size={13} strokeWidth={1.5} /> SAVE CHANGES
        </Button>
      </div>

      {/* Account info */}
      <div className="blade overflow-hidden">
        <div className="px-6 py-4" style={{ borderBottom: '1px solid rgba(255,255,255,0.06)' }}>
          <h2 className="font-mono text-[10px] font-black text-[#555] uppercase tracking-[0.2em]">ACCOUNT METADATA</h2>
        </div>
        <div className="divide-y divide-white/[0.04]">
          {[
            { label: 'EMAIL',        value: user?.email },
            { label: 'ROLE',         value: user?.role },
            { label: 'MEMBER SINCE', value: user?.createdAt ? new Date(user.createdAt).toLocaleDateString() : '—' },
          ].map(({ label, value }) => (
            <div key={label} className="flex justify-between items-center px-6 py-3">
              <span className="font-mono text-[10px] font-bold text-[#555] uppercase tracking-wider">{label}</span>
              <span className="font-mono text-[11px] font-bold text-white uppercase">{value}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Danger zone */}
      <div className="blade p-6" style={{ borderLeftWidth: '2px', borderLeftColor: 'rgba(220,38,38,0.4)' }}>
        <h2 className="font-mono text-[10px] font-black text-crimson uppercase tracking-[0.2em] mb-4">DANGER ZONE</h2>
        <Button onClick={() => logout()} variant="danger">
          <LogOut size={13} strokeWidth={1.5} /> SIGN OUT OF ALL DEVICES
        </Button>
      </div>
    </div>
  );
}
