import React from 'react';

interface ProximityTextProps {
  text: string;
  className?: string;
  style?: React.CSSProperties;
  maxDistance?: number; // px radius of effect
  maxScale?: number; // additional scale at center (e.g., 0.5 => 1.5x)
  maxLift?: number; // px translateY upward at center
  throttleMs?: number; // optional throttle; raf used primarily
}

const ProximityText: React.FC<ProximityTextProps> = ({
  text,
  className,
  style,
  maxDistance = 160,
  maxScale = 0.35,
  maxLift = 10,
}) => {
  const containerRef = React.useRef<HTMLDivElement | null>(null);
  const [centers, setCenters] = React.useState<Array<{ x: number; y: number }>>([]);
  const spansRef = React.useRef<HTMLSpanElement[]>([]);
  const rafRef = React.useRef<number | null>(null);
  const mousePosRef = React.useRef<{ x: number; y: number } | null>(null);

  // Measure character centers
  const measure = React.useCallback(() => {
    if (!containerRef.current) return;
    const arr: Array<{ x: number; y: number }> = [];
    spansRef.current.forEach((el) => {
      if (!el) return;
      const rect = el.getBoundingClientRect();
      arr.push({ x: rect.left + rect.width / 2, y: rect.top + rect.height / 2 });
    });
    setCenters(arr);
  }, []);

  React.useEffect(() => {
    measure();
    const handle = () => measure();
    window.addEventListener('resize', handle);
    window.addEventListener('scroll', handle, true);
    return () => {
      window.removeEventListener('resize', handle);
      window.removeEventListener('scroll', handle, true);
    };
  }, [measure]);

  // Animation loop using RAF for smoother updates
  const animate = React.useCallback(() => {
    if (!mousePosRef.current) return;
    const { x: mx, y: my } = mousePosRef.current;

    spansRef.current.forEach((el, i) => {
      const c = centers[i];
      if (!el || !c) return;
      const dx = mx - c.x;
      const dy = my - c.y;
      const dist = Math.hypot(dx, dy);
      const t = Math.max(0, 1 - dist / maxDistance); // 0..1
      const scale = 1 + t * maxScale;
      const lift = -t * maxLift; // up is negative translateY
      const weight = 400 + Math.round(t * 300); // 400..700
      const blur = (1 - t) * 0.0; // keep sharp; tweak if needed
      el.style.transform = `translateY(${lift}px) scale(${scale})`;
      el.style.fontWeight = String(weight);
      el.style.filter = `blur(${blur}px)`;
    });
  }, [centers, maxDistance, maxLift, maxScale]);

  const requestTick = React.useCallback(() => {
    if (rafRef.current != null) return;
    rafRef.current = requestAnimationFrame(() => {
      rafRef.current = null;
      animate();
    });
  }, [animate]);

  const onMouseMove = React.useCallback(
    (e: React.MouseEvent<HTMLDivElement>) => {
      mousePosRef.current = { x: e.clientX, y: e.clientY };
      requestTick();
    },
    [requestTick]
  );

  const onMouseLeave = React.useCallback(() => {
    mousePosRef.current = null;
    // Reset styles smoothly
    spansRef.current.forEach((el) => {
      if (!el) return;
      el.style.transform = 'translateY(0px) scale(1)';
      el.style.fontWeight = '600';
      el.style.filter = 'none';
    });
  }, []);

  return (
    <div
      ref={containerRef}
      onMouseMove={onMouseMove}
      onMouseLeave={onMouseLeave}
      className={className}
      style={{
        display: 'inline-block',
        cursor: 'default',
        // transition for reset
        ...style,
      }}
      aria-label={text}
      role="text"
    >
      {text.split('').map((ch, i) => (
        <span
          key={i}
          ref={(el) => {
            spansRef.current[i] = el as HTMLSpanElement;
          }}
          style={{
            display: 'inline-block',
            transition: 'transform 120ms ease, font-weight 120ms ease, filter 120ms ease',
            willChange: 'transform',
          }}
        >
          {ch}
        </span>
      ))}
    </div>
  );
};

export default ProximityText;
