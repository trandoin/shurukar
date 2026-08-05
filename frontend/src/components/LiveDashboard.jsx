import { useEffect, useState } from "react";
import axios from "axios";
import Marquee from "react-fast-marquee";
import { Bar, BarChart, Cell, ResponsiveContainer, XAxis, Tooltip } from "recharts";
import { MapPin, Sparkles, TrendingUp } from "lucide-react";
import { Counter, Reveal, SectionLabel } from "@/components/shared";

const API = `${process.env.REACT_APP_BACKEND_URL}/api`;

// DUMMY DATA — illustrative until enough real submissions exist.
const FALLBACK_AGE = [
  { group: "Under 18", count: 320 },
  { group: "18-25", count: 1840 },
  { group: "25-35", count: 1620 },
  { group: "35-45", count: 890 },
  { group: "45+", count: 410 },
];

// DUMMY FEED — replaced by real anonymised submissions as they come in.
const FALLBACK_FEED = [
  { city: "Muzaffarpur", idea: "Dairy business", ago: "2 min pehle" },
  { city: "Jaipur", idea: "Handmade juti boutique", ago: "9 min pehle" },
  { city: "Coimbatore", idea: "Cloud kitchen", ago: "17 min pehle" },
  { city: "Bhilai", idea: "Coaching centre", ago: "24 min pehle" },
  { city: "Lucknow", idea: "Makhana packaging unit", ago: "38 min pehle" },
  { city: "Guwahati", idea: "Organic tea brand", ago: "52 min pehle" },
  { city: "Indore", idea: "Tiffin service", ago: "1 ghanta pehle" },
  { city: "Kanpur", idea: "Leather accessories export", ago: "1 ghanta pehle" },
  { city: "Srinagar", idea: "Pashmina D2C store", ago: "2 ghante pehle" },
  { city: "Darbhanga", idea: "Kirana delivery app", ago: "3 ghante pehle" },
];

const timeAgo = (iso) => {
  const mins = Math.max(1, Math.round((Date.now() - new Date(iso).getTime()) / 60000));
  if (mins < 60) return `${mins} min pehle`;
  const hrs = Math.round(mins / 60);
  if (hrs < 24) return `${hrs} ghante pehle`;
  return `${Math.round(hrs / 24)} din pehle`;
};

export const LiveDashboard = () => {
  const [stats, setStats] = useState(null);
  const [feed, setFeed] = useState(FALLBACK_FEED);

  useEffect(() => {
    let alive = true;
    const load = async () => {
      try {
        const [s, r] = await Promise.all([
          axios.get(`${API}/stats`),
          axios.get(`${API}/recent-submissions?limit=10`),
        ]);
        if (!alive) return;
        setStats(s.data);
        if (r.data?.length >= 5) {
          setFeed(r.data.map((d) => ({ city: d.city, idea: d.idea, ago: timeAgo(d.created_at) })));
        }
      } catch (e) {
        /* dashboard falls back to illustrative data */
      }
    };
    load();
    const t = setInterval(load, 30000);
    return () => {
      alive = false;
      clearInterval(t);
    };
  }, []);

  const ageData = stats && !stats.age_data_is_illustrative ? stats.age_breakdown : FALLBACK_AGE;
  const isIllustrative = !stats || stats.age_data_is_illustrative;
  const maxAge = Math.max(...ageData.map((d) => d.count), 1);

  const cards = [
    { icon: Sparkles, label: "Total Ideas Submitted", value: stats?.total_ideas ?? 5127, testId: "stat-total-ideas" },
    { icon: MapPin, label: "Cities Represented", value: stats?.cities ?? 412, testId: "stat-cities" },
    { icon: TrendingUp, label: "Aaj ke Submissions", value: stats?.today ?? 0, testId: "stat-today" },
  ];

  return (
    <section className="relative overflow-hidden bg-ink py-20 md:py-28">
      <div className="grain absolute inset-0" />
      <div className="pointer-events-none absolute -left-32 top-10 h-[360px] w-[360px] rounded-full bg-saffron-600/20 blur-[110px]" />
      <div className="relative mx-auto max-w-7xl px-5 md:px-8">
        <Reveal>
          <div className="inline-flex items-center gap-2 rounded-full border border-white/15 bg-white/10 px-4 py-1.5 text-xs font-semibold uppercase tracking-[0.18em] text-saffron-200">
            <span className="h-1.5 w-1.5 animate-pulse rounded-full bg-emerald-400" />
            Live
          </div>
        </Reveal>
        <Reveal delay={0.06}>
          <h2 className="mt-6 font-display text-3xl font-bold tracking-tight text-white sm:text-4xl lg:text-[2.9rem]">
            Bharat ke Ideas — <span className="text-saffron-400">Live</span>
          </h2>
        </Reveal>
        <Reveal delay={0.1}>
          <p className="mt-4 max-w-xl text-sm leading-relaxed text-white/60 md:text-base">
            Har roz Bharat ke kone-kone se naye ideas aa rahe hain. Aap bhi jud jaaiye.
          </p>
        </Reveal>

        <div className="mt-12 grid gap-4 md:grid-cols-3">
          {cards.map((c, i) => (
            <Reveal key={c.label} delay={i * 0.08}>
              <div className="rounded-3xl border border-white/10 bg-white/[0.06] p-6 backdrop-blur-md transition-[transform,background-color] duration-300 hover:-translate-y-1 hover:bg-white/[0.1]">
                <c.icon size={20} className="text-saffron-400" strokeWidth={1.8} />
                <p className="mt-5 font-display text-4xl font-bold tracking-tight text-white md:text-5xl">
                  <Counter to={c.value} testId={c.testId} />
                </p>
                <p className="mt-2 text-sm text-white/55">{c.label}</p>
              </div>
            </Reveal>
          ))}
        </div>

        <Reveal delay={0.12}>
          <div className="mt-5 rounded-3xl border border-white/10 bg-white/[0.06] p-6 backdrop-blur-md md:p-8">
            <div className="flex flex-wrap items-baseline justify-between gap-2">
              <p className="font-display text-lg font-semibold text-white">Kaun submit kar raha hai — Age group</p>
              {isIllustrative && (
                <span className="rounded-full bg-white/10 px-3 py-1 text-[11px] italic text-white/50">
                  Illustrative data
                </span>
              )}
            </div>
            <div className="mt-6 h-[220px]" data-testid="age-chart">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={ageData} barCategoryGap="28%">
                  <XAxis
                    dataKey="group"
                    stroke="rgba(255,255,255,0.4)"
                    tickLine={false}
                    axisLine={false}
                    tick={{ fontSize: 12 }}
                  />
                  <Tooltip
                    cursor={{ fill: "rgba(255,255,255,0.05)" }}
                    contentStyle={{
                      background: "#1A1A1A",
                      border: "1px solid rgba(255,255,255,0.12)",
                      borderRadius: 12,
                      fontSize: 12,
                    }}
                    labelStyle={{ color: "#fff" }}
                  />
                  <Bar dataKey="count" radius={[10, 10, 0, 0]}>
                    {ageData.map((d, i) => (
                      <Cell key={i} fill={d.count === maxAge ? "#F97316" : "#C2410C"} />
                    ))}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>
        </Reveal>

        <Reveal delay={0.16}>
          <div className="mt-5 overflow-hidden rounded-3xl border border-white/10 bg-white/[0.04] py-5">
            <p className="px-6 pb-4 text-xs font-semibold uppercase tracking-[0.16em] text-white/40">
              Abhi abhi aaye ideas
            </p>
            <Marquee gradient={false} speed={38} pauseOnHover>
              {feed.map((f, i) => (
                <div
                  key={i}
                  data-testid={`feed-item-${i}`}
                  className="mx-2 flex min-w-[290px] items-start gap-3 rounded-2xl border border-white/10 bg-ink/60 px-5 py-4"
                >
                  <span className="mt-1 h-2 w-2 shrink-0 rounded-full bg-emerald-400" />
                  <div>
                    <p className="text-[13px] leading-snug text-white/85">
                      Ek entrepreneur from <span className="font-semibold text-saffron-300">{f.city}</span> ne{" "}
                      {f.idea} ka idea submit kiya
                    </p>
                    <p className="mt-1 text-[11px] text-white/40">{f.ago}</p>
                  </div>
                </div>
              ))}
            </Marquee>
          </div>
        </Reveal>
      </div>
    </section>
  );
};
