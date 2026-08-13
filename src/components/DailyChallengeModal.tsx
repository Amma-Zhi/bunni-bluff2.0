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
    <div className="fixed inset-0 bg-pink-950/60 backdrop-blur-md z-50 flex items-center justify-center p-2 sm:p-4 safe-area-p select-none overflow-y-auto">
      {/* Main Outer Container */}
      <motion.div
        initial={{ opacity: 0, scale: 0.92 }}
        animate={{ opacity: 1, scale: 1 }}
        exit={{ opacity: 0, scale: 0.92 }}
        className="w-full max-w-lg bg-[#FFFDF8] rounded-[2.5rem] p-4 sm:p-6 border-4 border-[#FBBFCA] shadow-2xl flex flex-col gap-3.5 max-h-[96vh] max-h-[96dvh] relative text-center overflow-y-auto my-auto"
        style={{
          boxShadow: '0 12px 36px rgba(244, 114, 182, 0.25), inset 0 0 0 3px #FFF0F3',
        }}
      >
        {/* Corner Hearts */}
        <span className="absolute top-2.5 left-3 text-[#F7A8B8] text-xs font-serif">♡</span>
        <span className="absolute top-2.5 right-12 text-[#F7A8B8] text-xs font-serif">♡</span>
        <span className="absolute bottom-2.5 left-3 text-[#F7A8B8] text-xs font-serif">♡</span>
        <span className="absolute bottom-2.5 right-3 text-[#F7A8B8] text-xs font-serif">♡</span>

        {/* Top Close Button */}
        <button
          onClick={onClose}
          className="absolute top-3 right-3 z-30 w-8 h-8 rounded-full bg-white border-2 border-[#FBBFCA] text-[#718096] hover:text-[#E53E3E] hover:bg-[#FFF0F3] flex items-center justify-center shadow-xs transition-transform cursor-pointer active:scale-90"
          title="关闭"
        >
          <X className="w-4 h-4 stroke-[2.5]" />
          <span className="absolute -bottom-1 text-[8px]">🎀</span>
        </button>

        {/* Header */}
        <div className="flex items-center gap-3 pr-8 shrink-0 text-left">
          <div className="w-12 h-12 rounded-full bg-[#FFF0F3] border-2 border-dashed border-[#FBBFCA] text-[#E85D75] flex items-center justify-center shadow-xs shrink-0 relative">
            <Calendar className="w-6 h-6" />
            <div className="absolute inset-0 rounded-full border border-pink-200 pointer-events-none scale-110" />
          </div>
          <div>
            <h2 className="text-xl sm:text-2xl font-black text-[#D93856] flex items-center gap-1.5 tracking-wide">
              <span>今日限定挑战</span>
              <span className="text-base">🎀</span>
            </h2>
            <p className="text-xs text-[#718096] font-medium">日期: {config.dateStr} • 种子: {config.seedName}</p>
          </div>
        </div>

        {/* Dashed Ribbon Divider */}
        <div className="w-full flex items-center justify-center my-0.5 relative">
          <div className="w-full border-t-2 border-dashed border-[#FBBFCA]" />
          <span className="absolute bg-[#FFFDF8] px-2 text-[#718096] text-xs font-bold flex items-center gap-1">
            🎀
          </span>
        </div>

        {/* Scrollable Content Body */}
        <div className="flex-1 overflow-y-auto pr-1 flex flex-col gap-3.5 custom-pink-scrollbar">
          <p className="text-xs sm:text-sm text-[#2C3E50] leading-relaxed font-bold bg-[#FFF5F7] p-3.5 rounded-3xl border-2 border-dashed border-[#F8A4B8] shadow-2xs">
            {config.description}
          </p>

          {/* Special Modifiers List */}
          <div className="flex flex-col gap-2 text-left bg-[#FEFCBF]/80 p-3.5 rounded-3xl border-2 border-dashed border-[#ECC94B] relative shadow-2xs">
            <span className="absolute top-1.5 right-2.5 text-[#D69E2E] text-[10px]">♡</span>
            <span className="font-extrabold text-xs text-[#744210] flex items-center gap-1">
              <Sparkles className="w-4 h-4 text-[#D69E2E]" />
              <span>今日词缀规则:</span>
            </span>
            <div className="flex flex-col gap-1.5 pl-2">
              {config.modifiers.map((mod, idx) => (
                <div key={idx} className="flex items-center gap-2 text-xs font-bold text-[#744210]">
                  <span className="w-2 h-2 rounded-full bg-[#D69E2E]" />
                  <span>{mod}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Completion status or Start button */}
          {isCompleted ? (
            <div className="bg-[#C6F6D5] text-[#22543D] font-extrabold p-3.5 rounded-3xl border-2 border-dashed border-[#38A169] flex items-center justify-center gap-2 text-xs sm:text-sm shadow-2xs">
              <CheckCircle2 className="w-5 h-5 text-[#2F855A]" />
              <span>今日挑战已完成！已领取草莓水晶奖励 ✨</span>
            </div>
          ) : (
            <div className="relative w-full pt-1">
              <button
                onClick={() => {
                  soundEngine.playPop();
                  onStartDailyRun();
                }}
                className="w-full py-3.5 rounded-full bg-gradient-to-r from-[#F8A4B8] via-[#E85D75] to-[#F8A4B8] hover:from-[#E85D75] hover:to-[#D93856] text-white font-black text-base shadow-lg transition-all border-2 border-white cursor-pointer active:scale-[0.98] tracking-widest flex items-center justify-center gap-2 relative"
              >
                <Play className="w-5 h-5 fill-white" />
                <span>开启今日挑战局</span>
              </button>
              <span className="absolute -bottom-2 left-1/2 -translate-x-1/2 text-sm pointer-events-none">🎀</span>
            </div>
          )}
        </div>
      </motion.div>
    </div>
  );
};
