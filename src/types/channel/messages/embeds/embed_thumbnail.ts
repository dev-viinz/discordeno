/**
 * https://discord.com/developers/docs/resources/channel#embed-object-embed-thumbnail-structure
 */
export interface EmbedThumbnail {
  /** Source url of thumbnail (only supports http(s) as attachments). */
  url?: string;
  /** A proxied url of the thumbnail. */
  proxyUrl?: string;
  /** Height of the thumbnail. */
  height?: number;
  /** Width of the thumbnail. */
  width?: number;
}
