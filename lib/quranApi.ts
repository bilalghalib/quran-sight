// Client-side API functions for Quran Foundation API

export interface Word {
  id: number
  position: number
  audio_url?: string
  char_type_name: string
  text_uthmani: string
  text_indopak?: string
  text_imlaei?: string
  page_number: number
  line_number: number
  translation?: {
    text: string
    language_name: string
  }
  transliteration?: {
    text: string
    language_name: string
  }
}

export interface Translation {
  id: number
  resource_id: number
  text: string
  language_name?: string
  resource_name?: string
}

export interface VerseWithData {
  id: number
  verse_number: number
  verse_key: string
  text_uthmani: string
  text_indopak?: string
  text_imlaei?: string
  words?: Word[]
  translations?: Translation[]
}

let accessToken: string | null = null
let tokenExpiry: number = 0

// Get access token (cached)
async function getAccessToken(): Promise<string> {
  if (accessToken && Date.now() < tokenExpiry) {
    return accessToken
  }

  const response = await fetch('/api/quran/auth', {
    method: 'POST'
  })

  if (!response.ok) {
    throw new Error('Failed to authenticate with Quran API')
  }

  const data = await response.json()
  accessToken = data.access_token
  tokenExpiry = Date.now() + (data.expires_in - 60) * 1000 // Refresh 1 min before expiry

  if (!accessToken) {
    throw new Error('No access token received from authentication')
  }

  return accessToken
}

// Fetch verse by chapter and verse number with translations and word data
export async function fetchVerseData(
  chapterNumber: number,
  verseNumber: number
): Promise<VerseWithData | null> {
  try {
    const token = await getAccessToken()

    const response = await fetch(
      `/api/quran/verse?chapter=${chapterNumber}&verse=${verseNumber}`,
      {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      }
    )

    if (!response.ok) {
      throw new Error('Failed to fetch verse data')
    }

    const data = await response.json()
    return data.verse
  } catch (error) {
    console.error('Error fetching verse data:', error)
    return null
  }
}
