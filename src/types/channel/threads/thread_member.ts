import { Snowflake } from "../../base.ts";

export interface ThreadMemberBase {
  /** Any user-thread settings, currently only used for notifications */
  flags: number;
}

export interface ThreadMemberOnGuildCreate extends ThreadMemberBase {
  /** The time the current user last joined the thread */
  joinTimestamp: number;
}

export interface ThreadMember extends ThreadMemberBase {
  /** The id of the thread */
  id?: Snowflake;
  /** The id of the user */
  userId?: Snowflake;
  /** The time the current user last joined the thread */
  joinTimestamp: number;
}
