"use client";

import { Clock, MapPin } from "lucide-react";
import { motion, MotionConfig, type Variants } from "framer-motion";
import { Italiana } from "next/font/google";

const display = Italiana({ subsets: ["latin"], weight: "400" });

interface CeremonyCardProps {
  number: string;
  title: string;
  subtitle: string;
  date: string;
  time: string;
  venue: string;
  description: string;
  /** "ivory" matches the site; "maroon" is a dark contrast card */
  tone?: "ivory" | "maroon";
}

/* Arch silhouette: shallower than before so less of the top is dead space */
const ARCH_OUTER = "50% 50% 2rem 2rem / 7.5rem 7.5rem 2rem 2rem";
const ARCH_INNER = "50% 50% 1.5rem 1.5rem / 6.75rem 6.75rem 1.5rem 1.5rem";
const ARCH_INNER_2 = "50% 50% 1.25rem 1.25rem / 6.4rem 6.4rem 1.25rem 1.25rem";

const NOISE =
  "url(\"data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' width='160' height='160'><filter id='n'><feTurbulence type='fractalNoise' baseFrequency='.9' numOctaves='2' stitchTiles='stitch'/><feColorMatrix values='0 0 0 0 0  0 0 0 0 0  0 0 0 0 0  0 0 0 .6 0'/></filter><rect width='100%' height='100%' filter='url(%23n)'/></svg>\")";

const TONES = {
  ivory: {
    card: "bg-wedding-surface shadow-[0_-12px_32px_-16px_rgba(70,40,30,0.35)]",
    gold: "text-wedding-gold-dark",
    ink: "text-wedding-text",
    muted: "text-wedding-text/70",
    line: "bg-wedding-gold/50",
    ring: "border-wedding-gold/50",
    ringSoft: "border-wedding-gold/25",
    rgb: "201,169,110",
    stroke: "rgba(201,169,110,0.5)",
    glow: "rgba(244,199,195,0.6)",
  },
  maroon: {
    card: "bg-[#2a0e16] shadow-[0_-12px_32px_-14px_rgba(0,0,0,0.55)]",
    gold: "text-[#e6cf9f]",
    ink: "text-[#f6ead7]",
    muted: "text-[#f6ead7]/70",
    line: "bg-[#e6cf9f]/45",
    ring: "border-[#e6cf9f]/45",
    ringSoft: "border-[#e6cf9f]/20",
    rgb: "230,207,159",
    stroke: "rgba(230,207,159,0.35)",
    glow: "rgba(168,64,84,0.5)",
  },
} as const;

const container: Variants = {
  hidden: {},
  show: { transition: { staggerChildren: 0.12, delayChildren: 0.15 } },
};

const item: Variants = {
  hidden: { opacity: 0, y: 18, filter: "blur(6px)" },
  show: {
    opacity: 1,
    y: 0,
    filter: "blur(0px)",
    transition: { duration: 0.8, ease: "easeOut" },
  },
};

/* Eight-point star (two overlapping squares), drawn in SVG */
function StarMark({ className }: { className?: string }) {
  return (
    <motion.svg
      aria-hidden
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1"
      className={className}
      variants={{
        hidden: { opacity: 0, rotate: -90, scale: 0.6 },
        show: {
          opacity: 1,
          rotate: 0,
          scale: 1,
          transition: { duration: 1, ease: "easeOut" },
        },
      }}
    >
      <rect x="5" y="5" width="14" height="14" />
      <rect x="5" y="5" width="14" height="14" transform="rotate(45 12 12)" />
      <circle cx="12" cy="12" r="1.6" fill="currentColor" stroke="none" />
    </motion.svg>
  );
}

function Ornament({ line }: { line: string }) {
  return (
    <div className="flex items-center justify-center gap-3" aria-hidden>
      <span className={`h-px w-12 ${line}`} />
      <span className={`h-1.5 w-1.5 rotate-45 ${line}`} />
      <span className={`h-px w-12 ${line}`} />
    </div>
  );
}

export default function CeremonyCard({
  number,
  title,
  subtitle,
  date,
  time,
  venue,
  description,
  tone = "ivory",
}: CeremonyCardProps) {
  const t = TONES[tone];

  return (
    <MotionConfig reducedMotion="user">
      <motion.article
        variants={container}
        initial="hidden"
        whileInView="show"
        viewport={{ once: true, amount: 0.25 }}
        style={{ borderRadius: ARCH_OUTER }}
        className={`relative flex h-full min-h-[31rem] w-full flex-col items-center overflow-hidden px-6 pb-10 pt-[4.5rem] text-center sm:min-h-[34rem] sm:px-10 ${t.card}`}
      >
        {/* ---------- Atmosphere ---------- */}
        <div
          aria-hidden
          className="pointer-events-none absolute inset-0"
          style={{
            background: `radial-gradient(120% 50% at 50% 0%, ${t.glow}, transparent 70%)`,
          }}
        />
        <div
          aria-hidden
          className="pointer-events-none absolute inset-0"
          style={{
            backgroundImage: `linear-gradient(45deg, rgba(${t.rgb},0.16) 1px, transparent 1px), linear-gradient(-45deg, rgba(${t.rgb},0.16) 1px, transparent 1px)`,
            backgroundSize: "26px 26px",
            WebkitMaskImage:
              "linear-gradient(to bottom, black 0%, transparent 55%)",
            maskImage: "linear-gradient(to bottom, black 0%, transparent 55%)",
          }}
        />
        <div
          aria-hidden
          className="pointer-events-none absolute inset-0 opacity-[0.12] mix-blend-multiply"
          style={{ backgroundImage: NOISE }}
        />

        {/* double arch frame */}
        <div
          aria-hidden
          className={`pointer-events-none absolute inset-3 border ${t.ring}`}
          style={{ borderRadius: ARCH_INNER }}
        />
        <div
          aria-hidden
          className={`pointer-events-none absolute inset-[18px] border ${t.ringSoft}`}
          style={{ borderRadius: ARCH_INNER_2 }}
        />

        {/* outlined giant numeral */}
        <motion.span
          aria-hidden
          variants={{
            hidden: { opacity: 0, scale: 0.9 },
            show: {
              opacity: 1,
              scale: 1,
              transition: { duration: 1.2, ease: "easeOut" },
            },
          }}
          className={`pointer-events-none absolute -bottom-12 -right-2 select-none text-[11rem] leading-none text-transparent ${display.className}`}
          style={{ WebkitTextStroke: `1px ${t.stroke}` }}
        >
          {number}
        </motion.span>

        {/* one-time light sweep */}
        <motion.span
          aria-hidden
          variants={{
            hidden: { x: "-150%" },
            show: {
              x: "450%",
              transition: { duration: 1.6, delay: 0.5, ease: "easeInOut" },
            },
          }}
          className="pointer-events-none absolute inset-y-0 left-0 z-20 w-1/3 -skew-x-12"
          style={{
            background:
              "linear-gradient(90deg, transparent, rgba(255,255,255,0.28), transparent)",
          }}
        />

        {/* ---------- Star ornament at the arch apex ---------- */}
        <div className="absolute left-1/2 top-7 z-10 -translate-x-1/2">
          <div className={`flex items-center gap-3 ${t.gold}`}>
            <span aria-hidden className={`h-px w-8 ${t.line}`} />
            <StarMark className="h-5 w-5" />
            <span aria-hidden className={`h-px w-8 ${t.line}`} />
          </div>
        </div>

        {/* ---------- Content ---------- */}
        <div className="relative z-10 flex w-full flex-1 flex-col items-center">
          <motion.p
            variants={item}
            className={`font-body text-[0.68rem] uppercase tracking-[0.4em] ${t.gold}`}
          >
            Celebration · {number}
          </motion.p>

          <motion.h3
            variants={item}
            className={`mt-3 text-balance text-4xl uppercase leading-[1.08] tracking-[0.06em] sm:text-5xl ${display.className} ${t.ink}`}
          >
            {title}
          </motion.h3>

          <motion.p
            variants={item}
            className={`mt-2 font-script text-xl italic ${t.gold}`}
          >
            {subtitle}
          </motion.p>

          <motion.div variants={item} className="my-5">
            <Ornament line={t.line} />
          </motion.div>

          <motion.div variants={item} className="flex flex-col items-center">
            <p className={`text-2xl ${display.className} ${t.ink}`}>{date}</p>

            <p
              className={`mt-2 inline-flex items-center gap-2 font-body text-xs uppercase tracking-[0.25em] ${t.muted}`}
            >
              <Clock size={13} strokeWidth={1.5} className={t.gold} />
              {time}
            </p>

            <span aria-hidden className={`my-4 block h-5 w-px ${t.line}`} />

            <p
              className={`inline-flex items-center gap-2 font-body text-[0.68rem] uppercase tracking-[0.35em] ${t.gold}`}
            >
              <MapPin size={13} strokeWidth={1.5} />
              Venue
            </p>
            <p className={`mt-1.5 max-w-[16rem] font-body text-sm ${t.ink}`}>
              {venue}
            </p>
          </motion.div>

          <motion.p
            variants={item}
            className={`mt-auto max-w-xs pt-6 font-body text-sm leading-relaxed ${t.muted}`}
          >
            {description}
          </motion.p>
        </div>
      </motion.article>
    </MotionConfig>
  );
}