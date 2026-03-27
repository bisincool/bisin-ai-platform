/* ============================================================
   合同会社BISIN — particles.js
   Global: 3-4 hexagonal crystal snowflakes, slow full-page fall
   ============================================================ */

'use strict';

(function () {
  /* ---- Create full-page fixed canvas --------------------- */
  if (document.getElementById('snow-canvas')) return; // guard: run once
  var canvas = document.createElement('canvas');
  canvas.id = 'snow-canvas';
  canvas.setAttribute('aria-hidden', 'true');
  canvas.style.cssText = [
    'position:fixed',
    'top:0',
    'left:0',
    'width:100%',
    'height:100%',
    'pointer-events:none',
    'z-index:200',
  ].join(';');
  document.body.appendChild(canvas);

  var ctx = canvas.getContext('2d');
  var W, H, flakes, animId;

  var CONFIG = {
    count:       4,
    maxR:        16,
    minR:        10,
    speedY:      { min: 0.28, max: 0.55 },
    speedX:      { min: -0.06, max: 0.06 },
    wobbleAmp:   0.12,
    wobbleSpd:   { min: 0.004, max: 0.009 },
    rotSpd:      { min: 0.0008, max: 0.003 },
    opacity:     0.24,
    color:       [255, 255, 255],
  };

  /* ---- Resize -------------------------------------------- */
  function resize() {
    W = canvas.width  = window.innerWidth;
    H = canvas.height = window.innerHeight;
  }

  window.addEventListener('resize', function () { resize(); }, { passive: true });

  /* ---- Flake factory ------------------------------------- */
  function makeFlake(startAnywhere) {
    var r = CONFIG.minR + Math.random() * (CONFIG.maxR - CONFIG.minR);
    var alpha = CONFIG.opacity * (0.55 + Math.random() * 0.45);
    return {
      x:         Math.random() * W,
      y:         startAnywhere ? Math.random() * H : -r * 3,
      r:         r,
      vx:        CONFIG.speedX.min + Math.random() * (CONFIG.speedX.max - CONFIG.speedX.min),
      vy:        CONFIG.speedY.min + Math.random() * (CONFIG.speedY.max - CONFIG.speedY.min),
      rot:       Math.random() * Math.PI,
      rotV:      (CONFIG.rotSpd.min + Math.random() * (CONFIG.rotSpd.max - CONFIG.rotSpd.min))
                 * (Math.random() < 0.5 ? 1 : -1),
      wobble:    Math.random() * Math.PI * 2,
      wobbleSpd: CONFIG.wobbleSpd.min + Math.random() * (CONFIG.wobbleSpd.max - CONFIG.wobbleSpd.min),
      alpha:     alpha,
    };
  }

  function init() {
    flakes = [];
    for (var i = 0; i < CONFIG.count; i++) { flakes.push(makeFlake(true)); }
  }

  /* ---- Draw one hexagonal crystal snowflake -------------- */
  function drawFlake(f) {
    var r   = f.r;
    var c   = CONFIG.color;

    ctx.save();
    ctx.globalAlpha = f.alpha;
    ctx.strokeStyle = 'rgb(' + c[0] + ',' + c[1] + ',' + c[2] + ')';
    ctx.lineWidth   = Math.max(0.9, r * 0.075);
    ctx.lineCap     = 'round';
    ctx.translate(f.x, f.y);
    ctx.rotate(f.rot);

    /* 6 arms + 2 pairs of branches each */
    for (var i = 0; i < 6; i++) {
      ctx.save();
      ctx.rotate((i * Math.PI) / 3);

      /* Main arm */
      ctx.beginPath();
      ctx.moveTo(0, 0);
      ctx.lineTo(0, -r);
      ctx.stroke();

      /* Branch pair at 65% — 60° off arm (crystal angle) */
      var b1y = -r * 0.65,  bl1 = r * 0.30;
      ctx.beginPath(); ctx.moveTo(0, b1y); ctx.lineTo( 0.866 * bl1, b1y - 0.5 * bl1); ctx.stroke();
      ctx.beginPath(); ctx.moveTo(0, b1y); ctx.lineTo(-0.866 * bl1, b1y - 0.5 * bl1); ctx.stroke();

      /* Branch pair at 38% — shorter */
      var b2y = -r * 0.38,  bl2 = r * 0.19;
      ctx.beginPath(); ctx.moveTo(0, b2y); ctx.lineTo( 0.866 * bl2, b2y - 0.5 * bl2); ctx.stroke();
      ctx.beginPath(); ctx.moveTo(0, b2y); ctx.lineTo(-0.866 * bl2, b2y - 0.5 * bl2); ctx.stroke();

      ctx.restore();
    }

    /* Centre dot */
    ctx.beginPath();
    ctx.arc(0, 0, r * 0.09, 0, Math.PI * 2);
    ctx.fillStyle = 'rgb(' + c[0] + ',' + c[1] + ',' + c[2] + ')';
    ctx.fill();

    ctx.restore();
  }

  /* ---- Animation loop ------------------------------------ */
  function draw() {
    ctx.clearRect(0, 0, W, H);

    for (var i = 0; i < flakes.length; i++) {
      var f = flakes[i];

      f.wobble += f.wobbleSpd;
      f.x += f.vx + Math.sin(f.wobble) * CONFIG.wobbleAmp;
      f.y += f.vy;
      f.rot += f.rotV;

      if (f.y > H + f.r * 3) { flakes[i] = makeFlake(false); continue; }
      if (f.x < -f.r * 2)    { f.x = W + f.r; }
      if (f.x > W + f.r * 2) { f.x = -f.r; }

      drawFlake(f);
    }
  }

  function loop() { draw(); animId = requestAnimationFrame(loop); }

  document.addEventListener('visibilitychange', function () {
    if (document.hidden) cancelAnimationFrame(animId); else loop();
  });

  resize();
  init();
  loop();
})();
