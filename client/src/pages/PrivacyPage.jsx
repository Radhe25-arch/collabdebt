export default function PrivacyPage() {
  return (
    <div className="max-w-3xl mx-auto py-10 animate-fade-in">
      <div className="mb-12 border-b border-white/[0.08] pb-8">
        <h1 className="font-mono text-3xl font-black text-white tracking-[0.2em] uppercase mb-3">Privacy Protocol</h1>
        <p className="text-[#888] font-mono text-[11px] uppercase tracking-widest flex items-center gap-2">
          <span className="w-1.5 h-1.5 rounded-full bg-cyber animate-pulse"></span>
          LAST UPDATED: MARCH 30, 2026
        </p>
      </div>

      <div className="bg-[#050505] border border-white/[0.08] rounded-[4px] p-8 lg:p-12 prose prose-invert max-w-none text-[#888] font-sans text-[14px] leading-relaxed space-y-10 shadow-xl">
        <section>
          <h2 className="text-lg font-mono font-black text-white tracking-widest uppercase mb-5 flex items-center gap-3">
            <span className="text-cyber">01.</span> DATA ACQUISITION
          </h2>
          <p className="mb-4">
            At SkillForge, we acquire telemetry and identity payloads you transmit to our systems upon account generation, profile updates, IDE operations, or direct communications.
          </p>
          <ul className="list-none pl-0 space-y-3 font-mono text-[12px]">
            <li className="flex gap-3"><span className="text-cyber opacity-70">{">>"}</span><span><strong className="text-white">IDENTITY PAYLOAD:</strong> Handle, encrypted credentials, and visual identifier.</span></li>
            <li className="flex gap-3"><span className="text-cyber opacity-70">{">>"}</span><span><strong className="text-white">TACTICAL DATA:</strong> Module progression, compiler outputs, assessment results, and XP accumulation.</span></li>
            <li className="flex gap-3"><span className="text-cyber opacity-70">{">>"}</span><span><strong className="text-white">SYSTEM TELEMETRY:</strong> Interaction endpoints, dwell time, and navigation routing.</span></li>
          </ul>
        </section>

        <section>
          <h2 className="text-lg font-mono font-black text-white tracking-widest uppercase mb-5 flex items-center gap-3">
            <span className="text-cyber">02.</span> DATA UTILIZATION
          </h2>
          <p className="mb-4">
            System inputs are strictly utilized for provisioning and optimizing your interface. Specific utilization parameters include:
          </p>
          <ul className="list-none pl-0 space-y-3 font-mono text-[12px]">
            <li className="flex gap-3"><span className="text-cyber opacity-70">{">>"}</span>Provisioning algorithmic module recommendations and AI Logic Hub responses.</li>
            <li className="flex gap-3"><span className="text-cyber opacity-70">{">>"}</span>Secure evaluation and compilation of user-generated scripts.</li>
            <li className="flex gap-3"><span className="text-cyber opacity-70">{">>"}</span>Synchronization of the global leaderboard and 1v1 matchmaking engine.</li>
            <li className="flex gap-3"><span className="text-cyber opacity-70">{">>"}</span>Transmission of critical system alerts and patch notes.</li>
          </ul>
        </section>

        <section>
          <h2 className="text-lg font-mono font-black text-white tracking-widest uppercase mb-5 flex items-center gap-3">
            <span className="text-cyber">03.</span> SECURITY & DISTRIBUTION
          </h2>
          <p className="mb-4">
            SkillForge guarantees <strong className="text-white">zero commerce</strong> of personal data points. We transmit obfuscated script payloads to sandboxed execution environments strictly for remote compilation operations. We enforce military-grade encryption in transit, but acknowledge that zero global networks are impervious.
          </p>
        </section>

        <section>
          <h2 className="text-lg font-mono font-black text-white tracking-widest uppercase mb-5 flex items-center gap-3">
            <span className="text-cyber">04.</span> OPERATIVE RIGHTS
          </h2>
          <p className="mb-4">
            Based on your global locus, you retain full operational rights over your data. Identity purging and corrections can be executed via System Settings or by transmitting an email relay to <a href="mailto:privacy@skillforge.io" className="text-cyber hover:text-white transition-colors border-b border-cyber/30 hover:border-white">privacy@skillforge.io</a>.
          </p>
        </section>

        <div className="pt-8 mt-10 border-t border-white/[0.08] flex items-center justify-between font-mono">
          <p className="text-[10px] uppercase text-[#555] tracking-[0.2em] font-bold">SKILLFORGE GLOBAL OPS LTD.</p>
          <a href="/support" className="text-[10px] text-cyber hover:text-white font-black uppercase tracking-[0.1em] transition-colors">INITIALIZE SUPPORT</a>
        </div>
      </div>
    </div>
  );
}
