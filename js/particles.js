/* ============================================================
   合同会社BISIN — particles.js
   Hero: white snowflakes — match body-text size, melt on cards/text
   ============================================================ */

'use strict';

(function () {
  const canvas = document.getElementById('particles-canvas');
  if (!canvas) return;

  const ctx = canvas.getContext('2d');
  let W, H, flakes, animId;
  let obstacles = [];   // [{x,y,w,h}] in canvas-local coords

  const CONFIG = {
    count:      40,
    maxR:       8,     // ~1rem character height at 16px base
    minR:       5,
    speedY:     { min: 0.45, max: 1.0 },
    speedX:     { min: -0.18, max: 0.18 },
    opacity:    0.28,
    meltRate:   0.018, // alpha lost per frame while melting
    color:      [255, 255, 255],
  };

  /* ---- Obstacle detection -------------------------------- */
  const OBSTACLE_SELECTORS = [
    '.hero__eyebrow',
    '.hero__title',
    '.hero__desc',
    '.hero__actions',
    '.hero__scroll-indicator',
  ];
  const PAD = 8; // extra padding around each rect (px)

  function cacheObstacles() {
    const canvasRect = canvas.getBoundingClientRect();
    obstacles = [];
    OBSTACLE_SELECTORS.forEach(function (sel) {
      const el = document.querySelector(sel);
      if (!el) return;
      const r = el.getBoundingClientRect();
      obstacles.push({
        x: r.left - canvasRect.left - PAD,
        y: r.top  - canvasRect.top  - PAD,
        w: r.width  + PAD * 2,
        h: r.height + PAD * 2,
      });
    });
  }

  function hitsObstacle(f) {
    for (var i = 0; i < obstacles.length; i++) {
      var o = obstacles[i];
      if (f.x + f.r > o.x && f.x - f.r < o.x + o.w &&
          f.y + f.r > o.y && f.y - f.r < o.y + o.h) {
        return true;
      }
    }
    return false;
  }

  /* ---- Resize -------------------------------------------- */
  function resize() {
    W = canvas.width  = canvas.offsetWidth;
    H = canvas.height = canvas.offsetHeight;
    cacheObstacles();
  }

  window.addEventListener('resize', function () {
    resize();
    init();
  }, { passive: true });

  /* ---- Flake factory ------------------------------------- */
  function createFlake(startAnywhere) {
    var r = CONFIG.minR + Math.random() * (CONFIG.maxR - CONFIG.minR);
    var maxAlpha = CONFIG.opacity * (0.55 + Math.random() * 0.45);
    return {
      x:          Math.random() * W,
      y:          startAnywhere ? Math.random() * H : -r * 3,
      r:          r,
      vx:         CONFIG.speedX.min + Math.random() * (CONFIG.speedX.max - CONFIG.speedX.min),
      vy:         CONFIG.speedY.min + Math.random() * (CONFIG.speedY.max - CONFIG.speedY.min),
      alpha:      maxAlpha,
      maxAlpha:   maxAlpha,
      wobble:     Math.random() * Math.PI * 2,
      wobbleSpd:  0.006 + Math.random() * 0.01,
      melting:    false,
    };
  }

  function init() {
    flakes = [];
    for (var i = 0; i < CONFIG.count; i++) {
      flakes.push(createFlake(true));
    }
  }

  /* ---- Draw --------------------------------------------- */
  function draw() {
    ctx.clearRect(0, 0, W, H);
    var c = CONFIG.color;

    for (var i = 0; i < flakes.length; i++) {
      var f = flakes[i];

      if (f.melting) {
        /* fade out like melting into the card */
        f.alpha -= CONFIG.meltRate;
        if (f.alpha <= 0) {
          flakes[i] = createFlake(false);
          continue;
        }
      } else {
        /* normal falling */
        f.wobble += f.wobbleSpd;
        f.x += f.vx + Math.sin(f.wobble) * 0.22;
        f.y += f.vy;

        if (f.y > H + f.r * 2) {
          flakes[i] = createFlake(false);
          continue;
        }
        if (f.x < -10) f.x = W + 10;
        if (f.x > W + 10) f.x = -10;

        if (hitsObstacle(f)) {
          f.melting = true;
        }
      }

      /* draw a soft circular snowflake */
      var grad = ctx.createRadialGradient(f.x, f.y, 0, f.x, f.y, f.r);
      grad.addColorStop(0,   'rgba(' + c[0] + ',' + c[1] + ',' + c[2] + ',' + f.alpha + ')');
      grad.addColorStop(0.6, 'rgba(' + c[0] + ',' + c[1] + ',' + c[2] + ',' + (f.alpha * 0.6) + ')');
      grad.addColorStop(1,   'rgba(' + c[0] + ',' + c[1] + ',' + c[2] + ',0)');

      ctx.beginPath();
      ctx.arc(f.x, f.y, f.r, 0, Math.PI * 2);
      ctx.fillStyle = grad;
      ctx.fill();
    }
  }

  /* ---- Loop --------------------------------------------- */
  function loop() {
    draw();
    animId = requestAnimationFrame(loop);
  }

  /* ---- Pause when tab hidden ---------------------------- */
  document.addEventListener('visibilitychange', function () {
    if (document.hidden) cancelAnimationFrame(animId);
    else loop();
  });

  /* ---- Start -------------------------------------------- */
  resize();
  init();
  loop();
})();
