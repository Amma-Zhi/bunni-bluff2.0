import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { createStandardDeck, getTargetScoreForBlind } from '../src/utils/pokerLogic';
import { createRoundState } from '../src/game/state/roundState';
import { createRunState } from '../src/game/state/runState';
import { getRoundZoneProblems } from '../src/game/deck/deckZones';
import type { GameSaveState, LegacyGameSaveState } from '../src/types';

const baseDeck = createStandardDeck();
assert.equal(baseDeck.length, 52, 'A new Run must create exactly 52 Card entities');
assert.equal(new Set(baseDeck.map(card => card.id)).size, 52, 'Card entity IDs must be unique');

const firstRound = createRoundState(baseDeck, { ante: 1, blindType: 'small', handSize: 8 });
assert.equal(firstRound.hand.length, 8, 'A new Blind must draw the opening hand');
assert.equal(firstRound.drawPile.length, 44, 'The rest of the Run deck must remain in drawPile');
assert.deepEqual(getRoundZoneProblems(baseDeck, firstRound), [], 'A Card may belong to only one Round zone');

const changedId = baseDeck[0].id;
const removedId = baseDeck[1].id;
const copiedId = 'verification_copy';
const modifiedRunDeck = baseDeck
  .map(card => card.id === changedId ? { ...card, suit: 'hearts' as const, enhancement: 'bonus' as const } : card)
  .filter(card => card.id !== removedId)
  .concat({ ...baseDeck[2], id: copiedId, edition: 'foil' as const });

const nextBlind = createRoundState(modifiedRunDeck, { ante: 1, blindType: 'big', handSize: 8 });
const nextBlindIds = new Set([...nextBlind.drawPile, ...nextBlind.hand, ...nextBlind.discardPile]);
assert.equal(nextBlindIds.size, modifiedRunDeck.length, 'The next Blind must be built from the current runDeck');
assert.equal(nextBlindIds.has(removedId), false, 'Destroyed Cards must not return next Blind');
assert.equal(nextBlindIds.has(copiedId), true, 'Copied/added Cards must persist next Blind');
assert.equal(modifiedRunDeck.find(card => card.id === changedId)?.enhancement, 'bonus', 'Tarot changes must persist');
assert.deepEqual(getRoundZoneProblems(modifiedRunDeck, nextBlind), [], 'Next Blind zones must stay disjoint');

const expectedTargets = [
  [1, 300, 450, 600],
  [2, 800, 1200, 1600],
  [3, 2000, 3000, 4000],
  [4, 5000, 7500, 10000],
  [5, 11000, 16500, 22000],
  [6, 20000, 30000, 40000],
  [7, 35000, 52500, 70000],
  [8, 50000, 75000, 100000],
] as const;
for (const [ante, small, big, boss] of expectedTargets) {
  assert.equal(getTargetScoreForBlind(ante, 'small'), small);
  assert.equal(getTargetScoreForBlind(ante, 'big'), big);
  assert.equal(getTargetScoreForBlind(ante, 'boss'), boss);
}

const memory = new Map<string, string>();
Object.defineProperty(globalThis, 'localStorage', {
  configurable: true,
  value: {
    getItem: (key: string) => memory.get(key) ?? null,
    setItem: (key: string, value: string) => memory.set(key, value),
    removeItem: (key: string) => memory.delete(key),
  },
});
const { loadGameRun, saveGameRun } = await import('../src/utils/storage');

const duplicatedCard = { ...baseDeck[0], enhancement: 'mult' as const };
const legacy: LegacyGameSaveState = {
  version: 1,
  ante: 1,
  round: 2,
  blindType: 'big',
  money: 12,
  handsLeft: 3,
  discardsLeft: 2,
  handSize: 8,
  currentScore: 100,
  targetScore: 999999,
  jokers: [],
  consumables: [],
  handLevels: createRunState([]).handLevels,
  deck: [baseDeck[0], ...baseDeck.slice(8)],
  handCards: [duplicatedCard, ...baseDeck.slice(1, 8)],
  discardPile: [],
  isDaily: false,
  activeCardBack: 'card_back_sakura',
  activeDeckSkin: 'deck_default',
  vouchers: [],
};
memory.set('cute_balatro_save_run', JSON.stringify(legacy));
const migrated = loadGameRun();
assert.ok(migrated, 'A compatible v1 Run should migrate');
assert.equal(migrated.version, 2);
assert.equal(migrated.runState.runDeck.length, 52, 'Migration must deduplicate old Card objects');
assert.equal(migrated.runState.runDeck.find(card => card.id === duplicatedCard.id)?.enhancement, 'mult');
assert.equal(migrated.roundState.targetScore, 450, 'Migration must use the corrected Blind target');
assert.deepEqual(getRoundZoneProblems(migrated.runState.runDeck, migrated.roundState), []);

const version2: GameSaveState = {
  version: 2,
  runState: createRunState(modifiedRunDeck, 7),
  roundState: nextBlind,
};
saveGameRun(version2);
assert.deepEqual(
  loadGameRun(),
  JSON.parse(JSON.stringify(version2)),
  'Version 2 Save/Load must round-trip runDeck and zones',
);

memory.set('cute_balatro_crystals', '123');
const invalidVersion2 = JSON.parse(JSON.stringify(version2)) as GameSaveState;
invalidVersion2.roundState.drawPile.push(invalidVersion2.roundState.hand[0]);
memory.set('cute_balatro_save_run', JSON.stringify(invalidVersion2));
assert.equal(loadGameRun(), null, 'An unsafe v2 Run must reset instead of loading duplicate zones');
assert.equal(memory.get('cute_balatro_crystals'), '123', 'Resetting an unsafe Run must not touch Meta data');

const battleSource = readFileSync(new URL('../src/components/BattleScreen.tsx', import.meta.url), 'utf8');
const appSource = readFileSync(new URL('../src/App.tsx', import.meta.url), 'utf8');
assert.equal(battleSource.includes('onOpenShop'), false, 'BattleScreen must not expose a Run shop callback');
assert.equal(battleSource.includes('刷新 🪙10'), false, 'BattleScreen must not expose combat reroll');
assert.equal(
  (appSource.match(/createStandardDeck\(\)/g) || []).length,
  1,
  'App must create a standard deck only when a new Run starts',
);

console.log('Phase 1 verification passed: runDeck, zones, persistence, targets, shop isolation.');
