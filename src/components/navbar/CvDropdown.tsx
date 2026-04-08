import { memo, useCallback, useState, type CSSProperties } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { CV_OPTIONS } from '../../config/site';
import { useClickOutside } from '../../hooks/useClickOutside';
import { useEscapeKey } from '../../hooks/useEscapeKey';
import { useRadialHover } from '../../hooks/useRadialHover';

function CvDropdownComponent() {
  const [isOpen, setIsOpen] = useState(false);
  const triggerRef = useRadialHover<HTMLButtonElement>();

  const closeDropdown = useCallback(() => {
    setIsOpen(false);
  }, []);

  const dropdownRef = useClickOutside<HTMLDivElement>(isOpen, closeDropdown);

  useEscapeKey(isOpen, closeDropdown);

  return (
    <div className="relative" ref={dropdownRef}>
      <button
        ref={triggerRef}
        onClick={() => setIsOpen((open) => !open)}
        className="radial-hover-surface group flex items-center gap-2 rounded-full border px-4 py-2 font-mono text-[10px] uppercase tracking-[0.15em]"
        style={{
          ['--radial-fill' as string]: 'var(--color-accent)',
          ['--radial-text' as string]: 'var(--color-text-primary)',
          ['--radial-text-hover' as string]: '#FFFFFF',
          borderColor: 'var(--color-accent)',
          color: 'var(--color-text-primary)',
        } as CSSProperties}
        aria-expanded={isOpen}
      >
        <span data-radial-fill className="radial-hover-fill" />
        <span className="radial-hover-content flex items-center gap-2">
          <span>Download CV</span>
          <svg
            className="h-3 w-3 transition-transform duration-200"
            style={{ transform: isOpen ? 'rotate(180deg)' : 'none' }}
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
          </svg>
        </span>
      </button>

      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.2 }}
            className="absolute top-full mt-2 right-0 py-2 rounded-xl border min-w-[140px]"
            style={{
              backgroundColor: 'var(--color-surface)',
              borderColor: 'var(--color-border)',
            }}
          >
            {CV_OPTIONS.map((option) => (
              <a
                key={option.label}
                href={option.href}
                target="_blank"
                rel="noopener noreferrer"
                className="block px-4 py-2 font-mono text-[10px] uppercase tracking-widest transition-colors duration-200 hover:opacity-70"
                style={{
                  color: option.tone === 'accent' ? 'var(--color-text-primary)' : 'var(--color-text-secondary)',
                }}
                onClick={closeDropdown}
              >
                {option.label}
              </a>
            ))}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

const CvDropdown = memo(CvDropdownComponent);

export default CvDropdown;
