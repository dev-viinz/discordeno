import { GuildMember } from "../../types/guild/guild_member.ts";
import { ToDiscordType } from "../../types/utils.ts";
import transformUser from "../user/user.transformer.ts";

export function transformGuildMember(
  data: ToDiscordType<GuildMember>
): GuildMember {
  return {
    user: data.user ? transformUser(data.user) : undefined,
    nick: data.nick,
    roles: data.roles.map((id) => BigInt(id)),
    joinedAt: Date.parse((data.joined_at as unknown) as string), // TODO: fix this type
    premiumSince: data.premium_since
      ? Date.parse((data.premium_since as unknown) as string)
      : undefined, // TODO: fix this type
    deaf: data.deaf,
    mute: data.mute,
    pending: data.pending,
  };
}

export default transformGuildMember;
