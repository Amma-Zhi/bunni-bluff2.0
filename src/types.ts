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

export interface GameSaveState {
  version: number;
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
}
