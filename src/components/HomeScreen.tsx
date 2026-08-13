import React from 'react';
import { motion } from 'motion/react';
import { Mail, Settings, ChevronRight, BookOpen, ShoppingBag, ClipboardList, Heart, Home, Layers, Swords, Trophy, Users } from 'lucide-react';

import { GameStats } from '../types';

interface HomeScreenProps {
  onStartBattle: () => void;
  onOpenDeckView: () => void;
  onOpenAchievements: () => void;
  onOpenSettings?: () => void;
  money: number;
  streak?: number;
  deckCount?: number;
  maxDeckCount?: number;
  activeTab: string;
  setActiveTab: (tab: string) => void;
  orientation?: 'portrait' | 'landscape';
  stats?: GameStats;
}

export const HomeScreen: React.FC<HomeScreenProps> = ({
  onStartBattle,
  onOpenDeckView,
  onOpenAchievements,
  onOpenSettings,
  money,
  streak = 0,
  deckCount = 8,
  maxDeckCount = 12,
  activeTab,
  setActiveTab,
  orientation = 'landscape',
  stats,
}) => {
  const isLandscape = orientation === 'landscape';

  const totalXp = stats
    ? (stats.totalGamesPlayed * 20) + (stats.totalWins * 50) + (stats.dailyChallengesCompleted * 30) + Math.floor(stats.totalMoneyEarned / 2)
    : 0;
  const level = Math.floor(totalXp / 100) + 1;
  const expPercent = totalXp % 100;

  return (
    <div
      className={`bg-[#FFFDF8] rounded-[36px] border-[6px] border-[#FFF0F3] shadow-2xl overflow-y-auto select-none relative my-auto transition-all duration-300 max-h-full ${
        isLandscape
          ? 'w-full max-w-[860px] p-3 sm:p-4 flex flex-col justify-between'
          : 'w-full max-w-[420px] p-3 sm:p-4 flex flex-col justify-between'
      }`}
    >
      {/* Background Soft Polka Dot Pattern */}
      <div className="absolute inset-0 bg-polka-dots pointer-events-none opacity-60" />

      {/* Main Container */}
      <div className="relative z-10 h-full flex flex-col justify-between min-h-0">
        {/* Top Header Row in Landscape */}
        <div className="flex items-center justify-between w-full mb-2">
          {/* Avatar & User Level */}
          <div className="flex items-center gap-2">
            <div className="w-10 h-10 rounded-full bg-[#FFF0F3] border-2 border-[#FFB6C1] flex items-center justify-center text-xl shadow-xs relative">
              🤡
              <span className="absolute -bottom-1 -right-1 bg-[#FF6392] text-white text-[8px] font-black px-1 rounded-full border border-white">
                Lv.{level}
              </span>
            </div>
            <div className="flex flex-col">
              <span className="font-black text-xs text-[#FF6392] flex items-center gap-1">
                甜心小丑 <span className="text-[10px]">🎀</span>
              </span>
              {/* EXP Bar */}
              <div className="w-20 h-1.5 bg-[#FFD1DC] rounded-full overflow-hidden border border-white mt-0.5" title={`经验值: ${expPercent}/100`}>
                <div className="h-full bg-[#FF6392] rounded-full transition-all duration-300" style={{ width: `${expPercent}%` }} />
              </div>
            </div>
          </div>

          {/* Center Logo in Landscape Mode */}
          {isLandscape && (
            <div className="flex items-center gap-2 bg-gingham-blue border-2 border-[#A8D1E7] px-4 py-1 rounded-full shadow-xs">
              <span className="text-lg">🎀</span>
              <h1 className="text-lg font-black text-[#FF6392] tracking-wider drop-shadow-xs">
                小丑牌 Joker's Diary
              </h1>
            </div>
          )}

          {/* Top Right Mail & Settings Buttons */}
          <div className="flex items-center gap-2">
            <button className="w-8 h-8 rounded-xl bg-white border border-[#FFD1DC] text-[#FF6392] flex items-center justify-center shadow-2xs hover:bg-[#FFF0F3] transition-colors cursor-pointer">
              <Mail className="w-4 h-4" />
            </button>
            <button
              onClick={onOpenSettings}
              className="w-8 h-8 rounded-xl bg-white border border-[#FFD1DC] text-[#FF6392] flex items-center justify-center shadow-2xs hover:bg-[#FFF0F3] transition-colors cursor-pointer"
              title="设置"
            >
              <Settings className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Content Layout: 2 Columns for Landscape, 1 Column for Portrait */}
        <div className={`flex gap-4 my-auto ${isLandscape ? 'flex-row items-center justify-between' : 'flex-col'}`}>
          {/* Left Panel in Landscape / Top Panel in Portrait */}
          <div className={`flex flex-col justify-center gap-3 ${isLandscape ? 'w-[45%]' : 'w-full'}`}>
            {/* Title Ribbon Logo (Portrait Mode) */}
            {!isLandscape && (
              <div className="flex flex-col items-center justify-center relative">
                <span className="text-2xl drop-shadow-xs z-20 -mb-2">🎀</span>
                <div className="bg-gingham-blue border-2 border-[#A8D1E7] rounded-3xl p-3 px-6 shadow-md flex flex-col items-center relative text-center w-full max-w-[320px]">
                  <h1 className="text-3xl font-black text-[#FF6392] tracking-wider drop-shadow-[0_2px_0_#FFFFFF]">
                    小丑牌
                  </h1>
                  <div className="bg-[#A8D1E7] text-white font-bold text-[10px] tracking-widest px-3 py-0.5 rounded-full border border-white shadow-2xs mt-1 flex items-center gap-1">
                    <span>✦ Joker's Diary ✦</span>
                  </div>
                </div>
              </div>
            )}

            {/* Featured Card Banner ("本期推荐") */}
            <div className="bg-[#FFFDF8] border-2 border-[#FFD1DC] rounded-3xl p-3 shadow-sm flex items-center justify-between relative overflow-hidden">
              {/* Left Text & CTA */}
              <div className="flex flex-col gap-1 z-10 max-w-[160px]">
                <span className="bg-[#FFD1DC] text-[#FF6392] font-black text-[10px] px-2.5 py-0.5 rounded-full w-fit">
                  本期推荐
                </span>
                <h2 className="text-base font-black text-[#FF6392] mt-0.5">甜心小丑</h2>
                <p className="text-[10px] text-slate-500 font-medium">微笑是最好的王牌</p>
                <button
                  onClick={onStartBattle}
                  className="mt-1 bg-[#FF85A1] hover:bg-[#FF6392] text-white font-bold text-[11px] px-3 py-1 rounded-full shadow-xs flex items-center gap-1 w-fit transition-colors border-b-2 border-[#E0607E] cursor-pointer"
                >
                  <span>查看详情</span>
                  <ChevronRight className="w-3 h-3" />
                </button>
              </div>

              {/* Right Card Illustration */}
              <div
                onClick={onStartBattle}
                className="w-20 h-28 bg-white rounded-2xl border-2 border-[#FFB6C1] shadow-md p-1.5 flex flex-col items-center justify-between relative rotate-3 group hover:rotate-0 transition-transform cursor-pointer"
              >
                <div className="flex items-center justify-between w-full text-[9px] font-black text-[#FF6392]">
                  <span>JOKER</span>
                  <span>✦</span>
                </div>
                <div className="w-12 h-14 rounded-xl bg-[#FFF0F3] border border-[#FFD1DC] flex items-center justify-center text-2xl">
                  🤡
                </div>
                <div className="flex items-center justify-between w-full text-[9px] font-black text-[#FF6392] rotate-180">
                  <span>JOKER</span>
                  <span>✦</span>
                </div>
              </div>
            </div>
          </div>

          {/* Right Panel in Landscape / Bottom Grid in Portrait */}
          <div className={`flex flex-col justify-center gap-3 ${isLandscape ? 'w-[52%]' : 'w-full'}`}>
            {/* Stats Row */}
            <div className="grid grid-cols-3 gap-2">
              {/* Gold Coins */}
              <div className="bg-white border border-[#FFD1DC] rounded-2xl p-2 flex items-center gap-2 shadow-2xs">
                <div className="w-7 h-7 rounded-full bg-amber-100 text-amber-500 font-black text-xs flex items-center justify-center border border-amber-200">
                  🪙
                </div>
                <div className="flex flex-col">
                  <span className="text-[9px] text-slate-400 font-bold">金币</span>
                  <span className="text-xs font-black text-slate-700">{money.toLocaleString()}</span>
                </div>
              </div>

              {/* Win Streak */}
              <div className="bg-white border border-[#FFD1DC] rounded-2xl p-2 flex items-center gap-2 shadow-2xs">
                <div className="w-7 h-7 rounded-full bg-pink-100 text-[#FF6392] font-black text-xs flex items-center justify-center border border-pink-200">
                  💖
                </div>
                <div className="flex flex-col">
                  <span className="text-[9px] text-slate-400 font-bold">连胜</span>
                  <span className="text-xs font-black text-slate-700">{streak}</span>
                </div>
              </div>

              {/* Deck Count */}
              <div className="bg-white border border-[#FFD1DC] rounded-2xl p-2 flex items-center gap-2 shadow-2xs">
                <div className="w-7 h-7 rounded-full bg-sky-100 text-sky-600 font-black text-xs flex items-center justify-center border border-sky-200">
                  🎴
                </div>
                <div className="flex flex-col">
                  <span className="text-[9px] text-slate-400 font-bold">牌组</span>
                  <span className="text-xs font-black text-slate-700">{deckCount}/{maxDeckCount}</span>
                </div>
              </div>
            </div>

            {/* Function Buttons Grid */}
            <div className="grid grid-cols-4 gap-2">
              {/* 图鉴 */}
              <button
                onClick={onOpenDeckView}
                className="bg-white border-2 border-[#FFD1DC] hover:border-[#FF85A1] rounded-2xl p-2 flex flex-col items-center justify-center gap-1 shadow-xs transition-transform active:scale-95 cursor-pointer"
              >
                <div className="w-9 h-9 rounded-xl bg-[#FFF0F3] text-[#FF6392] flex items-center justify-center">
                  <BookOpen className="w-4 h-4" />
                </div>
                <span className="text-[11px] font-bold text-slate-700">图鉴</span>
              </button>

              {/* 商店 */}
              <button
                disabled
                title="Run 商店只会在 Blind 通关后开放"
                className="bg-slate-50 border-2 border-slate-200 rounded-2xl p-2 flex flex-col items-center justify-center gap-1 shadow-xs cursor-not-allowed opacity-60"
              >
                <div className="w-9 h-9 rounded-xl bg-pink-50 text-rose-500 flex items-center justify-center">
                  <ShoppingBag className="w-4 h-4" />
                </div>
                <span className="text-[11px] font-bold text-slate-500">Meta 商店</span>
                <span className="text-[8px] font-bold text-slate-400">暂未开放</span>
              </button>

              {/* 任务 */}
              <button
                onClick={onOpenAchievements}
                className="bg-white border-2 border-[#FFD1DC] hover:border-[#FF85A1] rounded-2xl p-2 flex flex-col items-center justify-center gap-1 shadow-xs transition-transform active:scale-95 cursor-pointer relative"
              >
                <div className="w-9 h-9 rounded-xl bg-purple-50 text-purple-500 flex items-center justify-center">
                  <ClipboardList className="w-4 h-4" />
                </div>
                <span className="text-[11px] font-bold text-slate-700">任务</span>
                <span className="absolute top-1 right-1 w-2.5 h-2.5 bg-[#FF6392] rounded-full" />
              </button>

              {/* 收藏 */}
              <button
                onClick={onOpenAchievements}
                className="bg-white border-2 border-[#FFD1DC] hover:border-[#FF85A1] rounded-2xl p-2 flex flex-col items-center justify-center gap-1 shadow-xs transition-transform active:scale-95 cursor-pointer"
              >
                <div className="w-9 h-9 rounded-xl bg-sky-50 text-sky-500 flex items-center justify-center">
                  <Heart className="w-4 h-4 fill-sky-200" />
                </div>
                <span className="text-[11px] font-bold text-slate-700">收藏</span>
              </button>
            </div>
          </div>
        </div>

        {/* Bottom Navigation Ribbon Bar */}
        <div className="relative z-10 w-full mt-2">
          {/* Blue Gingham Header Strip with Bow */}
          <div className="bg-gingham-blue border-t-2 border-[#A8D1E7] p-0.5 flex items-center justify-center relative rounded-t-xl">
            <span className="text-base drop-shadow-2xs -mt-2.5">🎀</span>
          </div>

          {/* Bottom Navigation Grid */}
          <div className="bg-white p-1.5 border-t border-[#FFD1DC] rounded-b-2xl grid grid-cols-4 gap-1 text-center shadow-xs">
            <button
              onClick={() => setActiveTab('home')}
              className={`flex flex-col items-center gap-0.5 py-1 rounded-xl cursor-pointer ${
                activeTab === 'home' ? 'text-[#FF6392] font-black' : 'text-slate-400 font-bold'
              }`}
            >
              <Home className="w-4 h-4" />
              <span className="text-[10px]">首页</span>
            </button>

            <button
              onClick={() => {
                setActiveTab('deck');
                onOpenDeckView();
              }}
              className={`flex flex-col items-center gap-0.5 py-1 rounded-xl cursor-pointer ${
                activeTab === 'deck' ? 'text-[#FF6392] font-black' : 'text-slate-400 font-bold'
              }`}
            >
              <Layers className="w-4 h-4" />
              <span className="text-[10px]">牌组</span>
            </button>

            <button
              onClick={() => {
                setActiveTab('battle');
                onStartBattle();
              }}
              className={`flex flex-col items-center gap-0.5 py-1 rounded-xl cursor-pointer ${
                activeTab === 'battle' ? 'text-[#FF6392] font-black' : 'text-slate-400 font-bold'
              }`}
            >
              <Swords className="w-4 h-4" />
              <span className="text-[10px]">对战</span>
            </button>

            <button
              onClick={() => {
                setActiveTab('achieve');
                onOpenAchievements();
              }}
              className={`flex flex-col items-center gap-0.5 py-1 rounded-xl cursor-pointer ${
                activeTab === 'achieve' ? 'text-[#FF6392] font-black' : 'text-slate-400 font-bold'
              }`}
            >
              <Trophy className="w-4 h-4" />
              <span className="text-[10px]">成就</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
