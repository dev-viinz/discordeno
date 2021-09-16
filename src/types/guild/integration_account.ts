import { Snowflake } from "../base.ts";

/**
 * https://discord.com/developers/docs/resources/guild#integration-account-object-integration-account-structure
 */
export interface IntegrationAccount {
  // TODO: check if this is really a snowflake since discord says its a string
  /** Id of the account. */
  id: Snowflake;
  /** Name of the account. */
  name: string;
}
