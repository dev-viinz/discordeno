import { Snowflake } from "../src/types/base.ts";
import { createCoders } from "./utils.ts";

const CACHE_SECRET = "FOO_BAR";

const coders = createCoders("bz5shaoGZAX6KgWgBARsc3HIOWjSgrGT4KkM7ieTEjc=");

const cache: Record<TableNames, Map<bigint, {}>> = {
  channels: new Map(),
  users: new Map(),
  guilds: new Map(),
  messages: new Map(),
  presences: new Map(),
  threads: new Map(),
  unavailableGuilds: new Map(),
};

// Start listening on localhost.
const server = Deno.listen({ port: 7252 });

// Connections to the server will be yielded up as an async iterable.
for await (const conn of server) {
  // In order to not be blocking, we need to handle each connection individually
  // in its own async function.
  handleRequest(conn);
}

async function handleRequest(conn: Deno.Conn) {
  // This "upgrades" a network connection into an HTTP connection.
  const httpConn = Deno.serveHttp(conn);
  // Each request sent over the HTTP connection will be yielded as an async
  // iterator from the HTTP connection.
  for await (const requestEvent of httpConn) {
    if (CACHE_SECRET !== requestEvent.request.headers.get("AUTHORIZATION")) {
      return requestEvent.respondWith(
        new Response('{ "error": "Invalid secret key." }', {
          status: 401,
        }),
      );
    }

    if (requestEvent.request.method !== "POST") {
      await requestEvent.respondWith(
        new Response('{ "error": "Method not allowed." }', {
          status: 405,
        }),
      );

      continue;
    }

    const data = await requestEvent.request.text();

    if (!data) {
      await requestEvent.respondWith(
        new Response(coders.encode({ error: "Invalid Body Data." }), {
          status: 400,
        }),
      );

      continue;
    }

    const decoded = coders.decode(data) as CacheRequest;

    switch (decoded.type) {
      case "clear": {
        cache[decoded.table].clear();
        await requestEvent.respondWith(
          new Response(undefined, {
            status: 204,
          }),
        );
        continue;
      }
      case "delete": {
        await requestEvent.respondWith(
          new Response(coders.encode(cache[decoded.table].delete(decoded.key))),
        );
        continue;
      }
      case "has": {
        await requestEvent.respondWith(
          new Response(coders.encode(cache[decoded.table].has(decoded.key))),
        );
        continue;
      }
      case "size": {
        console.log("HEYA");
        await requestEvent.respondWith(
          new Response(coders.encode(cache[decoded.table].size)),
        );
        continue;
      }
      case "set": {
        await requestEvent.respondWith(
          new Response(
            coders.encode(
              !!cache[decoded.table].set(decoded.key, decoded.data),
            ),
          ),
        );
        continue;
      }
      case "get": {
        await requestEvent.respondWith(
          new Response(coders.encode(cache[decoded.table].get(decoded.key))),
        );
        continue;
      }
      case "getAll": {
        await requestEvent.respondWith(
          new Response(coders.encode(cache[decoded.table])),
        );
        continue;
      }
      default: {
        await requestEvent.respondWith(
          new Response(coders.encode({ error: "Invalid Body Data." }), {
            status: 400,
          }),
        );
        continue;
      }
    }
  }
}

export type CacheRequest =
  | ClearRequest
  | DeleteRequest
  | HasRequest
  | SizeRequest
  | SetRequest
  | GetRequest
  | GetAllRequest;

interface RequestBase<
  T extends "clear" | "delete" | "has" | "size" | "set" | "get" | "getAll",
> {
  type: T;
  table: TableNames;
}

type ClearRequest = RequestBase<"clear">;

interface DeleteRequest extends RequestBase<"delete"> {
  key: Snowflake;
}

interface HasRequest extends RequestBase<"has"> {
  key: Snowflake;
}

type SizeRequest = RequestBase<"size">;

interface SetRequest extends RequestBase<"set"> {
  key: Snowflake;
  data: {};
}

interface GetRequest extends RequestBase<"get"> {
  key: Snowflake;
}

type GetAllRequest = RequestBase<"getAll">;

type TableNames =
  | "channels"
  | "users"
  | "guilds"
  | "messages"
  | "presences"
  | "threads"
  | "unavailableGuilds";

// /** Completely empty this table. */
// clear(): void;
// /** Delete the data related to this key from table. */
// delete(key: Snowflake): boolean;
// /** Check if there is data assigned to this key. */
// has(key: Snowflake): boolean;
// /** Check how many items are stored in this table. */
// size(): number;
// /** Store new data to this table. */
// set(key: Snowflake, data: T): boolean;
// /** Get a stored item from the table. */
// get(key: Snowflake): T | undefined;
// /**
//  * Loop over each entry and execute callback function.
//  * @important This function NOT optimised and will force load everything when using custom cache.
//  */
// forEach(callback: (value: T, key: Snowflake) => unknown): void;
// /**
//  * Loop over each entry and execute callback function.
//  * @important This function NOT optimised and will force load everything when using custom cache.
//  */
// filter(
//   callback: (value: T, key: Snowflake) => boolean
// ): Collection<Snowflake, T>;
