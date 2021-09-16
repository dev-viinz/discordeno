/**
 * https://discord.com/developers/docs/interactions/receiving-and-responding#interaction-response-object-interaction-callback-data-flags
 */
export enum InteractionCallbackDataFlags {
  /** Only the user receiving the message can see it. */
  Ephemeral = 1 << 6,
}
