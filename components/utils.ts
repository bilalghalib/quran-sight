const abjadMap: Record<string, number> = {
  'ا': 1, 'ب': 2, 'ج': 3, 'د': 4, 'ه': 5, 'و': 6, 'ز': 7, 'ح': 8, 'ط': 9,
  'ي': 10, 'ك': 20, 'ل': 30, 'م': 40, 'ن': 50, 'س': 60, 'ع': 70, 'ف': 80,
  'ص': 90, 'ق': 100, 'ر': 200, 'ش': 300, 'ت': 400, 'ث': 500, 'خ': 600,
  'ذ': 700, 'ض': 800, 'ظ': 900, 'غ': 1000,
}

export function getAbjadValue(word: string, isWordTotal: boolean): number {
  let value = 0
  if (isWordTotal) {
    for (let i = 0; i < word.length; i++) {
      value += abjadMap[word[i]] || 0
    }
  } else {
    value = abjadMap[word[0]] || 0
  }
  return value
}

export function getColorByAbjadValue(value: number): string {
  const hue = (value * 137.508) % 360
  return `hsl(${hue}, 50%, 50%)`
}

export function cleanupHarakat(str: string): string {
  // Remove all harakat and space from string
  const compareStr = /[\u0617-\u061A\u064B-\u0652\s]/ig
  return str.replaceAll(compareStr, '')
}

export function containsRoot(word: string, root: string): boolean {
  // Check if word contains all letters from root (for tri-literal root search)
  if (!root || !word) return false

  const cleanWord = cleanupHarakat(word)
  const cleanRoot = cleanupHarakat(root)

  // Check if all root letters are present in the word
  for (const letter of cleanRoot) {
    if (!cleanWord.includes(letter)) {
      return false
    }
  }
  return true
}
