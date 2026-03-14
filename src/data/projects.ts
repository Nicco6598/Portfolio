export interface Project {
  id: string;
  index: string;
  name: string;
  tagline: string;
  role: string;
  date: string;
  tags: string[];
  description: string;
  imageUrl?: string;
  liveUrl?: string;
  githubUrl?: string;
  features?: string[];
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
    imageUrl: '/images/sillage_logo_white.svg',
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
    imageUrl: '/images/exora_logo.png',
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
    imageUrl: '/images/marketplace.png',
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
    imageUrl: '/images/nft.png',
    liveUrl: undefined,
    githubUrl: 'https://github.com/Nicco6598/NFT-SmartContract',
    features: [
      'ERC-721 standard for NFT compatibility',
      'Chainlink VRF integration for fair random draws',
      'Exclusive access to premium content for holders',
      'Transparent reward distribution system',
      'Simple interface for developer and user interaction'
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
    imageUrl: '/images/dao.png',
    liveUrl: undefined,
    githubUrl: 'https://github.com/Nicco6598/DAO-SmartContract',
    features: [
      'Share-based governance system',
      'Proposal voting mechanism',
      'Transparent community decision-making',
      'Administrator application process',
      'Core values of transparency and participation'
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
    imageUrl: '/images/travel.png',
    liveUrl: 'https://eth-d-app-travel.vercel.app/',
    githubUrl: 'https://github.com/Nicco6598/eth_dApp-Travel',
    features: [
      'MetaMask integration for crypto payments',
      'Sepolia test network for safe transactions',
      'Package exploration and price comparison',
      'Integrated review and feedback system',
      'Exclusive promotions for registered members'
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
    imageUrl: '/images/bombyx_logo.png',
    liveUrl: 'https://bombyx-menu.vercel.app/',
    githubUrl: 'https://github.com/Nicco6598/bombyx-menu',
    features: [
      'Mobile-first responsive design',
      'Rich imagery and detailed product descriptions',
      'Pairing suggestions for food and drinks',
      'Replaces static print with dynamic web app',
      'Reduces printing costs and keeps content updated'
    ],
  },
];
