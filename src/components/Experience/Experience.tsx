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
      role: 'Frontend Developer',
      company: 'Bhanguz Technology, Mohali',
      period: 'JUNE 2025 - PRESENT',
      description: [
        'Architected and delivered production-ready React.js web applications, improving UI consistency across the platform.',
        'Engineered 15+ reusable React Native components, reducing development time for new features by ~30%.',
        'Integrated RESTful APIs with robust error handling and optimized state management using Redux Toolkit.',
        'Enhanced application performance and responsiveness, contributing to faster load times and smoother UX.',
        'Collaborated with backend team to define API contracts and ensure seamless frontend-backend integration.'
      ],
      skills: ['React.js', 'React Native', 'Redux Toolkit', 'Tailwind CSS', 'REST API', 'JavaScript']
    },
    {
      id: 'exp2',
      role: 'Frontend Developer Intern',
      company: 'Tech Whizer IT Software Services',
      period: 'NOV 2022 - MAR 2023',
      description: [
        'Developed modular, reusable React.js components used across multiple pages of the web application.',
        'Implemented API integrations and managed component-level state using React hooks.',
        'Contributed to UI improvements that enhanced usability and visual consistency of the product.'
      ],
      skills: ['React.js', 'JavaScript', 'React Hooks', 'Tailwind CSS', 'REST API']
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
