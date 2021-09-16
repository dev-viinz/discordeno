import { ThreadMetadata } from "../../types/channel/threads/thread_metadata.ts";
import { ToDiscordType } from "../../types/utils.ts";

export function transformThreadMetadata(
  threadMetadata: ToDiscordType<ThreadMetadata>,
): ThreadMetadata {
  return {
    archived: threadMetadata.archived,
    autoArchiveDuration: threadMetadata.auto_archive_duration,
    archiveTimestamp: Date.parse(threadMetadata.archive_timestamp),
    locked: threadMetadata.locked,
  };
}

export default transformThreadMetadata;
