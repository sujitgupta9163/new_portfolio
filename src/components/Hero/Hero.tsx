import { ArrowDown, Download, Award } from 'lucide-react';
import InteractiveBackground from './InteractiveBackground';
import sujitResume from '../../assets/sujit_exp.pdf';
import profilePic from '../../assets/my_image.jpg';
import styles from './Hero.module.css';

export default function Hero() {
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
      {/* 3D Constellation Particle Field */}
      <InteractiveBackground />

      {/* Premium Luxury Background Glows */}
      <div className={styles.glowOverlay}>
        <div className={`${styles.glowCircle} ${styles.glowGold}`}></div>
        <div className={`${styles.glowCircle} ${styles.glowCharcoal}`}></div>
      </div>

      <div className={styles.container}>
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

        <div className={styles.visualContainer}>
          <div className={styles.signatureFrame}>
            <div className={styles.signatureGlass}>
              <div className={styles.avatarWrapper}>
                <img src={profilePic} alt="Sujit Kumar" className={styles.profileAvatar} />
              </div>
              <div className={styles.specifications}>
                <div className={styles.specRow}>
                  <span>ROLE:</span>
                  <strong>FRONTEND DEVELOPER</strong>
                </div>
                <div className={styles.specRow}>
                  <span>ORIGIN:</span>
                  <strong>EST. 2022</strong>
                </div>
                <div className={styles.specRow}>
                  <span>LOCATION:</span>
                  <strong>Mohali, Punjab, India</strong>
                </div>
              </div>
            </div>
            {/* Elegant geometrical details to look extremely premium */}
            <div className={styles.frameCornerTopLeft}></div>
            <div className={styles.frameCornerBottomRight}></div>
          </div>
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
