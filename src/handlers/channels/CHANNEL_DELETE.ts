import { Bot } from "../../bot.ts";
import { ChannelTypes } from "../../types/channel/channel_types.ts";
import { GatewayDispatchEvents } from "../../types/gateway/gateway_dispatch_events.ts";
import { GatewayDispatchPayload } from "../../types/gateway/gateway_payload.ts";
import { ToDiscordType } from "../../types/utils.ts";

export default async function handleChannelDelete(
  bot: Bot,
  data: ToDiscordType<GatewayDispatchPayload>,
) {
  if (data.t !== GatewayDispatchEvents.ChannelDelete) return;

  const cachedChannel = await bot.cache.channels.get(BigInt(data.d.id));
  if (!cachedChannel) return;

  if (cachedChannel.type === ChannelTypes.GuildVoice && data.d.guild_id) {
    const guild = await bot.cache.guilds.get(cachedChannel.guildId);

    if (guild) {
      return Promise.all(
        guild.voiceStates.map(async (vs, key) => {
          if (vs.channelId !== cachedChannel.id) return;

          // Since this channel was deleted all voice states for this channel should be deleted
          guild.voiceStates.delete(key);

          const user = await bot.cache.users.get(vs.userId);
          if (!user) return;

          bot.eventHandlers.voiceChannelLeave?.(user, vs.channelId);
        }),
      );
    }
  }

  if (
    [
      ChannelTypes.GuildText,
      ChannelTypes.DM,
      ChannelTypes.GroupDm,
      ChannelTypes.GuildNews,
    ].includes(data.d.type)
  ) {
    await bot.cache.channels.delete(BigInt(data.d.id));
    await bot.cache.execute("DELETE_MESSAGES_FROM_CHANNEL", {
      channelId: BigInt(data.d.id),
    });
  }

  await bot.cache.channels.delete(BigInt(data.d.id));

  bot.eventHandlers.channelDelete?.(cachedChannel);
}
