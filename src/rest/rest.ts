import { Collection } from "../utils/collection.ts";
import { checkRateLimits } from "./check_rate_limits.ts";
import { cleanupQueues } from "./cleanup_queues.ts";
import { createRequestBody } from "./create_request_body.ts";
import { processQueue } from "./process_queue.ts";
import { processRateLimitedPaths } from "./process_rate_limited_paths.ts";
import { processRequest } from "./process_request.ts";
import { processRequestHeaders } from "./process_request_headers.ts";
import { runMethod } from "./run_method.ts";
import { simplifyUrl } from "./simplify_url.ts";
import {
  Rest,
  RestPayload,
  RestRateLimitedPath,
  RestRequest,
} from "./types.ts";

export function createRest(options: {
  token: string;
  maxRetryCount?: number;
  apiVersion?: string;
  authorization?: string;
}): Rest {
  return {
    /** The bot token for this rest client. */
    token: `Bot ${options.token}`,
    /** The maximum amount of retries allowed */
    maxRetryCount: options.maxRetryCount ?? 10,
    apiVersion: options.apiVersion || "9",
    /** The secret authorization key to confirm that this was a request made by you and not a DDOS attack. */
    authorization: "TEBAMI",
    pathQueues: new Collection<
      string,
      {
        processing: boolean;
        queue: {
          request: RestRequest;
          payload: RestPayload;
        }[];
      }
    >(),
    processingQueue: false,
    processingRateLimitedPaths: false,
    globallyRateLimited: false,
    ratelimitedPaths: new Collection<string, RestRateLimitedPath>(),
    eventHandlers: {},
    /** Handler function for every request. Converts to json, verified authorization & requirements and begins processing the request */
    checkRateLimits,
    cleanupQueues,
    processQueue,
    processRateLimitedPaths,
    processRequestHeaders,
    processRequest,
    createRequestBody,
    runMethod,
    simplifyUrl,
  };
}
