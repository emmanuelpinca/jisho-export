import "../global.css";

import React, { useEffect, useState } from "react";
import ReactDOM from "react-dom/client";
import { Button } from "./components";

function Popup() {
  const [theme, setTheme] = useState<"light" | "dark" | "auto">("auto");

  const handleView = () => {
    browser.runtime.openOptionsPage();
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
    updateTheme();
    browser.cookies.onChanged.addListener(updateTheme);

    return () => {
      browser.cookies.onChanged.removeListener(updateTheme);
    };
  }, []);

  return (
    <div
      data-color-theme={theme}
      className={[
        "w-fit h-fit p-4 flex flex-col items-center justify-center space-y-2",
        "bg-background",
      ].join(" ")}
    >
      <span className="font-bold text-4xl text-logo tracking-tighter">
        jishoExport
      </span>
      <div
        className={[
          "w-full h-fit",
          "flex flex-row items-center justify-center space-x-1 text-primary",
        ].join(" ")}
      >
        <Button onClick={handleView} label="View definitions" />
      </div>
    </div>
  );
}

ReactDOM.createRoot(document.getElementById("root")!).render(
  <React.StrictMode>
    <Popup />
  </React.StrictMode>
);
