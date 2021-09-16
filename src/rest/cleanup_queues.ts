import { Rest } from "./types.ts";

/** Cleans up the queues by checking if there is nothing left and removing it. */
export function cleanupQueues(rest: Rest): void {
  for (const [key, { processing, queue }] of rest.pathQueues) {
    if (queue.length || processing) {
      continue;
    }
    // REMOVE IT FROM CACHE
    rest.pathQueues.delete(key);
  }
}
