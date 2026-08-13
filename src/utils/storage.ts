import { Achievement, GameSaveState, GameStats, RedeemItem } from '../types';
import { INITIAL_ACHIEVEMENTS, INITIAL_REDEEM_ITEMS } from '../data/achievements';

const KEYS = {
  SAVE_RUN: 'cute_balatro_save_run',
  STATS: 'cute_balatro_stats',
  ACHIEVEMENTS: 'cute_balatro_achievements',
  REDEEM_ITEMS: 'cute_balatro_redeem_items',
  CRYSTALS: 'cute_balatro_crystals',
  SOUND_MUTED: 'cute_balatro_sound_muted',
  SFX_ENABLED: 'cute_balatro_sfx_enabled',
  BGM_VOLUME: 'cute_balatro_bgm_volume',
};

export interface AudioSettings {
  sfxEnabled: boolean;
  bgmVolume: number; // 0 - 100
}

export function loadAudioSettings(): AudioSettings {
  try {
    const sfxRaw = localStorage.getItem(KEYS.SFX_ENABLED);
    const bgmRaw = localStorage.getItem(KEYS.BGM_VOLUME);

    let sfxEnabled = true;
    if (sfxRaw !== null) {
      sfxEnabled = JSON.parse(sfxRaw);
    } else {
      const mutedRaw = localStorage.getItem(KEYS.SOUND_MUTED);
      if (mutedRaw !== null) {
        sfxEnabled = !JSON.parse(mutedRaw);
      }
    }

    const bgmVal = bgmRaw !== null ? parseInt(bgmRaw, 10) : 80;
    const bgmVolume = isNaN(bgmVal) ? 80 : Math.max(0, Math.min(100, bgmVal));

    return {
      sfxEnabled: Boolean(sfxEnabled),
      bgmVolume,
    };
  } catch {
    return { sfxEnabled: true, bgmVolume: 80 };
  }
}

export function saveAudioSettings(settings: AudioSettings): void {
  try {
    localStorage.setItem(KEYS.SFX_ENABLED, JSON.stringify(settings.sfxEnabled));
    localStorage.setItem(KEYS.BGM_VOLUME, settings.bgmVolume.toString());
  } catch {
    // Ignore storage errors
  }
}

export const defaultStats: GameStats = {
  totalGamesPlayed: 0,
  totalWins: 0,
  highestHandScore: 0,
  totalCardsPlayed: 0,
  totalMoneyEarned: 0,
  dailyChallengesCompleted: 0,
};

export function loadGameRun(): GameSaveState | null {
  try {
    const raw = localStorage.getItem(KEYS.SAVE_RUN);
    if (!raw) return null;
    return JSON.parse(raw);
  } catch {
    return null;
  }
}

export function saveGameRun(state: GameSaveState | null): void {
  if (!state) {
    localStorage.removeItem(KEYS.SAVE_RUN);
  } else {
    localStorage.setItem(KEYS.SAVE_RUN, JSON.stringify(state));
  }
}

export function loadGameStats(): GameStats {
  try {
    const raw = localStorage.getItem(KEYS.STATS);
    if (!raw) return defaultStats;
    return { ...defaultStats, ...JSON.parse(raw) };
  } catch {
    return defaultStats;
  }
}

export function saveGameStats(stats: GameStats): void {
  localStorage.setItem(KEYS.STATS, JSON.stringify(stats));
}

export function loadCrystals(): number {
  try {
    const raw = localStorage.getItem(KEYS.CRYSTALS);
    if (!raw) return 0;
    return parseInt(raw, 10) || 0;
  } catch {
    return 0;
  }
}

export function saveCrystals(amount: number): void {
  localStorage.setItem(KEYS.CRYSTALS, amount.toString());
}

export function clearAllGameData(): void {
  try {
    localStorage.removeItem(KEYS.SAVE_RUN);
    localStorage.removeItem(KEYS.STATS);
    localStorage.removeItem(KEYS.ACHIEVEMENTS);
    localStorage.removeItem(KEYS.REDEEM_ITEMS);
    localStorage.removeItem(KEYS.CRYSTALS);
  } catch {
    // Ignore storage errors
  }
}

export function loadAchievements(): Achievement[] {
  try {
    const raw = localStorage.getItem(KEYS.ACHIEVEMENTS);
    if (!raw) return INITIAL_ACHIEVEMENTS;
    const saved = JSON.parse(raw) as Achievement[];
    // Merge missing initial achievements if any
    return INITIAL_ACHIEVEMENTS.map(initial => {
      const match = saved.find(s => s.id === initial.id);
      return match ? { ...initial, ...match } : initial;
    });
  } catch {
    return INITIAL_ACHIEVEMENTS;
  }
}

export function saveAchievements(achievements: Achievement[]): void {
  localStorage.setItem(KEYS.ACHIEVEMENTS, JSON.stringify(achievements));
}

export function loadRedeemItems(): RedeemItem[] {
  try {
    const raw = localStorage.getItem(KEYS.REDEEM_ITEMS);
    if (!raw) return INITIAL_REDEEM_ITEMS;
    const saved = JSON.parse(raw) as RedeemItem[];
    return INITIAL_REDEEM_ITEMS.map(initial => {
      const match = saved.find(s => s.id === initial.id);
      return match ? { ...initial, ...match } : initial;
    });
  } catch {
    return INITIAL_REDEEM_ITEMS;
  }
}

export function saveRedeemItems(items: RedeemItem[]): void {
  localStorage.setItem(KEYS.REDEEM_ITEMS, JSON.stringify(items));
}
