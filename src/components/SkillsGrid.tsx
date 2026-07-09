import { useState } from "react";
import * as Icons from "lucide-react";
import { useCMS } from "../store/cmsStore";
import { Skill } from "../types";

interface SkillsGridProps {
  onWatchVideo: (videoUrl: string, topicTitle: string, topicId?: string) => void;
}

export default function SkillsGrid({ onWatchVideo }: SkillsGridProps) {
  const { skills, isTopicCompleted, toggleTopicCompletion } = useCMS();
  const [expandedSkillId, setExpandedSkillId] = useState<string | null>(null);

  const toggleExpand = (skillId: string) => {
    if (expandedSkillId === skillId) {
      setExpandedSkillId(null);
    } else {
      setExpandedSkillId(skillId);
    }
  };

  // Safe helper to render Lucide Icons dynamically
  const renderIcon = (iconName: string) => {
    const IconComponent = (Icons as any)[iconName];
    if (IconComponent) {
      return <IconComponent className="h-6 w-6 stroke-[1.5]" />;
    }
    return <Icons.BookOpen className="h-6 w-6 stroke-[1.5]" />;
  };

  return (
    <section className="relative px-4 py-20 bg-black bg-islamic-pattern border-b border-gold/10">
      <div className="mx-auto max-w-7xl">
        
        {/* Section Heading */}
        <div className="text-center max-w-3xl mx-auto mb-16">
          <span className="font-mono text-xs uppercase tracking-widest text-gold block mb-2">Tactical Skills</span>
          <h2 className="font-serif text-3xl font-bold text-white sm:text-4xl tracking-wide text-glow-gold">
            Academy Curriculums & Classrooms
          </h2>
          <p className="mt-4 font-sans text-sm text-neutral-400">
            Click on any skill card below to view the tactical topics, watch lesson overviews, and build your specialized roadmap.
          </p>
          <div className="mt-4 flex justify-center items-center gap-2">
            <span className="h-[1px] w-12 bg-gold/40" />
            <span className="text-gold text-sm">✦</span>
            <span className="h-[1px] w-12 bg-gold/40" />
          </div>
        </div>

        {/* Responsive Grid */}
        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          {skills.map((skill: Skill) => {
            const isExpanded = expandedSkillId === skill.id;
            return (
              <div
                id={`skill-card-${skill.id}`}
                key={skill.id}
                className={`relative flex flex-col justify-between overflow-hidden rounded-xl border transition-all duration-500 glass-panel hover:shadow-[0_0_25px_rgba(212,175,55,0.15)] group ${
                  isExpanded 
                    ? "border-gold/60 ring-1 ring-gold bg-emerald-deep/10 col-span-1 sm:col-span-2 lg:col-span-2" 
                    : "border-gold/15 hover:-translate-y-1 hover:border-gold/45"
                }`}
              >
                {/* Decorative golden top line */}
                <div className={`absolute top-0 left-0 right-0 h-[2px] transition-all duration-500 ${isExpanded ? 'bg-gold' : 'bg-transparent group-hover:bg-gold/40'}`} />

                {/* Card Content Header */}
                <div className="p-6">
                  <div className="flex items-center gap-4">
                    {/* Gilded Icon Container */}
                    <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-lg border border-gold/30 bg-emerald-deep/20 text-gold shadow-md group-hover:bg-gold group-hover:text-black transition-all duration-300">
                      {renderIcon(skill.iconName)}
                    </div>
                    <div>
                      <h3 className="font-serif text-base font-bold text-white tracking-wide group-hover:text-gold transition-colors">
                        {skill.title}
                      </h3>
                      <span className="font-mono text-[9px] uppercase tracking-wider text-gold-light/60">
                        {skill.topics.length} Tactical Chapters
                      </span>
                    </div>
                  </div>

                  <p className="mt-4 font-sans text-xs text-neutral-300 leading-relaxed">
                    {skill.description}
                  </p>
                </div>

                {/* Expand Area - Shows list of Topics */}
                {isExpanded && (
                  <div className="border-t border-gold/20 bg-black/60 p-6 animate-fade-in space-y-3">
                    <h4 className="font-serif text-xs font-bold text-gold uppercase tracking-widest mb-2 flex items-center gap-1">
                      <span>✦</span> Curriculum Outline
                    </h4>
                    <div className="space-y-2.5">
                      {skill.topics.map((topic) => {
                        const isCompleted = isTopicCompleted(topic.id);
                        return (
                          <div
                            id={`topic-row-${topic.id}`}
                            key={topic.id}
                            className={`flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 rounded-lg border p-3.5 transition-all duration-200 ${
                              isCompleted
                                ? "border-emerald-500/25 bg-emerald-950/20"
                                : "border-gold/10 bg-neutral-950/80 hover:border-gold/30"
                            }`}
                          >
                            <div className="flex items-start gap-3">
                              <button
                                onClick={() => toggleTopicCompletion(topic.id)}
                                className={`mt-0.5 flex h-4.5 w-4.5 shrink-0 items-center justify-center rounded border transition-all duration-200 ${
                                  isCompleted
                                    ? "bg-gold border-gold text-black"
                                    : "border-neutral-700 text-transparent hover:border-gold/60"
                                }`}
                                title={isCompleted ? "Mark as Incomplete" : "Mark as Completed"}
                              >
                                <Icons.Check className="h-3 w-3 stroke-[3.5]" />
                              </button>
                              <div className="space-y-1">
                                <span className="inline-flex items-center rounded bg-gold/10 px-1.5 py-0.5 text-[9px] font-mono uppercase text-gold">
                                  {topic.difficulty}
                                </span>
                                <h5 className={`font-sans text-xs font-semibold tracking-wide transition-colors ${
                                  isCompleted ? "text-neutral-500 line-through decoration-gold/30" : "text-white"
                                }`}>
                                  {topic.title}
                                </h5>
                              </div>
                            </div>

                            <div className="flex items-center justify-between sm:justify-end gap-3 shrink-0">
                              <span className="font-mono text-[10px] text-neutral-400">
                                ⏱️ {topic.duration}
                              </span>
                              
                              <button
                                id={`watch-video-btn-${topic.id}`}
                                onClick={() => onWatchVideo(topic.videoUrl, topic.title, topic.id)}
                                className="inline-flex items-center gap-1.5 rounded bg-emerald-accent/20 border border-gold/20 px-2.5 py-1 text-xs font-medium text-gold-light transition-all duration-200 hover:bg-gold hover:text-black hover:border-gold"
                              >
                                <Icons.Play className="h-3 w-3 fill-current" />
                                <span>Watch Video</span>
                              </button>
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  </div>
                )}

                {/* Card Action Button */}
                <div className="border-t border-gold/10 bg-neutral-950/40 px-6 py-3.5 text-right">
                  <button
                    id={`expand-skill-btn-${skill.id}`}
                    onClick={() => toggleExpand(skill.id)}
                    className="font-mono text-[10px] uppercase tracking-widest text-gold hover:text-gold-light transition-colors flex items-center gap-1.5 ml-auto"
                  >
                    <span>{isExpanded ? "Collapse Content" : "Expand Lessons"}</span>
                    {isExpanded ? (
                      <Icons.ChevronUp className="h-3.5 w-3.5" />
                    ) : (
                      <Icons.ChevronDown className="h-3.5 w-3.5" />
                    )}
                  </button>
                </div>

              </div>
            );
          })}
        </div>

      </div>
    </section>
  );
}
