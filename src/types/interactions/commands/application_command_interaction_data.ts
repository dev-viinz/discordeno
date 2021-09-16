import { Snowflake } from "../../base.ts";
import { ApplicationCommandInteractionDataOption } from "./application_command_interaction_data_option.ts";
import { ApplicationCommandResolvedData } from "./application_command_resolved_data.ts";
import { ApplicationCommandTypes } from "./application_command_types.ts";

/**
 * https://discord.com/developers/docs/interactions/receiving-and-responding#interaction-object-interaction-data-structure
 */
export type ApplicationCommandInteractionData =
  | ApplicationCommandInteractionDataBase<ApplicationCommandTypes>
  | ApplicationCommandInteractionDataUserCommand
  | ApplicationCommandInteractionDataMessageCommand;

/**
 * https://discord.com/developers/docs/interactions/receiving-and-responding#interaction-object-interaction-data-structure
 */
export interface ApplicationCommandInteractionDataBase<
  T extends ApplicationCommandTypes,
> {
  /** The [Id](https://discord.com/developers/docs/interactions/application-commands#application-command-object-application-command-structure) of the invoked command. */
  id: Snowflake;
  /** The [name](https://discord.com/developers/docs/interactions/application-commands#application-command-object-application-command-structure) of the invoked command. */
  name: string;
  /** The [type] of the invoked command. */
  type: T;
  /** Converted users + roles + channels. */
  resolved?: ApplicationCommandResolvedData;
  /** The params + values from the user. */
  options?: ApplicationCommandInteractionDataOption;
}

export interface ApplicationCommandInteractionDataUserCommand
  extends ApplicationCommandInteractionDataBase<ApplicationCommandTypes.User> {
  /** Id the of user message targetted by a [user](https://discord.com/developers/docs/interactions/application-commands#user-commands) command */
  targetId: Snowflake;
}

export interface ApplicationCommandInteractionDataMessageCommand
  extends ApplicationCommandInteractionDataBase<ApplicationCommandTypes.User> {
  /** Id the of user message targetted by a [user](https://discord.com/developers/docs/interactions/application-commands#user-commands) command */
  targetId: Snowflake;
}
