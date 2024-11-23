import {onMessage, sendMessage} from 'webext-bridge/background'
import type {Tabs, WebRequest} from 'webextension-polyfill'
import {level1, noone} from './rules'
// only on dev mode
if (import.meta.hot) {
  // @ts-expect-error for background HMR
  import('/@vite/client')
  // load latest content script
  import('./contentScriptHMR')
}

// remove or turn this off if you don't use side panel
const USE_SIDE_PANEL = true

// to toggle the sidepanel with the action button in chromium:
if (USE_SIDE_PANEL) {
  // @ts-expect-error missing types
  browser.sidePanel
    .setPanelBehavior({openPanelOnActionClick: true})
    .catch((error: unknown) => console.error(error))
}

browser.runtime.onInstalled.addListener((): void => {
  // eslint-disable-next-line no-console
  console.log('Extension installed')
})

let previousTabId = 0

/// const hostnames = new Set();
const onCompletedFunc = (details: WebRequest.OnCompletedDetailsType) => {
  const tabId = details.tabId;
  const requestType = details.type;

  const url = details.url;
  const URLObject = new URL(url);
  const hostname = URLObject.hostname;
  /// hostnames.add(hostname);

  switch (requestType) {
    case 'main_frame': {
      console.log(hostname);
      let flag = false;
      for (const company of level1) {
        if (company.detect(details)) {
          const pop = company.pop(details);
          const shortPop = company.shortPop(pop);
          const icon = company.icon();
          const name = company.name();
          console.log(`company ${name} ${shortPop} ${pop}`);
          browser.action.setIcon({
            tabId: tabId,
            path: {
              "32": icon,
            }
          }).then(() => {
            console.log(`set Badge Text`);
            return browser.action.setBadgeText({
              tabId: tabId,
              text: shortPop,
            });
          }).then(() => {
            console.log(`set Title`);
            return browser.action.setTitle({
              tabId: tabId,
              title: `${name} ${pop}`,
            });
          });
          flag = true;
          break;
        }
      }
      if (!flag) {
        browser.action.setIcon({
          tabId: tabId,
          path: {
            "32": noone.icon(),
          }
        }).then(() => {
          return browser.action.setBadgeText({
            tabId: tabId,
            text: noone.shortPop(noone.pop(details)),
          });
        }).then(() => {
          return browser.action.setTitle({
            tabId: tabId,
            title: `${noone.name()} ${noone.pop(details)}`,
          });
        });
      }
    }
      break;
    default: {

    }
  }
}

browser.webRequest.onCompleted.addListener(
  onCompletedFunc,
  {
    urls: ['<all_urls>']
  },
  ['responseHeaders']
)
// communication example: send previous tab title from background page
// see shim.d.ts for type declaration
browser.tabs.onActivated.addListener(async ({tabId}) => {
  if (!previousTabId) {
    previousTabId = tabId
    return
  }

  let tab: Tabs.Tab

  try {
    tab = await browser.tabs.get(previousTabId)
    previousTabId = tabId
  } catch {
    return
  }

  // eslint-disable-next-line no-console
  console.log('previous tab', tab)
  sendMessage('tab-prev', {title: tab.title}, {context: 'content-script', tabId})
})

onMessage('get-current-tab', async () => {
  try {
    const tab = await browser.tabs.get(previousTabId)
    return {
      title: tab?.title,
    }
  } catch {
    return {
      title: undefined,
    }
  }
})
