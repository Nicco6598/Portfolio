interface MotionIconProps {
  direction?: 'up-right' | 'down-right' | 'down' | 'up';
  className?: string;
}

const PATHS = {
  'up-right': { shaft: 'M7 17 17 7', head: 'M9 7h8v8' },
  'down-right': { shaft: 'M7 7l10 10', head: 'M9 17h8V9' },
  down: { shaft: 'M12 5v14', head: 'M6 13l6 6 6-6' },
  up: { shaft: 'M12 19V5', head: 'M6 11l6-6 6 6' },
} as const;

export function MotionIcon({ direction = 'up-right', className = '' }: MotionIconProps) {
  const paths = PATHS[direction];

  return (
    <svg
      className={`motion-icon ${className}`.trim()}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.7"
      strokeLinecap="square"
      strokeLinejoin="miter"
      aria-hidden="true"
    >
      <path className="motion-icon__shaft" pathLength="1" d={paths.shaft} />
      <path className="motion-icon__head" pathLength="1" d={paths.head} />
    </svg>
  );
}

export function CloseIcon() {
  return (
    <svg
      className="close-icon"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.7"
      strokeLinecap="square"
      aria-hidden="true"
    >
      <path d="M6 6l12 12M18 6 6 18" />
    </svg>
  );
}
