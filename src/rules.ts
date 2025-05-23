
interface cdncompany {
  detect(details): boolean;

  pop(details): string;

  shortPop(pop: string): string

  icon(): string;

  name(): string;
}

const none: cdncompany = {
  detect: (details) => {
    return false;
  },
  pop: (details) => {
    return "NO";
  },
  shortPop(pop: string): string {
    return "NO";
  },
  icon: () => {
    return 'cdn-gray-32';
  },
  name: () => {
    return "NO";
  }
}
export const noone = none;

const getHeader = (request, needle: string) => {
  const lowNeedle = needle.toLowerCase();
  if (!request.responseHeaders) {
    return;
  }
  for (const header of request.responseHeaders) {
    if (header.name.toLowerCase() == lowNeedle) {
      return header.value;
    }
  }
}

const cloudflare: cdncompany = {
  detect: (details) => {
    const header = getHeader(details, 'Cf-ray');
    const server = getHeader(details, "Server");
    return header !== undefined && (server === "cloudflare");
  },
  pop: (details) => {
    const header = getHeader(details, 'cf-ray');
    const pop1 = header?.split("-")[1];
    console.log(`cloudflare ${pop1}`);
    const pop2 = header?.slice(-3) ?? "";
    console.log(`cloudflare ${header} ${pop2}`);
    return pop1 ?? pop2;
  },
  shortPop(pop: string): string {
    return pop;
  },
  icon: () => {
    return 'cloudflare-32';
  },
  name: () => {
    return "Cloudflare";
  }
}
const fastlyRegex: RegExp = /^[Ss]\d+\.\d+,[Vv][Ss]\d+,[Vv][Ee]\d+$/;
const fastly: cdncompany = {
  detect: (details) => {
    const server = getHeader(details, "server")?.toLowerCase();
    const fastlyRestarts = getHeader(details, "fastly-restarts");
    const xTimer = getHeader(details, "x-timer") ?? "";
    return (server === "artisanal bits") ||
      (fastlyRestarts !== undefined) ||
      fastlyRegex.test(xTimer);
  },
  pop: (details) => {
    const header = getHeader(details, 'x-served-by');
    const pop1 = header?.split("-").at(-1);
    console.log(`fastly ${pop1}`);
    const pop2 = header?.slice(-3) ?? "";
    console.log(`fastly ${header} ${pop2}`);
    return pop1 ?? pop2;
  },
  shortPop(pop: string): string {
    return pop;
  },
  icon: () => {
    return 'fastly-32';
  },
  name: () => {
    return "Fastly";
  }
}

const cloudfront: cdncompany = {
  detect: (details) => {
    const header = getHeader(details, 'x-amz-cf-pop');
    const server = getHeader(details, "server");
    return header !== undefined && (server === "Server");
  },
  pop: (details) => {
    const header = getHeader(details, 'x-amz-cf-pop');
    const pop = header?.slice(0, 3) ?? "";
    return pop;
  },
  shortPop(pop: string): string {
    return pop;
  },
  icon: () => {
    return 'cloudfront-32';
  },
  name: () => {
    return "CloudFront";
  }
}

// it seems gcore do not using header to verify itself
// TODO, add cname rule to it

const bunny: cdncompany = {
  detect: (details) => {
    const server = getHeader(details, "server");
    const verifyPart = server?.split("-")[0];
    return verifyPart === "BunnyCDN";
  },
  pop: (details) => {
    const server = getHeader(details, "server");
    return server?.split("-")[1] ?? "";
  },
  shortPop(pop: string): string {
    return pop;
  },
  icon: () => {
    return 'bunny-32';
  },
  name: () => {
    return "Bunny";
  }
}

/**
 * it seems azure CDN is a wrapper of Akamai
 * 真丢人, akamai自家页面上用了cloudflare来加载资源
 **/
const akamai: cdncompany = {
  detect: (details) => {
    const server = getHeader(details, "x-akamai-transformed");
    return server !== undefined;
  },
  pop: (details) => {
    return "?";
  },
  shortPop(pop: string): string {
    return "?";
  },
  icon: () => {
    return 'akamai-32';
  },
  name: () => {
    return "Akamai";
  }
}

const cdn77: cdncompany = {
  detect: (details) => {
    const server = getHeader(details, "server");
    const pop = getHeader(details, "X-77-Pop");
    return (pop !== undefined) && (server === "CDN77-Turbo");
  },
  pop: (details) => {
    return getHeader(details, "X-77-Pop") ?? "";
  },
  shortPop(pop: string): string {
    const upper = pop
      .split('')
      .filter((c) => {
        return 'A' <= c && c <= 'Z';
      }).join('');
    return upper;
  },
  icon: () => {
    return 'cdn77-32'
  },
  name: () => {
    return "CDN77";
  }
}

const keycdn: cdncompany = {
  detect: (details) => {
    const server = getHeader(details, "server");
    const pop = getHeader(details, "x-edge-location");
    return (pop !== undefined) && (server === "keycdn");
  },
  pop: (details) => {
    const pop = getHeader(details, "x-edge-location") ?? "";
    return pop;
  },
  shortPop(pop: string): string {
    return pop.slice(0, 4);
  },
  icon: () => {
    return 'keycdn-32';
  },
  name: () => {
    return "KeyCDN";
  }
}

const netlifyCDN: cdncompany = {
  detect: (details) => {
    const server = getHeader(details, "server");
    const netlifyVary = getHeader(details, "netlify-vary");
    const netlifyId = getHeader(details, "x-nf-request-id");
    return server === "Netlify" &&
      netlifyVary !== undefined &&
      netlifyId !== undefined;
  },
  pop: (details) => {
    return "?";
  },
  shortPop(pop: string): string {
    return "?";
  },
  icon: () => {
    return 'netlify-32';
  },
  name: () => {
    return "Netlify";
  }
}

const cloudflarePages: cdncompany = {
  detect: (details) => {
    const url = details.url;
    const hostname = (new URL(url)).hostname;
    return hostname.endsWith("pages.dev");
  },
  pop: (details) => {
    return cloudflare.pop(details);
  },
  shortPop(pop: string): string {
    return cloudflare.shortPop(pop);
  },
  icon: () => {
    return cloudflare.icon();
  },
  name: () => {
    return "Cloudflare-Pages";
  }
};

const githubPages: cdncompany = {
  detect: (details) => {
    const server = getHeader(details, "server")?.toLowerCase();
    const fastlyRequestId = getHeader(details, "x-fastly-request-id");
    const githubRequestId = getHeader(details, "x-github-request-id");
    const xTimer = getHeader(details, "x-timer") ?? "";

    const url = details.url;
    const hostname = (new URL(url)).hostname;

    return ((server === "github.com") &&
      (fastlyRequestId !== undefined) &&
      (githubRequestId !== undefined) &&
      fastlyRegex.test(xTimer)) ||
      (hostname.endsWith("github.io"));
  },
  pop: (details) => {
    return fastly.pop(details);
  },
  shortPop(pop: string): string {
    return fastly.shortPop(pop);
  },
  icon: () => {
    return 'github-32';
  },
  name: () => {
    return "GitHub-Pages";
  }
}
const isIPv6 = (address: string) => {
  try {
    const url = new URL(`http://[${address}]`);
    return url.hostname === address;
  } catch (e) {
    return false;
  }
}

const alibaba_const: any = {
  via_regex: /v?cache[0-9]{1,3}\.[a-zA-Z0-9\-]{4,10}\[[^\]]+]/,
}

// TODO, 需要靠HTTPS-DNS/firefox DNS 补全
const alibaba: cdncompany = {
  detect: (details) => {
    const server = getHeader(details, "server");
    const via = getHeader(details, "via");
    const viaList = via?.split(", ") ?? [];
    const allMatch = viaList.every((cache) => {
      return alibaba_const.via_regex.test(cache) || isIPv6(cache);
    });
    const xCdnProvider = getHeader(details, "x-cdn-provider");
    return ((server === "Tengine") &&
      (viaList.length > 0 && allMatch)) ||
      (xCdnProvider === "alibaba")
      ;
  },
  pop: (details) => {
    const xCache = getHeader(details, "X-Cache");
    console.log(`alibaba x-cache ${xCache}`);
    return "?";
  },
  shortPop(pop: string): string {
    return "?";
  },
  icon: () => {
    return 'alibaba-cloud-32';
  },
  name: () => {
    return "Alibaba";
  }
}

// TODO, 需要靠HTTPS-DNS/firefox DNS 补全
const tencent: cdncompany = {
  detect: (details) => {
    const server = getHeader(details, "server");
    const xCdnProvider = getHeader(details, "x-cdn-provider");
    return (server?.startsWith("tencent") ?? false) // 会有人不套CDN吗?
      || (xCdnProvider === "tencent");
  },
  pop: (details) => {
    return "?";
  },
  shortPop(pop: string): string {
    return "?";
  },
  icon: () => {
    return 'tencent-cloud-32';
  },
  name: () => {
    return "Tencent";
  }
}


const bytedance_const: any = {
  via_regex: /v?cache[0-9]{1,3}\.[a-zA-Z0-9]{2,10}/,
}

const bytedance: cdncompany = {
  detect: (details) => {
    const server = getHeader(details, "server");
    const via = getHeader(details, "via");
    const viaList = via?.split(", ") ?? [];
    const allMatch = viaList.every(vi => {
      return bytedance_const.via_regex.test(vi);
    });
    return (server === "Byte-nginx") && allMatch;
  },
  pop: (details) => {
    const via = getHeader(details, "via");
    const viaList = via?.split(", ") ?? [];
    const pop = viaList?.at(0)?.split(".")[1] ?? "?";
    return pop;
  },
  shortPop(pop: string): string {
    return pop.slice(0, 4);
  },
  icon: () => {
    return 'bytedance-cloud-32';
  },
  name: () => {
    return "Bytedance";
  }
}

export const type1 = [
  cloudflarePages, githubPages,
  cloudflare, fastly, cloudfront,
  bunny, akamai, cdn77, keycdn,
  netlifyCDN,
  bytedance, alibaba, tencent // BAT
];

export type {cdncompany};
