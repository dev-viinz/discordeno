import { ApplicationCommandInteractionData } from "../../types/interactions/commands/application_command_interaction_data.ts";
import { ToDiscordType } from "../../types/utils.ts";
import { hasProperty } from "../../utils/has_property.ts";
import transformApplicationCommandResolvedData from "./application_command_resolved_data.transformer.ts";

export default function transformApplicationCommandInteractionData(
  data: ToDiscordType<ApplicationCommandInteractionData>
): ApplicationCommandInteractionData {
  return {
    id: BigInt(data.id),
    name: data.name,
    type: data.type,
    resolved: data.resolved
      ? transformApplicationCommandResolvedData(data.resolved)
      : undefined,
    options: data.options,
    targetId: hasProperty(data, "target_id")
      ? BigInt(data.target_id)
      : undefined,
  } as ApplicationCommandInteractionData;
}
