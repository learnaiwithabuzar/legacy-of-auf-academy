import React, { useState } from "react";
import { Award, ShieldCheck, QrCode, Search, Share2, Printer, CheckCircle, XCircle, AlertTriangle, RefreshCw } from "lucide-react";
import { useCMS } from "../store/cmsStore";

interface VerificationLog {
  id: string;
  timestamp: string;
  ip: string;
  location: string;
  viewer: string;
}

export default function CertificateVerifier() {
  const { certificates, simulatedRole, updateCertificateStatus, addNotification } = useCMS();
  const [searchId, setSearchId] = useState("");
  const [queriedCert, setQueriedCert] = useState<any>(null);
  const [hasSearched, setHasSearched] = useState(false);
  const [queryError, setQueryError] = useState("");

  // Verification history log state
  const [historyLogs, setHistoryLogs] = useState<Record<string, VerificationLog[]>>({
    "LOA-MUD-331B": [
      { id: "v-1", timestamp: "2026-07-09 10:14:22", ip: "198.14.3.44", location: "Riyadh, Saudi Arabia", viewer: "Halal Trust Fund VC" },
      { id: "v-2", timestamp: "2026-07-08 14:02:51", ip: "122.144.33.22", location: "Singapore", viewer: "Sovereign Shariah Board" }
    ],
    "LOA-FEQH-99A1": [
      { id: "v-3", timestamp: "2026-07-09 11:15:00", ip: "103.22.4.9", location: "Kuala Lumpur, Malaysia", viewer: "Islamic Fintech Hub recruiter" }
    ]
  });

  // Sample certificates database
  const sampleCerts = [
    {
      id: "LOA-FEQH-99A1",
      studentName: "Abdur Rahman",
      courseName: "Feqh of Islamic Commerce & Amanah Contracts",
      issueDate: "2026-06-15",
      score: "94%",
      validator: "Mufti Zayd Malik (Principal Shariah Assessor)",
      status: "Active Verified"
    },
    {
      id: "LOA-MUD-331B",
      studentName: "Fatimah Al-Fihri",
      courseName: "Mudarabah SaaS Capitalization Structures",
      issueDate: "2026-07-01",
      score: "88%",
      validator: "Dean of Auf (Academic Board)",
      status: "Active Verified"
    }
  ];

  // Search execution
  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    setHasSearched(true);
    setQueryError("");

    const term = searchId.trim().toUpperCase();
    if (!term) return;

    // Search existing certificates in cmsStore
    const foundInStore = certificates.find(c => c.id.toUpperCase() === term);
    
    // Fallback to sample static certificates for demo
    const foundInSample = sampleCerts.find(c => c.id.toUpperCase() === term);

    if (foundInStore) {
      setQueriedCert({
        id: foundInStore.id,
        studentName: foundInStore.studentName,
        courseName: foundInStore.courseName,
        issueDate: foundInStore.issueDate,
        score: foundInStore.score || "Passed",
        validator: foundInStore.validator || "Legacy of Auf Board",
        status: foundInStore.status || "Active Verified"
      });
      logVerification(foundInStore.id);
    } else if (foundInSample) {
      setQueriedCert(foundInSample);
      logVerification(foundInSample.id);
    } else {
      setQueriedCert(null);
      setQueryError("No verified certificate found with this credential ID in Shariah Ledger.");
    }
  };

  // Add dummy log when someone queries a certificate
  const logVerification = (certId: string) => {
    const locations = ["Dubai, UAE", "Jakarta, Indonesia", "Chicago, USA", "Manama, Bahrain", "Karachi, Pakistan"];
    const entities = ["Venture Waqf Firm", "Shariah Compliance Committee", "Freelance Client", "Corporate Recruiter", "Public Employer"];
    
    const newLog: VerificationLog = {
      id: `v-${Date.now()}`,
      timestamp: new Date().toISOString().replace('T', ' ').substring(0, 19),
      ip: `197.45.${Math.floor(Math.random() * 255)}.${Math.floor(Math.random() * 255)}`,
      location: locations[Math.floor(Math.random() * locations.length)],
      viewer: entities[Math.floor(Math.random() * entities.length)]
    };

    setHistoryLogs(prev => ({
      ...prev,
      [certId]: [newLog, ...(prev[certId] || [])]
    }));
  };

  // Revoke/Reinstate (Admin simulation)
  const handleToggleStatus = (certId: string, currentStatus: string) => {
    const newStatus = currentStatus === "Revoked" ? "Active Verified" : "Revoked";
    
    // If in cmsStore, update it
    const inStoreIndex = certificates.findIndex(c => c.id === certId);
    if (inStoreIndex !== -1) {
      updateCertificateStatus(certId, newStatus);
    }

    // Update in display state
    setQueriedCert((prev: any) => ({ ...prev, status: newStatus }));
    
    addNotification(
      "Certificate Status Revocation Changed",
      `Certificate ID ${certId} is now set to ${newStatus}.`,
      newStatus === "Revoked" ? "alert" : "success"
    );
  };

  // Print function
  const handlePrint = () => {
    window.print();
  };

  // Generate LinkedIn Share Link
  const handleLinkedInShare = (cert: any) => {
    const text = encodeURIComponent(
      `I am honored to announce that I have successfully graduated with a ${cert.score} from the Legacy of Auf Academy's Shariah Commerce Program! Verify my credentials at ID: ${cert.id}. ✦ Halal Entrepreneurship ✦`
    );
    const url = `https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(window.location.href)}&text=${text}`;
    window.open(url, "_blank");
  };

  return (
    <div id="cert-verifier-system" className="space-y-6">
      
      {/* 1. Introductory Card */}
      <div className="rounded-xl border border-gold/15 bg-neutral-950/80 p-5 shadow-md text-left space-y-2">
        <h3 className="font-serif text-base font-bold text-white flex items-center gap-2">
          <Award className="h-5 w-5 text-gold" />
          <span>Shariah Trust Certificate Verification Registry</span>
        </h3>
        <p className="font-sans text-xs text-neutral-400 leading-relaxed">
          Employers, Shariah audit committees, and waqf investment managers can instantly verify student achievements here. Every certificate carries a globally unique hash representing genuine lesson completions, quiz compliance, and assignment submissions.
        </p>
      </div>

      {/* 2. Verification Form */}
      <div className="rounded-xl border border-gold/15 bg-neutral-950/80 p-5 shadow-md">
        <form onSubmit={handleSearch} className="space-y-3 text-left">
          <label className="block font-mono text-[9px] uppercase tracking-widest text-neutral-400">Search Certificate ID Hash</label>
          <div className="flex gap-2">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-2.5 h-4.5 w-4.5 text-neutral-500" />
              <input
                type="text"
                placeholder="E.g. LOA-FEQH-99A1, LOA-MUD-331B"
                value={searchId}
                onChange={(e) => setSearchId(e.target.value)}
                className="w-full rounded bg-black border border-gold/25 pl-10 pr-4 py-2 font-mono text-xs text-white focus:border-gold focus:outline-none"
              />
            </div>
            <button
              type="submit"
              className="px-5 rounded bg-gold text-black font-mono text-xs font-bold uppercase hover:bg-gold-light transition-all flex items-center gap-1.5 cursor-pointer"
            >
              <Search className="h-4 w-4" />
              <span>Verify</span>
            </button>
          </div>

          <div className="pt-1 flex flex-wrap gap-2 items-center">
            <span className="font-mono text-[8px] uppercase tracking-wider text-neutral-500">Quick Test Keys:</span>
            {sampleCerts.map(sc => (
              <button
                key={sc.id}
                type="button"
                onClick={() => {
                  setSearchId(sc.id);
                  setQueriedCert(sc);
                  setHasSearched(true);
                  logVerification(sc.id);
                  setQueryError("");
                }}
                className="text-[9px] font-mono text-gold hover:underline bg-gold/5 border border-gold/15 px-1.5 py-0.5 rounded"
              >
                {sc.id}
              </button>
            ))}
          </div>
        </form>
      </div>

      {/* 3. Query Results */}
      {hasSearched && (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 animate-fade-in text-left">
          
          {queriedCert ? (
            <>
              {/* Certificate Verification Sheet (7 cols) */}
              <div className="lg:col-span-7 rounded-xl border border-gold/30 bg-neutral-950/90 p-6 shadow-xl shadow-gold/5 flex flex-col justify-between relative overflow-hidden">
                <div className="absolute top-0 right-0 h-40 w-40 bg-emerald-accent/5 rounded-full blur-2xl pointer-events-none" />
                
                <div className="space-y-6">
                  {/* Status header */}
                  <div className="flex justify-between items-start gap-4">
                    <div className="space-y-1">
                      <span className="font-mono text-[9px] uppercase tracking-widest text-gold font-bold">SHARIAH LEDGER NODE APPROVED</span>
                      <h4 className="font-serif text-lg font-bold text-white tracking-wide">{queriedCert.courseName}</h4>
                    </div>
                    
                    <span className={`px-2.5 py-1 rounded text-[10px] font-mono uppercase font-bold flex items-center gap-1 shrink-0 ${
                      queriedCert.status === "Revoked"
                        ? "bg-red-950 text-red-400 border border-red-500/20"
                        : "bg-emerald-950 text-emerald-400 border border-emerald-500/20"
                    }`}>
                      {queriedCert.status === "Revoked" ? (
                        <>
                          <XCircle className="h-3.5 w-3.5" />
                          <span>REVOKED</span>
                        </>
                      ) : (
                        <>
                          <CheckCircle className="h-3.5 w-3.5" />
                          <span>VERIFIED</span>
                        </>
                      )}
                    </span>
                  </div>

                  {/* Metadata Matrix */}
                  <div className="grid grid-cols-2 gap-4 border-y border-neutral-900 py-4 font-sans text-xs">
                    <div className="space-y-1">
                      <span className="block font-mono text-[8px] uppercase tracking-widest text-neutral-500">GRADUATE</span>
                      <strong className="text-white font-serif">{queriedCert.studentName}</strong>
                    </div>
                    <div className="space-y-1">
                      <span className="block font-mono text-[8px] uppercase tracking-widest text-neutral-500">CREDENTIAL ID</span>
                      <strong className="text-gold font-mono">{queriedCert.id}</strong>
                    </div>
                    <div className="space-y-1">
                      <span className="block font-mono text-[8px] uppercase tracking-widest text-neutral-500">DATE OF ISSUANCE</span>
                      <strong className="text-neutral-300">{queriedCert.issueDate}</strong>
                    </div>
                    <div className="space-y-1">
                      <span className="block font-mono text-[8px] uppercase tracking-widest text-neutral-500">FINAL EVALUATION GRADE</span>
                      <strong className="text-white">{queriedCert.score}</strong>
                    </div>
                  </div>

                  <div className="space-y-1">
                    <span className="block font-mono text-[8px] uppercase tracking-widest text-neutral-500">AUTHORIZED PRINCIPAL SIGNATORY</span>
                    <p className="text-xs text-neutral-300 flex items-center gap-1 font-serif italic">
                      <ShieldCheck className="h-4 w-4 text-gold shrink-0" />
                      <span>{queriedCert.validator}</span>
                    </p>
                  </div>
                </div>

                {/* Sharing and printing anchors */}
                <div className="mt-6 pt-4 border-t border-neutral-900 flex flex-wrap gap-2">
                  <button
                    onClick={() => handleLinkedInShare(queriedCert)}
                    className="flex-1 py-2 rounded bg-neutral-900 border border-gold/15 hover:border-gold text-white font-mono text-[10px] font-bold uppercase transition-all flex items-center justify-center gap-1.5 cursor-pointer"
                  >
                    <Share2 className="h-3.5 w-3.5 text-gold" />
                    <span>LinkedIn Share</span>
                  </button>
                  <button
                    onClick={handlePrint}
                    className="flex-1 py-2 rounded bg-neutral-900 border border-neutral-800 hover:border-neutral-700 text-white font-mono text-[10px] font-bold uppercase transition-all flex items-center justify-center gap-1.5 cursor-pointer"
                  >
                    <Printer className="h-3.5 w-3.5" />
                    <span>Download PDF / Print</span>
                  </button>
                </div>

                {/* Revoke Simulation (Faculty / Admins only) */}
                {["Super Admin", "Teacher"].includes(simulatedRole) && (
                  <div className="mt-4 p-3 rounded bg-red-950/10 border border-red-500/20 text-xs">
                    <div className="flex justify-between items-center gap-2">
                      <div className="space-y-0.5">
                        <span className="block font-mono text-[8px] uppercase font-bold text-red-400">ADMIN CONTROL PANEL</span>
                        <p className="text-[10px] text-neutral-400">Toggle revocation for auditing purposes.</p>
                      </div>
                      <button
                        onClick={() => handleToggleStatus(queriedCert.id, queriedCert.status)}
                        className={`font-mono text-[9px] px-3 py-1.5 rounded uppercase font-bold transition-all cursor-pointer ${
                          queriedCert.status === "Revoked"
                            ? "bg-emerald-600 text-white hover:bg-emerald-500"
                            : "bg-red-700 text-white hover:bg-red-600"
                        }`}
                      >
                        {queriedCert.status === "Revoked" ? "Reinstate" : "Revoke Cert"}
                      </button>
                    </div>
                  </div>
                )}
              </div>

              {/* Verification Audit Logs & QR (5 cols) */}
              <div className="lg:col-span-5 space-y-6">
                
                {/* Simulated QR Code Verification Card */}
                <div className="rounded-xl border border-gold/15 bg-neutral-950/80 p-5 shadow-md flex items-center gap-4">
                  <div className="h-20 w-20 bg-white p-1 rounded shrink-0 border border-gold/40 flex items-center justify-center">
                    <QrCode className="h-16 w-16 text-black" />
                  </div>
                  <div className="space-y-1 text-left">
                    <span className="font-mono text-[8px] uppercase tracking-widest text-gold font-bold">SECURE QR CODE</span>
                    <h5 className="font-serif text-xs font-bold text-white">Trust QR Validator</h5>
                    <p className="font-sans text-[10px] text-neutral-400 leading-relaxed">
                      Embed this code on your physical resume or portfolio. Scanning redirects to this live validation panel.
                    </p>
                  </div>
                </div>

                {/* Verification History Logs */}
                <div className="rounded-xl border border-gold/15 bg-neutral-950/80 p-5 shadow-md space-y-3">
                  <h4 className="font-serif text-xs font-bold text-white flex items-center gap-1.5 border-b border-neutral-900 pb-2">
                    <RefreshCw className="h-3.5 w-3.5 text-gold animate-spin-slow" />
                    <span>Verification Query History logs</span>
                  </h4>

                  <div className="space-y-2.5 max-h-48 overflow-y-auto">
                    {(historyLogs[queriedCert.id] || []).length === 0 ? (
                      <p className="text-[10px] text-neutral-500 font-sans italic py-4">No validation queries logged yet for this credential.</p>
                    ) : (
                      (historyLogs[queriedCert.id] || []).map((l) => (
                        <div key={l.id} className="p-2 border border-neutral-900 rounded bg-black/40 text-[10.5px]">
                          <div className="flex justify-between font-mono text-[8px] text-neutral-500">
                            <span>{l.timestamp}</span>
                            <span>IP: {l.ip}</span>
                          </div>
                          <p className="text-neutral-300 font-sans mt-0.5">
                            Verified by: <strong className="text-white">{l.viewer}</strong> ({l.location})
                          </p>
                        </div>
                      ))
                    )}
                  </div>
                </div>

              </div>
            </>
          ) : (
            <div className="lg:col-span-12 p-12 text-center border border-dashed border-red-500/10 bg-red-950/5 text-red-400 rounded-xl space-y-2">
              <AlertTriangle className="h-10 w-10 mx-auto text-red-500" />
              <h4 className="font-serif font-bold text-base">Unverified Credential ID</h4>
              <p className="font-sans text-xs text-neutral-400 max-w-md mx-auto">
                {queryError} Verify spelling, spacing, and ensure the certificate has been approved by the Dean of Faculty.
              </p>
            </div>
          )}

        </div>
      )}

    </div>
  );
}
