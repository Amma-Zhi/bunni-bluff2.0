export type Suit = 'hearts' | 'diamonds' | 'clubs' | 'spades';
export type Rank = '2' | '3' | '4' | '5' | '6' | '7' | '8' | '9' | '10' | 'J' | 'Q' | 'K' | 'A';

export type CardEnhancement = 'none' | 'bonus' | 'mult' | 'wild' | 'glass' | 'steel' | 'gold' | 'lucky';
export type CardEdition = 'none' | 'foil' | 'holographic' | 'polychrome';
export type CardSeal = 'none' | 'red' | 'gold';

export interface CardData {
  id: string;
  suit: Suit;
  rank: Rank;
  value: number; // 2..11
  enhancement: CardEnhancement;
  edition: CardEdition;
  seal: CardSeal;
  isFlipped?: boolean;
}

export type HandType =
  | '高牌'
  | '对子'
  | '两对'
  | '三条'
  | '顺子'
  | '同花'
  | '葫芦'
  | '四条'
  | '同花顺'
  | '皇家同花顺'
  | '五条'
  | '同花五条'
  | '同花葫芦';

export interface HandLevel {
  level: number;
  chips: number;
  mult: number;
}

export type HandLevelMap = Record<HandType, HandLevel>;

export interface HandEvaluation {
  handType: HandType;
  scoringCards: CardData[];
  baseChips: number;
  baseMult: number;
}

export type JokerRarity = '普通' | '罕见' | '稀有' | '传说';

export interface JokerData {
  id: string;
  name: string;
  description: string;
  rarity: JokerRarity;
  cost: number;
  icon: string; // Lucide icon name or emoji
  color: string;
  // Trigger callback data
  effectType: 'chips' | 'mult' | 'xmult' | 'utility' | 'money';
}

export interface TarotCardData {
  id: string;
  name: string;
  description: string;
  cost: number;
  icon: string;
  effect: 'suit_change' | 'enhancement' | 'copy' | 'destroy' | 'money' | 'planet_gen';
  targetSuit?: Suit;
  targetEnhancement?: CardEnhancement;
}

export interface PlanetCardData {
  id: string;
  name: string;
  handType: HandType;
  cost: number;
  chipsBonus: number;
  multBonus: number;
  icon: string;
}

export interface VoucherData {
  id: string;
  name: string;
  description: string;
  cost: number;
  icon: string;
  bought: boolean;
}

export interface BoosterPackData {
  id: string;
  name: string;
  description: string;
  cost: number;
  packType: 'tarot' | 'planet' | 'standard';
  cardCount: number;
  selectCount: number;
  icon: string;
}

export type BlindType = 'small' | 'big' | 'boss';

export interface BossRule {
  id: string;
  name: string;
  description: string;
  icon: string;
  bannedHandTypes?: HandType[];
  disabledJokerIndices?: number[];
  disableDiscards?: boolean;
}

export interface BlindInfo {
  type: BlindType;
  name: string;
  targetScore: number;
  reward: number;
  bossRule?: BossRule;
}

export interface Achievement {
  id: string;
  title: string;
  description: string;
  rewardCrystals: number;
  unlocked: boolean;
  progress?: number;
  maxProgress?: number;
  icon: string;
}

export interface RedeemItem {
  id: string;
  type: 'card_back' | 'deck_skin' | 'avatar_frame';
  name: string;
  description: string;
  price: number;
  icon: string;
  unlocked: boolean;
  previewColor?: string;
}

export interface DailyChallengeConfig {
  dateStr: string; // YYYY-MM-DD
  seedName: string;
  description: string;
  modifiers: string[];
  extraStartingMoney: number;
  extraHands: number;
  extraDiscards: number;
}

export interface GameStats {
  totalGamesPlayed: number;
  totalWins: number;
  highestHandScore: number;
  totalCardsPlayed: number;
  totalMoneyEarned: number;
  dailyChallengesCompleted: number;
}

export interface JokerPersistentState {
  [jokerId: string]: Record<string, number | string | boolean>;
}

/** Data that survives from one Blind to the next during a single Run. */
export interface RunState {
  ante: number;
  money: number;
  runDeck: CardData[];
  jokers: JokerData[];
  consumables: (TarotCardData | PlanetCardData)[];
  vouchers: string[];
  handLevels: HandLevelMap;
  persistentJokerState: JokerPersistentState;
  handSize: number;
  isDaily: boolean;
  dailyDate?: string;
  activeCardBack: string;
  activeDeckSkin: string;
}

/** Data that is reset whenever a new Blind starts. Card zones contain IDs only. */
export interface RoundState {
  blindType: BlindType;
  currentScore: number;
  targetScore: number;
  drawPile: string[];
  hand: string[];
  discardPile: string[];
  handsLeft: number;
  discardsLeft: number;
  bossRule?: BossRule;
  isCleared: boolean;
}

export interface GameSaveState {
  version: 2;
  runState: RunState;
  roundState: RoundState;
}

/** Version 1 is kept only so storage.ts can safely migrate old Runs. */
export interface LegacyGameSaveState {
  version?: 1;
  ante: number;
  round: number;
  blindType: BlindType;
  money: number;
  handsLeft: number;
  discardsLeft: number;
  handSize: number;
  currentScore: number;
  targetScore: number;
  jokers: JokerData[];
  consumables: (TarotCardData | PlanetCardData)[];
  handLevels: HandLevelMap;
  deck: CardData[];
  handCards: CardData[];
  discardPile: CardData[];
  bossRule?: BossRule;
  isDaily: boolean;
  dailyDate?: string;
  activeCardBack: string;
  activeDeckSkin: string;
  vouchers: string[]; // Bought voucher IDs
  isRoundCleared?: boolean;
}

export type StoredGameSaveState = GameSaveState | LegacyGameSaveState;
