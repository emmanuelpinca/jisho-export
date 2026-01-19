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
        <h1 className="w-fit h-fit text-3xl text-secondary font-bold">
          Jisho Export
        </h1>
        <div className="w-fit h-fit flex flex-row items-center justify-center space-x-4">
          <Button onClick={handleExport}>
            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              strokeWidth={1.5}
              stroke="currentColor"
              className="size-6"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M3 16.5v2.25A2.25 2.25 0 0 0 5.25 21h13.5A2.25 2.25 0 0 0 21 18.75V16.5M16.5 12 12 16.5m0 0L7.5 12m4.5 4.5V3"
              />
            </svg>
            <p>Export</p>
          </Button>
          <Button onClick={handleClear}>
            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              strokeWidth={1.5}
              stroke="currentColor"
              className="size-6"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="m14.74 9-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 0 1-2.244 2.077H8.084a2.25 2.25 0 0 1-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 0 0-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 0 1 3.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 0 0-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 0 0-7.5 0"
              />
            </svg>
            <p>Clear</p>
          </Button>
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
    </div>
  );
}

ReactDOM.createRoot(document.getElementById("root")!).render(
  <React.StrictMode>
    <Options />
  </React.StrictMode>
);
