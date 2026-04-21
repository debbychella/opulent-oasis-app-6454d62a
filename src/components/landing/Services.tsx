import { Scissors, Sparkles, Hand, Brush, Flower2 } from "lucide-react";

const services = [
  { icon: Scissors, name: "Hair", desc: "Precision cuts, color, and bespoke styling by master artists." },
  { icon: Sparkles, name: "Skin", desc: "Advanced facials and dermatological treatments tailored to you." },
  { icon: Hand, name: "Nails", desc: "Flawless manicures, pedicures and refined nail artistry." },
  { icon: Brush, name: "Makeup", desc: "Editorial, bridal and event makeup for unforgettable moments." },
  { icon: Flower2, name: "Spa", desc: "Restorative massages, body rituals and wellness ceremonies." },
];

export const Services = () => {
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
          {services.map(({ icon: Icon, name, desc }) => (
            <div
              key={name}
              className="group relative gradient-surface border border-border rounded-xl p-8 shadow-card hover:border-gold/60 hover:shadow-gold transition-smooth cursor-pointer"
            >
              <div className="w-12 h-12 rounded-full bg-gold/10 flex items-center justify-center mb-6 group-hover:bg-gold/20 transition-smooth">
                <Icon className="text-gold" />
              </div>
              <h3 className="font-serif text-2xl mb-3 group-hover:text-gold transition-smooth">
                {name}
              </h3>
              <p className="text-sm text-muted-foreground leading-relaxed">{desc}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};
