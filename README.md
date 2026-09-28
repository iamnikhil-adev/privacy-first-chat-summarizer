# Privacy-First AI Group Chat Summarizer

A portfolio-quality full-stack prototype inspired by WhatsApp group chat overload. The product focuses on one job: help someone catch up on unread messages in large groups, high-activity groups, and communities without pretending that private 1-to-1 chats belong in the same flow.

## Problem

High-volume group chats bury the few updates that actually matter. Users come back to dozens of unread messages, lose time scanning for decisions and action items, and often reply late because context gathering is expensive.

## Solution

This prototype gives the user a WhatsApp-inspired group chat UI and a user-triggered `Summarize unread` action. The summary is concise and structured around:

- key updates
- decisions
- action items
- who said what only when important

Users can scope the summary to the last X unread messages or a time window like the last 1 hour, last 3 hours, or since last seen. Nothing runs in the background.

## v1 Scope

- Supported: large groups, high-activity groups, communities
- Excluded: private 1-to-1 chats in both UI and API logic
- Privacy framing: transparent demo-only `On-device mode (simulated)` toggle

## Architecture

- `app/`
  Next.js App Router pages, loading/error states, and API routes
- `components/`
  Recruiter-facing UI modules for the chat shell, summary panel, sidebar, and dashboard cards
- `lib/`
  Shared types, formatting helpers, Prisma-first data access, fallback in-memory demo store, and OpenAI summarization logic
- `prisma/`
  PostgreSQL schema and seed script

### Request flow

1. The user chooses a supported group/community chat.
2. The user selects a summary range.
3. `POST /api/summaries` validates the request with Zod.
4. The route fetches only the unread slice for that chat.
5. The app requests a structured summary from the OpenAI API when `OPENAI_API_KEY` is present.
6. If no API key or database is available, the prototype falls back to seeded demo behavior so the app remains runnable.
7. Feedback is captured through `POST /api/feedback`.

## Privacy constraints

- User-triggered summaries only
- No background summarization
- `On-device mode (simulated)` is clearly labeled as a demo affordance
- The UI explicitly says direct messages are out of scope
- The prototype is transparent about using seeded demo data or local PostgreSQL storage

## Metrics tracked

- Summary usage rate
- Repeat usage rate
- Estimated time saved
- Post-summary reply rate
- Opt-out rate
- Privacy complaints count
- Average summary latency

## Data model

Prisma models:

- `Chat`
- `Message`
- `Summary`
- `Feedback`

Additional fields support demo metrics such as chat opt-out state, latency, simulated on-device labeling, and privacy complaint flags.

# Local Setup

## Prerequisites

- Node.js 20+
- npm
- Git
- A PostgreSQL database
  - Recommended: Neon
- OpenAI API key (optional)

## 1. Clone the repository

git clone ...
cd privacy-first-chat-summarizer

## 2. Install dependencies

npm install

## 3. Create your environment file

Copy `.env.example` to `.env`.

Configure:

DATABASE_URL="your PostgreSQL connection string"
OPENAI_API_KEY="optional"
OPENAI_MODEL="gpt-4.1-mini"

## 4. Configure PostgreSQL

Recommended: create a free Neon PostgreSQL project.

Neon Console → Connect → PostgreSQL → copy connection string.

Paste it into DATABASE_URL.

## 5. Generate Prisma Client

npm run prisma:generate

## 6. Create database tables

npm run prisma:migrate -- --name init

## 7. Seed demo data

npm run seed

## 8. Start development server

npm run dev

Open:

http://localhost:3000

## Notes

- The prototype is designed to stay usable even before PostgreSQL or `OPENAI_API_KEY` are configured by falling back to seeded in-memory demo data.
- Recruiter-facing polish is intentional: the UI is built to explain scope, privacy posture, and product metrics quickly.
