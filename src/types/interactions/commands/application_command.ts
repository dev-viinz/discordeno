import { Snowflake } from "../../base.ts";
import { ApplicationCommandOption } from "./application_command_option.ts";
import { ApplicationCommandTypes } from "./application_command_types.ts";

/**
 * https://discord.com/developers/docs/interactions/application-commands#application-command-object-application-command-structure
 */
export type ApplicationCommand =
  | ChatInputApplicationCommand
  | UserApplicationCommand
  | MessageApplicationCommand;

/**
 * https://discord.com/developers/docs/interactions/application-commands#application-command-object-application-command-structure
 */
export interface BaseApplicationCommand {
  /** Unique id of the command. */
  id: Snowflake;
  /** The type of command, defaults to `1` if not set. */
  type: ApplicationCommandTypes;
  /** Unique idd of the parent application. */
  applicationId: Snowflake;
  /** Guild id of the command, if not global. */
  guildId?: Snowflake;
  /** 1-32 character name. */
  name: string;
  /** 1-100 character description for `CHAT_INPUT` commands, empty string for `USER` and `MESSAGE` commands. */
  description: string;
  /** Whether the command is enbaled by default when the app is added to a guild. Defaults to `true`. */
  defaultPermission?: boolean;
}

/**
 * https://discord.com/developers/docs/interactions/application-commands#application-command-object-application-command-structure
 */
export interface ChatInputApplicationCommand extends BaseApplicationCommand {
  type: ApplicationCommandTypes.ChatInput;
  /** The parameters for the command, max 25. */
  options?: ApplicationCommandOption[];
}

/**
 * https://discord.com/developers/docs/interactions/application-commands#application-command-object-application-command-structure
 */
export type UserApplicationCommand = BaseApplicationCommand;

/**
 * https://discord.com/developers/docs/interactions/application-commands#application-command-object-application-command-structure
 */
export type MessageApplicationCommand = BaseApplicationCommand;
