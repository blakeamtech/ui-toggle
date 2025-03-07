console.log('[injected.js] Script started');

// Wait for DOM to be ready
document.addEventListener('DOMContentLoaded', () => {
  console.log('[injected.js] DOM Content Loaded');
  
  try {
    // Method 1: Using CSS Variables
    console.log('[injected.js] Attempting to set CSS variables...');
    document.documentElement.style.setProperty('--chrome-toolbar-height', '0px');
    document.documentElement.style.setProperty('--chrome-tabs-height', '0px');
    
    // Method 2: Target specific Chrome elements
    console.log('[injected.js] Attempting to inject style element...');
    const style = document.createElement('style');
    style.textContent = `
      browser[type="content"] {
        margin-top: 0 !important;
        padding-top: 0 !important;
      }
      
      #browser-toolbar,
      #nav-bar,
      #TabsToolbar,
      #main-toolbar,
      #tabs-container,
      .browser-toolbar,
      .chrome-toolbar {
        height: 0 !important;
        min-height: 0 !important;
        max-height: 0 !important;
        opacity: 0 !important;
        visibility: hidden !important;
        margin: 0 !important;
        padding: 0 !important;
        overflow: hidden !important;
        position: fixed !important;
        top: -100px !important;
      }
    `;
    document.head.appendChild(style);
    console.log('[injected.js] Style element added successfully');

    // Method 3: Try to modify the viewport
    const meta = document.createElement('meta');
    meta.name = 'viewport';
    meta.content = 'margin-top: 0';
    document.head.appendChild(meta);
    
  } catch (e) {
    console.error('[injected.js] Failed to hide Chrome UI:', e);
  }
});

// Add hover detection to show/hide UI
document.addEventListener('mousemove', (e) => {
  console.log('[injected.js] Mouse move detected at Y:', e.clientY);
  const shouldShow = e.clientY < 100;
  
  try {
    if (shouldShow) {
      console.log('[injected.js] Mouse near top - showing UI');
      document.documentElement.style.setProperty('--chrome-toolbar-height', '');
      document.documentElement.style.setProperty('--chrome-tabs-height', '');
      document.documentElement.classList.remove('hide-chrome-ui');
    } else {
      console.log('[injected.js] Mouse away - hiding UI');
      document.documentElement.style.setProperty('--chrome-toolbar-height', '0px');
      document.documentElement.style.setProperty('--chrome-tabs-height', '0px');
      document.documentElement.classList.add('hide-chrome-ui');
    }
  } catch (e) {
    console.error('[injected.js] Error updating UI visibility:', e);
  }
});

console.log('[injected.js] Event listeners set up'); 