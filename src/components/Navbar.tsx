import { useState } from "react";
import { Menu, X, Landmark, Compass, Award, Briefcase, BookOpen, Users, Mail, Settings, User, Bell, Trash2, Shield, Globe } from "lucide-react";
import { useCMS } from "../store/cmsStore";

interface NavbarProps {
  currentTab: string;
  setCurrentTab: (tab: string) => void;
}

export function LogoSVG({ className = "h-10 w-10" }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 100 100"
      className={`${className} fill-none`}
      xmlns="http://www.w3.org/2000/svg"
    >
      {/* Outer Golden Glow Star Background */}
      <polygon
        points="50,5 63,37 95,50 63,63 50,95 37,63 5,50 37,37"
        className="fill-emerald-deep stroke-gold stroke-2"
        opacity="0.9"
      />
      {/* Inner Rotated Star for Rub el Hizb geometric precision */}
      <polygon
        points="50,15 75,25 85,50 75,75 50,85 25,75 15,50 25,25"
        className="fill-black stroke-gold-light stroke-[1.5]"
      />
      
      {/* Open Book Motif (Representing Knowledge & Quranic Ethics) */}
      <path
        d="M32 58 C 40 54, 45 54, 50 56 C 55 54, 60 54, 68 58 L 68 40 C 60 36, 55 36, 50 38 C 45 36, 40 36, 32 40 Z"
        className="fill-emerald-accent/30 stroke-gold stroke-2"
      />
      <line x1="50" y1="38" x2="50" y2="56" className="stroke-gold stroke-2" />

      {/* Ascending Wealth Growth Arrow (Symbolizing ethical entrepreneurship) */}
      <path
        d="M50 54 L 50 28 M 43 35 L 50 28 L 57 35"
        className="stroke-gold-light stroke-[2.5]"
        strokeLinecap="round"
        strokeLinejoin="round"
      />

      {/* Central Diamond Spark */}
      <polygon
        points="50,22 53,25 50,28 47,25"
        className="fill-gold"
      />
    </svg>
  );
}

export default function Navbar({ currentTab, setCurrentTab }: NavbarProps) {
  const [isOpen, setIsOpen] = useState(false);
  const { 
    notifications, 
    markNotificationRead, 
    clearAllNotifications, 
    simulatedRole, 
    setSimulatedRole,
    isAdmin,
    addNotification,
    currentLanguage,
    setLanguage
  } = useCMS();

  const [showNotifDropdown, setShowNotifDropdown] = useState(false);
  const [showRoleDropdown, setShowRoleDropdown] = useState(false);
  const [showLangDropdown, setShowLangDropdown] = useState(false);

  const languages: Array<"English" | "Arabic" | "Urdu" | "Hindi"> = [
    "English", "Arabic", "Urdu", "Hindi"
  ];

  const unreadCount = notifications.filter(n => !n.read).length;

  const roles: Array<"Super Admin" | "Teacher" | "Editor" | "Reviewer" | "Student"> = [
    "Student", "Teacher", "Editor", "Reviewer", "Super Admin"
  ];

  const getRoleBadgeColor = (role: string) => {
    switch (role) {
      case "Super Admin": return "border-red-500/30 bg-red-950/40 text-red-400";
      case "Teacher": return "border-blue-500/30 bg-blue-950/40 text-blue-400";
      case "Editor": return "border-purple-500/30 bg-purple-950/40 text-purple-400";
      case "Reviewer": return "border-orange-500/30 bg-orange-950/40 text-orange-400";
      default: return "border-gold/30 bg-emerald-deep/20 text-gold-light";
    }
  };

  const navItems = [
    { id: "home", label: "Home", icon: Landmark },
    { id: "paths", label: "Learning Paths", icon: Compass },
    { id: "certificates", label: "Certificates", icon: Award },
    { id: "projects", label: "Projects", icon: Briefcase },
    { id: "insights", label: "Islamic Business Insights", icon: BookOpen },
    { id: "community", label: "Community", icon: Users },
    { id: "contact", label: "Contact", icon: Mail },
    { id: "profile", label: "My Profile", icon: User },
    // Only show CMS Portal to non-Students OR if admin is logged in
    { id: "admin", label: "CMS Portal", icon: Settings },
  ];

  const visibleNavItems = navItems.filter(item => {
    if (item.id === "admin") {
      return simulatedRole !== "Student" || isAdmin;
    }
    return true;
  });

  const handleNavClick = (tabId: string) => {
    setCurrentTab(tabId);
    setIsOpen(false);
    setShowNotifDropdown(false);
    setShowRoleDropdown(false);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  return (
    <nav className="sticky top-0 z-40 w-full border-b border-gold/15 bg-black/85 backdrop-blur-md">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="flex h-20 items-center justify-between">
          
          {/* Logo & Brand */}
          <button
            id="brand-logo-btn"
            onClick={() => handleNavClick("home")}
            className="flex items-center gap-3 group focus:outline-none text-left"
          >
            <LogoSVG className="h-12 w-12 transition-transform duration-500 group-hover:rotate-45" />
            <div>
              <span className="block font-serif text-lg font-bold tracking-wider text-white text-glow-gold group-hover:text-gold transition-colors">
                LEGACY OF AUF
              </span>
              <span className="block font-mono text-[10px] uppercase tracking-widest text-gold-light/75">
                ACADEMY
              </span>
            </div>
          </button>

          {/* Desktop Navigation */}
          <div className="hidden lg:flex lg:items-center lg:gap-1">
            {visibleNavItems.map((item) => {
              const Icon = item.icon;
              const isActive = currentTab === item.id;
              return (
                <button
                  id={`nav-link-${item.id}`}
                  key={item.id}
                  onClick={() => handleNavClick(item.id)}
                  className={`relative flex items-center gap-2 rounded-lg px-3 py-2 text-xs font-medium tracking-wide transition-all duration-300 focus:outline-none hover:bg-emerald-deep/20 hover:text-gold ${
                    isActive
                      ? "text-gold bg-emerald-deep/40 border border-gold/20 shadow-[0_0_15px_rgba(212,175,55,0.1)]"
                      : "text-neutral-300"
                  }`}
                >
                  <Icon className="h-4 w-4 stroke-[1.5]" />
                  <span>{item.label}</span>
                  {isActive && (
                    <span className="absolute bottom-0 left-1/2 h-[2px] w-8 -translate-x-1/2 rounded-full bg-gold animate-pulse" />
                  )}
                </button>
              );
            })}
          </div>

          {/* Action Center (Notifications & Role Switcher) */}
          <div className="hidden lg:flex lg:items-center lg:gap-3">
            {/* Notification Bell */}
            <div className="relative">
              <button
                id="notif-bell-btn"
                onClick={() => {
                  setShowNotifDropdown(!showNotifDropdown);
                  setShowRoleDropdown(false);
                }}
                className="relative rounded-full p-2 text-neutral-300 hover:bg-emerald-deep/20 hover:text-gold focus:outline-none transition-all border border-transparent hover:border-gold/20"
              >
                <Bell className="h-5 w-5 stroke-[1.5]" />
                {unreadCount > 0 && (
                  <span className="absolute right-1 top-1 flex h-4 w-4 items-center justify-center rounded-full bg-red-600 font-mono text-[9px] font-bold text-white ring-2 ring-black">
                    {unreadCount}
                  </span>
                )}
              </button>

              {showNotifDropdown && (
                <div className="absolute right-0 mt-3 w-80 rounded-xl border border-gold/15 bg-neutral-950 p-4 shadow-[0_10px_30px_rgba(0,0,0,0.8)] animate-fade-in z-50">
                  <div className="flex items-center justify-between border-b border-neutral-800 pb-2 mb-2">
                    <span className="font-serif text-sm font-bold text-white">Alert Logs</span>
                    {notifications.length > 0 && (
                      <button
                        onClick={clearAllNotifications}
                        className="flex items-center gap-1 font-mono text-[10px] uppercase tracking-wider text-red-400 hover:text-red-300 transition-colors"
                      >
                        <Trash2 className="h-3 w-3" /> Clear All
                      </button>
                    )}
                  </div>
                  <div className="max-h-60 overflow-y-auto space-y-2">
                    {notifications.length === 0 ? (
                      <div className="py-6 text-center text-xs text-neutral-500 font-sans">
                        No new updates. All clear.
                      </div>
                    ) : (
                      notifications.map((notif) => (
                        <div
                          key={notif.id}
                          onClick={() => markNotificationRead(notif.id)}
                          className={`cursor-pointer rounded-lg p-2.5 transition-all text-left ${
                            notif.read ? "bg-neutral-900/30 opacity-70" : "bg-neutral-900 border-l-2 border-gold"
                          }`}
                        >
                          <div className="flex items-start justify-between gap-1">
                            <span className={`block text-xs font-semibold ${notif.read ? "text-neutral-300" : "text-white"}`}>
                              {notif.title}
                            </span>
                            <span className="inline-block font-mono text-[8px] text-neutral-500 mt-0.5">
                              {new Date(notif.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                            </span>
                          </div>
                          <p className="text-[11px] text-neutral-400 mt-1 font-sans leading-relaxed">
                            {notif.message}
                          </p>
                        </div>
                      ))
                    )}
                  </div>
                </div>
              )}
            </div>

            {/* Role Switcher Selector */}
            <div className="relative">
              <button
                id="role-dropdown-btn"
                onClick={() => {
                  setShowRoleDropdown(!showRoleDropdown);
                  setShowNotifDropdown(false);
                  setShowLangDropdown(false);
                }}
                className={`flex items-center gap-2 rounded-full border px-3 py-1.5 text-xs font-medium tracking-wide focus:outline-none transition-all shadow-[0_0_10px_rgba(0,0,0,0.5)] ${getRoleBadgeColor(simulatedRole)}`}
              >
                <Shield className="h-3.5 w-3.5 stroke-[1.5]" />
                <span className="font-mono text-[10px] uppercase tracking-wider">{simulatedRole}</span>
              </button>

              {showRoleDropdown && (
                <div className="absolute right-0 mt-3 w-52 rounded-xl border border-gold/15 bg-neutral-950 p-2.5 shadow-[0_10px_30px_rgba(0,0,0,0.8)] animate-fade-in z-50">
                  <div className="border-b border-neutral-800 pb-2 mb-2 px-2 text-left">
                    <span className="font-serif text-[11px] font-bold tracking-wider text-neutral-400 uppercase">Simulate Persona</span>
                  </div>
                  <div className="space-y-1">
                    {roles.map((r) => (
                      <button
                        key={r}
                        onClick={() => {
                          setSimulatedRole(r);
                          setShowRoleDropdown(false);
                          addNotification("Persona Switched", `Simulating the workspace as a ${r}.`, "info");
                        }}
                        className={`flex w-full items-center gap-2 rounded-lg px-2.5 py-1.5 text-left text-xs transition-colors ${
                          simulatedRole === r 
                            ? "bg-emerald-deep/40 text-gold font-semibold border-l-2 border-gold pl-1.5" 
                            : "text-neutral-400 hover:bg-neutral-900 hover:text-white"
                        }`}
                      >
                        <Shield className="h-3 w-3 stroke-[1.5]" />
                        <span>{r}</span>
                      </button>
                    ))}
                  </div>
                </div>
              )}
            </div>

            {/* Language Selector Dropdown */}
            <div className="relative">
              <button
                id="lang-dropdown-btn"
                onClick={() => {
                  setShowLangDropdown(!showLangDropdown);
                  setShowNotifDropdown(false);
                  setShowRoleDropdown(false);
                }}
                className="flex items-center gap-1.5 rounded-full border border-gold/25 bg-emerald-deep/10 text-gold px-3 py-1.5 text-xs font-medium tracking-wide focus:outline-none transition-all shadow-[0_0_10px_rgba(0,0,0,0.5)] hover:bg-gold/10"
              >
                <Globe className="h-3.5 w-3.5 stroke-[1.5]" />
                <span className="font-mono text-[10px] uppercase tracking-wider">{currentLanguage}</span>
              </button>

              {showLangDropdown && (
                <div className="absolute right-0 mt-3 w-40 rounded-xl border border-gold/15 bg-neutral-950 p-2 shadow-[0_10px_30px_rgba(0,0,0,0.8)] animate-fade-in z-50 animate-duration-150">
                  <div className="border-b border-neutral-800 pb-1.5 mb-1.5 px-2 text-left">
                    <span className="font-serif text-[10px] font-bold tracking-wider text-neutral-400 uppercase">Language</span>
                  </div>
                  <div className="space-y-1">
                    {languages.map((l) => (
                      <button
                        key={l}
                        onClick={() => {
                          setLanguage(l);
                          setShowLangDropdown(false);
                          addNotification("Language Changed", `Platform layout calibrated to ${l}.`, "info");
                        }}
                        className={`flex w-full items-center gap-2 rounded-lg px-2 py-1 text-left text-xs transition-colors ${
                          currentLanguage === l 
                            ? "bg-gold/15 text-gold font-semibold border-l-2 border-gold pl-1.5" 
                            : "text-neutral-400 hover:bg-neutral-900 hover:text-white"
                        }`}
                      >
                        <span className="font-sans text-[11px]">{l}</span>
                        {l === "Arabic" && <span className="font-mono text-[8px] text-neutral-500">(RTL)</span>}
                      </button>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Mobile Actions & menu button */}
          <div className="flex lg:hidden items-center gap-3">
            {/* Mobile notification badge quick view */}
            <button
              id="mobile-notif-btn"
              onClick={() => {
                setCurrentTab("profile");
                addNotification("Notification Center", "Check your alerts on your student dashboard!", "info");
              }}
              className="relative rounded-full p-2 text-neutral-300"
            >
              <Bell className="h-5 w-5" />
              {unreadCount > 0 && (
                <span className="absolute right-1 top-1 flex h-4 w-4 items-center justify-center rounded-full bg-red-600 font-mono text-[9px] text-white">
                  {unreadCount}
                </span>
              )}
            </button>

            {/* Simulated role mobile quick-toggle */}
            <button
              id="mobile-role-toggle"
              onClick={() => {
                const nextIndex = (roles.indexOf(simulatedRole) + 1) % roles.length;
                const nextRole = roles[nextIndex];
                setSimulatedRole(nextRole);
                addNotification("Persona Quick-Switched", `Simulating as ${nextRole}.`, "info");
              }}
              className={`rounded-full border px-2.5 py-1 font-mono text-[9px] font-bold uppercase ${getRoleBadgeColor(simulatedRole)}`}
            >
              {simulatedRole}
            </button>

            <button
              id="mobile-menu-toggle"
              onClick={() => setIsOpen(!isOpen)}
              className="inline-flex items-center justify-center rounded-md p-2 text-gold hover:bg-emerald-deep/20 hover:text-gold-light focus:outline-none"
              aria-expanded={isOpen}
            >
              {isOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
            </button>
          </div>

        </div>
      </div>

      {/* Mobile Drawer */}
      {isOpen && (
        <div className="lg:hidden border-t border-gold/15 bg-black/95 animate-fade-in">
          <div className="space-y-1 px-2 pb-5 pt-3">
            {visibleNavItems.map((item) => {
              const Icon = item.icon;
              const isActive = currentTab === item.id;
              return (
                <button
                  id={`mobile-nav-link-${item.id}`}
                  key={item.id}
                  onClick={() => handleNavClick(item.id)}
                  className={`flex w-full items-center gap-3 rounded-lg px-4 py-3 text-sm font-medium tracking-wide transition-all ${
                    isActive
                      ? "bg-emerald-deep/40 text-gold border-l-4 border-gold pl-3"
                      : "text-neutral-300 hover:bg-neutral-900 hover:text-gold"
                  }`}
                >
                  <Icon className="h-5 w-5" />
                  <span>{item.label}</span>
                </button>
              );
            })}
          </div>
        </div>
      )}
    </nav>
  );
}
