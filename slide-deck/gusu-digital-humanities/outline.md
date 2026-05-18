# Slide Deck Outline

**Topic**: 《姑苏繁华图》数字人文活化展 — 项目介绍
**Style**: vintage
**Dimensions**: paper + warm + editorial + balanced
**Audience**: general
**Language**: zh
**Slide Count**: 13 slides
**Generated**: 2026-05-12

---

<STYLE_INSTRUCTIONS>
Design Aesthetic: Nostalgic vintage aesthetic with aged paper textures and historical document styling, evoking Qing dynasty scroll paintings and museum exhibits. Rich warm sepia tones with weathered textures. Timeless knowledge meets digital innovation.

Background:
  Texture: Heavy aged paper texture with subtle creases, worn edges, and rice paper grain
  Base Color: Aged Parchment (#F5E6D3) or Sepia Cream (#FFF8DC)

Typography:
  Headlines: Classic elegant serif with historical character, bold and authoritative, timeless feel with possible decorative flourishes
  Body: Readable traditional serif for longer text, period-appropriate book typography

Color Palette:
  Primary Text: Dark Brown (#3D2914) - Headlines, body text
  Secondary Text: Medium Brown (#6B4423) - Annotations, labels
  Background: Aged Parchment (#F5E6D3) - Primary background
  Alt Background: Sepia Cream (#FFF8DC) - Secondary areas
  Accent 1: Cinnabar Red (#B22222) - Chinese painting seals, emphasis (from project)
  Accent 2: Gold (#D4AF37) - Highlights, decorative borders, compass
  Accent 3: Ink Black (#2F4F4F) - Fine details, ink wash elements

Visual Elements:
  - Antique Chinese scroll and map elements with route lines
  - Traditional seal stamps (red chop marks)
  - Ink wash painting textures and brush strokes
  - Vintage photograph-style image frames with ornate borders
  - Rice paper and silk texture overlays
  - Nautical and journey elements from the painting route
  - Rope, leather, and brass decorative motifs

Density Guidelines:
  - Content per slide: 2-3 key points
  - Whitespace: Generous margins, breathing room between elements

Style Rules:
  Do: Apply consistent aged texture throughout, use period-appropriate visual language, include scroll and journey elements, create layered collage compositions, maintain warm sepia-toned palette
  Don't: Use modern digital styling, create crisp clean edges, use cold or bright colors, add contemporary UI elements, add slide numbers or logos
</STYLE_INSTRUCTIONS>

---

## Slide 1 of 13

**Type**: Cover
**Filename**: 01-slide-cover.png

// NARRATIVE GOAL
Set the stage with an evocative opening that transports the viewer to Qing dynasty Suzhou and introduces the digital humanities project.

// KEY CONTENT
Headline: 姑苏繁华图
Sub-headline: 数字人文活化展 · 项目介绍
Body: 清 · 徐扬 · 乾隆二十四年（1759）

// VISUAL
A long Chinese handscroll painting unfurling across the slide from right to left, with ink wash mountain landscapes in the background. Aged parchment texture with subtle rice paper grain. A red seal stamp (chop mark) in the corner. Gold decorative border elements reminiscent of traditional scroll mounting.

// LAYOUT
Layout: title-hero
Full-bleed scroll painting as background with dark gradient overlay at bottom. Title centered in large elegant serif. Subtitle below in smaller size. Seal stamp positioned as accent.

---

## Slide 2 of 13

**Type**: Content
**Filename**: 02-slide-project-overview.png

// NARRATIVE GOAL
Introduce what this project is about — the digital reimagination of a historical painting.

// KEY CONTENT
Headline: 项目定位
Sub-headline: 基于数字人文方法的交互式展示网站
Body:
- 对清代宫廷画家徐扬《姑苏繁华图》进行动态重构与语义增强
- 实现传统绘画的"活化表达"
- 核心目标：沉浸式浏览、角色叙事、文化热点、互动游戏、数据可视化

// VISUAL
Split composition: left side shows a faded antique map of Suzhou with the painting's route marked by a dotted gold line; right side contains the text on aged parchment. Small compass rose accent.

// LAYOUT
Two-column layout with visual on left (40%) and text on right (60%). Generous whitespace.

---

## Slide 3 of 13

**Type**: Content
**Filename**: 03-slide-painting-info.png

// NARRATIVE GOAL
Present the basic facts about the painting and its incredible scale.

// KEY CONTENT
Headline: 画作基本信息
Sub-headline: 《盛世滋生图》— 辽宁省博物馆藏
Body:
- 作者：徐扬（字云亭，苏州府吴县人）
- 年代：清·乾隆二十四年（1759）
- 材质：纸本设色 | 尺寸：全长1241厘米，画心高39厘米
- 人物约12,000余人 | 船只约400条 | 建筑约2,140余栋
- 桥梁约50余座 | 可辨认市招260余家

// VISUAL
A vintage-style specimen card layout with hand-drawn icons for people, boats, buildings, bridges, and shop signs. Each statistic paired with an antique illustration. Decorative frame border.

// LAYOUT
Grid layout with painting info at top and statistics arranged in a 2x3 grid below, each in its own vintage card.

---

## Slide 4 of 13

**Type**: Content
**Filename**: 04-slide-tech-architecture.png

// NARRATIVE GOAL
Show the technical foundation — surprisingly simple for such a rich experience.

// KEY CONTENT
Headline: 技术架构
Sub-headline: 纯静态部署，无构建工具，无后端依赖
Body:
- 页面：HTML5 + CSS3（变量、backdrop-filter、animation）
- 交互：原生 JavaScript（ES6+，IIFE 模块）
- 滚动动画：GSAP + ScrollTrigger 3.12.5
- 数据可视化：D3.js 7.9.0
- 字体：Noto Serif SC / Noto Sans SC / DM Sans

// VISUAL
Technical diagram drawn in vintage blueprint style — gears, levers, and mechanical connections representing the tech stack, rendered with sepia ink on aged paper. Each technology represented by an antique tool or instrument.

// LAYOUT
Centered diagram with technology labels arranged around a central "engine" illustration. Connected by vintage-style lines and arrows.

---

## Slide 5 of 13

**Type**: Content
**Filename**: 05-slide-user-flow.png

// NARRATIVE GOAL
Map out the user journey through the experience.

// KEY CONTENT
Headline: 整体浏览流程
Body:
- 开场水墨动画 → 身份选择 → 长卷横向滚动浏览
- 顶部场景标签自动切换
- 左侧竖向叙事卡片随视角自动切换
- 底部导航栏：进度条、角色信息、近观、寻迹
- 附加功能：文化热点放大、详情弹窗、NPC对话、游戏叠加层

// VISUAL
A vintage expedition map showing the user journey as a route with waypoints. Each waypoint marked with a small antique icon (ink drop for intro, portrait cards for identity, scroll for browsing, magnifying glass for zoom, speech bubble for NPC).

// LAYOUT
Flow diagram arranged horizontally across the slide like a map route, with text annotations below each waypoint.

---

## Slide 6 of 13

**Type**: Content
**Filename**: 06-slide-horizontal-scroll.png

// NARRATIVE GOAL
Explain the core interaction mechanic — the horizontal scroll experience.

// KEY CONTENT
Headline: 横向长卷沉浸浏览
Sub-headline: "竖向滚动驱动横向位移"
Body:
- 页面总高度 = 100vh + 画卷总宽度 − 视口宽度
- GSAP ScrollTrigger 将画面 pin 在视口内
- 随垂直滚动，画卷自右向左徐徐展开
- 10张切片：tile10(虎丘) → tile01(天平山)
- scrub: 0.5 提供平滑跟随效果

// VISUAL
An antique scroll partially unrolled, showing segments of a Chinese landscape painting. Arrows indicating scroll direction. Vintage mechanical diagram showing the "pin and scrub" concept with pulleys and scroll mechanisms.

// LAYOUT
Large scroll illustration dominating the slide (70%), with explanatory text in a vintage callout box overlaying the bottom portion.

---

## Slide 7 of 13

**Type**: Content
**Filename**: 07-slide-three-perspectives.png

// NARRATIVE GOAL
Introduce the innovative three-perspective narrative system.

// KEY CONTENT
Headline: 三重视角角色叙事
Sub-headline: 同一画卷，三种声音
Body:
- 文人 · 沈鹤年（二十四岁，苏州府秀才）— 青蓝 #4A7C8F
- 商人 · 陈瑞丰（三十七岁，丝绸洋货商）— 琥珀 #C17817
- 百姓 · 阿桂（十九岁，山塘街面馆帮工）— 泥褐 #8B6F4E
- 左侧竖排叙事卡片随滚动位置 & 视角自动切换

// VISUAL
Three vintage portrait cards arranged side by side, each with a different colored seal stamp (blue, amber, brown). Each card shows a silhouette figure in period-appropriate clothing. Decorative borders distinguish each character.

// LAYOUT
Three equal columns, each featuring one character card with name, title, age, and color accent.

---

## Slide 8 of 13

**Type**: Content
**Filename**: 08-slide-cultural-hotspots.png

// NARRATIVE GOAL
Showcase the cultural scenes that bring the painting to life.

// KEY CONTENT
Headline: 文化热点
Sub-headline: 12个可交互文化场景，涵盖四大主题
Body:
- 科举教育：灵岩山雅集、山塘义学、府衙府试
- 戏曲丝竹：木渎三弦弹唱、遂初园堂会、春台社戏、阊门走绳索
- 婚礼习俗：木渎迎亲船队、黄鹂坊桥婚礼
- 园林胜景：怡老园、山塘花市、虎丘云岩寺

// VISUAL
A vintage collector's display board with four categories arranged in quadrants. Each category has a small antique icon (scroll for education, musical note for opera, double happiness symbol for wedding, garden gate for scenery). Red pulse dots mark interactive hotspots.

// LAYOUT
2x2 grid layout, each quadrant representing one cultural theme with its items listed below.

---

## Slide 9 of 13

**Type**: Content
**Filename**: 09-slide-interactive-games.png

// NARRATIVE GOAL
Highlight the playful interactive elements that engage users.

// KEY CONTENT
Headline: 互动游戏
Sub-headline: 让古画"活"起来
Body:
- 近观：Canvas圆形放大镜（180px，2.5x放大），实时裁切渲染
- 寻迹：找图游戏，百分比坐标判定，绿色/红色反馈
- 看图识俗：全屏iframe小游戏，PostMessage通信
- NPC陆小顺：滚动至末尾触发，打字机效果对话

// VISUAL
Vintage optical instruments and game pieces — a brass magnifying glass, a compass, playing cards with Chinese characters, and a vintage speech bubble card. Arranged as a collector's tabletop display.

// LAYOUT
Four antique-style cards or instrument illustrations arranged in a row, each with a label and brief description below.

---

## Slide 10 of 13

**Type**: Content
**Filename**: 10-slide-data-design.png

// NARRATIVE GOAL
Demonstrate the academic rigor and data richness behind the experience.

// KEY CONTENT
Headline: 数据设计
Sub-headline: 基于学术文献的严谨数据支撑
Body:
- 数据来源：范金民《〈姑苏繁华图〉：清代苏州城市文化繁荣的写照》
- 8个主场景 | 36条行业数据 | 15类行业大类
- 4类14项文化场景 | 12个文化热点坐标
- 4位角色 | 42条文化场景故事（14×3视角）
- 5关寻迹游戏数据

// VISUAL
An antique ledger or accounting book spread open, with neat columns of data. Hand-drawn charts and tally marks. Red ink annotations highlighting key numbers. Brass ruler and inkwell as decorative elements.

// LAYOUT
Spreadsheet-like layout rendered in vintage style, with data categories in rows and statistics in columns.

---

## Slide 11 of 13

**Type**: Content
**Filename**: 11-slide-visual-design.png

// NARRATIVE GOAL
Reveal the thoughtful visual design system inspired by traditional Chinese aesthetics.

// KEY CONTENT
Headline: 视觉设计
Sub-headline: 从传统绘画中汲取灵感
Body:
- 宣纸底色 #f5f0e6 | 朱砂红主色调 #B22222
- 金色辅助 #D4AF37 | 墨色文字 #2F4F4F
- 标题：Noto Serif SC（宋体风格）
- 正文：Noto Sans SC | 数据：DM Sans
- 水墨粒子、热点呼吸、竖向叙事滑入、打字机效果

// VISUAL
A vintage color swatch card showing the five primary colors as ink wash samples on rice paper. Below, small illustrations showing each animation effect (ink drops, breathing pulse, sliding card, typing cursor).

// LAYOUT
Color palette displayed as traditional ink wash swatches at top (50%), with animation descriptions in vintage specimen cards below.

---

## Slide 12 of 13

**Type**: Content
**Filename**: 12-slide-innovation.png

// NARRATIVE GOAL
Articulate what makes this project academically and creatively valuable.

// KEY CONTENT
Headline: 学术价值与创新点
Body:
- 基于学术文献的严谨数据：260余家市招行业分类统计
- 三重叙事视角创新：同一画卷呈现多层次文化解读
- 数字人文方法论：从"观看对象"到"体验空间"
- 交互式民俗还原：评弹、社戏、婚礼、科举的活态呈现
- 纯前端技术：无后端依赖，可直接静态部署

// VISUAL
A vintage award certificate or diploma-style layout with ornate borders. A large red seal stamp marking "创新". Decorative corner flourishes. Text arranged in elegant paragraphs with drop caps.

// LAYOUT
Centered text block with decorative border frame. Red seal accent. Drop cap for first paragraph.

---

## Slide 13 of 13

**Type**: Back Cover
**Filename**: 13-slide-back-cover.png

// NARRATIVE GOAL
Close with a memorable, contemplative image that reinforces the bridge between past and present.

// KEY CONTENT
Headline: 古今对话，数字新生
Sub-headline: 让千年画卷在数字时代焕发新的生命力
Body:
- 后续方向：视频场景、国际化、深度缩放、古今对比、热力图、角色动画

// VISUAL
A Chinese handscroll painting fading from traditional ink wash on the right to digital wireframe/pixel elements on the left, symbolizing the transformation from traditional to digital. Aged parchment texture throughout. Small red seal stamp.

// LAYOUT
Full-bleed image composition. Title centered in lower third with gradient overlay. Subtitle below. Clean, impactful, contemplative.
