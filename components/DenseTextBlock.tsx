'use client'

import { useEffect, useRef, useState, useMemo } from 'react'
import { Stage, Layer, Text as KonvaText, Rect } from 'react-konva'
import Konva from 'konva'
import { cleanupHarakat } from './utils'
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

export default function DenseTextBlock() {
  const stageRef = useRef<Konva.Stage>(null)
  const textRef = useRef<Konva.Text>(null)
  const [verses, setVerses] = useState<Verse[]>([])
  const [fullText, setFullText] = useState('')
  const [fontSize, setFontSize] = useState(4)
  const [lineHeight, setLineHeight] = useState(1.0)
  const [letterSpacing, setLetterSpacing] = useState(0)
  const [searchTerm, setSearchTerm] = useState('')
  const [searchResults, setSearchResults] = useState<SearchResult[]>([])
  const [selectedVerse, setSelectedVerse] = useState<Verse | null>(null)
  const [stageSize, setStageSize] = useState({ width: 1200, height: 800 })
  const [bgColor, setBgColor] = useState('#ffffff')
  const [textColor, setTextColor] = useState('#000000')
  const [padding, setPadding] = useState(20)
  const [isLoading, setIsLoading] = useState(true)
  const [activeRoot, setActiveRoot] = useState<RootKey | null>(null)

  // Load Quran text with optimization
  useEffect(() => {
    setIsLoading(true)

    // Check if we have cached data
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

    // Load fresh
    fetch('/quran.txt')
      .then(response => response.text())
      .then(text => {
        const lines = text.split('\n').slice(0, 6236).filter(line => line.trim())
        const parsedVerses: Verse[] = lines.map((line, index) => ({
          number: index + 1,
          text: line,
          words: line.split(/\s+/).filter(w => w.trim())
        }))

        // Cache the parsed data
        localStorage.setItem('quran-verses', JSON.stringify(parsedVerses))

        setVerses(parsedVerses)

        // Create one continuous text string
        const combined = parsedVerses.map(v => v.text).join(' ')
        setFullText(combined)
        setIsLoading(false)
      })
      .catch(error => {
        console.error('Error loading Quranic text:', error)
        setIsLoading(false)
      })
  }, [])

  // Calculate stage size based on window
  useEffect(() => {
    const updateSize = () => {
      const width = window.innerWidth - 400 // Leave space for drawer
      const height = window.innerHeight - 40
      setStageSize({ width, height })
    }

    updateSize()
    window.addEventListener('resize', updateSize)
    return () => window.removeEventListener('resize', updateSize)
  }, [])

  // Handle search (regular text search)
  const handleSearch = (term: string) => {
    setSearchTerm(term)
    setActiveRoot(null)

    if (!term.trim()) {
      setSearchResults([])
      return
    }

    const cleanTerm = cleanupHarakat(term)
    const results: SearchResult[] = []

    verses.forEach((verse) => {
      verse.words.forEach((word, wordIndex) => {
        const cleanWord = cleanupHarakat(word)
        if (cleanWord.includes(cleanTerm) || cleanTerm.includes(cleanWord)) {
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

  // Handle root-based search
  const handleRootSearch = (rootKey: RootKey) => {
    setActiveRoot(rootKey)
    setSearchTerm('')

    const results: SearchResult[] = []

    verses.forEach((verse) => {
      verse.words.forEach((word, wordIndex) => {
        if (matchesRoot(word, rootKey)) {
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

  const clearSearch = () => {
    setSearchTerm('')
    setActiveRoot(null)
    setSearchResults([])
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
      {/* Main Canvas */}
      <div style={{ flex: 1, position: 'relative', overflow: 'hidden', padding: '20px' }}>
        {/* Controls */}
        <div style={{
          position: 'absolute',
          top: 20,
          left: 20,
          zIndex: 10,
          backgroundColor: 'rgba(50, 50, 50, 0.95)',
          padding: '20px',
          borderRadius: '8px',
          boxShadow: '0 2px 10px rgba(0,0,0,0.5)',
          color: '#fff',
          minWidth: '280px'
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
              Letter Spacing: {letterSpacing.toFixed(1)}
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
            position: 'absolute',
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
            <div style={{ fontSize: '12px', color: '#999', marginTop: '10px' }}>
              {verses.length > 0 ? `${verses.length} verses loaded` : 'Please wait...'}
            </div>
          </div>
        )}

        {/* Konva Stage */}
        <Stage
          ref={stageRef}
          width={stageSize.width}
          height={stageSize.height}
          draggable
          onWheel={(e) => {
            e.evt.preventDefault()
            const stage = stageRef.current
            if (!stage) return

            const oldScale = stage.scaleX()
            const pointer = stage.getPointerPosition()
            if (!pointer) return

            const mousePointTo = {
              x: (pointer.x - stage.x()) / oldScale,
              y: (pointer.y - stage.y()) / oldScale,
            }

            const newScale = e.evt.deltaY < 0 ? oldScale * 1.1 : oldScale / 1.1
            const clampedScale = Math.max(0.5, Math.min(5, newScale))

            stage.scale({ x: clampedScale, y: clampedScale })
            stage.position({
              x: pointer.x - mousePointTo.x * clampedScale,
              y: pointer.y - mousePointTo.y * clampedScale,
            })
          }}
        >
          <Layer>
            {/* Background */}
            <Rect
              x={0}
              y={0}
              width={stageSize.width}
              height={stageSize.height}
              fill={bgColor}
            />

            {/* Single continuous text with wrapping */}
            <KonvaText
              ref={textRef}
              text={fullText}
              x={padding}
              y={padding}
              width={stageSize.width - padding * 2}
              fontSize={fontSize}
              fontFamily="Noto Naskh Arabic"
              fill={textColor}
              lineHeight={lineHeight}
              letterSpacing={letterSpacing}
              wrap="word"
              align="right"
            />
          </Layer>
        </Stage>
      </div>

      {/* Search Results Drawer */}
      <SearchDrawer
        results={searchResults}
        onVerseClick={handleVerseClick}
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
