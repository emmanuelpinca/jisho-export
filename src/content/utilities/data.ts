export const fetchData = async (
  payload: TitleType,
): Promise<StoredDataType> => {
  const storedData: StoredDataType = (
    await browser.storage.local.get(`${payload.text}${payload.furigana}`)
  )[`${payload.text}${payload.furigana}`];

  const res = {
    text: payload.text,
    furigana: payload.furigana,
    meanings: storedData != undefined ? storedData.meanings : [],
  };

  return res;
};

export const updateData = async (type: string, payload: SavePayloadType) => {
  await browser.runtime.sendMessage({
    type,
    payload,
  });
};
