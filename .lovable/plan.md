

# Profile, AI Routine, Stripe Memberships, More Services

Building on the existing app — booking flow, webhook, dashboard, services and auth all stay intact. Five additive pieces.

## 1. More services (15+ across 5 categories)

Insert 5 additional rows into the existing `services` table (current 10 → 15+) so each category has at least 3:

- Hair: Express Blowout
- Skin: Hydrating Oxygen Facial
- Nails: Luxury Pedicure
- Makeup: Editorial Makeup
- Spa: Aromatherapy Massage

Existing UI auto-picks them up (Services landing + ServicesPage already fetch from DB).

## 2. Profile page (`/profile`)

New page wrapped in `ProtectedRoute`. Loads/saves the user's row in the existing `profiles` table (already has `skin_type`, `hair_type`, `concerns`, `allergies` columns + RLS).

Form fields:
- **Skin type** — Select (Normal, Dry, Oily, Combination, Sensitive)
- **Hair type** — Select (Straight, Wavy, Curly, Coily, Fine, Thick)
- **Concerns** — Textarea (free text, e.g. "acne, dark spots")
- **Allergies** — Textarea (free text)

Behavior: upserts into `profiles` keyed on `id = auth.uid()`. Loading state, success toast. Existing RLS already enforces own-row only.

## 3. AI Beauty Routine (on profile page)

A "Generate My Routine" card at the bottom of the profile page.

- New edge function `generate-routine` calls Lovable AI Gateway (`google/gemini-3-flash-preview`) — `LOVABLE_API_KEY` already configured.
- Server-side validates JWT, reads the caller's profile via service role, sends a structured prompt and returns `{ morning: string[], evening: string[], notes: string }` via tool calling.
- Frontend displays in a styled card (gold accents, two columns: Morning / Evening).
- Loading spinner; handles 429/402 with friendly toasts.

## 4. Dashboard upgrade — past + upcoming bookings

Update `Dashboard.tsx`:
- Two sections: **Upcoming** (`date >= today`, asc) and **Past** (`date < today`, desc, limit 10).
- Each item shows service name, category, date, time, price, status. Cancel button only on upcoming.
- Skeleton loading; empty states for both.

## 5. Stripe Checkout — Monthly membership

Added to `/pricing` (existing `Membership.tsx` cards). Each plan card gets a "Subscribe" button.

- New edge function `create-checkout` (Supabase, public, CORS) using Stripe SDK (`stripe@14`).
  - Validates JWT, creates a Stripe Checkout Session in `subscription` mode with the user's email.
  - `success_url: {origin}/billing-success?session_id={CHECKOUT_SESSION_ID}`
  - `cancel_url: {origin}/pricing`
- Two new pages:
  - `/billing-success` — verifies the session via a `verify-checkout` edge function and shows a confirmation card with subscription details + link to dashboard.
- Stripe **TEST** secret key stored as Supabase secret `STRIPE_SECRET_KEY` (you'll be asked to paste it).
- Membership tier IDs/prices defined in the edge function (no DB changes for v1).

## 6. Navigation update

Add **Profile** link to the Navbar dropdown (desktop) and mobile sheet, between Dashboard and Sign Out. Existing links (Home, Services, Book, Dashboard, Sign Out) stay.

## What stays untouched

- `/booking` flow — services dropdown → date → time → insert into `bookings` → n8n webhook fire-and-forget → redirect to `/dashboard`.
- Existing RLS policies on `bookings` and `profiles` (already correct).
- Auth (email/password + Google) — already implemented in `Auth.tsx`.
- All existing UI, design tokens, gold theme.

## Order of operations

1. Migration: insert 5 new services (no schema change).
2. Build Profile page + route + Navbar link.
3. Build `generate-routine` edge function + UI card.
4. Refactor Dashboard for upcoming/past split.
5. Ask you for `STRIPE_SECRET_KEY`, then build `create-checkout` + `verify-checkout` edge functions, billing-success page, wire Subscribe buttons.

## Technical notes

- Stripe: edge function uses `import Stripe from "https://esm.sh/stripe@14.21.0?target=deno"`. JWT verified via `supabase.auth.getClaims(token)`. Session created with `mode: "subscription"`, `customer_email: claims.email`, `line_items: [{ price_data: {...}, quantity: 1 }]` for one-off pricing OR `price: "price_xxx"` if you create products in Stripe dashboard first (v1 uses inline `price_data` so no Stripe dashboard setup needed).
- AI routine: uses tool-calling for guaranteed JSON shape; system prompt instructs model to respect `allergies` (avoid recommending products containing them) and tailor to `skin_type`/`hair_type`/`concerns`.
- Profile upsert: `supabase.from("profiles").upsert({ id: user.id, ...form })` — `profiles.id` is PK with RLS `auth.uid() = id`.
- No package installs needed — Stripe and AI Gateway are called from edge functions only.

