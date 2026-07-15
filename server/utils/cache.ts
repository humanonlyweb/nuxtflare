// Bust route-rule / cachedEventHandler caches after a mutation. Keys are the
// escaped pathname (`/api/notes` -> `apinotes`), and one prefix also covers
// `/api/notes/**`, so a stale GET doesn't outlive the write that changed it.
export async function invalidateCachedRoutes({
  keys,
  name = "cache",
}: {
  keys: string[];
  name?: string;
}): Promise<void> {
  const storage = useStorage(name);
  await Promise.all(
    keys.map(async (key) => {
      const cached = await storage.getKeys(`nitro:routes:${key}`);
      await Promise.all(cached.map((k) => storage.removeItem(k)));
    }),
  );
}
