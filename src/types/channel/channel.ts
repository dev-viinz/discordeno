import { Snowflake } from "../base.ts";
import { User } from "../user/user.ts";
import { ChannelTypes } from "./channel_types.ts";
import { Overwrite } from "./overwrite.ts";
import { ThreadMember } from "./threads/thread_member.ts";
import { ThreadMetadata } from "./threads/thread_metadata.ts";

/**
 * https://discord.com/developers/docs/resources/channel#channel-object-channel-structure
 */
export interface Channel {
  /** The id of this channel */
  id: Snowflake;
  /** The [type of channel](https://discord.com/developers/docs/resources/channel#channel-object-channel-types) */
  type: ChannelTypes;
  /** The id of the guild (maybe missing for some channel objects received over gateway guild dispatches) */
  guildId: Snowflake;
  /** Sorting position of the channel. */
  position?: number;
  /** Explicit permission overwrites for member and roles. */
  permissionOverwrites: Overwrite[];
  /** The name of the channel (1-100 characters). */
  name?: string;
  /** The channel topic (0-1024 characters). */
  topic?: string;
  /** Whether the channel is nsfw. */
  nsfw?: boolean;
  /** The id of the last message sent in this channel (may not point to an existing or valid message) */
  lastMessageId?: Snowflake;
  /** The bitrate (in bits) if it is a voice channel. */
  bitrate?: number;
  /** The user limit if it is a voice channel. */
  userLimit?: number;
  // TODO: MANAGE_CHANNEL > MANAGE_CHANNELS make a PR to discord docs since its a typo
  /** Amount of seconds a user has to wait before sending another message (0-21600); bots, as well as users with the permission `MANAGE_MESSAGES` or `MANAGE_CHANNELS`, are unaffected. */
  rateLimitPerUser?: number;
  /** The recipients of the DM. */
  recipients?: User[];
  /** Icon Hash. */
  icon?: bigint | null;
  /** Id of the creator of the group DM or thread. */
  ownerId?: Snowflake;
  /** Application id of the group DM creator if it is bot-created. */
  applicationId?: Snowflake;
  /** For guild channels: id of the parent category for a channel (each parent category can contain up to 50 channels),
   * for threads: id of the text channel this thread waas created.
   */
  parentId?: Snowflake;
  /** When the last pinned message was pinned. This may be `null` in events such as `GUILD_CREATE` when a message is not pinned. */
  lastPinTimestamp?: number | null;
  /** [Voice region](https://discord.com/developers/docs/resources/voice#voice-region-object) id for the voice channel, automatic when set to `null`. */
  rtcRegion?: string | null;
  /** The camera [video quality mode](https://discord.com/developers/docs/resources/channel#channel-object-video-quality-modes) of the voice channel, 1 when not present. */
  videoQualityMode?: number;
  /** An approcimate count of messages in a thread, stops counting at 50. */
  messageCount?: number;
  /** An approcimate count of users in a thread, stops counting at 50. */
  memberCount?: number;
  /** Thread specific fields not needed by other channels. */
  threadMetadata?: ThreadMetadata;
  /** Thread member object for the current user, if they have joined the thread, only included on certain API endpoints. */
  member?: ThreadMember;
  /** Default duration for newly created threads, in minutes, to automatically archive the thread after recent activity, can be set to 60, 1440, 4320, 10080. */
  defaultAutoArchiveDuration?: 60 | 1440 | 4320 | 10080;
  /** Computed permissions for the invoking user in the channel, including overwrites, only included when part of the `resolved` data received on a slash command interaction. */
  permissions?: string;
}

export interface TebamiThread {
  /** The id of this channel */
  id: Snowflake;
  /** The [type of channel](https://discord.com/developers/docs/resources/channel#channel-object-channel-types) */
  type:
    | ChannelTypes.GuildNewsThread
    | ChannelTypes.GuildPublicThread
    | ChannelTypes.GuildPrivateThread;

  /** Id of the text channel this thread waas created. */
  parentId: Snowflake;
  /** An approcimate count of users in a thread, stops counting at 50. */
  memberCount: number;
  /** An approcimate count of messages in a thread, stops counting at 50. */
  messageCount: number;
  /** Timestamp when the thread's archive status was last changed, used for calculating recent activity */
  archiveTimestamp: number;
  /** Duration in minutes to automatically archive the thread after recent activity */
  autoArchiveDuration: number;
  /** Whether the thread is archived */
  archived: boolean;
  /** When a thread is locked, only users with `MANAGE_THREADS` can unarchive it */
  locked: boolean;
  /** Id of the creator of the group DM or thread. */
  ownerId: Snowflake;
  /** Whether the bot has joined this thread. */
  botIsMember: boolean;
  /** The id of the guild (maybe missing for some channel objects received over gateway guild dispatches) */
  guildId: Snowflake;
}
