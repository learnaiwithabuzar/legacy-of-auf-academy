import React, { useState, useEffect } from "react";
import { Shield, Key, Smartphone, AlertTriangle, Monitor, Clock, Activity, Check, RefreshCw, Lock, Trash2, ShieldAlert } from "lucide-react";

interface LoginLog {
  id: string;
  timestamp: string;
  ip: string;
  location: string;
  device: string;
  method: string;
  status: "Success" | "Blocked" | "Suspicious";
}

interface AdminLog {
  id: string;
  timestamp: string;
  actor: string;
  role: string;
  action: string;
  target: string;
  ip: string;
}

export default function EnterpriseSecurity() {
  // 1. Password Strength State
  const [password, setPassword] = useState("");
  const [passFeedback, setPassFeedback] = useState({ score: 0, label: "Empty", color: "bg-neutral-800", text: "Please enter a password" });

  // 2. 2FA Simulation State
  const [twoFactorEnabled, setTwoFactorEnabled] = useState(false);
  const [twoFactorStep, setTwoFactorStep] = useState<"disabled" | "setup" | "verified">("disabled");
  const [verificationCode, setVerificationCode] = useState("");
  const [twoFactorError, setTwoFactorError] = useState("");

  // 3. Rate Limit Simulation
  const [requestCount, setRequestCount] = useState(0);
  const [rateLimitBlocked, setRateLimitBlocked] = useState(false);
  const [cooldownTime, setCooldownTime] = useState(0);

  // 4. Session & Device Management
  const [sessions, setSessions] = useState([
    { id: "sess-1", device: "Chrome / Linux (This Container DevServer)", ip: "172.18.0.1", location: "Mountain View, CA, USA", active: true, loginTime: "Just Now" },
    { id: "sess-2", device: "Safari / iOS 17.5", ip: "85.204.12.98", location: "Paris, France", active: false, loginTime: "2 hours ago" },
    { id: "sess-3", device: "Firefox / macOS Sequoia", ip: "216.58.210.164", location: "London, United Kingdom", active: false, loginTime: "3 days ago" }
  ]);

  // 5. Login History
  const [loginHistory, setLoginHistory] = useState<LoginLog[]>([
    { id: "log-1", timestamp: "2026-07-09 00:10:15", ip: "172.18.0.1", location: "Mountain View, CA", device: "Chrome / Linux", method: "Google SSO", status: "Success" },
    { id: "log-2", timestamp: "2026-07-08 22:45:12", ip: "85.204.12.98", location: "Paris, France", device: "Safari / iOS", method: "Email/Password", status: "Success" },
    { id: "log-3", timestamp: "2026-07-05 14:20:00", ip: "192.168.1.45", location: "Local Network", device: "Chrome / Windows", method: "Email/Password", status: "Success" },
    { id: "log-4", timestamp: "2026-07-04 03:12:44", ip: "103.44.112.5", location: "Moscow, Russia", device: "Edge / Windows", method: "Brute-force Attempt", status: "Blocked" }
  ]);

  // 6. Suspicious Login Alerts
  const [alerts, setAlerts] = useState<string[]>([
    "WARNING: Unverified device login attempt from Moscow, Russia was blocked automatically on 2026-07-04.",
    "ALERT: Multi-factor authentication recommended. 3 different IP subnets accessed this account this week."
  ]);

  // 7. Faculty / Admin Activity Logs
  const [adminLogs, setAdminLogs] = useState<AdminLog[]>([
    { id: "adm-1", timestamp: "2026-07-09 00:05:22", actor: "Abdur Rahman (Dean)", role: "Super Admin", action: "Approved Certificate", target: "LOA-FEQH-99A1", ip: "172.18.0.1" },
    { id: "adm-2", timestamp: "2026-07-08 18:30:11", actor: "Professor Ali", role: "Teacher", action: "Graded Homework A", target: "Student ID #0814c", ip: "85.204.12.98" },
    { id: "adm-3", timestamp: "2026-07-07 10:14:55", actor: "Zayd Revisor", role: "Editor", action: "Updated Topic Syllabus", target: "Ethical AI Scaling", ip: "192.168.1.10" }
  ]);

  // Password checker
  useEffect(() => {
    if (!password) {
      setPassFeedback({ score: 0, label: "Empty", color: "bg-neutral-800", text: "Please enter a password" });
      return;
    }
    let score = 0;
    if (password.length >= 8) score += 1;
    if (/[A-Z]/.test(password)) score += 1;
    if (/[a-z]/.test(password)) score += 1;
    if (/[0-9]/.test(password)) score += 1;
    if (/[^A-Za-z0-9]/.test(password)) score += 1;

    let label = "Very Weak";
    let color = "bg-red-500";
    let text = "Password should contain numbers, symbols, uppercase and lowercase letters (min 8 chars).";

    if (score === 5) {
      label = "Fortress Level";
      color = "bg-emerald-500";
      text = "Highly secure cryptographic secret! Protected against standard hash-cracking dictionary tables.";
    } else if (score >= 3) {
      label = "Moderate Security";
      color = "bg-amber-500";
      text = "Meets basic enterprise standards. Add a special symbol or digit for extra safety.";
    }

    setPassFeedback({ score, label, color, text });
  }, [password]);

  // Cooldown effect for rate limiter
  useEffect(() => {
    if (cooldownTime > 0) {
      const timer = setTimeout(() => {
        setCooldownTime(prev => {
          if (prev <= 1) {
            setRateLimitBlocked(false);
            setRequestCount(0);
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
      return () => clearTimeout(timer);
    }
  }, [cooldownTime]);

  // Trigger simulated request
  const handleTriggerSimulatedRequest = () => {
    if (rateLimitBlocked) return;

    setRequestCount(prev => {
      const next = prev + 1;
      if (next >= 12) {
        setRateLimitBlocked(true);
        setCooldownTime(15);
        setAlerts(prevAlerts => [
          `RATE LIMIT ALERT: Excessive requests (12 reqs/sec) detected from your IP. Temporary lock initiated for 15s.`,
          ...prevAlerts
        ]);
        return next;
      }
      return next;
    });
  };

  // Revoke session
  const handleRevokeSession = (id: string) => {
    setSessions(prev => prev.filter(s => s.id !== id));
    setLoginHistory(prev => [
      {
        id: `log-${Date.now()}`,
        timestamp: new Date().toISOString().replace('T', ' ').substring(0, 19),
        ip: "N/A",
        location: "System Action",
        device: "Revoked Remote Session",
        method: "Faculty Override",
        status: "Success"
      },
      ...prev
    ]);
  };

  // 2FA TOTP verification
  const handleVerify2FA = () => {
    if (verificationCode === "123456" || verificationCode === "786786") {
      setTwoFactorEnabled(true);
      setTwoFactorStep("verified");
      setTwoFactorError("");
      setAlerts(prev => [
        "SECURITY LOG: Two-Factor Authentication successfully activated. Backup codes compiled.",
        ...prev
      ]);
    } else {
      setTwoFactorError("Invalid cryptographic PIN. Use test key '786786' or '123456'.");
    }
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "Success": return "bg-emerald-950 text-emerald-400 border border-emerald-500/20";
      case "Blocked": return "bg-red-950 text-red-400 border border-red-500/20";
      default: return "bg-amber-950 text-amber-400 border border-amber-500/20";
    }
  };

  return (
    <div id="enterprise-security-panel" className="space-y-6">
      
      {/* Rate limit status alert */}
      {rateLimitBlocked && (
        <div className="p-4 rounded-xl border border-red-500/30 bg-red-950/20 text-red-400 flex items-center gap-3 animate-pulse">
          <ShieldAlert className="h-5 w-5 text-red-400 shrink-0" />
          <div className="text-left">
            <h4 className="font-bold font-serif text-sm">WAF Rate-Limiter Engaged!</h4>
            <p className="text-xs font-sans text-neutral-300">
              Your IP has been restricted temporarily due to simulated endpoint flooding. Cooldown remaining: <strong className="font-mono text-red-400">{cooldownTime}s</strong>.
            </p>
          </div>
        </div>
      )}

      {/* Grid of basic settings */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">

        {/* Password Strength & Entropy Gauge */}
        <div className="rounded-xl border border-gold/15 bg-neutral-950/80 p-5 shadow-md text-left space-y-4">
          <h3 className="font-serif text-sm font-bold text-white flex items-center gap-2 border-b border-gold/10 pb-3">
            <Key className="h-4.5 w-4.5 text-gold" />
            <span>Entropy & Password Strength Checker</span>
          </h3>
          
          <div className="space-y-2">
            <label className="block font-mono text-[9px] uppercase tracking-widest text-neutral-400">Evaluate Secret Key Strength</label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Type or generate a strong password..."
              className="w-full rounded bg-black border border-gold/25 px-3.5 py-2 font-mono text-xs text-white focus:border-gold focus:outline-none"
            />
          </div>

          {/* Feedback bar */}
          {password && (
            <div className="space-y-2 animate-fade-in">
              <div className="flex items-center justify-between text-xs font-mono">
                <span className="text-neutral-400">Complexity: <strong className="text-white">{passFeedback.label}</strong></span>
                <span className="text-gold font-bold">{passFeedback.score * 20}% Score</span>
              </div>
              
              <div className="h-2 w-full bg-neutral-900 rounded-full overflow-hidden flex gap-0.5">
                {[1, 2, 3, 4, 5].map((s) => (
                  <div
                    key={s}
                    className={`h-full flex-1 transition-all duration-300 ${
                      s <= passFeedback.score ? passFeedback.color : "bg-neutral-800"
                    }`}
                  />
                ))}
              </div>
              <p className="font-sans text-[10.5px] text-neutral-400 leading-relaxed italic">
                "{passFeedback.text}"
              </p>
            </div>
          )}
        </div>

        {/* Two-Factor Authentication Simulator */}
        <div className="rounded-xl border border-gold/15 bg-neutral-950/80 p-5 shadow-md text-left space-y-4">
          <h3 className="font-serif text-sm font-bold text-white flex items-center gap-2 border-b border-gold/10 pb-3">
            <Smartphone className="h-4.5 w-4.5 text-gold" />
            <span>Shariah Trust Multi-Factor Auth (2FA)</span>
          </h3>

          {twoFactorStep === "disabled" && (
            <div className="space-y-3">
              <p className="font-sans text-[11px] text-neutral-400 leading-relaxed">
                Add an extra layer of protection. When signing in, you will be prompted for a secure 6-digit verification code sent to your authenticated device.
              </p>
              <button
                onClick={() => setTwoFactorStep("setup")}
                className="w-full py-2 rounded bg-gold text-black font-mono text-xs font-bold uppercase hover:bg-gold-light transition-all cursor-pointer"
              >
                Configure Authenticator App
              </button>
            </div>
          )}

          {twoFactorStep === "setup" && (
            <div className="space-y-4 animate-fade-in">
              <div className="flex gap-4 items-center">
                {/* Simulated QR Code */}
                <div className="h-20 w-20 bg-white p-1 rounded shrink-0 border border-gold/45 shadow-md flex flex-wrap">
                  {[...Array(400)].map((_, i) => (
                    <div
                      key={i}
                      className={`h-1 w-1 ${
                        (i * 3 + 7) % 11 === 0 || (i % 7 === 0 && i % 3 === 0) ? "bg-black" : "bg-white"
                      }`}
                    />
                  ))}
                </div>
                <div className="space-y-1">
                  <span className="font-mono text-[9px] uppercase tracking-widest text-gold font-bold">1. SCAN CRYPTO EMBED</span>
                  <p className="font-sans text-[10px] text-neutral-400">Scan this QR in Google Authenticator or Microsoft Auth.</p>
                  <p className="font-mono text-[8px] text-neutral-500 uppercase tracking-wider">Secret: LOAA-MFA-SALT-786-TRUST</p>
                </div>
              </div>

              <div className="space-y-2">
                <label className="block font-mono text-[9px] uppercase tracking-widest text-neutral-400">2. ENTER 6-DIGIT TOTP PIN (Use '786786')</label>
                <div className="flex gap-2">
                  <input
                    type="text"
                    maxLength={6}
                    value={verificationCode}
                    onChange={(e) => setVerificationCode(e.target.value)}
                    placeholder="786786"
                    className="flex-1 rounded bg-black border border-gold/25 px-3 py-1.5 font-mono text-xs text-white text-center tracking-widest focus:border-gold focus:outline-none"
                  />
                  <button
                    onClick={handleVerify2FA}
                    className="px-4 rounded bg-emerald-600 text-white font-mono text-xs font-bold uppercase hover:bg-emerald-500 transition-all cursor-pointer"
                  >
                    Verify
                  </button>
                </div>
                {twoFactorError && <p className="text-[10px] text-red-400 font-sans">{twoFactorError}</p>}
              </div>
            </div>
          )}

          {twoFactorStep === "verified" && (
            <div className="border border-emerald-500/20 bg-emerald-950/10 p-4 rounded-xl space-y-2 animate-fade-in text-emerald-400">
              <div className="flex items-center gap-2 font-serif text-xs font-bold">
                <Check className="h-4 w-4" />
                <span>Enterprise 2FA Protection Live</span>
              </div>
              <p className="font-sans text-[11px] text-neutral-300 leading-relaxed">
                Cryptographic device verification is fully locked to your student profile ID. Backup code: <strong className="font-mono text-white">AUF-SEC-991A-44B2</strong>.
              </p>
              <button
                onClick={() => {
                  setTwoFactorStep("disabled");
                  setTwoFactorEnabled(false);
                  setVerificationCode("");
                }}
                className="font-mono text-[8px] text-red-400 hover:underline uppercase"
              >
                Disable 2FA Protection
              </button>
            </div>
          )}
        </div>

      </div>

      {/* Device & Session Management & Rate limiter simulator */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">

        {/* Active Sessions Device Manager (8 cols) */}
        <div className="lg:col-span-8 rounded-xl border border-gold/15 bg-neutral-950/80 p-5 shadow-md text-left space-y-4">
          <div className="flex items-center justify-between border-b border-gold/10 pb-3">
            <h3 className="font-serif text-sm font-bold text-white flex items-center gap-2">
              <Monitor className="h-4.5 w-4.5 text-gold" />
              <span>Cryptographic Session & Device Manager</span>
            </h3>
            <span className="font-mono text-[9px] uppercase tracking-wider text-emerald-400 bg-emerald-950/40 border border-emerald-500/20 px-2 py-0.5 rounded">
              {sessions.length} Devices Registered
            </span>
          </div>

          <div className="space-y-3">
            {sessions.map((sess) => (
              <div key={sess.id} className="p-3.5 rounded-lg border border-neutral-900 bg-neutral-950 flex justify-between items-center text-xs">
                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    <span className="font-sans font-bold text-white">{sess.device}</span>
                    {sess.active && (
                      <span className="h-2 w-2 rounded-full bg-emerald-400 animate-ping" title="This device" />
                    )}
                  </div>
                  <div className="flex flex-wrap gap-x-4 gap-y-1 font-mono text-[10px] text-neutral-400">
                    <span>IP: {sess.ip}</span>
                    <span>Loc: {sess.location}</span>
                    <span>Joined: {sess.loginTime}</span>
                  </div>
                </div>

                {!sess.active && (
                  <button
                    onClick={() => handleRevokeSession(sess.id)}
                    className="font-mono text-[9px] text-red-400 border border-red-500/20 px-2.5 py-1.5 rounded hover:bg-red-950/20 uppercase transition-all cursor-pointer"
                  >
                    Revoke Token
                  </button>
                )}
              </div>
            ))}
          </div>
        </div>

        {/* Live WAF Rate-Limit Simulator (4 cols) */}
        <div className="lg:col-span-4 rounded-xl border border-gold/15 bg-neutral-950/80 p-5 shadow-md text-left space-y-4 flex flex-col justify-between">
          <div className="space-y-3">
            <h3 className="font-serif text-sm font-bold text-white flex items-center gap-2 border-b border-gold/10 pb-3">
              <Activity className="h-4.5 w-4.5 text-gold" />
              <span>API Rate Limiter Check</span>
            </h3>
            <p className="font-sans text-[10.5px] text-neutral-400 leading-relaxed">
              Our Web Application Firewall (WAF) enforces a strict threshold of 12 requests per second. Flooding is blocked instantly.
            </p>

            <div className="space-y-1 font-mono text-[11px]">
              <div className="flex justify-between">
                <span className="text-neutral-500">REQUEST RATE:</span>
                <span className={requestCount >= 10 ? "text-red-400 font-bold" : "text-gold"}>{requestCount} / 12 req/sec</span>
              </div>
              <div className="h-2 w-full bg-neutral-900 rounded-full overflow-hidden">
                <div
                  className={`h-full transition-all duration-150 ${requestCount >= 10 ? "bg-red-500" : "bg-gold"}`}
                  style={{ width: `${Math.min((requestCount / 12) * 100, 100)}%` }}
                />
              </div>
            </div>
          </div>

          <button
            disabled={rateLimitBlocked}
            onClick={handleTriggerSimulatedRequest}
            className="w-full mt-4 py-2 rounded border border-gold/30 hover:bg-gold hover:text-black font-mono text-[10px] font-bold uppercase transition-all flex items-center justify-center gap-2 cursor-pointer disabled:opacity-40"
          >
            <RefreshCw className="h-3.5 w-3.5 animate-spin-slow" />
            <span>Simulate API Trigger</span>
          </button>
        </div>

      </div>

      {/* Alerts Logs & Faculty Audit Tracker */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">

        {/* Suspicious Alerts Logger */}
        <div className="rounded-xl border border-gold/15 bg-neutral-950/80 p-5 shadow-md text-left space-y-4">
          <h3 className="font-serif text-sm font-bold text-white flex items-center gap-2 border-b border-gold/10 pb-3">
            <AlertTriangle className="h-4.5 w-4.5 text-red-400" />
            <span>WAF Suspicious Activity alerts</span>
          </h3>

          <div className="space-y-3 max-h-56 overflow-y-auto">
            {alerts.map((al, idx) => (
              <div key={idx} className="p-3 rounded bg-red-950/10 border border-red-500/20 text-[10.5px] text-red-300 font-sans leading-relaxed">
                {al}
              </div>
            ))}
          </div>
        </div>

        {/* Admin/Faculty Activity Logs */}
        <div className="rounded-xl border border-gold/15 bg-neutral-950/80 p-5 shadow-md text-left space-y-4">
          <h3 className="font-serif text-sm font-bold text-white flex items-center gap-2 border-b border-gold/10 pb-3">
            <Shield className="h-4.5 w-4.5 text-emerald-400" />
            <span>Core Faculty & Admin Activity Logs</span>
          </h3>

          <div className="space-y-2.5 max-h-56 overflow-y-auto">
            {adminLogs.map((lg) => (
              <div key={lg.id} className="p-3 rounded border border-neutral-900 bg-neutral-950 flex flex-col gap-1 text-[11px]">
                <div className="flex justify-between items-center">
                  <span className="font-bold text-white">{lg.actor} <span className="text-neutral-500 font-normal">({lg.role})</span></span>
                  <span className="font-mono text-[8px] text-neutral-500">{lg.timestamp}</span>
                </div>
                <div className="flex justify-between font-mono text-[9px] text-neutral-400">
                  <span>Action: <strong className="text-gold">{lg.action}</strong> (<em>{lg.target}</em>)</span>
                  <span>IP: {lg.ip}</span>
                </div>
              </div>
            ))}
          </div>
        </div>

      </div>

    </div>
  );
}
