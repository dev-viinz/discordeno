import { Snowflake } from "../base.ts";
import { GuildMemberWithUser } from "../guild/guild_member.ts";

/**
 * https://discord.com/developers/docs/resources/voice#voice-state-object-voice-state-structure
 */
export interface VoiceState {
  /** The guild Id this voice state is for. */
  guildId: Snowflake;
  /** The channel Id this user is connected to. */
  channelId: Snowflake;
  /** The user Id this voice state is for. */
  userId: Snowflake;
  /** The guild member this voice state is for. */
  member?: GuildMemberWithUser;
  /** The session Id for this voice state. */
  sessionId: string;
  /** Whether this user is deafened by the server. */
  deaf: boolean;
  /** Whether this user is muted by the server. */
  mute: boolean;
  /** Whether this user is locally deafened. */
  selfDeaf: boolean;
  /** Whether this user is locally muted. */
  selfMute: boolean;
  /** Whether this user is streaming usering "Go Live". */
  selfStream?: boolean;
  /** Whether this user's camera is enabled. */
  selfVideo: boolean;
  /** Whether this user is muted by the current user. */
  suppress: boolean;
  /** The time at which the user requested to speak. */
  requestToSpeakTimestamp: number | null;
}
