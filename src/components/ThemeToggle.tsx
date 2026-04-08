import type { CSSProperties } from 'react';
import { useCanHover } from '../hooks/useCanHover';
import { useTheme } from '../hooks/useTheme';
import { useRadialHover } from '../hooks/useRadialHover';

interface ThemeToggleProps {
  fullWidth?: boolean;
}

export default function ThemeToggle({ fullWidth = false }: ThemeToggleProps) {
  const { theme, toggleTheme } = useTheme();
  const canHover = useCanHover();
  const buttonRef = useRadialHover<HTMLButtonElement>(canHover);
  const isDarkTheme = theme === 'dark';
  const nextThemeLabel = isDarkTheme ? 'Switch to light mode' : 'Switch to dark mode';
  const isCompact = !fullWidth;
  const containerClassName = fullWidth
    ? 'w-full justify-between px-4 py-3'
    : 'justify-between gap-2.5 px-2.5 py-1.5';

  return (
    <button
      ref={buttonRef}
      onClick={toggleTheme}
      className={`radial-hover-surface group inline-flex items-center gap-3 rounded-full border font-mono text-left text-[10px] uppercase tracking-[0.16em] ${containerClassName}`.trim()}
      style={{
        ['--radial-fill' as string]: 'var(--color-accent)',
        ['--radial-text' as string]: 'var(--color-text-primary)',
        backgroundColor: 'var(--color-surface)',
        color: 'var(--color-text-primary)',
        border: '1px solid var(--color-border)',
      } as CSSProperties}
      aria-label={nextThemeLabel}
      aria-checked={isDarkTheme}
      role="switch"
      title={nextThemeLabel}
    >
      <span data-radial-fill className="radial-hover-fill" />
      <span className={`radial-hover-content flex min-w-0 items-center ${fullWidth ? 'flex-1 gap-3' : 'gap-2.5'}`.trim()}>
        <span className={`${fullWidth ? 'min-w-0 flex-1' : 'shrink-0'}`.trim()}>
          {fullWidth ? (
            <>
              <span
                className="block font-mono text-[11px] uppercase tracking-[0.16em]"
                style={{ opacity: 0.96 }}
              >
                Theme
              </span>
              <span
                className="mt-1 block font-mono text-[10px] uppercase tracking-[0.18em]"
                style={{ opacity: 0.8 }}
              >
                <span className="theme-toggle-label-slot" aria-hidden="true">
                  <span className={`theme-toggle-label ${isDarkTheme ? '' : 'is-visible'}`.trim()}>{'{light}'}</span>
                  <span className={`theme-toggle-label ${isDarkTheme ? 'is-visible' : ''}`.trim()}>{'{dark}'}</span>
                </span>
              </span>
            </>
          ) : (
            <span
              className="block font-mono text-[9px] uppercase tracking-[0.16em]"
              style={{ opacity: 0.88 }}
            >
              <span className="theme-toggle-label-slot" aria-hidden="true">
                <span className={`theme-toggle-label ${isDarkTheme ? '' : 'is-visible'}`.trim()}>{'{light}'}</span>
                <span className={`theme-toggle-label ${isDarkTheme ? 'is-visible' : ''}`.trim()}>{'{dark}'}</span>
              </span>
            </span>
          )}
        </span>

        <span
          className={`relative flex shrink-0 items-center rounded-full border ${isCompact ? 'h-5 w-9 px-[3px]' : 'h-6 w-10 px-1'}`.trim()}
          style={{
            borderColor: 'var(--color-border)',
            backgroundColor: 'color-mix(in srgb, var(--color-surface) 82%, var(--color-bg) 18%)',
          }}
          aria-hidden="true"
        >
          <span
            className={`absolute top-1/2 -translate-y-1/2 rounded-full transition-opacity duration-300 ${isCompact ? 'left-[3px] h-1 w-1' : 'left-1 h-1.5 w-1.5'}`.trim()}
            style={{
              backgroundColor: 'var(--color-accent)',
              opacity: isDarkTheme ? 0.28 : 0.9,
            }}
          />
          <span
            className={`absolute rounded-full transition-transform duration-500 ease-[cubic-bezier(0.22,1,0.36,1)] will-change-transform ${isCompact ? 'h-3.5 w-3.5' : 'h-4 w-4'}`.trim()}
            style={{
              backgroundColor: 'var(--color-accent)',
              transform: `translate3d(${isDarkTheme ? (isCompact ? '14px' : '16px') : '0px'}, 0, 0)`,
              boxShadow: isCompact ? '0 3px 8px rgba(255,77,0,0.18)' : '0 4px 12px rgba(255,77,0,0.22)',
            }}
          />
        </span>
      </span>
    </button>
  );
}
