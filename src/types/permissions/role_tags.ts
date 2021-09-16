import { Snowflake } from "../base.ts";

/**
 * https://discord.com/developers/docs/topics/permissions#role-object-role-tags-structure
 */
export interface RoleTags {
  /** The id of the bot this role belongs to. */
  botId?: Snowflake;
  /** The id of the integration this role belongs to. */
  integrationId?: Snowflake;
  /** Whether this is the guild's premium subsciber role. */
  premiumSubscriber?: boolean;
}
