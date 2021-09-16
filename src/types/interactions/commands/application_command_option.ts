import { ApplicationCommandOptionChoice } from "./application_command_option_choice.ts";
import { ApplicationCommandOptionTypes } from "./application_command_option_types.ts";

export type ApplicationCommandOption =
  | ApplicationCommandOptionBase<ApplicationCommandOptionTypes>
  | ApplicationCommandOptionString
  | ApplicationCommandOptionNumber
  | ApplicationCommandOptionInteger
  | ApplicationCommandOptionSubcommand
  | ApplicationCommandOptionSubCommandGroup;

/**
 * https://discord.com/developers/docs/interactions/application-commands#application-command-object-application-command-option-structure
 */
export interface ApplicationCommandOptionBase<
  T extends ApplicationCommandOptionTypes
> {
  /** The type of option. */
  type: T;
  /** 1-32 lowercase character name mathing `^[\w-]{1,32}$`. */
  name: string;
  /** 1-100 character description. */
  description: string;
  /** The parameter is required or optional. Defaults to `false`. */
  required?: boolean;
}

export interface ApplicationCommandOptionString
  extends ApplicationCommandOptionBase<ApplicationCommandOptionTypes.String> {
  choices?: ApplicationCommandOptionChoice<string>[];
}

export interface ApplicationCommandOptionNumber
  extends ApplicationCommandOptionBase<ApplicationCommandOptionTypes.Number> {
  choices?: ApplicationCommandOptionChoice<number>[];
}

export interface ApplicationCommandOptionInteger
  extends ApplicationCommandOptionBase<ApplicationCommandOptionTypes.Integer> {
  choices?: ApplicationCommandOptionChoice<number>[];
}

export interface ApplicationCommandOptionSubcommand
  extends ApplicationCommandOptionBase<ApplicationCommandOptionTypes.SubCommand> {
  options?: Omit<
    ApplicationCommandOption,
    | "ApplicationCommandOptionSubcommand"
    | "ApplicationCommandOptionSubCommandGroup"
  >;
}

export interface ApplicationCommandOptionSubCommandGroup
  extends ApplicationCommandOptionBase<ApplicationCommandOptionTypes.SubCommandGroup> {
  options?: Omit<
    ApplicationCommandOption,
    | "ApplicationCommandOptionSubcommand"
    | "ApplicationCommandOptionSubCommandGroup"
  >;
}
