import { useTheme } from '../hooks/useTheme';

export default function ThemeToggle() {
  const { theme, toggleTheme } = useTheme();

  return (
    <button
      onClick={toggleTheme}
      className="w-[52px] px-2 py-1.5 rounded-full text-[11px] uppercase tracking-widest font-mono transition-all duration-300 hover:opacity-80 flex items-center justify-center gap-1"
      style={{
        backgroundColor: 'var(--color-surface)',
        color: 'var(--color-text-primary)',
        border: '1px solid var(--color-border)'
      }}
      aria-label={`Switch to ${theme === 'light' ? 'dark' : 'light'} mode`}
    >
      <span style={{ color: 'var(--color-accent)' }}>●</span>
      <span className="w-3">{theme === 'light' ? 'L' : 'D'}</span>
    </button>
  );
}
