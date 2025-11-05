'use client'

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
