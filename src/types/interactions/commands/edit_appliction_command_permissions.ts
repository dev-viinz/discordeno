/**
 * https://discord.com/developers/docs/interactions/application-commands#edit-application-command-permissions
 */
export interface EditApplicationCommandPermissions {
  /** The permissions for the command in the guild. */
  permissions: ApplicationCommandPermission[];
}
