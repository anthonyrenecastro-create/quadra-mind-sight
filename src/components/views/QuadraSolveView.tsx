import React, { useState } from 'react';
import { Cpu, Send, Sparkles, Copy, Check, BookOpen } from 'lucide-react';
import { QuadraSolveResult } from '../../types';
import { authenticatedFetch } from '../../services/api';

interface QuadraSolveViewProps {
  onSaveToJournal?: (result: QuadraSolveResult) => void;
}

export const QuadraSolveView: React.FC<QuadraSolveViewProps> = ({ onSaveToJournal }) => {
  const [problemText, setProblemText] = useState('');
  const [notesText, setNotesText] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [result, setResult] = useState<QuadraSolveResult | null>(null);
  const [copied, setCopied] = useState(false);
  const [saved, setSaved] = useState(false);

  const handleSolve = async () => {
    if (!problemText.trim() || isLoading) return;

    setIsLoading(true);
    setResult(null);

    try {
      const response = await authenticatedFetch('/api/gemini/solve', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ problem: problemText, notes: notesText }),
      });
      const data = await response.json();
      setResult(data.analysis);
    } catch {
      // Local robust dialectic fallback
      setResult({
        past: 'Examine historical precedents: How have analogous bottlenecks or tensions been resolved in the past? What recurring pattern led to this constraint?',
        meaning: 'Clarify core stakes: What emotional values, motivations, or unstated fears are driving this dilemma? What does success truly signify?',
        present: 'Assess objective reality: What are the uncompromising physical facts, active constraints, and immediate resources directly available now?',
        future: 'Simulate candidate trajectories: If the primary constraint were removed, what emergent options unfold? What does an alternative pathway look like?',
        meta: 'Coherent synthesis: Hold all four perspectives simultaneously. Notice the strategic bridge that resolves the tension without compromising core values.',
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleCopy = () => {
    if (!result) return;
    const text = `QUADRA SOLVE ANALYSIS:\n\nPROBLEM: ${problemText}\n\n1. PAST (Memory & Precedent):\n${result.past}\n\n2. MEANING (Stakes & Values):\n${result.meaning}\n\n3. PRESENT (Constraints & Facts):\n${result.present}\n\n4. FUTURE (Simulated Trajectories):\n${result.future}\n\n5. META SYNTHESIS:\n${result.meta}`;
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div id="quadra-solve-view" className="flex-1 p-3 sm:p-8 overflow-y-auto max-w-5xl mx-auto space-y-5 sm:space-y-8 touch-scroll">
      {/* Header */}
      <div className="border-b border-white/10 pb-3 sm:pb-4">
        <span className="text-[9.5px] sm:text-[10px] font-mono uppercase tracking-[0.25em] text-[#D4AF37] block mb-1">
          Cognitive Resolution Engine
        </span>
        <h2 className="text-lg sm:text-2xl font-light text-white tracking-wide flex items-center gap-2 sm:gap-2.5">
          <Cpu className="w-4 h-4 sm:w-5 sm:h-5 text-[#D4AF37]" />
          QUADRA SOLVE
        </h2>
        <p className="text-xs text-white/60 mt-1 max-w-2xl font-light leading-relaxed">
          Subject complex dilemmas, creative blocks, and strategic forks to multi-perspective 4-quadrant decomposition and higher-order meta-synthesis.
        </p>
      </div>

      {/* Input Form */}
      <div className="border border-white/10 bg-[#050508]/80 p-4 sm:p-6 rounded-xs space-y-4 shadow-xl">
        <div>
          <label className="text-xs font-mono uppercase text-white/80 block mb-2 font-bold">
            Problem or Dilemma Statement:
          </label>
          <input
            id="quadra-solve-problem-input"
            type="text"
            value={problemText}
            onChange={(e) => setProblemText(e.target.value)}
            placeholder="e.g. Navigating a major career pivot while managing financial uncertainty and creative burnout..."
            className="w-full bg-black border border-white/15 px-4 py-3 text-xs sm:text-sm text-white placeholder:text-white/20 focus:border-[#D4AF37] focus:outline-hidden font-sans rounded-xs"
          />
        </div>

        <div>
          <label className="text-xs font-mono uppercase text-white/60 block mb-2">
            Context, Observations, & Constraints (Optional):
          </label>
          <textarea
            id="quadra-solve-notes-input"
            value={notesText}
            onChange={(e) => setNotesText(e.target.value)}
            placeholder="Key facts, historical background, conflicting emotional desires, timeline constraints..."
            className="w-full bg-black border border-white/15 px-4 py-2.5 text-xs text-white placeholder:text-white/20 focus:border-[#D4AF37] focus:outline-hidden font-sans rounded-xs h-20 resize-none"
          />
        </div>

        <div className="flex justify-end pt-2">
          <button
            id="quadra-solve-submit-btn"
            onClick={handleSolve}
            disabled={isLoading || !problemText.trim()}
            className="px-6 py-3 bg-[#D4AF37] hover:bg-[#E5C158] text-black text-xs font-bold font-mono uppercase tracking-[0.2em] transition-all disabled:opacity-30 rounded-xs flex items-center gap-2"
          >
            {isLoading ? <Sparkles className="w-4 h-4 animate-spin" /> : <Send className="w-4 h-4" />}
            <span>{isLoading ? 'Decomposing Quadrants...' : 'Deconstruct via Quadra'}</span>
          </button>
        </div>
      </div>

      {/* Results Display */}
      {result && (
        <div className="space-y-6 animate-in fade-in duration-300">
          <div className="flex items-center justify-between border-b border-white/10 pb-3">
            <span className="text-xs font-mono uppercase tracking-widest text-[#D4AF37] font-bold">
              Multi-Quadrant Resolution
            </span>
            <div className="flex items-center gap-2">
              <button
                onClick={handleCopy}
                className="px-3 py-1.5 border border-white/10 hover:border-white/30 text-white/70 hover:text-white text-xs font-mono uppercase tracking-wider rounded-xs flex items-center gap-1.5"
              >
                {copied ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                <span>{copied ? 'Copied' : 'Copy All'}</span>
              </button>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Quadrant I: Past */}
            <div className="p-5 border border-white/10 bg-white/[0.02] rounded-xs space-y-2">
              <div className="flex items-center gap-2">
                <span className="w-2 h-2 bg-[#D4AF37] rounded-xs" />
                <span className="text-[10px] font-mono uppercase tracking-widest text-[#D4AF37] font-bold">
                  Quadrant I: Past (Precedent & Origins)
                </span>
              </div>
              <p className="text-xs text-white/80 leading-relaxed font-light font-sans whitespace-pre-wrap">
                {result.past}
              </p>
            </div>

            {/* Quadrant II: Meaning */}
            <div className="p-5 border border-white/10 bg-white/[0.02] rounded-xs space-y-2">
              <div className="flex items-center gap-2">
                <span className="w-2 h-2 bg-[#EF4444] rounded-xs" />
                <span className="text-[10px] font-mono uppercase tracking-widest text-[#EF4444] font-bold">
                  Quadrant II: Meaning (Stakes & Values)
                </span>
              </div>
              <p className="text-xs text-white/80 leading-relaxed font-light font-sans whitespace-pre-wrap">
                {result.meaning}
              </p>
            </div>

            {/* Quadrant III: Present */}
            <div className="p-5 border border-white/10 bg-white/[0.02] rounded-xs space-y-2">
              <div className="flex items-center gap-2">
                <span className="w-2 h-2 bg-[#10B981] rounded-xs" />
                <span className="text-[10px] font-mono uppercase tracking-widest text-[#10B981] font-bold">
                  Quadrant III: Present (Immediate Constraints & Facts)
                </span>
              </div>
              <p className="text-xs text-white/80 leading-relaxed font-light font-sans whitespace-pre-wrap">
                {result.present}
              </p>
            </div>

            {/* Quadrant IV: Future */}
            <div className="p-5 border border-white/10 bg-white/[0.02] rounded-xs space-y-2">
              <div className="flex items-center gap-2">
                <span className="w-2 h-2 bg-[#8B5CF6] rounded-xs" />
                <span className="text-[10px] font-mono uppercase tracking-widest text-[#8B5CF6] font-bold">
                  Quadrant IV: Future (Candidate Simulations)
                </span>
              </div>
              <p className="text-xs text-white/80 leading-relaxed font-light font-sans whitespace-pre-wrap">
                {result.future}
              </p>
            </div>
          </div>

          {/* Central Meta Synthesis */}
          <div className="p-6 border border-[#D4AF37]/40 bg-[#D4AF37]/5 rounded-xs space-y-2 shadow-lg">
            <div className="flex items-center gap-2">
              <Sparkles className="w-4 h-4 text-[#D4AF37]" />
              <span className="text-xs font-mono uppercase tracking-[0.2em] text-[#D4AF37] font-bold">
                Higher-Order Meta Synthesis
              </span>
            </div>
            <p className="text-sm text-white/90 leading-relaxed font-light font-sans whitespace-pre-wrap">
              {result.meta}
            </p>
          </div>
        </div>
      )}
    </div>
  );
};
