import React from 'react';
import { motion } from 'motion/react';
import { DailyChallengeConfig } from '../types';
import { Calendar, Sparkles, Trophy, Play, CheckCircle2, X } from 'lucide-react';
import { soundEngine } from '../utils/audio';

interface DailyChallengeModalProps {
  config: DailyChallengeConfig;
  isCompleted: boolean;
  onStartDailyRun: () => void;
  onClose: () => void;
}

export const DailyChallengeModal: React.FC<DailyChallengeModalProps> = ({
  config,
  isCompleted,
  onStartDailyRun,
  onClose,
}) => {
  return (
    <div className="fixed inset-0 bg-pink-950/60 backdrop-blur-md z-50 flex items-center justify-center p-4 safe-area-p select-none">
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        className="w-full max-w-lg bg-gradient-to-b from-white via-pink-50 to-rose-100 rounded-3xl p-6 border-4 border-pink-300 shadow-2xl flex flex-col gap-4 text-center relative max-h-[90vh] max-h-[90dvh] overflow-hidden"
      >
        <button
          onClick={onClose}
          className="absolute top-4 right-4 z-30 text-slate-400 hover:text-slate-600 p-1.5 rounded-full bg-white/80 backdrop-blur-xs shadow-xs hover:bg-pink-100 transition-colors cursor-pointer"
          title="关闭"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Title */}
        <div className="flex flex-col items-center gap-1 shrink-0 pr-6">
          <div className="w-12 h-12 rounded-2xl bg-amber-400 text-amber-950 flex items-center justify-center shadow-md text-2xl font-black">
            <Calendar className="w-7 h-7" />
          </div>
          <h2 className="text-2xl font-black text-amber-900">今日限定挑战 ({config.dateStr})</h2>
          <span className="bg-amber-100 text-amber-800 font-extrabold text-xs px-3 py-1 rounded-full border border-amber-300">
            {config.seedName}
          </span>
        </div>

        {/* Scrollable Content */}
        <div className="flex-1 overflow-y-auto pr-1 flex flex-col gap-4">
          <p className="text-xs sm:text-sm text-slate-600 leading-relaxed font-semibold bg-white/80 p-3 rounded-2xl border border-pink-200">
            {config.description}
          </p>

          {/* Special Modifiers List */}
          <div className="flex flex-col gap-2 text-left bg-amber-50/70 p-3.5 rounded-2xl border border-amber-200">
            <span className="font-extrabold text-xs text-amber-900 flex items-center gap-1">
              <Sparkles className="w-4 h-4 text-amber-600" />
              <span>今日词缀规则:</span>
            </span>
            <div className="flex flex-col gap-1.5 pl-2">
              {config.modifiers.map((mod, idx) => (
                <div key={idx} className="flex items-center gap-2 text-xs font-bold text-slate-700">
                  <span className="w-2 h-2 rounded-full bg-amber-500" />
                  <span>{mod}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Completion status */}
          {isCompleted ? (
            <div className="bg-emerald-100 text-emerald-800 font-extrabold p-3 rounded-2xl border border-emerald-300 flex items-center justify-center gap-2 text-sm">
              <CheckCircle2 className="w-5 h-5 text-emerald-600" />
              <span>今日挑战已完成！已领取草莓水晶奖励 ✨</span>
            </div>
          ) : (
            <button
              onClick={() => {
                soundEngine.playPop();
                onStartDailyRun();
              }}
              className="w-full bg-gradient-to-r from-amber-500 via-rose-500 to-pink-500 hover:from-amber-600 hover:to-pink-600 text-white font-extrabold text-base py-3.5 rounded-2xl shadow-lg transition-all flex items-center justify-center gap-2 active:scale-95 cursor-pointer"
            >
              <Play className="w-5 h-5 fill-white" />
              <span>开启今日挑战局</span>
            </button>
          )}
        </div>
      </motion.div>
    </div>
  );
};
