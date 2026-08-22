import { useCallback, useEffect, useRef } from 'react';
import Lenis from 'lenis';

const SCROLL_EASE = (t: number) => Math.min(1, 1.001 - Math.pow(2, -10 * t));

export function useLenis() {
  const lenisRef = useRef<Lenis | null>(null);

  useEffect(() => {
    const reducedMotionQuery = window.matchMedia('(prefers-reduced-motion: reduce)');
    if (reducedMotionQuery.matches) {
      return;
    }

    const lenis = new Lenis({
      duration: 1.2,
      easing: SCROLL_EASE,
      orientation: 'vertical',
      gestureOrientation: 'vertical',
      smoothWheel: true,
      wheelMultiplier: 1,
      touchMultiplier: 2,
      allowNestedScroll: true,
      prevent: (node) => node.closest('[data-lenis-prevent]') !== null,
    });
    lenisRef.current = lenis;

    let frameId = 0;

    function raf(time: number) {
      lenis.raf(time);
      frameId = window.requestAnimationFrame(raf);
    }

    frameId = window.requestAnimationFrame(raf);

    return () => {
      window.cancelAnimationFrame(frameId);
      lenisRef.current = null;
      lenis.destroy();
    };
  }, []);

  const navigateToSection = useCallback((sectionId: string) => {
    const target = document.getElementById(sectionId);

    if (!target) return;

    const headerHeight = document.querySelector<HTMLElement>('.site-header')?.getBoundingClientRect().height ?? 0;
    const documentTop = target.getBoundingClientRect().top + window.scrollY;
    const maxScroll = Math.max(document.documentElement.scrollHeight - window.innerHeight, 0);
    const scrollTop = sectionId === 'works'
      ? 0
      : Math.min(Math.max(0, documentTop - headerHeight), maxScroll);

    if (lenisRef.current) {
      lenisRef.current.scrollTo(scrollTop, {
        duration: 1.05,
        easing: SCROLL_EASE,
        force: true,
      });
      return;
    }

    window.scrollTo({
      top: scrollTop,
      left: 0,
      behavior: window.matchMedia('(prefers-reduced-motion: reduce)').matches ? 'auto' : 'smooth',
    });
  }, []);

  const scrollToTop = useCallback(() => {
    const resetPosition = () => {
      lenisRef.current?.scrollTo(0, {
        immediate: true,
        force: true,
      });
      window.scrollTo({ top: 0, left: 0, behavior: 'auto' });
      document.documentElement.scrollTop = 0;
      document.body.scrollTop = 0;
    };

    resetPosition();
    window.requestAnimationFrame(resetPosition);
  }, []);

  return { navigateToSection, scrollToTop };
}
