import styles from "../global.css?inline";

const style = document.createElement("style");
style.textContent = styles;
document.head.appendChild(style);

const meaningCollection =
  document.body.getElementsByClassName("meaning-wrapper");

for (const meaning of meaningCollection) {
  const container = document.createElement("div");
  const button = document.createElement("button");

  container.className = "w-full h-fit flex justify-end";
  button.className =
    "!text-link !text-xs !px-0 !pb-0 !pt-1 !bg-transparent opacity-30 hover:opacity-100 !underline";
  button.textContent = "Save with Jisho Export ▸";

  container.appendChild(button);
  meaning.appendChild(container);
}
