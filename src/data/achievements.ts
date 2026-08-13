import { Achievement, DailyChallengeConfig, RedeemItem } from '../types';

export const INITIAL_ACHIEVEMENTS: Achievement[] = [
  {
    id: 'ach_first_game',
    title: '萌新启程',
    description: '完成第一局小丑牌游戏',
    rewardCrystals: 20,
    unlocked: false,
    icon: 'Play',
  },
  {
    id: 'ach_high_score_1k',
    title: '小试身手',
    description: '单次打出手牌得分突破 1,000 分',
    rewardCrystals: 30,
    unlocked: false,
    icon: 'Zap',
  },
  {
    id: 'ach_high_score_10k',
    title: '粉爆连击',
    description: '单次打出手牌得分突破 10,000 分',
    rewardCrystals: 50,
    unlocked: false,
    icon: 'Sparkles',
  },
  {
    id: 'ach_high_score_100k',
    title: '奇迹魔导',
    description: '单次打出手牌得分突破 100,000 分',
    rewardCrystals: 100,
    unlocked: false,
    icon: 'Crown',
  },
  {
    id: 'ach_full_jokers',
    title: '满腹小丑',
    description: '同时拥有 5 张小丑牌',
    rewardCrystals: 40,
    unlocked: false,
    icon: 'HeartHandshake',
  },
  {
    id: 'ach_rich',
    title: '小富即安',
    description: '在一局游戏中持有资金超过 $50',
    rewardCrystals: 40,
    unlocked: false,
    icon: 'Coins',
  },
  {
    id: 'ach_tarot_master',
    title: '魔法大师',
    description: '累计使用 10 张魔法塔罗牌',
    rewardCrystals: 50,
    unlocked: false,
    progress: 0,
    maxProgress: 10,
    icon: 'Wand2',
  },
  {
    id: 'ach_planet_master',
    title: '星空学者',
    description: '累计使用 10 张萌星牌升级手牌',
    rewardCrystals: 50,
    unlocked: false,
    progress: 0,
    maxProgress: 10,
    icon: 'Orbit',
  },
  {
    id: 'ach_daily_completer',
    title: '每日达人',
    description: '完成 1 次每日挑战模式',
    rewardCrystals: 60,
    unlocked: false,
    icon: 'Calendar',
  },
  {
    id: 'ach_win_run',
    title: '粉红霸主',
    description: '通关 Ante 8 获得整场胜利！',
    rewardCrystals: 150,
    unlocked: false,
    icon: 'Trophy',
  },
];

export const INITIAL_REDEEM_ITEMS: RedeemItem[] = [
  // Card Backs
  {
    id: 'card_back_sakura',
    type: 'card_back',
    name: '樱花粉花瓣',
    description: '粉嫩娇艳的樱花花瓣图案牌背',
    price: 30,
    icon: 'Flower2',
    unlocked: true, // Default
    previewColor: 'bg-pink-300',
  },
  {
    id: 'card_back_paw',
    type: 'card_back',
    name: '萌猫肉垫',
    description: '萌系粉色猫爪触感卡牌背面',
    price: 50,
    icon: 'Footprints',
    unlocked: false,
    previewColor: 'bg-rose-400',
  },
  {
    id: 'card_back_cake',
    type: 'card_back',
    name: '草莓蛋糕',
    description: '甜美诱人的草莓奶油蛋糕风格',
    price: 80,
    icon: 'Cake',
    unlocked: false,
    previewColor: 'bg-pink-500',
  },
  {
    id: 'card_back_starry',
    type: 'card_back',
    name: '粉蓝星空',
    description: '梦幻柔美的梦境星空交织',
    price: 100,
    icon: 'Sparkles',
    unlocked: false,
    previewColor: 'bg-purple-400',
  },

  // Decks Skins / Presets
  {
    id: 'deck_default',
    type: 'deck_skin',
    name: '标准粉萌牌组',
    description: '标准 52 张初始扑克牌组',
    price: 0,
    icon: 'Layers',
    unlocked: true,
  },
  {
    id: 'deck_strawberry',
    type: 'deck_skin',
    name: '草莓红桃卡组',
    description: '初始包含更多【红桃】与 2 张加分牌',
    price: 60,
    icon: 'Heart',
    unlocked: false,
  },
  {
    id: 'deck_wealth',
    type: 'deck_skin',
    name: '富豪金币卡组',
    description: '初始开局携带 $20 资金与 1 张黄金牌',
    price: 80,
    icon: 'Coins',
    unlocked: false,
  },
];

export function getDailyChallengeConfig(date: Date = new Date()): DailyChallengeConfig {
  const dateStr = date.toISOString().split('T')[0];
  
  // Seeded variation based on date
  const dayNum = date.getDate() + date.getMonth() * 31;
  const seeds = [
    {
      seedName: '甜心狂欢日',
      description: '全场红桃♥卡牌基础筹码额外 +20，且开局自带草莓猫咪小丑！',
      modifiers: ['红桃♥ 牌 +20 筹码', '开局包含【草莓猫咪】小丑', '初始现金 $15'],
      extraStartingMoney: 15,
      extraHands: 0,
      extraDiscards: 1,
    },
    {
      seedName: '魔法大魔王',
      description: '塔罗包价格减半，开局获得 2 张随机极品塔罗牌！',
      modifiers: ['塔罗牌包半价', '开局赠送 2 张塔罗牌', '弃牌次数 +1'],
      extraStartingMoney: 12,
      extraHands: 1,
      extraDiscards: 1,
    },
    {
      seedName: '金币大亨',
      description: '初始即获得 $30 零花钱，但小丑牌刷新价格更高！',
      modifiers: ['初始资金 $30', '每局利息上限提升至 $8', '手牌上限 +1'],
      extraStartingMoney: 30,
      extraHands: 0,
      extraDiscards: 0,
    },
    {
      seedName: '顺子同花之夜',
      description: '【顺子】与【同花】基础倍率 ×2！',
      modifiers: ['顺子/同花倍率翻倍', '初始额外弃牌次数 +2', '手牌上限 9 张'],
      extraStartingMoney: 10,
      extraHands: 1,
      extraDiscards: 2,
    },
  ];

  const config = seeds[dayNum % seeds.length];
  return {
    dateStr,
    ...config,
  };
}
