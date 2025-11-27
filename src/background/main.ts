const data = new Map<string, StoredDataType>();

const getData = async (msg: { payload: TitleType }) => {
  const payload: TitleType = msg.payload;

  const storedData: StoredDataType = (
    await browser.storage.local.get(`${payload.text}${payload.furigana}`)
  )[`${payload.text}${payload.furigana}`];

  const res = {
    text: payload.text,
    furigana: payload.furigana,
    meanings: storedData != undefined ? storedData.meanings : [],
  };
  data.set(`${payload.text}${payload.furigana}`, res);
  return res;
};

const saveData = async (msg: { payload: SavePayloadType }) => {
  const payload: SavePayloadType = msg.payload;

  const curr = data.get(`${payload.text}${payload.furigana}`) ?? {
    text: payload.text,
    furigana: payload.furigana,
    meanings: [],
  };

  curr.meanings = curr.meanings.filter((meaning) => meaning != payload.meaning);
  curr.meanings.push(payload.meaning);

  data.set(`${payload.text}${payload.furigana}`, curr);
  await browser.storage.local.set({
    [`${payload.text}${payload.furigana}`]: curr,
  });
};

const unsaveData = async (msg: { payload: SavePayloadType }) => {
  const payload: SavePayloadType = msg.payload;

  const curr = data.get(`${payload.text}${payload.furigana}`) ?? {
    text: payload.text,
    furigana: payload.furigana,
    meanings: [],
  };

  curr.meanings = curr.meanings.filter((meaning) => meaning != payload.meaning);
  data.set(`${payload.text}${payload.furigana}`, curr);

  if (curr.meanings.length == 0) {
    await browser.storage.local.remove(`${payload.text}${payload.furigana}`);
  } else {
    await browser.storage.local.set({
      [`${payload.text}${payload.furigana}`]: curr,
    });
  }
};

browser.runtime.onMessage.addListener(async (msg) => {
  switch (msg.type) {
    case "get":
      return getData(msg);
    case "save":
      saveData(msg);
      return true;
    case "unsave":
      unsaveData(msg);
      return true;
    default:
      return true;
  }
});
