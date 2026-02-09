import React, { useRef, useMemo, Suspense } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { Float, MeshDistortMaterial, Sphere, PerspectiveCamera } from '@react-three/drei';
import * as THREE from 'three';

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
                  points[i+1].pos.x, points[i+1].pos.y, points[i+1].pos.z
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

const ScientificBackground: React.FC = () => {
  return (
    <div className="fixed inset-0 z-0 pointer-events-none opacity-40">
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
  );
};

export default ScientificBackground;