import React from 'react';
import { Sparkles, Flame, Mail, Heart, Home, Gift } from 'lucide-react';
import { SectionId } from '../types';

interface JourneyProgressProps {
  currentSection: SectionId;
  onSelectSection: (section: SectionId) => void;
}

const STAGES: { id: SectionId; label: string; icon: React.ReactNode }[] = [
  { id: 'welcome', label: 'Welcome', icon: <Home className="w-3.5 h-3.5" /> },
  { id: 'fireworks', label: 'Fireworks Sky', icon: <Sparkles className="w-3.5 h-3.5" /> },
  { id: 'wishes', label: 'Wishes', icon: <Heart className="w-3.5 h-3.5" /> },
  { id: 'diyas', label: 'Sacred Diyas', icon: <Flame className="w-3.5 h-3.5" /> },
  { id: 'secret-letter', label: 'Secret Letter', icon: <Mail className="w-3.5 h-3.5" /> },
  { id: 'final-surprise', label: 'Final Surprise', icon: <Gift className="w-3.5 h-3.5" /> },
];

export const JourneyProgress: React.FC<JourneyProgressProps> = ({
  currentSection,
  onSelectSection,
}) => {
  const currentIndex = STAGES.findIndex((s) => s.id === currentSection);

  return (
    <div className="fixed bottom-4 left-1/2 -translate-x-1/2 z-40 max-w-[95vw] px-3 py-1.5 rounded-full magic-glass-bright border border-amber-400/40 shadow-2xl backdrop-blur-xl flex items-center gap-1 sm:gap-2">
      {STAGES.map((stage, idx) => {
        const isActive = stage.id === currentSection;
        const isPast = idx < currentIndex;

        return (
          <button
            key={stage.id}
            onClick={() => onSelectSection(stage.id)}
            title={stage.label}
            className={`flex items-center gap-1.5 px-2.5 sm:px-3 py-1.5 rounded-full text-[11px] sm:text-xs font-serif transition-all duration-300 ${
              isActive
                ? 'bg-amber-400 text-slate-950 font-bold shadow-lg shadow-amber-400/30 scale-105'
                : isPast
                ? 'text-amber-300/80 hover:text-amber-200 hover:bg-amber-500/10'
                : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/40'
            }`}
          >
            {stage.icon}
            <span className="hidden md:inline">{stage.label}</span>
          </button>
        );
      })}
    </div>
  );
};

