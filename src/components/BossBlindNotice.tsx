import React from 'react';
import { motion } from 'motion/react';
import { BossRule } from '../types';
import { ShieldAlert, ArrowRight, Sparkles } from 'lucide-react';
import { soundEngine } from '../utils/audio';

interface BossBlindNoticeProps {
  bossRule: BossRule;
  onStart: () => void;
}

export const BossBlindNotice: React.FC<BossBlindNoticeProps> = ({ bossRule, onStart }) => {
  return (
    <div className="fixed inset-0 bg-pink-950/70 backdrop-blur-md z-50 flex items-center justify-center p-4 safe-area-p select-none">
      <motion.div
        initial={{ opacity: 0, scale: 0.8 }}
        animate={{ opacity: 1, scale: 1 }}
        className="w-full max-w-md bg-gradient-to-b from-white via-rose-50 to-pink-100 rounded-3xl p-6 sm:p-8 border-4 border-rose-400 shadow-2xl flex flex-col items-center gap-5 text-center max-h-[90vh] max-h-[90dvh] overflow-y-auto"
      >
        <div className="w-16 h-16 rounded-3xl bg-rose-500 text-white flex items-center justify-center shadow-lg animate-bounce">
          <ShieldAlert className="w-10 h-10" />
        </div>

        <div>
          <span className="bg-rose-100 text-rose-800 font-black text-xs px-3 py-1 rounded-full border border-rose-300">
            ⚠️ BOSS 盲注关卡来袭
          </span>
          <h2 className="text-2xl sm:text-3xl font-black text-rose-700 mt-2">
            【{bossRule.name}】
          </h2>
        </div>

        <p className="text-xs sm:text-sm text-slate-700 font-extrabold bg-white/80 p-4 rounded-2xl border border-rose-200">
          {bossRule.description}
        </p>

        <button
          onClick={() => {
            soundEngine.playPop();
            onStart();
          }}
          className="w-full bg-gradient-to-r from-rose-500 to-pink-600 hover:from-rose-600 hover:to-pink-700 text-white font-extrabold text-base py-3.5 rounded-2xl shadow-lg transition-all flex items-center justify-center gap-2 active:scale-95 cursor-pointer"
        >
          <span>接受挑战！</span>
          <ArrowRight className="w-5 h-5" />
        </button>
      </motion.div>
    </div>
  );
};
