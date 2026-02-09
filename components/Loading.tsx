
/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
*/
import React, { useEffect, useState } from 'react';
import { Loader2, BrainCircuit, BookOpen, Atom, Lightbulb, ScrollText, Database, Dna, Microscope, Globe, Compass } from 'lucide-react';

interface LoadingProps {
  status: string;
  step: number;
  facts?: string[];
}

const Loading: React.FC<LoadingProps> = ({ status, step, facts = [] }) => {
  const [currentFactIndex, setCurrentFactIndex] = useState(0);
  
  useEffect(() => {
    if (facts.length > 0) {
      const interval = setInterval(() => {
        setCurrentFactIndex((prev) => (prev + 1) % facts.length);
      }, 3500);
      return () => clearInterval(interval);
    }
  }, [facts]);

  // A mix of Icons and Text flying into the center
  const FlyingItem = ({ delay, position, type, content }: { delay: number, position: number, type: 'icon' | 'text', content: any }) => {
    const startLeft = position % 2 === 0 ? '-20%' : '120%';
    const startTop = `${(position * 7) % 100}%`;
    
    return (
      <div 
        className={`absolute flex items-center justify-center font-bold opacity-0 select-none ${type === 'text' ? 'text-cyan-400 text-[8px] tracking-[0.2em] bg-white/10 border border-cyan-500/30 px-1.5 py-0.5 rounded backdrop-blur-sm' : 'text-amber-400'}`}
        style={{
          animation: `implode 2.5s infinite ease-in ${delay}s`,
          top: startTop,
          left: startLeft,
          zIndex: 10,
        }}
      >
        {type === 'icon' ? React.createElement(content, { className: "w-3 h-3 filter drop-shadow-[0_0_8px_rgba(251,191,36,0.5)]" }) : content}
      </div>
    );
  };

  return (
    <div className="relative w-full max-w-4xl mx-auto overflow-hidden rounded-[24px] bg-[#001a3d] border border-white/10 shadow-2xl flex flex-row items-center justify-between p-6 h-[180px]">
      
      <style>{`
        @keyframes implode {
          0% { transform: scale(1) rotate(0deg); opacity: 0; }
          10% { opacity: 1; }
          90% { opacity: 1; }
          100% { transform: scale(0.1) rotate(360deg); opacity: 0; top: 40%; left: 50%; }
        }
        @keyframes spin-slow {
          0% { transform: rotate(0deg); }
          100% { transform: rotate(360deg); }
        }
        @keyframes spin-reverse {
          0% { transform: rotate(360deg); }
          100% { transform: rotate(0deg); }
        }
        @keyframes pulse-core {
          0% { box-shadow: 0 0 0 0 rgba(6, 182, 212, 0.7); transform: scale(1); }
          70% { box-shadow: 0 0 0 20px rgba(6, 182, 212, 0); transform: scale(1.05); }
          100% { box-shadow: 0 0 0 0 rgba(6, 182, 212, 0); transform: scale(1); }
        }
      `}</style>

      {/* THE REACTOR CORE - LEFT SIDE */}
      <div className="relative w-1/3 h-full flex items-center justify-center scale-[0.6]">
        {/* Outer Rings */}
        <div className="absolute w-48 h-48 border border-dashed border-cyan-900/50 rounded-full animate-[spin-slow_20s_linear_infinite]"></div>
        <div className="absolute w-36 h-36 border-2 border-dashed border-cyan-500/20 rounded-full animate-[spin-slow_10s_linear_infinite]"></div>
        <div className="absolute w-28 h-28 border border-indigo-500/30 rounded-full animate-[spin-reverse_8s_linear_infinite]"></div>
        
        {/* Glowing Center */}
        <div className="relative bg-white/10 p-1 rounded-full shadow-[0_0_40px_rgba(6,182,212,0.4)] animate-[pulse-core_2s_infinite]">
           <div className="bg-[#000d1f] p-3 rounded-full flex items-center justify-center w-20 h-20 relative overflow-hidden border border-cyan-500/50">
              <div className="absolute inset-0 bg-gradient-to-br from-cyan-500 to-blue-600 opacity-30"></div>
              <Dna className="w-8 h-8 text-cyan-300 animate-pulse relative z-10" />
              {/* Inner beams */}
              <div className="absolute top-0 left-1/2 w-[1px] h-full bg-cyan-400/50 animate-[spin-slow_2s_linear_infinite]"></div>
              <div className="absolute top-1/2 left-0 h-[1px] w-full bg-cyan-400/50 animate-[spin-slow_2s_linear_infinite]"></div>
           </div>
        </div>

        {/* Flying Particles */}
        <div className="absolute inset-0 pointer-events-none">
           <FlyingItem content={BookOpen} type="icon" delay={0} position={1} />
           <FlyingItem content="HISTORY" type="text" delay={0.2} position={2} />
           <FlyingItem content={Microscope} type="icon" delay={0.5} position={3} />
           <FlyingItem content="SCIENCE" type="text" delay={0.7} position={4} />
           <FlyingItem content={Dna} type="icon" delay={1.0} position={5} />
           <FlyingItem content="FACTS" type="text" delay={1.2} position={6} />
        </div>
      </div>

      {/* Fact Display - RIGHT SIDE */}
      <div className="w-2/3 h-full flex flex-col justify-center pl-4 border-l border-white/5 relative">
        <div className="absolute top-0 right-0 p-3 opacity-20">
           <Atom size={64} className="text-cyan-500 animate-[spin-slow_30s_linear_infinite]" />
        </div>

        <div className="flex items-center gap-2 mb-3">
            {step === 1 && <Globe className="w-3 h-3 text-amber-400 animate-spin" />}
            {step === 2 && <Atom className="w-3 h-3 text-cyan-400 animate-spin" />}
            {step >= 3 && <Microscope className="w-3 h-3 text-emerald-400 animate-bounce" />}
            <h3 className="text-cyan-400 font-bold text-[9px] uppercase tracking-[0.2em] font-mono">
            {status}
            </h3>
        </div>

        <div className="bg-white/5 rounded-xl p-4 border border-white/5 relative overflow-hidden min-h-[80px] flex items-center">
            {facts.length > 0 ? (
            <div key={currentFactIndex} className="animate-in slide-in-from-bottom-2 fade-in duration-500 w-full">
                <p className="text-sm text-slate-200 font-medium leading-relaxed italic relative z-10">
                "{facts[currentFactIndex]}"
                </p>
            </div>
            ) : (
            <div className="flex items-center gap-2 text-slate-500 italic font-light text-xs">
                <Loader2 className="w-3 h-3 animate-spin" />
                <span>Establishing connection...</span>
            </div>
            )}
        </div>
        
        {/* Progress Bar */}
        <div className="w-full h-1 bg-slate-800 mt-4 rounded-full overflow-hidden">
            <div 
              className="h-full bg-gradient-to-r from-amber-400 via-cyan-500 to-emerald-500 transition-all duration-1000 ease-out relative overflow-hidden shadow-[0_0_10px_rgba(6,182,212,0.8)]"
              style={{ width: `${step * 20 + 10}%` }}
            >
                <div className="absolute inset-0 bg-white/50 animate-[shimmer_1s_infinite]"></div>
            </div>
        </div>
      </div>

      <style>{`
          @keyframes shimmer {
              0% { transform: translateX(-100%); }
              100% { transform: translateX(100%); }
          }
      `}</style>

    </div>
  );
};

export default Loading;
