import { GatewayOpcodes } from "../types/codes/gateway_opcodes.ts";
import { Gateway } from "./types.ts";

export function identify(gateway: Gateway, shardId: number) {
  // Need to clear the old heartbeat interval
  const oldShard = gateway.shards.get(shardId);
  if (oldShard) {
    gateway.closeWebSocket(
      oldShard.socket,
      3065,
      "Reidentifying closure of old shard",
    );
    clearInterval(oldShard.heartbeat.intervalId);
  }

  // CREATE A SHARD
  const socket = gateway.createSocket(gateway, shardId, () => {
    gateway.sendShardMessage(
      gateway,
      shardId,
      {
        op: GatewayOpcodes.Identify,
        d: {
          ...gateway.identifyPayload,
          shard: [shardId, gateway.totalShards],
        },
      },
      true,
    );
  });

  // Identify can just set/reset the settings for the shard
  gateway.shards.set(shardId, {
    id: shardId,
    socket,
    sessionId: "",
    previousSequenceNumber: 0,
    resuming: false,
    ready: false,
    unavailableGuildIds: new Set(),
    heartbeat: {
      lastSentAt: 0,
      lastReceivedAt: 0,
      acknowledged: false,
      keepAlive: false,
      interval: 0,
      intervalId: 0,
    },
    queue: [],
    processingQueue: false,
    queueStartedAt: 0,
    queueCounter: 0,
  });

  return new Promise((resolve, reject) => {
    const timeout = setTimeout(() => {
      reject(
        `[Identify Failure] Shard ${shardId} has not received READY event in over a minute.`,
      );
    }, 600000);

    gateway.loadingShards.set(shardId, {
      shardId,
      resolve: (args: boolean) => {
        clearTimeout(timeout);
        resolve(args);
      },
      startedAt: Date.now(),
    });
  });
}
