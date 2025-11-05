// Morphological form entry
export interface MorphologicalForm {
  pattern: string
  form: string
  status: 'attested' | 'rare' | 'theoretical'
  meaning: string
}

// Root pattern type
export interface RootPattern {
  root: string
  rootArabic?: string
  concept: string
  meaning?: string
  etymology?: string
  letterMeanings?: string
  relatedWords?: string[]
  variants: string[]
  morphology?: MorphologicalForm[]
}

import { getSearchVariantsForRoot, getAllFormsForRoot, type RootForm } from './rootForms'

// Arabic tri-root patterns and common words
export const rootPatterns: Record<string, RootPattern> = {
  // Allah (not a root, but special) - includes grammatical cases and prefixed forms
  allah: {
    root: 'الله',
    rootArabic: 'ا ل ه',
    concept: 'Allah',
    meaning: 'The One True God',
    etymology: 'From the root أ-ل-ه (alaha) meaning "to worship". Allah is the proper name of God in Islam, derived from al-ilāh (the God).',
    letterMeanings: 'ا (alif) represents oneness and unity, ل (lam) signifies belonging/possession, ه (ha) denotes essence/being',
    relatedWords: ['إله (god/deity)', 'آلهة (gods/deities)', 'تأله (to deify)'],
    variants: [
      'الله', 'اللَّه', 'اللّٰه', 'ٱللَّهُ', 'ٱللَّهِ', 'ٱللَّهَ',  // Base forms
      'لله', 'للَّه', 'لِلَّهِ', 'لِلَّهُ',  // With ل (for Allah)
      'بالله', 'بِاللَّهِ', 'باللَّهِ',  // With ب (by Allah)
      'والله', 'وَاللَّهِ', 'وَاللَّهُ',  // With و (and Allah)
      'فالله', 'فَاللَّهُ', 'فَاللَّهِ',  // With ف (then Allah)
      'كالله'  // With ك (like Allah)
    ]
  },

  // قلب - heart (with all grammatical forms)
  qalb: {
    root: 'قلب',
    rootArabic: 'ق ل ب',
    concept: 'Heart',
    meaning: 'Heart, center of emotions and intellect, the turning/changing essence',
    etymology: 'From root ق-ل-ب (qalaba) meaning "to turn, to flip, to transform". The heart as the seat of understanding that turns between states, changes in emotion and belief.',
    letterMeanings: 'ق (qaf) represents depth/inner core, ل (lam) signifies connection/turning, ب (ba) denotes containment/interiority',
    relatedWords: ['قَلَبَ (to turn over)', 'تَقَلُّب (fluctuation)', 'انْقِلاب (transformation)', 'مُنْقَلِب (place of return)', 'قالِب (mold/form)'],
    variants: [
      'قلب', 'قلوب', 'القلب', 'القلوب',  // Singular/plural
      'قلبه', 'قلبها', 'قلبهم', 'قلبهما', 'قلبهن',  // His/her/their heart
      'قلوبهم', 'قلوبهن', 'قلوبكم',  // Their hearts
      'قلبك', 'قلبكِ', 'قلبكم', 'قلبكن',  // Your heart(s)
      'قلبي', 'قلبنا',  // My/our heart
      'بقلب', 'بقلوب', 'فقلب', 'وقلب', 'كقلب'  // With prepositions
    ]
  },

  // روح - spirit/soul
  ruh: {
    root: 'روح',
    rootArabic: 'ر و ح',
    concept: 'Spirit/Soul',
    meaning: 'Spirit, breath of life, relief, divine inspiration',
    etymology: 'From root ر-و-ح (rāha) meaning "to rest, to be relieved, to blow (wind)". The spirit as the breath of life given by Allah, bringing relief and animation to the body.',
    letterMeanings: 'ر (ra) represents flow/movement, و (waw) signifies connection/medium, ح (ha) denotes life-force/breath',
    relatedWords: ['رَاحَ (to go/depart)', 'رَاحَة (rest/comfort)', 'رِيح (wind)', 'رَوْح (relief)', 'رَيْحان (sweet basil/fragrance)', 'مُسْتَرِيح (one at rest)'],
    variants: ['روح', 'الروح', 'روحنا', 'روحي', 'أرواح', 'الأرواح'],
    morphology: [
      { pattern: 'Noun فُعْل', form: 'رُوح', status: 'attested', meaning: 'spirit, soul; also "breeze/relief" in some uses' },
      { pattern: 'Plural أَفْعَال', form: 'أَرْوَاح', status: 'attested', meaning: 'spirits, souls' },
      { pattern: 'Form I', form: 'رَاحَ / يَرُوحُ', status: 'attested', meaning: 'to go, depart; in some idioms: to relax' },
      { pattern: 'Form II', form: 'رَوَّحَ / يُرَوِّحُ', status: 'attested', meaning: 'to give rest; to refresh; "entertain"' },
      { pattern: 'Form II masdar', form: 'تَرْوِيح', status: 'attested', meaning: 'providing rest; recreation (ترويح عن النفس)' },
      { pattern: 'Form IV', form: 'أَرَاحَ / يُرِيحُ', status: 'attested', meaning: 'to relieve, comfort' },
      { pattern: 'Form V', form: 'تَرَوَّحَ / يَتَرَوَّحُ', status: 'attested', meaning: 'to seek fresh air/rest' },
      { pattern: 'Form X', form: 'اِسْتَرَاحَ / يَسْتَرِيحُ', status: 'attested', meaning: 'to take a rest' },
      { pattern: 'Masdar X', form: 'اِسْتِرَاحَة', status: 'attested', meaning: 'a break, rest, "rest area"' },
      { pattern: 'Nisba adj.', form: 'رُوحِيّ', status: 'attested', meaning: 'spiritual; of the spirit' },
      { pattern: 'Form III فَاعَلَ', form: 'رَاوَحَ', status: 'rare', meaning: 'to alternate, go back and forth; could metaphorically mean: spirits "taking turns" in influence' },
      { pattern: 'Form VI تَفَاعَلَ', form: 'تَرَاوَحَ', status: 'attested', meaning: 'to alternate mutually; might be used for moods that come and go in waves' },
      { pattern: 'Form VII اِنْفَعَلَ', form: 'اِنْرَاحَ', status: 'theoretical', meaning: 'could mean: to be relieved spontaneously, "relief happened to him"' },
      { pattern: 'Form VIII اِفْتَعَلَ', form: 'اِرْتَاحَ', status: 'attested', meaning: 'to rest; spiritually re-breeze oneself' },
      { pattern: 'Intensive فَعَّال', form: 'رَوَّاح', status: 'rare', meaning: 'someone who goes around bringing relief or a lot of movement; also has a sense of "traveller"' }
    ]
  },

  // نفس - soul/self
  nafs: {
    root: 'نفس',
    rootArabic: 'ن ف س',
    concept: 'Soul/Self',
    meaning: 'Soul, self, person, breath, desire, the essence of one\'s being',
    etymology: 'From root ن-ف-س (nafasa) meaning "to breathe, to desire eagerly". The self as the breathing, desiring entity - both physical breath and psychological drives.',
    letterMeanings: 'ن (nun) represents depth/interiority, ف (fa) signifies opening/expression, س (sin) denotes subtlety/whisper',
    relatedWords: ['نَفَسَ (to breathe)', 'تَنَفُّس (breathing)', 'نَفِيس (precious)', 'تَنافُس (competition)', 'نَفْسِيّ (psychological)'],
    variants: [
      'نفس', 'أنفس', 'النفس', 'الأنفس',  // Base forms
      'نفسه', 'نفسها', 'نفسهم', 'نفسهن', 'نفسهما',  // His/her/their self
      'أنفسهم', 'أنفسهن', 'أنفسكم', 'أنفسكن',  // Their selves (plural)
      'نفسك', 'نفسكِ', 'نفسكم',  // Your self
      'نفسي', 'نفسنا',  // My/our self
      'بنفس', 'لنفس', 'فنفس', 'ونفس', 'كنفس'  // With prepositions
    ]
  },

  // عقل - mind/intellect
  aql: {
    root: 'عقل',
    rootArabic: 'ع ق ل',
    concept: 'Mind/Intellect',
    meaning: 'Mind, intellect, reason, understanding, the faculty that binds knowledge',
    etymology: 'From root ع-ق-ل (ʿaqala) meaning "to bind, to tie, to restrain". The intellect as that which restrains impulses and binds together understanding and wisdom.',
    letterMeanings: 'ع (ain) represents depth/comprehension, ق (qaf) signifies firmness/solidity, ل (lam) denotes binding/connection',
    relatedWords: ['عَقَلَ (to understand)', 'عِقال (hobble for camel)', 'مَعْقول (reasonable)', 'عاقِل (rational person)', 'تَعَقُّل (deliberation)'],
    variants: ['عقل', 'عقول', 'يعقل', 'يعقلون', 'تعقلون', 'نعقل', 'عاقل', 'العقل']
  },

  // انس - human
  insan: {
    root: 'انس',
    rootArabic: 'ا ن س',
    concept: 'Human',
    meaning: 'Human being, mankind, one who perceives and seeks companionship',
    etymology: 'From root أ-ن-س (anisa) meaning "to be sociable, to perceive, to be comforted by company". Humans as social beings who seek intimacy and companionship, distinguished by consciousness.',
    letterMeanings: 'ا (alif) represents awareness/beginning, ن (nun) signifies receptivity/perception, س (sin) denotes sociability/gentleness',
    relatedWords: ['أَنِسَ (to feel at ease)', 'أُنْس (intimacy)', 'مُؤَانَسَة (companionship)', 'أَنِيس (companion)', 'إيناس (hospitality)'],
    variants: ['إنسان', 'الإنسان', 'إنس', 'الإنس', 'أناس', 'الناس', 'ناس', 'بني', 'آدم']
  },

  // جسد - body
  jasad: {
    root: 'جسد',
    rootArabic: 'ج س د',
    concept: 'Body',
    meaning: 'Physical body, corporeal form, the material vessel',
    etymology: 'From root ج-س-د (jasada) meaning "to take physical form, to solidify, to embody". The body as physical matter that solidifies spirit into tangible form. Related to جسم (jism - body/substance).',
    letterMeanings: 'ج (jim) represents gathering/collection, س (sin) signifies substance/materiality, د (dal) denotes firmness/solidity',
    relatedWords: ['جَسَّدَ (to embody)', 'تَجَسُّد (incarnation)', 'جِسْم (body/physical form)', 'جَسِيم (massive)', 'أَجْساد (bodies)'],
    variants: ['جسد', 'الجسد', 'جسدا', 'أجساد', 'جسم', 'الجسم']
  },

  // صدر - chest
  sadr: {
    root: 'صدر',
    rootArabic: 'ص د ر',
    concept: 'Chest',
    meaning: 'Chest/breast, front, beginning',
    etymology: 'From root ص-د-ر (sadara) meaning "to go forth, to emanate". The chest as the front/forefront of the body, seat of emotions.',
    letterMeanings: 'ص (sad) represents solidity/strength, د (dal) indicates direction/emanation, ر (ra) signifies return/circulation',
    relatedWords: ['صَدَرَ (to emanate)', 'مَصْدَر (source)', 'تَصْدِير (exportation)', 'صَادِر (issuing forth)'],
    variants: ['صدر', 'صدور', 'الصدر', 'الصدور', 'صدره', 'صدورهم', 'صدرك']
  }
}

export type RootKey = keyof typeof rootPatterns

// Enhanced function that returns which form matched
export function matchesRootWithForm(word: string, rootKey: RootKey): RootForm | null {
  const cleanWord = cleanupHarakat(word)

  // First try comprehensive morphological forms
  const allForms = getAllFormsForRoot(rootKey as string)
  for (const rootForm of allForms) {
    const cleanForm = cleanupHarakat(rootForm.form)

    // Exact match
    if (cleanWord === cleanForm) return rootForm

    // Start/end match for longer forms (at least 3 chars)
    if (cleanForm.length >= 3) {
      if (cleanWord.startsWith(cleanForm) || cleanWord.endsWith(cleanForm)) {
        return rootForm
      }
    }
  }

  // Fallback to basic variants if no morphological form matched
  const rootInfo = rootPatterns[rootKey]
  const variants = rootInfo.variants
  const mainRoot = rootInfo.root

  for (const variant of variants) {
    const cleanVariant = cleanupHarakat(variant)
    if (cleanWord === cleanVariant) {
      const isMainForm = cleanupHarakat(mainRoot) === cleanVariant
      return {
        form: variant,
        pattern: isMainForm ? 'Base form' : `Variant form of ${mainRoot}`,
        meaning: rootInfo.meaning || null,
        isTheoretical: false
      }
    }

    if (cleanVariant.length >= 3) {
      if (cleanWord.startsWith(cleanVariant) || cleanWord.endsWith(cleanVariant)) {
        const isMainForm = cleanupHarakat(mainRoot) === cleanVariant
        return {
          form: variant,
          pattern: isMainForm ? 'Base form' : `Variant form of ${mainRoot}`,
          meaning: rootInfo.meaning || null,
          isTheoretical: false
        }
      }
    }
  }

  return null
}

// Legacy function for backward compatibility
export function matchesRoot(word: string, rootKey: RootKey): boolean {
  return matchesRootWithForm(word, rootKey) !== null
}

function cleanupHarakat(str: string): string {
  return str.replaceAll(/[\u0617-\u061A\u064B-\u0652\s]/g, '')
}

export const presetSearches = [
  { key: 'allah' as RootKey, label: 'Allah (الله)', icon: '☪️' },
  { key: 'qalb' as RootKey, label: 'Heart (قلب)', icon: '❤️' },
  { key: 'ruh' as RootKey, label: 'Spirit (روح)', icon: '✨' },
  { key: 'nafs' as RootKey, label: 'Soul (نفس)', icon: '🌟' },
  { key: 'aql' as RootKey, label: 'Mind (عقل)', icon: '🧠' },
  { key: 'insan' as RootKey, label: 'Human (إنسان)', icon: '👤' },
  { key: 'jasad' as RootKey, label: 'Body (جسد)', icon: '🫀' },
  { key: 'sadr' as RootKey, label: 'Chest (صدر)', icon: '💚' },
]
