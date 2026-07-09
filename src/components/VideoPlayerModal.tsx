import { X, VideoOff, Check } from "lucide-react";
import { useCMS } from "../store/cmsStore";

interface VideoPlayerModalProps {
  isOpen: boolean;
  onClose: () => void;
  videoUrl: string;
  topicTitle: string;
  topicId?: string;
}

// Robust helper to transform any standard/short/shorts/embed YouTube URL into a valid embed URL
const getYouTubeEmbedUrl = (url: string): string => {
  if (!url) return "";
  
  const trimmed = url.trim();
  if (trimmed.includes("/embed/")) {
    return trimmed;
  }
  
  let videoId = "";
  try {
    if (trimmed.includes("youtu.be/")) {
      videoId = trimmed.split("youtu.be/")[1]?.split(/[?#]/)[0] || "";
    } else if (trimmed.includes("youtube.com/watch")) {
      const urlObj = new URL(trimmed);
      videoId = urlObj.searchParams.get("v") || "";
    } else if (trimmed.includes("youtube.com/shorts/")) {
      videoId = trimmed.split("youtube.com/shorts/")[1]?.split(/[?#]/)[0] || "";
    } else if (trimmed.includes("youtube.com/embed/")) {
      videoId = trimmed.split("youtube.com/embed/")[1]?.split(/[?#]/)[0] || "";
    } else {
      const regExp = /^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|\&v=)([^#\&\?]*).*/;
      const match = trimmed.match(regExp);
      if (match && match[2] && match[2].length === 11) {
        videoId = match[2];
      }
    }
  } catch (e) {
    console.error("Error parsing YouTube URL:", e);
  }
  
  if (videoId && videoId.length === 11) {
    return `https://www.youtube.com/embed/${videoId}`;
  }
  
  return trimmed;
};

export default function VideoPlayerModal({ isOpen, onClose, videoUrl, topicTitle, topicId }: VideoPlayerModalProps) {
  const { isTopicCompleted, toggleTopicCompletion } = useCMS();
  
  if (!isOpen) return null;

  const resolvedEmbedUrl = getYouTubeEmbedUrl(videoUrl);
  const isCompleted = topicId ? isTopicCompleted(topicId) : false;
  
  // Detect if the video URL is missing, empty, or set to the default YouTube video placeholder (dQw4w9WgXcQ)
  const isPlaceholder = !videoUrl || 
    videoUrl.trim() === "" || 
    videoUrl === "placeholder" || 
    videoUrl.includes("dQw4w9WgXcQ");

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/90 backdrop-blur-sm animate-fade-in">
      {/* Gilded container */}
      <div 
        id="video-player-container"
        className="relative w-full max-w-4xl overflow-hidden rounded-xl border border-gold/40 bg-black shadow-2xl shadow-gold/10"
      >
        {/* Modal Header */}
        <div className="flex items-center justify-between border-b border-gold/20 bg-emerald-deep/40 px-6 py-4">
          <div className="flex-1 pr-4 text-left">
            <span className="font-mono text-[10px] uppercase tracking-widest text-gold block">Lesson Player</span>
            <h3 className="font-serif text-base font-bold text-white tracking-wide">{topicTitle}</h3>
          </div>
          <div className="flex items-center gap-2.5 shrink-0">
            {topicId && (
              <button
                onClick={() => toggleTopicCompletion(topicId)}
                className={`flex items-center gap-1.5 rounded-lg border px-3.5 py-1.5 text-xs font-semibold transition-all duration-300 focus:outline-none ${
                  isCompleted
                    ? "bg-emerald-500/20 border-emerald-500 text-emerald-400 hover:bg-emerald-500/30"
                    : "bg-black/40 border-gold/30 text-gold hover:bg-gold hover:text-black hover:border-gold"
                }`}
              >
                <Check className={`h-3.5 w-3.5 stroke-[2.5] ${isCompleted ? "animate-pulse" : ""}`} />
                <span>{isCompleted ? "Completed!" : "Mark Complete"}</span>
              </button>
            )}
            <button 
              id="close-video-modal"
              onClick={onClose}
              className="rounded-full border border-gold/20 bg-black/40 p-2 text-gold transition-all duration-300 hover:bg-gold hover:text-black focus:outline-none"
              aria-label="Close Video"
            >
              <X className="h-5 w-5" />
            </button>
          </div>
        </div>

        {/* Video Frame or Placeholder Card */}
        <div className="aspect-video w-full bg-black">
          {isPlaceholder ? (
            <div 
              className="relative h-full w-full flex flex-col items-center justify-center text-center p-6 bg-cover bg-center"
              style={{ backgroundImage: `url('https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=1200&q=80')` }}
            >
              {/* Dark glassmorphic overlay */}
              <div className="absolute inset-0 bg-neutral-950/85 backdrop-blur-[2px]" />
              
              {/* Content */}
              <div className="relative z-10 max-w-md mx-auto space-y-4 animate-fade-in px-4">
                <div className="mx-auto h-16 w-16 flex items-center justify-center rounded-full border border-gold/30 bg-emerald-deep/20 text-gold mb-2 shadow-glow">
                  <VideoOff className="h-8 w-8 stroke-[1.5]" />
                </div>
                
                <div className="space-y-1">
                  <h4 className="font-serif text-xl font-bold text-white tracking-wide text-glow-gold">
                    No Video Added Yet
                  </h4>
                  <p className="font-mono text-[10px] text-gold uppercase tracking-widest">
                    ✦ Sovereign Curriculum Stream ✦
                  </p>
                </div>
                
                <p className="font-sans text-xs text-neutral-300 leading-relaxed max-w-sm mx-auto">
                  This lesson's professional video stream has not been configured yet. Administrators can easily update this from the CMS Portal.
                </p>
                
                <div className="pt-2">
                  <span className="inline-flex items-center gap-1.5 rounded-full border border-gold/15 bg-black/40 px-3.5 py-1 text-[10px] font-mono text-gold">
                    Status: Awaiting CMS Update
                  </span>
                </div>
              </div>
            </div>
          ) : (
            <iframe
              id="academy-video-iframe"
              className="h-full w-full"
              src={resolvedEmbedUrl}
              title={topicTitle}
              frameBorder="0"
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
              allowFullScreen
            />
          )}
        </div>
      </div>
    </div>
  );
}
