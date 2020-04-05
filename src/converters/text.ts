namespace TextConverter {
  const isCode = (textElement: GoogleAppsScript.Document.Text) => textElement.getFontFamily() === 'Roboto Mono';
  const convertCode = (textElement: GoogleAppsScript.Document.Text) => '```\n' + textElement.getText() + '\n```'

  /**
   * Inserts a given character into an array of characters.
   *
   * @param arrayOfCharacters A string, represented as an array of characters.
   * @param position The start position at which to insert the character.
   * @param character The character to insert.
   * @param count How many times to insert the character.
   *
   * @returns The number of times the character was inserted.
   */
  const insertCharacter = (arrayOfCharacters: Array<string>, position: number, character: string, count: number = 1): number => {
    character.repeat(count).split("").forEach((character: string, index: number) => {
      arrayOfCharacters.splice(position + index, 0, character);
    });
    return count;
  }

  const isBoldItalicUnderline = (textElement: GoogleAppsScript.Document.Text, position: number) => textElement.isBold(position) &&
    textElement.isItalic(position) &&
    textElement.isUnderline(position);
  const insertBoldItalicUnderline = (arrayOfCharacters: Array<string>, position: number) => insertCharacter(arrayOfCharacters, position, "_", 4);

  const isBoldItalic = (textElement: GoogleAppsScript.Document.Text, position: number) => textElement.isBold(position) &&
    textElement.isItalic(position);
  const insertBoldItalic = (arrayOfCharacters: Array<string>, position: number) => insertCharacter(arrayOfCharacters, position, "_", 3);

  const isBold = (textElement: GoogleAppsScript.Document.Text, position: number) => textElement.isBold(position);
  const insertBold = (arrayOfCharacters: Array<string>, position: number) => insertCharacter(arrayOfCharacters, position, "*", 2);

  const isItalic = (textElement: GoogleAppsScript.Document.Text, position: number) => textElement.isItalic(position);
  const insertItalic = (arrayOfCharacters: Array<string>, position: number) => insertCharacter(arrayOfCharacters, position, "*");

  const isUnderline = (textElement: GoogleAppsScript.Document.Text, position: number) => textElement.isUnderline(position);
  const insertUnderline = (arrayOfCharacters: Array<string>, position: number) => insertCharacter(arrayOfCharacters, position, "_");

  const isStrikethrough = (textElement: GoogleAppsScript.Document.Text, position: number) => textElement.isStrikethrough(position);
  const insertStrikethrough = (arrayOfCharacters: Array<string>, position: number) => insertCharacter(arrayOfCharacters, position, "~", 2);

  const TEXT_FORMATTERS = [{
    test: isBoldItalicUnderline,
    format: insertBoldItalicUnderline,
    isExclusive: true
  }, {
    test: isBoldItalic,
    format: insertBoldItalic,
    isExclusive: true
  }, {
    test: isBold,
    format: insertBold
  }, {
    test: isItalic,
    format: insertItalic
  }, {
    test: isUnderline,
    format: insertUnderline
  }, {
    test: isStrikethrough,
    format: insertStrikethrough
  }];

  /**
   * Converts a Text element, including its formatting such as bold and italic.
   *
   * @param textElement The Text element to convert.
   *
   * @see https://leanpub.com/markua/read#text-formatting
   */
  const convertTextWithFormatting = (textElement: GoogleAppsScript.Document.Text): string => {
    let formattedStringArray = textElement.getText().split("");
    let skipIndex = 0;

    const attributeIndices = textElement.getTextAttributeIndices();
    attributeIndices.forEach((attributeIndex, index) => {
      // Opening formatting
      const openingFormatters = TEXT_FORMATTERS.filter(formatter => formatter.test(textElement, attributeIndex));
      if (openingFormatters.some(formatter => formatter.isExclusive)) {
        const exclusiveOpeningFormatter = openingFormatters.find(formatter => formatter.isExclusive);
        skipIndex += exclusiveOpeningFormatter.format(formattedStringArray, attributeIndex + skipIndex);
      } else {
        openingFormatters.forEach(formatter => {
          skipIndex += formatter.format(formattedStringArray, attributeIndex + skipIndex);
        })
      }

      // Closing formatting
      if (index > 0) {
        // In reverse order compared to the opening formatting to ensure proper Markua syntax.
        const closingFormatters = TEXT_FORMATTERS.slice().reverse().filter(formatter => formatter.test(textElement, attributeIndices[index - 1]));
        if (closingFormatters.some(formatter => formatter.isExclusive)) {
          const exclusiveClosingFormatter = closingFormatters.find(formatter => formatter.isExclusive);
          skipIndex += exclusiveClosingFormatter.format(formattedStringArray, attributeIndex + skipIndex);
        } else {
          closingFormatters.forEach(formatter => {
            skipIndex += formatter.format(formattedStringArray, attributeIndex + skipIndex);
          })
        }
      }
    });

    // If a Text element contains formatting on the last character, we need to deal with that.
    // E.g. "A text with the last word **bold**"
    // The final two asterisks in this case need to be added to adhere to the Markua spec.
    const lastCharacterIndex = textElement.getText().length;
    const closingFormatters = TEXT_FORMATTERS.slice().reverse().filter(formatter => formatter.test(textElement, lastCharacterIndex - 1));
    if (closingFormatters.some(formatter => formatter.isExclusive)) {
      const exclusiveClosingFormatter = closingFormatters.find(formatter => formatter.isExclusive);
      skipIndex += exclusiveClosingFormatter.format(formattedStringArray, lastCharacterIndex + skipIndex);
    } else {
      closingFormatters.forEach(formatter => {
        skipIndex += formatter.format(formattedStringArray, lastCharacterIndex + skipIndex);
      })
    }
    return formattedStringArray.join("");
  }

  const TEXT_CONVERTERS = [{
    test: isCode,
    convert: convertCode
  }, {
    // Catch all (keep at the end of this array)
    test: () => true,
    convert: convertTextWithFormatting
  }];

  export const convert = (textElement: GoogleAppsScript.Document.Text) => {
    const converter = TEXT_CONVERTERS.find((textConverter) => textConverter.test(textElement));
    return converter.convert(textElement);
  }
}