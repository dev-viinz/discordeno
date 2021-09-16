import { Collection } from "../utils/collection.ts";

export interface Rest {
  /** The bot token for this rest client. */
  token: string;
  /** The maximum amount of retries allowed */
  maxRetryCount: number;
  apiVersion: string;
  /** The secret authorization key to confirm that this was a request made by you and not a DDOS attack. */
  authorization: string;
  pathQueues: Collection<
    string,
    {
      processing: boolean;
      queue: {
        request: RestRequest;
        payload: RestPayload;
      }[];
    }
  >;
  processingQueue: boolean;
  processingRateLimitedPaths: boolean;
  globallyRateLimited: boolean;
  ratelimitedPaths: Collection<string, RestRateLimitedPath>;
  eventHandlers: {
    // BY DEFAULT WE WILL LOG ALL ERRORS TO CONSOLE. USER CAN CHOOSE TO OVERRIDE
    error?: (...args: unknown[]) => unknown;
    // PLACEHOLDERS TO ALLOW USERS TO CUSTOMIZE
    debug?: (type: string, error: string | Record<string, unknown>) => unknown;
    fetching?: (payload: RestPayload) => unknown;
    fetched?: (payload: RestPayload) => unknown;
    fetchSuccess?: (payload: RestPayload) => unknown;
    fetchFailed?: (payload: RestPayload, error: unknown) => unknown;
    globallyRateLimited?: (url: string, resetsAt: number) => unknown;
    retriesMaxed?: (payload: RestPayload) => unknown;
  };
  /** Handler function for every request. Converts to json, verified authorization & requirements and begins processing the request */
  checkRateLimits: (rest: Rest, url: string) => number;
  cleanupQueues: (rest: Rest) => void;
  processQueue: (rest: Rest, id: string) => Promise<void>;
  processRateLimitedPaths: (rest: Rest) => void;
  processRequestHeaders: (
    rest: Rest,
    url: string,
    headers: Headers
  ) => string | undefined;
  processRequest: (
    rest: Rest,
    request: RestRequest,
    payload: RestPayload
  ) => Promise<void>;
  createRequestBody: (
    rest: Rest,
    queuedRequest: { request: RestRequest; payload: RestPayload }
  ) => {
    headers: {
      [key: string]: string;
    };
    body: string | FormData;
    method: string;
  };
  runMethod: <T>(
    rest: Rest,
    method: Methods,
    url: string,
    body?: {},
    retryCount?: number,
    bucketId?: string
  ) => Promise<T>;
  simplifyUrl: (url: string, method: string) => string;
}

export interface RestRequest {
  url: string;
  method: string;
  respond: (payload: { status: number; body?: string }) => unknown;
  reject: (error: unknown) => unknown;
}

export interface RestPayload {
  bucketId?: string;
  body?: Record<string, unknown>;
  retryCount: number;
}

export interface RestRateLimitedPath {
  url: string;
  resetTimestamp: number;
  bucketId?: string;
}

export type Methods = "GET" | "POST" | "PUT" | "DELETE" | "PATCH";
