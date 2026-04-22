import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { Scissors, Sparkles, Hand, Brush, Flower2 } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { Skeleton } from "@/components/ui/skeleton";
import hairImg from "@/assets/service-hair.jpg";
import skinImg from "@/assets/service-skin.jpg";
import nailsImg from "@/assets/service-nails.jpg";
import makeupImg from "@/assets/service-makeup.jpg";
import spaImg from "@/assets/service-spa.jpg";

const categoryMeta: Record<string, { icon: any; image: string; desc: string }> = {
  Hair: { icon: Scissors, image: hairImg, desc: "Precision cuts, color, and bespoke styling by master artists." },
  Skin: { icon: Sparkles, image: skinImg, desc: "Advanced facials and dermatological treatments tailored to you." },
  Nails: { icon: Hand, image: nailsImg, desc: "Flawless manicures, pedicures and refined nail artistry." },
  Makeup: { icon: Brush, image: makeupImg, desc: "Editorial, bridal and event makeup for unforgettable moments." },
  Spa: { icon: Flower2, image: spaImg, desc: "Restorative massages, body rituals and wellness ceremonies." },
};

type Service = { id: string; name: string | null; category: string | null };

export const Services = () => {
  const [services, setServices] = useState<Service[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    supabase
      .from("services")
      .select("id, name, category")
      .then(({ data }) => {
        setServices(data ?? []);
        setLoading(false);
      });
  }, []);

  // First service per category for "Book" linking
  const firstByCategory = new Map<string, string>();
  for (const s of services) {
    if (s.category && !firstByCategory.has(s.category)) firstByCategory.set(s.category, s.id);
  }

  const categories = Object.keys(categoryMeta);

  return (
    <section id="services" className="py-24 md:py-32 bg-background">
      <div className="container mx-auto px-4">
        <div className="text-center max-w-2xl mx-auto mb-16">
          <p className="text-gold tracking-[0.3em] text-xs uppercase mb-4">Our Services</p>
          <h2 className="font-serif text-4xl md:text-5xl mb-5">A World of Refined Care</h2>
          <p className="text-muted-foreground">
            Every category curated with the same standard of excellence — discover treatments
            crafted by the finest professionals in the industry.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-6">
          {loading
            ? Array.from({ length: 5 }).map((_, i) => (
                <Skeleton key={i} className="h-80 rounded-xl" />
              ))
            : categories.map((name) => {
                const { icon: Icon, image, desc } = categoryMeta[name];
                const firstId = firstByCategory.get(name);
                const href = firstId ? `/booking?service=${firstId}` : "/booking";
                return (
                  <Link
                    key={name}
                    to={href}
                    className="group relative gradient-surface border border-border rounded-xl overflow-hidden shadow-card hover:border-gold/60 hover:shadow-gold transition-smooth"
                  >
                    <div
                      className="h-32 w-full bg-cover bg-center opacity-60 group-hover:opacity-80 transition-smooth"
                      style={{ backgroundImage: `url(${image})` }}
                    />
                    <div className="p-8">
                      <div className="w-12 h-12 rounded-full bg-gold/10 flex items-center justify-center mb-6 group-hover:bg-gold/20 transition-smooth">
                        <Icon className="text-gold" />
                      </div>
                      <h3 className="font-serif text-2xl mb-3 group-hover:text-gold transition-smooth">
                        {name}
                      </h3>
                      <p className="text-sm text-muted-foreground leading-relaxed">{desc}</p>
                    </div>
                  </Link>
                );
              })}
        </div>
      </div>
    </section>
  );
};
