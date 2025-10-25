// popup.js - Handle popup interactions and settings
document.addEventListener('DOMContentLoaded', function() {
    const effectCards = document.querySelectorAll('.effect-card');
    const idleDelaySlider = document.getElementById('idle-delay');
    const idleDelayValue = document.getElementById('idle-delay-value');
    const intensitySelect = document.getElementById('intensity');
    const previewBtn = document.getElementById('preview-btn');
    const testSaveBtn = document.getElementById('test-save-btn');
    const showSettingsBtn = document.getElementById('show-settings-btn');
    const saveBtn = document.getElementById('save-btn');
    const status = document.getElementById('status');

    // Load saved settings
    loadSettings();

    // Effect selection
    effectCards.forEach(card => {
        card.addEventListener('click', function() {
            effectCards.forEach(c => c.classList.remove('selected'));
            this.classList.add('selected');
        });
    });

    // Idle delay slider
    idleDelaySlider.addEventListener('input', function() {
        idleDelayValue.textContent = this.value + 's';
    });

    // Preview button
    previewBtn.addEventListener('click', function() {
        const selectedEffect = document.querySelector('.effect-card.selected').dataset.effect;
        status.textContent = `Previewing ${selectedEffect} effect...`;
        status.className = 'status success';
        
        // Send preview message to content script
        chrome.tabs.query({active: true, currentWindow: true}, function(tabs) {
            if (tabs[0]) {
                chrome.tabs.sendMessage(tabs[0].id, {
                    action: 'preview',
                    effect: selectedEffect
                }, function(response) {
                    if (chrome.runtime.lastError) {
                        console.log('Could not send preview message:', chrome.runtime.lastError);
                        status.textContent = 'Preview failed - content script not available';
                        status.className = 'status error';
                    } else {
                        console.log('Preview sent successfully');
                    }
                });
            }
        });
    });

    // Test Save button
    testSaveBtn.addEventListener('click', function() {
        const selectedCard = document.querySelector('.effect-card.selected');
        if (!selectedCard) {
            status.textContent = 'Please select an effect first!';
            status.className = 'status error';
            return;
        }

        const selectedEffect = selectedCard.dataset.effect;
        const idleDelay = parseInt(idleDelaySlider.value);
        const intensity = intensitySelect.value;

        console.log('Testing save with settings:', { selectedEffect, idleDelay, intensity });

        // Test saving to storage
        const testSettings = {
            effect: selectedEffect,
            idleDelay: idleDelay,
            intensity: intensity
        };

        chrome.storage.sync.set(testSettings, function() {
            if (chrome.runtime.lastError) {
                console.error('Test save failed:', chrome.runtime.lastError);
                status.textContent = 'Test save failed!';
                status.className = 'status error';
                return;
            }

            console.log('Test save successful:', testSettings);
            status.textContent = 'Test save successful! Settings saved to storage.';
            status.className = 'status success';

            // Test reading back from storage
            chrome.storage.sync.get(['effect', 'idleDelay', 'intensity'], function(savedSettings) {
                console.log('Read back from storage:', savedSettings);
                if (savedSettings.effect === selectedEffect && 
                    savedSettings.idleDelay === idleDelay && 
                    savedSettings.intensity === intensity) {
                    status.textContent = '✅ Test save & read successful! Settings are working.';
                    status.className = 'status success';
                } else {
                    status.textContent = '⚠️ Test save worked but read back failed.';
                    status.className = 'status error';
                }
            });
        });
    });

    // Show Settings button
    showSettingsBtn.addEventListener('click', function() {
        chrome.storage.sync.get(['effect', 'idleDelay', 'intensity'], function(settings) {
            console.log('Current settings in storage:', settings);
            status.textContent = `Current: ${settings.effect || 'none'}, ${settings.idleDelay || 'none'}s, ${settings.intensity || 'none'}`;
            status.className = 'status success';
        });
    });

    // Save button
    saveBtn.addEventListener('click', function() {
        const selectedCard = document.querySelector('.effect-card.selected');
        if (!selectedCard) {
            status.textContent = 'Please select an effect first!';
            status.className = 'status error';
            return;
        }

        const selectedEffect = selectedCard.dataset.effect;
        const idleDelay = parseInt(idleDelaySlider.value);
        const intensity = intensitySelect.value;

        console.log('Saving settings:', { selectedEffect, idleDelay, intensity });

        const settings = {
            effect: selectedEffect,
            idleDelay: idleDelay,
            intensity: intensity
        };

        // Save to Chrome storage
        chrome.storage.sync.set(settings, function() {
            if (chrome.runtime.lastError) {
                console.error('Failed to save settings:', chrome.runtime.lastError);
                status.textContent = 'Failed to save settings!';
                status.className = 'status error';
                return;
            }

            console.log('Settings saved to storage:', settings);
            status.textContent = 'Settings saved successfully!';
            status.className = 'status success';
            
            // Send settings update to content script
            chrome.tabs.query({active: true, currentWindow: true}, function(tabs) {
                if (tabs[0]) {
                    chrome.tabs.sendMessage(tabs[0].id, {
                        action: 'updateSettings',
                        settings: settings
                    }, function(response) {
                        if (chrome.runtime.lastError) {
                            console.log('Could not send message to content script:', chrome.runtime.lastError);
                            status.textContent = 'Settings saved! Refresh page to apply changes.';
                            status.className = 'status success';
                        } else {
                            console.log('Settings sent to content script successfully:', response);
                            status.textContent = 'Settings saved and applied!';
                            status.className = 'status success';
                        }
                    });
                } else {
                    status.textContent = 'Settings saved! Open a webpage to see effects.';
                    status.className = 'status success';
                }
            });
        });
    });

    function loadSettings() {
        chrome.storage.sync.get({
            effect: 'fire',
            idleDelay: 5,
            intensity: 'medium'
        }, function(settings) {
            console.log('Popup loaded settings:', settings);
            
            // Validate settings
            if (!settings.effect || !['fire', 'rain', 'snow', 'stars', 'matrix'].includes(settings.effect)) {
                settings.effect = 'fire';
            }
            if (!settings.idleDelay || settings.idleDelay < 1 || settings.idleDelay > 30) {
                settings.idleDelay = 5;
            }
            if (!settings.intensity || !['low', 'medium', 'high'].includes(settings.intensity)) {
                settings.intensity = 'medium';
            }
            
            // Select the correct effect card
            const selectedCard = document.querySelector(`[data-effect="${settings.effect}"]`);
            if (selectedCard) {
                effectCards.forEach(c => c.classList.remove('selected'));
                selectedCard.classList.add('selected');
                console.log('Selected effect card:', settings.effect);
            } else {
                console.error('Could not find effect card for:', settings.effect);
                // Fallback to fire
                const fireCard = document.querySelector('[data-effect="fire"]');
                if (fireCard) {
                    effectCards.forEach(c => c.classList.remove('selected'));
                    fireCard.classList.add('selected');
                }
            }

            // Set slider value
            idleDelaySlider.value = settings.idleDelay;
            idleDelayValue.textContent = settings.idleDelay + 's';

            // Set intensity
            intensitySelect.value = settings.intensity;
            
            console.log('Settings applied to UI:', {
                effect: settings.effect,
                idleDelay: settings.idleDelay,
                intensity: settings.intensity
            });
        });
    }

    // Test communication with content script
    function testCommunication() {
        chrome.tabs.query({active: true, currentWindow: true}, function(tabs) {
            if (tabs[0]) {
                chrome.tabs.sendMessage(tabs[0].id, {
                    action: 'test'
                }, function(response) {
                    if (chrome.runtime.lastError) {
                        console.log('Content script not available:', chrome.runtime.lastError);
                    } else {
                        console.log('Content script responded:', response);
                    }
                });
            }
        });
    }

    // Test communication on popup open
    testCommunication();
});
