import React, { useState } from 'react';
import { Home, FileText, ScrollText, Github, Share2 } from 'lucide-react';
import { useDeepSearch } from './hooks/useDeepSearch';

import HomeSection from './components/sections/HomeSection';
import EthicsSection from './components/sections/EthicsSection';
import DocumentationSection from './components/sections/DocumentationSection';
import ReportSection from './components/sections/ReportSection';

const App: React.FC = () => {
  const [view, setView] = useState<'home' | 'mission' | 'documentation' | 'ethics'>('home');
  const {
    query,
    setQuery,
    state,
    repurposingLoading,
    handleSearch,
    handleRepurposingGeneration,
    resetSearch
  } = useDeepSearch();

  const logEndRef = React.useRef<HTMLDivElement>(null);
  React.useEffect(() => {
    if (logEndRef.current) logEndRef.current.scrollIntoView({ behavior: 'smooth' });
  }, [state.logs]);

  // Derived state for loading UI
  const currentStatus = state.logs.length > 0 ? state.logs[state.logs.length - 1] : "Initializing...";
  const loadingFacts = [
    "80% of rare diseases have a genetic origin.",
    "AlphaFold has predicted 3D structures for nearly all cataloged proteins.",
    "Orphan drugs are pharmaceuticals developed specifically for rare conditions.",
    "There are over 7,000 known rare diseases affecting 300 million people.",
    "Gemini models can reason across millions of medical papers in seconds.",
    "ClinVar aggregates information about genomic variation and human health.",
  ];

  let loadingStep = 1;
  const logString = state.logs.join(" ");
  if (logString.includes("Clinical Agent")) loadingStep = 2;
  if (logString.includes("Bio-Mechanism Agent")) loadingStep = 3;
  if (logString.includes("Discovery Agent") || logString.includes("Compiling")) loadingStep = 4;

  const handleLogoClick = () => {
    setView('home');
    resetSearch();
  };

  return (
    <div className="min-h-screen bg-slate-50 selection:bg-[#00f5d4] selection:text-[#001a3d] font-sans text-slate-800">

      {/* Background Grids */}
      <div className="fixed inset-0 z-0 pointer-events-none bg-grid opacity-[0.03]"></div>
      <div className="fixed inset-0 z-0 pointer-events-none bg-gradient-to-b from-white via-transparent to-slate-50/50"></div>

      {/* Navbar */}
      <nav className="sticky top-0 z-50 bg-white/80 backdrop-blur-xl border-b border-slate-200">
        <div className="max-w-7xl mx-auto px-6 h-16 flex items-center justify-between">
          <div
            className="flex items-center gap-3 cursor-pointer group"
            onClick={handleLogoClick}
          >
            <span className="text-3xl group-hover:scale-110 transition-transform">🧬</span>
            <div className="flex flex-col">
              <h1 className="text-xl font-black tracking-tighter text-[#001a3d] leading-none">
                Orpha<span className="text-[#0061ff]">fold</span>
              </h1>
              <span className="text-[10px] font-bold tracking-wide text-slate-500 uppercase">
                Genetic Structural Intelligence
              </span>
            </div>
          </div>

          <div className="flex items-center gap-1 bg-slate-100/50 p-1 rounded-full border border-slate-200/50 no-print">
            {[
              { id: 'home', label: 'Research', icon: <Home size={14} /> },
              { id: 'documentation', label: 'How it Works', icon: <FileText size={14} /> },
              { id: 'ethics', label: 'Ethics', icon: <ScrollText size={14} /> },
            ].map((item) => (
              <button
                key={item.id}
                onClick={() => setView(item.id as any)}
                className={`flex items-center gap-2 px-4 py-1.5 rounded-full text-[11px] font-bold transition-all ${view === item.id
                  ? 'bg-white text-[#001a3d] shadow-sm ring-1 ring-slate-200'
                  : 'text-slate-500 hover:text-slate-700'
                  }`}
              >
                {item.icon} {item.label}
              </button>
            ))}
          </div>

          <div className="flex items-center gap-3 no-print">
            <a href="https://github.com/Paulhb7/orphafold" target="_blank" rel="noreferrer" className="p-2 text-slate-400 hover:text-[#001a3d] transition-colors">
              <Github size={20} />
            </a>
            <button className="bg-[#001a3d] text-white px-4 py-2 rounded-xl text-xs font-bold transition-all hover:bg-black active:scale-95 shadow-lg shadow-blue-900/10 hidden md:flex items-center gap-2">
              <Share2 size={14} /> Share
            </button>
          </div>
        </div>
      </nav>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-6 py-10 relative z-10 min-h-[calc(100vh-4rem)]">

        {view === 'home' && !state.insight && (
          <HomeSection
            query={query}
            setQuery={setQuery}
            handleSearch={handleSearch}
            loading={state.loading}
            logs={state.logs}
            currentStatus={currentStatus}
            loadingStep={loadingStep}
            loadingFacts={loadingFacts}
            logEndRef={logEndRef}
          />
        )}

        {
          view === 'home' && state.insight && (
            <ReportSection
              insight={state.insight}
              repurposingLoading={repurposingLoading}
              handleRepurposingGeneration={handleRepurposingGeneration}
            />
          )
        }

        {view === 'ethics' && <EthicsSection />}
        {view === 'documentation' && <DocumentationSection />}

      </main>

      {/* Footer */}
      <footer className="border-t border-slate-200 bg-white z-10 relative py-12">
        <div className="max-w-7xl mx-auto px-6 flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="flex items-center gap-2 opacity-50 grayscale hover:grayscale-0 transition-all">
            <span className="text-[10px] font-black uppercase tracking-widest text-slate-400">Powered by</span>
            <div className="flex items-center gap-2">
              <span className="font-bold text-slate-600 text-xs">Google Gemini</span>
              <span className="font-bold text-slate-600 text-xs">+</span>
              <span className="font-bold text-slate-600 text-xs">AlphaFold</span>
            </div>
          </div>
          <p className="text-[10px] font-medium text-slate-400 text-center md:text-right">
            &copy; 2025 Orphafold Research Collective. Open Source Intelligence for Rare Diseases.
          </p>
        </div>
      </footer>
    </div>
  );
};

export default App;
