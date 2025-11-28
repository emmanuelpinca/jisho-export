import "../global.css";

import React from "react";
import ReactDOM from "react-dom/client";
import { Button } from "./components";
import { exportData, formatData } from "./utilities";

function Popup() {
  const handleView = () => {};

  const handleExport = async () => {
    const data = await browser.storage.local.get();
    const formattedData = formatData(Object.values(data));
    exportData("jisho-output.csv", formattedData);
  };

  const handleClear = async () => {
    const tabs = await browser.tabs.query({});

    await browser.storage.local.clear();

    for (const tab of tabs) {
      if (!tab?.id) continue;

      browser.tabs.sendMessage(tab.id, {
        type: "rerender",
      });
    }
  };

  return (
    <div
      className={[
        "w-fit h-fit p-4 flex flex-col items-center justify-center space-y-2",
        "bg-background border border-secondary",
      ].join(" ")}
    >
      <span className="font-bold text-primary">Jisho Export</span>
      <div
        className={[
          "w-full h-fit",
          "flex flex-col items-center justify-center space-y-1",
        ].join(" ")}
      >
        <Button onClick={handleView}>
          <svg
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            strokeWidth={1.5}
            stroke="currentColor"
            className="size-3"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="m21 21-5.197-5.197m0 0A7.5 7.5 0 1 0 5.196 5.196a7.5 7.5 0 0 0 10.607 10.607Z"
            />
          </svg>
          <p>View</p>
        </Button>
        <Button onClick={handleExport}>
          <svg
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            strokeWidth={1.5}
            stroke="currentColor"
            className="size-3"
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
            className="size-3"
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
    </div>
  );
}

ReactDOM.createRoot(document.getElementById("root")!).render(
  <React.StrictMode>
    <Popup />
  </React.StrictMode>
);
