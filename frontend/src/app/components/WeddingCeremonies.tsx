"use client";

import { motion } from "framer-motion";
import ScrollStack, { ScrollStackItem } from "./ScrollStack";
import CeremonyCard from "./CeremonyCard";
import Image from "next/image";

export default function WeddingCeremonies() {
  return (
    <section className="relative bg-wedding-secondary">
      {/* SECTION INTRO */}
      <div className="px-6 pt-24 text-center">
        <motion.p
          initial={{ opacity: 0, y: 10 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.7 }}
          className="wedding-eyebrow mb-4"
        >
          Moments to cherish
        </motion.p>

        <motion.h2
          initial={{ opacity: 0, y: 15 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
          className="wedding-section-title"
        >
          Our Celebrations
        </motion.h2>

        <motion.p
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8, delay: 0.2 }}
          className="wedding-body mx-auto mt-4 max-w-sm"
        >
          Three beautiful moments, each marking a special
          chapter in our journey together.
        </motion.p>
      </div>

      <ScrollStack
        itemDistance={48}
        itemScale={0.03}
        itemStackDistance={22}
        stackPosition="5rem"
        baseScale={0.9}
      >
        <ScrollStackItem>
          <CeremonyCard
            number="01"
            title="Haldi"
            subtitle="A joyful beginning"
            date="25 December 2026"
            time="06:00 PM"
            venue="At our residence"
            description="A day filled with laughter, colour and blessings as our families come together to celebrate the beginning of our wedding festivities."
          />
        </ScrollStackItem>

        <ScrollStackItem>
          <CeremonyCard
            number="02"
            tone="maroon"
            title="Nikah"
            subtitle="The sacred union"
            date="27 December 2026"
            time="03:00 PM"
            venue="Rita Shree Banquet Hall"
            description="With the blessings of Allah and our loved ones around us, we come together to begin this beautiful journey as husband and wife."
          />
        </ScrollStackItem>

        <ScrollStackItem>
          <CeremonyCard
            number="03"
            title="Reception"
            subtitle="An evening to remember"
            date="27 December 2026"
            time="7:00 PM"
            venue="Rita Shree Banquet Hall"
            description="An evening of food, laughter and celebration as we gather with the people who mean the most to us."
          />
        </ScrollStackItem>

        <ScrollStackItem>
  <CeremonyCard
    number="04"
    tone="ivory"
    title="Dinner"
    subtitle="A feast with loved ones"
    date="27 December 2026"
    time="08:00 PM"
    venue="Rita Shree Banquet Hall"
    description="Join us for a delightful dinner as we share good food, warm conversations and beautiful memories with our family and friends."
  />
</ScrollStackItem>
      </ScrollStack>

      {/* BOTTOM FLORAL DIVIDER (z-20 so it paints above the Venue section) */}
      <Image
        src="/wedding/floral-divider.webp"
        alt=""
        width={1000}
        height={60}
        className="pointer-events-none absolute -bottom-2 left-1/2 z-20 w-full max-w-4xl -translate-x-1/2 translate-y-1/2 select-none object-cover"
      />
    </section>
  );
}