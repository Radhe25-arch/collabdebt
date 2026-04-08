import Icons from '@/assets/icons';

export default function SupportPage() {
  const faqs = [
    {
      q: 'How do I initialize an educational module?',
      a: 'Navigate to the Catalog via the primary sidebar. Isolate the target architecture or language course, and execute "Enroll Now" to provision your learning environment.'
    },
    {
      q: 'What occurs if criteria for a daily quiz evaluation are unmet?',
      a: 'Quizzes serve as strict tactical assessments. Should you fail to breach the 70% accuracy threshold, you may re-engage the module. Your operational streak remains locked until successful completion.'
    },
    {
      q: 'Are peer-to-peer 1v1 encounters operational?',
      a: 'The Arena is fully operational. Locate an opponent via their unique Username within the Battles sector to initialize a head-to-head tactical deployment.'
    },
    {
      q: 'How can credentials be reinstated?',
      a: 'If primary auth fails, forward a request to our Technical Operations division. Automated credential recovery is scheduled for the next major rollout.'
    }
  ];

  return (
    <div className="max-w-3xl mx-auto py-8 animate-fade-in">
      <div className="text-center mb-16">
        <div className="w-16 h-16 rounded-[4px] border border-cyber/30 bg-cyber/[0.08] text-cyber flex items-center justify-center mx-auto mb-6 shadow-[0_0_15px_rgba(59,130,246,0.15)]">
          <Icons.Shield size={30} strokeWidth={1.5} />
        </div>
        <h1 className="font-mono text-3xl font-black text-white tracking-[0.2em] uppercase mb-4">Command Center Support</h1>
        <p className="text-[#888] font-mono text-[13px] max-w-xl mx-auto leading-relaxed mt-2">
          Require operational assistance? Consult the system documentation below or transmit a request to the Technical Operations division.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-16">
        <div className="bg-[#050505] p-8 rounded-[4px] border border-white/[0.08] hover:border-white/[0.15] transition-all group cursor-default">
          <div className="w-10 h-10 rounded-[4px] border border-emerald/30 bg-emerald/[0.08] text-emerald flex items-center justify-center mb-5">
            <Icons.Globe size={20} strokeWidth={1.5} />
          </div>
          <h3 className="font-mono font-black text-[13px] text-white tracking-widest uppercase mb-2">Global Comms Network</h3>
          <p className="text-[12px] text-[#666] font-mono leading-relaxed mb-6">
            Synchronize with 10,000+ engineers in our secure Discord relay. Discuss architectures, parse bugs, and locate tactical squadmates.
          </p>
          <a href="#" className="font-mono text-[11px] font-black text-emerald hover:text-emerald/80 tracking-widest uppercase flex items-center gap-2 group-hover:gap-3 transition-all">
            INITIALIZE RELAY <Icons.ArrowRight size={12} strokeWidth={2} />
          </a>
        </div>

        <div className="bg-[#050505] p-8 rounded-[4px] border border-white/[0.08] hover:border-white/[0.15] transition-all group relative overflow-hidden cursor-default">
          <div className="absolute top-0 right-0 w-32 h-32 bg-cyber/5 rounded-full blur-2xl -mr-10 -mt-10 pointer-events-none" />
          <div className="w-10 h-10 rounded-[4px] border border-cyber/30 bg-cyber/[0.08] text-cyber flex items-center justify-center mb-5 relative z-10">
            <Icons.Terminal size={20} strokeWidth={1.5} />
          </div>
          <h3 className="font-mono font-black text-[13px] text-white tracking-widest uppercase mb-2 relative z-10">Technical Operations</h3>
          <p className="text-[12px] text-[#666] font-mono leading-relaxed mb-6 relative z-10">
            Encountered a critical anomaly or compiler fault? Transmit direct telemetry to engineering for immediate escalation and resolution.
          </p>
          <a href="mailto:support@skillforge.io" className="font-mono text-[11px] font-black text-cyber hover:text-cyber/80 tracking-widest uppercase flex items-center gap-2 group-hover:gap-3 transition-all relative z-10">
            TRANSMIT REPORT <Icons.ArrowRight size={12} strokeWidth={2} />
          </a>
        </div>
      </div>

      <div className="bg-[#020202] border border-white/[0.08] rounded-[4px] overflow-hidden">
        <div className="px-8 py-6 border-b border-white/[0.06] bg-[#0A0A0A]">
          <h2 className="font-mono text-[13px] font-black text-white tracking-[0.2em] uppercase">System FAQ Database</h2>
        </div>
        <div className="divide-y divide-white/[0.04]">
          {faqs.map((faq, i) => (
            <div key={i} className="p-8 hover:bg-white/[0.02] transition-colors">
              <h3 className="font-mono font-black text-[12px] text-white tracking-wide uppercase mb-3 flex gap-3 leading-relaxed">
                <span className="text-cyber flex-shrink-0 mt-0.5">Q.</span> {faq.q}
              </h3>
              <p className="text-[13px] text-[#888] font-mono leading-relaxed pl-6">{faq.a}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
