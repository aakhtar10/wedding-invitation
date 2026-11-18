"use client";

import { motion, MotionConfig } from "framer-motion";
import { ExternalLink, MapPin, Navigation } from "lucide-react";
import { Italiana } from "next/font/google";
import Image from "next/image";

const display = Italiana({ subsets: ["latin"], weight: "400" });

const VENUE = {
  name: "Rita Shree Banquet Hall",
  address:
    "A 178, behind Pani Tanki, Krishnanagar, Bargain Village, Ranchi, Jharkhand 834012",
  landmark: "Opposite DAV Nandraj School",
  lat: 23.4037081,
  lng: 85.3727284,
  mapsLink: "https://maps.app.goo.gl/CJN5Tqrt1FvCa1Sw8",
};

const EMBED_SRC = `https://www.google.com/maps?q=${VENUE.lat},${VENUE.lng}&z=16&output=embed`;
// With no origin set, Google Maps starts from the visitor's current location
const DIRECTIONS_URL = `https://www.google.com/maps/dir/?api=1&destination=${VENUE.lat},${VENUE.lng}&travelmode=driving`;

const EVENTS = [
  { label: "Nikah", when: "27 December · 3:00 PM" },
  { label: "Reception", when: "27 December · 7:00 PM" },
];

const fadeUp = {
  hidden: { opacity: 0, y: 18, filter: "blur(6px)" },
  show: {
    opacity: 1,
    y: 0,
    filter: "blur(0px)",
    transition: { duration: 0.8, ease: "easeOut" as const },
  },
};

export default function WeddingVenue() {
  return (
    <MotionConfig reducedMotion="user">
      {/* relative + z-10, no overflow-hidden: the divider hangs below this
          section and must paint above the next one */}
      <section className="relative z-10 bg-wedding-secondary px-6 py-24">
        {/* soft glow behind the card (clipped in its own box so it can
            never cause sideways scrolling) */}
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
          initial="hidden"
          whileInView="show"
          viewport={{ once: true, amount: 0.2 }}
          transition={{ staggerChildren: 0.12 }}
          className="relative mx-auto w-full max-w-md text-center"
        >
          {/* INTRO */}
          <motion.p variants={fadeUp} className="wedding-eyebrow mb-4">
            Finding your way
          </motion.p>

          <motion.h2 variants={fadeUp} className="wedding-section-title">
            The Venue
          </motion.h2>

          <motion.p
            variants={fadeUp}
            className="wedding-body mx-auto mt-4 max-w-xs"
          >
            We can&apos;t wait to celebrate with you. Tap below and your maps app
            will guide you from wherever you are.
          </motion.p>

          {/* MAP CARD */}
          <motion.div
            variants={fadeUp}
            className="relative mt-10 rounded-[2rem] border border-wedding-gold/40 bg-wedding-surface p-3 shadow-xl"
          >
            {/* inner hairline frame */}
            <div
              aria-hidden
              className="pointer-events-none absolute inset-[7px] rounded-[1.6rem] border border-wedding-gold/25"
            />

            {/* Map, arched at the top to echo the ceremony cards */}
            <div
              className="group relative aspect-[4/3.3] overflow-hidden bg-wedding-primary/40"
              style={{
                borderRadius:
                  "50% 50% 1.25rem 1.25rem / 4.5rem 4.5rem 1.25rem 1.25rem",
              }}
            >
              <iframe
                title={`Map showing ${VENUE.name}`}
                src={EMBED_SRC}
                loading="lazy"
                referrerPolicy="no-referrer-when-downgrade"
                allowFullScreen
                className="h-full w-full border-0"
                style={{
                  filter:
                    "sepia(0.35) saturate(0.75) hue-rotate(-12deg) contrast(0.95)",
                }}
              />

              {/* warm tint on the arch apex */}
              <div
                aria-hidden
                className="pointer-events-none absolute inset-0"
                style={{
                  background:
                    "linear-gradient(to bottom, rgba(244,199,195,0.35), transparent 35%)",
                }}
              />
            </div>

            {/* VENUE DETAILS */}
            <div className="relative px-4 pb-5 pt-6">
              <p className="wedding-eyebrow mb-2">Nikah &amp; Reception</p>

              <h3
                className={`text-balance text-3xl uppercase tracking-[0.06em] text-wedding-text sm:text-4xl ${display.className}`}
              >
                {VENUE.name}
              </h3>

              {/* ornament */}
              <div
                className="my-5 flex items-center justify-center gap-3"
                aria-hidden
              >
                <span className="h-px w-12 bg-wedding-gold/50" />
                <span className="h-1.5 w-1.5 rotate-45 bg-wedding-gold/60" />
                <span className="h-px w-12 bg-wedding-gold/50" />
              </div>

              {/* ADDRESS */}
              <address className="not-italic">
                <p className="inline-flex items-center gap-2 font-body text-[0.68rem] uppercase tracking-[0.35em] text-wedding-gold-dark">
                  <MapPin size={13} strokeWidth={1.5} />
                  Address
                </p>

                <p className="mx-auto mt-2.5 max-w-[17rem] font-body text-sm leading-relaxed text-wedding-text">
                  {VENUE.address}
                </p>

                <p className="mt-3 font-body text-xs uppercase tracking-[0.2em] text-wedding-text/70">
                  <span className="text-wedding-gold-dark">Landmark</span>
                  <span className="mx-2 text-wedding-gold/60">·</span>
                  {VENUE.landmark}
                </p>
              </address>

              <span
                aria-hidden
                className="mx-auto my-5 block h-px w-20 bg-wedding-gold/40"
              />

              {/* EVENTS AT THIS VENUE */}
              <ul className="space-y-1.5">
                {EVENTS.map((e) => (
                  <li
                    key={e.label}
                    className="font-body text-xs uppercase tracking-[0.25em] text-wedding-text/70"
                  >
                    <span className="text-wedding-gold-dark">{e.label}</span>
                    <span className="mx-2 text-wedding-gold/60">·</span>
                    {e.when}
                  </li>
                ))}
              </ul>

              {/* ACTIONS */}
              <div className="mt-7 flex flex-col gap-3">
                <a
                  href={DIRECTIONS_URL}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="group/btn relative flex items-center justify-center gap-2.5 overflow-hidden rounded-full bg-wedding-gold-dark px-6 py-3.5 font-body text-xs uppercase tracking-[0.3em] text-wedding-surface shadow-lg transition active:scale-[0.98]"
                >
                  {/* sheen sweep on hover / press */}
                  <span
                    aria-hidden
                    className="absolute inset-y-0 -left-1/3 w-1/3 -skew-x-12 bg-white/25 transition-transform duration-700 group-hover/btn:translate-x-[420%] group-active/btn:translate-x-[420%]"
                  />
                  <Navigation size={15} strokeWidth={1.6} className="relative" />
                  <span className="relative">Get Directions</span>
                </a>

                <a
                  href={VENUE.mapsLink}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center justify-center gap-2 rounded-full border border-wedding-gold/50 px-4 py-3 font-body text-[0.65rem] uppercase tracking-[0.22em] text-wedding-gold-dark transition hover:bg-wedding-primary/50 active:scale-[0.98]"
                >
                  <ExternalLink size={13} strokeWidth={1.6} />
                  View on Google Maps
                </a>
              </div>
            </div>
          </motion.div>

          <motion.p variants={fadeUp} className="wedding-caption mt-6">
            ✦ Directions open in your maps app ✦
          </motion.p>
        </motion.div>

        {/* BOTTOM FLORAL DIVIDER */}
        <Image
          src="/wedding/floral-divider.webp"
          alt=""
          width={1000}
          height={60}
          className="pointer-events-none absolute -bottom-2 left-1/2 z-20 w-full max-w-4xl -translate-x-1/2 translate-y-1/2 select-none object-cover"
        />
      </section>
    </MotionConfig>
  );
}