export type SectionId = 
  | 'welcome'
  | 'fireworks'
  | 'wishes'
  | 'diyas'
  | 'secret-letter'
  | 'final-surprise';

export interface Wish {
  id: number;
  text: string;
  theme?: string;
  highlight?: string;
}

export interface AudioSettings {
  musicEnabled: boolean;
  sfxEnabled: boolean;
  musicVolume: number;
  sfxVolume: number;
}

export interface DiyaItem {
  id: number;
  label: string;
  isLit: boolean;
  intensity: number; // 1 to 3
  x: number; // percentage
  y: number; // percentage
}

export interface FireworkParticle {
  x: number;
  y: number;
  vx: number;
  vy: number;
  alpha: number;
  color: string;
  decay: number;
  size: number;
  flicker: boolean;
  gravity: number;
  resistance: number;
}

