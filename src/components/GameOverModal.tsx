import React, { useEffect } from 'react';
import { motion } from 'motion/react';
import confetti from 'canvas-confetti';
import { Trophy, Sparkles, RotateCcw, Frown } from 'lucide-react';
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
    <div className="fixed inset-0 bg-pink-950/70 backdrop-blur-md z-50 flex items-center justify-center p-4 safe-area-p select-none">
      <motion.div
        initial={{ opacity: 0, scale: 0.8 }}
        animate={{ opacity: 1, scale: 1 }}
        className="w-full max-w-md bg-gradient-to-b from-white via-pink-50 to-rose-100 rounded-3xl p-6 sm:p-8 border-4 border-pink-300 shadow-2xl flex flex-col items-center gap-5 text-center max-h-[90vh] max-h-[90dvh] overflow-y-auto"
      >
        <div className={`w-16 h-16 rounded-3xl flex items-center justify-center text-white shadow-lg text-3xl font-black ${
          isVictory ? 'bg-gradient-to-tr from-amber-400 to-rose-500' : 'bg-slate-400'
        }`}>
          {isVictory ? <Trophy className="w-10 h-10" /> : <Frown className="w-10 h-10" />}
        </div>

        <div>
          <h2 className="text-2xl sm:text-3xl font-black text-rose-600">
            {isVictory ? '🎉 恭喜大获全胜！' : '💔 挑战遗憾结束'}
          </h2>
          <p className="text-xs text-slate-500 mt-1">
            {isVictory
              ? '你成功通关了 Ante 8 所有的盲注与 Boss 考验！'
              : `在 Ante ${finalAnte} 止步，再接再厉吧！`}
          </p>
        </div>

        {/* Stats summary */}
        <div className="w-full bg-white p-4 rounded-2xl border-2 border-pink-200 shadow-inner flex flex-col gap-2">
          <div className="flex items-center justify-between text-xs font-bold text-slate-600">
            <span>最终突破关卡:</span>
            <span className="font-black text-rose-600 text-sm">Ante {finalAnte}</span>
          </div>
          <div className="flex items-center justify-between text-xs font-bold text-slate-600">
            <span>最佳手牌得分:</span>
            <span className="font-black text-rose-600 text-sm">{finalScore.toLocaleString()}</span>
          </div>
          <div className="flex items-center justify-between text-xs font-bold text-slate-600 border-t border-pink-100 pt-2">
            <span>奖励获得的草莓水晶:</span>
            <span className="font-black text-rose-600 text-sm flex items-center gap-1">
              <Sparkles className="w-4 h-4 fill-rose-300" />
              <span>+{earnedCrystals}</span>
            </span>
          </div>
        </div>

        <button
          onClick={() => {
            soundEngine.playPop();
            onRestart();
          }}
          className="w-full bg-gradient-to-r from-pink-500 via-rose-500 to-pink-600 hover:from-pink-600 hover:to-rose-600 text-white font-extrabold text-base py-3.5 rounded-2xl shadow-lg transition-all flex items-center justify-center gap-2 active:scale-95 cursor-pointer"
        >
          <RotateCcw className="w-5 h-5" />
          <span>开启新一局游戏</span>
        </button>
      </motion.div>
    </div>
  );
};
