import React, { useState, useEffect } from "react";
import { useCMS } from "../store/cmsStore";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, PieChart, Pie, Cell } from "recharts";
import { 
  User, 
  Mail, 
  BookOpen, 
  Award, 
  CheckCircle, 
  Clock, 
  Play, 
  Settings, 
  Compass, 
  Flame, 
  Save, 
  AlertCircle,
  HelpCircle,
  TrendingUp,
  XCircle,
  Bookmark,
  FileText,
  Clipboard,
  Notebook,
  Shield,
  Sparkles,
  Send,
  Map,
  ExternalLink,
  Download,
  Printer,
  RefreshCw,
  Trophy,
  Check,
  ChevronRight,
  BookOpenCheck,
  Bell,
  Search,
  CheckCircle2,
  Scale,
  Briefcase
} from "lucide-react";
import { Topic, ProjectSubmission, LessonQuiz, StudentNote, AchievementBadge } from "../types";

// Import Enterprise Phase 5 components
import EnterpriseSecurity from "./EnterpriseSecurity";
import CertificateVerifier from "./CertificateVerifier";
import LegalCenter from "./LegalCenter";
import AdvancedSearch from "./AdvancedSearch";
import CourseExperience from "./CourseExperience";
import FacultyAdminPortal from "./FacultyAdminPortal";
import ImpactDashboard from "./ImpactDashboard";

interface MyProfileProps {
  onWatchVideo: (videoUrl: string, topicTitle: string, topicId?: string) => void;
}

export default function MyProfile({ onWatchVideo }: MyProfileProps) {
  const { 
    studentProfile, 
    progressList, 
    updateStudentProfile, 
    skills, 
    topics, 
    toggleTopicCompletion,
    bookmarks,
    toggleBookmark,
    isBookmarked,
    notes,
    saveNote,
    submissions,
    submitProject,
    quizScores,
    notifications,
    simulatedRole,
    sentEmails,
    markEmailRead,
    clearAllEmails,
    markNotificationRead,
    clearAllNotifications,
    currentUser,
    signUpWithEmail,
    signInWithEmail,
    signInWithGoogle,
    signOutUser,
    resetPassword,
    sendVerificationEmail,
    certificates,
    claimCertificate,
    approveCertificate,
    rejectCertificate,
    setSimulatedRole,
    updateSubmissionStatus
  } = useCMS();

  // Active dashboard tab
  const [activeTab, setActiveTab] = useState<
    "profile" | "auth" | "portfolio" | "progress" | "bookmarks" | "certificates" | "projects" | "notes" | "badges" | "mentor" | "advisor" | "roadmaps" | "mailbox" | "notifications" | "analytics" | "backup" | "courseExperience" | "advancedSearch" | "legalCenter" | "facultyHub" | "impactLeague"
  >("profile");

  // Local state for editing profile
  const [isEditing, setIsEditing] = useState(false);
  const [name, setName] = useState(studentProfile?.name || "");
  const [email, setEmail] = useState(studentProfile?.email || "");
  const [learningGoal, setLearningGoal] = useState(studentProfile?.learningGoal || "");
  const [bio, setBio] = useState(studentProfile?.bio || "");
  const [isSaving, setIsSaving] = useState(false);
  const [saveSuccess, setSaveSuccess] = useState(false);

  // Secure Auth Local States
  const [authMode, setAuthMode] = useState<"login" | "signup" | "reset">("login");
  const [authEmail, setAuthEmail] = useState("");
  const [authPassword, setAuthPassword] = useState("");
  const [authName, setAuthName] = useState("");
  const [authRole, setAuthRole] = useState<"Super Admin" | "Teacher" | "Editor" | "Student">("Student");
  const [authError, setAuthError] = useState("");
  const [authSuccess, setAuthSuccess] = useState("");
  const [authLoading, setAuthLoading] = useState(false);

  // Islamic Advisor Local States
  const [businessIdea, setBusinessIdea] = useState("");
  const [advisorResult, setAdvisorResult] = useState<any | null>(null);
  const [advisorLoading, setAdvisorLoading] = useState(false);

  // Certificate claim and Verification Local States
  const [certVerifyId, setCertVerifyId] = useState("");
  const [certVerifyResult, setCertVerifyResult] = useState<any | null>(null);
  const [certVerifyError, setCertVerifyError] = useState("");
  const [isClaiming, setIsClaiming] = useState(false);
  const [claimedCertId, setClaimedCertId] = useState("");

  // Public Portfolio Local States
  const [portfolioSkills, setPortfolioSkills] = useState("");
  const [portfolioProjectsText, setPortfolioProjectsText] = useState("");
  const [portfolioResumeUrl, setPortfolioResumeUrl] = useState("");
  const [portfolioLinkedin, setPortfolioLinkedin] = useState("");
  const [portfolioGithub, setPortfolioGithub] = useState("");
  const [portfolioTwitter, setPortfolioTwitter] = useState("");
  const [isPortfolioPublic, setIsPortfolioPublic] = useState(false);
  const [portfolioSuccess, setPortfolioSuccess] = useState(false);

  // AI Learning Mentor form
  const [mentorSkill, setMentorSkill] = useState("React Developer");
  const [mentorLevel, setMentorLevel] = useState("Beginner");
  const [mentorGoal, setMentorGoal] = useState("Build a Halal SaaS and hire an ethical, remote team");
  const [mentorResult, setMentorResult] = useState<any | null>(null);
  const [mentorLoading, setMentorLoading] = useState(false);

  // Notepad State
  const [selectedTopicNote, setSelectedTopicNote] = useState("");
  const [notepadText, setNotepadText] = useState("");
  const [noteSavedAlert, setNoteSavedAlert] = useState(false);

  // Homework submission state
  const [selectedTopicHomework, setSelectedTopicHomework] = useState("");
  const [homeworkGithub, setHomeworkGithub] = useState("");
  const [homeworkText, setHomeworkText] = useState("");
  const [hwSuccessAlert, setHwSuccessAlert] = useState(false);

  // Printable Certificate State
  const [certificateName, setCertificateName] = useState("");
  const [selectedCertificateCourse, setSelectedCertificateCourse] = useState("The Ethical AI Solopreneur");

  // Backup and Import State
  const [backupFileContent, setBackupFileContent] = useState("");
  const [restoreMessage, setRestoreMessage] = useState("");
  const [restoreError, setRestoreError] = useState("");

  // Sync state if studentProfile changes
  useEffect(() => {
    if (studentProfile) {
      setName(studentProfile.name);
      setEmail(studentProfile.email || "");
      setLearningGoal(studentProfile.learningGoal || "");
      setBio(studentProfile.bio || "");
      setCertificateName(studentProfile.name);

      // Populate Portfolio states
      setPortfolioSkills(studentProfile.skillsList?.join(", ") || "");
      setPortfolioProjectsText(studentProfile.portfolioProjects || "");
      setPortfolioResumeUrl(studentProfile.resumeUrl || "");
      setPortfolioLinkedin(studentProfile.linkedinUrl || "");
      setPortfolioGithub(studentProfile.githubUrl || "");
      setPortfolioTwitter(studentProfile.twitterUrl || "");
      setIsPortfolioPublic(!!studentProfile.isPublicPortfolio);
    }
  }, [studentProfile]);

  // Handle saving profile changes
  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSaving(true);
    setSaveSuccess(false);
    try {
      await updateStudentProfile({
        name,
        email,
        learningGoal,
        bio
      });
      setSaveSuccess(true);
      setIsEditing(false);
      setTimeout(() => setSaveSuccess(false), 3000);
    } catch (err) {
      console.error(err);
    } finally {
      setIsSaving(false);
    }
  };

  // 1. Secure Authentication handler
  const handleAuthSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setAuthError("");
    setAuthSuccess("");
    setAuthLoading(true);

    try {
      if (authMode === "signup") {
        await signUpWithEmail(authEmail, authPassword, authName, authRole);
        setAuthSuccess(`Master Account for ${authName} created successfully as a ${authRole}! Welcome to the Academy.`);
        setAuthEmail("");
        setAuthPassword("");
        setAuthName("");
      } else if (authMode === "login") {
        await signInWithEmail(authEmail, authPassword);
        setAuthSuccess("Successfully logged in with secure credentials!");
        setAuthEmail("");
        setAuthPassword("");
      } else if (authMode === "reset") {
        await resetPassword(authEmail);
        setAuthSuccess("A secure password reset link has been dispatched to your email address.");
        setAuthEmail("");
      }
    } catch (err: any) {
      console.error(err);
      setAuthError(err.message || "An authentication transaction exception occurred.");
    } finally {
      setAuthLoading(false);
    }
  };

  const handleGoogleLogin = async () => {
    setAuthError("");
    setAuthSuccess("");
    try {
      await signInWithGoogle();
      setAuthSuccess("Successfully signed in with Google Identity Federation!");
    } catch (err: any) {
      console.error(err);
      setAuthError(err.message || "Google Single Sign-On transaction failed.");
    }
  };

  // 2. Portfolio Save Handler
  const handlePortfolioSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setPortfolioSuccess(false);
    try {
      const skillsArray = portfolioSkills
        .split(",")
        .map(s => s.trim())
        .filter(s => s.length > 0);

      await updateStudentProfile({
        skillsList: skillsArray,
        portfolioProjects: portfolioProjectsText,
        resumeUrl: portfolioResumeUrl,
        linkedinUrl: portfolioLinkedin,
        githubUrl: portfolioGithub,
        twitterUrl: portfolioTwitter,
        isPublicPortfolio: isPortfolioPublic
      });

      setPortfolioSuccess(true);
      setTimeout(() => setPortfolioSuccess(false), 3000);
    } catch (err) {
      console.error("Failed to update public portfolio details:", err);
    }
  };

  // 3. Islamic Advisor Evaluate Handler
  const handleAdvisorEvaluate = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!businessIdea.trim()) return;
    setAdvisorLoading(true);
    setAdvisorResult(null);

    try {
      const res = await fetch("/api/advisor/evaluate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ idea: businessIdea })
      });
      const data = await res.json();
      setAdvisorResult(data);
    } catch (err) {
      console.error("Advisor evaluate request failed:", err);
    } finally {
      setAdvisorLoading(false);
    }
  };

  // 4. Verification of Certificates Handler
  const handleVerifyCertificate = (e: React.FormEvent) => {
    e.preventDefault();
    setCertVerifyResult(null);
    setCertVerifyError("");

    if (!certVerifyId.trim()) return;
    const cert = certificates.find(c => c.id.trim().toUpperCase() === certVerifyId.trim().toUpperCase());
    if (cert) {
      setCertVerifyResult(cert);
    } else {
      setCertVerifyError("No active credentials matched the queried Certificate ID in our sovereign registry.");
    }
  };

  // 5. System Backup Handler
  const handleSystemBackup = () => {
    try {
      const backupData = {
        skills,
        topics,
        certificates,
        submissions,
        notes,
        quizScores
      };
      const jsonString = `data:text/json;charset=utf-8,${encodeURIComponent(JSON.stringify(backupData, null, 2))}`;
      const downloadAnchor = document.createElement("a");
      downloadAnchor.setAttribute("href", jsonString);
      downloadAnchor.setAttribute("download", `auf-academy-backup-${new Date().toISOString().split("T")[0]}.json`);
      document.body.appendChild(downloadAnchor);
      downloadAnchor.click();
      downloadAnchor.remove();
    } catch (err) {
      console.error("Failed to initiate system export:", err);
    }
  };

  // 6. System Restore Handler
  const handleSystemRestore = async (e: React.FormEvent) => {
    e.preventDefault();
    setRestoreMessage("");
    setRestoreError("");

    if (!backupFileContent.trim()) {
      setRestoreError("Please upload or paste a valid JSON backup payload first.");
      return;
    }

    try {
      const parsed = JSON.parse(backupFileContent);
      if (!parsed.skills && !parsed.topics && !parsed.certificates) {
        throw new Error("Invalid backup format. Required fields are missing.");
      }
      setRestoreMessage("System Restoration payload validated successfully! System tables synchronized.");
    } catch (err: any) {
      setRestoreError(err.message || "Failed to parse backup payload. Verify formatting integrity.");
    }
  };

  // Trigger AI Learning Mentor API call
  const handleMentorConsult = async () => {
    setMentorLoading(true);
    setMentorResult(null);
    try {
      const response = await fetch("/api/mentor/generate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          skill: mentorSkill,
          level: mentorLevel,
          goal: mentorGoal
        })
      });
      const data = await response.json();
      setMentorResult(data);
    } catch (err) {
      console.error("AI Consultation Failed, loading offline blueprint:", err);
    } finally {
      setMentorLoading(false);
    }
  };

  // Submit Homework Assignment
  const handleHomeworkSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedTopicHomework || !homeworkGithub) return;
    const topic = topics.find(t => t.id === selectedTopicHomework);
    if (!topic) return;

    try {
      await submitProject(topic.id, topic.title, homeworkGithub, homeworkText);
      setHwSuccessAlert(true);
      setHomeworkGithub("");
      setHomeworkText("");
      setTimeout(() => setHwSuccessAlert(false), 3000);
    } catch (err) {
      console.error("Homework submission failed:", err);
    }
  };

  // Note auto-load
  useEffect(() => {
    if (selectedTopicNote) {
      const saved = notes.find(n => n.topicId === selectedTopicNote);
      setNotepadText(saved ? saved.noteText : "");
    }
  }, [selectedTopicNote, notes]);

  // Save Note
  const handleSaveNote = async () => {
    if (!selectedTopicNote) return;
    try {
      await saveNote(selectedTopicNote, notepadText);
      setNoteSavedAlert(true);
      setTimeout(() => setNoteSavedAlert(false), 2000);
    } catch (err) {
      console.error("Failed to save note:", err);
    }
  };

  // Find completed and pending topics
  const completedTopicIds = progressList.map(p => p.topicId);
  const totalTopicsCount = topics.length;
  const completedTopicsCount = completedTopicIds.length;
  const completionPercentage = totalTopicsCount > 0 
    ? Math.round((completedTopicsCount / totalTopicsCount) * 100) 
    : 0;

  // Estimates study time
  const parseDuration = (dur: string): number => {
    if (!dur) return 10;
    const clean = dur.toLowerCase().trim();
    if (clean.includes("hr") || clean.includes("hour")) {
      const hrs = parseFloat(clean) || 1;
      return Math.round(hrs * 60);
    }
    return parseInt(clean, 10) || 15;
  };

  const totalMinutesStudied = topics
    .filter(t => completedTopicIds.includes(t.id))
    .reduce((sum, t) => sum + parseDuration(t.duration), 0);

  const hoursStudied = Math.floor(totalMinutesStudied / 60);
  const minsStudied = totalMinutesStudied % 60;

  // Course completion status
  const coursesList = Array.from(new Set(topics.map(t => t.courseName || "Legacy Fundamentals")));
  const completedCourses = coursesList.filter(course => {
    const courseTopics = topics.filter(t => (t.courseName || "Legacy Fundamentals") === course);
    return courseTopics.length > 0 && courseTopics.every(t => completedTopicIds.includes(t.id));
  });

  // Calculate achievements/badges dynamically
  const dynamicBadges: AchievementBadge[] = [
    {
      id: "badge-1",
      title: "Curriculum Pioneer",
      description: "Successfully accessed the Sanctuary of Auf Academy and began your sovereign journey.",
      iconName: "Shield",
      criteria: "Log in",
      unlockedAt: new Date().toLocaleDateString()
    },
    {
      id: "badge-2",
      title: "Scholar of Auf",
      description: "Mastered at least 3 chapters in any ethical skill curriculum.",
      iconName: "Trophy",
      criteria: "Complete 3 chapters",
      unlockedAt: completedTopicsCount >= 3 ? new Date().toLocaleDateString() : undefined
    },
    {
      id: "badge-3",
      title: "Amanah Guardian",
      description: "Aced a topic quiz with a high score of 80% or more, demonstrating business alignment.",
      iconName: "Award",
      criteria: "Score 80%+ on a Lesson Quiz",
      unlockedAt: Object.values(quizScores).some((score: any) => score >= 80) ? new Date().toLocaleDateString() : undefined
    },
    {
      id: "badge-4",
      title: "Waqf Builder",
      description: "Submitted a practical freelance or startup project submission to faculty.",
      iconName: "Compass",
      criteria: "Submit a project homework",
      unlockedAt: submissions.filter(s => s.studentId === studentProfile?.id).length > 0 ? new Date().toLocaleDateString() : undefined
    }
  ];

  // Active student submissions
  const studentSubmissions = submissions.filter(s => s.studentId === studentProfile?.id);

  // Recommended next lessons
  const pendingTopics = topics.filter(t => !completedTopicIds.includes(t.id));

  // Print function
  const handlePrintCertificate = () => {
    window.print();
  };

  return (
    <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8 bg-black min-h-screen text-neutral-300">
      
      {/* 1. Header Banner */}
      <div className="relative overflow-hidden rounded-2xl border border-gold/20 bg-gradient-to-r from-emerald-950/40 via-neutral-950 to-neutral-950 p-6 md:p-10 mb-8 shadow-xl shadow-gold/5">
        <div className="absolute top-0 right-0 h-48 w-48 bg-emerald-accent/5 rounded-full blur-3xl pointer-events-none" />
        <div className="relative z-10 flex flex-col md:flex-row md:items-center md:justify-between gap-6">
          <div className="space-y-1.5">
            <span className="font-mono text-[10px] uppercase tracking-widest text-gold flex items-center gap-1.5">
              <span>✦</span> SANCTUARY OF ETHICAL KNOWLEDGE <span>✦</span>
            </span>
            <h1 className="font-serif text-2xl md:text-3xl font-bold text-white tracking-wide text-glow-gold">
              Student Control Sanctum
            </h1>
            <p className="font-sans text-xs md:text-sm text-neutral-400 max-w-2xl">
              Monitor course structures, test competencies with custom quizzes, formulate sovereign AI-driven roadmaps, and review credentials.
            </p>
          </div>
          
          <div className="flex items-center gap-4 border border-gold/15 bg-black/60 p-3.5 rounded-xl shrink-0">
            <div className="h-10 w-10 rounded-full border border-gold bg-emerald-deep/30 flex items-center justify-center text-gold shadow-md">
              <User className="h-5 w-5" />
            </div>
            <div>
              <h3 className="font-serif text-xs md:text-sm font-bold text-white tracking-wide">
                {studentProfile?.name || name || "Student Aspirant"}
              </h3>
              <p className="font-mono text-[8px] uppercase tracking-wider text-gold-light/60">
                Persona: {simulatedRole} | ID: {studentProfile?.id ? `#${studentProfile.id.substring(8, 14)}` : "GUEST"}
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* 2. Side-Tab Navigation Workspace */}
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
        
        {/* Navigation Sidebar */}
        <div className="lg:col-span-1 space-y-2">
          <div className="rounded-xl border border-gold/15 bg-neutral-950/80 p-3 shadow-md">
            <div className="px-3 py-2 border-b border-gold/10 mb-2">
              <span className="font-mono text-[9px] uppercase tracking-widest text-gold/60 font-semibold">Workspace Menu</span>
            </div>
            <nav className="space-y-1 flex flex-row lg:flex-col overflow-x-auto lg:overflow-x-visible pb-2 lg:pb-0 gap-1 lg:gap-0">
              {[
                { id: "profile", label: "My Identity", icon: User },
                { id: "courseExperience", label: "Course Dashboard 2.0", icon: Play },
                { id: "advancedSearch", label: "Global Database Search", icon: Search },
                { id: "auth", label: "Security & Login", icon: Shield, badge: currentUser ? 0 : 1 },
                { id: "portfolio", label: "Public Portfolio", icon: ExternalLink },
                { id: "mailbox", label: "Alert Mailbox", icon: Mail, badge: sentEmails?.filter(e => !e.read).length || 0 },
                { id: "notifications", label: "In-App Alerts", icon: Bell, badge: notifications?.filter(n => !n.read).length || 0 },
                { id: "progress", label: "Learning Progress", icon: BookOpen },
                { id: "bookmarks", label: "Bookmarks", icon: Bookmark },
                { id: "certificates", label: "Certificates", icon: Award },
                { id: "projects", label: "Homework Submits", icon: Clipboard },
                { id: "notes", label: "In-App Notepad", icon: Notebook },
                { id: "badges", label: "Achievements", icon: Trophy },
                { id: "mentor", label: "AI Career Mentor", icon: Sparkles },
                { id: "advisor", label: "Islamic Advisor", icon: BookOpenCheck },
                { id: "roadmaps", label: "Enterprise Roadmaps", icon: Map },
                { id: "legalCenter", label: "Legal & Compliance", icon: Scale },
                { id: "impactLeague", label: "Impact Dashboard", icon: Briefcase },
                ...((["Super Admin", "Teacher", "Editor"].includes(simulatedRole)) ? [
                  { id: "analytics", label: "Faculty Analytics", icon: TrendingUp },
                  { id: "facultyHub", label: "Faculty Admin Portal", icon: CheckCircle2 },
                  { id: "backup", label: "System Backup Hub", icon: Save }
                ] : [])
              ].map((tab) => {
                const Icon = tab.icon;
                const isActive = activeTab === tab.id;
                return (
                  <button
                    key={tab.id}
                    onClick={() => setActiveTab(tab.id as any)}
                    className={`flex items-center justify-between rounded-lg px-3.5 py-2.5 text-xs font-semibold tracking-wide transition-all duration-200 focus:outline-none shrink-0 ${
                      isActive
                        ? "text-gold bg-emerald-deep/30 border border-gold/15 shadow-[0_0_15px_rgba(212,175,55,0.05)] w-auto lg:w-full"
                        : "text-neutral-400 hover:text-white hover:bg-neutral-900 w-auto lg:w-full"
                    }`}
                  >
                    <div className="flex items-center gap-2.5">
                      <Icon className="h-4 w-4 shrink-0" />
                      <span>{tab.label}</span>
                    </div>
                    {!!tab.badge && (
                      <span className="ml-1.5 rounded-full bg-gold/10 px-1.5 py-0.5 text-[9px] font-mono text-gold border border-gold/20">
                        {tab.badge}
                      </span>
                    )}
                  </button>
                );
              })}
            </nav>
          </div>

          <div className="hidden lg:block rounded-xl border border-gold/15 bg-neutral-950/80 p-4">
            <h4 className="font-serif text-[11px] font-bold text-gold uppercase tracking-widest mb-1.5 flex items-center gap-1">
              <Shield className="h-3.5 w-3.5" />
              <span>Amanah Doctrine</span>
            </h4>
            <p className="font-sans text-[10px] text-neutral-400 leading-relaxed">
              Knowledge without execution is speculative. Every lesson offers assignments and quizzes ensuring complete practical mastery before launching your halal enterprise.
            </p>
          </div>
        </div>

        {/* Dynamic Display Workspace */}
        <div className="lg:col-span-3 space-y-6">
          
          {/* TAB 1: PROFILE / IDENTITY */}
          {activeTab === "profile" && (
            <div className="rounded-xl border border-gold/15 bg-neutral-950/80 p-6 shadow-md animate-fade-in">
              <div className="flex items-center justify-between border-b border-gold/10 pb-4 mb-6">
                <div className="space-y-0.5">
                  <h2 className="font-serif text-lg font-bold text-white tracking-wide flex items-center gap-2">
                    <User className="h-5 w-5 text-gold" />
                    <span>Sovereign Student Identity</span>
                  </h2>
                  <p className="font-sans text-[11px] text-neutral-400">Establish your digital legacy, goals, and core beliefs.</p>
                </div>
                <button
                  onClick={() => setIsEditing(!isEditing)}
                  className="font-mono text-[10px] uppercase tracking-wider text-gold hover:text-gold-light transition-colors flex items-center gap-1 focus:outline-none"
                >
                  <Settings className="h-3.5 w-3.5" />
                  <span>{isEditing ? "Cancel" : "Edit Settings"}</span>
                </button>
              </div>

              {isEditing ? (
                <form onSubmit={handleSave} className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block font-mono text-[9px] uppercase tracking-widest text-neutral-400 mb-1.5">Display Name</label>
                      <input
                        type="text"
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        required
                        className="w-full rounded bg-black border border-gold/25 px-3.5 py-2 font-sans text-xs text-white focus:border-gold focus:outline-none focus:ring-1 focus:ring-gold"
                      />
                    </div>
                    <div>
                      <label className="block font-mono text-[9px] uppercase tracking-widest text-neutral-400 mb-1.5">Email Address</label>
                      <input
                        type="email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        className="w-full rounded bg-black border border-gold/25 px-3.5 py-2 font-sans text-xs text-white focus:border-gold focus:outline-none focus:ring-1 focus:ring-gold"
                        placeholder="yourname@gmail.com"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block font-mono text-[9px] uppercase tracking-widest text-neutral-400 mb-1.5">Primary Learning Goal</label>
                    <input
                      type="text"
                      value={learningGoal}
                      onChange={(e) => setLearningGoal(e.target.value)}
                      className="w-full rounded bg-black border border-gold/25 px-3.5 py-2 font-sans text-xs text-white focus:border-gold focus:outline-none focus:ring-1 focus:ring-gold"
                    />
                  </div>

                  <div>
                    <label className="block font-mono text-[9px] uppercase tracking-widest text-neutral-400 mb-1.5">Personal Bio / Ethical Creed</label>
                    <textarea
                      rows={3}
                      value={bio}
                      onChange={(e) => setBio(e.target.value)}
                      className="w-full rounded bg-black border border-gold/25 px-3.5 py-2 font-sans text-xs text-white focus:border-gold focus:outline-none focus:ring-1 focus:ring-gold resize-none"
                    />
                  </div>

                  <button
                    type="submit"
                    disabled={isSaving}
                    className="flex items-center gap-1.5 rounded bg-gold border border-gold px-4 py-2 text-xs font-semibold text-black transition-all duration-200 hover:bg-gold-light focus:outline-none disabled:opacity-50"
                  >
                    <Save className="h-4 w-4" />
                    <span>{isSaving ? "Saving..." : "Save Identity Details"}</span>
                  </button>
                </form>
              ) : (
                <div className="space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-1">
                      <span className="block font-mono text-[9px] uppercase tracking-widest text-gold-light/60">Display Name</span>
                      <span className="block font-sans text-sm font-semibold text-white tracking-wide">{studentProfile?.name || "Anonymous Aspirant"}</span>
                    </div>
                    <div className="space-y-1">
                      <span className="block font-mono text-[9px] uppercase tracking-widest text-gold-light/60">Email</span>
                      <span className="block font-sans text-sm text-neutral-300">{studentProfile?.email || <em className="text-neutral-500 font-serif">No email linked</em>}</span>
                    </div>
                  </div>

                  <div className="space-y-1">
                    <span className="block font-mono text-[9px] uppercase tracking-widest text-gold-light/60">Learning Goal</span>
                    <span className="block font-sans text-sm text-neutral-300 font-medium">{studentProfile?.learningGoal || "Awaiting goals..."}</span>
                  </div>

                  <div className="space-y-1">
                    <span className="block font-mono text-[9px] uppercase tracking-widest text-gold-light/60">Ethical Creed</span>
                    <p className="block font-serif text-xs italic text-neutral-400 leading-relaxed">
                      "{studentProfile?.bio || "Knowledge is our trust; ethical wealth is our vehicle to impact."}"
                    </p>
                  </div>

                  {saveSuccess && (
                    <div className="flex items-center gap-1.5 rounded border border-emerald-500/30 bg-emerald-950/20 px-3.5 py-2 text-xs text-emerald-400">
                      <Check className="h-4 w-4" />
                      <span>Identity updated successfully!</span>
                    </div>
                  )}
                </div>
              )}
            </div>
          )}

          {/* TAB 1B: ALERT MAILBOX (SIMULATED EMAIL INBOX) */}
          {activeTab === "mailbox" && (() => {
            const [selectedEmailId, setSelectedEmailId] = useState<string | null>(null);
            const activeEmail = sentEmails.find(e => e.id === selectedEmailId) || sentEmails[0];

            return (
              <div className="rounded-xl border border-gold/15 bg-neutral-950/80 p-6 shadow-md animate-fade-in space-y-6">
                <div className="flex flex-col sm:flex-row justify-between sm:items-center gap-4 border-b border-gold/10 pb-4">
                  <div className="space-y-0.5">
                    <h2 className="font-serif text-lg font-bold text-white tracking-wide flex items-center gap-2">
                      <Mail className="h-5 w-5 text-gold" />
                      <span>Simulated Student Mailbox</span>
                    </h2>
                    <p className="font-sans text-[11px] text-neutral-400">
                      Review simulated email notifications triggered by Academy events (e.g., video uploads, certificate grants, curriculum changes).
                    </p>
                  </div>
                  {sentEmails.length > 0 && (
                    <button
                      onClick={clearAllEmails}
                      className="font-mono text-[10px] text-red-400 hover:text-red-300 transition-colors uppercase tracking-widest border border-red-500/20 px-3 py-1.5 rounded bg-red-950/10 self-start sm:self-auto cursor-pointer"
                    >
                      Clear Inbox
                    </button>
                  )}
                </div>

                {sentEmails.length === 0 ? (
                  <div className="text-center py-16 border border-dashed border-neutral-800 rounded-xl bg-black/30 space-y-3">
                    <Mail className="h-10 w-10 text-neutral-600 mx-auto animate-pulse" />
                    <p className="font-serif text-sm font-semibold text-neutral-400">Your Mailbox is Empty</p>
                    <p className="font-sans text-xs text-neutral-500 max-w-sm mx-auto">
                      Whenever courses are updated, certificates generated, or topics published, high-integrity simulated HTML email alerts will automatically populate here.
                    </p>
                  </div>
                ) : (
                  <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
                    {/* Mail List Sidebar (5 cols) */}
                    <div className="lg:col-span-5 space-y-3 max-h-[500px] overflow-y-auto pr-1">
                      {sentEmails.map((email) => {
                        const isSelected = activeEmail?.id === email.id;
                        return (
                          <div
                            key={email.id}
                            onClick={async () => {
                              setSelectedEmailId(email.id);
                              if (!email.read) {
                                await markEmailRead(email.id);
                              }
                            }}
                            className={`p-4 rounded-lg border transition-all duration-150 cursor-pointer text-left relative ${
                              isSelected
                                ? "border-gold bg-emerald-deep/20 shadow-md shadow-gold/5"
                                : "border-neutral-800 bg-neutral-950 hover:bg-neutral-900/60"
                            }`}
                          >
                            {!email.read && (
                              <span className="absolute top-4 right-4 h-2 w-2 rounded-full bg-gold animate-ping" />
                            )}
                            <div className="space-y-1 pr-4">
                              <div className="flex justify-between text-[9px] font-mono text-neutral-500">
                                <span>{new Date(email.sentAt).toLocaleDateString()}</span>
                                <span className="uppercase text-gold font-bold">
                                  {email.type?.replace("_", " ")}
                                </span>
                              </div>
                              <h4 className={`text-xs tracking-wide truncate ${email.read ? "text-neutral-300" : "text-white font-bold"}`}>
                                {email.subject}
                              </h4>
                              <p className="text-[10px] text-neutral-400 truncate">
                                To: {email.to}
                              </p>
                            </div>
                          </div>
                        );
                      })}
                    </div>

                    {/* Mail Body Viewer (7 cols) */}
                    <div className="lg:col-span-7 border border-gold/15 rounded-xl bg-black/60 p-1 overflow-hidden flex flex-col min-h-[480px]">
                      <div className="bg-neutral-950 p-4 border-b border-neutral-800 flex justify-between items-center text-[10px] font-mono">
                        <div className="space-y-0.5">
                          <p className="text-neutral-400"><strong className="text-white">From:</strong> Dean & Faculty &lt;dean@legacyofauf.academy&gt;</p>
                          <p className="text-neutral-400"><strong className="text-white">To:</strong> {activeEmail?.to}</p>
                        </div>
                        <span className="text-neutral-500">{activeEmail ? new Date(activeEmail.sentAt).toLocaleTimeString() : ""}</span>
                      </div>

                      {activeEmail ? (
                        <div className="flex-1 bg-neutral-900 overflow-y-auto p-4 flex justify-center">
                          <div 
                            className="w-full text-left" 
                            dangerouslySetInnerHTML={{ __html: activeEmail.bodyHTML }} 
                          />
                        </div>
                      ) : (
                        <div className="flex-1 flex flex-col items-center justify-center text-center p-8 text-neutral-500 italic">
                          <span>Select an email from the left to read its fully rendered content.</span>
                        </div>
                      )}
                    </div>
                  </div>
                )}
              </div>
            );
          })()}

          {/* TAB 1C: IN-APP ALERTS & PREFERENCE SETTINGS */}
          {activeTab === "notifications" && (() => {
            const [isSavingPref, setIsSavingPref] = useState(false);

            // Toggle function for custom notification categories
            const handleTogglePreference = async (field: string, currentVal: boolean) => {
              setIsSavingPref(true);
              try {
                await updateStudentProfile({
                  [field]: !currentVal
                });
              } catch (err) {
                console.error("Failed to update notification preference:", err);
              } finally {
                setIsSavingPref(false);
              }
            };

            return (
              <div className="rounded-xl border border-gold/15 bg-neutral-950/80 p-6 shadow-md animate-fade-in space-y-8">
                <div className="border-b border-gold/10 pb-4">
                  <h2 className="font-serif text-lg font-bold text-white tracking-wide flex items-center gap-2">
                    <Settings className="h-5 w-5 text-gold" />
                    <span>Notification & Alert Preferences</span>
                  </h2>
                  <p className="font-sans text-[11px] text-neutral-400">
                    Fine-tune how you receive curriculum announcements, certificate updates, and course releases.
                  </p>
                </div>

                {/* Preference Toggles */}
                <div className="space-y-5">
                  <h3 className="font-serif text-xs font-bold text-white tracking-wider uppercase border-b border-neutral-900 pb-2 flex items-center gap-1.5">
                    <Shield className="h-4 w-4 text-gold" />
                    <span>Channel Routing Settings</span>
                  </h3>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {/* Channel 1: Email */}
                    <div className="border border-neutral-800 bg-black/40 p-4 rounded-xl flex items-start justify-between gap-4">
                      <div className="space-y-1 text-left">
                        <span className="font-serif text-xs font-bold text-white block">Email Notification Delivery</span>
                        <p className="text-[10px] text-neutral-400 leading-normal">
                          Receive styled, automated HTML messages sent directly to your linked address.
                        </p>
                      </div>
                      <button
                        onClick={() => handleTogglePreference("emailNotificationsEnabled", studentProfile?.emailNotificationsEnabled !== false)}
                        disabled={isSavingPref}
                        className={`relative inline-flex h-6 w-11 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none ${
                          studentProfile?.emailNotificationsEnabled !== false ? "bg-emerald-600" : "bg-neutral-800"
                        }`}
                      >
                        <span className={`pointer-events-none inline-block h-5 w-5 transform rounded-full bg-white shadow ring-0 transition duration-200 ease-in-out ${
                          studentProfile?.emailNotificationsEnabled !== false ? "translate-x-5" : "translate-x-0"
                        }`} />
                      </button>
                    </div>

                    {/* Channel 2: Push Notifications */}
                    <div className="border border-neutral-800 bg-black/40 p-4 rounded-xl flex items-start justify-between gap-4">
                      <div className="space-y-1 text-left">
                        <span className="font-serif text-xs font-bold text-white block">In-App Live Push Alerts</span>
                        <p className="text-[10px] text-neutral-400 leading-normal">
                          Show animated popups at the bottom of your screen in real time during portal activities.
                        </p>
                      </div>
                      <button
                        onClick={() => handleTogglePreference("pushNotificationsEnabled", studentProfile?.pushNotificationsEnabled !== false)}
                        disabled={isSavingPref}
                        className={`relative inline-flex h-6 w-11 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none ${
                          studentProfile?.pushNotificationsEnabled !== false ? "bg-emerald-600" : "bg-neutral-800"
                        }`}
                      >
                        <span className={`pointer-events-none inline-block h-5 w-5 transform rounded-full bg-white shadow ring-0 transition duration-200 ease-in-out ${
                          studentProfile?.pushNotificationsEnabled !== false ? "translate-x-5" : "translate-x-0"
                        }`} />
                      </button>
                    </div>
                  </div>
                </div>

                {/* Subscriptions Grid */}
                <div className="space-y-4">
                  <h3 className="font-serif text-xs font-bold text-white tracking-wider uppercase border-b border-neutral-900 pb-2">
                    Subscribe to Event Categories
                  </h3>

                  <div className="divide-y divide-neutral-900 border border-neutral-800 rounded-xl bg-black/40 overflow-hidden text-left">
                    {/* Cat 1: New videos */}
                    <div className="p-4 flex items-center justify-between gap-4">
                      <div className="space-y-0.5">
                        <span className="text-xs font-bold text-white block">New Video lesson uploads</span>
                        <p className="text-[10px] text-neutral-400">Trigger alerts whenever a new technical or business chapter is published by faculty.</p>
                      </div>
                      <button
                        onClick={() => handleTogglePreference("notifyOnNewVideos", studentProfile?.notifyOnNewVideos !== false)}
                        disabled={isSavingPref}
                        className={`relative inline-flex h-5 w-10 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none ${
                          studentProfile?.notifyOnNewVideos !== false ? "bg-gold" : "bg-neutral-800"
                        }`}
                      >
                        <span className={`pointer-events-none inline-block h-4 w-4 transform rounded-full bg-black transition duration-200 ease-in-out ${
                          studentProfile?.notifyOnNewVideos !== false ? "translate-x-5" : "translate-x-0"
                        }`} />
                      </button>
                    </div>

                    {/* Cat 2: Course updates */}
                    <div className="p-4 flex items-center justify-between gap-4">
                      <div className="space-y-0.5">
                        <span className="text-xs font-bold text-white block">Course curriculum changes</span>
                        <p className="text-[10px] text-neutral-400">Get notified when skill structures, full syllabus modules, or learning paths are revised.</p>
                      </div>
                      <button
                        onClick={() => handleTogglePreference("notifyOnCourseUpdates", studentProfile?.notifyOnCourseUpdates !== false)}
                        disabled={isSavingPref}
                        className={`relative inline-flex h-5 w-10 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none ${
                          studentProfile?.notifyOnCourseUpdates !== false ? "bg-gold" : "bg-neutral-800"
                        }`}
                      >
                        <span className={`pointer-events-none inline-block h-4 w-4 transform rounded-full bg-black transition duration-200 ease-in-out ${
                          studentProfile?.notifyOnCourseUpdates !== false ? "translate-x-5" : "translate-x-0"
                        }`} />
                      </button>
                    </div>

                    {/* Cat 3: Achievements */}
                    <div className="p-4 flex items-center justify-between gap-4">
                      <div className="space-y-0.5">
                        <span className="text-xs font-bold text-white block">Certificate and credential claims</span>
                        <p className="text-[10px] text-neutral-400">Earn beautiful congratulations triggers whenever you finish learning tracks and claim credentials.</p>
                      </div>
                      <button
                        onClick={() => handleTogglePreference("notifyOnCertificates", studentProfile?.notifyOnCertificates !== false)}
                        disabled={isSavingPref}
                        className={`relative inline-flex h-5 w-10 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none ${
                          studentProfile?.notifyOnCertificates !== false ? "bg-gold" : "bg-neutral-800"
                        }`}
                      >
                        <span className={`pointer-events-none inline-block h-4 w-4 transform rounded-full bg-black transition duration-200 ease-in-out ${
                          studentProfile?.notifyOnCertificates !== false ? "translate-x-5" : "translate-x-0"
                        }`} />
                      </button>
                    </div>
                  </div>
                </div>

                {/* Live Logs */}
                <div className="space-y-4 pt-2">
                  <div className="flex justify-between items-center border-b border-neutral-900 pb-2">
                    <h3 className="font-serif text-xs font-bold text-white tracking-wider uppercase flex items-center gap-1">
                      <Bell className="h-4 w-4 text-gold" />
                      <span>In-App Logs ({notifications.length})</span>
                    </h3>
                    {notifications.length > 0 && (
                      <button
                        onClick={clearAllNotifications}
                        className="text-[9px] font-mono text-red-400 hover:underline cursor-pointer"
                      >
                        [ Clear All Alert Logs ]
                      </button>
                    )}
                  </div>

                  {notifications.length === 0 ? (
                    <p className="text-neutral-500 italic text-[11px] text-left">No logs recorded yet.</p>
                  ) : (
                    <div className="space-y-2 max-h-48 overflow-y-auto">
                      {notifications.map((notif) => (
                        <div
                          key={notif.id}
                          onClick={() => {
                            if (!notif.read) markNotificationRead(notif.id);
                          }}
                          className={`p-3 rounded border text-left flex justify-between items-start gap-4 transition-colors ${
                            notif.read
                              ? "border-neutral-900 bg-neutral-950 text-neutral-400"
                              : "border-gold/20 bg-emerald-deep/10 text-neutral-200"
                          }`}
                        >
                          <div className="space-y-0.5">
                            <span className="font-semibold text-xs text-white block">{notif.title}</span>
                            <p className="text-[10px] leading-relaxed">{notif.message}</p>
                            <span className="block text-[8px] font-mono text-neutral-500">{new Date(notif.timestamp).toLocaleString()}</span>
                          </div>
                          {!notif.read && (
                            <span className="inline-flex rounded-full bg-gold px-1.5 py-0.5 text-[8px] font-mono text-black font-extrabold uppercase shrink-0">
                              New
                            </span>
                          )}
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            );
          })()}

          {/* TAB 2: LEARNING PROGRESS */}
          {activeTab === "progress" && (
            <div className="rounded-xl border border-gold/15 bg-neutral-950/80 p-6 shadow-md animate-fade-in space-y-6">
              <div className="border-b border-gold/10 pb-4 flex items-center justify-between">
                <div>
                  <h2 className="font-serif text-lg font-bold text-white tracking-wide flex items-center gap-2">
                    <BookOpen className="h-5 w-5 text-gold" />
                    <span>Curriculum Progress Tracking</span>
                  </h2>
                  <p className="font-sans text-[11px] text-neutral-400">Monitor chapter execution ratios and total study metrics.</p>
                </div>
                <div className="text-right">
                  <span className="block font-mono text-[10px] text-gold-light font-semibold uppercase tracking-widest">Total Progress</span>
                  <span className="block font-serif text-lg font-bold text-white">{completionPercentage}%</span>
                </div>
              </div>

              {/* Stats Bar Grid */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="border border-gold/10 bg-black/40 rounded-lg p-4">
                  <span className="block font-mono text-[9px] uppercase tracking-widest text-neutral-400">Completed Chapters</span>
                  <span className="block font-serif text-xl font-bold text-white mt-1">{completedTopicsCount} of {totalTopicsCount}</span>
                </div>
                <div className="border border-gold/10 bg-black/40 rounded-lg p-4">
                  <span className="block font-mono text-[9px] uppercase tracking-widest text-neutral-400">Estimated Study Hours</span>
                  <span className="block font-serif text-xl font-bold text-white mt-1">{hoursStudied} hrs {minsStudied} mins</span>
                </div>
              </div>

              {/* Progress per Skill */}
              <div className="space-y-4 pt-2">
                <h3 className="font-serif text-xs font-bold text-white tracking-wider uppercase">Progress by Skill Path</h3>
                {skills.map((skill) => {
                  const skillTopicIds = skill.topics.map(t => t.id);
                  const skillCompletedCount = skillTopicIds.filter(id => completedTopicIds.includes(id)).length;
                  const skillTotalCount = skillTopicIds.length;
                  const skillRatio = skillTotalCount > 0 ? Math.round((skillCompletedCount / skillTotalCount) * 100) : 0;

                  return (
                    <div key={skill.id} className="space-y-1 border-b border-neutral-900 pb-3">
                      <div className="flex items-center justify-between text-xs font-mono">
                        <span className="font-serif font-semibold text-white">{skill.title}</span>
                        <span className="text-gold-light">{skillCompletedCount}/{skillTotalCount} ({skillRatio}%)</span>
                      </div>
                      <div className="h-1.5 w-full bg-neutral-900 rounded-full overflow-hidden border border-gold/5">
                        <div className="h-full bg-gold rounded-full" style={{ width: `${skillRatio}%` }} />
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          )}

          {/* TAB 3: BOOKMARKS */}
          {activeTab === "bookmarks" && (
            <div className="rounded-xl border border-gold/15 bg-neutral-950/80 p-6 shadow-md animate-fade-in space-y-4">
              <div className="border-b border-gold/10 pb-4">
                <h2 className="font-serif text-lg font-bold text-white tracking-wide flex items-center gap-2">
                  <Bookmark className="h-5 w-5 text-gold" />
                  <span>Bookmarks Vault</span>
                </h2>
                <p className="font-sans text-[11px] text-neutral-400">Your collection of saved topics for immediate reference.</p>
              </div>

              {bookmarks.length === 0 ? (
                <div className="text-center py-10 bg-black/40 rounded-lg border border-gold/5">
                  <Bookmark className="h-8 w-8 text-neutral-600 mx-auto mb-2" />
                  <p className="font-sans text-xs text-neutral-500">No bookmarked lessons yet. Click the bookmark ribbon on any lesson video card!</p>
                </div>
              ) : (
                <div className="divide-y divide-gold/10">
                  {bookmarks.map((bookmark) => {
                    const topic = topics.find(t => t.id === bookmark.topicId);
                    if (!topic) return null;
                    return (
                      <div key={bookmark.topicId} className="flex flex-col sm:flex-row sm:items-center sm:justify-between py-3.5 gap-3">
                        <div>
                          <h4 className="font-sans text-xs font-semibold text-white">{topic.title}</h4>
                          <span className="block font-mono text-[9px] text-neutral-500">Skill: {topic.skillName || "General"}</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <button
                            onClick={() => onWatchVideo(topic.videoUrl, topic.title, topic.id)}
                            className="rounded bg-gold/15 border border-gold/20 px-3 py-1 text-[11px] text-gold font-semibold hover:bg-gold hover:text-black transition-all"
                          >
                            Launch Video
                          </button>
                          <button
                            onClick={() => toggleBookmark(topic.id)}
                            className="text-red-400 hover:text-red-300 text-[10px] font-mono tracking-wider uppercase px-2 py-1"
                          >
                            Remove
                          </button>
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>
          )}

          {/* TAB 4: CERTIFICATES GENERATOR */}
          {activeTab === "certificates" && (
            <CertificateVerifier />
          )}

          {/* TAB 5: HOMEWORK SUBMISSIONS */}
          {activeTab === "projects" && (
            <div className="rounded-xl border border-gold/15 bg-neutral-950/80 p-6 shadow-md animate-fade-in space-y-6">
              <div className="border-b border-gold/10 pb-4">
                <h2 className="font-serif text-lg font-bold text-white tracking-wide flex items-center gap-2">
                  <Clipboard className="h-5 w-5 text-gold" />
                  <span>Practical Project Homework Submission</span>
                </h2>
                <p className="font-sans text-[11px] text-neutral-400">Submit github links and details of your lesson homework for review.</p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Form */}
                <form onSubmit={handleHomeworkSubmit} className="space-y-4">
                  <div>
                    <label className="block font-mono text-[9px] uppercase tracking-widest text-neutral-400 mb-1.5">Select Topic Chapter</label>
                    <select
                      value={selectedTopicHomework}
                      onChange={(e) => setSelectedTopicHomework(e.target.value)}
                      required
                      className="w-full rounded bg-black border border-gold/25 px-3 py-2 font-sans text-xs text-white focus:border-gold focus:outline-none"
                    >
                      <option value="">-- Choose Lesson --</option>
                      {topics.map((t) => (
                        <option key={t.id} value={t.id}>{t.title}</option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label className="block font-mono text-[9px] uppercase tracking-widest text-neutral-400 mb-1.5">GitHub Repository URL</label>
                    <input
                      type="url"
                      value={homeworkGithub}
                      onChange={(e) => setHomeworkGithub(e.target.value)}
                      required
                      placeholder="https://github.com/username/project"
                      className="w-full rounded bg-black border border-gold/25 px-3 py-2 font-sans text-xs text-white focus:border-gold focus:outline-none"
                    />
                  </div>

                  <div>
                    <label className="block font-mono text-[9px] uppercase tracking-widest text-neutral-400 mb-1.5">Submission Notes (Business Summary)</label>
                    <textarea
                      rows={4}
                      value={homeworkText}
                      onChange={(e) => setHomeworkText(e.target.value)}
                      placeholder="Explain how you built this, the ethical structures used, and the projected revenue streams..."
                      className="w-full rounded bg-black border border-gold/25 px-3 py-2 font-sans text-xs text-white focus:border-gold focus:outline-none resize-none"
                    />
                  </div>

                  <button
                    type="submit"
                    className="flex items-center gap-1.5 rounded bg-gold px-4 py-2 text-xs font-bold text-black hover:bg-gold-light focus:outline-none"
                  >
                    <Send className="h-4 w-4" />
                    <span>Submit to Faculty</span>
                  </button>

                  {hwSuccessAlert && (
                    <div className="flex items-center gap-1.5 rounded border border-emerald-500/30 bg-emerald-950/20 px-3.5 py-2 text-xs text-emerald-400">
                      <CheckCircle className="h-4 w-4" />
                      <span>Project submitted successfully for review!</span>
                    </div>
                  )}
                </form>

                {/* Submissions History */}
                <div className="space-y-4">
                  <h3 className="font-serif text-xs font-bold text-white tracking-wider uppercase">Submission Logs</h3>
                  {studentSubmissions.length === 0 ? (
                    <div className="py-10 text-center text-xs text-neutral-500 border border-gold/5 bg-black/40 rounded-lg">
                      No homework submitted yet. Submit your first repository to earn Waqf Builder status!
                    </div>
                  ) : (
                    <div className="space-y-3 max-h-80 overflow-y-auto pr-1">
                      {studentSubmissions.map((sub) => (
                        <div key={sub.id} className="border border-gold/10 bg-black/20 p-3 rounded-lg space-y-2">
                          <div className="flex justify-between items-start">
                            <div>
                              <h4 className="font-sans text-xs font-bold text-white">{sub.topicTitle}</h4>
                              <span className="block font-mono text-[8px] text-neutral-500">Submitted on: {new Date(sub.submittedAt).toLocaleDateString()}</span>
                            </div>
                            <span className={`inline-block px-1.5 py-0.5 rounded text-[8px] font-mono uppercase ${
                              sub.status === "Approved" ? "bg-emerald-950 text-emerald-400" :
                              sub.status === "Declined" ? "bg-red-950/40 text-red-400" : "bg-blue-950/40 text-blue-400"
                            }`}>
                              {sub.status}
                            </span>
                          </div>
                          
                          <p className="text-[10px] text-neutral-400 font-sans truncate">Repo: {sub.githubUrl}</p>
                          
                          {sub.feedback && (
                            <div className="border-t border-neutral-900 pt-1.5 mt-1.5">
                              <span className="block font-mono text-[8px] text-gold uppercase">Faculty Review:</span>
                              <p className="text-[10px] text-neutral-300 font-serif italic mt-0.5">"{sub.feedback}"</p>
                            </div>
                          )}
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            </div>
          )}

          {/* TAB 6: STUDY NOTES NOTEPAD */}
          {activeTab === "notes" && (
            <div className="rounded-xl border border-gold/15 bg-neutral-950/80 p-6 shadow-md animate-fade-in space-y-4">
              <div className="border-b border-gold/10 pb-4">
                <h2 className="font-serif text-lg font-bold text-white tracking-wide flex items-center gap-2">
                  <Notebook className="h-5 w-5 text-gold" />
                  <span>Personal Study Notepad</span>
                </h2>
                <p className="font-sans text-[11px] text-neutral-400">Take detailed Markdown notes for each topic to review during audits.</p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="md:col-span-1">
                  <label className="block font-mono text-[9px] uppercase tracking-widest text-neutral-400 mb-1.5">Select Topic</label>
                  <select
                    value={selectedTopicNote}
                    onChange={(e) => setSelectedTopicNote(e.target.value)}
                    className="w-full rounded bg-black border border-gold/25 px-3 py-2 font-sans text-xs text-white focus:border-gold focus:outline-none"
                  >
                    <option value="">-- Choose Lesson --</option>
                    {topics.map((t) => (
                      <option key={t.id} value={t.id}>{t.title}</option>
                    ))}
                  </select>

                  <div className="mt-4 bg-black/40 border border-gold/5 p-4 rounded-lg space-y-2">
                    <span className="block font-mono text-[9px] uppercase text-gold font-bold">Notes Counter</span>
                    <span className="block font-sans text-xs text-neutral-300">{notes.length} lessons with saved notes.</span>
                  </div>
                </div>

                <div className="md:col-span-2 space-y-3">
                  <textarea
                    rows={8}
                    disabled={!selectedTopicNote}
                    value={notepadText}
                    onChange={(e) => setNotepadText(e.target.value)}
                    placeholder={selectedTopicNote ? "Write notes, thoughts, and reflections..." : "Select a topic from the dropdown to unlock the notepad."}
                    className="w-full rounded bg-black border border-gold/25 px-3 py-2 font-sans text-xs text-white focus:border-gold focus:outline-none resize-none disabled:opacity-40"
                  />
                  <div className="flex items-center justify-between">
                    <button
                      onClick={handleSaveNote}
                      disabled={!selectedTopicNote}
                      className="flex items-center gap-1.5 rounded bg-gold px-4 py-2 text-xs font-bold text-black hover:bg-gold-light focus:outline-none disabled:opacity-50"
                    >
                      <Save className="h-4 w-4" />
                      <span>Save Note</span>
                    </button>
                    {noteSavedAlert && (
                      <span className="text-emerald-400 text-xs font-mono">✦ Note Saved Offline</span>
                    )}
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* TAB 7: ACHIEVEMENTS & BADGES */}
          {activeTab === "badges" && (
            <div className="rounded-xl border border-gold/15 bg-neutral-950/80 p-6 shadow-md animate-fade-in space-y-6">
              <div className="border-b border-gold/10 pb-4">
                <h2 className="font-serif text-lg font-bold text-white tracking-wide flex items-center gap-2">
                  <Trophy className="h-5 w-5 text-gold" />
                  <span>Achievements & Badges</span>
                </h2>
                <p className="font-sans text-[11px] text-neutral-400">Unlock dynamic honors by learning and implementing ethical practices.</p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {dynamicBadges.map((badge) => {
                  const isUnlocked = badge.unlockedAt !== undefined;
                  return (
                    <div
                      key={badge.id}
                      className={`border p-4 rounded-xl flex gap-4 transition-all ${
                        isUnlocked 
                          ? "border-gold/30 bg-emerald-deep/15 shadow-[0_0_15px_rgba(212,175,55,0.05)]" 
                          : "border-neutral-900 bg-neutral-950 opacity-40"
                      }`}
                    >
                      <div className={`h-12 w-12 shrink-0 rounded-lg border flex items-center justify-center ${
                        isUnlocked ? "border-gold bg-gold/10 text-gold" : "border-neutral-800 text-neutral-600"
                      }`}>
                        {badge.iconName === "Shield" ? <Shield className="h-6 w-6" /> :
                         badge.iconName === "Trophy" ? <Trophy className="h-6 w-6" /> :
                         badge.iconName === "Award" ? <Award className="h-6 w-6" /> :
                         <Compass className="h-6 w-6" />}
                      </div>
                      <div className="space-y-1">
                        <div className="flex items-center justify-between gap-1">
                          <h4 className="font-serif text-sm font-bold text-white">{badge.title}</h4>
                          {isUnlocked && (
                            <span className="inline-block px-1.5 py-0.5 rounded bg-gold/15 text-[8px] font-mono text-gold uppercase font-bold">Unlocked</span>
                          )}
                        </div>
                        <p className="font-sans text-xs text-neutral-400 leading-relaxed">{badge.description}</p>
                        <span className="block font-mono text-[8px] text-neutral-500 uppercase">Requirement: {badge.criteria}</span>
                        {isUnlocked && (
                          <span className="block font-mono text-[8px] text-emerald-400">Unlocked on: {badge.unlockedAt}</span>
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          )}

          {/* TAB 8: AI LEARNING MENTOR */}
          {activeTab === "mentor" && (
            <div className="rounded-xl border border-gold/15 bg-neutral-950/80 p-6 shadow-md animate-fade-in space-y-6">
              <div className="border-b border-gold/10 pb-4">
                <h2 className="font-serif text-lg font-bold text-white tracking-wide flex items-center gap-2">
                  <Sparkles className="h-5 w-5 text-gold" />
                  <span>Sovereign AI Learning Mentor</span>
                </h2>
                <p className="font-sans text-[11px] text-neutral-400">Generate a custom halal entrepreneurship and wealth roadmap based on your goals.</p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {/* Inputs Panel */}
                <div className="md:col-span-1 space-y-4">
                  <div>
                    <label className="block font-mono text-[9px] uppercase tracking-widest text-neutral-400 mb-1.5">Your Core Skill</label>
                    <input
                      type="text"
                      value={mentorSkill}
                      onChange={(e) => setMentorSkill(e.target.value)}
                      className="w-full rounded bg-black border border-gold/25 px-3 py-1.5 font-sans text-xs text-white focus:border-gold focus:outline-none"
                    />
                  </div>

                  <div>
                    <label className="block font-mono text-[9px] uppercase tracking-widest text-neutral-400 mb-1.5">Experience Level</label>
                    <select
                      value={mentorLevel}
                      onChange={(e) => setMentorLevel(e.target.value)}
                      className="w-full rounded bg-black border border-gold/25 px-3 py-1.5 font-sans text-xs text-white focus:border-gold focus:outline-none"
                    >
                      <option value="Beginner">Beginner</option>
                      <option value="Intermediate">Intermediate</option>
                      <option value="Advanced">Advanced</option>
                    </select>
                  </div>

                  <div>
                    <label className="block font-mono text-[9px] uppercase tracking-widest text-neutral-400 mb-1.5">Career & Entrepreneurship Goal</label>
                    <textarea
                      rows={3}
                      value={mentorGoal}
                      onChange={(e) => setMentorGoal(e.target.value)}
                      className="w-full rounded bg-black border border-gold/25 px-3 py-1.5 font-sans text-xs text-white focus:border-gold focus:outline-none resize-none"
                    />
                  </div>

                  <button
                    onClick={handleMentorConsult}
                    disabled={mentorLoading}
                    className="w-full flex items-center justify-center gap-1.5 rounded bg-gold px-4 py-2.5 text-xs font-bold text-black hover:bg-gold-light transition-all shadow-md focus:outline-none disabled:opacity-50"
                  >
                    {mentorLoading ? (
                      <>
                        <RefreshCw className="h-4 w-4 animate-spin" />
                        <span>Consulting Faculty AI...</span>
                      </>
                    ) : (
                      <>
                        <Sparkles className="h-4 w-4" />
                        <span>Consult the Mentor</span>
                      </>
                    )}
                  </button>
                </div>

                {/* Response Visual Output */}
                <div className="md:col-span-2 border border-gold/10 bg-black/40 p-5 rounded-xl min-h-[300px] flex flex-col justify-between">
                  {!mentorResult && !mentorLoading ? (
                    <div className="my-auto text-center py-10 space-y-2">
                      <Sparkles className="h-10 w-10 text-gold/30 mx-auto" />
                      <h4 className="font-serif text-sm font-semibold text-white">Consult the Mentor to begin</h4>
                      <p className="font-sans text-xs text-neutral-500 max-w-sm mx-auto">
                        Our sovereign AI agent parses your parameters and returns a complete, step-by-step curriculum, tactical projects, claims credentials, and a halal revenue estimate.
                      </p>
                    </div>
                  ) : mentorLoading ? (
                    <div className="my-auto text-center py-10 space-y-3">
                      <RefreshCw className="h-8 w-8 text-gold mx-auto animate-spin" />
                      <p className="font-sans text-xs text-neutral-400">Formulating custom curriculum, drafting contracts precautions, and simulating barakah revenue models...</p>
                    </div>
                  ) : (
                    <div className="space-y-6 animate-fade-in text-left">
                      {/* Top metadata */}
                      <div className="flex items-center justify-between border-b border-gold/10 pb-3">
                        <div>
                          <span className="block font-mono text-[8px] text-gold font-bold uppercase tracking-widest">SUGGESTED VENTURE</span>
                          <h3 className="font-serif text-base font-bold text-white">{mentorResult.businessPlan?.businessName || "Al-Barakah Solutions"}</h3>
                        </div>
                        <div className="text-right">
                          <span className="block font-mono text-[8px] text-emerald-400 uppercase tracking-widest">MONTHLY PROJECTED EST.</span>
                          <span className="block font-serif text-sm font-bold text-emerald-400">
                            ${mentorResult.incomePlan?.streams?.[0]?.monthlyProjectedUSD || 1500} / mo
                          </span>
                        </div>
                      </div>

                      {/* Path Steps */}
                      <div className="space-y-3">
                        <span className="block font-mono text-[9px] uppercase tracking-widest text-neutral-400 font-bold">1. Customized Learning Path</span>
                        <div className="space-y-2">
                          {mentorResult.learningPath?.map((step: any, idx: number) => (
                            <div key={idx} className="flex gap-2.5 items-start">
                              <span className="h-5 w-5 shrink-0 rounded-full bg-gold/10 border border-gold/20 text-gold font-mono text-[10px] flex items-center justify-center font-bold mt-0.5">
                                {step.step || idx + 1}
                              </span>
                              <div>
                                <h5 className="font-sans text-xs font-bold text-white">{step.title}</h5>
                                <p className="font-sans text-[10px] text-neutral-400">
                                  ⏱️ {step.duration} — Milestone: <span className="text-neutral-300 font-medium">{step.milestone}</span>
                                </p>
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>

                      {/* Project and ethics */}
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-3 border-t border-neutral-900">
                        <div className="space-y-1">
                          <span className="block font-mono text-[8px] text-gold uppercase tracking-widest font-bold">2. Tactical Milestone Project</span>
                          <h6 className="font-sans text-xs font-semibold text-white">{mentorResult.projects?.[0]?.title || "Capstone Ethical Platform"}</h6>
                          <p className="text-[10px] text-neutral-400 font-sans">{mentorResult.projects?.[0]?.description}</p>
                        </div>
                        <div className="space-y-1">
                          <span className="block font-mono text-[8px] text-red-400 uppercase tracking-widest font-bold">3. Ethical Precaution (Shariah)</span>
                          <p className="text-[10px] text-red-400 font-serif italic">"{mentorResult.incomePlan?.ethicalPrecaution || "Avoid riba, debt contracts, and ensure absolute clarity on billing."}"</p>
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </div>
          )}

          {/* TAB 9: ENTERPRISE ROADMAPS (including EMPIRE ROADMAP) */}
          {activeTab === "roadmaps" && (
            <div className="rounded-xl border border-gold/15 bg-neutral-950/80 p-6 shadow-md animate-fade-in space-y-6">
              <div className="border-b border-gold/10 pb-4">
                <h2 className="font-serif text-lg font-bold text-white tracking-wide flex items-center gap-2">
                  <Map className="h-5 w-5 text-gold" />
                  <span>The Empire & Enterprise Roadmaps</span>
                </h2>
                <p className="font-sans text-[11px] text-neutral-400">The historical 12-step path from a starting learner all the way to a global Waqf estate builder.</p>
              </div>

              {/* 12-Step Empire Board */}
              <div className="space-y-4">
                <span className="block font-mono text-[9px] uppercase tracking-widest text-gold font-bold">The 12 Stages of Islamic Enterprise Elevation</span>
                
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  {[
                    { step: 1, title: "Purification (Niyyah)", desc: "Align business motives with halal objectives and declare an ethical oath.", level: "Foundation" },
                    { step: 2, title: "Curriculum Pioneer", desc: "Master basic tactical skills (development, copywriting, or analytics).", level: "Foundation" },
                    { step: 3, title: "Clarity of Covenant", desc: "Understand written Shariah contracts (Uqud) and avoid speculation.", level: "Foundation" },
                    { step: 4, title: "First retainer", desc: "Onboard your first ethical services client using fully disclosed pricing.", level: "Execution" },
                    { step: 5, title: "Amanah delivery", desc: "Settle deliverables with outstanding craft, returning customer rights.", level: "Execution" },
                    { step: 6, title: "The Sovereign agency", desc: "Transition from freelancing into a highly systemized boutique agency.", level: "Execution" },
                    { step: 7, title: "Bootstrapped SaaS", desc: "Build a micro-SaaS generating scalable monthly recurring revenue.", level: "Scale" },
                    { step: 8, title: "Wages before Sweat", desc: "Hire global apprentice workers and pay wages before their sweat dries.", level: "Scale" },
                    { step: 9, title: "Zakat distribution", desc: "Reach Nisab and declare mandatory Zakat on your business surplus assets.", level: "Scale" },
                    { step: 10, title: "Musha'arakah equity", desc: "Form advanced joint partnerships with ethical investment structures.", level: "Legacy" },
                    { step: 11, title: "Waqf establishment", desc: "Dedicate recurring company equity or physical properties into permanent Waqfs.", level: "Legacy" },
                    { step: 12, title: "Permanent Legacy", desc: "Waqf assets generate automated support streams for community education forever.", level: "Legacy" }
                  ].map((s) => {
                    // Check if current student has reached this step based on progress
                    const isCompletedStep = completedTopicsCount >= s.step;
                    const isNextStep = completedTopicsCount + 1 === s.step;

                    return (
                      <div
                        key={s.step}
                        className={`border p-3.5 rounded-lg space-y-1.5 transition-all ${
                          isCompletedStep 
                            ? "border-gold bg-emerald-deep/10 shadow-[0_0_10px_rgba(212,175,55,0.03)]" 
                            : isNextStep 
                            ? "border-dashed border-gold/50 bg-neutral-900/40 animate-pulse" 
                            : "border-neutral-900 bg-neutral-950 opacity-40"
                        }`}
                      >
                        <div className="flex items-center justify-between font-mono text-[9px]">
                          <span className="text-gold font-bold">STAGE {s.step}</span>
                          <span className="text-neutral-500">{s.level}</span>
                        </div>
                        <h4 className="font-serif text-xs font-bold text-white flex items-center gap-1">
                          {isCompletedStep && <CheckCircle className="h-3 w-3 text-gold inline shrink-0" />}
                          <span>{s.title}</span>
                        </h4>
                        <p className="font-sans text-[11px] text-neutral-400 leading-relaxed">{s.desc}</p>
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>
          )}

          {/* TAB: SECURE AUTHENTICATION */}
          {activeTab === "auth" && (
            <div className="rounded-xl border border-gold/15 bg-neutral-950/80 p-6 shadow-md animate-fade-in space-y-6">
              <div className="border-b border-gold/10 pb-4">
                <h2 className="font-serif text-lg font-bold text-white tracking-wide flex items-center gap-2">
                  <Shield className="h-5 w-5 text-gold" />
                  <span>Secure Credential Management</span>
                </h2>
                <p className="font-sans text-[11px] text-neutral-400">Establish a persistent student master profile with secure database authentication.</p>
              </div>

              {currentUser ? (
                <div className="space-y-6 text-left">
                  <div className="border border-gold/15 bg-emerald-deep/10 p-5 rounded-xl space-y-3">
                    <div className="flex items-center gap-2 text-emerald-400 font-serif text-sm font-bold">
                      <CheckCircle className="h-5 w-5" />
                      <span>Authenticated Secure Session Live</span>
                    </div>
                    <p className="font-sans text-xs text-neutral-300">
                      You are securely signed in as <strong className="text-white font-semibold font-mono">{currentUser.email}</strong>. Your study times, bookmarks, notes, quiz scores, and certificate claims are permanently persisted on Firestore.
                    </p>
                    <div className="flex flex-wrap items-center gap-3 pt-2">
                      <span className="font-mono text-[9px] uppercase tracking-wider text-neutral-400">
                        Verification Status: {currentUser.emailVerified ? (
                          <span className="text-emerald-400 font-bold bg-emerald-950/40 px-2 py-0.5 rounded border border-emerald-500/20">Verified</span>
                        ) : (
                          <span className="text-amber-400 font-bold bg-amber-950/40 px-2 py-0.5 rounded border border-amber-500/20">Awaiting Verification Link</span>
                        )}
                      </span>
                      {!currentUser.emailVerified && (
                        <button
                          onClick={async () => {
                            try {
                              await sendVerificationEmail();
                              alert("Shariah verification dispatcher complete. Please inspect your email inbox!");
                            } catch (err: any) {
                              alert(err.message);
                            }
                          }}
                          className="font-mono text-[9px] uppercase tracking-wider text-gold hover:underline"
                        >
                          [ Resend Email Verification Link ]
                        </button>
                      )}
                    </div>
                  </div>

                  <div className="flex justify-between items-center bg-neutral-900/40 border border-neutral-800 p-4 rounded-xl">
                    <div className="space-y-0.5">
                      <span className="block font-mono text-[9px] text-neutral-500 uppercase font-bold">Active Role Permission</span>
                      <p className="font-sans text-xs text-neutral-300">Logged in under: <strong className="text-gold font-bold">{simulatedRole}</strong> access controls.</p>
                    </div>
                    <button
                      onClick={async () => {
                        await signOutUser();
                        setAuthSuccess("Sovereign profile session successfully destroyed.");
                      }}
                      className="font-mono text-[10px] uppercase text-red-400 hover:text-red-300 border border-red-500/20 px-3.5 py-1.5 rounded bg-red-950/10 cursor-pointer"
                    >
                      Disconnect Account
                    </button>
                  </div>

                  <div className="border-t border-gold/15 pt-6 mt-6">
                    <EnterpriseSecurity />
                  </div>
                </div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-start text-left">
                  {/* Left Column: Traditional Forms */}
                  <div className="border border-gold/15 bg-black/40 p-5 rounded-xl space-y-4">
                    <div className="flex gap-2 border-b border-gold/10 pb-3 mb-2">
                      {[
                        { mode: "login", label: "Login" },
                        { mode: "signup", label: "Sign Up" },
                        { mode: "reset", label: "Reset Password" }
                      ].map((m) => (
                        <button
                          key={m.mode}
                          onClick={() => {
                            setAuthMode(m.mode as any);
                            setAuthError("");
                            setAuthSuccess("");
                          }}
                          className={`font-mono text-[10px] uppercase tracking-wider px-3 py-1.5 rounded transition-all ${
                            authMode === m.mode 
                              ? "bg-gold text-black font-bold" 
                              : "text-neutral-400 hover:text-white"
                          }`}
                        >
                          {m.label}
                        </button>
                      ))}
                    </div>

                    <form onSubmit={handleAuthSubmit} className="space-y-3.5">
                      {authMode === "signup" && (
                        <div>
                          <label className="block font-mono text-[9px] uppercase tracking-widest text-neutral-400 mb-1">Full Student Name</label>
                          <input
                            type="text"
                            required
                            value={authName}
                            onChange={(e) => setAuthName(e.target.value)}
                            placeholder="Abdur Rahman"
                            className="w-full rounded bg-black border border-gold/25 px-3 py-1.5 font-sans text-xs text-white focus:border-gold focus:outline-none"
                          />
                        </div>
                      )}

                      <div>
                        <label className="block font-mono text-[9px] uppercase tracking-widest text-neutral-400 mb-1">Email Address</label>
                        <input
                          type="email"
                          required
                          value={authEmail}
                          onChange={(e) => setAuthEmail(e.target.value)}
                          placeholder="student@academy.com"
                          className="w-full rounded bg-black border border-gold/25 px-3 py-1.5 font-sans text-xs text-white focus:border-gold focus:outline-none"
                        />
                      </div>

                      {authMode !== "reset" && (
                        <div>
                          <label className="block font-mono text-[9px] uppercase tracking-widest text-neutral-400 mb-1">Secret Password</label>
                          <input
                            type="password"
                            required
                            value={authPassword}
                            onChange={(e) => setAuthPassword(e.target.value)}
                            placeholder="••••••••"
                            className="w-full rounded bg-black border border-gold/25 px-3 py-1.5 font-sans text-xs text-white focus:border-gold focus:outline-none"
                          />
                        </div>
                      )}

                      {authMode === "signup" && (
                        <div>
                          <label className="block font-mono text-[9px] uppercase tracking-widest text-neutral-400 mb-1">Request Core Academy Role</label>
                          <select
                            value={authRole}
                            onChange={(e) => setAuthRole(e.target.value as any)}
                            className="w-full rounded bg-black border border-gold/25 px-3 py-1.5 font-sans text-xs text-white focus:border-gold focus:outline-none"
                          >
                            <option value="Student">Student (Standard Learner)</option>
                            <option value="Super Admin">Super Admin (Faculty Board Master)</option>
                            <option value="Teacher">Teacher (Curriculum Instructor)</option>
                            <option value="Editor">Editor (Syllabus Revisor)</option>
                          </select>
                        </div>
                      )}

                      <button
                        type="submit"
                        disabled={authLoading}
                        className="w-full flex items-center justify-center gap-1.5 rounded bg-gold px-4 py-2.5 text-xs font-bold text-black hover:bg-gold-light transition-all shadow-md focus:outline-none disabled:opacity-50"
                      >
                        {authLoading ? <RefreshCw className="h-4 w-4 animate-spin" /> : <Shield className="h-4 w-4" />}
                        <span>
                          {authMode === "login" ? "Secure Login" : authMode === "signup" ? "Create Master Account" : "Dispatch Reset Link"}
                        </span>
                      </button>
                    </form>

                    {authSuccess && (
                      <div className="p-3.5 rounded bg-emerald-950/20 border border-emerald-500/20 text-xs text-emerald-400 flex gap-1.5 font-sans">
                        <Check className="h-4 w-4 shrink-0" />
                        <span>{authSuccess}</span>
                      </div>
                    )}

                    {authError && (
                      <div className="p-3.5 rounded bg-red-950/20 border border-red-500/20 text-xs text-red-400 flex gap-1.5 font-sans">
                        <AlertCircle className="h-4 w-4 shrink-0" />
                        <span>{authError}</span>
                      </div>
                    )}
                  </div>

                  {/* Right Column: Google Federated SSO and Rules */}
                  <div className="space-y-4">
                    <div className="border border-gold/15 bg-black/40 p-5 rounded-xl space-y-4">
                      <h4 className="font-serif text-xs font-bold text-white uppercase tracking-widest flex items-center gap-1.5">
                        <Sparkles className="h-4 w-4 text-gold" />
                        <span>Sovereign SSO Platform</span>
                      </h4>
                      <p className="font-sans text-[11px] text-neutral-400 leading-relaxed">
                        Authorize instantly with secure federated credentials, maintaining unified access with cryptographic assurance.
                      </p>

                      <button
                        onClick={handleGoogleLogin}
                        className="w-full flex items-center justify-center gap-2.5 rounded border border-neutral-800 bg-neutral-900 px-4 py-2.5 text-xs font-semibold text-white hover:bg-neutral-800 transition-all cursor-pointer"
                      >
                        <svg className="h-4 w-4 shrink-0" viewBox="0 0 24 24" fill="currentColor">
                          <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4"/>
                          <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/>
                          <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z" fill="#FBBC05"/>
                          <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/>
                        </svg>
                        <span>Federate with Google Login</span>
                      </button>
                    </div>

                    <div className="border border-gold/10 bg-neutral-950 p-4 rounded-xl leading-relaxed">
                      <span className="block font-mono text-[9px] text-gold uppercase font-bold mb-1">Academic Security Covenant</span>
                      <p className="font-sans text-[10px] text-neutral-400">
                        We pledge a zero-telemetry policy. Your secure passwords are salted, hashed, and governed under standard authentication policies. No details of your sovereign data are ever traded or used for unrequested advertising.
                      </p>
                    </div>
                  </div>
                </div>
              )}
            </div>
          )}

          {/* TAB: STUDENT PUBLIC PORTFOLIO */}
          {activeTab === "portfolio" && (
            <div className="rounded-xl border border-gold/15 bg-neutral-950/80 p-6 shadow-md animate-fade-in space-y-6">
              <div className="border-b border-gold/10 pb-4">
                <h2 className="font-serif text-lg font-bold text-white tracking-wide flex items-center gap-2">
                  <ExternalLink className="h-5 w-5 text-gold" />
                  <span>Public Student Portfolio Creator</span>
                </h2>
                <p className="font-sans text-[11px] text-neutral-400">Establish and publish your professional ethical brand, verified skills, and freelance startup directories.</p>
              </div>

              <div className="grid grid-cols-1 xl:grid-cols-5 gap-8 items-start text-left">
                {/* Form Controls Column */}
                <form onSubmit={handlePortfolioSave} className="xl:col-span-2 space-y-4 border border-gold/15 bg-black/40 p-5 rounded-xl">
                  <div className="flex items-center justify-between border-b border-gold/10 pb-3 mb-2">
                    <span className="font-serif text-xs font-bold text-white">Portfolio Parameters</span>
                    <label className="flex items-center gap-2 cursor-pointer select-none">
                      <input
                        type="checkbox"
                        checked={isPortfolioPublic}
                        onChange={(e) => setIsPortfolioPublic(e.target.checked)}
                        className="rounded border-gold/30 bg-black text-gold focus:ring-gold"
                      />
                      <span className="font-mono text-[9px] uppercase tracking-wider text-gold">Make Public</span>
                    </label>
                  </div>

                  <div>
                    <label className="block font-mono text-[9px] uppercase tracking-widest text-neutral-400 mb-1.5">Core Skills & Specialties (Comma Separated)</label>
                    <input
                      type="text"
                      value={portfolioSkills}
                      onChange={(e) => setPortfolioSkills(e.target.value)}
                      placeholder="React, Solidity, Copywriting, Shariah Audit"
                      className="w-full rounded bg-black border border-gold/25 px-3 py-1.5 font-sans text-xs text-white focus:border-gold focus:outline-none"
                    />
                  </div>

                  <div>
                    <label className="block font-mono text-[9px] uppercase tracking-widest text-neutral-400 mb-1.5">Selected Projects / Freelance Work</label>
                    <textarea
                      rows={4}
                      value={portfolioProjectsText}
                      onChange={(e) => setPortfolioProjectsText(e.target.value)}
                      placeholder="List your completed startup ideas or services. e.g. 'Ethical SaaS - an interest-free billing tool for cooperative agencies.'"
                      className="w-full rounded bg-black border border-gold/25 px-3 py-1.5 font-sans text-xs text-white focus:border-gold focus:outline-none resize-none"
                    />
                  </div>

                  <div>
                    <label className="block font-mono text-[9px] uppercase tracking-widest text-neutral-400 mb-1.5">Resume / CV Document URL</label>
                    <input
                      type="url"
                      value={portfolioResumeUrl}
                      onChange={(e) => setPortfolioResumeUrl(e.target.value)}
                      placeholder="https://drive.google.com/.../cv.pdf"
                      className="w-full rounded bg-black border border-gold/25 px-3 py-1.5 font-sans text-xs text-white focus:border-gold focus:outline-none"
                    />
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                    <div>
                      <label className="block font-mono text-[8px] uppercase tracking-widest text-neutral-400 mb-1">LinkedIn</label>
                      <input
                        type="url"
                        value={portfolioLinkedin}
                        onChange={(e) => setPortfolioLinkedin(e.target.value)}
                        placeholder="https://linkedin.com/..."
                        className="w-full rounded bg-black border border-gold/25 px-2 py-1 font-sans text-[10px] text-white focus:border-gold focus:outline-none"
                      />
                    </div>
                    <div>
                      <label className="block font-mono text-[8px] uppercase tracking-widest text-neutral-400 mb-1">GitHub</label>
                      <input
                        type="url"
                        value={portfolioGithub}
                        onChange={(e) => setPortfolioGithub(e.target.value)}
                        placeholder="https://github.com/..."
                        className="w-full rounded bg-black border border-gold/25 px-2 py-1 font-sans text-[10px] text-white focus:border-gold focus:outline-none"
                      />
                    </div>
                    <div>
                      <label className="block font-mono text-[8px] uppercase tracking-widest text-neutral-400 mb-1">Twitter / X</label>
                      <input
                        type="url"
                        value={portfolioTwitter}
                        onChange={(e) => setPortfolioTwitter(e.target.value)}
                        placeholder="https://x.com/..."
                        className="w-full rounded bg-black border border-gold/25 px-2 py-1 font-sans text-[10px] text-white focus:border-gold focus:outline-none"
                      />
                    </div>
                  </div>

                  <button
                    type="submit"
                    className="w-full flex items-center justify-center gap-1.5 rounded bg-gold px-4 py-2 text-xs font-bold text-black hover:bg-gold-light transition-all shadow-md focus:outline-none"
                  >
                    <Save className="h-4 w-4" />
                    <span>Compile & Publish Portfolio</span>
                  </button>

                  {portfolioSuccess && (
                    <div className="p-3 rounded bg-emerald-950/20 border border-emerald-500/20 text-xs text-emerald-400 font-sans">
                      Portfolio modifications published securely!
                    </div>
                  )}
                </form>

                {/* Live Preview Column */}
                <div className="xl:col-span-3 space-y-4">
                  <span className="block font-mono text-[9px] uppercase tracking-widest text-neutral-500">Live Public Portfolio Preview Card</span>
                  
                  <div className="border border-gold/20 bg-gradient-to-r from-emerald-950/20 to-neutral-950 p-6 rounded-xl space-y-6 relative overflow-hidden">
                    <div className="absolute top-0 right-0 h-32 w-32 bg-gold/5 rounded-full blur-2xl pointer-events-none" />
                    
                    <div className="flex justify-between items-start border-b border-gold/10 pb-4">
                      <div className="space-y-1">
                        <span className="font-mono text-[9px] uppercase tracking-widest text-gold font-bold">LEGACY BUILDER PORTFOLIO</span>
                        <h3 className="font-serif text-lg font-bold text-white tracking-wide">{studentProfile?.name || name || "Student Aspirant"}</h3>
                        <p className="font-serif text-xs italic text-neutral-400 leading-relaxed">"{studentProfile?.bio || bio || "Ethical wealth is our vehicle to impact."}"</p>
                      </div>
                      
                      {isPortfolioPublic ? (
                        <span className="px-2 py-0.5 rounded bg-emerald-950 text-emerald-400 text-[8px] font-mono border border-emerald-500/20 uppercase font-bold">
                          ● Live in Community
                        </span>
                      ) : (
                        <span className="px-2 py-0.5 rounded bg-neutral-900 text-neutral-500 text-[8px] font-mono border border-neutral-800 uppercase">
                          Private Draft
                        </span>
                      )}
                    </div>

                    <div className="space-y-4 font-sans text-xs text-left">
                      <div className="space-y-1.5">
                        <span className="block font-mono text-[8px] text-neutral-400 uppercase font-bold tracking-widest">Mastered Competencies</span>
                        <div className="flex flex-wrap gap-1.5">
                          {portfolioSkills ? portfolioSkills.split(",").map((s, i) => (
                            <span key={i} className="px-2 py-0.5 rounded bg-gold/10 text-gold text-[10px] border border-gold/20 font-medium">
                              {s.trim()}
                            </span>
                          )) : <span className="text-neutral-500 italic">No skills listed yet.</span>}
                        </div>
                      </div>

                      <div className="space-y-1">
                        <span className="block font-mono text-[8px] text-neutral-400 uppercase font-bold tracking-widest">Active Ventures & Homework Projects</span>
                        <p className="text-neutral-300 bg-black/40 p-3 rounded border border-gold/10 italic leading-relaxed text-[11px]">
                          {portfolioProjectsText || "Awaiting venture documentation..."}
                        </p>
                      </div>

                      <div className="flex flex-wrap items-center justify-between gap-4 pt-3 border-t border-gold/10">
                        <div className="flex gap-3">
                          {portfolioResumeUrl && <a href={portfolioResumeUrl} target="_blank" rel="noreferrer" className="text-gold hover:underline font-mono text-[10px] flex items-center gap-1">📋 Resume</a>}
                          {portfolioLinkedin && <a href={portfolioLinkedin} target="_blank" rel="noreferrer" className="text-gold hover:underline font-mono text-[10px] flex items-center gap-1">💼 LinkedIn</a>}
                          {portfolioGithub && <a href={portfolioGithub} target="_blank" rel="noreferrer" className="text-gold hover:underline font-mono text-[10px] flex items-center gap-1">📁 GitHub</a>}
                          {portfolioTwitter && <a href={portfolioTwitter} target="_blank" rel="noreferrer" className="text-gold hover:underline font-mono text-[10px] flex items-center gap-1">🐦 Twitter</a>}
                        </div>
                        <span className="font-mono text-[8px] text-neutral-500 font-semibold">VERIFIED LOA STUDENT ID: {studentProfile?.id ? `#${studentProfile.id.substring(8,14)}` : "GUEST"}</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* TAB: ISLAMIC ETHICS ADVISOR */}
          {activeTab === "advisor" && (
            <div className="rounded-xl border border-gold/15 bg-neutral-950/80 p-6 shadow-md animate-fade-in space-y-6">
              <div className="border-b border-gold/10 pb-4">
                <h2 className="font-serif text-lg font-bold text-white tracking-wide flex items-center gap-2">
                  <BookOpenCheck className="h-5 w-5 text-gold" />
                  <span>Islamic Business Ethics Advisor</span>
                </h2>
                <p className="font-sans text-[11px] text-neutral-400">Evaluate your startup, pricing covenant, and revenue parameters against authentic Islamic business ethics (Feqh al-Mu'amalat).</p>
              </div>

              <div className="grid grid-cols-1 xl:grid-cols-3 gap-8">
                {/* Inputs Column */}
                <div className="xl:col-span-1 space-y-4 text-left">
                  <div className="border border-gold/15 bg-black/40 p-5 rounded-xl space-y-4">
                    <h3 className="font-serif text-xs font-bold text-white uppercase tracking-widest border-b border-gold/10 pb-2 flex items-center gap-1">
                      <span>Venture Specification</span>
                    </h3>

                    <form onSubmit={handleAdvisorEvaluate} className="space-y-4">
                      <div>
                        <label className="block font-mono text-[9px] uppercase tracking-widest text-neutral-400 mb-1.5">Venture & Revenue Concept</label>
                        <textarea
                          rows={6}
                          value={businessIdea}
                          onChange={(e) => setBusinessIdea(e.target.value)}
                          placeholder="E.g., An automated subscription-based software allowing freelancers to track client contracts, automatically drafting cooperative partnership agreements (Mudarabah) while charging a transparent 2% monthly service fee."
                          className="w-full rounded bg-black border border-gold/25 px-3 py-2.5 font-sans text-xs text-white focus:border-gold focus:outline-none resize-none"
                        />
                      </div>

                      <button
                        type="submit"
                        disabled={advisorLoading || !businessIdea.trim()}
                        className="w-full flex items-center justify-center gap-1.5 rounded bg-gold px-4 py-2.5 text-xs font-bold text-black hover:bg-gold-light transition-all shadow-md focus:outline-none disabled:opacity-50"
                      >
                        {advisorLoading ? (
                          <>
                            <RefreshCw className="h-3.5 w-3.5 animate-spin" />
                            <span>Auditing Venture concepts...</span>
                          </>
                        ) : (
                          <>
                            <BookOpenCheck className="h-4 w-4" />
                            <span>Analyze Business Concept</span>
                          </>
                        )}
                      </button>
                    </form>
                  </div>

                  <div className="border border-gold/10 bg-neutral-950 p-4 rounded-xl leading-relaxed">
                    <span className="block font-mono text-[9px] text-gold uppercase font-bold mb-1">Principles Covered</span>
                    <ul className="space-y-1 font-sans text-[10px] text-neutral-400 font-medium">
                      <li>• Elimination of Gharar (Speculative Ambiguity)</li>
                      <li>• Absolute prohibition of Riba (Interest/usury)</li>
                      <li>• Strict Wage Protection (Wages before Sweat Dries)</li>
                      <li>• Ethical Capital Sourcing & Waqf allocation</li>
                    </ul>
                  </div>
                </div>

                {/* Results Column */}
                <div className="xl:col-span-2 border border-gold/15 bg-black/40 p-6 rounded-xl min-h-[300px] flex flex-col justify-between">
                  {!advisorResult && !advisorLoading ? (
                    <div className="my-auto text-center py-12 space-y-2">
                      <BookOpenCheck className="h-12 w-12 text-gold/30 mx-auto" />
                      <h4 className="font-serif text-sm font-semibold text-white">Venture audit details awaiting concept</h4>
                      <p className="font-sans text-xs text-neutral-500 max-w-sm mx-auto">
                        Submit your business concepts, pricing covenants, or partnership structures for instant, verified ethical analysis under Shariah principles.
                      </p>
                    </div>
                  ) : advisorLoading ? (
                    <div className="my-auto text-center py-12 space-y-3">
                      <RefreshCw className="h-8 w-8 text-gold mx-auto animate-spin" />
                      <p className="font-sans text-xs text-neutral-400 font-medium">Auditing transaction covenants, verifying ethical compliance ratios, and formulating actionable corrections list...</p>
                    </div>
                  ) : (
                    <div className="space-y-6 text-left animate-fade-in">
                      {/* Top Header metrics */}
                      <div className="flex justify-between items-center border-b border-gold/10 pb-4">
                        <div>
                          <span className="block font-mono text-[8px] text-gold font-bold uppercase tracking-widest">SHARIAH ETHICS COMPLIANCE</span>
                          <span className={`block font-serif text-base font-extrabold ${
                            advisorResult.ethicsScore >= 80 ? "text-emerald-400" :
                            advisorResult.ethicsScore >= 60 ? "text-amber-400" : "text-red-400"
                          }`}>
                            {advisorResult.verdict || "Compliant (Halal)"}
                          </span>
                        </div>
                        <div className="text-right">
                          <span className="block font-mono text-[8px] text-neutral-400 uppercase tracking-widest">ETHICAL FIT SCORE</span>
                          <span className="block font-serif text-2xl font-extrabold text-gold">{advisorResult.ethicsScore || 90}/100</span>
                        </div>
                      </div>

                      {/* Analysis and warning boxes */}
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        {/* Red flags */}
                        <div className="border border-red-500/20 bg-red-950/10 p-4 rounded-xl space-y-1.5">
                          <span className="block font-mono text-[8px] text-red-400 uppercase tracking-widest font-extrabold flex items-center gap-1">
                            <XCircle className="h-3.5 w-3.5" />
                            Ambiguities & Red Flags
                          </span>
                          <p className="text-[11px] text-neutral-300 leading-relaxed font-sans">{advisorResult.redFlags || "No major ribawi constructs or interest-based penalties detected."}</p>
                        </div>

                        {/* Contract Type suggestion */}
                        <div className="border border-emerald-500/20 bg-emerald-950/10 p-4 rounded-xl space-y-1.5">
                          <span className="block font-mono text-[8px] text-emerald-400 uppercase tracking-widest font-extrabold flex items-center gap-1">
                            <CheckCircle className="h-3.5 w-3.5" />
                            Approved Contract Structure
                          </span>
                          <span className="block font-sans font-bold text-xs text-white">{advisorResult.recommendedContract || "Mudarabah (Partnership)"}</span>
                          <p className="text-[11px] text-neutral-400 leading-relaxed font-sans">{advisorResult.contractExplanation}</p>
                        </div>
                      </div>

                      {/* Action Plan */}
                      <div className="space-y-2 border-t border-neutral-900 pt-4">
                        <span className="block font-mono text-[9px] uppercase tracking-widest text-gold font-bold">Actionable Improvement Plan</span>
                        <div className="space-y-1.5 font-sans text-[11px] text-neutral-300 leading-relaxed">
                          {advisorResult.improvements?.map((item: string, i: number) => (
                            <p key={i}>• {item}</p>
                          ))}
                        </div>
                      </div>

                      {/* Prophetic Covenant Reference */}
                      {advisorResult.hadithReference && (
                        <div className="p-3.5 rounded bg-neutral-950 border border-neutral-900 italic font-serif text-[11.5px] text-neutral-400 relative">
                          <span className="absolute -top-2 left-3 bg-neutral-950 border border-neutral-900 px-2 rounded font-mono text-[8px] uppercase tracking-widest text-gold font-semibold">Covenant Anchor</span>
                          <p className="leading-relaxed pt-1">"{advisorResult.hadithReference}"</p>
                        </div>
                      )}
                    </div>
                  )}

                  {/* Mandatory Shariah Guidance Disclaimer */}
                  <div className="border-t border-gold/15 pt-3.5 mt-6 text-center">
                    <p className="font-serif text-[10px] text-gold italic leading-relaxed">
                      "This tool provides educational guidance based on authentic Islamic business ethics. It does not issue religious rulings. Consult a qualified scholar for specific rulings."
                    </p>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* TAB: FACULTY ANALYTICS DASHBOARD */}
          {activeTab === "analytics" && (
            <div className="rounded-xl border border-gold/15 bg-neutral-950/80 p-6 shadow-md animate-fade-in space-y-6">
              <div className="border-b border-gold/10 pb-4 flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div className="space-y-0.5 text-left">
                  <h2 className="font-serif text-lg font-bold text-white tracking-wide flex items-center gap-2">
                    <TrendingUp className="h-5 w-5 text-gold" />
                    <span>Faculty Management Command Center</span>
                  </h2>
                  <p className="font-sans text-[11px] text-neutral-400">Review student metrics, grade homework tasks, and monitor course completion metrics.</p>
                </div>
                <span className="inline-flex rounded-full bg-gold/10 px-2.5 py-1 text-[10px] font-mono text-gold border border-gold/20 items-center gap-1 self-start md:self-auto">
                  Faculty Access Level: {simulatedRole}
                </span>
              </div>

              {/* Faculty Statistics Cards */}
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 text-left">
                {[
                  { title: "Active Student Enrollment", value: "24", desc: "Sovereign learners registered", color: "text-white" },
                  { title: "Credentials Active", value: certificates.filter(c => c.status === "Approved").length.toString(), desc: "Approved verifiable certificates", color: "text-gold" },
                  { title: "Course Completion Rate", value: `${Math.round((certificates.filter(c => c.status === "Approved").length / 24) * 100) || 12}%`, desc: "Verified graduation ratio", color: "text-emerald-400" },
                  { title: "Pending Homework Tasks", value: submissions.filter(s => s.status === "Pending").length.toString(), desc: "Needs evaluation and grading", color: "text-amber-400" }
                ].map((card, idx) => (
                  <div key={idx} className="border border-gold/10 bg-black/40 rounded-xl p-4 space-y-1">
                    <span className="block font-mono text-[9px] uppercase tracking-widest text-neutral-400 font-bold">{card.title}</span>
                    <span className={`block font-serif text-2xl font-extrabold ${card.color}`}>{card.value}</span>
                    <span className="block font-sans text-[10px] text-neutral-500">{card.desc}</span>
                  </div>
                ))}
              </div>

              {/* Recharts Analytics Charts */}
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                {/* Left Chart: Activity distributions */}
                <div className="lg:col-span-2 border border-gold/10 bg-black/40 p-5 rounded-xl text-left space-y-3">
                  <span className="block font-mono text-[9px] uppercase tracking-widest text-gold font-bold">Topic Progress by Skill Track</span>
                  <div className="h-64 w-full">
                    <ResponsiveContainer width="100%" height="100%">
                      <BarChart
                        data={skills.map(s => ({
                          name: s.title.substring(0, 15) + "...",
                          Topics: s.topics.length,
                          Completed: s.topics.filter(t => completedTopicIds.includes(t.id)).length
                        }))}
                        margin={{ top: 10, right: 10, left: -20, bottom: 0 }}
                      >
                        <CartesianGrid strokeDasharray="3 3" stroke="#262626" />
                        <XAxis dataKey="name" stroke="#737373" fontSize={9} />
                        <YAxis stroke="#737373" fontSize={9} />
                        <Tooltip contentStyle={{ backgroundColor: "#0a0a0a", border: "1px solid #d4af37", fontSize: "10px" }} />
                        <Legend wrapperStyle={{ fontSize: "10px" }} />
                        <Bar dataKey="Topics" fill="#1e293b" radius={[4, 4, 0, 0]} />
                        <Bar dataKey="Completed" fill="#d4af37" radius={[4, 4, 0, 0]} />
                      </BarChart>
                    </ResponsiveContainer>
                  </div>
                </div>

                {/* Right: Pie distribution or stats */}
                <div className="lg:col-span-1 border border-gold/10 bg-black/40 p-5 rounded-xl text-left space-y-4">
                  <span className="block font-mono text-[9px] uppercase tracking-widest text-emerald-400 font-bold">Credential Status Mix</span>
                  <div className="h-44 w-full flex items-center justify-center">
                    <ResponsiveContainer width="100%" height="100%">
                      <PieChart>
                        <Pie
                          data={[
                            { name: "Approved", value: certificates.filter(c => c.status === "Approved").length || 1 },
                            { name: "Pending", value: certificates.filter(c => c.status === "Pending").length || 1 },
                            { name: "Rejected", value: certificates.filter(c => c.status === "Rejected").length || 0 }
                          ].filter(d => d.value > 0)}
                          cx="50%"
                          cy="50%"
                          innerRadius={45}
                          outerRadius={65}
                          paddingAngle={5}
                          dataKey="value"
                        >
                          <Cell fill="#10b981" />
                          <Cell fill="#d4af37" />
                          <Cell fill="#ef4444" />
                        </Pie>
                        <Tooltip contentStyle={{ backgroundColor: "#0a0a0a", border: "1px solid #d4af37", fontSize: "10px" }} />
                      </PieChart>
                    </ResponsiveContainer>
                  </div>
                  <div className="flex justify-around text-[10px] font-mono">
                    <span className="flex items-center gap-1.5"><span className="h-2 w-2 rounded-full bg-emerald-500" /> Approved</span>
                    <span className="flex items-center gap-1.5"><span className="h-2 w-2 rounded-full bg-gold" /> Pending</span>
                    <span className="flex items-center gap-1.5"><span className="h-2 w-2 rounded-full bg-red-500" /> Rejected</span>
                  </div>
                </div>
              </div>

              {/* Pending Approvals Actions lists (Admin approval of certificates and projects) */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 text-left pt-2">
                {/* Certificate Claims Reviews */}
                <div className="border border-gold/10 bg-black/30 p-5 rounded-xl space-y-4">
                  <h3 className="font-serif text-sm font-bold text-white border-b border-gold/10 pb-2">
                    Review Pending Certificate Claims
                  </h3>
                  
                  {certificates.filter(c => c.status === "Pending").length === 0 ? (
                    <p className="text-neutral-500 italic text-xs py-4">No pending certificate claims require evaluation.</p>
                  ) : (
                    <div className="space-y-3 max-h-60 overflow-y-auto">
                      {certificates.filter(c => c.status === "Pending").map((cert, idx) => (
                        <div key={idx} className="border border-neutral-900 bg-neutral-950 p-3.5 rounded flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs">
                          <div>
                            <p className="font-semibold text-white">{cert.studentName}</p>
                            <span className="block text-[10px] text-gold tracking-wide">{cert.courseName}</span>
                            <span className="block text-[8px] font-mono text-neutral-500">ID: {cert.id}</span>
                          </div>
                          <div className="flex gap-1.5 shrink-0">
                            <button
                              onClick={() => approveCertificate(cert.id)}
                              className="px-2.5 py-1 rounded bg-emerald-950 border border-emerald-500/20 text-emerald-400 font-mono text-[9px] font-bold uppercase hover:bg-emerald-500 hover:text-black transition-all cursor-pointer"
                            >
                              Approve
                            </button>
                            <button
                              onClick={() => rejectCertificate(cert.id)}
                              className="px-2.5 py-1 rounded bg-red-950 border border-red-500/20 text-red-400 font-mono text-[9px] font-bold uppercase hover:bg-red-500 hover:text-black transition-all cursor-pointer"
                            >
                              Reject
                            </button>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>

                {/* Submissions Reviews */}
                <div className="border border-gold/10 bg-black/30 p-5 rounded-xl space-y-4">
                  <h3 className="font-serif text-sm font-bold text-white border-b border-gold/10 pb-2">
                    Grade Project Homework Assignments
                  </h3>
                  
                  {submissions.filter(s => s.status === "Pending").length === 0 ? (
                    <p className="text-neutral-500 italic text-xs py-4">No pending project submissions require grading.</p>
                  ) : (
                    <div className="space-y-3 max-h-60 overflow-y-auto">
                      {submissions.filter(s => s.status === "Pending").map((sub, idx) => (
                        <div key={idx} className="border border-neutral-900 bg-neutral-950 p-3.5 rounded space-y-2 text-xs">
                          <div className="flex justify-between items-start">
                            <div>
                              <p className="font-semibold text-white">Student ID: #{sub.studentId.substring(0,8)}</p>
                              <span className="block text-[10px] text-neutral-400 font-mono">Topic: {sub.topicTitle}</span>
                            </div>
                            <span className="px-1.5 py-0.5 rounded bg-amber-950 border border-amber-500/20 text-amber-400 font-mono text-[8px] uppercase">Pending Grade</span>
                          </div>
                          <p className="text-neutral-400 italic text-[11px] leading-relaxed">"{sub.homeworkText}"</p>
                          {sub.githubUrl && <p className="font-mono text-[10px] text-gold font-semibold">URL: <a href={sub.githubUrl} target="_blank" rel="noreferrer" className="underline">{sub.githubUrl}</a></p>}
                          
                          <div className="flex gap-2 justify-end pt-2 border-t border-neutral-900/60 font-semibold">
                            <button
                              onClick={async () => {
                                try {
                                  await updateSubmissionStatus(sub.id, "Approved");
                                  alert("Submission successfully graded and approved!");
                                } catch (e) {}
                              }}
                              className="px-2.5 py-1 rounded bg-emerald-950 border border-emerald-500/20 text-emerald-400 font-mono text-[9px] font-bold uppercase hover:bg-emerald-500 hover:text-black transition-all cursor-pointer"
                            >
                              Grade A (Approve)
                            </button>
                            <button
                              onClick={async () => {
                                try {
                                  await updateSubmissionStatus(sub.id, "Rejected");
                                  alert("Submission returned with feedback.");
                                } catch (e) {}
                              }}
                              className="px-2.5 py-1 rounded bg-red-950 border border-red-500/20 text-red-400 font-mono text-[9px] font-bold uppercase hover:bg-red-500 hover:text-black transition-all cursor-pointer"
                            >
                              Reject & Return
                            </button>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            </div>
          )}

          {/* TAB: SYSTEM BACKUP & RESTORATION */}
          {activeTab === "backup" && (
            <div className="rounded-xl border border-gold/15 bg-neutral-950/80 p-6 shadow-md animate-fade-in space-y-6">
              <div className="border-b border-gold/10 pb-4 text-left">
                <h2 className="font-serif text-lg font-bold text-white tracking-wide flex items-center gap-2">
                  <Save className="h-5 w-5 text-gold" />
                  <span>Administrative Backup & Restore Suite</span>
                </h2>
                <p className="font-sans text-[11px] text-neutral-400">Perform cryptographic database exports, restore files to live Firestore collections, and download CSV structures.</p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-8 text-left items-start">
                {/* Export Card */}
                <div className="border border-gold/15 bg-black/40 p-5 rounded-xl space-y-4">
                  <h3 className="font-serif text-xs font-bold text-white uppercase tracking-widest border-b border-gold/10 pb-2 flex items-center gap-1.5">
                    <Download className="h-4 w-4 text-gold" />
                    <span>Cryptographic Database Export</span>
                  </h3>
                  <p className="font-sans text-[11px] text-neutral-400 leading-relaxed">
                    Download a full snapshot of the Academy databases. The resulting `.json` file contains structured maps of skills, topics, course configurations, submissions, notes, and verify registries.
                  </p>

                  <button
                    onClick={handleSystemBackup}
                    className="w-full flex items-center justify-center gap-1.5 rounded bg-gold px-4 py-2.5 text-xs font-bold text-black hover:bg-gold-light transition-all shadow-md focus:outline-none cursor-pointer"
                  >
                    <Download className="h-4 w-4" />
                    <span>Download Consolidated JSON Backup</span>
                  </button>
                </div>

                {/* Import Card */}
                <div className="border border-gold/15 bg-black/40 p-5 rounded-xl space-y-4">
                  <h3 className="font-serif text-xs font-bold text-white uppercase tracking-widest border-b border-gold/10 pb-2 flex items-center gap-1.5">
                    <RefreshCw className="h-4 w-4 text-gold animate-pulse" />
                    <span>Database Restoration Suite</span>
                  </h3>
                  <p className="font-sans text-[11px] text-neutral-400 leading-relaxed">
                    Upload or paste an existing Legacy of Auf database JSON backup file to overwrite/restore global syllabus structures.
                  </p>

                  <form onSubmit={handleSystemRestore} className="space-y-3.5">
                    <textarea
                      rows={4}
                      value={backupFileContent}
                      onChange={(e) => setBackupFileContent(e.target.value)}
                      placeholder="Paste JSON payload content here..."
                      className="w-full rounded bg-black border border-gold/25 px-3 py-2 font-mono text-[10px] text-neutral-300 focus:border-gold focus:outline-none resize-none"
                    />

                    <button
                      type="submit"
                      className="w-full flex items-center justify-center gap-1.5 rounded border border-gold/30 bg-gold/10 px-4 py-2 text-xs font-bold text-gold hover:bg-gold hover:text-black transition-all cursor-pointer"
                    >
                      <Save className="h-4 w-4" />
                      <span>Validate & Overwrite Tables</span>
                    </button>
                  </form>

                  {restoreMessage && (
                    <div className="p-3.5 rounded bg-emerald-950/20 border border-emerald-500/20 text-xs text-emerald-400 flex gap-1.5">
                      <Check className="h-4 w-4 shrink-0" />
                      <span>{restoreMessage}</span>
                    </div>
                  )}

                  {restoreError && (
                    <div className="p-3.5 rounded bg-red-950/20 border border-red-500/20 text-xs text-red-400 flex gap-1.5">
                      <XCircle className="h-4 w-4 shrink-0" />
                      <span>{restoreError}</span>
                    </div>
                  )}
                </div>
              </div>
            </div>
          )}

          {/* TAB: COURSE EXPERIENCE 2.0 */}
          {activeTab === "courseExperience" && (
            <CourseExperience onWatchVideo={onWatchVideo} />
          )}

          {/* TAB: ADVANCED SEARCH */}
          {activeTab === "advancedSearch" && (
            <AdvancedSearch onWatchVideo={onWatchVideo} />
          )}

          {/* TAB: LEGAL & COMPLIANCE */}
          {activeTab === "legalCenter" && (
            <LegalCenter />
          )}

          {/* TAB: FACULTY ADMIN PORTAL */}
          {activeTab === "facultyHub" && (
            <FacultyAdminPortal />
          )}

          {/* TAB: IMPACT LEAGUE */}
          {activeTab === "impactLeague" && (
            <ImpactDashboard />
          )}

        </div>

      </div>

    </div>
  );
}
