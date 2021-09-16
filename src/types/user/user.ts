import { Collection } from "../../utils/collection.ts";
import { Snowflake } from "../base.ts";
import { GuildMember } from "../guild/guild_member.ts";
import { PremiumTypes } from "./premium_types.ts";
import { UserFlags } from "./user_flags.ts";

/** https://discord.com/developers/docs/resources/user#user-object-user-structure */
export interface User {
  /** The user's id. */
  id: Snowflake;
  /** The user's username, not unique across the platform. */
  username: string;
  /** The user's 4-digit discord-tag */
  discriminator: string;
  /** The user's [avatar hash](https://discord.com/developers/docs/reference#image-formatting). */
  avatar: bigint | null;
  /** Whether the user belongs to an OAuth2 application. */
  bot?: boolean;
  /** Whether the user is an Official Discord System user (part of the urgent message system). */
  system?: boolean;
  /** Whether the user has two factor enabled on their account. */
  mfaEnabled?: boolean;
  /** The user's chosen language option. */
  locale?: string;
  /** Whether the email on this account has been verified. */
  verified?: boolean;
  /** The user's email. */
  email?: string | null;
  /** The [flags](https://discord.com/developers/docs/resources/user#user-object-user-flags) on a user's account. */
  flags?: UserFlags;
  /** The [type of Nitro subscription](https://discord.com/developers/docs/resources/user#user-object-premium-types) on a user's account. */
  premiumType?: PremiumTypes;
  /** The public [flags](https://discord.com/developers/docs/resources/user#user-object-user-flags) on a user's account. */
  publicFlags?: UserFlags;
}

export type TebamiUser = User & { guilds: Collection<bigint, GuildMember> };
