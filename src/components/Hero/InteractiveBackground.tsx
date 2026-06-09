import { useRef, useMemo, useEffect, useState } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { OrbitControls } from '@react-three/drei';
import * as THREE from 'three';
import styles from './Hero.module.css';

function SpiralGalaxy() {
  const pointsRef = useRef<THREE.Points>(null);
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 992);
    };
    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  const count = isMobile ? 2000 : 4000;
  const radius = 4.2;
  const arms = 3;

  // Generate spiral galaxy particles mathematically
  const [positions, colors] = useMemo(() => {
    const pos = new Float32Array(count * 3);
    const cols = new Float32Array(count * 3);

    const colorCore = new THREE.Color('#ffdf7a'); // Champagne Gold Core
    const colorOuter = new THREE.Color('#004d40'); // Deep Space Teal Outer

    for (let i = 0; i < count; i++) {
      // Distance from center (exponential distribution for dense core)
      const r = Math.pow(Math.random(), 2.2) * radius;

      // Spiral angle twist
      const spinAngle = r * 1.35;
      const armAngle = ((i % arms) * 2 * Math.PI) / arms;
      const angle = armAngle + spinAngle;

      // 3D dispersion factor (denser near center, dispersing out)
      const spread = 0.25 * (radius - r) * 0.4;
      const randomX = Math.pow(Math.random(), 3) * (Math.random() < 0.5 ? 1 : -1) * spread;
      const randomY = Math.pow(Math.random(), 3) * (Math.random() < 0.5 ? 1 : -1) * spread;
      const randomZ = Math.pow(Math.random(), 3) * (Math.random() < 0.5 ? 1 : -1) * spread;

      pos[i * 3] = Math.cos(angle) * r + randomX;
      pos[i * 3 + 1] = randomY;
      pos[i * 3 + 2] = Math.sin(angle) * r + randomZ;

      // Color interpolation from gold core to space teal
      const mixedColor = colorCore.clone().lerp(colorOuter, r / radius);
      cols[i * 3] = mixedColor.r;
      cols[i * 3 + 1] = mixedColor.g;
      cols[i * 3 + 2] = mixedColor.b;
    }

    return [pos, cols];
  }, [count]);

  useFrame((state) => {
    if (pointsRef.current) {
      // Rotation speed matching cinematic cosmic drift
      pointsRef.current.rotation.y = state.clock.getElapsedTime() * 0.06;
      // Gentle sinusoidal tilt wave
      pointsRef.current.rotation.z = Math.sin(state.clock.getElapsedTime() * 0.25) * 0.08;
    }
  });

  // Position: right side on desktop, center on mobile
  const position: [number, number, number] = isMobile ? [0, -0.4, -0.5] : [1.3, 0, 0];

  return (
    <points ref={pointsRef} position={position}>
      <bufferGeometry>
        <bufferAttribute
          attach="attributes-position"
          args={[positions, 3]}
        />
        <bufferAttribute
          attach="attributes-color"
          args={[colors, 3]}
        />
      </bufferGeometry>
      <pointsMaterial
        size={isMobile ? 0.038 : 0.048}
        vertexColors
        transparent
        opacity={0.8}
        depthWrite={false}
        blending={THREE.AdditiveBlending}
        sizeAttenuation={true}
      />
    </points>
  );
}

export default function InteractiveBackground() {
  const isVisibleRef = useRef(true);
  const containerRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    // Suspend cycle on scroll out
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          isVisibleRef.current = entry.isIntersecting;
        });
      },
      { threshold: 0.1 }
    );
    observer.observe(container);

    return () => {
      observer.disconnect();
    };
  }, []);

  return (
    <div ref={containerRef} className={styles.canvasBackgroundContainer}>
      <Canvas
        camera={{ position: [0, 1.8, 3.8], fov: 60 }}
        onCreated={({ gl }) => {
          gl.setClearColor('#040404');
        }}
      >
        <SpiralGalaxy />
        <OrbitControls
          enableZoom={false}
          enablePan={false}
          enableDamping
          dampingFactor={0.05}
        />
      </Canvas>
    </div>
  );
}
