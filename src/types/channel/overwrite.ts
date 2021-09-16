import { Snowflake } from "../base.ts";
import { OverwriteTypes } from "./overwrite_types.ts";

export interface Overwrite {
  /** Role or user id */
  id: Snowflake;
  /** Either 0 (role) or 1 (member) */
  type: OverwriteTypes;
  /** Permission bit set */
  allow: bigint;
  /** Permission bit set */
  deny: bigint;
}
