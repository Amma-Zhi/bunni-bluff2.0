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
    <div className="fixed inset-0 bg-pink-950/60 backdrop-blur-md z-50 flex items-center justify-center p-2 sm:p-4 safe-area-p select-none overflow-y-auto">
      {/* Main Outer Container */}
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
        <div className="w-16 h-16 rounded-full bg-[#E85D75] text-white border-2 border-dashed border-white flex items-center justify-center shadow-md animate-bounce relative">
          <ShieldAlert className="w-9 h-9 text-white" />
          <span className="absolute -bottom-1 -right-1 text-sm">🎀</span>
        </div>

        <div>
          <span className="bg-[#FFF0F3] text-[#D93856] font-black text-xs px-3 py-1 rounded-full border border-[#FBBFCA]">
            ⚠️ BOSS 盲注关卡来袭
          </span>
          <h2 className="text-2xl sm:text-3xl font-black text-[#D93856] mt-2">
            【{bossRule.name}】
          </h2>
        </div>

        {/* Dashed Ribbon Divider */}
        <div className="w-full flex items-center justify-center my-0.5 relative">
          <div className="w-full border-t-2 border-dashed border-[#FBBFCA]" />
          <span className="absolute bg-[#FFFDF8] px-2 text-[#718096] text-xs font-bold flex items-center gap-1">
            🎀
          </span>
        </div>

        {/* Description Box */}
        <p className="text-xs sm:text-sm text-[#2C3E50] font-extrabold bg-[#FFF5F7] p-4 rounded-3xl border-2 border-dashed border-[#F8A4B8] shadow-2xs relative">
          <span className="absolute top-1.5 right-2.5 text-[#F7A8B8] text-[10px]">♡</span>
          {bossRule.description}
        </p>

        {/* Action Button */}
        <div className="relative w-full pt-1">
          <button
            onClick={() => {
              soundEngine.playPop();
              onStart();
            }}
            className="w-full py-3.5 rounded-full bg-gradient-to-r from-[#F8A4B8] via-[#E85D75] to-[#F8A4B8] hover:from-[#E85D75] hover:to-[#D93856] text-white font-black text-base shadow-lg transition-all border-2 border-white cursor-pointer active:scale-[0.98] tracking-widest flex items-center justify-center gap-2 relative"
          >
            <span>接 受 挑 战 ！</span>
            <ArrowRight className="w-5 h-5" />
          </button>
          <span className="absolute -bottom-2 left-1/2 -translate-x-1/2 text-sm pointer-events-none">🎀</span>
        </div>
      </motion.div>
    </div>
  );
};
