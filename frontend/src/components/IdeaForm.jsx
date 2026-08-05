import { useEffect, useRef, useState } from "react";
import axios from "axios";
import { motion } from "framer-motion";
import { CheckCircle2, Loader2, Paperclip, X, Share2, ArrowRight } from "lucide-react";
import { Reveal, SectionLabel } from "@/components/shared";

const API = `${process.env.REACT_APP_BACKEND_URL}/api`;

const AGE_GROUPS = ["Under 18", "18-25", "25-35", "35-45", "45+"];
const STAGES = ["Bas idea hai", "Shuru kar chuka hoon", "Already chal raha hai"];
const PLACEHOLDERS = [
  "e.g. Makhana Tiffin Service",
  "e.g. Handmade Products Boutique",
  "e.g. Coaching Centre",
  "e.g. Gaon mein dairy collection centre",
];

const Chip = ({ active, children, onClick, testId }) => (
  <button
    type="button"
    data-testid={testId}
    onClick={onClick}
    className={`rounded-full border px-4 py-2.5 text-sm font-medium transition-[background-color,border-color,color,transform] duration-200 active:scale-95 ${
      active
        ? "border-saffron-600 bg-saffron-600 text-white"
        : "border-charcoal/12 bg-white text-charcoal/70 hover:border-saffron-600/60 hover:text-saffron-700"
    }`}
  >
    {children}
  </button>
);

const Field = ({ label, error, children, hint }) => (
  <div>
    <label className="mb-2 block font-display text-sm font-medium text-charcoal">{label}</label>
    {children}
    {hint && !error && <p className="mt-1.5 text-xs text-charcoal/45">{hint}</p>}
    {error && <p className="mt-1.5 text-xs font-medium text-red-600">{error}</p>}
  </div>
);

const inputCls =
  "w-full rounded-2xl border border-charcoal/12 bg-white px-4 py-3.5 text-[15px] text-charcoal outline-none transition-[border-color,box-shadow] duration-200 placeholder:text-charcoal/35 focus:border-saffron-600 focus:ring-4 focus:ring-saffron-600/12";

const Confetti = () => (
  <div className="pointer-events-none absolute inset-0 overflow-hidden">
    {Array.from({ length: 26 }).map((_, i) => (
      <motion.span
        key={i}
        initial={{ y: -20, opacity: 0, rotate: 0 }}
        animate={{ y: 420, opacity: [0, 1, 1, 0], rotate: 360 }}
        transition={{ duration: 2.4 + (i % 5) * 0.35, delay: i * 0.05, ease: "easeIn" }}
        className="absolute h-2 w-2 rounded-sm"
        style={{
          left: `${(i * 37) % 100}%`,
          background: ["#EA580C", "#F97316", "#FBBF24", "#14213D"][i % 4],
        }}
      />
    ))}
  </div>
);

export const IdeaForm = () => {
  const [form, setForm] = useState({
    full_name: "", mobile: "", email: "", city: "", age_group: "",
    idea: "", stage: "", needs_inspiration: false, notify_consent: false,
  });
  const [errors, setErrors] = useState({});
  const [status, setStatus] = useState("idle");
  const [file, setFile] = useState(null);
  const [uploading, setUploading] = useState(false);
  const [phIndex, setPhIndex] = useState(0);
  const fileRef = useRef(null);

  useEffect(() => {
    const t = setInterval(() => setPhIndex((i) => (i + 1) % PLACEHOLDERS.length), 2800);
    return () => clearInterval(t);
  }, []);

  const set = (k, v) => {
    setForm((f) => ({ ...f, [k]: v }));
    setErrors((e) => ({ ...e, [k]: undefined }));
  };

  const validate = () => {
    const e = {};
    if (form.full_name.trim().length < 2) e.full_name = "Apna poora naam likhiye";
    if (!/^[6-9]\d{9}$/.test(form.mobile.replace(/\D/g, ""))) e.mobile = "Mobile number check kar lijiye — 10 digit";
    if (form.email && !/^\S+@\S+\.\S+$/.test(form.email)) e.email = "Email theek se likhiye";
    if (form.city.trim().length < 2) e.city = "Apna sheher ya kasba likhiye";
    if (!form.age_group) e.age_group = "Age group choose kariye";
    if (!form.needs_inspiration && form.idea.trim().length < 10) e.idea = "Do line mein apna idea bata dijiye";
    if (!form.notify_consent) e.notify_consent = "Yeh tick karna zaroori hai";
    setErrors(e);
    return Object.keys(e).length === 0;
  };

  const pickFile = async (f) => {
    if (!f) return;
    setFile({ name: f.name, path: null });
    setUploading(true);
    try {
      const fd = new FormData();
      fd.append("file", f);
      const { data } = await axios.post(`${API}/upload`, fd);
      setFile({ name: data.filename, path: data.path });
    } catch (err) {
      setErrors((e) => ({ ...e, file: err?.response?.data?.detail || "File upload nahi ho paayi" }));
      setFile(null);
    } finally {
      setUploading(false);
    }
  };

  const submit = async (ev) => {
    ev.preventDefault();
    if (!validate()) return;
    setStatus("loading");
    try {
      // NOTE: wire a real CRM / Google Sheet / WhatsApp campaign to this endpoint.
      // Data is also exportable at GET /api/admin/export.csv for the app-launch migration.
      await axios.post(`${API}/submit-idea`, {
        ...form,
        mobile: form.mobile.replace(/\D/g, ""),
        email: form.email || null,
        idea: form.needs_inspiration ? null : form.idea,
        stage: form.stage || null,
        attachment_path: file?.path || null,
        attachment_name: file?.name || null,
      });
      setStatus("done");
    } catch (err) {
      setStatus("idle");
      setErrors({ submit: err?.response?.data?.detail?.[0]?.msg || "Kuch gadbad ho gayi. Dobara try kariye." });
    }
  };

  const reset = () => {
    setForm({ full_name: "", mobile: "", email: "", city: "", age_group: "", idea: "", stage: "", needs_inspiration: false, notify_consent: false });
    setFile(null);
    setErrors({});
    setStatus("idle");
  };

  const shareText = encodeURIComponent(
    "Main ne apna business idea ShuruKar par submit kiya. Aap bhi kariye — Hokar Nidar… Shuru Kar. https://shurukar.in"
  );

  return (
    <section id="submit" className="relative overflow-hidden py-20 md:py-28">
      <div className="pointer-events-none absolute -left-24 top-1/4 h-[340px] w-[340px] rounded-full bg-saffron-200/45 blur-[110px]" />
      <div className="relative mx-auto max-w-3xl px-5 md:px-8">
        <div className="text-center">
          <Reveal><SectionLabel>Submit Idea</SectionLabel></Reveal>
          <Reveal delay={0.06}>
            <h2 className="mt-6 font-display text-3xl font-bold leading-tight tracking-tight text-charcoal sm:text-4xl lg:text-[2.7rem]">
              Kya Aapke Paas Bhi Ek Idea Hai?
            </h2>
          </Reveal>
          <Reveal delay={0.12}>
            <p className="mx-auto mt-4 max-w-lg text-sm leading-relaxed text-charcoal/60 md:text-base">
              Perfect hona zaroori nahi. Bas share kariye. Baaki safar milkar tay karenge.
            </p>
          </Reveal>
        </div>

        <Reveal delay={0.16}>
          <div className="relative mt-10 overflow-hidden rounded-[32px] border border-saffron-600/12 bg-white p-6 shadow-[0_30px_70px_-40px_rgba(20,33,61,0.4)] md:p-10">
            {status === "done" ? (
              <div data-testid="submit-success" className="relative py-6 text-center">
                <Confetti />
                <motion.div
                  initial={{ scale: 0.5, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  transition={{ type: "spring", stiffness: 200, damping: 14 }}
                  className="mx-auto flex h-20 w-20 items-center justify-center rounded-full bg-saffron-50"
                >
                  <CheckCircle2 size={44} className="text-saffron-600" strokeWidth={2} />
                </motion.div>
                <h3 className="mt-7 font-display text-2xl font-bold text-charcoal md:text-3xl">Shukriya!</h3>
                <p className="mx-auto mt-4 max-w-md text-sm leading-relaxed text-charcoal/65 md:text-base">
                  Aapka idea humtak pahunch gaya. Jaise hi ShuruKar app live hoga, aapko sabse pehle batayenge.
                </p>
                <button
                  data-testid="submit-another"
                  onClick={reset}
                  className="mt-8 inline-flex items-center gap-2 rounded-full bg-saffron-600 px-6 py-3 font-display text-sm font-semibold text-white transition-[background-color,transform] duration-300 hover:-translate-y-0.5 hover:bg-saffron-700"
                >
                  Ek aur idea submit karna hai? <ArrowRight size={16} />
                </button>

                <div className="mt-10 border-t border-charcoal/10 pt-7">
                  <p className="flex items-center justify-center gap-2 font-display text-sm font-medium text-charcoal">
                    <Share2 size={16} className="text-saffron-600" /> Apne doston ko bhi batayein
                  </p>
                  <div className="mt-4 flex flex-wrap justify-center gap-2.5">
                    <a
                      data-testid="share-whatsapp"
                      href={`https://wa.me/?text=${shareText}`}
                      target="_blank" rel="noreferrer"
                      className="rounded-full border border-charcoal/12 px-5 py-2.5 text-sm font-medium text-charcoal/70 transition-colors hover:border-emerald-500 hover:text-emerald-600"
                    >
                      WhatsApp
                    </a>
                    <a
                      data-testid="share-x"
                      href={`https://twitter.com/intent/tweet?text=${shareText}`}
                      target="_blank" rel="noreferrer"
                      className="rounded-full border border-charcoal/12 px-5 py-2.5 text-sm font-medium text-charcoal/70 transition-colors hover:border-charcoal hover:text-charcoal"
                    >
                      X
                    </a>
                    <a
                      data-testid="share-instagram"
                      href="https://www.instagram.com/thebharatproject_"
                      target="_blank" rel="noreferrer"
                      className="rounded-full border border-charcoal/12 px-5 py-2.5 text-sm font-medium text-charcoal/70 transition-colors hover:border-pink-500 hover:text-pink-600"
                    >
                      Instagram
                    </a>
                  </div>
                </div>
              </div>
            ) : (
              <form onSubmit={submit} className="space-y-6" data-testid="idea-form" noValidate>
                <Field label="Poora naam" error={errors.full_name}>
                  <input
                    data-testid="input-name"
                    className={inputCls}
                    placeholder="Aapka naam"
                    value={form.full_name}
                    onChange={(e) => set("full_name", e.target.value)}
                  />
                </Field>

                <Field label="Mobile number" error={errors.mobile} hint="Isi number par app launch ki khabar denge">
                  <div className="flex items-stretch gap-2">
                    <span className="flex items-center rounded-2xl border border-charcoal/12 bg-cream px-4 font-display text-[15px] font-medium text-charcoal/60">
                      +91
                    </span>
                    <input
                      data-testid="input-mobile"
                      inputMode="numeric"
                      maxLength={10}
                      className={inputCls}
                      placeholder="10 digit number"
                      value={form.mobile}
                      onChange={(e) => set("mobile", e.target.value.replace(/\D/g, "").slice(0, 10))}
                    />
                  </div>
                </Field>

                <Field label="Email (optional)" error={errors.email}>
                  <input
                    data-testid="input-email"
                    className={inputCls}
                    placeholder="aapka@email.com"
                    value={form.email}
                    onChange={(e) => set("email", e.target.value)}
                  />
                </Field>

                <Field label="Sheher / kasba" error={errors.city}>
                  <input
                    data-testid="input-city"
                    className={inputCls}
                    placeholder="Jaise Muzaffarpur, Bhilai, Indore…"
                    value={form.city}
                    onChange={(e) => set("city", e.target.value)}
                  />
                </Field>

                <Field label="Aapki umar" error={errors.age_group}>
                  <div className="flex flex-wrap gap-2.5">
                    {AGE_GROUPS.map((a) => (
                      <Chip key={a} testId={`chip-age-${a}`} active={form.age_group === a} onClick={() => set("age_group", a)}>
                        {a}
                      </Chip>
                    ))}
                  </div>
                </Field>

                <div className="rounded-2xl bg-cream p-4">
                  <label className="flex cursor-pointer items-start gap-3">
                    <input
                      data-testid="toggle-no-idea"
                      type="checkbox"
                      checked={form.needs_inspiration}
                      onChange={(e) => set("needs_inspiration", e.target.checked)}
                      className="mt-0.5 h-5 w-5 shrink-0 accent-saffron-600"
                    />
                    <span className="text-sm font-medium text-charcoal/75">
                      Mujhe idea nahi hai, mujhe inspiration chahiye
                      <span className="mt-0.5 block text-xs font-normal text-charcoal/45">
                        Sirf apna number chhod dijiye — hum launch par ideas bhejenge
                      </span>
                    </span>
                  </label>
                </div>

                {!form.needs_inspiration && (
                  <>
                    <Field label="Aapka business idea" error={errors.idea}>
                      <textarea
                        data-testid="input-idea"
                        rows={4}
                        className={`${inputCls} resize-none`}
                        placeholder={PLACEHOLDERS[phIndex]}
                        value={form.idea}
                        onChange={(e) => set("idea", e.target.value)}
                      />
                    </Field>

                    <Field label="Aap kis stage par hain? (optional)">
                      <div className="flex flex-wrap gap-2.5">
                        {STAGES.map((s) => (
                          <Chip key={s} testId={`chip-stage-${s}`} active={form.stage === s} onClick={() => set("stage", form.stage === s ? "" : s)}>
                            {s}
                          </Chip>
                        ))}
                      </div>
                    </Field>
                  </>
                )}

                <Field label="Sketch, product photo ya document (optional)" error={errors.file}>
                  <div className="flex flex-wrap items-center gap-3 rounded-2xl border border-dashed border-charcoal/15 bg-cream/60 p-4">
                    <button
                      type="button"
                      data-testid="file-browse"
                      onClick={() => fileRef.current?.click()}
                      className="inline-flex items-center gap-2 rounded-full border border-charcoal/12 bg-white px-4 py-2.5 text-sm font-medium text-charcoal/70 transition-colors hover:border-saffron-600 hover:text-saffron-700"
                    >
                      <Paperclip size={15} /> or browse files
                    </button>
                    {uploading && <Loader2 size={16} className="animate-spin text-saffron-600" />}
                    {file && (
                      <span className="inline-flex items-center gap-2 rounded-full bg-saffron-50 px-3.5 py-2 text-xs font-medium text-saffron-700">
                        {file.name}
                        <button type="button" onClick={() => setFile(null)} aria-label="Remove file">
                          <X size={13} />
                        </button>
                      </span>
                    )}
                    <input
                      ref={fileRef}
                      type="file"
                      accept=".jpg,.jpeg,.png,.webp,.gif,.pdf"
                      className="hidden"
                      onChange={(e) => pickFile(e.target.files?.[0])}
                    />
                  </div>
                </Field>

                <div>
                  <label className="flex cursor-pointer items-start gap-3">
                    <input
                      data-testid="checkbox-consent"
                      type="checkbox"
                      checked={form.notify_consent}
                      onChange={(e) => set("notify_consent", e.target.checked)}
                      className="mt-0.5 h-5 w-5 shrink-0 accent-saffron-600"
                    />
                    <span className="text-sm text-charcoal/75">
                      Mujhe ShuruKar app launch hone par sabse pehle सूचना chahiye
                    </span>
                  </label>
                  {errors.notify_consent && (
                    <p className="mt-1.5 text-xs font-medium text-red-600">{errors.notify_consent}</p>
                  )}
                </div>

                {errors.submit && (
                  <p data-testid="submit-error" className="rounded-xl bg-red-50 px-4 py-3 text-sm font-medium text-red-600">
                    {errors.submit}
                  </p>
                )}

                <button
                  type="submit"
                  data-testid="submit-idea-btn"
                  disabled={status === "loading" || uploading}
                  className="inline-flex w-full items-center justify-center gap-2 rounded-full bg-saffron-600 px-8 py-4 font-display text-base font-semibold text-white shadow-[0_14px_36px_-12px_rgba(234,88,12,0.7)] transition-[background-color,transform] duration-300 hover:-translate-y-0.5 hover:bg-saffron-700 disabled:opacity-60 md:w-auto"
                >
                  {status === "loading" ? <Loader2 size={18} className="animate-spin" /> : null}
                  Apna Idea Submit Karein
                </button>
              </form>
            )}
          </div>
        </Reveal>
      </div>
    </section>
  );
};
