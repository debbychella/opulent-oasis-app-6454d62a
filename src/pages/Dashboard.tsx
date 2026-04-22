import { useEffect, useState, useCallback } from "react";
import { Link, useNavigate } from "react-router-dom";
import { format, parseISO } from "date-fns";
import { LogOut, Calendar, Crown, Sparkles, Trash2 } from "lucide-react";
import { toast } from "sonner";
import { useAuth } from "@/contexts/AuthContext";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";

type BookingRow = {
  id: string;
  date: string;
  time: string;
  status: string;
  service: { name: string | null; category: string | null; price: number | null } | null;
};

const Dashboard = () => {
  const { user, signOut } = useAuth();
  const navigate = useNavigate();
  const [bookings, setBookings] = useState<BookingRow[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchBookings = useCallback(async () => {
    if (!user) return;
    setLoading(true);
    const today = new Date().toISOString().slice(0, 10);
    const { data, error } = await supabase
      .from("bookings")
      .select("id, date, time, status, service:services(name, category, price)")
      .eq("user_id", user.id)
      .gte("date", today)
      .order("date", { ascending: true })
      .order("time", { ascending: true });

    if (error) toast.error("Could not load bookings.");
    setBookings((data as any) ?? []);
    setLoading(false);
  }, [user]);

  useEffect(() => {
    fetchBookings();
  }, [fetchBookings]);

  const handleSignOut = async () => {
    await signOut();
    navigate("/", { replace: true });
  };

  const handleCancel = async (id: string) => {
    const { error } = await supabase.from("bookings").delete().eq("id", id);
    if (error) {
      toast.error("Could not cancel booking.");
      return;
    }
    toast.success("Booking cancelled");
    setBookings((prev) => prev.filter((b) => b.id !== id));
  };

  return (
    <div className="min-h-screen bg-background text-foreground">
      <header className="border-b border-border/60 bg-background/70 backdrop-blur-md">
        <div className="container mx-auto flex items-center justify-between h-20 px-4">
          <div>
            <p className="text-gold tracking-[0.3em] text-xs uppercase">Lumière</p>
            <h1 className="font-serif text-xl">Dashboard</h1>
          </div>
          <Button
            variant="outline"
            onClick={handleSignOut}
            className="border-gold/50 text-gold hover:bg-gold/10"
          >
            <LogOut className="h-4 w-4" />
            Sign Out
          </Button>
        </div>
      </header>

      <main className="container mx-auto px-4 py-12">
        <div className="mb-10">
          <h2 className="font-serif text-3xl md:text-4xl mb-2">
            Welcome, <span className="text-gold">{user?.email}</span>
          </h2>
          <p className="text-muted-foreground">Your wellness journey, beautifully organized.</p>
        </div>

        <div className="grid gap-6 md:grid-cols-3 mb-10">
          {/* Upcoming Bookings (live) */}
          <div className="md:col-span-3 rounded-2xl border border-border/60 bg-card/60 p-6">
            <div className="flex items-center justify-between mb-5">
              <div className="flex items-center gap-3">
                <div className="h-10 w-10 rounded-lg bg-gradient-gold flex items-center justify-center">
                  <Calendar className="h-5 w-5 text-primary-foreground" />
                </div>
                <h3 className="font-serif text-xl">Upcoming Bookings</h3>
              </div>
              <Button asChild size="sm" className="bg-gold text-primary-foreground hover:bg-gold-bright shadow-gold">
                <Link to="/booking">New Booking</Link>
              </Button>
            </div>

            {loading ? (
              <div className="space-y-3">
                {Array.from({ length: 2 }).map((_, i) => (
                  <Skeleton key={i} className="h-16 rounded-lg" />
                ))}
              </div>
            ) : bookings.length === 0 ? (
              <div className="text-center py-10">
                <p className="text-muted-foreground mb-4">No upcoming appointments yet.</p>
                <Button asChild className="bg-gold text-primary-foreground hover:bg-gold-bright shadow-gold">
                  <Link to="/booking">Book your first session</Link>
                </Button>
              </div>
            ) : (
              <ul className="space-y-3">
                {bookings.map((b) => (
                  <li
                    key={b.id}
                    className="flex items-center justify-between gap-4 p-4 rounded-lg border border-border/60 hover:border-gold/50 transition-smooth"
                  >
                    <div className="min-w-0">
                      <p className="font-serif text-lg truncate">
                        {b.service?.name ?? "Service"}
                        {b.service?.category && (
                          <span className="text-xs text-gold tracking-widest uppercase ml-2">
                            {b.service.category}
                          </span>
                        )}
                      </p>
                      <p className="text-sm text-muted-foreground">
                        {format(parseISO(b.date), "PPP")} · {b.time}
                        {b.service?.price ? ` · $${b.service.price}` : ""}
                      </p>
                    </div>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => handleCancel(b.id)}
                      className="text-muted-foreground hover:text-destructive"
                    >
                      <Trash2 className="h-4 w-4" />
                      Cancel
                    </Button>
                  </li>
                ))}
              </ul>
            )}
          </div>

          {/* Membership */}
          <div className="rounded-2xl border border-border/60 bg-card/60 p-6 hover:border-gold/60 transition-smooth">
            <div className="h-10 w-10 rounded-lg bg-gradient-gold flex items-center justify-center mb-4">
              <Crown className="h-5 w-5 text-primary-foreground" />
            </div>
            <h3 className="font-serif text-xl mb-2">Membership Status</h3>
            <p className="text-sm text-muted-foreground">
              You're on the Pay Per Visit plan. Upgrade for exclusive perks.
            </p>
          </div>

          {/* Recommended */}
          <div className="md:col-span-2 rounded-2xl border border-border/60 bg-card/60 p-6 hover:border-gold/60 transition-smooth">
            <div className="h-10 w-10 rounded-lg bg-gradient-gold flex items-center justify-center mb-4">
              <Sparkles className="h-5 w-5 text-primary-foreground" />
            </div>
            <h3 className="font-serif text-xl mb-2">Recommended For You</h3>
            <p className="text-sm text-muted-foreground">
              Personalized treatments curated to your preferences.
            </p>
          </div>
        </div>
      </main>
    </div>
  );
};

export default Dashboard;
