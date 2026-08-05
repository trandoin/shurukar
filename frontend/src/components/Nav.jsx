import { useEffect, useState } from "react";
import { Menu, X } from "lucide-react";
import { ASSETS, NAV_LINKS } from "@/lib/brand";
import { scrollToId } from "@/components/shared";

export const Nav = () => {
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 12);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  const go = (href) => {
    setOpen(false);
    scrollToId(href);
  };

  return (
    <header
      data-testid="top-nav"
      className={`fixed inset-x-0 top-0 z-50 transition-[background-color,box-shadow,backdrop-filter] duration-300 ${
        scrolled ? "bg-cream/85 backdrop-blur-md shadow-[0_6px_24px_-16px_rgba(20,33,61,0.35)]" : "bg-transparent"
      }`}
    >
      <div className="mx-auto flex max-w-7xl items-center justify-between gap-4 px-5 py-3.5 md:px-8">
        <button data-testid="nav-logo" onClick={() => scrollToId("#hero")} className="shrink-0">
          <img src={ASSETS.shuruKarLogo} alt="ShuruKar by YourStory" className="h-9 w-auto md:h-10" />
        </button>

        <nav className="hidden items-center gap-1 lg:flex">
          {NAV_LINKS.map((l) => (
            <button
              key={l.href}
              data-testid={`nav-link-${l.href.slice(1)}`}
              onClick={() => go(l.href)}
              className="rounded-full px-4 py-2 text-sm font-medium text-charcoal/70 transition-colors duration-200 hover:bg-saffron-100/70 hover:text-saffron-700"
            >
              {l.label}
            </button>
          ))}
        </nav>

        <div className="flex items-center gap-2">
          <button
            data-testid="nav-cta"
            onClick={() => go("#submit")}
            className="hidden rounded-full bg-saffron-600 px-5 py-2.5 font-display text-sm font-semibold text-white shadow-[0_8px_24px_-8px_rgba(234,88,12,0.7)] transition-[transform,background-color] duration-300 hover:-translate-y-0.5 hover:bg-saffron-700 sm:inline-flex"
          >
            Apna Idea Submit Karein
          </button>
          <button
            data-testid="nav-menu-toggle"
            onClick={() => setOpen((v) => !v)}
            aria-label="Menu"
            className="rounded-full border border-charcoal/10 bg-white/70 p-2.5 lg:hidden"
          >
            {open ? <X size={18} /> : <Menu size={18} />}
          </button>
        </div>
      </div>

      {open && (
        <div data-testid="mobile-menu" className="border-t border-saffron-200/50 bg-cream/95 px-5 pb-5 pt-2 backdrop-blur-md lg:hidden">
          {NAV_LINKS.map((l) => (
            <button
              key={l.href}
              data-testid={`mobile-nav-link-${l.href.slice(1)}`}
              onClick={() => go(l.href)}
              className="block w-full rounded-xl px-3 py-3 text-left font-display text-base font-medium text-charcoal/80 hover:bg-saffron-100/60"
            >
              {l.label}
            </button>
          ))}
        </div>
      )}
    </header>
  );
};
