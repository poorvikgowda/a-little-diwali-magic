import React, { useMemo } from 'react';

interface FloatingParticlesProps {
  intensity?: 'normal' | 'cinematic' | 'quiet';
}

export const FloatingParticles: React.FC<FloatingParticlesProps> = ({ intensity = 'normal' }) => {
  // Generate random stars
  const stars = useMemo(() => {
    const count = intensity === 'quiet' ? 40 : 85;
    return Array.from({ length: count }, (_, i) => ({
      id: i,
      x: Math.random() * 100,
      y: Math.random() * 100,
      size: Math.random() * 2.2 + 0.8,
      duration: Math.random() * 3 + 2,
      delay: Math.random() * 3,
      opacity: Math.random() * 0.7 + 0.3,
    }));
  }, [intensity]);

  // Generate floating marigold petals
  const petals = useMemo(() => {
    const count = intensity === 'quiet' ? 8 : 18;
    return Array.from({ length: count }, (_, i) => ({
      id: i,
      x: Math.random() * 100,
      duration: Math.random() * 12 + 10,
      delay: Math.random() * 8,
      size: Math.random() * 14 + 10,
      rotateStart: Math.random() * 360,
      sway: Math.random() * 30 + 20,
    }));
  }, [intensity]);

  // Generate golden floating lanterns in distance
  const lanterns = useMemo(() => [
    { id: 1, x: 8, y: 18, scale: 0.75, delay: 0 },
    { id: 2, x: 88, y: 14, scale: 0.85, delay: 1.5 },
    { id: 3, x: 22, y: 8, scale: 0.55, delay: 3 },
    { id: 4, x: 78, y: 28, scale: 0.65, delay: 2 },
    { id: 5, x: 50, y: 6, scale: 0.5, delay: 4 },
  ], []);

  return (
    <div className="fixed inset-0 pointer-events-none overflow-hidden z-0">
      {/* Deep sky gradients */}
      <div className="absolute inset-0 bg-gradient-to-b from-[#040614] via-[#0b0c26] to-[#1a082e] opacity-95" />
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_15%,rgba(139,47,196,0.18),transparent_70%)]" />
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_80%_80%,rgba(255,153,0,0.08),transparent_50%)]" />

      {/* Floating lanterns in the far sky */}
      {lanterns.map((l) => (
        <div
          key={l.id}
          className="absolute lantern-float transition-opacity duration-1000 opacity-60 hover:opacity-100"
          style={{
            left: `${l.x}%`,
            top: `${l.y}%`,
            transform: `scale(${l.scale})`,
            animationDelay: `${l.delay}s`,
          }}
        >
          {/* Traditional Akash Kandil (Indian Diwali lantern) */}
          <div className="relative flex flex-col items-center">
            {/* Hanging String */}
            <div className="w-[1px] h-12 bg-amber-400/40" />
            {/* Lantern Core */}
            <div className="w-10 h-14 bg-gradient-to-b from-amber-400/90 via-orange-500/80 to-purple-700/90 rounded-xl shadow-[0_0_30px_rgba(255,180,0,0.8)] border border-amber-300/40 relative overflow-hidden flex items-center justify-center">
              <div className="w-4 h-6 bg-amber-200/90 rounded-full blur-[3px] animate-pulse" />
              {/* Geometric pattern line */}
              <div className="absolute inset-x-0 top-1/2 h-[1px] bg-amber-200/50" />
            </div>
            {/* Lantern Tassels */}
            <div className="flex justify-center gap-1 mt-1">
              <div className="w-[2px] h-6 bg-amber-400/70" />
              <div className="w-[2px] h-8 bg-orange-400/80" />
              <div className="w-[2px] h-6 bg-amber-400/70" />
            </div>
          </div>
        </div>
      ))}

      {/* Twinkling Stars */}
      {stars.map((s) => (
        <div
          key={s.id}
          className="absolute rounded-full bg-white transition-opacity"
          style={{
            left: `${s.x}%`,
            top: `${s.y}%`,
            width: `${s.size}px`,
            height: `${s.size}px`,
            opacity: s.opacity,
            boxShadow: `0 0 ${s.size * 2}px rgba(255, 255, 255, 0.9)`,
            animation: `flicker ${s.duration}s ease-in-out infinite`,
            animationDelay: `${s.delay}s`,
          }}
        />
      ))}

      {/* Floating Marigold Petals */}
      {petals.map((p) => (
        <div
          key={p.id}
          className="absolute top-[-30px]"
          style={{
            left: `${p.x}%`,
            animation: `driftDown ${p.duration}s linear infinite`,
            animationDelay: `${p.delay}s`,
          }}
        >
          {/* Petal SVG */}
          <svg
            width={p.size}
            height={p.size * 1.4}
            viewBox="0 0 20 28"
            className="opacity-75"
            style={{
              transform: `rotate(${p.rotateStart}deg)`,
              filter: 'drop-shadow(0 2px 4px rgba(0,0,0,0.3))',
            }}
          >
            <path
              d="M10,0 C16,8 20,18 10,28 C0,18 4,8 10,0 Z"
              fill="url(#marigoldGradient)"
            />
            <defs>
              <linearGradient id="marigoldGradient" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" stopColor="#ffd000" />
                <stop offset="50%" stopColor="#ff7700" />
                <stop offset="100%" stopColor="#ff3700" />
              </linearGradient>
            </defs>
          </svg>
        </div>
      ))}

      <style>{`
        @keyframes driftDown {
          0% {
            transform: translateY(-50px) translateX(0) rotate(0deg);
            opacity: 0;
          }
          15% {
            opacity: 0.85;
          }
          50% {
            transform: translateY(50vh) translateX(25px) rotate(180deg);
          }
          85% {
            opacity: 0.85;
          }
          100% {
            transform: translateY(105vh) translateX(-20px) rotate(360deg);
            opacity: 0;
          }
        }
      `}</style>
    </div>
  );
};

