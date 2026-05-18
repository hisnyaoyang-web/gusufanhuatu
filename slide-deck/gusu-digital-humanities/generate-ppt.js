const PptxGenJS = require("pptxgenjs");
const path = require("path");

const pptx = new PptxGenJS();
const projectRoot = path.join(__dirname, "../..");

// 项目色彩系统
const COLORS = {
  paper: "F5F0E6",
  cinnabar: "B22222",
  gold: "D4AF37",
  ink: "2F4F4F",
  darkBrown: "3D2914",
  mediumBrown: "6B4423",
  white: "FFFFFF",
  black: "000000",
};

// 设置演示文稿属性
pptx.title = "《姑苏繁华图》数字人文活化展 — 项目介绍";
pptx.subject = "文化数据可视化课程作业";
pptx.author = "项目团队";

// 定义颜色
pptx.defineSlideMaster({
  title: "MASTER_SLIDE",
  background: { color: COLORS.paper },
});

// 辅助函数：创建带背景的幻灯片
function createSlide(title, subtitle = "") {
  const slide = pptx.addSlide({ masterName: "MASTER_SLIDE" });
  // 顶部装饰条
  slide.addShape(pptx.shapes.RECTANGLE, {
    x: 0, y: 0, w: "100%", h: 0.15,
    fill: { color: COLORS.cinnabar },
  });
  // 底部装饰条
  slide.addShape(pptx.shapes.RECTANGLE, {
    x: 0, y: "95%", w: "100%", h: 0.15,
    fill: { color: COLORS.cinnabar },
  });
  return slide;
}

// ===== Slide 1: 封面 =====
const slide1 = pptx.addSlide({ masterName: "MASTER_SLIDE" });
slide1.background = { path: path.join(projectRoot, "assets/images/intro_bg.jpg") };
// 暗色遮罩
slide1.addShape(pptx.shapes.RECTANGLE, {
  x: 0, y: 0, w: "100%", h: "100%",
  fill: { color: "000000", transparency: 40 },
});
slide1.addText("姑苏繁华图", {
  x: 0, y: "35%", w: "100%", h: 1.2,
  fontSize: 54, fontFace: "Noto Serif SC", color: COLORS.gold,
  bold: true, align: "center", valign: "middle",
});
slide1.addText("数字人文活化展 · 项目介绍", {
  x: 0, y: "50%", w: "100%", h: 0.6,
  fontSize: 24, fontFace: "Noto Sans SC", color: COLORS.white,
  align: "center", valign: "middle",
});
slide1.addText("清 · 徐扬 · 乾隆二十四年（1759）", {
  x: 0, y: "58%", w: "100%", h: 0.4,
  fontSize: 16, fontFace: "Noto Sans SC", color: COLORS.gold,
  align: "center", valign: "middle",
});
// 红色印章装饰
slide1.addShape(pptx.shapes.RECTANGLE, {
  x: "45%", y: "68%", w: "10%", h: 0.4,
  fill: { color: COLORS.cinnabar },
  line: { color: COLORS.gold, width: 2 },
});
slide1.addText("徐揚", {
  x: "45%", y: "68%", w: "10%", h: 0.4,
  fontSize: 18, fontFace: "Noto Serif SC", color: COLORS.white,
  bold: true, align: "center", valign: "middle",
});

// ===== Slide 2: 项目定位 =====
const slide2 = createSlide();
slide2.addText("项目定位", {
  x: 0.5, y: 0.5, w: "90%", h: 0.8,
  fontSize: 36, fontFace: "Noto Serif SC", color: COLORS.cinnabar,
  bold: true,
});
slide2.addText("基于数字人文方法的交互式展示网站", {
  x: 0.5, y: 1.2, w: "90%", h: 0.5,
  fontSize: 20, fontFace: "Noto Sans SC", color: COLORS.ink,
});
const s2bullet = [
  { text: "对清代宫廷画家徐扬《姑苏繁华图》进行动态重构与语义增强", options: { fontSize: 18, color: COLORS.darkBrown } },
  { text: "实现传统绘画的「活化表达」", options: { fontSize: 18, color: COLORS.darkBrown } },
  { text: "", options: { fontSize: 14 } },
  { text: "核心目标", options: { fontSize: 20, color: COLORS.cinnabar, bold: true } },
  { text: "沉浸式浏览 — GSAP ScrollTrigger 驱动的横向长卷滚动体验", options: { fontSize: 16, color: COLORS.mediumBrown } },
  { text: "角色叙事 — 用户选择「文人 / 商人 / 百姓」三重身份体验画卷故事", options: { fontSize: 16, color: COLORS.mediumBrown } },
  { text: "文化热点 — 12 个可交互文化场景热点，含角色叙事、行业数据、场景详情", options: { fontSize: 16, color: COLORS.mediumBrown } },
  { text: "互动游戏 — 「近观」放大镜、「寻迹」找图、「看图识俗」等互动功能", options: { fontSize: 16, color: COLORS.mediumBrown } },
  { text: "数据可视化 — D3.js 呈现画中蕴含的商业、建筑、人口等文化数据", options: { fontSize: 16, color: COLORS.mediumBrown } },
];
slide2.addText(s2bullet, {
  x: 0.5, y: 1.8, w: "90%", h: 4.5,
  fontFace: "Noto Sans SC", valign: "top",
  bullet: { type: "number", color: COLORS.gold },
  lineSpacing: 28,
});

// ===== Slide 3: 画作基本信息 =====
const slide3 = createSlide();
slide3.addText("画作基本信息", {
  x: 0.5, y: 0.5, w: "90%", h: 0.8,
  fontSize: 36, fontFace: "Noto Serif SC", color: COLORS.cinnabar,
  bold: true,
});
slide3.addText("《盛世滋生图》— 辽宁省博物馆藏", {
  x: 0.5, y: 1.2, w: "90%", h: 0.4,
  fontSize: 18, fontFace: "Noto Sans SC", color: COLORS.ink,
});
const s3left = [
  { text: "作者：徐扬（字云亭，苏州府吴县人）", options: { fontSize: 18, color: COLORS.darkBrown } },
  { text: "年代：清·乾隆二十四年（1759）", options: { fontSize: 18, color: COLORS.darkBrown } },
  { text: "材质：纸本设色", options: { fontSize: 18, color: COLORS.darkBrown } },
  { text: "尺寸：全长 1241 厘米，画心高 39 厘米", options: { fontSize: 18, color: COLORS.darkBrown } },
];
const s3right = [
  { text: "人物约 12,000 余人", options: { fontSize: 18, color: COLORS.darkBrown } },
  { text: "船只约 400 条", options: { fontSize: 18, color: COLORS.darkBrown } },
  { text: "建筑约 2,140 余栋", options: { fontSize: 18, color: COLORS.darkBrown } },
  { text: "桥梁约 50 余座", options: { fontSize: 18, color: COLORS.darkBrown } },
  { text: "可辨认市招约 260 余家", options: { fontSize: 18, color: COLORS.darkBrown } },
];
slide3.addText(s3left, {
  x: 0.5, y: 2.0, w: "45%", h: 3.0,
  fontFace: "Noto Sans SC", valign: "top", lineSpacing: 36,
});
slide3.addText(s3right, {
  x: "52%", y: 2.0, w: "45%", h: 3.5,
  fontFace: "Noto Sans SC", valign: "top", lineSpacing: 36,
  bullet: { type: "number", color: COLORS.cinnabar },
});
// 地理路线
slide3.addShape(pptx.shapes.RECTANGLE, {
  x: 0.5, y: 5.0, w: "90%", h: 0.8,
  fill: { color: COLORS.gold, transparency: 80 },
  line: { color: COLORS.gold, width: 1 },
});
slide3.addText("地理路线：天平山 → 灵岩山 → 木渎镇 → 石湖 → 胥门 → 阊门 → 山塘街 → 虎丘", {
  x: 0.5, y: 5.0, w: "90%", h: 0.8,
  fontSize: 16, fontFace: "Noto Sans SC", color: COLORS.darkBrown,
  align: "center", valign: "middle",
});

// ===== Slide 4: 技术架构 =====
const slide4 = createSlide();
slide4.addText("技术架构", {
  x: 0.5, y: 0.5, w: "90%", h: 0.8,
  fontSize: 36, fontFace: "Noto Serif SC", color: COLORS.cinnabar,
  bold: true,
});
slide4.addText("纯静态部署，无构建工具，无后端依赖", {
  x: 0.5, y: 1.2, w: "90%", h: 0.4,
  fontSize: 18, fontFace: "Noto Sans SC", color: COLORS.ink,
});
const techData = [
  ["模块", "技术", "来源"],
  ["页面结构", "HTML5", "—"],
  ["样式", "CSS3（变量、backdrop-filter、animation）", "—"],
  ["交互逻辑", "原生 JavaScript（ES6+，IIFE 模块）", "—"],
  ["滚动动画", "GSAP + ScrollTrigger", "3.12.5 CDN"],
  ["数据可视化", "D3.js", "7.9.0 CDN"],
  ["字体", "Noto Serif SC / Noto Sans SC / DM Sans", "Google Fonts"],
];
slide4.addTable(techData, {
  x: 0.5, y: 1.8, w: "90%", h: 3.5,
  fontFace: "Noto Sans SC", fontSize: 16,
  color: COLORS.darkBrown,
  border: { type: "solid", pt: 1, color: COLORS.gold },
  fill: { color: COLORS.paper },
  colW: [2.5, 5.0, 2.5],
  align: "center", valign: "middle",
});

// ===== Slide 5: 整体浏览流程 =====
const slide5 = createSlide();
slide5.addText("整体浏览流程", {
  x: 0.5, y: 0.5, w: "90%", h: 0.8,
  fontSize: 36, fontFace: "Noto Serif SC", color: COLORS.cinnabar,
  bold: true,
});
const flowItems = [
  "开场水墨动画 → 身份选择 → 长卷横向滚动浏览",
  "顶部场景标签自动切换",
  "左侧竖向叙事卡片随视角自动切换",
  "底部导航栏：进度条、角色信息、近观、寻迹",
  "附加功能：文化热点放大、详情弹窗、NPC对话、游戏叠加层",
];
slide5.addText(flowItems.map(t => ({ text: t, options: { fontSize: 20, color: COLORS.darkBrown } })), {
  x: 0.5, y: 1.5, w: "90%", h: 4.5,
  fontFace: "Noto Sans SC", valign: "top",
  bullet: { type: "number", color: COLORS.cinnabar },
  lineSpacing: 40,
});

// ===== Slide 6: 横向长卷沉浸浏览 =====
const slide6 = createSlide();
slide6.addText("横向长卷沉浸浏览", {
  x: 0.5, y: 0.5, w: "90%", h: 0.8,
  fontSize: 36, fontFace: "Noto Serif SC", color: COLORS.cinnabar,
  bold: true,
});
slide6.addText('"竖向滚动驱动横向位移"', {
  x: 0.5, y: 1.2, w: "90%", h: 0.4,
  fontSize: 18, fontFace: "Noto Sans SC", color: COLORS.ink, italic: true,
});
const scrollItems = [
  "页面总高度 = 100vh + 画卷总宽度 − 视口宽度",
  "GSAP ScrollTrigger 将画面 pin 在视口内",
  "随垂直滚动，画卷自右向左徐徐展开",
  "10张切片：tile10(虎丘) → tile01(天平山)",
  "scrub: 0.5 提供平滑跟随效果",
];
slide6.addText(scrollItems.map(t => ({ text: t, options: { fontSize: 20, color: COLORS.darkBrown } })), {
  x: 0.5, y: 1.8, w: "90%", h: 4.0,
  fontFace: "Noto Sans SC", valign: "top",
  bullet: { type: "number", color: COLORS.gold },
  lineSpacing: 38,
});

// ===== Slide 7: 三重视角角色叙事 =====
const slide7 = createSlide();
slide7.addText("三重视角角色叙事", {
  x: 0.5, y: 0.5, w: "90%", h: 0.8,
  fontSize: 36, fontFace: "Noto Serif SC", color: COLORS.cinnabar,
  bold: true,
});
slide7.addText("同一画卷，三种声音", {
  x: 0.5, y: 1.2, w: "90%", h: 0.4,
  fontSize: 18, fontFace: "Noto Sans SC", color: COLORS.ink, italic: true,
});
// 三个角色卡片
const chars = [
  { name: "沈鹤年", title: "苏州府秀才", age: "二十四", color: "4A7C8F", img: "characters/wenren/shen/shen-image.jpg" },
  { name: "陈瑞丰", title: "丝绸洋货商", age: "三十七", color: "C17817", img: "characters/shangren/chen.jpg" },
  { name: "阿桂", title: "山塘街面馆帮工", age: "十九", color: "8B6F4E", img: "characters/pingmin/gui.jpg" },
];
chars.forEach((ch, i) => {
  const x = 0.5 + i * 3.2;
  // 卡片背景
  slide7.addShape(pptx.shapes.RECTANGLE, {
    x: x, y: 2.0, w: 2.8, h: 3.8,
    fill: { color: COLORS.white, transparency: 30 },
    line: { color: ch.color, width: 2 },
  });
  // 角色图片
  slide7.addImage({
    path: path.join(projectRoot, ch.img),
    x: x + 0.4, y: 2.2, w: 2.0, h: 2.0,
    sizing: { type: "cover", w: 2.0, h: 2.0 },
  });
  // 名字
  slide7.addText(ch.name, {
    x: x, y: 4.3, w: 2.8, h: 0.4,
    fontSize: 20, fontFace: "Noto Serif SC", color: ch.color,
    bold: true, align: "center", valign: "middle",
  });
  // 身份
  slide7.addText(ch.title, {
    x: x, y: 4.7, w: 2.8, h: 0.3,
    fontSize: 14, fontFace: "Noto Sans SC", color: COLORS.darkBrown,
    align: "center", valign: "middle",
  });
  // 年龄
  slide7.addText(`年龄：${ch.age}`, {
    x: x, y: 5.0, w: 2.8, h: 0.3,
    fontSize: 12, fontFace: "Noto Sans SC", color: COLORS.mediumBrown,
    align: "center", valign: "middle",
  });
});

// ===== Slide 8: 文化热点 =====
const slide8 = createSlide();
slide8.addText("文化热点", {
  x: 0.5, y: 0.5, w: "90%", h: 0.8,
  fontSize: 36, fontFace: "Noto Serif SC", color: COLORS.cinnabar,
  bold: true,
});
slide8.addText("12个可交互文化场景，涵盖四大主题", {
  x: 0.5, y: 1.2, w: "90%", h: 0.4,
  fontSize: 18, fontFace: "Noto Sans SC", color: COLORS.ink,
});
const culturalData = [
  ["科举教育", "戏曲丝竹", "婚礼习俗", "园林胜景"],
  ["灵岩山雅集", "木渎三弦弹唱", "木渎迎亲船队", "怡老园"],
  ["山塘义学", "遂初园堂会", "黄鹂坊桥婚礼", "山塘花市"],
  ["府衙府试", "春台社戏", "", "虎丘云岩寺"],
  ["", "阊门走绳索", "", ""],
];
slide8.addTable(culturalData, {
  x: 0.5, y: 1.8, w: "90%", h: 3.5,
  fontFace: "Noto Sans SC", fontSize: 16,
  color: COLORS.darkBrown,
  border: { type: "solid", pt: 1, color: COLORS.gold },
  fill: { color: COLORS.paper },
  colW: [2.5, 2.5, 2.5, 2.5],
  align: "center", valign: "middle",
});

// ===== Slide 9: 互动游戏 =====
const slide9 = createSlide();
slide9.addText("互动游戏", {
  x: 0.5, y: 0.5, w: "90%", h: 0.8,
  fontSize: 36, fontFace: "Noto Serif SC", color: COLORS.cinnabar,
  bold: true,
});
slide9.addText('让古画「活」起来', {
  x: 0.5, y: 1.2, w: "90%", h: 0.4,
  fontSize: 18, fontFace: "Noto Sans SC", color: COLORS.ink, italic: true,
});
const gameItems = [
  "近观：Canvas 圆形放大镜（180px，2.5x 放大），实时裁切渲染",
  "寻迹：找图游戏，百分比坐标判定，绿色/红色反馈",
  "看图识俗：全屏 iframe 小游戏，PostMessage 通信",
  "NPC 陆小顺：滚动至末尾触发，打字机效果对话",
];
slide9.addText(gameItems.map(t => ({ text: t, options: { fontSize: 20, color: COLORS.darkBrown } })), {
  x: 0.5, y: 1.8, w: "90%", h: 4.0,
  fontFace: "Noto Sans SC", valign: "top",
  bullet: { type: "number", color: COLORS.cinnabar },
  lineSpacing: 40,
});

// ===== Slide 10: 数据设计 =====
const slide10 = createSlide();
slide10.addText("数据设计", {
  x: 0.5, y: 0.5, w: "90%", h: 0.8,
  fontSize: 36, fontFace: "Noto Serif SC", color: COLORS.cinnabar,
  bold: true,
});
slide10.addText("基于学术文献的严谨数据支撑", {
  x: 0.5, y: 1.2, w: "90%", h: 0.4,
  fontSize: 18, fontFace: "Noto Sans SC", color: COLORS.ink,
});
const dataItems = [
  "数据来源：范金民《〈姑苏繁华图〉：清代苏州城市文化繁荣的写照》",
  "8 个主场景 | 36 条行业数据 | 15 类行业大类",
  "4 类 14 项文化场景 | 12 个文化热点坐标",
  "4 位角色 | 42 条文化场景故事（14×3 视角）",
  "5 关寻迹游戏数据",
];
slide10.addText(dataItems.map(t => ({ text: t, options: { fontSize: 20, color: COLORS.darkBrown } })), {
  x: 0.5, y: 1.8, w: "90%", h: 4.0,
  fontFace: "Noto Sans SC", valign: "top",
  bullet: { type: "number", color: COLORS.gold },
  lineSpacing: 40,
});

// ===== Slide 11: 视觉设计 =====
const slide11 = createSlide();
slide11.addText("视觉设计", {
  x: 0.5, y: 0.5, w: "90%", h: 0.8,
  fontSize: 36, fontFace: "Noto Serif SC", color: COLORS.cinnabar,
  bold: true,
});
slide11.addText("从传统绘画中汲取灵感", {
  x: 0.5, y: 1.2, w: "90%", h: 0.4,
  fontSize: 18, fontFace: "Noto Sans SC", color: COLORS.ink, italic: true,
});
// 色彩方块
const colors = [
  { name: "宣纸底色", hex: "f5f0e6", label: "#f5f0e6" },
  { name: "朱砂红", hex: "B22222", label: "#B22222" },
  { name: "金色", hex: "D4AF37", label: "#D4AF37" },
  { name: "墨色", hex: "2F4F4F", label: "#2F4F4F" },
];
colors.forEach((c, i) => {
  const x = 0.5 + i * 2.5;
  slide11.addShape(pptx.shapes.RECTANGLE, {
    x: x, y: 2.0, w: 1.8, h: 1.5,
    fill: { color: c.hex },
    line: { color: COLORS.gold, width: 1 },
  });
  slide11.addText(c.name, {
    x: x, y: 3.6, w: 1.8, h: 0.3,
    fontSize: 14, fontFace: "Noto Sans SC", color: COLORS.darkBrown,
    align: "center", valign: "middle",
  });
  slide11.addText(c.label, {
    x: x, y: 3.9, w: 1.8, h: 0.3,
    fontSize: 12, fontFace: "DM Sans", color: COLORS.mediumBrown,
    align: "center", valign: "middle",
  });
});
const fontItems = [
  "标题：Noto Serif SC（宋体风格）",
  "正文：Noto Sans SC",
  "数据：DM Sans",
  "水墨粒子、热点呼吸、竖向叙事滑入、打字机效果",
];
slide11.addText(fontItems.map(t => ({ text: t, options: { fontSize: 18, color: COLORS.darkBrown } })), {
  x: 0.5, y: 4.4, w: "90%", h: 2.0,
  fontFace: "Noto Sans SC", valign: "top",
  bullet: { type: "number", color: COLORS.cinnabar },
  lineSpacing: 32,
});

// ===== Slide 12: 学术价值与创新点 =====
const slide12 = createSlide();
slide12.addText("学术价值与创新点", {
  x: 0.5, y: 0.5, w: "90%", h: 0.8,
  fontSize: 36, fontFace: "Noto Serif SC", color: COLORS.cinnabar,
  bold: true,
});
const innovationItems = [
  "基于学术文献的严谨数据：260 余家市招行业分类统计",
  "三重叙事视角创新：同一画卷呈现多层次文化解读",
  "数字人文方法论：从「观看对象」到「体验空间」",
  "交互式民俗还原：评弹、社戏、婚礼、科举的活态呈现",
  "纯前端技术：无后端依赖，可直接静态部署",
];
slide12.addText(innovationItems.map(t => ({ text: t, options: { fontSize: 20, color: COLORS.darkBrown } })), {
  x: 0.5, y: 1.5, w: "90%", h: 4.5,
  fontFace: "Noto Sans SC", valign: "top",
  bullet: { type: "number", color: COLORS.gold },
  lineSpacing: 40,
});

// ===== Slide 13: 尾页 =====
const slide13 = pptx.addSlide({ masterName: "MASTER_SLIDE" });
slide13.background = { path: path.join(projectRoot, "assets/images/intro_bg.jpg") };
slide13.addShape(pptx.shapes.RECTANGLE, {
  x: 0, y: 0, w: "100%", h: "100%",
  fill: { color: "000000", transparency: 50 },
});
slide13.addText("古今对话，数字新生", {
  x: 0, y: "40%", w: "100%", h: 1.0,
  fontSize: 44, fontFace: "Noto Serif SC", color: COLORS.gold,
  bold: true, align: "center", valign: "middle",
});
slide13.addText("让千年画卷在数字时代焕发新的生命力", {
  x: 0, y: "52%", w: "100%", h: 0.6,
  fontSize: 20, fontFace: "Noto Sans SC", color: COLORS.white,
  align: "center", valign: "middle",
});
const futureItems = [
  "视频场景 | 国际化 | 深度缩放 | 古今对比 | 热力图 | 角色动画",
];
slide13.addText(futureItems.map(t => ({ text: t, options: { fontSize: 16, color: COLORS.gold } })), {
  x: 0, y: "62%", w: "100%", h: 0.8,
  fontFace: "Noto Sans SC", align: "center", valign: "top",
});

// 保存
const outputPath = path.join(__dirname, "gusu-digital-humanities.pptx");
pptx.writeFile({ fileName: outputPath })
  .then(() => {
    console.log(`PPT generated: ${outputPath}`);
  })
  .catch((err) => {
    console.error("Error:", err);
    process.exit(1);
  });
