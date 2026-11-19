"use client";

import { motion, useReducedMotion } from "framer-motion";
import { useCallback, useEffect, useRef, useState } from "react";

interface WeddingOpeningProps {
  isOpened: boolean;
}

// If the video never reaches "ended" (autoplay blocked, slow network, decode
// error) the invitation text would stay hidden forever. Reveal it anyway.
const REVEAL_FALLBACK_MS = 20000;

/**
 * A name that is "written" left to right. The clip-path overshoots the box
 * slightly so Allura's swashes and descenders are never cut off.
 */
function WrittenName({
  children,
  delay,
  reduce,
}: {
  children: string;
  delay: number;
  reduce: boolean;
}) {
  return (
    <div aria-hidden="true" className="wedding-script-name">
      <motion.span
        className="inline-block"
        initial={
          reduce ? false : { clipPath: "inset(-30% 100% -30% -6%)" }
        }
        animate={{ clipPath: "inset(-30% -6% -30% -6%)" }}
        transition={{ delay, duration: 1.7, ease: [0.45, 0, 0.2, 1] }}
      >
        {children}
      </motion.span>
    </div>
  );
}

function Fade({
  children,
  delay,
  reduce,
  className,
}: {
  children: React.ReactNode;
  delay: number;
  reduce: boolean;
  className?: string;
}) {
  return (
    <motion.div
      className={className}
      initial={reduce ? false : { opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ delay, duration: 0.9, ease: "easeOut" }}
    >
      {children}
    </motion.div>
  );
}

export default function WeddingOpening({ isOpened }: WeddingOpeningProps) {
  const reduce = useReducedMotion() ?? false;

  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const hasStarted = useRef(false);

  const [videoEnded, setVideoEnded] = useState(false);
  const [finalFrame, setFinalFrame] = useState<string | null>(null);

  const reveal = useCallback(() => setVideoEnded(true), []);

  useEffect(() => {
    const video = videoRef.current;
    if (!video || !isOpened || hasStarted.current) return;

    hasStarted.current = true;

    video.muted = true;
    video.playsInline = true;
    video.playbackRate = 1.75;

    video.play().catch((error) => {
      console.error("Wedding video failed to play:", error);
      reveal();
    });

    const timer = window.setTimeout(reveal, REVEAL_FALLBACK_MS);
    return () => window.clearTimeout(timer);
  }, [isOpened, reveal]);

  const handleVideoEnd = () => {
    const video = videoRef.current;
    const canvas = canvasRef.current;

    video?.pause();

    if (video && canvas && video.videoWidth && video.videoHeight) {
      canvas.width = video.videoWidth;
      canvas.height = video.videoHeight;

      const context = canvas.getContext("2d");
      if (context) {
        context.drawImage(video, 0, 0, canvas.width, canvas.height);
        try {
          setFinalFrame(canvas.toDataURL("image/webp", 0.95));
        } catch (error) {
          console.error("Final frame capture failed:", error);
        }
      }
    }

    reveal();
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
        onError={reveal}
        style={{
          transform: "translateZ(0)",
          backfaceVisibility: "hidden",
          WebkitBackfaceVisibility: "hidden",
        }}
        className="absolute inset-0 z-0 h-full w-full object-cover"
      />

      {/* PERMANENT FINAL VIDEO FRAME */}
      {finalFrame && (
        // eslint-disable-next-line @next/next/no-img-element
        <img
          src={finalFrame}
          alt=""
          aria-hidden="true"
          draggable={false}
          className="absolute inset-0 z-[1] h-full w-full object-cover"
        />
      )}

      <canvas ref={canvasRef} className="hidden" aria-hidden="true" />

      {/* SOFT WASH so the text stays readable over any frame of the video */}
      {videoEnded && (
        <motion.div
          aria-hidden="true"
          className="wedding-wash pointer-events-none absolute inset-0 z-[2]"
          initial={reduce ? false : { opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 1.2 }}
        />
      )}

      {/* INVITATION */}
      {videoEnded && (
        <div className="absolute inset-0 z-10 flex items-center justify-center px-5 py-8">
          <div className="w-full max-w-md text-center">
            <h1 className="sr-only">
              Arsalan Akhtar and Maria Bin-tul Islam are getting married
            </h1>

            {/* Bismillah + translation */}
            <Fade delay={0} reduce={reduce}>
              <p dir="rtl" lang="ar" className="wedding-bismillah">
                ﷽
              </p>
              <p className="wedding-lede wedding-lede--small mt-1">
                In the name of Allah, the Most Gracious, the Most Merciful
              </p>
            </Fade>

            <Fade delay={0.8} reduce={reduce} className="mt-10">
              <p className="wedding-lede">Together with their families</p>
            </Fade>

            {/* Groom: the name is written, then his parents appear */}
            <div className="mt-3">
              <WrittenName delay={1.2} reduce={reduce}>
                Arsalan Akhtar
              </WrittenName>
              <Fade delay={2.4} reduce={reduce}>
                <p className="wedding-parents">
                  Son of Md Sohail Akhtar &amp; Gazala Perween
                </p>
              </Fade>
            </div>

            {/* The ampersand sits between the two families, so it carries
                hairlines that join them */}
            <Fade
              delay={2.5}
              reduce={reduce}
              className="my-5 flex items-center justify-center gap-4"
            >
              <span className="h-px w-14 bg-wedding-gold/60" />
              <span className="wedding-amp">&amp;</span>
              <span className="h-px w-14 bg-wedding-gold/60" />
            </Fade>

            {/* Bride */}
            <div>
              <WrittenName delay={2.8} reduce={reduce}>
                Maria Bin-tul Islam
              </WrittenName>
              <Fade delay={4.0} reduce={reduce}>
                <p className="wedding-parents">
                  Daughter of Md Khaliq &amp; Shabnam Perween
                </p>
              </Fade>
            </div>

            {/* Scroll cue: a line that draws downward, no text needed */}
         {/* Scroll cue */}
<Fade
  delay={4.8}
  reduce={reduce}
  className="mt-10 flex flex-col items-center gap-3"
>
  <div className="relative h-10 w-px overflow-hidden bg-wedding-gold/30">
    <motion.span
      className="absolute inset-x-0 top-0 h-5 bg-wedding-gold-dark"
      animate={reduce ? undefined : { y: [-20, 40] }}
      transition={{
        duration: 1.8,
        repeat: Infinity,
        ease: "easeInOut",
      }}
    />
  </div>

  <motion.p
    className="wedding-eyebrow text-[0.58rem] tracking-[0.3em]"
    animate={reduce ? undefined : { opacity: [0.5, 1, 0.5] }}
    transition={{
      duration: 2.4,
      repeat: Infinity,
      ease: "easeInOut",
    }}
  >
    SCROLL TO EXPLORE
  </motion.p>
</Fade>
          </div>
        </div>
      )}
    </section>
  );
}