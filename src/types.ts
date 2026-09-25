export type QuadrantKey = 'memory' | 'meaning' | 'present' | 'future' | 'meta';

export type SpatialPosition = 'FRONT' | 'BACK' | 'LEFT' | 'RIGHT' | 'CENTER' | 'ORBIT';

export type NoiseType = 'pink' | 'brown' | 'white' | 'none' | 'off';

export interface QuadraSolveResult {
  past: string;
  meaning: string;
  present: string;
  future: string;
  meta: string;
}

export interface InterpersonalResult {
  observableEvent: string;
  myQuadrantDeconstruction: {
    past: string;
    meaning: string;
    present: string;
    future: string;
  };
  counterpartHypothesizedQuadrants: {
    past: string;
    meaning: string;
    present: string;
    future: string;
  };
  dialecticQuestions: string[];
  synthesisRecommendation: string;
}

export interface QuadrantMeta {
  key: QuadrantKey;
  label: string;
  sublabel: string;
  question: string;
  color: string;
  borderColor: string;
  accentHex: string;
  description: string;
}

export interface ExercisePhase {
  name: string;
  quadrant: QuadrantKey;
  audioPreset?: string;
  facilitatorPrompt: string;
  duration: number; // seconds
}

export interface QuadraExercise {
  id: string;
  title: string;
  description: string;
  duration: number; // total default duration in seconds
  wave: number; // 1 - 8
  waveName: string;
  category: string;
  phases: ExercisePhase[];
  keyQuestion: string;
}

export interface AudioPreset {
  id: string;
  name: string;
  carrierFreq: number; // Hz (e.g. 200)
  beatDiff: number; // Hz (e.g. 7.0 for Drift)
  targetBand: string; // e.g. "Alpha 8–12 Hz"
  description: string;
  purpose: string;
}

export interface AcousticBinauralProfile {
  position: SpatialPosition;
  carrierFreq: number;
  beatDiff: number;
  targetBand: string;
  name: string;
  quadrantName: string;
  description: string;
}

export interface AudioEngineConfig {
  carrierFreq: number;
  beatDiff: number;
  volume: number;
  binauralVolume: number;
  ambientVolume: number;
  droneVolume: number;
  noiseType: 'pink' | 'brown' | 'white' | 'off';
  spatialPosition: SpatialPosition;
  swapChannels: boolean;
  isPlaying: boolean;
  activePresetId: string;
  waveType: 'sine' | 'triangle';
  breathingPaceSeconds: number; // 4s inhale, 4s exhale
  timerDurationSeconds: number | null; // null = continuous
  timerRemainingSeconds: number | null;
  isTimerActive: boolean;
}

export interface SightAllocation {
  memory: number; // 0 - 100
  meaning: number; // 0 - 100
  present: number; // 0 - 100
  future: number; // 0 - 100
}

export interface JournalEntry {
  id: string;
  timestamp: number;
  dateStr: string;
  exerciseId: string;
  exerciseTitle: string;
  durationSeconds: number;
  stateBefore: string;
  stateAfter: string;
  memory: string;
  meaning: string;
  presentSensation: string;
  possibleFuture: string;
  unexpectedObservation: string;
  integration: string;
  rating: number; // 1-5
  quadrantFocus: QuadrantKey;
  sightSnapshot: SightAllocation;
}

export interface CurriculumWave {
  wave: number;
  romanNumeral: string;
  name: string;
  subtitle: string;
  description: string;
  exerciseIds: string[];
}

export interface ModelLabItem {
  id: string;
  title: string;
  category: 'supported' | 'speculative';
  field: string;
  summary: string;
  keyTenets: string[];
  scientificStanding: string;
  quadraRelevance: string;
}

export interface FacilitatorMessage {
  id: string;
  sender: 'facilitator' | 'user';
  text: string;
  timestamp: number;
  quadrant?: QuadrantKey;
}

export interface UserProgress {
  totalPracticeTimeSeconds: number;
  sessionsCompleted: number;
  quadrantMinutes: {
    memory: number;
    meaning: number;
    present: number;
    future: number;
    meta: number;
  };
  exerciseHistory: Record<string, number>;
  averageFocusRating: number;
  averageRelaxationRating: number;
  currentWave: number;
}

export type AvatarSymbol = 'orb' | 'eye' | 'lotus' | 'compass' | 'nexus';
export type AccountTier = 'free' | 'practitioner' | 'premium';

export interface UserProfile {
  id: string;
  uid: string;
  email: string;
  displayName: string;
  curriculumWave: number;
  accountTier: AccountTier;
  avatarSymbol: AvatarSymbol;
  primaryIntention: string;
  preferredBand: string;
  dailyGoalMinutes: number;
  joinedDate: string;
  isLoggedIn: boolean;
  cloudSynced?: boolean;
  lastSyncedAt?: string;
  // Biometric & Journal Security
  biometricsEnabled?: boolean;
  biometricCredentialId?: string;
  biometricRegisteredAt?: string;
  biometricDeviceName?: string;
  securityPin?: string;
  autoLockMinutes?: number;
}

export interface DailyAffirmation {
  id: string;
  quote: string;
  author: string;
  sourceOrContext?: string;
  quadrantFocus: QuadrantKey;
  theme: string;
}

