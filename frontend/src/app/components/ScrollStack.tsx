"use client";

import React, {
  useCallback,
  useEffect,
  useLayoutEffect,
  useRef,
} from "react";
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
    <div className={`scroll-stack-card ${itemClassName}`.trim()}>
      {children}
    </div>
  );
};

interface ScrollStackProps {
  className?: string;
  children: ReactNode;
  itemDistance?: number;
  itemScale?: number;
  itemStackDistance?: number;
  stackPosition?: string;
  scaleEndPosition?: string;
  baseScale?: number;
  rotationAmount?: number;
  blurAmount?: number;
  useWindowScroll?: boolean;
  onStackComplete?: () => void;
}

const ScrollStack: React.FC<ScrollStackProps> = ({
  children,
  className = "",
  itemDistance = 100,
  itemScale = 0.03,
  itemStackDistance = 30,
  stackPosition = "18%",
  scaleEndPosition = "8%",
  baseScale = 0.9,
  rotationAmount = 0,
  blurAmount = 0,
  onStackComplete,
}) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const cardsRef = useRef<HTMLElement[]>([]);
  const rafRef = useRef<number | null>(null);
  const completedRef = useRef(false);

  const parsePosition = useCallback(
    (value: string | number) => {
      const viewportHeight = window.innerHeight;

      if (
        typeof value === "string" &&
        value.includes("%")
      ) {
        return (
          (parseFloat(value) / 100) *
          viewportHeight
        );
      }

      return parseFloat(String(value));
    },
    []
  );

  const updateCards = useCallback(() => {
    if (!cardsRef.current.length) {
      return;
    }

    const scrollY = window.scrollY;
    const viewportHeight = window.innerHeight;

    const stackPositionPx =
      parsePosition(stackPosition);

    const scaleEndPositionPx =
      parsePosition(scaleEndPosition);

    const container =
      containerRef.current;

    if (!container) return;

    const containerTop =
      container.getBoundingClientRect().top +
      scrollY;

    cardsRef.current.forEach((card, index) => {
      const cardTop =
        card.getBoundingClientRect().top +
        scrollY;

      const relativeScroll =
        scrollY -
        (cardTop -
          stackPositionPx -
          index * itemStackDistance);

      const scaleDistance =
        viewportHeight *
        0.25;

      const scaleProgress = Math.min(
        1,
        Math.max(
          0,
          relativeScroll /
            scaleDistance
        )
      );

      const targetScale =
        1 -
        (1 -
          (baseScale +
            index * itemScale)) *
          scaleProgress;

      const rotation =
        rotationAmount *
        index *
        scaleProgress;

      let blur = 0;

      if (
        blurAmount &&
        relativeScroll > 0
      ) {
        blur =
          Math.min(
            index * blurAmount,
            blurAmount * 3
          );
      }

      /*
       * Before reaching the stack:
       * card stays normal.
       *
       * Once sticky takes over:
       * only scale/rotation is changed.
       */
      if (relativeScroll <= 0) {
        card.style.transform =
          "translate3d(0, 0, 0) scale(1) rotate(0deg)";

        card.style.filter = "none";

        return;
      }

      /*
       * Keep the card visually fixed.
       *
       * CSS sticky handles the actual
       * position. JS only handles
       * visual effects.
       */
      card.style.transform =
        `translate3d(0, 0, 0) ` +
        `scale(${targetScale}) ` +
        `rotate(${rotation}deg)`;

      card.style.filter =
        blur > 0
          ? `blur(${blur}px)`
          : "none";
    });

    /*
     * Detect when the last card
     * reaches the stack.
     */
    const lastCard =
      cardsRef.current[
        cardsRef.current.length - 1
      ];

    if (lastCard) {
      const rect =
        lastCard.getBoundingClientRect();

      const isComplete =
        rect.top <=
        stackPositionPx;

      if (
        isComplete &&
        !completedRef.current
      ) {
        completedRef.current = true;
        onStackComplete?.();
      }

      if (
        !isComplete &&
        completedRef.current
      ) {
        completedRef.current = false;
      }
    }
  }, [
    baseScale,
    blurAmount,
    itemScale,
    itemStackDistance,
    onStackComplete,
    parsePosition,
    rotationAmount,
    scaleEndPosition,
    stackPosition,
  ]);

  const requestUpdate = useCallback(() => {
    if (rafRef.current !== null) {
      return;
    }

    rafRef.current =
      requestAnimationFrame(() => {
        rafRef.current = null;
        updateCards();
      });
  }, [updateCards]);

  useLayoutEffect(() => {
    const container =
      containerRef.current;

    if (!container) return;

    const cards = Array.from(
      container.querySelectorAll(
        ".scroll-stack-card"
      )
    ) as HTMLElement[];

    cardsRef.current = cards;

    cards.forEach((card, index) => {
      /*
       * Space between cards.
       */
      if (
        index <
        cards.length - 1
      ) {
        card.style.marginBottom =
          `${itemDistance}px`;
      }

      /*
       * Sticky positioning.
       */
      card.style.position =
        "sticky";

      card.style.top =
        `calc(${stackPosition} + ${index * itemStackDistance}px)`;

      /*
       * GPU optimization.
       */
      card.style.willChange =
        "transform";

      card.style.transformOrigin =
        "top center";

      card.style.backfaceVisibility =
        "hidden";

      card.style.webkitBackfaceVisibility =
        "hidden";

      card.style.zIndex =
        String(index + 1);
    });

    requestAnimationFrame(
      updateCards
    );

    const handleResize = () => {
      requestUpdate();
    };

    window.addEventListener(
      "resize",
      handleResize
    );

    window.addEventListener(
      "scroll",
      requestUpdate,
      { passive: true }
    );

    return () => {
      window.removeEventListener(
        "resize",
        handleResize
      );

      window.removeEventListener(
        "scroll",
        requestUpdate
      );

      if (
        rafRef.current !== null
      ) {
        cancelAnimationFrame(
          rafRef.current
        );

        rafRef.current = null;
      }

      cards.forEach((card) => {
        card.style.position = "";
        card.style.top = "";
        card.style.zIndex = "";
        card.style.transform = "";
        card.style.filter = "";
        card.style.marginBottom = "";
        card.style.willChange = "";
      });

      cardsRef.current = [];
      completedRef.current = false;
    };
  }, [
    itemDistance,
    itemStackDistance,
    requestUpdate,
    stackPosition,
    updateCards,
  ]);

  return (
    <div
      ref={containerRef}
      className={`scroll-stack-scroller ${className}`.trim()}
    >
      <div className="scroll-stack-inner">
        {children}

        <div className="scroll-stack-end" />
      </div>
    </div>
  );
};

export default ScrollStack;