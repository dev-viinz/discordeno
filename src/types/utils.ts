import { Channel } from "./channel/channel.ts";
import { Embed } from "./channel/messages/embeds/embed.ts";
import { Message } from "./channel/messages/message.ts";
import { Overwrite } from "./channel/overwrite.ts";
import { BaseInteraction, Interaction } from "./interactions/interaction.ts";
import { User } from "./user/user.ts";
import { VoiceState } from "./voice/voice_state.ts";

type SnakeCase<T extends PropertyKey> = string extends T ? string
  : T extends `${infer F}${infer U}${infer R}`
    ? `${F extends Uppercase<F> ? "_" : ""}${Lowercase<F>}${U extends
      Uppercase<U> ? "_"
      : ""}${Lowercase<U>}${SnakeCase<R>}`
  : T extends `${infer F}${infer R}`
    ? `${F extends Uppercase<F> ? "_" : ""}${Lowercase<F>}${SnakeCase<R>}`
  : "";

// deno-lint-ignore no-explicit-any
export type ToDiscordType<T> = T extends readonly any[]
  ? { [K in keyof T]: ToDiscordType<T[K]> }
  : // deno-lint-ignore ban-types
  T extends object ? {
    [K in keyof T as SnakeCase<Extract<K, string>>]: K extends
      | "createdAt"
      | "lastPinTimestamp"
      | "joinTimestamp"
      | "archiveTimestamp"
      | "requestToSpeakTimestamp"
      | "syncedAt"
      | "editedTimestamp" ? string
      : K extends "before" ? T[K] extends number ? string
      : ToDiscordType<T[K]>
      : K extends "joinedAt" ? K extends number | null ? string | null
      : ToDiscordType<T[K]>
      : K extends "premiumSince"
        ? K extends number | null | undefined ? string | null | undefined
        : ToDiscordType<T[K]>
      : K extends "timestamp" ? T extends Message | Embed ? string
      : ToDiscordType<T[K]>
      : K extends "guildId"
        ? T extends Channel | Interaction | Message ? string | undefined
        : ToDiscordType<T[K]>
      : K extends "channelId" ? T extends Interaction ? string | undefined
      : ToDiscordType<T[K]>
      : K extends "premiumSubscriber" ? null | undefined
      : K extends "voiceStates" ? Omit<VoiceState, "guildId">[] | undefined
      : T extends Interaction
        ? K extends "user" ? undefined | ToDiscordType<User>
        : ToDiscordType<T[K]>
      : K extends "permissionOverwrites" ? undefined | ToDiscordType<T[K]>
      : K extends "thread"
        ? T extends Message ? ToDiscordType<Channel> | undefined
        : ToDiscordType<T[K]>
      : ToDiscordType<T[K]>;
  }
  : T extends undefined ? T extends bigint ? string | undefined
  : undefined
  : T extends bigint ? string
  : T;

export type RequirePartial<T, K extends keyof T> =
  & {
    [P in keyof T]?: T[P] | undefined;
  }
  & { [P in K]-?: T[P] };

export type PickPartial<T, K extends keyof T> =
  & {
    [P in keyof T]?: T[P] | undefined;
  }
  & { [P in K]: T[P] };

export type MakeUnoptional<T, K extends keyof T> =
  & {
    [P in keyof T]: T[P];
  }
  & { [P in K]-?: T[P] };

export type RemoveFirstFromTuple<T extends any[]> = T["length"] extends 0 ? []
  : ((...b: T) => void) extends (a: any, ...b: infer I) => void ? I
  : [];

export type ValueOf<T> = T[keyof T];
