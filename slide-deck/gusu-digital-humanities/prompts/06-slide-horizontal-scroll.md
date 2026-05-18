Create a presentation slide image following these guidelines:

## Image Specifications
- **Type**: Presentation slide
- **Aspect Ratio**: 16:9 (landscape)
- **Style**: Professional slide deck

## Core Principles
- Hand-drawn quality throughout - NO realistic or photographic elements
- NO slide numbers, page numbers, footers, headers, or logos
- Clean, uncluttered layouts with clear visual hierarchy
- Each slide conveys ONE clear message

## Text Style (CRITICAL)
- **ALL text MUST match the designated style exactly**
- Title text: Large, bold, immediately readable
- Body text: Clear, legible, appropriate sizing
- Max 3-4 text elements per slide
- Use Chinese for all text elements

## Language
- Use Chinese for all text elements

---

## STYLE_INSTRUCTIONS

Design Aesthetic: Nostalgic vintage aesthetic with aged paper textures and historical document styling, evoking Qing dynasty scroll paintings and museum exhibits. Rich warm sepia tones with weathered textures.

Background:
  Texture: Heavy aged paper texture with subtle creases, worn edges, and rice paper grain
  Base Color: Aged Parchment (#F5E6D3)

Typography:
  Headlines: Classic elegant serif with historical character, bold and authoritative
  Body: Readable traditional serif for longer text

Color Palette:
  Primary Text: Dark Brown (#3D2914)
  Secondary Text: Medium Brown (#6B4423)
  Background: Aged Parchment (#F5E6D3)
  Accent 1: Cinnabar Red (#B22222)
  Accent 2: Gold (#D4AF37)
  Accent 3: Ink Black (#2F4F4F)

Visual Elements:
  - Antique Chinese scroll and map elements
  - Traditional seal stamps
  - Ink wash painting textures
  - Vintage image frames with ornate borders

Style Rules:
  Do: Apply consistent aged texture, use period-appropriate visual language, maintain warm sepia-toned palette
  Don't: Use modern digital styling, use cold or bright colors, add slide numbers

---

## SLIDE CONTENT

Slide 6 of 13
Type: Content
Filename: 06-slide-horizontal-scroll.png

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
