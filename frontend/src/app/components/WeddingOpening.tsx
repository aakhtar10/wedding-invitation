"use client";

import Image from "next/image";
import { AnimatePresence, motion } from "framer-motion";
import { useRef, useState } from "react";

export default function WeddingOpening() {
  const videoRef = useRef<HTMLVideoElement>(null);

  const [isOpened, setIsOpened] = useState(false);
  const [videoEnded, setVideoEnded] = useState(false);

  const handleOpen = async () => {
    const video = videoRef.current;

    if (!video) {
      console.log("Video element not found");
      return;
    }

    video.currentTime = 0;
    video.muted = true;

    try {
      await video.play();

      // Only hide the image after video successfully starts
      setIsOpened(true);

      console.log("Video started");
    } catch (error) {
      console.error("Video failed to play:", error);
    }
  };

  return (
    <main className="fixed inset-0 z-50 overflow-hidden bg-black">

      {/* VIDEO IS ALWAYS PRESENT */}
      <video
        ref={videoRef}
        src="/wedding/opening.mp4"
        muted
        playsInline
        preload="auto"
        onEnded={() => setVideoEnded(true)}
        className="absolute inset-0 h-full w-full object-cover"
      />

      {/* OPENING IMAGE */}
      <AnimatePresence>
        {!isOpened && (
          <motion.button
            type="button"
            onClick={handleOpen}
            className="absolute inset-0 z-20 h-full w-full"
            initial={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.8 }}
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
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{
                delay: 0.5,
                duration: 0.8,
              }}
              className="absolute inset-x-0 bottom-16 flex justify-center"
            >
              <div className="rounded-full bg-black/40 px-6 py-3 text-sm tracking-[0.25em] text-white backdrop-blur-sm">
                TAP TO OPEN
              </div>
            </motion.div>
          </motion.button>
        )}
      </AnimatePresence>

      {/* TEXT AFTER VIDEO ENDS */}
      <AnimatePresence>
        {videoEnded && (
          <motion.div
            className="absolute inset-0 z-10 flex items-center justify-center"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 1 }}
          >
            <motion.div
              initial={{ opacity: 0, y: 40 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{
                duration: 1.2,
                ease: [0.22, 1, 0.36, 1],
              }}
              className="text-center text-white"
            >
              <p className="mb-4 text-sm uppercase tracking-[0.35em]">
                Together with their families
              </p>

              <h1 className="font-serif text-5xl">
                Arsalan & Maria
              </h1>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </main>
  );
}