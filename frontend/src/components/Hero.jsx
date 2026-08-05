import { motion } from "framer-motion";
import { ArrowRight, Sparkles } from "lucide-react";
import { ASSETS } from "@/lib/brand";
import { CTAButton, Reveal, scrollToId } from "@/components/shared";

const bubbles = [
  { me: true, text: "Bhaiya, main makhana ka business shuru karna chahta hoon" },
  { me: false, text: "Badhiya soch! Bihar mein makhana ki demand tezi se badh rahi hai. Chaliye teen step mein plan banate hain." },
  { me: false, text: "1. Supply — Darbhanga mandi\n2. Packaging — ₹18k setup\n3. PMFME subsidy — 35% tak" },
  { me: true, text: "Loan kahan se milega?" },
];

export const Hero = () => (
  <section id="hero" className="relative overflow-hidden pt-28 pb-16 md:pt-36 md:pb-24">
    <div className="pointer-events-none absolute -left-32 -top-24 h-[420px] w-[420px] rounded-full bg-saffron-200/45 blur-[110px]" />
    <div className="pointer-events-none absolute right-[-140px] top-40 h-[380px] w-[380px] rounded-full bg-saffron-400/25 blur-[120px]" />

    <div className="relative mx-auto grid max-w-7xl items-center gap-14 px-5 md:px-8 lg:grid-cols-[1.05fr_0.95fr] lg:gap-8">
      <div>
        <Reveal>
          <div className="inline-flex items-center gap-2 rounded-full border border-saffron-200 bg-white/70 px-4 py-1.5 text-xs font-semibold text-saffron-700">
            <Sparkles size={14} />
            #HokarNidarShuruKar
          </div>
        </Reveal>

        <Reveal delay={0.06}>
          <h1 className="mt-6 font-display text-4xl font-bold leading-[1.08] tracking-tight text-charcoal sm:text-5xl lg:text-6xl">
            Har business ek idea se{" "}
            <span className="relative inline-block text-saffron-700">
              shuru hota hai.
              <svg className="absolute -bottom-2 left-0 w-full" height="10" viewBox="0 0 200 10" preserveAspectRatio="none">
                <path d="M2 7C50 2 150 2 198 6" stroke="#EA580C" strokeWidth="3" fill="none" strokeLinecap="round" opacity="0.45" />
              </svg>
            </span>
          </h1>
        </Reveal>

        <Reveal delay={0.12}>
          <p className="mt-6 font-display text-base font-medium text-charcoal/70 md:text-lg">
            Bas us idea ko sahi direction chahiye.
          </p>
        </Reveal>

        <Reveal delay={0.18}>
          <p className="mt-4 max-w-xl text-sm leading-relaxed text-charcoal/60 md:text-base">
            ShuruKar aapka 24×7 AI mentor hai - business shuru karne se lekar use bada karne tak, har
            step par aapke saath. Aapki bhasha mein. Bilkul free.
          </p>
        </Reveal>

        <Reveal delay={0.24}>
          <div className="mt-9 flex flex-wrap items-center gap-3">
            <CTAButton testId="hero-cta-primary" onClick={() => scrollToId("#submit")}>
              Apna Idea Submit Karein <ArrowRight size={17} />
            </CTAButton>
            <CTAButton testId="hero-cta-secondary" variant="ghost" onClick={() => scrollToId("#why")}>
              Explore ShuruKar
            </CTAButton>
          </div>
        </Reveal>

        <Reveal delay={0.32}>
          <div className="mt-12 flex flex-wrap items-center gap-4 border-t border-charcoal/10 pt-6">
            <span className="text-xs font-medium uppercase tracking-[0.14em] text-charcoal/45">
              ShuruKar is built under
            </span>
            <img
              src={ASSETS.bharatProjectLogo}
              alt="The Bharat Project"
              className="h-10 w-auto"
              loading="lazy"
            />
          </div>
        </Reveal>
      </div>

      <Reveal delay={0.15} className="relative mx-auto w-full max-w-[320px]">
        <div className="absolute inset-x-6 bottom-6 top-10 rounded-[46px] bg-gradient-to-br from-saffron-500 to-saffron-700 opacity-25 blur-2xl" />
        <motion.div
          animate={{ y: [0, -14, 0] }}
          transition={{ duration: 6.5, repeat: Infinity, ease: "easeInOut" }}
          className="relative rounded-[42px] border border-charcoal/10 bg-ink p-2.5 shadow-[0_40px_80px_-32px_rgba(20,33,61,0.55)]"
        >
          <div className="relative overflow-hidden rounded-[34px] bg-cream">
            <div className="flex items-center gap-2.5 border-b border-charcoal/5 bg-white px-4 py-3">
              <div className="flex h-8 w-8 items-center justify-center rounded-full bg-saffron-600 font-display text-xs font-bold text-white">
                SK
              </div>
              <div>
                <p className="font-display text-[13px] font-semibold leading-tight">ShuruKar AI Co-Pilot</p>
                <p className="flex items-center gap-1 text-[10px] text-emerald-600">
                  <span className="h-1.5 w-1.5 rounded-full bg-emerald-500" /> online · abhi bhi
                </p>
              </div>
            </div>

            <div className="space-y-2.5 px-3.5 py-4">
              {bubbles.map((b, i) => (
                <motion.div
                  key={i}
                  initial={{ opacity: 0, y: 8 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.6 + i * 0.45, duration: 0.4 }}
                  className={`flex ${b.me ? "justify-end" : "justify-start"}`}
                >
                  <p
                    className={`max-w-[82%] whitespace-pre-line rounded-2xl px-3.5 py-2.5 text-[11.5px] leading-snug ${
                      b.me
                        ? "rounded-br-md bg-saffron-600 text-white"
                        : "rounded-bl-md bg-white text-charcoal/80 shadow-[0_4px_14px_-8px_rgba(0,0,0,0.25)]"
                    }`}
                  >
                    {b.text}
                  </p>
                </motion.div>
              ))}
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 2.6 }}
                className="flex gap-1.5 pl-1"
              >
                {[0, 1, 2].map((d) => (
                  <motion.span
                    key={d}
                    animate={{ opacity: [0.25, 1, 0.25] }}
                    transition={{ duration: 1.1, repeat: Infinity, delay: d * 0.18 }}
                    className="h-1.5 w-1.5 rounded-full bg-saffron-600"
                  />
                ))}
              </motion.div>
            </div>
          </div>
        </motion.div>
        <p className="mt-4 text-center text-[11px] italic text-charcoal/40">
          Placeholder UI — actual app screens launch par
        </p>
      </Reveal>
    </div>
  </section>
);
