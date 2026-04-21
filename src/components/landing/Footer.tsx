import { Instagram, Facebook, Twitter } from "lucide-react";

const columns = [
  { title: "Company", links: ["About", "Careers", "Press", "Partners"] },
  { title: "Services", links: ["Hair", "Skin", "Nails", "Makeup", "Spa"] },
  { title: "Support", links: ["Help Center", "Contact", "Booking Policy", "Gift Cards"] },
  { title: "Legal", links: ["Privacy", "Terms", "Cookies", "Accessibility"] },
];

export const Footer = () => {
  return (
    <footer className="bg-background border-t border-border/60 pt-16 pb-8">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-2 md:grid-cols-6 gap-10 mb-12">
          <div className="col-span-2">
            <a href="#home" className="font-serif text-3xl text-gold">Lumière</a>
            <p className="text-sm text-muted-foreground mt-4 max-w-xs leading-relaxed">
              The world's premier destination for luxury beauty and wellness experiences.
            </p>
            <div className="flex gap-3 mt-6">
              {[Instagram, Facebook, Twitter].map((Icon, i) => (
                <a
                  key={i}
                  href="#"
                  aria-label="Social link"
                  className="w-10 h-10 rounded-full border border-border flex items-center justify-center text-foreground/70 hover:text-gold hover:border-gold/60 transition-smooth"
                >
                  <Icon className="w-4 h-4" />
                </a>
              ))}
            </div>
          </div>

          {columns.map((col) => (
            <div key={col.title}>
              <h4 className="font-serif text-base text-foreground mb-4">{col.title}</h4>
              <ul className="space-y-3">
                {col.links.map((l) => (
                  <li key={l}>
                    <a href="#" className="text-sm text-muted-foreground hover:text-gold transition-smooth">
                      {l}
                    </a>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        <div className="border-t border-border/60 pt-6 flex flex-col md:flex-row items-center justify-between gap-3">
          <p className="text-xs text-muted-foreground">
            © {new Date().getFullYear()} Lumière. All rights reserved.
          </p>
          <p className="text-xs text-muted-foreground">Crafted with care for the discerning few.</p>
        </div>
      </div>
    </footer>
  );
};
