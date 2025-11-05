# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

Quran-Sight is a visual exploration tool that renders Quranic text in various spiral patterns on an HTML5 canvas. The application is built with Next.js, React, and TypeScript, allowing users to interactively explore the Quran through different mathematical spirals (logarithmic, Archimedean, golden mean, Fibonacci, rose, epitrochoid, hypotrochoid) with customizable visual properties.

## Running the Application

This is a Next.js application with TypeScript:

```bash
# Install dependencies
npm install

# Run development server
npm run dev

# Build for production (static export)
npm run build

# The build creates a static export in the /out directory
```

## Deployment

The application is configured for static export (see next.config.js) and can be deployed to Vercel:
```bash
vercel
```

Or push to a Git repository and import to Vercel for automatic deployments.

## Architecture

### Project Structure

- **/app** - Next.js app router
  - `layout.tsx` - Root layout with font loading
  - `page.tsx` - Main page component
  - `globals.css` - Global styles

- **/components**
  - `QuranVisualization.tsx` - Main component with canvas rendering logic (client component)
  - `Controls.tsx` - UI controls for all settings
  - `types.ts` - TypeScript type definitions
  - `utils.ts` - Utility functions (Abjad, color, text processing)
  - CSS modules for component styling

- **/public**
  - `quran.txt` - Quranic text data (6236 verses)

### Core Rendering System

The visualization system is built with React hooks and canvas:

1. **Canvas Rendering Engine** (QuranVisualization.tsx)
   - `drawVisualization()` is the main rendering function that redraws the entire canvas
   - Uses `useEffect` to redraw when any settings change
   - Processes Quranic text word-by-word, positioning each along the selected spiral path
   - Applies transformations (rotation, translation) to orient text along the spiral curve
   - Supports zoom levels via `zoomLevel` state

2. **Spiral Algorithms** (QuranVisualization.tsx:~120-180)
   - Each spiral type calculates (x, y) coordinates differently
   - `goldenMean` and `fibonacci` use golden angle: `Math.PI * (3 - Math.sqrt(5))`
   - `rose`, `epitrochoid`, `hypotrochoid` have additional configurable parameters
   - Spiral parameters managed through React state (roseSettings, trochoidSettings)

3. **Abjad Numerology System** (utils.ts)
   - Maps Arabic letters to numerical values using the Abjad system
   - `getAbjadValue()` calculates values per letter or per word
   - `getColorByAbjadValue()` generates HSL colors using golden angle distribution
   - Affects both text color and font size when enabled

### State Management

All state is managed with React hooks (useState):
- Spiral settings (type, fontSize, density)
- Abjad settings (color, size, word total)
- Animation settings (start, end, step, speed)
- Rose/trochoid specific settings
- Search/highlight state
- Zoom level

### Text Processing

- **Data Loading**: Fetched from `/public/quran.txt` in useEffect
- **Character limit**: Loads only first 10,000 characters for performance
- **Search/Highlight**: `cleanupHarakat()` removes diacritical marks for comparison
- **Word splitting**: Uses `/\s+/` regex to split text into words

### Animation System (Controls.tsx)

- Animation functions in Controls component
- Uses `setInterval` with refs for continuous animation loops
- Auto-reverses when reaching end values
- Separate controls for font size and spiral density animations
- Properly cleans up intervals on stop

### Export Functionality

- **SVG Export** (QuranVisualization.tsx:~240-320): Recreates visualization as SVG
  - Generates `<text>` elements with transforms for each word
  - Downloads as `quran_spiral.svg`
  - Note: SVG export supports basic spirals (logarithmic, archimedean, goldenMean, fibonacci)

### Legacy Code

The original vanilla JavaScript implementation has been moved to the `/legacy-vanilla-js` folder:
- **index.html, script.js, style.css, animation.js**: Original vanilla JS implementation
- **services.js**: Alternate SVG export with additional spiral types
- **qurantext.py**: Python Cairo implementation for static PNG generation
- This code is kept as a backup and reference but is not used by the Next.js app

## Key Implementation Details

### Client-Side Rendering

QuranVisualization is a client component (`'use client'`) because it:
- Uses canvas APIs
- Manages interactive state with hooks
- Uses browser-only APIs like fetch for local files

### Spiral Parameter Updates

Rose and trochoid spirals have dynamic settings:
- Settings apply immediately via React state updates
- Subdrawers conditionally rendered based on `spiralType` (Controls.tsx)
- Parameters stored in React state objects (roseSettings, trochoidSettings)
- Changing settings triggers automatic re-render via useEffect dependency array

### Font Requirements

The application requires "Noto Naskh Arabic" font:
- Loaded via Google Fonts in app/layout.tsx
- Applied to canvas via: `ctx.font = \`${fontSize}px "Noto Naskh Arabic"\``

### Reactive Updates

The useEffect dependency array in QuranVisualization.tsx triggers redraws when any of these change:
- quranText, spiralType, fontSize, spiralDensity
- abjadColorEnabled, abjadSizeEnabled, abjadWordTotalEnabled
- currentHighlightWord, zoomLevel
- roseSettings, trochoidSettings

### Performance Considerations

- Canvas redraws completely on each update (no partial rendering)
- Text limited to 10,000 characters to maintain performance
- Each word is drawn individually with transformations
- No memoization currently implemented (could optimize with useMemo for expensive calculations)

## Common Modifications

When adding new spiral types:
1. Add type to `SpiralType` union in `components/types.ts`
2. Add option to select in `Controls.tsx`
3. Implement coordinate calculation in `drawVisualization()` in `QuranVisualization.tsx`
4. Add same calculation to `saveSVG()` for export support
5. If custom parameters needed, create settings interface in `types.ts` and UI in `Controls.tsx`

When modifying Abjad system:
- Update `abjadMap` in `components/utils.ts`
- Consider impact on both color and size calculations
- Color distribution uses golden angle for aesthetic spacing

When adjusting performance:
- Modify character limit in useEffect fetch (QuranVisualization.tsx)
- Consider useMemo for expensive calculations
- Could implement canvas layering for static/dynamic content
- Text measurement is expensive; consider caching

When adding new features:
- Add state to QuranVisualization component
- Pass state and setters to Controls component
- Add to useEffect dependency array if it should trigger redraw
- Create UI controls in Controls.tsx
