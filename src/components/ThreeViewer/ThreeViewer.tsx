import { useState, useRef, useEffect } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { OrbitControls, Center } from '@react-three/drei';
import * as THREE from 'three';
import { Settings, RefreshCw, Zap } from 'lucide-react';
import styles from './ThreeViewer.module.css';

interface MaterialConfig {
  roughness: number;
  metalness: number;
  autoRotate: boolean;
  wireframe: boolean;
}

// Procedural Canvas Texture Generator to match the floral-mesh sphere in the reference image
// Procedural Canvas Texture Generator to create a beautiful digital dot-matrix Earth globe
function createEarthTexture(baseColor: string): THREE.CanvasTexture {
  const canvas = document.createElement('canvas');
  canvas.width = 1024;
  canvas.height = 512;
  const ctx = canvas.getContext('2d');
  
  if (ctx) {
    // 1. Fill base background (Oceans) using the customizable baseColor
    ctx.fillStyle = baseColor;
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    // 2. Draw Longitude & Latitude grid lines for high-tech aesthetic
    ctx.strokeStyle = 'rgba(255, 255, 255, 0.08)';
    ctx.lineWidth = 1;
    // Latitudes (Horizontal)
    for (let y = 0; y < canvas.height; y += 32) {
      ctx.beginPath();
      ctx.moveTo(0, y);
      ctx.lineTo(canvas.width, y);
      ctx.stroke();
    }
    // Longitudes (Vertical)
    for (let x = 0; x < canvas.width; x += 32) {
      ctx.beginPath();
      ctx.moveTo(x, 0);
      ctx.lineTo(x, canvas.height);
      ctx.stroke();
    }

    // 3. Render Continents using an offscreen canvas to compute dot-matrix overlay
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
      // Eurasia & Africa
      drawContinent([[400, 50], [550, 40], [700, 60], [800, 120], [850, 200], [820, 300], [750, 320], [600, 300], [550, 360], [450, 420], [400, 320], [330, 250], [300, 150]]);
      // North America
      drawContinent([[50, 80], [180, 80], [250, 130], [220, 220], [150, 250], [100, 180]]);
      // South America
      drawContinent([[180, 250], [250, 280], [300, 350], [220, 480], [170, 380]]);
      // Australia
      drawContinent([[780, 320], [870, 310], [900, 370], [820, 400]]);
      // Antarctica
      drawContinent([[0, 480], [1024, 480], [1024, 512], [0, 512]]);

      // Read pixel data to draw glowing gold dot matrix representing continents
      const imgData = oCtx.getImageData(0, 0, offscreen.width, offscreen.height);
      const data = imgData.data;
      const step = 8; // spacing between dots

      ctx.fillStyle = '#D4AF37'; // Champagne Gold for continents
      for (let y = 0; y < offscreen.height; y += step) {
        for (let x = 0; x < offscreen.width; x += step) {
          const index = (y * offscreen.width + x) * 4;
          if (data[index] > 128) {
            // Draw a neat digital pixel dot
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

// 3D Interactive Sphere Model (Earth)
function SphereModel({ config, texture }: { config: MaterialConfig; texture: THREE.CanvasTexture }) {
  const meshRef = useRef<THREE.Mesh>(null);

  useFrame((_state, delta) => {
    if (config.autoRotate && meshRef.current) {
      meshRef.current.rotation.y += delta * 0.15;
    }
  });

  return (
    <mesh ref={meshRef} castShadow receiveShadow>
      <sphereGeometry args={[1.6, 64, 64]} />
      <meshStandardMaterial
        map={texture}
        roughness={config.roughness}
        metalness={config.metalness}
        wireframe={config.wireframe}
        bumpMap={texture}
        bumpScale={0.02}
      />
    </mesh>
  );
}

export default function ThreeViewer() {
  const [baseColor, setBaseColor] = useState<string>('#0b1424'); // Default Deep Space Blue
  const [config, setConfig] = useState<MaterialConfig>({
    roughness: 0.2,
    metalness: 0.35,
    autoRotate: true,
    wireframe: false,
  });

  const [texture, setTexture] = useState<THREE.CanvasTexture | null>(null);

  // Generate texture when baseColor changes
  useEffect(() => {
    const tex = createEarthTexture(baseColor);
    setTexture(tex);
    return () => {
      tex.dispose();
    };
  }, [baseColor]);

  return (
    <section id="three-viewer" className={styles.viewerSection}>
      <div className={styles.container}>
        {/* Section Header */}
        <div className={styles.sectionHeader}>
          <span className={styles.sectionSubtitle}>05 / INTERACTIVE STUDIO</span>
          <h2 className={styles.sectionTitle}>3D Material Lab</h2>
          <div className={styles.titleDivider}></div>
        </div>

        <div className={styles.grid}>
          {/* WebGL Canvas Viewport */}
          <div className={styles.canvasWrapper}>
            {texture && (
              <Canvas shadows camera={{ position: [0, 0, 4.2], fov: 45 }}>
                <color attach="background" args={['#080808']} />
                <ambientLight intensity={0.4} />
                
                {/* Dynamic Lighting setup */}
                <directionalLight position={[5, 5, 5]} intensity={1.2} castShadow />
                <pointLight position={[-5, -5, -5]} intensity={0.5} color={baseColor} />
                
                <Center>
                  <SphereModel config={config} texture={texture} />
                </Center>
                
                <OrbitControls 
                  enableDamping 
                  dampingFactor={0.05} 
                  minDistance={2.5} 
                  maxDistance={6} 
                />
              </Canvas>
            )}
            <div className={styles.canvasOverlay}>
              <Zap size={14} className={styles.overlayIcon} />
              <span>DRAG TO ROTATE • SCROLL TO ZOOM</span>
            </div>
          </div>

          {/* Configurator Controls */}
          <div className={styles.controlsPanel}>
            <div className={styles.panelHeader}>
              <Settings className={styles.settingsIcon} size={18} />
              <h3>Material Configurator</h3>
            </div>

            <div className={styles.controlGroup}>
              <label className={styles.label}>BASE CANVAS COLOR</label>
              <div className={styles.colorRow}>
                <input
                  type="color"
                  value={baseColor}
                  onChange={(e) => setBaseColor(e.target.value)}
                  className={styles.colorPicker}
                />
                <span className={styles.hexText}>{baseColor.toUpperCase()}</span>
                {/* Presets matching luxury designs */}
                <div className={styles.presets}>
                  {['#009688', '#1e293b', '#450a0a', '#1e1b4b'].map((preset) => (
                    <button
                      key={preset}
                      style={{ backgroundColor: preset }}
                      className={`${styles.presetBtn} ${baseColor === preset ? styles.presetActive : ''}`}
                      onClick={() => setBaseColor(preset)}
                      aria-label={`Select color ${preset}`}
                    />
                  ))}
                </div>
              </div>
            </div>

            <div className={styles.controlGroup}>
              <div className={styles.labelRow}>
                <label className={styles.label}>ROUGHNESS</label>
                <span className={styles.valueText}>{config.roughness}</span>
              </div>
              <input
                type="range"
                min="0"
                max="1"
                step="0.05"
                value={config.roughness}
                onChange={(e) => setConfig({ ...config, roughness: parseFloat(e.target.value) })}
                className={styles.slider}
              />
            </div>

            <div className={styles.controlGroup}>
              <div className={styles.labelRow}>
                <label className={styles.label}>METALNESS</label>
                <span className={styles.valueText}>{config.metalness}</span>
              </div>
              <input
                type="range"
                min="0"
                max="1"
                step="0.05"
                value={config.metalness}
                onChange={(e) => setConfig({ ...config, metalness: parseFloat(e.target.value) })}
                className={styles.slider}
              />
            </div>

            <div className={styles.toggleRow}>
              <label className={styles.toggleLabel}>
                <input
                  type="checkbox"
                  checked={config.autoRotate}
                  onChange={(e) => setConfig({ ...config, autoRotate: e.target.checked })}
                  className={styles.checkbox}
                />
                <span className={styles.checkboxText}>Auto-Rotation</span>
              </label>

              <label className={styles.toggleLabel}>
                <input
                  type="checkbox"
                  checked={config.wireframe}
                  onChange={(e) => setConfig({ ...config, wireframe: e.target.checked })}
                  className={styles.checkbox}
                />
                <span className={styles.checkboxText}>Wireframe Mesh</span>
              </label>
            </div>

            <button
              onClick={() => {
                setBaseColor('#009688');
                setConfig({ roughness: 0.15, metalness: 0.25, autoRotate: true, wireframe: false });
              }}
              className={`${styles.resetBtn} outline-button`}
            >
              <RefreshCw size={14} /> Reset Configuration
            </button>
          </div>
        </div>
      </div>
    </section>
  );
}
