import { useState } from 'react';
import { Terminal, Play, Save, RotateCcw, Shield, Code } from 'lucide-react';

export default function LabPage() {
  const [code, setCode] = useState(`// TECHNICAL_LAB_MODULE v1.0
// PURPOSE: SANDBOX ARCHITECTURAL EXPERIMENTATION

function initServer() {
  console.log("SYTEM INITIALIZING...");
  return { status: "OPTIMAL", latency: "14ms" };
}

console.log(initServer());`);

  const [output, setOutput] = useState([]);
  
  const runCode = () => {
    setOutput(["[SYSTEM] INITIALIZING VIRTUAL ENVIRONMENT...", "[SIGNAL] EXECUTING PACKETS..."]);
    // Simple eval simulation for demonstration (No-Bluf)
    try {
      const logs = [];
      const mockConsole = { log: (...args) => logs.push(args.join(' ')) };
      // Wrap in IIFE to capture logs
      new Function('console', code)(mockConsole);
      setTimeout(() => setOutput(prev => [...prev, ...logs, "[SYSTEM] EXECUTION COMPLETE."]), 500);
    } catch (err) {
      setOutput(prev => [...prev, `[ERROR] ${err.message}`]);
    }
  };

  return (
    <div className="max-w-7xl mx-auto space-y-6 animate-fade-in">
      <div className="flex justify-between items-end pb-6 border-b border-white/[0.06]">
        <div>
          <div className="flex items-center gap-3 mb-2">
            <div className="w-7 h-7 rounded-[4px] border border-cyber/30 flex items-center justify-center">
              <Terminal size={14} className="text-cyber" />
            </div>
            <span className="font-mono text-[9px] font-black text-[#444] uppercase tracking-[0.25em]">VIRTUAL SANDBOX</span>
          </div>
          <h1 className="font-black text-3xl text-white tracking-tight uppercase">THE LAB</h1>
          <p className="font-mono text-[11px] text-[#555] font-bold mt-1 uppercase tracking-wider">
            RAW KERNEL EXECUTION ENVIRONMENT
          </p>
        </div>

        <div className="flex gap-2">
           <button 
             onClick={() => setCode('')}
             className="w-10 h-10 flex items-center justify-center border border-white/[0.08] hover:border-crimson/50 text-[#444] hover:text-crimson transition-all rounded-[4px]"
           >
              <RotateCcw size={16} />
           </button>
           <button 
             onClick={runCode}
             className="px-6 py-2 bg-cyber text-white font-mono text-[11px] font-black uppercase tracking-widest rounded-[4px] flex items-center gap-2 hover:bg-[#2563EB] transition-all"
           >
              <Play size={14} fill="white" />
              EXECUTE_SIGNAL
           </button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 h-[600px]">
        {/* Editor */}
        <div className="flex flex-col blade overflow-hidden border-white/[0.08]">
           <div className="px-4 py-2 border-b border-white/[0.08] flex justify-between items-center bg-white/[0.01]">
              <span className="font-mono text-[9px] font-black text-[#444] uppercase tracking-widest">SOURCE_CODE (JS)</span>
              <Code size={12} className="text-[#333]" />
           </div>
           <textarea
             value={code}
             onChange={e => setCode(e.target.value)}
             className="flex-1 bg-transparent p-6 font-mono text-[13px] text-cyber/80 focus:outline-none resize-none placeholder:text-[#222]"
             spellCheck={false}
           />
        </div>

        {/* Console */}
        <div className="flex flex-col bg-[#050505] border border-white/[0.08] rounded-[4px] overflow-hidden">
           <div className="px-4 py-2 border-b border-white/[0.08] flex justify-between items-center bg-white/[0.03]">
              <span className="font-mono text-[9px] font-black text-[#444] uppercase tracking-widest">SYSTEM_OUTPUT</span>
              <Shield size={12} className="text-[#333]" />
           </div>
           <div className="flex-1 p-6 font-mono text-[12px] space-y-2 overflow-y-auto custom-scrollbar">
              {output.map((line, i) => (
                <div key={i} className={`${line.startsWith('[ERROR]') ? 'text-crimson' : line.startsWith('[SYSTEM]') ? 'text-cyber' : 'text-[#888]'}`}>
                   {line}
                </div>
              ))}
              {output.length === 0 && (
                <div className="text-[#222] italic">Awaiting pulse...</div>
              )}
           </div>
        </div>
      </div>
    </div>
  );
}
