import { BlindType, CardData, HandEvaluation, HandLevelMap, HandType, Rank, Suit } from '../types';

export const INITIAL_HAND_LEVELS: HandLevelMap = {
  高牌: { level: 1, chips: 5, mult: 1 },
  对子: { level: 1, chips: 10, mult: 2 },
  两对: { level: 1, chips: 20, mult: 2 },
  三条: { level: 1, chips: 30, mult: 3 },
  顺子: { level: 1, chips: 30, mult: 4 },
  同花: { level: 1, chips: 35, mult: 4 },
  葫芦: { level: 1, chips: 40, mult: 4 },
  四条: { level: 1, chips: 60, mult: 7 },
  同花顺: { level: 1, chips: 100, mult: 8 },
  皇家同花顺: { level: 1, chips: 120, mult: 10 },
  五条: { level: 1, chips: 120, mult: 12 },
  同花五条: { level: 1, chips: 160, mult: 16 },
  同花葫芦: { level: 1, chips: 140, mult: 14 },
};

// Rank to numeric value for straight sorting (2 -> 2, ..., A -> 14)
export function getRankNumeric(rank: string): number {
  switch (rank) {
    case '2': return 2;
    case '3': return 3;
    case '4': return 4;
    case '5': return 5;
    case '6': return 6;
    case '7': return 7;
    case '8': return 8;
    case '9': return 9;
    case '10': return 10;
    case 'J': return 11;
    case 'Q': return 12;
    case 'K': return 13;
    case 'A': return 14;
    default: return 0;
  }
}

// Card face chips value (2-10 = face value, J/Q/K = 10, A = 11)
export function getCardChipsValue(card: CardData): number {
  if (card.enhancement === 'bonus') {
    return (card.value || 10) + 30;
  }
  return card.value || 10;
}

export function isWildCard(card: CardData): boolean {
  return card.enhancement === 'wild';
}

// Check effective suits considering Wild Card
export function getEffectiveSuits(card: CardData): Suit[] {
  if (card.enhancement === 'wild') {
    return ['hearts', 'diamonds', 'clubs', 'spades'];
  }
  return [card.suit];
}

// Check if a group of cards form a Flush
export function isFlush(cards: CardData[]): boolean {
  if (cards.length < 5) return false;
  const suits: Suit[] = ['hearts', 'diamonds', 'clubs', 'spades'];
  for (const s of suits) {
    const matchCount = cards.filter(c => getEffectiveSuits(c).includes(s)).length;
    if (matchCount >= 5) return true;
  }
  return false;
}

// Check if a group of cards form a Straight
export function isStraight(cards: CardData[]): boolean {
  if (cards.length < 5) return false;
  const ranks = Array.from(new Set(cards.map(c => getRankNumeric(c.rank)))).sort((a, b) => a - b);
  
  if (ranks.length < 5) return false;

  // Check normal straight
  for (let i = 0; i <= ranks.length - 5; i++) {
    if (
      ranks[i + 1] === ranks[i] + 1 &&
      ranks[i + 2] === ranks[i] + 2 &&
      ranks[i + 3] === ranks[i] + 3 &&
      ranks[i + 4] === ranks[i] + 4
    ) {
      return true;
    }
  }

  // Check Ace-low straight (A, 2, 3, 4, 5) -> 14, 2, 3, 4, 5
  if (ranks.includes(14)) {
    const aceLowRanks = [1, ...ranks.filter(r => r !== 14)].sort((a, b) => a - b);
    for (let i = 0; i <= aceLowRanks.length - 5; i++) {
      if (
        aceLowRanks[i + 1] === aceLowRanks[i] + 1 &&
        aceLowRanks[i + 2] === aceLowRanks[i] + 2 &&
        aceLowRanks[i + 3] === aceLowRanks[i] + 3 &&
        aceLowRanks[i + 4] === aceLowRanks[i] + 4
      ) {
        return true;
      }
    }
  }

  return false;
}

// Evaluate played cards (1 to 5 cards) and determine Hand Type + Scoring Cards
export function evaluateHand(cards: CardData[], handLevels: HandLevelMap): HandEvaluation {
  if (cards.length === 0) {
    return {
      handType: '高牌',
      scoringCards: [],
      baseChips: handLevels['高牌'].chips,
      baseMult: handLevels['高牌'].mult,
    };
  }

  // Count rank frequencies
  const rankMap: Record<string, CardData[]> = {};
  cards.forEach(c => {
    if (!rankMap[c.rank]) rankMap[c.rank] = [];
    rankMap[c.rank].push(c);
  });

  const rankGroupCounts = Object.values(rankMap).map(arr => arr.length).sort((a, b) => b - a);
  const flush = cards.length >= 5 && isFlush(cards);
  const straight = cards.length >= 5 && isStraight(cards);

  let handType: HandType = '高牌';
  let scoringCards: CardData[] = [...cards];

  // 1. Flush Five (同花五条)
  if (flush && rankGroupCounts[0] >= 5) {
    handType = '同花五条';
  }
  // 2. Flush House (同花葫芦)
  else if (flush && rankGroupCounts[0] === 3 && rankGroupCounts[1] >= 2) {
    handType = '同花葫芦';
  }
  // 3. Five of a Kind (五条)
  else if (rankGroupCounts[0] >= 5) {
    handType = '五条';
  }
  // 4. Royal Flush / Straight Flush (皇家同花顺 / 同花顺)
  else if (flush && straight) {
    const ranks = cards.map(c => getRankNumeric(c.rank)).sort((a, b) => b - a);
    if (ranks[0] === 14 && ranks[1] === 13 && ranks[2] === 12 && ranks[3] === 11 && ranks[4] === 10) {
      handType = '皇家同花顺';
    } else {
      handType = '同花顺';
    }
  }
  // 5. Four of a Kind (四条)
  else if (rankGroupCounts[0] === 4) {
    handType = '四条';
    // Only 4 cards are scoring
    const fourRank = Object.keys(rankMap).find(r => rankMap[r].length === 4);
    if (fourRank) scoringCards = rankMap[fourRank];
  }
  // 6. Full House (葫芦)
  else if (rankGroupCounts[0] === 3 && rankGroupCounts[1] >= 2) {
    handType = '葫芦';
  }
  // 7. Flush (同花)
  else if (flush) {
    handType = '同花';
  }
  // 8. Straight (顺子)
  else if (straight) {
    handType = '顺子';
  }
  // 9. Three of a Kind (三条)
  else if (rankGroupCounts[0] === 3) {
    handType = '三条';
    const threeRank = Object.keys(rankMap).find(r => rankMap[r].length === 3);
    if (threeRank) scoringCards = rankMap[threeRank];
  }
  // 10. Two Pair (两对)
  else if (rankGroupCounts[0] === 2 && rankGroupCounts[1] === 2) {
    handType = '两对';
    const pairRanks = Object.keys(rankMap).filter(r => rankMap[r].length === 2);
    scoringCards = cards.filter(c => pairRanks.includes(c.rank));
  }
  // 11. Pair (对子)
  else if (rankGroupCounts[0] === 2) {
    handType = '对子';
    const pairRank = Object.keys(rankMap).find(r => rankMap[r].length === 2);
    if (pairRank) scoringCards = rankMap[pairRank];
  }
  // 12. High Card (高牌)
  else {
    handType = '高牌';
    // Highest rank card only
    const highestCard = [...cards].sort((a, b) => getRankNumeric(b.rank) - getRankNumeric(a.rank))[0];
    if (highestCard) scoringCards = [highestCard];
  }

  const levelInfo = handLevels[handType] || { level: 1, chips: 10, mult: 1 };

  return {
    handType,
    scoringCards,
    baseChips: levelInfo.chips,
    baseMult: levelInfo.mult,
  };
}

// Generate standard 52 playing card deck
export function createStandardDeck(): CardData[] {
  const suits: Suit[] = ['hearts', 'diamonds', 'clubs', 'spades'];
  const ranks: Rank[] = ['2', '3', '4', '5', '6', '7', '8', '9', '10', 'J', 'Q', 'K', 'A'];

  const deck: CardData[] = [];
  let idCounter = 1;

  for (const suit of suits) {
    for (const rank of ranks) {
      let value = parseInt(rank);
      if (isNaN(value)) {
        if (rank === 'A') value = 11;
        else value = 10;
      }
      deck.push({
        id: `card_${idCounter++}`,
        suit,
        rank,
        value,
        enhancement: 'none',
        edition: 'none',
        seal: 'none',
      });
    }
  }

  return shuffleDeck(deck);
}

// Fisher-Yates deck shuffle
export function shuffleDeck(deck: CardData[]): CardData[] {
  const arr = [...deck];
  for (let i = arr.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [arr[i], arr[j]] = [arr[j], arr[i]];
  }
  return arr;
}

// Get Chinese name for Suit
export function getSuitLabel(suit: Suit): string {
  switch (suit) {
    case 'hearts': return '红桃 ♥';
    case 'diamonds': return '方块 ♦';
    case 'clubs': return '梅花 ♣';
    case 'spades': return '黑桃 ♠';
  }
}

// Calculate target score required for Ante & Blind Type
export function getTargetScoreForBlind(ante: number, blindType: BlindType): number {
  // Balatro formula approximation with smooth scaling
  const baseAnteScores = [100, 300, 800, 2000, 5000, 11000, 20000, 35000, 60000, 100000];
  const anteBase = baseAnteScores[Math.min(ante - 1, baseAnteScores.length - 1)] || (ante * 20000);

  if (blindType === 'small') return Math.floor(anteBase * 1.0);
  if (blindType === 'big') return Math.floor(anteBase * 1.5);
  // Boss blind
  return Math.floor(anteBase * 2.0);
}
