import {WebRequest} from "webextension-polyfill";
import cloudflare32 from "~/assets/level1/cloudflare-32.png";
import fastly32 from "~/assets/level1/fastly-32.png";
import cloudfront32 from "~/assets/level1/cloudfront-32.png";
import bunnycdn32 from "~/assets/level1/bunnycdn-32.png";
import akamai32 from "~/assets/level1/akamai-32.png";
import cdn77_32 from "~/assets/level1/cdn77-32.png";
import keycdn32 from "~/assets/level1/keycdn-32.png";
import netlify32 from "~/assets/level1/netlify-32.png";
import ghPages from "~/assets/level1/github-32.png";
// TODO, level2 judge by HTTPS-DNS CName detect
import no_gray from "~/assets/level1/cdn-gray-32.png";

interface cdncompany {
  detect(details: WebRequest.OnCompletedDetailsType): boolean;

  pop(details: WebRequest.OnCompletedDetailsType): string;

  shortPop(pop: string): string

  icon(): string;

  name(): string;
}

const getHeader = (request: WebRequest.OnCompletedDetailsType, needle: string) => {
  console.log('rr headers ', request.responseHeaders);
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
    return cloudflare32;
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
    return fastly32;
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
    return cloudfront32;
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
    return bunnycdn32;
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
    return akamai32;
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
    return pop.slice(0, 4);
  },
  icon: () => {
    return cdn77_32;
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
    return keycdn32;
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
    return netlify32;
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
    const xTimer = getHeader(details, "x-timer") ?? "";

    const url = details.url;
    const hostname = (new URL(url)).hostname;

    return ((server === "github.com") &&
        (fastlyRequestId !== undefined) &&
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
    return ghPages;
  },
  name: () => {
    return "GitHub-Pages";
  }
}

const none: cdncompany = {
  detect: (details) => {
    return false;
  },
  pop: (details) => {
    return "DETECT";
  },
  shortPop(pop: string): string {
    return "NO";
  },
  icon: () => {
    return no_gray;
  },
  name: () => {
    return "NO";
  }
}
export const noone = none;
export const level1 = [
  cloudflarePages, githubPages,
  cloudflare, fastly, cloudfront,
  bunny, akamai, cdn77, keycdn,
  netlifyCDN
];
