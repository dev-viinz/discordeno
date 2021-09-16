import { delay } from "../utils/delay.ts";
import { Gateway } from "./types.ts";

export async function processQueue(gateway: Gateway, shardId: number) {
  const shard = gateway.shards.get(shardId);
  // If no items or its already processing then exit
  if (!shard?.queue.length || shard.processingQueue) return;

  shard.processingQueue = true;

  while (shard.queue.length) {
    if (shard.socket.readyState !== WebSocket.OPEN) {
      shard.processingQueue = false;
      return;
    }

    const now = Date.now();
    if (now - shard.queueStartedAt >= 60000) {
      shard.queueStartedAt = now;
      shard.queueCounter = 0;
    }

    // Send a request that is next in line
    const request = shard.queue.shift();
    if (!request) return;

    // TODO: move this stringify to its own function
    shard.socket.send(
      JSON.stringify(request, (_, v) =>
        typeof v === "bigint" ? v.toString() : v
      )
    );

    // Counter is useful for preventing 120/m requests.
    shard.queueCounter++;

    // Handle if the requests have been maxed
    if (shard.queueCounter >= 118) {
      await delay(60000);
      shard.queueCounter = 0;
      continue;
    }
  }

  shard.processingQueue = false;
}
