import { useEffect } from 'react';

const SCROLLBAR_IDLE_CLASS = 'scrollbar-idle';
const IDLE_DELAY_MS = 900;

export function useScrollbarVisibility() {
  useEffect(() => {
    const root = document.documentElement;
    let idleTimeoutId = 0;

    const setIdle = () => {
      root.classList.add(SCROLLBAR_IDLE_CLASS);
    };

    const scheduleIdle = () => {
      window.clearTimeout(idleTimeoutId);
      idleTimeoutId = window.setTimeout(setIdle, IDLE_DELAY_MS);
    };

    const showScrollbar = () => {
      root.classList.remove(SCROLLBAR_IDLE_CLASS);
      scheduleIdle();
    };

    const handleKeydown = (event: KeyboardEvent) => {
      if (
        event.key === 'ArrowDown' ||
        event.key === 'ArrowUp' ||
        event.key === 'PageDown' ||
        event.key === 'PageUp' ||
        event.key === 'Home' ||
        event.key === 'End' ||
        event.key === ' '
      ) {
        showScrollbar();
      }
    };

    scheduleIdle();

    window.addEventListener('scroll', showScrollbar, { passive: true });
    window.addEventListener('wheel', showScrollbar, { passive: true });
    window.addEventListener('touchmove', showScrollbar, { passive: true });
    window.addEventListener('keydown', handleKeydown);

    return () => {
      window.clearTimeout(idleTimeoutId);
      root.classList.remove(SCROLLBAR_IDLE_CLASS);
      window.removeEventListener('scroll', showScrollbar);
      window.removeEventListener('wheel', showScrollbar);
      window.removeEventListener('touchmove', showScrollbar);
      window.removeEventListener('keydown', handleKeydown);
    };
  }, []);
}
