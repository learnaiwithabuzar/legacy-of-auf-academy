import React, { useState } from "react";
import { Scale, ShieldAlert, Book, FileText, CheckCircle2, Award, Heart, Globe, Flame } from "lucide-react";

export default function LegalCenter() {
  const [activePolicy, setActivePolicy] = useState("privacy");

  const policies = [
    {
      id: "privacy",
      title: "Privacy Policy",
      icon: FileText,
      description: "How we collect, encrypt, and secure student data in accordance with modern and ethical principles.",
      content: `✦ THE LEGACY OF AUF ACADEMY PRIVACY DOCTRINE ✦
Last Updated: July 2026

1. DATA COLLECTION & MINIMALISM
In alignment with the Islamic principle of 'Amanah' (trust) and modern regulatory standards (GDPR, CCPA), the Legacy of Auf Academy collects only the minimum personal details required to deliver Shariah-compliant entrepreneurship education. This includes your display name, email, portfolio projects, and learning history.

2. CRYPTOGRAPHIC PROTECTION & DE-IDENTIFICATION
All student profiles are protected with industrial-grade TLS 1.3 transit encryption and AES-256 storage-at-rest hashing. We do not sell, rent, or trade your personal learning goals or portfolio submissions to marketing brokers or corporate advertisers.

3. YOUR SOVEREIGN DATA RIGHTS
You retain absolute sovereign ownership of your portfolio content, note logs, and quiz results. You can request a complete JSON data export or full account erasure at any time via the Academic Backup tab on your dashboard.
`
    },
    {
      id: "terms",
      title: "Terms of Use",
      icon: Scale,
      description: "The mutual covenant of academic integrity and contract rules governing our online workspace.",
      content: `✦ ACADEMIC COVENANT & TERMS OF USE ✦
Last Updated: July 2026

1. COVENANT MUTUALITY (MUSHRAKAH)
By entering the Legacy of Auf Academy (the 'Platform'), you agree to a mutual covenant of respect, authentic study, and commitment to Shariah-compliant business ethics. You agree not to engage in speculative, deceitful, or riba-based (usurious) venture formations.

2. PORTFOLIO FAIR USE & INTELLECTUAL PROPERTY
All lessons, curriculum assets, spreadsheets, and advisor models are owned by Legacy of Auf Academy. They are licensed to you for personal educational and commercial venture prototyping. Redistribution of core video lectures or lecture assets is strictly prohibited.

3. ACCURATE REPRESENTATION
You agree to represent your quiz scores, completed topics, and verified certificates honestly on LinkedIn, resumes, and client presentations. Falsifying certificate IDs is a breach of trust and will result in immediate credential revocation.
`
    },
    {
      id: "cookies",
      title: "Cookie Policy",
      icon: Globe,
      description: "Transparent cookie tracking solely restricted to maintaining active secure session tokens.",
      content: `✦ COOKIE & LOCAL STORAGE TRANSPARENCY STATEMENT ✦
Last Updated: July 2026

1. SECURE EPHEMERAL SESSIONS
Our system uses essential cookies and Local Storage keys purely to maintain your secure authenticated session state. These include firebase auth tokens and workspace preferences (RTL layout, font size, high-contrast mode).

2. NO BEHAVIORAL PROFILING
We do not use tracking pixels, cross-site identity graphs, or advertising cookies (such as Facebook Pixel or Google Ads trackers). Your navigation of our lessons is private and unmonitored by marketing analytics.

3. PREFERENCE RETENTION
Removing cookies or clearing your browser storage will sign you out and reset your localized configurations.
`
    },
    {
      id: "community",
      title: "Community Guidelines",
      icon: Heart,
      description: "Nurturing ethical discourse, collaborative study, and professional mentorship networks.",
      content: `✦ ETHICAL COMMUNITY FELLOWSHIP CHARTER ✦
Last Updated: July 2026

1. ADAB (ETHICAL CONDUCT)
The Legacy of Auf is a sanctuary of knowledge. All discussions, forum threads, and project reviews must embody 'Adab'—profound respect, constructive feedback, and humble inquiry. Slander, aggressive debate, and prideful behavior are banned.

2. MUTUAL AID (WAQF COOPERATIVES)
Students are highly encouraged to support peers in freelancing contracts, code debugging, and halal crowdfunding campaigns. Collaborative feedback is our strongest asset.

3. PROHIBITION OF DECEITFUL PROMOTIONS
Do not spam forums with multi-level-marketing schemes, crypto token pre-sales, high-yield investment programs (HYIP), or speculative get-rich-quick offers.
`
    },
    {
      id: "disclaimer-edu",
      title: "Educational Disclaimer",
      icon: Book,
      description: "Standard disclosure clarifying that academy training does not represent guaranteed financial success.",
      content: `✦ ACADEMIC LIMITATION OF LIABILITY ✦
Last Updated: July 2026

1. ACADEMIC SCOPE ONLY
All contents, case studies, formulas, spreadsheets, and video simulations are provided for educational purposes only. Legacy of Auf Academy does not guarantee that following these guides will result in financial profit, freelance contracts, or funding.

2. ADVISORY INDEPENDENCE
Simulated advice given by the AI Advisor or career mentors represents high-probability strategic modeling, not official individual investment advice. Consult qualified local legal and financial advisors before launching physical corporations.
`
    },
    {
      id: "disclaimer-ai",
      title: "AI Disclaimer",
      icon: Flame,
      description: "Clarifying that AI-generated roadmaps and career advisory advice are helper utilities, not legal advice.",
      content: `✦ COGNITIVE AI UTILITY REVELATION ✦
Last Updated: July 2026

1. AI AGENT BOUNDARIES
Our AI Career Mentor and Islamic Shariah Advisor utilize state-of-the-art Large Language Models (Gemini). While highly tuned for Shariah business principles, AI outputs may occasionally contain errors or unaligned recommendations.

2. VERIFICATION PROTOCOL
Students are instructed to cross-verify all AI-generated contractual structures, contract templates, and strategic steps against standard classical sources (Qur'an, Bukhari, Muslim) or consult our Shariah Board members.
`
    },
    {
      id: "disclaimer-shariah",
      title: "Islamic Guidance Disclaimer",
      icon: ShieldAlert,
      description: "Distinguishing educational Shariah guidelines from formal individual religious fatwas.",
      content: `✦ SHARIAH COMPLIANCE LIMITATION ✦
Last Updated: July 2026

1. EDUCATIONAL ANALYSIS
The analysis provided by the Islamic Business Advisor and within insights represents general consensus rulings (Ijma) on ethical trade, contract mutuality, and interest-free models. It does not constitute an absolute individual 'Fatwa' (religious decree) for your personal tax or corporate situation.

2. SECTOR EVOLUTION
Shariah fintech and micro-lending laws vary significantly by global jurisdiction (such as UAE, Malaysia, UK, Saudi Arabia). Students must audit local Shariah regulatory standards.
`
    },
    {
      id: "copyright",
      title: "Copyright Policy",
      icon: FileText,
      description: "Affirming digital ownership boundaries, brand usage, and ethical academic licensing rights.",
      content: `✦ CREATIVE DIGITAL RIGHTS & COPYRIGHT CHARTER ✦
Last Updated: July 2026

1. ACADEMY RIGHTS
The curriculum, custom geometric logo, codebases, audio synthesizers, and video player templates are the exclusive intellectual assets of Legacy of Auf Academy.

2. RE-USE & CITATION RULES
You are welcome to reference paragraphs, quotes, and visual models in your blog posts or LinkedIn profiles, provided you include a direct, un-obfuscated hyperlink back to: legacyofauf.academy.
`
    },
    {
      id: "accessibility",
      title: "Accessibility Statement",
      icon: CheckCircle2,
      description: "Our compliance commitment to WCAG 2.1 AA standards for students of all physical abilities.",
      content: `✦ GLOBAL ACCESSIBILITY & WCAG AA COVENANT ✦
Last Updated: July 2026

1. OUR INTEGRATION OBJECTIVE
We believe ethical knowledge must be open to everyone, regardless of physical or cognitive ability. We actively optimize this application for Web Content Accessibility Guidelines (WCAG) 2.1 Level AA standards.

2. SYSTEM FEATURES ENHANCED
- Interactive font scale controls (Small, Normal, Large) in the toolbar.
- High-contrast, color-blind friendly layout.
- Proper ARIA attributes and focus-ring indicators for screen reader and keyboard navigation.
- Accessible forms with direct keyboard submission support.
`
    }
  ];

  const currentPolicyData = policies.find(p => p.id === activePolicy) || policies[0];

  return (
    <div id="legal-compliance-workspace" className="grid grid-cols-1 lg:grid-cols-4 gap-8 text-left">
      
      {/* 1. Policy Sidebar Menu */}
      <div className="lg:col-span-1 space-y-3">
        <div className="rounded-xl border border-gold/15 bg-neutral-950/80 p-3 shadow-md">
          <div className="px-3 py-2 border-b border-gold/10 mb-2">
            <span className="font-mono text-[9px] uppercase tracking-widest text-gold/60 font-semibold">Policy Chapters</span>
          </div>
          <nav className="space-y-1 flex flex-row lg:flex-col overflow-x-auto lg:overflow-x-visible pb-2 lg:pb-0 gap-1 lg:gap-0">
            {policies.map((pol) => {
              const Icon = pol.icon;
              const isActive = activePolicy === pol.id;
              return (
                <button
                  key={pol.id}
                  onClick={() => setActivePolicy(pol.id)}
                  className={`flex items-center gap-2.5 rounded-lg px-3.5 py-2 text-xs font-semibold tracking-wide transition-all duration-200 focus:outline-none shrink-0 ${
                    isActive
                      ? "text-gold bg-emerald-deep/30 border border-gold/15 w-auto lg:w-full"
                      : "text-neutral-400 hover:text-white hover:bg-neutral-900 w-auto lg:w-full"
                  }`}
                >
                  <Icon className="h-4 w-4 shrink-0 text-gold-light" />
                  <span>{pol.title}</span>
                </button>
              );
            })}
          </nav>
        </div>

        <div className="rounded-xl border border-gold/15 bg-neutral-950/80 p-4">
          <h4 className="font-serif text-[11px] font-bold text-gold uppercase tracking-widest mb-1.5 flex items-center gap-1">
            <Scale className="h-3.5 w-3.5" />
            <span>Islamic Jurisprudence</span>
          </h4>
          <p className="font-sans text-[10px] text-neutral-400 leading-relaxed">
            Contracts of the Academy conform to standard classical Islamic commercial law frameworks ensuring transparency, mutuality, and ethical consensus.
          </p>
        </div>
      </div>

      {/* 2. Policy Content Viewer */}
      <div className="lg:col-span-3 rounded-xl border border-gold/20 bg-neutral-950/90 p-6 md:p-8 shadow-xl shadow-gold/5 flex flex-col justify-between relative overflow-hidden">
        <div className="absolute top-0 right-0 h-48 w-48 bg-emerald-accent/5 rounded-full blur-3xl pointer-events-none" />
        
        <div className="space-y-6 relative z-10">
          <div className="border-b border-gold/15 pb-4">
            <span className="font-mono text-[9px] uppercase tracking-widest text-gold font-bold">LEGACY OF AUF COMPLIANCE BOARD</span>
            <h2 className="font-serif text-xl font-bold text-white tracking-wide mt-1">{currentPolicyData.title}</h2>
            <p className="font-sans text-xs text-neutral-400 mt-1">{currentPolicyData.description}</p>
          </div>

          <div className="font-serif text-xs md:text-sm text-neutral-300 leading-relaxed whitespace-pre-wrap max-w-3xl border border-neutral-900 p-5 rounded-lg bg-black/40">
            {currentPolicyData.content}
          </div>
        </div>

        <div className="mt-8 pt-4 border-t border-neutral-900 flex justify-between items-center text-[10px] font-mono text-neutral-500">
          <span>COVENANT COMPLIANCE REF: LOA-POL-2026</span>
          <span className="text-gold-light">Shariah-Audited OK ✦</span>
        </div>
      </div>

    </div>
  );
}
