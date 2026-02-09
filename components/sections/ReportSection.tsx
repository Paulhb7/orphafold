import React, { useState } from 'react';
import { DiseaseInsight } from '../../types';
import {
    Dna, FlaskConical, BookOpen, Lightbulb,
    Printer, Globe, GitBranch, Tag, Microscope,
    Fingerprint as CellIcon
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
    const [activeTab, setActiveTab] = useState<'biology-overview' | 'clinical-trials' | 'bibliography' | 'hypothesis-lab'>('biology-overview');

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
                    { id: 'bibliography', label: 'Bibliography', icon: <BookOpen size={14} /> },
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

                        {/* Target Proteins Carousel */}
                        {insight.targetProteins && (insight.targetProteins.length > 0) && (
                            <section>
                                <h4 className="flex items-center gap-2 text-[11px] font-black text-slate-900 uppercase tracking-[0.4em] mb-6 pl-4 border-l-4 border-blue-500">
                                    Identified Protein Targets ({insight.targetProteins.length})
                                </h4>
                                <div className="grid grid-cols-1 gap-8">
                                    {insight.targetProteins.map((protein, idx) => (
                                        <div key={idx} className="bg-white border border-slate-200 rounded-[32px] overflow-hidden shadow-sm flex flex-col md:flex-row">
                                            <div className="md:w-1/3 bg-slate-50 p-6 border-r border-slate-100 flex flex-col">
                                                <div className="mb-6">
                                                    <div className="flex items-center justify-between mb-2">
                                                        <span className="text-[9px] font-black text-slate-400 uppercase tracking-widest">Target Name</span>
                                                        <span className="px-2 py-0.5 bg-blue-100 text-blue-700 text-[9px] font-bold rounded uppercase">{protein.uniprotId}</span>
                                                    </div>
                                                    <h3 className="text-xl font-black text-[#001a3d] leading-tight mb-2">{protein.name}</h3>
                                                    <p className="text-xs text-slate-500 font-medium leading-relaxed">{protein.function}</p>
                                                </div>

                                                <div className="space-y-4 mt-auto">
                                                    <div>
                                                        <span className="text-[8px] font-black text-slate-400 uppercase tracking-widest block mb-1">Druggability</span>
                                                        <div className="h-1.5 w-full bg-slate-200 rounded-full overflow-hidden">
                                                            <div className="h-full bg-emerald-500 w-[85%]" />
                                                        </div>
                                                        <span className="text-[9px] font-bold text-emerald-600 mt-1 block">{protein.druggability || "Small Molecule / Biologic"}</span>
                                                    </div>
                                                </div>
                                            </div>

                                            <div className="md:w-1/3 p-6 border-r border-slate-100 space-y-6">
                                                <div>
                                                    <span className="text-[9px] font-black text-slate-400 uppercase tracking-widest block mb-1">Molecular Function</span>
                                                    <p className="text-[11px] text-slate-700 font-bold leading-relaxed">{protein.molecularFunction}</p>
                                                </div>
                                                <div>
                                                    <span className="text-[9px] font-black text-slate-400 uppercase tracking-widest block mb-2">Functional Domains</span>
                                                    <div className="flex flex-wrap gap-1.5">
                                                        {(protein.domains || []).map((d, di) => (
                                                            <span key={di} className="px-2 py-1 bg-slate-100 text-slate-600 text-[9px] font-bold rounded border border-slate-200">{d}</span>
                                                        ))}
                                                    </div>
                                                </div>
                                                {protein.mutations && protein.mutations.length > 0 && (
                                                    <div>
                                                        <span className="text-[9px] font-black text-red-400 uppercase tracking-widest block mb-2">Key Mutations</span>
                                                        <ul className="space-y-1">
                                                            {protein.mutations.slice(0, 3).map((m, mi) => (
                                                                <li key={mi} className="text-[10px] text-red-700 font-mono font-bold bg-red-50 px-2 py-1 rounded inline-block mr-1 mb-1 border border-red-100">
                                                                    {m.hgvs}
                                                                </li>
                                                            ))}
                                                        </ul>
                                                    </div>
                                                )}
                                            </div>

                                            <div className="md:w-1/3 p-6 bg-slate-50/50">
                                                <ProteinViewer uniprotId={protein.uniprotId} />
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </section>
                        )}
                    </div>
                )}

                {/* 2. CLINICAL TRIALS */}
                {activeTab === 'clinical-trials' && (
                    <div className="space-y-6 animate-in fade-in zoom-in-95 duration-300">
                        <div className="bg-white border border-slate-200 rounded-[32px] p-8 shadow-sm">
                            <h4 className="flex items-center gap-2 text-[11px] font-black text-slate-900 uppercase tracking-[0.2em] mb-6">
                                <FlaskConical size={16} className="text-blue-500" /> Active Recruitment Pipeline
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
                        </div>

                        {insight.clinicalTrialsSummary && (
                            <div className="bg-blue-50 border border-blue-100 p-8 rounded-[32px] text-blue-900 text-sm font-medium leading-relaxed">
                                <span className="text-[9px] font-black text-blue-400 uppercase tracking-widest block mb-2">Pipeline Analysis</span>
                                {insight.clinicalTrialsSummary}
                            </div>
                        )}
                    </div>
                )}

                {/* 3. BIBLIOGRAPHY */}
                {activeTab === 'bibliography' && (
                    <div className="space-y-6 animate-in fade-in zoom-in-95 duration-300">
                        <div className="bg-white border border-slate-200 rounded-[32px] p-8 shadow-sm">
                            <h4 className="flex items-center gap-2 text-[11px] font-black text-slate-900 uppercase tracking-[0.2em] mb-6">
                                <BookOpen size={16} className="text-blue-500" /> Key Research Papers
                            </h4>
                            <div className="space-y-4">
                                {(insight.bibliography || []).map((paper, i) => (
                                    <a key={i} href={paper.link} target="_blank" rel="noreferrer" className="block group">
                                        <div className="p-5 rounded-2xl border border-slate-100 hover:border-blue-200 hover:bg-blue-50/20 transition-all">
                                            <h5 className="font-bold text-[#001a3d] text-sm mb-2 group-hover:text-blue-700 transition-colors leading-snug">
                                                {paper.title}
                                            </h5>
                                            <div className="flex items-center gap-3 text-[10px] text-slate-500 font-medium">
                                                <span className="bg-slate-100 px-2 py-0.5 rounded">{paper.year}</span>
                                                <span className="italic">{paper.journal}</span>
                                                <span className="text-slate-400 truncate max-w-[200px]">{paper.authors}</span>
                                            </div>
                                        </div>
                                    </a>
                                ))}
                            </div>
                        </div>
                        {insight.researchSynthesis && (
                            <div className="bg-slate-800 text-slate-200 p-8 rounded-[32px] text-sm font-medium leading-relaxed shadow-xl">
                                <span className="text-[9px] font-black text-slate-500 uppercase tracking-widest block mb-3">AI Research Synthesis</span>
                                "{insight.researchSynthesis}"
                            </div>
                        )}
                    </div>
                )}

                {/* 4. HYPOTHESIS LAB */}
                {activeTab === 'hypothesis-lab' && (
                    <ScientificBackground
                        insight={insight}
                        loading={repurposingLoading}
                        onGenerateRepurposing={handleRepurposingGeneration}
                    />
                )}

            </div>
        </div>
    );
};

export default ReportSection;
