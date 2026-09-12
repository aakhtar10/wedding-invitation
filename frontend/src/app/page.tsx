"use client";

import Image from "next/image";
import { AnimatePresence, motion } from "framer-motion";
import { useState } from "react";
import WeddingHero from "./components/WeddingHero";
import WeddingOpening from "./components/WeddingOpening";
import WeddingScratch from "./components/WeddingScratch";

export default function WeddingPage() {
  const [isOpened, setIsOpened] = useState(false);

  return (
    <main className="flex flex-col">
      {/* OPENING IMAGE */}
      <AnimatePresence>
        {!isOpened ? (
          <motion.div
            key="opening"
            className="
              fixed
              inset-0
              z-50
              h-[110vh]
              w-full
              cursor-pointer
              overscroll-none
              touch-none
            "
            initial={{ opacity: 1 }}
            exit={{
              opacity: 0,
              transition: {
                duration: 0.5,
                ease: "easeInOut",
              },
            }}
            onClick={() => setIsOpened(true)}
          >
            <Image
              src="/wedding/opening.webp"
              alt="Wedding invitation"
              fill
              priority
              className="object-cover"
            />

            {/* OPEN CIRCLE */}
            <motion.div
              className="
                absolute
                left-1/2
                top-1/2
                flex
                h-16
                w-16
                -translate-x-1/2
                -translate-y-1/2
                items-center
                justify-center
                rounded-full
                border
                border-white/70
                bg-white/10
                backdrop-blur-sm
              "
              animate={{
                scale: [1, 1.12, 1],
              }}
              transition={{
                duration: 1.5,
                repeat: Infinity,
                ease: "easeInOut",
              }}
            >
              <span className="text-[10px] tracking-[0.2em] text-white">
                OPEN
              </span>
            </motion.div>
          </motion.div>
        ) : null}
      </AnimatePresence>

      {/* VIDEO + WEDDING CONTENT */}
      <WeddingOpening isOpened={isOpened} />

      {/* HERO */}
      <WeddingHero />
      <WeddingScratch/>

      {/* Next sections */}
    </main>
  );
}