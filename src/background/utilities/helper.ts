const extRuntime = globalThis.browser ?? globalThis.chrome;

export const fetchFormattedData = async (payload: SavePayloadType) => {
  const storedData: StoredDataType = (
    await extRuntime.storage.local.get(`${payload.text}${payload.furigana}`)
  )[`${payload.text}${payload.furigana}`];

  return {
    text: payload.text,
    furigana: payload.furigana,
    meanings: storedData != undefined ? storedData.meanings : [],
  };
};
