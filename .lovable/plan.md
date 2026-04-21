

# Add Authentication with Email/Password + Google

A premium dark-themed auth flow using Supabase, with login, signup, and a protected dashboard.

## Pages & Components

1. **`/auth` — Combined Login / Sign Up page**
   - Dark background with subtle gold accents matching Lumière brand (Playfair headings, gold buttons)
   - Toggle between "Sign In" and "Create Account" tabs
   - Email + password fields (with show/hide password toggle)
   - "Continue with Google" button (with Google icon, outlined gold style)
   - Elegant divider between OAuth and email form
   - Error/success toasts via existing `sonner`
   - Link back to home

2. **`/dashboard` — Protected member area**
   - Welcome header with user's email
   - Placeholder cards: Upcoming Bookings, Membership Status, Recommended Services
   - Sign Out button in the top right
   - Redirects unauthenticated users to `/auth`

3. **`AuthProvider` context (`src/contexts/AuthContext.tsx`)**
   - Wraps the app, exposes `user`, `session`, `loading`, `signOut`
   - Sets up `onAuthStateChange` listener BEFORE calling `getSession()` (per Supabase best practice)
   - Used by `ProtectedRoute` and Navbar

4. **`ProtectedRoute` wrapper**
   - Redirects to `/auth` if no session
   - Shows loading state while session resolves

5. **Navbar updates**
   - "Sign In" link → `/auth` (instead of `/booking`)
   - When logged in: replace "Sign In" with "Dashboard" + avatar/email dropdown with Sign Out

## Auth Flow

- **Email/Password Sign Up**: `supabase.auth.signUp()` with `emailRedirectTo: ${window.location.origin}/dashboard`
- **Email/Password Sign In**: `supabase.auth.signInWithPassword()` → redirect to `/dashboard`
- **Google OAuth**: `supabase.auth.signInWithOAuth({ provider: 'google', options: { redirectTo: ${window.location.origin}/dashboard } })`
- **Sign Out**: `supabase.auth.signOut()` → redirect to `/`
- Friendly error messages for common cases (invalid credentials, user already exists, weak password)

## Decision: User Profiles

For now, **no profiles table** — we'll rely on Supabase's built-in `auth.users` (email is enough for the dashboard greeting). A profiles table can be added later when we need display names, avatars, roles, etc.

## Routing (`App.tsx`)

```text
/              Index (public)
/services      ServicesPage (public)
/pricing       Pricing (public)
/booking       Booking (public for now)
/auth          Auth page (public)
/dashboard     Dashboard (protected)
```

Wrap `<Routes>` with `<AuthProvider>`.

## Google OAuth Setup (manual step for the user)

Lovable can wire the code, but Google OAuth requires configuration in the Supabase dashboard:

1. Create OAuth credentials in Google Cloud Console (Web application type)
2. Add authorized redirect URL: `https://hfoqdresdyureziejvdc.supabase.co/auth/v1/callback`
3. In Supabase Dashboard → Authentication → Providers → Google: enable + paste Client ID and Secret
4. In Supabase Dashboard → Authentication → URL Configuration: set Site URL to the preview/published URL and add `/dashboard` to redirect allow-list

I'll include a clear note in the chat with these steps and dashboard links after building.

## Notes

- Email confirmation: by default Supabase requires email confirmation. For smoother testing, the user can disable "Confirm email" in Supabase Auth settings — I'll mention this.
- All UI uses existing design tokens (`bg-gold`, `shadow-gold`, `font-serif`, `gradient-surface`) for consistency.
- No new dependencies needed — `@supabase/supabase-js` is already installed.

