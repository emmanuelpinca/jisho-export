import { fetchFormattedData } from "./utilities";

const saveData = async (payload: SavePayloadType) => {
  const data = await fetchFormattedData(payload);

  data.meanings = data.meanings.filter((meaning) => meaning != payload.meaning);
  data.meanings.push(payload.meaning);

  await browser.storage.local.set({
    [`${payload.text}${payload.furigana}`]: data,
  });
};

const unsaveData = async (payload: SavePayloadType) => {
  const data = await fetchFormattedData(payload);

  data.meanings = data.meanings.filter((meaning) => meaning != payload.meaning);

  if (data.meanings.length == 0) {
    await browser.storage.local.remove(`${payload.text}${payload.furigana}`);
  } else {
    await browser.storage.local.set({
      [`${payload.text}${payload.furigana}`]: data,
    });
  }
};

const unsaveDataRow = async (payload: TitleType) => {
  await browser.storage.local.remove(`${payload.text}${payload.furigana}`);
};

const unsaveAll = async () => {
  await browser.storage.local.clear();
};

browser.runtime.onMessage.addListener((msg) => {
  return (async () => {
    try {
      switch (msg?.type) {
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
