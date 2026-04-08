import { useCallback, useState, type CSSProperties } from 'react';
import { AnimatePresence } from 'framer-motion';
import { SECTION_IDS, SITE_NAME } from '../config/site';
import { useActiveSection } from '../hooks/useActiveSection';
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
  const mobileTriggerRef = useRadialHover<HTMLButtonElement>();
  const scrolled = useScrollThreshold(60);
  const activeSection = useActiveSection(SECTION_IDS, { threshold: 0.3 });

  const closeMobileMenu = useCallback(() => {
    setMobileMenuOpen(false);
  }, []);

  useEscapeKey(mobileMenuOpen, closeMobileMenu);

  return (
    <nav
      className="fixed top-0 left-0 right-0 z-50 transition-all duration-300"
      style={{
        padding: '1.25rem 1.5rem',
        backgroundColor: scrolled ? 'var(--color-bg)' : 'transparent',
        backdropFilter: scrolled ? 'blur(12px)' : 'none',
        borderBottom: scrolled ? '1px solid var(--color-border)' : 'none',
      }}
    >
      <div className="max-w-7xl mx-auto flex items-center justify-between">
        <a
          href="#"
          className="flex items-center gap-2 font-mono text-[12px] uppercase tracking-widest transition-opacity hover:opacity-70 z-50 relative"
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
          className="radial-hover-surface group relative z-50 p-2 md:hidden"
          onClick={() => setMobileMenuOpen((open) => !open)}
          style={{
            ['--radial-fill' as string]: 'var(--color-accent)',
            ['--radial-text' as string]: 'var(--color-text-primary)',
            ['--radial-text-hover' as string]: '#FFFFFF',
            borderRadius: '9999px',
          } as CSSProperties}
          aria-label="Toggle menu"
          aria-expanded={mobileMenuOpen}
        >
          <span data-radial-fill className="radial-hover-fill" />
          <div className="radial-hover-content flex w-6 flex-col gap-1.5">
            <span 
              className="h-0.5 transition-all duration-300"
              style={{ 
                backgroundColor: 'var(--color-text-primary)',
                transform: mobileMenuOpen ? 'rotate(45deg) translate(5px, 5px)' : 'none'
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
                transform: mobileMenuOpen ? 'rotate(-45deg) translate(5px, -5px)' : 'none'
              }}
            />
          </div>
        </button>
      </div>

      <AnimatePresence>
        {mobileMenuOpen && (
          <MobileNav activeSection={activeSection} onClose={closeMobileMenu} onNavigate={onNavigate} />
        )}
      </AnimatePresence>
    </nav>
  );
}
