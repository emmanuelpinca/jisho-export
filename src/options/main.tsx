import "../global.css";

import React, { useEffect, useState } from "react";
import ReactDOM from "react-dom/client";
import { Button } from "./components";
import { exportData, formatData } from "./utilities";

function Options() {
  const [data, setData] = useState<StoredDataType[]>([]);
  const [theme, setTheme] = useState<"light" | "dark" | "auto">("auto");

  const handleExport = async () => {
    const data = await browser.storage.local.get();
    const formattedData = formatData(Object.values(data));
    exportData("jisho-output.csv", formattedData);
  };

  const handleClear = async () => {
    await browser.runtime.sendMessage({ type: "unsaveall" });
    setData([]);
  };

  const handleDeleteItem = async (payload: SavePayloadType) => {
    await browser.runtime.sendMessage({ type: "unsave", payload });
    setData((items) => {
      items = items.map((item) =>
        item.text === payload.text && item.furigana === payload.furigana
          ? {
              text: item.text,
              furigana: item.furigana,
              meanings: (item.meanings = item.meanings.filter(
                (meaning) => meaning != payload.meaning
              )),
            }
          : item
      );

      items = items.filter((item) => item.meanings.length > 0);

      return items;
    });
  };

  const handleDeleteRow = async (payload: TitleType) => {
    await browser.runtime.sendMessage({ type: "unsaverow", payload });

    setData((items) =>
      items.filter(
        (item) =>
          item.text !== payload.text && item.furigana !== payload.furigana
      )
    );
  };

  const fetchData = async () => {
    const newData = await browser.runtime.sendMessage({ type: "getall" });
    setData(newData);
  };

  const handleMessage = async (msg: { type: string }) => {
    if (msg.type === "rerender") {
      await fetchData();
    }
  };

  const updateTheme = async () => {
    const cookie = await browser.cookies.get({
      url: "https://jisho.org/",
      name: "ct",
    });

    if (
      cookie != null &&
      (cookie.value === "light" || cookie.value === "dark")
    ) {
      setTheme(cookie.value);
    } else {
      setTheme("auto");
    }
  };

  useEffect(() => {
    fetchData();
    updateTheme();
    browser.runtime.onMessage.addListener(handleMessage);
    browser.cookies.onChanged.addListener(updateTheme);

    return () => {
      browser.runtime.onMessage.removeListener(handleMessage);
      browser.cookies.onChanged.removeListener(updateTheme);
    };
  }, []);

  return (
    <div
      data-color-theme={theme}
      className="w-full min-h-screen py-24 px-48 bg-background flex flex-col"
    >
      <header className="flex flex-row items-center justify-between py-4 shrink-0">
        <h1 className="w-fit h-fit font-bold text-4xl text-logo tracking-tighter">
          jishoExport
        </h1>
        <div className="w-fit h-fit flex flex-row items-center justify-center space-x-4">
          <Button onClick={handleExport} label="Export" />
          <Button onClick={handleClear} label="Clear" />
        </div>
      </header>
      <div className="w-full flex-1 bg-editor rounded-md p-4 text-primary overflow-y-auto">
        <table className="w-full border border-collapse border-secondary">
          <thead>
            <tr>
              <th className="border border-secondary px-4 py-2">Word</th>
              <th className="border border-secondary px-4 py-2">Furigana</th>
              <th className="border border-secondary px-4 py-2">Meaning</th>
            </tr>
          </thead>
          <tbody>
            {data.map((item, i) => (
              <tr key={i}>
                <td className="border border-secondary px-4 py-2 group">
                  <div className="flex items-center gap-2">
                    <span className="flex-1 truncate">{item.text}</span>
                    <button
                      className="opacity-0 group-hover:opacity-100 transition-opacity hover:cursor-pointer"
                      onClick={() =>
                        handleDeleteRow({
                          text: item.text,
                          furigana: item.furigana,
                        })
                      }
                    >
                      ×
                    </button>
                  </div>
                </td>
                <td className="w-42 border border-secondary px-4 py-2">
                  {item.furigana}
                </td>
                <td className="grow w-full space-x-2 border border-secondary px-4 py-2">
                  {item.meanings.map((meaning, j) => (
                    <div
                      key={`${i}${j}`}
                      className="inline-flex items-center group"
                    >
                      <span className="group-hover:underline">{meaning}</span>
                      <button
                        className="opacity-0 group-hover:opacity-100 ml-1 transition-opacity hover:cursor-pointer"
                        onClick={() =>
                          handleDeleteItem({
                            text: item.text,
                            furigana: item.furigana,
                            meaning,
                          })
                        }
                      >
                        ×
                      </button>
                      <span>&nbsp;</span>
                    </div>
                  ))}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <div className="flex flex-row space-x-1 text-secondary py-4">
        <p>Jisho Export by</p>
        <a
          className="text-link hover:text-primary underline"
          href="https://github.com/emmanuelpinca"
        >
          Emmanuel Pinca
        </a>
      </div>
    </div>
  );
}

ReactDOM.createRoot(document.getElementById("root")!).render(
  <React.StrictMode>
    <Options />
  </React.StrictMode>
);
