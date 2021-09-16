import { MessageActivityTypes } from "./message_activity_types.ts";

/**
 * https://discord.com/developers/docs/resources/channel#message-object-message-activity-structure
 */
export interface MessageActivity {
  /** [Type of Message Activity](https://discord.com/developers/docs/resources/channel#message-object-message-activity-types). */
  type: MessageActivityTypes;
  /** PartyId from a [Rich Presence Event](https://discord.com/developers/docs/rich-presence/how-to#updating-presence-update-presence-payload-fields). */
  partyId?: string;
}
