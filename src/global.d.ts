/// <reference types="firefox-webext-browser" />

declare global {
  type TitleType = {
    text: string;
    furigana: string;
  };

  type SavePayloadType = {
    text: string;
    furigana: string;
    meaning: string;
  };
}

export {};
