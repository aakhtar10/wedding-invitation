
"use client";

import Image from "next/image";
import { motion } from "framer-motion";
import { useEffect, useState } from "react";

import WeddingHero from "./components/WeddingHero";
import WeddingOpening from "./components/WeddingOpening";
import WeddingScratch from "./components/WeddingScratch";
import WeddingCountdown from "./components/WeddingCountdown";
import WeddingCeremonies from "./components/WeddingCeremonies";
import WeddingVenue from "./components/WeddingVenue";
import WeddingClosing from "./components/WeddingClosing";
import WeddingMusic from "./components/WeddingMusic";

export default function WeddingPage() {
  const [isOpened, setIsOpened] = useState(false);

  const handleOpen = () => {
    setIsOpened(true);
  };

  useEffect(() => {
    document.body.style.overflow = isOpened ? "" : "hidden";

    if (isOpened) {
      window.scrollTo(0, 0);
    }

    return () => {
      document.body.style.overflow = "";
    };
  }, [isOpened]);

  return (
    <main className="flex flex-col">
      {!isOpened && (
        <div
          className="fixed inset-0 z-50 h-[100dvh] w-full cursor-pointer overscroll-none touch-none"
          onClick={handleOpen}
        >
          <Image
            src="/wedding/opening.webp"
            alt="Wedding invitation"
            fill
            priority
            sizes="100vw"
            className="object-cover"
          />

          <motion.div
            className="absolute left-1/2 top-1/2 flex h-16 w-16 -translate-x-1/2 -translate-y-1/2 items-center justify-center rounded-full border border-white/70 bg-white/10 backdrop-blur-sm"
            animate={{ scale: [1, 1.12, 1] }}
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
        </div>
      )}

      <WeddingOpening isOpened={isOpened} />
      <WeddingHero />
      <WeddingScratch />
      <WeddingCountdown />
      <WeddingCeremonies />
      <WeddingVenue />
      <WeddingClosing />
      <WeddingMusic isOpened={isOpened} />
    </main>
  );
}
