import { EmbedAuthor } from "./embed_author.ts";
import { EmbedField } from "./embed_field.ts";
import { EmbedFooter } from "./embed_footer.ts";
import { EmbedImage } from "./embed_image.ts";
import { EmbedProvider } from "./embed_provider.ts";
import { EmbedThumbnail } from "./embed_thumbnail.ts";
import { EmbedTypes } from "./embed_types.ts";
import { EmbedVideo } from "./embed_video.ts";

/**
 * https://discord.com/developers/docs/resources/channel#embed-object-embed-structure
 */
export interface Embed {
  /** Title of Embed. */
  title?: string;
  /** [Type of Embed](https://discord.com/developers/docs/resources/channel#embed-object-embed-types) (always "rich" for webhook embeds). */
  type?: EmbedTypes;
  /** Description of Embed. */
  description?: string;
  /** Url of Embed. */
  url?: string;
  /** Timestamp of Embeded content. */
  timestamp?: number;
  /** Color Color of Embed. */
  color?: number;
  /** Footer information. */
  footer?: EmbedFooter;
  /** Image information. */
  image?: EmbedImage;
  /** Thumbnail information. */
  thumbnail?: EmbedThumbnail;
  /** Video information. */
  video?: EmbedVideo;
  /** Provider information. */
  provider?: EmbedProvider;
  /** Author information. */
  author?: EmbedAuthor;
  /** Fields information. */
  fields?: EmbedField[];
}
