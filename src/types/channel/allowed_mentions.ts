import { Snowflake } from "../base.ts";
import { AllowedMentionTypes } from "./allowed_mention_types.ts";

/**
 * https://discord.com/developers/docs/resources/channel#allowed-mentions-object-allowed-mentions-structure
 */
export interface AllowedMentions {
  /** An array of [allowed mention types](https://discord.com/developers/docs/resources/channel#allowed-mentions-object-allowed-mention-types) to pars from the content. */
  parse?: AllowedMentionTypes[];
  /** Array of roleIds to mention (Max size of 100). */
  roles?: Snowflake[];
  /** Array of userIds to mention (Max size of 100). */
  users?: Snowflake[];
  /** For replies, whether to mention the author of the message being replied to. Defaults to false. */
  repliedUser?: boolean;
}
