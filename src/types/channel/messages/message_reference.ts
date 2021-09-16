import { Snowflake } from "../../base.ts";

/**
 * https://discord.com/developers/docs/resources/channel#message-reference-object-message-reference-structure
 */
export interface MessageReference {
  /** Id of the originating message. */
  Id: Snowflake;
  /** Id of the originating message's channel. */
  channelId?: Snowflake;
  /** Id of the originating message's guild. */
  guildId?: Snowflake;
  /** When sending, whether to error if the referenced message doesn't exist instead of sending as a normal (non-reply) message, default true */
  failIfNotExists?: boolean;
}
