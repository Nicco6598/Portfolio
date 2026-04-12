import type { CSSProperties } from 'react';
import { useCanHover } from '../hooks/useCanHover';
import { useTheme } from '../hooks/useTheme';
import { useRadialHover } from '../hooks/useRadialHover';

interface ThemeToggleProps {
  fullWidth?: boolean;
}

const LIGHT_THEME_TONE = '#C96A2B';
const DARK_THEME_TONE = '#2C2A28';

function SunIcon({ active }: { active: boolean }) {
  return (
    <svg
      className="h-3.5 w-3.5 shrink-0"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.8"
      aria-hidden="true"
      style={{ opacity: active ? 1 : 0.52 }}
    >
      <circle cx="12" cy="12" r="4" />
      <path strokeLinecap="round" d="M12 2.5v2.25M12 19.25v2.25M21.5 12h-2.25M4.75 12H2.5M18.72 5.28l-1.6 1.6M6.88 17.12l-1.6 1.6M18.72 18.72l-1.6-1.6M6.88 6.88l-1.6-1.6" />
    </svg>
  );
}

function MoonIcon({ active }: { active: boolean }) {
  return (
    <svg
      className="h-3.5 w-3.5 shrink-0"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.8"
      aria-hidden="true"
      style={{ opacity: active ? 1 : 0.52 }}
    >
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        d="M20 15.2A7.8 7.8 0 1 1 8.8 4 8.8 8.8 0 0 0 20 15.2Z"
      />
    </svg>
  );
}

export default function ThemeToggle({ fullWidth = false }: ThemeToggleProps) {
  const { theme, toggleTheme } = useTheme();
  const canHover = useCanHover();
  const buttonRef = useRadialHover<HTMLButtonElement>(canHover);
  const isDarkTheme = theme === 'dark';
  const nextThemeLabel = isDarkTheme ? 'Switch to light mode' : 'Switch to dark mode';
  const radialFill = isDarkTheme ? LIGHT_THEME_TONE : DARK_THEME_TONE;
  const isCompact = !fullWidth;
  const containerClassName = fullWidth
    ? 'w-full justify-between px-4 py-3'
    : 'justify-between gap-2.5 px-2.5 py-1.5';

  return (
    <button
      ref={buttonRef}
      onClick={toggleTheme}
      className={`theme-toggle-control radial-hover-surface group inline-flex items-center gap-3 rounded-full border font-mono text-left text-[10px] uppercase tracking-[0.16em] ${containerClassName}`.trim()}
      style={{
        ['--radial-fill' as string]: radialFill,
        ['--radial-text' as string]: 'var(--color-text-primary)',
        ['--radial-text-hover-override' as string]: '#FFFFFF',
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
          className={`relative flex shrink-0 items-center rounded-full border ${isCompact ? 'h-5 w-10 px-0.5' : 'h-6 w-11 px-0.5'}`.trim()}
          style={{
            borderColor: 'var(--color-border)',
            backgroundColor: 'color-mix(in srgb, var(--color-surface) 82%, var(--color-bg) 18%)',
          }}
          aria-hidden="true"
        >
          <span
            className={`absolute top-1/2 z-[1] inline-flex -translate-y-1/2 items-center justify-center transition-all duration-300 ${isCompact ? 'h-3.5 w-3.5' : 'h-4 w-4'}`.trim()}
            style={{
              left: isDarkTheme ? (isCompact ? '4px' : '5px') : 'auto',
              right: isDarkTheme ? 'auto' : (isCompact ? '4px' : '5px'),
              color: isDarkTheme ? LIGHT_THEME_TONE : DARK_THEME_TONE,
              opacity: 0.56,
            }}
          >
            {isDarkTheme ? <SunIcon active={false} /> : <MoonIcon active={false} />}
          </span>
          <span
            className={`absolute top-1/2 z-[2] inline-flex -translate-y-1/2 items-center justify-center rounded-full transition-transform duration-500 ease-[cubic-bezier(0.22,1,0.36,1)] will-change-transform ${isCompact ? 'h-4 w-4' : 'h-[18px] w-[18px]'}`.trim()}
            style={{
              backgroundColor: isDarkTheme ? DARK_THEME_TONE : LIGHT_THEME_TONE,
              transform: `translate3d(${isDarkTheme ? (isCompact ? '20px' : '22px') : '0px'}, 0, 0)`,
              boxShadow: isCompact
                ? `0 3px 8px color-mix(in srgb, ${isDarkTheme ? DARK_THEME_TONE : LIGHT_THEME_TONE} 34%, transparent)`
                : `0 4px 12px color-mix(in srgb, ${isDarkTheme ? DARK_THEME_TONE : LIGHT_THEME_TONE} 38%, transparent)`,
            }}
          >
            <span
              className="inline-flex items-center justify-center text-white"
              style={{
                color: isDarkTheme ? '#F5F5F0' : '#FFFFFF',
              }}
            >
              {isDarkTheme ? <MoonIcon active /> : <SunIcon active />}
            </span>
          </span>
        </span>
      </span>
    </button>
  );
}
