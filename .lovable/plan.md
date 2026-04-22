

# Save user email on booking

## Change
Update the `INSERT` call in `src/pages/Booking.tsx` `handleConfirm` to include the authenticated user's email alongside the existing fields.

```ts
await supabase.from("bookings").insert({
  user_id: user.id,
  email: user.email,         // ← added
  service_id: serviceId,
  date: format(date, "yyyy-MM-dd"),
  time,
  status: "confirmed",
});
```

## Notes
- The `bookings.email` column already exists (nullable text) — no migration needed.
- RLS is unchanged: insert is still gated by `auth.uid() = user_id`.
- No other call sites insert into `bookings`, so this is a single-file edit.

