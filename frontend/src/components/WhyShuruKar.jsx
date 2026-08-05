import { Banknote, FileSearch, HelpCircle, Rocket, TrendingUp, Clock, Globe, Gift, Languages } from "lucide-react";
import { Reveal, SectionLabel } from "@/components/shared";

const questions = [
  { icon: Rocket, q: "Business kaise shuru karun?" },
  { icon: Banknote, q: "Paisa kahan se milega?" },
  { icon: FileSearch, q: "Government scheme kaunsi hai?" },
  { icon: TrendingUp, q: "Market mein demand hai ya nahi?" },
  { icon: HelpCircle, q: "Kya mera idea chalega?" },
];

const chips = [
  { icon: Clock, label: "24×7" },
  { icon: Globe, label: "7 din" },
  { icon: Languages, label: "Aapki Bhasha" },
  { icon: Gift, label: "Free" },
];

export const WhyShuruKar = () => (
  <>
    <section id="why" className="relative py-20 md:py-28">
      <div className="mx-auto max-w-7xl px-5 md:px-8">
        <div className="grid gap-14 lg:grid-cols-[1fr_1fr] lg:gap-20">
          <div>
            <Reveal>
              <SectionLabel>Why ShuruKar</SectionLabel>
            </Reveal>
            <Reveal delay={0.06}>
              <h2 className="mt-6 font-display text-3xl font-bold leading-[1.15] tracking-tight text-charcoal sm:text-4xl lg:text-[2.9rem]">
                Bharat mein talent ki kami nahi hai.
                <span className="block text-saffron-700">Sirf sahi guidance ki kami hai.</span>
              </h2>
            </Reveal>
            <Reveal delay={0.12}>
              <p className="mt-7 max-w-lg text-sm leading-relaxed text-charcoal/65 md:text-base">
                Across Bharat humne hazaaron aspiring entrepreneurs se baat ki. Sabke paas ideas the.
                Lekin sawaal bhi wahi the.
              </p>
            </Reveal>
            <Reveal delay={0.18}>
              <blockquote className="mt-10 border-l-[3px] border-saffron-600 pl-5">
                <p className="font-display text-xl font-semibold leading-snug text-charcoal md:text-2xl">
                  Yahin se ShuruKar ka idea shuru hua.
                </p>
              </blockquote>
              <p className="mt-6 font-display text-base font-medium text-saffron-700 md:text-lg">
                Sapna aapka. Safar humara saath.
              </p>
            </Reveal>
          </div>

          <div className="space-y-3">
            {questions.map((item, i) => (
              <Reveal key={item.q} delay={i * 0.07}>
                <div
                  data-testid={`why-question-${i}`}
                  className="group flex items-center gap-4 rounded-2xl border border-saffron-600/10 bg-white p-4 shadow-[0_8px_30px_-22px_rgba(0,0,0,0.35)] transition-[transform,box-shadow,border-color] duration-300 hover:-translate-y-1 hover:border-saffron-600/40 hover:shadow-[0_18px_40px_-24px_rgba(234,88,12,0.5)] md:p-5"
                >
                  <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-saffron-50 text-saffron-700 transition-colors duration-300 group-hover:bg-saffron-600 group-hover:text-white">
                    <item.icon size={20} strokeWidth={1.8} />
                  </span>
                  <p className="font-display text-[15px] font-medium text-charcoal md:text-base">{item.q}</p>
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </div>
    </section>

    <section className="relative overflow-hidden py-16 md:py-20">
      <div className="mx-auto max-w-4xl px-5 text-center md:px-8">
        <Reveal>
          <h2 className="font-display text-3xl font-bold tracking-tight text-charcoal sm:text-4xl">
            Ek mentor jo kabhi <span className="text-saffron-700">busy nahi hota</span>
          </h2>
        </Reveal>
        <Reveal delay={0.08}>
          <p className="mx-auto mt-5 max-w-2xl text-sm leading-relaxed text-charcoal/65 md:text-base">
            ShuruKar AI Co-Pilot har entrepreneur ko personalized guidance deta hai - 24 ghante, 7 din,
            aapki language mein, aapke business ke context ke saath.
          </p>
        </Reveal>
        <Reveal delay={0.14}>
          <div className="mt-9 flex flex-wrap justify-center gap-3">
            {chips.map((c) => (
              <div
                key={c.label}
                data-testid={`mentor-chip-${c.label}`}
                className="flex items-center gap-2 rounded-full border border-saffron-600/15 bg-white px-5 py-2.5 font-display text-sm font-semibold text-charcoal shadow-[0_6px_20px_-16px_rgba(0,0,0,0.4)] transition-transform duration-300 hover:-translate-y-0.5"
              >
                <c.icon size={16} className="text-saffron-600" strokeWidth={2} />
                {c.label}
              </div>
            ))}
          </div>
        </Reveal>
      </div>
    </section>
  </>
);
