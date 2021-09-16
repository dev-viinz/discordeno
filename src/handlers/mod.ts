import { Bot } from "../bot.ts";
import { GatewayDispatchPayload } from "../types/gateway/gateway_payload.ts";
import { ToDiscordType } from "../types/utils.ts";
import GUILD_CREATE from "./guilds/GUILD_CREATE.ts";
import READY from "./misc/READY.ts";
import CHANNEL_CREATE from "./channels/CHANNEL_CREATE.ts";
import CHANNEL_DELETE from "./channels/CHANNEL_DELETE.ts";
import CHANNEL_UPDATE from "./channels/CHANNEL_UPDATE.ts";
import INTERACTION_CREATE from "./interactions/INTERACTION_CREATE.ts";

// TODO: add all missing ones and remove ts-ignore
// @ts-ignore -
export const handlers: {
  [K in GatewayDispatchPayload["t"]]: (
    bot: Bot,
    data: ToDiscordType<GatewayDispatchPayload>,
    shardId: number,
  ) => unknown;
} = {
  CHANNEL_CREATE,
  CHANNEL_DELETE,
  CHANNEL_UPDATE,
  GUILD_CREATE,
  INTERACTION_CREATE,
  READY,
};

export function createHandlers(customHandlers?: Handlers): Handlers {
  return { ...handlers, ...customHandlers };
}

export type Handlers = typeof handlers;
