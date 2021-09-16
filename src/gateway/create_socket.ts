import { GatewayCloseEventCodes } from "../types/codes/gateway_close_event_codes.ts";
import { Gateway } from "./types.ts";

export function createSocket(
  gateway: Gateway,
  shardId: number,
  onOpenhandler: () => unknown,
) {
  const socket = new WebSocket(gateway.gatewayBot.url);
  socket.binaryType = "arraybuffer";

  socket.onopen = onOpenhandler;

  socket.onerror = (errorEvent) => {
    // ws.log("ERROR", { shardId, error: errorEvent });
    console.log(errorEvent);
  };

  socket.onmessage = ({ data: message }) =>
    gateway.handleOnMessage(gateway, message, shardId);

  socket.onclose = async (event) => {
    console.log("close", event);
    // ws.log("CLOSED", { shardId, payload: event });

    switch (event.code) {
      // Tebami tests finished
      case 3061:
        return;
      case 3063: // Resharded
      case 3064: // Resuming
      case 3065: // Reidentifying
      case 3066: // Missing ACK
        // Will restart shard manually
        return;
      // return ws.log("CLOSED_RECONNECT", { shardId, payload: event });
      case GatewayCloseEventCodes.UnknownOpcode:
      case GatewayCloseEventCodes.DecodeError:
      case GatewayCloseEventCodes.AuthenticationFailed:
      case GatewayCloseEventCodes.AlreadyAuthenticated:
      case GatewayCloseEventCodes.InvalidShard:
      case GatewayCloseEventCodes.ShardingRequired:
      case GatewayCloseEventCodes.InvalidApiVersion:
      case GatewayCloseEventCodes.InvalidIntents:
      case GatewayCloseEventCodes.DisallowedIntents:
        throw new Error(event.reason || "Discord gave no reason, Blame Wolf!");
      // THESE ERRORS CAN NO BE RESUMED! THEY MUST RE-IDENTIFY!
      case GatewayCloseEventCodes.NotAuthenticated:
      case GatewayCloseEventCodes.InvalidSeq:
      case GatewayCloseEventCodes.RateLimited:
      case GatewayCloseEventCodes.SessionTimedOut:
        await gateway.identify(gateway, shardId);
        break;
      default:
        await gateway.resume(gateway, shardId);
        break;
    }
  };

  return socket;
}
