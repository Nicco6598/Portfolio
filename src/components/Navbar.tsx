import { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import ThemeToggle from './ThemeToggle';

const SITE_NAME = 'MN.';

interface NavbarProps {
  onNavigate?: (section: string) => void;
}

export default function Navbar({ onNavigate }: NavbarProps) {
  const [scrolled, setScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [activeSection, setActiveSection] = useState('');
  const [cvDropdownOpen, setCvDropdownOpen] = useState(false);
  const cvDropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 60);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (cvDropdownRef.current && !cvDropdownRef.current.contains(event.target as Node)) {
        setCvDropdownOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  useEffect(() => {
    const sections = ['works', 'about', 'contact'];
    
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setActiveSection(entry.target.id);
          }
        });
      },
      { threshold: 0.3 }
    );

    sections.forEach((id) => {
      const el = document.getElementById(id);
      if (el) observer.observe(el);
    });

    return () => observer.disconnect();
  }, []);

  const navLinks = [
    { label: 'Works', href: '#works' },
    { label: 'About', href: '#about' },
    { label: 'Contact', href: '#contact' },
  ];

  return (
    <nav
      className="fixed top-0 left-0 right-0 z-50 transition-all duration-300"
      style={{
        padding: '1.25rem 1.5rem',
        backgroundColor: scrolled ? 'var(--color-bg)' : 'transparent',
        backdropFilter: scrolled ? 'blur(12px)' : 'none',
        borderBottom: scrolled ? '1px solid var(--color-border)' : 'none',
      }}
    >
      <div className="max-w-7xl mx-auto flex items-center justify-between">
        <a
          href="#"
          className="flex items-center gap-2 font-mono text-[12px] uppercase tracking-widest transition-opacity hover:opacity-70 z-50 relative"
          style={{ color: 'var(--color-text-primary)' }}
        >
          <div
            className="w-3 h-3 rounded-full"
            style={{ backgroundColor: 'var(--color-accent)' }}
          />
          {SITE_NAME}
        </a>

        <div className="hidden md:flex items-center gap-6">
          <ul className="flex items-center gap-1">
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
                  className="relative font-mono text-[11px] uppercase tracking-[0.15em] px-3 py-2 transition-colors duration-200 group"
                  style={{ color: activeSection === link.href.slice(1) ? 'var(--color-accent)' : 'var(--color-text-secondary)' }}
                >
                  {link.label}
                  <span 
                    className="absolute bottom-1 left-3 right-3 h-0.5 bg-[var(--color-accent)] transition-transform duration-200 origin-left"
                    style={{ 
                      transform: activeSection === link.href.slice(1) ? 'scaleX(1)' : 'scaleX(0)'
                    }}
                  />
                </a>
              </li>
            ))}
          </ul>
          
          <div className="relative" ref={cvDropdownRef}>
            <button
              onClick={() => setCvDropdownOpen(!cvDropdownOpen)}
              className="font-mono text-[10px] uppercase tracking-[0.15em] px-4 py-2 rounded-full border transition-all duration-200 hover:opacity-70 flex items-center gap-2"
              style={{
                borderColor: 'var(--color-accent)',
                color: 'var(--color-accent)',
              }}
            >
              Download CV
              <svg 
                className="w-3 h-3 transition-transform duration-200" 
                style={{ transform: cvDropdownOpen ? 'rotate(180deg)' : 'none' }}
                fill="none" 
                viewBox="0 0 24 24" 
                stroke="currentColor"
              >
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
              </svg>
            </button>
            
            <AnimatePresence>
              {cvDropdownOpen && (
                <motion.div
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  transition={{ duration: 0.2 }}
                  className="absolute top-full mt-2 right-0 py-2 rounded-xl border min-w-[140px]"
                  style={{
                    backgroundColor: 'var(--color-surface)',
                    borderColor: 'var(--color-border)',
                  }}
                >
                  <a
                    href="/assets/Marco_Niccolini_CV_2026(EN).pdf"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="block px-4 py-2 font-mono text-[10px] uppercase tracking-widest transition-colors duration-200 hover:opacity-70"
                    style={{ color: 'var(--color-text-primary)' }}
                  >
                    English
                  </a>
                  <a
                    href="/assets/Marco_Niccolini_CV_2026(IT).pdf"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="block px-4 py-2 font-mono text-[10px] uppercase tracking-widest transition-colors duration-200 hover:opacity-70"
                    style={{ color: 'var(--color-text-secondary)' }}
                  >
                    Italiano
                  </a>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
          
          <ThemeToggle />
        </div>

        <button
          className="md:hidden p-2 z-50 relative"
          onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          aria-label="Toggle menu"
        >
          <div className="flex flex-col gap-1.5 w-6">
            <span 
              className="h-0.5 transition-all duration-300"
              style={{ 
                backgroundColor: 'var(--color-text-primary)',
                transform: mobileMenuOpen ? 'rotate(45deg) translate(5px, 5px)' : 'none'
              }}
            />
            <span 
              className="h-0.5 transition-all duration-300"
              style={{ 
                backgroundColor: 'var(--color-text-primary)',
                opacity: mobileMenuOpen ? 0 : 1
              }}
            />
            <span 
              className="h-0.5 transition-all duration-300"
              style={{ 
                backgroundColor: 'var(--color-text-primary)',
                transform: mobileMenuOpen ? 'rotate(-45deg) translate(5px, -5px)' : 'none'
              }}
            />
          </div>
        </button>
      </div>

      <AnimatePresence>
        {mobileMenuOpen && (
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
                {navLinks.map((link) => (
                  <li key={link.label}>
                    <a
                      href={link.href}
                      onClick={(e) => {
                        if (onNavigate) {
                          e.preventDefault();
                          onNavigate(link.label.toLowerCase());
                        }
                        setMobileMenuOpen(false);
                      }}
                      className="font-mono text-[14px] uppercase tracking-[0.15em] transition-colors duration-200"
                      style={{ 
                        color: activeSection === link.href.slice(1) ? 'var(--color-accent)' : 'var(--color-text-primary)' 
                      }}
                    >
                      {link.label}
                    </a>
                  </li>
                ))}
              </ul>
              
              <div className="flex gap-3">
                <a
                  href="/assets/Marco_Niccolini_CV_2026(EN).pdf"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="font-mono text-[11px] uppercase tracking-widest px-4 py-2 rounded-full border transition-all duration-200 hover:opacity-70"
                  style={{
                    borderColor: 'var(--color-accent)',
                    color: 'var(--color-accent)',
                  }}
                >
                  CV (EN)
                </a>
                <a
                  href="/assets/Marco_Niccolini_CV_2026(IT).pdf"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="font-mono text-[11px] uppercase tracking-widest px-4 py-2 rounded-full border transition-all duration-200 hover:opacity-70"
                  style={{
                    borderColor: 'var(--color-border)',
                    color: 'var(--color-text-secondary)',
                  }}
                >
                  CV (IT)
                </a>
              </div>
              
              <div className="mt-6">
                <ThemeToggle />
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </nav>
  );
}
