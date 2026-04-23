import { useEffect, useState } from "react";
import { Link, useSearchParams } from "react-router-dom";
import { CheckCircle2, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { supabase } from "@/integrations/supabase/client";

const BillingSuccess = () => {
  const [params] = useSearchParams();
  const sessionId = params.get("session_id");
  const [status, setStatus] = useState<"loading" | "ok" | "error">("loading");
  const [details, setDetails] = useState<{ plan?: string; email?: string } | null>(null);

  useEffect(() => {
    if (!sessionId) {
      setStatus("error");
      return;
    }
    supabase.functions
      .invoke("verify-checkout", { body: { session_id: sessionId } })
      .then(({ data, error }) => {
        if (error || !data?.paid) {
          setStatus("error");
          return;
        }
        setDetails({ plan: data.plan, email: data.email });
        setStatus("ok");
      });
  }, [sessionId]);

  return (
    <div className="min-h-screen bg-background text-foreground flex items-center justify-center px-4">
      <div className="w-full max-w-lg rounded-2xl border border-border/60 bg-card/60 p-8 md:p-10 text-center">
        {status === "loading" && (
          <div className="flex flex-col items-center gap-4 py-8">
            <Loader2 className="h-10 w-10 animate-spin text-gold" />
            <p className="text-muted-foreground">Confirming your subscription…</p>
          </div>
        )}

        {status === "ok" && (
          <>
            <div className="h-16 w-16 mx-auto mb-5 rounded-full bg-gradient-gold flex items-center justify-center shadow-gold">
              <CheckCircle2 className="h-8 w-8 text-primary-foreground" />
            </div>
            <p className="text-gold tracking-[0.3em] text-xs uppercase mb-2">Welcome</p>
            <h1 className="font-serif text-3xl md:text-4xl mb-3">
              Your membership is <span className="text-gold">active</span>
            </h1>
            <p className="text-muted-foreground mb-2">
              Thank you for subscribing{details?.plan ? ` to the ${details.plan} plan` : ""}.
            </p>
            {details?.email && (
              <p className="text-sm text-muted-foreground mb-8">
                Receipt sent to <span className="text-foreground">{details.email}</span>.
              </p>
            )}
            <div className="flex flex-col sm:flex-row gap-3 justify-center">
              <Button
                asChild
                className="bg-gold text-primary-foreground hover:bg-gold-bright shadow-gold"
              >
                <Link to="/dashboard">Go to Dashboard</Link>
              </Button>
              <Button
                asChild
                variant="outline"
                className="border-gold/50 text-gold hover:bg-gold/10"
              >
                <Link to="/booking">Book a Session</Link>
              </Button>
            </div>
          </>
        )}

        {status === "error" && (
          <>
            <h1 className="font-serif text-3xl mb-3">Hmm, something's off</h1>
            <p className="text-muted-foreground mb-6">
              We couldn't verify your payment. If you were charged, please contact support.
            </p>
            <Button
              asChild
              className="bg-gold text-primary-foreground hover:bg-gold-bright shadow-gold"
            >
              <Link to="/pricing">Back to Pricing</Link>
            </Button>
          </>
        )}
      </div>
    </div>
  );
};

export default BillingSuccess;
