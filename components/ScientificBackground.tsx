import React, { useRef, useMemo, Suspense } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { Float, MeshDistortMaterial, Sphere, PerspectiveCamera } from '@react-three/drei';
import * as THREE from 'three';
import { DiseaseInsight } from '../types';

// Fix for missing R3F JSX type definitions in TypeScript environment
// We augment both global JSX and React.JSX to cover different React/TS versions
declare global {
  namespace JSX {
    interface IntrinsicElements {
      mesh: any;
      sphereGeometry: any;
      meshBasicMaterial: any;
      group: any;
      // line: any; // Removed to avoid conflict with SVG 'line'
      bufferGeometry: any;
      bufferAttribute: any;
      lineBasicMaterial: any;
      points: any;
      pointsMaterial: any;
      ambientLight: any;
      pointLight: any;
    }
  }
}

declare module 'react' {
  namespace JSX {
    interface IntrinsicElements {
      mesh: any;
      sphereGeometry: any;
      meshBasicMaterial: any;
      group: any;
      // line: any; // Removed to avoid conflict with SVG 'line'
      bufferGeometry: any;
      bufferAttribute: any;
      lineBasicMaterial: any;
      points: any;
      pointsMaterial: any;
      ambientLight: any;
      pointLight: any;
    }
  }
}

const OrganicShape = ({ position, color, speed, distort, radius }: any) => {
  return (
    <Float speed={speed} rotationIntensity={2} floatIntensity={2}>
      <mesh position={position}>
        <sphereGeometry args={[radius, 64, 64]} />
        <MeshDistortMaterial
          color={color}
          speed={speed}
          distort={distort}
          transparent
          opacity={0.15}
          roughness={0.2}
          metalness={0.1}
        />
      </mesh>
    </Float>
  );
};

const MolecularLink = () => {
  const groupRef = useRef<THREE.Group>(null);

  useFrame((state) => {
    if (groupRef.current) {
      groupRef.current.rotation.y += 0.001;
      groupRef.current.rotation.x += 0.0005;
    }
  });

  const points = useMemo(() => {
    return Array.from({ length: 15 }, () => ({
      pos: new THREE.Vector3(
        (Math.random() - 0.5) * 20,
        (Math.random() - 0.5) * 20,
        (Math.random() - 0.5) * 10 - 5
      ),
      size: Math.random() * 0.15 + 0.05
    }));
  }, []);

  return (
    <group ref={groupRef}>
      {points.map((p, i) => (
        <mesh key={i} position={p.pos}>
          <sphereGeometry args={[p.size, 16, 16]} />
          <meshBasicMaterial color="#7B68EE" transparent opacity={0.1} />
        </mesh>
      ))}
      {points.map((p, i) => (
        i < points.length - 1 ? (
          // @ts-ignore
          <line key={`l-${i}`}>
            <bufferGeometry>
              <bufferAttribute
                attach="attributes-position"
                count={2}
                array={new Float32Array([
                  p.pos.x, p.pos.y, p.pos.z,
                  points[i + 1].pos.x, points[i + 1].pos.y, points[i + 1].pos.z
                ])}
                itemSize={3}
              />
            </bufferGeometry>
            <lineBasicMaterial color="#4285F4" transparent opacity={0.05} />
          </line>
        ) : null
      ))}
    </group>
  );
};

const Particles = ({ count = 40 }) => {
  const mesh = useRef<THREE.Points>(null);

  const particles = useMemo(() => {
    const positions = new Float32Array(count * 3);
    for (let i = 0; i < count; i++) {
      positions[i * 3] = (Math.random() - 0.5) * 30;
      positions[i * 3 + 1] = (Math.random() - 0.5) * 30;
      positions[i * 3 + 2] = (Math.random() - 0.5) * 20;
    }
    return positions;
  }, [count]);

  useFrame((state) => {
    if (mesh.current) {
      mesh.current.rotation.y += 0.0005;
    }
  });

  return (
    <points ref={mesh}>
      <bufferGeometry>
        <bufferAttribute
          attach="attributes-position"
          count={particles.length / 3}
          array={particles}
          itemSize={3}
        />
      </bufferGeometry>
      <pointsMaterial
        size={0.08}
        color="#00BFA5"
        transparent
        opacity={0.2}
        sizeAttenuation
      />
    </points>
  );
};

interface ScientificBackgroundProps {
  insight: DiseaseInsight;
  loading: boolean;
  onGenerateRepurposing: () => void;
}

const ScientificBackground: React.FC<ScientificBackgroundProps> = ({ insight, loading, onGenerateRepurposing }) => {
  return (
    <div className="relative w-full min-h-[600px] rounded-[32px] overflow-hidden border border-slate-200 bg-slate-900">
      <div className="absolute inset-0 z-0">
        <Suspense fallback={null}>
          <Canvas dpr={[1, 2]} camera={{ position: [0, 0, 15], fov: 50 }}>
            <ambientLight intensity={1.5} />
            <pointLight position={[10, 10, 10]} intensity={1} color="#4285F4" />
            <pointLight position={[-10, -10, 10]} intensity={1} color="#00BFA5" />

            <OrganicShape position={[-6, 4, -5]} color="#4285F4" speed={1} distort={0.4} radius={2.5} />
            <OrganicShape position={[7, -5, -2]} color="#7B68EE" speed={0.8} distort={0.5} radius={3.2} />
            <OrganicShape position={[2, 6, -8]} color="#00BFA5" speed={1.2} distort={0.3} radius={2} />

            <MolecularLink />
            <Particles count={60} />
          </Canvas>
        </Suspense>
      </div>

      <div className="relative z-10 p-10 h-full flex flex-col items-center justify-center text-center space-y-8">
        <div className="max-w-2xl space-y-6 bg-white/10 backdrop-blur-md p-8 rounded-3xl border border-white/20 shadow-2xl">
          <h2 className="text-3xl font-black text-white tracking-tight">Hypothesis Lab</h2>
          <p className="text-slate-200 text-sm leading-relaxed font-medium">
            Use our AI-driven engine to generate drug repurposing candidates for <span className="text-[#4285F4] font-bold">{insight.name}</span> based on the identified molecular mechanisms and cellular vulnerabilities.
          </p>

          {loading ? (
            <div className="flex flex-col items-center gap-4 py-8">
              <div className="animate-spin rounded-full h-10 w-10 border-4 border-blue-500 border-t-transparent"></div>
              <span className="text-blue-200 font-bold uppercase tracking-widest text-xs animate-pulse">Running Simulation...</span>
            </div>
          ) : (
            <button
              onClick={onGenerateRepurposing}
              className="group relative inline-flex items-center justify-center px-8 py-4 font-bold text-white transition-all duration-200 bg-blue-600 font-lg rounded-2xl hover:bg-blue-500 focus:outline-none ring-offset-2 focus:ring-2 ring-blue-400"
            >
              <span>Generate Repurposing Hypotheses</span>
              <div className="absolute inset-0 rounded-2xl ring-2 ring-white/20 group-hover:ring-white/40 transition-all" />
            </button>
          )}
        </div>

        {insight.repurposingCandidates && insight.repurposingCandidates.length > 0 && (
          <div className="w-full max-w-4xl grid grid-cols-1 md:grid-cols-2 gap-4 animate-in fade-in slide-in-from-bottom-5 duration-700">
            {insight.repurposingCandidates.map((candidate, idx) => (
              <div key={idx} className="bg-white/95 backdrop-blur-sm p-6 rounded-2xl border border-slate-200 text-left shadow-lg hover:transform hover:scale-[1.02] transition-all">
                <div className="flex justify-between items-start mb-2">
                  <h4 className="font-black text-[#001a3d] text-lg">{candidate.drugName}</h4>
                  <span className="px-3 py-1 bg-emerald-100 text-emerald-700 rounded-lg text-xs font-bold uppercase tracking-wider">
                    Score: {candidate.feasibilityScore}
                  </span>
                </div>
                <p className="text-xs text-slate-500 font-bold mb-3 uppercase tracking-wide">{candidate.mechanismOfAction}</p>
                <p className="text-xs text-slate-700 leading-relaxed border-l-2 border-blue-500 pl-3">
                  {candidate.rationale}
                </p>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default ScientificBackground;