import { BlindType, BossRule, CardData, RoundState } from '../../types';
import { getTargetScoreForBlind, shuffleDeck } from '../../utils/pokerLogic';

interface CreateRoundStateOptions {
  ante: number;
  blindType: BlindType;
  handSize: number;
  bossRule?: BossRule;
  handsLeft?: number;
  discardsLeft?: number;
}

export function createRoundState(runDeck: CardData[], options: CreateRoundStateOptions): RoundState {
  const shuffledIds = shuffleDeck(runDeck).map(card => card.id);
  const handCount = Math.min(options.handSize, shuffledIds.length);

  return {
    blindType: options.blindType,
    currentScore: 0,
    targetScore: getTargetScoreForBlind(options.ante, options.blindType),
    drawPile: shuffledIds.slice(handCount),
    hand: shuffledIds.slice(0, handCount),
    discardPile: [],
    handsLeft: options.handsLeft ?? 4,
    discardsLeft: options.discardsLeft ?? 3,
    bossRule: options.bossRule,
    isCleared: false,
  };
}

