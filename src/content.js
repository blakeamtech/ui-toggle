// Create a detection zone at the top of the window
const createDetectionZone = () => {
  const detectionZone = document.createElement('div');
  detectionZone.id = 'tab-detection-zone';
  detectionZone.style.position = 'fixed';
  detectionZone.style.top = '0';
  detectionZone.style.left = '0';
  detectionZone.style.width = '100%';
  detectionZone.style.height = '10px';
  detectionZone.style.zIndex = '2147483647'; // Maximum z-index
  detectionZone.style.pointerEvents = 'none'; // Allow clicks to pass through
  
  document.body.appendChild(detectionZone);
  
  return detectionZone;
};

// Main initialization
const init = () => {
  const detectionZone = createDetectionZone();
  let timeout;
  const HOVER_AREA_HEIGHT = 10; // pixels from top to trigger UI
  let isTransitioning = false;

  // Initially hide UI
  setTimeout(() => {
    chrome.runtime.sendMessage({ action: 'setUIState', state: 'hidden' });
  }, 1000);

  document.addEventListener('mousemove', (e) => {
    if (isTransitioning) return;

    if (e.clientY <= HOVER_AREA_HEIGHT) {
      if (timeout) {
        clearTimeout(timeout);
        timeout = null;
      }
      
      // Show UI
      chrome.runtime.sendMessage({ action: 'setUIState', state: 'visible' });
    } else {
      if (timeout) {
        clearTimeout(timeout);
      }
      
      timeout = setTimeout(() => {
        // Hide UI
        chrome.runtime.sendMessage({ action: 'setUIState', state: 'hidden' });
      }, 1000);
    }
  });

  // Handle F11 key press
  document.addEventListener('keydown', (e) => {
    if (e.key === 'F11') {
      e.preventDefault();
      chrome.runtime.sendMessage({ action: 'setUIState', state: 'hidden' });
    }
  });

  let shiftKeyPressed = false;

  document.addEventListener('keydown', (e) => {
    if (e.key === 'Shift') shiftKeyPressed = true;
  });

  document.addEventListener('keyup', (e) => {
    if (e.key === 'Shift') shiftKeyPressed = false;
  });

  chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
    if (message.action === "checkShiftKey") {
      sendResponse({ shiftKey: shiftKeyPressed });
      return true; // Keep the message channel open for the async response
    }
  });
};

// Initialize when ready
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', init);
} else {
  init();
} 