import React, { useEffect, useRef } from "react";
import styled from "styled-components";

// Lightweight canvas confetti — fired when a guess is correct.

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

export default function Confetti({ active }: { active: boolean }) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const piecesRef = useRef<Piece[]>([]);
  const rafRef = useRef<number>(0);

  useEffect(() => {
    if (!active) return;
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const dpr = Math.min(window.devicePixelRatio || 1, 2);
    canvas.width = window.innerWidth * dpr;
    canvas.height = window.innerHeight * dpr;
    ctx.scale(dpr, dpr);

    const w = window.innerWidth;
    const h = window.innerHeight;

    piecesRef.current = Array.from({ length: 90 }, () => ({
      x: w / 2 + (Math.random() - 0.5) * w * 0.3,
      y: h * 0.35,
      vx: (Math.random() - 0.5) * 14,
      vy: -6 - Math.random() * 10,
      size: 5 + Math.random() * 7,
      color: COLORS[Math.floor(Math.random() * COLORS.length)],
      rot: Math.random() * Math.PI * 2,
      vrot: (Math.random() - 0.5) * 0.3,
      life: 1,
    }));

    let last = performance.now();
    const step = (now: number) => {
      const dt = Math.min((now - last) / 16.7, 3);
      last = now;
      ctx.clearRect(0, 0, w, h);

      let alive = false;
      for (const p of piecesRef.current) {
        if (p.life <= 0) continue;
        alive = true;
        p.vy += 0.35 * dt;
        p.vx *= 0.99;
        p.x += p.vx * dt;
        p.y += p.vy * dt;
        p.rot += p.vrot * dt;
        p.life -= 0.006 * dt;

        ctx.save();
        ctx.globalAlpha = Math.max(0, p.life);
        ctx.translate(p.x, p.y);
        ctx.rotate(p.rot);
        ctx.fillStyle = p.color;
        ctx.fillRect(-p.size / 2, -p.size / 2, p.size, p.size * 0.6);
        ctx.restore();
      }

      if (alive) {
        rafRef.current = requestAnimationFrame(step);
      } else {
        ctx.clearRect(0, 0, w, h);
      }
    };
    rafRef.current = requestAnimationFrame(step);

    return () => cancelAnimationFrame(rafRef.current);
  }, [active]);

  return active ? <Canvas ref={canvasRef} /> : null;
}
