/**
 * https://discord.com/developers/docs/interactions/application-commands#application-command-object-application-command-option-choice-structure
 */
export interface ApplicationCommandOptionChoice<T extends string | number> {
  /** 1-100 characrer choice name. */
  name: string;
  /** Value of the choice, up to 100 characters if string. */
  value: T;
}
