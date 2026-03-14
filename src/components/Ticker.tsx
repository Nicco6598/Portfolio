import { memo } from 'react';

const TICKER_ITEMS = [
  "Pioltello (MI), Italy",
  "Open to work",
  "Full-Stack Developer",
  "React • Next.js • Node.js",
  "Available for freelance",
];

const itemsString = TICKER_ITEMS.join('  •  ');

function TickerComponent() {
  return (
    <div
      className="w-full overflow-hidden py-3"
      style={{ backgroundColor: 'var(--color-accent)' }}
    >
      <div className="ticker-track">
        {[...Array(8)].map((_, i) => (
          <span
            key={i}
            className="ticker-item font-mono text-[12px] uppercase tracking-widest px-4"
            style={{ color: '#FFFFFF' }}
          >
            {itemsString}
          </span>
        ))}
      </div>
    </div>
  );
}

export default memo(TickerComponent);
