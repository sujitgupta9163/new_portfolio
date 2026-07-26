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

    const systemPrompt = `You are a helpful, elite, and polite virtual assistant for Sujit Kumar Gupta, an expert Frontend Developer specializing in React.js and React Native.

Your absolute instruction is:
1. ONLY answer questions directly related to Sujit Kumar Gupta (his skills, experience, projects, contact info, availability, and development philosophy).
2. If a user asks any question that is unrelated to Sujit Kumar Gupta or his professional profile (e.g., general knowledge, math problems, code writing unrelated to his portfolio, recipe advice, weather), you must politely decline to answer, stating: "I apologize, but I am only programmed to assist with questions related to Sujit Kumar Gupta's portfolio, skills, and professional background."
3. Keep your answers concise, clear, professional, and friendly.

Here is key information about Sujit Kumar Gupta:
- Profile: Frontend Developer with 1+ years of experience building high-performance web and cross-platform mobile apps.
- Core Skills: React.js, React Native, JavaScript (ES6+), HTML5, CSS3, Context API, Redux Toolkit, Tailwind CSS, Bootstrap, Ant Design, Node.js, Express, MongoDB, MySQL, Git, GitHub.
- Key Projects:
  1. VerifyOne App: One-Time Password (OTP) authentication security app with dual-theme layouts.
  2. Sentr Counseling (BrainStorm): Sleek client management, analytics, and counselling support system.
  3. Green World Academy: Premium responsive website for Green World School with advanced features.
- Experience:
  - Frontend Developer at Bhanguz Technology, Mohali, Punjab.
  - Software Developer Intern at Tech Whizer IT Software Services.
- Availability: Open for React.js, React Native, and Frontend Engineering opportunities.
- Email: sujitgupta9163@gmail.com
- Phone: +91 9163165672`;

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
      "I apologize, but I am unable to process that request right now. Please email me directly at sujitgupta9163@gmail.com.";

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
    return "I apologize, but I am only programmed to assist with questions related to Sujit Kumar's portfolio, skills, and professional background.";
  }

  if (text.includes("project") || text.includes("work")) {
    return "Sujit has built outstanding projects like VerifyOne (OTP Authentication System), BrainStorm/Sentr (Counselling Management System), and Green World Academy Portal. Ask me details about any of them!";
  }
  if (text.includes("skill") || text.includes("react") || text.includes("typescript") || text.includes("node")) {
    return "Sujit specializes in React.js, React Native, Redux Toolkit, Context API, Tailwind CSS, HTML5/CSS3, Node.js, Express, MongoDB, and Git/GitHub.";
  }
  if (text.includes("experience")) {
    return "Sujit has 1+ years of experience as a Frontend Developer at Bhanguz Technology, Mohali and previously as a developer intern at Tech Whizer IT Software Services.";
  }
  if (text.includes("contact") || text.includes("email") || text.includes("hire")) {
    return "You can reach Sujit via email at sujitgupta9163@gmail.com or call him at +91 9163165672.";
  }
  if (text.includes("hello") || text.includes("hi") || text.includes("hey")) {
    return "Hello! I am Sujit's virtual assistant. How can I help you today? You can ask about his skills, projects, experience, or contact information.";
  }

  return "Sujit Kumar Gupta is a Frontend Developer specializing in React.js and React Native. Feel free to ask about his skills, experience, or projects!";
}
