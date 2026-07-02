import React, { useEffect, useRef } from "react";
import styled from "styled-components";

// Lightweight canvas particles. Two modes:
//  - gold confetti rectangles (correct guesses), driven by `active`
//  - emoji rain (e.g. 🍺 when you have to drink), driven by `fireKey`

const Canvas = styled.canvas`
  position: fixed;
  inset: 0;
  width: 100vw;
  height: 100dvh;
  pointer-events: none;
  z-index: 52;
`;

const COLORS = ["#e9b84c", "#4fc878", "#f4efe1", "#e6484d", "#5ab0f2"];

interface Piece {
  x: number;
  y: number;
  vx: number;
  vy: number;
  size: number;
  color: string;
  rot: number;
  vrot: number;
  life: number;
}

interface Props {
  active?: boolean;
  fireKey?: number;
  emoji?: string;
}

export default function Confetti({ active = false, fireKey = 0, emoji }: Props) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const piecesRef = useRef<Piece[]>([]);
  const rafRef = useRef<number>(0);
  const runningRef = useRef(false);

  const fire = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const dpr = Math.min(window.devicePixelRatio || 1, 2);
    const w = window.innerWidth;
    const h = window.innerHeight;
    canvas.width = w * dpr;
    canvas.height = h * dpr;
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);

    const count = emoji ? 26 : 90;
    piecesRef.current = Array.from({ length: count }, () => ({
      x: emoji ? Math.random() * w : w / 2 + (Math.random() - 0.5) * w * 0.3,
      y: emoji ? -40 - Math.random() * h * 0.4 : h * 0.35,
      vx: emoji ? (Math.random() - 0.5) * 2 : (Math.random() - 0.5) * 14,
      vy: emoji ? 3 + Math.random() * 4 : -6 - Math.random() * 10,
      size: emoji ? 22 + Math.random() * 16 : 5 + Math.random() * 7,
      color: COLORS[Math.floor(Math.random() * COLORS.length)],
      rot: Math.random() * Math.PI * 2,
      vrot: (Math.random() - 0.5) * (emoji ? 0.12 : 0.3),
      life: 1,
    }));

    if (runningRef.current) return; // loop already going, new pieces picked up
    runningRef.current = true;

    let last = performance.now();
    const step = (now: number) => {
      const dt = Math.min((now - last) / 16.7, 3);
      last = now;
      ctx.clearRect(0, 0, w, h);

      let alive = false;
      for (const p of piecesRef.current) {
        if (p.life <= 0) continue;
        alive = true;
        p.vy += (emoji ? 0.08 : 0.35) * dt;
        p.vx *= 0.99;
        p.x += p.vx * dt;
        p.y += p.vy * dt;
        p.rot += p.vrot * dt;
        p.life -= (emoji ? 0.004 : 0.006) * dt;

        ctx.save();
        ctx.globalAlpha = Math.max(0, Math.min(1, p.life * 1.4));
        ctx.translate(p.x, p.y);
        ctx.rotate(p.rot);
        if (emoji) {
          ctx.font = `${p.size}px serif`;
          ctx.textAlign = "center";
          ctx.textBaseline = "middle";
          ctx.fillText(emoji, 0, 0);
        } else {
          ctx.fillStyle = p.color;
          ctx.fillRect(-p.size / 2, -p.size / 2, p.size, p.size * 0.6);
        }
        ctx.restore();
      }

      if (alive) {
        rafRef.current = requestAnimationFrame(step);
      } else {
        ctx.clearRect(0, 0, w, h);
        runningRef.current = false;
      }
    };
    rafRef.current = requestAnimationFrame(step);
  };

  useEffect(() => {
    if (active) fire();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [active]);

  useEffect(() => {
    if (fireKey > 0) fire();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [fireKey]);

  useEffect(() => () => cancelAnimationFrame(rafRef.current), []);

  return <Canvas ref={canvasRef} />;
}
