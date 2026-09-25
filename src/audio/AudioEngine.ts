import { AudioEngineConfig, AudioPreset, SpatialPosition, QuadrantKey, AcousticBinauralProfile } from '../types';

export const AUDIO_PRESETS: AudioPreset[] = [
  {
    id: 'ground',
    name: 'Ground',
    carrierFreq: 216,
    beatDiff: 10.0,
    targetBand: 'Alpha (8–12 Hz)',
    purpose: 'Settling, alert relaxation, sensory anchoring and orientation.',
    description: 'A stable 10 Hz differential offering calm alertness without drowsiness.',
  },
  {
    id: 'drift',
    name: 'Drift',
    carrierFreq: 194,
    beatDiff: 6.8,
    targetBand: 'Theta (6–8 Hz)',
    purpose: 'Visualization, reflective introspection, pattern recognition.',
    description: 'A 6.8 Hz modulation conducive to fluid imagery and memory recall.',
  },
  {
    id: 'deep',
    name: 'Deep',
    carrierFreq: 156,
    beatDiff: 4.8,
    targetBand: 'Low Theta (4–6 Hz)',
    purpose: 'Deep introspective stillness, somatic detachment, dialectic depth.',
    description: 'A 4.8 Hz carrier differential designed for contemplative immersion.',
  },
  {
    id: 'threshold',
    name: 'Threshold',
    carrierFreq: 128,
    beatDiff: 2.2,
    targetBand: 'Delta (1–4 Hz)',
    purpose: 'Profound stillness, threshold consciousness, open awareness.',
    description: 'A gentle 2.2 Hz pulse providing deep restorative grounding.',
  },
  {
    id: 'gamma_sync',
    name: 'Gamma Sync',
    carrierFreq: 240,
    beatDiff: 40.0,
    targetBand: 'Gamma (38–42 Hz)',
    purpose: 'High-level synthesis, cross-quadrant integration, meta-awareness.',
    description: 'Fast 40 Hz harmonic pulsing for active problem solving and dialectic synthesis.',
  },
];

export const ACOUSTIC_BINAURAL_PROFILES: Record<SpatialPosition, AcousticBinauralProfile> = {
  LEFT: {
    position: 'LEFT',
    carrierFreq: 440.0, // A4
    beatDiff: 6.8, // Theta
    targetBand: 'Theta (6.8 Hz)',
    name: 'Left (Memory / Past / Q-I)',
    quadrantName: 'Memory',
    description: '440 Hz carrier with 6.8 Hz Theta differential for introspective recall and autobiographical memory.',
  },
  RIGHT: {
    position: 'RIGHT',
    carrierFreq: 554.37, // C#5
    beatDiff: 10.0, // Alpha
    targetBand: 'Alpha (10.0 Hz)',
    name: 'Right (Future / Projection / Q-IV)',
    quadrantName: 'Future',
    description: '554.37 Hz carrier with 10.0 Hz Alpha differential for prospective visualization and scenario simulation.',
  },
  FRONT: {
    position: 'FRONT',
    carrierFreq: 523.25, // C5
    beatDiff: 12.0, // SMR / Alert Alpha
    targetBand: 'SMR / Alert (12.0 Hz)',
    name: 'Front (Present / Embodiment / Q-III)',
    quadrantName: 'Present',
    description: '523.25 Hz carrier with 12.0 Hz SMR differential projected forward for somatic presence and sensory grounding.',
  },
  BACK: {
    position: 'BACK',
    carrierFreq: 196.0, // G3
    beatDiff: 4.8, // Low Theta
    targetBand: 'Low Theta (4.8 Hz)',
    name: 'Back (Meaning / Affect / Q-II)',
    quadrantName: 'Meaning',
    description: '196.0 Hz deep carrier with 4.8 Hz Low Theta differential behind head for affective integration and somatic depth.',
  },
  CENTER: {
    position: 'CENTER',
    carrierFreq: 432.0, // 432Hz Verdi standard
    beatDiff: 7.83, // Schumann Resonance
    targetBand: 'Schumann (7.83 Hz)',
    name: 'Center (Core / Intracranial)',
    quadrantName: 'Core',
    description: '432.0 Hz carrier with 7.83 Hz Schumann differential centered intimately within the skull for restorative stillness.',
  },
  ORBIT: {
    position: 'ORBIT',
    carrierFreq: 528.0, // Solfeggio 528Hz
    beatDiff: 40.0, // Gamma
    targetBand: 'Gamma Sync (40.0 Hz)',
    name: 'Orbit (Meta / Whole-Brain)',
    quadrantName: 'Meta',
    description: '528.0 Hz carrier with 40.0 Hz Gamma differential sweeping 360° for holistic dialectic binding and synthesis.',
  },
};

export class QuadraAudioEngine {
  private ctx: AudioContext | null = null;
  private isInitialized = false;

  // Master & Pre-master Gains
  private masterGain: GainNode | null = null;
  private preMasterBus: GainNode | null = null;

  // Channel Router Matrix (Physical L/R Calibration & Inversion)
  private channelSplitter: ChannelSplitterNode | null = null;
  private channelMerger: ChannelMergerNode | null = null;
  private gainLtoL: GainNode | null = null;
  private gainLtoR: GainNode | null = null;
  private gainRtoR: GainNode | null = null;
  private gainRtoL: GainNode | null = null;

  // Binaural Channel Gains & Isolated Panners (guarantees zero cross-ear leakage)
  private binauralLeftGain: GainNode | null = null;
  private binauralRightGain: GainNode | null = null;
  private binauralPannerLeft: StereoPannerNode | null = null;
  private binauralPannerRight: StereoPannerNode | null = null;

  // Ambient & Drone Gains
  private noiseGain: GainNode | null = null;
  private droneGain: GainNode | null = null;

  // Binaural nodes
  private oscLeft: OscillatorNode | null = null;
  private oscRight: OscillatorNode | null = null;

  // Spatial Panner & Filtering for 4-direction & orbit simulation
  private spatialPanner: StereoPannerNode | null = null;
  private spatialFilter: BiquadFilterNode | null = null;

  // 3D HRTF Spatialization Stage & Psychoacoustic Directional Shapers
  private spatialBus: GainNode | null = null;
  private spatialPanner3D: PannerNode | null = null;
  private spatialHighShelf: BiquadFilterNode | null = null;
  private spatialDorsalDelay: DelayNode | null = null;
  private spatialDorsalFilter: BiquadFilterNode | null = null;
  private spatialDorsalGain: GainNode | null = null;
  private spatialDirectGain: GainNode | null = null;
  private spatialCenterGain: GainNode | null = null;

  // Noise & Drone sources
  private noiseSource: AudioBufferSourceNode | null = null;
  private noiseFilter: BiquadFilterNode | null = null;
  private droneOsc1: OscillatorNode | null = null;
  private droneOsc2: OscillatorNode | null = null;
  private droneFilter: BiquadFilterNode | null = null;

  // Analyser for visualizer
  public analyser: AnalyserNode | null = null;

  // Orbit timer
  private orbitInterval: number | null = null;
  private orbitAngle: number = 0;

  // Session timer
  private timerInterval: number | null = null;

  // Current config
  public config: AudioEngineConfig = {
    carrierFreq: 216,
    beatDiff: 10.0,
    volume: 0.7,
    binauralVolume: 0.6,
    ambientVolume: 0.35,
    droneVolume: 0.25,
    noiseType: 'brown',
    spatialPosition: 'CENTER',
    swapChannels: typeof window !== 'undefined' ? localStorage.getItem('quadra_minds_swap_channels_v1') === 'true' : false,
    isPlaying: false,
    activePresetId: 'ground',
    waveType: 'sine',
    breathingPaceSeconds: 4,
    timerDurationSeconds: 300, // Default 5 minutes
    timerRemainingSeconds: 300,
    isTimerActive: false,
  };

  private listeners: Set<(config: AudioEngineConfig) => void> = new Set();

  public subscribe(fn: (config: AudioEngineConfig) => void): () => void {
    this.listeners.add(fn);
    return () => this.listeners.delete(fn);
  }

  public getConfig(): AudioEngineConfig {
    return { ...this.config };
  }

  private notify() {
    this.listeners.forEach((fn) => fn({ ...this.config }));
  }

  public async init() {
    if (this.isInitialized && this.ctx) {
      if (this.ctx.state === 'suspended') {
        await this.ctx.resume();
      }
      return;
    }

    const AudioContextClass = window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
    this.ctx = new AudioContextClass();

    if (this.ctx.state === 'suspended') {
      await this.ctx.resume();
    }

    const now = this.ctx.currentTime;

    // 1. Master Output Gain
    this.masterGain = this.ctx.createGain();
    this.masterGain.gain.setValueAtTime(this.config.volume, now);

    // 2. Pre-master bus where all isolated sub-mixes converge
    this.preMasterBus = this.ctx.createGain();

    // 3. Stereo Channel Routing Matrix:
    // Splitter isolates left (channel 0) and right (channel 1)
    this.channelSplitter = this.ctx.createChannelSplitter(2);
    // Merger recombines into left (input 0) and right (input 1) for physical hardware output
    this.channelMerger = this.ctx.createChannelMerger(2);

    this.gainLtoL = this.ctx.createGain();
    this.gainLtoR = this.ctx.createGain();
    this.gainRtoR = this.ctx.createGain();
    this.gainRtoL = this.ctx.createGain();

    // Prevent multichannel upmix bleeding across splitter and merger:
    this.gainLtoL.channelCount = 1;
    this.gainLtoL.channelCountMode = 'explicit';
    this.gainLtoR.channelCount = 1;
    this.gainLtoR.channelCountMode = 'explicit';
    this.gainRtoR.channelCount = 1;
    this.gainRtoR.channelCountMode = 'explicit';
    this.gainRtoL.channelCount = 1;
    this.gainRtoL.channelCountMode = 'explicit';

    const swap = this.config.swapChannels;
    this.gainLtoL.gain.setValueAtTime(swap ? 0.0 : 1.0, now);
    this.gainRtoR.gain.setValueAtTime(swap ? 0.0 : 1.0, now);
    this.gainLtoR.gain.setValueAtTime(swap ? 1.0 : 0.0, now);
    this.gainRtoL.gain.setValueAtTime(swap ? 1.0 : 0.0, now);

    // Wire Splitter -> Matrix Gains -> Merger
    this.channelSplitter.connect(this.gainLtoL, 0);
    this.gainLtoL.connect(this.channelMerger, 0, 0); // L input -> Left speaker

    this.channelSplitter.connect(this.gainLtoR, 0);
    this.gainLtoR.connect(this.channelMerger, 0, 1); // L input -> Right speaker (when swapped)

    this.channelSplitter.connect(this.gainRtoR, 1);
    this.gainRtoR.connect(this.channelMerger, 0, 1); // R input -> Right speaker

    this.channelSplitter.connect(this.gainRtoL, 1);
    this.gainRtoL.connect(this.channelMerger, 0, 0); // R input -> Left speaker (when swapped)

    // Connect preMasterBus through the channel router
    this.preMasterBus.connect(this.channelSplitter);
    this.channelMerger.connect(this.masterGain);

    // Visual Analyser
    this.analyser = this.ctx.createAnalyser();
    this.analyser.fftSize = 128;
    this.analyser.smoothingTimeConstant = 0.8;

    this.masterGain.connect(this.analyser);
    this.analyser.connect(this.ctx.destination);

    // 4. Pure Dichotic Binaural Pipeline
    this.binauralLeftGain = this.ctx.createGain();
    this.binauralRightGain = this.ctx.createGain();
    this.binauralLeftGain.gain.setValueAtTime(this.config.binauralVolume, now);
    this.binauralRightGain.gain.setValueAtTime(this.config.binauralVolume, now);

    this.binauralPannerLeft = this.ctx.createStereoPanner();
    this.binauralPannerRight = this.ctx.createStereoPanner();
    this.binauralPannerLeft.pan.setValueAtTime(-1.0, now); // 100% Left channel
    this.binauralPannerRight.pan.setValueAtTime(1.0, now); // 100% Right channel

    this.binauralLeftGain.connect(this.binauralPannerLeft);
    this.binauralRightGain.connect(this.binauralPannerRight);

    // 5. Environmental Soundscape Sources (Noise & Drone)
    this.noiseGain = this.ctx.createGain();
    this.noiseGain.gain.setValueAtTime(this.config.ambientVolume, now);

    this.droneGain = this.ctx.createGain();
    this.droneGain.gain.setValueAtTime(this.config.droneVolume, now);

    // 6. Master Spatial Stage (3D HRTF Panner + Pinna Occlusion + Presence HighShelf + Dorsal Haas Delay)
    // Setup listener orientation in 3D audio space
    if (this.ctx.listener) {
      if (this.ctx.listener.forwardX) {
        this.ctx.listener.forwardX.setValueAtTime(0, now);
        this.ctx.listener.forwardY.setValueAtTime(0, now);
        this.ctx.listener.forwardZ.setValueAtTime(-1, now);
        this.ctx.listener.upX.setValueAtTime(0, now);
        this.ctx.listener.upY.setValueAtTime(1, now);
        this.ctx.listener.upZ.setValueAtTime(0, now);
        this.ctx.listener.positionX.setValueAtTime(0, now);
        this.ctx.listener.positionY.setValueAtTime(0, now);
        this.ctx.listener.positionZ.setValueAtTime(0, now);
      } else {
        const listener = this.ctx.listener as unknown as {
          setOrientation?: (x: number, y: number, z: number, ux: number, uy: number, uz: number) => void;
          setPosition?: (x: number, y: number, z: number) => void;
        };
        listener.setOrientation?.(0, 0, -1, 0, 1, 0);
        listener.setPosition?.(0, 0, 0);
      }
    }

    this.spatialBus = this.ctx.createGain();

    // Stereo Panner for fine Left/Right panning balance
    this.spatialPanner = this.ctx.createStereoPanner();
    this.spatialPanner.pan.setValueAtTime(0.0, now);

    // Pinna Occlusion Lowpass Filter (steep 340Hz for BACK, wide open 18000Hz for FRONT)
    this.spatialFilter = this.ctx.createBiquadFilter();
    this.spatialFilter.type = 'lowpass';
    this.spatialFilter.frequency.setValueAtTime(16000, now);
    this.spatialFilter.Q.setValueAtTime(0.7, now);

    // High-shelf Presence Filter (+5.5dB for FRONT concha resonance, -14dB for BACK occlusion)
    this.spatialHighShelf = this.ctx.createBiquadFilter();
    this.spatialHighShelf.type = 'highshelf';
    this.spatialHighShelf.frequency.setValueAtTime(3200, now);
    this.spatialHighShelf.gain.setValueAtTime(0.0, now);

    // 3D HRTF Panner
    this.spatialPanner3D = this.ctx.createPanner();
    this.spatialPanner3D.panningModel = 'HRTF';
    this.spatialPanner3D.distanceModel = 'inverse';
    this.spatialPanner3D.refDistance = 1;
    this.spatialPanner3D.maxDistance = 1000;
    this.spatialPanner3D.rolloffFactor = 1;
    this.spatialPanner3D.coneInnerAngle = 360;

    // Direct spatial path gain
    this.spatialDirectGain = this.ctx.createGain();
    this.spatialDirectGain.gain.setValueAtTime(0.0, now);

    // Intracranial center bypass gain (active for CENTER)
    this.spatialCenterGain = this.ctx.createGain();
    this.spatialCenterGain.gain.setValueAtTime(1.0, now);

    // Dorsal Haas delay line (~16ms) to trigger rear psychoacoustic localization (active for BACK)
    this.spatialDorsalDelay = this.ctx.createDelay(0.1);
    this.spatialDorsalDelay.delayTime.setValueAtTime(0.016, now);
    this.spatialDorsalFilter = this.ctx.createBiquadFilter();
    this.spatialDorsalFilter.type = 'lowpass';
    this.spatialDorsalFilter.frequency.setValueAtTime(650, now);
    this.spatialDorsalGain = this.ctx.createGain();
    this.spatialDorsalGain.gain.setValueAtTime(0.0, now);

    // Feed all sound generators into spatialBus
    this.noiseGain.connect(this.spatialBus);
    this.droneGain.connect(this.spatialBus);
    this.binauralPannerLeft.connect(this.spatialBus);
    this.binauralPannerRight.connect(this.spatialBus);

    // Path 1: Intracranial direct bypass (CENTER) -> preMasterBus
    this.spatialBus.connect(this.spatialCenterGain);
    this.spatialCenterGain.connect(this.preMasterBus);

    // Path 2: 3D HRTF Spatial Directional Chain (FRONT, BACK, LEFT, RIGHT, ORBIT) -> preMasterBus
    this.spatialBus.connect(this.spatialFilter);
    this.spatialFilter.connect(this.spatialHighShelf);
    this.spatialHighShelf.connect(this.spatialPanner3D);
    this.spatialPanner3D.connect(this.spatialPanner);
    this.spatialPanner.connect(this.spatialDirectGain);
    this.spatialDirectGain.connect(this.preMasterBus);

    // Path 3: Dorsal Haas echo path (BACK) -> preMasterBus
    this.spatialBus.connect(this.spatialDorsalDelay);
    this.spatialDorsalDelay.connect(this.spatialDorsalFilter);
    this.spatialDorsalFilter.connect(this.spatialDorsalGain);
    this.spatialDorsalGain.connect(this.preMasterBus);

    this.isInitialized = true;
    this.applyChannelOrientation();
    this.applySpatialPosition(this.config.spatialPosition);
  }

  /**
   * Apply hardware channel orientation (Standard vs Inverted L/R)
   */
  private applyChannelOrientation() {
    if (!this.ctx || !this.gainLtoL || !this.gainLtoR || !this.gainRtoR || !this.gainRtoL) return;
    const now = this.ctx.currentTime;
    const swap = this.config.swapChannels;

    // Smooth, click-free crossfade over 30ms
    this.gainLtoL.gain.setTargetAtTime(swap ? 0.0 : 1.0, now, 0.03);
    this.gainRtoR.gain.setTargetAtTime(swap ? 0.0 : 1.0, now, 0.03);
    this.gainLtoR.gain.setTargetAtTime(swap ? 1.0 : 0.0, now, 0.03);
    this.gainRtoL.gain.setTargetAtTime(swap ? 1.0 : 0.0, now, 0.03);
  }

  public setSwapChannels(swap: boolean) {
    this.config.swapChannels = swap;
    if (typeof window !== 'undefined') {
      localStorage.setItem('quadra_minds_swap_channels_v1', swap ? 'true' : 'false');
    }
    this.applyChannelOrientation();
    this.notify();
  }

  public toggleSwapChannels() {
    this.setSwapChannels(!this.config.swapChannels);
  }

  public async start(durationSeconds?: number) {
    await this.init();
    if (!this.ctx) return;

    if (durationSeconds !== undefined) {
      this.config.timerDurationSeconds = durationSeconds;
      this.config.timerRemainingSeconds = durationSeconds;
    }

    this.stopAudioNodes();

    const now = this.ctx.currentTime;

    // 1. Binaural Synthesis: Pure dichotic feed
    // Left ear receives Carrier; Right ear receives Carrier + beatDiff
    const leftFreq = this.config.carrierFreq;
    const rightFreq = this.config.carrierFreq + this.config.beatDiff;

    this.oscLeft = this.ctx.createOscillator();
    this.oscRight = this.ctx.createOscillator();

    this.oscLeft.type = this.config.waveType;
    this.oscRight.type = this.config.waveType;

    this.oscLeft.frequency.setValueAtTime(leftFreq, now);
    this.oscRight.frequency.setValueAtTime(rightFreq, now);

    if (this.binauralLeftGain && this.binauralRightGain) {
      this.oscLeft.connect(this.binauralLeftGain);
      this.oscRight.connect(this.binauralRightGain);
    }

    this.oscLeft.start(now);
    this.oscRight.start(now);

    // 2. Ambient Noise Generator (Pink / Brown / White)
    this.startNoise(this.config.noiseType);

    // 3. Cosmic Harmonic Drone (Soft sub-octave fundamental)
    this.startDrone();

    this.config.isPlaying = true;
    this.applySpatialPosition(this.config.spatialPosition);

    if (this.config.timerDurationSeconds !== null) {
      this.startTimerCountdown();
    }

    this.notify();
  }

  public setTimerDuration(seconds: number | null) {
    this.config.timerDurationSeconds = seconds;
    this.config.timerRemainingSeconds = seconds;
    if (this.config.isPlaying && seconds !== null) {
      this.startTimerCountdown();
    } else if (seconds === null && this.timerInterval) {
      clearInterval(this.timerInterval);
      this.timerInterval = null;
      this.config.isTimerActive = false;
    }
    this.notify();
  }

  public startTimerCountdown(durationSeconds?: number) {
    if (this.timerInterval) {
      clearInterval(this.timerInterval);
      this.timerInterval = null;
    }
    if (durationSeconds !== undefined) {
      this.config.timerDurationSeconds = durationSeconds;
      this.config.timerRemainingSeconds = durationSeconds;
    }
    if (this.config.timerDurationSeconds === null) {
      this.config.isTimerActive = false;
      return;
    }
    if (this.config.timerRemainingSeconds === null || this.config.timerRemainingSeconds <= 0) {
      this.config.timerRemainingSeconds = this.config.timerDurationSeconds;
    }
    this.config.isTimerActive = true;

    this.timerInterval = window.setInterval(() => {
      if (!this.config.isPlaying || this.config.timerRemainingSeconds === null) {
        if (this.timerInterval) clearInterval(this.timerInterval);
        this.timerInterval = null;
        this.config.isTimerActive = false;
        this.notify();
        return;
      }

      this.config.timerRemainingSeconds -= 1;

      if (this.config.timerRemainingSeconds <= 0) {
        if (this.timerInterval) {
          clearInterval(this.timerInterval);
          this.timerInterval = null;
        }
        this.config.timerRemainingSeconds = this.config.timerDurationSeconds;
        this.config.isTimerActive = false;
        this.notify();
        this.onTimerCompleted();
      } else {
        this.notify();
      }
    }, 1000);
  }

  public stopTimer() {
    if (this.timerInterval) {
      clearInterval(this.timerInterval);
      this.timerInterval = null;
    }
    this.config.isTimerActive = false;
    this.config.timerRemainingSeconds = this.config.timerDurationSeconds;
    this.notify();
  }

  private async onTimerCompleted() {
    // Play soothing completion chime and smoothly stop session
    await this.playCompletionChime();
    this.stop();
  }

  /**
   * Play a peaceful Tibetan singing bowl harmonic chime when a timed session concludes
   */
  public async playCompletionChime(): Promise<void> {
    if (!this.ctx || !this.preMasterBus) return;
    const now = this.ctx.currentTime;

    const chimeFreqs = [528, 1056, 264];
    chimeFreqs.forEach((freq, idx) => {
      if (!this.ctx || !this.preMasterBus) return;
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();

      osc.type = 'sine';
      osc.frequency.setValueAtTime(freq, now);

      const amp = idx === 0 ? 0.35 : idx === 1 ? 0.18 : 0.22;
      gain.gain.setValueAtTime(0.0001, now);
      gain.gain.linearRampToValueAtTime(amp, now + 0.05);
      gain.gain.exponentialRampToValueAtTime(0.0001, now + 2.8);

      osc.connect(gain);
      gain.connect(this.preMasterBus);

      osc.start(now);
      osc.stop(now + 2.9);

      setTimeout(() => {
        try {
          osc.disconnect();
          gain.disconnect();
        } catch {}
      }, 3000);
    });
  }

  private startNoise(type: 'pink' | 'brown' | 'white' | 'off') {
    if (!this.ctx || type === 'off') return;

    const bufferSize = this.ctx.sampleRate * 2;
    const buffer = this.ctx.createBuffer(1, bufferSize, this.ctx.sampleRate);
    const data = buffer.getChannelData(0);

    let b0 = 0, b1 = 0, b2 = 0, b3 = 0, b4 = 0, b5 = 0, b6 = 0;
    let lastOut = 0.0;

    for (let i = 0; i < bufferSize; i++) {
      const white = Math.random() * 2 - 1;
      if (type === 'brown') {
        // Brown noise (Brownian motion)
        lastOut = (lastOut + 0.02 * white) / 1.02;
        data[i] = lastOut * 3.5;
      } else if (type === 'pink') {
        // Pink noise approximation (Paul Kellet's filter)
        b0 = 0.99886 * b0 + white * 0.0555179;
        b1 = 0.99332 * b1 + white * 0.0750759;
        b2 = 0.96900 * b2 + white * 0.1538520;
        b3 = 0.86650 * b3 + white * 0.3104856;
        b4 = 0.55000 * b4 + white * 0.5329522;
        b5 = -0.7616 * b5 - white * 0.0168980;
        data[i] = (b0 + b1 + b2 + b3 + b4 + b5 + b6 + white * 0.5362) * 0.11;
        b6 = white * 0.115926;
      } else {
        data[i] = white * 0.2;
      }
    }

    this.noiseSource = this.ctx.createBufferSource();
    this.noiseSource.buffer = buffer;
    this.noiseSource.loop = true;

    this.noiseFilter = this.ctx.createBiquadFilter();
    this.noiseFilter.type = 'lowpass';
    this.noiseFilter.frequency.setValueAtTime(type === 'brown' ? 450 : 1200, this.ctx.currentTime);

    this.noiseSource.connect(this.noiseFilter);
    if (this.noiseGain) {
      this.noiseFilter.connect(this.noiseGain);
    }

    this.noiseSource.start();
  }

  private startDrone() {
    if (!this.ctx) return;
    const now = this.ctx.currentTime;
    const rootFreq = this.config.carrierFreq / 2; // Sub-octave

    this.droneOsc1 = this.ctx.createOscillator();
    this.droneOsc2 = this.ctx.createOscillator();

    this.droneOsc1.type = 'sine';
    this.droneOsc2.type = 'sine';

    this.droneOsc1.frequency.setValueAtTime(rootFreq, now);
    this.droneOsc2.frequency.setValueAtTime(rootFreq * 1.5, now); // Perfect fifth harmonic

    this.droneFilter = this.ctx.createBiquadFilter();
    this.droneFilter.type = 'lowpass';
    this.droneFilter.frequency.setValueAtTime(320, now);

    this.droneOsc1.connect(this.droneFilter);
    this.droneOsc2.connect(this.droneFilter);

    if (this.droneGain) {
      this.droneFilter.connect(this.droneGain);
    }

    this.droneOsc1.start(now);
    this.droneOsc2.start(now);
  }

  public stop() {
    this.stopAudioNodes();
    this.config.isPlaying = false;
    this.notify();
  }

  /**
   * Safety Ground / Exit Routine:
   * Immediate fade-out of binaural modulation, reset to silence or soft ambient, clear timers.
   */
  public groundAndExit() {
    if (this.ctx && this.masterGain) {
      const now = this.ctx.currentTime;
      // Fade out smoothly over 400ms
      this.masterGain.gain.setValueAtTime(this.masterGain.gain.value, now);
      this.masterGain.gain.exponentialRampToValueAtTime(0.0001, now + 0.4);
      setTimeout(() => {
        this.stopAudioNodes();
        if (this.masterGain && this.ctx) {
          this.masterGain.gain.setValueAtTime(this.config.volume, this.ctx.currentTime);
        }
        this.config.isPlaying = false;
        this.config.spatialPosition = 'CENTER';
        this.applySpatialPosition('CENTER');
        this.notify();
      }, 450);
    } else {
      this.stopAudioNodes();
      this.config.isPlaying = false;
      this.notify();
    }
  }

  private stopAudioNodes() {
    if (this.orbitInterval) {
      clearInterval(this.orbitInterval);
      this.orbitInterval = null;
    }

    try {
      this.oscLeft?.stop();
      this.oscLeft?.disconnect();
    } catch {}
    try {
      this.oscRight?.stop();
      this.oscRight?.disconnect();
    } catch {}
    try {
      this.noiseSource?.stop();
      this.noiseSource?.disconnect();
    } catch {}
    try {
      this.droneOsc1?.stop();
      this.droneOsc1?.disconnect();
      this.droneOsc2?.stop();
      this.droneOsc2?.disconnect();
    } catch {}

    this.oscLeft = null;
    this.oscRight = null;
    this.noiseSource = null;
    this.droneOsc1 = null;
    this.droneOsc2 = null;
  }

  public setPreset(presetId: string) {
    const preset = AUDIO_PRESETS.find((p) => p.id === presetId);
    if (!preset) return;

    this.config.activePresetId = preset.id;
    this.config.carrierFreq = preset.carrierFreq;
    this.config.beatDiff = preset.beatDiff;

    if (this.ctx && this.config.isPlaying) {
      const now = this.ctx.currentTime;
      if (this.oscLeft && this.oscRight) {
        this.oscLeft.frequency.setTargetAtTime(preset.carrierFreq, now, 0.1);
        this.oscRight.frequency.setTargetAtTime(preset.carrierFreq + preset.beatDiff, now, 0.1);
      }
      if (this.droneOsc1 && this.droneOsc2) {
        this.droneOsc1.frequency.setTargetAtTime(preset.carrierFreq / 2, now, 0.2);
        this.droneOsc2.frequency.setTargetAtTime((preset.carrierFreq / 2) * 1.5, now, 0.2);
      }
    }
    this.notify();
  }

  public setFrequencies(carrierFreq: number, beatDiff: number) {
    this.config.carrierFreq = carrierFreq;
    this.config.beatDiff = beatDiff;
    this.config.activePresetId = 'custom';

    if (this.ctx && this.config.isPlaying && this.oscLeft && this.oscRight) {
      const now = this.ctx.currentTime;
      this.oscLeft.frequency.setTargetAtTime(carrierFreq, now, 0.05);
      this.oscRight.frequency.setTargetAtTime(carrierFreq + beatDiff, now, 0.05);
    }
    this.notify();
  }

  private set3DPosition(x: number, y: number, z: number, timeConstant: number = 0.08) {
    if (!this.ctx || !this.spatialPanner3D) return;
    const now = this.ctx.currentTime;
    if (this.spatialPanner3D.positionX) {
      this.spatialPanner3D.positionX.setTargetAtTime(x, now, timeConstant);
      this.spatialPanner3D.positionY.setTargetAtTime(y, now, timeConstant);
      this.spatialPanner3D.positionZ.setTargetAtTime(z, now, timeConstant);
    } else {
      const p = this.spatialPanner3D as unknown as { setPosition?: (x: number, y: number, z: number) => void };
      p.setPosition?.(x, y, z);
    }
  }

  public setSpatialPosition(pos: SpatialPosition, applyAcousticFrequencies: boolean = true) {
    this.config.spatialPosition = pos;

    if (applyAcousticFrequencies && ACOUSTIC_BINAURAL_PROFILES[pos]) {
      const profile = ACOUSTIC_BINAURAL_PROFILES[pos];
      this.config.carrierFreq = profile.carrierFreq;
      this.config.beatDiff = profile.beatDiff;
      this.config.activePresetId = `acoustic_${pos.toLowerCase()}`;

      if (this.ctx && this.config.isPlaying && this.oscLeft && this.oscRight) {
        const now = this.ctx.currentTime;
        this.oscLeft.frequency.setTargetAtTime(profile.carrierFreq, now, 0.08);
        this.oscRight.frequency.setTargetAtTime(profile.carrierFreq + profile.beatDiff, now, 0.08);
      }
      if (this.ctx && this.config.isPlaying && this.droneOsc1 && this.droneOsc2) {
        const now = this.ctx.currentTime;
        this.droneOsc1.frequency.setTargetAtTime(profile.carrierFreq / 2, now, 0.15);
        this.droneOsc2.frequency.setTargetAtTime((profile.carrierFreq / 2) * 1.5, now, 0.15);
      }
    }

    this.applySpatialPosition(pos);
    this.notify();
  }

  private applySpatialPosition(pos: SpatialPosition) {
    if (this.orbitInterval) {
      clearInterval(this.orbitInterval);
      this.orbitInterval = null;
    }

    if (!this.ctx || !this.spatialPanner || !this.spatialFilter || !this.spatialHighShelf) return;
    const now = this.ctx.currentTime;

    switch (pos) {
      case 'CENTER':
        // Pure Intracranial Core: direct, centered, intimate inside skull with zero Haas delay and flat EQ
        this.set3DPosition(0, 0, 0, 0.08);
        this.spatialPanner.pan.setTargetAtTime(0.0, now, 0.08);
        this.spatialFilter.frequency.setTargetAtTime(16000, now, 0.08);
        this.spatialHighShelf.frequency.setTargetAtTime(3200, now, 0.08);
        this.spatialHighShelf.gain.setTargetAtTime(0.0, now, 0.08);

        // Path routing: 100% direct intracranial, 0% 3D convolution, 0% dorsal delay
        this.spatialCenterGain?.gain.setTargetAtTime(1.0, now, 0.08);
        this.spatialDirectGain?.gain.setTargetAtTime(0.0, now, 0.08);
        this.spatialDorsalGain?.gain.setTargetAtTime(0.0, now, 0.08);

        this.binauralLeftGain?.gain.setTargetAtTime(this.config.binauralVolume, now, 0.08);
        this.binauralRightGain?.gain.setTargetAtTime(this.config.binauralVolume, now, 0.08);
        break;

      case 'FRONT':
        // Anterior / Visual Horizon: projected forward, elevated, bright +5.5dB presence boost
        this.set3DPosition(0, 0.4, -3.0, 0.08);
        this.spatialPanner.pan.setTargetAtTime(0.0, now, 0.08);
        this.spatialFilter.frequency.setTargetAtTime(18000, now, 0.08);
        this.spatialHighShelf.frequency.setTargetAtTime(3200, now, 0.08);
        this.spatialHighShelf.gain.setTargetAtTime(5.5, now, 0.08); // +5.5 dB crisp forward concha boost

        // Path routing: 3D HRTF active, dorsal delay 0
        this.spatialCenterGain?.gain.setTargetAtTime(0.0, now, 0.08);
        this.spatialDirectGain?.gain.setTargetAtTime(1.15, now, 0.08);
        this.spatialDorsalGain?.gain.setTargetAtTime(0.0, now, 0.08);

        this.binauralLeftGain?.gain.setTargetAtTime(this.config.binauralVolume, now, 0.08);
        this.binauralRightGain?.gain.setTargetAtTime(this.config.binauralVolume, now, 0.08);
        break;

      case 'BACK':
        // Dorsal / Occipital: localized behind the head with steep 340Hz pinna shadow, -14dB cut, and 16ms Haas dorsal delay
        this.set3DPosition(0, -0.3, 3.0, 0.08);
        this.spatialPanner.pan.setTargetAtTime(0.0, now, 0.08);
        this.spatialFilter.frequency.setTargetAtTime(340, now, 0.08); // Steep dorsal pinna occlusion filter
        this.spatialHighShelf.frequency.setTargetAtTime(1600, now, 0.08);
        this.spatialHighShelf.gain.setTargetAtTime(-14.0, now, 0.08); // -14 dB dorsal cut

        // Path routing: 3D HRTF attenuated + 16ms Haas delay active
        this.spatialCenterGain?.gain.setTargetAtTime(0.0, now, 0.08);
        this.spatialDirectGain?.gain.setTargetAtTime(0.65, now, 0.08);
        this.spatialDorsalGain?.gain.setTargetAtTime(0.6, now, 0.08); // 16ms rear reflection

        this.binauralLeftGain?.gain.setTargetAtTime(this.config.binauralVolume * 0.85, now, 0.08);
        this.binauralRightGain?.gain.setTargetAtTime(this.config.binauralVolume * 0.85, now, 0.08);
        break;

      case 'LEFT':
        // Left Ear Focus (Memory / Past / Q-I)
        this.set3DPosition(-3.5, 0, 0, 0.08);
        this.spatialPanner.pan.setTargetAtTime(-0.95, now, 0.08);
        this.spatialFilter.frequency.setTargetAtTime(16000, now, 0.08);
        this.spatialHighShelf.gain.setTargetAtTime(0.0, now, 0.08);

        this.spatialCenterGain?.gain.setTargetAtTime(0.0, now, 0.08);
        this.spatialDirectGain?.gain.setTargetAtTime(1.0, now, 0.08);
        this.spatialDorsalGain?.gain.setTargetAtTime(0.0, now, 0.08);

        this.binauralLeftGain?.gain.setTargetAtTime(this.config.binauralVolume, now, 0.08);
        this.binauralRightGain?.gain.setTargetAtTime(this.config.binauralVolume * 0.35, now, 0.08);
        break;

      case 'RIGHT':
        // Right Ear Focus (Projection / Future / Q-IV)
        this.set3DPosition(3.5, 0, 0, 0.08);
        this.spatialPanner.pan.setTargetAtTime(0.95, now, 0.08);
        this.spatialFilter.frequency.setTargetAtTime(16000, now, 0.08);
        this.spatialHighShelf.gain.setTargetAtTime(0.0, now, 0.08);

        this.spatialCenterGain?.gain.setTargetAtTime(0.0, now, 0.08);
        this.spatialDirectGain?.gain.setTargetAtTime(1.0, now, 0.08);
        this.spatialDorsalGain?.gain.setTargetAtTime(0.0, now, 0.08);

        this.binauralLeftGain?.gain.setTargetAtTime(this.config.binauralVolume * 0.35, now, 0.08);
        this.binauralRightGain?.gain.setTargetAtTime(this.config.binauralVolume, now, 0.08);
        break;

      case 'ORBIT':
        // Gyroscopic 360-Degree Continuous Orbit
        this.spatialCenterGain?.gain.setTargetAtTime(0.0, now, 0.08);
        this.spatialDirectGain?.gain.setTargetAtTime(1.0, now, 0.08);

        this.orbitInterval = window.setInterval(() => {
          if (!this.spatialPanner || !this.spatialFilter || !this.spatialHighShelf || !this.ctx) return;
          this.orbitAngle += 0.05;
          const x = Math.sin(this.orbitAngle) * 3.0;
          const z = -Math.cos(this.orbitAngle) * 3.0;
          this.set3DPosition(x, 0, z, 0.08);

          const pan = Math.sin(this.orbitAngle) * 0.9;
          const frontBack = -Math.cos(this.orbitAngle); // +1 = Front (z = -3), -1 = Back (z = +3)

          const cutoff = 340 + (frontBack + 1) * 0.5 * (18000 - 340);
          const shelfGain = -12 + (frontBack + 1) * 0.5 * 17.5;
          const dorsalGain = Math.max(0, -frontBack * 0.55);

          const t = this.ctx.currentTime;
          this.spatialPanner.pan.setValueAtTime(pan, t);
          this.spatialFilter.frequency.setValueAtTime(cutoff, t);
          this.spatialHighShelf.gain.setValueAtTime(shelfGain, t);
          this.spatialDorsalGain?.gain.setValueAtTime(dorsalGain, t);

          const leftVol = (0.55 - 0.45 * (pan / 0.9)) * this.config.binauralVolume;
          const rightVol = (0.55 + 0.45 * (pan / 0.9)) * this.config.binauralVolume;
          this.binauralLeftGain?.gain.setValueAtTime(Math.max(0.1, leftVol), t);
          this.binauralRightGain?.gain.setValueAtTime(Math.max(0.1, rightVol), t);
        }, 80);
        break;
    }
  }

  /**
   * Activate an acoustic spatial position with true binaural beats at its designated frequencies.
   * - If already playing: smoothly glides carrier and beat difference frequencies.
   * - If not playing: starts the binaural beat synthesis engine configured with the active session timer.
   */
  public async playAcousticBinaural(pos: SpatialPosition, durationSeconds?: number): Promise<void> {
    const profile = ACOUSTIC_BINAURAL_PROFILES[pos];
    if (!profile) return;

    if (durationSeconds !== undefined) {
      this.config.timerDurationSeconds = durationSeconds;
      this.config.timerRemainingSeconds = durationSeconds;
    }

    this.config.carrierFreq = profile.carrierFreq;
    this.config.beatDiff = profile.beatDiff;
    this.config.spatialPosition = pos;
    this.config.activePresetId = `acoustic_${pos.toLowerCase()}`;

    if (!this.config.isPlaying) {
      await this.start();
    } else {
      if (this.ctx && this.oscLeft && this.oscRight) {
        const now = this.ctx.currentTime;
        this.oscLeft.frequency.setTargetAtTime(profile.carrierFreq, now, 0.08);
        this.oscRight.frequency.setTargetAtTime(profile.carrierFreq + profile.beatDiff, now, 0.08);
      }
      if (this.ctx && this.droneOsc1 && this.droneOsc2) {
        const now = this.ctx.currentTime;
        this.droneOsc1.frequency.setTargetAtTime(profile.carrierFreq / 2, now, 0.15);
        this.droneOsc2.frequency.setTargetAtTime((profile.carrierFreq / 2) * 1.5, now, 0.15);
      }
      this.applySpatialPosition(pos);
      if (durationSeconds !== undefined && durationSeconds !== null) {
        this.startTimerCountdown();
      }
      this.notify();
    }
  }

  /**
   * Test or activate a spatial acoustic region using binaural beats at its designated frequencies.
   */
  public async testSpatialRegion(pos: SpatialPosition): Promise<void> {
    await this.playAcousticBinaural(pos);
  }

  /**
   * Preview a quadrant's specific acoustic region as binaural beats at its designated frequencies.
   */
  public async previewQuadrantCue(quadrant: QuadrantKey): Promise<void> {
    switch (quadrant) {
      case 'memory': // Q-I (Past / Top-Left) -> Left region (440 Hz + 6.8 Hz Theta)
        await this.playAcousticBinaural('LEFT');
        break;
      case 'future': // Q-IV (Projection / Top-Right) -> Right region (554.37 Hz + 10.0 Hz Alpha)
        await this.playAcousticBinaural('RIGHT');
        break;
      case 'present': // Q-III (Embodiment / Bottom-Right) -> Frontal region (523.25 Hz + 12.0 Hz SMR)
        await this.playAcousticBinaural('FRONT');
        break;
      case 'meaning': // Q-II (Affect / Bottom-Left) -> Dorsal / Back region (196.0 Hz + 4.8 Hz Low Theta)
        await this.playAcousticBinaural('BACK');
        break;
      case 'meta': // Center -> Orbit / Central (528.0 Hz + 40.0 Hz Gamma)
      default:
        await this.playAcousticBinaural('ORBIT');
        break;
    }
  }

  public setVolumes(master: number, binaural: number, ambient: number, drone: number) {
    this.config.volume = master;
    this.config.binauralVolume = binaural;
    this.config.ambientVolume = ambient;
    this.config.droneVolume = drone;

    if (this.ctx) {
      const now = this.ctx.currentTime;
      this.masterGain?.gain.setTargetAtTime(master, now, 0.05);
      this.binauralLeftGain?.gain.setTargetAtTime(binaural, now, 0.05);
      this.binauralRightGain?.gain.setTargetAtTime(binaural, now, 0.05);
      this.noiseGain?.gain.setTargetAtTime(ambient, now, 0.05);
      this.droneGain?.gain.setTargetAtTime(drone, now, 0.05);
    }
    this.notify();
  }

  public setNoiseType(type: 'pink' | 'brown' | 'white' | 'none' | 'off') {
    this.config.noiseType = (type === 'none' ? 'off' : type) as 'pink' | 'brown' | 'white' | 'off';
    if (this.config.isPlaying) {
      try {
        this.noiseSource?.stop();
        this.noiseSource?.disconnect();
      } catch {}
      this.startNoise(this.config.noiseType);
    }
    this.notify();
  }

  public async testHeadphones(ear: 'left' | 'right'): Promise<void> {
    await this.init();
    if (!this.ctx || !this.preMasterBus) return;

    const osc = this.ctx.createOscillator();
    const gain = this.ctx.createGain();
    const panner = this.ctx.createStereoPanner();

    osc.type = 'sine';
    // Clean, musical test tones: A4 (440Hz) for Left, C#5 (554.37Hz) for Right
    osc.frequency.setValueAtTime(ear === 'left' ? 440 : 554.37, this.ctx.currentTime);
    panner.pan.setValueAtTime(ear === 'left' ? -1.0 : 1.0, this.ctx.currentTime);

    const now = this.ctx.currentTime;
    gain.gain.setValueAtTime(0, now);
    gain.gain.linearRampToValueAtTime(0.35, now + 0.08);
    gain.gain.setValueAtTime(0.35, now + 1.1);
    gain.gain.linearRampToValueAtTime(0.0001, now + 1.5);

    osc.connect(panner);
    panner.connect(gain);
    // Connect through preMasterBus to honor hardware channel orientation (swapChannels)
    gain.connect(this.preMasterBus);

    osc.start(now);
    osc.stop(now + 1.55);

    setTimeout(() => {
      try {
        osc.disconnect();
        panner.disconnect();
        gain.disconnect();
      } catch {}
    }, 1600);
  }
}

// Global Singleton
export const audioEngine = new QuadraAudioEngine();
