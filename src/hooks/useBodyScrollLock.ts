import { useEffect } from 'react';

interface BodyScrollLockSnapshot {
  htmlOverflow: string;
  bodyOverflow: string;
  bodyPosition: string;
  bodyTop: string;
  bodyLeft: string;
  bodyRight: string;
  bodyWidth: string;
  bodyPaddingRight: string;
  scrollY: number;
}

let activeBodyScrollLocks = 0;
let bodyScrollLockSnapshot: BodyScrollLockSnapshot | null = null;

export function useBodyScrollLock(isLocked: boolean) {
  useEffect(() => {
    if (!isLocked) {
      return;
    }

    activeBodyScrollLocks += 1;

    if (activeBodyScrollLocks === 1) {
      const scrollY = window.scrollY;
      const scrollbarWidth = Math.max(0, window.innerWidth - document.documentElement.clientWidth);

      bodyScrollLockSnapshot = {
        htmlOverflow: document.documentElement.style.overflow,
        bodyOverflow: document.body.style.overflow,
        bodyPosition: document.body.style.position,
        bodyTop: document.body.style.top,
        bodyLeft: document.body.style.left,
        bodyRight: document.body.style.right,
        bodyWidth: document.body.style.width,
        bodyPaddingRight: document.body.style.paddingRight,
        scrollY,
      };

      document.documentElement.style.overflow = 'hidden';
      document.body.style.overflow = 'hidden';
      document.body.style.position = 'fixed';
      document.body.style.top = `-${scrollY}px`;
      document.body.style.left = '0';
      document.body.style.right = '0';
      document.body.style.width = '100%';

      if (scrollbarWidth > 0) {
        document.body.style.paddingRight = `${scrollbarWidth}px`;
      }
    }

    return () => {
      activeBodyScrollLocks = Math.max(0, activeBodyScrollLocks - 1);

      if (activeBodyScrollLocks !== 0 || !bodyScrollLockSnapshot) {
        return;
      }

      document.documentElement.style.overflow = bodyScrollLockSnapshot.htmlOverflow;
      document.body.style.overflow = bodyScrollLockSnapshot.bodyOverflow;
      document.body.style.position = bodyScrollLockSnapshot.bodyPosition;
      document.body.style.top = bodyScrollLockSnapshot.bodyTop;
      document.body.style.left = bodyScrollLockSnapshot.bodyLeft;
      document.body.style.right = bodyScrollLockSnapshot.bodyRight;
      document.body.style.width = bodyScrollLockSnapshot.bodyWidth;
      document.body.style.paddingRight = bodyScrollLockSnapshot.bodyPaddingRight;

      window.scrollTo({
        top: bodyScrollLockSnapshot.scrollY,
        left: 0,
        behavior: 'auto',
      });

      bodyScrollLockSnapshot = null;
    };
  }, [isLocked]);
}
