import React from 'react';
import { motion } from 'motion/react';
import { CardData, HandLevelMap, HandType } from '../types';
import { CardView } from './CardView';
import { Layers, X, Sparkles } from 'lucide-react';

interface DeckViewModalProps {
  deck: CardData[];
  handLevels: HandLevelMap;
  cardBack: string;
  onClose: () => void;
}

// Order matching the reference grid
const HAND_TYPES_ORDER: HandType[] = [
  '高牌',
  '对子',
  '两对',
  '三条',
  '顺子',
  '同花',
  '葫芦',
  '四条',
  '同花顺',
  '皇家同花顺',
  '五条',
  '同花五条',
  '同花葫芦',
];

export const DeckViewModal: React.FC<DeckViewModalProps> = ({
  deck,
  handLevels,
  cardBack,
  onClose,
}) => {
  return (
    <div className="fixed inset-0 bg-pink-950/60 backdrop-blur-md z-50 flex items-center justify-center p-2 sm:p-4 safe-area-p select-none overflow-y-auto">
      {/* Outer Main Container matching Settings and Shop modals */}
      <motion.div
        initial={{ opacity: 0, scale: 0.92 }}
        animate={{ opacity: 1, scale: 1 }}
        exit={{ opacity: 0, scale: 0.92 }}
        className="w-full max-w-4xl bg-[#FFFDF8] rounded-[2.5rem] p-4 sm:p-6 border-4 border-[#FBBFCA] shadow-2xl flex flex-col gap-3.5 max-h-[96vh] max-h-[96dvh] relative text-left overflow-hidden my-auto"
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
        <div className="flex items-center gap-3 pr-8 shrink-0">
          <div className="w-12 h-12 rounded-full bg-[#FFF0F3] border-2 border-dashed border-[#FBBFCA] text-[#E85D75] flex items-center justify-center shadow-xs shrink-0 relative">
            <Layers className="w-6 h-6" />
            <div className="absolute inset-0 rounded-full border border-pink-200 pointer-events-none scale-110" />
          </div>
          <div>
            <h2 className="text-xl sm:text-2xl font-black text-[#D93856] flex items-center gap-1.5 tracking-wide">
              <span>牌组详情与手牌等级</span>
              <span className="text-base">🎀</span>
            </h2>
            <p className="text-xs text-[#718096] font-medium">
              摸牌堆剩余卡牌: <span className="text-[#D93856] font-black">{deck.length}</span> 张
            </p>
          </div>
        </div>

        {/* Dashed Ribbon Divider */}
        <div className="w-full flex items-center justify-center my-0.5 relative">
          <div className="w-full border-t-2 border-dashed border-[#FBBFCA]" />
          <span className="absolute bg-[#FFFDF8] px-2 text-[#718096] text-xs font-bold flex items-center gap-1">
            🎀
          </span>
        </div>

        {/* Scrollable Content Container */}
        <div className="flex-1 flex flex-col gap-3.5 overflow-y-auto pr-1 custom-pink-scrollbar">
          {/* Section 1: Hand Levels & Base Scores */}
          <div className="bg-[#FFF5F7]/80 p-3 sm:p-4 rounded-3xl border-2 border-dashed border-[#F8A4B8] shadow-xs flex flex-col gap-2 relative">
            <span className="absolute top-1 right-2 text-[#F7A8B8] text-[10px]">♡</span>
            
            <div className="self-start inline-flex items-center gap-1 bg-white border border-dashed border-[#F8A4B8] text-[#D93856] font-extrabold text-xs px-3 py-1 rounded-full shadow-2xs">
              <Sparkles className="w-3.5 h-3.5 text-[#E85D75]" />
              <span>手牌等级与基础分值</span>
              <span className="text-xs">🎀</span>
            </div>

            {/* Hand Levels Grid */}
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 landscape:grid-cols-5 gap-1.5 sm:gap-2 mt-1">
              {HAND_TYPES_ORDER.map((handName) => {
                const levelInfo = handLevels[handName] || { level: 1, chips: 10, mult: 1 };
                return (
                  <div
                    key={handName}
                    className="bg-white hover:bg-[#FFF0F3] border-2 border-dashed border-[#F8A4B8] rounded-2xl p-2 flex flex-col items-center justify-center text-center transition-all shadow-2xs group"
                  >
                    <div className="font-extrabold text-[#2C3E50] text-xs tracking-tight group-hover:text-[#D93856] transition-colors truncate w-full">
                      {handName}
                    </div>
                    <div className="text-[10px] text-[#E85D75] font-black mt-0.5">
                      Lv. {levelInfo.level}
                    </div>
                    <div className="flex items-center justify-center text-xs font-black mt-0.5">
                      <span className="text-[#3182CE]">{levelInfo.chips}</span>
                      <span className="text-[#E85D75] font-bold mx-0.5">×</span>
                      <span className="text-[#E85D75]">{levelInfo.mult}</span>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Section 2: Remaining Cards in Deck */}
          <div className="bg-[#FFFDF8] p-3 sm:p-4 rounded-3xl border-2 border-dashed border-[#FBBFCA] shadow-xs flex flex-col gap-2 relative">
            <span className="absolute top-1 right-2 text-[#F7A8B8] text-[10px]">♡</span>

            <div className="self-start inline-flex items-center gap-1 bg-[#FFF0F3] border border-dashed border-[#FBBFCA] text-[#D93856] font-extrabold text-xs px-3 py-1 rounded-full shadow-2xs">
              <span>摸牌堆剩余卡牌 ({deck.length}张)</span>
              <span className="text-xs">🎀</span>
            </div>

            {/* Cards Grid Box */}
            <div className="bg-gingham-blue border-2 border-dashed border-[#BEE3F8] rounded-2xl p-3 relative shadow-xs mt-1">
              <div className="bg-white/95 rounded-xl p-2.5 border border-[#BEE3F8] min-h-[90px] flex flex-wrap items-center justify-start gap-1.5 sm:gap-2 max-h-[220px] overflow-y-auto custom-pink-scrollbar">
                {deck.length > 0 ? (
                  deck.map((card) => (
                    <CardView key={card.id} card={card} cardBack={cardBack} size="sm" isDisabled />
                  ))
                ) : (
                  <div className="w-full text-center py-6 text-xs text-[#718096] font-extrabold">
                    摸牌堆暂无剩余卡牌 🃏
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </motion.div>
    </div>
  );
};
