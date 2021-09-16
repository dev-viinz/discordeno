import { Snowflake } from "../base.ts";
import { Guild } from "./guild.ts";

export interface UnavailableGuild extends Partial<Guild> {
  id: Snowflake;
  unavailable: true;
}
