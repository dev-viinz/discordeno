import { Snowflake } from "../base.ts";
import { Channel } from "../channel/channel.ts";
import { GatewayReceivePayload } from "../gateway/gateway_payload.ts";
import { TebamiGuild } from "../guild/guild.ts";
import { Interaction } from "../interactions/interaction.ts";
import { TebamiUser } from "../user/user.ts";
import { ToDiscordType } from "../utils.ts";

export interface EventHandlers {
  /** Sent when a new guild channel is created, relevant to the current user. */
  channelCreate?: (channel: Channel) => unknown;
  /** Sent when a channel relevant to the current user is deleted. */
  channelDelete?: (channel: Channel) => unknown;
  /** Sent when a channel is updated. This is not sent when the field `last_message_id` is altered. To keep track of the `last_message_id` changes, you must listen for `MESSAGE_CREATE` events. */
  channelUpdate?: (newChannel: Channel, oldChannel: Channel) => unknown;
  /** Sent before every event. Discordeno awaits the execution of this event before main event gets sent. */
  dispatchRequirements?: (
    data: ToDiscordType<GatewayReceivePayload>,
    shardId: number,
  ) => unknown;
  /** When a guild goes available this event will be ran. */
  guildAvailable?: (guild: TebamiGuild, shardId: number) => unknown;
  /** Send when the bot gets added to a guild. */
  guildCreate?: (guild: TebamiGuild, shardId: number) => unknown;
  /** This event does get sent on start when shards are loading the guilds. */
  guildLoaded?: (guild: TebamiGuild, shardId: number) => unknown;
  /** Sent when a user uses a Slash Command (type 2) or clicks a button (type 3). */
  interactionCreate?: (data: Interaction) => unknown;
  /** Sent before every event execution. Discordeno will not await its execution. */
  raw?: (
    data: ToDiscordType<GatewayReceivePayload>,
    shardId: number,
  ) => unknown;
  /** Sent when all shards went ready. */
  ready?: () => unknown;
  /** Sent when a shard failed to load. */
  shardFailedToLoad?: (
    shardId: number,
    unavailableGuildIds: Set<bigint>,
  ) => unknown;
  /** Sent when a shard got ready. */
  shardReady?: (shardId: number) => unknown;
  /** Sent when a user leaves a voice channel. Does not get sent when user switches the voice channel. */
  voiceChannelLeave?: (user: TebamiUser, channelId: Snowflake) => unknown;
}
