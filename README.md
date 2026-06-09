# TDC Matchmaker

Internal matchmaking dashboard for **The Date Crew** — helping matchmakers find compatible profiles for premium clients.

**Live demo:** [your-live-link](https://your-live-link)

## Login credentials

| Field    | Value                |
| -------- | -------------------- |
| Email    | `matchmaker@tdc.com` |
| Password | `tdc2024`            |

## Tech stack

- **Next.js 16** (App Router, React 19, TypeScript)
- **Tailwind CSS 4** for styling
- **Firebase** — Authentication (email/password) + Firestore (client notes)
- **Anthropic Claude API** — server-side AI compatibility notes (`claude-sonnet-4-20250514`)

## How it works

### Architecture & tech choices

TDC Matchmaker is built as a full-stack Next.js application with no separate backend server. Firebase handles authentication and persistent notes storage, keeping infrastructure minimal for an internal tool. Tailwind CSS powers a warm, card-based UI tuned for human matchmakers rather than raw data tables. The Anthropic Claude API is called exclusively from a Next.js API route (`/api/generate-intro`), so the API key never reaches the browser.

### Matching logic

The matching engine (`src/lib/matchingEngine.ts`) scores up to 100 points per candidate using gender-specific weights informed by Indian matrimonial research. For **male customers**, the engine prioritises a woman 2–7 years younger (20 pts), aligned kids preferences (20 pts), income where she earns less or equal (15 pts), language overlap (up to 15 pts), height difference (10 pts), religion (10 pts), and diet (10 pts). For **female customers**, relocation alignment is weighted highest (20 pts), followed by family type (15 pts), age where the man is same age or up to 8 years older (15 pts), kids (15 pts), language (up to 15 pts), income where he earns same or more (10 pts), and religion (10 pts). Candidates are filtered by opposite gender and non-matched status, scored, ranked, and the top 10 are returned with a per-dimension breakdown.

### AI usage

When a matchmaker clicks **Generate AI note**, the app sends both profiles and the compatibility score to Claude (`claude-sonnet-4-20250514`). The model returns a warm, 2–3 sentence note referencing real shared traits (diet, city, family values, career). The note appears on the match card and in the send-match modal. If the API key is missing or the request fails, the app falls back to algorithmic copy derived from the score breakdown.

## Assumptions

- Matchmakers authenticate with a single shared demo account; production would use role-based access per operator.
- The candidate pool (`pool.json`) is static seed data; real deployments would sync from a CRM or member database.
- Sending a match is simulated via toast — no email or WhatsApp integration is wired up.
- Income, age, and religion preferences reflect common Indian matrimonial norms but are simplified heuristics, not client-specific filters.
- Profile photos are represented by initials avatars; no image upload or storage is implemented.
- Firestore stores only per-client notes; match history and audit logs are out of scope.


