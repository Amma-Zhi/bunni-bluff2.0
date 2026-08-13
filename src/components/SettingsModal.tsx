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
    <div className="fixed inset-0 bg-pink-950/60 backdrop-blur-md z-50 flex items-center justify-center p-2 sm:p-4 safe-area-p select-none overflow-y-auto">
      {/* Outer Main Container matching Image 1 */}
      <motion.div
        initial={{ opacity: 0, scale: 0.92 }}
        animate={{ opacity: 1, scale: 1 }}
        exit={{ opacity: 0, scale: 0.92 }}
        className="w-full max-w-lg bg-[#FFFDF8] rounded-[2.5rem] p-4 sm:p-6 border-4 border-[#FBBFCA] shadow-2xl flex flex-col gap-3.5 max-h-[96vh] max-h-[96dvh] relative text-left overflow-y-auto my-auto"
        style={{
          boxShadow: '0 12px 36px rgba(244, 114, 182, 0.25), inset 0 0 0 3px #FFF0F3',
        }}
      >
        {/* Corner Hearts */}
        <span className="absolute top-2.5 left-3 text-[#F7A8B8] text-xs font-serif">♡</span>
        <span className="absolute top-2.5 right-12 text-[#F7A8B8] text-xs font-serif">♡</span>
        <span className="absolute bottom-2.5 left-3 text-[#F7A8B8] text-xs font-serif">♡</span>
        <span className="absolute bottom-2.5 right-3 text-[#F7A8B8] text-xs font-serif">♡</span>

        {/* Top Close Button matching Image 1 */}
        <button
          onClick={onClose}
          className="absolute top-3 right-3 z-30 w-8 h-8 rounded-full bg-white border-2 border-[#FBBFCA] text-[#718096] hover:text-[#E53E3E] hover:bg-[#FFF0F3] flex items-center justify-center shadow-xs transition-transform cursor-pointer active:scale-90"
          title="关闭设置"
        >
          <X className="w-4 h-4 stroke-[2.5]" />
          <span className="absolute -bottom-1 text-[8px]">🎀</span>
        </button>

        {/* Header matching Image 1 */}
        <div className="flex items-center gap-3 pr-8 shrink-0">
          <div className="w-12 h-12 rounded-full bg-[#FFF0F3] border-2 border-dashed border-[#FBBFCA] text-[#E85D75] flex items-center justify-center shadow-xs shrink-0 relative">
            <Settings className="w-6 h-6" />
            <div className="absolute inset-0 rounded-full border border-pink-200 pointer-events-none scale-110" />
          </div>
          <div>
            <h2 className="text-xl sm:text-2xl font-black text-[#D93856] flex items-center gap-1.5 tracking-wide">
              <span>游戏设置</span>
              <span className="text-base">🎀</span>
            </h2>
            <p className="text-xs text-[#718096] font-medium">音效与背景音乐偏好，自动保存在本地</p>
          </div>
        </div>

        {/* Dashed Ribbon Divider */}
        <div className="w-full flex items-center justify-center my-0.5 relative">
          <div className="w-full border-t-2 border-dashed border-[#FBBFCA]" />
          <span className="absolute bg-[#FFFDF8] px-2 text-[#718096] text-xs font-bold flex items-center gap-1">
            🎀
          </span>
        </div>

        {/* Scrollable Form Body */}
        <div className="flex-1 overflow-y-auto pr-1 flex flex-col gap-3.5 text-xs">
          {/* Card 1: 游戏音效 */}
          <div className="bg-[#FFF5F7]/80 p-3.5 sm:p-4 rounded-3xl border-2 border-dashed border-[#F8A4B8] shadow-xs flex items-center justify-between gap-3 relative overflow-hidden">
            <span className="absolute top-1 right-2 text-[#F7A8B8] text-[10px]">♡</span>
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-white border-2 border-[#FBBFCA] text-[#E85D75] flex items-center justify-center shadow-xs shrink-0">
                {sfxEnabled ? <Volume2 className="w-5 h-5" /> : <VolumeX className="w-5 h-5 text-slate-400" />}
              </div>
              <div className="flex flex-col">
                <span className="font-extrabold text-sm sm:text-base text-[#2C3E50]">游戏音效</span>
                <span className="text-[11px] text-[#718096]">卡牌翻转、金币与点击提示音</span>
              </div>
            </div>

            {/* Toggle Switch matching Image 1 */}
            <button
              onClick={() => onToggleSfx(!sfxEnabled)}
              className={`w-16 h-8 rounded-full p-1 transition-all duration-200 border-2 border-[#F8A4B8] cursor-pointer flex items-center relative shrink-0 ${
                sfxEnabled
                  ? 'bg-[#E85D75] shadow-inner'
                  : 'bg-[#CBD5E0]'
              }`}
            >
              <motion.div
                layout
                transition={{ type: 'spring', stiffness: 500, damping: 30 }}
                className={`w-6 h-6 rounded-full bg-white border border-[#F8A4B8] shadow-md flex items-center justify-center ${
                  sfxEnabled ? 'ml-auto text-[#E85D75]' : 'mr-auto text-slate-400'
                }`}
              >
                {sfxEnabled ? <Check className="w-3.5 h-3.5 stroke-[3]" /> : <X className="w-3 h-3 stroke-[3]" />}
              </motion.div>
            </button>
          </div>

          {/* Card 2: 背景音乐音量 */}
          <div className="bg-[#FFF5F7]/80 p-3.5 sm:p-4 rounded-3xl border-2 border-dashed border-[#F8A4B8] shadow-xs flex flex-col gap-3 relative overflow-hidden">
            <span className="absolute top-1 right-2 text-[#F7A8B8] text-[10px]">♡</span>
            <div className="flex items-center justify-between gap-2">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-white border-2 border-[#FBBFCA] text-[#E85D75] flex items-center justify-center shadow-xs shrink-0">
                  <Music className="w-5 h-5" />
                </div>
                <div className="flex flex-col">
                  <span className="font-extrabold text-sm sm:text-base text-[#2C3E50]">背景音乐音量</span>
                  <span className="text-[11px] text-[#718096]">愉快抓耳的背景旋律</span>
                </div>
              </div>

              {/* Mute Pill Button */}
              <button
                onClick={() => onChangeBgmVolume(bgmVolume > 0 ? 0 : 60)}
                className={`px-3 py-1 rounded-full text-xs font-black border-2 transition-all cursor-pointer shadow-xs ${
                  bgmVolume === 0
                    ? 'bg-[#E85D75] text-white border-[#D93856]'
                    : 'bg-white text-[#2C3E50] border-[#BEE3F8] hover:bg-[#EBF8FF]'
                }`}
              >
                静音
              </button>
            </div>

            {/* Slider with custom Blue Gingham Track & Heart Thumb */}
            <div className="flex flex-col gap-2 mt-1">
              <div className="relative w-full flex items-center">
                <input
                  type="range"
                  min="0"
                  max="100"
                  step="1"
                  value={bgmVolume}
                  onChange={(e) => onChangeBgmVolume(parseInt(e.target.value, 10))}
                  className="w-full h-4 bg-[#CDE4FE] rounded-full appearance-none cursor-pointer accent-[#E85D75] border-2 border-[#F8A4B8] shadow-inner"
                  style={{
                    backgroundImage: 'linear-gradient(90deg, #F8A4B8 0%, #F8A4B8 ' + bgmVolume + '%, #CDE4FE ' + bgmVolume + '%, #CDE4FE 100%)',
                  }}
                />
              </div>

              {/* Presets Row */}
              <div className="grid grid-cols-4 gap-1.5 mt-1">
                {[0, 30, 60, 100].map((preset) => (
                  <button
                    key={preset}
                    onClick={() => onChangeBgmVolume(preset)}
                    className={`py-1 rounded-full text-xs font-black transition-all cursor-pointer border-2 shadow-xs ${
                      bgmVolume === preset
                        ? 'bg-[#E85D75] text-white border-[#D93856]'
                        : 'bg-white text-[#2C3E50] border-[#BEE3F8] hover:bg-[#EBF8FF]'
                    }`}
                  >
                    {preset === 0 ? '静音' : `${preset}%`}
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Card 3: 重置当前对局 */}
          <div className="bg-[#FFF5F7]/80 p-3.5 sm:p-4 rounded-3xl border-2 border-dashed border-[#F8A4B8] shadow-xs flex flex-col gap-2 relative">
            <span className="absolute top-1 right-2 text-[#F7A8B8] text-[10px]">♡</span>
            <div className="flex items-center justify-between gap-2">
              <div className="flex items-center gap-3">
                <div className="w-9 h-9 rounded-full bg-white border-2 border-[#FBBFCA] text-[#E85D75] flex items-center justify-center shadow-xs shrink-0">
                  <RotateCcw className="w-4 h-4" />
                </div>
                <div className="flex flex-col">
                  <span className="font-extrabold text-sm text-[#D93856]">重置当前对局</span>
                  <span className="text-[11px] text-[#718096]">重置当前对局进度，从 Ante 1 重新开始</span>
                </div>
              </div>

              {!showConfirmReset ? (
                <button
                  onClick={() => setShowConfirmReset(true)}
                  className="px-3.5 py-1.5 rounded-full bg-[#E85D75] hover:bg-[#D93856] text-white font-extrabold text-xs shadow-xs border-2 border-white transition-all cursor-pointer shrink-0"
                >
                  重置对局
                </button>
              ) : (
                <div className="flex items-center gap-1.5 shrink-0">
                  <button
                    onClick={handleConfirmReset}
                    className="px-3 py-1 rounded-full bg-red-600 hover:bg-red-700 text-white font-black text-xs shadow-xs cursor-pointer"
                  >
                    确认重置
                  </button>
                  <button
                    onClick={() => setShowConfirmReset(false)}
                    className="px-2 py-1 rounded-full bg-slate-200 hover:bg-slate-300 text-slate-700 font-bold text-xs cursor-pointer"
                  >
                    取消
                  </button>
                </div>
              )}
            </div>

            {showConfirmReset && (
              <p className="text-[11px] text-rose-800 font-bold bg-white/90 p-2 rounded-2xl border border-rose-300 flex items-center gap-1 mt-1">
                <AlertTriangle className="w-3.5 h-3.5 text-rose-600 shrink-0" />
                <span>这将会清除当前对局得分、金币与小丑牌，从第1关开始！</span>
              </p>
            )}
          </div>

          {/* Card 4: 重置所有存档与数据 */}
          <div className="bg-[#FFF0F3]/90 p-3.5 sm:p-4 rounded-3xl border-2 border-dashed border-[#F8A4B8] shadow-xs flex flex-col gap-2 relative">
            <span className="absolute top-1 right-2 text-[#F7A8B8] text-[10px]">♡</span>
            <div className="flex items-center justify-between gap-2">
              <div className="flex items-center gap-3">
                <div className="w-9 h-9 rounded-full bg-[#D93856] text-white border-2 border-white flex items-center justify-center shadow-xs shrink-0">
                  <AlertTriangle className="w-4 h-4" />
                </div>
                <div className="flex flex-col">
                  <span className="font-extrabold text-sm text-[#9B1C31]">重置所有存档与数据</span>
                  <span className="text-[11px] text-[#C53030]">重置等级/经验为 Lv.1 0%，草莓水晶为 0，成就全部归零</span>
                </div>
              </div>

              {!showConfirmAllReset ? (
                <button
                  onClick={() => setShowConfirmAllReset(true)}
                  className="px-3.5 py-1.5 rounded-full bg-[#C53030] hover:bg-[#9B1C31] text-white font-extrabold text-xs shadow-xs border-2 border-white transition-all cursor-pointer shrink-0"
                >
                  重置全部
                </button>
              ) : (
                <div className="flex items-center gap-1.5 shrink-0">
                  <button
                    onClick={handleConfirmAllReset}
                    className="px-3 py-1 rounded-full bg-red-700 hover:bg-red-800 text-white font-black text-xs shadow-xs cursor-pointer"
                  >
                    确认清空
                  </button>
                  <button
                    onClick={() => setShowConfirmAllReset(false)}
                    className="px-2 py-1 rounded-full bg-slate-200 hover:bg-slate-300 text-slate-700 font-bold text-xs cursor-pointer"
                  >
                    取消
                  </button>
                </div>
              )}
            </div>

            {showConfirmAllReset && (
              <p className="text-[11px] text-red-900 font-bold bg-white/95 p-2 rounded-2xl border border-red-300 flex items-center gap-1 mt-1">
                <AlertTriangle className="w-3.5 h-3.5 text-red-600 shrink-0" />
                <span>注意：将清除所有等级经验、水晶、成就、解锁及历史记录并归零！</span>
              </p>
            )}
          </div>

          {/* Test Sound & Save Note Bar */}
          <div className="flex items-center justify-between pt-1 relative">
            <button
              onClick={handleTestSfx}
              className="px-4 py-1.5 rounded-full bg-white text-[#D93856] font-extrabold border-2 border-[#F8A4B8] hover:bg-[#FFF0F3] flex items-center gap-1.5 transition-all cursor-pointer text-xs shadow-xs"
            >
              <Play className="w-3.5 h-3.5 text-[#E85D75] fill-[#E85D75]" />
              <span>试听特效音</span>
            </button>

            <span className="text-xs font-bold text-[#2B6CB0] flex items-center gap-1 bg-white px-3 py-1 rounded-full border-2 border-[#BEE3F8] shadow-xs">
              <Sparkles className="w-3.5 h-3.5 text-[#3182CE]" />
              <span>设置已实时保存</span>
            </span>
          </div>
        </div>

        {/* Big Stitched Bottom "完成" Button matching Image 1 */}
        <div className="relative w-full pt-1">
          <button
            onClick={onClose}
            className="w-full py-3 rounded-full bg-gradient-to-r from-[#F8A4B8] via-[#E85D75] to-[#F8A4B8] hover:from-[#E85D75] hover:to-[#D93856] text-white font-black text-base shadow-lg transition-all border-2 border-white cursor-pointer active:scale-[0.98] tracking-widest flex items-center justify-center relative"
          >
            <span>成 功 / 完 成</span>
          </button>
          <span className="absolute -bottom-2 left-1/2 -translate-x-1/2 text-sm pointer-events-none">🎀</span>
        </div>
      </motion.div>
    </div>
  );
};
