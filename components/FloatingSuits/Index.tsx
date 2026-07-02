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
}>`
  position: absolute;
  left: ${({ $left }) => $left}%;
  bottom: -10vh;
  font-size: ${({ $size }) => $size}rem;
  color: rgba(233, 184, 76, 0.5);
  animation: floatSuit ${({ $duration }) => $duration}s linear infinite;
  animation-delay: ${({ $delay }) => $delay}s;
  will-change: transform;
`;

const GLYPHS = ["♠", "♥", "♦", "♣", "☘"];

interface Drift {
  id: number;
  glyph: string;
  left: number;
  size: number;
  duration: number;
  delay: number;
}

export default function FloatingSuits() {
  const [drifts, setDrifts] = useState<Drift[]>([]);

  useEffect(() => {
    setDrifts(
      Array.from({ length: 14 }, (_, i) => ({
        id: i,
        glyph: GLYPHS[i % GLYPHS.length],
        left: Math.random() * 100,
        size: 1 + Math.random() * 2.2,
        duration: 18 + Math.random() * 22,
        delay: -Math.random() * 30,
      }))
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
        >
          {d.glyph}
        </SuitGlyph>
      ))}
    </Layer>
  );
}
