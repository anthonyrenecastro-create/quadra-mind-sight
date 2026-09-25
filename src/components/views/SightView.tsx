import React, { useState } from 'react';
import { SightAllocation, QuadrantKey } from '../../types';
import { QuadraOrbVisualizer } from '../QuadraOrbVisualizer';
import { Sliders, RotateCcw, Sparkles, CheckCircle2, ShieldAlert } from 'lucide-react';

interface SightViewProps {
  sight: SightAllocation;
  onSightChange: (sight: SightAllocation) => void;
  onOpenGroundModal: () => void;
}

export const SightView: React.FC<SightViewProps> = ({
  sight,
  onSightChange,
  onOpenGroundModal,
}) => {
  const [localSight, setLocalSight] = useState<SightAllocation>(sight);
  const [savedToast, setSavedToast] = useState(false);

  const handleSliderChange = (quadrant: keyof SightAllocation, val: number) => {
    const updated = { ...localSight, [quadrant]: val };
    setLocalSight(updated);
    onSightChange(updated);
  };

  const handleApplyPreset = (preset: { memory: number; meaning: number; present: number; future: number }) => {
    setLocalSight(preset);
    onSightChange(preset);
    setSavedToast(true);
    setTimeout(() => setSavedToast(false), 2000);
  };

  // Metrics computation
  const total = localSight.memory + localSight.meaning + localSight.present + localSight.future;
  const entries: [keyof SightAllocation, number][] = [
    ['memory', localSight.memory],
    ['meaning', localSight.meaning],
    ['present', localSight.present],
    ['future', localSight.future],
  ];
  entries.sort((a, b) => b[1] - a[1]);
  const dominant = entries[0];
  const lowest = entries[3];

  return (
    <div id="sight-allocation-view" className="flex-1 flex flex-col lg:flex-row overflow-y-auto lg:overflow-hidden relative p-3 sm:p-8 gap-6 sm:gap-8 touch-scroll">
      {/* Visualizer Column */}
      <div className="flex-1 flex flex-col items-center justify-center relative">
        <div className="w-full max-w-xl text-center mb-4 sm:mb-6">
          <span className="text-[10px] font-mono uppercase tracking-[0.25em] text-[#D4AF37] block">
            Quadrant Allocation Instrument
          </span>
          <h2 className="text-xl sm:text-2xl font-light text-white tracking-wide">
            THE SIGHT
          </h2>
          <p className="text-xs text-white/60 mt-1 max-w-md mx-auto">
            A reflective mapping of where your attentional energy is currently distributed across the 4 cognitive perspectives.
          </p>
        </div>

        <QuadraOrbVisualizer sight={localSight} />
      </div>

      {/* Control Sliders & Analytics Panel */}
      <div className="w-full lg:w-[420px] border border-white/10 bg-[#050508]/90 p-4 sm:p-6 flex flex-col justify-between lg:overflow-y-auto rounded-xs shadow-2xl shrink-0">
        <div className="space-y-6">
          <div className="flex items-center justify-between border-b border-white/10 pb-3">
            <div className="flex items-center gap-2">
              <Sliders className="w-4 h-4 text-[#D4AF37]" />
              <h3 className="text-xs font-mono uppercase tracking-widest text-white">
                Attention Sliders
              </h3>
            </div>
            {savedToast && (
              <span className="text-[10px] text-emerald-400 font-mono flex items-center gap-1">
                <CheckCircle2 className="w-3 h-3" /> Updated
              </span>
            )}
          </div>

          {/* 4 Quadrant Sliders */}
          <div className="space-y-4 text-xs font-mono">
            {/* Memory Slider */}
            <div>
              <div className="flex justify-between items-center mb-1">
                <span className="text-[#D4AF37] uppercase tracking-wider font-bold">
                  Quadrant I: Memory (Past)
                </span>
                <span className="text-white/80">{localSight.memory}%</span>
              </div>
              <input
                type="range"
                min="0"
                max="100"
                value={localSight.memory}
                onChange={(e) => handleSliderChange('memory', parseInt(e.target.value, 10))}
                className="w-full accent-[#D4AF37] cursor-pointer"
              />
              <span className="text-[9px] text-white/40 block mt-0.5">
                Autobiographical recall & historical narratives
              </span>
            </div>

            {/* Meaning Slider */}
            <div>
              <div className="flex justify-between items-center mb-1">
                <span className="text-[#EF4444] uppercase tracking-wider font-bold">
                  Quadrant II: Meaning (Affect)
                </span>
                <span className="text-white/80">{localSight.meaning}%</span>
              </div>
              <input
                type="range"
                min="0"
                max="100"
                value={localSight.meaning}
                onChange={(e) => handleSliderChange('meaning', parseInt(e.target.value, 10))}
                className="w-full accent-[#EF4444] cursor-pointer"
              />
              <span className="text-[9px] text-white/40 block mt-0.5">
                Emotional charge, narrative interpretations & values
              </span>
            </div>

            {/* Present Slider */}
            <div>
              <div className="flex justify-between items-center mb-1">
                <span className="text-[#10B981] uppercase tracking-wider font-bold">
                  Quadrant III: Embodiment (Present)
                </span>
                <span className="text-white/80">{localSight.present}%</span>
              </div>
              <input
                type="range"
                min="0"
                max="100"
                value={localSight.present}
                onChange={(e) => handleSliderChange('present', parseInt(e.target.value, 10))}
                className="w-full accent-[#10B981] cursor-pointer"
              />
              <span className="text-[9px] text-white/40 block mt-0.5">
                Interoceptive physical sensations & environmental cues
              </span>
            </div>

            {/* Future Slider */}
            <div>
              <div className="flex justify-between items-center mb-1">
                <span className="text-[#8B5CF6] uppercase tracking-wider font-bold">
                  Quadrant IV: Projection (Future)
                </span>
                <span className="text-white/80">{localSight.future}%</span>
              </div>
              <input
                type="range"
                min="0"
                max="100"
                value={localSight.future}
                onChange={(e) => handleSliderChange('future', parseInt(e.target.value, 10))}
                className="w-full accent-[#8B5CF6] cursor-pointer"
              />
              <span className="text-[9px] text-white/40 block mt-0.5">
                Anticipatory simulation, planning & predictive modeling
              </span>
            </div>
          </div>

          {/* Preset Alignments */}
          <div className="pt-3 border-t border-white/5">
            <span className="text-[9.5px] font-mono text-white/40 uppercase tracking-widest block mb-2">
              Calibration Presets
            </span>
            <div className="grid grid-cols-2 gap-2 text-[10px] font-mono">
              <button
                onClick={() => handleApplyPreset({ memory: 50, meaning: 50, present: 50, future: 50 })}
                className="p-2 border border-white/10 hover:border-[#D4AF37] hover:text-[#D4AF37] text-white/70 rounded-xs text-left"
              >
                Equanimity (50/50/50/50)
              </button>
              <button
                onClick={() => handleApplyPreset({ memory: 85, meaning: 60, present: 35, future: 30 })}
                className="p-2 border border-white/10 hover:border-[#D4AF37] hover:text-[#D4AF37] text-white/70 rounded-xs text-left"
              >
                Memory Dive (85/60/35/30)
              </button>
              <button
                onClick={() => handleApplyPreset({ memory: 25, meaning: 30, present: 90, future: 25 })}
                className="p-2 border border-white/10 hover:border-[#D4AF37] hover:text-[#D4AF37] text-white/70 rounded-xs text-left"
              >
                Somatic Anchor (25/30/90/25)
              </button>
              <button
                onClick={() => handleApplyPreset({ memory: 35, meaning: 45, present: 40, future: 90 })}
                className="p-2 border border-white/10 hover:border-[#D4AF37] hover:text-[#D4AF37] text-white/70 rounded-xs text-left"
              >
                Visionary (35/45/40/90)
              </button>
            </div>
          </div>

          {/* Cognitive Balance Analysis */}
          <div className="p-3 bg-white/[0.02] border border-white/5 rounded-xs space-y-2 text-xs">
            <div className="flex justify-between items-center text-[10px] font-mono uppercase text-white/50">
              <span>Dominant Mode:</span>
              <span className="text-white font-bold">{dominant[0].toUpperCase()} ({dominant[1]}%)</span>
            </div>
            <div className="flex justify-between items-center text-[10px] font-mono uppercase text-white/50">
              <span>Neglected Mode:</span>
              <span className="text-white/70">{lowest[0].toUpperCase()} ({lowest[1]}%)</span>
            </div>
            <p className="text-[10.5px] text-white/60 leading-relaxed pt-1 border-t border-white/5 font-light">
              {dominant[0] === 'future' && 'High future projection indicates active simulation. Consider grounding in Embodiment (Quadrant III) to avoid anticipatory fatigue.'}
              {dominant[0] === 'memory' && 'Heavy autobiographical focus. Remember: memories are reconstructed models, not rigid truths.'}
              {dominant[0] === 'meaning' && 'Intense emotional meaning is active. Practice isolating the objective event from the assigned story.'}
              {dominant[0] === 'present' && 'Strong somatic embodiment active. Well-grounded foundation for exploring creative projections.'}
            </p>
          </div>
        </div>

        {/* Safety */}
        <div className="pt-4 border-t border-white/5">
          <button
            onClick={onOpenGroundModal}
            className="w-full py-2.5 border border-red-900/50 text-red-400 hover:bg-red-950/20 text-[10px] font-mono uppercase tracking-wider rounded-xs flex items-center justify-center gap-2"
          >
            <ShieldAlert className="w-3.5 h-3.5" />
            Quick Grounding
          </button>
        </div>
      </div>
    </div>
  );
};
