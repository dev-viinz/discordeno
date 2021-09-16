import transformChannel from "./channel/channel.transformer.ts";
import transformOverwrite from "./channel/overwrite.transformer.ts";
import transformThreadMember from "./channel/thread_member.transformer.ts";
import transformThreadMetadata from "./channel/thread_metadata.transformer.ts";
import transformGatewayBot from "./gateway/gateway_bot.transformer.ts";
import transformUser from "./user/user.transformer.ts";
import transformSticker from "./sticker/sticker.transformer.ts";
import transformRole from "./permissions/role.transformer.ts";
import transformGuild from "./guild/guild.transformer.ts";
import transformEmoji from "./emoji/emoji.transformer.ts";
import transformThread from "./channel/thread.transformer.ts";
import transformMessage from "./channel/message.transformer.ts";
import transformGuildMember from "./guild/guild_member.transformer.ts";
import transformApplicationCommandInteractionData from "./interactions/application_command_interaction_data.transformer.ts";
import transformApplicationResolvedData from "./interactions/application_command_resolved_data.transformer.ts";
import transformInteraction from "./interactions/interaction.transformer.ts";
import transformMessageComponentData from "./interactions/message_component_data.transformer.ts";

export {
  transformChannel,
  transformOverwrite,
  transformThreadMember,
  transformThreadMetadata,
  transformGatewayBot,
  transformUser,
  transformSticker,
  transformRole,
  transformGuild,
  transformEmoji,
  transformThread,
  transformInteraction,
  transformMessage,
  transformGuildMember,
  transformApplicationCommandInteractionData,
  transformApplicationResolvedData,
  transformMessageComponentData,
};

const transformers = {
  transformChannel,
  transformOverwrite,
  transformThreadMember,
  transformThreadMetadata,
  transformGatewayBot,
  transformUser,
  transformSticker,
  transformRole,
  transformGuild,
  transformEmoji,
  transformThread,
  transformInteraction,
  transformMessage,
  transformGuildMember,
  transformApplicationCommandInteractionData,
  transformApplicationResolvedData,
  transformMessageComponentData,
};

export function createTransformers(
  customTransformers?: Transformers
): Transformers {
  return { ...transformers, ...customTransformers };
}

export type Transformers = typeof transformers;
