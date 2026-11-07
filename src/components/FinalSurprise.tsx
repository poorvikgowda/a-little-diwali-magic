import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Heart, Sparkles, RefreshCcw, Send } from 'lucide-react';
import confetti from 'canvas-confetti';
import { DiyaIllustration } from './DiyaIllustration';
import { FireworksCanvasHandle } from './FireworksCanvas';
import { FINAL_SURPRISE_LINES } from '../data/diwaliContent';
import { audioService } from '../services/audioService';

interface FinalSurpriseProps {
  canvasRef: React.RefObject<FireworksCanvasHandle>;
  friendName: string;
  onRestartJourney?: () => void;
}

export const FinalSurprise: React.FC<FinalSurpriseProps> = ({
  canvasRef,
  friendName,
  onRestartJourney,
}) => {
  const [hasStarted, setHasStarted] = useState(false);
  const [revealedIndex, setRevealedIndex] = useState(-1);
  const [isGrandCelebration, setIsGrandCelebration] = useState(false);
  const [darkenSky, setDarkenSky] = useState(false);
  const [centralLight, setCentralLight] = useState(false);

  // Trigger line-by-line reveal with exact requested timing
  const startCinematicSequence = () => {
    setHasStarted(true);
    audioService.init();

    // STEP 1 & 2: Darken background after brief pause
    setTimeout(() => {
      setDarkenSky(true);
    }, 400);

    // STEP 3: Golden glowing light in center
    setTimeout(() => {
      setCentralLight(true);
      audioService.playSparkle();
    }, 1200);

    // STEP 4: Start line-by-line reveals
    // Timeline based on prompt specifications:
    // Line 0: reveals first
    // Line 1: reveals after ~2s wait
    // Line 2: reveals after ~3s wait
    // Line 3: reveals after ~1.5s wait
    // Line 4: reveals after ~1.5s wait
    // Line 5: reveals after ~3s wait (GRAND FINALE!)

    const schedule = [
      { index: 0, time: 1800 },
      { index: 1, time: 3800 },
      { index: 2, time: 6800 },
      { index: 3, time: 8300 },
      { index: 4, time: 9800 },
      { index: 5, time: 12800, isFinal: true },
    ];

    schedule.forEach(({ index, time, isFinal }) => {
      setTimeout(() => {
        setRevealedIndex(index);
        audioService.playSparkle();

        if (isFinal) {
          triggerGrandCelebration();
        }
      }, time);
    });
  };

  const triggerGrandCelebration = () => {
    setIsGrandCelebration(true);
    audioService.playGrandCelebration();

    // Trigger canvas finale mode for continuous fireworks
    if (canvasRef.current) {
      canvasRef.current.setFinaleMode(true);
    }

    // Launch golden and festive confetti hearts
    try {
      confetti({
        particleCount: 80,
        spread: 100,
        origin: { y: 0.6 },
        colors: ['#ffd700', '#ff8c00', '#f472b6', '#a855f7', '#ffffff'],
      });

      setTimeout(() => {
        confetti({
          particleCount: 120,
          spread: 120,
          origin: { y: 0.4 },
          colors: ['#ffd700', '#ff3366', '#ffb700'],
        });
      }, 1200);
    } catch (e) {
      // ignore
    }
  };

  // Cleanup finale fireworks mode on unmount
  useEffect(() => {
    return () => {
      if (canvasRef.current) {
        canvasRef.current.setFinaleMode(false);
      }
    };
  }, [canvasRef]);

  return (
    <section className="relative min-h-screen w-full flex flex-col items-center justify-between px-4 py-16 z-20 text-center overflow-hidden">
      {/* Darkened Vignette Overlay for STEP 2 */}
      <div
        className={`fixed inset-0 pointer-events-none transition-opacity duration-1000 z-10 ${
          darkenSky ? 'opacity-85 bg-[#03040e]' : 'opacity-0'
        }`}
      />

      {/* Central Golden Glowing Orb for STEP 3 */}
      {centralLight && (
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-96 h-96 rounded-full bg-gradient-to-r from-amber-400/20 via-yellow-200/15 to-orange-500/20 blur-3xl pointer-events-none animate-pulse z-10" />
      )}

      {/* Floating Diyas Border around the perimeter */}
      <div className="w-full max-w-5xl flex justify-between items-center px-4 relative z-20">
        <DiyaIllustration size="sm" isLit intensity={isGrandCelebration ? 3 : 1} />
        <div className="text-amber-300 text-xs font-serif tracking-widest uppercase flex items-center gap-1.5 opacity-80">
          <Sparkles className="w-3.5 h-3.5 text-amber-400" />
          The Final Surprise
          <Sparkles className="w-3.5 h-3.5 text-amber-400" />
        </div>
        <DiyaIllustration size="sm" isLit intensity={isGrandCelebration ? 3 : 1} />
      </div>

      {/* Main Content Arena */}
      <div className="relative w-full max-w-2xl my-auto flex flex-col items-center justify-center z-20 min-h-[460px] px-4">
        {!hasStarted ? (
          /* INITIAL STATE */
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.8 }}
            className="flex flex-col items-center"
          >
            {/* Ambient decorative diya */}
            <div className="mb-6">
              <DiyaIllustration size="lg" intensity={2} />
            </div>

            {/* Exact required text */}
            <h2 className="font-serif text-2xl sm:text-4xl text-amber-200 font-bold mb-4 drop-shadow-[0_2px_20px_rgba(255,215,0,0.4)]">
              Before you go... there's one last little thing. ✨
            </h2>

            <p className="text-sm sm:text-base text-amber-100/80 mb-10 max-w-md font-light">
              A quiet message from the heart to keep with you long after the festival lights settle.
            </p>

            {/* Glowing Golden Button: One Last Thing... ❤️ */}
            <div className="relative group">
              <div className="absolute -inset-1.5 bg-gradient-to-r from-amber-400 via-rose-500 to-amber-500 rounded-full blur-xl opacity-80 group-hover:opacity-100 transition duration-500 animate-pulse" />
              <button
                onClick={startCinematicSequence}
                className="relative px-10 py-5 bg-gradient-to-r from-amber-400 via-amber-300 to-orange-500 hover:from-amber-300 hover:to-orange-400 text-slate-950 font-serif font-extrabold text-xl rounded-full shadow-[0_10px_40px_rgba(255,200,0,0.6)] flex items-center gap-3 transition-transform active:scale-95 border border-yellow-100"
              >
                <span>One Last Thing...</span>
                <Heart className="w-6 h-6 text-rose-600 fill-rose-600 animate-pulse" />
              </button>
            </div>
          </motion.div>
        ) : (
          /* STEP 4: LINE-BY-LINE CINEMATIC TEXT REVEAL */
          <div className="flex flex-col items-center justify-center space-y-6 w-full py-8">
            {/* Line 1: "Among all the lights that shine tonight," */}
            {revealedIndex >= 0 && (
              <motion.p
                initial={{ opacity: 0, y: 25 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 1.2, ease: 'easeOut' }}
                className="font-serif text-xl sm:text-3xl text-amber-100 font-light tracking-wide leading-relaxed drop-shadow-[0_2px_12px_rgba(255,215,0,0.3)]"
              >
                {FINAL_SURPRISE_LINES[0].text}
              </motion.p>
            )}

            {/* Line 2: "I hope you never forget that you deserve to shine the brightest." */}
            {revealedIndex >= 1 && (
              <motion.p
                initial={{ opacity: 0, y: 25 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 1.4, ease: 'easeOut' }}
                className="font-serif text-2xl sm:text-4xl text-amber-200 font-semibold tracking-wide leading-relaxed drop-shadow-[0_4px_20px_rgba(255,215,0,0.5)]"
              >
                {FINAL_SURPRISE_LINES[1].text}
              </motion.p>
            )}

            {/* Short Triple Rhythm: Keep smiling, Keep shining, And keep being you. */}
            <div className="space-y-3 pt-3">
              {/* Line 3: "Keep smiling," */}
              {revealedIndex >= 2 && (
                <motion.p
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 1, ease: 'easeOut' }}
                  className="font-handwritten text-3xl sm:text-4xl text-rose-300 font-bold drop-shadow-md"
                >
                  {FINAL_SURPRISE_LINES[2].text}
                </motion.p>
              )}

              {/* Line 4: "Keep shining," */}
              {revealedIndex >= 3 && (
                <motion.p
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 1, ease: 'easeOut' }}
                  className="font-handwritten text-3xl sm:text-4xl text-amber-300 font-bold drop-shadow-md"
                >
                  {FINAL_SURPRISE_LINES[3].text}
                </motion.p>
              )}

              {/* Line 5: "And keep being you." */}
              {revealedIndex >= 4 && (
                <motion.p
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 1.2, ease: 'easeOut' }}
                  className="font-serif text-2xl sm:text-3xl text-white font-medium drop-shadow-md pt-2"
                >
                  {FINAL_SURPRISE_LINES[4].text}
                </motion.p>
              )}
            </div>

            {/* FINAL LINE & GRAND CELEBRATION */}
            {revealedIndex >= 5 && (
              <motion.div
                initial={{ opacity: 0, scale: 0.8, y: 30 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                transition={{ duration: 1.5, ease: [0.16, 1, 0.3, 1] }}
                className="pt-8 flex flex-col items-center"
              >
                {/* Heading with golden shimmer */}
                <h1 className="font-serif text-4xl sm:text-6xl md:text-7xl font-extrabold gold-shimmer-text tracking-tight mb-4 drop-shadow-[0_0_35px_rgba(255,215,0,0.8)]">
                  {FINAL_SURPRISE_LINES[5].text}
                </h1>

                {/* Subtitle 1: "Sending you endless happiness, always. ❤️" */}
                <motion.p
                  initial={{ opacity: 0, y: 15 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 1, delay: 0.8 }}
                  className="font-serif text-lg sm:text-2xl text-amber-200/90 font-medium flex items-center justify-center gap-2 mb-3"
                >
                  <span>Sending you endless happiness, always.</span>
                  <Heart className="w-5 h-5 text-rose-500 fill-rose-500 animate-pulse" />
                </motion.p>

                {/* Subtitle 2: "Made especially for you ✨" */}
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ duration: 1, delay: 1.6 }}
                  className="inline-flex items-center gap-2 px-5 py-2 rounded-full bg-amber-500/20 border border-amber-300/50 text-amber-300 text-xs sm:text-sm font-serif shadow-[0_0_20px_rgba(255,215,0,0.3)] mt-2"
                >
                  <Sparkles className="w-4 h-4 text-amber-400" />
                  <span>Made especially for you ✨</span>
                  <Sparkles className="w-4 h-4 text-amber-400" />
                </motion.div>
              </motion.div>
            )}
          </div>
        )}
      </div>

      {/* Bottom Footer & Navigation */}
      <div className="w-full max-w-4xl flex flex-col sm:flex-row items-center justify-between gap-4 px-4 pt-6 pb-2 border-t border-amber-500/20 relative z-20">
        <div className="flex items-center gap-3">
          <DiyaIllustration size="sm" isLit intensity={isGrandCelebration ? 3 : 1} />
          <span className="text-xs font-serif text-amber-200/70">
            A Little Diwali Magic 🪔✨
          </span>
        </div>

        {/* Restart Journey Button */}
        {hasStarted && (
          <button
            onClick={onRestartJourney}
            className="flex items-center gap-2 text-xs font-serif text-amber-300 hover:text-white bg-black/40 hover:bg-black/60 px-4 py-2 rounded-full border border-amber-400/30 transition-all"
          >
            <RefreshCcw className="w-3.5 h-3.5" />
            <span>Relive the Magic From Start</span>
          </button>
        )}
      </div>
    </section>
  );
};

