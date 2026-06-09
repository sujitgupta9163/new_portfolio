import { Code, Server, Smartphone, Check } from 'lucide-react';
import styles from './About.module.css';

interface SkillGroup {
  category: string;
  icon: React.ReactNode;
  skills: string[];
}

export default function About() {
  const statItems = [
    { value: '6+', label: 'Years of Experience' },
    { value: '40+', label: 'Premium Projects' },
    { value: '100%', label: 'Satisfied Clients' },
  ];

  const skillGroups: SkillGroup[] = [
    {
      category: 'Frontend Craftsmanship',
      icon: <Code size={20} className="gold-text" />,
      skills: ['React.js & Hooks', 'TypeScript Development', 'Next.js Framework', 'Context & State Management'],
    },
    {
      category: 'Styling & Fine Aesthetics',
      icon: <Smartphone size={20} className="gold-text" />,
      skills: ['CSS Modules / Vanilla CSS', 'Glassmorphic Styling', 'Responsive Fluid Design', 'Micro-Animations'],
    },
    {
      category: 'Server & Architectures',
      icon: <Server size={20} className="gold-text" />,
      skills: ['Node.js & Express', 'RESTful API Integration', 'Git Version Control', 'Web Performance Tuning'],
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
              I approach web development as a digital craftsman. Code is my canvas, and styling is the meticulous detail that brings it to life. I specialize in building highly visual, high-performance, and responsive applications that leave an unforgettable impression.
            </p>
            <p className={styles.bioText}>
              With over half a decade of writing scalable applications, I prioritize pixel-perfection, structural accessibility, and lightning-fast speed. Every line of code I craft is designed to elevate the user's sensory experience.
            </p>

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
