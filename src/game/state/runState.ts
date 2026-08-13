import { CardData, RunState } from '../../types';
import { INITIAL_HAND_LEVELS } from '../../utils/pokerLogic';

export function createRunState(runDeck: CardData[], money = 4, dailyDate?: string): RunState {
  return {
    ante: 1,
    money,
    runDeck,
    jokers: [],
    consumables: [],
    vouchers: [],
    handLevels: INITIAL_HAND_LEVELS,
    persistentJokerState: {},
    handSize: 8,
    isDaily: Boolean(dailyDate),
    dailyDate,
    activeCardBack: 'card_back_sakura',
    activeDeckSkin: 'deck_default',
  };
}

