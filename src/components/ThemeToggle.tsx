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
  const currentThemeLabel = isDarkTheme ? 'dark' : 'light';
  const nextThemeLabel = isDarkTheme ? 'Switch to light mode' : 'Switch to dark mode';
  const containerClassName = fullWidth
    ? 'w-full justify-between px-4 py-3'
    : 'justify-between px-3 py-2';

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
      <span className="radial-hover-content flex min-w-0 flex-1 items-center gap-3">
        <span className="min-w-0 flex-1">
          <span
            className={`block font-mono uppercase ${fullWidth ? 'text-[11px] tracking-[0.16em]' : 'text-[10px] tracking-[0.16em]'}`.trim()}
            style={{ opacity: 0.96 }}
          >
            Theme
          </span>
          <span
            className={`mt-1 block font-mono uppercase transition-opacity duration-300 ${fullWidth ? 'text-[10px] tracking-[0.18em]' : 'text-[9px] tracking-[0.18em]'}`.trim()}
            style={{ opacity: fullWidth ? 0.8 : 0.72 }}
          >
            {`{${currentThemeLabel}}`}
          </span>
        </span>

        <span
          className="relative flex h-6 w-10 shrink-0 items-center rounded-full border px-1"
          style={{
            borderColor: 'var(--color-border)',
            backgroundColor: 'color-mix(in srgb, var(--color-surface) 82%, var(--color-bg) 18%)',
          }}
          aria-hidden="true"
        >
          <span
            className="absolute left-1 top-1/2 h-1.5 w-1.5 -translate-y-1/2 rounded-full transition-opacity duration-300"
            style={{
              backgroundColor: 'var(--color-accent)',
              opacity: isDarkTheme ? 0.28 : 0.9,
            }}
          />
          <span
            className="absolute h-4 w-4 rounded-full transition-transform duration-500 ease-[cubic-bezier(0.22,1,0.36,1)] will-change-transform"
            style={{
              backgroundColor: 'var(--color-accent)',
              transform: `translate3d(${isDarkTheme ? '16px' : '0px'}, 0, 0)`,
              boxShadow: '0 4px 12px rgba(255,77,0,0.22)',
            }}
          />
        </span>
      </span>
    </button>
  );
}
