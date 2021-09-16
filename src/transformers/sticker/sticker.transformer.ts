import { Sticker } from "../../types/sticker/sticker.ts";
import { ToDiscordType } from "../../types/utils.ts";
import { transformUser } from "../user/user.transformer.ts";

export function transformSticker(data: ToDiscordType<Sticker>): Sticker {
  return {
    id: BigInt(data.id),
    packId: data.pack_id ? BigInt(data.pack_id) : undefined,
    name: data.name,
    description: data.description,
    tags: data.tags,
    type: data.type,
    formatType: data.format_type,
    available: data.available,
    guildId: data.guild_id ? BigInt(data.guild_id) : undefined,
    user: data.user ? transformUser(data.user) : undefined,
    sortValue: data.sort_value,
  };
}

export default transformSticker;
