import { GatewayBot } from "../types/gateway/gateway_bot.ts";
import { Collection } from "../utils/collection.ts";
import { Gateway, Shard } from "./types.ts";
import { closeWebSocket } from "./close_web_socket.ts";
import { requestShardIdentify } from "./request_shard_identify.ts";
import { identify } from "./identify.ts";
import { resume } from "./resume.ts";
import { createSocket } from "./create_socket.ts";
import { heartbeat } from "./heartbeat.ts";
import { sendShardMessage } from "./send_shard_message.ts";
import { processQueue } from "./process_queue.ts";
import { handleOnMessage } from "./handle_on_message.ts";
import { spawnShards } from "./spawn_shards.ts";
import transformGatewayBot from "../transformers/gateway/gateway_bot.transformer.ts";
import { GatewayReceivePayload } from "../types/gateway/gateway_payload.ts";
import { ToDiscordType } from "../types/utils.ts";

async function getGatewayBot(token: string): Promise<GatewayBot> {
  const res = await fetch("https://discord.com/api/v9/gateway/bot", {
    headers: {
      Authorization: `Bot ${token}`,
    },
  }).then((res) => res.json());

  return transformGatewayBot(res);
}

export async function createGateway(options: {
  gatewayBot?: GatewayBot;
  compress?: boolean;
  token: string;
  intents: number;
  firstShardId?: number;
  lastShardId?: number;
  totalShards?: number;
  autoReshard?: boolean;
  /** The final function which gets executed on an on message event. */
  finalOnMessageHandler?: (
    data: ToDiscordType<GatewayReceivePayload>,
    shardId: number
  ) => unknown;
}): Promise<Gateway> {
  const gatewayBot = options.gatewayBot || (await getGatewayBot(options.token));

  return {
    gatewayBot: gatewayBot,
    totalShards: options.totalShards || gatewayBot.shards,
    spawnShardDelay: 2600,
    // spawnShardDelay: 5000,
    firstShardId: options.firstShardId ?? 0,
    lastShardId: options.lastShardId ?? gatewayBot.shards - 1,
    autoReshard: options.autoReshard ?? true,
    reshardPercentage: 80,
    useOptimalLargeBotSharding: true,
    identifyPayload: {
      token: `Bot ${options.token}`,
      compress: true,
      properties: {
        $os: "linux",
        $browser: "tebami",
        $device: "tebami",
      },
      intents: options.intents,
      shard: [0, 0],
    },
    buckets: new Collection<
      number,
      {
        shards: number[];
        createNextShard: (() => unknown)[];
      }
    >(),
    shards: new Collection<number, Shard>(),
    loadingShards: new Collection<
      number,
      {
        shardId: number;
        resolve: (value: unknown) => void;
        startedAt: number;
      }
    >(),
    utf8decoder: new TextDecoder(),
    closeWebSocket,
    requestShardIdentify,
    identify,
    resume,
    createSocket,
    heartbeat,
    sendShardMessage,
    processQueue,
    handleOnMessage,
    spawnShards,
    getGatewayBot: async () => {
      const res = await fetch("https://discord.com/api/v9/gateway/bot", {
        headers: {
          Authorization: `Bot ${options.token}`,
        },
      }).then((res) => res.json());

      return transformGatewayBot(res);
    },
    finalOnMessageHandler: options?.finalOnMessageHandler,
  };
}
