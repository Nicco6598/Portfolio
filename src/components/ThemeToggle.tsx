import { useTheme } from '../hooks/useTheme';

export default function ThemeToggle() {
  const { theme, toggleTheme } = useTheme();

  return (
    <button
      onClick={toggleTheme}
      className="px-3 py-1.5 rounded-full text-[11px] uppercase tracking-widest font-mono transition-all duration-300 hover:opacity-80"
      style={{
        backgroundColor: 'var(--color-surface)',
        color: 'var(--color-text-primary)',
        border: '1px solid var(--color-border)'
      }}
      aria-label={`Switch to ${theme === 'light' ? 'dark' : 'light'} mode`}
    >
      <span style={{ color: 'var(--color-accent)' }}>●</span> {theme === 'light' ? 'LIGHT' : 'DARK'}
    </button>
  );
}
