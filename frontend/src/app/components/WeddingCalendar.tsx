"use client";

import { motion, MotionConfig, type Variants } from "framer-motion";
import { CalendarPlus, Clock, Download, MapPin } from "lucide-react";
import { Italiana } from "next/font/google";
import Image from "next/image";

const display = Italiana({ subsets: ["latin"], weight: "400" });

/* ---------- Edit these ---------- */
const YEAR = 2026;
const MONTH = 11; // 0-based, so 11 = December
const MONTH_NAME = "December";
const WEDDING_DAY = 27;
const SMALL_MARKS: Record<number, string> = { 25: "Haldi" }; // gold dots

const TZ = "Asia/Kolkata";
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
  start: "20261227T190000", // local time, YYYYMMDDTHHMMSS
  end: "20261227T223000",
  location: VENUE_ADDRESS,
  description:
    "An evening to remember. Food, laughter and celebration with the people who mean the most to us.",
};

/* ---------- Add-to-calendar helpers ---------- */
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
  const lines: string[] = [];
  let current = "";
  let bytes = 0;

  for (const character of Array.from(line)) {
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
  const stamp = new Date().toISOString().replace(/[-:]|\.\d{3}/g, "");

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
  const blob = new Blob([buildIcs()], { type: "text/calendar;charset=utf-8" });
  const url = URL.createObjectURL(blob);
  const anchor = document.createElement("a");

  anchor.href = url;
  anchor.download = "reception.ics";

  document.body.appendChild(anchor);
  anchor.click();
  anchor.remove();

  window.setTimeout(() => URL.revokeObjectURL(url), 1000);
};

/* Arch silhouette, same idea as the ceremony cards */
const ARCH = "50% 50% 2rem 2rem / 5.5rem 5.5rem 2rem 2rem";
const ARCH_INNER = "50% 50% 1.6rem 1.6rem / 5rem 5rem 1.6rem 1.6rem";

/* ---------- Calendar maths (Sunday-first) ---------- */
const WEEKDAYS = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
const firstWeekday = new Date(YEAR, MONTH, 1).getDay(); // 0 = Sunday
const daysInMonth = new Date(YEAR, MONTH + 1, 0).getDate();

const cells: (number | null)[] = [
  ...Array<null>(firstWeekday).fill(null),
  ...Array.from({ length: daysInMonth }, (_, i) => i + 1),
];
while (cells.length % 7 !== 0) cells.push(null);

/* ---------- Animation (all one-time or finite, nothing loops forever) ---------- */
const stagger: Variants = {
  hidden: {},
  show: { transition: { staggerChildren: 0.12, delayChildren: 0.05 } },
};

const fadeUp: Variants = {
  hidden: { opacity: 0, y: 14 },
  show: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.7, ease: "easeOut" },
  },
};

const gridVariants: Variants = {
  hidden: {},
  show: { transition: { staggerChildren: 0.018, delayChildren: 0.3 } },
};

const dayVariants: Variants = {
  hidden: { opacity: 0, y: 6 },
  show: { opacity: 1, y: 0, transition: { duration: 0.35, ease: "easeOut" } },
};

// The 27th pops in last, as the finale of the stagger
const heroVariants: Variants = {
  hidden: { opacity: 0, scale: 0.4 },
  show: {
    opacity: 1,
    scale: 1,
    transition: { type: "spring", stiffness: 260, damping: 15 },
  },
};

// A gold ring drawn around the date, once
const ringVariants: Variants = {
  hidden: { pathLength: 0, opacity: 0 },
  show: {
    pathLength: 1,
    opacity: 1,
    transition: { delay: 0.5, duration: 0.9, ease: "easeInOut" },
  },
};

// A soft ripple that plays three times, then stops
const rippleVariants: Variants = {
  hidden: { opacity: 0, scale: 1 },
  show: {
    opacity: [0.5, 0],
    scale: [1, 1.7],
    transition: {
      delay: 1.3,
      duration: 1.2,
      repeat: 2,
      repeatDelay: 0.5,
      ease: "easeOut",
    },
  },
};

const pillClass =
  "flex items-center justify-center gap-2 rounded-full border border-wedding-gold/50 px-3 py-2.5 font-body text-[0.62rem] uppercase tracking-[0.2em] text-wedding-gold-dark transition-colors duration-300 hover:bg-wedding-primary/50 active:scale-[0.98]";

/* ---------- Pieces ---------- */
function StarMark({ className }: { className?: string }) {
  return (
    <svg
      aria-hidden
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1"
      className={className}
    >
      <rect x="5" y="5" width="14" height="14" />
      <rect x="5" y="5" width="14" height="14" transform="rotate(45 12 12)" />
      <circle cx="12" cy="12" r="1.6" fill="currentColor" stroke="none" />
    </svg>
  );
}

function WeddingDayCell() {
  return (
    <motion.div
      variants={heroVariants}
      className="relative flex aspect-square items-center justify-center"
    >
      {/* ripple */}
      <motion.span
        aria-hidden
        variants={rippleVariants}
        className="pointer-events-none absolute inset-[6%] rounded-full border border-wedding-gold"
      />

      {/* red disc */}
      <span
        aria-hidden
        className="absolute inset-[6%] rounded-full shadow-[0_6px_16px_rgba(90,24,39,0.35)]"
        style={{ backgroundColor: RED }}
      />

      {/* gold ring drawing itself around the disc */}
      <svg
        aria-hidden
        viewBox="0 0 40 40"
        className="pointer-events-none absolute inset-0 h-full w-full -rotate-90 text-wedding-gold"
        fill="none"
      >
        <motion.circle
          variants={ringVariants}
          cx="20"
          cy="20"
          r="19"
          stroke="currentColor"
          strokeWidth="0.7"
          strokeLinecap="round"
        />
      </svg>

      <time
        dateTime={`${YEAR}-${String(MONTH + 1).padStart(2, "0")}-${WEDDING_DAY}`}
        aria-label={`${WEDDING_DAY} ${MONTH_NAME} ${YEAR}, Nikah and Reception`}
        className={`relative text-xl sm:text-2xl ${display.className}`}
        style={{ color: GOLD_LIGHT }}
      >
        {WEDDING_DAY}
      </time>
    </motion.div>
  );
}

export default function WeddingCalendar() {
  return (
    <MotionConfig reducedMotion="user">
      {/* No z-index here on purpose. The divider below is z-30 and must paint
          above the next section, while the Venue section's divider (z-20) still
          paints above this one. */}
      <section className="relative bg-wedding-primary px-6 py-24">
        {/* soft glow (clipped in its own box so it never causes sideways scroll) */}
        <div
          aria-hidden
          className="pointer-events-none absolute inset-0 overflow-hidden"
        >
          <div
            className="absolute left-1/2 top-1/3 h-96 w-96 -translate-x-1/2 rounded-full blur-3xl"
            style={{
              background:
                "radial-gradient(circle, rgba(244,199,195,0.5), transparent 70%)",
            }}
          />
        </div>

        <motion.div
          variants={stagger}
          initial="hidden"
          whileInView="show"
          viewport={{ once: true, amount: 0.1 }}
          className="relative mx-auto w-full max-w-sm text-center"
        >
          {/* INTRO */}
          <motion.p variants={fadeUp} className="wedding-eyebrow mb-4">
            Mark your calendar
          </motion.p>

          <motion.h2 variants={fadeUp} className="wedding-section-title">
            The Big Day
          </motion.h2>

          <motion.p
            variants={fadeUp}
            className="wedding-body mx-auto mt-4 max-w-xs"
          >
            Keep the evening free. We would love to have you with us.
          </motion.p>

          {/* CALENDAR CARD */}
          <motion.div
            variants={fadeUp}
            className="relative mt-10 border border-wedding-gold/40 bg-wedding-surface px-5 pb-7 pt-[4.5rem] shadow-xl"
            style={{ borderRadius: ARCH }}
          >
            {/* inner hairline frame */}
            <div
              aria-hidden
              className="pointer-events-none absolute inset-[7px] border border-wedding-gold/25"
              style={{ borderRadius: ARCH_INNER }}
            />

            {/* star ornament at the arch apex */}
            <div className="absolute left-1/2 top-7 flex -translate-x-1/2 items-center gap-3 text-wedding-gold-dark">
              <span aria-hidden className="h-px w-8 bg-wedding-gold/50" />
              <StarMark className="h-5 w-5" />
              <span aria-hidden className="h-px w-8 bg-wedding-gold/50" />
            </div>

            {/* MONTH TITLE */}
            <h3
              className={`text-4xl uppercase leading-none tracking-[0.08em] text-wedding-text ${display.className}`}
            >
              {MONTH_NAME}
            </h3>
            <p className="mt-2 font-body text-[0.68rem] uppercase tracking-[0.5em] text-wedding-gold-dark">
              {YEAR}
            </p>

            <div
              aria-hidden
              className="mx-auto my-5 flex items-center justify-center gap-3"
            >
              <span className="h-px w-12 bg-wedding-gold/50" />
              <span className="h-1.5 w-1.5 rotate-45 bg-wedding-gold/60" />
              <span className="h-px w-12 bg-wedding-gold/50" />
            </div>

            {/* WEEKDAYS */}
            <div className="grid grid-cols-7 pb-2">
              {WEEKDAYS.map((d, i) => (
                <span
                  key={d}
                  className="font-body text-[0.55rem] uppercase tracking-[0.2em]"
                  style={i === 0 ? { color: RED } : undefined}
                >
                  <span className={i === 0 ? "" : "text-wedding-gold-dark"}>
                    {d}
                  </span>
                </span>
              ))}
            </div>

            <div aria-hidden className="mb-1 h-px w-full bg-wedding-gold/30" />

            {/* DAYS */}
            <motion.div
              variants={gridVariants}
              role="group"
              aria-label={`${MONTH_NAME} ${YEAR}, ${WEDDING_DAY} ${MONTH_NAME} highlighted`}
              className="grid grid-cols-7"
            >
              {cells.map((day, i) => {
                if (day === null) return <div key={`empty-${i}`} aria-hidden />;
                if (day === WEDDING_DAY) return <WeddingDayCell key={day} />;

                const isSunday = i % 7 === 0;
                const mark = SMALL_MARKS[day];

                return (
                  <motion.div
                    key={day}
                    variants={dayVariants}
                    className="relative flex aspect-square items-center justify-center"
                  >
                    <span
                      className={`text-lg sm:text-xl ${display.className} ${
                        isSunday ? "" : "text-wedding-text/80"
                      }`}
                      style={isSunday ? { color: RED, opacity: 0.8 } : undefined}
                    >
                      {day}
                    </span>

                    {mark && (
                      <span
                        title={mark}
                        aria-label={mark}
                        className="absolute bottom-[14%] h-1 w-1 rounded-full bg-wedding-gold"
                      />
                    )}
                  </motion.div>
                );
              })}
            </motion.div>

            {/* LEGEND */}
            <div className="mt-4 flex items-center justify-center gap-5 font-body text-[0.58rem] uppercase tracking-[0.22em] text-wedding-text/70">
              <span className="inline-flex items-center gap-2">
                <span
                  aria-hidden
                  className="h-2 w-2 rounded-full"
                  style={{ backgroundColor: RED }}
                />
                Nikah &amp; Reception
              </span>
              <span className="inline-flex items-center gap-2">
                <span
                  aria-hidden
                  className="h-1.5 w-1.5 rounded-full bg-wedding-gold"
                />
                Haldi
              </span>
            </div>
          </motion.div>

          {/* ADD TO CALENDAR */}
          <motion.p variants={fadeUp} className="wedding-caption mt-8">
            ✦ Add the reception to your calendar ✦
          </motion.p>

          <motion.div
            variants={fadeUp}
            className="relative mt-4 rounded-2xl border border-wedding-gold/40 bg-wedding-surface p-4 text-left shadow-xl"
          >
            <div className="flex items-center gap-4">
              {/* date block (red accent) */}
              <div
                className="flex h-16 w-16 shrink-0 flex-col items-center justify-center rounded-xl"
                style={{ backgroundColor: RED, color: GOLD_LIGHT }}
              >
                <span className={`text-3xl leading-none ${display.className}`}>
                  {RECEPTION.day}
                </span>
                <span className="mt-1 font-body text-[0.55rem] uppercase tracking-[0.3em] opacity-80">
                  {RECEPTION.month}
                </span>
              </div>

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

            <div className="mt-4 grid grid-cols-2 gap-2.5">
              <a
                href={googleUrl()}
                target="_blank"
                rel="noopener noreferrer"
                className={pillClass}
              >
                <CalendarPlus size={13} strokeWidth={1.6} />
                Google
              </a>

              <button type="button" onClick={downloadIcs} className={pillClass}>
                <Download size={13} strokeWidth={1.6} />
                Apple / Outlook
              </button>
            </div>

            <p className="mt-3 text-center font-body text-[0.62rem] text-wedding-text/60">
              We&apos;ll remind you the day before.
            </p>
          </motion.div>
        </motion.div>

        {/* BOTTOM FLORAL DIVIDER */}
        <Image
          src="/wedding/floral-divider.webp"
          alt=""
          width={1000}
          height={60}
          className="pointer-events-none absolute -bottom-2 left-1/2 z-30 w-full max-w-4xl -translate-x-1/2 translate-y-1/2 select-none object-cover"
        />
      </section>
    </MotionConfig>
  );
}