/**
 * https://discord.com/developers/docs/interactions/application-commands#application-command-object-application-command-option-type
 */
export enum ApplicationCommandOptionTypes {
  SubCommand = 1,
  SubCommandGroup,
  String,
  /** Any integer between `-2^53` and `2^53` */
  Integer,
  Boolean,
  User,
  /** Includes all channel types + categories */
  Channel,
  Role,
  /** Includes users and roles */
  Mentionable,
  /** Any double between `-2^53` and `2^53` */
  Number,
}
