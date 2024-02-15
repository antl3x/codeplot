#!/usr/bin/env node

// Import statements with TypeScript types
import WebSocket, { WebSocketServer } from "ws"; // Make sure 'ws' module supports ESM
import http, { IncomingMessage, ServerResponse, Server } from "http";
import { setupWSConnection } from "@.yjs.server"; // Ensure './utils' is an ESM module and exports setupWSConnection

const port: number = parseInt(process.env.PORT_HOST || "9108");

const server: Server = http.createServer(
  (request: IncomingMessage, response: ServerResponse) => {
    response.writeHead(200, { "Content-Type": "text/plain" });
    response.end("okay");
  },
);

const wss: WebSocketServer = new WebSocketServer({ noServer: true });

wss.on("connection", setupWSConnection);

server.on("upgrade", (request: IncomingMessage, socket: any, head: Buffer) => {
  // Authentication check can be performed here
  const handleAuth = (ws: WebSocket): void => {
    wss.emit("connection", ws, request);
  };
  wss.handleUpgrade(request, socket, head, handleAuth);
});

server.listen(port, () => {
  console.log(`running at on port ${port}`);
});

server.on("error", (error) => {
  console.error("Server error:", error);
});

wss.on("error", (error) => {
  console.error("WebSocket Server error:", error);
});
