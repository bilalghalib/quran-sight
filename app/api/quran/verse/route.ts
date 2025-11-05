import { NextRequest, NextResponse } from 'next/server'

export const dynamic = 'force-dynamic'

let cachedToken: string | null = null
let tokenExpiry: number = 0

async function getAccessToken(): Promise<string> {
  if (cachedToken && Date.now() < tokenExpiry) {
    return cachedToken
  }

  const clientId = process.env.QURAN_CLIENT_ID
  const clientSecret = process.env.QURAN_CLIENT_SECRET
  const authUrl = process.env.NEXT_PUBLIC_QURAN_AUTH_URL

  if (!clientId || !clientSecret || !authUrl) {
    throw new Error('API credentials not configured')
  }

  // OAuth2 expects Basic auth with form-urlencoded data
  const auth = Buffer.from(`${clientId}:${clientSecret}`).toString('base64')

  const formData = new URLSearchParams({
    grant_type: 'client_credentials',
    scope: 'content'
  })

  const response = await fetch(`${authUrl}/oauth2/token`, {
    method: 'POST',
    headers: {
      'Authorization': `Basic ${auth}`,
      'Content-Type': 'application/x-www-form-urlencoded',
    },
    body: formData.toString()
  })

  if (!response.ok) {
    const errorText = await response.text()
    console.error('OAuth error:', errorText)
    throw new Error('Failed to authenticate')
  }

  const data = await response.json()
  cachedToken = data.access_token
  tokenExpiry = Date.now() + (data.expires_in - 60) * 1000

  return cachedToken
}

export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams
  const chapter = searchParams.get('chapter')
  const verse = searchParams.get('verse')

  if (!chapter || !verse) {
    return NextResponse.json(
      { error: 'Missing chapter or verse parameter' },
      { status: 400 }
    )
  }

  const clientId = process.env.QURAN_CLIENT_ID
  const apiBaseUrl = process.env.NEXT_PUBLIC_QURAN_API_BASE_URL

  if (!clientId || !apiBaseUrl) {
    return NextResponse.json(
      { error: 'API not configured' },
      { status: 500 }
    )
  }

  try {
    const token = await getAccessToken()

    // Construct the verse key (e.g., "1:1")
    const verseKey = `${chapter}:${verse}`

    // Fetch verse with translations and word data
    // Using translation ID 20 (English) and 131 (Clear Quran - Dr. Mustafa Khattab)
    const params = new URLSearchParams({
      language: 'en',
      words: 'true',
      translations: '20,131', // Try comma-separated values
      word_fields: 'text_uthmani,text_imlaei,translation,transliteration',
      translation_fields: 'resource_name,language_name'
    })

    const url = `${apiBaseUrl}/verses/by_key/${verseKey}?${params}`

    console.log('Requesting URL:', url)

    const response = await fetch(url, {
      headers: {
        'x-auth-token': token,
        'x-client-id': clientId,
        'Accept': 'application/json'
      }
    })

    if (!response.ok) {
      const errorText = await response.text()
      console.error('API error:', errorText)
      return NextResponse.json(
        { error: 'Failed to fetch verse data', details: errorText },
        { status: response.status }
      )
    }

    const data = await response.json()
    console.log('Quran Foundation API Response keys:', Object.keys(data))
    console.log('Has translations:', 'translations' in data)
    if (data.verse) {
      console.log('Verse keys:', Object.keys(data.verse))
      console.log('Verse has translations:', 'translations' in data.verse)
    }
    return NextResponse.json(data)
  } catch (error) {
    console.error('Error fetching verse:', error)
    return NextResponse.json(
      { error: 'Internal server error', details: error instanceof Error ? error.message : 'Unknown error' },
      { status: 500 }
    )
  }
}
