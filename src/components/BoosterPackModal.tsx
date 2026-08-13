import React, { useState } from 'react';
import { motion } from 'motion/react';
import { BoosterPackData, CardData, PlanetCardData, TarotCardData } from '../types';
import { JokerCard } from './JokerCard';
import { CardView } from './CardView';
import { soundEngine } from '../utils/audio';
import { Sparkles, Layers, Check, X } from 'lucide-react';

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
    <div className="fixed inset-0 bg-pink-950/70 backdrop-blur-md z-50 flex items-center justify-center p-4 safe-area-p select-none">
      <motion.div
        initial={{ opacity: 0, scale: 0.8 }}
        animate={{ opacity: 1, scale: 1 }}
        className="w-full max-w-2xl bg-gradient-to-b from-white via-pink-50 to-rose-100 rounded-3xl p-6 border-4 border-pink-300 shadow-2xl flex flex-col items-center gap-4 text-center relative max-h-[90vh] max-h-[90dvh] overflow-hidden"
      >
        <button
          onClick={onClose}
          className="absolute top-4 right-4 z-30 text-slate-400 hover:text-slate-600 p-1.5 rounded-full bg-white/80 backdrop-blur-xs shadow-xs hover:bg-pink-100 transition-colors cursor-pointer"
          title="关闭"
        >
          <X className="w-5 h-5" />
        </button>

        <div className="flex items-center gap-2 bg-gradient-to-r from-pink-500 to-rose-500 text-white font-black text-lg sm:text-xl px-5 py-2 rounded-full shadow-md shrink-0">
          <Sparkles className="w-5 h-5 animate-spin" />
          <span>开启【{pack.name}】</span>
        </div>

        <div className="flex-1 overflow-y-auto pr-1 flex flex-col items-center gap-4 w-full">
          <p className="text-xs sm:text-sm text-slate-600 font-bold">
            可选择 <span className="text-rose-600 font-extrabold">{pack.selectCount - selectedIds.length}</span> 张卡牌加入你的备选或牌组！
          </p>

          {/* Options Row */}
          <div className="flex items-center justify-center gap-4 flex-wrap my-2 min-h-[160px]">
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
                      <div className="absolute inset-0 bg-rose-500/40 rounded-2xl flex items-center justify-center">
                        <Check className="w-10 h-10 text-white stroke-[3]" />
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
                    <div className="absolute inset-0 bg-rose-500/40 rounded-2xl flex items-center justify-center">
                      <Check className="w-10 h-10 text-white stroke-[3]" />
                    </div>
                  )}
                </div>
              );
            })}
          </div>

          <button
            onClick={onClose}
            className="bg-slate-200 hover:bg-slate-300 text-slate-700 font-bold text-xs px-6 py-2 rounded-xl transition-colors cursor-pointer"
          >
            放弃剩余卡牌
          </button>
        </div>
      </motion.div>
    </div>
  );
};
