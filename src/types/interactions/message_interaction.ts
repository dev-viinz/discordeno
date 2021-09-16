import { Snowflake } from "../base.ts";
import { User } from "../user/user.ts";
import { InteractionTypes } from "./interaction_types.ts";

/**
 * https://discord.com/developers/docs/interactions/slash-commands#message-interaction-object-message-interaction-structure
 */
export interface MessageInteraction {
  /** Id of the interaction. */
  id: Snowflake;
  /** The type of interaction. */
  type: InteractionTypes;
  /** The name of the [application command](https://discord.com/developers/docs/interactions/slash-commands#application-command-object-application-command-structure). */
  name: string;
  /** The user who invoked the interaction. */
  user: User;
}
