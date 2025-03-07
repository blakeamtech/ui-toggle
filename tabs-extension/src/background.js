// This script runs in the background
chrome.runtime.onInstalled.addListener(() => {
  console.log('Hide Tabs and Search Bar extension installed');
});

// Listen for commands to toggle UI visibility
chrome.commands.onCommand.addListener((command) => {
  if (command === "toggle-fullscreen") {
    toggleUI();
  }
});

let isEnabled = true;
let timeoutId = null;
let isProcessing = false;

// Initialize extension state
chrome.storage.local.get(['isEnabled'], (result) => {
  isEnabled = result.isEnabled !== undefined ? result.isEnabled : true;
  updateIcon(isEnabled);
});

// Function to update the extension icon
function updateIcon(enabled) {
  chrome.action.setTitle({
    title: enabled ? 'UI Hide: Enabled (Click to disable)' : 'UI Hide: Disabled (Click to enable)'
  });
  
  chrome.action.setBadgeText({
    text: enabled ? 'ON' : 'OFF'
  });
  
  chrome.action.setBadgeBackgroundColor({
    color: enabled ? '#4CAF50' : '#757575'
  });

  // If disabled, exit fullscreen
  if (!enabled) {
    chrome.windows.getCurrent(async (window) => {
      if (window.state === "fullscreen") {
        await chrome.windows.update(window.id, { state: "normal" });
      }
    });
  }
}

// Create navigation UI
function injectNavigationUI(tabId) {
  chrome.scripting.insertCSS({
    target: { tabId },
    css: `
      .mini-nav {
        position: fixed;
        top: 10px;
        left: 10px;
        z-index: 9999;
        background: rgba(0, 0, 0, 0.7);
        padding: 5px;
        border-radius: 5px;
        display: flex;
        gap: 10px;
        opacity: 0.2;
        transition: opacity 0.3s;
      }
      .mini-nav:hover {
        opacity: 1;
      }
      .nav-button {
        color: white;
        background: none;
        border: none;
        cursor: pointer;
        padding: 5px 10px;
        font-size: 16px;
      }
      .nav-button:hover {
        background: rgba(255, 255, 255, 0.1);
        border-radius: 3px;
      }
    `
  });

  chrome.scripting.executeScript({
    target: { tabId },
    function: () => {
      // Remove existing navigation if present
      const existingNav = document.querySelector('.mini-nav');
      if (existingNav) {
        existingNav.remove();
      }
      
      // Create new navigation
      const nav = document.createElement('div');
      nav.className = 'mini-nav';
      nav.innerHTML = `
        <button class="nav-button" id="backBtn">←</button>
        <button class="nav-button" id="forwardBtn">→</button>
      `;
      document.body.appendChild(nav);

      document.getElementById('backBtn').addEventListener('click', () => {
        history.back();
      });
      document.getElementById('forwardBtn').addEventListener('click', () => {
        history.forward();
      });
    }
  });
}

// Function to check if we can inject into this tab
function canInjectIntoTab(tab) {
  return tab.url && !tab.url.startsWith('chrome://') && 
         !tab.url.startsWith('edge://') && 
         !tab.url.startsWith('chrome-extension://') &&
         !tab.url.startsWith('about:') &&
         !tab.url.startsWith('chrome-error://');
}

// Handle extension icon click
chrome.action.onClicked.addListener(async (tab) => {
  // Toggle the state
  isEnabled = !isEnabled;
  
  // Store the new state
  await chrome.storage.local.set({ isEnabled });
  updateIcon(isEnabled);
  
  // If turning off, exit fullscreen
  if (!isEnabled) {
    const window = await chrome.windows.getCurrent();
    if (window.state === "fullscreen") {
      await chrome.windows.update(window.id, { state: "normal" });
    }
  }
});

// Only perform actions if enabled
function canPerformActions() {
  return isEnabled;
}

// Update the tabs.onUpdated listener
chrome.tabs.onUpdated.addListener((tabId, changeInfo, tab) => {
  if (!canPerformActions()) return;
  if (changeInfo.status === 'complete' && canInjectIntoTab(tab)) {
    chrome.scripting.executeScript({
      target: { tabId },
      function: () => {
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
          }
        });
      }
    }).catch(error => console.log('Script injection failed:', error));
    
    // Add navigation UI if in fullscreen and enabled
    if (isEnabled) {
      chrome.windows.getCurrent((window) => {
        if (window.state === "fullscreen") {
          injectNavigationUI(tabId);
        }
      });
    }
  }
});

// Listen for messages from content script
chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
  if (!canPerformActions()) return;
  if (message.action === 'setUIState') {
    chrome.windows.getCurrent({}, (window) => {
      if (message.state === 'hidden') {
        // Hide UI elements
        chrome.windows.update(window.id, {
          state: 'fullscreen'
        });
      } else {
        // Show UI elements but keep window maximized
        chrome.windows.update(window.id, {
          state: 'maximized'
        });
      }
    });
  }
});

// Function to toggle UI state
function toggleUI() {
  if (!canPerformActions()) return;
  chrome.windows.getCurrent({}, (window) => {
    const newState = window.state === 'fullscreen' ? 'maximized' : 'fullscreen';
    chrome.windows.update(window.id, {
      state: newState
    });
  });
} 