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
function createFloralTexture(baseColor: string): THREE.CanvasTexture {
  const canvas = document.createElement('canvas');
  canvas.width = 1024;
  canvas.height = 1024;
  const ctx = canvas.getContext('2d');
  
  if (ctx) {
    // Fill base background (Teal / Cyan)
    ctx.fillStyle = baseColor;
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    // Draw symmetric floral/constellation grid
    const cols = 24;
    const rows = 12;
    const cellWidth = canvas.width / cols;
    const cellHeight = canvas.height / rows;

    for (let r = 0; r < rows; r++) {
      for (let c = 0; c < cols; c++) {
        // Offset alternate rows for diamond-pattern distribution
        const x = c * cellWidth + (r % 2 === 0 ? 0 : cellWidth / 2);
        const y = r * cellHeight + cellHeight / 2;

        // Draw white floral cross motif
        ctx.save();
        ctx.translate(x, y);
        
        // Draw 4 leaf petals forming a glowing cross/star
        ctx.fillStyle = 'rgba(255, 255, 255, 0.95)';
        for (let i = 0; i < 4; i++) {
          ctx.rotate(Math.PI / 2);
          ctx.beginPath();
          // Draw elegant diamond petal
          ctx.moveTo(0, 0);
          ctx.quadraticCurveTo(6, -10, 0, -22);
          ctx.quadraticCurveTo(-6, -10, 0, 0);
          ctx.fill();
        }

        // Draw central glowing soft core
        const glow = ctx.createRadialGradient(0, 0, 1, 0, 0, 6);
        glow.addColorStop(0, '#ffffff');
        glow.addColorStop(1, 'rgba(255, 255, 255, 0)');
        ctx.fillStyle = glow;
        ctx.beginPath();
        ctx.arc(0, 0, 6, 0, Math.PI * 2);
        ctx.fill();

        ctx.restore();

        // Draw mini-gold nodes between the flowers for luxury contrast
        if (c < cols - 1) {
          ctx.beginPath();
          ctx.arc(x + cellWidth / 2, y + cellHeight / 2, 2.5, 0, Math.PI * 2);
          ctx.fillStyle = '#D4AF37'; // Gold
          ctx.fill();
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

// 3D Interactive Sphere Model
function SphereModel({ config, texture }: { config: MaterialConfig; texture: THREE.CanvasTexture }) {
  const meshRef = useRef<THREE.Mesh>(null);

  useFrame((_state, delta) => {
    if (config.autoRotate && meshRef.current) {
      meshRef.current.rotation.y += delta * 0.15;
      meshRef.current.rotation.x += delta * 0.05;
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
        bumpScale={0.015} // Adds procedural depth relief to the petals
      />
    </mesh>
  );
}

export default function ThreeViewer() {
  const [baseColor, setBaseColor] = useState<string>('#009688'); // Dark Teal / Cyan
  const [config, setConfig] = useState<MaterialConfig>({
    roughness: 0.15,
    metalness: 0.25,
    autoRotate: true,
    wireframe: false,
  });

  const [texture, setTexture] = useState<THREE.CanvasTexture | null>(null);

  // Generate texture when baseColor changes
  useEffect(() => {
    const tex = createFloralTexture(baseColor);
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
