import { Snowflake } from "../base.ts";
import { User } from "../user/user.ts";
import { MakeUnoptional } from "../utils.ts";

/**
 * https://discord.com/developers/docs/resources/guild#guild-member-object-guild-member-structure
 */
export interface GuildMember {
  /** The user this guild member represents. */
  user?: User;
  /** This users guild nickname. */
  nick?: string | null;
  /** Array of [role](https://discord.com/developers/docs/topics/permissions#role-object) object ids. */
  roles: Snowflake[];
  /** When the user joined the guild. */
  joinedAt: number;
  /** When the user started [boosing](https://support.discord.com/hc/en-us/articles/360028038352-Server-Boosting-) the guild. */
  premiumSince?: number | null;
  /** Whether the user is deafened in voice channels. */
  deaf: boolean;
  /** Whether the user is muted in voice channels. */
  mute: boolean;
  /** Whether the user has not yet passed the guild's [Membership Screening](https://discord.com/developers/docs/resources/guild#membership-screening-object) requirements. */
  pending?: boolean;
}

/**
 * https://discord.com/developers/docs/resources/guild#guild-member-object-guild-member-structure
 */
export type GuildMemberWithUser = MakeUnoptional<GuildMember, "user">;

/**
 * https://discord.com/developers/docs/resources/guild#guild-member-object-guild-member-structure
 */
export interface InteractionGuildMember extends GuildMember {
  /** Total permissions of the member in the channel, including overwrites, returneed when in the interaction object. */
  permissions?: bigint;
}
