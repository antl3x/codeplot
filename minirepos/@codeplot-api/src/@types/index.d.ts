// In index.d.ts or socket.d.ts
import "socket.io";
import { createRootStore } from "@codeplot/shared/@.mst";

declare module "socket.io" {
  interface Socket {
    ctx: {
      rootStore: ReturnType<typeof createRootStore>;
      // Add other custom properties here
    };
  }
}

declare module "y-websocket/bin/utils.js";
