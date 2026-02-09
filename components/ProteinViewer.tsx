
import React, { useEffect, useRef, useState } from 'react';
import { Loader2, Box, Info, ExternalLink } from 'lucide-react';

interface Props {
  uniprotId: string;
}

const ProteinViewer: React.FC<Props> = ({ uniprotId }) => {
  const viewerRef = useRef<HTMLDivElement>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);
  const [statusMsg, setStatusMsg] = useState('Initializing...');

  useEffect(() => {
    let viewer: any = null;
    const cleanId = uniprotId.trim().toUpperCase();

    const initViewer = async () => {
      if (!viewerRef.current) return;
      setLoading(true);
      setError(false);
      setStatusMsg('Fetching structure metadata...');

      try {
        // 1. Ensure jQuery and 3Dmol are loaded
        if (!(window as any).$) {
          const jquery = await import('jquery');
          const jQueryLib = jquery.default || jquery;
          (window as any).$ = (window as any).jQuery = jQueryLib;
        }

        const mod = await import('3dmol');
        const $3Dmol = (window as any).$3Dmol || mod.default || mod;
        
        if (!$3Dmol || typeof $3Dmol.createViewer !== 'function') {
          throw new Error('3Dmol library failed to initialize.');
        }

        // 2. Fetch AlphaFold Prediction metadata to get the correct PDB URL
        // Using the public AlphaFold API is more reliable than guessing the filename
        const apiResponse = await fetch(`https://alphafold.ebi.ac.uk/api/prediction/${cleanId}`);
        let pdbUrl = `https://alphafold.ebi.ac.uk/files/AF-${cleanId}-F1-model_v4.pdb`; // Default fallback

        if (apiResponse.ok) {
          const apiData = await apiResponse.json();
          if (apiData && apiData.length > 0 && apiData[0].pdbUrl) {
            pdbUrl = apiData[0].pdbUrl;
          }
        }

        setStatusMsg('Downloading PDB data...');
        const pdbResponse = await fetch(pdbUrl);
        if (!pdbResponse.ok) {
           // Try one last fallback with v3 if v4 fails and API didn't help
           const v3Url = pdbUrl.replace('_v4.pdb', '_v3.pdb');
           const v3Response = await fetch(v3Url);
           if (!v3Response.ok) throw new Error(`PDB file not found for ${cleanId}`);
           pdbUrl = v3Url;
        }
        
        const pdbData = await pdbResponse.text();

        // 3. Setup Viewer
        viewer = $3Dmol.createViewer(viewerRef.current, {
          backgroundColor: '#f9fafb',
        });

        viewer.addModel(pdbData, 'pdb');
        viewer.setStyle({}, { cartoon: { color: 'spectrum' } });
        viewer.zoomTo();
        viewer.render();
        
        // Add a gentle rotation animation
        viewer.animate({ loop: 'backAndForth', step: 0.3 });
        
        setLoading(false);
      } catch (err) {
        console.error('3Dmol Error:', err);
        setError(true);
        setLoading(false);
      }
    };

    initViewer();

    return () => {
      if (viewer) {
        try { viewer.clear(); } catch (e) {}
      }
    };
  }, [uniprotId]);

  return (
    <div className="relative w-full h-[350px] bg-gray-50 rounded-3xl overflow-hidden border border-gray-100 group shadow-inner">
      <div className="absolute top-4 left-4 z-10 flex items-center gap-2 bg-white/90 backdrop-blur-md px-3 py-1.5 rounded-xl border border-gray-100 shadow-sm transition-all group-hover:scale-105">
        <Box size={14} className="text-blue-500" />
        <span className="text-[10px] font-extrabold text-gray-800 uppercase tracking-widest">AlphaFold 3D Structure</span>
      </div>
      
      {loading && (
        <div className="absolute inset-0 flex flex-col items-center justify-center bg-gray-50 gap-4 z-20">
          <Loader2 className="animate-spin text-blue-500" size={32} />
          <span className="text-[10px] text-gray-400 font-extrabold uppercase tracking-widest animate-pulse">{statusMsg}</span>
        </div>
      )}

      {error && (
        <div className="absolute inset-0 flex flex-col items-center justify-center bg-gray-50 px-8 text-center space-y-4 z-20">
          <div className="w-12 h-12 bg-red-50 text-red-400 rounded-2xl flex items-center justify-center">
            <Info size={24} />
          </div>
          <div className="space-y-1">
            <p className="text-[11px] text-gray-600 font-bold uppercase tracking-widest">
              Structure unavailable
            </p>
            <p className="text-[10px] text-gray-400 font-medium leading-relaxed">
              We couldn't retrieve the 3D model for ID: {uniprotId}.
            </p>
          </div>
          <a 
            href={`https://alphafold.ebi.ac.uk/entry/${uniprotId}`} 
            target="_blank" 
            className="flex items-center gap-2 bg-white px-4 py-2 rounded-xl text-[10px] font-bold text-blue-600 border border-blue-100 shadow-sm hover:bg-blue-50 transition-colors"
          >
            Open AlphaFold DB <ExternalLink size={12} />
          </a>
        </div>
      )}

      <div ref={viewerRef} className="w-full h-full" />
      
      {!loading && !error && (
        <div className="absolute bottom-4 right-4 text-[9px] font-bold text-gray-300 uppercase tracking-widest pointer-events-none opacity-0 group-hover:opacity-100 transition-opacity">
          Drag to rotate • Scroll to zoom
        </div>
      )}
    </div>
  );
};

export default ProteinViewer;
