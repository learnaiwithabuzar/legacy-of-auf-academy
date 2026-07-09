import { useState } from "react";
import { MessageSquare, Instagram, Facebook, ChevronRight, ChevronLeft, Share2, HelpCircle } from "lucide-react";

export default function FloatingControls() {
  const [sidebarOpen, setSidebarOpen] = useState(true);

  const channels = [
    {
      id: "whatsapp",
      label: "Join WhatsApp Channel",
      url: "https://whatsapp.com/channel/0029VbDX7cP1XquYD9GOl72d",
      icon: MessageSquare,
      color: "bg-[#25D366]",
      textColor: "text-black",
      glowColor: "rgba(37,211,102,0.4)"
    },
    {
      id: "instagram",
      label: "Follow Instagram Reels",
      url: "https://www.instagram.com/lagecyofauf?igsh=dDc5NHg4Z2V3Nnk2",
      icon: Instagram,
      color: "bg-[#E1306C]",
      textColor: "text-white",
      glowColor: "rgba(225,48,108,0.4)"
    },
    {
      id: "facebook",
      label: "Join Facebook Group",
      url: "https://www.facebook.com/profile.php?id=61576440355188",
      icon: Facebook,
      color: "bg-[#1877F2]",
      textColor: "text-white",
      glowColor: "rgba(24,119,242,0.4)"
    }
  ];

  const handleShare = () => {
    if (navigator.share) {
      navigator.share({
        title: "Legacy of Auf Academy",
        url: window.location.href
      }).catch(console.error);
    } else {
      navigator.clipboard.writeText(window.location.href);
      alert("Website URL copied to clipboard!");
    }
  };

  return (
    <>
      {/* 1. STICKY SOCIAL SIDEBAR (Desktop Only - hidden on sm/md) */}
      <div 
        id="sticky-social-sidebar"
        className={`fixed left-0 top-1/3 z-40 hidden lg:flex flex-col transition-all duration-300 ${
          sidebarOpen ? "translate-x-0" : "-translate-x-12"
        }`}
      >
        <div className="flex items-center">
          {/* Main social anchors column */}
          <div className="flex flex-col rounded-r-xl border-y border-r border-gold/25 bg-black/90 p-2 space-y-3.5 shadow-lg shadow-gold/5">
            {channels.map((chan) => {
              const Icon = chan.icon;
              return (
                <a
                  id={`sidebar-anchor-${chan.id}`}
                  key={chan.id}
                  href={chan.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className={`group relative flex h-10 w-10 items-center justify-center rounded-lg border border-gold/15 bg-neutral-950 text-gold transition-all duration-300 hover:scale-115 hover:text-white`}
                  style={{ boxShadow: `0 0 10px ${chan.glowColor}` }}
                >
                  <Icon className="h-5 w-5" />
                  
                  {/* Hover Tooltip Label */}
                  <span className="absolute left-14 scale-0 rounded bg-black border border-gold/30 px-3 py-1 text-xs font-mono font-bold text-gold-light whitespace-nowrap shadow-md transition-all duration-200 group-hover:scale-100">
                    {chan.label}
                  </span>
                </a>
              );
            })}
            
            {/* Share action button */}
            <button
              id="sidebar-share-btn"
              onClick={handleShare}
              className="flex h-10 w-10 items-center justify-center rounded-lg border border-gold/15 bg-neutral-950 text-gold hover:bg-gold hover:text-black transition-all"
              title="Share Website"
            >
              <Share2 className="h-4.5 w-4.5" />
            </button>
          </div>

          {/* Sidebar Toggle handle */}
          <button
            id="sidebar-toggle-btn"
            onClick={() => setSidebarOpen(!sidebarOpen)}
            className="flex h-10 w-5 items-center justify-center rounded-r border-y border-r border-gold/20 bg-black/90 text-gold hover:text-white hover:bg-emerald-deep/20 focus:outline-none"
          >
            {sidebarOpen ? <ChevronLeft className="h-4 w-4" /> : <ChevronRight className="h-4 w-4" />}
          </button>
        </div>
      </div>

      {/* 2. FLOATING INDEPENDENT BUTTONS (Mobile & Desktop - positioned bottom right) */}
      <div 
        id="floating-channels-box"
        className="fixed bottom-6 right-6 z-40 flex flex-col gap-3"
      >
        {channels.map((chan) => {
          const Icon = chan.icon;
          return (
            <a
              id={`floating-btn-${chan.id}`}
              key={chan.id}
              href={chan.url}
              target="_blank"
              rel="noopener noreferrer"
              className={`flex h-12 w-12 items-center justify-center rounded-full text-white shadow-lg transition-all duration-300 hover:scale-110 active:scale-95 group relative ${chan.color}`}
              style={{ boxShadow: `0 4px 15px ${chan.glowColor}` }}
            >
              <Icon className="h-6 w-6 stroke-[2]" />

              {/* Tooltip text (grows upwards on hover) */}
              <span className="absolute right-14 bottom-1 scale-0 rounded-lg bg-black/95 border border-gold/30 px-3 py-1.5 text-xs font-mono font-bold text-gold-light whitespace-nowrap shadow-md transition-all duration-200 group-hover:scale-100">
                {chan.label}
              </span>
            </a>
          );
        })}
      </div>
    </>
  );
}
