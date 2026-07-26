import { useEffect, useRef } from 'react';
import * as THREE from 'three';
import styles from './WelcomePortal.module.css';

interface WelcomePortalProps {
  onEnter: () => void;
}

export default function WelcomePortal({ onEnter }: WelcomePortalProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const matrixRef = useRef<HTMLCanvasElement>(null);
  const portalRef = useRef<HTMLDivElement>(null);

  // Auto-redirect timer: 3 seconds, then fade out
  useEffect(() => {
    const fadeTimer = setTimeout(() => {
      if (portalRef.current) {
        portalRef.current.classList.add(styles.fadeOut);
      }
      
      const enterTimer = setTimeout(() => {
        onEnter();
      }, 600);

      return () => clearTimeout(enterTimer);
    }, 3000);

    return () => clearTimeout(fadeTimer);
  }, [onEnter]);

  // 1. Matrix Digital Rain Background (Gold Coder Vibe)
  useEffect(() => {
    if (!matrixRef.current) return;
    const canvas = matrixRef.current;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let width = (canvas.width = window.innerWidth);
    let height = (canvas.height = window.innerHeight);

    const chars = '01010101<>/{}[];:+=_*&^%$#@!ABCDEFGHIJKLMNOPQRSTUVWXYZ';
    const alphabet = chars.split('');
    const fontSize = 12;
    let columns = width / fontSize;

    const rainDrops: number[] = [];
    for (let x = 0; x < columns; x++) {
      rainDrops[x] = Math.random() * -100; // Offset start positions
    }

    let animationId: number;
    const draw = () => {
      ctx.fillStyle = 'rgba(5, 5, 5, 0.08)'; // Trail opacity
      ctx.fillRect(0, 0, width, height);

      // Gold styling for digital rain
      ctx.fillStyle = 'rgba(212, 175, 55, 0.35)'; // Semi-transparent gold characters
      ctx.font = fontSize + 'px monospace';

      for (let i = 0; i < rainDrops.length; i++) {
        const text = alphabet[Math.floor(Math.random() * alphabet.length)];
        ctx.fillText(text, i * fontSize, rainDrops[i] * fontSize);

        if (rainDrops[i] * fontSize > height && Math.random() > 0.975) {
          rainDrops[i] = 0;
        }
        rainDrops[i] += 0.8; // Falling speed
      }
      animationId = requestAnimationFrame(draw);
    };

    draw();

    const handleResize = () => {
      width = canvas.width = window.innerWidth;
      height = canvas.height = window.innerHeight;
      columns = width / fontSize;
      rainDrops.length = 0;
      for (let x = 0; x < columns; x++) {
        rainDrops[x] = Math.random() * -100;
      }
    };
    window.addEventListener('resize', handleResize);

    return () => {
      cancelAnimationFrame(animationId);
      window.removeEventListener('resize', handleResize);
    };
  }, []);

  // 2. Three.js 3D Wireframe Loader Animation (Centerpiece)
  useEffect(() => {
    if (!canvasRef.current) return;

    const canvas = canvasRef.current;
    const width = canvas.clientWidth;
    const height = canvas.clientHeight;

    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(45, width / height, 0.1, 100);
    camera.position.z = 8;

    const renderer = new THREE.WebGLRenderer({
      canvas: canvas,
      alpha: true,
      antialias: true
    });
    renderer.setSize(width, height);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));

    // Torus Knot geometry (Futuristic structural code grid representation)
    const geometry = new THREE.TorusKnotGeometry(1.6, 0.45, 120, 16);
    const material = new THREE.MeshBasicMaterial({
      color: 0xd4af37, // Gold
      wireframe: true,
      transparent: true,
      opacity: 0.35 // Higher visibility for loader
    });
    const torusKnot = new THREE.Mesh(geometry, material);
    scene.add(torusKnot);

    const coreGeom = new THREE.SphereGeometry(0.8, 16, 16);
    const coreMat = new THREE.MeshBasicMaterial({
      color: 0xd4af37,
      wireframe: true,
      transparent: true,
      opacity: 0.5
    });
    const coreMesh = new THREE.Mesh(coreGeom, coreMat);
    scene.add(coreMesh);

    let animationFrameId: number;
    const animate = () => {
      torusKnot.rotation.y += 0.015;
      torusKnot.rotation.x += 0.008;

      coreMesh.rotation.y -= 0.02;
      coreMesh.rotation.x -= 0.01;

      renderer.render(scene, camera);
      animationFrameId = requestAnimationFrame(animate);
    };
    animate();

    const handleResize = () => {
      if (!canvas) return;
      const w = canvas.clientWidth;
      const h = canvas.clientHeight;
      camera.aspect = w / h;
      camera.updateProjectionMatrix();
      renderer.setSize(w, h);
    };
    window.addEventListener('resize', handleResize);

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

  return (
    <div ref={portalRef} className={styles.portalOverlay}>
      {/* Background Matrix rain canvas */}
      <canvas ref={matrixRef} className={styles.matrixCanvas} />
      <div className={styles.visualGrid}></div>
      <div className={styles.goldGlow}></div>

      <div className={styles.portalContent}>
        {/* Three.js rotating loading grid */}
        <div className={styles.canvasContainer}>
          <canvas ref={canvasRef} className={styles.webglCanvas} />
        </div>

        {/* Brand/Credentials */}
        <div className={styles.brandContainer}>
          <span className={styles.subtitle}>FRONTEND ARCHITECT WORKSPACE</span>
          <h1 className={styles.title}>SUJIT KUMAR GUPTA</h1>
          <p className={styles.tagline}>React.js & React Native Specialist</p>
        </div>

        {/* Luxury Gold Progress Loader Bar */}
        <div className={styles.loaderBarContainer}>
          <div className={styles.loaderBarFill}></div>
        </div>
        <span className={styles.loadingText}>COMPILING CORE MODULES...</span>
      </div>
    </div>
  );
}
