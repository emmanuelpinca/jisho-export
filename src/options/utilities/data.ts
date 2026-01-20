export const fetchAllData = async () => {
  const items = [];

  const storedData: Record<string, StoredDataType> =
    await browser.storage.local.get();

  for (const value of Object.values(storedData)) {
    items.push(value);
  }

  return items;
};
