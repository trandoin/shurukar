import { Quote } from "lucide-react";
import { ASSETS, CITIES } from "@/lib/brand";
import { Reveal, SectionLabel } from "@/components/shared";

export const Founder = () => (
  <section id="movement" className="relative overflow-hidden py-10 sm:py-16 md:py-24">
    <div className="mx-auto max-w-7xl px-4 sm:px-6 md:px-8">
      <Reveal>
        <SectionLabel>The Movement</SectionLabel>
      </Reveal>

      <div className="mt-6 sm:mt-10 flex flex-col items-center lg:grid lg:grid-cols-[minmax(280px,360px)_1fr] lg:gap-16 lg:items-center">
        {/* Founder Photo & Tag Card */}
        <Reveal className="relative w-full max-w-[280px] sm:max-w-[340px] lg:max-w-none mx-auto mb-6 lg:mb-0">
          <div className="absolute -left-4 -top-4 h-32 w-32 rounded-full bg-saffron-400/35 blur-2xl sm:h-40 sm:w-40 sm:-left-6 sm:-top-6 pointer-events-none" />
          <div className="absolute -bottom-6 -right-4 h-40 w-40 rounded-[40%_60%_55%_45%] bg-saffron-600/20 blur-2xl sm:h-48 sm:w-48 sm:-bottom-8 pointer-events-none" />
          
          <div className="relative overflow-hidden rounded-[24px_24px_24px_64px] sm:rounded-[36px_36px_36px_120px] shadow-[0_20px_45px_-15px_rgba(20,33,61,0.3)] bg-charcoal/5">
            <img
              src={ASSETS.founderPortrait}
              alt="Shradha Sharma, Founder, The Bharat Project"
              loading="lazy"
              onError={(e) => {
                e.target.onerror = null;
                e.target.src = "https://images.unsplash.com/photo-1623662346414-af98877cab19?crop=entropy&cs=srgb&fm=jpg&w=600&q=80";
              }}
              className="aspect-[4/5] w-full object-cover object-top"
            />
          </div>

          <div className="relative mt-3 sm:mt-4 rounded-2xl border border-saffron-600/15 bg-white px-4 py-3 sm:px-5 sm:py-4 shadow-sm text-left">
            <p className="font-display text-sm sm:text-base font-semibold text-charcoal">Shradha Sharma</p>
            <p className="mt-0.5 text-[11px] sm:text-xs text-charcoal/55">Founder, The Bharat Project &middot; Founder, YourStory</p>
          </div>
        </Reveal>

        {/* Founder Quote & Cities Card */}
        <div className="flex w-full flex-col justify-center text-left">
          <Reveal delay={0.08}>
            <Quote size={28} className="text-saffron-600/30 sm:w-9 sm:h-9" strokeWidth={1.6} />
            <blockquote className="mt-2 sm:mt-3 font-display text-base sm:text-xl lg:text-[1.7rem] font-medium leading-[1.45] text-charcoal">
              “Har entrepreneur ko mentor milna chahiye. Chahe woh Delhi mein ho ya Darbhanga. Bharat ke
              har kone mein entrepreneurial talent hai. Hamari zimmedari hai un tak knowledge,
              mentorship aur opportunities pahunchana.{" "}
              <span className="text-saffron-700">ShuruKar isi vision ka agla kadam hai.</span>”
            </blockquote>
            <p className="mt-3 text-xs sm:text-sm font-semibold text-charcoal/70">— Shradha Sharma</p>
          </Reveal>

          <Reveal delay={0.16}>
            <div className="mt-6 sm:mt-8 rounded-2xl sm:rounded-3xl border border-saffron-600/10 bg-white p-4 sm:p-6 shadow-[0_12px_44px_-30px_rgba(0,0,0,0.4)] md:p-7">
              <p className="text-[10px] sm:text-xs font-semibold uppercase tracking-[0.16em] text-saffron-700">
                Bharat bhar se seekha
              </p>
              <p className="mt-1.5 font-display text-sm sm:text-base font-medium text-charcoal md:text-lg">
                Pichhle ek saal mein hum entrepreneurs se mile
              </p>
              <div className="no-scrollbar -mx-1 mt-3 flex gap-2 overflow-x-auto px-1 pb-2 scroll-smooth touch-pan-x">
                {CITIES.map((c) => (
                  <span
                    key={c}
                    data-testid={`city-chip-${c}`}
                    className="shrink-0 rounded-full border border-saffron-600/15 bg-cream px-3 py-1 sm:px-4 sm:py-2 text-xs sm:text-sm font-medium text-charcoal/75 transition-colors duration-200 hover:border-saffron-600/50 hover:text-saffron-700"
                  >
                    {c}
                  </span>
                ))}
              </div>
              <p className="mt-3 text-xs sm:text-sm leading-relaxed text-charcoal/60">
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
