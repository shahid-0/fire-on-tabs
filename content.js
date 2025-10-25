// content.js - Visual Effects Manager
(() => {
  let idleTimer = null;
  let currentEffect = null;
  let settings = {
    effect: 'fire',
    idleDelay: 5000,
    intensity: 'medium'
  };

  // Load settings from Chrome storage
  function loadSettings(callback) {
    chrome.storage.sync.get(
      ['effect', 'idleDelay', 'intensity'],
      (savedSettings) => {
        settings.effect = savedSettings.effect || 'fire';
        settings.idleDelay = (savedSettings.idleDelay || 5) * 1000; // seconds → ms
        settings.intensity = savedSettings.intensity || 'medium';
        console.log('✅ Loaded settings:', settings);
        if (callback) callback();
      }
    );
  }

  // Effect modules mapping - check if effects are loaded
  const effectModules = {
    fire: window.FireEffect,
    rain: window.RainEffect,
    snow: window.SnowEffect,
    stars: window.StarsEffect,
    matrix: window.MatrixEffect
  };

  // Debug: Log effect availability
  console.log('Effect modules loaded:', {
    fire: !!window.FireEffect,
    rain: !!window.RainEffect,
    snow: !!window.SnowEffect,
    stars: !!window.StarsEffect,
    matrix: !!window.MatrixEffect
  });

  function checkAvailableEffects() {
    const available = {
      fire: !!window.FireEffect,
      rain: !!window.RainEffect,
      snow: !!window.SnowEffect,
      stars: !!window.StarsEffect,
      matrix: !!window.MatrixEffect
    };
    console.log('Available effects:', available);
    
    // Check if the current effect is available
    if (!available[settings.effect]) {
      console.warn(`⚠️ Selected effect '${settings.effect}' is not available!`);
      console.log('Available effects:', Object.keys(available).filter(key => available[key]));
    }
  }

  function cleanupEffect() {
    if (currentEffect) {
      try {
        currentEffect.stop();
        currentEffect.cleanup();
      } catch (err) {
        console.warn('Error during cleanup:', err);
      }
      currentEffect = null;
    }
  }

  function startEffect() {
    try {
      console.log('✨ Starting effect:', settings.effect);
      cleanupEffect();

      setTimeout(() => {
        console.log('🔍 Looking for effect:', settings.effect);
        console.log('🔍 Available modules:', Object.keys(effectModules));
        console.log('🔍 Effect modules state:', effectModules);
        
        const EffectClass = effectModules[settings.effect];
        if (!EffectClass) {
          console.error(
            `❌ Effect '${settings.effect}' not found. Available:`,
            Object.keys(effectModules).filter(key => effectModules[key])
          );

          // fallback to fire effect
          if (window.FireEffect) {
            console.log('🔥 Falling back to FireEffect');
            currentEffect = window.FireEffect;
            currentEffect.start();
          }
          return;
        }

        console.log('🎬 Starting effect class:', EffectClass);
        currentEffect = EffectClass;
        currentEffect.start();
        console.log('✅ Effect started:', settings.effect);
      }, 200);
    } catch (error) {
      console.error('Failed to start effect:', error);
    }
  }

  function stopEffect() {
    if (currentEffect && typeof currentEffect.stop === 'function') {
      currentEffect.stop();
    }
  }

  function resetIdleTimer() {
    clearTimeout(idleTimer);
    stopEffect();
    idleTimer = setTimeout(startEffect, settings.idleDelay);
  }

  // Listen for messages from popup or background
  function handleMessage(request, sender, sendResponse) {
    console.log('📩 Received message:', request);

    if (request.action === 'test') {
      sendResponse({ success: true, message: 'Content script active' });
    } else if (request.action === 'preview') {
      stopEffect();
      const EffectClass = effectModules[request.effect];
      if (EffectClass) {
        const previewEffect = EffectClass;
        previewEffect.start();

        setTimeout(() => {
          previewEffect.stop();
          if (previewEffect.cleanup) previewEffect.cleanup();
        }, 3000);
      }
      sendResponse({ success: true });
    } else if (request.action === 'updateSettings') {
      console.log('⚙️ Updating settings:', request.settings);
      settings = {
        effect: request.settings.effect || 'fire',
        idleDelay: (request.settings.idleDelay || 5) * 1000,
        intensity: request.settings.intensity || 'medium'
      };

      chrome.storage.sync.set(
        {
          effect: settings.effect,
          idleDelay: settings.idleDelay / 1000, // store in seconds
          intensity: settings.intensity
        },
        () => {
          console.log('💾 Settings saved to storage:', settings);
        }
      );

      resetIdleTimer();
      sendResponse({ success: true, settings });
    }

    return true;
  }

  function init() {
    loadSettings(() => {
      checkAvailableEffects();

      ['mousemove', 'keydown', 'scroll', 'click', 'touchstart'].forEach((evt) =>
        window.addEventListener(evt, resetIdleTimer, { passive: true })
      );

      window.addEventListener('visibilitychange', () => {
        if (document.visibilityState === 'visible') {
          resetIdleTimer();
        } else {
          stopEffect();
        }
      });

      chrome.runtime.onMessage.addListener(handleMessage);

      setTimeout(() => {
        checkAvailableEffects();
        resetIdleTimer();
      }, 500);
    });
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }
})();
