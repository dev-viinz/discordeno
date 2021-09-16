import { Snowflake } from "../../base.ts";
import { ApplicationCommandPermissionTypes } from "./application_command_permission_types.ts";

/**
 *  https://discord.com/developers/docs/interactions/application-commands#application-command-permissions-object-application-command-permissions-structure
 */
export interface ApplicationCommandPermission {
  /** The id of the role or user. */
  id: Snowflake;
  /** Role or user. */
  type: ApplicationCommandPermissionTypes;
  /** `true` to allow, `false` to deny. */
  permission: boolean;
}
