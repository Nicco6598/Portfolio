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
    description: 'Sillage is a premium web platform dedicated to fans of artistic perfumery and design. The project aims to create a refined and informative user experience, combining a granular fragrance database with social features and advanced analysis tools. Key features include advanced exploration with dynamic filters for notes and accords, a smart review system that tracks performance and batchCodes, and integration with Google Gemini for real-time automatic moderation.',
    imageUrl: '/images/sillage_logo_white.svg',
    liveUrl: 'https://sillage-dev.vercel.app/',
    githubUrl: 'https://github.com/Nicco6598/sillage',
  },
  {
    id: '02',
    index: '02',
    name: 'Scandellari Website',
    tagline: 'Corporate website for a railway contractor',
    role: 'Full-Stack Developer',
    date: '2025',
    tags: ['React', 'TypeScript', 'Node.js', 'Express'],
    description: 'The Scandellari Giacinto SNC website was built to bring a railway contractor online with a modern, trustworthy presence. The project focuses on a responsive layout, clear service presentation, and strong emphasis on certifications and completed works. The UX is designed for both desktop and mobile, with simple navigation and fast access to key sections.',
    imageUrl: '/images/scandellari.png',
    liveUrl: 'https://scandellarigiacintosnc.it/',
    githubUrl: 'https://github.com/Nicco6598/scandellari',
  },
  {
    id: '03',
    index: '03',
    name: 'Exora',
    tagline: 'Web3 prediction markets platform with dedicated TAO subnets',
    role: 'Lead Developer',
    date: '2025',
    tags: ['Solidity', 'React', 'TypeScript', 'Web3.js', 'WalletConnect'],
    description: 'Exora is a Web3 prediction markets dApp that rethinks how people bet on future events using blockchain. Users buy tokens that represent binary outcomes (Yes/No), where each token price reflects the market\'s perceived probability. The system is powered by automated market-making mechanisms that update prices in real time. Exora is built around dedicated TAO (Bittensor) subnets for each event category.',
    imageUrl: '/images/exora_logo.png',
    liveUrl: 'https://exoramarkets.vercel.app/',
    githubUrl: undefined,
  },
  {
    id: '04',
    index: '04',
    name: 'Moove Marketplace',
    tagline: 'NFT platform for travel brands with drops and marketplace',
    role: 'Full-Stack Developer',
    date: '2024',
    tags: ['JavaScript', 'TypeScript', 'React', 'Solidity'],
    description: 'MooveMP is an NFT platform created by Moove that lets users dive into travel-themed non-fungible tokens. Users can explore a wide range of travel-related NFTs that can be bought, sold, or traded on-chain. These NFTs can represent unique travel experiences, digital artworks inspired by famous destinations, or collectibles tied to iconic locations around the world.',
    imageUrl: '/images/marketplace.png',
    liveUrl: 'https://moove-mp.vercel.app/',
    githubUrl: 'https://github.com/Nicco6598/MooveMP',
  },
  {
    id: '05',
    index: '05',
    name: 'MyNFT VRF Contract',
    tagline: 'On-chain NFT marketplace with fair draws powered by Chainlink VRF',
    role: 'Blockchain Developer',
    date: '2024',
    tags: ['Solidity', 'TypeScript'],
    description: 'The MyNFT smart contract powers a decentralized marketplace for non-fungible tokens, highlighting digital uniqueness and ownership. Users can buy and sell NFTs representing digital art, collectibles, and more, all built on the ERC-721 standard. The contract integrates Verifiable Random Function (VRF) to guarantee fairness and transparency for random draws and rewards.',
    imageUrl: '/images/nft.png',
    liveUrl: undefined,
    githubUrl: 'https://github.com/Nicco6598/NFT-SmartContract',
  },
  {
    id: '06',
    index: '06',
    name: 'DAO Smart Contract',
    tagline: 'Modular governance system for decentralized communities',
    role: 'Smart Contract Developer',
    date: '2024',
    tags: ['Solidity', 'Remix IDE'],
    description: 'The DAO smart contract allows users to actively participate in decisions and governance of a decentralized platform. By holding shares and voting on proposals, users become key members of the ecosystem and directly contribute to its growth. Transparency and participation are core values of this DAO.',
    imageUrl: '/images/dao.png',
    liveUrl: undefined,
    githubUrl: 'https://github.com/Nicco6598/DAO-SmartContract',
  },
  {
    id: '07',
    index: '07',
    name: 'voyage.',
    tagline: 'Crypto-friendly travel booking with MetaMask and integrated reviews',
    role: 'Full-Stack Developer',
    date: '2024',
    tags: ['Solidity', 'TypeScript', 'React'],
    description: 'voyage. is a travel booking dApp that lets users purchase travel packages using cryptocurrencies. Through MetaMask integration and the Sepolia test network, it delivers a smooth and secure experience. Users can explore packages, compare prices and destinations, and complete purchases safely using their preferred tokens.',
    imageUrl: '/images/travel.png',
    liveUrl: 'https://eth-d-app-travel.vercel.app/',
    githubUrl: 'https://github.com/Nicco6598/eth_dApp-Travel',
  },
  {
    id: '08',
    index: '08',
    name: 'Bombyx Digital Menu',
    tagline: 'Mobile-first digital menu that enhances the in-bar experience',
    role: 'Lead Developer',
    date: '2024',
    tags: ['React', 'TypeScript'],
    description: 'The Bombyx Digital Menu is a mobile-first experience designed for a cocktail bar that wants to elevate how guests browse and discover drinks. The interface combines a modern visual design with clear information architecture, helping customers explore signatures, classics, and food pairings. The menu replaces static print with a responsive web app.',
    imageUrl: '/images/bombyx_logo.png',
    liveUrl: 'https://bombyx-menu.vercel.app/',
    githubUrl: 'https://github.com/Nicco6598/bombyx-menu',
  },
];
