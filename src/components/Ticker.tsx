const TICKER_ITEMS = [
  "Milan, Italy",
  "Open to work",
  "iOS Developer",
  "Full-Stack",
  "Available for freelance",
];

export default function Ticker() {
  const duplicatedItems = [...TICKER_ITEMS, ...TICKER_ITEMS];

  return (
    <div
      className="w-full overflow-hidden py-4"
      style={{ backgroundColor: 'var(--color-accent)' }}
    >
      <div
        className="flex whitespace-nowrap"
        style={{
          animation: 'marquee 30s linear infinite',
        }}
      >
        {duplicatedItems.map((item, index) => (
          <span
            key={index}
            className="font-mono text-[12px] uppercase tracking-widest mx-6"
            style={{ color: '#FFFFFF' }}
          >
            {item}
            <span className="mx-6" style={{ opacity: 0.5 }}>•</span>
          </span>
        ))}
      </div>
    </div>
  );
}
