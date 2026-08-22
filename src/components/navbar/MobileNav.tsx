import { memo, useRef, type RefObject } from 'react';
import { motion } from 'framer-motion';
import { NAV_ITEMS, SOCIAL_LINKS } from '../../config/site';
import { useDialogFocus } from '../../hooks/useDialogFocus';
import { MotionIcon } from '../MotionIcon';
import ThemeToggle from '../ThemeToggle';
import CvDropdown from './CvDropdown';

interface MobileNavProps {
  onClose: () => void;
  onNavigate?: (section: string) => void;
  returnFocusRef?: RefObject<HTMLElement | null>;
}

function MobileNavComponent({ onClose, onNavigate, returnFocusRef }: MobileNavProps) {
  const dialogRef = useRef<HTMLDivElement>(null);
  useDialogFocus({ containerRef: dialogRef, isOpen: true, returnFocusRef });

  return (
    <motion.div
      id="mobile-navigation"
      ref={dialogRef}
      className="mobile-navigation"
      initial={{ clipPath: 'inset(0 0 100% 0)' }}
      animate={{ clipPath: 'inset(0 0 0% 0)' }}
      exit={{ clipPath: 'inset(0 0 100% 0)' }}
      transition={{ duration: 0.72, ease: [0.76, 0, 0.24, 1] }}
      role="dialog"
      aria-modal="true"
      aria-label="Navigation"
      tabIndex={-1}
    >
      <nav className="mobile-section-track" aria-label="Primary navigation">
        {NAV_ITEMS.map((item) => {
          return (
            <a
              key={item.label}
              href={item.href}
              className="motion-link"
              onClick={(event) => {
                if (onNavigate) {
                  event.preventDefault();
                  onNavigate(item.sectionId);
                }
                onClose();
              }}
            >
              <span>{item.label}</span>
              <MotionIcon />
            </a>
          );
        })}
      </nav>

      <div className="mobile-navigation__footer">
        <div className="mobile-navigation__actions">
          <CvDropdown variant="mobile" onSelect={onClose} />
          <ThemeToggle fullWidth />
        </div>
        <div className="mobile-navigation__socials">
          {SOCIAL_LINKS.slice(0, 2).map((link) => (
            <a className="motion-link" key={link.label} href={link.href} target="_blank" rel="noopener noreferrer">
              <span>{link.label}</span>
              <MotionIcon />
            </a>
          ))}
        </div>
      </div>
    </motion.div>
  );
}

export default memo(MobileNavComponent);
