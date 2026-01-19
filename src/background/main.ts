const data = new Map<string, StoredDataType>();

const getAllData = async () => {
  const items = [];

  const storedData: Record<string, StoredDataType> =
    await browser.storage.local.get();

  for (const [key, value] of Object.entries(storedData)) {
    data.set(key, value);
    items.push(value);
  }

  return items;
};

const getData = async (payload: TitleType) => {
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

const saveData = async (payload: SavePayloadType) => {
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

const unsaveData = async (payload: SavePayloadType) => {
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

const unsaveDataRow = async (payload: TitleType) => {
  data.delete(`${payload.text}${payload.furigana}`);
  await browser.storage.local.remove(`${payload.text}${payload.furigana}`);
};

const unsaveAll = async () => {
  data.clear();
  await browser.storage.local.clear();
};

browser.runtime.onMessage.addListener((msg) => {
  return (async () => {
    try {
      switch (msg?.type) {
        case "getall":
          return await getAllData();

        case "get":
          return await getData(msg.payload);

        case "save":
          await saveData(msg.payload);
          return { ok: true };

        case "unsave":
          await unsaveData(msg.payload);
          return { ok: true };

        case "unsaverow":
          await unsaveDataRow(msg.payload);
          return { ok: true };

        case "unsaveall":
          await unsaveAll();
          return { ok: true };

        default:
          return { ok: false, error: `Unknown type: ${String(msg?.type)}` };
      }
    } catch (e) {
      return { ok: false, error: e instanceof Error ? e.message : String(e) };
    }
  })();
});
