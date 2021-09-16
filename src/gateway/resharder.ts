import { Gateway } from "./types.ts";

/** The handler to automatically reshard when necessary. */
export async function resharder(gateway: Gateway) {
  gateway.gatewayBot = await gateway.getGatewayBot();

  const percentage =
    ((gateway.gatewayBot.shards - gateway.totalShards) / gateway.totalShards) *
    100;
  // Less than necessary% being used so do nothing
  if (percentage < gateway.reshardPercentage) return;

  // Don't have enough identify rate limits to reshard
  if (
    gateway.gatewayBot.sessionStartLimit.remaining < gateway.gatewayBot.shards
  ) {
    return;
  }

  // Begin resharding
  gateway.totalShards = gateway.gatewayBot.shards;
  // If more than 100K servers, begin switching to 16x sharding
  if (gateway.totalShards && gateway.useOptimalLargeBotSharding) {
    gateway.totalShards = Math.ceil(
      gateway.totalShards /
        (gateway.gatewayBot.sessionStartLimit.maxConcurrency === 1
          ? 16
          : gateway.gatewayBot.sessionStartLimit.maxConcurrency),
    );
  }

  gateway.spawnShards(gateway);
}
