import { Guild, TebamiGuild } from "../../types/guild/guild.ts";
import { ToDiscordType } from "../../types/utils.ts";
import { Collection } from "../../utils/collection.ts";
import { iconHashToBigInt } from "../../utils/hash.ts";
import { transformRole } from "../permissions/role.transformer.ts";
import { transformEmoji } from "../emoji/emoji.transformer.ts";
import { transformSticker } from "../sticker/sticker.transformer.ts";

export function transformGuild(data: ToDiscordType<Guild>): TebamiGuild {
  return {
    id: BigInt(data.id),
    name: data.name,
    icon: data.icon ? iconHashToBigInt(data.icon) : null,
    iconHash: data.icon_hash ? iconHashToBigInt(data.icon_hash) : undefined,
    splash: data.splash ? iconHashToBigInt(data.splash) : null,
    discoverySlash: data.discovery_slash
      ? iconHashToBigInt(data.discovery_slash)
      : null,
    owner: data.owner,
    ownerId: BigInt(data.owner_id),
    permissions: data.permissions ? BigInt(data.permissions) : undefined,
    afkChannelId: data.afk_channel_id ? BigInt(data.afk_channel_id) : null,
    afkTimeout: data.afk_timeout,
    widgetEnabled: data.widget_enabled,
    widgetChannelId: data.widget_channel_id
      ? BigInt(data.widget_channel_id)
      : undefined,
    verificationLevel: data.verification_level,
    defaultMessageNotifications: data.default_message_notifications,
    explicitContentFilter: data.explicit_content_filter,
    roles: new Collection(
      data.roles.map((role) => [BigInt(role.id), transformRole(role)] as const),
    ),
    emojis: new Collection(
      data.emojis.map(
        (emoji) => [BigInt(emoji.id!), transformEmoji(emoji)] as const,
      ),
    ),
    features: data.features,
    mfaLevel: data.mfa_level,
    applicationId: data.application_id ? BigInt(data.application_id) : null,
    systemChannelId: data.system_channel_id ? BigInt(data.system_channel_id)
    : null,
    systemChannelFlags: data.system_channel_flags,
    rulesChannelId: data.rules_channel_id ? BigInt(data.rules_channel_id)
    : null,
    // TODO: wrong type
    joinedAt: data.joined_at
      ? Date.parse((data.joined_at as unknown) as string)
      : undefined,
    large: data.large,
    unavailable: data.unavailable,
    memberCount: data.member_count,
    // TODO: convert voicestates
    voiceStates: new Collection(),
    // members: GuildMemberWithUser[],
    // channels: Channel[],
    // threads: Channel[],
    // presences: Partial<GatewayPresenceUpdateData>[],
    maxPresences: data.max_presences,
    maxMembers: data.max_members,
    vanityUrlCode: data.vanity_url_code,
    description: data.description,
    banner: data.banner,
    premiumTier: data.premium_tier,
    premiumSubscriptionCount: data.premium_subscription_count,
    preferredLocale: data.preferred_locale,
    publicUpdatesChannelId: data.public_updates_channel_id
      ? BigInt(data.public_updates_channel_id)
      : null,
    maxVideoChannelUsers: data.max_video_channel_users,
    approximateMemberCount: data.approximate_member_count,
    approximatePresenceCount: data.approximate_presence_count,
    // stageInstances: StageInstance[],
    stickers: data.stickers
      ? new Collection(
        data.stickers.map(
          (sticker) => [BigInt(sticker.id), transformSticker(sticker)] as const,
        ),
      )
      : new Collection(),
  };
}

export default transformGuild;
