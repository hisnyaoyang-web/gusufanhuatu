# 《姑苏繁华图》数字人文活化展 — 开发文档

---

## 一、项目概述

### 1.1 项目定位

本项目是基于数字人文方法的交互式展示网站，对清代宫廷画家徐扬于乾隆二十四年（1759）创作的《姑苏繁华图》（又名《盛世滋生图》）进行动态重构与语义增强，实现传统绘画的"活化表达"。

项目核心目标：

- **沉浸式浏览**：GSAP ScrollTrigger 驱动的横向长卷滚动体验，模拟中国传统手卷的展开过程
- **角色叙事**：用户选择"文人 / 商人 / 百姓"三重身份之一，以对应视角体验画卷故事
- **文化热点**：12 个可交互文化场景热点，含角色叙事故事、行业数据、场景详情
- **互动游戏**："近观"放大镜、"寻迹"找图、"看图识俗"等互动小功能
- **数据可视化**：将画中蕴含的商业、建筑、人口等文化数据以 D3.js 图表形式呈现

### 1.2 画作基本信息

| 属性 | 内容 |
|------|------|
| 画名 | 《姑苏繁华图》（《盛世滋生图》） |
| 作者 | 徐扬（字云亭，苏州府吴县人） |
| 年代 | 清·乾隆二十四年（1759） |
| 材质 | 纸本设色 |
| 尺寸 | 全长 1241 厘米，画心高 39 厘米 |
| 现藏 | 辽宁省博物馆 |

### 1.3 画中核心数据

据粗略统计（范金民，2008）：

| 类别 | 数量 |
|------|------|
| 人物 | 约 12,000 余人 |
| 船只 | 约 400 条 |
| 建筑 | 约 2,140 余栋 |
| 桥梁 | 约 50 余座 |
| 可辨认市招 | 约 260 余家 |

### 1.4 地理路线

画卷描绘范围自 **天平山** 起，过 **灵岩山**，经木渎镇东行，过横山，渡石湖，历上方山，入姑苏郡城，自胥门出阊门外，转山塘桥，至 **虎丘** 止。

---

## 二、技术架构

### 2.1 技术选型

| 模块 | 技术 | 版本/来源 |
|------|------|-----------|
| 页面结构 | HTML5 | — |
| 样式 | CSS3（CSS 变量、backdrop-filter、animation） | — |
| 交互逻辑 | 原生 JavaScript（ES6+，IIFE 模块） | — |
| 滚动动画 | GSAP + ScrollTrigger | 3.12.5 (CDN) |
| 数据可视化 | D3.js | 7.9.0 (CDN) |
| 字体 | Noto Serif SC / Noto Sans SC / DM Sans | Google Fonts |

### 2.2 部署方式

纯静态部署，无构建工具，无后端依赖。所有依赖通过 CDN 引入，直接用浏览器打开 `index.html` 即可运行。

### 2.3 文件结构

```
gusufanhuatu/
├── index.html                主页面入口
├── data.js                   文化数据模块（场景/角色/商业/热点/故事）
├── main.js                   主逻辑（滚动/热点/视角/叙事/放大镜/寻迹/NPC）
├── style.css                 完整样式表
├── kaifa.md                  本开发文档
├── 姑苏繁华图_事实信息汇总.md  参考资料
├── .gitignore
├── assets/
│   └── images/
│       ├── tiles/            画卷切片（10 张 JPEG，~74 MB）
│       │   ├── 01OK.jpg ~ 10OK.jpg
│       └── compare/
│           └── new_img/      古今对比照片（3 张）
│   └── videos/               场景视频映射数据
├── characters/               角色头像 + 人物文档
│   ├── wenren/shen/          文人·沈鹤年
│   ├── shangren/             商人·陈瑞丰
│   ├── pingmin/              百姓·阿桂
│   ├── npc/                  NPC·陆小顺
│   └── 角色总录.md
└── games/
    ├── common.css / common.js      游戏公共样式与逻辑
    ├── puzzle.html                 拼图游戏
    ├── quiz.html                   知识问答
    ├── shop-sort.html              商铺分类
    ├── spot-custom/                看图识俗
    │   ├── spot-custom.html
    │   ├── spot-custom-data.json
    │   └── images/                 12 张场景截图
    └── find-me/images/             寻迹截图
        ├── find-01.jpg
        └── find-02.jpg
```

---

## 三、页面架构

### 3.1 整体流程

```
开场水墨动画 → 点击进入 → 身份选择（三角色卡片）
                              │
                              ▼
                      长卷横向滚动浏览
                        ├─ 顶部：场景名称标签（自动切换）
                        ├─ 画面：8 个主场景热点 + 12 个文化场景热点
                        ├─ 左侧：竖向叙事卡片（随滚动 & 视角自动切换）
                        ├─ 底部导航栏：
                        │    ├─ 进度条（含场景跳转标记）
                        │    ├─ 角色信息标签
                        │    ├─ [近观] 放大镜按钮
                        │    └─ [寻迹] 找图游戏按钮
                        └─ 附加功能：
                             ├─ 文化热点点击 → 放大叠加层（相框式）
                             ├─ 主热点点击 → 详情弹窗（叙事/行业/文化数据）
                             ├─ 滚动至末尾 → NPC 陆小顺对话
                             ├─ 寻迹模式 → 右上角提示框 + 放大镜找图
                             └─ 看图识俗 → iframe 游戏叠加层
```

### 3.2 开场水墨动画

- **实现**：Canvas 2D 绘制墨滴粒子扩散效果
- **类 `InkDrop`**：20 个粒子，随机位置、随机半径、渐变填充
- **交互**：点击 / Enter / Space 触发淡出过渡（CSS `opacity` + `visibility` 动画，1s）
- **文件**：`main.js` → `initIntro()`

### 3.3 身份选择

- 开场动画后弹出身份选择界面，展示三张角色卡片（文人/商人/百姓）
- 每张卡片显示角色姓名、身份、年龄、简要概述
- 鼠标悬停展开完整人物小传
- 选择后进入主浏览模式，底部导航栏显示所选角色信息

### 3.4 长卷沉浸浏览（核心）

#### 横向滚动机制

采用 **"竖向滚动驱动横向位移"** 方案：

1. 页面总高度 = `100vh`（spacer）+ `画卷总宽度 - 视口宽度`（scroll distance）
2. GSAP ScrollTrigger 将 `#painting-section` **pin** 在视口内
3. 随垂直滚动，`paintingContainer` 的 `x` 值从 `0` 变化到 `-scrollDistance`
4. `scrub: 0.5` 提供平滑跟随效果

```
进度 0.0 ─────────────────────────────── 进度 1.0
  │                                         │
  ▼                                         ▼
[tile10][tile09][tile08]...[tile02][tile01]
  ▲                                         ▲
  │                                         │
虎丘侧                                    天平山侧
```

#### 场景检测逻辑

```javascript
// progress 0→1 对应画面从左(tile10/虎丘)到右(tile01/天平山)
// scene.x 是热点在画面中的百分比位置（从左到右）
// 天平山 x=89.3（画面右侧），虎丘 x~2（画面左侧）

const scrollPercent = progress * 100;
const sorted = [...SCENES].sort((a, b) => a.x - b.x);
for (const scene of sorted) {
  if (scrollPercent >= scene.x - 3) {
    active = scene;
  }
}
```

#### 进度条 & 场景标记

- 进度条填充宽度 = `progress × 100%`
- 场景标记位置 = `scene.markerX || scene.x` + `'%'`
- 点击标记可跳转到对应位置（平滑滚动）

### 3.5 竖向叙事卡片

- 位于画面左侧，竖排文字（`writing-mode: vertical-rl`）
- 随滚动位置 & 所选视角自动切换内容
- 显示场景名称（带【】括号）+ 当前视角的叙事文本
- 使用「」引号确保竖排显示兼容

### 3.6 文化热点与放大叠加层

- 12 个文化场景热点（`CULTURAL_HOTSPOTS`）散布在画面上
- 点击后打开相框式放大叠加层（`#zoom-overlay`），支持拖拽平移
- 显示场景名称 + 当前角色的文化故事（`CULTURAL_STORIES`）

### 3.7 近观（放大镜）

- 底部导航栏「近观」按钮切换放大镜模式
- Canvas 圆形镜头（180px，2.5x 放大），金色边框，跟随鼠标移动
- 从对应 tile 图片裁切绘制，实时渲染
- 激活时隐藏默认光标

### 3.8 寻迹（找图游戏）

- 底部导航栏「寻迹」按钮启动
- 右上角弹出提示卡片：目标小图 + 名称 + 文字提示 + 进度
- 自动开启放大镜模式辅助寻找
- 用户在画面上点击，计算百分比坐标与答案对比
- 正确：绿色反馈圈 + "找到了"提示
- 错误：红色反馈圈，继续寻找
- 全部找完后显示完成提示
- 关闭时同时退出放大镜模式

### 3.9 NPC 对话系统

- 用户首次滚动到画卷末尾（progress >= 0.99）时触发
- NPC「陆小顺」（外乡来客）以横排对话卡片形式出现
- 打字机效果逐行显示，用户点击后出现下一行
- 可引导用户进入「看图识俗」小游戏

### 3.10 游戏叠加层

- 全屏 iframe 加载 `games/` 下的 HTML 游戏
- 支持 PostMessage 通信，游戏内可关闭返回主页面
- 当前包含：看图识俗（spot-custom）

### 3.11 主热点详情弹窗

- 点击 8 个主场景热点后弹出
- 包含：场景叙事（三视角切换）、关联行业、文化场景、统计数据
- "跳转到此场景"按钮可快速定位

---

## 四、数据设计

### 4.1 数据来源

本项目的商业统计数据全部来自学术论文：

> 范金民.《〈姑苏繁华图〉：清代苏州城市文化繁荣的写照》. 收录于长江经济网，原文刊于相关学术期刊。

该论文系统统计了画中可辨认的 260 余家店铺市招，并按行业逐一分类考证，与文献记载相互印证。

### 4.2 数据模块（data.js）

| 常量名 | 说明 | 条目数 |
|--------|------|--------|
| `SUMMARY` | 画作基本信息（标题/作者/年代/统计数据） | 1 |
| `SCENES` | 主场景（含坐标/标签/三视角叙事/子热点） | 8 |
| `COMMERCE_DATA` | 行业数据（名称/数量/大类/详情） | 36 |
| `COMMERCE_CATEGORY` | 行业大类汇总（由 COMMERCE_DATA 自动聚合） | 15 |
| `BUILDING_DATA` | 建筑类型统计 | 8 |
| `CULTURAL_SCENES` | 文化场景分类（科举/戏曲/婚礼/园林） | 4 类 14 项 |
| `GEO_ROUTE` | 地理路线节点 | 8 |
| `PERSPECTIVE_CONFIG` | 视角配置（标签/图标/主色/高亮场景） | 3 |
| `SCENE_COMMERCE` | 场景-行业关联映射 | 8 场景 |
| `SCENE_CULTURAL` | 场景-文化场景关联映射 | 8 场景 |
| `CULTURAL_HOTSPOTS` | 文化热点（名称/所属场景/坐标） | 12 |
| `CHARACTERS` | 角色数据（含 NPC 陆小顺） | 4 |
| `CULTURAL_STORIES` | 文化场景故事（每场景×3 角色视角） | 14×3 |
| `FIND_ME_DATA` | 寻迹游戏关卡数据 | 可扩展 |

#### CHARACTERS — 角色数据

| ID | 姓名 | 身份 | 年龄 | 主色 |
|----|------|------|------|------|
| scholar | 沈鹤年 | 苏州府秀才 | 二十四 | #4A7C8F 青蓝 |
| merchant | 陈瑞丰 | 闽商后裔·丝绸洋货商 | 三十七 | #C17817 琥珀 |
| commoner | 阿桂 | 山塘街面馆帮工 | 十九 | #8B6F4E 泥褐 |
| newcomer | 陆小顺 | 外乡来客·商铺伙计（NPC） | 二十一 | #6B8E4E 草绿 |

每个角色包含：`id`, `name`, `title`, `age`, `summary`, `bio`, `image`, `color`。
NPC 角色（newcomer）不参与身份选择，仅在滚动至末尾时触发对话。

#### SCENES — 8 个主场景

| ID | 场景 | x (%) | y (%) | 标签 |
|----|------|-------|-------|------|
| S01 | 天平山 | 89.3 | 31.5 | 范公遗泽·奇石红枫 |
| S02 | 灵岩山 | 83.9 | 42.4 | 吴王遗迹 |
| S03 | 木渎镇 | 75.9 | 56.7 | 商业古镇 |
| S04 | 石湖 | 57.2 | 49.1 | 水上交通 |
| S05 | 胥门·社仓 | 49.5 | 40.2 | 社仓义举 |
| S06 | 胥门·府试 | 33.3 | 21.0 | 城门关隘 |
| S07 | 阊门 | 21.0 | 52.4 | 繁华市井 |
| S08 | 山塘街·虎丘 | 10.0 | 48.2 | 七里山塘 |

部分场景含 `subPoints`（子热点）。

#### CULTURAL_HOTSPOTS — 12 个文化热点

| 场景 | x (%) | y (%) | 所属主场景 |
|------|-------|-------|-----------|
| 灵岩山雅集 | 82.2 | 77.4 | S02 |
| 木渎三弦弹唱 | 78.6 | 90.6 | S03 |
| 遂初园堂会 | 66.5 | 68.3 | S03 |
| 木渎迎亲船队 | 75.9 | 70.0 | S03 |
| 春台社戏 | 51.3 | 67.8 | S05 |
| 府衙府试 | 33.3 | 21.0 | S06 |
| 阊门走绳索 | 21.0 | 72.4 | S07 |
| 怡老园 | 27.2 | 72.8 | S07 |
| 山塘义学 | 13.3 | 90.8 | S08 |
| 黄鹂坊桥婚礼 | 24.4 | 73.9 | S08 |
| 山塘花市 | 10.0 | 48.2 | S08 |
| 虎丘云岩寺 | 2.5 | 11.0 | S08 |

#### FIND_ME_DATA — 寻迹游戏

```javascript
const FIND_ME_DATA = [
  {
    id: 1,
    name: "顶筐搬运的伙计",
    image: "games/find-me/images/find-01.jpg",
    hint: "两位劳动者头顶竹编圆筐，沿街巷匆匆走过，店铺墙上有匾额",
    answerX: 33.5,   // 画卷百分比坐标
    answerY: 80.0,
    tolerance: 5,     // 允许偏差
  },
  // ... 可继续扩展
];
```

---

## 五、模块文档

### 5.1 main.js 模块结构

所有逻辑封装在一个 IIFE 中，通过函数分模块组织：

#### 初始化

| 函数 | 职责 |
|------|------|
| `init()` | 入口：缓存 DOM、初始化各模块 |
| `cacheDom()` | 一次性查询所有 DOM 节点，存入 `dom` 对象 |

#### 开场与身份

| 函数 | 职责 |
|------|------|
| `initIntro()` | Canvas 水墨粒子动画、点击过渡 |
| `showIdentitySelection()` | 显示身份选择界面，生成角色卡片 |
| `selectIdentity(perspective)` | 选择角色，更新底部角色标签 |

#### 滚动与场景

| 函数 | 职责 |
|------|------|
| `initScroll()` | GSAP ScrollTrigger 注册、图片加载等待、spacer 高度 |
| `updateProgress(progress)` | 更新进度条填充宽度 |
| `updateScene(progress)` | 根据 scroll progress 检测当前活跃场景 |
| `showNarrativeForScene(scene)` | 更新左侧竖向叙事卡片 |
| `initNarrativeTrigger()` | 叙事卡片触发逻辑 |
| `renderHotspots()` | 动态创建热点 DOM 元素 |
| `renderSceneMarkers()` | 在进度条上创建场景跳转标记 |
| `sceneToProgress(xPercent)` | 场景 x 坐标转为滚动 progress |
| `jumpToScene(scene, autoZoom, culturalName)` | 跳转到指定场景 |

#### 热点与弹窗

| 函数 | 职责 |
|------|------|
| `applyPerspectiveHighlight()` | 根据当前视角高亮/淡化热点 |
| `openDetail(scene)` | 打开主热点详情弹窗 |
| `renderModalNarrative()` | 渲染弹窗中的叙事内容 |
| `renderModalCommerce(scene)` | 渲染弹窗中的行业数据 |
| `renderModalCultural(scene)` | 渲染弹窗中的文化场景 |
| `getShopCountForScene(scene)` | 获取场景市招数量 |
| `closeModal()` | 关闭详情弹窗 |
| `showZoomOverlay(scene, culturalName)` | 打开文化热点放大叠加层 |
| `closeZoomOverlay()` | 关闭放大叠加层 |
| `initZoomOverlay()` | 叠加层拖拽/关闭事件绑定 |

#### 放大镜

| 函数 | 职责 |
|------|------|
| `initMagnifier()` | 放大镜按钮事件绑定 |
| `toggleMagnifier()` | 切换放大镜开关状态 |
| `onMagnifierMove(e)` | Canvas 镜头跟随鼠标，裁切绘制 tile 图 |

#### 寻迹游戏

| 函数 | 职责 |
|------|------|
| `initFindMe()` | 按钮事件绑定 + 画面点击监听 |
| `startFindMe()` | 加载数据、打乱关卡、自动开启放大镜 |
| `showFindMeRound()` | 显示当前关卡提示卡片 |
| `onFindMeClick(e)` | 计算点击坐标，判定正确/错误 |
| `showFindMeFeedback(e, correct)` | 显示绿色/红色反馈圈 |
| `showFindMeComplete()` | 全部找完后的完成提示 |
| `closeFindMe()` | 关闭游戏、退出放大镜 |
| `shuffleArray(arr)` | Fisher-Yates 洗牌算法 |

#### NPC 对话

| 函数 | 职责 |
|------|------|
| `triggerNpcDialog()` | 触发 NPC 对话（progress >= 0.99 时） |
| `typeNpcLine()` | 逐行打字机效果 |
| `skipNpcTyping()` | 跳过当前行打字 |
| `showNpcClickHint()` | 显示"点击继续"提示 |
| `showNpcActions()` | 显示对话选项（如"去看图识俗"） |
| `closeNpcDialog()` | 关闭对话 |
| `initNpcDialog()` | NPC 对话初始化 |

#### 游戏叠加层

| 函数 | 职责 |
|------|------|
| `openGame(src)` | 打开游戏 iframe |
| `closeGame()` | 关闭游戏 iframe |
| `initGameOverlay()` | 游戏叠加层事件绑定 |

#### 其他

| 函数 | 职责 |
|------|------|
| `toggleRolePanel()` / `closeRolePanel()` | 角色信息面板开关 |
| `initProgressClick()` | 进度条点击跳转 |

### 5.2 全局状态

```javascript
let currentPerspective = 'scholar';  // 当前角色视角
let currentScene = null;             // 当前活跃场景 ID
let currentScrollProgress = 0;       // 当前滚动进度
let npcTriggered = false;            // NPC 是否已触发
let overlayDrag = { ... };           // 放大叠加层拖拽状态
let modalScene = null;               // 当前弹窗场景

// 放大镜
let magnifierActive = false;

// 寻迹游戏
let findmeActive = false;            // 游戏是否进行中
let findmeData = [];                 // 当前关卡数据
let findmeIndex = 0;                 // 当前关卡索引
let findmeWaiting = false;           // 等待用户点击判定

// NPC 对话
const NPC_DIALOG = [ ... ];          // 对话文本数组
let npcTypingTimer = null;
let npcLineIndex = 0;
let npcTyping = false;
```

### 5.3 关键交互流程

#### 主滚动流程

```
用户向下滚动
  → ScrollTrigger.onUpdate(progress)
    → updateProgress(): 进度条填充
    → updateScene(progress): 场景检测
      → 切换场景名称标签
      → 高亮进度条标记
    → showNarrativeForScene(): 更新竖向叙事卡片
    → progress >= 0.99 且未触发: triggerNpcDialog()
```

#### 文化热点交互

```
悬浮热点 → CSS :hover 显示 tooltip
点击热点 → showZoomOverlay()
  → 计算裁切区域，生成相框放大图
  → 显示场景名称 + 当前角色文化故事
  → 支持拖拽平移查看
```

#### 寻迹游戏流程

```
点击「寻迹」→ startFindMe()
  → 加载 FIND_ME_DATA → 打乱 → 自动开启放大镜
  → showFindMeRound(): 显示提示卡片
用户在画面上点击 → onFindMeClick()
  → 计算点击位置画卷百分比坐标
  → 与答案坐标比较（欧氏距离 < tolerance）
  → 正确: 绿色反馈 + "找到了"
  → 错误: 红色反馈 + 继续寻找
```

---

## 六、视觉设计

### 6.1 色彩系统

```css
:root {
  --bg-paper:       #f5f0e6;    /* 宣纸底色 */
  --bg-dark:        #1a1a1a;    /* 深色背景 */
  --bg-darker:      #111;       /* 开场背景 */
  --accent-cinnabar: #B22222;   /* 朱砂红（主色调） */
  --accent-gold:    #D4AF37;    /* 金色（辅助） */
  --accent-ink:     #2F4F4F;    /* 墨色（文字） */
  --accent-blue:    #4A7C8F;    /* 青蓝（文人） */
  --accent-amber:   #C17817;    /* 琥珀（商人） */
  --accent-earth:   #8B6F4E;    /* 泥褐（百姓） */
}
```

### 6.2 字体

| 用途 | 字体 | 回退 |
|------|------|------|
| 标题 | Noto Serif SC | SimSun, STSong, serif |
| 正文 | Noto Sans SC | Microsoft YaHei, sans-serif |
| 数据 | DM Sans | Menlo, monospace |

### 6.3 核心动画

| 动画 | 实现 | 参数 |
|------|------|------|
| 水墨粒子 | Canvas `requestAnimationFrame` | 20 粒子，径向渐变 |
| 热点呼吸 | CSS `@keyframes breathe` | 2.5s cycle，scale 1→1.3→1 |
| 竖向叙事滑入 | GSAP `fromTo` | x: -60→0, opacity: 0→1 |
| 放大镜镜头 | Canvas `drawImage` 裁切 | 180px 直径，2.5x 放大 |
| 寻迹反馈圈 | CSS `@keyframes findmeRipple` | 0.6s 缩放扩散 |
| NPC 对话展开 | CSS `scaleX(0)→scaleX(1)` | 横向展开 |
| 打字机效果 | JS `setTimeout` 逐字 | 50ms/字 |
| 进度条 | CSS `transition` | 0.1s linear |
| 毛玻璃 | `backdrop-filter: blur()` | 8-16px |

---

## 七、坐标系统

### 7.1 百分比坐标

采用百分比相对坐标 `(x, y) ∈ [0, 100]`：

- x: 从画卷左侧到右侧的百分比位置
- y: 从画卷顶部到底部的百分比位置

优势：与图像缩放解耦，天然响应式。

### 7.2 画卷图片排列

10 张 tile 按 `flex` 行排列，顺序为 tile10 → tile01（从左到右对应虎丘→天平山）：

```
[tile10][tile09][tile08][tile07][tile06][tile05][tile04][tile03][tile02][tile01]
  ▲                                                                         ▲
  │                                                                         │
虎丘(x~2%)                                                              天平山(x~89%)
```

---

## 八、外部依赖

| 依赖 | CDN 地址 | 用途 |
|------|----------|------|
| GSAP | `cdnjs.cloudflare.com/ajax/libs/gsap/3.12.5/gsap.min.js` | 动画引擎 |
| ScrollTrigger | `cdnjs.cloudflare.com/ajax/libs/gsap/3.12.5/ScrollTrigger.min.js` | 滚动驱动动画 |
| D3.js | `cdnjs.cloudflare.com/ajax/libs/d3/7.9.0/d3.min.js` | 数据可视化图表 |
| Noto Serif SC | `fonts.googleapis.com` | 标题字体 |
| Noto Sans SC | `fonts.googleapis.com` | 正文字体 |
| DM Sans | `fonts.googleapis.com` | 数据数字字体 |

---

## 九、学术引用

本项目的文化数据与叙事内容主要参考以下学术文献：

1. **范金民**.《〈姑苏繁华图〉：清代苏州城市文化繁荣的写照》
   - 来源：长江经济网
   - 引用内容：260 余家市招的行业分类统计、科举教育场景、戏曲丝竹场景、婚礼习俗场景、园林胜景描述

2. **苏州市城建档案馆、辽宁省博物馆** 编.《姑苏繁华图》. 文物出版社，1999 年。

3. **徐扬** 绘.《姑苏繁华图》. 香港商务印印书馆，1988 年。

---

## 十、运行方式

### 本地运行

```bash
# 方式一：直接打开
# 双击 index.html 文件即可在浏览器中打开

# 方式二：本地服务器（推荐，避免字体加载跨域问题）
cd gusufanhuatu
python -m http.server 8080
# 浏览器访问 http://localhost:8080/index.html
```

### 浏览器要求

- Chrome 76+ / Firefox 70+ / Edge 79+ / Safari 14+
- 需支持 `backdrop-filter`、CSS 变量、ES6+
- 需联网加载 CDN 资源（GSAP、D3、Google Fonts）

---

## 十一、已知限制与后续方向

### 已知限制

1. **图片体积**：10 张图片合计约 74 MB，首次加载较慢
2. **寻迹坐标**：FIND_ME_DATA 中的答案坐标需要对照实际画面校准
3. **无音频功能**：设计文档中规划的音频旁白功能未实现

### 后续可扩展方向

- **视频场景**：将文化场景详情页改为循环播放动态视频
- **国际化（i18n）**：提取文案为 JSON 语言包，支持中英文切换
- **深度缩放**：引入 OpenSeadragon 实现画作高精度缩放浏览
- **古今对比**：完善今昔对比滑块，增加更多对比照片
- **热力图叠加**：Canvas 绘制商业密度热力图，叠加在画卷上
- **角色动画**：Sprite Sheet 实现"行走""叫卖"等人物微动画
