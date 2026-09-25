import React, { useState, useEffect } from 'react';
import { DailyAffirmation, QuadrantKey } from '../types';
import { getRandomAffirmation, MINDFUL_AFFIRMATIONS } from '../data/affirmationsData';
import {
  Sparkles,
  RefreshCw,
  Copy,
  Check,
  Compass,
  ChevronUp,
  ChevronDown,
  Quote,
  ArrowRight,
  MessageSquareQuote,
  Feather
} from 'lucide-react';

interface DailyAffirmationBannerProps {
  onReflectOnQuote?: (quoteText: string, quadrant: QuadrantKey) => void;
  className?: string;
}

export const DailyAffirmationBanner: React.FC<DailyAffirmationBannerProps> = ({
  onReflectOnQuote,
  className = '',
}) => {
  // Initialize randomized affirmation on load
  const [affirmation, setAffirmation] = useState<DailyAffirmation>(() => getRandomAffirmation());
  const [isRotating, setIsRotating] = useState(false);
  const [isCopied, setIsCopied] = useState(false);
  const [isCollapsed, setIsCollapsed] = useState(false);
  const [fadeAnim, setFadeAnim] = useState(true);

  // Trigger a fresh random quote with subtle transition
  const handleNextQuote = () => {
    setIsRotating(true);
    setFadeAnim(false);

    setTimeout(() => {
      setAffirmation((prev) => getRandomAffirmation(prev.id));
      setFadeAnim(true);
      setIsRotating(false);
    }, 200);
  };

  const handleCopyQuote = async () => {
    try {
      const textToCopy = `"${affirmation.quote}" — ${affirmation.author}${
        affirmation.sourceOrContext ? ` (${affirmation.sourceOrContext})` : ''
      }`;
      await navigator.clipboard.writeText(textToCopy);
      setIsCopied(true);
      setTimeout(() => setIsCopied(false), 2200);
    } catch {
      // Clipboard fallback
      setIsCopied(true);
      setTimeout(() => setIsCopied(false), 2200);
    }
  };

  const handleReflect = () => {
    if (onReflectOnQuote) {
      onReflectOnQuote(
        `Contemplating: "${affirmation.quote}" (${affirmation.author}) — `,
        affirmation.quadrantFocus
      );
    }
  };

  // Quadrant visual tags
  const getQuadrantColor = (q: QuadrantKey) => {
    switch (q) {
      case 'memory':
        return 'text-cyan-400 border-cyan-500/30 bg-cyan-950/20';
      case 'meaning':
        return 'text-purple-400 border-purple-500/30 bg-purple-950/20';
      case 'present':
        return 'text-emerald-400 border-emerald-500/30 bg-emerald-950/20';
      case 'future':
        return 'text-rose-400 border-rose-500/30 bg-rose-950/20';
      case 'meta':
      default:
        return 'text-[#D4AF37] border-[#D4AF37]/35 bg-[#D4AF37]/10';
    }
  };

  const getQuadrantName = (q: QuadrantKey) => {
    switch (q) {
      case 'memory':
        return 'Memory Quadrant';
      case 'meaning':
        return 'Meaning Quadrant';
      case 'present':
        return 'Present Sensation';
      case 'future':
        return 'Future Projection';
      case 'meta':
      default:
        return 'Meta-Awareness';
    }
  };

  return (
    <div
      id="daily-affirmation-generator"
      className={`w-full max-w-2xl border border-[#D4AF37]/35 bg-gradient-to-r from-[#0A0D18]/95 via-[#080B14]/95 to-[#0A0D18]/95 p-4 sm:p-5 rounded-xs shadow-[0_4px_30px_rgba(0,0,0,0.5)] relative overflow-hidden backdrop-blur-md transition-all ${className}`}
    >
      {/* Decorative Subtle Corner Aura */}
      <div className="absolute top-0 right-0 w-36 h-36 bg-[#D4AF37]/5 rounded-full blur-2xl pointer-events-none" />
      <div className="absolute -bottom-8 -left-8 w-24 h-24 bg-purple-500/5 rounded-full blur-xl pointer-events-none" />

      {/* Top Banner Row: Title, Category Badge, and Controls */}
      <div className="flex items-center justify-between gap-2 pb-2.5 border-b border-white/10">
        <div className="flex items-center gap-2">
          <div className="p-1 border border-[#D4AF37]/40 bg-[#D4AF37]/10 text-[#D4AF37] rounded-xs">
            <Sparkles className="w-3.5 h-3.5" />
          </div>
          <div className="flex items-center gap-2">
            <span className="text-[10px] font-mono uppercase tracking-[0.2em] text-[#D4AF37] font-semibold">
              Daily Mindful Affirmation
            </span>
            <span className="hidden sm:inline text-white/20">•</span>
            <span className={`hidden sm:inline px-2 py-0.5 text-[9px] font-mono uppercase tracking-wider border rounded-xs ${getQuadrantColor(affirmation.quadrantFocus)}`}>
              {affirmation.theme} ({getQuadrantName(affirmation.quadrantFocus)})
            </span>
          </div>
        </div>

        {/* Action Controls */}
        <div className="flex items-center gap-1.5">
          <button
            type="button"
            onClick={handleCopyQuote}
            className="p-1.5 border border-white/10 hover:border-white/30 text-white/60 hover:text-white rounded-xs text-[10px] font-mono flex items-center gap-1 transition-all"
            title="Copy affirmation to clipboard"
          >
            {isCopied ? (
              <>
                <Check className="w-3.5 h-3.5 text-emerald-400" />
                <span className="text-emerald-400 text-[9px] uppercase hidden sm:inline">Copied</span>
              </>
            ) : (
              <>
                <Copy className="w-3.5 h-3.5" />
                <span className="text-[9px] uppercase hidden sm:inline">Copy</span>
              </>
            )}
          </button>

          <button
            type="button"
            onClick={handleNextQuote}
            disabled={isRotating}
            className="p-1.5 border border-[#D4AF37]/40 hover:border-[#D4AF37] bg-[#D4AF37]/10 hover:bg-[#D4AF37]/20 text-[#D4AF37] rounded-xs text-[10px] font-mono flex items-center gap-1 transition-all active:scale-95"
            title="Randomize new mindful quote"
          >
            <RefreshCw className={`w-3.5 h-3.5 ${isRotating ? 'animate-spin' : ''}`} />
            <span className="text-[9px] uppercase font-semibold hidden sm:inline">New Quote</span>
          </button>

          <button
            type="button"
            onClick={() => setIsCollapsed(!isCollapsed)}
            className="p-1.5 text-white/40 hover:text-white/80 transition-colors"
            title={isCollapsed ? 'Expand quote' : 'Collapse quote'}
            aria-label={isCollapsed ? 'Expand quote' : 'Collapse quote'}
          >
            {isCollapsed ? <ChevronDown className="w-3.5 h-3.5" /> : <ChevronUp className="w-3.5 h-3.5" />}
          </button>
        </div>
      </div>

      {/* Main Quote Content */}
      {!isCollapsed ? (
        <div
          className={`pt-3.5 transition-opacity duration-200 ${
            fadeAnim ? 'opacity-100' : 'opacity-0'
          }`}
        >
          <div className="relative pl-5 sm:pl-6 pr-2">
            <Quote className="w-4 h-4 text-[#D4AF37]/40 absolute left-0 top-0.5 rotate-180" />
            <blockquote className="font-['Cinzel',serif] text-sm sm:text-base text-white/90 leading-relaxed tracking-wide italic font-normal selection:bg-[#D4AF37]/20">
              {affirmation.quote}
            </blockquote>
          </div>

          <div className="mt-3 pt-2.5 flex flex-wrap items-center justify-between gap-3 text-xs border-t border-white/5">
            <div className="flex items-center gap-2">
              <span className="text-[11px] font-medium font-sans text-white/85 tracking-wider">
                — {affirmation.author}
              </span>
              {affirmation.sourceOrContext && (
                <span className="text-[10.5px] font-mono text-white/40 italic">
                  , {affirmation.sourceOrContext}
                </span>
              )}
            </div>

            {onReflectOnQuote && (
              <button
                type="button"
                onClick={handleReflect}
                className="text-[10px] font-mono uppercase tracking-wider text-[#D4AF37] hover:text-[#E5C158] flex items-center gap-1 hover:underline transition-colors"
              >
                <Feather className="w-3 h-3" />
                <span>Reflect on this Quote</span>
                <ArrowRight className="w-2.5 h-2.5" />
              </button>
            )}
          </div>
        </div>
      ) : (
        <div className="pt-2 flex items-center justify-between text-xs text-white/70">
          <p className="truncate font-sans italic text-[11px] text-white/80 max-w-[80%]">
            "{affirmation.quote}" — <span className="text-[#D4AF37]">{affirmation.author}</span>
          </p>
          <span className="text-[9px] font-mono text-white/40 uppercase">Collapsed</span>
        </div>
      )}
    </div>
  );
};
