import { Collection } from "../../utils/collection.ts";
import { Snowflake } from "../base.ts";
import { Channel } from "../channel/channel.ts";
import { Emoji } from "../emoji/emoji.ts";
import { GatewayPresenceUpdateData } from "../gateway/gateway_payload.ts";
import { Role } from "../permissions/role.ts";
import { StageInstance } from "../stage_instance/stage_instance.ts";
import { Sticker } from "../sticker/sticker.ts";
import { VoiceState } from "../voice/voice_state.ts";
import { DefaultMessageNotificationsLevels } from "./default_message_notifications_levels.ts";
import { ExplicitContentFilterLevels } from "./explicit_content_filter_levels.ts";
import { GuildFeatures } from "./guild_features.ts";
import { GuildMemberWithUser } from "./guild_member.ts";
import { MfaLevels } from "./mfa_levels.ts";
import { PremiumTiers } from "./premium_tiers.ts";
import { SystemChannelFlags } from "./system_channel_flags.ts";

/**
 * https://discord.com/developers/docs/resources/guild#guild-object-guild-structure
 */
export interface Guild {
  /** Guild id. */
  id: Snowflake;
  /** Guild name (2-100 characters, excluding trailing and leading whitespace). */
  name: string;
  /** [Icon Hash](https://discord.com/developers/docs/reference#image-formatting). */
  icon: bigint | null;
  /** [Icon Hash](https://discord.com/developers/docs/reference#image-formatting), returned when in the template object. */
  iconHash?: bigint | null;
  /** [Splash Hash](https://discord.com/developers/docs/reference#image-formatting). */
  splash: bigint | null;
  /** [Discovery Splash Hash](https://discord.com/developers/docs/reference#image-formatting); only present for guilds with the `DISCOVERABLE` feature. */
  discoverySlash: bigint | null;
  /** True if [the user](https://discord.com/developers/docs/resources/user#get-current-user-guilds) is the owner of the guild. */
  owner?: boolean;
  /** Id of the owner. */
  ownerId: Snowflake;
  // TODO: should we do this a bigint and update it every time a relevant perm has been changed?
  /** Total permissions for [the user](https://discord.com/developers/docs/resources/user#get-current-user-guilds) in the guild (excludes overwrites). */
  permissions?: bigint | null;
  /** Id of afk channel. */
  afkChannelId: Snowflake | null;
  /** Afk timeout in seconds. */
  afkTimeout: number;
  /** True if the server widget is enabled. */
  widgetEnabled?: boolean;
  /** The cahnnel id of the widget will generate an invite to, or `null` if set to no invite. */
  widgetChannelId?: Snowflake | null;
  /** [VerificationLevel](https://discord.com/developers/docs/resources/guild#guild-object-verification-level) required for the guild. */
  verificationLevel: number;
  /** Default [message notifications level](https://discord.com/developers/docs/resources/guild#guild-object-default-message-notification-level) */
  defaultMessageNotifications: DefaultMessageNotificationsLevels;
  /** [Explicit content filter level](https://discord.com/developers/docs/resources/guild#guild-object-explicit-content-filter-level). */
  explicitContentFilter: ExplicitContentFilterLevels;
  /** Roles in the guild. */
  roles: Role[];
  /** Custom guild emojis. */
  emojis: Emoji[];
  /** Enabled guild features. */
  features: GuildFeatures[];
  /** Required [MFA Level](https://discord.com/developers/docs/resources/guild#guild-object-mfa-level) for the guild. */
  mfaLevel: MfaLevels;
  /** Application id of the guild creator if it is bot-created. */
  applicationId: Snowflake | null;
  /** The id of the channel where guild notices such as welcome messages and boost events are posted. */
  systemChannelId: Snowflake | null;
  /** [System channel flags](https://discord.com/developers/docs/resources/guild#guild-object-system-channel-flags). */
  systemChannelFlags: SystemChannelFlags;
  /** The id of the channel where Community guilds can display rules and/or guidelines. */
  rulesChannelId: Snowflake | null;
  /** When this guild was joined at. */
  joinedAt?: number;
  /** True if this is coinsidered a large guild. */
  large?: boolean;
  /** True if this guild is unavailable due to an outage. */
  unavailable?: boolean;
  /** Total number of members in this guild. */
  memberCount?: number;
  /** States of members currently in vooice channels; lacks the `guildId` key */
  voiceStates: Collection<Snowflake, Omit<VoiceState, "guildId" | "member">>;
  /** users in the guild. */
  members?: GuildMemberWithUser[];
  /** Channels in the guild. */
  channels?: Channel[];
  /** All active threads in the guild thaat the current user has permission to view. */
  threads?: Channel[];
  /** Presences of the members in the guild, will only include non-offline members if the size is greater than `large threshold` */
  presences?: Partial<GatewayPresenceUpdateData>[];
  /** The maximum number of presences for the guild (`null` is always returned, apart from the largest of guilds). */
  maxPresences?: number | null;
  /** The maximum number of members for the guild. */
  maxMembers?: number;
  /** The vanity url code for the guild. */
  vanityUrlCode: string | null;
  /** The description of a Community guild. */
  description: string | null;
  /** [Banner Hash](https://discord.com/developers/docs/reference#image-formatting). */
  banner: string | null;
  /** [Premium Tier](https://discord.com/developers/docs/resources/guild#guild-object-premium-tier) (Server Boost Level). */
  premiumTier: PremiumTiers;
  /** The number of boosts this guild currenntly has. */
  premiumSubscriptionCount?: number;
  /** The preferred locale of a Community guild; used in server discovery and notices from Discord; defaults to "en-US". */
  preferredLocale: string;
  /** The id of the channel where admins and moderators of Community guilds receive notices from Discord. */
  publicUpdatesChannelId: Snowflake | null;
  /** The maximum amount of users in a video channel. */
  maxVideoChannelUsers?: number;
  /** Approximate number of members in this guild, returned from `GET /guilds/<id>` endpoint when `with_counts` is `true`. */
  approximateMemberCount?: number;
  /** Approximate number of non-offline members in this guild, returned from the `GET /guilds/<id>` endpoint when `with_counts` is `true`. */
  approximatePresenceCount?: number;
  /** The welcome screen of a Community guild, shown to new members, returned in an [Invite](https://discord.com/developers/docs/resources/invite#invite-object)'s guild object. */
  stageInstances?: StageInstance[];
  /** Custom guild stickers. */
  stickers?: Sticker[];
}

export interface TebamiGuild extends
  Omit<
    Guild,
    | "channels"
    | "threads"
    | "members"
    | "roles"
    | "emojis"
    | "presences"
    | "stickers"
  > {
  roles: Collection<Snowflake, Role>;
  emojis: Collection<Snowflake, Emoji>;
  stickers: Collection<Snowflake, Sticker>;
}
