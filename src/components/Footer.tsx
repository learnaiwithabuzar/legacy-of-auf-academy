import { LogoSVG } from "./Navbar";
import { MessageSquare, Instagram, Facebook } from "lucide-react";

interface FooterProps {
  setCurrentTab: (tab: string) => void;
}

export default function Footer({ setCurrentTab }: FooterProps) {
  const handleLinkClick = (tabId: string) => {
    setCurrentTab(tabId);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const currentYear = new Date().getFullYear();

  return (
    <footer className="relative border-t border-gold/15 bg-black text-neutral-400 font-sans text-sm">
      <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
        
        {/* Main Footer layout */}
        <div className="grid grid-cols-1 gap-10 md:grid-cols-12 mb-10 pb-10 border-b border-gold/10">
          
          {/* Column 1: Brand & Logo (5 cols) */}
          <div className="md:col-span-5 space-y-4">
            <div className="flex items-center gap-3">
              <LogoSVG className="h-10 w-10" />
              <div>
                <span className="block font-serif text-base font-bold tracking-wider text-white text-glow-gold">
                  LEGACY OF AUF
                </span>
                <span className="block font-mono text-[9px] uppercase tracking-widest text-gold">
                  ACADEMY
                </span>
              </div>
            </div>
            
            <p className="font-serif italic text-xs text-gold-light max-w-sm">
              "Build Skills. Build Business. Build Legacy."
            </p>
            <p className="text-xs text-neutral-400 leading-relaxed max-w-sm">
              Pioneering the future of ethical digital entrepreneurship. Educating students across AI automation, halal copywriting, riba-free investing, and team leadership.
            </p>
          </div>

          {/* Column 2: Quick Links (3 cols) */}
          <div className="md:col-span-3 space-y-3">
            <h4 className="font-serif text-xs font-bold uppercase tracking-widest text-white border-l-2 border-gold pl-2">
              Quick Links
            </h4>
            <ul className="space-y-2 text-xs">
              {[
                { id: "home", label: "Home" },
                { id: "paths", label: "Learning Paths" },
                { id: "certificates", label: "Certificates" },
                { id: "projects", label: "Projects" },
                { id: "insights", label: "Islamic Business Insights" },
                { id: "community", label: "Community" },
                { id: "contact", label: "Contact" },
              ].map((link) => (
                <li key={link.id}>
                  <button
                    id={`footer-link-${link.id}`}
                    onClick={() => handleLinkClick(link.id)}
                    className="hover:text-gold transition-colors focus:outline-none"
                  >
                    • {link.label}
                  </button>
                </li>
              ))}
            </ul>
          </div>

          {/* Column 3: Official Community channels (4 cols) */}
          <div className="md:col-span-4 space-y-4">
            <h4 className="font-serif text-xs font-bold uppercase tracking-widest text-white border-l-2 border-gold pl-2">
              Official Community
            </h4>
            
            <p className="text-xs text-neutral-400 leading-relaxed">
              Connect directly to our certified global platforms to get announcements instantly.
            </p>

            <div className="space-y-2">
              <a
                id="footer-social-whatsapp"
                href="https://whatsapp.com/channel/0029VbDX7cP1XquYD9GOl72d"
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-2 text-xs text-neutral-300 hover:text-gold transition-colors"
              >
                <MessageSquare className="h-4.5 w-4.5 text-gold shrink-0" />
                <span>WhatsApp Channel</span>
              </a>

              <a
                id="footer-social-instagram"
                href="https://www.instagram.com/lagecyofauf?igsh=dDc5NHg4Z2V3Nnk2"
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-2 text-xs text-neutral-300 hover:text-gold transition-colors"
              >
                <Instagram className="h-4.5 w-4.5 text-gold shrink-0" />
                <span>Instagram Feed</span>
              </a>

              <a
                id="footer-social-facebook"
                href="https://www.facebook.com/profile.php?id=61576440355188"
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-2 text-xs text-neutral-300 hover:text-gold transition-colors"
              >
                <Facebook className="h-4.5 w-4.5 text-gold shrink-0" />
                <span>Facebook Community</span>
              </a>
            </div>
          </div>

        </div>

        {/* Disclaimer & Copyright section */}
        <div className="text-center text-[11px] text-neutral-500 space-y-4 pt-4 border-t border-gold/10">
          <p className="leading-relaxed max-w-4xl mx-auto">
            Inspired by the ethical business values of Hazrat Abdur Rahman ibn Awf (RA).
            This is an independent educational initiative focused on ethical entrepreneurship
            and does not claim to represent his exact historical business model.
          </p>
          
          <div className="flex flex-col sm:flex-row items-center justify-center gap-2 text-neutral-600 font-mono text-[10px]">
            <span>Copyright © {currentYear} Legacy of Auf Academy. All Rights Reserved.</span>
            <span className="hidden sm:inline">|</span>
            <span className="text-gold/40">Build Skills. Build Business. Build Legacy.</span>
          </div>
        </div>

      </div>
    </footer>
  );
}
