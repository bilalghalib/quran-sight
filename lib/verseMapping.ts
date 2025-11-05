// Quran chapter verse counts (standard Mushaf)
// Total: 6236 verses across 114 chapters
export const chapterVerseCounts = [
  7, 286, 200, 176, 120, 165, 206, 75, 129, 109, // 1-10
  123, 111, 43, 52, 99, 128, 111, 110, 98, 135, // 11-20
  112, 78, 118, 64, 77, 227, 93, 88, 69, 60, // 21-30
  34, 30, 73, 54, 45, 83, 182, 88, 75, 85, // 31-40
  54, 53, 89, 59, 37, 35, 38, 29, 18, 45, // 41-50
  60, 49, 62, 55, 78, 96, 29, 22, 24, 13, // 51-60
  14, 11, 11, 18, 12, 12, 30, 52, 52, 44, // 61-70
  28, 28, 20, 56, 40, 31, 50, 40, 46, 42, // 71-80
  29, 19, 36, 25, 22, 17, 19, 26, 30, 20, // 81-90
  15, 21, 11, 8, 8, 19, 5, 8, 8, 11, // 91-100
  11, 8, 3, 9, 5, 4, 7, 3, 6, 3, // 101-110
  5, 4, 5, 6 // 111-114
]

// Total verses up to and including each chapter
let cumulativeVerses = [0]
for (let i = 0; i < chapterVerseCounts.length; i++) {
  cumulativeVerses.push(cumulativeVerses[i] + chapterVerseCounts[i])
}

/**
 * Convert sequential verse number (1-6236) to chapter:verse format
 * @param sequentialNumber - Sequential verse number from 1 to 6236
 * @returns Object with chapter number (1-114) and verse number within that chapter
 */
export function getChapterAndVerse(sequentialNumber: number): { chapter: number; verse: number } {
  if (sequentialNumber < 1 || sequentialNumber > 6236) {
    throw new Error(`Invalid verse number: ${sequentialNumber}. Must be between 1 and 6236.`)
  }

  // Find which chapter this verse belongs to
  for (let chapter = 0; chapter < chapterVerseCounts.length; chapter++) {
    if (sequentialNumber <= cumulativeVerses[chapter + 1]) {
      const verseInChapter = sequentialNumber - cumulativeVerses[chapter]
      return {
        chapter: chapter + 1, // Convert to 1-indexed
        verse: verseInChapter
      }
    }
  }

  // Fallback (should never reach here)
  return { chapter: 1, verse: 1 }
}

/**
 * Convert chapter:verse to sequential verse number
 * @param chapter - Chapter number (1-114)
 * @param verse - Verse number within chapter
 * @returns Sequential verse number (1-6236)
 */
export function getSequentialNumber(chapter: number, verse: number): number {
  if (chapter < 1 || chapter > 114) {
    throw new Error(`Invalid chapter: ${chapter}. Must be between 1 and 114.`)
  }

  if (verse < 1 || verse > chapterVerseCounts[chapter - 1]) {
    throw new Error(`Invalid verse: ${verse}. Chapter ${chapter} has ${chapterVerseCounts[chapter - 1]} verses.`)
  }

  return cumulativeVerses[chapter - 1] + verse
}

/**
 * Get chapter info
 * @param chapter - Chapter number (1-114)
 */
export function getChapterInfo(chapter: number) {
  if (chapter < 1 || chapter > 114) {
    throw new Error(`Invalid chapter: ${chapter}. Must be between 1 and 114.`)
  }

  return {
    number: chapter,
    verseCount: chapterVerseCounts[chapter - 1],
    startVerse: cumulativeVerses[chapter - 1] + 1,
    endVerse: cumulativeVerses[chapter]
  }
}
