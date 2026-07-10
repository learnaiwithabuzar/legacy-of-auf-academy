import { GoogleGenAI } from "@google/genai";

export interface MentorResponse {
  learningPath: Array<{
    step: number;
    title: string;
    duration: string;
    milestone: string;
  }>;
  projects: Array<{
    title: string;
    description: string;
    difficulty: string;
  }>;
  credentials: Array<{
    name: string;
    requirement: string;
  }>;
  incomePlan: {
    streams: Array<{
      source: string;
      monthlyProjectedUSD: number;
      strategy: string;
    }>;
    ethicalPrecaution: string;
  };
  businessPlan: {
    businessName: string;
    valueProposition: string;
    targetAudience: string;
    startupCostEstimate: string;
    scalingStrategy: string;
  };
}

export interface PlaylistTopic {
  title: string;
  duration: string;
  videoUrl: string;
  difficulty: string;
  shortDescription: string;
  thumbnailUrl: string;
  islamicInsights: string;
  businessApplication: string;
  incomeOpportunity: string;
}

export interface PlaylistResponse {
  courseTitle: string;
  topics: PlaylistTopic[];
}

export interface BusinessEvaluationResponse {
  businessIdea: string;
  ethicalScore: number;
  verdict: string;
  redFlags: string[];
  recommendedStructures: string[];
  improvementPlan: string;
  quranHadithReference: string;
  disclaimer?: string;
}

// Check for the API key inside development environment variables.
// Vite will inject this during development if configured via defineConfig define or import.meta.env
const getApiKey = (): string => {
  try {
    // Check process.env (injected during dev build)
    const envKey = (typeof process !== "undefined" && process.env?.GEMINI_API_KEY) || "";
    if (envKey && !envKey.includes("MY_GEMINI_API_KEY")) {
      return envKey;
    }
  } catch (e) {}

  try {
    // Fallback to import.meta.env
    const metaEnv = (import.meta as any).env;
    const metaKey = (metaEnv?.VITE_GEMINI_API_KEY as string) || (metaEnv?.GEMINI_API_KEY as string) || "";
    if (metaKey && !metaKey.includes("MY_GEMINI_API_KEY")) {
      return metaKey;
    }
  } catch (e) {}

  return "";
};

const apiKey = getApiKey();
const isDevelopment = !!(import.meta as any).env?.DEV;

// Initialize Gemini safely only if we have an API key
let aiClient: GoogleGenAI | null = null;
if (apiKey) {
  try {
    aiClient = new GoogleGenAI({
      apiKey: apiKey,
      httpOptions: {
        headers: {
          "User-Agent": "aistudio-build",
        },
      },
    });
    console.log("Legacy of Auf AI Provider: Gemini Client initialized.");
  } catch (e) {
    console.error("Failed to initialize Gemini Client:", e);
  }
} else {
  console.log("Legacy of Auf AI Provider: Operating in static mode. Using robust mock fallback.");
}

// --- PROVIDER 1: REAL GEMINI PROVIDER (DEVELOPMENT ONLY) ---
const geminiProvider = {
  async generateMentor(skill: string, level: string, goal: string): Promise<MentorResponse> {
    if (!aiClient) throw new Error("Gemini client is not available.");

    const prompt = `You are the Legacy of Auf Academy AI Mentor, named after the legendary Sahabi Abdur Rahman ibn Awf (RA), known for his immense ethical wealth and business brilliance.
Provide a comprehensive, high-fidelity Islamic career blueprint for a student with:
- Current Skill: ${skill}
- Current Experience Level: ${level}
- Career & Entrepreneurship Goal: ${goal}

Your response must be in structured JSON format matching this exact schema:
{
  "learningPath": [
    { "step": 1, "title": "Step title", "duration": "Duration description", "milestone": "What they learn or build" }
  ],
  "projects": [
    { "title": "Project name", "description": "Ethical, practical business project using this skill", "difficulty": "Level" }
  ],
  "credentials": [
    { "name": "Milestone Certificate Name", "requirement": "What must be completed to claim" }
  ],
  "incomePlan": {
    "streams": [
      { "source": "Stream Name (e.g., Freelance Retainer, Micro-SaaS, Halal Agency)", "monthlyProjectedUSD": 1200, "strategy": "Practical client-acquisition strategy" }
    ],
    "ethicalPrecaution": "Islamic business/ethical consideration (avoiding riba, clarity of contracts, etc.)"
  },
  "businessPlan": {
    "businessName": "Suggested Brand Name",
    "valueProposition": "Value prop aligning with Islamic customer rights & ethics",
    "targetAudience": "Target client segment",
    "startupCostEstimate": "Low cost/bootstrapped estimate (e.g., $100 for domain/server)",
    "scalingStrategy": "How to scale ethically (hiring, community profit-sharing)"
  }
}

Important Instructions:
1. Ensure the output is valid, parsable JSON.
2. Incorporate ethical Islamic entrepreneurship principles in every section.
3. Be specific, actionable, and realistic.`;

    const response = await aiClient.models.generateContent({
      model: "gemini-3.5-flash",
      contents: prompt,
      config: {
        responseMimeType: "application/json",
        temperature: 0.7,
      },
    });

    const text = response.text || "{}";
    return JSON.parse(text.trim()) as MentorResponse;
  },

  async generatePlaylist(playlistUrl: string, skillName: string, courseName: string): Promise<PlaylistResponse> {
    if (!aiClient) throw new Error("Gemini client is not available.");

    let parsedPlaylistId = "";
    try {
      if (playlistUrl.includes("list=")) {
        parsedPlaylistId = playlistUrl.split("list=")[1]?.split("&")[0] || "";
      }
    } catch (e) {}

    const prompt = `You are a curriculum engineer at Legacy of Auf Academy.
We need to generate a complete course curriculum of exactly 20 video topics based on a YouTube playlist.
The playlist URL is: ${playlistUrl} (Playlist ID: ${parsedPlaylistId || "UNKNOWN"})
The Course belongs to:
- Skill Path: ${skillName || "Islamic Entrepreneurship"}
- Course Title: ${courseName || "Ethical Wealth Mastery"}

Generate 20 high-quality, professional educational video topics for this course. Ensure they form a smooth progression from beginner to advanced concepts.
Your response must be in structured JSON format matching this exact schema:
{
  "courseTitle": "Generate a polished, premium course name based on input",
  "topics": [
    {
      "title": "Topic title (e.g., Lesson 1: Ethic of Trade)",
      "duration": "Duration (e.g., 14 mins)",
      "videoUrl": "A realistic YouTube video watch link (use high-quality real YouTube video IDs if possible, or realistic dummy watch links like https://www.youtube.com/watch?v=dQw4w9WgXcQ with different video IDs)",
      "difficulty": "Beginner",
      "shortDescription": "Fascinating description of what they learn",
      "thumbnailUrl": "A valid Unsplash image link or high-quality illustration link",
      "islamicInsights": "Relevant Quranic/Hadith guidance or Islamic ethical business rule for this lesson",
      "businessApplication": "Practical business application of this concept",
      "incomeOpportunity": "Tactical advice on how this skill translates to income generation"
    }
  ]
}

Ensure you output EXACTLY 20 topics in the 'topics' array to fulfill the 'Auto Course Generator' feature.
Ensure the output is valid, parsable JSON. Make the lesson topics sound highly educational, tactical, and incredibly high-value.`;

    const response = await aiClient.models.generateContent({
      model: "gemini-3.5-flash",
      contents: prompt,
      config: {
        responseMimeType: "application/json",
        temperature: 0.7,
      },
    });

    const text = response.text || "{}";
    return JSON.parse(text.trim()) as PlaylistResponse;
  },

  async generateCourseFromVideo(videoUrl: string, skillName: string, courseName: string): Promise<PlaylistResponse> {
    if (!aiClient) throw new Error("Gemini client is not available.");

    let parsedVideoId = "";
    try {
      if (videoUrl.includes("v=")) {
        parsedVideoId = videoUrl.split("v=")[1]?.split("&")[0] || "";
      } else if (videoUrl.includes("youtu.be/")) {
        parsedVideoId = videoUrl.split("youtu.be/")[1]?.split("&")[0] || "";
      }
    } catch (e) {}

    const prompt = `You are an elite curriculum engineer at Legacy of Auf Academy.
We need to generate a complete course curriculum of exactly 5 beautifully structured, high-ticket educational lessons/topics based on a single YouTube video.
The YouTube video URL is: ${videoUrl}
The Course belongs to:
- Skill Path: ${skillName || "AI & Automation"}
- Course Title: ${courseName || "ChatGPT Course Mastery"}

Generate exactly 5 high-quality, professional educational video topics representing the sequential outline of this course. Ensure they form a smooth progression from beginner to advanced concepts, with each lesson focusing on a specific aspect of the video content.
Your response must be in structured JSON format matching this exact schema:
{
  "courseTitle": "Polished, premium course name (e.g., ChatGPT Course Mastery or similar)",
  "topics": [
    {
      "title": "Topic title (e.g., Lesson 1: Introduction to Prompt Engineering)",
      "duration": "Duration (e.g., 12 mins)",
      "videoUrl": "${videoUrl}",
      "difficulty": "Beginner",
      "shortDescription": "Fascinating description of what they learn",
      "thumbnailUrl": "https://img.youtube.com/vi/${parsedVideoId || "ZmEqTgGrNHg"}/hqdefault.jpg",
      "islamicInsights": "Relevant Quranic/Hadith guidance or Islamic ethical business rule for this lesson",
      "businessApplication": "Practical business application of this concept",
      "incomeOpportunity": "Tactical advice on how this skill translates to income generation"
    }
  ]
}

Ensure you output EXACTLY 5 topics in the 'topics' array to fulfill the 'Auto Course Generator' feature.
Ensure the output is valid, parsable JSON. Make the lesson topics sound highly educational, tactical, and incredibly high-value.`;

    const response = await aiClient.models.generateContent({
      model: "gemini-3.5-flash",
      contents: prompt,
      config: {
        responseMimeType: "application/json",
        temperature: 0.7,
      },
    });

    const text = response.text || "{}";
    return JSON.parse(text.trim()) as PlaylistResponse;
  },

  async evaluateBusiness(businessIdea: string): Promise<BusinessEvaluationResponse> {
    if (!aiClient) throw new Error("Gemini client is not available.");

    const prompt = `You are the Legacy of Auf Academy Islamic Business Principles Advisor. Your role is to evaluate business ideas against Islamic commerce ethics (Fiqh al-Mu'amalat) and noble trade principles inspired by Abdur Rahman ibn Awf.
Business Idea: "${businessIdea}"

Provide a detailed ethical and functional evaluation of this idea. Your response must be in structured JSON format matching this exact schema:
{
  "businessIdea": "Short summary of evaluated idea",
  "ethicalScore": 85, // integer score from 0 (completely haram/unethical) to 100 (fully ethical/halal)
  "verdict": "Summary of alignment (e.g., Highly Aligned, Conditionally Aligned, High Ethical Risk)",
  "redFlags": [
    "List of potential issues such as Riba (interest), Gharar (excessive ambiguity), Maysir (gambling/speculation), or exploitation"
  ],
  "recommendedStructures": [
    "Islamic contract structures to use (e.g., Mudarabah, Musharakah, Murabahah, Salam, Ijarah)"
  ],
  "improvementPlan": "Actionable, concrete strategy to eliminate ethical risks and make the model highly blessed (Barakah-filled)",
  "quranHadithReference": "A beautiful authentic Hadith or Quranic verse that applies directly to this business model's ethics"
}

Ensure the output is valid, parsable JSON. Incorporate authentic Islamic finance principles with utmost seriousness and intellectual rigor.`;

    const response = await aiClient.models.generateContent({
      model: "gemini-3.5-flash",
      contents: prompt,
      config: {
        responseMimeType: "application/json",
        temperature: 0.6,
      },
    });

    const text = response.text || "{}";
    const data = JSON.parse(text.trim()) as BusinessEvaluationResponse;
    data.disclaimer = "This tool provides educational guidance based on authentic Islamic business ethics. It does not issue religious rulings. Consult a qualified scholar for specific rulings.";
    return data;
  }
};

// --- PROVIDER 2: MOCK/FALLBACK PROVIDER (OFFLINE/PRODUCTION SPARK PLAN) ---
const fallbackProvider = {
  async generateMentor(skill: string, level: string, goal: string): Promise<MentorResponse> {
    return {
      learningPath: [
        { step: 1, title: `Foundational Halal ${skill || "Skill"}`, duration: "2 weeks", milestone: "Build 3 starter micro-projects" },
        { step: 2, title: "Ethics of Islamic Commerce", duration: "1 week", milestone: "Read contracts and understand Amanah" },
        { step: 3, title: "Sovereign Client Acquisition", duration: "3 weeks", milestone: "Onboard your first ethical retainer client" }
      ],
      projects: [
        { title: `${skill || "Sovereign"} Ethical Platform`, description: "A high-fidelity dashboard that respects customer rights and processes halal transactions.", difficulty: level || "Intermediate" }
      ],
      credentials: [
        { name: `Certified ${skill || "Sovereign"} Practitioner`, requirement: "Complete all curriculum modules and submit Capstone Project" }
      ],
      incomePlan: {
        streams: [
          { source: "Ethical Freelancing", monthlyProjectedUSD: 1500, strategy: "Optimize Upwork/Fiverr profiles with clear service-level agreements and transparent billing." }
        ],
        ethicalPrecaution: "Avoid high-risk speculative contracts (Gharar) and ensure all terms are agreed in writing before work begins."
      },
      businessPlan: {
        businessName: "Al-Barakah Solutions",
        valueProposition: "High-integrity delivery with absolute transparency and ethical engineering.",
        targetAudience: "Small-to-medium ethical businesses and local Islamic organizations.",
        startupCostEstimate: "Under $150 (Domain, hosting, and professional email).",
        scalingStrategy: "Hire apprentice builders on a profit-sharing basis to build community capacity."
      }
    };
  },

  async generatePlaylist(playlistUrl: string, skillName: string, courseName: string): Promise<PlaylistResponse> {
    const fallbackTopics = Array.from({ length: 20 }, (_, i) => {
      const index = i + 1;
      let title = `Lesson ${index}: Foundational Trade & Business Structure`;
      let desc = `Mastering the critical structures of commerce, trade, and enterprise execution.`;
      let ethics = `Abdur Rahman ibn Awf (RA) maintained transparent pricing and never concealed any defects in his goods.`;
      let app = `Establish clear, written service agreements (Uqud) for all projects.`;
      let income = `Build a high-ticket retainer service offering this specialized skill to local ethical brands.`;

      if (index === 1) {
        title = "Lesson 1: The Creed of the Ethical Entrepreneur";
        desc = "Understanding how business and spiritual growth align inside the legacy of Abdur Rahman ibn Awf.";
        ethics = "The Prophet (PBUH) said: 'The honest, trustworthy merchant will be with the prophets, truthful ones, and martyrs' (Tirmidhi).";
      } else if (index === 2) {
        title = "Lesson 2: Eradicating Riba & speculative transactions";
        desc = "A detailed breakdown of modern banking, interest-free financing models, and contracts.";
        ethics = "Allah has permitted trade and forbidden interest (Surah Al-Baqarah: 275).";
      } else if (index === 5) {
        title = "Lesson 5: Drafting Bulletproof Contracts (Musha'arakah)";
        desc = "How to write ethical partnership agreements that respect mutual rights and limit ambiguity (Gharar).";
        ethics = "O you who believe, fulfill your contracts (Surah Al-Ma'idah: 1).";
      } else if (index === 10) {
        title = "Lesson 10: Pricing Strategy & Client Onboarding";
        desc = "How to value your skills fairly without greed, and set up clear milestones.";
        ethics = "Give full measure when you measure, and weigh with an even balance (Surah Al-Isra: 35).";
      } else if (index === 15) {
        title = "Lesson 15: Growth, Scaling, and Ethical Hiring";
        desc = "How to recruit apprentices and pay wages before their sweat dries.";
        ethics = "The Prophet (PBUH) said: 'Give the worker his wages before his sweat dries' (Ibn Majah).";
      } else if (index === 20) {
        title = "Lesson 20: Establishing Your Waqf and Legacy Asset";
        desc = "How to turn your business profits into permanent charity (Sadaqah Jariyah) for community elevation.";
        ethics = "Abdur Rahman ibn Awf emancipated 30,000 slaves and donated entire caravan streams to Medina's poor.";
      }

      const videoIds = [
        "z89V0PZ22eM", "zY07N_y2H68", "7p8_zYfK_b4", "V_0P6_G8hM4",
        "lY07p_2K8M8", "b_0Z8_N6hY4", "v_0P2_L8pM0", "k_0Y8_P2hM8",
        "x_0Z4_N6hY8", "m_0Y2_P8hM4", "q_0P8_Z2hY8", "r_0Y6_M2hM4",
        "s_0P4_P8hY0", "t_0Z2_N6hM8", "u_0Y4_M2hY4", "w_0P8_P6hM0",
        "y_0Z6_N2hY8", "a_0Y8_M4hM0", "c_0P2_P6hY4", "d_0Z4_N8hM0"
      ];

      return {
        title,
        duration: `${10 + (index % 5) * 3} mins`,
        videoUrl: `https://www.youtube.com/watch?v=${videoIds[i] || "dQw4w9WgXcQ"}`,
        difficulty: index <= 7 ? "Beginner" : index <= 14 ? "Intermediate" : "Advanced",
        shortDescription: desc,
        thumbnailUrl: `https://images.unsplash.com/photo-${1600000000000 + index * 50000}?w=600&q=80`,
        islamicInsights: ethics,
        businessApplication: app,
        incomeOpportunity: income
      };
    });

    return {
      courseTitle: courseName || "Sovereign Ethical Wealth Masterclass",
      topics: fallbackTopics
    };
  },

  async generateCourseFromVideo(videoUrl: string, skillName: string, courseName: string): Promise<PlaylistResponse> {
    const parsedVideoId = videoUrl.includes("youtu.be/") 
      ? (videoUrl.split("youtu.be/")[1]?.split("?")[0] || "ZmEqTgGrNHg")
      : (videoUrl.split("v=")[1]?.split("&")[0] || "ZmEqTgGrNHg");

    const fallbackTopics = [
      {
        title: "Lesson 1: Introduction to ChatGPT & Generative AI",
        duration: "12 mins",
        videoUrl,
        difficulty: "Beginner",
        shortDescription: "Understanding the foundations of large language models and prompt engineering inside Legacy of Auf.",
        thumbnailUrl: `https://img.youtube.com/vi/${parsedVideoId}/hqdefault.jpg`,
        islamicInsights: "Use knowledge to benefit humanity, avoiding deceit or plagiarism.",
        businessApplication: "Integrate AI to draft initial product copy and generate ideas.",
        incomeOpportunity: "Provide rapid prototyping and copy generation services to small local businesses."
      },
      {
        title: "Lesson 2: Advanced Prompting Techniques & Personas",
        duration: "15 mins",
        videoUrl,
        difficulty: "Beginner",
        shortDescription: "Master role-prompting, few-shot conditioning, and custom instructions for high-fidelity responses.",
        thumbnailUrl: `https://img.youtube.com/vi/${parsedVideoId}/hqdefault.jpg`,
        islamicInsights: "Allah loves when you perform any task with precision and excellence (Ihsan).",
        businessApplication: "Create customized brand voice bots for automatic customer communication.",
        incomeOpportunity: "Charge retainers for creating specialized prompt libraries for marketing departments."
      },
      {
        title: "Lesson 3: Automating Business Workflows with Custom GPTs",
        duration: "18 mins",
        videoUrl,
        difficulty: "Intermediate",
        shortDescription: "How to configure custom GPT assistants with specialized knowledge and direct API actions.",
        thumbnailUrl: `https://img.youtube.com/vi/${parsedVideoId}/hqdefault.jpg`,
        islamicInsights: "Fulfill your trusts (Amanah) and ensure automated systems never compromise user privacy.",
        businessApplication: "Establish an internal AI expert that drafts compliant contracts and answers policy queries.",
        incomeOpportunity: "Develop and license customized GPT solutions for niche industries."
      },
      {
        title: "Lesson 4: Islamic Ethical Guardrails for AI Generation",
        duration: "14 mins",
        videoUrl,
        difficulty: "Intermediate",
        shortDescription: "A deep dive into copyright, fact-checking, and ensuring truthfulness in all AI-generated copy.",
        thumbnailUrl: `https://img.youtube.com/vi/${parsedVideoId}/hqdefault.jpg`,
        islamicInsights: "O you who believe, be upright maintainers of justice, and witnesses to truth.",
        businessApplication: "Establish strict editorial verification loops before publishing any AI-generated copy.",
        incomeOpportunity: "Offer AI Auditing & Fact-checking consulting to high-integrity enterprise brands."
      },
      {
        title: "Lesson 5: Scaling Your Sovereign AI Services Agency",
        duration: "22 mins",
        videoUrl,
        difficulty: "Advanced",
        shortDescription: "Building a high-margin services agency that employs ethical profit sharing and fair billing.",
        thumbnailUrl: `https://img.youtube.com/vi/${parsedVideoId}/hqdefault.jpg`,
        islamicInsights: "Fulfill your covenants, pay employees before their sweat dries, and share profits.",
        businessApplication: "Create service subscription models (Ijarah) for ongoing content maintenance.",
        incomeOpportunity: "Scale your agency to $5k+/month delivering localized bespoke AI integrations."
      }
    ];

    return {
      courseTitle: courseName || "ChatGPT Course Mastery",
      topics: fallbackTopics
    };
  },

  async evaluateBusiness(businessIdea: string): Promise<BusinessEvaluationResponse> {
    return {
      businessIdea: businessIdea,
      ethicalScore: 78,
      verdict: "Conditionally Aligned (Offline Fallback)",
      redFlags: [
        "Ensure no interest-bearing debt (Riba) is used in initial funding or server hosting.",
        "Avoid multi-level marketing structures which often contain excessive ambiguity (Gharar)."
      ],
      recommendedStructures: [
        "Mudarabah (Equity partnership with silent investors)",
        "Ijarah (Service-leasing for SaaS subscriptions)"
      ],
      improvementPlan: "Establish transparent service-level agreements, charge clear fixed pricing, and invest 2.5% of net profits (Zakat) directly into local community welfare.",
      quranHadithReference: "The Prophet (PBUH) said: 'The two parties of a transaction have the option to cancel as long as they have not separated. If they are honest and disclose defects, they will be blessed in their transaction...' (Bukhari).",
      disclaimer: "This tool provides educational guidance based on authentic Islamic business ethics. It does not issue religious rulings. Consult a qualified scholar for specific rulings."
    };
  }
};

// --- MULTI-PROVIDER AI SWITCHER ---
export const aiProvider = {
  async generateMentor(skill: string, level: string, goal: string): Promise<MentorResponse> {
    if (aiClient) {
      try {
        console.log("Legacy of Auf AI: Using Gemini Provider (generateMentor)");
        return await geminiProvider.generateMentor(skill, level, goal);
      } catch (err) {
        console.warn("Legacy of Auf AI: Gemini Provider failed, falling back to mock provider.", err);
      }
    }
    console.log("Legacy of Auf AI: Using Mock/Fallback Provider (generateMentor)");
    return await fallbackProvider.generateMentor(skill, level, goal);
  },

  async generatePlaylist(playlistUrl: string, skillName: string, courseName: string): Promise<PlaylistResponse> {
    if (aiClient) {
      try {
        console.log("Legacy of Auf AI: Using Gemini Provider (generatePlaylist)");
        return await geminiProvider.generatePlaylist(playlistUrl, skillName, courseName);
      } catch (err) {
        console.warn("Legacy of Auf AI: Gemini Provider failed, falling back to mock provider.", err);
      }
    }
    console.log("Legacy of Auf AI: Using Mock/Fallback Provider (generatePlaylist)");
    return await fallbackProvider.generatePlaylist(playlistUrl, skillName, courseName);
  },

  async generateCourseFromVideo(videoUrl: string, skillName: string, courseName: string): Promise<PlaylistResponse> {
    if (aiClient) {
      try {
        console.log("Legacy of Auf AI: Using Gemini Provider (generateCourseFromVideo)");
        return await geminiProvider.generateCourseFromVideo(videoUrl, skillName, courseName);
      } catch (err) {
        console.warn("Legacy of Auf AI: Gemini Provider failed, falling back to mock provider.", err);
      }
    }
    console.log("Legacy of Auf AI: Using Mock/Fallback Provider (generateCourseFromVideo)");
    return await fallbackProvider.generateCourseFromVideo(videoUrl, skillName, courseName);
  },

  async evaluateBusiness(businessIdea: string): Promise<BusinessEvaluationResponse> {
    if (aiClient) {
      try {
        console.log("Legacy of Auf AI: Using Gemini Provider (evaluateBusiness)");
        return await geminiProvider.evaluateBusiness(businessIdea);
      } catch (err) {
        console.warn("Legacy of Auf AI: Gemini Provider failed, falling back to mock provider.", err);
      }
    }
    console.log("Legacy of Auf AI: Using Mock/Fallback Provider (evaluateBusiness)");
    return await fallbackProvider.evaluateBusiness(businessIdea);
  }
};
