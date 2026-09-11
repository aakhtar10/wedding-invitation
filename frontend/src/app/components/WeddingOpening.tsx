"use client";

import Image from "next/image";
import { AnimatePresence, motion } from "framer-motion";
import { useEffect, useRef, useState } from "react";

export default function WeddingOpening() {
  const videoRef = useRef<HTMLVideoElement>(null);

  const [isOpened, setIsOpened] = useState(false);
  const [videoEnded, setVideoEnded] = useState(false);

  const handleOpen = async () => {
    const video = videoRef.current;

    if (!video) {
      console.error("Video element not found");
      return;
    }

    video.currentTime = 0;
    video.muted = true;
    video.playbackRate = 1.25;

    try {
      await video.play();
      setIsOpened(true);
    } catch (error) {
      console.error("Video failed to play:", error);
    }
  };

  const handleVideoEnd = () => {
    setVideoEnded(true);

    // Give the reveal animation time to complete
    setTimeout(() => {
      // Unlock normal page scrolling
      document.body.style.overflow = "";
      document.documentElement.style.overflow = "";
    }, 3000);
  };

  useEffect(() => {
    // Lock page scrolling while opening is active
    document.body.style.overflow = "hidden";
    document.documentElement.style.overflow = "hidden";

    return () => {
      // Always restore scrolling
      document.body.style.overflow = "";
      document.documentElement.style.overflow = "";
    };
  }, []);

  return (
    <section className="relative h-screen w-full overflow-hidden bg-wedding-primary">
      {/* VIDEO */}
      <video
        ref={videoRef}
        src="/wedding/opening.mp4"
        muted
        playsInline
        preload="auto"
        onEnded={handleVideoEnd}
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
            exit={{
              opacity: 0,
              transition: {
                duration: 0.8,
              },
            }}
          >
            <Image
              src="/wedding/opening.webp"
              alt="Wedding invitation"
              fill
              priority
              sizes="100vw"
              className="object-cover"
            />

            {/* WAVY OPEN CIRCLE */}
            <motion.div
              className="absolute inset-0 flex items-center justify-center"
              initial={{ opacity: 0.5 }}
              animate={{ opacity: 1 }}
              transition={{
                delay: 0.5,
                duration: 0.8,
              }}
            >
              <motion.div
                className="relative flex h-11 w-11 items-center justify-center rounded-full border border-white/70 bg-white/10 backdrop-blur-sm"
                animate={{
                  scale: [1, 1.08, 1],
                }}
                transition={{
                  duration: 2,
                  repeat: Infinity,
                  ease: "easeInOut",
                }}
              >
                {/* WAVE 1 */}
                <motion.span
                  className="absolute inset-0 rounded-full border border-white/40"
                  animate={{
                    scale: [1, 2],
                    opacity: [0.6, 0],
                  }}
                  transition={{
                    duration: 2,
                    repeat: Infinity,
                    ease: "easeOut",
                  }}
                />

                {/* WAVE 2 */}
                <motion.span
                  className="absolute inset-0 rounded-full border border-white/30"
                  animate={{
                    scale: [1, 1.7],
                    opacity: [0.5, 0],
                  }}
                  transition={{
                    duration: 2,
                    repeat: Infinity,
                    delay: 0.6,
                    ease: "easeOut",
                  }}
                />
              </motion.div>
            </motion.div>
          </motion.button>
        )}
      </AnimatePresence>

      {/* WEDDING REVEAL */}
      <AnimatePresence>
        {videoEnded && (
          <motion.div
            className="absolute inset-0 z-10 flex items-center justify-center px-5 py-8"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{
              duration: 1,
            }}
          >
            <motion.div
              initial={{
                opacity: 0,
                y: 25,
              }}
              animate={{
                opacity: 1,
                y: 0,
              }}
              transition={{
                duration: 1,
                ease: [0.22, 1, 0.36, 1],
              }}
              className="relative w-full max-w-md px-7 py-10 text-center"
            >
              {/* BISMILLAH */}

              <motion.div
                initial={{
                  opacity: 0,
                  y: -10,
                }}
                animate={{
                  opacity: 1,
                  y: 0,
                }}
                transition={{
                  duration: 1,
                }}
                className="relative z-10 mb-3"
              >
                <p
                  dir="rtl"
                  className="font-serif text-xl leading-loose text-[#5a4035]"
                >
                  ﷽
                </p>
              </motion.div>

              {/* TRANSLATION */}

              <motion.p
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{
                  delay: 0.3,
                  duration: 0.8,
                }}
                className="mb-7 font-sans text-[9px] uppercase tracking-[0.2em] text-[#5a4035]"
              >
                In the name of Allah, the Most Gracious,
                <br />
                the Most Merciful
              </motion.p>

              {/* INTRO */}

              <motion.p
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{
                  delay: 0.6,
                  duration: 0.8,
                }}
                className="mb-4 font-sans text-[9px] uppercase tracking-[0.28em] text-[#5a4035]"
              >
                Together with their families
              </motion.p>

              {/* GROOM */}

              <motion.div
                initial={{
                  opacity: 0,
                  y: 15,
                }}
                animate={{
                  opacity: 1,
                  y: 0,
                }}
                transition={{
                  delay: 0.9,
                  duration: 0.9,
                }}
              >
                <h1 className="font-allura text-2xl leading-tight text-wedding-gold-light">
                  Arsalan Akhtar
                </h1>

                <p className="mt-1 font-sans text-[10px] leading-relaxed text-[#5a4035]">
                  Son of Md Sohail Akhtar &amp; Gazala Perween
                </p>
              </motion.div>

              {/* AMPERSAND */}

              <motion.div
                initial={{
                  opacity: 0,
                  scale: 0.7,
                }}
                animate={{
                  opacity: 1,
                  scale: 1,
                }}
                transition={{
                  delay: 1.2,
                  duration: 0.7,
                }}
                className="my-3 font-serif text-xl text-wedding-gold"
              >
                &amp;
              </motion.div>

              {/* BRIDE */}

              <motion.div
                initial={{
                  opacity: 0,
                  y: 15,
                }}
                animate={{
                  opacity: 1,
                  y: 0,
                }}
                transition={{
                  delay: 1.4,
                  duration: 0.9,
                }}
              >
                <h1 className="font-allura text-2xl leading-tight text-wedding-gold-light">
                  Maria Bin-tul Islam
                </h1>

                <p className="mt-1 font-sans text-[10px] leading-relaxed text-[#5a4035]">
                  Daughter of Md Khaliq &amp; Shabnam Perween
                </p>
              </motion.div>

              {/* ORNAMENT */}

              <motion.div
                initial={{
                  opacity: 0,
                  scaleX: 0,
                }}
                animate={{
                  opacity: 1,
                  scaleX: 1,
                }}
                transition={{
                  delay: 1.8,
                  duration: 0.8,
                }}
                className="mx-auto mt-6 flex items-center justify-center gap-2"
              >
                <span className="h-px w-10 bg-wedding-gold/60" />

                <span className="h-1.5 w-1.5 rotate-45 bg-wedding-gold" />

                <span className="h-px w-10 bg-wedding-gold/60" />
              </motion.div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </section>
  );
}