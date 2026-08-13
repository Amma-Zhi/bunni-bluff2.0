import React from 'react';
import { motion } from 'motion/react';
import {
  BoosterPackData,
  HandLevelMap,
  JokerData,
  PlanetCardData,
  TarotCardData,
  VoucherData,
} from '../types';
import { JokerCard } from './JokerCard';
import { soundEngine } from '../utils/audio';
import { ShoppingBag, RotateCw, ArrowRight, Coins, Sparkles, Wand2, Layers, X, Store, Info, HelpCircle } from 'lucide-react';

interface ShopModalProps {
  money: number;
  jokers: JokerData[];
  consumables: (TarotCardData | PlanetCardData)[];
  shopJokers: JokerData[];
  shopConsumables: (TarotCardData | PlanetCardData)[];
  shopPacks: BoosterPackData[];
  shopVouchers: VoucherData[];
  onBuyJoker: (joker: JokerData) => void;
  onBuyConsumable: (item: TarotCardData | PlanetCardData) => void;
  onBuyPack: (pack: BoosterPackData) => void;
  onBuyVoucher: (voucher: VoucherData) => void;
  onSellJoker: (jokerId: string) => void;
  onSellConsumable: (itemId: string) => void;
  onRerollShop: () => void;
  onNextRound: () => void;
  onClose?: () => void;
  handLevels: HandLevelMap;
  lastEarningsBreakdown?: { base: number; hands: number; interest: number; total: number };
}

export const ShopModal: React.FC<ShopModalProps> = ({
  money,
  jokers,
  consumables,
  shopJokers,
  shopConsumables,
  shopPacks,
  shopVouchers,
  onBuyJoker,
  onBuyConsumable,
  onBuyPack,
  onBuyVoucher,
  onSellJoker,
  onSellConsumable,
  onRerollShop,
  onNextRound,
  onClose,
  handLevels,
  lastEarningsBreakdown,
}) => {
  const rerollCost = 5;

  return (
    <div className="fixed inset-0 bg-pink-950/60 backdrop-blur-md z-40 flex items-center justify-center p-2 sm:p-4 safe-area-p select-none overflow-y-auto">
      {/* Main Shop Outer Container matching Image 2 */}
      <motion.div
        initial={{ opacity: 0, scale: 0.94 }}
        animate={{ opacity: 1, scale: 1 }}
        className="w-full max-w-5xl bg-[#FFFDF8] rounded-[2.5rem] p-3.5 sm:p-6 border-4 border-[#FBBFCA] shadow-2xl flex flex-col gap-3 max-h-[96vh] max-h-[96dvh] overflow-hidden relative my-auto"
        style={{
          boxShadow: '0 16px 48px rgba(244, 114, 182, 0.28), inset 0 0 0 3px #FFF0F3',
        }}
      >
        {/* Decorative Corner Hearts */}
        <span className="absolute top-2.5 left-3 text-[#F7A8B8] text-xs font-serif">♡</span>
        <span className="absolute top-2.5 right-12 text-[#F7A8B8] text-xs font-serif">♡</span>

        {/* Top-Right Absolute Close Icon */}
        {onClose && (
          <button
            onClick={() => {
              soundEngine.playPop();
              onClose();
            }}
            className="absolute top-3 right-3 z-30 w-8 h-8 rounded-full bg-white border-2 border-[#FBBFCA] text-[#718096] hover:text-[#E53E3E] hover:bg-[#FFF0F3] flex items-center justify-center shadow-xs transition-transform cursor-pointer active:scale-90"
            title="退出商店"
          >
            <X className="w-4 h-4 stroke-[2.5]" />
            <span className="absolute -bottom-1 text-[8px]">🎀</span>
          </button>
        )}

        {/* Shop Header Bar matching Image 2 */}
        <div className="flex flex-wrap items-center justify-between border-b-2 border-dashed border-[#FBBFCA] pb-3 shrink-0 gap-2 pr-8">
          <div className="flex items-center gap-2.5">
            <div className="w-11 h-11 sm:w-12 sm:h-12 rounded-2xl bg-[#FFF0F3] border-2 border-dashed border-[#FBBFCA] text-[#E85D75] flex items-center justify-center shadow-xs shrink-0 relative">
              <Store className="w-6 h-6 sm:w-7 sm:h-7" />
              <span className="absolute -bottom-1 -right-1 text-xs">🎀</span>
            </div>
            <div>
              <h2 className="text-lg sm:text-2xl font-black text-[#D93856] flex items-center gap-1.5 tracking-wide">
                <span>粉红萌宠甜品屋 (商店)</span>
              </h2>
              <p className="text-[11px] sm:text-xs text-[#718096] font-medium">购买小丑牌、魔法塔罗牌与行星卡包提升实力！</p>
            </div>
          </div>

          {/* Current Gold & Actions Bar */}
          <div className="flex items-center gap-2 ml-auto sm:ml-0">
            {/* Money Pill */}
            <div className="flex items-center gap-1 bg-[#FEFCBF] border-2 border-[#ECC94B] text-[#744210] font-black px-3 py-1.5 rounded-full shadow-xs text-xs sm:text-sm">
              <Coins className="w-4 h-4 text-[#D69E2E]" />
              <span>🪙 {money}</span>
            </div>

            {onClose && (
              <button
                onClick={() => {
                  soundEngine.playPop();
                  onClose();
                }}
                className="bg-white hover:bg-[#F7FAFC] border-2 border-[#BEE3F8] text-[#2D3748] font-black text-xs sm:text-sm px-3.5 py-1.5 sm:py-2 rounded-full transition-all cursor-pointer shadow-xs"
              >
                关闭
              </button>
            )}

            <button
              onClick={() => {
                soundEngine.playPop();
                onNextRound();
              }}
              className="bg-gradient-to-r from-[#F8A4B8] via-[#E85D75] to-[#D93856] hover:from-[#E85D75] hover:to-[#C53030] text-white font-black text-xs sm:text-sm px-4 sm:px-5 py-1.5 sm:py-2 rounded-full shadow-md transition-all flex items-center gap-1.5 active:scale-95 cursor-pointer border-2 border-white"
            >
              <span>进入下一关</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Victory Gold Earnings Breakdown Toast Banner */}
        {lastEarningsBreakdown && (
          <div className="bg-[#FEFCBF]/90 border-2 border-dashed border-[#ECC94B] text-[#744210] px-3.5 py-1.5 rounded-2xl text-xs font-bold flex flex-wrap items-center justify-between shadow-2xs shrink-0 gap-2">
            <div className="flex items-center gap-1.5">
              <Coins className="w-4 h-4 text-[#D69E2E]" />
              <span>
                ✨ 关卡通关金币奖励：<span className="text-[#B7791F] font-black text-sm">+🪙{lastEarningsBreakdown.total}</span>
              </span>
            </div>
            <div className="flex items-center gap-2.5 text-[11px] text-[#975A16]">
              <span>关卡基础: +🪙{lastEarningsBreakdown.base}</span>
              <span>剩余手牌: +🪙{lastEarningsBreakdown.hands}</span>
              <span>存款利息: +🪙{lastEarningsBreakdown.interest}</span>
            </div>
          </div>
        )}

        {/* Scrollable Shop Content Container */}
        <div className="flex-1 overflow-y-auto pr-1 flex flex-col gap-3.5 custom-pink-scrollbar">

          {/* Section 1: Current Inventory (Top Slots) matching Image 2 */}
          <div className="bg-[#FFF5F7]/80 p-3 sm:p-4 rounded-3xl border-2 border-dashed border-[#F8A4B8] shadow-xs flex flex-col gap-3">
            <div className="grid grid-cols-1 lg:grid-cols-7 gap-3">
              {/* Jokers Owned (5 max) - takes 5 cols on lg */}
              <div className="lg:col-span-5 flex flex-col gap-1.5">
                <div className="flex items-center justify-between">
                  <span className="font-extrabold text-xs text-[#D93856] flex items-center gap-1">
                    <span>🐼 小丑牌槽位</span>
                    <span className="text-[#E85D75]">({jokers.length} / 5)</span>
                  </span>
                </div>
                <div className="flex items-center gap-2 overflow-x-auto pb-1 min-h-[148px]">
                  {jokers.map((joker, idx) => (
                    <JokerCard
                      key={joker.id + idx}
                      item={joker}
                      type="joker"
                      onSell={() => {
                        soundEngine.playCoin();
                        onSellJoker(joker.id);
                      }}
                    />
                  ))}
                  {Array.from({ length: Math.max(0, 5 - jokers.length) }).map((_, i) => (
                    <div
                      key={i}
                      className="w-24 h-36 border-2 border-dashed border-[#FBBFCA] rounded-2xl bg-white/60 flex flex-col items-center justify-center text-[#F8A4B8] text-xs font-bold gap-1 shrink-0 shadow-2xs"
                    >
                      <span className="text-base">♡</span>
                      <span>空槽位</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Consumables Owned (2 max) - takes 2 cols on lg */}
              <div className="lg:col-span-2 flex flex-col gap-1.5">
                <div className="flex items-center justify-between">
                  <span className="font-extrabold text-xs text-[#4C51BF] flex items-center gap-1">
                    <Wand2 className="w-3.5 h-3.5 text-[#5A67D8]" />
                    <span>消耗牌槽位 (魔法/行星)</span>
                    <span className="text-[#5A67D8]">({consumables.length} / 2)</span>
                  </span>
                </div>
                <div className="flex items-center gap-2 overflow-x-auto pb-1 min-h-[148px]">
                  {consumables.map((item, idx) => (
                    <JokerCard
                      key={item.id + idx}
                      item={item}
                      type={'targetSuit' in item ? 'tarot' : 'planet'}
                      onSell={() => {
                        soundEngine.playCoin();
                        onSellConsumable(item.id);
                      }}
                    />
                  ))}
                  {Array.from({ length: Math.max(0, 2 - consumables.length) }).map((_, i) => (
                    <div
                      key={i}
                      className="w-24 h-36 border-2 border-dashed border-[#C3DAFE] rounded-2xl bg-white/60 flex flex-col items-center justify-center text-[#A3BFFA] text-xs font-bold gap-1 shrink-0 shadow-2xs"
                    >
                      <span className="text-base">♡</span>
                      <span>空槽位</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* Section 2: Today's Shop Products matching Image 2 */}
          <div className="bg-[#FFFDF8] p-3 sm:p-4 rounded-3xl border-2 border-dashed border-[#FBBFCA] shadow-xs flex flex-col gap-3">
            <div className="flex items-center justify-between">
              <div className="inline-flex items-center gap-1.5 bg-[#FFF0F3] text-[#D93856] font-extrabold text-xs sm:text-sm px-3 py-1 rounded-full border border-[#FBBFCA]">
                <Sparkles className="w-3.5 h-3.5 text-[#E85D75]" />
                <span>今日货架商品</span>
                <span className="text-xs">🎀</span>
              </div>

              {/* Reroll Button */}
              <button
                onClick={() => {
                  if (money >= rerollCost) {
                    soundEngine.playCoin();
                    onRerollShop();
                  }
                }}
                disabled={money < rerollCost}
                className={`flex items-center gap-1.5 text-xs font-black px-3.5 py-1.5 rounded-full border-2 transition-all ${
                  money >= rerollCost
                    ? 'bg-[#FEFCBF] hover:bg-[#FEF08A] text-[#744210] border-[#ECC94B] cursor-pointer shadow-xs'
                    : 'bg-slate-100 text-slate-400 border-slate-200 cursor-not-allowed'
                }`}
              >
                <RotateCw className="w-3.5 h-3.5" />
                <span>刷新商品 (🪙{rerollCost})</span>
              </button>
            </div>

            {/* Available Jokers and Consumables for sale */}
            <div className="flex items-center gap-3 overflow-x-auto pb-2 pt-1">
              {shopJokers.map((joker) => (
                <JokerCard
                  key={joker.id}
                  item={joker}
                  type="joker"
                  isShopItem
                  price={joker.cost}
                  isDisabled={money < joker.cost || jokers.length >= 5}
                  onClick={() => {
                    if (money >= joker.cost && jokers.length < 5) {
                      soundEngine.playCoin();
                      onBuyJoker(joker);
                    }
                  }}
                />
              ))}

              {shopConsumables.map((item) => (
                <JokerCard
                  key={item.id}
                  item={item}
                  type={'targetSuit' in item ? 'tarot' : 'planet'}
                  isShopItem
                  price={item.cost}
                  isDisabled={money < item.cost || consumables.length >= 2}
                  onClick={() => {
                    if (money >= item.cost && consumables.length < 2) {
                      soundEngine.playCoin();
                      onBuyConsumable(item);
                    }
                  }}
                />
              ))}
            </div>

            {/* Section 3: Booster Packs & Vouchers Grid matching Image 2 */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 pt-1">
              {/* Packs */}
              {shopPacks.map((pack) => (
                <div
                  key={pack.id}
                  className="bg-[#FFF5F7]/90 p-3 rounded-2xl border-2 border-dashed border-[#F8A4B8] shadow-2xs flex items-center justify-between gap-2"
                >
                  <div className="flex items-center gap-2.5 min-w-0">
                    <div className="w-10 h-10 rounded-2xl bg-white border-2 border-[#FBBFCA] text-[#E85D75] flex items-center justify-center font-bold shrink-0 shadow-2xs">
                      <Layers className="w-5 h-5" />
                    </div>
                    <div className="min-w-0">
                      <div className="font-extrabold text-xs sm:text-sm text-[#2C3E50] truncate">{pack.name}</div>
                      <div className="text-[10px] text-[#718096] truncate">{pack.description}</div>
                    </div>
                  </div>

                  <button
                    onClick={() => {
                      if (money >= pack.cost) {
                        soundEngine.playCoin();
                        onBuyPack(pack);
                      }
                    }}
                    disabled={money < pack.cost}
                    className={`px-3 py-1.5 rounded-full font-black text-xs transition-all border-2 shrink-0 ${
                      money >= pack.cost
                        ? 'bg-[#E85D75] hover:bg-[#D93856] text-white border-white shadow-xs cursor-pointer'
                        : 'bg-slate-200 text-slate-400 border-slate-300 cursor-not-allowed'
                    }`}
                  >
                    🪙{pack.cost} 开启
                  </button>
                </div>
              ))}

              {/* Vouchers */}
              {shopVouchers.map((v) => (
                <div
                  key={v.id}
                  className="bg-[#EBF8FF]/90 p-3 rounded-2xl border-2 border-dashed border-[#BEE3F8] shadow-2xs flex items-center justify-between gap-2"
                >
                  <div className="flex items-center gap-2.5 min-w-0">
                    <div className="w-10 h-10 rounded-2xl bg-white border-2 border-[#90CDF4] text-[#3182CE] flex items-center justify-center text-lg shrink-0 shadow-2xs">
                      🐰
                    </div>
                    <div className="min-w-0">
                      <div className="font-extrabold text-xs sm:text-sm text-[#2C3E50] truncate">{v.name}</div>
                      <div className="text-[10px] text-[#718096] truncate">{v.description}</div>
                    </div>
                  </div>

                  <button
                    onClick={() => {
                      if (money >= v.cost && !v.bought) {
                        soundEngine.playCoin();
                        onBuyVoucher(v);
                      }
                    }}
                    disabled={money < v.cost || v.bought}
                    className={`px-3 py-1.5 rounded-full font-black text-xs transition-all border-2 shrink-0 ${
                      v.bought
                        ? 'bg-slate-200 text-slate-500 border-slate-300 cursor-not-allowed'
                        : money >= v.cost
                        ? 'bg-[#3182CE] hover:bg-[#2B6CB0] text-white border-white shadow-xs cursor-pointer'
                        : 'bg-slate-200 text-slate-400 border-slate-300 cursor-not-allowed'
                    }`}
                  >
                    {v.bought ? '已拥有' : `🪙${v.cost} 购买`}
                  </button>
                </div>
              ))}
            </div>
          </div>

        </div>
      </motion.div>
    </div>
  );
};
