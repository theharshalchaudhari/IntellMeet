"use client";
import React, { useEffect, useRef } from "react";

const GAP = 20;
const RADIUS = 150;
const STRENGTH = 10;
const SMOOTH = 0.10;
const COLOR_SMOOTH = 0.04;

export const InteractiveGrid = () => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const mouse = useRef({ x: -9999, y: -9999 });

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    // ctx is CanvasRenderingContext2D here — capture it as a const
    // so TypeScript knows it's non-null inside the class below
    const c: CanvasRenderingContext2D = ctx;

    class Dot {
      ox: number; oy: number;
      x: number;  y: number;
      f: number = 0;

      constructor(ox: number, oy: number) {
        this.ox = ox; this.oy = oy;
        this.x = ox;  this.y = oy;
      }

      update() {
        const dx = mouse.current.x - this.ox;
        const dy = mouse.current.y - this.oy;
        const dist = Math.sqrt(dx * dx + dy * dy);
        let tx = this.ox, ty = this.oy, tf = 0;

        if (dist < RADIUS) {
          const angle = Math.atan2(dy, dx);
          const force = Math.sin((1 - dist / RADIUS) * Math.PI * 0.5);
          tx = this.ox - Math.cos(angle) * force * STRENGTH;
          ty = this.oy - Math.sin(angle) * force * STRENGTH;
          tf = force;
        }

        this.x += (tx - this.x) * SMOOTH;
        this.y += (ty - this.y) * SMOOTH;
        this.f += (tf - this.f) * COLOR_SMOOTH;
      }

      draw() {
        const f = this.f;
        c.beginPath();
        c.arc(this.x, this.y, 1.2 + f * 1.2, 0, Math.PI * 2);

        if (f > 0.02) {
          c.fillStyle = "var(--primary)";
          c.globalAlpha = 0.45;
        } else {
          c.fillStyle = "var(--primary)";
          c.globalAlpha = 0.55;
        }

        c.fill();
        c.globalAlpha = 1;
      }
    }

    let dots: Dot[] = [];
    let raf: number;
    let W = 0, H = 0;

    const init = () => {
      const dpr = Math.min(window.devicePixelRatio || 1, 2);
      W = window.innerWidth; H = window.innerHeight;
      canvas.width = W * dpr; canvas.height = H * dpr;
      canvas.style.width = `${W}px`; canvas.style.height = `${H}px`;
      c.scale(dpr, dpr);
      dots = [];
      for (let x = 0; x <= W + GAP; x += GAP)
        for (let y = 0; y <= H + GAP; y += GAP)
          dots.push(new Dot(x, y));
    };

    const loop = () => {
      c.clearRect(0, 0, W, H);
      for (const dot of dots) { dot.update(); dot.draw(); }
      raf = requestAnimationFrame(loop);
    };

    const onMove = (e: MouseEvent) => { mouse.current = { x: e.clientX, y: e.clientY }; };
    const onLeave = () => { mouse.current = { x: -9999, y: -9999 }; };

    init();
    loop();
    window.addEventListener("mousemove", onMove);
    window.addEventListener("mouseleave", onLeave);
    window.addEventListener("resize", init);

    return () => {
      window.removeEventListener("mousemove", onMove);
      window.removeEventListener("mouseleave", onLeave);
      window.removeEventListener("resize", init);
      cancelAnimationFrame(raf);
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      className="fixed inset-0 -z-10 bg-background pointer-events-none"
    />
  );
};