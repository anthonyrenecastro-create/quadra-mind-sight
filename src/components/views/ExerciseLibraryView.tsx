import React, { useState } from 'react';
import { QuadraExercise, CurriculumWave } from '../../types';
import { CURRICULUM_WAVES } from '../../data/curriculumData';
import { Play, Sparkles, Filter, Clock, Compass, Layers, ChevronDown } from 'lucide-react';

interface ExerciseLibraryViewProps {
  exercises: QuadraExercise[];
  onStartExercise: (exerciseId: string) => void;
  currentWave?: CurriculumWave;
  onSelectActiveWave?: (waveNumber: number) => void;
}

export const ExerciseLibraryView: React.FC<ExerciseLibraryViewProps> = ({
  exercises,
  onStartExercise,
  currentWave,
  onSelectActiveWave,
}) => {
  const [selectedWave, setSelectedWave] = useState<number | 'all'>('all');
  const [searchQuery, setSearchQuery] = useState('');

  const filteredExercises = exercises.filter((ex) => {
    const matchesWave = selectedWave === 'all' || ex.wave === selectedWave;
    const matchesSearch =
      ex.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      ex.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
      ex.category.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesWave && matchesSearch;
  });

  return (
    <div id="exercise-library-view" className="flex-1 p-4 sm:p-8 overflow-y-auto space-y-6">
      {/* Header */}
      <div className="border-b border-white/10 pb-4 flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <span className="text-[10px] font-mono uppercase tracking-[0.25em] text-[#D4AF37] block mb-1">
            Curriculum Waves I — VIII
          </span>
          <h2 className="text-xl sm:text-2xl font-light text-white tracking-wide flex items-center gap-2">
            <Layers className="w-5 h-5 text-[#D4AF37]" />
            CONSCIOUSNESS EXERCISE LIBRARY
          </h2>
          <p className="text-xs text-white/60 mt-1 max-w-2xl font-light">
            20 progressive protocols spanning attention stabilization, autobiographical recall, predictive simulation, relational dialectics, and non-dual witnessing.
          </p>
        </div>

        {/* Search */}
        <input
          type="text"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          placeholder="Search by title, theme, or category..."
          className="bg-black border border-white/15 px-3 py-2 text-xs text-white placeholder:text-white/30 rounded-xs focus:border-[#D4AF37] focus:outline-hidden font-sans w-full md:w-64"
        />
      </div>

      {/* Wave Selector Controls & Dropdown */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 bg-[#0A0D18] p-3 border border-white/10 rounded-xs">
        <div className="flex items-center gap-2.5 flex-1 max-w-md">
          <label htmlFor="exercise-wave-dropdown" className="text-[11px] font-mono uppercase tracking-wider text-white/60 flex items-center gap-1.5 shrink-0">
            <Filter className="w-3.5 h-3.5 text-[#D4AF37]" />
            <span>Choose Wave:</span>
          </label>
          <div className="relative flex-1">
            <select
              id="exercise-wave-dropdown"
              value={selectedWave}
              onChange={(e) => setSelectedWave(e.target.value === 'all' ? 'all' : Number(e.target.value))}
              className="w-full bg-[#050508] border border-[#D4AF37]/40 hover:border-[#D4AF37] text-[#D4AF37] text-xs font-mono py-1.5 pl-2.5 pr-7 rounded-xs focus:outline-none focus:ring-1 focus:ring-[#D4AF37] appearance-none cursor-pointer tracking-wider transition-colors"
              title="Choose Wave Number Dropdown"
            >
              <option value="all" className="bg-[#0A0D18] text-white">All Waves (I — VIII) • 20 Protocols</option>
              {CURRICULUM_WAVES.map((w) => (
                <option key={w.wave} value={w.wave} className="bg-[#0A0D18] text-white">
                  Wave {w.wave}: {w.romanNumeral} — {w.name}
                </option>
              ))}
            </select>
            <ChevronDown className="w-3.5 h-3.5 text-[#D4AF37] absolute right-2 top-1/2 -translate-y-1/2 pointer-events-none" />
          </div>
        </div>

        {currentWave && (
          <div className="flex items-center gap-2 text-xs font-mono shrink-0">
            <span className="text-white/40 text-[10.5px] uppercase">Practitioner Wave:</span>
            <button
              type="button"
              onClick={() => setSelectedWave(currentWave.wave)}
              className="px-2.5 py-1 border border-[#D4AF37]/50 bg-[#D4AF37]/10 text-[#D4AF37] text-[10.5px] font-mono uppercase tracking-wider hover:bg-[#D4AF37]/20 transition-all rounded-xs flex items-center gap-1.5"
              title="Filter to your current active wave"
            >
              <Sparkles className="w-3 h-3" />
              <span>Wave {currentWave.wave} ({currentWave.name})</span>
            </button>
          </div>
        )}
      </div>

      {/* Wave Filter Chips */}
      <div className="flex items-center gap-2 overflow-x-auto pb-2 scrollbar-thin">
        <button
          onClick={() => setSelectedWave('all')}
          className={`px-3 py-1.5 text-[10px] font-mono uppercase tracking-wider rounded-xs whitespace-nowrap transition-colors ${
            selectedWave === 'all'
              ? 'bg-[#D4AF37] text-black font-bold'
              : 'border border-white/10 text-white/60 hover:text-white'
          }`}
        >
          All Waves (20)
        </button>
        {CURRICULUM_WAVES.map((w) => (
          <button
            key={w.wave}
            onClick={() => setSelectedWave(w.wave)}
            className={`px-3 py-1.5 text-[10px] font-mono uppercase tracking-wider rounded-xs whitespace-nowrap transition-colors ${
              selectedWave === w.wave
                ? 'bg-[#D4AF37] text-black font-bold'
                : 'border border-white/10 text-white/60 hover:text-white'
            }`}
          >
            {w.romanNumeral} — {w.name}
          </button>
        ))}
      </div>

      {/* Exercises Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
        {filteredExercises.map((ex) => (
          <div
            key={ex.id}
            className="border border-white/10 bg-[#050508]/80 hover:bg-white/[0.03] hover:border-white/20 transition-all p-5 rounded-xs flex flex-col justify-between group shadow-lg"
          >
            <div>
              {/* Card Meta Top */}
              <div className="flex items-center justify-between text-[9px] font-mono text-white/40 mb-2 uppercase">
                <span className="text-[#D4AF37] font-semibold">{ex.waveName}</span>
                <span className="flex items-center gap-1">
                  <Clock className="w-3 h-3" />
                  {Math.round(ex.duration / 60)} min
                </span>
              </div>

              <h3 className="text-base font-light text-white tracking-wide group-hover:text-[#D4AF37] transition-colors mb-1">
                {ex.title}
              </h3>

              <span className="text-[10px] font-mono text-white/40 uppercase tracking-wider block mb-3">
                {ex.category}
              </span>

              <p className="text-xs text-white/70 font-light leading-relaxed mb-4">
                {ex.description}
              </p>

              {/* Socratic Question */}
              <div className="p-3 bg-white/[0.02] border-l border-[#D4AF37] mb-4">
                <p className="text-[11px] font-serif italic text-white/80">
                  &ldquo;{ex.keyQuestion}&rdquo;
                </p>
              </div>
            </div>

            {/* Phases info & Action */}
            <div className="pt-3 border-t border-white/5 flex items-center justify-between">
              <span className="text-[9px] font-mono text-white/40 uppercase">
                {ex.phases.length} Guided Phases
              </span>
              <button
                id={`start-ex-btn-${ex.id}`}
                onClick={() => onStartExercise(ex.id)}
                className="px-4 py-2 bg-[#D4AF37]/15 hover:bg-[#D4AF37] text-[#D4AF37] hover:text-black text-[10px] font-mono font-bold uppercase tracking-widest transition-all rounded-xs flex items-center gap-1.5"
              >
                <Play className="w-3 h-3 fill-current" />
                Begin Session
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
