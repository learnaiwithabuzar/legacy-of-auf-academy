export interface Topic {
  id: string;
  title: string;
  duration: string;
  videoUrl: string;
  difficulty: "Beginner" | "Intermediate" | "Advanced";
  
  // CMS Fields
  skillName?: string;
  courseName?: string;
  shortDescription?: string;
  thumbnailUrl?: string;
  youtubePlaylistLink?: string;
  certificateLink?: string;
  officialWebsiteLink?: string;
  notesPdfLink?: string;
  assignmentPdf?: string;
  projectFile?: string;
  downloadLink?: string;
  businessApplication?: string;
  incomeOpportunity?: string;
  islamicInsights?: string;
  nextTopic?: string;
  prerequisites?: string;
  tags?: string;
  featured?: boolean;
  published?: boolean;
}

export interface Skill {
  id: string;
  title: string;
  description: string;
  iconName: string; // Lucide icon name
  topics: Topic[];
}

export interface LearningPath {
  id: string;
  title: string;
  description: string;
  level: string;
  duration: string;
  modulesCount: number;
  steps: string[];
}

export interface Course {
  id: string;
  name: string;
  learningPathId: string;
  skillName: string;
}

export interface Project {
  id: string;
  studentName: string;
  businessName: string;
  industry: string;
  revenueGenerated?: string;
  achievement: string;
  quote: string;
  avatarUrl: string;
}

export interface BlogArticle {
  id: string;
  title: string;
  category: string;
  date: string;
  readTime: string;
  excerpt: string;
  content: string; // Markdown or plain text content
  author: string;
}

export interface BusinessChallenge {
  id: string;
  title: string;
  description: string;
  reward: string;
  timeRemaining: string;
  difficulty: "Easy" | "Medium" | "Hard";
}

export interface StudentProfile {
  id: string;
  name: string;
  email: string;
  learningGoal?: string;
  bio?: string;
  role?: "Super Admin" | "Teacher" | "Editor" | "Reviewer" | "Student"; // Role Management Simulation
  emailNotificationsEnabled?: boolean;
  pushNotificationsEnabled?: boolean;
  notifyOnNewVideos?: boolean;
  notifyOnCertificates?: boolean;
  notifyOnCourseUpdates?: boolean;
  
  // Custom Portfolio Fields
  skillsList?: string[];
  portfolioProjects?: string;
  resumeUrl?: string;
  linkedinUrl?: string;
  githubUrl?: string;
  twitterUrl?: string;
  isPublicPortfolio?: boolean;
}

export interface TopicProgress {
  topicId: string;
  completed: boolean;
  completedAt: string;
}

export interface QuizQuestion {
  id: string;
  type: "mcq" | "true-false" | "fill-blank" | "short-answer";
  text: string;
  options?: string[]; // only for mcq
  correctAnswer: string; // for fill-blank/short-answer, a keyword or exact match
  explanation?: string;
}

export interface LessonQuiz {
  topicId: string;
  questions: QuizQuestion[];
}

export interface StudentBookmark {
  topicId: string;
  bookmarkedAt: string;
}

export interface StudentNote {
  topicId: string;
  noteText: string;
  updatedAt: string;
}

export interface ProjectSubmission {
  id: string;
  topicId: string;
  topicTitle: string;
  studentId: string;
  studentName: string;
  githubUrl: string;
  submissionText: string;
  status: "Under Review" | "Approved" | "Declined";
  submittedAt: string;
  feedback?: string;
}

export interface AchievementBadge {
  id: string;
  title: string;
  description: string;
  iconName: string; // Lucide icon
  unlockedAt?: string;
  criteria: string;
}

export interface SystemNotification {
  id: string;
  title: string;
  message: string;
  type: "info" | "update" | "success" | "alert";
  timestamp: string;
  read: boolean;
}

export interface SimulatedEmail {
  id: string;
  to: string;
  subject: string;
  bodyHTML: string;
  sentAt: string;
  read: boolean;
  type: "new_video" | "certificate" | "course_update" | "project_grade";
}

