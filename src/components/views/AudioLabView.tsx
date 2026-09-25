import React, { useState, useEffect, useRef } from 'react';
import { audioEngine, AUDIO_PRESETS, ACOUSTIC_BINAURAL_PROFILES } from '../../audio/AudioEngine';
import { AudioEngineConfig, SpatialPosition, NoiseType } from '../../types';
import { Sliders, Play, Square, Headphones, Compass, RotateCw, Volume2, ShieldAlert, ArrowLeftRight, Timer, Clock, Bell, Sparkles } from 'lucide-react';

interface AudioLabViewProps {
  onOpenGroundModal: () => void;
}

const TIMER_PRESETS = [
  { label: '1 min', seconds: 60 },
  { label: '3 mins', seconds: 180 },
  { label: '5 mins', seconds: 300 },
  { label: '10 mins', seconds: 600 },
  { label: '15 mins', seconds: 900 },
  { label: '20 mins', seconds: 1200 },
  { label: '30 mins', seconds: 1800 },
  { label: '45 mins', seconds: 2700 },
  { label: '60 mins', seconds: 3600 },
  { label: '∞ Continuous', seconds: null },
];

const formatDuration = (seconds: number | null): string => {
  if (seconds === null) return 'Continuous';
  const m = Math.floor(seconds / 60);
  const s = seconds % 60;
  return `${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`;
};

export const AudioLabView: React.FC<AudioLabViewProps> = ({ onOpenGroundModal }) => {
  const [config, setConfig] = useState<AudioEngineConfig>(audioEngine.config);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [testingEar, setTestingEar] = useState<'left' | 'right' | null>(null);
  const [customMinutesInput, setCustomMinutesInput] = useState<string>('');

  useEffect(() => {
    const unsub = audioEngine.subscribe((cfg) => setConfig(cfg));
    return unsub;
  }, []);

  // Oscilloscope Animation Loop
  useEffect(() => {
    let animId: number;
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let phase = 0;

    const render = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      const w = canvas.width;
      const h = canvas.height;
      const midY = h / 2;

      // Draw grid
      ctx.strokeStyle = 'rgba(255, 255, 255, 0.05)';
      ctx.lineWidth = 1;
      ctx.beginPath();
      ctx.moveTo(0, midY);
      ctx.lineTo(w, midY);
      ctx.moveTo(w / 2, 0);
      ctx.lineTo(w / 2, h);
      ctx.stroke();

      if (config.isPlaying) {
        // Draw Carrier Left Wave
        ctx.strokeStyle = '#D4AF37';
        ctx.lineWidth = 1.5;
        ctx.beginPath();
        for (let x = 0; x < w; x++) {
          const t = (x / w) * Math.PI * 4;
          const amp = midY * 0.4 * config.volume;
          const y = midY + Math.sin(t * (config.carrierFreq / 50) + phase) * amp;
          if (x === 0) ctx.moveTo(x, y);
          else ctx.lineTo(x, y);
        }
        ctx.stroke();

        // Draw Carrier Right Wave (with phase offset corresponding to beat)
        ctx.strokeStyle = '#8B5CF6';
        ctx.lineWidth = 1.5;
        ctx.beginPath();
        for (let x = 0; x < w; x++) {
          const t = (x / w) * Math.PI * 4;
          const amp = midY * 0.4 * config.volume;
          const rightFreq = (config.carrierFreq + config.beatDiff) / 50;
          const y = midY + Math.sin(t * rightFreq + phase * 1.05) * amp;
          if (x === 0) ctx.moveTo(x, y);
          else ctx.lineTo(x, y);
        }
        ctx.stroke();

        phase += 0.05;
      } else {
        // Flatline
        ctx.strokeStyle = 'rgba(255, 255, 255, 0.2)';
        ctx.lineWidth = 1;
        ctx.beginPath();
        ctx.moveTo(0, midY);
        ctx.lineTo(w, midY);
        ctx.stroke();
      }

      animId = requestAnimationFrame(render);
    };

    render();
    return () => cancelAnimationFrame(animId);
  }, [config.isPlaying, config.carrierFreq, config.beatDiff, config.volume]);

  const handleTogglePlay = async () => {
    if (config.isPlaying) audioEngine.stop();
    else await audioEngine.start();
  };

  const handleTestEar = async (ear: 'left' | 'right') => {
    setTestingEar(ear);
    await audioEngine.testHeadphones(ear);
    setTimeout(() => setTestingEar(null), 2000);
  };

  return (
    <div id="audio-lab-view" className="flex-1 p-4 sm:p-8 overflow-y-auto max-w-6xl mx-auto space-y-8">
      {/* Header */}
      <div className="border-b border-white/10 pb-4 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <span className="text-[10px] font-mono uppercase tracking-[0.25em] text-[#D4AF37] block mb-1">
            Psychoacoustic Calibration
          </span>
          <h2 className="text-xl sm:text-2xl font-light text-white tracking-wide flex items-center gap-2">
            <Sliders className="w-5 h-5 text-[#D4AF37]" />
            AUDIO LAB & SYNTHESIZER
          </h2>
          <p className="text-xs text-white/60 mt-1 max-w-2xl font-light">
            Directly configure binaural carrier frequencies, target beat differentials, ambient spectral noise, and 4-direction spatial audio panning.
          </p>
        </div>

        <button
          onClick={handleTogglePlay}
          className={`px-6 py-3 border text-xs font-mono font-bold uppercase tracking-widest transition-all rounded-xs flex items-center gap-2 shadow-lg ${
            config.isPlaying
              ? 'border-[#D4AF37] bg-[#D4AF37] text-black'
              : 'border-white/20 hover:border-[#D4AF37] text-white hover:text-[#D4AF37]'
          }`}
        >
          {config.isPlaying ? <Square className="w-4 h-4 fill-current" /> : <Play className="w-4 h-4 fill-current" />}
          <span>{config.isPlaying ? 'Stop Audio' : 'Start Synthesis'}</span>
        </button>
      </div>

      {/* Real-time Oscilloscope Canvas */}
      <div className="border border-white/10 bg-black/60 p-4 rounded-xs">
        <div className="flex items-center justify-between text-[10px] font-mono text-white/50 mb-2 uppercase tracking-wider">
          <div className="flex items-center gap-4">
            <span className="flex items-center gap-1.5">
              <span className="w-2 h-2 rounded-full bg-[#D4AF37]" />
              Left: {config.carrierFreq.toFixed(1)} Hz
            </span>
            <span className="flex items-center gap-1.5">
              <span className="w-2 h-2 rounded-full bg-[#8B5CF6]" />
              Right: {(config.carrierFreq + config.beatDiff).toFixed(1)} Hz
            </span>
            <span className="text-[#D4AF37]">
              Differential: {config.beatDiff.toFixed(2)} Hz ({config.activePresetId.toUpperCase()})
            </span>
          </div>
          <span>Stereo Panner: {config.spatialPosition}</span>
        </div>
        <canvas
          ref={canvasRef}
          width={800}
          height={160}
          className="w-full h-32 sm:h-40 bg-[#050508] border border-white/5 rounded-xs"
        />
      </div>

      {/* Session Timer & Duration Control Card */}
      <div className="border border-white/10 bg-[#050508]/90 p-5 rounded-xs space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 border-b border-white/5 pb-3">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-full bg-[#D4AF37]/10 border border-[#D4AF37]/30 flex items-center justify-center">
              <Timer className={`w-4 h-4 text-[#D4AF37] ${config.isTimerActive ? 'animate-pulse' : ''}`} />
            </div>
            <div>
              <h3 className="text-xs font-mono uppercase tracking-widest text-[#D4AF37] font-bold">
                Acoustic Session Playback Timer
              </h3>
              <p className="text-[10.5px] text-white/50 font-light">
                Configure session length. Audio automatically concludes with a gentle Tibetan singing bowl chime.
              </p>
            </div>
          </div>

          {/* Countdown & Status display */}
          <div className="flex items-center gap-3">
            {config.isTimerActive && config.timerRemainingSeconds !== null ? (
              <div className="flex items-center gap-2 px-3 py-1.5 bg-[#D4AF37]/15 border border-[#D4AF37]/40 rounded-xs">
                <span className="w-2 h-2 rounded-full bg-[#D4AF37] animate-ping" />
                <span className="text-xs font-mono font-bold text-[#D4AF37]">
                  {formatDuration(config.timerRemainingSeconds)} remaining
                </span>
              </div>
            ) : (
              <span className="text-xs font-mono text-white/40">
                Duration: <strong className="text-white/80">{formatDuration(config.timerDurationSeconds)}</strong>
              </span>
            )}

            {config.isPlaying && (
              <button
                type="button"
                onClick={() => {
                  if (config.isTimerActive) audioEngine.stopTimer();
                  else if (config.timerDurationSeconds) audioEngine.startTimerCountdown(config.timerDurationSeconds);
                }}
                className="px-3 py-1 text-[10px] font-mono uppercase tracking-wider border border-white/20 hover:border-white/40 text-white/80 rounded-xs"
              >
                {config.isTimerActive ? 'Cancel Timer' : 'Arm Timer'}
              </button>
            )}
          </div>
        </div>

        {/* Timer Progress Bar (when active) */}
        {config.isTimerActive && config.timerDurationSeconds && config.timerRemainingSeconds !== null && (
          <div className="space-y-1">
            <div className="w-full bg-white/10 h-1.5 rounded-full overflow-hidden">
              <div
                className="bg-[#D4AF37] h-full transition-all duration-1000 ease-linear rounded-full"
                style={{
                  width: `${Math.max(0, Math.min(100, ((config.timerDurationSeconds - config.timerRemainingSeconds) / config.timerDurationSeconds) * 100))}%`,
                }}
              />
            </div>
            <div className="flex justify-between text-[9px] font-mono text-white/40">
              <span>Elapsed: {formatDuration(config.timerDurationSeconds - config.timerRemainingSeconds)}</span>
              <span>Target: {formatDuration(config.timerDurationSeconds)}</span>
            </div>
          </div>
        )}

        {/* Preset Duration Buttons */}
        <div>
          <span className="text-[10px] font-mono uppercase text-white/40 block mb-2">
            Select Session Duration:
          </span>
          <div className="grid grid-cols-2 sm:grid-cols-5 lg:grid-cols-10 gap-1.5 text-[11px] font-mono">
            {TIMER_PRESETS.map((t) => {
              const isSelected = config.timerDurationSeconds === t.seconds;
              return (
                <button
                  key={t.label}
                  type="button"
                  onClick={() => {
                    audioEngine.setTimerDuration(t.seconds);
                    if (config.isPlaying && t.seconds !== null) {
                      audioEngine.startTimerCountdown(t.seconds);
                    }
                  }}
                  className={`py-2 px-1 text-center border rounded-xs uppercase transition-all ${
                    isSelected
                      ? 'border-[#D4AF37] bg-[#D4AF37]/20 text-[#D4AF37] font-bold shadow-[0_0_10px_rgba(212,175,55,0.15)]'
                      : 'border-white/10 hover:border-white/30 text-white/70 hover:text-white'
                  }`}
                >
                  {t.label}
                </button>
              );
            })}
          </div>
        </div>

        {/* Custom Duration Input */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pt-2 border-t border-white/5">
          <div className="flex items-center gap-2">
            <span className="text-[10px] font-mono uppercase text-white/50">Custom Duration:</span>
            <input
              type="number"
              min="1"
              max="240"
              placeholder="e.g. 25"
              value={customMinutesInput}
              onChange={(e) => setCustomMinutesInput(e.target.value)}
              className="w-24 bg-black border border-white/15 px-2.5 py-1 text-xs font-mono text-white rounded-xs focus:border-[#D4AF37] focus:outline-hidden"
            />
            <span className="text-[10px] font-mono text-white/40">minutes</span>
            <button
              type="button"
              onClick={() => {
                const mins = parseInt(customMinutesInput, 10);
                if (!isNaN(mins) && mins > 0) {
                  const secs = mins * 60;
                  audioEngine.setTimerDuration(secs);
                  if (config.isPlaying) {
                    audioEngine.startTimerCountdown(secs);
                  }
                  setCustomMinutesInput('');
                }
              }}
              disabled={!customMinutesInput || isNaN(parseInt(customMinutesInput, 10)) || parseInt(customMinutesInput, 10) <= 0}
              className="px-3 py-1 text-[10px] font-mono uppercase tracking-wider bg-white/10 hover:bg-[#D4AF37] hover:text-black transition-colors rounded-xs disabled:opacity-30 disabled:pointer-events-none"
            >
              Apply
            </button>
          </div>

          <div className="flex items-center gap-2 text-[10px] font-mono text-white/40">
            <Bell className="w-3 h-3 text-[#D4AF37]" />
            <span>Gentle bell chime chimes upon completion</span>
          </div>
        </div>
      </div>

      {/* Main Parameters Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Column 1: Carrier & Binaural Controls */}
        <div className="border border-white/10 bg-[#050508]/90 p-5 rounded-xs space-y-4">
          <h3 className="text-xs font-mono uppercase tracking-widest text-[#D4AF37] font-bold border-b border-white/5 pb-2">
            Binaural Frequency Tuning
          </h3>

          <div>
            <div className="flex justify-between text-xs font-mono text-white mb-1">
              <span>Carrier Frequency:</span>
              <span className="text-[#D4AF37]">{config.carrierFreq} Hz</span>
            </div>
            <input
              type="range"
              min="100"
              max="400"
              step="5"
              value={config.carrierFreq}
              onChange={(e) => audioEngine.setFrequencies(parseFloat(e.target.value), config.beatDiff)}
              className="w-full accent-[#D4AF37] cursor-pointer"
            />
            <span className="text-[9px] text-white/40 block mt-1">
              Optimal range: 140 Hz — 220 Hz for maximum acoustic comfort
            </span>
          </div>

          <div>
            <div className="flex justify-between text-xs font-mono text-white mb-1">
              <span>Target Beat Differential:</span>
              <span className="text-[#8B5CF6]">{config.beatDiff.toFixed(1)} Hz</span>
            </div>
            <input
              type="range"
              min="0.5"
              max="42"
              step="0.1"
              value={config.beatDiff}
              onChange={(e) => audioEngine.setFrequencies(config.carrierFreq, parseFloat(e.target.value))}
              className="w-full accent-[#8B5CF6] cursor-pointer"
            />
            <div className="flex justify-between text-[8.5px] font-mono text-white/40 mt-1">
              <span>Delta (1-3Hz)</span>
              <span>Theta (4-7Hz)</span>
              <span>Alpha (8-12Hz)</span>
              <span>Gamma (40Hz)</span>
            </div>
          </div>

          {/* Quick Presets */}
          <div className="pt-2 border-t border-white/5">
            <span className="text-[9px] font-mono uppercase text-white/40 block mb-2">
              Auditory State Presets
            </span>
            <div className="grid grid-cols-2 gap-1.5 text-[10.5px] font-mono">
              {AUDIO_PRESETS.map((p) => (
                <button
                  key={p.id}
                  onClick={() => audioEngine.setPreset(p.id)}
                  className={`p-2 border rounded-xs text-left transition-colors ${
                    config.activePresetId === p.id
                      ? 'border-[#D4AF37] bg-[#D4AF37]/15 text-[#D4AF37] font-bold'
                      : 'border-white/10 hover:border-white/30 text-white/70'
                  }`}
                >
                  <span className="block uppercase">{p.name}</span>
                  <span className="text-[9px] text-white/40">{p.beatDiff.toFixed(1)} Hz</span>
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Column 2: Ambient Noise & Textures */}
        <div className="border border-white/10 bg-[#050508]/90 p-5 rounded-xs space-y-4">
          <h3 className="text-xs font-mono uppercase tracking-widest text-[#10B981] font-bold border-b border-white/5 pb-2">
            Ambient Spectral Masking
          </h3>

          <div>
            <span className="text-xs font-mono text-white uppercase block mb-2">
              Noise Type:
            </span>
            <div className="grid grid-cols-2 gap-2 text-xs font-mono">
              {(['pink', 'brown', 'white', 'none'] as NoiseType[]).map((nt) => (
                <button
                  key={nt}
                  onClick={() => audioEngine.setNoiseType(nt)}
                  className={`p-2 border rounded-xs text-center uppercase transition-colors ${
                    config.noiseType === nt
                      ? 'border-[#10B981] bg-[#10B981]/15 text-[#10B981] font-bold'
                      : 'border-white/10 hover:border-white/30 text-white/60'
                  }`}
                >
                  {nt} Noise
                </button>
              ))}
            </div>
          </div>

          <div>
            <div className="flex justify-between text-xs font-mono text-white mb-1">
              <span>Ambient Layer Volume:</span>
              <span>{Math.round(config.ambientVolume * 100)}%</span>
            </div>
            <input
              type="range"
              min="0"
              max="1"
              step="0.05"
              value={config.ambientVolume}
              onChange={(e) =>
                audioEngine.setVolumes(config.volume, config.binauralVolume, parseFloat(e.target.value), config.droneVolume)
              }
              className="w-full accent-[#10B981] cursor-pointer"
            />
          </div>

          <div>
            <div className="flex justify-between text-xs font-mono text-white mb-1">
              <span>Subtle Harmonic Drone:</span>
              <span>{Math.round(config.droneVolume * 100)}%</span>
            </div>
            <input
              type="range"
              min="0"
              max="1"
              step="0.05"
              value={config.droneVolume}
              onChange={(e) =>
                audioEngine.setVolumes(config.volume, config.binauralVolume, config.ambientVolume, parseFloat(e.target.value))
              }
              className="w-full accent-[#10B981] cursor-pointer"
            />
          </div>
        </div>

        {/* Column 3: 4-Direction Spatial Audio & Calibration */}
        <div className="border border-white/10 bg-[#050508]/90 p-5 rounded-xs space-y-4">
          <h3 className="text-xs font-mono uppercase tracking-widest text-[#8B5CF6] font-bold border-b border-white/5 pb-2 flex items-center justify-between">
            <span>Spatial Audio Matrix</span>
            <Compass className="w-4 h-4 text-[#8B5CF6]" />
          </h3>

          <p className="text-xs text-white/60 leading-relaxed font-light">
            Each spatial orientation emits a dedicated <strong>binaural beat</strong> at calibrated frequencies combined with 3D HRTF psychoacoustic shaping.
            FRONT projects forward with elevated concha resonance (+5.5dB); BACK triggers deep dorsal pinna occlusion (340Hz) and a 16ms Haas delay; CTR provides pure intracranial focus.
          </p>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs font-mono">
            {(['CENTER', 'FRONT', 'BACK', 'LEFT', 'RIGHT', 'ORBIT'] as SpatialPosition[]).map((pos) => {
              const prof = ACOUSTIC_BINAURAL_PROFILES[pos];
              const isActive = config.spatialPosition === pos;
              return (
                <button
                  key={pos}
                  onClick={() => audioEngine.playAcousticBinaural(pos)}
                  className={`p-3 border rounded-xs text-left transition-all ${
                    isActive
                      ? 'border-[#8B5CF6] bg-[#8B5CF6]/20 text-white font-bold shadow-[0_0_12px_rgba(139,92,246,0.25)]'
                      : 'border-white/10 hover:border-white/30 text-white/70 bg-black/40'
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <span className="font-bold text-white flex items-center gap-1.5">
                      {pos === 'CENTER' ? 'CTR' : pos}
                      <span className="text-[9px] font-normal text-white/40">({prof.quadrantName})</span>
                    </span>
                    {isActive ? (
                      <span className="text-[9px] px-1.5 py-0.2 bg-[#8B5CF6] text-black font-bold rounded-xs uppercase">
                        Active
                      </span>
                    ) : (
                      <span className="text-[9px] text-[#8B5CF6] group-hover:underline">Play Beat</span>
                    )}
                  </div>

                  <div className="mt-1.5 flex items-center justify-between text-[9.5px]">
                    <span className="text-[#D4AF37] font-semibold">{prof.carrierFreq} Hz carrier</span>
                    <span className="text-[#8B5CF6] font-semibold">+{prof.beatDiff} Hz beat</span>
                  </div>

                  <div className="text-[8.5px] text-white/40 mt-1 truncate">
                    {prof.targetBand}
                  </div>
                </button>
              );
            })}
          </div>

          {/* Active Profile Info Banner */}
          {config.spatialPosition && (
            <div className="p-2.5 bg-black/70 border border-[#8B5CF6]/30 rounded-xs text-[10px] font-mono space-y-1">
              <div className="flex items-center justify-between text-[#8B5CF6] font-bold">
                <span>Active Profile: {ACOUSTIC_BINAURAL_PROFILES[config.spatialPosition].name}</span>
                <span className="text-white/50">{ACOUSTIC_BINAURAL_PROFILES[config.spatialPosition].targetBand}</span>
              </div>
              <p className="text-white/60 text-[9.5px] leading-relaxed font-light">
                {ACOUSTIC_BINAURAL_PROFILES[config.spatialPosition].description}
              </p>
            </div>
          )}

          {/* Channel Swapping Quick Control */}
          <div className="p-3 bg-black/60 border border-white/10 rounded-xs space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-[10px] font-mono uppercase text-white/60 flex items-center gap-1.5 font-bold">
                <ArrowLeftRight className="w-3 h-3 text-[#D4AF37]" />
                Stereo Channels:
              </span>
              <span className={`text-[10px] font-mono font-bold ${config.swapChannels ? 'text-amber-400' : 'text-emerald-400'}`}>
                {config.swapChannels ? 'Inverted (R ⇄ L)' : 'Standard (L ⇄ R)'}
              </span>
            </div>
            <button
              onClick={() => audioEngine.toggleSwapChannels()}
              className={`w-full py-1.5 px-2 border text-[10px] font-mono uppercase tracking-wider rounded-xs transition-colors flex items-center justify-center gap-1.5 ${
                config.swapChannels
                  ? 'border-amber-400/80 bg-amber-950/30 text-amber-300'
                  : 'border-white/15 bg-white/5 hover:border-white/30 text-white/80'
              }`}
            >
              <ArrowLeftRight className="w-3 h-3" />
              {config.swapChannels ? 'Channels Inverted — Click to Restore Standard' : 'Invert / Swap Left & Right Channels'}
            </button>
          </div>

          {/* Headphone Verification Check */}
          <div className="pt-2 border-t border-white/5">
            <span className="text-[10px] font-mono uppercase text-white/50 block mb-2 font-bold flex items-center gap-1.5">
              <Headphones className="w-3.5 h-3.5 text-[#D4AF37]" />
              Stereo Headphone Test
            </span>
            <div className="flex gap-2">
              <button
                onClick={() => handleTestEar('left')}
                disabled={testingEar !== null}
                className={`flex-1 py-2 border text-xs font-mono uppercase transition-colors rounded-xs ${
                  testingEar === 'left'
                    ? 'border-emerald-400 bg-emerald-950/40 text-emerald-400 font-bold'
                    : 'border-white/10 hover:border-white/30 text-white/70'
                }`}
              >
                Test Left (440Hz)
              </button>
              <button
                onClick={() => handleTestEar('right')}
                disabled={testingEar !== null}
                className={`flex-1 py-2 border text-xs font-mono uppercase transition-colors rounded-xs ${
                  testingEar === 'right'
                    ? 'border-emerald-400 bg-emerald-950/40 text-emerald-400 font-bold'
                    : 'border-white/10 hover:border-white/30 text-white/70'
                }`}
              >
                Test Right (554Hz)
              </button>
            </div>
            {testingEar && (
              <span className="text-[9px] font-mono text-emerald-400 block mt-1 text-center animate-pulse">
                Playing tone in {testingEar.toUpperCase()} channel only... If inverted, click "Invert / Swap" above.
              </span>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
