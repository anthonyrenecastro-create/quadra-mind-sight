import React, { useEffect, useState } from 'react';
import { audioEngine } from '../audio/AudioEngine';
import { ShieldCheck, Compass, Eye, Wind, Clock, ArrowLeft } from 'lucide-react';

interface GroundingModalProps {
  isOpen: boolean;
  onClose: () => void;
  onReturnToDashboard: () => void;
}

export const GroundingModal: React.FC<GroundingModalProps> = ({
  isOpen,
  onClose,
  onReturnToDashboard,
}) => {
  const [currentDateTime, setCurrentDateTime] = useState('');
  const [breathCount, setBreathCount] = useState(0);

  useEffect(() => {
    if (!isOpen) return;

    // Trigger audio safety fade-out
    audioEngine.groundAndExit();

    const updateTime = () => {
      const now = new Date();
      setCurrentDateTime(
        now.toLocaleString('en-US', {
          weekday: 'long',
          month: 'long',
          day: 'numeric',
          year: 'numeric',
          hour: '2-digit',
          minute: '2-digit',
          second: '2-digit',
        })
      );
    };
    updateTime();
    const interval = setInterval(updateTime, 1000);

    // Subtle breath pacing counter (4s rhythm)
    const breathInterval = setInterval(() => {
      setBreathCount((c) => (c + 1) % 8);
    }, 1000);

    return () => {
      clearInterval(interval);
      clearInterval(breathInterval);
    };
  }, [isOpen]);

  if (!isOpen) return null;

  const isInhaling = breathCount < 4;

  return (
    <div
      id="grounding-modal-overlay"
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/85 backdrop-blur-md p-4 animate-in fade-in duration-300"
    >
      <div
        id="grounding-modal-container"
        className="w-full max-w-xl border border-[#D4AF37]/30 bg-[#050508] p-8 shadow-2xl relative flex flex-col gap-6"
      >
        {/* Header */}
        <div className="flex items-center justify-between border-b border-white/10 pb-4">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-full border border-red-500/50 flex items-center justify-center bg-red-950/20">
              <ShieldCheck className="w-4 h-4 text-red-400" />
            </div>
            <div>
              <span className="text-[10px] uppercase tracking-[0.2em] text-red-400 font-bold block">
                Safety Protocol Active
              </span>
              <h3 className="text-base font-light tracking-wider text-white">
                GROUND / EXIT RE-ORIENTATION
              </h3>
            </div>
          </div>
          <div className="text-right font-mono text-[11px] text-white/50">
            <div className="flex items-center gap-1.5 justify-end">
              <Clock className="w-3.5 h-3.5 text-[#D4AF37]" />
              <span>{currentDateTime.split(',')[0]}</span>
            </div>
            <span className="text-white/80">{currentDateTime.split(',').slice(1).join(',')}</span>
          </div>
        </div>

        {/* Audio state confirm */}
        <div className="bg-white/[0.03] border border-white/10 p-3 flex items-center gap-3 text-xs text-white/70">
          <div className="w-2 h-2 rounded-full bg-emerald-400"></div>
          <span>Binaural modulation stopped. Auditory field returned to neutral ambient grounding.</span>
        </div>

        {/* 5-4-3-2-1 Sensory Grounding Checklist */}
        <div className="space-y-4">
          <p className="text-xs uppercase tracking-[0.15em] text-white/40 font-semibold flex items-center gap-2">
            <Compass className="w-3.5 h-3.5 text-[#D4AF37]" />
            Immediate Sensory Re-Anchoring:
          </p>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
            <div className="p-3 border border-white/10 bg-[#0A0A15]/60 flex items-start gap-2.5">
              <Eye className="w-4 h-4 text-[#D4AF37] shrink-0 mt-0.5" />
              <div>
                <strong className="text-white block font-medium">1. Visual Horizon</strong>
                <span className="text-white/60">Identify 3 tangible physical objects in your immediate room.</span>
              </div>
            </div>

            <div className="p-3 border border-white/10 bg-[#0A0A15]/60 flex items-start gap-2.5">
              <div className="w-4 h-4 rounded-full border border-emerald-400/60 flex items-center justify-center shrink-0 mt-0.5 text-[9px] text-emerald-400">
                P
              </div>
              <div>
                <strong className="text-white block font-medium">2. Physical Contact</strong>
                <span className="text-white/60">Feel your feet firmly pressing into the floor and back on the chair.</span>
              </div>
            </div>
          </div>

          {/* Gentle Breathing Rhythm */}
          <div className="border border-white/10 bg-[#0A0A15]/40 p-4 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <Wind className="w-4 h-4 text-cyan-400 animate-pulse" />
              <div>
                <span className="text-[10px] uppercase tracking-wider text-white/40 block">Paced Respiration</span>
                <span className="text-sm font-light text-white">
                  {isInhaling ? 'Gentle Inhale...' : 'Soft Exhale...'}
                </span>
              </div>
            </div>
            <div className="flex items-center gap-1.5 font-mono text-xs">
              <div
                className={`h-2 transition-all duration-300 rounded-sm ${
                  isInhaling ? 'w-16 bg-[#D4AF37]' : 'w-16 bg-white/20'
                }`}
              ></div>
            </div>
          </div>
        </div>

        {/* Action Controls */}
        <div className="flex flex-col sm:flex-row items-center justify-end gap-3 pt-2 border-t border-white/10">
          <button
            id="grounding-resume-btn"
            onClick={onClose}
            className="w-full sm:w-auto px-4 py-2.5 border border-white/20 text-white/70 hover:text-white hover:border-white/40 text-xs font-mono tracking-wider uppercase transition-colors"
          >
            I Feel Settled (Resume)
          </button>
          <button
            id="grounding-return-dashboard-btn"
            onClick={() => {
              onClose();
              onReturnToDashboard();
            }}
            className="w-full sm:w-auto px-5 py-2.5 bg-[#D4AF37] text-black hover:bg-[#E5C158] text-xs font-bold tracking-widest uppercase flex items-center justify-center gap-2 transition-colors"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            Return to Dashboard
          </button>
        </div>
      </div>
    </div>
  );
};
