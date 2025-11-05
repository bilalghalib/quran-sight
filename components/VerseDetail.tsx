'use client'

import { useEffect, useState } from 'react'
import { fetchVerseData, VerseWithData, Word } from '@/lib/quranApi'
import { getChapterAndVerse } from '@/lib/verseMapping'
import { rootPatterns, RootKey } from '@/lib/arabicRoots'

interface Verse {
  number: number
  text: string
  words: string[]
}

interface VerseDetailProps {
  verse: Verse
  onClose: () => void
  highlightWord?: string
  activeRoot?: RootKey | null
}

export default function VerseDetail({ verse, onClose, highlightWord, activeRoot }: VerseDetailProps) {
  const [verseData, setVerseData] = useState<VerseWithData | null>(null)
  const [loading, setLoading] = useState(true)
  const [hoveredWord, setHoveredWord] = useState<Word | null>(null)
  const [tooltipPosition, setTooltipPosition] = useState({ x: 0, y: 0 })
  const [chapterVerse, setChapterVerse] = useState({ chapter: 1, verse: 1 })

  useEffect(() => {
    // Set chapter/verse info immediately
    try {
      const cv = getChapterAndVerse(verse.number)
      setChapterVerse(cv)
      console.log(`Verse #${verse.number} = Surah ${cv.chapter}:${cv.verse}`)
    } catch (error) {
      console.error('Error mapping verse:', error)
    }

    // Load API data in background (non-blocking)
    async function loadVerseData() {
      try {
        const cv = getChapterAndVerse(verse.number)
        const data = await fetchVerseData(cv.chapter, cv.verse)
        if (data) {
          console.log('API data loaded:', data)
          console.log('Translations:', data.translations)
          console.log('Words:', data.words)
          setVerseData(data)
        } else {
          console.log('No data returned from API')
        }
      } catch (error) {
        console.error('Error loading verse data from API:', error)
      } finally {
        setLoading(false)
      }
    }
    loadVerseData()
  }, [verse.number])
  return (
    <div
      style={{
        position: 'fixed',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        backgroundColor: 'rgba(0, 0, 0, 0.85)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        zIndex: 1000,
        padding: '20px'
      }}
      onClick={onClose}
    >
      <div
        style={{
          backgroundColor: '#2a2a2a',
          color: '#fff',
          padding: '40px',
          borderRadius: '12px',
          maxWidth: '800px',
          width: '100%',
          maxHeight: '80vh',
          overflowY: 'auto',
          boxShadow: '0 10px 40px rgba(0,0,0,0.5)'
        }}
        onClick={(e) => e.stopPropagation()}
      >
        <div style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          marginBottom: '30px',
          borderBottom: '1px solid #444',
          paddingBottom: '15px'
        }}>
          <div style={{ flex: 1 }}>
            <h2 style={{ margin: 0, fontSize: '24px' }}>
              Surah {chapterVerse.chapter}, Ayah {chapterVerse.verse}
            </h2>
            <div style={{ fontSize: '13px', color: '#888', marginTop: '4px' }}>
              Verse #{verse.number} of 6236
            </div>
            <a
              href={`https://quran.com/${chapterVerse.chapter}?startingVerse=${chapterVerse.verse}`}
              target="_blank"
              rel="noopener noreferrer"
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: '6px',
                marginTop: '8px',
                fontSize: '13px',
                color: '#4CAF50',
                textDecoration: 'none',
                padding: '4px 8px',
                borderRadius: '4px',
                backgroundColor: 'rgba(76, 175, 80, 0.1)',
                transition: 'background-color 0.2s'
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.backgroundColor = 'rgba(76, 175, 80, 0.2)'
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.backgroundColor = 'rgba(76, 175, 80, 0.1)'
              }}
            >
              View on Quran.com ↗
            </a>
          </div>
          <button
            onClick={onClose}
            style={{
              backgroundColor: 'transparent',
              border: 'none',
              color: '#fff',
              fontSize: '24px',
              cursor: 'pointer',
              padding: '5px 10px'
            }}
          >
            ✕
          </button>
        </div>

        {/* Arabic Text - show local text immediately, enhance with API data when available */}
        <div style={{
          fontFamily: 'Noto Naskh Arabic, Arial',
          fontSize: '28px',
          lineHeight: '2.2',
          direction: 'rtl',
          textAlign: 'right',
          marginBottom: '30px',
          position: 'relative'
        }}>
          {verseData && verseData.words ? (
            // API data loaded - show word-by-word with hover
            verseData.words.map((word, idx) => {
              const isHighlighted = highlightWord &&
                (word.text_uthmani.includes(highlightWord) || highlightWord.includes(word.text_uthmani))

              return (
                <span
                  key={word.id}
                  onMouseEnter={(e) => {
                    setHoveredWord(word)
                    const rect = e.currentTarget.getBoundingClientRect()
                    setTooltipPosition({
                      x: rect.left + rect.width / 2,
                      y: rect.top - 10
                    })
                  }}
                  onMouseLeave={() => setHoveredWord(null)}
                  style={{
                    backgroundColor: isHighlighted
                      ? 'rgba(255, 215, 0, 0.8)'
                      : hoveredWord?.id === word.id
                      ? 'rgba(76, 175, 80, 0.3)'
                      : 'transparent',
                    padding: '2px 4px',
                    borderRadius: '4px',
                    fontWeight: isHighlighted ? '900' : 'normal',
                    border: isHighlighted
                      ? '2px solid rgba(255, 140, 0, 0.9)'
                      : '2px solid transparent',
                    boxShadow: isHighlighted
                      ? '0 0 10px rgba(255, 215, 0, 0.6)'
                      : 'none',
                    cursor: 'pointer',
                    transition: 'background-color 0.2s ease, box-shadow 0.2s ease',
                    position: 'relative',
                    display: 'inline-block'
                  }}
                >
                  {word.text_uthmani}{' '}
                </span>
              )
            })
          ) : (
            // Show local text immediately (no API needed)
            highlightWord ? (
              verse.words.map((word, idx) => (
                <span
                  key={idx}
                  style={{
                    backgroundColor: word.includes(highlightWord) || highlightWord.includes(word)
                      ? 'rgba(255, 215, 0, 0.8)'
                      : 'transparent',
                    padding: word.includes(highlightWord) || highlightWord.includes(word)
                      ? '4px 6px'
                      : '0',
                    borderRadius: '4px',
                    fontWeight: word.includes(highlightWord) || highlightWord.includes(word)
                      ? '900'
                      : 'normal',
                    border: word.includes(highlightWord) || highlightWord.includes(word)
                      ? '2px solid rgba(255, 140, 0, 0.9)'
                      : 'none',
                    boxShadow: word.includes(highlightWord) || highlightWord.includes(word)
                      ? '0 0 10px rgba(255, 215, 0, 0.6)'
                      : 'none'
                  }}
                >
                  {word}{' '}
                </span>
              ))
            ) : (
              verse.text
            )
          )}
        </div>

        {/* Word Translation Tooltip - positioned above the hovered word */}
        {hoveredWord && hoveredWord.translation && (
          <div style={{
            position: 'fixed',
            top: `${tooltipPosition.y}px`,
            left: `${tooltipPosition.x}px`,
            transform: 'translate(-50%, -100%)',
            backgroundColor: 'rgba(76, 175, 80, 0.95)',
            color: '#fff',
            padding: '8px 16px',
            borderRadius: '6px',
            boxShadow: '0 4px 12px rgba(0,0,0,0.3)',
            zIndex: 1001,
            maxWidth: '300px',
            textAlign: 'center',
            fontSize: '14px',
            fontWeight: 'bold',
            pointerEvents: 'none'
          }}>
            <div style={{ marginBottom: '2px', fontSize: '12px', opacity: 0.9 }}>
              {hoveredWord.transliteration?.text}
            </div>
            <div>{hoveredWord.translation.text}</div>
          </div>
        )}

        {/* Full Translation - shown immediately if available */}
        {verseData && verseData.translations && verseData.translations.length > 0 ? (
          <div style={{
            marginTop: '20px',
            marginBottom: '20px',
            padding: '20px',
            backgroundColor: 'rgba(76, 175, 80, 0.1)',
            borderLeft: '4px solid #4CAF50',
            borderRadius: '6px'
          }}>
            <div style={{
              fontSize: '14px',
              color: '#4CAF50',
              fontWeight: 'bold',
              marginBottom: '12px',
              textTransform: 'uppercase',
              letterSpacing: '0.5px'
            }}>
              Translation
            </div>
            {verseData.translations.map((translation, idx) => (
              <div key={translation.id} style={{ marginBottom: idx < verseData.translations!.length - 1 ? '16px' : '0' }}>
                <div style={{
                  fontSize: '11px',
                  color: '#888',
                  marginBottom: '6px',
                  fontWeight: '500'
                }}>
                  {translation.resource_name || `Translation ${idx + 1}`}
                </div>
                <div style={{
                  fontSize: '16px',
                  lineHeight: '1.7',
                  color: '#ddd'
                }}>
                  {translation.text}
                </div>
              </div>
            ))}
          </div>
        ) : loading ? (
          <div style={{
            marginTop: '20px',
            marginBottom: '20px',
            padding: '20px',
            backgroundColor: 'rgba(76, 175, 80, 0.05)',
            borderLeft: '4px solid #4CAF50',
            borderRadius: '6px',
            textAlign: 'center',
            color: '#4CAF50',
            fontStyle: 'italic'
          }}>
            Loading translation...
          </div>
        ) : (
          <div style={{
            marginTop: '20px',
            marginBottom: '20px',
            padding: '20px',
            backgroundColor: 'rgba(255, 165, 0, 0.05)',
            borderLeft: '4px solid #ff8c00',
            borderRadius: '6px',
            textAlign: 'center',
            color: '#ff8c00',
            fontStyle: 'italic'
          }}>
            Translation not available
          </div>
        )}

        {/* Root Etymology & Information */}
        {activeRoot && rootPatterns[activeRoot] && (
          <div style={{
            marginTop: '20px',
            marginBottom: '20px',
            padding: '20px',
            backgroundColor: 'rgba(100, 180, 255, 0.08)',
            borderLeft: '4px solid #64b4ff',
            borderRadius: '6px'
          }}>
            <div style={{
              display: 'flex',
              alignItems: 'center',
              marginBottom: '15px',
              gap: '12px'
            }}>
              <div style={{
                fontSize: '32px',
                fontFamily: 'Noto Naskh Arabic, Arial',
                fontWeight: 'bold',
                color: '#64b4ff'
              }}>
                {rootPatterns[activeRoot].root}
              </div>
              <div style={{ flex: 1 }}>
                <div style={{ fontSize: '16px', fontWeight: 'bold', color: '#ddd' }}>
                  {rootPatterns[activeRoot].concept}
                </div>
                <div style={{ fontSize: '13px', color: '#aaa', marginTop: '2px' }}>
                  Root: {rootPatterns[activeRoot].rootArabic || rootPatterns[activeRoot].root}
                </div>
              </div>
            </div>

            {rootPatterns[activeRoot].meaning && (
              <div style={{ marginBottom: '12px' }}>
                <div style={{ fontSize: '12px', color: '#64b4ff', fontWeight: '600', marginBottom: '4px' }}>
                  Meaning
                </div>
                <div style={{ fontSize: '14px', color: '#ccc', lineHeight: '1.6' }}>
                  {rootPatterns[activeRoot].meaning}
                </div>
              </div>
            )}

            {rootPatterns[activeRoot].etymology && (
              <div style={{ marginBottom: '12px' }}>
                <div style={{ fontSize: '12px', color: '#64b4ff', fontWeight: '600', marginBottom: '4px' }}>
                  Etymology
                </div>
                <div style={{ fontSize: '13px', color: '#bbb', lineHeight: '1.6', fontStyle: 'italic' }}>
                  {rootPatterns[activeRoot].etymology}
                </div>
              </div>
            )}

            {rootPatterns[activeRoot].letterMeanings && (
              <div style={{ marginBottom: '12px' }}>
                <div style={{ fontSize: '12px', color: '#64b4ff', fontWeight: '600', marginBottom: '4px' }}>
                  Letter Significance
                </div>
                <div style={{ fontSize: '13px', color: '#bbb', lineHeight: '1.6' }}>
                  {rootPatterns[activeRoot].letterMeanings}
                </div>
              </div>
            )}

            {rootPatterns[activeRoot].relatedWords && rootPatterns[activeRoot].relatedWords!.length > 0 && (
              <div>
                <div style={{ fontSize: '12px', color: '#64b4ff', fontWeight: '600', marginBottom: '6px' }}>
                  Related Words
                </div>
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px' }}>
                  {rootPatterns[activeRoot].relatedWords!.map((word, idx) => (
                    <div
                      key={idx}
                      style={{
                        padding: '6px 12px',
                        backgroundColor: 'rgba(100, 180, 255, 0.15)',
                        borderRadius: '4px',
                        fontSize: '13px',
                        color: '#ddd',
                        fontFamily: word.match(/[\u0600-\u06FF]/) ? 'Noto Naskh Arabic, Arial' : 'inherit'
                      }}
                    >
                      {word}
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        )}


        {/* Stats */}
        <div style={{
          borderTop: '1px solid #444',
          paddingTop: '20px',
          color: '#888',
          fontSize: '14px'
        }}>
          <p style={{ marginBottom: '10px' }}>
            <strong>Total words:</strong> {verseData?.words?.length || verse.words.length}
          </p>
          {loading && (
            <p style={{ margin: 0, fontStyle: 'italic', color: '#4CAF50' }}>
              Loading translations...
            </p>
          )}
        </div>

        <div style={{
          marginTop: '20px',
          paddingTop: '20px',
          borderTop: '1px solid #444'
        }}>
          <button
            onClick={onClose}
            style={{
              backgroundColor: '#4CAF50',
              color: 'white',
              border: 'none',
              padding: '12px 30px',
              borderRadius: '6px',
              cursor: 'pointer',
              fontSize: '16px',
              width: '100%'
            }}
          >
            Close
          </button>
        </div>
      </div>
    </div>
  )
}
