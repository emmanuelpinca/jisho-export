import styles from "../global.css?inline";
import { findDefinition, findTitle } from "./utilities";

const style = document.createElement("style");
style.textContent = styles;
document.head.appendChild(style);

const handleClick = (payload: SavePayloadType) => {
  browser.runtime.sendMessage({
    type: "save",
    payload,
  });
};

const conceptCollection = document.body.getElementsByClassName(
  "concept_light clearfix"
);

for (const concept of conceptCollection) {
  const title = findTitle(concept);

  const meaningCollection = concept.getElementsByClassName("meaning-wrapper");
  for (const meaning of meaningCollection) {
    const container = document.createElement("div");
    const button = document.createElement("button");

    container.className = "w-full h-fit flex justify-end";
    button.className =
      "!text-link !text-xs !px-0 !pb-0 !pt-1 !bg-transparent opacity-30 hover:opacity-100 !underline";
    button.textContent = "Save with Jisho Export ▸";

    const definition = findDefinition(meaning);

    const payload: SavePayloadType = {
      text: title?.text || "",
      furigana: title?.furigana || "",
      meaning: definition || "",
    };

    button.onclick = () => handleClick(payload);

    container.appendChild(button);
    meaning.appendChild(container);
  }
}
