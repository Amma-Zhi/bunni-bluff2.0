import React, { useEffect } from 'react';
import { motion } from 'motion/react';
import confetti from 'canvas-confetti';
import { Trophy, Sparkles, RotateCcw, Frown, Award, Heart, Coins } from 'lucide-react';
import { soundEngine } from '../utils/audio';

interface GameOverModalProps {
  isVictory: boolean;
  finalAnte: number;
  finalScore: number;
  earnedCrystals: number;
  onRestart: () => void;
}

export const GameOverModal: React.FC<GameOverModalProps> = ({
  isVictory,
  finalAnte,
  finalScore,
  earnedCrystals,
  onRestart,
}) => {
  useEffect(() => {
    if (isVictory) {
      soundEngine.playVictory();
      try {
        confetti({
          particleCount: 100,
          spread: 70,
          origin: { y: 0.6 },
          colors: ['#ff69b4', '#ffb6c1', '#ffd700', '#ffffff'],
        });
      } catch {
        // Ignore
      }
    } else {
      soundEngine.playDefeat();
    }
  }, [isVictory]);

  return (
    <div className="fixed inset-0 bg-pink-950/60 backdrop-blur-md z-50 flex items-center justify-center p-2 sm:p-4 safe-area-p select-none overflow-y-auto">
      {/* Outer Main Container */}
      <motion.div
        initial={{ opacity: 0, scale: 0.92 }}
        animate={{ opacity: 1, scale: 1 }}
        exit={{ opacity: 0, scale: 0.92 }}
        className="w-full max-w-md bg-[#FFFDF8] rounded-[2.5rem] p-5 sm:p-7 border-4 border-[#FBBFCA] shadow-2xl flex flex-col items-center gap-4 text-center relative overflow-y-auto my-auto"
        style={{
          boxShadow: '0 12px 36px rgba(244, 114, 182, 0.25), inset 0 0 0 3px #FFF0F3',
        }}
      >
        {/* Corner Hearts */}
        <span className="absolute top-2.5 left-3 text-[#F7A8B8] text-xs font-serif">♡</span>
        <span className="absolute top-2.5 right-3 text-[#F7A8B8] text-xs font-serif">♡</span>
        <span className="absolute bottom-2.5 left-3 text-[#F7A8B8] text-xs font-serif">♡</span>
        <span className="absolute bottom-2.5 right-3 text-[#F7A8B8] text-xs font-serif">♡</span>

        {/* Icon Badge */}
        <div
          className={`w-16 h-16 rounded-full border-2 border-dashed border-white flex items-center justify-center text-white shadow-md text-3xl font-black relative ${
            isVictory ? 'bg-gradient-to-tr from-[#F8A4B8] via-[#E85D75] to-[#D93856]' : 'bg-[#A0AEC0]'
          }`}
        >
          {isVictory ? <Trophy className="w-8 h-8 text-white" /> : <Frown className="w-8 h-8 text-white" />}
          <span className="absolute -bottom-1 -right-1 text-sm">🎀</span>
        </div>

        {/* Title */}
        <div>
          <h2 className="text-2xl sm:text-3xl font-black text-[#D93856] flex items-center justify-center gap-1.5">
            <span>{isVictory ? '🎉 恭喜大获全胜！' : '💔 挑战遗憾结束'}</span>
          </h2>
          <p className="text-xs text-[#718096] font-medium mt-1">
            {isVictory
              ? '你成功通关了 Ante 8 所有的盲注与 Boss 考验！'
              : `在 Ante ${finalAnte} 止步，再接再厉吧！`}
          </p>
        </div>

        {/* Dashed Ribbon Divider */}
        <div className="w-full flex items-center justify-center my-0.5 relative">
          <div className="w-full border-t-2 border-dashed border-[#FBBFCA]" />
          <span className="absolute bg-[#FFFDF8] px-2 text-[#718096] text-xs font-bold flex items-center gap-1">
            🎀
          </span>
        </div>

        {/* Stats Summary Card */}
        <div className="w-full bg-[#FFF5F7] p-4 rounded-3xl border-2 border-dashed border-[#F8A4B8] shadow-xs flex flex-col gap-2.5 text-xs text-left relative">
          <span className="absolute top-1.5 right-2.5 text-[#F7A8B8] text-[10px]">♡</span>
          
          <div className="flex items-center justify-between font-extrabold text-[#2C3E50]">
            <span>最终突破关卡:</span>
            <span className="font-black text-[#D93856] text-sm bg-white px-2.5 py-0.5 rounded-full border border-[#F8A4B8]">
              Ante {finalAnte}
            </span>
          </div>

          <div className="flex items-center justify-between font-extrabold text-[#2C3E50]">
            <span>最佳手牌得分:</span>
            <span className="font-black text-[#D93856] text-sm bg-white px-2.5 py-0.5 rounded-full border border-[#F8A4B8]">
              {finalScore.toLocaleString()}
            </span>
          </div>

          <div className="flex items-center justify-between font-extrabold text-[#2C3E50] border-t-2 border-dashed border-[#F8A4B8] pt-2">
            <span>奖励获得的草莓水晶:</span>
            <span className="font-black text-[#D93856] text-sm flex items-center gap-1 bg-white px-2.5 py-0.5 rounded-full border border-[#F8A4B8]">
              <Sparkles className="w-3.5 h-3.5 text-[#E85D75] fill-[#FFD1DC]" />
              <span>+{earnedCrystals}</span>
            </span>
          </div>
        </div>

        {/* Restart Button */}
        <div className="w-full pt-1 relative">
          <button
            onClick={() => {
              soundEngine.playPop();
              onRestart();
            }}
            className="w-full py-3.5 rounded-full bg-gradient-to-r from-[#F8A4B8] via-[#E85D75] to-[#F8A4B8] hover:from-[#E85D75] hover:to-[#D93856] text-white font-black text-base shadow-lg transition-all border-2 border-white cursor-pointer active:scale-[0.98] tracking-widest flex items-center justify-center gap-2 relative"
          >
            <RotateCcw className="w-5 h-5" />
            <span>开启新一局游戏</span>
          </button>
          <span className="absolute -bottom-2 left-1/2 -translate-x-1/2 text-sm pointer-events-none">🎀</span>
        </div>
      </motion.div>
    </div>
  );
};
