import { Bot } from "../../bot.ts";
import { GatewayDispatchEvents } from "../../types/gateway/gateway_dispatch_events.ts";
import { GatewayDispatchPayload } from "../../types/gateway/gateway_payload.ts";
import { ToDiscordType } from "../../types/utils.ts";

export default async function handleChannelUpdate(
  bot: Bot,
  data: ToDiscordType<GatewayDispatchPayload>
) {
  if (data.t !== GatewayDispatchEvents.ChannelUpdate) return;

  const oldChannel = await bot.cache.channels.get(BigInt(data.d.id));
  if (!oldChannel) return;

  const newChannel = bot.transformers.transformChannel(data.d);
  await bot.cache.channels.set(newChannel.id, newChannel);

  bot.eventHandlers.channelUpdate?.(newChannel, oldChannel);
}
