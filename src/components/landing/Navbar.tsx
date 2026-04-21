import { useState } from "react";
import { Menu, LogOut, LayoutDashboard } from "lucide-react";
import { Link, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useAuth } from "@/contexts/AuthContext";

const baseLinks = [
  { label: "Home", to: "/" },
  { label: "Services", to: "/services" },
  { label: "Book", to: "/booking" },
];

export const Navbar = () => {
  const [open, setOpen] = useState(false);
  const { user, signOut } = useAuth();
  const navigate = useNavigate();

  const handleSignOut = async () => {
    await signOut();
    setOpen(false);
    navigate("/");
  };

  const initial = user?.email?.[0]?.toUpperCase() ?? "?";

  return (
    <header className="fixed top-0 inset-x-0 z-50 backdrop-blur-md bg-background/70 border-b border-border/40">
      <nav className="container mx-auto flex items-center justify-between h-16 md:h-20 px-4">
        <Link to="/" className="font-serif text-2xl md:text-3xl tracking-wide text-gold">
          Lumière
        </Link>

        <ul className="hidden md:flex items-center gap-10">
          {baseLinks.map((l) => (
            <li key={l.label}>
              <Link
                to={l.to}
                className="text-sm text-foreground/80 hover:text-gold transition-smooth"
              >
                {l.label}
              </Link>
            </li>
          ))}
          {!user && (
            <li>
              <Link to="/auth" className="text-sm text-foreground/80 hover:text-gold transition-smooth">
                Sign In
              </Link>
            </li>
          )}
        </ul>

        <div className="hidden md:flex items-center gap-3">
          {user ? (
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="outline" className="border-gold/50 text-gold hover:bg-gold/10 gap-2">
                  <span className="h-6 w-6 rounded-full bg-gradient-gold text-primary-foreground text-xs font-medium flex items-center justify-center">
                    {initial}
                  </span>
                  <span className="max-w-[140px] truncate text-sm">{user.email}</span>
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="bg-card border-border/60">
                <DropdownMenuItem asChild>
                  <Link to="/dashboard" className="cursor-pointer">
                    <LayoutDashboard className="h-4 w-4" />
                    Dashboard
                  </Link>
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem onClick={handleSignOut} className="cursor-pointer text-gold">
                  <LogOut className="h-4 w-4" />
                  Sign Out
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          ) : (
            <Button
              asChild
              className="bg-gold text-primary-foreground hover:bg-gold-bright shadow-gold transition-smooth"
            >
              <Link to="/booking">Book Now</Link>
            </Button>
          )}
        </div>

        <div className="md:hidden">
          <Sheet open={open} onOpenChange={setOpen}>
            <SheetTrigger asChild>
              <Button variant="ghost" size="icon" aria-label="Open menu">
                <Menu className="text-gold" />
              </Button>
            </SheetTrigger>
            <SheetContent side="right" className="bg-background border-border/60">
              <div className="mt-8 flex flex-col gap-6">
                <span className="font-serif text-2xl text-gold">Lumière</span>
                {baseLinks.map((l) => (
                  <Link
                    key={l.label}
                    to={l.to}
                    onClick={() => setOpen(false)}
                    className="text-lg text-foreground/90 hover:text-gold transition-smooth"
                  >
                    {l.label}
                  </Link>
                ))}
                {user ? (
                  <>
                    <Link
                      to="/dashboard"
                      onClick={() => setOpen(false)}
                      className="text-lg text-foreground/90 hover:text-gold transition-smooth"
                    >
                      Dashboard
                    </Link>
                    <Button
                      variant="outline"
                      onClick={handleSignOut}
                      className="border-gold/50 text-gold hover:bg-gold/10 mt-4"
                    >
                      <LogOut className="h-4 w-4" />
                      Sign Out
                    </Button>
                  </>
                ) : (
                  <>
                    <Link
                      to="/auth"
                      onClick={() => setOpen(false)}
                      className="text-lg text-foreground/90 hover:text-gold transition-smooth"
                    >
                      Sign In
                    </Link>
                    <Button
                      asChild
                      className="bg-gold text-primary-foreground hover:bg-gold-bright mt-4"
                      onClick={() => setOpen(false)}
                    >
                      <Link to="/booking">Book Now</Link>
                    </Button>
                  </>
                )}
              </div>
            </SheetContent>
          </Sheet>
        </div>
      </nav>
    </header>
  );
};
