import React from 'react';
import { motion } from 'motion/react';
import { CardData, Suit } from '../types';
import { Sparkles, Shield, Coins, Gem, Plus, Zap, Heart } from 'lucide-react';

interface CardViewProps {
  card: CardData;
  isSelected?: boolean;
  onClick?: () => void;
  isScoring?: boolean;
  cardBack?: string;
  size?: 'sm' | 'md' | 'lg';
  isDisabled?: boolean;
}

// Cute Chibi Face Illustrations matching the image
const CuteJackCharacter: React.FC<{ size?: 'sm' | 'md' | 'lg' }> = ({ size = 'md' }) => {
  const heightClass = size === 'sm' ? 'h-7 sm:h-8' : size === 'lg' ? 'h-16' : 'h-10 sm:h-12';
  return (
    <svg viewBox="0 0 60 70" className={`w-auto ${heightClass} max-w-full drop-shadow-2xs`}>
      {/* Lace frame */}
      <rect x="2" y="2" width="56" height="66" rx="8" fill="#FFF0F3" stroke="#FFB6C1" strokeWidth="1.5" strokeDasharray="3 2" />
      {/* Hair */}
      <path d="M18 35 C18 20, 42 20, 42 35 Z" fill="#FFB3C6" />
      {/* Face */}
      <circle cx="30" cy="35" r="14" fill="#FFE5EC" stroke="#FF85A1" strokeWidth="1" />
      {/* Hat */}
      <path d="M18 25 Q30 10 42 25 Z" fill="#8BBCCC" />
      <circle cx="30" cy="12" r="3" fill="#FF85A1" />
      {/* Eyes & Cheeks */}
      <circle cx="25" cy="34" r="1.5" fill="#5D2E46" />
      <circle cx="35" cy="34" r="1.5" fill="#5D2E46" />
      <ellipse cx="23" cy="37" rx="2.5" ry="1.5" fill="#FF85A1" opacity="0.6" />
      <ellipse cx="37" cy="37" rx="2.5" ry="1.5" fill="#FF85A1" opacity="0.6" />
      <path d="M28 39 Q30 42 32 39" fill="none" stroke="#FF6392" strokeWidth="1.5" strokeLinecap="round" />
      {/* Outfit / Collar */}
      <path d="M20 48 Q30 58 40 48 L44 62 L16 62 Z" fill="#FF85A1" />
      <path d="M22 48 L30 53 L38 48" fill="none" stroke="#FFFFFF" strokeWidth="2" />
    </svg>
  );
};

const CuteQueenCharacter: React.FC<{ size?: 'sm' | 'md' | 'lg' }> = ({ size = 'md' }) => {
  const heightClass = size === 'sm' ? 'h-7 sm:h-8' : size === 'lg' ? 'h-16' : 'h-10 sm:h-12';
  return (
    <svg viewBox="0 0 60 70" className={`w-auto ${heightClass} max-w-full drop-shadow-2xs`}>
      {/* Lace frame */}
      <rect x="2" y="2" width="56" height="66" rx="8" fill="#FFF0F3" stroke="#FFB6C1" strokeWidth="1.5" strokeDasharray="3 2" />
      {/* Hair */}
      <path d="M15 38 C12 22, 48 22, 45 38 C45 48, 15 48, 15 38 Z" fill="#D8B4F8" />
      {/* Face */}
      <circle cx="30" cy="35" r="13" fill="#FFE5EC" stroke="#FF85A1" strokeWidth="1" />
      {/* Crown */}
      <path d="M20 23 L25 15 L30 20 L35 15 L40 23 Z" fill="#FFD1DC" stroke="#FF6392" strokeWidth="1" />
      {/* Eyes & Cheeks */}
      <circle cx="25" cy="34" r="1.5" fill="#5D2E46" />
      <circle cx="35" cy="34" r="1.5" fill="#5D2E46" />
      <ellipse cx="23" cy="37" rx="2.5" ry="1.5" fill="#FF6392" opacity="0.6" />
      <ellipse cx="37" cy="37" rx="2.5" ry="1.5" fill="#FF6392" opacity="0.6" />
      <path d="M28 39 Q30 42 32 39" fill="none" stroke="#FF6392" strokeWidth="1.5" strokeLinecap="round" />
      {/* Dress */}
      <path d="M18 48 Q30 58 42 48 L45 62 L15 62 Z" fill="#A8D1E7" />
    </svg>
  );
};

const CuteKingCharacter: React.FC<{ size?: 'sm' | 'md' | 'lg' }> = ({ size = 'md' }) => {
  const heightClass = size === 'sm' ? 'h-7 sm:h-8' : size === 'lg' ? 'h-16' : 'h-10 sm:h-12';
  return (
    <svg viewBox="0 0 60 70" className={`w-auto ${heightClass} max-w-full drop-shadow-2xs`}>
      {/* Lace frame */}
      <rect x="2" y="2" width="56" height="66" rx="8" fill="#FFF0F3" stroke="#FFB6C1" strokeWidth="1.5" strokeDasharray="3 2" />
      {/* Hair */}
      <path d="M16 35 C16 18, 44 18, 44 35 Z" fill="#FFCCD5" />
      {/* Face */}
      <circle cx="30" cy="35" r="13" fill="#FFE5EC" stroke="#FF85A1" strokeWidth="1" />
      {/* Crown Hat */}
      <path d="M18 22 Q30 12 42 22 L40 26 L20 26 Z" fill="#FF85A1" />
      <circle cx="30" cy="14" r="2.5" fill="#FFE5EC" />
      {/* Eyes & Cheeks */}
      <circle cx="25" cy="34" r="1.5" fill="#5D2E46" />
      <circle cx="35" cy="34" r="1.5" fill="#5D2E46" />
      <ellipse cx="23" cy="37" rx="2.5" ry="1.5" fill="#FF85A1" opacity="0.6" />
      <ellipse cx="37" cy="37" rx="2.5" ry="1.5" fill="#FF85A1" opacity="0.6" />
      <path d="M28 39 Q30 42 32 39" fill="none" stroke="#FF6392" strokeWidth="1.5" strokeLinecap="round" />
      {/* Royal Collar */}
      <path d="M18 48 Q30 56 42 48 L44 62 L16 62 Z" fill="#8BBCCC" />
    </svg>
  );
};

const CuteAceHeartIllustration: React.FC<{ size?: 'sm' | 'md' | 'lg' }> = ({ size = 'md' }) => {
  const heightClass = size === 'sm' ? 'h-7 sm:h-8' : size === 'lg' ? 'h-16' : 'h-10 sm:h-12';
  return (
    <svg viewBox="0 0 60 70" className={`w-auto ${heightClass} max-w-full drop-shadow-2xs`}>
      <rect x="2" y="2" width="56" height="66" rx="8" fill="#FFF0F3" stroke="#FFB6C1" strokeWidth="1.5" strokeDasharray="3 2" />
      {/* Large Central Heart */}
      <path d="M30 48 C20 38, 12 28, 20 20 C26 14, 30 20, 30 22 C30 20, 34 14, 40 20 C48 28, 40 38, 30 48 Z" fill="#FF6392" stroke="#FFFFFF" strokeWidth="1.5" />
      {/* Ribbon detail inside heart */}
      <path d="M26 30 Q30 27 34 30 Q30 33 26 30 Z" fill="#FFFFFF" opacity="0.8" />
    </svg>
  );
};

export const CardView: React.FC<CardViewProps> = ({
  card,
  isSelected = false,
  onClick,
  isScoring = false,
  cardBack = 'card_back_sakura',
  size = 'md',
  isDisabled = false,
}) => {
  const getSuitSymbol = (suit: Suit) => {
    switch (suit) {
      case 'hearts': return '♥';
      case 'diamonds': return '♦';
      case 'clubs': return '♣';
      case 'spades': return '♠';
    }
  };

  const getSuitColor = (suit: Suit) => {
    switch (suit) {
      case 'hearts': return 'text-[#FF6392]';
      case 'diamonds': return 'text-[#FF85A1]';
      case 'clubs': return 'text-[#4A5568]';
      case 'spades': return 'text-[#537188]';
    }
  };

  const sizeClasses = {
    sm: 'w-12 h-18 text-xs p-1 rounded-xl',
    md: 'w-16 h-24 sm:w-20 sm:h-28 text-sm p-1.5 rounded-2xl',
    lg: 'w-24 h-36 text-base p-2 rounded-2xl',
  };

  // If Card is Back Side Flipped (or Draw Deck Card)
  if (card.isFlipped) {
    return (
      <div
        className={`${sizeClasses[size]} bg-gingham-blue border-2 border-[#A2C4E5] rounded-2xl shadow-md flex flex-col items-center justify-center relative overflow-hidden select-none`}
      >
        <div className="absolute inset-1.5 border border-white/80 rounded-xl flex items-center justify-center bg-white/30 backdrop-blur-2xs">
          {/* Ribbon Bow Icon */}
          <span className="text-xl sm:text-2xl drop-shadow-xs">🎀</span>
        </div>
      </div>
    );
  }

  // Enhancement styles
  let enhancementBg = 'bg-[#FFFDF8]';
  let enhancementBorder = 'border-[#E8D8CD]';

  if (card.enhancement === 'glass') {
    enhancementBg = 'bg-gradient-to-br from-sky-50 via-white to-sky-100 opacity-90';
    enhancementBorder = 'border-sky-300 shadow-sky-200 shadow-md';
  } else if (card.enhancement === 'gold') {
    enhancementBg = 'bg-gradient-to-br from-amber-50 via-yellow-100 to-amber-100';
    enhancementBorder = 'border-amber-400 shadow-amber-200 shadow-md';
  } else if (card.enhancement === 'steel') {
    enhancementBg = 'bg-gradient-to-br from-slate-100 via-slate-200 to-slate-300';
    enhancementBorder = 'border-slate-400 shadow-slate-300 shadow-md';
  } else if (card.enhancement === 'bonus') {
    enhancementBg = 'bg-gradient-to-br from-blue-50 to-pink-50';
    enhancementBorder = 'border-blue-300';
  } else if (card.enhancement === 'mult') {
    enhancementBg = 'bg-gradient-to-br from-rose-50 to-pink-100';
    enhancementBorder = 'border-rose-400';
  } else if (card.enhancement === 'wild') {
    enhancementBg = 'bg-gradient-to-br from-pink-100 via-purple-100 to-sky-100';
    enhancementBorder = 'border-purple-300';
  }

  // Edition overlay
  let editionOverlay = null;
  if (card.edition === 'foil') {
    editionOverlay = <div className="absolute inset-0 bg-gradient-to-tr from-transparent via-blue-300/30 to-pink-300/30 pointer-events-none rounded-2xl" />;
  } else if (card.edition === 'holographic') {
    editionOverlay = <div className="absolute inset-0 bg-gradient-to-r from-pink-400/25 via-purple-400/25 to-indigo-400/25 pointer-events-none rounded-2xl animate-pulse" />;
  } else if (card.edition === 'polychrome') {
    editionOverlay = <div className="absolute inset-0 bg-[linear-gradient(45deg,rgba(255,182,193,0.3),rgba(255,223,0,0.3),rgba(135,206,250,0.3))] pointer-events-none rounded-2xl" />;
  }

  // Determine illustration for J, Q, K, A
  const renderFaceIllustration = () => {
    if (card.rank === 'J') return <CuteJackCharacter size={size} />;
    if (card.rank === 'Q') return <CuteQueenCharacter size={size} />;
    if (card.rank === 'K') return <CuteKingCharacter size={size} />;
    if (card.rank === 'A' && card.suit === 'hearts') return <CuteAceHeartIllustration size={size} />;
    return null;
  };

  const faceIllustration = renderFaceIllustration();

  const rankTextSize = size === 'sm' ? 'text-[10px] sm:text-xs' : size === 'lg' ? 'text-sm sm:text-base' : 'text-xs sm:text-sm';

  return (
    <motion.div
      whileHover={isDisabled ? {} : { y: isSelected ? -18 : -6, scale: 1.05 }}
      whileTap={isDisabled ? {} : { scale: 0.95 }}
      animate={{
        y: isSelected ? -18 : 0,
        scale: isScoring ? 1.15 : 1,
        boxShadow: isSelected
          ? '0 12px 24px -4px rgba(255, 133, 161, 0.5)'
          : '0 4px 12px -2px rgba(226, 208, 196, 0.4)',
      }}
      transition={{ type: 'spring', stiffness: 400, damping: 25 }}
      onClick={isDisabled ? undefined : onClick}
      className={`relative select-none cursor-pointer flex flex-col justify-between border-2 ${enhancementBorder} ${enhancementBg} ${sizeClasses[size]} ${
        isSelected ? 'ring-4 ring-[#FF85A1] border-[#FF6392]' : ''
      } ${isDisabled ? 'opacity-50 cursor-not-allowed' : ''} shadow-xs rounded-2xl overflow-hidden`}
    >
      {editionOverlay}

      {/* Top rank & suit */}
      <div className="flex items-center justify-between leading-none font-bold px-0.5 pt-0.5">
        <span className={`font-black ${rankTextSize} ${getSuitColor(card.suit)}`}>{card.rank}</span>
        <span className={`${rankTextSize} ${getSuitColor(card.suit)}`}>{getSuitSymbol(card.suit)}</span>
      </div>

      {/* Center artwork & enhancement icon */}
      <div className="flex flex-col items-center justify-center my-auto relative min-h-0 py-0.5 overflow-hidden">
        {faceIllustration ? (
          faceIllustration
        ) : (
          <span className={`font-extrabold leading-none ${size === 'sm' ? 'text-base sm:text-lg' : size === 'lg' ? 'text-4xl' : 'text-xl sm:text-2xl'} ${getSuitColor(card.suit)}`}>
            {getSuitSymbol(card.suit)}
          </span>
        )}

        {/* Enhancement Badges */}
        {card.enhancement === 'glass' && (
          <div className="absolute -bottom-0.5 bg-sky-200 text-sky-800 text-[8px] sm:text-[9px] px-1 rounded-full flex items-center gap-0.5 shadow-2xs">
            <Gem className="w-2 h-2" /> 水晶
          </div>
        )}
        {card.enhancement === 'gold' && (
          <div className="absolute -bottom-0.5 bg-amber-200 text-amber-800 text-[8px] sm:text-[9px] px-1 rounded-full flex items-center gap-0.5 shadow-2xs">
            <Coins className="w-2 h-2" /> 黄金
          </div>
        )}
        {card.enhancement === 'steel' && (
          <div className="absolute -bottom-0.5 bg-slate-300 text-slate-800 text-[8px] sm:text-[9px] px-1 rounded-full flex items-center gap-0.5 shadow-2xs">
            <Shield className="w-2 h-2" /> 钢铁
          </div>
        )}
        {card.enhancement === 'bonus' && (
          <div className="absolute -bottom-0.5 bg-blue-100 text-blue-700 text-[8px] sm:text-[9px] px-1 rounded-full flex items-center gap-0.5 shadow-2xs">
            <Plus className="w-2 h-2" /> +30
          </div>
        )}
        {card.enhancement === 'mult' && (
          <div className="absolute -bottom-0.5 bg-rose-200 text-rose-800 text-[8px] sm:text-[9px] px-1 rounded-full flex items-center gap-0.5 shadow-2xs">
            <Zap className="w-2 h-2" /> +4
          </div>
        )}
        {card.enhancement === 'wild' && (
          <div className="absolute -bottom-0.5 bg-purple-200 text-purple-800 text-[8px] sm:text-[9px] px-1 rounded-full flex items-center gap-0.5 shadow-2xs">
            <Sparkles className="w-2 h-2" /> 万能
          </div>
        )}
      </div>

      {/* Seal Badge */}
      {card.seal === 'red' && (
        <div className="absolute top-0.5 right-0.5 bg-[#FF6392] text-white w-3.5 h-3.5 rounded-full flex items-center justify-center text-[9px] font-bold shadow-xs">
          ♥
        </div>
      )}
      {card.seal === 'gold' && (
        <div className="absolute top-0.5 right-0.5 bg-amber-400 text-amber-950 w-3.5 h-3.5 rounded-full flex items-center justify-center text-[9px] font-bold shadow-xs">
          $
        </div>
      )}

      {/* Bottom rank & suit (rotated) */}
      <div className="flex items-center justify-between leading-none font-bold rotate-180 px-0.5 pb-0.5">
        <span className={`font-black ${rankTextSize} ${getSuitColor(card.suit)}`}>{card.rank}</span>
        <span className={`${rankTextSize} ${getSuitColor(card.suit)}`}>{getSuitSymbol(card.suit)}</span>
      </div>
    </motion.div>
  );
};
