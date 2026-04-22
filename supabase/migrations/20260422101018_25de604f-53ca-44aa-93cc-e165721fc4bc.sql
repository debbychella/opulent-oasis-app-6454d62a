-- ============ BOOKINGS schema fixes ============
-- Backfill nulls defensively (table is empty but be safe)
DELETE FROM public.bookings WHERE user_id IS NULL OR service_id IS NULL OR date IS NULL OR time IS NULL;

ALTER TABLE public.bookings
  ALTER COLUMN user_id SET NOT NULL,
  ALTER COLUMN service_id SET NOT NULL,
  ALTER COLUMN date SET NOT NULL,
  ALTER COLUMN time SET NOT NULL,
  ALTER COLUMN status SET NOT NULL,
  ALTER COLUMN status SET DEFAULT 'confirmed';

-- Prevent double booking
ALTER TABLE public.bookings
  ADD CONSTRAINT bookings_unique_slot UNIQUE (service_id, date, time);

-- ============ RLS: services (public read) ============
ALTER TABLE public.services ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Services are viewable by everyone"
  ON public.services FOR SELECT
  USING (true);

-- ============ RLS: bookings (owner-only) ============
ALTER TABLE public.bookings ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view their own bookings"
  ON public.bookings FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Users can create their own bookings"
  ON public.bookings FOR INSERT
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own bookings"
  ON public.bookings FOR UPDATE
  USING (auth.uid() = user_id);

CREATE POLICY "Users can delete their own bookings"
  ON public.bookings FOR DELETE
  USING (auth.uid() = user_id);

-- ============ RLS: profiles (owner-only) ============
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view their own profile"
  ON public.profiles FOR SELECT
  USING (auth.uid() = id);

CREATE POLICY "Users can insert their own profile"
  ON public.profiles FOR INSERT
  WITH CHECK (auth.uid() = id);

CREATE POLICY "Users can update their own profile"
  ON public.profiles FOR UPDATE
  USING (auth.uid() = id);

-- Auto-create profile on signup
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  INSERT INTO public.profiles (id, email)
  VALUES (NEW.id, NEW.email)
  ON CONFLICT (id) DO NOTHING;
  RETURN NEW;
END;
$$;

DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- ============ Seed services ============
INSERT INTO public.services (name, category, price, duration) VALUES
  ('Signature Cut & Style', 'Hair', 120, '60 min'),
  ('Luxury Color & Gloss', 'Hair', 220, '120 min'),
  ('Radiance Facial', 'Skin', 180, '75 min'),
  ('Anti-Aging Ritual', 'Skin', 260, '90 min'),
  ('Classic Manicure', 'Nails', 55, '45 min'),
  ('Deluxe Pedicure', 'Nails', 85, '60 min'),
  ('Editorial Makeup', 'Makeup', 150, '60 min'),
  ('Bridal Makeup', 'Makeup', 320, '90 min'),
  ('Aromatherapy Massage', 'Spa', 190, '75 min'),
  ('Hot Stone Ritual', 'Spa', 230, '90 min');
