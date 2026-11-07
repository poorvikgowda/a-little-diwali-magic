import React, { useState } from 'react';
import { audioService } from '../services/audioService';

interface DiyaProps {
  size?: 'sm' | 'md' | 'lg' | 'xl';
  isLit?: boolean;
  intensity?: number; // 1 to 3
  onClick?: () => void;
  className?: string;
  showSparks?: boolean;
}

export const DiyaIllustration: React.FC<DiyaProps> = ({
  size = 'md',
  isLit = true,
  intensity = 1,
  onClick,
  className = '',
  showSparks = true,
}) => {
  const [isSparking, setIsSparking] = useState(false);

  const sizeClasses = {
    sm: 'w-12 h-10',
    md: 'w-20 h-16',
    lg: 'w-28 h-22',
    xl: 'w-36 h-28',
  };

  const flameScales = {
    1: 'scale-100',
    2: 'scale-125',
    3: 'scale-150',
  };

  const handleClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    audioService.playDiyaLight();
    setIsSparking(true);
    setTimeout(() => setIsSparking(false), 900);
    if (onClick) onClick();
  };

  return (
    <div
      onClick={handleClick}
      className={`relative inline-flex flex-col items-center justify-end cursor-pointer group select-none transition-transform active:scale-95 ${sizeClasses[size]} ${className}`}
    >
      {/* Golden Aura Glow */}
      {isLit && (
        <div
          className={`absolute -top-4 w-16 h-16 rounded-full bg-amber-400/20 blur-xl pointer-events-none transition-all duration-500 group-hover:bg-amber-400/40 ${
            intensity > 1 ? 'scale-150 bg-amber-400/35' : ''
          }`}
        />
      )}

      {/* Spark Burst on Click */}
      {isSparking && showSparks && (
        <div className="absolute -top-8 pointer-events-none flex items-center justify-center">
          <span className="text-amber-300 text-xs animate-ping font-serif">✨</span>
        </div>
      )}

      {/* Animated Flame */}
      {isLit && (
        <div
          className={`relative -mb-1 z-10 transition-transform duration-500 diya-flame-anim ${
            flameScales[Math.min(3, Math.max(1, intensity)) as 1 | 2 | 3]
          }`}
        >
          {/* Flame SVG */}
          <svg width="24" height="34" viewBox="0 0 24 34" fill="none" className="drop-shadow-lg">
            {/* Outer Flame Glow */}
            <path
              d="M12 0C12 0 3 13 3 22C3 28.5 7 34 12 34C17 34 21 28.5 21 22C21 13 12 0 12 0Z"
              fill="url(#outerFlame)"
              opacity="0.95"
            />
            {/* Middle Flame */}
            <path
              d="M12 7C12 7 6 16 6 23C6 27.5 8.7 31 12 31C15.3 31 18 27.5 18 23C18 16 12 7 12 7Z"
              fill="url(#midFlame)"
            />
            {/* Inner Core Bright White */}
            <path
              d="M12 15C12 15 8.5 20.5 8.5 25C8.5 27.8 10 30 12 30C14 30 15.5 27.8 15.5 25C15.5 20.5 12 15 12 15Z"
              fill="#ffffff"
              opacity="0.9"
            />
            <defs>
              <linearGradient id="outerFlame" x1="12" y1="0" x2="12" y2="34" gradientUnits="userSpaceOnUse">
                <stop stopColor="#ff4500" />
                <stop offset="0.4" stopColor="#ff8c00" />
                <stop offset="0.8" stopColor="#ffd700" />
              </linearGradient>
              <linearGradient id="midFlame" x1="12" y1="7" x2="12" y2="31" gradientUnits="userSpaceOnUse">
                <stop stopColor="#ff9900" />
                <stop offset="0.6" stopColor="#ffe600" />
                <stop offset="1" stopColor="#ffffff" />
              </linearGradient>
            </defs>
          </svg>
        </div>
      )}

      {/* Diya Clay Base (Earthen Lamp with Golden Filigree) */}
      <svg
        viewBox="0 0 100 48"
        className="w-full h-auto drop-shadow-[0_8px_16px_rgba(0,0,0,0.6)]"
      >
        <defs>
          {/* Terracotta Clay & Gold Foil Gradient */}
          <linearGradient id="diyaBody" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#d97706" />
            <stop offset="35%" stopColor="#92400e" />
            <stop offset="70%" stopColor="#78350f" />
            <stop offset="100%" stopColor="#451a03" />
          </linearGradient>
          <linearGradient id="diyaGoldRim" x1="0%" y1="0%" x2="100%" y2="0%">
            <stop offset="0%" stopColor="#ffd700" />
            <stop offset="50%" stopColor="#fff2a1" />
            <stop offset="100%" stopColor="#d97706" />
          </linearGradient>
        </defs>

        {/* Lamp Base Stand */}
        <ellipse cx="50" cy="44" rx="28" ry="4" fill="#2d1303" />

        {/* Lamp Clay Bowl */}
        <path
          d="M6 14 C15 38, 85 38, 94 14 C90 10, 80 18, 50 18 C20 18, 10 10, 6 14 Z"
          fill="url(#diyaBody)"
          stroke="#b45309"
          strokeWidth="1.2"
        />

        {/* Golden Ornate Rim */}
        <path
          d="M6 14 C20 22, 80 22, 94 14 C80 18, 20 18, 6 14 Z"
          fill="url(#diyaGoldRim)"
        />

        {/* Traditional Indian Paisley / Dot motifs on Diya */}
        <circle cx="50" cy="28" r="2.5" fill="#fef08a" />
        <circle cx="36" cy="26" r="2" fill="#fde047" />
        <circle cx="64" cy="26" r="2" fill="#fde047" />
        <circle cx="24" cy="22" r="1.5" fill="#facc15" />
        <circle cx="76" cy="22" r="1.5" fill="#facc15" />
      </svg>
    </div>
  );
};

