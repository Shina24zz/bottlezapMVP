# BottleZap

Irish web app connecting businesses with empty deposit-return bottles to collectors who bring them to a DRS point (€0.15 per bottle).

**Stack:** Next.js 15 (App Router), Tailwind CSS, Supabase (auth + Postgres), Resend (email), Google Maps JavaScript API (`@vis.gl/react-google-maps`), deployable on Vercel.

## Setup

1. **Clone and install**

   ```bash
   cd bottlezap
   npm install
   ```

2. **Supabase**

   - Create a project at [supabase.com](https://supabase.com).
   - In the SQL Editor, run the contents of `supabase/schema.sql`.
   - Under Authentication → Providers, enable Email.
   - For development, under Authentication → Email, you may disable “Confirm email” so sign-in works immediately.

3. **Environment**

   Copy `.env.example` to `.env.local` and fill in:

   - `NEXT_PUBLIC_SUPABASE_URL`, `NEXT_PUBLIC_SUPABASE_ANON_KEY` from Project Settings → API.
   - `NEXT_PUBLIC_GOOGLE_MAPS_API_KEY` with **Maps JavaScript API** and **Geocoding API** enabled for the same key in Google Cloud Console.
   - `RESEND_API_KEY` from [Resend](https://resend.com) (claim emails are skipped if missing).
   - Optionally `RESEND_FROM_EMAIL` (verified domain in Resend; otherwise Resend’s test sender works for development).

4. **Run**

   ```bash
   npm run dev
   ```

   Open [http://localhost:3000](http://localhost:3000).

## Deploy (Vercel)

Add the same environment variables in the Vercel project settings. Connect the Git repo and deploy; no extra config is required for a standard Next.js app.

## Roles

- **Business:** posts listings (geocoded address), sees own listings, marks completed.
- **Collector:** map + list of active listings, claims a pickup; business gets an email via Resend.

## Legal / product note

BottleZap is a demo-style marketplace. DRS rules, operator terms, and liability for transport and return are your responsibility in production.
