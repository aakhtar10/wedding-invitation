
"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { motion } from "framer-motion";
import Image from "next/image";

const GOLD = ["#c9a96e", "#e6cf9f", "#f3e6d3", "#fffdf8"];
const BLUSH = ["#fbe3df", "#f4c7c3", "#e8a0a8", "#fffdf8"];

export default function WeddingScratch() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const cardRef = useRef<HTMLDivElement>(null);
  const rafRef = useRef<number | null>(null);

  const [revealed, setRevealed] = useState(false);

  const isDrawing = useRef(false);
  const lastPoint = useRef({ x: 0, y: 0 });
  const hasRevealed = useRef(false);

  /* ---------- Scratch surface setup ---------- */

  useEffect(() => {
    const canvas = canvasRef.current;
    const container = canvas?.parentElement;

    if (!canvas || !container) return;

    const setupCanvas = () => {
      // Do not reset the scratch surface after it has been revealed.
      if (hasRevealed.current) return;

      const rect = container.getBoundingClientRect();

      if (!rect.width || !rect.height) return;

      const dpr = Math.min(window.devicePixelRatio || 1, 2);

      canvas.width = Math.round(rect.width * dpr);
      canvas.height = Math.round(rect.height * dpr);

      canvas.style.width = `${rect.width}px`;
      canvas.style.height = `${rect.height}px`;

      const ctx = canvas.getContext("2d");
      if (!ctx) return;

      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);

      ctx.globalCompositeOperation = "source-over";
      ctx.globalAlpha = 1;

      // Scratch surface
      ctx.fillStyle = "#c9a96e";
      ctx.fillRect(0, 0, rect.width, rect.height);

      // Subtle texture
      ctx.globalAlpha = 0.12;

      for (let i = 0; i < 400; i++) {
        ctx.fillStyle = "#fffdf8";
        ctx.beginPath();

        ctx.arc(
          Math.random() * rect.width,
          Math.random() * rect.height,
          Math.random() * 1.5,
          0,
          Math.PI * 2
        );

        ctx.fill();
      }

      ctx.globalAlpha = 1;

      // Instruction text
      ctx.fillStyle = "#fffdf8";
      ctx.textAlign = "center";
      ctx.textBaseline = "middle";
      ctx.font = '500 11px "Montserrat", sans-serif';
      ctx.letterSpacing = "2px";

      ctx.fillText(
        "SCRATCH TO REVEAL",
        rect.width / 2,
        rect.height / 2
      );
    };

    setupCanvas();

    const observer = new ResizeObserver(() => {
      setupCanvas();
    });

    observer.observe(container);

    return () => observer.disconnect();
  }, []);

  /* ---------- Celebration ---------- */

  const celebrate = useCallback(async () => {
    const { default: confetti } = await import("canvas-confetti");

    const cardRect = cardRef.current?.getBoundingClientRect();

    const origin = cardRect
      ? {
          x: (cardRect.left + cardRect.width / 2) / window.innerWidth,
          y: (cardRect.top + cardRect.height / 2) / window.innerHeight,
        }
      : { x: 0.5, y: 0.5 };

    const petal = confetti.shapeFromPath({
      path: "M0 0 C0 -14 14 -14 14 0 C14 14 0 14 0 0 Z",
    });

    const base = {
      disableForReducedMotion: true,
      zIndex: 100,
    };

    // 1. Burst from the card
    confetti({
      ...base,
      particleCount: 60,
      spread: 360,
      startVelocity: 28,
      ticks: 90,
      origin,
      colors: GOLD,
      shapes: ["star", "circle"],
      scalar: 0.9,
    });

    confetti({
      ...base,
      particleCount: 24,
      spread: 120,
      startVelocity: 38,
      ticks: 220,
      gravity: 0.7,
      origin,
      colors: BLUSH,
      shapes: [petal],
      scalar: 1.6,
    });

    // 2. Twin cannons from lower corners
    const cannon = (x: number, angle: number) =>
      confetti({
        ...base,
        particleCount: 14,
        angle,
        spread: 60,
        startVelocity: 60,
        gravity: 0.9,
        ticks: 260,
        origin: { x, y: 0.95 },
        colors: [...GOLD, ...BLUSH],
        shapes: [petal],
        scalar: 1.5,
      });

    setTimeout(() => {
      cannon(0, 60);
      cannon(1, 120);
    }, 350);

    // 3. Gentle falling petals
    const end = Date.now() + 5000;
    let lastDrop = 0;

    const rain = (now: number) => {
      if (Date.now() > end) return;

      if (now - lastDrop > 140) {
        lastDrop = now;

        confetti({
          ...base,
          particleCount: 2,
          angle: 90,
          spread: 70,
          startVelocity: 8,
          gravity: 0.35,
          drift: (Math.random() - 0.5) * 1.2,
          ticks: 520,
          origin: { x: Math.random(), y: -0.05 },
          colors: BLUSH,
          shapes: [petal],
          scalar: 1.4 + Math.random() * 0.6,
        });
      }

      rafRef.current = requestAnimationFrame(rain);
    };

    rafRef.current = requestAnimationFrame(rain);
  }, []);

  /* ---------- Cleanup ---------- */

  useEffect(() => {
    return () => {
      if (rafRef.current) {
        cancelAnimationFrame(rafRef.current);
      }

      import("canvas-confetti").then(({ default: confetti }) => {
        confetti.reset();
      });
    };
  }, []);

  /* ---------- Scratch handling ---------- */

  const getPoint = (
    event: React.PointerEvent<HTMLCanvasElement>
  ) => {
    const canvas = canvasRef.current;

    if (!canvas) return { x: 0, y: 0 };

    const rect = canvas.getBoundingClientRect();

    return {
      x: event.clientX - rect.left,
      y: event.clientY - rect.top,
    };
  };

  const startScratch = (
    event: React.PointerEvent<HTMLCanvasElement>
  ) => {
    if (hasRevealed.current) return;

    event.preventDefault();

    isDrawing.current = true;
    lastPoint.current = getPoint(event);

    event.currentTarget.setPointerCapture(event.pointerId);
  };

  const scratch = (
    event: React.PointerEvent<HTMLCanvasElement>
  ) => {
    if (!isDrawing.current || hasRevealed.current) return;

    event.preventDefault();

    const canvas = canvasRef.current;
    const ctx = canvas?.getContext("2d");

    if (!canvas || !ctx) return;

    const point = getPoint(event);

    ctx.globalCompositeOperation = "destination-out";
    ctx.beginPath();

    ctx.moveTo(lastPoint.current.x, lastPoint.current.y);
    ctx.lineTo(point.x, point.y);

    ctx.lineWidth = 32;
    ctx.lineCap = "round";
    ctx.lineJoin = "round";

    ctx.stroke();

    lastPoint.current = point;
  };

  const stopScratch = (
    event?: React.PointerEvent<HTMLCanvasElement>
  ) => {
    isDrawing.current = false;

    if (
      event &&
      event.currentTarget.hasPointerCapture(event.pointerId)
    ) {
      event.currentTarget.releasePointerCapture(event.pointerId);
    }
  };

  /* ---------- Reveal detection ---------- */

  const handleScratchEnd = () => {
    if (hasRevealed.current) return;

    const canvas = canvasRef.current;
    const ctx = canvas?.getContext("2d");

    if (!canvas || !ctx) return;

    const { data } = ctx.getImageData(
      0,
      0,
      canvas.width,
      canvas.height
    );

    let transparent = 0;

    for (let i = 3; i < data.length; i += 4) {
      if (data[i] === 0) transparent++;
    }

    const percentage = transparent / (data.length / 4);

    if (percentage > 0.3) {
      hasRevealed.current = true;
      setRevealed(true);
      celebrate();
    }
  };

  return (
    <section className="relative bg-wedding-secondary px-6 py-24">
      {/* TOP FLORAL DIVIDER */}
      <Image
        src="/wedding/floral-divider.webp"
        alt=""
        width={1000}
        height={60}
        className="pointer-events-none absolute left-1/2 top-1 -translate-x-1/2 -translate-y-1/2 select-none object-cover"
        priority
      />

      <div className="mx-auto w-full max-w-md text-center">
        {/* EYEBROW */}
        <motion.p
          initial={{ opacity: 0, y: 10 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.7 }}
          className="wedding-eyebrow mb-3"
        >
          A date to hold close
        </motion.p>

        {/* TITLE */}
        <motion.h2
          key={revealed ? "revealed" : "hidden"}
          initial={{ opacity: 0, y: 15 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
          className="wedding-section-title"
        >
          {revealed ? "Our Forever Begins" : "Scratch to Reveal"}
        </motion.h2>

        {/* DESCRIPTION */}
        <motion.p
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8, delay: 0.2 }}
          className="wedding-body mx-auto mt-4 max-w-xs"
        >
          {revealed
            ? "A beautiful beginning awaits."
            : "There is a little message waiting for you."}
        </motion.p>

        {/* SCRATCH CARD */}
        <motion.div
          ref={cardRef}
          initial={{ opacity: 0, scale: 0.95 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8, delay: 0.3 }}
          className="relative mx-auto mt-10 aspect-[1.7/1] w-full max-w-sm overflow-hidden rounded-2xl border border-wedding-gold/40 bg-wedding-surface shadow-xl"
        >
          {/* REVEALED CONTENT */}
          <motion.div
            animate={
              revealed
                ? { scale: [1, 1.06, 1], opacity: 1 }
                : { scale: 1, opacity: 1 }
            }
            transition={{ duration: 0.9, ease: "easeOut" }}
            className="absolute inset-0 flex flex-col items-center justify-center px-8 text-center"
          >
            <p className="wedding-eyebrow mb-3">
              Save the date
            </p>

            <h3 className="font-allura text-5xl leading-none text-wedding-text">
              27 December
            </h3>

            <p className="mt-1 font-body text-sm tracking-[0.35em] text-wedding-gold-dark">
              2026
            </p>
          </motion.div>

          {/* SCRATCH LAYER */}
          <canvas
            ref={canvasRef}
            onPointerDown={startScratch}
            onPointerMove={scratch}
            onPointerUp={(event) => {
              stopScratch(event);
              handleScratchEnd();
            }}
            onPointerCancel={stopScratch}
            onLostPointerCapture={() => {
              isDrawing.current = false;
            }}
            className={`absolute inset-0 z-10 h-full w-full touch-none select-none rounded-2xl transition-opacity duration-700 ${
              revealed
                ? "pointer-events-none opacity-0"
                : "cursor-pointer opacity-100"
            }`}
          />

          {/* DECORATIVE FRAME */}
          <Image
            src="/wedding/scratch-frame.webp"
            alt=""
            fill
            sizes="(max-width: 448px) calc(100vw - 48px), 384px"
            className="pointer-events-none absolute inset-0 z-20 scale-[1.09] select-none object-cover"
            priority
          />

          {/* REVEALED GLOW RING */}
          {revealed && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.8 }}
              className="pointer-events-none absolute inset-0 z-30 rounded-2xl ring-1 ring-wedding-gold/30"
            />
          )}
        </motion.div>

        {/* CAPTIONS */}
        {!revealed && (
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="wedding-caption mt-5"
          >
            ✦ Use your finger to scratch ✦
          </motion.p>
        )}

        {revealed && (
          <motion.p
            initial={{ opacity: 0, y: 5 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.6 }}
            className="wedding-caption mt-5"
          >
            Thank you for being part of our story.
          </motion.p>
        )}
      </div>

      {/* BOTTOM FLORAL DIVIDER */}
      <Image
        src="/wedding/floral-divider.webp"
        alt=""
        width={1000}
        height={60}
        className="pointer-events-none absolute bottom-1 left-1/2 -translate-x-1/2 translate-y-1/2 rotate-180 select-none"
      />
    </section>
  );
}
