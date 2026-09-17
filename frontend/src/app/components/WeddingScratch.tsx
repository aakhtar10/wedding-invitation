"use client";

import { useEffect, useRef, useState } from "react";
import { motion } from "framer-motion";
import Image from "next/image";

export default function WeddingScratch() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [revealed, setRevealed] = useState(false);
  const isDrawing = useRef(false);
  const lastPoint = useRef({ x: 0, y: 0 });

  useEffect(() => {
    const canvas = canvasRef.current;

    if (!canvas) return;

    const container = canvas.parentElement;

    if (!container) return;

    const rect = container.getBoundingClientRect();
    const dpr = window.devicePixelRatio || 1;

    canvas.width = rect.width * dpr;
    canvas.height = rect.height * dpr;

    canvas.style.width = `${rect.width}px`;
    canvas.style.height = `${rect.height}px`;

    const ctx = canvas.getContext("2d");

    if (!ctx) return;

    ctx.scale(dpr, dpr);

    // Scratch surface
    ctx.fillStyle = "#c9a96e";
    ctx.fillRect(0, 0, rect.width, rect.height);

    // Subtle texture
    ctx.globalAlpha = 0.12;

    for (let i = 0; i < 400; i++) {
      const x = Math.random() * rect.width;
      const y = Math.random() * rect.height;

      ctx.fillStyle = "#fffdf8";
      ctx.beginPath();
      ctx.arc(x, y, Math.random() * 1.5, 0, Math.PI * 2);
      ctx.fill();
    }

    ctx.globalAlpha = 1;

    // Scratch instruction
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
  }, []);

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

  const scratch = (
    event: React.PointerEvent<HTMLCanvasElement>
  ) => {
    if (!isDrawing.current) return;

    const canvas = canvasRef.current;

    if (!canvas) return;

    const ctx = canvas.getContext("2d");

    if (!ctx) return;

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

  const startScratch = (
    event: React.PointerEvent<HTMLCanvasElement>
  ) => {
    isDrawing.current = true;

    const point = getPoint(event);

    lastPoint.current = point;

    event.currentTarget.setPointerCapture(event.pointerId);
  };

  const stopScratch = () => {
    isDrawing.current = false;
  };

  const handleScratchEnd = () => {
    const canvas = canvasRef.current;

    if (!canvas) return;

    const ctx = canvas.getContext("2d");

    if (!ctx) return;

    const imageData = ctx.getImageData(
      0,
      0,
      canvas.width,
      canvas.height
    );

    let transparent = 0;

    for (let i = 3; i < imageData.data.length; i += 4) {
      if (imageData.data[i] === 0) {
        transparent++;
      }
    }

    const percentage =
      transparent / (imageData.data.length / 4);

    if (percentage > 0.30) {
      setRevealed(true);
    }
  };

  return (
    <section className="relative  bg-wedding-secondary px-6 py-24">
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
  initial={{ opacity: 0, y: 15 }}
  whileInView={{ opacity: 1, y: 0 }}
  viewport={{ once: true }}
  transition={{ duration: 0.8 }}
  className="wedding-section-title"
>
  {revealed ? "Our Forver Begins" : "Scratch to Reveal"}
</motion.h2>

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
          initial={{ opacity: 0, scale: 0.95 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8, delay: 0.3 }}
          className="relative mx-auto mt-10 aspect-[1.7/1] w-full max-w-sm  rounded-2xl border border-wedding-gold/40 bg-wedding-surface shadow-xl"
        >
      {/* REVEALED CONTENT */}
<div className="absolute inset-0 flex flex-col items-center justify-center px-8 text-center">
  <p className="wedding-eyebrow mb-3">
    Save the date
  </p>

  <h3 className="font-allura text-5xl leading-none text-wedding-text">
    27 December
  </h3>

  <p className="mt-1 font-body text-sm tracking-[0.35em] text-wedding-gold-dark">
    2027
  </p>

 
</div>

          {/* SCRATCH LAYER */}
          {!revealed && (
            <canvas
              ref={canvasRef}
              onPointerDown={startScratch}
              onPointerMove={scratch}
              onPointerUp={(event) => {
                stopScratch();
                handleScratchEnd();
                event.currentTarget.releasePointerCapture(
                  event.pointerId
                );
              }}
              onPointerCancel={stopScratch}
              className="absolute inset-0 h-full w-full cursor-pointer touch-none"
            />
          )}
           {/* DECORATIVE FRAME — always visible, sits above canvas & revealed content */}
          <Image
            src="/wedding/scratch-frame.webp"
            alt=""
            fill
            className="pointer-events-none absolute scale-[1.09] inset-0 z-20 select-none object-cover"
            priority
          />

          {/* REVEALED BADGE */}
          {revealed && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.8 }}
              className="pointer-events-none absolute inset-0 rounded-2xl ring-1 ring-wedding-gold/30"
            />
          )}
        </motion.div>

        {/* INSTRUCTION */}
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