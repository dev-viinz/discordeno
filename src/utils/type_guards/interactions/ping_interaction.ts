import {
  Interaction,
  PingInteraction,
} from "../../../types/interactions/interaction.ts";
import { InteractionTypes } from "../../../types/interactions/interaction_types.ts";
import { ToDiscordType } from "../../../types/utils.ts";

export function isPingInteraction(
  interaction: Interaction | ToDiscordType<Interaction>,
): interaction is PingInteraction {
  return interaction.type === InteractionTypes.Ping;
}
