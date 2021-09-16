import { ApplicationCommandOption } from "./application_command_option.ts";

/**
 * https://discord.com/developers/docs/interactions/application-commands#edit-guild-application-command
 */
export interface EditGlobalApplicationCommand {
  /** 1-32 lowercase character name mathing `^[\w-]{1,32}$`. */
  name?: string;
  /** 1-100 character description. */
  description?: string;
  /** The parameters for the command. */
  options?: ApplicationCommandOption;
  /** Whether the command is enabld by default when the app is added to a guild. Defaults to `true` */
  defaultPermission?: boolean;
}
