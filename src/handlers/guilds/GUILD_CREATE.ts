import { Bot } from "../../bot.ts";
import { GatewayDispatchEvents } from "../../types/gateway/gateway_dispatch_events.ts";
import { GatewayDispatchPayload } from "../../types/gateway/gateway_payload.ts";
import { ToDiscordType } from "../../types/utils.ts";
import { guildAvailable } from "../misc/READY.ts";

export default async function handleGuildCreate(
  bot: Bot,
  data: ToDiscordType<GatewayDispatchPayload>,
  shardId: number
) {
  if (data.t !== GatewayDispatchEvents.GuildCreate) return;

  const payload = data.d;
  // When shards resume they emit GUILD_CREATE again.
  if (
    (await bot.cache.guilds.has(BigInt(payload.id))) ||
    (await bot.cache.unavailableGuilds.get(BigInt(payload.id)))?.dispatched
  )
    return;

  const guild = bot.transformers.transformGuild(payload);
  Promise.all(
    payload.channels.map(
      async (channel) =>
        await bot.cache.channels.set(
          BigInt(channel.id),
          bot.transformers.transformChannel({
            ...channel,
            guild_id: payload.id,
          })
        )
    )
  );
  Promise.all(
    payload.threads.map(
      async (thread) =>
        await bot.cache.threads.set(
          BigInt(thread.id),
          bot.transformers.transformThread(thread)
        )
    )
  );
  // TODO : good way to cache users
  // TODO: good way to cache presences
  await bot.cache.guilds.set(guild.id, guild);

  if (await bot.cache.unavailableGuilds.has(guild.id)) {
    const shard = bot.gateway.shards.get(shardId);
    if (shard) guildAvailable(bot, shard, guild.id);

    return bot.eventHandlers.guildAvailable?.(guild, shardId);
  }

  if (!bot.isReady) return bot.eventHandlers.guildLoaded?.(guild, shardId);
  bot.eventHandlers.guildCreate?.(guild, shardId);
}
