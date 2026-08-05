import { Instagram, Linkedin, Youtube, Twitter, ArrowRight } from "lucide-react";
import { ASSETS } from "@/lib/brand";
import { CTAButton, Reveal, scrollToId } from "@/components/shared";

const socials = [Twitter, Instagram, Youtube, Linkedin];

export const Footer = () => (
  <>
    <section className="relative overflow-hidden bg-ink py-20 md:py-24">
      <div className="grain absolute inset-0" />
      <div className="pointer-events-none absolute left-1/2 top-0 h-[300px] w-[520px] -translate-x-1/2 rounded-full bg-saffron-600/25 blur-[110px]" />
      <div className="relative mx-auto max-w-3xl px-5 text-center md:px-8">
        <Reveal>
          <p className="font-display text-2xl font-bold leading-tight text-white sm:text-3xl lg:text-[2.5rem]">
            Bharat ka agla successful business…
            <span className="mt-2 block text-saffron-400">Shayad aapka ho.</span>
          </p>
        </Reveal>
        <Reveal delay={0.1}>
          <div className="mt-9 flex justify-center">
            <CTAButton testId="footer-cta" onClick={() => scrollToId("#submit")}>
              Apna Idea Submit Karein <ArrowRight size={17} />
            </CTAButton>
          </div>
          <p className="mt-6 font-display text-sm font-medium tracking-wide text-white/50">
            Hokar Nidar… Shuru Kar. &nbsp;#ShuruKar
          </p>
        </Reveal>
      </div>
    </section>

    <footer className="border-t border-charcoal/10 bg-cream py-14">
      <div className="mx-auto max-w-7xl px-5 md:px-8">
        <div className="grid gap-10 md:grid-cols-[1.4fr_1fr_1fr_1fr]">
          <div>
            <img src={ASSETS.shuruKarLogo} alt="ShuruKar by YourStory" className="h-10 w-auto" loading="lazy" />
            <p className="mt-4 max-w-xs text-sm leading-relaxed text-charcoal/55">
              Har business ek idea se shuru hota hai. ShuruKar us idea ko direction deta hai.
            </p>
            <img
              src={ASSETS.bharatProjectLogo}
              alt="The Bharat Project"
              className="mt-6 h-9 w-auto"
              loading="lazy"
            />
          </div>

          <div>
            <p className="font-display text-sm font-semibold text-charcoal">Company</p>
            <ul className="mt-4 space-y-2.5 text-sm text-charcoal/55">
              <li><a href="#movement" className="transition-colors hover:text-saffron-700">The Bharat Project</a></li>
              <li><a href="https://yourstory.com" target="_blank" rel="noreferrer" className="transition-colors hover:text-saffron-700">YourStory</a></li>
            </ul>
          </div>

          <div>
            <p className="font-display text-sm font-semibold text-charcoal">Legal</p>
            <ul className="mt-4 space-y-2.5 text-sm text-charcoal/55">
              <li><a href="#" className="transition-colors hover:text-saffron-700">Privacy Policy</a></li>
              <li><a href="#" className="transition-colors hover:text-saffron-700">Terms</a></li>
              <li><a href="#" className="transition-colors hover:text-saffron-700">Contact</a></li>
            </ul>
          </div>

          <div>
            <p className="font-display text-sm font-semibold text-charcoal">Follow</p>
            <div className="mt-4 flex gap-2.5">
              {socials.map((Icon, i) => (
                <a
                  key={i}
                  href="#"
                  data-testid={`social-link-${i}`}
                  aria-label="Social link"
                  className="flex h-10 w-10 items-center justify-center rounded-full border border-charcoal/10 bg-white text-charcoal/60 transition-[color,border-color,transform] duration-300 hover:-translate-y-0.5 hover:border-saffron-600 hover:text-saffron-700"
                >
                  <Icon size={17} strokeWidth={1.8} />
                </a>
              ))}
            </div>
          </div>
        </div>

        <div className="mt-12 border-t border-charcoal/10 pt-6">
          <p className="text-xs italic leading-relaxed text-charcoal/45">
            ShuruKar is a work-in-progress initiative. Programme details, pricing, and partnerships will be
            confirmed as they are finalised.
          </p>
          <p className="mt-3 text-xs text-charcoal/40">
            © {new Date().getFullYear()} ShuruKar &middot; The Bharat Project &middot; shurukar.in
          </p>
        </div>
      </div>
    </footer>
  </>
);
