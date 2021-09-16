import { Bot } from "../../bot.ts";
import { GatewayDispatchEvents } from "../../types/gateway/gateway_dispatch_events.ts";
import { GatewayDispatchPayload } from "../../types/gateway/gateway_payload.ts";
import { ToDiscordType } from "../../types/utils.ts";

export default function handleInteractionCreate(
  bot: Bot,
  data: ToDiscordType<GatewayDispatchPayload>
) {
  if (data.t !== GatewayDispatchEvents.InteractionCreate) return;

  bot.eventHandlers.interactionCreate?.(
    bot.transformers.transformInteraction(data.d)
  );
}
