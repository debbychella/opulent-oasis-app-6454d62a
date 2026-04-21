import { Check } from "lucide-react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

const plans = [
  {
    name: "Pay Per Visit",
    price: "$0",
    period: "no commitment",
    perks: [
      "Browse all luxury venues",
      "Standard booking access",
      "Member rates at select partners",
      "No monthly fees",
    ],
    cta: "Get Started",
    featured: false,
  },
  {
    name: "Monthly",
    price: "$149",
    period: "per month",
    discount: "Save 15%",
    perks: [
      "Unlimited priority bookings",
      "15% off all treatments",
      "Complimentary upgrades",
      "Personal wellness concierge",
      "Cancel anytime",
    ],
    cta: "Choose Monthly",
    featured: true,
    badge: "Most Popular",
  },
  {
    name: "VIP",
    price: "$299",
    period: "per month",
    discount: "Save 25%",
    perks: [
      "Everything in Monthly",
      "25% off all treatments",
      "Priority access to top studios",
      "Private events & masterclasses",
      "Quarterly luxury gift box",
      "Complimentary signature treatment monthly",
      "Dedicated VIP concierge 24/7",
    ],
    cta: "Become VIP",
    featured: false,
  },
];

export const Membership = () => {
  return (
    <section id="book" className="py-24 md:py-32 bg-background">
      <div className="container mx-auto px-4">
        <div className="text-center max-w-2xl mx-auto mb-16">
          <p className="text-gold tracking-[0.3em] text-xs uppercase mb-4">Membership</p>
          <h2 className="font-serif text-4xl md:text-5xl mb-5">Choose Your Ritual</h2>
          <p className="text-muted-foreground">
            Flexible plans designed around your lifestyle. Upgrade, downgrade or pause anytime.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-6xl mx-auto">
          {plans.map((plan) => (
            <div
              key={plan.name}
              className={cn(
                "relative rounded-2xl p-8 border shadow-card transition-smooth flex flex-col",
                plan.featured
                  ? "border-gold/60 bg-surface-elevated shadow-gold md:scale-105"
                  : "border-border gradient-surface hover:border-gold/40",
              )}
            >
              {plan.badge && (
                <span className="absolute -top-3 left-1/2 -translate-x-1/2 px-4 py-1 rounded-full bg-gold text-primary-foreground text-xs tracking-wider uppercase font-medium">
                  {plan.badge}
                </span>
              )}

              <h3 className="font-serif text-2xl mb-2">{plan.name}</h3>
              <div className="mb-2">
                <span className="font-serif text-5xl text-gold">{plan.price}</span>
                <span className="text-muted-foreground text-sm ml-2">/ {plan.period}</span>
              </div>
              {plan.discount && (
                <span className="inline-block self-start mb-6 px-3 py-1 rounded-full border border-gold/40 text-gold text-xs tracking-wider uppercase">
                  {plan.discount}
                </span>
              )}
              {!plan.discount && <div className="mb-6" />}

              <ul className="space-y-3 mb-8 flex-1">
                {plan.perks.map((p) => (
                  <li key={p} className="flex items-start gap-3 text-sm text-foreground/85">
                    <Check className="text-gold mt-0.5 shrink-0" />
                    <span>{p}</span>
                  </li>
                ))}
              </ul>

              <Button
                asChild
                className={cn(
                  "w-full h-11 transition-smooth",
                  plan.featured
                    ? "bg-gold text-primary-foreground hover:bg-gold-bright shadow-gold"
                    : "bg-transparent border border-gold/50 text-gold hover:bg-gold/10",
                )}
              >
                <Link to="/pricing">{plan.cta}</Link>
              </Button>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};
