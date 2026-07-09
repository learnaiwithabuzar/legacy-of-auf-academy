import { Skill, LearningPath, Project, BlogArticle, BusinessChallenge } from "./types";

export const SKILLS_DATA: Skill[] = [
  {
    id: "ai-automation",
    title: "AI & Automation",
    description: "Leverage cutting-edge generative AI and workflow automation to run highly efficient, modern businesses.",
    iconName: "Cpu",
    topics: [
      {
        id: "ai-1",
        title: "Introduction to AI-Powered Entrepreneurship",
        duration: "15 mins",
        videoUrl: "",
        difficulty: "Beginner"
      },
      {
        id: "ai-2",
        title: "Automating Lead Generation with LLMs",
        duration: "22 mins",
        videoUrl: "",
        difficulty: "Intermediate"
      },
      {
        id: "ai-3",
        title: "Building Custom AI Agents for Customer Support",
        duration: "30 mins",
        videoUrl: "",
        difficulty: "Advanced"
      }
    ]
  },
  {
    id: "digital-marketing",
    title: "Digital Marketing",
    description: "Master modern, organic growth channels with ethical, honest persuasion techniques that build lasting trust.",
    iconName: "TrendingUp",
    topics: [
      {
        id: "dm-1",
        title: "Ethical Persuasion & Halal Marketing Principles",
        duration: "18 mins",
        videoUrl: "",
        difficulty: "Beginner"
      },
      {
        id: "dm-2",
        title: "Organic SEO & Brand Storytelling",
        duration: "25 mins",
        videoUrl: "",
        difficulty: "Intermediate"
      },
      {
        id: "dm-3",
        title: "Scaling Ads Without Exploitative Mind-Games",
        duration: "20 mins",
        videoUrl: "",
        difficulty: "Advanced"
      }
    ]
  },
  {
    id: "e-commerce",
    title: "E-commerce",
    description: "Launch global, physical, or digital product stores anchored on transparent supply chains and fair value.",
    iconName: "ShoppingBag",
    topics: [
      {
        id: "eco-1",
        title: "Sourcing Halal, Ethical & Fair-Trade Products",
        duration: "12 mins",
        videoUrl: "",
        difficulty: "Beginner"
      },
      {
        id: "eco-2",
        title: "Building a High-Converting Luxury Shopify Store",
        duration: "28 mins",
        videoUrl: "",
        difficulty: "Intermediate"
      },
      {
        id: "eco-3",
        title: "Supply Chain Transparency & Eco-Logistics",
        duration: "24 mins",
        videoUrl: "",
        difficulty: "Advanced"
      }
    ]
  },
  {
    id: "copywriting",
    title: "Copywriting",
    description: "Connect deeply through high-impact, truthful messaging. Learn to drive massive action without deceptive hooks.",
    iconName: "PenTool",
    topics: [
      {
        id: "copy-1",
        title: "The Psychology of Truthful, Honest Copy",
        duration: "14 mins",
        videoUrl: "",
        difficulty: "Beginner"
      },
      {
        id: "copy-2",
        title: "Writing High-Converting Landing Pages",
        duration: "20 mins",
        videoUrl: "",
        difficulty: "Intermediate"
      },
      {
        id: "copy-3",
        title: "Brand Voice Frameworks for Luxury Niches",
        duration: "18 mins",
        videoUrl: "",
        difficulty: "Advanced"
      }
    ]
  },
  {
    id: "finance-investing",
    title: "Personal Finance & Islamic Investing",
    description: "Build robust compound wealth through inflation-shielding, non-exploitative, riba-free investments.",
    iconName: "Coins",
    topics: [
      {
        id: "fin-1",
        title: "Riba-Free Capital Accumulation Strategies",
        duration: "16 mins",
        videoUrl: "",
        difficulty: "Beginner"
      },
      {
        id: "fin-2",
        title: "Analyzing Halal Stocks & Sukuks",
        duration: "24 mins",
        videoUrl: "",
        difficulty: "Intermediate"
      },
      {
        id: "fin-3",
        title: "Zakat Calculations for Tech and High-Growth Startups",
        duration: "22 mins",
        videoUrl: "",
        difficulty: "Advanced"
      }
    ]
  },
  {
    id: "public-speaking",
    title: "Public Speaking",
    description: "Shatter stage-fright and pitch with royal clarity. Command rooms with authentic sincerity.",
    iconName: "Volume2",
    topics: [
      {
        id: "ps-1",
        title: "Authentic Expression & Shattering Stage Fear",
        duration: "15 mins",
        videoUrl: "",
        difficulty: "Beginner"
      },
      {
        id: "ps-2",
        title: "The Golden Pitch Deck: Presenting to Investors",
        duration: "19 mins",
        videoUrl: "",
        difficulty: "Intermediate"
      },
      {
        id: "ps-3",
        title: "Storytelling Architecture for Visionary Founders",
        duration: "21 mins",
        videoUrl: "",
        difficulty: "Advanced"
      }
    ]
  },
  {
    id: "leadership",
    title: "Leadership",
    description: "Lead through active service (Khidmah) and absolute trust (Amanah) modeled after noble traditions.",
    iconName: "ShieldAlert",
    topics: [
      {
        id: "lead-1",
        title: "Servant Leadership: The Example of Abdur Rahman ibn Awf",
        duration: "20 mins",
        videoUrl: "",
        difficulty: "Beginner"
      },
      {
        id: "lead-2",
        title: "Negotiation, Trust, and Building Fair Business Alliances",
        duration: "25 mins",
        videoUrl: "",
        difficulty: "Intermediate"
      },
      {
        id: "lead-3",
        title: "Fostering High-performance, Shura-Driven Teams",
        duration: "22 mins",
        videoUrl: "",
        difficulty: "Advanced"
      }
    ]
  },
  {
    id: "freelancing",
    title: "Freelancing",
    description: "Launch client-services on your own terms. Bridge the gap from solopreneur to thriving digital agency.",
    iconName: "Briefcase",
    topics: [
      {
        id: "free-1",
        title: "Securing Your First Three High-Value Clients Online",
        duration: "15 mins",
        videoUrl: "",
        difficulty: "Beginner"
      },
      {
        id: "free-2",
        title: "Value-Based Pricing & Dynamic Client Agreements",
        duration: "22 mins",
        videoUrl: "",
        difficulty: "Intermediate"
      },
      {
        id: "free-3",
        title: "Systemizing Tasks: Scaling from Freelancer to Agency",
        duration: "26 mins",
        videoUrl: "",
        difficulty: "Advanced"
      }
    ]
  }
];

export const LEARNING_PATHS_DATA: LearningPath[] = [
  {
    id: "path-1",
    title: "The Ethical AI Solopreneur",
    description: "Perfect for builders who want to configure automated, low-overhead operations backed by artificial intelligence.",
    level: "All Levels",
    duration: "4 Weeks",
    modulesCount: 4,
    steps: [
      "AI & Automation Foundation",
      "Crafting Persuasive, Honest Offers with Copywriting",
      "Client Acquisition & Freelancing Systems",
      "Riba-Free Growth & Financial Stability"
    ]
  },
  {
    id: "path-2",
    title: "The Noble High-Growth Founder",
    description: "For leaders aiming to create impactful teams, raise clean capital, and command international presence.",
    level: "Intermediate to Advanced",
    duration: "8 Weeks",
    modulesCount: 6,
    steps: [
      "Prophetic Business Philosophy & Servant Leadership",
      "Building the Brand Story & Ethical Scaling Ads",
      "Sovereign Supply Chains & E-commerce Architecture",
      "High-Stakes Public Speaking & Investor Pitching"
    ]
  },
  {
    id: "path-3",
    title: "Sovereign Wealth & Investing Masterclass",
    description: "A specialized blueprint focusing entirely on ethical capital stewardship, high-growth investing, and community-enriching asset pools.",
    level: "Advanced",
    duration: "3 Weeks",
    modulesCount: 3,
    steps: [
      "Foundations of Shariah-Compliant Investments",
      "Zakat Optimization and Equity Structuring",
      "Building Generational Waqf & Philanthropic Legacies"
    ]
  }
];

export const PROJECTS_DATA: Project[] = [
  {
    id: "proj-1",
    studentName: "Faris Al-Kamil",
    businessName: "Kamil Automation Solutions",
    industry: "AI Consultancy",
    revenueGenerated: "$14,500/mo",
    achievement: "Automated standard back-office tasks for 8 local businesses using moral LLM workflows, scale-operating with zero interest debt.",
    quote: "Legacy of Auf Academy gave me the blueprint to structure my service agreements cleanly and speak directly to enterprise trust.",
    avatarUrl: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150"
  },
  {
    id: "proj-2",
    studentName: "Amina Yusuf",
    businessName: "Sovereign Modest Threads",
    industry: "E-Commerce",
    revenueGenerated: "$32,000/mo",
    achievement: "Launched a fully transparent, organic clothing line that sources from family-run fair trade weavers in Egypt.",
    quote: "Understanding supply chain ethics as a central religious duty turned my brand into a powerful, loyal client community.",
    avatarUrl: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150"
  },
  {
    id: "proj-3",
    studentName: "Bilal Rahman",
    businessName: "Shura Digital Design",
    industry: "Creative Agency",
    revenueGenerated: "$18,200/mo",
    achievement: "Scaled a copywriting and UI design firm, hiring talent in emerging regions and paying premium fair living wages.",
    quote: "Hazrat Abdur Rahman ibn Awf's philosophy of 'leaving money on the table for partners' transformed how I write client proposals.",
    avatarUrl: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=150"
  }
];

export const BLOG_DATA: BlogArticle[] = [
  {
    id: "blog-1",
    title: "Abdur Rahman ibn Awf (RA): The King of Market Entry",
    category: "Ethical Philosophy",
    date: "July 2026",
    readTime: "6 min read",
    excerpt: "Discover the commercial genius of a visionary Companion who started at the Medina marketplace with nothing and became its greatest pioneer.",
    content: `
When Hazrat Abdur Rahman ibn Awf (RA) migrated to Medina, he arrived with absolutely zero capital. His helper companion (Ansar) offered to split his massive estate and wealth in half with him. 

But Abdur Rahman ibn Awf (RA) declined politely, making a famous request: **"Just show me the way to the marketplace."**

Within days, he bought and sold cheese and butter at small, honest profit margins. Soon, he noticed a critical bottleneck in the camel-trading sector and pioneered a new, high-volume business model. Instead of charging exorbitant prices on camels, he sold the camels at cost and kept the leather halter (rope) as a small, high-turnover profit stream.

### 3 Key Principles we can implement today:
1. **Low Friction Entry**: Avoid waiting for massive capital or high-interest loans. Start immediately with active, small, high-speed cash-flow loops.
2. **Value over Exploitation**: Never charge predatory interest or use artificial scarcity. High-integrity volume wins in the long-term.
3. **Generative Partnerships**: Ensure everyone wins in your ecosystem. When your partners thrive, your network scales organically.
`,
    author: "Ustadh Salim Al-Hassan"
  },
  {
    id: "blog-2",
    title: "The Halal Ad Framework: Persuading Without Deceiving",
    category: "Digital Marketing",
    date: "June 2026",
    readTime: "5 min read",
    excerpt: "How to craft highly effective digital ad copy and landing pages while honoring strict Islamic boundaries on truthfulness (Siddiq).",
    content: `
In mainstream marketing, scarcity psychological hacks (e.g., 'Only 2 spots left' when hundreds exist) and extreme fear-induction are standard. But Islamic business jurisprudence explicitly demands absolute clarity and truthfulness.

Does ethical marketing convert? **Yes.** High-integrity copy generates higher brand loyalty and avoids chargebacks.

### The Honest Landing Page Structure:
- **The Clear Promise**: Clearly describe exactly what the client receives. No bloated hype or false guarantees.
- **True Proof**: Use real customer transformations, unfiltered results, and genuine metrics.
- **Transparent Pricing**: No hidden recurring bills or unannounced extra fees. 
- **Voluntary Agreements (Taradin)**: Give buyers absolute comfort and clarity, honoring refunds with joy.
`,
    author: "Amina Yusuf"
  },
  {
    id: "blog-3",
    title: "Zakat on SaaS and Service Agencies: A Modern Guide",
    category: "Personal Finance",
    date: "May 2026",
    readTime: "8 min read",
    excerpt: "Calculating Zakat for tech companies and modern service agencies can be complex. We break down the exact assets to evaluate.",
    content: `
Many modern digital entrepreneurs are unsure how to calculate Zakat on their tech startups or agency reserves. 

Unlike traditional merchants with shelves of inventory, a software company's value lies in intellectual property, servers, and ongoing subscriptions.

### Critical Rules for Digital Assets:
1. **Cash & Liquid Assets**: All bank accounts, corporate reserves, and invoice payments due are fully subject to Zakat (2.5%) once the Nisab is met.
2. **Valuation of IP (Intellectual Property)**: Intellectual property itself is generally not subject to Zakat unless it is actively listed for outright acquisition/sale.
3. **Ongoing Subscriptions (SaaS)**: Recurring payments received become part of your active cash-flow reserves and are evaluated when your annual Zakat calculation day arrives.
`,
    author: "Dr. Tariq Al-Munajjed"
  }
];

export const CHALLENGES_DATA: BusinessChallenge[] = [
  {
    id: "chal-1",
    title: "The Zero-Capital Marketplace Challenge",
    description: "Launch a physical or digital product/service within 7 days using strictly organic traffic and zero dollar investment, following Abdur Rahman ibn Awf's Market entry strategy.",
    reward: "Mastery Badge + Mentorship Call Voucher",
    timeRemaining: "Ends Sunday",
    difficulty: "Medium"
  },
  {
    id: "chal-2",
    title: "The Shura-Driven Operations Sprint",
    description: "Build an AI-powered lead-generation assistant that is 100% compliant with fair-pricing standards and transparently present your workflow to the Academy community board.",
    reward: "Premium AI Template Suite + Live Pitch Slot",
    timeRemaining: "4 Days left",
    difficulty: "Hard"
  }
];
