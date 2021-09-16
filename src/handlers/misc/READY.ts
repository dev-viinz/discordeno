import { Bot } from "../../bot.ts";
import { Shard } from "../../gateway/types.ts";
import { GatewayDispatchEvents } from "../../types/gateway/gateway_dispatch_events.ts";
import { GatewayDispatchPayload } from "../../types/gateway/gateway_payload.ts";
import { ToDiscordType } from "../../types/utils.ts";

export default function handleReady(
  bot: Bot,
  data: ToDiscordType<GatewayDispatchPayload>,
  shardId: number,
) {
  if (data.t !== GatewayDispatchEvents.Ready) return;

  // Triggered on each shard
  bot.eventHandlers.shardReady?.(shardId);

  const payload = data.d;
  const shard = bot.gateway.shards.get(shardId);
  // All guilds are unavailable at first
  const since = Date.now();
  for (let i = 0, len = payload.guilds.length; i < len; ++i) {
    bot.cache.unavailableGuilds.set(BigInt(payload.guilds[i].id), {
      shardId,
      since,
    });
    shard?.unavailableGuildIds.add(BigInt(payload.guilds[i].id));
  }

  if (!shard) return;

  // The bot has already started, the last shard is resumed, however.
  if (bot.isReady) return;

  bot.id = BigInt(payload.user.id);
  bot.applicationId = BigInt(payload.application.id);

  // Set ready to false just to go sure
  shard.ready = false;

  // Falied to load check
  shard.failedToLoadTimeoutId = setTimeout(() => {
    // TODO: implement an filter shortcut
    bot.eventHandlers.shardFailedToLoad?.(shard.id, shard.unavailableGuildIds);
    // Force execute the loaded function to prevent infinite loop
    return loaded(bot, shard);
  }, 5000);
}

export function guildAvailable(bot: Bot, shard: Shard, guildId: bigint) {
  if (!shard.failedToLoadTimeoutId) return;

  clearTimeout(shard.failedToLoadTimeoutId);
  shard.unavailableGuildIds.delete(guildId);
  if (!shard.unavailableGuildIds.size) return loaded(bot, shard);

  shard.failedToLoadTimeoutId = setTimeout(() => {
    bot.eventHandlers.shardFailedToLoad?.(shard.id, shard.unavailableGuildIds);
    // Force execute the loaded function to prevent infinite loop
    return loaded(bot, shard);
  }, 5000);
}

function loaded(bot: Bot, shard: Shard) {
  shard.ready = true;

  // If it is not the last shard we can't go full ready
  if (shard.id !== bot.gateway.lastShardId) return;

  // Still some shards are loading so wait another 2 seconds for them
  if (bot.gateway.shards.some((shard) => !shard.ready)) {
    setTimeout(() => {
      loaded(bot, shard);
    }, 2000);

    return;
  }

  bot.isReady = true;
  bot.eventHandlers.ready?.();
}
