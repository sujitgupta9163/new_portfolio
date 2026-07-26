export default async function handler(req, res) {
  // Enable CORS
  res.setHeader('Access-Control-Allow-Credentials', true);
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET,OPTIONS,PATCH,DELETE,POST,PUT');
  res.setHeader(
    'Access-Control-Allow-Headers',
    'X-CSRF-Token, X-Requested-With, Accept, Accept-Version, Content-Length, Content-MD5, Content-Type, Date, X-Api-Version'
  );

  if (req.method === 'OPTIONS') {
    res.status(200).end();
    return;
  }

  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method Not Allowed' });
  }

  try {
    const { message } = req.body;

    if (!message) {
      return res.status(400).json({ error: 'Message content is required' });
    }

    const apiKey = process.env.GEMINI_API_KEY || "";

    if (!apiKey || apiKey === "") {
      console.warn("Using mock response. Replace process.env.GEMINI_API_KEY with your real Gemini API key.");
      const mockReply = getMockChatResponse(message);
      return res.status(200).json({ reply: mockReply });
    }

    const url = `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${apiKey}`;

    const systemPrompt = `You are a helpful, elite, and polite virtual assistant for Sujit Kumar, an expert Full-Stack Software Developer and Digital Craftsman.

Your absolute instruction is:
1. ONLY answer questions directly related to Sujit Kumar (his skills, experience, projects, contact info, availability, and web design philosophy).
2. If a user asks any question that is unrelated to Sujit Kumar or his professional profile (e.g., general knowledge, math problems, code writing unrelated to his portfolio, recipe advice, weather), you must politely decline to answer, stating: "I apologize, but I am only programmed to assist with questions related to Sujit Kumar's portfolio and professional background."
3. Keep your answers concise, clear, professional, and friendly.

Here is key information about Sujit Kumar:
- Profile: Full-Stack Developer & Digital Craftsman with 6+ years of experience.
- Core Skills: React.js, TypeScript, Next.js, CSS Modules, Glassmorphism, Node.js, Express, RESTful APIs, Web Performance Tuning.
- Key Projects:
  1. Aurelia Luxury Estates: A high-end property discovery portal showcasing architectural masterpieces.
  2. Chronos Smart Watch App: A sleek, premium mobile timepiece utility featuring neumorphic champagne widgets.
  3. Elixir Brand Identity: Sophisticated branding & visual direction for an organic luxury distillery.
  4. Vesper Wealth Management: Advanced decentralized asset dashboard with glowing analytical charts and dark design.
- Philosophy: Bridging the gap between pure aesthetics and robust software architectures.
- Availability: Open for select commissions, freelance roles, and full-time engineering collaborations.
- Email: valerius@example.com (or via the contact form on this website).`;

    const response = await fetch(url, {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        contents: [
          {
            parts: [{ text: message }]
          }
        ],
        systemInstruction: {
          parts: [{ text: systemPrompt }]
        },
        generationConfig: {
          temperature: 0.3,
          maxOutputTokens: 250
        }
      })
    });

    if (!response.ok) {
      const errText = await response.text();
      console.error("Gemini API Error details:", errText);
      return res.status(502).json({ error: "Failed to communicate with Gemini API. Fallback mock active." });
    }

    const data = await response.json();
    const botReply = data.candidates?.[0]?.content?.parts?.[0]?.text || 
      "I apologize, but I am unable to process that request right now. Please email me directly at valerius@example.com.";

    return res.status(200).json({ reply: botReply.trim() });

  } catch (error) {
    console.error("Chat API route error:", error);
    return res.status(500).json({ error: "Internal Server Error" });
  }
}

// Fallback Mock Assistant
function getMockChatResponse(userText) {
  const text = userText.toLowerCase();

  const isAboutSujit = 
    text.includes("portfolio") || 
    text.includes("sujit") || 
    text.includes("skill") || 
    text.includes("experience") || 
    text.includes("project") || 
    text.includes("contact") || 
    text.includes("email") || 
    text.includes("about") || 
    text.includes("resume") ||
    text.includes("hire") ||
    text.includes("job") ||
    text.includes("work") ||
    text.includes("react") ||
    text.includes("typescript") ||
    text.includes("node") ||
    text.includes("hello") || 
    text.includes("hi") || 
    text.includes("hey");

  if (!isAboutSujit) {
    return "I apologize, but I am only programmed to assist with questions related to Sujit Kumar's portfolio and professional background.";
  }

  if (text.includes("project") || text.includes("work")) {
    return "Sujit has built 40+ premium projects. Highlighted projects include: Aurelia Luxury Estates, Chronos Smart Watch App, Elixir Brand Identity, and Vesper Wealth Management.";
  }
  if (text.includes("skill") || text.includes("react") || text.includes("typescript") || text.includes("node")) {
    return "Sujit's core competencies include: React.js & Hooks, TypeScript, Next.js, CSS Modules, Glassmorphic Styling, Node.js, Express, RESTful APIs, and Web Performance Tuning.";
  }
  if (text.includes("experience")) {
    return "Sujit has over 6 years of professional experience building scalable web applications and crafting pixel-perfect frontend experiences.";
  }
  if (text.includes("contact") || text.includes("email") || text.includes("hire")) {
    return "You can contact Sujit by filling out the form at the bottom of the page, or by emailing him directly at valerius@example.com.";
  }
  if (text.includes("hello") || text.includes("hi") || text.includes("hey")) {
    return "Hi! I am Sujit's virtual assistant. How can I help you today? You can ask about my skills, projects, experience, or how to contact me.";
  }

  return "Sujit Kumar is a Full-Stack Software Developer specializing in frontend craftsmanship and premium dark layouts. How can I assist you with his profile?";
}
