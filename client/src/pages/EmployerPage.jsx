import React, { useState, useEffect } from 'react';
import { Button, Card, StatCard, BadgeTag, Spinner, Modal, Input } from '@/components/ui';
import Icons from '@/assets/icons';
import api from '@/lib/api';
import { useAuthStore } from '@/store';
import toast from 'react-hot-toast';

export default function EmployerPage() {
  const { user } = useAuthStore();
  const [jobs, setJobs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [formData, setFormData] = useState({
    title: '', companyName: '', location: '', salaryRange: '', jobType: 'Full-time', description: ''
  });

  useEffect(() => {
    api.get('/jobs/employer')
      .then(r => setJobs(r.data.jobs || []))
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  const handlePostJob = async () => {
    try {
      await api.post('/jobs', formData);
      toast.success('Job posted successfully!');
      setIsModalOpen(false);
      // Refresh jobs
      const res = await api.get('/jobs/employer');
      setJobs(res.data.jobs);
    } catch (_) { toast.error('Failed to post job'); }
  };

  if (loading) return <div className="flex justify-center py-24"><Spinner size={24} /></div>;

  return (
    <div className="space-y-8 animate-fade-in">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div>
          <h1 className="text-3xl font-display font-black tracking-tight">Employer Dashboard</h1>
          <p className="text-muted-foreground font-mono text-xs mt-1">// recruit top technical talent verified by SkillForge</p>
        </div>
        <Button variant="primary" onClick={() => setIsModalOpen(true)}>
          <Icons.Plus size={16} /> Post New Role
        </Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <StatCard label="Active Roles" value={jobs.length} icon={<Icons.Briefcase size={20} />} />
        <StatCard label="Total Applicants" value="142" icon={<Icons.Users size={20} />} trend={12} />
        <StatCard label="Average Match" value="82%" icon={<Icons.Target size={20} />} />
      </div>

      <div className="space-y-4">
        <h2 className="text-xl font-bold font-display">Manage Postings</h2>
        <div className="grid grid-cols-1 gap-4">
          {jobs.map(job => (
            <Card key={job.id} className="flex flex-col md:flex-row md:items-center justify-between gap-6">
              <div>
                <h3 className="font-bold text-lg">{job.title}</h3>
                <p className="text-sm text-muted-foreground">{job.location} • {job.jobType}</p>
              </div>
              <div className="flex items-center gap-6">
                <div className="text-right">
                  <p className="text-xs font-mono text-muted-foreground uppercase tracking-widest">Applications</p>
                  <p className="font-bold text-lg">{job._count?.applications || 0}</p>
                </div>
                <Button variant="secondary" size="sm">View Applicants</Button>
              </div>
            </Card>
          ))}
        </div>
      </div>

      <Modal open={isModalOpen} onClose={() => setIsModalOpen(false)} title="Post a New Job">
        <div className="space-y-4">
          <Input label="Job Title" placeholder="e.g. Senior Full Stack Engineer" value={formData.title} onChange={(e) => setFormData({...formData, title: e.target.value})} />
          <div className="grid grid-cols-2 gap-4">
            <Input label="Company" placeholder="SkillForge Corp" value={formData.companyName} onChange={(e) => setFormData({...formData, companyName: e.target.value})} />
            <Input label="Location" placeholder="Remote / New York" value={formData.location} onChange={(e) => setFormData({...formData, location: e.target.value})} />
          </div>
          <Input label="Description" placeholder="Detailed role responsibilities..." value={formData.description} onChange={(e) => setFormData({...formData, description: e.target.value})} />
          <Button variant="primary" className="w-full" onClick={handlePostJob}>Publish Role</Button>
        </div>
      </Modal>
    </div>
  );
}
