import { Role } from "../../types/permissions/role.ts";
import { ToDiscordType } from "../../types/utils.ts";

export function transformRole(role: ToDiscordType<Role>): Role {
  return {
    id: BigInt(role.id),
    name: role.name,
    color: role.color,
    hoist: role.hoist,
    position: role.position,
    permissions: BigInt(role.permissions),
    managed: role.managed,
    mentionable: role.mentionable,
    tags: role.tags
      ? {
        botId: role.tags.bot_id ? BigInt(role.tags.bot_id) : undefined,
        integrationId: role.tags.integration_id
          ? BigInt(role.tags.integration_id)
          : undefined,
        premiumSubscriber: role.tags.premium_subscriber === null,
      }
      : undefined,
  };
}

export default transformRole;
