// // Start listening on localhost.
// const server = Deno.listen({ port: 7252 });

// // Connections to the server will be yielded up as an async iterable.
// for await (const conn of server) {
//   // In order to not be blocking, we need to handle each connection individually
//   // in its own async function.
//   handleRequest(conn);
// }

// async function handleRequest(conn: Deno.Conn) {
//   // This "upgrades" a network connection into an HTTP connection.
//   const httpConn = Deno.serveHttp(conn);
//   console.log("HANDLING");
//   // Each request sent over the HTTP connection will be yielded as an async
//   // iterator from the HTTP connection.
//   for await (const requestEvent of httpConn) {
//     return requestEvent.respondWith(
//       new Response('{ "error": "Method not allowed." }', {
//         status: 405,
//       })
//     );
//   }
// }

const server = Deno.listen({ port: 7252 });

for await (const conn of server) {
  (async () => {
    const httpConn = Deno.serveHttp(conn);
    for await (const requestEvent of httpConn) {
      return await requestEvent.respondWith(
        new Response("hello world", {
          status: 200,
        })
      );
    }
  })();
}
