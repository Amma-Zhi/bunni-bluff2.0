import React from 'react';
import { motion } from 'motion/react';
import { HelpCircle, X, Sparkles, Heart, Zap, Coins } from 'lucide-react';

interface HelpModalProps {
  onClose: () => void;
}

export const HelpModal: React.FC<HelpModalProps> = ({ onClose }) => {
  return (
    <div className="fixed inset-0 bg-pink-950/60 backdrop-blur-md z-50 flex items-center justify-center p-4 safe-area-p select-none">
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        className="w-full max-w-xl bg-gradient-to-b from-white via-pink-50 to-rose-100 rounded-3xl p-6 border-4 border-pink-300 shadow-2xl flex flex-col gap-4 max-h-[90vh] max-h-[90dvh] relative text-left overflow-hidden"
      >
        <button
          onClick={onClose}
          className="absolute top-4 right-4 z-30 text-slate-400 hover:text-slate-600 p-1.5 rounded-full bg-white/80 backdrop-blur-xs hover:bg-pink-100 transition-colors shadow-xs cursor-pointer"
          title="关闭"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Title */}
        <div className="flex items-center gap-2 border-b-2 border-pink-200 pb-3 pr-8 shrink-0">
          <div className="w-10 h-10 rounded-2xl bg-sky-400 text-white flex items-center justify-center shadow-md">
            <HelpCircle className="w-6 h-6" />
          </div>
          <div>
            <h2 className="text-xl font-black text-rose-600">萌心小丑牌 - 玩法指南</h2>
            <p className="text-xs text-slate-500">掌握卡牌组合与计算规则，成为最强小丑大导！</p>
          </div>
        </div>

        {/* Sections */}
        <div className="flex-1 flex flex-col gap-3 text-xs text-slate-700 leading-relaxed overflow-y-auto pr-1">
          {/* Rule 1: Formula */}
          <div className="bg-white p-3.5 rounded-2xl border border-pink-200 shadow-xs flex flex-col gap-1.5">
            <div className="font-extrabold text-sm text-rose-600 flex items-center gap-1">
              <Zap className="w-4 h-4 text-sky-500" />
              <span>1. 计分核心公式</span>
            </div>
            <p>
              得分 = <strong className="text-sky-600">总筹码 (Chips)</strong> × <strong className="text-rose-600">总倍率 (Mult)</strong>。
              <br />
              • 打出的卡牌点数提供基础筹码。
              <br />
              • 组合牌型（如对子、顺子、同花、葫芦）提供基础筹码与基础倍率。
              <br />
              • 小丑牌 (Jokers) 与魔法卡能够大幅叠加 +筹码、+倍率，甚至总倍率翻倍 (XMult)！
            </p>
          </div>

          {/* Rule 2: Jokers & Consumables */}
          <div className="bg-white p-3.5 rounded-2xl border border-pink-200 shadow-xs flex flex-col gap-1.5">
            <div className="font-extrabold text-sm text-rose-600 flex items-center gap-1">
              <Sparkles className="w-4 h-4 text-purple-500" />
              <span>2. 小丑牌与魔法卡</span>
            </div>
            <p>
              • <strong>小丑牌 (Jokers)</strong>: 最多携带 5 张，在每次结算时按顺序触发强力特效。
              <br />
              • <strong>魔法塔罗牌 (Tarot)</strong>: 可改变卡牌花色、强化为水晶牌/黄金牌、复制或销毁冗余卡牌。
              <br />
              • <strong>萌星牌 (Planet)</strong>: 可永久升级特定手牌等级，提高基础筹码与倍率！
            </p>
          </div>

          {/* Rule 3: Shop & Blinds */}
          <div className="bg-white p-3.5 rounded-2xl border border-pink-200 shadow-xs flex flex-col gap-1.5">
            <div className="font-extrabold text-sm text-rose-600 flex items-center gap-1">
              <Coins className="w-4 h-4 text-amber-500" />
              <span>3. 关卡与商店利息</span>
            </div>
            <p>
              • 每关包含小盲注、大盲注和 Boss 盲注。Boss 盲注拥有特殊限制（如禁用某些花色）。
              <br />
              • 每局结束后，未使用的出牌次数与手中现金均可产生额外零花钱与利息（每 🪙5 获得 🪙1 利息）。
            </p>
          </div>
        </div>
      </motion.div>
    </div>
  );
};
