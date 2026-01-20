export const findTitle = (concept: Element): TitleType | undefined => {
  const textCollection = concept.getElementsByClassName("text");

  if (textCollection.length != 1) {
    console.log("Invalid Text");
    return;
  }

  const wrapperCollection = concept.getElementsByClassName(
    "concept_light-wrapper  columns zero-padding",
  );

  if (wrapperCollection.length != 1) {
    console.log("Invalid Wrapper");
    return;
  }

  const furiganaCollection =
    wrapperCollection[0].getElementsByClassName("furigana");

  if (furiganaCollection.length != 1) {
    console.log("Invalid Furigana");
    return;
  }

  let textArr: string[] = [];
  let furiganaArr: string[] = [];

  for (const content of textCollection[0].childNodes) {
    const chr = content.textContent?.trim();
    if (chr != null && chr.length > 0) textArr.push(chr);
  }

  if (furiganaCollection[0].textContent.trim().length != 0) {
    for (const content of furiganaCollection[0].childNodes) {
      const chr = content.textContent;
      const trimmed = content.textContent?.trim();

      if (chr?.length != trimmed?.length) continue;

      if (chr?.length == 0) {
        furiganaArr.push(textArr[furiganaArr.length]);
      } else if (chr != null) {
        furiganaArr.push(chr);
      }
    }
  }

  return { text: textArr.join(""), furigana: furiganaArr.join("") };
};

export const findDefinition = (meaning: Element): string | undefined => {
  const meaningCollection = meaning.getElementsByClassName("meaning-meaning");

  if (meaningCollection.length != 1) return;

  return meaningCollection[0].textContent;
};
