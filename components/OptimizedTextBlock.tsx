'use client'

import { useEffect, useState, useRef } from 'react'
import Mark from 'mark.js'
import { rootPatterns, RootKey, presetSearches, matchesRoot } from '@/lib/arabicRoots'
import SearchDrawer from './SearchDrawer'
import VerseDetail from './VerseDetail'

interface Verse {
  number: number
  text: string
  words: string[]
}

interface SearchResult {
  verseNumber: number
  verse: string
  wordIndex: number
  context: string
}

export default function OptimizedTextBlock() {
  const textContainerRef = useRef<HTMLDivElement>(null)
  const markInstanceRef = useRef<Mark | null>(null)

  const [verses, setVerses] = useState<Verse[]>([])
  const [fullText, setFullText] = useState('')
  const [fontSize, setFontSize] = useState(4)
  const [lineHeight, setLineHeight] = useState(1.0)
  const [letterSpacing, setLetterSpacing] = useState(0)
  const [searchTerm, setSearchTerm] = useState('')
  const [searchResults, setSearchResults] = useState<SearchResult[]>([])
  const [selectedVerse, setSelectedVerse] = useState<Verse | null>(null)
  const [bgColor, setBgColor] = useState('#ffffff')
  const [textColor, setTextColor] = useState('#000000')
  const [padding, setPadding] = useState(20)
  const [isLoading, setIsLoading] = useState(true)
  const [activeRoot, setActiveRoot] = useState<RootKey | null>(null)
  const [selectedPatterns, setSelectedPatterns] = useState<Set<string>>(new Set())

  // Initialize Mark.js instance
  useEffect(() => {
    if (textContainerRef.current && !isLoading) {
      markInstanceRef.current = new Mark(textContainerRef.current)
    }
  }, [isLoading])

  // Load Quran text with caching
  useEffect(() => {
    setIsLoading(true)

    const cached = localStorage.getItem('quran-verses')
    if (cached) {
      try {
        const parsedVerses = JSON.parse(cached)
        setVerses(parsedVerses)
        const combined = parsedVerses.map((v: Verse) => v.text).join(' ')
        setFullText(combined)
        setIsLoading(false)
        return
      } catch (e) {
        console.error('Cache error:', e)
      }
    }

    fetch('/quran.txt')
      .then(response => response.text())
      .then(text => {
        const lines = text.split('\n').slice(0, 6236).filter(line => line.trim())
        const parsedVerses: Verse[] = lines.map((line, index) => ({
          number: index + 1,
          text: line,
          words: line.split(/\s+/).filter(w => w.trim())
        }))

        localStorage.setItem('quran-verses', JSON.stringify(parsedVerses))
        setVerses(parsedVerses)
        const combined = parsedVerses.map(v => v.text).join(' ')
        setFullText(combined)
        setIsLoading(false)
      })
      .catch(error => {
        console.error('Error loading Quranic text:', error)
        setIsLoading(false)
      })
  }, [])

  // Handle search with Mark.js highlighting
  const handleSearch = (term: string) => {
    setSearchTerm(term)
    setActiveRoot(null)

    if (!markInstanceRef.current) return

    // Clear previous highlights
    markInstanceRef.current.unmark()

    if (!term.trim()) {
      setSearchResults([])
      return
    }

    // Highlight with Mark.js
    markInstanceRef.current.mark(term, {
      separateWordSearch: false,
      acrossElements: true,
      caseSensitive: false,
      className: 'highlight-match',
      done: () => {
        // Build search results after highlighting
        const results: SearchResult[] = []
        verses.forEach((verse) => {
          verse.words.forEach((word, wordIndex) => {
            if (word.includes(term)) {
              const start = Math.max(0, wordIndex - 3)
              const end = Math.min(verse.words.length, wordIndex + 4)
              const context = verse.words.slice(start, end).join(' ')

              results.push({
                verseNumber: verse.number,
                verse: verse.text,
                wordIndex,
                context
              })
            }
          })
        })
        setSearchResults(results)
      }
    })
  }

  // Handle root-based search
  const handleRootSearch = (rootKey: RootKey) => {
    setActiveRoot(rootKey)
    setSearchTerm('')

    if (!markInstanceRef.current) return

    // Clear previous highlights
    markInstanceRef.current.unmark()

    const results: SearchResult[] = []
    const matchedWords = new Set<string>()

    // Find all matching words
    verses.forEach((verse) => {
      verse.words.forEach((word, wordIndex) => {
        if (matchesRoot(word, rootKey)) {
          matchedWords.add(word)

          const start = Math.max(0, wordIndex - 3)
          const end = Math.min(verse.words.length, wordIndex + 4)
          const context = verse.words.slice(start, end).join(' ')

          results.push({
            verseNumber: verse.number,
            verse: verse.text,
            wordIndex,
            context
          })
        }
      })
    })

    // Highlight all matched words
    const wordsArray = Array.from(matchedWords)
    if (wordsArray.length > 0) {
      markInstanceRef.current.mark(wordsArray, {
        separateWordSearch: false,
        acrossElements: true,
        className: 'highlight-root',
        done: () => {
          setSearchResults(results)
        }
      })
    }
  }

  const clearSearch = () => {
    setSearchTerm('')
    setActiveRoot(null)
    setSearchResults([])
    if (markInstanceRef.current) {
      markInstanceRef.current.unmark()
    }
  }

  const handleVerseClick = (verseNumber: number) => {
    const verse = verses.find(v => v.number === verseNumber)
    if (verse) {
      setSelectedVerse(verse)
    }
  }

  const invertColors = () => {
    setBgColor(prev => prev === '#ffffff' ? '#000000' : '#ffffff')
    setTextColor(prev => prev === '#000000' ? '#ffffff' : '#000000')
  }

  return (
    <div style={{ display: 'flex', backgroundColor: '#1a1a1a', height: '100vh' }}>
      <style>{`
        .highlight-match {
          background-color: rgba(255, 255, 0, 0.4);
          color: #ff0000;
          font-weight: bold;
          padding: 1px 0;
        }
        .highlight-root {
          background-color: rgba(76, 175, 80, 0.3);
          color: #ff0000;
          font-weight: bold;
          padding: 1px 0;
        }
      `}</style>

      {/* Main Text Area */}
      <div style={{ flex: 1, position: 'relative', overflow: 'auto' }}>
        {/* Controls */}
        <div style={{
          position: 'fixed',
          top: 20,
          left: 20,
          zIndex: 10,
          backgroundColor: 'rgba(50, 50, 50, 0.95)',
          padding: '20px',
          borderRadius: '8px',
          boxShadow: '0 2px 10px rgba(0,0,0,0.5)',
          color: '#fff',
          minWidth: '280px',
          maxHeight: 'calc(100vh - 80px)',
          overflowY: 'auto'
        }}>
          <h3 style={{ margin: '0 0 15px 0', fontSize: '16px', borderBottom: '1px solid #555', paddingBottom: '10px' }}>
            Typography Controls
          </h3>

          <div style={{ marginBottom: '15px' }}>
            <label style={{ display: 'block', marginBottom: '5px', fontSize: '13px', fontWeight: 'bold' }}>
              Font Size: {fontSize}px
            </label>
            <input
              type="range"
              min="2"
              max="16"
              step="0.5"
              value={fontSize}
              onChange={(e) => setFontSize(Number(e.target.value))}
              style={{ width: '100%' }}
            />
          </div>

          <div style={{ marginBottom: '15px' }}>
            <label style={{ display: 'block', marginBottom: '5px', fontSize: '13px', fontWeight: 'bold' }}>
              Line Height: {lineHeight.toFixed(2)}
            </label>
            <input
              type="range"
              min="0.8"
              max="2"
              step="0.05"
              value={lineHeight}
              onChange={(e) => setLineHeight(Number(e.target.value))}
              style={{ width: '100%' }}
            />
          </div>

          <div style={{ marginBottom: '15px' }}>
            <label style={{ display: 'block', marginBottom: '5px', fontSize: '13px', fontWeight: 'bold' }}>
              Letter Spacing: {letterSpacing.toFixed(1)}px
            </label>
            <input
              type="range"
              min="-2"
              max="3"
              step="0.5"
              value={letterSpacing}
              onChange={(e) => setLetterSpacing(Number(e.target.value))}
              style={{ width: '100%' }}
            />
          </div>

          <div style={{ marginBottom: '15px' }}>
            <label style={{ display: 'block', marginBottom: '5px', fontSize: '13px', fontWeight: 'bold' }}>
              Padding: {padding}px
            </label>
            <input
              type="range"
              min="5"
              max="100"
              step="5"
              value={padding}
              onChange={(e) => setPadding(Number(e.target.value))}
              style={{ width: '100%' }}
            />
          </div>

          <button
            onClick={invertColors}
            style={{
              width: '100%',
              padding: '10px',
              backgroundColor: '#4CAF50',
              color: 'white',
              border: 'none',
              borderRadius: '4px',
              cursor: 'pointer',
              fontSize: '14px',
              marginBottom: '15px'
            }}
          >
            Invert Colors
          </button>

          <div style={{ borderTop: '1px solid #555', paddingTop: '15px', marginBottom: '15px' }}>
            <label style={{ display: 'block', marginBottom: '8px', fontSize: '13px', fontWeight: 'bold' }}>
              Quick Search (Root-Based):
            </label>
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '5px', marginBottom: '10px' }}>
              {presetSearches.slice(0, 4).map(preset => (
                <button
                  key={preset.key}
                  onClick={() => handleRootSearch(preset.key)}
                  style={{
                    padding: '6px 10px',
                    fontSize: '11px',
                    backgroundColor: activeRoot === preset.key ? '#4CAF50' : '#444',
                    color: '#fff',
                    border: 'none',
                    borderRadius: '4px',
                    cursor: 'pointer',
                    flex: '1 1 calc(50% - 3px)',
                    minWidth: '0'
                  }}
                  title={preset.label}
                >
                  {preset.icon} {rootPatterns[preset.key].concept}
                </button>
              ))}
            </div>
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '5px' }}>
              {presetSearches.slice(4).map(preset => (
                <button
                  key={preset.key}
                  onClick={() => handleRootSearch(preset.key)}
                  style={{
                    padding: '6px 10px',
                    fontSize: '11px',
                    backgroundColor: activeRoot === preset.key ? '#4CAF50' : '#444',
                    color: '#fff',
                    border: 'none',
                    borderRadius: '4px',
                    cursor: 'pointer',
                    flex: '1 1 calc(50% - 3px)',
                    minWidth: '0'
                  }}
                  title={preset.label}
                >
                  {preset.icon} {rootPatterns[preset.key].concept}
                </button>
              ))}
            </div>
          </div>

          <div style={{ borderTop: '1px solid #555', paddingTop: '15px' }}>
            <label style={{ display: 'block', marginBottom: '8px', fontSize: '13px', fontWeight: 'bold' }}>
              Custom Search:
            </label>
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => handleSearch(e.target.value)}
              placeholder="Search Arabic text..."
              style={{
                padding: '8px',
                width: '100%',
                border: '1px solid #555',
                borderRadius: '4px',
                fontFamily: 'Noto Naskh Arabic, Arial',
                backgroundColor: '#2a2a2a',
                color: '#fff'
              }}
            />
            {(searchTerm || activeRoot) && (
              <button
                onClick={clearSearch}
                style={{
                  width: '100%',
                  padding: '6px',
                  marginTop: '8px',
                  backgroundColor: '#d32f2f',
                  color: 'white',
                  border: 'none',
                  borderRadius: '4px',
                  cursor: 'pointer',
                  fontSize: '12px'
                }}
              >
                Clear Search
              </button>
            )}
          </div>

          <div style={{ marginTop: '15px', fontSize: '11px', color: '#999', borderTop: '1px solid #555', paddingTop: '10px' }}>
            <strong>Verses:</strong> {verses.length}<br />
            <strong>Characters:</strong> {fullText.length.toLocaleString()}<br />
            {searchResults.length > 0 && (
              <>
                <strong>Found:</strong> {searchResults.length} matches<br />
                {activeRoot && (
                  <strong style={{ color: '#4CAF50' }}>
                    Root: {rootPatterns[activeRoot].concept}
                  </strong>
                )}
              </>
            )}
          </div>
        </div>

        {/* Loading State */}
        {isLoading && (
          <div style={{
            position: 'fixed',
            top: '50%',
            left: '50%',
            transform: 'translate(-50%, -50%)',
            backgroundColor: 'rgba(50, 50, 50, 0.95)',
            padding: '30px 50px',
            borderRadius: '12px',
            color: '#fff',
            fontSize: '18px',
            textAlign: 'center',
            zIndex: 100
          }}>
            <div style={{ marginBottom: '15px', fontSize: '24px' }}>⏳</div>
            Loading Quran text...
          </div>
        )}

        {/* Text Content with Mark.js highlighting */}
        {!isLoading && (
          <div
            ref={textContainerRef}
            style={{
              padding: `${padding}px`,
              backgroundColor: bgColor,
              color: textColor,
              fontSize: `${fontSize}px`,
              lineHeight: lineHeight,
              letterSpacing: `${letterSpacing}px`,
              fontFamily: 'Noto Naskh Arabic, Arial',
              direction: 'rtl',
              textAlign: 'justify',
              minHeight: '100vh',
              wordWrap: 'break-word',
              contain: 'layout style paint'
            }}
          >
            {fullText}
          </div>
        )}
      </div>

      {/* Search Results Drawer */}
      <SearchDrawer
        results={searchResults}
        onVerseClick={handleVerseClick}
        selectedPatterns={selectedPatterns}
        onPatternsChange={setSelectedPatterns}
      />

      {/* Verse Detail Modal */}
      {selectedVerse && (
        <VerseDetail
          verse={selectedVerse}
          onClose={() => setSelectedVerse(null)}
        />
      )}
    </div>
  )
}
