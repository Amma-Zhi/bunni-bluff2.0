import React from 'react';
import { Volume2, VolumeX, Layers, Trophy, Sparkles, Coins, Calendar, HelpCircle, Save, RotateCcw, Settings } from 'lucide-react';
import { soundEngine } from '../utils/audio';

interface HeaderProps {
  ante: number;
  blindName: string;
  targetScore: number;
  currentScore: number;
  money: number;
  handsLeft: number;
  discardsLeft: number;
  crystals: number;
  isDaily?: boolean;
  onOpenDeckView: () => void;
  onOpenAchievements: () => void;
  onOpenDaily: () => void;
  onOpenHelp: () => void;
  onOpenSettings?: () => void;
  onRestartRun: () => void;
  soundMuted: boolean;
  onToggleSound: () => void;
}

export const Header: React.FC<HeaderProps> = ({
  ante,
  blindName,
  targetScore,
  currentScore,
  money,
  handsLeft,
  discardsLeft,
  crystals,
  isDaily = false,
  onOpenDeckView,
  onOpenAchievements,
  onOpenDaily,
  onOpenHelp,
  onOpenSettings,
  onRestartRun,
  soundMuted,
  onToggleSound,
}) => {
  const progressPercent = Math.min(100, Math.floor((currentScore / Math.max(1, targetScore)) * 100));

  return (
    <header className="w-full bg-white/90 backdrop-blur-md border-b-2 border-pink-200 px-3 py-2 shadow-xs flex flex-col gap-2 select-none">
      {/* Top Controls & Navigation Bar */}
      <div className="flex items-center justify-between gap-2 text-xs">
        {/* Logo & Ante info */}
        <div className="flex items-center gap-2">
          <div className="bg-gradient-to-r from-pink-400 to-rose-400 text-white font-black px-2.5 py-1 rounded-full shadow-xs flex items-center gap-1 text-xs sm:text-sm">
            <Sparkles className="w-3.5 h-3.5 fill-white" />
            <span>萌心小丑牌</span>
          </div>
          <div className="bg-pink-100 text-pink-800 font-extrabold px-2 py-0.5 rounded-lg border border-pink-200 text-xs">
            关卡 {ante} / 8
          </div>
          {isDaily && (
            <div className="bg-amber-100 text-amber-800 font-extrabold px-2 py-0.5 rounded-lg border border-amber-300 text-xs flex items-center gap-1">
              <Calendar className="w-3 h-3 text-amber-600" />
              <span>每日挑战</span>
            </div>
          )}
        </div>

        {/* Action icons */}
        <div className="flex items-center gap-1.5 sm:gap-2">
          {/* Crystals button */}
          <button
            onClick={onOpenAchievements}
            className="flex items-center gap-1 bg-rose-50 hover:bg-rose-100 text-rose-700 font-bold px-2 py-1 rounded-xl border border-rose-200 transition-colors"
            title="成就与水晶商店"
          >
            <Sparkles className="w-3.5 h-3.5 text-rose-500 fill-rose-300" />
            <span>{crystals}</span>
          </button>

          {/* Money */}
          <div className="flex items-center gap-1 bg-amber-100 text-amber-900 font-black px-2.5 py-1 rounded-xl border border-amber-300">
            <Coins className="w-3.5 h-3.5 text-amber-600 fill-amber-300" />
            <span>🪙 {money}</span>
          </div>

          {/* Deck View */}
          <button
            onClick={onOpenDeckView}
            className="p-1.5 bg-pink-100 hover:bg-pink-200 text-pink-800 rounded-xl border border-pink-300 transition-colors"
            title="查看牌组与等级"
          >
            <Layers className="w-4 h-4" />
          </button>

          {/* Daily Mode */}
          <button
            onClick={onOpenDaily}
            className="p-1.5 bg-amber-50 hover:bg-amber-100 text-amber-800 rounded-xl border border-amber-200 transition-colors"
            title="每日挑战"
          >
            <Calendar className="w-4 h-4" />
          </button>

          {/* Sound toggle / Settings */}
          <button
            onClick={onOpenSettings || onToggleSound}
            className="p-1.5 bg-purple-50 hover:bg-purple-100 text-purple-800 rounded-xl border border-purple-200 transition-colors"
            title="音效与网络设置"
          >
            {soundMuted ? <VolumeX className="w-4 h-4 text-slate-400" /> : <Volume2 className="w-4 h-4 text-purple-600" />}
          </button>

          {onOpenSettings && (
            <button
              onClick={onOpenSettings}
              className="p-1.5 bg-rose-50 hover:bg-rose-100 text-rose-800 rounded-xl border border-rose-200 transition-colors"
              title="设置"
            >
              <Settings className="w-4 h-4 text-rose-600" />
            </button>
          )}

          {/* Help */}
          <button
            onClick={onOpenHelp}
            className="p-1.5 bg-sky-50 hover:bg-sky-100 text-sky-800 rounded-xl border border-sky-200 transition-colors"
            title="规则说明"
          >
            <HelpCircle className="w-4 h-4" />
          </button>

          {/* Restart */}
          <button
            onClick={onRestartRun}
            className="p-1.5 bg-slate-100 hover:bg-rose-100 text-slate-600 hover:text-rose-700 rounded-xl border border-slate-300 transition-colors"
            title="重新开始新局"
          >
            <RotateCcw className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Target score bar & Remaining Hands/Discards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 items-center gap-2 bg-pink-50/80 p-2 rounded-2xl border border-pink-200">
        {/* Blind Target & Current Score */}
        <div className="sm:col-span-2 flex flex-col gap-1">
          <div className="flex items-center justify-between text-xs font-extrabold text-slate-700">
            <span className="text-rose-600">{blindName} 目标得分:</span>
            <span className="font-black text-rose-700 text-sm">
              {currentScore.toLocaleString()} / {targetScore.toLocaleString()}
            </span>
          </div>
          {/* Progress Bar */}
          <div className="w-full bg-pink-200/70 rounded-full h-3.5 overflow-hidden p-0.5 border border-pink-300">
            <div
              className="bg-gradient-to-r from-pink-400 via-rose-400 to-pink-500 h-full rounded-full transition-all duration-500 shadow-xs"
              style={{ width: `${progressPercent}%` }}
            />
          </div>
        </div>

        {/* Hands & Discards Counters */}
        <div className="flex items-center justify-around sm:justify-end gap-3 text-xs font-black">
          <div className="bg-white px-3 py-1 rounded-xl border border-pink-200 flex items-center gap-1.5 shadow-2xs">
            <span className="text-rose-500 text-sm">♥️</span>
            <span className="text-slate-600">出牌:</span>
            <span className="text-rose-600 text-sm">{handsLeft}</span>
          </div>
          <div className="bg-white px-3 py-1 rounded-xl border border-pink-200 flex items-center gap-1.5 shadow-2xs">
            <span className="text-sky-500 text-sm">🗑️</span>
            <span className="text-slate-600">弃牌:</span>
            <span className="text-sky-600 text-sm">{discardsLeft}</span>
          </div>
        </div>
      </div>
    </header>
  );
};
