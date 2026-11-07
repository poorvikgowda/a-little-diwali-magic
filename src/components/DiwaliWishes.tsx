import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Sparkles, Heart, ChevronLeft, ChevronRight, Play, Pause, Grid, Layers } from 'lucide-react';
import { DIWALI_WISHES, CLOSING_WISH } from '../data/diwaliContent';
import { DiyaIllustration } from './DiyaIllustration';
import { audioService } from '../services/audioService';

interface DiwaliWishesProps {
  onNextSection?: () => void;
}

export const DiwaliWishes: React.FC<DiwaliWishesProps> = ({ onNextSection }) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isAutoPlaying, setIsAutoPlaying] = useState(true);
  const [viewMode, setViewMode] = useState<'carousel' | 'constellation'>('carousel');

  // Auto progression for carousel across exactly the 6 wishes
  useEffect(() => {
    if (!isAutoPlaying || viewMode !== 'carousel') return;
    const timer = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % DIWALI_WISHES.length);
    }, 5500);
    return () => clearInterval(timer);
  }, [isAutoPlaying, viewMode]);

  const handleNext = () => {
    audioService.playSparkle();
    setCurrentIndex((prev) => (prev + 1) % DIWALI_WISHES.length);
  };

  const handlePrev = () => {
    audioService.playSparkle();
    setCurrentIndex((prev) => (prev - 1 + DIWALI_WISHES.length) % DIWALI_WISHES.length);
  };

  const currentWish = DIWALI_WISHES[currentIndex];

  return (
    <section className="relative min-h-screen w-full flex flex-col items-center justify-between px-4 py-16 z-20 overflow-hidden text-center">
      {/* Section Header */}
      <div className="max-w-2xl flex flex-col items-center mb-6">
        <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-amber-500/15 border border-amber-400/40 text-amber-300 text-xs font-serif tracking-wider uppercase mb-3">
          <Sparkles className="w-3.5 h-3.5 text-amber-400" />
          <span>Wishes Floating In The Night</span>
          <Sparkles className="w-3.5 h-3.5 text-amber-400" />
        </div>

        <h2 className="font-serif text-3xl sm:text-5xl font-bold mb-3 drop-shadow-[0_2px_20px_rgba(255,215,0,0.4)]">
          <span className="gold-shimmer-text">Words from the Heart</span>
        </h2>
        <p className="text-xs sm:text-sm text-amber-200/80 max-w-md font-light leading-relaxed">
          Each message is an earthen lamp floating down the river of time, carrying sincere blessings for you.
        </p>

        {/* View mode toggle */}
        <div className="flex items-center gap-2 mt-4">
          <button
            onClick={() => setViewMode('carousel')}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-medium transition-all ${
              viewMode === 'carousel'
                ? 'bg-amber-400 text-slate-950 font-bold shadow-lg shadow-amber-500/30'
                : 'bg-black/40 text-amber-300 border border-amber-500/30 hover:bg-black/60'
            }`}
          >
            <Layers className="w-3.5 h-3.5" /> Floating Dream
          </button>
          <button
            onClick={() => setViewMode('constellation')}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-medium transition-all ${
              viewMode === 'constellation'
                ? 'bg-amber-400 text-slate-950 font-bold shadow-lg shadow-amber-500/30'
                : 'bg-black/40 text-amber-300 border border-amber-500/30 hover:bg-black/60'
            }`}
          >
            <Grid className="w-3.5 h-3.5" /> All Wishes ({DIWALI_WISHES.length})
          </button>
        </div>
      </div>

      {/* Main Content Area */}
      {viewMode === 'carousel' ? (
        <div className="relative w-full max-w-2xl my-auto flex flex-col items-center">
          {/* Floating Lantern / Arch Shaped Card */}
          <div className="relative w-full px-4">
            <AnimatePresence mode="wait">
              <motion.div
                key={currentIndex}
                initial={{ opacity: 0, scale: 0.9, y: 30 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.9, y: -30 }}
                transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
                className="relative mx-auto max-w-lg p-8 sm:p-12 rounded-[40px] magic-glass-bright border-2 border-amber-400/50 shadow-[0_15px_50px_rgba(255,180,0,0.25)] text-center overflow-hidden"
              >
                {/* Traditional Arch / Jali Motif Overlay at Top */}
                <div className="absolute top-0 inset-x-0 h-16 flex justify-center opacity-30 pointer-events-none">
                  <svg width="240" height="40" viewBox="0 0 240 40" fill="none">
                    <path
                      d="M0 0 C60 0 80 35 120 35 C160 35 180 0 240 0"
                      stroke="#ffd700"
                      strokeWidth="2"
                    />
                  </svg>
                </div>

                {/* Top Glowing Diya */}
                <div className="flex justify-center mb-6">
                  <DiyaIllustration size="md" intensity={3} />
                </div>

                {/* Wish Number: EXACTLY 6 WISHES */}
                <div className="text-amber-400 text-xs font-serif uppercase tracking-widest mb-4">
                  Wish {currentIndex + 1} of {DIWALI_WISHES.length}
                </div>

                {/* Wish Text */}
                <h3 className="font-serif text-2xl sm:text-3xl text-white font-semibold leading-relaxed tracking-wide drop-shadow-lg mb-6">
                  "{currentWish.text}"
                </h3>

                {/* Golden Sparkle accents */}
                <div className="flex justify-center items-center gap-3 text-amber-400/80">
                  <span className="w-8 h-[1px] bg-gradient-to-r from-transparent to-amber-400" />
                  <Sparkles className="w-4 h-4 text-amber-300 animate-spin" style={{ animationDuration: '6s' }} />
                  <span className="w-8 h-[1px] bg-gradient-to-l from-transparent to-amber-400" />
                </div>
              </motion.div>
            </AnimatePresence>
          </div>

          {/* Navigation Controls */}
          <div className="flex items-center justify-center gap-4 mt-8">
            <button
              onClick={handlePrev}
              title="Previous Wish"
              className="p-3 rounded-full bg-slate-900/80 hover:bg-amber-500/20 text-amber-300 border border-amber-500/30 hover:border-amber-400 transition-all shadow-md active:scale-95"
            >
              <ChevronLeft className="w-5 h-5" />
            </button>

            {/* Dots for the 6 wishes */}
            <div className="flex items-center gap-1.5">
              {DIWALI_WISHES.map((_, i) => (
                <button
                  key={i}
                  onClick={() => {
                    audioService.playSparkle();
                    setCurrentIndex(i);
                  }}
                  className={`h-2 rounded-full transition-all duration-300 ${
                    i === currentIndex ? 'w-6 bg-amber-400 shadow-[0_0_8px_#ffd700]' : 'w-2 bg-amber-400/30 hover:bg-amber-400/60'
                  }`}
                  aria-label={`Go to wish ${i + 1}`}
                />
              ))}
            </div>

            <button
              onClick={handleNext}
              title="Next Wish"
              className="p-3 rounded-full bg-slate-900/80 hover:bg-amber-500/20 text-amber-300 border border-amber-500/30 hover:border-amber-400 transition-all shadow-md active:scale-95"
            >
              <ChevronRight className="w-5 h-5" />
            </button>

            {/* Play/Pause */}
            <button
              onClick={() => setIsAutoPlaying(!isAutoPlaying)}
              title={isAutoPlaying ? "Pause Auto-play" : "Start Auto-play"}
              className="p-3 rounded-full bg-slate-900/80 text-amber-300 border border-amber-500/30 hover:bg-amber-500/20 transition-all shadow-md ml-2"
            >
              {isAutoPlaying ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4" />}
            </button>
          </div>

          {/* Closing Wish Banner */}
          <div className="mt-8 px-6 py-2.5 rounded-full bg-gradient-to-r from-amber-500/10 via-amber-400/20 to-amber-500/10 border border-amber-400/40 text-amber-200 font-serif text-sm sm:text-base font-medium shadow-lg backdrop-blur-md flex items-center gap-2">
            <span>{CLOSING_WISH}</span>
          </div>
        </div>
      ) : (
        /* Constellation / Grid Mode of all 6 wishes */
        <div className="w-full max-w-5xl my-auto flex flex-col items-center">
          <div className="w-full grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 px-4 py-4">
            {DIWALI_WISHES.map((w, idx) => (
              <motion.div
                key={w.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: idx * 0.08 }}
                className="relative p-6 rounded-3xl magic-glass border border-amber-400/30 hover:border-amber-400 text-left transition-all duration-300 hover:shadow-[0_10px_30px_rgba(255,180,0,0.2)] group"
              >
                <div className="flex items-center justify-between mb-3">
                  <span className="text-[11px] font-serif text-amber-400 uppercase tracking-widest font-bold">
                    Wish {idx + 1}
                  </span>
                  <Heart className="w-4 h-4 text-rose-400/70 group-hover:text-rose-400 group-hover:scale-110 transition-transform" />
                </div>
                <p className="font-serif text-base text-slate-100 group-hover:text-amber-100 transition-colors leading-relaxed">
                  "{w.text}"
                </p>
              </motion.div>
            ))}
          </div>

          {/* Closing Wish in Grid Mode */}
          <div className="mt-6 px-8 py-3 rounded-full bg-gradient-to-r from-amber-500/15 via-amber-400/25 to-amber-500/15 border border-amber-400/50 text-amber-200 font-serif text-base sm:text-lg font-semibold shadow-xl backdrop-blur-md flex items-center gap-2">
            <span>{CLOSING_WISH}</span>
          </div>
        </div>
      )}

      {/* Next Step CTA */}
      {onNextSection && (
        <button
          onClick={onNextSection}
          className="mt-8 inline-flex items-center gap-2 text-xs font-serif text-amber-300 hover:text-white transition-colors bg-black/40 hover:bg-black/60 px-5 py-2 rounded-full border border-amber-400/30 cursor-pointer"
        >
          <span>Step into the Courtyard of Diyas</span>
          <span>→</span>
        </button>
      )}
    </section>
  );
};
