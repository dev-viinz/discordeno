import { Bot } from "../../bot.ts";
import { DiscordImageFormat } from "../../types/misc/image_format.ts";
import { DiscordImageSize } from "../../types/misc/image_size.ts";
import { User } from "../../types/user/user.ts";
import { endpoints } from "../../utils/constants.ts";
import { formatImageUrl } from "../../utils/format_image_url.ts";
import { iconBigintToHash } from "../../utils/hash.ts";

/** The users custom avatar or the default avatar if you don't have a member object. */
export function avatarUrl(
  _: Bot,
  user: Pick<User, "id" | "discriminator" | "avatar">,
  options?: { size?: DiscordImageSize; format?: DiscordImageFormat },
): string {
  return user.avatar
    ? formatImageUrl(
      endpoints.USER_AVATAR(user.id, iconBigintToHash(user.avatar)),
      options?.size || 128,
      options?.format,
    )
    : endpoints.USER_DEFAULT_AVATAR(Number(user.discriminator) % 5);
}
