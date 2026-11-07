import React, { useState, useEffect } from 'react';
import { Volume2, VolumeX, Music, Bell, BellOff, Settings2, Sparkles } from 'lucide-react';
import { audioService } from '../services/audioService';
import { AudioSettings } from '../types';

export const AudioControls: React.FC = () => {
  const [settings, setSettings] = useState<AudioSettings>(audioService.getSettings());
  const [isOpen, setIsOpen] = useState(false);
  const [hasInteracted, setHasInteracted] = useState(false);

  useEffect(() => {
    const handleFirstInteraction = () => {
      if (!hasInteracted) {
        audioService.init();
        setHasInteracted(true);
      }
    };

    window.addEventListener('click', handleFirstInteraction, { once: true });
    window.addEventListener('touchstart', handleFirstInteraction, { once: true });

    return () => {
      window.removeEventListener('click', handleFirstInteraction);
      window.removeEventListener('touchstart', handleFirstInteraction);
    };
  }, [hasInteracted]);

  const toggleMusic = (e: React.MouseEvent) => {
    e.stopPropagation();
    const next = audioService.toggleMusic();
    setSettings((prev) => ({ ...prev, musicEnabled: next }));
    if (!hasInteracted) setHasInteracted(true);
  };

  const toggleSFX = (e: React.MouseEvent) => {
    e.stopPropagation();
    const next = audioService.toggleSFX();
    setSettings((prev) => ({ ...prev, sfxEnabled: next }));
    if (!hasInteracted) setHasInteracted(true);
    if (next) audioService.playSparkle();
  };

  const handleMusicVolume = (val: number) => {
    audioService.updateSettings({ musicVolume: val });
    setSettings((prev) => ({ ...prev, musicVolume: val }));
  };

  const handleSfxVolume = (val: number) => {
    audioService.updateSettings({ sfxVolume: val });
    setSettings((prev) => ({ ...prev, sfxVolume: val }));
  };

  return (
    <div className="fixed top-4 right-4 z-50 flex items-center gap-2">
      {/* Quick Music Toggle Button */}
      <button
        onClick={toggleMusic}
        title={settings.musicEnabled ? "Mute Background Music" : "Play Background Music"}
        className={`flex items-center gap-1.5 px-3 py-2 rounded-full text-xs font-medium transition-all duration-300 shadow-lg ${
          settings.musicEnabled
            ? 'bg-amber-500/20 text-amber-300 border border-amber-400/50 shadow-amber-500/20 hover:bg-amber-500/30'
            : 'bg-slate-900/80 text-slate-400 border border-slate-700/60 hover:bg-slate-800'
        } backdrop-blur-md`}
      >
        <Music className={`w-3.5 h-3.5 ${settings.musicEnabled ? 'animate-spin' : ''}`} style={{ animationDuration: '6s' }} />
        <span className="hidden sm:inline">{settings.musicEnabled ? 'Music On' : 'Music Off'}</span>
      </button>

      {/* Quick SFX Toggle Button */}
      <button
        onClick={toggleSFX}
        title={settings.sfxEnabled ? "Mute Sound Effects" : "Enable Sound Effects"}
        className={`flex items-center gap-1.5 px-3 py-2 rounded-full text-xs font-medium transition-all duration-300 shadow-lg ${
          settings.sfxEnabled
            ? 'bg-amber-500/20 text-amber-300 border border-amber-400/50 shadow-amber-500/20 hover:bg-amber-500/30'
            : 'bg-slate-900/80 text-slate-400 border border-slate-700/60 hover:bg-slate-800'
        } backdrop-blur-md`}
      >
        {settings.sfxEnabled ? <Bell className="w-3.5 h-3.5 text-amber-300" /> : <BellOff className="w-3.5 h-3.5" />}
        <span className="hidden sm:inline">{settings.sfxEnabled ? 'SFX On' : 'SFX Off'}</span>
      </button>

      {/* Settings Panel Trigger */}
      <div className="relative">
        <button
          onClick={() => setIsOpen(!isOpen)}
          title="Audio Settings"
          className="p-2 rounded-full bg-slate-950/80 border border-amber-500/30 text-amber-400 hover:text-amber-200 hover:border-amber-400 backdrop-blur-md shadow-lg transition-all"
        >
          <Settings2 className="w-4 h-4" />
        </button>

        {/* Floating Volume Dropdown Modal */}
        {isOpen && (
          <div className="absolute right-0 mt-3 w-64 p-4 rounded-2xl magic-glass-bright text-white shadow-2xl border border-amber-400/30 animate-in fade-in zoom-in-95 duration-200">
            <div className="flex items-center justify-between pb-3 border-b border-amber-500/20 mb-3">
              <span className="text-sm font-serif font-bold text-amber-300 flex items-center gap-1.5">
                <Sparkles className="w-3.5 h-3.5 text-amber-400" /> Audio Settings
              </span>
              <button
                onClick={() => setIsOpen(false)}
                className="text-xs text-amber-200/60 hover:text-white"
              >
                ✕
              </button>
            </div>

            {/* Music Volume */}
            <div className="mb-4">
              <div className="flex justify-between text-xs mb-1">
                <span className="text-amber-100 flex items-center gap-1">
                  <Music className="w-3 h-3 text-amber-400" /> Music Volume
                </span>
                <span className="text-amber-300 font-mono">{Math.round(settings.musicVolume * 100)}%</span>
              </div>
              <input
                type="range"
                min="0"
                max="1"
                step="0.05"
                value={settings.musicVolume}
                onChange={(e) => handleMusicVolume(parseFloat(e.target.value))}
                className="w-full accent-amber-400 h-1.5 bg-slate-800 rounded-lg cursor-pointer"
              />
            </div>

            {/* SFX Volume */}
            <div className="mb-2">
              <div className="flex justify-between text-xs mb-1">
                <span className="text-amber-100 flex items-center gap-1">
                  <Bell className="w-3 h-3 text-amber-400" /> SFX Volume
                </span>
                <span className="text-amber-300 font-mono">{Math.round(settings.sfxVolume * 100)}%</span>
              </div>
              <input
                type="range"
                min="0"
                max="1"
                step="0.05"
                value={settings.sfxVolume}
                onChange={(e) => handleSfxVolume(parseFloat(e.target.value))}
                className="w-full accent-amber-400 h-1.5 bg-slate-800 rounded-lg cursor-pointer"
              />
            </div>

            <p className="text-[10px] text-amber-200/50 mt-3 pt-2 border-t border-amber-500/10 text-center">
              🎵 Peaceful Indian Sitar & Flute Harmonics
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

