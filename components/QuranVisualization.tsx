'use client'

import { useEffect, useRef, useState } from 'react'
import { SpiralType, RoseSettings, TrochoidSettings, AnimationSettings, Preset } from './types'
import { getAbjadValue, getColorByAbjadValue, cleanupHarakat, containsRoot } from './utils'
import Controls from './Controls'
import styles from './QuranVisualization.module.css'

export default function QuranVisualization() {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const [quranText, setQuranText] = useState('')
  const [spiralType, setSpiralType] = useState<SpiralType>('goldenMean')
  const [fontSize, setFontSize] = useState(1.5)
  const [spiralDensity, setSpiralDensity] = useState(52.6)
  const [abjadColorEnabled, setAbjadColorEnabled] = useState(false)
  const [abjadSizeEnabled, setAbjadSizeEnabled] = useState(false)
  const [abjadWordTotalEnabled, setAbjadWordTotalEnabled] = useState(false)
  const [currentHighlightWord, setCurrentHighlightWord] = useState('')
  const [currentRootSearch, setCurrentRootSearch] = useState('')
  const [zoomLevel, setZoomLevel] = useState(1)
  const fontSizeAnimationRef = useRef<NodeJS.Timeout | null>(null)
  const spiralDensityAnimationRef = useRef<NodeJS.Timeout | null>(null)
  const renderRequestRef = useRef<number | null>(null)

  const [roseSettings, setRoseSettings] = useState<RoseSettings>({
    minimumRadius: 50,
    petalCount: 4,
    growthFactor: 0.01,
    angleStep: 0.1,
  })

  const [trochoidSettings, setTrochoidSettings] = useState<TrochoidSettings>({
    minimumRadius: 0,
    growthFactor: 0.00006,
    angleStep: 0.1,
    innerRadii: 0.8,
    outerRadii: 2,
    distance: 3,
  })

  const [animationSettings, setAnimationSettings] = useState<AnimationSettings>({
    fontSizeStart: 1,
    fontSizeEnd: 20,
    fontSizeStep: 0.5,
    fontSizeSpeed: 50,
    spiralDensityStart: -100,
    spiralDensityEnd: 200,
    spiralDensityStep: 0.5,
    spiralDensitySpeed: 50,
  })

  // Preset management
  const [savedPresets, setSavedPresets] = useState<Preset[]>([])

  // History management for undo/redo
  const [history, setHistory] = useState<Preset[]>([])
  const [historyIndex, setHistoryIndex] = useState(-1)
  const isApplyingHistory = useRef(false)

  // Load presets from localStorage on mount
  useEffect(() => {
    const stored = localStorage.getItem('quran-sight-presets')
    if (stored) {
      setSavedPresets(JSON.parse(stored))
    }
  }, [])

  function savePreset(name: string) {
    const preset: Preset = {
      name,
      spiralType,
      fontSize,
      spiralDensity,
      abjadColorEnabled,
      abjadSizeEnabled,
      abjadWordTotalEnabled,
      roseSettings,
      trochoidSettings,
      zoomLevel,
    }
    const newPresets = [...savedPresets, preset]
    setSavedPresets(newPresets)
    localStorage.setItem('quran-sight-presets', JSON.stringify(newPresets))
  }

  function loadPreset(preset: Preset) {
    setSpiralType(preset.spiralType)
    setFontSize(preset.fontSize)
    setSpiralDensity(preset.spiralDensity)
    setAbjadColorEnabled(preset.abjadColorEnabled)
    setAbjadSizeEnabled(preset.abjadSizeEnabled)
    setAbjadWordTotalEnabled(preset.abjadWordTotalEnabled)
    setRoseSettings(preset.roseSettings)
    setTrochoidSettings(preset.trochoidSettings)
    setZoomLevel(preset.zoomLevel)
  }

  function deletePreset(index: number) {
    const newPresets = savedPresets.filter((_, i) => i !== index)
    setSavedPresets(newPresets)
    localStorage.setItem('quran-sight-presets', JSON.stringify(newPresets))
  }

  // History functions for undo/redo
  function saveToHistory() {
    if (isApplyingHistory.current) return

    const snapshot: Preset = {
      name: 'history',
      spiralType,
      fontSize,
      spiralDensity,
      abjadColorEnabled,
      abjadSizeEnabled,
      abjadWordTotalEnabled,
      roseSettings,
      trochoidSettings,
      zoomLevel,
    }

    // Remove any future history if we're not at the end
    const newHistory = history.slice(0, historyIndex + 1)
    newHistory.push(snapshot)

    // Keep only last 50 states
    if (newHistory.length > 50) {
      newHistory.shift()
    } else {
      setHistoryIndex(historyIndex + 1)
    }

    setHistory(newHistory)
  }

  function undo() {
    if (historyIndex > 0) {
      isApplyingHistory.current = true
      const prevState = history[historyIndex - 1]
      loadPreset(prevState)
      setHistoryIndex(historyIndex - 1)
      setTimeout(() => { isApplyingHistory.current = false }, 100)
    }
  }

  function redo() {
    if (historyIndex < history.length - 1) {
      isApplyingHistory.current = true
      const nextState = history[historyIndex + 1]
      loadPreset(nextState)
      setHistoryIndex(historyIndex + 1)
      setTimeout(() => { isApplyingHistory.current = false }, 100)
    }
  }

  // Keyboard shortcuts for undo/redo
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.ctrlKey || e.metaKey) && e.shiftKey && e.key === 'Z') {
        e.preventDefault()
        redo()
      } else if ((e.ctrlKey || e.metaKey) && e.key === 'z') {
        e.preventDefault()
        undo()
      }
    }

    window.addEventListener('keydown', handleKeyDown)
    return () => window.removeEventListener('keydown', handleKeyDown)
  }, [historyIndex, history])

  // Track parameter changes for history (debounced)
  useEffect(() => {
    if (!quranText) return // Only start tracking after text is loaded

    const timeoutId = setTimeout(() => {
      saveToHistory()
    }, 500) // Debounce by 500ms

    return () => clearTimeout(timeoutId)
  }, [spiralType, fontSize, spiralDensity, abjadColorEnabled, abjadSizeEnabled, abjadWordTotalEnabled, zoomLevel, roseSettings, trochoidSettings])

  // Load Quran text
  useEffect(() => {
    fetch('/quran.txt')
      .then(response => response.text())
      .then(text => {
        const quranLines = text.split('\n').slice(0, 6236)
        const fullText = quranLines.join('\n')
        setQuranText(fullText) // Full Quran - all 6236 verses!
      })
      .catch(error => {
        console.error('Error loading Quranic text:', error)
      })
  }, [])

  // Draw visualization whenever settings change (with requestAnimationFrame)
  useEffect(() => {
    if (!quranText) return

    // Cancel any pending render request
    if (renderRequestRef.current !== null) {
      cancelAnimationFrame(renderRequestRef.current)
    }

    // Schedule new render
    renderRequestRef.current = requestAnimationFrame(() => {
      drawVisualization()
      renderRequestRef.current = null
    })

    return () => {
      if (renderRequestRef.current !== null) {
        cancelAnimationFrame(renderRequestRef.current)
      }
    }
  }, [
    quranText,
    spiralType,
    fontSize,
    spiralDensity,
    abjadColorEnabled,
    abjadSizeEnabled,
    abjadWordTotalEnabled,
    currentHighlightWord,
    currentRootSearch,
    zoomLevel,
    roseSettings,
    trochoidSettings,
  ])

  function drawVisualization() {
    const canvas = canvasRef.current
    if (!canvas) return
    const ctx = canvas.getContext('2d')
    if (!ctx) return

    ctx.clearRect(0, 0, canvas.width, canvas.height)
    ctx.save()
    ctx.scale(zoomLevel, zoomLevel)

    ctx.font = `${fontSize}px "Noto Naskh Arabic"`
    ctx.fillStyle = 'black'
    ctx.textAlign = 'center'
    ctx.textBaseline = 'middle'

    const centerX = canvas.width / (2 * zoomLevel)
    const centerY = canvas.height / (2 * zoomLevel)
    let radius = 10
    let angle = 0
    const angleIncrement = 0.1

    const words = quranText.split(/\s+/)
    let wordIndex = 0

    while (wordIndex < words.length) {
      const word = words[wordIndex]
      let x: number, y: number

      if (spiralType === 'logarithmic') {
        x = Math.cos(angle) * radius
        y = Math.sin(angle) * radius
        radius += 0.1 * word.length
      } else if (spiralType === 'archimedean') {
        x = Math.cos(angle) * angle
        y = Math.sin(angle) * angle
      } else if (spiralType === 'goldenMean') {
        const goldenAngle = Math.PI * (3 - Math.sqrt(5))
        x = Math.cos(angle) * Math.sqrt(angle)
        y = Math.sin(angle) * Math.sqrt(angle)
        angle += goldenAngle
      } else if (spiralType === 'fibonacci') {
        const fibonacciAngle = Math.PI * (3 - Math.sqrt(5))
        x = Math.cos(angle) * Math.sqrt(angle)
        y = Math.sin(angle) * Math.sqrt(angle)
        angle += fibonacciAngle
        radius += 0.1 * Math.sqrt(angle) * word.length
      } else if (spiralType === 'rose') {
        if (radius < roseSettings.minimumRadius) radius = roseSettings.minimumRadius

        x = Math.cos(roseSettings.petalCount * angle * Math.PI) * Math.cos(angle * Math.PI) * radius
        y = Math.cos(roseSettings.petalCount * angle * Math.PI) * Math.sin(angle * Math.PI) * radius

        angle += roseSettings.angleStep
        radius += roseSettings.growthFactor
      } else if (spiralType === 'epitrochoid') {
        if (radius < trochoidSettings.minimumRadius) radius = trochoidSettings.minimumRadius

        x = (((trochoidSettings.innerRadii + trochoidSettings.outerRadii) * Math.cos(angle)) -
             (trochoidSettings.distance * Math.cos((trochoidSettings.innerRadii + trochoidSettings.outerRadii) / trochoidSettings.innerRadii * angle))) * radius
        y = (((trochoidSettings.innerRadii + trochoidSettings.outerRadii) * Math.sin(angle)) -
             (trochoidSettings.distance * Math.sin((trochoidSettings.innerRadii + trochoidSettings.outerRadii) / trochoidSettings.innerRadii * angle))) * radius

        angle += trochoidSettings.angleStep
        radius += trochoidSettings.growthFactor
      } else if (spiralType === 'hypotrochoid') {
        if (radius < trochoidSettings.minimumRadius) radius = trochoidSettings.minimumRadius

        x = (((trochoidSettings.innerRadii + trochoidSettings.outerRadii) * Math.cos(angle)) +
             (trochoidSettings.distance * Math.cos((trochoidSettings.innerRadii + trochoidSettings.outerRadii) / trochoidSettings.innerRadii * angle))) * radius
        y = (((trochoidSettings.innerRadii + trochoidSettings.outerRadii) * Math.sin(angle)) -
             (trochoidSettings.distance * Math.sin((trochoidSettings.innerRadii + trochoidSettings.outerRadii) / trochoidSettings.innerRadii * angle))) * radius

        angle += trochoidSettings.angleStep
        radius += trochoidSettings.growthFactor
      } else {
        x = 0
        y = 0
      }

      ctx.save()
      ctx.translate(centerX + x, centerY + y)
      ctx.rotate(angle + Math.PI / 2)

      const searchWord = cleanupHarakat(word)
      const isWordMatch = searchWord === currentHighlightWord
      const isRootMatch = currentRootSearch && containsRoot(word, currentRootSearch)

      if (isWordMatch || isRootMatch) {
        ctx.font = `bold ${fontSize + 1}px "Noto Naskh Arabic"`
        ctx.fillStyle = isRootMatch ? 'blue' : 'red'
        ctx.fillText(word, 0, 0)
      } else {
        const abjadValue = getAbjadValue(word, abjadWordTotalEnabled)
        if (abjadSizeEnabled) {
          ctx.font = `${fontSize + abjadValue / 100}px "Noto Naskh Arabic"`
        } else {
          ctx.font = `${fontSize}px "Noto Naskh Arabic"`
        }
        if (abjadColorEnabled) {
          ctx.fillStyle = getColorByAbjadValue(abjadValue)
        } else {
          ctx.fillStyle = 'black'
        }
        ctx.fillText(word, 0, 0)
      }

      ctx.restore()

      angle += (angleIncrement * fontSize * word.length) / (20 * spiralDensity)
      wordIndex++
    }

    ctx.restore()
  }

  function searchAndHighlight(word: string) {
    setCurrentHighlightWord(cleanupHarakat(word))
  }

  function searchRoot(root: string) {
    setCurrentRootSearch(root)
  }

  function clearSearches() {
    setCurrentHighlightWord('')
    setCurrentRootSearch('')
  }

  function zoomIn() {
    setZoomLevel(prev => prev * 1.1)
  }

  function zoomOut() {
    setZoomLevel(prev => prev / 1.1)
  }

  function saveSVG() {
    const canvas = canvasRef.current
    if (!canvas) return

    const svg = document.createElementNS('http://www.w3.org/2000/svg', 'svg')
    svg.setAttribute('width', canvas.width.toString())
    svg.setAttribute('height', canvas.height.toString())
    svg.setAttribute('viewBox', `0 0 ${canvas.width} ${canvas.height}`)

    const centerX = canvas.width / 2
    const centerY = canvas.height / 2
    let radius = 10
    let angle = 0
    const angleIncrement = 0.1

    const words = quranText.split(/\s+/)
    let wordIndex = 0

    while (wordIndex < words.length) {
      const word = words[wordIndex]
      let x: number, y: number

      if (spiralType === 'logarithmic') {
        x = Math.cos(angle) * radius
        y = Math.sin(angle) * radius
        radius += 0.1 * word.length
      } else if (spiralType === 'archimedean') {
        x = Math.cos(angle) * angle
        y = Math.sin(angle) * angle
      } else if (spiralType === 'goldenMean') {
        const goldenAngle = Math.PI * (3 - Math.sqrt(5))
        x = Math.cos(angle) * Math.sqrt(angle)
        y = Math.sin(angle) * Math.sqrt(angle)
        angle += goldenAngle
      } else if (spiralType === 'fibonacci') {
        const fibonacciAngle = Math.PI * (3 - Math.sqrt(5))
        x = Math.cos(angle) * Math.sqrt(angle)
        y = Math.sin(angle) * Math.sqrt(angle)
        angle += fibonacciAngle
        radius += 0.1 * Math.sqrt(angle) * word.length
      } else {
        x = 0
        y = 0
      }

      const text = document.createElementNS('http://www.w3.org/2000/svg', 'text')
      text.setAttribute('font-family', 'Noto Naskh Arabic')
      text.setAttribute('font-size', fontSize.toString())
      text.setAttribute('text-anchor', 'middle')
      text.setAttribute('dominant-baseline', 'middle')
      text.setAttribute('transform', `translate(${centerX + x}, ${centerY + y}) rotate(${((angle + Math.PI / 2) * 180) / Math.PI})`)

      if (word === currentHighlightWord) {
        text.setAttribute('font-weight', 'bold')
        text.setAttribute('fill', 'red')
      } else {
        const abjadValue = getAbjadValue(word, abjadWordTotalEnabled)
        if (abjadSizeEnabled) {
          text.setAttribute('font-size', (fontSize + abjadValue / 100).toString())
        }
        if (abjadColorEnabled) {
          text.setAttribute('fill', getColorByAbjadValue(abjadValue))
        } else {
          text.setAttribute('fill', 'black')
        }
      }

      text.textContent = word
      svg.appendChild(text)

      angle += (angleIncrement * fontSize * word.length) / (20 * spiralDensity)
      wordIndex++
    }

    const blob = new Blob([svg.outerHTML], { type: 'image/svg+xml' })
    const url = URL.createObjectURL(blob)
    const link = document.createElement('a')
    link.href = url
    link.download = 'quran_spiral.svg'
    link.click()
    URL.revokeObjectURL(url)
  }

  return (
    <div className={styles.container}>
      <canvas
        ref={canvasRef}
        id="canvas"
        width={600}
        height={600}
        className={styles.canvas}
      />
      <Controls
        spiralType={spiralType}
        setSpiralType={setSpiralType}
        fontSize={fontSize}
        setFontSize={setFontSize}
        spiralDensity={spiralDensity}
        setSpiralDensity={setSpiralDensity}
        abjadColorEnabled={abjadColorEnabled}
        setAbjadColorEnabled={setAbjadColorEnabled}
        abjadSizeEnabled={abjadSizeEnabled}
        setAbjadSizeEnabled={setAbjadSizeEnabled}
        abjadWordTotalEnabled={abjadWordTotalEnabled}
        setAbjadWordTotalEnabled={setAbjadWordTotalEnabled}
        onSearch={searchAndHighlight}
        onSearchRoot={searchRoot}
        onClearSearches={clearSearches}
        onZoomIn={zoomIn}
        onZoomOut={zoomOut}
        onSaveSVG={saveSVG}
        roseSettings={roseSettings}
        setRoseSettings={setRoseSettings}
        trochoidSettings={trochoidSettings}
        setTrochoidSettings={setTrochoidSettings}
        animationSettings={animationSettings}
        setAnimationSettings={setAnimationSettings}
        fontSizeAnimationRef={fontSizeAnimationRef}
        spiralDensityAnimationRef={spiralDensityAnimationRef}
        onFontSizeChange={(value) => setFontSize(value)}
        onSpiralDensityChange={(value) => setSpiralDensity(value)}
        savedPresets={savedPresets}
        onSavePreset={savePreset}
        onLoadPreset={loadPreset}
        onDeletePreset={deletePreset}
      />
    </div>
  )
}
