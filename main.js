/**
 * 姑苏繁华图 — 主逻辑
 * GSAP 横向滚动 + 缩放 + D3 交互图表 + 视角叙事 + 场景联动
 */
(function () {
  'use strict';

  // ─── 全局状态 ─────────────────────────────────────
  let currentPerspective = 'scholar';
  let currentScene = null;
  let currentScrollProgress = 0;
  let npcTriggered = false; // 陆小顺是否已触发

  // 缩放状态（叠加层）
  let overlayDrag = { active: false, lastX: 0, lastY: 0, tx: 0, ty: 0 };

  // 弹窗状态
  let modalScene = null;

  // ─── DOM 缓存 ─────────────────────────────────────
  const $ = (sel) => document.querySelector(sel);
  const $$ = (sel) => document.querySelectorAll(sel);

  const dom = {};

  function cacheDom() {
    dom.intro = $('#intro');
    dom.introCanvas = $('#intro-canvas');
    dom.paintingSection = $('#painting-section');
    dom.paintingContainer = $('#paintingContainer');
    dom.zoomWrapper = $('#zoom-wrapper');
    dom.hotspotsContainer = $('#hotspotsContainer');
    dom.progressTrack = $('#progressTrack');
    dom.progressFill = $('#progressFill');
    dom.sceneMarkers = $('#sceneMarkers');
    dom.sceneLabel = $('#sceneLabel');
    dom.sceneLabelText = $('#sceneLabelText');
    dom.sceneLabelTag = $('#sceneLabelTag');
    dom.narrativeCard = $('#narrative-card');
    dom.narrativeSceneName = $('#narrativeSceneName');
    dom.narrativeText = $('#narrativeText');
    dom.detailModal = $('#detail-modal');
    dom.modalBackdrop = $('#modalBackdrop');
    dom.modalClose = $('#modalClose');
    dom.modalTitle = $('#modalTitle');
    dom.modalTag = $('#modalTag');
    dom.modalNarrative = $('#modalNarrative');
    dom.modalNarrativeText = $('#modalNarrativeText');
    dom.modalStats = $('#modalStats');
    dom.modalCommerce = $('#modalCommerce');
    dom.modalCultural = $('#modalCultural');
    dom.modalJump = $('#modalJump');
    dom.roleIcon = $('#roleIcon');
    dom.roleName = $('#roleName');
    dom.roleTitle = $('#roleTitle');
    dom.zoomOverlay = $('#zoom-overlay');
    dom.zoomOverlayBackdrop = $('#zoomOverlayBackdrop');
    dom.zoomOverlayClose = $('#zoomOverlayClose');
    dom.zoomOverlayContent = $('#zoomOverlayContent');
    dom.zoomOverlaySceneName = $('#zoomOverlaySceneName');
    dom.zoomOverlayStory = $('#zoomOverlayStory');

    // 角色面板
    dom.roleLabel = $('#roleLabel');
    dom.rolePanel = $('#rolePanel');
    dom.rolePanelBackdrop = $('#rolePanelBackdrop');
    dom.rolePanelClose = $('#rolePanelClose');
    if (dom.roleLabel) {
      dom.roleLabel.style.cursor = 'pointer';
      dom.roleLabel.addEventListener('click', toggleRolePanel);
    }
    if (dom.rolePanelClose) dom.rolePanelClose.addEventListener('click', closeRolePanel);
    if (dom.rolePanelBackdrop) dom.rolePanelBackdrop.addEventListener('click', closeRolePanel);

    // 放大镜
    dom.magnifierBtn = $('#magnifierBtn');
    dom.magnifierLens = $('#magnifierLens');
    dom.paintingSection = $('#painting-section');

    // NPC 对话 & 游戏
    dom.npcDialog = $('#npc-dialog');
    dom.npcText = $('#npcText');
    dom.npcActions = $('#npcActions');
    dom.gameOverlay = $('#game-overlay');
    dom.gameFrame = $('#gameFrame');
    dom.gameOverlayClose = $('#gameOverlayClose');
  }

  // ═══════════════════════════════════════════════════
  //  1. 开场水墨动画（远山 + 云雾）
  // ═══════════════════════════════════════════════════
  function initIntro() {
    const canvas = dom.introCanvas;
    const ctx = canvas.getContext('2d');
    let animId;
    let mists = [];
    let startTime = Date.now();

    function resize() {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    }
    resize();
    window.addEventListener('resize', resize);

    // 远山轮廓：用多段正弦波叠加生成自然山脊线
    function drawMountainLayer(yBase, amplitude, freq, phase, color) {
      const w = canvas.width;
      const h = canvas.height;
      ctx.beginPath();
      ctx.moveTo(0, h);
      for (let x = 0; x <= w; x += 3) {
        const y = yBase
          - Math.sin(x * freq + phase) * amplitude
          - Math.sin(x * freq * 2.3 + phase * 1.7) * amplitude * 0.4
          - Math.sin(x * freq * 0.5 + phase * 0.3) * amplitude * 0.6;
        ctx.lineTo(x, y);
      }
      ctx.lineTo(w, h);
      ctx.closePath();
      ctx.fillStyle = color;
      ctx.fill();
    }

    // 云雾粒子
    class Mist {
      constructor() { this.reset(); }
      reset() {
        this.x = Math.random() * canvas.width;
        this.y = canvas.height * (0.35 + Math.random() * 0.35);
        this.r = 60 + Math.random() * 140;
        this.alpha = 0.015 + Math.random() * 0.025;
        this.vx = (Math.random() - 0.5) * 0.4;
      }
      update() {
        this.x += this.vx;
        if (this.x < -this.r * 2 || this.x > canvas.width + this.r * 2) this.reset();
      }
      draw() {
        const g = ctx.createRadialGradient(this.x, this.y, 0, this.x, this.y, Math.max(1, this.r));
        g.addColorStop(0, `rgba(180,175,165,${this.alpha})`);
        g.addColorStop(1, 'rgba(180,175,165,0)');
        ctx.fillStyle = g;
        ctx.beginPath();
        ctx.arc(this.x, this.y, Math.max(1, this.r), 0, Math.PI * 2);
        ctx.fill();
      }
    }

    for (let i = 0; i < 15; i++) mists.push(new Mist());

    function animate() {
      const t = (Date.now() - startTime) / 1000;
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      // 远山（最远，最淡）
      drawMountainLayer(canvas.height * 0.52, canvas.height * 0.08, 0.0025, t * 0.02, 'rgba(45,50,55,0.2)');
      // 中山
      drawMountainLayer(canvas.height * 0.62, canvas.height * 0.1, 0.004, t * 0.03 + 1, 'rgba(35,38,42,0.35)');
      // 近山（最近，最深）
      drawMountainLayer(canvas.height * 0.72, canvas.height * 0.07, 0.006, t * 0.04 + 2.5, 'rgba(25,28,32,0.5)');

      // 云雾
      mists.forEach(m => { m.update(); m.draw(); });

      animId = requestAnimationFrame(animate);
    }
    animate();

    function enter() {
      cancelAnimationFrame(animId);
      dom.intro.classList.add('fade-out');
      setTimeout(() => {
        dom.intro.style.display = 'none';
        // 立即显示身份选择（已有黑底，无缝过渡）
        showIdentitySelection();
      }, 1200);
    }

    dom.intro.addEventListener('click', enter);
    dom.intro.addEventListener('keydown', (e) => {
      if (e.key === 'Enter' || e.key === ' ') enter();
    });
  }

  // ─── 身份选择 ──────────────────────────────────────
  function showIdentitySelection() {
    const container = $('#identityCards');
    container.innerHTML = '';

    ['scholar', 'merchant', 'commoner'].forEach(key => {
      const ch = CHARACTERS[key];
      const card = document.createElement('div');
      card.className = 'identity-card';
      card.dataset.perspective = key;
      card.innerHTML = `
        <div class="identity-card-icon"><img src="${ch.image}" alt="${ch.name}"></div>
        <div class="identity-card-name">${ch.name}</div>
        <div class="identity-card-title">${ch.title}</div>
        <div class="identity-card-age">年龄：${ch.age}</div>
        <div class="identity-card-summary">${ch.summary}</div>
        <div class="identity-card-hover-detail">${ch.bio}</div>
      `;
      card.addEventListener('click', () => selectIdentity(key));
      container.appendChild(card);
    });

    $('#identity-selection').classList.add('show');
  }

  function selectIdentity(perspective) {
    currentPerspective = perspective;
    const ch = CHARACTERS[perspective];

    // 设置底部角色标签（用图片代替emoji）
    dom.roleIcon.innerHTML = `<img src="${ch.image}" alt="${ch.name}" style="width:22px;height:22px;border-radius:50%;object-fit:cover">`;
    dom.roleName.textContent = ch.name;
    dom.roleTitle.textContent = ch.title;

    // 应用热点高亮
    applyPerspectiveHighlight();

    // 淡出身份选择
    const el = $('#identity-selection');
    el.classList.add('fade-out');
    setTimeout(() => {
      el.style.display = 'none';
      initScroll();
    }, 800);
  }

  // ─── 角色信息面板 ──────────────────────────────────────
  function toggleRolePanel() {
    if (!currentPerspective) return;
    const panel = dom.rolePanel;
    if (!panel) return;
    if (panel.classList.contains('show')) {
      closeRolePanel();
    } else {
      const ch = CHARACTERS[currentPerspective];
      panel.querySelector('.rp-image').src = ch.image;
      panel.querySelector('.rp-image').alt = ch.name;
      panel.querySelector('.rp-name').textContent = ch.name;
      panel.querySelector('.rp-title').textContent = ch.title;
      panel.querySelector('.rp-age').textContent = '年龄：' + ch.age;
      panel.querySelector('.rp-bio').textContent = ch.bio;
      panel.classList.add('show');
    }
  }

  function closeRolePanel() {
    const panel = dom.rolePanel;
    if (panel) panel.classList.remove('show');
  }

  // ═══════════════════════════════════════════════════
  //  2. GSAP 横向滚动
  // ═══════════════════════════════════════════════════
  function initScroll() {
    gsap.registerPlugin(ScrollTrigger);

    const container = dom.paintingContainer;
    const images = container.querySelectorAll('img');
    let loaded = 0;
    const total = images.length;

    function onReady() {
      const totalWidth = dom.zoomWrapper.scrollWidth;
      const viewportWidth = window.innerWidth;
      const scrollDistance = totalWidth - viewportWidth;

      // 从右侧灵岩山开始滚动
      gsap.fromTo(container,
        { x: -scrollDistance },
        {
          x: 0,
          ease: 'none',
          scrollTrigger: {
            trigger: dom.paintingSection,
            start: 'top top',
            end: () => '+=' + scrollDistance,
            pin: true,
            scrub: 0.5,
            anticipatePin: 1,
            onUpdate: (self) => {
              currentScrollProgress = self.progress;
              updateProgress(self.progress);
              updateScene(self.progress);
            },
          },
        }
      );

      renderHotspots();
      renderSceneMarkers();

      // 画面就绪，隐藏加载遮罩
      window.scrollTo(0, 0);
      ScrollTrigger.refresh();
      const loader = document.getElementById('loading-screen');
      if (loader) loader.classList.add('done');
    }

    images.forEach((img) => {
      if (img.complete) { loaded++; }
      else {
        img.addEventListener('load', () => { loaded++; check(); });
        img.addEventListener('error', () => { loaded++; check(); });
      }
    });
    check();

    function check() { if (loaded >= total) onReady(); }
    setTimeout(() => { if (loaded < total) onReady(); }, 5000);
  }

  // ═══════════════════════════════════════════════════
  //  3. 放大叠加层
  // ═══════════════════════════════════════════════════
  const TILE_NAMES = ['10OK.jpg','09OK.jpg','08OK.jpg','07OK.jpg','06OK.jpg','05OK.jpg','04OK.jpg','03OK.jpg','02OK.jpg','01OK.jpg'];

  function showZoomOverlay(scene, culturalName) {
    const content = dom.zoomOverlayContent;
    content.innerHTML = '';

    // 创建图片条
    const strip = document.createElement('div');
    strip.className = 'zoom-img-strip';
    TILE_NAMES.forEach(name => {
      const img = document.createElement('img');
      img.src = 'assets/images/tiles/' + name;
      img.alt = '';
      img.draggable = false;
      strip.appendChild(img);
    });
    content.appendChild(strip);

    // 等图片加载后计算缩放
    const firstImg = strip.querySelector('img');
    function positionStrip() {
      const totalWidth = strip.scrollWidth;
      const frameW = content.clientWidth;
      const frameH = content.clientHeight;
      const scale = 2.5;

      // 场景点在未缩放strip中的像素位置
      const sx = totalWidth * scene.x / 100;
      const sy = frameH * scene.y / 100;

      // 让场景点居中在 frame 中
      const tx = frameW / 2 - sx * scale;
      const ty = frameH / 2 - sy * scale;

      overlayDrag.tx = tx;
      overlayDrag.ty = ty;

      strip.style.transition = 'none';
      strip.style.transform = `translate(${tx}px,${ty}px) scale(${scale})`;
      // 下一帧恢复 transition
      requestAnimationFrame(() => {
        strip.style.transition = '';
      });
    }

    if (firstImg && firstImg.complete) {
      positionStrip();
    } else if (firstImg) {
      firstImg.addEventListener('load', positionStrip);
      // 备用：即使图片没加载完也定位
      setTimeout(positionStrip, 500);
    }

    // 拖动逻辑
    overlayDrag.active = false;

    const frame = content.closest('.zoom-overlay-frame');

    frame.onmousedown = (e) => {
      if (e.target.closest('.zoom-overlay-close')) return;
      overlayDrag.active = true;
      overlayDrag.lastX = e.clientX;
      overlayDrag.lastY = e.clientY;
      e.preventDefault();
    };

    window.addEventListener('mousemove', onOverlayDrag);
    window.addEventListener('mouseup', onOverlayDragEnd);

    function onOverlayDrag(e) {
      if (!overlayDrag.active) return;
      overlayDrag.tx += e.clientX - overlayDrag.lastX;
      overlayDrag.ty += e.clientY - overlayDrag.lastY;
      overlayDrag.lastX = e.clientX;
      overlayDrag.lastY = e.clientY;
      strip.style.transition = 'none';
      strip.style.transform = `translate(${overlayDrag.tx}px,${overlayDrag.ty}px) scale(2.5)`;
    }

    function onOverlayDragEnd() {
      if (overlayDrag.active) {
        overlayDrag.active = false;
        strip.style.transition = '';
      }
    }

    // 存储清理函数
    dom.zoomOverlay._cleanup = () => {
      window.removeEventListener('mousemove', onOverlayDrag);
      window.removeEventListener('mouseup', onOverlayDragEnd);
      frame.onmousedown = null;
    };

    // 显示场景名
    dom.zoomOverlaySceneName.textContent = culturalName || '';

    // 显示故事荟（如果有对应文化场景名）
    dom.zoomOverlayStory.classList.remove('visible');
    dom.zoomOverlayStory.innerHTML = '';
    if (culturalName && CULTURAL_STORIES[culturalName]) {
      const storyData = CULTURAL_STORIES[culturalName];
      const char = CHARACTERS[currentPerspective];
      const text = storyData[currentPerspective];
      if (text) {
        let html = `<div class="story-title">${culturalName}</div>`;
        html += `<div>${text}</div>`;
        dom.zoomOverlayStory.innerHTML = html;
        setTimeout(() => dom.zoomOverlayStory.classList.add('visible'), 400);
      }
    }

    // 显示叠加层
    dom.zoomOverlay.classList.add('show');
  }

  function closeZoomOverlay() {
    dom.zoomOverlay.classList.remove('show');
    dom.zoomOverlayStory.classList.remove('visible');
    if (dom.zoomOverlay._cleanup) {
      dom.zoomOverlay._cleanup();
      dom.zoomOverlay._cleanup = null;
    }
    // 清理内容
    setTimeout(() => {
      dom.zoomOverlayContent.innerHTML = '';
    }, 500);
  }

  function initZoomOverlay() {
    // 点击背景关闭
    dom.zoomOverlayBackdrop.addEventListener('click', closeZoomOverlay);
    // 点击关闭按钮
    dom.zoomOverlayClose.addEventListener('click', closeZoomOverlay);
    // ESC 关闭
    document.addEventListener('keydown', (e) => {
      if (e.key === 'Escape' && dom.zoomOverlay.classList.contains('show')) {
        closeZoomOverlay();
      }
    });
  }

  // ═══════════════════════════════════════════════════
  //  4. 进度 / 场景 / 叙事
  // ═══════════════════════════════════════════════════
  function updateProgress(progress) {
    const totalWidth = dom.zoomWrapper.scrollWidth;
    const viewportWidth = window.innerWidth;
    const scrollDistance = totalWidth - viewportWidth;
    if (scrollDistance <= 0) {
      dom.progressFill.style.width = '100%';
      return;
    }
    // 让填充边缘 = 当前视口中心在画卷中的 x 百分比，与标记对齐
    const viewLeft = scrollDistance * (1 - progress);
    const paintingCenter = viewLeft + viewportWidth / 2;
    const percent = paintingCenter / totalWidth * 100;
    dom.progressFill.style.width = percent + '%';
  }

  function updateScene(progress) {
    // 计算视口中心在画卷中的实际 x 百分比（与进度条一致）
    const totalWidth = dom.zoomWrapper.scrollWidth;
    const viewportWidth = window.innerWidth;
    const scrollDistance = totalWidth - viewportWidth;
    let centerPercent;
    if (scrollDistance <= 0) {
      centerPercent = 50;
    } else {
      const viewLeft = scrollDistance * (1 - progress);
      const paintingCenter = viewLeft + viewportWidth / 2;
      centerPercent = paintingCenter / totalWidth * 100;
    }

    let active = null;

    // 用 rangeLeft/rangeRight 判断：视口中心 x 落在哪个场景的范围内
    for (const scene of SCENES) {
      if (scene.rangeLeft == null || scene.rangeRight == null) continue;
      const lo = Math.min(scene.rangeLeft, scene.rangeRight);
      const hi = Math.max(scene.rangeLeft, scene.rangeRight);
      if (centerPercent >= lo && centerPercent <= hi) {
        active = scene;
        break;
      }
    }

    if (active && active.id !== currentScene) {
      currentScene = active.id;
      dom.sceneLabelText.textContent = active.name;
      dom.sceneLabelTag.textContent = active.tag;
      dom.sceneLabel.classList.add('visible');
      $$('.scene-marker').forEach(m => m.classList.toggle('active', m.dataset.id === active.id));

      // 叙事卡片同步显示
      showNarrativeForScene(active);

    } else if (!active && currentScene) {
      currentScene = null;
      dom.sceneLabel.classList.remove('visible');
      dom.narrativeCard.classList.remove('visible');
      clearTimeout(narrativeTimer);
    }

    // ── NPC 触发：滚动到画面最左端（触底）──
    if (!npcTriggered && progress >= 0.99) {
      npcTriggered = true;
      triggerNpcDialog();
    }
  }

  function showNarrativeForScene(scene) {
    const char = CHARACTERS[currentPerspective];
    const text = scene.perspectives[currentPerspective];
    if (!text) return;

    dom.narrativeSceneName.textContent = scene.name;
    dom.narrativeText.textContent = text;
    dom.narrativeCard.classList.add('visible');
  }

  // ─── 叙事卡片触发逻辑 ──────────────────────────────
  let narrativeTimer = null;

  function initNarrativeTrigger() {
    // 点击场景标签 → 持续显示叙事卡片（跟随场景）
    dom.sceneLabel.addEventListener('click', () => {
      const scene = SCENES.find(s => s.id === currentScene);
      if (scene) showNarrativeForScene(scene);
    });
  }

  // ═══════════════════════════════════════════════════
  //  5. 热点渲染
  // ═══════════════════════════════════════════════════
  function renderHotspots() {
    const container = dom.hotspotsContainer;
    container.innerHTML = '';

    // 渲染文化场景热点
    CULTURAL_HOTSPOTS.forEach(hs => {
      const el = document.createElement('div');
      el.className = 'hotspot cultural-hotspot';
      // y 坐标较小的热点（靠近画面顶部），tooltip 向下弹出
      if (hs.y < 25) el.classList.add('tooltip-below');
      el.style.left = hs.x + '%';
      el.style.top = hs.y + '%';
      el.dataset.sceneId = hs.sceneId;
      el.dataset.name = hs.name;

      const tooltip = document.createElement('div');
      tooltip.className = 'hotspot-tooltip';
      tooltip.innerHTML = `<div class="tt-name">${hs.name}</div>`;
      el.appendChild(tooltip);

      el.addEventListener('click', () => {
        const scene = SCENES.find(s => s.id === hs.sceneId);
        if (scene) showZoomOverlay({ x: hs.x, y: hs.y }, hs.name);
      });
      container.appendChild(el);
    });

    applyPerspectiveHighlight();
  }

  // ═══════════════════════════════════════════════════
  //  6. 场景标记（进度条上）
  // ═══════════════════════════════════════════════════
  function renderSceneMarkers() {
    dom.sceneMarkers.innerHTML = '';
    SCENES.forEach((scene) => {
      const marker = document.createElement('div');
      marker.className = 'scene-marker';
      // 直接用 D 列 x 值：右侧(高x)=起点(太湖)，左侧(低x)=终点(山塘街)
      marker.style.left = scene.x + '%';
      marker.dataset.id = scene.id;

      const label = document.createElement('span');
      label.className = 'scene-marker-label';
      label.textContent = scene.name;
      marker.appendChild(label);

      marker.addEventListener('click', () => jumpToScene(scene));
      dom.sceneMarkers.appendChild(marker);
    });
  }

  // 根据画卷 x 百分比计算居中的滚动 progress
  function sceneToProgress(xPercent) {
    const totalWidth = dom.zoomWrapper.scrollWidth;
    const viewportWidth = window.innerWidth;
    const scrollDistance = totalWidth - viewportWidth;
    if (scrollDistance <= 0) return 0;
    // 场景在画卷中的像素位置
    const scenePixel = totalWidth * xPercent / 100;
    // 让该像素出现在视口正中央
    const targetViewLeft = Math.max(0, Math.min(scenePixel - viewportWidth / 2, scrollDistance));
    return 1 - targetViewLeft / scrollDistance;
  }

  function jumpToScene(scene, autoZoom, culturalName) {
    const trigger = ScrollTrigger.getAll()[0];
    if (trigger) {
      const progress = sceneToProgress(scene.x);
      const scrollTarget = trigger.start + (trigger.end - trigger.start) * progress;
      closeModal();
      closeZoomOverlay();

      if (autoZoom) {
        // 使用 scrollend 事件等待滚动完成后打开叠加层
        const onScrollEnd = () => {
          window.removeEventListener('scrollend', onScrollEnd);
          clearTimeout(fallbackTimer);
          setTimeout(() => showZoomOverlay(scene, culturalName), 200);
        };
        window.addEventListener('scrollend', onScrollEnd);
        // 备用超时（部分浏览器不支持 scrollend）
        const fallbackTimer = setTimeout(() => {
          window.removeEventListener('scrollend', onScrollEnd);
          showZoomOverlay(scene, culturalName);
        }, 1500);
      } else {
        // 滚动完成后显示叙事卡片
        const onScrollEnd = () => {
          window.removeEventListener('scrollend', onScrollEnd);
          clearTimeout(fallbackTimer);
          currentScene = scene.id;
          dom.sceneLabelText.textContent = scene.name;
          dom.sceneLabelTag.textContent = scene.tag;
          dom.sceneLabel.classList.add('visible');
          showNarrativeForScene(scene);
        };
        window.addEventListener('scrollend', onScrollEnd);
        const fallbackTimer = setTimeout(() => {
          window.removeEventListener('scrollend', onScrollEnd);
          currentScene = scene.id;
          dom.sceneLabelText.textContent = scene.name;
          dom.sceneLabelTag.textContent = scene.tag;
          dom.sceneLabel.classList.add('visible');
          showNarrativeForScene(scene);
        }, 1500);
      }

      window.scrollTo({ top: scrollTarget, behavior: 'smooth' });
    }
  }

  // ═══════════════════════════════════════════════════
  //  7. 热点高亮
  // ═══════════════════════════════════════════════════
  function applyPerspectiveHighlight() {
    const config = PERSPECTIVE_CONFIG[currentPerspective];
    const highlights = config.highlight;

    $$('.cultural-hotspot').forEach(el => {
      el.classList.remove('highlighted', 'dimmed');
      el.style.background = '';
      el.style.boxShadow = '';
    });
  }

  // ═══════════════════════════════════════════════════
  //  8. 详情弹窗（增强版）
  // ═══════════════════════════════════════════════════
  function openDetail(scene) {
    modalScene = scene;

    dom.modalTitle.textContent = scene.name;
    dom.modalTag.textContent = scene.tag;

    renderModalNarrative();
    renderModalCommerce(scene);
    renderModalCultural(scene);

    // 统计数据
    dom.modalStats.innerHTML = '';
    const stats = [
      { label: '市招(家)', value: getShopCountForScene(scene) },
      { label: '约占画卷', value: Math.round(100 / SCENES.length) + '%' },
    ];
    stats.forEach(s => {
      const div = document.createElement('div');
      div.className = 'modal-stat';
      div.innerHTML = `<div class="stat-value">${s.value}</div><div class="stat-label">${s.label}</div>`;
      dom.modalStats.appendChild(div);
    });

    dom.detailModal.classList.add('show');
  }

  function renderModalNarrative() {
    if (!modalScene) return;
    const text = modalScene.perspectives[currentPerspective];
    const ch = CHARACTERS[currentPerspective];
    dom.modalNarrativeText.innerHTML = `<span style="font-size:12px;color:${ch.color};font-weight:600;">${ch.icon} ${ch.name}·${ch.title}</span><br>${text || '暂无描述'}`;
  }

  function renderModalCommerce(scene) {
    const categories = SCENE_COMMERCE[scene.id] || [];
    if (!categories.length) { dom.modalCommerce.innerHTML = ''; return; }

    const items = COMMERCE_DATA.filter(d => categories.includes(d.category));
    let html = '<div class="modal-section-title">相关行业</div><div class="modal-commerce-list">';
    items.forEach(d => {
      html += `<span class="modal-commerce-tag">${d.name}<span class="tag-count">${d.count}</span></span>`;
    });
    html += '</div>';
    dom.modalCommerce.innerHTML = html;
  }

  function renderModalCultural(scene) {
    const names = SCENE_CULTURAL[scene.id] || [];
    if (!names.length) { dom.modalCultural.innerHTML = ''; return; }

    const allItems = [];
    CULTURAL_SCENES.forEach(g => {
      g.items.forEach(item => {
        if (names.includes(item.name)) allItems.push({ ...item, type: g.type, icon: g.icon });
      });
    });

    if (!allItems.length) { dom.modalCultural.innerHTML = ''; return; }

    let html = '<div class="modal-section-title">文化场景</div>';
    allItems.forEach(item => {
      html += `<div class="modal-cultural-item">${item.icon} <strong>${item.name}</strong> — ${item.desc}</div>`;
    });
    dom.modalCultural.innerHTML = html;
  }

  function getShopCountForScene(scene) {
    const map = { S01: 5, S02: 8, S03: 35, S04: 12, S05: 8, S06: 25, S07: 85, S08: 85, S09: 3, S10: 5 };
    return map[scene.id] || '?';
  }

  function closeModal() {
    dom.detailModal.classList.remove('show');
    modalScene = null;
  }


  // ═══════════════════════════════════════════════════
  //  9. 进度条点击跳转
  // ═══════════════════════════════════════════════════
  function initProgressClick() {
    dom.progressTrack.addEventListener('click', (e) => {
      // 如果点击的是标记点，由标记点自己的 handler 处理
      if (e.target.closest('.scene-marker')) return;
      const rect = dom.progressTrack.getBoundingClientRect();
      const clickPercent = (e.clientX - rect.left) / rect.width * 100;
      const progress = sceneToProgress(clickPercent);
      const trigger = ScrollTrigger.getAll()[0];
      if (trigger) {
        const scrollTarget = trigger.start + (trigger.end - trigger.start) * progress;
        window.scrollTo({ top: scrollTarget, behavior: 'smooth' });
      }
    });
  }

  // ═══════════════════════════════════════════════════
  //  10. NPC 对话（陆小顺）
  // ═══════════════════════════════════════════════════
  const NPC_DIALOG = [
    '小主！小主请留步！',
    '在下陆小顺，淮安府人氏。此番随货船沿大运河南下，头一遭来到姑苏城。周老板派我到阊门分号帮工，往后怕是要常在城中各处跑腿办事。',
    '可我初来乍到，两眼一抹黑——灵岩山在哪座山头？山塘街上有什么好去处？虎丘该怎么走？那些个庙会、社戏、婚礼，又是些什么样的规矩？一概不知啊！',
    '听闻小主是姑苏城的百事通，对各处民俗风物如数家珍。不知可否劳烦小主，带小顺认认这画中的场景、讲讲里面的门道？',
  ];

  let npcTypingTimer = null;
  let npcLineIndex = 0;
  let npcTyping = false;

  function triggerNpcDialog() {
    const dialog = dom.npcDialog;
    dom.npcText.innerHTML = '';
    dom.npcActions.innerHTML = '';
    npcLineIndex = 0;
    dialog.classList.add('show');

    // 打第一句话
    typeNpcLine();
  }

  function typeNpcLine() {
    if (npcLineIndex >= NPC_DIALOG.length) {
      showNpcActions();
      return;
    }

    const text = NPC_DIALOG[npcLineIndex];
    const el = dom.npcText;
    let charIndex = 0;

    const lineEl = document.createElement('div');
    lineEl.className = 'npc-line';
    lineEl.innerHTML = '<span class="typing-cursor"></span>';
    el.appendChild(lineEl);

    npcTyping = true;
    clearInterval(npcTypingTimer);
    npcTypingTimer = setInterval(() => {
      if (charIndex < text.length) {
        lineEl.innerHTML = text.slice(0, charIndex + 1) + '<span class="typing-cursor"></span>';
        charIndex++;
      } else {
        clearInterval(npcTypingTimer);
        npcTyping = false;
        lineEl.textContent = text;
        npcLineIndex++;
        // 如果不是最后一句，显示点击提示
        if (npcLineIndex < NPC_DIALOG.length) {
          showNpcClickHint();
        } else {
          showNpcActions();
        }
      }
    }, 45);
  }

  // 跳过当前打字动画，直接显示完整文本
  function skipNpcTyping() {
    if (npcTyping) {
      clearInterval(npcTypingTimer);
      npcTyping = false;
      const lines = dom.npcText.querySelectorAll('.npc-line');
      const lastLine = lines[lines.length - 1];
      if (lastLine) lastLine.textContent = NPC_DIALOG[npcLineIndex];
      npcLineIndex++;
      if (npcLineIndex < NPC_DIALOG.length) {
        showNpcClickHint();
      } else {
        showNpcActions();
      }
      return;
    }
    // 当前句已打完，点击进入下一句
    removeNpcClickHint();
    typeNpcLine();
  }

  function showNpcClickHint() {
    removeNpcClickHint();
    const hint = document.createElement('div');
    hint.className = 'npc-click-hint';
    hint.textContent = '点击继续';
    dom.npcText.appendChild(hint);
  }

  function removeNpcClickHint() {
    const h = dom.npcText.querySelector('.npc-click-hint');
    if (h) h.remove();
  }

  function showNpcActions() {
    dom.npcActions.innerHTML = `
      <button class="npc-btn-secondary" id="npcDismiss">下次再说</button>
      <button class="npc-btn-primary" id="npcAccept">好，我来帮你</button>
    `;
    document.getElementById('npcDismiss').addEventListener('click', closeNpcDialog);
    document.getElementById('npcAccept').addEventListener('click', () => {
      closeNpcDialog();
      openGame('games/spot-custom/spot-custom.html');
    });
  }

  function closeNpcDialog() {
    clearInterval(npcTypingTimer);
    npcTyping = false;
    dom.npcDialog.classList.remove('show');
  }

  // NPC 对话卡片点击 → 推进对话
  function initNpcDialog() {
    dom.npcDialog.addEventListener('click', (e) => {
      // 不拦截按钮点击
      if (e.target.closest('.npc-dialog-actions button')) return;
      skipNpcTyping();
    });
  }

  // ═══════════════════════════════════════════════════
  //  11. 游戏叠加层
  // ═══════════════════════════════════════════════════
  function openGame(src) {
    dom.gameFrame.src = src;
    dom.gameOverlay.classList.add('show');
  }

  function closeGame() {
    dom.gameOverlay.classList.remove('show');
    setTimeout(() => { dom.gameFrame.src = ''; }, 400);
  }

  // ═══════════════════════════════════════════════════
  //  12. 放大镜
  // ═══════════════════════════════════════════════════
  let magnifierActive = false;

  function initMagnifier() {
    dom.magnifierBtn.addEventListener('click', toggleMagnifier);

    // 鼠标移动时更新镜片
    dom.paintingSection.addEventListener('mousemove', onMagnifierMove);
    dom.paintingSection.addEventListener('mouseleave', () => {
      dom.magnifierLens.classList.remove('show');
    });
  }

  function toggleMagnifier() {
    magnifierActive = !magnifierActive;
    dom.magnifierBtn.classList.toggle('active', magnifierActive);
    dom.paintingSection.classList.toggle('magnifier-active', magnifierActive);

    if (!magnifierActive) {
      dom.magnifierLens.classList.remove('show');
    }
  }

  function onMagnifierMove(e) {
    if (!magnifierActive) return;

    const lens = dom.magnifierLens;
    const section = dom.paintingSection;
    const container = dom.paintingContainer;
    const zoomWrapper = dom.zoomWrapper;

    const sectionRect = section.getBoundingClientRect();
    const LENS_SIZE = 180;
    const ZOOM = 2.5;

    // 鼠标在 painting-section 中的位置
    const mx = e.clientX - sectionRect.left;
    const my = e.clientY - sectionRect.top;

    // 定位镜片（圆形 canvas）
    lens.style.left = (mx - LENS_SIZE / 2) + 'px';
    lens.style.top = (my - LENS_SIZE / 2) + 'px';
    lens.classList.add('show');

    // 计算鼠标在画卷（zoom-wrapper）中的像素坐标
    const containerRect = container.getBoundingClientRect();
    const imgX = e.clientX - containerRect.left;
    const imgY = e.clientY - containerRect.top;

    // 绘制放大内容到 canvas
    const dpr = window.devicePixelRatio || 1;
    lens.width = LENS_SIZE * dpr;
    lens.height = LENS_SIZE * dpr;
    lens.style.width = LENS_SIZE + 'px';
    lens.style.height = LENS_SIZE + 'px';

    const ctx = lens.getContext('2d');
    ctx.clearRect(0, 0, lens.width, lens.height);

    // 圆形裁剪
    ctx.save();
    ctx.beginPath();
    ctx.arc(lens.width / 2, lens.height / 2, lens.width / 2 - 1, 0, Math.PI * 2);
    ctx.clip();

    // 源区域：以鼠标位置为中心，按 ZOOM 缩小取源
    const srcW = LENS_SIZE / ZOOM;
    const srcH = LENS_SIZE / ZOOM;
    const srcX = imgX * dpr - srcW * dpr / 2;
    const srcY = imgY * dpr - srcH * dpr / 2;

    // 从 zoom-wrapper 截图绘制
    // 用 canvas drawImage 从各 img 元素取源
    const images = zoomWrapper.querySelectorAll('img');
    const wrapperRect = zoomWrapper.getBoundingClientRect();
    // 鼠标相对于 zoom-wrapper 左上角的偏移（像素）
    const pxInWrapper = e.clientX - wrapperRect.left;
    const pyInWrapper = e.clientY - wrapperRect.top;

    // 找到鼠标落在哪张图上
    let accumWidth = 0;
    for (const img of images) {
      const imgW = img.getBoundingClientRect().width;
      if (pxInWrapper < accumWidth + imgW) {
        // 鼠标在这张图上
        const localX = pxInWrapper - accumWidth;
        const localY = pyInWrapper;
        // 自然尺寸与显示尺寸的比率
        const scaleImg = img.naturalWidth / imgW;
        const srcCenterX = localX * scaleImg;
        const srcCenterY = localY * scaleImg;
        // 按 ZOOM 计算源区域（自然像素）
        const srcHalfW = (LENS_SIZE / ZOOM / 2) * scaleImg;
        const srcHalfH = (LENS_SIZE / ZOOM / 2) * scaleImg;

        ctx.drawImage(
          img,
          srcCenterX - srcHalfW, srcCenterY - srcHalfH,
          srcHalfW * 2, srcHalfH * 2,
          0, 0,
          lens.width, lens.height
        );
        break;
      }
      accumWidth += imgW;
    }

    ctx.restore();
  }

  // ═══════════════════════════════════════════════════
  //  13. 我在哪 — 寻找图中人物
  // ═══════════════════════════════════════════════════
  let findmeActive = false;
  let findmeData = [];
  let findmeIndex = 0;
  let findmeWaiting = false; // 等待用户点击选择

  function initFindMe() {
    dom.findmeBtn = $('#findmeBtn');
    dom.findmeHint = $('#findme-hint');
    dom.findmeImg = $('#findmeImg');
    dom.findmeName = $('#findmeName');
    dom.findmeText = $('#findmeText');
    dom.findmeProgress = $('#findmeProgress');
    dom.findmeActions = $('#findmeActions');
    dom.findmeFeedback = $('#findmeFeedback');

    dom.findmeBtn.addEventListener('click', () => {
      if (findmeActive) {
        closeFindMe();
      } else {
        startFindMe();
      }
    });

    // 事件委托：关闭 / 下一题
    dom.findmeActions.addEventListener('click', (e) => {
      if (e.target.classList.contains('findme-close-btn')) closeFindMe();
      if (e.target.id === 'findmeNextBtn') {
        findmeIndex++;
        showFindMeRound();
      }
    });

    // 画面点击判定
    dom.paintingSection.addEventListener('click', (e) => {
      if (!findmeActive || !findmeWaiting) return;
      // 不拦截按钮/热点点击
      if (e.target.closest('.hotspot') || e.target.closest('button')) return;
      onFindMeClick(e);
    });
  }

  async function startFindMe() {
    findmeActive = true;
    dom.findmeBtn.classList.add('active');

    // 直接使用内嵌数据（兼容 file:// 协议）
    findmeData = FIND_ME_DATA || [];

    if (!findmeData.length) {
      closeFindMe();
      return;
    }

    // 打乱关卡
    findmeData = shuffleArray(findmeData);
    findmeIndex = 0;

    // 自动开启放大镜
    if (!magnifierActive) toggleMagnifier();

    showFindMeRound();
  }

  function showFindMeRound() {
    if (findmeIndex >= findmeData.length) {
      // 全部完成
      showFindMeComplete();
      return;
    }

    const round = findmeData[findmeIndex];
    dom.findmeImg.src = round.image;
    dom.findmeName.textContent = round.name;
    dom.findmeText.textContent = round.hint;
    dom.findmeProgress.textContent = `第 ${findmeIndex + 1} / ${findmeData.length} 题`;
    dom.findmeActions.innerHTML = `<button class="findme-close-btn">关闭</button>`;
    dom.findmeHint.classList.add('show');

    findmeWaiting = true;
  }

  function onFindMeClick(e) {
    const round = findmeData[findmeIndex];
    if (!round) return;

    // 计算点击位置在画卷中的百分比坐标
    const zoomWrapper = dom.zoomWrapper;
    const wrapperRect = zoomWrapper.getBoundingClientRect();

    const clickX = e.clientX - wrapperRect.left;
    const totalWidth = zoomWrapper.scrollWidth;
    const clickPercent = (clickX / totalWidth) * 100;

    // Y 坐标：相对于 painting-section 的高度
    const sectionRect = dom.paintingSection.getBoundingClientRect();
    const clickY = e.clientY - sectionRect.top;
    const clickPercentY = (clickY / sectionRect.height) * 100;

    // 计算与答案的距离
    const dx = clickPercent - round.answerX;
    const dy = clickPercentY - round.answerY;
    const dist = Math.sqrt(dx * dx + dy * dy);
    const tolerance = round.tolerance || 5;

    // 显示反馈
    showFindMeFeedback(e, dist <= tolerance);

    if (dist <= tolerance) {
      // 正确！
      findmeWaiting = false;
      dom.findmeActions.innerHTML = `
        <div class="findme-result-text correct">找到了！</div>
        ${findmeIndex < findmeData.length - 1
          ? '<button class="findme-next-btn" id="findmeNextBtn">找下一个</button>'
          : '<div class="findme-result-text correct" style="margin-bottom:0">全部找到！</div>'}
        <button class="findme-close-btn">关闭</button>
      `;
    }
    // 错误时不做额外提示，让用户继续找
  }

  function showFindMeFeedback(e, correct) {
    const fb = dom.findmeFeedback;
    fb.className = '';
    const sectionRect = dom.paintingSection.getBoundingClientRect();
    fb.style.left = (e.clientX - sectionRect.left) + 'px';
    fb.style.top = (e.clientY - sectionRect.top) + 'px';

    // 强制 reflow 重新触发动画
    void fb.offsetWidth;
    fb.className = correct ? 'correct' : 'wrong';

    setTimeout(() => { fb.className = ''; }, 700);
  }

  function showFindMeComplete() {
    findmeWaiting = false;
    dom.findmeName.textContent = '全部完成！';
    dom.findmeImg.src = '';
    dom.findmeImg.style.display = 'none';
    dom.findmeText.textContent = '你已经找到了所有目标';
    dom.findmeProgress.textContent = '';
    dom.findmeActions.innerHTML = `
      <button class="findme-close-btn">关闭</button>
    `;
  }

  function closeFindMe() {
    findmeActive = false;
    findmeWaiting = false;
    dom.findmeBtn.classList.remove('active');
    dom.findmeHint.classList.remove('show');
    dom.findmeImg.style.display = '';

    // 关闭放大镜
    if (magnifierActive) toggleMagnifier();
  }

  function shuffleArray(arr) {
    const a = [...arr];
    for (let i = a.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [a[i], a[j]] = [a[j], a[i]];
    }
    return a;
  }

  function initGameOverlay() {
    dom.gameOverlayClose.addEventListener('click', closeGame);
    document.addEventListener('keydown', (e) => {
      if (e.key === 'Escape' && dom.gameOverlay.classList.contains('show')) {
        closeGame();
      }
    });
    // 监听游戏 iframe 的关闭消息
    window.addEventListener('message', (e) => {
      if (e.data && e.data.type === 'closeGame') closeGame();
    });
  }

  // ═══════════════════════════════════════════════════
  //  初始化
  // ═══════════════════════════════════════════════════
  function init() {
    cacheDom();
    initIntro();
    initProgressClick();
    initZoomOverlay();
    initNarrativeTrigger();
    initNpcDialog();
    initMagnifier();
    initFindMe();
    initGameOverlay();

    // 弹窗关闭
    dom.modalClose.addEventListener('click', closeModal);
    dom.modalBackdrop.addEventListener('click', closeModal);

    // 弹窗跳转按钮（带自动缩放）
    dom.modalJump.addEventListener('click', () => {
      if (modalScene) jumpToScene(modalScene, true);
    });

    // ESC 关闭弹窗
    document.addEventListener('keydown', (e) => {
      if (e.key === 'Escape') {
        closeModal();
      }
    });

    // 叙事卡片鼠标保持
    dom.narrativeCard.addEventListener('mouseenter', () => {});

    // 窗口 resize
    let resizeTimer;
    window.addEventListener('resize', () => {
      clearTimeout(resizeTimer);
      resizeTimer = setTimeout(() => { ScrollTrigger.refresh(); }, 250);
    });
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }
})();
