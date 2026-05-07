# IntelliMeet Frontend

Frontend for IntelliMeet — a realtime meeting and collaboration platform with AI summaries, live transcripts, recording, and workspace analytics.

Built with Next.js, TypeScript, WebRTC, and Socket.io.

---

# Features

## Authentication

* Google OAuth
* onboarding flow
* workspace setup
* profile sync

## Dashboard

* recent meetings
* upcoming meetings
* action items
* AI summaries
* workspace overview

## Live Meeting Room

* participant grid
* screen sharing
* recording controls
* live transcript
* rolling AI summary
* contextual AI chat
* realtime meeting updates

## Workspace

* members and teams
* permissions
* analytics
* productivity insights

---

# Tech Stack

## Frontend

* Next.js
* React
* TypeScript
* Tailwind CSS
* ShadCN UI
* Framer Motion

## Realtime

* WebRTC
* Socket.io
* MediaRecorder API

## Utilities

* Axios
* next-themes

---

# Architecture

Frontend handles:

* UI
* state
* realtime rendering
* interaction
* optimistic updates

Backend handles:

* business logic
* persistence
* AI processing
* authorization

---

# Performance

The frontend is optimized for realtime workloads and long meeting sessions.

Optimizations include:

* dynamic imports
* lazy-loaded components
* viewport-based rendering
* centralized animation management
* automatic event cleanup
* optimized realtime subscriptions
* virtualization for large lists
* bundle analysis and optimization

## Performance Stats

| Metric                        | Typical App | IntelliMeet |
| ----------------------------- | ----------- | ----------- |
| Main Bundle                   | ~400KB      | ~150KB      |
| Animation Overhead            | ~30ms/frame | <1ms        |
| FPS During Heavy UI           | 45–50 FPS   | 59–60 FPS   |
| Below-fold Initial Render     | ~2s         | ~800ms      |
| Long-session Memory Stability | unstable    | optimized   |

---

## Bundle Analyzer

Bundle analyzer is configured in the project for tracking large dependencies and bundle growth.

Run analyzer:

```bash id="zzh4wt"
pnpm next experimental-analyze
```

Generate static report:

```bash id="d9h7tp"
pnpm next experimental-analyze --output
```

---

# Important Hooks

## `useWebRTC`

Handles:

* peer connections
* media streams
* participant sync

## `useRecording`

Handles:

* MediaRecorder flow
* recording lifecycle
* recording state

## `useChunkUpload`

Handles:

* chunked uploads
* continuous upload flow

## `useTranscript`

Handles:

* live transcript updates
* rolling summary sync

---

# Project Structure

src/
│
├── app/
├── components/
├── hooks/
├── providers/
├── state/
├── lib/
├── config/
│
├── middleware.ts
└── instrumentation.ts

---

# Development

## Run Frontend

```bash id="pxhrrl"
pnpm --filter frontend dev
```

## Build Frontend

```bash id="0p6bzd"
pnpm --filter frontend build
```

---

# UI Direction

Interface design is inspired by:

* Linear
* Notion
* Slack
* Loom
* Google Meet

Focus areas:

* low friction
* fast interactions
* clean layouts
* minimal noise
* realtime responsiveness
