import { InteractionCallbackData } from "./interaction_callback_data.ts";
import { InteractionCallbackTypes } from "./interaction_callback_types.ts";

/**
 * https://discord.com/developers/docs/interactions/receiving-and-responding#interaction-response-object-interaction-response-structure
 */
export interface InteractionResponse {
  /** The type of response. */
  type: InteractionCallbackTypes;
  /** An optional response message. */
  data?: InteractionCallbackData;
}
