import { Emoji } from "../../emoji/emoji.ts";
import { PickPartial } from "../../utils.ts";

/**
 * https://discord.com/developers/docs/interactions/message-components#select-menu-object-select-option-structure
 */
export interface SelectOption {
  /** The user-facing name of the option, max 100 characters. */
  label: string;
  /** The dev-define value of the option, max 100 characters. */
  value: string;
  /** An additional description of the option, max 100 characters. */
  description?: string;
  /** Partial emoji object. */
  emoji?: PickPartial<Emoji, "id" | "name" | "animated">;
  /** Will render this option as selected by default. */
  default?: boolean;
}
