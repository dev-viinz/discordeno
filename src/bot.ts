import { Gateway } from "./gateway/types.ts";
import { createGateway } from "./gateway/mod.ts";
import { GatewayIntents } from "./types/gateway/gateway_intents.ts";
import { Methods, Rest } from "./rest/types.ts";
import { createRest } from "./rest/rest.ts";
import { GatewayReceivePayload } from "./types/gateway/gateway_payload.ts";
import { createTransformers, Transformers } from "./transformers/mod.ts";
import { Handlers } from "./handlers/mod.ts";
import { createHandlers } from "./handlers/mod.ts";
import { GATEWAY_VERSION } from "./utils/constants.ts";
import { ToDiscordType, ValueOf } from "./types/utils.ts";
import { GatewayOpcodes } from "./types/codes/gateway_opcodes.ts";
import { EventHandlers } from "./types/tebami/event_handlers.ts";
import { createHelpers, OpenHelpers } from "./helpers/mod.ts";
import { InteractionCallbackTypes } from "./types/interactions/interaction_callback_types.ts";
import { devi as token, deviId as botId } from "../tokens.ignore.ts";
import {
  AsyncCache,
  AsyncCacheHandler,
  Cache,
  CacheExecutor,
  CacheHandler,
  createCache,
  createExecute,
  TableNames,
} from "./cache.ts";

type CreateBotOptions = {
  /** The Authorization token of your bot. */
  token: string;
  /** The intents you want to use for the bots gateway. */
  intents?: (ValueOf<typeof GatewayIntents> | keyof typeof GatewayIntents)[];
  /** The id of the bot. */
  botId: bigint;
  /**
   * The application id of the bot.
   * Usually the botId but for old applications its different.
   */
  applicationId?: bigint;
  cache?:
    | {
      isAsync: true;
      // deno-lint-ignore no-explicit-any
      customTableCreator: (tableName: TableNames) => AsyncCacheHandler<any>;
    }
    | {
      isAsync: false;
      // deno-lint-ignore no-explicit-any
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
      // deno-lint-ignore no-explicit-any
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
    shardFailedToLoad(shardId, guildIds) {
      console.log("[SHARD FAILED TO LOAD]", shardId, guildIds.size);
    },
    shardReady(shardId) {
      console.log("[SHARD READY]", shardId);
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
