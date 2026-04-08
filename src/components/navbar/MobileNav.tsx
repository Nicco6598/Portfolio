import { memo, type CSSProperties } from 'react';
import { motion } from 'framer-motion';
import { CV_OPTIONS, NAV_ITEMS } from '../../config/site';
import { useCanHover } from '../../hooks/useCanHover';
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
  onSelect: () => void;
}

function MobileNavActionLink({ href, label, tone, onSelect }: MobileNavActionLinkProps) {
  const canHover = useCanHover();
  const linkRef = useRadialHover<HTMLAnchorElement>(canHover);

  return (
    <a
      ref={linkRef}
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      onClick={onSelect}
      className={`radial-hover-surface group flex min-h-[88px] flex-col justify-between rounded-[24px] border p-4 ${canHover ? 'hover:-translate-y-0.5' : ''}`.trim()}
      style={{
        ['--radial-fill' as string]: 'var(--color-accent)',
        ['--radial-text' as string]: tone === 'accent' ? 'var(--color-text-primary)' : 'var(--color-text-secondary)',
        borderColor: tone === 'accent' ? 'var(--color-accent)' : 'var(--color-border)',
        backgroundColor: 'var(--color-surface)',
        color: tone === 'accent' ? 'var(--color-text-primary)' : 'var(--color-text-secondary)',
      } as CSSProperties}
    >
      <span data-radial-fill className="radial-hover-fill" />
      <span className="radial-hover-content flex h-full flex-col justify-between">
        <span
          className="font-mono text-[9px] uppercase tracking-[0.22em]"
          style={{ color: tone === 'accent' ? 'var(--color-accent)' : 'var(--color-text-secondary)' }}
        >
          Resource
        </span>
        <span className="font-mono text-[11px] uppercase tracking-[0.16em]">
          {label}
        </span>
      </span>
    </a>
  );
}

function MobileNavComponent({ activeSection, onClose, onNavigate }: MobileNavProps) {
  const canHover = useCanHover();

  return (
    <>
      <motion.button
        type="button"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        transition={{ duration: 0.22 }}
        className="fixed inset-0 z-10 md:hidden"
        style={{ backgroundColor: 'rgba(10, 10, 10, 0.18)', backdropFilter: 'blur(8px)' }}
        onClick={onClose}
        aria-label="Close navigation menu"
      />

      <motion.div
        id="mobile-navigation"
        initial={{ opacity: 0, y: -20, scale: 0.98 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        exit={{ opacity: 0, y: -16, scale: 0.98 }}
        transition={{ duration: 0.28, ease: [0.22, 1, 0.36, 1] }}
        className="fixed inset-x-4 bottom-4 top-[5.5rem] z-20 overflow-hidden rounded-[32px] border md:hidden"
        style={{
          backgroundColor: 'color-mix(in srgb, var(--color-bg) 90%, rgba(255,255,255,0.35) 10%)',
          borderColor: 'var(--color-border)',
          boxShadow: '0 22px 60px rgba(10,10,10,0.16)',
        }}
      >
        <div
          className="absolute inset-0"
          style={{
            background: 'radial-gradient(circle at top right, rgba(255,77,0,0.12) 0%, transparent 30%), radial-gradient(circle at bottom left, rgba(255,77,0,0.08) 0%, transparent 28%)',
          }}
        />

        <div className="relative flex h-full flex-col overflow-y-auto px-5 pb-5 pt-5">
          <div className="mb-6 flex items-start justify-between gap-4">
            <div>
              <span
                className="block font-mono text-[10px] uppercase tracking-[0.24em]"
                style={{ color: 'var(--color-accent)' }}
              >
                Navigation
              </span>
              <p
                className="mt-2 max-w-[14rem] text-sm leading-6"
                style={{ color: 'var(--color-text-secondary)' }}
              >
                Jump through the portfolio, grab the CV, or switch the site appearance.
              </p>
            </div>

            <span
              className="rounded-full border px-3 py-1 font-mono text-[10px] uppercase tracking-[0.18em]"
              style={{
                borderColor: 'var(--color-border)',
                color: 'var(--color-text-secondary)',
                backgroundColor: 'var(--color-surface)',
              }}
            >
              Menu
            </span>
          </div>

          <ul className="grid gap-3">
            {NAV_ITEMS.map((link, index) => {
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

                      onClose();
                    }}
                    className={`group flex items-center justify-between rounded-[24px] border px-4 py-4 transition-transform duration-200 ${canHover ? 'hover:-translate-y-0.5' : ''}`.trim()}
                    style={{
                      borderColor: isActive ? 'var(--color-accent)' : 'var(--color-border)',
                      backgroundColor: isActive ? 'color-mix(in srgb, var(--color-accent) 10%, var(--color-surface) 90%)' : 'var(--color-surface)',
                    }}
                  >
                    <span
                      className="font-mono text-[10px] uppercase tracking-[0.22em]"
                      style={{ color: isActive ? 'var(--color-accent)' : 'var(--color-text-secondary)' }}
                    >
                      0{index + 1}
                    </span>
                    <span
                      className="font-serif-display text-[30px] leading-none"
                      style={{ color: 'var(--color-text-primary)' }}
                    >
                      {displayLabel}
                    </span>
                    <span
                      className="font-mono text-[11px] uppercase tracking-[0.18em]"
                      style={{ color: isActive ? 'var(--color-accent)' : 'var(--color-text-secondary)' }}
                    >
                      Go
                    </span>
                  </a>
                </li>
              );
            })}
          </ul>

          <div className="mt-6 grid gap-3 sm:grid-cols-2">
            {CV_OPTIONS.map((option) => (
              <MobileNavActionLink
                key={option.shortLabel}
                href={option.href}
                label={option.shortLabel}
                tone={option.tone}
                onSelect={onClose}
              />
            ))}
          </div>

          <div className="mt-6">
            <ThemeToggle fullWidth />
          </div>
        </div>
      </motion.div>
    </>
  );
}

const MobileNav = memo(MobileNavComponent);

export default MobileNav;
