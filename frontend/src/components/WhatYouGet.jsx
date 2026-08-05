import { Lightbulb, Landmark, Library, GraduationCap, Wand2 } from "lucide-react";
import { IDEA_CHIPS } from "@/lib/brand";
import { Reveal, SectionLabel } from "@/components/shared";

const features = [
  {
    icon: Lightbulb,
    tag: "Business Idea",
    title: "Bas idea bataiye. Hum agla step batayenge.",
    body: "Aapka idea kitna practical hai, kahan se shuru karein, kitna paisa lagega — sab clear.",
    span: "lg:col-span-3",
    chips: IDEA_CHIPS,
  },
  {
    icon: Landmark,
    tag: "Government Schemes",
    title: "Sarkari yojna dhundhna ab mushkil nahi.",
    body: "300+ government schemes — Loans, Subsidies, Grants, Funding, sab ek jagah.",
    span: "lg:col-span-2",
    stat: "300+",
  },
  {
    icon: Library,
    tag: "Idea Bank",
    title: "Agar idea nahi hai… to inspiration toh hai.",
    body: "1000+ business ideas, research ke saath, market demand ke saath, Bharat ke context mein.",
    span: "lg:col-span-2",
    stat: "1000+",
  },
  {
    icon: GraduationCap,
    tag: "Course",
    title: "Business school nahi jaa paaye? Koi baat nahi.",
    body: "Shradha Sharma ke saath entrepreneurship seekhiye — step by step, simple language mein.",
    span: "lg:col-span-3",
  },
  {
    icon: Wand2,
    tag: "AI Tools",
    title: "Pitch deck banana hai? Market research karni hai?",
    body: "Business plan banana hai? Investor ke liye prepare hona hai? Ek hi jagah.",
    span: "lg:col-span-3",
    tools: ["Pitch Deck", "Market Research", "Business Plan", "Investor Prep"],
  },
];

export const WhatYouGet = () => (
  <>
    <section id="features" className="relative py-20 md:py-28">
      <div className="pointer-events-none absolute left-1/2 top-0 h-[300px] w-[600px] -translate-x-1/2 rounded-full bg-saffron-200/30 blur-[120px]" />
      <div className="relative mx-auto max-w-7xl px-5 md:px-8">
        <Reveal>
          <SectionLabel>What You Get</SectionLabel>
        </Reveal>
        <Reveal delay={0.06}>
          <h2 className="mt-6 max-w-2xl font-display text-3xl font-bold leading-tight tracking-tight text-charcoal sm:text-4xl lg:text-[2.9rem]">
            ShuruKar app mein aapko kya milega
          </h2>
        </Reveal>

        <div className="mt-12 grid gap-5 lg:grid-cols-6">
          {features.map((f, i) => (
            <Reveal key={f.tag} delay={i * 0.06} className={f.span}>
              <div
                data-testid={`feature-card-${i}`}
                className="group relative flex h-full flex-col overflow-hidden rounded-3xl border border-saffron-600/10 bg-white p-6 shadow-[0_10px_40px_-28px_rgba(0,0,0,0.4)] transition-[transform,box-shadow,border-color] duration-300 hover:-translate-y-1.5 hover:border-saffron-600/35 hover:shadow-[0_28px_60px_-32px_rgba(234,88,12,0.45)] md:p-8"
              >
                <div className="flex items-start justify-between gap-4">
                  <span className="flex h-12 w-12 items-center justify-center rounded-2xl bg-gradient-to-br from-saffron-500 to-saffron-700 text-white shadow-[0_10px_24px_-12px_rgba(234,88,12,0.8)]">
                    <f.icon size={22} strokeWidth={1.8} />
                  </span>
                  {f.stat && (
                    <span className="font-display text-2xl font-bold text-saffron-700/25 md:text-3xl">{f.stat}</span>
                  )}
                </div>
                <p className="mt-5 text-xs font-semibold uppercase tracking-[0.16em] text-saffron-700">{f.tag}</p>
                <h3 className="mt-2 font-display text-lg font-semibold leading-snug text-charcoal md:text-xl">
                  {f.title}
                </h3>
                <p className="mt-3 text-sm leading-relaxed text-charcoal/60">{f.body}</p>

                {f.chips && (
                  <div className="mt-6 flex flex-wrap gap-2">
                    {f.chips.map((c) => (
                      <span
                        key={c}
                        className="rounded-full border border-saffron-600/15 bg-cream px-3.5 py-1.5 text-xs font-medium text-charcoal/70 transition-colors duration-200 hover:border-saffron-600/50 hover:text-saffron-700"
                      >
                        {c}
                      </span>
                    ))}
                  </div>
                )}
                {f.tools && (
                  <div className="mt-6 grid grid-cols-2 gap-2">
                    {f.tools.map((t) => (
                      <span
                        key={t}
                        className="rounded-xl bg-cream px-3 py-2.5 text-xs font-medium text-charcoal/70"
                      >
                        {t}
                      </span>
                    ))}
                  </div>
                )}
              </div>
            </Reveal>
          ))}
        </div>
      </div>
    </section>

    <section className="relative overflow-hidden bg-ink py-20 md:py-24">
      <div className="grain absolute inset-0" />
      <div className="pointer-events-none absolute -right-24 -top-24 h-[320px] w-[320px] rounded-full bg-saffron-600/25 blur-[100px]" />
      <div className="relative mx-auto max-w-4xl px-5 text-center md:px-8">
        <Reveal>
          <p className="font-display text-2xl font-bold leading-tight text-white sm:text-3xl lg:text-[2.6rem]">
            Yeh sirf app nahi hai.
            <span className="mt-2 block text-saffron-400">Yeh Bharat ka entrepreneurship movement hai.</span>
          </p>
        </Reveal>
      </div>
    </section>
  </>
);
