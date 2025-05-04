console.log("Background script loaded.");

// Basic listener example (will be replaced with actual logic later)
chrome.runtime.onInstalled.addListener(() => {
  console.log("Extension installed.");
});

// Placeholder for Firefox compatibility if needed
if (typeof browser !== "undefined" && browser.runtime?.onInstalled) {
  browser.runtime.onInstalled.addListener(() => {
    console.log("Extension installed (Firefox).");
  });
}

import { type1, noone } from './rules';
import type { cdncompany } from './rules';
import { detectCdnByCname } from './dns.ff';
async function onRequest(details) {
  const tabId = details.tabId;
  if (tabId == -1) {
    return;
  }

  let find_detector: cdncompany | undefined = undefined;
  for (const detector of type1) {
    const match = detector.detect(details);
    if (match) {
      console.log(detector.name())
      find_detector = detector;
      break;
    }
  }
  if (find_detector === undefined) {
    // 这里是调用dns.ff.ts中的函数
    find_detector = await detectCdnByCname(new URL(details.url).hostname);
    console.log(find_detector.name());
  }
  if (find_detector === undefined) {
    find_detector = noone;
    console.log(find_detector.name());
  }
  updateBadge(tabId, find_detector.icon(), find_detector.name(), find_detector.pop(details));
}

function updateBadge(tabId, cdnIcon, cdnName, pop) {
  browser.action.setIcon({
    path: `icons/${cdnIcon}.png`,
    tabId: tabId,
  });

  if (pop) {
    pop = pop.toUpperCase();

    browser.action.setBadgeText({
      text: pop,
      tabId: tabId,
    });
  }

  let title = cdnName;
  if (pop) {
    title += ` (${pop})`;
  }

  browser.action.setTitle({ title, tabId });
}

browser.webRequest.onCompleted.addListener(
  onRequest,
  {
    urls: ['<all_urls>'],
    types: ['main_frame']
  },
  ['responseHeaders']
);

browser.action.setBadgeBackgroundColor({
  color: 'rgba(243, 128, 32, 0.5)',
});

browser.action.setBadgeTextColor({
  color: '#fff',
});
