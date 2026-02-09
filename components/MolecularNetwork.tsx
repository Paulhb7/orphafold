
import React, { useEffect, useRef, useState } from 'react';
import * as d3 from 'd3';
import { NetworkNode, NetworkLink } from '../types';
import { Activity, Maximize2, Minimize2, X } from 'lucide-react';

interface Props {
  nodes: NetworkNode[];
  links: NetworkLink[];
}

const MolecularNetwork: React.FC<Props> = ({ nodes, links }) => {
  const svgRef = useRef<SVGSVGElement>(null);
  const [isFullscreen, setIsFullscreen] = useState(false);

  useEffect(() => {
    if (!svgRef.current || nodes.length === 0) return;

    const width = isFullscreen ? window.innerWidth * 0.9 : 800;
    const height = isFullscreen ? window.innerHeight * 0.8 : 600;

    const svg = (d3 as any).select(svgRef.current)
      .attr('viewBox', `0 0 ${width} ${height}`)
      .html(''); 

    const simulation = (d3 as any).forceSimulation(nodes)
      .force('link', (d3 as any).forceLink(links).id((d: any) => d.id).distance((d: any) => {
          if (d.type === 'variant') return 40;
          return isFullscreen ? 180 : 120;
      }))
      .force('charge', (d3 as any).forceManyBody().strength(isFullscreen ? -800 : -400))
      .force('center', (d3 as any).forceCenter(width / 2, height / 2))
      .force('collision', (d3 as any).forceCollide().radius(isFullscreen ? 60 : 40));

    const link = svg.append('g')
      .selectAll('line')
      .data(links)
      .enter().append('line')
      .attr('stroke', '#E5E7EB')
      .attr('stroke-width', 1.5)
      .attr('stroke-dasharray', (d: any) => {
          const sourceId = typeof d.source === 'string' ? d.source : d.source.id;
          const sourceNode = nodes.find(n => n.id === sourceId);
          return sourceNode?.type === 'variant' ? '4,4' : '0';
      });

    const node = svg.append('g')
      .selectAll('g')
      .data(nodes)
      .enter().append('g')
      .call((d3 as any).drag()
        .on('start', (event: any, d: any) => {
          if (!event.active) simulation.alphaTarget(0.3).restart();
          d.fx = d.x;
          d.fy = d.y;
        })
        .on('drag', (event: any, d: any) => {
          d.fx = event.x;
          d.fy = event.y;
        })
        .on('end', (event: any, d: any) => {
          if (!event.active) simulation.alphaTarget(0);
          d.fx = null;
          d.fy = null;
        }));

    // Glow Filter
    const filter = svg.append('defs')
      .append('filter')
      .attr('id', 'glow')
      .attr('x', '-50%')
      .attr('y', '-50%')
      .attr('width', '200%')
      .attr('height', '200%');
    
    filter.append('feGaussianBlur')
      .attr('stdDeviation', '3.5')
      .attr('result', 'coloredBlur');
    
    const feMerge = filter.append('feMerge');
    feMerge.append('feMergeNode').attr('in', 'coloredBlur');
    feMerge.append('feMergeNode').attr('in', 'SourceGraphic');

    node.append('circle')
      .attr('r', (d: any) => {
        const base = isFullscreen ? 1.5 : 1;
        if (d.type === 'disease') return 18 * base;
        if (d.type === 'protein') return 12 * base;
        if (d.type === 'variant') return 6 * base;
        return 9 * base;
      })
      .attr('fill', (d: any) => {
        if (d.type === 'disease') return '#7B68EE';
        if (d.type === 'protein') return '#4285F4';
        if (d.type === 'variant') return '#00BFA5';
        if (d.type === 'drug') return '#6366f1';
        return '#94a3b8';
      })
      .attr('stroke', '#FFFFFF')
      .attr('stroke-width', 3)
      .style('filter', 'url(#glow)');

    node.append('text')
      .text((d: any) => d.label)
      .attr('x', isFullscreen ? 32 : 24)
      .attr('y', 4)
      .attr('fill', '#374151')
      .attr('font-size', (d: any) => {
        const size = isFullscreen ? 1.4 : 1;
        return (d.type === 'disease' ? 14 : 10) * size + 'px';
      })
      .attr('font-weight', (d: any) => d.type === 'disease' ? '800' : '600')
      .attr('class', 'select-none pointer-events-none uppercase tracking-wider');

    simulation.on('tick', () => {
      link
        .attr('x1', (d: any) => d.source.x)
        .attr('y1', (d: any) => d.source.y)
        .attr('x2', (d: any) => d.target.x)
        .attr('y2', (d: any) => d.target.y);

      node.attr('transform', (d: any) => `translate(${d.x},${d.y})`);
    });

    return () => simulation.stop();
  }, [nodes, links, isFullscreen]);

  return (
    <>
      <div className={`glass-card rounded-[32px] overflow-hidden p-8 hover:shadow-2xl transition-all duration-500 ${isFullscreen ? 'hidden' : 'block'}`}>
        <div className="flex items-center justify-between mb-8">
          <h3 className="text-xs font-extrabold text-gray-900 uppercase tracking-[0.2em] flex items-center gap-3">
              <Activity size={18} className="text-blue-500" />
              Bio-Relationship Graph
          </h3>
          <button 
            onClick={() => setIsFullscreen(true)}
            className="p-2 hover:bg-gray-100 rounded-xl transition-colors text-gray-400 hover:text-blue-500"
            title="Expand graph"
          >
            <Maximize2 size={16} />
          </button>
        </div>
        <div className="flex gap-4 text-[9px] font-extrabold uppercase tracking-widest text-gray-400 mb-6">
            <span className="flex items-center gap-1.5"><span className="w-2 h-2 rounded-full bg-[#7B68EE]" /> Disease</span>
            <span className="flex items-center gap-1.5"><span className="w-2 h-2 rounded-full bg-[#4285F4]" /> Protein</span>
            <span className="flex items-center gap-1.5"><span className="w-2 h-2 rounded-full bg-[#00BFA5]" /> Variant</span>
        </div>
        <svg ref={svgRef} className="w-full h-auto max-h-[500px] cursor-grab active:cursor-grabbing" />
      </div>

      {isFullscreen && (
        <div className="fixed inset-0 z-[100] bg-white/95 backdrop-blur-xl p-10 flex flex-col animate-in fade-in zoom-in-95">
          <div className="flex items-center justify-between mb-10">
            <div>
              <h2 className="text-2xl font-black text-gray-900 uppercase tracking-tighter">Interactive Molecular Exploration</h2>
              <p className="text-xs font-bold text-gray-400 uppercase tracking-widest mt-1">Orphafold Discovery Graph View</p>
            </div>
            <button 
              onClick={() => setIsFullscreen(false)}
              className="p-4 bg-gray-100 hover:bg-red-50 hover:text-red-500 rounded-2xl transition-all"
            >
              <X size={24} />
            </button>
          </div>
          
          <div className="flex gap-8 mb-10 text-[10px] font-extrabold uppercase tracking-widest">
            <span className="flex items-center gap-2 bg-indigo-50 text-indigo-600 px-4 py-2 rounded-xl border border-indigo-100"><span className="w-3 h-3 rounded-full bg-[#7B68EE]" /> Disease</span>
            <span className="flex items-center gap-2 bg-blue-50 text-blue-600 px-4 py-2 rounded-xl border border-blue-100"><span className="w-3 h-3 rounded-full bg-[#4285F4]" /> Protein</span>
            <span className="flex items-center gap-2 bg-emerald-50 text-emerald-600 px-4 py-2 rounded-xl border border-emerald-100"><span className="w-3 h-3 rounded-full bg-[#00BFA5]" /> Variant</span>
            <span className="flex items-center gap-2 bg-slate-50 text-slate-600 px-4 py-2 rounded-xl border border-slate-100"><span className="w-3 h-3 rounded-full bg-slate-400" /> Others</span>
          </div>

          <div className="flex-1 bg-gray-50/50 border border-gray-100 rounded-[40px] relative overflow-hidden">
             <svg ref={svgRef} className="w-full h-full cursor-grab active:cursor-grabbing" />
             <div className="absolute bottom-8 right-8 text-[10px] font-bold text-gray-300 uppercase tracking-widest pointer-events-none">
               Hold and drag to explore relationships
             </div>
          </div>
        </div>
      )}
    </>
  );
};

export default MolecularNetwork;
