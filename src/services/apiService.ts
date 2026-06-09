/**
 * TypeScript Interfaces representing MERN Database models
 */
export interface Project {
  id: string;
  title: string;
  category: 'web' | 'mobile' | 'design';
  description: string;
  longDescription: string;
  image: string; // Gradient style or absolute asset path
  tags: string[];
  client: string;
  date: string;
  link?: string;
}

export interface ContactMessage {
  id: string;
  name: string;
  email: string;
  message: string;
  createdAt: string;
}

/**
 * Mock database arrays simulating MongoDB collections
 */
const mockProjectsDb: Project[] = [
  {
    id: 'aurelia',
    title: 'Aurelia Luxury Estates',
    category: 'web',
    description: 'A high-end property discovery portal showcasing architectural masterpieces with real-time immersive previews.',
    longDescription: 'Aurelia is a premier digital destination designed for high-net-worth individuals seeking ultra-luxurious real estate. The application incorporates a bespoke architectural modeling view, custom-curated editorial pages, fluid web interfaces, and an intelligent client inquiry flow. Built with React and TypeScript, it ensures sub-second load times for high-resolution images.',
    image: 'linear-gradient(135deg, #141414 0%, #3a2e12 100%)', // Gold charcoal gradient
    tags: ['React', 'TypeScript', 'CSS Modules', 'Intersection Observer'],
    client: 'Aurelia Developments',
    date: 'Dec 2025',
    link: 'https://example.com/aurelia'
  },
  {
    id: 'chronos',
    title: 'Chronos Smart Watch App',
    category: 'mobile',
    description: 'A sleek, premium mobile timepiece utility featuring fluid custom curves and neumorphic champagne widgets.',
    longDescription: 'Chronos redefines chronological tracking on wearables. Emphasizing a minimalist luxury watch face with organic tactile dials, the application syncs schedules, measures acoustic focus blocks, and utilizes subtle haptic feedback. Fully optimized for energy efficiency, with elegant customized charts.',
    image: 'linear-gradient(135deg, #0f0f0f 0%, #1e263c 100%)', // Charcoal sapphire gradient
    tags: ['React Native', 'TypeScript', 'Redux', 'Neumorphic Styling'],
    client: 'Chronos Horology',
    date: 'Oct 2025',
    link: 'https://example.com/chronos'
  },
  {
    id: 'elixir',
    title: 'Elixir Brand Identity',
    category: 'design',
    description: 'A sophisticated creative direction, typography, and brand system built for an organic luxury distillery.',
    longDescription: 'Elixir represents a comprehensive branding exploration that includes visual direction, label design, gold-foil typography styling, and micro-site artwork. The project showcases how high-end typography (Cinzel & Garamond) and a curated minimal gold palette can create an instant feeling of heritage, craftsmanship, and luxury.',
    image: 'linear-gradient(135deg, #0c0c0c 0%, #301616 100%)', // Charcoal burgundy gradient
    tags: ['Brand Strategy', 'Typography', 'Figma', 'Visual Direction'],
    client: 'Elixir Organic Distillery',
    date: 'Aug 2025',
    link: 'https://example.com/elixir'
  },
  {
    id: 'vesper',
    title: 'Vesper Wealth Management',
    category: 'web',
    description: 'An advanced decentralized asset dashboard combining glowing analytical charts with luxury dark design.',
    longDescription: 'Vesper Wealth is an elegant dashboard tailored for modern digital asset holders. It connects secure cryptographic wallets, visualizes real-time performance indicators, tracks yield opportunities, and outputs custom PDF accounting statements. Crafted with custom glassmorphism and extreme focus on responsiveness and accessibility.',
    image: 'linear-gradient(135deg, #101010 0%, #143525 100%)', // Charcoal emerald gradient
    tags: ['React.js', 'Chart.js', 'Web3 API', 'Tailored CSS'],
    client: 'Vesper Finance Group',
    date: 'Jun 2025',
    link: 'https://example.com/vesper'
  }
];

// Memory storage simulating MongoDB "messages" collection
const mockMessagesDb: ContactMessage[] = [];

/**
 * Artificial network latency helper
 */
const delay = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));

/**
 * Simulated MERN API Integration Layer
 */
export const apiService = {
  /**
   * Simulates GET /api/v1/projects
   */
  async fetchProjects(): Promise<{ success: boolean; data: Project[] }> {
    await delay(1000); // 1-second simulated MongoDB retrieval delay
    return {
      success: true,
      data: [...mockProjectsDb]
    };
  },

  /**
   * Simulates POST /api/v1/contact
   */
  async submitContactInquiry(name: string, email: string, message: string): Promise<{ success: boolean; message: string }> {
    await delay(1500); // 1.5-second simulated Express routing & MongoDB insertion delay
    
    // Server-side simulation checks
    if (!name || !email || !message) {
      throw new Error('Incomplete transmission data: All parameters required.');
    }

    const newMessage: ContactMessage = {
      id: Math.random().toString(36).substring(2, 9),
      name,
      email,
      message,
      createdAt: new Date().toISOString()
    };

    mockMessagesDb.push(newMessage);
    console.log('[MockDB MERN API] Stored new message:', newMessage);

    return {
      success: true,
      message: 'Transmission successfully committed to MongoDB mock collection.'
    };
  }
};
