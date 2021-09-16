import { Gateway } from "./types.ts";

/** Use this function to spawn all shards for your gateway. */
export function spawnShards(gateway: Gateway, firstShardId = 0) {
  // GET THE TOTAL AMOUNT OF SHARDS TO SPAWN
  gateway.totalShards ??= gateway.gatewayBot.shards;

  for (
    let index = firstShardId;
    index < gateway.gatewayBot.sessionStartLimit.maxConcurrency;
    index++
  ) {
    // ORGANIZE ALL SHARDS INTO THEIR OWN BUCKETS
    for (let i = 0; i < gateway.totalShards; i++) {
      const bucketId = i % gateway.gatewayBot.sessionStartLimit.maxConcurrency;
      const bucket = gateway.buckets.get(bucketId);

      // THE BUCKET DOES NOT EXIST SO CREATE IT
      if (!bucket) {
        gateway.buckets.set(bucketId, { shards: [i], createNextShard: [] });

        continue;
      }

      bucket.shards.push(i);
    }
  }

  // START ALL SHARDS CONCURRENTLY
  gateway.buckets.forEach((bucket, bucketId) => {
    for (const shardId of bucket.shards) {
      bucket.createNextShard.push(
        async () =>
          await gateway.requestShardIdentify(gateway, shardId, bucketId),
      );
    }

    bucket.createNextShard.shift()?.();
  });
}
