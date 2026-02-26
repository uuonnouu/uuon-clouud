const DB_NAME = "clouud-crystal";
const DB_VERSION = 1;
const STORE_NAME = "state";

let dbPromise: Promise<IDBDatabase> | null = null;

function openDB(): Promise<IDBDatabase> {
  if (dbPromise) return dbPromise;
  dbPromise = new Promise((resolve, reject) => {
    const request = indexedDB.open(DB_NAME, DB_VERSION);
    request.onupgradeneeded = () => {
      const db = request.result;
      if (!db.objectStoreNames.contains(STORE_NAME)) {
        db.createObjectStore(STORE_NAME);
      }
    };
    request.onsuccess = () => resolve(request.result);
    request.onerror = () => reject(request.error);
  });
  return dbPromise;
}

export async function crystalGet<T>(key: string, fallback: T): Promise<T> {
  try {
    const db = await openDB();
    return new Promise((resolve) => {
      const tx = db.transaction(STORE_NAME, "readonly");
      const store = tx.objectStore(STORE_NAME);
      const req = store.get(key);
      req.onsuccess = () => resolve(req.result !== undefined ? req.result : fallback);
      req.onerror = () => resolve(fallback);
    });
  } catch {
    return fallback;
  }
}

export async function crystalSet(key: string, value: any): Promise<void> {
  try {
    const db = await openDB();
    return new Promise((resolve, reject) => {
      const tx = db.transaction(STORE_NAME, "readwrite");
      const store = tx.objectStore(STORE_NAME);
      store.put(value, key);
      tx.oncomplete = () => resolve();
      tx.onerror = () => reject(tx.error);
    });
  } catch {}
}

export async function crystalIncrement(key: string): Promise<number> {
  const current = await crystalGet<number>(key, 0);
  const next = current + 1;
  await crystalSet(key, next);
  return next;
}

export function crystalGetSync<T>(key: string, fallback: T): T {
  try {
    const val = localStorage.getItem(`crystal-${key}`);
    if (val === null) return fallback;
    return JSON.parse(val) as T;
  } catch {
    return fallback;
  }
}

export function crystalSetSync(key: string, value: any): void {
  try {
    localStorage.setItem(`crystal-${key}`, JSON.stringify(value));
  } catch {}
}

export async function migrateFromLocalStorage(keys: string[]): Promise<void> {
  for (const key of keys) {
    const val = localStorage.getItem(key);
    if (val !== null) {
      await crystalSet(key, val);
      localStorage.removeItem(key);
    }
  }
}
