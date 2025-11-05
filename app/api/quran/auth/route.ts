import { NextResponse } from 'next/server'

export async function POST() {
  const clientId = process.env.QURAN_CLIENT_ID
  const clientSecret = process.env.QURAN_CLIENT_SECRET
  const authUrl = process.env.NEXT_PUBLIC_QURAN_AUTH_URL

  if (!clientId || !clientSecret || !authUrl) {
    return NextResponse.json(
      { error: 'API credentials not configured' },
      { status: 500 }
    )
  }

  try {
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
      return NextResponse.json(
        { error: 'Failed to authenticate' },
        { status: response.status }
      )
    }

    const data = await response.json()
    return NextResponse.json(data)
  } catch (error) {
    console.error('Authentication error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}
