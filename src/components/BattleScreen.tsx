import React from 'react';
import { motion } from 'motion/react';
import { BlindType, BossRule, CardData, HandEvaluation, JokerData, PlanetCardData, TarotCardData } from '../types';
import { CardView } from './CardView';
import { JokerCard } from './JokerCard';
import { Menu, Newspaper, Home, Settings, Lock, ShieldAlert, Wand2, Sparkles } from 'lucide-react';

interface BattleScreenProps {
  currentScore: number;
  targetScore: number;
  ante: number;
  blindType: BlindType;
  money: number;
  handsLeft: number;
  discardsLeft: number;
  handCards: CardData[];
  selectedCardIds: string[];
  jokers: JokerData[];
  consumables?: (TarotCardData | PlanetCardData)[];
  deckCount: number;
  evaluatedHand?: HandEvaluation;
  bossRule?: BossRule;
  onToggleSelectCard: (id: string) => void;
  onPlayHand: () => void;
  onDiscard: () => void;
  onOpenDeckView: () => void;
  onOpenMenu: () => void;
  onOpenSettings?: () => void;
  onNavigateHome?: () => void;
  onUseConsumable?: (item: TarotCardData | PlanetCardData) => void;
  activeCardBack?: string;
  streak?: number;
  orientation?: 'portrait' | 'landscape';
}

export const BattleScreen: React.FC<BattleScreenProps> = ({
  currentScore,
  targetScore,
  ante,
  blindType,
  money,
  handsLeft,
  discardsLeft,
  handCards,
  selectedCardIds,
  jokers,
  consumables = [],
  deckCount,
  evaluatedHand,
  bossRule,
  onToggleSelectCard,
  onPlayHand,
  onDiscard,
  onOpenDeckView,
  onOpenMenu,
  onOpenSettings,
  onNavigateHome,
  onUseConsumable,
  activeCardBack = 'card_back_sakura',
  streak = 3,
  orientation = 'landscape',
}) => {
  const isLandscape = orientation === 'landscape';
  const blindLabel = blindType === 'small' ? 'Small' : blindType === 'big' ? 'Big' : 'Boss';
  const blindOrder: BlindType[] = ['small', 'big', 'boss'];
  const activeBlindIndex = blindOrder.indexOf(blindType);

  const selectedCards = handCards.filter((c) => selectedCardIds.includes(c.id));

  return (
    <div
      className={`bg-[#EDF5FA] rounded-[36px] border-[6px] border-[#C6E2FF] shadow-2xl overflow-y-auto select-none relative my-auto transition-all duration-300 max-h-full ${
        isLandscape
          ? 'w-full max-w-[860px] p-2 sm:p-3 flex flex-row justify-between gap-2 sm:gap-3 h-full min-h-0'
          : 'w-full max-w-[420px] p-0 flex flex-col justify-between h-full min-h-0'
      }`}
    >
      {/* Background Soft Pattern */}
      <div className="absolute inset-0 bg-polka-dots pointer-events-none opacity-40" />

      {/* LANDSCAPE LAYOUT (3 Columns: Dashboard | Stage | Actions) */}
      {isLandscape ? (
        <div className="relative z-10 w-full h-full flex items-stretch justify-between gap-3 my-auto">
          {/* Left Column: Dashboard Stats */}
          <div className="w-[220px] bg-gingham-blue border-2 border-[#A2C4E5] rounded-3xl p-3 flex flex-col justify-between shadow-xs shrink-0">
            {/* Top Ante & Blind Badge */}
            <div className="flex items-center justify-between gap-1">
              <div className="flex flex-col">
                <span className="text-[10px] text-[#537188] font-bold">分数</span>
                <span className="text-lg font-black text-[#FF6392] tracking-tight">
                  {currentScore.toLocaleString()}
                </span>
              </div>
              <div className="w-14 h-12 rounded-full bg-white border border-[#FFB6C1] flex flex-col items-center justify-center shadow-2xs">
                <span className="text-[9px] text-slate-400 font-extrabold">Ante</span>
                <span className="text-xs font-black text-slate-800 leading-none">
                  {ante}/8
                </span>
                <span className="text-[8px] text-[#FF6392] font-black">
                  {blindLabel} Blind
                </span>
              </div>
            </div>

            {/* Money */}
            <div className="bg-white/90 backdrop-blur-xs rounded-xl p-2 border border-[#A2C4E5] flex items-center justify-between">
              <span className="text-[10px] text-[#537188] font-bold">金币</span>
              <div className="flex items-center gap-1">
                <span className="text-xs">🪙</span>
                <span className="text-sm font-black text-slate-800">{money.toLocaleString()}</span>
              </div>
            </div>

            {/* Target & Hand Multiplier Info */}
            <div className="bg-white/90 backdrop-blur-xs rounded-xl p-2 border border-[#A2C4E5] flex flex-col gap-1 text-center">
              <div className="flex items-center justify-between text-[10px] border-b border-slate-100 pb-1">
                <span className="text-slate-400 font-bold">目标</span>
                <span className="font-black text-[#FF6392]">{targetScore.toLocaleString()}</span>
              </div>
              <div className="flex items-center justify-center gap-1 border-b border-slate-100 pb-1">
                {blindOrder.map((type, index) => (
                  <span
                    key={type}
                    className={`text-[8px] font-black px-1 rounded-full ${index === activeBlindIndex ? 'bg-[#FF85A1] text-white' : 'text-slate-400'}`}
                  >
                    {type === 'small' ? 'Small' : type === 'big' ? 'Big' : 'Boss'} {index < activeBlindIndex ? '✓' : index === activeBlindIndex ? '●' : '○'}
                  </span>
                ))}
              </div>
              <div className="flex items-center justify-between text-[10px] border-b border-slate-100 pb-1">
                <span className="text-slate-400 font-bold">牌型</span>
                <span className="font-black text-slate-800">{evaluatedHand?.handType || '高牌'}</span>
              </div>
              <div className="flex items-center justify-between text-[10px]">
                <span className="text-slate-400 font-bold">倍率</span>
                <span className="font-black text-[#FF6392]">x{evaluatedHand?.baseMult || 1.0}</span>
              </div>
            </div>

            {/* Active Boss Rule Alert Badge */}
            {bossRule && (
              <div className="bg-rose-500/10 border border-rose-300 rounded-xl p-1.5 text-rose-700 text-[10px] font-extrabold flex items-center gap-1 leading-tight">
                <ShieldAlert className="w-3.5 h-3.5 text-rose-500 shrink-0" />
                <span className="truncate" title={bossRule.description}>{bossRule.name}: {bossRule.description}</span>
              </div>
            )}

            {/* Footer Navigation */}
            <div className="flex items-center justify-between bg-white rounded-xl p-1.5 border border-[#C6E2FF]">
              <div className="flex items-center gap-1">
                <button
                  onClick={onOpenMenu}
                  className="w-6 h-6 rounded-lg bg-[#EDF5FA] text-[#537188] flex items-center justify-center hover:bg-[#C6E2FF] cursor-pointer"
                  title="帮助"
                >
                  <Menu className="w-3.5 h-3.5" />
                </button>
                {onOpenSettings && (
                  <button
                    onClick={onOpenSettings}
                    className="w-6 h-6 rounded-lg bg-[#FFF0F3] text-[#FF6392] flex items-center justify-center hover:bg-[#FFD1DC] cursor-pointer"
                    title="设置"
                  >
                    <Settings className="w-3.5 h-3.5" />
                  </button>
                )}
                {onNavigateHome && (
                  <button
                    onClick={onNavigateHome}
                    className="w-6 h-6 rounded-lg bg-[#FFF0F3] text-[#FF6392] flex items-center justify-center hover:bg-[#FFD1DC] cursor-pointer"
                    title="首页"
                  >
                    <Home className="w-3.5 h-3.5" />
                  </button>
                )}
              </div>
              <span className="text-[10px] font-black text-[#FF6392]">连击 {streak}♥️</span>
              <button
                onClick={onOpenDeckView}
                className="w-6 h-6 rounded-lg bg-[#EDF5FA] text-[#537188] flex items-center justify-center hover:bg-[#C6E2FF] cursor-pointer"
                title="查看图鉴"
              >
                <Newspaper className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>

          {/* Center Column: Card Stage (Jokers, Played Hand, Hand Cards) */}
          <div className="flex-1 flex flex-col justify-between py-1 gap-2 overflow-hidden">
            {/* Top: Special Cards Row (Jokers & Consumables) */}
            <div className="flex items-start justify-center gap-2 shrink-0 w-full overflow-x-auto py-0.5">
              {/* Jokers Area */}
              <div className="flex flex-col items-center gap-1 bg-white/60 backdrop-blur-2xs p-1.5 rounded-2xl border border-[#A2C4E5] shadow-2xs">
                <div className="bg-[#A8D1E7] text-white font-black text-[9px] px-2.5 py-0.5 rounded-full flex items-center gap-1 shadow-2xs border border-white">
                  <span>🐼 小丑牌 ({jokers.length}/5)</span>
                  {bossRule?.disabledJokerIndices && bossRule.disabledJokerIndices.length > 0 && (
                    <span className="text-[8px] bg-rose-500 text-white px-1 rounded-full font-bold">封印中</span>
                  )}
                </div>
                <div className="flex items-center gap-1.5 min-h-[105px]">
                  {jokers.length > 0 ? (
                    jokers.map((joker, idx) => {
                      const isDisabledJoker = bossRule?.disabledJokerIndices?.includes(idx);
                      return (
                        <div key={joker.id + idx} className="relative">
                          <JokerCard
                            item={joker}
                            type="joker"
                          />
                          {isDisabledJoker && (
                            <div className="absolute inset-0 bg-slate-900/60 rounded-2xl backdrop-blur-2xs flex flex-col items-center justify-center text-white z-10 border-2 border-rose-400">
                              <Lock className="w-4 h-4 text-rose-300 animate-pulse" />
                              <span className="text-[8px] font-black text-rose-200 mt-0.5">已封印</span>
                            </div>
                          )}
                        </div>
                      );
                    })
                  ) : (
                    <div className="w-20 h-28 border-2 border-dashed border-[#FFB6C1] rounded-2xl bg-white/60 flex flex-col items-center justify-center text-[#FF6392] text-[10px] font-bold">
                      <span className="text-lg">🤡</span>
                      <span>空小丑槽</span>
                    </div>
                  )}
                </div>
              </div>

              {/* Consumables Area */}
              <div className="flex flex-col items-center gap-1 bg-white/60 backdrop-blur-2xs p-1.5 rounded-2xl border border-[#B794F4]/50 shadow-2xs">
                <div className="bg-purple-500 text-white font-black text-[9px] px-2.5 py-0.5 rounded-full flex items-center gap-1 shadow-2xs border border-white">
                  <Wand2 className="w-3 h-3" />
                  <span>🔮 消耗牌 ({consumables.length}/2)</span>
                </div>
                <div className="flex items-center gap-1.5 min-h-[105px]">
                  {consumables.map((item, idx) => (
                    <div key={item.id + idx} className="relative">
                      <JokerCard
                        item={item}
                        type={'targetSuit' in item ? 'tarot' : 'planet'}
                        onClick={onUseConsumable ? () => onUseConsumable(item) : undefined}
                      />
                    </div>
                  ))}
                  {Array.from({ length: Math.max(0, 2 - consumables.length) }).map((_, i) => (
                    <div
                      key={i}
                      className="w-20 h-28 border-2 border-dashed border-purple-300/80 rounded-2xl bg-purple-50/40 flex flex-col items-center justify-center text-purple-500 text-[10px] font-bold gap-0.5 text-center px-1"
                    >
                      <Sparkles className="w-4 h-4 text-purple-400" />
                      <span>空消耗槽</span>
                      <span className="text-[8px] text-purple-400 font-normal">通关后商店购买</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Middle: Played Hand & Score Pill (Fixed Height Container to eliminate size jitter) */}
            <div className="h-[120px] my-auto flex flex-col items-center justify-center shrink-0 w-full overflow-hidden">
              {selectedCards.length > 0 ? (
                <div className="flex flex-col items-center gap-1">
                  <div className="flex items-center justify-center gap-1.5 min-h-[75px]">
                    {selectedCards.slice(0, 5).map((card) => (
                      <CardView key={card.id} card={card} size="sm" />
                    ))}
                  </div>
                  {evaluatedHand && (
                    <div className="bg-[#A8D1E7] border-2 border-white text-white font-black text-[11px] px-4 py-0.5 rounded-full shadow-md flex items-center gap-1">
                      <span>{evaluatedHand.handType} +{evaluatedHand.baseChips * evaluatedHand.baseMult}</span>
                      <span className="text-xs">♥️</span>
                    </div>
                  )}
                </div>
              ) : (
                <div className="h-[75px] w-full max-w-xs px-6 rounded-2xl border-2 border-dashed border-[#A8D1E7]/60 bg-white/40 flex items-center justify-center">
                  <span className="text-xs font-black text-[#749BC2] flex items-center gap-1.5">
                    <span>✨ 请在下方选择要出的卡牌组合</span>
                  </span>
                </div>
              )}
            </div>

            {/* Bottom: Hand Cards Row & Draw Deck (Fixed Height Container with headroom) */}
            <div className="p-2 flex items-center justify-between gap-2 bg-white/60 backdrop-blur-xs rounded-2xl border border-[#C6E2FF] h-[115px] shrink-0 overflow-hidden">
              <div className="flex items-end gap-1 overflow-x-auto flex-1 h-full pt-5 pb-1">
                {handCards.map((card) => (
                  <CardView
                    key={card.id}
                    card={card}
                    isSelected={selectedCardIds.includes(card.id)}
                    size="sm"
                    onClick={() => onToggleSelectCard(card.id)}
                  />
                ))}
              </div>
              <div
                onClick={onOpenDeckView}
                className="w-12 h-16 bg-gingham-blue border-2 border-[#A2C4E5] rounded-xl shadow-md flex items-center justify-center relative cursor-pointer group hover:scale-105 transition-transform shrink-0"
              >
                <span className="text-xl">🎀</span>
                <span className="absolute -bottom-1 -right-1 bg-[#A8D1E7] text-white font-black text-[9px] px-1 rounded-full border border-white">
                  {deckCount}
                </span>
              </div>
            </div>
          </div>

          {/* Right Column: Action Buttons */}
          <div className="w-[140px] flex flex-col justify-center gap-2 shrink-0">
            <>
                <button
                  onClick={onPlayHand}
                  disabled={handsLeft <= 0 || selectedCardIds.length === 0}
                  className={`py-3 rounded-2xl font-black text-xs flex items-center justify-center gap-1 btn-pink-pill transition-all cursor-pointer ${
                    handsLeft <= 0 || selectedCardIds.length === 0 ? 'opacity-60 cursor-not-allowed' : ''
                  }`}
                >
                  <span>🎀 出牌 ({handsLeft})</span>
                </button>

                <button
                  onClick={onDiscard}
                  disabled={discardsLeft <= 0 || selectedCardIds.length === 0 || bossRule?.disableDiscards}
                  className={`py-3 rounded-2xl font-black text-xs flex items-center justify-center gap-1 btn-blue-pill transition-all cursor-pointer ${
                    discardsLeft <= 0 || selectedCardIds.length === 0 || bossRule?.disableDiscards ? 'opacity-60 cursor-not-allowed' : ''
                  }`}
                >
                  <span>弃牌 ({bossRule?.disableDiscards ? 0 : discardsLeft})</span>
                </button>

            </>
          </div>
        </div>
      ) : (
        /* PORTRAIT LAYOUT */
        <div className="relative z-10 flex flex-col justify-between h-full w-full overflow-y-auto">
          {/* Top Lace Header Panel */}
          <div className="bg-gingham-blue border-b-2 border-[#A2C4E5] p-3 pb-4 shadow-sm relative shrink-0">
            <div className="flex items-center justify-between gap-2">
              <div className="flex flex-col">
                <span className="text-[10px] text-[#537188] font-bold">分数</span>
                <span className="text-xl font-black text-[#FF6392] tracking-tight">
                  {currentScore.toLocaleString()}
                </span>
                <div className="flex items-center gap-0.5 mt-0.5">
                  <span className="text-xs">♥️</span>
                  <span className="text-xs">♥️</span>
                  <span className="text-xs">♥️</span>
                </div>
              </div>

              <div className="flex flex-col items-center relative">
                <span className="text-xl drop-shadow-2xs -mb-2.5 z-20">🎀</span>
                <div className="w-20 h-16 rounded-full bg-white border-2 border-[#FFB6C1] shadow-xs flex flex-col items-center justify-center pt-2">
                  <span className="text-[10px] text-slate-400 font-extrabold">Ante</span>
                  <span className="text-sm font-black text-slate-800 leading-none my-0.5">
                    {ante}/8
                  </span>
                  <span className="text-[9px] text-[#FF6392] font-black bg-[#FFF0F3] px-2 rounded-full">
                    {blindLabel} Blind
                  </span>
                </div>
              </div>

              <div className="flex flex-col items-end">
                <span className="text-[10px] text-[#537188] font-bold">金币</span>
                <div className="flex items-center gap-1">
                  <span className="text-xs">🪙</span>
                  <span className="text-base font-black text-slate-800">
                    {money.toLocaleString()}
                  </span>
                </div>
              </div>
            </div>

            <div className="mt-3 bg-white/90 backdrop-blur-xs rounded-2xl p-2 border border-[#A2C4E5] shadow-2xs grid grid-cols-3 text-center">
              <div className="flex flex-col border-r border-slate-100">
                <span className="text-[9px] text-slate-400 font-bold">目标分数</span>
                <span className="text-xs font-black text-[#FF6392]">{targetScore.toLocaleString()}</span>
              </div>
              <div className="flex flex-col border-r border-slate-100">
                <span className="text-[9px] text-slate-400 font-bold">牌型</span>
                <span className="text-xs font-black text-slate-800">
                  {selectedCards.length > 0 ? (evaluatedHand?.handType || '高牌') : '未选牌'}
                </span>
              </div>
              <div className="flex flex-col">
                <span className="text-[9px] text-slate-400 font-bold">倍率</span>
                <span className="text-xs font-black text-[#FF6392]">
                  {selectedCards.length > 0 && evaluatedHand ? `x${evaluatedHand.baseMult}` : '-'}
                </span>
              </div>
            </div>
            <div className="mt-1.5 flex items-center justify-center gap-1">
              {blindOrder.map((type, index) => (
                <span
                  key={type}
                  className={`text-[9px] font-black px-2 py-0.5 rounded-full border ${index === activeBlindIndex ? 'bg-[#FF85A1] text-white border-white' : 'bg-white/70 text-slate-400 border-[#C6E2FF]'}`}
                >
                  {type === 'small' ? 'Small' : type === 'big' ? 'Big' : 'Boss'} {index < activeBlindIndex ? '✓' : index === activeBlindIndex ? '●' : '○'}
                </span>
              ))}
            </div>

            {/* Boss Rule Alert Badge Portrait */}
            {bossRule && (
              <div className="mt-2 bg-rose-500/10 border border-rose-300 rounded-xl p-1.5 text-rose-700 text-[10px] font-extrabold flex items-center justify-center gap-1 leading-tight">
                <ShieldAlert className="w-3.5 h-3.5 text-rose-500 shrink-0" />
                <span>{bossRule.name}: {bossRule.description}</span>
              </div>
            )}
          </div>

          {/* Middle Special Cards Area (Jokers & Consumables) */}
          <div className="p-2 flex flex-col items-center gap-1.5 shrink-0 w-full overflow-x-auto">
            <div className="flex items-start justify-center gap-2 overflow-x-auto w-full py-0.5">
              {/* Jokers Area */}
              <div className="flex flex-col items-center gap-1 bg-white/60 backdrop-blur-2xs p-1.5 rounded-2xl border border-[#A2C4E5] shadow-2xs">
                <div className="bg-[#A8D1E7] text-white font-black text-[9px] px-2.5 py-0.5 rounded-full flex items-center gap-1 shadow-2xs border border-white">
                  <span>🐼 小丑 ({jokers.length}/5)</span>
                  {bossRule?.disabledJokerIndices && bossRule.disabledJokerIndices.length > 0 && (
                    <span className="text-[8px] bg-rose-500 text-white px-1 rounded-full font-bold">封印中</span>
                  )}
                </div>
                <div className="flex items-center gap-1.5 min-h-[105px]">
                  {jokers.length > 0 ? (
                    jokers.map((joker, idx) => {
                      const isDisabledJoker = bossRule?.disabledJokerIndices?.includes(idx);
                      return (
                        <div key={joker.id + idx} className="relative">
                          <JokerCard
                            item={joker}
                            type="joker"
                          />
                          {isDisabledJoker && (
                            <div className="absolute inset-0 bg-slate-900/60 rounded-2xl backdrop-blur-2xs flex flex-col items-center justify-center text-white z-10 border-2 border-rose-400">
                              <Lock className="w-4 h-4 text-rose-300 animate-pulse" />
                              <span className="text-[8px] font-black text-rose-200 mt-0.5">已封印</span>
                            </div>
                          )}
                        </div>
                      );
                    })
                  ) : (
                    <div className="w-20 h-28 border-2 border-dashed border-[#FFB6C1] rounded-2xl bg-white/60 flex flex-col items-center justify-center text-[#FF6392] text-[10px] font-bold">
                      <span className="text-lg">🤡</span>
                      <span>空小丑槽</span>
                    </div>
                  )}
                </div>
              </div>

              {/* Consumables Area */}
              <div className="flex flex-col items-center gap-1 bg-white/60 backdrop-blur-2xs p-1.5 rounded-2xl border border-[#B794F4]/50 shadow-2xs">
                <div className="bg-purple-500 text-white font-black text-[9px] px-2.5 py-0.5 rounded-full flex items-center gap-1 shadow-2xs border border-white">
                  <Wand2 className="w-3 h-3" />
                  <span>🔮 消耗牌 ({consumables.length}/2)</span>
                </div>
                <div className="flex items-center gap-1.5 min-h-[105px]">
                  {consumables.map((item, idx) => (
                    <div key={item.id + idx} className="relative">
                      <JokerCard
                        item={item}
                        type={'targetSuit' in item ? 'tarot' : 'planet'}
                        onClick={onUseConsumable ? () => onUseConsumable(item) : undefined}
                      />
                    </div>
                  ))}
                  {Array.from({ length: Math.max(0, 2 - consumables.length) }).map((_, i) => (
                    <div
                      key={i}
                      className="w-20 h-28 border-2 border-dashed border-purple-300/80 rounded-2xl bg-purple-50/40 flex flex-col items-center justify-center text-purple-500 text-[10px] font-bold gap-0.5 text-center px-1"
                    >
                      <Sparkles className="w-4 h-4 text-purple-400" />
                      <span>空消耗槽</span>
                      <span className="text-[8px] text-purple-400 font-normal">通关后商店购买</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* Middle Played Hand (Fixed Height Container to prevent size shifts) */}
          <div className="h-[125px] my-auto flex flex-col items-center justify-center shrink-0 w-full overflow-hidden">
            {selectedCards.length > 0 ? (
              <div className="flex flex-col items-center gap-1">
                <div className="flex items-center justify-center gap-1.5 px-2 min-h-[75px]">
                  {selectedCards.slice(0, 5).map((card) => (
                    <CardView key={card.id} card={card} size="sm" />
                  ))}
                </div>

                {evaluatedHand && (
                  <div className="bg-[#A8D1E7] border-2 border-white text-white font-black text-xs px-5 py-1 rounded-full shadow-md flex items-center gap-1.5 mt-1">
                    <span>{evaluatedHand.handType} +{evaluatedHand.baseChips * evaluatedHand.baseMult}</span>
                    <span className="text-xs">♥️</span>
                  </div>
                )}
              </div>
            ) : (
              <div className="h-[75px] w-full max-w-xs py-2.5 px-6 rounded-2xl border-2 border-dashed border-[#A8D1E7]/60 bg-white/40 flex items-center justify-center">
                <span className="text-xs font-black text-[#749BC2] flex items-center gap-1.5">
                  <span>✨ 请在下方选择要出的卡牌组合</span>
                </span>
              </div>
            )}
          </div>

          {/* Bottom Hand Cards & Deck (Fixed Height Container with Headroom) */}
          <div className="p-2 flex items-center justify-between gap-2 bg-white/50 backdrop-blur-xs rounded-3xl border border-[#C6E2FF] mx-2 my-1 h-[115px] shrink-0 overflow-hidden">
            <div className="flex items-end gap-1 overflow-x-auto flex-1 h-full pt-5 pb-1">
              {handCards.map((card) => (
                <CardView
                  key={card.id}
                  card={card}
                  isSelected={selectedCardIds.includes(card.id)}
                  size="sm"
                  onClick={() => onToggleSelectCard(card.id)}
                />
              ))}
            </div>

            <div
              onClick={onOpenDeckView}
              className="w-14 h-20 bg-gingham-blue border-2 border-[#A2C4E5] rounded-xl shadow-md flex items-center justify-center relative cursor-pointer group hover:scale-105 transition-transform shrink-0"
            >
              <span className="text-2xl">🎀</span>
              <span className="absolute -bottom-1 -right-1 bg-[#A8D1E7] text-white font-black text-[10px] px-1.5 py-0.2 rounded-full border border-white shadow-2xs">
                {deckCount}
              </span>
            </div>
          </div>

          {/* Bottom Actions Bar */}
          <div className="p-3 pt-1 flex flex-col gap-2 shrink-0">
            <div className="grid grid-cols-2 gap-2">
                <button
                  onClick={onPlayHand}
                  disabled={handsLeft <= 0 || selectedCardIds.length === 0}
                  className={`py-2.5 rounded-full font-black text-xs flex items-center justify-center gap-1 btn-pink-pill transition-all cursor-pointer ${
                    handsLeft <= 0 || selectedCardIds.length === 0 ? 'opacity-60 cursor-not-allowed' : ''
                  }`}
                >
                  <span>🎀 出牌 ({handsLeft})</span>
                </button>

                <button
                  onClick={onDiscard}
                  disabled={discardsLeft <= 0 || selectedCardIds.length === 0 || bossRule?.disableDiscards}
                  className={`py-2.5 rounded-full font-black text-xs flex items-center justify-center gap-1 btn-blue-pill transition-all cursor-pointer ${
                    discardsLeft <= 0 || selectedCardIds.length === 0 || bossRule?.disableDiscards ? 'opacity-60 cursor-not-allowed' : ''
                  }`}
                >
                  <span>弃牌 ({bossRule?.disableDiscards ? 0 : discardsLeft})</span>
                </button>

            </div>

            <div className="bg-white rounded-2xl p-2 border border-[#C6E2FF] flex items-center justify-between text-slate-700 shadow-2xs mt-1">
              <div className="flex items-center gap-1">
                <button
                  onClick={onOpenMenu}
                  className="w-7 h-7 rounded-lg bg-[#EDF5FA] text-[#537188] flex items-center justify-center hover:bg-[#C6E2FF] cursor-pointer"
                  title="菜单选项"
                >
                  <Menu className="w-4 h-4" />
                </button>
                {onNavigateHome && (
                  <button
                    onClick={onNavigateHome}
                    className="w-7 h-7 rounded-lg bg-[#FFF0F3] text-[#FF6392] flex items-center justify-center hover:bg-[#FFD1DC] cursor-pointer"
                    title="返回首页"
                  >
                    <Home className="w-4 h-4" />
                  </button>
                )}
              </div>

              <div className="flex items-center gap-1 text-xs font-black text-[#FF6392]">
                <span>连击 {streak}</span>
                <span className="text-xs">♥️</span>
                <span className="text-xs">♥️</span>
                <span className="text-xs">♥️</span>
                <span className="text-xs">♥️</span>
                <span className="text-xs">♥️</span>
              </div>

              <button
                onClick={onOpenDeckView}
                className="w-7 h-7 rounded-lg bg-[#EDF5FA] text-[#537188] flex items-center justify-center hover:bg-[#C6E2FF] cursor-pointer"
                title="查看图鉴牌组"
              >
                <Newspaper className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
