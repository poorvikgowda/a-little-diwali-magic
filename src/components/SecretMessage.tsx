import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Mail, Heart, Sparkles, Lock, ArrowDown } from 'lucide-react';
import { SECRET_LETTER } from '../data/diwaliContent';
import { audioService } from '../services/audioService';

interface SecretMessageProps {
  onNextSection?: () => void;
}

export const SecretMessage: React.FC<SecretMessageProps> = ({ onNextSection }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [isOpening, setIsOpening] = useState(false);

  const handleOpenEnvelope = () => {
    setIsOpening(true);
    audioService.playMagicReveal();

    setTimeout(() => {
      setIsOpen(true);
      setIsOpening(false);
    }, 1200);
  };

  return (
    <section className="relative min-h-screen w-full flex flex-col items-center justify-between px-4 py-16 z-20 text-center overflow-hidden">
      {/* Teaser Header */}
      <div className="max-w-xl flex flex-col items-center mb-6">
        <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-purple-900/40 border border-purple-400/40 text-purple-200 text-xs font-serif tracking-wider uppercase mb-3">
          <Mail className="w-3.5 h-3.5 text-pink-400" />
          <span>A Handwritten Keepsake</span>
          <Mail className="w-3.5 h-3.5 text-pink-400" />
        </div>

        {/* Required Initial Teaser text */}
        <h2 className="font-serif text-2xl sm:text-4xl font-bold text-amber-200 drop-shadow-[0_2px_15px_rgba(255,215,0,0.3)]">
          {SECRET_LETTER.teaser}
        </h2>
      </div>

      {/* Main Interactive Envelope & Letter Stage */}
      <div className="relative w-full max-w-xl my-auto flex flex-col items-center justify-center min-h-[460px]">
        <AnimatePresence mode="wait">
          {!isOpen ? (
            /* SEALED GOLDEN ENVELOPE */
            <motion.div
              key="closed-envelope"
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 1.05, opacity: 0 }}
              transition={{ duration: 0.6 }}
              className="relative flex flex-col items-center"
            >
              {/* Outer Golden Glow & Ethereal Rays */}
              <div className="absolute -inset-6 bg-gradient-to-r from-amber-500/20 via-pink-500/20 to-purple-500/20 rounded-3xl blur-2xl pointer-events-none" />

              {/* Envelope Body */}
              <div
                onClick={!isOpening ? handleOpenEnvelope : undefined}
                className="relative w-80 sm:w-96 h-56 rounded-2xl bg-gradient-to-br from-[#2a1745] via-[#1a0f30] to-[#120822] border-2 border-amber-400/60 shadow-[0_20px_60px_rgba(0,0,0,0.8)] cursor-pointer group flex items-center justify-center overflow-hidden transition-transform duration-300 hover:scale-105"
              >
                {/* Envelope Top Flap Triangle */}
                <div
                  className={`absolute top-0 inset-x-0 h-28 bg-gradient-to-b from-[#3b2062] to-[#251341] border-b-2 border-amber-400/40 origin-top transition-transform duration-1000 ${
                    isOpening ? '-scale-y-100 -translate-y-2' : ''
                  }`}
                  style={{
                    clipPath: 'polygon(0% 0%, 100% 0%, 50% 100%)',
                  }}
                />

                {/* Subtle Gold Foil Damask Pattern */}
                <div className="absolute inset-0 opacity-10 bg-[radial-gradient(#ffd700_1px,transparent_1px)] [background-size:16px_16px]" />

                {/* Center Glowing Heart-Shaped Wax Seal */}
                <div className="relative z-10 flex flex-col items-center">
                  <div className="w-16 h-16 rounded-full bg-gradient-to-br from-rose-600 via-red-700 to-amber-700 border-2 border-amber-300 shadow-[0_0_25px_rgba(255,50,100,0.8)] flex items-center justify-center transform group-hover:scale-110 transition-transform duration-300">
                    <Heart className="w-8 h-8 text-amber-200 fill-rose-300 animate-pulse" />
                  </div>
                  <span className="text-[11px] font-serif text-amber-300 mt-3 font-semibold tracking-widest uppercase opacity-90 group-hover:opacity-100">
                    Touch Seal to Open
                  </span>
                </div>

                {/* Light Bursting from seams when opening */}
                {isOpening && (
                  <div className="absolute inset-0 bg-amber-300/40 animate-ping pointer-events-none z-20" />
                )}
              </div>

              {/* Call to action button below envelope */}
              <div className="mt-8 relative group">
                <div className="absolute -inset-1 bg-gradient-to-r from-pink-500 via-amber-400 to-purple-600 rounded-full blur-md opacity-75 group-hover:opacity-100 animate-pulse transition duration-300" />
                <button
                  onClick={handleOpenEnvelope}
                  disabled={isOpening}
                  className="relative px-8 py-3.5 bg-gradient-to-r from-amber-400 to-pink-500 hover:from-amber-300 hover:to-pink-400 text-slate-950 font-serif font-bold text-base sm:text-lg rounded-full shadow-xl flex items-center gap-2 active:scale-95 transition-all"
                >
                  <Mail className="w-5 h-5 text-slate-950" />
                  <span>{SECRET_LETTER.button}</span>
                </button>
              </div>
            </motion.div>
          ) : (
            /* REVEALED HANDWRITTEN LETTER */
            <motion.div
              key="opened-letter"
              initial={{ scale: 0.85, opacity: 0, y: 30 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              transition={{ duration: 0.9, ease: [0.16, 1, 0.3, 1] }}
              className="relative max-w-xl w-full p-8 sm:p-12 rounded-[32px] bg-gradient-to-b from-[#fffef5] via-[#fffbf0] to-[#fef8e6] text-[#2c1d11] shadow-[0_25px_70px_rgba(0,0,0,0.8)] border-4 border-amber-400/80 text-left relative overflow-hidden"
            >
              {/* Parchment Vintage Watermark & Edge Tint */}
              <div className="absolute top-0 right-0 p-4 opacity-15 pointer-events-none font-serif text-6xl text-amber-700">
                🪔
              </div>
              <div className="absolute inset-0 pointer-events-none bg-[radial-gradient(ellipse_at_center,transparent_60%,rgba(180,120,40,0.12)_100%)]" />

              {/* Decorative Header flourish */}
              <div className="flex items-center justify-between border-b border-amber-900/15 pb-4 mb-6">
                <div className="flex items-center gap-2 text-rose-700">
                  <Heart className="w-5 h-5 fill-rose-600 animate-pulse" />
                  <span className="font-handwritten text-2xl font-bold">Deepavali Smriti</span>
                </div>
                <div className="text-xs font-serif text-amber-900/60 uppercase tracking-widest">
                  A Friend's Letter
                </div>
              </div>

              {/* Exact Letter Content */}
              <div className="space-y-4 font-sans text-sm sm:text-base text-[#382618] leading-relaxed">
                <p className="font-serif text-xl sm:text-2xl font-bold text-amber-950 flex items-center gap-2">
                  Hey, you! <Heart className="w-5 h-5 text-rose-600 fill-rose-600 inline" />
                </p>

                <p>
                  I just wanted to send you something a little different this Diwali.
                </p>

                <p>
                  I hope your life is always filled with beautiful moments, unexpected happiness, genuine smiles, and dreams that come true.
                </p>

                <p className="font-medium text-amber-900">
                  Even on difficult days, I hope you find a reason to smile.
                </p>

                <p>
                  You deserve kindness, happiness, success, and all the beautiful things this world has to offer.
                </p>

                <p className="font-semibold text-rose-900">
                  Never lose that special spark that makes you YOU.
                </p>

                <p>
                  Sending lots of positive vibes and warm wishes your way.
                </p>

                <p className="font-serif text-xl font-bold text-amber-800 pt-2">
                  Happy Diwali! 🪔✨
                </p>
              </div>

              {/* Closing footer */}
              <div className="mt-8 pt-4 border-t border-amber-900/15 text-center">
                <p className="font-handwritten text-xl sm:text-2xl text-rose-800 font-semibold">
                  "{SECRET_LETTER.closing}"
                </p>
              </div>

              {/* Floating golden sparkle accents around letter */}
              <div className="absolute top-2 right-2 text-amber-500 animate-spin" style={{ animationDuration: '8s' }}>
                <Sparkles className="w-4 h-4" />
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Advance to Final Surprise */}
      {isOpen && onNextSection && (
        <motion.div
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.5 }}
          className="mt-6"
        >
          <button
            onClick={onNextSection}
            className="inline-flex items-center gap-2 text-xs font-serif text-amber-300 hover:text-white transition-colors bg-black/50 hover:bg-black/70 px-6 py-2.5 rounded-full border border-amber-400/40 shadow-lg"
          >
            <span>Continue to the Final Moment...</span>
            <ArrowDown className="w-3.5 h-3.5" />
          </button>
        </motion.div>
      )}
    </section>
  );
};

