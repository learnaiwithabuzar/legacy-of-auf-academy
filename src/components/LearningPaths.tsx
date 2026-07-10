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
  const [activeTopicId, setActiveTopicId] = useState<string | null>(null);

  // Auto-scroll to top when screen navigation state changes
  useEffect(() => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  }, [selectedSkillId, selectedCourseId]);

  // URL Validation Helper
  const getYouTubeId = (url: string): string | null => {
    if (!url) return null;
    const regExp = /^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|\&v=)([^#\&\?]*).*/;
    const match = url.match(regExp);
    return (match && match[2].length === 11) ? match[2] : null;
  };

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
    (c) => 
      activeSkill && 
      (c.skillName === activeSkill.title || 
       c.skillName?.toLowerCase() === activeSkill.title?.toLowerCase() ||
       c.skillName?.toLowerCase() === activeSkill.id?.toLowerCase()) && 
      c.published !== false
  );
  
  const courseTopics = topics.filter(
    (t) => 
      activeCourse && 
      (t.courseName === activeCourse.title || 
       t.courseName === activeCourse.name || 
       t.courseName?.toLowerCase() === activeCourse.title?.toLowerCase() || 
       t.courseName?.toLowerCase() === activeCourse.name?.toLowerCase()) &&
      t.published !== false
  );

  // Auto-set the active video/topic to the first one in the course
  useEffect(() => {
    if (selectedCourseId && courseTopics.length > 0) {
      // Find if we already have one selected, otherwise pick first
      const exists = courseTopics.some(t => t.id === activeTopicId);
      if (!exists) {
        setActiveTopicId(courseTopics[0].id);
      }
    } else {
      setActiveTopicId(null);
    }
  }, [selectedCourseId, courseTopics.length]);

  const activeTopic = topics.find(t => t.id === activeTopicId);

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
                (c) => 
                  (c.skillName === skill.title || 
                   c.skillName?.toLowerCase() === skill.title?.toLowerCase() ||
                   c.skillName?.toLowerCase() === skill.id?.toLowerCase()) && 
                  c.published !== false
              ).length;
              
              const skillTopicsCount = topics.filter(
                (t) => 
                  (t.skillName === skill.title || 
                   t.skillName?.toLowerCase() === skill.title?.toLowerCase() ||
                   t.skillName?.toLowerCase() === skill.id?.toLowerCase()) && 
                  t.published !== false
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
                    (t) => 
                      (t.courseName === course.title || 
                       t.courseName === course.name || 
                       t.courseName?.toLowerCase() === course.title?.toLowerCase() || 
                       t.courseName?.toLowerCase() === course.name?.toLowerCase()) && 
                      t.published !== false
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

        {/* --- STAGE 3: INTEGRATED CLASSROOM WORKSPACE & SYLLABUS --- */}
        {selectedSkillId && selectedCourseId && (
          <div className="animate-fade-in text-left">
            {/* Navigation Header */}
            <div className="flex flex-wrap items-center justify-between gap-4 mb-8 border-b border-gold/10 pb-4">
              <button
                onClick={() => {
                  setSelectedCourseId(null);
                  setActiveTopicId(null);
                }}
                className="inline-flex items-center gap-2 text-xs font-mono uppercase text-neutral-400 hover:text-gold transition-colors"
              >
                <Icons.ArrowLeft className="h-4 w-4" />
                <span>Back to {activeSkill?.title} Modules</span>
              </button>

              <button
                onClick={() => {
                  setSelectedSkillId(null);
                  setSelectedCourseId(null);
                  setActiveTopicId(null);
                }}
                className="text-xs text-neutral-400 hover:text-white border border-neutral-800 hover:border-gold/30 rounded px-3 py-1.5 transition duration-200 font-mono"
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
              <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
                
                {/* LEFT WORKSPACE: Video player & Lesson Insights */}
                <div className="lg:col-span-7 space-y-6">
                  {activeTopic ? (
                    <>
                      {/* Integrated Active Video Player */}
                      <div className="relative aspect-video w-full rounded-xl overflow-hidden border border-gold/20 shadow-2xl bg-neutral-950">
                        {getYouTubeId(activeTopic.videoUrl) ? (
                          <iframe
                            src={`https://www.youtube.com/embed/${getYouTubeId(activeTopic.videoUrl)}?autoplay=0&rel=0`}
                            className="absolute inset-0 w-full h-full"
                            allowFullScreen
                            title={activeTopic.title}
                            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                          />
                        ) : (
                          <div className="absolute inset-0 flex flex-col items-center justify-center p-6 text-center bg-black/80">
                            <Icons.PlayCircle className="h-16 w-16 text-gold/30 mb-3 stroke-[1]" />
                            <p className="text-sm text-neutral-400 font-mono">No playable YouTube link configured.</p>
                            <a href={activeTopic.videoUrl} target="_blank" rel="noreferrer" className="text-xs text-gold underline mt-2 hover:text-gold-light">
                              Open URL in New Tab ➔
                            </a>
                          </div>
                        )}
                      </div>

                      {/* Active Lesson Meta & Title */}
                      <div className="space-y-2">
                        <div className="flex items-center gap-2">
                          <span className="inline-flex items-center rounded bg-gold/15 border border-gold/25 px-2 py-0.5 text-[10px] font-mono uppercase text-gold font-bold">
                            Active Lesson
                          </span>
                          <span className="text-xs font-mono text-neutral-400 flex items-center gap-1">
                            <Icons.Clock className="h-3.5 w-3.5 text-gold/80" />
                            {activeTopic.duration || "15 mins"}
                          </span>
                          <span className="inline-flex items-center rounded bg-neutral-900 border border-neutral-800 px-2 py-0.5 text-[9px] font-mono uppercase text-neutral-400">
                            {activeTopic.difficulty || "Beginner"}
                          </span>
                        </div>
                        <h3 className="font-serif text-xl font-bold text-white tracking-wide text-glow-gold">
                          {activeTopic.title}
                        </h3>
                        {activeTopic.shortDescription && (
                          <p className="font-sans text-xs text-neutral-300 leading-relaxed">
                            {activeTopic.shortDescription}
                          </p>
                        )}
                      </div>

                      {/* Golden Islamic Ethics & Business Insight Cards */}
                      <div className="grid grid-cols-1 gap-4 mt-6">
                        {/* Islamic Insight */}
                        {activeTopic.islamicInsights && (
                          <div className="rounded-xl border border-gold/20 bg-emerald-deep/5 p-5 relative overflow-hidden group hover:border-gold/35 transition-all">
                            <div className="absolute top-0 right-0 p-3 opacity-10">
                              <Icons.Compass className="h-12 w-12 text-gold" />
                            </div>
                            <div className="flex items-start gap-3">
                              <div className="p-2 rounded-lg border border-gold/30 bg-black/60 text-gold shrink-0">
                                <Icons.Compass className="h-5 w-5" />
                              </div>
                              <div>
                                <h4 className="font-serif text-xs font-bold text-gold uppercase tracking-wider">Islamic Ethical Framework</h4>
                                <p className="mt-2 font-sans text-xs text-neutral-300 leading-relaxed">
                                  {activeTopic.islamicInsights}
                                </p>
                              </div>
                            </div>
                          </div>
                        )}

                        {/* Business Application */}
                        {activeTopic.businessApplication && (
                          <div className="rounded-xl border border-neutral-800 bg-black/40 p-5 relative overflow-hidden hover:border-gold/25 transition-all">
                            <div className="flex items-start gap-3">
                              <div className="p-2 rounded-lg border border-neutral-700 bg-neutral-900 text-gold-light shrink-0">
                                <Icons.TrendingUp className="h-5 w-5" />
                              </div>
                              <div>
                                <h4 className="font-serif text-xs font-bold text-white uppercase tracking-wider">Tactical Business Application</h4>
                                <p className="mt-2 font-sans text-xs text-neutral-300 leading-relaxed">
                                  {activeTopic.businessApplication}
                                </p>
                              </div>
                            </div>
                          </div>
                        )}

                        {/* Income Opportunity */}
                        {activeTopic.incomeOpportunity && (
                          <div className="rounded-xl border border-neutral-800 bg-black/40 p-5 relative overflow-hidden hover:border-gold/25 transition-all">
                            <div className="flex items-start gap-3">
                              <div className="p-2 rounded-lg border border-neutral-700 bg-neutral-900 text-emerald-400 shrink-0">
                                <Icons.DollarSign className="h-5 w-5" />
                              </div>
                              <div>
                                <h4 className="font-serif text-xs font-bold text-emerald-400 uppercase tracking-wider">Halal Income Opportunity</h4>
                                <p className="mt-2 font-sans text-xs text-neutral-300 leading-relaxed">
                                  {activeTopic.incomeOpportunity}
                                </p>
                              </div>
                            </div>
                          </div>
                        )}
                      </div>
                    </>
                  ) : (
                    <div className="flex flex-col items-center justify-center p-12 border border-dashed border-neutral-800 rounded-xl text-center text-neutral-500">
                      <Icons.PlayCircle className="h-12 w-12 text-neutral-700 mb-2" />
                      <p className="text-xs font-mono">Select a lesson from the syllabus outline to load the classroom player.</p>
                    </div>
                  )}
                </div>

                {/* RIGHT SYLLABUS LIST: Click to swap active video */}
                <div className="lg:col-span-5 space-y-4 bg-neutral-950/40 p-5 rounded-2xl border border-neutral-900">
                  <div className="flex items-center justify-between border-b border-neutral-800 pb-3 mb-2">
                    <h4 className="font-serif text-xs font-bold text-gold uppercase tracking-widest flex items-center gap-2">
                      <Icons.Layers className="h-4 w-4" />
                      <span>Syllabus Outline</span>
                    </h4>
                    <span className="font-mono text-[10px] text-neutral-400">
                      {courseTopics.length} Lessons
                    </span>
                  </div>

                  <div className="space-y-2.5 max-h-[580px] overflow-y-auto pr-1">
                    {courseTopics.map((topic, index) => {
                      const isCompleted = isTopicCompleted(topic.id);
                      const isActive = topic.id === activeTopicId;

                      return (
                        <div
                          id={`lesson-row-${topic.id}`}
                          key={topic.id}
                          onClick={() => setActiveTopicId(topic.id)}
                          className={`flex items-start justify-between gap-3 p-3.5 rounded-xl border transition-all duration-200 cursor-pointer text-left ${
                            isActive
                              ? "border-gold/45 bg-gold/5 shadow-[inset_0_0_15px_rgba(212,175,55,0.04)]"
                              : isCompleted
                              ? "border-emerald-500/10 bg-emerald-950/5 hover:border-gold/20"
                              : "border-neutral-900 bg-neutral-950/60 hover:border-gold/20 hover:bg-neutral-950"
                          }`}
                        >
                          <div className="flex items-start gap-3">
                            {/* Completion Checkbox */}
                            <button
                              onClick={(e) => {
                                e.stopPropagation();
                                toggleTopicCompletion(topic.id);
                              }}
                              className={`mt-0.5 flex h-4 w-4 shrink-0 items-center justify-center rounded border transition-all duration-200 ${
                                isCompleted
                                  ? "bg-gold border-gold text-black"
                                  : "border-neutral-700 hover:border-gold/60 text-transparent"
                              }`}
                              title={isCompleted ? "Mark as Incomplete" : "Mark as Completed"}
                            >
                              <Icons.Check className="h-3 w-3 stroke-[4]" />
                            </button>

                            <div className="space-y-0.5">
                              <span className="block font-mono text-[9px] text-neutral-500 uppercase tracking-wider">
                                Lesson {index + 1}
                              </span>
                              <h5 className={`font-sans text-xs font-semibold leading-snug transition-colors duration-200 ${
                                isActive 
                                  ? "text-gold font-bold" 
                                  : isCompleted 
                                  ? "text-neutral-500 line-through decoration-gold/20" 
                                  : "text-neutral-200"
                              }`}>
                                {topic.title}
                              </h5>
                              <span className="inline-flex items-center text-[9px] font-mono text-neutral-500 mt-1">
                                {topic.duration || "15 mins"}
                              </span>
                            </div>
                          </div>

                          <div className="shrink-0 pt-1">
                            {isActive ? (
                              <span className="h-2 w-2 rounded-full bg-gold animate-ping block" />
                            ) : (
                              <Icons.Play className={`h-3.5 w-3.5 transition-colors ${
                                isActive ? "text-gold" : "text-neutral-700 hover:text-gold"
                              }`} />
                            )}
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>

              </div>
            )}
          </div>
        )}

      </div>
    </section>
  );
}
