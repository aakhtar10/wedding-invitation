
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

function OpeningOverlay({ onOpen }: { onOpen: () => void }) {
  return (
    <div
      className="fixed inset-0 z-[9999] h-[100dvh] w-full cursor-pointer overscroll-none touch-none"
      onClick={onOpen}
      role="button"
      aria-label="Open wedding invitation"
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
  );
}

export default function WeddingPage() {
  const [isOpened, setIsOpened] = useState(false);

  useEffect(() => {
    document.body.style.overflow = isOpened ? "" : "hidden";

    if (isOpened) {
      window.scrollTo({ top: 0, behavior: "instant" });
    }

    return () => {
      document.body.style.overflow = "";
    };
  }, [isOpened]);

  return (
    <main className="flex flex-col">
      {!isOpened && (
        <OpeningOverlay onOpen={() => setIsOpened(true)} />
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
