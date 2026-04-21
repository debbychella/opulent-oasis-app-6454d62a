import { useNavigate } from "react-router-dom";
import { LogOut, Calendar, Crown, Sparkles } from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";
import { Button } from "@/components/ui/button";

const Dashboard = () => {
  const { user, signOut } = useAuth();
  const navigate = useNavigate();

  const handleSignOut = async () => {
    await signOut();
    navigate("/", { replace: true });
  };

  const cards = [
    { icon: Calendar, title: "Upcoming Bookings", body: "You have no upcoming appointments. Book your next experience." },
    { icon: Crown, title: "Membership Status", body: "You're on the Pay Per Visit plan. Upgrade for exclusive perks." },
    { icon: Sparkles, title: "Recommended For You", body: "Personalized treatments curated to your preferences." },
  ];

  return (
    <div className="min-h-screen bg-background text-foreground">
      <header className="border-b border-border/60 bg-background/70 backdrop-blur-md">
        <div className="container mx-auto flex items-center justify-between h-20 px-4">
          <div>
            <p className="text-gold tracking-[0.3em] text-xs uppercase">Lumière</p>
            <h1 className="font-serif text-xl">Dashboard</h1>
          </div>
          <Button
            variant="outline"
            onClick={handleSignOut}
            className="border-gold/50 text-gold hover:bg-gold/10"
          >
            <LogOut className="h-4 w-4" />
            Sign Out
          </Button>
        </div>
      </header>

      <main className="container mx-auto px-4 py-12">
        <div className="mb-10">
          <h2 className="font-serif text-3xl md:text-4xl mb-2">
            Welcome, <span className="text-gold">{user?.email}</span>
          </h2>
          <p className="text-muted-foreground">Your wellness journey, beautifully organized.</p>
        </div>

        <div className="grid gap-6 md:grid-cols-3">
          {cards.map(({ icon: Icon, title, body }) => (
            <div
              key={title}
              className="rounded-2xl border border-border/60 bg-card/60 p-6 hover:border-gold/60 transition-smooth"
            >
              <div className="h-10 w-10 rounded-lg bg-gradient-gold flex items-center justify-center mb-4">
                <Icon className="h-5 w-5 text-primary-foreground" />
              </div>
              <h3 className="font-serif text-xl mb-2">{title}</h3>
              <p className="text-sm text-muted-foreground">{body}</p>
            </div>
          ))}
        </div>
      </main>
    </div>
  );
};

export default Dashboard;
