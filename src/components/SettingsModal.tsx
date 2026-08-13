import React, { useState } from 'react';
import { motion } from 'motion/react';
import { Settings, X, Volume2, VolumeX, Music, Sparkles, Check, Play, RotateCcw, AlertTriangle } from 'lucide-react';
import { soundEngine } from '../utils/audio';

interface SettingsModalProps {
  sfxEnabled: boolean;
  bgmVolume: number; // 0 to 100
  onToggleSfx: (enabled: boolean) => void;
  onChangeBgmVolume: (volume: number) => void;
  onResetGame?: () => void;
  onResetAllData?: () => void;
  onClose: () => void;
}

export const SettingsModal: React.FC<SettingsModalProps> = ({
  sfxEnabled,
  bgmVolume,
  onToggleSfx,
  onChangeBgmVolume,
  onResetGame,
  onResetAllData,
  onClose,
}) => {
  const [showConfirmReset, setShowConfirmReset] = useState(false);
  const [showConfirmAllReset, setShowConfirmAllReset] = useState(false);

  const handleTestSfx = () => {
    soundEngine.playCoin();
  };

  const handleConfirmReset = () => {
    if (onResetGame) {
      soundEngine.playPop();
      onResetGame();
      onClose();
    }
  };

  const handleConfirmAllReset = () => {
    if (onResetAllData) {
      soundEngine.playPop();
      onResetAllData();
      onClose();
    }
  };

  return (
    <div className="fixed inset-0 bg-pink-950/60 backdrop-blur-md z-50 flex items-center justify-center p-4 safe-area-p select-none">
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        exit={{ opacity: 0, scale: 0.9 }}
        className="w-full max-w-md bg-gradient-to-b from-white via-pink-50 to-rose-100 rounded-3xl p-6 border-4 border-pink-300 shadow-2xl flex flex-col gap-5 max-h-[90vh] max-h-[90dvh] relative text-left overflow-hidden"
      >
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 z-30 text-slate-400 hover:text-slate-600 p-1.5 rounded-full bg-white/80 backdrop-blur-xs shadow-xs hover:bg-pink-100 transition-colors cursor-pointer"
          title="关闭设置"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Modal Header */}
        <div className="flex items-center gap-2.5 border-b-2 border-pink-200 pb-3 pr-8 shrink-0">
          <div className="w-10 h-10 rounded-2xl bg-gradient-to-tr from-pink-400 to-rose-400 text-white flex items-center justify-center shadow-md">
            <Settings className="w-5 h-5" />
          </div>
          <div>
            <h2 className="text-lg font-black text-rose-600 flex items-center gap-1.5">
              <span>游戏设置</span>
              <span className="text-xs">🎀</span>
            </h2>
            <p className="text-xs text-slate-500">音效与背景音乐偏好，自动保存至本地</p>
          </div>
        </div>

        {/* Settings Form */}
        <div className="flex-1 overflow-y-auto pr-1 flex flex-col gap-4 text-xs">
          {/* Item 1: Sound Effects Toggle */}
          <div className="bg-white p-4 rounded-2xl border-2 border-pink-200 shadow-2xs flex items-center justify-between gap-3">
            <div className="flex items-center gap-3">
              <div
                className={`w-9 h-9 rounded-xl flex items-center justify-center ${
                  sfxEnabled ? 'bg-pink-100 text-pink-600' : 'bg-slate-100 text-slate-400'
                }`}
              >
                {sfxEnabled ? <Volume2 className="w-5 h-5" /> : <VolumeX className="w-5 h-5" />}
              </div>
              <div className="flex flex-col">
                <span className="font-extrabold text-sm text-slate-800">游戏音效</span>
                <span className="text-[11px] text-slate-500">卡牌翻转、金币与点击提示音</span>
              </div>
            </div>

            {/* Toggle Switch */}
            <button
              onClick={() => onToggleSfx(!sfxEnabled)}
              className={`w-14 h-8 rounded-full p-1 transition-colors duration-200 ease-in-out cursor-pointer flex items-center relative ${
                sfxEnabled
                  ? 'bg-gradient-to-r from-pink-400 to-rose-500 shadow-xs'
                  : 'bg-slate-300'
              }`}
            >
              <motion.div
                layout
                transition={{ type: 'spring', stiffness: 500, damping: 30 }}
                className={`w-6 h-6 rounded-full bg-white shadow-md flex items-center justify-center ${
                  sfxEnabled ? 'ml-auto text-rose-500 font-black text-[10px]' : 'mr-auto text-slate-400 text-[10px]'
                }`}
              >
                {sfxEnabled ? <Check className="w-3.5 h-3.5 stroke-[3]" /> : '✕'}
              </motion.div>
            </button>
          </div>

          {/* Item 2: BGM Volume Slider */}
          <div className="bg-white p-4 rounded-2xl border-2 border-pink-200 shadow-2xs flex flex-col gap-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2.5">
                <div className="w-9 h-9 rounded-xl bg-purple-100 text-purple-600 flex items-center justify-center">
                  <Music className="w-5 h-5" />
                </div>
                <div className="flex flex-col">
                  <span className="font-extrabold text-sm text-slate-800">背景音乐音量</span>
                  <span className="text-[11px] text-slate-500">愉快抓耳的背景旋律</span>
                </div>
              </div>
              <span className="font-black text-sm text-purple-600 bg-purple-50 px-2.5 py-1 rounded-full border border-purple-200">
                {bgmVolume === 0 ? '静音' : `${bgmVolume}%`}
              </span>
            </div>

            {/* Slider */}
            <div className="flex flex-col gap-1.5 mt-1">
              <input
                type="range"
                min="0"
                max="100"
                step="1"
                value={bgmVolume}
                onChange={(e) => onChangeBgmVolume(parseInt(e.target.value, 10))}
                className="w-full h-2.5 bg-pink-100 rounded-lg appearance-none cursor-pointer accent-rose-500 border border-pink-200"
              />

              {/* Quick Preset Buttons */}
              <div className="flex items-center justify-between gap-1 mt-1">
                {[0, 30, 60, 100].map((preset) => (
                  <button
                    key={preset}
                    onClick={() => onChangeBgmVolume(preset)}
                    className={`px-2.5 py-1 rounded-xl text-[11px] font-bold transition-colors cursor-pointer border ${
                      bgmVolume === preset
                        ? 'bg-purple-600 text-white border-purple-600 shadow-2xs'
                        : 'bg-purple-50 text-purple-700 border-purple-200 hover:bg-purple-100'
                    }`}
                  >
                    {preset === 0 ? '静音' : `${preset}%`}
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Item 3: Reset Current Run */}
          <div className="bg-rose-50/80 p-3.5 rounded-2xl border-2 border-rose-200 shadow-2xs flex flex-col gap-2">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-xl bg-rose-500 text-white flex items-center justify-center shadow-xs">
                  <RotateCcw className="w-4 h-4" />
                </div>
                <div className="flex flex-col">
                  <span className="font-extrabold text-xs text-rose-900">重置当前对局</span>
                  <span className="text-[10px] text-rose-600">重置当前对局进度，从 Ante 1 重新开始</span>
                </div>
              </div>

              {!showConfirmReset ? (
                <button
                  onClick={() => setShowConfirmReset(true)}
                  className="px-3 py-1.5 rounded-xl bg-rose-500 hover:bg-rose-600 text-white font-extrabold text-xs shadow-xs transition-colors cursor-pointer"
                >
                  重置对局
                </button>
              ) : (
                <div className="flex items-center gap-1.5">
                  <button
                    onClick={handleConfirmReset}
                    className="px-3 py-1 rounded-xl bg-rose-600 hover:bg-rose-700 text-white font-black text-xs shadow-xs transition-colors cursor-pointer"
                  >
                    确认重置
                  </button>
                  <button
                    onClick={() => setShowConfirmReset(false)}
                    className="px-2 py-1 rounded-xl bg-slate-200 hover:bg-slate-300 text-slate-700 font-bold text-xs transition-colors cursor-pointer"
                  >
                    取消
                  </button>
                </div>
              )}
            </div>

            {showConfirmReset && (
              <p className="text-[10px] text-rose-700 font-bold bg-white/80 p-2 rounded-xl border border-rose-200 flex items-center gap-1">
                <AlertTriangle className="w-3.5 h-3.5 text-rose-500 shrink-0" />
                <span>这将会清除当前对局的得分、金币和小丑卡牌，并从第 1 关开始！</span>
              </p>
            )}
          </div>

          {/* Item 4: Full Global Data Reset (Level 1, 0 Crystals, 0 Achievements) */}
          <div className="bg-red-100/90 p-3.5 rounded-2xl border-2 border-red-300 shadow-2xs flex flex-col gap-2">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-xl bg-red-600 text-white flex items-center justify-center shadow-xs">
                  <AlertTriangle className="w-4 h-4" />
                </div>
                <div className="flex flex-col">
                  <span className="font-extrabold text-xs text-red-950">重置所有存档与数据</span>
                  <span className="text-[10px] text-red-700">重置等级/经验为 Lv.1 0%，草莓水晶为 0，成就全部归零</span>
                </div>
              </div>

              {!showConfirmAllReset ? (
                <button
                  onClick={() => setShowConfirmAllReset(true)}
                  className="px-3 py-1.5 rounded-xl bg-red-600 hover:bg-red-700 text-white font-extrabold text-xs shadow-xs transition-colors cursor-pointer"
                >
                  重置全部
                </button>
              ) : (
                <div className="flex items-center gap-1.5">
                  <button
                    onClick={handleConfirmAllReset}
                    className="px-3 py-1 rounded-xl bg-red-700 hover:bg-red-800 text-white font-black text-xs shadow-xs transition-colors cursor-pointer"
                  >
                    确认清空
                  </button>
                  <button
                    onClick={() => setShowConfirmAllReset(false)}
                    className="px-2 py-1 rounded-xl bg-slate-200 hover:bg-slate-300 text-slate-700 font-bold text-xs transition-colors cursor-pointer"
                  >
                    取消
                  </button>
                </div>
              )}
            </div>

            {showConfirmAllReset && (
              <p className="text-[10px] text-red-800 font-bold bg-white/90 p-2 rounded-xl border border-red-300 flex items-center gap-1">
                <AlertTriangle className="w-3.5 h-3.5 text-red-600 shrink-0" />
                <span>注意：将清除所有积累的等级经验、水晶、成就、解锁样式以及历史战绩并完全归零！</span>
              </p>
            )}
          </div>

          {/* Test Sound Button & Auto-Save Note */}
          <div className="flex items-center justify-between pt-1">
            <button
              onClick={handleTestSfx}
              className="px-3 py-1.5 rounded-xl bg-rose-50 hover:bg-rose-100 text-rose-700 font-bold border border-rose-200 flex items-center gap-1.5 transition-colors cursor-pointer text-xs"
            >
              <Play className="w-3.5 h-3.5 text-rose-500 fill-rose-500" />
              <span>试听特效音</span>
            </button>

            <span className="text-[11px] text-emerald-600 font-bold flex items-center gap-1">
              <Sparkles className="w-3.5 h-3.5 text-emerald-500 fill-emerald-300" />
              <span>设置已实时保存</span>
            </span>
          </div>
        </div>

        {/* Done Button */}
        <button
          onClick={onClose}
          className="w-full mt-2 py-2.5 rounded-2xl bg-gradient-to-r from-pink-400 via-rose-400 to-pink-500 hover:from-pink-500 hover:to-rose-600 text-white font-black text-sm shadow-md transition-all border-2 border-white cursor-pointer active:scale-[0.98]"
        >
          完成
        </button>
      </motion.div>
    </div>
  );
};
