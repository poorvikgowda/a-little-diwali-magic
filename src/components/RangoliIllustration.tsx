import React from 'react';

interface RangoliProps {
  size?: number;
  className?: string;
  onClick?: () => void;
}

export const RangoliIllustration: React.FC<RangoliProps> = ({
  size = 360,
  className = '',
  onClick,
}) => {
  return (
    <div
      onClick={onClick}
      className={`relative inline-flex items-center justify-center cursor-pointer transition-transform duration-700 hover:scale-105 select-none ${className}`}
      style={{ width: size, height: size }}
    >
      {/* Outer ambient glow */}
      <div className="absolute inset-4 rounded-full bg-amber-500/15 blur-2xl pointer-events-none animate-pulse" />

      {/* SVG Rangoli */}
      <svg
        viewBox="0 0 400 400"
        className="w-full h-full drop-shadow-[0_0_25px_rgba(255,180,0,0.4)]"
      >
        <defs>
          <linearGradient id="rangoliGold" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#ffd700" />
            <stop offset="50%" stopColor="#ff9900" />
            <stop offset="100%" stopColor="#ff4500" />
          </linearGradient>
          <linearGradient id="rangoliPink" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#f472b6" />
            <stop offset="100%" stopColor="#db2777" />
          </linearGradient>
          <linearGradient id="rangoliTeal" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#2dd4bf" />
            <stop offset="100%" stopColor="#0f766e" />
          </linearGradient>
          <radialGradient id="centerGlow" cx="50%" cy="50%" r="50%">
            <stop offset="0%" stopColor="#ffe600" stopOpacity="0.9" />
            <stop offset="60%" stopColor="#ff6600" stopOpacity="0.7" />
            <stop offset="100%" stopColor="#ff1493" stopOpacity="0.2" />
          </radialGradient>
        </defs>

        {/* Outer Petal Ring (16 Petals) */}
        <g transform="translate(200, 200)">
          {Array.from({ length: 16 }).map((_, i) => (
            <g key={`petal-${i}`} transform={`rotate(${i * 22.5})`}>
              <path
                d="M0,-185 C25,-150 25,-120 0,-105 C-25,-120 -25,-150 0,-185 Z"
                fill="url(#rangoliPink)"
                stroke="#ffd700"
                strokeWidth="1.2"
                opacity="0.85"
              />
              <circle cx="0" cy="-185" r="3.5" fill="#ffd700" />
            </g>
          ))}

          {/* Middle Decorative Ring (8 Teardrop Petals) */}
          {Array.from({ length: 8 }).map((_, i) => (
            <g key={`mid-${i}`} transform={`rotate(${i * 45 + 22.5})`}>
              <path
                d="M0,-125 C30,-95 20,-60 0,-50 C-20,-60 -30,-95 0,-125 Z"
                fill="url(#rangoliGold)"
                stroke="#fff"
                strokeWidth="1.5"
                opacity="0.95"
              />
              <circle cx="0" cy="-105" r="4" fill="#ffffff" />
            </g>
          ))}

          {/* Inner Teal Lotus Petals */}
          {Array.from({ length: 8 }).map((_, i) => (
            <g key={`inner-${i}`} transform={`rotate(${i * 45})`}>
              <path
                d="M0,-75 C18,-50 15,-30 0,-25 C-15,-30 -18,-50 0,-75 Z"
                fill="url(#rangoliTeal)"
                stroke="#ffd700"
                strokeWidth="1"
              />
              <circle cx="0" cy="-65" r="2.5" fill="#ffe066" />
            </g>
          ))}

          {/* Concentric Golden Rings */}
          <circle cx="0" cy="0" r="135" fill="none" stroke="#ffd700" strokeWidth="1.5" strokeDasharray="4 6" opacity="0.7" />
          <circle cx="0" cy="0" r="95" fill="none" stroke="#f472b6" strokeWidth="1.5" opacity="0.6" />
          <circle cx="0" cy="0" r="50" fill="none" stroke="#ffd700" strokeWidth="2" />

          {/* Center Glowing Disc */}
          <circle cx="0" cy="0" r="25" fill="url(#centerGlow)" stroke="#ffd700" strokeWidth="2" />
          <circle cx="0" cy="0" r="8" fill="#ffffff" className="animate-pulse" />
        </g>
      </svg>
    </div>
  );
};

