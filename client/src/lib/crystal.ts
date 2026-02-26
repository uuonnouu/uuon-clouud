const CRYSTAL_DB_NAME    = "uuon_gcentric";
const CRYSTAL_DB_VERSION = 1;
const CRYSTAL_STORE      = "crystal";
const CRYSTAL_KEY        = "device_crystal";

export interface Crystal {
  crystalId: string;
  firstContact: string;
  lastSession: string;
  sessionCount: number;
  ownerVerified: boolean;
  introShown: boolean;
  tier: "founder" | "user";
  latticeAnchor: number;
  notes: string;
}

function openCrystalDB(): Promise<IDBDatabase> {
  return new Promise((resolve, reject) => {
    const request = indexedDB.open(CRYSTAL_DB_NAME, CRYSTAL_DB_VERSION);

    request.onupgradeneeded = (event) => {
      const db = (event.target as IDBOpenDBRequest).result;
      if (!db.objectStoreNames.contains(CRYSTAL_STORE)) {
        db.createObjectStore(CRYSTAL_STORE, { keyPath: "key" });
      }
    };

    request.onsuccess = () => resolve(request.result);
    request.onerror  = () => reject(request.error);
  });
}

function generateCrystalId(): string {
  const timestamp = Date.now().toString(36);
  const random    = Math.random().toString(36).slice(2, 10);
  const random2   = Math.random().toString(36).slice(2, 10);
  return `☧-${timestamp}-${random}-${random2}`;
}

function deriveLatticeAnchor(crystalId: string): number {
  let hash = 0;
  for (let i = 0; i < crystalId.length; i++) {
    hash = ((hash << 5) - hash) + crystalId.charCodeAt(i);
    hash |= 0;
  }
  return (Math.abs(hash) % 33) + 1;
}

export async function plantCrystal(
  overrides: Partial<Crystal> = {}
): Promise<Crystal> {
  const db  = await openCrystalDB();
  const id  = generateCrystalId();
  const now = new Date().toISOString();

  const crystal: Crystal = {
    crystalId:     id,
    firstContact:  now,
    lastSession:   now,
    sessionCount:  1,
    ownerVerified: false,
    introShown:    false,
    tier:          "user",
    latticeAnchor: deriveLatticeAnchor(id),
    notes:         "",
    ...overrides,
  };

  return new Promise((resolve, reject) => {
    const tx      = db.transaction(CRYSTAL_STORE, "readwrite");
    const store   = tx.objectStore(CRYSTAL_STORE);
    const request = store.put({ key: CRYSTAL_KEY, ...crystal });

    request.onsuccess = () => resolve(crystal);
    request.onerror   = () => reject(request.error);
  });
}

export async function getCrystal(): Promise<Crystal | null> {
  try {
    const db = await openCrystalDB();

    return new Promise((resolve, reject) => {
      const tx      = db.transaction(CRYSTAL_STORE, "readonly");
      const store   = tx.objectStore(CRYSTAL_STORE);
      const request = store.get(CRYSTAL_KEY);

      request.onsuccess = () => {
        const result = request.result;
        resolve(result ? { ...result, key: undefined } as Crystal : null);
      };
      request.onerror = () => reject(request.error);
    });
  } catch {
    return null;
  }
}

export async function updateCrystal(
  updates: Partial<Crystal>
): Promise<Crystal | null> {
  const existing = await getCrystal();
  if (!existing) return null;

  const db  = await openCrystalDB();
  const now = new Date().toISOString();

  const updated: Crystal = {
    ...existing,
    ...updates,
    lastSession:  now,
    sessionCount: existing.sessionCount + (updates.sessionCount ? 0 : 1),
  };

  return new Promise((resolve, reject) => {
    const tx      = db.transaction(CRYSTAL_STORE, "readwrite");
    const store   = tx.objectStore(CRYSTAL_STORE);
    const request = store.put({ key: CRYSTAL_KEY, ...updated });

    request.onsuccess = () => resolve(updated);
    request.onerror   = () => reject(request.error);
  });
}

export async function getOrPlantCrystal(): Promise<{
  crystal: Crystal;
  isNew: boolean;
}> {
  const existing = await getCrystal();

  if (existing) {
    const updated = await updateCrystal({ lastSession: new Date().toISOString() });
    return { crystal: updated ?? existing, isNew: false };
  }

  const fresh = await plantCrystal();
  return { crystal: fresh, isNew: true };
}

export async function markIntroShown(): Promise<void> {
  await updateCrystal({ introShown: true });
}

export async function verifyOwner(): Promise<void> {
  await updateCrystal({ ownerVerified: true, tier: "founder" });
}

export async function destroyCrystal(): Promise<void> {
  const db = await openCrystalDB();

  return new Promise((resolve, reject) => {
    const tx      = db.transaction(CRYSTAL_STORE, "readwrite");
    const store   = tx.objectStore(CRYSTAL_STORE);
    const request = store.delete(CRYSTAL_KEY);

    request.onsuccess = () => resolve();
    request.onerror   = () => reject(request.error);
  });
}

export function crystalStatus(crystal: Crystal): string {
  const age = Math.floor(
    (Date.now() - new Date(crystal.firstContact).getTime()) / (1000 * 60 * 60 * 24)
  );
  return [
    `☧ Crystal: ${crystal.crystalId.slice(0, 20)}...`,
    `  Tier: ${crystal.tier}`,
    `  Age: ${age} days`,
    `  Sessions: ${crystal.sessionCount}`,
    `  Lattice anchor: position ${crystal.latticeAnchor}`,
    `  Owner: ${crystal.ownerVerified ? "verified" : "unverified"}`,
  ].join("\n");
}
