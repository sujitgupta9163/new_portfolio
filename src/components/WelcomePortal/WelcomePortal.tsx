import { useState, useEffect, useRef } from 'react';
import * as THREE from 'three';
import styles from './WelcomePortal.module.css';

interface WelcomePortalProps {
  onEnter: () => void;
}

export default function WelcomePortal({ onEnter }: WelcomePortalProps) {
  const [logs, setLogs] = useState<string[]>([]);
  const [showButton, setShowButton] = useState(false);
  const [fadeOut, setFadeOut] = useState(false);
  const canvasRef = useRef<HTMLCanvasElement>(null);

  const logSequence = [
    'SYSTEM READY: SUJIT_PORTFOLIO v2.0',
    'CONNECTING TO THREE.JS WEBGL RENDERER...',
    'INITIALIZING FRONTEND CORE (REACT & TAILWIND)...',
    'LOADING HIGH-FIDELITY ASSETS & STYLES...',
    'COMPILING 3D DATA GEOMETRIES...',
    'ACCESS STATUS: GRANTED'
  ];

  // Terminal Log sequence simulation
  useEffect(() => {
    let currentLogIndex = 0;
    const interval = setInterval(() => {
      if (currentLogIndex < logSequence.length) {
        setLogs((prev) => [...prev, logSequence[currentLogIndex]]);
        currentLogIndex++;
      } else {
        clearInterval(interval);
        setShowButton(true);
      }
    }, 350);

    return () => clearInterval(interval);
  }, []);

  // Three.js 3D Wireframe Loader Animation
  useEffect(() => {
    if (!canvasRef.current) return;

    const canvas = canvasRef.current;
    const width = canvas.clientWidth;
    const height = canvas.clientHeight;

    // 1. Scene & Camera Setup
    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(45, width / height, 0.1, 100);
    camera.position.z = 8;

    // 2. WebGL Renderer
    const renderer = new THREE.WebGLRenderer({
      canvas: canvas,
      alpha: true,
      antialias: true
    });
    renderer.setSize(width, height);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));

    // 3. Geometry - Premium Torus Knot Wireframe
    const geometry = new THREE.TorusKnotGeometry(1.6, 0.45, 120, 16);
    const material = new THREE.MeshBasicMaterial({
      color: 0xd4af37, // Champagne Gold
      wireframe: true,
      transparent: true,
      opacity: 0.15 // Soft grid aesthetic
    });
    const torusKnot = new THREE.Mesh(geometry, material);
    scene.add(torusKnot);

    // Inner glowing core sphere
    const coreGeom = new THREE.SphereGeometry(0.8, 16, 16);
    const coreMat = new THREE.MeshBasicMaterial({
      color: 0xd4af37,
      wireframe: true,
      transparent: true,
      opacity: 0.3
    });
    const coreMesh = new THREE.Mesh(coreGeom, coreMat);
    scene.add(coreMesh);

    // 4. Animation loop
    let animationFrameId: number;
    const animate = () => {
      torusKnot.rotation.y += 0.008;
      torusKnot.rotation.x += 0.004;

      coreMesh.rotation.y -= 0.012;
      coreMesh.rotation.x -= 0.006;

      renderer.render(scene, camera);
      animationFrameId = requestAnimationFrame(animate);
    };
    animate();

    // 5. Responsive resize handler
    const handleResize = () => {
      if (!canvas) return;
      const w = canvas.clientWidth;
      const h = canvas.clientHeight;
      camera.aspect = w / h;
      camera.updateProjectionMatrix();
      renderer.setSize(w, h);
    };
    window.addEventListener('resize', handleResize);

    // Clean up
    return () => {
      cancelAnimationFrame(animationFrameId);
      window.removeEventListener('resize', handleResize);
      geometry.dispose();
      material.dispose();
      coreGeom.dispose();
      coreMat.dispose();
      renderer.dispose();
    };
  }, []);

  const handleEnterClick = () => {
    setFadeOut(true);
    setTimeout(() => {
      onEnter();
    }, 600);
  };

  return (
    <div className={`${styles.portalOverlay} ${fadeOut ? styles.fadeOut : ''}`}>
      {/* Grid Overlay */}
      <div className={styles.visualGrid}></div>
      <div className={styles.goldGlow}></div>

      <div className={styles.portalContent}>
        {/* Three.js interactive loading screen */}
        <div className={styles.canvasContainer}>
          <canvas ref={canvasRef} className={styles.webglCanvas} />
        </div>

        {/* Loading Terminal Output */}
        <div className={styles.terminalLogs}>
          {logs.map((log, index) => (
            <div 
              key={index} 
              className={`${styles.logLine} ${index === logSequence.length - 1 ? styles.goldText : ''}`}
            >
              <span className={styles.promptSign}>&gt;</span> {log}
            </div>
          ))}
          {!showButton && <div className={styles.cursor}></div>}
        </div>

        {/* Brand/Credentials */}
        <div className={`${styles.brandContainer} ${showButton ? styles.brandVisible : ''}`}>
          <span className={styles.subtitle}>EXPERIENCED FRONTEND ENGINEER</span>
          <h1 className={styles.title}>SUJIT KUMAR GUPTA</h1>
          <p className={styles.tagline}>React.js • React Native • Full-Stack Developer</p>
        </div>

        {/* Golden Enter Button */}
        <button 
          onClick={handleEnterClick} 
          className={`${styles.enterBtn} ${showButton ? styles.btnVisible : ''}`}
          disabled={!showButton}
        >
          ENTER WORKSPACE
          <span className={styles.btnGlow}></span>
        </button>
      </div>
    </div>
  );
}
