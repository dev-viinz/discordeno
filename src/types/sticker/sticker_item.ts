import { Snowflake } from "../base.ts";
import { StickerFormatTypes } from "./sticker_format_types.ts";

/**
 * https://discord.com/developers/docs/resources/sticker#sticker-item-object-sticker-item-structure
 */
export interface StickerItem {
  /** Id of the sticker. */
  id: Snowflake;
  /** Name of the sticker. */
  name: string;
  /** [Type of Sticker Format](https://discord.com/developers/docs/resources/sticker#sticker-object-sticker-format-types). */
  formatType: StickerFormatTypes;
}
