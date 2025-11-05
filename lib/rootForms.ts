// Comprehensive Arabic root forms (sarfs) for all search roots
// Generated using traditional Arabic morphology patterns (awzan)
// Includes both attested forms and theoretical possibilities

export interface RootForm {
  form: string
  pattern: string
  meaning: string | null
  isTheoretical: boolean
  notes?: string
}

export const rootForms = {
  // قلب (Q-L-B) - Heart
  qalb: [
    // Form I (فَعَلَ)
    { form: 'قَلَبَ', pattern: 'فَعَلَ', meaning: 'to turn over, to flip', isTheoretical: false },
    { form: 'يَقْلِبُ', pattern: 'يَفْعِلُ', meaning: 'he turns over', isTheoretical: false },
    { form: 'قَالِب', pattern: 'فَاعِل', meaning: 'mold, form', isTheoretical: false },
    { form: 'مَقْلُوب', pattern: 'مَفْعُول', meaning: 'inverted, turned over', isTheoretical: false },
    { form: 'قَلْب', pattern: 'فَعْل', meaning: 'heart, core, turning', isTheoretical: false },
    { form: 'قُلُوب', pattern: 'فُعُول', meaning: 'hearts (plural)', isTheoretical: false },

    // Form II (فَعَّلَ) - intensified action
    { form: 'قَلَّبَ', pattern: 'فَعَّلَ', meaning: 'to turn repeatedly, to flip through', isTheoretical: false },
    { form: 'يُقَلِّبُ', pattern: 'يُفَعِّلُ', meaning: 'he turns repeatedly', isTheoretical: false },
    { form: 'مُقَلِّب', pattern: 'مُفَعِّل', meaning: 'one who turns/changes', isTheoretical: false },
    { form: 'مُقَلَّب', pattern: 'مُفَعَّل', meaning: 'turned repeatedly', isTheoretical: false },
    { form: 'تَقْلِيب', pattern: 'تَفْعِيل', meaning: 'turning, flipping', isTheoretical: false },

    // Form III (فَاعَلَ) - reciprocal or attempt
    { form: 'قَالَبَ', pattern: 'فَاعَلَ', meaning: null, isTheoretical: true, notes: 'Could mean: to exchange forms with someone, mutual transformation' },
    { form: 'يُقَالِبُ', pattern: 'يُفَاعِلُ', meaning: null, isTheoretical: true, notes: 'Could mean: to mutually turn/transform' },
    { form: 'مُقَالَبَة', pattern: 'مُفَاعَلَة', meaning: null, isTheoretical: true, notes: 'Might mean: mutual turning/exchange' },

    // Form IV (أَفْعَلَ) - causative
    { form: 'أَقْلَبَ', pattern: 'أَفْعَلَ', meaning: null, isTheoretical: true, notes: 'Could mean: to cause to turn, to make heartful' },
    { form: 'يُقْلِبُ', pattern: 'يُفْعِلُ', meaning: null, isTheoretical: true, notes: 'Might mean: to cause turning' },

    // Form V (تَفَعَّلَ) - reflexive of Form II
    { form: 'تَقَلَّبَ', pattern: 'تَفَعَّلَ', meaning: 'to turn over repeatedly, to fluctuate', isTheoretical: false },
    { form: 'يَتَقَلَّبُ', pattern: 'يَتَفَعَّلُ', meaning: 'he fluctuates', isTheoretical: false },
    { form: 'مُتَقَلِّب', pattern: 'مُتَفَعِّل', meaning: 'changing, fluctuating', isTheoretical: false },
    { form: 'تَقَلُّب', pattern: 'تَفَعُّل', meaning: 'fluctuation, change', isTheoretical: false },

    // Form VI (تَفَاعَلَ) - mutual action
    { form: 'تَقَالَبَ', pattern: 'تَفَاعَلَ', meaning: null, isTheoretical: true, notes: 'Could mean: to transform mutually, to exchange hearts' },
    { form: 'يَتَقَالَبُ', pattern: 'يَتَفَاعَلُ', meaning: null, isTheoretical: true, notes: 'Might mean: to mutually turn/change' },

    // Form VII (انْفَعَلَ) - passive/reflexive
    { form: 'انْقَلَبَ', pattern: 'انْفَعَلَ', meaning: 'to be turned over, to be overturned, to return', isTheoretical: false },
    { form: 'يَنْقَلِبُ', pattern: 'يَنْفَعِلُ', meaning: 'he is turned over, he returns', isTheoretical: false },
    { form: 'مُنْقَلِب', pattern: 'مُنْفَعِل', meaning: 'overturned, returned', isTheoretical: false },
    { form: 'انْقِلَاب', pattern: 'انْفِعَال', meaning: 'overturning, revolution, return', isTheoretical: false },

    // Form VIII (افْتَعَلَ) - reflexive with ت inserted
    { form: 'اقْتَلَبَ', pattern: 'افْتَعَلَ', meaning: null, isTheoretical: true, notes: 'Could mean: to extract/take the heart, to internalize turning' },
    { form: 'يَقْتَلِبُ', pattern: 'يَفْتَعِلُ', meaning: null, isTheoretical: true, notes: 'Might mean: to self-turn, to adopt as one\'s core' },

    // Form X (اسْتَفْعَلَ) - seeking/requesting
    { form: 'اسْتَقْلَبَ', pattern: 'اسْتَفْعَلَ', meaning: null, isTheoretical: true, notes: 'Could mean: to seek transformation, to ask for one\'s heart to be turned' },
    { form: 'يَسْتَقْلِبُ', pattern: 'يَسْتَفْعِلُ', meaning: null, isTheoretical: true, notes: 'Might mean: to request turning/change' },
    { form: 'مُسْتَقْلِب', pattern: 'مُسْتَفْعِل', meaning: null, isTheoretical: true, notes: 'Could mean: one seeking transformation' },

    // Additional nominal patterns
    { form: 'قِلْب', pattern: 'فِعْل', meaning: null, isTheoretical: true, notes: 'Rare nominal form, might mean: a type of turning' },
    { form: 'قَلِيب', pattern: 'فَعِيل', meaning: 'well, deep pit', isTheoretical: false },
    { form: 'قُلَّاب', pattern: 'فُعَّال', meaning: null, isTheoretical: true, notes: 'Could mean: professional turner/flipper, very fickle person' },
    { form: 'قَلَّاب', pattern: 'فَعَّال', meaning: null, isTheoretical: true, notes: 'Might mean: one who frequently changes, very changeable' },
  ],

  // صدر (S-D-R) - Chest
  sadr: [
    // Form I (فَعَلَ)
    { form: 'صَدَرَ', pattern: 'فَعَلَ', meaning: 'to go out, to emanate, to proceed from', isTheoretical: false },
    { form: 'يَصْدُرُ', pattern: 'يَفْعُلُ', meaning: 'he goes out, emanates', isTheoretical: false },
    { form: 'صَادِر', pattern: 'فَاعِل', meaning: 'issuing, emanating', isTheoretical: false },
    { form: 'مَصْدُور', pattern: 'مَفْعُول', meaning: 'issued from', isTheoretical: false },
    { form: 'صَدْر', pattern: 'فَعْل', meaning: 'chest, breast, forefront', isTheoretical: false },
    { form: 'صُدُور', pattern: 'فُعُول', meaning: 'chests (plural)', isTheoretical: false },
    { form: 'مَصْدَر', pattern: 'مَفْعَل', meaning: 'source, origin', isTheoretical: false },

    // Form II (فَعَّلَ)
    { form: 'صَدَّرَ', pattern: 'فَعَّلَ', meaning: 'to export, to send forth', isTheoretical: false },
    { form: 'يُصَدِّرُ', pattern: 'يُفَعِّلُ', meaning: 'he exports', isTheoretical: false },
    { form: 'مُصَدِّر', pattern: 'مُفَعِّل', meaning: 'exporter', isTheoretical: false },
    { form: 'مُصَدَّر', pattern: 'مُفَعَّل', meaning: 'exported', isTheoretical: false },
    { form: 'تَصْدِير', pattern: 'تَفْعِيل', meaning: 'exportation', isTheoretical: false },

    // Form III (فَاعَلَ)
    { form: 'صَادَرَ', pattern: 'فَاعَلَ', meaning: 'to confiscate, to seize', isTheoretical: false },
    { form: 'يُصَادِرُ', pattern: 'يُفَاعِلُ', meaning: 'he confiscates', isTheoretical: false },
    { form: 'مُصَادَرَة', pattern: 'مُفَاعَلَة', meaning: 'confiscation', isTheoretical: false },

    // Form IV (أَفْعَلَ)
    { form: 'أَصْدَرَ', pattern: 'أَفْعَلَ', meaning: 'to issue, to publish', isTheoretical: false },
    { form: 'يُصْدِرُ', pattern: 'يُفْعِلُ', meaning: 'he issues', isTheoretical: false },
    { form: 'مُصْدِر', pattern: 'مُفْعِل', meaning: 'issuer, publisher', isTheoretical: false },
    { form: 'إصْدَار', pattern: 'إفْعَال', meaning: 'issuing, publication', isTheoretical: false },

    // Form V (تَفَعَّلَ)
    { form: 'تَصَدَّرَ', pattern: 'تَفَعَّلَ', meaning: 'to be at the forefront, to lead', isTheoretical: false },
    { form: 'يَتَصَدَّرُ', pattern: 'يَتَفَعَّلُ', meaning: 'he leads, he is at the forefront', isTheoretical: false },
    { form: 'مُتَصَدِّر', pattern: 'مُتَفَعِّل', meaning: 'leading, foremost', isTheoretical: false },
    { form: 'تَصَدُّر', pattern: 'تَفَعُّل', meaning: 'being at the forefront', isTheoretical: false },

    // Form VI (تَفَاعَلَ)
    { form: 'تَصَادَرَ', pattern: 'تَفَاعَلَ', meaning: null, isTheoretical: true, notes: 'Could mean: to emanate from each other, mutual sourcing' },

    // Form VII (انْفَعَلَ)
    { form: 'انْصَدَرَ', pattern: 'انْفَعَلَ', meaning: null, isTheoretical: true, notes: 'Might mean: to be emanated, to flow out naturally' },

    // Form VIII (افْتَعَلَ)
    { form: 'اصْطَدَرَ', pattern: 'افْتَعَلَ', meaning: null, isTheoretical: true, notes: 'Could mean: to take to one\'s chest, to embrace inwardly' },

    // Form X (اسْتَفْعَلَ)
    { form: 'اسْتَصْدَرَ', pattern: 'اسْتَفْعَلَ', meaning: 'to obtain, to elicit', isTheoretical: false },
    { form: 'يَسْتَصْدِرُ', pattern: 'يَسْتَفْعِلُ', meaning: 'he obtains, elicits', isTheoretical: false },
    { form: 'اسْتِصْدَار', pattern: 'اسْتِفْعَال', meaning: 'obtaining, elicitation', isTheoretical: false },

    // Additional forms
    { form: 'صَدِير', pattern: 'فَعِيل', meaning: null, isTheoretical: true, notes: 'Rare form, might mean: having a broad chest, emanation itself' },
    { form: 'صَدَّار', pattern: 'فَعَّال', meaning: null, isTheoretical: true, notes: 'Could mean: frequent exporter, one who constantly emanates' },
  ],

  // نفس (N-F-S) - Soul/Self
  nafs: [
    // Form I (فَعَلَ)
    { form: 'نَفَسَ', pattern: 'فَعَلَ', meaning: 'to breathe', isTheoretical: false },
    { form: 'يَنْفُسُ', pattern: 'يَفْعُلُ', meaning: 'he breathes', isTheoretical: false },
    { form: 'نَفْس', pattern: 'فَعْل', meaning: 'soul, self, breath', isTheoretical: false },
    { form: 'أَنْفُس', pattern: 'أَفْعُل', meaning: 'souls, selves (plural)', isTheoretical: false },
    { form: 'نَفِيس', pattern: 'فَعِيل', meaning: 'precious, valuable', isTheoretical: false },

    // Form II (فَعَّلَ)
    { form: 'نَفَّسَ', pattern: 'فَعَّلَ', meaning: 'to relieve, to give relief', isTheoretical: false },
    { form: 'يُنَفِّسُ', pattern: 'يُفَعِّلُ', meaning: 'he relieves', isTheoretical: false },
    { form: 'مُنَفِّس', pattern: 'مُفَعِّل', meaning: 'reliever, outlet', isTheoretical: false },
    { form: 'تَنْفِيس', pattern: 'تَفْعِيل', meaning: 'relief, venting', isTheoretical: false },

    // Form III (فَاعَلَ)
    { form: 'نَافَسَ', pattern: 'فَاعَلَ', meaning: 'to compete, to rival', isTheoretical: false },
    { form: 'يُنَافِسُ', pattern: 'يُفَاعِلُ', meaning: 'he competes', isTheoretical: false },
    { form: 'مُنَافِس', pattern: 'مُفَاعِل', meaning: 'competitor', isTheoretical: false },
    { form: 'مُنَافَسَة', pattern: 'مُفَاعَلَة', meaning: 'competition, rivalry', isTheoretical: false },

    // Form IV (أَفْعَلَ)
    { form: 'أَنْفَسَ', pattern: 'أَفْعَلَ', meaning: null, isTheoretical: true, notes: 'Could mean: to ensoul, to give soul/breath to something' },
    { form: 'يُنْفِسُ', pattern: 'يُفْعِلُ', meaning: null, isTheoretical: true, notes: 'Might mean: to cause to breathe/live' },

    // Form V (تَفَعَّلَ)
    { form: 'تَنَفَّسَ', pattern: 'تَفَعَّلَ', meaning: 'to breathe, to take breath', isTheoretical: false },
    { form: 'يَتَنَفَّسُ', pattern: 'يَتَفَعَّلُ', meaning: 'he breathes', isTheoretical: false },
    { form: 'مُتَنَفِّس', pattern: 'مُتَفَعِّل', meaning: 'breathing', isTheoretical: false },
    { form: 'تَنَفُّس', pattern: 'تَفَعُّل', meaning: 'breathing, respiration', isTheoretical: false },

    // Form VI (تَفَاعَلَ)
    { form: 'تَنَافَسَ', pattern: 'تَفَاعَلَ', meaning: 'to compete with each other', isTheoretical: false },
    { form: 'يَتَنَافَسُ', pattern: 'يَتَفَاعَلُ', meaning: 'they compete', isTheoretical: false },
    { form: 'مُتَنَافِس', pattern: 'مُتَفَاعِل', meaning: 'competing', isTheoretical: false },
    { form: 'تَنَافُس', pattern: 'تَفَاعُل', meaning: 'mutual competition', isTheoretical: false },

    // Form VII (انْفَعَلَ)
    { form: 'انْفَاسَ', pattern: 'انْفَعَلَ', meaning: null, isTheoretical: true, notes: 'Could mean: to be breathed into, to become ensouled' },

    // Form VIII (افْتَعَلَ)
    { form: 'انْتَفَسَ', pattern: 'افْتَعَلَ', meaning: null, isTheoretical: true, notes: 'Might mean: to take in soul/breath, to embody' },

    // Form X (اسْتَفْعَلَ)
    { form: 'اسْتَنْفَسَ', pattern: 'اسْتَفْعَلَ', meaning: null, isTheoretical: true, notes: 'Could mean: to seek breathing space, to request soul-relief' },

    // Additional forms
    { form: 'نَفَّاس', pattern: 'فَعَّال', meaning: null, isTheoretical: true, notes: 'Might mean: one who gives great relief, soul-soother' },
    { form: 'نَفُوس', pattern: 'فَعُول', meaning: null, isTheoretical: true, notes: 'Could mean: extremely precious, soul-full' },
  ],

  // عقل ('Q-L) - Mind/Intellect
  aql: [
    // Form I (فَعَلَ)
    { form: 'عَقَلَ', pattern: 'فَعَلَ', meaning: 'to understand, to comprehend, to tie/bind', isTheoretical: false },
    { form: 'يَعْقِلُ', pattern: 'يَفْعِلُ', meaning: 'he understands', isTheoretical: false },
    { form: 'عَاقِل', pattern: 'فَاعِل', meaning: 'intelligent, rational', isTheoretical: false },
    { form: 'مَعْقُول', pattern: 'مَفْعُول', meaning: 'understood, reasonable', isTheoretical: false },
    { form: 'عَقْل', pattern: 'فَعْل', meaning: 'mind, intellect, reason', isTheoretical: false },
    { form: 'عُقُول', pattern: 'فُعُول', meaning: 'minds, intellects (plural)', isTheoretical: false },

    // Form II (فَعَّلَ)
    { form: 'عَقَّلَ', pattern: 'فَعَّلَ', meaning: null, isTheoretical: true, notes: 'Could mean: to intellectualize intensely, to make very rational' },
    { form: 'يُعَقِّلُ', pattern: 'يُفَعِّلُ', meaning: null, isTheoretical: true, notes: 'Might mean: to rationalize repeatedly' },

    // Form III (فَاعَلَ)
    { form: 'عَاقَلَ', pattern: 'فَاعَلَ', meaning: null, isTheoretical: true, notes: 'Could mean: to reason with someone, intellectual exchange' },
    { form: 'يُعَاقِلُ', pattern: 'يُفَاعِلُ', meaning: null, isTheoretical: true, notes: 'Might mean: to engage in mutual reasoning' },

    // Form IV (أَفْعَلَ)
    { form: 'أَعْقَلَ', pattern: 'أَفْعَلَ', meaning: null, isTheoretical: true, notes: 'Could mean: to make intelligent, to endow with reason' },
    { form: 'يُعْقِلُ', pattern: 'يُفْعِلُ', meaning: null, isTheoretical: true, notes: 'Might mean: to cause understanding' },

    // Form V (تَفَعَّلَ)
    { form: 'تَعَقَّلَ', pattern: 'تَفَعَّلَ', meaning: 'to be rational, to act reasonably', isTheoretical: false },
    { form: 'يَتَعَقَّلُ', pattern: 'يَتَفَعَّلُ', meaning: 'he acts rationally', isTheoretical: false },
    { form: 'مُتَعَقِّل', pattern: 'مُتَفَعِّل', meaning: 'rational, reasonable', isTheoretical: false },
    { form: 'تَعَقُّل', pattern: 'تَفَعُّل', meaning: 'rationality, reasonableness', isTheoretical: false },

    // Form VI (تَفَاعَلَ)
    { form: 'تَعَاقَلَ', pattern: 'تَفَاعَلَ', meaning: null, isTheoretical: true, notes: 'Could mean: to reason together, mutual rationalization' },

    // Form VII (انْفَعَلَ)
    { form: 'انْعَقَلَ', pattern: 'انْفَعَلَ', meaning: null, isTheoretical: true, notes: 'Might mean: to become rational, to be intellectualized' },

    // Form VIII (افْتَعَلَ)
    { form: 'اعْتَقَلَ', pattern: 'افْتَعَلَ', meaning: 'to detain, to arrest', isTheoretical: false },
    { form: 'يَعْتَقِلُ', pattern: 'يَفْتَعِلُ', meaning: 'he detains', isTheoretical: false },
    { form: 'مُعْتَقَل', pattern: 'مُفْتَعَل', meaning: 'detained, internment camp', isTheoretical: false },
    { form: 'اعْتِقَال', pattern: 'افْتِعَال', meaning: 'detention, arrest', isTheoretical: false },

    // Form X (اسْتَفْعَلَ)
    { form: 'اسْتَعْقَلَ', pattern: 'اسْتَفْعَلَ', meaning: null, isTheoretical: true, notes: 'Could mean: to seek understanding, to request intellectual clarity' },

    // Additional forms
    { form: 'عَقِيل', pattern: 'فَعِيل', meaning: null, isTheoretical: true, notes: 'Rare form, might mean: highly intellectual, bound by reason' },
    { form: 'عَقَّال', pattern: 'فَعَّال', meaning: null, isTheoretical: true, notes: 'Could mean: super-rational person, intellectual extremist' },
    { form: 'مَعْقِل', pattern: 'مَفْعِل', meaning: 'fortress, refuge', isTheoretical: false },
  ],

  // روح (R-W-H) - Spirit/Soul
  // Full "sarf playground" treatment with ✓ (common), ◇ (rare), ★ (theoretical)
  ruh: [
    // Form I (فَعَلَ)
    { form: 'رَاحَ', pattern: 'فَعَلَ', meaning: 'to go, to depart (in evening)', isTheoretical: false },
    { form: 'يَرُوحُ', pattern: 'يَفْعُلُ', meaning: 'he goes, departs', isTheoretical: false },
    { form: 'رَائِح', pattern: 'فَاعِل', meaning: 'going, departing', isTheoretical: false },
    { form: 'رُوح', pattern: 'فُعْل', meaning: 'spirit, soul, breath', isTheoretical: false },
    { form: 'أَرْوَاح', pattern: 'أَفْعَال', meaning: 'spirits, souls (plural)', isTheoretical: false },
    { form: 'رِيح', pattern: 'فِعْل', meaning: 'wind', isTheoretical: false },
    { form: 'رِيَاح', pattern: 'فِعَال', meaning: 'winds (plural)', isTheoretical: false },

    // Form II (فَعَّلَ)
    { form: 'رَوَّحَ', pattern: 'فَعَّلَ', meaning: 'to refresh, to give rest', isTheoretical: false },
    { form: 'يُرَوِّحُ', pattern: 'يُفَعِّلُ', meaning: 'he refreshes', isTheoretical: false },
    { form: 'مُرَوِّح', pattern: 'مُفَعِّل', meaning: 'refreshing, fan', isTheoretical: false },
    { form: 'تَرْوِيح', pattern: 'تَفْعِيل', meaning: 'refreshment, rest', isTheoretical: false },

    // Form III (فَاعَلَ)
    { form: 'رَاوَحَ', pattern: 'فَاعَلَ', meaning: 'to alternate, to vary', isTheoretical: false },
    { form: 'يُرَاوِحُ', pattern: 'يُفَاعِلُ', meaning: 'he alternates', isTheoretical: false },
    { form: 'مُرَاوَحَة', pattern: 'مُفَاعَلَة', meaning: 'alternation', isTheoretical: false },

    // Form IV (أَفْعَلَ)
    { form: 'أَرَاحَ', pattern: 'أَفْعَلَ', meaning: 'to give rest, to relieve', isTheoretical: false },
    { form: 'يُرِيحُ', pattern: 'يُفْعِلُ', meaning: 'he gives rest', isTheoretical: false },
    { form: 'مُرِيح', pattern: 'مُفْعِل', meaning: 'restful, comfortable', isTheoretical: false },
    { form: 'إرَاحَة', pattern: 'إفْعَالَة', meaning: 'rest, comfort', isTheoretical: false },

    // Form V (تَفَعَّلَ)
    { form: 'تَرَوَّحَ', pattern: 'تَفَعَّلَ', meaning: null, isTheoretical: true, notes: 'Could mean: to become spiritualized, to refresh oneself' },
    { form: 'يَتَرَوَّحُ', pattern: 'يَتَفَعَّلُ', meaning: null, isTheoretical: true, notes: 'Might mean: to take on spirit, to ventilate' },

    // Form VI (تَفَاعَلَ)
    { form: 'تَرَاوَحَ', pattern: 'تَفَاعَلَ', meaning: 'to fluctuate, to oscillate', isTheoretical: false },
    { form: 'يَتَرَاوَحُ', pattern: 'يَتَفَاعَلُ', meaning: 'it fluctuates', isTheoretical: false },

    // Form VII (انْفَعَلَ)
    { form: 'انْرَاحَ', pattern: 'انْفَعَلَ', meaning: null, isTheoretical: true, notes: 'Could mean: to be spirit-filled, to be blown upon (rare)' },

    // Form VIII (افْتَعَلَ)
    { form: 'ارْتَاحَ', pattern: 'افْتَعَلَ', meaning: 'to rest, to be comfortable', isTheoretical: false },
    { form: 'يَرْتَاحُ', pattern: 'يَفْتَعِلُ', meaning: 'he rests', isTheoretical: false },
    { form: 'مُرْتَاح', pattern: 'مُفْتَعِل', meaning: 'resting, comfortable', isTheoretical: false },
    { form: 'ارْتِيَاح', pattern: 'افْتِعَال', meaning: 'rest, comfort, relief', isTheoretical: false },

    // Form X (اسْتَفْعَلَ)
    { form: 'اسْتَرَاحَ', pattern: 'اسْتَفْعَلَ', meaning: 'to rest, to relax', isTheoretical: false },
    { form: 'يَسْتَرِيحُ', pattern: 'يَسْتَفْعِلُ', meaning: 'he rests', isTheoretical: false },
    { form: 'مُسْتَرِيح', pattern: 'مُسْتَفْعِل', meaning: 'resting', isTheoretical: false },
    { form: 'اسْتِرَاحَة', pattern: 'اسْتِفْعَالَة', meaning: 'rest, relaxation', isTheoretical: false },

    // Additional forms
    { form: 'رَوْحَانِيّ', pattern: 'فَعْلَانِيّ', meaning: 'spiritual', isTheoretical: false },
    { form: 'رُوحَانِيَّة', pattern: 'فُعْلَانِيَّة', meaning: 'spirituality', isTheoretical: false },
    { form: 'رَائِحَة', pattern: 'فَاعِلَة', meaning: 'scent, smell', isTheoretical: false },
  ],

  // جسد (J-S-D) - Body
  jasad: [
    // Form I (فَعَلَ)
    { form: 'جَسَدَ', pattern: 'فَعَلَ', meaning: null, isTheoretical: true, notes: 'Could mean: to embody, to become corporeal' },
    { form: 'يَجْسُدُ', pattern: 'يَفْعُلُ', meaning: null, isTheoretical: true, notes: 'Might mean: to take bodily form' },
    { form: 'جَسَد', pattern: 'فَعَل', meaning: 'body, physical form', isTheoretical: false },
    { form: 'أَجْسَاد', pattern: 'أَفْعَال', meaning: 'bodies (plural)', isTheoretical: false },
    { form: 'جَسِيد', pattern: 'فَعِيل', meaning: null, isTheoretical: true, notes: 'Could mean: bodily, corporeal' },

    // Form II (فَعَّلَ)
    { form: 'جَسَّدَ', pattern: 'فَعَّلَ', meaning: 'to embody, to incarnate, to personify', isTheoretical: false },
    { form: 'يُجَسِّدُ', pattern: 'يُفَعِّلُ', meaning: 'he embodies', isTheoretical: false },
    { form: 'مُجَسِّد', pattern: 'مُفَعِّل', meaning: 'embodying, incarnating', isTheoretical: false },
    { form: 'مُجَسَّد', pattern: 'مُفَعَّل', meaning: 'embodied, incarnated', isTheoretical: false },
    { form: 'تَجْسِيد', pattern: 'تَفْعِيل', meaning: 'embodiment, incarnation', isTheoretical: false },

    // Form III (فَاعَلَ)
    { form: 'جَاسَدَ', pattern: 'فَاعَلَ', meaning: null, isTheoretical: true, notes: 'Could mean: to engage bodily, to physically interact' },

    // Form IV (أَفْعَلَ)
    { form: 'أَجْسَدَ', pattern: 'أَفْعَلَ', meaning: null, isTheoretical: true, notes: 'Might mean: to give body to, to materialize' },

    // Form V (تَفَعَّلَ)
    { form: 'تَجَسَّدَ', pattern: 'تَفَعَّلَ', meaning: 'to be embodied, to be incarnated', isTheoretical: false },
    { form: 'يَتَجَسَّدُ', pattern: 'يَتَفَعَّلُ', meaning: 'it is embodied', isTheoretical: false },
    { form: 'مُتَجَسِّد', pattern: 'مُتَفَعِّل', meaning: 'embodied, incarnate', isTheoretical: false },
    { form: 'تَجَسُّد', pattern: 'تَفَعُّل', meaning: 'embodiment, incarnation', isTheoretical: false },

    // Form VI (تَفَاعَلَ)
    { form: 'تَجَاسَدَ', pattern: 'تَفَاعَلَ', meaning: null, isTheoretical: true, notes: 'Could mean: to embody each other, mutual embodiment' },

    // Form VII (انْفَعَلَ)
    { form: 'انْجَسَدَ', pattern: 'انْفَعَلَ', meaning: null, isTheoretical: true, notes: 'Might mean: to become bodily, to solidify' },

    // Form VIII (افْتَعَلَ)
    { form: 'اجْتَسَدَ', pattern: 'افْتَعَلَ', meaning: null, isTheoretical: true, notes: 'Could mean: to take on a body, to self-embody' },

    // Form X (اسْتَفْعَلَ)
    { form: 'اسْتَجْسَدَ', pattern: 'اسْتَفْعَلَ', meaning: null, isTheoretical: true, notes: 'Could mean: to seek embodiment, to materialize' },

    // Additional forms
    { form: 'جَسَدِيّ', pattern: 'فَعَلِيّ', meaning: 'bodily, physical, corporeal', isTheoretical: false },
    { form: 'جَسَدَانِيّ', pattern: 'فَعَلَانِيّ', meaning: null, isTheoretical: true, notes: 'Could mean: extremely physical, materialistic' },
    { form: 'جِسْم', pattern: 'فِعْل', meaning: 'body, object', isTheoretical: false },
    { form: 'أَجْسَام', pattern: 'أَفْعَال', meaning: 'bodies, objects (plural)', isTheoretical: false },
    { form: 'جِسْمِيّ', pattern: 'فِعْلِيّ', meaning: 'bodily, physical', isTheoretical: false },
  ],

  // انس (Alif-N-S) - Human
  insan: [
    // Form I (فَعَلَ) - Note: This root behaves irregularly
    { form: 'أَنِسَ', pattern: 'فَعِلَ', meaning: 'to feel comfortable with, to be friendly', isTheoretical: false },
    { form: 'يَأْنَسُ', pattern: 'يَفْعَلُ', meaning: 'he feels comfortable', isTheoretical: false },
    { form: 'آنِس', pattern: 'فَاعِل', meaning: 'friendly, sociable', isTheoretical: false },
    { form: 'مَأْنُوس', pattern: 'مَفْعُول', meaning: 'familiar, comfortable with', isTheoretical: false },
    { form: 'إِنْسَان', pattern: 'إِفْعَال', meaning: 'human being, person', isTheoretical: false },
    { form: 'إِنْس', pattern: 'إِفْعِل', meaning: 'mankind, humans (collective)', isTheoretical: false },
    { form: 'أُنَاس', pattern: 'فُعَال', meaning: 'people', isTheoretical: false },
    { form: 'نَاس', pattern: 'فَاعِل (shortened)', meaning: 'people', isTheoretical: false },

    // Form II (فَعَّلَ)
    { form: 'أَنَّسَ', pattern: 'فَعَّلَ', meaning: null, isTheoretical: true, notes: 'Could mean: to humanize deeply, to make very sociable' },

    // Form III (فَاعَلَ)
    { form: 'آنَسَ', pattern: 'فَاعَلَ', meaning: 'to befriend, to keep company', isTheoretical: false },
    { form: 'يُؤَانِسُ', pattern: 'يُفَاعِلُ', meaning: 'he befriends', isTheoretical: false },
    { form: 'مُؤَانَسَة', pattern: 'مُفَاعَلَة', meaning: 'companionship, socialization', isTheoretical: false },

    // Form IV (أَفْعَلَ)
    { form: 'آنَسَ', pattern: 'أَفْعَلَ', meaning: 'to perceive, to notice', isTheoretical: false },
    { form: 'يُؤْنِسُ', pattern: 'يُفْعِلُ', meaning: 'he perceives', isTheoretical: false },

    // Form V (تَفَعَّلَ)
    { form: 'تَأَنَّسَ', pattern: 'تَفَعَّلَ', meaning: 'to become human/civilized, to feel at ease', isTheoretical: false },
    { form: 'يَتَأَنَّسُ', pattern: 'يَتَفَعَّلُ', meaning: 'he becomes at ease', isTheoretical: false },
    { form: 'مُتَأَنِّس', pattern: 'مُتَفَعِّل', meaning: 'civilized, at ease', isTheoretical: false },
    { form: 'تَأَنُّس', pattern: 'تَفَعُّل', meaning: 'becoming civilized, ease', isTheoretical: false },

    // Form VI (تَفَاعَلَ)
    { form: 'تَآنَسَ', pattern: 'تَفَاعَلَ', meaning: 'to be on friendly terms, to socialize', isTheoretical: false },
    { form: 'يَتَآنَسُ', pattern: 'يَتَفَاعَلُ', meaning: 'they socialize', isTheoretical: false },

    // Form VII (انْفَعَلَ)
    { form: 'انْأَنَسَ', pattern: 'انْفَعَلَ', meaning: null, isTheoretical: true, notes: 'Could mean: to be humanized, to be tamed' },

    // Form VIII (افْتَعَلَ)
    { form: 'ائْتَنَسَ', pattern: 'افْتَعَلَ', meaning: 'to feel comfortable, to be at ease', isTheoretical: false },
    { form: 'يَأْتَنِسُ', pattern: 'يَفْتَعِلُ', meaning: 'he feels at ease', isTheoretical: false },

    // Form X (اسْتَفْعَلَ)
    { form: 'اسْتَأْنَسَ', pattern: 'اسْتَفْعَلَ', meaning: 'to seek permission, to feel at ease', isTheoretical: false },
    { form: 'يَسْتَأْنِسُ', pattern: 'يَسْتَفْعِلُ', meaning: 'he seeks permission', isTheoretical: false },
    { form: 'اسْتِئْنَاس', pattern: 'اسْتِفْعَال', meaning: 'seeking permission, taming', isTheoretical: false },

    // Additional forms
    { form: 'أَنِيس', pattern: 'فَعِيل', meaning: 'companion, friendly', isTheoretical: false },
    { form: 'إِنْسَانِيّ', pattern: 'إِفْعَالِيّ', meaning: 'human, humane', isTheoretical: false },
    { form: 'إِنْسَانِيَّة', pattern: 'إِفْعَالِيَّة', meaning: 'humanity, humaneness', isTheoretical: false },
    { form: 'أَلِيف', pattern: 'فَعِيل', meaning: 'tame, familiar', isTheoretical: false },
  ],

  // الله (Allah) - Special case, not a tri-root
  // Note: الله is the proper name and doesn't follow standard root derivations
  // But we can list grammatical variants and related words from the root أ-ل-ه
  allah: [
    // Base forms
    { form: 'الله', pattern: 'Special', meaning: 'Allah, The One True God', isTheoretical: false },
    { form: 'إِلٰه', pattern: 'إِفْعَال', meaning: 'god, deity', isTheoretical: false },
    { form: 'آلِهَة', pattern: 'فَاعِلَة', meaning: 'gods, deities (plural)', isTheoretical: false },

    // Form II (فَعَّلَ) - from root أ-ل-ه
    { form: 'أَلَّهَ', pattern: 'فَعَّلَ', meaning: null, isTheoretical: true, notes: 'Could mean: to deify, to make into a god' },
    { form: 'يُؤَلِّهُ', pattern: 'يُفَعِّلُ', meaning: null, isTheoretical: true, notes: 'Might mean: to worship as god' },
    { form: 'تَأْلِيه', pattern: 'تَفْعِيل', meaning: 'deification', isTheoretical: false },

    // Form V (تَفَعَّلَ)
    { form: 'تَأَلَّهَ', pattern: 'تَفَعَّلَ', meaning: 'to claim divinity, to play god', isTheoretical: false },
    { form: 'يَتَأَلَّهُ', pattern: 'يَتَفَعَّلُ', meaning: 'he claims divinity', isTheoretical: false },
    { form: 'مُتَأَلِّه', pattern: 'مُتَفَعِّل', meaning: 'one claiming divinity', isTheoretical: false },

    // Grammatical cases of الله
    { form: 'اللَّهُ', pattern: 'Nominative', meaning: 'Allah (subject)', isTheoretical: false },
    { form: 'اللَّهِ', pattern: 'Genitive', meaning: 'Allah (possessive)', isTheoretical: false },
    { form: 'اللَّهَ', pattern: 'Accusative', meaning: 'Allah (object)', isTheoretical: false },

    // With prepositions
    { form: 'لِلَّهِ', pattern: 'Prepositional', meaning: 'for Allah, to Allah', isTheoretical: false },
    { form: 'بِاللَّهِ', pattern: 'Prepositional', meaning: 'by Allah, with Allah', isTheoretical: false },
    { form: 'وَاللَّهِ', pattern: 'Oath', meaning: 'by Allah! (oath)', isTheoretical: false },

    // Related theological terms
    { form: 'أُلُوهِيَّة', pattern: 'فُعُولِيَّة', meaning: 'divinity, godhood', isTheoretical: false },
    { form: 'إِلٰهِيّ', pattern: 'إِفْعَالِيّ', meaning: 'divine', isTheoretical: false },
  ],
}

// Function to get all forms for a root key
export function getAllFormsForRoot(rootKey: string): RootForm[] {
  return rootForms[rootKey as keyof typeof rootForms] || []
}

// Function to extract just the form strings for searching
export function getSearchVariantsForRoot(rootKey: string): string[] {
  const forms = getAllFormsForRoot(rootKey)
  return forms.map(f => f.form)
}

// Function to get only attested (non-theoretical) forms
export function getAttestedFormsForRoot(rootKey: string): RootForm[] {
  const forms = getAllFormsForRoot(rootKey)
  return forms.filter(f => !f.isTheoretical)
}

// Function to get only theoretical forms
export function getTheoreticalFormsForRoot(rootKey: string): RootForm[] {
  const forms = getAllFormsForRoot(rootKey)
  return forms.filter(f => f.isTheoretical)
}

// Statistics
export function getRootFormStats(rootKey: string): {
  total: number
  attested: number
  theoretical: number
  percentageTheoretical: number
} {
  const forms = getAllFormsForRoot(rootKey)
  const attested = forms.filter(f => !f.isTheoretical).length
  const theoretical = forms.filter(f => f.isTheoretical).length

  return {
    total: forms.length,
    attested,
    theoretical,
    percentageTheoretical: Math.round((theoretical / forms.length) * 100)
  }
}
