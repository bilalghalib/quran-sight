export interface LetterMeaning {
  letter: string
  name: string
  phonetics: string
  symbolic: string
  phenomenological: string
  integrated: string
}

export const arabicLetterMeanings: Record<string, LetterMeaning> = {
  'ا': {
    letter: 'ا',
    name: 'alif',
    phonetics: 'long open [aː], vertical, jawf+throat',
    symbolic: 'Unity, oneness, axis, first principle',
    phenomenological: 'Pure opening, vertical pillar',
    integrated: 'Axis of unity / opening'
  },
  'ب': {
    letter: 'ب',
    name: 'bā'',
    phonetics: 'voiced [b], both lips',
    symbolic: 'Receptive base, "floor" of writing, entry',
    phenomenological: 'Soft grounded knock, base-note',
    integrated: 'Grounded container / base'
  },
  'ت': {
    letter: 'ت',
    name: 'tā'',
    phonetics: 'voiceless [t], tongue–teeth',
    symbolic: 'Light, precise action, subtle movement',
    phenomenological: 'Quick, crisp tap, needle-like',
    integrated: 'Precise action / small impact'
  },
  'ث': {
    letter: 'ث',
    name: 'thā'',
    phonetics: 'voiceless [θ], tongue between teeth',
    symbolic: '"Thorn-like"; subtle pricks/tensions',
    phenomenological: 'Thin, airy scratch through teeth',
    integrated: 'Fine thorn / subtle friction'
  },
  'ج': {
    letter: 'ج',
    name: 'jīm',
    phonetics: '[dʒ], mid tongue–palate',
    symbolic: 'Cutting/segmenting, sharp knowledge',
    phenomenological: 'Chunky pop + fricative, mini explosion',
    integrated: 'Segmenting strike / cut'
  },
  'ح': {
    letter: 'ح',
    name: 'ḥā'',
    phonetics: 'voiceless [ħ], mid-throat',
    symbolic: 'Breath, life, heat, dryness',
    phenomenological: 'Hot, desert-dry whisper scratch',
    integrated: 'Dry breath / bare life'
  },
  'خ': {
    letter: 'خ',
    name: 'khā'',
    phonetics: 'voiceless [x], upper throat',
    symbolic: 'Strong transformative fire/air',
    phenomenological: 'Rough stormy rasp, gravelly wind',
    integrated: 'Harsh wind / abrasive change'
  },
  'د': {
    letter: 'د',
    name: 'dāl',
    phonetics: 'voiced [d], tongue–teeth',
    symbolic: 'Boundary, limit, edge',
    phenomenological: 'Firm rounded knock, doorframe',
    integrated: 'Clear boundary / door'
  },
  'ذ': {
    letter: 'ذ',
    name: 'dhāl',
    phonetics: 'voiced [ð], tongue between teeth',
    symbolic: 'Edge/border in softer mode',
    phenomenological: 'Soft fuzzy buzz at the teeth',
    integrated: 'Soft edge / gentle contact'
  },
  'ر': {
    letter: 'ر',
    name: 'rā'',
    phonetics: 'tapped/rolled [r]',
    symbolic: 'Flow, rotation, running movement',
    phenomenological: 'Rolling, spinning vibration, lively',
    integrated: 'Roll / flowing motion'
  },
  'ز': {
    letter: 'ز',
    name: 'zāy',
    phonetics: 'voiced [z], alveolar',
    symbolic: 'Spark, short actions, adornment',
    phenomenological: 'Tight electric buzz, small saw',
    integrated: 'Spark / buzzing energy'
  },
  'س': {
    letter: 'س',
    name: 'sīn',
    phonetics: 'voiceless [s], alveolar',
    symbolic: 'Stream, continuity, linearity',
    phenomenological: 'Thin straight hiss, drawn line',
    integrated: 'Linear flow / stream'
  },
  'ش': {
    letter: 'ش',
    name: 'shīn',
    phonetics: '[ʃ], palato-alveolar',
    symbolic: 'Intense expansion, "three-flame"',
    phenomenological: 'Wide, shushing spray of sound',
    integrated: 'Diffuse expansion / spread'
  },
  'ص': {
    letter: 'ص',
    name: 'ṣād',
    phonetics: 'emphatic [sˤ], pharyngealised',
    symbolic: 'Solidity, endurance, heaviness',
    phenomenological: 'Thick, pressurised hiss, dense',
    integrated: 'Solid pressure / endurance'
  },
  'ض': {
    letter: 'ض',
    name: 'ḍād',
    phonetics: 'emphatic stop, side of tongue',
    symbolic: 'Uniqueness, weight, "Arab" mark',
    phenomenological: 'Massive, chewy, stone-like bite',
    integrated: 'Heavy uniqueness / dense impact'
  },
  'ط': {
    letter: 'ط',
    name: 'ṭā'',
    phonetics: 'emphatic [tˤ]',
    symbolic: 'Firm decisiveness, cutting through',
    phenomenological: 'Tense explosive T with weight',
    integrated: 'Decisive strike / firm cut'
  },
  'ظ': {
    letter: 'ظ',
    name: 'ẓā'',
    phonetics: 'emphatic [ðˤ]',
    symbolic: 'Overpowering, pressing, dominance',
    phenomenological: 'Deep pressed buzz, heavy engine',
    integrated: 'Overbearing pressure / dominance'
  },
  'ع': {
    letter: 'ع',
    name: 'ʿayn',
    phonetics: 'voiced [ʕ], mid-throat',
    symbolic: '"Eye/spring/essence", source-point',
    phenomenological: 'Inward gulp, turning attention inside',
    integrated: 'Inner source / inward turn'
  },
  'غ': {
    letter: 'غ',
    name: 'ghayn',
    phonetics: 'voiced [ɣ], upper throat',
    symbolic: 'Cloudedness, veiling, dense states',
    phenomenological: 'Dark gurgle, foggy growl',
    integrated: 'Veiled depth / murky flow'
  },
  'ف': {
    letter: 'ف',
    name: 'fā'',
    phonetics: 'voiceless [f], lip–teeth',
    symbolic: 'Blowing, dispersing, separation',
    phenomenological: 'Focused airy puff at lips',
    integrated: 'Directed breath / outward puff'
  },
  'ق': {
    letter: 'ق',
    name: 'qāf',
    phonetics: 'voiceless [q], uvular stop',
    symbolic: 'Boundary of worlds, ego/mountain',
    phenomenological: 'Deep subterranean knock',
    integrated: 'Deep boundary / inner mountain'
  },
  'ك': {
    letter: 'ك',
    name: 'kāf',
    phonetics: 'voiceless [k], velar stop',
    symbolic: 'Form, container, likeness ("like")',
    phenomenological: 'Clear light *k*, small box snap',
    integrated: 'Form / small container'
  },
  'ل': {
    letter: 'ل',
    name: 'lām',
    phonetics: '[l], tongue ridge',
    symbolic: 'Manifestation, gentle descent, ray',
    phenomenological: 'Smooth lateral slide, gentle curve',
    integrated: 'Gentle guidance / flowing line'
  },
  'م': {
    letter: 'م',
    name: 'mīm',
    phonetics: '[m], bilabial nasal',
    symbolic: 'Womb, water, oceanic enclosure',
    phenomenological: 'Warm hum, enveloping "mmm"',
    integrated: 'Womb-like enclosure / nurture'
  },
  'ن': {
    letter: 'ن',
    name: 'nūn',
    phonetics: '[n], alveolar nasal',
    symbolic: 'Fish/ocean of ink, receptive bowl',
    phenomenological: 'Light inner hum, bowl-shaped ending',
    integrated: 'Receptive bowl / subtle resonance'
  },
  'ه': {
    letter: 'ه',
    name: 'hā'',
    phonetics: '[h], glottal breath',
    symbolic: 'Pure breath, fading exhale',
    phenomenological: 'Soft sigh evaporating into air',
    integrated: 'Vanishing breath / release'
  },
  'و': {
    letter: 'و',
    name: 'wāw',
    phonetics: '[w] or [uː], rounded glide',
    symbolic: 'Connector, loop, circular mirror',
    phenomenological: 'Rounded glide, looping join',
    integrated: 'Connector / looping bond'
  },
  'ي': {
    letter: 'ي',
    name: 'yā'',
    phonetics: '[j] or [iː], front glide',
    symbolic: 'Subtlety, descent into detail',
    phenomenological: 'High, bright, needle-fine ray',
    integrated: 'Fine articulation / subtle ray'
  }
}

/**
 * Get letter meaning by Arabic letter
 */
export function getLetterMeaning(letter: string): LetterMeaning | undefined {
  return arabicLetterMeanings[letter]
}

/**
 * Get meanings for all letters in a root (typically 3 letters)
 */
export function getRootLetterMeanings(root: string): LetterMeaning[] {
  const letters = root.split('')
  return letters
    .map(letter => getLetterMeaning(letter))
    .filter((meaning): meaning is LetterMeaning => meaning !== undefined)
}
