import { PersistedClient, Persister } from "@tanstack/react-query-persist-client";

const DB_NAME = "fawe-query-cache";
const STORE_NAME = "tanstack-query";
const DB_VERSION = 2;
const CLIENT_KEY = "client";

const noopPersister: Persister = {
  persistClient: async () => {},
  restoreClient: async () => undefined,
  removeClient: async () => {},
};

const openDatabase = async (): Promise<IDBDatabase> => {
  return await new Promise((resolve, reject) => {
    const request = window.indexedDB.open(DB_NAME, DB_VERSION);

    request.onupgradeneeded = () => {
      const db = request.result;
      if (!db.objectStoreNames.contains(STORE_NAME)) {
        db.createObjectStore(STORE_NAME);
      }
    };

    request.onsuccess = () => resolve(request.result);
    request.onerror = () => reject(request.error);
  });
};

const putValue = async (db: IDBDatabase, key: string, value: unknown) => {
  await new Promise<void>((resolve, reject) => {
    const tx = db.transaction(STORE_NAME, "readwrite");
    const store = tx.objectStore(STORE_NAME);
    const request = store.put(value, key);

    request.onsuccess = () => resolve();
    request.onerror = () => reject(request.error);
  });
};

const getValue = async <T>(db: IDBDatabase, key: string): Promise<T | undefined> => {
  return await new Promise<T | undefined>((resolve, reject) => {
    const tx = db.transaction(STORE_NAME, "readonly");
    const store = tx.objectStore(STORE_NAME);
    const request = store.get(key);

    request.onsuccess = () => resolve(request.result as T | undefined);
    request.onerror = () => reject(request.error);
  });
};

const deleteValue = async (db: IDBDatabase, key: string) => {
  await new Promise<void>((resolve, reject) => {
    const tx = db.transaction(STORE_NAME, "readwrite");
    const store = tx.objectStore(STORE_NAME);
    const request = store.delete(key);

    request.onsuccess = () => resolve();
    request.onerror = () => reject(request.error);
  });
};

export const createQueryPersister = (): Persister => {
  if (typeof window === "undefined" || !("indexedDB" in window)) {
    return noopPersister;
  }

  return {
    persistClient: async (client: PersistedClient) => {
      try {
        const db = await openDatabase();
        await putValue(db, CLIENT_KEY, client);
      } catch (error) {
        console.error("Persist query cache failed:", error);
      }
    },

    restoreClient: async () => {
      try {
        const db = await openDatabase();
        return await getValue<PersistedClient>(db, CLIENT_KEY);
      } catch (error) {
        console.error("Restore query cache failed:", error);
        return undefined;
      }
    },

    removeClient: async () => {
      try {
        const db = await openDatabase();
        await deleteValue(db, CLIENT_KEY);
      } catch (error) {
        console.error("Remove query cache failed:", error);
      }
    },
  };
};

export const shouldDehydrateQuery = (query: any) => {
  const isSuccess = query.state.status === "success";
  const queryKey = query.queryKey as string[];
  const isManualManaged = queryKey.some((key) =>
    [
      "friendship",
      "conversations",
      "friendshipStatus",
      "unread-count",
      "users",
      "notifications-ui-state",
    ].includes(key),
  );

  return isSuccess && !isManualManaged;
};
