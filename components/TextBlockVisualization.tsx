'use client'

import { useEffect, useRef, useState } from 'react'
import { Stage, Layer, Text as KonvaText } from 'react-konva'
import Konva from 'konva'
import { cleanupHarakat } from './utils'
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

export default function TextBlockVisualization() {
  const stageRef = useRef<Konva.Stage>(null)
  const [verses, setVerses] = useState<Verse[]>([])
  const [allWords, setAllWords] = useState<{ word: string; verseNumber: number; wordIndex: number; x: number; y: number }[]>([])
  const [fontSize, setFontSize] = useState(12)
  const [searchTerm, setSearchTerm] = useState('')
  const [searchResults, setSearchResults] = useState<SearchResult[]>([])
  const [selectedVerse, setSelectedVerse] = useState<Verse | null>(null)
  const [highlightedWords, setHighlightedWords] = useState<Set<string>>(new Set())
  const [stageSize, setStageSize] = useState({ width: 800, height: 600 })
  const [selectedPatterns, setSelectedPatterns] = useState<Set<string>>(new Set())

  // Load and parse Quran text
  useEffect(() => {
    fetch('/quran.txt')
      .then(response => response.text())
      .then(text => {
        const lines = text.split('\n').slice(0, 6236).filter(line => line.trim())
        const parsedVerses: Verse[] = lines.map((line, index) => ({
          number: index + 1,
          text: line,
          words: line.split(/\s+/).filter(w => w.trim())
        }))
        setVerses(parsedVerses)
      })
      .catch(error => {
        console.error('Error loading Quranic text:', error)
      })
  }, [])

  // Calculate stage size based on window
  useEffect(() => {
    const updateSize = () => {
      const width = window.innerWidth - 400 // Leave space for drawer
      const height = window.innerHeight
      setStageSize({ width, height })
    }

    updateSize()
    window.addEventListener('resize', updateSize)
    return () => window.removeEventListener('resize', updateSize)
  }, [])

  // Layout all words in a dense grid when verses or fontSize change
  useEffect(() => {
    if (verses.length === 0) return

    const words: typeof allWords = []
    const padding = 5
    const lineHeight = fontSize + 2
    let x = padding
    let y = padding
    const maxWidth = stageSize.width - padding * 2

    verses.forEach((verse) => {
      verse.words.forEach((word, wordIndex) => {
        // Estimate word width (rough approximation for Arabic)
        const wordWidth = word.length * fontSize * 0.6

        if (x + wordWidth > maxWidth) {
          x = padding
          y += lineHeight
        }

        words.push({
          word,
          verseNumber: verse.number,
          wordIndex,
          x,
          y
        })

        x += wordWidth + fontSize * 0.3 // word spacing
      })
    })

    setAllWords(words)
  }, [verses, fontSize, stageSize.width])

  // Handle search
  const handleSearch = (term: string) => {
    setSearchTerm(term)
    if (!term.trim()) {
      setSearchResults([])
      setHighlightedWords(new Set())
      return
    }

    const cleanTerm = cleanupHarakat(term)
    const results: SearchResult[] = []
    const highlights = new Set<string>()

    verses.forEach((verse) => {
      verse.words.forEach((word, wordIndex) => {
        const cleanWord = cleanupHarakat(word)
        if (cleanWord.includes(cleanTerm) || cleanTerm.includes(cleanWord)) {
          highlights.add(`${verse.number}-${wordIndex}`)

          // Get context (surrounding words)
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
    setHighlightedWords(highlights)
  }

  const handleVerseClick = (verseNumber: number) => {
    const verse = verses.find(v => v.number === verseNumber)
    if (verse) {
      setSelectedVerse(verse)
    }
  }

  return (
    <div style={{ display: 'flex', backgroundColor: '#1a1a1a', height: '100vh' }}>
      {/* Main Canvas */}
      <div style={{ flex: 1, position: 'relative', overflow: 'hidden' }}>
        {/* Controls */}
        <div style={{
          position: 'absolute',
          top: 20,
          left: 20,
          zIndex: 10,
          backgroundColor: 'rgba(255, 255, 255, 0.9)',
          padding: '15px',
          borderRadius: '8px',
          boxShadow: '0 2px 10px rgba(0,0,0,0.3)'
        }}>
          <div style={{ marginBottom: '10px' }}>
            <label style={{ display: 'block', marginBottom: '5px', fontWeight: 'bold' }}>
              Search:
            </label>
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => handleSearch(e.target.value)}
              placeholder="Search Arabic text..."
              style={{
                padding: '8px',
                width: '250px',
                border: '1px solid #ccc',
                borderRadius: '4px',
                fontFamily: 'Noto Naskh Arabic, Arial'
              }}
            />
          </div>
          <div>
            <label style={{ display: 'block', marginBottom: '5px', fontWeight: 'bold' }}>
              Font Size: {fontSize}px
            </label>
            <input
              type="range"
              min="8"
              max="24"
              value={fontSize}
              onChange={(e) => setFontSize(Number(e.target.value))}
              style={{ width: '250px' }}
            />
          </div>
          <div style={{ marginTop: '10px', fontSize: '12px', color: '#666' }}>
            Total verses: {verses.length}<br />
            {searchResults.length > 0 && `Found: ${searchResults.length} matches`}
          </div>
        </div>

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
            const clampedScale = Math.max(0.5, Math.min(3, newScale))

            stage.scale({ x: clampedScale, y: clampedScale })
            stage.position({
              x: pointer.x - mousePointTo.x * clampedScale,
              y: pointer.y - mousePointTo.y * clampedScale,
            })
          }}
        >
          <Layer>
            {allWords.map((wordData, index) => {
              const isHighlighted = highlightedWords.has(`${wordData.verseNumber}-${wordData.wordIndex}`)

              return (
                <KonvaText
                  key={`${wordData.verseNumber}-${wordData.wordIndex}`}
                  text={wordData.word}
                  x={wordData.x}
                  y={wordData.y}
                  fontSize={fontSize}
                  fontFamily="Noto Naskh Arabic"
                  fill={isHighlighted ? '#ff0000' : '#ffffff'}
                  fontStyle={isHighlighted ? 'bold' : 'normal'}
                />
              )
            })}
          </Layer>
        </Stage>
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
