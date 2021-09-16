import { Channel } from "../../types/channel/channel.ts";
import { GuildMemberWithUser } from "../../types/guild/guild_member.ts";
import { ApplicationCommandResolvedData } from "../../types/interactions/commands/application_command_resolved_data.ts";
import { Role } from "../../types/permissions/role.ts";
import { User } from "../../types/user/user.ts";
import { ToDiscordType } from "../../types/utils.ts";
import transformRole from "../permissions/role.transformer.ts";
import transformUser from "../user/user.transformer.ts";
import transformOverwrite from "../channel/overwrite.transformer.ts";

export function transformApplicationCommandResolvedData(
  data: ToDiscordType<ApplicationCommandResolvedData>
): ApplicationCommandResolvedData {
  // TODO: transform messages
  const messages = {};

  const users: Record<string, User> = {};
  for (const id in data.users) {
    users[id] = transformUser(data.users[id]);
  }

  // TODO: transform members
  const members: Record<string, GuildMemberWithUser> = {};

  const roles: Record<string, Role> = {};
  for (const id in data.roles) {
    roles[id] = transformRole(data.roles[id]);
  }

  const channels: Record<
    string,
    Pick<Channel, "id" | "name" | "type" | "permissionOverwrites">
  > = {};
  for (const id in data.channels) {
    channels[id] = {
      id: BigInt(data.channels[id].id),
      name: data.channels[id].name,
      type: data.channels[id].type,
      permissionOverwrites: (
        data.channels[id].permission_overwrites ?? []
      ).map((o) => transformOverwrite(o)),
    };
  }

  return {
    messages,
    users,
    members,
    roles,
    channels,
  };
}

export default transformApplicationCommandResolvedData;
