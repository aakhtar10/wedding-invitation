"use client";

import { useEffect, useState } from "react";
import {
  AnimatePresence,
  motion,
  MotionConfig,
  type Variants,
} from "framer-motion";
import Image from "next/image";
import { Italiana } from "next/font/google";

const display = Italiana({ subsets: ["latin"], weight: "400" });

/* ---------- Edit these ---------- */
const WEDDING = new Date("2026-12-27T00:00:00+05:30");
const DATE_LINE = "Sunday · 27 December 2026";

// Red accent (same as the closing section)
const RED = "#5a1827";
const GOLD_LIGHT = "#e6cf9f";

const DAY = 86_400_000;

/* Arch silhouette, same idea as the ceremony cards */
const ARCH = "50% 50% 0.9rem 0.9rem / 2.6rem 2.6rem 0.9rem 0.9rem";
const ARCH_INNER = "50% 50% 0.65rem 0.65rem / 2.3rem 2.3rem 0.65rem 0.65rem";

/* ---------- Time logic ---------- */
type Phase = "before" | "today" | "after";

type Countdown = {
  phase: Phase;
  days: number;
  hours: number;
  minutes: number;
  seconds: number;
};

const ZERO: Countdown = {
  phase: "before",
  days: 0,
  hours: 0,
  minutes: 0,
  seconds: 0,
};

function getCountdown(now = Date.now()): Countdown {
  const diff = WEDDING.getTime() - now;

  if (diff <= 0) {
    // The wedding day itself, then afterwards
    return { ...ZERO, phase: now < WEDDING.getTime() + DAY ? "today" : "after" };
  }

  return {
    phase: "before",
    days: Math.floor(diff / DAY),
    hours: Math.floor((diff / 3_600_000) % 24),
    minutes: Math.floor((diff / 60_000) % 60),
    seconds: Math.floor((diff / 1000) % 60),
  };
}

/* ---------- Animation ---------- */
const stagger: Variants = {
  hidden: {},
  show: { transition: { staggerChildren: 0.12, delayChildren: 0.1 } },
};

const fadeUp: Variants = {
  hidden: { opacity: 0, y: 16, filter: "blur(5px)" },
  show: {
    opacity: 1,
    y: 0,
    filter: "blur(0px)",
    transition: { duration: 0.8, ease: "easeOut" },
  },
};

const unitRise: Variants = {
  hidden: { opacity: 0, y: 26, scale: 0.92, filter: "blur(6px)" },
  show: {
    opacity: 1,
    y: 0,
    scale: 1,
    filter: "blur(0px)",
    transition: { duration: 0.9, ease: "easeOut" },
  },
};

/* ---------- Pieces ---------- */
function Unit({
  value,
  label,
  tick = false,
}: {
  value: number;
  label: string;
  tick?: boolean;
}) {
  const text = String(value).padStart(2, "0");

  return (
    <motion.div variants={unitRise} className="flex flex-col items-center">
      <div className="relative aspect-[3/4] w-full">
        {/* one soft ring per second on the seconds card */}
        {tick && (
          <motion.span
            key={value}
            aria-hidden
            className="pointer-events-none absolute inset-0 border border-wedding-gold"
            style={{ borderRadius: ARCH }}
            initial={{ opacity: 0.55, scale: 1 }}
            animate={{ opacity: 0, scale: 1.14 }}
            transition={{ duration: 0.9, ease: "easeOut" }}
          />
        )}

        <div
          className="absolute inset-0 overflow-hidden bg-wedding-gold shadow-[0_10px_28px_rgba(169,130,82,0.28)]"
          style={{ borderRadius: ARCH }}
        >
          {/* light from the top of the arch */}
          <div
            aria-hidden
            className="pointer-events-none absolute inset-0"
            style={{
              background:
                "linear-gradient(165deg, rgba(255,253,248,0.38), transparent 55%, rgba(90,24,39,0.12))",
            }}
          />

          {/* inner hairline frame */}
          <div
            aria-hidden
            className="pointer-events-none absolute inset-[5px] border border-wedding-surface/45"
            style={{ borderRadius: ARCH_INNER }}
          />

          {/* rolling digits */}
          <div
            className={`absolute inset-0 flex items-center justify-center pt-3 ${display.className}`}
          >
            <div
              className="relative h-[1.1em] w-[1.3em] overflow-hidden text-4xl leading-none text-wedding-surface sm:text-5xl"
              style={{ textShadow: "0 1px 0 rgba(90,24,39,0.28)" }}
            >
              <AnimatePresence initial={false} mode="popLayout">
                <motion.span
                  key={text}
                  className="absolute inset-0 flex items-center justify-center"
                  initial={{ y: "75%", opacity: 0 }}
                  animate={{ y: "0%", opacity: 1 }}
                  exit={{ y: "-75%", opacity: 0 }}
                  transition={{ duration: 0.45, ease: "easeOut" }}
                >
                  {text}
                </motion.span>
              </AnimatePresence>
            </div>
          </div>
        </div>
      </div>

      <span className="wedding-caption mt-3">{label}</span>
    </motion.div>
  );
}

function Ornament() {
  return (
    <div className="flex items-center justify-center gap-3" aria-hidden>
      <span className="h-px w-12 bg-wedding-gold/50" />
      <span className="h-1.5 w-1.5 rotate-45 bg-wedding-gold/60" />
      <span className="h-px w-12 bg-wedding-gold/50" />
    </div>
  );
}

export default function WeddingCountdown() {
  // null until mounted, so server and client markup always match
  const [time, setTime] = useState<Countdown | null>(null);

  useEffect(() => {
    const tick = () => setTime(getCountdown());
    tick();
    const id = setInterval(tick, 1000);
    return () => clearInterval(id);
  }, []);

  const t = time ?? ZERO;

  return (
    <MotionConfig reducedMotion="user">
      <section className="relative bg-wedding-primary px-6 py-24">
        {/* ---------- Atmosphere ---------- */}
        <div
          aria-hidden
          className="pointer-events-none absolute inset-0"
          style={{
            background:
              "radial-gradient(80% 45% at 50% 18%, rgba(244,199,195,0.55), transparent 70%)",
          }}
        />
        <div
          aria-hidden
          className="pointer-events-none absolute inset-0"
          style={{
            backgroundImage:
              "linear-gradient(45deg, rgba(201,169,110,0.14) 1px, transparent 1px), linear-gradient(-45deg, rgba(201,169,110,0.14) 1px, transparent 1px)",
            backgroundSize: "28px 28px",
            WebkitMaskImage:
              "linear-gradient(to bottom, transparent 0%, black 30%, transparent 85%)",
            maskImage:
              "linear-gradient(to bottom, transparent 0%, black 30%, transparent 85%)",
          }}
        />

        {/* TOP FLORAL DIVIDER */}
        <Image
          src="/wedding/floral-divider.webp"
          alt=""
          width={1000}
          height={60}
          className="pointer-events-none absolute left-1/2 top-1 w-full max-w-4xl -translate-x-1/2 -translate-y-1/2 select-none object-cover"
        />

        <motion.div
          variants={stagger}
          initial="hidden"
          whileInView="show"
          viewport={{ once: true, amount: 0.2 }}
          className="relative z-10 mx-auto w-full max-w-md text-center"
        >
          {/* EYEBROW */}
          <motion.p variants={fadeUp} className="wedding-eyebrow mb-4">
            The countdown begins
          </motion.p>

          {/* TITLE */}
          <motion.h2 variants={fadeUp} className="wedding-section-title">
            Counting the moments
          </motion.h2>

          {/* DESCRIPTION */}
          <motion.p
            variants={fadeUp}
            className="wedding-body mx-auto mt-4 max-w-xs"
          >
            Until the day we begin our forever.
          </motion.p>

          {/* DATE PILL */}
          <motion.p
            variants={fadeUp}
            className="mx-auto mt-6 inline-block rounded-full px-5 py-1.5 font-body text-[0.62rem] uppercase tracking-[0.3em]"
            style={{ backgroundColor: RED, color: GOLD_LIGHT }}
          >
            {DATE_LINE}
          </motion.p>

          <motion.div variants={fadeUp} className="my-9">
            <Ornament />
          </motion.div>

          {/* COUNTDOWN */}
          {t.phase === "before" && (
            <motion.div
              variants={stagger}
              role="group"
              aria-label={`${t.days} days, ${t.hours} hours, ${t.minutes} minutes and ${t.seconds} seconds to go`}
              className="grid grid-cols-4 gap-2.5 sm:gap-4"
            >
              <Unit value={t.days} label="Days" />
              <Unit value={t.hours} label="Hours" />
              <Unit value={t.minutes} label="Minutes" />
              <Unit value={t.seconds} label="Seconds" tick />
            </motion.div>
          )}

          {t.phase === "today" && (
            <motion.div variants={fadeUp} className="py-4">
              <p className="font-allura text-6xl leading-none text-wedding-text">
                Today is the day
              </p>
              <p className="wedding-body mt-4">
                Alhamdulillah. Our forever begins today.
              </p>
            </motion.div>
          )}

          {t.phase === "after" && (
            <motion.div variants={fadeUp} className="py-4">
              <p className="font-allura text-6xl leading-none text-wedding-text">
                Our forever has begun
              </p>
              <p className="wedding-body mt-4">
                Thank you for celebrating with us. Alhamdulillah.
              </p>
            </motion.div>
          )}

          {/* BOTTOM MESSAGE */}
          <motion.p
            variants={fadeUp}
            className="wedding-caption mx-auto mt-10 max-w-xs"
          >
            ✦ A moment we will cherish forever ✦
          </motion.p>
        </motion.div>

        {/* BOTTOM FLORAL DIVIDER */}
        <Image
          src="/wedding/floral-divider.webp"
          alt=""
          width={1000}
          height={60}
          className="pointer-events-none absolute -bottom-2 left-1/2 z-10 w-full max-w-4xl -translate-x-1/2 translate-y-1/2 select-none object-cover"
        />
      </section>
    </MotionConfig>
  );
}