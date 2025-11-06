'use client'

import { useEffect, useState, useRef } from 'react'
import Mark from 'mark.js'
import { rootPatterns, RootKey, presetSearches, matchesRoot, matchesRootWithForm } from '@/lib/arabicRoots'
import Stemmer, { type StemResult } from '@/lib/Stemmer'
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
  matchedForm?: {
    form: string
    pattern: string
    meaning: string | null
    isTheoretical: boolean
    notes?: string
  }
  stemInfo?: {
    stem: string[]
    normalized: string
    searchedWord: string
  }
}

export default function ImprovedTextBlock() {
  const textContainerRef = useRef<HTMLDivElement>(null)
  const scrollContainerRef = useRef<HTMLDivElement>(null)
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
  const [zoom, setZoom] = useState(1)
  const [heatmapData, setHeatmapData] = useState<number[]>([])
  const [clickedWord, setClickedWord] = useState<string | undefined>(undefined)
  const [showSettings, setShowSettings] = useState(false)
  const [hoveredHeatmapBin, setHoveredHeatmapBin] = useState<number | null>(null)
  const [selectedPatterns, setSelectedPatterns] = useState<Set<string>>(new Set())
  const [isSearchDrawerOpen, setIsSearchDrawerOpen] = useState(false)
  const [isMobile, setIsMobile] = useState(false)
  const [isControlsOpen, setIsControlsOpen] = useState(false)
  const [loadingMessage, setLoadingMessage] = useState('Loading Quran data...')
  const [isDesktopControlsCollapsed, setIsDesktopControlsCollapsed] = useState(false)
  const [isDesktopSearchCollapsed, setIsDesktopSearchCollapsed] = useState(false)

  // Detect mobile viewport
  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 768)
    }
    checkMobile()
    window.addEventListener('resize', checkMobile)
    return () => window.removeEventListener('resize', checkMobile)
  }, [])

  // Initialize Mark.js instance
  useEffect(() => {
    if (textContainerRef.current && !isLoading) {
      markInstanceRef.current = new Mark(textContainerRef.current)
    }
  }, [isLoading])

  // Add click handlers to highlighted marks
  useEffect(() => {
    if (!textContainerRef.current) return

    const handleMarkClick = (e: MouseEvent) => {
      const target = e.target as HTMLElement
      if (target.tagName === 'MARK') {
        // Find which verse this mark belongs to
        const markText = target.textContent || ''
        setClickedWord(markText)
        const verse = verses.find(v => v.text.includes(markText))
        if (verse) {
          setSelectedVerse(verse)
        }
      }
    }

    textContainerRef.current.addEventListener('click', handleMarkClick)
    return () => {
      textContainerRef.current?.removeEventListener('click', handleMarkClick)
    }
  }, [verses, searchResults])

  // Load Quran text with caching
  useEffect(() => {
    setIsLoading(true)
    setLoadingMessage('Loading Quran data...')

    const cached = localStorage.getItem('quran-verses')
    if (cached) {
      try {
        setLoadingMessage('Loading from cache...')
        const parsedVerses = JSON.parse(cached)
        setVerses(parsedVerses)
        const combined = parsedVerses.map((v: Verse) => v.text).join(' ')
        setFullText(combined)
        setLoadingMessage('Preparing text display...')
        setTimeout(() => setIsLoading(false), 300)
        return
      } catch (e) {
        console.error('Cache error:', e)
        setLoadingMessage('Cache error, fetching fresh data...')
      }
    }

    setLoadingMessage('Fetching Quran text (6,236 verses)...')
    fetch('/quran.txt')
      .then(response => {
        setLoadingMessage('Processing verses...')
        return response.text()
      })
      .then(text => {
        const lines = text.split('\n').slice(0, 6236).filter(line => line.trim())
        setLoadingMessage(`Parsing ${lines.length} verses...`)
        const parsedVerses: Verse[] = lines.map((line, index) => ({
          number: index + 1,
          text: line,
          words: line.split(/\s+/).filter(w => w.trim())
        }))

        setLoadingMessage('Caching for faster future loads...')
        localStorage.setItem('quran-verses', JSON.stringify(parsedVerses))
        setVerses(parsedVerses)
        const combined = parsedVerses.map(v => v.text).join(' ')
        setFullText(combined)
        setLoadingMessage('Ready!')
        setTimeout(() => setIsLoading(false), 300)
      })
      .catch(error => {
        console.error('Error loading Quranic text:', error)
        setLoadingMessage('Error loading data. Please refresh.')
        setTimeout(() => setIsLoading(false), 2000)
      })
  }, [])

  // Auto-trigger qalb search on load
  useEffect(() => {
    if (!isLoading && verses.length > 0 && !activeRoot) {
      // Wait for Mark.js to initialize
      setLoadingMessage('Highlighting قلب (Heart) occurrences...')
      setTimeout(() => {
        handleRootSearch('qalb')
      }, 500)
    }
  }, [isLoading, verses.length])

  // Generate heatmap from search results
  const generateHeatmap = (results: SearchResult[]) => {
    const bins = new Array(100).fill(0)
    results.forEach(result => {
      const binIndex = Math.floor(((result.verseNumber - 1) / 6236) * 100)
      if (binIndex >= 0 && binIndex < 100) {
        bins[binIndex]++
      }
    })
    console.log('Heatmap generated:', {
      totalMatches: results.length,
      bins: bins.filter(b => b > 0).length + ' non-empty bins',
      max: Math.max(...bins, 1),
      sample: bins.slice(0, 10)
    })
    setHeatmapData(bins)
  }

  // Handle search with Mark.js highlighting and stemming
  const handleSearch = (term: string) => {
    setSearchTerm(term)
    setActiveRoot(null)

    if (!markInstanceRef.current) return

    markInstanceRef.current.unmark()

    if (!term.trim()) {
      setSearchResults([])
      setHeatmapData([])
      return
    }

    // Use stemmer to find root
    const stemmer = new Stemmer()
    const stemResult = stemmer.stem(term)
    const searchStems = typeof stemResult === 'string' ? [stemResult] : stemResult.stem
    const normalized = typeof stemResult === 'string' ? stemResult : stemResult.normalized

    console.log('Search term:', term)
    console.log('Stems found:', searchStems)
    console.log('Normalized:', normalized)

    // Collect all words that match the stems
    const wordsToHighlight = new Set<string>()
    const results: SearchResult[] = []

    verses.forEach((verse) => {
      verse.words.forEach((word, wordIndex) => {
        // Check if this word shares a stem with the search term
        const wordStemResult = stemmer.stem(word)
        const wordStems = typeof wordStemResult === 'string' ? [wordStemResult] : wordStemResult.stem

        // Check if any word stems match any search stems
        const hasCommonStem = wordStems.some(ws => searchStems.includes(ws))

        if (hasCommonStem || word.includes(term)) {
          wordsToHighlight.add(word)
          const start = Math.max(0, wordIndex - 3)
          const end = Math.min(verse.words.length, wordIndex + 4)
          const context = verse.words.slice(start, end).join(' ')

          results.push({
            verseNumber: verse.number,
            verse: verse.text,
            wordIndex,
            context,
            stemInfo: {
              stem: searchStems,
              normalized: normalized,
              searchedWord: word
            }
          })
        }
      })
    })

    console.log(`Found ${results.length} results with ${wordsToHighlight.size} unique words`)

    // Highlight all matching words - need to mark each word individually for Arabic
    const wordsArray = Array.from(wordsToHighlight)
    if (wordsArray.length > 0) {
      wordsArray.forEach(word => {
        markInstanceRef.current!.mark(word, {
          separateWordSearch: false,
          acrossElements: true,
          caseSensitive: false,
          className: 'highlight-match'
        })
      })
    }

    setSearchResults(results)
    generateHeatmap(results)
  }

  // Handle root-based search with morphological form tracking
  const handleRootSearch = (rootKey: RootKey) => {
    setActiveRoot(rootKey)
    setSearchTerm('')

    if (!markInstanceRef.current) return

    markInstanceRef.current.unmark()

    const results: SearchResult[] = []
    const matchedWords = new Set<string>()

    verses.forEach((verse) => {
      verse.words.forEach((word, wordIndex) => {
        const matchedForm = matchesRootWithForm(word, rootKey)
        if (matchedForm) {
          matchedWords.add(word)

          const start = Math.max(0, wordIndex - 3)
          const end = Math.min(verse.words.length, wordIndex + 4)
          const context = verse.words.slice(start, end).join(' ')

          results.push({
            verseNumber: verse.number,
            verse: verse.text,
            wordIndex,
            context,
            matchedForm: {
              form: matchedForm.form,
              pattern: matchedForm.pattern,
              meaning: matchedForm.meaning,
              isTheoretical: matchedForm.isTheoretical,
              notes: matchedForm.notes
            }
          })
        }
      })
    })

    console.log(`Root search for ${rootKey}: Found ${results.length} matches`)
    console.log('Sample forms:', results.slice(0, 5).map(r => ({
      word: r.context.split(' ').find(w => matchedWords.has(w)),
      form: r.matchedForm?.form,
      pattern: r.matchedForm?.pattern
    })))

    // Always store all results
    setSearchResults(results)
    generateHeatmap(results)

    // Highlight words (will be filtered by selectedPatterns effect)
    const wordsArray = Array.from(matchedWords)
    if (wordsArray.length > 0) {
      markInstanceRef.current.mark(wordsArray, {
        separateWordSearch: false,
        acrossElements: true,
        className: 'highlight-root'
      })
    }
  }

  // Re-highlight when selected patterns change
  useEffect(() => {
    if (!activeRoot || !markInstanceRef.current || searchResults.length === 0) return

    markInstanceRef.current.unmark()

    // Filter words based on selected patterns
    const filteredWords = new Set<string>()
    searchResults.forEach(result => {
      if (result.matchedForm) {
        // If no patterns selected, show all
        // If patterns selected, only show matching patterns
        if (selectedPatterns.size === 0 || selectedPatterns.has(result.matchedForm.pattern)) {
          result.context.split(' ').forEach(word => {
            if (matchesRootWithForm(word, activeRoot)) {
              filteredWords.add(word)
            }
          })
        }
      }
    })

    const wordsArray = Array.from(filteredWords)
    if (wordsArray.length > 0) {
      markInstanceRef.current.mark(wordsArray, {
        separateWordSearch: false,
        acrossElements: true,
        className: 'highlight-root'
      })
    }

    // Update heatmap with filtered results
    const filteredResults = selectedPatterns.size === 0
      ? searchResults
      : searchResults.filter(r => r.matchedForm && selectedPatterns.has(r.matchedForm.pattern))
    generateHeatmap(filteredResults)
  }, [selectedPatterns, searchResults, activeRoot])

  const clearSearch = () => {
    setSearchTerm('')
    setActiveRoot(null)
    setSearchResults([])
    setHeatmapData([])
    setSelectedPatterns(new Set())
    if (markInstanceRef.current) {
      markInstanceRef.current.unmark()
    }
  }

  const handleVerseClick = (verseNumber: number) => {
    const verse = verses.find(v => v.number === verseNumber)
    if (verse) {
      setSelectedVerse(verse)

      // Scroll to verse in text
      if (textContainerRef.current) {
        const verseText = verse.text.substring(0, 20)
        const allMarks = textContainerRef.current.querySelectorAll('mark')

        // Find first mark in this verse
        for (let mark of Array.from(allMarks)) {
          const context = mark.textContent || ''
          if (verse.text.includes(context)) {
            setClickedWord(context) // Set the clicked word for highlighting
            mark.scrollIntoView({ behavior: 'smooth', block: 'center' })
            // Temporary highlight
            mark.style.backgroundColor = 'rgba(255, 0, 0, 0.8)'
            setTimeout(() => {
              mark.style.backgroundColor = ''
            }, 2000)
            break
          }
        }
      }
    }
  }

  const invertColors = () => {
    setBgColor(prev => prev === '#ffffff' ? '#000000' : '#ffffff')
    setTextColor(prev => prev === '#000000' ? '#ffffff' : '#000000')
  }

  const maxHeatmapValue = Math.max(...heatmapData, 1)

  return (
    <div style={{ display: 'flex', backgroundColor: '#1a1a1a', height: '100vh' }}>
      <style>{`
        .highlight-match {
          background-color: rgba(255, 215, 0, 0.8) !important;
          color: #000000 !important;
          font-weight: 900 !important;
          padding: 3px 4px !important;
          border-radius: 3px !important;
          border: 2px solid rgba(255, 140, 0, 0.9) !important;
          box-shadow: 0 0 5px rgba(255, 215, 0, 0.6) !important;
          cursor: pointer !important;
          transition: all 0.2s ease !important;
        }
        .highlight-match:hover {
          background-color: rgba(255, 140, 0, 1) !important;
          transform: scale(1.15) !important;
          box-shadow: 0 0 10px rgba(255, 140, 0, 0.9) !important;
          z-index: 100 !important;
        }
        .highlight-root {
          background-color: rgba(76, 255, 100, 0.75) !important;
          color: #000000 !important;
          font-weight: 900 !important;
          padding: 3px 4px !important;
          border-radius: 3px !important;
          border: 2px solid rgba(34, 139, 34, 0.9) !important;
          box-shadow: 0 0 5px rgba(76, 255, 100, 0.6) !important;
          cursor: pointer !important;
          transition: all 0.2s ease !important;
        }
        .highlight-root:hover {
          background-color: rgba(50, 205, 50, 1) !important;
          transform: scale(1.15) !important;
          box-shadow: 0 0 10px rgba(76, 255, 100, 0.9) !important;
          z-index: 100 !important;
        }
        @keyframes pulse {
          0%, 100% { opacity: 1; transform: scale(1); }
          50% { opacity: 0.7; transform: scale(1.1); }
        }
      `}</style>

      {/* Mobile Toggle Button for Controls (left side) */}
      {isMobile && (
        <div style={{ position: 'relative' }}>
          <button
            onClick={() => setIsControlsOpen(!isControlsOpen)}
            title="Open Controls & Search"
            aria-label="Toggle Controls Panel"
            style={{
              position: 'fixed',
              bottom: '20px',
              left: '20px',
              width: '60px',
              height: '60px',
              borderRadius: '50%',
              backgroundColor: '#FF5722',
              color: '#fff',
              border: 'none',
              boxShadow: '0 4px 12px rgba(0,0,0,0.3)',
              cursor: 'pointer',
              zIndex: 1001,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontSize: '24px',
              fontWeight: 'bold'
            }}
          >
            {isControlsOpen ? '✕' : '⚙'}
          </button>
          {!isControlsOpen && (
            <div style={{
              position: 'fixed',
              bottom: '25px',
              left: '90px',
              backgroundColor: 'rgba(0, 0, 0, 0.85)',
              color: '#fff',
              padding: '6px 12px',
              borderRadius: '6px',
              fontSize: '12px',
              whiteSpace: 'nowrap',
              zIndex: 1000,
              pointerEvents: 'none',
              boxShadow: '0 2px 8px rgba(0,0,0,0.3)'
            }}>
              Controls & Search
            </div>
          )}
        </div>
      )}

      {/* Main Text Area */}
      <div ref={scrollContainerRef} style={{ flex: 1, position: 'relative', overflow: 'auto' }}>
        {/* Controls backdrop for mobile */}
        {isMobile && isControlsOpen && (
          <div
            onClick={() => setIsControlsOpen(false)}
            style={{
              position: 'fixed',
              top: 0,
              left: 0,
              right: 0,
              bottom: 0,
              backgroundColor: 'rgba(0, 0, 0, 0.5)',
              zIndex: 9
            }}
          />
        )}

        {/* Desktop Collapsed Controls Button */}
        {!isMobile && isDesktopControlsCollapsed && (
          <button
            onClick={() => setIsDesktopControlsCollapsed(false)}
            title="Show Controls"
            style={{
              position: 'fixed',
              top: '20px',
              left: '20px',
              zIndex: 10,
              backgroundColor: 'rgba(50, 50, 50, 0.95)',
              padding: '12px 16px',
              borderRadius: '8px',
              border: '1px solid #666',
              color: '#ddd',
              cursor: 'pointer',
              fontSize: '14px',
              fontWeight: 'bold',
              boxShadow: '0 2px 10px rgba(0,0,0,0.5)',
              transition: 'all 0.2s ease',
              display: 'flex',
              alignItems: 'center',
              gap: '8px'
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.backgroundColor = 'rgba(70, 70, 70, 0.95)'
              e.currentTarget.style.color = '#fff'
              e.currentTarget.style.borderColor = '#888'
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.backgroundColor = 'rgba(50, 50, 50, 0.95)'
              e.currentTarget.style.color = '#ddd'
              e.currentTarget.style.borderColor = '#666'
            }}
          >
            <span style={{ fontSize: '18px' }}>▸</span>
            Show
          </button>
        )}

        {/* Controls */}
        {(!isMobile || isControlsOpen) && !isDesktopControlsCollapsed && (
          <div style={{
            position: 'fixed',
            top: isMobile ? 0 : 20,
            left: isMobile ? 0 : 20,
            zIndex: 10,
            backgroundColor: 'rgba(50, 50, 50, 0.95)',
            padding: isMobile ? '12px' : '20px',
            borderRadius: isMobile ? '0 8px 8px 0' : '8px',
            boxShadow: '0 2px 10px rgba(0,0,0,0.5)',
            color: '#fff',
            minWidth: isMobile ? '280px' : '280px',
            maxWidth: isMobile ? '85vw' : undefined,
            maxHeight: isMobile ? '100vh' : 'calc(100vh - 80px)',
            overflowY: 'auto',
            ...(isMobile ? {
              transform: isControlsOpen ? 'translateX(0)' : 'translateX(-100%)',
              transition: 'transform 0.3s ease',
              bottom: 0
            } : {})
          }}>
          <div style={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            marginBottom: '15px',
            borderBottom: '1px solid #555',
            paddingBottom: '10px'
          }}>
            <h3 style={{ margin: 0, fontSize: '16px' }}>
              Quran Sight
            </h3>
            {!isMobile && (
              <button
                onClick={() => setIsDesktopControlsCollapsed(true)}
                title="Hide Controls"
                style={{
                  backgroundColor: '#444',
                  border: '1px solid #666',
                  color: '#ddd',
                  cursor: 'pointer',
                  fontSize: '13px',
                  padding: '8px 12px',
                  borderRadius: '6px',
                  transition: 'all 0.2s ease',
                  fontWeight: 'bold',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '6px'
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.backgroundColor = '#555'
                  e.currentTarget.style.color = '#fff'
                  e.currentTarget.style.borderColor = '#888'
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.backgroundColor = '#444'
                  e.currentTarget.style.color = '#ddd'
                  e.currentTarget.style.borderColor = '#666'
                }}
              >
                ◂
                <span>Hide</span>
              </button>
            )}
          </div>

          {/* Heatmap/Minimap */}
          {heatmapData.length > 0 && (
            <div style={{ marginBottom: '15px', position: 'relative' }}>
              <label style={{ display: 'block', marginBottom: '8px', fontSize: '13px', fontWeight: 'bold' }}>
                Distribution Heatmap:
              </label>
              <div style={{
                display: 'flex',
                height: isMobile ? '60px' : '50px',
                gap: '1px',
                backgroundColor: '#1a1a1a',
                padding: '8px',
                borderRadius: '6px',
                border: '1px solid #333',
                position: 'relative'
              }}>
                {heatmapData.map((count, index) => {
                  const startVerse = Math.floor(index * 62.36) + 1
                  const endVerse = Math.floor((index + 1) * 62.36)
                  // Enhanced color scale: minimum 0.2 opacity for visibility, max 1.0
                  const opacity = count > 0
                    ? Math.max(0.3, Math.min((count / maxHeatmapValue) * 0.9 + 0.1, 1))
                    : 0
                  const isHovered = hoveredHeatmapBin === index

                  return (
                    <div
                      key={index}
                      onMouseEnter={() => setHoveredHeatmapBin(index)}
                      onMouseLeave={() => setHoveredHeatmapBin(null)}
                      style={{
                        flex: 1,
                        backgroundColor: count > 0
                          ? `rgba(76, 255, 120, ${opacity})`
                          : 'rgba(60, 60, 60, 0.15)',
                        borderRadius: '2px',
                        transition: 'all 0.2s ease',
                        boxShadow: isHovered && count > 0
                          ? `0 0 8px rgba(76, 255, 120, 0.8)`
                          : count > 0
                          ? `0 0 ${Math.min(count / maxHeatmapValue * 5, 5)}px rgba(76, 255, 120, 0.4)`
                          : 'none',
                        transform: isHovered && count > 0 ? 'scaleY(1.2)' : 'scaleY(1)',
                        cursor: count > 0 ? 'pointer' : 'default',
                        position: 'relative'
                      }}
                    >
                      {isHovered && count > 0 && (
                        <div style={{
                          position: 'absolute',
                          bottom: '60px',
                          left: '50%',
                          transform: 'translateX(-50%)',
                          backgroundColor: 'rgba(0, 0, 0, 0.9)',
                          color: '#fff',
                          padding: '8px 12px',
                          borderRadius: '6px',
                          fontSize: '12px',
                          lineHeight: '1.4',
                          whiteSpace: 'nowrap',
                          zIndex: 1000,
                          boxShadow: '0 4px 12px rgba(0,0,0,0.4)',
                          pointerEvents: 'none',
                          fontFamily: 'system-ui, -apple-system, sans-serif'
                        }}>
                          <div style={{ fontWeight: 'bold', marginBottom: '4px', color: '#4CAF50', lineHeight: '1.2' }}>
                            {count} {count === 1 ? 'match' : 'matches'}
                          </div>
                          <div style={{ fontSize: '11px', color: '#ccc', lineHeight: '1.3' }}>
                            Verses {startVerse} - {endVerse}
                          </div>
                          <div style={{ fontSize: '10px', color: '#888', marginTop: '2px', lineHeight: '1.2' }}>
                            Intensity: {Math.round(opacity * 100)}%
                          </div>
                        </div>
                      )}
                    </div>
                  )
                })}
              </div>
              <div style={{
                fontSize: '11px',
                color: '#ccc',
                marginTop: '8px',
                textAlign: 'center',
                fontWeight: '500',
                letterSpacing: '0.5px'
              }}>
                ← Beginning | Quran | End →
              </div>
            </div>
          )}

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
                    padding: isMobile ? '10px 8px' : '6px 8px',
                    fontSize: isMobile ? '12px' : '11px',
                    backgroundColor: activeRoot === preset.key ? '#4CAF50' : '#444',
                    color: '#fff',
                    border: activeRoot === preset.key ? '2px solid #81C784' : '2px solid transparent',
                    borderRadius: '6px',
                    cursor: 'pointer',
                    flex: '1 1 calc(50% - 3px)',
                    minWidth: '0',
                    lineHeight: '1.3',
                    boxShadow: activeRoot === preset.key ? '0 0 8px rgba(76, 175, 80, 0.6)' : 'none',
                    transition: 'all 0.2s ease'
                  }}
                  title={preset.label}
                >
                  <div>{preset.icon} {rootPatterns[preset.key].concept}</div>
                  <div style={{ fontSize: '13px', fontFamily: 'Noto Naskh Arabic, Arial', marginTop: '2px' }}>
                    {rootPatterns[preset.key].root}
                  </div>
                </button>
              ))}
            </div>
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '5px' }}>
              {presetSearches.slice(4).map(preset => (
                <button
                  key={preset.key}
                  onClick={() => handleRootSearch(preset.key)}
                  style={{
                    padding: isMobile ? '10px 8px' : '6px 8px',
                    fontSize: isMobile ? '12px' : '11px',
                    backgroundColor: activeRoot === preset.key ? '#4CAF50' : '#444',
                    color: '#fff',
                    border: activeRoot === preset.key ? '2px solid #81C784' : '2px solid transparent',
                    borderRadius: '6px',
                    cursor: 'pointer',
                    flex: '1 1 calc(50% - 3px)',
                    minWidth: '0',
                    lineHeight: '1.3',
                    boxShadow: activeRoot === preset.key ? '0 0 8px rgba(76, 175, 80, 0.6)' : 'none',
                    transition: 'all 0.2s ease'
                  }}
                  title={preset.label}
                >
                  <div>{preset.icon} {rootPatterns[preset.key].concept}</div>
                  <div style={{ fontSize: '13px', fontFamily: 'Noto Naskh Arabic, Arial', marginTop: '2px' }}>
                    {rootPatterns[preset.key].root}
                  </div>
                </button>
              ))}
            </div>
          </div>

          <div style={{ borderTop: '1px solid #555', paddingTop: '15px' }}>
            <label style={{ display: 'block', marginBottom: '8px', fontSize: '13px', fontWeight: 'bold' }}>
              Custom Search:
            </label>
            <div style={{ display: 'flex', gap: '8px' }}>
              <input
                type="text"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                onKeyPress={(e) => {
                  if (e.key === 'Enter' && searchTerm.trim()) {
                    handleSearch(searchTerm)
                  }
                }}
                placeholder="Search Arabic text..."
                style={{
                  padding: isMobile ? '12px' : '8px',
                  flex: 1,
                  border: '1px solid #555',
                  borderRadius: '4px',
                  fontFamily: 'Noto Naskh Arabic, Arial',
                  fontSize: isMobile ? '16px' : '14px',
                  backgroundColor: '#2a2a2a',
                  color: '#fff'
                }}
              />
              <button
                onClick={() => searchTerm.trim() && handleSearch(searchTerm)}
                disabled={!searchTerm.trim()}
                style={{
                  padding: isMobile ? '12px 16px' : '8px 16px',
                  backgroundColor: searchTerm.trim() ? '#4CAF50' : '#555',
                  color: searchTerm.trim() ? '#fff' : '#888',
                  border: 'none',
                  borderRadius: '4px',
                  cursor: searchTerm.trim() ? 'pointer' : 'not-allowed',
                  fontSize: isMobile ? '16px' : '14px',
                  fontWeight: 'bold',
                  transition: 'all 0.2s ease'
                }}
              >
                🔍
              </button>
            </div>
            {(searchResults.length > 0 || activeRoot) && (
              <button
                onClick={clearSearch}
                style={{
                  width: '100%',
                  padding: isMobile ? '12px' : '10px',
                  marginTop: '10px',
                  backgroundColor: '#d32f2f',
                  color: 'white',
                  border: '2px solid #ff5252',
                  borderRadius: '6px',
                  cursor: 'pointer',
                  fontSize: isMobile ? '14px' : '13px',
                  fontWeight: 'bold',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: '8px',
                  transition: 'all 0.2s ease',
                  boxShadow: '0 2px 4px rgba(0,0,0,0.2)'
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.backgroundColor = '#b71c1c'
                  e.currentTarget.style.transform = 'scale(1.02)'
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.backgroundColor = '#d32f2f'
                  e.currentTarget.style.transform = 'scale(1)'
                }}
              >
                <span style={{ fontSize: '16px' }}>✕</span>
                Clear Search
              </button>
            )}
          </div>

          {/* Settings Toggle Button */}
          <div style={{ borderTop: '1px solid #555', paddingTop: '15px', marginTop: '15px' }}>
            <button
              onClick={() => setShowSettings(!showSettings)}
              style={{
                width: '100%',
                padding: '10px',
                backgroundColor: '#555',
                color: 'white',
                border: 'none',
                borderRadius: '4px',
                cursor: 'pointer',
                fontSize: '14px',
                marginBottom: '15px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between'
              }}
            >
              <span>⚙️ Settings</span>
              <span>{showSettings ? '▼' : '▶'}</span>
            </button>

            {/* Collapsible Settings Section */}
            {showSettings && (
              <div style={{ marginBottom: '15px', paddingBottom: '15px' }}>
                <div style={{ marginBottom: '15px' }}>
                  <label style={{ display: 'block', marginBottom: '5px', fontSize: '13px', fontWeight: 'bold' }}>
                    Zoom: {zoom.toFixed(1)}x
                  </label>
                  <input
                    type="range"
                    min="0.5"
                    max="3"
                    step="0.1"
                    value={zoom}
                    onChange={(e) => setZoom(Number(e.target.value))}
                    style={{ width: '100%' }}
                  />
                </div>

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
                    fontSize: '14px'
                  }}
                >
                  Invert Colors
                </button>
              </div>
            )}
          </div>

          <div style={{ marginTop: '15px', fontSize: '11px', borderTop: '1px solid #555', paddingTop: '10px' }}>
            <div style={{ color: '#999', marginBottom: '4px' }}>
              <strong>Verses:</strong> {verses.length}
            </div>
            <div style={{ color: '#999', marginBottom: searchResults.length > 0 ? '8px' : '0' }}>
              <strong>Characters:</strong> {fullText.length.toLocaleString()}
            </div>
            {searchResults.length > 0 && (
              <>
                <div style={{
                  color: '#4CAF50',
                  fontSize: '13px',
                  fontWeight: 'bold',
                  marginBottom: '4px',
                  padding: '4px 6px',
                  backgroundColor: 'rgba(76, 175, 80, 0.15)',
                  borderRadius: '4px',
                  borderLeft: '3px solid #4CAF50'
                }}>
                  Found: {searchResults.length} matches
                </div>
                {activeRoot && (
                  <div style={{ color: '#64b4ff', marginTop: '4px' }}>
                    <strong>Root: {rootPatterns[activeRoot].concept}</strong>
                  </div>
                )}
              </>
            )}
          </div>
        </div>
        )}

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
            zIndex: 100,
            boxShadow: '0 4px 20px rgba(0,0,0,0.5)',
            minWidth: '300px'
          }}>
            <div style={{ marginBottom: '15px', fontSize: '32px', animation: 'pulse 1.5s ease-in-out infinite' }}>📖</div>
            <div style={{ fontWeight: 'bold', marginBottom: '8px' }}>Quran Sight</div>
            <div style={{ fontSize: '15px', color: '#4CAF50' }}>{loadingMessage}</div>
          </div>
        )}

        {/* Text Content with Mark.js highlighting and zoom */}
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
              transform: `scale(${zoom})`,
              transformOrigin: 'top center',
              transition: 'transform 0.2s ease'
            }}
          >
            {fullText}
          </div>
        )}
      </div>

      {/* Mobile Toggle Button for Search Drawer */}
      {isMobile && (
        <div style={{ position: 'relative' }}>
          <button
            onClick={() => setIsSearchDrawerOpen(!isSearchDrawerOpen)}
            title="Open Search Results"
            aria-label="Toggle Search Results Drawer"
            style={{
              position: 'fixed',
              bottom: '20px',
              right: '20px',
              width: '60px',
              height: '60px',
              borderRadius: '50%',
              backgroundColor: '#4CAF50',
              color: '#fff',
              border: 'none',
              boxShadow: '0 4px 12px rgba(0,0,0,0.3)',
              cursor: 'pointer',
              zIndex: 1001,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontSize: '24px',
              fontWeight: 'bold'
            }}
          >
            {isSearchDrawerOpen ? '✕' : '☰'}
          </button>
          {!isSearchDrawerOpen && searchResults.length > 0 && (
            <div style={{
              position: 'fixed',
              bottom: '25px',
              right: '90px',
              backgroundColor: 'rgba(0, 0, 0, 0.85)',
              color: '#fff',
              padding: '6px 12px',
              borderRadius: '6px',
              fontSize: '12px',
              whiteSpace: 'nowrap',
              zIndex: 1000,
              pointerEvents: 'none',
              boxShadow: '0 2px 8px rgba(0,0,0,0.3)'
            }}>
              {searchResults.length} Results
            </div>
          )}
        </div>
      )}

      {/* Search Results Drawer */}
      <SearchDrawer
        results={searchResults}
        onVerseClick={handleVerseClick}
        selectedPatterns={selectedPatterns}
        onPatternsChange={setSelectedPatterns}
        isMobile={isMobile}
        isOpen={isSearchDrawerOpen}
        onClose={() => setIsSearchDrawerOpen(false)}
        isDesktopCollapsed={isDesktopSearchCollapsed}
        onDesktopToggle={() => setIsDesktopSearchCollapsed(!isDesktopSearchCollapsed)}
      />

      {/* Verse Detail Modal */}
      {selectedVerse && (
        <VerseDetail
          verse={selectedVerse}
          onClose={() => setSelectedVerse(null)}
          highlightWord={clickedWord}
          activeRoot={activeRoot}
        />
      )}
    </div>
  )
}
