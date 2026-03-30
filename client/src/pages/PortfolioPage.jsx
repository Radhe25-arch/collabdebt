import { useState, useEffect } from 'react';
import { Button, Input, Spinner, BadgeTag, Modal } from '@/components/ui';
import Icons from '@/assets/icons';
import api from '@/lib/api';
import toast from 'react-hot-toast';
import { useAuthStore } from '@/store';

export default function PortfolioPage() {
  const { user } = useAuthStore();
  const [portfolio, setPortfolio]   = useState(null);
  const [readme, setReadme]         = useState('');
  const [loading, setLoading]       = useState(true);
  const [pushing, setPushing]       = useState(false);
  const [generating, setGenerating] = useState(false);
  const [tokenModal, setTokenModal] = useState(false);
  const [ghToken, setGhToken]       = useState('');
  const [addProjectModal, setAddProjectModal] = useState(false);
  const [form, setForm] = useState({
    githubUsername: '', bio: '', themeColor: '#7C3AED',
    socialLinks: { github: '', linkedin: '', twitter: '', website: '' },
  });
  const [project, setProject] = useState({ title: '', description: '', language: '', tags: '', repoUrl: '', liveUrl: '', featured: false });

  useEffect(() => {
    Promise.all([api.get('/portfolio/me')])
      .then(([p]) => {
        setPortfolio(p.data.portfolio);
        if (p.data.portfolio) {
          setForm({
            githubUsername: p.data.portfolio.githubUsername || '',
            bio: p.data.portfolio.bio || '',
            themeColor: p.data.portfolio.themeColor || '#7C3AED',
            socialLinks: p.data.portfolio.socialLinks || { github: '', linkedin: '', twitter: '', website: '' },
          });
        }
      })
      .finally(() => setLoading(false));
  }, []);

  const handleSave = async () => {
    try {
      const r = await api.put('/portfolio/me', form);
      setPortfolio(r.data.portfolio);
      toast.success('Portfolio settings saved');
    } catch (_) { toast.error('Save failed'); }
  };

  const handleGenerate = async () => {
    setGenerating(true);
    try {
      const r = await api.get('/portfolio/me/readme');
      setReadme(r.data.readme);
      toast.success('README generated');
    } catch (_) { toast.error('Generation failed'); }
    setGenerating(false);
  };

  const handlePush = async () => {
    if (!ghToken.trim()) return toast.error('GitHub token required');
    setPushing(true);
    try {
      const r = await api.post('/portfolio/me/push-github', { token: ghToken });
      setPortfolio((p) => ({ ...p, repoUrl: r.data.repoUrl, lastBuiltAt: new Date().toISOString() }));
      setTokenModal(false);
      setGhToken('');
      toast.success('Pushed to GitHub!');
      window.open(r.data.repoUrl, '_blank');
    } catch (err) {
      toast.error(err.response?.data?.error || 'Push failed');
    }
    setPushing(false);
  };

  const handleAddProject = async () => {
    try {
      const tags = project.tags.split(',').map((t) => t.trim()).filter(Boolean);
      await api.post('/portfolio/me/projects', { ...project, tags });
      toast.success('Project added');
      setAddProjectModal(false);
      setProject({ title: '', description: '', language: '', tags: '', repoUrl: '', liveUrl: '', featured: false });
    } catch (_) { toast.error('Failed to add project'); }
  };

  if (loading) return (
    <div className="flex justify-center py-24"><Spinner size={24} className="text-blue-700" /></div>
  );

  return (
    <div className="space-y-6 max-w-4xl mx-auto">
      <div className="flex items-center justify-between flex-wrap gap-4">
        <div>
          <h1 className="font-display font-black text-2xl mb-1">Portfolio Builder</h1>
          <p className="font-mono text-xs text-slate-500">// auto-generate your GitHub dev profile from SkillForge stats</p>
        </div>
        <div className="flex gap-2">
          <Button onClick={handleGenerate} variant="secondary" loading={generating}>
            <Icons.Code size={14} /> Generate README
          </Button>
          <Button onClick={() => setTokenModal(true)} variant="teal">
            <Icons.ExternalLink size={14} /> Push to GitHub
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Left — settings */}
        <div className="space-y-4">
          {/* Status card */}
          <div className="sf-card p-5">
            <div className="flex items-center justify-between mb-4">
              <span className="font-mono text-xs text-slate-500 uppercase tracking-widest">Portfolio Status</span>
              <BadgeTag variant={portfolio?.repoUrl ? 'teal' : 'gray'}>
                {portfolio?.repoUrl ? 'Published' : 'Not published'}
              </BadgeTag>
            </div>
            {portfolio?.repoUrl ? (
              <div className="space-y-2">
                <div className="flex items-center gap-2 p-2.5 bg-slate-100 rounded-lg border border-slate-200">
                  <Icons.ExternalLink size={12} className="text-indigo-600" />
                  <a href={portfolio.repoUrl} target="_blank" rel="noreferrer"
                    className="font-mono text-xs text-indigo-600 hover:text-sf-teal2 transition-colors flex-1 truncate">
                    {portfolio.repoUrl}
                  </a>
                </div>
                {portfolio.lastBuiltAt && (
                  <p className="font-mono text-xs text-slate-500">
                    Last synced: {new Date(portfolio.lastBuiltAt).toLocaleDateString()}
                  </p>
                )}
              </div>
            ) : (
              <p className="font-mono text-xs text-slate-600">Generate your README and push it to GitHub to publish your portfolio.</p>
            )}
          </div>

          {/* Settings form */}
          <div className="sf-card p-5 space-y-4">
            <span className="font-mono text-xs text-slate-500 uppercase tracking-widest block">Profile Settings</span>
            <Input label="GitHub Username" value={form.githubUsername}
              onChange={(e) => setForm({ ...form, githubUsername: e.target.value })}
              placeholder="your-github-username" icon={<Icons.Code size={14} />} />
            <div>
              <label className="block text-sm font-semibold text-slate-700 mb-1.5">Bio / Tagline</label>
              <textarea
                className="w-full bg-white border border-slate-200 rounded-xl px-4 py-3 placeholder-slate-400 text-slate-900 focus:outline-none focus:border-blue-500 transition-all text-sm resize-none"
                rows={3}
                value={form.bio}
                onChange={(e) => setForm({ ...form, bio: e.target.value })}
                placeholder="Full-stack developer passionate about open source..."
              />
            </div>
            <div>
              <label className="block text-sm font-semibold text-slate-700 mb-1.5">Accent Color</label>
              <div className="flex items-center gap-3">
                <input type="color" value={form.themeColor}
                  onChange={(e) => setForm({ ...form, themeColor: e.target.value })}
                  className="w-10 h-10 rounded cursor-pointer bg-transparent border-0" />
                <span className="font-mono text-xs text-slate-500">{form.themeColor}</span>
              </div>
            </div>
            <div className="space-y-2">
              <label className="block text-sm font-semibold text-slate-700 mb-1.5">Social Links</label>
              {['github','linkedin','twitter','website'].map((k) => (
                <Input key={k} placeholder={`${k} URL`}
                  value={form.socialLinks?.[k] || ''}
                  onChange={(e) => setForm({ ...form, socialLinks: { ...form.socialLinks, [k]: e.target.value } })}
                  icon={<Icons.Globe size={14} />} />
              ))}
            </div>
            <Button onClick={handleSave} variant="primary" className="w-full">
              <Icons.Check size={14} /> Save Settings
            </Button>
          </div>

          {/* Projects */}
          <div className="sf-card p-5">
            <div className="flex items-center justify-between mb-4">
              <span className="font-mono text-xs text-slate-500 uppercase tracking-widest">Featured Projects</span>
              <button onClick={() => setAddProjectModal(true)} className="text-blue-700 hover:text-indigo-600 transition-colors">
                <Icons.Plus size={14} />
              </button>
            </div>
            {portfolio?.projects?.length ? (
              <div className="space-y-2">
                {portfolio.projects.slice(0,5).map((p) => (
                  <div key={p.id} className="flex items-center gap-3 p-2.5 bg-slate-100 rounded-lg border border-slate-200">
                    <Icons.Code size={12} className="text-slate-600" />
                    <div className="flex-1 min-w-0">
                      <p className="font-mono text-xs text-slate-900 truncate">{p.title}</p>
                      {p.language && <p className="font-mono text-xs text-slate-500">{p.language}</p>}
                    </div>
                    {p.featured && <BadgeTag variant="gold">Featured</BadgeTag>}
                  </div>
                ))}
              </div>
            ) : (
              <p className="font-mono text-xs text-slate-600">Add projects to showcase your best work</p>
            )}
          </div>
        </div>

        {/* Right — README preview */}
        <div className="sf-card overflow-hidden flex flex-col">
          <div className="flex items-center justify-between px-5 py-3 border-b border-slate-200 bg-slate-50">
            <div className="flex items-center gap-1.5">
              <div className="w-2.5 h-2.5 rounded-full bg-red-500/60" />
              <div className="w-2.5 h-2.5 rounded-full bg-yellow-500/60" />
              <div className="w-2.5 h-2.5 rounded-full bg-green-500/60" />
              <span className="font-mono text-xs text-slate-500 ml-2">README.md</span>
            </div>
            {readme && (
              <button
                onClick={() => { navigator.clipboard.writeText(readme); toast.success('Copied'); }}
                className="font-mono text-xs text-slate-500 hover:text-indigo-600 transition-colors"
              >
                copy
              </button>
            )}
          </div>
          <div className="flex-1 overflow-y-auto p-4 bg-slate-50 min-h-96">
            {readme ? (
              <pre className="font-mono text-xs text-slate-600 whitespace-pre-wrap leading-relaxed">{readme}</pre>
            ) : (
              <div className="flex flex-col items-center justify-center h-full gap-3 text-center py-16">
                <Icons.Code size={28} className="text-slate-500" />
                <p className="font-mono text-xs text-slate-500">
                  Click "Generate README" to build your<br />GitHub profile from your SkillForge data
                </p>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* GitHub Token Modal */}
      <Modal open={tokenModal} onClose={() => setTokenModal(false)} title="Push to GitHub">
        <div className="space-y-4">
          <div className="p-3 bg-slate-100 rounded-lg border border-slate-200">
            <p className="font-mono text-xs text-slate-600 leading-relaxed">
              You need a GitHub Personal Access Token with <strong className="text-slate-900">repo</strong> scope.
              Go to GitHub → Settings → Developer settings → Personal access tokens → Generate new token.
            </p>
          </div>
          <Input label="GitHub Personal Access Token" type="password"
            placeholder="ghp_xxxxxxxxxxxxxxxxxxxx"
            value={ghToken} onChange={(e) => setGhToken(e.target.value)}
            icon={<Icons.Shield size={14} />} />
          <p className="font-mono text-xs text-slate-500">
            Your token is used only for this push and is not stored permanently.
          </p>
          <div className="flex gap-3">
            <Button onClick={() => setTokenModal(false)} variant="secondary" className="flex-1">Cancel</Button>
            <Button onClick={handlePush} variant="teal" className="flex-1" loading={pushing}>
              <Icons.ExternalLink size={14} /> Push Now
            </Button>
          </div>
        </div>
      </Modal>

      {/* Add Project Modal */}
      <Modal open={addProjectModal} onClose={() => setAddProjectModal(false)} title="Add Project">
        <div className="space-y-4">
          <Input label="Title" value={project.title} onChange={(e) => setProject({ ...project, title: e.target.value })} />
          <div>
            <label className="block text-sm font-semibold text-slate-700 mb-1.5">Description</label>
            <textarea className="w-full bg-white border border-slate-200 rounded-xl px-4 py-3 placeholder-slate-400 text-slate-900 focus:outline-none focus:border-blue-500 transition-all text-sm resize-none" rows={3}
              value={project.description} onChange={(e) => setProject({ ...project, description: e.target.value })} />
          </div>
          <Input label="Language / Tech Stack" placeholder="React, Node.js, PostgreSQL"
            value={project.language} onChange={(e) => setProject({ ...project, language: e.target.value })} />
          <Input label="Tags (comma separated)" placeholder="fullstack, auth, api"
            value={project.tags} onChange={(e) => setProject({ ...project, tags: e.target.value })} />
          <Input label="GitHub URL" value={project.repoUrl} onChange={(e) => setProject({ ...project, repoUrl: e.target.value })} />
          <Input label="Live URL" value={project.liveUrl} onChange={(e) => setProject({ ...project, liveUrl: e.target.value })} />
          <label className="flex items-center gap-2 cursor-pointer">
            <div onClick={() => setProject({ ...project, featured: !project.featured })}
              className={`w-4 h-4 rounded border flex items-center justify-center ${project.featured ? 'bg-blue-600 border-blue-600' : 'border-slate-200'}`}>
              {project.featured && <Icons.Check size={10} className="text-white" />}
            </div>
            <span className="font-mono text-xs text-slate-600">Feature this project</span>
          </label>
          <div className="flex gap-3">
            <Button onClick={() => setAddProjectModal(false)} variant="secondary" className="flex-1">Cancel</Button>
            <Button onClick={handleAddProject} variant="primary" className="flex-1">
              <Icons.Plus size={14} /> Add Project
            </Button>
          </div>
        </div>
      </Modal>
    </div>
  );
}
