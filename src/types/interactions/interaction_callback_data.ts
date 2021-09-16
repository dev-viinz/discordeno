import { AllowedMentions } from "../channel/allowed_mentions.ts";
import { Embed } from "../channel/messages/embeds/embed.ts";
import { InteractionCallbackDataFlags } from "./interaction_callback_data_flags.ts";
import { Component } from "./message_components/component.ts";

/**
 * https://discord.com/developers/docs/interactions/receiving-and-responding#interaction-response-object-interaction-callback-data-structure
 */
export interface InteractionCallbackData {
  /** Is the response TTS. */
  tts?: boolean;
  /** Message content. */
  content?: string;
  /** Supports up to 10 embeds. */
  embeds?: Embed[];
  /** [Allowed mentions](https://discord.com/developers/docs/resources/channel#allowed-mentions-object) object. */
  allowedMentions?: AllowedMentions;
  /** [Interaction Callback Data Flags](https://discord.com/developers/docs/interactions/receiving-and-responding#interaction-response-object-interaction-callback-data-flags). */
  flags?: InteractionCallbackDataFlags;
  /** Message components. */
  components?: Component[];
}
