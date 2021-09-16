import { Snowflake } from "../base.ts";
import { User } from "../user/user.ts";
import { TeamMembershipStates } from "./team_membership_states.ts";

/** https://discord.com/developers/docs/topics/teams#data-models-team-members-object */
export interface TeamMember {
  /** The user's membership state on the team */
  membershipState: TeamMembershipStates;
  /** Will always be `["*"]` */
  permissions: ["*"];
  /** The id of the parent team of which they are a member */
  teamId: Snowflake;
  /** The avatar, discriminator, id, and username of the user */
  user:
    & Partial<User>
    & Pick<User, "avatar" | "discriminator" | "id" | "username">;
}
