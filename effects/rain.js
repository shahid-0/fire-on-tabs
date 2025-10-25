// rain.js - CSS-based rain effect
(() => {
  let overlay = null;
  let running = false;

  function createOverlay() {
    if (overlay) return;
    overlay = document.createElement("div");
    overlay.id = "rain-overlay-canvas";
    overlay.style.position = "fixed";
    overlay.style.inset = "0";
    overlay.style.zIndex = "2147483647";
    overlay.style.pointerEvents = "none";
    overlay.style.opacity = "0";
    overlay.style.transition = "opacity 800ms ease";
    overlay.style.background = "linear-gradient(180deg, rgba(0,0,0,0.1) 0%, rgba(0,0,0,0.3) 100%)";

    // Create rain container
    const rainContainer = document.createElement("div");
    rainContainer.className = "rain-container";
    rainContainer.style.position = "absolute";
    rainContainer.style.top = "0";
    rainContainer.style.left = "0";
    rainContainer.style.width = "100%";
    rainContainer.style.height = "100%";
    rainContainer.style.overflow = "hidden";

    // Generate raindrops
    for (let i = 0; i < 100; i++) {
      const drop = document.createElement("div");
      drop.className = "raindrop";
      drop.style.position = "absolute";
      drop.style.left = Math.random() * 100 + "%";
      drop.style.top = Math.random() * 100 + "%";
      drop.style.width = "1px";
      drop.style.height = (20 + Math.random() * 40) + "px";
      drop.style.background = "linear-gradient(to bottom, transparent, rgba(255,255,255,0.6))";
      drop.style.animation = `rainfall ${2 + Math.random() * 3}s linear infinite`;
      drop.style.animationDelay = Math.random() * 3 + "s";
      rainContainer.appendChild(drop);
    }

    overlay.appendChild(rainContainer);
    document.documentElement.appendChild(overlay);
  }

  function start() {
    if (running) return;
    createOverlay();
    overlay.style.opacity = "1";
    running = true;
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
    @keyframes rainfall {
      0% {
        transform: translateY(-100vh);
        opacity: 0;
      }
      10% {
        opacity: 1;
      }
      90% {
        opacity: 1;
      }
      100% {
        transform: translateY(100vh);
        opacity: 0;
      }
    }
  `;
  document.head.appendChild(style);

  // Export interface
  window.RainEffect = {
    start,
    stop,
    cleanup,
    init: () => {}
  };
})();
