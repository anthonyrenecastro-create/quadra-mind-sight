import { CurriculumWave } from '../types';

export const CURRICULUM_WAVES: CurriculumWave[] = [
  {
    wave: 1,
    romanNumeral: 'WAVE I',
    name: 'ORIENTATION',
    subtitle: 'Grounding & Basic Somatic Attention',
    description: 'Stabilize somatic awareness, establish baseline breath cadence, and calibrate auditory entrainment without cognitive strain.',
    exerciseIds: ['somatic_field_scan', 'post_sleep_recall']
  },
  {
    wave: 2,
    romanNumeral: 'WAVE II',
    name: 'DIFFERENTIATION',
    subtitle: 'Isolating the Four Quadrants',
    description: 'Train precision focus to cleanly distinguish Memory, Meaning, Embodiment, and Projection as distinct cognitive modes.',
    exerciseIds: ['four_point_awareness']
  },
  {
    wave: 3,
    romanNumeral: 'WAVE III',
    name: 'RECONSTRUCTION',
    subtitle: 'Autobiographical Memory & Emotional Meaning',
    description: 'Deconstruct experiences using Fragment → Pattern → Reconstruction. Map emotional salience and underlying assumptions.',
    exerciseIds: ['memory_reconstruction', 'emotional_meaning_mapping', 'fragment_to_whole', 'symbol_exploration', 'dream_integration']
  },
  {
    wave: 4,
    romanNumeral: 'WAVE IV',
    name: 'PROJECTION',
    subtitle: 'Predictive Modeling & Possible Futures',
    description: 'Treat imagined futures strictly as predictive simulations. Build counterfactual simulations and trace cognitive timelines.',
    exerciseIds: ['possible_futures', 'cognitive_timeline']
  },
  {
    wave: 5,
    romanNumeral: 'WAVE V',
    name: 'SYNCHRONIZATION',
    subtitle: 'Dynamic Inter-Quadrant Shifting',
    description: 'Master intentional switching across all four experiential perspectives through spatial auditory steering and Quadra Sync.',
    exerciseIds: ['quadra_sync', 'perspective_rotation']
  },
  {
    wave: 6,
    romanNumeral: 'WAVE VI',
    name: 'META AWARENESS',
    subtitle: 'Witnessing the Observer',
    description: 'Rest in the unconditioned awareness that notices thoughts, emotions, memories, and future projections without identification.',
    exerciseIds: ['observer_exercise', 'open_awareness']
  },
  {
    wave: 7,
    romanNumeral: 'WAVE VII',
    name: 'DIALECTIC',
    subtitle: 'Tension, Relationship & Paradox',
    description: 'Address interpersonal conflicts, creative dilemmas, and cognitive contradictions by holding opposing truths simultaneously.',
    exerciseIds: ['interpersonal_quadra_exercise', 'creative_problem_space', 'decision_quadrants', 'contradiction_holding']
  },
  {
    wave: 8,
    romanNumeral: 'WAVE VIII',
    name: 'INTEGRATION',
    subtitle: 'Unified Coherence & Silent Mastery',
    description: 'Synthesize all four quadrants into an integrated self-authored narrative and practice autonomous, silent navigation.',
    exerciseIds: ['pre_sleep_reflection', 'silent_quadra']
  }
];
