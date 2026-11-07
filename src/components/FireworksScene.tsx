import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Sparkles, Wand2, Flame, Heart, RefreshCw } from 'lucide-react';
import { FireworksCanvasHandle, FireworkType } from './FireworksCanvas';
import { RANDOM_WISH_BLESSINGS } from '../data/diwaliContent';
import { audioService } from '../services/audioService';

interface FireworksSceneProps {
  canvasRef: React.RefObject<FireworksCanvasHandle>;
  onNextSection?: () => void;
}

export const FireworksScene: React.FC<FireworksSceneProps> = ({ canvasRef, onNextSection }) => {
  const [currentWish, setCurrentWish] = useState<string | null>(null);
  const [wishCount, setWishCount] = useState(0);

  const handleMakeWish = () => {
    // Pick random positive wish
    const randomWish = RANDOM_WISH_BLESSINGS[Math.floor(Math.random() * RANDOM_WISH_BLESSINGS.length)];
    setCurrentWish(randomWish);
    setWishCount((prev) => prev + 1);

    audioService.playSparkle();

    // Launch multi-burst fireworks barrage
    if (canvasRef.current) {
      canvasRef.current.launchMultiple(5);
    }
  };

  const handleLaunchSpecific = (type: FireworkType) => {
    if (canvasRef.current) {
      const randomX = window.innerWidth * (0.2 + Math.random() * 0.6);
      const randomY = window.innerHeight * (0.15 + Math.random() * 0.35);
      canvasRef.current.launch(randomX, randomY, type);
    }
  };

  const handleLaunchFountain = () => {
    if (canvasRef.current) {
      canvasRef.current.triggerFountain();
    }
  };

  return (
    <section className="relative min-h-screen w-full flex flex-col items-center justify-between px-4 py-16 z-20 text-center">
      {/* Sky Hint Banner */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8 }}
        className="px-5 py-2 rounded-full magic-glass border border-amber-400/40 text-amber-200 text-xs sm:text-sm font-medium shadow-lg flex items-center gap-2"
      >
        <Sparkles className="w-4 h-4 text-amber-300 animate-spin" style={{ animationDuration: '5s' }} />
        <span>Tap or click anywhere in the night sky to launch fireworks!</span>
        <Sparkles className="w-4 h-4 text-amber-300" />
      </motion.div>

      {/* Center Wish Card & Interactions */}
      <div className="max-w-xl w-full my-auto flex flex-col items-center">
        <motion.h2
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.8 }}
          className="font-serif text-3xl sm:text-5xl font-bold mb-3 drop-shadow-[0_2px_20px_rgba(255,215,0,0.4)]"
        >
          <span className="gold-shimmer-text">Festival of Sparkling Lights</span>
        </motion.h2>

        <p className="text-sm sm:text-base text-amber-100/80 mb-8 max-w-md font-light">
          Each firework carries a wish up to the heavens. Close your eyes, think of something beautiful, and make your wish!
        </p>

        {/* Primary Wish Button */}
        <div className="relative group mb-8">
          <div className="absolute -inset-1 bg-gradient-to-r from-amber-400 via-pink-500 to-purple-600 rounded-full blur-md opacity-75 group-hover:opacity-100 transition duration-500 animate-pulse" />
          <button
            onClick={handleMakeWish}
            className="relative px-8 py-4 sm:px-10 sm:py-4 bg-gradient-to-r from-amber-400 via-orange-400 to-amber-500 hover:from-amber-300 hover:to-orange-300 text-slate-950 font-serif font-bold text-lg sm:text-xl rounded-full shadow-[0_8px_30px_rgba(255,200,0,0.6)] flex items-center gap-3 transition-transform active:scale-95"
          >
            <Wand2 className="w-5 h-5 text-slate-900" />
            <span>Make a Wish ✨</span>
          </button>
        </div>

        {/* Display Current Wish Toast */}
        <AnimatePresence mode="wait">
          {currentWish && (
            <motion.div
              key={currentWish + wishCount}
              initial={{ opacity: 0, y: 15, scale: 0.95 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: -15, scale: 0.95 }}
              transition={{ duration: 0.4 }}
              className="p-5 rounded-2xl magic-glass-bright border border-amber-400/50 shadow-2xl text-center max-w-md mx-4 relative"
            >
              <div className="text-amber-300 text-xs font-serif uppercase tracking-wider mb-1 flex items-center justify-center gap-1">
                <Heart className="w-3.5 h-3.5 text-rose-400 fill-rose-400" /> Blessing for You
              </div>
              <p className="font-serif text-lg sm:text-xl text-white font-medium drop-shadow-md">
                "{currentWish}"
              </p>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Crackers Palette Selector */}
        <div className="mt-10 p-3 rounded-2xl magic-glass border border-amber-500/20 max-w-md w-full">
          <p className="text-[11px] font-serif text-amber-300/80 uppercase tracking-widest mb-2.5">
            Choose Firework Style
          </p>
          <div className="grid grid-cols-3 sm:grid-cols-5 gap-2">
            <button
              onClick={() => handleLaunchSpecific('golden')}
              className="px-2.5 py-2 rounded-xl bg-amber-500/20 hover:bg-amber-500/30 border border-amber-400/40 text-[11px] font-medium text-amber-200 transition-all"
            >
              👑 Golden
            </button>
            <button
              onClick={() => handleLaunchSpecific('pink')}
              className="px-2.5 py-2 rounded-xl bg-pink-500/20 hover:bg-pink-500/30 border border-pink-400/40 text-[11px] font-medium text-pink-200 transition-all"
            >
              🌸 Peony
            </button>
            <button
              onClick={() => handleLaunchSpecific('purple')}
              className="px-2.5 py-2 rounded-xl bg-purple-500/20 hover:bg-purple-500/30 border border-purple-400/40 text-[11px] font-medium text-purple-200 transition-all"
            >
              💜 Violet
            </button>
            <button
              onClick={() => handleLaunchSpecific('flower')}
              className="px-2.5 py-2 rounded-xl bg-rose-500/20 hover:bg-rose-500/30 border border-rose-400/40 text-[11px] font-medium text-rose-200 transition-all"
            >
              🌺 Blossom
            </button>
            <button
              onClick={handleLaunchFountain}
              className="px-2.5 py-2 rounded-xl bg-orange-500/20 hover:bg-orange-500/30 border border-orange-400/40 text-[11px] font-medium text-orange-200 transition-all"
            >
              🎇 Anar
            </button>
          </div>
        </div>
      </div>

      {/* Advance to next stage CTA */}
      {onNextSection && (
        <button
          onClick={onNextSection}
          className="mt-6 inline-flex items-center gap-2 text-xs font-serif text-amber-300 hover:text-white transition-colors bg-black/40 hover:bg-black/60 px-5 py-2 rounded-full border border-amber-400/30"
        >
          <span>Discover Heartfelt Wishes</span>
          <span>→</span>
        </button>
      )}
    </section>
  );
};

