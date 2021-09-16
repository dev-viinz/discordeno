import { Interaction } from "../../types/interactions/interaction.ts";
import { InteractionTypes } from "../../types/interactions/interaction_types.ts";
import { ToDiscordType } from "../../types/utils.ts";
import transformUser from "../user/user.transformer.ts";
import transformApplicationCommandInteractionData from "./application_command_interaction_data.transformer.ts";
import transformGuildMember from "../guild/guild_member.transformer.ts";
import transformMessage from "../channel/message.transformer.ts";
import transformMessageComponentData from "./message_component_data.transformer.ts";

export function transformInteraction(
  data: ToDiscordType<Interaction>
): Interaction {
  switch (data.type) {
    case InteractionTypes.ApplicationCommand:
      return {
        id: BigInt(data.id),
        applicationId: BigInt(data.application_id),
        type: InteractionTypes.ApplicationCommand,
        channelId: BigInt(data.channel_id!),
        guildId: data.guild_id ? BigInt(data.guild_id) : 0n,
        token: data.token,
        member: data.member
          ? transformGuildMember({ ...data.member, user: undefined })
          : undefined,
        user: transformUser(data.user ?? data.member!.user!),
        version: 1,
        data: transformApplicationCommandInteractionData(data.data),
      };
    case InteractionTypes.MessageComponent:
      return {
        id: BigInt(data.id),
        applicationId: BigInt(data.application_id),
        type: InteractionTypes.MessageComponent,
        channelId: BigInt(data.channel_id!),
        guildId: 0n,
        token: data.token,
        user: transformUser(data.user ?? data.member!.user!),
        member: data.member
          ? transformGuildMember({ ...data.member, user: undefined })
          : undefined,
        message: transformMessage(data.message),
        version: 1,
        data: transformMessageComponentData(data.data),
      };
    case InteractionTypes.Ping:
      return {
        id: BigInt(data.id),
        applicationId: BigInt(data.application_id),
        type: InteractionTypes.Ping,
        channelId: 0n,
        guildId: 0n,
        token: data.token,
        user: transformUser(data.user!),
        version: 1,
        data: undefined,
      };
  }
}

export default transformInteraction;
