import {
  ApplicationCommandInteraction,
  Interaction,
} from "../../../types/interactions/interaction.ts";
import { InteractionTypes } from "../../../types/interactions/interaction_types.ts";
import { ToDiscordType } from "../../../types/utils.ts";

export function isApplicationCommandInteraction(
  interaction: Interaction | ToDiscordType<Interaction>
): interaction is ApplicationCommandInteraction {
  return interaction.type === InteractionTypes.ApplicationCommand;
}
