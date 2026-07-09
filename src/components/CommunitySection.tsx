import React, { useState } from "react";
import { CHALLENGES_DATA } from "../data";
import { MessageSquare, Instagram, Facebook, Mail, Sparkles, Zap, Award, Share2, Copy, Check, Bell } from "lucide-react";

export default function CommunitySection() {
  const [email, setEmail] = useState("");
  const [isSubscribed, setIsSubscribed] = useState(false);
  const [copiedLink, setCopiedLink] = useState(false);

  const handleSubscribe = (e: React.FormEvent) => {
    e.preventDefault();
    if (!email.trim() || !email.includes("@")) return;
    setIsSubscribed(true);
    setTimeout(() => {
      setEmail("");
    }, 3000);
  };

  const handleShare = () => {
    const shareData = {
      title: "Legacy of Auf Academy",
      text: "Build Skills. Build Business. Build Legacy.",
      url: window.location.href,
    };
    if (navigator.share) {
      navigator.share(shareData).catch(console.error);
    } else {
      navigator.clipboard.writeText(window.location.href);
      setCopiedLink(true);
      setTimeout(() => setCopiedLink(false), 2000);
    }
  };

  const socialPlatforms = [
    {
      id: "whatsapp",
      title: "Join Our WhatsApp Channel",
      desc: "Receive daily business lessons, AI skills, entrepreneurship roadmaps, Islamic business ethics, startup opportunities, free resources, and community discussions.",
      btnText: "Join WhatsApp",
      url: "https://whatsapp.com/channel/0029VbDX7cP1XquYD9GOl72d",
      icon: MessageSquare,
      colorClass: "hover:shadow-[0_0_20px_rgba(37,211,102,0.25)] hover:border-[#25D366]/40",
      btnClass: "bg-[#25D366] hover:bg-[#25D366]/90 text-black",
    },
    {
      id: "instagram",
      title: "Follow Legacy of Auf",
      desc: "Watch premium reels about business, AI, entrepreneurship, leadership, Islamic business ethics, productivity, and wealth creation.",
      btnText: "Follow Instagram",
      url: "https://www.instagram.com/lagecyofauf?igsh=dDc5NHg4Z2V3Nnk2",
      icon: Instagram,
      colorClass: "hover:shadow-[0_0_20px_rgba(225,48,108,0.25)] hover:border-[#E1306C]/40",
      btnClass: "bg-gradient-to-r from-[#833AB4] via-[#FD1D1D] to-[#F56040] hover:opacity-90 text-white",
    },
    {
      id: "facebook",
      title: "Join Our Facebook Community",
      desc: "Read articles, success stories, startup discussions, live sessions, business insights, and educational updates.",
      btnText: "Follow Facebook",
      url: "https://www.facebook.com/profile.php?id=61576440355188",
      icon: Facebook,
      colorClass: "hover:shadow-[0_0_20px_rgba(24,119,242,0.25)] hover:border-[#1877F2]/40",
      btnClass: "bg-[#1877F2] hover:bg-[#1877F2]/90 text-white",
    }
  ];

  return (
    <section className="relative px-4 py-20 bg-gradient-to-b from-neutral-950 to-black sm:px-6 lg:px-8 border-b border-gold/10">
      <div className="mx-auto max-w-7xl">
        
        {/* Section Heading */}
        <div className="text-center max-w-3xl mx-auto mb-16">
          <span className="font-mono text-xs uppercase tracking-widest text-gold block mb-2">Our Channels</span>
          <h2 className="font-serif text-3xl font-bold text-white sm:text-4xl tracking-wide text-glow-gold">
            Join Our Global Community
          </h2>
          <p className="mt-4 font-sans text-sm text-neutral-400">
            Gain immediate access to premium daily insights, discussions, live streams, and collaborate directly with fellow high-integrity pioneers.
          </p>
          <div className="mt-4 flex justify-center items-center gap-2">
            <span className="h-[1px] w-12 bg-gold/40" />
            <span className="text-gold text-sm">✦</span>
            <span className="h-[1px] w-12 bg-gold/40" />
          </div>
        </div>

        {/* Major Grid: Socials & Extras */}
        <div className="grid grid-cols-1 gap-10 lg:grid-cols-12">
          
          {/* Left Column: Social channels (8 cols) */}
          <div className="lg:col-span-8 space-y-6">
            <h3 className="font-serif text-lg font-bold text-white tracking-wider flex items-center gap-2 mb-4">
              <Sparkles className="h-4 w-4 text-gold" />
              <span>Official Community Platforms</span>
            </h3>

            <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
              {socialPlatforms.map((platform) => {
                const Icon = platform.icon;
                return (
                  <div
                    id={`community-card-${platform.id}`}
                    key={platform.id}
                    className={`flex flex-col justify-between rounded-xl border border-gold/15 bg-black/80 p-5 transition-all duration-300 ${platform.colorClass} group`}
                  >
                    <div>
                      <div className="mb-4 flex h-10 w-10 items-center justify-center rounded-lg border border-gold/20 bg-emerald-deep/20 text-gold group-hover:bg-gold group-hover:text-black transition-all">
                        <Icon className="h-5 w-5" />
                      </div>
                      <h4 className="font-serif text-sm font-bold text-white mb-2 leading-snug">
                        {platform.title}
                      </h4>
                      <p className="font-sans text-[11px] text-neutral-400 leading-relaxed mb-6">
                        {platform.desc}
                      </p>
                    </div>

                    <a
                      id={`join-link-${platform.id}`}
                      href={platform.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className={`inline-flex items-center justify-center gap-1.5 rounded py-2 text-xs font-semibold uppercase tracking-wider transition-all duration-300 ${platform.btnClass}`}
                    >
                      <span>{platform.btnText}</span>
                    </a>
                  </div>
                );
              })}
            </div>

            {/* Newsletter Subscription and Share Box */}
            <div className="grid grid-cols-1 gap-6 md:grid-cols-2 mt-8">
              
              {/* Box 1: Newsletter */}
              <div className="rounded-xl border border-gold/15 bg-neutral-950 p-6 glass-panel flex flex-col justify-between">
                <div>
                  <h4 className="font-serif text-sm font-bold text-white flex items-center gap-1.5 mb-2">
                    <Mail className="h-4 w-4 text-gold" />
                    <span>Weekly Newsletter</span>
                  </h4>
                  <p className="font-sans text-[11px] text-neutral-400 leading-relaxed mb-4">
                    Sign up to receive our high-integrity business digests and automated templates directly in your inbox.
                  </p>
                </div>

                {isSubscribed ? (
                  <div className="rounded border border-gold/20 bg-emerald-deep/20 p-3 text-center animate-fade-in">
                    <span className="font-mono text-xs text-gold font-bold">✓ Subscribed with Honor</span>
                  </div>
                ) : (
                  <form onSubmit={handleSubscribe} className="flex gap-2">
                    <input
                      id="newsletter-email-input"
                      type="email"
                      required
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      placeholder="Your elite email..."
                      className="w-full rounded border border-gold/20 bg-black px-3 py-2 font-sans text-xs text-white focus:border-gold focus:outline-none"
                    />
                    <button
                      id="newsletter-submit-btn"
                      type="submit"
                      className="rounded bg-gold px-4 py-2 text-xs font-mono font-bold text-black hover:bg-gold-light active:scale-95 transition-all"
                    >
                      Subscribe
                    </button>
                  </form>
                )}
              </div>

              {/* Box 2: Share & Invite */}
              <div className="rounded-xl border border-gold/15 bg-neutral-950 p-6 glass-panel flex flex-col justify-between">
                <div>
                  <h4 className="font-serif text-sm font-bold text-white flex items-center gap-1.5 mb-2">
                    <Share2 className="h-4 w-4 text-gold" />
                    <span>Share the Legacy</span>
                  </h4>
                  <p className="font-sans text-[11px] text-neutral-400 leading-relaxed mb-4">
                    Propagate noble business knowledge. Invite your colleagues and partners to explore the school's resources.
                  </p>
                </div>

                <div className="flex gap-2">
                  <button
                    id="share-api-btn"
                    onClick={handleShare}
                    className="flex-1 inline-flex items-center justify-center gap-1.5 rounded border border-gold/30 bg-black/60 py-2.5 text-xs font-bold text-gold hover:bg-gold hover:text-black transition-all"
                  >
                    <Share2 className="h-3.5 w-3.5" />
                    <span>Share Website</span>
                  </button>

                  <button
                    id="copy-link-btn"
                    onClick={() => {
                      navigator.clipboard.writeText(window.location.href);
                      setCopiedLink(true);
                      setTimeout(() => setCopiedLink(false), 2000);
                    }}
                    className="rounded border border-gold/20 bg-neutral-900 p-2 text-gold hover:bg-gold hover:text-black transition-all"
                    title="Copy Link to Clipboard"
                  >
                    {copiedLink ? <Check className="h-4.5 w-4.5 text-emerald-400" /> : <Copy className="h-4.5 w-4.5" />}
                  </button>
                </div>
              </div>

            </div>
          </div>

          {/* Right Column: Challenges, Teasers, Mentorship, Live Session (4 cols) */}
          <div className="lg:col-span-4 space-y-6">
            
            {/* Live Sessions Teaser */}
            <div className="rounded-xl border border-gold/15 bg-neutral-950 p-5 relative overflow-hidden group shadow-[0_0_20px_rgba(212,175,55,0.02)]">
              {/* Badge */}
              <span className="absolute top-4 right-4 inline-flex items-center gap-1 rounded bg-gold/10 px-2 py-0.5 text-[8px] font-mono uppercase tracking-widest text-gold animate-pulse">
                ● Coming Soon
              </span>

              <h4 className="font-serif text-sm font-bold text-white flex items-center gap-1.5 mb-3">
                <Bell className="h-4 w-4 text-gold" />
                <span>Live Interactive Q&A</span>
              </h4>
              <p className="font-sans text-[11px] text-neutral-400 leading-relaxed">
                Connect live with Ustadh Salim Al-Hassan to discuss Shariah-compliant startup financing and AI automation strategies.
              </p>
              
              <div className="mt-4 rounded bg-black/40 p-3 border border-gold/10">
                <span className="block font-mono text-[9px] uppercase tracking-wider text-neutral-500">Scheduled Date</span>
                <span className="block font-sans text-xs font-bold text-gold-light">To Be Announced (In Channel)</span>
              </div>
            </div>

            {/* Weekly Business Challenges */}
            <div className="rounded-xl border border-gold/20 bg-emerald-deep/5 p-5 space-y-4">
              <h4 className="font-serif text-sm font-bold text-white flex items-center gap-1.5">
                <Zap className="h-4 w-4 text-gold" />
                <span>Weekly Business Sprint</span>
              </h4>

              <div className="space-y-3">
                {CHALLENGES_DATA.map((chal) => (
                  <div
                    id={`challenge-box-${chal.id}`}
                    key={chal.id}
                    className="rounded border border-gold/15 bg-black p-3.5 space-y-2 hover:border-gold/35 transition-all"
                  >
                    <div className="flex items-center justify-between">
                      <span className="inline-flex items-center rounded bg-gold/10 px-1.5 py-0.5 text-[8px] font-mono uppercase text-gold">
                        {chal.difficulty} Mode
                      </span>
                      <span className="font-mono text-[9px] text-rose-400">{chal.timeRemaining}</span>
                    </div>

                    <h5 className="font-serif text-xs font-bold text-gold-light">{chal.title}</h5>
                    <p className="font-sans text-[10px] text-neutral-400 leading-relaxed">{chal.description}</p>
                    
                    <div className="border-t border-gold/5 pt-2 flex items-center justify-between">
                      <span className="font-sans text-[9px] text-neutral-400">🎁 {chal.reward}</span>
                      <span className="font-mono text-[8px] text-gold uppercase tracking-widest">Active</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Mentorship Program Teaser */}
            <div className="rounded-xl border border-gold/15 bg-black p-5 flex flex-col justify-between">
              <div>
                <h4 className="font-serif text-sm font-bold text-white flex items-center gap-1.5 mb-2">
                  <Award className="h-4 w-4 text-gold" />
                  <span>Elite 1-on-1 Mentorship</span>
                </h4>
                <p className="font-sans text-[11px] text-neutral-400 leading-relaxed mb-4">
                  For top-performing students. Win a direct audit of your supply chain or automation workflow with senior ethical consultants.
                </p>
              </div>

              <div className="rounded border border-gold/10 bg-neutral-950 p-2.5 text-center">
                <span className="font-mono text-[9px] uppercase tracking-wider text-neutral-400">Requires 3 Capstone Points</span>
              </div>
            </div>

          </div>

        </div>

      </div>
    </section>
  );
}
