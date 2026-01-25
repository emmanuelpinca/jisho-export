/// <reference types="firefox-webext-browser" />
/// <reference types="chrome" />

declare global {
  type StoredDataType = {
    text: string;
    furigana: string;
    meanings: string[];
  };

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
