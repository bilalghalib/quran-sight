// Server-side Quran API client using the official SDK
import { QuranClient, Language } from '@quranjs/api'

let clientInstance: QuranClient | null = null

export function getQuranClient(): QuranClient {
  if (!clientInstance) {
    const clientId = process.env.QURAN_CLIENT_ID
    const clientSecret = process.env.QURAN_CLIENT_SECRET

    if (!clientId || !clientSecret) {
      throw new Error('Quran API credentials not configured')
    }

    console.log('Initializing Quran Client with:', {
      clientId,
      hasSecret: !!clientSecret,
      baseURL: 'https://apis-prelive.quran.foundation/content/api/v4',
      authURL: 'https://prelive-oauth2.quran.foundation'
    })

    // Use prelive environment for testing
    clientInstance = new QuranClient({
      clientId,
      clientSecret,
      defaults: {
        language: Language.ENGLISH,
      },
      // For prelive environment - try without custom URLs first
    })
  }

  return clientInstance
}
