import React, { useState, useMemo } from "react";
import { Search, Compass, BookOpen, FileText, Bookmark, FileSpreadsheet, ArrowUpRight, HelpCircle, ShieldAlert } from "lucide-react";

interface SearchIndexItem {
  id: string;
  category: "Curriculum" | "Shariah Insight" | "Islamic Reference" | "Template & File";
  title: string;
  excerpt: string;
  reference?: string;
  referenceType?: "Direct Quranic Source" | "Authentic Hadith Source" | "Classical Commentary" | "Tactical Application";
  fileType?: "PDF" | "Spreadsheet" | "Deck" | "Contract";
  tags: string[];
}

export default function AdvancedSearch() {
  const [query, setQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState<string>("all");

  const searchIndex: SearchIndexItem[] = [
    {
      id: "cur-1",
      category: "Curriculum",
      title: "Mudarabah SaaS Capitalization Models",
      excerpt: "Deep dive into profit-sharing partnership models for modern recurring-revenue SaaS products. Setup ethical investor contracts without pre-defined fixed usury percentages.",
      tags: ["mudarabah", "equity", "saas", "capital", "fintech"]
    },
    {
      id: "cur-2",
      category: "Curriculum",
      title: "Waqf-Driven Corporate Treasuries",
      excerpt: "Understand how to structured multi-generation endowment funds to finance community software development, ensuring permanent interest-free development capital.",
      tags: ["waqf", "endowment", "treasury", "capital", "community"]
    },
    {
      id: "ins-1",
      category: "Shariah Insight",
      title: "Ethical AI Software Licensing",
      excerpt: "Analyzing the Shariah legality of artificial intelligence usage. Rules governing data ownership, model copyright, and open-source licensing under ethical principles.",
      tags: ["ai", "ethics", "intellectual property", "licensing"]
    },
    {
      id: "ins-2",
      category: "Shariah Insight",
      title: "DeFi Liquidity Pools without Riba",
      excerpt: "A tactical guide on building automated market maker protocols (AMMs) that maintain absolute compliance with anti-riba laws by routing transaction fees purely as work compensation.",
      tags: ["defi", "crypto", "blockchain", "riba", "fintech"]
    },
    {
      id: "ref-1",
      category: "Islamic Reference",
      title: "The Absolute Prohibition of Usurious Trade",
      excerpt: "Trade is permissible, but usury (riba) is completely prohibited. Contract mutuality and shared business risk must form the foundation of any commercial venture.",
      reference: "Surah Al-Baqarah 2:275",
      referenceType: "Direct Quranic Source",
      tags: ["riba", "usury", "quran", "prohibition"]
    },
    {
      id: "ref-2",
      category: "Islamic Reference",
      title: "Mutual Consent in Commercial Contracts",
      excerpt: "A commercial transaction is valid only when conducted through mutual consent and transparent disclosure. Deceit (gharar) nullifies contract legitimacy.",
      reference: "Sahih al-Bukhari 2082 / Sahih Muslim 1515",
      referenceType: "Authentic Hadith Source",
      tags: ["hadith", "consent", "contracts", "gharar"]
    },
    {
      id: "ref-3",
      category: "Islamic Reference",
      title: "Classical Al-Kharaj bi al-Daman Standard",
      excerpt: "The historical Shariah legal maxim stating that entitlement to profit is directly coupled with liability for loss. Guaranteed riskless returns are usurious.",
      reference: "Kitab al-Kharaj by Imam Abu Yusuf",
      referenceType: "Classical Commentary",
      tags: ["loss", "profit", "liability", "standard", "maxim"]
    },
    {
      id: "tem-1",
      category: "Template & File",
      title: "Zero-Interest Mudarabah Partnership Agreement",
      excerpt: "A highly-polished customizable legal contract template in PDF outlining profit-distribution thresholds, loss boundaries, and general partner responsibilities.",
      fileType: "Contract",
      tags: ["contract", "mudarabah", "download", "legal"]
    },
    {
      id: "tem-2",
      category: "Template & File",
      title: "Musharakah Equity Cap-Table Spreadsheet Model",
      excerpt: "Customized Excel model calculating dynamic equity dilution, dynamic profit-share distributions, and buy-out calculations based on ethical finance equations.",
      fileType: "Spreadsheet",
      tags: ["excel", "musharakah", "captable", "model"]
    },
    {
      id: "tem-3",
      category: "Template & File",
      title: "Halal Seed Round Investment Pitch Deck",
      excerpt: "An ethical 10-slide presentation template styled with elegant display typography. Focused on showing ethical compliance, target market growth, and waqf synergies.",
      fileType: "Deck",
      tags: ["deck", "pitch", "funding", "seed", "presentation"]
    }
  ];

  // Filter index based on query and category
  const filteredResults = useMemo(() => {
    return searchIndex.filter((item) => {
      // Category filter
      if (selectedCategory !== "all" && item.category !== selectedCategory) {
        return false;
      }

      // Query filter
      if (!query.trim()) return true;
      const lowerQuery = query.toLowerCase();
      
      const matchTitle = item.title.toLowerCase().includes(lowerQuery);
      const matchExcerpt = item.excerpt.toLowerCase().includes(lowerQuery);
      const matchRef = item.reference?.toLowerCase().includes(lowerQuery);
      const matchTags = item.tags.some(tag => tag.toLowerCase().includes(lowerQuery));

      return matchTitle || matchExcerpt || matchRef || matchTags;
    });
  }, [query, selectedCategory]);

  const getCategoryIcon = (category: string) => {
    switch (category) {
      case "Curriculum": return Compass;
      case "Shariah Insight": return BookOpen;
      case "Islamic Reference": return ShieldAlert;
      default: return FileText;
    }
  };

  const getRefTypeColor = (type?: string) => {
    switch (type) {
      case "Direct Quranic Source": return "border-emerald-500/20 bg-emerald-950/40 text-emerald-400";
      case "Authentic Hadith Source": return "border-gold/20 bg-gold/5 text-gold-light";
      case "Classical Commentary": return "border-purple-500/20 bg-purple-950/40 text-purple-400";
      default: return "border-blue-500/20 bg-blue-950/40 text-blue-400";
    }
  };

  const getFileTypeBadgeColor = (type?: string) => {
    switch (type) {
      case "Contract": return "bg-red-950 text-red-400 border border-red-500/20";
      case "Spreadsheet": return "bg-emerald-950 text-emerald-400 border border-emerald-500/20";
      default: return "bg-blue-950 text-blue-400 border border-blue-500/20";
    }
  };

  return (
    <div id="advanced-global-search-deck" className="space-y-6">
      
      {/* Search form controls */}
      <div className="rounded-xl border border-gold/15 bg-neutral-950/80 p-5 shadow-md space-y-4 text-left">
        <span className="font-mono text-[9px] uppercase tracking-widest text-gold font-bold flex items-center gap-1">
          <span>✦</span> SOVEREIGN SEARCH MATRIX <span>✦</span>
        </span>
        
        <div className="relative">
          <Search className="absolute left-3.5 top-3 h-5 w-5 text-neutral-500" />
          <input
            type="text"
            placeholder="Type keywords (e.g. Mudarabah, usury, DeFi, Excel, Quran)..."
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            className="w-full rounded-xl bg-black border border-gold/25 pl-11 pr-4 py-3 font-sans text-xs md:text-sm text-white focus:border-gold focus:outline-none focus:ring-1 focus:ring-gold"
          />
        </div>

        {/* Filter categories tabs */}
        <div className="flex flex-wrap gap-2 pt-1">
          {[
            { id: "all", label: "All Index Matrix" },
            { id: "Curriculum", label: "Academy Topics" },
            { id: "Shariah Insight", label: "Shariah Insights" },
            { id: "Islamic Reference", label: "Quran / Hadith Sources" },
            { id: "Template & File", label: "Templates & Excel Tools" }
          ].map((cat) => (
            <button
              key={cat.id}
              onClick={() => setSelectedCategory(cat.id)}
              className={`px-3 py-1.5 rounded font-mono text-[10px] uppercase tracking-wider transition-all border cursor-pointer ${
                selectedCategory === cat.id
                  ? "bg-gold text-black border-gold font-bold"
                  : "bg-neutral-900 text-neutral-400 border-neutral-800 hover:text-white"
              }`}
            >
              {cat.label}
            </button>
          ))}
        </div>
      </div>

      {/* Results Deck */}
      <div className="space-y-4 text-left">
        <div className="flex justify-between items-center px-1">
          <span className="font-mono text-[10px] text-neutral-500 uppercase tracking-widest">
            Search discovered {filteredResults.length} index nodes
          </span>
          {query && (
            <button
              onClick={() => setQuery("")}
              className="font-mono text-[9px] text-red-400 hover:underline uppercase"
            >
              Reset Query
            </button>
          )}
        </div>

        {filteredResults.length === 0 ? (
          <div className="text-center py-20 border border-dashed border-neutral-800 rounded-xl bg-neutral-950/40 space-y-3">
            <Search className="h-10 w-10 text-neutral-600 mx-auto" />
            <p className="font-serif text-sm font-semibold text-neutral-400">Zero matching nodes found</p>
            <p className="font-sans text-xs text-neutral-500 max-w-sm mx-auto">
              Refine your filter keywords or select a different index category above to expand your inquiry range.
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {filteredResults.map((item) => {
              const Icon = getCategoryIcon(item.category);
              return (
                <div
                  key={item.id}
                  className="rounded-xl border border-gold/15 bg-neutral-950/60 p-5 hover:border-gold/30 hover:bg-neutral-950/90 transition-all duration-200 flex flex-col justify-between group cursor-pointer"
                >
                  <div className="space-y-3">
                    {/* Category Label */}
                    <div className="flex items-center justify-between">
                      <span className="font-mono text-[8.5px] uppercase tracking-widest text-gold-light/60 flex items-center gap-1.5">
                        <Icon className="h-3.5 w-3.5 text-gold shrink-0" />
                        <span>{item.category}</span>
                      </span>

                      {/* Reference/File specific badges */}
                      {item.referenceType && (
                        <span className={`px-2 py-0.5 rounded text-[8px] font-mono border uppercase font-semibold ${getRefTypeColor(item.referenceType)}`}>
                          {item.referenceType}
                        </span>
                      )}

                      {item.fileType && (
                        <span className={`px-2 py-0.5 rounded text-[8px] font-mono border uppercase font-semibold ${getFileTypeBadgeColor(item.fileType)}`}>
                          {item.fileType} FILE
                        </span>
                      )}
                    </div>

                    <div className="space-y-1">
                      <h4 className="font-serif text-sm font-bold text-white group-hover:text-gold transition-colors tracking-wide">
                        {item.title}
                      </h4>
                      <p className="font-sans text-[11.5px] text-neutral-400 leading-relaxed">
                        {item.excerpt}
                      </p>
                    </div>

                    {item.reference && (
                      <div className="p-2 border border-dashed border-gold/15 bg-gold/5 rounded font-mono text-[9px] text-gold-light flex gap-1.5 items-center">
                        <Bookmark className="h-3.5 w-3.5 text-gold shrink-0" />
                        <span>Reference Citation: <strong className="text-white uppercase">{item.reference}</strong></span>
                      </div>
                    )}
                  </div>

                  {/* Tags and Action trigger */}
                  <div className="mt-4 pt-3 border-t border-neutral-900/60 flex items-center justify-between">
                    <div className="flex flex-wrap gap-1.5">
                      {item.tags.map((tg) => (
                        <span key={tg} className="font-mono text-[8px] text-neutral-500 bg-neutral-900 border border-neutral-800/80 px-1.5 py-0.5 rounded">
                          #{tg}
                        </span>
                      ))}
                    </div>
                    <span className="text-neutral-500 group-hover:text-gold transition-colors font-mono text-[9px] flex items-center gap-0.5 uppercase tracking-widest font-bold">
                      <span>View</span>
                      <ArrowUpRight className="h-3 w-3" />
                    </span>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>

    </div>
  );
}
