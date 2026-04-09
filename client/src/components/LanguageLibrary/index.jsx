import React, { useState, useMemo } from 'react';
import { LayoutGrid, Binary, Info, Search } from 'lucide-react';
import FilterBar from './FilterBar';
import LanguageCard from './LanguageCard';
import TechTree from './TechTree';
import LanguageDetailPanel from './LanguageDetailPanel';
import { LANGUAGES, PARADIGMS, USAGES, DIFFICULTIES } from '@/data/languages-db';
import api from '@/lib/api';
import toast from 'react-hot-toast';

export default function LanguageLibrary() {
  const [viewMode, setViewMode] = useState('GRID'); // GRID | TREE
  const [selectedLang, setSelectedLang] = useState(null);
  const [filters, setFilters] = useState({
    paradigm: [],
    usage: [],
    difficulty: [],
    search: ''
  });

  const filteredLanguages = useMemo(() => {
    return LANGUAGES.filter(lang => {
      const matchesSearch = lang.name.toLowerCase().includes(filters.search.toLowerCase()) || 
                          lang.description.toLowerCase().includes(filters.search.toLowerCase());
      const matchesParadigm = filters.paradigm.length === 0 || 
                            filters.paradigm.some(p => lang.paradigms.includes(p));
      const matchesUsage = filters.usage.length === 0 || 
                         filters.usage.some(u => lang.usage.includes(u));
      const matchesDifficulty = filters.difficulty.length === 0 || 
                              filters.difficulty.includes(lang.difficulty);
      
      return matchesSearch && matchesParadigm && matchesUsage && matchesDifficulty;
    });
  }, [filters]);

  const handleStartLearning = async (lang) => {
    try {
      // 1. Initialize course in backend (if missing, creates skeleton)
      const r = await api.get(`/courses/initialize/${lang.id}`);
      const { courseId, slug } = r.data;
      
      // 2. Enroll the user (logic already in backend, but we ensure enrollment here)
      await api.post(`/courses/${slug}/enroll`);
      
      // 3. Navigate directly to the first lesson (FOUNDATION)
      window.location.href = `/courses/${slug}/lesson/foundation`;
    } catch (err) {
      console.error('Initialization Failed:', err);
      toast.error('JIT MODULE INITIALIZATION FAILED');
    }
  };

  return (
    <div className="space-y-6 animate-fade-in relative">
      {/* Header / View Toggle */}
      <div className="flex justify-between items-end pb-4 border-b border-white/[0.08]">
        <div>
          <h2 className="font-mono text-[10px] font-black text-[#555] uppercase tracking-[0.25em] mb-1">PROGRAMMING TAXONOMY</h2>
          <div className="flex items-center gap-3">
            <h1 className="font-black text-3xl text-white uppercase tracking-tight">LANGUAGE LIBRARY</h1>
            <span className="font-mono text-[11px] font-black text-cyber bg-cyber/10 px-2 py-0.5 rounded-[2px] border border-cyber/20">
              {filteredLanguages.length} IDENTIFIED
            </span>
          </div>
        </div>
        
        <div className="flex items-center gap-0 border border-white/[0.08] rounded-[4px] overflow-hidden p-0.5 bg-white/[0.02]">
          <button
            onClick={() => setViewMode('GRID')}
            className={`flex items-center gap-2 px-3 py-2 font-mono text-[9px] font-black transition-all ${
              viewMode === 'GRID' ? 'bg-cyber text-white' : 'text-[#444] hover:text-white'
            }`}
          >
            <LayoutGrid size={12} /> GRID
          </button>
          <button
            onClick={() => setViewMode('TREE')}
            className={`flex items-center gap-2 px-3 py-2 font-mono text-[9px] font-black transition-all ${
              viewMode === 'TREE' ? 'bg-cyber text-white' : 'text-[#444] hover:text-white'
            }`}
          >
            <Binary size={12} /> TECH TREE
          </button>
        </div>
      </div>

      {/* Filter Bar */}
      <FilterBar 
        filters={filters} 
        setFilters={setFilters} 
        paradigmOptions={PARADIGMS}
        usageOptions={USAGES}
        difficultyOptions={DIFFICULTIES}
      />

      {/* Results */}
      {viewMode === 'GRID' ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
          {filteredLanguages.map(lang => (
            <LanguageCard 
              key={lang.id} 
              lang={lang} 
              onClick={setSelectedLang} 
            />
          ))}
          {filteredLanguages.length === 0 && (
            <div className="col-span-full py-20 text-center blade">
              <Info size={32} className="text-[#333] mx-auto mb-4" />
              <p className="font-mono text-xs text-[#555] uppercase tracking-widest">NO MATCHES FOUND FOR THIS SPECIFICATION</p>
            </div>
          )}
        </div>
      ) : (
        <TechTree 
          languages={filteredLanguages} 
          onNodeClick={setSelectedLang} 
        />
      )}

      {/* Detail Slide-out */}
      <LanguageDetailPanel 
        lang={selectedLang} 
        onClose={() => setSelectedLang(null)}
        onStartLearning={handleStartLearning}
      />
    </div>
  );
}
