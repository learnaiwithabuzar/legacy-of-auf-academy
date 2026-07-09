import { Landmark, CheckCircle2, ShieldCheck, HelpCircle } from "lucide-react";

export default function About() {
  const values = [
    {
      title: "Siddiq (Absolute Truth)",
      desc: "Honest copywriting, transparent pricing models, and direct supply chains. Never use false urgency or manipulative marketing traps.",
      icon: CheckCircle2,
    },
    {
      title: "Riba-Free Capital",
      desc: "Bootstrap from cash-flow or structure equity-based agreements (Musharakah/Mudarabah). Reject interest-bearing debts completely.",
      icon: ShieldCheck,
    },
    {
      title: "Khidmah & Shura",
      desc: "Act as a servant leader to your partners, clients, and employees. Build business plans with collective, consultative wisdom.",
      icon: HelpCircle,
    }
  ];

  return (
    <section className="relative overflow-hidden bg-gradient-to-b from-black to-neutral-950 px-4 py-20 sm:px-6 lg:px-8 border-b border-gold/10">
      <div className="mx-auto max-w-7xl">
        
        {/* Header decoration */}
        <div className="text-center max-w-3xl mx-auto mb-16">
          <span className="font-mono text-xs uppercase tracking-widest text-gold block mb-2">Our Foundation</span>
          <h2 className="font-serif text-3xl font-bold text-white sm:text-4xl tracking-wide text-glow-gold">
            The Philosophy of Hazrat Abdur Rahman ibn Awf (RA)
          </h2>
          <div className="mt-4 flex justify-center items-center gap-2">
            <span className="h-[1px] w-12 bg-gold/40" />
            <span className="text-gold text-sm">✦</span>
            <span className="h-[1px] w-12 bg-gold/40" />
          </div>
        </div>

        {/* Layout Grid */}
        <div className="grid grid-cols-1 items-stretch gap-12 lg:grid-cols-2">
          
          {/* Column 1: Core Mission & Bio */}
          <div className="flex flex-col justify-center space-y-6">
            <span className="font-mono text-[10px] uppercase tracking-widest text-gold bg-emerald-deep/30 border border-gold/15 px-3 py-1 rounded-full w-fit">
              Prophetic Market Blueprints
            </span>
            <h3 className="font-serif text-2xl font-bold text-gold-light tracking-wide leading-snug">
              Ethical Wealth Creation Designed for the Future
            </h3>
            <p className="font-sans text-neutral-300 leading-relaxed">
              Hazrat Abdur Rahman ibn Awf (RA) arrived in Medina with nothing but absolute trust in Allah and his strategic business intellect. When offered half of his peer's wealth, his legendary reply was: <em className="text-gold-light">"Just show me the path to the marketplace."</em>
            </p>
            <p className="font-sans text-neutral-300 leading-relaxed">
              Legacy of Auf Academy is built to translate this timeless entrepreneurial mindset into modern-day technical assets. We don't just teach you how to write code, configure AI workflows, or run digital stores — we teach you how to build sovereign, asset-rich business models that enrich families and serve communities without resorting to toxic financial practices.
            </p>
            <div className="rounded-xl border border-gold/15 bg-emerald-deep/10 p-5 glass-panel">
              <span className="font-serif text-sm font-semibold text-gold block mb-1">
                ✦ Independent Educational Initiative Disclaimer
              </span>
              <p className="font-sans text-xs text-neutral-400">
                While inspired by his legendary integrity, business agility, and philanthropy, Legacy of Auf Academy is a modern independent educational initiative and does not claim to represent his exact historical financial ledger or exact historical models.
              </p>
            </div>
          </div>

          {/* Column 2: Interactive Pillar Cards */}
          <div className="flex flex-col justify-center space-y-6">
            <div className="border border-gold/20 rounded-2xl bg-black p-8 relative overflow-hidden shadow-[0_0_30px_rgba(212,175,55,0.05)]">
              {/* Background watermark */}
              <div className="absolute right-4 bottom-4 opacity-5 pointer-events-none">
                <Landmark className="h-44 w-44 text-gold" />
              </div>
              
              <h4 className="font-serif text-lg font-bold text-white uppercase tracking-wider mb-6 border-b border-gold/20 pb-3">
                Our Three Ethical Pillars
              </h4>

              <div className="space-y-6">
                {values.map((v, i) => {
                  const Icon = v.icon;
                  return (
                    <div key={i} className="flex gap-4 group">
                      <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg border border-gold/30 bg-emerald-deep/20 text-gold transition-colors duration-300 group-hover:bg-gold group-hover:text-black">
                        <Icon className="h-5 w-5" />
                      </div>
                      <div>
                        <h5 className="font-serif text-sm font-bold text-gold-light group-hover:text-white transition-colors">
                          {v.title}
                        </h5>
                        <p className="mt-1 font-sans text-xs text-neutral-400 leading-relaxed">
                          {v.desc}
                        </p>
                      </div>
                    </div>
                  );
                })}
              </div>

            </div>
          </div>

        </div>

      </div>
    </section>
  );
}
