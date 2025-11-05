'use client'

import { useState } from 'react'

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
}

interface SearchDrawerProps {
  results: SearchResult[]
  onVerseClick: (verseNumber: number) => void
}

export default function SearchDrawer({ results, onVerseClick }: SearchDrawerProps) {
  const [showBreakdown, setShowBreakdown] = useState(true)

  // Group results by morphological pattern
  const morphologyBreakdown = results.reduce((acc, result) => {
    if (result.matchedForm) {
      const pattern = result.matchedForm.pattern
      if (!acc[pattern]) {
        acc[pattern] = {
          count: 0,
          isTheoretical: result.matchedForm.isTheoretical,
          forms: new Set<string>()
        }
      }
      acc[pattern].count++
      acc[pattern].forms.add(result.matchedForm.form)
    }
    return acc
  }, {} as Record<string, { count: number; isTheoretical: boolean; forms: Set<string> }>)

  const sortedPatterns = Object.entries(morphologyBreakdown).sort((a, b) => b[1].count - a[1].count)

  return (
    <div style={{
      width: '400px',
      backgroundColor: '#2a2a2a',
      color: '#fff',
      padding: '20px',
      overflowY: 'auto',
      borderLeft: '1px solid #444'
    }}>
      <h2 style={{ marginTop: 0, marginBottom: '20px', fontSize: '20px' }}>
        Search Results {results.length > 0 && `(${results.length})`}
      </h2>

      {/* Morphology Breakdown */}
      {results.length > 0 && sortedPatterns.length > 0 && (
        <div style={{
          marginBottom: '20px',
          padding: '15px',
          backgroundColor: '#1a1a1a',
          borderRadius: '8px',
          border: '1px solid #444'
        }}>
          <div
            onClick={() => setShowBreakdown(!showBreakdown)}
            style={{
              cursor: 'pointer',
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
              marginBottom: showBreakdown ? '12px' : '0'
            }}
          >
            <h3 style={{ margin: 0, fontSize: '14px', color: '#4CAF50' }}>
              Morphology Breakdown
            </h3>
            <span style={{ fontSize: '12px', color: '#888' }}>
              {showBreakdown ? '▼' : '▶'}
            </span>
          </div>

          {showBreakdown && (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
              {sortedPatterns.map(([pattern, data]) => (
                <div
                  key={pattern}
                  style={{
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                    padding: '8px 10px',
                    backgroundColor: data.isTheoretical
                      ? 'rgba(255, 140, 0, 0.08)'
                      : 'rgba(100, 180, 255, 0.08)',
                    borderRadius: '4px',
                    borderLeft: data.isTheoretical
                      ? '3px solid rgba(255, 140, 0, 0.5)'
                      : '3px solid rgba(100, 180, 255, 0.5)'
                  }}
                >
                  <div style={{ flex: 1 }}>
                    <div style={{ fontSize: '12px', fontWeight: 'bold', color: '#ddd' }}>
                      {pattern}
                      {data.isTheoretical && (
                        <span style={{
                          marginLeft: '6px',
                          fontSize: '10px',
                          color: '#ff8c00'
                        }}>
                          ★
                        </span>
                      )}
                    </div>
                    <div style={{ fontSize: '10px', color: '#888', marginTop: '2px' }}>
                      {Array.from(data.forms).slice(0, 3).join(', ')}
                      {data.forms.size > 3 && '...'}
                    </div>
                  </div>
                  <div style={{
                    fontSize: '14px',
                    fontWeight: 'bold',
                    color: data.isTheoretical ? '#ff8c00' : '#64b4ff',
                    minWidth: '30px',
                    textAlign: 'right'
                  }}>
                    {data.count}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {results.length === 0 ? (
        <p style={{ color: '#888' }}>
          Search for a word to see results here. Try "الله" or "رحمن"
        </p>
      ) : (
        <div>
          {results.map((result, index) => (
            <div
              key={`${result.verseNumber}-${result.wordIndex}-${index}`}
              onClick={() => onVerseClick(result.verseNumber)}
              style={{
                backgroundColor: '#1a1a1a',
                padding: '15px',
                marginBottom: '10px',
                borderRadius: '8px',
                cursor: 'pointer',
                transition: 'background-color 0.2s',
                border: '1px solid #444'
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.backgroundColor = '#333'
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.backgroundColor = '#1a1a1a'
              }}
            >
              <div style={{
                fontSize: '12px',
                color: '#888',
                marginBottom: '8px',
                fontWeight: 'bold'
              }}>
                Verse {result.verseNumber}
              </div>
              <div style={{
                fontFamily: 'Noto Naskh Arabic, Arial',
                fontSize: '16px',
                lineHeight: '1.8',
                direction: 'rtl',
                textAlign: 'right',
                marginBottom: result.matchedForm ? '12px' : '0'
              }}>
                ...{result.context}...
              </div>

              {/* Morphological Form Insights */}
              {result.matchedForm && (
                <div style={{
                  marginTop: '10px',
                  padding: '10px',
                  backgroundColor: result.matchedForm.isTheoretical
                    ? 'rgba(255, 140, 0, 0.1)'
                    : 'rgba(100, 180, 255, 0.1)',
                  borderRadius: '6px',
                  borderLeft: result.matchedForm.isTheoretical
                    ? '3px solid rgba(255, 140, 0, 0.6)'
                    : '3px solid rgba(100, 180, 255, 0.6)'
                }}>
                  <div style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '8px',
                    marginBottom: '6px'
                  }}>
                    <span style={{
                      fontFamily: 'Noto Naskh Arabic, Arial',
                      fontSize: '14px',
                      fontWeight: 'bold',
                      color: result.matchedForm.isTheoretical ? '#ff8c00' : '#64b4ff'
                    }}>
                      {result.matchedForm.form}
                    </span>
                    {result.matchedForm.isTheoretical && (
                      <span style={{
                        fontSize: '10px',
                        padding: '2px 6px',
                        backgroundColor: 'rgba(255, 140, 0, 0.3)',
                        borderRadius: '3px',
                        color: '#ffb347',
                        fontWeight: 'bold'
                      }}>
                        ★ Theoretical
                      </span>
                    )}
                  </div>

                  <div style={{
                    fontSize: '11px',
                    color: '#aaa',
                    marginBottom: result.matchedForm.meaning || result.matchedForm.notes ? '4px' : '0'
                  }}>
                    Pattern: {result.matchedForm.pattern}
                  </div>

                  {result.matchedForm.meaning && (
                    <div style={{
                      fontSize: '12px',
                      color: '#ddd',
                      fontStyle: 'italic',
                      lineHeight: '1.5'
                    }}>
                      {result.matchedForm.meaning}
                    </div>
                  )}

                  {result.matchedForm.notes && (
                    <div style={{
                      fontSize: '11px',
                      color: '#ccc',
                      marginTop: '6px',
                      fontStyle: 'italic',
                      lineHeight: '1.5',
                      opacity: 0.9
                    }}>
                      {result.matchedForm.notes}
                    </div>
                  )}
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
