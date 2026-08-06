export function useApplePlatform() {
  return useState("platform:apple", () => {
    if (import.meta.client) return isAppleAgent(navigator.userAgent);

    // Chromium sends this low-entropy hint by default; Safari and Firefox don't,
    // hence the user-agent fallback.
    const headers = useRequestHeaders(["sec-ch-ua-platform", "user-agent"]);
    const hint = headers["sec-ch-ua-platform"];
    if (hint) return /mac/i.test(hint);
    return isAppleAgent(headers["user-agent"] ?? "");
  });
}

function isAppleAgent(agent: string) {
  return /mac|iphone|ipad|ipod/i.test(agent);
}
