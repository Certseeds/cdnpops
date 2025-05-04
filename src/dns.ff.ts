import type { cdncompany } from './rules';
import { noone } from './rules';

let cisagovConfig: Record<string, string>;
let sukkalabConfig: Record<string, string>;

async function loadConfigs() {
  if (!cisagovConfig || !sukkalabConfig) {
    const [cisa, sukka] = await Promise.all([
      fetch(browser.runtime.getURL('cisagov.json')).then(r => r.json()),
      fetch(browser.runtime.getURL('sukkalab.json')).then(r => r.json()),
    ]);
    cisagovConfig = cisa;
    sukkalabConfig = sukka;
  }
}

const well_known = (name: string) => {
  const icons = {
    'Cloudflare': 'cloudflare-32',
    'Fastly': 'fastly-32',
    'Cloudfront': 'cloudfront-32',
    'Bunny': 'bunny-32',
    'Akamai': 'akamai-32',
    'CDN77': 'cdn77-32',
    'Keycdn': 'keycdn-32',
    'Netlify': 'netlify-32',
    'github': 'github-32',
    'bytedance': 'bytedance-cloud-32',
    'alibaba': 'alibaba-cloud-32',
    'Tencent': 'tencent-cloud-32'
  };
  return icons[name] || 'cdn-32';
}

const keywords = (name: string) =>{
  const keywords = {
    "腾讯": 'tencent-cloud-32',
    "阿里": 'alibaba-cloud-32',
    "字节": 'bytedance-cloud-32',
  }
  return keywords[name] || 'cdn-32';
}

function makeCdn(name: string): cdncompany {
  const icon = well_known(name) ?? keywords(name);
  return {
    detect: () => true,
    pop: () => '',
    shortPop: () => '',
    icon: () => icon,
    name: () => name,
  };
}

export async function detectCdnByCname(domain: string): Promise<cdncompany> {
  await loadConfigs();
  let current = domain;
  const visited = new Set<string>();
  while (true) {
    if (visited.has(current)) break;
    visited.add(current);
    try {
      const resp = await browser.dns.resolve(current, ['canonical_name']);
      const cname = (resp as any).canonicalName;
      console.log(cname);
      if (cname && cname !== current) {
        visited.add(cname); // 确保将 cname 添加到 visited 集合中
        current = cname;
        continue;
      }
    } catch {
      break;
    }
    break;
  }
  // 优先匹配 sukkalab.json
  for (const key in sukkalabConfig) {
    if ([...visited].some(v => v.endsWith(key))) {
      return makeCdn(sukkalabConfig[key]);
    }
  }
  // 其次匹配 cisagov.json
  for (const key in cisagovConfig) {
    if ([...visited].some(v => v.endsWith(key))) {
      return makeCdn(cisagovConfig[key]);
    }
  }
  return noone;
}
