import { CardData, RoundState } from '../../types';

export type RoundZoneName = 'drawPile' | 'hand' | 'discardPile';

export function cardsForIds(runDeck: CardData[], ids: string[]): CardData[] {
  const entities = new Map(runDeck.map(card => [card.id, card]));
  return ids.flatMap(id => {
    const card = entities.get(id);
    return card ? [card] : [];
  });
}

export function updateRunDeckCards(
  runDeck: CardData[],
  cardIds: ReadonlySet<string>,
  update: (card: CardData) => CardData,
): CardData[] {
  return runDeck.map(card => (cardIds.has(card.id) ? update(card) : card));
}

export function removeCardsFromRound(roundState: RoundState, cardIds: ReadonlySet<string>): RoundState {
  return {
    ...roundState,
    drawPile: roundState.drawPile.filter(id => !cardIds.has(id)),
    hand: roundState.hand.filter(id => !cardIds.has(id)),
    discardPile: roundState.discardPile.filter(id => !cardIds.has(id)),
  };
}

export function getRoundZoneProblems(runDeck: CardData[], roundState: RoundState): string[] {
  const problems: string[] = [];
  const entityIds = new Set<string>();

  for (const card of runDeck) {
    if (entityIds.has(card.id)) problems.push(`Duplicate Card entity: ${card.id}`);
    entityIds.add(card.id);
  }

  const seenZones = new Map<string, RoundZoneName>();
  const zones: Array<[RoundZoneName, string[]]> = [
    ['drawPile', roundState.drawPile],
    ['hand', roundState.hand],
    ['discardPile', roundState.discardPile],
  ];

  for (const [zoneName, ids] of zones) {
    for (const id of ids) {
      if (!entityIds.has(id)) problems.push(`Missing Card entity for ${id} in ${zoneName}`);
      const previousZone = seenZones.get(id);
      if (previousZone) problems.push(`Card ${id} exists in both ${previousZone} and ${zoneName}`);
      else seenZones.set(id, zoneName);
    }
  }

  return problems;
}

