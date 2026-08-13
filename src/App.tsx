import React, { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import {
  BlindType,
  BossRule,
  BoosterPackData,
  CardData,
  HandEvaluation,
  HandLevelMap,
  JokerData,
  PlanetCardData,
  RoundState,
  RunState,
  TarotCardData,
  VoucherData,
  GameSaveState,
  GameStats,
} from './types';
import {
  createStandardDeck,
  evaluateHand,
} from './utils/pokerLogic';
import { JOKERS_LIST } from './data/jokers';
import {
  BOOSTER_PACKS,
  BOSS_RULES,
  PLANET_CARDS,
  TAROT_CARDS,
  VOUCHERS,
} from './data/tarotAndPlanets';
import {
  getDailyChallengeConfig,
  INITIAL_ACHIEVEMENTS,
  INITIAL_REDEEM_ITEMS,
} from './data/achievements';
import {
  clearAllGameData,
  defaultStats,
  loadAchievements,
  loadAudioSettings,
  loadCrystals,
  loadGameRun,
  loadGameStats,
  loadRedeemItems,
  saveAchievements,
  saveAudioSettings,
  saveCrystals,
  saveGameRun,
  saveGameStats,
  saveRedeemItems,
} from './utils/storage';
import { soundEngine } from './utils/audio';

// Components
import { HomeScreen } from './components/HomeScreen';
import { BattleScreen } from './components/BattleScreen';
import { HandScoringOverlay } from './components/HandScoringOverlay';
import { ShopModal } from './components/ShopModal';
import { BoosterPackModal } from './components/BoosterPackModal';
import { DailyChallengeModal } from './components/DailyChallengeModal';
import { AchievementsModal } from './components/AchievementsModal';
import { DeckViewModal } from './components/DeckViewModal';
import { BossBlindNotice } from './components/BossBlindNotice';
import { GameOverModal } from './components/GameOverModal';
import { HelpModal } from './components/HelpModal';
import { SettingsModal } from './components/SettingsModal';
import { createRunState } from './game/state/runState';
import { createRoundState } from './game/state/roundState';
import { cardsForIds, removeCardsFromRound, updateRunDeckCards } from './game/deck/deckZones';

import { Smartphone, RotateCw, Sparkles, Home, Swords, Settings } from 'lucide-react';

const EMPTY_RUN_STATE: RunState = createRunState([]);
const EMPTY_ROUND_STATE: RoundState = createRoundState([], {
  ante: 1,
  blindType: 'small',
  handSize: 8,
});

export default function App() {
  // Navigation Screen: 'home' or 'battle'
  const [currentScreen, setCurrentScreen] = useState<'home' | 'battle'>('home');
  const [activeTab, setActiveTab] = useState<string>('home');

  // Screen Orientation mode: 'landscape' (default horizontal mobile) or 'portrait' (vertical mobile)
  const [orientation, setOrientation] = useState<'landscape' | 'portrait'>('landscape');

  // Game state is split by lifetime: Run survives Blinds; Round is rebuilt per Blind.
  const [runState, setRunState] = useState<RunState>(EMPTY_RUN_STATE);
  const [roundState, setRoundState] = useState<RoundState>(EMPTY_ROUND_STATE);
  const [isRunReady, setIsRunReady] = useState(false);
  const [selectedCardIds, setSelectedCardIds] = useState<string[]>([]);

  const {
    ante, money, runDeck, jokers, consumables, handLevels, vouchers, handSize,
    isDaily, dailyDate, activeCardBack, activeDeckSkin,
  } = runState;
  const {
    blindType, currentScore, targetScore, handsLeft, discardsLeft,
    bossRule, isCleared: isRoundCleared,
  } = roundState;
  const handCards = cardsForIds(runDeck, roundState.hand);

  // Unlockables & Settings State
  const [crystals, setCrystals] = useState<number>(0);
  const [achievements, setAchievements] = useState(INITIAL_ACHIEVEMENTS);
  const [redeemItems, setRedeemItems] = useState(INITIAL_REDEEM_ITEMS);
  const [gameStats, setGameStats] = useState<GameStats>(defaultStats);

  // UI Flow State
  const [screenState, setScreenState] = useState<'playing' | 'scoring' | 'shop' | 'boss_notice' | 'game_over'>('playing');
  const [activeScoring, setActiveScoring] = useState<{ handEval: HandEvaluation; playedCards: CardData[] } | null>(null);

  // Modals
  const [showDeckView, setShowDeckView] = useState<boolean>(false);
  const [showDailyModal, setShowDailyModal] = useState<boolean>(false);
  const [showAchievementsModal, setShowAchievementsModal] = useState<boolean>(false);
  const [showHelpModal, setShowHelpModal] = useState<boolean>(false);
  const [showSettingsModal, setShowSettingsModal] = useState<boolean>(false);

  // Audio Settings State
  const [sfxEnabled, setSfxEnabled] = useState<boolean>(true);
  const [bgmVolume, setBgmVolume] = useState<number>(80);

  // Booster pack opening modal
  const [activePack, setActivePack] = useState<BoosterPackData | null>(null);
  const [packOptions, setPackOptions] = useState<(TarotCardData | PlanetCardData | CardData)[]>([]);

  // Shop items
  const [shopJokers, setShopJokers] = useState<JokerData[]>([]);
  const [shopConsumables, setShopConsumables] = useState<(TarotCardData | PlanetCardData)[]>([]);
  const [shopPacks, setShopPacks] = useState<BoosterPackData[]>([]);
  const [shopVouchers, setShopVouchers] = useState<VoucherData[]>([]);
  const [lastEarningsBreakdown, setLastEarningsBreakdown] = useState<{
    base: number;
    hands: number;
    interest: number;
    total: number;
  } | null>(null);

  // Initialize on mount
  useEffect(() => {
    const savedCrystals = loadCrystals();
    setCrystals(savedCrystals);

    const savedAchs = loadAchievements();
    setAchievements(savedAchs);

    const savedRedeems = loadRedeemItems();
    setRedeemItems(savedRedeems);

    const savedStats = loadGameStats();
    setGameStats(savedStats);

    const audioSettings = loadAudioSettings();
    setSfxEnabled(audioSettings.sfxEnabled);
    setBgmVolume(audioSettings.bgmVolume);
    soundEngine.setSfxEnabled(audioSettings.sfxEnabled);
    soundEngine.setBgmVolume(audioSettings.bgmVolume / 100);

    const savedRun = loadGameRun();
    if (savedRun) {
      loadRunFromSave(savedRun);
    } else {
      startNewRun();
    }
  }, []);

  // Save the complete Run and current Round after every state transition.
  useEffect(() => {
    if (!isRunReady || screenState === 'game_over') return;
    saveGameRun({ version: 2, runState, roundState });
  }, [isRunReady, roundState, runState, screenState]);

  // Register audio unlock listener on first user interaction for iOS Safari / WebKit support
  useEffect(() => {
    const handleFirstInteraction = async () => {
      const success = await soundEngine.unlockAudio();
      if (success) {
        window.removeEventListener('pointerdown', handleFirstInteraction);
        window.removeEventListener('touchstart', handleFirstInteraction);
        window.removeEventListener('click', handleFirstInteraction);
      }
    };

    window.addEventListener('pointerdown', handleFirstInteraction, { passive: true });
    window.addEventListener('touchstart', handleFirstInteraction, { passive: true });
    window.addEventListener('click', handleFirstInteraction, { passive: true });

    return () => {
      window.removeEventListener('pointerdown', handleFirstInteraction);
      window.removeEventListener('touchstart', handleFirstInteraction);
      window.removeEventListener('click', handleFirstInteraction);
    };
  }, []);

  const handleToggleSfx = async (enabled: boolean) => {
    setSfxEnabled(enabled);
    soundEngine.setSfxEnabled(enabled);
    saveAudioSettings({ sfxEnabled: enabled, bgmVolume });
    if (enabled) {
      await soundEngine.unlockAudio();
    }
  };

  const handleChangeBgmVolume = async (volume: number) => {
    setBgmVolume(volume);
    soundEngine.setBgmVolume(volume / 100);
    saveAudioSettings({ sfxEnabled, bgmVolume: volume });
    if (volume > 0) {
      await soundEngine.unlockAudio();
    }
  };

  const loadRunFromSave = (save: GameSaveState) => {
    setRunState(save.runState);
    setRoundState(save.roundState);
    setSelectedCardIds([]);
    setIsRunReady(true);

    if (save.roundState.isCleared) {
      populateShop(save.runState.vouchers);
      setScreenState('shop');
    } else {
      setScreenState(save.roundState.bossRule ? 'boss_notice' : 'playing');
    }
  };

  const startNewRun = (customDailyDate?: string, resetCosmetics = false) => {
    const freshRunDeck = createStandardDeck();
    let startMoney = 4; // Adjusted starting money for economy balance
    let startingHands = 4;
    let startingDiscards = 3;

    if (customDailyDate) {
      const dailyConfig = getDailyChallengeConfig(new Date(customDailyDate));
      startMoney += dailyConfig.extraStartingMoney;
      startingHands += dailyConfig.extraHands;
      startingDiscards += dailyConfig.extraDiscards;
    }

    const nextRunState = createRunState(freshRunDeck, startMoney, customDailyDate);
    if (!resetCosmetics) {
      nextRunState.activeCardBack = runState.activeCardBack;
      nextRunState.activeDeckSkin = runState.activeDeckSkin;
    }
    const nextRoundState = createRoundState(freshRunDeck, {
      ante: 1,
      blindType: 'small',
      handSize: nextRunState.handSize,
      handsLeft: startingHands,
      discardsLeft: startingDiscards,
    });

    setRunState(nextRunState);
    setRoundState(nextRoundState);
    setSelectedCardIds([]);
    setLastEarningsBreakdown(null);
    setScreenState('playing');
    setIsRunReady(true);

    saveGameRun(null);
  };

  // Generate random Shop Inventory
  const populateShop = (purchasedVouchers = vouchers) => {
    const shuffledJokers = [...JOKERS_LIST].sort(() => Math.random() - 0.5);
    setShopJokers(shuffledJokers.slice(0, 2));

    const combinedConsumables = [...TAROT_CARDS, ...PLANET_CARDS].sort(() => Math.random() - 0.5);
    setShopConsumables(combinedConsumables.slice(0, 2));

    setShopPacks(BOOSTER_PACKS);

    const unboughtVouchers = VOUCHERS.map(v => ({
      ...v,
      bought: purchasedVouchers.includes(v.id),
    }));
    setShopVouchers(unboughtVouchers);
  };

  // Handle Card Selection
  const handleToggleSelectCard = (cardId: string) => {
    soundEngine.playPop();
    if (selectedCardIds.includes(cardId)) {
      setSelectedCardIds(prev => prev.filter(id => id !== cardId));
    } else {
      if (selectedCardIds.length >= 5) return;
      setSelectedCardIds(prev => [...prev, cardId]);
    }
  };

  // Discard Hand
  const handleDiscard = () => {
    if (discardsLeft <= 0 || selectedCardIds.length === 0) return;

    soundEngine.playCardFlip();

    const selectedIds = new Set<string>(selectedCardIds);
    const remainingHandIds = roundState.hand.filter(id => !selectedIds.has(id));
    const neededCount = Math.min(roundState.drawPile.length, selectedCardIds.length);
    const drawnIds = roundState.drawPile.slice(0, neededCount);

    setRoundState(prev => ({
      ...prev,
      drawPile: prev.drawPile.slice(neededCount),
      hand: [...remainingHandIds, ...drawnIds],
      discardPile: [...prev.discardPile, ...prev.hand.filter(id => selectedIds.has(id))],
      discardsLeft: prev.discardsLeft - 1,
    }));
    setSelectedCardIds([]);
  };

  // Play Hand Action
  const handlePlayHand = () => {
    if (handsLeft <= 0 || selectedCardIds.length === 0) return;

    const played = handCards.filter(c => selectedCardIds.includes(c.id));
    const handEval = evaluateHand(played, handLevels);

    setActiveScoring({ handEval, playedCards: played });
    setScreenState('scoring');
  };

  // Called when scoring animation completes
  const handleScoringComplete = (scoredPoints: number) => {
    const newScore = currentScore + scoredPoints;
    const selectedIds = new Set<string>(selectedCardIds);
    const remainingHandIds = roundState.hand.filter(id => !selectedIds.has(id));
    const played = handCards.filter(c => selectedCardIds.includes(c.id));

    const survivedPlayedIds = played.filter(c => {
      if (c.enhancement === 'glass') {
        return Math.random() > 0.25;
      }
      return true;
    }).map(card => card.id);
    const survivedSet = new Set(survivedPlayedIds);
    const brokenIds = new Set(played.filter(card => !survivedSet.has(card.id)).map(card => card.id));
    const needed = Math.min(roundState.drawPile.length, handSize - remainingHandIds.length);
    const drawnIds = roundState.drawPile.slice(0, needed);
    const newHandsLeft = handsLeft - 1;
    const didClear = newScore >= targetScore;

    if (brokenIds.size > 0) {
      setRunState(prev => ({
        ...prev,
        runDeck: prev.runDeck.filter(card => !brokenIds.has(card.id)),
      }));
    }

    setRoundState(prev => ({
      ...prev,
      currentScore: newScore,
      drawPile: prev.drawPile.slice(needed).filter(id => !brokenIds.has(id)),
      hand: [...remainingHandIds, ...drawnIds].filter(id => !brokenIds.has(id)),
      discardPile: [...prev.discardPile, ...survivedPlayedIds],
      handsLeft: newHandsLeft,
      isCleared: didClear,
    }));
    setSelectedCardIds([]);

    const stats = loadGameStats();
    if (scoredPoints > stats.highestHandScore) {
      stats.highestHandScore = scoredPoints;
      saveGameStats(stats);
    }

    if (didClear) {
      const baseReward = blindType === 'boss' ? (8 + ante * 2) : blindType === 'big' ? (5 + ante) : (3 + ante);
      const interest = Math.min(5, Math.floor(money / 5));
      const handsReward = newHandsLeft;
      const totalEarned = baseReward + handsReward + interest;

      setLastEarningsBreakdown({
        base: baseReward,
        hands: handsReward,
        interest,
        total: totalEarned,
      });

      setRunState(prev => ({ ...prev, money: prev.money + totalEarned }));
      populateShop();
      setScreenState('shop');
      return;
    }

    if (newHandsLeft <= 0 && newScore < targetScore) {
      const earnedCrystals = Math.floor(newScore / 200) + 10;
      saveCrystals(crystals + earnedCrystals);
      setCrystals(prev => prev + earnedCrystals);
      saveGameRun(null);
      setScreenState('game_over');
      return;
    }

    setScreenState('playing');
  };

  const handleNextRoundFromShop = () => {
    if (!isRoundCleared) {
      setScreenState('playing');
      return;
    }

    let nextBlind: BlindType = 'big';
    let nextAnte = ante;
    let nextBossRule: BossRule | undefined;

    if (blindType === 'small') {
      nextBlind = 'big';
    } else if (blindType === 'big') {
      nextBlind = 'boss';
      nextBossRule = BOSS_RULES[Math.floor(Math.random() * BOSS_RULES.length)];
    } else {
      nextBlind = 'small';
      nextAnte = ante + 1;

      if (nextAnte > 8) {
        const earnedCrystals = 100;
        saveCrystals(crystals + earnedCrystals);
        setCrystals(prev => prev + earnedCrystals);
        setRunState(prev => ({ ...prev, ante: nextAnte }));
        saveGameRun(null);
        setScreenState('game_over');
        return;
      }
    }

    const nextRoundState = createRoundState(runDeck, {
      ante: nextAnte,
      blindType: nextBlind,
      handSize,
      bossRule: nextBossRule,
    });

    setRunState(prev => ({ ...prev, ante: nextAnte }));
    setRoundState(nextRoundState);
    setSelectedCardIds([]);

    if (nextBossRule) {
      setScreenState('boss_notice');
    } else {
      setScreenState('playing');
    }
  };

  const handleBuyPack = (pack: BoosterPackData) => {
    if (money < pack.cost) return;
    if (pack.packType !== 'standard' && consumables.length >= 2) return;

    setRunState(prev => ({ ...prev, money: prev.money - pack.cost }));
    setActivePack(pack);

    if (pack.packType === 'tarot') {
      const options = [...TAROT_CARDS].sort(() => Math.random() - 0.5).slice(0, 3);
      setPackOptions(options);
    } else if (pack.packType === 'planet') {
      const options = [...PLANET_CARDS].sort(() => Math.random() - 0.5).slice(0, 3);
      setPackOptions(options);
    } else {
      const newCards: CardData[] = Array.from({ length: 3 }).map((_, i) => ({
        id: `pack_card_${Date.now()}_${i}`,
        suit: ['hearts', 'diamonds', 'clubs', 'spades'][Math.floor(Math.random() * 4)] as any,
        rank: ['A', 'K', 'Q', 'J', '10', '9', '8'][Math.floor(Math.random() * 7)] as any,
        value: 10,
        enhancement: ['bonus', 'mult', 'gold', 'glass', 'wild'][Math.floor(Math.random() * 5)] as any,
        edition: ['foil', 'holographic', 'none'][Math.floor(Math.random() * 3)] as any,
        seal: 'none',
      }));
      setPackOptions(newCards);
    }
  };

  const handleSelectPackOption = (item: TarotCardData | PlanetCardData | CardData) => {
    if ('suit' in item) {
      setRunState(prev => ({ ...prev, runDeck: [...prev.runDeck, item as CardData] }));
    } else {
      if (consumables.length < 2) {
        setRunState(prev => ({
          ...prev,
          consumables: [...prev.consumables, item as TarotCardData | PlanetCardData],
        }));
      }
    }
  };

  const handleUseConsumable = (item: TarotCardData | PlanetCardData) => {
    // 1. Planet Cards (Level up hand)
    if ('handType' in item) {
      const planet = item as PlanetCardData;
      setRunState(prev => {
        const current = prev.handLevels[planet.handType] || { level: 1, chips: 10, mult: 1 };
        return {
          ...prev,
          handLevels: {
            ...prev.handLevels,
            [planet.handType]: {
              level: current.level + 1,
              chips: current.chips + planet.chipsBonus,
              mult: current.mult + planet.multBonus,
            },
          },
        };
      });
      setRunState(prev => ({ ...prev, consumables: prev.consumables.filter(c => c.id !== item.id) }));
      soundEngine.playFinalRewardChime();
      alert(`✨【${planet.handType}】手牌等级提升至 Lv.${(handLevels[planet.handType]?.level || 1) + 1}！基础筹码 +${planet.chipsBonus}，基础倍率 +${planet.multBonus}`);
      return;
    }

    // 2. Tarot Cards
    const tarot = item as TarotCardData;

    if (tarot.effect === 'money') {
      setRunState(prev => ({
        ...prev,
        money: prev.money + 15,
        consumables: prev.consumables.filter(c => c.id !== item.id),
      }));
      soundEngine.playCoin();
      alert('✨【聚宝盆】魔法发挥！获得 🪙15 金币！');
      return;
    }

    const selectedCards = handCards.filter(c => selectedCardIds.includes(c.id));
    const selectedIds = new Set<string>(selectedCardIds);

    if (tarot.effect === 'suit_change') {
      if (selectedCards.length === 0 || selectedCards.length > 3) {
        alert('✨【花色转变魔法】请先在下方手牌中点击勾选 1~3 张要转换花色的卡牌！');
        return;
      }
      const targetSuit = tarot.targetSuit || 'hearts';
      const suitName = targetSuit === 'hearts' ? '红桃' : targetSuit === 'spades' ? '黑桃' : targetSuit === 'diamonds' ? '方块' : '梅花';

      setRunState(prev => ({
        ...prev,
        runDeck: updateRunDeckCards(prev.runDeck, selectedIds, card => ({ ...card, suit: targetSuit })),
        consumables: prev.consumables.filter(c => c.id !== item.id),
      }));
      setSelectedCardIds([]);
      soundEngine.playCardScorePop(1);
      alert(`✨ 成功将选择的 ${selectedCards.length} 张卡牌转换为【${suitName}】！`);
      return;
    }

    if (tarot.effect === 'enhancement') {
      if (selectedCards.length === 0) {
        alert('✨【卡牌强化魔法】请先在下方手牌中点击勾选要强化的卡牌！');
        return;
      }
      const enhancement = tarot.targetEnhancement || 'bonus';
      const enhancementName =
        enhancement === 'glass' ? '水晶玻璃牌(X2倍率)' :
        enhancement === 'gold' ? '黄金牌(每回合加金币)' :
        enhancement === 'steel' ? '钢铁牌(手牌保留X1.5倍)' :
        enhancement === 'lucky' ? '幸运牌(概率加金与倍率)' :
        enhancement === 'mult' ? '倍率卡(+4倍率)' : '加分卡(+30筹码)';

      setRunState(prev => ({
        ...prev,
        runDeck: updateRunDeckCards(prev.runDeck, selectedIds, card => ({ ...card, enhancement })),
        consumables: prev.consumables.filter(c => c.id !== item.id),
      }));
      setSelectedCardIds([]);
      soundEngine.playCardScorePop(2);
      alert(`✨ 成功将选择的 ${selectedCards.length} 张卡牌升级为【${enhancementName}】！`);
      return;
    }

    if (tarot.effect === 'copy') {
      if (selectedCards.length !== 1) {
        alert('✨【镜面魔法】请先在下方手牌中点击勾选 1 张要复制的卡牌！');
        return;
      }
      const sourceCard = selectedCards[0];
      const copiedCard: CardData = {
        ...sourceCard,
        id: `copied_${Date.now()}_${Math.random().toString(36).substr(2, 4)}`,
      };
      setRunState(prev => ({
        ...prev,
        runDeck: [...prev.runDeck, copiedCard],
        consumables: prev.consumables.filter(c => c.id !== item.id),
      }));
      setRoundState(prev => ({ ...prev, hand: [...prev.hand, copiedCard.id] }));
      setSelectedCardIds([]);
      soundEngine.playCardScorePop(3);
      alert(`✨ 成功复制了卡牌【${sourceCard.rank}】并放入手牌与牌组！`);
      return;
    }

    if (tarot.effect === 'destroy') {
      if (selectedCards.length === 0 || selectedCards.length > 2) {
        alert('✨【魔法消除】请先在下方手牌中点击勾选 1~2 张要精简消除的卡牌！');
        return;
      }
      setRunState(prev => ({
        ...prev,
        runDeck: prev.runDeck.filter(c => !selectedIds.has(c.id)),
        consumables: prev.consumables.filter(c => c.id !== item.id),
      }));
      setRoundState(prev => removeCardsFromRound(prev, selectedIds));
      setSelectedCardIds([]);
      soundEngine.playCardScorePop(0);
      alert(`✨ 成功从你的牌组中彻底销毁了 ${selectedCards.length} 张卡牌！`);
      return;
    }
  };

  const currentEvaluatedHand = evaluateHand(
    handCards.filter(c => selectedCardIds.includes(c.id)),
    handLevels
  );

  return (
    <div className="w-full min-h-screen h-screen h-[100dvh] bg-polka-dots text-slate-800 flex flex-col items-center justify-between font-sans relative overflow-x-hidden p-2 sm:p-4 safe-area-p">
      {/* Top Floating Control Bar (Orientation & View switcher) */}
      <div className="z-30 my-2 bg-white/90 backdrop-blur-md p-1.5 px-3 rounded-full border-2 border-[#FFD1DC] shadow-sm flex items-center gap-2 text-xs font-black">
        {/* Orientation Switcher */}
        <button
          onClick={() => setOrientation(orientation === 'landscape' ? 'portrait' : 'landscape')}
          className="px-3 py-1.5 rounded-full bg-[#FFF0F3] text-[#FF6392] hover:bg-[#FFD1DC] transition-all flex items-center gap-1.5 cursor-pointer border border-[#FFB6C1]"
        >
          <RotateCw className="w-3.5 h-3.5" />
          <span>{orientation === 'landscape' ? '📱↔️ 手机横屏模式' : '📱↕️ 手机竖屏模式'}</span>
        </button>

        {/* Screen Switcher */}
        <div className="h-4 w-px bg-[#FFD1DC]" />

        <button
          onClick={() => setCurrentScreen('home')}
          className={`px-3 py-1.5 rounded-full transition-all flex items-center gap-1 cursor-pointer ${
            currentScreen === 'home'
              ? 'bg-[#FF85A1] text-white shadow-xs'
              : 'text-slate-600 hover:bg-[#FFF0F3]'
          }`}
        >
          <Home className="w-3.5 h-3.5" />
          <span>首页</span>
        </button>

        <button
          onClick={() => setCurrentScreen('battle')}
          className={`px-3 py-1.5 rounded-full transition-all flex items-center gap-1 cursor-pointer ${
            currentScreen === 'battle'
              ? 'bg-[#FF85A1] text-white shadow-xs'
              : 'text-slate-600 hover:bg-[#FFF0F3]'
          }`}
        >
          <Swords className="w-3.5 h-3.5" />
          <span>对战</span>
        </button>

        <button
          onClick={() => setShowSettingsModal(true)}
          className="px-3 py-1.5 rounded-full bg-[#FFF0F3] text-[#FF6392] hover:bg-[#FFD1DC] transition-all flex items-center gap-1 cursor-pointer border border-[#FFB6C1]"
          title="游戏设置"
        >
          <Settings className="w-3.5 h-3.5" />
          <span>设置</span>
        </button>
      </div>

      {/* MAIN APP CONTAINER */}
      <div
        className={`w-full mx-auto flex items-center justify-center my-auto transition-all duration-300 flex-1 h-full min-h-0 overflow-hidden ${
          orientation === 'landscape' ? 'max-w-[880px]' : 'max-w-[440px]'
        }`}
      >
        <AnimatePresence mode="wait">
          {currentScreen === 'home' ? (
            <motion.div
              key="home_screen"
              initial={{ opacity: 0, scale: 0.96 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.96 }}
              transition={{ duration: 0.2 }}
              className="w-full h-full flex justify-center items-center overflow-hidden"
            >
              <HomeScreen
                money={money}
                streak={gameStats.totalWins}
                deckCount={runDeck.length}
                maxDeckCount={52}
                activeTab={activeTab}
                setActiveTab={(tab) => {
                  setActiveTab(tab);
                  if (tab === 'battle') setCurrentScreen('battle');
                }}
                onStartBattle={() => setCurrentScreen('battle')}
                onOpenDeckView={() => setShowDeckView(true)}
                onOpenAchievements={() => setShowAchievementsModal(true)}
                onOpenSettings={() => setShowSettingsModal(true)}
                orientation={orientation}
                stats={gameStats}
              />
            </motion.div>
          ) : (
            <motion.div
              key="battle_screen"
              initial={{ opacity: 0, scale: 0.96 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.96 }}
              transition={{ duration: 0.2 }}
              className="w-full h-full flex justify-center items-center overflow-hidden"
            >
              <BattleScreen
                currentScore={currentScore}
                targetScore={targetScore}
                ante={ante}
                blindType={blindType}
                money={money}
                handsLeft={handsLeft}
                discardsLeft={discardsLeft}
                handCards={handCards}
                selectedCardIds={selectedCardIds}
                jokers={jokers}
                consumables={consumables}
                deckCount={roundState.drawPile.length}
                evaluatedHand={currentEvaluatedHand}
                bossRule={bossRule || undefined}
                onToggleSelectCard={handleToggleSelectCard}
                onPlayHand={handlePlayHand}
                onDiscard={handleDiscard}
                onOpenDeckView={() => setShowDeckView(true)}
                onOpenMenu={() => setShowHelpModal(true)}
                onOpenSettings={() => setShowSettingsModal(true)}
                onNavigateHome={() => setCurrentScreen('home')}
                onUseConsumable={handleUseConsumable}
                activeCardBack={activeCardBack}
                streak={3}
                orientation={orientation}
              />
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* OVERLAY MODALS */}

      {/* 1. Scoring Animation Overlay */}
      {screenState === 'scoring' && activeScoring && (
        <HandScoringOverlay
          handEval={activeScoring.handEval}
          playedCards={activeScoring.playedCards}
          jokers={jokers}
          bossRule={bossRule || undefined}
          onScoringComplete={handleScoringComplete}
          cardBack={activeCardBack}
          currentScore={currentScore}
          targetScore={targetScore}
          discardsLeft={discardsLeft}
          money={money}
        />
      )}

      {/* 2. Shop Modal */}
      {screenState === 'shop' && (
        <ShopModal
          money={money}
          jokers={jokers}
          consumables={consumables}
          shopJokers={shopJokers}
          shopConsumables={shopConsumables}
          shopPacks={shopPacks}
          shopVouchers={shopVouchers}
          onBuyJoker={(joker) => {
            if (jokers.length >= 5 || money < joker.cost) return;
            setRunState(prev => ({
              ...prev,
              money: prev.money - joker.cost,
              jokers: [...prev.jokers, joker],
            }));
            setShopJokers(prev => prev.filter(j => j.id !== joker.id));
          }}
          onBuyConsumable={(item) => {
            if (consumables.length >= 2 || money < item.cost) return;
            setRunState(prev => ({
              ...prev,
              money: prev.money - item.cost,
              consumables: [...prev.consumables, item],
            }));
            setShopConsumables(prev => prev.filter(c => c.id !== item.id));
          }}
          onBuyPack={handleBuyPack}
          onBuyVoucher={(v) => {
            setRunState(prev => ({
              ...prev,
              money: prev.money - v.cost,
              vouchers: [...prev.vouchers, v.id],
            }));
          }}
          onSellJoker={(jokerId) => {
            const j = jokers.find(item => item.id === jokerId);
            if (j) {
              setRunState(prev => ({
                ...prev,
                money: prev.money + Math.max(1, Math.floor(j.cost / 2)),
                jokers: prev.jokers.filter(item => item.id !== jokerId),
              }));
            }
          }}
          onSellConsumable={(itemId) => {
            const c = consumables.find(item => item.id === itemId);
            if (c) {
              setRunState(prev => ({
                ...prev,
                money: prev.money + Math.max(1, Math.floor(c.cost / 2)),
                consumables: prev.consumables.filter(item => item.id !== itemId),
              }));
            }
          }}
          onUseConsumable={handleUseConsumable}
          onRerollShop={() => {
            setRunState(prev => ({ ...prev, money: prev.money - 5 }));
            populateShop();
          }}
          onNextRound={handleNextRoundFromShop}
          handLevels={handLevels}
          lastEarningsBreakdown={lastEarningsBreakdown || undefined}
          isRoundCleared={isRoundCleared}
        />
      )}

      {/* 3. Booster Pack Opening Modal */}
      {activePack && (
        <BoosterPackModal
          pack={activePack}
          cardsOptions={packOptions}
          onSelectOption={handleSelectPackOption}
          onClose={() => setActivePack(null)}
          cardBack={activeCardBack}
        />
      )}

      {/* 4. Boss Blind Announcement Notice */}
      {screenState === 'boss_notice' && bossRule && (
        <BossBlindNotice bossRule={bossRule} onStart={() => setScreenState('playing')} />
      )}

      {/* 5. Game Over Modal */}
      {screenState === 'game_over' && (
        <GameOverModal
          isVictory={ante > 8}
          finalAnte={ante}
          finalScore={currentScore}
          earnedCrystals={Math.floor(currentScore / 200) + 10}
          onRestart={() => startNewRun()}
        />
      )}

      {/* 6. Deck View Modal */}
      {showDeckView && (
        <DeckViewModal
          deck={runDeck}
          handLevels={handLevels}
          cardBack={activeCardBack}
          onClose={() => setShowDeckView(false)}
        />
      )}

      {/* 7. Daily Challenge Modal */}
      {showDailyModal && (
        <DailyChallengeModal
          config={getDailyChallengeConfig()}
          isCompleted={false}
          onStartDailyRun={() => {
            setShowDailyModal(false);
            startNewRun(new Date().toISOString().split('T')[0]);
          }}
          onClose={() => setShowDailyModal(false)}
        />
      )}

      {/* 8. Achievements & Redeem Shop Modal */}
      {showAchievementsModal && (
        <AchievementsModal
          achievements={achievements}
          redeemItems={redeemItems}
          crystals={crystals}
          activeCardBack={activeCardBack}
          activeDeckSkin={activeDeckSkin}
          stats={gameStats}
          onClaimAchievement={(achId, reward) => {
            setCrystals(prev => {
              const next = prev + reward;
              saveCrystals(next);
              return next;
            });
            setAchievements(prev => {
              const next = prev.map(a => (a.id === achId ? { ...a, unlocked: true } : a));
              saveAchievements(next);
              return next;
            });
          }}
          onRedeemItem={(item) => {
            if (crystals < item.price) return;
            setCrystals(prev => {
              const next = prev - item.price;
              saveCrystals(next);
              return next;
            });
            setRedeemItems(prev => {
              const next = prev.map(r => (r.id === item.id ? { ...r, unlocked: true } : r));
              saveRedeemItems(next);
              return next;
            });
            if (item.type === 'card_back') setRunState(prev => ({ ...prev, activeCardBack: item.id }));
            if (item.type === 'deck_skin') setRunState(prev => ({ ...prev, activeDeckSkin: item.id }));
          }}
          onSelectCardBack={(id) => setRunState(prev => ({ ...prev, activeCardBack: id }))}
          onSelectDeckSkin={(id) => setRunState(prev => ({ ...prev, activeDeckSkin: id }))}
          onClose={() => setShowAchievementsModal(false)}
        />
      )}

      {/* 9. Rules Help Modal */}
      {showHelpModal && <HelpModal onClose={() => setShowHelpModal(false)} />}

      {/* 10. Settings Modal */}
      {showSettingsModal && (
        <SettingsModal
          sfxEnabled={sfxEnabled}
          bgmVolume={bgmVolume}
          onToggleSfx={handleToggleSfx}
          onChangeBgmVolume={handleChangeBgmVolume}
          onResetGame={() => startNewRun()}
          onResetAllData={() => {
            clearAllGameData();
            setCrystals(0);
            setGameStats(defaultStats);
            setAchievements(INITIAL_ACHIEVEMENTS);
            setRedeemItems(INITIAL_REDEEM_ITEMS);
            startNewRun(undefined, true);
          }}
          onClose={() => setShowSettingsModal(false)}
        />
      )}
    </div>
  );
}
