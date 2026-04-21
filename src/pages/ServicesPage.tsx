import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Services } from "@/components/landing/Services";

const ServicesPage = () => {
  return (
    <div className="min-h-screen bg-background text-foreground">
      <Services />
      <div className="text-center pb-24">
        <Button asChild className="bg-gold text-primary-foreground hover:bg-gold-bright shadow-gold">
          <Link to="/booking">Book a Service</Link>
        </Button>
      </div>
    </div>
  );
};

export default ServicesPage;
