# IntellMeet Dashboard

Main application dashboard for the IntellMeet platform.

Built with React, Vite, TypeScript, and modern real-time technologies.

The dashboard provides workspace management, meeting collaboration, AI-powered meeting intelligence, recordings, transcripts, action items, and organizational knowledge management.

---

# About

IntellMeet Dashboard is the core application experience where users create workspaces, manage meetings, collaborate with teams, and access AI-powered meeting insights.

Unlike traditional meeting platforms, IntellMeet focuses on transforming conversations into searchable, actionable, and persistent knowledge.

---

# Core Features

## Workspace Management

* Multi-workspace support
* Team management
* Role-based access
* Organization settings

## Meeting Management

* Create meetings
* Schedule meetings
* Join meetings
* Meeting history
* Meeting analytics

## Real-Time Collaboration

* Live meeting participation
* Real-time updates
* Team collaboration
* Shared meeting context

## AI Meeting Intelligence

* AI-generated summaries
* Action item extraction
* Meeting insights
* Smart recommendations

## Meeting Memory

* Searchable transcripts
* Meeting archives
* Historical context
* Knowledge retrieval

## User Management

* Google OAuth authentication
* Profile management
* Workspace onboarding
* Account settings

---

# Tech Stack

## Core

* React
* TypeScript
* Vite

## State Management

* Zustand
* React Query

## Routing

* React Router

## UI

* Tailwind CSS
* Radix UI
* Lucide React

## Forms & Validation

* React Hook Form
* Zod

## Realtime

* Socket.io Client
* LiveKit Client

## Visualization

* Recharts

## Utilities

* Axios
* Date-fns

---

# Application Modules

## Dashboard

* Workspace overview
* Recent activity
* Team insights
* Meeting statistics

## Meetings

* Upcoming meetings
* Past meetings
* Meeting details
* Recordings

## AI Workspace

* Meeting summaries
* Action items
* AI insights
* Meeting memory

## Team Management

* Members
* Roles
* Permissions
* Workspace settings

## Profile

* User preferences
* Security settings
* Account management

---

# Project Structure

```text
src/
│
├── app/
├── pages/
├── routes/
├── components/
├── features/
│   ├── auth/
│   ├── meetings/
│   ├── workspace/
│   ├── ai/
│   └── analytics/
│
├── hooks/
├── store/
├── services/
├── lib/
├── types/
├── assets/
└── styles/
```

---

# Development Setup

## Requirements

* Node.js 18+
* pnpm 9+

## Install

```bash
pnpm install
```

## Development

```bash
pnpm dev
```

## Build

```bash
pnpm build
```

## Preview

```bash
pnpm preview
```

---

# Design Principles

The dashboard is built around:

* Fast user experience
* Real-time responsiveness
* Scalable architecture
* Reusable components
* Type-safe development
* Accessibility standards
* Performance-first rendering

---

# User Flow

```text
Login
↓
Workspace Selection
↓
Dashboard
↓
Meetings
↓
AI Processing
↓
Meeting Memory
↓
Insights & Actions
```

---

# Vision

The IntellMeet Dashboard is designed to become the central operating system for organizational communication.

Every meeting should produce knowledge.

Every decision should remain discoverable.

Every conversation should create value beyond the moment it happens.

---

# Status

Active Development

Built using React, Vite, TypeScript, and modern web technologies with a focus on performance, scalability, and real-time collaboration.
