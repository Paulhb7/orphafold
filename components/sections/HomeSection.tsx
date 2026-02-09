import React from 'react';
import { Search, Loader2, Dna, Stethoscope, Sparkles, Database, Layers, Binary, Target, Library } from 'lucide-react';
import Loading from '../Loading';

interface HomeSectionProps {
    query: string;
    setQuery: (q: string) => void;
    handleSearch: (e: React.FormEvent) => void;
    loading: boolean;
    logs: string[];
    currentStatus: string;
    loadingStep: number;
    loadingFacts: string[];
    logEndRef: React.RefObject<HTMLDivElement>;
}

const HomeSection: React.FC<HomeSectionProps> = ({
    query,
    setQuery,
    handleSearch,
    loading,
    logs,
    currentStatus,
    loadingStep,
    loadingFacts,
    logEndRef
}) => {
    return (
        <div className="max-w-4xl mx-auto">
            <style>{`
            @media print {
            nav, .no-print, footer, .bg-grid, .scientific-bg { display: none !important; }
            body { background: white !important; color: black !important; padding: 0 !important; }
            .max-w-4xl { max-width: 100% !important; margin: 0 !important; }
            .report-section { break-inside: avoid; border: 1px solid #eee !important; margin-bottom: 2rem !important; }
            .text-4xl { font-size: 1.8rem !important; }
            .text-xl { font-size: 1rem !important; }
            .p-10 { padding: 1.2rem !important; }
            .rounded-[32px] { border-radius: 8px !important; }
            .shadow-sm { box-shadow: none !important; }
            .italic { color: #333 !important; border-left: 2px solid #ccc !important; }
            }
        `}</style>

            <div className="text-center mb-16 pt-8 no-print">
                <h2 className="text-4xl font-black mb-6 tracking-tighter text-[#001a3d] leading-tight">
                    A <span className="text-[#0061ff]">Multi-Agent Research Catalyst</span> for Rare Diseases.
                </h2>

                <form onSubmit={handleSearch} className="relative group w-full max-w-5xl mx-auto mb-10">
                    <div className="absolute -inset-1 bg-gradient-to-r from-[#0061ff] to-[#00f5d4] rounded-[24px] blur-2xl opacity-10 group-focus-within:opacity-20 transition duration-1000"></div>
                    <div className="relative flex items-center bg-white border border-slate-200 rounded-[20px] p-1.5 shadow-sm focus-within:ring-4 ring-blue-500/10 transition-all">
                        <Search className="ml-5 text-slate-400" size={20} />
                        <input
                            type="text"
                            value={query}
                            onChange={(e) => setQuery(e.target.value)}
                            placeholder="Search orphan pathology (e.g. Fabry disease, Pompe disease, Gaucher disease)..."
                            className="w-full bg-transparent border-none outline-none px-5 py-5 text-[#001a3d] font-semibold text-lg placeholder:text-slate-300"
                            disabled={loading}
                        />
                        <button
                            type="submit"
                            disabled={loading || !query.trim()}
                            className="bg-[#001a3d] text-white px-10 py-5 rounded-[16px] font-bold text-sm transition-all flex items-center gap-2 hover:bg-black active:scale-95 disabled:opacity-50"
                        >
                            {loading ? <Loader2 className="animate-spin" size={18} /> : "Run Agents"}
                        </button>
                    </div>
                </form>

                {/* Example Disease Buttons */}
                {!loading && (
                    <div className="flex flex-wrap justify-center gap-2 mb-6">
                        <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest self-center mr-2">Try:</span>
                        {["Duchenne Muscular Dystrophy", "Fabry Disease", "Pompe Disease", "Gaucher Disease", "Huntington Disease"].map((disease) => (
                            <button
                                key={disease}
                                onClick={() => setQuery(disease)}
                                className="px-4 py-2 bg-slate-100 hover:bg-[#0061ff] hover:text-white text-slate-600 rounded-full text-xs font-bold transition-all border border-slate-200 hover:border-[#0061ff]"
                            >
                                {disease}
                            </button>
                        ))}
                    </div>
                )}

                {!loading && (
                    <div className="space-y-6">
                        <div className="bg-gradient-to-br from-slate-50 to-blue-50/30 border-2 border-slate-200 rounded-[24px] p-6 max-w-4xl mx-auto shadow-sm">
                            <div className="text-center mb-6">
                                <h3 className="text-sm font-black text-slate-400 uppercase tracking-wider flex items-center justify-center gap-2">
                                    <span className="w-2 h-2 rounded-full bg-[#0061ff] animate-pulse"></span>
                                    3 Agents Working Together
                                    <span className="w-2 h-2 rounded-full bg-[#0061ff] animate-pulse"></span>
                                </h3>
                            </div>
                            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                                {[
                                    { icon: <Dna size={18} />, title: "Biology Agent", desc: "AlphaFold + UniProt structural mapping" },
                                    { icon: <Stethoscope size={18} />, title: "Clinical Agent", desc: "ClinicalTrials.gov pipeline scanning" },
                                    { icon: <Sparkles size={18} />, title: "Discovery Agent", desc: "In-silico repurposing hypotheses" }
                                ].map((step, idx) => (
                                    <div key={idx} className="bg-white border border-slate-100 rounded-2xl p-5 shadow-sm hover:shadow-md transition-all group text-center">
                                        <div className="w-10 h-10 rounded-xl bg-slate-50 text-[#0061ff] flex items-center justify-center mb-3 group-hover:scale-105 group-hover:bg-[#001a3d] group-hover:text-white transition-all mx-auto">
                                            {step.icon}
                                        </div>
                                        <h4 className="text-xs font-black mb-1 uppercase tracking-tight text-[#001a3d]">{step.title}</h4>
                                        <p className="text-[10px] text-slate-400 leading-snug font-medium">{step.desc}</p>
                                    </div>
                                ))}
                            </div>

                            <div className="mt-6 pt-6 border-t border-slate-200">
                                <div className="text-center mb-4">
                                    <h4 className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Powered by Data Sources</h4>
                                </div>
                                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-6 gap-3 max-w-3xl mx-auto">
                                    {[
                                        { id: 'orphanet', icon: <Database size={12} />, name: 'Orphanet', desc: 'Rare Disease Portal' },
                                        { id: 'uniprot', icon: <Dna size={12} />, name: 'UniProt', desc: 'Protein Knowledge' },
                                        { id: 'ncbigene', icon: <Binary size={12} />, name: 'NCBI Gene', desc: 'Genomic Context' },
                                        { id: 'clinvar', icon: <Target size={12} />, name: 'ClinVar', desc: 'Genomic Variants' },
                                        { id: 'alphafold', icon: <Layers size={12} />, name: 'AlphaFold', desc: '3D Structures' },
                                        { id: 'pubmed', icon: <Library size={12} />, name: 'PubMed', desc: 'Research Papers' }
                                    ].map(src => (
                                        <div key={src.id} className="flex flex-col items-center p-3 bg-white/70 border border-slate-100 rounded-xl hover:shadow-sm transition-all">
                                            <div className="text-blue-500 mb-1">{src.icon}</div>
                                            <span className="text-[9px] font-black uppercase text-[#001a3d] tracking-wider text-center">{src.name}</span>
                                            <span className="text-[7px] text-slate-400 font-bold uppercase text-center">{src.desc}</span>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        </div>
                    </div>
                )}


                {(loading || logs.length > 0) && (
                    <div className="mt-12 space-y-4">
                        {/* 1. Log Console First */}
                        <div className="bg-[#001a3d] rounded-[24px] overflow-hidden shadow-2xl max-w-4xl mx-auto border border-white/10 text-left">
                            <div className="bg-white/5 px-6 py-3 border-b border-white/5 flex items-center justify-between">
                                <div className="flex items-center gap-2 text-[#00f5d4]">
                                    <div className="w-2 h-2 rounded-full bg-[#00f5d4] animate-pulse" />
                                    <span className="text-[10px] font-black uppercase tracking-widest">Active Discovery Stream</span>
                                </div>
                                <div className="flex gap-1.5">
                                    <div className="w-2 h-2 rounded-full bg-red-500/50" />
                                    <div className="w-2 h-2 rounded-full bg-yellow-500/50" />
                                    <div className="w-2 h-2 rounded-full bg-green-500/50" />
                                </div>
                            </div>
                            <div className="p-6 h-[240px] overflow-y-auto mono text-[11px] leading-relaxed text-slate-300 custom-scrollbar">
                                {logs.map((log, i) => {
                                    const isThought = log.includes('💭');
                                    const displayLog = log.replace('💭', '');

                                    return (
                                        <div key={i} className={`mb-1.5 flex items-start gap-3 ${isThought ? 'bg-purple-500/10 rounded px-2 py-1 border-l-2 border-purple-400' : ''}`}>
                                            <span className="text-[#00f5d4] opacity-40 font-bold">[{new Date().toLocaleTimeString([], { hour12: false })}]</span>
                                            <span className="flex-1">
                                                {isThought && <span className="text-purple-300 mr-2">🧠</span>}
                                                {displayLog}
                                            </span>
                                        </div>
                                    );
                                })}
                                {loading && (
                                    <div className="mt-2 flex items-center gap-2 text-[#00f5d4] animate-pulse">
                                        <span className="w-1.5 h-3 bg-[#00f5d4]" />
                                        <span className="italic">Processing biological data packets...</span>
                                    </div>
                                )}
                                <div ref={logEndRef} />
                            </div>
                            <div className="px-6 py-3 bg-white/5 flex items-center gap-3">
                                <div className="flex-1 h-0.5 bg-white/10 rounded-full overflow-hidden">
                                    <div className="h-full bg-[#0061ff] animate-progress-loading" />
                                </div>
                                <span className="text-[8px] font-bold text-white/20 uppercase tracking-[0.2em]">Agent Thinking</span>
                            </div>
                        </div>

                        {/* 2. Compact Loading Component Below */}
                        <Loading
                            status={currentStatus}
                            step={loadingStep}
                            facts={loadingFacts}
                        />
                    </div>
                )}
            </div>
        </div>
    );
};

export default HomeSection;
