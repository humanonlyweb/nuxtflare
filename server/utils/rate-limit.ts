import { log } from "evlog";
import type { H3Event } from "h3";

export async function checkRateLimit(event: H3Event, { key }: { key: string }): Promise<boolean> {
  const limiter = event.context.cloudflare?.env?.RATE_LIMIT;

  if (!limiter) {
    log.warn("rate-limit", `no RATE_LIMIT binding — "${key}" not throttled`);
    return true;
  }

  const { success } = await limiter.limit({ key });
  return success;
}

export async function assertWithinRateLimit(
  event: H3Event,
  { key, message }: { key: string; message?: string },
): Promise<void> {
  if (!(await checkRateLimit(event, { key }))) throw Errors.tooManyRequests(message);
}

export function clientIp(event: H3Event): string {
  return (
    event.headers.get("cf-connecting-ip") ??
    event.headers.get("x-forwarded-for")?.split(",")[0] ??
    "unknown"
  );
}
