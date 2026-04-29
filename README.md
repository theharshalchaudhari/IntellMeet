# IntellMeet

AI-powered smart meeting workspace built for teams, startups, colleges, and organizations.

IntellMeet combines live meetings, browser-based recording, real-time transcripts, rolling summaries, AI-generated action items, searchable meeting memory, and workspace collaboration into one system.

The goal is simple:

**Turn meetings from forgotten conversations into searchable decision systems.**

---

# Core Idea

Most meeting tools stop at video calling.

IntellMeet goes further:

* Live meetings with WebRTC
* Host-side browser recording
* 30-second chunk upload system
* Continuous transcript generation
* Rolling AI summaries during the meeting
* Action item extraction
* Contextual AI chat for current + past meetings
* Workspace collaboration and analytics
* Google Drive integration for storage

This is not just a meeting app.

This is a meeting intelligence platform.

---

# Tech Stack

## Frontend

* Next.js
* TypeScript
* React
* Tailwind CSS
* ShadCN UI
* Socket.io Client
* WebRTC
* MediaRecorder API
* Google OAuth

## Backend

* Node.js
* Express.js
* TypeScript
* MongoDB
* Redis (ioredis)
* Socket.io
* Google Drive API
* NVIDIA NIM APIs
* OpenRouter APIs
* Axios
* Multer
* Cloudinary
* JWT

## Infrastructure

* TurboRepo
* pnpm Workspaces
* Docker
* Kubernetes (future scale)
* GitHub Actions

---

# Recording Architecture

## Final Production MVP Decision

### Host-side Browser Recording + 30s Chunk Upload + Continuous Processing

We do **not** use heavy server-side recording infra in phase 1.

We use:

* Browser MediaRecorder API
* Only host records
* Recording split into 30-second chunks
* Continuous upload while meeting runs
* Google Drive storage
* Parallel transcript + summary processing

This gives:

* free and scalable architecture
* safer long meetings
* no duplicate recordings
* autosave reliability
* rolling live intelligence

---

# Recording Flow

```text
Meeting Running
↓
Host starts recording
↓
Browser captures mic + webcam + screen share
↓
30 second chunk generated
↓
Chunk uploaded to backend
↓
Chunk stored in Google Drive
↓
Chunk transcribed
↓
Master transcript updated
↓
Rolling summary updated
↓
Action items updated
↓
Chat context updated
↓
Repeat continuously
```

---

# Project Structure

```text
intellmeet/
│
├── apps/
│   ├── frontend/
│   └── backend/
│
├── packages/
│   ├── ui/
│   ├── types/
│   ├── eslint-config/
│   └── typescript-config/
│
├── infrastructure/
│   ├── docker/
│   ├── kubernetes/
│   └── monitoring/
│
├── docs/
├── .github/
│   └── workflows/
│
├── turbo.json
├── pnpm-workspace.yaml
├── pnpm-lock.yaml
├── package.json
└── README.md
```

---

# Authentication

## Google OAuth Only

No traditional login/register forms.

### User Flow

```text
Landing Page
↓
Sign Up with Google
↓
If existing user → Dashboard
↓
If new user → Onboarding
```

### New User Onboarding

* auto-fetched Google profile
* name
* email
* profile image
* phone number
* clear visible face image upload
* workspace setup

This reduces friction and improves trust.

---

# Development Setup

## Requirements

* Node.js 18+
* pnpm 9+
* MongoDB
* Redis
* Google Cloud credentials
* NVIDIA NIM API access
* OpenRouter API key

---

# Install

## Clone

```bash
git clone https://github.com/theharshalchaudhari/IntellMeet
cd intellmeet
```

## Install dependencies

```bash
pnpm install
```

## Run development

```bash
pnpm dev
```

---

# Monorepo Rules

## Only one lockfile

```text
/pnpm-lock.yaml
```

Never create:

```text
apps/frontend/pnpm-lock.yaml
apps/backend/pnpm-lock.yaml
```

## Root controls versions

Use:

```bash
pnpm add -w
```

for shared tooling.

Use:

```bash
pnpm --filter frontend add <package>
pnpm --filter backend add <package>
```

for app-specific dependencies.

---

# Development Order

## Phase 1

* backend core setup
* database
* auth

## Phase 2

* meeting creation
* WebRTC
* Socket.io

## Phase 3

* recording pipeline
* chunk upload
* Google Drive storage

## Phase 4

* transcript generation
* rolling summary
* AI extraction

## Phase 5

* contextual AI chat
* searchable meeting memory
* analytics

---

# Engineering Principles

* clean modular code
* one source of truth
* root-controlled versions
* semantic commits
* feature branches
* no committed secrets
* scalable architecture first
* product over premature complexity

We optimize for:

**clarity → reliability → scale**

---

# Vision

Meetings should not disappear.

Every discussion should become:

* searchable
* actionable
* accountable
* intelligent

That is what IntellMeet is built for.

---

# Status

Currently in active development.

Architecture is finalized.
Core system implementation in progress.

Phase 1 foundation complete.
