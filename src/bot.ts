import { Gateway } from "./gateway/types.ts";
import { createGateway } from "./gateway/mod.ts";
import { GatewayIntents } from "./types/gateway/gateway_intents.ts";
import { Methods, Rest } from "./rest/types.ts";
import { createRest } from "./rest/rest.ts";
import { Components } from "./utils/components.ts";
import { Snowflake } from "./types/base.ts";
import { Collection } from "./utils/collection.ts";
import { Channel, TebamiThread } from "./types/channel/channel.ts";
import { TebamiUser } from "./types/user/user.ts";
import { TebamiGuild } from "./types/guild/guild.ts";
import { Message } from "./types/channel/messages/message.ts";
import {
  GatewayPresenceUpdateData,
  GatewayReceivePayload,
} from "./types/gateway/gateway_payload.ts";
import { createTransformers, Transformers } from "./transformers/mod.ts";
import { Handlers } from "./handlers/mod.ts";
import { createHandlers } from "./handlers/mod.ts";
import { GATEWAY_VERSION } from "./utils/constants.ts";
import { ToDiscordType, ValueOf } from "./types/utils.ts";
import { GatewayOpcodes } from "./types/codes/gateway_opcodes.ts";
import { EventHandlers } from "./types/tebami/event_handlers.ts";
import { createHelpers, OpenHelpers } from "./helpers/mod.ts";
import { InteractionCallbackTypes } from "./types/interactions/interaction_callback_types.ts";
import { createClientTable } from "../cache/client.ts";
import { devi as token, deviId as botId } from "../tokens.ignore.ts";

type CreateBotOptions = {
  token: string;
  intents?: (ValueOf<typeof GatewayIntents> | keyof typeof GatewayIntents)[];
  botId: bigint;
  applicationId?: bigint;
  cache?:
    | {
      isAsync: true;
      customTableCreator: (tableName: TableNames) => AsyncCacheHandler<any>;
    }
    | {
      isAsync: false;
      customTableCreator: (tableName: TableNames) => CacheHandler<any>;
    };
  /** The final function which gets executed on an on message event. */
  finalOnMessageHandler?: (
    data: ToDiscordType<GatewayReceivePayload>,
    shardId: number,
  ) => unknown;
  eventHandlers?: EventHandlers;
  createCacheExecute?: (cache: Cache | AsyncCache) => CacheExecutor;
};

export async function createBot<T extends CreateBotOptions = CreateBotOptions>(
  options: T,
): Promise<Bot<T["cache"] extends { isAsync: true } ? AsyncCache : Cache>> {
  const intents = options.intents
    ? options.intents.reduce(
      (
        bits: number,
        next: keyof typeof GatewayIntents | number,
      ) => (bits |= typeof next === "string" ? GatewayIntents[next] : next),
      0,
    )
    : 0;

  const gateway = await createGateway({
    token: options.token,
    intents,
  });

  const cache = createCache(
    // @ts-ignore - somehow this type does not work idk why
    options?.cache?.isAsync ?? false,
    options?.cache?.customTableCreator,
  );
  cache.execute = options.createCacheExecute
    ? options.createCacheExecute(cache)
    : createExecute(cache);

  const rest = createRest({ token: options.token });

  const bot: Omit<
    Bot<T["cache"] extends { isAsync: true } ? AsyncCache : Cache>,
    keyof OpenHelpers
  > = {
    id: options.botId,
    applicationId: options.applicationId ?? options.botId,
    token: options.token,
    intents,

    gateway,
    start: () => gateway.spawnShards(gateway),
    rest,

    handlers: createHandlers(),
    transformers: createTransformers(),
    eventHandlers: options?.eventHandlers ?? {},

    cache,
    isReady: false,

    fetch: async function (method, url, body, transformer) {
      const res = await rest.runMethod<any>(rest, method, url, body);
      return res && transformer ? transformer(res) : res;
    },
  };

  bot.gateway.finalOnMessageHandler = options?.finalOnMessageHandler ||
    (async (data, shardId) => {
      bot.eventHandlers.raw?.(data, shardId);
      await bot.eventHandlers.dispatchRequirements?.(data, shardId);
      // TODO : maybe this is (not) required
      if (data.op !== GatewayOpcodes.Dispatch) return;
      //   if (!messageData.t) return;
      // `as unknown as Bot` is required because helper functions are missing here this is not important though.
      bot.handlers[data.t]?.((bot) as unknown as Bot, data, shardId);
    });

  // TODO: this should be done by the gateway function
  // Explicitly append gateway version and encoding
  bot.gateway.gatewayBot.url += `?v=${GATEWAY_VERSION}&encoding=json`;

  // `as unknown as Bot` is required because helper functions are missing here this is not important though.
  return { ...bot, ...createHelpers((bot as unknown) as Bot) };
}

const bot = await createBot({
  token,
  botId,
  intents: [
    GatewayIntents.Guilds,
    GatewayIntents.GuildMembers,
    "GuildMessages",
  ],
  eventHandlers: {
    async ready() {
      console.log("I AM READYYY");
      console.log("Ready with", await bot.cache.guilds.size(), "guilds");
    },
    shardFailedToLoad() {
      console.log("WTF");
    },
    shardReady() {
      console.log("A SHARD IS REAADY");
    },
    channelCreate(channel) {
      console.log("A channel has been created", { channel });
    },
    channelDelete(channel) {
      console.log("A channel has been deleted", { channel });
    },
    channelUpdate(channel, oldChannel) {
      console.log("A channel has been updated", { channel, oldChannel });
    },
    async interactionCreate(interaction) {
      console.log("received an interaction", { interaction });
      const res1 = await bot.sendInteractionResponse(
        interaction.id,
        interaction.token,
        {
          type: InteractionCallbackTypes.ChannelMessageWithSource,
          data: { content: "this is 1" },
        },
      );
      const res2 = await bot.sendInteractionResponse(
        interaction.id,
        interaction.token,
        {
          type: InteractionCallbackTypes.ChannelMessageWithSource,
          data: { content: "this is 2" },
        },
      );
      console.log({ res1, res2 });
    },
  },
  // cache: {
  //   isAsync: true,
  //   customTableCreator: createClientTable,
  // },
});

bot.start();
// const res = await bot.fetch(
//   "POST",
//   "https://discord.com/api/v9/channels/830362569390030878/messages",
//   {
//     content: "Testing REST",
//     components: new Components()
//       .addButton("idk", "Red", "orange")
//       .addButton("asdf", "Blurple", "oo")
//       .addSelectMenu("Choose a class", "class_select_1", [
//         {
//           label: "Rogue",
//           value: "rogue",
//           description: "Sneak n stab",
//           emoji: {
//             name: "rogue",
//             id: 625891304148303894n,
//           },
//         },
//         {
//           label: "Mage",
//           value: "mage",
//           description: "Turn 'em into a sheep",
//           emoji: {
//             name: "mage",
//             id: 625891304081063986n,
//           },
//         },
//         {
//           label: "Priest",
//           value: "priest",
//           description: "You get heals when I'm done doing damage",
//           emoji: {
//             name: "priest",
//             id: 625891303795982337n,
//           },
//         },
//       ])
//       .addButton("test", "Green", "hey"),
//   }
// );

// console.log(res);

export interface Bot<C extends Cache | AsyncCache = AsyncCache | Cache>
  extends OpenHelpers {
  id: bigint;
  applicationId: bigint;
  token: string;
  intents: number;

  gateway: Gateway;
  rest: Rest;
  start: () => void;
  handlers: Handlers;

  transformers: Transformers;
  eventHandlers: EventHandlers;

  cache: C;
  isReady: boolean;

  /** Get data from the Discord API correctly. (Its just a shortcut to rest.runMethod) */
  fetch: <T>(
    method: Methods,
    url: string,
    // deno-lint-ignore ban-types
    body?: {},
    transformer?: (data: ToDiscordType<T>) => T,
  ) => Promise<T>;
}

function createCache(
  isAsync: true,
  tableCreator: (tableName: TableNames) => AsyncCacheHandler<any>,
): AsyncCache;
function createCache(
  isAsync: false,
  tableCreator?: (tableName: TableNames) => CacheHandler<any>,
): Cache;
function createCache(
  isAsync: boolean,
  tableCreator?: (
    tableName: TableNames,
  ) => CacheHandler<any> | AsyncCacheHandler<any>,
): Omit<Cache, "execute"> | Omit<AsyncCache, "execute"> {
  if (isAsync) {
    if (!tableCreator) {
      throw new Error("Async cache requires a tableCreator to be passed.");
    }

    return {
      guilds: tableCreator("guilds"),
      users: tableCreator("users"),
      channels: tableCreator("channels"),
      messages: tableCreator("messages"),
      presences: tableCreator("presences"),
      threads: tableCreator("threads"),
      unavailableGuilds: tableCreator("unavailableGuilds"),
      executedSlashCommands: new Set(),
    } as AsyncCache;
  }
  if (!tableCreator) tableCreator = createTable;

  return {
    guilds: tableCreator("guilds"),
    users: tableCreator("users"),
    channels: tableCreator("channels"),
    messages: tableCreator("messages"),
    presences: tableCreator("presences"),
    threads: tableCreator("threads"),
    unavailableGuilds: tableCreator("unavailableGuilds"),
    executedSlashCommands: new Set(),
  } as Cache;
}

interface Cache {
  guilds: CacheHandler<TebamiGuild>;
  users: CacheHandler<TebamiUser>;
  channels: CacheHandler<Channel>;
  messages: CacheHandler<Message>;
  presences: CacheHandler<GatewayPresenceUpdateData>;
  threads: CacheHandler<TebamiThread>;
  unavailableGuilds: CacheHandler<CachedUnavailableGuild>;
  executedSlashCommands: Set<Snowflake>;
  execute: CacheExecutor;
}

export interface CachedUnavailableGuild {
  shardId: number;
  since: number;
  dispatched?: true;
}

interface AsyncCache {
  guilds: AsyncCacheHandler<TebamiGuild>;
  users: AsyncCacheHandler<TebamiUser>;
  channels: AsyncCacheHandler<Channel>;
  messages: AsyncCacheHandler<Message>;
  presences: AsyncCacheHandler<GatewayPresenceUpdateData>;
  threads: AsyncCacheHandler<TebamiThread>;
  unavailableGuilds: AsyncCacheHandler<CachedUnavailableGuild>;
  executedSlashCommands: Set<Snowflake>;
  execute: CacheExecutor;
}

function createTable<T>(_table: TableNames): CacheHandler<T> {
  const table = new Collection<Snowflake, T>();
  return {
    clear: () => table.clear(),
    delete: (key) => table.delete(key),
    has: (key) => table.has(key),
    size: () => table.size,
    set: (key, data) => table.set(key, data),
    get: (key) => table.get(key),
    forEach: (callback) => table.forEach(callback),
    filter: (callback) => table.filter(callback),
  };
}

export interface CacheHandler<T> {
  /** Completely empty this table. */
  clear(): void;
  /** Delete the data related to this key from table. */
  delete(key: Snowflake): boolean;
  /** Check if there is data assigned to this key. */
  has(key: Snowflake): boolean;
  /** Check how many items are stored in this table. */
  size(): number;
  /** Store new data to this table. */
  set(key: Snowflake, data: T): boolean;
  /** Get a stored item from the table. */
  get(key: Snowflake): T | undefined;
  /**
   * Loop over each entry and execute callback function.
   * @important This function NOT optimised and will force load everything when using custom cache.
   */
  forEach(callback: (value: T, key: Snowflake) => unknown): void;
  /**
   * Loop over each entry and execute callback function.
   * @important This function NOT optimised and will force load everything when using custom cache.
   */
  filter(
    callback: (value: T, key: Snowflake) => boolean,
  ): Collection<Snowflake, T>;
}

export type AsyncCacheHandler<T> = {
  [K in keyof CacheHandler<T>]: (
    ...args: Parameters<CacheHandler<T>[K]>
  ) => Promise<ReturnType<CacheHandler<T>[K]>>;
};

interface CacheExecutor {
  (
    type: "DELETE_MESSAGES_FROM_CHANNEL",
    options: { channelId: bigint },
  ): Promise<undefined>;
}

function createExecute(cache: Cache | AsyncCache): CacheExecutor {
  return async (type, options) => {
    if (type === "DELETE_MESSAGES_FROM_CHANNEL") {
      await cache.messages.forEach(async (message) => {
        if (message.channelId === options.channelId) {
          await cache.messages.delete(message.id);
        }
      });

      return undefined;
    }
  };
}

type TableNames =
  | "channels"
  | "users"
  | "guilds"
  | "messages"
  | "presences"
  | "threads"
  | "unavailableGuilds";
