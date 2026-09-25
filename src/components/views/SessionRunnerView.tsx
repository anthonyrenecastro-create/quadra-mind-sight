import React, { useState, useEffect, useRef } from 'react';
import { QuadraExercise, QuadrantKey, SightAllocation, JournalEntry } from '../../types';
import { audioEngine } from '../../audio/AudioEngine';
import { authenticatedFetch } from '../../services/api';
import { QuadraOrbVisualizer } from '../QuadraOrbVisualizer';
import {
  Play,
  Pause,
  SkipForward,
  SkipBack,
  ShieldAlert,
  Send,
  Sparkles,
  CheckCircle2,
  Clock,
  Sliders,
  Volume2
} from 'lucide-react';

interface SessionRunnerViewProps {
  exercise: QuadraExercise;
  sight: SightAllocation;
  onSightChange: (sight: SightAllocation) => void;
  onFinishSession: (entry: Partial<JournalEntry>) => void;
  onExitSession: () => void;
  onOpenGroundModal: () => void;
}

export const SessionRunnerView: React.FC<SessionRunnerViewProps> = ({
  exercise,
  sight,
  onSightChange,
  onFinishSession,
  onExitSession,
  onOpenGroundModal,
}) => {
  // Session Configuration & Progression
  const [selectedDurationMinutes, setSelectedDurationMinutes] = useState(
    Math.round(exercise.duration / 60)
  );
  const [sessionStarted, setSessionStarted] = useState(false);
  const [currentPhaseIndex, setCurrentPhaseIndex] = useState(0);
  const [phaseSecondsRemaining, setPhaseSecondsRemaining] = useState(60);
  const [isPaused, setIsPaused] = useState(false);
  const [totalElapsedSeconds, setTotalElapsedSeconds] = useState(0);

  // Journal Reflection Inputs during / after session
  const [stateBefore, setStateBefore] = useState('');
  const [stateAfter, setStateAfter] = useState('');
  const [observationInput, setObservationInput] = useState('');
  const [memoryNote, setMemoryNote] = useState('');
  const [meaningNote, setMeaningNote] = useState('');
  const [presentNote, setPresentNote] = useState('');
  const [futureNote, setFutureNote] = useState('');
  const [unexpectedNote, setUnexpectedNote] = useState('');
  const [integrationNote, setIntegrationNote] = useState('');
  const [sessionRating, setSessionRating] = useState(5);

  // Dynamic Facilitator dialogue inside session
  const [facilitatorChat, setFacilitatorChat] = useState<
    { sender: 'facilitator' | 'user'; text: string; time: string }[]
  >([]);
  const [isConsultingAi, setIsConsultingAi] = useState(false);

  const [isCompleted, setIsCompleted] = useState(false);
  const [showMobileFacilitator, setShowMobileFacilitator] = useState(false);

  const currentPhase = exercise.phases[currentPhaseIndex] || exercise.phases[0];

  // Initialize phase
  const setupPhase = (index: number) => {
    const phase = exercise.phases[index];
    if (!phase) return;
    setCurrentPhaseIndex(index);

    // Calculate proportional phase duration based on user selected total duration
    const totalOriginalPhaseDuration = exercise.phases.reduce((acc, p) => acc + p.duration, 0);
    const scale = (selectedDurationMinutes * 60) / (totalOriginalPhaseDuration || 600);
    const scaledSeconds = Math.max(20, Math.round(phase.duration * scale));

    setPhaseSecondsRemaining(scaledSeconds);

    // Auto-switch audio preset if specified by phase
    if (phase.audioPreset) {
      audioEngine.setPreset(phase.audioPreset);
    }

    // Dynamically orient the spatial audio engine to the active quadrant
    if (phase.quadrant) {
      audioEngine.previewQuadrantCue(phase.quadrant);
    }

    // Add facilitator introductory prompt to dialogue
    setFacilitatorChat((prev) => [
      ...prev,
      {
        sender: 'facilitator',
        text: phase.facilitatorPrompt,
        time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      },
    ]);
  };

  const handleStartSession = async () => {
    setSessionStarted(true);
    await audioEngine.start();
    setupPhase(0);
  };

  // Timer loop
  useEffect(() => {
    if (!sessionStarted || isPaused || isCompleted) return;

    const timer = setInterval(() => {
      setTotalElapsedSeconds((prev) => prev + 1);
      setPhaseSecondsRemaining((prev) => Math.max(0, prev - 1));
    }, 1000);

    return () => clearInterval(timer);
  }, [sessionStarted, isPaused, isCompleted]);

  // Handle phase completion safely outside state updaters
  useEffect(() => {
    if (!sessionStarted || isPaused || isCompleted) return;

    if (phaseSecondsRemaining === 0) {
      if (currentPhaseIndex + 1 < exercise.phases.length) {
        setupPhase(currentPhaseIndex + 1);
      } else {
        setIsCompleted(true);
      }
    }
  }, [phaseSecondsRemaining, sessionStarted, isPaused, isCompleted, currentPhaseIndex, exercise.phases.length]);

  const handleNextPhase = () => {
    if (currentPhaseIndex + 1 < exercise.phases.length) {
      setupPhase(currentPhaseIndex + 1);
    } else {
      setIsCompleted(true);
    }
  };

  const handlePrevPhase = () => {
    if (currentPhaseIndex > 0) {
      setupPhase(currentPhaseIndex - 1);
    }
  };

  const handleSendObservation = async () => {
    if (!observationInput.trim() || isConsultingAi) return;

    const userText = observationInput.trim();
    setObservationInput('');

    // Update specific quadrant notes based on active quadrant
    if (currentPhase.quadrant === 'memory') setMemoryNote((prev) => (prev ? `${prev}; ${userText}` : userText));
    if (currentPhase.quadrant === 'meaning') setMeaningNote((prev) => (prev ? `${prev}; ${userText}` : userText));
    if (currentPhase.quadrant === 'present') setPresentNote((prev) => (prev ? `${prev}; ${userText}` : userText));
    if (currentPhase.quadrant === 'future') setFutureNote((prev) => (prev ? `${prev}; ${userText}` : userText));

    const newChat = [
      ...facilitatorChat,
      {
        sender: 'user' as const,
        text: userText,
        time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      },
    ];
    setFacilitatorChat(newChat);
    setIsConsultingAi(true);

    try {
      const response = await authenticatedFetch('/api/gemini/facilitator', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          message: userText,
          history: newChat.slice(-4),
          currentQuadrant: currentPhase.quadrant,
          userState: { exercise: exercise.title, phase: currentPhase.name },
        }),
      });
      const data = await response.json();
      setFacilitatorChat((prev) => [
        ...prev,
        {
          sender: 'facilitator',
          text: data.reply || data.fallback || 'Observe this experience without rushing to interpret it.',
          time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        },
      ]);
    } catch {
      setFacilitatorChat((prev) => [
        ...prev,
        {
          sender: 'facilitator',
          text: 'Notice this observation in your awareness. Does it belong to memory, meaning, present sensation, or future prediction?',
          time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        },
      ]);
    } finally {
      setIsConsultingAi(false);
    }
  };

  const handleSaveAndComplete = () => {
    onFinishSession({
      exerciseId: exercise.id,
      exerciseTitle: exercise.title,
      durationSeconds: totalElapsedSeconds,
      stateBefore: stateBefore || 'Focused contemplation',
      stateAfter: stateAfter || 'Grounded stillness',
      memory: memoryNote || 'Autobiographical sensory cue observed.',
      meaning: meaningNote || 'Salience uncoupled from emotional over-reaction.',
      presentSensation: presentNote || 'Deepened diaphragmatic breath and relaxed somatic posture.',
      possibleFuture: futureNote || 'Multiple candidate trajectories simulated without anxiety.',
      unexpectedObservation: unexpectedNote || 'Observation retained clarity as perspectives shifted.',
      integration: integrationNote || 'The observer remains untouched by the four streams.',
      rating: sessionRating,
      quadrantFocus: currentPhase.quadrant,
      sightSnapshot: sight,
    });
  };

  const formatTime = (secs: number) => {
    const m = Math.floor(secs / 60);
    const s = secs % 60;
    return `${m}:${s < 10 ? '0' : ''}${s}`;
  };

  // Phase 0: Orientation Screen
  if (!sessionStarted) {
    return (
      <div id="session-orientation-view" className="flex-1 p-3 sm:p-12 overflow-y-auto max-w-4xl mx-auto flex flex-col justify-center touch-scroll">
        <div className="border border-white/10 bg-[#050508]/90 p-4 sm:p-10 rounded-xs shadow-2xl relative my-auto">
          <div className="flex items-center justify-between border-b border-white/10 pb-4 mb-4 sm:mb-6">
            <div>
              <span className="text-[9px] sm:text-[10px] font-mono uppercase tracking-[0.25em] text-[#D4AF37] block mb-1">
                Phase 0 — Orientation & Preparation
              </span>
              <h2 className="text-lg sm:text-2xl font-light text-white tracking-wide">
                {exercise.title}
              </h2>
            </div>
            <span className="text-[11px] sm:text-xs font-mono text-white/50 border border-white/10 px-2.5 py-1 rounded-xs">
              {exercise.waveName}
            </span>
          </div>

          <p className="text-xs sm:text-sm text-white/70 leading-relaxed font-light mb-4 sm:mb-6">
            {exercise.description}
          </p>

          {/* Exercise Key Socratic Question */}
          <div className="bg-[#0F111A] border-l-2 border-[#D4AF37] p-3 sm:p-4 mb-4 sm:mb-6">
            <span className="text-[8.5px] sm:text-[9px] uppercase tracking-widest text-[#D4AF37] font-mono block mb-1">
              Central Socratic Focus
            </span>
            <p className="text-xs sm:text-sm font-serif italic text-white/90">
              &ldquo;{exercise.keyQuestion}&rdquo;
            </p>
          </div>

          {/* Duration Selector */}
          <div className="mb-6 sm:mb-8">
            <span className="text-[11px] sm:text-xs uppercase tracking-wider font-mono text-white/50 block mb-2 sm:mb-3">
              Select Session Duration:
            </span>
            <div className="grid grid-cols-3 sm:grid-cols-5 gap-2 sm:gap-3">
              {[5, 10, 20, 30, 45].map((mins) => (
                <button
                  key={mins}
                  id={`duration-btn-${mins}m`}
                  onClick={() => setSelectedDurationMinutes(mins)}
                  className={`py-2.5 sm:py-3 px-2 sm:px-4 text-[11px] sm:text-xs font-mono tracking-wider uppercase border transition-all rounded-xs touch-manipulation ${
                    selectedDurationMinutes === mins
                      ? 'border-[#D4AF37] bg-[#D4AF37]/15 text-[#D4AF37] font-bold'
                      : 'border-white/10 hover:border-white/30 text-white/60 hover:text-white'
                  }`}
                >
                  {mins}m
                </button>
              ))}
            </div>
          </div>

          {/* State Before Check-in */}
          <div className="mb-8">
            <span className="text-xs uppercase tracking-wider font-mono text-white/50 block mb-2">
              State Before Beginning (Optional Baseline):
            </span>
            <input
              id="state-before-input"
              type="text"
              value={stateBefore}
              onChange={(e) => setStateBefore(e.target.value)}
              placeholder="e.g. Mild somatic tension in shoulders, racing thoughts regarding tomorrow's deadline..."
              className="w-full bg-black/60 border border-white/10 px-4 py-2.5 text-xs text-white placeholder:text-white/20 focus:border-[#D4AF37] focus:outline-hidden font-sans"
            />
          </div>

          {/* Start CTA */}
          <div className="flex flex-col sm:flex-row items-center justify-between gap-4 pt-6 border-t border-white/10">
            <button
              onClick={onExitSession}
              className="w-full sm:w-auto px-6 py-3 border border-white/10 text-white/60 hover:text-white text-xs font-mono uppercase tracking-wider transition-colors"
            >
              Cancel
            </button>
            <button
              id="begin-active-session-btn"
              onClick={handleStartSession}
              className="w-full sm:w-auto px-8 py-3.5 bg-[#D4AF37] hover:bg-[#E5C158] text-black text-xs font-bold tracking-[0.2em] uppercase transition-all shadow-[0_0_20px_rgba(212,175,55,0.3)] flex items-center justify-center gap-2"
            >
              <Play className="w-4 h-4 fill-current" />
              Begin Guided Session
            </button>
          </div>
        </div>
      </div>
    );
  }

  // Completed Screen: Post-Session Integration & Consciousness Journaling
  if (isCompleted) {
    return (
      <div id="session-completed-view" className="flex-1 p-3 sm:p-10 overflow-y-auto max-w-3xl mx-auto touch-scroll">
        <div className="border border-white/10 bg-[#050508] p-4 sm:p-8 rounded-xs shadow-2xl space-y-4 sm:space-y-6 my-auto">
          <div className="border-b border-white/10 pb-3 sm:pb-4 flex items-center justify-between">
            <div className="flex items-center gap-2.5 sm:gap-3">
              <CheckCircle2 className="w-5 h-5 sm:w-6 sm:h-6 text-[#D4AF37]" />
              <div>
                <span className="text-[9px] sm:text-[10px] font-mono text-[#D4AF37] uppercase tracking-widest block">
                  Session Completed
                </span>
                <h2 className="text-base sm:text-xl font-light text-white tracking-wide">
                  Post-Session Integration Journal
                </h2>
              </div>
            </div>
            <span className="text-[11px] sm:text-xs font-mono text-white/50">
              Total Time: {formatTime(totalElapsedSeconds)}
            </span>
          </div>

          <p className="text-xs text-white/60 leading-relaxed font-light">
            Record what was observed across each quadrant before the experience recedes.
            Every session refines your metacognitive discrimination.
          </p>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4 text-xs font-sans">
            <div>
              <label className="text-[9.5px] sm:text-[10px] font-mono text-[#D4AF37] uppercase tracking-wider block mb-1">
                Quadrant I — Memory Observed:
              </label>
              <textarea
                value={memoryNote}
                onChange={(e) => setMemoryNote(e.target.value)}
                placeholder="What sensory fragment or autobiographical pattern surfaced?"
                className="w-full bg-black/60 border border-white/10 p-2.5 text-white h-16 sm:h-20 resize-none rounded-xs focus:border-[#D4AF37] focus:outline-hidden"
              />
            </div>

            <div>
              <label className="text-[9.5px] sm:text-[10px] font-mono text-[#EF4444] uppercase tracking-wider block mb-1">
                Quadrant II — Meaning / Salience:
              </label>
              <textarea
                value={meaningNote}
                onChange={(e) => setMeaningNote(e.target.value)}
                placeholder="What emotional significance or assumption accompanied it?"
                className="w-full bg-black/60 border border-white/10 p-2.5 text-white h-16 sm:h-20 resize-none rounded-xs focus:border-[#EF4444] focus:outline-hidden"
              />
            </div>

            <div>
              <label className="text-[9.5px] sm:text-[10px] font-mono text-[#10B981] uppercase tracking-wider block mb-1">
                Quadrant III — Embodiment / Present Sensation:
              </label>
              <textarea
                value={presentNote}
                onChange={(e) => setPresentNote(e.target.value)}
                placeholder="Where in your body did you feel physical sensation?"
                className="w-full bg-black/60 border border-white/10 p-2.5 text-white h-16 sm:h-20 resize-none rounded-xs focus:border-[#10B981] focus:outline-hidden"
              />
            </div>

            <div>
              <label className="text-[9.5px] sm:text-[10px] font-mono text-[#8B5CF6] uppercase tracking-wider block mb-1">
                Quadrant IV — Projection / Future Simulation:
              </label>
              <textarea
                value={futureNote}
                onChange={(e) => setFutureNote(e.target.value)}
                placeholder="What predictive mental models or trajectories emerged?"
                className="w-full bg-black/60 border border-white/10 p-2.5 text-white h-16 sm:h-20 resize-none rounded-xs focus:border-[#8B5CF6] focus:outline-hidden"
              />
            </div>
          </div>

          <div className="space-y-3 pt-1 sm:pt-2 text-xs">
            <div>
              <label className="text-[9.5px] sm:text-[10px] font-mono text-white/50 uppercase tracking-wider block mb-1">
                Unexpected Observation:
              </label>
              <input
                type="text"
                value={unexpectedNote}
                onChange={(e) => setUnexpectedNote(e.target.value)}
                placeholder="Any unexpected shift in spatial attention or cognitive perspective..."
                className="w-full bg-black/60 border border-white/10 px-3 py-2 text-white rounded-xs focus:border-white/30 focus:outline-hidden"
              />
            </div>

            <div>
              <label className="text-[9.5px] sm:text-[10px] font-mono text-white/50 uppercase tracking-wider block mb-1">
                State After Completion:
              </label>
              <input
                type="text"
                value={stateAfter}
                onChange={(e) => setStateAfter(e.target.value)}
                placeholder="e.g. Grounded stillness, expansive clarity, calm heart rate..."
                className="w-full bg-black/60 border border-white/10 px-3 py-2 text-white rounded-xs focus:border-white/30 focus:outline-hidden"
              />
            </div>

            <div>
              <label className="text-[9.5px] sm:text-[10px] font-mono text-[#D4AF37] uppercase tracking-wider block mb-1">
                Core Meta Integration:
              </label>
              <textarea
                value={integrationNote}
                onChange={(e) => setIntegrationNote(e.target.value)}
                placeholder="What remains when you observe all four at once?"
                className="w-full bg-black/60 border border-white/10 p-2.5 text-white h-16 sm:h-20 resize-none rounded-xs focus:border-[#D4AF37] focus:outline-hidden"
              />
            </div>

            {/* Rating with touch targets */}
            <div className="flex flex-wrap items-center gap-3 pt-2">
              <span className="text-[10px] font-mono text-white/40 uppercase">Self-Rated Depth:</span>
              <div className="flex gap-2">
                {[1, 2, 3, 4, 5].map((num) => (
                  <button
                    key={num}
                    onClick={() => setSessionRating(num)}
                    className={`min-w-[40px] min-h-[40px] text-xs font-mono rounded-xs border transition-colors flex items-center justify-center touch-manipulation ${
                      sessionRating === num
                        ? 'border-[#D4AF37] bg-[#D4AF37] text-black font-bold'
                        : 'border-white/10 text-white/60 hover:text-white'
                    }`}
                  >
                    {num}
                  </button>
                ))}
              </div>
            </div>
          </div>

          <div className="flex items-center justify-end gap-4 pt-4 border-t border-white/10">
            <button
              id="save-session-journal-btn"
              onClick={handleSaveAndComplete}
              className="px-6 py-3 bg-[#D4AF37] text-black text-xs font-bold tracking-widest uppercase hover:bg-[#E5C158] transition-colors rounded-xs shadow-lg"
            >
              Commit to Consciousness Journal
            </button>
          </div>
        </div>
      </div>
    );
  }

  // Active Session Running View
  return (
    <div id="active-session-runner" className="flex-1 flex flex-col xl:flex-row overflow-hidden relative">
      {/* Left / Center Area: Visualizer, Phase Progress, Live Audio Sync */}
      <div className="flex-1 flex flex-col items-center justify-between p-4 sm:p-6 overflow-y-auto">
        {/* Top Phase Header & Timers */}
        <div className="w-full max-w-2xl flex items-center justify-between border-b border-white/10 pb-3">
          <div>
            <span className="text-[10px] font-mono uppercase tracking-widest text-[#D4AF37] block">
              {exercise.title} — Phase {currentPhaseIndex + 1} of {exercise.phases.length}
            </span>
            <h3 className="text-sm sm:text-base font-light text-white tracking-wide">
              {currentPhase.name}
            </h3>
          </div>

          <div className="flex items-center gap-4">
            <div className="flex flex-col items-end font-mono">
              <span className="text-[9px] uppercase tracking-wider text-white/40">Phase Timer</span>
              <span className="text-sm text-[#D4AF37] font-bold">
                {formatTime(phaseSecondsRemaining)}
              </span>
            </div>
            <div className="h-6 w-[1px] bg-white/10" />
            <div className="flex flex-col items-end font-mono">
              <span className="text-[9px] uppercase tracking-wider text-white/40">Elapsed</span>
              <span className="text-sm text-white">{formatTime(totalElapsedSeconds)}</span>
            </div>
          </div>
        </div>

        {/* Phase Step Bubbles */}
        <div className="w-full max-w-md flex items-center justify-between my-3 px-2">
          {exercise.phases.map((p, idx) => (
            <div
              key={idx}
              onClick={() => setupPhase(idx)}
              className="flex flex-col items-center cursor-pointer group"
            >
              <div
                className={`w-3 h-3 rounded-full transition-all ${
                  idx === currentPhaseIndex
                    ? 'bg-[#D4AF37] scale-125 ring-2 ring-[#D4AF37]/50'
                    : idx < currentPhaseIndex
                    ? 'bg-white/40'
                    : 'bg-white/10'
                }`}
              />
              <span className="text-[7.5px] font-mono text-white/30 uppercase mt-1 hidden sm:block">
                P{idx + 1}
              </span>
            </div>
          ))}
        </div>

        {/* Central Visualizer */}
        <div className="my-2 flex items-center justify-center">
          <QuadraOrbVisualizer
            sight={sight}
            activeQuadrant={currentPhase.quadrant}
            facilitatorPrompt={currentPhase.facilitatorPrompt}
          />
        </div>

        {/* Controls Bar: Prev, Play/Pause, Next, Ground */}
        <div className="w-full max-w-xl flex flex-wrap items-center justify-between gap-2 pt-3 border-t border-white/5">
          <div className="flex items-center gap-1.5 sm:gap-2">
            <button
              onClick={handlePrevPhase}
              disabled={currentPhaseIndex === 0}
              className="p-2 sm:p-2.5 border border-white/10 text-white/60 hover:text-white disabled:opacity-25 transition-colors rounded-xs touch-manipulation"
              title="Previous Phase"
            >
              <SkipBack className="w-4 h-4" />
            </button>

            <button
              onClick={() => setIsPaused(!isPaused)}
              className="px-3 sm:px-5 py-2 border border-white/20 hover:border-white/50 text-white text-[11px] sm:text-xs font-mono uppercase tracking-wider sm:tracking-widest flex items-center gap-1.5 sm:gap-2 rounded-xs touch-manipulation"
            >
              {isPaused ? <Play className="w-3.5 h-3.5 fill-current" /> : <Pause className="w-3.5 h-3.5" />}
              <span>{isPaused ? 'Resume' : 'Pause'}</span>
            </button>

            <button
              onClick={handleNextPhase}
              className="px-3 sm:px-5 py-2 bg-[#D4AF37] hover:bg-[#E5C158] text-black text-[11px] sm:text-xs font-bold font-mono uppercase tracking-wider sm:tracking-widest flex items-center gap-1.5 sm:gap-2 rounded-xs touch-manipulation shadow-md"
            >
              <span>Advance</span>
              <SkipForward className="w-3.5 h-3.5" />
            </button>
          </div>

          <div className="flex items-center gap-1.5 sm:gap-2">
            <button
              onClick={() => setShowMobileFacilitator(!showMobileFacilitator)}
              className="xl:hidden px-2.5 py-2 border border-[#D4AF37]/50 bg-[#D4AF37]/10 text-[#D4AF37] text-[10px] font-mono uppercase tracking-wider rounded-xs flex items-center gap-1 touch-manipulation"
              title="Toggle Dialogue"
            >
              <Sparkles className="w-3 h-3" />
              <span>{showMobileFacilitator ? 'Orb' : 'Dialogue'}</span>
            </button>

            <button
              onClick={onOpenGroundModal}
              className="px-2.5 sm:px-3 py-2 border border-red-900/60 text-red-400 hover:text-white hover:bg-red-950/30 text-[10px] font-mono uppercase tracking-wider rounded-xs flex items-center gap-1 touch-manipulation"
              title="Emergency Ground / Exit"
            >
              <ShieldAlert className="w-3.5 h-3.5" />
              <span className="hidden xs:inline">Ground</span>
            </button>
          </div>
        </div>
      </div>

      {/* Right Column: Live Socratic Facilitator Interaction */}
      <aside
        className={`${
          showMobileFacilitator ? 'flex' : 'hidden xl:flex'
        } w-full xl:w-96 border-t xl:border-t-0 xl:border-l border-white/10 bg-[#050508]/95 p-4 sm:p-6 flex-col justify-between shrink-0 z-20`}
      >
        <div className="flex items-center justify-between pb-3 border-b border-white/10">
          <div className="flex items-center gap-2">
            <Sparkles className="w-3.5 h-3.5 text-[#D4AF37]" />
            <h4 className="text-xs font-mono uppercase tracking-widest text-white/80">
              Facilitator Dialogue
            </h4>
          </div>
          <span className="text-[9px] font-mono text-[#D4AF37] uppercase">
            Active: {currentPhase.quadrant.toUpperCase()}
          </span>
        </div>

        {/* Chat Feed */}
        <div className="flex-1 overflow-y-auto my-4 space-y-3 pr-1 text-xs">
          {facilitatorChat.map((msg, idx) => (
            <div
              key={idx}
              className={`p-3 rounded-xs leading-relaxed ${
                msg.sender === 'facilitator'
                  ? 'bg-white/[0.04] border border-white/10 text-white/90 font-light'
                  : 'bg-[#D4AF37]/10 border border-[#D4AF37]/30 text-white ml-4'
              }`}
            >
              <div className="flex justify-between text-[8px] font-mono text-white/40 mb-1 uppercase tracking-wider">
                <span>{msg.sender === 'facilitator' ? 'M.I.N.D.S. Guide' : 'Observation'}</span>
                <span>{msg.time}</span>
              </div>
              <p>{msg.text}</p>
            </div>
          ))}
          {isConsultingAi && (
            <div className="p-3 bg-white/[0.02] border border-white/5 text-white/50 text-xs font-mono animate-pulse">
              Facilitator is formulating dialectic inquiry...
            </div>
          )}
        </div>

        {/* Input box */}
        <div className="pt-2 border-t border-white/10">
          <span className="text-[8.5px] font-mono uppercase tracking-widest text-white/40 block mb-1.5">
            Record Immediate Sensation or Thought:
          </span>
          <div className="flex gap-2">
            <input
              type="text"
              value={observationInput}
              onChange={(e) => setObservationInput(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && handleSendObservation()}
              placeholder="Describe observation..."
              className="flex-1 bg-black border border-white/15 px-3 py-2 text-xs text-white placeholder:text-white/25 focus:border-[#D4AF37] focus:outline-hidden font-sans"
            />
            <button
              onClick={handleSendObservation}
              disabled={isConsultingAi || !observationInput.trim()}
              className="px-3 bg-[#D4AF37] text-black hover:bg-[#E5C158] disabled:opacity-40 transition-colors"
            >
              <Send className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      </aside>
    </div>
  );
};
