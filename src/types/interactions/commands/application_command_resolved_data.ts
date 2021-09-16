import { Channel } from "../../channel/channel.ts";
import { Message } from "../../channel/messages/message.ts";
import { InteractionGuildMember } from "../../guild/guild_member.ts";
import { Role } from "../../permissions/role.ts";
import { User } from "../../user/user.ts";

/**
 * https://discord.com/developers/docs/interactions/receiving-and-responding#interaction-object-resolved-data-structure
 */
export interface ApplicationCommandResolvedData {
  /** The Ids and Message objects */
  messages?: Record<string, Message>;
  /** The Ids and User objects */
  users?: Record<string, User>;
  /** The Ids and partial Member objects */
  members?: Record<
    string,
    Omit<InteractionGuildMember, "user" | "deaf" | "mute">
  >;
  /** The Ids and Role objects */
  roles?: Record<string, Role>;
  /** The Ids and partial Channel objects */
  channels?: Record<
    string,
    Pick<Channel, "id" | "name" | "type" | "permissionOverwrites">
  >;
}
