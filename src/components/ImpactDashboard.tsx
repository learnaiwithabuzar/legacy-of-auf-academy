import React from "react";
import { Users, Globe, Briefcase, Award, TrendingUp, Landmark, Heart, Star } from "lucide-react";

export default function ImpactDashboard() {
  const metrics = [
    { label: "Global Students Trained", val: "14,820", sub: "+12% this quarter", icon: Users, color: "text-gold" },
    { label: "Sovereign Countries Reached", val: "42", sub: "Asia, Middle East, Africa, Europe", icon: Globe, color: "text-blue-400" },
    { label: "Verified Certificates Issued", val: "4,115", sub: "Shariah Board Validated", icon: Award, color: "text-purple-400" },
    { label: "Ethical Businesses Launched", val: "840", sub: "Interest-Free / Halal SaaS", icon: Briefcase, color: "text-emerald-400" },
    { label: "Freelancer Careers Catalyzed", val: "1,920", sub: "Sovereign income nodes", icon: TrendingUp, color: "text-red-400" },
    { label: "Waqf Capital Pledged", val: "$1,420,000", sub: "Endowed developmental loans", icon: Landmark, color: "text-amber-500" }
  ];

  const highlights = [
    { title: "Zero Riba Foundation", desc: "100% of our graduates commit to establishing interest-free venture terms, eliminating usurious financing from modern tech startup stacks." },
    { title: "Sovereign Waqf Pooling", desc: "Over $1.4 million of interest-free capital has been pledged to cooperative student micro-venture networks, creating self-sustaining developmental nodes." },
    { title: "Decentralized Wealth Distribution", desc: "Our Mudarabah spreadsheet tools are used globally to distribute tech profits equitably between founders, developers, and backers." }
  ];

  return (
    <div id="impact-metrics-dashboard" className="space-y-6 text-left">
      
      {/* 1. Introductory Hero Card */}
      <div className="relative overflow-hidden rounded-xl border border-gold/20 bg-gradient-to-r from-emerald-950/20 via-neutral-950 to-neutral-950 p-6 md:p-8 shadow-xl shadow-gold/5">
        <div className="absolute top-0 right-0 h-40 w-40 bg-emerald-accent/5 rounded-full blur-2xl pointer-events-none" />
        <div className="relative z-10 space-y-2">
          <span className="font-mono text-[9px] uppercase tracking-widest text-gold flex items-center gap-1.5">
            <span>✦</span> GLOBAL SHARIAH BUSINESS LEAGUE IMPACT <span>✦</span>
          </span>
          <h3 className="font-serif text-lg md:text-xl font-bold text-white tracking-wide">
            Measuring the Global Ethical Legacy
          </h3>
          <p className="font-sans text-xs text-neutral-400 max-w-2xl leading-relaxed">
            We track our success not merely in student volumes, but in the practical elimination of interest-bearing debt, the rise of collaborative profit-sharing partnerships, and real jobs created across emerging markets.
          </p>
        </div>
      </div>

      {/* 2. Public Metrics Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {metrics.map((m, idx) => {
          const Icon = m.icon;
          return (
            <div key={idx} className="rounded-xl border border-gold/15 bg-neutral-950/80 p-5 shadow-md flex items-start gap-4">
              <div className={`p-3 rounded-xl bg-black/40 border border-neutral-900 ${m.color}`}>
                <Icon className="h-6 w-6 stroke-[1.5]" />
              </div>
              <div className="space-y-1 text-left">
                <span className="block font-mono text-[9px] uppercase tracking-wider text-neutral-500">{m.label}</span>
                <span className="block font-serif text-xl md:text-2xl font-bold text-white tracking-wide">{m.val}</span>
                <span className="block text-[10px] text-neutral-400 font-sans">{m.sub}</span>
              </div>
            </div>
          );
        })}
      </div>

      {/* 3. Narrative highlights and Shariah board goals */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-2">
        
        {/* Core Pillars (6 cols) */}
        <div className="rounded-xl border border-gold/15 bg-neutral-950/80 p-5 shadow-md space-y-4">
          <h4 className="font-serif text-sm font-bold text-white flex items-center gap-1.5 border-b border-gold/10 pb-2.5">
            <Heart className="h-4 w-4 text-gold fill-gold" />
            <span>Ethical Business Transformations</span>
          </h4>

          <div className="space-y-4">
            {highlights.map((h, idx) => (
              <div key={idx} className="space-y-1">
                <h5 className="font-serif text-xs font-bold text-white flex items-center gap-2">
                  <Star className="h-3 w-3 text-gold fill-gold shrink-0" />
                  <span>{h.title}</span>
                </h5>
                <p className="font-sans text-[11px] text-neutral-400 leading-relaxed pl-5">
                  {h.desc}
                </p>
              </div>
            ))}
          </div>
        </div>

        {/* Dynamic visual representation of Cooperative Hours */}
        <div className="rounded-xl border border-gold/15 bg-neutral-950/80 p-5 shadow-md space-y-4 flex flex-col justify-between">
          <div className="space-y-2">
            <h4 className="font-serif text-sm font-bold text-white flex items-center gap-1.5 border-b border-gold/10 pb-2.5">
              <TrendingUp className="h-4.5 w-4.5 text-gold" />
              <span>Ethical Study Acceleration Curve</span>
            </h4>
            <p className="font-sans text-[11px] text-neutral-400 leading-relaxed">
              Global cumulative learning hours logged by current cohorts, reinforcing commercial competency.
            </p>
          </div>

          <div className="space-y-3.5">
            <div className="space-y-1.5">
              <div className="flex justify-between font-mono text-[10px]">
                <span className="text-neutral-400">COOPERATIVE STUDY HOURS:</span>
                <span className="text-gold font-bold">84,200 Hrs</span>
              </div>
              <div className="h-2.5 w-full bg-neutral-900 rounded-full overflow-hidden">
                <div className="h-full bg-gradient-to-r from-emerald-600 to-gold rounded-full w-[84%]" />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4 border-t border-neutral-900 pt-4 font-sans text-xs">
              <div>
                <span className="block font-mono text-[8px] uppercase text-neutral-500">Weekly average activity</span>
                <strong className="text-white">12.4 Hours per student</strong>
              </div>
              <div>
                <span className="block font-mono text-[8px] uppercase text-neutral-500">Employment success</span>
                <strong className="text-white">88% of active portfolio builders</strong>
              </div>
            </div>
          </div>
        </div>

      </div>

    </div>
  );
}
