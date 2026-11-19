
"use client";

import { AnimatePresence, motion } from "framer-motion";
import { useEffect, useRef, useState } from "react";

interface WeddingOpeningProps {
  isOpened: boolean;
}

export default function WeddingOpening({
  isOpened,
}: WeddingOpeningProps) {
  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const hasStarted = useRef(false);

  const [videoEnded, setVideoEnded] = useState(false);
  const [finalFrame, setFinalFrame] = useState<string | null>(null);

  useEffect(() => {
    const video = videoRef.current;

    if (!video || !isOpened || hasStarted.current) return;

    hasStarted.current = true;

    video.muted = true;
    video.playsInline = true;
    video.playbackRate = 1.75;

    video.play().catch((error) => {
      console.error("Wedding video failed to play:", error);
    });
  }, [isOpened]);

  const handleVideoEnd = () => {
    const video = videoRef.current;
    const canvas = canvasRef.current;

    if (!video || !canvas) return;

    video.pause();

    if (video.videoWidth && video.videoHeight) {
      canvas.width = video.videoWidth;
      canvas.height = video.videoHeight;

      const context = canvas.getContext("2d");

      if (context) {
        context.drawImage(
          video,
          0,
          0,
          canvas.width,
          canvas.height
        );

        try {
          setFinalFrame(canvas.toDataURL("image/webp", 0.95));
        } catch (error) {
          console.error("Final frame capture failed:", error);
        }
      }
    }

    setVideoEnded(true);
  };

  return (
    <section className="relative h-[110vh] w-full overflow-hidden bg-wedding-primary">

      {/* VIDEO */}
      <video
        ref={videoRef}
        src="/wedding/opening.mp4"
        muted
        playsInline
        preload="auto"
        onEnded={handleVideoEnd}
        style={{
          transform: "translateZ(0)",
          backfaceVisibility: "hidden",
          WebkitBackfaceVisibility: "hidden",
        }}
        className="absolute inset-0 z-0 h-full w-full object-cover"
      />

      {/* PERMANENT FINAL VIDEO FRAME */}
      {finalFrame && (
        <img
          src={finalFrame}
          alt=""
          aria-hidden="true"
          draggable={false}
          className="absolute inset-0 z-[1] h-full w-full object-cover"
        />
      )}

      <canvas
        ref={canvasRef}
        className="hidden"
        aria-hidden="true"
      />

      {/* WEDDING CONTENT */}
      <AnimatePresence>
        {videoEnded && (
          <motion.div
            className="absolute inset-0 z-10 flex items-center justify-center px-5 py-8"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 1 }}
          >
            <motion.div
              initial={{ opacity: 0, y: 25 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{
                duration: 1,
                ease: [0.22, 1, 0.36, 1],
              }}
              className="relative w-full max-w-md px-7 py-10 text-center"
            >
              {/* BISMILLAH */}
              <motion.div
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 1 }}
                className="relative z-10 mb-3"
              >
                <p dir="rtl" className="wedding-arabic">
                  ﷽
                </p>
              </motion.div>

              {/* TRANSLATION */}
              <motion.p
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.3, duration: 0.8 }}
                className="wedding-caption mb-7"
              >
                In the name of Allah, the Most Gracious,
                <br />
                the Most Merciful
              </motion.p>

              {/* INTRO */}
              <motion.p
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.6, duration: 0.8 }}
                className="wedding-eyebrow mb-4"
              >
                Together with their families
              </motion.p>

              {/* GROOM */}
              <motion.div
                initial={{ opacity: 0, y: 15 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.9, duration: 0.9 }}
              >
                <h1 className="wedding-names text-wedding-gold-light">
                  Arsalan Akhtar
                </h1>

                <p className="wedding-caption mt-2">
                  Son of Md Sohail Akhtar &amp; Gazala Perween
                </p>
              </motion.div>

              {/* AMPERSAND */}
              <motion.div
                initial={{ opacity: 0, scale: 0.7 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 1.2, duration: 0.7 }}
                className="my-3 wedding-names"
              >
                &amp;
              </motion.div>

              {/* BRIDE */}
              <motion.div
                initial={{ opacity: 0, y: 15 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 1.4, duration: 0.9 }}
              >
                <h1 className="wedding-names text-wedding-gold-light">
                  Maria Bin-tul Islam
                </h1>

                <p className="wedding-caption mt-2">
                  Daughter of Md Khaliq &amp; Shabnam Perween
                </p>
              </motion.div>

              {/* ORNAMENT */}
              <motion.div
                initial={{ opacity: 0, scaleX: 0 }}
                animate={{ opacity: 1, scaleX: 1 }}
                transition={{ delay: 1.8, duration: 0.8 }}
                className="mx-auto mt-6 flex items-center justify-center gap-2"
              >
                <span className="h-px w-10 bg-wedding-gold/60" />
                <span className="h-1.5 w-1.5 rotate-45 bg-wedding-gold" />
                <span className="h-px w-10 bg-wedding-gold/60" />
              </motion.div>

              {/* SCROLL INDICATOR */}
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 2.3, duration: 0.8 }}
                className="mt-8 flex flex-col items-center gap-2"
              >
                <span className="text-[9px] uppercase tracking-[0.3em] text-wedding-gold-light/80">
                  Scroll to explore
                </span>

                <motion.div
                  animate={{ y: [0, 6, 0] }}
                  transition={{
                    duration: 1.5,
                    repeat: Infinity,
                    ease: "easeInOut",
                  }}
                  className="flex h-8 w-5 items-start justify-center rounded-full border border-wedding-gold/50 p-1"
                >
                  <motion.span
                    animate={{ y: [0, 10, 0], opacity: [1, 0.3, 1] }}
                    transition={{
                      duration: 1.5,
                      repeat: Infinity,
                      ease: "easeInOut",
                    }}
                    className="h-1.5 w-1 rounded-full bg-wedding-gold"
                  />
                </motion.div>
              </motion.div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </section>
  );
}
