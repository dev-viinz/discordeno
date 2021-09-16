/**
 * https://discord.com/developers/docs/resources/channel#embed-object-embed-field-structure
 */
export interface EmbedField {
  /** Name of the field. */
  name: string;
  /** Value of the field. */
  value: string;
  /** Whether of not this field should display inline. */
  inline?: boolean;
}
