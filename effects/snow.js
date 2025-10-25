// snow.js - CSS-based snow effect
(() => {
  let overlay = null;
  let running = false;

  function createOverlay() {
    if (overlay) return;
    overlay = document.createElement("div");
    overlay.id = "snow-overlay-canvas";
    overlay.style.position = "fixed";
    overlay.style.inset = "0";
    overlay.style.zIndex = "2147483647";
    overlay.style.pointerEvents = "none";
    overlay.style.opacity = "0";
    overlay.style.transition = "opacity 800ms ease";
    overlay.style.background = "linear-gradient(180deg, rgba(135,206,235,0.1) 0%, rgba(255,255,255,0.05) 100%)";

    // Create snow container
    const snowContainer = document.createElement("div");
    snowContainer.className = "snow-container";
    snowContainer.style.position = "absolute";
    snowContainer.style.top = "0";
    snowContainer.style.left = "0";
    snowContainer.style.width = "100%";
    snowContainer.style.height = "100%";
    snowContainer.style.overflow = "hidden";

    // Generate snowflakes
    for (let i = 0; i < 150; i++) {
      const flake = document.createElement("div");
      flake.className = "snowflake";
      flake.style.position = "absolute";
      flake.style.left = Math.random() * 100 + "%";
      flake.style.top = Math.random() * 100 + "%";
      flake.style.fontSize = (8 + Math.random() * 16) + "px";
      flake.style.color = "rgba(255,255,255,0.8)";
      flake.style.animation = `snowfall ${3 + Math.random() * 4}s linear infinite`;
      flake.style.animationDelay = Math.random() * 5 + "s";
      flake.textContent = "❄";
      snowContainer.appendChild(flake);
    }

    overlay.appendChild(snowContainer);
    document.documentElement.appendChild(overlay);
  }

  function start() {
    console.log('❄️ Snow effect starting...');
    if (running) {
      console.log('❄️ Snow effect already running');
      return;
    }
    createOverlay();
    overlay.style.opacity = "1";
    running = true;
    console.log('❄️ Snow effect started successfully');
  }

  function stop() {
    if (!running) return;
    running = false;
    if (overlay) overlay.style.opacity = "0";
    setTimeout(() => { 
      if (overlay && overlay.parentNode) { 
        overlay.parentNode.removeChild(overlay);
        overlay = null;
      } 
    }, 800);
  }

  function cleanup() {
    stop();
  }

  // Add CSS animation
  const style = document.createElement("style");
  style.textContent = `
    @keyframes snowfall {
      0% {
        transform: translateY(-100vh) translateX(0px);
        opacity: 0;
      }
      10% {
        opacity: 1;
      }
      90% {
        opacity: 1;
      }
      100% {
        transform: translateY(100vh) translateX(50px);
        opacity: 0;
      }
    }
  `;
  document.head.appendChild(style);

  // Export interface
  window.SnowEffect = {
    start,
    stop,
    cleanup,
    init: () => {}
  };
})();