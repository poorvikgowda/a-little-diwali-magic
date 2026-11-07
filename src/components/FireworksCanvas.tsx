import React, { useRef, useEffect, forwardRef, useImperativeHandle, useCallback } from 'react';
import { audioService } from '../services/audioService';

export type FireworkType = 'golden' | 'pink' | 'purple' | 'blue' | 'orange' | 'fountain' | 'flower';

export interface FireworksCanvasHandle {
  launch: (x?: number, y?: number, type?: FireworkType) => void;
  launchMultiple: (count: number) => void;
  triggerFountain: (x?: number) => void;
  setFinaleMode: (active: boolean) => void;
}

interface Particle {
  x: number;
  y: number;
  vx: number;
  vy: number;
  alpha: number;
  color: string;
  size: number;
  decay: number;
  gravity: number;
  resistance: number;
  flicker: boolean;
  trail: { x: number; y: number }[];
}

interface Rocket {
  x: number;
  y: number;
  targetY: number;
  vx: number;
  vy: number;
  color: string;
  type: FireworkType;
  trail: { x: number; y: number; alpha: number }[];
}

const COLOR_PALETTES: Record<FireworkType, string[]> = {
  golden: ['#ffe066', '#ffd700', '#ffb700', '#fff3a8', '#f59e0b', '#ffffff'],
  pink: ['#f472b6', '#ec4899', '#db2777', '#fbcfe8', '#fda4af', '#ffffff'],
  purple: ['#c084fc', '#a855f7', '#9333ea', '#e9d5ff', '#d8b4fe', '#ffd700'],
  blue: ['#60a5fa', '#3b82f6', '#2563eb', '#93c5fd', '#bfdbfe', '#ffffff'],
  orange: ['#fb923c', '#f97316', '#ea580c', '#fdba74', '#fed7aa', '#ffd700'],
  fountain: ['#ffd700', '#ff9900', '#ffffff', '#ff5500', '#ffea88'],
  flower: ['#f43f5e', '#ec4899', '#fbbf24', '#f59e0b', '#ffffff'],
};

export const FireworksCanvas = forwardRef<FireworksCanvasHandle, { interactive?: boolean }>(
  ({ interactive = true }, ref) => {
    const canvasRef = useRef<HTMLCanvasElement | null>(null);
    const rocketsRef = useRef<Rocket[]>([]);
    const particlesRef = useRef<Particle[]>([]);
    const isFinaleRef = useRef<boolean>(false);
    const finaleIntervalRef = useRef<number | null>(null);

    // Audio helper
    const playExplosionSound = useCallback((type: FireworkType) => {
      const pitch = type === 'golden' ? 0.9 : type === 'blue' ? 1.1 : 1.0;
      audioService.playFireworkExplosion({ pitch, grand: isFinaleRef.current });
    }, []);

    // Explode rocket into particles
    const explode = useCallback(
      (x: number, y: number, type: FireworkType) => {
        const palette = COLOR_PALETTES[type] || COLOR_PALETTES.golden;
        const particleCount = type === 'flower' ? 70 : 85;

        playExplosionSound(type);

        if (type === 'flower') {
          // Flower burst: outer ring petals + bright center
          const ringPetals = 8;
          const particlesPerPetal = 7;
          for (let p = 0; p < ringPetals; p++) {
            const baseAngle = (p * (Math.PI * 2)) / ringPetals;
            const color = palette[p % palette.length];
            for (let i = 0; i < particlesPerPetal; i++) {
              const speed = 2.5 + Math.random() * 2.8;
              const angle = baseAngle + (Math.random() - 0.5) * 0.45;
              particlesRef.current.push({
                x,
                y,
                vx: Math.cos(angle) * speed,
                vy: Math.sin(angle) * speed,
                alpha: 1,
                color,
                size: Math.random() * 2.5 + 2,
                decay: 0.012 + Math.random() * 0.01,
                gravity: 0.05,
                resistance: 0.975,
                flicker: Math.random() > 0.4,
                trail: [],
              });
            }
          }
          // Center pistil sparks
          for (let i = 0; i < 20; i++) {
            const angle = Math.random() * Math.PI * 2;
            const speed = Math.random() * 1.5;
            particlesRef.current.push({
              x,
              y,
              vx: Math.cos(angle) * speed,
              vy: Math.sin(angle) * speed,
              alpha: 1,
              color: '#ffffff',
              size: 2,
              decay: 0.02,
              gravity: 0.04,
              resistance: 0.96,
              flicker: true,
              trail: [],
            });
          }
          return;
        }

        // Standard radial spherical burst with lingering trails
        for (let i = 0; i < particleCount; i++) {
          const angle = Math.random() * Math.PI * 2;
          const speed = Math.pow(Math.random(), 0.5) * (type === 'golden' ? 6.5 : 5.5);
          const color = palette[Math.floor(Math.random() * palette.length)];

          particlesRef.current.push({
            x,
            y,
            vx: Math.cos(angle) * speed,
            vy: Math.sin(angle) * speed,
            alpha: 1,
            color,
            size: Math.random() * 2.5 + 1.8,
            decay: type === 'golden' ? 0.011 + Math.random() * 0.008 : 0.014 + Math.random() * 0.012,
            gravity: type === 'golden' ? 0.065 : 0.055,
            resistance: 0.978,
            flicker: Math.random() > 0.45,
            trail: [],
          });
        }
      },
      [playExplosionSound]
    );

    // Launch rocket from bottom towards (targetX, targetY)
    const launchRocket = useCallback(
      (targetX?: number, targetY?: number, typeChoice?: FireworkType) => {
        if (!canvasRef.current) return;
        const width = canvasRef.current.width;
        const height = canvasRef.current.height;

        const x = targetX !== undefined ? targetX : Math.random() * (width * 0.8) + width * 0.1;
        const ty = targetY !== undefined ? targetY : Math.random() * (height * 0.45) + height * 0.12;

        const types: FireworkType[] = ['golden', 'pink', 'purple', 'blue', 'orange', 'flower'];
        const type = typeChoice || types[Math.floor(Math.random() * types.length)];
        const startX = x + (Math.random() - 0.5) * 80;
        const startY = height + 10;

        const distanceY = startY - ty;
        const vy = -Math.sqrt(2 * 0.12 * distanceY);
        const timeToPeak = -vy / 0.12;
        const vx = (x - startX) / timeToPeak;

        const palette = COLOR_PALETTES[type];
        const color = palette[0];

        rocketsRef.current.push({
          x: startX,
          y: startY,
          targetY: ty,
          vx,
          vy,
          color,
          type,
          trail: [],
        });
      },
      []
    );

    // Ground fountain (anar) effect
    const triggerFountain = useCallback(
      (posX?: number) => {
        if (!canvasRef.current) return;
        const width = canvasRef.current.width;
        const height = canvasRef.current.height;
        const x = posX !== undefined ? posX : width * 0.5;
        const y = height - 20;

        audioService.playSoftCracker();

        // Spawn a burst of sparkling upward sparks
        for (let i = 0; i < 45; i++) {
          const angle = -Math.PI / 2 + (Math.random() - 0.5) * 0.75;
          const speed = 4 + Math.random() * 6;
          particlesRef.current.push({
            x: x + (Math.random() - 0.5) * 15,
            y,
            vx: Math.cos(angle) * speed,
            vy: Math.sin(angle) * speed,
            alpha: 1,
            color: COLOR_PALETTES.fountain[Math.floor(Math.random() * COLOR_PALETTES.fountain.length)],
            size: Math.random() * 2.2 + 1.2,
            decay: 0.02 + Math.random() * 0.02,
            gravity: 0.14,
            resistance: 0.985,
            flicker: true,
            trail: [],
          });
        }
      },
      []
    );

    // Imperative handle for parent components
    useImperativeHandle(ref, () => ({
      launch: (x, y, type) => {
        launchRocket(x, y, type);
      },
      launchMultiple: (count: number) => {
        for (let i = 0; i < count; i++) {
          setTimeout(() => {
            launchRocket();
          }, i * 220);
        }
      },
      triggerFountain: (x) => {
        triggerFountain(x);
      },
      setFinaleMode: (active: boolean) => {
        isFinaleRef.current = active;
        if (active) {
          if (finaleIntervalRef.current) clearInterval(finaleIntervalRef.current);
          finaleIntervalRef.current = window.setInterval(() => {
            launchRocket();
          }, 350);
        } else {
          if (finaleIntervalRef.current) {
            clearInterval(finaleIntervalRef.current);
            finaleIntervalRef.current = null;
          }
        }
      },
    }));

    // Main animation loop
    useEffect(() => {
      const canvas = canvasRef.current;
      if (!canvas) return;
      const ctx = canvas.getContext('2d');
      if (!ctx) return;

      const handleResize = () => {
        canvas.width = window.innerWidth;
        canvas.height = window.innerHeight;
      };
      handleResize();
      window.addEventListener('resize', handleResize);

      let animationFrameId: number;

      const render = () => {
        // Subtle trail fade effect
        ctx.globalCompositeOperation = 'destination-out';
        ctx.fillStyle = 'rgba(0, 0, 0, 0.22)';
        ctx.fillRect(0, 0, canvas.width, canvas.height);
        ctx.globalCompositeOperation = 'lighter';

        // Update & Render Rockets
        for (let i = rocketsRef.current.length - 1; i >= 0; i--) {
          const r = rocketsRef.current[i];
          r.trail.push({ x: r.x, y: r.y, alpha: 1 });
          if (r.trail.length > 8) r.trail.shift();

          // Render rocket trail
          for (let t = 0; t < r.trail.length; t++) {
            const pt = r.trail[t];
            ctx.beginPath();
            ctx.arc(pt.x, pt.y, 1.6, 0, Math.PI * 2);
            ctx.fillStyle = `rgba(255, 215, 0, ${((t + 1) / r.trail.length) * 0.7})`;
            ctx.fill();
          }

          // Move rocket
          r.x += r.vx;
          r.y += r.vy;
          r.vy += 0.12; // rocket gravity deceleration

          // Check if apex or target reached
          if (r.vy >= -0.5 || r.y <= r.targetY) {
            explode(r.x, r.y, r.type);
            rocketsRef.current.splice(i, 1);
          }
        }

        // Update & Render Particles
        for (let i = particlesRef.current.length - 1; i >= 0; i--) {
          const p = particlesRef.current[i];

          // Save trail
          p.trail.push({ x: p.x, y: p.y });
          if (p.trail.length > 4) p.trail.shift();

          // Physics
          p.vx *= p.resistance;
          p.vy *= p.resistance;
          p.vy += p.gravity;
          p.x += p.vx;
          p.y += p.vy;
          p.alpha -= p.decay;

          if (p.alpha <= 0) {
            particlesRef.current.splice(i, 1);
            continue;
          }

          // Draw trailing spark line
          if (p.trail.length > 1) {
            ctx.beginPath();
            ctx.moveTo(p.trail[0].x, p.trail[0].y);
            ctx.lineTo(p.x, p.y);
            ctx.strokeStyle = p.color;
            ctx.lineWidth = p.size * 0.7;
            ctx.globalAlpha = p.alpha * 0.6;
            ctx.stroke();
          }

          // Draw particle head
          const flickerAlpha = p.flicker && Math.random() > 0.4 ? p.alpha * 0.4 : p.alpha;
          ctx.beginPath();
          ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
          ctx.fillStyle = p.color;
          ctx.globalAlpha = flickerAlpha;
          ctx.shadowBlur = 10;
          ctx.shadowColor = p.color;
          ctx.fill();
          ctx.shadowBlur = 0;
        }

        ctx.globalAlpha = 1;
        animationFrameId = requestAnimationFrame(render);
      };

      animationFrameId = requestAnimationFrame(render);

      // Random gentle ambient fireworks every 7-12 seconds
      const ambientInterval = window.setInterval(() => {
        if (document.visibilityState === 'visible' && !isFinaleRef.current && Math.random() > 0.3) {
          launchRocket();
        }
      }, 7000);

      return () => {
        window.removeEventListener('resize', handleResize);
        cancelAnimationFrame(animationFrameId);
        clearInterval(ambientInterval);
        if (finaleIntervalRef.current) clearInterval(finaleIntervalRef.current);
      };
    }, [explode, launchRocket]);

    // Handle user click/tap on canvas
    const handleCanvasClick = (e: React.MouseEvent<HTMLCanvasElement>) => {
      if (!interactive) return;
      const rect = e.currentTarget.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;
      launchRocket(x, y);
    };

    return (
      <canvas
        ref={canvasRef}
        onClick={handleCanvasClick}
        className={`fixed inset-0 z-10 w-full h-full ${interactive ? 'cursor-pointer' : 'pointer-events-none'}`}
      />
    );
  }
);

