// stars.js - Twinkling stars with shooting stars effect
(() => {
  const stars = [];
  const shootingStars = [];
  const maxStars = 150;
  let overlay = null;
  let canvas = null;
  let ctx = null;
  let running = false;
  let rafId = null;
  let lastTs = 0;

  function createOverlay() {
    if (overlay) return;
    overlay = document.createElement("div");
    overlay.id = "stars-overlay-canvas";
    overlay.style.position = "fixed";
    overlay.style.inset = "0";
    overlay.style.zIndex = "2147483647";
    overlay.style.pointerEvents = "none";
    overlay.style.opacity = "0";
    overlay.style.transition = "opacity 800ms ease";
    overlay.style.background = "radial-gradient(ellipse at center, rgba(0,0,20,0.3) 0%, rgba(0,0,0,0.8) 100%)";

    canvas = document.createElement("canvas");
    canvas.id = "stars-canvas";
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

  function spawnStar() {
    const x = Math.random() * window.innerWidth;
    const y = Math.random() * window.innerHeight;
    const size = 0.5 + Math.random() * 2;
    const twinkleSpeed = 0.5 + Math.random() * 2;
    const depth = Math.random();
    return { 
      x, 
      y, 
      size, 
      alpha: 0.3 + Math.random() * 0.7,
      twinkleSpeed,
      twinklePhase: Math.random() * Math.PI * 2,
      depth,
      originalAlpha: 0.3 + Math.random() * 0.7
    };
  }

  function spawnShootingStar() {
    const x = Math.random() * window.innerWidth;
    const y = -20;
    const speed = 200 + Math.random() * 300;
    const angle = Math.random() * Math.PI * 0.3 + Math.PI * 0.1; // Slight downward angle
    const life = 1 + Math.random() * 1.5;
    return {
      x,
      y,
      vx: Math.cos(angle) * speed,
      vy: Math.sin(angle) * speed,
      life,
      maxLife: life,
      alpha: 0.8,
      size: 1 + Math.random() * 2,
      trail: []
    };
  }

  function populateStars() {
    stars.length = 0;
    for (let i = 0; i < Math.min(100, maxStars); i++) {
      stars.push(spawnStar());
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
    // Update twinkling stars
    for (let i = 0; i < stars.length; i++) {
      const s = stars[i];
      s.twinklePhase += s.twinkleSpeed * dt;
      s.alpha = s.originalAlpha * (0.5 + 0.5 * Math.sin(s.twinklePhase));
    }

    // Spawn shooting stars occasionally
    if (Math.random() < 0.001 && shootingStars.length < 3) {
      shootingStars.push(spawnShootingStar());
    }

    // Update shooting stars
    for (let i = shootingStars.length - 1; i >= 0; i--) {
      const ss = shootingStars[i];
      ss.life -= dt;
      ss.x += ss.vx * dt;
      ss.y += ss.vy * dt;
      
      // Add to trail
      ss.trail.push({x: ss.x, y: ss.y, alpha: ss.alpha});
      if (ss.trail.length > 20) ss.trail.shift();
      
      ss.alpha = (ss.life / ss.maxLife) * 0.8;
      
      if (ss.life <= 0 || ss.x > window.innerWidth + 100 || ss.y > window.innerHeight + 100) {
        shootingStars.splice(i, 1);
      }
    }
  }

  function draw() {
    if (!ctx) return;
    ctx.clearRect(0, 0, window.innerWidth, window.innerHeight);
    
    // Draw twinkling stars
    for (let i = 0; i < stars.length; i++) {
      const s = stars[i];
      ctx.beginPath();
      ctx.globalAlpha = s.alpha;
      ctx.fillStyle = `rgba(255,255,255,${s.alpha})`;
      ctx.arc(s.x, s.y, s.size, 0, Math.PI * 2);
      ctx.fill();
      
      // Add subtle glow for brighter stars
      if (s.alpha > 0.6) {
        ctx.beginPath();
        ctx.globalAlpha = s.alpha * 0.3;
        ctx.fillStyle = `rgba(255,255,255,${s.alpha * 0.3})`;
        ctx.arc(s.x, s.y, s.size * 2, 0, Math.PI * 2);
        ctx.fill();
      }
    }
    
    // Draw shooting stars with trails
    for (let i = 0; i < shootingStars.length; i++) {
      const ss = shootingStars[i];
      
      // Draw trail
      for (let j = 0; j < ss.trail.length - 1; j++) {
        const point = ss.trail[j];
        const nextPoint = ss.trail[j + 1];
        const trailAlpha = (j / ss.trail.length) * ss.alpha * 0.6;
        
        ctx.beginPath();
        ctx.globalAlpha = trailAlpha;
        ctx.strokeStyle = `rgba(255,255,255,${trailAlpha})`;
        ctx.lineWidth = 2;
        ctx.moveTo(point.x, point.y);
        ctx.lineTo(nextPoint.x, nextPoint.y);
        ctx.stroke();
      }
      
      // Draw shooting star head
      ctx.beginPath();
      ctx.globalAlpha = ss.alpha;
      ctx.fillStyle = `rgba(255,255,255,${ss.alpha})`;
      ctx.arc(ss.x, ss.y, ss.size, 0, Math.PI * 2);
      ctx.fill();
    }
    
    ctx.globalAlpha = 1;
  }

  function start() {
    if (running) return;
    createOverlay();
    overlay.style.opacity = "1";
    populateStars();
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
        stars.length = 0; 
        shootingStars.length = 0;
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
  window.StarsEffect = {
    start,
    stop,
    cleanup,
    init: () => {} // No initialization needed
  };
})();
