# Childhood Trauma Quiz Clone

A small React + Vite demo that recreates a quiz funnel for a "childhood pattern" or "childhood trauma" style assessment.

The app walks through:

- An intro / landing screen
- A 10-step guided quiz
- An email capture step
- A checkout-style paywall screen
- A final results screen with locally calculated profile output

This is a front-end demo only. No real email submission, backend persistence, or payment processing is connected.

## Tech Stack

- React 19
- Vite
- Tailwind CSS
- Framer Motion
- Lucide React

## Project Structure

```text
.
├── src/
│   ├── App.jsx
│   ├── main.jsx
│   ├── index.css
│   └── components/ui/
├── childhood_trauma_quiz_flow_clone.jsx
├── index.html
├── tailwind.config.js
├── vite.config.js
└── package.json
```

## How It Works

The main quiz experience lives in `childhood_trauma_quiz_flow_clone.jsx`.

It defines:

- The quiz step configuration
- Answer state and navigation
- Local scoring logic for four result patterns:
  - `abandonment`
  - `hypervigilance`
  - `emotionalNeglect`
  - `controlProtection`
- The fake checkout flow
- The final result rendering

`src/App.jsx` simply renders that main quiz component.

## Getting Started

### Prerequisites

- Node.js 18+ recommended
- npm

### Install dependencies

```bash
npm install
```

### Start the dev server

```bash
npm run dev
```

Then open the local URL shown by Vite, usually `http://localhost:5173`.

### Build for production

```bash
npm run build
```

### Preview the production build

```bash
npm run preview
```

## Available Scripts

- `npm run dev` starts the Vite development server
- `npm run build` creates a production build in `dist/`
- `npm run preview` serves the production build locally

## UI Notes

- Tailwind is configured in `tailwind.config.js`
- A Vite alias maps `@` to `src/`
- The app uses lightweight local UI primitives under `src/components/ui/`
- Styling tokens are defined in `src/index.css`

## Demo Limitations

This repo currently simulates a conversion funnel, but it does not include:

- Real authentication
- API calls
- Database storage
- Email delivery
- Stripe or other payment integration
- Analytics or event tracking

The email and payment inputs are local-only and used just to drive the demo flow.

## Notes

- `dist/` is already present in the repo, so a previous production build has been committed.
- `node_modules/` is also present in the repo currently, though in most projects it would be gitignored.

## Verification

The current project builds successfully with:

```bash
npm run build
```
