/* ============================================================
   合同会社BISIN — particles.js
   Hero background: white snowflake particles (slow falling)
   ============================================================ */

'use strict';

(function () {
  const canvas = document.getElementById('particles-canvas');
  if (!canvas) return;

  const ctx = canvas.getContext('2d');
  let W, H, flakes, animId;

  const CONFIG = {
    count:    40,
    maxR:     1.5,
    minR:     0.5,
    speedY:   { min: 0.30, max: 0.75 },
    speedX:   { min: -0.12, max: 0.12 },
    opacity:  0.20,
    color:    [255, 255, 255],
  };

  /* ---- Resize -------------------------------------------- */
  function resize() {
    W = canvas.width  = canvas.offsetWidth;
    H = canvas.height = canvas.offsetHeight;
  }

  window.addEventListener('resize', () => {
    resize();
    init();
  }, { passive: true });

  /* ---- Flake factory ------------------------------------- */
  function createFlake(startAnywhere) {
    const r = CONFIG.minR + Math.random() * (CONFIG.maxR - CONFIG.minR);
    return {
      x:  Math.random() * W,
      y:  startAnywhere ? Math.random() * H : -r * 2,
      r,
      vx: CONFIG.speedX.min + Math.random() * (CONFIG.speedX.max - CONFIG.speedX.min),
      vy: CONFIG.speedY.min + Math.random() * (CONFIG.speedY.max - CONFIG.speedY.min),
      alpha: CONFIG.opacity * (0.5 + Math.random() * 0.5),
      wobble: Math.random() * Math.PI * 2,
      wobbleSpeed: 0.008 + Math.random() * 0.012,
    };
  }

  function init() {
    flakes = Array.from({ length: CONFIG.count }, () => createFlake(true));
  }

  /* ---- Draw --------------------------------------------- */
  function draw() {
    ctx.clearRect(0, 0, W, H);

    const [r, g, b] = CONFIG.color;

    flakes.forEach(f => {
      f.wobble += f.wobbleSpeed;
      f.x += f.vx + Math.sin(f.wobble) * 0.25;
      f.y += f.vy;

      if (f.y > H + 10) {
        Object.assign(f, createFlake(false));
      }
      if (f.x < -10) f.x = W + 10;
      if (f.x > W + 10) f.x = -10;

      ctx.beginPath();
      ctx.arc(f.x, f.y, f.r, 0, Math.PI * 2);
      ctx.fillStyle = `rgba(${r},${g},${b},${f.alpha})`;
      ctx.fill();
    });
  }

  /* ---- Loop --------------------------------------------- */
  function loop() {
    draw();
    animId = requestAnimationFrame(loop);
  }

  /* ---- Pause when tab hidden ---------------------------- */
  document.addEventListener('visibilitychange', () => {
    if (document.hidden) {
      cancelAnimationFrame(animId);
    } else {
      loop();
    }
  });

  /* ---- Start -------------------------------------------- */
  resize();
  init();
  loop();
})();
