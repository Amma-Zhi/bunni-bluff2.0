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
  TarotCardData,
  VoucherData,
  GameSaveState,
  GameStats,
} from './types';
import {
  createStandardDeck,
  evaluateHand,
  getTargetScoreForBlind,
  INITIAL_HAND_LEVELS,
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

import { Smartphone, RotateCw, Sparkles, Home, Swords, Settings } from 'lucide-react';

export default function App() {
  // Navigation Screen: 'home' or 'battle'
  const [currentScreen, setCurrentScreen] = useState<'home' | 'battle'>('home');
  const [activeTab, setActiveTab] = useState<string>('home');

  // Screen Orientation mode: 'landscape' (default horizontal mobile) or 'portrait' (vertical mobile)
  const [orientation, setOrientation] = useState<'landscape' | 'portrait'>('landscape');

  // Game Run State
  const [ante, setAnte] = useState<number>(1);
  const [round, setRound] = useState<number>(1);
  const [blindType, setBlindType] = useState<BlindType>('small');
  const [currentScore, setCurrentScore] = useState<number>(0);
  const [targetScore, setTargetScore] = useState<number>(300);
  const [isRoundCleared, setIsRoundCleared] = useState<boolean>(false);
  const [money, setMoney] = useState<number>(10);
  const [handsLeft, setHandsLeft] = useState<number>(4);
  const [discardsLeft, setDiscardsLeft] = useState<number>(3);
  const [handSize, setHandSize] = useState<number>(8);

  const [deck, setDeck] = useState<CardData[]>([]);
  const [handCards, setHandCards] = useState<CardData[]>([]);
  const [discardPile, setDiscardPile] = useState<CardData[]>([]);
  const [selectedCardIds, setSelectedCardIds] = useState<string[]>([]);

  const [jokers, setJokers] = useState<JokerData[]>([]);
  const [consumables, setConsumables] = useState<(TarotCardData | PlanetCardData)[]>([]);
  const [handLevels, setHandLevels] = useState<HandLevelMap>(INITIAL_HAND_LEVELS);
  const [bossRule, setBossRule] = useState<BossRule | undefined>(undefined);
  const [vouchers, setVouchers] = useState<string[]>([]);

  const [isDaily, setIsDaily] = useState<boolean>(false);
  const [dailyDate, setDailyDate] = useState<string>('');

  // Unlockables & Settings State
  const [crystals, setCrystals] = useState<number>(0);
  const [achievements, setAchievements] = useState(INITIAL_ACHIEVEMENTS);
  const [redeemItems, setRedeemItems] = useState(INITIAL_REDEEM_ITEMS);
  const [gameStats, setGameStats] = useState<GameStats>(defaultStats);
  const [activeCardBack, setActiveCardBack] = useState<string>('card_back_sakura');
  const [activeDeckSkin, setActiveDeckSkin] = useState<string>('deck_default');

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
    setAnte(save.ante);
    setRound(save.round);
    setBlindType(save.blindType);
    setMoney(save.money ?? 4);
    setHandsLeft(save.handsLeft);
    setDiscardsLeft(save.discardsLeft);
    setHandSize(save.handSize || 8);
    setCurrentScore(save.currentScore || 0);
    setTargetScore(save.targetScore || getTargetScoreForBlind(save.ante, save.blindType, save.round));
    setIsRoundCleared(save.isRoundCleared ?? false);
    setJokers(save.jokers || []);
    setConsumables(save.consumables || []);
    setHandLevels(save.handLevels || INITIAL_HAND_LEVELS);
    setDeck(save.deck || []);
    setHandCards(save.handCards || []);
    setDiscardPile(save.discardPile || []);
    setBossRule(save.bossRule);
    setIsDaily(save.isDaily || false);
    setDailyDate(save.dailyDate || '');
    setActiveCardBack(save.activeCardBack || 'card_back_sakura');
    setActiveDeckSkin(save.activeDeckSkin || 'deck_default');
    setVouchers(save.vouchers || []);
    setScreenState('playing');
  };

  const startNewRun = (customDailyDate?: string) => {
    const freshDeck = createStandardDeck();
    const initialHand = freshDeck.slice(0, 8);
    const drawPile = freshDeck.slice(8);

    let startMoney = 4; // Adjusted starting money for economy balance
    let initialJokers: JokerData[] = [];

    if (customDailyDate) {
      const dailyConfig = getDailyChallengeConfig(new Date(customDailyDate));
      startMoney += dailyConfig.extraStartingMoney;
      setIsDaily(true);
      setDailyDate(customDailyDate);
    } else {
      setIsDaily(false);
      setDailyDate('');
    }

    setAnte(1);
    setRound(1);
    setBlindType('small');
    setMoney(startMoney);
    setHandsLeft(4);
    setDiscardsLeft(3);
    setHandSize(8);
    setCurrentScore(0);
    setTargetScore(getTargetScoreForBlind(1, 'small', 1));
    setIsRoundCleared(false);
    setJokers(initialJokers);
    setConsumables([]);
    setHandLevels(INITIAL_HAND_LEVELS);
    setDeck(drawPile);
    setHandCards(initialHand);
    setDiscardPile([]);
    setSelectedCardIds([]);
    setBossRule(undefined);
    setVouchers([]);
    setLastEarningsBreakdown(null);
    setScreenState('playing');

    saveGameRun(null);
  };

  // Generate random Shop Inventory
  const populateShop = () => {
    const shuffledJokers = [...JOKERS_LIST].sort(() => Math.random() - 0.5);
    setShopJokers(shuffledJokers.slice(0, 2));

    const combinedConsumables = [...TAROT_CARDS, ...PLANET_CARDS].sort(() => Math.random() - 0.5);
    setShopConsumables(combinedConsumables.slice(0, 2));

    setShopPacks(BOOSTER_PACKS);

    const unboughtVouchers = VOUCHERS.map(v => ({
      ...v,
      bought: vouchers.includes(v.id),
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

    const discarded = handCards.filter(c => selectedCardIds.includes(c.id));
    const remainingHand = handCards.filter(c => !selectedCardIds.includes(c.id));

    const neededCount = Math.min(deck.length, selectedCardIds.length);
    const drawn = deck.slice(0, neededCount);
    const newDeck = deck.slice(neededCount);

    setDiscardPile(prev => [...prev, ...discarded]);
    setHandCards([...remainingHand, ...drawn]);
    setDeck(newDeck);
    setSelectedCardIds([]);
    setDiscardsLeft(prev => prev - 1);
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
    setCurrentScore(newScore);

    const remainingHand = handCards.filter(c => !selectedCardIds.includes(c.id));
    const played = handCards.filter(c => selectedCardIds.includes(c.id));

    const survivedPlayed = played.filter(c => {
      if (c.enhancement === 'glass') {
        return Math.random() > 0.25;
      }
      return true;
    });

    const newDiscardPile = [...discardPile, ...survivedPlayed];

    const needed = Math.min(deck.length, handSize - remainingHand.length);
    const drawn = deck.slice(0, needed);
    const newDeck = deck.slice(needed);

    setHandCards([...remainingHand, ...drawn]);
    setDeck(newDeck);
    setDiscardPile(newDiscardPile);
    setSelectedCardIds([]);

    const newHandsLeft = handsLeft - 1;
    setHandsLeft(newHandsLeft);

    const stats = loadGameStats();
    if (scoredPoints > stats.highestHandScore) {
      stats.highestHandScore = scoredPoints;
      saveGameStats(stats);
    }

    if (newScore >= targetScore) {
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

      setMoney(prev => prev + totalEarned);
      setIsRoundCleared(true);
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
    let nextRound = round + 1;
    let nextAnte = ante;

    if (blindType === 'small') {
      nextBlind = 'big';
    } else if (blindType === 'big') {
      nextBlind = 'boss';
      const rule = BOSS_RULES[Math.floor(Math.random() * BOSS_RULES.length)];
      setBossRule(rule);
    } else {
      nextBlind = 'small';
      nextAnte = ante + 1;
      setBossRule(undefined);

      if (nextAnte > 8) {
        const earnedCrystals = 100;
        saveCrystals(crystals + earnedCrystals);
        setCrystals(prev => prev + earnedCrystals);
        saveGameRun(null);
        setScreenState('game_over');
        return;
      }
    }

    const fullDeck = createStandardDeck();
    const initialHand = fullDeck.slice(0, handSize);
    const drawPile = fullDeck.slice(handSize);

    const nextTarget = getTargetScoreForBlind(nextAnte, nextBlind, nextRound);

    setAnte(nextAnte);
    setRound(nextRound);
    setBlindType(nextBlind);
    setTargetScore(nextTarget);
    setCurrentScore(0);
    setIsRoundCleared(false);
    setHandsLeft(4);
    setDiscardsLeft(3);
    setDeck(drawPile);
    setHandCards(initialHand);
    setDiscardPile([]);
    setSelectedCardIds([]);

    if (nextBlind === 'boss' && bossRule) {
      setScreenState('boss_notice');
    } else {
      setScreenState('playing');
    }
  };

  const handleBuyPack = (pack: BoosterPackData) => {
    if (money < pack.cost) return;
    if (pack.packType !== 'standard' && consumables.length >= 2) return;

    setMoney(prev => prev - pack.cost);
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
      setDeck(prev => [...prev, item as CardData]);
    } else {
      if (consumables.length < 2) {
        setConsumables(prev => [...prev, item as TarotCardData | PlanetCardData]);
      }
    }
  };

  const handleUseConsumable = (item: TarotCardData | PlanetCardData) => {
    // 1. Planet Cards (Level up hand)
    if ('handType' in item) {
      const planet = item as PlanetCardData;
      setHandLevels(prev => {
        const current = prev[planet.handType] || { level: 1, chips: 10, mult: 1 };
        return {
          ...prev,
          [planet.handType]: {
            level: current.level + 1,
            chips: current.chips + planet.chipsBonus,
            mult: current.mult + planet.multBonus,
          },
        };
      });
      setConsumables(prev => prev.filter(c => c.id !== item.id));
      soundEngine.playFinalRewardChime();
      alert(`✨【${planet.handType}】手牌等级提升至 Lv.${(handLevels[planet.handType]?.level || 1) + 1}！基础筹码 +${planet.chipsBonus}，基础倍率 +${planet.multBonus}`);
      return;
    }

    // 2. Tarot Cards
    const tarot = item as TarotCardData;

    if (tarot.effect === 'money') {
      setMoney(prev => prev + 15);
      setConsumables(prev => prev.filter(c => c.id !== item.id));
      soundEngine.playCoin();
      alert('✨【聚宝盆】魔法发挥！获得 🪙15 金币！');
      return;
    }

    const selectedCards = handCards.filter(c => selectedCardIds.includes(c.id));
    const selectedIds = new Set(selectedCardIds);

    if (tarot.effect === 'suit_change') {
      if (selectedCards.length === 0 || selectedCards.length > 3) {
        alert('✨【花色转变魔法】请先在下方手牌中点击勾选 1~3 张要转换花色的卡牌！');
        return;
      }
      const targetSuit = tarot.targetSuit || 'hearts';
      const suitName = targetSuit === 'hearts' ? '红桃' : targetSuit === 'spades' ? '黑桃' : targetSuit === 'diamonds' ? '方块' : '梅花';

      setHandCards(prev => prev.map(c => selectedIds.has(c.id) ? { ...c, suit: targetSuit } : c));
      setDeck(prev => prev.map(c => selectedIds.has(c.id) ? { ...c, suit: targetSuit } : c));
      setConsumables(prev => prev.filter(c => c.id !== item.id));
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

      setHandCards(prev => prev.map(c => selectedIds.has(c.id) ? { ...c, enhancement } : c));
      setDeck(prev => prev.map(c => selectedIds.has(c.id) ? { ...c, enhancement } : c));
      setConsumables(prev => prev.filter(c => c.id !== item.id));
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
      setHandCards(prev => [...prev, copiedCard]);
      setDeck(prev => [...prev, copiedCard]);
      setConsumables(prev => prev.filter(c => c.id !== item.id));
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
      setHandCards(prev => prev.filter(c => !selectedIds.has(c.id)));
      setDeck(prev => prev.filter(c => !selectedIds.has(c.id)));
      setConsumables(prev => prev.filter(c => c.id !== item.id));
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
                deckCount={24}
                maxDeckCount={52}
                activeTab={activeTab}
                setActiveTab={(tab) => {
                  setActiveTab(tab);
                  if (tab === 'battle') setCurrentScreen('battle');
                }}
                onStartBattle={() => setCurrentScreen('battle')}
                onOpenShop={() => {
                  populateShop();
                  setScreenState('shop');
                }}
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
                round={round}
                maxRound={8}
                ante={ante}
                money={money}
                handsLeft={handsLeft}
                discardsLeft={discardsLeft}
                handCards={handCards}
                selectedCardIds={selectedCardIds}
                jokers={jokers}
                consumables={consumables}
                deckCount={deck.length || 24}
                evaluatedHand={currentEvaluatedHand}
                bossRule={bossRule || undefined}
                onToggleSelectCard={handleToggleSelectCard}
                onPlayHand={handlePlayHand}
                onDiscard={handleDiscard}
                onOpenShop={() => {
                  populateShop();
                  setScreenState('shop');
                }}
                onOpenDeckView={() => setShowDeckView(true)}
                onOpenMenu={() => setShowHelpModal(true)}
                onOpenSettings={() => setShowSettingsModal(true)}
                onNavigateHome={() => setCurrentScreen('home')}
                onUseConsumable={handleUseConsumable}
                onSellConsumable={(itemId) => {
                  const c = consumables.find(item => item.id === itemId);
                  if (c) {
                    setMoney(prev => prev + Math.max(1, Math.floor(c.cost / 2)));
                    setConsumables(prev => prev.filter(item => item.id !== itemId));
                  }
                }}
                onSellJoker={(jokerId) => {
                  const j = jokers.find(item => item.id === jokerId);
                  if (j) {
                    setMoney(prev => prev + Math.max(1, Math.floor(j.cost / 2)));
                    setJokers(prev => prev.filter(item => item.id !== jokerId));
                  }
                }}
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
            setMoney(prev => prev - joker.cost);
            setJokers(prev => [...prev, joker]);
            setShopJokers(prev => prev.filter(j => j.id !== joker.id));
          }}
          onBuyConsumable={(item) => {
            if (consumables.length >= 2 || money < item.cost) return;
            setMoney(prev => prev - item.cost);
            setConsumables(prev => [...prev, item]);
            setShopConsumables(prev => prev.filter(c => c.id !== item.id));
          }}
          onBuyPack={handleBuyPack}
          onBuyVoucher={(v) => {
            setMoney(prev => prev - v.cost);
            setVouchers(prev => [...prev, v.id]);
          }}
          onSellJoker={(jokerId) => {
            const j = jokers.find(item => item.id === jokerId);
            if (j) {
              setMoney(prev => prev + Math.max(1, Math.floor(j.cost / 2)));
              setJokers(prev => prev.filter(item => item.id !== jokerId));
            }
          }}
          onSellConsumable={(itemId) => {
            const c = consumables.find(item => item.id === itemId);
            if (c) {
              setMoney(prev => prev + Math.max(1, Math.floor(c.cost / 2)));
              setConsumables(prev => prev.filter(item => item.id !== itemId));
            }
          }}
          onUseConsumable={handleUseConsumable}
          onRerollShop={() => {
            setMoney(prev => prev - 5);
            populateShop();
          }}
          onNextRound={handleNextRoundFromShop}
          onClose={() => setScreenState('playing')}
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
          deck={deck}
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
            if (item.type === 'card_back') setActiveCardBack(item.id);
            if (item.type === 'deck_skin') setActiveDeckSkin(item.id);
          }}
          onSelectCardBack={(id) => setActiveCardBack(id)}
          onSelectDeckSkin={(id) => setActiveDeckSkin(id)}
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
            setActiveCardBack('card_back_sakura');
            setActiveDeckSkin('deck_default');
            startNewRun();
          }}
          onClose={() => setShowSettingsModal(false)}
        />
      )}
    </div>
  );
}
