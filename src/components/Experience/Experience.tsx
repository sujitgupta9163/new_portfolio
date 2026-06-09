import { Briefcase, Calendar, Award } from 'lucide-react';
import styles from './Experience.module.css';

interface TimelineItem {
  id: string;
  role: string;
  company: string;
  period: string;
  description: string[];
  skills: string[];
}

export default function Experience() {
  const experiences: TimelineItem[] = [
    {
      id: 'exp1',
      role: 'Lead Frontend Engineer',
      company: 'Aura Technologies',
      period: '2024 - PRESENT',
      description: [
        'Architected and implemented high-performance digital platforms with strict sub-second performance limits.',
        'Mentored a team of 6 engineers on React design systems, modular CSS structures, and advanced TypeScript patterns.',
        'Spearheaded custom interactive dashboards that increased client retention metrics by over 35%.'
      ],
      skills: ['React 18', 'TypeScript', 'Performance Optimization', 'System Design']
    },
    {
      id: 'exp2',
      role: 'Senior React Developer',
      company: 'Helix Software House',
      period: '2022 - 2024',
      description: [
        'Engineered responsive web applications using Vite, React, and tailored modular styling.',
        'Improved Core Web Vitals across major e-commerce properties, achieving average performance score improvements of 40%.',
        'Coordinated closely with visual UI/UX directors to craft complex keyframe animations and glassmorphic layouts.'
      ],
      skills: ['Vite', 'React Router', 'Aesthetic Animation', 'Figma Integration']
    },
    {
      id: 'exp3',
      role: 'UI Architect & Developer',
      company: 'Studio Vesper',
      period: '2020 - 2022',
      description: [
        'Created artistic micro-sites, promotional portals, and branding designs for high-end luxury labels.',
        'Pioneered reusable vanilla CSS design libraries and responsive modules to speed up prototyping velocities by 50%.',
        'Ensured full WCAG AAA accessibility compliance across public sector portfolios and digital assets.'
      ],
      skills: ['Vanilla CSS Modules', 'Web Accessibility (A11y)', 'Brand Styling', 'SEO Optimizations']
    }
  ];

  return (
    <section id="experience" className={styles.experienceSection}>
      <div className={styles.container}>
        {/* Section Header */}
        <div className={styles.sectionHeader}>
          <span className={styles.sectionSubtitle}>03 / EVOLUTIONS</span>
          <h2 className={styles.sectionTitle}>Journey & Milestones</h2>
          <div className={styles.titleDivider}></div>
        </div>

        {/* Timeline Layout */}
        <div className={styles.timeline}>
          {/* Vertical axis line */}
          <div className={styles.timelineLine}></div>

          {experiences.map((exp) => (
            <div key={exp.id} className={styles.timelineItem}>
              {/* Connector Node */}
              <div className={styles.timelineNode}>
                <div className={styles.nodeCircle}>
                  <Briefcase size={12} className={styles.nodeIcon} />
                </div>
              </div>

              {/* Detail Content Card */}
              <div className={styles.timelineContent}>
                <div className={styles.cardHeader}>
                  <span className={`${styles.period} gold-text`}>
                    <Calendar size={12} style={{ marginRight: '6px' }} />
                    {exp.period}
                  </span>
                  <h3 className={styles.roleTitle}>{exp.role}</h3>
                  <h4 className={styles.companyName}>
                    <Award size={12} className={styles.awardIcon} />
                    {exp.company}
                  </h4>
                </div>

                <ul className={styles.achievements}>
                  {exp.description.map((desc, dIdx) => (
                    <li key={dIdx} className={styles.achievementItem}>
                      {desc}
                    </li>
                  ))}
                </ul>

                <div className={styles.skillsTagWrapper}>
                  {exp.skills.map((skill, sIdx) => (
                    <span key={sIdx} className={styles.skillTag}>
                      {skill}
                    </span>
                  ))}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
