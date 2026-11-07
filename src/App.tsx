import React, { useState, useRef, useEffect } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { SectionId } from './types';
import { DEFAULT_FRIEND_NAME } from './data/diwaliContent';
import { FireworksCanvas, FireworksCanvasHandle } from './components/FireworksCanvas';
import { FloatingParticles } from './components/FloatingParticles';
import { AudioControls } from './components/AudioControls';
import { JourneyProgress } from './components/JourneyProgress';
import { WelcomeScreen } from './components/WelcomeScreen';
import { FireworksScene } from './components/FireworksScene';
import { DiwaliWishes } from './components/DiwaliWishes';
import { InteractiveDiyas } from './components/InteractiveDiyas';
import { SecretMessage } from './components/SecretMessage';
import { FinalSurprise } from './components/FinalSurprise';
import { audioService } from './services/audioService';

export function App() {
  const [currentSection, setCurrentSection] = useState<SectionId>('welcome');
  const [friendName, setFriendName] = useState<string>(() => {
    // Check URL parameters for ?name=...
    try {
      const params = new URLSearchParams(window.location.search);
      const nameParam = params.get('name');
      if (nameParam && nameParam.trim()) {
        return nameParam.trim();
      }
      const saved = localStorage.getItem('diwali_friend_name');
      if (saved && saved.trim()) {
        return saved.trim();
      }
    } catch (e) {
      // ignore
    }
    return DEFAULT_FRIEND_NAME;
  });

  const canvasRef = useRef<FireworksCanvasHandle>(null);

  const handleUpdateName = (name: string) => {
    setFriendName(name);
    try {
      localStorage.setItem('diwali_friend_name', name);
      const url = new URL(window.location.href);
      url.searchParams.set('name', name);
      window.history.replaceState({}, '', url.toString());
    } catch (e) {
      // ignore
    }
  };

  const handleSelectSection = (section: SectionId) => {
    audioService.init();
    audioService.playSparkle();
    setCurrentSection(section);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <main className="relative min-h-screen w-full bg-[#050816] text-white overflow-x-hidden selection:bg-amber-400/30 selection:text-amber-200">
      {/* Background Floating Canvas & Atmospheric Particles */}
      <FloatingParticles />
      <FireworksCanvas ref={canvasRef} interactive={true} />

      {/* Floating Audio Controls in Top-Right */}
      <AudioControls />

      {/* Journey Navigation Indicator at Bottom */}
      <JourneyProgress
        currentSection={currentSection}
        onSelectSection={handleSelectSection}
      />

      {/* Main Section Screens with Cinematic Transitions */}
      <AnimatePresence mode="wait">
        {currentSection === 'welcome' && (
          <motion.div
            key="welcome"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0, filter: 'blur(8px)', scale: 1.02 }}
            transition={{ duration: 0.7 }}
            className="w-full"
          >
            <WelcomeScreen
              friendName={friendName}
              onUpdateName={handleUpdateName}
              onOpenSurprise={() => handleSelectSection('fireworks')}
            />
          </motion.div>
        )}

        {currentSection === 'fireworks' && (
          <motion.div
            key="fireworks"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, filter: 'blur(8px)', scale: 0.98 }}
            transition={{ duration: 0.7 }}
            className="w-full"
          >
            <FireworksScene
              canvasRef={canvasRef}
              onNextSection={() => handleSelectSection('wishes')}
            />
          </motion.div>
        )}

        {currentSection === 'wishes' && (
          <motion.div
            key="wishes"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, filter: 'blur(8px)', scale: 0.98 }}
            transition={{ duration: 0.7 }}
            className="w-full"
          >
            <DiwaliWishes
              onNextSection={() => handleSelectSection('diyas')}
            />
          </motion.div>
        )}

        {currentSection === 'diyas' && (
          <motion.div
            key="diyas"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, filter: 'blur(8px)', scale: 0.98 }}
            transition={{ duration: 0.7 }}
            className="w-full"
          >
            <InteractiveDiyas
              onNextSection={() => handleSelectSection('secret-letter')}
            />
          </motion.div>
        )}

        {currentSection === 'secret-letter' && (
          <motion.div
            key="secret-letter"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, filter: 'blur(8px)', scale: 0.98 }}
            transition={{ duration: 0.7 }}
            className="w-full"
          >
            <SecretMessage
              onNextSection={() => handleSelectSection('final-surprise')}
            />
          </motion.div>
        )}

        {currentSection === 'final-surprise' && (
          <motion.div
            key="final-surprise"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, filter: 'blur(8px)', scale: 0.98 }}
            transition={{ duration: 0.7 }}
            className="w-full"
          >
            <FinalSurprise
              canvasRef={canvasRef}
              friendName={friendName}
              onRestartJourney={() => handleSelectSection('welcome')}
            />
          </motion.div>
        )}
      </AnimatePresence>
    </main>
  );
}

export default App;

