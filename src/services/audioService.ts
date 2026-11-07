// Advanced Web Audio API Sound Engine & Procedural Indian Ambient Music Generator
// Completely self-contained: works offline, zero network dependencies, 0ms latency, zero 404s.

import { AudioSettings } from '../types';

class DiwaliAudioEngine {
  private ctx: AudioContext | null = null;
  private musicGain: GainNode | null = null;
  private sfxGain: GainNode | null = null;
  private masterGain: GainNode | null = null;

  // Music state
  private isMusicPlaying = false;
  private droneOscillators: OscillatorNode[] = [];
  private melodyTimer: number | null = null;
  private ambientFireworkTimer: number | null = null;

  // Settings
  private settings: AudioSettings = {
    musicEnabled: true,
    sfxEnabled: true,
    musicVolume: 0.6,
    sfxVolume: 0.75,
  };

  private isInitialized = false;

  constructor() {
    // Load persisted settings if available
    try {
      const saved = localStorage.getItem('diwali_audio_settings');
      if (saved) {
        this.settings = { ...this.settings, ...JSON.parse(saved) };
      }
    } catch (e) {
      // ignore
    }
  }

  // Must be called upon user interaction to unlock Web Audio in modern browsers
  public init() {
    if (this.isInitialized && this.ctx && this.ctx.state === 'running') return;

    try {
      const AudioCtx = window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
      this.ctx = new AudioCtx();

      // Master output
      this.masterGain = this.ctx.createGain();
      this.masterGain.gain.setValueAtTime(1.0, this.ctx.currentTime);
      this.masterGain.connect(this.ctx.destination);

      // Music sub-bus
      this.musicGain = this.ctx.createGain();
      this.musicGain.gain.setValueAtTime(this.settings.musicEnabled ? this.settings.musicVolume : 0, this.ctx.currentTime);
      this.musicGain.connect(this.masterGain);

      // SFX sub-bus
      this.sfxGain = this.ctx.createGain();
      this.sfxGain.gain.setValueAtTime(this.settings.sfxEnabled ? this.settings.sfxVolume : 0, this.ctx.currentTime);
      this.sfxGain.connect(this.masterGain);

      this.isInitialized = true;

      // Resume context if suspended
      if (this.ctx.state === 'suspended') {
        this.ctx.resume();
      }

      // If music is enabled, start gentle ambient Indian music
      if (this.settings.musicEnabled) {
        this.startBackgroundMusic();
      }
    } catch (err) {
      console.warn('Web Audio initialization error:', err);
    }
  }

  public getSettings(): AudioSettings {
    return { ...this.settings };
  }

  public updateSettings(partial: Partial<AudioSettings>) {
    this.settings = { ...this.settings, ...partial };
    try {
      localStorage.setItem('diwali_audio_settings', JSON.stringify(this.settings));
    } catch (e) {
      // ignore
    }

    if (!this.ctx) return;

    if (this.musicGain) {
      const targetGain = this.settings.musicEnabled ? this.settings.musicVolume : 0;
      this.musicGain.gain.setTargetAtTime(targetGain, this.ctx.currentTime, 0.1);
    }

    if (this.sfxGain) {
      const targetGain = this.settings.sfxEnabled ? this.settings.sfxVolume : 0;
      this.sfxGain.gain.setTargetAtTime(targetGain, this.ctx.currentTime, 0.05);
    }

    if (this.settings.musicEnabled && !this.isMusicPlaying) {
      this.startBackgroundMusic();
    } else if (!this.settings.musicEnabled && this.isMusicPlaying) {
      this.stopBackgroundMusic();
    }
  }

  public toggleMusic(): boolean {
    this.init();
    const next = !this.settings.musicEnabled;
    this.updateSettings({ musicEnabled: next });
    return next;
  }

  public toggleSFX(): boolean {
    this.init();
    const next = !this.settings.sfxEnabled;
    this.updateSettings({ sfxEnabled: next });
    return next;
  }

  // ==========================================
  // PROCEDURAL INDIAN AMBIENT MUSIC GENERATOR
  // (Tanpura Drone + Bansuri / Sitar Raag Yaman / Bhupali Harmonics)
  // ==========================================
  private startBackgroundMusic() {
    if (!this.ctx || this.isMusicPlaying) return;
    this.isMusicPlaying = true;

    // 1. Tanpura continuous meditative drone (Fundamental: D3 = 146.83Hz, Pa: A3 = 220Hz)
    const baseFreq = 146.83; // D3
    const droneFreqs = [baseFreq, baseFreq * 1.5, baseFreq * 2, baseFreq * 0.5]; // Sa, Pa, Sa', Kharaj

    droneFreqs.forEach((freq, idx) => {
      if (!this.ctx || !this.musicGain) return;
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();
      const filter = this.ctx.createBiquadFilter();

      osc.type = idx % 2 === 0 ? 'triangle' : 'sawtooth';
      osc.frequency.setValueAtTime(freq, this.ctx.currentTime);

      // Low pass to keep it silky smooth & warm
      filter.type = 'lowpass';
      filter.frequency.setValueAtTime(450 + idx * 80, this.ctx.currentTime);
      filter.Q.setValueAtTime(2.0, this.ctx.currentTime);

      // Gentle LFO for natural acoustic swell
      const lfo = this.ctx.createOscillator();
      const lfoGain = this.ctx.createGain();
      lfo.frequency.setValueAtTime(0.12 + idx * 0.05, this.ctx.currentTime);
      lfoGain.gain.setValueAtTime(0.04, this.ctx.currentTime);
      lfo.connect(lfoGain);

      gain.gain.setValueAtTime(0.04 / (idx + 1), this.ctx.currentTime);
      lfoGain.connect(gain.gain);

      osc.connect(filter);
      filter.connect(gain);
      gain.connect(this.musicGain);

      osc.start();
      lfo.start();
      this.droneOscillators.push(osc);
    });

    // 2. Meditative Indian Raag Yaman/Bhupali melody sequence generator
    // Notes in Raag Bhupali: D4 (293.66), E4 (329.63), F#4 (369.99), A4 (440.00), B4 (493.88), D5 (587.33), E5 (659.25)
    const raagNotes = [293.66, 329.63, 369.99, 440.00, 493.88, 587.33, 659.25, 739.99];

    let noteIndex = 0;
    const playNextMelodyNote = () => {
      if (!this.isMusicPlaying || !this.ctx || !this.musicGain) return;

      // Pick next note with gentle wandering behavior
      const step = Math.random() > 0.6 ? (Math.random() > 0.5 ? 1 : -1) : 0;
      noteIndex = Math.max(0, Math.min(raagNotes.length - 1, noteIndex + step));
      const freq = raagNotes[noteIndex];

      const duration = 2.2 + Math.random() * 2.0;
      this.playFluteTone(freq, duration);

      // Occasional gentle temple chime or bell harmonic
      if (Math.random() > 0.65) {
        this.playTempleChime(freq * (Math.random() > 0.5 ? 2 : 1.5));
      }

      // Next interval
      const nextTime = 2200 + Math.random() * 3200;
      this.melodyTimer = window.setTimeout(playNextMelodyNote, nextTime);
    };

    // Start melody after a gentle pause
    this.melodyTimer = window.setTimeout(playNextMelodyNote, 1000);

    // 3. Gentle distant fireworks background murmur
    const playAmbientDistantBurst = () => {
      if (!this.isMusicPlaying) return;
      if (Math.random() > 0.4) {
        this.playDistantCracker();
      }
      this.ambientFireworkTimer = window.setTimeout(playAmbientDistantBurst, 4000 + Math.random() * 6000);
    };
    this.ambientFireworkTimer = window.setTimeout(playAmbientDistantBurst, 5000);
  }

  private stopBackgroundMusic() {
    this.isMusicPlaying = false;
    if (this.melodyTimer) clearTimeout(this.melodyTimer);
    if (this.ambientFireworkTimer) clearTimeout(this.ambientFireworkTimer);

    this.droneOscillators.forEach((osc) => {
      try {
        osc.stop();
        osc.disconnect();
      } catch (e) {
        // ignore
      }
    });
    this.droneOscillators = [];
  }

  // Melodic flute voice (warm sine + gentle overtones + breath vibrato)
  private playFluteTone(freq: number, duration: number) {
    if (!this.ctx || !this.musicGain || !this.settings.musicEnabled) return;
    const t0 = this.ctx.currentTime;

    const osc = this.ctx.createOscillator();
    const oscHarmonic = this.ctx.createOscillator();
    const filter = this.ctx.createBiquadFilter();
    const gain = this.ctx.createGain();

    osc.type = 'sine';
    osc.frequency.setValueAtTime(freq, t0);

    // Subtle breath vibrato
    const vibrato = this.ctx.createOscillator();
    const vibratoGain = this.ctx.createGain();
    vibrato.frequency.setValueAtTime(4.8, t0);
    vibratoGain.gain.setValueAtTime(2.2, t0);
    vibrato.connect(osc.frequency);
    vibrato.start(t0 + 0.3);

    oscHarmonic.type = 'triangle';
    oscHarmonic.frequency.setValueAtTime(freq * 2, t0);

    filter.type = 'lowpass';
    filter.frequency.setValueAtTime(freq * 3, t0);

    gain.gain.setValueAtTime(0.0001, t0);
    // Soft attack
    gain.gain.exponentialRampToValueAtTime(0.09, t0 + 0.7);
    // Smooth sustain & decay
    gain.gain.exponentialRampToValueAtTime(0.0001, t0 + duration);

    osc.connect(filter);
    oscHarmonic.connect(filter);
    filter.connect(gain);
    gain.connect(this.musicGain);

    osc.start(t0);
    oscHarmonic.start(t0);
    osc.stop(t0 + duration);
    oscHarmonic.stop(t0 + duration);
    vibrato.stop(t0 + duration);
  }

  // High peaceful temple chime
  private playTempleChime(freq: number) {
    if (!this.ctx || !this.musicGain || !this.settings.musicEnabled) return;
    const t0 = this.ctx.currentTime;

    const osc = this.ctx.createOscillator();
    const gain = this.ctx.createGain();
    osc.type = 'sine';
    osc.frequency.setValueAtTime(freq, t0);

    gain.gain.setValueAtTime(0.05, t0);
    gain.gain.exponentialRampToValueAtTime(0.00001, t0 + 2.5);

    osc.connect(gain);
    gain.connect(this.musicGain);

    osc.start(t0);
    osc.stop(t0 + 2.5);
  }

  // ==========================================
  // SFX: REALISTIC DIWALI SOUND EFFECTS
  // ==========================================

  // 1. Distant fireworks background boom
  public playDistantCracker() {
    if (!this.ctx || !this.sfxGain || !this.settings.sfxEnabled) return;
    const t0 = this.ctx.currentTime;

    // Filtered noise buffer
    const bufferSize = this.ctx.sampleRate * 0.8;
    const buffer = this.ctx.createBuffer(1, bufferSize, this.ctx.sampleRate);
    const data = buffer.getChannelData(0);
    for (let i = 0; i < bufferSize; i++) {
      data[i] = (Math.random() * 2 - 1) * Math.exp(-i / (bufferSize * 0.3));
    }

    const noise = this.ctx.createBufferSource();
    noise.buffer = buffer;

    const filter = this.ctx.createBiquadFilter();
    filter.type = 'lowpass';
    filter.frequency.setValueAtTime(140, t0);
    filter.frequency.exponentialRampToValueAtTime(60, t0 + 0.7);

    const gain = this.ctx.createGain();
    gain.gain.setValueAtTime(0.2, t0);
    gain.gain.exponentialRampToValueAtTime(0.001, t0 + 0.8);

    noise.connect(filter);
    filter.connect(gain);
    gain.connect(this.sfxGain);

    noise.start(t0);
  }

  // 2. Soft cracker bursting sound
  public playSoftCracker() {
    if (!this.ctx || !this.sfxGain || !this.settings.sfxEnabled) return;
    const t0 = this.ctx.currentTime;

    const bufferSize = Math.floor(this.ctx.sampleRate * 0.35);
    const buffer = this.ctx.createBuffer(1, bufferSize, this.ctx.sampleRate);
    const data = buffer.getChannelData(0);
    for (let i = 0; i < bufferSize; i++) {
      data[i] = (Math.random() * 2 - 1) * Math.pow(1 - i / bufferSize, 3);
    }

    const noise = this.ctx.createBufferSource();
    noise.buffer = buffer;

    const filter = this.ctx.createBiquadFilter();
    filter.type = 'bandpass';
    filter.frequency.setValueAtTime(600, t0);
    filter.Q.setValueAtTime(1.5, t0);

    const gain = this.ctx.createGain();
    gain.gain.setValueAtTime(0.4, t0);
    gain.gain.exponentialRampToValueAtTime(0.001, t0 + 0.3);

    noise.connect(filter);
    filter.connect(gain);
    gain.connect(this.sfxGain);

    noise.start(t0);
  }

  // 3. Full Aerial Firework Launch & Explosion (Whoosh -> Boom -> Crackle)
  public playFireworkExplosion(options?: { pitch?: number; grand?: boolean }) {
    if (!this.ctx || !this.sfxGain || !this.settings.sfxEnabled) return;
    const t0 = this.ctx.currentTime;
    const pitch = options?.pitch || 1.0;
    const isGrand = options?.grand || false;

    // Sub-bass thud (thump)
    const osc = this.ctx.createOscillator();
    const oscGain = this.ctx.createGain();
    osc.type = 'sine';
    osc.frequency.setValueAtTime(180 * pitch, t0);
    osc.frequency.exponentialRampToValueAtTime(35 * pitch, t0 + 0.45);

    oscGain.gain.setValueAtTime(isGrand ? 0.7 : 0.45, t0);
    oscGain.gain.exponentialRampToValueAtTime(0.001, t0 + 0.5);

    osc.connect(oscGain);
    oscGain.connect(this.sfxGain);
    osc.start(t0);
    osc.stop(t0 + 0.55);

    // Crackle burst noise
    const duration = isGrand ? 1.6 : 1.1;
    const bufferSize = Math.floor(this.ctx.sampleRate * duration);
    const buffer = this.ctx.createBuffer(1, bufferSize, this.ctx.sampleRate);
    const data = buffer.getChannelData(0);

    for (let i = 0; i < bufferSize; i++) {
      // Crackle spikes
      const envelope = Math.exp(-i / (bufferSize * 0.35));
      const crackle = Math.random() > 0.94 ? (Math.random() * 2 - 1) * 2.5 : (Math.random() * 2 - 1) * 0.4;
      data[i] = crackle * envelope;
    }

    const noise = this.ctx.createBufferSource();
    noise.buffer = buffer;

    const filter = this.ctx.createBiquadFilter();
    filter.type = 'lowpass';
    filter.frequency.setValueAtTime(1200 * pitch, t0);
    filter.frequency.exponentialRampToValueAtTime(300, t0 + duration);

    const noiseGain = this.ctx.createGain();
    noiseGain.gain.setValueAtTime(isGrand ? 0.6 : 0.4, t0);
    noiseGain.gain.exponentialRampToValueAtTime(0.001, t0 + duration);

    noise.connect(filter);
    filter.connect(noiseGain);
    noiseGain.connect(this.sfxGain);
    noise.start(t0);

    // Sparkling sizzle trail
    if (isGrand || Math.random() > 0.4) {
      this.playSparkleSizzle(t0 + 0.15, duration * 0.8);
    }
  }

  // Sparkling sizzle trail
  private playSparkleSizzle(startTime: number, duration: number) {
    if (!this.ctx || !this.sfxGain) return;
    const bufferSize = Math.floor(this.ctx.sampleRate * duration);
    const buffer = this.ctx.createBuffer(1, bufferSize, this.ctx.sampleRate);
    const data = buffer.getChannelData(0);

    for (let i = 0; i < bufferSize; i++) {
      data[i] = (Math.random() > 0.88 ? 1 : -1) * Math.random() * Math.exp(-i / (bufferSize * 0.5));
    }

    const source = this.ctx.createBufferSource();
    source.buffer = buffer;

    const highPass = this.ctx.createBiquadFilter();
    highPass.type = 'highpass';
    highPass.frequency.setValueAtTime(3200, startTime);

    const gain = this.ctx.createGain();
    gain.gain.setValueAtTime(0.18, startTime);
    gain.gain.exponentialRampToValueAtTime(0.001, startTime + duration);

    source.connect(highPass);
    highPass.connect(gain);
    gain.connect(this.sfxGain);

    source.start(startTime);
  }

  // 4. Gentle sparkling / chimes sound (for wishes, clicks, stars)
  public playSparkle() {
    if (!this.ctx || !this.sfxGain || !this.settings.sfxEnabled) return;
    const t0 = this.ctx.currentTime;
    const freqs = [880, 1108, 1320, 1760, 2217]; // Pentatonic shimmer

    freqs.forEach((f, idx) => {
      if (!this.ctx || !this.sfxGain) return;
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();

      osc.type = 'sine';
      osc.frequency.setValueAtTime(f, t0 + idx * 0.05);

      gain.gain.setValueAtTime(0.0001, t0 + idx * 0.05);
      gain.gain.linearRampToValueAtTime(0.07, t0 + idx * 0.05 + 0.02);
      gain.gain.exponentialRampToValueAtTime(0.0001, t0 + idx * 0.05 + 0.8);

      osc.connect(gain);
      gain.connect(this.sfxGain);

      osc.start(t0 + idx * 0.05);
      osc.stop(t0 + idx * 0.05 + 0.85);
    });
  }

  // 5. Diya Lighting Sound (warm ignite whoosh + golden tone)
  public playDiyaLight() {
    if (!this.ctx || !this.sfxGain || !this.settings.sfxEnabled) return;
    const t0 = this.ctx.currentTime;

    // Warm resonant ignite whoosh
    const osc = this.ctx.createOscillator();
    const gain = this.ctx.createGain();
    osc.type = 'triangle';
    osc.frequency.setValueAtTime(220, t0);
    osc.frequency.exponentialRampToValueAtTime(440, t0 + 0.35);

    gain.gain.setValueAtTime(0.001, t0);
    gain.gain.exponentialRampToValueAtTime(0.22, t0 + 0.1);
    gain.gain.exponentialRampToValueAtTime(0.0001, t0 + 0.6);

    osc.connect(gain);
    gain.connect(this.sfxGain);

    osc.start(t0);
    osc.stop(t0 + 0.65);

    // Accompanying tiny golden chime
    this.playSparkle();
  }

  // 6. Magical transition / Secret letter opening sound
  public playMagicReveal() {
    if (!this.ctx || !this.sfxGain || !this.settings.sfxEnabled) return;
    const t0 = this.ctx.currentTime;

    // Glissando / Harp flourish
    const chord = [440, 554.37, 659.25, 830.61, 880, 1108.73, 1318.51, 1661.22];
    chord.forEach((freq, idx) => {
      if (!this.ctx || !this.sfxGain) return;
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();

      osc.type = 'triangle';
      osc.frequency.setValueAtTime(freq, t0 + idx * 0.06);

      gain.gain.setValueAtTime(0.001, t0 + idx * 0.06);
      gain.gain.linearRampToValueAtTime(0.12, t0 + idx * 0.06 + 0.03);
      gain.gain.exponentialRampToValueAtTime(0.0001, t0 + idx * 0.06 + 1.2);

      osc.connect(gain);
      gain.connect(this.sfxGain);

      osc.start(t0 + idx * 0.06);
      osc.stop(t0 + idx * 0.06 + 1.3);
    });
  }

  // Soft typewriter key tap for the letter typing
  public playTypewriterTap() {
    if (!this.ctx || !this.sfxGain || !this.settings.sfxEnabled) return;
    const t0 = this.ctx.currentTime;

    const osc = this.ctx.createOscillator();
    const gain = this.ctx.createGain();
    osc.type = 'sine';
    osc.frequency.setValueAtTime(1400 + Math.random() * 400, t0);

    gain.gain.setValueAtTime(0.025, t0);
    gain.gain.exponentialRampToValueAtTime(0.0001, t0 + 0.04);

    osc.connect(gain);
    gain.connect(this.sfxGain);

    osc.start(t0);
    osc.stop(t0 + 0.05);
  }

  // 7. Grand fireworks celebration sound for the final surprise
  public playGrandCelebration() {
    if (!this.ctx || !this.sfxGain || !this.settings.sfxEnabled) return;

    // Burst a fanfare sequence over 4 seconds
    this.playMagicReveal();
    this.playFireworkExplosion({ grand: true });

    setTimeout(() => this.playFireworkExplosion({ pitch: 1.2 }), 400);
    setTimeout(() => this.playFireworkExplosion({ pitch: 0.9, grand: true }), 900);
    setTimeout(() => this.playSparkle(), 1400);
    setTimeout(() => this.playFireworkExplosion({ pitch: 1.3 }), 1800);
    setTimeout(() => this.playFireworkExplosion({ pitch: 1.0, grand: true }), 2400);
    setTimeout(() => this.playSparkle(), 3000);
  }
}

export const audioService = new DiwaliAudioEngine();

