// fire.js - Canvas fire overlay effect
(() => {
  const flames = [];
  const sparks = [];
  const maxFlames = 150;
  let overlay = null;
  let canvas = null;
  let ctx = null;
  let running = false;
  let rafId = null;
  let lastTs = 0;

  function createOverlay() {
    if (overlay) return;
    overlay = document.createElement("div");
    overlay.id = "fire-overlay-canvas";
    overlay.style.position = "fixed";
    overlay.style.inset = "0";
    overlay.style.zIndex = "2147483647";
    overlay.style.pointerEvents = "none";
    overlay.style.opacity = "0";
    overlay.style.transition = "opacity 800ms ease";
    overlay.style.mixBlendMode = "normal";

    canvas = document.createElement("canvas");
    canvas.id = "fire-canvas";
    canvas.style.width = "100%";
    canvas.style.height = "100%";
    canvas.style.display = "block";

    overlay.appendChild(canvas);
    document.documentElement.appendChild(overlay);

    ctx = canvas.getContext("2d");
    ctx.lineCap = 'round';
    ctx.lineJoin = 'round';
    ctx.imageSmoothingEnabled = true;
    resizeCanvas();
    window.addEventListener("resize", resizeCanvas);
  }

  function resizeCanvas() {
    if (!canvas) return;
    const dpr = window.devicePixelRatio || 1;
    const w = Math.max(1, Math.floor(window.innerWidth * dpr));
    const h = Math.max(1, Math.floor(window.innerHeight * dpr));
    canvas.width = w;
    canvas.height = h;
    canvas.style.width = window.innerWidth + "px";
    canvas.style.height = window.innerHeight + "px";
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
  }

  function spawnFlame() {
    const x = Math.random() * window.innerWidth;
    const depth = Math.random();
    const size = 1.5 + depth * 6;
    const speed = 30 + depth * 120;
    const flicker = (Math.random() - 0.5) * 1.2;
    const alpha = 0.4 + depth * 0.6;
    const wind = (Math.random() - 0.5) * 0.6;
    const life = 1.5 + Math.random() * 2.0;
    const boil = Math.random() * 0.3;
    return { 
      x, 
      y: window.innerHeight + Math.random() * 20, 
      vx: wind, 
      vy: -speed, 
      size, 
      alpha, 
      life,
      maxLife: life,
      flicker,
      boil,
      originalY: window.innerHeight + Math.random() * 20,
      color: depth > 0.7 ? (depth > 0.9 ? 'yellow' : 'orange') : 'red'
    };
  }

  function populateFlames() {
    flames.length = 0;
    for (let i = 0; i < Math.min(60, maxFlames); i++) {
      const f = spawnFlame();
      f.y = window.innerHeight - Math.random() * 150;
      flames.push(f);
    }
  }

  function loop(ts) {
    if (!running) return;
    if (!lastTs) lastTs = ts;
    const dt = Math.min(50, ts - lastTs) / 1000;
    lastTs = ts;
    update(dt);
    draw();
    rafId = requestAnimationFrame(loop);
  }

  function update(dt) {
    const spawnRate = 60;
    const toSpawn = Math.floor(spawnRate * dt);
    for (let i = 0; i < toSpawn && flames.length < maxFlames; i++) flames.push(spawnFlame());

    for (let i = flames.length - 1; i >= 0; i--) {
      const f = flames[i];
      f.life -= dt;
      
      const boilEffect = Math.sin(Date.now() * 0.003 + f.boil * 10) * f.boil * 15;
      f.x += f.vx * dt + f.flicker * dt * 25 + boilEffect * dt;
      f.y += f.vy * dt + boilEffect * dt * 0.5;
      
      f.flicker += (Math.random() - 0.5) * dt * 4;
      f.flicker = Math.max(-1.2, Math.min(1.2, f.flicker));
      
      f.alpha = (f.life / f.maxLife) * (0.4 + Math.random() * 0.5 + f.boil * 0.3);
      
      if (Math.random() < 0.02 && f.life > f.maxLife * 0.3) {
        createSpark(f.x, f.y, 0.5, f.alpha * 0.8);
      }
      
      if (f.life <= 0 || f.y < -100 || f.x < -100 || f.x > window.innerWidth + 100) {
        flames.splice(i, 1);
      }
    }

    for (let i = sparks.length - 1; i >= 0; i--) {
      const s = sparks[i];
      s.life -= dt;
      s.y += s.vy * dt;
      s.x += s.vx * dt;
      s.alpha = (s.life / s.maxLife) * 0.9;
      if (s.life <= 0) sparks.splice(i, 1);
    }
  }

  function draw() {
    if (!ctx) return;
    ctx.clearRect(0, 0, window.innerWidth, window.innerHeight);
    
    for (let i = 0; i < flames.length; i++) {
      const f = flames[i];
      ctx.beginPath();
      ctx.globalAlpha = f.alpha;
      
      let color;
      const boilIntensity = f.boil * 0.5;
      if (f.color === 'yellow') {
        color = `rgba(255,255,${100 + boilIntensity * 50},${f.alpha})`;
      } else if (f.color === 'orange') {
        color = `rgba(255,${150 + boilIntensity * 30},${50 + boilIntensity * 20},${f.alpha})`;
      } else {
        color = `rgba(255,${80 + boilIntensity * 40},${20 + boilIntensity * 30},${f.alpha})`;
      }
      
      ctx.fillStyle = color;
      
      const sizeVariation = 1 + Math.sin(Date.now() * 0.005 + f.boil * 15) * f.boil * 0.3;
      ctx.arc(f.x, f.y, f.size * sizeVariation, 0, Math.PI * 2);
      ctx.fill();
      
      if (f.boil > 0.2) {
        ctx.beginPath();
        ctx.globalAlpha = f.alpha * 0.3;
        ctx.fillStyle = `rgba(255,200,100,${f.alpha * 0.3})`;
        ctx.arc(f.x, f.y, f.size * sizeVariation * 1.5, 0, Math.PI * 2);
        ctx.fill();
      }
    }
    
    for (let i = 0; i < sparks.length; i++) {
      const s = sparks[i];
      ctx.beginPath();
      ctx.globalAlpha = s.alpha;
      ctx.fillStyle = `rgba(255,200,100,${s.alpha})`;
      ctx.arc(s.x, s.y, s.size, 0, Math.PI * 2);
      ctx.fill();
    }
    
    ctx.globalAlpha = 1;
  }

  function createSpark(x, y, strength = 2, alpha = 0.4) {
    const count = Math.floor(2 + Math.random() * 4);
    for (let i = 0; i < count; i++) {
      const angle = (Math.random() - 0.5) * Math.PI * 0.8;
      const speed = 30 + Math.random() * 80 * strength;
      sparks.push({
        x,
        y,
        vx: Math.cos(angle) * speed,
        vy: Math.sin(angle) * speed - 20,
        size: 0.5 + Math.random() * 2 * strength,
        life: 0.3 + Math.random() * 0.5,
        maxLife: 0.3 + Math.random() * 0.5,
        alpha
      });
    }
  }

  function start() {
    if (running) return;
    createOverlay();
    overlay.style.opacity = "1";
    populateFlames();
    running = true;
    lastTs = 0;
    rafId = requestAnimationFrame(loop);
  }

  function stop() {
    if (!running) return;
    running = false;
    if (rafId) cancelAnimationFrame(rafId);
    rafId = null;
    lastTs = 0;
    if (overlay) overlay.style.opacity = "0";
    setTimeout(() => { 
      if (overlay && overlay.contains(canvas)) { 
        ctx && ctx.clearRect(0,0,canvas.width,canvas.height); 
        flames.length = 0; 
        sparks.length = 0; 
      } 
    }, 800);
  }

  function cleanup() {
    stop();
    if (overlay && overlay.parentNode) {
      overlay.parentNode.removeChild(overlay);
    }
    overlay = null;
    canvas = null;
    ctx = null;
  }

  // Export interface
  window.FireEffect = {
    start,
    stop,
    cleanup,
    init: () => {}
  };
})();
