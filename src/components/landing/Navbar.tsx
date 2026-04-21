import { useState } from "react";
import { Menu } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";

const links = [
  { label: "Home", href: "#home" },
  { label: "Services", href: "#services" },
  { label: "Book", href: "#book" },
  { label: "Sign In", href: "#signin" },
];

export const Navbar = () => {
  const [open, setOpen] = useState(false);

  return (
    <header className="fixed top-0 inset-x-0 z-50 backdrop-blur-md bg-background/70 border-b border-border/40">
      <nav className="container mx-auto flex items-center justify-between h-16 md:h-20 px-4">
        <a href="#home" className="font-serif text-2xl md:text-3xl tracking-wide text-gold">
          Lumière
        </a>

        <ul className="hidden md:flex items-center gap-10">
          {links.map((l) => (
            <li key={l.label}>
              <a
                href={l.href}
                className="text-sm text-foreground/80 hover:text-gold transition-smooth"
              >
                {l.label}
              </a>
            </li>
          ))}
        </ul>

        <div className="hidden md:block">
          <Button
            asChild
            className="bg-gold text-primary-foreground hover:bg-gold-bright shadow-gold transition-smooth"
          >
            <a href="#book">Book Now</a>
          </Button>
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
                {links.map((l) => (
                  <a
                    key={l.label}
                    href={l.href}
                    onClick={() => setOpen(false)}
                    className="text-lg text-foreground/90 hover:text-gold transition-smooth"
                  >
                    {l.label}
                  </a>
                ))}
                <Button
                  asChild
                  className="bg-gold text-primary-foreground hover:bg-gold-bright mt-4"
                  onClick={() => setOpen(false)}
                >
                  <a href="#book">Book Now</a>
                </Button>
              </div>
            </SheetContent>
          </Sheet>
        </div>
      </nav>
    </header>
  );
};
