import { useState, useEffect, useRef } from 'react';
import { ArrowDown, Download, Award } from 'lucide-react';
import { Canvas, useFrame } from '@react-three/fiber';
import { OrbitControls } from '@react-three/drei';
import * as THREE from 'three';
import InteractiveBackground from './InteractiveBackground';
import sujitResume from '../../assets/sujit_exp.pdf';
import styles from './Hero.module.css';

// 3D Digital Earth Texture Creator (Same high-tech style as the Material Lab)
function createHeroEarthTexture(baseColor: string): THREE.CanvasTexture {
  const canvas = document.createElement('canvas');
  canvas.width = 1024;
  canvas.height = 512;
  const ctx = canvas.getContext('2d');
  
  if (ctx) {
    // Fill background ocean with space blue
    ctx.fillStyle = baseColor;
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    // Grid lines
    ctx.strokeStyle = 'rgba(255, 255, 255, 0.08)';
    ctx.lineWidth = 1;
    for (let y = 0; y < canvas.height; y += 32) {
      ctx.beginPath(); ctx.moveTo(0, y); ctx.lineTo(canvas.width, y); ctx.stroke();
    }
    for (let x = 0; x < canvas.width; x += 32) {
      ctx.beginPath(); ctx.moveTo(x, 0); ctx.lineTo(x, canvas.height); ctx.stroke();
    }

    // Continents
    const offscreen = document.createElement('canvas');
    offscreen.width = canvas.width;
    offscreen.height = canvas.height;
    const oCtx = offscreen.getContext('2d');
    
    if (oCtx) {
      oCtx.fillStyle = '#ffffff';

      const drawContinent = (points: [number, number][]) => {
        oCtx.beginPath();
        oCtx.moveTo(points[0][0], points[0][1]);
        for (let i = 1; i < points.length; i++) {
          oCtx.lineTo(points[i][0], points[i][1]);
        }
        oCtx.closePath();
        oCtx.fill();
      };

      // Simplified coordinates for world map projection (1024 x 512 scale)
      drawContinent([[400, 50], [550, 40], [700, 60], [800, 120], [850, 200], [820, 300], [750, 320], [600, 300], [550, 360], [450, 420], [400, 320], [330, 250], [300, 150]]);
      drawContinent([[50, 80], [180, 80], [250, 130], [220, 220], [150, 250], [100, 180]]);
      drawContinent([[180, 250], [250, 280], [300, 350], [220, 480], [170, 380]]);
      drawContinent([[780, 320], [870, 310], [900, 370], [820, 400]]);
      drawContinent([[0, 480], [1024, 480], [1024, 512], [0, 512]]);

      // Draw dotted gold matrix continents
      const imgData = oCtx.getImageData(0, 0, offscreen.width, offscreen.height);
      const data = imgData.data;
      const step = 8;

      ctx.fillStyle = '#D4AF37'; // gold
      for (let y = 0; y < offscreen.height; y += step) {
        for (let x = 0; x < offscreen.width; x += step) {
          const index = (y * offscreen.width + x) * 4;
          if (data[index] > 128) {
            ctx.beginPath();
            ctx.arc(x, y, 2.5, 0, Math.PI * 2);
            ctx.fill();
          }
        }
      }
    }
  }

  const texture = new THREE.CanvasTexture(canvas);
  texture.wrapS = THREE.RepeatWrapping;
  texture.wrapT = THREE.RepeatWrapping;
  texture.repeat.set(1, 1);
  return texture;
}

// 3D Sphere mesh for home hero
function HeroSphere({ texture }: { texture: THREE.CanvasTexture }) {
  const meshRef = useRef<THREE.Mesh>(null);

  useFrame((_state, delta) => {
    if (meshRef.current) {
      // Rotate globe continuously
      meshRef.current.rotation.y += delta * 0.15;
    }
  });

  return (
    <mesh ref={meshRef}>
      <sphereGeometry args={[1.7, 64, 64]} />
      <meshStandardMaterial
        map={texture}
        roughness={0.2}
        metalness={0.35}
        bumpMap={texture}
        bumpScale={0.02}
      />
    </mesh>
  );
}

export default function Hero() {
  const [texture, setTexture] = useState<THREE.CanvasTexture | null>(null);

  useEffect(() => {
    // Generate the space blue digital earth texture
    const tex = createHeroEarthTexture('#0b1424');
    setTexture(tex);
    return () => {
      tex.dispose();
    };
  }, []);

  const handleScrollToProjects = (e: React.MouseEvent<HTMLButtonElement>) => {
    e.preventDefault();
    const element = document.getElementById('projects');
    if (element) {
      const offset = 90;
      const bodyRect = document.body.getBoundingClientRect().top;
      const elementRect = element.getBoundingClientRect().top;
      const elementPosition = elementRect - bodyRect;
      const offsetPosition = elementPosition - offset;

      window.scrollTo({
        top: offsetPosition,
        behavior: 'smooth'
      });
    }
  };

  return (
    <section id="home" className={styles.heroSection}>
      {/* 2D Faint constellation grid background */}
      <InteractiveBackground />

      {/* Premium Luxury Background Glows */}
      <div className={styles.glowOverlay}>
        <div className={`${styles.glowCircle} ${styles.glowGold}`}></div>
        <div className={`${styles.glowCircle} ${styles.glowCharcoal}`}></div>
      </div>

      <div className={styles.container}>
        {/* Left Column: Text content */}
        <div className={styles.content}>
          <div className={styles.taglineWrapper}>
            <Award className={styles.tagIcon} size={16} />
            <span className={styles.tagline}>Frontend Developer • React.js & React Native</span>
          </div>

          <h1 className={styles.title}>
            SUJIT KUMAR GUPTA <br />
            <span className="gold-text">Frontend Developer</span>
          </h1>

          <p className={styles.subtitle}>
            Results-driven Frontend Developer with 1+ years of experience building high-performance web and cross-platform mobile applications using React.js and React Native. Delivering scalable, user-friendly interfaces with clean, maintainable code.
          </p>

          <div className={styles.actions}>
            <button 
              onClick={handleScrollToProjects} 
              className="gold-button"
            >
              Explore Portfolio <ArrowDown size={16} />
            </button>
            <a 
              href={sujitResume} 
              download="Sujit_Kumar_Resume.pdf" 
              className="outline-button"
            >
              Get Resume <Download size={16} />
            </a>
          </div>
        </div>

        {/* Right Column: Rotating 3D WebGL Earth Globe */}
        <div className={styles.visualContainer}>
          {texture && (
            <Canvas camera={{ position: [0, 0, 4.0], fov: 45 }}>
              <ambientLight intensity={0.5} />
              <directionalLight position={[5, 3, 5]} intensity={1.3} />
              <pointLight position={[-5, -3, -5]} intensity={0.4} color="#0b1424" />
              <HeroSphere texture={texture} />
              <OrbitControls 
                enableZoom={false} 
                enablePan={false}
                enableDamping
                dampingFactor={0.05}
              />
            </Canvas>
          )}
        </div>
      </div>

      <div className={styles.scrollDownIndicator}>
        <div className={styles.scrollMouse}>
          <div className={styles.scrollWheel}></div>
        </div>
        <span>SCROLL DOWN</span>
      </div>
    </section>
  );
}
