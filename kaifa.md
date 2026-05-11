# 《姑苏繁华图》数字人文活化展 — 开发文档

---

## 一、项目概述

### 1.1 项目定位

本项目是基于数字人文方法的交互式展示网站，对清代宫廷画家徐扬于乾隆二十四年（1759）创作的《姑苏繁华图》（又名《盛世滋生图》）进行动态重构与语义增强，实现传统绘画的"活化表达"。

项目核心目标：

- **数据可视化**：将画中蕴含的商业、建筑、人口等文化数据以 D3.js 图表形式呈现
- **交互叙事**：通过"文人 / 商人 / 百姓"三重视角，对同一画卷提供不同的叙事解读
- **沉浸式浏览**：GSAP ScrollTrigger 驱动的横向长卷滚动体验，模拟中国传统手卷的展开过程

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

画卷描绘范围自 **灵岩山** 起，由木渎镇东行，过横山，渡石湖，历上方山，入姑苏郡城，自胥门出阊门外，转山塘桥，至 **虎丘** 止。

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
| 图片处理 | Pillow（Python，离线预处理） | — |

### 2.2 部署方式

纯静态部署，无构建工具，无后端依赖。所有依赖通过 CDN 引入，直接用浏览器打开 `index.html` 即可运行。

### 2.3 文件结构

```
gusufanhuatu/
├── index.html              主页面入口
├── data.js                 文化数据模块
├── main.js                 主逻辑（滚动 / 热点 / 视角 / 图表）
├── style.css               完整样式表
├── kaifa.md                本开发文档
├── assets/
│   └── images/
│       ├── tiles/          画卷切片（10 张 JPEG，~74 MB）
│       │   ├── 01OK.jpg ~ 10OK.jpg
│       └── compare/
│           └── new_img/    古今对比照片
│               ├── P1_new.jpg
│               ├── P1-C1_new.jpg
│               └── P1-C2_new.jpg
├── hotspots.json           原始热点数据（旧版）
├── excel_to_json.py        Excel → JSON 转换脚本
├── process_tiles.py        TIFF → JPEG 批量转换脚本
├── coordinate_helper.html  坐标拾取辅助工具
└── test.html               旧版测试页面
```

---

## 三、页面架构

### 3.1 整体流程

```
开场水墨动画 → 点击进入 → 长卷横向滚动浏览
                              ├─ 顶部：场景名称标签（自动切换）
                              ├─ 顶部：统计概览条（人物/市招/建筑/船只/桥梁）
                              ├─ 画面：8 个可交互热点（悬浮预览 / 点击详情）
                              ├─ 底部：叙事卡片（随滚动位置 & 视角自动切换）
                              ├─ 底部导航栏：
                              │    ├─ 进度条（含 8 个场景跳转标记）
                              │    ├─ 视角切换 [文人] [商人] [百姓]
                              │    └─ 数据面板按钮
                              └─ 右侧：数据可视化面板（滑出）
                                   ├─ 行业分布环形图
                                   ├─ 建筑类型条形图
                                   ├─ 文化场景卡片
                                   └─ 地理路线图
```

### 3.2 开场水墨动画（Section 1）

- **实现**：Canvas 2D 绘制墨滴粒子扩散效果
- **类 `InkDrop`**：20 个粒子，随机位置、随机半径、渐变填充
- **交互**：点击 / Enter / Space 触发淡出过渡（CSS `opacity` + `visibility` 动画，1s）
- **文件**：`main.js` → `initIntro()`

### 3.3 长卷沉浸浏览（Section 2，核心）

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
大运河侧                                  灵岩山侧
```

#### 场景检测逻辑

```javascript
// progress 0→1 对应画面从左(tile10)到右(tile01)
// scene.x 是热点在画面中的百分比位置（从左到右）
// 灵岩山 x=84.6（画面右侧），大运河 x=5（画面左侧）

const scrollPercent = progress * 100;
const sorted = [...SCENES].sort((a, b) => a.x - b.x);
for (const scene of sorted) {
  if (scrollPercent >= scene.x - 3) {
    active = scene;  // 取最后一个满足条件的场景
  }
}
```

#### 进度条 & 场景标记

- 进度条填充宽度 = `progress × 100%`
- 场景标记位置 = `scene.x + '%'`（直接使用画面坐标百分比）
- 进度条从左到右：大运河(x=5) → ... → 灵岩山(x=84.6)
- 点击标记可跳转到对应位置（平滑滚动）

### 3.4 数据可视化面板（Section 3）

右侧滑出面板，`transform: translateX(100%)` → `translateX(0)`，毛玻璃背景。

| 图表 | 实现方式 | 数据来源 |
|------|----------|----------|
| 行业分布环形图 | D3 pie + arc，innerRadius/outerRadius | COMMERCE_DATA（36 行业，261 家） |
| 建筑类型条形图 | D3 水平 bar chart | BUILDING_DATA（8 类） |
| 文化场景卡片 | DOM 动态生成 | CULTURAL_SCENES（4 类 14 项） |
| 地理路线图 | CSS 竖向时间线 | GEO_ROUTE（8 个地点） |

图表采用 **懒加载** 策略：首次打开面板时才渲染 D3 图表，之后不再重复渲染。

### 3.5 视角叙事系统（Section 4）

三个视角（`scholar` / `merchant` / `commoner`），每个视角对每个场景提供一段 50-100 字的叙事文本。

#### 切换效果

- 热点高亮：当前视角的 `highlight` 数组中的热点以对应颜色高亮，其余半透明灰化
- 叙事卡片：底部卡片自动更新为当前场景 × 当前视角的叙事文本
- 详情弹窗：打开热点详情时显示当前视角下的叙事

#### 视角配色

| 视角 | 颜色 | 色值 | 高亮场景 |
|------|------|------|----------|
| 文人 | 青蓝 | #4A7C8F | 灵岩山、木渎、胥门、山塘、虎丘 |
| 商人 | 琥珀 | #C17817 | 木渎、石湖、阊门、山塘、大运河 |
| 百姓 | 泥褐 | #8B6F4E | 灵岩山、木渎、石湖、胥门、阊门、山塘 |

---

## 四、数据设计

### 4.1 数据来源

本项目的商业统计数据全部来自学术论文：

> 范金民.《〈姑苏繁华图〉：清代苏州城市文化繁荣的写照》. 收录于长江经济网，原文刊于相关学术期刊。

该论文系统统计了画中可辨认的 260 余家店铺市招，并按行业逐一分类考证，与文献记载相互印证。

### 4.2 数据模块（data.js）

#### SUMMARY — 画作基本信息

```javascript
const SUMMARY = {
  title: '姑苏繁华图', artist: '徐扬', year: 1759,
  dynasty: '清·乾隆二十四年', length: '1241 厘米', height: '39 厘米',
  material: '纸本设色', location: '辽宁省博物馆',
  people: 12000, boats: 400, buildings: 2140, bridges: 50, shops: 260,
};
```

#### SCENES — 8 个主场景

每个场景包含：`id`, `name`, `x`（画面百分比）, `y`, `tag`, `perspectives`（三视角叙事）。

| ID | 场景 | x (%) | y (%) | 标签 | 说明 |
|----|------|-------|-------|------|------|
| P1 | 灵岩山 | 84.6 | 39 | 湖光山色 | 坐标来自原始 hotspots.json |
| P2 | 木渎镇 | 74 | 55 | 商业市镇 | 坐标来自原始 hotspots.json |
| P3 | 石湖 | 57 | 50 | 水上交通 | 估算坐标 |
| P4 | 胥门·府试 | 38 | 48 | 城门关隘 | 估算坐标 |
| P5 | 阊门 | 25 | 52 | 繁华市井 | 估算坐标 |
| P6 | 山塘街 | 18 | 55 | 七里山塘 | 估算坐标 |
| P7 | 虎丘 | 10 | 40 | 名胜古迹 | 估算坐标 |
| P8 | 大运河 | 5 | 50 | 黄金水道 | 估算坐标 |

> **坐标说明**：x/y 为热点在画卷容器中的百分比位置（从左上角算起）。P1、P2 的坐标来自项目已有的 `hotspots.json`（通过坐标拾取工具获得），其余为基于画卷地理顺序的估算值，需对照实际画面微调。

#### COMMERCE_DATA — 36 类商业数据

按范金民论文统计，共约 261 家。每条包含 `name`（行业名）、`count`（家数）、`category`（大类）、`detail`（具体描述）。

前 10 大行业：

| 行业 | 家数 | 大类 |
|------|------|------|
| 酒店饭馆小吃 | 31 | 饮食 |
| 棉花棉布 | 23 | 纺织 |
| 油盐糖杂货 | 17 | 杂货 |
| 粮食 | 16 | 食品 |
| 丝绸 | 14 | 纺织 |
| 钱庄典当 | 14 | 金融 |
| 衣服鞋帽 | 14 | 服饰 |
| 医药 | 13 | 医药 |
| 图书字画 | 10 | 文化 |
| 金银珠宝 | 8 | 珠宝 |

#### COMMERCE_CATEGORY — 行业大类汇总

由 `COMMERCE_DATA` 自动聚合计算，共 15 个大类，按数量降序排列。用于环形图展示。

#### BUILDING_DATA — 建筑类型

```javascript
[
  { name: '民居', count: 1200 },
  { name: '商铺', count: 680 },
  { name: '桥梁', count: 52 },
  { name: '寺庙', count: 45 },
  { name: '其他', count: 85 },
  { name: '园林', count: 35 },
  { name: '官署', count: 28 },
  { name: '城楼', count: 15 },
]
```

#### CULTURAL_SCENES — 文化场景

4 个类别、14 个具体场景：

- 科举教育：灵岩山书塾、灵岩山书楼、山塘义学、府衙府试
- 戏曲丝竹：木渎三弦弹唱、遂初园堂会、春台社戏、阊门走绳索
- 婚礼习俗：木渎迎亲船队、黄鹂坊桥婚礼
- 园林胜景：木渎遂初园、怡老园、山塘花市、虎丘云岩寺

#### GEO_ROUTE — 地理路线

8 个地点，从画卷起点到终点：灵岩山 → 木渎镇 → 石湖 → 横塘 → 胥门 → 阊门 → 山塘街 → 虎丘。

#### PERSPECTIVE_CONFIG — 视角配置

三个视角的标签、图标、主色、高亮场景列表。

---

## 五、模块文档

### 5.1 main.js 模块结构

所有逻辑封装在一个 IIFE 中，通过函数分模块组织：

| 函数 | 职责 |
|------|------|
| `init()` | 入口：缓存 DOM、初始化各模块、绑定事件 |
| `cacheDom()` | 一次性查询所有 DOM 节点，存入 `dom` 对象 |
| `initIntro()` | Canvas 水墨粒子动画、点击过渡 |
| `initScroll()` | GSAP ScrollTrigger 注册、图片加载等待、spacer 高度计算 |
| `updateProgress(progress)` | 更新进度条填充宽度 |
| `updateScene(progress)` | 根据 scroll progress 检测当前活跃场景 |
| `updateNarrative()` | 更新底部叙事卡片内容 |
| `renderHotspots(totalWidth)` | 动态创建 8 个热点 DOM 元素 |
| `renderSceneMarkers()` | 在进度条上创建场景跳转标记 |
| `initPerspectives()` | 视角按钮点击事件绑定 |
| `applyPerspectiveHighlight()` | 根据当前视角高亮/淡化热点 |
| `openDetail(scene)` | 打开热点详情弹窗 |
| `closeModal()` | 关闭详情弹窗 |
| `initDataPanel()` | 数据面板开关事件 |
| `renderCharts()` | 渲染全部 D3 图表（懒加载入口） |
| `renderCommerceDonut()` | D3 环形图：行业分布 |
| `renderBuildingBar()` | D3 条形图：建筑类型 |
| `renderCulturalCards()` | DOM 生成：文化场景卡片 |
| `renderRouteMap()` | DOM 生成：地理路线图 |
| `initProgressClick()` | 进度条点击跳转 |

### 5.2 全局状态

```javascript
let currentPerspective = 'scholar';  // 当前视角
let dataPanelOpen = false;           // 数据面板是否打开
let currentScene = null;             // 当前活跃场景 ID
let chartsRendered = false;          // 图表是否已渲染（懒加载标记）
```

### 5.3 关键交互流程

#### 滚动流程

```
用户向下滚动
  → ScrollTrigger.onUpdate(progress)
    → updateProgress(): 进度条填充
    → updateScene(progress): 场景检测
      → 切换场景名称标签
      → 高亮进度条标记
    → updateNarrative(): 更新叙事卡片
```

#### 视角切换流程

```
用户点击视角按钮
  → currentPerspective 更新
  → applyPerspectiveHighlight(): 热点颜色/透明度变化
  → updateNarrative(): 叙事文本更新
```

#### 热点交互流程

```
悬浮热点 → CSS :hover 显示 tooltip（名称 + 标签）
点击热点 → openDetail(scene)
  → 填充弹窗标题、标签、叙事文本
  → 生成统计数据卡片
  → 弹窗显示
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
  --accent-blue:    #4A7C8F;    /* 青蓝（文人视角） */
  --accent-amber:   #C17817;    /* 琥珀（商人视角） */
  --accent-earth:   #8B6F4E;    /* 泥褐（百姓视角） */
}
```

### 6.2 字体

| 用途 | 字体 | 回退 |
|------|------|------|
| 标题 | Noto Serif SC | SimSun, STSong, serif |
| 正文 | Noto Sans SC | Microsoft YaHei, sans-serif |
| 数据 | DM Sans | Menlo, monospace |

### 6.3 动画

| 动画 | 实现 | 参数 |
|------|------|------|
| 水墨粒子 | Canvas `requestAnimationFrame` | 20 粒子，径向渐变 |
| 热点呼吸 | CSS `@keyframes breathe` | 2.5s cycle，scale 1→1.3→1 |
| 环形图入场 | D3 `attrTween` + `transition` | 800ms |
| 条形图入场 | D3 `transition` + `delay` | 800ms + stagger 80ms |
| 进度条 | CSS `transition` | 0.1s linear |
| 面板滑出 | CSS `transform` transition | 0.4s cubic-bezier |
| 毛玻璃 | `backdrop-filter: blur()` | 8-16px |

### 6.4 响应式适配

- 768px 以下：数据面板全屏宽度、视角按钮隐藏图标、弹窗宽度 95%
- 进度条、叙事卡片均自适应宽度

---

## 七、图像处理

### 7.1 画卷切片

原始高清画卷被切分为 10 张 JPEG 图片（`01OK.jpg` ~ `10OK.jpg`），每张约 5-9 MB。

- 切片通过 `process_tiles.py` / `process_single_tile.py`（Pillow）从 TIFF 转换而来
- 10 张图以 `flex` 行排列，`height: 100%`，宽度自适应
- 图片设置 `user-select: none` 和 `draggable="false"` 防止误拖拽

### 7.2 坐标系统

采用百分比相对坐标 `(x, y) ∈ [0, 100]`：

- x: 热点在画卷容器中从左到右的百分比位置
- y: 热点在画卷容器中从上到下的百分比位置

优势：与图像缩放解耦，天然响应式。

坐标拾取工具：`coordinate_helper.html`，点击画卷自动复制百分比坐标到剪贴板。

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
   - 来源：长江经济网（https://yangtze.silkroadinfo.org.cn/2016/8/8/200810271747829.pdf）
   - 引用内容：260 余家市招的行业分类统计、科举教育场景、戏曲丝竹场景、婚礼习俗场景、园林胜景描述

2. **苏州市城建档案馆、辽宁省博物馆** 编.《姑苏繁华图》. 文物出版社，1999 年。

3. **徐扬** 绘.《姑苏繁华图》. 香港商务印书馆，1988 年。

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

1. **场景坐标精度**：P3-P8 的 x/y 坐标为估算值，需要对照实际画面微调
2. **图片体积**：10 张图片合计约 74 MB，首次加载较慢，可考虑 WebP 转换或懒加载
3. **市招分布数据**：各场景的市招数量分配（弹窗中的统计卡片）为估算值
4. **无音频功能**：设计文档中规划的音频旁白功能未实现

### 后续可扩展方向

- **深度缩放**：引入 OpenSeadragon 实现画作高精度缩放浏览
- **古今对比**：完善今昔对比滑块，增加更多对比照片
- **热力图叠加**：Canvas 绘制商业密度热力图，叠加在画卷上
- **角色动画**：Sprite Sheet 实现"行走""叫卖"等人物微动画
- **时间层叠**：清代 / 民国 / 现代 三时期切换
- **数据后端**：接入 Supabase 或 Firebase，实现热点数据在线编辑
