import { Code, Server, Smartphone, Check } from 'lucide-react';
import styles from './About.module.css';

interface SkillGroup {
  category: string;
  icon: React.ReactNode;
  skills: string[];
}

export default function About() {
  const statItems = [
    { value: '1+', label: 'Years of Experience' },
    { value: '15+', label: 'Reusable Components' },
    { value: '100%', label: 'Delivery Rate' },
  ];

  const skillGroups: SkillGroup[] = [
    {
      category: 'Frontend Craftsmanship',
      icon: <Code size={20} className="gold-text" />,
      skills: ['React.js & Hooks', 'React Native Mobile', 'Context API & Redux Toolkit', 'JavaScript (ES6+)'],
    },
    {
      category: 'Styling & Fine Aesthetics',
      icon: <Smartphone size={20} className="gold-text" />,
      skills: ['Tailwind CSS', 'Bootstrap & Ant Design', 'Responsive Web Design', 'User-friendly Interfaces'],
    },
    {
      category: 'Server & Architectures',
      icon: <Server size={20} className="gold-text" />,
      skills: ['Node.js & Express', 'REST API Integration', 'MongoDB & MySQL', 'Git & GitHub Versioning'],
    },
  ];

  return (
    <section id="about" className={styles.aboutSection}>
      <div className={styles.container}>
        {/* Section Header */}
        <div className={styles.sectionHeader}>
          <span className={styles.sectionSubtitle}>01 / PROFILES</span>
          <h2 className={styles.sectionTitle}>The Art of Digital Design</h2>
          <div className={styles.titleDivider}></div>
        </div>

        {/* Content Grid */}
        <div className={styles.grid}>
          {/* Left Column: Biography & Philosophy */}
          <div className={styles.biography}>
            <h3 className={styles.bioTitle}>
              Bridging the gap between <span className="gold-text">pure aesthetics</span> and robust software architectures.
            </h3>
            <p className={styles.bioText}>
              I approach web and mobile development as a digital craftsman. Code is my canvas, and styling is the meticulous detail that brings it to life. I specialize in building highly visual, high-performance, and responsive applications using React.js and React Native.
            </p>
            <p className={styles.bioText}>
              With a focus on writing clean, scalable, and maintainable code, I prioritize pixel-perfection, REST API integration, state management (Redux Toolkit), and developing reusable component libraries.
            </p>

            {/* Education Sub-Section */}
            <div style={{ marginTop: '30px' }}>
              <h4 className="gold-text" style={{ fontSize: '1rem', fontFamily: 'var(--font-serif)', letterSpacing: '0.05em', marginBottom: '15px' }}>
                ACADEMIC CREDENTIALS
              </h4>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '15px' }}>
                <div style={{ borderLeft: '1px solid var(--accent-gold)', paddingLeft: '15px' }}>
                  <h5 style={{ fontSize: '0.9rem', fontWeight: 600, color: 'var(--text-primary)' }}>Master of Computer Applications (MCA)</h5>
                  <p style={{ fontSize: '0.8rem', color: 'var(--text-secondary)' }}>Quantum University, Roorkee (2023 – 2025)</p>
                </div>
                <div style={{ borderLeft: '1px solid var(--accent-gold)', paddingLeft: '15px' }}>
                  <h5 style={{ fontSize: '0.9rem', fontWeight: 600, color: 'var(--text-primary)' }}>Bachelor of Computer Applications (BCA)</h5>
                  <p style={{ fontSize: '0.8rem', color: 'var(--text-secondary)' }}>Patliputra University, Patna (2020 – 2023)</p>
                </div>
              </div>
            </div>

            {/* Stat Counters */}
            <div className={styles.statsContainer}>
              {statItems.map((stat, i) => (
                <div key={i} className={styles.statCard}>
                  <span className={`${styles.statValue} gold-text`}>{stat.value}</span>
                  <span className={styles.statLabel}>{stat.label}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Right Column: Skills Architecture */}
          <div className={styles.skillsWrapper}>
            <h3 className={styles.skillsTitle}>Expertise & Core Competencies</h3>
            
            <div className={styles.skillGroupsContainer}>
              {skillGroups.map((group, groupIndex) => (
                <div key={groupIndex} className={styles.skillCard}>
                  <div className={styles.skillCardHeader}>
                    {group.icon}
                    <h4>{group.category}</h4>
                  </div>
                  <ul className={styles.skillList}>
                    {group.skills.map((skill, skillIndex) => (
                      <li key={skillIndex} className={styles.skillItem}>
                        <Check size={12} className={styles.checkIcon} />
                        <span>{skill}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
