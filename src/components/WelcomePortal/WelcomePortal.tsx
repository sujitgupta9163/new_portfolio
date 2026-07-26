import { useState, useEffect, useRef } from 'react';
import * as THREE from 'three';
import styles from './WelcomePortal.module.css';

interface WelcomePortalProps {
  onEnter: () => void;
}

export default function WelcomePortal({ onEnter }: WelcomePortalProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const matrixRef = useRef<HTMLCanvasElement>(null);
  const portalRef = useRef<HTMLDivElement>(null);
  
  // Randomly select loader style index on mount (1, 2, or 3)
  const [styleIndex, setStyleIndex] = useState<1 | 2 | 3>(1);

  useEffect(() => {
    const randomIdx = (Math.floor(Math.random() * 3) + 1) as 1 | 2 | 3;
    setStyleIndex(randomIdx);
  }, []);

  // Auto-redirect timer
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

  // 1. Interactive 2D Canvas Matrix Rain Background (Adapts to Style Index)
  useEffect(() => {
    if (!matrixRef.current) return;
    const canvas = matrixRef.current;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let width = (canvas.width = window.innerWidth);
    let height = (canvas.height = window.innerHeight);

    // Style-specific characters and colors
    let chars = '01010101<>/{}[];:+=_*&^%$#@!ABCDEFGHIJKLMNOPQRSTUVWXYZ';
    if (styleIndex === 2) chars = '010101010101'; // Binary for hacker theme
    if (styleIndex === 3) chars = '✦★☀⚙☄✥✦★'; // Stars/Cosmic coordinates for space theme

    const alphabet = chars.split('');
    const fontSize = 12;
    let columns = width / fontSize;

    const rainDrops: number[] = [];
    for (let x = 0; x < columns; x++) {
      rainDrops[x] = Math.random() * -100;
    }

    let animationId: number;
    const draw = () => {
      ctx.fillStyle = 'rgba(5, 5, 5, 0.08)';
      ctx.fillRect(0, 0, width, height);

      // Color selection based on loader style
      if (styleIndex === 1) {
        ctx.fillStyle = 'rgba(212, 175, 55, 0.35)'; // Luxury Gold
      } else if (styleIndex === 2) {
        ctx.fillStyle = 'rgba(16, 185, 129, 0.45)'; // Matrix Green
      } else {
        ctx.fillStyle = 'rgba(59, 130, 246, 0.35)'; // Cosmic Blue
      }

      ctx.font = fontSize + 'px monospace';

      for (let i = 0; i < rainDrops.length; i++) {
        const text = alphabet[Math.floor(Math.random() * alphabet.length)];
        ctx.fillText(text, i * fontSize, rainDrops[i] * fontSize);

        if (rainDrops[i] * fontSize > height && Math.random() > 0.975) {
          rainDrops[i] = 0;
        }
        rainDrops[i] += 0.8;
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
  }, [styleIndex]);

  // 2. Three.js 3D Wireframe Loader Animation (Shape adapts to Style Index)
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

    // Choose mesh shape and color based on styleIndex
    let geometry: THREE.BufferGeometry;
    let coreGeom: THREE.BufferGeometry;
    let shapeColor = 0xd4af37; // Gold default

    if (styleIndex === 1) {
      geometry = new THREE.TorusKnotGeometry(1.5, 0.45, 120, 16);
      coreGeom = new THREE.SphereGeometry(0.7, 16, 16);
      shapeColor = 0xd4af37; // Gold
    } else if (styleIndex === 2) {
      geometry = new THREE.BoxGeometry(2, 2, 2, 4, 4, 4);
      coreGeom = new THREE.OctahedronGeometry(0.8, 1);
      shapeColor = 0x10b981; // Matrix Green
    } else {
      geometry = new THREE.SphereGeometry(1.8, 16, 16); // Wireframe Globe Earth
      coreGeom = new THREE.DodecahedronGeometry(0.8, 1);
      shapeColor = 0x3b82f6; // Cosmic Blue
    }

    const material = new THREE.MeshBasicMaterial({
      color: shapeColor,
      wireframe: true,
      transparent: true,
      opacity: 0.35
    });

    const mesh = new THREE.Mesh(geometry, material);
    scene.add(mesh);

    const coreMat = new THREE.MeshBasicMaterial({
      color: shapeColor,
      wireframe: true,
      transparent: true,
      opacity: 0.55
    });
    const coreMesh = new THREE.Mesh(coreGeom, coreMat);
    scene.add(coreMesh);

    let animationFrameId: number;
    const animate = () => {
      mesh.rotation.y += 0.015;
      mesh.rotation.x += 0.008;

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
  }, [styleIndex]);

  // Style configurations
  const styleConfigs = {
    1: {
      subtitle: 'LUXURY GOLDEN CORE INSTANCE',
      tagline: 'React.js & React Native Specialist',
      loadingText: 'COMPILING CORE MODULES...',
      themeClass: styles.goldTheme,
      progressClass: styles.goldProgress
    },
    2: {
      subtitle: 'SECURE BINARY TERMINAL V2.0',
      tagline: 'Hacker/Coder Workspace Loader',
      loadingText: 'BOOTSTRAPPING DEPENDENCIES...',
      themeClass: styles.greenTheme,
      progressClass: styles.greenProgress
    },
    3: {
      subtitle: 'ORBITAL SPACE TELEMETRY',
      tagline: 'Experiential Digital Cosmos',
      loadingText: 'SYNCHRONIZING SPACELINES...',
      themeClass: styles.blueTheme,
      progressClass: styles.blueProgress
    }
  };

  const config = styleConfigs[styleIndex];

  return (
    <div ref={portalRef} className={`${styles.portalOverlay} ${config.themeClass}`}>
      <canvas ref={matrixRef} className={styles.matrixCanvas} />
      <div className={styles.visualGrid}></div>
      <div className={styles.goldGlow} style={{
        background: styleIndex === 2 
          ? 'radial-gradient(circle, rgba(16, 185, 129, 0.04) 0%, transparent 70%)'
          : styleIndex === 3
          ? 'radial-gradient(circle, rgba(59, 130, 246, 0.04) 0%, transparent 70%)'
          : undefined
      }}></div>

      <div className={styles.portalContent}>
        {/* Animated Three.js geometry */}
        <div className={styles.canvasContainer}>
          <canvas ref={canvasRef} className={styles.webglCanvas} />
        </div>

        {/* Brand Display */}
        <div className={styles.brandContainer}>
          <span className={styles.subtitle}>{config.subtitle}</span>
          <h1 className={styles.title}>SUJIT KUMAR GUPTA</h1>
          <p className={styles.tagline}>{config.tagline}</p>
        </div>

        {/* Gold/Green/Blue Progress Loader Bar */}
        <div className={styles.loaderBarContainer}>
          <div className={`${styles.loaderBarFill} ${config.progressClass}`}></div>
        </div>
        <span className={styles.loadingText}>{config.loadingText}</span>
      </div>
    </div>
  );
}
