import { Button } from "@/components/ui/button";
import heroImage from "@/assets/hero-spa.jpg";

export const Hero = () => {
  return (
    <section id="home" className="relative min-h-screen flex items-center overflow-hidden">
      <img
        src={heroImage}
        alt="Luxurious dark spa interior with golden candlelight and marble surfaces"
        width={1920}
        height={1080}
        className="absolute inset-0 w-full h-full object-cover"
      />
      <div className="absolute inset-0 gradient-hero" />
      <div className="absolute inset-0 bg-background/40" />

      <div className="relative container mx-auto px-4 pt-24 pb-16">
        <div className="max-w-3xl">
          <p className="text-gold tracking-[0.3em] text-xs md:text-sm uppercase mb-6">
            Beauty · Wellness · Bespoke
          </p>
          <h1 className="font-serif text-4xl sm:text-5xl md:text-7xl leading-[1.05] text-foreground mb-6">
            Luxury Beauty &amp; Wellness,
            <span className="block text-gold italic font-normal">Booked Effortlessly.</span>
          </h1>
          <p className="text-base md:text-lg text-foreground/75 max-w-xl mb-10 leading-relaxed">
            Discover the world's most exquisite salons and spas. Reserve hair, skin, nails,
            makeup and signature treatments in seconds — curated for the discerning few.
          </p>

          <div className="flex flex-col sm:flex-row gap-4">
            <Button
              asChild
              size="lg"
              className="bg-gold text-primary-foreground hover:bg-gold-bright shadow-gold transition-smooth h-12 px-8 text-base"
            >
              <a href="#book">Book Now</a>
            </Button>
            <Button
              asChild
              size="lg"
              variant="outline"
              className="border-gold/60 text-gold bg-transparent hover:bg-gold/10 hover:text-gold h-12 px-8 text-base"
            >
              <a href="#services">Explore Services</a>
            </Button>
          </div>
        </div>
      </div>
    </section>
  );
};
