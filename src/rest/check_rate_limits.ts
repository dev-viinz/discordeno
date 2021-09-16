import { Rest } from "./types.ts";

/** Check the rate limits for a url or a bucket. */
export function checkRateLimits(rest: Rest, url: string): number {
  const ratelimited = rest.ratelimitedPaths.get(url);
  const global = rest.ratelimitedPaths.get("global");
  const now = Date.now();

  if (ratelimited && now < ratelimited.resetTimestamp) {
    return ratelimited.resetTimestamp - now;
  }
  if (global && now < global.resetTimestamp) {
    return global.resetTimestamp - now;
  }

  return 0;
}
