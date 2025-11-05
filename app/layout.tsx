import type { Metadata } from 'next'
import './globals.css'

export const metadata: Metadata = {
  title: 'Quran Sight - Visual Exploration',
  description: 'A visual exploration tool for the Quran using spiral patterns',
  authors: [{ name: 'Bilal Ghalib' }],
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <head>
        <link
          href="https://fonts.googleapis.com/css2?family=Noto+Naskh+Arabic&display=swap"
          rel="stylesheet"
        />
      </head>
      <body suppressHydrationWarning>{children}</body>
    </html>
  )
}
