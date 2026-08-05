import { useEffect, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { ArrowRight } from "lucide-react";
import { scrollToId } from "@/components/shared";

export const StickyCTA = () => {
  const [show, setShow] = useState(false);

  useEffect(() => {
    const onScroll = () => setShow(window.scrollY > window.innerHeight * 0.8);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <AnimatePresence>
      {show && (
        <motion.div
          initial={{ y: 90 }}
          animate={{ y: 0 }}
          exit={{ y: 90 }}
          transition={{ duration: 0.3, ease: "easeOut" }}
          className="fixed inset-x-0 bottom-0 z-50 border-t border-saffron-600/15 bg-cream/90 p-3 backdrop-blur-md md:hidden"
        >
          <button
            data-testid="sticky-cta"
            onClick={() => scrollToId("#submit")}
            className="flex w-full items-center justify-center gap-2 rounded-full bg-saffron-600 py-4 font-display text-base font-semibold text-white shadow-[0_10px_30px_-10px_rgba(234,88,12,0.8)] active:scale-[0.98]"
          >
            Apna Idea Submit Karein <ArrowRight size={17} />
          </button>
        </motion.div>
      )}
    </AnimatePresence>
  );
};
