import { useEffect, useState } from 'react';

interface UseActiveSectionOptions {
  threshold?: number;
}

export function useActiveSection(
  sectionIds: string[],
  { threshold = 0.3 }: UseActiveSectionOptions = {},
) {
  const [activeSection, setActiveSection] = useState('');

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (!entry.isIntersecting) {
            return;
          }

          const nextSection = entry.target.id;
          setActiveSection((currentSection) => currentSection === nextSection ? currentSection : nextSection);
        });
      },
      { threshold },
    );

    sectionIds.forEach((id) => {
      const element = document.getElementById(id);
      if (element) {
        observer.observe(element);
      }
    });

    return () => observer.disconnect();
  }, [sectionIds, threshold]);

  return activeSection;
}
