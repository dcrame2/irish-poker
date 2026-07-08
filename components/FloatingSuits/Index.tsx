import React, { useEffect, useState } from "react";
import styled from "styled-components";

// Ambient card suits drifting up the screen. Generated client-side only to
// avoid SSR hydration mismatches from Math.random().

const Layer = styled.div`
  position: fixed;
  inset: 0;
  overflow: hidden;
  pointer-events: none;
  z-index: 0;
`;

const SuitGlyph = styled.span<{
  $left: number;
  $size: number;
  $duration: number;
  $delay: number;
  $opacity: number;
}>`
  position: absolute;
  left: ${({ $left }) => $left}%;
  bottom: -10vh;
  font-size: ${({ $size }) => $size}rem;
  color: rgba(233, 184, 76, 0.5);
  --drift-o: ${({ $opacity }) => $opacity};
  animation: floatSuit ${({ $duration }) => $duration}s linear infinite;
  animation-delay: ${({ $delay }) => $delay}s;
  will-change: transform;
`;

// Suits + party emoji. Emoji keep their native colors, so they float at a
// slightly higher opacity to read through the dark felt.
const GLYPHS = ["♠", "♥", "♦", "♣", "☘", "🍺", "♠", "♥", "♦", "♣", "☘", "🍻"];
const EMOJI = new Set(["🍺", "🍻"]);

interface Drift {
  id: number;
  glyph: string;
  left: number;
  size: number;
  duration: number;
  delay: number;
  opacity: number;
}

export default function FloatingSuits() {
  const [drifts, setDrifts] = useState<Drift[]>([]);

  useEffect(() => {
    setDrifts(
      Array.from({ length: 26 }, (_, i) => {
        const glyph = GLYPHS[i % GLYPHS.length];
        return {
          id: i,
          glyph,
          left: Math.random() * 100,
          size: 1.2 + Math.random() * 2.8,
          duration: 16 + Math.random() * 22,
          delay: -Math.random() * 30,
          opacity: EMOJI.has(glyph) ? 0.34 : 0.22,
        };
      })
    );
  }, []);

  return (
    <Layer aria-hidden>
      {drifts.map((d) => (
        <SuitGlyph
          key={d.id}
          $left={d.left}
          $size={d.size}
          $duration={d.duration}
          $delay={d.delay}
          $opacity={d.opacity}
        >
          {d.glyph}
        </SuitGlyph>
      ))}
    </Layer>
  );
}
