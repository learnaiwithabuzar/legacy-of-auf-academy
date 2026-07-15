import React, { createContext, useContext, useState, useEffect } from "react";
import { Skill, Topic, LearningPath, Project, BlogArticle, BusinessChallenge, StudentProfile, TopicProgress, StudentBookmark, StudentNote, ProjectSubmission, QuizQuestion, LessonQuiz, SystemNotification, SimulatedEmail, Course } from "../types";
import {
  SKILLS_DATA,
  LEARNING_PATHS_DATA,
  PROJECTS_DATA,
  BLOG_DATA,
  CHALLENGES_DATA
} from "../data";
import { 
  collection, 
  onSnapshot, 
  doc, 
  setDoc, 
  deleteDoc, 
  updateDoc, 
  getDocs 
} from "firebase/firestore";
import { 
  onAuthStateChanged,
  signInWithPopup,
  GoogleAuthProvider,
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signOut,
  sendPasswordResetEmail,
  sendEmailVerification,
  User
} from "firebase/auth";
import { db, auth } from "../lib/firebase";

// Configurable list of authorized administrator email addresses (Firebase Authentication)
export const ADMIN_EMAILS = ["basitkkk79@gmail.com"];

export enum OperationType {
  CREATE = 'create',
  UPDATE = 'update',
  DELETE = 'delete',
  LIST = 'list',
  GET = 'get',
  WRITE = 'write',
}

export interface FirestoreErrorInfo {
  error: string;
  operationType: OperationType;
  path: string | null;
  authInfo: {
    userId?: string | null;
    email?: string | null;
    emailVerified?: boolean | null;
    isAnonymous?: boolean | null;
    tenantId?: string | null;
    providerInfo?: {
      providerId?: string | null;
      email?: string | null;
    }[];
  }
}

export function handleFirestoreError(error: unknown, operationType: OperationType, path: string | null) {
  const errInfo: FirestoreErrorInfo = {
    error: error instanceof Error ? error.message : String(error),
    authInfo: {
      userId: auth.currentUser?.uid,
      email: auth.currentUser?.email,
      emailVerified: auth.currentUser?.emailVerified,
      isAnonymous: auth.currentUser?.isAnonymous,
      tenantId: auth.currentUser?.tenantId,
      providerInfo: auth.currentUser?.providerData?.map(provider => ({
        providerId: provider.providerId,
        email: provider.email,
      })) || []
    },
    operationType,
    path
  };
  console.warn('Firestore Error: ', JSON.stringify(errInfo));
  
  // Dispatch a custom event to notify the UI about the permission or connection error
  const event = new CustomEvent('firestore-error', { detail: errInfo });
  window.dispatchEvent(event);
}


// Extracted Helper for CSV Parsing (RFC 4180 Compliant)
export function parseCSV(text: string): string[][] {
  const lines: string[][] = [];
  let row: string[] = [];
  let inQuotes = false;
  let currentToken = "";
  
  for (let i = 0; i < text.length; i++) {
    const char = text[i];
    const nextChar = text[i + 1];
    
    if (char === '"') {
      if (inQuotes && nextChar === '"') {
        currentToken += '"';
        i++; // skip next quote
      } else {
        inQuotes = !inQuotes;
      }
    } else if (char === ',' && !inQuotes) {
      row.push(currentToken.trim());
      currentToken = "";
    } else if ((char === '\r' || char === '\n') && !inQuotes) {
      row.push(currentToken.trim());
      currentToken = "";
      if (row.length > 0 && row.some(cell => cell !== "")) {
        lines.push(row);
      }
      row = [];
      if (char === '\r' && nextChar === '\n') {
        i++; // skip \n
      }
    } else {
      currentToken += char;
    }
  }
  if (currentToken || row.length > 0) {
    row.push(currentToken.trim());
    if (row.some(cell => cell !== "")) {
      lines.push(row);
    }
  }
  return lines;
}

// Extracted Helper for CSV Generation
export function arrayToCSV(headers: string[], rows: any[][]): string {
  const escapeCell = (cell: any) => {
    const str = cell === null || cell === undefined ? "" : String(cell);
    if (str.includes(",") || str.includes("\n") || str.includes('"')) {
      return `"${str.replace(/"/g, '""')}"`;
    }
    return str;
  };
  
  const headerLine = headers.map(escapeCell).join(",");
  const rowLines = rows.map(r => r.map(escapeCell).join(","));
  return [headerLine, ...rowLines].join("\n");
}

interface CMSContextType {
  skills: Skill[];
  topics: Topic[];
  learningPaths: LearningPath[];
  projects: Project[];
  blogArticles: BlogArticle[];
  challenges: BusinessChallenge[];
  courses: Course[]; // List of courses with proper metadata

  // Skills CRUD
  addSkill: (skill: Omit<Skill, "topics">) => void;
  updateSkill: (skillId: string, updated: Partial<Skill>) => void;
  deleteSkill: (skillId: string) => void;

  // Courses CRUD
  addCourse: (courseName: string, learningPathId?: string, skillName?: string, description?: string, published?: boolean, featured?: boolean, iconName?: string, sortOrder?: number) => void;
  updateCourse: (oldName: string, newName: string) => void;
  deleteCourse: (courseName: string) => void;

  // Topics CRUD
  addTopic: (topic: Omit<Topic, "id">) => void;
  updateTopic: (topicId: string, updated: Partial<Topic>) => void;
  deleteTopic: (topicId: string) => void;

  // Learning Paths CRUD
  addLearningPath: (path: Omit<LearningPath, "id">) => void;
  updateLearningPath: (pathId: string, updated: Partial<LearningPath>) => void;
  deleteLearningPath: (pathId: string) => void;

  // Bulk operations
  bulkImportCSV: (csvContent: string) => { success: boolean; count: number; error?: string };
  bulkImportJSON: (jsonContent: string) => { success: boolean; count: number; error?: string };
  exportToJSON: () => string;
  exportToCSV: () => string;
  
  // Auth state
  isAdmin: boolean;
  loginAsAdmin: (password: string) => boolean;
  logoutAdmin: () => void;
  
  // Real Firebase Auth
  currentUser: User | null;
  signUpWithEmail: (email: string, password: string, name: string, role?: StudentProfile["role"]) => Promise<void>;
  signInWithEmail: (email: string, password: string) => Promise<void>;
  signInWithGoogle: () => Promise<void>;
  signOutUser: () => Promise<void>;
  resetPassword: (email: string) => Promise<void>;
  sendVerificationEmail: () => Promise<void>;

  // Certificates
  certificates: any[];
  claimCertificate: (userName: string, courseName: string) => Promise<string>;
  approveCertificate: (certId: string) => Promise<void>;
  rejectCertificate: (certId: string) => Promise<void>;

  // Student Profile & Progress
  studentProfile: StudentProfile | null;
  progressList: TopicProgress[];
  updateStudentProfile: (profileData: Partial<StudentProfile>) => Promise<void>;
  toggleTopicCompletion: (topicId: string) => Promise<void>;
  isTopicCompleted: (topicId: string) => boolean;

  // Bookmarks
  bookmarks: StudentBookmark[];
  toggleBookmark: (topicId: string) => Promise<void>;
  isBookmarked: (topicId: string) => boolean;

  // Notes
  notes: StudentNote[];
  saveNote: (topicId: string, noteText: string) => Promise<void>;

  // Project Submissions
  submissions: ProjectSubmission[];
  submitProject: (topicId: string, topicTitle: string, githubUrl: string, submissionText: string) => Promise<void>;
  updateSubmissionStatus: (submissionId: string, status: ProjectSubmission["status"], feedback?: string) => Promise<void>;

  // Quizzes
  quizzes: LessonQuiz[];
  addQuizQuestion: (topicId: string, question: Omit<QuizQuestion, "id">) => Promise<void>;
  submitQuizResult: (topicId: string, score: number) => Promise<void>;
  quizScores: { [topicId: string]: number };

  // Notifications
  notifications: SystemNotification[];
  addNotification: (title: string, message: string, type: SystemNotification["type"]) => Promise<void>;
  markNotificationRead: (id: string) => Promise<void>;
  clearAllNotifications: () => Promise<void>;

  // Simulated Mailbox
  sentEmails: SimulatedEmail[];
  markEmailRead: (id: string) => Promise<void>;
  clearAllEmails: () => Promise<void>;

  // Live Toast Simulation
  activePushToast: { id: string; title: string; message: string; type: string; actionTab?: string } | null;
  triggerLivePushToast: (title: string, message: string, type?: string, actionTab?: string) => void;
  dismissPushToast: () => void;

  // Role Simulator
  simulatedRole: "Super Admin" | "Teacher" | "Editor" | "Reviewer" | "Student";
  setSimulatedRole: (role: "Super Admin" | "Teacher" | "Editor" | "Reviewer" | "Student") => void;

  // Globalization & Language Selector
  currentLanguage: "English" | "Arabic" | "Urdu" | "Hindi";
  setLanguage: (lang: "English" | "Arabic" | "Urdu" | "Hindi") => void;

  // Global Firestore Error Tracking
  firestoreError: any | null;
}

export const defaultCoursesList: Course[] = [
  // path-1
  { id: "course-1", title: "AI & Automation Foundation", name: "AI & Automation Foundation", learningPathId: "path-1", skillName: "AI & Automation", description: "Learn the fundamentals of AI tools, automation setups, and ethical workflows.", published: true, featured: true, iconName: "Cpu", sortOrder: 1 },
  { id: "course-2", title: "Crafting Persuasive, Honest Offers with Copywriting", name: "Crafting Persuasive, Honest Offers with Copywriting", learningPathId: "path-1", skillName: "Copywriting", description: "Write marketing copy that builds trust and delivers massive, honest value.", published: true, featured: true, iconName: "PenTool", sortOrder: 2 },
  { id: "course-3", title: "Client Acquisition & Freelancing Systems", name: "Client Acquisition & Freelancing Systems", learningPathId: "path-1", skillName: "AI & Automation", description: "Build scalable acquisition funnels and manage high-paying clients cleanly.", published: true, featured: false, iconName: "Users", sortOrder: 3 },
  { id: "course-4", title: "Riba-Free Growth & Financial Stability", name: "Riba-Free Growth & Financial Stability", learningPathId: "path-1", skillName: "AI & Automation", description: "Construct solid financial systems aligned with Islamic business ethics.", published: true, featured: false, iconName: "TrendingUp", sortOrder: 4 },

  // path-2
  { id: "course-5", title: "Prophetic Business Philosophy & Servant Leadership", name: "Prophetic Business Philosophy & Servant Leadership", learningPathId: "path-2", skillName: "Digital Marketing", description: "Master the mindset of ethical trading, prophetic commerce, and servant leadership.", published: true, featured: true, iconName: "Sparkles", sortOrder: 5 },
  { id: "course-6", title: "Building the Brand Story & Ethical Scaling Ads", name: "Building the Brand Story & Ethical Scaling Ads", learningPathId: "path-2", skillName: "Digital Marketing", description: "Learn ethical advertising, narrative-driven scaling, and direct-response marketing.", published: true, featured: false, iconName: "Megaphone", sortOrder: 6 },
  { id: "course-7", title: "Sovereign Supply Chains & E-commerce Architecture", name: "Sovereign Supply Chains & E-commerce Architecture", learningPathId: "path-2", skillName: "E-commerce", description: "Architect a direct-to-consumer online business from raw inventory to custom delivery.", published: true, featured: true, iconName: "ShoppingBag", sortOrder: 7 },
  { id: "course-8", title: "High-Stakes Public Speaking & Investor Pitching", name: "High-Stakes Public Speaking & Investor Pitching", learningPathId: "path-2", skillName: "Digital Marketing", description: "Prepare, design, and deliver powerhouse ethical business presentations for capital partners.", published: true, featured: false, iconName: "Mic", sortOrder: 8 },

  // path-3
  { id: "course-9", title: "Foundations of Shariah-Compliant Investments", name: "Foundations of Shariah-Compliant Investments", learningPathId: "path-3", skillName: "E-commerce", description: "Identify, structure, and invest in ethical and halaal financial securities.", published: true, featured: true, iconName: "Percent", sortOrder: 9 },
  { id: "course-10", title: "Zakat Optimization and Equity Structuring", name: "Zakat Optimization and Equity Structuring", learningPathId: "path-3", skillName: "E-commerce", description: "Optimize zakat compliance across complex business equities and legal structures.", published: true, featured: false, iconName: "Layers", sortOrder: 10 },
  { id: "course-11", title: "Building Generational Waqf & Philanthropic Legacies", name: "Building Generational Waqf & Philanthropic Legacies", learningPathId: "path-3", skillName: "E-commerce", description: "Design a long-term waqf system to generate permanent social impact and secure your lineage.", published: true, featured: true, iconName: "Gift", sortOrder: 11 },
];

export const defaultTopicsList: Topic[] = SKILLS_DATA.flatMap((s) => {
  let resolvedCourseName = "AI & Automation Foundation";
  if (s.title === "AI & Automation") {
    resolvedCourseName = "AI & Automation Foundation";
  } else if (s.title === "Digital Marketing") {
    resolvedCourseName = "Prophetic Business Philosophy & Servant Leadership";
  } else if (s.title === "E-commerce") {
    resolvedCourseName = "Sovereign Supply Chains & E-commerce Architecture";
  } else if (s.title === "Copywriting") {
    resolvedCourseName = "Crafting Persuasive, Honest Offers with Copywriting";
  }

  return s.topics.map((t) => ({
    ...t,
    skillName: s.title,
    courseName: resolvedCourseName,
    shortDescription: `${t.title} lesson overview covering business logic and execution plans.`,
    thumbnailUrl: `https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=600`,
    youtubePlaylistLink: "",
    certificateLink: `/certificates?course=${encodeURIComponent(resolvedCourseName)}`,
    officialWebsiteLink: "https://legacyofauf.academy",
    notesPdfLink: "https://legacyofauf.academy/notes/lesson-guide.pdf",
    assignmentPdf: "https://legacyofauf.academy/notes/assignment.pdf",
    projectFile: "https://legacyofauf.academy/notes/project.zip",
    downloadLink: "https://legacyofauf.academy/notes/lesson-guide.pdf",
    businessApplication: "Direct market scaling using risk-free, cashflow-positive techniques.",
    incomeOpportunity: "Freelancing consulting fees averaging $1,200 - $3,500 per client.",
    islamicInsights: "Honest customer interactions, full price disclosures, and zero interest financing.",
    nextTopic: "Advanced Scaling and Automation Platforms",
    prerequisites: "Basic internet browsing knowledge",
    tags: `${s.title}, Ethical Business, Auf Academy`,
    featured: true,
    published: true,
    videoUrl: ""
  }));
});

export const defaultQuizzesList: LessonQuiz[] = [
  {
    topicId: "concept-ethics",
    questions: [
      {
        id: "q1",
        type: "mcq",
        text: "What was Abdur Rahman ibn Awf's core pricing and sales strategy that led to immense blessings (Barakah)?",
        options: [
          "He sold low-quality goods at high markup with speculative future contracts.",
          "He sold only for cash, never concealed any defects, and took minimal but high-volume profits.",
          "He restricted supply to artificially trigger premium bidding wars."
        ],
        correctAnswer: "He sold only for cash, never concealed any defects, and took minimal but high-volume profits.",
        explanation: "Abdur Rahman ibn Awf (RA) declared that he never sold on credit, never hid defects, and accepted even a small profit margin to maintain continuous cashflow and trust."
      },
      {
        id: "q2",
        type: "true-false",
        text: "Writing down contracts in detail is a direct Quranic recommendation.",
        correctAnswer: "True",
        explanation: "Surah Al-Baqarah verse 282 is the longest verse in the Qur'an and explicitly mandates writing down debt and contract terms for transparency."
      },
      {
        id: "q3",
        type: "fill-blank",
        text: "The Arabic term for trust or integrity in business dealings is called ____.",
        correctAnswer: "Amanah",
        explanation: "Amanah represents honesty and absolute trustworthiness in delivering customer rights and managing assets."
      },
      {
        id: "q4",
        type: "short-answer",
        text: "What major business practice is strictly prohibited in Islamic finance as it relates to interest?",
        correctAnswer: "Riba",
        explanation: "Riba (usury/interest) is strictly prohibited as it is exploitative and creates unethical concentration of wealth."
      }
    ]
  },
  {
    topicId: "micro-saas",
    questions: [
      {
        id: "q5",
        type: "mcq",
        text: "Which of the following aligns with an ethical, bootstrapped micro-SaaS model?",
        options: [
          "Charging hidden subscription fees that are hard to cancel.",
          "Offering clear, upfront value with transparent billing and a simple cancellation policy.",
          "Using user data without consent to sell advertisements."
        ],
        correctAnswer: "Offering clear, upfront value with transparent billing and a simple cancellation policy.",
        explanation: "A halal business requires absolute transparency in pricing, clear billing, and no deceptive user hooks (avoiding Gharar)."
      }
    ]
  }
];

const CMSContext = createContext<CMSContextType | undefined>(undefined);

export function CMSProvider({ children }: { children: React.ReactNode }) {
  const [skills, setSkills] = useState<Skill[]>(SKILLS_DATA);
  const [topics, setTopics] = useState<Topic[]>(defaultTopicsList);
  const [learningPaths, setLearningPaths] = useState<LearningPath[]>(LEARNING_PATHS_DATA);
  const [projects, setProjects] = useState<Project[]>(PROJECTS_DATA);
  const [blogArticles, setBlogArticles] = useState<BlogArticle[]>(BLOG_DATA);
  const [challenges, setChallenges] = useState<BusinessChallenge[]>(CHALLENGES_DATA);
  const [courses, setCourses] = useState<Course[]>(defaultCoursesList);
  const [isAdmin, setIsAdmin] = useState<boolean>(() => {
    // Determine admin privilege initially from current authenticated user, no longer using localStorage
    return auth.currentUser?.email ? ADMIN_EMAILS.includes(auth.currentUser.email.toLowerCase()) : false;
  });

  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [studentProfile, setStudentProfile] = useState<StudentProfile | null>(null);
  const [progressList, setProgressList] = useState<TopicProgress[]>([]);

  // Advanced Enterprise States
  const [bookmarks, setBookmarks] = useState<StudentBookmark[]>([]);
  const [notes, setNotes] = useState<StudentNote[]>([]);
  const [submissions, setSubmissions] = useState<ProjectSubmission[]>([]);
  const [quizzes, setQuizzes] = useState<LessonQuiz[]>(defaultQuizzesList);
  const [quizScores, setQuizScores] = useState<{ [topicId: string]: number }>({});
  const [simulatedRole, setSimulatedRole] = useState<"Super Admin" | "Teacher" | "Editor" | "Reviewer" | "Student">("Student");
  const [currentLanguage, setCurrentLanguageState] = useState<"English" | "Arabic" | "Urdu" | "Hindi">("English");

  const setLanguage = (lang: "English" | "Arabic" | "Urdu" | "Hindi") => {
    setCurrentLanguageState(lang);
    if (lang === "Arabic") {
      document.documentElement.dir = "rtl";
    } else {
      document.documentElement.dir = "ltr";
    }
  };

  const [certificates, setCertificates] = useState<any[]>([]);
  const [firestoreError, setFirestoreError] = useState<any | null>(null);

  useEffect(() => {
    const handleError = (e: Event) => {
      const detail = (e as CustomEvent).detail;
      setFirestoreError(detail);
    };
    window.addEventListener('firestore-error', handleError);
    return () => window.removeEventListener('firestore-error', handleError);
  }, []);
  
  const [sentEmails, setSentEmails] = useState<SimulatedEmail[]>([]);
  const [activePushToast, setActivePushToast] = useState<{ id: string; title: string; message: string; type: string; actionTab?: string } | null>(null);
  const [notifications, setNotifications] = useState<SystemNotification[]>([
    {
      id: "notif-1",
      title: "Welcome to Legacy of Auf Academy",
      message: "Begin your sovereign, interest-free entrepreneurship path by selecting a skill path inside Learning Paths.",
      type: "success",
      timestamp: new Date().toISOString(),
      read: false
    }
  ]);

  // Auth Operations
  const signUpWithEmail = async (email: string, password: string, name: string, role: StudentProfile["role"] = "Student") => {
    try {
      const cred = await createUserWithEmailAndPassword(auth, email, password);
      if (cred.user) {
        const defaultProfile: StudentProfile = {
          id: cred.user.uid,
          name,
          email,
          learningGoal: "Mastering Ethical Wealth & Entrepreneurship",
          bio: "Excited to embark on my learning path with Legacy of Auf!",
          role,
          emailNotificationsEnabled: true,
          pushNotificationsEnabled: true,
          notifyOnNewVideos: true,
          notifyOnCertificates: true,
          notifyOnCourseUpdates: true
        };
        await setDoc(doc(db, "students", cred.user.uid), defaultProfile);
        setStudentProfile(defaultProfile);
        setSimulatedRole(role);
        addNotification("Account Created", `Marhaban, ${name}! Your portfolio has been anchored on Legacy of Auf.`, "success");
      }
    } catch (err: any) {
      console.error("Sign up failed:", err);
      throw err;
    }
  };

  const signInWithEmail = async (email: string, password: string) => {
    try {
      await signInWithEmailAndPassword(auth, email, password);
      addNotification("Signed In", "Welcome back to your sovereign training.", "success");
    } catch (err: any) {
      console.error("Sign in failed:", err);
      throw err;
    }
  };

  const signInWithGoogle = async () => {
    try {
      const provider = new GoogleAuthProvider();
      const res = await signInWithPopup(auth, provider);
      if (res.user) {
        addNotification("Google Authentication Success", `Sovereign entrance secured for ${res.user.displayName || "Aspirant"}.`, "success");
      }
    } catch (err: any) {
      console.error("Google login failed:", err);
      throw err;
    }
  };

  const signOutUser = async () => {
    try {
      await signOut(auth);
      setStudentProfile(null);
      setSimulatedRole("Student");
      addNotification("Signed Out", "May your transactions be full of blessings.", "info");
    } catch (err: any) {
      console.error("Sign out failed:", err);
      throw err;
    }
  };

  const resetPassword = async (email: string) => {
    try {
      await sendPasswordResetEmail(auth, email);
      addNotification("Password Reset Sent", `Check ${email} for instructions to reset your password.`, "info");
    } catch (err: any) {
      console.error("Password reset failed:", err);
      throw err;
    }
  };

  const sendVerificationEmail = async () => {
    try {
      if (auth.currentUser) {
        await sendEmailVerification(auth.currentUser);
        addNotification("Verification Sent", "Check your inbox for the activation link.", "info");
      } else {
        throw new Error("No user is currently authenticated.");
      }
    } catch (err: any) {
      console.error("Email verification failed:", err);
      throw err;
    }
  };

  // Initialize Auth state listener and live subscriptions
  useEffect(() => {
    let activeUnsubscribe: (() => void) | null = null;

    const setupSubscriptions = (studentId: string) => {
      if (activeUnsubscribe) {
        activeUnsubscribe();
      }

      // 1. Student profile listener
      const studentDocRef = doc(db, "students", studentId);
      const unsubProfile = onSnapshot(studentDocRef, async (docSnap) => {
        if (docSnap.exists()) {
          const data = docSnap.data() as StudentProfile;
          setStudentProfile(data);
          if (data.role) {
            setSimulatedRole(data.role);
          }
        } else {
          const defaultProfile: StudentProfile = {
            id: studentId,
            name: auth.currentUser?.displayName || `Aspirant #${studentId.substring(0, 4)}`,
            email: auth.currentUser?.email || "basitkkk79@gmail.com",
            learningGoal: "Mastering Ethical Wealth & Entrepreneurship",
            bio: "Excited to embark on my learning path with Legacy of Auf!",
            role: "Student",
            emailNotificationsEnabled: true,
            pushNotificationsEnabled: true,
            notifyOnNewVideos: true,
            notifyOnCertificates: true,
            notifyOnCourseUpdates: true
          };
          await setDoc(studentDocRef, defaultProfile);
          setStudentProfile(defaultProfile);
        }
      }, (error) => {
        handleFirestoreError(error, OperationType.GET, `students/${studentId}`);
        const defaultProfile: StudentProfile = {
          id: studentId,
          name: auth.currentUser?.displayName || `Aspirant #${studentId.substring(0, 4)}`,
          email: auth.currentUser?.email || "basitkkk79@gmail.com",
          learningGoal: "Mastering Ethical Wealth & Entrepreneurship",
          bio: "Excited to embark on my learning path with Legacy of Auf!",
          role: "Student",
          emailNotificationsEnabled: true,
          pushNotificationsEnabled: true,
          notifyOnNewVideos: true,
          notifyOnCertificates: true,
          notifyOnCourseUpdates: true
        };
        setStudentProfile(defaultProfile);
      });

      // 2. Progress listener
      const progressCollRef = collection(db, "students", studentId, "progress");
      const unsubProgress = onSnapshot(progressCollRef, (snap) => {
        const list: TopicProgress[] = [];
        snap.forEach((d) => list.push(d.data() as TopicProgress));
        setProgressList(list);
      }, (error) => {
        handleFirestoreError(error, OperationType.GET, `students/${studentId}/progress`);
        setProgressList([]);
      });

      // 3. Bookmarks listener
      const bookmarksCollRef = collection(db, "students", studentId, "bookmarks");
      const unsubBookmarks = onSnapshot(bookmarksCollRef, (snap) => {
        const list: StudentBookmark[] = [];
        snap.forEach((d) => list.push(d.data() as StudentBookmark));
        setBookmarks(list);
      }, (error) => {
        handleFirestoreError(error, OperationType.GET, `students/${studentId}/bookmarks`);
        setBookmarks([]);
      });

      // 4. Notes listener
      const notesCollRef = collection(db, "students", studentId, "notes");
      const unsubNotes = onSnapshot(notesCollRef, (snap) => {
        const list: StudentNote[] = [];
        snap.forEach((d) => list.push(d.data() as StudentNote));
        setNotes(list);
      }, (error) => {
        handleFirestoreError(error, OperationType.GET, `students/${studentId}/notes`);
        setNotes([]);
      });

      // 5. Quiz Scores listener
      const quizScoresCollRef = collection(db, "students", studentId, "quizScores");
      const unsubQuizScores = onSnapshot(quizScoresCollRef, (snap) => {
        const scores: { [topicId: string]: number } = {};
        snap.forEach((d) => {
          const data = d.data();
          if (data.topicId) {
            scores[data.topicId] = data.score;
          }
        });
        setQuizScores(scores);
      }, (error) => {
        handleFirestoreError(error, OperationType.GET, `students/${studentId}/quizScores`);
        setQuizScores({});
      });

      // 6. Notifications listener
      const notifsCollRef = collection(db, "students", studentId, "notifications");
      const unsubNotifications = onSnapshot(notifsCollRef, (snap) => {
        const list: SystemNotification[] = [];
        snap.forEach((d) => list.push(d.data() as SystemNotification));
        list.sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime());
        setNotifications(list.length > 0 ? list : [
          {
            id: "notif-1",
            title: "Welcome to Legacy of Auf Academy",
            message: "Begin your sovereign, interest-free entrepreneurship path by selecting a skill path inside Learning Paths.",
            type: "success",
            timestamp: new Date().toISOString(),
            read: false
          }
        ]);
      }, (error) => {
        handleFirestoreError(error, OperationType.GET, `students/${studentId}/notifications`);
        setNotifications([
          {
            id: "notif-1",
            title: "Welcome to Legacy of Auf Academy",
            message: "Begin your sovereign, interest-free entrepreneurship path by selecting a skill path inside Learning Paths.",
            type: "success",
            timestamp: new Date().toISOString(),
            read: false
          }
        ]);
      });

      // 7. Emails listener
      const emailsCollRef = collection(db, "students", studentId, "sent_emails");
      const unsubEmails = onSnapshot(emailsCollRef, (snap) => {
        const list: SimulatedEmail[] = [];
        snap.forEach((d) => list.push(d.data() as SimulatedEmail));
        list.sort((a, b) => new Date(b.sentAt).getTime() - new Date(a.sentAt).getTime());
        setSentEmails(list);
      }, (error) => {
        handleFirestoreError(error, OperationType.GET, `students/${studentId}/sent_emails`);
        setSentEmails([]);
      });

      activeUnsubscribe = () => {
        unsubProfile();
        unsubProgress();
        unsubBookmarks();
        unsubNotes();
        unsubQuizScores();
        unsubNotifications();
        unsubEmails();
      };
    };

    // Global collection listeners
    const skillsCollRef = collection(db, "skills");
    const unsubSkills = onSnapshot(skillsCollRef, (snap) => {
      const list: Skill[] = [];
      snap.forEach((d) => list.push(d.data() as Skill));
      if (list.length > 0) {
        setSkills(list);
      }
    }, (error) => {
      handleFirestoreError(error, OperationType.GET, "skills");
      setSkills([]);
    });

    const topicsCollRef = collection(db, "topics");
    const unsubTopics = onSnapshot(topicsCollRef, (snap) => {
      const list: Topic[] = [];
      snap.forEach((d) => list.push(d.data() as Topic));
      if (list.length > 0) {
        setTopics(list);
      }
    }, (error) => {
      handleFirestoreError(error, OperationType.GET, "topics");
      setTopics([]);
    });

    const pathsCollRef = collection(db, "learningPaths");
    const unsubPaths = onSnapshot(pathsCollRef, (snap) => {
      const list: LearningPath[] = [];
      snap.forEach((d) => list.push(d.data() as LearningPath));
      if (list.length > 0) {
        setLearningPaths(list);
      }
    }, (error) => {
      handleFirestoreError(error, OperationType.GET, "learningPaths");
      setLearningPaths([]);
    });

    const coursesCollRef = collection(db, "courses");
    const unsubCourses = onSnapshot(coursesCollRef, (snap) => {
      const list: Course[] = [];
      snap.forEach((d) => list.push(d.data() as Course));
      setCourses(list);
    }, (error) => {
      handleFirestoreError(error, OperationType.GET, "courses");
      setCourses([]);
    });

    // Listen to Firebase Auth state
    const unsubAuth = onAuthStateChanged(auth, (user) => {
      setCurrentUser(user);
      if (user) {
        setupSubscriptions(user.uid);
        // Securely verify admin access against the configurable list of admin emails on state change
        const isUserAdmin = user.email ? ADMIN_EMAILS.includes(user.email.toLowerCase()) : false;
        setIsAdmin(isUserAdmin);
      } else {
        setIsAdmin(false);
        let guestId = localStorage.getItem("loa_student_id");
        if (!guestId) {
          guestId = `student-${Math.random().toString(36).substring(2, 11)}`;
          localStorage.setItem("loa_student_id", guestId);
        }
        setupSubscriptions(guestId);
      }
    });

    return () => {
      if (activeUnsubscribe) activeUnsubscribe();
      unsubSkills();
      unsubTopics();
      unsubPaths();
      unsubCourses();
      unsubAuth();
    };
  }, []);

  // Listen to admin-only collections (quizzes, submissions, certificates) only if the authenticated user is an administrator
  // to prevent Security Rules PERMISSION_DENIED errors for students.
  useEffect(() => {
    if (!isAdmin) {
      setQuizzes([]);
      setSubmissions([]);
      setCertificates([]);
      return;
    }

    const quizzesCollRef = collection(db, "quizzes");
    const unsubQuizzes = onSnapshot(quizzesCollRef, (snap) => {
      const list: LessonQuiz[] = [];
      snap.forEach((d) => list.push(d.data() as LessonQuiz));
      if (list.length > 0) {
        setQuizzes(list);
      } else {
        seedDefaultQuizzes();
      }
    }, (error) => {
      handleFirestoreError(error, OperationType.GET, "quizzes");
      setQuizzes([]);
    });

    const globalSubmissionsRef = collection(db, "submissions");
    const unsubSubmissions = onSnapshot(globalSubmissionsRef, (snap) => {
      const list: ProjectSubmission[] = [];
      snap.forEach((d) => list.push(d.data() as ProjectSubmission));
      setSubmissions(list);
    }, (error) => {
      handleFirestoreError(error, OperationType.GET, "submissions");
      setSubmissions([]);
    });

    const certCollRef = collection(db, "certificates");
    const unsubCertificates = onSnapshot(certCollRef, (snap) => {
      const list: any[] = [];
      snap.forEach((d) => list.push(d.data()));
      setCertificates(list);
    }, (error) => {
      handleFirestoreError(error, OperationType.GET, "certificates");
      setCertificates([]);
    });

    return () => {
      unsubQuizzes();
      unsubSubmissions();
      unsubCertificates();
    };
  }, [isAdmin]);

  const updateStudentProfile = async (profileData: Partial<StudentProfile>) => {
    if (!studentProfile) return;
    try {
      const studentDocRef = doc(db, "students", studentProfile.id);
      await updateDoc(studentDocRef, profileData);
    } catch (err) {
      console.error("Failed to update student profile:", err);
    }
  };

  const claimCertificate = async (userName: string, courseName: string): Promise<string> => {
    if (!studentProfile) return "";
    const randomNum = Math.floor(100000 + Math.random() * 900000);
    const trackCode = courseName.split(" ").map(w => w[0]).join("");
    const certId = `LOA-${randomNum}-${trackCode}`;
    const qrUrl = `https://api.qrserver.com/v1/create-qr-code/?size=150x150&data=${encodeURIComponent("https://legacy-of-auf-academy.web.app/verify/" + certId)}`;
    
    const newCert = {
      id: certId,
      studentId: studentProfile.id,
      studentName: userName,
      courseName,
      status: "Pending", // Admin approval feature!
      issuedAt: new Date().toISOString(),
      qrUrl
    };

    try {
      await setDoc(doc(db, "certificates", certId), newCert);
      addNotification(
        "Certificate Claimed", 
        `Your Certificate of Achievement request for "${courseName}" has been submitted successfully for review! ID: ${certId}`, 
        "success"
      );
      return certId;
    } catch (err) {
      console.error("Failed to claim certificate:", err);
      return "";
    }
  };

  const approveCertificate = async (certId: string) => {
    try {
      const certRef = doc(db, "certificates", certId);
      await updateDoc(certRef, { status: "Approved" });
      addNotification("Certificate Approved", `Certificate ID ${certId} is now active and verified!`, "success");
    } catch (err) {
      console.error("Failed to approve certificate:", err);
    }
  };

  const rejectCertificate = async (certId: string) => {
    try {
      const certRef = doc(db, "certificates", certId);
      await updateDoc(certRef, { status: "Rejected" });
      addNotification("Certificate Rejected", `Certificate ID ${certId} has been rejected.`, "info");
    } catch (err) {
      console.error("Failed to reject certificate:", err);
    }
  };

  const toggleTopicCompletion = async (topicId: string) => {
    if (!studentProfile) return;
    const isCompleted = progressList.some(p => p.topicId === topicId && p.completed);
    const progressDocRef = doc(db, "students", studentProfile.id, "progress", topicId);

    try {
      if (isCompleted) {
        // Toggle off
        await deleteDoc(progressDocRef);
      } else {
        // Toggle on
        const progressRecord: TopicProgress = {
          topicId,
          completed: true,
          completedAt: new Date().toISOString()
        };
        await setDoc(progressDocRef, progressRecord);
      }
    } catch (err) {
      console.error("Failed to toggle topic completion:", err);
    }
  };

  const isTopicCompleted = (topicId: string): boolean => {
    return progressList.some(p => p.topicId === topicId && p.completed);
  };

  const seedDefaultQuizzes = async () => {
    const defaults: LessonQuiz[] = [
      {
        topicId: "concept-ethics",
        questions: [
          {
            id: "q1",
            type: "mcq",
            text: "What was Abdur Rahman ibn Awf's core pricing and sales strategy that led to immense blessings (Barakah)?",
            options: [
              "He sold low-quality goods at high markup with speculative future contracts.",
              "He sold only for cash, never concealed any defects, and took minimal but high-volume profits.",
              "He restricted supply to artificially trigger premium bidding wars."
            ],
            correctAnswer: "He sold only for cash, never concealed any defects, and took minimal but high-volume profits.",
            explanation: "Abdur Rahman ibn Awf (RA) declared that he never sold on credit, never hid defects, and accepted even a small profit margin to maintain continuous cashflow and trust."
          },
          {
            id: "q2",
            type: "true-false",
            text: "Writing down contracts in detail is a direct Quranic recommendation.",
            correctAnswer: "True",
            explanation: "Surah Al-Baqarah verse 282 is the longest verse in the Qur'an and explicitly mandates writing down debt and contract terms for transparency."
          },
          {
            id: "q3",
            type: "fill-blank",
            text: "The Arabic term for trust or integrity in business dealings is called ____.",
            correctAnswer: "Amanah",
            explanation: "Amanah represents honesty and absolute trustworthiness in delivering customer rights and managing assets."
          },
          {
            id: "q4",
            type: "short-answer",
            text: "What major business practice is strictly prohibited in Islamic finance as it relates to interest?",
            correctAnswer: "Riba",
            explanation: "Riba (usury/interest) is strictly prohibited as it is exploitative and creates unethical concentration of wealth."
          }
        ]
      },
      {
        topicId: "micro-saas",
        questions: [
          {
            id: "q5",
            type: "mcq",
            text: "Which of the following aligns with an ethical, bootstrapped micro-SaaS model?",
            options: [
              "Charging hidden subscription fees that are hard to cancel.",
              "Offering clear, upfront value with transparent billing and a simple cancellation policy.",
              "Using user data without consent to sell advertisements."
            ],
            correctAnswer: "Offering clear, upfront value with transparent billing and a simple cancellation policy.",
            explanation: "A halal business requires absolute transparency in pricing, clear billing, and no deceptive user hooks (avoiding Gharar)."
          }
        ]
      }
    ];

    setQuizzes(defaults);
    try {
      for (const q of defaults) {
        await setDoc(doc(db, "quizzes", q.topicId), q);
      }
    } catch (e) {
      console.warn("Failed to seed quizzes to Firestore:", e);
    }
  };

  // 1. Bookmarks Implementation
  const toggleBookmark = async (topicId: string) => {
    if (!studentProfile) return;
    const isBooked = bookmarks.some(b => b.topicId === topicId);
    const bookmarkDocRef = doc(db, "students", studentProfile.id, "bookmarks", topicId);

    try {
      if (isBooked) {
        await deleteDoc(bookmarkDocRef);
        addNotification("Bookmark Removed", "Lesson removed from your bookmarks.", "info");
      } else {
        const newBookmark: StudentBookmark = {
          topicId,
          bookmarkedAt: new Date().toISOString()
        };
        await setDoc(bookmarkDocRef, newBookmark);
        addNotification("Bookmark Saved", "Lesson has been added to your Bookmarks tab.", "success");
      }
    } catch (err) {
      console.error("Failed to toggle bookmark:", err);
    }
  };

  const isBookmarked = (topicId: string): boolean => {
    return bookmarks.some(b => b.topicId === topicId);
  };

  // 2. Notes Implementation
  const saveNote = async (topicId: string, noteText: string) => {
    if (!studentProfile) return;
    const noteDocRef = doc(db, "students", studentProfile.id, "notes", topicId);
    try {
      const newNote: StudentNote = {
        topicId,
        noteText,
        updatedAt: new Date().toISOString()
      };
      await setDoc(noteDocRef, newNote);
    } catch (err) {
      console.error("Failed to save note:", err);
    }
  };

  // 3. Project Submissions
  const submitProject = async (topicId: string, topicTitle: string, githubUrl: string, submissionText: string) => {
    if (!studentProfile) return;
    const submissionId = `sub-${Math.random().toString(36).substring(2, 11)}`;
    const submissionDocRef = doc(db, "submissions", submissionId);
    
    const newSubmission: ProjectSubmission = {
      id: submissionId,
      topicId,
      topicTitle,
      studentId: studentProfile.id,
      studentName: studentProfile.name,
      githubUrl,
      submissionText,
      status: "Under Review",
      submittedAt: new Date().toISOString()
    };

    try {
      await setDoc(submissionDocRef, newSubmission);
      await setDoc(doc(db, "students", studentProfile.id, "submissions", submissionId), newSubmission);
      addNotification("Project Submitted", `Your project for "${topicTitle}" has been submitted successfully for review!`, "success");
    } catch (err) {
      console.error("Failed to submit project:", err);
    }
  };

  const updateSubmissionStatus = async (submissionId: string, status: ProjectSubmission["status"], feedback?: string) => {
    try {
      const submissionDocRef = doc(db, "submissions", submissionId);
      const updateData: Partial<ProjectSubmission> = { status };
      if (feedback !== undefined) {
        updateData.feedback = feedback;
      }
      await updateDoc(submissionDocRef, updateData);

      const submission = submissions.find(s => s.id === submissionId);
      if (submission) {
        await updateDoc(doc(db, "students", submission.studentId, "submissions", submissionId), updateData);
        addNotification(
          "Project Status Updated", 
          `Your submission for "${submission.topicTitle}" has been ${status.toLowerCase()} by the faculty!`, 
          status === "Approved" ? "success" : "alert"
        );
      }
    } catch (err) {
      console.error("Failed to update submission status:", err);
    }
  };

  // 4. Quizzes
  const addQuizQuestion = async (topicId: string, question: Omit<QuizQuestion, "id">) => {
    try {
      const existingQuiz = quizzes.find(q => q.topicId === topicId) || { topicId, questions: [] };
      const newQuestion: QuizQuestion = {
        ...question,
        id: `q-${Math.random().toString(36).substring(2, 9)}`
      };
      
      const updatedQuiz: LessonQuiz = {
        ...existingQuiz,
        questions: [...existingQuiz.questions, newQuestion]
      };

      await setDoc(doc(db, "quizzes", topicId), updatedQuiz);
    } catch (err) {
      console.error("Failed to add quiz question:", err);
    }
  };

  const submitQuizResult = async (topicId: string, score: number) => {
    if (!studentProfile) return;
    try {
      const scoreDocRef = doc(db, "students", studentProfile.id, "quizScores", topicId);
      await setDoc(scoreDocRef, {
        topicId,
        score,
        completedAt: new Date().toISOString()
      });

      if (score >= 80) {
        const isCompleted = progressList.some(p => p.topicId === topicId && p.completed);
        if (!isCompleted) {
          await toggleTopicCompletion(topicId);
          addNotification("Certificate Milestone!", "You passed the lesson quiz and marked this topic complete!", "success");
        }
      }
    } catch (err) {
      console.error("Failed to submit quiz result:", err);
    }
  };

  // Helper to generate a beautiful simulated HTML email template
  const getEmailTemplate = (title: string, message: string, type: string, studentName: string, email: string) => {
    const dateStr = new Date().toLocaleDateString("en-US", { month: "long", day: "numeric", year: "numeric" });
    return `
      <div style="background-color: #0c0a09; color: #e7e5e4; font-family: 'Inter', system-ui, sans-serif; padding: 40px 20px; max-width: 600px; margin: 0 auto; border: 1px solid #d4af372b; border-radius: 12px; box-shadow: 0 10px 30px rgba(0,0,0,0.5);">
        <div style="text-align: center; margin-bottom: 30px; border-bottom: 1px solid #292524; padding-bottom: 20px;">
          <span style="font-size: 24px; font-weight: bold; letter-spacing: 2px; color: #ffffff; display: block;">LEGACY OF AUF</span>
          <span style="font-size: 10px; letter-spacing: 4px; color: #d4af37; font-family: monospace; text-transform: uppercase;">ACADEMY ALERTS</span>
        </div>
        
        <div style="padding: 10px 0;">
          <p style="font-size: 11px; color: #a8a29e; font-family: monospace; text-transform: uppercase; margin: 0 0 10px 0;">${dateStr}</p>
          <h2 style="font-size: 18px; font-weight: 500; color: #ffffff; margin: 0 0 15px 0; border-left: 3px solid #d4af37; padding-left: 12px;">${title}</h2>
          
          <p style="font-size: 14px; line-height: 1.6; color: #e7e5e4; margin: 0 0 20px 0;">
            Assalamu Alaikum ${studentName || "Aspirant"},
          </p>
          
          <p style="font-size: 14px; line-height: 1.6; color: #d6d3d1; margin: 0 0 25px 0;">
            ${message}
          </p>
          
          <div style="margin-top: 30px; text-align: center; margin-bottom: 30px;">
            <a href="https://legacyofauf.academy" style="background-color: #0f5132; color: #ffffff; padding: 12px 30px; font-size: 12px; font-weight: 600; text-transform: uppercase; letter-spacing: 1.5px; text-decoration: none; border-radius: 6px; border: 1px solid #d4af37; display: inline-block;">
              Access Classroom Portal
            </a>
          </div>
        </div>
        
        <div style="border-top: 1px solid #292524; padding-top: 20px; margin-top: 30px; text-align: center; font-size: 10px; color: #78716c; font-family: monospace; line-height: 1.6;">
          <p style="margin: 0;">This is a simulated email alert delivered to <strong>${email}</strong>.</p>
          <p style="margin: 5px 0 0 0;">© ${new Date().getFullYear()} Legacy of Auf Academy. Sovereign Interest-Free Entrepreneurship.</p>
        </div>
      </div>
    `;
  };

  // 5. Notifications & Live Toast Helpers
  const triggerLivePushToast = (title: string, message: string, type: string = "info", actionTab?: string) => {
    const id = `toast-${Math.random().toString(36).substring(2, 11)}`;
    setActivePushToast({ id, title, message, type, actionTab });
    // Auto dismiss after 6 seconds
    setTimeout(() => {
      setActivePushToast(prev => prev?.id === id ? null : prev);
    }, 6000);
  };

  const dismissPushToast = () => {
    setActivePushToast(null);
  };

  const addNotification = async (title: string, message: string, type: SystemNotification["type"]) => {
    const notifId = `notif-${Math.random().toString(36).substring(2, 11)}`;
    const newNotif: SystemNotification = {
      id: notifId,
      title,
      message,
      type,
      timestamp: new Date().toISOString(),
      read: false
    };

    // 1. Update local state fallback
    setNotifications(prev => [newNotif, ...prev]);

    // 2. Persist to Firestore if student is initialized
    if (studentProfile) {
      try {
        const studentId = studentProfile.id;
        const notifDocRef = doc(db, "students", studentId, "notifications", notifId);
        await setDoc(notifDocRef, newNotif);

        // 3. Trigger live in-app push notification toast if enabled
        const isPushEnabled = studentProfile.pushNotificationsEnabled !== false;
        const isSubscribedToCategory = 
          (type === "update" && studentProfile.notifyOnCourseUpdates !== false) ||
          (type === "success" && studentProfile.notifyOnCertificates !== false) ||
          (type === "info" && studentProfile.notifyOnNewVideos !== false) ||
          (type === "alert");

        if (isPushEnabled && isSubscribedToCategory) {
          let actionTab = "profile";
          if (type === "success") actionTab = "certificates";
          if (type === "info") actionTab = "paths";
          triggerLivePushToast(title, message, type, actionTab);
        }

        // 4. Trigger simulated email if enabled
        const isEmailEnabled = studentProfile.emailNotificationsEnabled !== false;
        if (isEmailEnabled && isSubscribedToCategory) {
          const emailId = `email-${Math.random().toString(36).substring(2, 11)}`;
          const emailRecipient = studentProfile.email || "basitkkk79@gmail.com";
          const emailRecord: SimulatedEmail = {
            id: emailId,
            to: emailRecipient,
            subject: `[Auf Academy Alert] ${title}`,
            bodyHTML: getEmailTemplate(title, message, type, studentProfile.name, emailRecipient),
            sentAt: new Date().toISOString(),
            read: false,
            type: type === "info" ? "new_video" : type === "success" ? "certificate" : type === "update" ? "course_update" : "project_grade"
          };
          
          await setDoc(doc(db, "students", studentId, "sent_emails", emailId), emailRecord);
        }
      } catch (err) {
        console.error("Failed to persist notification / email in Firestore:", err);
      }
    }
  };

  const markNotificationRead = async (id: string) => {
    // Local state fallback
    setNotifications(prev => prev.map(n => n.id === id ? { ...n, read: true } : n));
    if (studentProfile) {
      try {
        await updateDoc(doc(db, "students", studentProfile.id, "notifications", id), { read: true });
      } catch (err) {
        console.error("Failed to mark notification read in Firestore:", err);
      }
    }
  };

  const clearAllNotifications = async () => {
    // Local state fallback
    setNotifications([]);
    if (studentProfile) {
      try {
        const notifsRef = collection(db, "students", studentProfile.id, "notifications");
        const snap = await getDocs(notifsRef);
        for (const docSnap of snap.docs) {
          await deleteDoc(doc(db, "students", studentProfile.id, "notifications", docSnap.id));
        }
      } catch (err) {
        console.error("Failed to clear notifications in Firestore:", err);
      }
    }
  };

  const markEmailRead = async (id: string) => {
    setSentEmails(prev => prev.map(e => e.id === id ? { ...e, read: true } : e));
    if (studentProfile) {
      try {
        await updateDoc(doc(db, "students", studentProfile.id, "sent_emails", id), { read: true });
      } catch (err) {
        console.error("Failed to mark email read in Firestore:", err);
      }
    }
  };

  const clearAllEmails = async () => {
    setSentEmails([]);
    if (studentProfile) {
      try {
        const emailsRef = collection(db, "students", studentProfile.id, "sent_emails");
        const snap = await getDocs(emailsRef);
        for (const docSnap of snap.docs) {
          await deleteDoc(doc(db, "students", studentProfile.id, "sent_emails", docSnap.id));
        }
      } catch (err) {
        console.error("Failed to clear emails in Firestore:", err);
      }
    }
  };

  // 1. Database Seeder & Sync Initializer
  useEffect(() => {
    const initializeDatabase = async () => {
      try {
        // A. Seed Skills
        const skillsRef = collection(db, "skills");
        const skillsSnap = await getDocs(skillsRef);
        if (skillsSnap.empty) {
          console.log("Seeding skills...");
          for (const s of SKILLS_DATA) {
            const { topics: nestedTopics, ...skillMeta } = s;
            await setDoc(doc(skillsRef, s.id), skillMeta);
          }
        }

        // B. Seed Courses
        const coursesRef = collection(db, "courses");
        const coursesSnap = await getDocs(coursesRef);
        if (coursesSnap.empty) {
          console.log("Seeding courses...");
          const DEFAULT_COURSES = [
            // path-1
            { id: "course-1", title: "AI & Automation Foundation", name: "AI & Automation Foundation", learningPathId: "path-1", skillName: "AI & Automation", description: "Learn the fundamentals of AI tools, automation setups, and ethical workflows.", published: true, featured: true, iconName: "Cpu", sortOrder: 1 },
            { id: "course-2", title: "Crafting Persuasive, Honest Offers with Copywriting", name: "Crafting Persuasive, Honest Offers with Copywriting", learningPathId: "path-1", skillName: "Copywriting", description: "Write marketing copy that builds trust and delivers massive, honest value.", published: true, featured: true, iconName: "PenTool", sortOrder: 2 },
            { id: "course-3", title: "Client Acquisition & Freelancing Systems", name: "Client Acquisition & Freelancing Systems", learningPathId: "path-1", skillName: "AI & Automation", description: "Build scalable acquisition funnels and manage high-paying clients cleanly.", published: true, featured: false, iconName: "Users", sortOrder: 3 },
            { id: "course-4", title: "Riba-Free Growth & Financial Stability", name: "Riba-Free Growth & Financial Stability", learningPathId: "path-1", skillName: "AI & Automation", description: "Construct solid financial systems aligned with Islamic business ethics.", published: true, featured: false, iconName: "TrendingUp", sortOrder: 4 },

            // path-2
            { id: "course-5", title: "Prophetic Business Philosophy & Servant Leadership", name: "Prophetic Business Philosophy & Servant Leadership", learningPathId: "path-2", skillName: "Digital Marketing", description: "Master the mindset of ethical trading, prophetic commerce, and servant leadership.", published: true, featured: true, iconName: "Sparkles", sortOrder: 5 },
            { id: "course-6", title: "Building the Brand Story & Ethical Scaling Ads", name: "Building the Brand Story & Ethical Scaling Ads", learningPathId: "path-2", skillName: "Digital Marketing", description: "Learn ethical advertising, narrative-driven scaling, and direct-response marketing.", published: true, featured: false, iconName: "Megaphone", sortOrder: 6 },
            { id: "course-7", title: "Sovereign Supply Chains & E-commerce Architecture", name: "Sovereign Supply Chains & E-commerce Architecture", learningPathId: "path-2", skillName: "E-commerce", description: "Architect a direct-to-consumer online business from raw inventory to custom delivery.", published: true, featured: true, iconName: "ShoppingBag", sortOrder: 7 },
            { id: "course-8", title: "High-Stakes Public Speaking & Investor Pitching", name: "High-Stakes Public Speaking & Investor Pitching", learningPathId: "path-2", skillName: "Digital Marketing", description: "Prepare, design, and deliver powerhouse ethical business presentations for capital partners.", published: true, featured: false, iconName: "Mic", sortOrder: 8 },

            // path-3
            { id: "course-9", title: "Foundations of Shariah-Compliant Investments", name: "Foundations of Shariah-Compliant Investments", learningPathId: "path-3", skillName: "E-commerce", description: "Identify, structure, and invest in ethical and halaal financial securities.", published: true, featured: true, iconName: "Percent", sortOrder: 9 },
            { id: "course-10", title: "Zakat Optimization and Equity Structuring", name: "Zakat Optimization and Equity Structuring", learningPathId: "path-3", skillName: "E-commerce", description: "Optimize zakat compliance across complex business equities and legal structures.", published: true, featured: false, iconName: "Layers", sortOrder: 10 },
            { id: "course-11", title: "Building Generational Waqf & Philanthropic Legacies", name: "Building Generational Waqf & Philanthropic Legacies", learningPathId: "path-3", skillName: "E-commerce", description: "Design a long-term waqf system to generate permanent social impact and secure your lineage.", published: true, featured: true, iconName: "Gift", sortOrder: 11 },
          ];
          for (const c of DEFAULT_COURSES) {
            await setDoc(doc(coursesRef, c.id), c);
          }
        }

        // C. Seed Learning Paths
        const pathsRef = collection(db, "learningPaths");
        const pathsSnap = await getDocs(pathsRef);
        if (pathsSnap.empty) {
          console.log("Seeding learningPaths...");
          for (const p of LEARNING_PATHS_DATA) {
            await setDoc(doc(pathsRef, p.id), p);
          }
        }

        // D. Seed Topics
        const topicsRef = collection(db, "topics");
        const topicsSnap = await getDocs(topicsRef);
        if (topicsSnap.empty) {
          console.log("Seeding topics...");
          for (const s of SKILLS_DATA) {
            let resolvedCourseName = "AI & Automation Foundation";
            if (s.title === "AI & Automation") {
              resolvedCourseName = "AI & Automation Foundation";
            } else if (s.title === "Digital Marketing") {
              resolvedCourseName = "Prophetic Business Philosophy & Servant Leadership";
            } else if (s.title === "E-commerce") {
              resolvedCourseName = "Sovereign Supply Chains & E-commerce Architecture";
            } else if (s.title === "Copywriting") {
              resolvedCourseName = "Crafting Persuasive, Honest Offers with Copywriting";
            }

            for (const t of s.topics) {
              const fullTopic: Topic = {
                ...t,
                skillName: s.title,
                courseName: resolvedCourseName,
                shortDescription: `${t.title} lesson overview covering business logic and execution plans.`,
                thumbnailUrl: `https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=600`,
                youtubePlaylistLink: "",
                certificateLink: `/certificates?course=${encodeURIComponent(resolvedCourseName)}`,
                officialWebsiteLink: "https://legacyofauf.academy",
                notesPdfLink: "https://legacyofauf.academy/notes/lesson-guide.pdf",
                assignmentPdf: "https://legacyofauf.academy/notes/assignment.pdf",
                projectFile: "https://legacyofauf.academy/notes/project.zip",
                downloadLink: "https://legacyofauf.academy/notes/lesson-guide.pdf",
                businessApplication: "Direct market scaling using risk-free, cashflow-positive techniques.",
                incomeOpportunity: "Freelancing consulting fees averaging $1,200 - $3,500 per client.",
                islamicInsights: "Honest customer interactions, full price disclosures, and zero interest financing.",
                nextTopic: "Advanced Scaling and Automation Platforms",
                prerequisites: "Basic internet browsing knowledge",
                tags: `${s.title}, Ethical Business, Auf Academy`,
                featured: true,
                published: true,
                videoUrl: ""
              };
              await setDoc(doc(topicsRef, t.id), fullTopic);
            }
          }
        } else {
          // Heal existing topics to ensure correct data-linking fields are not empty or obsolete
          topicsSnap.forEach(async (docSnap) => {
            const data = docSnap.data() as Topic;
            let updated = false;
            const updatedFields: Partial<Topic> = {};

            if (!data.skillName) {
              if (data.id.startsWith("ai-")) {
                updatedFields.skillName = "AI & Automation";
              } else if (data.id.startsWith("dm-")) {
                updatedFields.skillName = "Digital Marketing";
              } else if (data.id.startsWith("eco-")) {
                updatedFields.skillName = "E-commerce";
              } else if (data.id.startsWith("copy-")) {
                updatedFields.skillName = "Copywriting";
              } else {
                updatedFields.skillName = "AI & Automation";
              }
              updated = true;
            }

            const currentSkillName = updatedFields.skillName || data.skillName;

            if (!data.courseName || data.courseName === "Legacy Fundamentals Module") {
              let resolvedCourseName = "AI & Automation Foundation";
              if (currentSkillName === "AI & Automation") {
                resolvedCourseName = "AI & Automation Foundation";
              } else if (currentSkillName === "Digital Marketing") {
                resolvedCourseName = "Prophetic Business Philosophy & Servant Leadership";
              } else if (currentSkillName === "E-commerce") {
                resolvedCourseName = "Sovereign Supply Chains & E-commerce Architecture";
              } else if (currentSkillName === "Copywriting") {
                resolvedCourseName = "Crafting Persuasive, Honest Offers with Copywriting";
              }
              updatedFields.courseName = resolvedCourseName;
              updated = true;
            }

            if (data.published === undefined) {
              updatedFields.published = true;
              updated = true;
            }

            if (updated) {
              await updateDoc(doc(db, "topics", data.id), updatedFields);
            }
          });
        }

        // E. Seed Projects
        const projectsRef = collection(db, "projects");
        const projectsSnap = await getDocs(projectsRef);
        if (projectsSnap.empty) {
          for (const pr of PROJECTS_DATA) {
            await setDoc(doc(projectsRef, pr.id), pr);
          }
        }

        // F. Seed Blog Articles
        const blogRef = collection(db, "blogArticles");
        const blogSnap = await getDocs(blogRef);
        if (blogSnap.empty) {
          for (const b of BLOG_DATA) {
            await setDoc(doc(blogRef, b.id), b);
          }
        }

        // G. Seed Business Challenges
        const challengesRef = collection(db, "challenges");
        const challengesSnap = await getDocs(challengesRef);
        if (challengesSnap.empty) {
          for (const c of CHALLENGES_DATA) {
            await setDoc(doc(challengesRef, c.id), c);
          }
        }

        console.log("Database successfully seeded!");
      } catch (error) {
        console.warn("Failed to seed Firestore database:", error);
      }
    };

    initializeDatabase();
  }, []);

  // 2. Real-Time Listeners
  useEffect(() => {
    const unsubTopics = onSnapshot(collection(db, "topics"), (snap) => {
      const list: Topic[] = [];
      snap.forEach((docSnap) => {
        list.push(docSnap.data() as Topic);
      });
      setTopics(list);
    }, (error) => {
      handleFirestoreError(error, OperationType.GET, "topics");
      setTopics([]);
    });

    const unsubSkills = onSnapshot(collection(db, "skills"), (snap) => {
      const list: Skill[] = [];
      snap.forEach((docSnap) => {
        list.push({ ...(docSnap.data() as Skill), topics: [] });
      });
      setSkills(list);
    }, (error) => {
      handleFirestoreError(error, OperationType.GET, "skills");
      setSkills([]);
    });

    const unsubPaths = onSnapshot(collection(db, "learningPaths"), (snap) => {
      const list: LearningPath[] = [];
      snap.forEach((docSnap) => {
        list.push(docSnap.data() as LearningPath);
      });
      setLearningPaths(list);
    }, (error) => {
      handleFirestoreError(error, OperationType.GET, "learningPaths");
      setLearningPaths([]);
    });

    const unsubCourses = onSnapshot(collection(db, "courses"), (snap) => {
      const list: Course[] = [];
      snap.forEach((docSnap) => {
        const data = docSnap.data();
        list.push({
          id: docSnap.id,
          title: data.title || data.name || "",
          name: data.name || data.title || "",
          skillName: data.skillName || "AI & Automation",
          learningPathId: data.learningPathId || "path-1",
          description: data.description || "",
          published: data.published ?? true,
          featured: data.featured ?? false,
          iconName: data.iconName || "BookOpen",
          sortOrder: data.sortOrder ?? 0,
        } as Course);
      });
      setCourses(list);
    }, (error) => {
      handleFirestoreError(error, OperationType.GET, "courses");
      setCourses([]);
    });

    const unsubProjects = onSnapshot(collection(db, "projects"), (snap) => {
      const list: Project[] = [];
      snap.forEach((docSnap) => {
        list.push(docSnap.data() as Project);
      });
      setProjects(list);
    }, (error) => {
      handleFirestoreError(error, OperationType.GET, "projects");
      setProjects([]);
    });

    const unsubBlog = onSnapshot(collection(db, "blogArticles"), (snap) => {
      const list: BlogArticle[] = [];
      snap.forEach((docSnap) => {
        list.push(docSnap.data() as BlogArticle);
      });
      setBlogArticles(list);
    }, (error) => {
      handleFirestoreError(error, OperationType.GET, "blogArticles");
      setBlogArticles([]);
    });

    const unsubChallenges = onSnapshot(collection(db, "challenges"), (snap) => {
      const list: BusinessChallenge[] = [];
      snap.forEach((docSnap) => {
        list.push(docSnap.data() as BusinessChallenge);
      });
      setChallenges(list);
    }, (error) => {
      handleFirestoreError(error, OperationType.GET, "challenges");
      setChallenges([]);
    });

    return () => {
      unsubTopics();
      unsubSkills();
      unsubPaths();
      unsubCourses();
      unsubProjects();
      unsubBlog();
      unsubChallenges();
    };
  }, []);

  // 4. Merge topics into skills whenever skills or topics change
  useEffect(() => {
    if (skills.length > 0) {
      let changed = false;
      const mergedSkills = skills.map((s) => {
        const skillTopics = topics.filter(
          (t) => t.skillName?.trim().toLowerCase() === s.title?.trim().toLowerCase() && t.published !== false
        );

        const currentIds = (s.topics || []).map((t) => t.id).join(",");
        const newIds = skillTopics.map((t) => t.id).join(",");

        if (currentIds !== newIds) {
          changed = true;
        }

        return {
          ...s,
          topics: skillTopics,
        };
      });

      if (changed) {
        setSkills(mergedSkills);
      }
    }
  }, [skills, topics]);

  // Auth Operations - Refactored for security. Deprecated password-based fallback.
  const loginAsAdmin = (password: string): boolean => {
    console.warn("loginAsAdmin is deprecated for security. Administration is secured with Firebase Auth.");
    return false;
  };

  const logoutAdmin = () => {
    // Properly log out from Firebase Auth to revoke admin privileges instead of clearing localStorage
    signOut(auth).catch((err) => console.error("Error signing out admin:", err));
    setIsAdmin(false);
  };

  // --- SKILLS CRUD ---
  const addSkill = async (newSkill: Omit<Skill, "topics">) => {
    try {
      const id = newSkill.id || newSkill.title.toLowerCase().replace(/[^a-z0-9]+/g, "-");
      const fullSkill = {
        ...newSkill,
        id,
        topics: []
      };
      await setDoc(doc(db, "skills", id), fullSkill);
    } catch (e) {
      console.error("Error adding skill:", e);
    }
  };

  const updateSkill = async (skillId: string, updatedFields: Partial<Skill>) => {
    try {
      const cleanFields = { ...updatedFields };
      delete cleanFields.topics; // exclude nested arrays from metadata document
      await updateDoc(doc(db, "skills", skillId), cleanFields);
    } catch (e) {
      console.error("Error updating skill:", e);
    }
  };

  const deleteSkill = async (skillId: string) => {
    try {
      const skillToDelete = skills.find(s => s.id === skillId);
      await deleteDoc(doc(db, "skills", skillId));

      // Also delete or draft topics referencing this skill
      if (skillToDelete) {
        const topicsToDelete = topics.filter(t => t.skillName === skillToDelete.title);
        for (const t of topicsToDelete) {
          await deleteDoc(doc(db, "topics", t.id));
        }
      }
    } catch (e) {
      console.error("Error deleting skill:", e);
    }
  };

  // --- COURSES CRUD ---
  const addCourse = async (
    courseName: string,
    learningPathId?: string,
    skillName?: string,
    description?: string,
    published?: boolean,
    featured?: boolean,
    iconName?: string,
    sortOrder?: number
  ) => {
    try {
      // Auto-create skill if it doesn't exist
      if (skillName) {
        const skillId = skillName.toLowerCase().replace(/[^a-z0-9]+/g, "-");
        const skillExists = skills.some(s => s.id === skillId || s.title?.toLowerCase() === skillName.toLowerCase());
        if (!skillExists) {
          const fullSkill = {
            id: skillId,
            title: skillName,
            description: `Learning path for mastering ${skillName}.`,
            iconName: "Cpu",
            topics: []
          };
          await setDoc(doc(db, "skills", skillId), fullSkill);
          console.log(`[AUTO-CREATE] Skill '${skillName}' created automatically.`);
        }
      }

      const id = `course-${Date.now()}`;
      let resolvedPathId = learningPathId || "path-1";
      if (!learningPathId && skillName) {
        if (skillName === "AI & Automation" || skillName === "Copywriting") {
          resolvedPathId = "path-1";
        } else if (skillName === "Digital Marketing" || skillName === "E-commerce") {
          resolvedPathId = "path-2";
        }
      }
      const newCourse: Course = {
        id,
        title: courseName,
        name: courseName,
        learningPathId: resolvedPathId,
        skillName: skillName || "AI & Automation",
        description: description || `Study module for ${courseName}.`,
        published: published ?? true,
        featured: featured ?? false,
        iconName: iconName || "BookOpen",
        sortOrder: sortOrder ?? 0,
      };
      await setDoc(doc(db, "courses", id), newCourse);
    } catch (e) {
      console.error("Error adding course:", e);
    }
  };

  const updateCourse = async (
    oldName: string,
    newName: string,
    updatedFields?: Partial<Course>
  ) => {
    try {
      const existingCourse = courses.find(c => c.name === oldName || c.title === oldName);
      if (existingCourse) {
        const docRef = doc(db, "courses", existingCourse.id);
        const updates = {
          title: newName,
          name: newName,
          ...updatedFields
        };
        await updateDoc(docRef, updates);
      }

      const topicsToUpdate = topics.filter(t => t.courseName === oldName);
      for (const t of topicsToUpdate) {
        await updateDoc(doc(db, "topics", t.id), { courseName: newName });
      }
      await addNotification(
        "Course Curriculum Updated",
        `The course "${oldName}" has been updated to "${newName}".`,
        "update"
      );
    } catch (e) {
      console.error("Error updating course name:", e);
    }
  };

  const deleteCourse = async (courseName: string) => {
    try {
      const existingCourse = courses.find(c => c.name === courseName || c.title === courseName);
      if (existingCourse) {
        await deleteDoc(doc(db, "courses", existingCourse.id));
      }

      const topicsToDelete = topics.filter(t => t.courseName === courseName);
      for (const t of topicsToDelete) {
        await deleteDoc(doc(db, "topics", t.id));
      }
    } catch (e) {
      console.error("Error deleting course topics:", e);
    }
  };

  // --- TOPICS CRUD ---
  const addTopic = async (newTopic: Omit<Topic, "id">) => {
    try {
      // Auto-create skill if it doesn't exist
      if (newTopic.skillName) {
        const skillId = newTopic.skillName.toLowerCase().replace(/[^a-z0-9]+/g, "-");
        const skillExists = skills.some(s => s.id === skillId || s.title?.toLowerCase() === newTopic.skillName.toLowerCase());
        if (!skillExists) {
          const fullSkill = {
            id: skillId,
            title: newTopic.skillName,
            description: `Learning path for mastering ${newTopic.skillName}.`,
            iconName: "Cpu",
            topics: []
          };
          await setDoc(doc(db, "skills", skillId), fullSkill);
          console.log(`[AUTO-CREATE-TOPIC] Skill '${newTopic.skillName}' created automatically.`);
        }
      }

      // Auto-create course module if it doesn't exist
      if (newTopic.courseName) {
        const courseExists = courses.some(c => c.name === newTopic.courseName || c.title === newTopic.courseName);
        if (!courseExists) {
          await addCourse(newTopic.courseName, undefined, newTopic.skillName);
          console.log(`[AUTO-CREATE-TOPIC] Course '${newTopic.courseName}' created automatically.`);
        }
      }

      const id = `topic-${Date.now()}`;
      const fullTopic: Topic = {
        ...newTopic,
        id
      };
      await setDoc(doc(db, "topics", id), fullTopic);

      await addNotification(
        "New Video Lesson Published",
        `A new video lesson titled "${fullTopic.title}" has been published in course "${fullTopic.courseName || 'Legacy Fundamentals'}"!`,
        "info"
      );
    } catch (e) {
      console.error("Error adding topic:", e);
    }
  };

  const updateTopic = async (topicId: string, updatedFields: Partial<Topic>) => {
    try {
      // Auto-create skill if it doesn't exist
      if (updatedFields.skillName) {
        const skillId = updatedFields.skillName.toLowerCase().replace(/[^a-z0-9]+/g, "-");
        const skillExists = skills.some(s => s.id === skillId || s.title?.toLowerCase() === updatedFields.skillName.toLowerCase());
        if (!skillExists) {
          const fullSkill = {
            id: skillId,
            title: updatedFields.skillName,
            description: `Learning path for mastering ${updatedFields.skillName}.`,
            iconName: "Cpu",
            topics: []
          };
          await setDoc(doc(db, "skills", skillId), fullSkill);
          console.log(`[AUTO-CREATE-UPDATE] Skill '${updatedFields.skillName}' created automatically.`);
        }
      }

      // Auto-create course module if it doesn't exist
      if (updatedFields.courseName) {
        const courseExists = courses.some(c => c.name === updatedFields.courseName || c.title === updatedFields.courseName);
        if (!courseExists) {
          await addCourse(updatedFields.courseName, undefined, updatedFields.skillName || "AI & Automation");
          console.log(`[AUTO-CREATE-UPDATE] Course '${updatedFields.courseName}' created automatically.`);
        }
      }

      await updateDoc(doc(db, "topics", topicId), updatedFields);
    } catch (e) {
      console.error("Error updating topic:", e);
    }
  };

  const deleteTopic = async (topicId: string) => {
    try {
      await deleteDoc(doc(db, "topics", topicId));
    } catch (e) {
      console.error("Error deleting topic:", e);
    }
  };

  // --- LEARNING PATHS CRUD ---
  const addLearningPath = async (newPath: Omit<LearningPath, "id">) => {
    try {
      const id = `path-${Date.now()}`;
      await setDoc(doc(db, "learningPaths", id), { ...newPath, id });
    } catch (e) {
      console.error("Error adding path:", e);
    }
  };

  const updateLearningPath = async (pathId: string, updatedFields: Partial<LearningPath>) => {
    try {
      await updateDoc(doc(db, "learningPaths", pathId), updatedFields);
    } catch (e) {
      console.error("Error updating path:", e);
    }
  };

  const deleteLearningPath = async (pathId: string) => {
    try {
      await deleteDoc(doc(db, "learningPaths", pathId));
    } catch (e) {
      console.error("Error deleting path:", e);
    }
  };

  // --- IMPORT / EXPORT UTILITIES ---
  const exportToJSON = (): string => {
    return JSON.stringify({ skills, topics, learningPaths }, null, 2);
  };

  const exportToCSV = (): string => {
    const headers = [
      "Skill Name",
      "Course Name",
      "Topic Name",
      "Short Description",
      "Difficulty Level",
      "Estimated Time",
      "Thumbnail",
      "YouTube Video Link",
      "YouTube Playlist Link",
      "Certificate Link",
      "Official Website Link",
      "Notes PDF Link",
      "Assignment PDF",
      "Project File",
      "Download Link",
      "Business Application",
      "Income Opportunity",
      "Islamic Business Insights",
      "Next Topic",
      "Prerequisites",
      "Tags",
      "Featured",
      "Published"
    ];

    const rows = topics.map((t) => [
      t.skillName,
      t.courseName,
      t.title,
      t.shortDescription || "",
      t.difficulty,
      t.duration || "",
      t.thumbnailUrl || "",
      t.videoUrl || "",
      t.youtubePlaylistLink || "",
      t.certificateLink || "",
      t.officialWebsiteLink || "",
      t.notesPdfLink || "",
      t.assignmentPdf || "",
      t.projectFile || "",
      t.downloadLink || "",
      t.businessApplication || "",
      t.incomeOpportunity || "",
      t.islamicInsights || "",
      t.nextTopic || "",
      t.prerequisites || "",
      t.tags || "",
      t.featured ? "Yes" : "No",
      t.published ? "Yes" : "No"
    ]);

    return arrayToCSV(headers, rows);
  };

  const bulkImportJSON = (jsonContent: string) => {
    try {
      const parsed = JSON.parse(jsonContent);
      if (Array.isArray(parsed)) {
        const newTopics = parsed.map((item, idx) => {
          const id = item.id || `topic-import-${Date.now()}-${idx}`;
          return {
            id,
            title: item.title || item.TopicName || "Untitled Topic",
            duration: item.duration || item.EstimatedTime || "15 mins",
            videoUrl: item.videoUrl || item.YouTubeVideoLink || "",
            difficulty: (item.difficulty || item.DifficultyLevel || "Beginner") as any,
            skillName: item.skillName || item.SkillName || "Uncategorized",
            courseName: item.courseName || item.CourseName || "General Course",
            shortDescription: item.shortDescription || item.ShortDescription || "",
            thumbnailUrl: item.thumbnailUrl || item.Thumbnail || "https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=600",
            youtubePlaylistLink: item.youtubePlaylistLink || item.YouTubePlaylistLink || "",
            certificateLink: item.certificateLink || item.CertificateLink || "",
            officialWebsiteLink: item.officialWebsiteLink || item.OfficialWebsiteLink || "",
            notesPdfLink: item.notesPdfLink || item.NotesPDFLink || "",
            assignmentPdf: item.assignmentPdf || item.AssignmentPDF || "",
            projectFile: item.projectFile || item.ProjectFile || "",
            downloadLink: item.downloadLink || item.DownloadLink || "",
            businessApplication: item.businessApplication || item.BusinessApplication || "",
            incomeOpportunity: item.incomeOpportunity || item.IncomeOpportunity || "",
            islamicInsights: item.islamicInsights || item.IslamicBusinessInsights || "",
            nextTopic: item.nextTopic || item.NextTopic || "",
            prerequisites: item.prerequisites || item.Prerequisites || "",
            tags: item.tags || item.Tags || "",
            featured: item.featured === true || String(item.Featured).toLowerCase() === "yes",
            published: item.published !== false && String(item.Publish).toLowerCase() !== "no"
          };
        });

        // Write to Firestore asynchronously
        newTopics.forEach(async (t) => {
          await setDoc(doc(db, "topics", t.id), t);
        });

        // Add corresponding skills
        const uniqueSkillNames = Array.from(new Set(newTopics.map(t => t.skillName)));
        const existingSkillNames = skills.map(s => s.title);

        uniqueSkillNames.forEach(async (name) => {
          if (!existingSkillNames.includes(name)) {
            const id = name.toLowerCase().replace(/[^a-z0-9]+/g, "-");
            await setDoc(doc(db, "skills", id), {
              id,
              title: name,
              description: `Curriculum tracking topics in ${name}.`,
              iconName: "BookOpen",
              topics: []
            });
          }
        });

        return { success: true, count: newTopics.length };
      } else if (parsed.topics && Array.isArray(parsed.topics)) {
        // Full backup import
        if (parsed.skills && Array.isArray(parsed.skills)) {
          parsed.skills.forEach(async (s: any) => {
            const { topics, ...skillMeta } = s;
            await setDoc(doc(db, "skills", s.id), skillMeta);
          });
        }
        if (parsed.topics && Array.isArray(parsed.topics)) {
          parsed.topics.forEach(async (t: any) => {
            await setDoc(doc(db, "topics", t.id), t);
          });
        }
        if (parsed.learningPaths && Array.isArray(parsed.learningPaths)) {
          parsed.learningPaths.forEach(async (p: any) => {
            await setDoc(doc(db, "learningPaths", p.id), p);
          });
        }
        return { success: true, count: parsed.topics.length };
      }

      return { success: false, count: 0, error: "Invalid JSON Schema. Expected an array of topics or a full system backup object." };
    } catch (e: any) {
      return { success: false, count: 0, error: e.message };
    }
  };

  const getYouTubeIdLocal = (url: string): string | null => {
    if (!url) return null;
    const regExp = /^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|\&v=)([^#\&\?]*).*/;
    const match = url.match(regExp);
    return (match && match[2].length === 11) ? match[2] : null;
  };

  const bulkImportCSV = async (csvContent: string) => {
    try {
      const parsedLines = parseCSV(csvContent);
      if (parsedLines.length < 2) {
        return { success: false, count: 0, error: "Empty spreadsheet or missing header columns." };
      }

      const headers = parsedLines[0].map(h => h.toLowerCase().trim());
      
      // Match columns with exact names requested, fallback to loose headers
      const skillIdx = headers.findIndex(h => h === "skill" || h === "skill name" || h.includes("skill"));
      const courseIdx = headers.findIndex(h => h === "course" || h === "course name" || h.includes("course") || h.includes("module"));
      const topicIdx = headers.findIndex(h => h === "topic" || h === "topic name" || h === "title" || h.includes("topic") || h.includes("title") || h === "lesson");
      const videoIdx = headers.findIndex(h => h === "youtube link" || h === "youtube" || h.includes("youtube") || h.includes("video") || h.includes("yt"));
      const certIdx = headers.findIndex(h => h === "certificate link" || h === "certificate" || h.includes("certificate") || h.includes("cert"));
      const webIdx = headers.findIndex(h => h === "website link" || h === "website" || h.includes("website") || (h.includes("link") && !h.includes("youtube") && !h.includes("pdf") && !h.includes("cert")));
      const notesIdx = headers.findIndex(h => h === "pdf link" || h === "pdf" || h.includes("pdf") || h.includes("notes") || h.includes("notes pdf link"));
      const descIdx = headers.findIndex(h => h === "description" || h === "desc" || h.includes("description") || h.includes("short"));

      // Secondary standard fields with default fallback
      const diffIdx = headers.findIndex(h => h.includes("difficulty"));
      const timeIdx = headers.findIndex(h => h.includes("time") || h.includes("duration"));
      const thumbIdx = headers.findIndex(h => h.includes("thumbnail") || h.includes("image"));
      const tagsIdx = headers.findIndex(h => h.includes("tags"));

      const importedTopics: Topic[] = [];

      for (let i = 1; i < parsedLines.length; i++) {
        const row = parsedLines[i];
        if (row.length === 0 || row.every(cell => cell === "")) continue;

        const skillName = skillIdx !== -1 && row[skillIdx] ? row[skillIdx].trim() : "General Core";
        const courseName = courseIdx !== -1 && row[courseIdx] ? row[courseIdx].trim() : "General Core Module";
        const title = topicIdx !== -1 && row[topicIdx] ? row[topicIdx].trim() : `Lesson Topic #${i}`;
        const shortDescription = descIdx !== -1 && row[descIdx] ? row[descIdx].trim() : `${title} lesson outline and curriculum materials.`;
        const difficulty = diffIdx !== -1 && row[diffIdx] ? (row[diffIdx].trim() as any) : "Beginner";
        const duration = timeIdx !== -1 && row[timeIdx] ? row[timeIdx].trim() : "15 mins";
        
        const videoUrl = videoIdx !== -1 && row[videoIdx] ? row[videoIdx].trim() : "";
        const certificateLink = certIdx !== -1 && row[certIdx] ? row[certIdx].trim() : "";
        const officialWebsiteLink = webIdx !== -1 && row[webIdx] ? row[webIdx].trim() : "";
        const notesPdfLink = notesIdx !== -1 && row[notesIdx] ? row[notesIdx].trim() : "";
        const tags = tagsIdx !== -1 && row[tagsIdx] ? row[tagsIdx].trim() : "";

        // Auto-generate thumbnail from YouTube Link if not explicitly specified
        let thumbnailUrl = thumbIdx !== -1 && row[thumbIdx] ? row[thumbIdx].trim() : "";
        if (!thumbnailUrl && videoUrl) {
          const ytid = getYouTubeIdLocal(videoUrl);
          if (ytid) {
            thumbnailUrl = `https://img.youtube.com/vi/${ytid}/hqdefault.jpg`;
          }
        }
        if (!thumbnailUrl) {
          thumbnailUrl = "https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=600";
        }

        importedTopics.push({
          id: `topic-import-${Math.random().toString(36).substring(2, 11)}`,
          title,
          duration,
          videoUrl,
          difficulty: ["Beginner", "Intermediate", "Advanced"].includes(difficulty) ? difficulty : "Beginner",
          skillName,
          courseName,
          shortDescription,
          thumbnailUrl,
          youtubePlaylistLink: "",
          certificateLink,
          officialWebsiteLink,
          notesPdfLink,
          assignmentPdf: "",
          projectFile: "",
          downloadLink: "",
          businessApplication: "",
          incomeOpportunity: "",
          islamicInsights: "",
          nextTopic: "",
          prerequisites: "",
          tags,
          featured: true,
          published: true
        });
      }

      if (importedTopics.length === 0) {
        return { success: false, count: 0, error: "No valid spreadsheet rows detected. Please check headers and data rows." };
      }

      // Write all imported topics to Firestore in parallel and wait for all to complete
      await Promise.all(
        importedTopics.map(async (t) => {
          await setDoc(doc(db, "topics", t.id), t);
        })
      );

      // Create missing skills automatically
      const uniqueSkillNames = Array.from(new Set(importedTopics.map(t => t.skillName).filter(Boolean)));
      const existingSkillNames = skills.map(s => s.title);

      await Promise.all(
        uniqueSkillNames.map(async (name) => {
          if (name && !existingSkillNames.includes(name)) {
            const id = name.toLowerCase().replace(/[^a-z0-9]+/g, "-");
            await setDoc(doc(db, "skills", id), {
              id,
              title: name,
              description: `Curriculum tracking topics in ${name}.`,
              iconName: "BookOpen",
              topics: []
            });
          }
        })
      );

      return { success: true, count: importedTopics.length };
    } catch (e: any) {
      return { success: false, count: 0, error: e.message || "An error occurred during database synchronization." };
    }
  };

  return (
    <CMSContext.Provider
      value={{
        skills,
        topics,
        learningPaths,
        projects,
        blogArticles,
        challenges,
        courses,
        addSkill,
        updateSkill,
        deleteSkill,
        addCourse,
        updateCourse,
        deleteCourse,
        addTopic,
        updateTopic,
        deleteTopic,
        addLearningPath,
        updateLearningPath,
        deleteLearningPath,
        bulkImportCSV,
        bulkImportJSON,
        exportToJSON,
        exportToCSV,
        isAdmin,
        loginAsAdmin,
        logoutAdmin,
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
        studentProfile,
        progressList,
        updateStudentProfile,
        toggleTopicCompletion,
        isTopicCompleted,
        bookmarks,
        toggleBookmark,
        isBookmarked,
        notes,
        saveNote,
        submissions,
        submitProject,
        updateSubmissionStatus,
        quizzes,
        addQuizQuestion,
        submitQuizResult,
        quizScores,
        notifications,
        addNotification,
        markNotificationRead,
        clearAllNotifications,
        sentEmails,
        markEmailRead,
        clearAllEmails,
        activePushToast,
        triggerLivePushToast,
        dismissPushToast,
        simulatedRole,
        setSimulatedRole,
        currentLanguage,
        setLanguage,
        firestoreError
      }}
    >
      {children}
    </CMSContext.Provider>
  );
}

export function useCMS() {
  const context = useContext(CMSContext);
  if (!context) {
    throw new Error("useCMS must be used within a CMSProvider");
  }
  return context;
}
