import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Sparkles, ChevronDown } from 'lucide-react';
import { DiyaIllustration } from './DiyaIllustration';
import { RangoliIllustration } from './RangoliIllustration';
import { audioService } from '../services/audioService';

interface WelcomeScreenProps {
  friendName?: string;
  onUpdateName?: (name: string) => void;
  onOpenSurprise: () => void;
}

export const WelcomeScreen: React.FC<WelcomeScreenProps> = ({
  onOpenSurprise,
}) => {
  const [isBursting, setIsBursting] = useState(false);

  const handleOpenClick = () => {
    setIsBursting(true);
    audioService.init();
    audioService.playMagicReveal();
    audioService.playFireworkExplosion({ grand: true });

    setTimeout(() => {
      onOpenSurprise();
    }, 900);
  };

  return (
    <section className="relative min-h-screen w-full flex flex-col items-center justify-between px-4 py-8 z-20 text-center overflow-hidden">
      {/* Golden Fairy Lights Strand at the top */}
      <div className="w-full max-w-4xl flex justify-between items-center px-4 pt-2 pb-6 opacity-85 pointer-events-none">
        {Array.from({ length: 14 }).map((_, i) => (
          <div key={i} className="flex flex-col items-center">
            <div className="w-[1px] h-3 bg-amber-400/40" />
            <div
              className="w-2.5 h-3.5 rounded-full bg-amber-300 shadow-[0_0_12px_#ffcc00] animate-pulse"
              style={{
                animationDelay: `${(i % 5) * 0.35}s`,
                backgroundColor: i % 3 === 0 ? '#ffd700' : i % 3 === 1 ? '#ff8c00' : '#f472b6',
                boxShadow: i % 3 === 0 ? '0 0 10px #ffd700' : i % 3 === 1 ? '0 0 10px #ff8c00' : '0 0 10px #f472b6',
              }}
            />
          </div>
        ))}
      </div>

      {/* Main Hero Container - Spacious, Centered & Visually Balanced */}
      <div className="max-w-4xl w-full my-auto flex flex-col items-center justify-center relative py-12 sm:py-16">
        {/* Subtle decorative rangoli watermark in center background */}
        <div
          className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 opacity-20 pointer-events-none -z-10 scale-125 animate-spin"
          style={{ animationDuration: '120s' }}
        >
          <RangoliIllustration size={500} />
        </div>

        {/* Small Festive Badge */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-amber-500/15 border border-amber-400/40 text-amber-300 text-xs sm:text-sm font-medium mb-8 shadow-[0_0_20px_rgba(255,215,0,0.25)] backdrop-blur-md"
        >
          <Sparkles className="w-4 h-4 text-amber-300 animate-spin" style={{ animationDuration: '4s' }} />
          <span>Shubh Deepavali • Festival of Lights</span>
          <Sparkles className="w-4 h-4 text-amber-300" />
        </motion.div>

        {/* Main Heading: "A LITTLE DIWALI MAGIC ✨" */}
        <motion.h1
          initial={{ opacity: 0, scale: 0.92 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 1, delay: 0.2 }}
          className="font-serif text-4xl sm:text-6xl md:text-7xl lg:text-8xl font-extrabold uppercase tracking-wider mb-12 sm:mb-16 leading-tight drop-shadow-[0_4px_35px_rgba(255,180,0,0.45)] text-center"
        >
          <span className="gold-shimmer-text">A Little Diwali Magic</span>{' '}
          <span className="inline-block animate-bounce text-amber-300">✨</span>
        </motion.h1>

        {/* Primary CTA Glowing Button: "OPEN YOUR DIWALI SURPRISE 🪔" */}
        <motion.div
          initial={{ opacity: 0, scale: 0.85 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.8, delay: 0.4 }}
          className="relative inline-block"
        >
          {/* Outer pulsating glow aura */}
          <div className="absolute -inset-1.5 bg-gradient-to-r from-amber-400 via-orange-500 to-rose-500 rounded-full blur-xl opacity-75 group-hover:opacity-100 transition duration-1000 group-hover:duration-200 animate-pulse" />

          <button
            onClick={handleOpenClick}
            disabled={isBursting}
            className="relative px-8 sm:px-12 py-4 sm:py-5 bg-gradient-to-r from-amber-500 via-amber-400 to-orange-500 hover:from-amber-400 hover:to-orange-400 text-slate-950 font-serif font-bold text-lg sm:text-2xl rounded-full shadow-[0_10px_40px_rgba(255,180,0,0.55)] transform hover:-translate-y-1 active:translate-y-0.5 transition-all duration-300 flex items-center gap-3 border border-yellow-200 cursor-pointer"
          >
            <span>Open Your Diwali Surprise</span>
            <span className="text-2xl sm:text-3xl animate-spin" style={{ animationDuration: '8s' }}>🪔</span>
          </button>
        </motion.div>

        {/* Click light burst overlay effect */}
        {isBursting && (
          <div className="fixed inset-0 bg-gradient-to-r from-amber-300/40 via-yellow-100/60 to-amber-400/40 pointer-events-none z-50 animate-ping" />
        )}
      </div>

      {/* Bottom Glowing Diyas Row */}
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 1, delay: 0.6 }}
        className="w-full max-w-4xl flex items-end justify-around pt-6 px-4 pb-2"
      >
        <DiyaIllustration size="sm" intensity={1} />
        <DiyaIllustration size="md" intensity={2} />
        <div className="flex flex-col items-center">
          <DiyaIllustration size="lg" intensity={3} />
          <span className="text-[11px] font-serif text-amber-300/80 mt-1 flex items-center gap-1">
            Tap a diya to kindle its flame 🪔
          </span>
        </div>
        <DiyaIllustration size="md" intensity={2} />
        <DiyaIllustration size="sm" intensity={1} />
      </motion.div>

      {/* Down indicator */}
      <div className="absolute bottom-2 left-1/2 -translate-x-1/2 opacity-40 animate-bounce pointer-events-none">
        <ChevronDown className="w-5 h-5 text-amber-300" />
      </div>
    </section>
  );
};
