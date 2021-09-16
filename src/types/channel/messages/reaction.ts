import { Emoji } from "../../emoji/emoji.ts";

/**
 * https://discord.com/developers/docs/resources/channel#reaction-object-reaction-structure
 */
export interface Reaction {
  /** Times this emoji has been used to react. */
  count: number;
  /** Whther the current user reacted using this emoji. */
  me: boolean;
  /** Emoji information. */
  emoji: Partial<Emoji>;
}
