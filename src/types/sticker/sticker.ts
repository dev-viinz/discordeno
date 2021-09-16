import { Snowflake } from "../base.ts";
import { User } from "../user/user.ts";
import { StickerFormatTypes } from "./sticker_format_types.ts";
import { StickerTypes } from "./sticker_types.ts";

/**
 * https://discord.com/developers/docs/resources/sticker#sticker-object-sticker-structure
 */
export interface Sticker {
  /** [Id of the sticker](https://discord.com/developers/docs/reference#image-formatting). */
  id: Snowflake;
  /** For standard stickers, id of the pack the sticker is from. */
  packId?: Snowflake;
  /** Name of the sticker. */
  name: string;
  /** Description of the sticker. */
  description: string | null;
  /** For guild stickers, the Discord name of a unixode emoji representing the sticker's expression.
   * For standard stickers, a comma-separated list of related expressions.
   */
  tags: string;
  /** [Type of Sticker](https://discord.com/developers/docs/resources/sticker#sticker-object-sticker-types). */
  type: StickerTypes;
  /** [Type of sticker format](https://discord.com/developers/docs/resources/sticker#sticker-object-sticker-format-types) */
  formatType: StickerFormatTypes;
  /** Whether this guild sticker can be used, may be false due to loss of Server Boosts. */
  available?: boolean;
  /** Id of the guild that owns this sticker. */
  guildId?: Snowflake;
  /** The user that uploaded the guild sticker. */
  user?: User;
  /** The standard sticker's sort order within its pack. */
  sortValue?: number;
}
