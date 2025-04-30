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
function onRequest(details) {
  console.log(details);
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
    find_detector = noone;
  }
  updateBadge(tabId, find_detector.icon(), find_detector.name(), find_detector.pop(details));
  // 接下来大概是添加一些规则判断函数, 然后添加chrome的DOH函数, 以及firefox的dns调用函数.
  // else {
  //   let hostname = new URL(details.url).hostname;
  //   browser.dns.resolve(hostname, ['canonical_name']).then(resp => {
  //     let canonicalName = resp['canonicalName'];
  //     console.log(`Resolved ${hostname} to CNAME ${canonicalName}`);

  //     for (const detector of cnameDetectors) {
  //       for (const domain of detector.domains) {
  //         if (canonicalName.endsWith(domain)) {
  //           updateBadge(tabId, detector.slug, detector.name, null);
  //           return;
  //         }
  //       }
  //     }
  //   });
  // }
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
