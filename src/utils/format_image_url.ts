import { DiscordImageFormat } from "../types/misc/image_format.ts";
import { DiscordImageSize } from "../types/misc/image_size.ts";

export function formatImageUrl(
  url: string,
  size: DiscordImageSize = 128,
  format?: DiscordImageFormat,
) {
  return `${url}.${format ||
    (url.includes("/a_") ? "gif" : "jpg")}?size=${size}`;
}
