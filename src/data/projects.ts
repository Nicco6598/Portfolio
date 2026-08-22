export interface Project {
  id: string;
  index: string;
  name: string;
  tagline: string;
  role: string;
  date: string;
  tags: string[];
  description: string;
  impact: string;
  imageUrl?: string;
  imageAlt?: string;
  liveUrl?: string;
  githubUrl?: string;
  features?: string[];
  outcomes?: string[];
}

export const projects: Project[] = [
  {
    id: '01',
    index: '01',
    name: 'Quantara',
    tagline: 'Operations control for railway projects',
    role: 'Founder & Product Engineer',
    date: '2026',
    tags: ['SaaS', 'TypeScript', 'PostgreSQL', 'Semantics'],
    description:
      'Quantara is the first product of Semantics. It brings progress, costs, documents and teams into one place for railway contractors, replacing the spreadsheets and email chains that make site reporting fragile. I shaped it with people in the field and built most of the system.',
    impact:
      'Turns a fragmented reporting process into a single system that shows what changed before it becomes a problem on site.',
    imageUrl: '/assets/projects/quantara.jpg',
    imageAlt: 'Railway junction cutting through monumental concrete',
    liveUrl: 'https://semantics-nu.vercel.app/products/quantara',
    features: [
      'One shared record of progress, costs, and documents per project',
      'Change tracking that surfaces differences before they escalate',
      'Accountability trail: who decided, who verified, what is missing',
      'Built for regulated environments where field crews and offices work from the same data'
    ],
    outcomes: [
      'In active development, designed directly with railway contractors.',
      'Replaces spreadsheet-and-email reporting with one shared source of truth.',
      'Every edit keeps its author, so reviews stop at the data instead of starting from memory.'
    ],
  },
  {
    id: '02',
    index: '02',
    name: 'Halion',
    tagline: 'Treasury intelligence for on-chain teams',
    role: 'Full-Stack Developer',
    date: '2026',
    tags: ['Next.js', 'TypeScript', 'Web3', 'SaaS'],
    description:
      'Halion turns wallet activity and stablecoin flows into a clear operating view for treasury teams. Authentication stays wallet-native and the platform never takes custody: it reads the chain, filters the noise and surfaces what needs attention.',
    impact:
      'Gives treasury teams direct visibility into wallets and flows without giving up custody or digging through block explorers.',
    imageUrl: '/assets/projects/halion.jpg',
    imageAlt: 'Concentric black metal rings threaded by a reflective cable',
    features: [
      'Wallet and stablecoin monitoring with alert digests',
      'Sign-in with any wallet, no keys stored anywhere',
      'Zero-custody architecture end to end',
      'Custom dashboard system built with Tailwind CSS'
    ],
    outcomes: [
      'Condensed raw on-chain activity into signals a team can review in minutes.',
      'Kept the security model simple: read-only access, no custody, ever.'
    ],
  },
  {
    id: '03',
    index: '03',
    name: 'Sillage',
    tagline: 'A database and community for niche perfumery',
    role: 'Full-Stack Developer',
    date: '2026',
    tags: ['Next.js', 'Supabase', 'Gemini AI', 'Tailwind CSS'],
    description:
      'Sillage gives niche-fragrance collectors a structured way to explore perfumes, notes and batches. Reviews follow performance over time, while AI-assisted moderation and rate limiting keep the community useful without slowing the product down.',
    impact:
      'Made a deep, messy product category navigable, with moderation that scales without me in the loop.',
    imageUrl: '/assets/projects/sillage.jpg',
    imageAlt: 'Smoked glass perfume bottle wrapped in a ribbon of scent',
    liveUrl: 'https://sillage-dev.vercel.app/',
    githubUrl: 'https://github.com/Nicco6598/sillage',
    features: [
      'Filtering across notes, accords, houses, and batches',
      'Reviews with performance tracking over time',
      'Gemini-assisted moderation of user-generated content',
      'Upstash rate limiting against spam and abuse',
      'RSC architecture with optimized media delivery'
    ],
    outcomes: [
      'Structured a dense catalog so collectors can compare batches, not just brands.',
      'Cut moderation overhead to near zero with AI screening plus rate limits.'
    ],
  },
  {
    id: '04',
    index: '04',
    name: 'Scandellari',
    tagline: 'Website for a railway contractor',
    role: 'Full-Stack Developer',
    date: '2025',
    tags: ['React', 'TypeScript', 'Node.js', 'Express'],
    description:
      'Scandellari had decades of railway work and almost no digital presence. I built a fast site around its services, certifications and history, with a contact flow that reaches the right people. Working with the team also gave me the field knowledge that later shaped Quantara.',
    impact:
      'Gave an offline industrial business a credible first impression online, and gave me the domain knowledge behind my own company.',
    imageUrl: '/assets/projects/scandellari.jpg',
    imageAlt: 'Railway worker walking along electrified tracks at dawn',
    liveUrl: 'https://scandellarigiacintosnc.it/',
    features: [
      'Responsive layout built for both office and site use',
      'Service architecture mapped to how clients actually buy',
      'Certifications and company history presented upfront',
      'Contact form backed by a Node/Express service'
    ],
    outcomes: [
      'Put fifty years of work history somewhere clients can actually find it.',
      'Became the field study behind Semantics and Quantara.'
    ],
  },
  {
    id: '05',
    index: '05',
    name: 'Exora',
    tagline: 'Prediction markets on-chain',
    role: 'Lead Developer',
    date: '2025',
    tags: ['Solidity', 'React', 'Web3.js', 'WalletConnect'],
    description:
      'Exora is a Web3 prediction markets platform: automated market making for live prices, dedicated TAO subnets per event category, and AI-assisted market proposals. I led development, focusing on the parts users actually touch — connecting a wallet, reading odds, taking a position — and on contracts that resolve through oracles rather than promises.',
    impact:
      'Shipped a working prediction market where the mechanics are legible to someone who has never used one before.',
    imageUrl: '/assets/projects/exora.jpg',
    imageAlt: 'Steel sphere poised where three machined channels diverge',
    liveUrl: 'https://exoramarkets.vercel.app/',
    features: [
      'Automated market making with continuous pricing',
      'TAO subnets dedicated to event categories',
      'AI-assisted market proposals and trend analysis',
      'WalletConnect integration',
      'Oracle-based event resolution'
    ],
    outcomes: [
      'Got wallet-to-position flows down to a few taps.',
      'Anchored trust in oracle resolution instead of operator discretion.'
    ],
  },
  {
    id: '06',
    index: '06',
    name: 'Moove Marketplace',
    tagline: 'NFT drops for travel brands',
    role: 'Full-Stack Developer',
    date: '2024',
    tags: ['React', 'Solidity', 'TypeScript'],
    description:
      'Moove Marketplace packages NFT drops, resale, and brand collabs into one platform for travel companies. The brief was to make on-chain collecting feel ordinary: browse a drop like a flight deal, buy with a wallet, resell without leaving the site.',
    impact:
      'Proved that drop mechanics and secondary trading can live in one flow that non-crypto users complete unaided.',
    imageUrl: '/assets/projects/moove-marketplace.jpg',
    imageAlt: 'Black travel case moving through a steel baggage carousel',
    liveUrl: 'https://moove-mp.vercel.app/',
    githubUrl: 'https://github.com/Nicco6598/MooveMP',
    features: [
      'Drops and secondary marketplace in one platform',
      'Travel-themed collections with artist collaborations',
      'On-chain buying, selling, and trading',
      'Virtual events and auction moments'
    ],
    outcomes: [
      'Collapsed release and resale into a single purchase path.',
      'Made collectible launches repeatable for brand teams.'
    ],
  },
  {
    id: '07',
    index: '07',
    name: 'MyNFT VRF Contract',
    tagline: 'Verifiably random NFT draws',
    role: 'Blockchain Developer',
    date: '2024',
    tags: ['Solidity', 'Chainlink VRF'],
    description:
      'An ERC-721 contract whose mints and rewards draw from Chainlink VRF, so randomness is provable on-chain rather than trusted to whoever runs the sale. Holders get gated access to premium utilities through standard ownership checks.',
    impact:
      'Removed the need to trust the organizer: every draw can be independently verified on-chain.',
    imageUrl: '/assets/projects/mynft-vrf.jpg',
    imageAlt: 'Steel spheres inside a glass verification chamber',
    githubUrl: 'https://github.com/Nicco6598/NFT-SmartContract',
    features: [
      'ERC-721 compliant architecture',
      'Chainlink VRF integration for provable randomness',
      'Holder-gated premium utilities',
      'Transparent reward distribution logic'
    ],
    outcomes: [
      'Every draw outcome is auditable on-chain by anyone.',
      'Interops with the standard marketplace and wallet tooling.'
    ],
  },
  {
    id: '08',
    index: '08',
    name: 'DAO Contract',
    tagline: 'Share-based on-chain governance',
    role: 'Smart Contract Developer',
    date: '2024',
    tags: ['Solidity', 'Governance'],
    description:
      'A modular DAO contract: members hold shares, shares carry voting weight, proposals move through explicit states from submission to execution. An admin application flow covers who gets to maintain the contract without ever overriding a vote.',
    impact:
      'Encodes the whole governance lifecycle in code, so decisions execute exactly as voted.',
    imageUrl: '/assets/projects/dao-contract.jpg',
    imageAlt: 'Stone voting blocks joined in a luminous circular quorum',
    githubUrl: 'https://github.com/Nicco6598/DAO-SmartContract',
    features: [
      'Share-weighted voting logic',
      'Proposal lifecycle from submission to execution',
      'Administrator application flow',
      'Modular structure for extension'
    ],
    outcomes: [
      'Voting rights and quorum rules readable straight from the contract.',
      'Reusable base for community-run treasuries and decisions.'
    ],
  },
  {
    id: '09',
    index: '09',
    name: 'voyage.',
    tagline: 'Travel booking paid in crypto',
    role: 'Full-Stack Developer',
    date: '2024',
    tags: ['Solidity', 'React', 'MetaMask'],
    description:
      'voyage. asks a simple question: what if paying for a hotel felt like buying anything else online? The prototype runs booking search, comparison, and reviews through a familiar interface, with MetaMask handling payment on the Sepolia test network.',
    impact:
      'Showed that crypto payments disappear into a normal booking flow when the interface does the explaining.',
    imageUrl: '/assets/projects/voyage.jpg',
    imageAlt: 'Metal travel card moving through a concrete departure gate',
    liveUrl: 'https://eth-d-app-travel.vercel.app/',
    githubUrl: 'https://github.com/Nicco6598/eth_dApp-Travel',
    features: [
      'MetaMask-based payments on Sepolia testnet',
      'Package browsing and side-by-side comparison',
      'Embedded reviews and feedback',
      'Member-only promotional logic'
    ],
    outcomes: [
      'Payment steps stayed under three clicks from cart to confirmation.',
      'Testnet-first setup kept every experiment safe to break.'
    ],
  },
  {
    id: '10',
    index: '10',
    name: 'Bombyx Menu',
    tagline: 'Digital menu for a cocktail bar',
    role: 'Lead Developer',
    date: '2024',
    tags: ['React', 'TypeScript'],
    description:
      'Bombyx wanted their cocktail menu off paper and onto the table without becoming a gimmick. The result is a mobile-first web menu with photography, food pairing notes, and instant updates when a recipe changes — built to survive sticky hands, weak signal, and a hundred simultaneous table sessions.',
    impact:
      'Replaced printed menus with something the venue updates itself in seconds.',
    imageUrl: '/assets/projects/bombyx-menu.jpg',
    imageAlt: 'Cocktail glass and aqua silk ribbon on a dark stone bar',
    liveUrl: 'https://bombyx-menu.vercel.app/',
    githubUrl: 'https://github.com/Nicco6598/bombyx-menu',
    features: [
      'Mobile-first layout tuned for table-side browsing',
      'Rich drink pages with pairing suggestions',
      'Instant content updates, no reprint cycle',
      'Lightweight build for spotty venue Wi-Fi'
    ],
    outcomes: [
      'Menu changes go live the moment the bartender decides.',
      'Guests browse pairings instead of flagging down staff.'
    ],
  },
];

export const projectCountLabel = projects.length.toString().padStart(2, '0');
