import { PROJECTS_DATA } from "../data";
import { Quote, Landmark, CheckCircle, TrendingUp } from "lucide-react";

export default function Projects() {
  return (
    <section className="relative px-4 py-20 bg-gradient-to-b from-black to-neutral-950 sm:px-6 lg:px-8 border-b border-gold/10">
      <div className="mx-auto max-w-7xl">
        
        {/* Section Heading */}
        <div className="text-center max-w-3xl mx-auto mb-16">
          <span className="font-mono text-xs uppercase tracking-widest text-gold block mb-2">Student Showcases</span>
          <h2 className="font-serif text-3xl font-bold text-white sm:text-4xl tracking-wide text-glow-gold">
            Venture Success Showcases
          </h2>
          <p className="mt-4 font-sans text-sm text-neutral-400">
            Real ventures, real automated agencies, and transparent brands built by our alumni using standard, non-borrowed assets and pure ethical diligence.
          </p>
          <div className="mt-4 flex justify-center items-center gap-2">
            <span className="h-[1px] w-12 bg-gold/40" />
            <span className="text-gold text-sm">✦</span>
            <span className="h-[1px] w-12 bg-gold/40" />
          </div>
        </div>

        {/* Testimonials Grid */}
        <div className="grid grid-cols-1 gap-8 md:grid-cols-2 lg:grid-cols-3">
          {PROJECTS_DATA.map((project) => (
            <div
              id={`student-project-card-${project.id}`}
              key={project.id}
              className="flex flex-col justify-between overflow-hidden rounded-2xl border border-gold/15 bg-black p-6 relative transition-all duration-300 hover:border-gold/40 hover:shadow-[0_0_25px_rgba(212,175,55,0.08)] group"
            >
              
              {/* Giant quote mark watermark */}
              <div className="absolute right-6 top-6 text-gold/5 pointer-events-none group-hover:text-gold/10 transition-colors">
                <Quote className="h-20 w-20" />
              </div>

              <div>
                {/* Venture Metrics Header */}
                <div className="flex items-center justify-between border-b border-gold/10 pb-4 mb-4">
                  <div>
                    <span className="font-serif text-sm font-bold text-white block group-hover:text-gold transition-colors">
                      {project.businessName}
                    </span>
                    <span className="font-mono text-[9px] uppercase tracking-wider text-gold-light/60 block">
                      {project.industry}
                    </span>
                  </div>
                  
                  {project.revenueGenerated && (
                    <div className="rounded bg-emerald-accent/15 border border-gold/25 px-2.5 py-1 text-center">
                      <span className="block font-mono text-[8px] uppercase text-gold-light/80">Monthly Revenue</span>
                      <span className="block font-sans text-xs font-bold text-gold">{project.revenueGenerated}</span>
                    </div>
                  )}
                </div>

                {/* Success Achievement */}
                <p className="font-sans text-xs text-neutral-300 leading-relaxed mb-6">
                  <CheckCircle className="inline-block h-3.5 w-3.5 text-gold mr-1.5 -mt-0.5" />
                  <strong>Achievement:</strong> {project.achievement}
                </p>

                {/* Personal Student Quote */}
                <div className="relative rounded-lg bg-neutral-950/60 p-4 border border-gold/10">
                  <p className="font-sans text-xs italic text-neutral-400 leading-relaxed">
                    "{project.quote}"
                  </p>
                </div>
              </div>

              {/* Student Bio Footer */}
              <div className="mt-6 pt-4 border-t border-gold/10 flex items-center gap-3">
                <img
                  id={`student-avatar-${project.id}`}
                  referrerPolicy="no-referrer"
                  src={project.avatarUrl}
                  alt={project.studentName}
                  className="h-10 w-10 rounded-full border border-gold/25 object-cover grayscale group-hover:grayscale-0 transition-all duration-300"
                />
                <div>
                  <span className="block font-serif text-xs font-bold text-white">
                    {project.studentName}
                  </span>
                  <span className="block font-mono text-[9px] uppercase text-neutral-500">
                    Legacy Alumni
                  </span>
                </div>
              </div>

            </div>
          ))}
        </div>

        {/* Dynamic callout banner */}
        <div className="mt-16 rounded-xl border border-gold/15 bg-gradient-to-r from-emerald-deep/20 via-black to-emerald-deep/20 p-8 text-center glass-panel">
          <h4 className="font-serif text-lg font-bold text-white tracking-wide">
            Want to build your own sovereign cash-flow enterprise?
          </h4>
          <p className="mt-2 mx-auto max-w-xl font-sans text-xs text-neutral-400 leading-relaxed">
            All students are paired with high-performance peers to complete the final Capstone Launch Sprint, turning coursework into direct, independent commercial assets.
          </p>
        </div>

      </div>
    </section>
  );
}
