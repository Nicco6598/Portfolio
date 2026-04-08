import { useEffect, useState } from 'react';

const CAN_HOVER_QUERY = '(hover: hover) and (pointer: fine)';

export function useCanHover() {
  const [canHover, setCanHover] = useState(() => {
    if (typeof window === 'undefined') {
      return false;
    }

    return window.matchMedia(CAN_HOVER_QUERY).matches;
  });

  useEffect(() => {
    const mediaQuery = window.matchMedia(CAN_HOVER_QUERY);

    const updateCanHover = () => {
      setCanHover(mediaQuery.matches);
    };

    updateCanHover();

    if (typeof mediaQuery.addEventListener === 'function') {
      mediaQuery.addEventListener('change', updateCanHover);

      return () => {
        mediaQuery.removeEventListener('change', updateCanHover);
      };
    }

    mediaQuery.addListener(updateCanHover);

    return () => {
      mediaQuery.removeListener(updateCanHover);
    };
  }, []);

  return canHover;
}
