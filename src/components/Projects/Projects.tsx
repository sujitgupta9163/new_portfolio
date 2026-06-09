import { useState, useEffect } from 'react';
import ProjectCard from './ProjectCard';
import Lightbox from './Lightbox';
import { apiService, type Project } from '../../services/apiService';
import styles from './Projects.module.css';

export default function Projects() {
  const [projects, setProjects] = useState<Project[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [activeFilter, setActiveFilter] = useState<'all' | 'web' | 'mobile' | 'design'>('all');
  const [selectedProject, setSelectedProject] = useState<Project | null>(null);

  useEffect(() => {
    const loadProjects = async () => {
      try {
        setLoading(true);
        const response = await apiService.fetchProjects();
        if (response.success) {
          setProjects(response.data);
        } else {
          setError('Failed to load pieces.');
        }
      } catch (err) {
        console.error(err);
        setError('Error connecting to client service.');
      } finally {
        setLoading(false);
      }
    };
    loadProjects();
  }, []);

  const categories: { label: string; value: 'all' | 'web' | 'mobile' | 'design' }[] = [
    { label: 'All Projects', value: 'all' },
    { label: 'Web Portals', value: 'web' },
    { label: 'Mobile Apps', value: 'mobile' },
    { label: 'Creative Design', value: 'design' },
  ];

  const filteredProjects = activeFilter === 'all'
    ? projects
    : projects.filter(p => p.category === activeFilter);

  return (
    <section id="projects" className={styles.projectsSection}>
      <div className={styles.container}>
        {/* Section Header */}
        <div className={styles.sectionHeader}>
          <span className={styles.sectionSubtitle}>02 / PORTFOLIO</span>
          <h2 className={styles.sectionTitle}>Masterpieces & Creations</h2>
          <div className={styles.titleDivider}></div>
        </div>

        {/* Filter Navigation */}
        <div className={styles.filterBar}>
          {categories.map((cat) => (
            <button
              key={cat.value}
              className={`${styles.filterBtn} ${activeFilter === cat.value ? styles.filterActive : ''}`}
              disabled={loading}
              onClick={() => setActiveFilter(cat.value)}
            >
              {cat.label}
            </button>
          ))}
        </div>

        {/* Loading Skeletons */}
        {loading && (
          <div className={styles.projectsGrid}>
            {[1, 2, 3, 4].map((n) => (
              <div key={n} className={styles.skeletonCard}>
                <div className={styles.skeletonVisual}>
                  <div className={styles.shimmer}></div>
                </div>
                <div className={styles.skeletonInfo}>
                  <div className={styles.skeletonLineShort}></div>
                  <div className={styles.skeletonLineTitle}></div>
                  <div className={styles.skeletonLineDesc}></div>
                  <div className={styles.skeletonTags}>
                    <div className={styles.skeletonTag}></div>
                    <div className={styles.skeletonTag}></div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Error State */}
        {!loading && error && (
          <div className={styles.errorContainer}>
            <p className={styles.errorText}>{error}</p>
            <button 
              onClick={() => window.location.reload()} 
              className="outline-button"
            >
              Retry Connection
            </button>
          </div>
        )}

        {/* Projects Grid */}
        {!loading && !error && (
          <div className={styles.projectsGrid}>
            {filteredProjects.map((project) => (
              <ProjectCard
                key={project.id}
                project={project}
                onClick={() => setSelectedProject(project)}
              />
            ))}
          </div>
        )}
      </div>

      {/* Lightbox Modal */}
      {selectedProject && (
        <Lightbox
          project={selectedProject}
          onClose={() => setSelectedProject(null)}
        />
      )}
    </section>
  );
}
