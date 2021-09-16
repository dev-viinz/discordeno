import { BASE_URL } from "../utils/constants.ts";
import { Rest, RestPayload, RestRequest } from "./types.ts";

/** Processes a request and assigns it to a queue or creates a queue if none exists for it. */
export async function processRequest(
  rest: Rest,
  request: RestRequest,
  payload: RestPayload,
): Promise<void> {
  const route = request.url.substring(request.url.indexOf("api/"));
  const parts = route.split("/");
  // REMOVE THE API
  parts.shift();
  // REMOVES THE VERSION NUMBER
  if (parts[0]?.startsWith("v")) parts.shift();
  // SET THE NEW REQUEST URL
  request.url = `${BASE_URL}/v${rest.apiVersion}/${parts.join("/")}`;
  // REMOVE THE MAJOR PARAM
  parts.shift();

  const url = rest.simplifyUrl(request.url, request.method);

  const stored = rest.pathQueues.get(url);
  // IF THE QUEUE EXISTS JUST ADD THIS TO THE QUEUE
  if (stored) {
    stored.queue.push({ request, payload });
  } else {
    // CREATES A NEW QUEUE
    rest.pathQueues.set(url, {
      processing: false,
      queue: [
        {
          request,
          payload,
        },
      ],
    });
    await rest.processQueue(rest, url);
  }
}
