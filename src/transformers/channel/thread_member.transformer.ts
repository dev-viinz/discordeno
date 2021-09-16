import { ThreadMember } from "../../types/channel/threads/thread_member.ts";
import { ToDiscordType } from "../../types/utils.ts";

export function transformThreadMember(
  threadMember: ToDiscordType<ThreadMember>
): ThreadMember {
  return {
    id: threadMember.id ? BigInt(threadMember.id) : undefined,
    userId: threadMember.user_id ? BigInt(threadMember.user_id) : undefined,
    joinTimestamp: Date.parse(threadMember.join_timestamp),
    flags: threadMember.flags,
  };
}

export default transformThreadMember;
