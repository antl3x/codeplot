import {
  HistoryEntry,
  StoreSnapshot,
  TLAnyShapeUtilConstructor,
  TLRecord,
  TLStoreWithStatus,
  createTLStore,
  debounce,
  transact,
} from "@tldraw/tldraw";
import { useEffect, useMemo, useRef, useState } from "react";
import { YKeyValue } from "y-utility/y-keyvalue";
import { WebsocketProvider } from "y-websocket";
import * as Y from "yjs";

export function useStore({
  snapshot,
  wsHost,
  roomId,
  shapeUtils = [],
}: {
  snapshot: StoreSnapshot<TLRecord>;
  wsHost: string;
  roomId: string;
  shapeUtils: readonly TLAnyShapeUtilConstructor[];
}) {
  const [store] = useState(() => {
    const store = createTLStore({
      shapeUtils,
    });
    store.loadSnapshot(snapshot);
    return store;
  });

  const [storeWithStatus, setStoreWithStatus] = useState<TLStoreWithStatus>({
    status: "loading",
  });
  const connectionRef = useRef<{
    room: WebsocketProvider;
    yStore: YKeyValue<TLRecord>;
    yDoc: Y.Doc;
  }>();

  const setupConnection = useMemo(() => {
    if (!connectionRef.current) {
      console.log("Setting up connection");
      const yDoc = new Y.Doc({ gc: true });
      const yArr = yDoc.getArray<{ key: string; val: TLRecord }>(
        `tldrRec:${roomId}`,
      );
      const yStore = new YKeyValue(yArr);
      const room = new WebsocketProvider(wsHost, roomId, yDoc, {
        connect: true,
      });

      connectionRef.current = { room, yStore, yDoc };

      // Setup your connection and listeners here
      // You can move the relevant useEffect logic here or keep it in useEffect depending on your preference
    }
    return connectionRef.current;
  }, [wsHost, roomId]); // Dependencies that, when changed, should re-establish the connection

  useEffect(() => {
    const { room, yStore, yDoc } = setupConnection;
    setStoreWithStatus({ status: "loading" });

    const unsubs: (() => void)[] = [];

    function handleSync() {
      // 1.
      // Connect store to yjs store and vis versa, for both the document and awareness

      /* -------------------- Document -------------------- */

      function syncStoreChangesToYjsDoc({ changes }: HistoryEntry<TLRecord>) {
        yDoc.transact(() => {
          console.log("syncStoreChangesToYjsDoc", changes);
          Object.values(changes.added).forEach((record) => {
            yStore.set(record.id, record);
          });

          Object.values(changes.updated).forEach(([, record]) => {
            yStore.set(record.id, record);
          });

          Object.values(changes.removed).forEach((record) => {
            yStore.delete(record.id);
          });
        });
      } // only sync user's document changes

      // Sync store changes to the yjs doc
      unsubs.push(
        store.listen(debounce(syncStoreChangesToYjsDoc, 100), {
          source: "user",
        }),
      );

      // Sync the yjs doc changes to the store
      const handleChange = (
        changes: Map<
          string,
          | { action: "delete"; oldValue: TLRecord }
          | { action: "update"; oldValue: TLRecord; newValue: TLRecord }
          | { action: "add"; newValue: TLRecord }
        >,
        transaction: Y.Transaction,
      ) => {
        if (transaction.local) return;

        const toRemove: TLRecord["id"][] = [];
        const toPut: TLRecord[] = [];

        changes.forEach((change, id) => {
          switch (change.action) {
            case "add":
            case "update": {
              const record = yStore.get(id)!;
              toPut.push(record);
              break;
            }
            case "delete": {
              toRemove.push(id as TLRecord["id"]);
              break;
            }
          }
        });

        // put / remove the records in the store
        store.mergeRemoteChanges(() => {
          if (toRemove.length) store.remove(toRemove);
          if (toPut.length) store.put(toPut);
        });
      };

      yStore.on("change", handleChange);
      unsubs.push(() => yStore.off("change", handleChange));

      // 2.
      // Initialize the store with the yjs doc records—or, if the yjs doc
      // is empty, initialize the yjs doc with the default store records.
      if (yStore.yarray.length) {
        // Replace the store records with the yjs doc records
        transact(() => {
          // The records here should be compatible with what's in the store
          store.clear();
          const records = yStore.yarray.toJSON().map(({ val }) => val);
          store.put(records);
        });
      } else {
        // Create the initial store records
        // Sync the store records to the yjs doc
        yDoc.transact(() => {
          for (const record of store.allRecords()) {
            yStore.set(record.id, record);
          }
        });
      }

      setStoreWithStatus({
        store,
        status: "synced-remote",
        connectionStatus: "online",
      });
    }

    let hasConnectedBefore = false;

    function handleStatusChange({
      status,
    }: {
      status: "disconnected" | "connected";
    }) {
      // If we're disconnected, set the store status to 'synced-remote' and the connection status to 'offline'
      if (status === "disconnected") {
        setStoreWithStatus({
          store,
          status: "synced-remote",
          connectionStatus: "offline",
        });
        return;
      }

      room.off("synced", handleSync);

      if (status === "connected") {
        if (hasConnectedBefore) return;
        hasConnectedBefore = true;
        room.on("synced", handleSync);
        unsubs.push(() => room.off("synced", handleSync));
      }
    }

    room.on("status", handleStatusChange);
    unsubs.push(() => room.off("status", handleStatusChange));

    return () => {
      unsubs.forEach((fn) => fn());
      unsubs.length = 0;
    };
  }, [setupConnection, store]);

  return storeWithStatus;
}
