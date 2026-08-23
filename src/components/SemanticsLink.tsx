import { motion, useReducedMotion } from 'framer-motion';
import { useState, type ReactNode } from 'react';
import { SEMANTICS_URL } from '../config/site';

interface SemanticsLinkProps {
  children?: ReactNode;
  className?: string;
}

const ARROW_REST = 'M6 18 L18 6 M10 6 L18 6 L18 14';
const ARROW_ACTIVE = 'M4 12 L20 12 M14 6 L20 12 L14 18';

export function SemanticsLink({ children = 'Semantics', className = '' }: SemanticsLinkProps) {
  const [isActive, setIsActive] = useState(false);
  const reduceMotion = useReducedMotion();

  return (
    <a
      className={`semantics-link ${className}`.trim()}
      href={SEMANTICS_URL}
      target="_blank"
      rel="noopener noreferrer"
      onMouseEnter={() => setIsActive(true)}
      onMouseLeave={() => setIsActive(false)}
      onFocus={() => setIsActive(true)}
      onBlur={() => setIsActive(false)}
      onPointerDown={() => setIsActive(true)}
      onPointerUp={() => setIsActive(false)}
      onPointerCancel={() => setIsActive(false)}
    >
      <span className="semantics-link__label">{children}</span>
      <svg className="semantics-link__arrow" viewBox="0 0 24 24" fill="none" aria-hidden="true">
        <motion.path
          d={ARROW_REST}
          animate={{ d: isActive ? ARROW_ACTIVE : ARROW_REST }}
          transition={{ duration: reduceMotion ? 0 : 0.28, ease: [0.16, 1, 0.3, 1] }}
          pathLength="1"
        />
      </svg>
    </a>
  );
}
