import { TLRecord, TLStore } from "@tldraw/tldraw";
import { Doc } from "yjs"; // Import types from Y.js

// Assuming an interface for YKeyValue since it's not a standard Y.js type and might be custom or from a utility library
interface YKeyValue<T> {
  set(key: string, value: T): void;
  delete(key: string): void;
  get(key: string): T | undefined;
  on(
    event: string,
    callback: (
      changes: Map<TLRecord["id"], { action: "add" | "update" | "delete" }>,
      transaction: { local: boolean },
    ) => void,
  ): void;
  off(
    event: string,
    callback: (
      changes: Map<TLRecord["id"], { action: "add" | "update" | "delete" }>,
      transaction: { local: boolean },
    ) => void,
  ): void;
}

export const setupYjsDocument = (
  yDoc: Doc,
  yStore: YKeyValue<TLRecord>,
  store: TLStore,
): (() => void) => {
  const unsubs: (() => void)[] = [];

  const syncStoreToYjs = (): void => {
    const unsubscribe = store.listen(
      ({ changes }) => {
        yDoc.transact(() => {
          Object.values(changes.added).forEach((record) =>
            yStore.set(record.id, record),
          );
          Object.values(changes.updated).forEach(([, record]) =>
            yStore.set(record.id, record),
          );
          Object.values(changes.removed).forEach((record) =>
            yStore.delete(record.id),
          );
        });
      },
      { source: "user", scope: "document" },
    );
    unsubs.push(unsubscribe);
  };

  const syncYjsToStore = (): void => {
    const handleChange = (
      changes: Map<TLRecord["id"], { action: "add" | "update" | "delete" }>,
      transaction: { local: boolean },
    ): void => {
      // Replace `any` with specific types if available
      if (transaction.local) return;

      const toRemove: TLRecord["id"][] = [];
      const toPut: TLRecord[] = [];

      changes.forEach((change, id) => {
        if (change.action === "delete") {
          toRemove.push(id);
        } else {
          const record = yStore.get(id);
          if (record) toPut.push(record);
        }
      });

      store.mergeRemoteChanges(() => {
        if (toRemove.length) store.remove(toRemove);
        if (toPut.length) store.put(toPut);
      });
    };

    yStore.on("change", handleChange);
    unsubs.push(() => yStore.off("change", handleChange));
  };

  syncStoreToYjs();
  syncYjsToStore();

  return () => unsubs.forEach((unsubscribe) => unsubscribe());
};
