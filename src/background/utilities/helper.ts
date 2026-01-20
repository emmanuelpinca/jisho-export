export const fetchFormattedData = async (payload: SavePayloadType) => {
  const storedData: StoredDataType = (
    await browser.storage.local.get(`${payload.text}${payload.furigana}`)
  )[`${payload.text}${payload.furigana}`];

  return {
    text: payload.text,
    furigana: payload.furigana,
    meanings: storedData != undefined ? storedData.meanings : [],
  };
};
