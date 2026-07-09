import { LogoSVG } from "./Navbar";
import { ArrowRight, Compass, Users } from "lucide-react";

interface HeroProps {
  onExplore: () => void;
  onJoinCommunity: () => void;
}

export default function Hero({ onExplore, onJoinCommunity }: HeroProps) {
  return (
    <div className="relative overflow-hidden bg-black py-20 lg:py-32 bg-islamic-pattern border-b border-gold/10">
      
      {/* Decorative Gold Geometric Ambient Lattices */}
      <div className="absolute right-0 top-0 -mr-32 -mt-32 h-96 w-96 rounded-full bg-gold/5 blur-3xl pointer-events-none" />
      <div className="absolute left-0 bottom-0 -ml-32 -mb-32 h-96 w-96 rounded-full bg-emerald-accent/5 blur-3xl pointer-events-none" />

      {/* Hero Content Container */}
      <div className="relative mx-auto max-w-5xl px-4 text-center sm:px-6 lg:px-8">
        
        {/* Animated Main Logo Accent */}
        <div className="flex justify-center mb-8">
          <div className="relative p-4 rounded-full bg-black border border-gold/25 shadow-[0_0_25px_rgba(212,175,55,0.12)]">
            <LogoSVG className="h-20 w-20 animate-spin-slow" />
            {/* Corner geometric dots */}
            <span className="absolute top-1 left-1 text-gold text-[10px]">✦</span>
            <span className="absolute top-1 right-1 text-gold text-[10px]">✦</span>
            <span className="absolute bottom-1 left-1 text-gold text-[10px]">✦</span>
            <span className="absolute bottom-1 right-1 text-gold text-[10px]">✦</span>
          </div>
        </div>

        {/* Brand Label */}
        <span className="inline-flex items-center gap-1.5 rounded-full border border-gold/25 bg-emerald-deep/25 px-4 py-1.5 text-xs font-semibold tracking-widest text-gold uppercase mb-6 shadow-[0_0_15px_rgba(4,106,56,0.2)]">
          ✦ Premium Islamic Entrepreneurship Academy ✦
        </span>

        {/* Headline */}
        <h1 className="font-serif text-4xl font-extrabold tracking-tight text-white sm:text-5xl md:text-6xl text-glow-gold leading-tight max-w-4xl mx-auto">
          Build <span className="bg-gradient-to-r from-gold via-gold-light to-gold-dark bg-clip-text text-transparent">Skills</span>. 
          {" "}Build <span className="bg-gradient-to-r from-gold via-gold-light to-gold-dark bg-clip-text text-transparent">Business</span>. 
          {" "}Build <span className="bg-gradient-to-r from-gold via-gold-light to-gold-dark bg-clip-text text-transparent">Legacy</span>.
        </h1>

        {/* Short intro paragraph */}
        <p className="mx-auto mt-6 max-w-2xl font-sans text-base text-neutral-300 leading-relaxed md:text-lg">
          Master high-demand digital workflows, AI automation, and wealth creation structures anchored completely on high-integrity, riba-free, and prophetically-inspired commercial values.
        </p>

        {/* CTA Buttons */}
        <div className="mt-10 flex flex-col justify-center gap-4 sm:flex-row">
          <button
            id="hero-explore-btn"
            onClick={onExplore}
            className="group inline-flex items-center justify-center gap-2 rounded-lg bg-gradient-to-r from-gold via-gold-light to-gold-dark px-6 py-3.5 text-sm font-semibold text-black shadow-lg shadow-gold/20 transition-all duration-300 hover:shadow-gold/30 hover:scale-[1.02] focus:outline-none"
          >
            <Compass className="h-4.5 w-4.5 group-hover:rotate-45 transition-transform" />
            <span>Explore Learning Paths</span>
            <ArrowRight className="h-4 w-4" />
          </button>

          <button
            id="hero-community-btn"
            onClick={onJoinCommunity}
            className="inline-flex items-center justify-center gap-2 rounded-lg border border-gold/35 bg-black/60 px-6 py-3.5 text-sm font-semibold text-gold transition-all duration-300 hover:bg-gold hover:text-black focus:outline-none"
          >
            <Users className="h-4.5 w-4.5" />
            <span>Join Our Community</span>
          </button>
        </div>

        {/* Floating trust statistics */}
        <div className="mt-16 grid grid-cols-2 gap-4 border-t border-gold/15 pt-10 sm:grid-cols-4 max-w-4xl mx-auto">
          <div className="text-center">
            <span className="block font-serif text-3xl font-extrabold text-gold">100%</span>
            <span className="mt-1 block font-mono text-xs uppercase tracking-wider text-neutral-400">Ethical (Riba-Free)</span>
          </div>
          <div className="text-center">
            <span className="block font-serif text-3xl font-extrabold text-gold">12+</span>
            <span className="mt-1 block font-mono text-xs uppercase tracking-wider text-neutral-400">Tactical Modules</span>
          </div>
          <div className="text-center">
            <span className="block font-serif text-3xl font-extrabold text-gold">3,500+</span>
            <span className="mt-1 block font-mono text-xs uppercase tracking-wider text-neutral-400">Global Pioneers</span>
          </div>
          <div className="text-center">
            <span className="block font-serif text-3xl font-extrabold text-gold">0%</span>
            <span className="mt-1 block font-mono text-xs uppercase tracking-wider text-neutral-400">Interest Debt</span>
          </div>
        </div>

      </div>
    </div>
  );
}
