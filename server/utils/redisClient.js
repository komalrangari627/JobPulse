import dotenv from "dotenv";
dotenv.config({ path: "./config.env" });

// === In-memory mock Redis ===
const memoryStore = new Map();

/** Set key with TTL */
export async function setTempData(key, value, ttl = 300) {
  memoryStore.set(key, value);
  console.log(` [MOCK REDIS] ${key} = ${value} (expires in ${ttl}s)`);

  setTimeout(() => {
    memoryStore.delete(key);
    console.log(` [MOCK REDIS] Expired: ${key}`);
  }, ttl * 1000);
}

/** Get key */
export async function getTempData(key) {
  return memoryStore.get(key) || null;
}

/** Delete key */
export async function deleteTempData(key) {
  memoryStore.delete(key);
}

/** Fake client for compatibility */
export const redisClient = {
  isMock: true,
  connect: async () => console.log(" Using in-memory Redis mock (no real Redis server)."),
  setEx: async (key, ttl, value) => setTempData(key, value, ttl),
  get: async (key) => getTempData(key),
  del: async (key) => deleteTempData(key),
};

// initialize
await redisClient.connect();
