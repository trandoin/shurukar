import { Quote } from "lucide-react";
import { ASSETS, CITIES } from "@/lib/brand";
import { Reveal, SectionLabel } from "@/components/shared";

export const Founder = () => (
  <section id="movement" className="relative py-20 md:py-28">
    <div className="mx-auto max-w-7xl px-5 md:px-8">
      <Reveal>
        <SectionLabel>The Movement</SectionLabel>
      </Reveal>

      <div className="mt-10 grid gap-12 lg:grid-cols-[0.85fr_1.15fr] lg:gap-16">
        <Reveal className="relative mx-auto w-full max-w-sm lg:max-w-none">
          <div className="absolute -left-6 -top-6 h-40 w-40 rounded-full bg-saffron-400/35 blur-2xl" />
          <div className="absolute -bottom-8 right-0 h-48 w-48 rounded-[40%_60%_55%_45%] bg-saffron-600/20 blur-2xl" />
          <img
            src={ASSETS.founderPortrait}
            alt="Shradha Sharma, Founder, The Bharat Project"
            loading="lazy"
            className="relative w-full rounded-[36px_36px_36px_120px] object-cover shadow-[0_36px_70px_-30px_rgba(20,33,61,0.45)]"
          />
          <div className="relative mt-5 rounded-2xl border border-saffron-600/15 bg-white px-5 py-4">
            <p className="font-display text-base font-semibold text-charcoal">Shradha Sharma</p>
            <p className="mt-0.5 text-xs text-charcoal/55">Founder, The Bharat Project &middot; Founder, YourStory</p>
            <p className="mt-2 text-[11px] italic text-charcoal/40">
              Placeholder photo — official portrait se replace karna hai
            </p>
          </div>
        </Reveal>

        <div className="flex flex-col justify-center">
          <Reveal delay={0.08}>
            <Quote size={36} className="text-saffron-600/30" strokeWidth={1.6} />
            <blockquote className="mt-4 font-display text-xl font-medium leading-[1.45] text-charcoal sm:text-2xl lg:text-[1.7rem]">
              “Har entrepreneur ko mentor milna chahiye. Chahe woh Delhi mein ho ya Darbhanga. Bharat ke
              har kone mein entrepreneurial talent hai. Hamari zimmedari hai un tak knowledge,
              mentorship aur opportunities pahunchana.{" "}
              <span className="text-saffron-700">ShuruKar isi vision ka agla kadam hai.</span>”
            </blockquote>
            <p className="mt-5 text-sm font-semibold text-charcoal/70">— Shradha Sharma</p>
          </Reveal>

          <Reveal delay={0.16}>
            <div className="mt-10 rounded-3xl border border-saffron-600/10 bg-white p-6 shadow-[0_12px_44px_-30px_rgba(0,0,0,0.4)] md:p-7">
              <p className="text-xs font-semibold uppercase tracking-[0.16em] text-saffron-700">
                Bharat bhar se seekha
              </p>
              <p className="mt-3 font-display text-base font-medium text-charcoal md:text-lg">
                Pichhle ek saal mein hum entrepreneurs se mile
              </p>
              <div className="no-scrollbar -mx-1 mt-5 flex gap-2.5 overflow-x-auto px-1 pb-2">
                {CITIES.map((c) => (
                  <span
                    key={c}
                    data-testid={`city-chip-${c}`}
                    className="shrink-0 rounded-full border border-saffron-600/15 bg-cream px-4 py-2 text-sm font-medium text-charcoal/75 transition-colors duration-200 hover:border-saffron-600/50 hover:text-saffron-700"
                  >
                    {c}
                  </span>
                ))}
              </div>
              <p className="mt-5 text-sm leading-relaxed text-charcoal/60">
                Har jagah ek hi baat saamne aayi: <span className="font-medium text-charcoal">“Idea hai. Lekin shuru kahan se karein?”</span>{" "}
                Isi sawaal ka jawab hai ShuruKar.
              </p>
            </div>
          </Reveal>
        </div>
      </div>
    </div>
  </section>
);
