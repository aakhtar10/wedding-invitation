"use client";

import React, { useCallback, useEffect, useLayoutEffect, useRef } from "react";
import type { ReactNode } from "react";
import "./ScrollStack.css";

export interface ScrollStackItemProps {
  itemClassName?: string;
  children: ReactNode;
}

export const ScrollStackItem: React.FC<ScrollStackItemProps> = ({
  children,
  itemClassName = "",
}) => {
  return (
    <div className={`scroll-stack-card ${itemClassName}`.trim()}>{children}</div>
  );
};

interface ScrollStackProps {
  className?: string;
  children: ReactNode;
  /** Gap between cards in px (shorter = less scrolling) */
  itemDistance?: number;
  /** Scale step per card: deeper cards end up slightly smaller */
  itemScale?: number;
  /** How many px of each card peeks out above the next one */
  itemStackDistance?: number;
  /** Where the first card pins. Prefer rem/px: "5rem". "%" also works */
  stackPosition?: string | number;
  baseScale?: number;
  rotationAmount?: number;
  blurAmount?: number;
  /** 0–1, how much a covered card darkens (adds depth) */
  dimAmount?: number;
  onStackComplete?: () => void;
}

const clamp = (v: number, min: number, max: number) =>
  Math.min(max, Math.max(min, v));

function toPx(value: string | number): number {
  if (typeof value === "number") return value;
  const v = value.trim();
  const n = parseFloat(v);
  if (v.endsWith("%")) return (n / 100) * window.innerHeight;
  if (v.endsWith("rem")) {
    return (
      n * parseFloat(getComputedStyle(document.documentElement).fontSize)
    );
  }
  return n;
}

const ScrollStack: React.FC<ScrollStackProps> = ({
  children,
  className = "",
  itemDistance = 48,
  itemScale = 0.03,
  itemStackDistance = 22,
  stackPosition = "5rem",
  baseScale = 0.9,
  rotationAmount = 0,
  blurAmount = 0,
  dimAmount = 0.07,
  onStackComplete,
}) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const innerRef = useRef<HTMLDivElement>(null);
  const cardsRef = useRef<HTMLElement[]>([]);
  const pinStartsRef = useRef<number[]>([]);
  const rafRef = useRef<number | null>(null);
  const completedRef = useRef(false);
  const reduceMotionRef = useRef(false);
  const onCompleteRef = useRef(onStackComplete);

  useEffect(() => {
    onCompleteRef.current = onStackComplete;
  });

  /**
   * Work out the scrollY at which each card becomes pinned.
   * Uses natural (unstuck) layout positions, so it stays correct
   * while cards are stuck or scaled.
   */
  const measure = useCallback(() => {
    const inner = innerRef.current;
    const cards = cardsRef.current;
    if (!inner || !cards.length) return;

    const stackPx = toPx(stackPosition);
    const innerTop = inner.getBoundingClientRect().top + window.scrollY;
    let y = innerTop + (parseFloat(getComputedStyle(inner).paddingTop) || 0);

    pinStartsRef.current = cards.map((card, i) => {
      const pinStart = y - stackPx - i * itemStackDistance;
      y += card.offsetHeight + itemDistance;
      return pinStart;
    });
  }, [itemDistance, itemStackDistance, stackPosition]);

  const update = useCallback(() => {
    const cards = cardsRef.current;
    const pinStarts = pinStartsRef.current;
    if (!cards.length || pinStarts.length !== cards.length) return;

    const scrollY = window.scrollY;

    cards.forEach((card, i) => {
      // A card shrinks while the NEXT card slides up over it
      const nextPin = pinStarts[i + 1];
      const progress =
        nextPin === undefined || reduceMotionRef.current
          ? 0
          : clamp((scrollY - pinStarts[i]) / (nextPin - pinStarts[i]), 0, 1);

      const scale = 1 - (1 - (baseScale + i * itemScale)) * progress;
      const rotate = rotationAmount * i * progress;

      const filters: string[] = [];
      if (blurAmount && progress > 0.01) {
        filters.push(`blur(${(blurAmount * progress).toFixed(2)}px)`);
      }
      if (dimAmount && progress > 0) {
        filters.push(`brightness(${(1 - dimAmount * progress).toFixed(3)})`);
      }

      card.style.transform = `translate3d(0,0,0) scale(${scale}) rotate(${rotate}deg)`;
      card.style.filter = filters.length ? filters.join(" ") : "none";
    });

    const isComplete = scrollY >= pinStarts[pinStarts.length - 1];
    if (isComplete && !completedRef.current) {
      completedRef.current = true;
      onCompleteRef.current?.();
    } else if (!isComplete && completedRef.current) {
      completedRef.current = false;
    }
  }, [baseScale, blurAmount, dimAmount, itemScale, rotationAmount]);

  const requestUpdate = useCallback(() => {
    if (rafRef.current !== null) return;
    rafRef.current = requestAnimationFrame(() => {
      rafRef.current = null;
      update();
    });
  }, [update]);

  useLayoutEffect(() => {
    const container = containerRef.current;
    const inner = innerRef.current;
    if (!container || !inner) return;

    const cards = Array.from(
      container.querySelectorAll<HTMLElement>(".scroll-stack-card")
    );
    cardsRef.current = cards;

    reduceMotionRef.current = window.matchMedia(
      "(prefers-reduced-motion: reduce)"
    ).matches;

    const topBase =
      typeof stackPosition === "number" ? `${stackPosition}px` : stackPosition;

    cards.forEach((card, i) => {
      card.style.marginBottom =
        i < cards.length - 1 ? `${itemDistance}px` : "";
      card.style.position = "sticky";
      card.style.top = `calc(${topBase} + ${i * itemStackDistance}px)`;
      card.style.zIndex = String(i + 1);
      card.style.transformOrigin = "top center";
      card.style.willChange = "transform";
    });

    let cancelled = false;
    const refresh = () => {
      if (cancelled) return;
      measure();
      update();
    };

    refresh();

    // Re-measure when fonts load or card content changes height
    document.fonts?.ready.then(refresh);
    const ro = new ResizeObserver(refresh);
    ro.observe(inner);

    window.addEventListener("resize", refresh);
    window.addEventListener("scroll", requestUpdate, { passive: true });

    return () => {
      cancelled = true;
      ro.disconnect();
      window.removeEventListener("resize", refresh);
      window.removeEventListener("scroll", requestUpdate);

      if (rafRef.current !== null) {
        cancelAnimationFrame(rafRef.current);
        rafRef.current = null;
      }

      cards.forEach((card) => {
        card.style.position = "";
        card.style.top = "";
        card.style.zIndex = "";
        card.style.transform = "";
        card.style.transformOrigin = "";
        card.style.filter = "";
        card.style.marginBottom = "";
        card.style.willChange = "";
      });

      cardsRef.current = [];
      pinStartsRef.current = [];
      completedRef.current = false;
    };
  }, [
    itemDistance,
    itemStackDistance,
    stackPosition,
    measure,
    update,
    requestUpdate,
  ]);

  return (
    <div
      ref={containerRef}
      className={`scroll-stack-scroller ${className}`.trim()}
    >
      <div ref={innerRef} className="scroll-stack-inner">
        {children}
        <div className="scroll-stack-end" />
      </div>
    </div>
  );
};

export default ScrollStack;