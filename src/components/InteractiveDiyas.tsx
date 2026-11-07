import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Flame, RotateCcw } from 'lucide-react';
import { DiyaIllustration } from './DiyaIllustration';
import { RangoliIllustration } from './RangoliIllustration';
import { audioService } from '../services/audioService';

interface InteractiveDiyasProps {
  onNextSection?: () => void;
}

interface DiyaState {
  id: number;
  label: string;
  isLit: boolean;
  intensity: number;
  angle: number; // angle in degrees for symmetrical circular distribution
}

// Exactly 7 diyas (LOVE diya completely removed) arranged with visual symmetry: 360/7 = 51.43 deg
const INITIAL_DIYAS: DiyaState[] = [
  { id: 1, label: "Hope", isLit: true, intensity: 1, angle: -90 },
  { id: 2, label: "Peace", isLit: true, intensity: 1, angle: -90 + 51.43 * 1 },
  { id: 3, label: "Joy", isLit: false, intensity: 1, angle: -90 + 51.43 * 2 },
  { id: 4, label: "Health", isLit: false, intensity: 1, angle: -90 + 51.43 * 3 },
  { id: 5, label: "Prosperity", isLit: false, intensity: 1, angle: -90 + 51.43 * 4 },
  { id: 6, label: "Laughter", isLit: false, intensity: 1, angle: -90 + 51.43 * 5 },
  { id: 7, label: "Wisdom", isLit: false, intensity: 1, angle: -90 + 51.43 * 6 },
];

export const InteractiveDiyas: React.FC<InteractiveDiyasProps> = ({ onNextSection }) => {
  const [diyas, setDiyas] = useState<DiyaState[]>(INITIAL_DIYAS);
  const [activeMessage, setActiveMessage] = useState<string | null>(null);

  const litCount = diyas.filter((d) => d.isLit).length;
  const allLit = litCount === diyas.length;

  const handleDiyaClick = (id: number) => {
    setDiyas((prev) =>
      prev.map((d) => {
        if (d.id === id) {
          const nextIntensity = d.isLit ? (d.intensity % 3) + 1 : 1;
          return { ...d, isLit: true, intensity: nextIntensity };
        }
        return d;
      })
    );
    audioService.playDiyaLight();
    const diya = diyas.find((d) => d.id === id);
    if (diya) {
      setActiveMessage(`Light of ${diya.label} is shining bright! 🪔`);
      setTimeout(() => setActiveMessage(null), 3000);
    }
  };

  const handleLightNextDiya = () => {
    const unlit = diyas.find((d) => !d.isLit);
    if (unlit) {
      setDiyas((prev) =>
        prev.map((d) => (d.id === unlit.id ? { ...d, isLit: true, intensity: 2 } : d))
      );
      audioService.playDiyaLight();
      setActiveMessage(`You illuminated the Diya of ${unlit.label}! ✨`);
      setTimeout(() => setActiveMessage(null), 3000);

      if (litCount + 1 === diyas.length) {
        audioService.playSparkle();
      }
    } else {
      // All are lit, boost intensity of all!
      setDiyas((prev) =>
        prev.map((d) => ({ ...d, intensity: 3 }))
      );
      audioService.playSparkle();
      setActiveMessage("All diyas are blazing at full brilliance! 🌟");
      setTimeout(() => setActiveMessage(null), 3000);
    }
  };

  const handleReset = () => {
    setDiyas(INITIAL_DIYAS);
    audioService.playSparkle();
  };

  return (
    <section className="relative min-h-screen w-full flex flex-col items-center justify-between px-4 py-16 z-20 text-center overflow-hidden">
      {/* Header */}
      <div className="max-w-2xl flex flex-col items-center mb-4">
        <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-amber-500/15 border border-amber-400/40 text-amber-300 text-xs font-serif tracking-wider uppercase mb-3">
          <Flame className="w-3.5 h-3.5 text-amber-400" />
          <span>Sacred Courtyard of Diyas</span>
          <Flame className="w-3.5 h-3.5 text-amber-400" />
        </div>

        <h2 className="font-serif text-3xl sm:text-5xl font-bold mb-3 drop-shadow-[0_2px_20px_rgba(255,215,0,0.4)]">
          <span className="gold-shimmer-text">Kindle the Festival Lights</span>
        </h2>

        {/* Required exact text */}
        <p className="font-serif text-base sm:text-xl text-amber-100 max-w-xl font-medium leading-relaxed drop-shadow-md">
          "Every little light carries a little hope. May yours always shine bright. 🪔"
        </p>

        {/* Lit Counter Badge - Reflecting 7 Diyas */}
        <div className="mt-3 flex items-center gap-2 text-xs font-serif text-amber-300 bg-amber-500/10 px-4 py-1.5 rounded-full border border-amber-400/30">
          <span>Diyas Illuminated:</span>
          <span className="font-bold text-amber-200">{litCount} of {diyas.length}</span>
          {allLit && <span className="text-emerald-400 font-bold ml-1">✨ Fully Radiant!</span>}
        </div>
      </div>

      {/* Main Interactive Stage: Symmetrical Circular Layout of 7 Diyas around the Rangoli */}
      <div className="relative w-full max-w-xl aspect-square my-auto flex items-center justify-center p-4">
        {/* Animated Central Rangoli */}
        <div className="relative z-10">
          <RangoliIllustration size={window.innerWidth < 640 ? 250 : 340} />
        </div>

        {/* 7 Diyas Positioned Symmetrically in a Circle */}
        {diyas.map((diya) => {
          // Calculate circle coordinates with rotational symmetry
          const rad = (diya.angle * Math.PI) / 180;
          const radius = window.innerWidth < 640 ? 120 : 165;
          const x = Math.cos(rad) * radius;
          const y = Math.sin(rad) * radius;

          return (
            <div
              key={diya.id}
              style={{
                transform: `translate(${x}px, ${y}px)`,
              }}
              className="absolute z-20 flex flex-col items-center transition-all duration-500"
            >
              <DiyaIllustration
                size={window.innerWidth < 640 ? 'sm' : 'md'}
                isLit={diya.isLit}
                intensity={diya.intensity}
                onClick={() => handleDiyaClick(diya.id)}
              />
              <span
                className={`text-[10px] sm:text-xs font-serif mt-0.5 tracking-wider font-semibold transition-colors ${
                  diya.isLit ? 'text-amber-300 drop-shadow-[0_0_8px_#ffd700]' : 'text-slate-500'
                }`}
              >
                {diya.label}
              </span>
            </div>
          );
        })}

        {/* Active Feedback Message */}
        <AnimatePresence>
          {activeMessage && (
            <motion.div
              initial={{ opacity: 0, scale: 0.8, y: 10 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.8 }}
              className="absolute z-30 px-4 py-2 rounded-full magic-glass-bright border border-amber-400 text-amber-200 text-xs font-serif shadow-xl"
            >
              {activeMessage}
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Action Controls */}
      <div className="flex flex-col sm:flex-row items-center gap-4 mt-6">
        {/* Button: Light Up Another Diya */}
        <div className="relative group">
          <div className="absolute -inset-1 bg-gradient-to-r from-amber-400 to-orange-500 rounded-full blur-md opacity-70 group-hover:opacity-100 transition duration-300 animate-pulse" />
          <button
            onClick={handleLightNextDiya}
            className="relative px-7 py-3 bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-400 hover:to-orange-400 text-slate-950 font-serif font-bold text-sm sm:text-base rounded-full shadow-lg flex items-center gap-2 active:scale-95 transition-all cursor-pointer"
          >
            <Flame className="w-4 h-4 fill-slate-900" />
            <span>Light Up Another Diya</span>
          </button>
        </div>

        {/* Reset button */}
        <button
          onClick={handleReset}
          className="text-xs text-amber-200/60 hover:text-amber-200 flex items-center gap-1 px-3 py-2 cursor-pointer"
        >
          <RotateCcw className="w-3.5 h-3.5" /> Reset Diyas
        </button>
      </div>

      {/* Advance to Secret Letter */}
      {onNextSection && (
        <button
          onClick={onNextSection}
          className="mt-6 inline-flex items-center gap-2 text-xs font-serif text-amber-300 hover:text-white transition-colors bg-black/40 hover:bg-black/60 px-5 py-2 rounded-full border border-amber-400/30 cursor-pointer"
        >
          <span>A Secret Letter Awaits You</span>
          <span>→</span>
        </button>
      )}
    </section>
  );
};
