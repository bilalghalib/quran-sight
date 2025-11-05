# Quran Sight

A visual exploration tool for the Quran using various spiral patterns. Built with Next.js and TypeScript.

## Features

- Multiple spiral patterns (Logarithmic, Archimedean, Golden Mean, Fibonacci, Rose, Epitrochoid, Hypotrochoid)
- Abjad numerology visualization (color and size mapping)
- Word search and highlighting
- Interactive animations
- SVG export functionality
- Zoom controls

## Getting Started

First, install the dependencies:

```bash
npm install
```

Then, run the development server:

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

## Building for Production

```bash
npm run build
```

This will create a static export in the `out` directory.

## Deploying to Vercel

The easiest way to deploy this app is to use the [Vercel Platform](https://vercel.com):

1. Push your code to a Git repository (GitHub, GitLab, or Bitbucket)
2. Import your repository to Vercel
3. Vercel will automatically detect Next.js and deploy your application

Alternatively, you can deploy using the Vercel CLI:

```bash
npm install -g vercel
vercel
```

## Project Structure

- `/app` - Next.js app router pages and layouts
- `/components` - React components (QuranVisualization, Controls, utilities)
- `/public` - Static assets (quran.txt)

## Legacy Version

The original vanilla JavaScript version has been moved to the `legacy-vanilla-js/` folder as a backup. See that folder's README for instructions on running the original version.
