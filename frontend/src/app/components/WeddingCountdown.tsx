"use client";

import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import Image from "next/image";

const weddingDate = new Date("2026-12-27T00:00:00+05:30");

type TimeLeft = {
  days: number;
  hours: number;
  minutes: number;
  seconds: number;
};

function getTimeLeft(): TimeLeft {
  const difference = weddingDate.getTime() - new Date().getTime();

  if (difference <= 0) {
    return {
      days: 0,
      hours: 0,
      minutes: 0,
      seconds: 0,
    };
  }

  return {
    days: Math.floor(difference / (1000 * 60 * 60 * 24)),
    hours: Math.floor((difference / (1000 * 60 * 60)) % 24),
    minutes: Math.floor((difference / (1000 * 60)) % 60),
    seconds: Math.floor((difference / 1000) % 60),
  };
}

function TimeUnit({
  value,
  label,
  delay,
}: {
  value: number;
  label: string;
  delay: number;
}) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 15 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.7, delay }}
      className="flex flex-col items-center"
    >
      {/* GOLD COUNTDOWN CARD */}
      <div className="flex h-20 w-17 items-center justify-center rounded-xl border border-wedding-gold-dark/40 bg-wedding-gold shadow-[0_8px_25px_rgba(169,130,82,0.18)] sm:h-24 sm:w-20">
        <span className="font-allura text-5xl leading-none text-wedding-surface sm:text-6xl">
          {String(value).padStart(2, "0")}
        </span>
      </div>

      {/* LABEL */}
      <span className="wedding-caption mt-3">
        {label}
      </span>
    </motion.div>
  );
}

export default function WeddingCountdown() {
  const [timeLeft, setTimeLeft] = useState<TimeLeft>(getTimeLeft());

  useEffect(() => {
    const interval = setInterval(() => {
      setTimeLeft(getTimeLeft());
    }, 1000);

    return () => clearInterval(interval);
  }, []);

  const isWeddingDay =
    timeLeft.days === 0 &&
    timeLeft.hours === 0 &&
    timeLeft.minutes === 0 &&
    timeLeft.seconds === 0;

  return (
    <section className="relative  bg-wedding-primary px-6 py-24">
      {/* TOP FLORAL DIVIDER */}
      <Image
        src="/wedding/floral-divider.webp"
        alt=""
        width={1000}
        height={60}
        className="pointer-events-none absolute left-1/2 top-1 w-full max-w-4xl -translate-x-1/2 -translate-y-1/2 select-none object-cover"
      />

      <div className="mx-auto w-full max-w-md text-center">
        {/* EYEBROW */}
        <motion.p
          initial={{ opacity: 0, y: 10 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.7 }}
          className="wedding-eyebrow mb-4"
        >
          The countdown begins
        </motion.p>

        {/* TITLE */}
        <motion.h2
          initial={{ opacity: 0, y: 15 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
          className="wedding-section-title"
        >
          Counting the moments
        </motion.h2>

        {/* DESCRIPTION */}
        <motion.p
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8, delay: 0.2 }}
          className="wedding-body mx-auto mt-4 max-w-xs"
        >
          Until the day we begin our forever.
        </motion.p>

        {/* DIVIDER */}
        <motion.div
          initial={{ opacity: 0, scaleX: 0 }}
          whileInView={{ opacity: 1, scaleX: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8, delay: 0.4 }}
          className="mx-auto my-10 h-px w-24 bg-wedding-gold/40"
        />

        {/* COUNTDOWN */}
        {isWeddingDay ? (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="py-6"
          >
            <p className="font-allura text-5xl text-wedding-text">
              Today is the day
            </p>

            <p className="wedding-body mt-3">
              Alhamdulillah. Our forever begins today.
            </p>
          </motion.div>
        ) : (
          <div className="flex items-start justify-center gap-2 sm:gap-4">
            <TimeUnit
              value={timeLeft.days}
              label="Days"
              delay={0.5}
            />

            <span className="mt-7 font-allura text-3xl text-wedding-gold-dark/70">
              :
            </span>

            <TimeUnit
              value={timeLeft.hours}
              label="Hours"
              delay={0.6}
            />

            <span className="mt-7 font-allura text-3xl text-wedding-gold-dark/70">
              :
            </span>

            <TimeUnit
              value={timeLeft.minutes}
              label="Minutes"
              delay={0.7}
            />

            <span className="mt-7 font-allura text-3xl text-wedding-gold-dark/70">
              :
            </span>

            <TimeUnit
              value={timeLeft.seconds}
              label="Seconds"
              delay={0.8}
            />
          </div>
        )}

        {/* BOTTOM MESSAGE */}
        <motion.p
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8, delay: 1 }}
          className="wedding-caption mx-auto mt-10 max-w-xs"
        >
          ✦ A moment we will cherish forever ✦
        </motion.p>
      </div>

      {/* BOTTOM FLORAL DIVIDER */}
      <Image
        src="/wedding/floral-divider.webp"
        alt=""
        width={1000}
        height={60}
        className="pointer-events-none absolute bottom-1 left-1/2 w-full max-w-4xl -translate-x-1/2 translate-y-1/2 rotate-180 select-none object-cover"
      />
    </section>
  );
}

