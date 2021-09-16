/**
 * https://discord.com/developers/docs/interactions/receiving-and-responding#interaction-response-object-interaction-callback-type
 */
export enum InteractionCallbackTypes {
  /** ACK a `Ping`. */
  Pong = 1,
  /** Respond to an interaction with a message. */
  ChannelMessageWithSource = 4,
  /** ACK an interaction and edit a response later, the user sees a loading state. */
  DeferredChannelMessageWithSource = 5,
  /** For components, ACK an interaction and edit the original message later, the user does not see a loading state. */
  DeferredUpdateMessage = 6,
  /** For components, edit the message the component was attached to. */
  UpdateMessage = 7,
}
