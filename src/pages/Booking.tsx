import { useEffect, useMemo, useState } from "react";
import { Link, useNavigate, useSearchParams } from "react-router-dom";
import { format } from "date-fns";
import { CalendarIcon, Loader2 } from "lucide-react";
import { toast } from "sonner";
import { cn } from "@/lib/utils";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Skeleton } from "@/components/ui/skeleton";

const TIME_SLOTS = ["10:00", "11:00", "13:00", "14:00", "15:00", "16:00", "17:00"];

type Service = {
  id: string;
  name: string | null;
  category: string | null;
  price: number | null;
  duration: string | null;
};

const Booking = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();

  const [services, setServices] = useState<Service[]>([]);
  const [loadingServices, setLoadingServices] = useState(true);
  const [serviceId, setServiceId] = useState<string>(searchParams.get("service") ?? "");
  const [date, setDate] = useState<Date | undefined>();
  const [time, setTime] = useState<string>("");
  const [bookedTimes, setBookedTimes] = useState<string[]>([]);
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    supabase
      .from("services")
      .select("id, name, category, price, duration")
      .order("category")
      .then(({ data }) => {
        setServices(data ?? []);
        setLoadingServices(false);
      });
  }, []);

  // Fetch already-booked slots for chosen service+date
  useEffect(() => {
    if (!serviceId || !date) {
      setBookedTimes([]);
      return;
    }
    const dateStr = format(date, "yyyy-MM-dd");
    supabase
      .from("bookings")
      .select("time")
      .eq("service_id", serviceId)
      .eq("date", dateStr)
      .then(({ data }) => {
        setBookedTimes((data ?? []).map((r: any) => r.time).filter(Boolean));
        setTime((t) => (t && (data ?? []).some((r: any) => r.time === t) ? "" : t));
      });
  }, [serviceId, date]);

  const grouped = useMemo(() => {
    return services.reduce<Record<string, Service[]>>((acc, s) => {
      const k = s.category ?? "Other";
      (acc[k] ??= []).push(s);
      return acc;
    }, {});
  }, [services]);

  const selectedService = services.find((s) => s.id === serviceId);
  const canConfirm = serviceId && date && time && !submitting;

  const handleConfirm = async () => {
    if (!user || !serviceId || !date || !time) return;
    setSubmitting(true);
    const { error } = await supabase.from("bookings").insert({
      user_id: user.id,
      email: user.email,
      service_id: serviceId,
      date: format(date, "yyyy-MM-dd"),
      time,
      status: "confirmed",
    });
    setSubmitting(false);

    if (error) {
      if (error.code === "23505") {
        toast.error("This slot was just taken. Please pick another time.");
        // refresh booked slots
        const { data } = await supabase
          .from("bookings")
          .select("time")
          .eq("service_id", serviceId)
          .eq("date", format(date, "yyyy-MM-dd"));
        setBookedTimes((data ?? []).map((r: any) => r.time).filter(Boolean));
        setTime("");
      } else {
        toast.error(error.message || "Could not confirm booking.");
      }
      return;
    }

    toast.success("Booking confirmed");
    navigate("/dashboard");
  };

  return (
    <div className="min-h-screen bg-background text-foreground">
      <header className="border-b border-border/60">
        <div className="container mx-auto flex items-center justify-between h-20 px-4">
          <Link to="/" className="font-serif text-xl">
            <span className="text-gold tracking-[0.3em] text-xs uppercase block leading-none">Lumière</span>
            Booking
          </Link>
          <Button asChild variant="ghost" className="text-muted-foreground">
            <Link to="/dashboard">My bookings</Link>
          </Button>
        </div>
      </header>

      <main className="container mx-auto px-4 py-12 max-w-3xl">
        <div className="text-center mb-10">
          <p className="text-gold tracking-[0.3em] text-xs uppercase mb-3">Reserve</p>
          <h1 className="font-serif text-3xl md:text-4xl mb-2">Book Your Experience</h1>
          <p className="text-muted-foreground">Choose a service, date and time.</p>
        </div>

        <div className="space-y-8 gradient-surface border border-border rounded-2xl p-6 md:p-10 shadow-card">
          {/* Step 1: Service */}
          <div>
            <label className="font-serif text-lg mb-3 block">
              <span className="text-gold mr-2">1.</span>Service
            </label>
            {loadingServices ? (
              <Skeleton className="h-10 w-full" />
            ) : (
              <Select value={serviceId} onValueChange={setServiceId}>
                <SelectTrigger className="w-full">
                  <SelectValue placeholder="Choose a treatment" />
                </SelectTrigger>
                <SelectContent>
                  {Object.entries(grouped).map(([cat, items]) => (
                    <SelectGroup key={cat}>
                      <SelectLabel>{cat}</SelectLabel>
                      {items.map((s) => (
                        <SelectItem key={s.id} value={s.id}>
                          {s.name} — ${s.price} · {s.duration}
                        </SelectItem>
                      ))}
                    </SelectGroup>
                  ))}
                </SelectContent>
              </Select>
            )}
          </div>

          {/* Step 2: Date */}
          <div>
            <label className="font-serif text-lg mb-3 block">
              <span className="text-gold mr-2">2.</span>Date
            </label>
            <Popover>
              <PopoverTrigger asChild>
                <Button
                  variant="outline"
                  className={cn(
                    "w-full justify-start text-left font-normal",
                    !date && "text-muted-foreground"
                  )}
                >
                  <CalendarIcon className="mr-2 h-4 w-4" />
                  {date ? format(date, "PPP") : "Pick a date"}
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-auto p-0" align="start">
                <Calendar
                  mode="single"
                  selected={date}
                  onSelect={setDate}
                  disabled={(d) => d < new Date(new Date().setHours(0, 0, 0, 0))}
                  initialFocus
                  className={cn("p-3 pointer-events-auto")}
                />
              </PopoverContent>
            </Popover>
          </div>

          {/* Step 3: Time */}
          <div>
            <label className="font-serif text-lg mb-3 block">
              <span className="text-gold mr-2">3.</span>Time
            </label>
            <div className="grid grid-cols-3 sm:grid-cols-4 gap-2">
              {TIME_SLOTS.map((slot) => {
                const disabled = !serviceId || !date || bookedTimes.includes(slot);
                const active = time === slot;
                return (
                  <Button
                    key={slot}
                    type="button"
                    variant="outline"
                    disabled={disabled}
                    onClick={() => setTime(slot)}
                    className={cn(
                      "transition-smooth",
                      active && "bg-gold text-primary-foreground border-gold hover:bg-gold-bright"
                    )}
                  >
                    {slot}
                  </Button>
                );
              })}
            </div>
            {serviceId && date && bookedTimes.length === TIME_SLOTS.length && (
              <p className="text-sm text-muted-foreground mt-3">
                All slots taken for this date — please pick another day.
              </p>
            )}
          </div>

          {/* Summary + confirm */}
          {selectedService && date && time && (
            <div className="border-t border-border pt-6">
              <p className="text-sm text-muted-foreground mb-1">You're booking</p>
              <p className="font-serif text-lg">
                {selectedService.name} · {format(date, "PPP")} at {time}
              </p>
            </div>
          )}

          <Button
            onClick={handleConfirm}
            disabled={!canConfirm}
            className="w-full bg-gold text-primary-foreground hover:bg-gold-bright shadow-gold disabled:opacity-50"
          >
            {submitting ? (
              <>
                <Loader2 className="h-4 w-4 animate-spin" /> Confirming…
              </>
            ) : (
              "Confirm Booking"
            )}
          </Button>
        </div>
      </main>
    </div>
  );
};

export default Booking;
