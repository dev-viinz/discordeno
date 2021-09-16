import { Gateway } from "./types.ts";

/** Request the identify for a shard.
 * This function can be overwritten by users who use shard clusters.
 */
export async function requestShardIdentify(
  gateway: Gateway,
  shardId: number,
  _bucketId: number,
) {
  await gateway.identify(gateway, shardId);
}
