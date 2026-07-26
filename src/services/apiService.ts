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
    id: 'verifyone',
    title: 'VerifyOne — OTP Authentication System',
    category: 'web',
    description: 'A secure OTP-based identity verification system with a multi-step authentication flow and responsive design.',
    longDescription: 'VerifyOne is a secure OTP-based identity verification system designed to prevent unauthorized access. Built with React.js for the web portal and React Native for mobile integration, it features a multi-step authentication flow, Tailwind CSS for fluid responsive layouts, and protected route architectures for private areas.',
    image: '/verify-one-first.png',
    tags: ['React.js', 'React Native', 'Tailwind CSS', 'OTP Verification', 'Protected Routes'],
    client: 'Bhanguz Technology',
    date: 'June 2025',
    link: 'http://verifyone.bhanguz.com'
  },
  {
    id: 'brainstorm',
    title: 'BrainStorm (Sentr) — Counselling Management System',
    category: 'web',
    description: 'A full-featured counselling dashboard with role-based access control and real-time session visualization.',
    longDescription: 'BrainStorm (Sentr) is a full-featured Counselling Management System. It consists of an Admin Panel for managing users, counsellors, and session scheduling. Features role-based access control (RBAC), protected routes, real-time data visualization using Chart.js, and cross-platform mobile compatibility with React Native.',
    image: '/brain-strom-first.png',
    tags: ['React.js', 'React Native', 'Node.js', 'Express.js', 'Redux Toolkit', 'Chart.js'],
    client: 'Cognisentr',
    date: '2025',
    link: 'https://www.cognisentr.com'
  },
  {
    id: 'greenworld',
    title: 'Green World Academy Portal',
    category: 'web',
    description: 'An immersive, responsive educational platform featuring interactive virtual campus tours and a voice-enabled AI assistant.',
    longDescription: 'Green World Academy is a premium K-12 school portal featuring responsive layout designs, interactive class standard configurations, sports arena presentations, and a custom integration of an intelligent voice-enabled chatbot assistant powered by Gemini API.',
    image: '/green_world_school.jpg',
    tags: ['React.js', 'Tailwind CSS', 'Vercel API', 'Gemini AI', 'Speech Recognition'],
    client: 'Green World Academy',
    date: '2026',
    link: 'https://school-portfolio-three.vercel.app'
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
