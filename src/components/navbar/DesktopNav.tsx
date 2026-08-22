import { memo, type CSSProperties } from 'react';
import { NAV_ITEMS } from '../../config/site';
import ThemeToggle from '../ThemeToggle';
import CvDropdown from './CvDropdown';

interface DesktopNavProps {
  activeSection: string;
  progress: Record<string, number>;
  onNavigate?: (section: string) => void;
}

function DesktopNavComponent({ activeSection, progress, onNavigate }: DesktopNavProps) {
  return (
    <div className="desktop-navigation">
      <nav className="section-track" aria-label="Primary navigation">
        {NAV_ITEMS.map((item) => {
          const active = activeSection === item.sectionId;
          return (
            <a
              key={item.label}
              href={item.href}
              aria-current={active ? 'location' : undefined}
              className={active ? 'is-active' : ''}
              style={{ '--section-progress': progress[item.sectionId] ?? 0 } as CSSProperties}
              onClick={(event) => {
                if (onNavigate) {
                  event.preventDefault();
                  onNavigate(item.sectionId);
                }
              }}
            >
              <span>{item.label}</span>
              <i aria-hidden="true"><b /></i>
            </a>
          );
        })}
      </nav>

      <div className="header-utilities">
        <CvDropdown />
        <ThemeToggle />
      </div>
    </div>
  );
}

export default memo(DesktopNavComponent);
