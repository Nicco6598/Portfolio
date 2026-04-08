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
        {NAV_ITEMS.map((link) => {
          const isActive = activeSection === link.sectionId;
          const displayLabel = isActive ? `{${link.label.toLowerCase()}}` : link.label;

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
                className="font-mono text-[11px] uppercase tracking-[0.15em] px-3 py-2 transition-colors duration-200"
                style={{ color: isActive ? 'var(--color-accent)' : 'var(--color-text-secondary)' }}
              >
                {displayLabel}
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
