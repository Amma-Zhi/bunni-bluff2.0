import React, { useState } from 'react';
import { motion } from 'motion/react';
import { BoosterPackData, CardData, PlanetCardData, TarotCardData } from '../types';
import { JokerCard } from './JokerCard';
import { CardView } from './CardView';
import { soundEngine } from '../utils/audio';
import { Sparkles, Layers, Check, X, Package } from 'lucide-react';

interface BoosterPackModalProps {
  pack: BoosterPackData;
  cardsOptions: (TarotCardData | PlanetCardData | CardData)[];
  onSelectOption: (item: TarotCardData | PlanetCardData | CardData) => void;
  onClose: () => void;
  cardBack: string;
}

export const BoosterPackModal: React.FC<BoosterPackModalProps> = ({
  pack,
  cardsOptions,
  onSelectOption,
  onClose,
  cardBack,
}) => {
  const [selectedIds, setSelectedIds] = useState<string[]>([]);

  const isStandardPack = pack.packType === 'standard';

  const handlePick = (item: TarotCardData | PlanetCardData | CardData) => {
    soundEngine.playCardFlip();
    onSelectOption(item);
    setSelectedIds((prev) => [...prev, item.id]);
    if (selectedIds.length + 1 >= pack.selectCount) {
      setTimeout(() => {
        onClose();
      }, 400);
    }
  };

  return (
    <div className="fixed inset-0 bg-pink-950/60 backdrop-blur-md z-50 flex items-center justify-center p-2 sm:p-4 safe-area-p select-none overflow-y-auto">
      {/* Outer Main Cute Container */}
      <motion.div
        initial={{ opacity: 0, scale: 0.92 }}
        animate={{ opacity: 1, scale: 1 }}
        exit={{ opacity: 0, scale: 0.92 }}
        className="w-full max-w-2xl bg-[#FFFDF8] rounded-[2.5rem] p-4 sm:p-6 border-4 border-[#FBBFCA] shadow-2xl flex flex-col gap-3.5 max-h-[96vh] max-h-[96dvh] relative text-center overflow-y-auto my-auto"
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
            <Package className="w-6 h-6" />
            <div className="absolute inset-0 rounded-full border border-pink-200 pointer-events-none scale-110" />
          </div>
          <div>
            <h2 className="text-xl sm:text-2xl font-black text-[#D93856] flex items-center gap-1.5 tracking-wide">
              <span>开启【{pack.name}】</span>
              <span className="text-base">🎀</span>
            </h2>
            <p className="text-xs text-[#718096] font-medium">挑选你心仪的特别卡牌加入牌组吧！</p>
          </div>
        </div>

        {/* Dashed Ribbon Divider */}
        <div className="w-full flex items-center justify-center my-0.5 relative">
          <div className="w-full border-t-2 border-dashed border-[#FBBFCA]" />
          <span className="absolute bg-[#FFFDF8] px-2 text-[#718096] text-xs font-bold flex items-center gap-1">
            🎀
          </span>
        </div>

        <div className="flex-1 overflow-y-auto pr-1 flex flex-col items-center gap-4 w-full custom-pink-scrollbar">
          {/* Status Badge */}
          <div className="bg-[#FFF5F7] border-2 border-dashed border-[#F8A4B8] px-4 py-2 rounded-2xl text-xs sm:text-sm text-[#2C3E50] font-bold shadow-2xs">
            还可选择 <span className="text-[#D93856] font-black text-base mx-0.5">{pack.selectCount - selectedIds.length}</span> 张卡牌加入你的牌组！
          </div>

          {/* Options Grid Frame */}
          <div className="w-full bg-gingham-pink border-2 border-dashed border-[#F8A4B8] rounded-3xl p-4 min-h-[180px] flex items-center justify-center gap-4 flex-wrap relative shadow-xs">
            {cardsOptions.map((item) => {
              const isPicked = selectedIds.includes(item.id);

              if (isStandardPack) {
                const card = item as CardData;
                return (
                  <div key={card.id} className="relative">
                    <CardView
                      card={card}
                      cardBack={cardBack}
                      size="lg"
                      isDisabled={isPicked}
                      onClick={() => !isPicked && handlePick(card)}
                    />
                    {isPicked && (
                      <div className="absolute inset-0 bg-[#E85D75]/60 rounded-2xl flex items-center justify-center backdrop-blur-xs">
                        <Check className="w-10 h-10 text-white stroke-[3.5]" />
                      </div>
                    )}
                  </div>
                );
              }

              const consumable = item as TarotCardData | PlanetCardData;
              return (
                <div key={consumable.id} className="relative">
                  <JokerCard
                    item={consumable}
                    type={'targetSuit' in consumable ? 'tarot' : 'planet'}
                    isDisabled={isPicked}
                    onClick={() => !isPicked && handlePick(consumable)}
                  />
                  {isPicked && (
                    <div className="absolute inset-0 bg-[#E85D75]/60 rounded-2xl flex items-center justify-center backdrop-blur-xs">
                      <Check className="w-10 h-10 text-white stroke-[3.5]" />
                    </div>
                  )}
                </div>
              );
            })}
          </div>

          <button
            onClick={onClose}
            className="px-6 py-2 rounded-full bg-white hover:bg-[#FFF0F3] text-[#718096] hover:text-[#D93856] font-extrabold text-xs border-2 border-[#FBBFCA] transition-all cursor-pointer shadow-xs active:scale-95"
          >
            放弃剩余卡牌并关闭
          </button>
        </div>
      </motion.div>
    </div>
  );
};
