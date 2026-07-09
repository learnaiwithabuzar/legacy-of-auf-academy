import { useState } from "react";
import { useCMS } from "../store/cmsStore";
import { Compass, BookOpen, Clock, BarChart, ChevronRight, Play } from "lucide-react";

interface LearningPathsProps {
  onWatchVideo?: (videoUrl: string, topicTitle: string, topicId?: string) => void;
}

export default function LearningPaths({ onWatchVideo }: LearningPathsProps) {
  const { learningPaths, courses, topics } = useCMS();
  const [selectedPathId, setSelectedPathId] = useState<string | null>(null);
  const [selectedCourseId, setSelectedCourseId] = useState<string | null>(null);

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
            Follow our pre-designed curriculum tracks crafted to transition you from an ethical seeker to a sovereign, asset-rich business owner. Click on any track below to expand its Course Modules.
          </p>
          <div className="mt-4 flex justify-center items-center gap-2">
            <span className="h-[1px] w-12 bg-gold/40" />
            <span className="text-gold text-sm">✦</span>
            <span className="h-[1px] w-12 bg-gold/40" />
          </div>
        </div>

        {/* Path Cards */}
        <div className="grid grid-cols-1 gap-8 lg:grid-cols-3">
          {learningPaths.map((path) => {
            const isSelected = selectedPathId === path.id;
            return (
              <div
                id={`path-card-${path.id}`}
                key={path.id}
                onClick={() => {
                  setSelectedPathId(isSelected ? null : path.id);
                  setSelectedCourseId(null); // Reset course selection
                }}
                className={`flex flex-col justify-between overflow-hidden rounded-2xl border bg-black p-6 relative transition-all duration-300 cursor-pointer group ${
                  isSelected
                    ? "border-gold shadow-[0_0_35px_rgba(212,175,55,0.25)] ring-1 ring-gold"
                    : "border-gold/15 hover:border-gold/40 hover:shadow-[0_0_30px_rgba(4,106,56,0.15)]"
                }`}
              >
                {/* Islamic Star corner seal decoration */}
                <div className={`absolute right-4 top-4 transition-colors duration-300 ${isSelected ? 'text-gold' : 'text-gold/15 group-hover:text-gold/35'}`}>
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
                  <h3 className={`font-serif text-xl font-bold tracking-wide mb-3 transition-colors ${isSelected ? 'text-gold' : 'text-white group-hover:text-gold'}`}>
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
                    <BarChart className="h-3.5 w-3.5" /> {isSelected ? "Selected" : "Click to Explore"}
                  </span>
                </div>

              </div>
            );
          })}
        </div>

        {/* Course Modules and Topics Section */}
        {selectedPathId && (
          <div className="mt-12 border border-gold/15 rounded-2xl bg-black/40 p-6 md:p-8 animate-fade-in text-left">
            {(() => {
              const selectedPath = learningPaths.find(p => p.id === selectedPathId);
              const pathCourses = courses.filter(c => c.learningPathId === selectedPathId);
              
              return (
                <div>
                  {/* Selected Path Title */}
                  <div className="mb-8 border-b border-gold/10 pb-4 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                    <div>
                      <span className="font-mono text-[10px] uppercase tracking-widest text-gold">ACTIVE ROADMAP CURRICULUM</span>
                      <h3 className="font-serif text-2xl font-bold text-white mt-1">{selectedPath?.title}</h3>
                    </div>
                    <button 
                      onClick={() => {
                        setSelectedPathId(null);
                        setSelectedCourseId(null);
                      }}
                      className="text-xs text-neutral-400 hover:text-white border border-neutral-800 hover:border-gold/35 rounded px-3 py-1.5 transition duration-200 self-start sm:self-center"
                    >
                      Close Details
                    </button>
                  </div>

                  <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                    {/* Course Modules Column */}
                    <div className="space-y-3">
                      <h4 className="font-serif text-xs font-bold text-gold uppercase tracking-widest mb-4 flex items-center gap-1.5">
                        <BookOpen className="h-4 w-4" />
                        <span>Course Modules</span>
                      </h4>
                      {pathCourses.length === 0 ? (
                        <p className="text-xs text-neutral-500 italic py-4">No course modules registered for this path yet.</p>
                      ) : (
                        pathCourses.map((course) => {
                          const isCourseSelected = selectedCourseId === course.id;
                          const courseTopicsCount = topics.filter(t => t.courseName === course.title && t.published !== false).length;
                          
                          return (
                            <div
                              key={course.id}
                              onClick={() => setSelectedCourseId(course.id)}
                              className={`p-4 rounded-xl border transition-all duration-200 cursor-pointer text-left ${
                                isCourseSelected
                                  ? "border-gold bg-gold/5 shadow-[0_0_15px_rgba(212,175,55,0.1)] text-white"
                                  : "border-gold/10 bg-neutral-950/60 text-neutral-300 hover:border-gold/30 hover:bg-neutral-900/40"
                              }`}
                            >
                              <div className="flex justify-between items-start gap-2">
                                <h5 className={`font-sans text-xs font-bold tracking-wide ${isCourseSelected ? "text-gold" : "text-white"}`}>
                                  {course.title}
                                </h5>
                                <ChevronRight className={`h-4 w-4 shrink-0 mt-0.5 transition-transform duration-200 ${isCourseSelected ? "transform rotate-90 text-gold" : "text-neutral-500"}`} />
                              </div>
                              <div className="mt-2 flex items-center gap-3 font-mono text-[9px] text-neutral-400">
                                <span className="uppercase text-gold-light/75">{course.skillName}</span>
                                <span>•</span>
                                <span>{courseTopicsCount} lessons</span>
                              </div>
                            </div>
                          );
                        })
                      )}
                    </div>

                    {/* Topics Column */}
                    <div className="lg:col-span-2 space-y-3">
                      <h4 className="font-serif text-xs font-bold text-gold uppercase tracking-widest mb-4">
                        <span>Topics & Video Lessons</span>
                      </h4>

                      {(() => {
                        if (!selectedCourseId) {
                          return (
                            <div className="flex flex-col items-center justify-center p-12 border border-dashed border-gold/10 rounded-xl bg-neutral-950/20 text-center">
                              <Compass className="h-10 w-10 text-gold/25 stroke-[1] mb-3" />
                              <p className="text-xs text-neutral-400 font-sans">
                                Select a Course Module on the left to load its syllabus and video lessons.
                              </p>
                            </div>
                          );
                        }

                        const selectedCourse = courses.find(c => c.id === selectedCourseId);
                        const courseTopics = topics.filter(
                          t => t.courseName === selectedCourse?.title && t.published !== false
                        );

                        if (courseTopics.length === 0) {
                          return (
                            <div className="flex flex-col items-center justify-center p-12 border border-dashed border-gold/10 rounded-xl bg-neutral-950/20 text-center">
                              <BookOpen className="h-10 w-10 text-gold/25 stroke-[1] mb-3" />
                              <p className="text-xs text-neutral-400 font-sans">
                                No video lessons are currently published in this module.
                              </p>
                            </div>
                          );
                        }

                        return (
                          <div className="space-y-3">
                            {courseTopics.map((topic) => (
                              <div
                                key={topic.id}
                                className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 rounded-xl border border-gold/10 bg-neutral-950/60 p-4 hover:border-gold/30 transition-all duration-200"
                              >
                                <div className="space-y-1 text-left">
                                  <div className="flex items-center gap-2">
                                    <span className="inline-flex items-center rounded bg-gold/10 px-1.5 py-0.5 text-[9px] font-mono uppercase text-gold">
                                      {topic.difficulty || "Beginner"}
                                    </span>
                                    <span className="font-mono text-[9px] uppercase tracking-wider text-neutral-500">
                                      {topic.skillName}
                                    </span>
                                  </div>
                                  <h5 className="font-sans text-xs font-bold text-white tracking-wide">
                                    {topic.title}
                                  </h5>
                                  {topic.shortDescription && (
                                    <p className="font-sans text-[11px] text-neutral-400 leading-relaxed max-w-xl">
                                      {topic.shortDescription}
                                    </p>
                                  )}
                                </div>

                                <div className="flex items-center justify-between sm:justify-end gap-4 shrink-0 border-t sm:border-t-0 pt-3 sm:pt-0 border-gold/5">
                                  <span className="font-mono text-[10px] text-neutral-400 flex items-center gap-1">
                                    ⏱️ {topic.duration || "15 mins"}
                                  </span>

                                  <button
                                    onClick={() => onWatchVideo?.(topic.videoUrl, topic.title, topic.id)}
                                    className="inline-flex items-center gap-1.5 rounded bg-emerald-accent/20 border border-gold/20 px-3 py-1.5 text-xs font-semibold text-gold-light transition-all duration-200 hover:bg-gold hover:text-black hover:border-gold animate-glow"
                                  >
                                    <Play className="h-3 w-3 fill-current" />
                                    <span>Watch Video</span>
                                  </button>
                                </div>
                              </div>
                            ))}
                          </div>
                        );
                      })()}
                    </div>
                  </div>
                </div>
              );
            })()}
          </div>
        )}

      </div>
    </section>
  );
}
