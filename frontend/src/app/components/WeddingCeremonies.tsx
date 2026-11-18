"use client";

import { motion } from "framer-motion";
import ScrollStack, { ScrollStackItem } from "./ScrollStack";
import CeremonyCard from "./CeremonyCard";

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
      </ScrollStack>
    </section>
  );
}