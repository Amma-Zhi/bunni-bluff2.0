# Bunni Bluff 2.0｜玩法、逻辑界面与小丑牌系统重构审计 v1

> 审计对象：`Amma-Zhi/bunni-bluff2.0` 当前 `main` 分支  
> 审计目标：不改变「粉色萌宠 / 甜品 / 少女感」的原创视觉主题，重新建立接近《Balatro》核心乐趣的 **Run 循环、计分深度、小丑牌策略与信息反馈**。  
> 本文是“重构设计规格”，不是要求把 Bunni Bluff 做成 Balatro 的换皮。建议保留你的美术身份，但借鉴其成熟的底层游戏设计。

---

# 0. 结论先说

当前 Bunni Bluff 的最大问题并不是 UI 不够漂亮，也不是小丑牌数量不够，而是：

**规则层、计分层、动画层、UI 层现在没有真正分离。**

因此三个表面问题同时出现：

1. **游戏规则缺乏长期策略感**  
   一局里买牌、强化牌、改牌组，但进入下一 Blind 时牌组会被重新生成，牌组构筑不能贯穿 Run。

2. **游戏逻辑界面缺乏决策中心**  
   战斗界面同时存在首页、商店、刷新、设置、连击等大量入口，却没有把最重要的「Blind → 手牌 → 牌型 → Chips × Mult → Joker 顺序」建立成唯一视觉主线。

3. **小丑牌看起来有技能，实际上多数技能不是一个稳定的规则系统**  
   `JokerData` 只有 `effectType`，真正技能依靠 `HandScoringOverlay.tsx` 中大量 `if (joker.id === ...)` 硬编码。描述与实际效果已经出现多处不一致。

我建议不要继续往当前结构上“加更多小丑牌”。

应该先做一次 **核心玩法重构**。

---

# 1. 当前项目值得保留的部分

先明确：目前不是全部推翻。

以下内容可以继续保留：

- 粉色 / 蓝色 / 奶油白视觉系统。
- 萌宠与甜品主题的小丑牌命名。
- React + TypeScript 当前技术路线。
- `CardView`、`JokerCard`、商店卡片等视觉组件。
- 8 张手牌、最多选择 5 张出牌。
- 默认 4 次出牌、3 次弃牌、初始 $4 的基础结构。
- Chips × Mult 的核心公式。
- Planet 升级牌型。
- Tarot / 魔法牌修改扑克卡牌。
- Small / Big / Boss 三段 Blind 概念。
- 5 个 Joker 槽位、2 个 Consumable 槽位。
- 当前已有的音效、计分动画资产。
- 当前 Cute / Cozy 的原创包装。

真正需要重做的是这些东西后面的**规则执行方式**。

---

# 2. 当前游戏规则的核心问题

## 2.1 最大问题：每一关都重新生成标准 52 张牌

当前：

`src/App.tsx → handleNextRoundFromShop()`

进入下一关时再次执行：

```ts
const fullDeck = createStandardDeck();
```

然后重新从这副新牌发手牌。

这会产生一个非常严重的后果：

玩家通过 Tarot / Standard Pack 做出的：

- 改花色
- Bonus
- Mult Card
- Glass
- Steel
- Gold
- Lucky
- 复制牌
- 删牌
- 新增牌

都无法形成真正的长期牌组构筑。

这直接破坏了 Balatro 类游戏最重要的东西：

> “我这一局正在把一副普通扑克逐渐改造成属于我自己的怪物牌组。”

### 建议

游戏状态中必须新增：

```ts
runDeck
```

它代表这一整次 Run 的**永久牌组**。

每个 Blind 开始时：

```text
runDeck
↓
shuffle
↓
drawPile
↓
hand / discardPile
```

Blind 结束时：

```text
hand
discardPile
drawPile
↓
全部回归 runDeck
↓
保留所有强化 / 花色 / Edition / Seal / 新增 / 删除结果
```

下一 Blind 只是重新洗牌。

**绝对不能重新创建标准 52 张牌。**

---

# 3. Blind / Ante 规则目前失衡

当前 `pokerLogic.ts` 的目标分数为：

```text
Ante 1:
300
500
1500

Ante 2:
2500
4000
6000

...

Ante 8:
2,400,000
3,500,000
5,000,000
```

这和原版 Balatro 的成长曲线完全不是一个量级。

原版白注基础 Ante 大致为：

| Ante | Base |
|---|---:|
| 1 | 300 |
| 2 | 800 |
| 3 | 2,000 |
| 4 | 5,000 |
| 5 | 11,000 |
| 6 | 20,000 |
| 7 | 35,000 |
| 8 | 50,000 |

通常：

```text
Small Blind ≈ Base × 1
Big Blind   ≈ Base × 1.5
Boss Blind  ≈ Base × 2
```

因此比较适合 Bunni Bluff 第一版平衡测试的目标可以先采用：

| Ante | Small | Big | 普通 Boss |
|---|---:|---:|---:|
| 1 | 300 | 450 | 600 |
| 2 | 800 | 1,200 | 1,600 |
| 3 | 2,000 | 3,000 | 4,000 |
| 4 | 5,000 | 7,500 | 10,000 |
| 5 | 11,000 | 16,500 | 22,000 |
| 6 | 20,000 | 30,000 | 40,000 |
| 7 | 35,000 | 52,500 | 70,000 |
| 8 | 50,000 | 75,000 | 100,000 |

特殊 Boss 再单独改变倍率。

### 为什么当前高目标不好

现在为了让玩家打得过极高目标，你的小丑牌被迫设计成：

```text
+40 Chips
+15 Mult
X2.2
X2.5
```

而且很早就能拿到。

结果是：

> Blind 数值过高  
> → Joker 被迫过强  
> → 普通扑克和牌型升级失去价值  
> → 玩家只看哪个 Joker 数值大  
> → 构筑深度反而下降

正确做法应该是：

**先把 Blind 曲线恢复合理，再重新平衡 Joker。**

---

# 4. 缺少 Blind 选择层

原版 Balatro 每个 Ante 的结构不是：

```text
自动进入 Small
↓
自动 Big
↓
自动 Boss
```

而是先展示：

```text
Small Blind
Big Blind
Boss Blind
```

Small / Big 可以选择 Skip，并用放弃：

- 本关得分机会
- 本关经济奖励
- 本关商店
- 本关成长机会

来换取一个 Tag。

这是一层非常重要的 Roguelike 决策。

### 推荐 Bunni Bluff 新流程

```text
Ante 1
│
├─ Small Blind
│   ├─ 挑战
│   └─ 跳过 → 获得奖励标签
│
├─ Big Blind
│   ├─ 挑战
│   └─ 跳过 → 获得奖励标签
│
└─ Boss Blind
    └─ 必须挑战
```

如果暂时不想做完整 Tag 系统，也建议至少先做：

```text
Skip Small
→ 下一商店第一次刷新免费

Skip Big
→ 下一商店出现 1 张罕见以上 Joker
```

这样就已经会出现策略决策。

---

# 5. 商店现在出现在了错误的时间

当前 `BattleScreen` 中直接提供：

```text
商店
刷新
```

`App.tsx` 也允许从：

```text
战斗中
首页
```

随时打开 Run 商店。

这破坏了 Blind 的资源压力。

正确核心循环应该是：

```text
选择 Blind
↓
战斗
↓
达到目标
↓
Cash Out / 领取奖励
↓
商店
↓
下一 Blind
```

### 建议

战斗过程中彻底移除：

```text
商店
刷新商品
```

首页的商店如果需要保留，只能是：

```text
Meta 商店
```

使用独立的：

```text
水晶 / 外观货币
```

不能直接和当前 Run 的金币、小丑牌、塔罗牌共用。

---

# 6. 商店供给过多，稀缺性不足

当前 `populateShop()`：

- 固定 2 张 Joker
- 固定 2 张 Consumable
- 所有 Booster Pack
- 所有 Voucher

玩家一次商店能看到大量确定选项。

这会弱化 Roguelike 的“有限资源下做取舍”。

### 推荐

普通商店：

```text
商品槽 ×2
随机：
Joker / Tarot / Planet

Booster Pack ×2
随机类型

Voucher ×1
每 Ante 一张
```

Reroll：

```text
基础 $5
```

Voucher 再改变价格。

---

# 7. Voucher 目前基本只有文字，没有真正进入规则

目前购买 Voucher 时主要执行：

```ts
setVouchers(prev => [...prev, v.id])
```

但对应能力没有真正作用于系统。

例如：

### 萌宠背包

描述：

```text
手牌上限永久 +1
```

但没有真正修改后续 Round 的 hand size。

---

### 甜品贵宾卡

描述：

```text
商店 75 折
```

但商品价格没有根据 Voucher 修改。

---

### 幸运转盘

描述：

```text
刷新费用降低 $1
```

但是 `ShopModal` 里仍然固定：

```ts
const rerollCost = 5;
```

---

### 粉红粉扑

描述：

```text
每局弃牌次数永久 +1
```

但下一关依旧：

```ts
setDiscardsLeft(3);
```

### 建议

Voucher 不应该只保存 ID。

必须统一进入：

```ts
RuleModifiers
```

例如：

```ts
{
  handSizeBonus: 1,
  discardBonus: 1,
  shopDiscount: 0.75,
  rerollDiscount: 1
}
```

所有相关系统只读取这一个 Rules Context。

---

# 8. Boss Blind 中大量效果实际上没有实现

当前 `BOSS_RULES` 中存在：

```text
黑桃失去筹码与效果
红桃失去筹码与效果
只能弃牌 1 次
人头牌翻面
基础倍率 -2
```

但是当前 `BossRule` 类型只能较明确表达：

```ts
bannedHandTypes
disabledJokerIndices
disableDiscards
```

所以很多 Boss 目前只是：

**显示了描述，但底层没有效果。**

### BossRule 应改为

```ts
interface BossRule {
  id: string;
  name: string;
  description: string;

  debuffSuits?: Suit[];
  debuffRanks?: Rank[];
  debuffFaceCards?: boolean;

  handLimit?: number;
  discardLimit?: number;

  baseChipsFactor?: number;
  baseMultFactor?: number;

  bannedHandTypes?: HandType[];

  disabledJokerRule?: {
    mode: 'index' | 'random_each_hand';
    count: number;
  };

  drawFaceDownRule?: ...;
}
```

这样 Boss 才是真正的规则修改器。

---

# 9. 当前牌型 / Round UI 有明显逻辑错位

当前：

```tsx
<BattleScreen
  round={round}
  maxRound={8}
/>
```

但实际上：

```text
1 Ante = 3 个 Blind
8 Ante = 24 个 Blind
```

`round` 会继续增长到 24。

因此 UI 的：

```text
Round 9 / 8
```

这种状态理论上就可能出现。

### 建议彻底删除 “Round / 8” 作为主进度

改为：

```text
Ante 3 / 8
```

旁边显示：

```text
Small ✓
Big ●
Boss ○
```

玩家会立刻知道自己在哪。

---

# 10. 手牌预览现在给了一个误导数字

当前 BattleScreen 选牌以后显示：

```ts
evaluatedHand.baseChips * evaluatedHand.baseMult
```

类似：

```text
对子 +20
```

这个数字：

- 没有加入计分牌自身 Chips
- 没有强化
- 没有 Edition
- 没有 Joker
- 没有 Held 效果

因此不是实际预计得分。

另外界面读取了：

```ts
evaluatedHand?.mult
```

但 `HandEvaluation` 实际定义的是：

```ts
baseMult
```

所以这个显示逻辑本身也不可靠。

### 推荐界面显示

不要写：

```text
对子 +20
```

而是：

```text
对子 Lv.1

10 Chips × 2 Mult
```

下面小字：

```text
+ 计分牌筹码
+ Joker / 强化效果将在出牌后按顺序触发
```

如果以后做 deterministic preview，再额外显示：

```text
预计最低得分
```

随机 Joker 则显示 `?`。

---

# 11. 当前真正的计分引擎藏在动画组件里

目前核心计分发生在：

```text
src/components/HandScoringOverlay.tsx
```

这个文件同时负责：

- Chips
- Mult
- Joker 判断
- Boss 判断
- 动画
- 音效
- 延时
- floating text
- 最终分数

这是目前架构最需要改变的地方。

### 正确关系

应该是：

```text
Game Logic
↓
ScoreResult / ScoreLog
↓
HandScoringOverlay
↓
只播放动画
```

而不是：

```text
HandScoringOverlay
↓
边播动画边决定游戏到底得多少分
```

---

# 12. 推荐新的计分生命周期

一手牌：

```text
HAND_PLAYED
↓
Boss pre-check
↓
识别牌型
↓
取得 Base Chips / Base Mult
↓
ON_PLAYED Joker
↓
逐张 Scoring Card
↓
Card Base Chips
↓
Enhancement
↓
Seal
↓
Edition
↓
ON_SCORED Joker
↓
Retrigger
↓
Held Cards
↓
ON_HELD
↓
Independent Jokers（左 → 右）
↓
Joker Edition
↓
Final Chips × Mult
↓
HAND_END
```

动画只是读取上述事件。

---

# 13. Joker 当前数据结构太弱

当前：

```ts
interface JokerData {
  ...
  effectType:
    | 'chips'
    | 'mult'
    | 'xmult'
    | 'utility'
    | 'money';
}
```

这个结构只能告诉系统：

> “它大概是什么类型的小丑。”

它无法表达：

- 什么时候触发
- 对哪张牌触发
- 满足什么条件
- 是否成长
- 是否重触发
- 是否按顺序执行
- 是否修改金钱
- 是否修改规则
- 是否在出售时触发

所以实际能力全部被迫写成：

```ts
if (joker.id === 'joker_bear') ...
else if (joker.id === 'joker_kitty') ...
else if ...
```

### 推荐

```ts
Joker =
Trigger
+ Condition
+ Effect
+ State
```

例如：

```ts
{
  id: 'joker_kitty',

  triggers: [
    {
      when: 'CARD_SCORED',
      conditions: [
        { type: 'SUIT_IS', value: 'hearts' }
      ],
      effects: [
        { type: 'ADD_MULT', value: 3 }
      ]
    }
  ]
}
```

这样未来增加第 50 张 Joker 时，不需要修改 ScoreEngine。

---

# 14. Joker 顺序目前没有形成真正玩法

当前 Joker 会按照数组顺序结算。

但是玩家没有一个明确的“拖动 Joker 重排”机制。

这是非常大的策略损失。

因为：

```text
Base Mult = 4

+4 Mult
X2 Mult
```

顺序：

```text
(4 + 4) × 2
= 16
```

反过来：

```text
4 × 2 + 4
= 12
```

### 建议

Joker 区必须支持：

```text
长按 / 拖动
↓
重新排序
```

并且位置真正写回：

```ts
jokers[]
```

计分严格按：

```text
左 → 右
```

执行。

---

# 15. Scoring Card 与 Played Card 必须进一步区分

你当前已经做了一部分：

```ts
handEval.scoringCards
```

这是好的。

但是 Joker 实际效果里又经常直接使用：

```ts
playedCards.filter(...)
```

例如草莓猫咪：

```text
所有打出的红桃都计数
```

而不是：

```text
真正参与计分的红桃
```

这会导致规则语义不一致。

以后必须明确：

```text
PLAYED
```

和：

```text
SCORED
```

是两个不同事件。

---

# 16. Enhancement / Edition / Seal 当前大量是假功能

目前实际计分处理中：

## 已实现

- 普通卡牌 Chips
- Bonus +30 Chips
- Mult +4 Mult
- Foil +50 Chips
- Holographic +10 Mult
- Wild 对 Flush 判断

## 未完整实现 / 未实现

### Glass

描述：

```text
X2 Mult
可能破损
```

当前实际：

```text
25% 可能破损
```

但没有把：

```text
X2
```

加入计分。

结果是当前 Glass 可能变成：

**只有负面效果。**

---

### Steel

描述：

```text
留在手中 X1.5 Mult
```

当前没有 Held Card 结算阶段。

---

### Gold

描述：

```text
留在手中 +$3
```

当前没有该结算。

---

### Lucky

描述：

```text
概率增加大量 Mult / Money
```

当前没有对应逻辑。

---

### Polychrome

类型已经存在：

```ts
'polychrome'
```

但计分没有：

```text
X1.5 Mult
```

---

### Red Seal

类型已经存在，但没有 Retrigger。

---

### Gold Seal

类型已经存在，但没有钱奖励。

---

# 17. 最值得优先补齐的牌效果

建议先不要再新增强化类型。

先完整实现：

```text
Bonus
Mult
Wild
Glass
Steel
Gold
Lucky

Foil
Holographic
Polychrome

Red Seal
Gold Seal
```

把已有名词变成真正稳定的规则，再扩展内容。

---

# 18. 当前 21 张 Joker 的重构建议

以下不是要求照抄原版，而是保留当前角色名称后，重新赋予它们明确的战略角色。

---

## 18.1 粉熊小丑

当前：

```text
+40 Chips
```

建议：

```text
Independent
每手结算 +40 Chips
```

定位：

```text
早期稳定 Chips
```

保留即可。

---

## 18.2 草莓猫咪

当前描述：

```text
每打出一张红桃 +5 Mult
```

当前实现：

```text
playedCards 中红桃数量 ×5
```

建议：

```text
CARD_SCORED
每张真正计分的红桃 +3 Mult
```

关键改变：

**逐张触发。**

这样它才可以和：

- Red Seal
- Retrigger
- Glass
- Card Edition

产生组合。

---

## 18.3 甜甜圈大师

当前：

```text
两对 / 葫芦 → X1.5
```

建议保留主题，规则改成明确的：

```text
如果本手 Contains Two Pair：
X1.5 Mult
```

或者更简单：

```text
如果 Hand Is Two Pair / Full House：
X1.5
```

不要同时混用模糊语义。

---

## 18.4 魔法兔兔

描述：

```text
每次弃牌 +$1
弃牌上限 +1
```

当前实际：

```text
每手固定 +20 Chips
```

属于严重不一致。

建议：

```text
PASSIVE:
每 Round 弃牌次数 +1

ON_DISCARD:
本 Round 第一次弃牌时 +$1
```

删除任何 Chips 效果。

---

## 18.5 星星小魔棒

描述：

```text
Hand Size +1
每回合第一次出牌 +10 Mult
```

当前实际：

```text
每手都 +10 Mult
```

建议按描述真正实现。

需要状态：

```ts
firstHandTriggered: boolean
```

---

## 18.6 金币猪猪

当前：

```text
每 $5 → +3 Mult
上限 +30
```

推荐：

```text
每 $5 → +2 Mult
```

可以先取消上限。

它的核心定位应该是：

```text
存钱
→ 战斗能力变强
→ 玩家纠结“买牌还是留钱”
```

这是很好的经济构筑 Joker。

---

## 18.7 摇摇木马

当前：

```text
High Card / Pair
+25 Chips
+4 Mult
```

建议保留。

它非常适合作为：

```text
低牌型构筑
```

的 Common Joker。

---

## 18.8 樱花狐仙

当前：

```text
Flush
+60 Chips
+6 Mult
```

建议：

```text
HAND_CONTAINS Flush
```

这样：

```text
Flush
Straight Flush
Flush House
Flush Five
```

都能进入同一花色构筑体系。

---

## 18.9 冰淇淋球

描述：

```text
初始 +100 Chips
每出一次牌 -10
```

当前实际：

```text
永远 +100 Chips
```

没有融化。

建议实现真正的 State：

```ts
chips = 100
```

每次 `HAND_PLAYED`：

```text
chips -= 5
```

建议第一版用 -5，比 -10 更容易平衡。

---

## 18.10 奶油泡芙

当前：

```text
每张 J/Q/K +6 Mult
```

建议：

```text
CARD_SCORED
每张 Face Card +4 Mult
```

必须逐张触发。

---

## 18.11 云朵绵羊

描述：

```text
每保留 1 张未打出的牌
+12 Chips
```

当前实际：

```text
固定 +36 Chips
```

建议：

```text
HAND_SCORING
heldCards.length × 10 Chips
```

这会产生：

```text
少出牌
↓
保留更多牌
↓
获得更多 Chips
```

的选择。

---

## 18.12 水晶猫爪

描述：

```text
Glass 不破损
Glass X2.5
```

当前：

只要 Played Cards 中有一张 Glass：

```text
整手 X2.5
```

但 Glass 仍然会在 App 层破碎。

建议改成真正的 Glass 修改器：

```text
所有 Glass：
X2 → X2.5

并将：
breakChance = 0
```

它不是独立 XMult Joker。

它应该直接修改 Glass Card 的规则。

---

## 18.13 独角兽角

当前：

```text
Straight / Straight Flush
X2
```

建议：

```text
如果 Hand Contains Straight
X2
```

这是很好的高难牌型奖励 Joker。

---

## 18.14 珍珠贝壳

当前：

```text
discardsLeft === 0
→ X1.8
```

建议保留。

这会产生很自然的风险选择：

```text
主动用光弃牌
→ 换强力 XMult
```

---

## 18.15 萌心礼盒

描述：

```text
出售时获得 2 张免费 Tarot
```

当前计分时却：

```text
+25 Chips
```

而真正出售只是获得半价金币。

建议完全删除计分能力。

改为：

```text
ON_SELL
→ 创建 2 张 Tarot
```

如果 Consumable 槽位不足：

```text
打开一个免费 Mini Tarot Pack
从 3 张中选 1
```

这样更安全。

---

## 18.16 提拉米苏

当前：

```text
未使用弃牌 ×20 Chips
```

建议保留。

它和珍珠贝壳正好形成相反构筑：

```text
珍珠：
用光弃牌

提拉米苏：
保留弃牌
```

这很好。

---

## 18.17 布丁国王

描述：

```text
有 K：
+15 Mult
+$2
```

当前只实现：

```text
+15 Mult
```

建议改为：

```text
本手第一次 K 被计分：
+10 Mult

如果本手至少有 1 张 K 计分：
HAND_END +$1
```

避免钱增长过快。

---

## 18.18 粉红丝带

当前：

```text
Three / Four
X1.75
```

建议：

```text
HAND_CONTAINS Three of a Kind
→ X1.75
```

这样 Full House、Four、Five 也可以形成纵向构筑。

---

## 18.19 双子星

描述：

```text
对子牌交替：
+30 Chips
+5 Mult
```

当前实际：

```text
只要 handType 字符串里有“对”
一次性：
+30 Chips
+5 Mult
```

建议真正逐张触发：

```text
每手开始 triggerIndex = 0

PAIR_SCORING_CARD:
第 1 / 3 / 5 次
→ +30 Chips

第 2 / 4 次
→ +5 Mult
```

这是非常适合 Bunni Bluff 的原创 Joker。

建议重点保留。

---

## 18.20 彩虹洒花

当前：

```text
所有 Played Cards 都 Scored
```

这是一个非常好的 Rule Modifier。

建议保留。

但必须在：

```text
ScoringCards Resolver
```

阶段生效，而不是 Overlay 临时判断。

---

## 18.21 粉甜天使

当前：

```text
无条件 X2.2
```

作为 Legendary 太普通。

传说牌最好：

> 改变一整套构筑方式，而不是单纯给一个大数字。

建议：

```text
所有红桃 / 方块 Scoring Card
Retrigger 1 次
```

这样会和：

- 草莓猫咪
- Face Card
- Glass
- Bonus
- Mult Card
- Edition
- Seal

产生大量组合。

它会真正有“传说牌”的感觉。

---

# 19. Joker 必须分成战略类型

不要只做：

```text
数值大
数值更大
X倍率更大
```

推荐至少建立 8 个类型：

```text
1. Flat Chips
2. +Mult
3. XMult
4. Economy
5. Scaling
6. On Scored
7. Retrigger
8. Rule Modifier
```

一套好玩的 Run 应该是：

```text
一个 Chips 来源
+
一个稳定 +Mult 来源
+
一个 XMult 来源
+
一个牌型 / 花色 / 点数引擎
+
一个经济 / Utility
```

然后让玩家逐步替换。

---

# 20. UI 重构目标

当前 BattleScreen 最大的问题不是“不好看”。

而是：

**视觉权重与游戏决策权重不一致。**

现在战斗界面同时突出：

- 分数
- Round
- Ante
- Money
- Shop
- Refresh
- Home
- Settings
- Help
- Streak
- Joker
- Consumable
- 牌组
- 手牌
- 选牌
- Play
- Discard

所有东西都在抢注意力。

---

# 21. 推荐新的战斗界面信息层级

## 第一优先级：Blind

顶部只显示：

```text
Ante 2 / 8

Small ✓
Big ●
Boss ○

目标：1,200
```

---

## 第二优先级：Joker Engine

顶部中央：

```text
[Joker] [Joker] [Joker] [空] [空]
```

特点：

- 可以拖动
- 清晰看到顺序
- 当前触发时弹起
- +Chips / +Mult / XMult 用不同角标

例如：

```text
+40
+M
XM
$
↻
```

---

## 第三优先级：Chips × Mult

屏幕核心位置始终存在：

```text
PAIR Lv.2

42 Chips
×
8 Mult
```

而不是只显示一个：

```text
+336
```

玩家必须能理解自己的分数为什么变化。

---

## 第四优先级：Cards

中间：

```text
本次准备打出的牌
```

底部：

```text
当前手牌
```

选中后：

- Scoring Card：正常亮度 / 发光
- Played but Not Scored：变淡
- Boss Debuffed：红叉
- Face Down：背面

玩家在按“出牌”之前就应该大概理解：

**哪些牌真正会算分。**

---

## 第五优先级：Actions

战斗中只保留两个大按钮：

```text
弃牌 3
出牌 4
```

另外一个小按钮：

```text
牌组 47
```

不要在这里出现：

```text
商店
刷新
```

---

# 22. 推荐战斗界面草图

```text
┌──────────────────────────────────────────────┐
│ Ante 2/8     Small ✓   BIG ●   Boss ○       │
│                  目标 1,200                  │
├──────────────────────────────────────────────┤
│                                              │
│   [熊] [猫] [猪] [独角兽] [空]              │
│          ← 可拖动调整结算顺序 →              │
│                                              │
│                 PAIR Lv.1                    │
│                                              │
│              42 Chips × 8 Mult               │
│                                              │
│        [10♥] [10♠] [7♣]                     │
│                                              │
│──────────────────────────────────────────────│
│ [A♥][K♠][10♥][10♠][7♣][5♦][3♥][2♣]   🎴44 │
│                                              │
│       [弃牌 3]                 [出牌 4]       │
│                                              │
│   当前分数 540 / 1,200              $12      │
└──────────────────────────────────────────────┘
```

这比三列“仪表盘”更接近一个真正的卡牌游戏桌面。

---

# 23. Scoring Animation 应成为规则教学

现在已有逐张动画，这是好基础。

但以后必须从：

```text
ScoreLog
```

驱动。

例如：

```text
PAIR Lv.1
10 ×2

10♥
+10 Chips

草莓猫咪
+3 Mult

10♠
+10 Chips

钢铁牌（手中 K）
X1.5

粉熊
+40 Chips

独角兽
X2

Final
70 ×15
= 1,050
```

玩家看 3 局以后，就能自然理解规则。

---

# 24. 应新增 ScoreLog

每次效果生成一条：

```ts
{
  source: 'joker_kitty',
  trigger: 'CARD_SCORED',
  effect: 'ADD_MULT',

  before: {
    chips: 30,
    mult: 2
  },

  value: 3,

  after: {
    chips: 30,
    mult: 5
  }
}
```

UI 只播放：

```text
before → after
```

这样：

- 动画速度可以变
- 可以跳过动画
- 可以做 2x 动画
- 可以回看
- 可以 Debug
- 不会改变最终分数

---

# 25. 推荐的新目录结构

建议逐步从当前 `App.tsx + HandScoringOverlay` 拆出：

```text
src/
├─ game/
│  ├─ state/
│  │  ├─ runState.ts
│  │  └─ roundState.ts
│  │
│  ├─ deck/
│  │  ├─ createDeck.ts
│  │  ├─ deckZones.ts
│  │  └─ deckModifiers.ts
│  │
│  ├─ hands/
│  │  ├─ evaluateHand.ts
│  │  └─ handLevels.ts
│  │
│  ├─ scoring/
│  │  ├─ scoreHand.ts
│  │  ├─ events.ts
│  │  ├─ triggerResolver.ts
│  │  ├─ conditionResolver.ts
│  │  ├─ effectResolver.ts
│  │  └─ scoreLog.ts
│  │
│  ├─ jokers/
│  │  ├─ jokerDefinitions.ts
│  │  └─ jokerState.ts
│  │
│  ├─ blinds/
│  │  ├─ blindTable.ts
│  │  └─ bossRules.ts
│  │
│  └─ shop/
│     └─ shopGenerator.ts
│
├─ components/
│  ├─ BattleScreen.tsx
│  ├─ HandScoringOverlay.tsx
│  ├─ JokerCard.tsx
│  └─ ...
│
└─ App.tsx
```

目标：

```text
App.tsx
```

只负责：

```text
页面流程 + 组合状态
```

不要继续承担整个游戏。

---

# 26. RunState 与 RoundState 必须分离

## RunState

贯穿整局：

```text
Ante
Money
runDeck
Jokers
Consumables
Vouchers
Hand Levels
Persistent Joker State
```

---

## RoundState

每个 Blind 重置：

```text
drawPile
hand
discardPile
score
handsLeft
discardsLeft
activeBossRule
firstHandPlayed
```

这一个结构可以解决当前大量状态混乱。

---

# 27. 卡牌必须只有一个“实体”

当前牌修改存在一个潜在问题：

某些操作同时把同一个 Card Object 放入：

```text
handCards
deck
```

这种 Zone 设计很容易产生：

```text
同一张牌同时存在两个地方
```

建议：

```text
runDeck
```

保存所有 Card Entity。

Round 中只保存：

```text
cardId[]
```

例如：

```ts
handIds
drawPileIds
discardIds
```

一张牌在同一时刻只属于一个 Zone。

---

# 28. Help 页面应该从“说明书”变成“规则词典”

现在 Help 只有：

1. 计分公式
2. Joker / Tarot / Planet
3. Blind / 商店

远远不够支持后面的复杂构筑。

建议加入可点击词条：

```text
Chips
+Mult
XMult
Scoring Card
Played Card
Held in Hand
Contains
Is
Retrigger
Edition
Enhancement
Seal
Blind
Ante
Interest
```

Joker 详情中的关键词也可以点击打开解释。

这样玩家不需要一次读完长说明。

---

# 29. Meta 系统建议暂时降级

当前项目已经有：

- 成就
- 水晶
- 每日挑战
- 兑换商店
- 卡背
- Deck Skin
- 首页
- 连击

这些都可以保留代码。

但在核心玩法重构完成以前，不建议继续扩大。

因为现在最重要的问题不是：

```text
玩完以后奖励什么？
```

而是：

```text
这一局本身是否已经足够好玩？
```

优先把一个标准 Run 做到：

```text
Ante 1 → Ante 8
```

有明确构筑成长。

之后再把 Meta 系统接回来。

---

# 30. 推荐重构优先级

## P0｜必须先修

### 1

建立持久 `runDeck`。

下一 Blind 不再重新生成 52 张牌。

### 2

把 Blind 分数曲线恢复合理范围。

### 3

战斗过程中禁止打开 Run 商店。

### 4

实现 Ante / Small / Big / Boss 正确进度。

### 5

把 Scoring Logic 从 `HandScoringOverlay` 中抽离。

### 6

修复已有 Enhancement / Edition / Seal。

### 7

修复 Joker 描述与实际行为不一致。

---

## P1｜形成真正 Balatro 式策略

### 8

Joker 可拖动重排。

### 9

建立 Trigger / Condition / Effect / State。

### 10

加入：

```text
ON_PLAYED
ON_SCORED
ON_HELD
INDEPENDENT
ON_DISCARD
ON_SELL
```

### 11

加入 Retrigger。

### 12

加入 Contains / Is 两套牌型判断。

### 13

Voucher 全部真正生效。

### 14

Boss Rules 全部真正生效。

---

## P2｜优化体验

### 15

Blind 选择页 + Skip Tags。

### 16

商店重新随机化。

### 17

ScoreLog 驱动动画。

### 18

战斗 UI 减法重构。

### 19

规则词典。

---

## P3｜扩内容

最后才做：

```text
新增 Joker
新增 Tarot
新增 Boss
新增 Voucher
新增 Deck
每日挑战
成就
皮肤
```

---

# 31. 我建议 Bunni Bluff 最终保留自己的区别

不建议 1:1 做成 Balatro。

Bunni Bluff 可以保留三个明显不同点。

## A. 萌宠 / 甜品角色化 Joker

Balatro 的 Joker 更偏图像符号。

Bunni Bluff 可以让每张 Joker 都像一个：

```text
小角色
```

并拥有：

- 表情
- Trigger 动画
- 成长动画
- 破坏动画
- 出售动画

---

## B. 更强的技能可读性

你的游戏可以比 Balatro 更适合第一次接触扑克构筑的玩家。

例如 Joker 角标直接显示：

```text
+筹码
+倍率
X倍率
经济
触发
规则
```

---

## C. 更明显的 Build 提示

例如玩家已经有：

```text
草莓猫咪
红桃计分 +Mult
```

商店出现红桃 Tarot 时：

```text
♡ 与「草莓猫咪」存在联动
```

但不要自动帮玩家选。

只提示：

```text
Synergy
```

这样既可爱，也更友好。

---

# 32. 最终推荐的新核心循环

```text
NEW RUN
↓
选择起始 Deck
↓
Ante 1 Blind Select
↓
Small / Skip
↓
Battle
↓
Scoring
↓
Cash Out
↓
Shop
↓
Big / Skip
↓
Battle
↓
Shop
↓
Boss
↓
Battle
↓
Shop
↓
Ante +1
↓
持续强化：
Deck
Jokers
Hand Levels
Economy
↓
Ante 8 Final Boss
↓
Victory
```

而每一次 Battle 内：

```text
Draw
↓
选择最多 5 张
↓
Play / Discard
↓
Hand Evaluate
↓
Scoring Cards
↓
Card Effects
↓
Joker Effects
↓
Chips × Mult
↓
达到 Blind Target
```

---

# 33. 本次审计的核心判断

如果只允许我选三个最重要的改动：

## 第一

**牌组必须贯穿整个 Run。**

否则 Tarot、Standard Pack、删牌、复制、强化的价值都无法成立。

## 第二

**Joker 必须从硬编码 `if joker.id` 变成事件驱动能力系统。**

否则你每新增一张 Joker，整个计分代码都会越来越难维护，而且描述与实际效果会继续失控。

## 第三

**战斗界面必须重新把 Chips × Mult、Blind、Scoring Cards、Joker 顺序放到视觉中心。**

商店、首页、设置、成就都应该退后。

---

# 34. 建议下一次真正动代码时的范围

第一批代码改动不要一次把所有东西都重做。

建议第一个可运行版本只完成：

```text
① runDeck 持久化
② 正确 Blind 曲线
③ Battle 中关闭 Shop
④ Ante / Blind Progress
⑤ 独立 scoreHand()
⑥ 修复 Glass / Steel / Gold / Lucky / Polychrome
⑦ Joker Trigger 基础系统
⑧ Joker 拖动顺序
```

完成这 8 项后，先试玩。

如果那一版已经开始出现：

```text
“我想为了这张 Joker 改我的 Deck”
“我想把这两张 Joker 调换位置”
“我要不要花掉这笔钱”
“我要不要把弃牌留着”
```

说明核心玩法才真正建立起来。

之后再继续扩 Joker 和 Meta 系统。

---

# 35. 本次检查过的主要仓库文件

```text
src/App.tsx
src/types.ts
src/utils/pokerLogic.ts
src/data/jokers.ts
src/data/tarotAndPlanets.ts
src/components/BattleScreen.tsx
src/components/HandScoringOverlay.tsx
src/components/JokerCard.tsx
src/components/ShopModal.tsx
src/components/HelpModal.tsx
```

---

# 36. 对照的原版 Balatro 核心设计

本次方案主要参考的不是视觉，而是以下成熟规则：

```text
Chips × Mult
Small / Big / Boss Blind
Ante
Small / Big Skip
Shop only after Blind
Persistent Run Deck
Scoring Card vs Played Card
Joker left-to-right order
On Played
On Scored
On Held
Independent Joker
+Mult vs XMult
Retrigger
Joker Slots
Interest
Planet Hand Levels
Tarot Deck Manipulation
Enhancement / Edition / Seal
```

Bunni Bluff 不需要复制原版牌名和视觉。

真正应该借的是：

> 让所有系统彼此产生组合关系的底层逻辑。
