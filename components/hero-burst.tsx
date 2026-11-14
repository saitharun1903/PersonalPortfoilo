'use client';
import { useEffect, useRef } from 'react';

// Clicking in the introduction sends out a ring of pixel squares.
// One canvas, drawn only while pixels are alive; nothing runs when idle.
const GRID = 8;
const SIZE = 6;
const COLOURS = ['#c2300f', '#c2300f', '#2846c9', '#f29a6b', '#14213d'];
const MAX = 900;

type Pixel = { x: number; y: number; vx: number; vy: number; life: number; max: number; colour: string };

export default function HeroBurst() {
  const canvas = useRef<HTMLCanvasElement>(null);
  useEffect(() => {
    const element = canvas.current;
    const area = element?.parentElement;
    const context = element?.getContext('2d');
    if (!element || !area || !context) return;
    const reduce = matchMedia('(prefers-reduced-motion: reduce)');
    const pixels: Pixel[] = [];
    let frame = 0;
    let last = 0;
    let ratio = 1;

    const resize = () => {
      ratio = Math.min(devicePixelRatio || 1, 2);
      const box = element.getBoundingClientRect();
      element.width = Math.round(box.width * ratio);
      element.height = Math.round(box.height * ratio);
      context.setTransform(ratio, 0, 0, ratio, 0, 0);
      context.imageSmoothingEnabled = false;
    };

    const draw = (time: number) => {
      const dt = Math.min((time - (last || time)) / 1000, 1 / 20);
      last = time;
      context.clearRect(0, 0, element.width / ratio, element.height / ratio);
      for (let index = pixels.length - 1; index >= 0; index--) {
        const pixel = pixels[index];
        pixel.life -= dt;
        if (pixel.life <= 0) { pixels[index] = pixels[pixels.length - 1]; pixels.pop(); continue; }
        const drag = Math.pow(0.06, dt);
        pixel.vx *= drag;
        pixel.vy *= drag;
        pixel.x += pixel.vx * dt;
        pixel.y += pixel.vy * dt;
        // Snap to a grid and step the fade so it reads as pixel art.
        context.globalAlpha = Math.ceil((pixel.life / pixel.max) * 4) / 4;
        context.fillStyle = pixel.colour;
        context.fillRect(Math.round(pixel.x / GRID) * GRID, Math.round(pixel.y / GRID) * GRID, SIZE, SIZE);
      }
      context.globalAlpha = 1;
      frame = pixels.length ? requestAnimationFrame(draw) : 0;
      if (!frame) last = 0;
    };

    const burst = (event: PointerEvent) => {
      if (reduce.matches || event.button > 0) return;
      const box = element.getBoundingClientRect();
      const x = event.clientX - box.left;
      const y = event.clientY - box.top;
      const ring = 64;
      for (let index = 0; index < ring; index++) {
        const angle = (index / ring) * Math.PI * 2 + Math.random() * 0.12;
        const speed = 300 + Math.random() * 240;
        const max = 0.55 + Math.random() * 0.45;
        pixels.push({ x, y, vx: Math.cos(angle) * speed, vy: Math.sin(angle) * speed, life: max, max, colour: COLOURS[(Math.random() * COLOURS.length) | 0] });
      }
      for (let index = 0; index < 26; index++) {
        const angle = Math.random() * Math.PI * 2;
        const speed = 60 + Math.random() * 160;
        const max = 0.35 + Math.random() * 0.4;
        pixels.push({ x, y, vx: Math.cos(angle) * speed, vy: Math.sin(angle) * speed, life: max, max, colour: COLOURS[(Math.random() * COLOURS.length) | 0] });
      }
      if (pixels.length > MAX) pixels.splice(0, pixels.length - MAX);
      if (!frame) frame = requestAnimationFrame(draw);
    };

    resize();
    const observer = new ResizeObserver(resize);
    observer.observe(element);
    area.addEventListener('pointerdown', burst, { passive: true });
    return () => { cancelAnimationFrame(frame); observer.disconnect(); area.removeEventListener('pointerdown', burst); };
  }, []);
  return <canvas ref={canvas} className="hero-burst" aria-hidden="true"/>;
}
