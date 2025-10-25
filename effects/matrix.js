// matrix.js - CSS-based matrix effect
(() => {
  let overlay = null;
  let running = false;

  function createOverlay() {
    if (overlay) return;
    overlay = document.createElement("div");
    overlay.id = "matrix-overlay-canvas";
    overlay.style.position = "fixed";
    overlay.style.inset = "0";
    overlay.style.zIndex = "2147483647";
    overlay.style.pointerEvents = "none";
    overlay.style.opacity = "0";
    overlay.style.transition = "opacity 800ms ease";
    overlay.style.background = "linear-gradient(180deg, rgba(0,20,0,0.1) 0%, rgba(0,0,0,0.8) 100%)";

    // Create matrix container
    const matrixContainer = document.createElement("div");
    matrixContainer.className = "matrix-container";
    matrixContainer.style.position = "absolute";
    matrixContainer.style.top = "0";
    matrixContainer.style.left = "0";
    matrixContainer.style.width = "100%";
    matrixContainer.style.height = "100%";
    matrixContainer.style.overflow = "hidden";

    // Matrix characters (mix of numbers, letters, and symbols)
    const matrixChars = "01アイウエオカキクケコサシスセソタチツテトナニヌネノハヒフヘホマミムメモヤユヨラリルレロワヲン";
    const matrixChars2 = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789@#$%^&*()_+-=[]{}|;':\",./<>?";
    const allChars = matrixChars + matrixChars2;

    // Generate matrix characters
    for (let i = 0; i < 200; i++) {
      const char = document.createElement("div");
      char.className = "matrix-char";
      char.style.position = "absolute";
      char.style.left = Math.random() * 100 + "%";
      char.style.top = "-10px"; // Start from above the screen
      char.style.fontSize = (10 + Math.random() * 8) + "px";
      char.style.fontFamily = "monospace";
      char.style.color = `rgba(0, ${150 + Math.random() * 105}, 0, 0.8)`;
      char.style.animation = `matrixfall ${2 + Math.random() * 3}s linear infinite`;
      char.style.animationDelay = Math.random() * 5 + "s";
      char.textContent = allChars[Math.floor(Math.random() * allChars.length)];
      matrixContainer.appendChild(char);
    }
    
    console.log('🔢 Created 200 matrix characters');

    overlay.appendChild(matrixContainer);
    document.documentElement.appendChild(overlay);
  }

  function start() {
    console.log('🔢 Matrix effect starting...');
    if (running) {
      console.log('🔢 Matrix effect already running');
      return;
    }
    createOverlay();
    overlay.style.opacity = "1";
    running = true;
    console.log('🔢 Matrix effect started successfully');
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
    @keyframes matrixfall {
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
    
    .matrix-char {
      will-change: transform, opacity;
    }
  `;
  document.head.appendChild(style);

  // Export interface
  window.MatrixEffect = {
    start,
    stop,
    cleanup,
    init: () => {}
  };
})();