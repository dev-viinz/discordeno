/** Handler for handling every message event from websocket. */
import { GatewayReceivePayload } from "../types/gateway/gateway_payload.ts";
import { GatewayOpcodes } from "../types/codes/gateway_opcodes.ts";
import { delay } from "../utils/delay.ts";
import { decompressWith } from "./deps.ts";
import { Gateway } from "./types.ts";
import { ToDiscordType } from "../types/utils.ts";

export async function handleOnMessage(
  gateway: Gateway,
  // deno-lint-ignore no-explicit-any
  message: any,
  shardId: number,
) {
  if (message instanceof ArrayBuffer) {
    message = new Uint8Array(message);
  }

  if (message instanceof Uint8Array) {
    message = decompressWith(
      message,
      0,
      (slice: Uint8Array) => gateway.utf8decoder.decode(slice),
    );
  }

  // console.log({ message });
  if (typeof message !== "string") return;

  const shard = gateway.shards.get(shardId);

  const messageData = JSON.parse(
    message,
  ) as ToDiscordType<GatewayReceivePayload>;
  // ws.log("RAW", { shardId, payload: messageData });

  switch (messageData.op) {
    case GatewayOpcodes.Heartbeat:
      if (shard?.socket.readyState !== WebSocket.OPEN) return;

      shard.heartbeat.lastSentAt = Date.now();
      // Discord randomly sends this requiring an immediate heartbeat back
      gateway.sendShardMessage(
        gateway,
        shard,
        {
          op: GatewayOpcodes.Heartbeat,
          d: shard?.previousSequenceNumber,
        },
        true,
      );
      break;
    case GatewayOpcodes.Hello:
      gateway.heartbeat(gateway, shardId, messageData.d.heartbeat_interval);
      break;
    case GatewayOpcodes.HeartbeatACK:
      if (gateway.shards.has(shardId)) {
        gateway.shards.get(shardId)!.heartbeat.acknowledged = true;
      }
      break;
    case GatewayOpcodes.Reconnect:
      // gateway.log("RECONNECT", { shardId });

      if (gateway.shards.has(shardId)) {
        gateway.shards.get(shardId)!.resuming = true;
      }

      gateway.resume(gateway, shardId);
      break;
    case GatewayOpcodes.InvalidSession:
      // gateway.log("INVALID_SESSION", { shardId, payload: messageData });

      // We need to wait for a random amount of time between 1 and 5
      await delay(Math.floor((Math.random() * 4 + 1) * 1000));

      // When d is false we need to reidentify
      if (!messageData.d) {
        await gateway.identify(gateway, shardId);
        break;
      }

      if (gateway.shards.has(shardId)) {
        gateway.shards.get(shardId)!.resuming = true;
      }

      gateway.resume(gateway, shardId);
      break;
    default:
      if (messageData.t === "RESUMED") {
        // gateway.log("RESUMED", { shardId });

        if (gateway.shards.has(shardId)) {
          gateway.shards.get(shardId)!.resuming = false;
        }
        break;
      }

      // Important for RESUME
      if (messageData.t === "READY") {
        console.log("READY", { messageData });
        const shard = gateway.shards.get(shardId);
        if (shard) {
          shard.sessionId = messageData.d.session_id;
        }

        gateway.loadingShards.get(shardId)?.resolve(true);
        gateway.loadingShards.delete(shardId);
        // Wait few seconds to spawn next shard
        setTimeout(() => {
          const bucket = gateway.buckets.get(
            shardId % gateway.gatewayBot.sessionStartLimit.maxConcurrency,
          );
          if (bucket) bucket.createNextShard.shift()?.();
        }, gateway.spawnShardDelay);
      }

      // Update the sequence number if it is present
      if (messageData.s) {
        const shard = gateway.shards.get(shardId);
        if (shard) {
          shard.previousSequenceNumber = messageData.s;
        }
      }
      break;
  }

  return await gateway.finalOnMessageHandler?.(messageData, shardId);
}
