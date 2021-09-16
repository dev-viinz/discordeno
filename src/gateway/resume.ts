import { GatewayOpcodes } from "../types/codes/gateway_opcodes.ts";
import { Gateway } from "./types.ts";

export function resume(gateway: Gateway, shardId: number) {
  // NOW WE HANDLE RESUMING THIS SHARD
  // Get the old data for this shard necessary for resuming
  const oldShard = gateway.shards.get(shardId);
  if (oldShard) {
    // HOW TO CLOSE OLD SHARD SOCKET!!!
    gateway.closeWebSocket(
      oldShard.socket,
      3064,
      "Resuming the shard, closing old shard."
    );
    // STOP OLD HEARTBEAT
    clearInterval(oldShard.heartbeat.intervalId);
  }

  // CREATE A SHARD
  const socket = gateway.createSocket(gateway, shardId, () => {
    gateway.sendShardMessage(
      gateway,
      shardId,
      {
        op: GatewayOpcodes.Resume,
        d: {
          token: gateway.identifyPayload.token,
          session_id: sessionId,
          seq: previousSequenceNumber,
        },
      },
      true
    );
  });

  const sessionId = oldShard?.sessionId || "";
  const previousSequenceNumber = oldShard?.previousSequenceNumber || 0;

  gateway.shards.set(shardId, {
    id: shardId,
    socket,
    sessionId: sessionId,
    previousSequenceNumber: previousSequenceNumber,
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
    queue: oldShard?.queue || [],
    processingQueue: false,
    queueStartedAt: Date.now(),
    queueCounter: 0,
  });
}
