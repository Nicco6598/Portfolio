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
    name: 'Sillage',
    tagline: 'Premium platform for niche perfumery enthusiasts',
    role: 'Full-Stack Developer',
    date: '2026',
    tags: ['Next.js', 'React', 'Tailwind CSS', 'Supabase', 'Gemini AI'],
    description: 'Sillage is a premium web platform dedicated to fans of artistic perfumery and design. The project aims to create a refined and informative user experience, combining a granular fragrance database with social features and advanced analysis tools.',
    impact: 'Turned a niche catalog into a premium exploration product with moderation, performance, and a stronger brand feel built in from day one.',
    liveUrl: 'https://sillage-dev.vercel.app/',
    githubUrl: 'https://github.com/Nicco6598/sillage',
    features: [
      'Advanced exploration with dynamic filters for notes and accords',
      'Smart review system tracking performance and batchCodes',
      'Google Gemini integration for real-time automatic moderation',
      '"Stone & Silk" design with high-impact custom UI',
      'Advanced anti-spam protection with Upstash rate-limiting',
      'RSC and Next.js Image optimization'
    ],
    outcomes: [
      'Made a dense fragrance catalog easier to browse through dynamic filtering and structured review data.',
      'Reduced moderation overhead with AI-assisted review checks and anti-spam protection.',
      'Shipped a more premium, editorial visual language without giving up performance-conscious rendering.'
    ],
  },
  {
    id: '02',
    index: '02',
    name: 'Scandellari Website',
    tagline: 'Corporate website for a railway contractor',
    role: 'Full-Stack Developer',
    date: '2025',
    tags: ['React', 'TypeScript', 'Node.js', 'Express'],
    description: 'The Scandellari Giacinto SNC website was built to bring a railway contractor online with a modern, trustworthy presence. The project focuses on a responsive layout, clear service presentation, and strong emphasis on certifications and completed works.',
    impact: 'Moved a traditional contractor brand to the web with a clearer service story, stronger trust signals, and easier contact paths.',
    imageUrl: '/images/scandellari.png',
    liveUrl: 'https://scandellarigiacintosnc.it/',
    githubUrl: 'https://github.com/Nicco6598/scandellari',
    features: [
      'Responsive layout optimized for desktop and mobile',
      'Clear service presentation with fast navigation',
      'Industrial visual language with custom typography',
      'Company history and certification showcase',
      'Contact form with backend integration'
    ],
    outcomes: [
      'Improved credibility by surfacing certifications, completed works, and company history in a cleaner structure.',
      'Made the site easier to navigate for both desktop and mobile visitors.',
      'Created a more modern lead-generation surface with direct contact integration.'
    ],
  },
  {
    id: '03',
    index: '03',
    name: 'Exora',
    tagline: 'Web3 prediction markets platform with dedicated TAO subnets',
    role: 'Lead Developer',
    date: '2025',
    tags: ['Solidity', 'React', 'TypeScript', 'Web3.js', 'WalletConnect'],
    description: 'Exora is a Web3 prediction markets dApp that rethinks how people bet on future events using blockchain. Users buy tokens that represent binary outcomes (Yes/No), where each token price reflects the market\'s perceived probability.',
    impact: 'Combined prediction market mechanics, wallet UX, and AI-assisted market creation into a sharper Web3 product direction.',
    liveUrl: 'https://exoramarkets.vercel.app/',
    githubUrl: undefined,
    features: [
      'Automated market-making with real-time price updates',
      'Dedicated TAO (Bittensor) subnets for each event category',
      'AI-powered market proposal and trend analysis',
      'WalletConnect integration for secure wallet connections',
      'Chainlink oracles for decentralized event resolution',
      'Optimized Solidity smart contracts'
    ],
    outcomes: [
      'Made advanced prediction market mechanics more legible through a clearer React interface.',
      'Reduced friction for on-chain participation with WalletConnect-based access.',
      'Strengthened market trust through oracle-driven resolution and optimized contract design.'
    ],
  },
  {
    id: '04',
    index: '04',
    name: 'Moove Marketplace',
    tagline: 'NFT platform for travel brands with drops and marketplace',
    role: 'Full-Stack Developer',
    date: '2024',
    tags: ['JavaScript', 'TypeScript', 'React', 'Solidity'],
    description: 'MooveMP is an NFT platform created by Moove that lets users dive into travel-themed non-fungible tokens. Users can explore a wide range of travel-related NFTs that can be bought, sold, or traded on-chain.',
    impact: 'Packaged drops, marketplace flows, and travel-brand storytelling into a more accessible NFT experience.',
    liveUrl: 'https://moove-mp.vercel.app/',
    githubUrl: 'https://github.com/Nicco6598/MooveMP',
    features: [
      'NFT marketplace with drops for exclusive releases',
      'Travel-themed digital artworks and collectibles',
      'On-chain buying, selling, and trading',
      'Virtual events and auctions',
      'Collaborations with digital artists worldwide',
      'Secure transactions with user-friendly interface'
    ],
    outcomes: [
      'Brought marketplace and drops flows together in a single product surface.',
      'Made a Web3 experience more approachable through a friendlier frontend layer.',
      'Supported brand-led digital releases with a dedicated collectibles platform.'
    ],
  },
  {
    id: '05',
    index: '05',
    name: 'MyNFT VRF Contract',
    tagline: 'On-chain NFT marketplace with fair draws powered by Chainlink VRF',
    role: 'Blockchain Developer',
    date: '2024',
    tags: ['Solidity', 'TypeScript'],
    description: 'The MyNFT smart contract powers a decentralized marketplace for non-fungible tokens, highlighting digital uniqueness and ownership. Built on the ERC-721 standard for compatibility and security.',
    impact: 'Focused on fairer NFT mechanics by combining ERC-721 interoperability with verifiable random draws.',
    liveUrl: undefined,
    githubUrl: 'https://github.com/Nicco6598/NFT-SmartContract',
    features: [
      'ERC-721 standard for NFT compatibility',
      'Chainlink VRF integration for fair random draws',
      'Exclusive access to premium content for holders',
      'Transparent reward distribution system',
      'Simple interface for developer and user interaction'
    ],
    outcomes: [
      'Added stronger trust to reward and draw mechanics through Chainlink VRF.',
      'Kept the contract aligned with standard NFT interoperability expectations.',
      'Created a cleaner base for gated access and holder-oriented experiences.'
    ],
  },
  {
    id: '06',
    index: '06',
    name: 'DAO Smart Contract',
    tagline: 'Modular governance system for decentralized communities',
    role: 'Smart Contract Developer',
    date: '2024',
    tags: ['Solidity', 'Remix IDE'],
    description: 'The DAO smart contract allows users to actively participate in decisions and governance of a decentralized platform. By holding shares and voting on proposals, users become key members of the ecosystem.',
    impact: 'Turned governance concepts into a modular contract structure for more transparent community decision-making.',
    liveUrl: undefined,
    githubUrl: 'https://github.com/Nicco6598/DAO-SmartContract',
    features: [
      'Share-based governance system',
      'Proposal voting mechanism',
      'Transparent community decision-making',
      'Administrator application process',
      'Core values of transparency and participation'
    ],
    outcomes: [
      'Created a clearer governance flow around proposals, voting, and participation rights.',
      'Made shared decision-making easier to reason about on-chain.',
      'Provided a modular base for DAO-style community mechanics.'
    ],
  },
  {
    id: '07',
    index: '07',
    name: 'voyage.',
    tagline: 'Crypto-friendly travel booking with MetaMask and integrated reviews',
    role: 'Full-Stack Developer',
    date: '2024',
    tags: ['Solidity', 'TypeScript', 'React'],
    description: 'voyage. is a travel booking dApp that lets users purchase travel packages using cryptocurrencies. Through MetaMask integration and the Sepolia test network, it delivers a smooth and secure experience.',
    impact: 'Explored how travel booking could feel simpler and safer inside a crypto-native purchase flow.',
    liveUrl: 'https://eth-d-app-travel.vercel.app/',
    githubUrl: 'https://github.com/Nicco6598/eth_dApp-Travel',
    features: [
      'MetaMask integration for crypto payments',
      'Sepolia test network for safe transactions',
      'Package exploration and price comparison',
      'Integrated review and feedback system',
      'Exclusive promotions for registered members'
    ],
    outcomes: [
      'Reduced experimentation risk by building on Sepolia before mainnet assumptions.',
      'Made crypto travel booking easier to navigate with package comparison and reviews.',
      'Connected wallet payments with a more familiar booking-style frontend.'
    ],
  },
  {
    id: '08',
    index: '08',
    name: 'Bombyx Digital Menu',
    tagline: 'Mobile-first digital menu that enhances the in-bar experience',
    role: 'Lead Developer',
    date: '2024',
    tags: ['React', 'TypeScript'],
    description: 'The Bombyx Digital Menu is a mobile-first experience designed for a cocktail bar that wants to elevate how guests browse and discover drinks. The interface combines modern visual design with clear information architecture.',
    impact: 'Replaced a static printed menu with a faster, easier-to-update mobile experience built for real in-venue use.',
    liveUrl: 'https://bombyx-menu.vercel.app/',
    githubUrl: 'https://github.com/Nicco6598/bombyx-menu',
    features: [
      'Mobile-first responsive design',
      'Rich imagery and detailed product descriptions',
      'Pairing suggestions for food and drinks',
      'Replaces static print with dynamic web app',
      'Reduces printing costs and keeps content updated'
    ],
    outcomes: [
      'Improved discoverability of drinks through richer mobile browsing and information hierarchy.',
      'Reduced operational friction by making menu updates digital instead of print-based.',
      'Built a UI better suited to table-side phone usage in a bar context.'
    ],
  },
];

export const projectCountLabel = projects.length.toString().padStart(2, '0');
