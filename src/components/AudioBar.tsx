import React, { useEffect, useState } from 'react';
import { audioEngine, AUDIO_PRESETS, ACOUSTIC_BINAURAL_PROFILES } from '../audio/AudioEngine';
import { AudioEngineConfig, SpatialPosition } from '../types';
import { Play, Square, Headphones, Compass, VolumeX, Volume2, Orbit, ChevronDown, ChevronUp, ArrowLeftRight, Timer } from 'lucide-react';

interface AudioBarProps {
  onOpenAudioLab: () => void;
}

const TIMER_PRESETS = [
  { label: '1m', seconds: 60 },
  { label: '5m', seconds: 300 },
  { label: '10m', seconds: 600 },
  { label: '15m', seconds: 900 },
  { label: '20m', seconds: 1200 },
  { label: '30m', seconds: 1800 },
  { label: '∞', seconds: null },
];

const formatTimer = (seconds: number | null): string => {
  if (seconds === null) return '∞';
  const m = Math.floor(seconds / 60);
  const s = seconds % 60;
  return `${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`;
};

export const AudioBar: React.FC<AudioBarProps> = ({ onOpenAudioLab }) => {
  const [config, setConfig] = useState<AudioEngineConfig>(audioEngine.config);
  const [isMuted, setIsMuted] = useState(false);
  const [prevVolume, setPrevVolume] = useState(0.7);
  const [isMobileMinimized, setIsMobileMinimized] = useState(false);

  useEffect(() => {
    const unsub = audioEngine.subscribe((cfg) => setConfig(cfg));
    return unsub;
  }, []);

  const handleTogglePlay = async () => {
    if (config.isPlaying) {
      audioEngine.stop();
    } else {
      await audioEngine.start();
    }
  };

  const handlePresetChange = (presetId: string) => {
    audioEngine.setPreset(presetId);
  };

  const handleAmbientVolumeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = parseFloat(e.target.value);
    audioEngine.setVolumes(config.volume, config.binauralVolume, val, config.droneVolume);
  };

  const handleSpatialChange = (pos: SpatialPosition) => {
    if (!config.isPlaying) {
      audioEngine.testSpatialRegion(pos);
    } else {
      audioEngine.setSpatialPosition(pos);
    }
  };

  const handleToggleMute = () => {
    if (isMuted) {
      audioEngine.setVolumes(prevVolume, config.binauralVolume, config.ambientVolume, config.droneVolume);
      setIsMuted(false);
    } else {
      setPrevVolume(config.volume);
      audioEngine.setVolumes(0, config.binauralVolume, config.ambientVolume, config.droneVolume);
      setIsMuted(true);
    }
  };

  const activePreset = AUDIO_PRESETS.find((p) => p.id === config.activePresetId) || AUDIO_PRESETS[0];

  // Minimized phone view (ultra-compact 30px strip)
  if (isMobileMinimized) {
    return (
      <div
        id="app-audio-bar-minimized"
        className="md:hidden border-t border-white/10 bg-[#07070F]/95 backdrop-blur-md px-3 py-1 flex items-center justify-between shrink-0 select-none z-20 text-[10px] font-mono"
      >
        <div className="flex items-center gap-2">
          <button
            onClick={handleTogglePlay}
            className={`w-5 h-5 rounded-full flex items-center justify-center transition-all ${
              config.isPlaying ? 'bg-[#D4AF37] text-black' : 'border border-white/30 text-white'
            }`}
            aria-label={config.isPlaying ? 'Stop Audio' : 'Start Audio'}
          >
            {config.isPlaying ? <Square className="w-2.5 h-2.5 fill-current" /> : <Play className="w-2.5 h-2.5 fill-current ml-0.5" />}
          </button>
          <span className="text-white/70 truncate max-w-[140px] uppercase">
            {activePreset.name} ({activePreset.beatDiff.toFixed(1)}Hz)
          </span>
          {config.isPlaying && <span className="w-1.5 h-1.5 rounded-full bg-[#D4AF37] animate-pulse" />}
        </div>

        <div className="flex items-center gap-3">
          {config.isTimerActive && config.timerRemainingSeconds !== null && (
            <span className="text-[#D4AF37] flex items-center gap-1">
              <Timer className="w-2.5 h-2.5" />
              {formatTimer(config.timerRemainingSeconds)}
            </span>
          )}
          <button onClick={onOpenAudioLab} className="text-[#D4AF37] text-[9.5px] uppercase">
            Lab
          </button>
          <button
            onClick={() => setIsMobileMinimized(false)}
            className="p-1 text-white/50 hover:text-white"
            title="Expand Audio Controls"
            aria-label="Expand Audio Controls"
          >
            <ChevronUp className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>
    );
  }

  return (
    <footer
      id="app-audio-bar"
      className="h-12 sm:h-20 border-t border-white/10 bg-[#07070F]/95 backdrop-blur-md px-3 sm:px-8 flex items-center justify-between shrink-0 select-none z-20 transition-all"
    >
      {/* Left: Play/Stop & Equalizer */}
      <div className="flex items-center gap-2 sm:gap-8">
        <button
          id="audio-play-toggle-btn"
          onClick={handleTogglePlay}
          className={`w-8 h-8 sm:w-10 sm:h-10 rounded-full border flex items-center justify-center transition-all shrink-0 active:scale-95 touch-manipulation ${
            config.isPlaying
              ? 'border-[#D4AF37] bg-[#D4AF37] text-black shadow-[0_0_15px_rgba(212,175,55,0.4)]'
              : 'border-white/20 text-white hover:border-[#D4AF37] hover:text-[#D4AF37]'
          }`}
          title={config.isPlaying ? 'Stop Audio Entrainment' : 'Start Audio Entrainment'}
          aria-label={config.isPlaying ? 'Stop Audio Entrainment' : 'Start Audio Entrainment'}
        >
          {config.isPlaying ? (
            <Square className="w-3 h-3 sm:w-4 sm:h-4 fill-current" />
          ) : (
            <Play className="w-3 h-3 sm:w-4 sm:h-4 fill-current ml-0.5" />
          )}
        </button>

        {/* Live Audio Engine Graphic Equalizer */}
        <div className="hidden sm:flex flex-col gap-1">
          <span className="text-[9px] uppercase tracking-widest text-white/30 font-mono">
            {config.isPlaying ? 'Acoustic Entrainment Active' : 'Audio Engine Standby'}
          </span>
          <div className="flex gap-1.5 items-end h-6">
            {[60, 40, 85, 30, 55, 75, 45, 65].map((h, idx) => (
              <div
                key={idx}
                className={`w-1 transition-all duration-300 ${
                  config.isPlaying ? 'bg-[#D4AF37]' : 'bg-white/20'
                }`}
                style={{
                  height: config.isPlaying ? `${h}%` : '20%',
                  opacity: config.isPlaying ? 0.4 + (idx % 3) * 0.3 : 0.3,
                }}
              />
            ))}
          </div>
        </div>

        {/* Mobile Mini Equalizer dots when playing */}
        {config.isPlaying && (
          <div className="sm:hidden flex items-center gap-1">
            <span className="w-1 h-3 bg-[#D4AF37] animate-pulse" />
            <span className="w-1 h-4 bg-[#D4AF37] animate-pulse delay-75" />
            <span className="w-1 h-2 bg-[#D4AF37] animate-pulse delay-150" />
          </div>
        )}
      </div>

      {/* Center: Presets, Timer & Ambient Layer */}
      <div className="flex items-center gap-2 sm:gap-6">
        {/* Preset Selector */}
        <div className="flex flex-col">
          <span className="text-[8px] sm:text-[9px] text-white/30 uppercase tracking-widest mb-0.5 font-mono hidden xs:block">
            Acoustic Preset
          </span>
          <select
            id="audio-preset-select"
            value={config.activePresetId}
            onChange={(e) => handlePresetChange(e.target.value)}
            className="bg-black border border-white/15 text-[10px] sm:text-[10.5px] text-white px-2 py-1 uppercase tracking-wider rounded-xs focus:border-[#D4AF37] focus:outline-hidden font-mono max-w-[130px] sm:max-w-none truncate"
          >
            {AUDIO_PRESETS.map((p) => (
              <option key={p.id} value={p.id} className="bg-[#050508]">
                {p.name.toUpperCase()} ({p.beatDiff.toFixed(1)}Hz)
              </option>
            ))}
          </select>
        </div>

        {/* Playback Session Timer */}
        <div className="flex flex-col">
          <span className="text-[8px] sm:text-[9px] text-white/30 uppercase tracking-widest mb-0.5 font-mono flex items-center gap-1">
            <Timer className={`w-2.5 h-2.5 ${config.isTimerActive ? 'text-[#D4AF37] animate-pulse' : 'text-white/40'}`} />
            <span>Timer</span>
            {config.isTimerActive && config.timerRemainingSeconds !== null && (
              <span className="text-[#D4AF37] font-bold">({formatTimer(config.timerRemainingSeconds)})</span>
            )}
          </span>
          <select
            id="audio-timer-select"
            value={config.timerDurationSeconds === null ? 'null' : String(config.timerDurationSeconds)}
            onChange={(e) => {
              const val = e.target.value === 'null' ? null : parseInt(e.target.value, 10);
              audioEngine.setTimerDuration(val);
            }}
            className="bg-black border border-white/15 text-[10px] sm:text-[10.5px] text-white px-2 py-1 uppercase tracking-wider rounded-xs focus:border-[#D4AF37] focus:outline-hidden font-mono"
            title="Set playback session duration"
          >
            {TIMER_PRESETS.map((t) => (
              <option key={t.label} value={t.seconds === null ? 'null' : String(t.seconds)} className="bg-[#050508]">
                {t.seconds === null ? '∞ Cont.' : `${t.label} (${Math.floor(t.seconds / 60)}m)`}
              </option>
            ))}
          </select>
        </div>

        {/* Ambient Layer Slider */}
        <div className="hidden md:flex flex-col">
          <span className="text-[9px] text-white/30 uppercase tracking-widest mb-1 font-mono">
            Ambient Layer ({config.noiseType})
          </span>
          <div className="flex items-center gap-2.5">
            <input
              id="audio-ambient-slider"
              type="range"
              min="0"
              max="1"
              step="0.05"
              value={config.ambientVolume}
              onChange={handleAmbientVolumeChange}
              className="w-20 sm:w-28 accent-[#D4AF37] h-1 bg-white/20 rounded-lg cursor-pointer"
            />
            <span className="text-[10px] font-mono text-white/60">
              {Math.round(config.ambientVolume * 100)}%
            </span>
          </div>
        </div>

        {/* Spatial Audio Switcher & Channel Orientation */}
        <div className="hidden lg:flex items-center gap-3">
          <div className="flex flex-col">
            <span className="text-[9px] text-white/30 uppercase tracking-widest mb-1 font-mono flex items-center gap-1">
              <Orbit className="w-2.5 h-2.5 text-[#D4AF37]" />
              Spatial Field
            </span>
            <div className="flex items-center gap-0.5 bg-black p-0.5 border border-white/10 rounded-xs text-[9px] font-mono">
              {(['CENTER', 'FRONT', 'BACK', 'LEFT', 'RIGHT', 'ORBIT'] as SpatialPosition[]).map((pos) => {
                const prof = ACOUSTIC_BINAURAL_PROFILES[pos];
                return (
                  <button
                    key={pos}
                    type="button"
                    onClick={() => handleSpatialChange(pos)}
                    title={`${prof.name}: ${prof.carrierFreq}Hz carrier + ${prof.beatDiff}Hz (${prof.targetBand})`}
                    className={`px-1.5 py-0.5 uppercase transition-colors rounded-xs ${
                      config.spatialPosition === pos
                        ? 'bg-[#D4AF37] text-black font-bold'
                        : 'text-white/40 hover:text-white'
                    }`}
                  >
                    {pos === 'CENTER' ? 'ctr' : pos.toLowerCase()}
                  </button>
                );
              })}
            </div>
          </div>

          <div className="flex flex-col">
            <span className="text-[9px] text-white/30 uppercase tracking-widest mb-1 font-mono flex items-center gap-1">
              <ArrowLeftRight className="w-2.5 h-2.5 text-[#8B5CF6]" />
              Channels
            </span>
            <button
              type="button"
              onClick={() => audioEngine.toggleSwapChannels()}
              title={config.swapChannels ? 'Channels Inverted (Right ⇄ Left). Click to restore Standard (L/R).' : 'Channels Standard (Left ⇄ Right). Click to Swap L/R.'}
              className={`px-2 py-0.5 uppercase transition-colors rounded-xs border text-[9px] font-mono flex items-center gap-1 ${
                config.swapChannels
                  ? 'border-amber-400 bg-amber-950/40 text-amber-300 font-bold'
                  : 'border-white/10 bg-black text-white/50 hover:text-white hover:border-white/30'
              }`}
            >
              <span>{config.swapChannels ? 'R ⇄ L' : 'L ⇄ R'}</span>
            </button>
          </div>
        </div>
      </div>

      {/* Right: Controls & Lab Link */}
      <div className="flex items-center gap-2.5 sm:gap-5 text-[9.5px] sm:text-[10px] tracking-[0.15em] sm:tracking-[0.2em] uppercase font-bold text-white/40">
        <button
          onClick={handleToggleMute}
          className="hover:text-[#D4AF37] cursor-pointer flex items-center gap-1 p-1"
          title={isMuted ? 'Unmute' : 'Mute'}
          aria-label={isMuted ? 'Unmute' : 'Mute'}
        >
          {isMuted ? <VolumeX className="w-3.5 h-3.5 text-red-400" /> : <Volume2 className="w-3.5 h-3.5" />}
          <span className="hidden sm:inline">{isMuted ? 'Muted' : 'Mute'}</span>
        </button>

        <div className="w-1 h-1 bg-white/20 rounded-full hidden sm:block" />

        <button
          onClick={onOpenAudioLab}
          className="hover:text-[#D4AF37] cursor-pointer font-mono text-white/70 hover:underline px-1 py-0.5"
        >
          Lab
        </button>

        <div className="w-1 h-1 bg-white/20 rounded-full hidden sm:block" />

        <div className="flex items-center gap-1.5 text-white/80 font-mono text-[9px] hidden sm:flex">
          <Headphones className="w-3.5 h-3.5 text-[#D4AF37]" />
          <span>H-Phone Calibrated</span>
        </div>

        {/* Mobile Collapse/Minimize Button */}
        <button
          onClick={() => setIsMobileMinimized(true)}
          className="md:hidden p-1 text-white/40 hover:text-white"
          title="Minimize Audio Bar"
          aria-label="Minimize Audio Bar"
        >
          <ChevronDown className="w-3.5 h-3.5" />
        </button>
      </div>
    </footer>
  );
};
