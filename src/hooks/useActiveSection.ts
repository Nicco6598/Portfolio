import { useEffect, useState } from 'react';

interface UseActiveSectionOptions {
  threshold?: number;
  rootMargin?: string;
}

export function useActiveSection(
  sectionIds: string[],
  { threshold = 0, rootMargin = '-18% 0px -58% 0px' }: UseActiveSectionOptions = {},
) {
  const [activeSection, setActiveSection] = useState(sectionIds[0] ?? '');

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        const visibleEntries = entries
          .filter((entry) => entry.isIntersecting)
          .sort((entryA, entryB) => entryB.intersectionRatio - entryA.intersectionRatio);

        const nextSection = visibleEntries[0]?.target.id;
        if (!nextSection) {
          return;
        }

        setActiveSection((currentSection) => currentSection === nextSection ? currentSection : nextSection);
      },
      { threshold, rootMargin },
    );

    sectionIds.forEach((id) => {
      const element = document.getElementById(id);
      if (element) {
        observer.observe(element);
      }
    });

    return () => observer.disconnect();
  }, [rootMargin, sectionIds, threshold]);

  return activeSection;
}
