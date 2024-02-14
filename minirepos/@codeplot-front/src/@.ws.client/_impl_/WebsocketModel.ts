import { types } from "mobx-state-tree";
import { Operation } from "fast-json-patch";
import io, { Socket } from "socket.io-client";

export const WebsocketModel = types
  .model("Websocket", {
    sessionId: types.string,
    url: types.string,
    isConnected: false,
  })
  .volatile(() => ({
    client: types.frozen() as never as Socket,
  }))
  .actions((self) => ({
    updateWsClient(client: Socket) {
      self.client = client;
    },
    setIsConnected(isConnected: boolean) {
      self.isConnected = isConnected;
    },
  }))
  .actions((self) => ({
    dispatchTldrPatch(patch: Operation[]) {
      self.client.emit("rootStore.tldrFile.applyPatch", patch);
    },
    afterCreate() {
      const wsClient = io(self.url, {
        query: { sessionId: self.sessionId },
      });

      self.updateWsClient(wsClient);

      console.log("Connecting to the server");

      self.client.on("connect", () => {
        self.setIsConnected(true);
      });

      self.client.on("disconnect", () => {
        self.setIsConnected(false);
      });

      self.client.on("connect_error", () => {
        self.setIsConnected(false);
        console.error("Connection error");
      });

      self.client.on("initialState", () => {
        // Initialize the local MST store with the received state
      });

      self.client.on("statePatch", () => {
        // Apply the received patch to the local MST store
      });
    },
  }));
