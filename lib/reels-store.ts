// lib/reels-store.ts
// Client-side localStorage store for the reels list prototype.

export interface StoredReel {
  id:     string;
  name:   string;
  brand:  string;
  sku:    string;
  serial: string;
  image:  string;
}

const KEY = "prototype_reels";

const SEED: StoredReel[] = [
  {
    id:     "r1",
    name:   "PERFORMANCE STATIC 10.0m-200 m",
    brand:  "Edelrid",
    sku:    "832042000470",
    serial: "132241154A",
    image:  "/edelrid-performance-static-10.0-mm-rope.webp",
  },
  {
    id:     "r2",
    name:   'Braided Safety Blue 12.7mm 1/2" 182m HiVee',
    brand:  "Teufelberger",
    sku:    "C3250-16-00600",
    serial: "593-4890",
    image:  "/Braided Safety Blue.webp",
  },
  {
    id:     "r3",
    name:   'Braided Safety Blue 12.7mm 1/2" 365m HiVee',
    brand:  "Teufelberger",
    sku:    "C3250-16-01200",
    serial: "593-4847",
    image:  "/Braided Safety Blue.webp",
  },
  {
    id:     "r4",
    name:   'Braided Safety Blue 12.7mm 1/2" 365m HiVee',
    brand:  "Teufelberger",
    sku:    "C3250-16-01200",
    serial: "593-4852",
    image:  "/Braided Safety Blue.webp",
  },
];

export function getReels(): StoredReel[] {
  if (typeof window === "undefined") return SEED;
  try {
    const raw = localStorage.getItem(KEY);
    if (!raw) return SEED;
    return JSON.parse(raw) as StoredReel[];
  } catch {
    return SEED;
  }
}

export function addReel(reel: StoredReel): void {
  const current = getReels();
  localStorage.setItem(KEY, JSON.stringify([reel, ...current]));
}

export function resetReels(): void {
  localStorage.removeItem(KEY);
}
