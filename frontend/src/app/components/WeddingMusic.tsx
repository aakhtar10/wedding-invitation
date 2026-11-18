
"use client";

import { useEffect, useRef, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { Music2, Pause, Play } from "lucide-react";

interface WeddingMusicProps {
  isOpened: boolean;
}

export default function WeddingMusic({ isOpened }: WeddingMusicProps) {
  const audioRef = useRef<HTMLAudioElement>(null);

  const [started, setStarted] = useState(false);
  const [playing, setPlaying] = useState(false);

  // Automatically start music when invitation opens
  useEffect(() => {
    if (!isOpened) return;

    const audio = audioRef.current;
    if (!audio) return;

    setStarted(true);

    audio.play()
      .then(() => setPlaying(true))
      .catch((error) => {
        console.error("Music playback failed:", error);
        setPlaying(false);
      });
  }, [isOpened]);

  const toggleMusic = async () => {
    const audio = audioRef.current;
    if (!audio) return;

    if (!started) {
      setStarted(true);
    }

    if (audio.paused) {
      try {
        await audio.play();
        setPlaying(true);
      } catch (error) {
        console.error("Music playback failed:", error);
        setPlaying(false);
      }
    } else {
      audio.pause();
      setPlaying(false);
    }
  };

  useEffect(() => {
    const audio = audioRef.current;
    if (!audio) return;

    const handlePlay = () => setPlaying(true);
    const handlePause = () => setPlaying(false);
    const handleEnded = () => setPlaying(false);

    audio.addEventListener("play", handlePlay);
    audio.addEventListener("pause", handlePause);
    audio.addEventListener("ended", handleEnded);

    return () => {
      audio.removeEventListener("play", handlePlay);
      audio.removeEventListener("pause", handlePause);
      audio.removeEventListener("ended", handleEnded);
    };
  }, []);

  return (
    <>
      <audio
        ref={audioRef}
        src="/music/wedding-song.mp3"
        loop
        preload="none"
      />

    

      {/* Fixed music control after starting */}
      <AnimatePresence>
        {started && (
          <motion.button
            type="button"
            onClick={toggleMusic}
            initial={{ opacity: 0, scale: 0.5 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.5 }}
            whileTap={{ scale: 0.9 }}
            aria-label={playing ? "Pause wedding music" : "Play wedding music"}
            className="
              fixed bottom-6 right-5 z-[100]
              flex h-12 w-12 items-center justify-center
              rounded-full border border-wedding-gold/50
              bg-wedding-surface text-wedding-gold-dark
              shadow-xl
            "
          >
            {playing ? (
              <motion.div
                animate={{ rotate: 360 }}
                transition={{
                  duration: 5,
                  repeat: Infinity,
                  ease: "linear",
                }}
              >
                <Pause size={19} strokeWidth={1.6} />
              </motion.div>
            ) : (
              <Play size={19} strokeWidth={1.6} />
            )}
          </motion.button>
        )}
      </AnimatePresence>
    </>
  );
}
