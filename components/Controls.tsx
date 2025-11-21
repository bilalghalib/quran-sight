'use client'

import { useState, memo } from 'react'
import { SpiralType, RoseSettings, TrochoidSettings, AnimationSettings, Preset } from './types'
import styles from './Controls.module.css'

interface ControlsProps {
  spiralType: SpiralType
  setSpiralType: (type: SpiralType) => void
  fontSize: number
  setFontSize: (size: number) => void
  spiralDensity: number
  setSpiralDensity: (density: number) => void
  abjadColorEnabled: boolean
  setAbjadColorEnabled: (enabled: boolean) => void
  abjadSizeEnabled: boolean
  setAbjadSizeEnabled: (enabled: boolean) => void
  abjadWordTotalEnabled: boolean
  setAbjadWordTotalEnabled: (enabled: boolean) => void
  onSearch: (word: string) => void
  onSearchRoot: (root: string) => void
  onClearSearches: () => void
  onZoomIn: () => void
  onZoomOut: () => void
  onSaveSVG: () => void
  roseSettings: RoseSettings
  setRoseSettings: (settings: RoseSettings) => void
  trochoidSettings: TrochoidSettings
  setTrochoidSettings: (settings: TrochoidSettings) => void
  animationSettings: AnimationSettings
  setAnimationSettings: (settings: AnimationSettings) => void
  fontSizeAnimationRef: React.MutableRefObject<NodeJS.Timeout | null>
  spiralDensityAnimationRef: React.MutableRefObject<NodeJS.Timeout | null>
  onFontSizeChange: (value: number) => void
  onSpiralDensityChange: (value: number) => void
  savedPresets: Preset[]
  onSavePreset: (name: string) => void
  onLoadPreset: (preset: Preset) => void
  onDeletePreset: (index: number) => void
}

const Controls = memo(function Controls({
  spiralType,
  setSpiralType,
  fontSize,
  setFontSize,
  spiralDensity,
  setSpiralDensity,
  abjadColorEnabled,
  setAbjadColorEnabled,
  abjadSizeEnabled,
  setAbjadSizeEnabled,
  abjadWordTotalEnabled,
  setAbjadWordTotalEnabled,
  onSearch,
  onSearchRoot,
  onClearSearches,
  onZoomIn,
  onZoomOut,
  onSaveSVG,
  roseSettings,
  setRoseSettings,
  trochoidSettings,
  setTrochoidSettings,
  animationSettings,
  setAnimationSettings,
  fontSizeAnimationRef,
  spiralDensityAnimationRef,
  onFontSizeChange,
  onSpiralDensityChange,
  savedPresets,
  onSavePreset,
  onLoadPreset,
  onDeletePreset,
}: ControlsProps) {
  const [openDrawers, setOpenDrawers] = useState<Set<string>>(new Set(['spiral']))
  const [newPresetName, setNewPresetName] = useState('')
  const [localHighlightWord, setLocalHighlightWord] = useState('الله')
  const [localRootSearch, setLocalRootSearch] = useState('')

  const toggleDrawer = (drawer: string) => {
    setOpenDrawers(prev => {
      const newSet = new Set(prev)
      if (newSet.has(drawer)) {
        newSet.delete(drawer)
      } else {
        newSet.add(drawer)
      }
      return newSet
    })
  }

  const startFontSizeAnimation = () => {
    if (fontSizeAnimationRef.current) {
      clearInterval(fontSizeAnimationRef.current)
    }

    let currentValue = animationSettings.fontSizeStart
    const increment = animationSettings.fontSizeEnd > animationSettings.fontSizeStart
      ? animationSettings.fontSizeStep
      : -animationSettings.fontSizeStep
    let reversing = false

    fontSizeAnimationRef.current = setInterval(() => {
      if (!reversing) {
        currentValue += increment
        if (
          (increment > 0 && currentValue >= animationSettings.fontSizeEnd) ||
          (increment < 0 && currentValue <= animationSettings.fontSizeEnd)
        ) {
          reversing = true
        }
      } else {
        currentValue -= increment
        if (
          (increment > 0 && currentValue <= animationSettings.fontSizeStart) ||
          (increment < 0 && currentValue >= animationSettings.fontSizeStart)
        ) {
          reversing = false
        }
      }
      onFontSizeChange(currentValue)
    }, animationSettings.fontSizeSpeed)
  }

  const stopFontSizeAnimation = () => {
    if (fontSizeAnimationRef.current) {
      clearInterval(fontSizeAnimationRef.current)
      fontSizeAnimationRef.current = null
    }
  }

  const startSpiralDensityAnimation = () => {
    if (spiralDensityAnimationRef.current) {
      clearInterval(spiralDensityAnimationRef.current)
    }

    let currentValue = animationSettings.spiralDensityStart
    const increment = animationSettings.spiralDensityEnd > animationSettings.spiralDensityStart
      ? animationSettings.spiralDensityStep
      : -animationSettings.spiralDensityStep
    let reversing = false

    spiralDensityAnimationRef.current = setInterval(() => {
      if (!reversing) {
        currentValue += increment
        if (
          (increment > 0 && currentValue >= animationSettings.spiralDensityEnd) ||
          (increment < 0 && currentValue <= animationSettings.spiralDensityEnd)
        ) {
          reversing = true
        }
      } else {
        currentValue -= increment
        if (
          (increment > 0 && currentValue <= animationSettings.spiralDensityStart) ||
          (increment < 0 && currentValue >= animationSettings.spiralDensityStart)
        ) {
          reversing = false
        }
      }
      onSpiralDensityChange(currentValue)
    }, animationSettings.spiralDensitySpeed)
  }

  const stopSpiralDensityAnimation = () => {
    if (spiralDensityAnimationRef.current) {
      clearInterval(spiralDensityAnimationRef.current)
      spiralDensityAnimationRef.current = null
    }
  }

  return (
    <div className={styles.controls}>
      {/* Spiral Settings */}
      <div className={styles.drawer}>
        <h3 onClick={() => toggleDrawer('spiral')}>Spiral Settings</h3>
        {openDrawers.has('spiral') && (
          <div className={styles.drawerContent}>
            <label htmlFor="spiralType">Spiral Type:</label>
            <select
              id="spiralType"
              value={spiralType}
              onChange={(e) => setSpiralType(e.target.value as SpiralType)}
            >
              <option value="logarithmic">Logarithmic</option>
              <option value="archimedean">Archimedean</option>
              <option value="goldenMean">Golden Mean</option>
              <option value="fibonacci">Fibonacci</option>
              <option value="rose">Rose</option>
              <option value="epitrochoid">Epitrochoid</option>
              <option value="hypotrochoid">Hypotrochoid</option>
            </select>

            <label htmlFor="fontSize">Font Size:</label>
            <input
              type="range"
              id="fontSize"
              min="1"
              max="20"
              step="0.5"
              value={fontSize}
              onChange={(e) => setFontSize(parseFloat(e.target.value))}
            />
            <input
              type="text"
              value={fontSize.toFixed(1)}
              onChange={(e) => setFontSize(parseFloat(e.target.value) || 1.5)}
              size={2}
            />

            <label htmlFor="spiralDensity">Spiral Density:</label>
            <input
              type="range"
              id="spiralDensity"
              min="1"
              max="20"
              step="0.5"
              value={spiralDensity}
              onChange={(e) => setSpiralDensity(parseFloat(e.target.value))}
            />
            <input
              type="text"
              value={spiralDensity.toFixed(1)}
              onChange={(e) => setSpiralDensity(parseFloat(e.target.value) || 52.6)}
              size={2}
            />
          </div>
        )}
      </div>

      {/* Rose Settings */}
      {spiralType === 'rose' && (
        <div className={`${styles.drawer} ${styles.subdrawer}`}>
          <h3 onClick={() => toggleDrawer('rose')}>Rose Spiral Settings</h3>
          {openDrawers.has('rose') && (
            <div className={styles.drawerContent}>
              <label htmlFor="roseMinimumRadius">Minimum Radius:</label>
              <input
                type="number"
                id="roseMinimumRadius"
                value={roseSettings.minimumRadius}
                onChange={(e) => setRoseSettings({ ...roseSettings, minimumRadius: parseFloat(e.target.value) })}
              />

              <label htmlFor="rosePetalCount">Petal Count:</label>
              <input
                type="number"
                id="rosePetalCount"
                value={roseSettings.petalCount}
                onChange={(e) => setRoseSettings({ ...roseSettings, petalCount: parseFloat(e.target.value) })}
              />

              <label htmlFor="roseGrowthFactor">Growth Factor:</label>
              <input
                type="number"
                id="roseGrowthFactor"
                step="0.01"
                value={roseSettings.growthFactor}
                onChange={(e) => setRoseSettings({ ...roseSettings, growthFactor: parseFloat(e.target.value) })}
              />

              <label htmlFor="roseAngleStep">Angle Step:</label>
              <input
                type="number"
                id="roseAngleStep"
                step="0.01"
                value={roseSettings.angleStep}
                onChange={(e) => setRoseSettings({ ...roseSettings, angleStep: parseFloat(e.target.value) })}
              />
            </div>
          )}
        </div>
      )}

      {/* Trochoid Settings */}
      {(spiralType === 'epitrochoid' || spiralType === 'hypotrochoid') && (
        <div className={`${styles.drawer} ${styles.subdrawer}`}>
          <h3 onClick={() => toggleDrawer('trochoid')}>
            {spiralType === 'epitrochoid' ? 'Epitrochoid' : 'Hypotrochoid'} Settings
          </h3>
          {openDrawers.has('trochoid') && (
            <div className={styles.drawerContent}>
              <label htmlFor="trochoidMinimumRadius">Minimum Radius:</label>
              <input
                type="number"
                id="trochoidMinimumRadius"
                value={trochoidSettings.minimumRadius}
                onChange={(e) => setTrochoidSettings({ ...trochoidSettings, minimumRadius: parseFloat(e.target.value) })}
              />

              <label htmlFor="trochoidGrowthFactor">Growth Factor:</label>
              <input
                type="number"
                id="trochoidGrowthFactor"
                step="0.00001"
                value={trochoidSettings.growthFactor}
                onChange={(e) => setTrochoidSettings({ ...trochoidSettings, growthFactor: parseFloat(e.target.value) })}
              />

              <label htmlFor="trochoidAngleStep">Angle Step:</label>
              <input
                type="number"
                id="trochoidAngleStep"
                step="0.01"
                value={trochoidSettings.angleStep}
                onChange={(e) => setTrochoidSettings({ ...trochoidSettings, angleStep: parseFloat(e.target.value) })}
              />

              <label htmlFor="trochoidInnerRadii">Inner Radii:</label>
              <input
                type="number"
                id="trochoidInnerRadii"
                step="0.1"
                value={trochoidSettings.innerRadii}
                onChange={(e) => setTrochoidSettings({ ...trochoidSettings, innerRadii: parseFloat(e.target.value) })}
              />

              <label htmlFor="trochoidOuterRadii">Outer Radii:</label>
              <input
                type="number"
                id="trochoidOuterRadii"
                step="0.01"
                value={trochoidSettings.outerRadii}
                onChange={(e) => setTrochoidSettings({ ...trochoidSettings, outerRadii: parseFloat(e.target.value) })}
              />

              <label htmlFor="trochoidDistance">Circle Distance:</label>
              <input
                type="number"
                id="trochoidDistance"
                value={trochoidSettings.distance}
                onChange={(e) => setTrochoidSettings({ ...trochoidSettings, distance: parseFloat(e.target.value) })}
              />
            </div>
          )}
        </div>
      )}

      {/* Animation Settings */}
      <div className={styles.drawer}>
        <h3 onClick={() => toggleDrawer('animation')}>Animation Settings</h3>
        {openDrawers.has('animation') && (
          <div className={styles.drawerContent}>
            <label htmlFor="fontSizeStart">Font Size Start:</label>
            <input
              type="number"
              id="fontSizeStart"
              value={animationSettings.fontSizeStart}
              onChange={(e) => setAnimationSettings({ ...animationSettings, fontSizeStart: parseFloat(e.target.value) })}
            />

            <label htmlFor="fontSizeEnd">Font Size End:</label>
            <input
              type="number"
              id="fontSizeEnd"
              value={animationSettings.fontSizeEnd}
              onChange={(e) => setAnimationSettings({ ...animationSettings, fontSizeEnd: parseFloat(e.target.value) })}
            />

            <label htmlFor="fontSizeStep">Font Size Step:</label>
            <input
              type="number"
              id="fontSizeStep"
              step="0.1"
              value={animationSettings.fontSizeStep}
              onChange={(e) => setAnimationSettings({ ...animationSettings, fontSizeStep: parseFloat(e.target.value) })}
            />

            <label htmlFor="fontSizeSpeed">Font Size Speed (ms):</label>
            <input
              type="number"
              id="fontSizeSpeed"
              value={animationSettings.fontSizeSpeed}
              onChange={(e) => setAnimationSettings({ ...animationSettings, fontSizeSpeed: parseFloat(e.target.value) })}
            />

            <button onClick={startFontSizeAnimation}>Start</button>
            <button onClick={stopFontSizeAnimation}>Stop</button>

            <label htmlFor="spiralDensityStart">Spiral Density Start:</label>
            <input
              type="number"
              id="spiralDensityStart"
              value={animationSettings.spiralDensityStart}
              onChange={(e) => setAnimationSettings({ ...animationSettings, spiralDensityStart: parseFloat(e.target.value) })}
            />

            <label htmlFor="spiralDensityEnd">Spiral Density End:</label>
            <input
              type="number"
              id="spiralDensityEnd"
              value={animationSettings.spiralDensityEnd}
              onChange={(e) => setAnimationSettings({ ...animationSettings, spiralDensityEnd: parseFloat(e.target.value) })}
            />

            <label htmlFor="spiralDensityStep">Spiral Density Step:</label>
            <input
              type="number"
              id="spiralDensityStep"
              step="0.1"
              value={animationSettings.spiralDensityStep}
              onChange={(e) => setAnimationSettings({ ...animationSettings, spiralDensityStep: parseFloat(e.target.value) })}
            />

            <label htmlFor="spiralDensitySpeed">Spiral Density Speed (ms):</label>
            <input
              type="number"
              id="spiralDensitySpeed"
              value={animationSettings.spiralDensitySpeed}
              onChange={(e) => setAnimationSettings({ ...animationSettings, spiralDensitySpeed: parseFloat(e.target.value) })}
            />

            <button onClick={startSpiralDensityAnimation}>Start</button>
            <button onClick={stopSpiralDensityAnimation}>Stop</button>
          </div>
        )}
      </div>

      {/* Abjad Settings */}
      <div className={styles.drawer}>
        <h3 onClick={() => toggleDrawer('abjad')}>Abjad Settings</h3>
        {openDrawers.has('abjad') && (
          <div className={styles.drawerContent}>
            <label>
              <input
                type="checkbox"
                checked={abjadColorEnabled}
                onChange={(e) => setAbjadColorEnabled(e.target.checked)}
              />
              Enable Abjad Color
            </label>

            <label>
              <input
                type="checkbox"
                checked={abjadSizeEnabled}
                onChange={(e) => setAbjadSizeEnabled(e.target.checked)}
              />
              Enable Abjad Size
            </label>

            <label>
              <input
                type="checkbox"
                checked={abjadWordTotalEnabled}
                onChange={(e) => setAbjadWordTotalEnabled(e.target.checked)}
              />
              Abjad Total for Word
            </label>
          </div>
        )}
      </div>

      {/* Search Settings */}
      <div className={styles.drawer}>
        <h3 onClick={() => toggleDrawer('search')}>Search Settings</h3>
        {openDrawers.has('search') && (
          <div className={styles.drawerContent}>
            <label htmlFor="highlightWord">Exact Word (red):</label>
            <input
              type="text"
              id="highlightWord"
              value={localHighlightWord}
              onChange={(e) => setLocalHighlightWord(e.target.value)}
              placeholder="الله"
              onKeyDown={(e) => {
                if (e.key === 'Enter') {
                  onSearch(localHighlightWord)
                }
              }}
            />
            <button onClick={() => onSearch(localHighlightWord)}>Search</button>

            <div style={{ marginTop: '10px', paddingTop: '10px', borderTop: '1px solid #ccc' }}>
              <label htmlFor="rootSearch">Root Letters (blue):</label>
              <input
                type="text"
                id="rootSearch"
                value={localRootSearch}
                onChange={(e) => setLocalRootSearch(e.target.value)}
                placeholder="كتب"
                onKeyDown={(e) => {
                  if (e.key === 'Enter') {
                    onSearchRoot(localRootSearch)
                  }
                }}
              />
              <button onClick={() => onSearchRoot(localRootSearch)}>Find Root</button>
            </div>

            <button
              onClick={onClearSearches}
              style={{ marginTop: '10px', width: '100%' }}
            >
              Clear All Highlights
            </button>
          </div>
        )}
      </div>

      {/* Presets */}
      <div className={styles.drawer}>
        <h3 onClick={() => toggleDrawer('presets')}>Saved Presets</h3>
        {openDrawers.has('presets') && (
          <div className={styles.drawerContent}>
            <div style={{ marginBottom: '10px' }}>
              <label htmlFor="presetName">Save Current:</label>
              <input
                type="text"
                id="presetName"
                placeholder="Preset name..."
                value={newPresetName}
                onChange={(e) => setNewPresetName(e.target.value)}
              />
              <button
                onClick={() => {
                  if (newPresetName.trim()) {
                    onSavePreset(newPresetName.trim())
                    setNewPresetName('')
                  }
                }}
              >
                Save
              </button>
            </div>

            {savedPresets.length > 0 && (
              <div>
                <label>Load Preset:</label>
                {savedPresets.map((preset, index) => (
                  <div key={index} style={{ display: 'flex', gap: '5px', marginBottom: '5px' }}>
                    <button
                      onClick={() => onLoadPreset(preset)}
                      style={{ flex: 1 }}
                    >
                      {preset.name}
                    </button>
                    <button
                      onClick={() => onDeletePreset(index)}
                      style={{ width: '30px' }}
                    >
                      ×
                    </button>
                  </div>
                ))}
              </div>
            )}

            {savedPresets.length === 0 && (
              <p style={{ fontSize: '0.9em', opacity: 0.7 }}>No saved presets yet</p>
            )}
          </div>
        )}
      </div>

      {/* Save Settings */}
      <div className={styles.drawer}>
        <h3 onClick={() => toggleDrawer('save')}>Save Settings</h3>
        {openDrawers.has('save') && (
          <div className={styles.drawerContent}>
            <button onClick={onSaveSVG}>Save as SVG</button>
            <button onClick={onZoomIn}>Zoom In</button>
            <button onClick={onZoomOut}>Zoom Out</button>
          </div>
        )}
      </div>
    </div>
  )
})

export default Controls
