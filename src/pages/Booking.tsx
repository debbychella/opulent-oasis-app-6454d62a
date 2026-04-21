import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";

const Booking = () => {
  return (
    <div className="min-h-screen bg-background text-foreground flex items-center justify-center px-4">
      <div className="max-w-xl text-center">
        <p className="text-gold tracking-[0.3em] text-xs uppercase mb-4">Booking</p>
        <h1 className="font-serif text-4xl md:text-5xl mb-5">Reserve Your Experience</h1>
        <p className="text-muted-foreground mb-8">
          Our booking flow is coming soon. You'll be able to choose your venue, treatment and time
          in just a few taps.
        </p>
        <Button asChild className="bg-gold text-primary-foreground hover:bg-gold-bright shadow-gold">
          <Link to="/">Back to Home</Link>
        </Button>
      </div>
    </div>
  );
};

export default Booking;
