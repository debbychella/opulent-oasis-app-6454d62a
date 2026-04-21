import { Button } from "@/components/ui/button";

export const CallToAction = () => {
  return (
    <section className="py-24 md:py-32 bg-surface relative overflow-hidden">
      <div className="absolute inset-0 bg-gradient-to-b from-transparent via-gold/5 to-transparent pointer-events-none" />
      <div className="container mx-auto px-4 relative">
        <div className="max-w-2xl mx-auto text-center">
          <div className="flex items-center justify-center gap-4 mb-8">
            <span className="h-px w-12 bg-gold/60" />
            <span className="text-gold tracking-[0.4em] text-xs uppercase">Begin</span>
            <span className="h-px w-12 bg-gold/60" />
          </div>
          <h2 className="font-serif text-4xl md:text-5xl mb-6">
            Begin Your Wellness Journey Today
          </h2>
          <p className="text-muted-foreground mb-10 leading-relaxed">
            Join thousands of discerning members enjoying effortless access to the world's finest
            beauty and wellness experiences.
          </p>
          <Button
            size="lg"
            className="bg-gold text-primary-foreground hover:bg-gold-bright shadow-gold h-12 px-10 text-base transition-smooth"
          >
            Book Your First Session
          </Button>
        </div>
      </div>
    </section>
  );
};
