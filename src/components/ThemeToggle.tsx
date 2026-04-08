import type { CSSProperties } from 'react';
import { useTheme } from '../hooks/useTheme';
import { useRadialHover } from '../hooks/useRadialHover';

export default function ThemeToggle() {
  const { theme, toggleTheme } = useTheme();
  const buttonRef = useRadialHover<HTMLButtonElement>();

  return (
    <button
      ref={buttonRef}
      onClick={toggleTheme}
      className="radial-hover-surface group flex w-[52px] items-center justify-center gap-1 rounded-full border px-2 py-1.5 font-mono text-[11px] uppercase tracking-widest"
      style={{
        ['--radial-fill' as string]: 'var(--color-accent)',
        ['--radial-text' as string]: 'var(--color-text-primary)',
        ['--radial-text-hover' as string]: '#FFFFFF',
        backgroundColor: 'var(--color-surface)',
        color: 'var(--color-text-primary)',
        border: '1px solid var(--color-border)',
      } as CSSProperties}
      aria-label={`Switch to ${theme === 'light' ? 'dark' : 'light'} mode`}
    >
      <span data-radial-fill className="radial-hover-fill" />
      <span className="radial-hover-content flex items-center justify-center gap-1">
        <span className="transition-colors duration-200 group-hover:text-current">●</span>
        <span className="w-3">{theme === 'light' ? 'L' : 'D'}</span>
      </span>
    </button>
  );
}
