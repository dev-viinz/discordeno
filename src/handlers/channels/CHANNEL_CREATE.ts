import { Bot } from "../../bot.ts";
import { GatewayDispatchEvents } from "../../types/gateway/gateway_dispatch_events.ts";
import { GatewayDispatchPayload } from "../../types/gateway/gateway_payload.ts";
import { ToDiscordType } from "../../types/utils.ts";

export default async function handleChannelCreate(
  bot: Bot,
  data: ToDiscordType<GatewayDispatchPayload>,
) {
  if (data.t !== GatewayDispatchEvents.ChannelCreate) return;

  const channel = bot.transformers.transformChannel(data.d);
  await bot.cache.channels.set(channel.id, channel);

  bot.eventHandlers.channelCreate?.(channel);
}
