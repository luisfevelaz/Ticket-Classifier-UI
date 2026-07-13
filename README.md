# Ticket Triage UI

A Next.js frontend for the [Ticket Classifier API](link-to-server-repo) — lets a support agent paste raw ticket text and get an instant, structured triage result.

## Design

Built as a "triage console" rather than a marketing page — dark, data-dense, and fast to scan. Urgency is surfaced through a color-coded stripe (red/amber/green) on the result card, so severity is visible at a glance without reading the full response.

## Stack

- Next.js (App Router)
- TypeScript
- Tailwind CSS
- Space Grotesk (display) + JetBrains Mono (data/body)

## Running locally

Requires the [ticket-classifier-server](link-to-server-repo) running on `localhost:8000`.

\`\`\`bash
npm install
npm run dev
\`\`\`

Then open http://localhost:3000.