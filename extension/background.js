// TweetRocket — Background Service Worker

chrome.runtime.onInstalled.addListener(() => {
  // Default to popup mode
  chrome.storage.local.set({ tr_mode: 'popup' });
  // Ensure side panel is disabled by default
  chrome.sidePanel.setOptions({ enabled: false });
});

// Listen for mode toggle messages from app.js
chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
  if (message.type === 'SET_MODE') {
    const mode = message.mode; // 'popup' or 'sidebar'
    chrome.storage.local.set({ tr_mode: mode });

    if (mode === 'sidebar') {
      // Remove popup so clicking the icon opens the side panel
      chrome.action.setPopup({ popup: '' });
      chrome.sidePanel.setOptions({ path: 'app.html', enabled: true });
    } else {
      // Restore popup, disable side panel
      chrome.sidePanel.setOptions({ enabled: false });
      chrome.action.setPopup({ popup: 'app.html' });
    }

    sendResponse({ ok: true });
  }
});

// When in sidebar mode, clicking the action icon opens the side panel
chrome.action.onClicked.addListener((tab) => {
  chrome.storage.local.get('tr_mode', (data) => {
    if (data.tr_mode === 'sidebar') {
      chrome.sidePanel.open({ tabId: tab.id });
    }
  });
});
