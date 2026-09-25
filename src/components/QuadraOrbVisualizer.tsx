import React from 'react';
import { QuadrantKey, SightAllocation } from '../types';

interface QuadraOrbVisualizerProps {
  sight: SightAllocation;
  activeQuadrant?: QuadrantKey;
  onQuadrantClick?: (quadrant: QuadrantKey) => void;
  interactive?: boolean;
  facilitatorPrompt?: string;
}

export const QuadraOrbVisualizer: React.FC<QuadraOrbVisualizerProps> = ({
  sight,
  activeQuadrant = 'meta',
  onQuadrantClick,
  interactive = true,
  facilitatorPrompt,
}) => {
  return (
    <div
      id="quadra-visualizer-wrapper"
      className="relative flex flex-col items-center justify-center select-none w-full max-w-2xl px-2 sm:px-4 overflow-hidden"
    >
      {/* Subtle geometric ring background - constrained to avoid mobile overflow */}
      <div className="absolute w-[280px] h-[280px] sm:w-[500px] sm:h-[500px] rounded-full border border-white/5 pointer-events-none animate-[spin_120s_linear_infinite]" />
      <div className="absolute w-[200px] h-[200px] sm:w-[340px] sm:h-[340px] rounded-full border border-white/[0.03] pointer-events-none" />

      {/* 4 Quadrants Grid */}
      <div
        id="quadra-matrix-grid"
        className="relative w-full max-w-[340px] xs:max-w-[400px] sm:max-w-[480px] aspect-square grid grid-cols-2 grid-rows-2 gap-2 sm:gap-4 p-1 sm:p-2"
      >
        {/* Central META Sphere - scaled ergonomically for mobile phone screens */}
        <div
          id="quadra-meta-center"
          onClick={() => interactive && onQuadrantClick?.('meta')}
          className={`absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-20 h-20 xs:w-24 xs:h-24 sm:w-32 sm:h-32 rounded-full border bg-[#050508] z-20 flex items-center justify-center flex-col transition-all cursor-pointer touch-manipulation active:scale-95 ${
            activeQuadrant === 'meta'
              ? 'border-[#D4AF37] shadow-[0_0_20px_rgba(212,175,55,0.3)] scale-105'
              : 'border-white/20 hover:border-white/40'
          }`}
        >
          <span className="text-[7.5px] sm:text-[9px] tracking-[0.25em] text-white/40 uppercase font-mono">
            Central
          </span>
          <span className="text-[11px] xs:text-xs sm:text-sm font-bold text-white tracking-[0.2em]">
            META
          </span>
          <span className="text-[7px] sm:text-[7.5px] text-[#D4AF37]/90 tracking-wider text-center mt-0.5 font-mono uppercase px-1 truncate max-w-full">
            Awareness
          </span>
          <span className="text-[6.5px] font-mono text-[#D4AF37]/60 tracking-widest uppercase mt-0.5">
            ◎ 360° Orbit
          </span>
        </div>

        {/* Quadrant I: Past / Memory (Top Left) */}
        <div
          id="quadrant-memory-cell"
          onClick={() => interactive && onQuadrantClick?.('memory')}
          className={`relative group p-2.5 xs:p-4 sm:p-7 border bg-white/[0.02] flex flex-col justify-start items-start rounded-xs transition-all touch-manipulation ${
            interactive ? 'cursor-pointer hover:bg-white/[0.04] active:bg-white/[0.06]' : ''
          } ${
            activeQuadrant === 'memory'
              ? 'border-[#D4AF37] shadow-[inset_0_0_20px_rgba(212,175,55,0.1)]'
              : 'border-white/5 hover:border-white/20'
          }`}
        >
          <div className="flex items-center gap-1.5 mb-0.5 sm:mb-1">
            <span className="text-[8px] sm:text-[9.5px] font-bold tracking-[0.15em] sm:tracking-[0.2em] text-[#D4AF37]">
              PAST
            </span>
            <span className="text-[7px] sm:text-[8px] font-mono text-white/30 tracking-widest">
              [Q-I]
            </span>
            <span className="text-[7px] font-mono text-[#D4AF37]/80 bg-[#D4AF37]/10 px-1 py-0.2 rounded-xs border border-[#D4AF37]/20 ml-auto">
              ◄ LEFT
            </span>
          </div>
          <h3 className="text-xs xs:text-sm sm:text-xl font-light text-white tracking-wide mb-0.5">
            MEMORY
          </h3>
          <p className="text-[9px] sm:text-[10px] text-white/40 font-mono hidden sm:block mb-4">
            What brought me here?
          </p>
          <div className="mt-auto w-full pt-1.5 sm:pt-3">
            <div className="flex justify-between text-[8px] sm:text-[9.5px] mb-1 font-mono text-white/50">
              <span className="uppercase tracking-wider">Recall</span>
              <span className="text-[#D4AF37] font-semibold">{sight.memory}%</span>
            </div>
            <div className="h-1 w-full bg-white/10 rounded-full overflow-hidden">
              <div
                className="h-full bg-[#D4AF37] transition-all duration-500"
                style={{ width: `${sight.memory}%` }}
              />
            </div>
          </div>
        </div>

        {/* Quadrant IV: Future / Projection (Top Right) */}
        <div
          id="quadrant-future-cell"
          onClick={() => interactive && onQuadrantClick?.('future')}
          className={`relative group p-2.5 xs:p-4 sm:p-7 border bg-white/[0.02] flex flex-col justify-start items-end text-right rounded-xs transition-all touch-manipulation ${
            interactive ? 'cursor-pointer hover:bg-white/[0.04] active:bg-white/[0.06]' : ''
          } ${
            activeQuadrant === 'future'
              ? 'border-[#8B5CF6] shadow-[inset_0_0_20px_rgba(139,92,246,0.1)]'
              : 'border-white/5 hover:border-white/20'
          }`}
        >
          <div className="flex items-center gap-1.5 mb-0.5 sm:mb-1">
            <span className="text-[7px] font-mono text-[#8B5CF6]/80 bg-[#8B5CF6]/10 px-1 py-0.2 rounded-xs border border-[#8B5CF6]/20 mr-auto">
              RIGHT ►
            </span>
            <span className="text-[7px] sm:text-[8px] font-mono text-white/30 tracking-widest">
              [Q-IV]
            </span>
            <span className="text-[8px] sm:text-[9.5px] font-bold tracking-[0.15em] sm:tracking-[0.2em] text-[#8B5CF6]">
              FUTURE
            </span>
          </div>
          <h3 className="text-xs xs:text-sm sm:text-xl font-light text-white tracking-wide mb-0.5">
            PROJECTION
          </h3>
          <p className="text-[9px] sm:text-[10px] text-white/40 font-mono hidden sm:block mb-4">
            What could happen next?
          </p>
          <div className="mt-auto w-full pt-1.5 sm:pt-3">
            <div className="flex justify-between text-[8px] sm:text-[9.5px] mb-1 font-mono text-white/50">
              <span className="text-[#8B5CF6] font-semibold">{sight.future}%</span>
              <span className="uppercase tracking-wider">Sim</span>
            </div>
            <div className="h-1 w-full bg-white/10 rounded-full overflow-hidden">
              <div
                className="h-full bg-[#8B5CF6] transition-all duration-500 ml-auto"
                style={{ width: `${sight.future}%` }}
              />
            </div>
          </div>
        </div>

        {/* Quadrant II: Affect / Meaning (Bottom Left) */}
        <div
          id="quadrant-meaning-cell"
          onClick={() => interactive && onQuadrantClick?.('meaning')}
          className={`relative group p-2.5 xs:p-4 sm:p-7 border bg-white/[0.02] flex flex-col justify-end items-start rounded-xs transition-all touch-manipulation ${
            interactive ? 'cursor-pointer hover:bg-white/[0.04] active:bg-white/[0.06]' : ''
          } ${
            activeQuadrant === 'meaning'
              ? 'border-[#EC4899] shadow-[inset_0_0_20px_rgba(236,72,153,0.1)]'
              : 'border-white/5 hover:border-white/20'
          }`}
        >
          <div className="w-full mb-auto pb-1.5 sm:pb-3">
            <div className="flex justify-between text-[8px] sm:text-[9.5px] mb-1 font-mono text-white/50">
              <span className="uppercase tracking-wider">Valence</span>
              <span className="text-[#EC4899] font-semibold">{sight.meaning}%</span>
            </div>
            <div className="h-1 w-full bg-white/10 rounded-full overflow-hidden">
              <div
                className="h-full bg-[#EC4899] transition-all duration-500"
                style={{ width: `${sight.meaning}%` }}
              />
            </div>
          </div>
          <p className="text-[9px] sm:text-[10px] text-white/40 font-mono hidden sm:block mb-1">
            What does this mean to me?
          </p>
          <h3 className="text-xs xs:text-sm sm:text-xl font-light text-white tracking-wide uppercase">
            Meaning
          </h3>
          <div className="flex items-center gap-1.5 mt-0.5 sm:mt-1">
            <span className="text-[8px] sm:text-[9.5px] font-bold tracking-[0.15em] sm:tracking-[0.2em] text-[#EC4899]">
              AFFECT
            </span>
            <span className="text-[7px] sm:text-[8px] font-mono text-white/30 tracking-widest">
              [Q-II]
            </span>
            <span className="text-[7px] font-mono text-[#EC4899]/80 bg-[#EC4899]/10 px-1 py-0.2 rounded-xs border border-[#EC4899]/20 ml-auto">
              ▼ DORSAL
            </span>
          </div>
        </div>

        {/* Quadrant III: Present / Embodiment (Bottom Right) */}
        <div
          id="quadrant-present-cell"
          onClick={() => interactive && onQuadrantClick?.('present')}
          className={`relative group p-2.5 xs:p-4 sm:p-7 border bg-white/[0.02] flex flex-col justify-end items-end text-right rounded-xs transition-all touch-manipulation ${
            interactive ? 'cursor-pointer hover:bg-white/[0.04] active:bg-white/[0.06]' : ''
          } ${
            activeQuadrant === 'present'
              ? 'border-[#10B981] shadow-[inset_0_0_20px_rgba(16,185,129,0.1)]'
              : 'border-white/5 hover:border-white/20'
          }`}
        >
          <div className="w-full mb-auto pb-1.5 sm:pb-3">
            <div className="flex justify-between text-[8px] sm:text-[9.5px] mb-1 font-mono text-white/50">
              <span className="text-[#10B981] font-semibold">{sight.present}%</span>
              <span className="uppercase tracking-wider">Somatic</span>
            </div>
            <div className="h-1 w-full bg-white/10 rounded-full overflow-hidden">
              <div
                className="h-full bg-[#10B981] transition-all duration-500 ml-auto"
                style={{ width: `${sight.present}%` }}
              />
            </div>
          </div>
          <p className="text-[9px] sm:text-[10px] text-white/40 font-mono hidden sm:block mb-1">
            What is happening now?
          </p>
          <h3 className="text-xs xs:text-sm sm:text-xl font-light text-white tracking-wide uppercase">
            Embodiment
          </h3>
          <div className="flex items-center gap-1.5 mt-0.5 sm:mt-1">
            <span className="text-[7px] font-mono text-[#10B981]/80 bg-[#10B981]/10 px-1 py-0.2 rounded-xs border border-[#10B981]/20 mr-auto">
              ▲ FRONTAL
            </span>
            <span className="text-[7px] sm:text-[8px] font-mono text-white/30 tracking-widest">
              [Q-III]
            </span>
            <span className="text-[8px] sm:text-[9.5px] font-bold tracking-[0.15em] sm:tracking-[0.2em] text-[#10B981]">
              PRESENT
            </span>
          </div>
        </div>
      </div>

      {/* Facilitator Socratic Prompt Caption */}
      <div className="mt-4 sm:mt-8 text-center max-w-lg px-2 sm:px-4">
        <p className="text-white/70 italic text-xs sm:text-sm font-serif leading-relaxed line-clamp-3 sm:line-clamp-none">
          &ldquo;
          {facilitatorPrompt ||
            'Observe what appears. Don\'t search aggressively. Notice what appears in the quadrant of Memory. What brought you here?'}
          &rdquo;
        </p>
        <span className="text-[8.5px] sm:text-[9px] font-mono tracking-widest text-[#D4AF37]/70 uppercase block mt-1.5 sm:mt-2">
          M.I.N.D.S. Dialectic Inquiry
        </span>
      </div>
    </div>
  );
};
