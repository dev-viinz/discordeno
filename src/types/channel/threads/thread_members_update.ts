import { Snowflake } from "../../base.ts";
import { ThreadMember } from "./thread_member.ts";

// TODO: add docs link
export interface ThreadMembersUpdateBase {
  /** The id of the thread */
  id: Snowflake;
  /** The id of the guild */
  guildId: Snowflake;
  /** The users who were added to the thread */
  addedMembers?: ThreadMember[];
  /** The id of the users who were removed from the thread */
  removedMemberIds?: Snowflake[];
  /** The approximate number of members in the thread, capped at 50 */
  memberCount: number;
}
