import React from 'react';
import { Stethoscope, Dna, FlaskConical, Sparkles, Database, Binary, Target, Layers, Library, Beaker, Server, FileText, ArrowRight } from 'lucide-react';

const DocumentationSection: React.FC = () => {
    return (
        <div className="max-w-5xl mx-auto py-16 animate-in fade-in slide-in-from-bottom-10">
            <div className="mb-16">
                <h2 className="text-5xl font-black mb-6 tracking-tighter text-[#001a3d]">How it works</h2>
                <p className="text-xl text-slate-500 font-medium leading-relaxed">Technical architecture and agent orchestration behind Orphafold.</p>
            </div>

            <div className="space-y-20">

                {/* AGENT DETAILS */}
                <div className="space-y-8">
                    <div className="text-center">
                        <h3 className="text-3xl font-black text-[#001a3d] tracking-tighter uppercase mb-2">Agent Architecture</h3>
                        <p className="text-slate-400 font-bold text-xs uppercase tracking-widest">A 4-agent pipeline for deep structural search</p>
                    </div>

                    <div className="space-y-6">
                        {/* Clinical Agent */}
                        <div className="bg-white border border-slate-200 rounded-[32px] p-8 shadow-sm space-y-6">
                            <div className="flex items-start gap-6">
                                <div className="w-14 h-14 bg-emerald-50 rounded-2xl flex items-center justify-center shrink-0">
                                    <Stethoscope size={24} className="text-emerald-600" />
                                </div>
                                <div className="flex-1">
                                    <h4 className="text-xl font-black text-[#001a3d] tracking-tighter mb-2">Clinical Grounding Agent</h4>
                                    <p className="text-sm text-slate-500 font-medium leading-relaxed">
                                        Extracts clinical statistics including prevalence, inheritance patterns, and disease classifications.
                                    </p>
                                </div>
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <div className="bg-slate-50 rounded-2xl p-6 space-y-4">
                                    <h5 className="text-xs font-black text-slate-400 uppercase tracking-widest flex items-center gap-2">
                                        <Server size={12} /> APIs Called (Direct REST)
                                    </h5>
                                    <ul className="space-y-2">
                                        <li className="text-sm font-bold text-[#001a3d] flex items-center gap-2">
                                            <div className="w-1.5 h-1.5 rounded-full bg-emerald-500" /> <span className="mono text-[10px] bg-emerald-50 px-2 py-0.5 rounded">api.orphadata.com</span> Orphanet API
                                        </li>
                                        <li className="text-sm font-bold text-[#001a3d] flex items-center gap-2">
                                            <div className="w-1.5 h-1.5 rounded-full bg-emerald-500" /> <span className="mono text-[10px] bg-emerald-50 px-2 py-0.5 rounded">eutils.ncbi.nlm.nih.gov</span> OMIM
                                        </li>
                                        <li className="text-sm font-bold text-[#001a3d] flex items-center gap-2">
                                            <div className="w-1.5 h-1.5 rounded-full bg-emerald-500" /> Google Search (grounding tool)
                                        </li>
                                    </ul>
                                </div>
                                <div className="bg-slate-50 rounded-2xl p-6 space-y-4">
                                    <h5 className="text-xs font-black text-slate-400 uppercase tracking-widest flex items-center gap-2">
                                        <FileText size={12} /> Output Schema
                                    </h5>
                                    <ul className="space-y-1 text-xs font-mono text-slate-600">
                                        <li>• name, prevalence, inheritance</li>
                                        <li>• classification (category + subgroups)</li>
                                        <li>• classificationSummary</li>
                                        <li>• orphanetId, omimId</li>
                                    </ul>
                                </div>
                            </div>
                        </div>

                        {/* Bio-Mechanism Agent */}
                        <div className="bg-white border border-slate-200 rounded-[32px] p-8 shadow-sm space-y-6">
                            <div className="flex items-start gap-6">
                                <div className="w-14 h-14 bg-blue-50 rounded-2xl flex items-center justify-center shrink-0">
                                    <Dna size={24} className="text-blue-600" />
                                </div>
                                <div className="flex-1">
                                    <h4 className="text-xl font-black text-[#001a3d] tracking-tighter mb-2">Bio-Mechanism Agent</h4>
                                    <p className="text-sm text-slate-500 font-medium leading-relaxed">
                                        Analyzes molecular pathophysiology, identifies target proteins, maps mutations, and retrieves structural data.
                                    </p>
                                </div>
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <div className="bg-slate-50 rounded-2xl p-6 space-y-4">
                                    <h5 className="text-xs font-black text-slate-400 uppercase tracking-widest flex items-center gap-2">
                                        <Server size={12} /> APIs Called (Direct REST)
                                    </h5>
                                    <ul className="space-y-2">
                                        <li className="text-sm font-bold text-[#001a3d] flex items-center gap-2">
                                            <div className="w-1.5 h-1.5 rounded-full bg-blue-500" /> <span className="mono text-[10px] bg-blue-50 px-2 py-0.5 rounded">rest.uniprot.org</span> UniProt Search API
                                        </li>
                                        <li className="text-sm font-bold text-[#001a3d] flex items-center gap-2">
                                            <div className="w-1.5 h-1.5 rounded-full bg-blue-500" /> <span className="mono text-[10px] bg-blue-50 px-2 py-0.5 rounded">eutils.ncbi.nlm.nih.gov</span> NCBI Gene
                                        </li>
                                        <li className="text-sm font-bold text-[#001a3d] flex items-center gap-2">
                                            <div className="w-1.5 h-1.5 rounded-full bg-blue-500" /> <span className="mono text-[10px] bg-blue-50 px-2 py-0.5 rounded">eutils.ncbi.nlm.nih.gov</span> ClinVar
                                        </li>
                                        <li className="text-sm font-bold text-[#001a3d] flex items-center gap-2">
                                            <div className="w-1.5 h-1.5 rounded-full bg-blue-500" /> AlphaFold DB (3D viewer embedding)
                                        </li>
                                        <li className="text-sm font-bold text-[#001a3d] flex items-center gap-2">
                                            <div className="w-1.5 h-1.5 rounded-full bg-blue-500" /> Google Search (grounding tool)
                                        </li>
                                    </ul>
                                </div>
                                <div className="bg-slate-50 rounded-2xl p-6 space-y-4">
                                    <h5 className="text-xs font-black text-slate-400 uppercase tracking-widest flex items-center gap-2">
                                        <FileText size={12} /> Output Schema
                                    </h5>
                                    <ul className="space-y-1 text-xs font-mono text-slate-600">
                                        <li>• molecularMechanism</li>
                                        <li>• targetProteins[] (name, uniprotId, function,</li>
                                        <li>&nbsp;&nbsp;domains[], mutations[], plddt, druggability)</li>
                                        <li>• cellularVulnerability (cellTypes, factors)</li>
                                    </ul>
                                </div>
                            </div>

                            <div className="bg-amber-50 border border-amber-100 rounded-xl p-4">
                                <p className="text-xs font-bold text-amber-800">
                                    <strong>Hybrid Strategy:</strong> The agent uses API data (UniProt IDs, ClinVar variants) as ground truth, then expands context with Google Search for interaction networks and pathway data.
                                </p>
                            </div>
                        </div>

                        {/* Discovery Agent */}
                        <div className="bg-white border border-slate-200 rounded-[32px] p-8 shadow-sm space-y-6">
                            <div className="flex items-start gap-6">
                                <div className="w-14 h-14 bg-purple-50 rounded-2xl flex items-center justify-center shrink-0">
                                    <FlaskConical size={24} className="text-purple-600" />
                                </div>
                                <div className="flex-1">
                                    <h4 className="text-xl font-black text-[#001a3d] tracking-tighter mb-2">Discovery Agent</h4>
                                    <p className="text-sm text-slate-500 font-medium leading-relaxed">
                                        Scans clinical trials, synthesizes bibliography, and identifies cross-disease structural similarities.
                                    </p>
                                </div>
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <div className="bg-slate-50 rounded-2xl p-6 space-y-4">
                                    <h5 className="text-xs font-black text-slate-400 uppercase tracking-widest flex items-center gap-2">
                                        <Server size={12} /> APIs Called (Direct REST)
                                    </h5>
                                    <ul className="space-y-2">
                                        <li className="text-sm font-bold text-[#001a3d] flex items-center gap-2">
                                            <div className="w-1.5 h-1.5 rounded-full bg-purple-500" /> <span className="mono text-[10px] bg-purple-50 px-2 py-0.5 rounded">eutils.ncbi.nlm.nih.gov</span> PubMed
                                        </li>
                                        <li className="text-sm font-bold text-[#001a3d] flex items-center gap-2">
                                            <div className="w-1.5 h-1.5 rounded-full bg-purple-500" /> Google Search → ClinicalTrials.gov
                                        </li>
                                        <li className="text-sm font-bold text-[#001a3d] flex items-center gap-2">
                                            <div className="w-1.5 h-1.5 rounded-full bg-purple-500" /> Google Search → Cross-disease analysis
                                        </li>
                                    </ul>
                                </div>
                                <div className="bg-slate-50 rounded-2xl p-6 space-y-4">
                                    <h5 className="text-xs font-black text-slate-400 uppercase tracking-widest flex items-center gap-2">
                                        <FileText size={12} /> Output Schema
                                    </h5>
                                    <ul className="space-y-1 text-xs font-mono text-slate-600">
                                        <li>• clinicalTrials[] (title, phase, status, identifier)</li>
                                        <li>• bibliography[] (title, authors, journal, link)</li>
                                        <li>• crossDiseaseInsights[] (sharedMechanism,</li>
                                        <li>&nbsp;&nbsp;sharedGenes[], pathwayOverlap[])</li>
                                    </ul>
                                </div>
                            </div>
                        </div>

                        {/* Repurposing Agent (On-Demand) */}
                        <div className="bg-gradient-to-br from-[#001a3d] to-[#002b5e] border border-slate-200 rounded-[32px] p-8 shadow-sm space-y-6 text-white">
                            <div className="flex items-start gap-6">
                                <div className="w-14 h-14 bg-[#00f5d4]/20 rounded-2xl flex items-center justify-center shrink-0">
                                    <Sparkles size={24} className="text-[#00f5d4]" />
                                </div>
                                <div className="flex-1">
                                    <div className="flex items-center gap-3 mb-2">
                                        <h4 className="text-xl font-black text-white tracking-tighter">Drug Repurposing Agent</h4>
                                        <span className="px-2 py-0.5 bg-[#00f5d4] text-[#001a3d] text-[8px] font-black uppercase rounded-full">On-Demand</span>
                                    </div>
                                    <p className="text-sm text-white/70 font-medium leading-relaxed">
                                        Triggered manually by user. Generates in-silico repurposing hypotheses based on mechanism overlap.
                                    </p>
                                </div>
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <div className="bg-white/5 border border-white/10 rounded-2xl p-6 space-y-4">
                                    <h5 className="text-xs font-black text-white/50 uppercase tracking-widest flex items-center gap-2">
                                        <Server size={12} /> Tools Used
                                    </h5>
                                    <ul className="space-y-2">
                                        <li className="text-sm font-bold text-white flex items-center gap-2">
                                            <div className="w-1.5 h-1.5 rounded-full bg-[#00f5d4]" /> Google Search → DrugBank data
                                        </li>
                                        <li className="text-sm font-bold text-white flex items-center gap-2">
                                            <div className="w-1.5 h-1.5 rounded-full bg-[#00f5d4]" /> Google Search → ChEMBL mechanism data
                                        </li>
                                        <li className="text-sm font-bold text-white flex items-center gap-2">
                                            <div className="w-1.5 h-1.5 rounded-full bg-[#00f5d4]" /> Thinking Budget: 4,096 tokens
                                        </li>
                                    </ul>
                                </div>
                                <div className="bg-white/5 border border-white/10 rounded-2xl p-6 space-y-4">
                                    <h5 className="text-xs font-black text-white/50 uppercase tracking-widest flex items-center gap-2">
                                        <FileText size={12} /> Output Schema
                                    </h5>
                                    <ul className="space-y-1 text-xs font-mono text-white/70">
                                        <li>• drugName, originalIndication</li>
                                        <li>• mechanismOfAction</li>
                                        <li>• feasibilityScore (0-100)</li>
                                        <li>• rationale, validationSteps[]</li>
                                    </ul>
                                </div>
                            </div>

                            <div className="bg-amber-500/20 border border-amber-500/30 rounded-xl p-4">
                                <p className="text-xs font-bold text-amber-200">
                                    <strong>Warning:</strong> Repurposing candidates are AI-generated hypotheses. They require wet-lab validation and are NOT clinical recommendations.
                                </p>
                            </div>
                        </div>
                    </div>
                </div>

                {/* DATA SOURCES */}
                <div className="space-y-12">
                    <div className="text-center">
                        <h3 className="text-3xl font-black text-[#001a3d] tracking-tighter uppercase mb-2">Data Sources</h3>
                        <p className="text-slate-400 font-bold text-xs uppercase tracking-widest">Public Bio-Informatics Infrastructure</p>
                    </div>

                    <div className="bg-white border border-slate-200 rounded-[32px] p-8 shadow-sm">
                        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-8">
                            {[
                                { name: "Orphanet", icon: <Database size={18} />, desc: "REST API (XML). Disease classifications, prevalence data.", api: "api.orphadata.com" },
                                { name: "OMIM", icon: <Binary size={18} />, desc: "E-utilities API. Phenotype-genotype correlation data.", api: "eutils.ncbi.nlm.nih.gov" },
                                { name: "UniProt", icon: <Library size={18} />, desc: "REST API (JSON). Protein sequence and functional info.", api: "rest.uniprot.org" },
                                { name: "NCBI Gene", icon: <Dna size={18} />, desc: "E-utilities API. Gene database with genomic coordinates.", api: "eutils.ncbi.nlm.nih.gov" },
                                { name: "ClinVar", icon: <Target size={18} />, desc: "E-utilities API. Genomic variations and clinical significance.", api: "eutils.ncbi.nlm.nih.gov" },
                                { name: "PubMed", icon: <Library size={18} />, desc: "E-utilities API. Evidence synthesis from MEDLINE.", api: "eutils.ncbi.nlm.nih.gov" },
                                { name: "AlphaFold DB", icon: <Layers size={18} />, desc: "200M+ protein structure predictions.", api: "alphafold.ebi.ac.uk" },
                                { name: "ClinicalTrials.gov", icon: <FlaskConical size={18} />, desc: "Clinical studies database.", api: "clinicaltrials.gov" },
                                { name: "DrugBank & ChEMBL", icon: <Beaker size={18} />, desc: "Drug and target identification databases.", api: "via Google Search" }
                            ].map((src, i) => (
                                <div key={i} className="flex items-start gap-4 p-4 rounded-2xl hover:bg-slate-50 transition-colors group">
                                    <div className="w-10 h-10 bg-slate-50 rounded-lg flex items-center justify-center text-blue-500 group-hover:bg-blue-500 group-hover:text-white transition-all shrink-0">
                                        {src.icon}
                                    </div>
                                    <div className="space-y-1">
                                        <h5 className="text-[11px] font-black text-[#001a3d] uppercase tracking-wider">{src.name}</h5>
                                        <p className="text-[10px] text-slate-500 font-medium leading-snug">{src.desc}</p>
                                        <div className="text-[8px] font-mono text-slate-400 pt-1">{src.api}</div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>

                {/* ARCHITECTURE OVERVIEW (Moved to last) */}
                <div className="space-y-8">
                    <div className="text-center">
                        <h3 className="text-3xl font-black text-[#001a3d] tracking-tighter uppercase mb-2">System Architecture</h3>
                        <p className="text-slate-400 font-bold text-xs uppercase tracking-widest">Multi-Agent Orchestration Pipeline</p>
                    </div>

                    <div className="bg-[#001a3d] rounded-[32px] p-10 text-white space-y-8">
                        <div className="space-y-4">
                            <h4 className="text-lg font-black text-[#00f5d4] uppercase tracking-widest">Core Stack</h4>
                            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                                {[
                                    { label: "LLM", value: "Gemini 1.5 Pro" },
                                    { label: "Thinking Budget", value: "8,192 tokens" },
                                    { label: "Framework", value: "React + TypeScript" },
                                    { label: "API Pattern", value: "Parallel Agent Execution" },
                                ].map((item, i) => (
                                    <div key={i} className="bg-white/5 border border-white/10 rounded-2xl p-4">
                                        <span className="text-[9px] font-black text-white/40 uppercase tracking-widest block mb-1">{item.label}</span>
                                        <span className="text-sm font-bold text-white">{item.value}</span>
                                    </div>
                                ))}
                            </div>
                        </div>

                        <div className="space-y-4">
                            <h4 className="text-lg font-black text-[#00f5d4] uppercase tracking-widest">Execution Flow</h4>
                            <div className="flex flex-wrap items-center gap-3 text-sm">
                                <span className="bg-white/10 px-4 py-2 rounded-xl font-bold">User Query</span>
                                <ArrowRight size={16} className="text-[#00f5d4]" />
                                <span className="bg-white/10 px-4 py-2 rounded-xl font-bold">Real-time API Enrichment</span>
                                <ArrowRight size={16} className="text-[#00f5d4]" />
                                <span className="bg-white/10 px-4 py-2 rounded-xl font-bold">4 Specialized Agents</span>
                                <ArrowRight size={16} className="text-[#00f5d4]" />
                                <span className="bg-white/10 px-4 py-2 rounded-xl font-bold">Structured JSON Output</span>
                            </div>
                            <p className="text-white/60 text-xs font-medium leading-relaxed">
                                Before invoking the LLM, Orphafold makes <strong className="text-white/80">direct REST API calls</strong> to UniProt, NCBI Gene, ClinVar, and PubMed to gather ground-truth data.
                                This data is injected into the agent context to reduce hallucinations and anchor responses in verifiable sources.
                            </p>
                        </div>
                    </div>
                </div>

                <div className="text-center pt-8">
                    <p className="text-[10px] font-black uppercase tracking-[0.5em] text-slate-300">Built for Google AI Hackathon 2026</p>
                </div>
            </div>
        </div>
    )
};

export default DocumentationSection;
