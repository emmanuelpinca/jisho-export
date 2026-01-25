import { fetchFormattedData } from "./utilities";

const extRuntime = globalThis.browser ?? globalThis.chrome;

const saveData = async (payload: SavePayloadType) => {
  const data = await fetchFormattedData(payload);

  data.meanings = data.meanings.filter((meaning) => meaning != payload.meaning);
  data.meanings.push(payload.meaning);

  await extRuntime.storage.local.set({
    [`${payload.text}${payload.furigana}`]: data,
  });
};

const unsaveData = async (payload: SavePayloadType) => {
  const data = await fetchFormattedData(payload);

  data.meanings = data.meanings.filter((meaning) => meaning != payload.meaning);

  if (data.meanings.length == 0) {
    await extRuntime.storage.local.remove(`${payload.text}${payload.furigana}`);
  } else {
    await extRuntime.storage.local.set({
      [`${payload.text}${payload.furigana}`]: data,
    });
  }
};

const unsaveDataRow = async (payload: TitleType) => {
  await extRuntime.storage.local.remove(`${payload.text}${payload.furigana}`);
};

const unsaveAll = async () => {
  await extRuntime.storage.local.clear();
};

extRuntime.runtime.onMessage.addListener((msg) => {
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
