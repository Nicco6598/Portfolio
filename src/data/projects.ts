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
  liveUrl?: string;
  githubUrl?: string;
  features?: string[];
  outcomes?: string[];
}

export const projects: Project[] = [
  {
    id: '01',
    index: '01',
    name: 'Halion',
    tagline: 'Treasury intelligence for crypto-native teams',
    role: 'Full-Stack Developer',
    date: '2026',
    tags: ['Next.js 15', 'TypeScript', 'Tailwind CSS', 'Web3', 'SaaS'],
    description:
      'Halion, formerly Tidemark, is a refined SaaS platform built for teams that operate on-chain. It gives treasury and operations teams a clearer view of wallet activity, stablecoin flows, and critical signals through a product designed around precision rather than noise.',
    impact:
      'Shaped a sharper category product for on-chain treasury operations, combining wallet-native access, zero-custody architecture, and a premium system interface.',
    githubUrl: undefined,
    liveUrl: undefined,
    features: [
      'Web3 wallet and stablecoin monitoring',
      'Wallet-native authentication',
      'Zero-custody product architecture',
      'Alerts and digest workflows for treasury operations',
      'Custom dashboard UI system built with Tailwind CSS',
      'Minimal premium visual direction with dark-first styling'
    ],
    outcomes: [
      'Made treasury visibility more immediate through focused wallet and stablecoin tracking.',
      'Reduced dashboard clutter by prioritizing signals, alerts, and operational workflows.',
      'Established a more premium product language through custom components and a tighter visual system.'
    ],
  },
  {
    id: '02',
    index: '02',
    name: 'Sillage',
    tagline: 'A more elevated way to explore artistic perfumery',
    role: 'Full-Stack Developer',
    date: '2026',
    tags: ['Next.js', 'React', 'Tailwind CSS', 'Supabase', 'Gemini AI'],
    description:
      'Sillage is a premium platform for niche fragrance enthusiasts, built to make perfume discovery feel more curated, immersive, and informed. The experience combines structured fragrance data, editorial visual design, and community input inside a product with strong attention to detail.',
    impact:
      'Turned a dense fragrance catalog into a more desirable product experience through stronger curation, moderation, and interface quality.',
    liveUrl: 'https://sillage-dev.vercel.app/',
    githubUrl: 'https://github.com/Nicco6598/sillage',
    features: [
      'Advanced filtering across notes and accords',
      'Structured review system with performance and batch tracking',
      'Gemini-powered moderation for user-generated content',
      '"Stone & Silk" visual direction with custom UI',
      'Anti-spam protection with Upstash rate limiting',
      'RSC architecture and optimized media delivery'
    ],
    outcomes: [
      'Made a complex fragrance database easier to navigate without flattening its depth.',
      'Reduced moderation overhead through AI-assisted review screening and anti-spam protection.',
      'Delivered a more editorial and premium interface while preserving fast, efficient rendering.'
    ],
  },
  {
    id: '03',
    index: '03',
    name: 'Scandellari Website',
    tagline: 'A stronger digital presence for an established contractor',
    role: 'Full-Stack Developer',
    date: '2025',
    tags: ['React', 'TypeScript', 'Node.js', 'Express'],
    description:
      'This project brought a long-standing railway contractor online with a presence that feels clearer, more credible, and more current. The website was designed to communicate capability, trust, and operational seriousness through structure, typography, and content hierarchy.',
    impact:
      'Translated an offline industrial brand into a more credible digital touchpoint with clearer services, stronger trust markers, and better lead paths.',
    imageUrl: '/images/scandellari.png',
    liveUrl: 'https://scandellarigiacintosnc.it/',
    features: [
      'Responsive layout across desktop and mobile',
      'Clear service architecture with fast navigation',
      'Industrial visual language with custom typography',
      'Company history and certifications showcase',
      'Backend-integrated contact form'
    ],
    outcomes: [
      'Surfaced certifications, past work, and company history in a more structured and convincing way.',
      'Improved navigation quality across both desktop and mobile contexts.',
      'Created a more effective website for trust-building and inbound contact.'
    ],
  },
  {
    id: '04',
    index: '04',
    name: 'Exora',
    tagline: 'Prediction markets with a cleaner on-chain experience',
    role: 'Lead Developer',
    date: '2025',
    tags: ['Solidity', 'React', 'TypeScript', 'Web3.js', 'WalletConnect'],
    description:
      'Exora is a Web3 prediction markets platform designed to make speculative markets feel more legible, dynamic, and product-driven. It combines market mechanics, on-chain participation, and AI-assisted market generation inside a more focused interface.',
    impact:
      'Pushed prediction markets toward a more coherent product direction by tightening wallet UX, market creation, and trust signals.',
    liveUrl: 'https://exoramarkets.vercel.app/',
    githubUrl: undefined,
    features: [
      'Automated market making with live price dynamics',
      'Dedicated TAO subnets for event categories',
      'AI-assisted market proposals and trend analysis',
      'WalletConnect integration',
      'Oracle-based event resolution',
      'Optimized Solidity contract design'
    ],
    outcomes: [
      'Made prediction market mechanics easier to understand through a clearer frontend layer.',
      'Lowered entry friction with smoother wallet connection and participation flows.',
      'Strengthened trust through oracle-based resolution and cleaner contract architecture.'
    ],
  },
  {
    id: '05',
    index: '05',
    name: 'Moove Marketplace',
    tagline: 'A more accessible NFT product for travel-led digital drops',
    role: 'Full-Stack Developer',
    date: '2024',
    tags: ['JavaScript', 'TypeScript', 'React', 'Solidity'],
    description:
      'Moove Marketplace is an NFT platform built around travel brands, exclusive drops, and digital collectibles. The goal was to package marketplace mechanics into an experience that felt lighter, clearer, and more approachable to users beyond core crypto audiences.',
    impact:
      'Unified drops, marketplace flows, and brand storytelling into a more accessible Web3 commerce experience.',
    liveUrl: 'https://moove-mp.vercel.app/',
    githubUrl: 'https://github.com/Nicco6598/MooveMP',
    features: [
      'Marketplace and drop mechanics in one platform',
      'Travel-themed NFT collections',
      'On-chain buying, selling, and trading',
      'Virtual events and auction moments',
      'Artist collaborations',
      'Streamlined user-facing transaction flows'
    ],
    outcomes: [
      'Brought together release and resale flows in a single product surface.',
      'Made NFT interaction feel less intimidating through a friendlier frontend experience.',
      'Supported branded collectible launches with a more coherent digital platform.'
    ],
  },
  {
    id: '06',
    index: '06',
    name: 'MyNFT VRF Contract',
    tagline: 'Fairer NFT mechanics through verifiable randomness',
    role: 'Blockchain Developer',
    date: '2024',
    tags: ['Solidity', 'TypeScript'],
    description:
      'This smart contract powers an NFT marketplace built on ERC-721 standards, with a stronger focus on fairness and transparent reward logic. Chainlink VRF was integrated to support verifiable random draws in a way that improves trust at the protocol level.',
    impact:
      'Added stronger credibility to NFT reward mechanics by combining standard interoperability with verifiable randomness.',
    liveUrl: undefined,
    githubUrl: 'https://github.com/Nicco6598/NFT-SmartContract',
    features: [
      'ERC-721 compliant architecture',
      'Chainlink VRF integration',
      'Holder access to premium utilities',
      'Transparent reward distribution logic',
      'Clean interaction model for developers and users'
    ],
    outcomes: [
      'Improved trust around reward and draw outcomes through verifiable randomness.',
      'Kept the contract aligned with common NFT interoperability standards.',
      'Created a stronger technical base for gated and holder-centric experiences.'
    ],
  },
  {
    id: '07',
    index: '07',
    name: 'DAO Smart Contract',
    tagline: 'A modular base for transparent community governance',
    role: 'Smart Contract Developer',
    date: '2024',
    tags: ['Solidity', 'Remix IDE'],
    description:
      'This DAO contract was designed to translate governance mechanics into a more structured and transparent on-chain system. Proposal flows, voting rights, and participation logic were organized into a modular foundation for community-led decision-making.',
    impact:
      'Turned abstract governance principles into a clearer and more usable smart contract structure.',
    liveUrl: undefined,
    githubUrl: 'https://github.com/Nicco6598/DAO-SmartContract',
    features: [
      'Share-based governance logic',
      'Proposal and voting flows',
      'Transparent decision-making mechanisms',
      'Administrator application flow',
      'Participation-first governance structure'
    ],
    outcomes: [
      'Made governance interactions easier to reason about through clearer proposal and voting logic.',
      'Improved transparency around participation and decision rights.',
      'Provided a modular starting point for DAO-style community systems.'
    ],
  },
  {
    id: '08',
    index: '08',
    name: 'voyage.',
    tagline: 'Travel booking reimagined for crypto payments',
    role: 'Full-Stack Developer',
    date: '2024',
    tags: ['Solidity', 'TypeScript', 'React'],
    description:
      'voyage. explores how travel booking can feel more familiar and usable inside a crypto-native flow. Built around MetaMask and the Sepolia test network, it blends wallet-based payments with a more recognizable booking experience.',
    impact:
      'Tested a more usable model for crypto travel payments by connecting wallet transactions to familiar booking patterns.',
    liveUrl: 'https://eth-d-app-travel.vercel.app/',
    githubUrl: 'https://github.com/Nicco6598/eth_dApp-Travel',
    features: [
      'MetaMask-based crypto payments',
      'Sepolia testnet integration',
      'Travel package browsing and comparison',
      'Embedded reviews and feedback',
      'Member-only promotional logic'
    ],
    outcomes: [
      'Reduced adoption friction by grounding wallet payments in a familiar booking structure.',
      'Created a safer experimentation layer through testnet-based transaction flows.',
      'Made package selection easier through comparison and review features.'
    ],
  },
  {
    id: '09',
    index: '09',
    name: 'Bombyx Digital Menu',
    tagline: 'A digital menu designed for the pace of the venue',
    role: 'Lead Developer',
    date: '2024',
    tags: ['React', 'TypeScript'],
    description:
      'Bombyx Digital Menu is a mobile-first product built for a cocktail bar that wanted a more current and flexible guest experience. It replaces printed material with a cleaner, faster, easier-to-update interface designed for real table-side browsing.',
    impact:
      'Replaced static print with a more adaptable in-venue product that improved browsing, updates, and overall presentation.',
    liveUrl: 'https://bombyx-menu.vercel.app/',
    githubUrl: 'https://github.com/Nicco6598/bombyx-menu',
    features: [
      'Mobile-first responsive design',
      'Rich visuals and detailed drink content',
      'Food and drink pairing suggestions',
      'Web-based replacement for print menus',
      'Faster operational updates'
    ],
    outcomes: [
      'Improved menu discoverability through stronger mobile hierarchy and richer content.',
      'Reduced update friction by removing print dependency.',
      'Created a browsing experience better suited to real in-bar usage.'
    ],
  },
];

export const projectCountLabel = projects.length.toString().padStart(2, '0');