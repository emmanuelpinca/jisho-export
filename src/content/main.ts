import styles from "../global.css?inline";
import { findDefinition, findTitle } from "./utilities";

const style = document.createElement("style");
style.textContent = styles;
document.head.appendChild(style);

const handleClick = (
  type: string,
  payload: SavePayloadType
): Promise<boolean> => {
  return browser.runtime.sendMessage({
    type,
    payload,
  });
};

const renderButtonState = (button: HTMLButtonElement, saved: boolean) => {
  if (saved) {
    button.textContent = "Saved with Jisho Export 〇";
    button.onmouseenter = () => {
      button.textContent = "Remove from Jisho Export ×";
    };
    button.onmouseleave = () => {
      button.textContent = "Saved with Jisho Export 〇";
    };
  } else {
    button.textContent = "Save with Jisho Export ▸";
    button.onmouseenter = () => {
      button.textContent = "Save with Jisho Export ▸";
    };
    button.onmouseleave = () => {
      button.textContent = "Save with Jisho Export ▸";
    };
  }
};

const fetchData = async (payload: TitleType): Promise<StoredDataType> => {
  const res = await browser.runtime.sendMessage({
    type: "get",
    payload,
  });
  return res;
};

const init = async () => {
  try {
    const conceptCollection = document.body.getElementsByClassName(
      "concept_light clearfix"
    );

    for (const concept of conceptCollection) {
      const title = findTitle(concept);
      if (!title) continue;
      const data = await fetchData(title);

      const meaningCollection =
        concept.getElementsByClassName("meaning-wrapper");
      for (const meaning of meaningCollection) {
        const container = document.createElement("div");
        const button = document.createElement("button");

        const definition = findDefinition(meaning);

        if (definition == undefined) {
          continue;
        }

        let saved = false;

        if (data != undefined && data.meanings != undefined) {
          saved = data.meanings.includes(definition || "");
        }

        container.className = "w-full h-fit flex justify-end";
        button.className =
          "!text-link !text-xs !px-0 !pb-0 !pt-1 !bg-transparent opacity-30 hover:opacity-100 !underline";

        renderButtonState(button, saved);

        const payload: SavePayloadType = {
          text: title?.text || "",
          furigana: title?.furigana || "",
          meaning: definition || "",
        };

        button.onclick = async () => {
          let res;

          if (saved) {
            res = await handleClick("unsave", payload);
          } else {
            res = await handleClick("save", payload);
          }

          if (res) {
            saved = !saved;
            renderButtonState(button, saved);
          }
        };

        container.appendChild(button);
        meaning.appendChild(container);
      }
    }
  } catch (error) {
    console.log(error);
  }
};

init();
