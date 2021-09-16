import { ToDiscordType } from "../utils.ts";
import { SessionStartLimit } from "./session_start_limit.ts";

export interface GatewayBot {
  /** The WSS URL that can be used for connecting to the gateway. */
  url: string;
  /** The recommended number of [shards](https://discord.com/developers/docs/topics/gateway#sharding) to use when connecting. */
  shards: number;
  /** Information on the current session start limit. */
  sessionStartLimit: SessionStartLimit;
}

export type DiscordGatewayBot = ToDiscordType<GatewayBot>;
