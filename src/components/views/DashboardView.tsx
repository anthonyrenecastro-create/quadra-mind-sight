import React, { useState, useEffect } from 'react';
import { QuadraOrbVisualizer } from '../QuadraOrbVisualizer';
import { DailyAffirmationBanner } from '../DailyAffirmationBanner';
import { QuadrantKey, SightAllocation, JournalEntry, CurriculumWave, QuadraExercise, SpatialPosition } from '../../types';
import { CURRICULUM_WAVES } from '../../data/curriculumData';
import { Play, Sparkles, BookOpen, Compass, Radio, ArrowRight, MessageSquareCode, ChevronDown, Volume2, ArrowLeftRight, Headphones } from 'lucide-react';
import { audioEngine } from '../../audio/AudioEngine';

interface DashboardViewProps {
  sight: SightAllocation;
  onSightChange: (sight: SightAllocation) => void;
  onStartExercise: (exerciseId: string) => void;
  onNavigate: (view: any) => void;
  recentJournals: JournalEntry[];
  currentWave: CurriculumWave;
  onSelectWave?: (waveNumber: number) => void;
  allExercises: QuadraExercise[];
  onLogQuickInsight: (text: string, quadrant: QuadrantKey) => void;
}

export const DashboardView: React.FC<DashboardViewProps> = ({
  sight,
  onSightChange,
  onStartExercise,
  onNavigate,
  recentJournals,
  currentWave,
  onSelectWave,
  allExercises,
  onLogQuickInsight,
}) => {
  const [activeQuadrant, setActiveQuadrant] = useState<QuadrantKey>('memory');
  const [quickInsightText, setQuickInsightText] = useState('');
  const [insightLoggedToast, setInsightLoggedToast] = useState(false);
  const [audioConfig, setAudioConfig] = useState(() => audioEngine.getConfig());

  useEffect(() => {
    const unsub = audioEngine.subscribe((cfg) => setAudioConfig({ ...cfg }));
    return () => unsub();
  }, []);

  const handleQuadrantClick = (q: QuadrantKey) => {
    setActiveQuadrant(q);
    audioEngine.previewQuadrantCue(q);
  };

  const handleReflectOnQuote = (promptPrefix: string, quadrant: QuadrantKey) => {
    setActiveQuadrant(quadrant);
    setQuickInsightText(promptPrefix);
    const textarea = document.getElementById('dash-quick-insight-textarea') as HTMLTextAreaElement | null;
    if (textarea) {
      textarea.focus();
      textarea.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
    }
  };

  const handleLogInsight = () => {
    if (!quickInsightText.trim()) return;
    onLogQuickInsight(quickInsightText, activeQuadrant);
    setQuickInsightText('');
    setInsightLoggedToast(true);
    setTimeout(() => setInsightLoggedToast(false), 2500);
  };

  const getFacilitatorPromptForQuadrant = (q: QuadrantKey): string => {
    switch (q) {
      case 'memory':
        return 'Observe what appears in the quadrant of Memory. Don\'t search aggressively. Notice what fragment surfaces: What brought you here?';
      case 'meaning':
        return 'What emotional significance does this hold? Distinguish the objective event from the narrative meaning you constructed around it.';
      case 'present':
        return 'Anchor completely in bodily sensation. Where do you feel this physical response in your chest, throat, or breath right now?';
      case 'future':
        return 'Notice what predictive simulation your mind constructs. Treat it purely as an imaginative model: What could happen next?';
      case 'meta':
      default:
        return 'What remains when you observe all four streams at once? Who or what is the unmoving witness observing memory, meaning, embodiment, and projection?';
    }
  };

  return (
    <div id="dashboard-view" className="flex-1 flex flex-col xl:flex-row overflow-y-auto xl:overflow-hidden relative touch-scroll">
      {/* Background Subtle Cosmic Glow */}
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,_#121225_0%,_transparent_75%)] pointer-events-none" />
      <div
        className="absolute inset-0 opacity-10 pointer-events-none"
        style={{
          backgroundImage: 'radial-gradient(#fff 1px, transparent 1px)',
          backgroundSize: '40px 40px',
        }}
      />

      {/* Main Center Stage: 4-Quadrant Visualizer & Primary Controls */}
      <section
        id="dashboard-center-stage"
        className="flex-1 flex flex-col items-center justify-between p-3 sm:p-8 xl:overflow-y-auto relative z-10"
      >
        {/* Top Quick Actions Bar */}
        <div className="w-full max-w-2xl flex flex-wrap items-center justify-between gap-2.5 pb-3 sm:pb-4 border-b border-white/5">
          <div className="flex items-center gap-2">
            <span className="text-[10px] font-mono uppercase tracking-[0.2em] text-[#D4AF37]">
              Consciousness Instrument
            </span>
            <span className="text-white/20">/</span>
            <span className="text-[10px] font-mono text-white/50 tracking-wider">
              {currentWave.romanNumeral}
            </span>
          </div>

          <div className="flex items-center gap-2.5">
            <button
              id="dash-quick-quadra-sync-btn"
              onClick={() => onStartExercise('quadra_sync')}
              className="px-3.5 py-1.5 border border-[#D4AF37]/50 bg-[#D4AF37]/10 hover:bg-[#D4AF37]/20 text-[#D4AF37] text-[10px] font-bold tracking-widest uppercase transition-all rounded-xs flex items-center gap-1.5"
            >
              <Radio className="w-3 h-3" />
              Start Quadra Sync
            </button>
            <button
              id="dash-quick-all-exercises-btn"
              onClick={() => onNavigate('exercises')}
              className="px-3 py-1.5 border border-white/10 hover:border-white/30 text-white/70 hover:text-white text-[10px] font-mono tracking-wider uppercase transition-colors rounded-xs flex items-center gap-1.5"
            >
              <Play className="w-2.5 h-2.5" />
              All Exercises
            </button>
          </div>
        </div>

        {/* Daily Mindful Affirmation Generator */}
        <div className="w-full max-w-2xl mt-4 mb-1">
          <DailyAffirmationBanner onReflectOnQuote={handleReflectOnQuote} />
        </div>

        {/* Central Rotating Orb Visualizer */}
        <div className="my-6 w-full flex items-center justify-center">
          <QuadraOrbVisualizer
            sight={sight}
            activeQuadrant={activeQuadrant}
            onQuadrantClick={handleQuadrantClick}
            facilitatorPrompt={getFacilitatorPromptForQuadrant(activeQuadrant)}
          />
        </div>

        {/* Spatial Audio Region Control & Orientation Status */}
        <div className="w-full max-w-2xl mb-6 p-3 sm:p-4 border border-white/10 bg-[#05050a]/90 backdrop-blur-sm rounded-xs flex flex-col sm:flex-row items-center justify-between gap-3">
          <div className="flex items-center gap-3 w-full sm:w-auto">
            <div className="w-8 h-8 rounded-full border border-[#D4AF37]/40 bg-[#D4AF37]/10 flex items-center justify-center shrink-0">
              <Headphones className="w-4 h-4 text-[#D4AF37]" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-[9px] font-mono uppercase tracking-[0.2em] text-white/50 font-bold">
                  Spatial Sound Region:
                </span>
                <span className="text-[10px] font-mono font-bold text-[#D4AF37] uppercase">
                  {activeQuadrant === 'memory' && '◄ LEFT FIELD (Memory / Q-I)'}
                  {activeQuadrant === 'future' && 'RIGHT FIELD ► (Projection / Q-IV)'}
                  {activeQuadrant === 'present' && '▲ FRONTAL (Embodiment / Q-III)'}
                  {activeQuadrant === 'meaning' && '▼ DORSAL / BACK (Meaning / Q-II)'}
                  {activeQuadrant === 'meta' && '◎ 360° GYRO ORBIT (Meta Awareness)'}
                </span>
              </div>
              <p className="text-[10px] text-white/40 font-light mt-0.5">
                {activeQuadrant === 'memory' && 'Panned left (-0.95) with contralateral ear attenuation.'}
                {activeQuadrant === 'future' && 'Panned right (+0.95) with contralateral ear attenuation.'}
                {activeQuadrant === 'present' && 'Anterior Horizon: 3D frontal HRTF with +5.5dB presence boost.'}
                {activeQuadrant === 'meaning' && 'Dorsal Occipital: 3D rear HRTF with 340Hz pinna shadow & 16ms Haas delay.'}
                {activeQuadrant === 'meta' && '360° Gyroscopic orbit rotating through Front, Right, Back, and Left.'}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2 w-full sm:w-auto justify-end">
            <button
              onClick={() => audioEngine.previewQuadrantCue(activeQuadrant)}
              className="px-2.5 py-1.5 border border-[#D4AF37]/40 bg-[#D4AF37]/10 hover:bg-[#D4AF37]/25 text-[#D4AF37] text-[10px] font-mono uppercase tracking-wider rounded-xs transition-all flex items-center gap-1.5"
              title="Audition the spatial sound position for this quadrant"
            >
              <Volume2 className="w-3 h-3" />
              Hear Cue
            </button>
            <button
              onClick={() => audioEngine.toggleSwapChannels()}
              className={`px-2.5 py-1.5 border text-[10px] font-mono uppercase tracking-wider rounded-xs transition-all flex items-center gap-1.5 ${
                audioConfig.swapChannels
                  ? 'border-amber-400 bg-amber-950/40 text-amber-300'
                  : 'border-white/10 bg-white/5 hover:border-white/25 text-white/70'
              }`}
              title="Invert Left and Right channels if your headphones or earbuds are reversed"
            >
              <ArrowLeftRight className="w-3 h-3" />
              {audioConfig.swapChannels ? 'Channels: Swapped (R⇄L)' : 'Channels: Standard'}
            </button>
          </div>
        </div>

        {/* Bottom Feature Teaser Grid */}
        <div className="w-full max-w-2xl grid grid-cols-1 sm:grid-cols-3 gap-3 pt-4 border-t border-white/5">
          <div
            onClick={() => onNavigate('quadra_solve')}
            className="p-3 border border-white/5 bg-white/[0.02] hover:bg-white/[0.04] hover:border-white/15 cursor-pointer transition-all rounded-xs"
          >
            <span className="text-[9px] uppercase tracking-widest text-[#D4AF37] font-bold block mb-1 font-mono">
              Practical Mode
            </span>
            <h4 className="text-xs font-light text-white tracking-wider">QUADRA SOLVE</h4>
            <p className="text-[10px] text-white/40 mt-1 leading-relaxed">
              Examine real-world dilemmas through Past, Meaning, Present, Future & Meta synthesis.
            </p>
          </div>

          <div
            onClick={() => onNavigate('interpersonal')}
            className="p-3 border border-white/5 bg-white/[0.02] hover:bg-white/[0.04] hover:border-white/15 cursor-pointer transition-all rounded-xs"
          >
            <span className="text-[9px] uppercase tracking-widest text-[#8B5CF6] font-bold block mb-1 font-mono">
              Relational Dialectic
            </span>
            <h4 className="text-xs font-light text-white tracking-wider">INTERPERSONAL</h4>
            <p className="text-[10px] text-white/40 mt-1 leading-relaxed">
              Separate facts from narrative interpretations in conversations & relationships.
            </p>
          </div>

          <div
            onClick={() => onNavigate('sight')}
            className="p-3 border border-white/5 bg-white/[0.02] hover:bg-white/[0.04] hover:border-white/15 cursor-pointer transition-all rounded-xs"
          >
            <span className="text-[9px] uppercase tracking-widest text-[#10B981] font-bold block mb-1 font-mono">
              Attention Allocation
            </span>
            <h4 className="text-xs font-light text-white tracking-wider">THE SIGHT</h4>
            <p className="text-[10px] text-white/40 mt-1 leading-relaxed">
              Visualize your 4-quadrant cognitive distribution & self-reported awareness.
            </p>
          </div>
        </div>
      </section>

      {/* Right Sidebar: Active Facilitator Log & Journal Peek */}
      <aside
        id="dashboard-right-panel"
        className="w-full xl:w-80 border-t xl:border-t-0 xl:border-l border-white/5 bg-[#050508]/85 p-4 sm:p-6 flex flex-col gap-6 shrink-0 z-20 backdrop-blur-sm xl:overflow-y-auto"
      >
        {/* Facilitator Status */}
        <div className="flex items-center justify-between border-b border-white/5 pb-3">
          <div className="flex items-center gap-2">
            <div className="w-2 h-2 rounded-full bg-[#D4AF37] animate-pulse" />
            <h4 className="text-[10px] font-bold tracking-widest text-white/70 uppercase font-mono">
              Facilitator Active
            </h4>
          </div>
          <button
            onClick={() => onNavigate('facilitator')}
            className="text-[9.5px] font-mono text-[#D4AF37] hover:underline uppercase flex items-center gap-1"
          >
            Full Dialogue <ArrowRight className="w-2.5 h-2.5" />
          </button>
        </div>

        {/* Dynamic Socratic Prompts Feed */}
        <div className="space-y-3 text-xs leading-relaxed">
          <div className="bg-white/5 p-3.5 border border-white/10 rounded-xs">
            <div className="flex items-center justify-between text-white/40 mb-1.5 font-mono text-[9px] uppercase">
              <span>Quadrant Focus</span>
              <span className="text-[#D4AF37] font-bold">{activeQuadrant.toUpperCase()}</span>
            </div>
            <p className="text-white/90 font-light">
              {activeQuadrant === 'memory' &&
                'Focus on the sensory fragment that emerged. Is it visual, auditory, or somatic? Observe without forcing a story.'}
              {activeQuadrant === 'meaning' &&
                'Notice the emotional interpretation. What implicit belief makes this memory matter so intensely to you?'}
              {activeQuadrant === 'present' &&
                'Notice your physical chest and posture. What bodily tension or expansion is active right now?'}
              {activeQuadrant === 'future' &&
                'Examine the simulation your mind is projecting. What if you constructed an alternative, benign simulation?'}
              {activeQuadrant === 'meta' &&
                'Rest in the awareness that observes all four quadrants. Notice: awareness itself has no boundary.'}
            </p>
          </div>

          <div className="p-3 border border-white/10 rounded-xs bg-black/50 space-y-2">
            <div className="flex items-center justify-between gap-2">
              <span className="text-[9px] font-mono text-white/40 uppercase tracking-wider block">
                Active Curriculum Wave
              </span>
              <div className="relative">
                <select
                  id="dashboard-curriculum-wave-select"
                  value={currentWave.wave}
                  onChange={(e) => onSelectWave?.(Number(e.target.value))}
                  className="bg-[#050508] border border-[#D4AF37]/50 hover:border-[#D4AF37] text-[#D4AF37] text-[11px] font-mono py-1 pl-2 pr-6 rounded-xs focus:outline-none focus:ring-1 focus:ring-[#D4AF37] appearance-none cursor-pointer tracking-wider"
                  title="Choose Wave Number"
                >
                  {CURRICULUM_WAVES.map((w) => (
                    <option key={w.wave} value={w.wave} className="bg-[#0A0D18] text-white">
                      Wave {w.wave}: {w.romanNumeral} — {w.name}
                    </option>
                  ))}
                </select>
                <ChevronDown className="w-3 h-3 text-[#D4AF37] absolute right-1.5 top-1/2 -translate-y-1/2 pointer-events-none" />
              </div>
            </div>
            <div>
              <p className="text-xs text-white font-medium flex items-center gap-1.5">
                <span className="text-[#D4AF37] font-mono font-bold">{currentWave.romanNumeral}:</span>
                <span>{currentWave.name}</span>
                <span className="text-white/40 text-[11px] font-normal hidden sm:inline">— {currentWave.subtitle}</span>
              </p>
              <p className="text-[10px] text-white/50 mt-1 leading-relaxed">{currentWave.description}</p>
            </div>
          </div>
        </div>

        {/* Fast Insight Logger */}
        <div className="mt-auto pt-4 border-t border-white/5">
          <span className="text-[9px] font-mono text-white/40 uppercase tracking-widest block mb-2">
            Log Metacognitive Insight
          </span>
          <div className="bg-black border border-white/10 p-3 flex flex-col rounded-xs">
            <textarea
              id="dash-quick-insight-textarea"
              value={quickInsightText}
              onChange={(e) => setQuickInsightText(e.target.value)}
              className="bg-transparent text-white border-none focus:outline-hidden focus:ring-0 resize-none h-20 text-xs placeholder:text-white/20 font-sans"
              placeholder={`Record observation for ${activeQuadrant.toUpperCase()}...`}
            />
            <div className="flex items-center justify-between pt-2 border-t border-white/5">
              <span className="text-[8.5px] font-mono text-white/30">
                Target: {activeQuadrant.toUpperCase()}
              </span>
              <button
                id="dash-log-insight-btn"
                onClick={handleLogInsight}
                className="text-[9.5px] font-bold uppercase tracking-widest text-[#D4AF37] hover:text-white transition-colors"
              >
                Log Insight
              </button>
            </div>
          </div>
          {insightLoggedToast && (
            <div className="mt-2 text-center text-[10px] font-mono text-emerald-400 bg-emerald-950/30 border border-emerald-800/40 py-1 rounded-xs">
              Saved to Consciousness Journal!
            </div>
          )}
        </div>

        {/* Recent Journal Mini-Preview */}
        <div className="space-y-2">
          <div className="flex items-center justify-between text-[9px] font-mono uppercase tracking-widest text-white/40">
            <span>Recent Reflections</span>
            <button
              onClick={() => onNavigate('journal')}
              className="text-[#D4AF37] hover:underline"
            >
              View Journal
            </button>
          </div>
          {recentJournals.slice(0, 2).map((j) => (
            <div
              key={j.id}
              onClick={() => onNavigate('journal')}
              className="p-2.5 border border-white/5 bg-white/[0.01] hover:bg-white/[0.03] cursor-pointer rounded-xs"
            >
              <div className="flex justify-between text-[9px] font-mono text-white/40">
                <span className="text-white/80 font-medium">{j.exerciseTitle}</span>
                <span>{j.dateStr}</span>
              </div>
              <p className="text-[11px] text-white/60 line-clamp-2 mt-1 italic">
                &ldquo;{j.integration || j.unexpectedObservation || j.memory}&rdquo;
              </p>
            </div>
          ))}
        </div>
      </aside>
    </div>
  );
};
