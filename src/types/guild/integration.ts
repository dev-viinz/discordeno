import { Application } from "../application/application.ts";
import { Snowflake } from "../base.ts";
import { User } from "../user/user.ts";
import { IntegrationAccount } from "./integration_account.ts";
import { IntegrationExpireBehaviors } from "./integration_expire_bahaviors.ts";

/**
 * https://discord.com/developers/docs/resources/guild#integration-object-integration-structure
 */
export interface Integration {
  /** Integration Id. */
  id: Snowflake;
  /** Integration name. */
  name: string;
  /** Integration type (twitch, youtube or discord). */
  type: "twitch" | "youtube" | "discord";
  /** Is this integration enabled. */
  enabled: boolean;
  /** Is this integration syncing. */
  syncing?: boolean;
  /** Role Id that this integration uses for "subscribers". */
  roleId?: Snowflake;
  /** Whether emoticons should be synced for this integration (twitch only currently). */
  enableEmoticons?: boolean;
  /** The bahavior of expiring subscribers. */
  expireBahavior?: IntegrationExpireBehaviors;
  /** The grace period (in days) before expiring subscribers. */
  expireGracePeriod?: number;
  /** User for this integration. */
  user?: User;
  /** Integration account information. */
  account: IntegrationAccount;
  /** When this integration was last synced. */
  syncedAt?: number;
  /** How many subscribers this integration has. */
  subscriberCount?: number;
  /** Has this integration been revoked. */
  revoked?: boolean;
  /** The bot/OAuth2 applicatoin for discord integrations. */
  application?: Application;
}
