const ABOUT_LEAD =
  'I design and build web products that feel clear, fast, and well-considered, from marketing surfaces to full-stack application flows.';

const ABOUT_PARAGRAPHS = [
  'My work usually sits at the intersection of product thinking, frontend craft, and implementation quality. I build with React, Next.js, Vite, Node.js, and TypeScript, and I am comfortable carrying a project from UI structure and interaction design to APIs, data models, and admin workflows.',
  'That can mean rebuilding a corporate website with stronger trust signals and performance, shipping a custom admin panel with structured CRUD flows, or architecting a full-stack product with relational data, validation, and a maintainable codebase. I care a lot about clean systems, readable code, and interfaces that stay sharp under real-world use.',
  'Previously at Capgemini Engineering, I worked on responsive interfaces for a blockchain mobility dApp and improved Core Web Vitals while integrating external APIs. Today, as a freelance full-stack developer, I focus on projects where execution quality, clarity, and long-term maintainability all matter.',
];

const SNAPSHOT_ITEMS = [
  { label: 'Current role', value: 'Freelance Full-Stack Developer' },
  { label: 'Previous role', value: 'Associate Product Software Engineer at Capgemini Engineering' },
  { label: 'Core stack', value: 'React, Next.js, Vite, Node.js, TypeScript, PostgreSQL' },
];

const STRENGTHS = [
  {
    label: 'Frontend quality',
    value: 'Interfaces with stronger hierarchy, cleaner interactions, and more intentional visual systems.',
  },
  {
    label: 'Full-stack delivery',
    value: 'From application structure and forms to APIs, relational data, and maintainable admin workflows.',
  },
  {
    label: 'Performance mindset',
    value: 'Projects shaped around fast rendering, practical Lighthouse wins, and better day-to-day usability.',
  },
];

const WORKING_STYLE = [
  'Translate complex requirements into clearer product flows and simpler interfaces.',
  'Build systems that are easier to extend instead of shipping brittle one-off implementations.',
  'Balance visual polish with delivery discipline, type safety, and long-term maintainability.',
];

const SKILL_GROUPS = [
  { label: 'Frontend', items: ['React', 'Next.js', 'Vite', 'TypeScript', 'JavaScript', 'Tailwind CSS', 'Zustand', 'Shadcn/ui'] },
  { label: 'Backend', items: ['Node.js', 'Express', 'PostgreSQL', 'Drizzle ORM', 'REST APIs', 'Zod', 'React Hook Form'] },
  { label: 'Product & data', items: ['Admin Panels', 'CRUD Workflows', 'Content Modelling', 'Performance Audits', 'UI Systems'] },
  { label: 'Web3 & extra', items: ['Solidity', 'Hardhat', 'Ethers.js', 'Web3.js', 'Python', 'Git'] },
];

export default function About() {
  return (
    <section
      id="about"
      className="px-6 py-24 md:px-12"
      style={{ backgroundColor: 'var(--color-bg)' }}
    >
      <div className="mx-auto max-w-7xl">
        <span
          className="mb-4 block font-mono text-[11px] uppercase tracking-widest"
          style={{ color: 'var(--color-accent)' }}
        >
          About
        </span>
        <h2
          className="font-serif-display text-[clamp(32px,5vw,56px)]"
          style={{ color: 'var(--color-text-primary)' }}
        >
          Product-minded development, built with care.
        </h2>
        <p
          className="mt-4 max-w-3xl text-base leading-7 md:text-[17px]"
          style={{ color: 'var(--color-text-secondary)' }}
        >
          {ABOUT_LEAD}
        </p>

        <div className="mt-12 grid gap-10 lg:grid-cols-[minmax(0,1.15fr)_minmax(320px,0.85fr)] lg:gap-14">
          <div>
            <div
              className="mb-8 border-l pl-5 md:pl-6"
              style={{
                borderColor: 'var(--color-accent)',
              }}
            >
              <span
                className="mb-3 block font-mono text-[10px] uppercase tracking-[0.24em]"
                style={{ color: 'var(--color-accent)' }}
              >
                What I bring
              </span>
              <p
                className="max-w-2xl text-[18px] leading-8 md:text-[22px] md:leading-9"
                style={{ color: 'var(--color-text-primary)' }}
              >
                I like projects where product clarity, frontend polish, and implementation quality all need to hold together at once.
              </p>
            </div>

            <div className="space-y-6">
              {ABOUT_PARAGRAPHS.map((paragraph) => (
                <p
                  key={paragraph}
                  className="max-w-3xl text-base leading-relaxed md:text-[17px]"
                  style={{ color: 'var(--color-text-secondary)' }}
                >
                  {paragraph}
                </p>
              ))}
            </div>
          </div>

          <div className="space-y-8 lg:pt-1">
            <div
              className="border-y py-5"
              style={{
                borderColor: 'var(--color-border)',
              }}
            >
              <span
                className="mb-5 block font-mono text-[11px] uppercase tracking-[0.24em]"
                style={{ color: 'var(--color-accent)' }}
              >
                Snapshot
              </span>

              <div className="space-y-5">
                {SNAPSHOT_ITEMS.map((item) => (
                  <div
                    key={item.label}
                    className="border-b pb-5 last:border-b-0 last:pb-0"
                    style={{ borderColor: 'var(--color-border)' }}
                  >
                    <span
                      className="mb-2 block font-mono text-[10px] uppercase tracking-[0.22em]"
                      style={{ color: 'var(--color-text-secondary)' }}
                    >
                      {item.label}
                    </span>
                    <p
                      className="text-sm leading-6 md:text-[15px]"
                      style={{ color: 'var(--color-text-primary)' }}
                    >
                      {item.value}
                    </p>
                  </div>
                ))}
              </div>
            </div>

            <div>
              <span
                className="mb-5 block font-mono text-[11px] uppercase tracking-[0.24em]"
                style={{ color: 'var(--color-accent)' }}
              >
                Working style
              </span>

              <div className="space-y-4">
                {WORKING_STYLE.map((item, index) => (
                  <div
                    key={item}
                    className="grid gap-2 md:grid-cols-[44px_minmax(0,1fr)]"
                  >
                    <span
                      className="font-mono text-[10px] uppercase tracking-[0.22em]"
                      style={{ color: 'var(--color-accent)' }}
                    >
                      0{index + 1}
                    </span>
                    <p
                      className="text-sm leading-6 md:text-[15px]"
                      style={{ color: 'var(--color-text-primary)' }}
                    >
                      {item}
                    </p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>

        <div className="mt-14">
          <span
            className="mb-5 block font-mono text-[11px] uppercase tracking-[0.24em]"
            style={{ color: 'var(--color-accent)' }}
          >
            Selected strengths
          </span>

          <div className="grid gap-4 md:grid-cols-3">
            {STRENGTHS.map((item) => (
              <div key={item.label} className="space-y-3">
                <span
                  className="block font-mono text-[10px] uppercase tracking-[0.22em]"
                  style={{ color: 'var(--color-accent)' }}
                >
                  {item.label}
                </span>
                <p
                  className="text-sm leading-6 md:text-[15px]"
                  style={{ color: 'var(--color-text-primary)' }}
                >
                  {item.value}
                </p>
              </div>
            ))}
          </div>
        </div>

        <div className="mt-14">
          <span
            className="mb-5 block font-mono text-[11px] uppercase tracking-[0.24em]"
            style={{ color: 'var(--color-accent)' }}
          >
            Stack by area
          </span>

          <div
            className="border-y"
            style={{
              borderColor: 'var(--color-border)',
            }}
          >
            {SKILL_GROUPS.map((group) => (
              <div
                key={group.label}
                className="grid gap-4 border-b py-6 first:pt-7 last:border-b-0 last:pb-7 md:grid-cols-[160px_minmax(0,1fr)] md:gap-6"
                style={{
                  borderColor: 'var(--color-border)',
                }}
              >
                <div>
                  <span
                    className="block font-mono text-[11px] uppercase tracking-[0.24em]"
                    style={{ color: 'var(--color-accent)' }}
                  >
                    {group.label}
                  </span>
                </div>
                <div className="flex flex-wrap gap-2">
                  {group.items.map((skill) => (
                    <span
                      key={skill}
                      className="rounded-full border px-3 py-1.5 font-mono text-[10px] uppercase tracking-[0.16em]"
                      style={{
                        borderColor: 'var(--color-border)',
                        color: 'var(--color-text-primary)',
                        backgroundColor: 'color-mix(in srgb, var(--color-bg) 68%, transparent)',
                      }}
                    >
                      {skill}
                    </span>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
