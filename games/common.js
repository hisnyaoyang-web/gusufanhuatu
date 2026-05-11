/**
 * 姑苏繁华图 — 民俗小游戏共用逻辑
 * 包含：SuzhouGame 接口、Toast、工具函数
 */

// ─── 统一接口（供父页面调用）──────────────────────────
window.SuzhouGame = {
  name: '',
  type: '',
  getScore()  { return { total: 0, correct: 0, time: 0 }; },
  reset()     {},
  start()     {},
};

// ─── Toast 提示 ──────────────────────────────────────
function showToast(msg, type = 'info', duration = 2000) {
  let toast = document.querySelector('.toast');
  if (!toast) {
    toast = document.createElement('div');
    toast.className = 'toast';
    document.body.appendChild(toast);
  }
  toast.textContent = msg;
  toast.className = 'toast ' + type;
  requestAnimationFrame(() => toast.classList.add('show'));
  clearTimeout(toast._timer);
  toast._timer = setTimeout(() => toast.classList.remove('show'), duration);
}

// ─── 连击特效 ────────────────────────────────────────
function showCombo(text) {
  let combo = document.querySelector('.combo');
  if (!combo) {
    combo = document.createElement('div');
    combo.className = 'combo';
    document.body.appendChild(combo);
  }
  combo.textContent = text;
  combo.classList.remove('show');
  void combo.offsetWidth; // reflow
  combo.classList.add('show');
}

// ─── 工具函数 ────────────────────────────────────────
function shuffle(arr) {
  const a = [...arr];
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

function formatTime(seconds) {
  const m = Math.floor(seconds / 60);
  const s = seconds % 60;
  return m > 0 ? `${m}分${s}秒` : `${s}秒`;
}

// ─── 屏幕切换 ────────────────────────────────────────
function showScreen(id) {
  document.querySelectorAll('.screen').forEach(s => s.classList.remove('active'));
  const target = document.getElementById(id);
  if (target) target.classList.add('active');
}

// ─── 返回游戏选择（预留，暂返回自身）──────────────────
function goBack() {
  // 未来接入父页面时，改为 window.parent.postMessage 或路由跳转
  if (window.history.length > 1) {
    window.history.back();
  } else {
    showToast('已返回', 'info');
  }
}
