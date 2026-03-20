import { useState, useEffect } from 'react';
import { useAuthStore } from '@/store';
import { Button, Input } from '@/components/ui';
import toast from 'react-hot-toast';
import Icons from '@/assets/icons';
import api from '@/lib/api';

export default function SettingsPage() {
  const { user, fetchUser } = useAuthStore();
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    fullName: user?.fullName || '',
    bio: user?.bio || '',
    website: user?.website || '',
    location: user?.location || '',
  });

  useEffect(() => {
    if (user) {
      setFormData({
        fullName: user.fullName || '',
        bio: user.bio || '',
        website: user.website || '',
        location: user.location || '',
      });
    }
  }, [user]);

  const handleSave = async () => {
    setLoading(true);
    try {
      await api.put('/users/me', formData);
      await fetchUser();
      toast.success('Settings updated successfully');
    } catch (err) {
      toast.error(err.response?.data?.error || 'Failed to update settings');
    }
    setLoading(false);
  };

    const handleDelete = async () => {
      if (window.confirm('Are you absolutely sure you want to delete your account? This cannot be undone.')) {
        try {
          await api.delete('/users/me');
          useAuthStore.getState().logout();
          window.location.href = '/';
        } catch(err) { toast.error('Failed to delete account'); }
      }
    };

  return (
    <div className="max-w-3xl mx-auto pb-20 font-sans animate-fade-in space-y-8 pt-4">
      {/* Header */}
      <div>
        <span className="bg-slate-100 text-slate-600 text-[11px] font-bold uppercase tracking-wider px-3 py-1 rounded-full mb-4 inline-block shadow-sm">
          PREFERENCES
        </span>
        <h1 className="font-display font-black text-4xl text-slate-900 mb-2 tracking-tight">Account Settings</h1>
        <p className="text-lg text-slate-600">Manage your profile details, platform preferences, and integrations.</p>
      </div>

      <div className="bg-white border border-slate-200 rounded-3xl p-8 shadow-sm">
        <h3 className="font-display font-bold text-xl text-slate-900 mb-6 flex items-center gap-3 border-b border-slate-100 pb-4">
          <Icons.User size={20} className="text-blue-600" /> Public Profile
        </h3>
        
        <div className="space-y-6 max-w-xl">
          <div className="space-y-2">
            <label className="text-xs font-bold text-slate-500 uppercase tracking-widest block">Full Name</label>
            <input
              type="text"
              className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 text-sm font-medium text-slate-900 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all font-sans"
              placeholder="e.g. Satoshi Nakamoto"
              value={formData.fullName}
              onChange={(e) => setFormData({ ...formData, fullName: e.target.value })}
            />
          </div>

          <div className="space-y-2">
            <label className="text-xs font-bold text-slate-500 uppercase tracking-widest block">Biography</label>
            <textarea
              className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 text-sm font-medium text-slate-900 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all font-sans resize-y min-h-[100px]"
              placeholder="Tell the community about your engineering journey..."
              value={formData.bio}
              onChange={(e) => setFormData({ ...formData, bio: e.target.value })}
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-2">
              <label className="text-xs font-bold text-slate-500 uppercase tracking-widest block">Website / Portfolio</label>
              <div className="relative">
                <Icons.Link size={16} className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" />
                <input
                  type="url"
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl pl-11 pr-4 py-3 text-sm font-medium text-slate-900 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all font-sans"
                  placeholder="https://"
                  value={formData.website}
                  onChange={(e) => setFormData({ ...formData, website: e.target.value })}
                />
              </div>
            </div>
            
            <div className="space-y-2">
              <label className="text-xs font-bold text-slate-500 uppercase tracking-widest block">Location</label>
               <div className="relative">
                <Icons.MapPin size={16} className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" />
                <input
                  type="text"
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl pl-11 pr-4 py-3 text-sm font-medium text-slate-900 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all font-sans"
                  placeholder="e.g. San Francisco, CA"
                  value={formData.location}
                  onChange={(e) => setFormData({ ...formData, location: e.target.value })}
                />
              </div>
            </div>
          </div>
        </div>

        <div className="mt-8 pt-6 border-t border-slate-100 flex justify-end">
          <button
            onClick={handleSave}
            disabled={loading}
            className="bg-blue-600 hover:bg-blue-700 text-white font-bold px-8 py-3 rounded-xl transition-all shadow-sm flex items-center justify-center gap-2"
          >
            {loading ? <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" /> : <Icons.Save size={18} />}
            {loading ? 'Saving...' : 'Save Changes'}
          </button>
        </div>
      </div>

      <div className="bg-red-50 border border-red-200 rounded-3xl p-8">
        <h3 className="font-display font-bold text-xl text-red-900 mb-2 flex items-center gap-3">
          <Icons.Shield size={20} className="text-red-600" /> Danger Zone
        </h3>
        <p className="text-red-700 text-sm mb-6 max-w-xl">Permanently delete your account and all associated data. This action is irreversible.</p>
        <button onClick={handleDelete} className="bg-white border border-red-200 text-red-600 font-bold px-6 py-2.5 rounded-xl transition-all hover:bg-red-100 shadow-sm text-sm">
          Delete Account
        </button>
      </div>

    </div>
  );
}
