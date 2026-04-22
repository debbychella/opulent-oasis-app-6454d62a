import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Services } from "@/components/landing/Services";
import { supabase } from "@/integrations/supabase/client";
import { Skeleton } from "@/components/ui/skeleton";

type Service = {
  id: string;
  name: string | null;
  category: string | null;
  price: number | null;
  duration: string | null;
};

const ServicesPage = () => {
  const [services, setServices] = useState<Service[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    supabase
      .from("services")
      .select("id, name, category, price, duration")
      .order("category")
      .then(({ data }) => {
        setServices(data ?? []);
        setLoading(false);
      });
  }, []);

  const grouped = services.reduce<Record<string, Service[]>>((acc, s) => {
    const k = s.category ?? "Other";
    (acc[k] ??= []).push(s);
    return acc;
  }, {});

  return (
    <div className="min-h-screen bg-background text-foreground">
      <Services />

      <section className="container mx-auto px-4 pb-24">
        <div className="text-center max-w-2xl mx-auto mb-12">
          <p className="text-gold tracking-[0.3em] text-xs uppercase mb-4">Full Menu</p>
          <h2 className="font-serif text-3xl md:text-4xl mb-3">Every Treatment, Curated</h2>
        </div>

        {loading ? (
          <div className="grid gap-4 md:grid-cols-2">
            {Array.from({ length: 6 }).map((_, i) => (
              <Skeleton key={i} className="h-24 rounded-xl" />
            ))}
          </div>
        ) : (
          <div className="space-y-12">
            {Object.entries(grouped).map(([category, items]) => (
              <div key={category}>
                <h3 className="font-serif text-2xl text-gold mb-4">{category}</h3>
                <div className="grid gap-4 md:grid-cols-2">
                  {items.map((s) => (
                    <div
                      key={s.id}
                      className="flex items-center justify-between gradient-surface border border-border rounded-xl p-5 hover:border-gold/60 transition-smooth"
                    >
                      <div className="min-w-0">
                        <h4 className="font-serif text-lg truncate">{s.name}</h4>
                        <p className="text-sm text-muted-foreground">
                          {s.duration} · ${s.price}
                        </p>
                      </div>
                      <Button
                        asChild
                        size="sm"
                        className="bg-gold text-primary-foreground hover:bg-gold-bright shadow-gold ml-4 shrink-0"
                      >
                        <Link to={`/booking?service=${s.id}`}>Book</Link>
                      </Button>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        )}

        <div className="text-center mt-16">
          <Button asChild className="bg-gold text-primary-foreground hover:bg-gold-bright shadow-gold">
            <Link to="/booking">Book a Service</Link>
          </Button>
        </div>
      </section>
    </div>
  );
};

export default ServicesPage;
