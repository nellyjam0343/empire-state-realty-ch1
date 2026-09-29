# CLAUDE.md

## Project
Empire State Realty — a story-driven study game for the New York real estate salesperson license. Players move through day-by-day scenes (Chapter 1: License Law) with narrator and character dialogue.

## Stack
- Static site: `index.html` + React via `empire-state-realty.jsx` (no build step)
- Deployed to GitHub Pages on every push to `main` (`.github/workflows/static.yml`)

## Layout
- `scenes.js` — all scene content (`window.ALL_SCENES`, keyed by chapter)
- `empire-state-realty.jsx` — game UI and logic
- `barber-app/` — a separate PWA (React, Supabase, service worker) kept in this repo

## Notes
- Scene content teaches real exam material — keep legal facts accurate.
- Merging to `main` publishes immediately.
