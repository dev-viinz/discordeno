import { Message } from "../../types/channel/messages/message.ts";
import { ToDiscordType } from "../../types/utils.ts";
import transformGuildMember from "../guild/guild_member.transformer.ts";
import transformUser from "../user/user.transformer.ts";
import { transformThread } from "./thread.transformer.ts";

export function transformMessage(data: ToDiscordType<Message>): Message {
  return {
    id: BigInt(data.id),
    channelId: BigInt(data.channel_id),
    guildId: data.guild_id ? BigInt(data.guild_id) : 0n,
    author: transformUser(data.author),
    member: data.member ? transformGuildMember(data.member) : undefined, // TODO allow Omit<member, "user">
    content: data.content,
    timestamp: Date.parse(data.timestamp),
    editedTimestamp: data.edited_timestamp
      ? Date.parse(data.edited_timestamp)
      : null,
    tts: data.tts,
    mentionEveryone: data.mention_everyone,
    mentions: [], // TODO: (User & { member: Omit<GuildMember, "user"> })[],
    mentionRoles: data.mention_roles.map((id) => BigInt(id)),
    mentionChannels: [], // TODO: parse mentions out of the message
    attachments: [], // TODO
    embeds: [], // TODO: data.embeds,
    reactions: [], // TODO
    nonce: data.nonce,
    pinned: data.pinned,
    webhookId: data.webhook_id ? BigInt(data.webhook_id) : undefined,
    type: data.type,
    activity: data.activity,
    application: undefined, // TODO:
    applicationId: data.application_id
      ? BigInt(data.application_id)
      : undefined,
    messageReference: undefined, // TODO
    flags: data.flags,
    referencedMessage: data.referenced_message
      ? transformMessage(data.referenced_message)
      : undefined,
    interaction: undefined, // TODO
    thread: data.thread ? transformThread(data.thread) : undefined, // TODO
    components: [], // TODO
    stickerItem: [], // TODO
  };
}

export default transformMessage;
