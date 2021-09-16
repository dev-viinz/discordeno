import { GatewayOpcodes } from "../types/codes/gateway_opcodes.ts";
import { GatewayBot } from "../types/gateway/gateway_bot.ts";
import { GatewayReceivePayload } from "../types/gateway/gateway_payload.ts";
import { ToDiscordType } from "../types/utils.ts";
import { Collection } from "../utils/collection.ts";

export interface Gateway {
  gatewayBot: GatewayBot;
  /** The identify payload holds the necessary data to connect and stay connected with Discords WSS. */
  identifyPayload: {
    token: string;
    compress: boolean;
    properties: {
      $os: string;
      $browser: string;
      $device: string;
    };
    intents: number;
    shard: [number, number];
  };
  // TODO: automatically use gatewayBot.shards if totalShards is lower
  /** The number of shards to use to start the bot.
   * After it will be modified by the resharding process.
   */
  totalShards: number;
  /** The first shard id for this process. */
  firstShardId: number;
  /** The last shard Id for this cluster. */
  lastShardId: number;
  /** The delay in milliseconds to wait before spawning next shard. OPTIMAL IS ABOVE 2500. YOU DON"T WANT TO HIT THE RATE LIMIT!!! */
  spawnShardDelay: number;
  /** Whether the gateway should automatically reshard when necessary. Default: true */
  autoReshard: boolean;
  /** At how many percent the resharder should start. Default: 80 */
  reshardPercentage: number;
  /** Whether the resharder should automatically switch to LARGE BOT SHARDING when the bot is above 100K servers */
  useOptimalLargeBotSharding: boolean;
  /** The shard buckets mapped by [bucketId, { shards: shardIds[], createNextShard: function[]}] */
  buckets: Collection<
    number,
    {
      shards: number[];
      createNextShard: (() => unknown)[];
    }
  >;
  /** The shard cache. */
  shards: Collection<number, Shard>;
  loadingShards: Collection<
    number,
    {
      shardId: number;
      resolve: (value: boolean) => void;
      startedAt: number;
    }
  >;
  utf8decoder: TextDecoder;
  /** Correctly close a WebSocket connection */
  closeWebSocket: (
    socket: WebSocket,
    code?: number,
    reason?: string,
  ) => unknown;
  /** Request the identify of the next shard for this bucket. */
  requestShardIdentify: (
    gateway: Gateway,
    shardId: number,
    bucketId: number,
  ) => unknown;
  // TODO: better return type
  /** Use this function to identify a shard. */
  identify: (gateway: Gateway, shardId: number) => unknown;
  /** Resume an old shards session. */
  resume: (gateway: Gateway, shardId: number) => unknown;
  /** Create a shard socket. */
  createSocket: (
    gateway: Gateway,
    shardId: number,
    onOpenhandler: () => unknown,
  ) => WebSocket;
  /** Begins heartbeating to keep the shard alive. */
  heartbeat: (gateway: Gateway, shardId: number, interval: number) => unknown;
  /** Send a message to the shards gateway. */
  sendShardMessage: (
    gateway: Gateway,
    shard: number | Shard,
    message: ShardMessageRequest,
    highPriority: boolean,
  ) => unknown;
  /** Handles processing queue of requests send to this shard. */
  processQueue: (gateway: Gateway, shardId: number) => unknown;
  /** Handles message events from the shards sockets. */
  handleOnMessage: (gateway: Gateway, message: any, shardId: number) => unknown;
  /** Handles shard spawning on start. */
  spawnShards: (gateway: Gateway) => void;

  getGatewayBot: () => Promise<GatewayBot>;

  /** The final function which gets executed on an on message event. */
  finalOnMessageHandler?: (
    data: ToDiscordType<GatewayReceivePayload>,
    shardId: number,
  ) => unknown;
}

export interface Shard {
  /** The shards id. */
  id: number;
  /** The WebSocket for this shard. */
  socket: WebSocket;
  /** The session id of the shard used for resuming connections. */
  sessionId: string;
  /** The previous sequence number, used for resuming connections. */
  previousSequenceNumber: number | null;
  /** Whether the shard is currently resuming. */
  resuming: boolean;
  /** Whether the shard has received the ready event. */
  ready: boolean;

  failedToLoadTimeoutId?: number;

  unavailableGuildIds: Set<bigint>;

  heartbeat: {
    /** The exact timestamp the last heartbeat was sent. */
    lastSentAt: number;
    /** The timestamp the last heartbeat ACK was received from discord. */
    lastReceivedAt: number;
    /** Whether or not the heartbeat was acknowledged  by discord in time. */
    acknowledged: boolean;
    /** Whether or not to keep heartbeating. Useful for when needing to stop heartbeating. */
    keepAlive: boolean;
    /** The interval between heartbeats requested by discord. */
    interval: number;
    /** The id of the interval, useful for stopping the interval if ws closed. */
    intervalId: number;
  };
  /** The items/requestst that are in queue to be sent to this shard websocket. */
  queue: ShardMessageRequest[];
  /** Whether or not the queue for this shard is being processed. */
  processingQueue: boolean;
  /** When the first request for this minute has been sent. */
  queueStartedAt: number;
  /** The request counter of the queue. */
  queueCounter: number;
}

export interface ShardMessageRequest {
  op: GatewayOpcodes;
  d: unknown;
}
