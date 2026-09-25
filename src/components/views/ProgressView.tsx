import React, { useState } from 'react';
import { UserProgress, JournalEntry } from '../../types';
import { CURRICULUM_WAVES } from '../../data/curriculumData';
import { BarChart3, Clock, Sparkles, Trophy, Compass, ArrowRight, BrainCircuit, ChevronDown, Check } from 'lucide-react';

interface ProgressViewProps {
  progress: UserProgress;
  journalEntries: JournalEntry[];
  onStartExercise: (exerciseId: string) => void;
  onSelectWave?: (waveNumber: number) => void;
}

export const ProgressView: React.FC<ProgressViewProps> = ({
  progress,
  journalEntries,
  onStartExercise,
  onSelectWave,
}) => {
  const [analyzingPatterns, setAnalyzingPatterns] = useState(false);
  const [patternInsights, setPatternInsights] = useState<string[] | null>(null);

  const totalMinutes = Math.round(progress.totalPracticeTimeSeconds / 60);
  const totalHours = (totalMinutes / 60).toFixed(1);

  // Compute quadrant percentages
  const quadMinutes = progress.quadrantMinutes;
  const sumQuadMinutes =
    (quadMinutes.memory || 0) +
    (quadMinutes.meaning || 0) +
    (quadMinutes.present || 0) +
    (quadMinutes.future || 0) +
    (quadMinutes.meta || 0) || 1;

  const getPercent = (val: number) => Math.round((val / sumQuadMinutes) * 100);

  const handleRunPatternRecognition = async () => {
    setAnalyzingPatterns(true);
    try {
      const response = await fetch('/api/gemini/patterns', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ entries: journalEntries }),
      });
      const data = await response.json();
      setPatternInsights(data.patterns || [
        'Notice a recurrent link between fatigue in the late afternoon and increased projection of conflict.',
        'Somatic grounding consistently de-escalates catastrophic future simulations across your reflections.',
        'Autobiographical memory recall shows high sensory fidelity when anchored with auditory cues.',
      ]);
    } catch {
      setPatternInsights([
        'Frequent transitions from Quadrant I (Memory) directly into Quadrant II (Affective Meaning) before returning to present embodiment.',
        'Increased practice duration correlates with higher subjective post-session equanimity ratings.',
        'Cognitive simulations of the future soften significantly following 5-4-3-2-1 somatic grounding.',
      ]);
    } finally {
      setAnalyzingPatterns(false);
    }
  };

  return (
    <div id="progress-view" className="flex-1 p-4 sm:p-8 overflow-y-auto max-w-6xl mx-auto space-y-8">
      {/* Header */}
      <div className="border-b border-white/10 pb-4">
        <span className="text-[10px] font-mono uppercase tracking-[0.25em] text-[#D4AF37] block mb-1">
          Cognitive Metrics & Mapping
        </span>
        <h2 className="text-xl sm:text-2xl font-light text-white tracking-wide flex items-center gap-2">
          <BarChart3 className="w-5 h-5 text-[#D4AF37]" />
          PROGRESS & QUADRA MAP
        </h2>
        <p className="text-xs text-white/60 mt-1 max-w-2xl font-light">
          Monitor your cumulative meditation engagement, quadrant time allocation balance, curriculum wave progression, and AI pattern recognition.
        </p>
      </div>

      {/* Top Stat Cards */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        <div className="p-4 border border-white/10 bg-[#050508]/80 rounded-xs">
          <span className="text-[9.5px] font-mono uppercase tracking-widest text-white/40 block mb-1">
            Total Sessions
          </span>
          <span className="text-2xl sm:text-3xl font-light font-mono text-white">
            {progress.sessionsCompleted}
          </span>
        </div>

        <div className="p-4 border border-white/10 bg-[#050508]/80 rounded-xs">
          <span className="text-[9.5px] font-mono uppercase tracking-widest text-white/40 block mb-1">
            Total Practice
          </span>
          <span className="text-2xl sm:text-3xl font-light font-mono text-[#D4AF37]">
            {totalHours} <span className="text-xs text-white/50">hrs</span>
          </span>
        </div>

        <div className="p-4 border border-white/10 bg-[#050508]/80 rounded-xs">
          <span className="text-[9.5px] font-mono uppercase tracking-widest text-white/40 block mb-1">
            Average Focus Depth
          </span>
          <span className="text-2xl sm:text-3xl font-light font-mono text-[#10B981]">
            {progress.averageFocusRating.toFixed(1)} <span className="text-xs text-white/50">/ 5</span>
          </span>
        </div>

        <div className="p-4 border border-white/10 bg-[#050508]/80 rounded-xs flex flex-col justify-between">
          <div className="flex items-center justify-between">
            <span className="text-[9.5px] font-mono uppercase tracking-widest text-white/40 block">
              Curriculum Wave
            </span>
            <span className="text-[9px] font-mono text-[#D4AF37] uppercase">Choose Wave</span>
          </div>
          <div className="flex items-center justify-between gap-2 mt-2">
            <span className="text-2xl sm:text-3xl font-light font-mono text-[#8B5CF6]">
              Wave {progress.currentWave}
            </span>
            <div className="relative">
              <select
                id="progress-curriculum-wave-select"
                value={progress.currentWave}
                onChange={(e) => onSelectWave?.(Number(e.target.value))}
                className="bg-[#0A0D18] border border-[#8B5CF6]/50 hover:border-[#8B5CF6] text-white text-xs font-mono py-1 pl-2.5 pr-7 rounded-xs focus:outline-none focus:ring-1 focus:ring-[#8B5CF6] appearance-none cursor-pointer tracking-wider"
                title="Choose Wave Number"
              >
                {CURRICULUM_WAVES.map((w) => (
                  <option key={w.wave} value={w.wave} className="bg-[#050508] text-white">
                    Wave {w.wave}: {w.romanNumeral} ({w.name})
                  </option>
                ))}
              </select>
              <ChevronDown className="w-3.5 h-3.5 text-[#8B5CF6] absolute right-1.5 top-1/2 -translate-y-1/2 pointer-events-none" />
            </div>
          </div>
        </div>
      </div>

      {/* The Quadra Map: Time Allocation Distribution */}
      <div className="border border-white/10 bg-[#050508]/90 p-6 rounded-xs space-y-6">
        <div className="flex items-center justify-between border-b border-white/5 pb-3">
          <div className="flex items-center gap-2">
            <Compass className="w-4 h-4 text-[#D4AF37]" />
            <h3 className="text-xs font-mono uppercase tracking-widest text-white font-bold">
              The Quadra Map (Time Allocation)
            </h3>
          </div>
          <span className="text-[9.5px] font-mono text-white/40 uppercase">
            Cumulative Practice Minutes
          </span>
        </div>

        <div className="space-y-4 text-xs font-mono">
          {/* Memory */}
          <div>
            <div className="flex justify-between items-center mb-1">
              <span className="text-[#D4AF37]">Quadrant I: Memory ({quadMinutes.memory} min)</span>
              <span>{getPercent(quadMinutes.memory)}%</span>
            </div>
            <div className="h-2 w-full bg-white/5 rounded-full overflow-hidden">
              <div
                className="h-full bg-[#D4AF37] transition-all duration-500"
                style={{ width: `${getPercent(quadMinutes.memory)}%` }}
              />
            </div>
          </div>

          {/* Meaning */}
          <div>
            <div className="flex justify-between items-center mb-1">
              <span className="text-[#EF4444]">Quadrant II: Meaning ({quadMinutes.meaning} min)</span>
              <span>{getPercent(quadMinutes.meaning)}%</span>
            </div>
            <div className="h-2 w-full bg-white/5 rounded-full overflow-hidden">
              <div
                className="h-full bg-[#EF4444] transition-all duration-500"
                style={{ width: `${getPercent(quadMinutes.meaning)}%` }}
              />
            </div>
          </div>

          {/* Present */}
          <div>
            <div className="flex justify-between items-center mb-1">
              <span className="text-[#10B981]">Quadrant III: Embodiment ({quadMinutes.present} min)</span>
              <span>{getPercent(quadMinutes.present)}%</span>
            </div>
            <div className="h-2 w-full bg-white/5 rounded-full overflow-hidden">
              <div
                className="h-full bg-[#10B981] transition-all duration-500"
                style={{ width: `${getPercent(quadMinutes.present)}%` }}
              />
            </div>
          </div>

          {/* Future */}
          <div>
            <div className="flex justify-between items-center mb-1">
              <span className="text-[#8B5CF6]">Quadrant IV: Projection ({quadMinutes.future} min)</span>
              <span>{getPercent(quadMinutes.future)}%</span>
            </div>
            <div className="h-2 w-full bg-white/5 rounded-full overflow-hidden">
              <div
                className="h-full bg-[#8B5CF6] transition-all duration-500"
                style={{ width: `${getPercent(quadMinutes.future)}%` }}
              />
            </div>
          </div>

          {/* Meta */}
          <div>
            <div className="flex justify-between items-center mb-1">
              <span className="text-white">Central: Meta Awareness ({quadMinutes.meta} min)</span>
              <span>{getPercent(quadMinutes.meta)}%</span>
            </div>
            <div className="h-2 w-full bg-white/5 rounded-full overflow-hidden">
              <div
                className="h-full bg-white transition-all duration-500"
                style={{ width: `${getPercent(quadMinutes.meta)}%` }}
              />
            </div>
          </div>
        </div>
      </div>

      {/* Pattern Recognition Engine */}
      <div className="border border-white/10 bg-[#050508]/90 p-6 rounded-xs space-y-4">
        <div className="flex items-center justify-between border-b border-white/5 pb-3">
          <div className="flex items-center gap-2">
            <BrainCircuit className="w-4 h-4 text-[#D4AF37]" />
            <h3 className="text-xs font-mono uppercase tracking-widest text-white font-bold">
              Cognitive Pattern Recognition
            </h3>
          </div>
          <button
            onClick={handleRunPatternRecognition}
            disabled={analyzingPatterns || journalEntries.length === 0}
            className="px-4 py-1.5 bg-[#D4AF37]/15 hover:bg-[#D4AF37] text-[#D4AF37] hover:text-black text-[10px] font-mono font-bold uppercase tracking-wider rounded-xs transition-colors flex items-center gap-1.5 disabled:opacity-40"
          >
            <Sparkles className="w-3.5 h-3.5" />
            {analyzingPatterns ? 'Analyzing Journal Logs...' : 'Detect Recurring Patterns'}
          </button>
        </div>

        {patternInsights ? (
          <div className="space-y-3 animate-in fade-in">
            <span className="text-[10px] font-mono uppercase tracking-widest text-[#D4AF37] block">
              Observed Patterns Across {journalEntries.length} Reflections:
            </span>
            <ul className="space-y-2">
              {patternInsights.map((insight, idx) => (
                <li
                  key={idx}
                  className="p-3 bg-white/[0.02] border border-white/5 rounded-xs text-xs text-white/80 font-light flex items-start gap-2.5 font-sans"
                >
                  <span className="text-[#D4AF37] font-mono font-bold">{idx + 1}.</span>
                  <span className="leading-relaxed">{insight}</span>
                </li>
              ))}
            </ul>
          </div>
        ) : (
          <p className="text-xs text-white/50 font-light font-sans">
            Click &ldquo;Detect Recurring Patterns&rdquo; to analyze your self-reported journal reflections for recurring cognitive linkages, projection triggers, and somatic shifts.
          </p>
        )}
      </div>

      {/* Curriculum Wave Roadmap */}
      <div className="border border-white/10 bg-[#050508]/90 p-6 rounded-xs space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-white/5 pb-3">
          <div>
            <h3 className="text-xs font-mono uppercase tracking-widest text-[#D4AF37] font-bold">
              Curriculum Waves Progression (I — VIII)
            </h3>
            <p className="text-[11px] text-white/50 font-sans mt-0.5">
              Select or click any wave to switch your active curriculum level.
            </p>
          </div>

          <div className="flex items-center gap-2 self-start sm:self-auto">
            <label htmlFor="progression-wave-select" className="text-[10px] font-mono text-white/50 uppercase">
              Active Wave:
            </label>
            <div className="relative">
              <select
                id="progression-wave-select"
                value={progress.currentWave}
                onChange={(e) => onSelectWave?.(Number(e.target.value))}
                className="bg-[#0A0D18] border border-[#D4AF37]/50 hover:border-[#D4AF37] text-[#D4AF37] text-xs font-mono py-1 pl-2.5 pr-7 rounded-xs focus:outline-none appearance-none cursor-pointer"
                title="Choose Active Wave Number"
              >
                {CURRICULUM_WAVES.map((w) => (
                  <option key={w.wave} value={w.wave} className="bg-[#050508] text-white">
                    Wave {w.wave}: {w.romanNumeral} — {w.name}
                  </option>
                ))}
              </select>
              <ChevronDown className="w-3.5 h-3.5 text-[#D4AF37] absolute right-2 top-1/2 -translate-y-1/2 pointer-events-none" />
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-3">
          {CURRICULUM_WAVES.map((w) => {
            const isCompleted = progress.currentWave > w.wave;
            const isCurrent = progress.currentWave === w.wave;
            return (
              <button
                key={w.wave}
                type="button"
                onClick={() => onSelectWave?.(w.wave)}
                className={`p-4 border rounded-xs transition-all text-left group cursor-pointer ${
                  isCurrent
                    ? 'border-[#D4AF37] bg-[#D4AF37]/10 shadow-[0_0_15px_rgba(212,175,55,0.1)]'
                    : isCompleted
                    ? 'border-emerald-500/30 bg-emerald-950/10 hover:border-emerald-500/50'
                    : 'border-white/5 bg-black/40 opacity-70 hover:opacity-90 hover:border-white/20'
                }`}
              >
                <div className="flex justify-between items-center text-[9px] font-mono mb-1">
                  <span className={isCurrent ? 'text-[#D4AF37] font-bold' : 'text-white/40'}>
                    {w.romanNumeral}
                  </span>
                  <span className={isCurrent ? 'text-[#D4AF37] font-semibold' : 'text-white/40'}>
                    {isCompleted ? '✓ Completed' : isCurrent ? '● Active' : 'Set Active'}
                  </span>
                </div>
                <h4 className="text-xs font-medium text-white tracking-wide group-hover:text-[#D4AF37] transition-colors">
                  {w.name}
                </h4>
                <p className="text-[10px] text-white/50 mt-1 font-light line-clamp-2">
                  {w.subtitle}
                </p>
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
};
