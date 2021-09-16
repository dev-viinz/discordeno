import {
  ComponentInteraction,
  Interaction,
} from "../../../types/interactions/interaction.ts";
import { InteractionTypes } from "../../../types/interactions/interaction_types.ts";
import { ToDiscordType } from "../../../types/utils.ts";

export function isComponentInteraction(
  interaction: Interaction | ToDiscordType<Interaction>,
): interaction is ComponentInteraction {
  return interaction.type === InteractionTypes.MessageComponent;
}
