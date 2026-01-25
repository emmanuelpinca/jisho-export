import styles from "../global.css?inline";
import type { Renderer, RootState, Selector, Subscriber } from "./types";
import { fetchData, findDefinition, findTitle, updateData } from "./utilities";

const extRuntime = globalThis.browser ?? globalThis.chrome;

const style = document.createElement("style");
style.textContent = styles;
document.head.appendChild(style);

const buttonCollection = new Map<SavePayloadType, HTMLButtonElement>();

let state: RootState = 0;
const subs = new Set<Subscriber<unknown>>();

const subscribe = <S>(
  select: Selector<S>,
  render: Renderer<S>,
): (() => void) => {
  const sub: Subscriber<S> = { select, render };

  subs.add(sub as Subscriber<unknown>);

  const next = select(state);
  sub.prev = next;
  render(next, undefined);

  return () => {
    subs.delete(sub as Subscriber<unknown>);
  };
};

const notify = (nextState: RootState) => {
  state = nextState;

  for (const sub of subs) {
    const next = sub.select(state);

    if (Object.is(next, sub.prev)) continue;

    const prev = sub.prev;
    sub.prev = next;
    sub.render(next, prev);
  }
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

const clearInjectedUI = () => {
  const injectedCollection = document.body.getElementsByClassName(
    "jisho-export w-full h-fit flex justify-end",
  );

  while (injectedCollection.length > 0) {
    injectedCollection[0].parentNode?.removeChild(injectedCollection[0]);
  }
};

const init = () => {
  const concepts = document.querySelectorAll<HTMLElement>(
    ".concept_light.clearfix",
  );

  for (const concept of concepts) {
    const title = findTitle(concept);
    if (!title) continue;

    const meanings = concept.querySelectorAll<HTMLElement>(".meaning-wrapper");
    for (const meaning of meanings) {
      const definition = findDefinition(meaning);
      if (!definition) continue;

      const container = document.createElement("div");
      const button = document.createElement("button");

      container.className = "jisho-export w-full h-fit flex justify-end";
      button.className =
        "!text-link !text-xs !px-0 !pb-0 !pt-1 !bg-transparent opacity-30 hover:opacity-100 !underline";

      renderButtonState(button, false);

      container.appendChild(button);
      meaning.appendChild(container);

      const payload: SavePayloadType = {
        text: title.text || "",
        furigana: title.furigana || "",
        meaning: definition || "",
      };

      buttonCollection.set(payload, button);
    }
  }
};

const hydrate = async () => {
  for (const [key, button] of buttonCollection) {
    const title: TitleType = { text: key.text, furigana: key.furigana };

    let saved = false;

    button.onclick = async () => {
      if (saved) {
        await updateData("unsave", key);
      } else {
        await updateData("save", key);
      }
    };

    let lastSaved = saved;
    let running = false;

    subscribe(
      (tick) => tick,

      async () => {
        if (running) return;
        running = true;
        try {
          const data = await fetchData(title);

          const nextSaved =
            data?.meanings?.includes(key.meaning || "") ?? false;

          if (nextSaved === lastSaved) return;

          lastSaved = nextSaved;
          saved = nextSaved;

          renderButtonState(button, saved);
        } finally {
          running = false;
        }
      },
    );
  }
};

extRuntime.storage.onChanged.addListener(() => {
  notify(state + 1);
});

clearInjectedUI();
init();
hydrate();
