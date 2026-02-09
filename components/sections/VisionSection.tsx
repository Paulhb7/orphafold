import React from 'react';
import { Eye, Lightbulb, Zap, Users, Globe, Microscope, TrendingUp, ChevronRight } from 'lucide-react';

const VisionSection: React.FC = () => {
    return (
        <div className="max-w-5xl mx-auto py-16 animate-in fade-in slide-in-from-bottom-10">
            {/* Header */}
            <div className="mb-20 text-center">
                <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-50 border border-blue-100 text-blue-600 text-[10px] font-black uppercase tracking-widest mb-6">
                    <Eye size={12} /> Our Vision • Prototype PoC
                </div>
                <h2 className="text-6xl font-black mb-8 tracking-tighter text-[#001a3d] leading-[0.9]">
                    A Research <span className="text-[#0061ff]">Prototype</span> to Accelerate the Orphan Odyssey.
                </h2>
                <p className="text-xl text-slate-500 font-medium leading-relaxed max-w-3xl mx-auto">
                    OrphaFold is a proof-of-concept designed to help researchers navigate the complex landscape of rare disease data.
                </p>
            </div>

            <div className="space-y-24">
                {/* The Problem */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-16 items-center">
                    <div className="space-y-6">
                        <h3 className="text-3xl font-black text-[#001a3d] tracking-tighter uppercase">The "Data Desert" Problem</h3>
                        <p className="text-slate-600 leading-relaxed font-medium">
                            Today, 300 million people live with a rare disease. Yet, 95% of these 7,000+ conditions have no approved treatment due to a massive lack of funding and structural research barriers.
                        </p>
                        <ul className="space-y-4">
                            {[
                                { icon: <Globe size={18} />, title: "Fragmented Knowledge", text: "Crucial insights are trapped in data silos across disconnected registries and thousands of papers." },
                                { icon: <TrendingUp size={18} />, title: "Economic Barriers", text: "Traditional R&D costs prevent investment in ultra-rare indications with small patient populations." },
                                { icon: <Users size={18} />, title: "Diagnostic Odyssey", text: "Patients wait on average 5 years for a diagnosis due to missing structural markers." }
                            ].map((item, i) => (
                                <li key={i} className="flex gap-4">
                                    <div className="mt-1 text-[#0061ff]">{item.icon}</div>
                                    <div>
                                        <h4 className="text-sm font-black text-[#001a3d] uppercase tracking-tight">{item.title}</h4>
                                        <p className="text-xs text-slate-500 font-medium">{item.text}</p>
                                    </div>
                                </li>
                            ))}
                        </ul>
                    </div>
                    <div className="relative">
                        <div className="aspect-square bg-slate-100 rounded-[48px] overflow-hidden relative border border-slate-200 shadow-2xl rotate-3 group hover:rotate-0 transition-all duration-700">
                            <div className="absolute inset-0 bg-gradient-to-br from-blue-500/10 to-emerald-500/10" />
                            <div className="absolute inset-0 flex items-center justify-center">
                                <div className="text-[240px] opacity-80 group-hover:opacity-100 transition-all duration-700 grayscale group-hover:grayscale-0">🔬</div>
                            </div>
                            <div className="absolute bottom-8 left-8 right-8 p-6 bg-white/80 backdrop-blur-md rounded-3xl border border-slate-200">
                                <p className="text-xs font-bold text-slate-600 italic flex items-center gap-2">
                                    <span>🔍</span> "Siloed data remains one of the largest structural bottlenecks in the search for rare disease treatments."
                                </p>
                            </div>
                        </div>
                    </div>
                </div>

                {/* The Solution */}
                <div className="bg-[#001a3d] rounded-[48px] p-12 text-white relative overflow-hidden group">
                    <div className="absolute top-0 right-0 w-96 h-96 bg-[#0061ff] rounded-full blur-[120px] opacity-20 -mr-48 -mt-48" />

                    <div className="relative z-10 max-w-3xl">
                        <h3 className="text-4xl font-black tracking-tighter uppercase mb-8">Our Approach: <span className="text-[#00f5d4]">Structural Intelligence</span></h3>
                        <p className="text-lg text-white/70 font-medium leading-relaxed mb-10">
                            OrphaFold acts as a <strong>Proof of Concept (PoC)</strong> that leverages the intersection of large language models and structural biology to provide researchers with a unified tool for exploration.
                        </p>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                            <div className="space-y-4">
                                <div className="p-4 bg-white/5 border border-white/10 rounded-2xl">
                                    <h4 className="flex items-center gap-2 text-sm font-black uppercase tracking-widest text-[#00f5d4] mb-2">
                                        <Zap size={16} /> Rapid Synthesis
                                    </h4>
                                    <p className="text-xs text-white/60 leading-relaxed font-medium">Accelerating information synthesis by orchestrating specialized agents to aggregate data from fragmented sources.</p>
                                </div>
                            </div>
                            <div className="space-y-4">
                                <div className="p-4 bg-white/5 border border-white/10 rounded-2xl">
                                    <h4 className="flex items-center gap-2 text-sm font-black uppercase tracking-widest text-[#00f5d4] mb-2">
                                        <Microscope size={16} /> Mechanics-First
                                    </h4>
                                    <p className="text-xs text-white/60 leading-relaxed font-medium">Prioritizing protein structures and pathogenic variations as a key mechanistic baseline for discovery.</p>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                {/* The Goal */}
                <div className="text-center space-y-12">
                    <h3 className="text-3xl font-black text-[#001a3d] tracking-tighter uppercase">Democratizing Drug Repurposing</h3>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                        {[
                            { title: "Identify", desc: "Discover hidden connections between existing drugs and rare proteins." },
                            { title: "Validate", desc: "Score candidates based on molecular feasibility and pLDDT confidence." },
                            { title: "Accelerate", desc: "Provide researchers with actionable roadmaps for wet-lab verification." }
                        ].map((goal, i) => (
                            <div key={i} className="p-8 bg-white border border-slate-100 rounded-[32px] shadow-sm hover:shadow-md transition-shadow">
                                <h4 className="text-lg font-black text-[#001a3d] mb-2 uppercase tracking-tight">{goal.title}</h4>
                                <p className="text-sm text-slate-500 font-medium leading-relaxed">{goal.desc}</p>
                            </div>
                        ))}
                    </div>
                </div>

                {/* Call to Action */}
                <div className="pt-12 text-center border-t border-slate-200">
                    <p className="text-slate-400 font-bold text-[10px] uppercase tracking-[0.4em] mb-4">OrphaFold Mission 2026</p>
                    <p className="text-2xl font-black text-[#001a3d] tracking-tighter">Exploring the unknown, for the many.</p>
                </div>
            </div>
        </div>
    );
};

export default VisionSection;
