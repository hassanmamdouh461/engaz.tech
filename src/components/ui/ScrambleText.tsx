"use client";

import { useEffect, useRef, useState } from "react";

const LATIN = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789!@#$%^&*";
const ARABIC = "ابتثجحخدذرزسشصضطظعغفقكلمنهوي٠١٢٣٤٥٦٧٨٩";

/** Characters are drawn from the same script as the target, or the word turns to noise. */
function poolFor(text: string): string {
  return /[\u0600-\u06FF]/.test(text) ? ARABIC : LATIN;
}

/**
 * Resolves a string from random characters, one third of a character per tick.
 * Whitespace and anything outside the two alphabets (emoji, punctuation) are held
 * in place so the shape of the phrase is readable while it settles.
 */
export function ScrambleText({
  text,
  delay = 400,
  className,
}: {
  text: string;
  delay?: number;
  className?: string;
}) {
  const [display, setDisplay] = useState(text);
  const frame = useRef(0);

  useEffect(() => {
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      setDisplay(text);
      return;
    }

    const pool = poolFor(text);
    const chars = [...text];
    frame.current = 0;
    let interval = 0;

    const start = window.setTimeout(() => {
      interval = window.setInterval(() => {
        setDisplay(
          chars
            .map((char, index) => {
              if (index < frame.current) return char;
              if (!pool.includes(char)) return char;
              return pool[Math.floor(Math.random() * pool.length)];
            })
            .join(""),
        );

        if (frame.current >= chars.length) {
          window.clearInterval(interval);
          setDisplay(text);
        }

        frame.current += 1 / 3;
      }, 50);
    }, delay);

    return () => {
      window.clearTimeout(start);
      window.clearInterval(interval);
    };
  }, [text, delay]);

  // The label carries the settled string so assistive tech never reads the noise.
  return (
    <span className={className} aria-label={text}>
      <span aria-hidden>{display}</span>
    </span>
  );
}
