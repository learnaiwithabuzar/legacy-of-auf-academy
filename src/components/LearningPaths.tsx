import { useCMS } from "../store/cmsStore";
import { Compass, BookOpen, Clock, BarChart } from "lucide-react";

export default function LearningPaths() {
  const { learningPaths } = useCMS();
  return (
    <section className="relative px-4 py-20 bg-gradient-to-b from-neutral-950 to-black sm:px-6 lg:px-8 border-b border-gold/10">
      <div className="mx-auto max-w-7xl">
        
        {/* Section Heading */}
        <div className="text-center max-w-3xl mx-auto mb-16">
          <span className="font-mono text-xs uppercase tracking-widest text-gold block mb-2">Academic Roadmap</span>
          <h2 className="font-serif text-3xl font-bold text-white sm:text-4xl tracking-wide text-glow-gold">
            Structured Learning Paths
          </h2>
          <p className="mt-4 font-sans text-sm text-neutral-400">
            Follow our pre-designed curriculum tracks crafted to transition you from an ethical seeker to an sovereign, asset-rich business owner.
          </p>
          <div className="mt-4 flex justify-center items-center gap-2">
            <span className="h-[1px] w-12 bg-gold/40" />
            <span className="text-gold text-sm">✦</span>
            <span className="h-[1px] w-12 bg-gold/40" />
          </div>
        </div>

        {/* Path Cards */}
        <div className="grid grid-cols-1 gap-8 lg:grid-cols-3">
          {learningPaths.map((path) => (
            <div
              id={`path-card-${path.id}`}
              key={path.id}
              className="flex flex-col justify-between overflow-hidden rounded-2xl border border-gold/15 bg-black p-6 relative transition-all duration-300 hover:border-gold/40 hover:shadow-[0_0_30px_rgba(4,106,56,0.15)] group"
            >
              {/* Islamic Star corner seal decoration */}
              <div className="absolute right-4 top-4 text-gold/15 group-hover:text-gold/35 transition-colors duration-300">
                <Compass className="h-10 w-10 stroke-[1]" />
              </div>

              <div>
                {/* Level Tag & Modules Count */}
                <div className="flex flex-wrap items-center gap-2 mb-4">
                  <span className="inline-flex items-center rounded-full bg-gold/10 px-2.5 py-0.5 text-xs font-medium text-gold">
                    {path.level}
                  </span>
                  <span className="font-mono text-[10px] uppercase text-neutral-400 flex items-center gap-1">
                    <BookOpen className="h-3 w-3" /> {path.modulesCount} Modules
                  </span>
                </div>

                {/* Path Title */}
                <h3 className="font-serif text-xl font-bold text-white tracking-wide mb-3 group-hover:text-gold transition-colors">
                  {path.title}
                </h3>

                {/* Description */}
                <p className="font-sans text-xs text-neutral-300 leading-relaxed mb-6">
                  {path.description}
                </p>

                {/* Timeline / Steps UI */}
                <div className="space-y-4 border-t border-gold/10 pt-5">
                  <h4 className="font-serif text-xs font-bold text-gold uppercase tracking-wider mb-2">
                    Milestone Path Steps
                  </h4>
                  <div className="relative pl-5 space-y-4 border-l border-gold/20">
                    {path.steps.map((step, idx) => (
                      <div key={idx} className="relative group/step">
                        {/* Dot indicator */}
                        <span className="absolute -left-[24.5px] top-1 flex h-2 w-2 items-center justify-center rounded-full bg-gold-dark border border-gold-light group-hover/step:bg-gold transition-colors" />
                        <span className="block font-mono text-[9px] uppercase tracking-wider text-neutral-500">
                          Milestone 0{idx + 1}
                        </span>
                        <span className="font-sans text-xs font-semibold text-white group-hover/step:text-gold-light transition-colors">
                          {step}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              {/* Action/Duration section */}
              <div className="mt-8 pt-4 border-t border-gold/15 flex items-center justify-between">
                <span className="font-sans text-xs text-neutral-400 flex items-center gap-1.5">
                  <Clock className="h-3.5 w-3.5 text-gold" /> {path.duration} Effort
                </span>

                <span className="inline-flex items-center gap-1 font-mono text-xs text-gold font-bold">
                  <BarChart className="h-3.5 w-3.5" /> Core Curriculum
                </span>
              </div>

            </div>
          ))}
        </div>

      </div>
    </section>
  );
}
