import { useState, useEffect } from 'react';
import { Spinner } from '@/components/ui';
import { Search, Globe, Clock, TrendingUp, ArrowRight, Briefcase } from 'lucide-react';
import api from '@/lib/api';
import { useAuthStore } from '@/store';

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

  if (loading) return (
    <div className="flex justify-center py-24">
      <div className="flex flex-col items-center gap-3">
        <Spinner size={20} className="text-cyber" />
        <span className="font-mono text-[10px] text-[#444] uppercase tracking-[0.2em]">LOADING JOBS...</span>
      </div>
    </div>
  );

  return (
    <div className="max-w-4xl mx-auto pb-16 animate-fade-in">

      {/* Header */}
      <div
        className="flex flex-col md:flex-row md:items-end justify-between gap-5 mb-8 pb-6"
        style={{ borderBottom: '1px solid rgba(255,255,255,0.06)' }}
      >
        <div>
          <div className="flex items-center gap-3 mb-2">
            <div className="w-7 h-7 rounded-[4px] border border-cyber/30 flex items-center justify-center">
              <Briefcase size={13} strokeWidth={1.5} className="text-cyber" />
            </div>
            <span className="font-mono text-[9px] font-black text-[#444] uppercase tracking-[0.25em]">JOB BOARD</span>
          </div>
          <h1 className="font-black text-2xl text-white tracking-tight uppercase">SMART-MATCH JOBS</h1>
          <p className="font-mono text-[11px] text-[#555] mt-1 uppercase tracking-wider">
            // ROLES MATCHED TO YOUR SKILLFORGE XP
          </p>
        </div>

        {/* Search */}
        <div className="relative w-full md:w-72">
          <Search size={13} strokeWidth={1.5} className="absolute left-3 top-1/2 -translate-y-1/2 text-[#444]" />
          <input
            type="text"
            placeholder="SEARCH ROLES OR COMPANIES..."
            className="w-full pl-9 pr-4 py-2.5 rounded-[4px] border border-white/[0.08] bg-white/[0.02] font-mono text-[11px] font-bold text-white placeholder:text-[#333] focus:outline-none focus:border-cyber transition-all duration-150 uppercase tracking-wider"
            value={search}
            onChange={e => setSearch(e.target.value)}
          />
        </div>
      </div>

      {/* Job List */}
      <div className="space-y-2">
        {filteredJobs.length === 0 ? (
          <div
            className="text-center py-20 rounded-[4px] border border-dashed border-white/[0.06]"
            style={{ background: 'rgba(255,255,255,0.01)' }}
          >
            <Briefcase size={24} strokeWidth={1} className="text-[#222] mx-auto mb-3" />
            <p className="font-mono text-[11px] font-bold text-[#444] uppercase tracking-[0.15em]">
              NO ROLES MATCHING YOUR CRITERIA
            </p>
          </div>
        ) : filteredJobs.map((job, idx) => (
          <div
            key={job.id}
            className="blade flex flex-col md:flex-row md:items-center justify-between gap-5 p-5 cursor-pointer hover:border-white/20 transition-all duration-150 group animate-fade-in"
            style={{ animationDelay: `${idx * 0.03}s` }}
          >
            {/* Job Info */}
            <div className="flex gap-4">
              {/* Company Initial */}
              <div
                className="w-12 h-12 rounded-[4px] border border-white/[0.08] flex items-center justify-center font-mono font-black text-lg flex-shrink-0 transition-all duration-150 group-hover:border-cyber/30 group-hover:text-cyber"
                style={{ background: 'rgba(255,255,255,0.02)' }}
              >
                {job.companyName[0]}
              </div>
              <div className="space-y-1 min-w-0">
                <h3 className="font-bold text-base text-white group-hover:text-cyber transition-colors duration-150">
                  {job.title}
                </h3>
                <div className="flex flex-wrap items-center gap-x-4 gap-y-1">
                  <span className="font-mono text-[10px] font-bold text-[#555] flex items-center gap-1.5 uppercase tracking-wider">
                    <Globe size={10} strokeWidth={1.5} />
                    {job.companyName} · {job.location}
                  </span>
                  <span className="font-mono text-[10px] font-bold text-[#555] flex items-center gap-1.5 uppercase tracking-wider">
                    <Clock size={10} strokeWidth={1.5} />
                    {job.jobType}
                  </span>
                  <span className="font-mono text-[10px] font-black text-emerald flex items-center gap-1.5 uppercase tracking-wider">
                    <TrendingUp size={10} strokeWidth={1.5} />
                    {job.salaryRange || 'COMPETITIVE'}
                  </span>
                </div>
              </div>
            </div>

            {/* Match Score */}
            <div className="flex items-center gap-3 md:flex-col md:items-end">
              <div
                className="px-4 py-3 rounded-[4px] border text-center min-w-[90px]"
                style={{
                  border: '1px solid rgba(59,130,246,0.2)',
                  background: 'rgba(59,130,246,0.04)',
                }}
              >
                <p className="font-mono text-[8px] font-black text-cyber uppercase tracking-[0.15em] mb-1">MATCH</p>
                <p className="font-mono font-black text-lg text-cyber">{job.compatibilityScore || 85}%</p>
              </div>
              <button className="btn-primary text-[10px] whitespace-nowrap">
                VIEW <ArrowRight size={11} strokeWidth={1.5} />
              </button>
            </div>
          </div>
        ))}
      </div>

      {filteredJobs.length > 0 && (
        <p className="font-mono text-[10px] text-[#333] text-center mt-8 uppercase tracking-wider">
          {filteredJobs.length} ROLE{filteredJobs.length !== 1 ? 'S' : ''} FOUND
        </p>
      )}
    </div>
  );
}
