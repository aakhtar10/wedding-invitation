"use client";

import { Clock, MapPin } from "lucide-react";

interface CeremonyCardProps {
  number: string;
  title: string;
  subtitle: string;
  icon?: string;
  date: string;
  time: string;
  venue: string;
  description: string;
}

export default function CeremonyCard({
  number,
  title,
  subtitle,
  icon,
  date,
  time,
  venue,
  description,
}: CeremonyCardProps) {
  return (
    <article className="relative flex h-full min-h-[32rem] w-full flex-col justify-between overflow-hidden rounded-[2rem] bg-wedding-surface px-6 py-8 sm:min-h-[36rem] sm:px-10 sm:py-10">
      {/* Decorative number */}
      <span className="pointer-events-none absolute -right-3 -top-10 select-none font-allura text-[12rem] leading-none text-wedding-secondary/50">
        {number}
      </span>

      {/* Top decoration */}
      <div className="absolute left-6 right-6 top-5 h-px bg-wedding-gold/40 sm:left-10 sm:right-10" />

      {/* Header */}
      <div className="relative z-10">
        <div className="mb-6 flex items-center gap-3">
          {icon && (
            <span className="flex h-11 w-11 items-center justify-center rounded-full bg-wedding-primary text-xl">
              {icon}
            </span>
          )}

          <span className="wedding-eyebrow">
            {number} — Celebration
          </span>
        </div>

        <h3 className="wedding-section-title text-5xl sm:text-6xl">
          {title}
        </h3>

        <p className="mt-2 font-script text-xl italic text-wedding-gold-dark">
          {subtitle}
        </p>
      </div>

      {/* Details */}
      <div className="relative z-10 my-8 space-y-4">
        <div className="flex items-start gap-4">
          <div className="mt-1 flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-wedding-primary/60">
            <Clock
              size={16}
              strokeWidth={1.5}
              className="text-wedding-gold-dark"
            />
          </div>

          <div>
            <p className="wedding-caption">Date & Time</p>
            <p className="mt-1 font-body text-sm text-wedding-text">
              {date}
            </p>
            <p className="font-body text-sm text-wedding-text">
              {time}
            </p>
          </div>
        </div>

        <div className="flex items-start gap-4">
          <div className="mt-1 flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-wedding-primary/60">
            <MapPin
              size={16}
              strokeWidth={1.5}
              className="text-wedding-gold-dark"
            />
          </div>

          <div>
            <p className="wedding-caption">Venue</p>
            <p className="mt-1 font-body text-sm text-wedding-text">
              {venue}
            </p>
          </div>
        </div>
      </div>

      {/* Description */}
      <div className="relative z-10">
        <div className="mb-6 h-px w-20 bg-wedding-gold/50" />

        <p className="wedding-body max-w-md">
          {description}
        </p>
      </div>

      {/* Bottom decoration */}
      <div className="absolute bottom-5 left-6 right-6 h-px bg-wedding-gold/40 sm:left-10 sm:right-10" />

      {/* Corner decorations */}
      <div className="absolute bottom-8 left-8 h-8 w-8 border-b border-l border-wedding-gold/40" />
      <div className="absolute bottom-8 right-8 h-8 w-8 border-b border-r border-wedding-gold/40" />
    </article>
  );
}