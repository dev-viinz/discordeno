import { BASE_URL, API_VERSION, IMAGE_BASE_URL } from "../utils/constants.ts";
import { Methods, Rest } from "./types.ts";
import { toDiscordBody } from "../utils/to_discord_body.ts";

// deno-lint-ignore no-explicit-any
export async function runMethod<T = any>(
  rest: Rest,
  method: Methods,
  url: string,
  body?: Record<string, unknown>,
  retryCount = 0,
  bucketId?: string
): Promise<T> {
  if (body) {
    // TODO: convert camelCase to snake_case and make bigints to strings
    body = toDiscordBody(body);
  }

  rest.eventHandlers.debug?.("requestCreate", {
    method,
    url,
    body,
    retryCount,
    bucketId,
  });

  const errorStack = new Error("Location:");
  Error.captureStackTrace(errorStack);

  // For proxies we don't need to do any of the legwork so we just forward the request
  if (
    !url.startsWith(`${BASE_URL}/v${API_VERSION}`) &&
    !url.startsWith(IMAGE_BASE_URL)
  ) {
    const result = await fetch(url, {
      body: JSON.stringify(body || {}),
      headers: {
        authorization: rest.authorization,
      },
      method: method.toUpperCase(),
    }).catch((error) => {
      console.error(error);
      throw errorStack;
    });

    return result.status !== 204 ? await result.json() : undefined;
  }

  // No proxy so we need to handle all rate limiting and such
  return new Promise((resolve, reject) => {
    rest.processRequest(
      rest,
      {
        url,
        method,
        reject: (error) => {
          console.error(error);
          reject(errorStack);
        },
        respond: (data: { status: number; body?: string }) =>
          resolve(
            data.status !== 204
              ? // TODO: idk should I add camelize :thinking:
                // ? camelize<T>(JSON.parse(data.body ?? "{}"))
                JSON.parse(data.body ?? "{}")
              : ((undefined as unknown) as T)
          ),
      },
      {
        bucketId,
        body,
        retryCount,
      }
    );
  });
}
