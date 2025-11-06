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
  selectedPatterns: Set<string>
  onPatternsChange: (patterns: Set<string>) => void
  isMobile?: boolean
  isOpen?: boolean
  onClose?: () => void
  isDesktopCollapsed?: boolean
  onDesktopToggle?: () => void
}

// Helper to get pattern description
function getPatternDescription(pattern: string): string {
  if (pattern.includes('Form I')) return 'Base verb form'
  if (pattern.includes('Form II')) return 'Intensive/Causative'
  if (pattern.includes('Form III')) return 'Associative'
  if (pattern.includes('Form IV')) return 'Causative'
  if (pattern.includes('Form V')) return 'Reflexive of II'
  if (pattern.includes('Form VI')) return 'Reciprocal'
  if (pattern.includes('Form VII')) return 'Passive reflexive'
  if (pattern.includes('Form VIII')) return 'Reflexive'
  if (pattern.includes('Form IX')) return 'Colors/defects'
  if (pattern.includes('Form X')) return 'Request/seek'
  if (pattern.includes('Active Participle')) return 'Doer of action'
  if (pattern.includes('Passive Participle')) return 'Receiver of action'
  if (pattern.includes('Verbal Noun')) return 'Action/state noun'
  if (pattern.includes('Noun of Place')) return 'Location noun'
  if (pattern.includes('Noun of Time')) return 'Time noun'
  if (pattern.includes('Noun of Instrument')) return 'Tool noun'
  if (pattern.includes('Comparative')) return 'More/most form'
  if (pattern.includes('Intensive')) return 'Emphasizing form'
  if (pattern.includes('Base form')) return 'Root word'
  if (pattern.includes('Variant')) return 'Alternative form'
  return 'Derived form'
}

export default function SearchDrawer({ results, onVerseClick, selectedPatterns, onPatternsChange, isMobile = false, isOpen = true, onClose, isDesktopCollapsed = false, onDesktopToggle }: SearchDrawerProps) {
  const [showBreakdown, setShowBreakdown] = useState(true)

  // On mobile, show only when open
  if (isMobile && !isOpen) return null

  // On desktop, show collapsed button when collapsed
  if (!isMobile && isDesktopCollapsed) {
    return (
      <button
        onClick={onDesktopToggle}
        title="Show Search Results"
        style={{
          position: 'fixed',
          top: '20px',
          right: '20px',
          zIndex: 10,
          backgroundColor: 'rgba(42, 42, 42, 0.95)',
          padding: '12px 16px',
          borderRadius: '8px',
          border: '1px solid #444',
          color: '#fff',
          cursor: 'pointer',
          fontSize: '20px',
          boxShadow: '0 2px 10px rgba(0,0,0,0.5)',
          transition: 'all 0.2s ease'
        }}
        onMouseEnter={(e) => {
          e.currentTarget.style.backgroundColor = 'rgba(60, 60, 60, 0.95)'
        }}
        onMouseLeave={(e) => {
          e.currentTarget.style.backgroundColor = 'rgba(42, 42, 42, 0.95)'
        }}
      >
        ☰
      </button>
    )
  }

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

  // Filter results based on selected patterns
  const filteredResults = selectedPatterns.size === 0
    ? results
    : results.filter(r => r.matchedForm && selectedPatterns.has(r.matchedForm.pattern))

  // Toggle pattern selection
  const togglePattern = (pattern: string) => {
    const newSet = new Set(selectedPatterns)
    if (newSet.has(pattern)) {
      newSet.delete(pattern)
    } else {
      newSet.add(pattern)
    }
    onPatternsChange(newSet)
  }

  return (
    <>
      {/* Mobile backdrop */}
      {isMobile && isOpen && (
        <div
          onClick={onClose}
          style={{
            position: 'fixed',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            backgroundColor: 'rgba(0, 0, 0, 0.5)',
            zIndex: 999
          }}
        />
      )}

      <div style={{
        width: isMobile ? '85%' : '400px',
        maxWidth: isMobile ? '400px' : undefined,
        backgroundColor: '#2a2a2a',
        color: '#fff',
        padding: '20px',
        overflowY: 'auto',
        borderLeft: '1px solid #444',
        ...(isMobile ? {
          position: 'fixed',
          top: 0,
          right: 0,
          bottom: 0,
          zIndex: 1000,
          boxShadow: '-4px 0 12px rgba(0,0,0,0.3)',
          transform: isOpen ? 'translateX(0)' : 'translateX(100%)',
          transition: 'transform 0.3s ease'
        } : {})
      }}>
      <div style={{
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginTop: 0,
        marginBottom: '20px'
      }}>
        <h2 style={{ margin: 0, fontSize: '20px' }}>
          Search Results {results.length > 0 && `(${filteredResults.length}${selectedPatterns.size > 0 ? ` of ${results.length}` : ''})`}
        </h2>
        {!isMobile && onDesktopToggle && (
          <button
            onClick={onDesktopToggle}
            title="Hide Search Results"
            style={{
              backgroundColor: 'transparent',
              border: 'none',
              color: '#999',
              cursor: 'pointer',
              fontSize: '18px',
              padding: '4px 8px',
              transition: 'color 0.2s ease'
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.color = '#fff'
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.color = '#999'
            }}
          >
            ▸
          </button>
        )}
      </div>

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
            <h3 style={{ margin: 0, fontSize: '15px', color: '#4CAF50' }}>
              Morphology Breakdown {selectedPatterns.size > 0 && `(${selectedPatterns.size} active)`}
            </h3>
            <span style={{ fontSize: '12px', color: '#888' }}>
              {showBreakdown ? '▼' : '▶'}
            </span>
          </div>

          {showBreakdown && (
            <>
              {selectedPatterns.size > 0 && (
                <div style={{ marginBottom: '10px', fontSize: '11px', color: '#888', fontStyle: 'italic' }}>
                  Click to toggle filters • Click again to show all
                </div>
              )}
              <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                {sortedPatterns.map(([pattern, data]) => {
                  const isSelected = selectedPatterns.has(pattern)
                  const description = getPatternDescription(pattern)

                  return (
                    <div
                      key={pattern}
                      onClick={() => togglePattern(pattern)}
                      style={{
                        display: 'flex',
                        justifyContent: 'space-between',
                        alignItems: 'center',
                        padding: '10px 12px',
                        backgroundColor: isSelected
                          ? (data.isTheoretical ? 'rgba(255, 140, 0, 0.25)' : 'rgba(100, 180, 255, 0.25)')
                          : (data.isTheoretical ? 'rgba(255, 140, 0, 0.08)' : 'rgba(100, 180, 255, 0.08)'),
                        borderRadius: '6px',
                        borderLeft: isSelected
                          ? (data.isTheoretical ? '4px solid rgba(255, 140, 0, 0.9)' : '4px solid rgba(100, 180, 255, 0.9)')
                          : (data.isTheoretical ? '3px solid rgba(255, 140, 0, 0.5)' : '3px solid rgba(100, 180, 255, 0.5)'),
                        cursor: 'pointer',
                        transition: 'all 0.2s ease',
                        border: isSelected ? '1px solid rgba(255, 255, 255, 0.2)' : '1px solid transparent'
                      }}
                      onMouseEnter={(e) => {
                        e.currentTarget.style.transform = 'scale(1.02)'
                      }}
                      onMouseLeave={(e) => {
                        e.currentTarget.style.transform = 'scale(1)'
                      }}
                    >
                      <div style={{ flex: 1 }}>
                        <div style={{ fontSize: '13px', fontWeight: 'bold', color: '#fff', marginBottom: '3px' }}>
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
                          {isSelected && (
                            <span style={{
                              marginLeft: '6px',
                              fontSize: '11px',
                              color: '#4CAF50'
                            }}>
                              ✓
                            </span>
                          )}
                        </div>
                        <div style={{ fontSize: '11px', color: '#aaa', marginBottom: '3px' }}>
                          {description}
                        </div>
                        <div style={{ fontSize: '10px', color: '#888' }}>
                          {Array.from(data.forms).slice(0, 3).join(', ')}
                          {data.forms.size > 3 && '...'}
                        </div>
                      </div>
                      <div style={{
                        fontSize: '16px',
                        fontWeight: 'bold',
                        color: data.isTheoretical ? '#ff8c00' : '#64b4ff',
                        minWidth: '35px',
                        textAlign: 'right'
                      }}>
                        {data.count}
                      </div>
                    </div>
                  )
                })}
              </div>
            </>
          )}
        </div>
      )}

      {results.length === 0 ? (
        <p style={{ color: '#888' }}>
          Search for a word to see results here. Try "الله" or "رحمن"
        </p>
      ) : (
        <div>
          {filteredResults.map((result, index) => (
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
    </>
  )
}
