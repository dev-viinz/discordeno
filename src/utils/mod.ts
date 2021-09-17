import { Collection } from "./collection.ts";
import { Components } from "./components.ts";
import { delay } from "./delay.ts";
import { Embeds } from "./embeds.ts";
import { formatImageUrl } from "./format_image_url.ts";
import { hasProperty } from "./has_property.ts";
import { meltSnowflake, snowlakeToUnix } from "./snowflake.ts";

export const tebamiUtils = {
  Collection,
  Components,
  delay,
  Embeds,
  formatImageUrl,
  hasProperty,
  meltSnowflake,
  snowlakeToUnix,
};

export type TebamiUtils = typeof tebamiUtils;
