import {
  Achievement,
  CardData,
  GameSaveState,
  GameStats,
  LegacyGameSaveState,
  RedeemItem,
  StoredGameSaveState,
} from '../types';
import { INITIAL_ACHIEVEMENTS, INITIAL_REDEEM_ITEMS } from '../data/achievements';
import { getTargetScoreForBlind, INITIAL_HAND_LEVELS } from './pokerLogic';

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
    const stored = JSON.parse(raw) as StoredGameSaveState;

    if (stored.version === 2) {
      return isValidVersion2Save(stored) ? stored : null;
    }

    return migrateLegacyRun(stored as LegacyGameSaveState);
  } catch {
    return null;
  }
}

function isCard(value: unknown): value is CardData {
  if (!value || typeof value !== 'object') return false;
  const card = value as Partial<CardData>;
  return typeof card.id === 'string' && typeof card.suit === 'string' && typeof card.rank === 'string';
}

function uniqueIds(ids: unknown): string[] {
  if (!Array.isArray(ids)) return [];
  return [...new Set(ids.filter((id): id is string => typeof id === 'string'))];
}

function isValidVersion2Save(save: GameSaveState): boolean {
  if (!save.runState || !save.roundState || !Array.isArray(save.runState.runDeck)) return false;
  if (!save.runState.runDeck.every(isCard)) return false;

  const entityIds = new Set(save.runState.runDeck.map(card => card.id));
  if (entityIds.size !== save.runState.runDeck.length) return false;

  const zones = [save.roundState.drawPile, save.roundState.hand, save.roundState.discardPile];
  if (zones.some(zone => !Array.isArray(zone) || zone.some(id => typeof id !== 'string'))) return false;
  const zoneIds = zones.flat();

  return zoneIds.every(id => entityIds.has(id)) && new Set(zoneIds).size === zoneIds.length;
}

function migrateLegacyRun(save: LegacyGameSaveState): GameSaveState | null {
  const legacyDrawPile = Array.isArray(save.deck) ? save.deck.filter(isCard) : [];
  const legacyDiscardPile = Array.isArray(save.discardPile) ? save.discardPile.filter(isCard) : [];
  const legacyHand = Array.isArray(save.handCards) ? save.handCards.filter(isCard) : [];
  const entities = new Map<string, CardData>();

  // The active hand wins if an old save duplicated a Card object across zones.
  [...legacyDrawPile, ...legacyDiscardPile, ...legacyHand].forEach(card => entities.set(card.id, card));
  if (entities.size === 0) return null;

  const hand = uniqueIds(legacyHand.map(card => card.id));
  const handSet = new Set(hand);
  const drawPile = uniqueIds(legacyDrawPile.map(card => card.id)).filter(id => !handSet.has(id));
  const occupied = new Set([...hand, ...drawPile]);
  const discardPile = uniqueIds(legacyDiscardPile.map(card => card.id)).filter(id => !occupied.has(id));
  const blindType = save.blindType || 'small';
  const ante = Math.max(1, save.ante || 1);

  return {
    version: 2,
    runState: {
      ante,
      money: save.money ?? 4,
      runDeck: [...entities.values()],
      jokers: save.jokers || [],
      consumables: save.consumables || [],
      vouchers: save.vouchers || [],
      handLevels: save.handLevels || INITIAL_HAND_LEVELS,
      persistentJokerState: {},
      handSize: save.handSize || 8,
      isDaily: save.isDaily || false,
      dailyDate: save.dailyDate,
      activeCardBack: save.activeCardBack || 'card_back_sakura',
      activeDeckSkin: save.activeDeckSkin || 'deck_default',
    },
    roundState: {
      blindType,
      currentScore: save.currentScore || 0,
      targetScore: getTargetScoreForBlind(ante, blindType),
      drawPile,
      hand,
      discardPile,
      handsLeft: save.handsLeft ?? 4,
      discardsLeft: save.discardsLeft ?? 3,
      bossRule: save.bossRule,
      isCleared: save.isRoundCleared ?? false,
    },
  };
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
