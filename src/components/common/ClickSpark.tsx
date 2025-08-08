import React, { useEffect, useRef } from 'react';

type Spark = {
  x: number;
  y: number;
  vx: number;
  vy: number;
  life: number;
  maxLife: number;
  size: number;
  hue: number;
};

type Props = {
  count?: number; // particles per click
  spread?: number; // degrees spread
  speed?: number; // initial speed
  decay?: number; // life decay per frame
  size?: number; // base size
  colorHue?: number | 'rainbow' | 'white'; // base hue, rainbow, or white
  zIndex?: number;
};

const ClickSpark: React.FC<Props> = ({
  count = 14,
  spread = 75,
  speed = 3.2,
  decay = 0.02,
  size = 3,
  colorHue = 'white',
  zIndex = 50,
}) => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const ctxRef = useRef<CanvasRenderingContext2D | null>(null);
  const sparksRef = useRef<Spark[]>([]);
  const rafRef = useRef<number | null>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;
    ctxRef.current = ctx;

    const DPR = window.devicePixelRatio || 1;
    const resize = () => {
      canvas.width = Math.floor(window.innerWidth * DPR);
      canvas.height = Math.floor(window.innerHeight * DPR);
      canvas.style.width = `${window.innerWidth}px`;
      canvas.style.height = `${window.innerHeight}px`;
      ctx.setTransform(1, 0, 0, 1, 0, 0);
      ctx.scale(DPR, DPR);
    };
    resize();
    window.addEventListener('resize', resize);

  const addSparks = (x: number, y: number) => {
      for (let i = 0; i < count; i++) {
        const angle = ((Math.random() - 0.5) * spread * Math.PI) / 180 + (Math.random() * Math.PI * 2);
        const spd = speed * (0.6 + Math.random() * 0.8);
    const hue = colorHue === 'rainbow' ? Math.floor(Math.random() * 360) : (typeof colorHue === 'number' ? colorHue : 0);
        sparksRef.current.push({
          x,
          y,
          vx: Math.cos(angle) * spd,
          vy: Math.sin(angle) * spd,
          life: 1,
          maxLife: 1,
          size: size * (0.7 + Math.random() * 0.9),
          hue,
        });
      }
    };

    const clickHandler = (e: MouseEvent) => {
      if (window.matchMedia && window.matchMedia('(hover: none), (pointer: coarse)').matches) return;
      addSparks(e.clientX, e.clientY);
    };
    window.addEventListener('click', clickHandler);

    const update = () => {
      const ctx = ctxRef.current!;
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      const list = sparksRef.current;
      for (let i = list.length - 1; i >= 0; i--) {
        const s = list[i];
        s.x += s.vx;
        s.y += s.vy;
        s.vy += 0.05; // gravity
        s.life -= decay;
        if (s.life <= 0) {
          list.splice(i, 1);
          continue;
        }
        ctx.globalAlpha = Math.max(s.life, 0);
        if (colorHue === 'white') {
          ctx.fillStyle = '#ffffff';
        } else {
          ctx.fillStyle = `hsl(${s.hue}, 90%, 60%)`;
        }
        ctx.beginPath();
        ctx.arc(s.x, s.y, s.size, 0, Math.PI * 2);
        ctx.fill();
      }
      rafRef.current = requestAnimationFrame(update);
    };
    rafRef.current = requestAnimationFrame(update);

    return () => {
      window.removeEventListener('resize', resize);
      window.removeEventListener('click', clickHandler);
      if (rafRef.current) cancelAnimationFrame(rafRef.current);
    };
  }, [count, spread, speed, decay, size, colorHue]);

  return (
    <canvas
      ref={canvasRef}
      aria-hidden
      style={{ position: 'fixed', inset: 0, pointerEvents: 'none', zIndex }}
    />
  );
};

export default ClickSpark;
