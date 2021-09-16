import { Snowflake } from "../../base.ts";
import { ChannelTypes } from "./../channel_types.ts";

/**
 * https://discord.com/developers/docs/resources/channel#channel-mention-object-channel-mention-structure
 */
export interface ChannelMention {
  /** Id of the channel. */
  id: Snowflake;
  /** Id of the guild containing the channel. */
  guildId: Snowflake;
  /** The [type of channel](https://discord.com/developers/docs/resources/channel#channel-object-channel-types). */
  type: ChannelTypes;
  /** The name of the channel. */
  name: string;
}
