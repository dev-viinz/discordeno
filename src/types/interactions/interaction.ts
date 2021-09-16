import { Snowflake } from "../base.ts";
import { Message } from "../channel/messages/message.ts";
import { InteractionGuildMember } from "../guild/guild_member.ts";
import { User } from "../user/user.ts";
import { ApplicationCommandInteractionData } from "./commands/application_command_interaction_data.ts";
import { InteractionTypes } from "./interaction_types.ts";
import { ButtonData } from "./message_components/button_data.ts";
import { SelectMenuData } from "./message_components/select_menu_data.ts";

/** https://discord.com/developers/docs/interactions/slash-commands#interaction */
export type Interaction =
  | PingInteraction
  | ApplicationCommandInteraction
  | ComponentInteraction;

export type PingInteraction = BaseInteraction<InteractionTypes.Ping, undefined>;

export type ApplicationCommandInteraction = BaseInteraction<
  InteractionTypes.ApplicationCommand,
  ApplicationCommandInteractionData
>;

export interface BaseInteraction<
  T extends InteractionTypes,
  D extends
    | ApplicationCommandInteractionData
    | ButtonData
    | SelectMenuData
    | undefined
> {
  /** Id of the interaction */
  id: Snowflake;
  /** Id of the application this interaction is for */
  applicationId: Snowflake;
  /** The type of interaction */
  type: T;
  /** The channel it was sent from */
  channelId: Snowflake;
  /** The guild it was sent from */
  guildId: Snowflake;
  /** Guild member data for the invoking user, including permissions */
  member?: InteractionGuildMember;
  /** User object for the invoking user, if invoked in a DM */
  user: User;
  /** A continuation token for responding to the interaction */
  token: string;
  /** Read-only property, always `1` */
  version: 1;
  /** The command data payload. */
  data: D;
}

export interface ComponentInteraction
  extends BaseInteraction<
    InteractionTypes.MessageComponent,
    ButtonData | SelectMenuData
  > {
  /** For the message the button was attached to */
  message: Message;
  /** The values the user selected. */
  values?: string[];
}
