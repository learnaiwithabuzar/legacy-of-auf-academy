import React, { useState } from "react";
import { Mail, Phone, MapPin, Send, MessageSquare, Instagram, Facebook } from "lucide-react";

export default function ContactForm() {
  const [formData, setFormData] = useState({ name: "", email: "", message: "" });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitStatus, setSubmitStatus] = useState<"idle" | "success" | "error">("idle");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name || !formData.email || !formData.message) {
      setSubmitStatus("error");
      return;
    }

    setIsSubmitting(true);
    // Simulate premium server-less form submission
    setTimeout(() => {
      setIsSubmitting(false);
      setSubmitStatus("success");
      setFormData({ name: "", email: "", message: "" });
    }, 1500);
  };

  const socialLinks = [
    { label: "Official WhatsApp Community", url: "https://whatsapp.com/channel/0029VbDX7cP1XquYD9GOl72d", icon: MessageSquare },
    { label: "Instagram Reels Page", url: "https://www.instagram.com/lagecyofauf?igsh=dDc5NHg4Z2V3Nnk2", icon: Instagram },
    { label: "Facebook Discussion Board", url: "https://www.facebook.com/profile.php?id=61576440355188", icon: Facebook }
  ];

  return (
    <section className="relative px-4 py-20 bg-black bg-islamic-pattern border-b border-gold/10">
      <div className="mx-auto max-w-7xl">
        
        {/* Section Heading */}
        <div className="text-center max-w-3xl mx-auto mb-16">
          <span className="font-mono text-xs uppercase tracking-widest text-gold block mb-2">Inquiries & Alliances</span>
          <h2 className="font-serif text-3xl font-bold text-white sm:text-4xl tracking-wide text-glow-gold">
            Establish Contact with the Academy
          </h2>
          <p className="mt-4 font-sans text-sm text-neutral-400">
            Have partnerships, questions, or ideas? Send us a secure line and our admissions guild will respond with honor.
          </p>
          <div className="mt-4 flex justify-center items-center gap-2">
            <span className="h-[1px] w-12 bg-gold/40" />
            <span className="text-gold text-sm">✦</span>
            <span className="h-[1px] w-12 bg-gold/40" />
          </div>
        </div>

        {/* Form Layout Grid */}
        <div className="grid grid-cols-1 gap-12 lg:grid-cols-12 items-stretch">
          
          {/* Column 1: Contact Details & Quick Links (5 cols) */}
          <div className="lg:col-span-5 rounded-2xl border border-gold/15 bg-neutral-950 p-6 md:p-8 glass-panel flex flex-col justify-between">
            <div>
              <h3 className="font-serif text-lg font-bold text-white tracking-wide mb-6 border-b border-gold/15 pb-3">
                Academy Coordinates
              </h3>

              <div className="space-y-6">
                <div className="flex gap-4">
                  <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg border border-gold/20 bg-emerald-deep/20 text-gold">
                    <Mail className="h-5 w-5" />
                  </div>
                  <div>
                    <span className="block font-serif text-xs font-bold text-neutral-400 uppercase tracking-widest">General Admissions</span>
                    <a href="mailto:admissions@legacyofauf.com" className="font-sans text-sm text-white hover:text-gold transition-colors">
                      admissions@legacyofauf.com
                    </a>
                  </div>
                </div>

                <div className="flex gap-4">
                  <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg border border-gold/20 bg-emerald-deep/20 text-gold">
                    <Phone className="h-5 w-5" />
                  </div>
                  <div>
                    <span className="block font-serif text-xs font-bold text-neutral-400 uppercase tracking-widest">Office Messenger</span>
                    <span className="font-sans text-sm text-white">
                      +44 (753) 489-0294
                    </span>
                  </div>
                </div>

                <div className="flex gap-4">
                  <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg border border-gold/20 bg-emerald-deep/20 text-gold">
                    <MapPin className="h-5 w-5" />
                  </div>
                  <div>
                    <span className="block font-serif text-xs font-bold text-neutral-400 uppercase tracking-widest">Academy HQ</span>
                    <span className="font-sans text-sm text-white leading-relaxed">
                      Sovereign Guild Rooms, Suite 480<br />
                      Mayfair, London, United Kingdom
                    </span>
                  </div>
                </div>
              </div>
            </div>

            {/* Embedded channels again */}
            <div className="mt-10 pt-6 border-t border-gold/15">
              <h4 className="font-serif text-xs font-bold text-gold uppercase tracking-widest mb-4">
                ✦ Immediate Community Feeds
              </h4>
              <div className="space-y-2.5">
                {socialLinks.map((link, idx) => {
                  const Icon = link.icon;
                  return (
                    <a
                      id={`contact-social-link-${idx}`}
                      key={idx}
                      href={link.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center gap-2.5 rounded-lg border border-gold/10 bg-black/40 px-3 py-2 text-xs text-neutral-300 hover:text-gold hover:border-gold/30 hover:bg-emerald-deep/10 transition-all"
                    >
                      <Icon className="h-4 w-4 text-gold" />
                      <span>{link.label}</span>
                    </a>
                  );
                })}
              </div>
            </div>

          </div>

          {/* Column 2: Interactive Input form (7 cols) */}
          <div className="lg:col-span-7 rounded-2xl border border-gold/20 bg-black p-6 md:p-8 shadow-[0_0_30px_rgba(4,106,56,0.06)] relative overflow-hidden">
            <div className="absolute right-0 top-0 -mr-20 -mt-20 h-44 w-44 rounded-full bg-gold/3 blur-2xl" />

            <h3 className="font-serif text-lg font-bold text-white tracking-wide mb-6">
              Inscribe Your Message
            </h3>

            {submitStatus === "success" ? (
              <div className="rounded-xl border border-gold/30 bg-emerald-deep/20 p-8 text-center space-y-4 animate-fade-in">
                <span className="text-3xl">⚜</span>
                <h4 className="font-serif text-xl font-bold text-gold">Message Received with Honor</h4>
                <p className="font-sans text-xs text-neutral-300 max-w-sm mx-auto leading-relaxed">
                  We have cataloged your transmission. A member of the noble admissions board will follow up within 24 business hours.
                </p>
                <button
                  id="reset-form-btn"
                  onClick={() => setSubmitStatus("idle")}
                  className="rounded border border-gold/20 bg-black px-4 py-2 text-xs font-mono uppercase text-gold hover:bg-gold hover:text-black transition-all"
                >
                  Write Another Message
                </button>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-5">
                
                {submitStatus === "error" && (
                  <div className="rounded border border-rose-500/30 bg-rose-950/20 p-3 text-center">
                    <span className="font-mono text-xs text-rose-400">⚠️ Please fill in all fields truthfully.</span>
                  </div>
                )}

                {/* Name */}
                <div>
                  <label className="block font-serif text-xs font-semibold text-neutral-400 uppercase tracking-wider mb-2">
                    Your Name / Guild
                  </label>
                  <input
                    id="contact-name-input"
                    type="text"
                    required
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    className="w-full rounded-lg border border-gold/20 bg-neutral-950 px-4 py-3 font-sans text-sm text-white focus:border-gold focus:outline-none"
                    placeholder="E.g., Faris Al-Kamil"
                  />
                </div>

                {/* Email */}
                <div>
                  <label className="block font-serif text-xs font-semibold text-neutral-400 uppercase tracking-wider mb-2">
                    Noble Email Coordinate
                  </label>
                  <input
                    id="contact-email-input"
                    type="email"
                    required
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    className="w-full rounded-lg border border-gold/20 bg-neutral-950 px-4 py-3 font-sans text-sm text-white focus:border-gold focus:outline-none"
                    placeholder="E.g., faris@kamil.com"
                  />
                </div>

                {/* Message */}
                <div>
                  <label className="block font-serif text-xs font-semibold text-neutral-400 uppercase tracking-wider mb-2">
                    Your Message
                  </label>
                  <textarea
                    id="contact-message-input"
                    rows={4}
                    required
                    value={formData.message}
                    onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                    className="w-full rounded-lg border border-gold/20 bg-neutral-950 px-4 py-3 font-sans text-sm text-white focus:border-gold focus:outline-none resize-none"
                    placeholder="How may our school support your commercial journey?"
                  />
                </div>

                {/* Submit button */}
                <button
                  id="submit-contact-btn"
                  type="submit"
                  disabled={isSubmitting}
                  className="w-full inline-flex items-center justify-center gap-2 rounded bg-gradient-to-r from-gold via-gold-light to-gold-dark py-3.5 text-xs font-mono uppercase tracking-widest text-black font-extrabold hover:opacity-90 active:scale-[0.99] transition-all disabled:opacity-50"
                >
                  <Send className="h-3.5 w-3.5" />
                  <span>{isSubmitting ? "Transmitting..." : "Send Secure Message"}</span>
                </button>

              </form>
            )}

          </div>

        </div>

      </div>
    </section>
  );
}
