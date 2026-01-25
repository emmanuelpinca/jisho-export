const extRuntime = globalThis.browser ?? globalThis.chrome;

export const fetchData = async (
  payload: TitleType,
): Promise<StoredDataType> => {
  const storedData: StoredDataType = (
    await extRuntime.storage.local.get(`${payload.text}${payload.furigana}`)
  )[`${payload.text}${payload.furigana}`];

  const res = {
    text: payload.text,
    furigana: payload.furigana,
    meanings: storedData != undefined ? storedData.meanings : [],
  };

  return res;
};

export const updateData = async (type: string, payload: SavePayloadType) => {
  await extRuntime.runtime.sendMessage({
    type,
    payload,
  });
};
