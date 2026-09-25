import { ModelLabItem } from '../types';

export const MODEL_LAB_ITEMS: ModelLabItem[] = [
  // --- SUPPORTED / MAINSTREAM CONCEPTS ---
  {
    id: 'predictive_processing',
    title: 'Predictive Processing & Active Inference',
    category: 'supported',
    field: 'Cognitive Neuroscience',
    summary: 'The brain operates not as a passive sensory receiver, but as a hierarchical prediction engine that continually generates internal generative models of reality and tests them against incoming sensory error signals.',
    keyTenets: [
      'Top-down expectations constantly shape and constrain bottom-up raw sensory data.',
      'Perception is controlled hallucination: you perceive your model of the world updated by prediction errors.',
      'Active inference: the organism acts in the environment to make reality match its predictions.'
    ],
    scientificStanding: 'High consensus; foundational modern framework in computational neuroscience (Karl Friston, Andy Clark).',
    quadraRelevance: 'Directly informs Quadrant IV (Projection): users recognize that future scenarios are mental simulations designed to minimize surprise, not literal facts.'
  },
  {
    id: 'binaural_perception',
    title: 'Binaural Auditory Perception & Superior Olivary Complex',
    category: 'supported',
    field: 'Auditory Neurophysiology',
    summary: 'When two slightly different frequency tones are presented dichotically (one in each ear via headphones), the brainstem calculates the phase differential, producing a perceptual illusion of a rhythmic beat.',
    keyTenets: [
      'Discovered by Heinrich Wilhelm Dove in 1839; quantified by Gerald Oster in 1973.',
      'Processed in the superior olivary complex in the brainstem, which is responsible for spatial sound localization.',
      'Functions as an acoustic pacing stimulus, promoting attentional focus and rhythmic auditory entrainment.'
    ],
    scientificStanding: 'Well-established psychoacoustic phenomenon; behavioral entrainment effects are modest but replicable for focus and relaxation.',
    quadraRelevance: 'Forms the acoustic foundation of Quadra Audio Engine. Presets (Ground 10Hz, Drift 6.8Hz, Deep 4.8Hz) provide clean, non-dogmatic acoustic anchors.'
  },
  {
    id: 'memory_reconstruction_reconsolidation',
    title: 'Memory Reconstruction & Reconsolidation',
    category: 'supported',
    field: 'Cognitive Psychology',
    summary: 'Autobiographical episodic memory is not a fixed video recording stored in a neural filing cabinet. Every act of recall rebuilds the memory from fragments and renders it temporarily labile before reconsolidating.',
    keyTenets: [
      'Memories are reconstructed dynamically around minimal sensory cues and current emotional states.',
      'During recall, synaptic protein synthesis allows the narrative to be updated with present context (reconsolidation).',
      'Cognitive gaps are filled with plausible inferences, often blurring event vs interpretation.'
    ],
    scientificStanding: 'Overwhelming experimental consensus (Elizabeth Loftus, Karim Nader, Daniel Schacter).',
    quadraRelevance: 'Core of Quadrant I: Fragment → Pattern → Reconstruction. Teaches users to notice how recall is assembled rather than passively stored.'
  },
  {
    id: 'interoception_insular',
    title: 'Interoception & Insular Cortex Mapping',
    category: 'supported',
    field: 'Neurobiology & Somatics',
    summary: 'Interoception is the nervous system\'s real-time representation of internal physiological states (heartbeat, respiration, gut motility, muscular tension) mediated by the anterior insular cortex.',
    keyTenets: [
      'The insula integrates visceral sensations into the conscious feeling of "how my body feels right now".',
      'High interoceptive acuity correlates directly with superior emotional regulation and stress resilience.',
      'Anchoring attention in somatic sensation interrupts default-mode rumination.'
    ],
    scientificStanding: 'Extensively documented (A.D. Craig, Antonio Damasio, Hugo Critchley).',
    quadraRelevance: 'Anchors Quadrant III (Embodiment). Serves as the biological grounding circuit that prevents abstract dissociation during deep visualization.'
  },
  {
    id: 'metacognition_dm_sn',
    title: 'Metacognition & Default Mode / Salience Network Switching',
    category: 'supported',
    field: 'Functional Neuroimaging',
    summary: 'Metacognition—the capacity to monitor and regulate one\'s own cognitive processes—relies on dynamic coordination between the Central Executive Network, Default Mode Network, and Salience Network.',
    keyTenets: [
      'Default Mode Network (DMN) drives mind-wandering, autobiographical self-narrative, and unmonitored rumination.',
      'Salience Network (anterior cingulate cortex, insula) detects significant changes and triggers cognitive shifts.',
      'Metacognitive monitoring decouples emotional triggers from automated behavioral impulses.'
    ],
    scientificStanding: 'Robust neuroimaging evidence (Marcus Raichle, Matthew Lieberman, Michael Posner).',
    quadraRelevance: 'Underpins Central META awareness: users shift from being the narrative to observing the construction of the narrative.'
  },
  {
    id: 'cognitive_reframing',
    title: 'Cognitive Reframing & Affective Decoupling',
    category: 'supported',
    field: 'Clinical Psychology & CBT',
    summary: 'The emotional impact of an event is mediated not by the event itself, but by the cognitive appraisal, assumptions, and meaning assigned to it.',
    keyTenets: [
      'Event → Interpretation → Emotion → Action (Epictetus & Aaron Beck).',
      'Separating raw factual events from interpretive attributions reduces maladaptive affective intensity.',
      'Holding alternative perspectives increases cognitive flexibility.'
    ],
    scientificStanding: 'Gold-standard therapeutic framework with thousands of randomized controlled trials.',
    quadraRelevance: 'Powers Quadrant II (Affect / Meaning) and Interpersonal Quadra: users dissect interactions into objective camera recordings vs internal stories.'
  },

  // --- EXPERIMENTAL / SPECULATIVE MODELS ---
  {
    id: 'orch_or',
    title: 'Orch OR (Orchestrated Objective Reduction)',
    category: 'speculative',
    field: 'Quantum Biology / Theoretical Physics',
    summary: 'A controversial hypothesis proposing that consciousness originates not from classical neural computations alone, but from quantum computations within neuronal microtubules.',
    keyTenets: [
      'Formulated by theoretical physicist Roger Penrose and anesthesiologist Stuart Hameroff.',
      'Suggests tubulin protein subunits maintain quantum superpositions orchestrated by synaptic inputs.',
      'Collapses of the wave function (objective reduction) correspond to discrete moments of conscious experience ("quanta of awareness").'
    ],
    scientificStanding: 'Speculative Hypothesis. Widely critiqued by mainstream neuroscientists who argue that warm, wet biological brains decohere quantum states too quickly.',
    quadraRelevance: 'Explored in Model Lab as a provocative perspective on the physical substrate of consciousness, strictly demarcated as an unproven hypothesis.'
  },
  {
    id: 'frohlich_superradiance',
    title: 'Fröhlich Condensation & Biological Superradiance',
    category: 'speculative',
    field: 'Biophysics',
    summary: 'The conjecture that energy pumped into biological dipole oscillations (such as cell membranes or proteins) can condense into a single coherent vibrational macroscopic mode.',
    keyTenets: [
      'Proposed by physicist Herbert Fröhlich in 1968.',
      'Posits coherent long-range electromagnetic resonance across biomolecules.',
      'Hypothesized to enable ultra-efficient intercellular communication and macro-scale synchronization.'
    ],
    scientificStanding: 'Experimental/Theoretical. Emerging optical measurements find faint long-lived vibrational states in certain protein lattices, but application to human consciousness remains hypothetical.',
    quadraRelevance: 'Conceptual analog for Quadra Sync: exploring how disparate cognitive streams might coordinate into a coherent emergent state.'
  },
  {
    id: 'holographic_consciousness',
    title: 'Holographic Brain & Implicate Order',
    category: 'speculative',
    field: 'Neuropsychology / Philosophy of Physics',
    summary: 'Karl Pribram and David Bohm hypothesized that memory and perceptual processing operate holographically, wherein memory is distributed throughout the neural field rather than localized.',
    keyTenets: [
      'Inspired by Fourier transform mathematics and holographic interference patterns.',
      'Explains why large brain lesions often degrade memory fidelity proportionally rather than deleting specific individual memories.',
      'Bohm extended this to the "Implicate Order," viewing physical reality and mind as projections of an enfolded informational substrate.'
    ],
    scientificStanding: 'Historical speculative model. Modern neuroscience has found distributed neural representations (associative networks), but the literal optical hologram model is considered metaphorical.',
    quadraRelevance: 'Provides an intuitive visualization metaphor for Fragment → Pattern → Whole reconstruction in Quadrant I.'
  },
  {
    id: 'informational_substrate',
    title: 'Consciousness as Informational Geometry (Integrated Information Theory)',
    category: 'speculative',
    field: 'Mathematical Consciousness Science',
    summary: 'Proposes that consciousness is an intrinsic, fundamental property of any physical system with a high degree of irreducibly integrated causal power (Φ / Phi).',
    keyTenets: [
      'Developed by Giulio Tononi and Christof Koch.',
      'Conscious experience corresponds directly to the maximally irreducible conceptual structure generated by a system.',
      'Implies panpsychist considerations: any system with non-zero Φ possesses a degree of subjective experience.'
    ],
    scientificStanding: 'Rigorous mathematical framework, but currently experimentally unfalsifiable at scale; empirical validation continues to provoke intense scientific debate.',
    quadraRelevance: 'Inspires the 4-quadrant geometric visualizer: representing conscious awareness as an integrated, multi-perspective causal geometry.'
  }
];
