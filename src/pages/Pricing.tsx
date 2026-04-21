import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Membership } from "@/components/landing/Membership";

const Pricing = () => {
  return (
    <div className="min-h-screen bg-background text-foreground">
      <Membership />
      <div className="text-center pb-24">
        <Button asChild variant="outline" className="border-gold/60 text-gold hover:bg-gold/10">
          <Link to="/">Back to Home</Link>
        </Button>
      </div>
    </div>
  );
};

export default Pricing;
