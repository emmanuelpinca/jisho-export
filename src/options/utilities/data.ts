const extRuntime = globalThis.browser ?? globalThis.chrome;

export const fetchAllData = async () => {
  const items = [];

  const storedData: Record<string, StoredDataType> =
    await extRuntime.storage.local.get();

  for (const value of Object.values(storedData)) {
    items.push(value);
  }

  return items;
};
