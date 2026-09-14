const IPFS_GATEWAYS = ["https://ipfs.ton.org/ipfs/", "https://gateway.pinata.cloud/ipfs/"] as const;

const FALLBACK_GATEWAY_INDEX = IPFS_GATEWAYS.length - 1;

function isAcceptableResponse(response: Response) {
  return response.status !== 403 && response.status < 500;
}

function hashGateways(urls: string[]) {
  return urls.join("|");
}

function parseCacheEntry(entry: string | null) {
  if (!entry) return null;
  try {
    const parsed = JSON.parse(entry) as {
      url: string;
      body: string;
      status: number;
      headers: [string, string][];
      gatewaysHash: string;
    };
    return parsed;
  } catch {
    return null;
  }
}

function loadCachedResponse(cacheKey: string, gateways: string[]) {
  if (typeof window === "undefined" || !window.localStorage) {
    return null;
  }
  const cached = parseCacheEntry(window.localStorage.getItem(cacheKey));
  if (!cached || cached.gatewaysHash !== hashGateways(gateways)) return null;
  return {
    response: new Response(cached.body, {
      status: cached.status,
      headers: cached.headers,
    }),
    url: cached.url,
  };
}

async function cacheSuccessfulResponse(
  cacheKey: string,
  result: { response: Response; url: string },
  gateways: string[],
) {
  if (typeof window === "undefined" || !window.localStorage) {
    return;
  }
  const text = await result.response.clone().text();
  const headers: [string, string][] = [];
  result.response.headers.forEach((value, key) => {
    headers.push([key, value]);
  });
  const payload = JSON.stringify({
    url: result.url,
    body: text,
    status: result.response.status,
    headers,
    gatewaysHash: hashGateways(gateways),
  });
  try {
    window.localStorage.setItem(cacheKey, payload);
  } catch {
    // Ignore storage quota issues.
  }
}

export async function fetchIpfsContent(hash: string): Promise<{ response: Response; url: string }> {
  const cacheKey = `ipfs:${hash}`;
  const gateways = IPFS_GATEWAYS.map((base) => `${base}${hash}`);
  const cached = loadCachedResponse(cacheKey, gateways);
  if (cached) {
    return cached;
  }

  const controllers = gateways.map(() => new AbortController());

  const result = await new Promise<{ response: Response; url: string }>((resolve, reject) => {
    let settled = false;
    let pending = gateways.length;
    let fallbackResult: { response: Response; url: string } | null = null;

    gateways.forEach((url, index) => {
      fetch(url, { signal: controllers[index].signal })
        .then((response) => {
          if (settled) return;
          const result = { response, url };

          if (index === FALLBACK_GATEWAY_INDEX) {
            fallbackResult = result;
          }

          if (isAcceptableResponse(response)) {
            settled = true;
            controllers.forEach((controller, controllerIndex) => {
              if (controllerIndex !== index) {
                controller.abort();
              }
            });
            resolve(result);
          }
        })
        .catch(() => {
          // Ignore fetch errors; we'll rely on the remaining gateways.
        })
        .finally(() => {
          if (settled) return;
          pending -= 1;
          if (pending === 0) {
            settled = true;
            if (fallbackResult) {
              resolve(fallbackResult);
            } else {
              reject(new Error("All IPFS gateways failed"));
            }
          }
        });
    });
  });

  if (isAcceptableResponse(result.response)) {
    await cacheSuccessfulResponse(cacheKey, result, gateways);
  }
  return result;
}
