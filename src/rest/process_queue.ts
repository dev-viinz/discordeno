import { HttpResponseCodes } from "../types/codes/http_response_codes.ts";
import { delay } from "../utils/delay.ts";
import { Rest } from "./types.ts";

/** Processes the queue by looping over each path separately until the queues are empty. */
export async function processQueue(rest: Rest, id: string): Promise<void> {
  const stored = rest.pathQueues.get(id);
  if (!stored || stored.processing) return;

  stored.processing = true;
  const queue = stored.queue;

  while (queue.length) {
    // IF THE BOT IS GLOBALLY RATELIMITED TRY AGAIN
    if (rest.globallyRateLimited) {
      setTimeout(async () => {
        await processQueue(rest, id);
      }, 1000);

      break;
    }
    // SELECT THE FIRST ITEM FROM THIS QUEUE
    const [queuedRequest] = queue;
    // IF THIS DOESNT HAVE ANY ITEMS JUST CANCEL, THE CLEANER WILL REMOVE IT.
    if (!queuedRequest) return;

    const basicURL = rest.simplifyUrl(
      queuedRequest.request.url,
      queuedRequest.request.method.toUpperCase(),
    );

    // IF THIS URL IS STILL RATE LIMITED, TRY AGAIN
    const urlResetIn = rest.checkRateLimits(rest, basicURL);
    if (urlResetIn) {
      // PAUSE FOR THIS SPECIFC REQUEST
      await delay(urlResetIn);
      continue;
    }

    // IF A BUCKET EXISTS, CHECK THE BUCKET'S RATE LIMITS
    const bucketResetIn = queuedRequest.payload.bucketId
      ? rest.checkRateLimits(rest, queuedRequest.payload.bucketId)
      : 0;
    // THIS BUCKET IS STILL RATELIMITED, RE-ADD TO QUEUE
    if (bucketResetIn) continue;

    // EXECUTE THE REQUEST

    // IF THIS IS A GET REQUEST, CHANGE THE BODY TO QUERY PARAMETERS
    const query = queuedRequest.request.method.toUpperCase() === "GET" &&
        queuedRequest.payload.body
      ? Object.keys(queuedRequest.payload.body)
        .map(
          (key) =>
            `${encodeURIComponent(key)}=${
              encodeURIComponent(
                (queuedRequest.payload.body as Record<string, string>)[key],
              )
            }`,
        )
        .join("&")
      : "";
    const urlToUse =
      queuedRequest.request.method.toUpperCase() === "GET" && query
        ? `${queuedRequest.request.url}?${query}`
        : queuedRequest.request.url;

    // CUSTOM HANDLER FOR USER TO LOG OR WHATEVER WHENEVER A FETCH IS MADE
    rest.eventHandlers.fetching?.(queuedRequest.payload);

    try {
      const response = await fetch(
        urlToUse,
        rest.createRequestBody(rest, queuedRequest),
      );

      rest.eventHandlers.fetched?.(queuedRequest.payload);
      const bucketIdFromHeaders = rest.processRequestHeaders(
        rest,
        basicURL,
        response.headers,
      );
      // SET THE BUCKET Id IF IT WAS PRESENT
      if (bucketIdFromHeaders) {
        queuedRequest.payload.bucketId = bucketIdFromHeaders;
      }

      if (response.status < 200 || response.status >= 400) {
        rest.eventHandlers.error?.(
          "httpError",
          queuedRequest.payload,
          response,
        );

        let error = "REQUEST_UNKNOWN_ERROR";
        switch (response.status) {
          case HttpResponseCodes.BadRequest:
            error =
              "The request was improperly formatted, or the server couldn't understand it.";
            break;
          case HttpResponseCodes.Unauthorized:
            error = "The Authorization header was missing or invalid.";
            break;
          case HttpResponseCodes.Forbidden:
            error =
              "The Authorization token you passed did not have permission to the resource.";
            break;
          case HttpResponseCodes.NotFound:
            error = "The resource at the location specified doesn't exist.";
            break;
          case HttpResponseCodes.MethodNotAllowed:
            error =
              "The HTTP method used is not valid for the location specified.";
            break;
          case HttpResponseCodes.GatewayUnavailable:
            error =
              "There was not a gateway available to process your request. Wait a bit and retry.";
            break;
        }

        // If Rate limited should not remove from queue
        if (response.status !== 429) {
          queuedRequest.request.reject(
            new Error(`[${response.status}] ${error}`),
          );
          queue.shift();
        } else {
          if (queuedRequest.payload.retryCount++ >= rest.maxRetryCount) {
            rest.eventHandlers.retriesMaxed?.(queuedRequest.payload);
            queuedRequest.request.reject(
              new Error(
                `[${response.status}] The request was rate limited and it maxed out the retries limit.`,
              ),
            );
            // REMOVE ITEM FROM QUEUE TO PREVENT RETRY
            queue.shift();
            continue;
          }
        }

        continue;
      }

      // SOMETIMES DISCORD RETURNS AN EMPTY 204 RESPONSE THAT CAN'T BE MADE TO JSON
      if (response.status === 204) {
        rest.eventHandlers.fetchSuccess?.(queuedRequest.payload);
        // REMOVE FROM QUEUE
        queue.shift();
        queuedRequest.request.respond({ status: 204 });
      } else {
        // CONVERT THE RESPONSE TO JSON
        const json = await response.json();

        rest.eventHandlers.fetchSuccess?.(queuedRequest.payload);
        // REMOVE FROM QUEUE
        queue.shift();
        queuedRequest.request.respond({
          status: 200,
          body: JSON.stringify(json),
        });
      }
    } catch (error) {
      // SOMETHING WENT WRONG, LOG AND RESPOND WITH ERROR
      rest.eventHandlers.fetchFailed?.(queuedRequest.payload, error);
      queuedRequest.request.reject(error);
      // REMOVE FROM QUEUE
      queue.shift();
    }
  }

  stored.processing = false;

  // ONCE QUEUE IS DONE, WE CAN TRY CLEANING UP
  rest.cleanupQueues(rest);
}
