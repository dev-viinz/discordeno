import { Gateway, Shard, ShardMessageRequest } from "./types.ts";

export function sendShardMessage(
  gateway: Gateway,
  shard: number | Shard,
  message: ShardMessageRequest,
  highPriority = false,
) {
  if (typeof shard === "number") shard = gateway.shards.get(shard)!;
  if (!shard) return;

  if (!highPriority) {
    shard.queue.push(message);
  } else {
    shard.queue.unshift(message);
  }

  gateway.processQueue(gateway, shard.id);
}
