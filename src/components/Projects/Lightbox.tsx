import { useEffect } from 'react';
import { X, ExternalLink, Calendar, User, Tag } from 'lucide-react';
import type { Project } from '../../services/apiService';
import styles from './Projects.module.css';

interface LightboxProps {
  project: Project;
  onClose: () => void;
}

export default function Lightbox({ project, onClose }: LightboxProps) {
  // Listen for Escape key to close modal
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        onClose();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    // Disable background scroll when modal is open
    document.body.style.overflow = 'hidden';

    return () => {
      window.removeEventListener('keydown', handleKeyDown);
      document.body.style.overflow = 'unset';
    };
  }, [onClose]);

  const handleBackdropClick = (e: React.MouseEvent) => {
    if (e.target === e.currentTarget) {
      onClose();
    }
  };

  return (
    <div 
      className={styles.modalBackdrop} 
      onClick={handleBackdropClick}
      role="dialog"
      aria-modal="true"
      aria-labelledby="modal-title"
    >
      <div className={styles.modalContent}>
        {/* Close Button */}
        <button 
          className={styles.modalCloseBtn} 
          onClick={onClose}
          aria-label="Close dialog"
        >
          <X size={20} />
        </button>

        <div className={styles.modalGrid}>
          {/* Visual Showcase Block */}
          <div 
            className={styles.modalVisual} 
            style={{ background: project.image }}
          >
            <span className={styles.modalWatermark}>{project.title.charAt(0)}</span>
          </div>

          {/* Metadata & Details Block */}
          <div className={styles.modalDetails}>
            <div className={styles.modalHeader}>
              <span className={`${styles.modalCat} gold-text`}>{project.category}</span>
              <h2 id="modal-title" className={styles.modalTitle}>{project.title}</h2>
            </div>

            {/* Quick Specs */}
            <div className={styles.modalSpecs}>
              <div className={styles.specItem}>
                <User size={14} className={styles.specIcon} />
                <span className={styles.specLabel}>CLIENT:</span>
                <span className={styles.specValue}>{project.client}</span>
              </div>
              <div className={styles.specItem}>
                <Calendar size={14} className={styles.specIcon} />
                <span className={styles.specLabel}>DATE:</span>
                <span className={styles.specValue}>{project.date}</span>
              </div>
            </div>

            {/* Description */}
            <div className={styles.modalDescBlock}>
              <h4 className={styles.detailsLabel}>THE VISION</h4>
              <p className={styles.modalLongDesc}>{project.longDescription}</p>
            </div>

            {/* Full Tag Badges */}
            <div className={styles.modalTagsBlock}>
              <h4 className={styles.detailsLabel}>
                <Tag size={12} className={styles.specIcon} />
                TECHNOLOGIES UTILIZED
              </h4>
              <div className={styles.modalTagsGrid}>
                {project.tags.map((tag: string, idx: number) => (
                  <span key={idx} className={styles.modalTagBadge}>
                    {tag}
                  </span>
                ))}
              </div>
            </div>

            {/* Action buttons */}
            {project.link && (
              <a 
                href={project.link} 
                target="_blank" 
                rel="noopener noreferrer" 
                className="gold-button"
                style={{ marginTop: 'auto', alignSelf: 'flex-start' }}
              >
                Launch Masterpiece <ExternalLink size={14} />
              </a>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
