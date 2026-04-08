import { memo, type CSSProperties } from 'react';
import { NAV_ITEMS } from '../../config/site';
import ThemeToggle from '../ThemeToggle';
import CvDropdown from './CvDropdown';

interface DesktopNavProps {
  activeSection: string;
  onNavigate?: (section: string) => void;
}

function DesktopNavComponent({ activeSection, onNavigate }: DesktopNavProps) {
  return (
    <div className="hidden md:flex items-center gap-6">
      <ul className="flex items-center gap-1">
        {NAV_ITEMS.map((link) => {
          const isActive = activeSection === link.sectionId;

          return (
            <li key={link.label}>
              <a
                href={link.href}
                onClick={(event) => {
                  if (onNavigate) {
                    event.preventDefault();
                    onNavigate(link.sectionId);
                  }
                }}
                className="desktop-nav-link group px-3 py-2 font-mono text-[11px] uppercase tracking-[0.15em]"
                style={{
                  ['--desktop-nav-link-color' as string]: isActive ? 'var(--color-accent)' : 'var(--color-text-secondary)',
                  ['--desktop-nav-link-hover-color' as string]: isActive ? 'var(--color-accent)' : 'var(--color-text-primary)',
                } as CSSProperties}
              >
                {isActive ? (
                  <span className="desktop-nav-link-label">
                    <span>{'{'}</span>
                    <span>{link.label.toLowerCase()}</span>
                    <span>{'}'}</span>
                  </span>
                ) : (
                  <span className="desktop-nav-link-label">{link.label}</span>
                )}
              </a>
            </li>
          );
        })}
      </ul>

      <CvDropdown />
      <ThemeToggle />
    </div>
  );
}

const DesktopNav = memo(DesktopNavComponent);

export default DesktopNav;
