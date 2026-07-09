import React, { useState, useEffect, useMemo } from "react";
import { Play, Bookmark, Clock, Award, Star, MessageSquare, Download, Check, FileText, ChevronRight, HelpCircle } from "lucide-react";
import { useCMS } from "../store/cmsStore";

interface Review {
  id: string;
  user: string;
  rating: number;
  comment: string;
  date: string;
}

interface Thread {
  id: string;
  user: string;
  role: string;
  message: string;
  timestamp: string;
}

export default function CourseExperience({ onWatchVideo }: { onWatchVideo?: (videoUrl: string, topicTitle: string, topicId?: string) => void }) {
  const { topics, addNotification } = useCMS();
  
  // Simulated last topic progress
  const [lastTopic, setLastTopic] = useState<any>(null);
  
  // Reviews State
  const [reviews, setReviews] = useState<Review[]>([
    { id: "rev-1", user: "Yusuf Haroon", rating: 5, comment: "The Mudarabah Excel spreadsheets are absolutely world-class! Cleared up all my questions on partnership structures.", date: "2026-07-08" },
    { id: "rev-2", user: "Layla Siddiqui", rating: 4, comment: "Extremely detailed legal commentary. The integration with Quranic sources makes this course incredibly authentic.", date: "2026-07-06" }
  ]);
  const [newRating, setNewRating] = useState(5);
  const [newComment, setNewComment] = useState("");

  // Discussion Board State
  const [threads, setThreads] = useState<Thread[]>([
    { id: "th-1", user: "Omar Al-Faruq", role: "Student", message: "If our SaaS model incorporates a 30-day trial refund, is that classed as contract uncertainty (gharar)?", timestamp: "3 hours ago" },
    { id: "th-2", user: "Professor Ali", role: "Teacher", message: "Assalamu alaikum Omar. No, a standard return/refund option (Khyar al-Shart) is perfectly permissible in classical Shariah commercial law, provided the timeline is fixed.", timestamp: "2 hours ago" }
  ]);
  const [newPost, setNewPost] = useState("");

  // Offline Download State
  const [downloadProgress, setDownloadProgress] = useState<Record<string, "idle" | "downloading" | "cached">>({});

  // Active Highlight
  const [activeHighlight, setActiveHighlight] = useState("");

  // Estimated completion metrics
  const totalCourseTime = 320; // minutes
  const completedTime = 120; // minutes

  useEffect(() => {
    if (topics.length > 0) {
      setLastTopic(topics[0]);
    }
  }, [topics]);

  // Submit dynamic review
  const handleAddReview = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newComment.trim()) return;

    const review: Review = {
      id: `rev-${Date.now()}`,
      user: "Current Student (You)",
      rating: newRating,
      comment: newComment,
      date: new Date().toISOString().substring(0, 10)
    };

    setReviews(prev => [review, ...prev]);
    setNewComment("");
    addNotification("Review Submitted", "Your course review and rating have been posted to the Academy.", "success");
  };

  // Submit discussion thread
  const handleAddThread = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newPost.trim()) return;

    const post: Thread = {
      id: `th-${Date.now()}`,
      user: "Current Student (You)",
      role: "Student",
      message: newPost,
      timestamp: "Just Now"
    };

    setThreads(prev => [...prev, post]);
    setNewPost("");

    // Simulate faculty auto-reply
    setTimeout(() => {
      const response: Thread = {
        id: `th-reply-${Date.now()}`,
        user: "Islamic Advisor Bot",
        role: "Reviewer",
        message: "Jazakallah khair for your post! A Shariah Board reviewer has logged this discussion thread and will respond formally within 24 hours.",
        timestamp: "1 min ago"
      };
      setThreads(prev => [...prev, response]);
    }, 1500);
  };

  // Simulate download
  const handleOfflineDownload = (id: string) => {
    setDownloadProgress(prev => ({ ...prev, [id]: "downloading" }));
    
    let progress = 0;
    const interval = setInterval(() => {
      progress += 20;
      if (progress >= 100) {
        clearInterval(interval);
        setDownloadProgress(prev => ({ ...prev, [id]: "cached" }));
        addNotification("Lesson Cached Offline", `Full media and syllabus resources for topic ${id} are now accessible in offline mode.`, "success");
      }
    }, 400);
  };

  const averageRating = useMemo(() => {
    if (reviews.length === 0) return 5;
    const sum = reviews.reduce((acc, curr) => acc + curr.rating, 0);
    return (sum / reviews.length).toFixed(1);
  }, [reviews]);

  return (
    <div id="course-experience-hub" className="space-y-6 text-left">
      
      {/* 1. Continue Watching Banner Dashboard */}
      {lastTopic && (
        <div className="rounded-xl border border-gold/25 bg-gradient-to-r from-emerald-950/20 via-neutral-950 to-neutral-950 p-5 shadow-lg shadow-gold/5 flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="space-y-2 flex-1">
            <span className="font-mono text-[9px] uppercase tracking-widest text-gold flex items-center gap-1">
              <Clock className="h-3.5 w-3.5" />
              <span>CONTINUE ETHICAL EDUCATION FLOW</span>
            </span>
            <h4 className="font-serif text-base md:text-lg font-bold text-white tracking-wide">
              {lastTopic.title}
            </h4>
            <div className="flex flex-wrap gap-x-6 gap-y-1 font-mono text-[10px] text-neutral-400">
              <span>Path: <strong className="text-neutral-200">{lastTopic.category || "General Commerce"}</strong></span>
              <span>Estimated remaining time: <strong className="text-gold">{totalCourseTime - completedTime} mins</strong></span>
            </div>

            {/* Completion indicator */}
            <div className="space-y-1 max-w-sm pt-1">
              <div className="flex justify-between font-mono text-[9px] text-neutral-500">
                <span>CURRICULUM COMPLETION</span>
                <span>{Math.round((completedTime / totalCourseTime) * 100)}%</span>
              </div>
              <div className="h-1.5 w-full bg-neutral-900 rounded-full overflow-hidden">
                <div
                  className="h-full bg-gold transition-all duration-300"
                  style={{ width: `${(completedTime / totalCourseTime) * 100}%` }}
                />
              </div>
            </div>
          </div>

          <button
            onClick={() => {
              if (onWatchVideo) {
                onWatchVideo(lastTopic.videoUrl || "https://www.youtube.com/embed/dQw4w9WgXcQ", lastTopic.title, lastTopic.id);
              }
            }}
            className="rounded-full bg-gold hover:bg-gold-light text-black px-5 py-3 text-xs font-mono font-bold uppercase transition-all flex items-center gap-2 shadow-md hover:scale-105 shrink-0 cursor-pointer"
          >
            <Play className="h-4.5 w-4.5 fill-black" />
            <span>Resume Lesson ➔</span>
          </button>
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        
        {/* Course Attachments & Highlights Tracker (4 cols) */}
        <div className="lg:col-span-4 space-y-6">
          
          {/* Shariah-Approved Download Attachments */}
          <div className="rounded-xl border border-gold/15 bg-neutral-950/80 p-5 shadow-md space-y-4">
            <h4 className="font-serif text-sm font-bold text-white flex items-center gap-2 border-b border-gold/10 pb-2.5">
              <Download className="h-4.5 w-4.5 text-gold" />
              <span>Lesson Attachments & Models</span>
            </h4>

            <div className="space-y-2.5">
              {[
                { id: "att-1", name: "Mudarabah Contract Template.pdf", size: "1.4 MB", type: "PDF" },
                { id: "att-2", name: "Dynamic Cap Table Diluter.xlsx", size: "3.2 MB", type: "SPREADSHEET" },
                { id: "att-3", name: "Halal Financing Pitch Deck.pptx", size: "8.4 MB", type: "SLIDES" }
              ].map((att) => (
                <div key={att.id} className="p-3 border border-neutral-900 rounded bg-neutral-950/40 flex justify-between items-center text-xs">
                  <div className="space-y-0.5 pr-2">
                    <span className="block font-sans font-bold text-neutral-200 truncate max-w-[150px]">{att.name}</span>
                    <span className="block font-mono text-[9px] text-neutral-500 uppercase">{att.type} • {att.size}</span>
                  </div>
                  
                  {downloadProgress[att.id] === "cached" ? (
                    <span className="px-2.5 py-1 rounded bg-emerald-950 text-emerald-400 border border-emerald-500/20 font-mono text-[9px] font-bold uppercase flex items-center gap-1 shrink-0">
                      <Check className="h-3 w-3" /> Cached
                    </span>
                  ) : downloadProgress[att.id] === "downloading" ? (
                    <div className="h-5 w-5 border-2 border-gold border-t-transparent rounded-full animate-spin shrink-0" />
                  ) : (
                    <button
                      onClick={() => handleOfflineDownload(att.id)}
                      className="p-1.5 rounded bg-neutral-900 border border-neutral-800 hover:border-gold/30 text-gold-light hover:text-white transition-all cursor-pointer"
                      title="Download Offline"
                    >
                      <Download className="h-4 w-4" />
                    </button>
                  )}
                </div>
              ))}
            </div>
          </div>

          {/* Transcript Highlighter Workspace */}
          <div className="rounded-xl border border-gold/15 bg-neutral-950/80 p-5 shadow-md space-y-4">
            <h4 className="font-serif text-sm font-bold text-white flex items-center gap-2 border-b border-gold/10 pb-2.5">
              <Bookmark className="h-4.5 w-4.5 text-gold" />
              <span>Transcript & Highlight Vault</span>
            </h4>

            <p className="font-sans text-[11px] text-neutral-400 leading-relaxed">
              Highlight key teachings from the transcript below to save them securely to your personal learning catalog.
            </p>

            <div className="border border-neutral-900 p-3.5 rounded bg-black/40 text-xs text-neutral-300 font-serif leading-relaxed italic relative">
              "Every business transaction must maintain absolute <span 
                className="bg-gold/20 hover:bg-gold/40 text-white font-bold cursor-pointer transition px-1"
                onClick={() => {
                  setActiveHighlight("Gharar - absolute commercial contract uncertainty which must be avoided in trade contracts.");
                  addNotification("New Highlight Added", "Saved contract uncertainty definition to your bookmarks.", "success");
                }}
              >clarity of risk (Gharar)</span> and <span 
                className="bg-gold/20 hover:bg-gold/40 text-white font-bold cursor-pointer transition px-1"
                onClick={() => {
                  setActiveHighlight("Usury / Riba - the unjust extraction of static profit without taking operational commercial risk.");
                  addNotification("New Highlight Added", "Saved usury definition to your bookmarks.", "success");
                }}
              >the sharing of risk (Riba prohibition)</span>. Riskless profit is illegitimate."
            </div>

            {activeHighlight && (
              <div className="p-3 bg-gold/5 border border-gold/10 rounded text-[11px] space-y-1 animate-fade-in">
                <span className="font-mono text-[8px] uppercase tracking-widest text-gold font-bold">ACTIVE BOOKMARK SAVED</span>
                <p className="font-sans text-neutral-300 leading-relaxed">"{activeHighlight}"</p>
              </div>
            )}
          </div>

        </div>

        {/* Discussions & Course Peer Reviews (8 cols) */}
        <div className="lg:col-span-8 grid grid-cols-1 md:grid-cols-2 gap-6">
          
          {/* Lesson Discussions Board */}
          <div className="rounded-xl border border-gold/15 bg-neutral-950/80 p-5 shadow-md space-y-4 flex flex-col justify-between min-h-[460px]">
            <div className="space-y-4">
              <h4 className="font-serif text-sm font-bold text-white flex items-center gap-2 border-b border-gold/10 pb-2.5 shrink-0">
                <MessageSquare className="h-4.5 w-4.5 text-gold" />
                <span>Lesson Peer Discussion Thread</span>
              </h4>

              <div className="space-y-3 max-h-[280px] overflow-y-auto pr-1">
                {threads.map((th) => (
                  <div key={th.id} className={`p-3 rounded border text-xs leading-relaxed ${
                    th.role !== "Student" 
                      ? "border-gold/20 bg-gold/5 text-gold-light pl-3.5 border-l-2 border-l-gold"
                      : "border-neutral-900 bg-black/30 text-neutral-300"
                  }`}>
                    <div className="flex justify-between items-center mb-1 text-[9px] font-mono text-neutral-500">
                      <span className="font-bold text-neutral-300">{th.user} <span className="text-[8px] uppercase text-gold">({th.role})</span></span>
                      <span>{th.timestamp}</span>
                    </div>
                    <p className="font-sans">{th.message}</p>
                  </div>
                ))}
              </div>
            </div>

            <form onSubmit={handleAddThread} className="pt-4 border-t border-neutral-900 shrink-0 space-y-2">
              <input
                type="text"
                value={newPost}
                onChange={(e) => setNewPost(e.target.value)}
                placeholder="Ask a question or reply to peers..."
                className="w-full rounded bg-black border border-gold/25 px-3 py-2 font-sans text-xs text-white focus:border-gold focus:outline-none"
              />
              <button
                type="submit"
                className="w-full py-1.5 rounded bg-neutral-900 border border-gold/25 hover:bg-gold hover:text-black font-mono text-[9px] font-bold uppercase transition-all cursor-pointer"
              >
                Post to Discussion Board
              </button>
            </form>
          </div>

          {/* Student Reviews & Star Rating System */}
          <div className="rounded-xl border border-gold/15 bg-neutral-950/80 p-5 shadow-md space-y-4 flex flex-col justify-between min-h-[460px]">
            <div className="space-y-4">
              <div className="flex justify-between items-center border-b border-gold/10 pb-2.5 shrink-0">
                <h4 className="font-serif text-sm font-bold text-white flex items-center gap-2">
                  <Star className="h-4.5 w-4.5 text-gold fill-gold" />
                  <span>Student Reviews & Ratings</span>
                </h4>
                <div className="flex items-center gap-1 bg-gold/10 border border-gold/25 px-2 py-0.5 rounded shrink-0">
                  <Star className="h-3 w-3 text-gold fill-gold" />
                  <span className="font-mono text-xs text-gold font-bold">{averageRating} / 5</span>
                </div>
              </div>

              <div className="space-y-3.5 max-h-[220px] overflow-y-auto pr-1">
                {reviews.map((rev) => (
                  <div key={rev.id} className="space-y-1.5 border-b border-neutral-900 pb-3">
                    <div className="flex justify-between items-center text-[10px] font-mono">
                      <span className="font-bold text-white">{rev.user}</span>
                      <div className="flex text-gold">
                        {[...Array(5)].map((_, i) => (
                          <Star key={i} className={`h-2.5 w-2.5 ${i < rev.rating ? "fill-gold text-gold" : "text-neutral-700"}`} />
                        ))}
                      </div>
                    </div>
                    <p className="font-sans text-[11px] text-neutral-400 leading-relaxed">
                      "{rev.comment}"
                    </p>
                  </div>
                ))}
              </div>
            </div>

            <form onSubmit={handleAddReview} className="pt-4 border-t border-neutral-900 shrink-0 space-y-3 text-xs">
              <div className="flex items-center gap-2">
                <span className="font-mono text-[9px] uppercase text-neutral-400">Your Rating:</span>
                <div className="flex gap-1.5">
                  {[1, 2, 3, 4, 5].map((stars) => (
                    <button
                      key={stars}
                      type="button"
                      onClick={() => setNewRating(stars)}
                      className="focus:outline-none cursor-pointer"
                    >
                      <Star className={`h-4.5 w-4.5 ${stars <= newRating ? "text-gold fill-gold" : "text-neutral-700"}`} />
                    </button>
                  ))}
                </div>
              </div>

              <div className="space-y-2">
                <textarea
                  rows={2}
                  value={newComment}
                  onChange={(e) => setNewComment(e.target.value)}
                  placeholder="Share your learning experience..."
                  className="w-full rounded bg-black border border-gold/25 p-2.5 font-sans text-xs text-white focus:border-gold focus:outline-none resize-none"
                />
                <button
                  type="submit"
                  className="w-full py-1.5 rounded bg-gold text-black font-mono text-[10px] font-bold uppercase hover:bg-gold-light transition-all cursor-pointer"
                >
                  Submit Shariah Review
                </button>
              </div>
            </form>
          </div>

        </div>

      </div>

    </div>
  );
}
