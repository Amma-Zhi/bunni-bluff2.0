// Cute Web Audio API Synthesizer for SFX and Cheerful BGM

class SoundEngine {
  private ctx: AudioContext | null = null;
  private isMuted: boolean = false;
  private sfxEnabled: boolean = true;
  private bgmVolume: number = 0.8; // 0.0 to 1.0
  private bgmGain: GainNode | null = null;
  private bgmInterval: number | null = null;
  private isBgmPlaying: boolean = false;

  private initContext() {
    if (!this.ctx) {
      const AudioCtx = window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
      if (AudioCtx) {
        this.ctx = new AudioCtx();
      }
    }
    if (this.ctx && this.ctx.state === 'suspended') {
      this.ctx.resume();
    }
  }

  public setMuted(muted: boolean) {
    this.isMuted = muted;
  }

  public getMuted(): boolean {
    return this.isMuted;
  }

  public setSfxEnabled(enabled: boolean) {
    this.sfxEnabled = enabled;
  }

  public getSfxEnabled(): boolean {
    return this.sfxEnabled;
  }

  public setBgmVolume(volume: number) {
    // Accepts 0-1 or 0-100
    const val = volume > 1 ? volume / 100 : volume;
    this.bgmVolume = Math.max(0, Math.min(1, val));
    if (this.bgmVolume > 0 && !this.isBgmPlaying) {
      this.startBgm();
    }
  }

  public getBgmVolume(): number {
    return this.bgmVolume;
  }

  // Soft cute pop (for card select, button click)
  public playPop() {
    if (this.isMuted || !this.sfxEnabled) return;
    this.initContext();
    if (!this.ctx) return;

    try {
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();

      osc.type = 'sine';
      const now = this.ctx.currentTime;
      osc.frequency.setValueAtTime(400, now);
      osc.frequency.exponentialRampToValueAtTime(800, now + 0.08);

      gain.gain.setValueAtTime(0.15, now);
      gain.gain.exponentialRampToValueAtTime(0.001, now + 0.08);

      osc.connect(gain);
      gain.connect(this.ctx.destination);

      osc.start(now);
      osc.stop(now + 0.08);
    } catch {
      // Ignore audio errors
    }
  }

  // Play card sound (whoosh + flip)
  public playCardFlip() {
    if (this.isMuted || !this.sfxEnabled) return;
    this.initContext();
    if (!this.ctx) return;

    try {
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();
      const now = this.ctx.currentTime;

      osc.type = 'triangle';
      osc.frequency.setValueAtTime(250, now);
      osc.frequency.exponentialRampToValueAtTime(600, now + 0.12);

      gain.gain.setValueAtTime(0.2, now);
      gain.gain.exponentialRampToValueAtTime(0.001, now + 0.12);

      osc.connect(gain);
      gain.connect(this.ctx.destination);

      osc.start(now);
      osc.stop(now + 0.12);
    } catch {
      // Ignore
    }
  }

  // Score count up step chime
  public playScoreStep(stepIndex: number = 0) {
    if (this.isMuted || !this.sfxEnabled) return;
    this.initContext();
    if (!this.ctx) return;

    try {
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();
      const now = this.ctx.currentTime;

      // Pentatonic scale frequency
      const scale = [523.25, 587.33, 659.25, 783.99, 880.00, 1046.50, 1174.66, 1318.51];
      const freq = scale[stepIndex % scale.length];

      osc.type = 'sine';
      osc.frequency.setValueAtTime(freq, now);

      gain.gain.setValueAtTime(0.12, now);
      gain.gain.exponentialRampToValueAtTime(0.001, now + 0.15);

      osc.connect(gain);
      gain.connect(this.ctx.destination);

      osc.start(now);
      osc.stop(now + 0.15);
    } catch {
      // Ignore
    }
  }

  // Crisp "Pop & Sparkle" sound for card evaluation step
  public playCardScorePop(stepIndex: number = 0) {
    if (this.isMuted || !this.sfxEnabled) return;
    this.initContext();
    if (!this.ctx) return;

    try {
      const now = this.ctx.currentTime;

      // 1. Core punchy pop ("砰")
      const popOsc = this.ctx.createOscillator();
      const popGain = this.ctx.createGain();

      const basePopFreq = 350 + (stepIndex % 8) * 60;
      popOsc.type = 'sine';
      popOsc.frequency.setValueAtTime(basePopFreq, now);
      popOsc.frequency.exponentialRampToValueAtTime(basePopFreq * 2.2, now + 0.06);

      popGain.gain.setValueAtTime(0.22, now);
      popGain.gain.exponentialRampToValueAtTime(0.001, now + 0.08);

      popOsc.connect(popGain);
      popGain.connect(this.ctx.destination);

      popOsc.start(now);
      popOsc.stop(now + 0.08);

      // 2. High sparkle sheen tone ("闪烁")
      const sparkleOsc = this.ctx.createOscillator();
      const sparkleGain = this.ctx.createGain();

      const sparkleFreq = 1500 + (stepIndex % 8) * 180;
      sparkleOsc.type = 'triangle';
      sparkleOsc.frequency.setValueAtTime(sparkleFreq, now + 0.02);
      sparkleOsc.frequency.exponentialRampToValueAtTime(sparkleFreq * 1.3, now + 0.1);

      sparkleGain.gain.setValueAtTime(0.12, now + 0.02);
      sparkleGain.gain.exponentialRampToValueAtTime(0.001, now + 0.12);

      sparkleOsc.connect(sparkleGain);
      sparkleGain.connect(this.ctx.destination);

      sparkleOsc.start(now + 0.02);
      sparkleOsc.stop(now + 0.12);
    } catch {
      // Ignore
    }
  }

  // Grand crisp reward chime when hand calculation completes
  public playFinalRewardChime() {
    if (this.isMuted || !this.sfxEnabled) return;
    this.initContext();
    if (!this.ctx) return;

    try {
      const now = this.ctx.currentTime;
      // C major 9 arpeggio: C5, E5, G5, B5, C6, E6
      const arpeggio = [523.25, 659.25, 783.99, 987.77, 1046.50, 1318.51];

      // 1. Rapid sparkling arpeggio cascade
      arpeggio.forEach((freq, idx) => {
        if (!this.ctx) return;
        const osc = this.ctx.createOscillator();
        const gain = this.ctx.createGain();

        const delay = idx * 0.05;
        osc.type = 'triangle';
        osc.frequency.setValueAtTime(freq, now + delay);

        gain.gain.setValueAtTime(0.18, now + delay);
        gain.gain.exponentialRampToValueAtTime(0.001, now + delay + 0.25);

        osc.connect(gain);
        gain.connect(this.ctx.destination);

        osc.start(now + delay);
        osc.stop(now + delay + 0.25);
      });

      // 2. High resonant crystal bell finish
      const bellDelay = arpeggio.length * 0.05 + 0.02;
      const bellFreqs = [1046.50, 2093.00]; // C6 & C7 octave pair

      bellFreqs.forEach((freq, i) => {
        if (!this.ctx) return;
        const osc = this.ctx.createOscillator();
        const gain = this.ctx.createGain();

        osc.type = 'sine';
        osc.frequency.setValueAtTime(freq, now + bellDelay);

        const vol = i === 0 ? 0.22 : 0.12;
        gain.gain.setValueAtTime(vol, now + bellDelay);
        gain.gain.exponentialRampToValueAtTime(0.001, now + bellDelay + 0.5);

        osc.connect(gain);
        gain.connect(this.ctx.destination);

        osc.start(now + bellDelay);
        osc.stop(now + bellDelay + 0.5);
      });
    } catch {
      // Ignore
    }
  }

  // Coin kaching sound
  public playCoin() {
    if (this.isMuted || !this.sfxEnabled) return;
    this.initContext();
    if (!this.ctx) return;

    try {
      const now = this.ctx.currentTime;
      [987.77, 1318.51].forEach((freq, idx) => {
        if (!this.ctx) return;
        const osc = this.ctx.createOscillator();
        const gain = this.ctx.createGain();

        osc.type = 'sine';
        osc.frequency.setValueAtTime(freq, now + idx * 0.06);

        gain.gain.setValueAtTime(0.15, now + idx * 0.06);
        gain.gain.exponentialRampToValueAtTime(0.001, now + idx * 0.06 + 0.18);

        osc.connect(gain);
        gain.connect(this.ctx.destination);

        osc.start(now + idx * 0.06);
        osc.stop(now + idx * 0.06 + 0.18);
      });
    } catch {
      // Ignore
    }
  }

  // Magical Joker spark sound
  public playJokerTrigger() {
    if (this.isMuted || !this.sfxEnabled) return;
    this.initContext();
    if (!this.ctx) return;

    try {
      const now = this.ctx.currentTime;
      const notes = [523.25, 659.25, 783.99, 1046.50];
      notes.forEach((freq, idx) => {
        if (!this.ctx) return;
        const osc = this.ctx.createOscillator();
        const gain = this.ctx.createGain();

        osc.type = 'triangle';
        osc.frequency.setValueAtTime(freq, now + idx * 0.04);

        gain.gain.setValueAtTime(0.1, now + idx * 0.04);
        gain.gain.exponentialRampToValueAtTime(0.001, now + idx * 0.04 + 0.15);

        osc.connect(gain);
        gain.connect(this.ctx.destination);

        osc.start(now + idx * 0.04);
        osc.stop(now + idx * 0.04 + 0.15);
      });
    } catch {
      // Ignore
    }
  }

  // Victory fanfare
  public playVictory() {
    if (this.isMuted || !this.sfxEnabled) return;
    this.initContext();
    if (!this.ctx) return;

    try {
      const now = this.ctx.currentTime;
      const melody = [523.25, 659.25, 783.99, 1046.50, 1318.51];
      melody.forEach((freq, idx) => {
        if (!this.ctx) return;
        const osc = this.ctx.createOscillator();
        const gain = this.ctx.createGain();

        osc.type = 'triangle';
        osc.frequency.setValueAtTime(freq, now + idx * 0.1);

        gain.gain.setValueAtTime(0.2, now + idx * 0.1);
        gain.gain.exponentialRampToValueAtTime(0.001, now + idx * 0.1 + 0.3);

        osc.connect(gain);
        gain.connect(this.ctx.destination);

        osc.start(now + idx * 0.1);
        osc.stop(now + idx * 0.1 + 0.3);
      });
    } catch {
      // Ignore
    }
  }

  // Defeat cute boop
  public playDefeat() {
    if (this.isMuted || !this.sfxEnabled) return;
    this.initContext();
    if (!this.ctx) return;

    try {
      const now = this.ctx.currentTime;
      const notes = [400, 350, 300, 250];
      notes.forEach((freq, idx) => {
        if (!this.ctx) return;
        const osc = this.ctx.createOscillator();
        const gain = this.ctx.createGain();

        osc.type = 'sawtooth';
        osc.frequency.setValueAtTime(freq, now + idx * 0.12);

        gain.gain.setValueAtTime(0.12, now + idx * 0.12);
        gain.gain.exponentialRampToValueAtTime(0.001, now + idx * 0.12 + 0.2);

        osc.connect(gain);
        gain.connect(this.ctx.destination);

        osc.start(now + idx * 0.12);
        osc.stop(now + idx * 0.12 + 0.2);
      });
    } catch {
      // Ignore
    }
  }

  // Cheerful BGM loop
  public toggleBgm(): boolean {
    this.initContext();
    if (this.isBgmPlaying) {
      this.stopBgm();
      return false;
    } else {
      this.startBgm();
      return true;
    }
  }

  public startBgm() {
    if (this.isBgmPlaying || !this.ctx) return;
    this.initContext();
    this.isBgmPlaying = true;

    // Pleasant pentatonic melody sequence
    const notes = [
      523.25, 587.33, 659.25, 783.99,
      659.25, 587.33, 523.25, 440.00,
      523.25, 659.25, 783.99, 880.00,
      783.99, 659.25, 587.33, 523.25
    ];

    let noteIdx = 0;
    this.bgmInterval = window.setInterval(() => {
      if (this.isMuted || !this.ctx || !this.isBgmPlaying || this.bgmVolume <= 0) return;
      try {
        const freq = notes[noteIdx % notes.length];
        noteIdx++;

        const osc = this.ctx.createOscillator();
        const gain = this.ctx.createGain();

        osc.type = 'sine';
        osc.frequency.setValueAtTime(freq, this.ctx.currentTime);

        const baseGain = 0.05 * this.bgmVolume;
        gain.gain.setValueAtTime(baseGain, this.ctx.currentTime);
        gain.gain.exponentialRampToValueAtTime(0.001, this.ctx.currentTime + 0.35);

        osc.connect(gain);
        gain.connect(this.ctx.destination);

        osc.start();
        osc.stop(this.ctx.currentTime + 0.35);
      } catch {
        // Ignore
      }
    }, 400);
  }

  public stopBgm() {
    this.isBgmPlaying = false;
    if (this.bgmInterval) {
      clearInterval(this.bgmInterval);
      this.bgmInterval = null;
    }
  }

  public getIsBgmPlaying(): boolean {
    return this.isBgmPlaying;
  }
}

export const soundEngine = new SoundEngine();
