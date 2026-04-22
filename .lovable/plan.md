

# Send Booking Webhook to n8n

After a booking is successfully inserted into Supabase, fire a POST to the n8n webhook with the booking details. Failures are swallowed so the user flow is never blocked.

## Approach

Direct client-side `fetch` from `Booking.tsx` after the successful insert. Simple, no edge function needed since the webhook URL is public and the payload contains no secrets.

## Change (single file: `src/pages/Booking.tsx`)

In `handleConfirm`, after the `supabase.from("bookings").insert(...)` succeeds (and before `navigate("/dashboard")`), add a fire-and-forget webhook call.

```ts
// After successful insert, before navigate
const webhookPayload = {
  service_name: selectedService?.name,
  booking_date: format(date, "yyyy-MM-dd"),       // YYYY-MM-DD
  booking_time: format(
    new Date(`2000-01-01T${time}:00`),
    "hh:mm a"
  ).toUpperCase(),                                 // e.g. "02:00 PM"
  user_email: user.email,
};

// Fire-and-forget — never block or surface errors to the user
fetch("https://debbyodion.app.n8n.cloud/webhook/booking-confirmation", {
  method: "POST",
  headers: { "Content-Type": "application/json" },
  body: JSON.stringify(webhookPayload),
}).catch((err) => console.warn("Webhook failed (non-blocking):", err));

toast.success("Booking confirmed");
navigate("/dashboard");
```

## Why this is safe

- **Non-blocking**: no `await`, errors caught and only logged to console — booking flow continues regardless.
- **Format compliance**: `booking_date` uses `yyyy-MM-dd`; `booking_time` formatted as `HH:MM AM/PM` via `date-fns`.
- **Auth**: the existing `ProtectedRoute` wrapper around `/booking` already guarantees `user` is present.
- **Double-booking**: already prevented by the `UNIQUE(service_id, date, time)` DB constraint + the existing `bookedTimes` slot filter — no changes needed.
- **UI unchanged**: existing loading state (`submitting`) and success toast remain as-is.
- **Navigation unchanged**: all "Book Now" CTAs and service cards already route to `/booking` (with `?service=` preselect) — verified in prior implementation.

## Out of scope

- No edge function (URL is public, payload non-sensitive).
- No DB migration.
- No UI redesign.
- No new dependencies (`date-fns` already used).

