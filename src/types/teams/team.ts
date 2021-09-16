import { Snowflake } from "../base.ts";
import { TeamMember } from "./team_member.ts";

/** https://discord.com/developers/docs/topics/teams#data-models-team-object */
export interface Team {
  /** A hash of the image of the team's icon */
  icon: bigint | null;
  /** The unique id of the team */
  id: Snowflake;
  /** The members of the team */
  members: TeamMember[];
  /** The name of the team */
  name: string;
  /** The user id of the current team owner */
  ownerUserId: Snowflake;
}
