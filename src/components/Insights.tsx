import { useState } from "react";
import { BLOG_DATA } from "../data";
import { BlogArticle } from "../types";
import { BookOpen, Calendar, User, ArrowLeft, ArrowRight, Share2 } from "lucide-react";

export default function Insights() {
  const [selectedArticleId, setSelectedArticleId] = useState<string | null>(null);

  const selectedArticle = BLOG_DATA.find((art) => art.id === selectedArticleId);

  // Native share fallback
  const handleShare = (title: string) => {
    if (navigator.share) {
      navigator.share({
        title: `${title} | Legacy of Auf Academy`,
        url: window.location.href,
      }).catch(console.error);
    } else {
      // Fallback copy url
      navigator.clipboard.writeText(window.location.href);
      alert("Article link copied to clipboard!");
    }
  };

  return (
    <section className="relative px-4 py-20 bg-black bg-islamic-pattern border-b border-gold/10">
      <div className="mx-auto max-w-7xl">
        
        {/* State 1: Reading a full article */}
        {selectedArticle ? (
          <div className="mx-auto max-w-3xl rounded-2xl border border-gold/30 bg-neutral-950 p-6 md:p-10 shadow-[0_0_40px_rgba(4,106,56,0.1)] animate-fade-in">
            {/* Back button */}
            <button
              id="back-to-blogs-btn"
              onClick={() => setSelectedArticleId(null)}
              className="inline-flex items-center gap-2 rounded bg-emerald-deep/20 border border-gold/25 px-4 py-2 text-xs font-mono uppercase tracking-wider text-gold hover:bg-gold hover:text-black transition-all mb-8 focus:outline-none"
            >
              <ArrowLeft className="h-4 w-4" />
              <span>Back to Insights</span>
            </button>

            {/* Article Header */}
            <div className="border-b border-gold/15 pb-6 mb-6">
              <span className="inline-flex items-center rounded-full bg-gold/10 px-3 py-1 text-xs font-semibold text-gold mb-4">
                {selectedArticle.category}
              </span>
              <h3 className="font-serif text-2xl md:text-4xl font-bold text-white tracking-wide leading-tight">
                {selectedArticle.title}
              </h3>
              
              <div className="mt-4 flex flex-wrap items-center gap-4 text-xs text-neutral-400">
                <span className="flex items-center gap-1.5">
                  <User className="h-4 w-4 text-gold" /> By {selectedArticle.author}
                </span>
                <span className="h-3 w-[1px] bg-gold/20" />
                <span className="flex items-center gap-1.5">
                  <Calendar className="h-4 w-4 text-gold" /> {selectedArticle.date}
                </span>
                <span className="h-3 w-[1px] bg-gold/20" />
                <span className="flex items-center gap-1.5">
                  <BookOpen className="h-4 w-4 text-gold" /> {selectedArticle.readTime}
                </span>
              </div>
            </div>

            {/* Rendered content */}
            <div className="font-sans text-sm md:text-base text-neutral-300 leading-relaxed whitespace-pre-wrap space-y-6">
              {selectedArticle.content}
            </div>

            {/* Article Footer Controls */}
            <div className="mt-12 pt-6 border-t border-gold/15 flex items-center justify-between">
              <button
                id="share-article-btn"
                onClick={() => handleShare(selectedArticle.title)}
                className="inline-flex items-center gap-2 rounded border border-gold/30 bg-black/40 px-4 py-2 text-xs font-semibold text-gold hover:bg-gold hover:text-black transition-all focus:outline-none"
              >
                <Share2 className="h-4 w-4" />
                <span>Share Article</span>
              </button>

              <button
                id="bottom-back-blogs"
                onClick={() => setSelectedArticleId(null)}
                className="font-mono text-xs text-neutral-400 hover:text-gold transition-colors"
              >
                Return to all articles
              </button>
            </div>

          </div>
        ) : (
          /* State 2: Displaying the Grid */
          <div>
            {/* Section Heading */}
            <div className="text-center max-w-3xl mx-auto mb-16">
              <span className="font-mono text-xs uppercase tracking-widest text-gold block mb-2">Islamic Business Insights</span>
              <h2 className="font-serif text-3xl font-bold text-white sm:text-4xl tracking-wide text-glow-gold">
                The Ledger of Wisdom
              </h2>
              <p className="mt-4 font-sans text-sm text-neutral-400">
                Weekly articles breaking down high-stakes business calculations, supply chain ethics, and biographies of history's greatest traders.
              </p>
              <div className="mt-4 flex justify-center items-center gap-2">
                <span className="h-[1px] w-12 bg-gold/40" />
                <span className="text-gold text-sm">✦</span>
                <span className="h-[1px] w-12 bg-gold/40" />
              </div>
            </div>

            {/* Articles Grid */}
            <div className="grid grid-cols-1 gap-8 md:grid-cols-2 lg:grid-cols-3">
              {BLOG_DATA.map((article: BlogArticle) => (
                <div
                  id={`article-card-${article.id}`}
                  key={article.id}
                  className="flex flex-col justify-between overflow-hidden rounded-xl border border-gold/15 bg-neutral-950 p-6 relative transition-all duration-300 hover:border-gold/45 hover:shadow-[0_0_20px_rgba(4,106,56,0.12)] group"
                >
                  <div>
                    {/* Header Details */}
                    <div className="flex items-center justify-between mb-4">
                      <span className="inline-flex items-center rounded-full bg-gold/10 px-2.5 py-0.5 text-xs font-semibold text-gold">
                        {article.category}
                      </span>
                      <span className="font-mono text-[9px] uppercase text-neutral-500">
                        {article.readTime}
                      </span>
                    </div>

                    {/* Title */}
                    <h3 className="font-serif text-lg font-bold text-white tracking-wide mb-3 group-hover:text-gold transition-colors">
                      {article.title}
                    </h3>

                    {/* Excerpt */}
                    <p className="font-sans text-xs text-neutral-300 leading-relaxed mb-6">
                      {article.excerpt}
                    </p>
                  </div>

                  {/* CTA row */}
                  <div className="border-t border-gold/10 pt-4 flex items-center justify-between">
                    <span className="font-sans text-[10px] text-neutral-400">
                      📝 {article.author}
                    </span>

                    <button
                      id={`read-article-btn-${article.id}`}
                      onClick={() => setSelectedArticleId(article.id)}
                      className="inline-flex items-center gap-1 font-mono text-[10px] uppercase tracking-wider text-gold hover:text-gold-light transition-colors"
                    >
                      <span>Read Full Entry</span>
                      <ArrowRight className="h-3 w-3 group-hover:translate-x-1 transition-transform" />
                    </button>
                  </div>

                </div>
              ))}
            </div>
          </div>
        )}

      </div>
    </section>
  );
}
