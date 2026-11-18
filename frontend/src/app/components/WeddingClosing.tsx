
"use client";

import { useEffect, useState } from "react";
import { motion, MotionConfig } from "framer-motion";
import {
  CalendarPlus,
  Clock,
  Download,
  Heart,
  MapPin,
} from "lucide-react";
import { Italiana } from "next/font/google";
import Image from "next/image";

const display = Italiana({
  subsets: ["latin"],
  weight: "400",
});

/* ---------- Configuration ---------- */

const COUPLE = "Maria & Arsalan";
const TZ = "Asia/Kolkata";

const WEDDING_START = "2026-12-27T15:00:00+05:30";

const VENUE_ADDRESS =
  "Rita Shree Banquet Hall, A 178, behind Pani Tanki, Krishnanagar, Bargain Village, Ranchi, Jharkhand 834012";

const RED = "#5a1827";
const GOLD_LIGHT = "#e6cf9f";

const RECEPTION = {
  id: "reception",
  title: "Reception - Maria & Arsalan",
  day: "27",
  month: "Dec",
  weekday: "Sunday",
  timeLabel: "7:00 PM",
  place: "Rita Shree Banquet Hall",
  start: "20261227T190000",
  end: "20261227T223000",
  location: VENUE_ADDRESS,
  description:
    "An evening to remember. Food, laughter and celebration with the people who mean the most to us.",
};

/* ---------- Calendar helpers ---------- */

const googleUrl = () => {
  const params = new URLSearchParams({
    action: "TEMPLATE",
    text: RECEPTION.title,
    dates: `${RECEPTION.start}/${RECEPTION.end}`,
    ctz: TZ,
    details: RECEPTION.description,
    location: RECEPTION.location,
  });

  return `https://calendar.google.com/calendar/render?${params.toString()}`;
};

const icsEscape = (value: string) =>
  value
    .replace(/\\/g, "\\\\")
    .replace(/;/g, "\\;")
    .replace(/,/g, "\\,")
    .replace(/\r?\n/g, "\\n");

// Fold calendar lines at 75 UTF-8 octets.
const fold = (line: string) => {
  const encoder = new TextEncoder();
  const characters = Array.from(line);
  const lines: string[] = [];
  let current = "";
  let bytes = 0;

  for (const character of characters) {
    const charBytes = encoder.encode(character).length;

    if (bytes + charBytes > 73) {
      lines.push(current);
      current = " ";
      bytes = 1;
    }

    current += character;
    bytes += charBytes;
  }

  if (current) lines.push(current);

  return lines.join("\r\n");
};

const buildIcs = () => {
  const stamp = new Date()
    .toISOString()
    .replace(/[-:]|\.\d{3}/g, "");

  return [
    "BEGIN:VCALENDAR",
    "VERSION:2.0",
    "PRODID:-//Wedding Invite//EN",
    "CALSCALE:GREGORIAN",
    "METHOD:PUBLISH",
    "BEGIN:VTIMEZONE",
    `TZID:${TZ}`,
    "BEGIN:STANDARD",
    "DTSTART:19700101T000000",
    "TZOFFSETFROM:+0530",
    "TZOFFSETTO:+0530",
    "TZNAME:IST",
    "END:STANDARD",
    "END:VTIMEZONE",
    "BEGIN:VEVENT",
    `UID:${RECEPTION.id}-${RECEPTION.start}@wedding-invite`,
    `DTSTAMP:${stamp}`,
    `DTSTART;TZID=${TZ}:${RECEPTION.start}`,
    `DTEND;TZID=${TZ}:${RECEPTION.end}`,
    `SUMMARY:${icsEscape(RECEPTION.title)}`,
    `DESCRIPTION:${icsEscape(RECEPTION.description)}`,
    `LOCATION:${icsEscape(RECEPTION.location)}`,
    "BEGIN:VALARM",
    "TRIGGER:-P1D",
    "ACTION:DISPLAY",
    "DESCRIPTION:Tomorrow: Reception",
    "END:VALARM",
    "END:VEVENT",
    "END:VCALENDAR",
  ]
    .map(fold)
    .join("\r\n");
};

const downloadIcs = () => {
  const blob = new Blob([buildIcs()], {
    type: "text/calendar;charset=utf-8",
  });

  const url = URL.createObjectURL(blob);
  const anchor = document.createElement("a");

  anchor.href = url;
  anchor.download = "reception.ics";

  document.body.appendChild(anchor);
  anchor.click();
  anchor.remove();

  window.setTimeout(() => {
    URL.revokeObjectURL(url);
  }, 1000);
};

/* ---------- Animations ---------- */

const fadeUp = {
  hidden: {
    opacity: 0,
    y: 12,
  },
  show: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.6,
      ease: "easeOut" as const,
    },
  },
};

const pillClass =
  "flex items-center justify-center gap-2 rounded-full border border-wedding-gold/50 px-3 py-2.5 font-body text-[0.62rem] uppercase tracking-[0.2em] text-wedding-gold-dark transition-colors duration-300 hover:bg-wedding-primary/50 active:scale-[0.98]";

/* ---------- Component ---------- */

export default function WeddingClosing() {
  const [daysLeft, setDaysLeft] = useState<number | null>(null);

  useEffect(() => {
    const updateCountdown = () => {
      const diff =
        new Date(WEDDING_START).getTime() - Date.now();

      setDaysLeft(
        diff > 0
          ? Math.ceil(diff / 86_400_000)
          : null
      );
    };

    updateCountdown();

    const interval = window.setInterval(
      updateCountdown,
      60_000
    );

    return () => window.clearInterval(interval);
  }, []);

  return (
    <MotionConfig reducedMotion="user">
      <section className="relative isolate overflow-hidden bg-wedding-secondary px-6 pb-24 pt-16">

        {/* Main content */}

        <motion.div
          initial="hidden"
          whileInView="show"
          viewport={{
            once: true,
            amount: 0.1,
          }}
          transition={{
            staggerChildren: 0.1,
          }}
          className="relative z-10 mx-auto w-full max-w-sm text-center"
        >

          {/* INTRO */}

          <motion.p
            variants={fadeUp}
            className="wedding-eyebrow mb-3"
          >
            Save the date
          </motion.p>

          <motion.h2
            variants={fadeUp}
            className="wedding-section-title"
          >
            Add to Calendar
          </motion.h2>

          <motion.p
            variants={fadeUp}
            className="wedding-body mx-auto mt-3 max-w-xs"
          >
            So you never miss the evening. We&apos;ll remind
            you the day before.
          </motion.p>

          {/* RECEPTION CARD */}

          <motion.div
            variants={fadeUp}
            className="relative mt-8 rounded-2xl border border-wedding-gold/40 bg-wedding-surface p-4 text-left shadow-xl"
          >
            <div className="flex items-center gap-4">

              {/* DATE */}

              <div
                className="flex h-16 w-16 shrink-0 flex-col items-center justify-center rounded-xl"
                style={{
                  backgroundColor: RED,
                  color: GOLD_LIGHT,
                }}
              >
                <span
                  className={`text-3xl leading-none ${display.className}`}
                >
                  {RECEPTION.day}
                </span>

                <span className="mt-1 font-body text-[0.55rem] uppercase tracking-[0.3em] opacity-80">
                  {RECEPTION.month}
                </span>
              </div>

              {/* DETAILS */}

              <div className="min-w-0">
                <p
                  className={`text-2xl uppercase leading-tight tracking-[0.06em] text-wedding-text ${display.className}`}
                >
                  Reception
                </p>

                <p className="mt-1 inline-flex items-center gap-1.5 font-body text-[0.68rem] uppercase tracking-[0.18em] text-wedding-text/70">
                  <Clock
                    size={12}
                    strokeWidth={1.5}
                    className="text-wedding-gold-dark"
                  />

                  {RECEPTION.weekday} · {RECEPTION.timeLabel}
                </p>

                <p className="mt-0.5 flex items-center gap-1.5 font-body text-[0.68rem] text-wedding-text/70">
                  <MapPin
                    size={12}
                    strokeWidth={1.5}
                    className="shrink-0 text-wedding-gold-dark"
                  />

                  {RECEPTION.place}
                </p>
              </div>
            </div>

            {/* CALENDAR BUTTONS */}

            <div className="mt-4 grid grid-cols-2 gap-2.5">
              <a
                href={googleUrl()}
                target="_blank"
                rel="noopener noreferrer"
                className={pillClass}
              >
                <CalendarPlus
                  size={13}
                  strokeWidth={1.6}
                />

                Google
              </a>

              <button
                type="button"
                onClick={downloadIcs}
                className={pillClass}
              >
                <Download
                  size={13}
                  strokeWidth={1.6}
                />

                Apple / Outlook
              </button>
            </div>
          </motion.div>

          {/* SIGN-OFF */}

          <motion.div
            variants={fadeUp}
            className="mt-14"
          >

            {/* DECORATIVE DIVIDER */}

            <div
              className="mb-6 flex items-center justify-center gap-3"
              aria-hidden="true"
            >
              <span className="h-px w-12 bg-wedding-gold/50" />

              <span className="h-1.5 w-1.5 rotate-45 bg-wedding-gold/60" />

              <span className="h-px w-12 bg-wedding-gold/50" />
            </div>

            <h3 className="font-allura text-5xl leading-none text-wedding-text">
              See you soon
            </h3>

            <p className="wedding-body mx-auto mt-4 max-w-[17rem]">
              Your love, your duas and your presence mean
              more to us than any gift could.
            </p>

            {/* COUNTDOWN */}

            <p className="wedding-caption mt-5 min-h-5">
              {daysLeft !== null && (
                <>
                  ✦ {daysLeft}{" "}
                  {daysLeft === 1 ? "day" : "days"} to go ✦
                </>
              )}
            </p>

            <p className="mt-8 font-body text-[0.65rem] uppercase tracking-[0.4em] text-wedding-text/60">
              With love &amp; duas
            </p>

            <p
              className="mt-2 font-allura text-4xl leading-tight"
              style={{
                color: RED,
              }}
            >
              {COUPLE}
            </p>

            {/* STATIC HEART - NO CONTINUOUS REPATINTING */}

            <div
              className="mt-5 flex justify-center"
              style={{
                color: RED,
              }}
            >
              <Heart
                size={15}
                strokeWidth={1.4}
                fill="currentColor"
              />
            </div>

          </motion.div>
        </motion.div>

        {/* FLORAL DIVIDER */}

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
