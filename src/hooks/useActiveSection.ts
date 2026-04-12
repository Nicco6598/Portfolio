import { useEffect, useState } from 'react';

interface UseActiveSectionOptions {
  threshold?: number;
  rootMargin?: string;
  freeze?: boolean;
}

export function useActiveSection(
  sectionIds: string[],
  { threshold = 0, rootMargin = '-18% 0px -58% 0px', freeze = false }: UseActiveSectionOptions = {},
) {
  const [activeSection, setActiveSection] = useState(sectionIds[0] ?? '');

  useEffect(() => {
    if (freeze) {
      return;
    }

    let frameId = 0;

    const updateActiveSection = () => {
      frameId = 0;

      const checkpoint = window.scrollY + (window.innerHeight * 0.32);
      let nextSection = sectionIds[0] ?? '';

      for (const id of sectionIds) {
        const element = document.getElementById(id);

        if (!element) {
          continue;
        }

        const elementTop = element.offsetTop;

        if (checkpoint >= elementTop) {
          nextSection = id;
        } else {
          break;
        }
      }

      setActiveSection((currentSection) => currentSection === nextSection ? currentSection : nextSection);
    };

    const requestUpdate = () => {
      if (frameId !== 0) {
        return;
      }

      frameId = window.requestAnimationFrame(updateActiveSection);
    };

    requestUpdate();
    window.addEventListener('scroll', requestUpdate, { passive: true });
    window.addEventListener('resize', requestUpdate);

    return () => {
      if (frameId !== 0) {
        window.cancelAnimationFrame(frameId);
      }

      window.removeEventListener('scroll', requestUpdate);
      window.removeEventListener('resize', requestUpdate);
    };
  }, [freeze, rootMargin, sectionIds, threshold]);

  return activeSection;
}
