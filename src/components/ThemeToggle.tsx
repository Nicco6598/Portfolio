import { useTheme } from '../hooks/useTheme';

interface ThemeToggleProps {
  fullWidth?: boolean;
}

export default function ThemeToggle({ fullWidth = false }: ThemeToggleProps) {
  const { theme, toggleTheme } = useTheme();
  const isDark = theme === 'dark';
  const nextTheme = isDark ? 'light' : 'dark';

  return (
    <button
      type="button"
      className={`theme-switch ${fullWidth ? 'theme-switch--wide' : ''}`.trim()}
      onClick={toggleTheme}
      role="switch"
      aria-checked={isDark}
      aria-label={`Switch to ${nextTheme} theme`}
      title={`Switch to ${nextTheme} theme`}
    >
      {fullWidth ? <span className="theme-switch__label">Theme</span> : null}
      <span className="theme-switch__state">
        {fullWidth ? <span>{isDark ? 'Dark' : 'Light'}</span> : null}
        <span className={`theme-switch__orb ${isDark ? 'is-dark' : ''}`.trim()} aria-hidden="true"><span /></span>
      </span>
    </button>
  );
}
