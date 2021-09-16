import { Channel } from "../../types/channel/channel.ts";
import { ToDiscordType } from "../../types/utils.ts";
import { iconHashToBigInt } from "../../utils/hash.ts";
import { transformOverwrite } from "./overwrite.transformer.ts";
import { transformThreadMember } from "./thread_member.transformer.ts";
import { transformThreadMetadata } from "./thread_metadata.transformer.ts";
import transformUser from "../user/user.transformer.ts";

export function transformChannel(channel: ToDiscordType<Channel>): Channel {
  return {
    id: BigInt(channel.id),
    type: channel.type,
    guildId: channel.guild_id ? BigInt(channel.guild_id) : 0n,
    position: channel.position,
    permissionOverwrites:
      channel.permission_overwrites?.map((overwrite) =>
        transformOverwrite(overwrite)
      ) ?? [],
    name: channel.name,
    topic: channel.topic,
    nsfw: channel.nsfw,
    lastMessageId: channel.last_message_id
      ? BigInt(channel.last_message_id)
      : undefined,
    bitrate: channel.bitrate,
    userLimit: channel.user_limit,
    rateLimitPerUser: channel.rate_limit_per_user,
    recipients: channel.recipients?.map((recipient) =>
      transformUser(recipient)
    ),
    icon: channel.icon ? iconHashToBigInt(channel.icon) : undefined,
    ownerId: channel.owner_id ? BigInt(channel.owner_id) : undefined,
    applicationId: channel.application_id
      ? BigInt(channel.application_id)
      : undefined,
    parentId: channel.parent_id ? BigInt(channel.parent_id) : undefined,
    lastPinTimestamp: channel.last_pin_timestamp
      ? Date.parse(channel.last_pin_timestamp)
      : undefined,
    rtcRegion: channel.rtc_region,
    videoQualityMode: channel.video_quality_mode,
    messageCount: channel.message_count,
    memberCount: channel.member_count,
    threadMetadata: channel.thread_metadata
      ? transformThreadMetadata(channel.thread_metadata)
      : undefined,
    member: channel.member ? transformThreadMember(channel.member) : undefined,
    defaultAutoArchiveDuration: channel.default_auto_archive_duration,
    permissions: channel.permissions,
  };
}

export default transformChannel;
