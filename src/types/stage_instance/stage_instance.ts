import { Snowflake } from "../base.ts";
import { StagePrivacyLevels } from "./stage_privacy_levels.ts";

/**
 * https://discord.com/developers/docs/resources/stage-instance#stage-instance-object-stage-instance-structure
 */
export interface StageInstance {
  /** The Id of the Stage instance. */
  id: Snowflake;
  /** The guild Id of the associated Stage channel. */
  guildId: Snowflake;
  /** The id of the associated Stage channel. */
  channelId: Snowflake;
  /** The topic of the Stage instance (1-120 characters). */
  topic: string;
  /** The [privacy level](https://discord.com/developers/docs/resources/stage-instance#stage-instance-object-privacy-level) of the Stage instance. */
  privacyLevel: StagePrivacyLevels;
  /** Whether or not Stage discovery is disabled. */
  discoveryDisabled: boolean;
}
