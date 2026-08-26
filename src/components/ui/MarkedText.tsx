"use client";

import { Fragment } from "react";
import { Highlight, type HighlightColor } from "@/components/ui/Highlight";

/** Phrases wrapped in `==` are drawn with the highlighter as they scroll into view. */
const MARKER = /==(.+?)==/g;

const CYCLE: HighlightColor[] = ["yellow", "cyan", "pink", "mint"];

/**
 * Renders copy that carries `==marker==` spans. Keeping the marker in the content
 * file means the emphasis travels with the translation instead of being pinned to a
 * word position in the markup.
 */
export function MarkedText({ text, className }: { text: string; className?: string }) {
  const parts = text.split(MARKER);

  // split() with one capture group alternates plain, captured, plain, captured…
  let marked = -1;

  return (
    <span className={className}>
      {parts.map((part, index) => {
        if (index % 2 === 0) {
          return <Fragment key={index}>{part}</Fragment>;
        }

        marked += 1;
        return (
          <Highlight
            key={index}
            color={CYCLE[marked % CYCLE.length]}
            // Consecutive marks sweep in from opposite sides.
            from={marked % 2 === 0 ? "start" : "end"}
          >
            {part}
          </Highlight>
        );
      })}
    </span>
  );
}
