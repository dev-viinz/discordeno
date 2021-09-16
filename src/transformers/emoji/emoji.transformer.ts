import { Emoji } from "../../types/emoji/emoji.ts";
import { ToDiscordType } from "../../types/utils.ts";
import { transformUser } from "../user/user.transformer.ts";

export function transformEmoji(data: ToDiscordType<Emoji>): Emoji {
  return {
    id: data.id ? BigInt(data.id) : null,
    name: data.name,
    roles: data.roles?.map((id) => BigInt(id)),
    user: data.user ? transformUser(data.user) : undefined,
    requireColons: data.require_colons,
    managed: data.managed,
    animated: data.animated,
    available: data.available,
  };
}

export default transformEmoji;
