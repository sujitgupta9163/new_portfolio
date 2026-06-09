import { ArrowUp } from 'lucide-react';
import styles from './Footer.module.css';

export default function Footer() {
  const socialLinks = [
    { 
      icon: (
        <svg viewBox="0 0 24 24" width="16" height="16" stroke="currentColor" strokeWidth="2" fill="none" strokeLinecap="round" strokeLinejoin="round">
          <path d="M9 19c-5 1.5-5-2.5-7-3m14 6v-3.87a3.37 3.37 0 0 0-.94-2.61c3.14-.35 6.44-1.54 6.44-7A5.44 5.44 0 0 0 20 4.77 5.07 5.07 0 0 0 19.91 1S18.73.65 16 2.48a13.38 13.38 0 0 0-7 0C6.27.65 5.09 1 5.09 1A5.07 5.07 0 0 0 5 4.77a5.44 5.44 0 0 0-1.5 3.78c0 5.42 3.3 6.61 6.44 7A3.37 3.37 0 0 0 9 18.13V22"></path>
        </svg>
      ), 
      url: 'https://github.com', 
      label: 'GitHub' 
    },
    { 
      icon: (
        <svg viewBox="0 0 24 24" width="16" height="16" stroke="currentColor" strokeWidth="2" fill="none" strokeLinecap="round" strokeLinejoin="round">
          <path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6z"></path>
          <rect x="2" y="9" width="4" height="12"></rect>
          <circle cx="4" cy="4" r="2"></circle>
        </svg>
      ), 
      url: 'https://linkedin.com', 
      label: 'LinkedIn' 
    },
    { 
      icon: (
        <svg viewBox="0 0 24 24" width="16" height="16" stroke="currentColor" strokeWidth="2" fill="none" strokeLinecap="round" strokeLinejoin="round">
          <path d="M23 3a10.9 10.9 0 0 1-3.14 1.53 4.48 4.48 0 0 0-7.86 3v1A10.66 10.66 0 0 1 3 4s-4 9 5 13a11.64 11.64 0 0 1-7 2c9 5 20 0 20-11.5a4.5 4.5 0 0 0-.08-.83A7.72 7.72 0 0 0 23 3z"></path>
        </svg>
      ), 
      url: 'https://twitter.com', 
      label: 'Twitter' 
    },
    { 
      icon: (
        <svg viewBox="0 0 24 24" width="16" height="16" stroke="currentColor" strokeWidth="2" fill="none" strokeLinecap="round" strokeLinejoin="round">
          <circle cx="12" cy="12" r="10"></circle>
          <path d="M8.56 2.75c4.37 6.03 6.02 9.42 8.03 17.72m2.54-15.38c-3.72 4.35-8.94 5.66-16.88 5.85m19.5 1.9c-3.5-.49-11.05 1-11.6 8.56"></path>
        </svg>
      ), 
      url: 'https://dribbble.com', 
      label: 'Dribbble' 
    },
  ];

  const handleScrollToTop = () => {
    window.scrollTo({
      top: 0,
      behavior: 'smooth',
    });
  };

  return (
    <footer className={styles.footer}>
      <div className={styles.container}>
        <div className={styles.topRow}>
          {/* Logo brand */}
          <div className={styles.brand}>
            <span className={styles.logo}>
              S U J I T<span className={styles.logoDot}>.</span>
            </span>
            <p className={styles.tagline}>Est. 2020 • Curating digital excellence.</p>
          </div>

          {/* Social Icon Grid */}
          <div className={styles.socials}>
            {socialLinks.map((link, idx) => (
              <a
                key={idx}
                href={link.url}
                target="_blank"
                rel="noopener noreferrer"
                className={styles.socialLink}
                aria-label={link.label}
              >
                {link.icon}
              </a>
            ))}
          </div>
        </div>

        <div className={styles.divider}></div>

        <div className={styles.bottomRow}>
          <span className={styles.copyright}>
            © {new Date().getFullYear()} SUJIT. All rights reserved. Meticulously designed & engineered.
          </span>

          <button 
            onClick={handleScrollToTop} 
            className={styles.backToTop}
            aria-label="Scroll back to top"
          >
            BACK TO TOP <ArrowUp size={12} className={styles.arrow} />
          </button>
        </div>
      </div>
    </footer>
  );
}
