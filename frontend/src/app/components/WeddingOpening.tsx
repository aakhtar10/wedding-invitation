
"use client";

import { AnimatePresence, motion } from "framer-motion";
import { useEffect, useRef, useState } from "react";

interface WeddingOpeningProps {
  isOpened: boolean;
}

export default function WeddingOpening({ isOpened }: WeddingOpeningProps) {
  const videoRef = useRef<HTMLVideoElement>(null);
  const hasStarted = useRef(false);
  const [videoEnded, setVideoEnded] = useState(false);

  useEffect(() => {
    const video = videoRef.current;

    if (!video || !isOpened || hasStarted.current) return;

    hasStarted.current = true;

    video.muted = true;
    video.playsInline = true;
    video.playbackRate = 1.75;

    video.play().catch((error) => {
      if (error?.name === "AbortError") return;

      console.error("Video failed to play:", error);
      setVideoEnded(true);
    });
  }, [isOpened]);

  const handleVideoEnd = () => {
    const video = videoRef.current;

    if (!video) return;

    // Keep the video at its natural final frame.
    video.pause();
    setVideoEnded(true);
  };

  return (
    <section className="relative h-[110vh] w-full overflow-hidden bg-wedding-primary">
      <video
        ref={videoRef}
        src="/wedding/opening.mp4"
        muted
        playsInline
        preload="auto"
        onEnded={handleVideoEnd}
        onError={handleVideoEnd}
        className="absolute inset-0 h-full w-full object-cover"
      />

      {/* Keep your existing wedding introduction JSX here */}
      <AnimatePresence>
        {videoEnded && (
          <motion.div
            className="absolute inset-0 z-10 flex items-center justify-center px-5 py-8"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 1 }}
          >
            {/* Your existing Bismillah, names and scroll indicator */}
          </motion.div>
        )}
      </AnimatePresence>
    </section>
  );
}
