export const findDefinition = (meaning: Element): string | undefined => {
  const meaningCollection = meaning.getElementsByClassName("meaning-meaning");

  if (meaningCollection.length != 1) return;

  return meaningCollection[0].textContent;
};
