import { memo } from 'react';

const TICKER_ITEMS = [
  'Semantics — Milano',
  'Quantara · railway operations',
  'Kora · field collaboration',
  'Full-stack development',
  'React / TypeScript / Node.js',
];

const itemsString = TICKER_ITEMS.join('  •  ');

function TickerComponent() {
  return (
    <div
      className="flex h-12 w-full flex-shrink-0 items-center overflow-hidden"
      style={{ backgroundColor: 'var(--color-accent)' }}
      aria-hidden="true"
    >
      <div className="ticker-track">
        {[...Array(8)].map((_, i) => (
          <span
            key={i}
            className="ticker-item px-4 font-mono text-[12px] uppercase leading-none tracking-widest"
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
