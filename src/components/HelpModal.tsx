import React from 'react';
import { motion } from 'motion/react';
import { HelpCircle, X, Sparkles, Heart, Zap, Coins, Wand2, Star } from 'lucide-react';

interface HelpModalProps {
  onClose: () => void;
}

export const HelpModal: React.FC<HelpModalProps> = ({ onClose }) => {
  return (
    <div className="fixed inset-0 bg-pink-950/60 backdrop-blur-md z-50 flex items-center justify-center p-2 sm:p-4 safe-area-p select-none overflow-y-auto">
      {/* Main Container matching Settings and Shop */}
      <motion.div
        initial={{ opacity: 0, scale: 0.92 }}
        animate={{ opacity: 1, scale: 1 }}
        exit={{ opacity: 0, scale: 0.92 }}
        className="w-full max-w-xl bg-[#FFFDF8] rounded-[2.5rem] p-4 sm:p-6 border-4 border-[#FBBFCA] shadow-2xl flex flex-col gap-3.5 max-h-[96vh] max-h-[96dvh] relative text-left overflow-y-auto my-auto"
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
          title="关闭指南"
        >
          <X className="w-4 h-4 stroke-[2.5]" />
          <span className="absolute -bottom-1 text-[8px]">🎀</span>
        </button>

        {/* Header */}
        <div className="flex items-center gap-3 pr-8 shrink-0">
          <div className="w-12 h-12 rounded-full bg-[#FFF0F3] border-2 border-dashed border-[#FBBFCA] text-[#E85D75] flex items-center justify-center shadow-xs shrink-0 relative">
            <HelpCircle className="w-6 h-6" />
            <div className="absolute inset-0 rounded-full border border-pink-200 pointer-events-none scale-110" />
          </div>
          <div>
            <h2 className="text-xl sm:text-2xl font-black text-[#D93856] flex items-center gap-1.5 tracking-wide">
              <span>萌心小丑牌 - 玩法指南</span>
              <span className="text-base">🎀</span>
            </h2>
            <p className="text-xs text-[#718096] font-medium">掌握卡牌组合与计算规则，成为最强小丑大导！</p>
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
        <div className="flex-1 flex flex-col gap-3.5 text-xs text-[#2C3E50] leading-relaxed overflow-y-auto pr-1 custom-pink-scrollbar">
          {/* Rule 1: Formula */}
          <div className="bg-[#FFF5F7]/80 p-3.5 sm:p-4 rounded-3xl border-2 border-dashed border-[#F8A4B8] shadow-xs flex flex-col gap-1.5 relative">
            <span className="absolute top-1.5 right-2.5 text-[#F7A8B8] text-[10px]">♡</span>
            <div className="font-extrabold text-sm text-[#D93856] flex items-center gap-1.5">
              <Zap className="w-4 h-4 text-[#3182CE]" />
              <span>1. 计分核心公式</span>
            </div>
            <p className="text-[#4A5568]">
              得分 = <strong className="text-[#3182CE] font-black">总筹码 (Chips)</strong> × <strong className="text-[#D93856] font-black">总倍率 (Mult)</strong>。
              <br />
              • 打出的卡牌点数提供基础筹码。
              <br />
              • 组合牌型（如对子、顺子、同花、葫芦）提供基础筹码与基础倍率。
              <br />
              • 小丑牌 (Jokers) 与魔法卡能够大幅叠加 +筹码、+倍率，甚至总倍率翻倍 (XMult)！
            </p>
          </div>

          {/* Rule 2: Jokers & Consumables */}
          <div className="bg-[#FFF5F7]/80 p-3.5 sm:p-4 rounded-3xl border-2 border-dashed border-[#F8A4B8] shadow-xs flex flex-col gap-1.5 relative">
            <span className="absolute top-1.5 right-2.5 text-[#F7A8B8] text-[10px]">♡</span>
            <div className="font-extrabold text-sm text-[#D93856] flex items-center gap-1.5">
              <Sparkles className="w-4 h-4 text-[#805AD5]" />
              <span>2. 小丑牌与魔法卡</span>
            </div>
            <p className="text-[#4A5568]">
              • <strong className="text-[#2C3E50]">小丑牌 (Jokers)</strong>: 最多携带 5 张，在每次结算时按顺序触发强力特效。
              <br />
              • <strong className="text-[#2C3E50]">魔法塔罗牌 (Tarot)</strong>: 可改变卡牌花色、强化为水晶牌/黄金牌、复制或销毁冗余卡牌。
              <br />
              • <strong className="text-[#2C3E50]">萌星牌 (Planet)</strong>: 可永久升级特定手牌等级，提高基础筹码与倍率！
            </p>
          </div>

          {/* Rule 3: Shop & Blinds */}
          <div className="bg-[#FFF5F7]/80 p-3.5 sm:p-4 rounded-3xl border-2 border-dashed border-[#F8A4B8] shadow-xs flex flex-col gap-1.5 relative">
            <span className="absolute top-1.5 right-2.5 text-[#F7A8B8] text-[10px]">♡</span>
            <div className="font-extrabold text-sm text-[#D93856] flex items-center gap-1.5">
              <Coins className="w-4 h-4 text-[#D69E2E]" />
              <span>3. 关卡与商店利息</span>
            </div>
            <p className="text-[#4A5568]">
              • 每关包含小盲注、大盲注和 Boss 盲注。Boss 盲注拥有特殊限制（如禁用某些花色）。
              <br />
              • 每局结束后，未使用的出牌次数与手中现金均可产生额外零花钱与利息（每 🪙5 获得 🪙1 利息）。
            </p>
          </div>
        </div>

        {/* Stitched Bottom Button */}
        <div className="relative w-full pt-1">
          <button
            onClick={onClose}
            className="w-full py-3 rounded-full bg-gradient-to-r from-[#F8A4B8] via-[#E85D75] to-[#F8A4B8] hover:from-[#E85D75] hover:to-[#D93856] text-white font-black text-base shadow-lg transition-all border-2 border-white cursor-pointer active:scale-[0.98] tracking-widest flex items-center justify-center relative"
          >
            <span>我 拆 懂 了 / 关 闭</span>
          </button>
          <span className="absolute -bottom-2 left-1/2 -translate-x-1/2 text-sm pointer-events-none">🎀</span>
        </div>
      </motion.div>
    </div>
  );
};
