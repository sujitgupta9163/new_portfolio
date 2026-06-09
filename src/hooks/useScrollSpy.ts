import { useEffect, useState } from 'react';

/**
 * Custom hook to detect the active section ID based on viewport intersection
 * @param sectionIds Array of section IDs (e.g. ['home', 'about', 'projects'])
 * @param offsetOffset Vertical offset from the top for intersection trigger
 */
export function useScrollSpy(sectionIds: string[], offset: number = 100): string {
  const [activeId, setActiveId] = useState<string>('');

  useEffect(() => {
    const handleScroll = () => {
      const scrollPosition = window.scrollY + offset;

      // Find the section that currently matches the scroll position
      let currentActiveId = sectionIds[0] || '';

      for (const id of sectionIds) {
        const element = document.getElementById(id);
        if (element) {
          const { offsetTop, offsetHeight } = element;
          if (scrollPosition >= offsetTop && scrollPosition < offsetTop + offsetHeight) {
            currentActiveId = id;
            break;
          }
        }
      }

      setActiveId(currentActiveId);
    };

    window.addEventListener('scroll', handleScroll);
    // Trigger once on mount to establish active tab
    handleScroll();

    return () => {
      window.removeEventListener('scroll', handleScroll);
    };
  }, [sectionIds, offset]);

  return activeId;
}
