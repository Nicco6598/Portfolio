import { useCallback, useEffect, useRef, useState } from 'react';
import { AnimatePresence } from 'framer-motion';
import { SECTION_IDS } from '../config/site';
import { useBodyScrollLock } from '../hooks/useBodyScrollLock';
import { useEscapeKey } from '../hooks/useEscapeKey';
import { useSectionNavigation } from '../hooks/useSectionNavigation';
import { useScrollThreshold } from '../hooks/useScrollThreshold';
import DesktopNav from './navbar/DesktopNav';
import MobileNav from './navbar/MobileNav';

interface NavbarProps {
  onNavigate?: (section: string) => void;
}

export default function Navbar({ onNavigate }: NavbarProps) {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [isDesktop, setIsDesktop] = useState(() => window.matchMedia('(min-width: 901px)').matches);
  const scrolled = useScrollThreshold(48, { freeze: mobileMenuOpen });
  const { activeSection, progress } = useSectionNavigation(SECTION_IDS, !isDesktop);
  const mobileTriggerRef = useRef<HTMLButtonElement>(null);
  const pendingMobileSectionRef = useRef<string | null>(null);

  useBodyScrollLock(mobileMenuOpen);
  const closeMobileMenu = useCallback(() => setMobileMenuOpen(false), []);
  const queueMobileNavigation = useCallback((section: string) => {
    pendingMobileSectionRef.current = section;
    closeMobileMenu();
  }, [closeMobileMenu]);
  const completeMobileNavigation = useCallback(() => {
    const section = pendingMobileSectionRef.current;

    if (!section || !onNavigate) return;

    pendingMobileSectionRef.current = null;
    onNavigate(section);
  }, [onNavigate]);
  useEscapeKey(mobileMenuOpen, closeMobileMenu);

  useEffect(() => {
    const mediaQuery = window.matchMedia('(min-width: 901px)');
    const handleChange = () => {
      setIsDesktop(mediaQuery.matches);
      if (mediaQuery.matches) closeMobileMenu();
    };
    mediaQuery.addEventListener('change', handleChange);
    return () => mediaQuery.removeEventListener('change', handleChange);
  }, [closeMobileMenu]);

  return (
    <>
      <header className={`site-header ${scrolled ? 'site-header--scrolled' : ''} ${mobileMenuOpen ? 'site-header--menu-open' : ''}`.trim()}>
        <a
          href="#works"
          className="site-mark"
          aria-label="Marco Niccolini — home"
          onClick={(event) => {
            if (!onNavigate) return;
            event.preventDefault();

            if (mobileMenuOpen) {
              queueMobileNavigation('works');
              return;
            }

            onNavigate('works');
          }}
        >
          <span className="site-mark__monogram">MN</span>
          <span className="site-mark__name">Marco<br />Niccolini</span>
        </a>

        <DesktopNav activeSection={activeSection} progress={progress} onNavigate={onNavigate} />

        <button
          ref={mobileTriggerRef}
          data-menu-trigger="true"
          type="button"
          className={`mobile-menu-trigger ${mobileMenuOpen ? 'is-open' : ''}`.trim()}
          onClick={() => setMobileMenuOpen((open) => !open)}
          aria-label={mobileMenuOpen ? 'Close menu' : 'Open menu'}
          aria-expanded={mobileMenuOpen}
          aria-controls="mobile-navigation"
        >
          <span>{mobileMenuOpen ? 'Close' : 'Menu'}</span>
          <span className="mobile-menu-trigger__glyph" aria-hidden="true"><i /><i /></span>
        </button>
      </header>

      <AnimatePresence onExitComplete={completeMobileNavigation}>
        {mobileMenuOpen ? (
          <MobileNav
            onClose={closeMobileMenu}
            onNavigate={onNavigate ? queueMobileNavigation : undefined}
            returnFocusRef={mobileTriggerRef}
          />
        ) : null}
      </AnimatePresence>
    </>
  );
}
