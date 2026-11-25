"use client";

import { Fragment } from "react";
import { Highlight } from "@/components/ui/Highlight";
import type { Accent } from "@/lib/accents";

/** Phrases wrapped in `==` are drawn with the highlighter as they scroll into view. */
const MARKER = /==(.+?)==/g;

/** Starts on yellow, unlike the card cycle: the first highlight is the classic marker. */
const CYCLE: Accent[] = ["yellow", "cyan", "pink", "mint"];

/**
 * Renders copy that carries `==marker==` spans. Keeping the marker in the content
 * file means the emphasis travels with the translation instead of being pinned to a
 * word position in the markup.
 */
export function MarkedText({ text }: { text: string }) {
  const parts = text.split(MARKER);

  return (
    <span>
      {parts.map((part, index) => {
        // split() with one capture group alternates plain, captured, plain…
        // so odd indexes are the marked phrases.
        if (index % 2 === 0) {
          return <Fragment key={index}>{part}</Fragment>;
        }

        const marked = (index - 1) / 2;
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
