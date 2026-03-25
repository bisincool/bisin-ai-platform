/* ============================================================
   合同会社BISIN — particles.js
   Hero background: floating ice-blue particles
   ============================================================ */

'use strict';

(function () {
  const canvas = document.getElementById('particles-canvas');
  if (!canvas) return;

  const ctx = canvas.getContext('2d');
  let W, H, particles, animId;

  const CONFIG = {
    count:      80,
    maxRadius:  2.2,
    minRadius:  0.4,
    speed:      0.25,
    color:      [201, 163, 75],   // --color-primary RGB (gold)
    opacity:    { min: 0.06, max: 0.45 },
    connect:    { distance: 130, opacity: 0.06 },
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

  /* ---- Particle factory ---------------------------------- */
  function createParticle() {
    const r = CONFIG.minRadius +
              Math.random() * (CONFIG.maxRadius - CONFIG.minRadius);
    return {
      x:  Math.random() * W,
      y:  Math.random() * H,
      r,
      vx: (Math.random() - 0.5) * CONFIG.speed,
      vy: (Math.random() - 0.5) * CONFIG.speed,
      alpha: CONFIG.opacity.min +
             Math.random() * (CONFIG.opacity.max - CONFIG.opacity.min),
      pulse: Math.random() * Math.PI * 2,
      pulseSpeed: 0.005 + Math.random() * 0.01,
    };
  }

  function init() {
    particles = Array.from({ length: CONFIG.count }, createParticle);
  }

  /* ---- Draw --------------------------------------------- */
  function draw() {
    ctx.clearRect(0, 0, W, H);

    const [r, g, b] = CONFIG.color;

    // Connections
    for (let i = 0; i < particles.length; i++) {
      for (let j = i + 1; j < particles.length; j++) {
        const dx = particles[i].x - particles[j].x;
        const dy = particles[i].y - particles[j].y;
        const dist = Math.sqrt(dx * dx + dy * dy);
        if (dist < CONFIG.connect.distance) {
          const alpha = CONFIG.connect.opacity *
                        (1 - dist / CONFIG.connect.distance);
          ctx.beginPath();
          ctx.strokeStyle = `rgba(${r},${g},${b},${alpha})`;
          ctx.lineWidth = 0.5;
          ctx.moveTo(particles[i].x, particles[i].y);
          ctx.lineTo(particles[j].x, particles[j].y);
          ctx.stroke();
        }
      }
    }

    // Particles
    particles.forEach(p => {
      p.pulse += p.pulseSpeed;
      const alpha = p.alpha * (0.7 + 0.3 * Math.sin(p.pulse));

      ctx.beginPath();
      ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
      ctx.fillStyle = `rgba(${r},${g},${b},${alpha})`;
      ctx.fill();

      // Move
      p.x += p.vx;
      p.y += p.vy;

      // Wrap
      if (p.x < -10) p.x = W + 10;
      if (p.x > W + 10) p.x = -10;
      if (p.y < -10) p.y = H + 10;
      if (p.y > H + 10) p.y = -10;
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
