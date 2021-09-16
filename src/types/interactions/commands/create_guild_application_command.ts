import { ApplicationCommandOption } from "./application_command_option.ts";
import { ApplicationCommandTypes } from "./application_command_types.ts";

/**
 * https://discord.com/developers/docs/interactions/application-commands#create-guild-application-command
 */
export interface CreateGlobalApplicationCommand {
  /** 1-32 lowercase character name mathing `^[\w-]{1,32}$`. */
  name: string;
  /** 1-100 character description. */
  description: string;
  /** The parameters for the command. */
  options?: ApplicationCommandOption;
  /** Whether the command is enabld by default when the app is added to a guild. Defaults to `true` */
  defaultPermission?: boolean;
  /** The type of command, defaults to `1` if not set. */
  type?: ApplicationCommandTypes;
}
