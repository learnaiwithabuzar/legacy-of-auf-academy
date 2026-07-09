import { useState, useEffect } from "react";
import * as Icons from "lucide-react";
import { useCMS } from "../store/cmsStore";
import { Skill, Course, Topic } from "../types";

interface LearningPathsProps {
  onWatchVideo?: (videoUrl: string, topicTitle: string, topicId?: string) => void;
}

export default function LearningPaths({ onWatchVideo }: LearningPathsProps) {
  const { skills, courses, topics, isTopicCompleted, toggleTopicCompletion } = useCMS();
  
  // LMS State Navigation
  const [selectedSkillId, setSelectedSkillId] = useState<string | null>(null);
  const [selectedCourseId, setSelectedCourseId] = useState<string | null>(null);

  // Auto-scroll to top when screen navigation state changes
  useEffect(() => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  }, [selectedSkillId, selectedCourseId]);

  // Safe helper to render Lucide Icons dynamically
  const renderIcon = (iconName: string, className = "h-6 w-6 stroke-[1.5]") => {
    const IconComponent = (Icons as any)[iconName];
    if (IconComponent) {
      return <IconComponent className={className} />;
    }
    return <Icons.BookOpen className={className} />;
  };

  // Find active active models
  const activeSkill = skills.find((s) => s.id === selectedSkillId);
  const activeCourse = courses.find((c) => c.id === selectedCourseId);

  // Filter lists dynamically
  const skillCourses = courses.filter(
    (c) => c.skillName?.toLowerCase() === activeSkill?.title?.toLowerCase() && c.published !== false
  );
  
  const courseTopics = topics.filter(
    (t) => t.courseName?.toLowerCase() === activeCourse?.title?.toLowerCase() && t.published !== false
  );

  return (
    <section className="relative px-4 py-20 bg-gradient-to-b from-neutral-950 to-black sm:px-6 lg:px-8 border-b border-gold/10 min-h-screen">
      <div className="mx-auto max-w-7xl">
        
        {/* --- DYNAMIC BREADCRUMB NAVIGATION & HERO --- */}
        <div className="mb-12">
          {/* Breadcrumbs */}
          <div className="flex items-center gap-2 font-mono text-xs uppercase tracking-wider mb-6 text-neutral-500 overflow-x-auto pb-2">
            <button
              onClick={() => {
                setSelectedSkillId(null);
                setSelectedCourseId(null);
              }}
              className="hover:text-gold transition-colors flex items-center gap-1 shrink-0"
            >
              <Icons.GraduationCap className="h-4 w-4 text-gold/80" />
              <span>Learning Home</span>
            </button>
            
            {selectedSkillId && activeSkill && (
              <>
                <Icons.ChevronRight className="h-3.5 w-3.5 text-neutral-700 shrink-0" />
                <button
                  onClick={() => {
                    setSelectedCourseId(null);
                  }}
                  className="hover:text-gold transition-colors text-neutral-300 shrink-0"
                >
                  {activeSkill.title}
                </button>
              </>
            )}

            {selectedCourseId && activeCourse && (
              <>
                <Icons.ChevronRight className="h-3.5 w-3.5 text-neutral-700 shrink-0" />
                <span className="text-gold font-bold shrink-0">
                  {activeCourse.title}
                </span>
              </>
            )}
          </div>

          {/* Section Heading & Subheading */}
          <div className="text-center max-w-3xl mx-auto mb-10">
            {!selectedSkillId ? (
              <>
                <span className="font-mono text-xs uppercase tracking-widest text-gold block mb-2">
                  Academic Roadmaps
                </span>
                <h2 className="font-serif text-3xl font-bold text-white sm:text-4xl tracking-wide text-glow-gold">
                  Explore Specialized Skills
                </h2>
                <p className="mt-4 font-sans text-sm text-neutral-400">
                  Choose a high-income, halal skill path. Each path contains structured course modules designed to build a sovereign, asset-rich business from scratch.
                </p>
              </>
            ) : !selectedCourseId ? (
              <>
                <span className="font-mono text-xs uppercase tracking-widest text-gold block mb-2">
                  COURSE PATHWAY
                </span>
                <h2 className="font-serif text-3xl font-bold text-white tracking-wide text-glow-gold">
                  {activeSkill?.title}
                </h2>
                <p className="mt-3 font-sans text-sm text-neutral-300 max-w-xl mx-auto">
                  {activeSkill?.description}
                </p>
              </>
            ) : (
              <>
                <span className="font-mono text-xs uppercase tracking-widest text-gold block mb-2">
                  SYLLABUS & LESSONS
                </span>
                <h2 className="font-serif text-2xl font-bold text-white tracking-wide">
                  {activeCourse?.title}
                </h2>
                <p className="mt-3 font-sans text-sm text-neutral-400 max-w-xl mx-auto">
                  {activeCourse?.description || "Master these lessons sequentially to unlock your certification milestone."}
                </p>
              </>
            )}
            
            <div className="mt-6 flex justify-center items-center gap-2">
              <span className="h-[1px] w-12 bg-gold/40" />
              <span className="text-gold text-sm">✦</span>
              <span className="h-[1px] w-12 bg-gold/40" />
            </div>
          </div>
        </div>

        {/* --- STAGE 1: SKILLS GRID --- */}
        {!selectedSkillId && (
          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 animate-fade-in">
            {skills.map((skill) => {
              const skillCoursesCount = courses.filter(
                (c) => c.skillName?.toLowerCase() === skill.title?.toLowerCase() && c.published !== false
              ).length;
              
              const skillTopicsCount = topics.filter(
                (t) => t.skillName?.toLowerCase() === skill.title?.toLowerCase() && t.published !== false
              ).length;

              return (
                <div
                  id={`skill-path-card-${skill.id}`}
                  key={skill.id}
                  onClick={() => setSelectedSkillId(skill.id)}
                  className="relative flex flex-col justify-between overflow-hidden rounded-xl border border-gold/15 bg-neutral-950/60 p-6 transition-all duration-300 hover:-translate-y-1 hover:border-gold/50 hover:shadow-[0_0_30px_rgba(212,175,55,0.15)] cursor-pointer group"
                >
                  {/* Luxury glow accent top line */}
                  <div className="absolute top-0 left-0 right-0 h-[2px] bg-transparent group-hover:bg-gold transition-colors duration-300" />
                  
                  <div>
                    {/* Icon Container */}
                    <div className="flex h-12 w-12 items-center justify-center rounded-lg border border-gold/25 bg-emerald-deep/10 text-gold mb-5 group-hover:bg-gold group-hover:text-black transition-all duration-300">
                      {renderIcon(skill.iconName || "Cpu")}
                    </div>

                    <h3 className="font-serif text-lg font-bold text-white tracking-wide group-hover:text-gold transition-colors duration-200">
                      {skill.title}
                    </h3>
                    
                    <p className="mt-3 font-sans text-xs text-neutral-400 leading-relaxed min-h-[50px]">
                      {skill.description}
                    </p>
                  </div>

                  {/* Bottom Stats */}
                  <div className="mt-6 pt-4 border-t border-gold/10 flex items-center justify-between">
                    <span className="font-mono text-[10px] uppercase text-neutral-400 flex items-center gap-1">
                      <Icons.Layers className="h-3 w-3 text-gold/75" />
                      {skillCoursesCount} Modules
                    </span>
                    <span className="font-mono text-[10px] uppercase text-neutral-400 flex items-center gap-1">
                      <Icons.BookOpen className="h-3 w-3 text-gold/75" />
                      {skillTopicsCount} Lessons
                    </span>
                  </div>
                </div>
              );
            })}
          </div>
        )}

        {/* --- STAGE 2: COURSE MODULES OF THE SELECTED SKILL --- */}
        {selectedSkillId && !selectedCourseId && (
          <div className="animate-fade-in">
            {/* Back to skills button */}
            <button
              onClick={() => setSelectedSkillId(null)}
              className="inline-flex items-center gap-2 mb-8 text-xs font-mono uppercase text-neutral-400 hover:text-gold transition-colors"
            >
              <Icons.ArrowLeft className="h-4 w-4" />
              <span>Back to Skills Grid</span>
            </button>

            {skillCourses.length === 0 ? (
              <div className="flex flex-col items-center justify-center p-16 border border-dashed border-gold/15 rounded-2xl bg-neutral-950/40 text-center">
                <Icons.Compass className="h-12 w-12 text-gold/20 stroke-[1] mb-4" />
                <p className="text-sm text-neutral-400 font-sans max-w-md leading-relaxed">
                  No course modules are currently registered or published under <strong className="text-white">{activeSkill?.title}</strong>. Check back soon.
                </p>
              </div>
            ) : (
              <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
                {skillCourses.map((course) => {
                  const courseLessons = topics.filter(
                    (t) => t.courseName?.toLowerCase() === course.title?.toLowerCase() && t.published !== false
                  );
                  const completedInCourse = courseLessons.filter((t) => isTopicCompleted(t.id)).length;
                  const progressPercent = courseLessons.length > 0 
                    ? Math.round((completedInCourse / courseLessons.length) * 100) 
                    : 0;

                  return (
                    <div
                      id={`course-card-${course.id}`}
                      key={course.id}
                      onClick={() => setSelectedCourseId(course.id)}
                      className="relative flex flex-col justify-between overflow-hidden rounded-2xl border border-gold/15 bg-neutral-950/60 p-6 transition-all duration-300 hover:border-gold/45 hover:shadow-[0_0_25px_rgba(212,175,55,0.1)] cursor-pointer group"
                    >
                      <div>
                        {/* Upper Details */}
                        <div className="flex items-center justify-between gap-2 mb-4">
                          <span className="inline-flex items-center rounded-full bg-gold/10 px-2.5 py-0.5 text-[10px] font-mono text-gold font-medium uppercase tracking-wider">
                            Course Module
                          </span>
                          <span className="font-mono text-[10px] text-neutral-500">
                            {courseLessons.length} Lessons
                          </span>
                        </div>

                        {/* Title */}
                        <h3 className="font-serif text-lg font-bold text-white mb-3 group-hover:text-gold transition-colors duration-200">
                          {course.title}
                        </h3>

                        {/* Description */}
                        <p className="font-sans text-xs text-neutral-400 leading-relaxed mb-6">
                          {course.description || "Dive deep into the strategies and mechanics of this critical course module."}
                        </p>
                      </div>

                      {/* Progress bar or click action */}
                      <div className="mt-auto pt-5 border-t border-gold/10">
                        {courseLessons.length > 0 && completedInCourse > 0 ? (
                          <div className="space-y-2">
                            <div className="flex justify-between items-center text-[10px] font-mono">
                              <span className="text-neutral-400">YOUR PROGRESS</span>
                              <span className="text-gold font-bold">{progressPercent}%</span>
                            </div>
                            <div className="h-1.5 w-full bg-neutral-900 rounded-full overflow-hidden">
                              <div 
                                className="h-full bg-gold rounded-full transition-all duration-500"
                                style={{ width: `${progressPercent}%` }}
                              />
                            </div>
                          </div>
                        ) : (
                          <div className="flex items-center justify-between text-xs font-mono text-gold font-semibold">
                            <span>Syllabus & Curriculum</span>
                            <Icons.ArrowRight className="h-4 w-4 transform group-hover:translate-x-1.5 transition-transform" />
                          </div>
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        )}

        {/* --- STAGE 3: TOPICS / LESSONS LIST OF SELECTED COURSE --- */}
        {selectedSkillId && selectedCourseId && (
          <div className="animate-fade-in text-left">
            {/* Back button */}
            <div className="flex flex-wrap items-center justify-between gap-4 mb-8">
              <button
                onClick={() => setSelectedCourseId(null)}
                className="inline-flex items-center gap-2 text-xs font-mono uppercase text-neutral-400 hover:text-gold transition-colors"
              >
                <Icons.ArrowLeft className="h-4 w-4" />
                <span>Back to {activeSkill?.title} Courses</span>
              </button>

              <button
                onClick={() => {
                  setSelectedSkillId(null);
                  setSelectedCourseId(null);
                }}
                className="text-xs text-neutral-400 hover:text-white border border-neutral-800 hover:border-gold/30 rounded px-3 py-1.5 transition duration-200"
              >
                Return to Skills Home
              </button>
            </div>

            {courseTopics.length === 0 ? (
              <div className="flex flex-col items-center justify-center p-16 border border-dashed border-gold/15 rounded-2xl bg-neutral-950/40 text-center">
                <Icons.BookOpen className="h-12 w-12 text-gold/20 stroke-[1] mb-4" />
                <p className="text-sm text-neutral-400 font-sans max-w-md leading-relaxed">
                  No lessons or topics have been published under this course module yet. Stay tuned as faculty uploads original content.
                </p>
              </div>
            ) : (
              <div className="space-y-4 max-w-4xl mx-auto">
                <h3 className="font-serif text-sm font-bold text-gold uppercase tracking-widest mb-6 flex items-center gap-2">
                  <Icons.PlayCircle className="h-4 w-4" />
                  <span>Syllabus ({courseTopics.length} Lessons)</span>
                </h3>

                {courseTopics.map((topic, index) => {
                  const isCompleted = isTopicCompleted(topic.id);
                  
                  return (
                    <div
                      id={`lesson-row-${topic.id}`}
                      key={topic.id}
                      className={`flex flex-col sm:flex-row sm:items-center justify-between gap-5 rounded-xl border p-5 transition-all duration-200 bg-neutral-950/40 ${
                        isCompleted
                          ? "border-emerald-500/20 bg-emerald-950/5"
                          : "border-gold/10 hover:border-gold/35"
                      }`}
                    >
                      <div className="flex items-start gap-4">
                        {/* Completion Checkbox */}
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            toggleTopicCompletion(topic.id);
                          }}
                          className={`mt-1 flex h-5 w-5 shrink-0 items-center justify-center rounded border transition-all duration-200 ${
                            isCompleted
                              ? "bg-gold border-gold text-black"
                              : "border-neutral-700 hover:border-gold/60 text-transparent"
                          }`}
                          title={isCompleted ? "Mark as Incomplete" : "Mark as Completed"}
                        >
                          <Icons.Check className="h-3.5 w-3.5 stroke-[3.5]" />
                        </button>

                        <div className="space-y-1">
                          <div className="flex flex-wrap items-center gap-2">
                            <span className="font-mono text-[10px] text-gold/80 font-bold uppercase tracking-wider">
                              Lesson {index + 1}
                            </span>
                            <span className="inline-flex items-center rounded bg-neutral-900 border border-neutral-800 px-2 py-0.5 text-[9px] font-mono uppercase text-neutral-400">
                              {topic.difficulty || "Beginner"}
                            </span>
                          </div>

                          <h4 className={`font-sans text-sm font-bold tracking-wide mt-1 transition-colors duration-200 ${
                            isCompleted ? "text-neutral-500 line-through decoration-gold/25" : "text-white"
                          }`}>
                            {topic.title}
                          </h4>

                          {topic.shortDescription && (
                            <p className="font-sans text-xs text-neutral-400 leading-relaxed max-w-xl">
                              {topic.shortDescription}
                            </p>
                          )}
                        </div>
                      </div>

                      {/* Right watch actions */}
                      <div className="flex items-center justify-between sm:justify-end gap-5 shrink-0 border-t sm:border-t-0 pt-3 sm:pt-0 border-gold/5">
                        <span className="font-mono text-[11px] text-neutral-400 flex items-center gap-1">
                          <Icons.Clock className="h-3.5 w-3.5 text-gold" />
                          {topic.duration || "15 mins"}
                        </span>

                        <button
                          onClick={() => onWatchVideo?.(topic.videoUrl, topic.title, topic.id)}
                          className="inline-flex items-center gap-1.5 rounded bg-emerald-accent/25 border border-gold/20 px-3.5 py-1.5 text-xs font-semibold text-gold-light transition-all duration-200 hover:bg-gold hover:text-black hover:border-gold"
                        >
                          <Icons.Play className="h-3 w-3 fill-current" />
                          <span>Watch Video</span>
                        </button>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        )}

      </div>
    </section>
  );
}
