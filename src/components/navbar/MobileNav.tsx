import { memo, type CSSProperties } from 'react';
import { motion } from 'framer-motion';
import { CV_OPTIONS, NAV_ITEMS } from '../../config/site';
import { useRadialHover } from '../../hooks/useRadialHover';
import ThemeToggle from '../ThemeToggle';

interface MobileNavProps {
  activeSection: string;
  onClose: () => void;
  onNavigate?: (section: string) => void;
}

interface MobileNavActionLinkProps {
  href: string;
  label: string;
  tone: 'accent' | 'muted';
}

function MobileNavActionLink({ href, label, tone }: MobileNavActionLinkProps) {
  const linkRef = useRadialHover<HTMLAnchorElement>();

  return (
    <a
      ref={linkRef}
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      className="radial-hover-surface group rounded-full border px-4 py-2 font-mono text-[11px] uppercase tracking-widest"
      style={{
        ['--radial-fill' as string]: 'var(--color-accent)',
        ['--radial-text' as string]: tone === 'accent' ? 'var(--color-text-primary)' : 'var(--color-text-secondary)',
        ['--radial-text-hover' as string]: '#FFFFFF',
        borderColor: tone === 'accent' ? 'var(--color-accent)' : 'var(--color-border)',
        color: tone === 'accent' ? 'var(--color-text-primary)' : 'var(--color-text-secondary)',
      } as CSSProperties}
    >
      <span data-radial-fill className="radial-hover-fill" />
      <span className="radial-hover-content">{label}</span>
    </a>
  );
}

function MobileNavComponent({ activeSection, onClose, onNavigate }: MobileNavProps) {
  return (
    <motion.div
      initial={{ opacity: 0, height: 0 }}
      animate={{ opacity: 1, height: 'auto' }}
      exit={{ opacity: 0, height: 0 }}
      transition={{ duration: 0.3 }}
      className="md:hidden overflow-hidden"
      style={{
        backgroundColor: 'var(--color-bg)',
        borderBottom: '1px solid var(--color-border)',
      }}
    >
      <div style={{ padding: '1.5rem' }}>
        <ul className="flex flex-col gap-4 mb-6">
          {NAV_ITEMS.map((link) => (
            <li key={link.label}>
              <a
                href={link.href}
                onClick={(event) => {
                  if (onNavigate) {
                    event.preventDefault();
                    onNavigate(link.sectionId);
                  }

                  onClose();
                }}
                className="font-mono text-[14px] uppercase tracking-[0.15em] transition-colors duration-200"
                style={{
                  color: activeSection === link.sectionId ? 'var(--color-accent)' : 'var(--color-text-primary)',
                }}
              >
                {link.label}
              </a>
            </li>
          ))}
        </ul>

        <div className="flex gap-3">
          {CV_OPTIONS.map((option) => (
            <MobileNavActionLink
              key={option.shortLabel}
              href={option.href}
              label={option.shortLabel}
              tone={option.tone}
            />
          ))}
        </div>

        <div className="mt-6">
          <ThemeToggle />
        </div>
      </div>
    </motion.div>
  );
}

const MobileNav = memo(MobileNavComponent);

export default MobileNav;
