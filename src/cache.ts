import { Snowflake } from "./types/base.ts";
import { Channel, TebamiThread } from "./types/channel/channel.ts";
import { Message } from "./types/channel/messages/message.ts";
import { GatewayPresenceUpdateData } from "./types/gateway/gateway_payload.ts";
import { TebamiGuild } from "./types/guild/guild.ts";
import { TebamiUser } from "./types/user/user.ts";
import { Collection } from "./utils/collection.ts";

export function createCache(
  isAsync: true,
  tableCreator: (tableName: TableNames) => AsyncCacheHandler<any>,
): AsyncCache;
export function createCache(
  isAsync: false,
  tableCreator?: (tableName: TableNames) => CacheHandler<any>,
): Cache;
export function createCache(
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

export interface Cache {
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

export interface AsyncCache {
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

export interface CacheExecutor {
  (
    type: "DELETE_MESSAGES_FROM_CHANNEL",
    options: { channelId: bigint },
  ): Promise<undefined>;
}

export function createExecute(cache: Cache | AsyncCache): CacheExecutor {
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

export type TableNames =
  | "channels"
  | "users"
  | "guilds"
  | "messages"
  | "presences"
  | "threads"
  | "unavailableGuilds";
