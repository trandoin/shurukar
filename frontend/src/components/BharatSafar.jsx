import { ASSETS } from "@/lib/brand";
import { Counter, Reveal, SectionLabel } from "@/components/shared";

const stats = [
  { to: 50000, suffix: "+", label: "Entrepreneurs engaged" },
  { to: 5000, suffix: "+", label: "Pitches received from 400+ districts" },
  { to: 500, suffix: "", label: "Startups shortlisted" },
  { to: 10, suffix: "", label: "Startups already funded across 8 states" },
];

const milestones = [
  { when: "Republic Day 2025", what: "Bharat Project announced by Shradha Sharma" },
  { when: "April 2025", what: "Formally launched with the Union Commerce & Industry Minister" },
  { when: "BharatSparks", what: "Fund launched — 2–5% equity model, ₹10 Cr committed" },
  { when: "Launching soon", what: "ShuruKar AI Co-Pilot", current: true },
];

export const BharatSafar = () => (
  <section className="relative overflow-hidden py-20 md:py-28">
    <div className="pointer-events-none absolute right-0 top-1/3 h-[340px] w-[340px] rounded-full bg-saffron-200/40 blur-[120px]" />
    <div className="relative mx-auto max-w-7xl px-5 md:px-8">
      <div className="grid items-end gap-8 lg:grid-cols-[1.1fr_0.9fr]">
        <div>
          <Reveal>
            <SectionLabel>Ab tak ka safar</SectionLabel>
          </Reveal>
          <Reveal delay={0.06}>
            <h2 className="mt-6 font-display text-3xl font-bold leading-tight tracking-tight text-charcoal sm:text-4xl lg:text-[2.9rem]">
              Bharat Project — Ab Tak Ka Safar
            </h2>
          </Reveal>
          <Reveal delay={0.12}>
            <p className="mt-5 max-w-xl text-sm leading-relaxed text-charcoal/65 md:text-base">
              Yeh naya idea nahi hai. Yeh pehle se chal raha hai — aur aap iska hissa ban rahe hain.
            </p>
          </Reveal>
        </div>
        <Reveal delay={0.1}>
          <img
            src={ASSETS.launchPhoto}
            alt="The Bharat Project launch with the Union Commerce & Industry Minister"
            loading="lazy"
            className="w-full rounded-3xl object-cover shadow-[0_28px_60px_-34px_rgba(20,33,61,0.5)]"
          />
        </Reveal>
      </div>

      <div className="mt-14 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {stats.map((s, i) => (
          <Reveal key={s.label} delay={i * 0.08}>
            <div
              data-testid={`safar-stat-${i}`}
              className="h-full rounded-3xl border border-saffron-600/10 bg-white p-6 shadow-[0_10px_40px_-30px_rgba(0,0,0,0.4)] transition-transform duration-300 hover:-translate-y-1"
            >
              <p className="font-display text-3xl font-bold tracking-tight text-saffron-700 md:text-4xl">
                <Counter to={s.to} suffix={s.suffix} testId={`safar-counter-${i}`} />
              </p>
              <p className="mt-2.5 text-sm leading-snug text-charcoal/60">{s.label}</p>
            </div>
          </Reveal>
        ))}
      </div>

      <div className="mt-14 grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        {milestones.map((m, i) => (
          <Reveal key={m.when} delay={i * 0.08}>
            <div
              data-testid={`milestone-${i}`}
              className={`relative h-full overflow-hidden rounded-2xl border p-5 ${
                m.current
                  ? "animate-pulse-glow border-saffron-600 bg-gradient-to-br from-saffron-600 to-saffron-700 text-white"
                  : "border-saffron-600/12 bg-white"
              }`}
            >
              <div className="flex items-center gap-2">
                <span
                  className={`h-2.5 w-2.5 rounded-full ${m.current ? "bg-white" : "bg-saffron-600/40"}`}
                />
                <p
                  className={`text-xs font-semibold uppercase tracking-[0.14em] ${
                    m.current ? "text-white/85" : "text-charcoal/45"
                  }`}
                >
                  {m.when}
                </p>
              </div>
              <p
                className={`mt-3 font-display text-[15px] font-semibold leading-snug ${
                  m.current ? "text-white" : "text-charcoal"
                }`}
              >
                {m.what}
              </p>
              {/* badge removed */}
            </div>
          </Reveal>
        ))}
      </div>
    </div>
  </section>
);
