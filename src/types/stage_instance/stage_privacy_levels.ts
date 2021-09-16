/**
 * https://discord.com/developers/docs/resources/stage-instance#stage-instance-object-privacy-level
 */
export enum StagePrivacyLevels {
  /** The Stage instance is visible publicly, such as on Stage discovery. */
  Public = 1,
  /** The Stage instance is visible to only guild members. */
  GuildOnly,
}
