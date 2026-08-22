import { memo, useCallback, useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { CV_OPTIONS } from '../../config/site';
import { useClickOutside } from '../../hooks/useClickOutside';
import { useEscapeKey } from '../../hooks/useEscapeKey';
import { MotionIcon } from '../MotionIcon';

interface CvDropdownProps {
  variant?: 'desktop' | 'mobile';
  onSelect?: () => void;
}

function Chevron({ open }: { open: boolean }) {
  return (
    <svg className={`cv-menu__chevron ${open ? 'is-open' : ''}`.trim()} viewBox="0 0 16 16" aria-hidden="true">
      <path d="m3 6 5 5 5-5" />
    </svg>
  );
}

function CvDropdownComponent({ variant = 'desktop', onSelect }: CvDropdownProps) {
  const [isOpen, setIsOpen] = useState(false);
  const closeDropdown = useCallback(() => setIsOpen(false), []);
  const dropdownRef = useClickOutside<HTMLDivElement>(isOpen, closeDropdown);

  useEscapeKey(isOpen, closeDropdown);

  return (
    <div className={`cv-menu cv-menu--${variant} ${isOpen ? 'is-open' : ''}`.trim()} ref={dropdownRef}>
      <button
        type="button"
        className="cv-menu__trigger"
        onClick={() => setIsOpen((open) => !open)}
        aria-expanded={isOpen}
        aria-haspopup="menu"
      >
        <span>{variant === 'mobile' ? 'Download CV' : 'CV'}</span>
        <Chevron open={isOpen} />
      </button>

      <AnimatePresence initial={false}>
        {isOpen ? (
          <motion.div
            className="cv-menu__panel"
            role="menu"
            initial={{ clipPath: 'inset(0 0 100% 0)', opacity: 0 }}
            animate={{ clipPath: 'inset(0 0 0% 0)', opacity: 1 }}
            exit={{ clipPath: 'inset(0 0 100% 0)', opacity: 0 }}
            transition={{ duration: 0.38, ease: [0.16, 1, 0.3, 1] }}
          >
            {CV_OPTIONS.map((option) => (
              <a
                key={option.label}
                href={option.href}
                target="_blank"
                rel="noopener noreferrer"
                role="menuitem"
                onClick={() => {
                  closeDropdown();
                  onSelect?.();
                }}
              >
                <span>{option.label}</span>
                <MotionIcon direction="down" />
              </a>
            ))}
          </motion.div>
        ) : null}
      </AnimatePresence>
    </div>
  );
}

export default memo(CvDropdownComponent);
