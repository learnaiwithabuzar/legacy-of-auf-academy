import React, { useState, useRef } from "react";
import { Award, Printer, Shield, Download, RefreshCw } from "lucide-react";
import { useCMS } from "../store/cmsStore";

export default function CertificateGenerator() {
  const { learningPaths, addNotification } = useCMS();
  const [userName, setUserName] = useState("Siddiq Al-Amin");
  const [selectedCourse, setSelectedCourse] = useState("The Ethical AI Solopreneur");
  const [certificateId, setCertificateId] = useState("LOA-9844-AWF");
  const [isGenerated, setIsGenerated] = useState(true);
  const certificateRef = useRef<HTMLDivElement>(null);

  const handleGenerate = (e: React.FormEvent) => {
    e.preventDefault();
    if (!userName.trim()) return;

    // Generate a beautiful unique serial number
    const randomNum = Math.floor(1000 + Math.random() * 9000);
    const trackCode = selectedCourse.split(" ").map(w => w[0]).join("");
    const newId = `LOA-${randomNum}-${trackCode}`;
    setCertificateId(newId);
    setIsGenerated(true);

    // Trigger congratulations notifications & email
    addNotification(
      "Sovereign Certificate Earned!",
      `Congratulations, ${userName}! You have successfully earned your Certificate of Achievement for completing "${selectedCourse}". Your cryptographic Credential ID is: ${newId}.`,
      "success"
    );
  };

  const handlePrint = () => {
    window.print();
  };

  return (
    <section className="relative px-4 py-20 bg-black bg-islamic-pattern border-b border-gold/10">
      <div className="mx-auto max-w-7xl">
        
        {/* Section Heading */}
        <div className="text-center max-w-3xl mx-auto mb-12">
          <span className="font-mono text-xs uppercase tracking-widest text-gold block mb-2">Honorable Credentials</span>
          <h2 className="font-serif text-3xl font-bold text-white sm:text-4xl tracking-wide text-glow-gold">
            Earn Your Legacy Certificate
          </h2>
          <p className="mt-4 font-sans text-sm text-neutral-400">
            Completing our learning paths grants you an official Legacy of Auf Academy credentials seal. Test the generator below by writing your name.
          </p>
          <div className="mt-4 flex justify-center items-center gap-2">
            <span className="h-[1px] w-12 bg-gold/40" />
            <span className="text-gold text-sm">✦</span>
            <span className="h-[1px] w-12 bg-gold/40" />
          </div>
        </div>

        {/* Certificate Section Grid */}
        <div className="grid grid-cols-1 gap-12 lg:grid-cols-12 items-start">
          
          {/* Column 1: Control Form */}
          <div className="lg:col-span-4 rounded-xl border border-gold/15 bg-neutral-950 p-6 glass-panel">
            <h3 className="font-serif text-lg font-bold text-white tracking-wide mb-4 flex items-center gap-2 border-b border-gold/25 pb-3">
              <Award className="h-5 w-5 text-gold" />
              <span>Certificate Console</span>
            </h3>

            <form onSubmit={handleGenerate} className="space-y-5">
              {/* Name Input */}
              <div>
                <label className="block font-serif text-xs font-semibold text-gold uppercase tracking-wider mb-2">
                  Full Student Name
                </label>
                <input
                  id="student-name-input"
                  type="text"
                  value={userName}
                  onChange={(e) => setUserName(e.target.value)}
                  className="w-full rounded-lg border border-gold/20 bg-black/60 px-4 py-3 font-sans text-sm text-white focus:border-gold focus:outline-none focus:ring-1 focus:ring-gold"
                  placeholder="Enter your name..."
                />
              </div>

              {/* Course Selector */}
              <div>
                <label className="block font-serif text-xs font-semibold text-gold uppercase tracking-wider mb-2">
                  Completed Academy Track
                </label>
                <select
                  id="certificate-track-select"
                  value={selectedCourse}
                  onChange={(e) => setSelectedCourse(e.target.value)}
                  className="w-full rounded-lg border border-gold/20 bg-black/60 px-4 py-3 font-sans text-sm text-white focus:border-gold focus:outline-none focus:ring-1 focus:ring-gold appearance-none cursor-pointer"
                >
                  {learningPaths.map((path) => (
                    <option key={path.id} value={path.title}>
                      {path.title}
                    </option>
                  ))}
                  {learningPaths.length === 0 && (
                    <option value="The Ethical AI Solopreneur">The Ethical AI Solopreneur</option>
                  )}
                </select>
              </div>

              {/* Generate Trigger */}
              <button
                id="generate-cert-btn"
                type="submit"
                className="w-full rounded bg-gradient-to-r from-gold via-gold-light to-gold-dark py-3 text-xs font-mono uppercase tracking-widest text-black font-extrabold hover:opacity-90 active:scale-[0.98] transition-all duration-150"
              >
                Render Gilded Seal
              </button>
            </form>

            {/* Explanation panel */}
            <div className="mt-6 border-t border-gold/15 pt-5 space-y-3">
              <span className="font-serif text-xs font-bold text-white uppercase tracking-wider block">How it works:</span>
              <ul className="space-y-2 font-sans text-xs text-neutral-400 pl-4 list-disc">
                <li>Complete all video chapters in your desired syllabus.</li>
                <li>Submit your core capstone case study for review.</li>
                <li>Receive your permanently-anchored cryptographic certificate serial ID.</li>
              </ul>
            </div>
          </div>

          {/* Column 2: Digital Certificate Renderer */}
          <div className="lg:col-span-8 space-y-4">
            
            {/* The Certificate Outer Border wrapper */}
            {isGenerated && (
              <div 
                id="printable-certificate-area"
                ref={certificateRef}
                className="relative mx-auto w-full aspect-[1.414/1] max-w-2xl rounded-lg border-8 border-double border-gold/40 bg-neutral-950 p-6 md:p-10 shadow-[0_0_50px_rgba(212,175,55,0.06)] overflow-hidden"
                style={{ backgroundImage: "radial-gradient(rgba(212, 175, 55, 0.03) 1px, transparent 0)", backgroundSize: "16px 16px" }}
              >
                {/* Decorative Internal Gold Frame */}
                <div className="absolute inset-2 border border-gold/20 pointer-events-none" />
                <div className="absolute inset-3 border border-gold/10 pointer-events-none" />

                {/* Elegant corner stars */}
                <div className="absolute top-5 left-5 text-gold/30 font-serif">✦</div>
                <div className="absolute top-5 right-5 text-gold/30 font-serif">✦</div>
                <div className="absolute bottom-5 left-5 text-gold/30 font-serif">✦</div>
                <div className="absolute bottom-5 right-5 text-gold/30 font-serif">✦</div>

                {/* Certificate Core Content */}
                <div className="flex flex-col h-full items-center justify-between text-center relative z-10 py-2">
                  
                  {/* Top Seal Badge */}
                  <div className="flex flex-col items-center">
                    <span className="text-gold tracking-widest text-[8px] md:text-[10px] font-mono">LEGACY OF AUF ACADEMY</span>
                    <div className="flex justify-center items-center gap-1.5 mt-1">
                      <span className="h-[1px] w-6 bg-gold/35" />
                      <span className="text-gold text-xs">⚜</span>
                      <span className="h-[1px] w-6 bg-gold/35" />
                    </div>
                  </div>

                  {/* Heading */}
                  <div className="space-y-1">
                    <h4 className="font-serif text-lg md:text-2xl font-bold tracking-widest text-glow-gold bg-gradient-to-r from-gold via-gold-light to-gold-dark bg-clip-text text-transparent uppercase">
                      Certificate of Achievement
                    </h4>
                    <p className="font-sans italic text-[10px] md:text-xs text-neutral-400">
                      This sovereign credential is proudly bestowed upon
                    </p>
                  </div>

                  {/* Student Name */}
                  <div className="border-b border-gold/30 pb-1.5 px-8 max-w-md">
                    <h5 className="font-serif text-xl md:text-3xl font-extrabold tracking-wide text-white capitalize text-glow-gold">
                      {userName}
                    </h5>
                  </div>

                  {/* Completion statement */}
                  <div className="max-w-md px-4">
                    <p className="font-sans text-[10px] md:text-xs text-neutral-300 leading-relaxed">
                      for the honorable mastery of <strong className="text-gold-light">{selectedCourse}</strong>, 
                      integrating modern technical tools, workflow automation, and wealth-building structures rooted in noble prophetic commerce ethics.
                    </p>
                  </div>

                  {/* Signature and Seal Row */}
                  <div className="grid grid-cols-3 items-end w-full max-w-md border-t border-gold/10 pt-4">
                    
                    {/* Left: Dean Sign */}
                    <div className="text-center">
                      <span className="block font-serif italic text-xs md:text-sm text-gold-light">Salim Al-Hassan</span>
                      <span className="block font-mono text-[8px] uppercase tracking-wider text-neutral-400 border-t border-gold/10 pt-1 mt-1">
                        Academy Dean
                      </span>
                    </div>

                    {/* Center: Gold Calligraphy Emblem */}
                    <div className="flex justify-center">
                      <div className="relative flex h-14 w-14 items-center justify-center rounded-full border-2 border-gold bg-emerald-deep shadow-[0_0_15px_rgba(212,175,55,0.25)]">
                        {/* Golden wax star design */}
                        <Award className="h-6 w-6 text-gold-light" />
                        <span className="absolute text-[8px] font-bold text-gold-light bottom-1.5 uppercase font-mono">AWF</span>
                      </div>
                    </div>

                    {/* Right: ID Code */}
                    <div className="text-center">
                      <span className="block font-mono text-[9px] text-gold font-bold">{certificateId}</span>
                      <span className="block font-mono text-[8px] uppercase tracking-wider text-neutral-400 border-t border-gold/10 pt-1 mt-1">
                        Credential ID
                      </span>
                    </div>

                  </div>

                </div>
              </div>
            )}

            {/* Print Control Toolbar */}
            <div className="flex justify-center gap-4">
              <button
                id="print-cert-btn"
                onClick={handlePrint}
                className="inline-flex items-center gap-2 rounded-lg border border-gold/45 bg-black px-4 py-2 text-xs font-semibold text-gold transition-all duration-200 hover:bg-gold hover:text-black focus:outline-none"
              >
                <Printer className="h-4 w-4" />
                <span>Print Credentials</span>
              </button>
            </div>

          </div>

        </div>

      </div>
    </section>
  );
}
