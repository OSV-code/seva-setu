# Seva Setu (Phase 1 Clickable Prototype)

Seva Setu helps customers book at-home pathology sample collection and receive digital reports.

This implementation follows Phase 1 from `seva-setu-roadmap.md`:
- Landing page and package discovery
- Booking flow with date/time slot selection
- Simple customer identity via name + phone
- My Bookings view with status badge
- Admin console for manual status updates, lab assignment, and report upload

## Tech Stack

- Next.js (App Router) + React + TypeScript
- Tailwind CSS
- Supabase schema and env setup included for DB rollout
- Local browser storage is used for prototype data persistence in Phase 1 demo mode

## Run Locally

1. Install dependencies:
	```bash
	npm install
	```

2. Create local env file:
	```bash
	cp .env.example .env.local
	```

3. Start development server:
	```bash
	npm run dev
	```

4. Open http://localhost:3000

## Admin Access

- Go to `/admin`
- Default password: `seva123`
- Override via `NEXT_PUBLIC_ADMIN_PASSWORD` in `.env.local`

## Supabase Setup

- Schema SQL is available at `supabase/schema.sql`
- Add credentials in `.env.local`:
  - `NEXT_PUBLIC_SUPABASE_URL`
  - `NEXT_PUBLIC_SUPABASE_ANON_KEY`

## Phase 1 Notes

- Booking status transitions are centralized in `lib/domain.ts`
- Status update path intentionally stays manual/admin-driven for early validation
- Report upload stores file payload in browser storage for demo purposes
