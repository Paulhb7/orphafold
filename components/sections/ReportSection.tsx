import React, { useState } from 'react';
import { DiseaseInsight } from '../../types';
import {
    Dna, FlaskConical, BookOpen, Lightbulb,
    Printer, Globe, GitBranch, Tag, Microscope,
    Fingerprint as CellIcon, ExternalLink, Zap as ZapIcon,
    Target, Layers, Activity, Box, Pill, Quote, ShieldCheck,
    Link2, GitMerge, Workflow, TrendingUp, Sparkles, Loader2,
    CheckCircle2, BrainCircuit, ArrowRight, Search
} from 'lucide-react';
import MolecularNetwork from '../MolecularNetwork';
import ProteinViewer from '../ProteinViewer';
import ScientificBackground from '../ScientificBackground';

interface ReportSectionProps {
    insight: DiseaseInsight;
    repurposingLoading: boolean;
    handleRepurposingGeneration: () => void;
}

const ReportSection: React.FC<ReportSectionProps> = ({
    insight,
    repurposingLoading,
    handleRepurposingGeneration
}) => {
    const [activeTab, setActiveTab] = useState<'biology-overview' | 'clinical-trials' | 'latest-research' | 'hypothesis-lab'>('biology-overview');

    const downloadPDF = () => {
        window.print();
    };

    const getNetworkData = () => {
        if (!insight) return { nodes: [], links: [] };
        const nodes: any[] = [{ id: 'disease', label: insight.name || 'Unknown Disease', type: 'disease' }];
        const links: any[] = [];

        (insight.targetProteins || []).forEach((p, i) => {
            const pId = `protein-${i}`;
            nodes.push({ id: pId, label: p.name || 'Unknown Protein', type: 'protein' });
            links.push({ source: 'disease', target: pId });
            (p.mutations || []).forEach((m, mIdx) => {
                const mId = `${pId}-var-${mIdx}`;
                const label = m.hgvs || 'Mutation';
                nodes.push({ id: mId, label: label, type: 'variant' });
                links.push({ source: pId, target: mId });
            });
        });

        return { nodes, links };
    };

    const networkData = getNetworkData();

    return (
        <div id="research-report" className="animate-in fade-in slide-in-from-bottom-10 duration-700 pb-32">

            {/* Header Section */}
            <section className="bg-white border border-slate-200 rounded-[32px] p-8 shadow-sm mb-8 flex flex-wrap justify-between items-start gap-6">
                <div className="space-y-4">
                    <h3 className="text-4xl font-black text-[#001a3d] leading-none tracking-tighter">{insight.name}</h3>
                    <div className="flex flex-wrap gap-2">
                        <span className="inline-flex items-center px-4 py-1.5 rounded-full text-[10px] font-black uppercase tracking-widest bg-[#001a3d] text-white">
                            ORPHA: {insight.orphanetId || "N/A"}
                        </span>
                        {insight.omimId && (
                            <span className="inline-flex items-center px-4 py-1.5 rounded-full text-[10px] font-black uppercase tracking-widest bg-slate-100 text-slate-700 border border-slate-200">
                                OMIM: {insight.omimId}
                            </span>
                        )}
                    </div>
                </div>
                <div className="flex gap-2">
                    <button onClick={downloadPDF} className="bg-slate-50 text-slate-600 px-4 py-2 rounded-xl text-[9px] font-black uppercase tracking-widest hover:bg-slate-100 transition-all flex items-center gap-2 border border-slate-200">
                        <Printer size={14} /> Export Report
                    </button>
                </div>
            </section>

            {/* Navigation Tabs */}
            <div className="flex flex-wrap gap-2 mb-10 border-b border-slate-100 pb-1 sticky top-24 bg-white/95 backdrop-blur z-40 py-2 no-print">
                {[
                    { id: 'biology-overview', label: 'Biology Overview', icon: <Dna size={14} /> },
                    { id: 'clinical-trials', label: 'Clinical Trials', icon: <FlaskConical size={14} /> },
                    { id: 'latest-research', label: 'Latest Research', icon: <BookOpen size={14} /> },
                    { id: 'hypothesis-lab', label: 'Hypothesis Lab', icon: <Lightbulb size={14} /> },
                ].map((tab) => (
                    <button
                        key={tab.id}
                        onClick={() => setActiveTab(tab.id as any)}
                        className={`flex items-center gap-2 px-6 py-3 rounded-t-xl text-[10px] font-black uppercase tracking-widest transition-all ${activeTab === tab.id
                            ? 'bg-slate-50 text-[#0061ff] border-b-2 border-[#0061ff]'
                            : 'text-slate-400 hover:text-slate-600 hover:bg-slate-50/50'
                            }`}
                    >
                        {tab.icon} {tab.label}
                    </button>
                ))}
            </div>

            <div className="space-y-8">

                {/* 1. BIOLOGY OVERVIEW */}
                {activeTab === 'biology-overview' && (
                    <div className="space-y-8 animate-in fade-in zoom-in-95 duration-300">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div className="bg-[#f8fafc] p-8 rounded-[32px] border border-slate-100">
                                <h4 className="flex items-center gap-2 text-[11px] font-black text-slate-900 uppercase tracking-[0.2em] mb-4">
                                    <Globe size={16} className="text-[#0061ff]" /> Prevalence
                                </h4>
                                <p className="text-xl font-black text-[#001a3d]">{insight.prevalence}</p>
                            </div>
                            <div className="bg-[#f8fafc] p-8 rounded-[32px] border border-slate-100">
                                <h4 className="flex items-center gap-2 text-[11px] font-black text-slate-900 uppercase tracking-[0.2em] mb-4">
                                    <GitBranch size={16} className="text-emerald-500" /> Inheritance
                                </h4>
                                <p className="text-xl font-black text-[#001a3d]">{insight.inheritance}</p>
                            </div>
                        </div>

                        <section className="bg-white border border-slate-200 rounded-[32px] p-10 shadow-sm space-y-8">
                            <div className="space-y-4">
                                <h4 className="flex items-center gap-3 text-[11px] font-black text-slate-900 uppercase tracking-[0.4em]">
                                    <Tag size={16} className="text-[#0061ff]" />
                                    Taxonomy & Clinical Classification
                                </h4>
                                <p className="text-[#001a3d] leading-relaxed font-bold text-sm tracking-tight italic border-l-4 border-[#0061ff] pl-6 py-2">
                                    "{insight.classificationSummary}"
                                </p>
                            </div>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                {(insight.classification || []).map((cls, i) => (
                                    <div key={i} className="bg-[#f8fafc] rounded-[24px] p-6 border border-slate-100">
                                        <h5 className="font-black text-[#001a3d] text-xs uppercase tracking-tighter mb-4 flex items-center gap-2">
                                            <span className="shrink-0 w-5 h-5 rounded bg-[#001a3d] text-white text-[9px] flex items-center justify-center">{i + 1}</span>
                                            {cls.category}
                                        </h5>
                                        <ul className="space-y-1.5">
                                            {(cls.subgroups || []).map((sub, si) => (
                                                <li key={si} className="flex items-start gap-2 text-slate-500 text-[11px] font-bold">
                                                    <div className="mt-1.5 w-1 h-1 rounded-full bg-slate-200 shrink-0" />
                                                    {sub}
                                                </li>
                                            ))}
                                        </ul>
                                    </div>
                                ))}
                            </div>
                        </section>

                        <section className="bg-white border border-slate-200 rounded-[32px] p-10 shadow-sm space-y-6">
                            <h4 className="flex items-center gap-2 text-[11px] font-black text-slate-900 uppercase tracking-[0.4em]">
                                <Microscope size={16} className="text-[#0061ff]" />
                                Pathogenesis & Mechanism
                            </h4>
                            <p className="text-[#001a3d] leading-relaxed font-bold text-base italic tracking-tight border-l-4 border-[#0061ff] pl-6 py-2">
                                "{insight.molecularMechanism}"
                            </p>
                        </section>

                        <section className="bg-white border border-slate-200 rounded-[32px] p-10 shadow-sm space-y-8">
                            <div className="space-y-4">
                                <h4 className="flex items-center gap-2 text-[11px] font-black text-slate-900 uppercase tracking-[0.4em]">
                                    <CellIcon size={16} className="text-purple-500" />
                                    Cellular Vulnerability
                                </h4>
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                    <div className="space-y-4">
                                        <div>
                                            <span className="text-[9px] font-black text-slate-400 uppercase tracking-widest block mb-2">Primary Cell Types</span>
                                            <div className="flex flex-wrap gap-2">
                                                {(insight.cellularVulnerability?.cellTypesInvolved || []).map((t, i) => (
                                                    <span key={i} className="px-3 py-1 bg-purple-50 text-purple-700 text-[10px] font-bold rounded-lg border border-purple-100">
                                                        {t}
                                                    </span>
                                                ))}
                                            </div>
                                        </div>
                                    </div>
                                    <div className="space-y-4">
                                        <div>
                                            <span className="text-[9px] font-black text-slate-400 uppercase tracking-widest block mb-2">Vulnerability Factors</span>
                                            <ul className="space-y-1">
                                                {(insight.cellularVulnerability?.keyVulnerabilityFactors || []).map((f, i) => (
                                                    <li key={i} className="text-[11px] text-slate-600 font-bold flex items-start gap-2">
                                                        <div className="w-1 h-1 rounded-full bg-purple-400 mt-1.5 shrink-0" /> {f}
                                                    </li>
                                                ))}
                                            </ul>
                                        </div>
                                    </div>
                                </div>
                                {insight.therapeuticApproaches && insight.therapeuticApproaches.length > 0 && (
                                    <div className="bg-purple-50 border border-purple-100 p-6 rounded-2xl">
                                        <span className="text-[9px] font-black text-purple-400 uppercase tracking-widest block mb-2">Therapeutic Implications</span>
                                        <ul className="space-y-1">
                                            {insight.therapeuticApproaches.map((appr, i) => (
                                                <li key={i} className="text-[11px] text-purple-800 font-bold flex items-start gap-2">
                                                    <div className="w-1 h-1 rounded-full bg-purple-600 mt-1.5 shrink-0" /> {appr}
                                                </li>
                                            ))}
                                        </ul>
                                    </div>
                                )}
                            </div>
                        </section>

                        {/* Interactive Graph */}
                        <MolecularNetwork nodes={networkData.nodes} links={networkData.links} />

                        {/* Structural Proteomics Lab */}
                        <section className="space-y-8">
                            <div className="flex items-center gap-3 px-6">
                                <Microscope size={18} className="text-[#0061ff]" />
                                <h4 className="text-[11px] font-black text-slate-900 uppercase tracking-[0.4em]">Structural Proteomics Lab</h4>
                            </div>
                            <div className="space-y-8">
                                {(insight.targetProteins || []).map((p, idx) => (
                                    <div key={idx} className="bg-white rounded-[24px] p-6 border border-slate-200 shadow-sm relative">
                                        <div className="flex flex-wrap justify-between items-start gap-8 mb-8">
                                            <div className="space-y-1">
                                                <h5 className="text-xl font-black text-[#001a3d] tracking-tighter">{p.name}</h5>
                                                <span className="inline-block mono text-[10px] font-bold text-[#0061ff] bg-blue-50 px-4 py-1 rounded-full border border-blue-100 uppercase">
                                                    UniProt: {p.uniprotId}
                                                </span>
                                            </div>
                                            <a href={`https://alphafold.ebi.ac.uk/entry/${p.uniprotId}`} target="_blank" rel="noreferrer" className="no-print bg-[#001a3d] text-white px-5 py-2.5 rounded-[12px] text-[9px] font-black uppercase tracking-widest hover:scale-105 transition-all flex items-center gap-2">
                                                AlphaFold <ExternalLink size={12} />
                                            </a>
                                        </div>

                                        <div className="grid grid-cols-1 xl:grid-cols-2 gap-10 items-start">
                                            <div className="space-y-6">
                                                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                                    <div className="col-span-1 sm:col-span-2 bg-[#f8fafc] p-6 rounded-[20px] border border-slate-100">
                                                        <div className="flex items-center justify-between mb-3">
                                                            <h6 className="text-[9px] font-black text-slate-400 uppercase tracking-widest flex items-center gap-1"><ZapIcon size={12} className="text-amber-500" /> Molecular Function</h6>
                                                            {p.plddt && (
                                                                <span className={`px-2 py-0.5 rounded text-[8px] font-bold uppercase tracking-wide border ${p.plddt.toLowerCase().includes('high') || p.plddt.includes('9') ? 'bg-green-50 text-green-600 border-green-100' : 'bg-amber-50 text-amber-600 border-amber-100'}`}>
                                                                    pLDDT: {p.plddt}
                                                                </span>
                                                            )}
                                                        </div>
                                                        <p className="text-[12px] text-slate-600 font-bold leading-relaxed italic">
                                                            "{p.molecularFunction || p.function}"
                                                        </p>
                                                    </div>

                                                    <div className="bg-white p-5 rounded-[20px] border border-slate-100 shadow-sm space-y-3">
                                                        <h6 className="text-[9px] font-black text-slate-400 uppercase tracking-widest flex items-center gap-1"><Layers size={12} className="text-blue-500" /> Functional Domains</h6>
                                                        <div className="flex flex-wrap gap-1.5">
                                                            {(p.domains || []).map((dom, di) => (
                                                                <span key={di} className="px-2 py-1 bg-blue-50 text-blue-600 text-[9px] font-bold rounded-lg border border-blue-100">
                                                                    {dom}
                                                                </span>
                                                            ))}
                                                        </div>
                                                    </div>

                                                    <div className="bg-white p-5 rounded-[20px] border border-slate-100 shadow-sm space-y-3">
                                                        <h6 className="text-[9px] font-black text-slate-400 uppercase tracking-widest flex items-center gap-1"><Target size={12} className="text-red-500" /> Therapeutic Potential</h6>
                                                        {p.druggability && (
                                                            <div className="text-[10px] font-bold text-slate-700 bg-red-50/50 p-2 rounded-lg border border-red-50 mb-2">
                                                                {p.druggability}
                                                            </div>
                                                        )}
                                                        <div className="space-y-1">
                                                            <span className="text-[8px] font-bold text-slate-400 uppercase">Interactors</span>
                                                            <div className="flex flex-wrap gap-1">
                                                                {(p.interactionPartners || []).slice(0, 3).map((pt, pi) => (
                                                                    <span key={pi} className="text-[9px] text-slate-500 bg-slate-50 px-1.5 py-0.5 rounded border border-slate-100">{pt}</span>
                                                                ))}
                                                            </div>
                                                        </div>
                                                    </div>

                                                    {p.pathways && p.pathways.length > 0 && (
                                                        <div className="col-span-1 sm:col-span-2 bg-white p-5 rounded-[20px] border border-slate-100 shadow-sm">
                                                            <h6 className="text-[9px] font-black text-slate-400 uppercase tracking-widest flex items-center gap-1 mb-2"><Activity size={12} className="text-emerald-500" /> Signaling Pathways</h6>
                                                            <div className="flex flex-wrap gap-2">
                                                                {p.pathways.map((path, phi) => (
                                                                    <div key={phi} className="flex items-center gap-1.5 text-[10px] text-slate-600 font-bold">
                                                                        <div className="w-1 h-1 rounded-full bg-emerald-400" /> {path}
                                                                    </div>
                                                                ))}
                                                            </div>
                                                        </div>
                                                    )}
                                                </div>

                                                <div className="space-y-3 pt-4 border-t border-slate-50">
                                                    <h6 className="text-[9px] font-black text-slate-400 uppercase tracking-[0.3em] px-2">Pathogenic Variants Mapped</h6>
                                                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 max-h-[160px] overflow-y-auto custom-scrollbar pr-2">
                                                        {(p.mutations || []).map((m, mi) => (
                                                            <a
                                                                key={mi}
                                                                href={m.clinvarId ? `https://www.ncbi.nlm.nih.gov/clinvar/variation/${m.clinvarId}/` : `https://www.ncbi.nlm.nih.gov/clinvar/?term=${m.hgvs}`}
                                                                target="_blank"
                                                                rel="noopener noreferrer"
                                                                className="bg-white px-4 py-3 rounded-[12px] border border-slate-100 shadow-sm hover:border-blue-300 hover:shadow-md transition-all cursor-pointer block group/variant"
                                                            >
                                                                <div className="flex justify-between items-start">
                                                                    <span className="mono text-[10px] font-bold text-[#001a3d] block mb-0.5 group-hover/variant:text-blue-600 transition-colors">
                                                                        {m.hgvs}
                                                                    </span>
                                                                    <ExternalLink size={10} className="text-slate-300 group-hover/variant:text-blue-400" />
                                                                </div>
                                                                <p className="text-[8px] text-slate-400 font-black uppercase tracking-wider">{m.significance || "Pathogenic"}</p>
                                                            </a>
                                                        ))}
                                                    </div>
                                                </div>
                                            </div>

                                            <div className="h-[400px] xl:h-[450px]">
                                                <ProteinViewer uniprotId={p.uniprotId} />
                                                {p.tissueExpression && (
                                                    <div className="mt-4 flex items-center gap-2 justify-center text-[10px] text-slate-400 font-bold uppercase tracking-widest">
                                                        <Box size={12} /> Primary Tissue: {p.tissueExpression}
                                                    </div>
                                                )}
                                            </div>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </section>
                    </div>
                )}

                {/* 2. CLINICAL TRIALS */}
                {activeTab === 'clinical-trials' && (
                    <div className="space-y-8 animate-in fade-in zoom-in-95 duration-300">
                        <section className="bg-white border border-slate-200 rounded-[32px] p-10 shadow-sm space-y-6">
                            <h4 className="flex items-center gap-3 text-[11px] font-black text-slate-900 uppercase tracking-[0.4em]">
                                <FlaskConical size={16} className="text-[#0061ff]" /> Active Recruitment Pipeline
                            </h4>
                            <div className="overflow-x-auto">
                                <table className="w-full text-left border-collapse">
                                    <thead>
                                        <tr className="border-b border-slate-100">
                                            <th className="py-4 text-[9px] font-black text-slate-400 uppercase tracking-widest">ID</th>
                                            <th className="py-4 text-[9px] font-black text-slate-400 uppercase tracking-widest">Title</th>
                                            <th className="py-4 text-[9px] font-black text-slate-400 uppercase tracking-widest">Phase</th>
                                            <th className="py-4 text-[9px] font-black text-slate-400 uppercase tracking-widest">Status</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {(insight.clinicalTrials || []).map((trial, i) => (
                                            <tr key={i} className="border-b border-slate-50 hover:bg-slate-50/50 transition-colors">
                                                <td className="py-4 pr-4 text-[10px] font-mono text-slate-500">{trial.identifier || "N/A"}</td>
                                                <td className="py-4 pr-4">
                                                    <div className="font-bold text-[#001a3d] text-sm leading-snug">{trial.title}</div>
                                                    <div className="text-[10px] text-slate-400 mt-1">{trial.intervention}</div>
                                                </td>
                                                <td className="py-4 pr-4">
                                                    <span className="px-2 py-1 bg-slate-100 text-slate-600 rounded text-[9px] font-bold uppercase tracking-wider">{trial.phase}</span>
                                                </td>
                                                <td className="py-4">
                                                    <span className={`px-2 py-1 rounded text-[9px] font-bold uppercase tracking-wider ${trial.status?.toLowerCase().includes('recruit')
                                                        ? 'bg-emerald-50 text-emerald-600'
                                                        : 'bg-amber-50 text-amber-600'
                                                        }`}>
                                                        {trial.status}
                                                    </span>
                                                </td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>
                            {(!insight.clinicalTrials || insight.clinicalTrials.length === 0) && (
                                <div className="text-center py-10 text-slate-400 text-sm font-medium">No active clinical trials found in registry context.</div>
                            )}
                        </section>

                        <section className="bg-[#001a3d] rounded-[32px] p-10 text-white shadow-2xl relative overflow-hidden space-y-8">
                            <div className="absolute top-0 right-0 w-80 h-80 bg-blue-600/10 blur-[100px] rounded-full -mr-32 -mt-32" />
                            <div className="space-y-4 relative z-10">
                                <h4 className="flex items-center gap-3 text-[11px] font-black text-[#00f5d4] uppercase tracking-[0.4em]">
                                    <Target size={18} />
                                    Clinical Pipeline Analysis
                                </h4>
                                <p className="text-white font-bold text-sm leading-relaxed italic tracking-tight opacity-90 border-l-2 border-[#00f5d4] pl-6 py-2">
                                    "{insight.clinicalTrialsSummary || "Active clinical trials analysis unavailable. Research is likely in preclinical stages or data is restricted."}"
                                </p>
                            </div>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 relative z-10">
                                {(insight.clinicalTrials || []).map((trial, i) => (
                                    <div key={i} className="p-6 bg-white/5 border border-white/10 rounded-[20px] hover:bg-white/10 transition-all space-y-4">
                                        <div className="flex justify-between items-start gap-4">
                                            <a
                                                href={trial.identifier ? `https://clinicaltrials.gov/study/${trial.identifier}` : `https://clinicaltrials.gov/search?term=${encodeURIComponent(trial.title)}`}
                                                target="_blank"
                                                rel="noopener noreferrer"
                                                className="font-black text-white text-[13px] leading-tight tracking-tight hover:text-[#00f5d4] transition-colors underline-offset-4 decoration-[#00f5d4]/30"
                                            >
                                                {trial.title}
                                            </a>
                                            <span className="shrink-0 px-2 py-1 rounded-full text-[7px] font-black uppercase tracking-widest bg-[#00f5d4] text-[#001a3d]">
                                                {trial.phase}
                                            </span>
                                        </div>
                                        <div className="space-y-2">
                                            <div className="flex items-center gap-2">
                                                <span className="px-2 py-0.5 rounded-lg text-[7px] font-black uppercase tracking-widest bg-white/10 text-white/80 border border-white/5">
                                                    {trial.status}
                                                </span>
                                                {trial.identifier && (
                                                    <a
                                                        href={`https://clinicaltrials.gov/study/${trial.identifier}`}
                                                        target="_blank"
                                                        rel="noopener noreferrer"
                                                        className="mono text-[7px] font-bold text-[#00f5d4]/60 uppercase hover:text-[#00f5d4] hover:underline flex items-center gap-1"
                                                    >
                                                        {trial.identifier} <ExternalLink size={8} />
                                                    </a>
                                                )}
                                            </div>
                                            <p className="text-[9px] text-white/60 font-medium leading-relaxed">{trial.intervention}</p>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </section>
                    </div>
                )}

                {/* 3. LATEST RESEARCH */}
                {activeTab === 'latest-research' && (
                    <div className="space-y-8 animate-in fade-in zoom-in-95 duration-300">
                        {insight.researchSynthesis && (
                            <div className="bg-slate-800 text-slate-200 p-8 rounded-[32px] text-sm font-medium leading-relaxed shadow-xl border-l-8 border-[#00f5d4]">
                                <span className="text-[9px] font-black text-slate-500 uppercase tracking-widest block mb-3">AI Research Synthesis</span>
                                "{insight.researchSynthesis}"
                            </div>
                        )}

                        <section className="bg-white border border-slate-200 rounded-[32px] p-10 shadow-sm space-y-8">
                            <div className="space-y-4">
                                <h4 className="flex items-center gap-2 text-[11px] font-black text-slate-900 uppercase tracking-[0.2em]">
                                    <BookOpen size={16} className="text-[#0061ff]" /> Key Research Papers
                                </h4>
                                <p className="text-[#001a3d] leading-relaxed font-bold text-sm tracking-tight italic border-l-4 border-[#0061ff] pl-6 py-2">
                                    "{insight.bibliographySummary}"
                                </p>
                            </div>
                            <div className="space-y-4">
                                {(insight.bibliography || []).map((paper, i) => (
                                    <div key={i} className="flex gap-4 p-6 bg-[#f8fafc] border border-slate-100 rounded-[20px] hover:bg-blue-50/50 transition-colors">
                                        <div className="w-10 h-10 bg-white rounded-lg flex items-center justify-center shrink-0 shadow-sm">
                                            <Quote className="text-slate-200" size={16} />
                                        </div>
                                        <div className="space-y-2 flex-1">
                                            <a href={paper.link} target="_blank" rel="noopener noreferrer" className="font-black text-[#001a3d] text-sm leading-snug tracking-tighter hover:text-blue-600 hover:underline decoration-blue-400 decoration-2 underline-offset-2 transition-all flex items-start gap-2">
                                                {paper.title}
                                                <ExternalLink size={12} className="mt-1 shrink-0 opacity-50" />
                                            </a>
                                            <p className="text-[10px] text-slate-500 font-bold">{paper.authors}</p>
                                            <div className="flex items-center gap-4 text-[8px] font-black uppercase tracking-[0.2em]">
                                                <span className="text-[#0061ff]">{paper.journal}</span>
                                                <span className="text-slate-300">•</span>
                                                <span className="text-slate-500">{paper.year}</span>
                                            </div>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </section>

                        <section className="bg-white border border-slate-200 rounded-[32px] p-10 shadow-sm space-y-6">
                            <h4 className="flex items-center gap-3 text-[11px] font-black text-slate-900 uppercase tracking-[0.4em]">
                                <ShieldCheck size={16} className="text-emerald-500" />
                                Validated Data Sources
                            </h4>
                            <div className="flex flex-wrap gap-2">
                                {(insight.dataSourcesValidated || []).map((src, i) => (
                                    <span key={i} className="px-4 py-2 rounded-xl text-[10px] font-black uppercase tracking-tighter bg-slate-50 text-slate-600 border border-slate-100 flex items-center gap-2">
                                        <div className="w-2 h-2 rounded-full bg-emerald-400" /> {src}
                                    </span>
                                ))}
                            </div>
                            {insight.groundingSources && insight.groundingSources.length > 0 && (
                                <div className="mt-8 pt-8 border-t border-slate-100">
                                    <h5 className="text-[10px] font-black uppercase tracking-widest text-slate-400 mb-4">Web Search Grounding Links</h5>
                                    <div className="grid grid-cols-1 gap-2">
                                        {insight.groundingSources.map((src, i) => (
                                            <a key={i} href={src.uri} target="_blank" rel="noreferrer" className="flex items-center gap-2 text-[10px] font-bold text-blue-500 hover:underline truncate">
                                                <Link2 size={10} /> {src.title}
                                            </a>
                                        ))}
                                    </div>
                                </div>
                            )}
                        </section>
                    </div>
                )}

                {/* 4. HYPOTHESIS LAB */}
                {activeTab === 'hypothesis-lab' && (
                    <div className="space-y-8 animate-in fade-in zoom-in-95 duration-300">
                        {/* Comparative Discovery Lab */}
                        <section className="bg-white border border-slate-200 rounded-[32px] p-10 shadow-sm space-y-8">
                            <div className="space-y-4">
                                <h4 className="flex items-center gap-3 text-[11px] font-black text-slate-900 uppercase tracking-[0.4em]">
                                    <GitMerge size={16} className="text-[#0061ff]" />
                                    Comparative Discovery Lab
                                </h4>
                                <p className="text-[#001a3d] leading-relaxed font-bold text-sm tracking-tight italic border-l-4 border-[#0061ff] pl-6 py-2">
                                    "{insight.crossDiseaseSummary || "Cross-disease structural analysis pending. No direct pathway homologues identified in current sweep."}"
                                </p>
                            </div>
                            <div className="space-y-6">
                                {(insight.crossDiseaseInsights || []).map((cd, i) => (
                                    <div key={i} className="bg-slate-50 border border-slate-200 rounded-[24px] p-8 shadow-sm relative overflow-hidden group hover:shadow-xl transition-all duration-500">
                                        <div className="absolute -top-10 -right-10 w-40 h-40 bg-blue-100 rounded-full opacity-20 blur-3xl pointer-events-none" />

                                        <div className="flex flex-col md:flex-row gap-8 relative z-10">
                                            <div className="md:w-1/4 space-y-6 border-b md:border-b-0 md:border-r border-slate-200 pb-6 md:pb-0 md:pr-6">
                                                <div>
                                                    <span className="text-[9px] font-black text-slate-400 uppercase tracking-widest">Comparative Target</span>
                                                    <h5 className="text-xl font-black text-[#001a3d] leading-none mt-2">{cd.diseaseName}</h5>
                                                </div>

                                                <div>
                                                    <span className="text-[9px] font-black text-slate-400 uppercase tracking-widest">Shared Genetic Loci</span>
                                                    <div className="flex flex-wrap gap-1.5 mt-2">
                                                        {(cd.sharedGenes || []).map((gene, gi) => (
                                                            <span key={gi} className="px-2 py-0.5 bg-[#001a3d] text-white text-[9px] font-bold rounded border border-slate-900">
                                                                {gene}
                                                            </span>
                                                        ))}
                                                    </div>
                                                </div>
                                            </div>

                                            <div className="md:w-3/4 space-y-6">
                                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                                    <div className="space-y-2">
                                                        <h6 className="flex items-center gap-2 text-[10px] font-black text-slate-500 uppercase tracking-widest">
                                                            <Workflow size={12} /> Shared Mechanism
                                                        </h6>
                                                        <p className="text-[12px] font-bold text-[#001a3d] leading-relaxed bg-white p-4 rounded-xl border border-slate-100">
                                                            {cd.sharedMechanism}
                                                        </p>
                                                    </div>

                                                    <div className="space-y-2">
                                                        <h6 className="flex items-center gap-2 text-[10px] font-black text-slate-500 uppercase tracking-widest">
                                                            <GitMerge size={12} className="rotate-90" /> Pathway Intersection
                                                        </h6>
                                                        <div className="bg-white p-4 rounded-xl border border-slate-100 min-h-[80px]">
                                                            {(cd.pathwayOverlap && cd.pathwayOverlap.length > 0) ? (
                                                                <ul className="space-y-1.5">
                                                                    {cd.pathwayOverlap.map((path, pi) => (
                                                                        <li key={pi} className="flex items-center gap-2 text-[10px] font-bold text-slate-600">
                                                                            <div className="w-1.5 h-1.5 rounded-full bg-emerald-400" /> {path}
                                                                        </li>
                                                                    ))}
                                                                </ul>
                                                            ) : (
                                                                <span className="text-[10px] text-slate-300 italic">No specific pathway overlap detected.</span>
                                                            )}
                                                        </div>
                                                    </div>
                                                </div>

                                                {cd.structuralSimilarity && (
                                                    <div className="flex items-start gap-4 p-4 bg-blue-50/50 rounded-xl border border-blue-100">
                                                        <div className="w-8 h-8 rounded-lg bg-blue-100 text-blue-600 flex items-center justify-center shrink-0">
                                                            <Layers size={14} />
                                                        </div>
                                                        <div>
                                                            <h6 className="text-[9px] font-black text-blue-400 uppercase tracking-widest mb-1">Structural Homology Insight</h6>
                                                            <p className="text-[11px] font-bold text-slate-700 leading-snug">{cd.structuralSimilarity}</p>
                                                        </div>
                                                    </div>
                                                )}

                                                <div className="flex items-center justify-between pt-4 border-t border-slate-200">
                                                    <div className="flex items-center gap-2 text-[#001a3d]">
                                                        <Lightbulb size={14} className="text-amber-500" />
                                                        <span className="text-[10px] font-black uppercase tracking-widest">Research Opportunity</span>
                                                    </div>
                                                    <span className="text-[11px] font-bold text-[#0061ff]">{cd.researchOpportunity}</span>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </section>

                        <ScientificBackground
                            insight={insight}
                            loading={repurposingLoading}
                            onGenerateRepurposing={handleRepurposingGeneration}
                        />
                    </div>
                )}

            </div>
        </div>
    );
};

export default ReportSection;
