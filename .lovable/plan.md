

# Complete Booking System

Extend the existing app with a working booking flow, dynamic services with real images, and a live dashboard — all backed by Supabase RLS.

## 1. Database (migration)

**Seed `services` table** (currently empty) with 10 rows across the 5 existing categories (Hair, Skin, Nails, Makeup, Spa) — each with name, category, price, duration.

**Add RLS policies** (currently missing on all 3 tables):

- `services` — public `SELECT` (anyone can browse).
- `bookings` — `SELECT`, `INSERT`, `UPDATE`, `DELETE` restricted to `auth.uid() = user_id`.
- `profiles` — `SELECT`/`UPDATE` restricted to `auth.uid() = id`.

**Schema fixes on `bookings`**:
- Make `user_id`, `service_id`, `date`, `time`, `status` `NOT NULL` (required for RLS to be safe).
- Add `UNIQUE (service_id, date, time)` constraint to prevent double-booking the same slot.

## 2. Services — dynamic + real images

- Add real high-quality images to `src/assets/` for each of the 5 categories (hair, skin, nails, makeup, spa) — generated to match the dark luxury aesthetic.
- Update `src/components/landing/Services.tsx` to **fetch services from Supabase** and group them by category. Keep current card design; add the category image as a subtle background/top visual on each card. Each card links to `/booking?service={id}`.
- Update `src/pages/ServicesPage.tsx` to list all individual services (grouped by category) pulled from the DB, each with a "Book" button → `/booking?service={id}`.

## 3. Booking page (`/pages/Booking.tsx`)

Replace the "coming soon" placeholder with a real 3-step flow (single page, sectioned):

1. **Select service** — dropdown/grid of services from DB (preselected if `?service=` query param present).
2. **Choose date** — shadcn `Calendar` (date-fns), disables past dates.
3. **Choose time** — fixed time slots (e.g. 10:00, 11:00, 13:00, 14:00, 15:00, 16:00, 17:00). Already-booked slots for the chosen service+date are fetched and disabled.
4. **Confirm booking** — gold CTA button, calls `INSERT` into `bookings` with `user_id = auth.user.id`, `status = 'confirmed'`.

Behavior:
- Wrap route in `<ProtectedRoute>` so unauthenticated users are redirected to `/auth`.
- Loading state while fetching services / submitting.
- Success: `sonner` toast "Booking confirmed" → redirect to `/dashboard`.
- Duplicate prevention: rely on the unique constraint; catch error and show "This slot was just taken" toast.
- Friendly error messages.

## 4. Dashboard — real bookings

Update `src/pages/Dashboard.tsx`:
- Replace static "Upcoming Bookings" card with a **live list** of the user's future bookings (joined with service name, category, price).
- Show booking date, time, service, status. Empty state with "Book your first session" CTA.
- Loading skeleton while fetching.
- Cancel button per booking (deletes row, RLS-protected).

Keep the other two cards (Membership, Recommended) as-is for now.

## 5. Navigation wiring

Already correct: Hero "Book Now", CallToAction, Navbar all point to `/booking`. Service cards on landing + services page will additionally pass `?service={id}` to preselect.

## Technical notes

- Use existing `supabase` client from `@/integrations/supabase/client`.
- Use existing `useAuth()` for user id.
- No new dependencies — `date-fns`, shadcn `Calendar`, `Select`, `Card`, `Button`, `sonner` already available.
- Time slots are a static const array; no separate availability table needed for v1.

