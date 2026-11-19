"use client";

import { motion, MotionConfig } from "framer-motion";
import { Heart } from "lucide-react";
import Image from "next/image";

/* ---------- Configuration ---------- */

const COUPLE = "Arsalan & Maria";
const RED = "#5a1827";

/* ---------- Animations ---------- */

const fadeUp = {
  hidden: { opacity: 0, y: 12 },
  show: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.6, ease: "easeOut" as const },
  },
};

/* ---------- Component ---------- */

export default function WeddingClosing() {
  return (
    <MotionConfig reducedMotion="user">
      <section className="relative isolate overflow-hidden bg-wedding-secondary px-6 pb-28 pt-24">
        <motion.div
          initial="hidden"
          whileInView="show"
          viewport={{ once: true, amount: 0.1 }}
          transition={{ staggerChildren: 0.1 }}
          className="relative z-10 mx-auto w-full max-w-sm text-center"
        >
          {/* DECORATIVE DIVIDER */}
          <motion.div
            variants={fadeUp}
            className="mb-6 flex items-center justify-center gap-3"
            aria-hidden="true"
          >
            <span className="h-px w-12 bg-wedding-gold/50" />
            <span className="h-1.5 w-1.5 rotate-45 bg-wedding-gold/60" />
            <span className="h-px w-12 bg-wedding-gold/50" />
          </motion.div>

          <motion.h3
            variants={fadeUp}
            className="font-allura text-5xl leading-none text-wedding-text"
          >
            See you soon
          </motion.h3>

          <motion.p
            variants={fadeUp}
            className="wedding-body mx-auto mt-4 max-w-[17rem]"
          >
            Your love, your duas and your presence mean more to us than any
            gift could.
          </motion.p>

          <motion.p
            variants={fadeUp}
            className="mt-8 font-body text-[0.65rem] uppercase tracking-[0.4em] text-wedding-text/60"
          >
            With love &amp; duas
          </motion.p>

          <motion.p
            variants={fadeUp}
            className="mt-2 font-allura text-4xl leading-tight"
            style={{ color: RED }}
          >
            {COUPLE}
          </motion.p>

          {/* STATIC HEART */}
          <motion.div
            variants={fadeUp}
            className="mt-5 flex justify-center"
            style={{ color: RED }}
          >
            <Heart size={15} strokeWidth={1.4} fill="currentColor" />
          </motion.div>
        </motion.div>

        {/* FLORAL DIVIDER (inside the bottom edge, rotated, since this is the last section) */}
        <Image
          src="/wedding/floral-divider.webp"
          alt=""
          width={1000}
          height={60}
          className="pointer-events-none absolute bottom-0 left-1/2 z-0 w-full max-w-4xl -translate-x-1/2 rotate-180 select-none object-cover"
        />
      </section>
    </MotionConfig>
  );
}