import { useCallback, useEffect, useState, type CSSProperties } from 'react';
import { AnimatePresence } from 'framer-motion';
import { SECTION_IDS, SITE_NAME } from '../config/site';
import { useActiveSection } from '../hooks/useActiveSection';
import { useBodyScrollLock } from '../hooks/useBodyScrollLock';
import { useCanHover } from '../hooks/useCanHover';
import { useEscapeKey } from '../hooks/useEscapeKey';
import { useRadialHover } from '../hooks/useRadialHover';
import { useScrollThreshold } from '../hooks/useScrollThreshold';
import DesktopNav from './navbar/DesktopNav';
import MobileNav from './navbar/MobileNav';

interface NavbarProps {
  onNavigate?: (section: string) => void;
}

export default function Navbar({ onNavigate }: NavbarProps) {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const canHover = useCanHover();
  const mobileTriggerRef = useRadialHover<HTMLButtonElement>(canHover);
  const scrolled = useScrollThreshold(60, { freeze: mobileMenuOpen });
  const activeSection = useActiveSection(SECTION_IDS, { threshold: 0.3 });
  useBodyScrollLock(mobileMenuOpen);

  const closeMobileMenu = useCallback(() => {
    setMobileMenuOpen(false);
  }, []);

  useEscapeKey(mobileMenuOpen, closeMobileMenu);

  useEffect(() => {
    const mediaQuery = window.matchMedia('(min-width: 768px)');
    const handleChange = (event: MediaQueryListEvent) => {
      if (event.matches) {
        closeMobileMenu();
      }
    };

    if (typeof mediaQuery.addEventListener === 'function') {
      mediaQuery.addEventListener('change', handleChange);

      return () => {
        mediaQuery.removeEventListener('change', handleChange);
      };
    }

    mediaQuery.addListener(handleChange);

    return () => {
      mediaQuery.removeListener(handleChange);
    };
  }, [closeMobileMenu]);

  return (
    <>
      <nav
        className="fixed top-0 left-0 right-0 z-50"
        style={{
          padding: '1.25rem 1.5rem',
          backgroundColor: scrolled ? 'var(--color-bg)' : 'transparent',
          backdropFilter: scrolled ? 'blur(12px)' : 'none',
          borderBottom: scrolled ? '1px solid var(--color-border)' : 'none',
          transition: 'background-color 220ms ease, border-color 220ms ease, backdrop-filter 220ms ease',
        }}
      >
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <a
            href="#"
            className={`relative z-50 flex items-center gap-2 font-mono text-[12px] uppercase tracking-widest transition-opacity ${canHover ? 'hover:opacity-70' : ''}`.trim()}
            style={{ color: 'var(--color-text-primary)' }}
          >
            <div
              className="w-3 h-3 rounded-full"
              style={{ backgroundColor: 'var(--color-accent)' }}
            />
            {SITE_NAME}
          </a>

          <DesktopNav activeSection={activeSection} onNavigate={onNavigate} />

          <button
            ref={mobileTriggerRef}
            className="radial-hover-surface group relative z-50 inline-flex items-center gap-3 rounded-full border px-3 py-2 md:hidden"
            onClick={() => setMobileMenuOpen((open) => !open)}
            style={{
              ['--radial-fill' as string]: 'var(--color-accent)',
              ['--radial-text' as string]: 'var(--color-text-primary)',
              borderRadius: '9999px',
              borderColor: mobileMenuOpen ? 'var(--color-accent)' : 'var(--color-border)',
              backgroundColor: 'color-mix(in srgb, var(--color-bg) 84%, rgba(255,255,255,0.35) 16%)',
            } as CSSProperties}
            aria-label={mobileMenuOpen ? 'Close menu' : 'Open menu'}
            aria-controls="mobile-navigation"
            aria-expanded={mobileMenuOpen}
          >
            <span data-radial-fill className="radial-hover-fill" />
            <span className="radial-hover-content font-mono text-[10px] uppercase tracking-[0.18em]">
              {mobileMenuOpen ? 'Close' : 'Menu'}
            </span>
            <div className="radial-hover-content flex w-5 flex-col gap-1.5">
              <span
                className="h-0.5 transition-all duration-300"
                style={{
                  backgroundColor: 'var(--color-text-primary)',
                  transform: mobileMenuOpen ? 'rotate(45deg) translate(4px, 4px)' : 'none'
                }}
              />
              <span
                className="h-0.5 transition-all duration-300"
                style={{
                  backgroundColor: 'var(--color-text-primary)',
                  opacity: mobileMenuOpen ? 0 : 1
                }}
              />
              <span
                className="h-0.5 transition-all duration-300"
                style={{
                  backgroundColor: 'var(--color-text-primary)',
                  transform: mobileMenuOpen ? 'rotate(-45deg) translate(4px, -4px)' : 'none'
                }}
              />
            </div>
          </button>
        </div>
      </nav>

      <AnimatePresence>
        {mobileMenuOpen && (
          <MobileNav activeSection={activeSection} onClose={closeMobileMenu} onNavigate={onNavigate} />
        )}
      </AnimatePresence>
    </>
  );
}
