import { Eye } from 'lucide-react';
import type { Project } from '../../services/apiService';
import styles from './Projects.module.css';

interface ProjectCardProps {
  project: Project;
  onClick: () => void;
}

export default function ProjectCard({ project, onClick }: ProjectCardProps) {
  // Extract the first letter of the title for a luxurious background monogram watermark
  const watermarkLetter = project.title.charAt(0);

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' || e.key === ' ') {
      e.preventDefault();
      onClick();
    }
  };

  return (
    <div
      className={styles.card}
      onClick={onClick}
      onKeyDown={handleKeyPress}
      tabIndex={0}
      role="button"
      aria-label={`View details of ${project.title}`}
    >
      {/* Project Visual Screen */}
      <div 
        className={styles.cardVisual} 
        style={(!project.image.startsWith('http') && !project.image.startsWith('/') && !project.image.startsWith('.')) ? { background: project.image } : undefined}
      >
        {((project.image.startsWith('http') || project.image.startsWith('/') || project.image.startsWith('.'))) ? (
          <img src={project.image} alt={project.title} className={styles.projectImage} />
        ) : (
          <span className={styles.watermark}>{watermarkLetter}</span>
        )}
        
        {/* Hover overlay */}
        <div className={styles.hoverOverlay}>
          <div className={styles.hoverIconWrapper}>
            <Eye size={24} className="gold-text" />
          </div>
          <span className={styles.hoverText}>Discover Details</span>
        </div>

        <span className={styles.categoryTag}>{project.category}</span>
      </div>

      {/* Card Info */}
      <div className={styles.cardInfo}>
        <span className={styles.cardClient}>{project.client}</span>
        <h3 className={styles.cardTitle}>{project.title}</h3>
        <p className={styles.cardDesc}>{project.description}</p>
        <div className={styles.cardTags}>
          {project.tags.slice(0, 3).map((tag: string, idx: number) => (
            <span key={idx} className={styles.tagBadge}>
              {tag}
            </span>
          ))}
          {project.tags.length > 3 && (
            <span className={styles.tagBadge}>+{project.tags.length - 3}</span>
          )}
        </div>
      </div>
    </div>
  );
}
