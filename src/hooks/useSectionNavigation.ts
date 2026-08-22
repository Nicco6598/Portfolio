import { useEffect, useState } from 'react';

interface SectionNavigationState {
  activeSection: string;
  progress: Record<string, number>;
}

export function useSectionNavigation(sectionIds: string[], freeze = false) {
  const [state, setState] = useState<SectionNavigationState>(() => ({
    activeSection: sectionIds[0] ?? '',
    progress: Object.fromEntries(sectionIds.map((id) => [id, 0])),
  }));

  useEffect(() => {
    if (freeze) return;

    let frameId = 0;
    let disposed = false;

    const update = () => {
      frameId = 0;
      const scrollTop = Math.max(0, window.scrollY);
      const maxScroll = Math.max(document.documentElement.scrollHeight - window.innerHeight, 0);
      const headerHeight = document.querySelector<HTMLElement>('.site-header')?.getBoundingClientRect().height ?? 0;
      const starts = sectionIds.map((id, index) => {
        const element = document.getElementById(id);

        if (!element) return null;

        const documentTop = element.getBoundingClientRect().top + scrollTop;
        const alignedTop = Math.max(0, documentTop - headerHeight);

        return index === 0 ? 0 : Math.min(alignedTop, maxScroll);
      });
      let activeIndex = 0;
      const progress: Record<string, number> = {};

      starts.forEach((start, index) => {
        if (start === null) return;
        if (scrollTop + 1 >= start) activeIndex = index;
      });

      if (maxScroll > 0 && maxScroll - scrollTop <= 1) {
        activeIndex = Math.max(0, sectionIds.length - 1);
      }

      sectionIds.forEach((id, index) => {
        const start = starts[index];

        if (start === null) {
          progress[id] = 0;
          return;
        }

        const nextStart = starts.slice(index + 1).find((value) => value !== null);
        const end = Math.max(start + 1, nextStart ?? maxScroll);
        const value = (scrollTop - start) / (end - start);

        progress[id] = Math.min(1, Math.max(0, value));
      });

      const activeSection = sectionIds[activeIndex] ?? sectionIds[0] ?? '';

      setState((current) => {
        const unchanged = current.activeSection === activeSection
          && sectionIds.every((id) => Math.abs((current.progress[id] ?? 0) - (progress[id] ?? 0)) < 0.001);

        return unchanged ? current : { activeSection, progress };
      });
    };

    const requestUpdate = () => {
      if (!disposed && frameId === 0) frameId = window.requestAnimationFrame(update);
    };

    requestUpdate();
    window.addEventListener('scroll', requestUpdate, { passive: true });
    window.addEventListener('resize', requestUpdate);
    window.addEventListener('load', requestUpdate);
    void document.fonts?.ready.then(requestUpdate);

    return () => {
      disposed = true;
      if (frameId !== 0) window.cancelAnimationFrame(frameId);
      window.removeEventListener('scroll', requestUpdate);
      window.removeEventListener('resize', requestUpdate);
      window.removeEventListener('load', requestUpdate);
    };
  }, [freeze, sectionIds]);

  return state;
}
