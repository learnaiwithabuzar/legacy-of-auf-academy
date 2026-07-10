import { useState } from "react";
import Navbar from "./components/Navbar";
import Hero from "./components/Hero";
import About from "./components/About";
import SkillsGrid from "./components/SkillsGrid";
import LearningPaths from "./components/LearningPaths";
import CertificateGenerator from "./components/CertificateGenerator";
import Projects from "./components/Projects";
import Insights from "./components/Insights";
import CommunitySection from "./components/CommunitySection";
import ContactForm from "./components/ContactForm";
import AdminDashboard from "./components/AdminDashboard";
import MyProfile from "./components/MyProfile";
import Footer from "./components/Footer";
import VideoPlayerModal from "./components/VideoPlayerModal";
import FloatingControls from "./components/FloatingControls";
import { useCMS } from "./store/cmsStore";
import { Bell, X } from "lucide-react";

export default function App() {
  const { activePushToast, dismissPushToast, firestoreError } = useCMS();
  const [currentTab, setCurrentTab] = useState<string>("home");
  const [showRulesNotice, setShowRulesNotice] = useState<boolean>(true);
  
  const [videoModal, setVideoModal] = useState({
    isOpen: false,
    videoUrl: "",
    topicTitle: "",
    topicId: "",
  });

  const handleWatchVideo = (videoUrl: string, topicTitle: string, topicId?: string) => {
    setVideoModal({
      isOpen: true,
      videoUrl,
      topicTitle,
      topicId: topicId || "",
    });
  };

  const handleCloseVideo = () => {
    setVideoModal(prev => ({ ...prev, isOpen: false }));
  };

  return (
    <div className="relative min-h-screen bg-black text-neutral-300 antialiased selection:bg-gold selection:text-black font-sans">
      
      {/* 1. Global Navigation Bar */}
      <Navbar currentTab={currentTab} setCurrentTab={setCurrentTab} />

      {/* Firebase Security Rules Troubleshooting Notice */}
      {firestoreError && showRulesNotice && (
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-6">
          <div className="rounded-xl border border-amber-500/30 bg-amber-500/5 p-5 shadow-2xl backdrop-blur-md relative overflow-hidden">
            <div className="absolute top-0 right-0 p-3">
              <button 
                onClick={() => setShowRulesNotice(false)} 
                className="text-neutral-400 hover:text-white transition p-1 hover:bg-neutral-800 rounded-md"
                title="Dismiss warning"
              >
                <X className="h-4 w-4" />
              </button>
            </div>
            
            <div className="flex items-start gap-4">
              <div className="p-2.5 rounded-lg bg-amber-500/10 text-amber-500 border border-amber-500/20 shrink-0">
                <Bell className="h-6 w-6 animate-pulse" />
              </div>
              
              <div className="space-y-3 flex-1 pr-6">
                <h4 className="font-serif text-base font-bold text-white tracking-wide uppercase text-amber-500">
                   Firebase Database Setup Action Required
                </h4>
                <p className="text-sm text-neutral-300 leading-relaxed font-sans">
                  The application is correctly connected to the target production Firebase project <code className="text-amber-400 font-mono text-xs">legacy-of-auf-academy</code>, but has encountered a <strong className="text-white">Firestore Security Rules permission failure</strong> while attempting to retrieve collections (<code className="text-neutral-400 font-mono text-xs">{firestoreError.path || "challenges"}</code>).
                </p>
                
                <div className="space-y-2 pt-1">
                  <p className="text-xs font-bold text-neutral-200 uppercase tracking-wider font-sans">
                    How to solve this in 30 seconds:
                  </p>
                  <ol className="list-decimal list-inside text-xs text-neutral-400 space-y-1 font-sans">
                    <li>Open the <a href="https://console.firebase.google.com/project/legacy-of-auf-academy/firestore/rules" target="_blank" rel="noopener noreferrer" className="text-amber-400 hover:underline inline-flex items-center gap-0.5 font-bold">Firebase Console Rules Tab ↗</a> in your browser.</li>
                    <li>Replace your current security rules with the following rules allowing read/write access:</li>
                  </ol>
                  
                  <pre className="bg-neutral-950 border border-neutral-800 rounded-lg p-3 text-[11px] font-mono text-amber-300 overflow-x-auto max-h-40 leading-normal select-all">
{`rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    match /{document=**} {
      allow read, write: if true;
    }
  }
}`}
                  </pre>
                  
                  <p className="text-[11px] text-neutral-500 font-sans italic">
                    Note: As this is a secure client-side simulation workspace, these rules are ideal for development, role simulations, and instant database hydration. Click inside the code block to select and copy.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* 2. Main content router/tabs with transition wrapper */}
      <main className="min-h-[calc(100vh-280px)]">
        {currentTab === "home" && (
          <div className="animate-fade-in">
            {/* Hero Section */}
            <Hero 
              onExplore={() => setCurrentTab("paths")} 
              onJoinCommunity={() => setCurrentTab("community")} 
            />
            {/* Mission Statement & History Pillar */}
            <About />
            {/* Skills & Classroom Matrix */}
            <SkillsGrid onWatchVideo={handleWatchVideo} />
          </div>
        )}

        {currentTab === "paths" && (
          <div className="animate-fade-in">
            <LearningPaths onWatchVideo={handleWatchVideo} />
          </div>
        )}

        {currentTab === "certificates" && (
          <div className="animate-fade-in">
            <CertificateGenerator />
          </div>
        )}

        {currentTab === "projects" && (
          <div className="animate-fade-in">
            <Projects />
          </div>
        )}

        {currentTab === "insights" && (
          <div className="animate-fade-in">
            <Insights />
          </div>
        )}

        {currentTab === "community" && (
          <div className="animate-fade-in">
            <CommunitySection />
          </div>
        )}

        {currentTab === "contact" && (
          <div className="animate-fade-in">
            <ContactForm />
          </div>
        )}

        {currentTab === "admin" && (
          <div className="animate-fade-in">
            <AdminDashboard />
          </div>
        )}

        {currentTab === "profile" && (
          <div className="animate-fade-in">
            <MyProfile onWatchVideo={handleWatchVideo} />
          </div>
        )}
      </main>

      {/* 3. Global Footer block */}
      <Footer setCurrentTab={setCurrentTab} />

      {/* 4. Overlaid video modal */}
      <VideoPlayerModal
        isOpen={videoModal.isOpen}
        onClose={handleCloseVideo}
        videoUrl={videoModal.videoUrl}
        topicTitle={videoModal.topicTitle}
        topicId={videoModal.topicId}
      />

      {/* 5. Sticky and floating social media channels */}
      <FloatingControls />

      {/* 6. Simulated Live Push Notification Toast Alert */}
      {activePushToast && (
        <div className="fixed bottom-6 right-6 z-50 max-w-sm w-full rounded-xl border border-gold/25 bg-neutral-950 p-4 shadow-2xl shadow-gold/10 animate-fade-in glass-panel flex items-start gap-3.5">
          <div className={`p-2 rounded-lg shrink-0 ${
            activePushToast.type === 'success' ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20' :
            activePushToast.type === 'update' ? 'bg-yellow-500/10 text-yellow-500 border border-yellow-500/20' :
            'bg-gold/10 text-gold border border-gold/20'
          }`}>
            <Bell className="h-5 w-5 animate-bounce" />
          </div>
          
          <div className="flex-1 space-y-1">
            <div className="flex justify-between items-start">
              <h5 className="font-serif text-xs font-bold text-white uppercase tracking-wider">
                {activePushToast.title}
              </h5>
              <button 
                onClick={dismissPushToast}
                className="text-neutral-500 hover:text-white transition p-0.5"
              >
                <X className="h-3.5 w-3.5" />
              </button>
            </div>
            <p className="text-[11px] text-neutral-300 leading-relaxed font-sans">
              {activePushToast.message}
            </p>
            {activePushToast.actionTab && (
              <button
                onClick={() => {
                  setCurrentTab(activePushToast.actionTab);
                  dismissPushToast();
                }}
                className="mt-2 text-[10px] text-gold hover:underline font-mono font-bold flex items-center gap-1 uppercase tracking-wider cursor-pointer"
              >
                <span>Access Portal Node ➔</span>
              </button>
            )}
          </div>
        </div>
      )}

    </div>
  );
}
