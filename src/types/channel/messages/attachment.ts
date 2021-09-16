import { Snowflake } from "../../base.ts";

/**
 * https://discord.com/developers/docs/resources/channel#attachment-object-attachment-structure
 */
export interface Attachment {
  /** Attachment id. */
  id: Snowflake;
  /** Name of file attached. */
  filename: string;
  /** The attachment's [media type](https://en.wikipedia.org/wiki/Media_type). */
  contentType?: string;
  /** Size of file in byts. */
  size: number;
  /** Source url of file. */
  url: string;
  /** A proxied url of file. */
  proxyUrl: string;
  /** Height of file (if image). */
  height?: number | null;
  /** Width of file (if image). */
  width?: number | null;
  /**
   * Whether this attachment is ephemeral.
   * Ephemeral attachments will automatically be removed after a set period of time.
   * Ephemeral attachments on messages are guaranteed to be available as long as the message itself exists.
   */
  ephemeral?: boolean;
}
