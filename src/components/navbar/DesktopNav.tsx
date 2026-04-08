import { memo } from 'react';
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
        {NAV_ITEMS.map((link) => (
          <li key={link.label}>
            <a
              href={link.href}
              onClick={(event) => {
                if (onNavigate) {
                  event.preventDefault();
                  onNavigate(link.sectionId);
                }
              }}
              className="relative font-mono text-[11px] uppercase tracking-[0.15em] px-3 py-2 transition-colors duration-200 group"
              style={{ color: activeSection === link.sectionId ? 'var(--color-accent)' : 'var(--color-text-secondary)' }}
            >
              {link.label}
              <span
                className="absolute bottom-1 left-3 right-3 h-0.5 bg-[var(--color-accent)] transition-transform duration-200 origin-left"
                style={{
                  transform: activeSection === link.sectionId ? 'scaleX(1)' : 'scaleX(0)',
                }}
              />
            </a>
          </li>
        ))}
      </ul>

      <CvDropdown />
      <ThemeToggle />
    </div>
  );
}

const DesktopNav = memo(DesktopNavComponent);

export default DesktopNav;
