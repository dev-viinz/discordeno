import { Application } from "../application/application.ts";
import { Snowflake } from "../base.ts";
import { Channel } from "../channel/channel.ts";
import { Message } from "../channel/messages/message.ts";
import { ThreadMember } from "../channel/threads/thread_member.ts";
import { GatewayOpcodes } from "../codes/gateway_opcodes.ts";
import { Emoji } from "../emoji/emoji.ts";
import { Guild } from "../guild/guild.ts";
import { GuildMemberWithUser } from "../guild/guild_member.ts";
import { Integration } from "../guild/integration.ts";
import { UnavailableGuild } from "../guild/unavailable_guild.ts";
import { ChatInputApplicationCommand } from "../interactions/commands/application_command.ts";
import { Interaction } from "../interactions/interaction.ts";
import { InviteTargetTypes } from "../invite/invite_target_types.ts";
import { Role } from "../permissions/role.ts";
import { StageInstance } from "../stage_instance/stage_instance.ts";
import { Sticker } from "../sticker/sticker.ts";
import { User } from "../user/user.ts";
import { MakeUnoptional, PickPartial } from "../utils.ts";
import { VoiceState } from "../voice/voice_state.ts";
import { GatewayDispatchEvents } from "./gateway_dispatch_events.ts";

interface BasePayload<OP extends GatewayOpcodes> {
  /**
   * Opcode for the payload
   */
  op: OP;
  /**
   * Event data
   */
  d?: unknown;
  /**
   * Sequence number, used for resuming sessions and heartbeats
   */
  s: number;
  /**
   * The event name for this payload
   */
  t?: string;
}

interface DispatchPayload<Event extends GatewayDispatchEvents, D = unknown>
  extends BasePayload<GatewayOpcodes.Dispatch> {
  /**
   * The event name for this payload
   */
  t: Event;
  /**
   * Event data
   */
  d: D;
}

type NonDispatchPayload<OP extends GatewayOpcodes, D = unknown> =
  & Omit<
    BasePayload<OP>,
    "t"
  >
  & {
    /**
     * Event data
     */
    d: D;
  };

/**
 * https://discord.com/developers/docs/topics/gateway#hello
 */
export interface GatewayHello extends NonDispatchPayload<GatewayOpcodes.Hello> {
  d: GatewayHelloData;
}

/**
 * https://discord.com/developers/docs/topics/gateway#hello-structure
 */
export interface GatewayHelloData {
  /**
   * The interval (in milliseconds) the client should heartbeat with
   */
  heartbeatInterval: number;
}

/**
 * https://discord.com/developers/docs/topics/gateway#heartbeating
 */
export interface GatewayHeartbeatRequest
  extends NonDispatchPayload<GatewayOpcodes.Heartbeat> {
  d: GatewayHeartbeatRequestData;
}

/**
 * https://discord.com/developers/docs/topics/gateway#heartbeating
 */
export type GatewayHeartbeatRequestData = never;

/**
 * https://discord.com/developers/docs/topics/gateway#ready
 */
export type GatewayReady = DispatchPayload<
  GatewayDispatchEvents.Ready,
  GatewayReadyData
>;

/**
 * https://discord.com/developers/docs/topics/gateway#ready-ready-event-fields
 */
export interface GatewayReadyData {
  /** [Gateway Version](https://discord.com/developers/docs/topics/gateway#gateways-gateway-versions). */
  v: number;
  /** Information about the user including email. */
  user: User;
  /** The guilds the user id in. */
  guilds: UnavailableGuild[];
  /** Used for resuming connections. */
  sessionId: string;
  /** The shard [information associated](https://discord.com/developers/docs/topics/gateway#sharding) with this session, if sent when identifying. */
  shard?: [shardId: number, numShards: number];
  /** Contains `id` and `flags` */
  application: PickPartial<Application, "id" | "flags">;
}

/**
 * https://discord.com/developers/docs/topics/gateway#resumed
 */
export type GatewayResumed = DispatchPayload<
  GatewayDispatchEvents.Resumed,
  GatewayResumedData
>;

/**
 * https://discord.com/developers/docs/topics/gateway#resumed
 */
export type GatewayResumedData = never;

/**
 * https://discord.com/developers/docs/topics/gateway#heartbeating-example-gateway-heartbeat-ack
 */
export interface GatewayHeartbeatAck
  extends NonDispatchPayload<GatewayOpcodes.HeartbeatACK> {
  d: GatewayHeartbeatAckData;
}

/**
 * https://discord.com/developers/docs/topics/gateway#heartbeating-example-gateway-heartbeat-ack
 */
export type GatewayHeartbeatAckData = never;

/**
 * https://discord.com/developers/docs/topics/gateway#invalid-session
 */
export interface GatewayInvalidSession
  extends NonDispatchPayload<GatewayOpcodes.InvalidSession> {
  d: GatewayInvalidSessionData;
}

/**
 * https://discord.com/developers/docs/topics/gateway#invalid-session-example-gateway-invalid-session
 */
export type GatewayInvalidSessionData = boolean;

/**
 * https://discord.com/developers/docs/topics/gateway#reconnect
 */
export interface GatewayReconnect
  extends NonDispatchPayload<GatewayOpcodes.Reconnect> {
  d: GatewayReconnectData;
}

/**
 * https://discord.com/developers/docs/topics/gateway#reconnect
 */
export type GatewayReconnectData = boolean;

/**
 * https://discord.com/developers/docs/topics/gateway#channel-create
 */
export type GatewayChannelCreate = DispatchPayload<
  GatewayDispatchEvents.ChannelCreate,
  GatewayChannelCreateData
>;

/**
 * https://discord.com/developers/docs/topics/gateway#channel-create
 */
export type GatewayChannelCreateData = Channel;

/**
 * https://discord.com/developers/docs/topics/gateway#channel-update
 */
export type GatewayChannelUpdate = DispatchPayload<
  GatewayDispatchEvents.ChannelUpdate,
  GatewayChannelUpdateData
>;

/**
 * https://discord.com/developers/docs/topics/gateway#channel-update
 */
export type GatewayChannelUpdateData = Channel;

/**
 * https://discord.com/developers/docs/topics/gateway#channel-delete
 */
export type GatewayChannelDelete = DispatchPayload<
  GatewayDispatchEvents.ChannelDelete,
  GatewayChannelDeleteData
>;

/**
 * https://discord.com/developers/docs/topics/gateway#channel-delete
 */
export type GatewayChannelDeleteData = Channel;

/**
 * https://discord.com/developers/docs/topics/gateway#thread-create
 */
export type GatewayThreadCreate = DispatchPayload<
  GatewayDispatchEvents.ThreadCreate,
  GatewayThreadCreateData
>;

/**
 * https://discord.com/developers/docs/topics/gateway#thread-create
 */
export type GatewayThreadCreateData = Channel;

/**
 * https://discord.com/developers/docs/topics/gateway#thread-update
 */
export type GatewayThreadUpdate = DispatchPayload<
  GatewayDispatchEvents.ThreadUpdate,
  GatewayThreadUpdateData
>;

/**
 * https://discord.com/developers/docs/topics/gateway#thread-update
 */
export type GatewayThreadUpdateData = Channel;

/**
 * https://discord.com/developers/docs/topics/gateway#thread-delete
 */
export type GatewayThreadDelete = DispatchPayload<
  GatewayDispatchEvents.ThreadDelete,
  GatewayThreadDeleteData
>;

/**
 * https://discord.com/developers/docs/topics/gateway#thread-delete
 */
export type GatewayThreadDeleteData = Pick<
  Channel,
  "id" | "guildId" | "parentId" | "type"
>;

/**
 * https://discord.com/developers/docs/topics/gateway#thread-list-sync
 */
export type GatewayThreadListSync = DispatchPayload<
  GatewayDispatchEvents.ThreadListSync,
  GatewayThreadListSyncData
>;

/**
 * https://discord.com/developers/docs/topics/gateway#thread-list-sync-thread-list-sync-event-fields
 */
export interface GatewayThreadListSyncData {
  /** The id of the guild. */
  guildId: Snowflake;
  /** The parent channel ids whose threads are being synced.
   * If omitted, then threads were synced for the entire guild.
   * This array may contain channelIds that have no active threads as well,
   * so you know to clear that data.
   */
  channelIds?: Snowflake[];
  /** All active threads in the given channels that the current user can access. */
  threads: Channel[];
  /** All thread member objects from the synced threads for the current user,
   * indicating which threads the current user has been added to.
   */
  members: ThreadMember[];
}

/**
 * https://discord.com/developers/docs/topics/gateway#thread-member-update
 */
export type GatewayThreadMemberUpdate = DispatchPayload<
  GatewayDispatchEvents.ThreadMemberUpdate,
  GatewayThreadMemberUpdateData
>;

/**
 * https://discord.com/developers/docs/topics/gateway#thread-member-update
 */
export type GatewayThreadMemberUpdateData = ThreadMember;

/**
 * https://discord.com/developers/docs/topics/gateway#thread-members-update
 */
export type GatewayThreadMembersUpdate = DispatchPayload<
  GatewayDispatchEvents.ThreadMembersUpdate,
  GatewayThreadMembersUpdateData
>;

/**
 * https://discord.com/developers/docs/topics/gateway#thread-members-update-thread-members-update-event-fields
 */
export interface GatewayThreadMembersUpdateData {
  /** The id of the thread. */
  id: Snowflake;
  /** The id of the guild. */
  guildId: Snowflake;
  /** The approximate number of members in the thread, capped at 50. */
  memberCount: number;
  /** The users who were added to the thread. */
  addedMembers?: ThreadMember[];
  /** The id of the users who were removed from the thread. */
  removedMemberIds?: Snowflake[];
}

/**
 * https://discord.com/developers/docs/topics/gateway#channel-pins-update
 */
export type GatewayChannelPinsUpdate = DispatchPayload<
  GatewayDispatchEvents.ChannelPinsUpdate,
  GatewayChannelPinsUpdateData
>;

/**
 * https://discord.com/developers/docs/topics/gateway#channel-pins-update-channel-pins-update-event-fields
 */
export interface GatewayChannelPinsUpdateData {
  /** The id of the guild. */
  guildId?: Snowflake;
  /** The id of the channel. */
  channelId: Snowflake;
  /** The time at which the most recent pinned message was pinned. */
  lastPinTimestamp?: number | null;
}

/**
 * https://discord.com/developers/docs/topics/gateway#guild-create
 */
export type GatewayGuildCreate = DispatchPayload<
  GatewayDispatchEvents.GuildCreate,
  GatewayGuildCreateData
>;

/**
 * https://discord.com/developers/docs/topics/gateway#guild-create
 */
export type GatewayGuildCreateData = MakeUnoptional<
  Guild,
  | "joinedAt"
  | "large"
  | "unavailable"
  | "memberCount"
  | "voiceStates"
  | "members"
  | "channels"
  | "threads"
  | "presences"
  | "stageInstances"
>;

/**
 * https://discord.com/developers/docs/topics/gateway#guild-update
 */
export type GatewayGuildUpdate = DispatchPayload<
  GatewayDispatchEvents.GuildUpdate,
  GatewayGuildUpdateData
>;

/**
 * https://discord.com/developers/docs/topics/gateway#guild-update
 */
export type GatewayGuildUpdateData = Guild;

/**
 * https://discord.com/developers/docs/topics/gateway#guild-delete
 */
export type GatewayGuildDelete = DispatchPayload<
  GatewayDispatchEvents.GuildDelete,
  GatewayGuildDeleteData
>;

/**
 * https://discord.com/developers/docs/topics/gateway#guild-delete
 */
export type GatewayGuildDeleteData = UnavailableGuild;

/**
 * https://discord.com/developers/docs/topics/gateway#guild-ban-add
 */
export type GatewayGuildBanAdd = DispatchPayload<
  GatewayDispatchEvents.GuildBanAdd,
  GatewayGuildBanAddData
>;

/**
 * https://discord.com/developers/docs/topics/gateway#guild-ban-add-guild-ban-add-event-fields
 */
export interface GatewayGuildBanAddData {
  /** Id of the guild. */
  guildId: Snowflake;
  /** The banned user. */
  user: User;
}

/**
 * https://discord.com/developers/docs/topics/gateway#guild-ban-remove
 */
export type GatewayGuildBanRemove = DispatchPayload<
  GatewayDispatchEvents.GuildBanRemove,
  GatewayGuildBanRemoveData
>;

/**
 * https://discord.com/developers/docs/topics/gateway#guild-ban-remove-guild-ban-remove-event-fields
 */
export interface GatewayGuildBanRemoveData {
  /** Id of the guild. */
  guildId: Snowflake;
  /** The banned user. */
  user: User;
}

/**
 * https://discord.com/developers/docs/topics/gateway#guild-emojis-update
 */
export type GatewayGuildEmojisUpdate = DispatchPayload<
  GatewayDispatchEvents.GuildEmojisUpdate,
  GatewayGuildEmojisUpdateData
>;

/**
 * https://discord.com/developers/docs/topics/gateway#guild-emojis-update-guild-emojis-update-event-fields
 */
export interface GatewayGuildEmojisUpdateData {
  /** Id of the guild. */
  guildId: Snowflake;
  /** Array of [emojis](https://discord.com/developers/docs/resources/emoji#emoji-object) */
  emojis: Emoji[];
}

/**
 * https://discord.com/developers/docs/topics/gateway#guild-stickers-update
 */
export type GatewayGuildStickersUpdate = DispatchPayload<
  GatewayDispatchEvents.GuildStickersUpdate,
  GatewayGuildStickersUpdateData
>;

/**
 * https://discord.com/developers/docs/topics/gateway#guild-stickers-update-guild-stickers-update-event-fields
 */
export interface GatewayGuildStickersUpdateData {
  /** Id of the guild. */
  guildId: Snowflake;
  /** Array of [stickers](https://discord.com/developers/docs/resources/sticker#sticker-object) */
  stickers: Sticker[];
}

/**
 * https://discord.com/developers/docs/topics/gateway#guild-integrations-update
 */
export type GatewayGuildIntegrationsUpdate = DispatchPayload<
  GatewayDispatchEvents.GuildIntegrationsUpdate,
  GatewayGuildIntegrationsUpdateData
>;

/**
 * https://discord.com/developers/docs/topics/gateway#guild-integrations-update-guild-integrations-update-event-fields
 */
export interface GatewayGuildIntegrationsUpdateData {
  /** Id of the guild whose integrations were updated. */
  guildId: Snowflake;
}

/**
 * https://discord.com/developers/docs/topics/gateway#guild-member-add
 */
export type GatewayGuildMemberAdd = DispatchPayload<
  GatewayDispatchEvents.GuildMemberAdd,
  GatewayGuildMemberAddData
>;

/**
 * https://discord.com/developers/docs/topics/gateway#guild-member-add-guild-member-add-extra-fields
 */
export interface GatewayGuildMemberAddData extends GuildMemberWithUser {
  /** Id of the guild. */
  guildId: Snowflake;
}

/**
 * https://discord.com/developers/docs/topics/gateway#guild-member-remove
 */
export type GatewayGuildMemberRemove = DispatchPayload<
  GatewayDispatchEvents.GuildMemberRemove,
  GatewayGuildMemberRemoveData
>;

/**
 * https://discord.com/developers/docs/topics/gateway#guild-member-remove-guild-member-remove-event-fields
 */
export interface GatewayGuildMemberRemoveData {
  /** Id of the guild. */
  guildId: Snowflake;
  /** The user who was removed. */
  user: User;
}

/**
 * https://discord.com/developers/docs/topics/gateway#guild-member-update
 */
export type GatewayGuildMemberUpdate = DispatchPayload<
  GatewayDispatchEvents.GuildMemberUpdate,
  GatewayGuildMemberUpdateData
>;

/**
 * https://discord.com/developers/docs/topics/gateway#guild-member-update-guild-member-update-event-fields
 */
export interface GatewayGuildMemberUpdateData {
  /** Id of the guild. */
  guildId: Snowflake;
  /** User role ids. */
  roes: Snowflake[];
  /** The user. */
  user: User;
  /** Nickname of the user in the guild. */
  nick?: string | null;
  /** When the user joined the guild. */
  joinedAt: number | null;
  /** When the user starting [boosting](https://support.discord.com/hc/en-us/articles/360028038352-Server-Boosting-) the guild. */
  premiumSince?: number | null;
  /** Whether the user is deafened in voice channels. */
  deaf?: boolean;
  /** Whether the user is muted in voice channels. */
  mute?: boolean;
  /** Whether the user has not yet passed the guild's [Membersip Screening](https://discord.com/developers/docs/resources/guild#membership-screening-object) requirements. */
  pending?: boolean;
}

/**
 * https://discord.com/developers/docs/topics/gateway#guild-members-chunk
 */
export type GatewayGuildMembersChunk = DispatchPayload<
  GatewayDispatchEvents.GuildMembersChunk,
  GatewayGuildMembersChunkData
>;

/**
 * https://discord.com/developers/docs/topics/gateway#guild-members-chunk-guild-members-chunk-event-fields
 */
export interface GatewayGuildMembersChunkData {
  /** Id of the guild. */
  guildId: Snowflake;
  /** Set of guild members. */
  members: GuildMemberWithUser[];
  /** The chunk index the expected chunks for this response (0 <= chunkIndex < chunkCount). */
  chunkIndex: number;
  /** The total number of expected chunks for this response. */
  chunkCount: number;
  /** If passing an invalid id to `REQUEST_GUILD_MEMBERS`, it will be returned here. */
  notFound?: Snowflake[];
  /** If passing true to `REQUEST_GUILD_MEMBERS`, presences of the members will be here. */
  presences?: GatewayPresenceUpdateData[];
  /** The nonce used in the [Guild Members Request](https://discord.com/developers/docs/topics/gateway#request-guild-members) */
  nonce?: string;
}

/**
 * https://discord.com/developers/docs/topics/gateway#guild-role-create
 */
export type GatewayGuildRoleCreate = DispatchPayload<
  GatewayDispatchEvents.GuildRoleCreate,
  GatewayGuildRoleCreateData
>;

/**
 * https://discord.com/developers/docs/topics/gateway#guild-role-create-guild-role-create-event-fields
 */
export interface GatewayGuildRoleCreateData {
  /** Id of the guild. */
  guildId: Snowflake;
  /** The role created. */
  role: Role;
}

/**
 * https://discord.com/developers/docs/topics/gateway#guild-role-update
 */
export type GatewayGuildRoleUpdate = DispatchPayload<
  GatewayDispatchEvents.GuildRoleUpdate,
  GatewayGuildRoleUpdateData
>;

/**
 * https://discord.com/developers/docs/topics/gateway#guild-role-update-guild-role-update-event-fields
 */
export interface GatewayGuildRoleUpdateData {
  /** Id of the guild. */
  guildId: Snowflake;
  /** The role created. */
  role: Role;
}

/**
 * https://discord.com/developers/docs/topics/gateway#guild-role-delete
 */
export type GatewayGuildRoleDelete = DispatchPayload<
  GatewayDispatchEvents.GuildRoleDelete,
  GatewayGuildRoleDeleteData
>;

/**
 * https://discord.com/developers/docs/topics/gateway#guild-role-delete-guild-role-delete-event-fields
 */
export interface GatewayGuildRoleDeleteData {
  /** Id of the guild. */
  guildId: Snowflake;
  /** Id of the deleted role. */
  roleId: Snowflake;
}

/**
 * https://discord.com/developers/docs/topics/gateway#integration-create
 */
export type GatewayIntegrationCreate = DispatchPayload<
  GatewayDispatchEvents.IntegrationCreate,
  GatewayIntegrationCreateData
>;

/**
 * https://discord.com/developers/docs/topics/gateway#integration-create-integration-create-event-additional-fields
 */
export interface GatewayIntegrationCreateData extends Integration {
  /** Id of the guild. */
  guildId: Snowflake;
}

/**
 * https://discord.com/developers/docs/topics/gateway#integration-update
 */
export type GatewayIntegrationUpdate = DispatchPayload<
  GatewayDispatchEvents.IntegrationUpdate,
  GatewayIntegrationUpdateData
>;

/**
 * https://discord.com/developers/docs/topics/gateway#integration-update-integration-update-event-additional-fields
 */
export interface GatewayIntegrationUpdateData extends Integration {
  /** Id of the guild. */
  guildId: Snowflake;
}

/**
 * https://discord.com/developers/docs/topics/gateway#integration-delete
 */
export type GatewayIntegrationDelete = DispatchPayload<
  GatewayDispatchEvents.IntegrationDelete,
  GatewayIntegrationDeleteData
>;

/**
 * https://discord.com/developers/docs/topics/gateway#integration-delete-integration-delete-event-fields
 */
export interface GatewayIntegrationDeleteData {
  /** Integration Id. */
  id: Snowflake;
  /** Id of the guild. */
  guildId: Snowflake;
  /** Id of the bot/OAuth2 application for this discord integration. */
  applicationId?: Snowflake;
}

/**
 * https://discord.com/developers/docs/topics/gateway#invite-create
 */
export type GatewayInviteCreate = DispatchPayload<
  GatewayDispatchEvents.InviteCreate,
  GatewayInviteCreateData
>;

/**
 * https://discord.com/developers/docs/topics/gateway#invite-create-invite-create-event-fields
 */
export interface GatewayInviteCreateData {
  /** The channel the invite is for. */
  channelId: Snowflake;
  /** The unique invite [code](https://discord.com/developers/docs/resources/invite#invite-object). */
  code: string;
  /** The time at which the invite was created. */
  createdAt: number;
  /** The guild of the invite. */
  guildId?: Snowflake;
  /** The user that created the invite. */
  inviter?: User;
  /** How long the invite is valid for (in seconds). */
  maxAge: number;
  /** The maximum number of times the invite can be used. */
  maxUses: number;
  /** The [type of target](https://discord.com/developers/docs/resources/invite#invite-object-invite-target-types) for this voice channel invite. */
  targetType?: InviteTargetTypes;
  /** The user whose stream to display for this voice channel stream invite. */
  targetUser?: User;
  /** The embedded application to open for this voice channel embedded application invite. */
  targetApplication?: Partial<Application>;
  /** Whether or not the invite is temporary (invited users will be kicked on disconnect unless they're assigned a role) */
  temporary: boolean;
  /** How many times the invite ahs been used (always will be 0) */
  uses: 0;
}

/**
 * https://discord.com/developers/docs/topics/gateway#invite-delete
 */
export type GatewayInviteDelete = DispatchPayload<
  GatewayDispatchEvents.InviteDelete,
  GatewayInviteDeleteData
>;

/**
 * https://discord.com/developers/docs/topics/gateway#invite-delete-invite-delete-event-fields
 */
export interface GatewayInviteDeleteData {
  /** The channel of the invite. */
  channelId: Snowflake;
  /** The guild of the invite. */
  guildId?: Snowflake;
  /** The unique invite [code](https://discord.com/developers/docs/resources/invite#invite-object). */
  code: string;
}

/**
 * https://discord.com/developers/docs/topics/gateway#message-create
 */
export type GatewayMessageCreate = DispatchPayload<
  GatewayDispatchEvents.MessageCreate,
  GatewayMessageCreateData
>;

/**
 * https://discord.com/developers/docs/topics/gateway#message-create
 */
export type GatewayMessageCreateData = Message;

/**
 * https://discord.com/developers/docs/topics/gateway#message-update
 */
export type GatewayMessageUpdate = DispatchPayload<
  GatewayDispatchEvents.MessageUpdate,
  GatewayMessageUpdateData
>;

/**
 * https://discord.com/developers/docs/topics/gateway#message-update
 */
export type GatewayMessageUpdateData = PickPartial<Message, "id" | "channelId">;

/**
 * https://discord.com/developers/docs/topics/gateway#message-delete
 */
export type GatewayMessageDelete = DispatchPayload<
  GatewayDispatchEvents.MessageDelete,
  GatewayMessageDeleteData
>;

/**
 * https://discord.com/developers/docs/topics/gateway#message-delete-message-delete-event-fields
 */
export interface GatewayMessageDeleteData {
  /** The id of the message. */
  id: Snowflake;
  /** The id of the channel. */
  channelId: Snowflake;
  /** The id of the guild. */
  guildId?: Snowflake;
}

/**
 * https://discord.com/developers/docs/topics/gateway#message-delete-bulk
 */
export type GatewayMessageDeleteBulk = DispatchPayload<
  GatewayDispatchEvents.MessageDeleteBulk,
  GatewayMessageDeleteBulkData
>;

/**
 * https://discord.com/developers/docs/topics/gateway#message-delete-bulk-message-delete-bulk-event-fields
 */
export interface GatewayMessageDeleteBulkData {
  /** The ids of the messages. */
  ids: Snowflake[];
  /** The id of the channel. */
  channelId: Snowflake;
  /** The id of the guild. */
  guildId?: Snowflake;
}

/**
 * https://discord.com/developers/docs/topics/gateway#message-reaction-add
 */
export type GatewayMessageReactionAdd = DispatchPayload<
  GatewayDispatchEvents.MessageReactionAdd,
  GatewayMessageReactionAddData
>;

/**
 * https://discord.com/developers/docs/topics/gateway#message-reaction-add-message-reaction-add-event-fields
 */
export interface GatewayMessageReactionAddData {
  /** The id of the user. */
  userId: Snowflake;
  /** The id of the channel. */
  channelId: Snowflake;
  /** The id of the message. */
  messageId: Snowflake;
  /** The id of the guild. */
  guildId?: Snowflake;
  /** The member who reacted if this happened in a guild. */
  member?: GuildMemberWithUser;
  /** The emoji used to react - [example](https://discord.com/developers/docs/resources/emoji#emoji-object-gateway-reaction-standard-emoji-example) */
  emoji: Partial<Emoji>;
}

/**
 * https://discord.com/developers/docs/topics/gateway#message-reaction-remove
 */
export type GatewayMessageReactionRemove = DispatchPayload<
  GatewayDispatchEvents.MessageReactionRemove,
  GatewayMessageReactionRemoveData
>;

/**
 * https://discord.com/developers/docs/topics/gateway#message-reaction-remove-message-reaction-remove-event-fields
 */
export interface GatewayMessageReactionRemoveData {
  /** The id of the user. */
  userId: Snowflake;
  /** The id of the channel. */
  channelId: Snowflake;
  /** The id of the message. */
  messageId: Snowflake;
  /** The id of the guild. */
  guildId?: Snowflake;
  /** The emoji used to react - [example](https://discord.com/developers/docs/resources/emoji#emoji-object-gateway-reaction-standard-emoji-example) */
  emoji: Partial<Emoji>;
}

/**
 * https://discord.com/developers/docs/topics/gateway#message-reaction-remove-all
 */
export type GatewayMessageReactionRemoveAll = DispatchPayload<
  GatewayDispatchEvents.MessageReactionRemoveAll,
  GatewayMessageReactionRemoveAllData
>;

/**
 * https://discord.com/developers/docs/topics/gateway#message-reaction-remove-all-message-reaction-remove-all-event-fields
 */
export interface GatewayMessageReactionRemoveAllData {
  /** The id of the channel. */
  channelId: Snowflake;
  /** The id of the message. */
  messageId: Snowflake;
  /** The id of the guild. */
  guildId?: Snowflake;
}

/**
 * https://discord.com/developers/docs/topics/gateway#message-reaction-remove-emoji
 */
export type GatewayMessageReactionRemoveEmoji = DispatchPayload<
  GatewayDispatchEvents.MessageReactionRemoveEmoji,
  GatewayMessageReactionRemoveEmojiData
>;

/**
 * https://discord.com/developers/docs/topics/gateway#message-reaction-remove-emoji-message-reaction-remove-emoji
 */
export interface GatewayMessageReactionRemoveEmojiData {
  /** The id of the channel. */
  channelId: Snowflake;
  /** The id of the guild. */
  guildId?: Snowflake;
  /** The id of the message. */
  messageId: Snowflake;
  /** The emoji that was removed. */
  emoji: Partial<Emoji>;
}

/**
 * https://discord.com/developers/docs/topics/gateway#presence-update
 */
export type GatewayPresenceUpdate = DispatchPayload<
  GatewayDispatchEvents.PresenceUpdate,
  GatewayPresenceUpdateData
>;

// TODO: move these to their own files
export enum StatusTypes {
  Idle = "idle",
  DnD = "dnd",
  Online = "online",
  Offline = "offline",
}

/**
 * https://discord.com/developers/docs/topics/gateway#activity-object
 */
export interface Activity {
  /** The activity's name. */
  name: string;
  /** [Activity Type](https://discord.com/developers/docs/topics/gateway#activity-object-activity-types). */
  type: ActivityTypes;
  /** Stream url, is validated when type is Streaming. */
  url?: string | null;
  /** Unix timestamp (in milliseconds) of when the activity was added to the user's session. */
  createdAt: number;
  /** Unix timestamps for start and/or end of the game. */
  timestamps?: ActivityTimestamps;
  /** Application id for the game. */
  applicationId?: Snowflake;
  /** What the player is currently doing. */
  details?: string | null;
  /** The user's current party status. */
  state?: string | null;
  /** The emoji used for a custom status. */
  emoji?: ActivityEmoji | null;
  /** Information for the current party of the player. */
  party?: ActivityParty;
  /** Images for the presence and their hover texts. */
  assets?: ActivityAssets;
  /** Secrets for Rich Presence joining and spectating. */
  secrets?: ActivitySecrets;
  /** Whether or not the activity is an instanced game session. */
  instance?: boolean;
  /** [Activity flags](https://discord.com/developers/docs/topics/gateway#activity-object-activity-flags) `OR` d together, describes what the payload includes. */
  flags?: ActivityFlags;
  /** The custom buttons shown in the Rich Presence (max 2). */
  buttons?: ActivityButton[];
}

/**
 * https://discord.com/developers/docs/topics/gateway#activity-object-activity-types
 */
export enum ActivityTypes {
  /**
   * Format: Playing {name}
   *  Example: "Playing Rocket League"
   */
  Game,
  /**
   * Format: Streaming {details}
   *  Example: "Streaming Rocket League"
   */
  Streaming,
  /**
   *   Format: Listening to {name}
   *  Example: "Listening to Spotify"
   */
  Listening,
  /**
   * Format:   Watching {name}
   *  Example: "Watching YouTube Together"
   */
  Watching,
  /**
   * Format: {emoji} {name}
   *  Example: ":smiley: I am cool"
   */
  Custom,
  /**
   * Format:   Competing in {name}
   *  Example: "Competing in Arena World Champions"
   */
  Competing,
}

/**
 * https://discord.com/developers/docs/topics/gateway#activity-object-activity-timestamps
 */
export interface ActivityTimestamps {
  /** Unix time (in milliseconds) of when the activity started. */
  start?: number;
  /** Unix time (in milliseconds) of when the activity ends. */
  end?: number;
}

/**
 * https://discord.com/developers/docs/topics/gateway#activity-object-activity-emoji
 */
export interface ActivityEmoji {
  /** The name of the emoji. */
  name: string;
  /** The id of the emoji. */
  id?: Snowflake;
  /** Whether this emoji is animated. */
  animated?: boolean;
}

/**
 * https://discord.com/developers/docs/topics/gateway#presence-update-presence-update-event-fields
 */
export interface GatewayPresenceUpdateData {
  /** The user presence is being update for. */
  user: PickPartial<User, "id">;
  /** Id of the guild. */
  guildId: Snowflake;
  /** Either "idle", "dnd", "online" or "offline" */
  status: StatusTypes;
  /** User's current activities. */
  activities: Activity[];
  /** User's platform-dependent status. */
  clientStatus: ClientStatus;
}

/**
 * https://discord.com/developers/docs/topics/gateway#activity-object-activity-party
 */
export interface ActivityParty {
  /** The id of the party. */
  id: string;
  /** Used to show the pary's current and maximum size. */
  size?: [currentSize: number, maxSize: number];
}

/**
 * https://discord.com/developers/docs/topics/gateway#activity-object-activity-assets
 */
export interface ActivityAssets {
  /** The id for a large asset of the activity, usually a snowflake. */
  largeImage?: Snowflake | string;
  /** Text displayed when hovering over the large image of the activity. */
  largeText?: string;
  /** The id for a small asset of the activity, usually a snowflake. */
  smallImage?: Snowflake | string;
  /** Text displayed when hovering over the small image of the activity. */
  smallText?: string;
}

/**
 * https://discord.com/developers/docs/topics/gateway#activity-object-activity-secrets
 */
export interface ActivitySecrets {
  /** The secret for joining a party. */
  join?: string;
  /** The secret for spectating a game. */
  spectate?: string;
  /** The secret for a specific instanced match. */
  match?: string;
}

/**
 * https://discord.com/developers/docs/topics/gateway#activity-object-activity-flags
 */
export enum ActivityFlags {
  Instance = 1 << 0,
  Join = 1 << 1,
  Spectate = 1 << 2,
  JoinRequest = 1 << 3,
  Sync = 1 << 4,
  Play = 1 << 5,
}

/**
 * https://discord.com/developers/docs/topics/gateway#activity-object-activity-buttons
 */
export interface ActivityButton {
  /** The text shown on the button (1-32 characters). */
  label: string;
  /** The url opened when clicking the button (1-512 characters). */
  url: string;
}

/** https://discord.com/developers/docs/topics/gateway#client-status-object */
interface ClientStatus {
  /** The user's status set for an active desktop (Windows, Linux, Mac) application session. */
  desktop?: StatusTypes;
  /** The user's status set for an active mobile (iOS, Android) application session. */
  mobile?: StatusTypes;
  /** The user's status set for an active web (browser, bot account) application session. */
  web?: StatusTypes;
}

/**
 * https://discord.com/developers/docs/topics/gateway#typing-start
 */
export type GatewayTypingStart = DispatchPayload<
  GatewayDispatchEvents.TypingStart,
  GatewayTypingStartData
>;

/**
 * https://discord.com/developers/docs/topics/gateway#typing-start-typing-start-event-fields
 */
export interface GatewayTypingStartData {
  /** The id of the channel. */
  channelId: Snowflake;
  /** The id of the guild. */
  guildId?: Snowflake;
  /** Id of the user. */
  userId: Snowflake;
  /** Unix time (in seconds) of when the user started typing. */
  timestamp: number;
  /** The member who started typing if this happened in a guild. */
  member?: GuildMemberWithUser;
}

/**
 * https://discord.com/developers/docs/topics/gateway#user-update
 */
export type GatewayUserUpdate = DispatchPayload<
  GatewayDispatchEvents.UserUpdate,
  GatewayUserUpdateData
>;

/**
 * https://discord.com/developers/docs/topics/gateway#user-update
 */
export type GatewayUserUpdateData = User;

/**
 * https://discord.com/developers/docs/topics/gateway#voice-state-update
 */
export type GatewayVoiceStateUpdate = DispatchPayload<
  GatewayDispatchEvents.VoiceStateUpdate,
  GatewayVoiceStateUpdateData
>;

/**
 * https://discord.com/developers/docs/topics/gateway#voice-state-update
 */
export type GatewayVoiceStateUpdateData = VoiceState;

/**
 * https://discord.com/developers/docs/topics/gateway#voice-server-update
 */
export type GatewayVoiceServerUpdate = DispatchPayload<
  GatewayDispatchEvents.VoiceServerUpdate,
  GatewayVoiceServerUpdateData
>;

/**
 * https://discord.com/developers/docs/topics/gateway#voice-server-update-voice-server-update-event-fields
 */
export interface GatewayVoiceServerUpdateData {
  /** Voice connection token. */
  token: string;
  /** The guild this voice server update is for. */
  guildId: Snowflake;
  /** The voice server host. */
  endpoint: string | null;
}

/**
 * https://discord.com/developers/docs/topics/gateway#webhooks-update
 */
export type GatewayWebhooksUpdate = DispatchPayload<
  GatewayDispatchEvents.WebhooksUpdate,
  GatewayWebhooksUpdateData
>;

/**
 * https://discord.com/developers/docs/topics/gateway#webhooks-update-webhook-update-event-fields
 */
export interface GatewayWebhooksUpdateData {
  /** Id of the guild. */
  guildId: Snowflake;
  /** Id of the channel. */
  channelId: Snowflake;
}

/**
 * https://discord.com/developers/docs/topics/gateway#application-command-create
 */
export type GatewayApplicationCommandCreate = DispatchPayload<
  GatewayDispatchEvents.ApplicationCommandCreate,
  GatewayApplicationCommandCreateData
>;

/**
 * https://discord.com/developers/docs/topics/gateway#application-command-create
 */
export interface GatewayApplicationCommandCreateData
  extends ChatInputApplicationCommand {
  /** Id of the guild. */
  guildId?: Snowflake;
}

/**
 * https://discord.com/developers/docs/topics/gateway#application-command-update
 */
export type GatewayApplicationCommandUpdate = DispatchPayload<
  GatewayDispatchEvents.ApplicationCommandUpdate,
  GatewayApplicationCommandUpdateData
>;

/**
 * https://discord.com/developers/docs/topics/gateway#application-command-update
 */
export interface GatewayApplicationCommandUpdateData
  extends ChatInputApplicationCommand {
  /** Id of the guild. */
  guildId?: Snowflake;
}

/**
 * https://discord.com/developers/docs/topics/gateway#application-command-delete
 */
export type GatewayApplicationCommandDelete = DispatchPayload<
  GatewayDispatchEvents.ApplicationCommandDelete,
  GatewayApplicationCommandDeleteData
>;

/**
 * https://discord.com/developers/docs/topics/gateway#application-command-delete
 */
export interface GatewayApplicationCommandDeleteData
  extends ChatInputApplicationCommand {
  /** Id of the guild the command is in. */
  guildId?: Snowflake;
}

/**
 * https://discord.com/developers/docs/topics/gateway#interaction-create
 */
export type GatewayInteractionCreate = DispatchPayload<
  GatewayDispatchEvents.InteractionCreate,
  GatewayInteractionCreateData
>;

/**
 * https://discord.com/developers/docs/topics/gateway#interaction-create
 */
export type GatewayInteractionCreateData = Interaction;

/**
 * https://discord.com/developers/docs/topics/gateway#stage-instance-create
 */
export type GatewayStageInstanceCreate = DispatchPayload<
  GatewayDispatchEvents.StageInstanceCreate,
  GatewayStageInstanceCreateData
>;

/**
 * https://discord.com/developers/docs/topics/gateway#stage-instance-create
 */
export type GatewayStageInstanceCreateData = StageInstance;

/**
 * https://discord.com/developers/docs/topics/gateway#stage-instance-update
 */
export type GatewayStageInstanceUpdate = DispatchPayload<
  GatewayDispatchEvents.StageInstanceUpdate,
  GatewayStageInstanceUpdateData
>;

/**
 * https://discord.com/developers/docs/topics/gateway#stage-instance-update
 */
export type GatewayStageInstanceUpdateData = StageInstance;

/**
 * https://discord.com/developers/docs/topics/gateway#stage-instance-delete
 */
export type GatewayStageInstanceDelete = DispatchPayload<
  GatewayDispatchEvents.StageInstanceDelete,
  GatewayStageInstanceDeleteData
>;

/**
 * https://discord.com/developers/docs/topics/gateway#stage-instance-delete
 */
export type GatewayStageInstanceDeleteData = StageInstance;

/**
 * https://discord.com/developers/docs/topics/gateway#heartbeating
 */
export interface GatewayHeartbeat {
  op: GatewayOpcodes.Heartbeat;
  d: GatewayHeartbeatData;
}

/**
 * https://discord.com/developers/docs/topics/gateway#heartbeating
 */
export type GatewayHeartbeatData = number | null;

/**
 * https://discord.com/developers/docs/topics/gateway#identify
 */
export interface GatewayIdentify {
  op: GatewayOpcodes.Identify;
  d: GatewayIdentifyData;
}

/**
 * https://discord.com/developers/docs/topics/gateway#identify
 */
export interface GatewayIdentifyData {
  /** Authentication token */
  token: string;
  /**  Connection properties */
  properties: GatewayIdentifyProperties;
  /**
   * Whether this connection supports compression of packets
   *
   * @default false
   */
  compress?: boolean;
  /**
   * Value between 50 and 250, total number of members where the gateway will stop sending
   * offline members in the guild member list
   *
   * @default 50
   */
  largeThreshold?: number;
  /** Used for Guild Sharding */
  shard?: [shardId: number, shardCount: number];
  /** Presence structure for initial presence information */
  presence?: GatewayPresenceUpdateData;
  /** The Gateway Intents you wish to receive */
  intents: number;
}

/**
 * https://discord.com/developers/docs/topics/gateway#identify-identify-connection-properties
 */
export interface GatewayIdentifyProperties {
  /** Your operating system */
  $os: string;
  /** Your library name */
  $browser: string;
  /** Your library name */
  $device: string;
}

/**
 * https://discord.com/developers/docs/topics/gateway#resume
 */
export interface GatewayResume {
  op: GatewayOpcodes.Resume;
  d: GatewayResumeData;
}

/**
 * https://discord.com/developers/docs/topics/gateway#resume
 */
export interface GatewayResumeData {
  /** Session token */
  token: string;
  /** Session id */
  sessionId: string;
  /** Last sequence number received */
  seq: number;
}

/**
 * https://discord.com/developers/docs/topics/gateway#request-guild-members
 */
export interface GatewayRequestGuildMembers {
  op: GatewayOpcodes.RequestGuildMembers;
  d: GatewayRequestGuildMembersData;
}

/**
 * https://discord.com/developers/docs/topics/gateway#request-guild-members
 */
export interface GatewayRequestGuildMembersData {
  /** ID of the guild to get members for */
  guildId: Snowflake;
  /** String that username starts with, or an empty string to return all members */
  query?: string;
  /**
   * Maximum number of members to send matching the `query`;
   * a limit of `0` can be used with an empty string `query` to return all members
   */
  limit: number;
  /** Used to specify if we want the presences of the matched members */
  presences?: boolean;
  /** Used to specify which users you wish to fetch */
  userIds?: Snowflake | Snowflake[];
  /**
   * Nonce to identify the Guild Members Chunk response
   *
   * Nonce can only be up to 32 bytes. If you send an invalid nonce it will be ignored and the reply member_chunk(s) will not have a `nonce` set.
   */
  nonce?: string;
}

/**
 * https://discord.com/developers/docs/topics/gateway#update-status
 */
export interface GatewayUpdatePresence {
  op: GatewayOpcodes.PresenceUpdate;
  d: GatewayUpdatePresenceData;
}

/**
 * https://discord.com/developers/docs/topics/gateway#update-presence-gateway-presence-update-structure
 */
export interface GatewayUpdatePresenceData {
  /**
   * Unix time (in milliseconds) of when the client went idle, or `null` if the client is not idle
   */
  since: number | null;
  /**
   * The user's activities
   *
   * See https://discord.com/developers/docs/topics/gateway#activity-object
   */
  activities: GatewayActivityUpdateData[];
  /**
   * The user's new status
   *
   * See https://discord.com/developers/docs/topics/gateway#update-presence-status-types
   */
  status: UpdatePresenceStatus;
  /**
   * Whether or not the client is afk
   */
  afk: boolean;
}

export enum UpdatePresenceStatus {
  Online = "online",
  DoNotDisturb = "dnd",
  Idle = "idle",
  /**
   * Invisible and shown as offline
   */
  Invisible = "invisible",
  Offline = "offline",
}

/**
 * https://discord.com/developers/docs/topics/gateway#activity-object-activity-structure
 */
export type GatewayActivityUpdateData = Pick<Activity, "name" | "type" | "url">;

export type GatewaySendPayload =
  | GatewayHeartbeat
  | GatewayIdentify
  | GatewayUpdatePresence
  | GatewayVoiceStateUpdate
  | GatewayResume
  | GatewayRequestGuildMembers;

export type GatewayReceivePayload =
  | GatewayHello
  | GatewayHeartbeatRequest
  | GatewayHeartbeatAck
  | GatewayInvalidSession
  | GatewayReconnect
  | GatewayDispatchPayload;

export type GatewayDispatchPayload =
  | GatewayChannelCreate
  | GatewayChannelUpdate
  | GatewayChannelDelete
  | GatewayChannelPinsUpdate
  | GatewayGuildBanAdd
  | GatewayGuildCreate
  | GatewayGuildDelete
  | GatewayGuildEmojisUpdate
  | GatewayGuildIntegrationsUpdate
  | GatewayGuildMemberAdd
  | GatewayGuildMemberRemove
  | GatewayGuildMembersChunk
  | GatewayGuildMemberUpdate
  | GatewayGuildUpdate
  | GatewayGuildRoleDelete
  | GatewayGuildRoleUpdate
  | GatewayGuildStickersUpdate
  | GatewayIntegrationCreate
  | GatewayIntegrationDelete
  | GatewayIntegrationUpdate
  | GatewayInteractionCreate
  | GatewayInviteCreate
  | GatewayInviteDelete
  | GatewayMessageCreate
  | GatewayMessageDeleteBulk
  | GatewayMessageDelete
  | GatewayMessageReactionAdd
  | GatewayMessageReactionRemoveAll
  | GatewayMessageReactionRemove
  | GatewayMessageReactionRemoveEmoji
  | GatewayMessageUpdate
  | GatewayPresenceUpdate
  | GatewayReady
  | GatewayResumed
  | GatewayThreadListSync
  | GatewayThreadMembersUpdate
  | GatewayThreadMemberUpdate
  | GatewayThreadUpdate
  | GatewayTypingStart
  | GatewayUserUpdate
  | GatewayVoiceServerUpdate
  | GatewayVoiceStateUpdate
  | GatewayWebhooksUpdate;
