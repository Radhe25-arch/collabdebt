import { useState } from 'react';
import { useAuthStore } from '@/store';
import { Button, Input, Avatar, BadgeTag } from '@/components/ui';
import Icons from '@/assets/icons';
import api from '@/lib/api';
import toast from 'react-hot-toast';

export default function SettingsPage() {
  const { user, updateUser, logout } = useAuthStore();
  const [form, setForm] = useState({
    fullName: user?.fullName || '',
    bio: user?.bio || '',
    avatarUrl: user?.avatarUrl || '',
  });
  const [saving, setSaving] = useState(false);

  const handleSave = async () => {
    setSaving(true);
    try {
      const r = await api.put('/users/me', form);
      updateUser(r.data.user);
      toast.success('Profile updated');
    } catch (_) { toast.error('Update failed'); }
    setSaving(false);
  };

  return (
    <div className="max-w-2xl mx-auto space-y-6">
      <div>
        <h1 className="font-display font-black text-2xl mb-1">Settings</h1>
        <p className="font-mono text-xs text-slate-500">// manage your account</p>
      </div>

      {/* Profile settings */}
      <div className="arena-card p-6 space-y-5">
        <span className="font-mono text-xs text-slate-500 uppercase tracking-widest block">Profile</span>
        <div className="flex items-center gap-4">
          <Avatar user={user} size={56} />
          <div>
            <p className="font-mono text-sm text-slate-900 font-bold">@{user?.username}</p>
            <BadgeTag variant="purple" className="mt-1">{user?.role}</BadgeTag>
          </div>
        </div>
        <Input label="Full Name" value={form.fullName} onChange={(e) => setForm({ ...form, fullName: e.target.value })} />
        <Input label="Avatar URL" value={form.avatarUrl} onChange={(e) => setForm({ ...form, avatarUrl: e.target.value })} placeholder="https://..." />
        <div>
          <label className="block text-sm font-semibold text-slate-700 mb-1.5">Bio</label>
          <textarea className="w-full bg-white border border-slate-200 rounded-xl px-4 py-3 placeholder-slate-400 text-slate-900 focus:outline-none focus:border-blue-500 transition-all text-sm resize-none" rows={3} value={form.bio} onChange={(e) => setForm({ ...form, bio: e.target.value })} placeholder="Tell the arena who you are..." />
        </div>
        <Button onClick={handleSave} variant="primary" loading={saving}>
          <Icons.Check size={14} /> Save Changes
        </Button>
      </div>

      {/* Account info */}
      <div className="arena-card p-6 space-y-3">
        <span className="font-mono text-xs text-slate-500 uppercase tracking-widest block">Account</span>
        <div className="flex justify-between py-2 border-b border-slate-200/40">
          <span className="font-mono text-xs text-slate-500">Email</span>
          <span className="font-mono text-xs text-slate-900">{user?.email}</span>
        </div>
        <div className="flex justify-between py-2 border-b border-slate-200/40">
          <span className="font-mono text-xs text-slate-500">Role</span>
          <span className="font-mono text-xs text-slate-900">{user?.role}</span>
        </div>
        <div className="flex justify-between py-2">
          <span className="font-mono text-xs text-slate-500">Member since</span>
          <span className="font-mono text-xs text-slate-900">
            {user?.createdAt ? new Date(user.createdAt).toLocaleDateString() : '—'}
          </span>
        </div>
      </div>

      {/* Danger zone */}
      <div className="arena-card p-6 border-red-500/20">
        <span className="font-mono text-xs text-red-400 uppercase tracking-widest block mb-4">Danger Zone</span>
        <Button onClick={() => { logout(); }} variant="danger">
          <Icons.LogOut size={14} /> Sign Out of All Devices
        </Button>
      </div>
    </div>
  );
}
