import React, { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { BossRule, CardData, HandEvaluation, JokerData } from '../types';
import { CardView } from './CardView';
import { soundEngine } from '../utils/audio';
import { Sparkles, Zap, Trophy, Flame, Lock } from 'lucide-react';
import confetti from 'canvas-confetti';

interface HandScoringOverlayProps {
  handEval: HandEvaluation;
  playedCards: CardData[];
  jokers: JokerData[];
  bossRule?: BossRule;
  onScoringComplete: (finalHandScore: number) => void;
  cardBack: string;
  currentScore?: number;
  targetScore?: number;
  discardsLeft?: number;
  money?: number;
}

export const HandScoringOverlay: React.FC<HandScoringOverlayProps> = ({
  handEval,
  playedCards,
  jokers,
  bossRule,
  onScoringComplete,
  cardBack,
  currentScore = 0,
  targetScore = 30000,
  discardsLeft = 3,
  money = 10,
}) => {
  const [chips, setChips] = useState<number>(handEval.baseChips);
  const [mult, setMult] = useState<number>(handEval.baseMult);
  const [activeCardIdx, setActiveCardIdx] = useState<number>(-1);
  const [activeJokerIdx, setActiveJokerIdx] = useState<number>(-1);
  const [isFinishedScoring, setIsFinishedScoring] = useState<boolean>(false);
  const [finalScore, setFinalScore] = useState<number>(0);

  // Floating delta tag for active step feedback
  const [floatingText, setFloatingText] = useState<{ text: string; color: string } | null>(null);

  // Smooth numeric count-up state for total calculated hand score
  const totalCalculated = chips * mult;
  const [animatedScore, setAnimatedScore] = useState<number>(handEval.baseChips * handEval.baseMult);
  const [confettiTriggered, setConfettiTriggered] = useState<boolean>(false);

  // Smooth count-up interpolation effect synchronized with step timing
  useEffect(() => {
    let startTimestamp: number | null = null;
    const startVal = animatedScore;
    const endVal = totalCalculated;
    if (startVal === endVal) return;

    const duration = 700; // ms for smooth rolling score count-up per step
    let animationFrameId: number;

    const stepFn = (timestamp: number) => {
      if (!startTimestamp) startTimestamp = timestamp;
      const progress = Math.min((timestamp - startTimestamp) / duration, 1);
      const ease = 1 - Math.pow(1 - progress, 3);
      const currentVal = Math.round(startVal + (endVal - startVal) * ease);
      setAnimatedScore(currentVal);

      if (progress < 1) {
        animationFrameId = requestAnimationFrame(stepFn);
      }
    };

    animationFrameId = requestAnimationFrame(stepFn);
    return () => cancelAnimationFrame(animationFrameId);
  }, [totalCalculated]);

  // Total accumulated round score and target progress
  const accumulatedRoundScore = currentScore + animatedScore;
  const targetProgressPercent = Math.min(100, Math.max(0, (accumulatedRoundScore / Math.max(1, targetScore)) * 100));

  // Trigger confetti if total target is passed
  useEffect(() => {
    if (!confettiTriggered && accumulatedRoundScore >= targetScore && targetScore > 0) {
      setConfettiTriggered(true);
      try {
        confetti({
          particleCount: 70,
          spread: 60,
          origin: { y: 0.7 },
          colors: ['#ff69b4', '#ffb6c1', '#ffd700', '#60a5fa'],
        });
      } catch {
        // Ignore fallback
      }
    }
  }, [accumulatedRoundScore, targetScore, confettiTriggered]);

  useEffect(() => {
    let isCancelled = false;

    async function runScoringSequence() {
      // 1. Initial delay
      await new Promise(r => setTimeout(r, 300));
      if (isCancelled) return;

      // Check Banned Hand Types for active Boss Rule
      if (bossRule?.bannedHandTypes?.includes(handEval.handType)) {
        setChips(0);
        setMult(0);
        setFloatingText({ text: `🚫 禁出牌型【${handEval.handType}】！本局出牌无效 0分`, color: 'text-[#D93856] font-extrabold' });
        await new Promise(r => setTimeout(r, 1200));
        if (!isCancelled) {
          setFinalScore(0);
          setIsFinishedScoring(true);
        }
        return;
      }

      const hasSplashJoker = jokers.some(j => j.id === 'joker_splash');

      // 2. Score cards one by one (Checking scoringCards)
      let currentChips = handEval.baseChips;
      let currentMult = handEval.baseMult;

      for (let i = 0; i < playedCards.length; i++) {
        const card = playedCards[i];
        setActiveCardIdx(i);
        soundEngine.playCardFlip();

        const isScoringCard = handEval.scoringCards.some(sc => sc.id === card.id) || hasSplashJoker;

        if (isScoringCard) {
          let addChips = card.value || 10;
          let addMult = 0;

          if (card.enhancement === 'bonus') addChips += 30;
          if (card.enhancement === 'mult') addMult += 4;
          if (card.edition === 'foil') addChips += 50;
          if (card.edition === 'holographic') addMult += 10;

          currentChips += addChips;
          currentMult += addMult;

          setChips(currentChips);
          setMult(currentMult);

          const deltaMsg = addMult > 0 ? `+${addChips} 筹码 / +${addMult} 倍率` : `+${addChips} 筹码`;
          setFloatingText({ text: deltaMsg, color: 'text-[#3182CE] font-black' });
          soundEngine.playCardScorePop(i);
        } else {
          setFloatingText({ text: `❌ 陪衬牌 (0筹码)`, color: 'text-slate-400 font-extrabold' });
        }

        await new Promise(r => setTimeout(r, 800));
        if (isCancelled) return;
      }

      setActiveCardIdx(-1);

      // 3. Trigger Jokers sequentially
      for (let j = 0; j < jokers.length; j++) {
        const joker = jokers[j];
        setActiveJokerIdx(j);

        const isJokerDisabled = bossRule?.disabledJokerIndices?.includes(j);

        if (isJokerDisabled) {
          setFloatingText({ text: `🔒 ${joker.name} 处于印封状态（失效）`, color: 'text-rose-500 font-extrabold' });
          await new Promise(r => setTimeout(r, 600));
          if (isCancelled) return;
          continue;
        }

        soundEngine.playJokerTrigger();

        let jokerDesc = `🤡 ${joker.name}`;

        if (joker.id === 'joker_bear') {
          currentChips += 40;
          jokerDesc += ' +40 筹码';
        } else if (joker.id === 'joker_kitty') {
          const heartCount = playedCards.filter(c => c.suit === 'hearts').length;
          const added = heartCount * 5;
          currentMult += added;
          jokerDesc += ` +${added} 倍率`;
        } else if (joker.id === 'joker_donut' && (handEval.handType === '两对' || handEval.handType === '葫芦' || handEval.handType === '同花葫芦')) {
          currentMult = Math.floor(currentMult * 1.5);
          jokerDesc += ' ×1.5 倍率';
        } else if (joker.id === 'joker_bunny') {
          currentChips += 20;
          jokerDesc += ' +20 筹码';
        } else if (joker.id === 'joker_wand') {
          currentMult += 10;
          jokerDesc += ' +10 倍率';
        } else if (joker.id === 'joker_piggy') {
          const piggyBonus = Math.min(30, Math.floor(money / 5) * 3);
          currentMult += piggyBonus;
          jokerDesc += ` +${piggyBonus} 倍率`;
        } else if (joker.id === 'joker_rocking_horse' && (handEval.handType === '高牌' || handEval.handType === '对子')) {
          currentChips += 25;
          currentMult += 4;
          jokerDesc += ' +25 筹码 / +4 倍率';
        } else if (joker.id === 'joker_kitsune' && handEval.handType.includes('同花')) {
          currentChips += 60;
          currentMult += 6;
          jokerDesc += ' +60 筹码 / +6 倍率';
        } else if (joker.id === 'joker_icecream') {
          currentChips += 100;
          jokerDesc += ' +100 筹码';
        } else if (joker.id === 'joker_creampuff') {
          const faceCount = playedCards.filter(c => ['J', 'Q', 'K'].includes(c.rank)).length;
          const added = faceCount * 6;
          currentMult += added;
          jokerDesc += ` +${added} 倍率`;
        } else if (joker.id === 'joker_sheep') {
          currentChips += 36;
          jokerDesc += ' +36 筹码';
        } else if (joker.id === 'joker_paw') {
          const hasGlass = playedCards.some(c => c.enhancement === 'glass');
          if (hasGlass) {
            currentMult = Math.floor(currentMult * 2.5);
            jokerDesc += ' ×2.5 倍率 (猫爪庇护)';
          }
        } else if (joker.id === 'joker_unicorn' && (handEval.handType === '顺子' || handEval.handType === '同花顺')) {
          currentMult = Math.floor(currentMult * 2.0);
          jokerDesc += ' ×2.0 倍率';
        } else if (joker.id === 'joker_pearl' && discardsLeft === 0) {
          currentMult = Math.floor(currentMult * 1.8);
          jokerDesc += ' ×1.8 倍率';
        } else if (joker.id === 'joker_giftbox') {
          currentChips += 25;
          jokerDesc += ' +25 筹码';
        } else if (joker.id === 'joker_tiramisu') {
          const added = discardsLeft * 20;
          currentChips += added;
          jokerDesc += ` +${added} 筹码`;
        } else if (joker.id === 'joker_king_pudding' && playedCards.some(c => c.rank === 'K')) {
          currentMult += 15;
          jokerDesc += ' +15 倍率';
        } else if (joker.id === 'joker_magic_ribbon' && (handEval.handType === '三条' || handEval.handType === '四条')) {
          currentMult = Math.floor(currentMult * 1.75);
          jokerDesc += ' ×1.75 倍率';
        } else if (joker.id === 'joker_stars' && handEval.handType.includes('对')) {
          currentChips += 30;
          currentMult += 5;
          jokerDesc += ' +30 筹码 / +5 倍率';
        } else if (joker.id === 'joker_splash') {
          jokerDesc += ' 全牌强制参与计分生效';
        } else if (joker.id === 'joker_legend_angel') {
          currentMult = Math.floor(currentMult * 2.2);
          jokerDesc += ' ×2.2 倍率';
        } else {
          currentMult += 5;
          jokerDesc += ' +5 倍率';
        }

        setChips(currentChips);
        setMult(currentMult);
        setFloatingText({ text: jokerDesc, color: 'text-[#D69E2E] font-extrabold' });

        await new Promise(r => setTimeout(r, 850));
        if (isCancelled) return;
      }

      setActiveJokerIdx(-1);
      setFloatingText(null);

      // 4. Final tally calculation complete
      const calculatedScore = currentChips * currentMult;
      soundEngine.playFinalRewardChime();

      if (!isCancelled) {
        setFinalScore(calculatedScore);
        setIsFinishedScoring(true);
      }
    }

    runScoringSequence();

    return () => {
      isCancelled = true;
    };
  }, []);

  return (
    <div className="fixed inset-0 bg-pink-950/60 backdrop-blur-md z-50 flex flex-col items-center justify-center p-2 sm:p-4 safe-area-p select-none overflow-y-auto">
      {/* Outer Main Container */}
      <motion.div
        initial={{ scale: 0.92, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        className="w-full max-w-xl bg-[#FFFDF8] rounded-[2.5rem] p-4 sm:p-6 border-4 border-[#FBBFCA] shadow-2xl flex flex-col items-center gap-3.5 text-center relative max-h-[96vh] max-h-[96dvh] overflow-y-auto my-auto"
        style={{
          boxShadow: '0 12px 36px rgba(244, 114, 182, 0.25), inset 0 0 0 3px #FFF0F3',
        }}
      >
        {/* Corner Hearts */}
        <span className="absolute top-2.5 left-3 text-[#F7A8B8] text-xs font-serif">♡</span>
        <span className="absolute top-2.5 right-3 text-[#F7A8B8] text-xs font-serif">♡</span>
        <span className="absolute bottom-2.5 left-3 text-[#F7A8B8] text-xs font-serif">♡</span>
        <span className="absolute bottom-2.5 right-3 text-[#F7A8B8] text-xs font-serif">♡</span>

        {/* Hand Title Badge */}
        <div className="bg-gradient-to-r from-[#F8A4B8] via-[#E85D75] to-[#D93856] text-white font-black text-lg sm:text-2xl px-6 py-2 rounded-full shadow-md border-2 border-white flex items-center gap-2">
          <Sparkles className="w-5 h-5 sm:w-6 sm:h-6 animate-spin" />
          <span>{handEval.handType}</span>
          <span className="text-base">🎀</span>
        </div>

        {/* Floating Step Modifier Feedback Tag */}
        <div className="h-6 flex items-center justify-center">
          <AnimatePresence mode="wait">
            {floatingText && (
              <motion.div
                key={floatingText.text}
                initial={{ opacity: 0, y: 10, scale: 0.8 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                exit={{ opacity: 0, y: -10, scale: 0.8 }}
                className={`px-3 py-1 rounded-full bg-white border-2 border-[#FBBFCA] shadow-xs font-black text-xs ${floatingText.color}`}
              >
                {floatingText.text}
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* Played Cards Row */}
        <div className="flex items-center justify-center gap-2 flex-wrap min-h-28 bg-gingham-pink p-3 rounded-2xl border-2 border-dashed border-[#F8A4B8] w-full">
          {playedCards.map((card, idx) => {
            const isScoring = handEval.scoringCards.some(sc => sc.id === card.id) || jokers.some(j => j.id === 'joker_splash');
            return (
              <div key={card.id} className="relative">
                <CardView
                  card={card}
                  isScoring={activeCardIdx === idx}
                  cardBack={cardBack}
                  size="md"
                />
                {!isScoring && (
                  <div className="absolute top-1 right-1 bg-slate-700/80 text-white text-[9px] font-black px-1.5 py-0.5 rounded-md shadow-xs pointer-events-none">
                    陪衬
                  </div>
                )}
              </div>
            );
          })}
        </div>

        {/* Triggered Jokers Row */}
        {jokers.length > 0 && (
          <div className="flex items-center justify-center gap-2 flex-wrap">
            {jokers.map((joker, idx) => (
              <motion.div
                key={joker.id + idx}
                animate={
                  activeJokerIdx === idx
                    ? {
                        scale: [1, 1.35, 1.2],
                        y: [0, -18, -10],
                        rotate: [0, -5, 5, 0],
                        boxShadow: [
                          '0 2px 8px rgba(0,0,0,0.1)',
                          '0 14px 28px rgba(236, 201, 75, 0.85)',
                          '0 8px 18px rgba(236, 201, 75, 0.7)',
                        ],
                      }
                    : { scale: 1, y: 0, rotate: 0 }
                }
                transition={
                  activeJokerIdx === idx
                    ? { duration: 0.8, times: [0, 0.4, 1], ease: 'easeOut' }
                    : { type: 'spring', stiffness: 300, damping: 20 }
                }
                className={`px-3 py-1.5 rounded-2xl border-2 font-black text-xs shadow-xs flex items-center gap-1 transition-colors ${
                  activeJokerIdx === idx
                    ? 'bg-[#FEFCBF] text-[#744210] border-[#ECC94B] ring-4 ring-[#FEF08A]'
                    : 'bg-white text-[#2C3E50] border-[#FBBFCA]'
                }`}
              >
                <span>🤡</span>
                <span>{joker.name}</span>
              </motion.div>
            ))}
          </div>
        )}

        {/* Chips x Mult Formula Panel */}
        <div className="w-full bg-[#FFF5F7] p-3.5 sm:p-4 rounded-3xl border-2 border-dashed border-[#F8A4B8] shadow-xs flex items-center justify-around gap-2 text-lg sm:text-2xl font-black relative overflow-hidden">
          <span className="absolute top-1.5 right-2.5 text-[#F7A8B8] text-[10px]">♡</span>
          
          {/* Chips */}
          <div className="flex flex-col items-center text-[#3182CE]">
            <span className="text-[11px] sm:text-xs text-[#3182CE] font-extrabold">筹码 (Chips)</span>
            <div className="flex items-center gap-1">
              <Zap className="w-4 h-4 sm:w-5 sm:h-5 fill-[#63B3ED] text-[#3182CE]" />
              <motion.span
                key={chips}
                initial={{ scale: 1.3, y: -3 }}
                animate={{ scale: 1, y: 0 }}
                transition={{ type: 'spring', stiffness: 500, damping: 18 }}
              >
                {chips}
              </motion.span>
            </div>
          </div>

          <span className="text-[#F8A4B8] font-extrabold text-xl sm:text-2xl">×</span>

          {/* Mult */}
          <div className="flex flex-col items-center text-[#D93856]">
            <span className="text-[11px] sm:text-xs text-[#E85D75] font-extrabold">倍率 (Mult)</span>
            <div className="flex items-center gap-1">
              <Sparkles className="w-4 h-4 sm:w-5 sm:h-5 fill-[#F8A4B8] text-[#D93856]" />
              <motion.span
                key={mult}
                initial={{ scale: 1.3, y: -3 }}
                animate={{ scale: 1, y: 0 }}
                transition={{ type: 'spring', stiffness: 500, damping: 18 }}
              >
                {mult}
              </motion.span>
            </div>
          </div>

          <span className="text-[#F8A4B8] font-extrabold text-xl sm:text-2xl">=</span>

          {/* Calculated Score */}
          <div className="flex flex-col items-center text-[#D93856]">
            <span className="text-[11px] sm:text-xs text-[#E85D75] font-extrabold">牌型得分</span>
            <motion.span
              key={totalCalculated}
              initial={{ scale: 1.3, filter: 'brightness(1.2)' }}
              animate={{ scale: 1, filter: 'brightness(1)' }}
              transition={{ type: 'spring', stiffness: 400, damping: 15 }}
              className="text-xl sm:text-3xl font-black text-[#D93856] tracking-tight"
            >
              {animatedScore.toLocaleString()}
            </motion.span>
          </div>
        </div>

        {/* Target Score Progress Bar */}
        <div className="w-full bg-[#FFFDF8] p-3 sm:p-4 rounded-3xl border-2 border-dashed border-[#FBBFCA] shadow-xs flex flex-col gap-2 text-left">
          <div className="flex items-center justify-between text-xs font-black">
            <div className="flex items-center gap-1.5 text-[#2C3E50]">
              <Trophy className="w-4 h-4 text-[#D69E2E] fill-[#FEFCBF]" />
              <span>目标分数进度</span>
              {accumulatedRoundScore >= targetScore && (
                <motion.span
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  className="text-[10px] bg-emerald-500 text-white px-2 py-0.5 rounded-full shadow-2xs font-extrabold flex items-center gap-0.5"
                >
                  <Flame className="w-3 h-3 fill-amber-300" />
                  <span>目标达成！</span>
                </motion.span>
              )}
            </div>

            <div className="flex items-center gap-1 text-[#D93856] font-black">
              <span>{accumulatedRoundScore.toLocaleString()}</span>
              <span className="text-[#718096] font-normal">/ {targetScore.toLocaleString()}</span>
              <span className="bg-[#FFF0F3] text-[#D93856] text-[11px] px-2 py-0.5 rounded-full border border-[#FBBFCA] ml-1 font-bold">
                {targetProgressPercent.toFixed(1)}%
              </span>
            </div>
          </div>

          <div className="w-full h-3.5 bg-[#FFF0F3] rounded-full overflow-hidden p-0.5 border border-[#FBBFCA] relative shadow-inner">
            <motion.div
              className={`h-full rounded-full relative shadow-xs ${
                accumulatedRoundScore >= targetScore
                  ? 'bg-gradient-to-r from-emerald-400 via-teal-400 to-[#D69E2E]'
                  : 'bg-gradient-to-r from-[#F8A4B8] via-[#E85D75] to-[#D93856]'
              }`}
              initial={{ width: `${Math.min(100, Math.max(0, (currentScore / Math.max(1, targetScore)) * 100))}%` }}
              animate={{ width: `${targetProgressPercent}%` }}
              transition={{ type: 'spring', stiffness: 120, damping: 20 }}
            />
          </div>
        </div>

        {/* Manual Continue Action Button */}
        {isFinishedScoring && (
          <div className="relative w-full pt-1">
            <motion.button
              initial={{ scale: 0.92, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              onClick={() => {
                soundEngine.playPop();
                onScoringComplete(finalScore);
              }}
              className="w-full py-3.5 rounded-full bg-gradient-to-r from-[#F8A4B8] via-[#E85D75] to-[#F8A4B8] hover:from-[#E85D75] hover:to-[#D93856] text-white font-black text-base shadow-lg transition-all border-2 border-white cursor-pointer active:scale-[0.98] tracking-widest flex items-center justify-center gap-2 relative animate-pulse"
            >
              <span>{accumulatedRoundScore >= targetScore ? '🎉 关卡通关！点击【进入商店】' : '👉 点击【继续结算】'}</span>
            </motion.button>
            <span className="absolute -bottom-2 left-1/2 -translate-x-1/2 text-sm pointer-events-none">🎀</span>
          </div>
        )}
      </motion.div>
    </div>
  );
};
