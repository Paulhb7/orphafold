
import React, { useState, useCallback, useRef, useEffect, Suspense } from 'react';
import { Search, FlaskConical, Database, BookOpen, AlertCircle, Loader2, ExternalLink, Dna, Fingerprint, Activity, Library, Quote, Terminal, Sparkles, MessageSquare, ClipboardList, Repeat, Globe, Zap, Download, FileText, ChevronRight, Share2, ShieldCheck, Microscope, Info, HelpCircle, Layers, Cpu, Server, Tag, ArrowRight, Binary, Target, Beaker, FileSearch, Printer, Radio, Fingerprint as CellIcon, GitBranch, CpuIcon, SearchCode, Network, ShieldAlert, Scale, Construction, HeartPulse, Link2, Stethoscope, Pill, Box, ZapIcon, GitMerge, Percent, Workflow, Lightbulb, CheckCircle2, TrendingUp, BrainCircuit } from 'lucide-react';
import { performDeepSearch, generateRepurposingCandidates } from './services/geminiService';
import { SearchState, DiseaseInsight, NetworkNode, NetworkLink } from './types';
import MolecularNetwork from './components/MolecularNetwork';
import ProteinViewer from './components/ProteinViewer';
import ScientificBackground from './components/ScientificBackground';
import Loading from './components/Loading';

const App: React.FC = () => {
  const [query, setQuery] = useState('');
  const [view, setView] = useState<'home' | 'mission' | 'documentation' | 'ethics'>('home');
  const [activeTab, setActiveTab] = useState<'biology-overview' | 'clinical-trials' | 'bibliography' | 'hypothesis-lab'>('biology-overview');
  const [state, setState] = useState<SearchState>({
    loading: false,
    error: null,
    insight: null,
    thinking: false,
    logs: []
  });
  
  // New state for on-demand repurposing
  const [repurposingLoading, setRepurposingLoading] = useState(false);
  
  const logEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (logEndRef.current) logEndRef.current.scrollIntoView({ behavior: 'smooth' });
  }, [state.logs]);

  // Derived state for the Loading component
  const currentStatus = state.logs.length > 0 ? state.logs[state.logs.length - 1] : "Initializing...";
  const loadingFacts = [
    "80% of rare diseases have a genetic origin.",
    "AlphaFold has predicted 3D structures for nearly all cataloged proteins.",
    "Orphan drugs are pharmaceuticals developed specifically for rare conditions.",
    "There are over 7,000 known rare diseases affecting 300 million people.",
    "Gemini models can reason across millions of medical papers in seconds.",
    "ClinVar aggregates information about genomic variation and human health.",
  ];

  // Calculate approximate step (1-4) based on keywords in logs
  let loadingStep = 1;
  const logString = state.logs.join(" ");
  if (logString.includes("Clinical Agent")) loadingStep = 2;
  if (logString.includes("Bio-Mechanism Agent")) loadingStep = 3;
  if (logString.includes("Discovery Agent") || logString.includes("Compiling")) loadingStep = 4;


  const handleSearch = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!query.trim()) return;

    setState({ 
      loading: true, 
      error: null, 
      insight: null,
      thinking: true, 
      logs: [] 
    });
    setRepurposingLoading(false); // Reset this
    setActiveTab('biology-overview'); 

    const initialLogs = [
      "Initializing Orphafold Deep Research Agent...",
      "Establishing connection to global Bio-Grid...",
      "Mounting UniProt, NCBI Gene & ClinVar API clients...",
      "Activating search grounding protocols..."
    ];

    const delay = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

    for (const log of initialLogs) {
      setState(prev => ({ ...prev, logs: [...prev.logs, log] }));
      await delay(800);
    }
    
    try {
      const insight = await performDeepSearch(query, (log) => {
        setState(prev => ({ ...prev, logs: [...prev.logs, log] }));
      });
      setState(prev => ({ ...prev, loading: false, error: null, insight, thinking: false }));
    } catch (err) {
      setState(prev => ({ 
        ...prev,
        loading: false, 
        error: "Bioinformatics agent failure. API rate limit or connection issue.", 
        insight: null,
        thinking: false
      }));
    }
  };

  const handleRepurposingGeneration = async () => {
    if (!state.insight) return;
    setRepurposingLoading(true);
    try {
      const candidates = await generateRepurposingCandidates(
        state.insight.name, 
        state.insight.molecularMechanism,
        state.insight.targetProteins
      );
      
      setState(prev => ({
        ...prev,
        insight: prev.insight ? { ...prev.insight, repurposingCandidates: candidates } : null
      }));
    } catch (e) {
      console.error("Repurposing failed", e);
    } finally {
      setRepurposingLoading(false);
    }
  };

  const downloadPDF = () => {
    window.print();
  };

  const getNetworkData = useCallback(() => {
    if (!state.insight) return { nodes: [], links: [] };
    const nodes: NetworkNode[] = [{ id: 'disease', label: state.insight.name || 'Unknown Disease', type: 'disease' }];
    const links: NetworkLink[] = [];

    (state.insight.targetProteins || []).forEach((p, i) => {
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
  }, [state.insight]);

  const renderEthics = () => (
    <div className="max-w-4xl mx-auto py-16 animate-in fade-in slide-in-from-bottom-10">
      <div className="mb-16">
        <h2 className="text-5xl font-black mb-6 tracking-tighter text-[#001a3d]">Ethics & Disclaimer</h2>
        <p className="text-xl text-slate-500 font-medium leading-relaxed">Commitment to scientific integrity and responsible AI usage.</p>
      </div>

      <div className="space-y-8">
        <div className="bg-amber-50 border border-amber-100 p-10 rounded-[40px] flex gap-8 items-start">
          <div className="w-16 h-16 bg-amber-500 text-white rounded-2xl flex items-center justify-center shrink-0 shadow-lg">
            <ShieldAlert size={32} />
          </div>
          <div className="space-y-4">
            <h3 className="text-2xl font-black text-amber-900 tracking-tighter uppercase">AI Generation Warning</h3>
            <p className="text-amber-800/80 leading-relaxed font-semibold text-base">
              Orphafold is <strong>NOT a drug discovery tool</strong>. It is a Generative AI interface that aggregates public knowledge and generates hypotheses. 
              <br/><br/>
              The "candidates" proposed are synthetic suggestions based on pattern matching. <strong>AI can hallucinate mechanisms or associations.</strong> All outputs must be rigorously verified against primary literature and experimental validation.
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <div className="bg-white border border-slate-100 p-10 rounded-[40px] shadow-sm space-y-6">
            <div className="w-12 h-12 bg-slate-100 text-[#001a3d] rounded-xl flex items-center justify-center shadow-inner">
              <Scale size={24} />
            </div>
            <h4 className="text-xl font-black text-[#001a3d] tracking-tighter">Human-in-the-loop</h4>
            <p className="text-slate-500 text-sm leading-relaxed font-medium">
              This tool is intended to <strong>augment</strong>, not replace, the expertise of medical researchers and geneticists. Scientific discovery remains a human-centric endeavor requiring peer-reviewed verification.
            </p>
          </div>

          <div className="bg-white border border-slate-100 p-10 rounded-[40px] shadow-sm space-y-6">
            <div className="w-12 h-12 bg-slate-100 text-[#001a3d] rounded-xl flex items-center justify-center shadow-inner">
              <Construction size={24} />
            </div>
            <h4 className="text-xl font-black text-[#001a3d] tracking-tighter">Experimental Status</h4>
            <p className="text-slate-500 text-sm leading-relaxed font-medium">
              Data generated by our agent is grounded in live registries but may be subject to Gemini's synthesis errors. Always cross-reference findings with the original source links provided in the report.
            </p>
          </div>
        </div>

        <div className="text-center pt-12">
          <p className="text-[10px] font-black uppercase tracking-[0.5em] text-slate-300">Hackathon Build v0.9.3 - 2025</p>
        </div>
      </div>
    </div>
  );

  const renderDocumentation = () => (
    <div className="max-w-5xl mx-auto py-16 animate-in fade-in slide-in-from-bottom-10">
      <div className="mb-16">
        <h2 className="text-5xl font-black mb-6 tracking-tighter text-[#001a3d]">How it works</h2>
        <p className="text-xl text-slate-500 font-medium leading-relaxed">Technical architecture and agent orchestration behind Orphafold.</p>
      </div>

      <div className="space-y-20">
        
        {/* ARCHITECTURE OVERVIEW */}
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
                  { label: "LLM", value: "Gemini 3 Pro Preview" },
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
                <span className="bg-white/10 px-4 py-2 rounded-xl font-bold">3 Parallel Agents</span>
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

        {/* AGENT DETAILS */}
        <div className="space-y-8">
          <div className="text-center">
            <h3 className="text-3xl font-black text-[#001a3d] tracking-tighter uppercase mb-2">Agent Architecture</h3>
            <p className="text-slate-400 font-bold text-xs uppercase tracking-widest">Three specialized agents running in parallel</p>
          </div>
          
          <div className="space-y-6">
            {/* Clinical Agent */}
            <div className="bg-white border border-slate-200 rounded-[32px] p-8 shadow-sm space-y-6">
              <div className="flex items-start gap-6">
                <div className="w-14 h-14 bg-emerald-50 rounded-2xl flex items-center justify-center shrink-0">
                  <Stethoscope size={24} className="text-emerald-600" />
                </div>
                <div className="flex-1">
                  <h4 className="text-xl font-black text-[#001a3d] tracking-tighter mb-2">Clinical Agent</h4>
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
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {[
              { name: "Orphanet", icon: <Database size={18} />, desc: "REST API (XML). Disease classifications, prevalence data, and OrphaCode identifiers.", api: "api.orphadata.com" },
              { name: "OMIM", icon: <Binary size={18} />, desc: "E-utilities API. Mendelian inheritance and phenotype-genotype correlation data.", api: "eutils.ncbi.nlm.nih.gov" },
              { name: "UniProt", icon: <Fingerprint size={18} />, desc: "REST API (JSON). Protein sequence and functional information for target identification.", api: "rest.uniprot.org" },
              { name: "NCBI Gene", icon: <Dna size={18} />, desc: "E-utilities API. Gene database with genomic coordinates and summaries.", api: "eutils.ncbi.nlm.nih.gov" },
              { name: "ClinVar", icon: <Target size={18} />, desc: "E-utilities API. Genomic variations with HGVS mutations and clinical significance.", api: "eutils.ncbi.nlm.nih.gov" },
              { name: "PubMed", icon: <Library size={18} />, desc: "E-utilities API. MEDLINE abstracts for real-time evidence synthesis.", api: "eutils.ncbi.nlm.nih.gov" },
              { name: "AlphaFold DB", icon: <Layers size={18} />, desc: "200M+ protein structure predictions. Embedded 3D viewer via Mol* (PDBe).", api: "alphafold.ebi.ac.uk" },
              { name: "ClinicalTrials.gov", icon: <FlaskConical size={18} />, desc: "Clinical studies database. Pipeline visibility via Google Search grounding.", api: "clinicaltrials.gov" },
              { name: "DrugBank & ChEMBL", icon: <Beaker size={18} />, desc: "Drug and target databases. Used for repurposing hypothesis generation.", api: "via Google Search" }
            ].map((src, i) => (
              <div key={i} className="bg-[#f8fafc] border border-slate-100 p-6 rounded-2xl group hover:bg-white hover:shadow-lg hover:border-blue-100 transition-all duration-300">
                <div className="flex items-center gap-4 mb-3">
                  <div className="w-9 h-9 bg-white rounded-lg flex items-center justify-center text-blue-500 shadow-sm group-hover:bg-blue-500 group-hover:text-white transition-colors">
                    {src.icon}
                  </div>
                  <div className="flex-1">
                    <h5 className="text-sm font-black text-[#001a3d] tracking-tight uppercase">{src.name}</h5>
                    <span className="text-[9px] font-mono text-slate-400">{src.api}</span>
                  </div>
                </div>
                <p className="text-xs text-slate-500 font-medium leading-relaxed">{src.desc}</p>
              </div>
            ))}
          </div>
        </div>

        <div className="text-center pt-8">
          <p className="text-[10px] font-black uppercase tracking-[0.5em] text-slate-300">Built for Google AI Hackathon 2026</p>
        </div>
      </div>
    </div>
  );

  const renderHome = () => (
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
              disabled={state.loading}
            />
            <button
              type="submit"
              disabled={state.loading || !query.trim()}
              className="bg-[#001a3d] text-white px-10 py-5 rounded-[16px] font-bold text-sm transition-all flex items-center gap-2 hover:bg-black active:scale-95 disabled:opacity-50"
            >
              {state.loading ? <Loader2 className="animate-spin" size={18} /> : "Run Agents"}
            </button>
          </div>
        </form>

        {/* Example Disease Buttons */}
        {!state.loading && !state.insight && (
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

        {!state.insight && !state.loading && (
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


        {(state.loading || state.logs.length > 0) && !state.insight && (
          <div className="mt-12 space-y-4">
             {/* 1. Log Console First */}
             <div className="bg-[#001a3d] rounded-[24px] overflow-hidden shadow-2xl max-w-4xl mx-auto border border-white/10 text-left">
              <div className="bg-white/5 px-6 py-3 border-b border-white/5 flex items-center justify-between">
                <div className="flex items-center gap-2 text-[#00f5d4]">
                  <Radio size={12} className="animate-pulse" />
                  <span className="text-[10px] font-black uppercase tracking-widest">Active Discovery Stream</span>
                </div>
                <div className="flex gap-1.5">
                  <div className="w-2 h-2 rounded-full bg-red-500/50" />
                  <div className="w-2 h-2 rounded-full bg-yellow-500/50" />
                  <div className="w-2 h-2 rounded-full bg-green-500/50" />
                </div>
              </div>
              <div className="p-6 h-[240px] overflow-y-auto mono text-[11px] leading-relaxed text-slate-300 custom-scrollbar">
                {state.logs.map((log, i) => {
                  const isThought = log.includes('💭');
                  const displayLog = log.replace('💭', '');
                  
                  return (
                    <div key={i} className={`mb-1.5 flex items-start gap-3 ${isThought ? 'bg-purple-500/10 rounded px-2 py-1 border-l-2 border-purple-400' : ''}`}>
                      <span className="text-[#00f5d4] opacity-40 font-bold">[{new Date().toLocaleTimeString([], {hour12: false})}]</span>
                      <span className="flex-1">
                        {isThought && <span className="text-purple-300 mr-2">🧠</span>}
                        {displayLog}
                      </span>
                    </div>
                  );
                })}
                {state.loading && (
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

      {state.insight && (
        <div id="research-report" className="animate-in fade-in slide-in-from-bottom-10 duration-700 pb-32">
          
          {/* Header Section */}
          <section className="bg-white border border-slate-200 rounded-[32px] p-8 shadow-sm mb-8 flex flex-wrap justify-between items-start gap-6">
             <div className="space-y-4">
                <h3 className="text-4xl font-black text-[#001a3d] leading-none tracking-tighter">{state.insight.name}</h3>
                <div className="flex flex-wrap gap-2">
                   <span className="inline-flex items-center px-4 py-1.5 rounded-full text-[10px] font-black uppercase tracking-widest bg-[#001a3d] text-white">
                      ORPHA: {state.insight.orphanetId || "N/A"}
                   </span>
                   {state.insight.omimId && (
                     <span className="inline-flex items-center px-4 py-1.5 rounded-full text-[10px] font-black uppercase tracking-widest bg-slate-100 text-slate-700 border border-slate-200">
                        OMIM: {state.insight.omimId}
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
                className={`flex items-center gap-2 px-6 py-3 rounded-t-xl text-[10px] font-black uppercase tracking-widest transition-all ${
                  activeTab === tab.id 
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
                       <p className="text-xl font-black text-[#001a3d]">{state.insight.prevalence}</p>
                    </div>
                    <div className="bg-[#f8fafc] p-8 rounded-[32px] border border-slate-100">
                       <h4 className="flex items-center gap-2 text-[11px] font-black text-slate-900 uppercase tracking-[0.2em] mb-4">
                          <GitBranch size={16} className="text-emerald-500" /> Inheritance
                       </h4>
                       <p className="text-xl font-black text-[#001a3d]">{state.insight.inheritance}</p>
                    </div>
                 </div>

                 <section className="bg-white border border-slate-200 rounded-[32px] p-10 shadow-sm space-y-8">
                  <div className="space-y-4">
                    <h4 className="flex items-center gap-3 text-[11px] font-black text-slate-900 uppercase tracking-[0.4em]">
                      <Tag size={16} className="text-[#0061ff]" />
                      Taxonomy & Clinical Classification
                    </h4>
                    <p className="text-[#001a3d] leading-relaxed font-bold text-sm tracking-tight italic border-l-4 border-[#0061ff] pl-6 py-2">
                      "{state.insight.classificationSummary}"
                    </p>
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {(state.insight.classification || []).map((cls, i) => (
                      <div key={i} className="bg-[#f8fafc] rounded-[24px] p-6 border border-slate-100">
                        <h5 className="font-black text-[#001a3d] text-xs uppercase tracking-tighter mb-4 flex items-center gap-2">
                          <span className="shrink-0 w-5 h-5 rounded bg-[#001a3d] text-white text-[9px] flex items-center justify-center">{i+1}</span>
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
                    "{state.insight.molecularMechanism}"
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
                            {(state.insight.cellularVulnerability?.cellTypesInvolved || []).map((t, i) => (
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
                            {(state.insight.cellularVulnerability?.keyVulnerabilityFactors || []).map((f, i) => (
                              <li key={i} className="text-[11px] text-slate-600 font-bold flex items-start gap-2">
                                <div className="w-1 h-1 rounded-full bg-purple-400 mt-1.5 shrink-0" /> {f}
                              </li>
                            ))}
                          </ul>
                        </div>
                      </div>
                    </div>
                  </div>
                </section>

                <section className="space-y-8">
                  <div className="flex items-center gap-3 px-6">
                    <Binary size={18} className="text-[#00f5d4]" />
                    <h4 className="text-[11px] font-black text-slate-900 uppercase tracking-[0.4em]">Structural Proteomics Lab</h4>
                  </div>
                  <div className="space-y-8">
                    {(state.insight.targetProteins || []).map((p, idx) => (
                      <div key={idx} className="bg-white rounded-[24px] p-6 border border-slate-200 shadow-sm relative">
                        <div className="flex flex-wrap justify-between items-start gap-8 mb-8">
                          <div className="space-y-1">
                            <h5 className="text-xl font-black text-[#001a3d] tracking-tighter">{p.name}</h5>
                            <span className="inline-block mono text-[10px] font-bold text-[#0061ff] bg-blue-50 px-4 py-1 rounded-full border border-blue-100 uppercase">
                              UniProt: {p.uniprotId}
                            </span>
                          </div>
                          <a href={`https://alphafold.ebi.ac.uk/entry/${p.uniprotId}`} target="_blank" className="no-print bg-[#001a3d] text-white px-5 py-2.5 rounded-[12px] text-[9px] font-black uppercase tracking-widest hover:scale-105 transition-all flex items-center gap-2">
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
                                      {(!p.domains || p.domains.length === 0) && <span className="text-[9px] text-slate-300 italic">No specific domains mapped</span>}
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
                      <Stethoscope size={16} className="text-emerald-500" />
                      Approved & Investigational Approaches
                    </h4>
                    <div className="grid grid-cols-1 gap-3">
                      {(state.insight.therapeuticApproaches || []).map((appr, i) => (
                         <div key={i} className="flex items-start gap-4 p-4 bg-emerald-50/50 rounded-2xl border border-emerald-100">
                             <div className="w-6 h-6 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center shrink-0 mt-0.5">
                               <Pill size={12} />
                             </div>
                             <p className="text-sm font-bold text-slate-700">{appr}</p>
                         </div>
                      ))}
                    </div>
                 </section>

                 <section className="bg-[#001a3d] rounded-[32px] p-10 text-white shadow-2xl relative overflow-hidden space-y-8">
                   <div className="absolute top-0 right-0 w-80 h-80 bg-blue-600/10 blur-[100px] rounded-full -mr-32 -mt-32" />
                   <div className="space-y-4 relative z-10">
                     <h4 className="flex items-center gap-3 text-[11px] font-black text-[#00f5d4] uppercase tracking-[0.4em]">
                       <Target size={18} />
                       Clinical Pipeline
                     </h4>
                     <p className="text-white font-bold text-sm leading-relaxed italic tracking-tight opacity-90 border-l-2 border-[#00f5d4] pl-6 py-2">
                       "{state.insight.clinicalTrialsSummary || "Active clinical trials analysis unavailable. Research is likely in preclinical stages or data is restricted."}"
                     </p>
                   </div>
                   <div className="grid grid-cols-1 md:grid-cols-2 gap-4 relative z-10">
                     {(state.insight.clinicalTrials || []).map((trial, i) => (
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
                     {(!state.insight.clinicalTrials || state.insight.clinicalTrials.length === 0) && (
                       <div className="col-span-2 py-8 text-center bg-white/5 rounded-[20px] border border-dashed border-white/20">
                          <p className="text-white/40 font-bold uppercase tracking-widest text-[10px]">No specific active trials found in current registry context.</p>
                       </div>
                     )}
                   </div>
                </section>
              </div>
            )}

            {/* 3. BIBLIOGRAPHY */}
            {activeTab === 'bibliography' && (
              <div className="space-y-8 animate-in fade-in zoom-in-95 duration-300">
                <section className="bg-white border border-slate-200 rounded-[32px] p-10 shadow-sm space-y-8">
                  <div className="space-y-4">
                    <h4 className="flex items-center gap-3 text-[11px] font-black text-slate-900 uppercase tracking-[0.4em]">
                      <Library size={16} className="text-[#00f5d4]" />
                      Grounding Evidence Synthesis
                    </h4>
                    <p className="text-[#001a3d] leading-relaxed font-bold text-sm tracking-tight italic border-l-4 border-[#0061ff] pl-6 py-2">
                      "{state.insight.bibliographySummary}"
                    </p>
                  </div>
                  <div className="grid grid-cols-1 gap-4">
                    {(state.insight.bibliography || []).map((paper, i) => (
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
                     {(state.insight.dataSourcesValidated || []).map((src, i) => (
                       <span key={i} className="px-4 py-2 rounded-xl text-[10px] font-black uppercase tracking-tighter bg-slate-50 text-slate-600 border border-slate-100 flex items-center gap-2">
                         <div className="w-2 h-2 rounded-full bg-emerald-400" /> {src}
                       </span>
                     ))}
                  </div>
                  {state.insight.groundingSources && state.insight.groundingSources.length > 0 && (
                    <div className="mt-8 pt-8 border-t border-slate-100">
                        <h5 className="text-[10px] font-black uppercase tracking-widest text-slate-400 mb-4">Web Search Grounding Links</h5>
                        <div className="grid grid-cols-1 gap-2">
                           {state.insight.groundingSources.map((src, i) => (
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
                <section className="bg-white border border-slate-200 rounded-[32px] p-10 shadow-sm space-y-8">
                  <div className="space-y-4">
                    <h4 className="flex items-center gap-3 text-[11px] font-black text-slate-900 uppercase tracking-[0.4em]">
                      <GitMerge size={16} className="text-[#0061ff]" />
                      Comparative Discovery Lab
                    </h4>
                    <p className="text-[#001a3d] leading-relaxed font-bold text-sm tracking-tight italic border-l-4 border-[#0061ff] pl-6 py-2">
                      "{state.insight.crossDiseaseSummary || "Cross-disease structural analysis pending. No direct pathway homologues identified in current sweep."}"
                    </p>
                  </div>
                  <div className="space-y-6">
                    {(state.insight.crossDiseaseInsights || []).map((cd, i) => (
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
                    {(!state.insight.crossDiseaseInsights || state.insight.crossDiseaseInsights.length === 0) && (
                       <div className="p-8 text-center bg-slate-50 rounded-[24px] border border-slate-200">
                          <p className="text-slate-400 font-bold uppercase tracking-widest text-[10px]">No comparative disease models identified.</p>
                       </div>
                    )}
                  </div>
                </section>

                <section className="bg-gradient-to-br from-[#001a3d] to-[#002b5e] rounded-[32px] p-10 shadow-2xl relative overflow-hidden">
                  <div className="absolute top-0 right-0 w-96 h-96 bg-[#00f5d4] rounded-full mix-blend-overlay blur-[128px] opacity-20 -mr-20 -mt-20 pointer-events-none" />
                  
                  <div className="relative z-10 space-y-10">
                    <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
                       <div className="space-y-4">
                          <h4 className="flex items-center gap-3 text-[11px] font-black text-[#00f5d4] uppercase tracking-[0.4em]">
                             <TrendingUp size={16} /> AI Drug Repurposing Generator
                          </h4>
                          <h5 className="text-3xl font-black text-white tracking-tighter">In-Silico Repurposing Candidates</h5>
                          <p className="text-slate-400 text-sm font-medium max-w-xl leading-relaxed">
                            Analyzing shared protein targets and biological pathways to identify existing approved drugs (DrugBank/ChEMBL) with potential therapeutic overlap.
                          </p>
                       </div>
                       
                       {(!state.insight.repurposingCandidates || state.insight.repurposingCandidates.length === 0) && (
                          <div className="shrink-0">
                             <button 
                               onClick={handleRepurposingGeneration}
                               disabled={repurposingLoading}
                               className="bg-[#00f5d4] text-[#001a3d] px-8 py-4 rounded-[20px] font-black uppercase tracking-widest text-xs hover:bg-white hover:scale-105 transition-all flex items-center gap-3 disabled:opacity-50 disabled:pointer-events-none shadow-[0_0_30px_rgba(0,245,212,0.3)]"
                             >
                                {repurposingLoading ? (
                                  <><Loader2 className="animate-spin" size={16} /> Generating Hypotheses...</>
                                ) : (
                                  <><Sparkles size={16} /> Run Discovery Agent</>
                                )}
                             </button>
                          </div>
                       )}

                       {state.insight.repurposingCandidates && state.insight.repurposingCandidates.length > 0 && (
                          <div className="shrink-0 bg-white/10 backdrop-blur-md px-6 py-4 rounded-2xl border border-white/10 text-center animate-in zoom-in">
                              <span className="block text-2xl font-black text-white tracking-tighter mb-1">{state.insight.repurposingCandidates.length}</span>
                              <span className="text-[9px] text-[#00f5d4] font-black uppercase tracking-widest">Candidates Identified</span>
                           </div>
                       )}
                    </div>

                    {repurposingLoading && (
                      <div className="py-12 flex flex-col items-center justify-center text-center space-y-4 animate-in fade-in">
                          <div className="w-16 h-16 border-4 border-[#00f5d4]/20 border-t-[#00f5d4] rounded-full animate-spin"></div>
                          <p className="text-[#00f5d4] text-[10px] font-black uppercase tracking-widest animate-pulse">
                             Cross-referencing DrugBank mechanism overlap...
                          </p>
                      </div>
                    )}

                    {!repurposingLoading && state.insight.repurposingCandidates && state.insight.repurposingCandidates.length > 0 && (
                      <div className="grid grid-cols-1 gap-6 animate-in slide-in-from-bottom-10 fade-in duration-700">
                        {state.insight.repurposingCandidates.map((candidate, idx) => (
                          <div key={idx} className="bg-white rounded-[24px] p-8 border border-slate-200 shadow-lg relative overflow-hidden group hover:scale-[1.01] transition-transform duration-300">
                            <div className="absolute top-0 right-0 p-8 opacity-10 group-hover:opacity-20 transition-opacity">
                               <Pill size={120} className="text-[#0061ff] -rotate-12" />
                            </div>

                            <div className="relative z-10 grid grid-cols-1 lg:grid-cols-12 gap-8">
                               <div className="lg:col-span-4 space-y-6">
                                  <div>
                                     <div className="flex items-center gap-3 mb-2">
                                       <h6 className="text-2xl font-black text-[#001a3d] tracking-tighter">{candidate.drugName}</h6>
                                       <span className="px-3 py-1 bg-green-50 text-green-700 text-[10px] font-black uppercase tracking-widest rounded-full border border-green-200">Approved</span>
                                     </div>
                                     <span className="text-[11px] font-bold text-slate-500 uppercase tracking-wide">
                                       Original Indication: <span className="text-[#0061ff]">{candidate.originalIndication}</span>
                                     </span>
                                  </div>

                                  <div className="space-y-2">
                                    <div className="flex justify-between items-end">
                                      <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Feasibility Score</span>
                                      <span className="text-lg font-black text-[#001a3d]">{candidate.feasibilityScore}/100</span>
                                    </div>
                                    <div className="w-full h-2 bg-slate-100 rounded-full overflow-hidden">
                                       <div 
                                        className="h-full bg-gradient-to-r from-blue-500 to-emerald-400" 
                                        style={{ width: `${candidate.feasibilityScore}%` }} 
                                       />
                                    </div>
                                  </div>
                               </div>

                               <div className="lg:col-span-8 space-y-6">
                                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                     <div className="bg-slate-50 p-5 rounded-2xl border border-slate-100">
                                        <h6 className="text-[9px] font-black text-slate-400 uppercase tracking-widest mb-3 flex items-center gap-2">
                                           <Zap size={12} className="text-amber-500" /> Mechanism of Action
                                        </h6>
                                        <p className="text-xs font-bold text-slate-700 leading-relaxed">{candidate.mechanismOfAction}</p>
                                     </div>
                                     <div className="bg-blue-50/50 p-5 rounded-2xl border border-blue-100">
                                        <h6 className="text-[9px] font-black text-blue-400 uppercase tracking-widest mb-3 flex items-center gap-2">
                                           <BrainCircuit size={12} /> AI Rationale
                                        </h6>
                                        <p className="text-xs font-bold text-[#001a3d] leading-relaxed italic">"{candidate.rationale}"</p>
                                     </div>
                                  </div>

                                  <div>
                                     <h6 className="text-[9px] font-black text-slate-400 uppercase tracking-widest mb-3 flex items-center gap-2">
                                        <CheckCircle2 size={12} className="text-emerald-500" /> Validation Plan
                                     </h6>
                                     <ul className="grid grid-cols-1 md:grid-cols-2 gap-2">
                                        {candidate.validationSteps.map((step, sIdx) => (
                                          <li key={sIdx} className="flex items-start gap-2 text-[11px] font-medium text-slate-600">
                                             <ArrowRight size={12} className="text-slate-300 mt-0.5 shrink-0" /> {step}
                                          </li>
                                        ))}
                                     </ul>
                                  </div>
                               </div>
                            </div>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                </section>
                
                <section className="bg-white border border-slate-200 rounded-[32px] p-10 shadow-sm">
                   <MolecularNetwork {...getNetworkData()} />
                </section>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );

  return (
    <div className="min-h-screen bg-[#f8fafc] text-slate-600 font-sans selection:bg-blue-100 selection:text-blue-900 relative">
      <Suspense fallback={null}>
        <ScientificBackground />
      </Suspense>

      <nav className="sticky top-0 z-50 bg-white/80 backdrop-blur-md border-b border-slate-200 no-print">
        <div className="max-w-7xl mx-auto px-6 h-20 flex items-center justify-between">
          <div 
            className="flex items-center gap-3 cursor-pointer group"
            onClick={() => setView('home')}
          >
            <div className="w-10 h-10 bg-[#001a3d] rounded-xl flex items-center justify-center text-white shadow-lg group-hover:scale-105 transition-transform text-2xl">
              🧬
            </div>
            <div>
              <h1 className="text-xl font-black tracking-tighter text-[#001a3d] uppercase leading-none">Orphafold</h1>
              <p className="text-[9px] font-bold text-[#0061ff] uppercase tracking-[0.3em]">Genetic Structural Intelligence</p>
            </div>
          </div>

          <div className="flex items-center gap-1 bg-slate-100/50 p-1 rounded-2xl border border-slate-200/50">
            {[
              { id: 'home', label: 'Discovery Engine', icon: <Search size={14} /> },
              { id: 'documentation', label: 'How it works', icon: <FileText size={14} /> },
              { id: 'ethics', label: 'Ethics', icon: <ShieldCheck size={14} /> },
            ].map((item) => (
              <button
                key={item.id}
                onClick={() => setView(item.id as any)}
                className={`px-4 py-2.5 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all flex items-center gap-2 ${
                  view === item.id 
                  ? 'bg-white text-[#001a3d] shadow-sm' 
                  : 'text-slate-400 hover:text-slate-600 hover:bg-slate-200/50'
                }`}
              >
                {item.icon} {item.label}
              </button>
            ))}
          </div>
        </div>
      </nav>

      <main className="relative z-10 px-6 py-12 max-w-7xl mx-auto min-h-[calc(100vh-80px)]">
        {view === 'home' && renderHome()}
        {view === 'documentation' && renderDocumentation()}
        {view === 'ethics' && renderEthics()}
      </main>
      
      <footer className="py-12 border-t border-slate-200 bg-white relative z-10 no-print">
        <div className="max-w-7xl mx-auto px-6 flex flex-col md:flex-row justify-between items-center gap-6">
          <div className="flex items-center gap-2 opacity-50 grayscale hover:grayscale-0 transition-all">
            <div className="w-8 h-8 bg-[#001a3d] rounded-lg flex items-center justify-center text-white text-xl">
               🧬
            </div>
            <span className="text-xs font-black text-[#001a3d] uppercase tracking-widest">Orphafold AI</span>
          </div>
          <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest text-center">
            Built for the Google AI Hackathon 2025 • Powered by Gemini 3 Pro & AlphaFold
          </p>
          <div className="flex gap-4">
             <button className="text-slate-400 hover:text-[#001a3d] transition-colors"><MessageSquare size={16} /></button>
             <button className="text-slate-400 hover:text-[#001a3d] transition-colors"><GitBranch size={16} /></button>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default App;
