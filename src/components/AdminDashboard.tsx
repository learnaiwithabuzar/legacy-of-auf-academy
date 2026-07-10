import React, { useState, useEffect } from "react";
import * as XLSX from "xlsx";
import { useCMS, parseCSV } from "../store/cmsStore";
import { Topic, Skill } from "../types";
import { aiProvider } from "../services/aiProvider";
import { 
  Lock, LayoutDashboard, BookOpen, Database, Upload, Download, Search, 
  Plus, Edit, Trash2, Check, AlertCircle, Eye, EyeOff, Film, Link, 
  HelpCircle, Sparkles, Folder, Calendar, Users, Award, ExternalLink
} from "lucide-react";

// Helper functions for tolerant skill and course matching across different schemas
function normalize(value: any): string {
  return String(value ?? "").trim().toLowerCase();
}

function getSkillIdentifiers(val: any): string[] {
  if (!val) return [];
  if (typeof val !== "object") {
    return [normalize(val)];
  }
  const fields: string[] = [];
  
  // If the object represents a Skill directly, its primary identifier is its own title or id.
  if (!('skillName' in val) && !('courseName' in val) && !('courseId' in val)) {
    fields.push(val.title);
    fields.push(val.name);
    fields.push(val.id);
  }
  
  // Also push potential skill properties if it's a child object (Course/Topic)
  fields.push(val.skillName);
  fields.push(val.skill);
  fields.push(val.skillId);
  fields.push(val.category);
  fields.push(val.parentSkill);
  
  return fields.map(normalize).filter(Boolean);
}

function skillMatches(a: any, b: any): boolean {
  if (!a || !b) return false;
  const aFields = getSkillIdentifiers(a);
  const bFields = getSkillIdentifiers(b);
  if (aFields.length === 0 || bFields.length === 0) return false;
  return aFields.some(aVal => bFields.some(bVal => aVal === bVal));
}

function getCourseIdentifiers(val: any): string[] {
  if (!val) return [];
  if (typeof val !== "object") {
    return [normalize(val)];
  }
  const fields: string[] = [];
  
  // If the object represents a Course directly, its identity is its own title, name, or id.
  if (!('videoUrl' in val) && !('difficulty' in val)) {
    fields.push(val.title);
    fields.push(val.name);
    fields.push(val.id);
  }
  
  // Child/related course fields
  fields.push(val.courseName);
  fields.push(val.course);
  fields.push(val.courseId);
  
  return fields.map(normalize).filter(Boolean);
}

function courseMatches(a: any, b: any): boolean {
  if (!a || !b) return false;
  const aFields = getCourseIdentifiers(a);
  const bFields = getCourseIdentifiers(b);
  if (aFields.length === 0 || bFields.length === 0) return false;
  return aFields.some(aVal => bFields.some(bVal => aVal === bVal));
}

export default function AdminDashboard() {
  const {
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
    bulkImportCSV,
    bulkImportJSON,
    exportToJSON,
    exportToCSV,
    isAdmin,
    loginAsAdmin,
    logoutAdmin,
    quizzes,
    addQuizQuestion,
    submissions,
    updateSubmissionStatus,
    addNotification
  } = useCMS();

  // Auth States
  const [password, setPassword] = useState("");
  const [authError, setAuthError] = useState("");

  // CMS States
  const [activeTab, setActiveTab] = useState<
    "overview" | "skills" | "topics" | "paths" | "import" | "edit-content" | "playlist-import" | "quiz-builder" | "homework-review"
  >("edit-content");

  // YouTube Playlist Auto-Import States
  const [playlistUrl, setPlaylistUrl] = useState("");
  const [playlistSkill, setPlaylistSkill] = useState("");
  const [playlistCourse, setPlaylistCourse] = useState("");
  const [playlistLoading, setPlaylistLoading] = useState(false);
  const [playlistResult, setPlaylistResult] = useState<string | null>(null);

  // Quiz Builder States
  const [quizTopicId, setQuizTopicId] = useState("");
  const [quizQuestionText, setQuizQuestionText] = useState("");
  const [quizOption1, setQuizOption1] = useState("");
  const [quizOption2, setQuizOption2] = useState("");
  const [quizOption3, setQuizOption3] = useState("");
  const [quizOption4, setQuizOption4] = useState("");
  const [quizCorrectIndex, setQuizCorrectIndex] = useState(0);
  const [quizExplanation, setQuizExplanation] = useState("");
  const [quizSuccessMsg, setQuizSuccessMsg] = useState("");

  // Homework Review States
  const [reviewFeedback, setReviewFeedback] = useState("");
  
  // Edit Content Workflow States
  const [workflowSkill, setWorkflowSkill] = useState("");
  const [workflowCourse, setWorkflowCourse] = useState("");
  const [workflowTopicId, setWorkflowTopicId] = useState("");
  const [isNewTopicMode, setIsNewTopicMode] = useState(false);
  const [isFetchingTitle, setIsFetchingTitle] = useState(false);
  const [fetchedTitle, setFetchedTitle] = useState("");
  const [youtubeError, setYoutubeError] = useState("");
  
  // Search & Filter States
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedSkillFilter, setSelectedSkillFilter] = useState("");
  const [selectedCourseFilter, setSelectedCourseFilter] = useState("");
  const [selectedStatusFilter, setSelectedStatusFilter] = useState("");

  // CRUD Modal / Form States
  const [isTopicModalOpen, setIsTopicModalOpen] = useState(false);
  const [editingTopicId, setEditingTopicId] = useState<string | null>(null);

  // 22+ Field Topic Form
  const [topicForm, setTopicForm] = useState({
    title: "",
    duration: "15 mins",
    videoUrl: "",
    difficulty: "Beginner" as "Beginner" | "Intermediate" | "Advanced",
    skillName: "",
    courseName: "",
    shortDescription: "",
    thumbnailUrl: "",
    youtubePlaylistLink: "",
    certificateLink: "",
    officialWebsiteLink: "",
    notesPdfLink: "",
    assignmentPdf: "",
    projectFile: "",
    downloadLink: "",
    businessApplication: "",
    incomeOpportunity: "",
    islamicInsights: "",
    nextTopic: "",
    prerequisites: "",
    tags: "",
    featured: true,
    published: true
  });

  // Skill Form State
  const [skillForm, setSkillForm] = useState({
    title: "",
    description: "",
    iconName: "Cpu"
  });
  const [editingSkillId, setEditingSkillId] = useState<string | null>(null);

  // Bulk Upload States
  const [importType, setImportType] = useState<"csv" | "excel" | "sheets" | "json">("csv");
  const [rawImportText, setRawImportText] = useState("");
  const [googleSheetsUrl, setGoogleSheetsUrl] = useState("");
  const [isFetchingSheet, setIsFetchingSheet] = useState(false);
  const [isDragging, setIsDragging] = useState(false);
  const [importResult, setImportResult] = useState<{ success: boolean; message: string } | null>(null);

  // URL Validation Helpers
  const getYouTubeId = (url: string): string | null => {
    if (!url) return null;
    const regExp = /^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|\&v=)([^#\&\?]*).*/;
    const match = url.match(regExp);
    return (match && match[2].length === 11) ? match[2] : null;
  };

  const isValidUrl = (url: string): boolean => {
    if (!url) return true; // optional fields are valid when empty
    try {
      new URL(url);
      return true;
    } catch (_) {
      return false;
    }
  };

  // Pre-fill Skill Default
  useEffect(() => {
    if (skills.length > 0 && !topicForm.skillName) {
      setTopicForm(prev => ({ ...prev, skillName: skills[0].title }));
    }
  }, [skills]);

  // Auth Form Handler
  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    const success = loginAsAdmin(password);
    if (success) {
      setAuthError("");
      setPassword("");
    } else {
      setAuthError("Incorrect password. Please use 'aufadmin786' or 'admin'.");
    }
  };

  // Helper to validate and resolve skill and course
  const validateAndResolveSkillAndCourse = (isWorkflow: boolean) => {
    // Before validation, rebuild both values from the latest selected dropdowns or modal inputs.
    const resolvedSkill = (isWorkflow ? workflowSkill : topicForm.skillName || "").trim();
    const resolvedCourse = (isWorkflow ? workflowCourse : topicForm.courseName || "").trim();

    if (!resolvedSkill) {
      alert("Please specify a Skill!");
      return { isValid: false, finalSkillName: "", finalCourseName: "", selectedSkill: null, selectedCourse: null };
    }

    if (!resolvedCourse) {
      alert("Please specify a Course Module!");
      return { isValid: false, finalSkillName: "", finalCourseName: "", selectedSkill: null, selectedCourse: null };
    }

    const selectedSkill = skills.find(s => skillMatches(s, resolvedSkill));
    const finalSkillName = selectedSkill ? selectedSkill.title : resolvedSkill;

    const selectedCourse = courses.find(c => courseMatches(c, resolvedCourse));
    const finalCourseName = selectedCourse 
      ? (selectedCourse.title || selectedCourse.name || (selectedCourse as any).courseName || (selectedCourse as any).courseId || selectedCourse.id || resolvedCourse) 
      : resolvedCourse;

    console.log("[DEBUG 8-11. RESOLVE SKILL & COURSE]", {
      isWorkflow,
      resolvedSkill,
      resolvedCourse,
      "8. selectedSkill": selectedSkill,
      "9. selectedCourse": selectedCourse,
      "10. finalSkillName": finalSkillName,
      "11. finalCourseName": finalCourseName
    });

    return {
      isValid: true,
      finalSkillName,
      finalCourseName,
      selectedSkill,
      selectedCourse
    };
  };

  // State Tracking logs on every change
  useEffect(() => {
    console.log("[DEBUG CMS DATA FLOW STATE CHANGE]", {
      "1. skills": skills,
      "2. courses": courses,
      "3. topics": topics,
      "4. workflowSkill": workflowSkill,
      "5. workflowCourse": workflowCourse,
      "6. workflowTopicId": workflowTopicId,
      "7. topicForm": topicForm
    });
  }, [skills, courses, topics, workflowSkill, workflowCourse, workflowTopicId, topicForm]);

  // State synchronization effects to automatically update topicForm
  useEffect(() => {
    if (workflowSkill) {
      setTopicForm(prev => ({ ...prev, skillName: workflowSkill }));
    }
  }, [workflowSkill]);

  useEffect(() => {
    if (workflowCourse) {
      setTopicForm(prev => ({ ...prev, courseName: workflowCourse }));
    }
  }, [workflowCourse]);

  // Save Topic (Add/Edit)
  const handleSaveTopic = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!topicForm.title) {
      alert("Please specify a Topic Name!");
      return;
    }

    const { isValid, finalSkillName, finalCourseName, selectedSkill, selectedCourse } = 
      validateAndResolveSkillAndCourse(false); // Modal context

    if (!isValid) return;

    const topicData = {
      ...topicForm,
      courseName: finalCourseName,
      skillName: finalSkillName,
      published: topicForm.published !== false,
      featured: topicForm.featured === true,
    };

    console.log("[DEBUG 12. BEFORE FIRESTORE SAVE - Topic Modal]", {
      editingTopicId,
      documentToWrite: topicData
    });

    if (editingTopicId) {
      await updateTopic(editingTopicId, topicData);
    } else {
      await addTopic(topicData);
    }

    console.log("[DEBUG 13. AFTER FIRESTORE SAVE - Topic Modal]", {
      savedDocument: topicData
    });

    // Reset Form
    setIsTopicModalOpen(false);
    setEditingTopicId(null);
    setTopicForm({
      title: "",
      duration: "15 mins",
      videoUrl: "",
      difficulty: "Beginner",
      skillName: skills[0]?.title || "",
      courseName: courses[0]?.name || "General Core Module",
      shortDescription: "",
      thumbnailUrl: "",
      youtubePlaylistLink: "",
      certificateLink: "",
      officialWebsiteLink: "",
      notesPdfLink: "",
      assignmentPdf: "",
      projectFile: "",
      downloadLink: "",
      businessApplication: "",
      incomeOpportunity: "",
      islamicInsights: "",
      nextTopic: "",
      prerequisites: "",
      tags: "",
      featured: true,
      published: true
    });
  };

  // Automated YouTube Video URL Handler with title-fetching & thumbnail-generation
  const handleYoutubeUrlChange = async (url: string) => {
    setTopicForm(prev => ({ ...prev, videoUrl: url }));
    setYoutubeError("");
    setFetchedTitle("");

    if (!url) return;

    // Validate YouTube URL
    const videoId = getYouTubeId(url);
    if (!videoId) {
      setYoutubeError("Please paste a valid YouTube watch or share URL.");
      return;
    }

    // Auto-generate high-quality YouTube thumbnail
    const thumbnail = `https://img.youtube.com/vi/${videoId}/hqdefault.jpg`;
    setTopicForm(prev => ({ ...prev, thumbnailUrl: thumbnail }));

    // Fetch original YouTube title via CORS-enabled noembed proxy
    try {
      setIsFetchingTitle(true);
      const response = await fetch(`https://noembed.com/embed?url=${encodeURIComponent(url)}`);
      if (response.ok) {
        const data = await response.json();
        if (data && data.title) {
          setFetchedTitle(data.title);
        }
      }
    } catch (err) {
      console.error("Error calling oEmbed for YouTube title:", err);
    } finally {
      setIsFetchingTitle(false);
    }
  };

  // Save workflow topic in the WordPress-style content editor page
  const handleSaveWorkflowTopic = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!topicForm.title) {
      alert("Please specify a Topic Name!");
      return;
    }

    const { isValid, finalSkillName, finalCourseName, selectedSkill, selectedCourse } = 
      validateAndResolveSkillAndCourse(true); // Workflow context

    if (!isValid) return;

    const topicData = {
      ...topicForm,
      courseName: finalCourseName,
      skillName: finalSkillName,
      published: topicForm.published !== false,
      featured: topicForm.featured === true,
    };

    console.log("[DEBUG 12. BEFORE FIRESTORE SAVE - Workflow Editor]", {
      isNewTopicMode,
      workflowTopicId,
      documentToWrite: topicData
    });

    if (isNewTopicMode) {
      await addTopic(topicData);
      setIsNewTopicMode(false);
      alert(`Success! "${topicData.title}" has been created and saved to Firestore!`);
    } else if (workflowTopicId) {
      await updateTopic(workflowTopicId, topicData);
      alert(`Success! "${topicData.title}" has been updated in Firestore instantly!`);
    } else {
      alert("No active topic selected to save. Please toggle 'Create New Topic' or select a topic.");
    }

    console.log("[DEBUG 13. AFTER FIRESTORE SAVE - Workflow Editor]", {
      savedDocument: topicData
    });
  };

  // 1. Pre-fill workflow skill selector on mount
  useEffect(() => {
    if (skills.length > 0 && !workflowSkill) {
      setWorkflowSkill(skills[0].title);
    }
  }, [skills]);

  // 2. Drive workflow course selector based on selected skill
  useEffect(() => {
    if (workflowSkill) {
      const coursesInSkill = courses
        .filter(c => skillMatches(c, workflowSkill))
        .map(c => c.title || c.name);
      if (coursesInSkill.length > 0) {
        const isCurrentValid = coursesInSkill.some(name => courseMatches(name, workflowCourse));
        if (!isCurrentValid) {
          setWorkflowCourse(coursesInSkill[0]);
        }
      } else {
        setWorkflowCourse("");
      }
    } else {
      setWorkflowCourse("");
    }
  }, [workflowSkill, courses]);

  // 3. Drive workflow topic selector based on skill + course
  useEffect(() => {
    if (workflowSkill && workflowCourse) {
      const topicsInCourse = topics.filter(t => skillMatches(t, workflowSkill) && courseMatches(t, workflowCourse));
      if (topicsInCourse.length > 0) {
        if (!isNewTopicMode) {
          // Keep selection if it exists, otherwise pick the first
          const currentValid = topicsInCourse.some(t => t.id === workflowTopicId);
          if (!currentValid) {
            setWorkflowTopicId(topicsInCourse[0].id);
          }
        }
      } else if (!isNewTopicMode) {
        setWorkflowTopicId("");
      }
    } else if (!isNewTopicMode) {
      setWorkflowTopicId("");
    }
  }, [workflowSkill, workflowCourse, topics, isNewTopicMode]);

  // 4. Update core form state when current selected topic changes (or on new mode toggle)
  useEffect(() => {
    if (workflowTopicId && !isNewTopicMode) {
      const selectedTopic = topics.find(t => t.id === workflowTopicId);
      if (selectedTopic) {
        setTopicForm({
          title: selectedTopic.title,
          duration: selectedTopic.duration || "15 mins",
          videoUrl: selectedTopic.videoUrl || "",
          difficulty: selectedTopic.difficulty || "Beginner",
          skillName: selectedTopic.skillName || workflowSkill,
          courseName: selectedTopic.courseName || workflowCourse,
          shortDescription: selectedTopic.shortDescription || "",
          thumbnailUrl: selectedTopic.thumbnailUrl || "",
          youtubePlaylistLink: selectedTopic.youtubePlaylistLink || "",
          certificateLink: selectedTopic.certificateLink || "",
          officialWebsiteLink: selectedTopic.officialWebsiteLink || "",
          notesPdfLink: selectedTopic.notesPdfLink || "",
          assignmentPdf: selectedTopic.assignmentPdf || "",
          projectFile: selectedTopic.projectFile || "",
          downloadLink: selectedTopic.downloadLink || "",
          businessApplication: selectedTopic.businessApplication || "",
          incomeOpportunity: selectedTopic.incomeOpportunity || "",
          islamicInsights: selectedTopic.islamicInsights || "",
          nextTopic: selectedTopic.nextTopic || "",
          prerequisites: selectedTopic.prerequisites || "",
          tags: selectedTopic.tags || "",
          featured: selectedTopic.featured !== false,
          published: selectedTopic.published !== false
        });
        setFetchedTitle("");
        setYoutubeError("");
      }
    } else if (isNewTopicMode) {
      setTopicForm({
        title: "",
        duration: "15 mins",
        videoUrl: "",
        difficulty: "Beginner",
        skillName: workflowSkill,
        courseName: workflowCourse,
        shortDescription: "",
        thumbnailUrl: "",
        youtubePlaylistLink: "",
        certificateLink: "",
        officialWebsiteLink: "",
        notesPdfLink: "",
        assignmentPdf: "",
        projectFile: "",
        downloadLink: "",
        businessApplication: "",
        incomeOpportunity: "",
        islamicInsights: "",
        nextTopic: "",
        prerequisites: "",
        tags: "",
        featured: true,
        published: true
      });
      setFetchedTitle("");
      setYoutubeError("");
    } else if (!workflowTopicId && !isNewTopicMode) {
      // Clear form when no topics exist in the current selection and we aren't in new topic mode
      setTopicForm({
        title: "",
        duration: "15 mins",
        videoUrl: "",
        difficulty: "Beginner",
        skillName: workflowSkill,
        courseName: workflowCourse,
        shortDescription: "",
        thumbnailUrl: "",
        youtubePlaylistLink: "",
        certificateLink: "",
        officialWebsiteLink: "",
        notesPdfLink: "",
        assignmentPdf: "",
        projectFile: "",
        downloadLink: "",
        businessApplication: "",
        incomeOpportunity: "",
        islamicInsights: "",
        nextTopic: "",
        prerequisites: "",
        tags: "",
        featured: true,
        published: true
      });
      setFetchedTitle("");
      setYoutubeError("");
    }
  }, [workflowTopicId, isNewTopicMode, workflowSkill, workflowCourse, topics]);

  // Open Topic Edit
  const handleEditTopicClick = (topic: Topic) => {
    setEditingTopicId(topic.id);
    setTopicForm({
      title: topic.title,
      duration: topic.duration,
      videoUrl: topic.videoUrl,
      difficulty: topic.difficulty,
      skillName: topic.skillName,
      courseName: topic.courseName,
      shortDescription: topic.shortDescription || "",
      thumbnailUrl: topic.thumbnailUrl || "",
      youtubePlaylistLink: topic.youtubePlaylistLink || "",
      certificateLink: topic.certificateLink || "",
      officialWebsiteLink: topic.officialWebsiteLink || "",
      notesPdfLink: topic.notesPdfLink || "",
      assignmentPdf: topic.assignmentPdf || "",
      projectFile: topic.projectFile || "",
      downloadLink: topic.downloadLink || "",
      businessApplication: topic.businessApplication || "",
      incomeOpportunity: topic.incomeOpportunity || "",
      islamicInsights: topic.islamicInsights || "",
      nextTopic: topic.nextTopic || "",
      prerequisites: topic.prerequisites || "",
      tags: topic.tags || "",
      featured: topic.featured !== false,
      published: topic.published !== false
    });
    setIsTopicModalOpen(true);
  };

  // Handle Skill Form Save
  const handleSaveSkill = (e: React.FormEvent) => {
    e.preventDefault();
    if (!skillForm.title) {
      alert("Please specify a Skill Title!");
      return;
    }

    if (editingSkillId) {
      updateSkill(editingSkillId, skillForm);
      setEditingSkillId(null);
    } else {
      addSkill({
        id: skillForm.title.toLowerCase().replace(/[^a-z0-9]+/g, "-"),
        title: skillForm.title,
        description: skillForm.description,
        iconName: skillForm.iconName
      });
    }

    setSkillForm({ title: "", description: "", iconName: "Cpu" });
  };

  // Process loaded files (supports CSV, Excel (.xlsx, .xls), and JSON backups)
  const processFile = (file: File) => {
    const extension = file.name.split(".").pop()?.toLowerCase();
    
    if (extension === "xlsx" || extension === "xls") {
      setImportType("excel");
      const reader = new FileReader();
      reader.onload = (event) => {
        try {
          const data = new Uint8Array(event.target?.result as ArrayBuffer);
          const workbook = XLSX.read(data, { type: "array" });
          const firstSheetName = workbook.SheetNames[0];
          const worksheet = workbook.Sheets[firstSheetName];
          const csvText = XLSX.utils.sheet_to_csv(worksheet);
          setRawImportText(csvText);
          setImportResult({
            success: true,
            message: `Excel sheet "${file.name}" loaded successfully! Ready to import and auto-create courses/topics.`
          });
        } catch (err: any) {
          setImportResult({
            success: false,
            message: `Failed to read Excel file: ${err.message}`
          });
        }
      };
      reader.readAsArrayBuffer(file);
    } else if (extension === "csv") {
      setImportType("csv");
      const reader = new FileReader();
      reader.onload = (event) => {
        const text = event.target?.result as string;
        setRawImportText(text);
        setImportResult({
          success: true,
          message: `CSV file "${file.name}" loaded successfully! Ready to import and auto-create courses/topics.`
        });
      };
      reader.readAsText(file);
    } else if (extension === "json") {
      setImportType("json");
      const reader = new FileReader();
      reader.onload = (event) => {
        const text = event.target?.result as string;
        setRawImportText(text);
        setImportResult({
          success: true,
          message: `JSON backup "${file.name}" loaded successfully! Ready to restore.`
        });
      };
      reader.readAsText(file);
    } else {
      setImportResult({
        success: false,
        message: `Unsupported file type: .${extension}. Please upload a CSV, Excel (.xlsx), or JSON file.`
      });
    }
  };

  // Drag & Drop Handlers
  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = () => {
    setIsDragging(false);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    const file = e.dataTransfer.files?.[0];
    if (file) {
      processFile(file);
    }
  };

  // Handle manual file selection
  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      processFile(file);
    }
  };

  // Fetch Google Sheet from standard shared URL or published CSV URL
  const handleFetchGoogleSheet = async () => {
    if (!googleSheetsUrl.trim()) {
      setImportResult({ success: false, message: "Please paste a Google Sheets shared link first!" });
      return;
    }

    setIsFetchingSheet(true);
    setImportResult(null);

    let targetUrl = googleSheetsUrl.trim();

    // Convert standard Google Sheets URL to direct CSV export URL
    const spreadsheetIdMatch = targetUrl.match(/\/spreadsheets\/d\/([a-zA-Z0-9-_]+)/);
    if (spreadsheetIdMatch && !targetUrl.includes("/export")) {
      const spreadsheetId = spreadsheetIdMatch[1];
      targetUrl = `https://docs.google.com/spreadsheets/d/${spreadsheetId}/export?format=csv`;
    }

    try {
      const response = await fetch(targetUrl);
      if (!response.ok) {
        throw new Error(`Google Sheets servers responded with HTTP status ${response.status}`);
      }
      const text = await response.text();
      
      if (text.includes("html") || text.includes("<!DOCTYPE html>")) {
        throw new Error("Received an HTML page instead of a CSV stream. Please make sure the sheet has link sharing set to 'Anyone with the link can view' or is 'Published to the Web'!");
      }

      setRawImportText(text);
      setImportResult({
        success: true,
        message: "Google Sheets data successfully fetched and prepared for sync!"
      });
    } catch (err: any) {
      console.error(err);
      setImportResult({
        success: false,
        message: `Could not retrieve sheet data automatically due to browser CORS policies. To bypass this, please click "File" -> "Share" -> "Publish to Web", select "Comma-separated values (.csv)", and paste the resulting link here!`
      });
    } finally {
      setIsFetchingSheet(false);
    }
  };

  // Execute Bulk Upload
  const handleExecuteImport = async () => {
    if (!rawImportText.trim()) {
      setImportResult({ success: false, message: "Please load some spreadsheet data first!" });
      return;
    }

    setImportResult(null);
    let result;
    if (importType === "json") {
      result = bulkImportJSON(rawImportText);
    } else {
      // Excel, CSV, and Google Sheets are all parsed as CSV text!
      result = await bulkImportCSV(rawImportText);
    }

    if (result.success) {
      setImportResult({
        success: true,
        message: `Successfully uploaded & imported ${result.count} topics and created all associated courses & skills automatically!`
      });
      setRawImportText("");
      setGoogleSheetsUrl("");
    } else {
      setImportResult({
        success: false,
        message: `Import failed: ${result.error || "Malformed file schema."}`
      });
    }
  };

  // Export File Trigger
  const triggerDownload = (content: string, filename: string, contentType: string) => {
    const blob = new Blob([content], { type: contentType });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = filename;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  // Filter Topics
  const filteredTopics = topics.filter((t) => {
    const query = searchQuery.toLowerCase();
    const matchSearch = 
      t.title.toLowerCase().includes(query) ||
      t.skillName.toLowerCase().includes(query) ||
      t.courseName.toLowerCase().includes(query) ||
      (t.tags && t.tags.toLowerCase().includes(query));

    const matchSkill = !selectedSkillFilter || skillMatches(t, selectedSkillFilter);
    const matchCourse = !selectedCourseFilter || courseMatches(t, selectedCourseFilter);
    
    let matchStatus = true;
    if (selectedStatusFilter === "published") matchStatus = t.published !== false;
    if (selectedStatusFilter === "draft") matchStatus = t.published === false;
    if (selectedStatusFilter === "featured") matchStatus = t.featured !== false;

    return matchSearch && matchSkill && matchCourse && matchStatus;
  });

  // Calculate stats
  const totalTopics = topics.length;
  const publishedTopics = topics.filter(t => t.published !== false).length;
  const draftTopics = topics.filter(t => t.published === false).length;
  const totalCourses = courses.length;

  // Render Admin Login if not authenticated
  if (!isAdmin) {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center px-4 py-24 relative overflow-hidden bg-islamic-pattern">
        {/* Ambient background glows */}
        <div className="absolute top-1/4 left-1/4 h-72 w-72 rounded-full bg-emerald-accent/10 blur-[100px]" />
        <div className="absolute bottom-1/4 right-1/4 h-72 w-72 rounded-full bg-gold/15 blur-[100px]" />

        <div className="relative w-full max-w-md rounded-2xl border border-gold/15 bg-neutral-950 p-8 shadow-2xl glass-panel animate-fade-in">
          {/* Logo Symbol */}
          <div className="mx-auto h-16 w-16 flex items-center justify-center rounded-full border border-gold/30 bg-emerald-deep/20 text-gold mb-6 shadow-glow">
            <Lock className="h-7 w-7" />
          </div>

          <div className="text-center mb-8">
            <h2 className="font-serif text-2xl font-bold text-white tracking-wide">
              Academy Auf CMS
            </h2>
            <p className="mt-2 font-sans text-xs text-neutral-400">
              Unlock the administration console to update lesson streams, certificates, and course models instantly.
            </p>
          </div>

          <form onSubmit={handleLogin} className="space-y-6">
            <div>
              <label className="block font-serif text-xs font-semibold text-gold uppercase tracking-wider mb-2">
                Administration Code
              </label>
              <input
                id="admin-password-input"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Enter secret passphrase..."
                className="w-full rounded-lg border border-gold/20 bg-black/60 px-4 py-3 font-mono text-sm text-white text-center tracking-widest focus:border-gold focus:outline-none focus:ring-1 focus:ring-gold"
                autoFocus
              />
              <span className="block mt-2 font-sans text-[10px] text-neutral-500 text-center">
                Default credentials for development is: <code className="text-gold">admin</code> or <code className="text-gold">aufadmin786</code>
              </span>
            </div>

            {authError && (
              <div className="flex items-start gap-2.5 rounded-lg border border-red-500/20 bg-red-500/10 p-3 text-xs text-red-400">
                <AlertCircle className="h-4 w-4 shrink-0 mt-0.5" />
                <span>{authError}</span>
              </div>
            )}

            <button
              id="admin-login-submit-btn"
              type="submit"
              className="w-full rounded bg-gradient-to-r from-gold via-gold-light to-gold-dark py-3.5 text-xs font-mono uppercase tracking-widest text-black font-extrabold hover:opacity-95 active:scale-[0.99] transition-all"
            >
              Sign In to Console
            </button>
          </form>
        </div>
      </div>
    );
  }

  // Render CMS Administration panel
  return (
    <div className="min-h-screen bg-black text-neutral-300 font-sans pb-24 border-b border-gold/10">
      
      {/* 1. Prestigious Hero/Admin Header */}
      <div className="relative px-4 py-12 bg-neutral-950 border-b border-gold/15 bg-islamic-pattern">
        <div className="mx-auto max-w-7xl flex flex-col md:flex-row md:items-center md:justify-between gap-6">
          <div>
            <div className="flex items-center gap-2 mb-2">
              <span className="font-mono text-xs uppercase tracking-widest text-gold bg-gold/10 px-2 py-0.5 rounded">
                ✦ Noble Core CMS
              </span>
              <span className="font-mono text-[10px] text-emerald-accent border border-emerald-accent/20 px-1.5 py-0.5 rounded bg-emerald-deep/10">
                ACTIVE
              </span>
            </div>
            <h1 className="font-serif text-3xl font-bold text-white tracking-wide text-glow-gold">
              Legacy of Auf CMS
            </h1>
            <p className="mt-1 text-xs text-neutral-400 max-w-xl">
              WordPress-grade custom visual engine. Update course modules, bulk upload spreadsheets, validate media feeds, and commit real-time changes instantly.
            </p>
          </div>

          <div className="flex items-center gap-3 shrink-0">
            <button
              id="cms-export-json-btn"
              onClick={() => triggerDownload(exportToJSON(), "loa-system-backup.json", "application/json")}
              className="inline-flex items-center gap-1.5 rounded border border-neutral-800 bg-neutral-900 px-3.5 py-2 text-xs font-mono text-neutral-300 hover:bg-neutral-800 hover:text-white transition"
              title="Backup entire system data including paths, blogs, and topics"
            >
              <Download className="h-3.5 w-3.5" />
              <span>Full Backup</span>
            </button>

            <button
              id="cms-logout-btn"
              onClick={logoutAdmin}
              className="inline-flex items-center gap-1.5 rounded bg-red-950/40 border border-red-500/20 px-3.5 py-2 text-xs font-mono text-red-400 hover:bg-red-900 hover:text-white hover:border-red-500 transition"
            >
              <EyeOff className="h-3.5 w-3.5" />
              <span>Exit Console</span>
            </button>
          </div>
        </div>
      </div>

      {/* 2. Unified Overview Metrics bar */}
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 mt-8">
        <div className="grid grid-cols-2 gap-4 sm:grid-cols-4">
          <div className="rounded-xl border border-gold/10 bg-neutral-950/80 p-5 glass-panel">
            <span className="block text-[10px] font-mono uppercase tracking-widest text-neutral-400 mb-1">Total Topics</span>
            <span className="font-serif text-2xl font-bold text-white">{totalTopics}</span>
            <span className="block text-[9px] font-mono text-neutral-500 mt-1">Sovereign Lessons</span>
          </div>

          <div className="rounded-xl border border-gold/10 bg-neutral-950/80 p-5 glass-panel">
            <span className="block text-[10px] font-mono uppercase tracking-widest text-emerald-accent mb-1">Published</span>
            <span className="font-serif text-2xl font-bold text-emerald-400">{publishedTopics}</span>
            <span className="block text-[9px] font-mono text-emerald-600 mt-1">Live on Website</span>
          </div>

          <div className="rounded-xl border border-gold/10 bg-neutral-950/80 p-5 glass-panel">
            <span className="block text-[10px] font-mono uppercase tracking-widest text-yellow-500 mb-1">Drafts</span>
            <span className="font-serif text-2xl font-bold text-yellow-500">{draftTopics}</span>
            <span className="block text-[9px] font-mono text-yellow-600 mt-1">Pending Review</span>
          </div>

          <div className="rounded-xl border border-gold/10 bg-neutral-950/80 p-5 glass-panel">
            <span className="block text-[10px] font-mono uppercase tracking-widest text-gold mb-1">Total Skills</span>
            <span className="font-serif text-2xl font-bold text-gold">{skills.length}</span>
            <span className="block text-[9px] font-mono text-gold-light/60 mt-1">Tactical Domains</span>
          </div>
        </div>
      </div>

      {/* 3. Navigation Tabs */}
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 mt-8">
        <div className="flex border-b border-neutral-800 gap-1 overflow-x-auto pb-[1px]">
          <button
            onClick={() => setActiveTab("edit-content")}
            className={`flex items-center gap-2 border-b-2 px-5 py-3 text-xs font-medium tracking-wide transition-all shrink-0 ${
              activeTab === "edit-content"
                ? "border-gold text-gold bg-emerald-deep/10 font-bold"
                : "border-transparent text-white font-semibold"
            }`}
          >
            <Edit className="h-4 w-4 text-gold animate-pulse" />
            <span>Edit Content Workflow</span>
          </button>

          <button
            onClick={() => setActiveTab("overview")}
            className={`flex items-center gap-2 border-b-2 px-5 py-3 text-xs font-medium tracking-wide transition-all shrink-0 ${
              activeTab === "overview"
                ? "border-gold text-gold bg-emerald-deep/10 font-bold"
                : "border-transparent text-neutral-400 hover:text-white"
            }`}
          >
            <LayoutDashboard className="h-4 w-4" />
            <span>Manage Topics Database</span>
          </button>

          <button
            onClick={() => setActiveTab("skills")}
            className={`flex items-center gap-2 border-b-2 px-5 py-3 text-xs font-medium tracking-wide transition-all shrink-0 ${
              activeTab === "skills"
                ? "border-gold text-gold bg-emerald-deep/10 font-bold"
                : "border-transparent text-neutral-400 hover:text-white"
            }`}
          >
            <BookOpen className="h-4 w-4" />
            <span>Skills & Courses</span>
          </button>

          <button
            onClick={() => setActiveTab("import")}
            className={`flex items-center gap-2 border-b-2 px-5 py-3 text-xs font-medium tracking-wide transition-all shrink-0 ${
              activeTab === "import"
                ? "border-gold text-gold bg-emerald-deep/10 font-bold"
                : "border-transparent text-neutral-400 hover:text-white"
            }`}
          >
            <Upload className="h-4 w-4" />
            <span>Bulk Upload (CSV / JSON)</span>
          </button>

          <button
            onClick={() => setActiveTab("playlist-import")}
            className={`flex items-center gap-2 border-b-2 px-5 py-3 text-xs font-medium tracking-wide transition-all shrink-0 ${
              activeTab === "playlist-import"
                ? "border-gold text-gold bg-emerald-deep/10 font-bold"
                : "border-transparent text-neutral-400 hover:text-white"
            }`}
          >
            <Film className="h-4 w-4" />
            <span>YouTube Playlist Auto-Import</span>
          </button>

          <button
            onClick={() => setActiveTab("quiz-builder")}
            className={`flex items-center gap-2 border-b-2 px-5 py-3 text-xs font-medium tracking-wide transition-all shrink-0 ${
              activeTab === "quiz-builder"
                ? "border-gold text-gold bg-emerald-deep/10 font-bold"
                : "border-transparent text-neutral-400 hover:text-white"
            }`}
          >
            <HelpCircle className="h-4 w-4" />
            <span>Quiz Builder</span>
          </button>

          <button
            onClick={() => setActiveTab("homework-review")}
            className={`flex items-center gap-2 border-b-2 px-5 py-3 text-xs font-medium tracking-wide transition-all shrink-0 ${
              activeTab === "homework-review"
                ? "border-gold text-gold bg-emerald-deep/10 font-bold"
                : "border-transparent text-neutral-400 hover:text-white"
            }`}
          >
            <Users className="h-4 w-4" />
            <span>Homework Reviews ({submissions.filter(s => s.status === 'pending').length})</span>
          </button>
        </div>
      </div>

      {/* 4. Active Area Renderer */}
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 mt-8">
        
        {/* TAB 0: EDIT CONTENT WORKFLOW (WORDPRESS GRADE CMS) */}
        {activeTab === "edit-content" && (
          <div className="space-y-6 animate-fade-in">
            {/* Introductory Header */}
            <div className="rounded-xl border border-gold/15 bg-neutral-950/90 p-6 flex flex-col md:flex-row justify-between items-start md:items-center gap-4 bg-islamic-pattern">
              <div>
                <h2 className="font-serif text-xl font-bold text-white tracking-wide flex items-center gap-2">
                  <Sparkles className="h-5 w-5 text-gold animate-spin-slow" />
                  <span>WordPress-Style Content Publishing Console</span>
                </h2>
                <p className="text-neutral-400 text-xs mt-1 max-w-2xl">
                  Paste links, auto-generate high-quality assets, validate streaming payloads, and save changes straight to Firestore instantly without editing any code.
                </p>
              </div>

              <button
                id="create-new-topic-workflow-btn"
                onClick={() => {
                  setIsNewTopicMode(true);
                  setWorkflowTopicId("");
                }}
                className={`inline-flex items-center gap-1.5 rounded-lg px-4 py-2.5 text-xs font-mono font-bold uppercase tracking-wider transition ${
                  isNewTopicMode
                    ? "bg-emerald-deep text-gold border border-gold/30"
                    : "bg-gold text-black hover:opacity-90"
                }`}
              >
                <Plus className="h-4 w-4" />
                <span>{isNewTopicMode ? "Creating New..." : "Create New Topic"}</span>
              </button>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
              
              {/* LEFT COLUMN: SELECTION CASCADE & TOPICS LIST */}
              <div className="lg:col-span-4 space-y-6">
                
                {/* Cascade Filters */}
                <div className="rounded-xl border border-neutral-800 bg-neutral-950 p-5 space-y-4">
                  <h3 className="font-serif text-sm font-bold text-white border-b border-neutral-900 pb-2 flex items-center gap-1.5">
                    <Folder className="h-4 w-4 text-gold" />
                    <span>Select Target Node</span>
                  </h3>

                  {/* 1. Skill Selector */}
                  <div>
                    <label className="block text-[10px] font-mono uppercase tracking-widest text-neutral-400 mb-1.5">
                      Select Skill Domain
                    </label>
                    <select
                      value={workflowSkill}
                      onChange={(e) => {
                        setWorkflowSkill(e.target.value);
                        setIsNewTopicMode(false);
                      }}
                      className="w-full rounded-lg border border-neutral-800 bg-black/60 px-3 py-2.5 text-xs text-white focus:border-gold focus:outline-none cursor-pointer"
                    >
                      <option value="">-- Choose Skill --</option>
                      {skills.map((s) => (
                        <option key={s.id} value={s.title}>{s.title}</option>
                      ))}
                    </select>
                  </div>

                  {/* 2. Course Selector */}
                  <div>
                    <div className="flex justify-between items-center mb-1.5">
                      <label className="block text-[10px] font-mono uppercase tracking-widest text-neutral-400">
                        Select Course Module
                      </label>
                      <button
                        onClick={() => {
                          const name = prompt("Enter new Course Module name:");
                          if (name) addCourse(name);
                        }}
                        className="text-[9px] text-gold hover:underline font-mono"
                      >
                        + Create Module
                      </button>
                    </div>
                    <select
                      value={workflowCourse}
                      onChange={(e) => {
                        setWorkflowCourse(e.target.value);
                        setIsNewTopicMode(false);
                      }}
                      className="w-full rounded-lg border border-neutral-800 bg-black/60 px-3 py-2.5 text-xs text-white focus:border-gold focus:outline-none cursor-pointer"
                    >
                      <option value="">-- Choose Course --</option>
                      {courses.filter(c => skillMatches(c, workflowSkill)).map((c, i) => (
                        <option key={c.id} value={c.title || c.name}>{c.title || c.name}</option>
                      ))}
                    </select>
                  </div>

                  {/* 3. Topic Selector */}
                  <div>
                    <label className="block text-[10px] font-mono uppercase tracking-widest text-neutral-400 mb-1.5">
                      Select Topic / Lesson
                    </label>
                    <select
                      disabled={isNewTopicMode}
                      value={workflowTopicId}
                      onChange={(e) => setWorkflowTopicId(e.target.value)}
                      className="w-full rounded-lg border border-neutral-800 bg-black/60 px-3 py-2.5 text-xs text-white focus:border-gold focus:outline-none cursor-pointer disabled:opacity-40"
                    >
                      {topics.filter(t => skillMatches(t, workflowSkill) && courseMatches(t, workflowCourse)).length === 0 ? (
                        <option value="">No topics in this selection</option>
                      ) : (
                        topics.filter(t => skillMatches(t, workflowSkill) && courseMatches(t, workflowCourse)).map((t) => (
                          <option key={t.id} value={t.id}>{t.title}</option>
                        ))
                      )}
                    </select>
                  </div>

                  {/* Mode Banner */}
                  {isNewTopicMode ? (
                    <div className="rounded-lg border border-emerald-500/20 bg-emerald-500/10 p-3 text-[11px] text-emerald-400 flex items-start gap-2">
                      <Sparkles className="h-4 w-4 mt-0.5 shrink-0 animate-bounce" />
                      <div>
                        <span className="font-bold block">Create Mode Active</span>
                        <span>Saving will add a brand new topic card to this skill & course.</span>
                      </div>
                    </div>
                  ) : workflowTopicId ? (
                    <div className="rounded-lg border border-gold/15 bg-neutral-900/60 p-3 text-[11px] text-neutral-400 flex items-start gap-2">
                      <Edit className="h-4 w-4 mt-0.5 shrink-0 text-gold" />
                      <div>
                        <span className="font-bold text-white block">Edit Mode Active</span>
                        <span>Editing & saving will update this selected database node.</span>
                      </div>
                    </div>
                  ) : null}
                </div>

                {/* Topics in this Course List with Quick Edit / Delete */}
                <div className="rounded-xl border border-neutral-800 bg-neutral-950 p-5 space-y-4">
                  <h3 className="font-serif text-sm font-bold text-white border-b border-neutral-900 pb-2 flex items-center justify-between">
                    <span>Course Topics Inventory</span>
                    <span className="font-mono text-[10px] text-gold-light/60 bg-gold/10 px-1.5 py-0.5 rounded">
                      {topics.filter(t => skillMatches(t, workflowSkill) && courseMatches(t, workflowCourse)).length} Topics
                    </span>
                  </h3>

                  <div className="space-y-2.5 max-h-[400px] overflow-y-auto pr-1">
                    {topics.filter(t => skillMatches(t, workflowSkill) && courseMatches(t, workflowCourse)).map((t) => (
                      <div
                        key={t.id}
                        onClick={() => {
                          setIsNewTopicMode(false);
                          setWorkflowTopicId(t.id);
                        }}
                        className={`rounded-lg p-3 border text-xs transition cursor-pointer flex items-center justify-between gap-2 ${
                          workflowTopicId === t.id && !isNewTopicMode
                            ? "bg-gold/10 border-gold/40 text-white"
                            : "bg-black/40 border-neutral-900 text-neutral-300 hover:border-neutral-800"
                        }`}
                      >
                        <div className="truncate">
                          <span className="font-semibold block truncate">{t.title}</span>
                          <span className="text-[10px] text-neutral-500 font-mono block mt-0.5">⏱️ {t.duration || "15 mins"}</span>
                        </div>

                        <div className="flex gap-1 shrink-0">
                          <button
                            type="button"
                            onClick={(e) => {
                              e.stopPropagation();
                              setIsNewTopicMode(false);
                              setWorkflowTopicId(t.id);
                            }}
                            className="p-1 rounded bg-neutral-900 border border-neutral-800 text-neutral-400 hover:text-gold hover:border-gold transition"
                            title="Edit"
                          >
                            <Edit className="h-3 w-3" />
                          </button>
                          <button
                            type="button"
                            onClick={async (e) => {
                              e.stopPropagation();
                              if (confirm(`Are you sure you want to delete "${t.title}" from the cloud database?`)) {
                                if (workflowTopicId === t.id) {
                                  setWorkflowTopicId("");
                                }
                                await deleteTopic(t.id);
                              }
                            }}
                            className="p-1 rounded bg-red-950/10 border border-red-500/10 text-red-400 hover:bg-red-900 hover:text-white hover:border-red-500 transition"
                            title="Delete"
                          >
                            <Trash2 className="h-3 w-3" />
                          </button>
                        </div>
                      </div>
                    ))}

                    {topics.filter(t => skillMatches(t, workflowSkill) && courseMatches(t, workflowCourse)).length === 0 && (
                      <p className="text-[11px] text-neutral-500 italic text-center py-6">No topics in this module. Click Create New Topic above to start!</p>
                    )}
                  </div>
                </div>

              </div>

              {/* RIGHT COLUMN: RICH CONTENT EDITOR & LIVE PLAYER */}
              <div className="lg:col-span-8 rounded-xl border border-gold/15 bg-neutral-950 p-6 glass-panel space-y-6">
                
                <div className="border-b border-neutral-900 pb-3 flex justify-between items-center">
                  <h3 className="font-serif text-lg font-bold text-white tracking-wide">
                    {isNewTopicMode ? "Drafting New Lesson Entry" : "Real-Time Topic Customization"}
                  </h3>
                  <span className="font-mono text-[9px] uppercase bg-gold/10 text-gold px-2 py-0.5 rounded tracking-widest border border-gold/15 animate-pulse">
                    Real-time Firestore Node
                  </span>
                </div>

                <form onSubmit={handleSaveWorkflowTopic} className="space-y-5 font-sans text-xs">
                  
                  {/* Topic Name */}
                  <div>
                    <label className="block text-[10px] font-mono uppercase tracking-widest text-neutral-400 mb-2 font-semibold">
                      • Topic / Lesson Name *
                    </label>
                    <input
                      type="text"
                      value={topicForm.title}
                      onChange={(e) => setTopicForm({ ...topicForm, title: e.target.value })}
                      className="w-full rounded-lg border border-neutral-800 bg-black/60 px-4 py-3 text-white text-sm focus:border-gold focus:outline-none"
                      placeholder="e.g. Scaling Your Organic Client Funnels"
                      required
                    />
                  </div>

                  {/* Description */}
                  <div>
                    <label className="block text-[10px] font-mono uppercase tracking-widest text-neutral-400 mb-2 font-semibold">
                      • Short Description / Lesson Guide *
                    </label>
                    <textarea
                      value={topicForm.shortDescription}
                      onChange={(e) => setTopicForm({ ...topicForm, shortDescription: e.target.value })}
                      rows={4}
                      className="w-full rounded-lg border border-neutral-800 bg-black/60 px-4 py-3 text-white focus:border-gold focus:outline-none leading-relaxed"
                      placeholder="Enter details, takeaways, and goals for this lesson..."
                      required
                    />
                  </div>

                  {/* Video URL & Auto oEmbed Fetch */}
                  <div className="border border-neutral-900 rounded-xl p-4 bg-black/40 space-y-3">
                    <div>
                      <div className="flex justify-between items-center mb-2">
                        <label className="block text-[10px] font-mono uppercase tracking-widest text-gold font-semibold">
                          • YouTube Video URL *
                        </label>
                        {isFetchingTitle && (
                          <span className="text-[10px] text-gold animate-pulse font-mono flex items-center gap-1">
                            <span className="h-2 w-2 rounded-full bg-gold animate-ping" />
                            Querying oEmbed...
                          </span>
                        )}
                      </div>
                      <input
                        type="url"
                        value={topicForm.videoUrl}
                        onChange={(e) => handleYoutubeUrlChange(e.target.value)}
                        className="w-full rounded-lg border border-neutral-800 bg-black/60 px-4 py-2.5 text-white font-mono text-xs focus:border-gold focus:outline-none"
                        placeholder="Paste link: https://www.youtube.com/watch?v=..."
                      />
                      {youtubeError && (
                        <p className="text-[10px] text-red-400 mt-1 flex items-center gap-1">
                          <AlertCircle className="h-3 w-3 shrink-0" />
                          {youtubeError}
                        </p>
                      )}
                    </div>

                    {/* Fetched Video Title Banner */}
                    {fetchedTitle && (
                      <div className="rounded-lg border border-gold/25 bg-gold/5 p-3 flex flex-col md:flex-row items-start md:items-center justify-between gap-3 animate-fade-in">
                        <div className="space-y-0.5">
                          <span className="block text-[8px] font-mono uppercase tracking-widest text-gold-light">Fetched YouTube Metadata</span>
                          <span className="block text-white font-semibold text-xs leading-snug">{fetchedTitle}</span>
                        </div>
                        <button
                          type="button"
                          onClick={() => {
                            setTopicForm(prev => ({ ...prev, title: fetchedTitle }));
                            setFetchedTitle("");
                          }}
                          className="px-2.5 py-1 bg-gold hover:opacity-90 text-black text-[10px] font-mono rounded font-bold transition"
                        >
                          Apply As Title
                        </button>
                      </div>
                    )}

                    {/* LIVE VIDEO EMBED PREVIEW */}
                    {getYouTubeId(topicForm.videoUrl) ? (
                      <div className="space-y-2">
                        <span className="block text-[9px] font-mono uppercase tracking-widest text-neutral-500">Live Player Preview</span>
                        <div className="rounded-lg overflow-hidden border border-gold/15 aspect-video bg-neutral-950 shadow-inner relative">
                          <iframe
                            className="absolute inset-0 w-full h-full"
                            src={`https://www.youtube.com/embed/${getYouTubeId(topicForm.videoUrl)}`}
                            title="YouTube video player"
                            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                            allowFullScreen
                          />
                        </div>
                      </div>
                    ) : (
                      <div className="rounded-lg border border-neutral-900 border-dashed py-8 text-center bg-black/20">
                        <Film className="h-8 w-8 text-neutral-700 mx-auto mb-2" />
                        <p className="text-[10px] text-neutral-500">Paste a valid YouTube link to generate video thumbnail and enable live preview.</p>
                      </div>
                    )}
                  </div>

                  {/* 2-Column Fields Grid */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {/* YouTube Playlist */}
                    <div>
                      <label className="block text-[10px] font-mono uppercase tracking-widest text-neutral-400 mb-2 font-semibold">
                        • YouTube Playlist URL (Optional)
                      </label>
                      <input
                        type="url"
                        value={topicForm.youtubePlaylistLink}
                        onChange={(e) => setTopicForm({ ...topicForm, youtubePlaylistLink: e.target.value })}
                        className="w-full rounded-lg border border-neutral-800 bg-black/60 px-3.5 py-2.5 text-white font-mono text-xs focus:border-gold"
                        placeholder="https://www.youtube.com/playlist?list=..."
                      />
                    </div>

                    {/* Official Website */}
                    <div>
                      <label className="block text-[10px] font-mono uppercase tracking-widest text-neutral-400 mb-2 font-semibold">
                        • Official Website Link
                      </label>
                      <input
                        type="url"
                        value={topicForm.officialWebsiteLink}
                        onChange={(e) => setTopicForm({ ...topicForm, officialWebsiteLink: e.target.value })}
                        className="w-full rounded-lg border border-neutral-800 bg-black/60 px-3.5 py-2.5 text-white font-mono text-xs focus:border-gold"
                        placeholder="https://legacyofauf.academy"
                      />
                    </div>

                    {/* Certificate Link */}
                    <div>
                      <label className="block text-[10px] font-mono uppercase tracking-widest text-neutral-400 mb-2 font-semibold">
                        • Certificate Link
                      </label>
                      <input
                        type="text"
                        value={topicForm.certificateLink}
                        onChange={(e) => setTopicForm({ ...topicForm, certificateLink: e.target.value })}
                        className="w-full rounded-lg border border-neutral-800 bg-black/60 px-3.5 py-2.5 text-white text-xs focus:border-gold"
                        placeholder="e.g. /certificates?course=Legacy"
                      />
                    </div>

                    {/* PDF Notes Link */}
                    <div>
                      <label className="block text-[10px] font-mono uppercase tracking-widest text-neutral-400 mb-2 font-semibold">
                        • PDF Notes Link
                      </label>
                      <input
                        type="text"
                        value={topicForm.notesPdfLink}
                        onChange={(e) => setTopicForm({ ...topicForm, notesPdfLink: e.target.value })}
                        className="w-full rounded-lg border border-neutral-800 bg-black/60 px-3.5 py-2.5 text-white text-xs focus:border-gold"
                        placeholder="e.g. https://.../guide.pdf"
                      />
                    </div>

                    {/* Assignment PDF Link */}
                    <div>
                      <label className="block text-[10px] font-mono uppercase tracking-widest text-neutral-400 mb-2 font-semibold">
                        • Assignment File / Link
                      </label>
                      <input
                        type="text"
                        value={topicForm.assignmentPdf}
                        onChange={(e) => setTopicForm({ ...topicForm, assignmentPdf: e.target.value })}
                        className="w-full rounded-lg border border-neutral-800 bg-black/60 px-3.5 py-2.5 text-white text-xs focus:border-gold"
                        placeholder="e.g. https://.../assignment.pdf"
                      />
                    </div>

                    {/* Custom Thumbnail URL */}
                    <div>
                      <label className="block text-[10px] font-mono uppercase tracking-widest text-neutral-400 mb-2 font-semibold">
                        • Custom Thumbnail URL (Optional)
                      </label>
                      <input
                        type="url"
                        value={topicForm.thumbnailUrl}
                        onChange={(e) => setTopicForm({ ...topicForm, thumbnailUrl: e.target.value })}
                        className="w-full rounded-lg border border-neutral-800 bg-black/60 px-3.5 py-2.5 text-white font-mono text-xs focus:border-gold"
                        placeholder="Auto-generated if YouTube URL is provided."
                      />
                    </div>
                  </div>

                  {/* Minor config: duration & difficulty */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-[10px] font-mono uppercase tracking-widest text-neutral-400 mb-2">
                        • Estimated Completion Time
                      </label>
                      <input
                        type="text"
                        value={topicForm.duration}
                        onChange={(e) => setTopicForm({ ...topicForm, duration: e.target.value })}
                        className="w-full rounded-lg border border-neutral-800 bg-black/60 px-3.5 py-2.5 text-white text-xs"
                        placeholder="e.g. 15 mins"
                      />
                    </div>

                    <div>
                      <label className="block text-[10px] font-mono uppercase tracking-widest text-neutral-400 mb-2">
                        • Difficulty Level
                      </label>
                      <select
                        value={topicForm.difficulty}
                        onChange={(e) => setTopicForm({ ...topicForm, difficulty: e.target.value as any })}
                        className="w-full rounded-lg border border-neutral-800 bg-black/60 px-3 py-2.5 text-white cursor-pointer focus:outline-none"
                      >
                        <option value="Beginner">Beginner</option>
                        <option value="Intermediate">Intermediate</option>
                        <option value="Advanced">Advanced</option>
                      </select>
                    </div>
                  </div>

                  {/* Publish & featured statuses */}
                  <div className="flex items-center gap-6 py-2 border-t border-b border-neutral-900">
                    <label className="flex items-center gap-2 text-xs text-neutral-300 cursor-pointer">
                      <input
                        type="checkbox"
                        checked={topicForm.published}
                        onChange={(e) => setTopicForm({ ...topicForm, published: e.target.checked })}
                        className="rounded border-neutral-800 bg-black/60 text-gold focus:ring-0 cursor-pointer h-4 w-4"
                      />
                      <span>Publish Instantly to Website</span>
                    </label>

                    <label className="flex items-center gap-2 text-xs text-neutral-300 cursor-pointer">
                      <input
                        type="checkbox"
                        checked={topicForm.featured}
                        onChange={(e) => setTopicForm({ ...topicForm, featured: e.target.checked })}
                        className="rounded border-neutral-800 bg-black/60 text-gold focus:ring-0 cursor-pointer h-4 w-4"
                      />
                      <span>Featured Lesson Badge</span>
                    </label>
                  </div>

                  {/* Submission and Reset Controls */}
                  <div className="flex justify-end gap-3 pt-4">
                    {isNewTopicMode && (
                      <button
                        type="button"
                        onClick={() => {
                          setIsNewTopicMode(false);
                        }}
                        className="px-5 py-3 rounded-lg border border-neutral-800 hover:bg-neutral-900 text-neutral-400 text-xs font-mono transition"
                      >
                        Cancel Draft
                      </button>
                    )}
                    <button
                      type="submit"
                      className="rounded-lg bg-gradient-to-r from-gold via-gold-light to-gold-dark text-black px-8 py-3.5 text-xs font-mono font-extrabold uppercase tracking-widest hover:opacity-95 active:scale-[0.99] transition shadow-glow flex items-center justify-center gap-2"
                    >
                      <Database className="h-4 w-4" />
                      <span>{isNewTopicMode ? "Save and Create Lesson" : "Commit Changes to Firestore"}</span>
                    </button>
                  </div>

                </form>

              </div>

            </div>
          </div>
        )}

        {/* TAB 1: OVERVIEW & TOPICS CRUD TABLE */}
        {activeTab === "overview" && (
          <div className="space-y-6 animate-fade-in">
            {/* Filters panel */}
            <div className="rounded-xl border border-neutral-800 bg-neutral-950 p-5 flex flex-col md:flex-row gap-4 items-center justify-between">
              <div className="relative w-full md:max-w-xs">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-neutral-500" />
                <input
                  type="text"
                  placeholder="Search topics, tags, paths..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full rounded-lg border border-neutral-800 bg-black/60 pl-10 pr-4 py-2 text-xs text-white focus:border-gold focus:outline-none"
                />
              </div>

              <div className="flex flex-wrap items-center gap-3 w-full md:w-auto">
                {/* Skill Filter */}
                <select
                  value={selectedSkillFilter}
                  onChange={(e) => setSelectedSkillFilter(e.target.value)}
                  className="rounded-lg border border-neutral-800 bg-black/60 px-3 py-2 text-xs text-neutral-300 focus:border-gold focus:outline-none cursor-pointer"
                >
                  <option value="">All Skills</option>
                  {skills.map(s => (
                    <option key={s.id} value={s.title}>{s.title}</option>
                  ))}
                </select>

                {/* Course Filter */}
                <select
                  value={selectedCourseFilter}
                  onChange={(e) => setSelectedCourseFilter(e.target.value)}
                  className="rounded-lg border border-neutral-800 bg-black/60 px-3 py-2 text-xs text-neutral-300 focus:border-gold focus:outline-none cursor-pointer"
                >
                  <option value="">All Courses</option>
                  {courses.filter(c => !selectedSkillFilter || skillMatches(c, selectedSkillFilter)).map(c => (
                    <option key={c.id} value={c.title || c.name}>{c.title || c.name}</option>
                  ))}
                </select>

                {/* Status Filter */}
                <select
                  value={selectedStatusFilter}
                  onChange={(e) => setSelectedStatusFilter(e.target.value)}
                  className="rounded-lg border border-neutral-800 bg-black/60 px-3 py-2 text-xs text-neutral-300 focus:border-gold focus:outline-none cursor-pointer"
                >
                  <option value="">All Statuses</option>
                  <option value="published">Published Only</option>
                  <option value="draft">Drafts Only</option>
                </select>

                {/* Export Data Button */}
                <button
                  id="export-csv-topics-btn"
                  onClick={() => triggerDownload(exportToCSV(), "loa-topics.csv", "text/csv")}
                  className="inline-flex items-center gap-1 bg-emerald-deep/20 hover:bg-emerald-deep/40 text-gold border border-gold/20 px-3.5 py-2 rounded text-xs font-mono transition"
                >
                  <Download className="h-3 w-3" />
                  <span>CSV</span>
                </button>

                <button
                  id="add-new-topic-btn"
                  onClick={() => {
                    setEditingTopicId(null);
                    setTopicForm({
                      title: "",
                      duration: "15 mins",
                      videoUrl: "",
                      difficulty: "Beginner",
                      skillName: skills[0]?.title || "",
                      courseName: courses[0]?.name || "General Core Module",
                      shortDescription: "",
                      thumbnailUrl: "",
                      youtubePlaylistLink: "",
                      certificateLink: "",
                      officialWebsiteLink: "",
                      notesPdfLink: "",
                      assignmentPdf: "",
                      projectFile: "",
                      downloadLink: "",
                      businessApplication: "",
                      incomeOpportunity: "",
                      islamicInsights: "",
                      nextTopic: "",
                      prerequisites: "",
                      tags: "",
                      featured: true,
                      published: true
                    });
                    setIsTopicModalOpen(true);
                  }}
                  className="inline-flex items-center gap-1.5 rounded bg-gold px-4 py-2 text-xs font-mono font-bold uppercase tracking-wider text-black hover:opacity-90 transition w-full sm:w-auto justify-center"
                >
                  <Plus className="h-4 w-4" />
                  <span>Add Topic</span>
                </button>
              </div>
            </div>

            {/* Topics Table List */}
            <div className="rounded-xl border border-neutral-800 bg-neutral-950 overflow-hidden">
              <div className="overflow-x-auto">
                <table className="w-full text-left border-collapse">
                  <thead>
                    <tr className="border-b border-neutral-800 bg-neutral-900/60 font-serif text-[10px] uppercase tracking-widest text-gold">
                      <th className="px-6 py-4">Status</th>
                      <th className="px-6 py-4">Topic Details</th>
                      <th className="px-6 py-4">Skill Category</th>
                      <th className="px-6 py-4">Course Name</th>
                      <th className="px-6 py-4 text-right">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-neutral-800 font-sans text-xs">
                    {filteredTopics.map((topic) => (
                      <tr key={topic.id} className="hover:bg-neutral-900/40 transition">
                        <td className="px-6 py-4 whitespace-nowrap">
                          {topic.published !== false ? (
                            <span className="inline-flex items-center gap-1 rounded bg-emerald-500/10 px-2 py-0.5 text-[10px] font-mono text-emerald-400">
                              ● Published
                            </span>
                          ) : (
                            <span className="inline-flex items-center gap-1 rounded bg-yellow-500/10 px-2 py-0.5 text-[10px] font-mono text-yellow-500">
                              ◌ Draft
                            </span>
                          )}
                          {topic.featured && (
                            <span className="block mt-1 text-[9px] text-gold-light/60 font-mono">
                              ✦ Featured
                            </span>
                          )}
                        </td>
                        <td className="px-6 py-4">
                          <div>
                            <span className="font-semibold text-white block tracking-wide">{topic.title}</span>
                            <span className="font-mono text-[10px] text-neutral-500 mt-0.5 inline-flex items-center gap-2">
                              ⏱️ {topic.duration} <span className="text-neutral-700">|</span> 🎓 {topic.difficulty}
                            </span>
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-neutral-400">
                          {topic.skillName}
                        </td>
                        <td className="px-6 py-4 text-neutral-400 max-w-[180px] truncate">
                          {topic.courseName}
                        </td>
                        <td className="px-6 py-4 text-right whitespace-nowrap">
                          <div className="flex justify-end gap-2">
                            <button
                              onClick={() => handleEditTopicClick(topic)}
                              className="p-1.5 rounded border border-neutral-800 bg-neutral-900 text-neutral-300 hover:border-gold hover:text-gold transition"
                              title="Edit Topic"
                            >
                              <Edit className="h-3.5 w-3.5" />
                            </button>
                            <button
                              onClick={() => {
                                if (confirm(`Are you sure you want to delete "${topic.title}"?`)) {
                                  deleteTopic(topic.id);
                                }
                              }}
                              className="p-1.5 rounded border border-red-500/10 bg-red-950/20 text-red-400 hover:border-red-500 hover:text-white transition"
                              title="Delete Topic"
                            >
                              <Trash2 className="h-3.5 w-3.5" />
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))}

                    {filteredTopics.length === 0 && (
                      <tr>
                        <td colSpan={5} className="text-center px-6 py-12 text-neutral-500 italic">
                          No topics found matching current filters. Create one or clear the query.
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}

        {/* TAB 2: SKILLS & COURSES */}
        {activeTab === "skills" && (
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start animate-fade-in">
            {/* Form Column */}
            <div className="lg:col-span-4 rounded-xl border border-gold/15 bg-neutral-950 p-6 glass-panel">
              <h3 className="font-serif text-lg font-bold text-white tracking-wide mb-4 flex items-center gap-2 border-b border-gold/25 pb-3">
                <Sparkles className="h-5 w-5 text-gold" />
                <span>{editingSkillId ? "Edit Skill" : "Add New Skill"}</span>
              </h3>

              <form onSubmit={handleSaveSkill} className="space-y-4 font-sans text-xs">
                <div>
                  <label className="block font-serif text-[10px] font-semibold text-gold uppercase tracking-wider mb-2">
                    Skill Title
                  </label>
                  <input
                    type="text"
                    value={skillForm.title}
                    onChange={(e) => setSkillForm({ ...skillForm, title: e.target.value })}
                    className="w-full rounded-lg border border-neutral-800 bg-black/60 px-3.5 py-2.5 text-white focus:border-gold focus:outline-none"
                    placeholder="e.g. Artificial Intelligence"
                    required
                  />
                </div>

                <div>
                  <label className="block font-serif text-[10px] font-semibold text-gold uppercase tracking-wider mb-2">
                    Short Description
                  </label>
                  <textarea
                    value={skillForm.description}
                    onChange={(e) => setSkillForm({ ...skillForm, description: e.target.value })}
                    rows={3}
                    className="w-full rounded-lg border border-neutral-800 bg-black/60 px-3.5 py-2.5 text-white focus:border-gold focus:outline-none"
                    placeholder="Provide a high-integrity core purpose for this domain..."
                  />
                </div>

                <div>
                  <label className="block font-serif text-[10px] font-semibold text-gold uppercase tracking-wider mb-2">
                    Lucide Icon Name
                  </label>
                  <select
                    value={skillForm.iconName}
                    onChange={(e) => setSkillForm({ ...skillForm, iconName: e.target.value })}
                    className="w-full rounded-lg border border-neutral-800 bg-black/60 px-3 py-2.5 text-white focus:border-gold focus:outline-none cursor-pointer"
                  >
                    <option value="Cpu">Cpu (AI / Tech)</option>
                    <option value="TrendingUp">TrendingUp (Marketing)</option>
                    <option value="ShoppingBag">ShoppingBag (E-commerce)</option>
                    <option value="PenTool">PenTool (Copywriting)</option>
                    <option value="Coins">Coins (Finance)</option>
                    <option value="Volume2">Volume2 (Public Speaking)</option>
                    <option value="ShieldAlert">ShieldAlert (Leadership)</option>
                    <option value="Briefcase">Briefcase (Agency / Freelance)</option>
                    <option value="BookOpen">BookOpen (General learning)</option>
                  </select>
                </div>

                <div className="flex gap-2 pt-2">
                  <button
                    type="submit"
                    className="w-full rounded bg-gold py-2.5 text-xs font-mono font-bold uppercase tracking-wider text-black hover:opacity-95"
                  >
                    {editingSkillId ? "Update Skill" : "Save Skill"}
                  </button>
                  {editingSkillId && (
                    <button
                      type="button"
                      onClick={() => {
                        setEditingSkillId(null);
                        setSkillForm({ title: "", description: "", iconName: "Cpu" });
                      }}
                      className="rounded border border-neutral-800 px-3 py-2.5 text-xs hover:bg-neutral-900 text-neutral-400"
                    >
                      Cancel
                    </button>
                  )}
                </div>
              </form>
            </div>

            {/* List Column */}
            <div className="lg:col-span-8 space-y-6">
              <div className="rounded-xl border border-neutral-800 bg-neutral-950 p-6">
                <h3 className="font-serif text-lg font-bold text-white mb-4">Active Skill Chapters</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {skills.map((skill) => (
                    <div key={skill.id} className="rounded-lg border border-neutral-800 bg-black/40 p-4 flex flex-col justify-between">
                      <div>
                        <div className="flex items-center gap-2 mb-2">
                          <span className="font-mono text-xs text-gold border border-gold/20 bg-gold/5 rounded px-1.5 py-0.5">
                            {skill.topics.length} Lessons
                          </span>
                          <h4 className="font-serif text-sm font-bold text-white truncate">{skill.title}</h4>
                        </div>
                        <p className="text-[11px] text-neutral-400 line-clamp-2 leading-relaxed">{skill.description}</p>
                      </div>

                      <div className="flex justify-end gap-2 mt-4 border-t border-neutral-900 pt-3">
                        <button
                          onClick={() => {
                            setEditingSkillId(skill.id);
                            setSkillForm({
                              title: skill.title,
                              description: skill.description || "",
                              iconName: skill.iconName || "Cpu"
                            });
                          }}
                          className="inline-flex items-center gap-1 border border-neutral-800 bg-neutral-900 hover:border-gold hover:text-gold px-2.5 py-1 rounded text-[10px] font-mono transition"
                        >
                          <Edit className="h-3 w-3" /> Edit
                        </button>
                        <button
                          onClick={() => {
                            if (confirm(`Deleting "${skill.title}" will automatically un-publish all associated topics. Proceed?`)) {
                              deleteSkill(skill.id);
                            }
                          }}
                          className="inline-flex items-center gap-1 border border-red-500/10 bg-red-950/10 hover:border-red-500 hover:text-white px-2.5 py-1 rounded text-[10px] font-mono text-red-400 transition"
                        >
                          <Trash2 className="h-3 w-3" /> Delete
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Course lookup list */}
              <div className="rounded-xl border border-neutral-800 bg-neutral-950 p-6">
                <div className="flex justify-between items-center mb-4">
                  <h3 className="font-serif text-lg font-bold text-white">Dynamic Course Modules</h3>
                  <button
                    onClick={() => {
                      const name = prompt("Enter new Course Module name:");
                      if (name) addCourse(name);
                    }}
                    className="inline-flex items-center gap-1 text-gold hover:text-gold-light border border-gold/20 px-2.5 py-1 rounded text-xs font-mono"
                  >
                    <Plus className="h-3 w-3" /> Create Module
                  </button>
                </div>

                <div className="space-y-2">
                  {courses.map((course, idx) => (
                    <div key={course.id} className="flex items-center justify-between rounded-lg border border-neutral-900 bg-black/60 px-4 py-3 text-xs">
                      <div>
                        <span className="font-sans text-white font-medium">{course.name}</span>
                        <span className="block font-mono text-[9px] text-neutral-500 mt-0.5">{course.skillName} • {course.learningPathId}</span>
                      </div>
                      <div className="flex gap-2">
                        <button
                          onClick={() => {
                            const newName = prompt(`Rename "${course.name}" to:`, course.name);
                            if (newName && newName !== course.name) {
                              updateCourse(course.name, newName);
                            }
                          }}
                          className="text-neutral-400 hover:text-gold"
                        >
                          Rename
                        </button>
                        <button
                          onClick={() => {
                            if (confirm(`Delete Course "${course.name}" and delete all its associated topics?`)) {
                              deleteCourse(course.name);
                            }
                          }}
                          className="text-red-400 hover:text-red-300 ml-2"
                        >
                          Delete
                        </button>
                      </div>
                    </div>
                  ))}

                  {courses.length === 0 && (
                    <p className="text-xs text-neutral-500 italic">No custom modules created yet. They are created automatically when saving topics!</p>
                  )}
                </div>
              </div>
            </div>
          </div>
        )}

        {/* TAB 3: BULK IMPORT */}
        {activeTab === "import" && (() => {
          // Dynamic spreadsheet parsing preview
          let previewData = null;
          if (rawImportText && rawImportText.trim()) {
            try {
              const parsed = parseCSV(rawImportText);
              if (parsed.length > 0) {
                previewData = {
                  headers: parsed[0],
                  rows: parsed.slice(1, 6) // First 5 rows for validation preview
                };
              }
            } catch (err) {
              // silent fallback
            }
          }

          return (
            <div className="space-y-6 animate-fade-in font-sans text-xs">
              <div className="rounded-xl border border-gold/15 bg-neutral-950 p-6 glass-panel">
                <h3 className="font-serif text-lg font-bold text-white tracking-wide mb-2 flex items-center gap-2">
                  <Upload className="h-5 w-5 text-gold" />
                  <span>Curriculum Bulk Importer Platform</span>
                </h3>
                <p className="text-neutral-400 mb-6 text-xs leading-relaxed max-w-3xl">
                  Quickly populate your entire database. Upload files or link a live spreadsheet. 
                  The system automatically maps columns, extracts YouTube video information/thumbnails, and instantly populates skills and courses.
                </p>

                <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
                  
                  {/* Left Column: Input and Upload Methods (8 cols) */}
                  <div className="lg:col-span-8 space-y-5">
                    
                    {/* Method Selector Tabs */}
                    <div className="flex border-b border-neutral-800 gap-1 pb-[1px]">
                      <button
                        onClick={() => { setImportType("csv"); setRawImportText(""); setImportResult(null); }}
                        className={`px-4 py-2 text-xs font-mono tracking-wider border-b-2 uppercase transition-all ${
                          importType === "csv"
                            ? "border-gold text-gold font-extrabold"
                            : "border-transparent text-neutral-400 hover:text-white"
                        }`}
                      >
                        CSV SPREADSHEET (.csv)
                      </button>
                      <button
                        onClick={() => { setImportType("excel"); setRawImportText(""); setImportResult(null); }}
                        className={`px-4 py-2 text-xs font-mono tracking-wider border-b-2 uppercase transition-all ${
                          importType === "excel"
                            ? "border-gold text-gold font-extrabold"
                            : "border-transparent text-neutral-400 hover:text-white"
                        }`}
                      >
                        EXCEL SHEET (.xlsx)
                      </button>
                      <button
                        onClick={() => { setImportType("sheets"); setRawImportText(""); setImportResult(null); }}
                        className={`px-4 py-2 text-xs font-mono tracking-wider border-b-2 uppercase transition-all ${
                          importType === "sheets"
                            ? "border-gold text-gold font-extrabold"
                            : "border-transparent text-neutral-400 hover:text-white"
                        }`}
                      >
                        GOOGLE SHEETS (Live Sync)
                      </button>
                      <button
                        onClick={() => { setImportType("json"); setRawImportText(""); setImportResult(null); }}
                        className={`px-4 py-2 text-xs font-mono tracking-wider border-b-2 uppercase transition-all ${
                          importType === "json"
                            ? "border-gold text-gold font-extrabold"
                            : "border-transparent text-neutral-400 hover:text-white"
                        }`}
                      >
                        JSON BACKUP (.json)
                      </button>
                    </div>

                    {/* File Upload / Drag and Drop (For CSV, Excel, and JSON) */}
                    {importType !== "sheets" && (
                      <div 
                        onDragOver={handleDragOver}
                        onDragLeave={handleDragLeave}
                        onDrop={handleDrop}
                        className={`border-2 border-dashed rounded-xl p-8 text-center flex flex-col items-center justify-center relative transition-all duration-300 ${
                          isDragging 
                            ? "border-gold bg-gold/5 scale-[1.01]" 
                            : "border-neutral-800 bg-black/40 hover:border-gold/30"
                        }`}
                      >
                        <Upload className={`h-10 w-10 mb-3 transition-colors ${isDragging ? "text-gold animate-bounce" : "text-neutral-500"}`} />
                        <span className="block text-xs font-semibold text-white mb-1">
                          {isDragging ? "Drop your sheet file here!" : "Choose spreadsheet file or drag here"}
                        </span>
                        <span className="block text-[10px] text-neutral-500 mb-4">
                          {importType === "excel" 
                            ? "Accepts Excel spreadsheets (.xlsx, .xls)" 
                            : importType === "csv" 
                              ? "Accepts Comma Separated Values (.csv)"
                              : "Accepts JSON curriculum backup (.json)"}
                        </span>
                        <input
                          id="bulk-file-uploader"
                          type="file"
                          accept={
                            importType === "excel" 
                              ? ".xlsx, .xls" 
                              : importType === "csv" 
                                ? ".csv" 
                                : ".json"
                          }
                          onChange={handleFileUpload}
                          className="absolute inset-0 opacity-0 cursor-pointer w-full h-full"
                        />
                      </div>
                    )}

                    {/* Google Sheets URL Fetch Section */}
                    {importType === "sheets" && (
                      <div className="rounded-xl border border-neutral-800 bg-neutral-950 p-5 space-y-4">
                        <div className="space-y-1.5">
                          <label className="block text-[10px] font-mono uppercase tracking-wider text-gold">
                            Google Sheets URL or Published Link
                          </label>
                          <div className="flex gap-2">
                            <input
                              type="text"
                              value={googleSheetsUrl}
                              onChange={(e) => setGoogleSheetsUrl(e.target.value)}
                              placeholder="https://docs.google.com/spreadsheets/d/your-spreadsheet-id/edit?usp=sharing"
                              className="flex-1 rounded border border-neutral-800 bg-black/60 px-3.5 py-2 text-white focus:border-gold focus:outline-none"
                            />
                            <button
                              onClick={handleFetchGoogleSheet}
                              disabled={isFetchingSheet}
                              className="px-5 py-2 bg-neutral-900 border border-gold/30 hover:border-gold hover:bg-neutral-800 text-gold text-xs font-semibold rounded transition flex items-center gap-1.5 disabled:opacity-50"
                            >
                              {isFetchingSheet ? (
                                <>
                                  <div className="animate-spin rounded-full h-3.5 w-3.5 border-b-2 border-gold" />
                                  <span>Syncing...</span>
                                </>
                              ) : (
                                <>
                                  <Database className="h-3.5 w-3.5" />
                                  <span>Fetch Sheet</span>
                                </>
                              )}
                            </button>
                          </div>
                        </div>

                        {/* Guided Tutorial for Published Sheets */}
                        <div className="text-[11px] text-neutral-400 space-y-2 bg-black/40 p-3.5 rounded-lg border border-neutral-900 leading-relaxed">
                          <span className="font-semibold text-white block">To enable automated syncing:</span>
                          <ol className="list-decimal pl-4 space-y-1 text-neutral-400">
                            <li>Set your Sheet link sharing to <strong className="text-gold-light">"Anyone with the link can view"</strong>, or:</li>
                            <li>For a fast, direct connect: Click <strong className="text-white">File ➔ Share ➔ Publish to Web</strong>. Select <strong className="text-gold-light">"Comma-separated values (.csv)"</strong> and copy-paste that link here!</li>
                          </ol>
                        </div>
                      </div>
                    )}

                    {/* Raw Text / Fallback Input */}
                    <div>
                      <div className="flex justify-between items-center mb-2">
                        <label className="block text-[10px] font-mono uppercase tracking-widest text-neutral-400">
                          Spreadsheet Raw Text Payload
                        </label>
                        {rawImportText && (
                          <button 
                            onClick={() => setRawImportText("")}
                            className="text-[10px] font-mono text-red-400 hover:text-red-300 transition"
                          >
                            [ Clear Data ]
                          </button>
                        )}
                      </div>
                      <textarea
                        value={rawImportText}
                        onChange={(e) => setRawImportText(e.target.value)}
                        rows={5}
                        className="w-full rounded-lg border border-neutral-800 bg-black/60 px-3.5 py-2.5 font-mono text-[11px] text-neutral-300 focus:border-gold focus:outline-none"
                        placeholder={
                          importType === "json"
                            ? "[\n  {\n    \"title\": \"Example Topic\",\n    \"skillName\": \"Cybersecurity\"\n  }\n]"
                            : "Skill,Course,Topic,YouTube Link,Certificate Link,Website Link,PDF Link,Description\nProgramming,React Framework,React Hooks,https://youtube.com/watch?v=...,,,,"
                        }
                      />
                    </div>

                    {/* LIVE PREVIEW GRID (High Craft) */}
                    {previewData && (
                      <div className="rounded-xl border border-neutral-900 bg-black/50 p-4 space-y-2">
                        <div className="flex justify-between items-center border-b border-neutral-800 pb-2">
                          <span className="font-serif text-xs font-semibold text-white flex items-center gap-1">
                            <span className="h-2 w-2 rounded-full bg-emerald-500 animate-pulse" />
                            Live Import Preview (First 5 Rows Detected)
                          </span>
                          <span className="text-[10px] font-mono text-neutral-500">
                            Ready to map {previewData.rows.length + 1}+ records
                          </span>
                        </div>
                        <div className="overflow-x-auto">
                          <table className="w-full text-left border-collapse font-mono text-[10px]">
                            <thead>
                              <tr className="border-b border-neutral-800 text-gold-light">
                                {previewData.headers.map((h, i) => (
                                  <th key={i} className="py-1.5 px-2 font-semibold uppercase whitespace-nowrap">{h || `Col ${i+1}`}</th>
                                ))}
                              </tr>
                            </thead>
                            <tbody>
                              {previewData.rows.map((row, rIdx) => (
                                <tr key={rIdx} className="border-b border-neutral-900 hover:bg-neutral-950/40 text-neutral-300">
                                  {row.map((cell, cIdx) => (
                                    <td key={cIdx} className="py-1.5 px-2 max-w-[200px] truncate" title={cell}>{cell}</td>
                                  ))}
                                </tr>
                              ))}
                            </tbody>
                          </table>
                        </div>
                      </div>
                    )}

                    {/* Output Message feedback */}
                    {importResult && (
                      <div className={`flex items-start gap-2.5 rounded-lg border p-4 text-xs ${
                        importResult.success
                          ? "border-emerald-500/20 bg-emerald-500/10 text-emerald-400"
                          : "border-red-500/20 bg-red-500/10 text-red-400"
                      }`}>
                        {importResult.success ? <Check className="h-5 w-5 shrink-0" /> : <AlertCircle className="h-5 w-5 shrink-0" />}
                        <div>
                          <span className="font-semibold block">{importResult.success ? "Sync Completed successfully!" : "Sync Stopped with errors"}</span>
                          <span className="block mt-0.5">{importResult.message}</span>
                        </div>
                      </div>
                    )}

                    {/* Sync Action Trigger Button */}
                    <button
                      id="bulk-import-submit-btn"
                      onClick={handleExecuteImport}
                      className="w-full rounded bg-gradient-to-r from-gold via-gold-light to-gold-dark py-3.5 text-xs font-mono uppercase tracking-widest text-black font-extrabold hover:opacity-95 shadow-lg shadow-gold/10 transition-all duration-300"
                    >
                      Process & Sync to Cloud Database
                    </button>

                  </div>

                  {/* Right Column: Column Specification Details (4 cols) */}
                  <div className="lg:col-span-4 space-y-5">
                    
                    {/* Columns dictionary box */}
                    <div className="rounded-xl border border-neutral-900 bg-neutral-950 p-5 space-y-4">
                      <h4 className="font-serif text-sm font-semibold text-white tracking-wide border-b border-neutral-800 pb-2 flex items-center gap-1.5">
                        <Database className="h-4 w-4 text-gold" />
                        <span>Column Specifications</span>
                      </h4>
                      <p className="text-neutral-400 text-[11px] leading-relaxed">
                        To guarantee perfect database synchronization, format your columns using the following exact headers:
                      </p>

                      <div className="space-y-3">
                        <div className="bg-black/40 p-3 rounded border border-neutral-900 space-y-2">
                          <span className="block text-[10px] font-mono font-semibold text-gold uppercase tracking-wide">Required Core Mapping:</span>
                          <ul className="space-y-1.5 text-[10px] font-mono text-neutral-300">
                            <li className="flex justify-between">
                              <span className="text-white font-bold">• Skill</span>
                              <span className="text-neutral-500">e.g. AI Prompting</span>
                            </li>
                            <li className="flex justify-between">
                              <span className="text-white font-bold">• Course</span>
                              <span className="text-neutral-500">e.g. Module 1</span>
                            </li>
                            <li className="flex justify-between">
                              <span className="text-white font-bold">• Topic</span>
                              <span className="text-neutral-500">e.g. System Prompts</span>
                            </li>
                          </ul>
                        </div>

                        <div className="bg-black/40 p-3 rounded border border-neutral-900 space-y-2">
                          <span className="block text-[10px] font-mono font-semibold text-gold uppercase tracking-wide">Resource Mapping:</span>
                          <ul className="space-y-1.5 text-[10px] font-mono text-neutral-300">
                            <li className="flex justify-between">
                              <span className="text-white">• YouTube Link</span>
                              <span className="text-neutral-500">URL</span>
                            </li>
                            <li className="flex justify-between">
                              <span className="text-white">• Certificate Link</span>
                              <span className="text-neutral-500">URL</span>
                            </li>
                            <li className="flex justify-between">
                              <span className="text-white">• Website Link</span>
                              <span className="text-neutral-500">URL</span>
                            </li>
                            <li className="flex justify-between">
                              <span className="text-white">• PDF Link</span>
                              <span className="text-neutral-500">URL</span>
                            </li>
                            <li className="flex justify-between border-t border-neutral-900/60 pt-1 mt-1">
                              <span className="text-white">• Description</span>
                              <span className="text-neutral-500">Text block</span>
                            </li>
                          </ul>
                        </div>
                      </div>

                      <div className="pt-2 border-t border-neutral-900 text-[10px] text-neutral-500 leading-normal">
                        <strong>Note on Auto-Mapping:</strong> Column headers are case-insensitive. Extra columns like difficulty, time, or custom tags are fully supported and will auto-apply!
                      </div>
                    </div>

                    {/* How it works info card */}
                    <div className="rounded-xl border border-neutral-900 bg-neutral-950 p-4 space-y-2">
                      <span className="font-serif text-xs font-semibold text-white block">Automated Mechanics:</span>
                      <ul className="list-disc pl-4 space-y-2 text-neutral-400 text-[11px] leading-relaxed">
                        <li><strong className="text-white">Auto-Creation:</strong> If the specified <span className="text-gold">Skill</span> or <span className="text-gold">Course</span> doesn't exist, the system creates them instantly.</li>
                        <li><strong className="text-white">Thumbnail Generation:</strong> Pasting a standard YouTube video URL generates premium video graphics on the fly.</li>
                        <li><strong className="text-white">Relational Locking:</strong> Topics bind securely to modules, preserving perfect index order for study paths.</li>
                      </ul>
                    </div>

                  </div>

                </div>
              </div>
            </div>
          );
        })()}

        {/* TAB 4: YOUTUBE PLAYLIST AUTO-IMPORT & AUTO COURSE GENERATOR */}
        {activeTab === "playlist-import" && (() => {
          const handleAutoGenerate = async () => {
            if (!playlistUrl) {
              setPlaylistResult("Error: Please provide a YouTube playlist or video URL.");
              return;
            }
            if (!playlistSkill) {
              setPlaylistResult("Error: Please specify or select a Skill Path.");
              return;
            }
            if (!playlistCourse) {
              setPlaylistResult("Error: Please specify or select a Course.");
              return;
            }

            setPlaylistLoading(true);
            setPlaylistResult(null);

            try {
              const isPlaylist = playlistUrl.includes("list=");
              const data = isPlaylist 
                ? await aiProvider.generatePlaylist(playlistUrl, playlistSkill, playlistCourse)
                : await aiProvider.generateCourseFromVideo(playlistUrl, playlistSkill, playlistCourse);

              if (data && data.topics && Array.isArray(data.topics)) {
                const savedList = [];
                for (let idx = 0; idx < data.topics.length; idx++) {
                  const rawTopic = data.topics[idx];
                  
                  const cleanTopic = {
                    title: rawTopic.title || `Lesson ${idx + 1}`,
                    duration: rawTopic.duration || "15 mins",
                    videoUrl: rawTopic.videoUrl || playlistUrl,
                    difficulty: (rawTopic.difficulty || "Beginner") as any,
                    skillName: playlistSkill,
                    courseName: playlistCourse,
                    shortDescription: rawTopic.shortDescription || "Master ethical commerce fundamentals in this session.",
                    thumbnailUrl: rawTopic.thumbnailUrl || "https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=600",
                    islamicInsights: rawTopic.islamicInsights || "Ethics of transparency as practiced by Abdur Rahman ibn Awf.",
                    businessApplication: rawTopic.businessApplication || "Formulate transparent client contracts.",
                    incomeOpportunity: rawTopic.incomeOpportunity || "Provide consulting for ethical brand frameworks.",
                    tags: isPlaylist ? "YouTube Playlist, Auto Course" : "YouTube Single, Auto Course",
                    featured: idx < 3,
                    published: true
                  };

                  await addTopic(cleanTopic);
                  savedList.push(cleanTopic);
                }

                setPlaylistResult(`Success! Created Course: "${playlistCourse}" inside Skill: "${playlistSkill}" with exactly ${savedList.length} video topics imported and synchronized to Firestore via unified CMS engine!`);
                setPlaylistUrl("");
                
                // Trigger global course announcement notification
                await addNotification(
                  "New Comprehensive Course Published",
                  `A fully certified new course "${playlistCourse}" has been generated from YouTube with ${savedList.length} video lessons under the "${playlistSkill}" track. Study now to level up your venture!`,
                  "update"
                );
              } else {
                setPlaylistResult("Error: Invalid response format from YouTube engine.");
              }
            } catch (err: any) {
              console.error(err);
              setPlaylistResult(`Error: ${err.message || "Failed to process playlist"}`);
            } finally {
              setPlaylistLoading(false);
            }
          };

          return (
            <div className="space-y-6 animate-fade-in text-xs font-sans">
              <div className="rounded-xl border border-gold/15 bg-neutral-950 p-6 glass-panel">
                <div className="flex items-center gap-3 mb-2">
                  <Film className="h-6 w-6 text-gold" />
                  <div>
                    <h3 className="font-serif text-lg font-bold text-white">YouTube Playlist Auto-Import & Course Generator</h3>
                    <p className="text-neutral-400 text-xs mt-0.5">
                      Paste ONE YouTube playlist link. The AI engine will instantly fetch every video, duration, publish data, construct thumbnails, outline Prophetic ethical frameworks, and generate a 20-lesson course structure in one click.
                    </p>
                  </div>
                </div>

                <div className="mt-6 grid grid-cols-1 lg:grid-cols-12 gap-8">
                  <div className="lg:col-span-8 space-y-4">
                    <div className="space-y-1.5">
                      <label className="block text-[10px] font-mono uppercase tracking-widest text-gold">YouTube Playlist or Single Video URL</label>
                      <input
                        type="text"
                        value={playlistUrl}
                        onChange={(e) => setPlaylistUrl(e.target.value)}
                        placeholder="Paste: https://youtu.be/ZmEqTgGrNHg  or playlist URL"
                        className="w-full rounded border border-neutral-800 bg-black/60 px-3.5 py-2.5 text-white focus:border-gold focus:outline-none"
                      />
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div className="space-y-1.5">
                        <label className="block text-[10px] font-mono uppercase tracking-widest text-gold">Target Skill Path</label>
                        <input
                          type="text"
                          value={playlistSkill}
                          onChange={(e) => setPlaylistSkill(e.target.value)}
                          placeholder="e.g. Ethical Micro-SaaS"
                          list="existing-skills"
                          className="w-full rounded border border-neutral-800 bg-black/60 px-3.5 py-2.5 text-white focus:border-gold focus:outline-none"
                        />
                        <datalist id="existing-skills">
                          {skills.map(s => <option key={s.id} value={s.title} />)}
                        </datalist>
                        <span className="block text-[10px] text-neutral-500">Select an existing path or write a new one to generate.</span>
                      </div>

                      <div className="space-y-1.5">
                        <label className="block text-[10px] font-mono uppercase tracking-widest text-gold">New Course / Module Title</label>
                        <input
                          type="text"
                          value={playlistCourse}
                          onChange={(e) => setPlaylistCourse(e.target.value)}
                          placeholder="e.g. Halal SaaS Blueprint"
                          list="existing-courses"
                          className="w-full rounded border border-neutral-800 bg-black/60 px-3.5 py-2.5 text-white focus:border-gold focus:outline-none"
                        />
                        <datalist id="existing-courses">
                          {courses.map(c => <option key={c.id} value={c.name} />)}
                        </datalist>
                        <span className="block text-[10px] text-neutral-500">Specify the course module name.</span>
                      </div>
                    </div>

                    {playlistResult && (
                      <div className={`p-4 rounded border text-xs leading-normal ${
                        playlistResult.startsWith("Error")
                          ? "border-red-500/20 bg-red-500/10 text-red-400"
                          : "border-emerald-500/20 bg-emerald-500/10 text-emerald-400"
                      }`}>
                        {playlistResult}
                      </div>
                    )}

                    <button
                      onClick={handleAutoGenerate}
                      disabled={playlistLoading}
                      className="w-full inline-flex items-center justify-center gap-2 rounded bg-gradient-to-r from-gold via-gold-light to-gold-dark py-3.5 text-xs font-mono uppercase tracking-widest text-black font-extrabold hover:opacity-95 shadow-lg shadow-gold/10 transition-all duration-300 disabled:opacity-50"
                    >
                      {playlistLoading ? (
                        <>
                          <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-black" />
                          <span>Generating 20-Lesson Curriculum...</span>
                        </>
                      ) : (
                        <>
                          <Sparkles className="h-4 w-4" />
                          <span>One-Click Auto-Course Generator</span>
                        </>
                      )}
                    </button>
                  </div>

                  <div className="lg:col-span-4 rounded-xl border border-neutral-900 bg-neutral-950 p-5 space-y-4">
                    <h4 className="font-serif text-sm font-semibold text-white tracking-wide border-b border-neutral-800 pb-2 flex items-center gap-1.5">
                      <Sparkles className="h-4 w-4 text-gold" />
                      <span>Generator Intelligence</span>
                    </h4>
                    <p className="text-neutral-400 text-[11px] leading-relaxed">
                      This service contacts the backend model. It is instructed to perform curriculum structuring that adheres to:
                    </p>
                    <ul className="space-y-2 text-[10px] font-mono text-neutral-300">
                      <li className="flex items-start gap-1.5">
                        <span className="text-gold">✦</span>
                        <span><strong>Exact 20 Videos Limit</strong>: Always yields a 20-lesson sequential course structure.</span>
                      </li>
                      <li className="flex items-start gap-1.5">
                        <span className="text-gold">✦</span>
                        <span><strong>Structured Metadata</strong>: Extracts lesson descriptions, durations, and thumbnails.</span>
                      </li>
                      <li className="flex items-start gap-1.5">
                        <span className="text-gold">✦</span>
                        <span><strong>Ethical Integrations</strong>: Every topic is matched with relevant Quranic/Hadith trade rules and practical ethical business guidelines.</span>
                      </li>
                    </ul>
                  </div>
                </div>
              </div>
            </div>
          );
        })()}

        {/* TAB 5: QUIZ BUILDER */}
        {activeTab === "quiz-builder" && (() => {
          const selectedTopic = topics.find(t => t.id === quizTopicId);
          const currentQuiz = quizzes.find(q => q.topicId === quizTopicId);

          const handleSaveQuestion = async (e: React.FormEvent) => {
            e.preventDefault();
            if (!quizTopicId) {
              alert("Please select a topic first.");
              return;
            }
            if (!quizQuestionText) {
              alert("Please enter the question text.");
              return;
            }
            if (!quizOption1 || !quizOption2 || !quizOption3 || !quizOption4) {
              alert("Please enter all four answers.");
              return;
            }

            const newQuestion = {
              id: `question-${Date.now()}`,
              questionText: quizQuestionText,
              options: [quizOption1, quizOption2, quizOption3, quizOption4],
              correctOptionIndex: quizCorrectIndex,
              explanation: quizExplanation
            };

            try {
              await addQuizQuestion(quizTopicId, newQuestion);
              setQuizSuccessMsg("Question added to Lesson Quiz successfully!");
              setQuizQuestionText("");
              setQuizOption1("");
              setQuizOption2("");
              setQuizOption3("");
              setQuizOption4("");
              setQuizCorrectIndex(0);
              setQuizExplanation("");
              setTimeout(() => setQuizSuccessMsg(""), 4000);
            } catch (err) {
              console.error(err);
              alert("Failed to save quiz question.");
            }
          };

          return (
            <div className="space-y-6 animate-fade-in text-xs font-sans">
              <div className="rounded-xl border border-gold/15 bg-neutral-950 p-6 glass-panel">
                <div className="flex items-center gap-3 mb-2">
                  <HelpCircle className="h-6 w-6 text-gold" />
                  <div>
                    <h3 className="font-serif text-lg font-bold text-white">Lesson Quiz Builder Console</h3>
                    <p className="text-neutral-400 text-xs mt-0.5">
                      Create interactive homework validation quizzes for any lesson. Ensure questions evaluate both technical competence and ethical business precautions.
                    </p>
                  </div>
                </div>

                <div className="mt-6 grid grid-cols-1 lg:grid-cols-12 gap-8">
                  <form onSubmit={handleSaveQuestion} className="lg:col-span-7 space-y-4">
                    <div className="space-y-1.5">
                      <label className="block text-[10px] font-mono uppercase tracking-widest text-gold">Target Lesson Topic</label>
                      <select
                        value={quizTopicId}
                        onChange={(e) => setQuizTopicId(e.target.value)}
                        className="w-full rounded border border-neutral-800 bg-black/60 px-3.5 py-2.5 text-white cursor-pointer focus:border-gold focus:outline-none"
                      >
                        <option value="">-- Choose Topic --</option>
                        {topics.map(t => (
                          <option key={t.id} value={t.id}>[{t.skillName}] {t.title}</option>
                        ))}
                      </select>
                    </div>

                    {quizTopicId && (
                      <div className="space-y-4 animate-fade-in">
                        <div className="space-y-1.5">
                          <label className="block text-[10px] font-mono uppercase tracking-widest text-neutral-400">Question Text</label>
                          <textarea
                            value={quizQuestionText}
                            onChange={(e) => setQuizQuestionText(e.target.value)}
                            rows={3}
                            placeholder="e.g. Which contract type is best suited for an ethical joint venture where both partners provide capital and share risk?"
                            className="w-full rounded border border-neutral-800 bg-black/60 px-3.5 py-2 text-white focus:border-gold focus:outline-none"
                          />
                        </div>

                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                          <div className="space-y-1.5">
                            <label className="block text-[10px] font-mono uppercase tracking-widest text-neutral-400">Option A</label>
                            <input
                              type="text"
                              value={quizOption1}
                              onChange={(e) => setQuizOption1(e.target.value)}
                              placeholder="Mudarabah"
                              className="w-full rounded border border-neutral-800 bg-black/60 px-3.5 py-2 text-white focus:border-gold focus:outline-none"
                            />
                          </div>

                          <div className="space-y-1.5">
                            <label className="block text-[10px] font-mono uppercase tracking-widest text-neutral-400">Option B</label>
                            <input
                              type="text"
                              value={quizOption2}
                              onChange={(e) => setQuizOption2(e.target.value)}
                              placeholder="Musharakah"
                              className="w-full rounded border border-neutral-800 bg-black/60 px-3.5 py-2 text-white focus:border-gold focus:outline-none"
                            />
                          </div>

                          <div className="space-y-1.5">
                            <label className="block text-[10px] font-mono uppercase tracking-widest text-neutral-400">Option C</label>
                            <input
                              type="text"
                              value={quizOption3}
                              onChange={(e) => setQuizOption3(e.target.value)}
                              placeholder="Murabahah"
                              className="w-full rounded border border-neutral-800 bg-black/60 px-3.5 py-2 text-white focus:border-gold focus:outline-none"
                            />
                          </div>

                          <div className="space-y-1.5">
                            <label className="block text-[10px] font-mono uppercase tracking-widest text-neutral-400">Option D</label>
                            <input
                              type="text"
                              value={quizOption4}
                              onChange={(e) => setQuizOption4(e.target.value)}
                              placeholder="Ijarah"
                              className="w-full rounded border border-neutral-800 bg-black/60 px-3.5 py-2 text-white focus:border-gold focus:outline-none"
                            />
                          </div>
                        </div>

                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                          <div className="space-y-1.5">
                            <label className="block text-[10px] font-mono uppercase tracking-widest text-neutral-400">Correct Option</label>
                            <select
                              value={quizCorrectIndex}
                              onChange={(e) => setQuizCorrectIndex(Number(e.target.value))}
                              className="w-full rounded border border-neutral-800 bg-black/60 px-3.5 py-2 text-white cursor-pointer focus:border-gold focus:outline-none"
                            >
                              <option value={0}>Option A</option>
                              <option value={1}>Option B</option>
                              <option value={2}>Option C</option>
                              <option value={3}>Option D</option>
                            </select>
                          </div>

                          <div className="space-y-1.5">
                            <label className="block text-[10px] font-mono uppercase tracking-widest text-neutral-400">Explanation / Feedback</label>
                            <input
                              type="text"
                              value={quizExplanation}
                              onChange={(e) => setQuizExplanation(e.target.value)}
                              placeholder="e.g. Musharakah is a partnership contract where profits are shared according to agreements, and losses according to capital ratio."
                              className="w-full rounded border border-neutral-800 bg-black/60 px-3.5 py-2 text-white focus:border-gold focus:outline-none"
                            />
                          </div>
                        </div>

                        {quizSuccessMsg && (
                          <div className="p-3.5 rounded border border-emerald-500/20 bg-emerald-500/10 text-emerald-400 text-xs">
                            {quizSuccessMsg}
                          </div>
                        )}

                        <button
                          type="submit"
                          className="w-full rounded bg-gold py-3 text-xs font-mono font-bold uppercase tracking-widest text-black hover:opacity-90 active:scale-[0.99] transition-all"
                        >
                          Save Question Node
                        </button>
                      </div>
                    )}
                  </form>

                  <div className="lg:col-span-5 rounded-xl border border-neutral-900 bg-neutral-950 p-5 space-y-4">
                    <h4 className="font-serif text-sm font-semibold text-white tracking-wide border-b border-neutral-800 pb-2 flex items-center gap-1.5">
                      <HelpCircle className="h-4 w-4 text-gold" />
                      <span>Current Lesson Quiz Questions ({currentQuiz?.questions?.length || 0})</span>
                    </h4>

                    {!quizTopicId ? (
                      <p className="text-neutral-500 italic">Select a lesson topic on the left to review its existing quiz structure.</p>
                    ) : !currentQuiz || currentQuiz.questions.length === 0 ? (
                      <p className="text-neutral-500 italic">No quiz questions defined for this lesson yet. Feel free to add some!</p>
                    ) : (
                      <div className="space-y-4 max-h-[350px] overflow-y-auto pr-1">
                        {currentQuiz.questions.map((q, qIdx) => (
                          <div key={q.id || qIdx} className="p-3 bg-black/40 rounded border border-neutral-900 space-y-2">
                            <div className="flex justify-between text-neutral-400 font-semibold">
                              <span>Question #{qIdx + 1}</span>
                              <span className="text-gold-light font-mono">Answer: {["A", "B", "C", "D"][q.correctOptionIndex]}</span>
                            </div>
                            <p className="text-white font-medium">{q.questionText}</p>
                            <div className="grid grid-cols-2 gap-1.5 text-[10px] text-neutral-400 font-mono pl-2 border-l border-neutral-800">
                              {q.options.map((opt, oIdx) => (
                                <div key={oIdx} className={oIdx === q.correctOptionIndex ? "text-emerald-400" : ""}>
                                  {["A", "B", "C", "D"][oIdx]}. {opt}
                                </div>
                              ))}
                            </div>
                            {q.explanation && (
                              <p className="text-[10px] text-neutral-500 italic border-t border-neutral-900/60 pt-1.5 mt-1.5">
                                💡 {q.explanation}
                              </p>
                            )}
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </div>
          );
        })()}

        {/* TAB 6: HOMEWORK SUBMISSIONS REVIEW */}
        {activeTab === "homework-review" && (() => {
          const handleGrade = async (subId: string, status: "Approved" | "Requires Revision") => {
            if (!reviewFeedback.trim()) {
              alert("Please enter coaching feedback for the student first.");
              return;
            }
            try {
              await updateSubmissionStatus(subId, status, reviewFeedback);
              setReviewFeedback("");
              alert(`Submission has been marked as ${status} with your feedback!`);
            } catch (err) {
              console.error(err);
              alert("Failed to update status.");
            }
          };

          return (
            <div className="space-y-6 animate-fade-in text-xs font-sans">
              <div className="rounded-xl border border-gold/15 bg-neutral-950 p-6 glass-panel">
                <div className="flex items-center gap-3 mb-4 border-b border-neutral-950 pb-3">
                  <Users className="h-6 w-6 text-gold" />
                  <div>
                    <h3 className="font-serif text-lg font-bold text-white">Student Project & Capstone Review Panel</h3>
                    <p className="text-neutral-400 text-xs mt-0.5">
                      Evaluate student submissions, audit their ethical code or business calculations, and submit constructive feedback directly to their learning paths.
                    </p>
                  </div>
                </div>

                <div className="space-y-5">
                  {submissions.length === 0 ? (
                    <div className="text-center py-12 text-neutral-500 border border-neutral-900 rounded-lg bg-black/20 italic">
                      No student project or homework submissions found in the database.
                    </div>
                  ) : (
                    submissions.map((sub) => (
                      <div key={sub.id} className="p-5 rounded-xl border border-neutral-900 bg-neutral-950/60 hover:bg-neutral-950 transition space-y-4">
                        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-neutral-900 pb-3">
                          <div>
                            <span className="font-serif text-sm font-bold text-white block">{sub.topicTitle}</span>
                            <span className="font-mono text-[10px] text-neutral-500 mt-0.5 inline-flex items-center gap-2">
                              👤 Student: <strong className="text-neutral-300">{sub.studentName}</strong> <span className="text-neutral-700">|</span> ⏱️ Submitted: {new Date(sub.submittedAt).toLocaleDateString()}
                            </span>
                          </div>

                          <div className="flex items-center gap-2">
                            {sub.status === "Approved" ? (
                              <span className="rounded-full bg-emerald-500/10 border border-emerald-500/20 px-3 py-1 text-[10px] font-mono text-emerald-400 uppercase font-bold">
                                Approved
                              </span>
                            ) : sub.status === "Requires Revision" ? (
                              <span className="rounded-full bg-yellow-500/10 border border-yellow-500/20 px-3 py-1 text-[10px] font-mono text-yellow-500 uppercase font-bold">
                                Revision Required
                              </span>
                            ) : (
                              <span className="rounded-full bg-blue-500/10 border border-blue-500/20 px-3 py-1 text-[10px] font-mono text-blue-400 uppercase font-bold animate-pulse">
                                Under Review
                              </span>
                            )}
                          </div>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                          <div className="space-y-2">
                            <span className="block text-[10px] font-mono uppercase tracking-widest text-neutral-400">Submission Assets</span>
                            {sub.githubUrl ? (
                              <a
                                href={sub.githubUrl}
                                target="_blank"
                                rel="noreferrer"
                                className="inline-flex items-center gap-1.5 rounded border border-neutral-800 bg-black px-3 py-2 text-xs font-mono text-gold hover:border-gold hover:bg-neutral-900 transition"
                              >
                                <ExternalLink className="h-3.5 w-3.5" />
                                <span>Inspect Code Base / Solution URL</span>
                              </a>
                            ) : (
                              <span className="text-neutral-500 italic text-[11px] block">No code repository specified.</span>
                            )}

                            <div className="mt-3.5 p-3.5 rounded border border-neutral-900 bg-black/40 text-neutral-300 whitespace-pre-wrap leading-relaxed font-sans text-xs">
                              {sub.submissionText}
                            </div>
                          </div>

                          <div className="space-y-3.5 bg-neutral-950 p-4 rounded-xl border border-neutral-900/60">
                            <span className="block text-[10px] font-mono uppercase tracking-widest text-gold font-bold">Faculty Feedback Console</span>
                            
                            <textarea
                              value={reviewFeedback}
                              onChange={(e) => setReviewFeedback(e.target.value)}
                              placeholder="Type professional, encouraging coaching advice. Remind them of specific business, technical, or spiritual lessons to refine..."
                              rows={3}
                              className="w-full rounded border border-neutral-800 bg-black/60 px-3.5 py-2 text-white focus:border-gold focus:outline-none text-xs"
                            />

                            {sub.feedback && (
                              <div className="text-[10px] text-neutral-500 italic pl-3 border-l border-neutral-800">
                                Last Feedback: "{sub.feedback}"
                              </div>
                            )}

                            <div className="flex gap-2 justify-end pt-1">
                              <button
                                onClick={() => handleGrade(sub.id, "Requires Revision")}
                                className="px-4 py-2 border border-yellow-500/20 bg-yellow-500/10 hover:bg-yellow-500 hover:text-black text-yellow-500 text-[10px] font-mono uppercase rounded font-bold transition-all"
                              >
                                Request Revision
                              </button>
                              <button
                                onClick={() => handleGrade(sub.id, "Approved")}
                                className="px-4 py-2 bg-emerald-600 hover:bg-emerald-500 text-white text-[10px] font-mono uppercase rounded font-bold transition-all"
                              >
                                Approve Solution
                              </button>
                            </div>
                          </div>
                        </div>
                      </div>
                    ))
                  )}
                </div>
              </div>
            </div>
          );
        })()}

      </div>

      {/* 5. OVERLAID 22+ FIELDS EDIT TOPIC FORM MODAL */}
      {isTopicModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm p-4 overflow-y-auto animate-fade-in">
          <div className="relative w-full max-w-4xl rounded-2xl border border-gold/20 bg-neutral-950 shadow-2xl overflow-hidden glass-panel flex flex-col max-h-[90vh]">
            
            {/* Modal Title */}
            <div className="px-6 py-4 bg-neutral-900 border-b border-gold/15 flex items-center justify-between">
              <div>
                <h3 className="font-serif text-lg font-bold text-white">
                  {editingTopicId ? `Modify Topic Console` : `Craft New Topic Entry`}
                </h3>
                <span className="text-[10px] font-mono text-gold uppercase tracking-wider block mt-0.5">
                  ✦ Dynamic Database Node
                </span>
              </div>
              <button
                onClick={() => setIsTopicModalOpen(false)}
                className="text-neutral-400 hover:text-white text-xs font-mono uppercase bg-neutral-950 border border-neutral-800 px-3 py-1.5 rounded"
              >
                Close
              </button>
            </div>

            {/* Modal Content */}
            <form onSubmit={handleSaveTopic} className="p-6 overflow-y-auto space-y-6 font-sans text-xs">
              
              {/* PRIMARY DETAILS METADATA */}
              <div>
                <h4 className="font-serif text-xs font-bold text-gold uppercase tracking-widest border-b border-gold/10 pb-2 mb-4 flex items-center gap-1.5">
                  <Folder className="h-4 w-4" />
                  <span>1. Core Curriculum Relationship & Naming</span>
                </h4>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  {/* Skill selector */}
                  <div>
                    <label className="block text-[10px] font-mono uppercase tracking-widest text-neutral-400 mb-2">
                      Skill Domain *
                    </label>
                    <select
                      value={topicForm.skillName}
                      onChange={(e) => setTopicForm({ ...topicForm, skillName: e.target.value })}
                      className="w-full rounded-lg border border-neutral-800 bg-black/60 px-3 py-2.5 text-white focus:border-gold focus:outline-none cursor-pointer"
                      required
                    >
                      {skills.map((s) => (
                        <option key={s.id} value={s.title}>{s.title}</option>
                      ))}
                    </select>
                  </div>

                  {/* Course Selector or custom */}
                  <div>
                    <label className="block text-[10px] font-mono uppercase tracking-widest text-neutral-400 mb-2">
                      Course Module Name *
                    </label>
                    <input
                      type="text"
                      list="existing-courses"
                      value={topicForm.courseName}
                      onChange={(e) => setTopicForm({ ...topicForm, courseName: e.target.value })}
                      className="w-full rounded-lg border border-neutral-800 bg-black/60 px-3.5 py-2.5 text-white focus:border-gold focus:outline-none"
                      placeholder="e.g. The Ethical AI Solopreneur"
                      required
                    />
                    <datalist id="existing-courses">
                      {courses.map((c, i) => (
                        <option key={c.id} value={c.name} />
                      ))}
                    </datalist>
                  </div>

                  {/* Topic Name */}
                  <div>
                    <label className="block text-[10px] font-mono uppercase tracking-widest text-neutral-400 mb-2">
                      Topic / Lesson Title *
                    </label>
                    <input
                      type="text"
                      value={topicForm.title}
                      onChange={(e) => setTopicForm({ ...topicForm, title: e.target.value })}
                      className="w-full rounded-lg border border-neutral-800 bg-black/60 px-3.5 py-2.5 text-white focus:border-gold focus:outline-none"
                      placeholder="e.g. Launching Your Organic Funnel"
                      required
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-4">
                  {/* Difficulty Level */}
                  <div>
                    <label className="block text-[10px] font-mono uppercase tracking-widest text-neutral-400 mb-2">
                      Difficulty Level
                    </label>
                    <select
                      value={topicForm.difficulty}
                      onChange={(e) => setTopicForm({ ...topicForm, difficulty: e.target.value as any })}
                      className="w-full rounded-lg border border-neutral-800 bg-black/60 px-3 py-2.5 text-white focus:border-gold focus:outline-none cursor-pointer"
                    >
                      <option value="Beginner">Beginner</option>
                      <option value="Intermediate">Intermediate</option>
                      <option value="Advanced">Advanced</option>
                    </select>
                  </div>

                  {/* Estimated Time */}
                  <div>
                    <label className="block text-[10px] font-mono uppercase tracking-widest text-neutral-400 mb-2">
                      Estimated Duration
                    </label>
                    <input
                      type="text"
                      value={topicForm.duration}
                      onChange={(e) => setTopicForm({ ...topicForm, duration: e.target.value })}
                      className="w-full rounded-lg border border-neutral-800 bg-black/60 px-3.5 py-2.5 text-white focus:border-gold focus:outline-none"
                      placeholder="e.g. 18 mins"
                    />
                  </div>

                  {/* Tags */}
                  <div>
                    <label className="block text-[10px] font-mono uppercase tracking-widest text-neutral-400 mb-2">
                      Tags <span className="text-neutral-600">(comma separated)</span>
                    </label>
                    <input
                      type="text"
                      value={topicForm.tags}
                      onChange={(e) => setTopicForm({ ...topicForm, tags: e.target.value })}
                      className="w-full rounded-lg border border-neutral-800 bg-black/60 px-3.5 py-2.5 text-white focus:border-gold focus:outline-none"
                      placeholder="e.g. AI, SEO, Halal Scaling"
                    />
                  </div>
                </div>

                <div className="mt-4">
                  <label className="block text-[10px] font-mono uppercase tracking-widest text-neutral-400 mb-2">
                    Short Description
                  </label>
                  <textarea
                    value={topicForm.shortDescription}
                    onChange={(e) => setTopicForm({ ...topicForm, shortDescription: e.target.value })}
                    rows={2}
                    className="w-full rounded-lg border border-neutral-800 bg-black/60 px-3.5 py-2.5 text-white focus:border-gold focus:outline-none"
                    placeholder="Provide a clear, high-integrity executive summary for the students..."
                  />
                </div>
              </div>

              {/* MEDIA & URLS WITH LIVE PREVIEW & AUTO VALIDATION */}
              <div>
                <h4 className="font-serif text-xs font-bold text-gold uppercase tracking-widest border-b border-gold/10 pb-2 mb-4 flex items-center gap-1.5">
                  <Film className="h-4 w-4" />
                  <span>2. Dynamic Media & Auto-Link Validation</span>
                </h4>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {/* YouTube Video Link */}
                  <div>
                    <label className="block text-[10px] font-mono uppercase tracking-widest text-neutral-400 mb-2">
                      YouTube Video Link
                    </label>
                    <input
                      type="text"
                      value={topicForm.videoUrl}
                      onChange={(e) => setTopicForm({ ...topicForm, videoUrl: e.target.value })}
                      className={`w-full rounded-lg bg-black/60 px-3.5 py-2.5 text-white focus:outline-none border ${
                        topicForm.videoUrl && !isValidUrl(topicForm.videoUrl)
                          ? "border-red-500/50"
                          : "border-neutral-800 focus:border-gold"
                      }`}
                      placeholder="e.g. https://www.youtube.com/embed/dQw4w9WgXcQ"
                    />
                    {topicForm.videoUrl && !isValidUrl(topicForm.videoUrl) && (
                      <span className="text-red-400 text-[10px] block mt-1">⚠️ Invalid URL format! Ensure it starts with http:// or https://</span>
                    )}

                    {/* YouTube Preview */}
                    {getYouTubeId(topicForm.videoUrl) && (
                      <div className="mt-3 rounded-lg overflow-hidden border border-gold/20 bg-black max-w-[200px] aspect-video relative group">
                        <img 
                          src={`https://img.youtube.com/vi/${getYouTubeId(topicForm.videoUrl)}/mqdefault.jpg`} 
                          alt="YouTube Live Preview" 
                          className="w-full h-full object-cover"
                        />
                        <div className="absolute inset-0 bg-black/50 flex items-center justify-center text-[9px] font-mono text-gold-light opacity-0 group-hover:opacity-100 transition-opacity">
                          YouTube Feed OK
                        </div>
                      </div>
                    )}
                  </div>

                  {/* YouTube Playlist Link */}
                  <div>
                    <label className="block text-[10px] font-mono uppercase tracking-widest text-neutral-400 mb-2">
                      YouTube Playlist Link
                    </label>
                    <input
                      type="text"
                      value={topicForm.youtubePlaylistLink}
                      onChange={(e) => setTopicForm({ ...topicForm, youtubePlaylistLink: e.target.value })}
                      className={`w-full rounded-lg bg-black/60 px-3.5 py-2.5 text-white focus:outline-none border ${
                        topicForm.youtubePlaylistLink && !isValidUrl(topicForm.youtubePlaylistLink)
                          ? "border-red-500/50"
                          : "border-neutral-800 focus:border-gold"
                      }`}
                      placeholder="e.g. https://www.youtube.com/playlist?list=PL..."
                    />
                    {topicForm.youtubePlaylistLink && !isValidUrl(topicForm.youtubePlaylistLink) && (
                      <span className="text-red-400 text-[10px] block mt-1">⚠️ Invalid URL format!</span>
                    )}
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
                  {/* Thumbnail URL */}
                  <div>
                    <label className="block text-[10px] font-mono uppercase tracking-widest text-neutral-400 mb-2">
                      Custom Thumbnail URL
                    </label>
                    <input
                      type="text"
                      value={topicForm.thumbnailUrl}
                      onChange={(e) => setTopicForm({ ...topicForm, thumbnailUrl: e.target.value })}
                      className={`w-full rounded-lg bg-black/60 px-3.5 py-2.5 text-white focus:outline-none border ${
                        topicForm.thumbnailUrl && !isValidUrl(topicForm.thumbnailUrl)
                          ? "border-red-500/50"
                          : "border-neutral-800 focus:border-gold"
                      }`}
                      placeholder="e.g. https://images.unsplash.com/..."
                    />
                    {topicForm.thumbnailUrl && !isValidUrl(topicForm.thumbnailUrl) && (
                      <span className="text-red-400 text-[10px] block mt-1">⚠️ Invalid URL format!</span>
                    )}
                  </div>

                  {/* Certificate Link */}
                  <div>
                    <label className="block text-[10px] font-mono uppercase tracking-widest text-neutral-400 mb-2">
                      Credential Certificate Link
                    </label>
                    <input
                      type="text"
                      value={topicForm.certificateLink}
                      onChange={(e) => setTopicForm({ ...topicForm, certificateLink: e.target.value })}
                      className={`w-full rounded-lg bg-black/60 px-3.5 py-2.5 text-white focus:outline-none border ${
                        topicForm.certificateLink && !isValidUrl(topicForm.certificateLink)
                          ? "border-red-500/50"
                          : "border-neutral-800 focus:border-gold"
                      }`}
                      placeholder="e.g. /certificates?course=..."
                    />
                    {topicForm.certificateLink && !isValidUrl(topicForm.certificateLink) && (
                      <span className="text-red-400 text-[10px] block mt-1">⚠️ Invalid URL format!</span>
                    )}
                  </div>
                </div>
              </div>

              {/* DOWNLOADS & ATTACHMENTS */}
              <div>
                <h4 className="font-serif text-xs font-bold text-gold uppercase tracking-widest border-b border-gold/10 pb-2 mb-4 flex items-center gap-1.5">
                  <Link className="h-4 w-4" />
                  <span>3. Study Guides & Resource Attachments</span>
                </h4>

                <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                  {/* Notes PDF */}
                  <div>
                    <label className="block text-[10px] font-mono uppercase tracking-widest text-neutral-400 mb-2">
                      Notes PDF Link
                    </label>
                    <input
                      type="text"
                      value={topicForm.notesPdfLink}
                      onChange={(e) => setTopicForm({ ...topicForm, notesPdfLink: e.target.value })}
                      className="w-full rounded-lg border border-neutral-800 bg-black/60 px-3 py-2 text-white focus:border-gold focus:outline-none"
                    />
                  </div>

                  {/* Assignment PDF */}
                  <div>
                    <label className="block text-[10px] font-mono uppercase tracking-widest text-neutral-400 mb-2">
                      Assignment Link
                    </label>
                    <input
                      type="text"
                      value={topicForm.assignmentPdf}
                      onChange={(e) => setTopicForm({ ...topicForm, assignmentPdf: e.target.value })}
                      className="w-full rounded-lg border border-neutral-800 bg-black/60 px-3 py-2 text-white focus:border-gold focus:outline-none"
                    />
                  </div>

                  {/* Project File */}
                  <div>
                    <label className="block text-[10px] font-mono uppercase tracking-widest text-neutral-400 mb-2">
                      Project File (.zip)
                    </label>
                    <input
                      type="text"
                      value={topicForm.projectFile}
                      onChange={(e) => setTopicForm({ ...topicForm, projectFile: e.target.value })}
                      className="w-full rounded-lg border border-neutral-800 bg-black/60 px-3 py-2 text-white focus:border-gold focus:outline-none"
                    />
                  </div>

                  {/* Download Link */}
                  <div>
                    <label className="block text-[10px] font-mono uppercase tracking-widest text-neutral-400 mb-2">
                      General Download Link
                    </label>
                    <input
                      type="text"
                      value={topicForm.downloadLink}
                      onChange={(e) => setTopicForm({ ...topicForm, downloadLink: e.target.value })}
                      className="w-full rounded-lg border border-neutral-800 bg-black/60 px-3 py-2 text-white focus:border-gold focus:outline-none"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
                  {/* Official Website */}
                  <div>
                    <label className="block text-[10px] font-mono uppercase tracking-widest text-neutral-400 mb-2">
                      Official Reference Website
                    </label>
                    <input
                      type="text"
                      value={topicForm.officialWebsiteLink}
                      onChange={(e) => setTopicForm({ ...topicForm, officialWebsiteLink: e.target.value })}
                      className="w-full rounded-lg border border-neutral-800 bg-black/60 px-3.5 py-2.5 text-white focus:border-gold focus:outline-none"
                    />
                  </div>

                  {/* Next Topic and Prerequisites */}
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-[10px] font-mono uppercase tracking-widest text-neutral-400 mb-2">
                        Prerequisites
                      </label>
                      <input
                        type="text"
                        value={topicForm.prerequisites}
                        onChange={(e) => setTopicForm({ ...topicForm, prerequisites: e.target.value })}
                        className="w-full rounded-lg border border-neutral-800 bg-black/60 px-3 py-2 text-white focus:border-gold focus:outline-none"
                        placeholder="e.g. Basic Laptop"
                      />
                    </div>
                    <div>
                      <label className="block text-[10px] font-mono uppercase tracking-widest text-neutral-400 mb-2">
                        Next Topic
                      </label>
                      <input
                        type="text"
                        value={topicForm.nextTopic}
                        onChange={(e) => setTopicForm({ ...topicForm, nextTopic: e.target.value })}
                        className="w-full rounded-lg border border-neutral-800 bg-black/60 px-3 py-2 text-white focus:border-gold focus:outline-none"
                        placeholder="e.g. Scaling LLMs"
                      />
                    </div>
                  </div>
                </div>
              </div>

              {/* TACTICAL VALUE & ISLAMIC PHILOSOPHY PILLARS */}
              <div>
                <h4 className="font-serif text-xs font-bold text-gold uppercase tracking-widest border-b border-gold/10 pb-2 mb-4 flex items-center gap-1.5">
                  <HelpCircle className="h-4 w-4" />
                  <span>4. Noble Entrepreneurial & Ethical Pillars</span>
                </h4>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  {/* Business Application */}
                  <div>
                    <label className="block text-[10px] font-mono uppercase tracking-widest text-neutral-400 mb-2">
                      Business Application
                    </label>
                    <textarea
                      value={topicForm.businessApplication}
                      onChange={(e) => setTopicForm({ ...topicForm, businessApplication: e.target.value })}
                      rows={3}
                      className="w-full rounded-lg border border-neutral-800 bg-black/60 px-3.5 py-2 text-white focus:border-gold focus:outline-none"
                      placeholder="Describe exactly how this lesson is deployed in a commercial environment..."
                    />
                  </div>

                  {/* Income Opportunity */}
                  <div>
                    <label className="block text-[10px] font-mono uppercase tracking-widest text-neutral-400 mb-2">
                      Income & Financial Opportunity
                    </label>
                    <textarea
                      value={topicForm.incomeOpportunity}
                      onChange={(e) => setTopicForm({ ...topicForm, incomeOpportunity: e.target.value })}
                      rows={3}
                      className="w-full rounded-lg border border-neutral-800 bg-black/60 px-3.5 py-2 text-white focus:border-gold focus:outline-none"
                      placeholder="Average billing rate, retainer capabilities, or asset leverage values..."
                    />
                  </div>

                  {/* Islamic Insights */}
                  <div>
                    <label className="block text-[10px] font-mono uppercase tracking-widest text-neutral-400 mb-2">
                      Islamic Business Insights
                    </label>
                    <textarea
                      value={topicForm.islamicInsights}
                      onChange={(e) => setTopicForm({ ...topicForm, islamicInsights: e.target.value })}
                      rows={3}
                      className="w-full rounded-lg border border-neutral-800 bg-black/60 px-3.5 py-2 text-white focus:border-gold focus:outline-none"
                      placeholder="Prophetic market entry ethics, halal compliance boundaries, and shura teams..."
                    />
                  </div>
                </div>
              </div>

              {/* SYSTEM TOGGLES: PUBLISHED / FEATURED / DRAFT */}
              <div className="border-t border-neutral-800 pt-5 flex items-center justify-between">
                <div className="flex gap-6">
                  {/* Published Toggle */}
                  <label className="flex items-center gap-2.5 cursor-pointer group">
                    <button
                      type="button"
                      onClick={() => setTopicForm({ ...topicForm, published: !topicForm.published })}
                      className={`relative inline-flex h-6 w-11 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none ${
                        topicForm.published ? "bg-emerald-500" : "bg-neutral-800"
                      }`}
                    >
                      <span className={`pointer-events-none inline-block h-5 w-5 transform rounded-full bg-white shadow ring-0 transition duration-200 ease-in-out ${
                        topicForm.published ? "translate-x-5" : "translate-x-0"
                      }`} />
                    </button>
                    <div>
                      <span className="text-white block font-semibold">Publish to Public Site</span>
                      <span className="text-[10px] text-neutral-500 block">If disabled, this topic stays saved as a secure draft.</span>
                    </div>
                  </label>

                  {/* Featured Toggle */}
                  <label className="flex items-center gap-2.5 cursor-pointer group">
                    <button
                      type="button"
                      onClick={() => setTopicForm({ ...topicForm, featured: !topicForm.featured })}
                      className={`relative inline-flex h-6 w-11 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none ${
                        topicForm.featured ? "bg-gold" : "bg-neutral-800"
                      }`}
                    >
                      <span className={`pointer-events-none inline-block h-5 w-5 transform rounded-full bg-white shadow ring-0 transition duration-200 ease-in-out ${
                        topicForm.featured ? "translate-x-5" : "translate-x-0"
                      }`} />
                    </button>
                    <div>
                      <span className="text-white block font-semibold">Mark as Featured Chapter</span>
                      <span className="text-[10px] text-neutral-500 block">Promote this topic to top indexes.</span>
                    </div>
                  </label>
                </div>

                <div className="flex gap-3">
                  <button
                    type="button"
                    onClick={() => setIsTopicModalOpen(false)}
                    className="rounded border border-neutral-800 px-5 py-3 hover:bg-neutral-900 font-mono text-xs uppercase"
                  >
                    Cancel
                  </button>
                  <button
                    id="save-topic-modal-submit-btn"
                    type="submit"
                    className="rounded bg-gold px-6 py-3 text-xs font-mono font-bold uppercase tracking-widest text-black hover:opacity-90 active:scale-[0.98] transition-all"
                  >
                    ✔ Commit Database Node
                  </button>
                </div>
              </div>

            </form>
          </div>
        </div>
      )}

    </div>
  );
}
