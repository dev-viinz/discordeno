import { ApplicationCommandOptionTypes } from "./application_command_option_types.ts";

/**
 * https://discord.com/developers/docs/interactions/slash-commands#interaction-applicationcommandinteractiondataoption
 */
export type ApplicationCommandInteractionDataOption =
  | ApplicationCommandInteractionDataOptionSubCommand
  | ApplicationCommandInteractionDataOptionSubCommandGroup
  | ApplicationCommandInteractionDataOptionWithValue;

/**
 * https://discord.com/developers/docs/interactions/slash-commands#interaction-applicationcommandinteractiondataoption
 */
export type ApplicationCommandInteractionDataOptionWithValue =
  | ApplicationCommandInteractionDataOptionString
  | ApplicationCommandInteractionDataOptionInteger
  | ApplicationCommandInteractionDataOptionNumber
  | ApplicationCommandInteractionDataOptionBoolean
  | ApplicationCommandInteractionDataOptionUser
  | ApplicationCommandInteractionDataOptionChannel
  | ApplicationCommandInteractionDataOptionRole
  | ApplicationCommandInteractionDataOptionMentionable;

/**
 * https://discord.com/developers/docs/interactions/slash-commands#interaction-applicationcommandinteractiondataoption
 */
interface ApplicationCommandInteractionDataOptionBase<
  T extends ApplicationCommandOptionTypes,
  V = unknown,
> {
  /** The name of the parameter */
  name: string;
  /** Type of the option */
  type: T;
  /** The value of the pair */
  value: V;
}

/**
 * https://discord.com/developers/docs/interactions/slash-commands#interaction-applicationcommandinteractiondataoption
 */
export interface ApplicationCommandInteractionDataOptionSubCommand extends
  Omit<
    ApplicationCommandInteractionDataOptionBase<
      ApplicationCommandOptionTypes.SubCommand
    >,
    "value"
  > {
  /** Present if this option is a group or subcommand */
  options?: ApplicationCommandInteractionDataOptionWithValue[];
}

/**
 * https://discord.com/developers/docs/interactions/slash-commands#interaction-applicationcommandinteractiondataoption
 */
export interface ApplicationCommandInteractionDataOptionSubCommandGroup
  extends
    Omit<
      ApplicationCommandInteractionDataOptionBase<
        ApplicationCommandOptionTypes.SubCommandGroup
      >,
      "value"
    > {
  /** Present if this option is a group or subcommand */
  options?: ApplicationCommandInteractionDataOptionSubCommand[];
}

/**
 * https://discord.com/developers/docs/interactions/slash-commands#interaction-applicationcommandinteractiondataoption
 */
export type ApplicationCommandInteractionDataOptionString =
  ApplicationCommandInteractionDataOptionBase<
    ApplicationCommandOptionTypes.String,
    string
  >;

/**
 * https://discord.com/developers/docs/interactions/slash-commands#interaction-applicationcommandinteractiondataoption
 */
export type ApplicationCommandInteractionDataOptionInteger =
  ApplicationCommandInteractionDataOptionBase<
    ApplicationCommandOptionTypes.Integer,
    number
  >;

/**
 * https://discord.com/developers/docs/interactions/slash-commands#interaction-applicationcommandinteractiondataoption
 */
export type ApplicationCommandInteractionDataOptionNumber =
  ApplicationCommandInteractionDataOptionBase<
    ApplicationCommandOptionTypes.Number,
    number
  >;

/**
 * https://discord.com/developers/docs/interactions/slash-commands#interaction-applicationcommandinteractiondataoption
 */
export type ApplicationCommandInteractionDataOptionBoolean =
  ApplicationCommandInteractionDataOptionBase<
    ApplicationCommandOptionTypes.Boolean,
    boolean
  >;

/**
 * https://discord.com/developers/docs/interactions/slash-commands#interaction-applicationcommandinteractiondataoption
 */
export type ApplicationCommandInteractionDataOptionUser =
  ApplicationCommandInteractionDataOptionBase<
    ApplicationCommandOptionTypes.User,
    string
  >;

/**
 * https://discord.com/developers/docs/interactions/slash-commands#interaction-applicationcommandinteractiondataoption
 */
export type ApplicationCommandInteractionDataOptionChannel =
  ApplicationCommandInteractionDataOptionBase<
    ApplicationCommandOptionTypes.Channel,
    string
  >;

/**
 * https://discord.com/developers/docs/interactions/slash-commands#interaction-applicationcommandinteractiondataoption
 */
export type ApplicationCommandInteractionDataOptionRole =
  ApplicationCommandInteractionDataOptionBase<
    ApplicationCommandOptionTypes.Role,
    string
  >;

/**
 * https://discord.com/developers/docs/interactions/slash-commands#interaction-applicationcommandinteractiondataoption
 */
export type ApplicationCommandInteractionDataOptionMentionable =
  ApplicationCommandInteractionDataOptionBase<
    ApplicationCommandOptionTypes.Mentionable,
    string
  >;
