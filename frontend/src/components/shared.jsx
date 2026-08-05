import { motion, useInView } from "framer-motion";
import { useEffect, useRef, useState } from "react";

export const Reveal = ({ children, delay = 0, className = "", as: Tag = "div" }) => {
  const MotionTag = motion[Tag] || motion.div;
  return (
    <MotionTag
      className={className}
      initial={{ opacity: 0, y: 24 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-60px" }}
      transition={{ duration: 0.55, delay, ease: [0.22, 1, 0.36, 1] }}
    >
      {children}
    </MotionTag>
  );
};

export const Counter = ({ to, duration = 1600, suffix = "", prefix = "", testId }) => {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: "-40px" });
  const [value, setValue] = useState(0);

  useEffect(() => {
    if (!inView) return;
    let raf;
    const start = performance.now();
    const tick = (now) => {
      const p = Math.min((now - start) / duration, 1);
      const eased = 1 - Math.pow(1 - p, 3);
      setValue(Math.round(to * eased));
      if (p < 1) raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, [inView, to, duration]);

  return (
    <span ref={ref} data-testid={testId}>
      {prefix}
      {value.toLocaleString("en-IN")}
      {suffix}
    </span>
  );
};

export const scrollToId = (id) => {
  const el = document.querySelector(id);
  if (el) el.scrollIntoView({ behavior: "smooth", block: "start" });
};

export const CTAButton = ({ children, onClick, testId, variant = "solid", className = "" }) => {
  const base =
    "inline-flex items-center justify-center gap-2 rounded-full font-display font-semibold px-7 py-3.5 text-sm md:text-base transition-[transform,background-color,box-shadow,color] duration-300 active:scale-[0.98]";
  const styles =
    variant === "solid"
      ? "bg-saffron-600 text-white shadow-[0_10px_30px_-8px_rgba(234,88,12,0.6)] hover:bg-saffron-700 hover:-translate-y-0.5"
      : "border border-charcoal/15 text-charcoal hover:border-saffron-600 hover:text-saffron-700 hover:-translate-y-0.5 bg-white/60";
  return (
    <button data-testid={testId} onClick={onClick} className={`${base} ${styles} ${className}`}>
      {children}
    </button>
  );
};

export const SectionLabel = ({ children }) => (
  <div className="inline-flex items-center gap-2 rounded-full bg-saffron-100/70 px-4 py-1.5 text-xs font-semibold uppercase tracking-[0.18em] text-saffron-700">
    <span className="h-1.5 w-1.5 rounded-full bg-saffron-600" />
    {children}
  </div>
);
