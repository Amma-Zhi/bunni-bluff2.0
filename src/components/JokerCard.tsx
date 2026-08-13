import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { JokerData, PlanetCardData, TarotCardData } from '../types';
import * as Icons from 'lucide-react';
import { Info, X } from 'lucide-react';

interface JokerCardProps {
  item: JokerData | TarotCardData | PlanetCardData;
  type: 'joker' | 'tarot' | 'planet';
  onClick?: () => void;
  onSell?: () => void;
  price?: number;
  isShopItem?: boolean;
  isDisabled?: boolean;
  isTriggered?: boolean;
}

export const JokerCard: React.FC<JokerCardProps> = ({
  item,
  type,
  onClick,
  onSell,
  price,
  isShopItem = false,
  isDisabled = false,
  isTriggered = false,
}) => {
  const [showDetail, setShowDetail] = useState(false);

  // Dynamically resolve Lucide Icon
  const IconComponent = (Icons as unknown as Record<string, React.ElementType>)[item.icon] || Icons.Sparkles;

  const getRarityBadge = () => {
    if (type === 'joker') {
      const joker = item as JokerData;
      switch (joker.rarity) {
        case '普通':
          return 'bg-[#FFF0F3] text-[#FF6392] border-[#FFD1DC]';
        case '罕见':
          return 'bg-purple-100 text-purple-700 border-purple-300';
        case '稀有':
          return 'bg-[#FF6392] text-white border-[#E0607E] font-bold';
        case '传说':
          return 'bg-gradient-to-r from-amber-400 via-[#FF85A1] to-purple-500 text-white font-black animate-pulse';
      }
    }
    if (type === 'tarot') return 'bg-purple-100 text-purple-800 border-purple-300';
    return 'bg-sky-100 text-sky-800 border-sky-300';
  };

  return (
    <>
      <motion.div
        whileHover={isDisabled ? {} : { scale: 1.06, y: -4 }}
        whileTap={isDisabled ? {} : { scale: 0.95 }}
        animate={
          isTriggered
            ? { scale: [1, 1.25, 1], rotate: [0, -6, 6, 0] }
            : { scale: 1 }
        }
        transition={{ duration: 0.25 }}
        onClick={isDisabled ? undefined : onClick}
        className={`relative w-24 h-36 sm:w-28 sm:h-40 rounded-2xl p-2 bg-white border-2 border-[#FFB3C6] shadow-md flex flex-col justify-between select-none cursor-pointer overflow-hidden group/card ${
          isDisabled ? 'opacity-50 cursor-not-allowed' : ''
        }`}
      >
        {/* Top Header Badge & Detail Info Icon */}
        <div className="flex items-center justify-between w-full z-10">
          <span
            className={`text-[10px] px-1.5 py-0.5 rounded-full border shadow-xs ${getRarityBadge()}`}
          >
            {type === 'joker'
              ? (item as JokerData).rarity
              : type === 'tarot'
              ? '魔法牌'
              : '萌星牌'}
          </span>

          <div className="flex items-center gap-1">
            {price !== undefined && (
              <span className="bg-amber-400 text-amber-950 font-black text-xs px-1.5 py-0.5 rounded-full shadow-xs flex items-center gap-0.5">
                🪙{price}
              </span>
            )}
            <button
              onClick={(e) => {
                e.stopPropagation();
                setShowDetail(true);
              }}
              className="w-5 h-5 rounded-full bg-[#FFF0F3] hover:bg-[#FFD1DC] text-[#FF6392] flex items-center justify-center transition-colors shadow-2xs"
              title="点击查看完整详情"
            >
              <Info className="w-3 h-3" />
            </button>
          </div>
        </div>

        {/* Center Icon & Title */}
        <div className="flex flex-col items-center justify-center my-auto text-center px-0.5">
          <div className="w-9 h-9 sm:w-10 sm:h-10 rounded-xl bg-[#FFF0F3] text-[#FF6392] flex items-center justify-center shadow-xs my-1">
            <IconComponent className="w-5 h-5 sm:w-6 sm:h-6" />
          </div>
          <div className="font-black text-xs sm:text-sm text-[#FF6392] line-clamp-1">
            {item.name}
          </div>
        </div>

        {/* Description text - clickable to open full details */}
        <div
          onClick={(e) => {
            e.stopPropagation();
            setShowDetail(true);
          }}
          className="cursor-pointer group/desc relative my-0.5"
          title="点击查看完整描述"
        >
          <p className="text-[9px] sm:text-[10px] text-slate-600 text-center leading-tight line-clamp-2 bg-[#FFF9FA] backdrop-blur-xs rounded-lg p-1 border border-[#FFD1DC] group-hover/desc:border-[#FF85A1] group-hover/desc:text-[#FF6392] transition-colors">
            {item.description}
          </p>
        </div>

        {/* Sell Action */}
        {!isShopItem && onSell && (
          <button
            onClick={(e) => {
              e.stopPropagation();
              onSell();
            }}
            className="w-full bg-[#FF85A1] hover:bg-[#FF6392] text-white font-bold text-[10px] py-0.5 rounded-lg transition-colors shadow-xs border-b-2 border-[#E0607E]"
          >
            出售 (🪙{Math.max(1, Math.floor(item.cost / 2))})
          </button>
        )}
      </motion.div>

      {/* Card Detail Modal */}
      <AnimatePresence>
        {showDetail && (
          <div
            onClick={(e) => {
              e.stopPropagation();
              setShowDetail(false);
            }}
            className="fixed inset-0 bg-[#5D2E46]/60 backdrop-blur-md z-[100] flex items-center justify-center p-4 select-none"
          >
            <motion.div
              initial={{ opacity: 0, scale: 0.9, y: 10 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.9, y: 10 }}
              onClick={(e) => e.stopPropagation()}
              className="w-full max-w-sm bg-white rounded-3xl p-5 border-4 border-[#FFD1DC] shadow-2xl flex flex-col items-center gap-4 text-center text-[#5D2E46] relative"
            >
              <button
                onClick={() => setShowDetail(false)}
                className="absolute top-3 right-3 text-slate-400 hover:text-slate-600 p-1.5 rounded-full hover:bg-slate-100 transition-colors cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>

              {/* Card Large Icon */}
              <div className="w-16 h-16 rounded-2xl bg-[#FFF0F3] border-2 border-[#FFD1DC] text-[#FF6392] flex items-center justify-center shadow-md mt-2">
                <IconComponent className="w-9 h-9" />
              </div>

              {/* Title & Badge */}
              <div className="flex flex-col items-center gap-1">
                <span className={`text-xs px-2.5 py-0.5 rounded-full border font-bold ${getRarityBadge()}`}>
                  {type === 'joker'
                    ? `${(item as JokerData).rarity}小丑牌`
                    : type === 'tarot'
                    ? '魔法塔罗牌'
                    : '萌星行星牌'}
                </span>
                <h3 className="text-xl font-black text-[#FF6392]">{item.name}</h3>
              </div>

              {/* Full Unclipped Description */}
              <div className="w-full bg-[#FFF9FA] p-3.5 rounded-2xl border-2 border-[#FFD1DC] text-xs leading-relaxed text-slate-700 font-medium text-left">
                <div className="font-bold text-[#FF6392] mb-1 flex items-center gap-1">
                  <Info className="w-3.5 h-3.5" />
                  <span>完整技能与效果说明:</span>
                </div>
                <p className="whitespace-pre-wrap text-slate-800 text-sm leading-normal">{item.description}</p>
              </div>

              {/* Additional Specs if Planet */}
              {type === 'planet' && (
                <div className="w-full grid grid-cols-2 gap-2 text-xs font-bold">
                  <div className="bg-[#FFF0F3] p-2 rounded-xl border border-[#FFD1DC] flex flex-col items-center">
                    <span className="text-gray-400 text-[10px]">提升牌型</span>
                    <span className="text-[#FF6392]">{(item as PlanetCardData).handType}</span>
                  </div>
                  <div className="bg-[#FFF0F3] p-2 rounded-xl border border-[#FFD1DC] flex flex-col items-center">
                    <span className="text-gray-400 text-[10px]">基础加成</span>
                    <span className="text-[#4B9CD3]">
                      +{(item as PlanetCardData).chipsBonus} 筹码 / +{(item as PlanetCardData).multBonus} 倍率
                    </span>
                  </div>
                </div>
              )}

              {/* Action Buttons */}
              <div className="w-full flex gap-2 mt-1">
                {!isShopItem && onSell && (
                  <button
                    onClick={() => {
                      setShowDetail(false);
                      onSell();
                    }}
                    className="flex-1 bg-[#FF85A1] hover:bg-[#FF6392] text-white font-bold text-xs py-2.5 rounded-xl transition-all shadow-xs border-b-2 border-[#E0607E] cursor-pointer"
                  >
                    出售 (🪙{Math.max(1, Math.floor(item.cost / 2))})
                  </button>
                )}

                {!isShopItem && onClick && type !== 'joker' && (
                  <button
                    onClick={() => {
                      setShowDetail(false);
                      onClick();
                    }}
                    className="flex-1 bg-[#FF6392] hover:bg-[#E0607E] text-white font-bold text-xs py-2.5 rounded-xl transition-all shadow-xs border-b-2 border-[#E0607E] cursor-pointer"
                  >
                    立刻使用
                  </button>
                )}

                {isShopItem && onClick && (
                  <button
                    onClick={() => {
                      setShowDetail(false);
                      onClick();
                    }}
                    disabled={isDisabled}
                    className={`flex-1 font-bold text-xs py-2.5 rounded-xl transition-all shadow-xs border-b-2 ${
                      isDisabled
                        ? 'bg-slate-200 text-slate-400 border-slate-300 cursor-not-allowed'
                        : 'bg-[#FF6392] hover:bg-[#E0607E] text-white border-[#E0607E] cursor-pointer'
                    }`}
                  >
                    购买 (🪙{price ?? item.cost})
                  </button>
                )}

                <button
                  onClick={() => setShowDetail(false)}
                  className="flex-1 bg-slate-100 hover:bg-slate-200 text-slate-600 font-bold text-xs py-2.5 rounded-xl transition-all border border-slate-300 cursor-pointer"
                >
                  关闭
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </>
  );
};
