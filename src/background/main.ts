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

const unsaveDataRow = async (msg: { payload: TitleType }) => {
  const payload: TitleType = msg.payload;
  await browser.storage.local.remove(`${payload.text}${payload.furigana}`);
};

const broadcastRerenderToOtherTabs = async (senderId: number | undefined) => {
  try {
    const tabs = await browser.tabs.query({});
    for (const tab of tabs) {
      if (!tab?.id || tab.id === senderId) continue;

      browser.tabs.sendMessage(tab.id, { type: "rerender" });
    }
  } catch (error) {
    console.log(error);
  }
};

browser.runtime.onMessage.addListener(async (msg, sender) => {
  switch (msg.type) {
    case "getall":
      return getAllData();
    case "get":
      return getData(msg);
    case "save":
      saveData(msg);
      broadcastRerenderToOtherTabs(sender.tab?.id);
      return true;
    case "unsave":
      unsaveData(msg);
      broadcastRerenderToOtherTabs(sender.tab?.id);
      return true;
    case "unsaverow":
      unsaveDataRow(msg);
      broadcastRerenderToOtherTabs(sender.tab?.id);
      return true;
    default:
      return true;
  }
});
