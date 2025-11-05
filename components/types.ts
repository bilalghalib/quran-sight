export type SpiralType = 'logarithmic' | 'archimedean' | 'goldenMean' | 'fibonacci' | 'rose' | 'epitrochoid' | 'hypotrochoid'

export interface SpiralSettings {
  spiralType: SpiralType
  fontSize: number
  spiralDensity: number
  abjadColorEnabled: boolean
  abjadSizeEnabled: boolean
  abjadWordTotalEnabled: boolean
}

export interface RoseSettings {
  minimumRadius: number
  petalCount: number
  growthFactor: number
  angleStep: number
}

export interface TrochoidSettings {
  minimumRadius: number
  growthFactor: number
  angleStep: number
  innerRadii: number
  outerRadii: number
  distance: number
}

export interface AnimationSettings {
  fontSizeStart: number
  fontSizeEnd: number
  fontSizeStep: number
  fontSizeSpeed: number
  spiralDensityStart: number
  spiralDensityEnd: number
  spiralDensityStep: number
  spiralDensitySpeed: number
}
