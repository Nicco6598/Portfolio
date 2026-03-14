import { useState, useEffect } from 'react';
import ThemeToggle from './ThemeToggle';

const SITE_NAME = 'MN.';

interface NavbarProps {
  onNavigate?: (section: string) => void;
}

export default function Navbar({ onNavigate }: NavbarProps) {
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 60);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const navLinks = [
    { label: 'About', href: '#about' },
    { label: 'Works', href: '#works' },
    { label: 'Contact', href: '#contact' },
  ];

  return (
    <nav
      className="fixed top-0 left-0 right-0 z-50 transition-all duration-300"
      style={{
        padding: '1.5rem 2rem',
        backgroundColor: scrolled ? 'rgba(var(--color-bg-rgb), 0.8)' : 'transparent',
        backdropFilter: scrolled ? 'blur(12px)' : 'none',
        borderBottom: scrolled ? '1px solid var(--color-border)' : 'none',
      }}
    >
      <div className="max-w-7xl mx-auto flex items-center justify-between">
        <a
          href="#"
          className="flex items-center gap-3 font-mono text-[12px] uppercase tracking-widest hover:opacity-70 transition-opacity"
          style={{ color: 'var(--color-text-primary)' }}
        >
          <div
            className="w-4 h-4 rounded-full"
            style={{ backgroundColor: 'var(--color-accent)' }}
          />
          {SITE_NAME}
        </a>

        <div className="flex items-center gap-8">
          <ul className="flex items-center gap-6">
            {navLinks.map((link) => (
              <li key={link.label}>
                <a
                  href={link.href}
                  onClick={(e) => {
                    if (onNavigate) {
                      e.preventDefault();
                      onNavigate(link.label.toLowerCase());
                    }
                  }}
                  className="font-mono text-[12px] uppercase tracking-[0.1em] transition-colors duration-200 hover:text-[var(--color-accent)]"
                  style={{ color: 'var(--color-text-secondary)' }}
                >
                  {link.label}
                </a>
              </li>
            ))}
          </ul>
          <ThemeToggle />
        </div>
      </div>
    </nav>
  );
}
