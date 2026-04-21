import { ShieldCheck, Zap, Heart, Crown } from "lucide-react";

const features = [
  { icon: ShieldCheck, title: "Verified Luxury Partners", desc: "Every venue is hand-selected and vetted to meet our uncompromising standards." },
  { icon: Zap, title: "Instant Booking", desc: "Real-time availability with confirmed reservations in just a few taps." },
  { icon: Heart, title: "Personalized Recommendations", desc: "Curated experiences tailored to your preferences and history." },
  { icon: Crown, title: "Member-Only Perks", desc: "Exclusive offers, priority access and surprise gifts from premier partners." },
];

export const WhyChooseUs = () => {
  return (
    <section className="py-24 md:py-32 bg-surface">
      <div className="container mx-auto px-4">
        <div className="text-center max-w-2xl mx-auto mb-16">
          <p className="text-gold tracking-[0.3em] text-xs uppercase mb-4">Why Lumière</p>
          <h2 className="font-serif text-4xl md:text-5xl mb-5">An Experience, Elevated</h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {features.map(({ icon: Icon, title, desc }) => (
            <div key={title} className="text-center md:text-left">
              <div className="inline-flex w-14 h-14 rounded-full gradient-gold items-center justify-center mb-5 shadow-gold">
                <Icon className="text-primary-foreground" />
              </div>
              <h3 className="font-serif text-xl mb-3">{title}</h3>
              <p className="text-sm text-muted-foreground leading-relaxed">{desc}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};
