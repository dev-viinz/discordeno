import { GatewayOpcodes } from "../types/codes/gateway_opcodes.ts";
import { delay } from "../utils/delay.ts";
import { Gateway } from "./types.ts";

export async function heartbeat(
  gateway: Gateway,
  shardId: number,
  interval: number,
) {
  // ws.log("HEARTBEATING_STARTED", { shardId, interval });

  const shard = gateway.shards.get(shardId);
  if (!shard) return;

  // ws.log("HEARTBEATING_DETAILS", { shardId, interval, shard });

  // The first heartbeat is special so we send it without setInterval
  await delay(Math.floor(shard.heartbeat.interval * Math.random()));

  if (shard.socket.readyState !== WebSocket.OPEN) return;

  shard.socket.send(
    JSON.stringify({
      op: GatewayOpcodes.Heartbeat,
      d: shard.previousSequenceNumber,
    }),
  );

  shard.heartbeat.keepAlive = true;
  shard.heartbeat.acknowledged = false;
  shard.heartbeat.lastSentAt = Date.now();
  shard.heartbeat.interval = interval;

  shard.heartbeat.intervalId = setInterval(async () => {
    // ws.log("DEBUG", `Running setInterval in heartbeat file. Shard: ${shardId}`);
    const currentShard = gateway.shards.get(shardId);
    if (!currentShard) return;

    // ws.log("HEARTBEATING", { shardId, shard: currentShard });

    if (
      currentShard.socket.readyState === WebSocket.CLOSED ||
      !currentShard.heartbeat.keepAlive
    ) {
      // ws.log("HEARTBEATING_CLOSED", { shardId, shard: currentShard });

      // STOP THE HEARTBEAT
      return clearInterval(shard.heartbeat.intervalId);
    }

    if (!currentShard.heartbeat.acknowledged) {
      gateway.closeWebSocket(
        currentShard.socket,
        3066,
        "Did not receive an ACK in time.",
      );
      return await gateway.identify(gateway, shardId);
    }

    if (currentShard.socket.readyState !== WebSocket.OPEN) return;

    currentShard.heartbeat.acknowledged = false;

    currentShard.socket.send(
      JSON.stringify({
        op: GatewayOpcodes.Heartbeat,
        d: currentShard.previousSequenceNumber,
      }),
    );
  }, shard.heartbeat.interval);
}
