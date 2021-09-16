import { Snowflake } from "../../base.ts";

/**
 * https://discord.com/developers/docs/interactions/application-commands#application-command-permissions-object-guild-application-command-permissions-structure
 */
export interface GuildApplicationCommandPermissions {
  /** The id of the command. */
  id: Snowflake;
  /** The id of the application the command belongs to. */
  applicationId: Snowflake;
  /** The id of the guild. */
  guildId: Snowflake;
  /** The permissions for the command in the guild. */
  permissions: ApplicationCommandPermissions[];
}
