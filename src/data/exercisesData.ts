import { QuadraExercise } from '../types';

export const QUADRA_EXERCISES: QuadraExercise[] = [
  {
    id: 'quadra_sync',
    title: 'Quadra Sync',
    wave: 5,
    waveName: 'WAVE V — SYNCHRONIZATION',
    category: 'Core Protocol',
    description: 'The foundational 7-stage practice: gradual introduction and integration of Present, Memory, Meaning, and Projection.',
    duration: 600, // 10 minutes
    keyQuestion: 'What remains when you observe all four at once?',
    phases: [
      {
        name: 'Stage 1: Present Grounding',
        quadrant: 'present',
        audioPreset: 'ground',
        duration: 90,
        facilitatorPrompt: 'Direct your complete sensory attention to physical embodiment right now. Notice the weight of the body, breath cadence, and spatial orientation.'
      },
      {
        name: 'Stage 2: Present + Memory',
        quadrant: 'memory',
        audioPreset: 'drift',
        duration: 90,
        facilitatorPrompt: 'While anchoring in the physical body, allow one autobiographical memory to emerge. Notice the fragment: a sound, an image, an environmental texture.'
      },
      {
        name: 'Stage 3: Present + Emotional Meaning',
        quadrant: 'meaning',
        audioPreset: 'drift',
        duration: 90,
        facilitatorPrompt: 'Observe what emotional significance or salience accompanies that memory. Notice the narrative your mind assembles around it.'
      },
      {
        name: 'Stage 4: Present + Future Simulation',
        quadrant: 'future',
        audioPreset: 'deep',
        duration: 90,
        facilitatorPrompt: 'Notice how this memory and meaning trigger a future projection. What possible future does your predictive mind simulate?'
      },
      {
        name: 'Stage 5: Deliberate Quadrant Cycling',
        quadrant: 'meta',
        audioPreset: 'deep',
        duration: 90,
        facilitatorPrompt: 'Deliberately rotate your attention: Past memory → Present body → Emotional meaning → Future projection. Feel the intentional shift.'
      },
      {
        name: 'Stage 6: Non-Identification Observation',
        quadrant: 'meta',
        audioPreset: 'threshold',
        duration: 90,
        facilitatorPrompt: 'Observe all four streams simultaneously without identifying completely with any individual stream. You are the space in which they arise.'
      },
      {
        name: 'Stage 7: Coherent Integration',
        quadrant: 'meta',
        audioPreset: 'ground',
        duration: 60,
        facilitatorPrompt: 'What remains when you observe all four at once? Integrate the experience into one clear observation without forcing a conclusion.'
      }
    ]
  },
  {
    id: 'four_point_awareness',
    title: 'Four-Point Awareness',
    wave: 2,
    waveName: 'WAVE II — DIFFERENTIATION',
    category: 'Attention Training',
    description: 'Learn to isolate and cleanly distinguish each of the four quadrants without blending interpretation with sensation.',
    duration: 480,
    keyQuestion: 'Can you hold each point in clear separation?',
    phases: [
      { name: 'Point 1: Memory (Past)', quadrant: 'memory', audioPreset: 'drift', duration: 120, facilitatorPrompt: 'Isolate Memory. What brought you here? Notice the sensory history without judgment.' },
      { name: 'Point 2: Affect (Meaning)', quadrant: 'meaning', audioPreset: 'drift', duration: 120, facilitatorPrompt: 'Isolate Affect. What does this mean to you? Notice value, motivation, and symbolic charge.' },
      { name: 'Point 3: Embodiment (Present)', quadrant: 'present', audioPreset: 'ground', duration: 120, facilitatorPrompt: 'Isolate Embodiment. What is happening now? Anchor in proprioception and bodily sensation.' },
      { name: 'Point 4: Projection (Future)', quadrant: 'future', audioPreset: 'deep', duration: 120, facilitatorPrompt: 'Isolate Projection. What could happen next? Treat it purely as a predictive mental model.' }
    ]
  },
  {
    id: 'memory_reconstruction',
    title: 'Memory Reconstruction',
    wave: 3,
    waveName: 'WAVE III — RECONSTRUCTION',
    category: 'Autobiographical Recall',
    description: 'Train the mind to reconstruct autobiographical experiences from minimal cues: Fragment → Pattern → Reconstruction.',
    duration: 600,
    keyQuestion: 'Where does raw sensory recall end and storytelling begin?',
    phases: [
      { name: 'The Minimal Cue', quadrant: 'memory', audioPreset: 'drift', duration: 120, facilitatorPrompt: 'Begin with a single minimal sensory cue: a sound, a color tone, or a spatial texture from your past.' },
      { name: 'Pattern Crystallization', quadrant: 'memory', audioPreset: 'drift', duration: 180, facilitatorPrompt: 'Allow associated details to assemble around the cue. Do not force recall; let the pattern self-organize.' },
      { name: 'Full Scene Reconstruction', quadrant: 'memory', audioPreset: 'deep', duration: 180, facilitatorPrompt: 'Observe the reconstructed environment: lighting, ambient sound, temperature, and your position inside it.' },
      { name: 'Observation vs Construction', quadrant: 'meta', audioPreset: 'ground', duration: 120, facilitatorPrompt: 'Notice the boundary: what part is genuine sensory memory, and what part did your cognitive engine infer?' }
    ]
  },
  {
    id: 'emotional_meaning_mapping',
    title: 'Emotional Meaning Mapping',
    wave: 3,
    waveName: 'WAVE III — RECONSTRUCTION',
    category: 'Affective Literacy',
    description: 'Deconstruct emotional charges into raw event, narrative interpretation, underlying assumption, and somatic response.',
    duration: 540,
    keyQuestion: 'What assumption generates this emotional charge?',
    phases: [
      { name: 'The Trigger Event', quadrant: 'present', audioPreset: 'ground', duration: 120, facilitatorPrompt: 'Identify an emotionally salient event. Strip away all adjectives and describe only objective observable facts.' },
      { name: 'The Meaning Narrative', quadrant: 'meaning', audioPreset: 'drift', duration: 150, facilitatorPrompt: 'What meaning did you assign? What does this event supposedly prove about you, others, or reality?' },
      { name: 'Underlying Assumptions', quadrant: 'meaning', audioPreset: 'deep', duration: 150, facilitatorPrompt: 'What hidden assumption must be true for this meaning to make sense? Hold it with gentle curiosity.' },
      { name: 'Dialectic Deconstruction', quadrant: 'meta', audioPreset: 'ground', duration: 120, facilitatorPrompt: 'Can you hold the event without the interpretation? Notice the space that opens when meaning is uncoupled from fact.' }
    ]
  },
  {
    id: 'somatic_field_scan',
    title: 'Somatic Field Scan',
    wave: 1,
    waveName: 'WAVE I — ORIENTATION',
    category: 'Embodiment',
    description: 'Deep interoceptive mapping across the physical body, breath, tension gradient, and spatial field.',
    duration: 480,
    keyQuestion: 'What physical sensations are actively present right now?',
    phases: [
      { name: 'Periphery Awareness', quadrant: 'present', audioPreset: 'ground', duration: 120, facilitatorPrompt: 'Notice the soles of your feet, your palms, and the skin barrier contacting ambient air.' },
      { name: 'Center & Core', quadrant: 'present', audioPreset: 'ground', duration: 120, facilitatorPrompt: 'Shift inward to diaphragmatic expansion, heartbeat resonance, and visceral somatic cues in the abdomen.' },
      { name: 'Tension Release', quadrant: 'present', audioPreset: 'deep', duration: 120, facilitatorPrompt: 'Scan the jaw, temples, neck, and shoulders. Soften residual bracing without judgment.' },
      { name: 'Unified Body Field', quadrant: 'present', audioPreset: 'threshold', duration: 120, facilitatorPrompt: 'Experience the body not as isolated parts, but as a single luminous, vibrating field of sensation.' }
    ]
  },
  {
    id: 'possible_futures',
    title: 'Possible Futures',
    wave: 4,
    waveName: 'WAVE IV — PROJECTION',
    category: 'Predictive Modeling',
    description: 'Construct counterfactual simulations and multiple divergent trajectories without mistaking them for supernatural foresight.',
    duration: 540,
    keyQuestion: 'What mental simulations is your predictive engine running?',
    phases: [
      { name: 'Baseline Simulation', quadrant: 'future', audioPreset: 'drift', duration: 120, facilitatorPrompt: 'Observe the default trajectory your mind automatically simulates regarding an upcoming challenge.' },
      { name: 'Divergent Counterfactual A', quadrant: 'future', audioPreset: 'deep', duration: 150, facilitatorPrompt: 'Construct an alternative trajectory where an unexpected obstacle forces a creative pivot.' },
      { name: 'Divergent Counterfactual B', quadrant: 'future', audioPreset: 'deep', duration: 150, facilitatorPrompt: 'Construct a third simulation where serendipity and collaboration resolve the tension effortlessly.' },
      { name: 'The Simulator Perspective', quadrant: 'meta', audioPreset: 'ground', duration: 120, facilitatorPrompt: 'Observe: None of these are real yet. They are cognitive tools your mind generates to navigate uncertainty.' }
    ]
  },
  {
    id: 'observer_exercise',
    title: 'Observer Exercise',
    wave: 6,
    waveName: 'WAVE VI — META AWARENESS',
    category: 'Metacognition',
    description: 'Rest directly in the meta-perspective that monitors thoughts, sensations, memories, and projections.',
    duration: 600,
    keyQuestion: 'Who or what is aware of these four quadrants?',
    phases: [
      { name: 'Watching the Stream', quadrant: 'meta', audioPreset: 'drift', duration: 150, facilitatorPrompt: 'Allow thoughts, memories, and body sensations to drift by like clouds in an open sky.' },
      { name: 'Stepping Back 1 Degree', quadrant: 'meta', audioPreset: 'deep', duration: 150, facilitatorPrompt: 'Step back one degree. You are not the thought; you are the silent awareness observing the thought.' },
      { name: 'Resting in the Witness', quadrant: 'meta', audioPreset: 'threshold', duration: 180, facilitatorPrompt: 'Rest in pure witnessing. Notice that this awareness has no weight, no edges, and no anxiety.' },
      { name: 'Returning Grounded', quadrant: 'present', audioPreset: 'ground', duration: 120, facilitatorPrompt: 'Feel the return of sensory embodiment while retaining the spacious observer perspective.' }
    ]
  },
  {
    id: 'perspective_rotation',
    title: 'Perspective Rotation',
    wave: 5,
    waveName: 'WAVE V — SYNCHRONIZATION',
    category: 'Cognitive Agility',
    description: 'Smoothly orbit your attentional focus through the 4 directions: Past → Meaning → Present → Future.',
    duration: 480,
    keyQuestion: 'How smoothly can you pivot between cognitive modes?',
    phases: [
      { name: 'North: Future Projection', quadrant: 'future', audioPreset: 'drift', duration: 120, facilitatorPrompt: 'Face the future quadrant. Examine possibilities, probabilities, and predictive models.' },
      { name: 'East: Embodiment Present', quadrant: 'present', audioPreset: 'ground', duration: 120, facilitatorPrompt: 'Rotate 90 degrees to present embodiment. Feel the immediate tactile reality of now.' },
      { name: 'South: Affective Meaning', quadrant: 'meaning', audioPreset: 'drift', duration: 120, facilitatorPrompt: 'Rotate 90 degrees to emotional significance. Feel the underlying motivation and heart-space.' },
      { name: 'West: Memory Recall', quadrant: 'memory', audioPreset: 'deep', duration: 120, facilitatorPrompt: 'Rotate 90 degrees to memory. Look back across the lineage of past events that brought you here.' }
    ]
  },
  {
    id: 'fragment_to_whole',
    title: 'Fragment-to-Whole',
    wave: 3,
    waveName: 'WAVE III — RECONSTRUCTION',
    category: 'Pattern Completion',
    description: 'Start with an isolated sensory fragment (sound, phrase, image) and observe pattern completion in consciousness.',
    duration: 420,
    keyQuestion: 'How does a tiny fragment trigger an entire world?',
    phases: [
      { name: 'Fragment Isolation', quadrant: 'memory', audioPreset: 'drift', duration: 100, facilitatorPrompt: 'Hold an isolated cue: a specific door latch click, a scent of rain on dust, or a word spoken years ago.' },
      { name: 'Radial Association', quadrant: 'memory', audioPreset: 'deep', duration: 120, facilitatorPrompt: 'Notice associations radiating outward from the seed without deliberate mental effort.' },
      { name: 'Complete Gestalt', quadrant: 'meaning', audioPreset: 'deep', duration: 120, facilitatorPrompt: 'Watch the entire gestalt lock into place—the emotional context, the room, the companion.' },
      { name: 'Metacognitive Audit', quadrant: 'meta', audioPreset: 'ground', duration: 80, facilitatorPrompt: 'Reflect on how rapidly your brain creates a coherent universe from a single sensory fragment.' }
    ]
  },
  {
    id: 'interpersonal_quadra_exercise',
    title: 'Interpersonal Quadra',
    wave: 7,
    waveName: 'WAVE VII — DIALECTIC',
    category: 'Relational Intelligence',
    description: 'Map a difficult interaction across your 4 quadrants and empathically hypothesize the counterpart\'s 4 quadrants.',
    duration: 600,
    keyQuestion: 'What might the other person\'s four quadrants contain?',
    phases: [
      { name: 'Your 4 Quadrants', quadrant: 'meaning', audioPreset: 'ground', duration: 150, facilitatorPrompt: 'Clarify what you observed (Event), what you interpreted (Meaning), what you felt (Embodiment), and what you feared (Projection).' },
      { name: 'The Counterpart\'s Reality', quadrant: 'meta', audioPreset: 'drift', duration: 150, facilitatorPrompt: 'What might their unexpressed past memories and present physical stresses have been in that exact exchange?' },
      { name: 'Dialectic Synthesis', quadrant: 'meta', audioPreset: 'deep', duration: 180, facilitatorPrompt: 'Consider alternative interpretations. What evidence supports their perspective? Where do your models intersect?' },
      { name: 'Grounding Resolution', quadrant: 'present', audioPreset: 'ground', duration: 120, facilitatorPrompt: 'Return to present embodiment. Notice if defensive tension has relaxed into relational clarity.' }
    ]
  },
  {
    id: 'cognitive_timeline',
    title: 'Cognitive Timeline',
    wave: 4,
    waveName: 'WAVE IV — PROJECTION',
    category: 'Temporal Trajectory',
    description: 'Trace an internal concept from its ancestral origins (Past) through its present manifestation into far horizons (Future).',
    duration: 540,
    keyQuestion: 'Where does this belief sit on your cognitive timeline?',
    phases: [
      { name: 'Root in the Past', quadrant: 'memory', audioPreset: 'deep', duration: 140, facilitatorPrompt: 'When was this habit, belief, or ambition first planted in you? Who taught it to you?' },
      { name: 'Present Operation', quadrant: 'present', audioPreset: 'ground', duration: 140, facilitatorPrompt: 'How does it actively dictate your decisions and somatic reactions today?' },
      { name: 'Ten-Year Projection', quadrant: 'future', audioPreset: 'drift', duration: 140, facilitatorPrompt: 'If this continues unchanged for 10 years, where does it lead? What happens if you modify it?' },
      { name: 'Timeline Freedom', quadrant: 'meta', audioPreset: 'ground', duration: 120, facilitatorPrompt: 'Step outside the timeline. You are not trapped in this momentum; you can re-author it now.' }
    ]
  },
  {
    id: 'open_awareness',
    title: 'Open Awareness',
    wave: 6,
    waveName: 'WAVE VI — META AWARENESS',
    category: 'Non-Dual Stillness',
    description: 'Receptive, boundary-less monitoring where sounds, thoughts, and sensations arise and vanish without grasping.',
    duration: 600,
    keyQuestion: 'Can you allow all phenomena without seeking to organize them?',
    phases: [
      { name: 'Dropping the Center', quadrant: 'present', audioPreset: 'ground', duration: 150, facilitatorPrompt: 'Stop managing your attention. Allow ambient sounds to enter your ears without naming their sources.' },
      { name: 'Effortless Inclusion', quadrant: 'meta', audioPreset: 'deep', duration: 180, facilitatorPrompt: 'Internal thoughts, physical tingling, and auditory pulses all arise within the same transparent field.' },
      { name: 'The Unmoving Mirror', quadrant: 'meta', audioPreset: 'threshold', duration: 180, facilitatorPrompt: 'Like a mirror reflecting everything while retaining none, simply be the substrate of awareness.' },
      { name: 'Soft Grounding', quadrant: 'present', audioPreset: 'ground', duration: 90, facilitatorPrompt: 'Gently feel fingers and toes while staying open to the wider field.' }
    ]
  },
  {
    id: 'symbol_exploration',
    title: 'Symbol Exploration',
    wave: 3,
    waveName: 'WAVE III — RECONSTRUCTION',
    category: 'Active Imagination',
    description: 'Evoke an archetypal or personal symbol and examine its resonances across past, emotion, and future potential.',
    duration: 540,
    keyQuestion: 'What does this spontaneous symbol reveal?',
    phases: [
      { name: 'Symbol Induction', quadrant: 'meaning', audioPreset: 'drift', duration: 130, facilitatorPrompt: 'Close your eyes and allow a geometric form, an animal, or a symbolic relic to form in your mental space.' },
      { name: 'Sensory Texture', quadrant: 'present', audioPreset: 'drift', duration: 130, facilitatorPrompt: 'Observe its physical attributes: weight, luminescence, temperature, and ancient or futuristic materials.' },
      { name: 'Symbolic Dialogue', quadrant: 'meaning', audioPreset: 'deep', duration: 160, facilitatorPrompt: 'Ask the symbol: "What aspect of my consciousness do you represent?" Listen to the response.' },
      { name: 'Integration', quadrant: 'meta', audioPreset: 'ground', duration: 120, facilitatorPrompt: 'Absorb the essence of the symbol back into your somatic center before opening your eyes.' }
    ]
  },
  {
    id: 'creative_problem_space',
    title: 'Creative Problem Space',
    wave: 7,
    waveName: 'WAVE VII — DIALECTIC',
    category: 'Applied Dialectic',
    description: 'Construct a multi-dimensional mental laboratory for an intellectual, artistic, or strategic dilemma.',
    duration: 600,
    keyQuestion: 'What novel synthesis resolves this creative tension?',
    phases: [
      { name: 'The Core Constraint', quadrant: 'present', audioPreset: 'ground', duration: 120, facilitatorPrompt: 'Define the obstacle clearly. What are the non-negotiable physical constraints?' },
      { name: 'Historical Cross-Pollination', quadrant: 'memory', audioPreset: 'drift', duration: 140, facilitatorPrompt: 'What unrelated field or historical era solved an analogous tension? Bring that paradigm in.' },
      { name: 'Future Unshackled', quadrant: 'future', audioPreset: 'deep', duration: 180, facilitatorPrompt: 'Assume the constraint is magically inverted. What radical new architecture becomes possible?' },
      { name: 'Actionable Synthesis', quadrant: 'meta', audioPreset: 'gamma_sync', duration: 160, facilitatorPrompt: 'Bridge the radical future back to present constraints. Write down the single highest-leverage first step.' }
    ]
  },
  {
    id: 'dream_integration',
    title: 'Dream Integration',
    wave: 3,
    waveName: 'WAVE III — RECONSTRUCTION',
    category: 'Subconscious Synthesis',
    description: 'Process nighttime dream imagery through the Quadra model to extract somatic meaning and predictive metaphors.',
    duration: 480,
    keyQuestion: 'What was your dreaming mind processing?',
    phases: [
      { name: 'Dream Fragment Recall', quadrant: 'memory', audioPreset: 'drift', duration: 120, facilitatorPrompt: 'Recall one vivid fragment of a recent dream. Re-inhabit the strange logic of that dreamscape.' },
      { name: 'Emotional Residue', quadrant: 'meaning', audioPreset: 'deep', duration: 120, facilitatorPrompt: 'What emotional tone did you wake up with? Fear, awe, confusion, or liberation?' },
      { name: 'Somatic Echo', quadrant: 'present', audioPreset: 'deep', duration: 120, facilitatorPrompt: 'Where is the dream still vibrating in your physical body right now?' },
      { name: 'Metaphorical Translation', quadrant: 'meta', audioPreset: 'ground', duration: 120, facilitatorPrompt: 'Translate the dream from supernatural narrative into a symbolic message about your current waking life.' }
    ]
  },
  {
    id: 'pre_sleep_reflection',
    title: 'Pre-Sleep Reflection',
    wave: 8,
    waveName: 'WAVE VIII — INTEGRATION',
    category: 'Nocturnal Transition',
    description: 'Gentle cognitive clearance: deposit memory, untangle emotional knots, relax the body, release tomorrow.',
    duration: 480,
    keyQuestion: 'Can you set down the four quadrants and rest?',
    phases: [
      { name: 'Releasing the Past Day', quadrant: 'memory', audioPreset: 'deep', duration: 120, facilitatorPrompt: 'Review the day in reverse order like rewinding a film. Thank each event and let it conclude.' },
      { name: 'Clearing Affective Charge', quadrant: 'meaning', audioPreset: 'deep', duration: 120, facilitatorPrompt: 'Release any need to defend or prove yourself tonight. Whatever is unresolved can wait until morning.' },
      { name: 'Surrendering Projection', quadrant: 'future', audioPreset: 'threshold', duration: 120, facilitatorPrompt: 'Hand tomorrow over to tomorrow. Unclench the predictive planning engine.' },
      { name: 'Somatic Sinking', quadrant: 'present', audioPreset: 'threshold', duration: 120, facilitatorPrompt: 'Feel your body sink heavily into the mattress. Allow consciousness to dissolve into restorative sleep.' }
    ]
  },
  {
    id: 'post_sleep_recall',
    title: 'Post-Sleep Recall',
    wave: 1,
    waveName: 'WAVE I — ORIENTATION',
    category: 'Morning Awakening',
    description: 'Gentle re-emergence: awaken somatic presence before memories and future demands rush in.',
    duration: 360,
    keyQuestion: 'How does consciousness reassemble upon waking?',
    phases: [
      { name: 'Somatic Awakening', quadrant: 'present', audioPreset: 'ground', duration: 100, facilitatorPrompt: 'Before moving or checking a screen, feel the warmth in your palms and the rhythm of natural morning breath.' },
      { name: 'Catching the Dream Trail', quadrant: 'memory', audioPreset: 'drift', duration: 100, facilitatorPrompt: 'Gently notice if any dream atmosphere is lingering on the edge of memory.' },
      { name: 'Intention Setting', quadrant: 'future', audioPreset: 'drift', duration: 80, facilitatorPrompt: 'Choose one primary quality of awareness you wish to embody today: patience, curiosity, or presence.' },
      { name: 'Sovereign Alignment', quadrant: 'meta', audioPreset: 'ground', duration: 80, facilitatorPrompt: 'Arise not as a victim of circumstances, but as the grounded observer of your day.' }
    ]
  },
  {
    id: 'decision_quadrants',
    title: 'Decision Quadrants',
    wave: 7,
    waveName: 'WAVE VII — DIALECTIC',
    category: 'Applied Dialectic',
    description: 'Clarify a difficult fork in the road by querying each quadrant: Past precedent, True value, Reality, Future simulation.',
    duration: 540,
    keyQuestion: 'Which path aligns with your sovereign truth?',
    phases: [
      { name: 'Past Precedents & Scars', quadrant: 'memory', audioPreset: 'ground', duration: 120, facilitatorPrompt: 'How has past failure or trauma biased your judgment toward this choice?' },
      { name: 'Core Meaning & Values', quadrant: 'meaning', audioPreset: 'drift', duration: 140, facilitatorPrompt: 'Which choice honors your deepest values, even if it requires courage?' },
      { name: 'Present Reality Check', quadrant: 'present', audioPreset: 'ground', duration: 120, facilitatorPrompt: 'What does your somatic gut sensation tell you when you envision Choice A versus Choice B?' },
      { name: 'Long-Range Simulation', quadrant: 'future', audioPreset: 'deep', duration: 160, facilitatorPrompt: 'Look back from 5 years in the future. Which decision leaves you with peace and self-respect?' }
    ]
  },
  {
    id: 'contradiction_holding',
    title: 'Contradiction Holding',
    wave: 7,
    waveName: 'WAVE VII — DIALECTIC',
    category: 'Paradox Tolerance',
    description: 'Hold two opposing truths simultaneously in consciousness without forcing premature resolution.',
    duration: 480,
    keyQuestion: 'Can you expand consciousness enough to hold both?',
    phases: [
      { name: 'Thesis (Perspective 1)', quadrant: 'meaning', audioPreset: 'drift', duration: 120, facilitatorPrompt: 'Focus on Truth 1: A strongly held conviction or desire. Give it full voice and emotional backing.' },
      { name: 'Antithesis (Perspective 2)', quadrant: 'meaning', audioPreset: 'drift', duration: 120, facilitatorPrompt: 'Now step into Truth 2: The exact opposing viewpoint or counter-evidence. Embody its validity fully.' },
      { name: 'The Dynamic Tension', quadrant: 'present', audioPreset: 'deep', duration: 120, facilitatorPrompt: 'Feel both truths alive in you simultaneously. Notice the urge of the intellect to destroy one. Refuse to collapse the tension.' },
      { name: 'The Meta Container', quadrant: 'meta', audioPreset: 'gamma_sync', duration: 120, facilitatorPrompt: 'Rest in the higher awareness that is spacious enough to contain both opposites without contradiction.' }
    ]
  },
  {
    id: 'silent_quadra',
    title: 'Silent Quadra',
    wave: 8,
    waveName: 'WAVE VIII — INTEGRATION',
    category: 'Mastery Protocol',
    description: 'A pure, unguided meditation session supported only by binaural audio cues and silent self-directed quadrant navigation.',
    duration: 900, // 15 minutes
    keyQuestion: 'What is discovered in self-directed silence?',
    phases: [
      { name: 'Silent Settling', quadrant: 'present', audioPreset: 'ground', duration: 180, facilitatorPrompt: 'Begin in quiet self-anchoring. Allow the sound to align your posture and breath.' },
      { name: 'Silent Introspection', quadrant: 'memory', audioPreset: 'drift', duration: 240, facilitatorPrompt: 'Silently explore memory and meaning without verbal guidance.' },
      { name: 'Deep Immersion', quadrant: 'future', audioPreset: 'deep', duration: 300, facilitatorPrompt: 'Deep immersion in the stillness between thought and simulation.' },
      { name: 'Meta Integration', quadrant: 'meta', audioPreset: 'threshold', duration: 180, facilitatorPrompt: 'Rest in meta-awareness before returning.' }
    ]
  }
];
