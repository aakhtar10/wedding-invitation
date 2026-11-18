
"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import { Italiana } from "next/font/google";

const display = Italiana({
  subsets: ["latin"],
  weight: "400",
});

/* ---------- Wedding configuration ---------- */

const WEDDING = new Date("2026-12-27T00:00:00+05:30");
const DATE_LINE = "Sunday · 27 December 2026";

const RED = "#5a1827";
const GOLD_LIGHT = "#e6cf9f";

const DAY = 86_400_000;

/* ---------- Arch shapes ---------- */

const ARCH =
  "50% 50% 0.9rem 0.9rem / 2.6rem 2.6rem 0.9rem 0.9rem";

const ARCH_INNER =
  "50% 50% 0.65rem 0.65rem / 2.3rem 2.3rem 0.65rem 0.65rem";

/* ---------- Countdown logic ---------- */

type Phase = "before" | "today" | "after";

type Countdown = {
  phase: Phase;
  days: number;
  hours: number;
  minutes: number;
  seconds: number;
};

function getCountdown(now = Date.now()): Countdown {
  const diff = WEDDING.getTime() - now;

  if (diff <= 0) {
    return {
      phase: now < WEDDING.getTime() + DAY ? "today" : "after",
      days: 0,
      hours: 0,
      minutes: 0,
      seconds: 0,
    };
  }

  return {
    phase: "before",
    days: Math.floor(diff / DAY),
    hours: Math.floor((diff / 3_600_000) % 24),
    minutes: Math.floor((diff / 60_000) % 60),
    seconds: Math.floor((diff / 1000) % 60),
  };
}

/* ---------- Countdown card ---------- */

function Unit({
  value,
  label,
}: {
  value: number;
  label: string;
}) {
  const text = String(value).padStart(2, "0");

  return (
    <div className="flex flex-col items-center">
      <div className="relative aspect-[3/4] w-full">
        <div
          className="absolute inset-0 bg-wedding-gold shadow-[0_10px_28px_rgba(169,130,82,0.28)]"
          style={{ borderRadius: ARCH }}
        >
          {/* Soft lighting */}
          <div
            aria-hidden="true"
            className="pointer-events-none absolute inset-0"
            style={{
              borderRadius: ARCH,
              background:
                "linear-gradient(165deg, rgba(255,253,248,0.38), transparent 55%, rgba(90,24,39,0.12))",
            }}
          />

          {/* Inner border */}
          <div
            aria-hidden="true"
            className="pointer-events-none absolute inset-[5px] border border-wedding-surface/45"
            style={{ borderRadius: ARCH_INNER }}
          />

          {/* Countdown number */}
          <div
            className={`absolute inset-0 flex items-center justify-center pt-3 ${display.className}`}
          >
            <span
              className="text-4xl leading-none text-wedding-surface sm:text-5xl"
              style={{
                textShadow: "0 1px 0 rgba(90,24,39,0.28)",
                fontVariantNumeric: "tabular-nums",
              }}
            >
              {text}
            </span>
          </div>
        </div>
      </div>

      <span className="wedding-caption mt-3">{label}</span>
    </div>
  );
}

/* ---------- Isolated countdown timer ---------- */

function CountdownTimer() {
  const [time, setTime] = useState<Countdown>(() => getCountdown());

  useEffect(() => {
    const update = () => {
      setTime(getCountdown());
    };

    const interval = window.setInterval(update, 1000);

    return () => window.clearInterval(interval);
  }, []);

  if (time.phase === "today") {
    return (
      <div className="py-4 text-center">
        <p className="font-allura text-6xl leading-none text-wedding-text">
          Today is the day
        </p>

        <p className="wedding-body mt-4">
          Alhamdulillah. Our forever begins today.
        </p>
      </div>
    );
  }

  if (time.phase === "after") {
    return (
      <div className="py-4 text-center">
        <p className="font-allura text-6xl leading-none text-wedding-text">
          Our forever has begun
        </p>

        <p className="wedding-body mt-4">
          Thank you for celebrating with us. Alhamdulillah.
        </p>
      </div>
    );
  }

  return (
    <div
      role="group"
      aria-label={`${time.days} days, ${time.hours} hours, ${time.minutes} minutes and ${time.seconds} seconds to go`}
      className="grid grid-cols-4 gap-2.5 sm:gap-4"
    >
      <Unit value={time.days} label="Days" />
      <Unit value={time.hours} label="Hours" />
      <Unit value={time.minutes} label="Minutes" />
      <Unit value={time.seconds} label="Seconds" />
    </div>
  );
}

/* ---------- Ornament ---------- */

function Ornament() {
  return (
    <div
      className="flex items-center justify-center gap-3"
      aria-hidden="true"
    >
      <span className="h-px w-12 bg-wedding-gold/50" />
      <span className="h-1.5 w-1.5 rotate-45 bg-wedding-gold/60" />
      <span className="h-px w-12 bg-wedding-gold/50" />
    </div>
  );
}

/* ---------- Main wedding section ---------- */

export default function WeddingCountdown() {
  return (
    <section className="relative bg-wedding-primary px-6 py-24">
      {/* Background atmosphere */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0"
        style={{
          background:
            "radial-gradient(80% 45% at 50% 18%, rgba(244,199,195,0.55), transparent 70%)",
        }}
      />

      {/* Background pattern */}
      <div
        aria-hidden="true"
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

      {/* Top floral divider */}
      <Image
        src="/wedding/floral-divider.webp"
        alt=""
        width={1000}
        height={60}
        className="pointer-events-none absolute left-1 top-1 w-full max-w-4xl -translate-x-1/2 -translate-y-1/2 select-none object-cover"
        style={{ left: "50%" }}
      />

      {/* Static content */}
      <div className="relative z-10 mx-auto w-full max-w-md text-center">
        {/* Eyebrow */}
        <p className="wedding-eyebrow mb-4">
          The countdown begins
        </p>

        {/* Title */}
        <h2 className="wedding-section-title">
          Counting the moments
        </h2>

        {/* Description */}
        <p className="wedding-body mx-auto mt-4 max-w-xs">
          Until the day we begin our forever.
        </p>

        {/* Date */}
        <p
          className="mx-auto mt-6 inline-block rounded-full px-5 py-1.5 font-body text-[0.62rem] uppercase tracking-[0.3em]"
          style={{
            backgroundColor: RED,
            color: GOLD_LIGHT,
          }}
        >
          {DATE_LINE}
        </p>

        {/* Ornament */}
        <div className="my-9">
          <Ornament />
        </div>

        {/* Isolated countdown */}
        <CountdownTimer />

        {/* Bottom message */}
        <p className="wedding-caption mx-auto mt-10 max-w-xs">
          ✦ A moment we will cherish forever ✦
        </p>
      </div>

      {/* Bottom floral divider */}
      <Image
        src="/wedding/floral-divider.webp"
        alt=""
        width={1000}
        height={60}
        className="pointer-events-none absolute -bottom-2 left-1/2 z-10 w-full max-w-4xl -translate-x-1/2 translate-y-1/2 select-none object-cover"
      />
    </section>
  );
}
