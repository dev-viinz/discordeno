import { Channel, TebamiThread } from "../../types/channel/channel.ts";
import { ChannelTypes } from "../../types/channel/channel_types.ts";
import { ToDiscordType } from "../../types/utils.ts";

/** Very important this function does not check if the channel is a thread. */
export function transformThread(data: ToDiscordType<Channel>): TebamiThread {
  return {
    id: BigInt(data.id),
    type: data.type as
      | ChannelTypes.GuildNewsThread
      | ChannelTypes.GuildPublicThread
      | ChannelTypes.GuildPrivateThread,
    parentId: BigInt(data.parent_id!),
    memberCount: data.member_count!,
    messageCount: data.message_count!,
    archiveTimestamp: Date.parse(data.thread_metadata!.archive_timestamp),
    autoArchiveDuration: data.thread_metadata!.auto_archive_duration,
    archived: data.thread_metadata!.archived,
    locked: data.thread_metadata!.locked ?? false,
    ownerId: BigInt(data.owner_id!),
    botIsMember: Boolean(data.member),
    guildId: BigInt(data.guild_id!),
  };
}

export default transformThread;
