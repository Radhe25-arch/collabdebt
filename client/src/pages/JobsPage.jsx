import React, { useState, useEffect } from 'react';
import { Button, BadgeTag, Spinner, Input } from '@/components/ui';
import Icons from '@/assets/icons';
import api from '@/lib/api';
import { useAuthStore } from '@/store';
import { motion } from 'framer-motion';

export default function JobsPage() {
  const { user } = useAuthStore();
  const [jobs, setJobs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');

  useEffect(() => {
    api.get('/jobs')
      .then(r => setJobs(r.data.jobs || []))
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  const filteredJobs = jobs.filter(j => 
    j.title.toLowerCase().includes(search.toLowerCase()) || 
    j.companyName.toLowerCase().includes(search.toLowerCase())
  );

  if (loading) return <div className="flex justify-center py-24"><Spinner size={24} /></div>;

  return (
    <div className="space-y-8 animate-fade-in">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div>
          <h1 className="text-3xl font-display font-black tracking-tight">Smart-Match Jobs</h1>
          <p className="text-muted-foreground font-mono text-xs mt-1">// roles matched to your SkillForge XP and DNA</p>
        </div>
        <div className="flex items-center gap-3 w-full md:w-auto">
          <div className="relative flex-1 md:w-64">
            <Icons.Search className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" size={14} />
            <input 
              type="text" 
              placeholder="Search roles or companies..."
              className="w-full bg-secondary border border-border rounded-xl pl-9 pr-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary/20 transition-all"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 gap-4">
        {filteredJobs.length === 0 ? (
          <div className="text-center py-20 bg-secondary/30 rounded-3xl border border-dashed border-border">
            <p className="text-muted-foreground font-mono text-sm">No jobs found matching your criteria</p>
          </div>
        ) : filteredJobs.map((job, idx) => (
          <motion.div 
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: idx * 0.05 }}
            key={job.id} 
            className="sf-card p-6 flex flex-col md:flex-row md:items-center justify-between gap-6 hover:border-primary/50 group cursor-pointer"
          >
            <div className="flex gap-5">
              <div className="w-14 h-14 rounded-2xl bg-primary/5 border border-border flex items-center justify-center text-primary font-bold text-xl shadow-inner group-hover:bg-primary group-hover:text-primary-foreground transition-all duration-300">
                {job.companyName[0]}
              </div>
              <div className="space-y-1">
                <h3 className="font-bold text-lg group-hover:text-primary transition-colors">{job.title}</h3>
                <div className="flex flex-wrap items-center gap-x-4 gap-y-1 text-xs text-muted-foreground font-medium">
                  <span className="flex items-center gap-1.5"><Icons.Globe size={12} /> {job.companyName} • {job.location}</span>
                  <span className="flex items-center gap-1.5"><Icons.Clock size={12} /> {job.jobType}</span>
                  <span className="flex items-center gap-1.5 text-primary font-bold">
                    <Icons.TrendingUp size={12} /> {job.salaryRange || 'Competitive'}
                  </span>
                </div>
              </div>
            </div>

            <div className="flex flex-col items-end gap-3">
              <div className="bg-primary/5 border border-primary/20 px-4 py-3 rounded-2xl flex flex-col items-center justify-center min-w-[100px]">
                <span className="text-[10px] uppercase font-black text-primary tracking-widest leading-none mb-1">Match Score</span>
                <span className="text-lg font-display font-black text-primary">{(job.compatibilityScore || 85)}%</span>
              </div>
              <Button size="sm" variant="primary" className="w-full md:w-auto">View Details</Button>
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  );
}
